USE blue_fit;

ALTER TABLE plans ADD COLUMN duration_months SMALLINT UNSIGNED NULL AFTER duration_days;
UPDATE plans SET duration_months=CASE
  WHEN duration_days>=360 THEN 12
  WHEN duration_days>=180 THEN 6
  WHEN duration_days>=90 THEN 3
  ELSE 1
END WHERE duration_months IS NULL;
ALTER TABLE plans MODIFY duration_months SMALLINT UNSIGNED NOT NULL;
ALTER TABLE plans DROP COLUMN duration_days;
