---
title: Prerequisites and setup for the SAP CDC connector
titleSuffix: Azure Data Factory
description: Learn about the prerequisites and setup for the SAP CDC connector in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 07/24/2023
ms.author: ulrichchrist
---

# Prerequisites and setup for the SAP CDC connector

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Learn about the prerequisites for the SAP CDC connector in Azure Data Factory and how to set up the solution in Azure Data Factory Studio.

## Prerequisites

To use the SAP CDC capabilities in Azure Data Factory, be able to complete these prerequisites:

- Set up SAP systems to use the [SAP Operational Data Provisioning (ODP) framework](https://help.sap.com/docs/SAP_LANDSCAPE_TRANSFORMATION_REPLICATION_SERVER/007c373fcacb4003b990c6fac29a26e4/b6e26f56fbdec259e10000000a441470.html?q=SAP%20Operational%20Data%20Provisioning%20%28ODP%29%20framework).
- [Set up a self-hosted integration runtime for the SAP CDC connector](sap-change-data-capture-shir-preparation.md).
- [Set up an SAP CDC linked service](sap-change-data-capture-prepare-linked-service-source-dataset.md#set-up-a-linked-service).
- [Debug issues with the SAP CDC connector by sending self-hosted integration runtime logs](sap-change-data-capture-debug-shir-logs.md) to Microsoft.
- Be familiar with [monitoring data extractions on SAP systems](sap-change-data-capture-management.md#monitor-data-extractions-on-sap-systems).

## Set up SAP systems to use the SAP ODP framework

To set up your SAP systems to use the SAP ODP framework, follow the guidelines that are described in the following sections.

### SAP system requirements

The ODP framework is part of many SAP systems, including SAP ECC and SAP S/4HANA. It's also contained in SAP BW and SAP BW/4HANA. To ensure that your SAP releases have ODP, see the following SAP documentation or support notes. Even though the guidance primarily refers to SAP BW and SAP Data Services, the information also applies to Data Factory.

- To support ODP, run your SAP systems on SAP NetWeaver 7.0 SPS 24 or later. For more information, see [Transferring Data from SAP Source Systems via ODP (Extractors)](https://help.sap.com/docs/SAP_BW4HANA/107a6e8a38b74ede94c833ca3b7b6f51/327833022dcf42159a5bec552663dc51.html).
- To support SAP Advanced Business Application Programming (ABAP) Core Data Services (CDS) full extractions via ODP, run your SAP systems on NetWeaver 7.4 SPS 08 or later. To support SAP ABAP CDS delta extractions, run your SAP systems on NetWeaver 7.5 SPS 05 or later. For more information, see [Transferring Data from SAP Systems via ODP (ABAP CDS Views)](https://help.sap.com/docs/SAP_BW4HANA/107a6e8a38b74ede94c833ca3b7b6f51/af11a5cb6d2e4d4f90d344f58fa0fb1d.html).
- [1521883 - To use ODP API 1.0](https://launchpad.support.sap.com/#/notes/1521883)
- [1931427 - To use ODP API 2.0 that supports SAP hierarchies](https://launchpad.support.sap.com/#/notes/1931427)
- [2481315 - To use ODP for data extractions from SAP source systems into BW or BW/4HANA](https://launchpad.support.sap.com/#/notes/2481315)

### Set up the SAP user

Data extractions via ODP require a properly configured user on SAP systems. The user must be authorized for ODP API invocations over Remote Function Call (RFC) modules. The user configuration is the same configuration that's required for data extractions via ODP from SAP source systems into BW or BW/4HANA. For more information, see these SAP support notes:

- [2855052 - To authorize ODP API usage](https://launchpad.support.sap.com/#/notes/2855052)
- [460089 - To authorize ODP RFC invocations](https://launchpad.support.sap.com/#/notes/460089)

### Set up SAP data sources

ODP offers various data extraction contexts or *source object types*. Although most data source objects are ready to extract, some require more configuration. In an SAPI context, the objects to extract are called DataSources or *extractors*. To extract DataSources, be sure to meet the following requirements:

- Ensure that DataSources are activated on your SAP source systems. This requirement applies only to DataSources SAP or its partners deliver out-of-the-box. Customer-created DataSources are automatically active. If you already use a certain DataSource with SAP BW or BW/4HANA, it's already activate. For more information about DataSources and their activation, see [Installing BW Content DataSources](https://help.sap.com/saphelp_nw73/helpdata/en/4a/1be8b7aece044fe10000000a421937/frameset.htm).

- Make sure that DataSources are released for extraction via ODP. This requirement applies to DataSources that customers create and DataSources created by SAP in older releases of SAP ECC. For more information, see the following SAP support note [2232584 - To release SAP extractors for ODP API](https://launchpad.support.sap.com/#/notes/2232584).

### Set up the SAP Landscape Transformation Replication Server (optional)

SAP Landscape Transformation Replication Server (SLT) is a database trigger-enabled CDC solution that can replicate SAP application tables and simple views in near real time. SLT replicates from SAP source systems to various targets, including the operational delta queue (ODQ).

>[!NOTE]
   > SAP Landscape Transformation Replication Server (SLT) is only required if you want to replicate data from SAP tables with the SAP CDC connector. All other sources work out-of-the-box without SLT.

You can use SLT as a proxy in data extraction ODP. You can install SLT on an SAP source system as an SAP Data Migration Server (DMIS) add-on or use it on a standalone replication server. To use SLT as a proxy, complete the following steps:

1. Install NetWeaver 7.4 SPS 04 or later and the DMIS 2011 SP 05 add-on on your replication server. For more information, see [Transferring Data from SLT Using Operational Data Provisioning](https://help.sap.com/docs/SAP_NETWEAVER_750/ccc9cdbdc6cd4eceaf1e5485b1bf8f4b/6ca2eb9870c049159de25831d3269f3f.html).

1. Run the SAP Landscape Transformation Replication Server Cockpit (LTRC) transaction code on your replication server to configure SLT:

   1. Under **Specify Source System**, enter the RFC destination that represents your SAP source system.

   1. Under **Specify Target System**, complete these steps:

      1. Select **RFC Connection**.

      1. In **Scenario for RFC Communication**, select **Operational Data Provisioning (ODP)**.

      1. In **Queue Alias**, enter the queue alias to use to select the context of your data extractions via ODP in Data Factory. Use the format  `SLT~<your queue alias>`.

   :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-slt-configurations.png" alt-text="Screenshot of the SAP SLT configuration dialog.":::

For more information about SLT configurations, see [Replicating Data to SAP Business Warehouse](https://help.sap.com/docs/SAP_LANDSCAPE_TRANSFORMATION_REPLICATION_SERVER/969cf5258b964a5ba56380da648ac84e/737e69568fb4c359e10000000a441470.html).

### Validate your setup

To validate your SAP system configurations for ODP, you can run the RODPS_REPL_TEST program to test extraction, including SAPI extractors, CDS views, and BW objects. For more information, see [Replication test with RODPS_REPL_TEST](https://wiki.scn.sap.com/wiki/display/BI/Replication+test+with+RODPS_REPL_TEST).

### Known issues

The following SAP support notes resolve known issues on SAP systems:

- [1660374 - To extend timeout when fetching large data sets via ODP](https://launchpad.support.sap.com/#/notes/1660374)
- [2321589 - To resolve missing Business add-in (BAdI) implementation for RSODP_ODATA subscriber type](https://launchpad.support.sap.com/#/notes/2321589)
- [2636663 - To resolve inconsistent database trigger status in SLT when extracting and replicating the same SAP application table](https://launchpad.support.sap.com/#/notes/2636663)
- [3038236 - To resolve CDS view extractions that fail to populate ODQ](https://launchpad.support.sap.com/#/notes/3038236)
- [3076927 - To remove unsupported callbacks when extracting from SAP BW or BW/4HANA](https://launchpad.support.sap.com/#/notes/3076927)

## Next steps

[Set up a self-hosted integration runtime for your SAP CDC solution](sap-change-data-capture-shir-preparation.md)
