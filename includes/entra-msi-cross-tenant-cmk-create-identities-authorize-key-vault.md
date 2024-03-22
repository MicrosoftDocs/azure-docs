---
author: karavar
ms.author: vakarand
ms.date: 10/28/2022
ms.service: entra-id
ms.subservice: managed-identities
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.topic: include
title: Cross-tenant customer-managed key (CMK) configuration - Azure
description: include file for cross-tenant customer-managed key (CMK) configuration

---

## Configure cross-tenant customer-managed keys

This section describes how to configure a cross-tenant customer-managed key (CMK) and encrypt customer data. You learn how to encrypt customer data in a resource in *Tenant1* using a CMK stored in a key vault in *Tenant2*. You can use the Azure portal, Azure PowerShell, or Azure CLI.

# [Portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com) and follow these steps.

### The service provider configures identities

The following steps are performed by the service provider in the service provider's tenant *Tenant1*.

#### The service provider creates a new multi-tenant app registration

You can either create a new multi-tenant Microsoft Entra application registration or start with an existing multi-tenant application registration. If starting with an existing application registration, note the application ID (client ID) of the application.

To create a new registration:

1. Search for **Microsoft Entra ID** in the search box. Locate and select the **Microsoft Entra ID** extension.
1. Select **Manage > App registrations** from the left pane.
1. Select **+ New registration**.
1. Provide the name for the application registration and select *Account in any organizational directory (Any Microsoft Entra directory – Multitenant)*.
1. Select **Register**.
1. Note the **ApplicationId/ClientId** of the application.

    :::image type="content" source="media/msi-cross-tenant-cmk-create-identities-authorize-key-vault/register-application.png" alt-text="Screen shot showing how to create a new multi-tenant application registration." lightbox="media/msi-cross-tenant-cmk-create-identities-authorize-key-vault/register-application.png" border="true":::

#### The service provider creates a user-assigned managed identity

Create a user-assigned managed identity to be used as a federated identity credential.

1. Search for **Managed Identities** in the search box. Locate and select the **Managed Identities** extension.
1. Select **+ Create**.
1. Provide the resource group, region, and name for the managed identity.
1. Select **Review + create**.
1. On successful deployment, note the **Azure ResourceId** of the user-assigned managed identity, which is available under **Properties**. For example:

   `/subscriptions/tttttttt-0000-tttt-0000-tttt0000tttt/resourcegroups/XTCMKDemo/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ConsotoCMKDemoUA`

    :::image type="content" source="media/msi-cross-tenant-cmk-create-identities-authorize-key-vault/create-user-assigned-managed-identity.png" alt-text="Screen shot showing how to create a resource group and a user-assigned managed identity." lightbox="media/msi-cross-tenant-cmk-create-identities-authorize-key-vault/create-user-assigned-managed-identity.png" border="true":::

#### The service provider configures the user-assigned managed identity as a federated credential on the application

Configure a user-assigned managed identity as a federated identity credential on the application, so that it can impersonate the identity of the application.

1. Navigate to **Microsoft Entra ID > App registrations > your application**.
2. Select **Certificates & secrets**.
3. Select **Federated credentials**.

   :::image type="content" source="media/msi-cross-tenant-cmk-create-identities-authorize-key-vault/certificates-secrets.png" alt-text="Screen shot showing how to navigate to Certificate and secrets." lightbox="media/msi-cross-tenant-cmk-create-identities-authorize-key-vault/certificates-secrets.png" border="true":::

4. Select **+ Add credential**.
5. Under **Federated credential scenario**, select **Customer Managed Keys**.
6. Click **Select a managed identity**. From the pane, select the subscription. Under **Managed identity**, select **User-assigned managed identity**. In the **Select** box, search for the managed identity you created earlier, then click **Select** at the bottom of the pane.

   :::image type="content" source="media/msi-cross-tenant-cmk-create-identities-authorize-key-vault/select-managed-identity.png" alt-text="Screen shot showing how to select a managed identity." lightbox="media/msi-cross-tenant-cmk-create-identities-authorize-key-vault/select-managed-identity.png" border="true":::

7. Under **Credential details**, provide a name and optional description for the credential and select **Add**.

   :::image type="content" source="media/msi-cross-tenant-cmk-create-identities-authorize-key-vault/add-credential.png" alt-text="Screen shot showing how to add a credential." lightbox="media/msi-cross-tenant-cmk-create-identities-authorize-key-vault/add-credential.png" border="true":::

# [PowerShell](#tab/azure-powershell)

To use Azure PowerShell to configure the ISV's tenant, install the latest [Az](https://www.powershellgallery.com/packages/Az) module. For more information about installing PowerShell, see [Install Azure PowerShell on Windows with PowerShellGet](/powershell/azure/install-azure-powershell).

[!INCLUDE [azure-powershell-requirements-no-header.md](azure-powershell-requirements-no-header.md)]

### The service provider configures identities

The following steps are performed by the service provider (ISV) in the service provider's tenant, *Tenant1*.

#### The service provider signs into Azure

In Azure PowerShell, sign in to the ISV's tenant and set the active subscription to the ISV's subscription.

```azurepowershell
$isvTenantId="<isv-tenant-id>"
$isvSubscriptionId="<isv-subscription-id>"

# Sign in to Azure in the ISV's tenant.
Connect-AzAccount -Tenant $isvTenantId
# Set the context to the ISV's subscription.
Set-AzContext -Subscription $isvSubscriptionId
```

#### The service provider creates a new multi-tenant app registration

Pick a name for your multi-tenant registered application in *Tenant1*, and create the multi-tenant application in the Azure portal.

The name that you provide for the multi-tenant application is used by the customer to identify the application in *Tenant2*. Note the app's object ID and application ID. You'll need these values in subsequent steps.

```azurepowershell
$multiTenantAppName="<multi-tenant-app>"
$multiTenantApp = New-AzADApplication -DisplayName $multiTenantAppName `
    -SignInAudience AzureADMultipleOrgs

# Object ID for the new multi-tenant app
$objectId = $multiTenantApp.Id
# Application (client) ID for the multi-tenant app
$multiTenantAppObjectId = $multiTenantApp.AppId
```

#### The service provider creates a user-assigned managed identity

Sign in to the ISV's tenant, and then create a user-assigned managed identity to be used as a federated identity credential. To create a new user-assigned managed identity, you must be assigned a role that includes the **Microsoft.ManagedIdentity/userAssignedIdentities/write** action.

```azurepowershell
$isvRgName="<isv-resource-group>"
$isvLocation="<location>"
$userIdentityName="<user-assigned-managed-identity>"

# Create a new resource group in the ISV's subscription.
New-AzResourceGroup -Location $isvLocation -ResourceGroupName $isvRgName

# Create the new user-assigned managed identity.
$userIdentity = New-AzUserAssignedIdentity -Name $userIdentityName `
    -ResourceGroupName $isvRgName `
    -Location $isvLocation `
    -SubscriptionId $isvSubscriptionId
```

#### The service provider configures the user-assigned managed identity as a federated credential on the application

Configure a user-assigned managed identity as a federated identity credential on the application, so that it can impersonate the identity of the application.

To configure the federated identity credential from PowerShell, first install version 6.3.0 or later of the [Az.Resources](https://www.powershellgallery.com/packages/Az.Resources) module.

```azurepowershell
New-AzADAppFederatedCredential -ApplicationObjectId $multiTenantApp.Id `
    -Name "MyFederatedIdentityCredential" `
    -Audience "api://AzureADTokenExchange" `
    -Issuer "https://login.microsoftonline.com/<tenant-id>/v2.0" `
    -Subject $userIdentity.PrincipalId `
    -Description "Federated Identity Credential for CMK"
```

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

### The service provider configures identities

The following steps are performed by the service provider in the service provider's tenant *Tenant1*.

#### The service provider signs in to Azure

Sign in to Azure to use Azure CLI.

```azurecli
az login
```

#### The service provider creates a new multi-tenant app registration

Pick a name for your multi-tenant application in *Tenant1*, and create the multi-tenant application in the Azure portal.

The name that you provide for the multi-tenant application is used by the customer to identify the application in *Tenant2*. Copy the application ID (or client ID) of the app, the object ID of the app, and also the tenant ID for the app. You'll need these values in the following steps.

```azurecli
multiTenantAppName="<multi-tenant-app>"
multiTenantAppObjectId=$(az ad app create --display-name $multiTenantAppName \
    --sign-in-audience AzureADMultipleOrgs \
    --query id \
    --output tsv)

multiTenantAppId=$(az ad app show --id $multiTenantAppObjectId --query appId --output tsv)
```

#### The service provider creates a user-assigned managed identity

Sign in to the ISV's tenant, and then create a user-assigned managed identity to be used as a federated identity credential. To create a new user-assigned managed identity, you must be assigned a role that includes the **Microsoft.ManagedIdentity/userAssignedIdentities/write** action.

```azurecli
isvSubscriptionId="<isv-subscription-id>"
isvRgName="<isv-resource-group>"
isvLocation="<location>"
userIdentityName="<user-assigned-managed-identity>"

az group create --location $isvLocation \
    --resource-group $isvRgName \
    --subscription $isvSubscriptionId

principalId=$(az identity create --name $userIdentityName \
    --resource-group $isvRgName \
    --location $isvLocation \
    --subscription $isvSubscriptionId \
    --query principalId \
    --out tsv)
```

#### The service provider configures the user-assigned managed identity as a federated credential on the application

Run the [az ad app federated-credential create](/cli/azure/ad/app/federated-credential#az-ad-app-federated-credential-create) method to configure a federated identity credential on an app and create a trust relationship with an external identity provider.

Use `api://AzureADTokenExchange` as the `audience` value in the federated identity credential. See the [API reference](https://aka.ms/fedcredentialapi) for more details.

```azurecli
# Create a file named "credential.json" with the following content.
# Replace placeholders in angle brackets with your own values.
{
    "name": "MyFederatedIdentityCredential",
    "issuer": "https://login.microsoftonline.com/<tenantID>/v2.0",
    "subject": "<user-assigned-identity-principal-id>",
    "description": "Federated Identity Credential for CMK",
    "audiences": [
        "api://AzureADTokenExchange"
    ]
}

az ad app federated-credential create --id $multiTenantAppObjectId --parameters credential.json
```

---

#### The service provider shares the application ID with the customer

Find the application ID (client ID) of the multi-tenant application and share it with the customer.

### The customer grants the service provider's app access to the key in the key vault

The following steps are performed by the customer in the customer's tenant *Tenant2*. The customer can use the Azure portal, Azure PowerShell, or Azure CLI.

The user executing the steps must be an administrator with a privileged role such as [Application Administrator](../articles/active-directory/roles/permissions-reference.md#application-administrator), [Cloud Application Administrator](../articles/active-directory/roles/permissions-reference.md#cloud-application-administrator), or [Global Administrator](../articles/active-directory/roles/permissions-reference.md#global-administrator).

# [Portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com) and follow these steps.

#### The customer installs the service provider application in the customer tenant

To install the service provider's registered application in the customer's tenant, you create a service principal with the application ID from the registered app. You can create the service principal in either of the following ways:

- Use [Microsoft Graph](/graph/api/serviceprincipal-post-serviceprincipals), [Microsoft Graph PowerShell](/powershell/module/microsoft.graph.applications/new-mgserviceprincipal?view=graph-powershell-beta&preserve-view=true), [Azure PowerShell](/powershell/module/az.resources/new-azadserviceprincipal), or [Azure CLI](/cli/azure/ad/sp#az-ad-sp-create) to manually create the service principal.
- Construct an [admin-consent URL](../articles/active-directory/manage-apps/grant-admin-consent.md#construct-the-url-for-granting-tenant-wide-admin-consent) and grant tenant-wide consent to create the service principal. You'll need to provide them with your AppId.

#### The customer creates a key vault

To create the key vault, the user's account must be assigned the **Key Vault Contributor** role or another role that permits creation of a key vault.

1. From the Azure portal menu, or from the Home page, select **+ Create a resource**. In the Search box, enter **Key vaults**. From the results list, select **Key vaults**. On the **Key vaults** page, select **Create**.
1. On the **Basics** tab, choose a subscription. Under **Resource group**, select **Create new** and enter a resource group name.
1. Enter a unique name for the key vault.
1. Select a region and pricing tier.
1. Enable purge protection for the new key vault.
1. On the **Access policy** tab, select **Azure role-based access control** for **Permission model**.
1. Select **Review + create** and then **Create**.

    :::image type="content" source="media/msi-cross-tenant-cmk-create-identities-authorize-key-vault/create-key-vault.png" alt-text="Screen shot showing how to create a key vault." lightbox="media/msi-cross-tenant-cmk-create-identities-authorize-key-vault/create-key-vault.png" border="true":::

Take note of the key vault name and URI Applications that access your key vault must use this URI.

For more information, see [Quickstart - Create an Azure Key Vault with the Azure portal](../articles/key-vault/general/quick-create-portal.md).

#### The customer assigns Key Vault Crypto Officer role to a user account

This step ensures that you can create encryption keys.

1. Navigate to your key vault and select **Access Control (IAM)** from the left pane.
1. Under **Grant access to this resource**, select **Add role assignment**.
1. Search for and select **Key Vault Crypto Officer**.
1. Under **Members**, select **User, group, or service principal**.
1. Select **Members** and search for your user account.
1. Select **Review + Assign**.

#### The customer creates an encryption key

To create the encryption key, the user's account must be assigned the **Key Vault Crypto Officer** role or another role that permits creation of a key.

1. On the Key Vault properties page, select **Keys**.
1. Select **Generate/Import**.
1. On the **Create a key** screen, specify a name for the key. Leave the other values to their defaults.
1. Select **Create**.
1. Copy the key URI.

#### The customer grants the service provider application access to the key vault

Assign the Azure RBAC role **Key Vault Crypto Service Encryption User** to the service provider's registered application so that it can access the key vault.

1. Navigate to your key vault and select **Access Control (IAM)** from the left pane.
1. Under **Grant access to this resource**, select **Add role assignment**.
1. Search for and select **Key Vault Crypto Service Encryption User**.
1. Under **Members**, select **User, group, or service principal**.
1. Select **Members** and search for the application name of the application you installed from the service provider.
1. Select **Review + Assign**.

Now you can configure customer-managed keys with the key vault URI and key.

# [PowerShell](#tab/azure-powershell)

To use Azure PowerShell to configure the client's tenant, install the latest [Az](https://www.powershellgallery.com/packages/Az) module. For more information about installing PowerShell, see [Install Azure PowerShell on Windows with PowerShellGet](/powershell/azure/install-azure-powershell).

[!INCLUDE [azure-powershell-requirements-no-header.md](azure-powershell-requirements-no-header.md)]

#### The customer signs into Azure

In Azure PowerShell, sign in to the customer's tenant and set the active subscription to the customer's subscription.

```azurepowershell
$customerTenantId="<customer-tenant-id>"
$customerSubscriptionId="<customer-subscription-id>"

# Sign in to Azure in the customer's tenant.
Connect-AzAccount -Tenant $customerTenantId
# Set the context to the customer's subscription.
Set-AzContext -Subscription $customerSubscriptionId
```

#### The customer installs the service provider application in the customer tenant

Once you receive the application ID of the service provider's multi-tenant application, install the application in your tenant, *Tenant2*, by creating a service principal.

Execute the following commands in the tenant where you plan to create the key vault.

```azurepowershell
$customerRgName="<customer-resource-group>"
$customerLocation="<location>"
$multiTenantAppId="<multi-tenant-app-id>" # appId value from Tenant1 

# Create a resource group in the customer's subscription.
New-AzResourceGroup -Location $customerLocation -ResourceGroupName $customerRgName

# Create the service principal with the registered app's application ID (client ID).
$servicePrincipal = New-AzADServicePrincipal -ApplicationId $multiTenantAppId
```

#### The customer creates a key vault

To create the key vault, the customer's account must be assigned the **Key Vault Contributor** role or another role that permits creation of a key vault.

```azurepowershell
$kvName="<key-vault>"

$kv = New-AzKeyVault -Location $customerLocation `
    -Name $kvName `
    -ResourceGroupName $customerRgName `
    -SubscriptionId $customerSubscriptionId `
    -EnablePurgeProtection `
    -EnableRbacAuthorization
```

#### The customer assigns Key Vault Crypto Officer role to a user account

Assign the **Key Vault Crypto Officer** role to a user account. This step ensures that the user can create the key vault and encryption keys. The example below assigns the role to the current signed-in user.  

```azurepowershell
$currentUserObjectId = (Get-AzADUser -SignedIn).Id

New-AzRoleAssignment -RoleDefinitionName "Key Vault Crypto Officer" `
    -Scope $kv.ResourceId `
    -ObjectId $currentUserObjectId
```

#### The customer creates an encryption key

To create the encryption key, the user's account must be assigned the **Key Vault Crypto Officer** role or another role that permits creation of a key.

```azurepowershell
$keyName="<key-name>"

Add-AzKeyVaultKey -Name $keyName `
    -VaultName $kvName `
    -Destination software
```

#### The customer grants the service provider application access to the key vault

Assign the Azure RBAC role **Key Vault Crypto Service Encryption User** to the service provider's registered application, via the service principal that you created earlier, so that it can access the key vault.

```azurepowershell
New-AzRoleAssignment -RoleDefinitionName "Key Vault Crypto Service Encryption User" `
    -Scope $kv.ResourceId `
    -ObjectId $servicePrincipal.Id
```

Now you can configure customer-managed keys with the key vault URI and key.

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

#### The customer signs in to Azure

Sign in to Azure to use Azure CLI.

```azurecli
az login
```

#### The customer installs the service provider application in the customer tenant

Once you receive the application ID of the service provider's multi-tenant application, install the application in your tenant *Tenant2* using the following command. Installing the application creates a service principal in your tenant.

Execute the following commands in the tenant where you plan to create the key vault.

```azurecli
# Create the service principal with the registered app's application ID (client ID)
multiTenantAppId="<multi-tenant-app-id>"
az ad sp create --id $multiTenantAppId --query id --out tsv
```

#### The customer creates a key vault

To create the key vault, the customer's account must be assigned the **Key Vault Contributor** role or another role that permits creation of a key vault.

```azurecli
customerSubscriptionId="<customer-subscription-id>"
customerRgName="<customer-resource-group>"
customerLocation="<location>"
kvName="<key-vault>"

az group create --location $customerLocation \
    --name $customerRgName

az keyvault create --name $kvName \
    --location $customerLocation \
    --resource-group $customerRgName \
    --subscription $customerSubscriptionId \
    --enable-purge-protection true \
    --enable-rbac-authorization true
```

#### The customer assigns Key Vault Crypto Officer role to a user account

This step ensures that you can create the key vault and encryption keys.

```azurecli
currentUserObjectId=$(az ad signed-in-user show --query id --output tsv)

kvResourceId=$(az keyvault show --resource-group $customerRgName \
    --name $kvName \
    --query id \
    --output tsv)

az role assignment create --role "Key Vault Crypto Officer" \
    --scope $kvResourceId \
    --assignee-object-id $currentUserObjectId
```

#### The customer creates an encryption key

To create the encryption key, the user's account must be assigned the **Key Vault Crypto Officer** role or another role that permits creation of a key.

```azurecli
keyName="<key-name>"
az keyvault key create --name $keyName --vault-name $kvName
```

#### The customer grants the service provider application access to the key vault

Assign the Azure RBAC role **Key Vault Crypto Service Encryption User** to the service provider's registered application, via the service principal that you created earlier, so that the registered application can access the key vault.

```azurecli
servicePrincipalId=$(az ad sp show --id $multiTenantAppId --query id --output tsv)

az role assignment create --role "Key Vault Crypto Service Encryption User" \
    --scope $kvResourceId \
    --assignee-object-id $servicePrincipalId
```

Now you can configure customer-managed keys with the key vault URI and key.

---
