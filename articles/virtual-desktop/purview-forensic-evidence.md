---
title: Microsoft Purview forensic evidence for Azure Virtual Desktop
description: Learn about Microsoft Purview forensic evidence for Azure Virtual Desktop.
ms.topic: how-to
author: sipastak
ms.author: sipastak
ms.date: 07/09/2024
---

# Microsoft Purview forensic evidence for Azure Virtual Desktop

[Forensic evidence](/purview/insider-risk-management-forensic-evidence) is an opt-in add-on feature in Microsoft Purview Insider Risk Management that gives security teams visual insights into potential insider data security incidents. Forensic evidence includes customizable event triggers and built-in user privacy protection controls, enabling security teams to better investigate, understand and respond to potential insider data risks like unauthorized data exfiltration of sensitive data. 

You set the right policies for your organization, including what risky events are the highest priority for capturing forensic evidence, what data is most sensitive, and whether users are notified when forensic capturing is activated. When using forensic evidence for Azure Virtual Desktop, you can set policies to trigger recordings of application and desktop sessions automatically. Forensic evidence capturing is off by default and policy creation requires dual authorization.

## Prerequisites

Before you can use forensic evidence for Azure Virtual Desktop, you need the following: 

- A personal desktop host pool with direct assignment.

- Session hosts running Windows 11, version 23H2 and [Standard D2as v5](../virtual-machines/dasv5-dadsv5-series.md) VM size.

- Session hosts must be Microsoft [Entra ID-joined](/entra/identity/devices/concept-directory-join) or [Entra ID hybrid-joined](/entra/identity/devices/concept-hybrid-join).

- Microsoft 365 E5 license
    >[!NOTE]
    >The Microsoft 365 E5 license contains both Intune and Insider Risk Management licenses. You must be licensed for Intune to be assigned as a device’s primary user and you must have the Insider Risk Management license to make forensic evidence available. 

## Configure forensic evidence

To configure forensic evidence for Azure Virtual Desktop:

1. Ensure direct assignment is configured for your personal desktop. See [Configure direct assignment](configure-host-pool-personal-desktop-assignment-type.md#configure-direct-assignment) for more information. 

1. Follow the steps in [Get started with insider risk management forensic evidence](/purview/insider-risk-management-forensic-evidence-configure?tabs=purview-portal) to install the Purview client and configure forensic evidence.

## Related content

- [Manage insider risk management forensic evidence](/purview/insider-risk-management-forensic-evidence-manage?tabs=purview-portal)