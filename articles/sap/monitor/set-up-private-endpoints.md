---
title: Set up private endpoints for Azure Monitor for SAP solutions
description: Learn how to set up an private endpoints for Azure Monitor for SAP solutions resources.
author: MightySuz
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: how-to
ms.date: 10/27/2022
ms.author: sujaj
#Customer intent: As a developer, I want to set up an Azure virtual network so that I can use Azure Monitor for SAP solutions.
---
# Set up private endpoints for Azure Monitor for SAP solutions

[!INCLUDE [Azure Monitor for SAP solutions public preview notice](./includes/preview-azure-monitor.md)]

In this how-to guide, you'll learn how to configure private endpoints for Azure Monitor for SAP Solution. Private endpoints allow you to connect to Azure Monitor for SAP solutions resources from a virtual network using a private IP address.

## Configure Private Endpoints

We have 3 resources that need to be configured with private endpoints:

1. [Azure Key Vault](#create-key-vault-endpoint)
1. [Azure Storage](#create-storage-endpoint)
1. [Azure Log Analytics](#create-log-analytics-endpoint)

You can enable a private endpoint by creating a new subnet in the same virtual network as the system that you want to monitor. No other resources can use this subnet. It's not possible to use the same subnet as Azure Functions for your private endpoint.

To create a private endpoint for Azure Monitor for SAP solutions:

1. Create a Azure Private DNS zone which will contain the private endpoint records. You can follow the steps in [Create a private DNS zone](https://learn.microsoft.com/en-us/azure/dns/private-dns-getstarted-portal) to create a private DNS zone. Make sure to link the private DNS zone to the virtual networks that contain you SAP System and Azure Monitor for SAP solutions resources.
![Add Virtual Network Link to Private DNS Zone ]([../../media/set-up-network/dns-add-private-link.png)
1. In the Azure portal, go to your Azure Monitor for SAP solutions resource.
1. On the **Overview** page for the Azure Monitor for SAP solutions resource, select the **Managed resource group**.
1. Create a private endpoint connection for the following resources inside the managed resource group.
    1. [Azure Key Vault resources](#create-key-vault-endpoint)
    1. [Azure Storage resources](#create-storage-endpoint)
    1. [Azure Log Analytics workspaces](#create-log-analytics-endpoint)

> [!Note]
> Before starting the below process, create a subnet in your virtual network, which will be associated with the private endpoint.

### Create key vault endpoint

You can follow the steps in [Create a private endpoint for Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/private-link-service?tabs=portal) to configure the endpoint and test the connectivity to key vault.

### Create storage endpoint

It's necessary to create a separate private endpoint for each Azure Storage account resource, including the queue, table, storage blob, and file. If you create a private endpoint for the storage queue, it's not possible to access the resource from systems outside of the virtual networking, including the Azure portal. However, other resources in the same storage account are accessible.

Repeat the following process for each type of storage sub-resources (table, queue, blob, and file):

1. On the storage account's menu, under **Settings**, select **Networking**.
1. Select the **Private endpoint connections** tab.
1. Select **Create** to open the endpoint creation page.
1. On the **Basics** tab, enter or select all required information.
1. On the **Resource** tab, enter or select all required information. For the **Target sub-resource**, select one of the subresource types (table, queue, blob, or file).
1. On the **Virtual Network** tab, select the virtual network and the subnet that you created specifically for the endpoint. It's not possible to use the same subnet as the Azure Functions app.
![Create Private Endpoint - Virtual Network]([../../media/set-up-network/private-endpoint-vnet-step.png)
1. On the **DNS** tab, for **Integrate with private DNS zone**, select **Yes**.
1. On the **Tags** tab, add tags if necessary.
1. Select **Review + create** to create the private endpoint.
1. After the deployment is complete, Navigate back to Storage Account. On the **Networking** page, select the **Firewalls and virtual networks** tab.
    1. For **Public network access**, select **Enable from all networks**.
    1. Select **Apply** to save the changes.
1. Make sure to create private endpoints for all storage sub-resources (table, queue, blob, and file)

### Create log analytics endpoint

It's not possible to create a private endpoint directly for a Log Analytics workspace. To enable a private endpoint for this resource, you can connect the resource to an [Azure Monitor Private Link Scope (AMPLS)](../../azure-monitor/logs/private-link-security.md). Then, you can create a private endpoint for the AMPLS resource.

If possible, create the private endpoint before you allow any system to access the Log Analytics workspace through a public endpoint. Otherwise, you'll need to restart the Function App before you can access the Log Analytics workspace through the private endpoint.

Select a scope for the private endpoint:

1. Go to the Log Analytics workspace in the Azure portal.
1. In the resource menu, under **Settings**, select **Network isolation**.
1. Select **Add** to create a new AMPLS setting.
1. Select the appropriate scope for the endpoint. Then, select **Apply**.

Create the private endpoint:

1. Go to the AMPLS resource in the Azure portal.
1. In the resource menu, under **Configure**, select **Private Endpoint connections**.
1. Select **Private Endpoint** to create a new endpoint.
1. On the **Basics** tab, enter or select all required information.
1. On the **Resource** tab, enter or select all required information.
1. On the **Virtual Network** tab, select the virtual network and the subnet that you created specifically for the endpoint. It's not possible to use the same subnet as the Azure Functions app.
1. On the **DNS** tab, for **Integrate with private DNS zone**, select **Yes**. If necessary, add tags.
1. Select **Review + create** to create the private endpoint.

Configure the scope:

1. Go to the Log Analytics workspace in the Azure portal.
1. In the resource's menu, under **Settings**, select **Network Isolation**.
1. Under **Virtual networks access configuration**:
    1. Set **Accept data ingestion from public networks not connected through a Private Link Scope** to **No**. This setting disables data ingestion from any system outside the virtual network.
    1. Set **Accept queries from public networks not connected through a Private Link Scope** to **Yes**. This setting allows workbooks to display data.
1. Select **Save**.

If you enable a private endpoint after any system accessed the Log Analytics workspace through a public endpoint, restart the Function App before moving forward. Otherwise, you can't access the Log Analytics workspace through the private endpoint.

1. Go to the Azure Monitor for SAP solutions resource in the Azure portal.
1. On the **Overview** page, select the name of the **Managed resource group**.
1. On the managed resource group's page, select the **Function App**.
1. On the Function App's **Overview** page, select **Restart**.

### Add outbound security rules

1. Go to the NSG resource in the Azure portal.
1. In the NSG menu, under **Settings**, select **Outbound security rules**.
1. Add the following required security rules.

    | Priority | Description |
    | -------- | ------------- |
    | 550 | Allow the source IP for making calls to source system to be monitored. |
    | 600 | Allow the source IP for making calls Azure Resource Manager service tag. |
    | 650 | Allow the source IP to access key-vault resource using private endpoint IP. |
    | 700 | Allow the source IP to access storage-account resources using private endpoint IP. (Include IPs for each of storage account sub resources: table, queue, file, and blob)  |
    | 800 | Allow the source IP to access log-analytics workspace resource using private endpoint IP.  |

## Next steps

- [Quickstart: set up Azure Monitor for SAP solutions through the Azure portal](quickstart-portal.md)
- [Quickstart: set up Azure Monitor for SAP solutions with PowerShell](quickstart-powershell.md)
