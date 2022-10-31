---
title: Create a trust relationship between an app and an external identity provider
description: Set up a trust relationship between an app in Azure AD and an external identity provider.  This allows a software workload outside of Azure to access Azure AD protected resources without using secrets or certificates. 
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 10/31/2022
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: shkhalid, udayh, vakarand
zone_pivot_groups: identity-wif-apps-methods
#Customer intent: As an application developer, I want to configure a federated credential on an app registration so I can create a trust relationship with an external identity provider and use workload identity federation to access Azure AD protected resources without managing secrets.
---

# Configure an app to trust an external identity provider

This article describes how to manage a federated identity credential on an application in Azure Active Directory (Azure AD).  The federated identity credential creates a trust relationship between an application and an external identity provider (IdP).

You can then configure an external software workload to exchange a token from the external IdP for an access token from Microsoft identity platform. The external workload can access Azure AD protected resources without needing to manage secrets (in supported scenarios).  To learn more about the token exchange workflow, read about [workload identity federation](workload-identity-federation.md).  

In this article, you learn how to create, list, and delete federated identity credentials on an application in Azure AD.

## Important considerations and restrictions

[!INCLUDE [federated credential configuration](./includes/federated-credential-configuration-considerations.md)]

To learn more about supported regions, time to propagate federated credential updates, supported issuers and more, read [Important considerations and restrictions for federated identity credentials](workload-identity-federation-considerations.md).

::: zone pivot="identity-wif-apps-methods-azp"

## Prerequisites
[Create an app registration](quickstart-register-app.md) in Azure AD.  Grant your app access to the Azure resources targeted by your external software workload.  

Find the object ID of the app (not the application (client) ID), which you need in the following steps.  You can find the object ID of the app in the Azure portal.  Go to the list of [registered applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) in the Azure portal and select your app registration.  In **Overview**->**Essentials**, find the **Object ID**.

Get the *subject* and *issuer* information for your external IdP and software workload, which you need in the following steps.

## Configure a federated identity credential on an app

### GitHub Actions
Find your app registration in the [App Registrations](https://aka.ms/appregistrations) experience of the Azure portal.  Select **Certificates & secrets** in the left nav pane, select the **Federated credentials** tab, and select **Add credential**.

In the **Federated credential scenario** drop-down box, select **GitHub actions deploying Azure resources**.

Specify the **Organization** and **Repository** for your GitHub Actions workflow.  

For **Entity type**, select **Environment**, **Branch**, **Pull request**, or **Tag** and specify the value. The values must exactly match the configuration in the [GitHub workflow](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#on). Pattern matching is not supported for branches and tags. Specify an environment if your on-push workflow runs against many branches or tags. For more info, read the [examples](#entity-type-examples).

Add a **Name** for the federated credential.

The **Issuer**, **Audiences**, and **Subject identifier** fields autopopulate based on the values you entered.

Click **Add** to configure the federated credential.

:::image type="content" source="media/workload-identity-federation-create-trust/add-credential.png" alt-text="Screenshot of the Add a credential window, showing sample values." :::

#### Entity type examples

##### Branch example

For a workflow triggered by a push or pull request event on the main branch:

```yml
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
```

Specify an **Entity type** of **Branch** and a **GitHub branch name** of "main".

##### Environment example

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

##### Tag example

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

##### Pull request example

For a workflow triggered by a pull request event, specify an **Entity type** of **Pull request**

### Kubernetes

Find your app registration in the [App Registrations](https://aka.ms/appregistrations) experience of the Azure portal.  Select **Certificates & secrets** in the left nav pane, select the **Federated credentials** tab, and select **Add credential**.

Select the **Kubernetes accessing Azure resources** scenario from the dropdown menu.

Fill in the **Cluster issuer URL**, **Namespace**, **Service account name**, and **Name** fields:

- **Cluster issuer URL** is the [OIDC issuer URL](../../aks/cluster-configuration.md#oidc-issuer) for the managed cluster or the [OIDC Issuer URL](https://azure.github.io/azure-workload-identity/docs/installation/self-managed-clusters/oidc-issuer.html) for a self-managed cluster.
- **Service account name** is the name of the Kubernetes service account, which provides an identity for processes that run in a Pod. 
- **Namespace** is the service account namespace.
- **Name** is the name of the federated credential, which can't be changed later.

### Other identity providers

Find your app registration in the [App Registrations](https://aka.ms/appregistrations) experience of the Azure portal.  Select **Certificates & secrets** in the left nav pane, select the **Federated credentials** tab, and select **Add credential**.

Select the **Other issuer** scenario from the dropdown menu.

Specify the following fields (using a software workload running in Google Cloud as an example):

- **Name** is the name of the federated credential, which can't be changed later.
- **Subject identifier**: must match the `sub` claim in the token issued by the external identity provider.  In this example using Google Cloud, *subject* is the Unique ID of the service account you plan to use.
- **Issuer**: must match the `iss` claim in the token issued by the external identity provider. A URL that complies with the OIDC Discovery spec. Azure AD uses this issuer URL to fetch the keys that are necessary to validate the token. For Google Cloud, the *issuer* is "https://accounts.google.com".

## List federated identity credentials on an app

Find your app registration in the [App Registrations](https://aka.ms/appregistrations) experience of the Azure portal.  Select **Certificates & secrets** in the left nav pane and select the **Federated credentials** tab.  The federated credentials that are configured on your app are listed.

## Delete a federated identity credential from an app

Find your app registration in the [App Registrations](https://aka.ms/appregistrations) experience of the Azure portal.  Select **Certificates & secrets** in the left nav pane and select the **Federated credentials** tab.  The federated credentials that are configured on your app are listed.

To delete a federated identity credential, select the **Delete** icon for the credential.

::: zone-end

::: zone pivot="identity-wif-apps-methods-azcli"

## Prerequisites

- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before you continue.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../../includes/azure-cli-prepare-your-environment-no-header.md)]

- [Create an app registration](quickstart-register-app.md) in Azure AD.  Grant your app access to the Azure resources targeted by your external software workload.
- Find the object ID, app (client) ID, or identifier URI of the app, which you need in the following steps.  You can find these values in the Azure portal.  Go to the list of [registered applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) in the Azure portal and select your app registration.  In **Overview**->**Essentials**, get the **Object ID**, **Application (client) ID**, or **Application ID URI** value, which you need in the following steps.
- Get the *subject* and *issuer* information for your external IdP and software workload, which you need in the following steps.

## Configure a federated identity credential on an app

Run the [az ad app federated-credential create](/cli/azure/ad/app/federated-credential) command to create a new federated identity credential on your app.  

The *id* parameter specifies the identifier URI, application ID, or object ID of the application.  *parameters* specifies the parameters, in JSON format, for creating the federated identity credential.

### GitHub Actions example

The *name* specifies the name of your federated identity credential.

The *issuer* identifies the path to the GitHub OIDC provider: `https://token.actions.githubusercontent.com/`. This issuer will become trusted by your Azure application.  

*subject* identifies the GitHub organization, repo, and environment for your GitHub Actions workflow.  When the GitHub Actions workflow requests Microsoft identity platform to exchange a GitHub token for an access token, the values in the federated identity credential are checked against the provided GitHub token. Before Azure will grant an access token, the request must match the conditions defined here.
- For Jobs tied to an environment: `repo:< Organization/Repository >:environment:< Name >`
- For Jobs not tied to an environment, include the ref path for branch/tag based on the ref path used for triggering the workflow: `repo:< Organization/Repository >:ref:< ref path>`.  For example, `repo:n-username/ node_express:ref:refs/heads/my-branch` or `repo:n-username/ node_express:ref:refs/tags/my-tag`.
- For workflows triggered by a pull request event: `repo:< Organization/Repository >:pull-request`.

```azurecli-interactive
az ad app federated-credential create --id f6475511-fd81-4965-a00e-41e7792b7b9c --parameters credential.json
("credential.json" contains the following content)
{
    "name": "Testing",
    "issuer": "https://token.actions.githubusercontent.com/",
    "subject": "repo:octo-org/octo-repo:environment:Production",
    "description": "Testing",
    "audiences": [
        "api://AzureADTokenExchange"
    ]
}
```

### Kubernetes example

*issuer* is your service account issuer URL (the [OIDC issuer URL](../../aks/cluster-configuration.md#oidc-issuer) for the managed cluster or the [OIDC Issuer URL](https://azure.github.io/azure-workload-identity/docs/installation/self-managed-clusters/oidc-issuer.html) for a self-managed cluster).  

*subject* is the subject name in the tokens issued to the service account. Kubernetes uses the following format for subject names: `system:serviceaccount:<SERVICE_ACCOUNT_NAMESPACE>:<SERVICE_ACCOUNT_NAME>`.

*name* is the name of the federated credential, which can't be changed later.

*audiences* lists the audiences that can appear in the external token.  This field is mandatory.  The recommended value is "api://AzureADTokenExchange".

```azurecli-interactive
az ad app federated-credential create --id f6475511-fd81-4965-a00e-41e7792b7b9c --parameters credential.json
("credential.json" contains the following content)
{
    "name": "Kubernetes-federated-credential",
    "issuer": "https://aksoicwesteurope.blob.core.windows.net/9d80a3e1-2a87-46ea-ab16-e629589c541c/",
    "subject": "system:serviceaccount:erp8asle:pod-identity-sa",
    "description": "Kubernetes service account federated credential",
    "audiences": [
        "api://AzureADTokenExchange"
    ]
}
```

### Other identity providers example

You can configure a federated identity credential on an app and create a trust relationship with other external identity providers.  The following example uses a software workload running in Google Cloud as an example:

*name* is the name of the federated credential, which can't be changed later.

*id*: the object ID, application (client) ID, or identifier URI of the app.

*subject*: must match the `sub` claim in the token issued by the external identity provider.  In this example using Google Cloud, *subject* is the Unique ID of the service account you plan to use.

*issuer*: must match the `iss` claim in the token issued by the external identity provider. A URL that complies with the OIDC Discovery spec. Azure AD uses this issuer URL to fetch the keys that are necessary to validate the token. For Google Cloud, the *issuer* is "https://accounts.google.com".

*audiences*: lists the audiences that can appear in the external token.  This field is mandatory.  The recommended value is "api://AzureADTokenExchange".

```azurecli-interactive
az ad app federated-credential create --id f6475511-fd81-4965-a00e-41e7792b7b9c --parameters credential.json
("credential.json" contains the following content)
{
    "name": "GcpFederation",
    "issuer": "https://accounts.google.com",
    "subject": "112633961854638529490",
    "description": "Test GCP federation",
    "audiences": [
        "api://AzureADTokenExchange"
    ]
}
```

## List federated identity credentials on an app

Run the [az ad app federated-credential list](/cli/azure/ad/app/federated-credential) command to list the federated identity credentials on your app.

The *id* parameter specifies the identifier URI, application ID, or object ID of the application.

```azurecli-interactive
az ad app federated-credential list --id f6475511-fd81-4965-a00e-41e7792b7b9c
```

## Get a federated identity credential on an app

Run the [az ad app federated-credential show](/cli/azure/ad/app/federated-credential) command to get a federated identity credential on your app.

The *id* parameter specifies the identifier URI, application ID, or object ID of the application.

The *federated-credential-id* specifies the ID or name of the federated identity credential.

```azurecli-interactive
az ad app federated-credential show --id f6475511-fd81-4965-a00e-41e7792b7b9c --federated-credential-id c79f8feb-a9db-4090-85f9-90d820caa0eb
```

## Delete a federated identity credential from an app

Run the [az ad app federated-credential delete](/cli/azure/ad/app/federated-credential) command to remove a federated identity credential from your app.

The *id* parameter specifies the identifier URI, application ID, or object ID of the application.

The *federated-credential-id* specifies the ID or name of the federated identity credential.

```azurecli-interactive
az ad app federated-credential delete --id f6475511-fd81-4965-a00e-41e7792b7b9c --federated-credential-id c79f8feb-a9db-4090-85f9-90d820caa0eb
```

::: zone-end

::: zone pivot="identity-wif-apps-methods-powershell"

## Prerequisites
- To run the example scripts, you have two options:
  - Use [Azure Cloud Shell](../../cloud-shell/overview.md), which you can open by using the **Try It** button in the upper-right corner of code blocks.
  - Run scripts locally with Azure PowerShell, as described in the next section.
- [Create an app registration](quickstart-register-app.md) in Azure AD.  Grant your app access to the Azure resources targeted by your external software workload.
- Find the object ID of the app (not the application (client) ID), which you need in the following steps.  You can find the object ID of the app in the Azure portal.  Go to the list of [registered applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) in the Azure portal and select your app registration.  In **Overview**->**Essentials**, find the **Object ID**.
- Get the *subject* and *issuer* information for your external IdP and software workload, which you need in the following steps.

### Configure Azure PowerShell locally

To use Azure PowerShell locally for this article instead of using Cloud Shell:

1. Install [the latest version of Azure PowerShell](/powershell/azure/install-az-ps) if you haven't already.

1. Sign in to Azure.

    ```azurepowershell
    Connect-AzAccount
    ```

1. Install the [latest version of PowerShellGet](/powershell/scripting/gallery/installing-psget#for-systems-with-powershell-50-or-newer-you-can-install-the-latest-powershellget).

    ```azurepowershell
    Install-Module -Name PowerShellGet -AllowPrerelease
    ```

    You might need to `Exit` out of the current PowerShell session after you run this command for the next step.

1. Install the prerelease version of the `Az.Resources` module to perform the federated identity credential operations in this article.

    ```azurepowershell
    Install-Module -Name Az.Resources -AllowPrerelease
    ```

## Configure a federated identity credential on an app

Run the [New-AzADAppFederatedCredential](/powershell/module/az.resources/new-azadappfederatedcredential) cmdlet to create a new federated identity credential on an application.

### GitHub Actions example

- *ApplicationObjectId*: the object ID of the app (not the application (client) ID) you previously registered in Azure AD.
- *Issuer* identifies GitHub as the external token issuer.  
- *Subject* identifies the GitHub organization, repo, and environment for your GitHub Actions workflow.  When the GitHub Actions workflow requests Microsoft identity platform to exchange a GitHub token for an access token, the values in the federated identity credential are checked against the provided GitHub token.
    - For Jobs tied to an environment: `repo:< Organization/Repository >:environment:< Name >`
    - For Jobs not tied to an environment, include the ref path for branch/tag based on the ref path used for triggering the workflow: `repo:< Organization/Repository >:ref:< ref path>`.  For example, `repo:n-username/ node_express:ref:refs/heads/my-branch` or `repo:n-username/ node_express:ref:refs/tags/my-tag`.
    - For workflows triggered by a pull request event: `repo:< Organization/Repository >:pull-request`.
- *Name* is the name of the federated credential, which can't be changed later.
- *Audience* lists the audiences that can appear in the external token.  This field is mandatory.  The recommended value is "api://AzureADTokenExchange".

```azurepowershell-interactive
New-AzADAppFederatedCredential -ApplicationObjectId $appObjectId -Audience api://AzureADTokenExchange -Issuer 'https://token.actions.githubusercontent.com/' -Name 'GitHub-Actions-Test' -Subject 'repo:octo-org/octo-repo:environment:Production'
```

### Kubernetes example

- *ApplicationObjectId*: the object ID of the app (not the application (client) ID) you previously registered in Azure AD.
- *Issuer* is your service account issuer URL (the [OIDC issuer URL](../../aks/cluster-configuration.md#oidc-issuer) for the managed cluster or the [OIDC Issuer URL](https://azure.github.io/azure-workload-identity/docs/installation/self-managed-clusters/oidc-issuer.html) for a self-managed cluster).  
- *Subject* is the subject name in the tokens issued to the service account. Kubernetes uses the following format for subject names: `system:serviceaccount:<SERVICE_ACCOUNT_NAMESPACE>:<SERVICE_ACCOUNT_NAME>`.
- *Name* is the name of the federated credential, which can't be changed later.
- *Audience* lists the audiences that can appear in the `aud` claim of the external token.

```azurepowershell-interactive
New-AzADAppFederatedCredential -ApplicationObjectId $appObjectId -Audience api://AzureADTokenExchange -Issuer 'https://aksoicwesteurope.blob.core.windows.net/9d80a3e1-2a87-46ea-ab16-e629589c541c/' -Name 'Kubernetes-federated-credential' -Subject 'system:serviceaccount:erp8asle:pod-identity-sa'
```

### Other identity providers example

Specify the following parameters (using a software workload running in Google Cloud as an example):

- *ObjectID*: the object ID of the app (not the application (client) ID) you previously registered in Azure AD.
- *Name* is the name of the federated credential, which can't be changed later.
- *Subject*: must match the `sub` claim in the token issued by the external identity provider.  In this example using Google Cloud, *subject* is the Unique ID of the service account you plan to use.
- *Issuer*: must match the `iss` claim in the token issued by the external identity provider. A URL that complies with the OIDC Discovery spec. Azure AD uses this issuer URL to fetch the keys that are necessary to validate the token. For Google Cloud, the *issuer* is "https://accounts.google.com".
- *Audiences*: must match the `aud` claim in the external token. For security reasons, you should pick a value that is unique for tokens meant for Azure AD. The recommended value is "api://AzureADTokenExchange".

```azurepowershell-interactive
New-AzADAppFederatedCredential -ApplicationObjectId $appObjectId -Audience api://AzureADTokenExchange -Issuer 'https://accounts.google.com' -Name 'GcpFederation' -Subject '112633961854638529490'
```

## List federated identity credentials on an app

Run the [Get-AzADAppFederatedCredential](/powershell/module/az.resources/get-azadappfederatedcredential) cmdlet to list the federated identity credentials for an application.

```azurepowershell-interactive
Get-AzADApplication -ObjectId $app | Get-AzADAppFederatedCredential
```

## Get a federated identity credential on an app

Run the [Get-AzADAppFederatedCredential](/powershell/module/az.resources/get-azadappfederatedcredential) cmdlet to get the federated identity credential by ID from an application.

```azurepowershell-interactive
Get-AzADAppFederatedCredential -ApplicationObjectId $appObjectId -FederatedCredentialId $credentialId
```

## Delete a federated identity credential from an app

Run the [Remove-AzADAppFederatedCredential](/powershell/module/az.resources/remove-azadappfederatedcredential) cmdlet to delete a federated identity credential from an application.

```azurepowershell-interactive
Remove-AzADAppFederatedCredential -ApplicationObjectId $appObjectId -FederatedCredentialId $credentialId
```

::: zone-end

::: zone pivot="identity-wif-apps-methods-rest"

## Prerequisites
[Create an app registration](quickstart-register-app.md) in Azure AD.  Grant your app access to the Azure resources targeted by your external software workload.  

Find the object ID of the app (not the application (client) ID), which you need in the following steps.  You can find the object ID of the app in the Azure portal.  Go to the list of [registered applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) in the Azure portal and select your app registration.  In **Overview**->**Essentials**, find the **Object ID**.

Get the *subject* and *issuer* information for your external IdP and software workload, which you need in the following steps.

The Microsoft Graph endpoint (`https://graph.microsoft.com`) exposes REST APIs to create, update, delete [federatedIdentityCredentials](/graph/api/resources/federatedidentitycredential) on applications. Launch [Azure Cloud Shell](https://portal.azure.com/#cloudshell/) and sign in to your tenant in order to run Microsoft Graph commands from AZ CLI.

## Configure a federated identity credential on an app

### GitHub Actions 

Run the following method to [create a new federated identity credential](/graph/api/application-post-federatedidentitycredentials) on your app (specified by the object ID of the app).  The *issuer* identifies GitHub as the external token issuer.  *subject* identifies the GitHub organization, repo, and environment for your GitHub Actions workflow.  When the GitHub Actions workflow requests Microsoft identity platform to exchange a GitHub token for an access token, the values in the federated identity credential are checked against the provided GitHub token.

```azurecli
az rest --method POST --uri 'https://graph.microsoft.com/applications/f6475511-fd81-4965-a00e-41e7792b7b9c/federatedIdentityCredentials' --body '{"name":"Testing","issuer":"https://token.actions.githubusercontent.com/","subject":"repo:octo-org/octo-repo:environment:Production","description":"Testing","audiences":["api://AzureADTokenExchange"]}' 
```

And you get the response:
```azurecli
{
  "@odata.context": "https://graph.microsoft.com/$metadata#applications('f6475511-fd81-4965-a00e-41e7792b7b9c')/federatedIdentityCredentials/$entity",
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

*audiences* lists the audiences that can appear in the external token.  This field is mandatory.  The recommended value is "api://AzureADTokenExchange".

### Kubernetes example

Run the following method to configure a federated identity credential on an app and create a trust relationship with a Kubernetes service account.  Specify the following parameters:

- *issuer* is your service account issuer URL (the [OIDC issuer URL](../../aks/cluster-configuration.md#oidc-issuer) for the managed cluster or the [OIDC Issuer URL](https://azure.github.io/azure-workload-identity/docs/installation/self-managed-clusters/oidc-issuer.html) for a self-managed cluster).  
- *subject* is the subject name in the tokens issued to the service account. Kubernetes uses the following format for subject names: `system:serviceaccount:<SERVICE_ACCOUNT_NAMESPACE>:<SERVICE_ACCOUNT_NAME>`.
- *name* is the name of the federated credential, which can't be changed later.
- *audiences* lists the audiences that can appear in the external token.  This field is mandatory.  The recommended value is "api://AzureADTokenExchange".

```azurecli
az rest --method POST --uri 'https://graph.microsoft.com/applications/f6475511-fd81-4965-a00e-41e7792b7b9c/federatedIdentityCredentials' --body '{"name":"Kubernetes-federated-credential","issuer":"https://aksoicwesteurope.blob.core.windows.net/9d80a3e1-2a87-46ea-ab16-e629589c541c/","subject":"system:serviceaccount:erp8asle:pod-identity-sa","description":"Kubernetes service account federated credential","audiences":["api://AzureADTokenExchange"]}' 
```

And you get the response:
```azurecli
{
  "@odata.context": "https://graph.microsoft.com/$metadata#applications('f6475511-fd81-4965-a00e-41e7792b7b9c')/federatedIdentityCredentials/$entity",
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

### Other identity providers example

Run the following method to configure a federated identity credential on an app and create a trust relationship with an external identity provider.  Specify the following parameters (using a software workload running in Google Cloud as an example):

- *name* is the name of the federated credential, which can't be changed later.
- *ObjectID*: the object ID of the app (not the application (client) ID) you previously registered in Azure AD.
- *subject*: must match the `sub` claim in the token issued by the external identity provider.  In this example using Google Cloud, *subject* is the Unique ID of the service account you plan to use.
- *issuer*: must match the `iss` claim in the token issued by the external identity provider. A URL that complies with the OIDC Discovery spec. Azure AD uses this issuer URL to fetch the keys that are necessary to validate the token. For Google Cloud, the *issuer* is "https://accounts.google.com".
- *audiences* lists the audiences that can appear in the external token.  This field is mandatory.  The recommended value is "api://AzureADTokenExchange".

```azurecli
az rest --method POST --uri 'https://graph.microsoft.com/applications/<ObjectID>/federatedIdentityCredentials' --body '{"name":"GcpFederation","issuer":"https://accounts.google.com","subject":"112633961854638529490","description":"Testing","audiences":["api://AzureADTokenExchange"]}'
```

And you get the response:
```azurecli
{
  "@odata.context": "https://graph.microsoft.com/$metadata#applications('f6475511-fd81-4965-a00e-41e7792b7b9c')/federatedIdentityCredentials/$entity",
  "audiences": [
    "api://AzureADTokenExchange"
  ],
  "description": "Testing",
  "id": "51ecf9c3-35fc-4519-a28a-8c27c6178bca",
  "issuer": "https://accounts.google.com"",
  "name": "GcpFederation",
  "subject": "112633961854638529490"
}
```

## List federated identity credentials on an app

Run the following method to [list the federated identity credential(s)](/graph/api/application-list-federatedidentitycredentials) for an app (specified by the object ID of the app):

```azurecli
az rest -m GET -u 'https://graph.microsoft.com/applications/f6475511-fd81-4965-a00e-41e7792b7b9c/federatedIdentityCredentials' 
```

And you get a response similar to:

```azurecli
{
  "@odata.context": "https://graph.microsoft.com/$metadata#applications('f6475511-fd81-4965-a00e-41e7792b7b9c')/federatedIdentityCredentials",
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

## Get a federated identity credential on an app

Run the following method to [get a federated identity credential](/graph/api/federatedidentitycredential-get) for an app (specified by the object ID of the app):

```azurecli
az rest -m GET -u 'https://graph.microsoft.com/applications/f6475511-fd81-4965-a00e-41e7792b7b9c//federatedIdentityCredentials/1aa3e6a7-464c-4cd2-88d3-90db98132755' 
```

And you get a response similar to:

```azurecli
{
  "@odata.context": "https://graph.microsoft.com/$metadata#applications('f6475511-fd81-4965-a00e-41e7792b7b9c')/federatedIdentityCredentials",
  "value": {
      "@odata.context": "https://graph.microsoft.com/$metadata#applications('f6475511-fd81-4965-a00e-41e7792b7b9c')/federatedIdentityCredentials/$entity",
      "@odata.id": "https://graph.microsoft.com/v2/3d1e2be9-a10a-4a0c-8380-7ce190f98ed9/directoryObjects/$/Microsoft.DirectoryServices.Application('f6475511-fd81-4965-a00e-41e7792b7b9c')/federatedIdentityCredentials('f6475511-fd81-4965-a00e-41e7792b7b9c')/f6475511-fd81-4965-a00e-41e7792b7b9c",
    "audiences": [
        "api://AzureADTokenExchange"
      ],
      "description": "Testing",
      "id": "1aa3e6a7-464c-4cd2-88d3-90db98132755",
      "issuer": "https://token.actions.githubusercontent.com/",
      "name": "Testing",
      "subject": "repo:octo-org/octo-repo:environment:Production"
    }  
}
```

## Delete a federated identity credential from an app

Run the following method to [delete a federated identity credential](/graph/api/federatedidentitycredential-delete) from an app (specified by the object ID of the app):

```azurecli
az rest -m DELETE  -u 'https://graph.microsoft.com/applications/f6475511-fd81-4965-a00e-41e7792b7b9c/federatedIdentityCredentials/1aa3e6a7-464c-4cd2-88d3-90db98132755' 
```

::: zone-end

## Next steps
- To learn how to use workload identity federation for Kubernetes, see [Azure AD Workload Identity for Kubernetes](https://azure.github.io/azure-workload-identity/docs/quick-start.html) open source project. 
- To learn how to use workload identity federation for GitHub Actions, see [Configure a GitHub Actions workflow to get an access token](/azure/developer/github/connect-from-azure).
- Read the [GitHub Actions documentation](https://docs.github.com/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure) to learn more about configuring your GitHub Actions workflow to get an access token from Microsoft identity provider and access Azure resources.
- For more information, read about how Azure AD uses the [OAuth 2.0 client credentials grant](v2-oauth2-client-creds-grant-flow.md#third-case-access-token-request-with-a-federated-credential) and a client assertion issued by another IdP to get a token.
- For information about the required format of JWTs created by external identity providers, read about the [assertion format](active-directory-certificate-credentials.md#assertion-format).
