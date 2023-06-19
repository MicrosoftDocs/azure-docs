---
title: How to secure a web application with interactive single sign-in
titleSuffix: Azure Maps
description: How to configure a web application that supports Azure AD single sign-in with Azure Maps Web SDK using OpenID Connect protocol.
author: eriklindeman
ms.author: eriklind
ms.date: 06/12/2020
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
ms.custom:
---

# Secure a web application with user sign-in

The following guide pertains to an application that is hosted on web servers, maintains multiple business scenarios, and deploys to web servers. The application has the requirement to provide protected resources secured only to Azure AD users. The objective of the scenario is to enable the web application to authenticate to Azure AD and call Azure Maps REST APIs on behalf of the user.

[!INCLUDE [authentication details](./includes/view-authentication-details.md)]

## Create an application registration in Azure AD

You must create the web application in Azure AD for users to sign in. This web application then delegates user access to Azure Maps REST APIs.

1. In the Azure portal, in the list of Azure services, select **Azure Active Directory** > **App registrations** > **New registration**.  

    :::image type="content" source="./media/how-to-manage-authentication/app-registration.png" alt-text="A screenshot showing App registration." lightbox="./media/how-to-manage-authentication/app-registration.png":::

2. Enter a **Name**, choose a **Support account type**, provide a redirect URI that represents the url to which Azure AD issues the token, which is the url where the map control is hosted. For more information, see Azure AD [Scenario: Web app that signs in users](../active-directory/develop/scenario-web-app-sign-user-overview.md). Complete the provided steps from the Azure AD scenario.  

3. Once the application registration is complete, confirm that application sign-in works for users. Once sign-in works, the application can be granted delegated access to Azure Maps REST APIs.

4. To assign delegated API permissions to Azure Maps, go to the application and select **API permissions** > **Add a permission**. select **Azure Maps** in the **APIs my organization uses** list.

    :::image type="content" source="./media/how-to-manage-authentication/app-permissions.png" alt-text="A screenshot showing add app API permissions." lightbox="./media/how-to-manage-authentication/app-permissions.png":::

5. Select the check box next to **Access Azure Maps**, and then select **Add permissions**.

    :::image type="content" source="./media/how-to-manage-authentication/select-app-permissions.png" alt-text="A screenshot showing select app API permissions." lightbox="./media/how-to-manage-authentication/select-app-permissions.png":::

6. Enable the web application to call Azure Maps REST APIs by configuring the app registration with an application secret, For detailed steps, see [A web app that calls web APIs: App registration](../active-directory/develop/scenario-web-app-call-api-app-registration.md). A secret is required to authenticate to Azure AD on-behalf of the user. The app registration certificate or secret should be stored in a secure store for the web application to retrieve to authenticate to Azure AD.

   * This step may be skipped if the application already has an Azure AD app registration and secret configured.

    > [!TIP]
    > If the application is hosted in an Azure environment, we recommend using [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) and an Azure Key Vault instance to access secrets by [acquiring an access token](../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md) for accessing Azure Key Vault secrets or certificates. To connect to Azure Key Vault to retrieve secrets, see [tutorial to connect through managed identity](../key-vault/general/tutorial-net-create-vault-azure-web-app.md).

7. Implement a secure token endpoint for the Azure Maps Web SDK to access a token.

   * For a sample token controller, see [Azure Maps Azure AD Samples](https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples/blob/master/src/OpenIdConnect/AzureMapsOpenIdConnectv1/AzureMapsOpenIdConnect/Controllers/TokenController.cs).
   * For a non-AspNetCore implementation or other, see [Acquire token for the app](../active-directory/develop/scenario-web-app-call-api-acquire-token.md) from Azure AD documentation.
   * The secured token endpoint is responsible to return an access token for the authenticated and authorized user to call Azure Maps REST APIs.

8. To configure Azure role-based access control (Azure RBAC) for users or groups, see [grant role-based access for users](#grant-role-based-access-for-users-to-azure-maps).

9. Configure the web application page with the Azure Maps Web SDK to access the secure token endpoint.

```javascript
var map = new atlas.Map("map", {
        center: [-122.33, 47.64],
        zoom: 12,
        language: "en-US",
        authOptions: {
            authType: "anonymous",
            clientId: "<insert>",  // azure map account client id
            getToken: function (resolve, reject, map) {
                var xhttp = new XMLHttpRequest();
                xhttp.open("GET", "/api/token", true); // the url path maps to the token endpoint.
                xhttp.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        resolve(this.responseText);
                    } else if (this.status !== 200) {
                        reject(this.responseText);
                    }
                };

                xhttp.send();
            }
        }
    });
    map.events.add("tokenacquired", function () {
        console.log("token acquired");
    });
    map.events.add("error", function (err) {
        console.log(JSON.stringify(err.error));
    });
```

[!INCLUDE [grant role-based access to users](./includes/grant-rbac-users.md)]

## Next steps

Further understanding of web application scenario:
> [!div class="nextstepaction"]
> [Scenario: Web app that signs in users](../active-directory/develop/scenario-web-app-sign-user-overview.md)

Find the API usage metrics for your Azure Maps account:
> [!div class="nextstepaction"]
> [View usage metrics](how-to-view-api-usage.md)

Explore samples that show how to integrate Azure AD with Azure Maps:
> [!div class="nextstepaction"]
> [Azure Maps Azure AD Web App Samples](https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples/tree/master/src/OpenIdConnect)
