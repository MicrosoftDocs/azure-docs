---
title: Differences between Azure Data Explorer and Azure Synapse Data Explorer (Preview)
description: This article describes the differences between Azure Data Explorer and Azure Synapse Data Explorer.
ms.topic: overview
ms.date: 11/02/2021
author: shsagir
ms.author: shsagir
ms.reviewer: maraheja
ms.service: synapse-analytics
ms.subservice: data-explorer
ms.custom: ignite-fall-2021
---

# What is the difference between Azure Synapse Data Explorer and Azure Data Explorer? (Preview)

[Azure Data Explorer](/azure/data-explorer/data-explorer-overview) is a stand-alone, fast, and highly scalable data exploration service for log and telemetry data. The same underlying technology that runs the service is available in Azure Synapse as an integrated analytics service to complement its existing SQL and Spark services geared for data warehouse and data engineering machine learning scenarios.

The native integration of Data Explore capabilities brings analytics log and time series workloads to Synapse in the form of Synapse Data Explorer pools. These pools offer close integration with, and easier management of connectivity to, other Synapse capabilities. Having all your machine and user data available and accessible in one place, and by leveraging the near real-time exploratory capabilities of Data Explorer, enables you to build solutions that drive business value.

We recommend starting with Synapse Data Explorer if you are looking for a unified solution that combines big data and analytics capabilities.

## Capability support

| Category | Capability | Azure Data Explorer | Synapse Data Explorer |
|--|--|--|--|
| **Security** | VNET | Supports VNet Injection and Azure Private Link | Support for Azure Private link automatically integrated as part of Synapse Managed VNET |
|  | CMK | ✓ | Automatically inherited from Synapse workspace configuration |
|  | Firewall | ✗ | Automatically inherited from Synapse workspace configuration |
| **Business Continuity** | Availability Zones | Optional | Enabled by default where Availability Zones are available |
| **SKU** | Compute options | 22+ Azure VM SKUs to choose from | Simplified to Synapse workload types SKUs |
| **Integrations** | Built-in ingestion pipelines | Event Hub, Event Grid, IoT Hub | Event Hub, Event Grid, and IoT Hub supported via the Azure portal for non-managed VNet |
|  | Spark integration | Azure Data Explorer linked service: Built-in Kusto Spark integration with support for Microsoft Entra pass-through authentication, Synapse Workspace MSI, and Service Principal | Built-in Kusto Spark connector integration with support for Microsoft Entra pass-through authentication, Synapse Workspace MSI, and Service Principal |
|  | KQL artifacts management | ✗ | Save KQL queries and integrate with Git |
|  | Metadata sync | ✗ | ✗ |
| **Features** | KQL queries | ✓ | ✓ |
|  | API and SDKs | ✓ | ✓ |
|  | Connectors | ✓ | ✓ |
|  | Query tools | ✓ | ✓ |
| **Pricing** | Business Model | Cost plus billing model with multiple meters: Azure Data Explorer IP markup, Compute, Storage, and Networking | VCore billing model with two meters: VCore and Storage |
|  | Reserved Instances | ✓ | ✗ |

## Next steps

[Data Explorer in Azure Synapse Analytics](data-explorer-overview.md)
