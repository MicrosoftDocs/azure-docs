---
title: 'Security in Azure Database for PostgreSQL - Flexible Server'
description: Learn about security in the Flexible Server deployment option for Azure Database for PostgreSQL.
author: gennadNY
ms.author: gennadyk
ms.service: postgresql
ms.subservice: flexible-server
ms.custom: mvc, mode-other
ms.devlang: python
ms.topic: quickstart
ms.date: 2/10/2023
---


# Security in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Multiple layers of security are available to help protect the data on your Azure Database for PostgreSQL server. This article outlines those security options.

## Information protection and encryption

Azure Database for PostgreSQL encrypts data in two ways:

- **Data in transit**: Azure Database for PostgreSQL encrypts in-transit data with Secure Sockets Layer and Transport Layer Security (SSL/TLS). Encryption is enforced by default. See this [guide](how-to-connect-tls-ssl.md) for more details. For better security, you may choose to enable [SCRAM authentication](how-to-connect-scram.md).

   Although it's not recommended, if needed, you have an option to disable TLS\SSL for connections to Azure Database for PostgreSQL - Flexible Server by updating  the `require_secure_transport` server parameter to OFF. You can also set TLS version by setting `ssl_max_protocol_version` server parameters.


- **Data at rest**: For storage encryption, Azure Database for PostgreSQL uses the FIPS 140-2 validated cryptographic module. Data is encrypted on disk, including backups and the temporary files created while queries are running. 

  The service uses the AES 256-bit cipher included in Azure storage encryption, and the keys are system managed. This is similar to other at-rest encryption technologies, like transparent data encryption in SQL Server or Oracle databases. Storage encryption is always on and can't be disabled.


## Network security

When you're running Azure Database for PostgreSQL - Flexible Server, you have two main networking options:

- **Private access**: You can deploy your server into an Azure virtual network. Azure virtual networks help provide private and secure network communication. Resources in a virtual network can communicate through private IP addresses. For more information, see the [networking overview for Azure Database for PostgreSQL - Flexible Server](concepts-networking.md).

  Security rules in network security groups enable you to filter the type of network traffic that can flow in and out of virtual network subnets and network interfaces. For more information, see the [overview of network security groups](../../virtual-network/network-security-groups-overview.md).

- **Public access**: The server can be accessed through a public endpoint. The public endpoint is a publicly resolvable DNS address. Access to it is secured through a firewall that blocks all connections by default. 

  IP firewall rules grant access to servers based on the originating IP address of each request. For more information, see the [overview of firewall rules](concepts-firewall-rules.md).

## Access management

Best way to manage PostgreSQL database access permissions at scale is using the concept of [roles](https://www.postgresql.org/docs/current/user-manag.html). A role can be either a database user or a group of database users.  Roles can own the database objects and assign privileges on those objects to other roles to control who has access to which objects. It is also possible to grant membership in a role to another role, thus allowing the member role to use privileges assigned to another role.
PostgreSQL lets you grant permissions directly to the database users. **As a good security practice, it can be recommended that you create roles with specific sets of permissions based on minimum application and access requirements. You can then assign the appropriate roles to each user.  Roles are used to enforce a *least privilege model* for accessing database objects.**

The Azure Database for PostgreSQL server is created with the 3 default roles defined. You can see these roles by running the command: 
```sql
SELECT rolname FROM pg_roles;
```
* azure_pg_admin.
* azuresu.
* administrator role.

While you're creating the Azure Database for PostgreSQL server, you provide credentials for an **administrator role**. This administrator role can be used to create more [PostgreSQL roles](https://www.postgresql.org/docs/current/user-manag.html). 
For example, below we can create an example role called *demouser*,

```SQL
postgres=> create role demouser with password 'password123';
```
The **administrator role** should never be used by the application.

In cloud-based PaaS environments access to a PostgreSQL superuser account is restricted to control plane operations only by cloud operators. Therefore, the **azure_pg_admin** account exists as a pseudo-superuser account. Your administrator role is a member of the **azure_pg_admin** role. 
However, the server admin account is not part of the **azuresu** role, which has superuser privileges and is used to perform control pane operations. Since this service is a managed PaaS service, only Microsoft is part of the superuser role.

> [!NOTE]
> Number of superuser only permissions , such as creation of certain [implicit casts](https://www.postgresql.org/docs/current/sql-createcast.html), are not available with Azure Database for PostgreSQL - Flexible Server, since azure_pg_admin role doesn't align to permissions of postgresql superuser role. 

You can periodically audit the list of roles in your server. For example, you can connect using `psql` client and query the `pg_roles` table which lists all the roles along with privileges such as create additional roles, create databases, replication etc. 

```SQL
postgres=> \x
Expanded display is on.
postgres=> select * from pg_roles where rolname='demouser';
-[ RECORD 1 ]--+---------
rolname        | demouser
rolsuper       | f
rolinherit     | t
rolcreaterole  | f
rolcreatedb    | f
rolcanlogin    | f
rolreplication | f
rolconnlimit   | -1
rolpassword    | ********
rolvaliduntil  |
rolbypassrls   | f
rolconfig      |
oid            | 24827



```

[Audit logging](concepts-audit.md) is also available with Flexible Server to track activity in your databases. 

> [!NOTE]
> Azure Database for PostgreSQL - Flexible Server currently doesn't support [Microsoft Defender for Cloud protection](../../security-center/azure-defender.md). 


### Controlling schema access

Newly created databases in PostgreSQL will have a default set of privileges in the database's public schema that allow all database users and roles to create objects. To better limit application user access to the databases  that you create on your Flexible Server, we recommend that you consider revoking these default public privileges. After doing so, you can then grant specific privileges for database users on a more granular basis. For example:

* To prevent application database users from creating objects in the public schema, revoke create privileges to *public* schema
  ```sql
  REVOKE CREATE ON SCHEMA public FROM PUBLIC;

  ```
* Next,  create new database:
```sql
CREATE DATABASE Test_db;

```
* Revoke all privileges from the PUBLIC schema on this new database.
```sql
REVOKE ALL ON DATABASE Test_db FROM PUBLIC;

```
* Create custom role for application db users
```sql
CREATE ROLE Test_db_user;
```
* Give database users with this role the ability to connect to the database.
```sql
GRANT CONNECT ON DATABASE Test_db TO Test_db_user;
GRANT ALL PRIVILEGES ON DATABASE Test_db TO Test_db_user;


```
* Create database user
```sql
CREATE ROLE user1 LOGIN PASSWORD 'Password_to_change'
```
* Assign role, with its connect and select privileges to user
```sql
GRANT Test_db_user TO user1;


```
In this example, user *user1* can connect and has all privileges in our test database *Test_db*, but not any other db on the server. It would be recommended further, instead of giving this user\role *ALL PRIVILEGES* on that database and its objects, to provide more selective permissions, such as *SELECT*,*INSERT*,*EXECUTE*, etc.  For more information about privileges in PostgreSQL databases, see the [GRANT](https://www.postgresql.org/docs/current/sql-grant.html) and [REVOKE](https://www.postgresql.org/docs/current/sql-revoke.html) commands in the PostgreSQL docs.

## Row  level security

[Row level security (RLS)](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) is a PostgreSQL security feature that allows database administrators to define policies to control how specific rows of data display and operate for one or more roles.  Row level security is an additional filter you can apply to a PostgreSQL database table. When a user tries to perform an action on a table, this filter is applied before the query criteria or other filtering, and the data is narrowed or rejected according to your security policy. You can create row level security policies for specific commands like *SELECT*, *INSERT*, *UPDATE*, and *DELETE*, specify it for ALL commands. Use cases for row level security include PCI compliant implementations, classified environments, as well as shared hosting / multi-tenant applications. 
Only users with `SET ROW SECURITY` rights may apply row security rights to a table. The table owner may set row security on a table. Like `OVERRIDE ROW SECURITY` this is currently an implicit right. Row-level security does not override existing *GRANT* permissions, it adds a finer grained level of control. For example, setting `ROW SECURITY FOR SELECT` to allow a given user to give rows would only give that user access if the user also has *SELECT* privileges on the column or table in question.

Here is an example showing how to create a policy that ensures only members of the custom created *“manager”* [role](#access-management) can access only the rows for a specific account. The code in below example was shared in the [PostgreSQL documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html).

```sql
CREATE TABLE accounts (manager text, company text, contact_email text);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY account_managers ON accounts TO managers
    USING (manager = current_user);
```
The USING clause implicitly adds a `WITH CHECK` clause, ensuring that members of the manager role cannot perform SELECT, DELETE, or UPDATE operations on rows that belong to other managers, and cannot INSERT new rows belonging to another manager.
> [!NOTE]
>  In [PostgreSQL it is possible for a user to be assigned the *BYPASSRLS* attribute by another superuser](https://www.postgresql.org/docs/current/ddl-rowsecurity.html). With this permission, a user can bypass RLS for all tables in Postgres, as is superuser. That permission cannot  be assigned in Azure Database for PostgreSQL - Flexible Server, since administrator role has no superuser privileges, as common in cloud based PaaS PostgreSQL service.


## Updating passwords

For better security, it is a good practice to periodically rotate your admin password and database user passwords. It is recommended to use strong passwords using upper and lower cases, numbers and special characters.

## Using SCRAM 
The [Salted Challenge Response Authentication Mechanism (SCRAM)](https://datatracker.ietf.org/doc/html/rfc5802) greatly improves the security of password-based user authentication by adding several key security features that prevent rainbow-table attacks, man-in-the-middle attacks, and stored password attacks, while also adding support for multiple hashing algorithms and passwords that contain non-ASCII characters. 
If your [client driver supports SCRAM](https://wiki.postgresql.org/wiki/List_of_drivers) , you can **[setup access to Azure Database for PostgreSQL - Flexible Server using SCRAM](./how-to-connect-scram.md)** as `scram-sha-256` vs. default `md5`.


### Reset administrator password

Follow the [how to guide](./how-to-manage-server-portal.md#reset-admin-password) to reset the admin password.

### Update database user password

You can use client tools to update database user passwords. 
For example,
```SQL
postgres=> alter role demouser with password 'Password123!';
ALTER ROLE
```
## Next steps
- Enable [firewall rules for IP addresses](concepts-firewall-rules.md) for public access networking.
- Learn about [private access networking with Azure Database for PostgreSQL - Flexible Server](concepts-networking.md).
- Learn about [Microsoft Entra authentication](../concepts-aad-authentication.md) in Azure Database for PostgreSQL.
