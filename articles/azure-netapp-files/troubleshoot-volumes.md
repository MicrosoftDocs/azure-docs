---
title: Troubleshoot volume errors for Azure NetApp Files | Microsoft Docs
description: Describes error messages and resolutions that can help you troubleshoot Azure NetApp Files volumes.
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
ms.topic: troubleshooting
ms.date: 08/15/2021
ms.author: b-juche
---
# Troubleshoot volume errors for Azure NetApp Files

This article describes error messages and resolutions that can help you troubleshoot Azure NetApp Files volumes. 

## Errors for volume allocation 

When you create a new volume or resize an existing volume in Azure NetApp Files, Microsoft Azure allocates storage and networking resources to your subscription. You might occasionally experience resource allocation failures because of unprecedented growth in demand for Azure services in specific regions.

This section explains the causes of some of the common allocation failures and suggests possible remedies.

|     Error conditions    |     Resolutions    |
|-|-|
|Error when creating new volumes or resizing existing volumes. <br> Error message: `There was a problem locating [or extending] storage  for the volume. Please retry the operation. If the problem persists, contact Support.` | The error indicates that the service ran into an error when attempting to allocate resources for this request. <br> Retry the operation after some time. Contact Support if the issue persists.|
|Out of storage or networking capacity in a region for regular volumes. <br> Error message: `There are currently insufficient resources available to create [or extend] a volume in this region. Please retry the operation. If the problem persists, contact Support.` | The error indicates that there are insufficient resources available in the region to create or resize volumes. <br> Try one of the following workarounds: <ul><li>Create the volume under a new VNet. Doing so will avoid hitting networking related resource limits.</li> <li>Retry after some time. Resources may have been freed in the cluster, region, or zone in the interim.</li></ul> |
|Out of storage capacity when creating a volume with network features set to `Standard`. <br> Error message: `No storage available with Standard network features, for the provided VNet.` | The error indicates that there are insufficient resources available in the region to create volumes with `Standard` networking features. <br> Try one of the following workarounds: <ul><li>If `Standard` network features are not required, create the volume with `Basic` network features.</li> <li>Try creating the volume under a new VNet. Doing so will avoid hitting networking related resource limits</li><li>Retry after some time.  Resources may have been freed in the cluster, region, or zone in the interim.</li></ul> |

## Next steps  

* [Create an NFS volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
* [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md) 
* [Create a dual-protocol volume for Azure NetApp Files](create-volumes-dual-protocol.md) 
* [Configure network features for a volume](configure-network-features.md)
