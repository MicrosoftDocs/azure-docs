---
title: Create a trust relationship between an app and GitHub
titleSuffix: Microsoft identity platform
description: 
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 10/15/2021
ms.author: ryanwi
ms.custom: aaddev
#Customer intent: As an application developer, I want to configure a federated credential on an app registration so I can create a trust relationship with a GitHub repo and use workload identity federation to access Azure resources without managing secrets.
---

# Configure an app to trust a GitHub repo
This article describes how to configure a trust relationship between an application in Azure Active Directory (Azure AD) and a GitHub repo.  Create a federated credential in the Azure portal or by using Microsoft Graph.

Anyone who can create an app reg and add a secret or cert can add a federated credential.  If the "don't let anyone create apps" switch is toggled, however, a dev won't be able to create an app reg or configure the credential.  Admin would have to do it on behalf of the dev.  Anyone in the app admin role or app owner role can do this.

## Prerequistes
[Create an app registration](quickstart-register-app.md) in Azure AD.  Grant the app the appropriate access to the Azure resources targeted by your GitHub workflow.  

Find the object ID of the app (not the application (client) ID, which you need in the following steps.

Launch [Azure Cloud Shell](https://portal.azure.com/#cloudshell/) and sign in to your tenant.

## Microsoft Graph
### Create

Run the following az rest command to [create a new federated identity credential](/graph/api/application-post-federatedidentitycredentials?view=graph-rest-beta) on an app (specified by the object ID of the app):

```azurecli
$ az rest --method POST --uri 'https://graph.microsoft.com/beta/applications/e7617ce5-4fff-4e3d-a59b-4446db11ffae/federatedIdentityCredentials' --body '{"name":"Testing","issuer":https://token.actions.githubusercontent.com/,"subject":"repo:octo-org/octo-repo:environment:Production","description":"Testing","audiences":["api://AzureADTokenExchange"]}' 
```

*name*: The name of your Azure application.

*issuer*: The path to the GitHub OIDC provider: `https://token.actions.githubusercontent.com/`. This issuer will become trusted by your Azure application.

*subject*: Before Azure will grant an access token, the request must match the conditions defined here.

- For Jobs tied to an environment: `repo:< Organization/Repository >:environment:< Name >`
- For Jobs not tied to an environment, include the ref path for branch/tag based on the ref path used for triggering the workflow: `repo:< Organization/Repository >:ref:< ref path>`.  For example, `repo:n-username/ node_express:ref:refs/heads/my-branch` or `repo:n-username/ node_express:ref:refs/tags/my-tag`.
- For workflows triggered by a pull request event: `repo:< Organization/Repository >:pull-request`.

*audiences*: `api://AzureADTokenExchange` is the recommended value, but you can also specify the workflow's repository URL here.

If you accidentally configure someone else's GitHub repo in the *subject* setting (enter a typo that matches someone elses repo) you can successfully create the federated identity credential.  But in the GitHub configuration, however, you would get an error because you aren't able to access another person's repo.

The *subject* setting values must exactly match the configuration on the GitHub workflow configuration.  Otherwise, Microsoft identity platform will look at the incoming external token and reject the exchange for an access token.  You won't get an error, the exchange fails without error.

### List

Run the following command to [list the federated identity credential(s)](/graph/api/application-list-federatedidentitycredentials?view=graph-rest-beta) for an app (specified by the object ID of the app):

```azurecli
az rest -m GET -u 'https://graph.microsoft.com/beta/applications/e7617ce5-4fff-4e3d-a59b-4446db11ffae/federatedIdentityCredentials' 
```

And you get a response similar to:

```azurecli
{
  "@odata.context": "https://graph.microsoft.com/beta/$metadata#applications('e7617ce5-4fff-4e3d-a59b-4446db11ffae')/federatedIdentityCredentials",
  "value": [
    {
      "audiences": [
        "api://AzureADTokenExchange"
      ],
      "description": "Testing",
      "id": "68eedfd9-ad7a-47d7-9b0c-d7170cf645fb",
      "issuer": "https://token.actions.githubusercontent.com/",
      "name": "Testing",
      "subject": "repo:octo-org/octo-repo:environment:Production"
    }
  ]
}
```

### Delete

Run the following command to [delete a federated identity credential](/graph/api/application-list-federatedidentitycredentials?view=graph-rest-beta) from an app (specified by the object ID of the app):

```azurecli
az rest -m DELETE  -u 'https://graph.microsoft.com/beta/applications/e7617ce5-4fff-4e3d-a59b-4446db11ffae/federatedIdentityCredentials/68eedfd9-ad7a-47d7-9b0c-d7170cf645fb' 
```

## Portal- draft, work in progress
### Configure the federated credentials on the application

Navigate to the app registration in the Azure portal and setup a federated credential.

The **Organization**, **Repository**, and **Entity type** values must exactly match the configuration on the GitHub workflow configuration.  Otherwise Azure AD will look at the token and reject the exchange.  Won't get an error, it just won't work.

what if I accidently configure someone else's github repo?  Put typo in config settings that matches someone elses repo?  In Azure portal, would be able to configure.  But in GitHub configuration would get an error because you can't access the other person's repo.

### Give the app registration appropriate access to the Azure resources targeted by your GitHub workflow

Grant the application contributor role on a subscription; copy Subscription ID

## Get the application (client) ID and tenant ID from Azure Portal

Copy the *tenant-id* and *client-id* values of the app registration.  You need to set these values in your GitHub environment to use in the workflow Azure login action.  Two options now for GitHub in Azure Login Action.  Can store client ID and tenant ID in GitHub secrets if you want or you can inline client ID, tenant ID, subscription ID directly in your workflow.

## Next steps

Configure a GitHub Actions workflow to get an access token from Microsoft identity provider and access Azure resources (described in the [GitHub Actions documentation](https://docs.github.com/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure)).