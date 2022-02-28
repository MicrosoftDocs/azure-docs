---
title: Resources without 800 count limit
description: Lists the Azure resource types that can have more than 800 instances in a resource group.
ms.topic: conceptual
ms.date: 10/20/2021
---

# Resources not limited to 800 instances per resource group

By default, you can deploy up to 800 instances of a resource type in each resource group. However, some resource types are exempt from the 800 instance limit. This article lists the Azure resource types that can have more than 800 instances in a resource group. All other resources types are limited to 800 instances.

For some resource types, you need to contact support to have the 800 instance limit removed. Those resource types are noted in this article.

Some resources have a limit on the number instances per region. This limit is different than the 800 instances per resource group. To check your instances per region, use the Azure portal. Select your subscription and **Usage + quotas** in the left pane. For more information, see [Check resource usage against limits](../../networking/check-usage-against-limits.md).

## Microsoft.AlertsManagement

* resourceHealthAlertRules
* smartDetectorAlertRules

## Microsoft.Automation

* automationAccounts

## Microsoft.AzureStack

* linkedSubscriptions
* registrations
* registrations/customerSubscriptions
* registrations/products

## Microsoft.BotService

* botServices - By default, limited to 800 instances. That limit can be increased by contacting support.

## Microsoft.Compute

* disks
* galleries
* galleries/images
* galleries/images/versions
* images
* snapshots
* virtualMachineScaleSets - By default, limited to 800 instances. That limit can be increased by contacting support.
* virtualMachines
* virtualMachines/extensions - Supports an unlimited number of VM extension instances.

## Microsoft.ContainerInstance

* containerGroups

## Microsoft.ContainerRegistry

* registries/buildTasks
* registries/buildTasks/listSourceRepositoryProperties
* registries/buildTasks/steps
* registries/buildTasks/steps/listBuildArguments
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

## Microsoft.EnterpriseKnowledgeGraph

* services

## Microsoft.EventHub

* clusters
* namespaces

## Microsoft.Experimentation

* experimentWorkspaces

## Microsoft.GuestConfiguration

* autoManagedVmConfigurationProfiles
* configurationProfileAssignments
* guestConfigurationAssignments
* software
* softwareUpdateProfile
* softwareUpdates

## Microsoft.HybridCompute

* machines - Supports up to 5,000 instances.
* machines/extensions - Supports an unlimited number of VM extension instances.

## microsoft.insights

* metricalerts
* scheduledqueryrules

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
* netAppAccounts/snapshotPolicies
* netAppAccounts/volumeGroups

## Microsoft.Network

* applicationGatewayWebApplicationFirewallPolicies
* applicationSecurityGroups
* bastionHosts
* ddosProtectionPlans
* dnszones
* dnszones/A
* dnszones/AAAA
* dnszones/CAA
* dnszones/CNAME
* dnszones/MX
* dnszones/NS
* dnszones/PTR
* dnszones/SOA
* dnszones/SRV
* dnszones/TXT
* dnszones/all
* dnszones/recordsets
* networkIntentPolicies
* networkInterfaces
* privateDnsZones
* privateDnsZones/A
* privateDnsZones/AAAA
* privateDnsZones/CNAME
* privateDnsZones/MX
* privateDnsZones/PTR
* privateDnsZones/SOA
* privateDnsZones/SRV
* privateDnsZones/TXT
* privateDnsZones/all
* privateDnsZones/virtualNetworkLinks
* privateEndpoints
* privateLinkServices
* publicIPAddresses
* serviceEndpointPolicies
* trafficmanagerprofiles
* virtualNetworkTaps

## Microsoft.PortalSdk

* rootResources

## Microsoft.PowerBI

* workspaceCollections - By default, limited to 800 instances. That limit can be increased by contacting support.

## Microsoft.PowerBIDedicated

* autoScaleVCores - By default, limited to 800 instances. That limit can be increased by contacting support.
* capacities - By default, limited to 800 instances. That limit can be increased by contacting support.

## Microsoft.Relay

* namespaces

## Microsoft.Scheduler

* jobcollections

## Microsoft.ServiceBus

* namespaces

## Microsoft.Singularity

* accounts
* accounts/accountQuotaPolicies
* accounts/groupPolicies
* accounts/jobs
* accounts/models
* accounts/storageContainers

## Microsoft.Sql

* servers/databases

## Microsoft.Storage

* storageAccounts

## Microsoft.StreamAnalytics

* streamingjobs - By default, limited to 800 instances. That limit can be increased by contacting support.

## Next steps

For a complete list of quotas and limits, see [Azure subscription and service limits, quotas, and constraints](azure-subscription-service-limits.md).
