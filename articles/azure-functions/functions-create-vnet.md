---
title: Use private endpoints to integrate Azure Functions with a virtual network
description: This tutorial shows you how to connect a function to an Azure virtual network and lock it down by using private endpoints.
ms.topic: article
ms.date: 3/24/2023

#Customer intent: As an enterprise developer, I want to create a function that can connect to a virtual network with private endpoints to secure my function app.
---

# Tutorial: Integrate Azure Functions with an Azure virtual network by using private endpoints

This tutorial shows you how to use Azure Functions to connect to resources in an Azure virtual network by using private endpoints. You create a new function app using a new storage account that's locked behind a virtual network via the Azure portal. The virtual network uses a Service Bus queue trigger.

In this tutorial, you'll:

> [!div class="checklist"]
> * Create a function app in the Elastic Premium plan with virtual network integration and private endpoints.
> * Create Azure resources, such as the Service Bus
> * Lock down your Service Bus behind a private endpoint.
> * Deploy a function app that uses both the Service Bus and HTTP triggers.
> * Test to see that your function app is secure inside the virtual network.
> * Clean up resources.

## Create a function app in a Premium plan

You create a C# function app in an [Elastic Premium plan](./functions-premium-plan.md), which supports networking capabilities such as virtual network integration on create along with serverless scale. This tutorial uses C# and Windows. Other languages and Linux are also supported.

1. On the Azure portal menu or the **Home** page, select **Create a resource**.

1. On the **New** page, select **Compute** > **Function App**.

1. On the **Basics** page, use the following table to configure the function app settings.

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Subscription** | Your subscription | Subscription under which this new function app is created. |
    | **[Resource Group](../azure-resource-manager/management/overview.md)** |  myResourceGroup | Name for the new resource group where you create your function app. |
    | **Function App name** | Globally unique name | Name that identifies your new function app. Valid characters are `a-z` (case insensitive), `0-9`, and `-`.  |
    |**Publish**| Code | Choose to publish code files or a Docker container. |
    | **Runtime stack** | .NET | This tutorial uses .NET. |
    | **Version** | 6 | This tutorial uses .NET 6.0 running [in the same process as the Functions host](./functions-dotnet-class-library.md). |
    |**Region**| Preferred region | Choose a [region](https://azure.microsoft.com/regions/) near you or near other services that your functions access. |
    |**Operating system**| Windows | This tutorial uses Windows but also works for Linux. |
    | **[Plan](./functions-scale.md)** | Premium | Hosting plan that defines how resources are allocated to your function app. By default, when you select **Premium**, a new App Service plan is created. The default **Sku and size** is **EP1**, where *EP* stands for _elastic premium_. For more information, see the list of [Premium SKUs](./functions-premium-plan.md#available-instance-skus).<br/><br/>When you run JavaScript functions on a Premium plan, choose an instance that has fewer vCPUs. For more information, see [Choose single-core Premium plans](./functions-reference-node.md#considerations-for-javascript-functions).  |

1. Select **Next: Hosting**. On the **Hosting** page, enter the following settings.

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **[Storage account](../storage/common/storage-account-create.md)** |  Globally unique name |  Create a storage account used by your function app. Storage account names must be between 3 and 24 characters long. They may contain numbers and lowercase letters only. You can also use an existing account that isn't restricted by firewall rules and meets the [storage account requirements](./storage-considerations.md#storage-account-requirements). When using Functions with a locked down storage account, a v2 storage account is needed. This is the default storage version created when creating a function app with networking capabilities through the create blade. |

1. Select **Next: Networking**. On the **Networking** page, enter the following settings.

    > [!NOTE]
    > Some of these settings aren't visible until other options are selected.

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Enable network injection** |  On | The ability to configure your application with VNet integration at creation appears in the portal window after this option is switched to **On**. |
    | **Virtual Network** | Create New | Select the **Create New** field. In the pop-out screen, provide a name for your virtual network and select **Ok**. Options to restrict inbound and outbound access to your function app on create are displayed. You must explicitly enable VNet integration in the **Outbound access** portion of the window to restrict outbound access. |

    Enter the following settings for the **Inbound access** section. This step creates a private endpoint on your function app. 

    > [!TIP] 
    > To continue interacting with your function app from portal, you'll need to add your local computer to the virtual network. If you don't wish to restrict inbound access, skip this step.
    
    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Enable private endpoints** | On | The ability to configure your application with VNet integration at creation appears in the portal after this option is enabled. |
    | **Private endpoint name** | myInboundPrivateEndpointName | Name that identifies your new function app private endpoint. |
    | **Inbound subnet** | Create New | This option creates a new subnet for your inbound private endpoint. Multiple private endpoints may be added to a singular subnet. Provide a **Subnet Name**. The **Subnet Address Block** may be left at the default value. Select **Ok**. To learn more about subnet sizing, see [Subnets](functions-networking-options.md#subnets). |
    | **DNS** | Azure Private DNS Zone | This value indicates which DNS server your private endpoint uses. In most cases if you're working within Azure, Azure Private DNS Zone is the DNS zone you should use as using **Manual** for custom DNS zones have increased complexity. |
    
    Enter the following settings for the **Outbound access** section. This step integrates your function app with a virtual network on creation. It also exposes options to create private endpoints on your storage account and restrict your storage account from network access on create. When function app is vnet integrated, all outbound traffic by default goes [through the vnet.](../app-service/overview-vnet-integration.md#how-regional-virtual-network-integration-works).
    
    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Enable VNet Integration** | On | This integrates your function app with a VNet on create and direct all outbound traffic through the VNet. |
    | **Outbound subnet** | Create new | This creates a new subnet for your function app's VNet integration. A function app can only be VNet integrated with an empty subnet. Provide a **Subnet Name**. The **Subnet Address Block** may be left at the default value. If you wish to configure it, please learn more about Subnet sizing here. Select **Ok**. The option to create **Storage private endpoints** is displayed. To use your function app with virtual networks, you need to join it to a subnet. |
    
    Enter the following settings for the **Storage private endpoint** section. This step creates private endpoints for the blob, queue, file, and table endpoints on your storage account on create. This effectively integrates your storage account with the VNet.
    
    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Add storage private endpoint** | On | The ability to configure your application with VNet integration at creation is displayed in the portal after this option is enabled. |
    | **Private endpoint name** | myInboundPrivateEndpointName | Name that identifies your storage account private endpoint. |
    | **Private endpoint subnet** | Create New | This creates a new subnet for your inbound private endpoint on the storage account. Multiple private endpoints may be added to a singular subnet. Provide a **Subnet Name**. The **Subnet Address Block** may be left at the default value. If you wish to configure it, please learn more about Subnet sizing here. Select **Ok**. |
    | **DNS** | Azure Private DNS Zone | This value indicates which DNS server your private endpoint uses. In most cases if you're working within Azure, Azure Private DNS Zone is the DNS zone you should use as using **Manual** for custom DNS zones will have increased complexity. |

1. Select **Next: Monitoring**. On the **Monitoring** page, enter the following settings.

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **[Application Insights](./functions-monitoring.md)** | Default | Create an Application Insights resource of the same app name in the nearest supported region. Expand this setting if you need to change the **New resource name** or store your data in a different **Location** in an [Azure geography](https://azure.microsoft.com/global-infrastructure/geographies/). |

1. Select **Review + create** to review the app configuration selections.

1. On the **Review + create** page, review your settings. Then select **Create** to create and deploy the function app.

1. In the upper-right corner of the portal, select the **Notifications** icon and watch for the **Deployment succeeded** message.

1. Select **Go to resource** to view your new function app. You can also select **Pin to dashboard**. Pinning makes it easier to return to this function app resource from your dashboard.

Congratulations! You've successfully created your premium function app.

> [!NOTE] 
> Some deployments may occassionally fail to create the private endpoints in the storage account with the error 'StorageAccountOperationInProgress'. This failure occurs even though the function app itself gets created successfully. When you encounter such an error, delete the function app and retry the operation. You can instead create the private endpoints on the storage account manually. 

### Create a Service Bus

Next, you create a Service Bus instance that is used to test the functionality of your function app's network capabilities in this tutorial.

1. On the Azure portal menu or the **Home** page, select **Create a resource**.

1. On the **New** page, search for *Service Bus*. Then select **Create**.

1. On the **Basics** tab, use the following table to configure the Service Bus settings. All other settings can use the default values.

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Subscription** | Your subscription | The subscription in which your resources are created. |
    | **[Resource group](../azure-resource-manager/management/overview.md)**  | myResourceGroup | The resource group you created with your function app. |
    | **Namespace name** | myServiceBus| The name of the Service Bus instance for which the private endpoint is enabled. |
    | **[Location](https://azure.microsoft.com/regions/)** | myFunctionRegion | The region where you created your function app. |
    | **Pricing tier** | Premium | Choose this tier to use private endpoints with Azure Service Bus. |

1. Select **Review + create**. After validation finishes, select **Create**.

## Lock down your Service Bus

Create the private endpoint to lock down your Service Bus:

1. In your new Service Bus, in the menu on the left, select **Networking**.

1. On the **Private endpoint connections** tab, select **Private endpoint**.

    :::image type="content" source="./media/functions-create-vnet/3-navigate-private-endpoint-service-bus.png" alt-text="Screenshot of how to go to private endpoints for the Service Bus.":::

1. On the **Basics** tab, use the private endpoint settings shown in the following table.

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Subscription** | Your subscription | The subscription in which your resources are created. | 
    | **[Resource group](../azure-resource-manager/management/overview.md)**  | myResourceGroup | The resource group you created with your function app. |
    | **Name** | sb-endpoint | The name of the private endpoint for the service bus. |
    | **[Region](https://azure.microsoft.com/regions/)** | myFunctionRegion | The region where you created your storage account. |

1. On the **Resource** tab, use the private endpoint settings shown in the following table.

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Subscription** | Your subscription | The subscription under which your resources are created. | 
    | **Resource type**  | Microsoft.ServiceBus/namespaces | The resource type for the Service Bus. |
    | **Resource** | myServiceBus | The Service Bus you created earlier in the tutorial. |
    | **Target subresource** | namespace | The private endpoint that is used for the namespace from the Service Bus. |

1. On the **Virtual Network** tab, for the **Subnet** setting, choose **default**.

1. Select **Review + create**. After validation finishes, select **Create**. 
1. After the private endpoint is created, return to the **Networking** section of your Service Bus namespace and check the **Public Access** tab.
1. Ensure **Selected networks** is selected.
1. Select **+ Add existing virtual network** to add the recently created virtual network.
1. On the **Add networks** tab, use the network settings from the following table:

    | Setting | Suggested value | Description|
    |---------|-----------------|------------|
    | **Subscription** | Your subscription | The subscription under which your resources are created. |
    | **Virtual networks** | myVirtualNet | The name of the virtual network to which your function app connects. |
    | **Subnets** | functions | The name of the subnet to which your function app connects. |

1. Select **Add your client IP address** to give your current client IP access to the namespace.
    > [!NOTE]
    > Allowing your client IP address is necessary to enable the Azure portal to [publish messages to the queue later in this tutorial](#test-your-locked-down-function-app).
1. Select **Enable** to enable the service endpoint.
1. Select **Add** to add the selected virtual network and subnet to the firewall rules for the Service Bus.
1. Select **Save** to save the updated firewall rules.

Resources in the virtual network can now communicate with the Service Bus using the private endpoint.

## Create a queue

Create the queue where your Azure Functions Service Bus trigger gets events:

1. In your Service Bus, in the menu on the left, select **Queues**.

1. Select **Queue**. For the purposes of this tutorial, provide the name *queue* as the name of the new queue.

    :::image type="content" source="./media/functions-create-vnet/6-create-queue.png" alt-text="Screenshot of how to create a Service Bus queue.":::

1. Select **Create**.

## Get a Service Bus connection string

1. In your Service Bus, in the menu on the left, select **Shared access policies**.

1. Select **RootManageSharedAccessKey**. Copy and save the **Primary Connection String**. You need this connection string when you configure the app settings.

    :::image type="content" source="./media/functions-create-vnet/7-get-service-bus-connection-string.png" alt-text="Screenshot of how to get a Service Bus connection string.":::

## Configure your function app settings

1. In your function app, in the menu on the left, select **Configuration**.

1. To use your function app with virtual networks and service bus, update the app settings shown in the following table. To add or edit a setting, select **+ New application setting** or the **Edit** icon in the rightmost column of the app settings table. When you finish, select **Save**.

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **SERVICEBUS_CONNECTION** | myServiceBusConnectionString | Create this app setting for the connection string of your Service Bus. This storage connection string is from the [Get a Service Bus connection string](#get-a-service-bus-connection-string) section.|
    | **WEBSITE_CONTENTOVERVNET** | 1 | Create this app setting. A value of 1 enables your function app to scale when your storage account is restricted to a virtual network. |

1. Since you're using an Elastic Premium hosting plan, In the **Configuration** view, select the **Function runtime settings** tab. Set **Runtime Scale Monitoring** to **On**. Then select **Save**. Runtime-driven scaling allows you to connect non-HTTP trigger functions to services that run inside your virtual network.

    :::image type="content" source="./media/functions-create-vnet/11-enable-runtime-scaling.png" alt-text="Screenshot of how to enable runtime-driven scaling for Azure Functions.":::

> [!NOTE] 
> Runtime scaling isn't needed for function apps hosted in a Dedicated App Service plan.

## Deploy a Service Bus trigger and HTTP trigger

> [!NOTE]
> Enabling private endpoints on a function app also makes the Source Control Manager (SCM) site publicly inaccessible. The following instructions give deployment directions using the Deployment Center within the function app. Alternatively, use [zip deploy](functions-deployment-technologies.md#zip-deploy) or [self-hosted](/azure/devops/pipelines/agents/docker) agents that are deployed into a subnet on the virtual network.

1. In GitHub, go to the following sample repository. It contains a function app and two functions, an HTTP trigger, and a Service Bus queue trigger.

    <https://github.com/Azure-Samples/functions-vnet-tutorial>

1. At the top of the page, select **Fork** to create a fork of this repository in your own GitHub account or organization.

1. In your function app, in the menu on the left, select **Deployment Center**. Then select **Settings**.

1. On the **Settings** tab, use the deployment settings shown in the following table.

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Source** | GitHub | You should have created a GitHub repository for the sample code in step 2. | 
    | **Organization**  | myOrganization | The organization your repo is checked into. It's usually your account. |
    | **Repository** | functions-vnet-tutorial | The repository forked from https://github.com/Azure-Samples/functions-vnet-tutorial. |
    | **Branch** | main | The main branch of the repository you created. |
    | **Runtime stack** | .NET | The sample code is in C#. |
    | **Version** | .NET Core 3.1 | The runtime version. |

1. Select **Save**. 

    :::image type="content" source="./media/functions-create-vnet/12-deploy-portal.png" alt-text="Screenshot of how to deploy Azure Functions code through the portal.":::

1. Your initial deployment might take a few minutes. When your app is successfully deployed, on the **Logs** tab, you see a **Success (Active)** status message. If necessary, refresh the page.

Congratulations! You've successfully deployed your sample function app.

### Test your locked-down function app

1. In your function app, in the menu on the left, select **Functions**.

1. Select **ServiceBusQueueTrigger**.

1. In the menu on the left, select **Monitor**. 
 
You see that you can't monitor your app. Your browser doesn't have access to the virtual network, so it can't directly access resources within the virtual network. 
 
Here's an alternative way to monitor your function by using Application Insights:

1. In your function app, in the menu on the left, select **Application Insights**. Then select **View Application Insights data**.

    :::image type="content" source="./media/functions-create-vnet/16-app-insights.png" alt-text="Screenshot of how to view application insights for a function app.":::

1. In the menu on the left, select **Live metrics**.

1. Open a new tab. In your Service Bus, in the menu on the left, select **Queues**.

1. Select your queue.

1. In the menu on the left, select **Service Bus Explorer**. Under **Send**, for **Content Type**, choose **Text/Plain**. Then enter a message. 

1. Select **Send** to send the message.

    :::image type="content" source="./media/functions-create-vnet/17-send-service-bus-message.png" alt-text="Screenshot of how to send Service Bus messages by using the portal.":::

1. On the **Live metrics** tab, you should see that your Service Bus queue trigger has fired. If it hasn't, resend the message from **Service Bus Explorer**.

    :::image type="content" source="./media/functions-create-vnet/18-hello-world.png" alt-text="Screenshot of how to view messages by using live metrics for function apps.":::

Congratulations! You've successfully tested your function app setup with private endpoints.

## Understand private DNS zones
You've used a private endpoint to connect to Azure resources. You're connecting to a private IP address instead of the public endpoint. Existing Azure services are configured to use an existing DNS to connect to the public endpoint. You must override the DNS configuration to connect to the private endpoint.

A private DNS zone is created for each Azure resource that was configured with a private endpoint. A DNS record is created for each private IP address associated with the private endpoint.

The following DNS zones were created in this tutorial:

- privatelink.file.core.windows.net
- privatelink.blob.core.windows.net
- privatelink.servicebus.windows.net
- privatelink.azurewebsites.net

[!INCLUDE [clean-up-section-portal](../../includes/clean-up-section-portal.md)]

## Next steps

In this tutorial, you created a Premium function app, storage account, and Service Bus. You secured all of these resources behind private endpoints. 

Use the following links to learn more Azure Functions networking options and private endpoints:

- [How to configure Azure Functions with a virtual network](./configure-networking-how-to.md)
- [Networking options in Azure Functions](./functions-networking-options.md)
- [Azure Functions Premium plan](./functions-premium-plan.md)
- [Service Bus private endpoints](../service-bus-messaging/private-link-service.md)
- [Azure Storage private endpoints](../storage/common/storage-private-endpoints.md)
