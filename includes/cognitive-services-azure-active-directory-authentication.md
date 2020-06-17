---
author: erhopf
ms.author: erhopf
ms.service: cognitive-services
ms.topic: include
ms.date: 05/11/2020
---

## Authenticate with Azure Active Directory

> [!IMPORTANT]
> 1. Currently, **only** the Computer Vision API, Face API, Text Analytics API, Immersive Reader, Form Recognizer, Anomaly Detector, and all Bing services except Bing Custom Search support authentication using Azure Active Directory (AAD).
> 2. AAD authentication needs to be always used together with custom subdomain name of your Azure resource. [Regional endpoints](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-custom-subdomains#is-there-a-list-of-regional-endpoints) does not support AAD authentication.

In the previous sections, we showed you how to authenticate against Azure Cognitive Services using either a single-service or multi-service subscription key. While these keys provide a quick and easy path to start development, they fall short in more complex scenarios that require role-based access controls. Let's take a look at what's required to authenticate using Azure Active Directory (AAD).

In the following sections, you'll use either the Azure Cloud Shell environment or the Azure CLI to create a subdomain, assign roles, and obtain a bearer token to call the Azure Cognitive Services. If you get stuck, links are provided in each section with all available options for each command in Azure Cloud Shell/Azure CLI.

### Create a resource with a custom subdomain

The first step is to create a custom subdomain. If you want to use an existing Cognitive Services resource which does not have custom subdomain name, follow the instructions in [Cognitive Services Custom Subdomains](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-custom-subdomains#how-does-this-impact-existing-resources) to enable custom subdomain for your resource.

1. Start by opening the Azure Cloud Shell. Then [select a subscription](https://docs.microsoft.com/powershell/module/az.accounts/set-azcontext?view=azps-3.3.0):

   ```powershell-interactive
   Set-AzContext -SubscriptionName <SubscriptionName>
   ```

2. Next, [create a Cognitive Services resource](https://docs.microsoft.com/powershell/module/az.cognitiveservices/new-azcognitiveservicesaccount?view=azps-1.8.0) with a custom subdomain. The subdomain name needs to be globally unique and cannot include special characters, such as: ".", "!", ",".

   ```powershell-interactive
   $account = New-AzCognitiveServicesAccount -ResourceGroupName <RESOURCE_GROUP_NAME> -name <ACCOUNT_NAME> -Type <ACCOUNT_TYPE> -SkuName <SUBSCRIPTION_TYPE> -Location <REGION> -CustomSubdomainName <UNIQUE_SUBDOMAIN>
   ```

3. If successful, the **Endpoint** should show the subdomain name unique to your resource.


### Assign a role to a service principal

Now that you have a custom subdomain associated with your resource, you're going to need to assign a role to a service principal.

> [!NOTE]
> Keep in mind that AAD role assignments may take up to five minutes to propagate.

1. First, let's register an [AAD application](https://docs.microsoft.com/powershell/module/Az.Resources/New-AzADApplication?view=azps-1.8.0).

   ```powershell-interactive
   $SecureStringPassword = ConvertTo-SecureString -String <YOUR_PASSWORD> -AsPlainText -Force

   $app = New-AzADApplication -DisplayName <APP_DISPLAY_NAME> -IdentifierUris <APP_URIS> -Password $SecureStringPassword
   ```

   You're going to need the **ApplicationId** in the next step.

2. Next, you need to [create a service principal](https://docs.microsoft.com/powershell/module/az.resources/new-azadserviceprincipal?view=azps-1.8.0) for the AAD application.

   ```powershell-interactive
   New-AzADServicePrincipal -ApplicationId <APPLICATION_ID>
   ```

   >[!NOTE]
   > If you register an application in the Azure portal, this step is completed for you.

3. The last step is to [assign the "Cognitive Services User" role](https://docs.microsoft.com/powershell/module/az.Resources/New-azRoleAssignment?view=azps-1.8.0) to the service principal (scoped to the resource). By assigning a role, you're granting service principal access to this resource. You can grant the same service principal access to multiple resources in your subscription.
   >[!NOTE]
   > The ObjectId of the service principal is used, not the ObjectId for the application.
   > The ACCOUNT_ID will be the Azure resource Id of the Cognitive Services account you created. You can find Azure resource Id from "properties" of the resource in Azure portal.

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
   ```powershell-interactive
   $authContext = New-Object "Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext" -ArgumentList "https://login.windows.net/<TENANT_ID>"
   $secureSecretObject = New-Object "Microsoft.IdentityModel.Clients.ActiveDirectory.SecureClientSecret" -ArgumentList $SecureStringPassword   
   $clientCredential = New-Object "Microsoft.IdentityModel.Clients.ActiveDirectory.ClientCredential" -ArgumentList $app.ApplicationId, $secureSecretObject
   $token=$authContext.AcquireTokenAsync("https://cognitiveservices.azure.com/", $clientCredential).Result
   $token
   ```
3. Call the Computer Vision API:
   ```powershell-interactive
   $url = $account.Endpoint+"vision/v1.0/models"
   $result = Invoke-RestMethod -Uri $url  -Method Get -Headers @{"Authorization"=$token.CreateAuthorizationHeader()} -Verbose
   $result | ConvertTo-Json
   ```

Alternatively, the service principal can be authenticated with a certificate. Besides service principal, user principal is also supported by having permissions delegated through another AAD application. In this case, instead of passwords or certificates, users would be prompted for two-factor authentication when acquiring token.

## Authorize access to managed identities
 
Cognitive Services support Azure Active Directory (Azure AD) authentication with [managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview). Managed identities for Azure resources can authorize access to Cognitive Services resources using Azure AD credentials from applications running in Azure virtual machines (VMs), function apps, virtual machine scale sets, and other services. By using managed identities for Azure resources together with Azure AD authentication, you can avoid storing credentials with your applications that run in the cloud.  

### Enable managed identities on a VM

Before you can use managed identities for Azure resources to authorize access to Cognitive Services resources from your VM, you must enable managed identities for Azure resources on the VM. To learn how to enable managed identities for Azure Resources, see:

- [Azure portal](https://docs.microsoft.com/azure/active-directory/managed-service-identity/qs-configure-portal-windows-vm)
- [Azure PowerShell](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm)
- [Azure CLI](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm)
- [Azure Resource Manager template](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm)
- [Azure Resource Manager client libraries](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-sdk-windows-vm)

For more information about managed identities, see [Managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).
