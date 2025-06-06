---
title: Configure networking for Azure Elastic SAN
description: Learn how to secure Azure Elastic SAN volumes through access configuration.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 01/24/2025
ms.author: rogarana
ms.custom: references_regions, devx-track-azurecli, devx-track-azurepowershell
---

# Configure network access for Azure Elastic SAN

You must configure a path for network traffic to connect to your Azure Elastic SAN volumes. There are two configurations you can setup: Private Endpoints or service endpoints. Generally, if you can, you should use Private Endpoints as they privately route all traffic between your virtual network and your volume groups over a private link, through the Microsoft backbone network. Whereas service endpoints are public, and accessible via the internet. 

This article describes how to configure your Elastic SAN to allow access from your Azure virtual network infrastructure.

## Prerequisites

- [Deploy an Elastic SAN](elastic-san-create.md)
- If you're using Azure PowerShell, install the [latest Azure PowerShell module](/powershell/azure/install-azure-powershell)
- If you're using Azure CLI, install the [latest version](/cli/azure/install-azure-cli)
    - Once you've installed the latest version, run `az extension add -n elastic-san` to install the extension for Elastic SAN

## Configure public network access

You enable public Internet access to your Elastic SAN endpoints at the SAN level. Enabling public network access for an Elastic SAN allows you to configure public access to individual volume groups over storage service endpoints. By default, public access to individual volume groups is denied even if you allow it at the SAN level. You must explicitly configure your volume groups to permit access from specific IP address ranges and virtual network subnets.

You can enable public network access when you create an elastic SAN, or enable it for an existing SAN using the Azure PowerShell module or the Azure CLI.

# [Portal](#tab/azure-portal)

Use the Azure PowerShell module or the Azure CLI to enable public network access.

# [PowerShell](#tab/azure-powershell)

Use this sample code to update an Elastic SAN to enable public network access using PowerShell. Replace the values of `RgName` and `EsanName` with your own, then run the sample:

```powershell
# Set the variable values.
$RgName       = "<ResourceGroupName>"
$EsanName     = "<ElasticSanName>"
# Update the Elastic San.
Update-AzElasticSan -Name $EsanName -ResourceGroupName $RgName -PublicNetworkAccess Enabled
```

# [Azure CLI](#tab/azure-cli)

Use this sample code to update an Elastic SAN to enable public network access using the Azure CLI. Replace the values of `RgName` and `EsanName` with your own values:

```azurecli
# Set the variable values.
$RgName="<ResourceGroupName>"
$EsanName="<ElasticSanName>"
# Update the Elastic San.
az elastic-san update \
    --elastic-san-name $EsanName \
    --resource-group $RgName \
    --public-network-access enabled
```

---

## Configure iSCSI error detection

### Enable iSCSI error detection

To enable CRC-32C checksum verification for iSCSI headers or data payloads, set CRC-32C on header or data digests for all connections on your clients that connect to Elastic SAN volumes. To do this, connect your clients to Elastic SAN volumes using multi-session scripts generated either in the Azure portal or provided in either the [Windows](elastic-san-connect-windows.md) or [Linux](elastic-san-connect-Linux.md) Elastic SAN connection articles.

If you need to, you can do this without the multi-session connection scripts. On Windows, you can do this by setting header or data digests to 1 during login to the Elastic SAN volumes (`LoginTarget` and `PersistentLoginTarget`). On Linux, you can do this by updating the global iSCSI configuration file (iscsid.conf, generally found in /etc/iscsi directory). When a volume is connected, a node is created along with a configuration file specific to that node (for example, on Ubuntu it can be found in /etc/iscsi/nodes/$volume_iqn/portal_hostname,$port directory) inheriting the settings from global configuration file. If you have already connected volumes to your client before updating your global configuration file, update the node specific configuration file for each volume directly, or using the following command:

```sudo iscsiadm -m node -T $volume_iqn -p $portal_hostname:$port -o update -n $iscsi_setting_name -v $setting_value```

Where
- $volume_iqn: Elastic SAN volume IQN
- $portal_hostname: Elastic SAN volume portal hostname
- $port: 3260
- $iscsi_setting_name: node.conn[0].iscsi.HeaderDigest (or) node.conn[0].iscsi.DataDigest 
- $setting_value: CRC32C

### Enforce iSCSI error detection

To enforce iSCSI error detection, set CRC-32C for both header and data digests on your clients and enable the CRC protection property on the volume group that contains volumes already connected to or have yet to be connected to from your clients. If your Elastic SAN volumes are already connected and don't have CRC-32C for both digests, you should disconnect the volumes and reconnect them using multi-session scripts generated in the Azure portal when connecting to an Elastic SAN volume, or from the [Windows](elastic-san-connect-windows.md) or [Linux](elastic-san-connect-Linux.md) Elastic SAN connection articles.

> [!NOTE]
> CRC protection feature isn't currently available in North Europe and South Central US.

To enable CRC protection on the volume group:

# [Portal](#tab/azure-portal)

Enable CRC protection on a new volume group:

:::image type="content" source="media/elastic-san-networking/elastic-san-crc-protection-create-volume-group.png" alt-text="Screenshot of CRC protection enablement on new volume group." lightbox="media/elastic-san-networking/elastic-san-crc-protection-create-volume-group.png":::

Enable CRC protection on an existing volume group:

:::image type="content" source="media/elastic-san-networking/elastic-san-crc-protection-update-volume-group.png" alt-text="Screenshot of CRC protection enablement on an existing volume group." lightbox="media/elastic-san-networking/elastic-san-crc-protection-update-volume-group.png":::

# [PowerShell](#tab/azure-powershell)

Use this script to enable CRC protection on a new volume group using the Azure PowerShell module. Replace the values of `$RgName`, `$EsanName`, `$EsanVgName` before running the script.

```powershell
# Set the variable values.
# The name of the resource group where the Elastic San is deployed.
$RgName = "<ResourceGroupName>"
# The name of the Elastic SAN.
$EsanName = "<ElasticSanName>"
# The name of volume group within the Elastic SAN.
$EsanVgName = "<VolumeGroupName>"

# Create a volume group by enabling CRC protection
New-AzElasticSanVolumeGroup -ResourceGroupName $RgName -ElasticSANName $EsanName -Name $EsanVgName -EnforceDataIntegrityCheckForIscsi $true

```

Use this script to enable CRC protection on an existing volume group using the Azure PowerShell module. Replace the values of `$RgName`, `$EsanName`, `$EsanVgName` before running the script.

```powershell
# Set the variable values.
$RgName = "<ResourceGroupName>"
$EsanName = "<ElasticSanName>"
$EsanVgName = "<VolumeGroupName>"

# Edit a volume group to enable CRC protection
Update-AzElasticSanVolumeGroup -ResourceGroupName $RgName -ElasticSANName $EsanName -Name $EsanVgName -EnforceDataIntegrityCheckForIscsi $true
```

# [Azure CLI](#tab/azure-cli)

The following code sample enable CRC protection on a new volume group using Azure CLI. Replace the values of `RgName`, `EsanName`, `EsanVgName`, before running the sample.

```azurecli
# Set the variable values.
# The name of the resource group where the Elastic San is deployed.
RgName="<ResourceGroupName>"
# The name of the Elastic SAN.
EsanName="<ElasticSanName>"
# The name of volume group within the Elastic SAN.
EsanVgName= "<VolumeGroupName>"

# Create the Elastic San.
az elastic-san volume-group create \
    --elastic-san-name $EsanName \
    --resource-group $RgName \
    --volume-group-name $EsanVgName \
    --data-integrity-check true
```

The following code sample enable CRC protection on an existing volume group using Azure CLI. Replace the values of `RgName`, `EsanName`, `EsanVgName`, before running the sample.

```azurecli
# Set the variable values.
RgName="<ResourceGroupName>"
EsanName="<ElasticSanName>"
EsanVgName= "<VolumeGroupName>"

# Create the Elastic San.
az elastic-san volume-group update \
    --elastic-san-name $EsanName \
    --resource-group $RgName \
    --volume-group-name $EsanVgName \
    --data-integrity-check true
```

---


## Configure a virtual network endpoint

You can configure your Elastic SAN volume groups to allow access only from endpoints on specific virtual network subnets. The allowed subnets can belong to virtual networks in the same subscription, or those in a different subscription, including a subscription belonging to a different Microsoft Entra tenant.

You can allow access to your Elastic SAN volume group from two types of Azure virtual network endpoints:

- [Private endpoints](../../private-link/private-endpoint-overview.md)
- [Storage service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md)

A private endpoint uses one or more private IP addresses from your virtual network subnet to access an Elastic SAN volume group over the Microsoft backbone network. With a private endpoint, traffic between your virtual network and the volume group are secured over a private link.

Virtual network service endpoints are public and accessible via the internet. You can [Configure virtual network rules](#configure-virtual-network-rules) to control access to your volume group when using storage service endpoints. 

Network rules only apply to the public endpoints of a volume group, not private endpoints. The process of approving the creation of a private endpoint grants implicit access to traffic from the subnet that hosts the private endpoint. You can use [Network Policies](../../private-link/disable-private-endpoint-network-policy.md) to control traffic over private endpoints if you want to refine access rules. If you want to use private endpoints exclusively, don't enable service endpoints for the volume group.

To decide which type of endpoint works best for you, see [Compare Private Endpoints and Service Endpoints](../../virtual-network/vnet-integration-for-azure-services.md#compare-private-endpoints-and-service-endpoints).

Once network access is configured for a volume group, the configuration is inherited by all volumes belonging to the group.

The process for enabling each type of endpoint follows:

- [Configure a private endpoint](#configure-a-private-endpoint)
- [Configure an Azure Storage service endpoint](#configure-an-azure-storage-service-endpoint)

## Next steps

- [Connect Azure Elastic SAN volumes to an Azure Kubernetes Service cluster](elastic-san-connect-aks.md)
- [Connect to Elastic SAN volumes - Linux](elastic-san-connect-linux.md)
- [Connect to Elastic SAN volumes - Windows](elastic-san-connect-windows.md)
