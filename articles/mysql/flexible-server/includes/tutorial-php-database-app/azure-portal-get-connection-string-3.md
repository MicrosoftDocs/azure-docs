---
author: shreyaaithal
ms.author: shaithal
ms.topic: include
ms.date: 06/19/2022
---

Create a new `MYSQL_ATTR_SSL_CA` database setting:

1. Click **New application setting**.
1. In the **Name** field, enter *MYSQL_ATTR_SSL_CA*.
1. In the **Value** field, enter */home/site/wwwroot/ssl/DigiCertGlobalRootCA.crt.pem*.
 
    This app setting points to the path of the [TLS/SSL certificate you need to access the MySQL server](../../how-to-connect-tls-ssl.md#download-the-public-ssl-certificate). It's included in the sample repository for convenience.

1. Click **OK**.
