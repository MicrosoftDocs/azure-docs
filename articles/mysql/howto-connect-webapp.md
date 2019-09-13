---
title: Connect existing Azure App Service to Azure Database for MySQL
description: Instructions for how to properly connect an existing Azure App Service to Azure Database for MySQL
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 5/21/2019
---

# Connect an existing Azure App Service to Azure Database for MySQL server
This topic explains how to connect an existing Azure App Service to your Azure Database for MySQL server.

## Before you begin
Sign in to the [Azure portal](https://portal.azure.com). Create an Azure Database for MySQL server. For details, refer to [How to create Azure Database for MySQL server from Portal](quickstart-create-mysql-server-database-using-azure-portal.md) or [How to create Azure Database for MySQL server using CLI](quickstart-create-mysql-server-database-using-azure-cli.md).

Currently there are two solutions to enable access from an Azure App Service to an Azure Database for MySQL. Both solutions involve setting up server-level firewall rules.

## Solution 1 - Allow Azure services
Azure Database for MySQL provides access security using a firewall to protect your data. When connecting from an Azure App Service to Azure Database for MySQL server, keep in mind that the outbound IPs of App Service are dynamic in nature. Choosing the "Allow access to Azure services" option will allow the app service to connect to the MySQL server.

1. On the MySQL server blade, under the Settings heading, click **Connection Security** to open the Connection Security blade for Azure Database for MySQL.

   ![Azure portal - click Connection Security](./media/howto-connect-webapp/1-connection-security.png)

2. Select **ON** in **Allow access to Azure services**, then **Save**.
   ![Azure portal - Allow Azure access](./media/howto-connect-webapp/allow-azure.png)

## Solution 2 - Create a firewall rule to explicitly allow outbound IPs
You can explicitly add all the outbound IPs of your Azure App Service.

1. On the App Service Properties blade, view your **OUTBOUND IP ADDRESS**.

   ![Azure portal - View outbound IPs](./media/howto-connect-webapp/2_1-outbound-ip-address.png)

2. On the MySQL Connection security blade, add outbound IPs one by one.

   ![Azure portal - Add explicit IPs](./media/howto-connect-webapp/2_2-add-explicit-ips.png)

3. Remember to **Save** your firewall rules.

Though the Azure App service attempts to keep IP addresses constant over time, there are cases where the IP addresses may change. For example, this can occur when the app recycles or a scale operation occurs, or when new computers are added in Azure regional data centers to increase capacity. When the IP addresses change, the app could experience downtime in the event it can no longer connect to the MySQL server. Keep this consideration in mind when choosing one of the preceding solutions.

## SSL configuration
Azure Database for MySQL has SSL enabled by default. If your application is not using SSL to connect to the database, then you need to disable SSL on the MySQL server. For details on how to configure SSL, see [Using SSL with Azure Database for MySQL](howto-configure-ssl.md).

### Django (PyMySQL)
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'quickstartdb',
        'USER': 'myadmin@mydemoserver',
        'PASSWORD': 'yourpassword',
        'HOST': 'mydemoserver.mysql.database.azure.com',
        'PORT': '3306',
        'OPTIONS': {
            'ssl': {'ssl-ca': '/var/www/html/BaltimoreCyberTrustRoot.crt.pem'}
        }
    }
}
```

## Next steps
For more information about connection strings, refer to [Connection Strings](howto-connection-string.md).
