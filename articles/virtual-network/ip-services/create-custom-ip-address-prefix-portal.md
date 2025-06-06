---
title: Create a custom IPv4 address prefix in Azure
titleSuffix: Azure Virtual Network
description: Learn how to onboard and create a custom IP address prefix using the Azure portal, Azure CLI, or Azure PowerShell.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 08/08/2024
ms.custom: references_regions
---

# Create a custom IPv4 address prefix in Azure

In this article, you learn how to create a custom IPv4 address prefix using the Azure portal. You prepare a range to provision, provision the range for IP allocation, and enable the range advertisement by Microsoft.

A custom IPv4 address prefix enables you to bring your own IPv4 ranges to Microsoft and associate it to your Azure subscription. You maintain ownership of the range while Microsoft would be permitted to advertise it to the Internet. A custom IP address prefix functions as a regional resource that represents a contiguous block of customer owned IP addresses.

For this article, choose between the Azure portal, Azure CLI, or PowerShell to create a custom IPv4 address prefix.

[!INCLUDE [ip-services-custom-ip-global-regional-unified-model](../../../includes/ip-services-custom-ip-global-regional-unified-model.md)]

## Prerequisites

# [Azure portal](#tab/azureportal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A customer owned IPv4 range to provision in Azure.
    - A sample customer range (1.2.3.0/24) is used for this example. This range isn't validated in Azure so replace the example range with yours.

> [!NOTE]
> For problems encountered during the provisioning process, please see [Troubleshooting for custom IP prefix](manage-custom-ip-address-prefix.md#troubleshooting-and-faqs).

# [Azure CLI](#tab/azurecli/)

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- This tutorial requires version 2.28 or later of the Azure CLI (you can run az version to determine which you have). If using Azure Cloud Shell, the latest version is already installed.
- Sign in to Azure CLI and select the subscription you want to use with `az account`.
- A customer owned IPv4 range to provision in Azure.
    - A sample customer range (1.2.3.0/24) is used for this example. This range isn't validated in Azure so replace the example range with yours.

> [!NOTE]
> For problems encountered during the provisioning process, please see [Troubleshooting for custom IP prefix](manage-custom-ip-address-prefix.md#troubleshooting-and-faqs).

# [Azure PowerShell](#tab/azurepowershell/)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell.
- Sign in to Azure PowerShell and select the subscription to use with this feature. For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).
- Ensure your `Az.Network` module is 5.1.1 or later. To verify the installed module, use the command `Get-InstalledModule -Name "Az.Network"`. If the module requires an update, use the command `Update-Module -Name "Az.Network"` if necessary.
- A customer owned IPv4 range to provision in Azure.
    - A sample customer range (1.2.3.0/24) is used for this example. This range isn't validated in Azure so replace the example range with yours.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

> [!NOTE]
> For problems encountered during the provisioning process, please see [Troubleshooting for custom IP prefix](manage-custom-ip-address-prefix.md#troubleshooting-and-faqs).

---

## Pre-provisioning steps

[!INCLUDE [ip-services-pre-provisioning-steps](../../../includes/ip-services-pre-provisioning-steps.md)]


## Provisioning and Commissioning a Custom IPv4 Prefix

The following steps display the procedure for provisioning and commissioning a custom IPv4 address prefix with a choice of two models:  Unified and Global/Regional. The steps can be performed with the Azure portal, Azure CLI, or Azure PowerShell.

# [Azure portal](#tab/azureportal)

Use the Azure portal to provision and commission a custom IPv4 address prefix with the Azure portal.

# [Azure CLI](#tab/azurecli)

Use the Azure CLI to provision and commission a custom IPv4 address prefix with the Azure CLI.

# [Azure PowerShell](#tab/azurepowershell/)

Use Azure PowerShell to provision and commission a custom IPv4 address prefix with Azure PowerShell.

---

# [Unified Model](#tab/unified/azureportal)

The following steps display the procedure for provisioning a sample customer range (1.2.3.0/24) to the US West 2 region.

> [!NOTE]
> Clean up or delete steps aren't shown on this page given the nature of the resource. For information on removing a provisioned custom IP prefix, see [Manage custom IP prefix](manage-custom-ip-address-prefix.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create and provision a unified custom IP address prefix

1. In the search box at the top of the portal, enter **Custom IP**.

2. In the search results, select **Custom IP Prefixes**.

3. Select **+ Create**.

4. In **Create a custom IP prefix**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription |
    | Resource group | Select **Create new**.</br> Enter **myResourceGroup**.</br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myCustomIPPrefix**. |
    | Region | Select **West US 2**. |
    | IP Version | Select IPv4. |
    | IPv4 Prefix (CIDR) | Enter **1.2.3.0/24**. |
    | ROA expiration date | Enter your ROA expiration date in the **yyyymmdd** format. |
    | Signed message | Paste in the output of **$byoipauthsigned** from the pre-provisioning section. |
    | Availability Zones | Select **Zone-redundant**. |

    :::image type="content" source="./media/create-custom-ip-address-prefix-portal/create-custom-ip-prefix.png" alt-text="Screenshot of create custom IP prefix page in Azure portal.":::

5. Select the **Review + create** tab or the blue **Review + create** button at the bottom of the page.

6. Select **Create**.

The range is pushed to the Azure IP Deployment Pipeline. The deployment process is asynchronous. You can check the status by reviewing the **Commissioned state** field for the custom IP prefix.

> [!NOTE]
> The estimated time to complete the provisioning process is 30 minutes.

> [!IMPORTANT]
> After the custom IP prefix is in a "Provisioned" state, a child public IP prefix can be created. These public IP prefixes and any public IP addresses can be attached to networking resources. For example, virtual machine network interfaces or load balancer front ends. The IPs won't be advertised and therefore won't be reachable. For more information on a migration of an active prefix, see [Manage a custom IP prefix](manage-custom-ip-address-prefix.md).

## Create a public IP prefix from unified custom IP prefix

When you create a prefix, you must create static IP addresses from the prefix. In this section, you create a static IP address from the prefix you created earlier.

1. In the search box at the top of the portal, enter **Custom IP**.

2. In the search results, select **Custom IP Prefixes**.

3. In **Custom IP Prefixes**, select **myCustomIPPrefix**.

4. In **Overview** of **myCustomIPPrefix**, select **+ Add a public IP prefix**.

5. Enter or select the following information in the **Basics** tab of **Create a public IP prefix**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |   |
    | Name | Enter **myPublicIPPrefix**. |
    | Region | Select **West US 2**. The region of the public IP prefix must match the region of the custom IP prefix. |
    | IP version | Select **IPv4**. |
    | Prefix ownership | Select **Custom prefix**. |
    | Custom IP prefix | Select **myCustomIPPrefix**. |
    | Prefix size | Select a prefix size. The size can be as large as the custom IP prefix. |

6. Select **Review + create**, and then **Create** on the following page.

7. Repeat steps 1-3 to return to the **Overview** page for **myCustomIPPrefix**. You see **myPublicIPPrefix** listed under the **Associated public IP prefixes** section. You can now allocate standard SKU public IP addresses from this prefix. For more information, see [Create a static public IP address from a prefix](manage-public-ip-address-prefix.md#create-a-static-public-ip-address-from-a-prefix).

## Commission the unified custom IP address prefix

When the custom IP prefix is in **Provisioned** state, update the prefix to begin the process of advertising the range from Azure.

1. In the search box at the top of the portal, enter **Custom IP** and select **Custom IP Prefixes**.

2. Verify, and wait if necessary, for **myCustomIPPrefix** to be is listed in a **Provisioned** state.

3. In **Custom IP Prefixes**, select **myCustomIPPrefix**.

4. In **Overview** of **myCustomIPPrefix**, select the **Commission** dropdown menu and choose **Globally**.

The operation is asynchronous. You can check the status by reviewing the **Commissioned state** field for the custom IP prefix. Initially, the status will show the prefix as **Commissioning**, followed in the future by **Commissioned**. The advertisement rollout isn't completed all at once. The range is partially advertised while still in the **Commissioning** status.

> [!NOTE]
> The estimated time to fully complete the commissioning process is 3-4 hours.

> [!IMPORTANT]
> As the custom IP prefix transitions to a **Commissioned** state, the range is being advertised with Microsoft from the local Azure region and globally to the Internet by Microsoft's wide area network under Autonomous System Number (ASN) 8075. Advertising this same range to the Internet from a location other than Microsoft at the same time could potentially create BGP routing instability or traffic loss. For example, a customer on-premises building. Plan any migration of an active range during a maintenance period to avoid impact. To prevent these issues during initial deployment, you can choose the regional only commissioning option where your custom IP prefix will only be advertised within the Azure region it is deployed in. For more information, see [Manage a custom IP address prefix (BYOIP)](manage-custom-ip-address-prefix.md).

# [Global/Regional Model](#tab/globalregional/azureportal)

The following steps display the modified steps for provisioning a sample global (parent) IP range (1.2.3.0/4) and regional (child) IP ranges to the US West 2 and US East 2 Regions.

> [!NOTE]
> Clean up or delete steps aren't shown on this page given the nature of the resource. For information on removing a provisioned custom IP prefix, see [Manage custom IP prefix](manage-custom-ip-address-prefix.md).

### Provision a global custom IP address prefix

Sign in to the [Azure portal](https://portal.azure.com).

## Create and provision a global custom IP address prefix

1. In the search box at the top of the portal, enter **Custom IP**.

2. In the search results, select **Custom IP Prefixes**.

3. Select **+ Create**.

4. In **Create a custom IP prefix**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription |
    | Resource group | Select **Create new**.</br> Enter **myResourceGroup**.</br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myCustomIPGlobalPrefix**. |
    | Region | Select **West US 2**. |
    | IP Version | Select IPv4. |
    | IP prefix range | Select Global. |
    | Global IPv4 Prefix (CIDR) | Enter **1.2.3.0/24**. |
    | ROA expiration date | Enter your ROA expiration date in the **yyyymmdd** format. |
    | Signed message | Paste in the output of **$byoipauthsigned** from the pre-provisioning section. |

5. Select the **Review + create** tab or the blue **Review + create** button at the bottom of the page.

6. Select **Create**.
The range is pushed to the Azure IP Deployment Pipeline. The deployment process is asynchronous. You can check the status by reviewing the **Commissioned state** field for the custom IP prefix.

> [!NOTE]
> The estimated time to complete the provisioning process is 30 minutes.

### Provision regional custom IP address prefixes

After the global custom IP prefix is in a **Provisioned** state, regional custom IP prefixes can be created. These ranges must always be of size /64 to be considered valid. The ranges can be created in any region (it doesn't need to be the same as the global custom IP prefix), keeping in mind any geolocation restrictions associated with the original global range. The "children" custom IP prefixes advertise from the region they're created in. Because the validation is only done for global custom IP prefix provision, no Authorization or Signed message is required (but availability zones can be utilized).

In the same **Create a custom IP prefix** page as before, enter or select the following information:

| Setting | Value |
| ------- | ----- |
| **Project details** |   |
| Subscription | Select your subscription |
| Resource group | Select **Create new**.</br> Enter **myResourceGroup**.</br> Select **OK**. |
| **Instance details** |   |
| Name | Enter **myCustomIPRegionalPrefix1**. |
| Region | Select **West US 2**. |
| IP Version | Select IPv4. | 
| IP prefix range | Select Regional. |
| Custom IP prefix parent | Select myCustomIPGlobalPrefix (1.2.3.0/24) from the drop-down menu. |
| Regional IPv4 Prefix (CIDR) | Enter **1.2.3.0/25**. |
| ROA expiration date | Enter your ROA expiration date in the **yyyymmdd** format. |
| Signed message | Paste in the output of **$byoipauthsigned** from the pre-provisioning section. |
| Availability Zones | Select **Zone-redundant**. |

After creation, go through the flow a second time for another regional prefix in a new region.

| Setting | Value |
| ------- | ----- |
| **Project details** |   |
| Subscription | Select your subscription |
| Resource group | Select **Create new**.</br> Enter **myResourceGroup**.</br> Select **OK**. |
| **Instance details** |   |
| Name | Enter **myCustomIPRegionalPrefix2**. |
| Region | Select **East US 2**. |
| IP Version | Select IPv4. | 
| IP prefix range | Select Regional. |
| Custom IP prefix parent | Select myCustomIPGlobalPrefix (1.2.3.0/24) from the drop-down menu. |
| Regional IPv4 Prefix (CIDR) | Enter **1.2.3.128/25**. |
| ROA expiration date | Enter your ROA expiration date in the **yyyymmdd** format. |
| Signed message | Paste in the output of **$byoipauthsigned** from the pre-provisioning section. |
| Availability Zones | Select Zone **3**. |

> [!IMPORTANT]
> After the regional custom IP prefix is in a "Provisioned" state, a child public IP prefix can be created. These public IP prefixes and any public IP addresses can be attached to networking resources. For example, virtual machine network interfaces or load balancer front ends. The IPs won't be advertised and therefore won't be reachable. For more information on a migration of an active prefix, see [Manage a custom IP prefix](manage-custom-ip-address-prefix.md).

## Create a public IP prefix from regional custom IP prefix

When you create a prefix, you must create static IP addresses from the prefix. In this section, you create a static IP address from the prefix you created earlier.

1. In the search box at the top of the portal, enter **Custom IP**.

2. In the search results, select **Custom IP Prefixes**.

3. In **Custom IP Prefixes**, select **myCustomIPPrefix**.

4. In **Overview** of **myCustomIPPrefix**, select **+ Add a public IP prefix**.

5. Enter or select the following information in the **Basics** tab of **Create a public IP prefix**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |   |
    | Name | Enter **myPublicIPPrefix**. |
    | Region | Select **West US 2**. The region of the public IP prefix must match the region of the regional custom IP prefix. |
    | IP version | Select **IPv4**. |
    | Prefix ownership | Select **Custom prefix**. |
    | Custom IP prefix | Select **myCustomIPRegionalPrefix1**. |
    | Prefix size | Select a prefix size. The size can be as large as the regional custom IP prefix. |

6. Select **Review + create**, and then **Create** on the following page.

7. Repeat steps 1-3 to return to the **Overview** page for **myCustomIPPrefix**. You see **myPublicIPPrefix** listed under the **Associated public IP prefixes** section. You can now allocate standard SKU public IP addresses from this prefix. For more information, see [Create a static public IP address from a prefix](manage-public-ip-address-prefix.md#create-a-static-public-ip-address-from-a-prefix).

### Commission the custom IP address prefixes

When commissioning custom IP prefixes using this model, the global and regional prefixes are treated separately. In other words, commissioning a regional custom IP prefix isn't connected to commissioning the global custom IP prefix.

:::image type="content" source="./media/create-custom-ip-address-prefix-portal/any-region-prefix-v4.png" alt-text="Diagram of custom IPv4 prefix showing parent prefix and child prefixes across multiple regions.":::

The safest strategy for range migrations is as follows:
1. Provision all required regional custom IP prefixes in their respective regions. Create public IP prefixes and public IP addresses and attach to resources.
2. Commission each regional custom IP prefix and test connectivity to the IPs within the region. Repeat for each regional custom IP prefix.
3. Commission the global custom IP prefix, which advertises the larger range to the Internet. Complete this step only after verifying all regional custom IP prefixes (and derived prefixes/IPs) work as expected.

To commission a custom IP prefix (regional or global) using the portal:

1. In the search box at the top of the portal, enter **Custom IP** and select **Custom IP Prefixes**.

2. Verify the custom IP prefix is in a **Provisioned** state.

3. In **Custom IP Prefixes**, select the desired custom IP prefix.

4. In **Overview** page of the custom IP prefix, select the **Commission** button near the top of the screen. If the range is global, it begins advertising from the Microsoft WAN. If the range is regional, it advertises only from the specific region.

> [!NOTE]
> The estimated time to fully complete the commissioning process for a custom IP global prefix is 3-4 hours. The estimated time to fully complete the commissioning process for a custom IP regional prefix is 30 minutes.

It's possible to commission the global custom IP prefix before the regional custom IP prefixes. Doing this advertises the global range to the Internet before the regional prefixes are ready so it's not recommended for migrations of active ranges. You can decommission a global custom IP prefix while there are still active (commissioned) regional custom IP prefixes. Also, you can decommission a regional custom IP prefix while the global prefix is still active (commissioned).

[!INCLUDE [ip-services-provisioning-note-1](../../../includes/ip-services-provisioning-note-1.md)]

# [Unified model](#tab/unified/azurecli)

The following steps display the procedure for provisioning a sample customer range (1.2.3.0/24) to the US West 2 region.

> [!NOTE]
> Clean up or delete steps aren't shown on this page given the nature of the resource. For information on removing a provisioned custom IP prefix, see [Manage custom IP prefix](manage-public-ip-address-prefix.md).

### Create a resource group and specify the prefix and authorization messages

Create a resource group in the desired location for provisioning the BYOIP range.

```azurecli-interactive
  az group create \
    --name myResourceGroup \
    --location westus2
```
### Provision a unified custom IP address prefix
The following command creates a custom IP prefix in the specified region and resource group. Specify the exact prefix in CIDR notation as a string to ensure there's no syntax error. For the `--authorization-message` parameter, use the variable **$byoipauth** that contains your subscription ID, prefix to be provisioned, and expiration date matching the Validity Date on the ROA. Ensure the format is in that order. Use the variable **$byoipauthsigned** for the `--signed-message` parameter created in the certificate readiness section.

```azurecli-interactive
  byoipauth="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|1.2.3.0/24|yyyymmdd"
  
  az network custom-ip prefix create \
    --name myCustomIpPrefix \
    --resource-group myResourceGroup \
    --location westus2 \
    --cidr ‘1.2.3.0/24’ \
    --zone 1 2 3
    --authorization-message $byoipauth \
    --signed-message $byoipauthsigned
```
The range is pushed to the Azure IP Deployment Pipeline. The deployment process is asynchronous. To determine the status, execute the following command:   

 ```azurecli-interactive
  az network custom-ip prefix show \
    --name myCustomIpPrefix \
    --resource-group myResourceGroup
```
Sample output is shown below, with some fields removed for clarity:

```
{
  "cidr": "1.2.3.0/24",
  "commissionedState": "Provisioning",
  "id": "/subscriptions/xxxx/resourceGroups/myResourceGroup/providers/Microsoft.Network/customIPPrefixes/myCustomIpPrefix",
  "location": "westus2",
  "name": myCustomIpPrefix,
  "resourceGroup": "myResourceGroup",
}
```

The **CommissionedState** field should show the range as **Provisioning** initially, followed in the future by **Provisioned**.

> [!NOTE]
> The estimated time to complete the provisioning process is 30 minutes.

> [!IMPORTANT]
> After the custom IP prefix is in a **Provisioned** state, a child public IP prefix can be created. These public IP prefixes and any public IP addresses can be attached to networking resources. For example, virtual machine network interfaces or load balancer front ends. The IPs won't be advertised and therefore won't be reachable. For more information on a migration of an active prefix, see [Manage a custom IP prefix](manage-public-ip-address-prefix.md).

### Commission the unified custom IP address prefix

When the custom IP prefix is in **Provisioned** state, the following command updates the prefix to begin the process of advertising the range from Azure.

```azurecli-interactive
az network custom-ip prefix update \
    --name myCustomIpPrefix \
    --resource-group myResourceGroup \
    --state commission 
```

As before, the operation is asynchronous. Use [az network custom-ip prefix show](/cli/azure/network/custom-ip/prefix#az-network-custom-ip-prefix-show) to retrieve the status. The **CommissionedState** field will initially show the prefix as **Commissioning**, followed in the future by **Commissioned**. The advertisement rollout isn't completed all at once. The range is partially advertised while still in the **Commissioning** status.

> [!NOTE]
> The estimated time to fully complete the commissioning process is 3-4 hours.

> [!IMPORTANT]
> As the custom IP prefix transitions to a **Commissioned** state, the range is being advertised with Microsoft from the local Azure region and globally to the Internet by Microsoft's wide area network under Autonomous System Number (ASN) 8075. Advertising this same range to the Internet from a location other than Microsoft at the same time could potentially create BGP routing instability or traffic loss. For example, a customer on-premises building. Plan any migration of an active range during a maintenance period to avoid impact. Additionally, you could take advantage of the regional commissioning feature to put a custom IP prefix into a state where it is only advertised within the Azure region it is deployed in--see [Manage a custom IP address prefix (BYOIP)](manage-custom-ip-address-prefix.md) for more information.

# [Global/Regional Model)](#tab/globalregional/azurecli)

The following steps display the modified steps for provisioning a sample global (parent) IP range (1.2.3.0/4) and regional (child) IP ranges to the US West 2 and US East 2 Regions.

> [!NOTE]
> Clean up or delete steps aren't shown on this page given the nature of the resource. For information on removing a provisioned custom IP prefix, see [Manage custom IP prefix](manage-public-ip-address-prefix.md).

### Create a resource group and specify the prefix and authorization messages

Create a resource group in the desired location for provisioning the global range resource. Although the global range will be associated with a region, the prefix will be advertised by the Microsoft WAN to the Internet globally.

```azurecli-interactive
  az group create \
    --name myResourceGroup \
    --location westus2
```

### Provision a global custom IP address prefix

The following command creates a custom IP prefix in the specified region and resource group. Specify the exact prefix in CIDR notation as a string to ensure there's no syntax error. No zonal properties are provided because the global range isn't associated with any particular region (and therefore no regional availability zones). The global custom IP prefix resource will still sit in a region in your subscription; this has no bearing on how the range will be advertised by Microsoft.

```azurecli-interactive
  byoipauth="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|1.2.3.0/24|yyyymmdd"
  
  az network custom-ip prefix create \
    --name myCustomIPGlobalPrefix \
    --resource-group myResourceGroup \
    --location westus2 \
    --cidr ‘1.2.3.0/24’ \
    --authorization-message $byoipauth \
    --signed-message $byoipauthsigned
    --isparent
```

### Provision regional custom IP address prefixes

After the global custom IP prefix is in a **Provisioned** state, regional custom IP prefixes can be created. These ranges must always be of size /64 to be considered valid. The ranges can be created in any region (it doesn't need to be the same as the global custom IP prefix), keeping in mind any geolocation restrictions associated with the original global range. The "children" custom IP prefixes advertise from the region they're created in. Because the validation is only done for global custom IP prefix provision, no Authorization or Signed message is required (but availability zones can be utilized).

```azurecli-interactive
  az network custom-ip prefix create \
    --name myCustomIPRegionalPrefix1 \
    --resource-group myResourceGroup \
    --location westus2 \
    --cidr ‘1.2.3.0/25’ \
    --zone 1 2 3 \
    --cip-prefix-parent myCustomIPGlobalPrefix

  az network custom-ip prefix create \
    --name myCustomIPRegionalPrefix2 \
    --resource-group myResourceGroup \
    --location westus2 \
    --cidr ‘1.2.3.128/25’ \
    --zone 3
    --cip-prefix-parent myCustomIPGlobalPrefix
```

After the regional custom IP prefix is in a **Provisioned** state, public IP prefixes can be derived from the regional custom IP prefix. These public IP prefixes and any public IP addresses derived from them can be attached to networking resources, though they aren't yet being advertised.

### Commission the custom IP address prefixes

When commissioning custom IP prefixes using this model, the global and regional prefixes are treated separately. In other words, commissioning a regional custom IP prefix isn't connected to commissioning the global custom IP prefix.

:::image type="content" source="./media/create-custom-ip-address-prefix-portal/any-region-prefix-v4.png" alt-text="Diagram of custom IPv4 prefix showing parent prefix and child prefixes across multiple regions.":::

The safest strategy for range migrations is as follows:
1. Provision all required regional custom IP prefixes in their respective regions. Create public IP prefixes and public IP addresses and attach to resources.
2. Commission each regional custom IP prefix and test connectivity to the IPs within the region. Repeat for each regional custom IP prefix.
3. Commission the global custom IP prefix, which advertises the larger range to the Internet. Complete this step only after verifying all regional custom IP prefixes (and derived prefixes/IPs) work as expected.

Using the previous example ranges, the command sequence would be:

```azurecli-interactive
az network custom-ip prefix update \
    --name myCustomIPRegionalPrefix \
    --resource-group myResourceGroup \
    --state commission 

az network custom-ip prefix update \
    --name myCustomIPRegionalPrefix2 \
    --resource-group myResourceGroup \
    --state commission 
```
Followed by:

```azurecli-interactive
az network custom-ip prefix update \
    --name myCustomIPGlobalPrefix \
    --resource-group myResourceGroup \
    --state commission 
```

> [!NOTE]
> The estimated time to fully complete the commissioning process for a custom IP global prefix is 3-4 hours. The estimated time to fully complete the commissioning process for a custom IP regional prefix is 30 minutes.

It's possible to commission the global custom IP prefix before the regional custom IP prefixes. Doing this advertises the global range to the Internet before the regional prefixes are ready so it's not recommended for migrations of active ranges. You can decommission a global custom IP prefix while there are still active (commissioned) regional custom IP prefixes. Also, you can decommission a regional custom IP prefix while the global prefix is still active (commissioned).

[!INCLUDE [ip-services-provisioning-note-1](../../../includes/ip-services-provisioning-note-1.md)]


# [Unified Model](#tab/unified/azurepowershell)

The following steps display the procedure for provisioning a sample customer range (1.2.3.0/24) to the US West 2 region.

> [!NOTE]
> Clean up or delete steps aren't shown on this page given the nature of the resource. For information on removing a provisioned custom IP prefix, see [Manage custom IP prefix](manage-public-ip-address-prefix.md).

### Create a resource group and specify the prefix and authorization messages

Create a resource group in the desired location for provisioning the BYOIP range. 

```azurepowershell-interactive
$rg =@{
    Name = 'myResourceGroup'
    Location = 'WestUS2'
}
New-AzResourceGroup @rg
```

### Provision a unified custom IP address prefix

The following command creates a custom IP prefix in the specified region and resource group. Specify the exact prefix in CIDR notation as a string to ensure there's no syntax error. For the `-AuthorizationMessage` parameter, substitute your subscription ID, prefix to be provisioned, and expiration date matching the Validity Date on the ROA. Ensure the format is in that order. Use the variable **$byoipauthsigned** for the `-SignedMessage` parameter created in the certificate readiness section.

```azurepowershell-interactive
$prefix =@{
    Name = 'myCustomIPPrefix'
    ResourceGroupName = 'myResourceGroup'
    Location = 'WestUS2'
    CIDR = '1.2.3.0/24'
    AuthorizationMessage = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|1.2.3.0/24|yyyymmdd'
    SignedMessage = $byoipauthsigned
}
$myCustomIpPrefix = New-AzCustomIPPrefix @prefix -Zone 1,2,3
```

The range is pushed to the Azure IP Deployment Pipeline. The deployment process is asynchronous. To determine the status, execute the following command:  

```azurepowershell-interactive
Get-AzCustomIpPrefix -ResourceId $myCustomIpPrefix.Id
```

Here's a sample output with some fields removed for clarity:

```
Name              : myCustomIpPrefix
ResourceGroupName : myResourceGroup
Location          : westus2
Id                : /subscriptions/xxxx/resourceGroups/myResourceGroup/providers/Microsoft.Network/customIPPrefixes/MyCustomIPPrefix
Cidr              : 1.2.3.0/24
Zones             : {1, 2, 3}
CommissionedState : Provisioning
```

The **CommissionedState** field should show the range as **Provisioning** initially, followed in the future by **Provisioned**.

> [!NOTE]
> The estimated time to complete the provisioning process is 30 minutes.

> [!IMPORTANT]
> After the custom IP prefix is in a **Provisioned** state, a child public IP prefix can be created. These public IP prefixes and any public IP addresses can be attached to networking resources. For example, virtual machine network interfaces or load balancer front ends. The IPs won't be advertised and therefore won't be reachable. For more information on a migration of an active prefix, see [Manage a custom IP prefix](manage-public-ip-address-prefix.md).

### Commission the unified custom IP address prefix

When the custom IP prefix is in the **Provisioned** state, the following command updates the prefix to begin the process of advertising the range from Azure.

```azurepowershell-interactive
Update-AzCustomIpPrefix -ResourceId $myCustomIPPrefix.Id -Commission
```

As before, the operation is asynchronous. Use [Get-AzCustomIpPrefix](/powershell/module/az.network/get-azcustomipprefix) to retrieve the status. The **CommissionedState** field will initially show the prefix as **Commissioning**, followed in the future by **Commissioned**. The advertisement rollout isn't completed all at once. The range is partially advertised while still in the **Commissioning** status.

> [!NOTE]
> The estimated time to fully complete the commissioning process is 3-4 hours.

> [!IMPORTANT]
> As the custom IP prefix transitions to a **Commissioned** state, the range is being advertised with Microsoft from the local Azure region and globally to the Internet by Microsoft's wide area network under Autonomous System Number (ASN) 8075. Advertising this same range to the Internet from a location other than Microsoft at the same time could potentially create BGP routing instability or traffic loss. For example, a customer on-premises building. Plan any migration of an active range during a maintenance period to avoid impact. Additionally, you could take advantage of the regional commissioning feature to put a custom IP prefix into a state where it is only advertised within the Azure region it is deployed in. For more information, see [Manage a custom IP address prefix (BYOIP)](manage-public-ip-address-prefix.md).

# [Global/Regional Model](#tab/globalregional/azurepowershell)

The following steps display the modified steps for provisioning a sample global (parent) IP range (1.2.3.0/4) and regional (child) IP ranges to the US West 2 and US East 2 Regions.

> [!NOTE]
> Clean up or delete steps aren't shown on this page given the nature of the resource. For information on removing a provisioned custom IP prefix, see [Manage custom IP prefix](manage-public-ip-address-prefix.md).

### Create a resource group and specify the prefix and authorization messages

Create a resource group in the desired location for provisioning the global range resource. Although the global range is associated with a region, the prefix is advertised by the Microsoft WAN to the Internet globally.

```azurepowershell-interactive
$rg =@{
    Name = 'myResourceGroup'
    Location = 'USWest2'
}
New-AzResourceGroup @rg
```

### Provision a global custom IP address prefix

The following command creates a custom IP prefix in the specified region and resource group. Specify the exact prefix in CIDR notation as a string to ensure there's no syntax error. No zonal properties are provided because the global range isn't associated with any particular region (and therefore no regional availability zones). The global custom IP prefix resource will still sit in a region in your subscription; this has no bearing on how the range is advertised by Microsoft.

```azurepowershell-interactive
$prefix =@{
    Name = 'myCustomGlobalPrefix'
    ResourceGroupName = 'myResourceGroup'
    Location = 'WestUS2'
    CIDR = '1.2.3.0/24'
    AuthorizationMessage = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|1.2.3.0/24|yyyymmdd'
    SignedMessage = $byoipauthsigned
}
$myCustomIPGlobalPrefix = New-AzCustomIPPrefix @prefix -IsParent
```
### Provision regional custom IP address prefixes

After the global custom IP prefix is in a **Provisioned** state, regional custom IP prefixes can be created. These ranges must always be of size /64 to be considered valid. The ranges can be created in any region (it doesn't need to be the same as the global custom IP prefix), keeping in mind any geolocation restrictions associated with the original global range. The *child* custom IP prefixes advertise from the region where they're created. Because the validation is only done for global custom IP prefix provision, no Authorization or Signed message is required (but availability zones can be utilized).

```azurepowershell-interactive
$prefix =@{
    Name = 'myCustomIPRegionalPrefix1'
    ResourceGroupName = 'myResourceGroup'
    Location = 'WestUS2'
    CIDR = '1.2.3.0/25'

}
$myCustomIPRegionalPrefix = New-AzCustomIPPrefix @prefix -CustomIpPrefixParent $myCustomIPGlobalPrefix -Zone 1,2,3

$prefix2 =@{
    Name = 'myCustomIPRegionalPrefix2'
    ResourceGroupName = 'myResourceGroup'
    Location = 'EastUS2'
    CIDR = '1.2.3.128/25'
}
$myCustomIPRegionalPrefix2 = New-AzCustomIPPrefix @prefix2 -CustomIpPrefixParent $myCustomIPGlobalPrefix -Zone 3
```

After the regional custom IP prefix is in a **Provisioned** state, public IP prefixes can be derived from the regional custom IP prefix. These public IP prefixes and any public IP addresses derived from them can be attached to networking resources, though they aren't yet being advertised.

### Commission the custom IP address prefixes

When commissioning custom IP prefixes using this model, the global and regional prefixes are treated separately. In other words, commissioning a regional custom IP prefix isn't connected to commissioning the global custom IP prefix.

:::image type="content" source="./media/create-custom-ip-address-prefix-portal/any-region-prefix-v4.png" alt-text="Diagram of custom IPv4 prefix showing parent prefix and child prefixes across multiple regions.":::

The safest strategy for range migrations is as follows:
1. Provision all required regional custom IP prefixes in their respective regions. Create public IP prefixes and public IP addresses and attach to resources.
2. Commission each regional custom IP prefix and test connectivity to the IPs within the region. Repeat for each regional custom IP prefix.
3. Commission the global custom IP prefix, which advertises the larger range to the Internet. Complete this step only after verifying all regional custom IP prefixes (and derived prefixes/IPs) work as expected.

With the previous example ranges, the command sequence would be:

```azurepowershell-interactive
Update-AzCustomIpPrefix -ResourceId $myCustomIPRegionalPrefix.Id -Commission
Update-AzCustomIpPrefix -ResourceId $myCustomIPRegionalPrefix2.Id -Commission
``` 
Followed by:

```azurepowershell-interactive
Update-AzCustomIpPrefix -ResourceId $myCustomIPGlobalPrefix.Id -Commission
```
> [!NOTE]
> The estimated time to fully complete the commissioning process for a custom IP global prefix is 3-4 hours. The estimated time to fully complete the commissioning process for a custom IP regional prefix is 30 minutes.

It's possible to commission the global custom IP prefix before the regional custom IP prefixes. Since this process advertises the global range to the Internet before the regional prefixes are ready, it's not recommended for migrations of active ranges. You can decommission a global custom IP prefix while there are still active (commissioned) regional custom IP prefixes. Also, you can decommission a regional custom IP prefix while the global prefix is still active (commissioned).

> [!IMPORTANT]
> As the global custom IP prefix transitions to a **Commissioned** state, the range is being advertised with Microsoft from the local Azure region and globally to the Internet by Microsoft's wide area network under Autonomous System Number (ASN) 8075. Advertising this same range to the Internet from a location other than Microsoft at the same time could potentially create BGP routing instability or traffic loss. For example, a customer on-premises building. Plan any migration of an active range during a maintenance period to avoid impact.

[!INCLUDE [ip-services-provisioning-note-1](../../../includes/ip-services-provisioning-note-1.md)]

---
## Next steps

- To learn about scenarios and benefits of using a custom IP prefix, see [Custom IP address prefix (BYOIP)](custom-ip-address-prefix.md).

- For more information on managing a custom IP prefix, see [Manage a custom IP address prefix (BYOIP)](manage-public-ip-address-prefix.md).
