---
title: Azure resources without 800 count limit
description: Lists the Azure resource types that can have more than 800 instances in a resource group.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: reference
ms.date: 7/30/2019
ms.author: tomfitz
---

# Resources not limited to 800 instances per resource group

By default, you can deploy up to 800 instances of a resource type in each resource group. However, some resource types are exempt from the 800 instance limit. This article lists the Azure resource types that can have more than 800 instances in a resource group. All other resources types are limited to 800 instances.

For some resource types, you need to enable a feature to exceed 800 instances. If necessary, the feature is listed with the resource type. For information about how to register for a feature, see [Register-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature) or [az feature register](/cli/azure/feature#az-feature-register).

## Resources exempt from resource group limit

> [!div class="mx-tableFixed"]
> | Resource provider | Resource type | Feature required |
> | ------------- | ----------- | --------- |
> | Microsoft.Automation | automationAccounts |  |
> | Microsoft.AzureStack | registrations |  |
> | Microsoft.AzureStack | registrations/customerSubscriptions |  |
> | Microsoft.AzureStack | registrations/products |  |
> | Microsoft.BotService | botServices | Register feature Microsoft.Resources/ARMDisableResourcesPerRGLimit |
> | Microsoft.Compute | disks |   |

* Microsoft.Compute/images
* Microsoft.Compute/snapshots
* Microsoft.Compute/virtualMachines
* Microsoft.ContainerRegistry/registries/buildTasks
* Microsoft.ContainerRegistry/registries/buildTasks/listSourceRepositoryProperties
* Microsoft.ContainerRegistry/registries/buildTasks/steps
* Microsoft.ContainerRegistry/registries/buildTasks/steps/listBuildArguments
* Microsoft.ContainerRegistry/registries/eventGridFilters
* Microsoft.ContainerRegistry/registries/replications
* Microsoft.ContainerRegistry/registries/tasks
* Microsoft.ContainerRegistry/registries/webhooks
* Microsoft.DBforMariaDB/servers
* Microsoft.DBforMySQL/servers
* Microsoft.DBforPostgreSQL/serverGroups
* Microsoft.DBforPostgreSQL/servers
* Microsoft.DBforPostgreSQL/serversv2
* Microsoft.EnterpriseKnowledgeGraph/services
* Microsoft.GuestConfiguration/guestConfigurationAssignments
* Microsoft.GuestConfiguration/software
* Microsoft.GuestConfiguration/softwareUpdateProfile
* Microsoft.GuestConfiguration/softwareUpdates
* Microsoft.Logic/integrationAccounts
* Microsoft.Logic/workflows
* Microsoft.Network/applicationGatewayWebApplicationFirewallPolicies
* Microsoft.Network/applicationSecurityGroups
* Microsoft.Network/bastionHosts
* Microsoft.Network/ddosProtectionPlans
* Microsoft.Network/dnszones
* Microsoft.Network/dnszones/A
* Microsoft.Network/dnszones/AAAA
* Microsoft.Network/dnszones/CAA
* Microsoft.Network/dnszones/CNAME
* Microsoft.Network/dnszones/MX
* Microsoft.Network/dnszones/NS
* Microsoft.Network/dnszones/PTR
* Microsoft.Network/dnszones/SOA
* Microsoft.Network/dnszones/SRV
* Microsoft.Network/dnszones/TXT
* Microsoft.Network/dnszones/all
* Microsoft.Network/dnszones/recordsets
* Microsoft.Network/networkIntentPolicies
* Microsoft.Network/networkInterfaces
* Microsoft.Network/privateDnsZones
* Microsoft.Network/privateDnsZones/A
* Microsoft.Network/privateDnsZones/AAAA
* Microsoft.Network/privateDnsZones/CNAME
* Microsoft.Network/privateDnsZones/MX
* Microsoft.Network/privateDnsZones/PTR
* Microsoft.Network/privateDnsZones/SOA
* Microsoft.Network/privateDnsZones/SRV
* Microsoft.Network/privateDnsZones/TXT
* Microsoft.Network/privateDnsZones/all
* Microsoft.Network/privateDnsZones/virtualNetworkLinks
* Microsoft.Network/privateEndpoints
* Microsoft.Network/privateLinkServices
* Microsoft.Network/publicIPAddresses - Register feature Microsoft.Resources/ARMDisableResourcesPerRGLimit
* Microsoft.Network/publicIPAddresses - Register feature Microsoft.Resources/ARMDisableResourcesPerRGLimit
* Microsoft.Network/serviceEndpointPolicies
* Microsoft.Network/trafficmanagerprofiles
* Microsoft.Network/virtualNetworkTaps
* Microsoft.PortalSdk/rootResources
* Microsoft.PowerBI/workspaceCollections - Register feature Microsoft.PowerBI/UnlimitedQuota
* Microsoft.PowerBI/workspaceCollections - Register feature Microsoft.PowerBI/UnlimitedQuota
* Microsoft.Scheduler/jobcollections
* Microsoft.Storage/storageAccounts
* Microsoft.Web/apiManagementAccounts/apis
* Microsoft.Web/sites

## Next steps

For a complete list of quotas and limits, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).
