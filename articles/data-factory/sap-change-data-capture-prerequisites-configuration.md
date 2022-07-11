---
title: SAP change data capture solution (Preview) - prerequisites and configuration
titleSuffix: Azure Data Factory
description: This topic introduces and describes the prerequisites and configuration of SAP change data capture (Preview) in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# SAP change data capture (CDC) solution prerequisites and configuration in Azure Data Factory (Preview)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This topic introduces and describes the prerequisites and configuration of SAP change data capture (Preview) in Azure Data Factory.

## Prerequisites

To preview our new SAP CDC solution in ADF you can/should:

- Configure SAP systems for Operational Data Provisioning (ODP) framework
- Be already familiar w/ ADF concepts, such as integration runtimes, linked services, datasets, activities, data flows, pipelines, templates, and triggers
- Prepare SHIR w/ SAP ODP connector
- Prepare SAP ODP linked service
- Prepare ADF copy activity w/ SAP ODP source dataset
- Debug ADF copy activity issues by sending SHIR logs
- Auto-generate ADF pipeline from SAP data partitioning template
- Auto-generate ADF pipeline from SAP data replication template
- Run SAP data replication pipeline frequently
- Recover a failed SAP data replication pipeline run
- Monitor data extractions on SAP systems

## Configure SAP systems for ODP framework

To configure your SAP systems for ODP, follow these guidelines:

### SAP system requirements

ODP comes by default in software releases of most SAP systems (ECC, S/4HANA, BW, and BW/4HANA), except in very early ones.  To ensure that your SAP systems come w/ ODP, please refer to the following SAP docs/support notes – Even though they mostly mention SAP BW/DS as subscribers/consumers for data extractions via ODP, they also apply to ADF as a subscriber/consumer:
- To support ODP, run your SAP systems on at least NetWeaver 7.0 SPS24 release, see [Transferring Data from SAP Source Systems via ODP (Extractors)](https://help.sap.com/docs/SAP_BW4HANA/107a6e8a38b74ede94c833ca3b7b6f51/327833022dcf42159a5bec552663dc51.html).
- To support ABAP CDS full/delta extractions via ODP, run your SAP systems on at least NetWeaver 7.4 SPS08/7.5 SPS05 release, respectively, see [Transferring Data from SAP Systems via ODP (ABAP CDS Views)](https://help.sap.com/docs/SAP_BW4HANA/107a6e8a38b74ede94c833ca3b7b6f51/af11a5cb6d2e4d4f90d344f58fa0fb1d.html). 
- [1521883 - To use ODP API 1.0](https://launchpad.support.sap.com/#/notes/1521883).
- [1931427 - To use ODP API 2.0 that supports SAP hierarchies](https://launchpad.support.sap.com/#/notes/1931427).
- [2481315 - To use ODP for data extractions from SAP source systems into BW or BW/4HANA](https://launchpad.support.sap.com/#/notes/2481315).

### SAP user configurations

Data extractions via ODP require a properly configured user on SAP systems, which needs to be authorized for ODP API invocations over RFC modules.  This user configuration is exactly the same as that required for data extractions via ODP from SAP source systems into BW or BW/4HANA:
- [2855052 - To authorize ODP API usage](https://launchpad.support.sap.com/#/notes/2855052).
- [460089 - To authorize ODP RFC invocations](https://launchpad.support.sap.com/#/notes/460089).

### SAP data source configurations

ODP offers various data extraction “contexts” or “source object types”.  While most data source objects are ready to extract, some need additional configurations.  In SAPI context, the objects to extract are called DataSources/extractors.  In order to extract DataSources, complete the following steps:
- They must be activated on SAP source systems – This applies only to those delivered by SAP/their partners, since those created by customers are automatically activated.  If they’ve been/are being extracted by SAP BW or BW/4HANA, they’re already activated.  For more info on DataSources and their activations, see [Installing BW Content DataSources](https://help.sap.com/saphelp_nw73/helpdata/en/4a/1be8b7aece044fe10000000a421937/frameset.htm).
- They must be released for extractions via ODP – This applies only to those created by customers, since those delivered by SAP/their partners are automatically released.
   - [1560241 - To release DataSources for ODP API](https://launchpad.support.sap.com/#/notes/1560241) – This should be combined w/ running the following programs:
      - RODPS_OS_EXPOSE to release DataSources for external use.
      - BS_ANLY_DS_RELEASE_ODP to release BW extractors for ODP API.
   - [2232584 - To release SAP extractors for ODP API](https://launchpad.support.sap.com/#/notes/2232584) – This contains a list of all SAP-delivered DataSources (7400+) that have been released.

### SLT configurations

SLT is a database trigger-enabled CDC solution that can replicate SAP application tables and simple views in near real time from SAP source systems to various targets, including ODQ, such that it can be used as a proxy in data extractions via ODP.  It can be installed on SAP source systems as Data Migration Server (DMIS) add-on or on a standalone replication server.  In order to use SLT replication server as a proxy, complete the following steps:
- Install at least NetWeaver 7.4 SPS04 release and DMIS 2011 SP05 add-on on your replication server, see [Transferring Data from SLT Using Operational Data Provisioning](https://help.sap.com/docs/SAP_NETWEAVER_750/ccc9cdbdc6cd4eceaf1e5485b1bf8f4b/6ca2eb9870c049159de25831d3269f3f.html).
- Run LTRC transaction code on your replication server to configure SLT.
   - In the Specify Source System section, specify the RFC destination representing your SAP source system.
   - In the Specify Target System section:
      - Select the RFC Connection radio button. 
      - Select Operational Data Provisioning (ODP) in the Scenario for RFC Communication dropdown menu.
      - For the Queue Alias property, enter your queue alias that can be used to select the context of your data extractions via ODP in ADF as SLT~<_your queue alias_>.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-slt-configurations.png" alt-text="Screenshot of the SAP SLT configuration dialog."::: 

For more info on SLT configurations, see [Replicating Data to SAP Business Warehouse](https://help.sap.com/docs/SAP_LANDSCAPE_TRANSFORMATION_REPLICATION_SERVER/969cf5258b964a5ba56380da648ac84e/737e69568fb4c359e10000000a441470.html).

### Known issues

Here are SAP support notes to resolve known issues on SAP systems:
- [1660374 - To extend timeout when fetching large data sets via ODP](https://launchpad.support.sap.com/#/notes/1660374).
- [2321589 - To resolve non-existing Business Add-In (BAdI) for RSODP_ODATA subscriber type](https://launchpad.support.sap.com/#/notes/2321589).
- [2636663 - To resolve inconsistent database trigger status in SLT when extracting and replicating the same SAP application table](https://launchpad.support.sap.com/#/notes/2636663).
- [3038236 - To resolve CDS view extractions that fail to populate ODQ](https://launchpad.support.sap.com/#/notes/3038236).
- [3076927 - To remove unsupported callbacks when extracting from SAP BW or BW/4HANA](https://launchpad.support.sap.com/#/notes/3076927).

### Validation

To validate your SAP system configurations for ODP, you can run RODPS_REPL_TEST program to test the extraction of your SAPI extractors, CDS views, BW objects, etc., see [Replication test with RODPS_REPL_TEST](https://wiki.scn.sap.com/wiki/display/BI/Replication+test+with+RODPS_REPL_TEST).

## Next steps

[Prepare the SHIR with the SAP ODP connector](sap-change-data-capture-shir-preparation.md).