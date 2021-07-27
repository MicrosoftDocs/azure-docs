---
title: How to configure Azure Functions storage queue with identity-based connections
description: Article that shows you how to use identity-based connections with a storage queue instead of connection strings
ms.topic: article
ms.date: 7/26/2021

---

# Tutorial: Using a Storage Queue Trigger with Identity-Based Connections

This article shows you how to configure a storage queue trigger to use managed identities instead of secrets. To learn more about identity-based connections, see [Configure an identity-based connection.](functions-reference.md#configure-an-identity-based-connection). 

Prerequisite:
- Complete the [Creating a function app with identity base connections tutorial](./functions-managed-identity-tutorial.md).

In this tutorial, you'll:

> [!div class="checklist"]
> * create a storage account and queue
> * configure your function app with a storage queue managed identity
> * deploy a queue triggered function app
> * verify your storage queue with managed identity

## Create a storage account with a queue

The storage account queue will be used by your function app's queue trigger.

1. On the Azure portal menu or the **Home** page, select **Create a resource**.

1. On the **New** page, search for *storage account*. Then select **Create**.

1. On the **Basics** tab, use the following table to configure the storage account settings. All other settings can use the default values.

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Subscription** | Your subscription | The subscription under which your resources are created. | 
    | **[Resource group](../azure-resource-manager/management/overview.md)**  | myResourceGroup | The resource group you created with your function app. |
    | **Name** | mystorage| The name of the storage account that will be used for the queue trigger. |
    | **[Region](https://azure.microsoft.com/regions/)** | myFunctionRegion | The region where you created your function app. |

1. Select **Review + create**. After validation finishes, select **Create**.

1. Once created, in your storage account, go to **Queues** in the left blade.

1. Select **+Queue**, and enter a queue name. For this tutorial, the created queue will be called **queue**.

1. Select **OK**.

1. Congratulations! You've setup the storage account and queue for your queue trigger.

## Configure your function app with a storage queue managed identity

Now, you will add the **Storage Queue Data Contributor** Azure role assignment for your queue trigger's storage account. This is required for using managed identities with the queue trigger.

1. In your function app, select **Identity** from the left blade.

1. Select **Azure role assignments** to open the **Azure role assignments** page. 

1. Enter the following settings.

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Scope** |  Storage |  Scope is a set of resources that the role assignment applies to. Scope has levels that are inherited at lower levels. For example, if you select a subscription scope, the role assignment applies to all resource groups and resources in the subscription. |
    |**Subscription**| Your subscription | Subscription under which this new function app is created. |
    |**Resource**| Your queue storage account | The storage account for queue triggers created earlier in this tutorial. |
    | **Role** | Storage Queue Data Contributor | A role is a collection of permissions. Allows for read, write, and delete access of Azure Storage queues. |

1. Select **Save**.

1. Your role assignments should look like the below. The **Key Vault Secrets User** was part of the optional tutorial for accessing your application insights key with managed identities.
    :::image type="content" source="./media/functions-secretless-tutorial/17-confirm-roles-queue.png" alt-text="Screenshot of roles the function app should have.":::

1. In your function app, select **Configuration** from the left blade.

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **QueueConnection__accountName** |  Your storage queue account name |  This tutorial will use a queue trigger with a connection called **QueueConnection**. If you wish to use a connection other than QueueConnection, the setting name would be <YourConnection__accountName>. The value is the name of your storage queue account created earlier in this tutorial. |
    |**QueueConnection__credential**| managedIdentity | For every connection that is used as a trigger, you will also need to add the credential setting that specifies that managed identity is used. |

1. Select **Save**.

## Deploy a queue triggered function app

1. In Visual Studio, Right-click on your function app project, select **Add**, and select **New Function**.
    :::image type="content" source="./media/functions-secretless-tutorial/18-add-function.png" alt-text="Screenshot of how to add a function to an existing function app.":::

1. Select **Azure Function**, name your function, and select **Add**.
 
1. Select **Queue trigger**, and enter the following settings.
    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Connection string setting name** | QueueConnection | The app setting name for your connection. A connection string won't be used as a managed identity will be configured. For this tutorial, QueueConnection will be used. | 
    | **Queue name**  | queue | The name of your queue you created for your storage account. This is the queue your function app will trigger off of. |

1. Select **Add** to create your function.

1. Update your extension version to the preview extensions that support identity-based connections.

    # [C#](#tab/csharp)
    
    1. Visual Studio will automatically add the Storage extension package. Right-click this package and select **Remove** as you will need to use the preview version.
    :::image type="content" source="./media/functions-secretless-tutorial/19-delete-extension.png" alt-text="Screenshot of how to remove a function extension.":::

    1. In Visual Studio, Right-click dependencies, and select **Manage NuGet Packages**.
    :::image type="content" source="./media/functions-secretless-tutorial/20-add-preview-package.png" alt-text="Screenshot of how to add a preview package.":::
    
    1. Make sure the **include preview** box is checked and search for the package you will be using. 
    
    1. For this tutorial, search **Microsoft.Azure.Webjobs.Extensions.Storage**. For a list of preview versions and NuGet packets of the extensions, visit [the documentation on configuring an identity-based connection](./functions-reference.md#configure-an-identity-based-connection).

    1. Select the extension and verify you are using the latest version of the preview NuGet package.

    1. Select **Install**
    
    # [C# Script](#tab/csharp-script)
    
    1. Visual Studio will automatically add the Storage extension package. Right-click this package and select **Remove** as you will need to use the preview version.
    :::image type="content" source="./media/functions-secretless-tutorial/19-delete-extension.png" alt-text="Screenshot of how to remove a function extension.":::

    1. In Visual Studio, Right-click dependencies, and select **Manage NuGet Packages**.
    :::image type="content" source="./media/functions-secretless-tutorial/20-add-preview-package.png" alt-text="Screenshot of how to add a preview package.":::

    1. Make sure the **include preview** box is checked and search for the package you will be using. 
    
    1. For this tutorial, search **Microsoft.Azure.Webjobs.Extensions.Storage**. For a list of preview versions and NuGet packets of the extensions, visit [the documentation on configuring an identity-based connection](./functions-reference.md#configure-an-identity-based-connection).

    1. Select the extension and verify you are using the latest version of the preview NuGet package.

    1. Select **Install**

    # [JavaScript](#tab/javascript)
    1. Go to your host.json file
    
    1. Update the extension bundle configuration as follows:
    
        ```json
          "extensionBundle": {
            "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
            "version": "[3.*, 4.0.0)"
          }
        ```
    
    # [Python](#tab/python)
    1. Go to your host.json file
    
    1. Update the extension bundle configuration as follows:
    
        ```json
          "extensionBundle": {
            "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
            "version": "[3.*, 4.0.0)"
          }
        ```
    
    # [Java](#tab/java)
    1. Go to your host.json file
    
    1. Update the extension bundle configuration as follows:
    
        ```json
          "extensionBundle": {
            "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
            "version": "[3.*, 4.0.0)"
          }
        ```
    ---

1. Now publish your function app. For more specific steps on how to publish your app, follow the deploy a function using run from package section of the [Create a function app with identity-based connections](./functions-managed-identity-tutorial.md#deploy-a-function-using-run-from-package) tutorial.

## Test your configuration

1. In your storage account, select **Queues** from the left blade.

1. Select your created queue. In this tutorial, the queue was named **queue**. 

1. Select **Add message**.

1. Enter a **Message text**, and leave the rest as defaults.

1. Select **OK**.

1. Wait a couple of minutes, select **Refresh**. Your message should disappear as it has been read by the queue trigger and dequeued.

1. Congratulations! You've successfully set up your storage queue trigger with managed identity.

[!INCLUDE [clean-up-section-portal](../../includes/clean-up-section-portal.md)]

## Next steps

In this tutorial, you created a Premium function app, storage account, and Service Bus. You secured all of these resources behind private endpoints. 

Use the following links to learn more Azure Functions networking options and private endpoints:

- [Managed identity in Azure Functions](../app-service/overview-managed-identity.md)

- [identity-based connections in Azure Functions](./functions-reference.md#configure-an-identity-based-connection)

- [Connecting to host storage with an Identity](./functions-reference.md#connecting-to-host-storage-with-an-identity)

- [Creating a Function App without Azure Files](./storage-considerations.md#create-an-app-without-azure-files)

- [Run Azure Functions from a package file](./run-functions-from-deployment-package.md)

- [Use Key Vault references in Azure Functions](../app-service/app-service-key-vault-references.md)

- [Configuring the account used by Visual Studio for local development](/dotnet/api/azure/identity-readme.md#authenticating-via-visual-studio)

- [Functions documentation for local development](./functions-reference.md#local-development)
