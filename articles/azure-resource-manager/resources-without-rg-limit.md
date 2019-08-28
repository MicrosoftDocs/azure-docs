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

For some resource types, you need to contact support to have the 800 instance limit removed. Those resource types are noted in this article.


## Microsoft.Automation

* automationAccounts

## Microsoft.AzureStack

* registrations
* registrations/customerSubscriptions
* registrations/products

## Microsoft.BotService

* botServices - Contact support to extend the limit.

## Microsoft.Compute

* disks
* images
* snapshots
* virtualMachines

## Microsoft.ContainerRegistry

* registries/buildTasks
* registries/buildTasks/listSourceRepositoryProperties
* registries/buildTasks/steps
* registries/buildTasks/steps/listBuildArguments
* registries/eventGridFilters
* registries/replications
* registries/tasks
* registries/webhooks

## Microsoft.DBforMariaDB

* servers

## Microsoft.DBforMySQL

* servers

## Microsoft.DBforPostgreSQL

* serverGroups
* servers
* serversv2

## Microsoft.EnterpriseKnowledgeGraph

* services

## Microsoft.GuestConfiguration

* guestConfigurationAssignments
* software
* softwareUpdateProfile
* softwareUpdates

## Microsoft.Logic

* integrationAccounts
* workflows

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
* publicIPAddresses - Contact support to extend the limit.
* serviceEndpointPolicies
* trafficmanagerprofiles
* virtualNetworkTaps

## Microsoft.PortalSdk

* rootResources

## Microsoft.PowerBI

* workspaceCollections - Contact support to extend the limit.

## Microsoft.Scheduler

* jobcollections

## Microsoft.Storage

* storageAccounts

## Microsoft.Web

* apiManagementAccounts/apis
* sites

## Next steps

For a complete list of quotas and limits, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).
