---
title: Quality of Experience - Affirmed MCC Data Products - Azure Operator Insights
description: This article gives an overview of the Azure Operator Insights Data Products provided to monitor the Quality of Experience for the Affirmed Mobile Content Cloud (MCC) 
author: bettylew
ms.author: rathishr
ms.service: operator-insights
ms.topic: concept-article
ms.date: 10/25/2023

#CustomerIntent: As an MCC operator, I want to understand the capabilities of the relevant Quality of Experience Data Product, in order to provide insights to my network.
---

# Quality of Experience - Affirmed MCC Data Product overview

The *Quality of Experience - Affirmed MCC* Data Products support data analysis and insight for operators of the Affirmed Networks Mobile Content Cloud (MCC). They ingest Event Data Records (EDRs) from MCC network elements, and then digest and enrich this data to provide a range of visualizations for the operator.  Operator data scientists have access to the underlying enriched data to support further data analysis.

## Background

The Affirmed Networks Mobile Content Cloud (MCC) is a virtualized Evolved Packet Core (vEPC) that can provide the following functionality.

- Serving Gateway (SGW) routes and forwards user data packets between the RAN and the core network.
- Packet Data Network Gateway (PGW) provides interconnect between the core network and external IP networks.
- Gi-LAN Gateway (GIGW) provides subscriber-aware or subscriber-unaware value-added services (VAS) without enabling MCC gateway services, allowing operators to take advantage of VAS while still using their incumbent gateway.
- Gateway GPRS support node (GGSN) provides interworking between the GPRS network and external packet switched networks.
- Serving GPRS support node and MME (SGSN/MME) is responsible for the delivery of data packets to and from the mobile stations within its geographical service area.
- Control and User Plane Separation (CUPS), an LTE enhancement that separates control and user plane function to allow independent scaling of functions.

The data produced by the MCC varies according to the functionality.  This variation affects the enrichments and visualizations that are relevant.  Azure Operator Insights provides the following Quality of Experience Data Products to support specific MCC functions.

- Quality of Experience - Affirmed MCC *(for GIGW function)*
- Quality of Experience - Affirmed MCC PGW/GGSN

## Data types

The following data types are provided for all variants of the Quality of Experience - Affirmed MCC Data Product.

- *edr* contains data from the Event Data Records (EDRs) written by the MCC network elements.  EDRs record each significant event arising during calls or sessions handled by the MCC. They provide a comprehensive record of what happened, allowing operators to explore both individual problems and more general patterns.
- *edr-sanitized* contains data from the *edr* data type but with personal data suppressed. Sanitized data types can be used to support data analysis whilst also enforcing subscriber privacy.

## Related content

- [Data Quality Monitoring](concept-data-quality-monitoring.md)
- [Azure Operator Insights Data Types](concept-data-types.md)
- [Monitoring - Affirmed MCC Data Product](concept-monitoring-mcc-data-product.md)
- [Affirmed Networks MCC documentation](https://manuals.metaswitch.com/MCC) 

    > [!NOTE]
    > Affirmed Networks login credentials are required to access the MCC product documentation.
