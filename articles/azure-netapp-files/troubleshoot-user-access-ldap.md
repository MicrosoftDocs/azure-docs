---
title: Troubleshoot user access on LDAP volumes | Microsoft Docs
description: Describes the steps for troubleshooting user access on LDAP-enabled volumes.  
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: troubleshooting
ms.date: 09/06/2023
ms.author: anfdocs
---

# Troubleshoot user access on LDAP volumes

Azure NetApp Files provides you with the ability to validate user connectivity and access to LDAP-enabled volumes based on group membership. When you provide a user ID, Azure NetApp Files will report a list of primary and auxiliary group IDs that user belongs to from the LDAP server.

Validating user access is helpful for scenarios such as ensuring POSIX attributes set on the LDAP server are accurate or when you encounter permission errors. 

1. In the volume page for the LDAP-enabled volume, select **LDAP Group ID List** under **Support & Troubleshooting**.
1. Enter the user ID and select **Get group IDs**.
    :::image type="content" source="../media/azure-netapp-files/troubleshoot-ldap-user-id.png" alt-text="Screenshot of the LDAP group ID list portal." lightbox="../media/azure-netapp-files/troubleshoot-ldap-user-id.png":::

1. The portal will display up to 256 results even if the user is in more than 256 groups. You can search for a specific group ID in the results. 

Refer to [Troubleshoot volume errors](troubleshoot-volumes.md#errors-for-ldap-volumes) for further resources if the group ID you're searching for is not present. 
