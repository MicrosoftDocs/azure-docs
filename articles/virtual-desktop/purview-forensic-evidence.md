---
title: Onboard Azure Virtual Desktop session hosts to forensic evidence from Microsoft Purview Insider Risk Management
description: Learn how to onboard Azure Virtual Desktop session hosts to forensic evidence. When using Azure Virtual Desktop with forensic evidence, you can set policies to trigger recordings of desktop and RemoteApp sessions automatically.
ms.topic: how-to
author: sipastak
ms.author: sipastak
ms.date: 08/13/2024
---

# Onboard Azure Virtual Desktop session hosts to forensic evidence from Microsoft Purview Insider Risk Management

[Forensic evidence](/purview/insider-risk-management-forensic-evidence) is an opt-in add-on feature in Microsoft Purview Insider Risk Management that gives security teams visual insights into potential insider data security incidents. Forensic evidence includes customizable event triggers and built-in user privacy protection controls, enabling security teams to better investigate, understand and respond to potential insider data risks like unauthorized data exfiltration of sensitive data. 

You set the right policies for your organization, including what risky events are the highest priority for capturing forensic evidence, what data is most sensitive, and whether users are notified when forensic capturing is activated. 
	
When using Azure Virtual Desktop with forensic evidence, you can set policies to trigger recordings of desktop and RemoteApp sessions automatically. Forensic evidence capturing is off by default and policy creation requires dual authorization.

## Prerequisites

Before you can use forensic evidence for Azure Virtual Desktop, you need: 

- A personal desktop host pool with direct assignment. Pooled host pools aren't supported.

- Session hosts running Windows 11 Enterprise, version 23H2, and using a VM SKU with minimum of 8 vCPU and 16 GB memory, such as [Standard D8as v5](/azure/virtual-machines/dasv5-dadsv5-series).

- Session hosts must be Microsoft [Entra ID-joined](/entra/identity/devices/concept-directory-join) or [Entra ID hybrid-joined](/entra/identity/devices/concept-hybrid-join) and enrolled with Microsoft Intune.

- Microsoft 365 E5 license, which contains both Intune and Insider Risk Management licenses.

## Onboard session hosts to forensic evidence

To onboard your session hosts to forensic evidence:

1. Ensure a user is assigned to a personal desktop using direct assignment. Follow the steps in [Configure direct assignment](configure-host-pool-personal-desktop-assignment-type.md#configure-direct-assignment) to assign a user to a personal desktop.

1. You need to onboard your session hosts to Purview. Follow the steps in [Onboard Windows devices into Microsoft Purview](/purview/device-onboarding-overview) to onboard your session hosts.

1. Install the Purview client and configure forensic evidence. Follow the steps in [Get started with insider risk management forensic evidence](/purview/insider-risk-management-forensic-evidence-configure) to install the Purview client and configure forensic evidence.

## Related content

- [Manage insider risk management forensic evidence](/purview/insider-risk-management-forensic-evidence-manage)
