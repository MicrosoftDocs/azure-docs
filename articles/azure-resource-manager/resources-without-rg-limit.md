---
title: Azure resources without 800 count limit
description: Lists the Azure resource types that can have more than 800 instances in a resource group.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: reference
ms.date: 10/4/2019
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

## Microsoft.NetApp

* netAppAccounts
* netAppAccounts/capacityPools
* netAppAccounts/capacityPools/volumes
* netAppAccounts/capacityPools/volumes/mountTargets
* netAppAccounts/capacityPools/volumes/snapshots

## Microsoft.PortalSdk

* rootResources

## Microsoft.PowerBI

* workspaceCollections - Contact support to extend the limit.

## Microsoft.Scheduler

* jobcollections

## Microsoft.ServiceFabricMesh

* applications
* containerGroups
* gateways
* networks
* secrets
* volumes

## Microsoft.Storage

* storageAccounts

## Microsoft.Web

* apiManagementAccounts/apis
* sites

## Next steps

For a complete list of quotas and limits, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).
