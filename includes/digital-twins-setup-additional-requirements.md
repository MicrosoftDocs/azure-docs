---
author: baanders
description: include file for possible additional requirements in Azure Digital Twins setup
ms.service: digital-twins
ms.topic: include
ms.date: 7/17/2020
ms.author: baanders
---

It is possible that your organization requires additional actions from subscription Owners in order to successfully set up an app registration. The steps required may vary depending on your organization's specific settings.

Here are some common potential activities that an Owner may need to perform. These and other operations can be performed from the [AAD App registrations](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) page in the Azure portal.
* Grant admin consent for the app registration. Your organization may have *Admin Consent Required* globally turned on in AAD for all app registrations within your subscription. If this is the case, the Owner may need to select this button for your company on the app registration's *API permissions* page in the Azure portal:

    :::image type="content" source="../articles/digital-twins/media/how-to-set-up-instance/grant-admin-consent.png" alt-text="Portal view of the 'Grant admin consent' button under API permissions":::
  - If this is successful, the entry for Azure Digital Twins should show a *Status* value of _Granted for **(your company)**_
   
    :::image type="content" source="../articles/digital-twins/media/how-to-set-up-instance/granted-admin-consent.png" alt-text="Portal view of the admin consent granted for the company under API permissions":::
* Grant *Owner* role in the app registration to any users who will be calling the API. You can do this on the *Owners* page in the Azure portal:

    :::image type="content" source="../articles/digital-twins/media/how-to-set-up-instance/add-owners.png" alt-text="Portal view of the 'Add owners' button under Owners":::
* Activate public client access
* Set specific reply URLs for web and desktop access
* Allow for implicit OAuth2 authentication flows
* If users will be using personal [**Microsoft accounts (MSAs)**](https://account.microsoft.com/account/Account), such as *@outlook.com* accounts, for this Azure subscription, you may need to set the *signInAudience* on the app registration to support personal accounts.

For more information about app registration and its different options, see [*Register an application with the Microsoft identity platform*](https://docs.microsoft.com/graph/auth-register-app-v2).

You now have an Azure Digital Twins instance ready to go, have assigned permissions to manage it, and have set up permissions for a client app to access it.