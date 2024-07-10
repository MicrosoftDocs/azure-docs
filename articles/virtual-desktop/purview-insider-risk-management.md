---
title: Microsoft Purview Insider Risk Management forensic evidence for Azure Virtual Desktop
description: Learn about Microsoft Purview Insider Risk Management Forensic evidence for Azure Virtual Desktop.
ms.topic: how-to
author: sipastak
ms.author: sipastak
ms.date: 07/09/2024
---

# Microsoft Purview Insider Risk Management forensic evidence for Azure Virtual Desktop

[Forensic evidence](/purview/insider-risk-management-forensic-evidence) is an opt-in add-on feature in Insider Risk Management in Microsoft Purview that gives security teams visual insights into potential insider data security incidents. Forensic evidence includes customizable event triggers and built-in user privacy protection controls, enabling security teams to better investigate, understand and respond to potential insider data risks like unauthorized data exfiltration of sensitive data. You set the right policies for your organization, including what risky events are the highest priority for capturing forensic evidence, what data is most sensitive, and whether users are notified when forensic capturing is activated. Forensic evidence capturing is off by default and policy creation requires dual authorization.

## Prerequisites

- Personal desktops and direct assignment only
- Windows 11 Enterprise, Version 23H2 / Standard D2as v5 (2 vCPU’s, 8 GiB memory) / 128 GiB Standard SSD 
- License: Microsoft 365 E5 
    - Note: It contains both Intune and Insider Risk Management licenses. The user must be licensed for Intune to be assigned as a device’s Primary user, must have Insider Risk Management license to make Forensic Evidence available. 
- Domain to join: 
    - Microsoft Entra ID 
    - Enroll VM with Intune 
- Network: Azure virtual network 


## Enable 



## Related articles

