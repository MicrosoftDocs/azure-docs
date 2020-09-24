---
author: baanders
description: include file for possible additional requirements in Azure Digital Twins setup
ms.service: digital-twins
ms.topic: include
ms.date: 7/22/2020
ms.author: baanders
---

It's possible that your organization requires additional actions from subscription Owners/administrators to successfully set up an app registration (and thus, to finish setting up a usable Azure Digital Twins instance). The steps required may vary depending on your organization's specific settings.

Here are some common potential activities that an Owner/administrator may need to perform. These and other operations can be performed from the [*Azure AD App registrations*](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) page in the Azure portal.
* Grant admin consent for the app registration. Your organization may have *Admin Consent Required* globally turned on in Azure AD for all app registrations within your subscription. If so, the Owner/administrator will need to select this button for your company on the app registration's *API permissions* page for the app registration to be valid:

    :::image type="content" source="../articles/digital-twins/media/how-to-set-up-instance/portal/grant-admin-consent.png" alt-text="Portal view of the 'Grant admin consent' button under API permissions":::
  - If consent was granted successfully, the entry for Azure Digital Twins should then show a *Status* value of _Granted for **(your company)**_
   
    :::image type="content" source="../articles/digital-twins/media/how-to-set-up-instance/portal/granted-admin-consent-done.png" alt-text="Portal view of the admin consent granted for the company under API permissions":::
* Activate public client access
* Set specific reply URLs for web and desktop access
* Allow for implicit OAuth2 authentication flows

For more information about app registration and its different setup options, see [*Register an application with the Microsoft identity platform*](https://docs.microsoft.com/graph/auth-register-app-v2).

You now have an Azure Digital Twins instance ready to go, have assigned permissions to manage it, and have set up permissions for a client app to access it.