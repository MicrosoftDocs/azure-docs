---
title: Infrastructure double encryption - Azure portal - Azure Database for MySQL
description: Learn how to set up and manage Infrastructure double encryption for your Azure Database for MySQL.
ms.service: mysql
ms.subservice: single-server
author: mksuni
ms.author: sumuth
ms.topic: how-to
ms.date: 06/20/2022
---

# Infrastructure double encryption for Azure Database for MySQL

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Learn how to use the how set up and manage Infrastructure double encryption for your Azure Database for MySQL.

## Prerequisites

* You must have an Azure subscription and be an administrator on that subscription.
* The Azure Database for MySQL - Single Server should be on General Purpose or Memory Optimized pricing tier and on general purpose storage v2. Before you proceed further, refer limitations for [infrastructure double encryption](concepts-infrastructure-double-encryption.md#limitations).

## Create an Azure Database for MySQL server with Infrastructure Double encryption - Portal

Follow these steps to create an Azure Database for MySQL server with Infrastructure double encryption from Azure portal:

1. Select **Create a resource** (+) in the upper-left corner of the  portal.

2. Select **Databases** > **Azure Database for MySQL**. You can also enter **MySQL** in the search box to find the service.

   :::image type="content" source="./media/quickstart-create-mysql-server-database-using-azure-portal/2-navigate-to-mysql.png" alt-text="Azure Database for MySQL option":::

3. Provide the basic information of the server. Select **Additional settings** and enabled the **Infrastructure double encryption** checkbox to set the parameter.

    :::image type="content" source="./media/how-to-double-encryption/infrastructure-encryption-selected.png" alt-text="Azure Database for MySQL selections":::

4. Select **Review + create** to provision the server.

    :::image type="content" source="./media/how-to-double-encryption/infrastructure-encryption-summary.png" alt-text="Azure Database for MySQL summary":::

5. Once the server is created you can validate the infrastructure double encryption by checking the status in the **Data encryption** server blade.

    :::image type="content" source="./media/how-to-double-encryption/infrastructure-encryption-validation.png" alt-text="Azure Database for MySQL validation":::

## Create an Azure Database for MySQL server with Infrastructure Double encryption - CLI

Follow these steps to create an Azure Database for MySQL server with Infrastructure double encryption from CLI:

This example creates a resource group named `myresourcegroup` in the `westus` location.

```azurecli-interactive
az group create --name myresourcegroup --location westus
```
The following example creates a MySQL 5.7 server in West US named `mydemoserver` in your resource group `myresourcegroup` with server admin login `myadmin`. This is a **Gen 4** **General Purpose** server with **2 vCores**. This will also enabled infrastructure double encryption for the server created. Substitute the `<server_admin_password>` with your own value.

```azurecli-interactive
az mysql server create --resource-group myresourcegroup --name mydemoserver  --location westus --admin-user myadmin --admin-password <server_admin_password> --sku-name GP_Gen5_2 --version 5.7 --infrastructure-encryption <Enabled/Disabled>
```

## Next steps

 To learn more about data encryption, see [Azure Database for MySQL data Infrastructure double encryption](concepts-Infrastructure-double-encryption.md).
