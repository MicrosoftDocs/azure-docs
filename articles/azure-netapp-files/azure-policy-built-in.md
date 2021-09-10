---
title: Azure Policy built-in definitions for Azure NetApp Files | Microsoft Docs
description: Describes the Azure Policy built-in definitions that you can use with Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 10/01/2021
ms.author: b-juche
---
# Azure Policy built-in definitions for Azure NetApp Files 

The Azure Policy built-in definitions for Azure NetApp Files enable organization admins to restrict creation of unsecure volumes or audit existing volumes.  

Two [effects of Azure Policy](../governance/policy/concepts/effects.md) can be used with Azure NetApp Files:

* *Deny* creation of non-compliant volumes
* *Audit* existing volumes for compliance

The following Azure Policy built-in definitions are available for use with Azure NetApp Files:

* *Azure NetApp Files volumes should not use NFSv3 protocol type.*   
    This policy definition disallows the use of the NFSv3 protocol type to prevent unsecure access to volumes. NFSv4.1 with Kerberos protocol should be used to access NFS volumes to ensure data integrity and encryption.
 
* *Azure NetApp Files volumes of type NFSv4.1 should use Kerberos data encryption.*   
    This policy definition allows only the use of Kerberos privacy (`5p`) security mode to ensure that data is encrypted.
 
* *Azure NetApp Files volumes of type NFSv4.1 should use Kerberos data integrity or data privacy.*   
    This policy definition ensures that either Kerberos integrity (`5i`) or Kerberos privacy (`5p`) is selected to ensure data integrity and data privacy.

To learn how to assign a policy to resources and view compliance report, see [Assign the Policy](/azure/storage/common/transport-layer-security-configure-minimum-version?toc=%2Fazure%2Fgovernance%2Fpolicy%2Ftoc.json&bc=%2Fazure%2Fgovernance%2Fpolicy%2Fbreadcrumb%2Ftoc.json&tabs=portal#assign-the-policy) in [Azure Policy documentation](/azure/governance/policy/).

## Next steps

* [Azure Policy documentation](/azure/governance/policy/)
