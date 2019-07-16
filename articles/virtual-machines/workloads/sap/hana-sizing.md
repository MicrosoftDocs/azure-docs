---
title: Sizing of SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Sizing of SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: RicksterCDN
manager: gwallace
editor: ''

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/04/2018
ms.author: saghorpa
ms.custom: H1Hack27Feb2017

---
# Sizing

Sizing for HANA Large Instance is no different than sizing for HANA in general. For existing and deployed systems that you want to move from other RDBMS to HANA, SAP provides a number of reports that run on your existing SAP systems. If the database is moved to HANA, these reports check the data and calculate memory requirements for the HANA instance. For more information on how to run these reports and obtain their most recent patches or versions, read the following SAP Notes:

- [SAP Note #1793345 - Sizing for SAP Suite on HANA](https://launchpad.support.sap.com/#/notes/1793345)
- [SAP Note #1872170 - Suite on HANA and S/4 HANA sizing report](https://launchpad.support.sap.com/#/notes/1872170)
- [SAP Note #2121330 - FAQ: SAP BW on HANA sizing report](https://launchpad.support.sap.com/#/notes/2121330)
- [SAP Note #1736976 - Sizing report for BW on HANA](https://launchpad.support.sap.com/#/notes/1736976)
- [SAP Note #2296290 - New sizing report for BW on HANA](https://launchpad.support.sap.com/#/notes/2296290)

For green field implementations, SAP Quick Sizer is available to calculate memory requirements of the implementation of SAP software on top of HANA.

Memory requirements for HANA increase as data volume grows. Be aware of your current memory consumption to help you predict what it's going to be in the future. Based on memory requirements, you then can map your demand into one of the HANA Large Instance SKUs.

**Next steps**
- Refer [Onboarding requirements](hana-onboarding-requirements.md)