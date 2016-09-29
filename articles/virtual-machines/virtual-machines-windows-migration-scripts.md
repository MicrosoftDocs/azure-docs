<properties
	pageTitle="Community tools for Azure Service Management to Azure Resource Manager migration"
	description="This article catalogs the tools that have been provided by the community to assist with migration of IaaS resources from Azure Service Management to the Azure Resource Manager stack."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="singhkays"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/29/2016"
	ms.author="singhkay"/>

# Community tools for Azure Service Management to Azure Resource Manager migration

This article catalogs the tools that have been provided by the community to assist with migration of IaaS resources from Azure Service Management to the Azure Resource Manager stack.

>[AZURE.NOTE]These tools are not officially supported by Microsoft Support. Therefore they are open sourced on Github and we're happy to accept PRs for fixes or additional scenarios. To report an issue, use the Github issues feature.
>
> Migrating with these tools will cause downtime for your classic Virtual Machine. If you're looking for platform supported migration, visit 
>
>- [Platform supported migration of IaaS resources from Classic to Azure Resource Manager stack](./virtual-machines-windows-migration-classic-resource-manager.md)
>- [Technical Deep Dive on Platform supported migration from Classic to Azure Resource Manager](./virtual-machines-windows-migration-classic-resource-manager-deep-dive.md)
>- [Migrate IaaS resources from Classic to Azure Resource Manager using Azure PowerShell](./virtual-machines-windows-ps-migration-classic-resource-manager.md)

## ASM2ARM

This is a PowerShell script module for migrating your **single** Virtual Machine (VM) from Azure Service Management stack to Azure Resource Manager stack. 

[Link to the tool documentation](https://github.com/Azure/classic-iaas-resourcemanager-migration/tree/master/asm2arm)

## migAz

migAz is an additional option to migrate a complete set of Azure Service Management IaaS resources to Azure Resource Manager IaaS resources. The migration can occur within the same subscription or between different subscriptions and subscription types (ex: CSP subscriptions).

[Link to the tool documentation](https://github.com/Azure/classic-iaas-resourcemanager-migration/tree/master/migaz)