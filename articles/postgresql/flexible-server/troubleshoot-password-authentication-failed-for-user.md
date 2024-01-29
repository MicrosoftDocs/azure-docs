---
title: Password authentication failed for user - Azure Database for PostgreSQL - Flexible Server
description: Provides resolutions for a connection error - password authentication failed for user `<user-name>`.
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: troubleshooting-error-codes
ms.author: alkuchar
author: AlicjaKucharczyk
ms.date: 01/23/2024
---

# Password authentication failed for user `<user-name>`
This article helps you solve a problem that might occur when connecting to Azure Database for PostgreSQL - Flexible Server.


## Symptoms
When attempting to connect to Azure Database for PostgreSQL - Flexible Server, you may encounter the following error message:

```bash
psql: error: connection to server at "<server-name>.postgres.database.azure.com" (x.x.x.x), port 5432 failed: FATAL:  password authentication failed for user "<user-name>"
```

This error indicates that the password provided for the user `<user-name>` is incorrect.

Following the initial password authentication error, you might see another error message indicating that the client is trying to reconnect to the server, this time without SSL encryption. The failure here is due to the server's `pg_hba.conf` configuration not permitting unencrypted connections.

```bash
connection to server at "<server-name>.postgres.database.azure.com" (x.x.x.x), port 5432 failed: FATAL:  no pg_hba.conf entry for host "y.y.y.y", user "<user-name>", database "postgres", no encryption
```

The combined error message you will receive in this scenario will look like this:

```bash
psql: error: connection to server at "<server-name>.postgres.database.azure.com" (x.x.x.x), port 5432 failed: FATAL:  password authentication failed for user "<user-name>"
connection to server at "<server-name>.postgres.database.azure.com" (x.x.x.x), port 5432 failed: FATAL:  no pg_hba.conf entry for host "y.y.y.y", user "<user-name>", database "postgres", no encryption
```


When using a `libpq` client that supports SSL, such as tools like `psql`, `pg_dump`, or `pgbench`, it is standard behavior to try connecting once with SSL and once without. This approach is not as unreasonable as it might seem, as the server could have different `pg_hba` rules for SSL and non-SSL connections. To avoid this dual attempt and specify the desired SSL mode, you can use the `sslmode` connection option in your client configuration. For instance, if you are using `libpq` variables in the bash shell, you can set the SSL mode by using the following command:

```bash
export PGSSLMODE=require
```


## Cause
The error encountered when connecting to Azure Database for PostgreSQL - Flexible Server primarily stems from issues related to password authentication:

* **Incorrect password**
The password authentication failed for user `<user-name>` error occurs when the password for the user is incorrect. This could happen due to a mistyped password, a recent password change that hasn't been updated in the connection settings, or other similar issues.

* **User or role created without a password**
Another possible cause of this error is creating a user or role in PostgreSQL without specifying a password. Executing commands like `CREATE USER <user-name>;` or `CREATE ROLE <role-name>;` without an accompanying password statement results in a user or role with no password set. Attempting to connect with such a user or role without setting a password will lead to authentication failure with password authentication failed error.

## Resolution
If you're encountering the "password authentication failed for user `<user-name>`" error, follow these steps to resolve the issue.

* **Try connecting with a different tool**
If the error comes from an application, attempt to connect to the database using a different tool, such as `psql` or pgAdmin, with the same username and password. This step helps determine if the issue is specific to the client or a broader authentication problem. Keep in mind any relevant firewall rules that might affect connectivity. For instructions on connecting using different tools, refer to the "Connect" blade in the Azure portal.

* **Change the password**
If you still encounter password authentication issues after trying a different tool, consider changing the password for the user. For the administrator user, you can change the password directly in the Azure portal as described in this link. For other users, or the administrator user under certain conditions, you can change the password from the command line. Ensure that you are logged in to the database as a user with the `CREATEROLE` attribute and the `ADMIN` option on their role. The command to change the password is:

  ```sql
  ALTER USER <user-name> WITH PASSWORD '<new-password>';
  ```

* **Set password for user or role created without one**
If the cause of the error is the creation of a user or role without a password, log into your PostgreSQL instance and set the password for the role. For roles created without the `LOGIN` privilege, make sure to grant this privilege along with setting the password:

  ```sql
  ALTER ROLE <role-name> WITH LOGIN;
  ALTER ROLE <role-name> WITH PASSWORD '<new-password>';
  ```

By following these steps, you should be able to resolve the authentication issues and successfully connect to your Azure Database for PostgreSQL - Flexible Server.







