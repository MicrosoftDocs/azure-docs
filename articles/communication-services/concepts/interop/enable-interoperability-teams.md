---
title: Enable interoperability with Teams
titleSuffix: An Azure Communication Services concept document
description: Enable interoperability with Teams
author: jamescadd
ms.author: jacadd
ms.date: 4/15/2024
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.custom: mode-other, devx-track-js
---

# Enable interoperability between Azure Communication Services and a Microsoft Teams tenant

Azure Communication Services can be used to build applications that enable Microsoft Teams external users to participate in calls and meetings with Microsoft Teams users. [Standard Azure Communication Services pricing](https://azure.microsoft.com/pricing/details/communication-services/) applies to these users, but there's no extra fee for the interoperability capability.

For calls with Teams users, ensure the user is Enterprise Voice enabled. To assign the license, use the [Set-CsPhoneNumberAssignment cmdlet](/powershell/module/teams/set-csphonenumberassignment) and set the **EnterpriseVoiceEnabled** parameter to $true. For additional information, see [Set up Teams Phone in your organization](/microsoftteams/setting-up-your-phone-system).

Follow these steps to enable the connection between a Teams tenant and a Communication Services resource.

[!INCLUDE [Enable interoperability in your Teams tenant](../includes/enable-interoperability-for-teams-tenant.md)]