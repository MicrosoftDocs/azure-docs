---
title: Create an Azure Load Balancer rule for a cluster
description: Configure an Azure Load Balancer to open ports for your Azure Service Fabric cluster.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-azurecli
services: service-fabric
ms.date: 07/11/2022
---

# Open ports for a Service Fabric cluster

The load balancer deployed with your Azure Service Fabric cluster directs traffic to your app running on a node. If you change your app to use a different port, you must expose that port (or route a different port) in the Azure Load Balancer.

When you deployed your Service Fabric cluster to Azure, a load balancer was automatically created for you. If you do not have a load balancer, see [Configure an Internet-facing load balancer](../load-balancer/quickstart-load-balancer-standard-public-portal.md).


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Configure service fabric

Your Service Fabric application **ServiceManifest.xml** config file defines the endpoints your application expects to use. After the config file has been updated to define an endpoint, the load balancer must be updated to expose that (or a different) port. For more information on how to create the service fabric endpoint, see [Setup an Endpoint](service-fabric-service-manifest-resources.md).

## Create a load balancer rule

A Load Balancer rule opens up an internet-facing port and forwards traffic to the internal node's port used by your application. If you do not have a load balancer, see [Configure an Internet-facing load balancer](../load-balancer/quickstart-load-balancer-standard-public-portal.md).

To create a Load Balancer rule, you need to collect the following information:

- Load balancer name.
- Resource group of the load balancer and service fabric cluster.
- External port.
- Internal port.

## Azure CLI
It only takes a single command to create a load balancer rule with the **Azure CLI**. You just need to know both the name of the load balancer and resource group to create a new rule.

>[!NOTE]
>If you need to determine the name of the load balancer, use this command to quickly get a list of all load balancers and the associated resource groups.
>
>`az network lb list --query "[].{ResourceGroup: resourceGroup, Name: name}"`
>


```azurecli
az network lb rule create --backend-port 40000 --frontend-port 39999 --protocol Tcp --lb-name LB-svcfab3 -g svcfab_cli -n my-app-rule
```

The Azure CLI command has a few parameters that are described in the following table:

| Parameter | Description |
| --------- | ----------- |
| `--backend-port`  | The port the Service Fabric application is listening to. |
| `--frontend-port` | The port the load balancer exposes for external connections. |
| `-lb-name` | The name of the load balancer to change. |
| `-g`       | The resource group that has both the load balancer and Service Fabric cluster. |
| `-n`       | The desired name of the rule. |


>[!NOTE]
>For more information on how to create a load balancer with the Azure CLI, see [Create a load balancer with the Azure CLI](../load-balancer/quickstart-load-balancer-standard-internal-cli.md).

## PowerShell

PowerShell is a little more complicated than the Azure CLI. Follow these conceptual steps to create a rule:

1. Get the load balancer from Azure.
2. Create a rule.
3. Add the rule to the load balancer.
4. Update the load balancer.

>[!NOTE]
>If you need to determine the name of the load balancer, use this command to quickly get a list of all load balancers and associated resource groups.
>
>`Get-AzLoadBalancer | Select Name, ResourceGroupName`

```powershell
# Get the load balancer
$lb = Get-AzLoadBalancer -Name LB-svcfab3 -ResourceGroupName svcfab_cli

# Create the rule based on information from the load balancer.
$lbrule = New-AzLoadBalancerRuleConfig -Name my-app-rule7 -Protocol Tcp -FrontendPort 39990 -BackendPort 40009 `
                                            -FrontendIpConfiguration $lb.FrontendIpConfigurations[0] `
                                            -BackendAddressPool  $lb.BackendAddressPools[0] `
                                            -Probe $lb.Probes[0]

# Add the rule to the load balancer
$lb.LoadBalancingRules.Add($lbrule)

# Update the load balancer on Azure
$lb | Set-AzLoadBalancer
```

Regarding the `New-AzLoadBalancerRuleConfig` command, the `-FrontendPort` represents the port the load balancer exposes for external connections, and the `-BackendPort` represents the port the service fabric app is listening to.

>[!NOTE]
>For more information on how to create a load balancer with PowerShell, see [Create a load balancer with PowerShell](../load-balancer/quickstart-load-balancer-standard-internal-powershell.md).

## Next steps

Learn more about [networking in Service Fabric](service-fabric-patterns-networking.md).
