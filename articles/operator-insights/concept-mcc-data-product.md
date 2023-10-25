---
title: Mobile Content Cloud (MCC) Data Product - Azure Operator Insights
description: This article provides an overview of the MCC Data Product for Azure Operator Insights
author: bettylew
ms.author: bettylew
ms.service: operator-insights
ms.topic: concept-article
ms.date: 10/25/2023

#CustomerIntent: As an MCC operator, I want to understand the capabilities of the MCC Data Product so that I can use it to provide insights to my network.
---

# Mobile Content Cloud (MCC) Data Product overview

The MCC Data Product supports data analysis and insight for operators of the Affirmed Networks Mobile Content Cloud (MCC).  It ingests Event Data Records (EDRs) and performance management data (performance statistics) from MCC network elements. It then digests and enriches this data to provide a range of visualizations for the operator and to provide access to the underlying enriched data for operator data scientists.

## Background

The Affirmed Networks Mobile Content Cloud (MCC) is a virtualized Evolved Packet Core (vEPC) that can provide the following functionality.

- Serving Gateway (SGW) routes and forwards user data packets between the RAN and the core network.
- Packet Data Network Gateway (PGW) provides interconnect between the core network and external IP networks.
- Gi-LAN Gateway (GIGW) provides subscriber-aware or subscriber-unaware value-added services (VAS) without enabling MCC gateway services, allowing operators to take advantage of VAS while still using their incumbent gateway.
- Gateway GPRS support node (GGSN) provides interworking between the GPRS network and external packet switched networks.
- Serving GPRS support node and MME (SGSN/MME) is responsible for the delivery of data packets to and from the mobile stations within its geographical service area.
- Control and User Plane Separation (CUPS), an LTE enhancement that separates control and user plane function to allow independent scaling of functions.

The data produced by the MCC varies according to the functionality, which leads to variation in the data digested and in the enrichments and visualizations that are relevant.

## Data types

The following data types are provided as part of the MCC Data Product.

- *edr* contains data from the Event Data Records (EDRs) written by the MCC network elements.  EDRs record each significant event arising during calls or sessions handled by the MCC. They provide a comprehensive record of what happened, allowing operators to explore both individual problems and more general patterns.
- *pmstats* contains performance management data reported by the MCC management node, giving insight into the performance characteristics of the MCC network elements.
- *edr-sanitized* contains data from the *edr* data type but with personally identifiable information (PII) information suppressed. This data can be used to support data analysis without giving access to PII.

## Related content

- [Data Quality Monitoring](concept-data-quality-monitoring.md)
- [Azure Operator Insights Data Types](concept-data-types.md)
- [Affirmed Networks MCC documentation](https://manuals.metaswitch.com/MCC) 

    > [!NOTE]
    > Affirmed Networks login credentials are required to access the MCC product documentation.
