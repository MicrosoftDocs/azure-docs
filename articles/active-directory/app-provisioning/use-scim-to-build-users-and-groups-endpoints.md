---
title: Build a SCIM endpoint for user provisioning to apps from Azure Active Directory
description: System for Cross-domain Identity Management (SCIM) standardizes automatic user provisioning. Learn to develop a SCIM endpoint, integrate your SCIM API with Azure Active Directory, and start automating provisioning users and groups into your cloud applications with Azure Active Directory. 
services: active-directory
author: kenwith
manager: daveba
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: conceptual
ms.date: 01/27/2021
ms.author: kenwith
ms.reviewer: arvinh
---

# Tutorial: Develop a sample SCIM endpoint

No one wants to build a new endpoint from scratch, so we've created some [reference code](https://aka.ms/scimreferencecode) for you to get started with [SCIM](https://aka.ms/scimoverview). This tutorial describes how to deploy the SCIM reference code in Azure and test it using Postman or by integrating with the Azure AD SCIM client. You can get your SCIM endpoint up and running with no code in just 5 minutes. This tutorial is intended for developers who are looking to get started with SCIM or others interested in testing out a SICM endpoint. 

In this tutorial, learn how to:

> [!div class="checklist"]
> * Deploy your SCIM endpoint in Azure
> * Test your SCIM endpoint

## Deploy your SCIM endpoint in Azure

The steps provided here deploy the SCIM endpoint to a service using [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/) and [Azure App Services](https://docs.microsoft.com/azure/app-service/). The SCIM reference code can also be run locally, hosted by an on-premises server, or deployed to another external service. 

### Open solution and deploy to Azure App Service

1. Go to the [reference code](https://github.com/AzureAD/SCIMReferenceCode) from GitHub and select **Clone or download**.

1. Choose to either **Open in Desktop**, or, copy the link, open **Visual Studio**, and select **Clone or check out code** to enter the copied link and make a local copy.

1. In **Visual Studio**, be sure to sign into the account that has access to your hosting resources.

1. In **Solution Explorer**, open *Microsoft.SCIM.sln* and right-click the *Microsoft.SCIM.WebHostSample* file. Select **Publish**.

    ![cloud publish](media/use-scim-to-build-users-and-groups-endpoints/cloud-publish.png)

    > [!NOTE]
    > To run this solution locally, double-click the project and select **IIS Express** to launch the project as a web page with a local host URL.

1. Select **Create profile** and make sure **App Service** and **Create new** are selected.

	![cloud publish 2](media/use-scim-to-build-users-and-groups-endpoints/cloud-publish-2.png)

1. Step through the dialog options and rename the app to a name of your choice. This name is used in both the app and the SCIM endpoint URL.

	![cloud publish 3](media/use-scim-to-build-users-and-groups-endpoints/cloud-publish-3.png)

1. Select the resource group to use and choose **Publish**.

1. Navigate to the application in **Azure App Services** > **Configuration** and select **New application setting** to add the *Token__TokenIssuer* setting with the value `https://sts.windows.net/<tenant_id>/`. Replace `<tenant_id>` with your Azure AD tenant_id and if you're looking to test the SCIM endpoint using [Postman](https://github.com/AzureAD/SCIMReferenceCode/wiki/Test-Your-SCIM-Endpoint), also add a *ASPNETCORE_ENVIRONMENT* setting with the value `Development`. 

   ![appservice settings](media/use-scim-to-build-users-and-groups-endpoints/app-service-settings.png)

   When testing your endpoint with an Enterprise Application in the Azure portal, choose to keep the environment as `Development` and provide the token generated from the `/scim/token` endpoint for testing or change the environment to `Production` and leave the token field empty in the enterprise application in the [Azure portal](https://docs.microsoft.com/azure/active-directory/app-provisioning/use-scim-to-provision-users-and-groups#step-4-integrate-your-scim-endpoint-with-the-azure-ad-scim-client). 

That's it! Your SCIM endpoint is now published and allows you to use the Azure App Service URL to test the SCIM endpoint.

## Test your SCIM endpoint

The requests to a SCIM endpoint require authorization and the SCIM standard leaves multiple options for authentication and authorization, such as cookies, basic authentication, TLS client authentication, or any of the methods listed in [RFC 7644](https://tools.ietf.org/html/rfc7644#section-2).

Be sure to avoid insecure methods, such as username/password, in favor of a more secure method such as OAuth. Azure AD supports long-lived bearer tokens (for gallery and non-gallery applications) and the OAuth authorization grant (for applications published in the app gallery).

> [!NOTE]
> The authorization methods provided in the repo are for testing only. When integrating with Azure AD, you can review the authorization guidance, see [Plan provisioning for a SCIM endpoint](https://docs.microsoft.com/azure/active-directory/app-provisioning/use-scim-to-provision-users-and-groups#authorization-for-provisioning-connectors-in-the-application-gallery). 

The development environment enables features unsafe for production, such as reference code to control the behavior of the security token validation. The token validation code is configured to use a self-signed security token and the signing key is stored in the configuration file, see the **Token:IssuerSigningKey** parameter in the *appsettings.Development.json* file.

```json
"Token": {
    "TokenAudience": "Microsoft.Security.Bearer",
    "TokenIssuer": "Microsoft.Security.Bearer",
    "IssuerSigningKey": "A1B2C3D4E5F6A1B2C3D4E5F6",
    "TokenLifetimeInMins": "120"
}
```

> [!NOTE]
> By sending a **GET** request to the `/scim/token` endpoint, a token is issued using the configured key and can be used as bearer token for subsequent authorization.

The default token validation code is configured to use a token issued by Azure Active Directory and requires the issuing tenant be configured using the **Token:TokenIssuer** parameter in the *appsettings.json* file.

``` json
"Token": {
    "TokenAudience": "8adf8e6e-67b2-4cf2-a259-e3dc5476c621",
    "TokenIssuer": "https://sts.windows.net/<tenant_id>/"
}
```

### Use Postman to test endpoints

After the SCIM endpoint is deployed, you can test to ensure it is SCIM RFC compliant. This example provides a set of tests in **Postman** to validate CRUD operations on users and groups, filtering, updates to group membership, and disabling users.

The endpoints are located in the `{host}/scim/` directory and can be interacted with using standard HTTP requests. To modify the `/scim/` route, see *ControllerConstant.cs* in **AzureADProvisioningSCIMreference** > **ScimReferenceApi** > **Controllers**.

> [!NOTE]
> You can only use HTTP endpoints for local tests as the Azure AD provisioning service requires your endpoint support HTTPS.

#### Open Postman and run tests

1. Download [Postman](https://www.getpostman.com/downloads/) and start application.
1. Copy the link [https://aka.ms/ProvisioningPostman](https://aka.ms/ProvisioningPostman) and paste into Postman to import the test collection.

	![postman collection](media/use-scim-to-build-users-and-groups-endpoints/postman-collection.png)

1. Create a test environment with the variables below:

   |Environment|Variable|Value|
   |-|-|-|
   |Run project locally using IIS Express|||
   ||**Server**|`localhost`|
   ||**Port**|`:44359` *(don't forget the **:**)*|
   ||**Api**|`scim`|
   |Run project locally using Kestrel|||
   ||**Server**|`localhost`|
   ||**Port**|`:5001` *(don't forget the **:**)*|
   ||**Api**|`scim`|
   |Hosting the endpoint in Azure|||
   ||**Server**|*(input your SCIM URL)*|
   ||**Port**|*(leave blank)*|
   ||**Api**|`scim`|

1. Use **Get Key** from the Postman Collection to send a **GET** request to the token endpoint and retrieve a security token to be stored in the **token** variable for subsequent requests. 

   ![postman get key](media/use-scim-to-build-users-and-groups-endpoints/postman-get-key.png)

   > [!NOTE]
   > To make a SCIM endpoints secure, you need a security token before connecting, and the tutorial uses the `{host}/scim/token` endpoint to generate a self-signed token.

That's it! You can now run the **Postman** collection to test the SCIM endpoint functionality.

## Next Steps

To develop a SCIM-compliant user and group endpoint with interoperability for a client, see the [SCIM client implementation](http://www.simplecloud.info/#Implementations2).

> [!div class="nextstepaction"]
> [Tutorial: Develop and plan provisioning for a SCIM endpoint](use-scim-to-provision-users-and-groups.md)
> [Tutorial: Configure provisioning for a gallery app](configure-automatic-user-provisioning-portal.md)