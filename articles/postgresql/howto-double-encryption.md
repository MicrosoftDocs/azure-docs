---
title: Infrastructure double encryption - Azure portal - Azure Database for PostgreSQL
description: Learn how to set up and manage Infrastructure double encryption for your Azure Database for PostgreSQL.
author: mksuni
ms.author: sumuth
ms.service: postgresql
ms.topic: how-to
ms.date: 06/30/2020
---

# Infrastructure double encryption for Azure Database for PostgreSQL

Learn how to use the how set up and manage Infrastructure double encryption for your Azure Database for PostgreSQL.

## Prerequisites

* You must have an Azure subscription and be an administrator on that subscription.

## Create an Azure Database for PostgreSQL server with Infrastructure Double encryption - Portal

Follow these steps to create an Azure Database for MySQL server with Infrastructure double encryption from Azure portal:

1. Select **Create a resource** (+) in the upper-left corner of the  portal.

2. Select **Databases** > **Azure Database for PostgreSQL**. You can also enter PostgreSQL in the search box to find the service. Enabled the **Single server** deployment option.

   :::image type="content" source="./media/quickstart-create-database-portal/1-create-database.png" alt-text="The Azure Database for PostgreSQL in menu":::

3. Provide the basic information of the server. Select **Additional settings** and enabled the **Infrastructure double encryption** checkbox to set the parameter.

    :::image type="content" source="./media/howto-infrastructure-double-encryption/infrastructure-encryption-selected.png" alt-text="Azure Database for PostgreSQL selections":::

4. Select **Review + create** to provision the server.

    :::image type="content" source="./media/howto-infrastructure-double-encryption/infrastructure-encryption-summary.png" alt-text="Azure Database for PostgreSQL summary":::

5. Once the server is created you can validate the infrastructure double encryption by checking the status in the **Data encryption** server blade.

    :::image type="content" source="./media/howto-infrastructure-double-encryption/infrastructure-encryption-validation.png" alt-text="Azure Database for MySQL validation":::

## Create an Azure Database for PostgreSQL server with Infrastructure Double encryption - CLI

Follow these steps to create an Azure Database for MySQL server with Infrastructure double encryption from CLI:

This example creates a resource group named `myresourcegroup` in the `westus` location.

```azurecli-interactive
az group create --name myresourcegroup --location westus
```
The following example creates a PostgreSQL 11 server in West US named `mydemoserver` in your resource group `myresourcegroup` with server admin login `myadmin`. This is a **Gen 4** **General Purpose** server with **2 vCores**. This will also enabled infrastructure double encryption for the server created. Substitute the `<server_admin_password>` with your own value.

```azurecli-interactive
az postgres server create --resource-group myresourcegroup --name mydemoserver  --location westus --admin-user myadmin --admin-password <server_admin_password> --sku-name GP_Gen4_2 --version 11 --infrastructure-encryption >Enabled/Disabled>
```

## Next steps

To learn more about data encryption, see [Azure Database for PostgreSQL data Infrastructure double encryption](concepts-Infrastructure-double-encryption.md).

