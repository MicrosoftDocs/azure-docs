# Scenario - Sign-in users in a Web App

## Scenario

### Overview

You add authentication to your Web App, so that it can sign in users. Adding authentication enables your web app to access limited profile information, and, for instance customize the experience you offer to its users. Web apps authenticate a user in a web browser. In this scenario, the web application directs the user’s browser to sign them in to Azure AD. Azure AD returns a sign-in response through the user’s browser, which contains claims about the user in a security token. Signing-in users leverage the [Open ID Connect](./v2-protocols-oidc.md) standard protocol itself simplified by the use of middleware [libraries](#libraries-used-to-protect-web-apps).

![Web app signs-in users](./media/scenario-webapp/scenario-webapp-signs-in-users.svg)

As a second step you can also enable your application to call Web APIs on behalf of the signed-in user. This is a different scenario, which you'll find in [Web App calls Web APIs](./scenario-webapp-calls-webapi.md)

> [!NOTE]
> Adding sign-in to a Web App is about protecting the Web App, and validating a user token, which is what  **middleware** libraries do. This scenario does not require yet the Microsoft Authentication Libraries (MSAL), which are about acquiring a token to call protected APIs. The authentication libraries will only be introduced in the follow-up scenario when the Web app needs to call web APIs.

### Specifics

- During the Application registration, you'll need to provide one, or several (if you deploy your app to several locations) Reply URIs. In some cases (ASP.NET/ASP.NET Core), you'll need to enable the IDToken. Finally you'll want to set up a sign-out URI so that your application reacts to users signing-out.
- In the code for your application, you'll need to provide the authority to which you web app delegates sign-in, and you might want to customize token validation (in particular in ISV scenarios).
- Web applications support any account types. See [Supported account types](./v2-supported-account-types.md)

## App registration for Web Apps

To register your application, you can use:

- the [Web App Quickstarts](#register-an-app-using-the-quickstarts). In addition to being a great first experience with creating application, the Quickstarts in the portal contain a button **Make this change for me**, which sets the properties you need. You will however need to adapt the values of these properties to your own case (in particular the Web API URL for your app is probably going to be different from the proposed default, which will also impact the sign out URI)
- the Azure portal to [register your application manually](#register-an-app-using-azure-portal)
- PowerShell and command-line tools.

### Register an app using the QuickStarts

# [APS.NET Core](#tab/aspnetcore)

<!-- Todo: provide the deep link to the portal -->
See [Quickstart: Add sign-in with Microsoft to an ASP.NET Core web app](./quickstart-v2-aspnet-core-webapp.md)

# [APS.NET](#tab/aspnet)

See [Quickstart: Add sign-in with Microsoft to an ASP.NET web app](./quickstart-v2-aspnet-webapp.md)

___

### Register an app using Azure portal

> [!NOTE]
> the portal to use is different depending on if your application runs in the Microsoft Azure public cloud or in a national or sovereign cloud. For more information, see [National Clouds](./authentication-national-cloud.md#app-registration-endpoints)

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account. Alternatively sign in to the national cloud Azure portal of choice.
1. If your account gives you access to more than one tenant, select your account in the top-right corner, and set your portal session to the desired Azure AD tenant.
1. In the left-hand navigation pane, select the **Azure Active Directory** service, and then select **App registrations** > **New registration**.
1. When the **Register an application** page appears, enter your application's registration information:
   - choose the supported account types for your application (See [Supported Account types](./v2-supported-account-types.md))
   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `AspNetCore-WebApp`.
   - In **Reply URL**, add the reply URL for your app, for instance `https://localhost:44321/`, and select **Register**.
1. Select the **Authentication** menu, and then add the following information:
- In **Reply URL**, add `https://localhost:44321/signin-oidc`,  and select **Register**.
- In the **Advanced settings** section, set **sign out URL** to `https://localhost:44321/signout-oidc`.
- Under **Implicit grant**, check **ID tokens**.
- Select **Save**.

### Register an app using PowerShell

> [!NOTE]
> Currently Azure AD PowerShell only creates applications with the following supported account types:
>
> - MyOrg (Accounts in this organizational directory only) 
> - AnyOrg (Accounts in any organizational directory).
> 
> If you want to create an application that signs-in users with their personal Microsoft Accounts (e.g. Skype, XBox, Outlook.com), you can first create a multi-tenant application (Supported account types = Accounts in any organizational directory), and then change the `signInAudience` property in the application manifest from the Azure portal. This is explained in details in the step [1.3]() of the ASP.NET Core tutorial (and can be generalized to Web Apps in any language).
> In the future PowerShell and CLI tools will create applications for any audience

## Libraries used to protect Web Apps

<!-- This section can be in an include for Web App and Web APIs -->
The libraries used to protect a Web App (and a Web API) are:

  Platform | Library | Description
  ------------ | ---------- | ------------
![.NET](media/sample-v2-code/logo_net.png) | [Identity model extensions for .NET](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/wiki) | Used directly by ASP.NET and ASP.NET Core, Microsoft Identity Extensions for .NET proposes a set of DLLs running both on .NET Framework and .NET Core. From an ASP.NET/ASP.NET Core Web app, you can control token validation using the **TokenValidationParameters** class (in particular in some ISV scenarios)
![Node.JS](media/sample-v2-code/logo_nodejs.png) | [Passport.Azure AD](https://github.com/AzureAD/passport-azure-ad) | @Brandon: how would we describe passport.node?
![Python](media/sample-v2-code/logo_python.png) | ? | @Navya: Do we have a recommended Middleware for Python?
![Java](media/sample-v2-code/logo_java.png) |  ??? | @Navya: Do we have a recommended Middleware for Java?

## Web Application code configuration

# [APS.NET Core](#tab/aspnetcore)

### Application configuration files

In ASP.NET Core, a Web application signing-in users with the Microsoft identity platform is configured through the `appsettings.json` file. The settings that you need to fill in are:

- the cloud `Instance` if you want your app to run in national clouds
- the audience in `tenantId`
- the `clientId` for your application, as copied from the Azure portal.

```JSon
{
  "AzureAd": {
    // Azure Cloud instance among:
    // "https://login.microsoftonline.com/" for Azure Public cloud.
    // "https://login.microsoftonline.us/" for Azure US government.
    // "https://login.microsoftonline.de/" for Azure AD Germany
    // "https://login.chinacloudapi.cn/" for Azure AD China operated by 21Vianet 
    "Instance": "https://login.microsoftonline.com/",

    // Azure AD Audience among:
    // - the tenant Id as a a GUID obtained from the azure portal to sign-in users in your organization
    // - "organizations" to sign-in users in any work or school accounts
    // - "common" to sign-in users with any work and school account or Microsoft personal account
    // - "consumers" to sign-in users with Microsoft personal account only
    "TenantId": "[Enter the tenantId here]]",

    // Client Id (Application ID) obtained from the Azure portal
    "ClientId": "[Enter the Client Id]",
    "CallbackPath": "/signin-oidc",
    "SignedOutCallbackPath ": "/signout-callback-oidc"
  }
}
```

In ASP.NET Core, there is another file that contains the URL (`applicationUrl`) and the SSL Port (`sslPort`) for your application as well as various profiles.

```JSon
{
  "iisSettings": {
    "windowsAuthentication": false,
    "anonymousAuthentication": true,
    "iisExpress": {
      "applicationUrl": "http://localhost:3110/",
      "sslPort": 44321
    }
  },
  "profiles": {
    "IIS Express": {
      "commandName": "IISExpress",
      "launchBrowser": true,
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
    "webApp": {
      "commandName": "Project",
      "launchBrowser": true,
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      },
      "applicationUrl": "http://localhost:3110/"
    }
  }
}
```

The Reply URIs that you need to register in the Authentication page for your application in the Azure portal needs to match these, that is, for the two configuration files above, they would be `https://localhost:44321/signin-oidc` as:

- the applicationUrl is `http://localhost:3110`, 
- but the `sslPort` is specified (44321),
- and the `CallbackPath` is `/signin-oidc` as defined in the `appsettings.json`.
  
In the same way, the sign out URI would be set to `https://localhost:44321/signout-callback-oidc`

### Initialization code

The code performing the application initialization is located in the `Startup.cs` file, and, to add authentication with the Microsoft Identity platform (formerly Azure AD) v2.0, you'll need to add the following code. The comments in the code should be self-explanatory.

```CSharp
 services.AddAuthentication(AzureADDefaults.AuthenticationScheme)
         .AddAzureAD(options => configuration.Bind("AzureAd", options));

 services.Configure<OpenIdConnectOptions>(AzureADDefaults.OpenIdScheme, options =>
 {
  // The ASP.NET core templates are currently using Azure AD v1.0, and compute
  // the authority (as {Instance}/{TenantID}). We want to use the Microsoft Identity Platform v2.0 endpoint
  options.Authority = options.Authority + "/v2.0/";

  // If you want to restrict the users that can sign-in to specific organizations
  // Set the tenant value in the appsettings.json file to 'organizations', and add the
  // issuers you want to accept to options.TokenValidationParameters.ValidIssuers collection.
  // Otherwise validate the issuer
  options.TokenValidationParameters.IssuerValidator = AadIssuerValidator.ForAadInstance(options.Authority).ValidateAadIssuer;

  // Set the nameClaimType to be preferred_username.
  // This change is needed because certain token claims from Azure AD v1.0 endpoint
  // (on which the original .NET core template is based) are different in Azure AD v2.0 endpoint. 
  // For more details see [ID Tokens](https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens) 
  // and [Access Tokens](https://docs.microsoft.com/en-us/azure/active-directory/develop/access-tokens)
  options.TokenValidationParameters.NameClaimType = "preferred_username";
  ...
```

# [APS.NET](#tab/aspnet)

In ASP.NET, the application is configured through the `Web.Config` file

```XML
<?xml version="1.0" encoding="utf-8"?>
<!--
  For more information on how to configure your ASP.NET application, please visit
  http://go.microsoft.com/fwlink/?LinkId=301880
  -->
<configuration>
  <appSettings>
    <add key="webpages:Version" value="3.0.0.0" />
    <add key="webpages:Enabled" value="false" />
    <add key="ClientValidationEnabled" value="true" />
    <add key="UnobtrusiveJavaScriptEnabled" value="true" />
    <add key="ida:ClientId" value="[Enter your client ID, as obtained from the app registration portal]" />
    <add key="ida:ClientSecret" value="[Enter your client secret, as obtained from the app registration portal]" />
    <add key="ida:AADInstance" value="https://login.microsoftonline.com/{0}{1}" />
    <add key="ida:RedirectUri" value="https://localhost:44326/" />
    <add key="vs:EnableBrowserLink" value="false" />
  </appSettings>
```

The code related to authentication is located in the `App_Start/Startup.Auth.cs` file.

```CSharp
 public void ConfigureAuth(IAppBuilder app)
 {
  app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

  app.UseCookieAuthentication(new CookieAuthenticationOptions());

  app.UseOpenIdConnectAuthentication(
    new OpenIdConnectAuthenticationOptions
    {
     // The `Authority` represents the v2.0 endpoint - https://login.microsoftonline.com/common/v2.0
     // The `Scope` describes the initial permissions that your app will need.
     //  See https://azure.microsoft.com/documentation/articles/active-directory-v2-scopes/
     ClientId = clientId,
     Authority = String.Format(CultureInfo.InvariantCulture, aadInstance, "common", "/v2.0"),
     RedirectUri = redirectUri,
     Scope = "openid profile",
     PostLogoutRedirectUri = redirectUri,
    });
 }
```

<!-- 
# [Python](#tab/python)
```Python
{
    "authority": "https://login.microsoftonline.com/organizations",
    "client_id": "your_client_id",
}

# [Java](#tab/java)

# [Node.JS](#tab/node.js)
-->
___

## Sign-out

Once the user has signed-in to your app, you probably want them to be able to sign out. ASP.NET core handles this for you.

## Next steps

Here are a few links to learn more:

# [.NET](#tab/aspnetcore)

To learn more:

- Try the quickstart: [Quickstart: Add sign-in with Microsoft to an ASP.NET Core web app](./quickstart-v2-aspnet-core-webapp.md)
- Tutorial: [ms-identity-aspnetcore-webapp-tutorial](https://github.com/Azure-Samples/ms-identity-aspnetcore-webapp-tutorial) is a progressive tutorial with production ready code for a Web app including how to add sign-in
  ![Tutorial overview](https://github.com/Azure-Samples/ms-identity-aspnetcore-webapp-tutorial/raw/master/ReadmeFiles/Tutorial-overview.svg)

# [.NET](#tab/aspnet)

# [REST](#tab/other)

The protocol documentation is available from [Open ID Connect](./v2-protocols-oidc.md).

<!-- 
# [Python](#tab/python)
-->

___

Once your web app signs-in users, it can now call Web APIs on behalf of the signed-in users. This is the topic of the following scenario [Web app calls web APIs](scenario-webapp-calls-webapi.md)