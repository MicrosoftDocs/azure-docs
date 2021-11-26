---
title: "Include file"
description: "Include file"
services: load-testing
author: ntrogh
ms.service: load-testing
ms.author: nicktrog
ms.custom: "include file"
ms.topic: "include"
ms.date: 11/30/2021
---

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. Select the menu button in the upper-left corner of the portal, and then select **+ Create a resource**.

    :::image type="content" source="media/azure-load-testing-create-in-portal/create-resource.png" alt-text="Screenshot showing + Create a resource.":::

1. Use the search bar to find **Azure Load Testing**.

1. Select **Azure Load Testing**.

1. In the **Azure Load Testing** pane, select **Create**.

    :::image type="content" source="media/azure-load-testing-create-in-portal/create-azure-load-testing.png" alt-text="Screenshot that shows the Azure Load Testing creation page.":::

1. Provide the following information to configure your new Azure Load Testing resource.

    |Field  |Description  |
    |---------|---------|
    |Subscription     | Select the Azure subscription you want to use for this Azure Load Testing resource.         |
    |Resource Group     | Select an existing resource group, or select **Create new**, and then enter a unique name for the new resource group.        |
        |Name     | Enter a unique name to identify your Azure Load Testing resource.<br>The name can't contain special characters, such as \\/""[]:\|<>+=;,?*@&, or whitespace. The name can't begin with '_', or end with '.' or '-'. The length must be between 1 and 64 characters.     |
    |Location     | Select a geographic location to host your Azure Load Testing resource.        |

    :::image type="content" source="media/azure-load-testing-create-in-portal/create-azure-load-testing-basics.png" alt-text="Screenshot that shows the Basics tabs when creating an Azure Load Testing resource.":::

    > [!NOTE]
    > Optionally, you can configure more details in the **Tags** tab. Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups.

1. After you're finished configuring the resource, select **Review + Create**.

1. Review all the configuration settings and select **Create** to start the deployment of the Azure Load Testing resource. 
    
    When the process has finished, a deployment success message appears.

1. To view the new resource, select **Go to resource**.
    
    :::image type="content" source="media/azure-load-testing-create-in-portal/create-azure-load-testing-goto-resource.png" alt-text="Screenshot that shows the deployment completion screen.":::
