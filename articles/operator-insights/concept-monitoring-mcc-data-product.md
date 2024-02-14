---
title: Monitoring - Affirmed MCC Data Product - Azure Operator Insights
description: This article gives an overview of the Monitoring - Affirmed MCC Data Product provided by Azure Operator Insights 
author: rcdun
ms.author: rdunstan
ms.reviewer: rathishr
ms.service: operator-insights
ms.topic: concept-article
ms.date: 12/06/2023

#CustomerIntent: As an MCC operator, I want to understand the capabilities of the Monitoring - Affirmed MCC Data Product so that I can use it to provide insights to my network.
---

# Monitoring - Affirmed MCC Data Product overview

The Monitoring - Affirmed MCC Data Product supports data analysis and insight for operators of the Affirmed Networks Mobile Content Cloud (MCC).  It ingests performance management data (performance statistics) from MCC network elements. It then digests and enriches this data to provide visualizations for the operator and to provide access to the underlying enriched data for operator data scientists.

## Background

The Affirmed Networks Mobile Content Cloud (MCC) is a virtualized Evolved Packet Core (vEPC) that can provide the following functionality.

- Serving Gateway (SGW) routes and forwards user data packets between the RAN and the core network.
- Packet Data Network Gateway (PGW) provides interconnect between the core network and external IP networks.
- Gi-LAN Gateway (GIGW) provides subscriber-aware or subscriber-unaware value-added services (VAS) without enabling MCC gateway services, allowing operators to take advantage of VAS while still using their incumbent gateway.
- Gateway GPRS support node (GGSN) provides interworking between the GPRS network and external packet switched networks.
- Serving GPRS support node and MME (SGSN/MME) is responsible for the delivery of data packets to and from the mobile stations within its geographical service area.
- Control and User Plane Separation (CUPS), an LTE enhancement that separates control and user plane function to allow independent scaling of functions.

The Monitoring - Affirmed MCC Data Product supports all of the MCC variants described.

## Data types

The following data type is provided as part of the Monitoring - Affirmed MCC Data Product.

- *pmstats* contains performance management data reported by the MCC management node, giving insight into the performance characteristics of the MCC network elements.

## Setup

To use the Monitoring - Affirmed MCC Data Product:

1. Deploy the Data Product by following [Create an Azure Operator Insights Data Product](data-product-create.md).
1. Configure your network to provide data by setting up an Azure Operator Insights ingestion agent on a virtual machine (VM).

    1. Read [Requirements for the Azure Operator Insights ingestion agent](#requirements-for-the-azure-operator-insights-ingestion-agent).
    1. [Install the Azure Operator Insights ingestion agent and configure it to upload data](set-up-ingestion-agent.md).

    Alternatively, you can provide your own ingestion agent.

## Requirements for the Azure Operator Insights ingestion agent

Use the VM requirements to set up a suitable VM for the ingestion agent. Use the example configuration to configure the ingestion agent to upload data to the Data Product, as part of following [Install the Azure Operator Insights ingestion agent and configure it to upload data](set-up-ingestion-agent.md).

### VM requirements

> [!WARNING]
> TODO: add data-product-specific information from [Create and configure MCC EDR Ingestion Agents for Azure Operator Insights](how-to-install-mcc-edr-agent.md)

### Required agent configuration

> [!WARNING]
> TODO: add sample configuration, with information about how to replace parameters.

## Related content

- [Data Quality Monitoring](concept-data-quality-monitoring.md)
- [Azure Operator Insights Data Types](concept-data-types.md)
- [Affirmed Networks MCC documentation](https://manuals.metaswitch.com/MCC) 

> [!NOTE]
> Affirmed Networks login credentials are required to access the MCC product documentation.
