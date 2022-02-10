---
title: Create a trust relationship between an app and an external identity provider
titleSuffix: Microsoft identity platform
description: Set up a trust relationship between an app in Azure AD and an external identity provider.  This allows a software workload outside of Azure to access Azure AD protected resources without using secrets or certificates. 
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 01/10/2022
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: keyam, udayh, vakarand
#Customer intent: As an application developer, I want to configure a federated credential on an app registration so I can create a trust relationship with an external identity provider and use workload identity federation to access Azure AD protected resources without managing secrets.
---

# Configure an app to trust an external identity provider (preview)

This article describes how to create a trust relationship between an application in Azure Active Directory (Azure AD) and an external identity provider (IdP).  You can then configure an external software workload to exchange a token from the external IdP for an access token from Microsoft identity platform. The external workload can access Azure AD protected resources without needing to manage secrets (in supported scenarios).  To learn more about the token exchange workflow, read about [workload identity federation](workload-identity-federation.md).  You establish the trust relationship by configuring a federated identity credential on your app registration by using Microsoft Graph.

Anyone with permissions to create an app registration and add a secret or certificate can add a federated identity credential.  If the **Users can register applications** switch in the [User Settings](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/UserSettings) blade is set to **No**, however, you won't be able to create an app registration or configure the federated identity credential.  Find an admin to configure the federated identity credential on your behalf.  Anyone in the Application Administrator or Application Owner roles can do this.

After you configure your app to trust an external IdP, configure your software workload to get an access token from Microsoft identity provider and access Azure AD protected resources.

## Prerequisites
[Create an app registration](quickstart-register-app.md) in Azure AD.  Grant your app access to the Azure resources targeted by your external software workload.  

Find the object ID of the app (not the application (client) ID), which you need in the following steps.  You can find the object ID of the app in the Azure portal.  Go to the list of [registered applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) in the Azure portal and select your app registration.  In **Overview**->**Essentials**, find the **Object ID**.

Get the information for your external IdP and software workload, which you need in the following steps.

The Microsoft Graph beta endpoint (`https://graph.microsoft.com/beta`) exposes REST APIs to create, update, delete [federatedIdentityCredentials](/graph/api/resources/federatedidentitycredential?view=graph-rest-beta&preserve-view=true) on applications. Launch [Azure Cloud Shell](https://portal.azure.com/#cloudshell/) and sign in to your tenant.

## Configure a federated identity credential

Run the Microsoft Graph [create a new federated identity credential](/graph/api/application-post-federatedidentitycredentials?view=graph-rest-beta&preserve-view=true) operation on your app (specified by the object ID of the app).  

*issuer* and *subject* are the key pieces of information needed to set up the trust relationship. *issuer* is the URL of the external identity provider and must match the `issuer` claim of the external token being exchanged.  *subject* is the identifier of the external software workload and must match the `sub` (`subject`) claim of the external token being exchanged. *subject* has no fixed format, as each IdP uses their own - sometimes a GUID, sometimes a colon delimited identifier, sometimes arbitrary strings. The combination of `issuer` and `subject` must be unique on the app.  When the external software workload requests Microsoft identity platform to exchange the external token for an access token, the *issuer* and *subject* values of the federated identity credential are checked against the `issuer` and `subject` claims provided in the external token. If that validation check passes, Microsoft identity platform issues an access token to the external software workload.

> [!IMPORTANT]
> If you accidentally add the incorrect external workload information in the *subject* setting the federated identity credential is created successfully without error.  The error does not become apparent until the token exchange fails.

*audiences* lists the audiences that can appear in the external token.  This field is mandatory, and defaults to "api://AzureADTokenExchange". It says what Microsoft identity platform must accept in the `aud` claim in the incoming token.  This value represents Azure AD in your external identity provider and has no fixed value across identity providers - you may need to create a new application registration in your IdP to serve as the audience of this token.

*name* is the unique identifier for the federated identity credential, which has a character limit of 120 characters and must be URL friendly. It is immutable once created.

*description* is the un-validated, user-provided description of the federated identity credential. 

### GitHub Actions example
Run the following command to [create a new federated identity credential](/graph/api/application-post-federatedidentitycredentials?view=graph-rest-beta&preserve-view=true) on your app (specified by the object ID of the app).  The *issuer* identifies GitHub as the external token issuer.  *subject* identifies the GitHub organization, repo, and environment for your GitHub Actions workflow.  When the GitHub Actions workflow requests Microsoft identity platform to exchange a GitHub token for an access token, the values in the federated identity credential are checked against the provided GitHub token.

```azurecli
az rest --method POST --uri 'https://graph.microsoft.com/beta/applications/f6475511-fd81-4965-a00e-41e7792b7b9c/federatedIdentityCredentials' --body '{"name":"Testing","issuer":"https://token.actions.githubusercontent.com/","subject":"repo:octo-org/octo-repo:environment:Production","description":"Testing","audiences":["api://AzureADTokenExchange"]}' 
```

And you get the response:
```azurecli
{
  "@odata.context": "https://graph.microsoft.com/beta/$metadata#applications('f6475511-fd81-4965-a00e-41e7792b7b9c')/federatedIdentityCredentials/$entity",
  "audiences": [
    "api://AzureADTokenExchange"
  ],
  "description": "Testing",
  "id": "1aa3e6a7-464c-4cd2-88d3-90db98132755",
  "issuer": "https://token.actions.githubusercontent.com/",
  "name": "Testing",
  "subject": "repo:octo-org/octo-repo:environment:Production"
}
```

### Kubernetes example
Run the following command to configure a federated identity credential on an app and create a trust relationship with a Kubernetes service account.  The *issuer* is your service account issuer URL.  *subject* is the subject name in the tokens issued to the service account. Kubernetes uses the following format for subject names: `system:serviceaccount:<SERVICE_ACCOUNT_NAMESPACE>:<SERVICE_ACCOUNT_NAME>`.

```azurecli
az rest --method POST --uri 'https://graph.microsoft.com/beta/applications/f6475511-fd81-4965-a00e-41e7792b7b9c/federatedIdentityCredentials' --body '{"name":"Kubernetes-federated-credential","issuer":"https://aksoicwesteurope.blob.core.windows.net/9d80a3e1-2a87-46ea-ab16-e629589c541c/","subject":"system:serviceaccount:erp8asle:pod-identity-sa","description":"Kubernetes service account federated credential","audiences":["api://AzureADTokenExchange"]}' 
```

And you get the response:
```azurecli
{
  "@odata.context": "https://graph.microsoft.com/beta/$metadata#applications('f6475511-fd81-4965-a00e-41e7792b7b9c')/federatedIdentityCredentials/$entity",
  "audiences": [
    "api://AzureADTokenExchange"
  ],
  "description": "Kubernetes service account federated credential",
  "id": "51ecf9c3-35fc-4519-a28a-8c27c6178bca",
  "issuer": "https://aksoicwesteurope.blob.core.windows.net/9d80a3e1-2a87-46ea-ab16-e629589c541c/",
  "name": "Kubernetes-federated-credential",
  "subject": "system:serviceaccount:erp8asle:pod-identity-sa"
}
```

## List federated identity credentials on an app

Run the following command to [list the federated identity credential(s)](/graph/api/application-list-federatedidentitycredentials?view=graph-rest-beta&preserve-view=true) for an app (specified by the object ID of the app):

```azurecli
az rest -m GET -u 'https://graph.microsoft.com/beta/applications/f6475511-fd81-4965-a00e-41e7792b7b9c/federatedIdentityCredentials' 
```

And you get a response similar to:

```azurecli
{
  "@odata.context": "https://graph.microsoft.com/beta/$metadata#applications('f6475511-fd81-4965-a00e-41e7792b7b9c')/federatedIdentityCredentials",
  "value": [
    {
      "audiences": [
        "api://AzureADTokenExchange"
      ],
      "description": "Testing",
      "id": "1aa3e6a7-464c-4cd2-88d3-90db98132755",
      "issuer": "https://token.actions.githubusercontent.com/",
      "name": "Testing",
      "subject": "repo:octo-org/octo-repo:environment:Production"
    }
  ]
}
```

## Delete a federated identity credential

Run the following command to [delete a federated identity credential](/graph/api/application-list-federatedidentitycredentials?view=graph-rest-beta&preserve-view=true) from an app (specified by the object ID of the app):

```azurecli
az rest -m DELETE  -u 'https://graph.microsoft.com/beta/applications/f6475511-fd81-4965-a00e-41e7792b7b9c/federatedIdentityCredentials/51ecf9c3-35fc-4519-a28a-8c27c6178bca' 

```

## Next steps
- To learn how to use workload identity federation for Kubernetes, see [Azure AD Workload Identity for Kubernetes](https://azure.github.io/azure-workload-identity/docs/quick-start.html) open source project. 
- To learn how to use workload identity federation for GitHub Actions, see [Configure a GitHub Actions workflow to get an access token](/azure/developer/github/connect-from-azure).
- For more information, read about how Azure AD uses the [OAuth 2.0 client credentials grant](v2-oauth2-client-creds-grant-flow.md#third-case-access-token-request-with-a-federated-credential) and a client assertion issued by another IdP to get a token.