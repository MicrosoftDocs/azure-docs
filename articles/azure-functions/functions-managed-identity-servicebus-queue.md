---
title: How to configure a secretless Azure Functions service queue with identity-based connections
description: Article that shows you how to use identity-based connections with a service queue instead of connection strings, and how to use managed identities locally.
ms.topic: conceptual
ms.date: 3/13/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Configuring a Secretless Service Bus Queue Trigger with Identity-Based Connections

This article shows you how to configure a secretless service bus queue trigger to use managed identities instead of secrets. To learn more about identity-based connections, see [Configure an identity-based connection.](functions-reference.md#configure-an-identity-based-connection).

Prerequisite:
> [!div class="checklist"]
> *  Complete the [Creating a function app with identity base connections tutorial](./functions-managed-identity-tutorial.md).

In this tutorial, you'll:

> [!div class="checklist"]
> * create a service bus namespace and queue
> * configure your function app with a service bus queue managed identity
> * deploy a service bus triggered function app
> * verify your storage queue with managed identity in portal
> * verify your service bus queue with managed identity in a local environment

## Create a service bus and queue

1. On the Azure portal menu or the **Home** page, select **Create a resource**.

1. On the **New** page, search for *Service Bus*. Then select **Create**.

1. On the **Basics** tab, use the following table to configure the Service Bus settings. All other settings can use the default values.

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Subscription** | Your subscription | The subscription under which your resources are created. |
    | **[Resource group](../azure-resource-manager/management/overview.md)**  | myResourceGroup | The resource group you created with your function app. |
    | **Namespace name** | myServiceBus | The name of the Service Bus that your function app will trigger off of. |
    | **[Location](https://azure.microsoft.com/regions/)** | myFunctionRegion | The region where you created your function app. |
    | **Pricing tier** | Basic | The basic Service Bus tier. |

1. Select **Review + create**. After validation finishes, select **Create**.

1. Once created, in your Service Bus, select **Queues** from the left blade.

1. Select **Queue**. For the purposes of this tutorial, provide the name *queue* as the name of the new queue.

1. Select **Create**.

## Configure your function app with a service bus managed identity

Now, you will add the **Azure Service Bus Data Owner** role assignment for your function app. This is required for using managed identities with the service bus trigger.

1. In your service bus, select **Access Control (IAM)** from the left blade.
    :::image type="content" source="./media/functions-secretless-tutorial/21-service-bus-IAM.png" alt-text="Screenshot of how to add a service bus IAM.":::

1. Select **Add role assignment (Preview)** to open the **Azure role assignments** page. 

1. On the **Role** tab, select **Azure Service Bus Data Owner**.

1. On the **Members** tab, select **Managed Identity**, and **+Select members**.
    :::image type="content" source="./media/functions-secretless-tutorial/22-add-service-bus-managed-identity.png" alt-text="Screenshot of how to add managed identity to service bus.":::

1. In the **Select managed identities** blade, configure with the following settings.

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **System-assigned app type** | Function App | Type of resource for the managed identity. |
    |**Subscription**| Your subscription | Subscription the managed identity is being created in. |
    |**Select**| N/A | Leave this field blank. |

1. Select your managed identity function app, and select **Select**.

1. On the **Review + assign** tab, select **Review + assign**.

1. Your role assignments should look like the below. The **Key Vault Secrets User** was part of the optional tutorial for accessing your application insights key with managed identities, and **Storage Queue Data Contributor** was part of the storage queue tutorial.
    :::image type="content" source="./media/functions-secretless-tutorial/23-confirm-roles-service-bus.png" alt-text="Screenshot of roles the function app should have after configuring service bus.":::

1. In your function app, select **Configuration** from the left blade.

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **ServiceBusConnection__fullyQualifiedNamespace** | <YourServiceBusName>.servicebus.windows.net | This tutorial will use a service trigger with a connection called **ServiceBusConnection**. If you wish to use a connection other than ServiceBusConnection, the setting name would be <YourConnection__fullyQualifiedNamespace>. The value uses the name of your service account created earlier in this tutorial.. |
    |**ServiceBusConnection__credential**| managedIdentity | For every connection that is used as a trigger, you will also need to add the credential setting that specifies that managed identity is used. |

1. Select **Save**.

## Deploy a service bus triggered function app

1. In Visual Studio, Right-click on your function app project, select **Add**, and select **New Function**.
    :::image type="content" source="./media/functions-secretless-tutorial/18-add-function.png" alt-text="Screenshot of how to add a function to an existing function app.":::

1. Select **Azure Function**, name your function, and select **Add**.
 
1. Select **Service Bus Queue trigger**, and enter the following settings.

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Connection string setting name** | ServiceBusConnection | The app setting name for your connection. A connection string won't be used as a managed identity will be configured. For this tutorial, ServiceBusConnection will be used. | 
    | **Queue name**  | queue | The name of your queue you created for your storage account. This is the queue your function app will trigger off of. |

1. Select **Add** to create your function.

1. Update your extension version to the preview extensions that support identity-based connections.

    # [C#](#tab/csharp)
    
    1. Visual Studio will automatically add the Service Bus extension package. Right-click this package and select **Remove** as you will need to use the preview version.

    1. In Visual Studio, Right-click dependencies, and select **Manage NuGet Packages**.
    :::image type="content" source="./media/functions-secretless-tutorial/20-add-preview-package.png" alt-text="Screenshot of how to add a preview package.":::

    1. Make sure the **include preview** box is checked and search for the package you will be using. 
    
    1. For this tutorial, search **Microsoft.Azure.Webjobs.Extensions.ServiceBus**. For a list of preview versions and NuGet packets of the extensions, visit [the documentation on configuring an identity-based connection](./functions-reference.md#configure-an-identity-based-connection).

    1. Select the extension and verify you are using the latest version of the preview NuGet package.

    1. Select **Install**
    
    # [C# Script](#tab/csharp-script)
    
    1. Visual Studio will automatically add the Service Bus extension package. Right-click this package and select **Remove** as you will need to use the preview version.

    1. In Visual Studio, Right-click dependencies, and select **Manage NuGet Packages**.
    :::image type="content" source="./media/functions-secretless-tutorial/20-add-preview-package.png" alt-text="Screenshot of how to add a preview package.":::

    1. Make sure the **include preview** box is checked and search for the package you will be using. 
    
    1. For this tutorial, search **Microsoft.Azure.Webjobs.Extensions.ServiceBus**. For a list of preview versions and NuGet packets of the extensions, visit [the documentation on configuring an identity-based connection](./functions-reference.md#configure-an-identity-based-connection).

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

## Test your Service Bus Configuration

1. In your application insights, select **Live Metrics** from the left blade.

1. Keeping the previous tab open, in your Service Bus, select **Queues** from the left blade.

1. Select your queue.

1. Select **Service Bus Explorer** from the left blade.

1. Send a test message.

1. Select your open **Live Metrics** tab and see the Service Bus Queue execution.

1. Congratulations! You have successfully set up your service bus queue trigger with managed identities!

## Use Managed Identity for local development

An alternative way to test the service bus trigger is to use managed identities locally to drop a message in the service bus queue and trigger your function.

1. Verify that your Visual Studio is configured to use your account.

1. In the Visual Studio search bar, type **Options** and select the result.

1. In the **Options** menu, select **Azure Service Authentication**, and **Account Selection** to make sure your account is used. 
    :::image type="content" source="./media/functions-secretless-tutorial/24-confirm-visual-studio-account.png" alt-text="Screenshot of the account used by visual studio.":::

### Configure your account with a service bus managed identity

Now, you will add the **Azure Service Bus Data Owner** role assignment for your function app. This is required for using managed identities with the service bus trigger.

1. In your service bus, select **Access Control (IAM)** from the left blade.

1. Select **Add role assignment (Preview)** to open the **Azure role assignments** page. 

1. On the **Role** tab, select **Azure Service Bus Data Owner**.

1. On the **Members** tab, select **User, group, or service principal**, and **+Select members**.

1. Search for your account, and select **Select**.

1. On the **Review + assign** tab, select **Review + assign**.

### Create a new HTTP triggered function app

1. In Visual Studio, create a new function app project.

1. Select **Azure Function**, name your function, and select **Add**.
 
1. Select **HTTP trigger**, and provide an **Authorization Level** of **Function**.

1. Select **Create** to create your function.

1. Add a Service Bus output trigger to your HTTP function using the code below.

    ```csharp
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
        [ServiceBus("queue", Connection = "ServiceBusConnection")] IAsyncCollector<string> message,
        ILogger log)
    {
        log.LogInformation("C# HTTP trigger function processed a request.");
        string msg = req.Query["msg"];
        await message.AddAsync(msg);
        return new OkResult();
    }
    ```

1. In your `local.settings.json`, configure your environment so it knows which namespace the message will be written from. This should be the same as the connection you created earlier and follow the format of `"ServiceBusConnection__fullyQualifiedNamespace": "<YourServiceBusName>.servicebus.windows.net"`.

1. Update your Service Bus extension to the preview versions by following the steps from [earlier in the tutorial](#deploy-a-service-bus-triggered-function-app).

1. Hit F5 to run the function. 

1. In your browser, go to application insights for your function app, and select **Live Metrics** from the left blade. 

1. In another tab in your browser, enter the HTTP trigger url. Example url: `http://localhost:7071/api/Function1?msg=test`

1. Select your open **Live Metrics** tab and see the Service Bus Queue execution.
    :::image type="content" source="./media/functions-secretless-tutorial/25-live-metrics-triggered.png" alt-text="Screenshot of the trigger message from the service bus.":::

1. Congratulations! You have locally tested your service bus managed identity.

[!INCLUDE [clean-up-section-portal](../../includes/clean-up-section-portal.md)]

## Next steps 

In this tutorial, you created a function app with identity-based connections.

Use the following links to learn more Azure Functions with identity-based connections:

- [Managed identity in Azure Functions](../app-service/overview-managed-identity.md)
- [identity-based connections in Azure Functions](./functions-reference.md#configure-an-identity-based-connection)
- [Connecting to host storage with an Identity](./functions-reference.md#connecting-to-host-storage-with-an-identity)
- [Creating a Function App without Azure Files](./storage-considerations.md#create-an-app-without-azure-files)
- [Run Azure Functions from a package file](./run-functions-from-deployment-package.md)
- [Use Key Vault references in Azure Functions](../app-service/app-service-key-vault-references.md)
- [Configuring the account used by Visual Studio for local development](/dotnet/api/azure/identity-readme.md#authenticating-via-visual-studio)
- [Functions documentation for local development](./functions-reference.md#local-development-with-identity-based-connections)