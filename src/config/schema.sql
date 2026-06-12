-- Jobs table: permanent record of every job in the system
CREATE TABLE IF NOT EXISTS jobs (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  type           VARCHAR(100) NOT NULL,
  payload        JSONB        NOT NULL DEFAULT '{}',
  status         VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
  priority       VARCHAR(10)  NOT NULL DEFAULT 'MEDIUM',
  attempts       INTEGER      NOT NULL DEFAULT 0,
  max_attempts   INTEGER      NOT NULL DEFAULT 3,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  scheduled_for  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  completed_at   TIMESTAMPTZ
);

-- Workers query: "give me the next PENDING job, highest priority first"
-- Without this index, every worker poll scans the entire table
CREATE INDEX IF NOT EXISTS idx_jobs_status_priority
  ON jobs(status, priority, scheduled_for);

-- Dashboard query: "show me all EMAIL jobs"
CREATE INDEX IF NOT EXISTS idx_jobs_type
  ON jobs(type);