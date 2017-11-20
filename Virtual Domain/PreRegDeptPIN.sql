SELECT sa.prereg_pin "DEPT_PIN"
  FROM szvsect s INNER JOIN stvsubj_add sa ON sa.stvsubj_code = s.subj_code
 WHERE s.term_code_key = :term_code AND s.crn_key = :crn
UNION
SELECT '1' "DEPT_PIN" FROM DUAL
ORDER BY "DEPT_PIN" DESC