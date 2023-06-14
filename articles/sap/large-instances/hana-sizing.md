---
title: Sizing of SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Learn about sizing of SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: lauradolan
manager: bburns
editor: ''
ms.service: sap-on-azure
ms.subservice: sap-large-instances
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 07/16/2021
ms.author: ladolan
ms.custom: H1Hack27Feb2017

---
# Sizing

In this article, we'll look at information helpful with sizing for HANA Large Instances. In general, sizing for HANA Large Instances is no different than sizing for HANA. 

## Moving an existing system to SAP HANA (Large Instances)

Let's say you want to move an existing deployed system from another relational database management system (RDBMS) to HANA. SAP provides reports to run on your existing SAP system. If the database is moved to HANA, these reports check the data and calculate memory requirements for the HANA instance. 

For more information on how to run these reports and obtain their most recent patches or versions, read the following SAP Notes:

- [SAP Note #1793345 - Sizing for SAP Suite on HANA](https://launchpad.support.sap.com/#/notes/1793345)
- [SAP Note #1872170 - Suite on HANA and S/4 HANA sizing report](https://launchpad.support.sap.com/#/notes/1872170)
- [SAP Note #2121330 - FAQ: SAP BW on HANA sizing report](https://launchpad.support.sap.com/#/notes/2121330)
- [SAP Note #1736976 - Sizing report for BW on HANA](https://launchpad.support.sap.com/#/notes/1736976)
- [SAP Note #2296290 - New sizing report for BW on HANA](https://launchpad.support.sap.com/#/notes/2296290)

## Sizing greenfield implementations

When you're starting an implementation from scratch, SAP Quick Sizer will calculate memory requirements of the implementation of SAP software on top of HANA.

## Memory requirements

Memory requirements for HANA increase as data volume grows. Be aware of your current memory consumption to help you predict what it's going to be in the future. Based on memory requirements, you then can map your demand into one of the HANA Large Instance SKUs.

## Next steps

Learn about onboarding requirements for HANA Large Instances.

> [!div class="nextstepaction"]
> [Onboarding requirements](hana-onboarding-requirements.md)
