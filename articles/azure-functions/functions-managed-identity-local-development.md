---
title: How to use managed identities during local Azure Functions development 
description: Learn how to leverage identity-based connections to Azure services when developing Functions locally.
ms.topic: how-to
ms.date: 08/09/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
#Customer intent: As a function developer, I want to learn how to use managed identities during local Azure Functions development.
---

# How to use managed identities during local Azure Functions development 

This tutorial shows you how to configure Azure Functions so that you can to connect to Azure services from your local computer by using managed identities instead of using secrets stored in the local.settings.json file. The tutorial is a continuation of the [Functions managed identity tutorial](./functions-managed-identity-tutorial.md). To learn more about identity-based connections, see [Configure an identity-based connection.](functions-reference.md#configure-an-identity-based-connection).

In this tutorial, you'll:

> [!div class="checklist"]
> * 

## Prerequisites

Complete the previous tutorial [Create a function app with identity-based connections][previous tutorial].

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


[previous tutorial]: functions-managed-identity-tutorial.md