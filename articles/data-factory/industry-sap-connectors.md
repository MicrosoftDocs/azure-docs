---
title: SAP Connectors
titleSuffix: Azure Data Factory
description: Overview of the SAP Connectors
author: ukchrist
ms.author: ulrichchrist
ms.service: data-factory
ms.custom: event-tier1-build-2022, ignite-2022
ms.topic: conceptual
ms.date: 07/20/2023
---

# SAP connectors overview

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Azure Data Factory and Azure Synapse Analytics pipelines provide several SAP connectors to support a wide variety of data extraction scenarios from SAP.

>[!TIP]
>To learn about overall support for the SAP data integration scenario, see [SAP data integration whitepaper](https://github.com/Azure/Azure-DataFactory/blob/master/whitepaper/SAP%20Data%20Integration%20using%20Azure%20Data%20Factory.pdf) with detailed introduction on each SAP connector, comparison and guidance.

The following table shows the SAP connectors and in which activity scenarios they're supported as well as notes section for supported version information or other notes.

| Data store                                                   | [Copy activity](copy-activity-overview.md)  (source/sink) | [Mapping Data Flow](concepts-data-flow-overview.md) (source/sink) | [Lookup Activity](control-flow-lookup-activity.md) | Notes |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | ------------------------------------------------------------ |
|[SAP Business Warehouse Open Hub](connector-sap-business-warehouse-open-hub.md) | ✓/−                                                          |                                                              | ✓                                                            | SAP Business Warehouse version 7.01 or higher. SAP BW/4HANA isn't supported by this connector.                                                             | 
|[SAP Business Warehouse via MDX](connector-sap-business-warehouse.md)| ✓/−                                                          |                                                              | ✓                                                            | SAP Business Warehouse version 7.x.                                                             | 
| [SAP CDC](connector-sap-change-data-capture.md) |                                                           |  ✓/-                                                            |                                                             | Can connect to all SAP releases supporting SAP Operational Data Provisioning (ODP). This includes most SAP ECC and SAP BW releases, as well as SAP S/4HANA, SAP BW/4HANA and SAP Landscape Transformation Replication Server (SLT). Regarding prerequisites for the SAP source syste, follow [SAP system requirements](sap-change-data-capture-prerequisites-configuration.md#sap-system-requirements). For details on the connector, follow [Overview and architecture of the SAP CDC capabilities](sap-change-data-capture-introduction-architecture.md)                                                              |
| [SAP Cloud for Customer (C4C)](connector-sap-cloud-for-customer.md) | ✓/✓                                                          |                                                              | ✓                                                            | SAP Cloud for Customer including the SAP Cloud for Sales, SAP Cloud for Service, and SAP Cloud for Social Engagement solutions.                                                             |
| [SAP ECC](connector-sap-ecc.md)     | ✓/−                                                          |                                                              | ✓                                                            | SAP ECC on SAP NetWeaver version 7.0 and later.                                                             |
| [SAP HANA](connector-sap-hana.md)   | ✓/✓                                                          |                                                              | ✓                                                            | Any version of SAP HANA database                                                             | 
| [SAP Table](connector-sap-table.md) | ✓/−                                                          |                                                              | ✓                                                            | SAP ERP Central Component (SAP ECC) version 7.01 or later. SAP Business Warehouse (SAP BW) version 7.01 or later. SAP S/4HANA. Other products in SAP Business Suite version 7.01 or later.                                                             |
