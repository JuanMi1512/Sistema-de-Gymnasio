USE blue_fit;
CREATE TABLE IF NOT EXISTS membership_events (id CHAR(36) PRIMARY KEY, membership_id CHAR(36) NOT NULL, event_type VARCHAR(30) NOT NULL, notes VARCHAR(500), performed_by CHAR(36), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(membership_id) REFERENCES memberships(id));
