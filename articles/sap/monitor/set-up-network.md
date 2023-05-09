---
title: Set up network for Azure Monitor for SAP solutions (preview)
description: Learn how to set up an Azure virtual network for use with Azure Monitor for SAP solutions.
author: MightySuz
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: how-to
ms.date: 10/27/2022
ms.author: sujaj
#Customer intent: As a developer, I want to set up an Azure virtual network so that I can use Azure Monitor for SAP solutions.
---
# Set up network for Azure Monitor for SAP solutions (preview)

[!INCLUDE [Azure Monitor for SAP solutions public preview notice](./includes/preview-azure-monitor.md)]

In this how-to guide, you'll learn how to configure an Azure virtual network so that you can deploy *Azure Monitor for SAP solutions*. You'll learn to [create a new subnet](#create-new-subnet) for use with Azure Functions for both versions of the product, *Azure Monitor for SAP solutions* and *Azure Monitor for SAP solutions (classic)*. Then, if you're using the current version of Azure Monitor for SAP solutions, you'll learn to [set up outbound internet access](#configure-outbound-internet-access) to the SAP environment that you want to monitor.

## Create new subnet

> [!NOTE]
> This section applies to both Azure Monitor for SAP solutions and Azure Monitor for SAP solutions (classic).

Azure Functions is the data collection engine for Azure Monitor for SAP solutions. You'll need to create a new subnet to host Azure Functions.

[Create a new subnet](../../azure-functions/functions-networking-options.md#subnets) with an **IPv4/25** block or larger. Since we need atleast 100 IP addresses for monitoring resources.
After subnet creation is successful, verify the below steps to ensure connectivity between Azure Monitor for SAP solutions subnet to your SAP environment subnet.

- If both the subnets are in different virtual networks, do a virtual network peering between the virtual networks.
- If the subnets are associated with user defined routes, make sure the routes are configured to allow traffic between the subnets.
- If the SAP Environment subnets have NSG rules, make sure the rules are configured to allow inbound traffic from Azure Monitor for SAP solutions subnet.
- If you have a firewall in your SAP environment, make sure the firewall is configured to allow inbound traffic from Azure Monitor for SAP solutions subnet.

For more information, see how to [integrate your app with an Azure virtual network](../../app-service/overview-vnet-integration.md).

## Using Custom DNS for Virtual Network

This section only applies to if you are using Custom DNS for your Virtual Network. Add the IP Address 168.63.129.16 which points to Azure DNS Server. This will resolve the storage account and other resource urls which are required for proper functioning of Azure Monitor for SAP Solutions. see below reference image.

![Custom DNS Setting ]([../../media/set-up-network/adding-custom-dns.png)

## Configure outbound internet access

> [!IMPORTANT]
> This section only applies to the current version of Azure Monitor for SAP solutions. If you're using Azure Monitor for SAP solutions (classic), skip this section.

In many use cases, you might choose to restrict or block outbound internet access to your SAP network environment. However, Azure Monitor for SAP solutions requires network connectivity between the [subnet that you configured](#create-new-subnet) and the systems that you want to monitor. Before you deploy an Azure Monitor for SAP solutions resource, you need to configure outbound internet access, or the deployment will fail.

There are multiple methods to address restricted or blocked outbound internet access. Choose the method that works best for your use case:

- [Set up network for Azure Monitor for SAP solutions (preview)](#set-up-network-for-azure-monitor-for-sap-solutions-preview)
  - [Create new subnet](#create-new-subnet)
  - [Using Custom DNS for Virtual Network](#using-custom-dns-for-virtual-network)
  - [Configure outbound internet access](#configure-outbound-internet-access)
    - [Use Route All](#use-route-all)
    - [Allow Inbound Traffic](#allow-inbound-traffic)
    - [Use service tags](#use-service-tags)
    - [Use private endpoint](#use-private-endpoint)
  - [Next steps](#next-steps)

### Use Route All

**Route All** is a [standard feature of virtual network integration](../../azure-functions/functions-networking-options.md#virtual-network-integration) in Azure Functions, which is deployed as part of Azure Monitor for SAP solutions. Enabling or disabling this setting only affects traffic from Azure Functions. This setting doesn't affect any other incoming or outgoing traffic within your virtual network.

You can configure the **Route All** setting when you create an Azure Monitor for SAP solutions resource through the Azure portal. If your SAP environment doesn't allow outbound internet access, disable **Route All**. If your SAP environment allows outbound internet access, keep the default setting to enable **Route All**.

You can only use this option before you deploy an Azure Monitor for SAP solutions resource. It's not possible to change the **Route All** setting after you create the Azure Monitor for SAP solutions resource.

### Allow Inbound Traffic

Incase you have NSG or User Defined Route rules that block inbound traffic to your SAP Environment, then you need to modify the rules to allow the inbound traffic, also depending on the types of providers you are trying to onboard you have to unblock a few ports as mentioned below.

| **Provider Type**                  | **Port Number**                                                         |
|------------------------------------|---------------------------------------------------------------------|
| Prometheus OS                      |  9100                                                               |
| Prometheus HA Cluster on RHEL      |  44322                                                              |
| Prometheus HA Cluster on SUSE      |  9100                                                               |
| SQL Server                         |  1433  (can be different if you are not using the default port)     |
| DB2 Server                         |  25000 (can be different if you are not using the default port)     |
| SAP HANA DB                        |  3\<instance number\>13, 3\<instance number\>15                         |
| SAP NetWeaver                      |  5\<instance number\>13, 5\<instance number\>15                         |

### Use service tags

If you use NSGs, you can create Azure Monitor for SAP solutions-related [virtual network service tags](../../virtual-network/service-tags-overview.md) to allow appropriate traffic flow for your deployment. A service tag represents a group of IP address prefixes from a given Azure service.

You can use this option after you've deployed an Azure Monitor for SAP solutions resource.

1. Find the subnet associated with your Azure Monitor for SAP solutions managed resource group:
      1. Sign in to the [Azure portal](https://portal.azure.com).
      1. Search for or select the Azure Monitor for SAP solutions service.
      1. On the **Overview** page for Azure Monitor for SAP solutions, select your Azure Monitor for SAP solutions resource.
      1. On the managed resource group's page, select the Azure Functions app.
      1. On the app's page, select the **Networking** tab. Then, select **VNET Integration**.
      1. Review and note the subnet details. You'll need the subnet's IP address to create rules in the next step.
1. Select the subnet's name to find the associated NSG. Note the NSG's information.
3. Set new NSG rules for outbound network traffic:
      1. Go to the NSG resource in the Azure portal.
      1. On the NSG's menu, under **Settings**, select **Outbound security rules**.
      1. Select the **Add** button to add the following new rules:

| **Priority** | **Name**                 | **Port** | **Protocol** | **Source** | **Destination**      | **Action** |
|--------------|--------------------------|----------|--------------|------------|----------------------|------------|
| 450          | allow_monitor            | 443      | TCP          |  Azure Function subnet           | Azure Monitor         | Allow      |
| 501          | allow_keyVault           | 443      | TCP          |  Azure Function subnet           | Azure Key Vault        | Allow      |
| 550          | allow_storage            | 443      | TCP          |   Azure Function subnet          | Storage              | Allow      |
| 600          | allow_azure_controlplane | 443      | Any          |   Azure Function subnet          | Azure Resource Manager | Allow      |
| 650      | allow_ams_to_source_system | Any  | Any   |  Azure Function subnet | Virtual Network or comma separated IP addresses of the source system. | Allow      |
| 660          | deny_internet            | Any      | Any          | Any        | Internet             | Deny       |

The Azure Monitor for SAP solution's subnet IP address refers to the IP of the subnet associated with your Azure Monitor for SAP solutions resource. To find the subnet, go to the Azure Monitor for SAP solutions resource in the Azure portal. On the **Overview** page, review the **vNet/subnet** value.

For the rules that you create, **allow_vnet** must have a lower priority than **deny_internet**. All other rules also need to have a lower priority than **allow_vnet**. However, the remaining order of these other rules is interchangeable.

### Use private endpoint

You can enable a private endpoint by creating a new subnet in the same virtual network as the system that you want to monitor. No other resources can use this subnet. It's not possible to use the same subnet as Azure Functions for your private endpoint.
To create a private endpoint for Azure Monitor for SAP solutions Please refer [Setup Private Endpoints for Azure Monitor For Sap Solutions](set-up-private-endpoints.md).

## Next steps

- [Quickstart: set up Azure Monitor for SAP solutions through the Azure portal](quickstart-portal.md)
- [Quickstart: set up Azure Monitor for SAP solutions with PowerShell](quickstart-powershell.md)
