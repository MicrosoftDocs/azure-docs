---
author: erhopf
ms.author: erhopf
ms.service: cognitive-services
ms.custom: devx-track-azurepowershell
ms.topic: include
ms.date: 08/24/2022
---

## Authenticate with Azure Active Directory

> [!IMPORTANT]
> Azure AD authentication always needs to be used together with custom subdomain name of your Azure resource. [Regional endpoints](../articles/cognitive-services/cognitive-services-custom-subdomains.md#is-there-a-list-of-regional-endpoints) do not support Azure AD authentication.

In the previous sections, we showed you how to authenticate against Azure AI services using a single-service or multi-service subscription key. While these keys provide a quick and easy path to start development, they fall short in more complex scenarios that require Azure [role-based access control (Azure RBAC)](../articles/role-based-access-control/overview.md). Let's take a look at what's required to authenticate using Azure Active Directory (Azure AD).

In the following sections, you'll use either the Azure Cloud Shell environment or the Azure CLI to create a subdomain, assign roles, and obtain a bearer token to call the Azure AI services. If you get stuck, links are provided in each section with all available options for each command in Azure Cloud Shell/Azure CLI.

### Create a resource with a custom subdomain

The first step is to create a custom subdomain. If you want to use an existing Azure AI services resource which does not have custom subdomain name, follow the instructions in [Azure AI services custom subdomains](../articles/cognitive-services/cognitive-services-custom-subdomains.md#how-does-this-impact-existing-resources) to enable custom subdomain for your resource.

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

1. First, let's register an [Azure AD application](/powershell/module/Az.Resources/New-AzADApplication).

   ```powershell-interactive
   $SecureStringPassword = ConvertTo-SecureString -String <YOUR_PASSWORD> -AsPlainText -Force

   $app = New-AzureADApplication -DisplayName <APP_DISPLAY_NAME> -IdentifierUris <APP_URIS> -PasswordCredentials $SecureStringPassword
   ```

   You're going to need the **ApplicationId** in the next step.

2. Next, you need to [create a service principal](/powershell/module/az.resources/new-azadserviceprincipal) for the Azure AD application.

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

Alternatively, the service principal can be authenticated with a certificate. Besides service principal, user principal is also supported by having permissions delegated through another Azure AD application. In this case, instead of passwords or certificates, users would be prompted for two-factor authentication when acquiring token.

## Authorize access to managed identities
 
Azure AI services support Azure Active Directory (Azure AD) authentication with [managed identities for Azure resources](../articles/active-directory/managed-identities-azure-resources/overview.md). Managed identities for Azure resources can authorize access to Azure AI services resources using Azure AD credentials from applications running in Azure virtual machines (VMs), function apps, virtual machine scale sets, and other services. By using managed identities for Azure resources together with Azure AD authentication, you can avoid storing credentials with your applications that run in the cloud.  

### Enable managed identities on a VM

Before you can use managed identities for Azure resources to authorize access to Azure AI services resources from your VM, you must enable managed identities for Azure resources on the VM. To learn how to enable managed identities for Azure Resources, see:

- [Azure portal](../articles/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)
- [Azure PowerShell](../articles/active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md)
- [Azure CLI](../articles/active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md)
- [Azure Resource Manager template](../articles/active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md)
- [Azure Resource Manager client libraries](../articles/active-directory/managed-identities-azure-resources/qs-configure-sdk-windows-vm.md)

For more information about managed identities, see [Managed identities for Azure resources](../articles/active-directory/managed-identities-azure-resources/overview.md).
