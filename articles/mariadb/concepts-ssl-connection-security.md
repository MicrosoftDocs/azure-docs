---
title: SSL/TLS connectivity - Azure Database for MariaDB
description: Information for configuring Azure Database for MariaDB and associated applications to properly use SSL connections
author: shreyaaithal
ms.author: shaithal
ms.reviewer: maghan
ms.date: 04/18/2023
ms.service: mariadb
ms.topic: conceptual
---

# SSL/TLS connectivity in Azure Database for MariaDB

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

Azure Database for MariaDB supports connecting your database server to client applications using Secure Sockets Layer (SSL). Enforcing SSL connections between your database server and your client applications helps protect against "man in the middle" attacks by encrypting the data stream between the server and your application.

> [!NOTE]  
> Based on the feedback from customers we have extended the root certificate deprecation for our existing Baltimore Root CA till February 15, 2021 (02/15/2021).

> [!IMPORTANT]  
> SSL root certificate is set to expire starting February 15, 2021 (02/15/2021). Please update your application to use the [new certificate](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem). To learn more , see [planned certificate updates](concepts-certificate-rotation.md)

## Default settings

By default, the database service should be configured to require SSL connections when connecting to MariaDB.  We recommend to avoid disabling the SSL option whenever possible.

When provisioning a new Azure Database for MariaDB server through the Azure portal and CLI, enforcement of SSL connections is enabled by default.

In some cases, applications require a local certificate file generated from a trusted Certificate Authority (CA) certificate file to connect securely. Currently customers can **only use** the predefined certificate to connect to an Azure Database for MariaDB server which is located at https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem.

Similarly, the following links point to the certificates for servers in sovereign clouds: [Azure Government](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem), [Microsoft Azure operated by 21Vianet](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem), and [Azure Germany](https://www.d-trust.net/cgi-bin/D-TRUST_Root_Class_3_CA_2_2009.crt).

Connection strings for various programming languages are shown in the Azure portal. Those connection strings include the required SSL parameters to connect to your database. In the Azure portal, select your server. Under the **Settings** heading, select the **Connection strings**. The SSL parameter varies based on the connector, for example "ssl=true" or "sslmode=require" or "sslmode=required" and other variations.

To learn how to enable or disable SSL connection when developing application, refer to [How to configure SSL](howto-configure-ssl.md).

## TLS enforcement in Azure Database for MariaDB

Azure Database for MariaDB supports encryption for clients connecting to your database server using Transport Layer Security (TLS). TLS is an industry standard protocol that ensures secure network connections between your database server and client applications, allowing you to adhere to compliance requirements.

### TLS settings

Azure Database for MariaDB provides the ability to enforce the TLS version for the client connections. To enforce the TLS version, use the **Minimum TLS version** option setting. The following values are allowed for this option setting:

| Minimum TLS setting | Client TLS version supported |
| :--- | ---: |
| TLSEnforcementDisabled (default) | No TLS required |
| TLS1_0 | TLS 1.0, TLS 1.1, TLS 1.2 and higher |
| TLS1_1 | TLS 1.1, TLS 1.2 and higher |
| TLS1_2 | TLS version 1.2 and higher |

For example, setting the value of Minimum TLS setting version to TLS 1.0 means your server will allow connections from clients using TLS 1.0, 1.1, and 1.2+. Alternatively, setting this to 1.2 means that you only allow connections from clients using TLS 1.2+ and all connections with TLS 1.0 and TLS 1.1 will be rejected.

> [!NOTE]  
> By default, Azure Database for MariaDB does not enforce a minimum TLS version (the setting `TLSEnforcementDisabled`).
>  
> Once you enforce a minimum TLS version, you cannot later disable minimum version enforcement.

To learn how to set the TLS setting for your Azure Database for MariaDB, refer to [How to configure TLS setting](howto-tls-configurations.md).

## Cipher support by Azure Database for MariaDB

As part of the SSL/TLS communication, the cipher suites are validated and only support cipher suits are allowed to communicate to the database server. The cipher suite validation is controlled in the [gateway layer](concepts-connectivity-architecture.md#connectivity-architecture) and not explicitly on the node itself. If the cipher suites doesn't match one of suites listed below, incoming client connections will be rejected.

### Cipher suite supported

* TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
* TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
* TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
* TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256

## Next steps

- Learn more about [server firewall rules](concepts-firewall-rules.md)
- Learn how to [configure SSL](howto-configure-ssl.md)
- Learn how to [configure TLS](howto-tls-configurations.md)
