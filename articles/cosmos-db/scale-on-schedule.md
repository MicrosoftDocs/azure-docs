---
title: Scale Azure Cosmos DB on a schedule
description: Learn how to scale changes in throughput in Azure Cosmos DB using PowerShell and Azure Functions.
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 01/07/2020
ms.author: mjbrown
---

# Scale Azure Cosmos DB using Azure Functions Timer Trigger

Azure Cosmos DB performance is based on the amount of provisioned throughput expressed in Request Units per second (RU/s). The provisioning is at a second granularity and is billed based upon the highest RU/s per hour. This provisioned capacity model enables the service to provide a predictable and consistent throughput, guaranteed low latency, and high availability. In most production workloads this is necessary. However, in development and testing environments where Cosmos is only used during working hours, Cosmos can be scaled up in the morning and scaled back down in the evening after working hours.

Throughput can be set via [Azure Resource Manager (ARM) Templates](resource-manager-samples.md), [Azure CLI](cli-samples.md), [PowerShell](powershell-samples-sql.md), or for Core (SQL) API accounts, using the Cosmos SDK. The benefit for using ARM Templates, Azure CLI or PowerShell is they support all Cosmos DB model APIs.

## Azure Cosmos DB throughput scheduler sample project

To simplify the process for scaling Azure Cosmos DB on a schedule we've created a sample project, [Azure Cosmos Throughput Scheduler](https://github.com/Azure-Samples/azure-cosmos-throughput-scheduler). This project is an Azure Functions app with two Timer Triggers, ScaleUpTrigger and ScaleDownTrigger. The triggers run a PowerShell script that set the throughput on each resource defined in the `scale.json` file in each trigger. The ScaleUpTrigger is configured to run at 8am UTC and the ScaleDownTrigger is configured to run at 6pm UTC and can be easily changed in the `function.json` for each trigger.

This project can be cloned locally, modified to specify the Azure Cosmos DB resources to scale up and down and the schedule to run. Then deployed in an Azure subscription and secured using Managed Service Identity with [Role-based Access Control](role-based-access-control.md) (RBAC) permissions using the Cosmos DB Operator role to set throughput on your Azure Cosmos accounts.

## Next Steps

- Learn more and download sample, [Azure Cosmos Throughput Scheduler](https://github.com/Azure-Samples/azure-cosmos-throughput-scheduler).
