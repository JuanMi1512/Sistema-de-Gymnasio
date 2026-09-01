USE blue_fit;

CREATE TABLE IF NOT EXISTS product_categories (
  id CHAR(36) PRIMARY KEY, organization_id CHAR(36) NOT NULL, name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE KEY uq_category_org_name (organization_id,name),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
CREATE TABLE IF NOT EXISTS suppliers (
  id CHAR(36) PRIMARY KEY, organization_id CHAR(36) NOT NULL, name VARCHAR(150) NOT NULL,
  document_number VARCHAR(30), phone VARCHAR(25), email VARCHAR(190), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
CREATE TABLE IF NOT EXISTS products (
  id CHAR(36) PRIMARY KEY, organization_id CHAR(36) NOT NULL, category_id CHAR(36), supplier_id CHAR(36),
  sku VARCHAR(50) NOT NULL, name VARCHAR(150) NOT NULL, cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL, stock INT NOT NULL DEFAULT 0, min_stock INT NOT NULL DEFAULT 0,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_product_org_sku (organization_id,sku), FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (category_id) REFERENCES product_categories(id), FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);
CREATE TABLE IF NOT EXISTS stock_movements (
  id CHAR(36) PRIMARY KEY, organization_id CHAR(36) NOT NULL, product_id CHAR(36) NOT NULL,
  movement_type ENUM('purchase','sale','adjustment','return') NOT NULL, quantity INT NOT NULL,
  notes VARCHAR(255), performed_by CHAR(36), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id), FOREIGN KEY (product_id) REFERENCES products(id)
);
CREATE TABLE IF NOT EXISTS product_sales (
  id CHAR(36) PRIMARY KEY, organization_id CHAR(36) NOT NULL, branch_id CHAR(36) NOT NULL, member_id CHAR(36),
  customer_name VARCHAR(160), total DECIMAL(10,2) NOT NULL, method ENUM('cash','yape','plin','card','transfer') NOT NULL,
  operation_number VARCHAR(80), sold_by CHAR(36) NOT NULL, sold_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id), FOREIGN KEY (branch_id) REFERENCES branches(id),
  FOREIGN KEY (member_id) REFERENCES members(id)
);
CREATE TABLE IF NOT EXISTS product_sale_items (
  id CHAR(36) PRIMARY KEY, sale_id CHAR(36) NOT NULL, product_id CHAR(36) NOT NULL,
  quantity INT NOT NULL, unit_price DECIMAL(10,2) NOT NULL, subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (sale_id) REFERENCES product_sales(id), FOREIGN KEY (product_id) REFERENCES products(id)
);
CREATE TABLE IF NOT EXISTS trainer_packages (
  id CHAR(36) PRIMARY KEY, organization_id CHAR(36) NOT NULL, name VARCHAR(120) NOT NULL,
  sessions SMALLINT UNSIGNED NOT NULL, price DECIMAL(10,2) NOT NULL, status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
CREATE TABLE IF NOT EXISTS trainer_services (
  id CHAR(36) PRIMARY KEY, organization_id CHAR(36) NOT NULL, member_id CHAR(36) NOT NULL, trainer_id CHAR(36) NOT NULL,
  package_id CHAR(36) NOT NULL, sessions_total SMALLINT UNSIGNED NOT NULL, sessions_used SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL, balance DECIMAL(10,2) NOT NULL, status ENUM('pending','active','completed','cancelled') NOT NULL DEFAULT 'pending',
  started_at DATE NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id), FOREIGN KEY (member_id) REFERENCES members(id),
  FOREIGN KEY (trainer_id) REFERENCES trainers(id), FOREIGN KEY (package_id) REFERENCES trainer_packages(id)
);
CREATE TABLE IF NOT EXISTS trainer_sessions (
  id CHAR(36) PRIMARY KEY, service_id CHAR(36) NOT NULL, scheduled_at DATETIME NOT NULL,
  status ENUM('scheduled','completed','cancelled','no_show') NOT NULL DEFAULT 'scheduled', notes VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (service_id) REFERENCES trainer_services(id)
);

INSERT INTO product_categories (id,organization_id,name) VALUES
('20000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001','Suplementos'),
('20000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000001','Bebidas'),
('20000000-0000-4000-8000-000000000003','00000000-0000-4000-8000-000000000001','Accesorios')
ON DUPLICATE KEY UPDATE name=VALUES(name);
INSERT INTO products (id,organization_id,category_id,sku,name,cost,price,stock,min_stock) VALUES
('21000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','SUP-001','Proteína Whey 1 lb',55,85,12,3),
('21000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002','BEB-001','Agua mineral 625 ml',2,5,30,8),
('21000000-0000-4000-8000-000000000003','00000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000003','ACC-001','Guantes de entrenamiento',18,35,4,5)
ON DUPLICATE KEY UPDATE name=VALUES(name),price=VALUES(price);
INSERT INTO trainer_packages (id,organization_id,name,sessions,price) VALUES
('22000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001','Personal training · 4 sesiones',4,160),
('22000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000001','Personal training · 8 sesiones',8,280)
ON DUPLICATE KEY UPDATE name=VALUES(name),price=VALUES(price);
