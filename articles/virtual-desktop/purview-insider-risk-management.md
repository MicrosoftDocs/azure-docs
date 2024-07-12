---
title: Microsoft Purview Insider Risk Management forensic evidence for Azure Virtual Desktop
description: Learn about Microsoft Purview Insider Risk Management Forensic evidence for Azure Virtual Desktop.
ms.topic: how-to
author: sipastak
ms.author: sipastak
ms.date: 07/09/2024
---

# Microsoft Purview Insider Risk Management forensic evidence for Azure Virtual Desktop

[Forensic evidence](/purview/insider-risk-management-forensic-evidence) is an opt-in add-on feature in Microsoft Purview Insider Risk Management that gives security teams visual insights into potential insider data security incidents. Forensic evidence includes customizable event triggers and built-in user privacy protection controls, enabling security teams to better investigate, understand and respond to potential insider data risks like unauthorized data exfiltration of sensitive data. You set the right policies for your organization, including what risky events are the highest priority for capturing forensic evidence, what data is most sensitive, and whether users are notified when forensic capturing is activated. Forensic evidence capturing is off by default and policy creation requires dual authorization.

## Prerequisites

- A personal desktop host pool with direct assignment.

- Microsoft 365 E5 license
    >[!NOTE]
    >The Microsoft 365 E5 license contains both Intune and Insider Risk Management licenses. You must be licensed for Intune to be assigned as a device’s primary user and you must have the Insider Risk Management license to make forensic evidence available. 

## Configure forensic evidence

1. Ensure direct assignment is configured for your personal desktop. See [Configure direct assignment](configure-host-pool-personal-desktop-assignment-type.md#configure-direct-assignment) for more information. 

1. Follow the steps in [Get started with insider risk management forensic evidence](/purview/insider-risk-management-forensic-evidence-configure?tabs=purview-portal) to install the Purview client and configure forensic evidence.

