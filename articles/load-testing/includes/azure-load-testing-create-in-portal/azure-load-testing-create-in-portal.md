---
title: "Include file"
description: "Include file"
services: load-testing
author: ntrogh
ms.service: load-testing
ms.author: nicktrog
ms.custom: "include file"
ms.topic: "include"
ms.date: 02/15/2022
---

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. Select the menu button in the upper-left corner of the portal, and then select **+ Create a resource**.

    :::image type="content" source="../../media/azure-load-testing-create-in-portal/create-resource.png" alt-text="Screenshot that shows the button for creating a resource.":::

1. Use the search bar to find **Azure Load Testing**.

1. Select **Azure Load Testing**.

1. On the **Azure Load Testing** pane, select **Create**.

    :::image type="content" source="../../media/azure-load-testing-create-in-portal/create-azure-load-testing.png" alt-text="Screenshot that shows the Azure Load Testing pane.":::

1. Provide the following information to configure your new Azure Load Testing resource:

    |Field  |Description  |
    |---------|---------|
    |**Subscription**     | Select the Azure subscription that you want to use for this Azure Load Testing resource.         |
    |**Resource group**     | Select an existing resource group. Or select **Create new**, and then enter a unique name for the new resource group.        |
    |**Name**     | Enter a unique name to identify your Azure Load Testing resource.<br>The name can't contain special characters, such as \\/""[]:\|<>+=;,?*@&, or whitespace. The name can't begin with an underscore (_), and it can't end with a period (.) or a dash (-). The length must be 1 to 64 characters.     |
    |**Location**     | Select a geographic location to host your Azure Load Testing resource. <BR>This location also determines where the test engines are hosted and where the JMeter client requests originate from. |

    > [!NOTE]
    > Optionally, you can configure more details on the **Tags** tab. Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups.

1. After you're finished configuring the resource, select **Review + Create**.

1. Review all the configuration settings and select **Create** to start the deployment of the Azure Load Testing resource. 
    
    When the process has finished, a deployment success message appears.

1. To view the new resource, select **Go to resource**.
    
    :::image type="content" source="../../media/azure-load-testing-create-in-portal/create-azure-load-testing-goto-resource.png" alt-text="Screenshot that shows the deployment completion screen.":::

1. Optionally, [manage access to your Azure Load Testing resource](../../how-to-assign-roles.md).

    Azure Load Testing uses role-based access control (RBAC) to manage permissions for your resource. If you encounter this message, your account doesn't have the necessary permissions to manage tests.

    :::image type="content" source="../../media/azure-load-testing-create-in-portal/azure-load-testing-not-authorized.png" lightbox="../../media/azure-load-testing-create-in-portal/azure-load-testing-not-authorized.png" alt-text="Screenshot that shows an error message in the Azure portal that you're not authorized to use the Azure Load Testing resource.":::
    