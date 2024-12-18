---
title: "Disaster recovery: Azure Modeling and Simulation Workbench"
description: This article provides an overview of disaster recovery for Azure Modeling and Simulation Workbench.
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: conceptual
ms.date: 08/21/2024
---

# Disaster recovery for Modeling and Simulation Workbench

This article explains how to configure a disaster recovery environment for Azure Modeling and Simulation Workbench. Azure data center outages are rare but can last anywhere from a few minutes to hours. Data Center outages can cause disruption to the environments hosted in that data center. This article gives Azure Modeling and Simulation workbench customers a resource to continue operations in the cloud in the event of a data center outage in the primary region hosting your workbench instance.

Planning for disaster recovery involves identifying expected recovery point objectives (RPO) and recovery time objectives (RTO) for your instance. Based upon your risk-tolerance and expected RPO, follow these instructions at an interval appropriate for your business needs.

A typical disaster recovery workflow starts with a failure of a critical service in your primary region. As the issue gets investigated, Azure publishes an expected time for the primary region to recover. If this timeframe isn't acceptable for business continuity, and the problem doesn't impact your secondary region, you would start the process to fail over to the secondary region.

## Achieving business continuity for Azure Modeling and Simulation Workbench

To be prepared for a data center outage, you can have a Modeling and Simulation workbench instance provisioned in a secondary region.

These Workbench resources can be configured to match the resources that exist in the primary Azure Modeling and Simulation workbench instance. Users in the workbench instance environment can be provisioned ahead of time, or when you switch to the secondary region. Chamber and connector resources can be put in a stopped state post deployment to invoke idle billing meters when not being used actively.

Alternatively, if you don't want to have an Azure Modeling and Simulation Workbench instance provisioned in the secondary region until an outage impacts your primary region, follow the provided steps in the Quickstart, but stop before creating the Azure Modeling and Simulation Workbench instance in the secondary region. That step can be executed when you choose to create the workbench resources in the secondary region as a failover.

## Prerequisites

- Ensure that the services and features that your account uses are supported in the target secondary region.

## Verify Microsoft Entra ID tenant information

The workspace source and destination can be in the same subscription. If source and destination for workbench are different subscriptions, the subscriptions must exist within the same Microsoft Entra ID tenant. Use Azure PowerShell to verify that both subscriptions have the same tenant ID.

```powershell
Get-AzSubscription -SubscriptionId <your-source-subscription>.TenantId

Get-AzSubscription-SubscriptionId <your-destination-subscription>.TenantId
```

## Prepare

To be prepared to work in a backup region, you would need to do some preparation ahead of the outage.

First identify your backup region.

List of supported regions can be found on the [Azure product availability roadmap](https://global.azure.com/product-roadmap/pam/roadmap), and searching for the service name: **Azure Modeling and Simulation Workbench**.
  
Then, create a backup of your Azure Key Vault and keys used by Azure Modeling and Simulation in Key Vault including:

1. Application Client key
2. Application Secret key

## Configure the new instance

In the event of a primary region failure, and decision to work in a backup region, you would create a Modeling and Simulation Workbench instance in your backup region.

1. Register to the Azure Modeling and Simulation Workbench Resource Provider as described in [Create an Azure Modeling and Simulation Workbench](/azure/modeling-simulation-workbench/quickstart-create-portal#register-azure-modeling-and-simulation-workbench-resource-provider).

1. Create an Azure Modeling and Simulation Workbench using this section of the Quickstart.

1. Upload data into the new backup instance following Upload Files section of instructions, if necessary.

You can now do your work in the new workbench instance created in the backup region.

## Cleanup

Once your primary region is up and operating, and you no longer need your backup instance, you can delete it.

## Related content

- [Backup and disaster recovery for Azure applications](/azure/reliability/cross-region-replication-azure)

- [Azure status](https://azure.status.microsoft/status)
