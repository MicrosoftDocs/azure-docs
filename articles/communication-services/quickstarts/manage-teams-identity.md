---
title: Set up and create Teams access tokens
titleSuffix: An Azure Communication Services quickstart
description: Building service providing Teams access tokens 
author: tomaschladek
manager: nmurav
services: azure-communication-services

ms.author: tchladek
ms.date: 06/30/2021
ms.topic: overview
ms.service: azure-communication-services
---
# Quickstart: Set up and manage Teams access tokens

> [!IMPORTANT]
> To enable/disable custom Teams endpoint experience, complete [this form](https://forms.office.com/r/B8p5KqCH19).

In this quickstart, we'll build a .NET console application to authenticate an AAD user token using the MSAL library. We'll then exchange that token for a Teams access token with the Azure Communication Services Identity SDK. The Teams access token can then be used by the Azure Communication Services Calling SDK to build a custom Teams endpoint.

> [!NOTE]
> In production environments, we recommend implementing this exchange mechanism in backend services, as requests for exchange are signed with a secret.


## Prerequisites
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](./create-communication-resource.md).
- Enable custom Teams endpoint experience via  [this form](https://forms.office.com/r/B8p5KqCH19)
- Having Azure Active Directory with users that have Teams license

## Introduction

Teams identities are bound to tenants in Azure Active Directory. Your application can be used by users from the same or any tenant. In this quickstart, we'll work through a multitenant use case with multiple actors: users, developers, and admins from fictional companies Contoso and Fabrikam. In this use case, Contoso is a company building a SaaS solution for Fabrikam. 

The following sections will guide you through the steps for admins, developers, and users. The diagrams demonstrate the multitenant use case. If you're working with a single tenant, execute all steps from Contoso and Fabrikam in single tenant.

## Admin actions

The Administrator role has extended permissions in AAD. Members of this role can provision resources and can read information from the Azure portal. In the following diagram, you can see all actions that have to be executed by Admins.

![Admin actions to enable custom Teams endpoint experience](./media/teams-identities/teams-identity-admin-overview.png)

1. Contoso's Admin creates or selects existing *Application* in Azure Active Directory. Property *Supported account types* defines whether users from different tenant can authenticate to the *Application*. Property *Redirect URI* redirects successful authentication request to Contoso's *Server*.
1. Contoso's Admin extends *Application*'s manifest with Azure Communication Services' VoIP permission. 
1. Contoso's Admin allows public client flow for the *Application*
1. Contoso's Admin can optionality update
1. Contoso's Admin enables experience via [this form](https://forms.office.com/r/B8p5KqCH19)
1. Contoso's Admin creates or selects existing Communication Services, that will be used for authentication of the exchanging requests. AAD user tokens will be exchanged for Teams access tokens. You can read more about creation of [new Azure Communication Services resources here](./create-communication-resource.md).
1. Fabrikam's Admin provisions new service principal for Azure Communication Services in the Fabrikam's tenant
1. Fabrikam's Admin grants Azure Communication Services VoIP permission to the Contoso's *Application*. This step is required only if Contoso's *Application* isn't verified.

### 1. Create AAD application registration or select AAD application 

Users must be authenticated against AAD applications with Azure Communication Service's `VoIP` permission. If you don't have an existing application that you would like to use for this quickstart, you can create new application registration. 

The following application settings influence the experience:
- Property *Supported account types* defines whether the *Application* is single tenant ("Accounts in this organizational directory only") or multi-tenant ("Accounts in any organizational directory"). For this scenario, you can use multi-tenant.
- *Redirect URI* defines URI where authentication request is redirected after authentication. For this scenario, you can use "Public client/native(mobile & desktop)" and fill in "http://localhost" as URI.

[Here you can find detailed documentation.](/azure/active-directory/develop/quickstart-register-app#register-an-application). 

When the *Application* is registered, you'll see an identifier in the overview. This identifier will be used in followings steps: **Application (client) ID**.

### 2. Allow public client flows

In the *Authentication* pane of your *Application*, you can see Configured platform for *Public client/native(mobile & desktop)* with Redirect URI pointing to *localhost*. In the bottom of the screen, you can find toggle *Allow public client flows*, which for this quickstart will be set to **Yes**.

### 3. Update publisher domain (Optional)
In the *Branding* pane, you can update your publisher domain for the *Application*. This is useful for multitenant applications, where the application will be marked as verified by Azure. You can find details on how to verify publisher and how to update domain of your application [here](/azure/active-directory/develop/howto-configure-publisher-domain).

### 4. Define Azure Communication Services' VoIP permission in application

Go to the details of *Application* and select "Manifest" pane. In the manifest find property called: *"requiredResourceAccess"*. It is array of objects, that defines *Application's* permissions. Extend the manifest with the VoIP permissions for the first party application Azure Communication Services. Add following object to the array.

> [!NOTE] 
> Do not change the GUIDs in the snippet as they are uniquely identifying application and permissions.

```json
{
   "resourceAppId": "1fd5118e-2576-4263-8130-9503064c837a",
   "resourceAccess": [
      {
         "id": "31f1efa3-6f54-4008-ac59-1bf1f0ff9958",
         "type": "Scope"
      }
   ]
}
```

Then select on the *Save* button to persist changes. You can now see the Azure Communication Services - VoIP permission in the *API Permissions* pane.

### 5. Enable custom Teams endpoint experience for *Application*

AAD Admin fills in following [form](https://forms.office.com/r/B8p5KqCH19) to enable the custom Teams endpoint experience for the *Application*.

### 6. Create or select Communication Services resource

Your Azure Communication Services resource will be used to authenticate all requests for exchanging AAD user tokens for Teams access tokens. This exchange can be triggered via the Azure Communication Services Identity SDK, which is authenticated with access key or Azure RBAC. You can get the access key in the Azure portal or configure Azure RBAC via *Access control (IAM)* pane.

If you want to [create new Communication Services resource, follow this guide](./create-communication-resource.md).

### 7. Provision Azure Communication Services service principal

To enable custom Teams endpoint experience in Fabrikam's tenant, Fabrikam's AAD admin must provision service principal named Azure Communication Services with Application ID: *1fd5118e-2576-4263-8130-9503064c837a*. If you don't see this application in your Enterprise applications pane in Azure Active Directory, it has to be added manually.

Fabrikam's AAD Admin connects to the Azure's Tenant via PowerShell. 

> [!NOTE]
> Replace [Tenant_ID] with ID of your tenant, that can be found in the Azure portal on the overview page of the AAD.

```azurepowershell
Connect-AzureAD -TenantId "[Tenant_ID]"
```

If the command isn't found, then the AzureAD module isn't installed in your PowerShell. Close the PowerShell and run it with Administration rights. Then you can install Azure-AD package with following command:

```azurepowershell
Install-Module AzureAD
```

After connecting and authentication to the Azure, run following command to provision the Communication Services' service principal. 

> [!NOTE]
> Parameter AppId refers to the first party application Azure Communication Services. Don't change this value.

```azurepowershell
New-AzureADServicePrincipal -AppId "1fd5118e-2576-4263-8130-9503064c837a"
```

### 8. Provide admin consent

If Contoso's *Application* isn't verified, the AAD admin must grant permission to the Contoso's *Application* for Azure Communication Services' VoIP permission. Fabrikam's AAD admin provides consent via unique link. To construct admin consent link, follow instructions:

1. Take following link *https://login.microsoftonline.com/{Tenant_ID}/adminconsent?client_id={Application_ID}*
1. Replace {Tenant_ID} with Fabrikam's tenant ID
1. Replace {Application_ID} with Contoso's Application ID
1. Fabrikam's AAD Admin navigates to the link in the browser. 
1. Fabrikam's AAD admin logs in and grants permissions on behalf of the organization

Service principal of Contoso's *Application* in Fabrikam's tenant is created if consent is granted. Fabrikam's admin can review consent in AAD:

1. Sign in into Azure portal as Admin
1. Go to Azure Active Directory
1. Go to "Enterprise applications" pane
1. Set filter "Application type" to "All applications"
1. In the field to filter applications, insert the name of the Contoso's application
1. Select "Apply" to filter results
1. Select service principle with required name 
1. Go to *Permissions* pane

You can see that Azure Communication Services' VoIP permission has now Status *Granted for {Directory_name}*.

## Developer actions

Contoso's developer needs to set up *Client application* for authentication of users. Developer then needs to create endpoint on backend *Server* to process AAD user token after redirection. When AAD user token is received, it is exchanged for Teams Access token and returned back to *Client application*. The actions that are needed from developers are shown in following diagram:

![Developer actions to enable custom Teams endpoint experience](./media/teams-identities/teams-identity-developer-overview.png)

1. Contoso's developer configures MSAL library to authenticate user for *Application* created in previous steps by Admin for Azure Communication Services' VoIP permission
1. Contoso's developer initializes ACS identity SDK and exchanges incoming AAD user token for Teams' access token via SDK. Teams' access token is then returned to *Client application*.

Microsoft Authentication Library (MSAL) enables developers to acquire AAD user tokens from the Microsoft identity platform endpoint to authenticate users and access secure web APIs. It can be used to provide secure access to Azure Communication Services. MSAL supports many different application architectures and platforms including .NET, JavaScript, Java, Python, Android, and iOS.

You can find more details how to set up different environments in public documentation. [Microsoft Authentication Library (MSAL) overview](/azure/active-directory/develop/msal-overview).

> [!NOTE]
> Following sections describes how to exchange AAD access token for Teams access token for console application in .NET.

### Create new application

In a console window (such as cmd, PowerShell, or Bash), use the dotnet new command to create a new console app with the name *TeamsAccessTokensQuickstart*. This command creates a simple "Hello World" C# project with a single source file: *Program.cs*.

```console
dotnet new console -o TeamsAccessTokensQuickstart
```

Change your directory to the newly created app folder and use the dotnet build command to compile your application.

```console
cd TeamsAccessTokensQuickstart
dotnet build
```
#### Install the package
While still in the application directory, install the Azure Communication Services Identity library for .NET package by using the dotnet add package command.

```console
dotnet add package Azure.Communication.Identity
dotnet add package Microsoft.Identity.Client
```

#### Set up the app framework

From the project directory:

- Open Program.cs file in a text editor
- Add a using directive to include following namespaces: 
    - Azure.Communication
    - Azure.Communication.Identity
    - Microsoft.Identity.Client
- Update the Main method declaration to support async code

Use the following code to begin:

```csharp
using System;
using System.Text;
using Azure.Communication;
using Azure.Communication.Identity;
using Microsoft.Identity.Client;

namespace TeamsAccessTokensQuickstart
{
    class Program
    {
        static async System.Threading.Tasks.Task Main(string[] args)
        {
            Console.WriteLine("Azure Communication Services – Teams access tokens quickstart");

            // Quickstart code goes here
        }
    }
}
```

### 1. Receive AAD user token via MSAL library

Use MSAL library to authenticate user against AAD for Contoso's *Application* with Azure Communication Services' VoIP permission. Configure client for Contoso's *Application* (*parameter applicationId*) in public cloud (*parameter authority*). AAD user token will be returned to the redirect URI (*parameter redirectUri*). Credentials will be taken from interactive pop-up window, that will open in your default browser.

> [!NOTE] 
> Redirect URI has to match the value defined in the *Application*. Check first step in the Admin guide to see how to configure Redirect URI.

```csharp
const string applicationId = "Contoso's_Application_ID";
const string authority = "https://login.microsoftonline.com/common";
const string redirectUri = "http://localhost";

var client = PublicClientApplicationBuilder
                .Create(applicationId)
                .WithAuthority(authority)
                .WithRedirectUri(redirectUri)
                .Build();

const string scope = "https://auth.msft.communication.azure.com/VoIP";

var aadUserToken = await client.AcquireTokenInteractive(new[] { scope }).ExecuteAsync();

Console.WriteLine("\nAuthenticated user: " + aadUserToken.Account.Username);
Console.WriteLine("AAD user token expires on: " + aadUserToken.ExpiresOn);
```

Variable *aadUserToken* now carries valid Azure Active Directory user token, that will be used for exchange.

### 2. Exchange AAD user token for Teams access token

Valid AAD user token authenticates user against AAD for third party application with Azure Communication Services' VoIP permission. The following code is used ACS identity SDK to facilitate exchange of AAD user token for Teams access token.

> [!NOTE]
> Replace value "&lt;Connection-String&gt;" with valid connection string or use Azure RBAC for authentication. You can find more details in [this quickstart](./access-tokens.md).

```csharp
var identityClient = new CommunicationIdentityClient("<Connection-String>");
var teamsAccessToken = identityClient.ExchangeTeamsToken(aadUserToken.AccessToken);

Console.WriteLine("\nTeams access token expires on: " + teamsAccessToken.Value.ExpiresOn);
```

If all conditions defined in the requirements are met, then you would get valid Teams access token valid for 24 hours.

#### Run the code
Run the application from your application directory with the dotnet run command.

```console
dotnet run
```

The output of the app describes each action that is completed:

```console
Azure Communication Services - Teams access tokens quickstart

Authenticated user: john.smith@contoso.com
AAD user token expires on: 6/10/2021 10:13:17 AM +00:00

Teams access token expires on: 6/11/2021 9:13:18 AM +00:00
```

## User actions

User represents the Fabrikam's users of Contoso's *Application*. User experience is shown in following diagram.

![User actions to enable custom Teams endpoint experience](./media/teams-identities/teams-identity-user-overview.png)

1. Fabrikam's user uses Contoso's *Client application* and is prompted to authenticate.
1. Contoso's *Client application* uses MSAL library to authenticate user against Fabrikam's Azure Active Directory tenant for Contoso's *Application* with Azure Communication Services' VoIP permission. 
1. Authentication is redirected to *Server* as defined in the property *Redirect URI* in MSAL and Contoso's *Application*
1. Contoso's *Server* exchanges AAD user token for Teams' access token using ACS identity SDK and returns Teams' access token to the *Client application*.

With valid Teams' access token in *Client application*, developer can integrate ACS calling SDK and build custom Teams endpoint.

## Next steps

In this quickstart, you learned how to:

> [!div class="checklist"]
> * Create and configure Application in Azure Active Directory
> * Use MSAL library to issue Azure Active Directory user token
> * Use the ACS Identity SDK to exchange Azure Active Directory user token for Teams access token

The following documents may be interesting to you:

- Learn about [custom Teams endpoint](../concepts/teams-endpoint.md)
- Learn about [Teams interoperability](../concepts/teams-interop.md)
