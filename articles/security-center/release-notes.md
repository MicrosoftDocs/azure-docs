---
title: Release notes for Azure Security Center
description: A description of what's new and changed in Azure Security Center.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/11/2020
ms.author: memildin

---

# What's new in Azure Security Center?

Azure Security is in active development and receives improvements on an ongoing basis. To stay up to date with the most recent developments, this page provides you with information about:

- New features
- Bug fixes
- Deprecated functionality

This page is updated regularly, so revisit it often. If you're looking for items that are older than six months, you can find them in the [Archive for What's new in Azure Security Center](release-notes-archive.md).


## May 2020

### Changes to just-in-time (JIT) virtual machine (VM) access

Security Center includes an optional feature to protect the management ports of your VMs. This provides a defense against the most common form of brute force attacks.

This update brings the following changes to this feature:

- The recommendation that advises you to enable JIT on a VM has been renamed. Formerly, "Just-in-time network access control should be applied on virtual machines" it's now: "Management ports of virtual machines should be protected with just-in-time network access control".

- The recommendation has been set to be triggered only if there are open management ports.

[Learn more about the JIT access feature](security-center-just-in-time.md).


### Alert suppression rules (preview)

This new feature (currently in preview) helps reduce alert fatigue. Use rules to automatically hide alerts that are known to be innocuous or related to normal activities in your organization. This lets you focus on the most relevant threats. 

Alerts that match your enabled suppression rules will still be generated, but their state will be set to dismissed. You can see the state in the Azure portal or however you access your Security Center security alerts.

Suppression rules define the criteria for which alerts should be automatically dismissed. Typically, you'd use a suppression rule to:

- suppress alerts that you've identified as false positives

- suppress alerts that are being triggered too often to be useful

[Learn more about suppressing alerts from Azure Security Center's threat protection](alerts-suppression-rules.md).


### Custom recommendations have been moved to a separate security control

One of the security controls introduced with the enhanced secure score was "Implement security best practices". Any custom recommendations created for your subscriptions were automatically placed in that control. 

To make it easier to find your custom recommendations, we have moved them into a dedicated security control, "Custom recommendations". This control has no impact on your secure score.

Learn more about security controls in [Enhanced secure score (preview) in Azure Security Center](secure-score-security-controls.md).


### Toggle added to view recommendations in controls or as a flat list

Security controls are logical groups of related security recommendations. They reflect your vulnerable attack surfaces. A control is a set of security recommendations, with instructions that help you implement those recommendations.

To immediately see how well your organization is securing each individual attack surface, review the scores for each security control.

By default, your recommendations are shown in the security controls, but from this update you can display them as a list. To view them as simple list sorted by the health status of the affected resources, use the new toggle 'Group by controls' at the top of the list in the portal.

Learn more about security controls in [Enhanced secure score (preview) in Azure Security Center](secure-score-security-controls.md).


### Account security recommendations moved to "Security best practices" security control

One of the security controls introduced with the enhanced secure score was "Security best practices". 

With this update, three recommendations have moved out of the controls in which they were originally placed, and into this best practices control.

The recommendations are:

- MFA should be enabled on accounts with read permissions on your subscription (this was originally in the "Enable MFA" control)
- External accounts with read permissions should be removed from your subscription (this was originally in the "Manage access and permissions" control)
- A maximum of 3 owners should be designated for your subscription (this was originally in the "Manage access and permissions" control)

Learn more about security controls in [Enhanced secure score (preview) in Azure Security Center](secure-score-security-controls.md).
