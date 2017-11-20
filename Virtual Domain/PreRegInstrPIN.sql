SELECT sprapin_pin "INSTR_PIN"
  FROM sirasgn INNER JOIN sprapin ON sprapin_pidm = sirasgn_pidm
 WHERE     sirasgn_term_code = :term_code
       AND sirasgn_crn = :crn
       AND sprapin_term_code = (SELECT MAX (b.sprapin_term_code)
                                  FROM sprapin b
                                 WHERE b.sprapin_pidm = sprapin_pidm)
UNION
SELECT '1' FROM DUAL
ORDER BY "INSTR_PIN" DESC