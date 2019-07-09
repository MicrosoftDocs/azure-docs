---
title: Migrate an OWIN application to b2clogin.com by supporting multiple token issuers
description: Learn how to enable a .NET web API to validate tokens from multiple issuers.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 07/14/2019
ms.author: marsma
ms.subservice: B2C
---

# Migrate an OWIN application to b2clogin.com by supporting multiple token issuer URIs

When you're migrating your applications from *login.microsoftonline.com* to *b2clogin.com*, you might want to support tokens issued by both endpoints during the migration. This article provides an example of how to enable multiple issuers in a .NET web application implemented with [Open Web Interface for .NET (OWIN)](http://owin.org/).

## Prerequisites

You need the following resources in place before continuing with the steps in this article:

* [Azure AD B2C tenant](tutorial-create-tenant.md)
* [Application registered](tutorial-register-applications.md) in your tenant
* [User flows created](tutorial-create-user-flows.md) in your tenant

In addition, you need the following in your local development environment:

* [Visual Studio 2019](https://visualstudio.microsoft.com/vs/)

## Get the sample code

Start by cloning the [active-directory-b2c-dotnet-webapp-and-webapi][sample-repo] GitHub repository or by downloading the repository's \*.zip archive and extracting it to a directory on your local machine.

```
git clone https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi.git
```

Direct download:  [active-directory-b2c-dotnet-webapp-and-webapi-master.zip][sample-archive]

## Get issuer URLs

First, select one of your existing user flows:

1. In the Azure portal, navigate to your Azure AD B2C tenant
1. Under **Policies**, select **User flows (policies)**
1. Select an existing policy, for example *B2C_1_signupsignin1*, then select **Run user flow**

Next, complete the following steps to record the issuer URIs for both domains (`b2clogin.com` and `login.microsoft.com`). You update the sample project with these values in the next section.

1. Under the **Run user flow** heading near the top of the page, click the hyperlink to navigate to the user flow's well-known URI.

    ![Well-known URI hyperlink in the Run now page of the Azure portal](media/multi-domain-jwt-validation/portal-01-policy-link.png)
1. In the page that opens in your browser, record the `issuer` value, for example:

    `https://your-b2c-tenant.b2clogin.com/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/v2.0/`
1. Use the **Select domain** drop-down to select the other domain, then perform the previous two steps once again and record its `issuer` value.

You should now have two URIs recorded that are similar to:

```
https://login.microsoftonline.com/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/v2.0/
https://your-b2c-tenant.b2clogin.com/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/v2.0/
```

## Update the code with issuer URLs

In this section, you update the sample code to enable support for both well-known URIs.

1. Open the **B2C-WebAPI-DotNet.sln** solution in Visual Studio
1. In the **TaskService** project, open the **Startup.Auth.cs** file in your editor (`TaskService\App_Start\Startup.Auth.cs`)
1. Add the `ValidIssuers` property to the `TokenValidationParameters` definition and specify both URIs you recorded in the previous section:

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

## Run the code

With both URIs specified in the web API project, you can test whether the web application can successfully retrieve tokens from both issuers. Build and run the solution using different `ida:AadInstance` values in the **Web.config** file of TaskWebApp (`TaskWebApp\Web.config`) to perform the test.

For example, run the application first with the current value found in Web.config:

```xml
<add key="ida:AadInstance" value="https://login.microsoftonline.com/tfp/{0}/{1}" />
```

Then, test whether a token issued by b2clogin.com is functional. Update **Web.config** once again, but this time use the b2clogin.com issuer value for `ida:AadInstance`. Modify `<your-tenant-name>` with the name of your B2C tenant before.

```xml
<add key="ida:AadInstance" value="https://<your-tenant-name>.b2clogin.com/tfp/<your-tenant-name>.onmicrosoft.com" />
```

In each case, when you **[PERFORM OPERATION]** you should see **[EXPECTED BEHAVIOR]**.

<!-- LINKS - External -->
[sample-repo]: https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi
[sample-archive]: https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi/archive/master.zip