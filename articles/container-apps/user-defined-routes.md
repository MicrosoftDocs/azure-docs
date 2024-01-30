---
title: Container Apps outbound traffic control with Azure Firewall
description: Use Azure Firewall to route outbound traffic from Container Apps to the internet, private IP addresses, and Azure services.
services: container-apps
author: cachai
ms.service: container-apps
ms.author: cachai
ms.topic: article
ms.date: 08/29/2023
---

# Control outbound traffic with user defined routes

> [!NOTE]
> This feature is only supported for the workload profiles environment type. User defined routes only work with an internal Azure Container Apps environment.

This article shows you how to use user defined routes (UDR) with [Azure Firewall](../firewall/overview.md) to lock down outbound traffic from your Container Apps to back-end Azure resources or other network resources.

Azure creates a default route table for your virtual networks on create. By implementing a user-defined route table, you can control how traffic is routed within your virtual network. In this guide, your setup UDR on the Container Apps virtual network to restrict outbound traffic with Azure Firewall.

You can also use a NAT gateway or any other third party appliances instead of Azure Firewall.

See the [configuring UDR with Azure Firewall](./networking.md#configuring-udr-with-azure-firewall) in [networking in Azure Container Apps](./networking.md) for more information.

## Prerequisites

* **Workload profiles environment**: A workload profiles environment that's integrated with a custom virtual network. For more information, see the [guide for how to create a container app environment on the workload profiles environment](./workload-profiles-manage-cli.md?pivots=aca-vnet-custom).

* **`curl` support**: Your container app must have a container that supports `curl` commands. In this how-to, you use `curl` to verify the container app is deployed correctly. If you don't have a container app with `curl` deployed, you can deploy the following container which supports `curl`, `mcr.microsoft.com/k8se/quickstart:latest`.

## Create the firewall subnet

A subnet called **AzureFirewallSubnet** is required in order to deploy a firewall into the integrated virtual network.

1. Open the virtual network that's integrated with your app in the [Azure portal](https://portal.azure.com).

1. From the menu on the left, select **Subnets**, then select **+ Subnet**.

1. Enter the following values:

    | Setting      | Action      |
    | ------------ | ---------------- |
    | **Name** | Enter **AzureFirewallSubnet**. |
    | **Subnet address range** | Use the default or specify a [subnet range /26 or larger](../firewall/firewall-faq.yml#why-does-azure-firewall-need-a--26-subnet-size).

1. Select **Save**

## Deploy the firewall

1. On the Azure portal menu or the **Home** page, select **Create a resource**.

1. Search for *Firewall*.

1. Select **Firewall**.

1. Select **Create**.

1. On the *Create a Firewall* page, configure the firewall with the following settings.

    | Setting | Action |
    |--|--|
    | **Resource group** | Enter the same resource group as the integrated virtual network. |
    | **Name** | Enter a name of your choice |
    | **Region** | Select the same region as the integrated virtual network. |
    | **Firewall policy** | Create one by selecting **Add new**. |
    | **Virtual network** | Select the integrated virtual network. |
    | **Public IP address** | Select an existing address or create one by selecting **Add new**. |

1. Select **Review + create**. After validation finishes, select **Create**. The validation step might take a few minutes to complete.

1. Once the deployment completes, select **Go to Resource**.

1. In the firewall's **Overview** page, copy the **Firewall private IP**. This IP address is used as the next hop address when creating the routing rule for the virtual network.

## Route all traffic to the firewall

Your virtual networks in Azure have default route tables in place when you create the network. By implementing a user-defined route table, you can control how traffic is routed within your virtual network. In the following steps, you create a UDR to route all traffic to your Azure Firewall.

1. On the Azure portal menu or the *Home* page, select **Create a resource**.

1. Search for **Route tables**.

1. Select **Route Tables**.

1. Select **Create**.

1. Enter the following values:

    | Setting      | Action      |
    | ------------ | ---------------- |
    | **Region**   | Select the region as your virtual network. |
    | **Name**     | Enter a name. |
    | **Propagate gateway routes** | Select **No** |

1. Select **Review + create**. After validation finishes, select **Create**.

1. Once the deployment completes, select **Go to Resource**.

1. From the menu on the left, select **Routes**, then select **Add** to create a new route table

1. Configure the route table with the following settings:

    | Setting      | Action      |
    |--|--|
    | **Address prefix** | Enter *0.0.0.0/0* |
    | **Next hop type** | Select *Virtual appliance* |
    | **Next hop address** | Enter the *Firewall Private IP* you saved in [Deploy the firewall](#deploy-the-firewall).

1. Select **Add** to create the route.

1. From the menu on the left, select **Subnets**, then select **Associate** to associate your route table with the container app's subnet.

1. Configure the *Associate subnet* with the following values:

    | Setting      | Action      |
    |--|--|
    | **Address prefix** | Select the virtual network for your container app. |
    | **Next hop type** | Select the subnet your for container app.  |

1. Select **OK**.

## Configure firewall policies

> [!NOTE]
> When using UDR with Azure Firewall in Azure Container Apps, you will need to add certain FQDN's and service tags to the allowlist for the firewall. Please refer to [configuring UDR with Azure Firewall](./networking.md#configuring-udr-with-azure-firewall) to determine which service tags you need.

Now, all outbound traffic from your container app is routed to the firewall. Currently, the firewall still allows all outbound traffic through. In order to manage what outbound traffic is allowed or denied, you need to configure firewall policies.

1. In your *Azure Firewall* resource on the *Overview* page, select **Firewall policy**

1. From the menu on the left of the firewall policy page, select **Application Rules**.

1. Select **Add a rule collection**.

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
    | **Source** | Enter **\*** |
    | **Protocol** | Enter *http:80,https:443* |
    | **Destination Type** | Select **FQDN**. |
    | **Destination** | Enter `mcr.microsoft.com`,`*.data.mcr.microsoft.com`. If you're using ACR, add your *ACR address* and `*.blob.core.windows.net`. |
    | **Action** | Select *Allow* |

    >[!Note]
    > If you are using [Docker Hub registry](https://docs.docker.com/desktop/allow-list/) and want to access it through your firewall, you will need to add the following FQDNs to your rules destination list: *hub.docker.com*, *registry-1.docker.io*, and *production.cloudflare.docker.com*.

1. Select **Add**.

## Verify your firewall is blocking outbound traffic

To verify your firewall configuration is set up correctly, you can use the `curl` command from your app's debugging console.

1. Navigate to your Container App that is configured with Azure Firewall.

1. From the menu on the left, select **Console**, then select your container that supports the `curl` command.

1. In the **Choose start up command** menu, select **/bin/sh**, and select **Connect**.

1. In the console, run `curl -s https://mcr.microsoft.com`. You should see a successful response as you added `mcr.microsoft.com` to the allowlist for your firewall policies.

1. Run `curl -s https://<FQDN_ADDRESS>` for a URL that doesn't match any of your destination rules such as `example.com`. The example command would be `curl -s https://example.com`. You should get no response, which indicates that your firewall has blocked the request.

## Next steps

> [!div class="nextstepaction"]
> [Authentication in Azure Container Apps](authentication.md)
