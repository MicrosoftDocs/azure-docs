---
title: Set data encryption for Azure Database for MySQL - Flexible Server by using the Azure portal
description: Learn how to set up and manage data encryption for your Azure Database for MySQL - Flexible Server using Azure portal.
author: SudheeshGH
ms.author: sunaray
ms.reviewer: maghan
ms.date: 11/21/2022
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
---

# Data encryption for Azure Database for MySQL - Flexible Server by using the Azure portal

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This tutorial shows you how to set up and manage data encryption for your Azure Database for MySQL - Flexible Server.

In this tutorial, you learn how to:

- Set data encryption for Azure Database for MySQL - Flexible Server.
- Configure data encryption for restoration.
- Configure data encryption for replica servers.

  > [!NOTE]  
> Azure key vault access configuration now supports two types of permission models - [Azure role-based access control](../../role-based-access-control/overview.md) and [Vault access policy](../../key-vault/general/assign-access-policy.md). The tutorial describes configuring data encryption for Azure Database for MySQL - Flexible server using Vault access policy. However, you can choose to use Azure RBAC as permission model to grant access to Azure Key Vault. To do so, you need any built-in or custom role that has below three permissions and assign it through "role assignments" using Access control (IAM) tab in the keyvault: a) KeyVault/vaults/keys/wrap/action b) KeyVault/vaults/keys/unwrap/action c) KeyVault/vaults/keys/read



## Prerequisites

- An Azure account with an active subscription.
- If you don't have an Azure subscription, create an [Azure free account](https://azure.microsoft.com/free) before you begin.

    > [!NOTE]  
    > With an Azure free account, you can now try Azure Database for MySQL - Flexible Server for free for 12 months. For more information, see [Try Flexible Server for free](how-to-deploy-on-azure-free-account.md).

## Set the proper permissions for key operations

1. In Key Vault, select **Access policies**, and then select **Create**.

    :::image type="content" source="media/how-to-data-encryption-portal/1-mysql-key-vault-access-policy.jpeg" alt-text="Screenshot of Key Vault Access Policy in the Azure portal.":::

1. On the **Permissions** tab, select the following **Key permissions - Get** , **List** , **Wrap Key** , **Unwrap Key**.

1. On the **Principal** tab, select the User-assigned Managed Identity.

    :::image type="content" source="media/how-to-data-encryption-portal/2-mysql-principal-tab.jpeg" alt-text="Screenshot of the principal tab in the Azure portal.":::

1. Select **Create**.

## Configure customer managed key

To set up the customer managed key, perform the following steps.

1. In the portal, navigate to your Azure Database for MySQL - Flexible Server, and then, under **Security** , select **Data encryption**.

    :::image type="content" source="media/how-to-data-encryption-portal/3-mysql-data-encryption.jpeg" alt-text="Screenshot of the data encryption page.":::

1. On the **Data encryption** page, under **No identity assigned** , select **Change identity** ,

1. In the **Select user assigned**** managed identity **dialog box, select the** demo-umi **identity, and then select** Add**.

    :::image type="content" source="media/how-to-data-encryption-portal/4-mysql-assigned-managed-identity-demo-uni.jpeg" alt-text="Screenshot of selecting the demo-umi from the assigned managed identity page.":::

1. To the right of **Key selection method** , either **Select a key** and specify a key vault and key pair, or select **Enter a key identifier**.

    :::image type="content" source="media/how-to-data-encryption-portal/5-mysql-select-key.jpeg" alt-text="Screenshot of the Select Key page in the Azure portal.":::

1. Select **Save**.

## Use Data encryption for restore

To use data encryption as part of a restore operation, perform the following steps.

1. In the Azure portal, on the navigate Overview page for your server, select **Restore**.
    1. On the **Security** tab, you specify the identity and the key.

        :::image type="content" source="media/how-to-data-encryption-portal/6-mysql-navigate-overview-page.jpeg" alt-text="Screenshot of overview page.":::

1. Select **Change identity** and select the **User assigned managed identity** and select on **Add**
**To select the Key** , you can either select a **key vault** and **key pair** or enter a **key identifier**

    :::image type="content" source="media/how-to-data-encryption-portal/7-mysql-change-identity.jpeg" alt-text="SCreenshot of the change identity page.":::

## Use Data encryption for replica servers

After your Azure Database for MySQL - Flexible Server is encrypted with a customer's managed key stored in Key Vault, any newly created copy of the server is also encrypted.

1. To configuration replication, under **Settings** , select **Replication** , and then select **Add replica**.

    :::image type="content" source="media/how-to-data-encryption-portal/8-mysql-replication.jpeg" alt-text="Screenshot of the Replication page.":::

1. In the Add Replica server to Azure Database for MySQL dialog box, select the appropriate **Compute + storage** option, and then select **OK**.

    :::image type="content" source="media/how-to-data-encryption-portal/9-mysql-compute-storage.jpeg" alt-text="Screenshot of the Compute + Storage page.":::

    > [!IMPORTANT]  
    > When trying to encrypt Azure Database for MySQL - Flexible Server with a customer managed key that already has a replica(s), we recommend configuring the replica(s) as well by adding the managed identity and key.

## Next steps

- [Customer managed keys data encryption](concepts-customer-managed-key.md)
- [Data encryption with Azure CLI](how-to-data-encryption-cli.md)


