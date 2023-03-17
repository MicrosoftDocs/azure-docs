---
title: Microsoft Azure certifications for SAP | Microsoft Docs
description: Updated list of current configurations and certifications of SAP on the Azure platform.
services: virtual-machines-linux
documentationcenter: ''
author: msjuergent
manager: bburns
editor: ''
tags: azure-resource-manager
keywords: ''
ms.assetid: 
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 01/25/2022
ms.author: juergent
ms.custom: 

---
# SAP certifications and configurations running on Microsoft Azure

SAP and Microsoft have a long history of working together in a strong partnership that has mutual benefits for their customers. Microsoft is constantly updating its platform and submitting new certification details to SAP in order to ensure Microsoft Azure is the best platform on which to run your SAP workloads. The following tables outline Azure supported configurations and list of growing SAP certifications. This list is an overview list that might deviate here and there from the official SAP lists. How to get to the detailed data is documented in the article [What SAP software is supported for Azure deployments](./supported-product-on-azure.md)

## SAP HANA certifications
References:

- [SAP HANA certified IaaS platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure) for SAP HANA support for native Azure VMs and HANA Large Instances.

| SAP Product | Supported OS | Azure Offerings |
| --- | --- | --- |
| Business One on HANA | SUSE Linux Enterprise | [SAP HANA Certified IaaS Platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=iaas;ve:24;v:120) |
| SAP S/4 HANA | Red Hat Enterprise Linux, SUSE Linux Enterprise | [SAP HANA Certified IaaS Platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=iaas;ve:24) |
| Suite on HANA, OLTP | Red Hat Enterprise Linux, SUSE Linux Enterprise | [SAP HANA Certified IaaS Platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=iaas;ve:24;v:125) |
| HANA Enterprise for BW, OLAP | Red Hat Enterprise Linux, SUSE Linux Enterprise | [SAP HANA Certified IaaS Platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=iaas;ve:24;v:105) |
| SAP BW/4 HANA | Red Hat Enterprise Linux, SUSE Linux Enterprise | [SAP HANA Certified IaaS Platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=iaas;ve:24;v:105) |


## SAP NetWeaver certifications
Microsoft Azure is certified for the following SAP products, with full support from Microsoft and SAP.
References:

- [1928533 - SAP Applications on Azure: Supported Products and Azure VM types](https://launchpad.support.sap.com/#/notes/1928533) for all SAP NetWeaver based applications, including SAP TREX, SAP LiveCache, and SAP Content Server. And all databases, excluding SAP HANA.


| SAP Product | Guest OS | RDBMS | Virtual Machine Types |
| --- | --- | --- | --- |
| SAP Business Suite Software | Windows, SUSE Linux Enterprise, Red Hat Enterprise Linux, Oracle Linux |SQL Server, Oracle (Windows and Oracle Linux only), DB2, SAP ASE | [1928533 - SAP Applications on Azure: Supported Products and Azure VM types](https://launchpad.support.sap.com/#/notes/1928533) |
| SAP Business All-in-One | Windows, SUSE Linux Enterprise, Red Hat Enterprise Linux, Oracle Linux |SQL Server, Oracle (Windows and Oracle Linux only), DB2, SAP ASE | [1928533 - SAP Applications on Azure: Supported Products and Azure VM types](https://launchpad.support.sap.com/#/notes/1928533)|
| SAP BusinessObjects BI | Windows |N/A | [1928533 - SAP Applications on Azure: Supported Products and Azure VM types](https://launchpad.support.sap.com/#/notes/1928533) |
| SAP NetWeaver | Windows, SUSE Linux Enterprise, Red Hat Enterprise Linux, Oracle Linux |SQL Server, Oracle (Windows and Oracle Linux only), DB2, SAP ASE | [1928533 - SAP Applications on Azure: Supported Products and Azure VM types](https://launchpad.support.sap.com/#/notes/1928533) |

## Other SAP Workload supported on Azure

| SAP Product | Guest OS | RDBMS | Virtual Machine Types |
| --- | --- | --- | --- |
| SAP Business One on SQL Server | Windows  | SQL Server | All NetWeaver certified VM types<br /> [SAP Note #928839](https://launchpad.support.sap.com/#/notes/928839) |
| SAP BPC 10.01 MS SP08 | Windows and Linux | | All NetWeaver Certified VM types<br /> SAP Note #2451795 |
| SAP Business Objects BI platform | Windows and Linux | | SAP Note #2145537 |
| SAP Data Services 4.2 | | | SAP Note #2288344 |
| SAP Hybris Commerce Platform  | Windows | SQL Server, Oracle | All NetWeaver certified VM types <br /> [Hybris Documentation](https://help.sap.com/viewer/a74589c3a81a4a95bf51d87258c0ab15/6.7.0.0/en-US/8c71300f866910149b40c88dfc0de431.html) |
| SAP Hybris Commerce Platform  | SLES 12 or more recent | SAP HANA | All NetWeaver certified VM types <br /> [Hybris Documentation](https://help.sap.com/viewer/a74589c3a81a4a95bf51d87258c0ab15/6.7.0.0/en-US/8c71300f866910149b40c88dfc0de431.html) |
| SAP Hybris Commerce Platform  | RHEL 7 or more recent | SAP HANA | All NetWeaver certified VM types <br /> [Hybris Documentation]https://help.sap.com/viewer/a74589c3a81a4a95bf51d87258c0ab15/6.7.0.0/en-US/8c71300f866910149b40c88dfc0de431.html) |
| SAP (Hybris) Commerce Platform 1811 and later  | Windows, SLES, or RHEL | SQL Azure DB | All NetWeaver certified VM types <br /> [Hybris Documentation](https://help.sap.com/viewer/a74589c3a81a4a95bf51d87258c0ab15/1811/en-US/8c71300f866910149b40c88dfc0de431.html) |
