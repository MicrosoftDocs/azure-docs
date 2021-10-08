---
title: How to configure a secretless Azure Functions service queue with identity-based connections
description: Article that shows you how to use identity-based connections with a service queue instead of connection strings, and how to use managed identities locally.
ms.topic: conceptual
ms.date: 3/13/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Tutorial: Configuring a Secretless Service Bus Queue Trigger with Identity-Based Connections

This tutorial shows you how to configure Azure Functions to connect to Azure Service Bus queues using managed identities instead of secrets stored in the function app settings. The tutorial is a continuation of the [Functions managed identity tutorial](./functions-managed-identity-tutorial.md). To learn more about identity-based connections, see [Configure an identity-based connection.](functions-reference.md#configure-an-identity-based-connection).

In this tutorial, you'll:

> [!div class="checklist"]
> * Create a service bus namespace and queue.
> * Configure your function app with a service bus queue managed identity
> * Create and deploy a function app with a service bus trigger.
> * verify your storage queue with managed identity in portal
> * verify your service bus queue with managed identity in a local environment

## Prerequisites

Complete the previous tutorial [Create a function app with identity-based connections][previous tutorial].

## Create a service bus and queue

1. In the [Azure portal](https://portal.azure.com), choose **Create a resource (+)**.

1. On the **Create a resource** page, search for *service bus*, select **Service Bus**, and then select **Create**.

1. On the **New** page, search for *Service Bus*. Then select **Create**.

1. On the **Basics** tab in the **Create namespace** page, use the following table to configure the Service Bus namespace settings. Use the default values for the remaining options.

    | Option      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Subscription** | Your subscription | The subscription under which your resources are created. |
    | **[Resource group](../azure-resource-manager/management/overview.md)**  | myResourceGroup | The resource group you created with your function app. |
    | **Namespace name** | myServiceBus-uniqueid | The namespace of your instance from which to trigger your function. Because the namespace is publicly accessible, you must use a name that is globally unique across Azure. The name must also be between 6 and 50 characters in length, contain only alphanumeric characters and dashes, and can't start with a number. | 
    | **[Location](https://azure.microsoft.com/regions/)** | myFunctionRegion | The region where you created your function app. |
    | **Pricing tier** | Basic | The basic Service Bus tier. |

1. Select **Review + create**. After validation finishes, select **Create**.

1. After deployment completes, select **Go to resource**.

1. In your new Service Bus namespace, select **Queues** under **Entities** and then **+ Queue** to add a queue.

1. Type `myinputqueue` as the name the new queue and select **Create**. 

Now, that you have a queue, you can add the **Azure Service Bus Data Owner** role assignment to the managed identity in your function app. This role is required when using managed identities to connect to your service bus namespace. You can also add your own account to this role, which makes it possible to connect to the service bus namespace during local testing.

## Configure Service Bus with a managed identity

1. In your service bus namespace, select **Access Control (IAM)** and in the **Check access** tab select **Add role assignment (preview)** in **Grant access to this resource**.

    :::image type="content" source="./media/functions-secretless-tutorial/21-service-bus-IAM.png" alt-text="Screenshot of how to add a service bus IAM.":::

1. In the **Azure role assignments** page on the **Role** tab, select **Azure Service Bus Data Owner** > **Next**.

1. On the **Members** tab, select **Managed Identity**, and **+ Select members**. 

1. In **Select managed identities**, select **System assigned** > **Function App**, select your function app, and choose **Select**. 

    :::image type="content" source="./media/functions-secretless-tutorial/22-add-service-bus-managed-identity.png" alt-text="Screenshot of how to add managed identity to service bus.":::

    This adds the managed identity of your function app to the role.

1. Switch to **User, group, or service principal**, choose **+ Select members**, select your user account and choose **Select**. This adds your user account to the role, which makes it possible to connect to the namespace when running locally. 

    If you already completed the [Tutorial: Creating a Secretless Storage Queue Trigger with Identity-Based Connections](functions-managed-identity-storage-queue.md), you may have already added your account to the role.

1. Choose **Next** > **Review + assign**.

Now you've granted your function app access to the service bus namespace using managed identities, and you granted your user account the same access. Now your trigger can connect to Service Bus without using a connection string both when running in your function app in Azure and when running on your local computer. 

## Connect to Service Bus in your function app

1. In the portal, search for the function app you created in the [previous tutorial]. You can also browse to it in the **Function App** page. 

1. In your function app, select **Configuration** under **Settings**.
 
1. In **Application settings**, select **+ New application setting** to create two new settings based on the following table.

    | Name      | Value  | Description |
    | ------------ | ---------------- | ----------- |
    | **ServiceBusConnection__fullyQualifiedNamespace** | <SERVICE_BUS_NAMESPACE>.servicebus.windows.net | Functions treats this settings as a connection named **ServiceBusConnection**. The value is the fully-qualified service bus namespace you just created. |
    |**ServiceBusConnection__credential**| managedIdentity     | Specifies that managed identity is used by the connection. |

    To learn more, see [Connection properties](functions-reference.md#connection-properties).

1. After you create the two settings, select **Save** > **Confirm**.

Now that you've prepared the function app to connect to the service bus namespace using managed identities, you can add a new function that uses a Service Bus trigger to your local project.

## Add a Service Bus triggered function

1. On your local computer, navigate to the location where you created your original function project in the [previous tutorial].

1. Run the following command to add a Service Bus triggered function to the project:

    ```csharp
    func new --name ServiceBusTrigger --template ServiceBusQueueTrigger 
    ``` 

    This adds the code for a new Service Bus trigger and a reference to the extension package. You need to add a service bus namespace connection setting for this trigger and update the package to a version that supports managed identities.  

1. Open the new ServiceBusTrigger.cs project file and replace the `ServiceBusTrigger` class with the following code:

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

    This version updates the queue name to `myinputqueue`, which is the same name as you queue you created earlier. It also sets the name of the service bus namespace connection string setting to `ServiceBusConnection`. This is the base connection name for the two new settings that work with managed identities, which you added earlier.
 
1. In the root project folder, run the following commands:

    ```command
    dotnet remove package Microsoft.Azure.Webjobs.Extensions.ServiceBus
    dotnet add package Microsoft.Azure.Webjobs.Extensions.ServiceBus --prerelease
    ```
    
    This replaces the default version of the Service Bus extension package with a version that supports managed identities. 

<!---1. Update your extension version to the preview extensions that support identity-based connections.

    # [C#](#tab/csharp)
    
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
--->

> [!NOTE]  
> If you try to run your functions now using `func start` you'll receive an error. This is because you don't have a connection string named `ServiceBusConnection` defined in your local.settings.json file. To be able to run locally, you'd have to get the connection string for the service bus namespace and add it as the value for the `ServiceBusConnection` key in the `Values` collection of your local.settings.json file. If you are using Visual Studio, you can configure the local project to support managed identities instead of a connection string. To learn more, see [How to use managed identities during local Azure Functions development](functions-managed-identity-local-development.md).  

## Publish the updated project

1. Run the following command to locally generate the files needed for the deployment package:
 
    ```console
    dotnet publish --configuration Release
    ```

1. Browse to the `\bin\Release\netcoreapp3.1\publish` subfolder and replace the existing .zip file of this folder with an updated package.

1. Return to the [Azure portal](https://portal.azure.com), and search for your storage account name or browse for it in storage accounts.

1. Under **Data storage** select **Containers**, select the **deployments** container, or the container from which you publish your project. You should see your project's existing package file.

1. Select **Upload**, and in **Upload blob** check **Overwrite if files already exist**.

1. Select a file, choose your updated package file from your local computer, and select **Upload**.  

Now that you have updated the function app with the new trigger, you can verify that it works with managed identities instead of a connection string.

## Validate your changes

1. In the portal, search for `Application Insights` and select **Application Insights** under **Services**.  

1. In **Application Insights**, browse or search for your named instance. 

1. In your instance, select **Live Metrics** under **Investigate**.

1. Keeping the previous tab open, in your Service Bus, select **Queues** from the left blade.

1. Select your queue named `myinputqueue`.

1. Select **Service Bus Explorer** from the left blade.

1. Send a test message.

1. Select your open **Live Metrics** tab and see the Service Bus Queue execution.

1. Congratulations! You have successfully set up your service bus queue trigger with managed identities!

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