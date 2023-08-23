---
title: Register a web app that signs in users
description: Learn how to register a web app that signs in users
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 12/6/2022
ms.author: cwerner
ms.reviewer: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a web app that signs in users by using the Microsoft identity platform.
---

# Web app that signs in users: App registration

This article explains the app registration steps for a web app that signs in users.

To register your application, you can use:

- The [web app quickstarts](#register-an-app-by-using-the-quickstarts). In addition to being a great first experience with creating an application, quickstarts in the Azure portal contain a button named **Make this change for me**. You can use this button to set the properties you need, even for an existing app. Adapt the values of these properties to your own case. In particular, the web API URL for your app is probably going to be different from the proposed default, which will also affect the sign-out URI.
- The Azure portal to [register your application manually](#register-an-app-by-using-the-azure-portal).
- PowerShell and command-line tools.

## Register an app by using the quickstarts

You can use these links to bootstrap the creation of your web application:

- [ASP.NET Core](https://aka.ms/aspnetcore2-1-aad-quickstart-v2)
- [ASP.NET](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/applicationsListBlade/quickStartType/AspNetWebAppQuickstartPage/sourceType/docs)

## Register an app by using the Azure portal

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

> [!NOTE]
> The portal to use is different depending on whether your application runs in the Microsoft Azure public cloud or in a national or sovereign cloud. For more information, see [National clouds](./authentication-national-cloud.md#app-registration-endpoints).

1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>. 
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="./media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the tenant in which you want to register the application.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations** > **New registration**.

# [ASP.NET Core](#tab/aspnetcore)

1. When the **Register an application** page appears, enter your application's registration information:
   1. Enter a **Name** for your application, for example `AspNetCore-WebApp`. Users of your app might see this name, and you can change it later.
   1. Choose the supported account types for your application. (See [Supported account types](./v2-supported-account-types.md).)
   1. For **Redirect URI**, add the type of application and the URI destination that will accept returned token responses after successful authentication. For example, enter `https://localhost:44321`.
   1. Select **Register**.
1. Under **Manage**, select **Authentication** and then add the following information:
   1. In the **Web** section, add `https://localhost:44321/signin-oidc` as a **Redirect URI**.
   1. In **Front-channel logout URL**, enter `https://localhost:44321/signout-oidc`.
   1. Under **Implicit grant and hybrid flows**, select **ID tokens**.
   1. Select **Save**.
   
# [ASP.NET](#tab/aspnet)

1. When the **Register an application page** appears, enter your application's registration information:
   1. Enter a **Name** for your application, for example `MailApp-openidconnect-v2`. Users of your app might see this name, and you can change it later.
   1. Choose the supported account types for your application. (See [Supported account types](./v2-supported-account-types.md).)
   1. In the **Redirect URI (optional)** section, select **Web** in the combo box and enter a **Redirect URI** of `https://localhost:44326/`.
   1. Select **Register** to create the application.
1. Under **Manage**, select **Authentication**.
1. In the **Implicit grant and hybrid flows** section, select **ID tokens**. This sample requires the [implicit grant flow](v2-oauth2-implicit-grant-flow.md) to be enabled to sign in the user.
1. Select **Save**.

# [Java](#tab/java)

1. When the **Register an application page** appears, enter your application's registration information: 
    1. Enter a **Name** for your application, for example `java-webapp`. Users of your app might see this name, and you can change it later. 
    1. Select **Accounts in any organizational directory and personal Microsoft Accounts**.
    1. Select **Register** to register the application.
1. Under **Manage**, select **Authentication** > **Add a platform**.
1. Select **Web**.
1. For **Redirect URI**, enter the same host and port number, followed by `/msal4jsample/secure/aad` for the sign-in page. 
1. Select **Configure**.
1. In the **Web** section, use the host and port number, followed by `/msal4jsample/graph/me` as a **Redirect URI** for the user information page.
By default, the sample uses:
   - `http://localhost:8080/msal4jsample/secure/aad`
   - `http://localhost:8080/msal4jsample/graph/me`

1. Select **Save**.
1. Under **Manage**, select **Certificates & secrets**.
1. In the **Client secrets** section, select **New client secret**, and then:

   1. Enter a key description.
   1. Select the key duration **In 1 year**.
   1. Select **Add**.
   1. When the key value appears, copy it for later. This value won't be displayed again or be retrievable by any other means.

# [Node.js](#tab/nodejs)

1. When the **Register an application page** appears, enter your application's registration information:
   1. Enter a **Name** for your application, for example `node-webapp`. Users of your app might see this name, and you can change it later.
   1. Change **Supported account types** to **Accounts in this organizational directory only**.
   1. In the **Redirect URI (optional)** section, select **Web** in the combo  box and enter the following redirect URI: `http://localhost:3000/auth/redirect`.
   1. Select **Register** to create the application.
1. On the app's **Overview** page, find the **Application (client) ID** value and record it for later. You'll need it to configure the configuration file for this project.
1. Under **Manage**, select **Certificates & secrets**.
1. In the **Client Secrets** section, select **New client secret**, and then:
   1. Enter a key description.
   1. Select a key duration of **In 1 year**.
   1. Select **Add**.
   1. When the key value appears, copy it. You'll need it later.

# [Python](#tab/python)

1. When the **Register an application page** appears, enter your application's registration information:
   1. Enter a **Name** for your application, for example `python-webapp`. Users of your app might see this name, and you can change it later.
   1. Change **Supported account types** to **Accounts in any organizational directory and personal Microsoft accounts (e.g. Skype, Xbox, Outlook.com)**.
   1. In the **Redirect URI (optional)** section, select **Web** in the combo  box and enter the following redirect URI: `http://localhost:5000/getAToken`.
   1. Select **Register** to create the application.
1. On the app's **Overview** page, find the **Application (client) ID** value and record it for later. You'll need it to configure the *.env* file for this project.
1. Under **Manage**, select **Certificates & secrets**.
1. In the **Client Secrets** section, select **New client secret**, and then:
   1. Enter a key description. Leave the default expiration.
   1. Select **Add**.
   1. Save the **Value** of the **Client Secret** in a safe location. You'll need it to configure the code, and you can't retrieve it later.
---

## Register an app by using PowerShell

You can also register an application with Microsoft Graph PowerShell, using the [New-MgApplication](/powershell/module/microsoft.graph.applications/new-mgapplication).

Here's an idea of the code. For a fully functioning code, see [this sample](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/master/1-WebApp-OIDC/1-3-AnyOrgOrPersonal/AppCreationScripts/Configure.ps1)

```PowerShell
# Connect to the Microsoft Graph API, non-interactive is not supported for the moment (Oct 2021)
Write-Host "Connecting to Microsoft Graph"
if ($tenantId -eq "") {
   Connect-MgGraph -Scopes "User.Read.All Organization.Read.All Application.ReadWrite.All" -Environment $azureEnvironmentName
}
else {
   Connect-MgGraph -TenantId $tenantId -Scopes "User.Read.All Organization.Read.All Application.ReadWrite.All" -Environment $azureEnvironmentName
}
   
$context = Get-MgContext
$tenantId = $context.TenantId

# Get the user running the script
$currentUserPrincipalName = $context.Account
$user = Get-MgUser -Filter "UserPrincipalName eq '$($context.Account)'"

# get the tenant we signed in to
$Tenant = Get-MgOrganization
$tenantName = $Tenant.DisplayName
   
$verifiedDomain = $Tenant.VerifiedDomains | where {$_.Isdefault -eq $true}
$verifiedDomainName = $verifiedDomain.Name
$tenantId = $Tenant.Id

Write-Host ("Connected to Tenant {0} ({1}) as account '{2}'. Domain is '{3}'" -f  $Tenant.DisplayName, $Tenant.Id, $currentUserPrincipalName, $verifiedDomainName)

# Create the webApp AAD application
Write-Host "Creating the AAD application (WebApp)"
# create the application 
$webAppAadApplication = New-MgApplication -DisplayName "WebApp" `
                                                   -Web `
                                                   @{ `
                                                         RedirectUris = "https://localhost:44321/", "https://localhost:44321/signin-oidc"; `
                                                         HomePageUrl = "https://localhost:44321/"; `
                                                         LogoutUrl = "https://localhost:44321/signout-oidc"; `
                                                      } `
                                                      -SignInAudience AzureADandPersonalMicrosoftAccount `
                                                   #end of command

$currentAppId = $webAppAadApplication.AppId
$currentAppObjectId = $webAppAadApplication.Id

$tenantName = (Get-MgApplication -ApplicationId $currentAppObjectId).PublisherDomain
#Update-MgApplication -ApplicationId $currentAppObjectId -IdentifierUris @("https://$tenantName/WebApp")
   
# create the service principal of the newly created application     
$webAppServicePrincipal = New-MgServicePrincipal -AppId $currentAppId -Tags {WindowsAzureActiveDirectoryIntegratedApp}

# add the user running the script as an app owner if needed
$owner = Get-MgApplicationOwner -ApplicationId $currentAppObjectId
if ($owner -eq $null)
{
   New-MgApplicationOwnerByRef -ApplicationId $currentAppObjectId  -BodyParameter = @{"@odata.id" = "htps://graph.microsoft.com/v1.0/directoryObjects/$user.ObjectId"}
   Write-Host "'$($user.UserPrincipalName)' added as an application owner to app '$($webAppServicePrincipal.DisplayName)'"
}
Write-Host "Done creating the webApp application (WebApp)"
```



## Next steps

# [ASP.NET Core](#tab/aspnetcore)

Move on to the next article in this scenario,
[App's code configuration](scenario-web-app-sign-user-app-configuration.md?tabs=aspnetcore).

# [ASP.NET](#tab/aspnet)

Move on to the next article in this scenario,
[App's code configuration](scenario-web-app-sign-user-app-configuration.md?tabs=aspnet).

# [Java](#tab/java)

Move on to the next article in this scenario,
[App's code configuration](scenario-web-app-sign-user-app-configuration.md?tabs=java).

# [Node.js](#tab/nodejs)

Move on to the next article in this scenario,
[App's code configuration](scenario-web-app-sign-user-app-configuration.md?tabs=nodejs).

# [Python](#tab/python)

Move on to the next article in this scenario,
[App's code configuration](scenario-web-app-sign-user-app-configuration.md?tabs=python).

---
