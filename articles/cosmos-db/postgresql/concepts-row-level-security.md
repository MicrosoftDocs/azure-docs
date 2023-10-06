---
title: Row level security – Azure Cosmos DB for PostgreSQL
description: Multi-tenant security through database roles
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: conceptual
ms.date: 10/02/2023
---

# Row-level security in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

PostgreSQL [row-level security
policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
restrict which users can modify or access which table rows. Row-level security
can be especially useful in a multi-tenant cluster. It
allows individual tenants to have full SQL access to the database while hiding
each tenant’s information from other tenants.

## Implementing for multi-tenant apps

We can implement the separation of tenant data by using a naming convention for
database roles that ties into table row-level security policies. We’ll assign
each tenant a database role in a numbered sequence: `tenant1`, `tenant2`,
etc. Tenants will connect to Azure Cosmos DB for PostgreSQL using these separate roles. Row-level
security policies can compare the role name to values in the `tenant_id`
distribution column to decide whether to allow access.

Here's how to apply the approach on a simplified events table distributed by
`tenant_id`. First [create the roles](./how-to-configure-authentication.md#configure-native-postgresql-authentication) `tenant1` and
`tenant2`. Then run the following SQL commands as the `citus` administrator
user:

```postgresql
CREATE TABLE events(
  tenant_id int,
  id int,
  type text
);

SELECT create_distributed_table('events','tenant_id');

INSERT INTO events VALUES (1,1,'foo'), (2,2,'bar');

-- assumes that roles tenant1 and tenant2 exist
GRANT select, update, insert, delete
  ON events TO tenant1, tenant2;
```

As it stands, anyone with select permissions for this table can see both rows.
Users from either tenant can see and update the row of the other tenant. We can
solve the data leak with row-level table security policies.

Each policy consists of two clauses: USING and WITH CHECK. When a user tries to
read or write rows, the database evaluates each row against these clauses.
PostgreSQL checks existing table rows against the expression specified in the
USING clause, and rows that would be created via INSERT or UPDATE against the
WITH CHECK clause.

```postgresql
-- first a policy for the system admin "citus" user
CREATE POLICY admin_all ON events
  TO citus           -- apply to this role
  USING (true)       -- read any existing row
  WITH CHECK (true); -- insert or update any row

-- next a policy which allows role "tenant<n>" to
-- access rows where tenant_id = <n>
CREATE POLICY user_mod ON events
  USING (current_user = 'tenant' || tenant_id::text);
  -- lack of CHECK means same condition as USING

-- enforce the policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
```

Now roles `tenant1` and `tenant2` get different results for their queries:

**Connected as tenant1:**

```sql
SELECT * FROM events;
```
```
┌───────────┬────┬──────┐
│ tenant_id │ id │ type │
├───────────┼────┼──────┤
│         1 │  1 │ foo  │
└───────────┴────┴──────┘
```

**Connected as tenant2:**

```sql
SELECT * FROM events;
```
```
┌───────────┬────┬──────┐
│ tenant_id │ id │ type │
├───────────┼────┼──────┤
│         2 │  2 │ bar  │
└───────────┴────┴──────┘
```
```sql
INSERT INTO events VALUES (3,3,'surprise');
/*
ERROR:  new row violates row-level security policy for table "events_102055"
*/
```

## Next steps

- Learn how to [create roles](./how-to-configure-authentication.md#configure-native-postgresql-authentication) in a cluster.
- Check out [security concepts in Azure Cosmos DB for PostgreSQL](./concepts-security-overview.md)
