---
title: Create an Analysis Services server in Azure | Microsoft Docs
description: Learn how to create an Analysis Services server instance in Azure.
author: minewiskan
manager: kfile
ms.service: analysis-services
ms.topic: conceptual
ms.date: 04/23/2018
ms.author: owend
ms.reviewer: minewiskan

---
# Create an Analysis Services server in Azure portal
This article walks you through creating an Analysis Services server resource in your Azure subscription.

Before you begin, you need: 

* **Azure subscription**: Visit [Azure Free Trial](https://azure.microsoft.com/offers/ms-azr-0044p/) to create an account.
* **Azure Active Directory**: Your subscription must be associated with an Azure Active Directory tenant. And, you need to be signed in to Azure with an account in that Azure Active Directory. To learn more, see [Authentication and user permissions](analysis-services-manage-users.md).

## Log in to the Azure portal 

Log in to the [Azure portal](https://portal.azure.com)


## Create a server

1. Click **+ Create a resource** > **Data + Analytics** > **Analysis Services**.

    ![Portal](./media/analysis-services-create-server/aas-create-server-portal.png)

2. In **Analysis Services**, fill in the required fields, and then press **Create**.
   
    ![Create server](./media/analysis-services-create-server/aas-create-server-blade.png)
   
   * **Server name**: Type a unique name used to reference the server.
   * **Subscription**: Select the subscription this server will be associated with.
   * **Resource group**: Create a new resource group or select one you already have. Resource groups are designed to help you manage a collection of Azure resources. To learn more, see [resource groups](../azure-resource-manager/resource-group-overview.md).
   * **Location**: This Azure datacenter location hosts the server. Choose a location nearest your largest user base.
   * **Pricing tier**: Select a pricing tier. If you are testing and intend to install the sample model database, select the free **D1** tier. To learn more, see [Azure Analysis Services pricing](https://azure.microsoft.com/pricing/details/analysis-services/). 
    * **Administrator**: By default, this will be the account you are logged in with. You can choose a different account from your Azure Active Directory.
    * **Backup Storage setting**: Optional. If you already have a [storage account](../storage/common/storage-introduction.md), you can specify it as the default for model database backup. You can also specify [backup and restore](analysis-services-backup.md) settings later.
    * **Storage key expiration**: Optional. Specify a storage key expiration period.
3. Click **Create**.

Create usually takes under a minute. If you selected **Add to Portal**, navigate to your portal to see your new server. Or, navigate to **All services** > **Analysis Services** to see if your server is ready.

## Clean up resources
When no longer needed, delete your server. In your server's **Overview**, click **Delete**. 

 ![Cleanup](./media/analysis-services-create-server/aas-create-server-cleanup.png)


## Next steps

[Add a sample data model](analysis-services-create-sample-model.md) to your server.  
[Install an On-premises data gateway](analysis-services-gateway-install.md) if your data model connects to on-premises data sources.  
[Deploy a tabular model project](analysis-services-deploy.md) from Visual Studio.   


