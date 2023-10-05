---
title: Tutorial - Create a Blazor Server app that uses the Microsoft identity platform for authentication
description: In this tutorial, you set up authentication using the Microsoft identity platform in a Blazor Server app.
author: henrymbuguakiarie
ms.author: henrymbugua
ms.service: active-directory
ms.subservice: develop
ms.topic: tutorial
ms.date: 02/09/2023
ms.custom: engagement-fy23, devx-track-dotnet
ms.reviewer: janicericketts
#Customer intent: As a developer, I want to add authentication to a Blazor app.
---

# Tutorial: Create a Blazor Server app that uses the Microsoft identity platform for authentication

In this tutorial, you build a Blazor Server app that signs in users and gets data from Microsoft Graph by using the Microsoft identity platform and registering your app in Microsoft Entra ID.

We also have a tutorial for [Blazor WASM](tutorial-blazor-webassembly.md).

In this tutorial:

> [!div class="checklist"]
>
> - Create a new Blazor Server app configured to use Microsoft Entra ID for authentication for users in a single organization (in the Microsoft Entra tenant the app is registered)
> - Handle both authentication and authorization using `Microsoft.Identity.Web`
> - Retrieve data from a protected web API, Microsoft Graph

## Prerequisites

- [.NET 7 SDK](https://dotnet.microsoft.com/download/dotnet/7.0)
- An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- The Azure account must have permission to manage applications in Microsoft Entra ID. Any of the following Microsoft Entra roles include the required permissions:
  - [Application administrator](../roles/permissions-reference.md#application-administrator)
  - [Application developer](../roles/permissions-reference.md#application-developer)
  - [Cloud application administrator](../roles/permissions-reference.md#cloud-application-administrator)
- The tenant-id or domain of the Microsoft Entra ID associated with your Azure Account

## Create the app using the .NET CLI

```dotnetcli
mkdir <new-project-folder>
cd <new-project-folder>
dotnet new blazorserver --auth SingleOrg --calls-graph
```

## Install the Microsoft Identity App Sync .NET Tool

```dotnetcli
dotnet tool install --global msidentity-app-sync
```

This tool will automate the following tasks for you:

- Register your application in Microsoft Entra ID
  - Create a secret for your registered application
  - Register redirect URIs based on your launchsettings.json
- Initialize the use of user secrets in your project
- Store your application secret in user secrets storage
- Update your appsettings.json with the client-id, tenant-id, and others.

.NET Tools extend the capabilities of the dotnet CLI command. To learn more about .NET Tools, see [.NET Tools](/dotnet/core/tools/global-tools).

For more information on user secrets storage, see [safe storage of app secrets during development](/aspnet/core/security/app-secrets).

## Use the Microsoft Identity App Sync Tool

Run the following command to register your app in your tenant and update the .NET configuration of your application. Provide the username/upn belonging to your Azure Account (for instance, `username@domain.com`) and the tenant ID or domain name of the Microsoft Entra ID associated with your Azure Account. If you use an account that is signed in in either Visual Studio, Azure CLI, or Azure PowerShell, you'll benefit from single sign-on (SSO).

```dotnetcli
msidentity-app-sync --username <username/upn> --tenant-id <tenantID>
```

> [!Note]
> - You don't need to provide the username if you are signed in with only one account in the developer tools.
> - You don't need to provide the tenant-id if the tenant in which you want to create the application is your home tenant.

## Optional - Create a development SSL certificate

In order to avoid SSL errors/warnings when browsing the running application, you can use the following on macOS and Windows to generate a self-signed SSL certificate for use by .NET Core.

```dotnetcli
dotnet dev-certs https --trust
```

## Run the app

In your terminal, run the following command:

```dotnetcli
dotnet run
```

Browse to the running web application using the URL outputted by the command line.

## Next steps

Learn about calling building web apps that sign in users in our multi-part scenario series:

> [!div class="nextstepaction"]
> [Scenario: Web app that signs in users](scenario-web-app-sign-user-overview.md)
