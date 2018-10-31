---
title: Microsoft Azure certifications for SAP | Microsoft Docs
description: Updated list of current configurations and certifications of SAP on the Azure platform.
services: virtual-machines-linux
documentationcenter: ''
author: RicksterCDN
manager: jeconnoc
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 08/27/2018
ms.author: rclaus
ms.custom: 

---
# SAP certifications and configurations running on Microsoft Azure

SAP and Microsoft have a long history of working together in a strong partnership that has mutual benefits for their customers. Microsoft is constantly updating its platform and submitting new certification details to SAP in order to ensure Microsoft Azure is the best platform on which to run your SAP workloads. The following tables outline Azure supported configurations and list of growing SAP certifications. 

## SAP HANA certifications
References:

- [SAP HANA certified IaaS platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure) for SAP HANA support for native Azure VMs and HANA Large Instances.

| SAP Product | Supported OS | Azure Offerings |
| --- | --- | --- |
| SAP HANA Developer Edition (including the HANA client software comprised of SQLODBC, ODBO-Windows only, ODBC, JDBC drivers, HANA studio, and HANA database) | Red Hat Enterprise Linux, SUSE Linux Enterprise | D-Series VM family |
| Business One on HANA | SUSE Linux Enterprise | DS14_v2 <br /> [SAP HANA Certified IaaS Platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure%23SAP%20Business%20One) |
| SAP S/4 HANA | Red Hat Enterprise Linux, SUSE Linux Enterprise | Controlled Availability for GS5. Full support for M64s, M64ms, M128s, M128ms, M64ls, M32ls, M32ts, <br /> SAP HANA on Azure (Large instances) [SAP HANA Certified IaaS Platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure) |
| Suite on HANA, OLTP | Red Hat Enterprise Linux, SUSE Linux Enterprise | M64s, M64ms, M128s, M128ms, M64ls, M32ls, M32ts, SAP HANA on Azure (Large instances) <br /> [SAP HANA Certified IaaS Platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure) |
| HANA Enterprise for BW, OLAP | Red Hat Enterprise Linux, SUSE Linux Enterprise | GS5, M64s, M64ms, M128s, M128ms, M64ls, M32ls, M32ts, <br /> SAP HANA on Azure (Large instances) [SAP HANA Certified IaaS Platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure) |
| SAP BW/4 HANA | Red Hat Enterprise Linux, SUSE Linux Enterprise | GS5, M64s, M64ms, M128s, M128ms, M64ls, M32ls, M32ts, <br /> SAP HANA on Azure (Large instances) <br /> [SAP HANA Certified IaaS Platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure) |

Be aware that SAP uses the term 'clustering' in [SAP HANA Certified IaaS Platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure) as synonym for 'scale-out' and NOT for high availability 'clustering'

## SAP NetWeaver certifications
Microsoft Azure is certified for the following SAP products, with full support from Microsoft and SAP.
References:

- [1928533 - SAP Applications on Azure: Supported Products and Azure VM types](https://launchpad.support.sap.com/#/notes/1928533) for all SAP NetWeaver based applications, including SAP TREX, SAP LiveCache, and SAP Content Server. And all databases, excluding SAP HANA.


| SAP Product | Guest OS | RDBMS | Virtual Machine Types |
| --- | --- | --- | --- |
| SAP Business Suite Software | Windows, SUSE Linux Enterprise, Red Hat Enterprise Linux, Oracle Linux |SQL Server, Oracle (Windows and Oracle Linux only), DB2, SAP ASE |A5 to A11, D11 to D14, DS11 to DS14, DS11_v2 to DS15_v2, GS1 to GS5, D2s_v3 to D64s_v3, E2s_v3 to E64s_v3, M64s, M64ms, M128s, M128ms, M64ls, M32ls, M32ts |
| SAP Business All-in-One | Windows, SUSE Linux Enterprise, Red Hat Enterprise Linux, Oracle Linux |SQL Server, Oracle (Windows and Oracle Linux only), DB2, SAP ASE |A5 to A11, D11 to D14, DS11 to DS14, DS11_v2 to DS15_v2, GS1 to GS5, D2s_v3 to D64s_v3, E2s_v3 to E64s_v3, M64s, M64ms, M128s, M128ms, M64ls, M32ls, M32ts |
| SAP BusinessObjects BI | Windows |N/A |A5 to A11, D11 to D14, DS11 to DS14, DS11_v2 to DS15_v2, GS1 to GS5, D2s_v3 to D64s_v3, E2s_v3 to E64s_v3, M64s, M64ms, M128s, M128ms, M64ls, M32ls, M32ts |
| SAP NetWeaver | Windows, SUSE Linux Enterprise, Red Hat Enterprise Linux, Oracle Linux |SQL Server, Oracle (Windows and Oracle Linux only), DB2, SAP ASE |A5 to A11, D11 to D14, DS11 to DS14, DS11_v2 to DS15_v2, GS1 to GS5, D2s_v3 to D64s_v3, E2s_v3 to E64s_v3, M64s, M64ms, M128s, M128ms, M64ls, M32ls, M32ts |

## Other SAP Workload supported on Azure

| SAP Product | Guest OS | RDBMS | Virtual Machine Types |
| --- | --- | --- | --- |
| SAP Business One on SQL Server | Windows  | SQL Server | All NetWeaver certified VM types<br /> [SAP Note #928839](https://launchpad.support.sap.com/#/notes/928839) |
| SAP BPC 10.01 MS SP08 | Windows and Linux | | All NetWeaver Certified VM types<br /> SAP Note #2451795 |
| SAP Business Objects BI platform | Windows and Linux | | SAP Note #2145537 |
| SAP Data Services 4.2 | | | SAP Note #2288344 |
| SAP Hybris Commerce Platform 5.x and 6.x | Windows | SQL Server, Oracle | All NetWeaver certified VM types<br /> [Hybris Wiki](https://wiki.hybris.com/display/SUP/Using+the+hybris+Platform+with+the+Cloud) |
