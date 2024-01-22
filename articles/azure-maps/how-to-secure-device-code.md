---
title: How to secure an input constrained device using  Microsoft Entra ID and Azure Maps REST API
titleSuffix: Azure Maps
description: How to configure a browser-less application that supports sign-in to Microsoft Entra ID and calls Azure Maps REST API.
author: eriklindeman
ms.author: eriklind
ms.date: 06/12/2020
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Secure an input constrained device by using Microsoft Entra ID and Azure Maps REST APIs

This guide discusses how to secure public applications or devices that can't securely store secrets or accept browser input. These types of applications fall under the internet of things (IoT) category. Examples include Smart TVs and sensor data emitting applications.

[!INCLUDE [authentication details](./includes/view-authentication-details.md)]

<a name='create-an-application-registration-in-azure-ad'></a>

## Create an application registration in Microsoft Entra ID

> [!NOTE]
>
> * **Prerequisite Reading:** [Scenario: Desktop app that calls web APIs]
> * The following scenario uses the device code flow, which does not involve a web browser to acquire a token.

Create the device based application in Microsoft Entra ID to enable Microsoft Entra sign-in, which is granted access to Azure Maps REST APIs.

1. In the Azure portal, in the list of Azure services, select **Microsoft Entra ID** > **App registrations** > **New registration**.  
	
	:::image type="content" border="false" source="./media/how-to-manage-authentication/app-registration.png" lightbox="./media/how-to-manage-authentication/app-registration.png" alt-text="A screenshot showing application registration in Microsoft Entra ID.":::

2. Enter a **Name**, choose **Accounts in this organizational directory only** as the **Supported account type**. In **Redirect URIs**, specify **Public client / native (mobile & desktop)** then add `https://login.microsoftonline.com/common/oauth2/nativeclient` to the value. For more information, see Microsoft Entra ID [Desktop app that calls web APIs: App registration]. Then **Register** the application.

    :::image type="content" source="./media/azure-maps-authentication/devicecode-app-registration.png" alt-text="A screenshot showing the settings used to register an application.":::

3. Navigate to **Authentication** and enable **Treat application as a public client** to enable device code authentication with Microsoft Entra ID.

    :::image type="content" source="./media/azure-maps-authentication/devicecode-public-client.png" alt-text="A screenshot showing the advanced settings used to specify treating the application as a public client.":::

4. To assign delegated API permissions to Azure Maps, go to the application. Then select **API permissions** > **Add a permission**. Under **APIs my organization uses**, search for and select **Azure Maps**.

    :::image type="content" source="./media/how-to-manage-authentication/app-permissions.png" alt-text="A screenshot showing where you request API permissions.":::

5. Select the check box next to **Access Azure Maps**, and then select **Add permissions**.

    :::image type="content" source="./media/how-to-manage-authentication/select-app-permissions.png" alt-text="A screenshot showing where you specify the app permissions you require.":::

6. Configure Azure role-based access control (Azure RBAC) for users or groups. For more information, see [Grant role-based access for users to Azure Maps].

7. Add code for acquiring token flow in the application, for implementation details see [Device code flow]. When acquiring tokens, reference the scope: `user_impersonation` that was selected on earlier steps.

    > [!Tip]
    > Use Microsoft Authentication Library (MSAL) to acquire access tokens.
    > For more information, see [Desktop app that calls web APIs: Code configuration] in the active directory documentation.

8. Compose the HTTP request with the acquired token from Microsoft Entra ID, and sent request with a valid HTTP client.

### Sample request

Here's a sample request body for uploading a simple Geofence represented as a circle geometry using a center point and a radius.

```http
POST /mapData?api-version=2.0&dataFormat=geojson
Host: us.atlas.microsoft.com
x-ms-client-id: 30d7cc….9f55
Authorization: Bearer eyJ0e….HNIVN
```

 The following sample request body is in GeoJSON:

```json
{
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-122.126986, 47.639754]
        },
        "properties": {
            "geometryId": "001",
            "radius": 500
        }
    }]
}
```

### Sample response header

```http
Operation-Location: https://us.atlas.microsoft.com/mapData/operations/{udid}?api-version=2.0
Access-Control-Expose-Headers: Operation-Location
```

[!INCLUDE [grant role-based access to users](./includes/grant-rbac-users.md)]

## Next steps

Find the API usage metrics for your Azure Maps account:

> [!div class="nextstepaction"]
> [View usage metrics]

[Desktop app that calls web APIs: App registration]: ../active-directory/develop/scenario-desktop-app-registration.md
[Desktop app that calls web APIs: Code configuration]: ../active-directory/develop/scenario-desktop-app-configuration.md
[Device code flow]: ../active-directory/develop/scenario-desktop-acquire-token-device-code-flow.md
[Grant role-based access for users to Azure Maps]: #grant-role-based-access-for-users-to-azure-maps
[Scenario: Desktop app that calls web APIs]: ../active-directory/develop/scenario-desktop-overview.md
[View usage metrics]: how-to-view-api-usage.md
