---
title: Connectivity using SCRAM in Azure Database for PostgreSQL - Flexible Server
description: Instructions and information on how to configure and connect using SCRAM in Azure Database for PostgreSQL - Flexible Server.
ms.author: alkuchar
author: AwdotiaRomanowna
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.date: 11/30/2021
---

# SCRAM authentication in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Salted Challenge Response Authentication Mechanism (SCRAM) is a password-based mutual authentication protocol. It is a challenge-response scheme that adds several levels of security and prevents password sniffing on untrusted connections. SCRAM supports storing passwords on the server in a cryptographically hashed form which provides advanced security. 

To access the PostgreSQL database server using SCRAM method of authentication, your client libraries need to support SCRAM.  Refer to the [list of drivers](https://wiki.postgresql.org/wiki/List_of_drivers) that support SCRAM.

## Configuring SCRAM authentication

1. Change password_encryption to SCRAM-SHA-256. Currently PostgreSQL only supports SCRAM using SHA-256.
        :::image type="content" source="./media/how-to-configure-scram/1-password-encryption.png" alt-text="Enable SCRAM password encryption"::: 
2. Allow SCRAM-SHA-256 as the authentication method.
        :::image type="content" source="./media/how-to-configure-scram/2-auth-method.png" alt-text="Choose the authentication method"::: 
    >[!Important]
    > You may choose to enforce SCRAM only authentication by selecting only SCRAM-SHA-256 method. By doing so, users with MD5 authentication can longer connect to the server. Hence, before enforcing SCRAM, it is recommended to have both MD5 and SCRAM-SHA-256 as authentication methods until you update all user passwords to SCRAM-SHA-256. You can verify the authentication type for users using the query mentioned in step #7.
3. Save the changes. These are dynamic properties and do not require server restart.
4. From your Postgres client, connect to the Postgres server. For example,
   
    ```bash
    psql "host=myPGServer.postgres.database.azure.com port=5432 dbname=postgres user=myDemoUser password=MyPassword sslmode=require"

    psql (12.3 (Ubuntu 12.3-1.pgdg18.04+1), server 12.6)
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
    Type "help" for help.
    ```

5. Verify the password encryption.
   
    ```SQL
    postgres=> show password_encryption;
     password_encryption
    ---------------------
    scram-sha-256
    (1 row)
    ```

6. You can then update the password for users.

    ```SQL
    postgres=> \password myDemoUser
    Enter new password:
    Enter it again:
    postgres=>
    ```

7. You can verify user authentication types using `azure_roles_authtype()` function. 

    ``` SQL
    postgres=> SELECT * from azure_roles_authtype();
            rolename          | authtype
    ---------------------------+-----------
    azuresu                   | NOLOGIN
    pg_monitor                | NOLOGIN
    pg_read_all_settings      | NOLOGIN
    pg_read_all_stats         | NOLOGIN
    pg_stat_scan_tables       | NOLOGIN
    pg_read_server_files      | NOLOGIN
    pg_write_server_files     | NOLOGIN
    pg_execute_server_program | NOLOGIN
    pg_signal_backend         | NOLOGIN
    replication               | NOLOGIN
    myDemoUser                | SCRAM-256
    azure_pg_admin            | NOLOGIN
    srtest                    | SCRAM-256
    sr_md5                    | MD5
    (14 rows)
    ```

8. You can then connect from the client that supports SCRAM authentication to your server.

> [!Note] 
> SCRAM authentication is also supported when connected to the built-in managed [PgBouncer](concepts-pgbouncer.md). Above tutorial is valid for setting up connectivity using SCRAM authentication via built-in PgBouncer feature. 

## Next steps
- [Create and manage Azure Database for PostgreSQL - Flexible Server virtual network using Azure CLI](./how-to-manage-virtual-network-cli.md).
- Learn more about [networking in Azure Database for PostgreSQL - Flexible Server](./concepts-networking.md)
- Understand more about [Azure Database for PostgreSQL - Flexible Server firewall rules](./concepts-networking.md#public-access-allowed-ip-addresses)
