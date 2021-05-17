---
title: Azure AD Connect cloud sync FAQ
description: This document describes frequently asked questions for cloud sync.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 06/25/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---
# Azure Active Directory Connect cloud sync FAQ

Read about frequently asked questions for Azure Active Directory (Azure AD) Connect cloud sync.

## General installation

**Q: How often does cloud sync run?**

Cloud provisioning is scheduled to run every 2 mins. Every 2 mins, any user, group and password hash changes will be provisioned to Azure AD.

**Q: Seeing password hash sync failures on the first run. Why?**

This is expected. The failures are due to the user object not present in Azure AD. Once the user is provisioned to Azure AD, password hashes should provisioning in the subsequent run. Wait for a couple of runs and confirm that password hash sync no longer has the errors.

**Q: What happens if the Active Directory instance has attributes that are not supported by cloud sync (for instance, directory extensions)?**

Cloud provisioning will run and provision the supported attributes. The unsupported attributes will not be provisioned to Azure AD. Review the directory extensions in Active Directory and ensure that you don't need those attributes to flow to Azure AD. If one or more attributes are required, consider using Azure AD Connect sync or moving the required information to one of the supported attributes (for instance, extension attributes 1-15).

**Q: What's the difference between Azure AD Connect sync and cloud sync?**

With Azure AD Connect sync, provisioning runs on the on-premises sync server. Configuration is stored on the on-premises sync server. With Azure AD Connect cloud sync, the provisioning configuration is stored in the cloud and runs in the cloud as part of the Azure AD provisioning service. 

**Q: Can I use cloud sync to sync from multiple Active Directory forests?**

Yes. Cloud provisioning can be used to sync from multiple Active Directory forests. In the multi-forest environment, all the references (example, manager) need to be within the domain.  

**Q: How is the agent updated?**

The agents are auto upgraded by Microsoft. For the IT team, this reduces the burden of having to test and validate new agent versions. 

**Q: Can I disable auto upgrade?**

There is no supported way to disable auto upgrade.

**Q: Can I change the source anchor for cloud sync?**

By default, cloud sync uses ms-ds-consistency-GUID with a fallback to ObjectGUID as source anchor. There is no supported way to change the source anchor.

**Q: I see new service principals with the AD domain name(s) when using cloud sync. Is it expected?**

Yes, cloud sync creates a service principal for the provisioning configuration with the domain name as the service principal name. Do not make any changes to the service principal configuration.

**Q: What happens when a synced user is required to change password on next logon?**

If password hash sync is enabled in cloud sync and the synced user is required to change password on next logon in on-premises AD, cloud sync does not provision the "to-be-changed" password hash to Azure AD. Once the user changes the password, the user password hash is provisioned from AD to Azure AD.

**Q: Does cloud sync support writeback of ms-ds-consistencyGUID for any object?**

No, cloud sync does not support writeback of ms-ds-consistencyGUID for any object (including user objects). 

**Q: I am provisioning users using cloud sync. I deleted the configuration. Why do I still see the old synced objects in Azure AD?** 

When you delete the configuration, cloud sync does not automatically remove the synced objects in Azure AD. To ensure you do not have the old objects, change the scope of the configuration to an empty group or Organizational Units. Once the provisioning runs and cleans up the objects, disable and delete the  configuration. 

**Q:  What does it mean that Exchange hybrid is not supported?**

The Exchange Hybrid Deployment feature allows for the co-existence of Exchange mailboxes both on-premises and in Microsoft 365. Azure AD Connect is synchronizing a specific set of attributes from Azure AD back into your on-premises directory.  The cloud provisioning agent currently does not synchronize these attributes back into your on-premises directory and thus it is not supported as a replacement for Azure AD Connect.

**Q:  Can I install the cloud provisioning agent on Windows Server Core?**

No, installing the agent on server core is not supported.

**Q:  Can I use a staging server with the cloud provisioning agent?**

No, staging servers are not supported.

**Q:  Can I synchronize Guest user accounts?**

No, synchronizing guest user accounts is not supported.

**Q:  If I move a user from an OU that is scoped for cloud sync to an OU that is scoped for Azure AD Connect, what happens?**

The user will be deleted and re-created.  Moving a user from an OU that is scoped for cloud sync will be viewed as a delete operation.  If the user is moved to an OU that is managed by Azure AD Connect, it will be re-provisioned to Azure AD and a new user created.

**Q:  If I rename or move the OU that is in scope for the cloud sync filter, what happens to the user that were created in Azure AD?**

Nothing.  The users will not be deleted if the OU is renamed or moved.

**Q:  Does Azure AD Connect cloud sync support large groups?**

Yes. Today we support up to 50K group members synchronized using the OU scope filtering. At the same time, when you use the group scope filtering, we recommend that you keep your group size to less than 1500 members. The reason for this is that even though you can sync a large group as part of group scoping filter, when you add members to that group by batches of greater than 1500, the delta synchronization will fail. 

## Next steps 

- [What is provisioning?](what-is-provisioning.md)
- [What is Azure AD Connect cloud sync?](what-is-cloud-sync.md)
