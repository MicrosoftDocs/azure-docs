---
title: How to secure a single page application with user sign-in
description: How to configure a single page application which supports Azure AD single-sign-on with Azure Maps Web SDK.
author: philmea
ms.author: philmea
ms.date: 05/14/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# Secure a single page application with user sign-in

An application which can be hosted on content server and has minimal web server component dependencies. The application provides protected resources secured only to Azure AD users and does not expose unprotected web pages. The objective of the scenario is to enable the web application to authenticate to Azure AD and call Azure Maps REST APIs on behalf of the user.

[!INCLUDE [authentication details](./includes/view-auth-details.md)]

## Create an application registration in Azure AD

You must create the web application in Azure AD for users to sign in. This web application will then delegate user access to Azure Maps REST APIs.

1. In the Azure portal, in the list of Azure services, select **Azure Active Directory** > **App registrations** > **New registration**.  

    ![App registration](./media/how-to-manage-authentication/app-registration.png)

2. Enter a **Name**, choose a **Support account type**, provide a redirect URI which will represent the url which Azure AD will issue the token and is the url where the map control is hosted. For more details on Redirect URI, please see Azure Maps Azure AD samples. Then select **Register**.  

3. To assign delegated API permissions to Azure Maps, go to the application. Then under **App registrations**, select **API permissions** > **Add a permission**. Under **APIs my organization uses**, search for and select **Azure Maps**.

    ![Add app API permissions](./media/how-to-manage-authentication/app-permissions.png)

4. Select the check box next to **Access Azure Maps**, and then select **Add permissions**.

    ![Select app API permissions](./media/how-to-manage-authentication/select-app-permissions.png)

5. Enable `oauth2AllowImplicitFlow`. To enable it, in the **Manifest** section of your app registration, set `oauth2AllowImplicitFlow` to `true`.

6. Copy the Azure AD app ID and the Azure AD tenant ID from the app registration to use in the Web SDK.

[!INCLUDE [grant role access to users](./includes/grant-rbac-users.md)]

## User sign-in with Azure Maps web SDK

Add the Azure AD app registration details and the `x-ms-client-id` from the Azure Map account to the Web SDK.

```javascript
<link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css" type="text/css" />
<script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js"></script>
<script>
    var map = new atlas.Map("map", {
        center: [-122.33, 47.64],
        zoom: 12,
        language: "en-US",
        authOptions: {
            authType: "aad",
            clientId: "<insert>",  // azure map account client id
            aadAppId: "<insert>",  // azure ad app registration id
            aadTenant: "<insert>", // azure ad tenant id
            aadInstance: "https://login.microsoftonline.com/"
        }
    });
</script>
```

## Next steps

Further understanding of Single Page Application Scenario:
> [!div class="nextstepaction"]
> [Single-page application]([how-to-view-api-usage.md](https://docs.microsoft.com/azure/active-directory/develop/scenario-spa-overview))

Find the API usage metrics for your Azure Maps account:
> [!div class="nextstepaction"]
> [View usage metrics](how-to-view-api-usage.md)

Explore samples that show how to integrate Azure AD with Azure Maps:
> [!div class="nextstepaction"]
> [Azure Maps Samples](https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples/tree/master/src/ImplicitGrant)
