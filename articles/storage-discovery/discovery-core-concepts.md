---
title: Planning for Storage Discovery deployment | Microsoft Docs
description: Storage Discovery provides insights on storage capacity, transactions, and configurations - providing visibility into your storage estate at entire organization level and aiding business decisions.
author: pthippeswamy
ms.service: azure-storage-mover
ms.topic: overview
ms.date: 06/27/2025
ms.author: pthippeswamy
---

<!-- 
!########################################################
STATUS: DRAFT

CONTENT: NOT STARTED

REVIEW Stephen/Fabian: NOT STARTED
EDIT PASS: NOT STARTED

Document score: not run

!########################################################
-->
# Azure Storage Discovery concepts

Deploying Azure Storage Discovery workspace in one of your Azure subscriptions is the first step in starting aggregation of storage account metrics. This article discusses the important decisions and best practices for a Storage Discovery deployment.

## Select a subscription and region for Azure Storage Discovery workspace deployment

Azure Storage Discovery workspace can be deployed in a subscription of your choice and in one of the supported regions as listed in [Regional coverage of Azure Storage Discovery](discovery-regionalCoverage.md).

Once created, a Discovery workspace can aggregate metrics from storage accounts within its "Scope", regardless of whether those accounts reside in different regions. The list of regions from which metrics are aggregated is also provided in the [Regional coverage of Azure Storage Discovery](discovery-regionalCoverage.md).

## Permissions

To deploy a Discovery Workspace, user must have following access:

| Scenario | Minimal RBAC role assignments needed |
|---|---| 
| To deploy Discovery workspace | Contributor access on the subscription | 
| To include the subscription or resource groups in a Discovery workspace as part of *workspaceRoots* | Microsoft.Storage/storageAccounts/read access on the subscription or resource group | 
| To view Discovery reports | Reader access on the Discovery workspace |

## Azure Storage Discovery pricing plans

Storage Discovery is available in two different SKUs or pricing plans.

| Pricing Plan | Best for | Capacity | Transactions | Configuration | History |
|---|---|---|---|---|---|
| Free | Small-scale deployments and evaluation | • Trends<br>• Distributions<br>• Top storage accounts | Not available | • Resource configuration | • Backfill: 15 days<br>• Retention: 15 days |
| Standard | Production deployments with comprehensive insights | • Trends<br>• Distributions<br>• Top storage accounts | • Trends<br>• Distributions<br>• Top storage accounts | • Resource configuration<br>• Security configuration | • Backfill: 15 days<br>• Retention: 18 months |

Refer [Storage Discovery Pricing page](discovery-pricing.md) for more details.