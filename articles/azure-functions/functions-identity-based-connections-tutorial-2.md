---
title: Use identity-based connections with Azure Functions triggers and bindings
description: Learn how to use identity-based connections instead of secrets when connecting to a Service Bus queue using Azure Functions.
ms.service: azure-functions
ms.topic: tutorial
ms.date: 06/27/2024
ms.devlang: csharp

#Customer intent: As a function developer, I want to learn how to use managed identities so that I can avoid needing to handle secrets or connection strings in my application settings.
---

# Tutorial: Use identity-based connections instead of secrets with triggers and bindings

This tutorial shows you how to configure Azure Functions to connect to Azure Service Bus queues by using managed identities, instead of secrets stored in the function app settings. The tutorial is a continuation of the [Create a function app without default storage secrets in its definition][previous tutorial] tutorial. To learn more about identity-based connections, see [Configure an identity-based connection.](functions-reference.md#configure-an-identity-based-connection).

While the procedures shown work generally for all languages, this tutorial currently supports C# class library functions on Windows specifically.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create a Service Bus namespace and queue.
> - Configure your function app with a managed identity.
> - Create a role assignment granting that identity permission to read from the Service Bus queue.
> - Create and deploy a function app with a Service Bus trigger.
> - Verify your identity-based connection to the Service Bus.

## Prerequisite

Complete the previous tutorial: [Create a function app with identity-based connections][previous tutorial].

## Create a Service Bus namespace and queue

1. In the [Azure portal](https://portal.azure.com), choose **Create a resource (+)**.

1. On the **Create a resource** page, search for and select **Service Bus**, and then select **Create**.

1. On the **Basics** page, use the following table to configure the Service Bus namespace settings. Use the default values for the remaining options.

    | Option      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Subscription** | Your subscription | The subscription under which your resources are created. |
    | **[Resource group](../azure-resource-manager/management/overview.md)**  | myResourceGroup | The resource group you created with your function app. |
    | **Namespace name** | Globally unique name | The namespace of your instance from which to trigger your function. Because the namespace is publicly accessible, you must use a name that is globally unique across Azure. The name must also be between 6 and 50 characters in length, contain only alphanumeric characters and dashes, and can't start with a number. |
    | **[Location](https://azure.microsoft.com/regions/)** | myFunctionRegion | The region where you created your function app. |
    | **Pricing tier** | Basic | The basic Service Bus tier. |

1. Select **Review + create**. After validation finishes, select **Create**.

1. After deployment completes, select **Go to resource**.

1. In your new Service Bus namespace, select **+ Queue** to add a queue.

1. Enter **myinputqueue** as the new queue's name and select **Create**.

Now that you have a queue, you can add a role assignment to the managed identity of your function app.

## Configure your Service Bus trigger with a managed identity

To use Service Bus triggers with identity-based connections, you need to add the **Azure Service Bus Data Receiver** role assignment to the managed identity in your function app. This role is required when using managed identities to trigger off of your Service Bus namespace. You can also add your own account to this role, which makes it possible to connect to the Service Bus namespace during local testing.

> [!NOTE]
> Role requirements for using identity-based connections vary depending on the service and how you are connecting to it. Needs vary across triggers, input bindings, and output bindings. For more information about specific role requirements, see the trigger and binding documentation for the service.

1. In your Service Bus namespace that you created, select **Access control (IAM)**. This page is where you can view and configure who has access to the resource.  

1. Select **+ Add** and select **Add role assignment**.

1. Search for **Azure Service Bus Data Receiver**, select it, and then select **Next**.

1. On the **Members** tab, under **Assign access to**, choose **Managed Identity**

1. Select **Select members** to open the **Select managed identities** panel.

1. Confirm that the **Subscription** is the one in which you created the resources earlier.

1. In the **Managed identity** selector, choose **Function App** from the **System-assigned managed identity** category. The **Function App** label might have a number in parentheses next to it, indicating the number of apps in the subscription with system-assigned identities.

1. Your app should appear in a list below the input fields. If you don't see it, you can use the **Select** box to filter the results with your app's name.

1. Select your application. It should move down into the **Selected members** section. Select **Select**.

1. Back on the **Add role assignment** screen, select **Review + assign**. Review the configuration, and then select **Review + assign**.

You've granted your function app access to the Service Bus namespace using managed identities.

## Connect to the Service Bus in your function app

1. In the portal, search for the function app you created in the [previous tutorial], or browse to it in the **Function App** page.

1. In your function app, expand **Settings**, and then select **Environment variables**.

1. In the **App settings** tab, select **+ Add** to create a setting. Use the information in the following table to enter the **Name** and **Value** for the new setting:

    | Name      | Value  | Description |
    | ------------ | ---------------- | ----------- |
    | **ServiceBusConnection__fullyQualifiedNamespace** | <SERVICE_BUS_NAMESPACE>.servicebus.windows.net | This setting connects your function app to the Service Bus using an identity-based connection instead of secrets. |

1. Select **Apply**, and then select **Apply** and **Confirm** to save your changes and restart the app function.

> [!NOTE]
> When you use [Azure App Configuration](../../articles/azure-app-configuration/quickstart-azure-functions-csharp.md) or [Key Vault](../key-vault/general/overview.md) to provide settings for Managed Identity connections, setting names should use a valid key separator, such as `:` or `/`, in place of the `__` to ensure names are resolved correctly.
>
> For example, `ServiceBusConnection:fullyQualifiedNamespace`.

Now that you've prepared the function app to connect to the Service Bus namespace using a managed identity, you can add a new function that uses a Service Bus trigger to your local project.

## Add a Service Bus triggered function

1. Run the `func init` command, as follows, to create a functions project in a folder named LocalFunctionProj with the specified runtime:

    ```csharp
    func init LocalFunctionProj --dotnet
    ```

1. Navigate to the project folder:

    ```console
    cd LocalFunctionProj
    ```

1. In the root project folder, run the following command:

    ```command
    dotnet add package Microsoft.Azure.WebJobs.Extensions.ServiceBus --version 5.2.0
    ```

    This command replaces the default version of the Service Bus extension package with a version that supports managed identities.

1. Run the following command to add a Service Bus triggered function to the project:

    ```csharp
    func new --name ServiceBusTrigger --template ServiceBusQueueTrigger 
    ```

    This command adds the code for a new Service Bus trigger and a reference to the extension package. You need to add a Service Bus namespace connection setting for this trigger.

1. Open the new *ServiceBusTrigger.cs* project file and replace the `ServiceBusTrigger` class with the following code:

    ```csharp
    public static class ServiceBusTrigger
    {
        [FunctionName("ServiceBusTrigger")]
        public static void Run([ServiceBusTrigger("myinputqueue", 
            Connection = "ServiceBusConnection")]string myQueueItem, ILogger log)
        {
            log.LogInformation($"C# ServiceBus queue trigger function processed message: {myQueueItem}");
        }
    }
    ```

    This code sample updates the queue name to `myinputqueue`, which is the same name as you queue you created earlier. It also sets the name of the Service Bus connection to `ServiceBusConnection`. This name is the Service Bus namespace used by the identity-based connection `ServiceBusConnection__fullyQualifiedNamespace` you configured in the portal.

> [!NOTE]  
> If you try to run your functions now using `func start`, you'll receive an error. This is because you don't have an identity-based connection defined locally. If you want to run your function locally, set the app setting `ServiceBusConnection__fullyQualifiedNamespace` in `local.settings.json` as you did in [the previous section](#connect-to-the service-bus-in-your-function-app). In addition, you need to assign the role to your developer identity. For more information, see [local development with identity-based connections](./functions-reference.md#local-development-with-identity-based-connections).

> [!NOTE]
> When using [Azure App Configuration](../../articles/azure-app-configuration/quickstart-azure-functions-csharp.md) or [Key Vault](../key-vault/general/overview.md) to provide settings for Managed Identity connections, setting names should use a valid key separator such as `:` or `/` in place of the `__` to ensure names are resolved correctly.
>
> For example, `ServiceBusConnection:fullyQualifiedNamespace`.

## Publish the updated project

1. Run the following command to locally generate the files needed for the deployment package:

    ```console
    dotnet publish --configuration Release
    ```

1. Browse to the `\bin\Release\netcoreapp3.1\publish` subfolder and create a .zip file from its contents.

1. Publish the .zip file by running the following command, replacing the `FUNCTION_APP_NAME`, `RESOURCE_GROUP_NAME`, and `PATH_TO_ZIP` parameters as appropriate:

    ```azurecli
    az functionapp deploy -n FUNCTION_APP_NAME -g RESOURCE_GROUP_NAME --src-path PATH_TO_ZIP
    ```

Now that you've updated the function app with the new trigger, you can verify that it works using the identity.

## Validate your changes

1. In the portal, search for `Application Insights` and select **Application Insights** under **Services**.  

1. In **Application Insights**, browse or search for your named instance.

1. In your instance, select **Live Metrics** under **Investigate**.

1. Keep the previous tab open, and open the Azure portal in a new tab. In your new tab, navigate to your Service Bus namespace, select **Queues** from the left menu.

1. Select your queue named `myinputqueue`.

1. Select **Service Bus Explorer** from the left menu.

1. Send a test message.

1. Select your open **Live Metrics** tab and see the Service Bus queue execution.

Congratulations! You have successfully set up your Service Bus queue trigger with a managed identity.

[!INCLUDE [clean-up-section-portal](../../includes/clean-up-section-portal.md)]

## Next steps

In this tutorial, you created a function app with identity-based connections.

Advance to the next article to learn how to manage identity.
> [!div class="nextstepaction"]
> [Managed identity in Azure Functions](../app-service/overview-managed-identity.md)

[previous tutorial]: ./functions-identity-based-connections-tutorial.md
