---
title: Set data encryption for Azure Database for MySQL flexible server by using the Azure portal Preview
description: Learn how to set up and manage data encryption for your Azure Database for MySQL flexible server using Azure portal.
author: vivgk
ms.author: vivgk
ms.reviewer: maghan
ms.date: 09/15/2022
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Tutorial: Set data encryption for Azure Database for MySQL flexible server by using the Azure portal Preview

This tutorial shows you how to set up and manage data encryption for your Azure Database for MySQL flexible server.

In this tutorial, you learn how to:

- Set data encryption for Azure Database for MySQL flexible server.
- Configure data encryption for restore.
- Configure data encryption for replica servers.

# Prerequisites

To complete this tutorial, you need:

- An Azure account with an active subscription.

If you don't have an Azure subscription, create an[Azure free account](https://azure.microsoft.com/free)before you begin. With an Azure free account, you can now try Azure Database for MySQL flexible Server for free for 12 months. For more details, see[Try Flexible Server for free](https://docs.microsoft.com/en-us/azure/mysql/flexible-server/how-to-deploy-on-azure-free-account).

- The right permissions set for key operations.

1.
In Key Vault, select **Access policies** , and then select **Create**
2. ![](RackMultipart20220914-1-wevfkn_html_f5c3099451af0aa.jpg)

**(Image 1)**

1. On the **Permissions** tab, select the following **Key permissions - Get** , **List** , **Wrap Key** , **Unwrap Key**
.
2. On the **Principal** tab, select the User-assigned Managed Identity.
 ![](RackMultipart20220914-1-wevfkn_html_1bfada705d3c0d52.jpg)

(Image 2)

1. Select **Create**.

Configure customer managed key

To set up the customer managed key, perform the following steps.

1. In the portal, navigate to your Azure Database for MySQL flexible server, and then, under **Security** , select **Data encryption**.

![](RackMultipart20220914-1-wevfkn_html_b241467dfa642ada.jpg)
**(Image 3)**

1. On the **Data encryption** page, under **No identity assigned** , select **Change identity** ,.
2. In the **Select user assigned**** managed identity **dialog box, select the** demo-umi **identity, and then select** Add**.

![](RackMultipart20220914-1-wevfkn_html_b93098ce9236bd34.jpg)

**(Image 4)**

1.
To the right of **Key selection method** , either **Select a key** and specify a key vault and key pair, or select **Enter a key identifier**.
 ![](RackMultipart20220914-1-wevfkn_html_87c607bdbe56f832.jpg)

**(Image 5)**

1. Select **Save**.

Using Data encryption for restore

To use data encryption as part of a restore operation, perform the following steps.

1. In the Azure portal, on the navigate Overview page for your server, select **Restore**.

![](RackMultipart20220914-1-wevfkn_html_f2333dacfec03390.jpg)

**(Image 6)**

On the **Security** tab, you specify the identity and the key.

1. Select **Change identity** and select the **User assigned managed identity** and click on **Add**
**To select the Key** , you can either select a **key vault** and **key pair** or enter a **key identifier**

![](RackMultipart20220914-1-wevfkn_html_2e04d3923f06d56.jpg)

**(Image 7)**

Using Data encryption for replica servers

After your Azure Database for MySQL flexible server is encrypted with a customer's managed key stored in Key Vault, any newly created copy of the server will also be encrypted.

1. To configuration replication, under **Settings** , select **Replication** , and then select **Add replica**. ![](RackMultipart20220914-1-wevfkn_html_28e76840d324ccc.jpg)

**(Image 8)**

1. In the Add Replica server to Azure Database for MySQL dialog box, select the appropriate **Compute + storage** option, and then select **OK**.
 ![](RackMultipart20220914-1-wevfkn_html_f75a5294ea33eff8.jpg)

**(Image 9)**

**Important** : When trying to encrypt Azure Database for MySQL flexible server with a customer managed key that already has a replica(s), we recommend configuring the replica(s) as well by adding the managed identity and key.

# Next steps

-