---
title: Troubleshoot application volume group errors for Azure NetApp Files | Microsoft Docs
description: Describes error or warning conditions and their resolutions for application volume groups for Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: troubleshooting
ms.date: 11/19/2021
ms.author: anfdocs
---
# Troubleshoot application volume group errors

This article describes errors or warnings you might experience when using application volume groups and suggests possible remedies.

## Errors creating replication  

|     Error Message    |     Resolution    |
|-|-|
| Out of storage capacity when creating a volume group with close proximity to compute. <br> Error message: `No storage available with network locality that matches the provided Proximity Placement Group.`  |  The error indicates that there are insufficient resources available under the user-provided proximity placement group (PPG). <br> You should use the SAP HANA pinning process by using the **[SAP HANA VM pinning request form](https://aka.ms/HANAPINNING)** to ensure that enough resources are available. |
|  Deployment failed with error message: <br> `Template parameter Token type is not valid. Expected 'Integer'. Actual 'Float'.`  |   When application volume group calculates the size, it will show the values for all volumes in the **Volumes** tab. For very small HANA systems, some of the volumes are displayed as floating point values. The deployment will fail if the final size is not an integer GB number. <br> If you look into volume details for these volumes, the floating point values will be rounded automatically to integer to avoid this deployment error. |

## Next steps  

* [Understand Azure NetApp Files application volume group for SAP HANA](application-volume-group-introduction.md)
* [Requirements and considerations for application volume group for SAP HANA](application-volume-group-considerations.md)
* [Deploy the first SAP HANA host using application volume group for SAP HANA](application-volume-group-deploy-first-host.md)
* [Add hosts to a multiple-host SAP HANA system using application volume group for SAP HANA](application-volume-group-add-hosts.md)
* [Add volumes for an SAP HANA system as a secondary database in HSR](application-volume-group-add-volume-secondary.md)
* [Add volumes for an SAP HANA system as a DR system using cross-region replication](application-volume-group-disaster-recovery.md)
* [Manage volumes in an application volume group](application-volume-group-manage-volumes.md)
* [Delete an application volume group](application-volume-group-delete.md)
* [Application volume group FAQs](faq-application-volume-group.md)
