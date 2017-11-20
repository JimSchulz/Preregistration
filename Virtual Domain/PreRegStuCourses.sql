-- Query

-- PreRegStuCourses

SELECT sfrstcr_term_code           "TERM_CODE",
       (SELECT stvterm_desc
          FROM stvterm
         WHERE stvterm_code = sfrstcr_term_code)
          "TERM_DESC",
       sfrstcr_crn                 "CRN",
       (SELECT subj_code || crse_number || ' ' || seq_number_key || schd_code
          FROM szvsect
         WHERE crn_key = sfrstcr_crn AND term_code_key = sfrstcr_term_code)
          "COURSE_ID",
       (SELECT s.title_long
          FROM szvsect s
         WHERE     s.term_code_key = sfrstcr_term_code
               AND s.crn_key = sfrstcr_crn)
          "TITLE",
       (SELECT CASE
                  WHEN TO_CHAR (credit_hours, 999.99) = '    .00'
                  THEN
                     '   0.00'
                  ELSE
                     TO_CHAR (credit_hours, 999.99)
               END
          FROM szvsect
         WHERE term_code_key = sfrstcr_term_code AND crn_key = sfrstcr_crn)
          "UNITS",
       (SELECT SUBSTR (
                  DECODE (ptrm_code,
                          NULL, NULL,
                          f_student_get_desc ('STVPTRM', ptrm_code, 30)),
                  1,
                  3)
          FROM szvsect
         WHERE crn_key = sfrstcr_crn AND term_code_key = sfrstcr_term_code)
          "BLOCK",
       sfrstcr_points              "POINTS",
       (SELECT    CASE WHEN s.instr1 IS NOT NULL THEN s.instr1 END
               || CASE WHEN s.instr2 IS NOT NULL THEN ' - ' || s.instr2 END
               || CASE WHEN s.instr3 IS NOT NULL THEN ' - ' || s.instr3 END
               || CASE WHEN s.instr4 IS NOT NULL THEN ' - ' || s.instr4 END
          FROM szvsect s
         WHERE     s.term_code_key = sfrstcr_term_code
               AND s.crn_key = sfrstcr_crn)
          "INSTRUCTOR",
       (SELECT SUBSTR (
                  DECODE (gmod_code,
                          NULL, NULL,
                          f_student_get_desc ('STVGMOD', gmod_code, 30)),
                  1,
                  30)
          FROM zsfvstc1
         WHERE     pidm_key = sfrstcr_pidm
               AND term_code_key = sfrstcr_term_code
               AND crn_key = sfrstcr_crn)
          "TRACKLABEL",
       sfrstcr_gmod_code           "TRACKVALUE",
       (SELECT SUBSTR (
                  DECODE (rsts_code,
                          NULL, NULL,
                          f_student_get_desc ('STVRSTS', rsts_code, 30)),
                  1,
                  30)
          FROM zsfvstc1
         WHERE     pidm_key = sfrstcr_pidm
               AND term_code_key = sfrstcr_term_code
               AND crn_key = sfrstcr_crn)
          "REG_STATUS",
       (SELECT ptrm_code
          FROM szvsect
         WHERE crn_key = sfrstcr_crn AND term_code_key = sfrstcr_term_code)
          "BLOCKVALUE",
       ROWIDTOCHAR (sfrstcr.ROWID) id
  FROM sfrstcr
 WHERE     sfrstcr_pidm = :stu_pidm
       AND (       LENGTH (:pre_reg_term) = 6
               AND sfrstcr_term_code = :pre_reg_term
            OR     LENGTH (:pre_reg_term) = 4
               AND SUBSTR (sfrstcr_term_code, 1, 4) = :pre_reg_term)
       AND sfrstcr_rsts_code = 'PR'
UNION
SELECT ''                   "TERM_CODE",
       ''                   "TERM_DESC",
       ''                   "CRN",
       ''                   "COURSE_ID",
       ''                   "TITLE",
       ''                   "UNITS",
       'Total'              "BLOCK",
       SUM (sfrstcr_points) "POINTS",
       ''                   "INSTRUCTOR",
       ''                   "TRACKLABEL",
       ''                   "TRACKVALUE",
       ''                   "REG_STATUS",
       ''                   "BLOCKVALUE",
       'XXX'                id
  FROM sfrstcr
 WHERE     sfrstcr_pidm = :stu_pidm
       AND (       LENGTH (:pre_reg_term) = 6
               AND sfrstcr_term_code = :pre_reg_term
            OR     LENGTH (:pre_reg_term) = 4
               AND SUBSTR (sfrstcr_term_code, 1, 4) = :pre_reg_term)
       AND sfrstcr_rsts_code = 'PR'
ORDER BY "TERM_CODE", "BLOCK"

-- Post

BEGIN
   INSERT INTO saturn.sfrstcr (sfrstcr_term_code,
                               sfrstcr_pidm,
                               sfrstcr_rsts_code,
                               sfrstcr_rsts_date,
                               sfrstcr_gmod_code,
                               sfrstcr_add_date,
                               sfrstcr_activity_date,
                               sfrstcr_levl_code,
                               sfrstcr_camp_code,
                               sfrstcr_error_flag,
                               sfrstcr_credit_hr,
                               sfrstcr_bill_hr,
                               sfrstcr_user_id,
                               sfrstcr_reg_seq,
                               sfrstcr_crn,
                               sfrstcr_ptrm_code,
                               sfrstcr_points,
                               sfrstcr_reserved_key,
                               sfrstcr_credit_hr_hold,
                               sfrstcr_bill_hr_hold)
           VALUES (
                     :term_code,
                     :stu_pidm,
                     'PR',
                     SYSDATE,
                     :gmod_code,
                     SYSDATE,
                     SYSDATE,
                     'UG',
                     'CC',
                     'L',
                     0,
                     0,
                     'WWW_USER',
                     (SELECT COUNT (*) + 1
                        FROM sfrstcr
                       WHERE     sfrstcr_term_code = :term_code
                             AND sfrstcr_pidm = :stu_pidm
                             AND sfrstcr_rsts_code = 'PR'),
                     :crn,
                     (SELECT ptrm_code
                        FROM szvsect
                       WHERE crn_key = :crn AND term_code_key = :term_code),
                     :points,
                     (SELECT '##################################################################################'
                        FROM ssbsect
                       WHERE     ssbsect_term_code = :term_code
                             AND ssbsect_crn = :crn
                             AND ssbsect_reserved_ind = 'Y'),
                     (SELECT units
                        FROM as_cc_courses
                       WHERE term_code_key = :term_code AND crn_key = :crn),
                     (SELECT units
                        FROM as_cc_courses
                       WHERE term_code_key = :term_code AND crn_key = :crn));

   INSERT INTO saturn.sfrareg (sfrareg_pidm,
                               sfrareg_term_code,
                               sfrareg_crn,
                               sfrareg_extension_number,
                               sfrareg_rsts_code,
                               sfrareg_start_date,
                               sfrareg_completion_date,
                               sfrareg_fee_waiver_ind,
                               sfrareg_sapr_override_ind,
                               sfrareg_activity_date,
                               sfrareg_user_id,
                               sfrareg_rsts_date)
        VALUES (:stu_pidm,
                :term_code,
                :crn,
                0,
                'PR',
                (SELECT NVL (start_date, ptrm_start_date)
                   FROM as_cc_courses
                  WHERE term_code_key = :term_code AND crn_key = :crn),
                (SELECT NVL (end_date, ptrm_end_date)
                   FROM as_cc_courses
                  WHERE term_code_key = :term_code AND crn_key = :crn),
                'N',
                'N',
                SYSDATE,
                'WWW_USER',
                SYSDATE);
END;

-- Delete

BEGIN
   DELETE FROM sfrstcr
         WHERE ROWID = CHARTOROWID (:id);

   DELETE FROM sfrareg
         WHERE sfrareg_pidm = :stu_pidm AND sfrareg_term_code = :TERM_CODE;
END;

-- Update

BEGIN
   UPDATE sfrstcr
      SET sfrstcr_points = :POINTS, 
          sfrstcr_gmod_code = :TRACKVALUE
    WHERE ROWID = CHARTOROWID (:id);
END;