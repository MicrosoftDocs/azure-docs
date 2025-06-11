---
title: Azure RBAC permissions
titleSuffix: Azure Network Watcher
description: Learn about the required Azure role-based access control (Azure RBAC) permissions to have in order to use each of the Azure Network Watcher capabilities.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: concept-article
ms.date: 06/11/2025

#CustomerIntent: As an Azure administrator, I want to know the required Azure role-based access control (Azure RBAC) permissions to use each of the Network Watcher capabilities, so I can assign them correctly to users using any of those capabilities.
---

# Azure role-based access control permissions required to use Network Watcher

Azure role-based access control (Azure RBAC) enables you to assign only the specific actions to members of your organization that they require to complete their assigned responsibilities.

To use Azure Network Watcher capabilities, the account you log into Azure with, must be assigned to the [Owner](../role-based-access-control/built-in-roles.md?toc=/azure/network-watcher/toc.json#owner), [Contributor](../role-based-access-control/built-in-roles.md?toc=/azure/network-watcher/toc.json#contributor), or [Network contributor](../role-based-access-control/built-in-roles.md?toc=/azure/network-watcher/toc.json#network-contributor) built-in roles, or assigned to a [custom role](../role-based-access-control/custom-roles.md?toc=/azure/network-watcher/toc.json) that includes the actions listed for the Network Watcher capability that you want to use.

> [!IMPORTANT]
> [Network contributor](../role-based-access-control/built-in-roles.md?toc=/azure/network-watcher/toc.json#network-contributor) doesn't include the following actions:
> - Microsoft.Storage/* actions listed in [Additional actions](#additional-actions) or [Flow logs](#flow-logs) section.
> - Microsoft.Compute/* actions listed in [Additional actions](#additional-actions) section.
> - Microsoft.OperationalInsights/workspaces/\*, Microsoft.Insights/dataCollectionRules/* or Microsoft.Insights/dataCollectionEndpoints/* actions listed in [Traffic analytics](#traffic-analytics) section.

To learn how to check roles assigned to a user for a subscription, see [List Azure role assignments using the Azure portal](../role-based-access-control/role-assignments-list-portal.yml?toc=/azure/network-watcher/toc.json). If you can't see the role assignments, contact the respective subscription admin.

The following sections list the minimum required permissions to use Network Watcher and its capabilities. For a full list of related Azure permissions, see [Microsoft.Network permissions](/azure/role-based-access-control/permissions/networking#microsoftnetwork), [Microsoft.Compute permissions](/azure/role-based-access-control/permissions/compute#microsoftcompute), [Microsoft.Storage permissions](/azure/role-based-access-control/permissions/storage#microsoftstorage), [Microsoft.Insights permissions](/azure/role-based-access-control/permissions/monitor#microsoftinsights), and [Microsoft.OperationalInsights permissions](/azure/role-based-access-control/permissions/monitor#microsoftoperationalinsights).

## Network Watcher

> [!div class="mx-tableFixed"]
> | Action | Description |
> | ---- | ---- |
> | Microsoft.Network/networkWatchers/read | Get a network watcher |
> | Microsoft.Network/networkWatchers/write | Create or update a network watcher |
> | Microsoft.Network/networkWatchers/delete | Delete a network watcher |

## Connection monitor

> [!div class="mx-tableFixed"]
> | Action | Description |
> | ---- | ---- |
> | Microsoft.Network/networkWatchers/connectionMonitors/start/action | Start a connection monitor |
> | Microsoft.Network/networkWatchers/connectionMonitors/stop/action | Stop a connection monitor |
> | Microsoft.Network/networkWatchers/connectionMonitors/query/action | Query a connection monitor |
> | Microsoft.Network/networkWatchers/connectionMonitors/read | Get a connection monitor |
> | Microsoft.Network/networkWatchers/connectionMonitors/write | Create a connection monitor |
> | Microsoft.Network/networkWatchers/connectionMonitors/delete | Delete a connection monitor |

## Flow logs

> [!div class="mx-tableFixed"]
> | Action | Description |
> | ---- | ---- |
> | Microsoft.Network/networkWatchers/flowLogs/read | Get flow log details |
> | Microsoft.Network/networkWatchers/flowLogs/write | Creates a flow log |
> | Microsoft.Network/networkWatchers/flowLogs/delete | Deletes a flow log |
> | Microsoft.Network/networkWatchers/configureFlowLog/action | Configure a flow Log |
> | Microsoft.Network/networkWatchers/queryFlowLogStatus/action | Query status for a flow log |
> | Microsoft.Network/networkSecurityGroups/write <sup>1</sup> | Creates a network security group or updates an existing network security group |
Microsoft.Storage/storageAccounts/listServiceSas/Action, </br> Microsoft.Storage/storageAccounts/listAccountSas/Action, <br> Microsoft.Storage/storageAccounts/listKeys/Action | Fetch shared access signatures (SAS) enabling [secure access to storage account](../storage/common/storage-sas-overview.md?toc=/azure/network-watcher/toc.json) and write to the storage account |

<sup>1</sup> Only required with NSG flow logs.

## Traffic analytics

Since traffic analytics is enabled as part of the flow log resource, the following permissions are required in addition to all the required permissions for [Flow logs](#flow-logs):

> [!div class="mx-tableFixed"]
> | Action | Description |
> | ---- | ---- |
> | Microsoft.Network/applicationGateways/read | Get an application gateway |
> | Microsoft.Network/connections/read | Get VirtualNetworkGatewayConnection |
> | Microsoft.Network/loadBalancers/read | Get a load balancer definition |
> | Microsoft.Network/localNetworkGateways/read | Get LocalNetworkGateway |
> | Microsoft.Network/networkInterfaces/read | Get a network interface definition |
> | Microsoft.Network/networkSecurityGroups/read | Get a network security group definition |
> | Microsoft.Network/publicIPAddresses/read | Get a public IP address definition |
> | Microsoft.Network/routeTables/read | Get a route table definition |
> | Microsoft.Network/virtualNetworkGateways/read | Get a VirtualNetworkGateway |
> | Microsoft.Network/virtualNetworks/read | Get a virtual network definition |
> | Microsoft.Network/expressRouteCircuits/read | Get an ExpressRouteCircuit |
> | Microsoft.OperationalInsights/workspaces/read | Get an existing workspace |
> | Microsoft.OperationalInsights/workspaces/sharedkeys/action | Retrieve the shared keys for the workspace |
> | Microsoft.Insights/dataCollectionRules/read <sup>1</sup> | Read a data collection rule |
> | Microsoft.Insights/dataCollectionRules/write <sup>1</sup> | Create or update a data collection rule |
> | Microsoft.Insights/dataCollectionRules/delete <sup>1</sup> | Delete a data collection rule |
> | Microsoft.Insights/dataCollectionEndpoints/read <sup>1</sup> | Read a data collection endpoint |
> | Microsoft.Insights/dataCollectionEndpoints/write <sup>1</sup> | Create or update a data collection endpoint |
> | Microsoft.Insights/dataCollectionEndpoints/delete <sup>1</sup> | Delete a data collection endpoint |

<sup>1</sup> Only required when using traffic analytics to analyze virtual network flow logs. For more information, see [Data collection rules in Azure Monitor](/azure/azure-monitor/essentials/data-collection-rule-overview?toc=/azure/network-watcher/toc.json) and [Data collection endpoints in Azure Monitor](/azure/azure-monitor/essentials/data-collection-endpoint-overview?toc=/azure/network-watcher/toc.json).

[!INCLUDE [Traffic analytics resources](../../includes/network-watcher-traffic-analytics-resources.md)]

> [!IMPORTANT]
> [Management group](../governance/management-groups/overview.md?toc=/azure/network-watcher/toc.json) inherited permissions are currently not supported for enabling traffic analytics.

## Connection troubleshoot

> [!div class="mx-tableFixed"]
> | Action | Description |
> | ---- | ---- |
> | Microsoft.Network/networkWatchers/connectivityCheck/action, <br> Microsoft.Network/networkWatchers/connectivityCheck/read | Verify the possibility of establishing a direct TCP connection from a virtual machine to a given endpoint |
> | Microsoft.Network/networkWatchers/queryTroubleshootResult/action | Query results of a connection troubleshoot test |
> | Microsoft.Network/networkWatchers/troubleshoot/action | Run a connection troubleshoot test |

## Packet capture

> [!div class="mx-tableFixed"]
> | Action | Description |
> | ---- | ---- |
> | Microsoft.Network/networkWatchers/packetCaptures/queryStatus/action | Query the status of a packet capture |
> | Microsoft.Network/networkWatchers/packetCaptures/stop/action | Stop the running packet capture session |
> | Microsoft.Network/networkWatchers/packetCaptures/read | Get a packet capture definition |
> | Microsoft.Network/networkWatchers/packetCaptures/write | Create a packet capture |
> | Microsoft.Network/networkWatchers/packetCaptures/delete | Delete a packet capture |
> | Microsoft.Network/networkWatchers/packetCaptures/queryStatus/read | View the status of a packet capture | 

## IP flow verify

> [!div class="mx-tableFixed"]
> | Action | Description |
> | ---- | ---- |
> | Microsoft.Network/networkWatchers/ipFlowVerify/action, <br> Microsoft.Network/networkWatchers/ipFlowVerify/read | Returns whether the packet is allowed or denied to or from a particular destination |

## Next hop

> [!div class="mx-tableFixed"]
> | Action | Description |
> | ---- | ---- |
> | Microsoft.Network/networkWatchers/nextHop/action, <br> Microsoft.Network/networkWatchers/nextHop/read | For a specified target and destination IP address, return the next hop type and next hope IP address |
> | Microsoft.Compute/virtualMachines/read | Get the properties of a virtual machine |
> | Microsoft.Network/networkInterfaces/read | Get a network interface definition |

## Network security group view

> [!div class="mx-tableFixed"]
> | Action | Description |
> | ---- | ---- |
> | Microsoft.Network/networkWatchers/securityGroupView/action | View the configured and effective network security group rules applied on a virtual machine |

## Topology

> [!div class="mx-tableFixed"]
> | Action | Description |
> | ---- | ---- |
> | Microsoft.Network/networkWatchers/topology/action, <br> Microsoft.Network/networkWatchers/topology/read | Get a network level view of resources and their relationships in a resource group |

## Reachability report

> [!div class="mx-tableFixed"]
> | Action | Description |
> | ---- | ---- |
> | Microsoft.Network/networkWatchers/azureReachabilityReport/action | Get the relative latency score for internet service providers from a specified location to Azure regions |

## Additional actions

Some Network Watcher capabilities require the following actions:

> [!div class="mx-tableFixed"]
> | Action | Description |
> | ---- | ---- |
> | Microsoft.Authorization/\*/Read | Fetch Azure role assignments and policy definitions |
> | Microsoft.Resources/subscriptions/resourceGroups/Read | Enumerate all the resource groups in a subscription |
> | Microsoft.Storage/storageAccounts/Read | Get the properties for the specified storage account |
> | Microsoft.Storage/storageAccounts/listServiceSas/Action, </br> Microsoft.Storage/storageAccounts/listAccountSas/Action, <br> Microsoft.Storage/storageAccounts/listKeys/Action | Fetch shared access signatures (SAS) enabling [secure access to storage account](../storage/common/storage-sas-overview.md?toc=/azure/network-watcher/toc.json) and write to the storage account |
> | Microsoft.Compute/virtualMachines/Read, </br> Microsoft.Compute/virtualMachines/Write| Log in to the VM, do a packet capture and upload it to storage account |
> | Microsoft.Compute/virtualMachines/extensions/Read, </br> Microsoft.Compute/virtualMachines/extensions/Write | Check if Network Watcher extension is present, and install if necessary |
> | Microsoft.Compute/virtualMachineScaleSets/Read, </br> Microsoft.Compute/virtualMachineScaleSets/Write | Access virtual machine scale sets, do packet captures and upload them to storage account |
> | Microsoft.Compute/virtualMachineScaleSets/extensions/Read, </br> Microsoft.Compute/virtualMachineScaleSets/extensions/Write| Check if Network Watcher extension is present, and install if necessary |
> | Microsoft.Insights/alertRules/* | Set up metric alerts |
> | Microsoft.Support/* | Create and update support tickets from Network Watcher |

## Related content

- [What is Network Watcher?](network-watcher-overview.md)

- [Network Watcher frequently asked questions (FAQ)](frequently-asked-questions.yml)
