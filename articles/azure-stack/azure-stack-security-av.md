---
title: Update Windows Defender Antivirus on Azure Stack
description: Details on how antivirus is kept up to date on Azure Stack
services: azure-stack
author: PatAltimore
manager: femila

ms.service: azure-stack
ms.topic: article
ms.date: 09/26/2018
ms.author: patricka
ms.reviewer: fiseraci

#Customer intent: As an Azure AD Administrator, I want to understand how antivirus is kept up to date on Azure Stack.
---
# Update Windows Defender Antivirus on Azure Stack

[Windows Defender Antivirus](https://docs.microsoft.com/windows/security/threat-protection/windows-defender-antivirus/windows-defender-antivirus-in-windows-10) is an antimalware solution that provides security and virus protection. Every Azure Stack infrastructure component (Hyper-V hosts and virtual machines) is protected with Windows Defender Antivirus. For up-to-date protection, Windows Defender Antivirus definitions, engine, and platform require periodic updates. How updates are applied depends on your configuration.

## Connected scenario

For antimalware definition and engine updates, the Azure Stack [update resource provider](azure-stack-updates.md#the-update-resource-provider) downloads antimalware definitions and engine updates multiple times per day. Each Azure Stack infrastructure component gets the update from the update resource provider and applies the update automatically.

For antimalware platform updates, apply the [monthly Azure Stack update](azure-stack-apply-updates.md). The monthly Azure Stack update includes Windows Defender Antivirus platform updates for the month.

## Disconnected scenario

 Apply the [monthly Azure Stack update](azure-stack-apply-updates.md). The monthly Azure Stack update includes Windows Defender Antivirus definitions, engine, and platform updates for the month.

## Next steps

[Learn more about Azure Stack security](azure-stack-security-foundations.md)
