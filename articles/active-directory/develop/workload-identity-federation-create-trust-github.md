---
title: Create a trust relationship between an app and GitHub
titleSuffix: Microsoft identity platform
description: Set up a trust relationship between an app in Azure AD and a GitHub repo.  This allows a GitHub Actions workflow to access Azure AD protected resources without using secrets or certificates. 
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 01/28/2022
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: keyam, udayh, vakarand
#Customer intent: As an application developer, I want to configure a federated credential on an app registration so I can create a trust relationship with a GitHub repo and use workload identity federation to access Azure AD protected resources without managing secrets.
---

# Configure an app to trust a GitHub repo (preview)

This article describes how to create a trust relationship between an application in Azure Active Directory (Azure AD) and a GitHub repo.  You can then configure a GitHub Actions workflow to exchange a token from GitHub for an access token from Microsoft identity platform and access Azure AD protected resources without needing to manage secrets.  To learn more about the token exchange workflow, read about [workload identity federation](workload-identity-federation.md).  You establish the trust relationship by configuring a federated identity credential on your app registration in the Azure portal or by using Microsoft Graph.

Anyone with permissions to create an app registration and add a secret or certificate can add a federated identity credential.  If the **Users can register applications** switch in the [User Settings](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/UserSettings) blade is set to **No**, however, you won't be able to create an app registration or configure the federated identity credential.  Find an admin to configure the federated identity credential on your behalf.  Anyone in the Application Administrator or Application Owner roles can do this.

After you configure your app to trust a GitHub repo, [configure your GitHub Actions workflow](/azure/developer/github/connect-from-azure) to get an access token from Microsoft identity provider and access Azure AD protected resources.

## Prerequisites
[Create an app registration](quickstart-register-app.md) in Azure AD.  Grant your app access to the Azure resources targeted by your GitHub workflow.  

Find the object ID of the app (not the application (client) ID), which you need in the following steps.  You can find the object ID of the app in the Azure portal.  Go to the list of [registered applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) in the Azure portal and select your app registration.  In **Overview**->**Essentials**, find the **Object ID**.

Get the organization, repository, and environment information for your GitHub repo, which you need in the following steps.

## Configure a federated identity credential

# [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/).  Go to **App registrations** and open the app you want to configure.

Go to **Certificates and secrets**.  In the **Federated credentials** tab, select **Add credential**.  The **Add a credential** blade opens.

In the **Federated credential scenario** drop-down box select **GitHub Actions deploying Azure resources**.

Specify the **Organization** and **Repository** for your GitHub Actions workflow.  

For **Entity type**, select **Environment**, **Branch**, **Pull request**, or **Tag** and specify the value. The values must exactly match the configuration in the [GitHub workflow](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#on).  For more info, read the [examples](#entity-type-examples).

Add a **Name** for the federated credential.

The **Issuer**, **Audiences**, and **Subject identifier** fields autopopulate based on the values you entered.

Click **Add** to configure the federated credential.

:::image type="content" source="media/workload-identity-federation-create-trust-github/add-credential.png" alt-text="Screenshot of the Add a credential window, showing sample values." :::

> [!NOTE]
> If you accidentally configure someone else's GitHub repo in the *subject* setting (enter a typo that matches someone elses repo) you can successfully create the federated identity credential.  But in the GitHub configuration, however, you would get an error because you aren't able to access another person's repo.

> [!IMPORTANT]
> The **Organization**, **Repository**, and **Entity type** values must exactly match the configuration on the GitHub workflow configuration. Otherwise, Microsoft identity platform will look at the incoming external token and reject the exchange for an access token.  You won't get an error, the exchange fails without error.

### Entity type examples

#### Branch example

For a workflow triggered by a push or pull request event on the main branch:

```yml
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
```

Specify an **Entity type** of **Branch** and a **GitHub branch name** of "main".

#### Environment example

For Jobs tied to an environment named "production":

```yml
on:
  push:
    branches:
      - main

jobs:
  deployment:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: deploy
        # ...deployment-specific steps
```

Specify an **Entity type** of **Environment** and a **GitHub environment name** of "production".

#### Tag example

For example, for a workflow triggered by a push to the tag named "v2":

```yml
on:
  push:
    # Sequence of patterns matched against refs/heads
    branches:    
      - main
      - 'mona/octocat'
      - 'releases/**'
    # Sequence of patterns matched against refs/tags
    tags:        
      - v2
      - v1.*
```

Specify an **Entity type** of **Tag** and a **GitHub tag name** of "v2".

#### Pull request example

For a workflow triggered by a pull request event, specify an **Entity type** of **Pull request**.

# [Microsoft Graph](#tab/microsoft-graph)
Launch [Azure Cloud Shell](https://portal.azure.com/#cloudshell/) and sign in to your tenant.

### Create a federated identity credential

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

*name*: The name of your Azure application.

*issuer*: The path to the GitHub OIDC provider: `https://token.actions.githubusercontent.com/`. This issuer will become trusted by your Azure application.

*subject*: Before Azure will grant an access token, the request must match the conditions defined here.
- For Jobs tied to an environment: `repo:< Organization/Repository >:environment:< Name >`
- For Jobs not tied to an environment, include the ref path for branch/tag based on the ref path used for triggering the workflow: `repo:< Organization/Repository >:ref:< ref path>`.  For example, `repo:n-username/ node_express:ref:refs/heads/my-branch` or `repo:n-username/ node_express:ref:refs/tags/my-tag`.
- For workflows triggered by a pull request event: `repo:< Organization/Repository >:pull-request`.

*audiences*: `api://AzureADTokenExchange` is the required value.

> [!NOTE]
> If you accidentally configure someone else's GitHub repo in the *subject* setting (enter a typo that matches someone elses repo) you can successfully create the federated identity credential.  But in the GitHub configuration, however, you would get an error because you aren't able to access another person's repo.

> [!IMPORTANT]
> The *subject* setting values must exactly match the configuration on the GitHub workflow configuration.  Otherwise, Microsoft identity platform will look at the incoming external token and reject the exchange for an access token.  You won't get an error, the exchange fails without error.

### List federated identity credentials on an app

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

### Delete a federated identity credential

Run the following command to [delete a federated identity credential](/graph/api/application-list-federatedidentitycredentials?view=graph-rest-beta&preserve-view=true) from an app (specified by the object ID of the app):

```azurecli
az rest -m DELETE  -u 'https://graph.microsoft.com/beta/applications/f6475511-fd81-4965-a00e-41e7792b7b9c/federatedIdentityCredentials/1aa3e6a7-464c-4cd2-88d3-90db98132755' 
```
---

## Get the application (client) ID and tenant ID from the Azure portal

Before configuring your GitHub Actions workflow, get the *tenant-id* and *client-id* values of your app registration.  You can find these values in the Azure portal. Go to the list of [registered applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) and select your app registration.  In **Overview**->**Essentials**, find the **Application (client) ID** and **Directory (tenant) ID**. Set these values in your GitHub environment to use in the Azure login action for your workflow.  

## Next steps
For an end-to-end example, read [Deploy to App Service using GitHub Actions](../../app-service/deploy-github-actions.md?tabs=openid).

Read the [GitHub Actions documentation](https://docs.github.com/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure) to learn more about configuring your GitHub Actions workflow to get an access token from Microsoft identity provider and access Azure resources.