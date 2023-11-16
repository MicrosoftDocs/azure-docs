---
title: "Include file"
description: "Include file"
services: load-testing
author: ntrogh
ms.service: load-testing
ms.author: nicktrog
ms.custom: "include file"
ms.topic: "include"
ms.date: 10/11/2023
---

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. From the Azure portal menu or the **Home page**, select **Create a resource**.

1. On the **Marketplace** page, search for and select **Azure Load Testing**.

1. On the **Azure Load Testing** pane, select **Create**.

1. On the **Create a load testing resource** page, enter the following information:

    |Field  |Description  |
    |---------|---------|
    |**Subscription**     | Select the Azure subscription that you want to use for this Azure Load Testing resource.         |
    |**Resource group**     | Select an existing resource group. Or select **Create new**, and then enter a unique name for the new resource group.        |
    |**Name**     | Enter a unique name to identify your Azure Load Testing resource.<br>The name can't contain special characters, such as \\/""[]:\|<>+=;,?*@&, or whitespace. The name can't begin with an underscore (_), and it can't end with a period (.) or a dash (-). The length must be 1 to 64 characters.     |
    |**Location**     | Select a geographic location to host your Azure Load Testing resource. <BR>This location also determines where the test engines are hosted and where the JMeter client requests originate from. |

    > [!NOTE]
    > Optionally, you can configure more details on the **Tags** tab. Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups.

1. After you're finished configuring the resource, select **Review + Create**.

1. Review the settings you provide, and then select **Create**. It takes a few minutes to create the account. Wait for the portal page to display **Your deployment is complete** before moving on.

1. To view the new resource, select **Go to resource**.
    
    :::image type="content" source="../../media/azure-load-testing-create-in-portal/create-azure-load-testing-goto-resource.png" alt-text="Screenshot that shows the deployment completion screen.":::

1. Optionally, [manage access to your Azure Load Testing resource](../../how-to-assign-roles.md).

    Azure Load Testing uses role-based access control (RBAC) to manage permissions for your resource. If you encounter this message, your account doesn't have the necessary permissions to manage tests.

    :::image type="content" source="../../media/azure-load-testing-create-in-portal/azure-load-testing-not-authorized.png" lightbox="../../media/azure-load-testing-create-in-portal/azure-load-testing-not-authorized.png" alt-text="Screenshot that shows an error message in the Azure portal that you're not authorized to use the Azure Load Testing resource.":::

# [Azure CLI](#tab/azure-cli)

1. Sign into Azure:

    ```azurecli
    az login
    ```

1. Set parameter values:

    The following values are used in subsequent commands to create the load testing resource.

    ```azurecli
    loadTestResource="<load-testing-resource-name>"
    resourceGroup="<resource-group-name>"
    location="East US"
    ```

1. Create an Azure load testing resource with the `azure load create` command:

    ```azurecli
    loadTestResource="<load-testing-resource-name>"
    resourceGroup="<resource-group-name>"
    location="East US"
    az load create --name $loadTestResource --resource-group $resourceGroup --location $location
    ```

1. After the resource is created, you can view the details with the `azure load show` command:

    ```azurecli
    az load show --name $loadTestResource --resource-group $resourceGroup
    ```

---
