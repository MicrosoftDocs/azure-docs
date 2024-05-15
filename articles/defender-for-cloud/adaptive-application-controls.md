---
title: Understand adaptive application controls
description: This document helps you use adaptive application control in Microsoft Defender for Cloud to create an allowlist of applications running for Azure machines.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 01/22/2024
---

# Understand adaptive application controls

Microsoft Defenders for Cloud's adaptive application controls enhance your security with this data-driven, intelligent automated solution that defines allowlists of known-safe applications for your machines.

Often, organizations have collections of machines that routinely run the same processes. Microsoft Defender for Cloud uses machine learning to analyze the applications running on your machines and create a list of the known-safe software. Allowlists are based on your specific Azure workloads, and you can further customize the recommendations using the following instructions.

When you enable and configure adaptive application controls, you get security alerts if any application runs other than the ones you defined as safe.

## What are the benefits of adaptive application controls?

By defining lists of known-safe applications, and generating alerts when anything else is executed, you can achieve multiple oversight and compliance goals:

- Identify potential malware, even any that antimalware solutions can miss
- Improve compliance with local security policies that dictate the use of only licensed software
- Identify outdated or unsupported versions of applications
- Identify software your organization banned but is nevertheless running on your machines
- Increase oversight of apps that access sensitive data

No enforcement options are currently available. Adaptive application controls are intended to provide security alerts if any application runs other than the ones you define as safe.

## Availability

|Aspect|Details|
|----|:----|
|Release state:|General availability (GA)|
|Pricing:|Requires [Microsoft Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features)|
|Supported machines:|:::image type="icon" source="./media/icons/yes-icon.png"::: Azure and non-Azure machines running Windows and Linux<br>:::image type="icon" source="./media/icons/yes-icon.png"::: [Azure Arc](../azure-arc/index.yml) machines|
|Required roles and permissions:|**Security Reader** and **Reader** roles can both view groups and the lists of known-safe applications<br>**Contributor** and **Security Admin** roles can both edit groups and the lists of known-safe applications|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National (Azure Government, Microsoft Azure operated by 21Vianet)<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts|

## Next step

[Enable adaptive application controls](enable-adaptive-application-controls.md)
