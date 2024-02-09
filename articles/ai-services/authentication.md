---
title: Authentication in Azure AI services
titleSuffix: Azure AI services
description: "There are three ways to authenticate a request to an Azure AI services resource: a resource key, a bearer token, or a multi-service subscription. In this article, you'll learn about each method, and how to make a request."
#services: cognitive-services
author: mgreenegit
manager: nitinme
ms.service: azure-ai-services
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 08/30/2023
ms.author: migreene
---

# Authenticate requests to Azure AI services

Each request to an Azure AI service must include an authentication header. This header passes along a resource key or authentication token, which is used to validate your subscription for a service or group of services. In this article, you'll learn about three ways to authenticate a request and the requirements for each.

* Authenticate with a [single-service](#authenticate-with-a-single-service-resource-key) or [multi-service](#authenticate-with-a-multi-service-resource-key) resource key
* Authenticate with a [token](#authenticate-with-an-access-token)
* Authenticate with [Microsoft Entra ID](#authenticate-with-azure-active-directory)

## Prerequisites

Before you make a request, you need an Azure account and an Azure AI services subscription. If you already have an account, go ahead and skip to the next section. If you don't have an account, we have a guide to get you set up in minutes: [Create a multi-service resource](multi-service-resource.md?pivots=azportal).

You can get your resource key from the [Azure portal](multi-service-resource.md?pivots=azportal#get-the-keys-for-your-resource) after [creating your account](https://azure.microsoft.com/free/cognitive-services/).

## Authentication headers

Let's quickly review the authentication headers available for use with Azure AI services.

| Header | Description |
|--------|-------------|
| Ocp-Apim-Subscription-Key | Use this header to authenticate with a resource key for a specific service or a multi-service resource key. |
| Ocp-Apim-Subscription-Region | This header is only required when using a multi-service resource key with the [Translator service](./Translator/reference/v3-0-reference.md). Use this header to specify the resource region. |
| Authorization | Use this header if you are using an access token. The steps to perform a token exchange are detailed in the following sections. The value provided follows this format: `Bearer <TOKEN>`. |

## Authenticate with a single-service resource key

The first option is to authenticate a request with a resource key for a specific service, like Translator. The keys are available in the Azure portal for each resource that you've created. To use a resource key to authenticate a request, it must be passed along as the `Ocp-Apim-Subscription-Key` header.

These sample requests demonstrate how to use the `Ocp-Apim-Subscription-Key` header. Keep in mind, when using this sample you'll need to include a valid resource key.

This is a sample call to the Translator service:
```cURL
curl -X POST 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=de' \
-H 'Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY' \
-H 'Content-Type: application/json' \
--data-raw '[{ "text": "How much for the cup of coffee?" }]' | json_pp
```

The following video demonstrates using an Azure AI services key.

## Authenticate with a multi-service resource key

You can use a [multi-service](./multi-service-resource.md) resource key to authenticate requests. The main difference is that the multi-service resource key isn't tied to a specific service, rather, a single key can be used to authenticate requests for multiple Azure AI services. See [Azure AI services pricing](https://azure.microsoft.com/pricing/details/cognitive-services/) for information about regional availability, supported features, and pricing.

The resource key is provided in each request as the `Ocp-Apim-Subscription-Key` header.

[![Multi-service resource key demonstration for Azure AI services](./media/index/single-key-demonstration-video.png)](https://www.youtube.com/watch?v=psHtA1p7Cas&feature=youtu.be)

### Supported regions

When using the [multi-service](./multi-service-resource.md) resource key to make a request to `api.cognitive.microsoft.com`, you must include the region in the URL. For example: `westus.api.cognitive.microsoft.com`.

When using a multi-service resource key with [Azure AI Translator](./translator/index.yml), you must specify the resource region with the `Ocp-Apim-Subscription-Region` header.

Multi-service authentication is supported in these regions:

- `australiaeast`
- `brazilsouth`
- `canadacentral`
- `centralindia`
- `eastasia`
- `eastus`
- `japaneast`
- `northeurope`
- `southcentralus`
- `southeastasia`
- `uksouth`
- `westcentralus`
- `westeurope`
- `westus`
- `westus2`
- `francecentral`
- `koreacentral`
- `northcentralus`
- `southafricanorth`
- `uaenorth`
- `switzerlandnorth`


### Sample requests

This is a sample call to the Translator service:

```cURL
curl -X POST 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=de' \
-H 'Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY' \
-H 'Ocp-Apim-Subscription-Region: YOUR_SUBSCRIPTION_REGION' \
-H 'Content-Type: application/json' \
--data-raw '[{ "text": "How much for the cup of coffee?" }]' | json_pp
```

## Authenticate with an access token

Some Azure AI services accept, and in some cases require, an access token. Currently, these services support access tokens:

* Text Translation API
* Speech Services: Speech to text API
* Speech Services: Text to speech API

>[!NOTE]
> QnA Maker also uses the Authorization header, but requires an endpoint key. For more information, see [QnA Maker: Get answer from knowledge base](./qnamaker/quickstarts/get-answer-from-knowledge-base-using-url-tool.md).

>[!WARNING]
> The services that support access tokens may change over time, please check the API reference for a service before using this authentication method.

Both single service and multi-service resource keys can be exchanged for authentication tokens. Authentication tokens are valid for 10 minutes. They're stored in JSON Web Token (JWT) format and can be queried programmatically using the [JWT libraries](https://jwt.io/libraries). 

Access tokens are included in a request as the `Authorization` header. The token value provided must be preceded by `Bearer`, for example: `Bearer YOUR_AUTH_TOKEN`.

### Sample requests

Use this URL to exchange a resource key for an access token: `https://YOUR-REGION.api.cognitive.microsoft.com/sts/v1.0/issueToken`.

```cURL
curl -v -X POST \
"https://YOUR-REGION.api.cognitive.microsoft.com/sts/v1.0/issueToken" \
-H "Content-type: application/x-www-form-urlencoded" \
-H "Content-length: 0" \
-H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"
```

These multi-service regions support token exchange:

- `australiaeast`
- `brazilsouth`
- `canadacentral`
- `centralindia`
- `eastasia`
- `eastus`
- `japaneast`
- `northeurope`
- `southcentralus`
- `southeastasia`
- `uksouth`
- `westcentralus`
- `westeurope`
- `westus`
- `westus2`

After you get an access token, you'll need to pass it in each request as the `Authorization` header. This is a sample call to the Translator service:

```cURL
curl -X POST 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=de' \
-H 'Authorization: Bearer YOUR_AUTH_TOKEN' \
-H 'Content-Type: application/json' \
--data-raw '[{ "text": "How much for the cup of coffee?" }]' | json_pp
```

<a name='authenticate-with-azure-active-directory'></a>

## Authenticate with Microsoft Entra ID

> [!IMPORTANT]
> Microsoft Entra authentication always needs to be used together with custom subdomain name of your Azure resource. [Regional endpoints](./cognitive-services-custom-subdomains.md#is-there-a-list-of-regional-endpoints) do not support Microsoft Entra authentication.

In the previous sections, we showed you how to authenticate against Azure AI services using a single-service or multi-service subscription key. While these keys provide a quick and easy path to start development, they fall short in more complex scenarios that require Azure [role-based access control (Azure RBAC)](../../articles/role-based-access-control/overview.md). Let's take a look at what's required to authenticate using Microsoft Entra ID.

In the following sections, you'll use either the Azure Cloud Shell environment or the Azure CLI to create a subdomain, assign roles, and obtain a bearer token to call the Azure AI services. If you get stuck, links are provided in each section with all available options for each command in Azure Cloud Shell/Azure CLI.

> [!IMPORTANT]
> If your organization is doing authentication through Microsoft Entra ID, you should [disable local authentication](./disable-local-auth.md) (authentication with keys) so that users in the organization must always use Microsoft Entra ID.

### Create a resource with a custom subdomain

The first step is to create a custom subdomain. If you want to use an existing Azure AI services resource which does not have custom subdomain name, follow the instructions in [Azure AI services custom subdomains](./cognitive-services-custom-subdomains.md#how-does-this-impact-existing-resources) to enable custom subdomain for your resource.

1. Start by opening the Azure Cloud Shell. Then [select a subscription](/powershell/module/az.accounts/set-azcontext):

   ```powershell-interactive
   Set-AzContext -SubscriptionName <SubscriptionName>
   ```

2. Next, [create an Azure AI services resource](/powershell/module/az.cognitiveservices/new-azcognitiveservicesaccount) with a custom subdomain. The subdomain name needs to be globally unique and cannot include special characters, such as: ".", "!", ",".

   ```powershell-interactive
   $account = New-AzCognitiveServicesAccount -ResourceGroupName <RESOURCE_GROUP_NAME> -name <ACCOUNT_NAME> -Type <ACCOUNT_TYPE> -SkuName <SUBSCRIPTION_TYPE> -Location <REGION> -CustomSubdomainName <UNIQUE_SUBDOMAIN>
   ```

3. If successful, the **Endpoint** should show the subdomain name unique to your resource.


### Assign a role to a service principal

Now that you have a custom subdomain associated with your resource, you're going to need to assign a role to a service principal.

> [!NOTE]
> Keep in mind that Azure role assignments may take up to five minutes to propagate.

1. First, let's register an [Microsoft Entra application](/powershell/module/Az.Resources/New-AzADApplication).

   ```powershell-interactive
   $SecureStringPassword = ConvertTo-SecureString -String <YOUR_PASSWORD> -AsPlainText -Force

   $app = New-AzureADApplication -DisplayName <APP_DISPLAY_NAME> -IdentifierUris <APP_URIS> -PasswordCredentials $SecureStringPassword
   ```

   You're going to need the **ApplicationId** in the next step.

2. Next, you need to [create a service principal](/powershell/module/az.resources/new-azadserviceprincipal) for the Microsoft Entra application.

   ```powershell-interactive
   New-AzADServicePrincipal -ApplicationId <APPLICATION_ID>
   ```

   >[!NOTE]
   > If you register an application in the Azure portal, this step is completed for you.

3. The last step is to [assign the "Cognitive Services User" role](/powershell/module/az.Resources/New-azRoleAssignment) to the service principal (scoped to the resource). By assigning a role, you're granting service principal access to this resource. You can grant the same service principal access to multiple resources in your subscription.
   >[!NOTE]
   > The ObjectId of the service principal is used, not the ObjectId for the application.
   > The ACCOUNT_ID will be the Azure resource Id of the Azure AI services account you created. You can find Azure resource Id from "properties" of the resource in Azure portal.

   ```azurecli-interactive
   New-AzRoleAssignment -ObjectId <SERVICE_PRINCIPAL_OBJECTID> -Scope <ACCOUNT_ID> -RoleDefinitionName "Cognitive Services User"
   ```

### Sample request

In this sample, a password is used to authenticate the service principal. The token provided is then used to call the Computer Vision API.

1. Get your **TenantId**:
   ```powershell-interactive
   $context=Get-AzContext
   $context.Tenant.Id
   ```

2. Get a token:
   > [!NOTE]
   > If you're using Azure Cloud Shell, the `SecureClientSecret` class isn't available. 

   #### [PowerShell](#tab/powershell)
   ```powershell-interactive
   $authContext = New-Object "Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext" -ArgumentList "https://login.windows.net/<TENANT_ID>"
   $secureSecretObject = New-Object "Microsoft.IdentityModel.Clients.ActiveDirectory.SecureClientSecret" -ArgumentList $SecureStringPassword   
   $clientCredential = New-Object "Microsoft.IdentityModel.Clients.ActiveDirectory.ClientCredential" -ArgumentList $app.ApplicationId, $secureSecretObject
   $token=$authContext.AcquireTokenAsync("https://cognitiveservices.azure.com/", $clientCredential).Result
   $token
   ```
   
   #### [Azure Cloud Shell](#tab/azure-cloud-shell)
   ```Azure Cloud Shell
   $authContext = New-Object "Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext" -ArgumentList "https://login.windows.net/<TENANT_ID>"
   $clientCredential = New-Object "Microsoft.IdentityModel.Clients.ActiveDirectory.ClientCredential" -ArgumentList $app.ApplicationId, <YOUR_PASSWORD>
   $token=$authContext.AcquireTokenAsync("https://cognitiveservices.azure.com/", $clientCredential).Result
   $token
   ``` 

   ---

3. Call the Computer Vision API:
   ```powershell-interactive
   $url = $account.Endpoint+"vision/v1.0/models"
   $result = Invoke-RestMethod -Uri $url  -Method Get -Headers @{"Authorization"=$token.CreateAuthorizationHeader()} -Verbose
   $result | ConvertTo-Json
   ```

Alternatively, the service principal can be authenticated with a certificate. Besides service principal, user principal is also supported by having permissions delegated through another Microsoft Entra application. In this case, instead of passwords or certificates, users would be prompted for two-factor authentication when acquiring token.

## Authorize access to managed identities
 
Azure AI services support Microsoft Entra authentication with [managed identities for Azure resources](../../articles/active-directory/managed-identities-azure-resources/overview.md). Managed identities for Azure resources can authorize access to Azure AI services resources using Microsoft Entra credentials from applications running in Azure virtual machines (VMs), function apps, virtual machine scale sets, and other services. By using managed identities for Azure resources together with Microsoft Entra authentication, you can avoid storing credentials with your applications that run in the cloud.  

### Enable managed identities on a VM

Before you can use managed identities for Azure resources to authorize access to Azure AI services resources from your VM, you must enable managed identities for Azure resources on the VM. To learn how to enable managed identities for Azure Resources, see:

- [Azure portal](../../articles/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)
- [Azure PowerShell](../../articles/active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md)
- [Azure CLI](../../articles/active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md)
- [Azure Resource Manager template](../../articles/active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md)
- [Azure Resource Manager client libraries](../../articles/active-directory/managed-identities-azure-resources/qs-configure-sdk-windows-vm.md)

For more information about managed identities, see [Managed identities for Azure resources](../../articles/active-directory/managed-identities-azure-resources/overview.md).

## Use Azure key vault to securely access credentials

You can [use Azure Key Vault](./use-key-vault.md) to securely develop Azure AI services applications. Key Vault enables you to store your authentication credentials in the cloud, and reduces the chances that secrets may be accidentally leaked, because you won't store security information in your application.

Authentication is done via Microsoft Entra ID. Authorization may be done via Azure role-based access control (Azure RBAC) or Key Vault access policy. Azure RBAC can be used for both management of the vaults and access data stored in a vault, while key vault access policy can only be used when attempting to access data stored in a vault.

## See also

* [What are Azure AI services?](./what-are-ai-services.md)
* [Azure AI services pricing](https://azure.microsoft.com/pricing/details/cognitive-services/)
* [Custom subdomains](cognitive-services-custom-subdomains.md)
