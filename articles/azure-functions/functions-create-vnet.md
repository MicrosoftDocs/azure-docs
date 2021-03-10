---
title: Use private endpoints to integrate Azure Functions with a virtual network
description: A step-by-step tutorial that shows you how to connect a function to an Azure virtual network and lock it down with private endpoints
ms.topic: article
ms.date: 2/22/2021

#Customer intent: As an enterprise developer, I want to create a function that can connect to a virtual network with private endpoints to secure my function app.
---

# Tutorial: Integrate Azure Functions with an Azure virtual network using private endpoints

This tutorial shows you how to use Azure Functions to connect to resources in an Azure virtual network with private endpoints. You'll create a function with a storage account locked behind a virtual network that uses a service bus queue trigger.

> [!div class="checklist"]
> * Create a function app in the Premium plan
> * Create Azure resources (Service Bus, Storage Account, Virtual Network)
> * Lock down your Storage account behind a private endpoint
> * Lock down your Service Bus behind a private endpoint
> * Deploy a function app with both Service Bus and HTTP triggers.
> * Lock down your function app behind a private endpoint
> * Test to see that your function app is secure behind the virtual network
> * Clean up resources

## Create a function app in a Premium plan

First, you create a .NET function app in the [Premium plan] as this tutorial will use C#. Other languages are also supported in Windows. This plan provides serverless scale while supporting virtual network integration.

1. From the Azure portal menu or the **Home** page, select **Create a resource**.

1. In the **New** page, select **Compute** > **Function App**.

1. On the **Basics** page, use the function app settings as specified in the following table:

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Subscription** | Your subscription | The subscription under which this new function app is created. |
    | **[Resource Group](../azure-resource-manager/management/overview.md)** |  *myResourceGroup* | Name for the new resource group in which to create your function app. |
    | **Function App name** | Globally unique name | Name that identifies your new function app. Valid characters are `a-z` (case insensitive), `0-9`, and `-`.  |
    |**Publish**| Code | Option to publish code files or a Docker container. |
    | **Runtime stack** | .NET | This tutorial uses .NET |
    |**Region**| Preferred region | Choose a [region](https://azure.microsoft.com/regions/) near you or near other services your functions access. |

1. Select **Next: Hosting**. On the **Hosting** page, enter the following settings:

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **[Storage account](../storage/common/storage-account-create.md)** |  Globally unique name |  Create a storage account used by your function app. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. You can also use an existing account, which must meet the [storage account requirements](./storage-considerations.md#storage-account-requirements). |
    |**Operating system**| Windows | This tutorial uses Windows |
    | **[Plan](./functions-scale.md)** | Premium | Hosting plan that defines how resources are allocated to your function app. Select **Premium**. By default, a new App Service plan is created. The default **Sku and size** is **EP1**, where EP stands for _elastic premium_. To learn more, see the [list of Premium SKUs](./functions-premium-plan.md#available-instance-skus).<br/>When running JavaScript functions on a Premium plan, you should choose an instance that has fewer vCPUs. For more information, see [Choose single-core Premium plans](./functions-reference-node.md#considerations-for-javascript-functions).  |

1. Select **Next: Monitoring**. On the **Monitoring** page, enter the following settings:

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **[Application Insights](./functions-monitoring.md)** | Default | Creates an Application Insights resource of the same *App name* in the nearest supported region. By expanding this setting, you can change the **New resource name** or choose a different **Location** in an [Azure geography](https://azure.microsoft.com/global-infrastructure/geographies/) to store your data. |

1. Select **Review + create** to review the app configuration selections.

1. On the **Review + create** page, review your settings, and then select **Create** to provision and deploy the function app.

1. Select the **Notifications** icon in the upper-right corner of the portal and watch for the **Deployment succeeded** message.

1. Select **Go to resource** to view your new function app. You can also select **Pin to dashboard**. Pinning makes it easier to return to this function app resource from your dashboard.

1. Congratulations! You've successfully created your premium function app!

## Create Azure resources

### Create a storage account

A separate storage account from the one created in the initial creation of your function app is required for virtual networks.

1. From the Azure portal menu or the **Home** page, select **Create a resource**.

1. In the New page, search for **Storage Account** and select **Create**

1. On the **Basics** tab, set the settings as specified in the table below. The rest can be left as default:

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Subscription** | Your subscription | The subscription under which your resources are created. | 
    | **[Resource group](../azure-resource-manager/management/overview.md)**  | myResourceGroup | Choose the resource group you created with your function app. |
    | **Name** | mysecurestorage| The name of your storage account to which the private endpoint will be applied to. |
    | **[Region](https://azure.microsoft.com/regions/)** | myFunctionRegion | Choose the region you created your function app in. |

1. Select **Review + create**. After validation completes, select **Create**.

### Create a Service Bus

1. From the Azure portal menu or the **Home** page, select **Create a resource**.

1. In the New page, search for **Service Bus** and select **Create**.

1. On the **Basics** tab, set the settings as specified in the table below. The rest can be left as default:

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Subscription** | Your subscription | The subscription under which your resources are created. |
    | **[Resource group](../azure-resource-manager/management/overview.md)**  | myResourceGroup | Choose the resource group you created with your function app. |
    | **Name** | myServiceBus| The name of your service bus to which the private endpoint will be applied to. |
    | **[Region](https://azure.microsoft.com/regions/)** | myFunctionRegion | Choose the region you created your function app in. |
    | **Pricing tier** | Premium | Choose this tier to use private endpoints with Service Bus. |

1. Select **Review + create**. After validation completes, select **Create**.

### Create a virtual network

Azure resources in this tutorial either integrate with or are placed within a virtual network. You'll use private endpoints to keep network traffic contained with the virtual network.

The tutorial creates two subnets:
- **default**: Subnet for private endpoints. Private IP addresses are given from this subnet.
- **functions**: Subnet for Azure Functions virtual network integration. This subnet is delegated to the function app.

Now, create the virtual network to which the function app integrates.

1. From the Azure portal menu or the Home page, select **Create a resource**.

1. In the New page, search for **Virtual Network** and select **Create**.

1. On the **Basics** tab, use the virtual network settings as specified below:

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Subscription** | Your subscription | The subscription under which your resources are created. | 
    | **[Resource group](../azure-resource-manager/management/overview.md)**  | myResourceGroup | Choose the resource group you created with your function app. |
    | **Name** | myVirtualNet| The name of your virtual network to which your function app will connect. |
    | **[Region](https://azure.microsoft.com/regions/)** | myFunctionRegion | Choose the region you created your function app in. |

1. On the **IP Addresses** tab, select **Add subnet**. Use the settings as specified below when adding a subnet:

    :::image type="content" source="./media/functions-create-vnet/1-create-vnet-ip-address.png" alt-text="Screenshot of the create virtual network configuration view.":::

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Subnet name** | functions | The name of the subnet your function app will connect to. | 
    | **Subnet address range** | 10.0.1.0/24 | Notice our IPv4 address space in the image above is 10.0.0.0/16. If the above was 10.1.0.0/16, the recommended *Subnet address range* would be 10.1.1.0/24. |

1. Select **Review + create**. After validation completes, select **Create**.

## Lock down your storage account with private endpoints

Azure Private Endpoints are used to connect to specific Azure resources using a private IP address. This connection ensures that network traffic remains within the chosen virtual network, and access is available only for specific resources. Now, create the private endpoints for Azure File storage and Azure Blob storage with your storage account.

1. In your new storage account, select **Networking** in the left menu.

1. Select the **Private endpoint connections** tab, and select **Private endpoint**.

    :::image type="content" source="./media/functions-create-vnet/2-navigate-private-endpoint-store.png" alt-text="Screenshot of how to navigate to create private endpoints for the storage account.":::

1. On the **Basics** tab, use the private endpoint settings as specified below:

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Subscription** | Your subscription | The subscription under which your resources are created. | 
    | **[Resource group](../azure-resource-manager/management/overview.md)**  | myResourceGroup | Choose the resource group you created with your function app. | |
    | **Name** | file-endpoint | The name of the private endpoint for files from your storage account. |
    | **[Region](https://azure.microsoft.com/regions/)** | myFunctionRegion | Choose the region you created your storage account in. |

1. On the **Resource** tab, use the private endpoint settings as specified below:

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Subscription** | Your subscription | The subscription under which your resources are created. | 
    | **Resource type**  | Microsoft.Storage/storageAccounts | This is the resource type for storage accounts. |
    | **Resource** | mysecurestorage | The storage account you just created |
    | **Target sub-resource** | file | This private endpoint will be used for files from the storage account. |

1. On the **Configuration** tab, choose **default** for the Subnet setting.

1. Select **Review + create**. After validation completes, select **Create**. Resources in the virtual network can now talk to storage files.

1. Create another private endpoint for blobs. For the **Resources** tab, use the below settings. For all other settings, use the same settings from the file private endpoint creation steps you just followed.

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Subscription** | Your subscription | The subscription under which your resources are created. | 
    | **Resource type**  | Microsoft.Storage/storageAccounts | This is the resource type for storage accounts. |
    | **Resource** | mysecurestorage | The storage account you just created |
    | **Target sub-resource** | blob | This private endpoint will be used for blobs from the storage account. |

## Lock down your service bus with a private endpoint

Now, create the private endpoint for your Azure Service Bus.

1. In your new service bus, select **Networking** in the left menu.

1. Select the **Private endpoint connections** tab, and select **Private endpoint**.

    :::image type="content" source="./media/functions-create-vnet/3-navigate-private-endpoint-service-bus.png" alt-text="Screenshot of how to navigate to private endpoints for service bus.":::

1. On the **Basics** tab, use the private endpoint settings as specified below:

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Subscription** | Your subscription | The subscription under which your resources are created. | 
    | **[Resource group](../azure-resource-manager/management/overview.md)**  | myResourceGroup | Choose the resource group you created with your function app. |
    | **Name** | sb-endpoint | The name of the private endpoint for files from your storage account. |
    | **[Region](https://azure.microsoft.com/regions/)** | myFunctionRegion | Choose the region you created your storage account in. |

1. On the **Resource** tab, use the private endpoint settings as specified below:

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Subscription** | Your subscription | The subscription under which your resources are created. | 
    | **Resource type**  | Microsoft.ServiceBus/namespaces | This is the resource type for Service Bus. |
    | **Resource** | myServiceBus | The Service Bus you created earlier in the tutorial. |
    | **Target subresource** | namespace | This private endpoint will be used for the namespace from the service bus. |

1. On the **Configuration** tab, choose **default** for the Subnet setting.

1. Select **Review + create**. After validation completes, select **Create**. Resources in the virtual network can now talk to service bus.

## Create a file share

1. In the storage account you created, select **File shares** in the left menu.

1. Select **+ File shares**. Provide **files** as the name for the file share for the purposes of this tutorial.

    :::image type="content" source="./media/functions-create-vnet/4-create-file-share.png" alt-text="Screenshot of how to create a file share in the storage account.":::

## Get storage account connection string

1. In the storage account you created, select **Access keys** in the left menu.

1. Select **Show keys**. Copy the connection string of key1, and save it. We'll need this connection string later when configuring the app settings.

    :::image type="content" source="./media/functions-create-vnet/5-get-store-connection-string.png" alt-text="Screenshot of how to get a storage account connection string.":::

## Create a queue

This will be the queue for which your Azure Functions Service Bus Trigger will get events from.

1. In your service bus, select **Queues** in the left menu.

1. Select **Shared access policies**. Provide **queue** as the name for the queue for the purposes of this tutorial.

    :::image type="content" source="./media/functions-create-vnet/6-create-queue.png" alt-text="Screenshot of how to create a service bus queue.":::

## Get service bus connection string

1. In your service bus, select **Shared access policies** in the left menu.

1. Select **RootManageSharedAccessKey**. Copy the **Primary Connection String**, and save it. We'll need this connection string later when configuring the app settings.

    :::image type="content" source="./media/functions-create-vnet/7-get-service-bus-connection-string.png" alt-text="Screenshot of how to get a service bus connection string.":::

## Integrate function app with your virtual network

To use your function app with virtual networks, you'll need to join it to a subnet. We use a specific subnet for the Azure Functions virtual network integration and the default sub net for all other private endpoints created in this tutorial.

1. In your function app, select **Networking** in the left menu.

1. Select **Click here to configure** under VNet Integration.

    :::image type="content" source="./media/functions-create-vnet/8-connect-app-vnet.png" alt-text="Screenshot of how to navigate to virtual network integration.":::

1. Select **Add VNet**

1. In the blade that opens up under **Virtual Network**, select the virtual network you created earlier.

1. Select the **Subnet** we created earlier called **functions**. Your function app is now integrated with your virtual network!

    :::image type="content" source="./media/functions-create-vnet/9-connect-app-subnet.png" alt-text="Screenshot of how to connect a function app to a subnet.":::

## Configure your function app settings for private endpoints

1. In your function app, select **Configuration** from the left menu.

1. To use your function app with virtual networks, the following app settings will need to be updated. Select **+ New application setting** or the pencil by **Edit** in the rightmost column of the app settings table as appropriate. When done, select **Save**.

    :::image type="content" source="./media/functions-create-vnet/10-configure-app-settings.png" alt-text="Screenshot of how to configure function app settings for private endpoints.":::

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **AzureWebJobsStorage** | mysecurestorageConnectionString | The connection string of the storage account you created. This is the storage connection string from [Get storage account connection string](#get-storage-account-connection-string). By changing this setting, your function app will now use the secure storage account for normal operations at runtime. | 
    | **WEBSITE_CONTENTAZUREFILECONNECTIONSTRING**  | mysecurestorageConnectionString | The connection string of the storage account you created. By changing this setting, your function app will now use the secure storage account for Azure Files, which are used when deploying. |
    | **WEBSITE_CONTENTSHARE** | files | The name of the file share you created in the storage account. This app setting is used in conjunction with WEBSITE_CONTENTAZUREFILECONNECTIONSTRING. |
    | **SERVICEBUS_CONNECTION** | myServiceBusConnectionString | Create an app setting for the connection string of your service bus. This is the storage connection string from [Get service bus connection string](#get-service-bus-connection-string).|
    | **WEBSITE_CONTENTOVERVNET** | 1 | Create this app setting. A value of 1 enables your function app to scale when you have your storage account restricted to a virtual network. You should enable this setting when restricting your storage account to a virtual network. |
    | **WEBSITE_DNS_SERVER** | 168.63.129.16 | Create this app setting. Once your app integrates with a virtual network, it will use the same DNS server as the virtual network. This is one of two settings needed have your function app work with Azure DNS private zones and are required when using private endpoints. These settings will send all outbound calls from your app into your virtual network. |
    | **WEBSITE_VNET_ROUTE_ALL** | 1 | Create this app setting. Once your app integrates with a virtual network, it will use the same DNS server as the virtual network. This is one of two settings needed have your function app work with Azure DNS private zones and are required when using private endpoints. These settings will send all outbound calls from your app into your virtual network. |

1. Staying on the **Configuration** view, select the **Function runtime settings** tab.

1. Set **Runtime Scale Monitoring** to **On**, and select **Save**. Runtime driven scaling allows you to connect non-HTTP trigger functions to services running inside your virtual network.

    :::image type="content" source="./media/functions-create-vnet/11-enable-runtime-scaling.png" alt-text="Screenshot of how to enable Runtime Driven Scaling for Azure Functions.":::

## Deploy a service bus trigger and http trigger to your function app

1. In GitHub, browse to the following sample repository, which contains a function app with two functions, an HTTP Trigger and a Service Bus Queue Trigger.

    <https://github.com/Azure-Samples/functions-vnet-tutorial>

1. At the top of the page, select the **Fork** button to create a fork of this repository in your own GitHub account or organization.

1. In your function app, select **Deployment Center** from the left menu. Then, select **Settings**.

1. On the **Settings** tab, use the deployment settings as specified below:

    | Setting      | Suggested value  | Description      |
    | ------------ | ---------------- | ---------------- |
    | **Source** | GitHub | You should have created a GitHub repo with the sample code in step 2. | 
    | **Organization**  | myOrganization | This is the organization your repo is checked into, usually your account. |
    | **Repository** | myRepo | The repo you created with the sample code. |
    | **Branch** | main | This is the repo you just created, so use the main branch. |
    | **Runtime stack** | .NET | The sample code is in C#. |

1. Select **Save**. 

    :::image type="content" source="./media/functions-create-vnet/12-deploy-portal.png" alt-text="Screenshot of how to deploy Azure Functions code through the portal.":::

1. Your initial deployment may take a few minutes. You will see a **Success (Active)** Status message in the **Logs** tab when your app is successfully deployed. If needed, refresh the page. 

1. Congratulations! You have successfully deployed your sample function app.

## Lock down your function app with a private endpoint

Now, create the private endpoint for your function app. This private endpoint will connect your function app privately and securely to your virtual network using a private IP address. For more information on private endpoints, go to the [private endpoints documentation](https://docs.microsoft.com/azure/private-link/private-endpoint-overview).

1. In your function app, select **Networking** in the left menu.

1. Select **Click here to configure** under Private Endpoint Connections.

    :::image type="content" source="./media/functions-create-vnet/14-navigate-app-private-endpoint.png" alt-text="Screenshot of how to navigate to a Function App Private Endpoint.":::

1. Select **Add**.

1. On the menu that opens up, use the private endpoint settings as specified below:

    :::image type="content" source="./media/functions-create-vnet/15-create-app-private-endpoint.png" alt-text="Screenshot of how to create a Function App private endpoint.":::

1. Select **Ok** to add the private endpoint. Congratulations! You've successfully secured your function app, service bus, and storage account with private endpoints!

### Test your locked down function app

1. In your function app, select **Functions** from the left menu.

1. Select the **ServiceBusQueueTrigger**.

1. From the left menu, select **Monitor**. you'll see that you're unable to monitor your app. This is because your browser doesn't have access to the virtual network, so it can't directly access resources within the virtual network. We'll now demonstrate another method by which you can still monitor your function, Application Insights.

1. In your function app, select **Application Insights** from the left menu and select **View Application Insights data**.

    :::image type="content" source="./media/functions-create-vnet/16-app-insights.png" alt-text="Screenshot of how to view application insights for a Function App.":::

1. Select **Live metrics** from the left menu.

1. Open a new tab. In your Service Bus, select **Queues** from the left menu.

1. Select your queue.

1. Select **Service Bus Explorer** from the left menu. Under **Send**, choose **Text/Plain** as the **Content Type** and enter a message. 

1. Select **Send** to send the message.

    :::image type="content" source="./media/functions-create-vnet/17-send-service-bus-message.png" alt-text="Screenshot of how to send Service Bus messages using portal.":::

1. On the tab with **Live metrics** open, you should see that your Service Bus queue trigger has triggered. If it hasn't, resend the message from **Service Bus Explorer**

    :::image type="content" source="./media/functions-create-vnet/18-hello-world.png" alt-text="Screenshot of how to view messages using live metrics for function apps.":::

1. Congratulations! You've successfully tested your function app set up with private endpoints!

### Private DNS Zones
Using a private endpoint to connect to Azure resources means connecting to a private IP address instead of the public endpoint. Existing Azure services are configured to use existing DNS to connect to the public endpoint. The DNS configuration will need to be overridden to connect to the private endpoint.

A private DNS zone was created for each Azure resource configured with a private endpoint. A DNS A record is created for each private IP address associated with the private endpoint.

The following DNS zones were created in this tutorial:

- privatelink.file.core.windows.net
- privatelink.blob.core.windows.net
- privatelink.servicebus.windows.net
- privatelink.azurewebsites.net

[!INCLUDE [clean-up-section-portal](../../includes/clean-up-section-portal.md)]

## Next steps

In this tutorial, you created a Premium function app, storage account, and Service Bus, and you secured them all behind private endpoints! Learn more about the various networking features available below:

> [!div class="nextstepaction"]
> [Learn more about the networking options in Functions](./functions-networking-options.md)

[Premium plan]: functions-premium-plan.md
