SELECT    gtvsdax_internal_code_group
       || '-'
       || gtvsdax_external_code
       || '-'
       || gtvsdax_translation_code
       || '-'
       || TO_CHAR (gtvsdax_reporting_date, 'YYYYMMDD')
       || CASE
             WHEN gtvsdax_concept IS NOT NULL THEN '-' || gtvsdax_concept
          END
          "PREREG_INFO",
       gtvsdax_external_code                          "PREREG_TERM",
       gtvsdax_internal_code_group                    "PREREG_TYPE",
       gtvsdax_translation_code                       "PREREG_MAX_POINTS",
       TO_CHAR (gtvsdax_reporting_date, 'YYYY-MM-DD') "PREREG_END_DATE"
  FROM gtvsdax
 WHERE     gtvsdax_internal_code = 'PREREG'
       AND gtvsdax_internal_code_group IN ('FYE', 'NEW', 'REG')
       AND gtvsdax_external_code NOT LIKE '*%'