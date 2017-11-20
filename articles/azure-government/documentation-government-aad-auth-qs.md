---
title: Azure Government Integrating AAD Authentication | Microsoft Docs
description: Integrating AAD Authentication on Azure Government Quickstart
services: azure-government
cloud: gov
documentationcenter: ''
author: yujhongmicrosoft
manager: zakramer

ms.assetid: 47e5e535-baa0-457e-8c41-f9fd65478b38
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 11/2/2017
ms.author: yujhongmicrosoft

---
# Integrating AAD Authentication with Web Apps on Azure Government
The series of Quickstarts below will help you get started integrating AAD Authentication with applications on Azure Government. AAD Authentication on Azure Government is similar to the Azure commercial platform, with a [few exceptions](documentation-government-services-securityandidentity.md).

To learn more about Azure Active Directory Authentication Scenarios, click [here](../active-directory/develop/active-directory-authentication-scenarios.md). 

## Integrate Azure AD Login into a web application using OpenID Connect
This section shows how to integrate Azure AD using the OpenID Connect protocol for signing in users into a web app. 

### Prerequisites 
- An Azure Active Directory (Azure AD) tenant in Azure Government. You must have an [Azure Government subscription](https://azure.microsoft.com/overview/clouds/government/request/) in order to have an AAD tenant in Azure Government. For more information on how to get an Azure AD tenant, see [How to get an Azure AD tenant](https://azure.microsoft.com/en-us/documentation/articles/active-directory-howto-tenant/) 
- A user account in your Azure AD tenant. This sample does not work with a Microsoft account, so if you signed in to the Azure Government portal with a Microsoft account and have never created a user account in your directory before, you need to do that now.
- Have an [ASP.NET Core application deployed and running in Azure Government](documentation-government-howto-deploy-webandmobile.md)

### Step 1: Register your web application with your AAD Tenant 

1. Sign in to the [Azure Government portal](https://portal.azure.us).
2. On the top bar, click on your account and under the **Directory** list, choose the Active Directory tenant where you wish to register your application.
3. Click on **More Services** in the left-hand nav, and choose **Azure Active Directory**.
4. Click on **App registrations** and choose **Add**.
5. Enter the name for your application, and select 'Web Application and/or Web API' as the Application Type. For the sign-on URL, enter the base URL for your application, which is your Azure App URL + "/signin-oidc." 

    >[!Note] 
    > If you have not deployed your application and want to run it locally, your App URL would be your local host address.
    >
    >

    Click on **Create** to create the application.
6. While still in the Azure portal, choose your application, click on **Settings**, and choose **Properties**.
7. Find the Application ID value and copy it to the clipboard.
8. For the App ID URI, enter https://\<your_tenant_name\>/\<name_of_your_app\>, replacing \<your_tenant_name\> with the name of your Azure AD tenant and \<name_of_your_app\> with the name of your application.

### Step 2:  Configure your app to use your Azure AD tenant
#### Azure Government Variations
The only variation when setting up AAD Authorization on the Azure Government cloud is in the AAD Instance:
 - "https://login.microsoftonline.us"

#### Configure the InventoryApp project
1. Open your application in Visual Studio 2017.
2. Open the `appsettings.json` file.
3. Add an `Authentication` section. You will be filling out the properties with your AAD tenant information.
	
	```cs
    //ClientId: AAD->  App registrations -> Application ID
    //Domain: <tenantname>.onmicrosoft.com
    //TenantId: AAD -> Properties -> Directory ID

    "Authentication": {
        "AzureAd": {

        "AADInstance": "https://login.microsoftonline.us/",
        "CallbackPath": "/signin-oidc",
        "ClientId": "<clientid>",
        "Domain": "<domainname>",
        "TenantId": "<tenantid>"
        }
    }
    ```
4. Fill out the `ClientId` property with the Client ID for your app from the Azure Government portal. You can find the Client ID by navigating to AAD -> App Registrations -> Your Application -> Application ID. 
5. Fill out the `TenantId` property with the Tenant ID for your app from the Azure Government portal. You can find the Tenant ID by navigating to AAD -> Properties -> Directory ID. 
6. Fill out the `Domain` property with "<tenantname>.onmicrosoft.com."
6. Open the `startup.cs` file.
7. In your `ConfigureServices` method, add the following code:

    ```cs
        public void ConfigureServices(IServiceCollection services)
        {      
            //Add AAD authentication
            services.AddAuthentication(options => {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
            })
            .AddCookie()
            .AddOpenIdConnect(options => {
                options.Authority = Configuration["Authentication:AzureAd:AADInstance"] + Configuration["Authentication:AzureAd:TenantId"];
                options.ClientId = Configuration["Authentication:AzureAd:ClientId"];
                options.CallbackPath = Configuration["Authentication:AzureAd:CallbackPath"];
            });
        
        }
    ```

In the same file, add this one line of code to the `Configure` method:

    ```cs
    app.UseAuthentication();
    ```
8. Navigate to your **Home** controller or whichever controller file is your home page, **where you want your users to log in**. Add the `[Authorize]` tag before the class definition.

## Next Steps

* Navigate to the [Azure Government PaaS Sample](https://github.com/yujhongmicrosoft/gov-paas-sample 
) to see AAD Authentication as well as other services being integrated in an Application running on Azure Government. 
* Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/)
* Get help on Stack Overflow by using the "[azure-gov](https://stackoverflow.com/questions/tagged/azure-gov)" tag
* Give us feedback or request new features via the [Azure Government feedback forum](https://feedback.azure.com/forums/558487-azure-government)
