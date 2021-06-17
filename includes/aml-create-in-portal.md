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
ms.date: 05/11/2021
---

1. Sign in to the [Azure portal](https://portal.azure.com/) by using the credentials for your Azure subscription.

1. In the upper-left corner of the Azure portal, select the three bars, then **+ Create a resource**.

    :::image type="content" source="media/aml-create-in-portal/create-resource.png" alt-text="Screenshot showing + Create a resource.":::

1. Use the search bar to find **Machine Learning**.

1. Select **Machine Learning**.

   :::image type="content" source="media/aml-create-in-portal/machine-learning.png" alt-text="Screenshot shows search results to select Machine Learning.":::


1. In the **Machine Learning** pane, select **Create** to begin.

1. Provide the following information to configure your new workspace:

   Field|Description
   ---|---
   Workspace name |Enter a unique name that identifies your workspace. In this example, we use **docs-ws**. Names must be unique across the resource group. Use a name that's easy to recall and to differentiate from workspaces created by others.
   Subscription |Select the Azure subscription that you want to use.
   Resource group | Use an existing resource group in your subscription, or enter a name to create a new resource group. A resource group holds related resources for an Azure solution. In this example, we use **docs-aml**. 
   Location | Select the location closest to your users and the data resources to create your workspace.

1. After you're finished configuring the workspace, select **Review + Create**.
1. Select **Create** to create the workspace.

   > [!Warning]
   > It can take several minutes to create your workspace in the cloud.

   When the process is finished, a deployment success message appears.
 
 1. To view the new workspace, select **Go to resource**.
 1. From the portal view of your workspace, select **Launch studio** to go to the Azure Machine Learning studio. 

