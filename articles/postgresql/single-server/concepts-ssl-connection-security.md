---
title: SSL/TLS - Azure Database for PostgreSQL - Single Server
description: Instructions and information on how to configure TLS connectivity for Azure Database for PostgreSQL - Single Server.
ms.service: postgresql
ms.subservice: single-server
ms.topic: conceptual
ms.author: nlarin
author: niklarin
ms.date: 06/24/2022
---

# Configure TLS connectivity in Azure Database for PostgreSQL - Single Server

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

Azure Database for PostgreSQL prefers connecting your client applications to the PostgreSQL service using Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL). Enforcing TLS connections between your database server and your client applications helps protect against "man-in-the-middle" attacks by encrypting the data stream between the server and your application.

By default, the PostgreSQL database service is configured to require TLS connection. You can choose to disable requiring TLS if your client application does not support TLS connectivity.

>[!NOTE]
> Based on the feedback from customers we have extended the root certificate deprecation for our existing Baltimore Root CA till November 30,2022(11/30/2022).

> [!IMPORTANT] 
> SSL root certificate is set to expire starting December,2022 (12/2022). Please update your application to use the [new certificate](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem). To learn more , see [planned certificate updates](concepts-certificate-rotation.md)

## Enforcing TLS connections

For all Azure Database for PostgreSQL servers provisioned through the Azure portal and CLI, enforcement of TLS connections is enabled by default.

Likewise, connection strings that are pre-defined in the "Connection Strings" settings under your server in the Azure portal include the required parameters for common languages to connect to your database server using TLS. The TLS parameter varies based on the connector, for example "ssl=true" or "sslmode=require" or "sslmode=required" and other variations.

## Configure Enforcement of TLS

You can optionally disable enforcing TLS connectivity. Microsoft Azure recommends to always enable **Enforce SSL connection** setting for enhanced security.

### Using the Azure portal

Visit your Azure Database for PostgreSQL server and select **Connection security**. Use the toggle button to enable or disable the **Enforce SSL connection** setting. Then, select **Save**.

:::image type="content" source="./media/concepts-ssl-connection-security/1-disable-ssl.png" alt-text="Connection Security - Disable Enforce TLS/SSL":::

You can confirm the setting by viewing the **Overview** page to see the **SSL enforce status** indicator.

### Using Azure CLI

You can enable or disable the **ssl-enforcement** parameter using `Enabled` or `Disabled` values respectively in Azure CLI.

```azurecli
az postgres server update --resource-group myresourcegroup --name mydemoserver --ssl-enforcement Enabled
```
### Determining SSL connections status

You can also collect all the information about your Azure Database for PostgreSQL - Single Server instance's SSL usage by process, client, and application by using the following query:
```sql
SELECT datname as "Database name", usename as "User name", ssl, client_addr, application_name, backend_type
   FROM pg_stat_ssl
   JOIN pg_stat_activity
   ON pg_stat_ssl.pid = pg_stat_activity.pid
   ORDER BY ssl;
```

## Ensure your application or framework supports TLS connections

Some application frameworks that use PostgreSQL for their database services do not enable TLS by default during installation. If your PostgreSQL server enforces TLS connections but the application is not configured for TLS, the application may fail to connect to your database server. Consult your application's documentation to learn how to enable TLS connections.

## Applications that require certificate verification for TLS connectivity

In some cases, applications require a local certificate file generated from a trusted Certificate Authority (CA) certificate file to connect securely. The certificate to connect to an Azure Database for PostgreSQL server is located at https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem. Download the certificate file and save it to your preferred location.

See the following links for certificates for servers in sovereign clouds: [Azure Government](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem), [Azure China](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem), and [Azure Germany](https://www.d-trust.net/cgi-bin/D-TRUST_Root_Class_3_CA_2_2009.crt).

### Connect using psql

The following example shows how to connect to your PostgreSQL server using the psql command-line utility. Use the `sslmode=verify-full` connection string setting to enforce TLS/SSL certificate verification. Pass the local certificate file path to the `sslrootcert` parameter.

The following command is an example of the psql connection string:

```shell
psql "sslmode=verify-full sslrootcert=BaltimoreCyberTrustRoot.crt host=mydemoserver.postgres.database.azure.com dbname=postgres user=myusern@mydemoserver"
```

> [!TIP]
> Confirm that the value passed to `sslrootcert` matches the file path for the certificate you saved.

## TLS enforcement in Azure Database for PostgreSQL Single server

Azure Database for PostgreSQL - Single server supports encryption for clients connecting to your database server using Transport Layer Security (TLS). TLS is an industry standard protocol that ensures secure network connections between your database server and client applications, allowing you to adhere to compliance requirements.

### TLS settings

Azure Database for PostgreSQL single server provides the ability to enforce the TLS version for the client connections. To enforce the TLS version, use the **Minimum TLS version** option setting. The following values are allowed for this option setting:

|  Minimum TLS setting             | Client TLS version supported                |
|:---------------------------------|-------------------------------------:|
| TLSEnforcementDisabled (default) | No TLS required                      |
| TLS1_0                           | TLS 1.0, TLS 1.1, TLS 1.2 and higher |
| TLS1_1                           | TLS 1.1, TLS 1.2 and higher          |
| TLS1_2                           | TLS version 1.2 and higher           |

For example, setting this Minimum TLS setting version to TLS 1.0 means your server will allow connections from clients using TLS 1.0, 1.1, and 1.2+. Alternatively, setting this to 1.2 means that you only allow connections from clients using TLS 1.2+ and all connections with TLS 1.0 and TLS 1.1 will be rejected.

> [!Note] 
> By default, Azure Database for PostgreSQL does not enforce a minimum TLS version (the setting `TLSEnforcementDisabled`).
>
> Once you enforce a minimum TLS version, you cannot later disable minimum version enforcement.

To learn how to set the TLS setting for your Azure Database for PostgreSQL Single server, refer to [How to configure TLS setting](how-to-tls-configurations.md).

## Cipher support by Azure Database for PostgreSQL Single server

As part of the SSL/TLS communication, the cipher suites are validated and only support cipher suits are allowed to communicate to the database server. The cipher suite validation is controlled in the [gateway layer](concepts-connectivity-architecture.md#connectivity-architecture) and not explicitly on the node itself. If the cipher suites doesn't match one of suites listed below, incoming client connections will be rejected.

### Cipher suite supported

*   TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
*   TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
*   TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
*   TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256

## Next steps

Review various application connectivity options in [Connection libraries for Azure Database for PostgreSQL](concepts-connection-libraries.md).

- Learn how to [configure TLS](how-to-tls-configurations.md)
