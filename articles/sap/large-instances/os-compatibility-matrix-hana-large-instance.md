---
title: Operating system compatibility matrix for SAP HANA (Large Instances)| Microsoft Docs
description: The compatibility matrix represents the compatibility of different versions of operating system with different hardware types (Large Instances).
services: virtual-machines-linux
documentationcenter:
author: lauradolan
manager: hrushib
editor:
ms.service: sap-on-azure
ms.subservice: sap-large-instances
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/18/2021
ms.author: ladolan
ms.custom: H1Hack27Feb2017

---
# Compatible operating systems for HANA Large Instances

## HANA Large Instance Type I     
  | Operating System | Availability        | SKUs                                                          |
  |------------------|---------------------|---------------------------------------------------------------|
  | SLES 12 SP2      | Not offered anymore | S72, S72m, S96, S144, S144m, S192, S192m, S192xm              |
  | SLES 12 SP3      | Available           | S72, S72m, S96, S144, S144m, S192, S192m, S192xm              |
  | SLES 12 SP4      | Available           | S72, S72m, S96, S144, S144m, S192, S192m, S192xm, S224, S224m |
  | SLES 12 SP5      | Available           | S72, S72m, S96, S144, S144m, S192, S192m, S192xm, S224, S224m |
  | SLES 15 SP1      | Available           | S72, S72m, S96, S144, S144m, S192, S192m, S192xm, S224, S224m |
  | RHEL 7.6         | Available           | S72, S72m, S96, S144, S144m, S192, S192m, S192xm, S224, S224m |

  
### Persistent memory SKUs

  | Operating System | Availability | SKUs                             |
  |------------------|--------------|----------------------------------|
  | SLES 12 SP4      | Available    | S224oo, S224om, S224ooo, S224oom |
  
## HANA Large Instance Type II     
  |  Operating System       | Availability        | SKUs                                                                     |
  |-------------------------|---------------------|--------------------------------------------------------------------------|
  | SLES 12 SP2             | Not offered anymore | S384, S384m, S384xm, S384xxm, S576m, S576xm, S768m, S768xm, S960m        |
  | SLES 12 SP3             | Available           | S384, S384m, S384xm, S384xxm, S576m, S576xm, S768m, S768xm, S960m        |
  | SLES 12 SP4             | Available           | S384, S384m, S384xm, S384xxm, S576m, S576xm, S768m, S768xm, S960m        |
  | SLES 12 SP5             | Available           | S384, S384m, S384xm, S384xxm, S576m, S576xm, S768m, S768xm, S896m, S960m |
  | SLES 15 SP1             | Available           | S384, S384m, S384xm, S384xxm, S576m, S576xm, S768m, S768xm, S896m, S960m |
  | RHEL 7.6                | Available           | S384, S384m, S384xm, S384xxm, S576m, S576xm, S768m, S768xm, S896m, S960m |
  | RHEL 7.9                | Available           | S384, S384m, S384xm, S384xxm, S576m, S576xm, S768m, S768xm, S896m, S960m |

## Next steps

Learn more about:

- [Available SKUs](hana-available-skus.md)
- [Upgrading the operating system](os-upgrade-hana-large-instance.md)
- [Supported scenarios for HANA Large Instances](hana-supported-scenario.md)
  
