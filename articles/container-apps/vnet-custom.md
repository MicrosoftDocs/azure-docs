---
title: Integrate a virtual network with an Azure Container Apps environment
description: Learn how to integrate a virtual network with an Azure Container Apps environment.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.topic:  how-to
ms.date: 02/03/2025
ms.author: cshoe
zone_pivot_groups: azure-cli-or-portal
---

# Provide a virtual network to an Azure Container Apps environment

The following example shows you how to create a Container Apps environment in an existing virtual network (VNet).

::: zone pivot="azure-portal"

<!-- Create -->
[!INCLUDE [container-apps-create-portal-steps.md](../../includes/container-apps-create-portal-steps.md)]

You also have the option of deploying a private DNS for your Container Apps environment. For more information see [Create and configure an Azure Private DNS zone](waf-app-gateway.md#create-and-configure-an-azure-private-dns-zone).

#### Create a virtual network

> [!NOTE]
> To use a VNet with Container Apps, the VNet must have a dedicated subnet with a CIDR range of `/23` or larger when using the Consumption only environemnt, or a CIDR range of `/27` or larger when using the workload profiles environment. To learn more about subnet sizing, see the [networking architecture overview](./networking.md#subnet).

1. Select the **Networking** tab.
1. Select **Yes** next to *Use your own virtual network*.
1. Next to the *Virtual network* box, select the **Create new** link and enter the following value.

    | Setting | Value |
    |--|--|
    | Name | Enter **my-custom-vnet**. |

1. Select the **OK** button.
1. Next to the *Infrastructure subnet* box, select the **Create new** link and enter the following values:

    | Setting | Value |
    |---|---|
    | Subnet Name | Enter **infrastructure-subnet**. |
    | Virtual Network Address Block | Keep the default values. |
    | Subnet Address Block | Keep the default values. |

1. Select the **OK** button.
1. Under *Virtual IP*, select **External** for an external environment, or **Internal** for an internal environment.
1. Select **Create**.

<!-- Deploy -->
[!INCLUDE [container-apps-create-portal-deploy.md](../../includes/container-apps-create-portal-deploy.md)]

::: zone-end

::: zone pivot="azure-cli"

## Prerequisites

- Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli) version 2.28.0 or higher.

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

[!INCLUDE [container-apps-set-environment-variables.md](../../includes/container-apps-set-environment-variables.md)]

[!INCLUDE [container-apps-create-resource-group.md](../../includes/container-apps-create-resource-group.md)]

## Create an environment

An environment in Azure Container Apps creates a secure boundary around a group of container apps. Container Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

Register the `Microsoft.ContainerService` provider.

# [Bash](#tab/bash)

```azurecli
az provider register --namespace Microsoft.ContainerService
```

# [PowerShell](#tab/powershell)

```azurepowershell
Register-AzResourceProvider -ProviderNamespace Microsoft.ContainerService
```

---

Declare a variable to hold the VNet name.

# [Bash](#tab/bash)

```azurecli
VNET_NAME="my-custom-vnet"
```

# [PowerShell](#tab/powershell)

```azurepowershell
$VnetName = 'my-custom-vnet'
```

---

Now create a virtual network to associate with the Container Apps environment. The virtual network must have a subnet available for the environment deployment.

# [Bash](#tab/bash)

```azurecli
az network vnet create \
  --resource-group $RESOURCE_GROUP \
  --name $VNET_NAME \
  --location $LOCATION \
  --address-prefix 10.0.0.0/16
```

```azurecli
az network vnet subnet create \
  --resource-group $RESOURCE_GROUP \
  --vnet-name $VNET_NAME \
  --name infrastructure-subnet \
  --address-prefixes 10.0.0.0/23
```

# [PowerShell](#tab/powershell)

```azurepowershell
$SubnetArgs = @{
    Name = 'infrastructure-subnet'
    AddressPrefix = '10.0.0.0/23'
}
$subnet = New-AzVirtualNetworkSubnetConfig @SubnetArgs
```

```azurepowershell
$VnetArgs = @{
    Name = $VnetName
    Location = $Location
    ResourceGroupName = $ResourceGroupName
    AddressPrefix = '10.0.0.0/16'
    Subnet = $subnet
}
$vnet = New-AzVirtualNetwork @VnetArgs
```

---

When using the Workload profiles environment, you need to update the VNet to delegate the subnet to `Microsoft.App/environments`. Do not delegate the subnet when using the Consumption-only environment.

# [Bash](#tab/bash)

```azurecli
az network vnet subnet update \
  --resource-group $RESOURCE_GROUP \
  --vnet-name $VNET_NAME \
  --name infrastructure-subnet \
  --delegations Microsoft.App/environments
```

# [PowerShell](#tab/powershell)

```azurepowershell
$delegation = New-AzDelegation -Name 'containerApp' -ServiceName 'Microsoft.App/environments'
$vnet = Set-AzVirtualNetworkSubnetConfig -Name $SubnetArgs.Name -VirtualNetwork $vnet -AddressPrefix $SubnetArgs.AddressPrefix -Delegation $delegation
$vnet | Set-AzVirtualNetwork
```

---

With the virtual network created, you can now query for the infrastructure subnet ID.

# [Bash](#tab/bash)

```azurecli
INFRASTRUCTURE_SUBNET=`az network vnet subnet show --resource-group ${RESOURCE_GROUP} --vnet-name $VNET_NAME --name infrastructure-subnet --query "id" -o tsv | tr -d '[:space:]'`
```

# [PowerShell](#tab/powershell)

```azurepowershell
$InfrastructureSubnet=(Get-AzVirtualNetworkSubnetConfig -Name $SubnetArgs.Name -VirtualNetwork $vnet).Id
```

---

Finally, create the Container Apps environment using the custom VNet.

# [Bash](#tab/bash)

To create the environment, run the following command. To create an internal environment, add `--internal-only`.

```azurecli
az containerapp env create \
  --name $CONTAINERAPPS_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION" \
  --infrastructure-subnet-resource-id $INFRASTRUCTURE_SUBNET
```

The following table describes the parameters used with `containerapp env create`.

| Parameter | Description |
|---|---|
| `name` | Name of the Container Apps environment. |
| `resource-group` | Name of the resource group. |
| `logs-workspace-id` | (Optional) The ID of an existing Log Analytics workspace.  If omitted, a workspace is created for you. |
| `logs-workspace-key` | The Log Analytics client secret. Required if using an existing workspace. |
| `location` | The Azure location where the environment is to deploy. |
| `infrastructure-subnet-resource-id` | Resource ID of a subnet for infrastructure components and user application containers. |
| `internal-only` | (Optional) The environment doesn't use a public static IP, only internal IP addresses available in the custom VNet. (Requires an infrastructure subnet resource ID.) |

# [PowerShell](#tab/powershell)

A Log Analytics workspace is required for the Container Apps environment. The following commands create a Log Analytics workspace and save the workspace ID and primary shared key to environment variables.

```azurepowershell
$WorkspaceArgs = @{
    Name = 'myworkspace'
    ResourceGroupName = $ResourceGroupName
    Location = $Location
    PublicNetworkAccessForIngestion = 'Enabled'
    PublicNetworkAccessForQuery = 'Enabled'
}
New-AzOperationalInsightsWorkspace @WorkspaceArgs
$WorkspaceId = (Get-AzOperationalInsightsWorkspace -ResourceGroupName $ResourceGroupName -Name $WorkspaceArgs.Name).CustomerId
$WorkspaceSharedKey = (Get-AzOperationalInsightsWorkspaceSharedKey -ResourceGroupName $ResourceGroupName -Name $WorkspaceArgs.Name).PrimarySharedKey
```

To create the environment, run the following command. Replace `<INTERNAL>` with `$true` or `$false` depending on whether you want an internal environment.

```azurepowershell
$EnvArgs = @{
    EnvName = $ContainerAppsEnvironment
    ResourceGroupName = $ResourceGroupName
    Location = $Location
    AppLogConfigurationDestination = "log-analytics"
    LogAnalyticConfigurationCustomerId = $WorkspaceId
    LogAnalyticConfigurationSharedKey = $WorkspaceSharedKey
    VnetConfigurationInfrastructureSubnetId = $InfrastructureSubnet
    VnetConfigurationInternal = <INTERNAL>
}
New-AzContainerAppManagedEnv @EnvArgs
```

The following table describes the parameters used in for `New-AzContainerAppManagedEnv`.

| Parameter | Description |
|---|---|
| `EnvName` | Name of the Container Apps environment. |
| `ResourceGroupName` | Name of the resource group. |
| `LogAnalyticConfigurationCustomerId` | The ID of an existing Log Analytics workspace. |
| `LogAnalyticConfigurationSharedKey` | The Log Analytics client secret.|
| `Location` | The Azure location where the environment is to deploy. |
| `VnetConfigurationInfrastructureSubnetId` | Resource ID of a subnet for infrastructure components and user application containers. |
| `VnetConfigurationInternal` | (Optional) If `$true`, the environment doesn't use a public static IP, only internal IP addresses available in the custom VNet. (Requires an infrastructure subnet resource ID.) |

---

### Optional configuration

You have the option of deploying a private DNS and defining custom networking IP ranges for your Container Apps environment.

#### Deploy with a private DNS

If you want to deploy your container app with a private DNS, run the following commands.

First, extract identifiable information from the environment.

# [Bash](#tab/bash)

```azurecli
ENVIRONMENT_DEFAULT_DOMAIN=`az containerapp env show --name ${CONTAINERAPPS_ENVIRONMENT} --resource-group ${RESOURCE_GROUP} --query properties.defaultDomain --out json | tr -d '"'`
```

```azurecli
ENVIRONMENT_STATIC_IP=`az containerapp env show --name ${CONTAINERAPPS_ENVIRONMENT} --resource-group ${RESOURCE_GROUP} --query properties.staticIp --out json | tr -d '"'`
```

```azurecli
VNET_ID=`az network vnet show --resource-group ${RESOURCE_GROUP} --name ${VNET_NAME} --query id --out json | tr -d '"'`
```

# [PowerShell](#tab/powershell)

```azurepowershell
$EnvironmentDefaultDomain = (Get-AzContainerAppManagedEnv -EnvName $ContainerAppsEnvironment -ResourceGroupName $ResourceGroupName).DefaultDomain
```

```azurepowershell
$EnvironmentStaticIp = (Get-AzContainerAppManagedEnv -EnvName $ContainerAppsEnvironment -ResourceGroupName $ResourceGroupName).StaticIp
```

---

Next, set up the private DNS.

# [Bash](#tab/bash)

```azurecli
az network private-dns zone create \
  --resource-group $RESOURCE_GROUP \
  --name $ENVIRONMENT_DEFAULT_DOMAIN
```

```azurecli
az network private-dns link vnet create \
  --resource-group $RESOURCE_GROUP \
  --name $VNET_NAME \
  --virtual-network $VNET_ID \
  --zone-name $ENVIRONMENT_DEFAULT_DOMAIN -e true
```

```azurecli
az network private-dns record-set a add-record \
  --resource-group $RESOURCE_GROUP \
  --record-set-name "*" \
  --ipv4-address $ENVIRONMENT_STATIC_IP \
  --zone-name $ENVIRONMENT_DEFAULT_DOMAIN
```

# [PowerShell](#tab/powershell)

```azurepowershell
New-AzPrivateDnsZone -ResourceGroupName $ResourceGroupName -Name $EnvironmentDefaultDomain
```

```azurepowershell
New-AzPrivateDnsVirtualNetworkLink -ResourceGroupName $ResourceGroupName -Name $VnetName -VirtualNetwork $Vnet -ZoneName $EnvironmentDefaultDomain -EnableRegistration
```

```azurepowershell
$DnsRecords = @()
$DnsRecords += New-AzPrivateDnsRecordConfig -Ipv4Address $EnvironmentStaticIp

$DnsRecordArgs = @{
    ResourceGroupName = $ResourceGroupName
    ZoneName = $EnvironmentDefaultDomain
    Name = '*'
    RecordType = 'A'
    Ttl = 3600
    PrivateDnsRecords = $DnsRecords
}
New-AzPrivateDnsRecordSet @DnsRecordArgs
```

---

#### Networking parameters

When using the Consumption-only environment, there are three optional networking parameters you can choose to define when calling `containerapp env create`. Use these options when you have a peered VNet with separate address ranges. Explicitly configuring these ranges ensures the addresses used by the Container Apps environment don't conflict with other ranges in the network infrastructure.

You must either provide values for all three of these properties, or none of them. If they aren’t provided, the values are generated for you.

# [Bash](#tab/bash)

| Parameter | Description |
|---|---|
| `platform-reserved-cidr` | The address range used internally for environment infrastructure services. Must have a size between `/23` and `/12` when using the [Consumption only environment](./networking.md)|
| `platform-reserved-dns-ip` | An IP address from the `platform-reserved-cidr` range that is used for the internal DNS server. The address can't be the first address in the range, or the network address. For example, if `platform-reserved-cidr` is set to `10.2.0.0/16`, then `platform-reserved-dns-ip` can't be `10.2.0.0` (the network address), or `10.2.0.1` (infrastructure reserves use of this IP). In this case, the first usable IP for the DNS would be `10.2.0.2`. |
| `docker-bridge-cidr` | The address range assigned to the Docker bridge network. This range must have a size between `/28` and `/12`. |

- The `platform-reserved-cidr` and `docker-bridge-cidr` address ranges can't conflict with each other, or with the ranges of either provided subnet. Further, make sure these ranges don't conflict with any other address range in the VNet.

- If these properties aren’t provided, the CLI autogenerates the range values based on the address range of the VNet to avoid range conflicts.

# [PowerShell](#tab/powershell)

| Parameter | Description |
|---|---|
| `VnetConfigurationPlatformReservedCidr` | The address range used internally for environment infrastructure services. Must have a size between `/23` and `/12` when using the [Consumption only environment](./networking.md) |
| `VnetConfigurationPlatformReservedDnsIP` | An IP address from the `VnetConfigurationPlatformReservedCidr` range that is used for the internal DNS server. The address can't be the first address in the range, or the network address. For example, if `VnetConfigurationPlatformReservedCidr` is set to `10.2.0.0/16`, then `VnetConfigurationPlatformReservedDnsIP` can't be `10.2.0.0` (the network address), or `10.2.0.1` (infrastructure reserves use of this IP). In this case, the first usable IP for the DNS would be `10.2.0.2`. |
| `VnetConfigurationDockerBridgeCidr` | The address range assigned to the Docker bridge network. This range must have a size between `/28` and `/12`. |

- The `VnetConfigurationPlatformReservedCidr` and `VnetConfigurationDockerBridgeCidr` address ranges can't conflict with each other, or with the ranges of either provided subnet. Further, make sure these ranges don't conflict with any other address range in the VNet.

- If these properties aren’t provided, the range values are autogenerated based on the address range of the VNet to avoid range conflicts.

---

::: zone-end

## Clean up resources

If you're not going to continue to use this application, you can delete the **my-container-apps** resource group. This deletes the Azure Container Apps instance and all associated services. It also deletes the resource group that the Container Apps service automatically created and which contains the custom network components.

::: zone pivot="azure-cli"

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this guide exist in the specified resource group, they will also be deleted.

# [Bash](#tab/bash)

```azurecli
az group delete --name $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```azurepowershell
Remove-AzResourceGroup -Name $ResourceGroupName -Force
```

---

::: zone-end

## Additional resources

- To use VNet-scope ingress, you must set up [DNS](./networking.md#dns).

## Next steps

> [!div class="nextstepaction"]
> [Managing autoscaling behavior](scale-app.md)
