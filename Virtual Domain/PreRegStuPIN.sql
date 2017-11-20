SELECT sprapin_pin "STU_PIN"
  FROM sprapin
 WHERE     sprapin_term_code = :term_code
       AND sprapin_pidm = :stu_pidm
       AND sprapin_process_name = 'PREREG'