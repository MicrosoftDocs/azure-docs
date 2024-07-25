---
title: Create a custom IPv4 address prefix - Azure portal
titleSuffix: Azure Virtual Network
description: Learn how to onboard a custom IP address prefix using the Azure portal
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 07/25/2024
---

# Create a custom IPv4 address prefix using the Azure portal

A custom IPv4 address prefix enables you to bring your own IPv4 ranges to Microsoft and associate it to your Azure subscription. You maintain ownership of the range while Microsoft would be permitted to advertise it to the Internet. A custom IP address prefix functions as a regional resource that represents a contiguous block of customer owned IP addresses. 

The steps in this article detail the process to:

* Prepare a range to provision

* Provision the range for IP allocation

* Enable the range to be advertised by Microsoft

## Prerequisites

# [Azure portal](#tab/azureportal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A customer owned IPv4 range to provision in Azure.
    - A sample customer range (1.2.3.0/24) is used for this example. This range won't be validated by Azure. Replace the example range with yours.

> [!NOTE]
> For problems encountered during the provisioning process, please see [Troubleshooting for custom IP prefix](manage-custom-ip-address-prefix.md#troubleshooting-and-faqs).

# [Azure CLI](#tab/azurecli/)

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- This tutorial requires version 2.28 or later of the Azure CLI (you can run az version to determine which you have). If using Azure Cloud Shell, the latest version is already installed.
- Sign in to Azure CLI and ensure you've selected the subscription with which you want to use this feature using `az account`.
- A customer owned IPv4 range to provision in Azure.
    - A sample customer range (1.2.3.0/24) is used for this example. This range won't be validated by Azure. Replace the example range with yours.

> [!NOTE]
> For problems encountered during the provisioning process, please see [Troubleshooting for custom IP prefix](manage-custom-ip-address-prefix.md#troubleshooting-and-faqs).

# [Azure PowerShell](#tab/azurepowershell/)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell.
- Sign in to Azure PowerShell and ensure you've selected the subscription with which you want to use this feature.  For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).
- Ensure your `Az.Network` module is 5.1.1 or later. To verify the installed module, use the command `Get-InstalledModule -Name "Az.Network"`. If the module requires an update, use the command `Update-Module -Name "Az.Network"` if necessary.
- A customer owned IPv4 range to provision in Azure.
    - A sample customer range (1.2.3.0/24) is used for this example. This range won't be validated by Azure. Replace the example range with yours.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

> [!NOTE]
> For problems encountered during the provisioning process, please see [Troubleshooting for custom IP prefix](manage-custom-ip-address-prefix.md#troubleshooting-and-faqs).

---

[!INCLUDE [ip-services-pre-provisioning-steps](../../../includes/ip-services-pre-provisioning-steps.md)]

## Provisioning steps

The following steps display the procedure for provisioning a sample customer range (1.2.3.0/24) to the US West 2 region.

> [!NOTE]
> Clean up or delete steps aren't shown on this page given the nature of the resource. For information on removing a provisioned custom IP prefix, see [Manage custom IP prefix](manage-custom-ip-address-prefix.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create and provision a custom IP address prefix

1. In the search box at the top of the portal, enter **Custom IP**.

2. In the search results, select **Custom IP Prefixes**.

3. Select **+ Create**.

4. In **Create a custom IP prefix**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroup**. </br> Select **OK**. |
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

## Create a public IP prefix from custom IP prefix

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

10. Repeat steps 1-5 to return to the **Overview** page for **myCustomIPPrefix**. You see **myPublicIPPrefix** listed under the **Associated public IP prefixes** section. You can now allocate standard SKU public IP addresses from this prefix. For more information, see [Create a static public IP address from a prefix](manage-public-ip-address-prefix.md#create-a-static-public-ip-address-from-a-prefix).

## Commission the custom IP address prefix

When the custom IP prefix is in **Provisioned** state, update the prefix to begin the process of advertising the range from Azure.

1. In the search box at the top of the portal, enter **Custom IP** and select **Custom IP Prefixes**.

2. Verify, and wait if necessary, for **myCustomIPPrefix** to be is listed in a **Provisioned** state.

3.  In **Custom IP Prefixes**, select **myCustomIPPrefix**.

4. In **Overview** of **myCustomIPPrefix**, select the **Commission** dropdown menu and choose **Globally**.

The operation is asynchronous. You can check the status by reviewing the **Commissioned state** field for the custom IP prefix. Initially, the status will show the prefix as **Commissioning**, followed in the future by **Commissioned**. The advertisement rollout isn't binary and the range will be partially advertised while still in the **Commissioning** status.

> [!NOTE]
> The estimated time to fully complete the commissioning process is 3-4 hours.

> [!IMPORTANT]
> As the custom IP prefix transitions to a **Commissioned** state, the range is being advertised with Microsoft from the local Azure region and globally to the Internet by Microsoft's wide area network under Autonomous System Number (ASN) 8075. Advertising this same range to the Internet from a location other than Microsoft at the same time could potentially create BGP routing instability or traffic loss. For example, a customer on-premises building. Plan any migration of an active range during a maintenance period to avoid impact.  To prevent these issues during initial deployment, you can choose the regional only commissioning option where your custom IP prefix will only be advertised within the Azure region it is deployed in. For more information, see [Manage a custom IP address prefix (BYOIP)](manage-custom-ip-address-prefix.md) for more information.

## Next steps

- To learn about scenarios and benefits of using a custom IP prefix, see [Custom IP address prefix (BYOIP)](custom-ip-address-prefix.md).

- For more information on managing a custom IP prefix, see [Manage a custom IP address prefix (BYOIP)](manage-custom-ip-address-prefix.md).

- To create a custom IP address prefix using the Azure CLI, see [Create custom IP address prefix using the Azure CLI](create-custom-ip-address-prefix-cli.md).

- To create a custom IP address prefix using PowerShell, see [Create a custom IP address prefix using Azure PowerShell](create-custom-ip-address-prefix-powershell.md).