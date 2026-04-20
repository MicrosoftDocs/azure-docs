---
title: View or upgrade an Azure Bastion SKU
titleSuffix: Azure Bastion
description: Learn how to view your current Azure Bastion SKU and upgrade to a higher tier using the Azure portal or Azure CLI.
author: cherylmc
ms.service: azure-bastion
ms.topic: how-to
ms.date: 02/10/2026
ms.author: cherylmc

# Customer intent: As an Azure administrator, I want to view and upgrade my Bastion SKU so that I can enhance the features and capabilities of my secure remote access setup.
---

# View or upgrade an Azure Bastion SKU

This article helps you view your current Azure Bastion SKU and upgrade to a higher tier. You can upgrade using the Azure portal or Azure CLI.

> [!IMPORTANT]
> Once you upgrade, you can't revert to a lower SKU without deleting and reconfiguring Azure Bastion. Plan your upgrade carefully and consider starting with the tier that meets your long-term requirements.

To compare SKU features and determine which tier is right for you, see [Choose the right Azure Bastion SKU](bastion-sku-comparison.md).

[!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

## Prerequisites

Before upgrading your Azure Bastion SKU, verify the following requirements:

- **Azure CLI**: If using Azure CLI, install the [bastion extension](/cli/azure/network/bastion). The extension installs automatically the first time you run an `az network bastion` command. Requires Azure CLI version 2.62.0 or higher.
- **Permissions**: You need Contributor or Owner role on the resource group containing your Bastion host.
- **Subnet requirements** (Developer SKU upgrade only): A subnet named **AzureBastionSubnet** with a prefix of /26 or larger (/25, /24, etc.) must exist in your virtual network or be created before upgrading.
- **Public IP** (Developer SKU upgrade only): A Standard SKU public IP address with static allocation is required unless you're deploying Premium SKU with private-only configuration.

## Pre-upgrade considerations

### What happens during an upgrade

- **Duration**: The upgrade process takes approximately 10 minutes to complete.
- **Active sessions**: Existing connections might be briefly interrupted during the upgrade. Plan the upgrade during a maintenance window when possible.

### Cost implications

Upgrading to a higher SKU increases your hourly costs. Review the [Azure Bastion pricing page](https://azure.microsoft.com/pricing/details/azure-bastion/) to understand the cost difference between tiers before upgrading.

## View your current SKU

# [Portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to your Bastion host.
1. In the left pane, select **Configuration**. Your current SKU is displayed in the **Tier** dropdown. You can also see which features are available for each tier by selecting different options.

# [Azure CLI](#tab/cli)

Run the following command to view your current Bastion SKU:

```azurecli
az network bastion show --name <bastion-name> --resource-group <resource-group-name> --query sku.name --output tsv
```

> [!IMPORTANT]
> When using `az network bastion update`, you must include the `--location` parameter matching the region of your existing Bastion host. If omitted, the CLI may default to a different region, resulting in an `InvalidResourceLocation` error.

---

## Upgrade from Developer SKU

The Developer SKU uses shared infrastructure. When you upgrade to Basic, Standard, or Premium, Azure Bastion switches to dedicated infrastructure, which requires a dedicated subnet and public IP address.

# [Portal](#tab/portal)

1. **Create the AzureBastionSubnet** (if it doesn't exist):
   1. Go to your virtual network in the Azure portal.
   1. Select **Subnets** > **+ Subnet**.
   1. Enter **AzureBastionSubnet** as the name (this exact name is required).
   1. Enter a subnet address range of /26 or larger.
   1. Select **Save**.

1. **Upgrade the Bastion host**:
   1. Go to your Bastion host.
   1. Select **Configuration** in the left pane.
   1. For **Tier**, select your target SKU (Basic, Standard, or Premium).
   1. For **Public IP address**, select an existing Standard SKU public IP or create a new one.
   1. The **Subnet** field automatically populates with your AzureBastionSubnet.
   1. (Optional) Enable any additional features you want to configure.
   1. Select **Apply**.

The upgrade takes approximately 10 minutes to complete.

# [Azure CLI](#tab/cli)

1. **Create the AzureBastionSubnet** (if it doesn't exist):

   ```azurecli
   az network vnet subnet create \
       --resource-group <resource-group-name> \
       --vnet-name <vnet-name> \
       --name AzureBastionSubnet \
       --address-prefixes <subnet-prefix>/26
   ```

1. **Create a public IP address** (if you don't have one):

   ```azurecli
   az network public-ip create \
       --resource-group <resource-group-name> \
       --name <public-ip-name> \
       --sku Standard \
       --allocation-method Static
   ```

1. **Upgrade the Bastion host**:

   The `az network bastion update` command can't add the IP configuration required for dedicated infrastructure. Delete the Developer SKU Bastion host and create a new one with the target SKU:

   ```azurecli
   az network bastion delete \
       --name <bastion-name> \
       --resource-group <resource-group-name>
   ```

   ```azurecli
   az network bastion create \
       --name <bastion-name> \
       --resource-group <resource-group-name> \
       --vnet-name <vnet-name> \
       --public-ip-address <public-ip-name> \
       --sku <Basic|Standard|Premium> \
       --location <location>
   ```

---

## Upgrade from Basic or Standard SKU

Basic, Standard, and Premium SKUs all use the same dedicated infrastructure, so upgrading between these tiers requires only a configuration change.

# [Portal](#tab/portal)

1. Go to your Bastion host in the Azure portal.
1. Select **Configuration** in the left pane.
1. For **Tier**, select the higher SKU you want to upgrade to.
1. (Optional) Enable any additional features available with the new SKU.
1. Select **Apply**.

The upgrade takes approximately 10 minutes to complete.

# [Azure CLI](#tab/cli)

Run the following command to upgrade your Bastion SKU:

```azurecli
az network bastion update \
    --name <bastion-name> \
    --resource-group <resource-group-name> \
    --location <location> \
    --sku name=<Standard|Premium>
```

To enable features during the upgrade, add the appropriate parameters. For example, to enable native client support and IP-based connection:

```azurecli
az network bastion update \
    --name <bastion-name> \
    --resource-group <resource-group-name> \
    --location <location> \
    --sku name=Standard \
    --enable-tunneling true \
    --enable-ip-connect true
```

---

## Verify the upgrade

After the upgrade completes, verify that your Bastion host is functioning correctly:

# [Portal](#tab/portal)

1. Go to your Bastion host and select **Configuration**.
1. Verify the **Tier** shows your new SKU.
1. Check that your desired features are enabled.
1. Test a connection to a VM to confirm connectivity.

# [Azure CLI](#tab/cli)

1. Verify the SKU was updated:

   ```azurecli
   az network bastion show \
       --name <bastion-name> \
       --resource-group <resource-group-name> \
       --query "{Name:name, SKU:sku.name, ProvisioningState:provisioningState}" \
       --output table
   ```

1. Confirm the provisioning state shows **Succeeded**.

---

## Troubleshooting

If you encounter issues during or after the upgrade, see [Troubleshoot Azure Bastion](troubleshoot.md#sku-upgrade-issues).

## Next steps

- [Choose the right Azure Bastion SKU](bastion-sku-comparison.md)
- [Configure host scaling](configure-host-scaling.md)
- [Configure session recording](session-recording.md) (Premium SKU)
- [Deploy private-only Bastion](private-only-deployment.md) (Premium SKU)
- [About Bastion configuration settings](configuration-settings.md)
