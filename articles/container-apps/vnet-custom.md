---
title: Integrate a virtual network with an external Azure Container Apps environment
description: Learn how to integrate a VNET with an external Azure Container Apps environment.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: event-tier1-build-2022, devx-track-azurepowershell, devx-track-azurecli, devx-track-linux
ms.topic:  how-to
ms.date: 08/31/2022
ms.author: cshoe
zone_pivot_groups: azure-cli-or-portal
---

# Provide a virtual network to an external Azure Container Apps environment

The following example shows you how to create a Container Apps environment in an existing virtual network.

::: zone pivot="azure-portal"

<!-- Create -->
[!INCLUDE [container-apps-create-portal-steps.md](../../includes/container-apps-create-portal-steps.md)]

> [!NOTE]
> You can use an existing virtual network, but a dedicated subnet with a CIDR range of `/23` or larger is required for use with Container Apps when using the Consumption only Architecture. When using a workload profiles environment, a `/27` or larger is required. To learn more about subnet sizing, see the [networking architecture overview](./networking.md#subnet).

7. Select the **Networking** tab to create a VNET.
8. Select **Yes** next to *Use your own virtual network*.
9. Next to the *Virtual network* box, select the **Create new** link and enter the following value.

    | Setting | Value |
    |--|--|
    | Name | Enter **my-custom-vnet**. |

10. Select the **OK** button.
11. Next to the *Infrastructure subnet* box, select the **Create new** link and enter the following values:

    | Setting | Value |
    |---|---|
    | Subnet Name | Enter **infrastructure-subnet**. |
    | Virtual Network Address Block | Keep the default values. |
    | Subnet Address Block | Keep the default values. |

12. Select the **OK** button.
13. Under *Virtual IP*, select **External**.
14. Select **Create**.

<!-- Deploy -->
[!INCLUDE [container-apps-create-portal-deploy.md](../../includes/container-apps-create-portal-deploy.md)]

::: zone-end

::: zone pivot="azure-cli"

## Prerequisites

- Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli) version 2.28.0 or higher.

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

Register the `Microsoft.ContainerService` provider.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.ContainerService
```

---

Declare a variable to hold the VNET name.

# [Azure CLI](#tab/azure-cli)

```bash
VNET_NAME="my-custom-vnet"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$VnetName = 'my-custom-vnet'
```

---

Now create an Azure virtual network to associate with the Container Apps environment. The virtual network must have a subnet available for the environment deployment.

> [!NOTE]
> Network subnet address prefix requires a minimum CIDR range of `/23` for use with Container Apps when using the Consumption only Architecture. When using the Workload Profiles Architecture, a `/27` or larger is required. To learn more about subnet sizing, see the [networking architecture overview](./networking.md#subnet).

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az network vnet create \
  --resource-group $RESOURCE_GROUP \
  --name $VNET_NAME \
  --location $LOCATION \
  --address-prefix 10.0.0.0/16
```

```azurecli-interactive
az network vnet subnet create \
  --resource-group $RESOURCE_GROUP \
  --vnet-name $VNET_NAME \
  --name infrastructure-subnet \
  --address-prefixes 10.0.0.0/21
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$SubnetArgs = @{
    Name = 'infrastructure-subnet'
    AddressPrefix = '10.0.0.0/21'
}
$subnet = New-AzVirtualNetworkSubnetConfig @SubnetArgs
```

```azurepowershell-interactive
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

With the virtual network created, you can retrieve the ID for the infrastructure subnet.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
INFRASTRUCTURE_SUBNET=`az network vnet subnet show --resource-group ${RESOURCE_GROUP} --vnet-name $VNET_NAME --name infrastructure-subnet --query "id" -o tsv | tr -d '[:space:]'`
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$InfrastructureSubnet=(Get-AzVirtualNetworkSubnetConfig -Name $SubnetArgs.Name -VirtualNetwork $vnet).Id
```

---

Finally, create the Container Apps environment using the custom VNET deployed in the preceding steps.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az containerapp env create \
  --name $CONTAINERAPPS_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION" \
  --infrastructure-subnet-resource-id $INFRASTRUCTURE_SUBNET
```

The following table describes the parameters used in `containerapp env create`.

| Parameter | Description |
|---|---|
| `name` | Name of the Container Apps environment. |
| `resource-group` | Name of the resource group. |
| `location` | The Azure location where the environment is to deploy.  |
| `infrastructure-subnet-resource-id` | Resource ID of a subnet for infrastructure components and user application containers. |


# [Azure PowerShell](#tab/azure-powershell)

A Log Analytics workspace is required for the Container Apps environment.  The following commands create a Log Analytics workspace and save the workspace ID and primary shared key to environment variables.

```azurepowershell-interactive
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

To create the environment, run the following command:

```azurepowershell-interactive
$EnvArgs = @{
    EnvName = $ContainerAppsEnvironment
    ResourceGroupName = $ResourceGroupName
    Location = $Location
    AppLogConfigurationDestination = "log-analytics"
    LogAnalyticConfigurationCustomerId = $WorkspaceId
    LogAnalyticConfigurationSharedKey = $WorkspaceSharedKey
    VnetConfigurationInfrastructureSubnetId = $InfrastructureSubnet
    VnetConfigurationInternal = $true
}
New-AzContainerAppManagedEnv @EnvArgs
```

The following table describes the parameters used in for `New-AzContainerAppManagedEnv`.

| Parameter | Description |
|---|---|
| `EnvName` | Name of the Container Apps environment. |
| `ResourceGroupName` | Name of the resource group. |
| `LogAnalyticConfigurationCustomerId` | The ID of an existing the Log Analytics workspace. |
| `LogAnalyticConfigurationSharedKey` | The Log Analytics client secret.|
| `Location` | The Azure location where the environment is to deploy.  |
| `VnetConfigurationInfrastructureSubnetId` | Resource ID of a subnet for infrastructure components and user application containers. |

---


With your environment created using a custom virtual network, you can now deploy container apps into the environment.

### Optional configuration

You have the option of deploying a private DNS and defining custom networking IP ranges for your Container Apps environment.

#### Deploy with a private DNS

If you want to deploy your container app with a private DNS, run the following commands.

First, extract identifiable information from the environment.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
ENVIRONMENT_DEFAULT_DOMAIN=`az containerapp env show --name ${CONTAINERAPPS_ENVIRONMENT} --resource-group ${RESOURCE_GROUP} --query properties.defaultDomain --out json | tr -d '"'`
```

```azurecli-interactive
ENVIRONMENT_STATIC_IP=`az containerapp env show --name ${CONTAINERAPPS_ENVIRONMENT} --resource-group ${RESOURCE_GROUP} --query properties.staticIp --out json | tr -d '"'`
```

```azurecli-interactive
VNET_ID=`az network vnet show --resource-group ${RESOURCE_GROUP} --name ${VNET_NAME} --query id --out json | tr -d '"'`
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$EnvironmentDefaultDomain = (Get-AzContainerAppManagedEnv -EnvName $ContainerAppsEnvironment -ResourceGroupName $ResourceGroupName).DefaultDomain

```

```azurepowershell-interactive
$EnvironmentStaticIp = (Get-AzContainerAppManagedEnv -EnvName $ContainerAppsEnvironment -ResourceGroupName $ResourceGroupName).StaticIp
```

---

Next, set up the private DNS.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az network private-dns zone create \
  --resource-group $RESOURCE_GROUP \
  --name $ENVIRONMENT_DEFAULT_DOMAIN
```

```azurecli-interactive
az network private-dns link vnet create \
  --resource-group $RESOURCE_GROUP \
  --name $VNET_NAME \
  --virtual-network $VNET_ID \
  --zone-name $ENVIRONMENT_DEFAULT_DOMAIN -e true
```

```azurecli-interactive
az network private-dns record-set a add-record \
  --resource-group $RESOURCE_GROUP \
  --record-set-name "*" \
  --ipv4-address $ENVIRONMENT_STATIC_IP \
  --zone-name $ENVIRONMENT_DEFAULT_DOMAIN
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzPrivateDnsZone -ResourceGroupName $ResourceGroupName -Name $EnvironmentDefaultDomain
```

```azurepowershell-interactive
New-AzPrivateDnsVirtualNetworkLink -ResourceGroupName $ResourceGroupName -Name $VnetName -VirtualNetwork $Vnet -ZoneName $EnvironmentDefaultDomain -EnableRegistration
```

```azurepowershell-interactive
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

There are three optional networking parameters you can choose to define when calling `containerapp env create`. Use these options when you have a peered VNET with separate address ranges. Explicitly configuring these ranges ensures the addresses used by the Container Apps environment don't conflict with other ranges in the network infrastructure.

You must either provide values for all three of these properties, or none of them. If they aren’t provided, the values are generated for you.

# [Azure CLI](#tab/azure-cli)

| Parameter | Description |
|---|---|
| `platform-reserved-cidr` | The address range used internally for environment infrastructure services. Must have a size between `/23` and `/12` when using the [Consumption only architecture](./networking.md)|
| `platform-reserved-dns-ip` | An IP address from the `platform-reserved-cidr` range that is used for the internal DNS server. The address can't be the first address in the range, or the network address. For example, if `platform-reserved-cidr` is set to `10.2.0.0/16`, then `platform-reserved-dns-ip` can't be `10.2.0.0` (the network address), or `10.2.0.1` (infrastructure reserves use of this IP). In this case, the first usable IP for the DNS would be `10.2.0.2`. |
| `docker-bridge-cidr` | The address range assigned to the Docker bridge network. This range must have a size between `/28` and `/12`. |

- The `platform-reserved-cidr` and `docker-bridge-cidr` address ranges can't conflict with each other, or with the ranges of either provided subnet. Further, make sure these ranges don't conflict with any other address range in the VNET.

- If these properties aren’t provided, the CLI autogenerates the range values based on the address range of the VNET to avoid range conflicts.

# [Azure PowerShell](#tab/azure-powershell)

| Parameter | Description |
|---|---|
| `VnetConfigurationPlatformReservedCidr` | The address range used internally for environment infrastructure services. Must have a size between `/23` and `/12` when using the [Consumption only architecture](./networking.md) |
| `VnetConfigurationPlatformReservedDnsIP` | An IP address from the `VnetConfigurationPlatformReservedCidr` range that is used for the internal DNS server. The address can't be the first address in the range, or the network address. For example, if `VnetConfigurationPlatformReservedCidr` is set to `10.2.0.0/16`, then `VnetConfigurationPlatformReservedDnsIP` can't be `10.2.0.0` (the network address), or `10.2.0.1` (infrastructure reserves use of this IP). In this case, the first usable IP for the DNS would be `10.2.0.2`. |
| `VnetConfigurationDockerBridgeCidr` | The address range assigned to the Docker bridge network. This range must have a size between `/28` and `/12`. |

- The `VnetConfigurationPlatformReservedCidr` and `VnetConfigurationDockerBridgeCidr` address ranges can't conflict with each other, or with the ranges of either provided subnet. Further, make sure these ranges don't conflict with any other address range in the VNET.

- If these properties aren’t provided, the range values are autogenerated based on the address range of the VNET to avoid range conflicts.

---

::: zone-end

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Container Apps instance and all the associated services by removing the **my-container-apps** resource group.  Deleting this resource group will also delete the resource group automatically created by the Container Apps service containing the custom network components.

::: zone pivot="azure-cli"

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this guide exist in the specified resource group, they will also be deleted.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group delete --name $RESOURCE_GROUP
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name $ResourceGroupName -Force
```

---

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Managing autoscaling behavior](scale-app.md)
