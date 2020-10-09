---
title: How to secure a single page application with user sign-in
titleSuffix: Azure Maps
description: How to configure a single page application which supports Azure AD single-sign-on with Azure Maps Web SDK.
author: anastasia-ms
ms.author: v-stharr
ms.date: 06/12/2020
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
manager: timlt
ms.custom: devx-track-js
---

# Secure a single page application with user sign-in

The following guide pertains to an application which is hosted on a content server or has minimal web server dependencies. The application provides protected resources secured only to Azure AD users. The objective of the scenario is to enable the web application to authenticate to Azure AD and call Azure Maps REST APIs on behalf of the user.

[!INCLUDE [authentication details](./includes/view-authentication-details.md)]

## Create an application registration in Azure AD

Create the web application in Azure AD for users to sign in. The web application delegates user access to Azure Maps REST APIs.

1. In the Azure portal, in the list of Azure services, select **Azure Active Directory** > **App registrations** > **New registration**.  

    > [!div class="mx-imgBorder"]
    > ![App registration](./media/how-to-manage-authentication/app-registration.png)

2. Enter a **Name**, choose a **Support account type**, provide a redirect URI which will represent the url which Azure AD will issue the token and is the url where the map control is hosted. For a detailed sample please see [Azure Maps Azure AD samples](https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples/tree/master/src/ImplicitGrant). Then select **Register**.  

3. To assign delegated API permissions to Azure Maps, go to the application. Then under **App registrations**, select **API permissions** > **Add a permission**. Under **APIs my organization uses**, search for and select **Azure Maps**.

    > [!div class="mx-imgBorder"]
    > ![Add app API permissions](./media/how-to-manage-authentication/app-permissions.png)

4. Select the check box next to **Access Azure Maps**, and then select **Add permissions**.

    > [!div class="mx-imgBorder"]
    > ![Select app API permissions](./media/how-to-manage-authentication/select-app-permissions.png)

5. Enable `oauth2AllowImplicitFlow`. To enable it, in the **Manifest** section of your app registration, set `oauth2AllowImplicitFlow` to `true`.

6. Copy the Azure AD app ID and the Azure AD tenant ID from the app registration to use in the Web SDK. Add the Azure AD app registration details and the `x-ms-client-id` from the Azure Map account to the Web SDK.

    ```javascript
        <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css" type="text/css" />
        <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js" />
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

7. Configure Azure role based access control for users or groups. See the [following sections to enable RBAC](#grant-role-based-access-for-users-to-azure-maps).
   
[!INCLUDE [grant role access to users](./includes/grant-rbac-users.md)]

## Next steps

Further understanding of single page application scenario:
> [!div class="nextstepaction"]
> [Single-page application](https://docs.microsoft.com/azure/active-directory/develop/scenario-spa-overview)

Find the API usage metrics for your Azure Maps account:
> [!div class="nextstepaction"]
> [View usage metrics](how-to-view-api-usage.md)

Explore samples that show how to integrate Azure AD with Azure Maps:
> [!div class="nextstepaction"]
> [Azure Maps Samples](https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples/tree/master/src/ImplicitGrant)
