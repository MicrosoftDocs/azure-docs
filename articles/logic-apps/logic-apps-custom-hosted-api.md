---
title: Call custom APIs in Azure Logic Apps | Microsoft Docs
description: Call into your own custom APIs hosted on Azure App Service with Azure Logic Apps
author: stepsic-microsoft-com
manager: anneta
editor: ''
services: logic-apps
documentationcenter: ''

ms.assetid: f113005d-0ba6-496b-8230-c1eadbd6dbb9
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/31/2016
ms.author: stepsic

---
# Call custom APIs hosted on Azure App Service with Azure Logic Apps

Although Azure Logic Apps offers 40+ connectors for various services, 
you might want to call into your own custom API that can run your own code. 
Azure App Service provides one of the easiest and most scalable ways for hosting your own custom web APIs. 
This article covers how to call into any web API hosted in an App Service API app, web app, or mobile app.
Learn [how to build APIs as a trigger or action in logic apps](../logic-apps/logic-apps-create-api-app.md).

## Deploy your web app

First, you must deploy your API as a web app in Azure App Service. 
Learn about [basic deployment when you create an ASP.NET web app](../app-service-web/app-service-web-get-started-dotnet.md). 
While you can call into any API from a logic app, 
for the best experience, we recommend that you add 
Swagger metadata to integrate easily with logic app actions. 
Learn about [adding Swagger metadata](../app-service-api/app-service-api-dotnet-get-started.md#use-swagger-api-metadata-and-ui).

### API settings

For Logic App Designer to parse your Swagger, 
you must enable CORS and set the API Definition properties for your web app. 

1.	In the Azure portal, select your web app.
2.	In the blade that opens, find **API**, and select **API definition**. 
Set the **API definition location** to your swagger.json file's URL.

	Usually, this URL is https://{name}.azurewebsites.net/swagger/docs/v1).

3.	To allow requests from Logic App Designer, under **API**, 
select **CORS**, and set a CORS policy for '*'.

## Call into your custom API

If you set up CORS and the API Definition properties, 
you should be able to easily add Custom API actions to your workflow in the Logic Apps portal. 
In the Logic Apps Designer, 
you can browse your subscription websites to list the websites that have a defined Swagger URL. 
You can also point to a Swagger and list the available actions and inputs by using the HTTP + Swagger action. 
Finally, you can always create a request using the HTTP action to call any API, 
even APIs that don't have or expose a Swagger doc.

To secure your API, you have a couple different ways to do that:

*	No code changes required. You can use Azure Active Directory 
to protect your API without requiring any code changes or redeployment.
*	In your API's code, enforce Basic Authentication, 
Azure Active Directory authentication, or Certificate Authentication.

## Secure calls to your API without changing code

In this section, you will create two Azure Active Directory applications – 
one for your logic app and one for your web app. 
Authenticate calls to your web app by using 
the service principal (client id and secret) associated 
with your logic app's Azure Active Directory app. 
Finally, include the application IDs in your logic app definition.

### Part 1: Set up an application identity for your logic app

Your logic app uses this application identity to authenticate against Azure Active Directory. 
You only have to set up this identity once for your directory. 
For example, you can choose to use the same identity for all your logic apps, 
although you can also create unique identities per logic app. 
You can set up these identities either in the Azure portal or use PowerShell.

#### Create the application identity in the Azure classic portal

1. In the Azure classic portal, go to your 
[Azure Active Directory](https://manage.windowsazure.com/#Workspaces/ActiveDirectoryExtension/directory). 
2. Select the directory that you use for your web app.
3. Choose the **Applications** tab. In the command bar at the bottom of the page, choose **Add**.
5. Give your app identity a name, and click the next arrow.
6. Under **App properties**, put in a unique string formatted as a domain, and click the checkmark.
7. Choose the **Configure** tab. Go to **Client ID**, and copy the client ID for use in your logic app.
8. Under **Keys**, open the **Select duration** list, and select the duration time for your key.
9. At the bottom of the page, click **Save**. You might have to wait a few seconds.
10. Make sure to copy the key that now appears under **Keys**, so you can use this key in your logic app.

#### Create the application identity using PowerShell

1. `Switch-AzureMode AzureResourceManager`
2. `Add-AzureAccount`
3. `New-AzureADApplication -DisplayName "MyLogicAppID" -HomePage "http://someranddomain.tld" -IdentifierUris "http://someranddomain.tld" -Password "Pass@word1!"`
4. Make sure to copy the **Tenant ID**, the **Application ID**, and the password you used.

### Part 2: Protect your web app with an Azure Active Directory app identity

If your web app is already deployed, 
you can enable authorization in the Azure portal. 
Otherwise, you can make enabling authorization part of your Azure Resource Manager deployment.

#### Enable authorization in the Azure portal

1. Find and select your web app. 
Under **Settings**, choose **Authentication/Authorization**.
2. Under **App Service Authentication**, turn authentication **On**, 
and choose **Save**.

At this point, an Application is automatically created for you. 
You need this Application's Client ID for Part 3, so you must follow these steps:

1. In the Azure classic portal, go to your 
[Azure Active Directory](https://manage.windowsazure.com/#Workspaces/ActiveDirectoryExtension/directory).
2.	Select your directory.
3. In the search box, find your app.
4. In the list, select your app.
5. Choose the **Configure** tab 
where you should see the **Client ID**.

#### Deploy your web app using an Azure Resource Manager template

First, you must create an Application for your web app 
that's different from the Application that you use for your logic app. 
Start by following the previous steps in Part 1, 
but for **HomePage** and **IdentifierUris**, 
use your web app's actual https://**URL**.

> [!NOTE]
> When you create the Application for your web app, 
> you must use the [Azure classic portal](https://manage.windowsazure.com/#Workspaces/ActiveDirectoryExtension/directory). 
> The PowerShell commandlet doesn't set up the required permissions to sign users into a website.

After you have the client ID and tenant ID, 
include this part as a sub resource of your web app 
in your deployment template:

```
"resources": [
    {
        "apiVersion": "2015-08-01",
        "name": "web",
        "type": "config",
        "dependsOn": ["[concat('Microsoft.Web/sites/','parameters('webAppName'))]"],
        "properties": {
            "siteAuthEnabled": true,
            "siteAuthSettings": {
              "clientId": "<<clientID>>",
              "issuer": "https://sts.windows.net/<<tenantID>>/",
            }
        }
    }
]
```

To automatically run a deployment that deploys a blank web app 
and logic app together that use Azure Active Directory, 
click **Deploy to Azure**:

[![Deploy to Azure](media/logic-apps-custom-hosted-api/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-logic-app-custom-api%2Fazuredeploy.json)

For the complete template, see 
[Logic app calls into a custom API hosted on App Service and protected by Azure Active Directory](https://github.com/Azure/azure-quickstart-templates/blob/master/201-logic-app-custom-api/azuredeploy.json).

### Part 3: Populate the Authorization section in your logic app

In the **Authorization** section of the **HTTP** action:

`{"tenant":"<<tenantId>>", "audience":"<<clientID from Part 2>>", "clientId":"<<clientID from Part 1>>","secret": "<<Password or Key from Part 1>>","type":"ActiveDirectoryOAuth" }`

| Element | Description |
| ------- | ----------- |
| type |Type of authentication. For ActiveDirectoryOAuth authentication, the value is `ActiveDirectoryOAuth`. |
| tenant |The tenant identifier used to identify the AD tenant. |
| audience |Required. The resource you are connecting to. |
| clientID |The client identifier for the Azure AD application. |
| secret |Required. Secret of the client that is requesting the token. |

The previous template has this authorization section set up already, 
but if you are authoring the logic app directly, 
you must include the full authorization section.

## Secure your API in code

### Certificate authentication

You can use client certificates to validate the incoming requests to your web app. 
For how to set up your code, see 
[How to configure TLS mutual authentication for web app](../app-service-web/app-service-web-configure-tls-mutual-auth.md).

In the **Authorization** section, you should include: 

`{"type": "clientcertificate","password": "test","pfx": "long-pfx-key"}`

| Element | Description |
| ------- | ----------- |
| type |Required. Type of authentication. For SSL client certificates, the value must be `ClientCertificate`. |
| pfx |Required. Base64-encoded contents of the PFX file. |
| password |Required. Password to access the PFX file. |

### Basic authentication

To validate the incoming requests, you can use basic authentication, 
such as username and password. Basic authentication is a common pattern, 
and you can use this authentication in any language used to build your app.

In the **Authorization** section, you should include:

`{"type": "basic","username": "test","password": "test"}`.

| Element | Description |
| --- | --- |
| type |Required. Type of authentication. For Basic authentication, the value must be `Basic`. |
| username |Required. Username to authenticate. |
| password |Required. Password to authenticate. |

### Handle Azure Active Directory authentication in code

By default, the Azure Active Directory authentication that you enable 
in the Azure portal doesn't provide fine-grained authorization. 
For example, this authentication doesn't lock your API to a specific user or app, 
but just to a particular tenant.

To restrict your API to your logic app, for example, 
in code, extract the header that has the JWT. 
Check the caller's identity, and reject requests that don't match.

Going further, to implement this authentication entirely in your own code, 
and not use the Azure portal feature, see 
[Authenticate with on-premises Active Directory in your Azure app](../app-service-web/web-sites-authentication-authorization.md).
To create an Application identity for your logic app and use that identity to call your API, 
you must follow the previous steps.