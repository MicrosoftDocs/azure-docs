---
title: 'Container Apps outbound traffic control with Azure Firewall'
services: container-apps
description: Use Azure Firewall to route outbound traffic from Container Apps to the internet, private IP addresses, and Azure services. Learn how to control Container Apps outbound traffic by using Virtual Network integration and Azure Firewall. 
author: cachai
ms.author: cachai
ms.topic: article
ms.date: 03/29/2023
---

# (Preview) Control outbound traffic with Azure Firewall 

>[!Note]
> This feature is in preview and is only supported for the Consumption + Dedicated plan structure.

This article shows you how to use [Azure Firewall](../firewall/overview.md) to lock down outbound traffic from your Container Apps to back-end Azure resources or other network resources.

Azure creates a default route table for your virtual networks on create. By implementing a user-defined route table, you can control how traffic is routed within your virtual network. In this guide, you will setup UDR on the Container Apps virtual network to restrict outbound traffic with Azure Firewall.

For more information on networking concepts in Container Apps, see [Networking Architecture in Azure Container Apps](./networking.md).

## Prerequisites
* Have a container app environment on the Consumption + Dedicated plan structure that's integrated with a custom virtual network and is on an internal environment. By integrating with an internal virtual network, your container app environment will have no public IP addresses and all traffic will be routed through the virtual network. [For steps](filler)
* In your container app, have a container that supports `curl` commands. This will be used to verify you have completed this guide correctly. The quickstart helloworld container from the sample container image quickstart already supports `curl` commands. 

## Create the firewall subnet
A subnet called **AzureFirewallSubnet** is required in order to deploy a firewall into the integrated virtual network.
1. In the [Azure portal](https://portal.azure.com), navigate to the virtual network that's integrated with your app.
1. From the menu on the left, select **Subnets**, then click **+ Subnet**.
1. Enter the following values:

    | Setting      | Action      |
    | ------------ | ---------------- |
    | **Name** | Enter **AzureFirewallSubnet**. | 
    | **Subnet address range** | Use the default or specify a [subnet range /26 or larger](../firewall/firewall-faq.yml#why-does-azure-firewall-need-a--26-subnet-size).
1. Select **Save**

## Deploy the firewall
1. On the Azure portal menu or the **Home** page, select **Create a resource**.
1. Search for *Firewall*.
1. Select **Firewall**. Then, select **Create**.
1. On the **Create a Firewall** page, configure the firewall with the following settings.

    | Setting | Action |
    | - | - |
    | **Resource group** | Enter the same resource group as the integrated virtual network. |
    | **Name** | Enter a name of your choice |
    | **Region** | Select the same region as the integrated virtual network. |
    | **Firewall policy** | Create one by selecting **Add new**. |
    | **Virtual network** | Select the integrated virtual network. |
    | **Public IP address** | Select an existing address or create one by selecting **Add new**. |
1. Click **Review + create**. After validation finishes, select **Create**. This may take a few minutes to deploy.
1. Once the deployment completes, select **Go to Resource**.
1. In the firewall's **Overview** page, copy the **Firewall private IP**. This will be used as the next hop address when creating the routing rule for the virtual network.

## Route all traffic to the firewall
Your virtual networks in Azure will have default route tables in place upon create. By implementing a user-defined route table, you can control how traffic is routed within your virtual network. In the following steps, you will create a UDR to route all traffic to your Azure Firewall.
1. On the Azure portal menu or the **Home** page, select **Create a resource**.
1. Search for *Route tables*.
1. Select **Route Tables**. Then, select **Create**.
1. Enter the following values:

    | Setting      | Action      |
    | ------------ | ---------------- |
    | **Region**   | Select the region as your virtual network. |
    | **Name**     | Enter a name. |
    | **Propagate gateway routes** | Select **No** |
1. Click **Review + create**. After validation finishes, select **Create**.
1. Once the deployment completes, select **Go to Resource**.
1. From the menu on the left, select **Routes**, then click **Add** to create a new route table
1. Configure the route table with the following settings:

    | Setting      | Action      |
    | ------------ | ---------------- |
    | **Address prefix** | Enter *0.0.0.0/0* |
    | **Next hop type** | Select *Virtual appliance* |
    | **Next hop address** | Enter the *Firewall Private IP* you saved in [Deploy the firewall](#deploy-the-firewall).
1. Select **Add** to create the route.
1. From the menu on the left, select **Subnets**, then click **Associate** to associate your route table with the subnet your Container App is integrated with.
1. Configure the *Associate subnet* with the following values:

    | Setting      | Action      |
    | ------------ | ---------------- |
    | **Address prefix** | Select the virtual network your container app is integrated with |
    | **Next hop type** | Select the subnet your container app is integrated with  |
1. Select **OK**.

## Configure firewall policies
Now, all outbound traffic from your container app is routed to the firewall. Currently, the firewall still allows all outbound traffic through. In order to manage what outbound traffic allowed/denied, you will need to configure firewall policies which you will do in the following steps.
1. In your *Azure Firewall* resource on the *Overview* page, select **Firewall policy**
1. From the menu on the left of the firewall policy page, select **Application Rules**, then select **Add a rule collection**.
1. Enter the following values for the **Rule Collection**:

    | Setting      | Action      |
    | ------------ | ---------------- |
    | **Name** | Enter a collection name |
    | **Rule collection type** | Select *Application* |
    | **Priority** | Enter the priority such as 110 |
    | **Rule collection action** | Select *Allow* |
    | **Rule collection group** | Select *DefaultApplicationRuleCollectionGroup* |
1. Under **Rules**, enter the following values

    | Setting      | Action      |
    | ------------ | ---------------- |
    | **Name** | Enter a name for the rule |
    | **Source type** | Select *IP Address* |
    | **Source** | Enter *** |
    | **Protocol** | Enter *Http:80,Https:443* |
    | **Destination Type** | Select **FQDN**. | 
    | **Destination** | Enter *mcr.microsoft.com,*.data.mcr.microsoft.com*. Note: If you are using ACR, you will need to also add your *ACR address* and **.blob.core.windows.net*. |
    | **Action** | Select *Allow* |
1. Select **Add**.

## Verify your firewall is blocking outbound traffic

To verify your firewall configuration is setup correctly, you can use the `curl` command from your app's debugging console.
1. Navigate to your Container App that is configured with Azure Firewall.
1. From the menu on the left, select **Console**, then select your container that supports the `curl` command. If you are using the helloworld container from the sample container image quickstart, you will be able to run the `curl` command.
1. In the **Choose start up command** menu, select **/bin/sh**, and select **Connect**.
1. In the console, run `curl -s https://mcr.microsoft.com`. You should see a successful response as you added `mcr.microsoft.com` to the allow list for your firewall policies.
1. Now, run `curl -s https://<fqdn-address>` for a URL that doesn't match any of your destination rules such as `example.com`. The example command would be `curl -s https://example.com`. You should get no response which indicates that your firewall has blocked the request.

## Next steps

> [!div class="nextstepaction"]
> [Authentication in Azure Container Apps](authentication.md)
