USE blue_fit;

INSERT INTO members (id, organization_id, branch_id, member_code, first_name, last_name, document_number, phone, email, status)
VALUES
  ('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'BF-0001', 'Ana', 'García', '70123456', '999111222', 'ana.garcia@bluefit.local', 'active'),
  ('10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'BF-0002', 'Carlos', 'Ramírez', '71234567', '999222333', 'carlos.ramirez@bluefit.local', 'active'),
  ('10000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'BF-0003', 'Lucía', 'Torres', '72345678', '999333444', 'lucia.torres@bluefit.local', 'active'),
  ('10000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'BF-0004', 'Diego', 'Flores', '73456789', '999444555', 'diego.flores@bluefit.local', 'active'),
  ('10000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'BF-0005', 'Mariana', 'Vega', '74567890', '999555666', 'mariana.vega@bluefit.local', 'active')
ON DUPLICATE KEY UPDATE
  first_name = VALUES(first_name),
  last_name = VALUES(last_name),
  phone = VALUES(phone),
  email = VALUES(email),
  status = VALUES(status),
  updated_at = CURRENT_TIMESTAMP;
