---
title: Reliability in Azure Container Apps
description: Learn how to ensure application reliability in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.author: cshoe
ms.service: container-apps
ms.custom: subject-reliability, references_regions, devx-track-azurepowershell
ms.topic: reliability-article
ms.date: 08/29/2023
---

# Reliability in Azure Container Apps

This article describes reliability support in Azure Container Apps, and covers both regional resiliency with availability zones and cross-region resiliency with disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/well-architected/resiliency/).

## Availability zone support

[!INCLUDE [next step](includes/reliability-availability-zone-description-include.md)]

Azure Container Apps uses [availability zones](availability-zones-overview.md#zonal-and-zone-redundant-services) in regions where they're available to provide high-availability protection for your applications and data from data center failures.

By enabling Container Apps' zone redundancy feature, replicas are automatically distributed across the zones in the region.  Traffic is load balanced among the replicas.  If a zone outage occurs, traffic is automatically routed to the replicas in the remaining zones.

> [!NOTE]
> There is no extra charge for enabling zone redundancy, but it only provides benefits when you have 2 or more replicas, with 3 or more being ideal since most regions that support zone redundancy have 3 zones.

### Prerequisites

Azure Container Apps offers the same reliability support regardless of your plan type.

Azure Container Apps uses [availability zones](availability-zones-overview.md#zonal-and-zone-redundant-services) in regions where they're available. For a list of regions that support availability zones, see [Availability zone service and regional support](availability-zones-service-support.md).

### SLA improvements

There are no increased SLAs for Azure Container Apps. For more information on the Azure Container Apps SLAs, see [Service Level Agreement for Azure Container Apps](https://azure.microsoft.com/support/legal/sla/container-apps/).

### Create a resource with availability zone enabled

#### Set up zone redundancy in your Container Apps environment

To take advantage of availability zones, you must enable zone redundancy when you create a Container Apps environment.  The environment must include a virtual network with an available subnet. To ensure proper distribution of replicas, set your app's minimum replica count to three.

##### Enable zone redundancy via the Azure portal

To create a container app in an environment with zone redundancy enabled using the Azure portal:

1. Navigate to the Azure portal.
1. Search for **Container Apps** in the top search box.
1. Select **Container Apps**.
1. Select **Create New** in the *Container Apps Environment* field to open the *Create Container Apps Environment* panel.
1. Enter the environment name.
1. Select **Enabled** for the *Zone redundancy* field.

Zone redundancy requires a virtual network with an infrastructure subnet.  You can choose an existing virtual network or create a new one.  When creating a new virtual network, you can accept the values provided for you or customize the settings.

1. Select the **Networking** tab.  
1. To assign a custom virtual network name, select **Create New** in the *Virtual Network* field.
1. To assign a custom infrastructure subnet name, select **Create New** in the *Infrastructure subnet* field.
1. You can select **Internal** or **External** for the *Virtual IP*.
1. Select **Create**.

:::image type="content" source="../container-apps/media/screen-shot-vnet-configuration.png" alt-text="Screenshot of Networking tab in Create Container Apps Environment page.":::

##### Enable zone redundancy with the Azure CLI

Create a virtual network and infrastructure subnet to include with the Container Apps environment.

When using these commands, replace the `<PLACEHOLDERS>` with your values.

>[!NOTE]
> The Consumption only environment requires a dedicated subnet with a CIDR range of `/23` or larger. The workload profiles environment requires a dedicated subnet with a CIDR range of `/27` or larger. To learn more about subnet sizing, see the [networking architecture overview](../container-apps/networking.md#subnet).

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az network vnet create \
  --resource-group <RESOURCE_GROUP_NAME> \
  --name <VNET_NAME> \
  --location <LOCATION> \
  --address-prefix 10.0.0.0/16
```

```azurecli-interactive
az network vnet subnet create \
  --resource-group <RESOURCE_GROUP_NAME> \
  --vnet-name <VNET_NAME> \
  --name infrastructure \
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
    Name = <VNetName>
    Location = <Location>
    ResourceGroupName = <ResourceGroupName>
    AddressPrefix = '10.0.0.0/16'
    Subnet = $subnet 
}
$vnet = New-AzVirtualNetwork @VnetArgs
```

---

Next, query for the infrastructure subnet ID.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
INFRASTRUCTURE_SUBNET=`az network vnet subnet show --resource-group <RESOURCE_GROUP_NAME> --vnet-name <VNET_NAME> --name infrastructure --query "id" -o tsv | tr -d '[:space:]'`
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$InfrastructureSubnet=(Get-AzVirtualNetworkSubnetConfig -Name $SubnetArgs.Name -VirtualNetwork $vnet).Id
```

---

Finally, create the environment with the `--zone-redundant` parameter.  The location must be the same location used when creating the virtual network.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az containerapp env create \
  --name <CONTAINER_APP_ENV_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --location "<LOCATION>" \
  --infrastructure-subnet-resource-id $INFRASTRUCTURE_SUBNET \
  --zone-redundant
```

# [Azure PowerShell](#tab/azure-powershell)

A Log Analytics workspace is required for the Container Apps environment.  The following commands create a Log Analytics workspace and save the workspace ID and primary shared key to environment variables.

```azurepowershell-interactive
$WorkspaceArgs = @{
    Name = 'myworkspace'
    ResourceGroupName = <ResourceGroupName>
    Location = <Location>
    PublicNetworkAccessForIngestion = 'Enabled'
    PublicNetworkAccessForQuery = 'Enabled'
}
New-AzOperationalInsightsWorkspace @WorkspaceArgs
$WorkspaceId = (Get-AzOperationalInsightsWorkspace -ResourceGroupName <ResourceGroupName> -Name $WorkspaceArgs.Name).CustomerId
$WorkspaceSharedKey = (Get-AzOperationalInsightsWorkspaceSharedKey -ResourceGroupName <ResourceGroupName> -Name $WorkspaceArgs.Name).PrimarySharedKey
```

To create the environment, run the following command:

```azurepowershell-interactive
$EnvArgs = @{
    EnvName = <EnvironmentName>
    ResourceGroupName = <ResourceGroupName>
    Location = <Location>
    AppLogConfigurationDestination = "log-analytics"
    LogAnalyticConfigurationCustomerId = $WorkspaceId
    LogAnalyticConfigurationSharedKey = $WorkspaceSharedKey
    VnetConfigurationInfrastructureSubnetId = $InfrastructureSubnet
    VnetConfigurationInternal = $true
}
New-AzContainerAppManagedEnv @EnvArgs
```

---

### Safe deployment techniques

When you set up [zone redundancy in your container app](#set-up-zone-redundancy-in-your-container-apps-environment), replicas are distributed automatically across the zones in the region. After the replicas are distributed, traffic is load balanced among them. If a zone outage occurs, traffic automatically routes to the replicas in the remaining zone.

You should still use safe deployment techniques such as [blue-green deployment](../container-apps/blue-green-deployment.md). Azure Container Apps doesn't provide one-zone-at-a-time deployment or upgrades.

If you have enabled [session affinity](../container-apps/sticky-sessions.md), and a zone goes down, clients for that zone are routed to new replicas because the previous replicas are no longer available. Any state associated with the previous replicas is lost.

### Availability zone redeployment and migration

To take advantage of availability zones, enable zone redundancy as you create the Container Apps environment. The environment must include a virtual network with an available subnet. You can't migrate an existing Container Apps environment from nonavailability zone support to availability zone support.

## Disaster recovery: cross-region failover

In the unlikely event of a full region outage, you have the option of using one of two strategies:

- **Manual recovery**: Manually deploy to a new region, or wait for the region to recover, and then manually redeploy all environments and apps.

- **Resilient recovery**: First, deploy your container apps in advance to multiple regions. Next, use Azure Front Door or Azure Traffic Manager to handle incoming requests, pointing traffic to your primary region. Then, should an outage occur, you can redirect traffic away from the affected region. For more information, see [Cross-region replication in Azure](cross-region-replication-azure.md).

> [!NOTE]
> Regardless of which strategy you choose, make sure your deployment configuration files are in source control so you can easily redeploy if necessary.

## More guidance

The following resources can help you create your own disaster recovery plan:

- [Failure and disaster recovery for Azure applications](/azure/architecture/reliability/disaster-recovery)
- [Azure resiliency technical guidance](/azure/architecture/checklist/resiliency-per-service)

## Next steps

> [!div class="nextstepaction"]
> [Reliability in Azure](availability-zones-overview.md)
