---
title: Password authentication failed for user - Azure Database for PostgreSQL - Flexible Server
description: Provides resolutions for a connection error - password authentication failed for user `<user-name>`.
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: troubleshooting-error-codes
---

# Password authentication failed for user `<user-name>`
This article helps you solve a problem that might occur when connecting to Azure Database for PostgreSQL - Flexible Server.


## Symptoms
When attempting to connect to Azure Database for PostgreSQL - Flexible Server, you may encounter the following error message:

> psql: error: connection to server at "\<server-name\>.postgres.database.azure.com" (x.x.x.x), port 5432 failed: FATAL:  password authentication failed for user "\<user-name\>"

This error indicates that the password provided for the user `<user-name>` is incorrect.

Following the initial password authentication error, you might see another error message indicating that the client is trying to reconnect to the server, this time without SSL encryption. The failure here is due to the server's `pg_hba.conf` configuration not permitting unencrypted connections.


> connection to server at "\<server-name\>.postgres.database.azure.com" (x.x.x.x), port 5432 failed: FATAL:  no pg_hba.conf entry for host "y.y.y.y", user "\<user-name\>", database "postgres", no encryption


When using a `libpq` client that supports SSL, such as tools like `psql`, `pg_dump`, or `pgbench`, it's standard behavior to try connecting once with SSL and once without. The reason for this approach is that the server can have different `pg_hba` rules for SSL and non-SSL connections.
The combined error message you receive in this scenario looks like this:


> psql: error: connection to server at "\<server-name\>.postgres.database.azure.com" (x.x.x.x), port 5432 failed: FATAL:  password authentication failed for user "\<user-name\>"
connection to server at "\<server-name\>.postgres.database.azure.com" (x.x.x.x), port 5432 failed: FATAL:  no pg_hba.conf entry for host "y.y.y.y", user "\<user-name\>", database "postgres", no encryption


To avoid this dual attempt and specify the desired SSL mode, use the `sslmode` connection option in your client configuration. For instance, if you're using `libpq` variables in the bash shell, you can set the SSL mode by using the following command:

```bash
export PGSSLMODE=require
```


## Cause
The error encountered when connecting to Azure Database for PostgreSQL - Flexible Server primarily stems from issues related to password authentication:

* **Incorrect password**
The password authentication failed for user `<user-name>` error occurs when the password for the user is incorrect. This could happen due to a mistyped password, a recent password change that hasn't been updated in the connection settings, or other similar issues.

* **User or role created without a password**
Another possible cause of this error is creating a user or role in PostgreSQL without specifying a password. Executing commands like `CREATE USER <user-name>` or `CREATE ROLE <role-name>` without an accompanying password statement results in a user or role with no password set. Attempting to connect with these kinds of users or roles without setting a password will lead to authentication failure with password authentication failed error.

* **Potential security breach**
If the authentication failure is unexpected, particularly if there are multiple failed attempts recorded, it could indicate a potential security breach. Unauthorized access attempts might trigger such errors. 

## Resolution
If you're encountering the "password authentication failed for user `<user-name>`" error, follow these steps to resolve the issue.

* **Try connecting with a different tool**

  If the error comes from an application, attempt to connect to the database using a different tool, such as `psql` or pgAdmin, with the same username and password. This step helps determine if the issue is specific to the client or a broader authentication problem. Keep in mind any relevant firewall rules that might affect connectivity. For instructions on connecting using different tools, refer to the "Connect" blade in the Azure portal.

* **Change the password**

  If you still encounter password authentication issues after trying a different tool, consider changing the password for the user. For the administrator user, you can change the password directly in the Azure portal as described in this [link](how-to-manage-server-portal.md#reset-admin-password). For other users, or the administrator user under certain conditions, you can change the password from the command line. Ensure that you're logged in to the database as a user with the `CREATEROLE` attribute and the `ADMIN` option on their role. The command to change the password is:

  ```sql
  ALTER USER <user-name> PASSWORD '<new-password>';
  ```

* **Set password for user or role created without one**

  If the cause of the error is the creation of a user or role without a password, log in to your PostgreSQL instance and set the password for the role. For roles created without the `LOGIN` privilege, make sure to grant this privilege along with setting the password:

  ```sql
  ALTER ROLE <role-name> LOGIN;
  ALTER ROLE <role-name> PASSWORD '<new-password>';
  ```
  
* **If you suspect a potential security breach**

  If you suspect a potential security breach is causing unauthorized access to your Azure Database for PostgreSQL - Flexible Server, follow these steps to address the issue:

    1. **Enable log capturing**
    If log capturing isn't already on, get it set up now. Log capturing key for keeping an eye on database activities and catching any odd access patterns. There are several ways to do this, including Azure Monitor Log Analytics and server logs, which help store and analyze database event logs.
       * **Log Analytics**, Check out the setup instructions for Azure Monitor Log Analytics here: [Configure and access logs in Azure Database for PostgreSQL - Flexible Server](how-to-configure-and-access-logs.md).
       * **Server logs**, For hands-on log management, head over to the Azure portal's server logs section here: [Enable, list and download server logs for Azure Database for PostgreSQL - Flexible Server](how-to-server-logs-portal.md).

    2. **Identify the attacker's IP address**
       * Review the logs to find the IP address from which the unauthorized access attempts are being made. If the attacker is using a `libpq`-based tool, you'll see the IP address in the log entry associated with the failed connection attempt:
         > connection to server at "\<server-name\>.postgres.database.azure.com" (x.x.x.x), port 5432 failed: FATAL: no pg_hba.conf entry for host "y.y.y.y", user "\<user-name\>", database "postgres", no encryption
      
            In this example, `y.y.y.y` is the IP address from which the attacker is trying to connect.

       * **Modify the `log_line_prefix`**
       To improve logging and make it easier to troubleshoot, you should modify the `log_line_prefix` parameter in your PostgreSQL configuration to include the remote host's IP address. To log the remote host name or IP address, add the `%h` escape code to your `log_line_prefix`.
            
         For instance, you can change your `log_line_prefix` to the following format for comprehensive logging:

          ```bash
          log_line_prefix = '%t [%p]: [%l-1] db=%d,user=%u,app=%a,client=%h '
          ```
      
          This format includes:
      
          * `%t` for the timestamp of the event
          * `%p` for the process ID
          * `[%l-1]` for the session line number
          * `%d` for the database name
          * `%u` for the user name
          * `%a` for the application name
          * `%h` for the client IP address
         
      
          By using this log line prefix, you're able to track the time, process ID, user, application, and client IP address associated with each log entry, providing valuable context for each event in the server log.

    3. **Block the attacker's IP address**
    Dig into the logs to spot any suspicious IP addresses that keep showing up in unauthorized access attempts. Once you find these IPs, immediately block them in your firewall settings. This cuts off their access and prevent any more unauthorized attempts. Additionally, review your firewall rules to ensure they're not too permissive. Overly broad rules can expose your database to potential attacks. Limit access to only known and necessary IP ranges.
  


By following these steps, you should be able to resolve the authentication issues and successfully connect to your Azure Database for PostgreSQL - Flexible Server. If you're still facing issues after following the guidance provided, please don't hesitate to [file a support ticket](../../azure-portal/supportability/how-to-create-azure-support-request.md).







