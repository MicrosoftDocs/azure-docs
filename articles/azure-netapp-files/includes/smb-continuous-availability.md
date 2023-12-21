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

You should enable Continuous Availability for the following workloads/use cases only:

* [Citrix App Layering](https://docs.citrix.com/en-us/citrix-app-layering/4.html)
* [FSLogix user profile containers](../../virtual-desktop/create-fslogix-profile-container.md), including [FSLogix ODFC containers](/fslogix/concepts-container-types#odfc-container)
* [MSIX app attach with Azure Virtual Desktop](../../virtual-desktop/create-netapp-files.md)
    * When using MSIX applications with the `CIM FS` file format:
        * The number of AVD session hosts per volume shouldn't exceed 500.
        * The number of MSIX applications per volume shouldn't exceed 40.
    * When using MSIX applications with the `VHDX` file format:
        * The number of AVD session hosts per volume shouldn't exceed 500.
        * The number of MSIX applications per volume shouldn't exceed 60.
    * When using a combination of MSIX applications with both the `VHDX` and `CIM FS` file formats:
        * The number of AVD session hosts per volume shouldn't exceed 500.
        * The number of MSIX applications per volume using the `CIM FS` file format shouldn't exceed 24.
        * The number of MSIX applications per volume using the `VHDX` file format shouldn't exceed 24.
* SQL Server
    * Continuous Availability is currently supported on Windows SQL Server.
    * Linux SQL Server is not currently supported.

>[!IMPORTANT]
>Using SMB Continuous Availability shares is only supported for Citrix App Layering, SQL Server, FSLogix user profile containers including FSLogix ODFC containers, or MSIX app attach containers. This feature is currently supported on SQL Server on Windows. Any other workload is not supported.
>
> If you are using a non-administrator (domain) account to install SQL Server, ensure the account has the required security privilege assigned. If the domain account does not have the required security privilege (`SeSecurityPrivilege`), and the privilege cannot be set at the domain level, you can grant the privilege to the account by using the Security privilege users field of Active Directory connections. For more information, see [Create an Active Directory connection](../create-active-directory-connections.md#create-an-active-directory-connection).

>[!IMPORTANT]
>Change notifications are not supported with Continuously Available shares in Azure NetApp Files.