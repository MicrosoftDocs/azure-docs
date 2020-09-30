--- 
title: Azure VMware Solution by CloudSimple - Escalate CloudSimple privileges
description: Describes how to escalate CloudSimple permissions to perform administrative functions in the Private Cloud vCenter
author: sharaths-cs
ms.author: b-shsury 
ms.date: 08/16/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# Escalate CloudSimple privileges to perform administrative functions in Private Cloud vCenter

The CloudSimple privileges approach is designed to give vCenter users the privileges they need to perform normal operations. In some instances, a user may require additional privileges to perform a particular task.  You can escalate privileges of a vCenter SSO user for a limited period.

Reasons for escalating privileges can include the following:

* Configuration of identity sources
* User management
* Deletion of  distributed port group
* Installing vCenter solutions (such as backup apps)
* Creating service accounts

> [!WARNING]
> Actions taken in the escalated privileged state can adversely impact your system and can cause your system to become unavailable. Perform only the necessary actions during the escalation period.

From the CloudSimple portal, [escalate privileges](escalate-private-cloud-privileges.md) for the CloudOwner local user on the vCenter SSO.  You can escalate remote user's privilege only if additional identity provider is configured on vCenter.  Escalation of privileges involves adding the selected user to the vSphere built-in Administrators group.  Only one user can have escalated privileges.  If you need to escalate another user's privileges, first de-escalate the privileges of the current users.

Users from additional identity sources must be added as members of CloudOwner group.

> [!CAUTION]
> New users must be added only to *Cloud-Owner-Group*, *Cloud-Global-Cluster-Admin-Group*, *Cloud-Global-Storage-Admin-Group*, *Cloud-Global-Network-Admin-Group* or, *Cloud-Global-VM-Admin-Group*.  Users added to *Administrators* group will be removed automatically.  Only service accounts must be added to *Administrators* group and service accounts must not be used to sign in to vSphere web UI.

During the escalation period, CloudSimple uses automated monitoring with associated alert notifications to identify any inadvertent changes to the environment.
