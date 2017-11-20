SELECT stvterm_desc "TERM_LABEL", stvterm_code "TERM_VALUE"
    FROM stvterm
   WHERE    (LENGTH (:pre_reg_term) = 6 AND stvterm_code = :pre_reg_term)
         OR (LENGTH (:pre_reg_term) = 4 AND stvterm_acyr_code = :pre_reg_term)
ORDER BY stvterm_code