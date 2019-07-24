---
title: Support multiple token issuers in an OWIN-based web application - Azure Active Directory B2C
description: Learn how to enable a .NET web application to support tokens issued by multiple domains.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 07/29/2019
ms.author: marsma
ms.subservice: B2C
---

# Support multiple token issuers in an OWIN-based web application

This article describes a technique for enabling support for multiple token issuers in web apps and APIs that implement the [Open Web Interface for .NET (OWIN)](http://owin.org/). Supporting multiple token endpoints is useful when you're migrating Azure Active Directory (Azure AD) B2C applications from *login.microsoftonline.com* to *b2clogin.com*.

The following sections present an example of how to enable multiple issuers in a web application and corresponding web API that use the [Katana][katana] OWIN middleware components. Although the code examples are specific to the Katana OWIN middleware, the general technique should be applicable to other OWIN libraries.

## Prerequisites

You need the following Azure AD B2C resources in place before continuing with the steps in this article:

* [Azure AD B2C tenant](tutorial-create-tenant.md)
* [Application registered](tutorial-register-applications.md) in your tenant
* [User flows created](tutorial-create-user-flows.md) in your tenant

Additionally, you need the following in your local development environment:

* [Visual Studio 2019](https://visualstudio.microsoft.com/vs/)

## Get token issuer endpoints

You first need to get the token issuer endpoint URIs for each issuer you want to support in your application. To get the *b2clogin.com* and *login.microsoftonline.com* endpoints supported by your Azure AD B2C tenant, use the following procedure in the Azure portal.

Start by selecting one of your existing user flows:

1. Navigate to your Azure AD B2C tenant in the [Azure portal](https://portal.azure.com)
1. Under **Policies**, select **User flows (policies)**
1. Select an existing policy, for example *B2C_1_signupsignin1*, then select **Run user flow**
1. Under the **Run user flow** heading near the top of the page, select the hyperlink to navigate to the OpenID Connect discovery endpoint for that user flow.

    ![Well-known URI hyperlink in the Run now page of the Azure portal](media/multi-domain-jwt-validation/portal-01-policy-link.png)

1. In the page that opens in your browser, record the `issuer` value, for example:

    `https://your-b2c-tenant.b2clogin.com/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/v2.0/`

1. Use the **Select domain** drop-down to select the other domain, then perform the previous two steps once again and record its `issuer` value.

You should now have two URIs recorded that are similar to:

```
https://login.microsoftonline.com/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/v2.0/
https://your-b2c-tenant.b2clogin.com/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/v2.0/
```

### Custom policies

If you have custom policies instead of user flows, you can use a similar process to get the issuer URIs.

1. Navigate to your Azure AD B2C tenant
1. Select **Identity Experience Framework**
1. Select one of your relying party policies, for example, *B2C_1A_signup_signin*
1. Use the **Select domain** drop-down to select a domain, for example *yourtenant.b2clogin.com*
1. Select the hyperlink displayed under **OpenID Connect discovery endpoint**
1. Record the `issuer` value
1. Perform the steps 4-6 for the other domain, for example *login.microsoftonline.com*

## Get the sample code

Now that you have both token endpoint URIs, you need to update your code to specify that both endpoints are valid issuers. To walk through an example, download or clone the sample application, then update the sample to support both endpoints as valid issuers.

Direct \*.zip download: [active-directory-b2c-dotnet-webapp-and-webapi-master.zip][sample-archive]

```
git clone https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi.git
```

## Update the sample

In this section you update the code to specify that both token issuer endpoints are valid.

1. Open the **B2C-WebAPI-DotNet.sln** solution in Visual Studio
1. In the **TaskService** project, open the *TaskService\\App_Start\\**Startup.Auth.cs*** file in your editor
1. Add the following `using` directive to the top of the file:

    `using System.Collections.Generic;`
1. Add the [`ValidIssuers`][validissuers] property to the [`TokenValidationParameters`][tokenvalidationparameters] definition and specify both URIs you recorded in the previous section:

    ```csharp
    TokenValidationParameters tvps = new TokenValidationParameters
    {
        // Accept only those tokens where the audience of the token is equal to the client ID of this app
        ValidAudience = ClientId,
        AuthenticationType = Startup.DefaultPolicy,
        ValidIssuers = new List<string> {
            "https://login.microsoftonline.com/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/v2.0/",
            "https://{your-b2c-tenant-name}.b2clogin.com/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/v2.0/"
        }
    };
    ```

`TokenValidationParameters` is provided by MSAL.NET and is consumed by the OWIN middleware in the next section of code. With multiple valid issuers specified, the OWIN application pipeline is made aware that both token endpoints are valid issuers.

```csharp
app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions
{
    // This SecurityTokenProvider fetches the Azure AD B2C metadata &  from the OpenIDConnect metadata endpoint
    AccessTokenFormat = new JwtFormat(tvps, new tCachingSecurityTokenProvider(String.Format(AadInstance, ultPolicy)))
});
```

As mentioned previously, other OWIN libraries typically provide a similar facility for supporting multiple issuers. Although providing examples for every library is outside the scope of this article, you can use a similar technique for most libraries.

## Run the code

With both URIs specified in the web API project, you can test whether the web application can successfully retrieve tokens from both issuers. Build and run the solution using different `ida:AadInstance` values in the `TaskWebApp\`**`Web.config`** file of TaskWebApp to perform the test.

For example, run the application first with the current value found in Web.config:

```xml
<add key="ida:AadInstance" value="https://login.microsoftonline.com/tfp/{0}/{1}" />
```

Then, test whether a token issued by b2clogin.com is functional. Update **Web.config** once again, but this time use the b2clogin.com issuer value for `ida:AadInstance`. Modify `<your-tenant-name>` with the name of your B2C tenant before.

```xml
<add key="ida:AadInstance" value="https://{your-b2c-tenant-name}.b2clogin.com/tfp/{0}/{1}" />
```

In each case, when you **[PERFORM OPERATION]** you should see **[EXPECTED BEHAVIOR]**.

<!-- LINKS - External -->
[sample-archive]: https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi/archive/master.zip
[sample-repo]: https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi

<!-- LINKS - Internal -->
[katana]: https://docs.microsoft.com/aspnet/aspnet/overview/owin-and-katana/
[validissuers]: https://docs.microsoft.com/dotnet/api/microsoft.identitymodel.tokens.tokenvalidationparameters.validissuers
[tokenvalidationparameters]: https://docs.microsoft.com/dotnet/api/microsoft.identitymodel.tokens.tokenvalidationparameters