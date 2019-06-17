---
title: "include file"
description: "include file"
services: machine-learning
author: sdgilley
ms.service: machine-learning
ms.author: sgilley
manager: cgronlund
ms.custom: "include file"
ms.topic: "include"
ms.date: 05/21/2019
---

1. Sign in to the [Azure portal](https://portal.azure.com/) by using the credentials for the Azure subscription you use. 

   ![Azure portal](./media/aml-create-in-portal/portal-dashboard-05-2019.png)

1. In the upper-left corner of the portal, select **Create a resource**.

   ![Create a resource in Azure portal](./media/aml-create-in-portal/portal-create-a-resource-05-2019.png)

1. In the search bar, enter **Machine Learning**. Select the **Machine Learning service workspace** search result.

   ![Search for a workspace](./media/aml-create-in-portal/allservices-search-05-2019.png)

1. In the **ML service workspace** pane, select **Create** to begin.

    ![Create button](./media/aml-create-in-portal/portal-create-button-05-2019.png)

1. In the **ML service workspace** pane, configure your workspace.

   Field|Description
   ---|---
   Workspace name |Enter a unique name that identifies your workspace. In this example, we use **docs-ws**. Names must be unique across the resource group. Use a name that's easy to recall and differentiate from workspaces created by others.  
   Subscription |Select the Azure subscription that you want to use.
   Resource group | Use an existing resource group in your subscription, or enter a name to create a new resource group. A resource group holds related resources for an Azure solution. In this example, we use **docs-aml**. 
   Location | Select the location closest to your users and the data resources. This location is where the workspace is created.

   ![Create workspace](./media/aml-create-in-portal/workspace-create-main-tab-05-2019.png)

1. To start the creation process, select **Review + Create**.

    ![Create](./media/aml-create-in-portal/workspace-create-main-review-button-05-2019.png)

1. Review your workspace configuration. If it is correct, select **Create**. It can take a few moments to create the workspace.

    ![Create](./media/aml-create-in-portal/workspace-create-review-tab-05-2019.png)

1. To check on the status of the deployment, select the Notifications icon, **bell**, on the toolbar.

1. When the process is finished, a deployment success message appears. It's also present in the notifications section. To view the new workspace, select **Go to resource**.

   ![Workspace creation status](./media/aml-create-in-portal/notifications-05-2019.png)
