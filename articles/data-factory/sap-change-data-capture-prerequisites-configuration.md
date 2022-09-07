---
title: Prerequisites and settings for the SAP change data capture solution
titleSuffix: Azure Data Factory
description: Learn about the prerequisites and configuration of the SAP change data capture (CDC) solution in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# Prerequisites and settings for the SAP CDC solution

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes the prerequisites and configuration of the SAP CDC solution in Azure Data Factory.

## Prerequisites

To preview our new SAP CDC solution in Azure Data Factory, be able to complete these prerequisites:

- Configure SAP systems to use the [SAP Operational Data Provisioning (ODP) framework](https://help.sap.com/docs/SAP_LANDSCAPE_TRANSFORMATION_REPLICATION_SERVER/007c373fcacb4003b990c6fac29a26e4/b6e26f56fbdec259e10000000a441470.html?q=SAP%20Operational%20Data%20Provisioning%20%28ODP%29%20framework).
- Be familiar with Data Factory concepts like integration runtimes, linked services, datasets, activities, data flows, pipelines, templates, and triggers.
- Set up a self-hosted integration runtime to use for the SAP ODP connector.
- Set up an SAP ODP linked service.
- Set up the Data Factory copy activity with the SAP ODP source dataset.
- Debug Data Factory copy activity issues by sending self-hosted integration runtime logs.
- Auto-generate a Data Factory pipeline by using the SAP data partitioning template.
- Auto-generate a Data Factory pipeline by using the SAP data replication template.
- Be able to run an SAP data replication pipeline frequently.
- Be able to recover a failed SAP data replication pipeline run.
- Be familiar with monitoring data extractions on SAP systems.

## Configure SAP systems to use the SAP ODP framework

To configure your SAP systems to use the SAP ODP framework, follow the guidelines that are described in the following sections.

### SAP system requirements

ODP is available by default in software releases of most SAP systems (SAP ECC, SAP S/4HANA, SAP BW, and SAP BW/4HANA), except in early versions. To ensure that your SAP systems have ODP, see the following SAP documentation or support notes. Even though the guidance primarily mentions SAP BW/DS as subscribers and consumers for data extractions via ODP, it also applies to Data Factory as a subscriber or consumer.

- To support ODP, run your SAP systems on SAP NetWeaver 7.0 SPS24 or later, see [Transferring Data from SAP Source Systems via ODP (Extractors)](https://help.sap.com/docs/SAP_BW4HANA/107a6e8a38b74ede94c833ca3b7b6f51/327833022dcf42159a5bec552663dc51.html).
- To support SAP ABAP CDS full or delta extractions via ODP, run your SAP systems on NetWeaver 7.4 SPS08 or NetWeaver 7.5 SPS05 or later, respectively, see [Transferring Data from SAP Systems via ODP (ABAP CDS Views)](https://help.sap.com/docs/SAP_BW4HANA/107a6e8a38b74ede94c833ca3b7b6f51/af11a5cb6d2e4d4f90d344f58fa0fb1d.html).
- [1521883 - To use ODP API 1.0](https://launchpad.support.sap.com/#/notes/1521883).
- [1931427 - To use ODP API 2.0 that supports SAP hierarchies](https://launchpad.support.sap.com/#/notes/1931427).
- [2481315 - To use ODP for data extractions from SAP source systems into BW or BW/4HANA](https://launchpad.support.sap.com/#/notes/2481315).

### SAP user configurations

Data extractions via ODP require a properly configured user on SAP systems. The user must be authorized for ODP API invocations over Remote Function Call (RFC) modules. The user configuration is the same configuration that's required for data extractions via ODP from SAP source systems into BW or BW/4HANA:

- [2855052 - To authorize ODP API usage](https://launchpad.support.sap.com/#/notes/2855052)
- [460089 - To authorize ODP RFC invocations](https://launchpad.support.sap.com/#/notes/460089)

### SAP data source configurations

ODP offers various data extraction contexts or *source object types*. Although most data source objects are ready to extract, some need more configuration. In an SAPI context, the objects to extract are called DataSources or extractors. To extract DataSources, be sure to meet the following requirements:

- Ensure that DataSources are activated on SAP source systems. This applies only to DataSources that are delivered by SAP or its partners. DataSources that are created by customers are automatically activated. If DataSources have been or are being extracted by SAP BW or BW/4HANA, they’ve already been activated. For more information about DataSources and their activations, see [Installing BW Content DataSources](https://help.sap.com/saphelp_nw73/helpdata/en/4a/1be8b7aece044fe10000000a421937/frameset.htm).

- Make sure that DataSources are released for extractions via ODP. This applies only to DataSources that are created by customers. DataSources that are delivered by SAP or its partners are automatically released.

  - See [1560241 - To release DataSources for ODP API](https://launchpad.support.sap.com/#/notes/1560241). Combine this task with running the following programs:

    - RODPS_OS_EXPOSE to release DataSources for external use

    - BS_ANLY_DS_RELEASE_ODP to release BW extractors for the ODP API

  - [2232584 - To release SAP extractors for ODP API](https://launchpad.support.sap.com/#/notes/2232584) for a list of all SAP-delivered DataSources (7400+) that have been released.

### SLT configurations

SAP Landscape Transformation (SLT) replication server is a database trigger-enabled change data capture solution that can replicate SAP application tables and simple views in near real time from SAP source systems to various targets, including the operational delta queue (ODQ). You can use it as a proxy in data extraction ODP. You can install SLT on an SAP source system as an SAP Data Migration Server (DMIS) add-on or use it on a standalone replication server. To use an SLT replication server as a proxy, complete the following steps:

1. Install NetWeaver 7.4 SPS04 or later and the DMIS 2011 SP05 add-on on your replication server, see [Transferring Data from SLT Using Operational Data Provisioning](https://help.sap.com/docs/SAP_NETWEAVER_750/ccc9cdbdc6cd4eceaf1e5485b1bf8f4b/6ca2eb9870c049159de25831d3269f3f.html).

1. Run the LTRC transaction code on your replication server to configure the SLT:

   1. In the **Specify Source System** section, specify the RFC destination that represents your SAP source system.

   1. In the **Specify Target System** section:

      1. Select **RFC Connection**.

      1. In the **Scenario for RFC Communication** dropdown, select **Operational Data Provisioning (ODP)**.

      1. For **Queue Alias**, enter your queue alias to use to select the context of your data extractions via ODP in Data Factory as `SLT~<your queue alias>`.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-slt-configurations.png" alt-text="Screenshot of the SAP SLT configuration dialog.":::

For more information about SLT configurations, see [Replicating Data to SAP Business Warehouse](https://help.sap.com/docs/SAP_LANDSCAPE_TRANSFORMATION_REPLICATION_SERVER/969cf5258b964a5ba56380da648ac84e/737e69568fb4c359e10000000a441470.html).

### Known issues

Here are SAP support notes to resolve known issues on SAP systems:

- [1660374 - To extend timeout when fetching large data sets via ODP](https://launchpad.support.sap.com/#/notes/1660374)
- [2321589 - To resolve non-existing Business Add-In (BAdI) for RSODP_ODATA subscriber type](https://launchpad.support.sap.com/#/notes/2321589)
- [2636663 - To resolve inconsistent database trigger status in SLT when extracting and replicating the same SAP application table](https://launchpad.support.sap.com/#/notes/2636663)
- [3038236 - To resolve CDS view extractions that fail to populate ODQ](https://launchpad.support.sap.com/#/notes/3038236)
- [3076927 - To remove unsupported callbacks when extracting from SAP BW or BW/4HANA](https://launchpad.support.sap.com/#/notes/3076927)

### Validation

To validate your SAP system configurations for ODP, you can run the RODPS_REPL_TEST program to test the extraction of your SAPI extractors, CDS views, BW objects, and so on. For more information, see [Replication test with RODPS_REPL_TEST](https://wiki.scn.sap.com/wiki/display/BI/Replication+test+with+RODPS_REPL_TEST).

## Next steps

[Prepare the self-hosted integration runtime with the SAP ODP (preview) connector](sap-change-data-capture-shir-preparation.md)
