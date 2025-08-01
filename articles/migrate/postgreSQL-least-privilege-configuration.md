---
title: PostgreSQL least privilege configuration
description: Learn about creating a minimally privileged PostgreSQL account for Azure Migrate, avoiding superuser access, and using a utility to simplify secure setup.
author: habibaum
ms.author: v-uhabiba
ms.service: azure-migrate 
ms.topic: concept-article 
ms.date: 08/01/2025
ms.custom: engagement-fy24 
# Customer intent: 
---

# Overview PostegreSQL

This article explains how to create a custom PostgreSQL account with the minimum permissions required for Discovery and Assessment in Azure Migrate.

Before starting discovery, configure the Azure Migrate appliance with PostgreSQL accounts to connect to your PostgreSQL instances. To avoid using superuser accounts, you can create a custom account with only the permissions needed to collect metadata for discovery and assessment. Add this custom account in the Appliance configuration for PostgreSQL Discovery and Assessment. You can use the least privileged account provisioning utility provided in this documentation to simplify the setup.

## Prerequisites

- A running and accessible PostgreSQL server
- Superuser access to the PostgreSQL instance
- An Azure Migrate project set up

### Minimum Required Privileges

To ensure security and compliance in Azure Migrate, create a PostgreSQL user with only the necessary permissions—minimizing risks of unauthorized access or unintended changes.

Based on Azure Migrate requirements, the minimum privileges needed are:

#### Database-level permissions

- `CONNECT`: Access to databases
- `pg_read_all_settings`: Read server configuration parameters
- `pg_read_all_stats`: Access to database statistics
- `pg_monitor`: Monitor database performance metrics

### SQL Script Implementation

Save the following content as `CreateUser.sql`:

```sql
-- PostgreSQL Script to Create a Least-Privilege User for Azure Migrate
-- Usage: Replace :username and :password with actual values when executing.
-- Parameters:
--   :username - The username for the new user
--   :password - The password for the new user

-- Check if the user already exists
SELECT CASE
    WHEN EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'username')
        THEN 'User ' || :'username' || ' already exists, skipping creation'
    ELSE
        'User ' || :'username' || ' does not exist, proceeding with creation'
END AS user_check;

-- Only proceed if user doesn't exist
SELECT NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'username') AS should_create \gset
\if :should_create

BEGIN;

-- Create the user with minimal privileges
CREATE USER :"username" WITH PASSWORD :'password' LOGIN
    NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;

-- Grant CONNECT privilege on all non-template databases
SELECT 'GRANT CONNECT ON DATABASE ' || quote_ident(datname) || ' TO ' || :'username' || ';'
FROM pg_database WHERE datistemplate = false; \gexec

-- Grant required monitoring and read permissions
GRANT pg_read_all_settings TO :"username";
GRANT pg_read_all_stats TO :"username";
GRANT pg_monitor TO :"username";

-- Log the user creation
SELECT 'Azure Migrate user ' || :'username' || ' created successfully with least privileges.' AS result;

COMMIT;

\endif

-- Usage instructions:
--   Replace :username and :password with actual values using psql variables:
--   psql -v username=myuser -v password=mypassword -f CreateUser.sql

```

>[Note!] 
> This user has only the minimum privileges required for Azure Migrate discovery and assessment.
> - The user cannot create databases, roles, or replicate.
> - Always use strong passwords and follow your organization's security policies.

## Usage instructions

Follow these steps to use the provided SQL script:

1. Save the script as `CreateUser.sql`.
2. Replace the placeholders for username and password with your desired values using `psql` variables.


### Execute the script

Run the script using the PostgreSQL command-line tool (`psql`) with superuser privileges. Replace the placeholders with your actual values:

```sh
psql -h <hostname> -p <port> -d <database> -U <superuser> \
    -v username=azure_migrate_user \
    -v password='your_secure_password' \
    -f CreateUser.sql
```

### Verify User Creation

To confirm the user was created and assigned the correct privileges, run the following queries:

```sql
-- Check if the user exists and review key attributes
SELECT usename, usecreatedb, usesuper, userepl
FROM pg_catalog.pg_user
WHERE usename = 'azure_migrate_user';
```

The result should show `false` for `usecreatedb`, `usesuper`, and `userepl`.

### Verify granted role-based privileges

Check that the user has been granted the necessary monitoring roles by running the following queries. This ensures the account has only the required permissions for Azure Migrate operations.

```sql
-- Verify the user exists
SELECT rolname
FROM pg_roles
WHERE rolname = 'azure_migrate_user';
```

```sql
-- Check membership in monitoring roles
SELECT r.rolname AS granted_role
FROM pg_auth_members m
JOIN pg_roles r ON m.roleid = r.oid
WHERE m.member = (SELECT oid FROM pg_roles WHERE rolname = 'azure_migrate_user');
```
After running these queries, you should see that the user exists and has only the required permissions for Azure Migrate discovery and assessment.

## Considerations

Use a least-privilege PostgreSQL account exclusively for Azure Migrate, regularly review permissions, rotate credentials, monitor activity, and disable the account when no longer needed.

- Replace `<USERNAME>` and `<PASSWORD>` with your chosen username and a strong password for the least-privilege user.
- Run the script with superuser privileges, as creating users and assigning roles requires elevated access.
- Confirm that your PostgreSQL instance is running and accessible before executing the script.
- Test the script in a development or staging environment prior to production use.
- Follow your organization's security best practices for password complexity and management.
- After script execution, review the granted permissions to ensure they meet your security requirements.
- If you encounter issues, consult the PostgreSQL documentation or contact your database administrator for support.
