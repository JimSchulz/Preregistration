SELECT ssbsect_sapr_code "CONSENT_REQUIRED"
  FROM ssbsect
 WHERE ssbsect_term_code = :term_code AND ssbsect_crn = :crn
UNION
SELECT '1' FROM DUAL
ORDER BY "CONSENT_REQUIRED" DESC