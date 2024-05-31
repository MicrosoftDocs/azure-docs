---
title: Security
description: Learn about security in the Flexible Server deployment option for Azure Database for PostgreSQL - Flexible Server.
author: gennadNY
ms.author: gennadyk
ms.reviewer: maghan
ms.date: 05/23/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.custom:
  - mvc
  - mode-other
ms.devlang: python
---

# Security in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Multiple layers of security are available to help protect the data on your Azure Database for PostgreSQL - Flexible Server instance. This article outlines those security options.

As organizations increasingly rely on data stored in databases to drive critical decision-making activities that drive competitive advantage, the need for solid database security measures has never been more important.
A security lapse  can trigger catastrophic consequences, including exposing confidential data, causing reputational damage to organization. 


> [!VIDEO https://learn-video.azurefd.net/vod/player?show=open-source-developer-series&ep=security-offered-by-azure-database-for-postgresql-flexible-server]

## Information protection and encryption

Azure Database for PostgreSQL - Flexible Server encrypts data in two ways:

- **Data in transit**: Azure Database for PostgreSQL - Flexible Server encrypts in-transit data with Secure Sockets Layer and Transport Layer Security (SSL/TLS). Encryption is enforced by default. For more detailed information  on connection security with SSL\TLS, see this [documentation](../flexible-server/concepts-networking-ssl-tls.md). For better security, you might choose to enable [SCRAM authentication in Azure Database for PostgreSQL - Flexible Server](how-to-connect-scram.md).

   Although **it's highly not recommended**, if needed, due to legacy client incompatibility, you have an option to disable TLS\SSL for connections to Azure Database for PostgreSQL - Flexible Server by updating the `require_secure_transport` server parameter to OFF. You can also set TLS version by setting `ssl_max_protocol_version` server parameters.
- **Data at rest**: For storage encryption, Azure Database for PostgreSQL - Flexible Server uses the FIPS 140-2 validated cryptographic module. Data is encrypted on disk, including backups and the temporary files created while queries are running.

  The service uses the AES 256-bit cipher included in Azure storage encryption, and the keys are system managed. This is similar to other at-rest encryption technologies, like transparent data encryption in SQL Server or Oracle databases. Storage encryption is always on and can't be disabled.

## Network security

When you're running Azure Database for PostgreSQL - Flexible Server, you have two main networking options:

- **Private access**: You can deploy your server into an Azure virtual network. Azure virtual networks help provide private and secure network communication. Resources in a virtual network can communicate through private IP addresses. For more information, see the [networking overview for Azure Database for PostgreSQL - Flexible Server](concepts-networking.md).

  Security rules in network security groups enable you to filter the type of network traffic that can flow in and out of virtual network subnets and network interfaces. For more information, see the [overview of network security groups](../../virtual-network/network-security-groups-overview.md).

- **Public access**: The server can be accessed through a public endpoint. The public endpoint is a publicly resolvable DNS address. Access to it's secured through a firewall that blocks all connections by default.

  IP firewall rules grant access to servers based on the originating IP address of each request. For more information, see the [overview of firewall rules](concepts-firewall-rules.md).

## Microsoft Defender for Cloud support

**[Microsoft Defender for open-source relational databases](../../defender-for-cloud/defender-for-databases-introduction.md)** detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. Defender for Cloud provides [security alerts](../../defender-for-cloud/alerts-reference.md#alerts-for-open-source-relational-databases) on anomalous activities so that you can detect potential threats and respond to them as they occur.
When you enable this plan, Defender for Cloud provides alerts when it detects anomalous database access and query patterns and suspicious database activities.

These alerts appear in Defender for Cloud's security alerts page and include:

- Details of the suspicious activity that triggered them
- The associated MITRE ATT&CK tactic
- Recommended actions for how to investigate and mitigate the threat
- Options for continuing your investigations with Microsoft Sentinel

### Microsoft Defender for Cloud and Brute Force Attacks

A brute force attack is among the most common and fairly successful hacking methods, despite being least sophisticated hacking methods. The theory behind such an attack is that if you take an infinite number of attempts to guess a password, you're bound to be right eventually. When Microsoft Defender for Cloud detects a brute force attack, it triggers an [alert](../../defender-for-cloud/defender-for-databases-introduction.md#what-kind-of-alerts-does-microsoft-defender-for-open-source-relational-databases-provide) to bring you awareness that a brute force attack took place. It also can separate simple brute force attack from brute force attack on a valid user or a successful brute force attack.

To get alerts from the Microsoft Defender plan, you'll first need to **enable it** as shown in the next section.

### Enable enhanced security with Microsoft Defender for Cloud

1. From the [Azure portal](https://portal.azure.com), navigate to Security menu in the left pane
1. Pick Microsoft Defender for Cloud
1. Select Enable in the right pane.

:::image type="content" source="media/concepts-security/defender-for-cloud-azure-portal-postgresql.png" alt-text="Screenshot of Azure portal showing how to enable Cloud Defender." lightbox="media/concepts-security/defender-for-cloud-azure-portal-postgresql.png":::

> [!NOTE]
> If you have the "open-source relational databases" feature enabled in your Microsoft Defender plan, you will observe that Microsoft Defender is automatically enabled by default for your Azure Database for PostgreSQL flexible server resource.



## Access management

The best way to manage Azure Database for PostgreSQL - Flexible Server database access permissions at scale is using the concept of [roles](https://www.postgresql.org/docs/current/user-manag.html). A role can be either a database user or a group of database users. Roles can own the database objects and assign privileges on those objects to other roles to control who has access to which objects. It's also possible to grant membership in a role to another role, thus allowing the member role to use privileges assigned to another role.
Azure Database for PostgreSQL - Flexible Server lets you grant permissions directly to the database users. **As a good security practice, it can be recommended that you create roles with specific sets of permissions based on minimum application and access requirements. You can then assign the appropriate roles to each user. Roles are used to enforce a *least privilege model* for accessing database objects.**

The Azure Database for PostgreSQL - Flexible Server instance is created with the three default roles defined. You can see these roles by running the command:

```sql
SELECT rolname FROM pg_roles;
```
The roles are listed below: 

- azure_pg_admin
- azuresu
- administrator role

While you're creating the Azure Database for PostgreSQL - Flexible Server instance, you provide credentials for an **administrator role**. This administrator role can be used to create more [PostgreSQL roles](https://www.postgresql.org/docs/current/user-manag.html).  

For example, below we can create an example user/role called 'demouser'

```sql

 CREATE USER demouser PASSWORD password123;

```
The **administrator role** should never be used by the application.

In cloud-based PaaS environments access to an Azure Database for PostgreSQL - Flexible Server superuser account is restricted to control plane operations only by cloud operators. Therefore, the `azure_pg_admin` account exists as a pseudo-superuser account. Your administrator role is a member of the `azure_pg_admin` role.  
However, the server admin account isn't part of the `azuresu` role, which has superuser privileges and is used to perform control plane operations. Since this service is a managed PaaS service, only Microsoft is part of the superuser role.

 

You can periodically audit the list of roles in your server. For example, you can connect using `psql` client and query the `pg_roles` table, which lists all the roles along with privileges such as create other roles, create databases, replication etc.

```sql

select * from pg_roles where rolname='demouser';
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

> [!IMPORTANT]
> Important to note that number of superuser only permissions, such as creation of certain **[binary-coercible implicit casts](https://www.postgresql.org/docs/current/sql-createcast.html)**, are not available with Azure Database for PostgreSQL - Flexible Server, since `azure_pg_admin` role doesn't align to permissions of PostgreSQL superuser role. 
> A **[binary-coercible cast](https://www.postgresql.org/docs/current/sql-createcast.html)** is a type of cast that does not require any function to perform the conversion, because the source and target types have the same internal representation
> Non binary-coercible casts, including containing options WITH `IN OUT` and `WITH FUNCTION` are supported.


[Audit logging in Azure Database for PostgreSQL - Flexible Server](concepts-audit.md) is also available with Azure Database for PostgreSQL - Flexible Server to track activity in your databases.





### Control schema access

Newly created databases in Azure Database for PostgreSQL - Flexible Server have a default set of privileges in the database's public schema that allow all database users and roles to create objects. To better limit application user access to the databases that you create on your Azure Database for PostgreSQL - Flexible Server instance, we recommend that you consider revoking these default public privileges. After doing so, you can then grant specific privileges for database users on a more granular basis. For example:

- To prevent application database users from creating objects in the public schema, revoke create privileges to `public` schema from `public` role.

  ```sql
  REVOKE CREATE ON SCHEMA public FROM PUBLIC;
  ```
- Next, create new database.

  ```sql
  CREATE DATABASE Test_db;
  ```
- Revoke all privileges from the PUBLIC schema on this new database.

  ```sql
  REVOKE ALL ON DATABASE Test_db FROM PUBLIC;
  ```
- Create custom role for application db users

  ```sql
  CREATE ROLE Test_db_user;
  ```
- Give database users with this role the ability to connect to the database.

  ```sql
  GRANT CONNECT ON DATABASE Test_db TO Test_db_user;
  GRANT ALL PRIVILEGES ON DATABASE Test_db TO Test_db_user;
  ```
- Create database user

  ```sql
  CREATE USER user1 PASSWORD 'Password_to_change'
  ```
- Assign role, with its connect and select privileges to user

  ```sql
  GRANT Test_db_user TO user1;
  ```
In this example, user *user1* can connect and has all privileges in our test database *Test_db*, but not any other db on the server. It would be recommended further, instead of giving this user\role *ALL PRIVILEGES* on that database and its objects, to provide more selective permissions, such as *SELECT*,*INSERT*,*EXECUTE*, etc. For more information about privileges in PostgreSQL databases, see the [GRANT](https://www.postgresql.org/docs/current/sql-grant.html) and [REVOKE](https://www.postgresql.org/docs/current/sql-revoke.html) commands in the PostgreSQL docs.

### Public schema ownership changes in PostgreSQL 15

From Postgres version 15, ownership of the public schema has been changed to the new pg_database_owner role. It enables every database owner to own the database’s public schema.  
More information can be found in [PostgreSQL release notes.](https://www.postgresql.org/docs/release/15.0/)

### PostgreSQL 16 changes with role based security

In PostgreSQL database role can have many attributes that define its privileges.One such attribute is the [**CREATEROLE** attribute](https://www.postgresql.org/docs/current/role-attributes.html), which is important to PostgreSQL database management of users and roles. In PostgreSQL 16 significant changes were introduced to this attribute.
In PostgreSQL 16, users with **CREATEROLE** attribute no longer have the ability to hand out membership in any role to anyone; instead, like other users, without this attribute, they can only hand out memberships in roles for which they possess **ADMIN OPTION**. Also, in PostgreSQL 16, the **CREATEROLE** attribute still allows a nonsuperuser the ability to provision new users, however they can only drop users that they themselves created. Attempts to drop users, which isn't create by user with **CREATEROLE** attribute, will result in an error.

PostgreSQL 16 also introduced new and improved built-in roles. New *pg_use_reserved_connections* role in PostgreSQL 16 allows the use of connection slots reserved via reserved_connections.The *pg_create_subscription* role allows superusers to create subscriptions.

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server does not allow users to be granted *pg_write_all_data* attribute, which allows user to write all data (tables, views, sequences), as if having INSERT, UPDATE, and DELETE rights on those objects, and USAGE rights on all schemas, even without having it explicitly granted. As a workaround recommended to grant similar permissions on a more finite level per database and object. 


## Row level security

[Row level security (RLS)](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) is an Azure Database for PostgreSQL - Flexible Server security feature that allows database administrators to define policies to control how specific rows of data display and operate for one or more roles. Row level security is an additional filter you can apply to an Azure Database for PostgreSQL - Flexible Server database table. When a user tries to perform an action on a table, this filter is applied before the query criteria or other filtering, and the data is narrowed or rejected according to your security policy. You can create row level security policies for specific commands like *SELECT*, *INSERT*, *UPDATE*, and *DELETE*, specify it for ALL commands. Use cases for row level security include PCI compliant implementations, classified environments, and shared hosting / multitenant applications.

Only users with `SET ROW SECURITY` rights might apply row security rights to a table. The table owner might set row security on a table. Like `OVERRIDE ROW SECURITY` this is currently an implicit right. Row-level security doesn't override existing `GRANT` permissions, it adds a finer grained level of control. For example, setting `ROW SECURITY FOR SELECT` to allow a given user to give rows would only give that user access if the user also has `SELECT` privileges on the column or table in question.

Here's an example showing how to create a policy that ensures only members of the custom created *"manager"* [role](#access-management) can access only the rows for a specific account. The code in the following example was shared in the [PostgreSQL documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html).

```sql
CREATE TABLE accounts (manager text, company text, contact_email text);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY account_managers ON accounts TO managers
    USING (manager = current_user);
```

The USING clause implicitly adds a `WITH CHECK` clause, ensuring that members of the manager role can't perform `SELECT`, `DELETE`, or `UPDATE` operations on rows that belong to other managers, and can't `INSERT` new rows belonging to another manager.
You can drop a row security policy by using DROP POLICY command, as in his example:
```sql


DROP POLICY account_managers ON accounts;
```
Although you may have dropped the policy, role manager is still not able to view any data that belong to any other manager. This is because the row-level security policy is still enabled on the accounts table. If row-level security is enabled by default, PostgreSQL uses a default-deny policy. You can disable row level security, as in example below:

```sql
ALTER TABLE accounts DISABLE ROW LEVEL SECURITY;
```


## Bypassing Row Level Security

PostgreSQL has **BYPASSRLS** and **NOBYPASSRLS** permissions, which can be assigned to a role; NOBYPASSRLS is assigned by default. 
With **newly provisioned servers** in Azure Database for PostgreSQL - Flexible Server bypassing row level security privilege (BYPASSRLS) is implemented as follows:
* For Postgres 16 and above versioned servers we follow [standard PostgreSQL 16 behavior](#postgresql-16-changes-with-role-based-security).  Nonadministrative users created by **azure_pg_admin** administrator role allows you to create roles with BYPASSRLS attribute\privilege as necessary. 
* For Postgres 15 and below versioned servers. , you can use **azure_pg_admin** user to do administrative tasks that require BYPASSRLS privilege, but can't create nonadmin users with BypassRLS privilege, since administrator role has no superuser privileges, as common in cloud based PaaS PostgreSQL services.


## Update passwords

For better security, it's a good practice to periodically rotate your admin password and database users passwords. It's recommended to use strong passwords using upper and lower cases, numbers, and special characters.

## Use SCRAM

The [Salted Challenge Response Authentication Mechanism (SCRAM)](https://datatracker.ietf.org/doc/html/rfc5802) greatly improves the security of password-based user authentication by adding several key security features that prevent rainbow-table attacks, man-in-the-middle attacks, and stored password attacks, while also adding support for multiple hashing algorithms and passwords that contain non-ASCII characters.  

In SCRAM authentication, the client participates in doing the encryption work in order to produce the proof of identity. SCRAM authentication therefore offloads some of the computation cost to its clients, which in most cases are application servers. Adopting SCRAM, in addition to stronger hash algorithm, therefore offers also protection against distributed denial-of-service (DDoS) attacks against PostgreSQL, by preventing a CPU overload of the server to compute password hashes.

If your [client driver supports SCRAM](https://wiki.postgresql.org/wiki/List_of_drivers) , you can **[setup access to Azure Database for PostgreSQL - Flexible Server using SCRAM](how-to-connect-scram.md)** as `scram-sha-256` vs. default `md5`.

### Reset administrator password

Follow the [how to guide](./how-to-manage-server-portal.md#reset-admin-password) to reset the admin password.

### Update database user password

You can use client tools to update database user passwords.  
For example,

```sql
ALTER ROLE demouser PASSWORD 'Password123!';
ALTER ROLE
```

## Related content

- [Firewall rules for IP addresses](concepts-firewall-rules.md)
- [Private access networking with Azure Database for PostgreSQL - Flexible Server](concepts-networking.md)
- [Microsoft Entra authentication](../concepts-aad-authentication.md)
