---
title: Resources without 800 count limit
description: Lists the Azure resource types that can have more than 800 instances in a resource group.
ms.topic: conceptual
ms.date: 02/02/2023
---

# Resources not limited to 800 instances per resource group

By default, you can deploy up to 800 instances of a resource type in each resource group. However, some resource types are exempt from the 800 instance limit. This article lists the Azure resource types that can have more than 800 instances in a resource group. All other resources types are limited to 800 instances.

For some resource types, you need to contact support to have the 800 instance limit removed. Those resource types are noted in this article.

Some resources have a limit on the number instances per region. This limit is different than the 800 instances per resource group. To check your instances per region, use the Azure portal. Select your subscription and **Usage + quotas** in the left pane. For more information, see [Check resource usage against limits](../../networking/check-usage-against-limits.md).

## Microsoft.Automation

* automationAccounts

## Microsoft.AzureStack

* generateDeploymentLicense
* linkedSubscriptions
* registrations
* registrations/customerSubscriptions
* registrations/products

## Microsoft.BotService

* botServices - By default, limited to 800 instances. That limit can be increased by [registering the following features](preview-features.md) - Microsoft.Resources/ARMDisableResourcesPerRGLimit 

## Microsoft.Compute

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
* serverGroups
* serverGroupsv2
* servers
* serversv2

## Microsoft.DevTestLab

* schedules

## Microsoft.EdgeOrder

* orderItems
* orders

## Microsoft.EventHub

* clusters
* namespaces

## Microsoft.GuestConfiguration

* guestConfigurationAssignments

## Microsoft.HybridCompute

* machines
* machines/extensions

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

* applicationGatewayWebApplicationFirewallPolicies
* applicationSecurityGroups
* bastionHosts
* customIpPrefixes
* ddosProtectionPlans
* dnsForwardingRulesets
* dnsForwardingRulesets/forwardingRules
* dnsForwardingRulesets/virtualNetworkLinks
* dnsResolvers
* dnsResolvers/inboundEndpoints
* dnsResolvers/outboundEndpoints
* dnszones
* dnszones/A
* dnszones/AAAA
* dnszones/all
* dnszones/CAA
* dnszones/CNAME
* dnszones/MX
* dnszones/NS
* dnszones/PTR
* dnszones/recordsets
* dnszones/SOA
* dnszones/SRV
* dnszones/TXT
* expressRouteCrossConnections
* loadBalancers - By default, limited to 800 instances. That limit can be increased by [registering the following features](preview-features.md) - Microsoft.Resources/ARMDisableResourcesPerRGLimit 
* networkIntentPolicies
* networkInterfaces
* networkSecurityGroups
* privateDnsZones
* privateDnsZones/A
* privateDnsZones/AAAA
* privateDnsZones/all
* privateDnsZones/CNAME
* privateDnsZones/MX
* privateDnsZones/PTR
* privateDnsZones/SOA
* privateDnsZones/SRV
* privateDnsZones/TXT
* privateDnsZones/virtualNetworkLinks
* privateEndpointRedirectMaps
* privateEndpoints
* privateLinkServices
* publicIPAddresses
* serviceEndpointPolicies
* trafficmanagerprofiles
* virtualNetworks/privateDnsZoneLinks
* virtualNetworkTaps

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

## Microsoft.ServiceBus

* namespaces

## Microsoft.Singularity

* accounts
* accounts/accountQuotaPolicies
* accounts/groupPolicies
* accounts/jobs
* accounts/models
* accounts/networks
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

## Microsoft.StoragePool

* diskPools
* diskPools/iscsiTargets

## Microsoft.StreamAnalytics

* streamingjobs - By default, limited to 800 instances. That limit can be increased by [registering the following features](preview-features.md) - Microsoft.StreamAnalytics/ASADisableARMResourcesPerRGLimit 

## Microsoft.Web

* apiManagementAccounts/apis
* sites

## Next steps

For a complete list of quotas and limits, see [Azure subscription and service limits, quotas, and constraints](azure-subscription-service-limits.md).
