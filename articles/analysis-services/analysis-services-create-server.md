<properties
   pageTitle="Create an Analysis Services server in Azure | Microsoft Azure"
   description="Learn how to create an Analysis Services server instance in Azure."
   services="analysis-services"
   documentationCenter=""
   authors="minewiskan"
   manager="erikre"
   editor=""
   tags=""/>
<tags
   ms.service="analysis-services"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="na"
   ms.date="10/24/2016"
   ms.author="owend"/>

# Create an Analysis Services server
This article walks you through creating a new Analysis Services server resource in your Azure subscription.

## Before you begin
To get started, you need:

- **Azure subscription**: Visit [Azure Free Trial](https://azure.microsoft.com/offers/ms-azr-0044p/) to create an account.
- **Resource group**: Use a resource group you already have or [create a new one](../azure-resource-manager/resource-group-overview.md).

> [AZURE.NOTE] Creating an Analysis Services server might result in a new billable service. To learn more, see Analysis Services pricing.

## Create an Analysis Services server

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Click **+ New** > **Intelligence + analytics** > **Analysis Services**.

3. In the **Analysis Services** blade, fill in the required fields, and then press **Create**.

    ![Create server](./media/analysis-services-create-server/aas-create-server-blade.png)

	- **Server name**: Type a unique name used to reference the server.

    - **Subscription**: Select the subscription this server bills to.

    - **Resource group**: These are containers designed to help you manage a collection of Azure resources. To learn more, see [resource groups](../resource-group-overview.md).

    - **Location**: This Azure datacenter location hosts the server. Choose a location nearest your largest user base.

    - **Pricing tier**: Select a pricing tier. Tabular models up to 100 GB are supported. You can always change your pricing tier later.

4. Click **Create**.

Create usually takes under a minute; often just a few seconds. If you selected **Add to Portal**, navigate to your portal to see your new server. Or, navigate to **More services** > **Analysis Services** to see if your server is ready. If it doesn't appear refresh the list.

 ![Dashboard](./media/analysis-services-create-server/aas-create-server-dashboard.png)


## Next steps
Once you've created your server, you can [deploy a  model](analysis-services-deploy.md) to it by using SSDT or with SSMS.

If a model you deploy to your server connects to on-premises data sources, you'll need to install an [On-premises data gateway](analysis-services-gateway.md) on a computer in your network.
