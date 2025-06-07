---
title: Configure Private Endpoints for Azure Elastic SAN
description: Learn how to configure Private Endpoint connections to Azure Elastic SAN volumes.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 01/24/2025
ms.author: rogarana
ms.custom: references_regions, devx-track-azurecli, devx-track-azurepowershell
---

# Configure Private Endpoints for Azure Elastic SAN

This article covers configuring your Elastic SAN volume group to use Private Endpoints.

## Prerequisites

- If you're using Azure PowerShell, install the [latest Azure PowerShell module](/powershell/azure/install-azure-powershell)
- If you're using Azure CLI, install the [latest version](/cli/azure/install-azure-cli)
- Once you've installed the latest version, run `az extension add -n elastic-san` to install the extension for Elastic SAN

## Access via Private Endpoint 

A private endpoint allows you to connect to your Elastic SAN volume group over a private IP address within your virtual network. When you use a private endpoint, traffic between your virtual network and the Elastic SAN remains entirely on Azure’s private backbone, without traversing the public internet. This setup provides strong network isolation and is typically recommended for production or security-sensitive workloads. 

Once a private endpoint is configured and approved, access is granted automatically to the subnet where it resides. If you're using Elastic SAN as a datastore for Azure VMware Solution, a private endpoint is required. 

### Configure a private endpoint

There are two steps involved in configuring a private endpoint connection:

> [!div class="checklist"]
> - Creating the endpoint and the associated connection.
> - Approving the connection.

You must have the [Elastic SAN Volume Group Owner](../../role-based-access-control/built-in-roles.md#elastic-san-volume-group-owner) role to create a private endpoint for an Elastic SAN volume group. To approve a new private endpoint connection, you must have permission to the [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftelasticsan) `Microsoft.ElasticSan/elasticSans/PrivateEndpointConnectionsApproval/action`. Permission for this operation is included in the [Elastic SAN Network Admin](../../role-based-access-control/built-in-roles.md#elastic-san-owner) role, but it can also be granted via a custom Azure role.

If you create the endpoint from a user account that has all of the necessary roles and permissions required for creation and approval, then you can do this in one step. Otherwise, it'll require two separate steps by two different users.

When setting up Private Links, your Elastic SAN and the virtual network could be in different resource groups, regions, and subscriptions, including subscriptions that belong to different Microsoft Entra tenants. In these examples, we're creating the private endpoint in the same resource group as the virtual network.

### [Portal](#tab/azure-portal)

You can create a private endpoint connection to your volume group in the Azure portal either when you create a volume group or when modifying an existing volume group. You need an existing virtual network to create a private endpoint.

When creating or modifying a volume group, select **Networking**, then select **+ Create a private endpoint** under **Private endpoint connections**.

Fill out the values in the menu that pops up, select the virtual network and the subnet that your applications will use to connect. When you're done, select **Add**, and **Save**. 

:::image type="content" source="media/elastic-san-create/elastic-san-private-endpoint.png" alt-text="Screenshot of the volume group private endpoint creation experience." lightbox="media/elastic-san-create/elastic-san-private-endpoint.png":::

### [PowerShell](#tab/azure-powershell)

The following script creates a Private Endpoint for your Elastic SAN volume group. Replace the values of `RgName`, `VnetName`, `SubnetName`, `EsanName`, `EsanVgName`, `PLSvcConnectionName`, `EndpointName`, and `Location`(Region) with your own values, and uncomment `-ByManualRequest` if you're following the two step process, then run the script.

Afterwards, if you don't have all necessary permissions and need the network admin to approve the connection, make sure to also run the script in [Approve connection](#approve-connection).

```powershell
# Set the resource group name.
$RgName     = "<ResourceGroupName>"

# Set the virtual network and subnet, which is used when creating the private endpoint.
$VnetName   = "<VnetName>"
$SubnetName = "<SubnetName>"

$Vnet = Get-AzVirtualNetwork -Name $VnetName -ResourceGroupName $RgName
$Subnet = $Vnet | Select -ExpandProperty subnets | Where-Object {$_.Name -eq $SubnetName}

# Set the Elastic SAN, which is used when creating the private endpoint service connection.
$EsanName   = "<ElasticSanName>"
$EsanVgName = "<ElasticSanVolumeGroupName>"

$Esan = Get-AzElasticSan -Name $EsanName -ResourceGroupName $RgName

# Create the private link service connection, which is input to creating the private endpoint.
$PLSvcConnectionName = "<PrivateLinkSvcConnectionName>"
$EsanPlSvcConn = New-AzPrivateLinkServiceConnection -Name $PLSvcConnectionName -PrivateLinkServiceId $Esan.Id -GroupId $EsanVgName

# Create the private endpoint.
$EndpointName       = '<PrivateEndpointName>'
$Location           = '<Location>'
$PeArguments        = @{
    Name                         = $EndpointName
    ResourceGroupName            = $RgName
    Location                     = $Location
    Subnet                       = $Subnet
    PrivateLinkServiceConnection = $EsanPlSvcConn
}
New-AzPrivateEndpoint @PeArguments # -ByManualRequest # (Uncomment the `-ByManualRequest` parameter if you are using the two-step process).
```

#### Approve connection

Use this sample code to approve the private link service connection if you're using the two-step process. Use the same variables from the previous code sample:

```powershell
# Get the private endpoint and associated connection.
$PrivateEndpoint = Get-AzPrivateEndpoint -Name $EndpointName -ResourceGroupName $RgName
$PeConnArguments  = @{
    ServiceName                  = $EsanName
    ResourceGroupName            = $RgName
    PrivateLinkResourceType      = "Microsoft.ElasticSan/elasticSans"
}
$EndpointConnection = Get-AzPrivateEndpointConnection @PeConnArguments | 
Where-Object {($_.PrivateEndpoint.Id -eq $PrivateEndpoint.Id)}

# Approve the private link service connection.
$ApprovalDesc="<ApprovalDesc>"
Approve-AzPrivateEndpointConnection @PeConnArguments -Name $EndpointConnection.Name -Description $ApprovalDesc

# Get the private endpoint connection anew and verify the connection status.
$EndpointConnection = Get-AzPrivateEndpointConnection @PeConnArguments | 
Where-Object {($_.PrivateEndpoint.Id -eq $PrivateEndpoint.Id)}
$EndpointConnection.PrivateLinkServiceConnectionState
```

### [Azure CLI](#tab/azure-cli)

The following script creates a Private Endpoint for your Elastic SAN volume group. Uncomment the `--manual-request` parameter if you're using the two-step process. Replace all example variable values with your own, then run the script.

Afterwards, if you don't have all necessary permissions and need the network admin to approve the connection, make sure to also run the script in [Approve connection](#approve-connection-1).

```azurecli
# Define some variables.
# The name of the resource group where the resources are deployed.
RgName="<ResourceGroupName>"
# The name of the subnet from which access to the volume group will be configured.
VnetName="<VnetName>"
# The name of the virtual network that includes the subnet.
SubnetName="<SubnetName>"
# The name of the Elastic SAN that the volume group belongs to.
EsanName="<ElasticSanName>"
# The name of the Elastic SAN Volume Group to which a connection is to be created.
EsanVgName="<ElasticSanVolumeGroupName>"
# The name of the new private endpoint
EndpointName="<PrivateEndpointName>"
# The name of the new private link service connection to the volume group.
PLSvcConnectionName="<PrivateLinkSvcConnectionName>"
# The region where the new private endpoint will be created.
Location="<Location>"
# The description provided for the approval of the private endpoint connection.
ApprovalDesc="<ApprovalDesc>"

# Get the id of the Elastic SAN.
id=$(az elastic-san show \
    --elastic-san-name $EsanName \
    --resource-group $RgName \
    --query 'id' \
    --output tsv)

# Create the private endpoint.
az network private-endpoint create \
    --connection-name $PLSvcConnectionName \
    --name $EndpointName \
    --private-connection-resource-id $id \
    --resource-group $RgName \
    --vnet-name $VnetName \
    --subnet $SubnetName \
    --location $Location \
    --group-id $EsanVgName # --manual-request

# Verify the status of the private endpoint connection.
PLConnectionName=$(az network private-endpoint-connection list \
    --name $EsanName \
    --resource-group $RgName \
    --type Microsoft.ElasticSan/elasticSans \
    --query "[?properties.groupIds[0]=='$EsanVgName'].name" -o tsv)

az network private-endpoint-connection show  \
    --resource-name $EsanName \
    --resource-group $RgName \
    --type Microsoft.ElasticSan/elasticSans \
    --name $PLConnectionName
```

#### Approve connection

Use this sample code to approve the private link service connection if you're using the two-step process. Use the same variables from the previous code sample:

```azurecli
az network private-endpoint-connection approve \
    --resource-name $EsanName \
    --resource-group $RgName \
    --name $PLConnectionName \
    --type Microsoft.ElasticSan/elasticSans \
    --description $ApprovalDesc
```

---

> [!NOTE]
> If your Elastic SAN and the private endpoint are in different subscriptions, register the Microsoft.ElasticSan resource provider in the subscription that contains the private endpoint. 
> Follow the steps in this [article](/azure/private-link/how-to-approve-private-link-cross-subscription) to approve and register private endpoints. 


## Configure iSCSI error detection

Now that your Private Endpoints have been configured, you can configure iSCSI error detection.

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



## Configure client connections

After you have enabled the desired endpoints and granted access in your network rules, you're ready to configure your clients to connect to the appropriate Elastic SAN volumes.

If a connection between a virtual machine (VM) and an Elastic SAN volume is lost, the connection will retry for 90 seconds until terminating. Losing a connection to an Elastic SAN volume won't cause the VM to restart.

## Next steps

- [Connect Azure Elastic SAN volumes to an Azure Kubernetes Service cluster](elastic-san-connect-aks.md)
- [Connect to Elastic SAN volumes - Linux](elastic-san-connect-linux.md)
- [Connect to Elastic SAN volumes - Windows](elastic-san-connect-windows.md)