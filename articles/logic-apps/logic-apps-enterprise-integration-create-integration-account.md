---
title: Create and manage integration accounts for B2B solutions - Azure Logic Apps | Microsoft Docs
description: Create, link, move, and delete integration accounts for enterprise integration and B2B solutions with Azure Logic Apps
services: logic-apps
documentationcenter: 
author: ecfan
manager: jeconnoc
editor: 

ms.assetid: d3ad9e99-a9ee-477b-81bf-0881e11e632f
ms.service: logic-apps
ms.workload: logic-apps
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 04/30/2018
ms.author: estfan
---

# Create and manage integration accounts for B2B solutions with logic apps

Before you can build [enterprise integration and B2B solutions](../logic-apps/logic-apps-enterprise-integration-overview.md) 
with [Azure Logic Apps](../logic-apps/logic-apps-overview.md), 
you must first have an integration account, which is where you create, 
store, and manage B2B artifacts, such as trading partners, agreements, maps, 
schemas, certificates, and so on. Before your logic app can work with the 
artifacts in your integration account and use the Logic Apps B2B connectors, 
such as XML validation, you must [link your integration account](#link-account) 
to your logic app. To link them, both your integration account and 
logic app must have the *same* Azure location, or region.

This article shows you how to perform these tasks:

* Create your integration account.
* Link your integration account to a logic app.
* Move your integration account to another Azure resource group or subscription.
* Delete your integration account.

If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>.

## Sign in to the Azure portal

Sign in to the <a href="https://portal.azure.com" target="_blank">Azure portal</a> 
with your Azure account credentials.

## Create integration account

1. From the main Azure menu, select **All services**. 
In the search box, enter "integration accounts" as your filter, 
and select **Integration accounts**.

   ![Find integration accounts](./media/logic-apps-enterprise-integration-create-integration-account/create-integration-account.png)

2. Under **Integration accounts**, choose **Add**.

   ![Choose "Add" to create integration account](./media/logic-apps-enterprise-integration-create-integration-account/add-integration-account.png)

3. Provide information about your integration account: 

   ![Provide details for your integration account](./media/logic-apps-enterprise-integration-create-integration-account/integration-account-details.png)

   | Property | Required | Example value | Description | 
   |----------|----------|---------------|-------------|
   | Name | Yes | test-integration-account | The name for your integration account. For this example, use the specified name. | 
   | Subscription | Yes | <*Azure-subscription-name*> | The name for the Azure subscription to use | 
   | Resource group | Yes | test-integration-account-rg | The name for the [Azure resource group](../azure-resource-manager/resource-group-overview.md) used to organize related resources. For this example, create a new resource group with the specified name. | 
   | Pricing Tier | Yes | Free | The pricing tier that you want to use. For this example, select **Free**, but for more information, see [Logic Apps limits and configuration](../logic-apps/logic-apps-limits-and-config.md) and [Logic Apps pricing](https://azure.microsoft.com/pricing/details/logic-apps/). | 
   | Location | Yes | West US | The region where to store your integration account information. Either select the same location as your logic app, or create a logic app in the same location as your integration account. | 
   | Log Analytics workspace | No | Off | Keep the **Off** setting for diagnostic logging. | 
   ||||| 

4. When you're ready, select **Pin to dashboard**, and choose **Create**.

   After Azure deploys your integration account to the 
   selected location, which usually finishes within one minute, 
   Azure opens your integration account.

   ![Azure opens your integration account](./media/logic-apps-enterprise-integration-create-integration-account/integration-account-created.png)

Now, before your logic app can use your integration account, 
you must link the integration account to your logic app.

<a name="link-account"></a>

## Link to logic app

To give your logic apps access to an integration account that contains 
your B2B artifacts, such as trading partners, agreements, maps, 
and schemas, you must link your integration account to your logic app. 

> [!NOTE]
> Your integration account and logic app must exist in the same region.

1. In the Azure portal, find and open your logic app.

2. On your logic app's menu, under **Settings**, 
select **Workflow settings**. In the 
**Select an Integration account** list, 
select the integration account to link to your logic app.

   ![Select your integration account](./media/logic-apps-enterprise-integration-create-integration-account/linkaccount-2.png)

3. To finish linking, choose **Save**.

   ![Select your integration account](./media/logic-apps-enterprise-integration-create-integration-account/linkaccount-3.png)

   When your integration account is successfully linked, 
   Azure shows a confirmation message. 

   ![Azure confirms successful link](./media/logic-apps-enterprise-integration-create-integration-account/linkaccount-5.png)

Now your logic app can use any and all the artifacts in your 
integration account plus the B2B connectors, 
such as XML validation and flat file encoding or decoding.  

## Unlink from logic app

To link your logic app to another integration account, 
or no longer use an integration account with your logic app, 
you can delete the link through Azure Resource Explorer.

1. In your browser, go to 
<a href="https://resources.azure.com" target="_blank">Azure Resource Explorer (https://resources.azure.com)</a>. 
Make sure that you're signed in with the same Azure credentials.

   ![Azure Resource Explorer](./media/logic-apps-enterprise-integration-create-integration-account/resource-explorer.png)

2. In the search box, enter your logic app's name, 
then find and select your logic app.

   ![Find and select logic app](./media/logic-apps-enterprise-integration-create-integration-account/resource-explorer-find-logic-app.png)

3. On the explorer title bar, choose **Read/Write**.

   ![Turn on "Read/Write" mode](./media/logic-apps-enterprise-integration-create-integration-account/resource-explorer-choose-read-write-mode.png)

4. On the **Data** tab, choose **Edit**.

   ![On "Data" tab, choose "Edit"](./media/logic-apps-enterprise-integration-create-integration-account/resource-explorer-choose-edit.png)

5. In the editor, find the `integrationAccount` property for the 
integration account and delete that property, which has this format:

   ```json
   "integrationAccount": {
      "name": "<integration-account-name>",
      "id": "<integration-account-resource-ID>",
      "type": "Microsoft.Logic/integrationAccounts"  
   },
   ```

   For example:

   ![Find "integrationAccount" property definition](./media/logic-apps-enterprise-integration-create-integration-account/resource-explorer-delete-integration-account.png)

6. On the **Data** tab, choose **Put** to save your changes. 

   ![Choose "Put" to save changes](./media/logic-apps-enterprise-integration-create-integration-account/resource-explorer-save-changes.png)

7. In the Azure portal, under your logic app's **Workflow settings**, 
check that the **Integration account** property now appears empty.

   ![Check that integration account is not linked](./media/logic-apps-enterprise-integration-create-integration-account/unlinked-account.png)

## Move integration account

You can move your integration account to 
another Azure subscription or resource group.

1. On the main Azure menu, select **All services**. 
In the search box, enter "integration accounts" as your filter, 
and select **Integration accounts**.

   ![Find your integration account](./media/logic-apps-enterprise-integration-create-integration-account/create-integration-account.png)

2. Under **Integration accounts**, select the integration 
account that you want to move. On your integration account menu, 
under **Settings**, choose **Properties**.

   ![Under "Settings", choose "Properties"](./media/logic-apps-enterprise-integration-create-integration-account/integration-account-properties.png)

3. Change either the Azure resource group or subscription for your integration account.

   ![Choose "Change resource group" or "Change subscription"](./media/logic-apps-enterprise-integration-create-integration-account/change-resource-group-subscription.png)

4. When you're done, make sure that you update any and all 
scripts with the new resource IDs for your artifacts.  

## Delete integration account

1. On the main Azure menu, select **All services**. 
In the search box, enter "integration accounts" as your filter, 
and select **Integration accounts**.

   ![Find your integration account](./media/logic-apps-enterprise-integration-create-integration-account/create-integration-account.png)

2. Under **Integration accounts**, select the integration 
account that you want to delete. On the integration account menu, 
choose **Overview**, then choose **Delete**. 

   ![Select integration account. On "Overview" page, choose "Delete"](./media/logic-apps-enterprise-integration-create-integration-account/delete-integration-account.png)

3. To confirm that you want to delete your integration account, choose **Yes**.

   ![To confirm delete, choose "Yes"](./media/logic-apps-enterprise-integration-create-integration-account/confirm-delete.png)

## Next steps

* [Create trading partners](../logic-apps/logic-apps-enterprise-integration-partners.md)
* [Create agreements](../logic-apps/logic-apps-enterprise-integration-agreements.md)
