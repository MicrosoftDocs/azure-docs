---
title: Azure AD Connect cloud provisioning FAQ
description: This document describes frequently asked questions for cloud provisioning.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 12/02/2019
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---
# Azure Active Directory Connect FAQ

Read about frequently asked questions for Azure Active Directory (Azure AD) Connect cloud provisioning.

## General installation

**Q: How often does cloud provisioning run?**

Cloud provisioning is scheduled to run every 2 mins. Every 2 mins, any user, group and password hash changes will be provisioned to Azure AD.

**Q: Seeing password hash sync failures on the first run. Why?**

This is expected. The failures are due to the user object not present in Azure AD. Once the user is provisioned to Azure AD, password hashes should provisioning in the subsequent run. Wait for a couple of runs and confirm that password hash sync no longer has the errors.

**Q: What's the difference between Azure AD Connect sync and cloud provisioning?**

With Azure AD Connect sync, provisioning runs on the on-premises sync server. Configuration is stored on the on-premises sync server. With Azure AD Connect cloud provisioning, the provisioning configuration is stored in the cloud and runs in the cloud as part of the Azure AD provisioning service. 

**Q: Can I use cloud provisioning to sync from multiple Active Directory forests?**

Yes. Cloud provisioning can be used to sync from multiple Active Directory forests. In the multi-forest environment, all the references (example, manager) need to be within the domain.  

**Q: How is the agent updated?**

The agents are auto upgraded by Microsoft. For the IT team, this reduces the burden of having to test and validate new agent versions. 

**Q: Can I disable auto upgrade?**

There is no supported way to disable auto upgrade.

**Q: Can I change the source anchor for cloud provisioning?**

By default, cloud provisioning uses ms-ds-consistency-GUID with a fallback to ObjectGUID as source anchor. There is no supported way to change the source anchor.

**Q: I see new service principals with the AD domain name(s) when using cloud provisioning. Is it expected?**

Yes, cloud provisioning creates a service principal for the provisioning configuration with the domain name as the service principal name. Do not make any changes to the service principal configuration.

**Q: What happens when a synced user is required to change password on next logon?**

If password hash sync is enabled in cloud provisioning and the synced user is required to change password on next logon in on-premises AD, cloud provisioning does not provision the to be changed password hash to Azure AD. Once the user changes the password, the user password hash is provisioned from AD to Azure AD.

**Q: Does cloud provisioning support writeback of ms-ds-consistencyGUID for any object?**

No, cloud provisioning does not support writeback of ms-ds-consistencyGUID for any object (including user objects). 

**Q: I am provisioning users using cloud provisioning. I deleted the configuration. Why do I still see the old synced objects in Azure AD?** 

When you delete the configuration, cloud provisioning does not cleanup the synced objects in Azure AD. To ensure you do not have the old objects, change the scope of the configuration to an empty group or Organizational Units. Once the provisioning runs and cleans up the objects, disable and delete the  configuration. 

## Next steps 

- [What is provisioning?](what-is-provisioning.md)
- [What is Azure AD Connect cloud provisioning?](what-is-cloud-provisioning.md)
