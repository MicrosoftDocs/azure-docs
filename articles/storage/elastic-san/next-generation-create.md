---
title: Deploy Azure Elastic SAN Next Generation Preview
description: Learn how to deploy and configure Azure Elastic SAN Next Generation Preview, including autoscaling, volume groups, and volumes.
author: normesta
ms.service: azure-elastic-san
ms.topic: how-to
ms.date: 10/29/2026
ms.author: normesta
# Customer intent: "As a cloud architect, I want to deploy Azure Elastic SAN Next Generation so that I can provision scalable storage and performance for my workloads."
---

# Deploy Azure Elastic SAN Next Generation preview

This article explains how to deploy and configure Azure Elastic SAN Next Generation preview. An Elastic SAN has three main components: the SAN itself, volume groups, and volumes. SAN capacity includes a performance baseline. General purpose workloads can use the capacity-included baseline at no extra performance charge. You can provision extra SAN IOPS and throughput independently of capacity. The provisioned performance is shared across the SAN's volumes.

Use the Azure portal, Azure PowerShell, or Azure CLI procedures in this article to deploy Elastic SAN Next Generation. For Elastic SAN (Classic), see [Deploy an Elastic SAN](elastic-san-create.md).

> [!IMPORTANT]
> Azure Elastic SAN Next Generation is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An Azure subscription and a resource group for your deployment.
- Access to Elastic SAN Next Generation preview. Complete [preview signup and subscription registration](#register-for-the-preview) before deployment.
- A region supported for Elastic SAN Next Generation preview.
- If you use PowerShell, [install Azure PowerShell](/powershell/azure/install-azure-powershell). After preview approval, install or update the preview-compatible `Az.ElasticSan` module before running the creation commands in this article.
- If you use Azure CLI, [install the latest Azure CLI](/cli/azure/install-azure-cli). After preview approval, install or update the `elastic-san` extension before running the creation commands in this article.

## Register for the preview

Sign up for the [preview](https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRzfznqtAchtHvj2yCSgNjMBUOEJSNlhUUUNUVEk2M0NKQk9CQU9ZS1BaSC4u&origin=QRCode).

For the Direct Attach example in this article, register your subscription for `ElasticSanPlusAccess` in `Microsoft.ElasticSan` and `ESANDataDiskAttach` in `Microsoft.Compute`. Submitting a registration request isn't the same as receiving approval. Complete the preview approval process and confirm that both features are **Registered** before deployment.

# [Portal](#tab/azure-portal)

Use either Azure PowerShell or Azure CLI to register your subscription for the preview.

# [PowerShell](#tab/azure-powershell)

Sign in and select the subscription that you used to sign up for the preview:

```azurepowershell
Connect-AzAccount
$subscriptionId = "<subscription-id>"
Set-AzContext -Subscription $subscriptionId
```

Register the resource providers and request the two customer preview features:

```azurepowershell
Register-AzResourceProvider -ProviderNamespace "Microsoft.ElasticSan"
Register-AzResourceProvider -ProviderNamespace "Microsoft.Compute"

Register-AzProviderFeature -FeatureName "ElasticSanPlusAccess" -ProviderNamespace "Microsoft.ElasticSan"
Register-AzProviderFeature -FeatureName "ESANDataDiskAttach" -ProviderNamespace "Microsoft.Compute"
```

Check the provider and feature registration states. Continue after the required registrations show **Registered**:

```azurepowershell
Get-AzResourceProvider -ProviderNamespace "Microsoft.ElasticSan"
Get-AzResourceProvider -ProviderNamespace "Microsoft.Compute"

Get-AzProviderFeature -FeatureName "ElasticSanPlusAccess" -ProviderNamespace "Microsoft.ElasticSan"
Get-AzProviderFeature -FeatureName "ESANDataDiskAttach" -ProviderNamespace "Microsoft.Compute"
```

After preview approval, install or update the module and check the available command syntax:

```azurepowershell
Install-Module -Name Az.ElasticSan -Repository PSGallery -Scope CurrentUser -Force
Import-Module Az.ElasticSan -Force
Get-Module Az.ElasticSan | Select-Object Name, Version
Get-Command New-AzElasticSan -Syntax
```

The creation commands require a preview-compatible module that exposes `Version`, `TotalSizeTiB`, `TotalIops`, and `TotalMBps`. If these parameters aren't available, obtain the compatible package from the preview team before continuing.

# [Azure CLI](#tab/azure-cli)

The Azure CLI examples use Bash line-continuation syntax. Sign in and select the subscription that you used to sign up for the preview:

```azurecli
az login
subscriptionId="<subscription-id>"
az account set --subscription "$subscriptionId"
```

Register the resource providers and request the two customer preview features:

```azurecli
az provider register --namespace Microsoft.ElasticSan
az provider register --namespace Microsoft.Compute

az feature register \
  --namespace Microsoft.ElasticSan \
  --name ElasticSanPlusAccess

az feature register \
  --namespace Microsoft.Compute \
  --name ESANDataDiskAttach
```

Check the provider and feature registration states. Continue after the required registrations show **Registered**:

```azurecli
az provider show --namespace Microsoft.ElasticSan --query registrationState -o tsv
az provider show --namespace Microsoft.Compute --query registrationState -o tsv

az feature show \
  --namespace Microsoft.ElasticSan \
  --name ElasticSanPlusAccess \
  --query properties.state -o tsv

az feature show \
  --namespace Microsoft.Compute \
  --name ESANDataDiskAttach \
  --query properties.state -o tsv
```

After preview approval, install or update the extension and check the available command syntax:

```azurecli
az extension add --name elastic-san --upgrade --allow-preview true
az version
az extension show --name elastic-san --query version -o tsv
az elastic-san create --help
```

The creation commands require a preview-compatible extension that exposes `--version`, `--total-size-tib`, `--total-iops`, and `--total-mbps`. If these parameters aren't available, obtain the compatible package from the preview team before continuing.

---

## Limitations

- Only locally redundant storage (LRS) is supported during the preview.
- The autoscaling scale-up limit can't exceed the maximum SAN capacity supported in the selected region. See [Elastic SAN Next Generation scale targets](next-generation-scale-targets.md).
- A Business critical volume group supports only direct-attach connections.
- Across all Business critical volume groups in a SAN, total reserved IOPS and total reserved throughput can each be up to 80% of their corresponding SAN-level provisioned values. Each group's reserved performance is available only to volumes within that group; it isn't shared with other Business critical volume groups.
- Direct-attach volume groups support only platform-managed encryption keys.
- You can't change a volume group's connection type or QoS tier after you create it.

## Create the SAN

Choose the tab for your deployment tool. Use the same subscription, resource group, location, and resource names throughout the steps for that tool.

# [Portal](#tab/azure-portal)

The portal steps create a Next Generation SAN, a volume group, and a volume in a single deployment. The screenshots show example settings; they don't define required defaults. Select the subscription, resource group, and supported preview region for your deployment.

1. In the [Azure portal](https://portal.azure.com), search for **Elastic SANs**. In **Storage center**, open **Elastic SAN**, select **Resources**, and select **Create**.
1. On the **Basics** tab, under **Elastic SAN Type**, select **Elastic SAN Next Generation (Preview)**, not **Elastic SAN (Classic)**.

    > [!IMPORTANT]
    > After creation, you can't revert an Elastic SAN Next Generation to a classic SAN.

1. Under **Project details**, select your **Subscription** and **Resource group**.
1. Under **Instance details**, enter an **Elastic SAN name**, select a supported **Region**, and select **Locally-redundant storage (LRS)** for **Redundancy**. Review the **Availability zone** for your deployment.

    The SAN name must be between 3 and 24 characters long. It can contain only lowercase letters, numbers, hyphens, and underscores, and must begin and end with a letter or number. Each hyphen and underscore must be preceded and followed by a letter or number.

1. Under **Resource provisioning on Elastic SAN**, set **Size (TiB)**, **IOPS**, and **Bandwidth (MBps)**. Each provisioned TiB includes a baseline of 2,000 IOPS and 64 MB/s. You can provision extra IOPS and throughput independently of capacity.

    To use the portal's recommended performance, leave the IOPS and bandwidth fields at their gray values. These recommendations update when you change capacity. The following example uses 20 TiB, 40,000 IOPS, 1,280 MBps, and **Zone 1**. These settings are examples, not requirements for every deployment.

    Elastic SAN Next Generation uses thin provisioning. The combined provisioned size of all volumes can't exceed either five times the SAN's provisioned capacity or the configured autoscale maximum, whichever is lower. Capacity is consumed as data is written to the volumes.

    :::image type="content" source="media/next-generation-create/basics.png" alt-text="Screenshot of the Basics tab with Elastic SAN Next Generation selected and example settings of LRS Zone 1, 20 TiB, 40,000 IOPS, and 1,280 MBps." lightbox="media/next-generation-create/basics.png":::

1. Select **Next** to open **Policies**. Autoscaling is always enabled for Next Generation SANs and can't be disabled. Review the following fields:

    - **Unused size:** The amount of unused capacity that triggers an automatic capacity increase when available capacity drops below the threshold.
    - **Increase capacity unit:** The amount of capacity that the SAN adds when autoscaling is triggered.
    - **Max scale up:** The maximum capacity that autoscaling can provision. Enter a value within the range accepted by the portal.

    The following example uses an unused capacity threshold of 1 TiB, a capacity increase of 1 TiB, and a scale-up limit of 100 TiB. Choose supported values for your deployment.

    When you approach your unused capacity threshold, your SAN automatically provisions the specified capacity increase amount. This process repeats as needed until the SAN reaches the scale-up limit. You can modify all three autoscaling values after deployment.

    :::image type="content" source="media/next-generation-create/policies.png" alt-text="Screenshot of the Policies tab with autoscaling enabled and example settings of a 1-TiB unused capacity threshold, a 1-TiB capacity increase, and a 100-TiB scale-up limit." lightbox="media/next-generation-create/policies.png":::

1. Select **Next** to open **Networking**. Review **Public network access (iSCSI only)**. This setting applies only to iSCSI volume groups, not direct-attach connections.

    For iSCSI, configure network rules in each volume group. If you disable public network access, use private endpoints for iSCSI connectivity. The following example selects **Enable from virtual networks** and uses a direct-attach volume group, which doesn't require virtual network configuration.

    :::image type="content" source="media/next-generation-create/networking.png" alt-text="Screenshot of the Networking tab with Enable from virtual networks selected for iSCSI public network access." lightbox="media/next-generation-create/networking.png":::

1. Select **Next** to open **Volume groups** and continue with the next section. To deploy only the SAN, skip volume groups and volumes and proceed to [Review and deploy](#review-and-deploy).

# [PowerShell](#tab/azure-powershell)

The following example creates a 1-TiB Next Generation SAN with 2,000 IOPS, 64 MB/s, and an autoscaling maximum of 5 TiB. Replace the resource names and select a supported preview region and zone. The example uses a smaller capacity than the portal screenshots.

```azurepowershell
$resourceGroupName = "<existing-resource-group>"
$sanName = "<san-name>"
$location = "francecentral"
$zone = "1"
$volumeGroupName = "volume-group-01"
$volumeName = "volume-01"

New-AzElasticSan -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -Name $sanName `
    -Location $location -AvailabilityZone $zone `
    -SkuName "ElasticSAN_LRS" -Version V2 `
    -TotalSizeTiB 1 -TotalIops 2000 -TotalMBps 64 `
    -AutoScalePolicyEnforcement Enabled `
    -CapacityUnitScaleUpLimitTiB 5 `
    -IncreaseCapacityUnitByTiB 1 -UnusedSizeTiB 1
```

# [Azure CLI](#tab/azure-cli)

The following example creates a 1-TiB Next Generation SAN with 2,000 IOPS, 64 MB/s, and an autoscaling maximum of 5 TiB. Replace the resource names and select a supported preview region and zone. The example uses a smaller capacity than the portal screenshots.

```azurecli
resourceGroupName="<existing-resource-group>"
sanName="<san-name>"
location="francecentral"
zone="1"
volumeGroupName="volume-group-01"
volumeName="volume-01"

az elastic-san create \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --name "$sanName" \
  --location "$location" --availability-zones "$zone" \
  --sku "{name:ElasticSAN_LRS}" --version V2 \
  --total-size-tib 1 --total-iops 2000 --total-mbps 64 \
  --auto-scale-policy-enforcement Enabled \
  --capacity-unit-scale-up-limit-tib 5 \
  --increase-capacity-unit-by-tib 1 --unused-size-tib 1
```

---

## Create a volume group

PowerShell and Azure CLI use the parameter value `PerformanceCritical` to select the Business critical tier. This executable value differs from the customer-facing tier name.

# [Portal](#tab/azure-portal)

1. On the **Volume groups** tab, select **Create volume group**.
1. On the volume group's **Basics** tab, enter a **Volume group name**, such as `volume-group-01`.

    The volume group name must be between 3 and 63 characters long. It can contain only lowercase letters, numbers, and hyphens, and must begin and end with a letter or number. Each hyphen must be preceded and followed by a letter or number. You can't change the volume group name after you create it.

1. Select a **QoS tier**:

    - **General Purpose** (default): Shares performance and supports direct-attach and iSCSI connections.
    - **Business Critical**: Supports direct-attach connections. Specify the IOPS and throughput to reserve for the volume group. The group's reserved performance is available only to volumes within that group. Across all Business Critical volume groups in the SAN, total reserved IOPS and total reserved throughput can each be up to 80% of their corresponding SAN-level provisioned values.

1. Select a **Connection type**. The example keeps **Direct attach**, the default. Direct attach doesn't require networking configuration, so the volume group's **Networking** tab is disabled.

    If you select **General Purpose** with **iSCSI**, configure virtual network access control lists (ACLs) or private endpoints. Enable **CRC Protection** unless you plan to connect the volume group to Azure VMware Solution or use clients running Fedora or a downstream Linux distribution such as Red Hat Enterprise Linux or CentOS.

    > [!NOTE]
    > CRC protection only applies to iSCSI connections.

    For iSCSI network setup, see [Configure service endpoints](elastic-san-configure-service-endpoints.md) or [Configure private endpoints](elastic-san-configure-private-endpoints.md).

1. Review **Encryption type**. For direct attach, keep **Platform-managed key**; **Customer-managed key** isn't available. For iSCSI, you can use platform-managed or customer-managed keys. Before you choose a customer-managed key for an iSCSI volume group, complete the [customer-managed key prerequisites and setup](elastic-san-configure-customer-managed-keys.md), including the required key vault, key, and managed identity permissions.

    :::image type="content" source="media/next-generation-create/volume-group.png" alt-text="Screenshot of volume group creation with General Purpose, Direct attach, and Platform-managed key selected." lightbox="media/next-generation-create/volume-group.png":::

1. Select **Create** to add the volume group to the pending SAN configuration. On the SAN's **Volume groups** tab, verify that your group appears, then select **Next** to open **Volumes**.

# [PowerShell](#tab/azure-powershell)

Create a General purpose volume group with Direct attach and platform-managed keys:

```azurepowershell
New-AzElasticSanVolumeGroup -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -ElasticSanName $sanName `
    -Name $volumeGroupName -ProtocolType DirectAttach `
    -QualityOfService GeneralPurpose -Encryption EncryptionAtRestWithPlatformKey
```

# [Azure CLI](#tab/azure-cli)

Create a General purpose volume group with Direct attach. This example uses platform-managed keys:

```azurecli
az elastic-san volume-group create \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --elastic-san-name "$sanName" \
  --name "$volumeGroupName" \
  --protocol-type DirectAttach --quality-of-service GeneralPurpose
```

---

## Create a volume

# [Portal](#tab/azure-portal)

1. On the **Volumes** tab, enter a volume name in the **Volumes** column, such as `volume-01`.
1. Select the **Volume group** where you want to create the volume. The example uses `volume-group-01`.
1. Enter **Volume size (GiB)**. This field has no default. Volume capacity is provisioned in 1-GiB increments, and you can create a volume as small as 1 GiB. The example uses 1 GiB.

    The volume inherits the encryption and connection settings of its volume group. The portal displays **Maximum IOPS** and **Maximum bandwidth (MBps)** based on the volume size.

    :::image type="content" source="media/next-generation-create/volumes.png" alt-text="Screenshot of the Volumes tab with a 1-GiB volume named volume-01 in volume-group-01 and its calculated performance." lightbox="media/next-generation-create/volumes.png":::

1. Leave the extra empty row blank unless you want to add another volume. Select **Next** to open **Tags**.

# [PowerShell](#tab/azure-powershell)

Create a 1-GiB volume in the volume group:

```azurepowershell
New-AzElasticSanVolume -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -ElasticSanName $sanName `
    -VolumeGroupName $volumeGroupName -Name $volumeName -SizeGiB 1
```

# [Azure CLI](#tab/azure-cli)

Create a 1-GiB volume in the volume group:

```azurecli
az elastic-san volume create \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --elastic-san-name "$sanName" \
  --volume-group-name "$volumeGroupName" --name "$volumeName" --size-gib 1
```

---

## Review and deploy

For an Azure portal deployment, review and submit the pending configuration. For PowerShell or Azure CLI, verify the resources created in the preceding sections.

# [Portal](#tab/azure-portal)

1. On **Tags**, optionally add name/value pairs. To keep the default values, leave the fields blank.
1. Select **Next** to open **Review + create**. Wait for **Validation passed**, then review the SAN type, location, redundancy, capacity, performance, autoscaling policy, volume group, and volume.

    :::image type="content" source="media/next-generation-create/review-create.png" alt-text="Screenshot of Review and create after validation passes, showing the Next Generation SAN and example volume group and volume." lightbox="media/next-generation-create/review-create.png":::

1. Select **Review + create** at the bottom of the review page to submit the deployment.
1. Wait until the deployment page displays **Your deployment is complete**. Select **Go to resource** to open the SAN.

    :::image type="content" source="media/next-generation-create/deployment-complete.png" alt-text="Screenshot of the completed deployment with the Go to resource button." lightbox="media/next-generation-create/deployment-complete.png":::

# [PowerShell](#tab/azure-powershell)

Verify that the SAN, volume group, and volume report a successful provisioning state and the settings you requested:

```azurepowershell
Get-AzElasticSan -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -Name $sanName

Get-AzElasticSanVolumeGroup -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -ElasticSanName $sanName `
    -Name $volumeGroupName

Get-AzElasticSanVolume -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -ElasticSanName $sanName `
    -VolumeGroupName $volumeGroupName -Name $volumeName
```

# [Azure CLI](#tab/azure-cli)

Verify that the SAN, volume group, and volume report a successful provisioning state and the settings you requested:

```azurecli
az elastic-san show \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --name "$sanName"

az elastic-san volume-group show \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --elastic-san-name "$sanName" \
  --name "$volumeGroupName"

az elastic-san volume show \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --elastic-san-name "$sanName" \
  --volume-group-name "$volumeGroupName" --name "$volumeName"
```

---

## Next steps

Creating the resources doesn't attach a volume to a VM or configure a guest operating system. Continue with the guide for your connection type:

- **Direct Attach:** [Attach and detach Elastic SAN Next Generation volumes](next-generation-attach-volume-portal.md).
- **iSCSI on Windows:** [Connect to Elastic SAN volumes from Windows](elastic-san-connect-windows.md).
- **iSCSI on Linux:** [Connect to Elastic SAN volumes from Linux](elastic-san-connect-linux.md).
- **iSCSI with Azure VMware Solution:** [Use Azure VMware Solution with Azure Elastic SAN](../../azure-vmware/configure-azure-elastic-san.md?toc=/azure/storage/elastic-san/toc.json).