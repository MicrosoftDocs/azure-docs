---
title: include file
description: include file
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: include
ms.date: 11/07/2023
ms.author: anfdocs
ms.custom: include file

# azure-netapp-files-create-volumes-smb.md
# enable-continuous-availability-existing-SMB.md
---

>[!IMPORTANT]
>Using SMB Continuous Availability shares for workloads other than Citrix App Layering, SQL Server, FSLogix user profile containers including FSLogix ODFC containers, or MSIX app attach containers is *not* supported. This feature is currently supported on Windows SQL Server. Linux SQL Server is not currently supported.
>
> If you are using a non-administrator (domain) account to install SQL Server, ensure the account has the required security privilege assigned. If the domain account does not have the required security privilege (`SeSecurityPrivilege`), and the privilege cannot be set at the domain level, you can grant the privilege to the account by using the Security privilege users field of Active Directory connections. For more information, see [Create an Active Directory connection](create-active-directory-connections.md#create-an-active-directory-connection).

>[!IMPORTANT]
>Change notifications are not supported with Continuously Available shares in Azure NetApp Files.