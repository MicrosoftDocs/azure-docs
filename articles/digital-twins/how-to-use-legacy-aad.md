---
title: 'Use legacy AAD app registration for Azure Digital Twins | Microsoft Docs'
description: This article shows how to use the legacy method of creating app registration with Azure Active Directory for your Azure Digital Twins setup.
author: alinamstanciu
manager: philmea
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 06/28/2019
ms.author: alinast
---

# Register your Azure Digital Twins app with Azure Active Directory legacy

This article shows you can use the old or legacy way to register your sample application to Azure Active Directory (Azure AD) so that it can access your Digital Twins instance. You might want to try this method in case the new Azure AD app registration does not work for your setup.

[!INCLUDE [Digital Twins legacy AAD](../../includes/digital-twins-permissions-legacy.md)]

## Next steps

Once your app is registered with the AAD, it can then connect with your Digital Twins instance and help you advance in your scenario. See either the [quickstart](quickstart-view-occupancy-dotnet.md#build-application) or the [tutorial](tutorial-facilities-setup.md#configure-the-digital-twins-sample) for more information on the next steps. 