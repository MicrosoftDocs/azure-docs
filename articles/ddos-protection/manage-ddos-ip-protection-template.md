---
title: 'Quickstart: Create and configure Azure DDoS IP Protection - ARM template'
description: Learn how to create and enable Azure DDoS IP Protection using an Azure Resource Manager template (ARM template).
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.topic: quickstart
ms.workload: infrastructure-services
ms.custom: mode-arm
ms.author: abell
ms.date: 03/08/2023
---

# Quickstart: Create and configure Azure DDoS IP Protection using ARM template

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create an IP address, then enable distributed denial of service (DDoS) IP Protection. Azure DDoS IP Protection is a pay-per-protected IP model that contains the same core engineering features as DDoS Network Protection.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://ms.portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fpip-with-ddos-ip-protection%2Fazuredeploy.json)


## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


## Review the template

This template creates a single Standard SKU public IP with DDoS IP Protection enabled. The template used in this quickstart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/pip-with-ddos-ip-protection/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/pip-with-ddos-ip-protection/azuredeploy.json":::

The template defines one resource:

- [Microsoft.Network/publicIPAddresses](/azure/templates/microsoft.network/change-log/publicipaddresses)

## Deploy the template

In this example, the template creates a new resource group, a DDoS protection plan, and a VNet.

1. To sign in to Azure and open the template, select the **Deploy to Azure** button.

    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://ms.portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fpip-with-ddos-ip-protection%2Fazuredeploy.json)

1. Enter the values to create a new resource group, Public IP address, and enable DDoS IP Protection.

    :::image type="content" source="media/manage-ddos-protection-template/ddos-template-ip.png" alt-text="Screenshot of DDoS IP Protection ARM quickstart template.":::

    - **Subscription**: Name of the Azure subscription where the resources will be deployed.
    - **Resource group**: Select an existing resource group. In this example, we'll create a new *Resource group*. Select **Create new**, enter **MyResourceGroup**, then select **OK**.
    - **Region**: The region where the resource group is deployed. In this example, we'll select **East US**.
    - **Public Ip Name**: The name of the new Public IP Address. In this example, we'll enter **myStandardPublicIP**
    - **Sku**: SKU of the Public IP Address. In this example, we'll select **Standard**.  
    - **Public IP Allocation Method**: The Allocation Method used for the Public IP Address. In this example, we'll select **Static**. 
    - **Tier**: SKU Tier of the Public IP Address. In this example, we'll select **Regional**.
    - **Ddos Protection Mode**: DDoS Protection Mode of the Public IP Address. In this example, we'll select **Enabled**.
    - **Location**: Specify a location for the resources. In this example, we'll leave as default.

1. Select **Review + create**.
1. Verify that template validation passed and select **Create** to begin the deployment.

> [!NOTE]
> DDoS IP Protection is enabled only on Public IP Standard SKU.

## Review deployed resources

To copy the Azure CLI or Azure PowerShell command, select the **Copy** button. The **Try it** button opens Azure Cloud Shell to run the command.

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
#Gets the public IP address
$publicIp = Get-AzPublicIpAddress -Name myStandardPublicIP -ResourceGroupName MyResourceGroup 

#Checks and returns the status of the public IP address
 $publicIp


```

# [CLI](#tab/CLI)

```azurecli-interactive
    az network public-ip show \
        --resource-group MyResourceGroup \
        --name myStandardPublicIP \
```
---

The output shows the new resource and *protectionModeDDoS* shows IP Protection is **Enabled**.

# [PowerShell](#tab/PowerShell)

```Output
Name                     : myStandardPublicIP
ResourceGroupName        : MyResourceGroup
Location                 : eastus
Id                       : /subscriptions/abcdefgh-1111-2222-bbbb-987654321098/resourceGroups/MyResourceGroup/providers/Microsoft.Network/publicIPAddresses/myStandardPublicIP
Etag                     : W/"abcdefgh-1111-2222-bbbb-987654321098"
ResourceGuid             : abcdefgh-1111-2222-bbbb-987654321098
ProvisioningState        : Succeeded
Tags                     : 
PublicIpAllocationMethod : Static
IpAddress                : 20.168.244.236
PublicIpAddressVersion   : IPv4
IdleTimeoutInMinutes     : 4
IpConfiguration          : null
DnsSettings              : null
DdosSettings             : {"ProtectionMode": "Enabled"}
Zones                    : {}
Sku                      : {"Name": "Standard","Tier": "Regional"}
IpTags                   : []
ExtendedLocation         : null
```

# [CLI](#tab/CLI)

```Output
{
  "ddosSettings": {
    "protectionMode": "Enabled"
  },
  "etag": "W/\"abcdefgh-1111-2222-bbbb-987654321098\"",
  "id": "/subscriptions/b1111111-2222-3333-aaaa-012345678912/resourceGroups/MyResourceGroup/providers/Microsoft.Network/publicIPAddresses/myStandardPublicIP",
  "idleTimeoutInMinutes": 4,
  "ipAddress": "20.25.14.83",
  "ipTags": [],
  "location": "eastus",
  "name": "myStandardPublicIP",
  "provisioningState": "Succeeded",
  "publicIPAddressVersion": "IPv4",
  "publicIPAllocationMethod": "Static",
  "resourceGroup": "MyResourceGroup",
  "resourceGuid": "b1111111-2222-3333-aaaa-012345678912",
  "sku": {
    "name": "Standard",
    "tier": "Regional"
  },
  "type": "Microsoft.Network/publicIPAddresses"
}

```
---

## Clean up resources

When you're finished, you can delete the resources. The command deletes the resource group and all the resources it contains.

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name 'MyResourceGroup'
```

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name MyResourceGroup
```
---

## Next steps

To learn how to view and configure telemetry for your DDoS protection plan, continue to the tutorials.

> [!div class="nextstepaction"]
> [View and configure DDoS protection telemetry](telemetry.md)
