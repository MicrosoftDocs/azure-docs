---
title: How to disable public access to an Azure App Configuration
description: How to disable public access and create a private endpoint for an Azure App Configuration store.
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: how-to 
ms.date: 05/18/2022
ms.custom: template-how-to
---

# Enable or disable public access in Azure App Configuration

In this article, you'll learn how to set up public or private access for your Azure App Configuration store. Setting up private access and creating private endpoints can offer a better security for your configuration store. 

In the guide below, you will:
> [!div class="checklist"]
> * Create an App Configuration store
> * Disable public access to the App Configuration store
> * Set up a private endpoint with Azure Private Link

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- An App Configurations store. If you don't have one yet, create an [App Configuration store](quickstart-aspnet-core-app.md).

## Disable public access to an App Configurations store

To disable access to the App Configuration store from public network, follow the process below.

1. In your App Configuration store, under **Settings**, select **Networking**. Azure App Configuration offers three public access options:
   - Automatic public access: public network access is enabled, as long as you don't have a private endpoint present. Once you create a private endpoint, App Configuration disables public network access and enables private access. This option is only available on store creation.
   - Disabled: public access is disabled and no traffic can access this resource unless it'is through a private endpoint.
   - Enabled: all networks can access this resource.
1. Under **Public Access**, select **Disabled** to disable public access to the App Configuration store and only allow access through private endpoints. If you already had public access disabled and instead wanted to enable public access to your configuration store, you would select **Enabled**. 

   > [!NOTE]
   > Once you've switched to **Public Access: Disabled** or **Public access: Enabled**, you won't be able to select **Public Access: Automatic** anymore, as this option can only be selected when creating the store.

1. Select **Apply**.

## Set up private access to a configuration store
1. Select the **Private  Access** tab to set up a private endpoint with Azure Private Link. Private endpoints allow access to the App Configuration store using a private IP address from a virtual network, effectively bringing the service into your virtual network.
1. Fill out the form with the following information.
   
   | Parameter  | Description     | Example                          |
   |------------|-----------------|--------------------------------- |
   | Subscription     | Select an Azure subscription. Your private endpoint must be in the same subscription as your virtual network. You will select a virtual network later in this how-to guide.  | *MyAzureSubscription* |
   | Resource group     | Select a resource group or create a new one.  | *AppConfigStore* |
   | Name     | Enter a name for the new private endpoint for your App Configuration store. | *AppConfigPrivateEndpoint* |
   | Region     | Your private endpoint must be in the same region as your virtual network.  | *Central US* |

1. Select **Next : Resource**. Private Link offers options to create private endpoints for different Azure resources, such as an SQL server, an Azure storage account or an App Configuration store. Review the information displayed to ensure that the correct target sub-resource is selected. You should see your subscription and the name of your configuration store.
1. Select **Next : Virtual Network >** and select an existing **Virtual network** and a **Subnet** to deploy the private endpoint. Leave the box **Enable network policies for all private endpoints in this subnet** checked. If you don't have one, [create a virtual network](../private-link/create-private-endpoint-portal.md#create-a-virtual-network-and-bastion-host).
1. Optionally, you can select or create an application security group. Application security groups allow you to group virtual machines and define network security policies based on those groups. 
1. Select **Next : DNS >** to choose a DNS record. For **Integrate with private DNS zone**, select **Yes** to integrate your private endpoint with a new DNS record. You may also use your own DNS servers or create DNS records using the host files on your virtual machines. [Learn more](https://go.microsoft.com/fwlink/?linkid=2100445). A subscription and resource group for your new private DNS zone are preselected. You can change them if you wish.
1. Select **Next : Tags >**. At this stage, you can create tags. Skip for now.
1. Select **Next : Review + create >** to review information about your App Configuration store, private endpoint, virtual network and DNS. At this stage you can also select Download a template for automation to reuse JSON data from this form later.
1. Select **Create**. You can remove or add more private endpoints by going back to **Networking** > **Private Access** in your App Configuration store.

## Next steps

> [!div class="nextstepaction"]
>[Azure App Configuration resiliency and disaster recovery](./concept-disaster-recovery.md)
