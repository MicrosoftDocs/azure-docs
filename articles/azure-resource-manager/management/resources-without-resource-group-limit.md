---
title: Resources without 800 count limit
description: Lists the Azure resource types that can have more than 800 instances in a resource group.
ms.topic: conceptual
ms.date: 03/19/2024
---

# Resources not limited to 800 instances per resource group

By default, you can deploy up to 800 instances of a resource type in each resource group. However, some resource types are exempt from the 800 instance limit. This article lists the Azure resource types that can have more than 800 instances in a resource group. All other resources types are limited to 800 instances.

For some resource types, you need to contact support to have the 800 instance limit removed. Those resource types are noted in this article.

Some resources have a limit on the number instances per region. This limit is different than the 800 instances per resource group. To check your instances per region, use the Azure portal. Select your subscription and **Usage + quotas** in the left pane. For more information, see [Check resource usage against limits](../../networking/check-usage-against-limits.md).

## Microsoft.Automation

* automationAccounts

## Microsoft.AzureArcData

* SqlServerInstances

## Microsoft.AzureStack

* generateDeploymentLicense
* linkedSubscriptions
* registrations
* registrations/customerSubscriptions
* registrations/products

## Microsoft.BotService

* botServices - By default, limited to 800 instances. That limit can be increased by [registering the following features](preview-features.md) - Microsoft.Resources/ARMDisableResourcesPerRGLimit 

## Microsoft.Cdn

* profiles - By default, limited to 800 instances. That limit can be increased by [registering the following features](preview-features.md) - Microsoft.Resources/ARMDisableResourcesPerRGLimit 
* profiles/networkpolicies - By default, limited to 800 instances. That limit can be increased by [registering the following features](preview-features.md) - Microsoft.Resources/ARMDisableResourcesPerRGLimit 

## Microsoft.Compute

* diskEncryptionSets
* disks
* galleries
* galleries/images
* galleries/images/versions
* galleries/serviceArtifacts
* images
* snapshots
* virtualMachines
* virtualMachines/extensions
* virtualMachineScaleSets - By default, limited to 800 instances. That limit can be increased by [registering the following features](preview-features.md) - Microsoft.Resources/ARMDisableResourcesPerRGLimit 

## Microsoft.ContainerInstance

* containerGroupProfiles
* containerGroups
* containerScaleSets

## Microsoft.ContainerRegistry

* registries/buildTasks
* registries/buildTasks/steps
* registries/eventGridFilters
* registries/replications
* registries/tasks
* registries/webhooks

## Microsoft.D365CustomerInsights

* instances

## Microsoft.DBforMariaDB

* servers

## Microsoft.DBforMySQL

* flexibleServers
* servers

## Microsoft.DBforPostgreSQL

* flexibleServers
* serverGroupsv2
* servers

## Microsoft.DevTestLab

* schedules

## Microsoft.EdgeOrder

* bootstrapConfigurations
* orderItems
* orders

## Microsoft.EventHub

* clusters
* namespaces

## Microsoft.Fabric

* capacities - By default, limited to 800 instances. That limit can be increased by [registering the following features](preview-features.md) - Microsoft.Fabric/UnlimitedResourceGroupQuota 

## Microsoft.GuestConfiguration

* guestConfigurationAssignments

## Microsoft.HybridCompute

* machines
* machines/extensions
* machines/runcommands

## Microsoft.Logic

* integrationAccounts
* workflows

## Microsoft.Media

* mediaservices/liveEvents

## Microsoft.NetApp

* netAppAccounts
* netAppAccounts/capacityPools
* netAppAccounts/capacityPools/volumes
* netAppAccounts/capacityPools/volumes/mountTargets
* netAppAccounts/capacityPools/volumes/snapshots
* netAppAccounts/capacityPools/volumes/subvolumes
* netAppAccounts/capacityPools/volumes/volumeQuotaRules
* netAppAccounts/snapshotPolicies
* netAppAccounts/volumeGroups

## Microsoft.Network

* applicationSecurityGroups
* customIpPrefixes
* ddosProtectionPlans
* loadBalancers - By default, limited to 800 instances. That limit can be increased by [registering the following features](preview-features.md) - Microsoft.Resources/ARMDisableResourcesPerRGLimit 
* networkIntentPolicies
* networkInterfaces
* networkSecurityGroups
* privateEndpointRedirectMaps
* privateEndpoints
* privateLinkServices
* publicIPAddresses
* serviceEndpointPolicies
* virtualNetworkTaps

## Microsoft.NetworkCloud

* volumes

## Microsoft.NetworkFunction

* vpnBranches - By default, limited to 800 instances. That limit can be increased by [registering the following features](preview-features.md) - Microsoft.NetworkFunction/AllowNaasVpnAccess 

## Microsoft.NotificationHubs

* namespaces - By default, limited to 800 instances. That limit can be increased by [registering the following features](preview-features.md) - Microsoft.NotificationHubs/ARMDisableResourcesPerRGLimit 
* namespaces/notificationHubs - By default, limited to 800 instances. That limit can be increased by [registering the following features](preview-features.md) - Microsoft.NotificationHubs/ARMDisableResourcesPerRGLimit 

## Microsoft.PowerBI

* workspaceCollections - By default, limited to 800 instances. That limit can be increased by [registering the following features](preview-features.md) - Microsoft.PowerBI/UnlimitedQuota 

## Microsoft.PowerBIDedicated

* autoScaleVCores - By default, limited to 800 instances. That limit can be increased by [registering the following features](preview-features.md) - Microsoft.PowerBIDedicated/UnlimitedResourceGroupQuota 
* capacities - By default, limited to 800 instances. That limit can be increased by [registering the following features](preview-features.md) - Microsoft.PowerBIDedicated/UnlimitedResourceGroupQuota 

## Microsoft.Relay

* namespaces

## Microsoft.Security

* assignments
* securityConnectors
* securityConnectors/devops

## Microsoft.ServiceBus

* namespaces

## Microsoft.Singularity

* accounts
* accounts/accountQuotaPolicies
* accounts/groupPolicies
* accounts/jobs
* accounts/models
* accounts/networks
* accounts/secrets
* accounts/storageContainers

## Microsoft.Sql

* instancePools
* managedInstances
* managedInstances/databases
* managedInstances/metricDefinitions
* managedInstances/metrics
* managedInstances/sqlAgent
* servers
* servers/databases
* servers/databases/databaseState
* servers/elasticpools
* servers/jobAccounts
* servers/jobAgents
* virtualClusters

## Microsoft.Storage

* storageAccounts

## Microsoft.StreamAnalytics

* streamingjobs - By default, limited to 800 instances. That limit can be increased by [registering the following features](preview-features.md) - Microsoft.StreamAnalytics/ASADisableARMResourcesPerRGLimit 

## Microsoft.Web

* apiManagementAccounts/apis
* certificates
* sites

## Next steps

For a complete list of quotas and limits, see [Azure subscription and service limits, quotas, and constraints](azure-subscription-service-limits.md).
