-- PreRegEdits

SELECT TO_CHAR (COUNT (*))"EDIT_MSG"      -- If count is zero then Invalid CRN
  FROM as_cc_courses c
 WHERE     c.crn_key = :crn
       AND (   LENGTH (:term_code) = 6 AND c.term_code_key = :term_code
            OR     LENGTH (:term_code) = 4
               AND SUBSTR (c.term_code_key, 1, 4) = :term_code)
UNION
SELECT ssbsect_term_code "EDIT_MSG"  -- If edits pass then CRN's Term Returned
  FROM ssbsect
 WHERE     ssbsect_crn = :crn
       AND (   LENGTH (:term_code) = 6 AND ssbsect_term_code = :term_code
            OR     LENGTH (:term_code) = 4
               AND SUBSTR (ssbsect_term_code, 1, 4) = :term_code)
UNION
SELECT 'You are already preregistered for CRN ' || sfrstcr_crn || '.'
          "EDIT_MSG"
  FROM sfrstcr
 WHERE     sfrstcr_term_code = :term_code
       AND sfrstcr_pidm = :stu_pidm
       AND sfrstcr_crn = :crn
       AND sfrstcr_rsts_code = 'PR'
UNION
SELECT    'Already completed CRN '
       || sfrstcr_crn
       || ', please see the registrars office.'
          "EDIT_MSG"
  FROM sfrstcr
 WHERE     sfrstcr_pidm = :stu_pidm
       AND sfrstcr_crn = :crn
       AND sfrstcr_grde_date IS NOT NULL
UNION
SELECT    'You are already registered or waitlisted for CRN '
       || sfrstcr_crn
       || '.'
          "EDIT_MSG"
  FROM sfrstcr
 WHERE     sfrstcr_term_code = :term_code
       AND sfrstcr_pidm = :stu_pidm
       AND sfrstcr_crn = :crn
       AND sfrstcr_rsts_code IN ('RE', 'WL')
UNION
SELECT    'You have previously dropped CRN '
       || sfrstcr_crn
       || '. Please see the Registrars Office.'
          "EDIT_MSG"
  FROM sfrstcr
 WHERE     sfrstcr_term_code = :term_code
       AND sfrstcr_pidm = :stu_pidm
       AND sfrstcr_crn = :crn
       AND sfrstcr_rsts_code = 'DD'
UNION
SELECT    'You are already preregistered for a course in block '
       || (SELECT stvptrm_desc
             FROM stvptrm
            WHERE stvptrm_code = sfrstcr_ptrm_code)
       || '.'
          "EDIT_MSG"
  FROM sfrstcr
 WHERE     sfrstcr_term_code = :term_code
       AND sfrstcr_pidm = :stu_pidm
       AND sfrstcr_rsts_code = 'PR'
       AND sfrstcr_ptrm_code =
              (SELECT ssbsect_ptrm_code
                 FROM ssbsect
                WHERE ssbsect_term_code = :term_code AND ssbsect_crn = :crn)
UNION
SELECT 'You are not permitted to preregister at this time. Please contact the Registrars Office'
          "EDIT_MSG"
  FROM sgbstdn
 WHERE     sgbstdn_pidm = :stu_pidm
       AND sgbstdn_admt_code NOT IN ('FF', 'WS')
       AND sgbstdn_term_code_admit <> :term_code
       AND sgbstdn_styp_code NOT IN ('F', 'T', 'R')
UNION
SELECT 'You may only take one block off per term. Please see Instructions for link to Student Time Off Policy.'
          "EDIT_MSG"                                          -- Student Sched
  FROM baninst1.as_cc_student_course_in_prog scip
 WHERE     scip.academic_period = :term_code
       AND scip.person_uid = :stu_pidm
       AND UPPER (scip.course_title_long) LIKE '%TAKING A BLOCK OFF%'
       AND EXISTS
              (SELECT 'Y'                                       -- CRN Entered
                 FROM as_cc_courses c
                WHERE     c.term_code_key = :term_code
                      AND c.crn_key = :crn
                      AND UPPER (c.title_long) LIKE '%TAKING A BLOCK OFF%')
UNION
SELECT 'First-Year and Sophmore students are not permitted a block off. Please see Instructions for link to Student Time Off Policy.'
          "EDIT_MSG"                                            -- CRN Entered
  FROM as_cc_courses c
 WHERE     c.term_code_key = :term_code
       AND c.crn_key = :crn
       AND UPPER (c.title_long) LIKE '%TAKING A BLOCK OFF%'
       AND EXISTS
              (SELECT 'Y'                -- Student is first-year or sophomore
                 FROM DUAL
                WHERE f_class_calc_fnc (:stu_pidm, 'UG', :term_code) IN
                         ('1', '2'))
UNION
SELECT 'Transfer students are not permitted a block off until they reach 16 overall units and 8 CC Units. Please see Instructions for link to Student Time Off Policy.'
          "EDIT_MSG"
  FROM as_cc_student_data sd
 WHERE     sd.term_code_key = :term_code
       AND sd.pidm_key = :stu_pidm
       AND sd.stst_code = 'AS'
       AND sd.admt_code = 'TR'
       AND sd.clas_code IN ('3', '4')
       AND (   sd.overall_lgpa_hours_earned < 16
            OR sd.inst_lgpa_hours_earned < 8)
       AND EXISTS
              (SELECT 'Y'
                 FROM as_cc_courses c
                WHERE     c.term_code_key = :term_code
                      AND c.crn_key = :crn
                      AND UPPER (c.title_long) LIKE '%TAKING A BLOCK OFF%')
ORDER BY "EDIT_MSG" DESC