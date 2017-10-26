---
title: Microsoft Azure certifications for SAP | Microsoft Docs
description: Updated list of current configurations and certifications of SAP on the Azure platform.
services: virtual-machines-linux
documentationcenter: ''
author: RicksterCDN
manager: timlt
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 10/12/2017
ms.author: rclaus
ms.custom: 

---
# SAP certifications and configurations running on Microsoft Azure

SAP and Microsoft have a long history of working together in a strong partnership that has mutual benefits for their customers. Microsoft is constantly updating its platform and submitting new certification details to SAP in order to ensure Microsoft Azure is the best platform on which to run your SAP workloads. The following tables outline our supported configurations and list of growing certifications. 

## SAP HANA certifications
References:

- [SAP Note 2316233 - SAP HANA on Microsoft Azure (Large Instances)](https://launchpad.support.sap.com/#/notes/2316233) covering HANA Large Instances regarding SAP HANA support.
- [SAP HANA certified IaaS platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Amazon%20Web%20Services%2CMicrosoft%20Azure) for SAP HANA support for native Azure VMs.

| SAP Product | Supported OS | Azure Offerings |
| --- | --- | --- |
| SAP HANA Developer Edition (including the HANA client software comprised of SQLODBC, ODBO-Windows only, ODBC, JDBC drivers, HANA studio, and HANA database) | Red Hat Enterprise Linux, SUSE Linux Enterprise | D-Series VM family |
| Business One on HANA | SUSE Linux Enterprise | DS14_v2 |
| SAP S/4 HANA |Red Hat Enterprise Linux, SUSE Linux Enterprise | Controlled Availability for GS5, SAP HANA on Azure (Large instances) |
| Suite on HANA, OLTP | Red Hat Enterprise Linux, SUSE Linux Enterprise | GS5 for single node deployments for non-production scenarios, SAP HANA on Azure (Large instances) |
| HANA Enterprise for BW, OLAP | Red Hat Enterprise Linux, SUSE Linux Enterprise | GS5 for single node deployments, SAP HANA on Azure (Large instances) |
| SAP BW/4 HANA | Red Hat Enterprise Linux, SUSE Linux Enterprise | GS5 for single node deployments, SAP HANA on Azure (Large instances) |

## SAP NetWeaver certifications
Microsoft Azure is certified for the following SAP products, with full support from Microsoft and SAP.
References:

- [1928533 - SAP Applications on Azure: Supported Products and Azure VM types](https://launchpad.support.sap.com/#/notes/1928533) for all SAP NetWeaver based applications, including SAP TREX, SAP LiveCache and SAP Content Server. And all databases, excluding SAP HANA.


| SAP Product | Guest OS | RDBMS | Virtual Machine Types |
| --- | --- | --- | --- |
| SAP Business Suite Software |Windows, SUSE Linux Enterprise, Red Hat Enterprise Linux, Oracle Linux |SQL Server, Oracle (Windows and Oracle Linux only), DB2, SAP ASE |A5 to A11, D11 to D14, DS11 to DS14, DS11_v2 to DS15_v2, GS1 to GS5, M-Series |
| SAP Business All-in-One |Windows, SUSE Linux Enterprise, Red Hat Enterprise Linux |SQL Server, Oracle (Windows and Oracle Linux only), DB2, SAP ASE |A5 to A11, D11 to D14, DS11 to DS14, DS11_v2 to DS15_v2, GS1 to GS5, M-Series |
| SAP BusinessObjects BI |Windows |N/A |A5 to A11, D11 to D14, DS11 to DS14, DS11_v2 to DS15_v2, GS1 to GS5, M-Series |
| SAP NetWeaver |Windows, SUSE Linux Enterprise, Red Hat Enterprise Linux |SQL Server, Oracle (Windows and Oracle Linux only), DB2, SAP ASE |A5 to A11, D11 to D14, DS11 to DS14, DS11_v2 to DS15_v2, GS1 to GS5, M-Series |

## Other SAP Workload supported on Azure

| SAP Product | Guest OS | RDBMS | Virtual Machine Types |
| --- | --- | --- | --- |
| SAP Business One on SQL Server | Windows  | SQL Server | All NetWeaver certified VM types |
| SAP BPC 10.01 MS SP08 | Windows | | All NetWeaver Certified VM types<br /> SAP Note #2451795 |
| SAP Business Objects BI platform | Windows | | SAP Note #2145537 |
| SAP Data Services 4.2 | | | SAP Note #2288344 |
