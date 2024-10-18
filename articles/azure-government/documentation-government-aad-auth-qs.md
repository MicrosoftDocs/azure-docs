---
title: Azure Government integrate Microsoft Entra authentication
description: This article demonstrates how to integrating Microsoft Entra authentication on Azure Government.
ms.service: azure-government
ms.topic: article
ms.date: 11/02/2021 
---

# Integrate Microsoft Entra authentication with Web Apps on Azure Government

The following quickstart helps you get started integrating Microsoft Entra authentication with applications on Azure Government. Microsoft Entra authentication on Azure Government is similar to the Azure commercial platform, with a [few exceptions](./compare-azure-government-global-azure.md).

Learn more about [Microsoft Entra authentication Scenarios](../active-directory/develop/authentication-vs-authorization.md). 

<a name='integrate-azure-ad-login-into-a-web-application-using-openid-connect'></a>

## Integrate Microsoft Entra login into a web application using OpenID Connect

This section shows how to integrate Microsoft Entra ID using the OpenID Connect protocol for signing in users into a web app. 

### Prerequisites 

- A Microsoft Entra tenant in Azure Government. You must have an [Azure Government subscription](https://azure.microsoft.com/overview/clouds/government/request/) in order to have a Microsoft Entra tenant in Azure Government. For more information on how to get a Microsoft Entra tenant, see [How to get a Microsoft Entra tenant](../active-directory/develop/quickstart-create-new-tenant.md) 
- A user account in your Microsoft Entra tenant. This sample does not work with a Microsoft account, so if you signed in to the Azure Government portal with a Microsoft account and have never created a user account in your directory before, you need to do that now.
- Have an [ASP.NET Core application deployed and running in Azure Government](documentation-government-howto-deploy-webandmobile.md)

<a name='step-1-register-your-web-application-with-your-azure-ad-tenant'></a>

### Step 1: Register your web application with your Microsoft Entra tenant 

1. Sign in to the [Azure Government portal](https://portal.azure.us).
2. On the top bar, click on your account and under the **Directory** list, choose the Active Directory tenant where you wish to register your application.
3. Click on **All Services** in the left-hand nav, and choose **Microsoft Entra ID**.
4. Click on **App registrations** and choose **Add**.
5. Enter the name for your application, and select 'Web Application and/or Web API' as the Application Type. For the sign-on URL, enter the base URL for your application, which is your Azure App URL + "/signin-oidc." 

    >[!Note] 
    > If you have not deployed your application and want to run it locally, your App URL would be your local host address.
    >
    >

    Click on **Create** to create the application.
6. While still in the Azure portal, choose your application, click on **Settings**, and choose **Properties**.
7. Find the Application ID value and copy it to the clipboard.
8. For the App ID URI, enter https://\<your_tenant_name\>/\<name_of_your_app\>, replacing \<your_tenant_name\> with the name of your Microsoft Entra tenant and \<name_of_your_app\> with the name of your application.

<a name='step-2--configure-your-app-to-use-your-azure-ad-tenant'></a>

### Step 2:  Configure your app to use your Microsoft Entra tenant

#### Azure Government Variations

The only variation when setting up Microsoft Entra Authorization on the Azure Government cloud is in the Microsoft Entra Instance:
- "https:\//login.microsoftonline.us"

#### Configure the InventoryApp project

1. Open your application in Visual Studio 2019.
2. Open the `appsettings.json` file.
3. Add an `Authentication` section and fill out the properties with your Microsoft Entra tenant information.
	
    ```cs
    //ClientId: Azure AD->  App registrations -> Application ID
    //Domain: <tenantname>.onmicrosoft.us
    //TenantId: Azure AD -> Properties -> Directory ID

    "Authentication": {
        "AzureAd": {

        "Azure ADInstance": "https://login.microsoftonline.us/",
        "CallbackPath": "/signin-oidc",
        "ClientId": "<clientid>",
        "Domain": "<domainname>",
        "TenantId": "<tenantid>"
        }
    }
    ```
4. Fill out the `ClientId` property with the Client ID for your app from the Azure Government portal. You can find the Client ID by navigating to Microsoft Entra ID -> App Registrations -> Your Application -> Application ID. 
5. Fill out the `TenantId` property with the Tenant ID for your app from the Azure Government portal. You can find the Tenant ID by navigating to Microsoft Entra ID -> Properties -> Directory ID. 
6. Fill out the `Domain` property with `<tenantname>.onmicrosoft.us`.
7. Open the `startup.cs` file.
8. In your `ConfigureServices` method, add the following code:

    ```cs
        public void ConfigureServices(IServiceCollection services)
        {      
            //Add Azure AD authentication
            services.AddAuthentication(options => {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
            })
            .AddCookie()
            .AddOpenIdConnect(options => {
                options.Authority = Configuration["Authentication:AzureAd:Azure ADInstance"] + Configuration["Authentication:AzureAd:TenantId"];
                options.ClientId = Configuration["Authentication:AzureAd:ClientId"];
                options.CallbackPath = Configuration["Authentication:AzureAd:CallbackPath"];
            });
        
        }
    ```

    In the same file, add this one line of code to the `Configure` method:

    ```csharp
    app.UseAuthentication();
    ```

9. Navigate to your **Home** controller or whichever controller file is your home page, **where you want your users to log in**. Add the `[Authorize]` tag before the class definition.

## Next steps

* Navigate to the [Azure Government PaaS Sample](https://github.com/Azure-Samples/gov-paas-sample) to see Microsoft Entra authentication as well as other services being integrated in an Application running on Azure Government. 
* Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/)
* Get help on Stack Overflow by using the "[azure-gov](https://stackoverflow.com/questions/tagged/azure-gov)" tag
