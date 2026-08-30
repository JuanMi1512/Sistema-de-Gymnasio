USE blue_fit;

ALTER TABLE memberships MODIFY status ENUM('pending','active','expired','frozen','suspended','cancelled') NOT NULL DEFAULT 'pending';
CREATE INDEX idx_membership_member_status ON memberships(member_id,status,end_date);
CREATE INDEX idx_payment_org_date ON payment_records(organization_id,paid_at);
CREATE INDEX idx_checkin_org_date ON checkins(organization_id,checkin_at);
