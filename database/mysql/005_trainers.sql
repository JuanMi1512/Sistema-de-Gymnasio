USE blue_fit;

CREATE TABLE IF NOT EXISTS trainers (
  id CHAR(36) PRIMARY KEY,
  organization_id CHAR(36) NOT NULL,
  branch_id CHAR(36) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  document_number VARCHAR(30),
  phone VARCHAR(25),
  email VARCHAR(190),
  specialties VARCHAR(500),
  availability VARCHAR(255),
  status ENUM('active','busy','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_trainer_document(organization_id,document_number),
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (branch_id) REFERENCES branches(id)
);

CREATE TABLE IF NOT EXISTS trainer_assignments (
  id CHAR(36) PRIMARY KEY,
  organization_id CHAR(36) NOT NULL,
  trainer_id CHAR(36) NOT NULL,
  member_id CHAR(36) NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  UNIQUE KEY uq_active_assignment(trainer_id,member_id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (trainer_id) REFERENCES trainers(id),
  FOREIGN KEY (member_id) REFERENCES members(id)
);
