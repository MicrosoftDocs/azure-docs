---
author: baanders
description: include file for verifying app registration in Azure Digital Twins setup
ms.service: digital-twins
ms.topic: include
ms.date: 7/22/2020
ms.author: baanders
---

To check whether the permissions have been configured correctly, follow [this link](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) to navigate to the AAD app registration overview page in the Azure portal. This page shows all the app registrations that have been created in your subscription.

You should see the app registration you just created in the overview list. Select it to open up its details.

First, verify that the settings from your uploaded *manifest.json* were properly set on the registration. To do this, select *Manifest* from the menu bar to view the app registration's manifest code. Scroll to the bottom of the code window and look for the fields from your *manifest.json* under `requiredResourceAccess`:

:::image type="content" source="../articles/digital-twins/media/how-to-set-up-instance/verify-manifest.png" alt-text="Portal view of the manifest for the AAD app registration":::

Next, select *API permissions* from the menu bar to verify that this app registration contains Read/Write permissions for Azure Digital Twins. You should see an entry like this:

:::image type="content" source="../articles/digital-twins/media/how-to-set-up-instance/verify-api-permissions.png" alt-text="Portal view of the API permissions for the AAD app registration, showing 'Read/Write Access' for Azure Digital Twins":::