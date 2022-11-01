---
author: karavar
ms.author: vakarand
ms.date: 09/01/2022
ms.service: active-directory
ms.subservice: managed-identity
ms.topic: include
title: Cross-tenant customer-managed key (CMK) configuration - Azure
description: include file for cross-tenant customer-managed key (CMK) configuration
services: active-directory
---

## Configure cross-tenant customer-managed keys

This section describes how to configure a cross-tenant customer-managed key (CMK) and encrypt customer data. You learn how to encrypt customer data in a resource in *Tenant1* using a CMK stored in a key vault in *Tenant2*. You can use the Azure portal, Azure PowerShell, or Azure CLI.

# [Portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com) and follow these steps.

### The service provider configures identities

The following steps are performed by the service provider in the service provider's tenant *Tenant1*.

#### The service provider creates a multi-tenant application registration

You can either create a new multi-tenant Azure AD application registration or start with an existing multi-tenant application registration. If starting with an existing application registration, note the application ID (client ID) of the application.

To create a new registration:

1. Search for **Azure Active Directory** in the search box. Locate and select the **Azure Active Directory** extension.
1. Select **Manage > App registrations** from the left pane.
1. Select **+ New registration**.
1. Provide the name for the application registration and select *Account in any organizational directory (Any Azure AD directory – Multitenant)*.
1. Select **Register**.
1. Note the **ApplicationId/ClientId** of the application.

    :::image type="content" source="media/active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault/register-application.png" alt-text="Screen shot showing how to create a new multi-tenant application registration." lightbox="media/active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault/register-application.png" border="true":::

#### The service provider creates a user-assigned managed identity

Create a user-assigned managed identity to be used as a federated identity credential.

1. Search for **Managed Identities** in the search box. Locate and select the **Managed Identities** extension.
1. Select **+ Create**.
1. Provide the resource group, region, and name for the managed identity.
1. Select **Review + create**.
1. On successful deployment, note the **Azure ResourceId** of the user-assigned managed identity, which is available under **Properties**. For example:

   `/subscriptions/tttttttt-0000-tttt-0000-tttt0000tttt/resourcegroups/XTCMKDemo/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ConsotoCMKDemoUA`

    :::image type="content" source="media/active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault/create-user-assigned-managed-identity.png" alt-text="Screen shot showing how to create a resource group and a user-assigned managed identity." lightbox="media/active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault/create-user-assigned-managed-identity.png" border="true":::

#### The service provider configures the user-assigned managed identity as a federated credential on the application

Configure a user-assigned managed identity as a federated identity credential on the application, so that it can impersonate the identity of the application.

1. Navigate to **Azure Active Directory > App registrations > your application**.
2. Select **Certificates & secrets**.
3. Select **Federated credentials**.

   :::image type="content" source="media/active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault/certificates-secrets.png" alt-text="Screen shot showing how to navigate to Certificate and secrets." lightbox="media/active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault/certificates-secrets.png" border="true":::

4. Select **+ Add credential**.
5. Under **Federated credential scenario**, select **Customer Managed Keys**.
6. Click **Select a managed identity**. From the pane, select the subscription. Under **Managed identity**, select **User-assigned managed identity**. In the **Select** box, search for the managed identity you created earlier, then click **Select** at the bottom of the pane.

   :::image type="content" source="media/active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault/select-managed-identity.png" alt-text="Screen shot showing how to select a managed identity." lightbox="media/active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault/select-managed-identity.png" border="true":::

7. Under **Credential details**, provide a name and optional description for the credential and select **Add**.

   :::image type="content" source="media/active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault/add-credential.png" alt-text="Screen shot showing how to add a credential." lightbox="media/active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault/add-credential.png" border="true":::

# [PowerShell](#tab/azure-powershell)

To use Azure PowerShell, install the latest Az module or the Az.Storage module. For more information about installing PowerShell, see [Install Azure PowerShell on Windows with PowerShellGet](/powershell/azure/install-Az-ps).

[!INCLUDE [azure-powershell-requirements-no-header.md](azure-powershell-requirements-no-header.md)]

### The service provider configures identities

The following steps are performed by the service provider in the service provider's tenant *Tenant1*.

#### Create a new multi-tenant application registration

Pick a name for your multi-tenant application in *Tenant1*. For example: “XTCMKDemoApp”. Note that this name is used by customers to identify the application in *Tenant2*. Note the application ID (or client ID) of the app, the object ID of the app, and also the tenant ID for the app. You'll need these values in the following steps.  

#### The service provider creates a user-assigned managed identity

Create a user-assigned managed identity to be used as a federated identity credential.

```azurepowershell
$subscriptionId="aaaaaaaa-0000-aaaa-0000-aaaa0000aaaa"
$tenantId="bbbbbbbb-0000-bbbb-0000-bbbb0000bbbb"
$appName="XTCMKDemoApp"
$uamiName="XTCMKDemoAppUA"
$rgName="XTCMKDemoAppRG"
$location="westcentralus"

Set-AzContext -Subscription $subscriptionId

New-AzResourceGroup -Location $location -ResourceGroupName $rgName

$uamiObject = New-AzUserAssignedIdentity -Name $uamiName -ResourceGroupName $rgName -Location $location -SubscriptionId $subscriptionId
```

#### The service provider configures the user-assigned managed identity as a federated credential on the application

```azurepowershell
Connect-MgGraph
$appObject = New-MgApplication -DisplayName $appName -SignInAudience AzureADMultipleOrgs

$issuer="https://login.microsoftonline.com/$tenantId/v2.0"
$subject=$uamiObject.PrincipalId
$audience="api://AzureADTokenExchange"
```

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](azure-cli-prepare-your-environment-no-header.md)]

### The service provider configures identities

The following steps are performed by the service provider in the service provider's tenant *Tenant1*.

#### Service provider signs in to Azure

Sign in to Azure to use Azure CLI.

```azurecli
az login
```

#### The service provider creates a new multi-tenant application registration

Pick a name for your multi-tenant application in *Tenant1*. For example: “XTCMKDemoApp”. Note that this name is used by customers to identify the application in *Tenant2*. Note the application ID (or client ID) of the app, the object ID of the app, and also the tenant ID for the app. You'll need these values in the following steps.  

```azurecli
export appObjectId=$(az ad app create --display-name $appName --sign-in-audience AzureADMultipleOrgs --query id --output tsv)
echo $appObjectId
export appId=$(az ad app show --id $appObjectId --query appId --output tsv)
echo "Multi-tenant Azure AD Application has appId = $appId and ObjectId = $appObjectId"
```

#### The service provider creates a user-assigned managed identity

Create a resource group using your Azure subscription. Also create a user-assigned managed identity (to be used as a federated identity credential). Get the object ID of the user-managed identity, which you'll need in the following steps. To create a managed identity, you must have a [Managed identity contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) role.

```azurecli
export subscriptionId="aaaaaaaa-0000-aaaa-0000-aaaa0000aaaa"
export tenantId="bbbbbbbb-0000-bbbb-0000-bbbb0000bbbb"
export appName="XTCMKDemoApp"

export uamiName="XTCMKDemoAppUA"
export rgName="XTCMKDemoAppRG"
export location="westcentralus"

export appObjectId=$(az ad app create --display-name $appName --sign-in-audience AzureADMultipleOrgs --query id --output tsv)

export appId=$(az ad app show --id $appObjectId --query appId --output tsv)

az group create --location $location --resource-group $rgName --subscription $subscriptionId
echo "Created a new resource group with name = $rgName, location = $location in subscriptionid = $subscriptionId"

export uamiObjectId=$(az identity create --name $uamiName --resource-group $rgName --location $location --subscription $subscriptionId --query principalId --out tsv)
```

#### The service provider configures the user-assigned managed identity as a federated credential on the application

Run the [az ad app federated-credential create](/cli/azure/ad/app/federated-credential#az-ad-app-federated-credential-create) method to configure a federated identity credential on an app and create a trust relationship with an external identity provider.

Use `api://AzureADTokenExchange` as the `audience` value in the federated identity credential. See the [API reference](https://aka.ms/fedcredentialapi) for more details.

```azurecli
az ad app federated-credential create --id <appObjectId> --parameters credential.json
("credential.json" contains the following content)
{
    "name": "test01",
    "issuer": "https://login.microsoftonline.com/<tenantID>/v2.0",
    "subject": "<uamiObjectId>",
    "description": "federated identity credential for CMK",
    "audiences": [
        "api://AzureADTokenExchange"
    ]
}
```

---

#### The service provider shares the application ID with the customer

Find the application ID (client ID) of the multi-tenant application and share it with the customer(s). In this example, it is "appId".

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

    :::image type="content" source="media/active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault/create-key-vault.png" alt-text="Screen shot showing how to create a key vault." lightbox="media/active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault/create-key-vault.png" border="true":::

Take note of the **Vault name** and **Vault URI**. Applications that access your key vault must use this URI.

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
1. On the **Create a key** screen choose the following values. Leave the other values to their defaults.
   - Options: Generate
   - Name: mycmkkey
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

To use Azure PowerShell, install the latest Az module or the Az.Storage module. For more information about installing PowerShell, see [Install Azure PowerShell on Windows with PowerShellGet](/powershell/azure/install-Az-ps).

[!INCLUDE [azure-powershell-requirements-no-header.md](azure-powershell-requirements-no-header.md)]

#### The customer installs the service provider application in the customer tenant

Once you receive the application ID of the service provider's multi-tenant application, install the application in your tenant *Tenant2*. Installing the application creates a service principal in your tenant.

Execute the following commands in the tenant where you plan to create the key vault.

```azurepowershell
$rgName="MyCMKKeys"
$subscriptionId="cccccc-0000-ccc-000-cccc0000cccc"
$vaultName="mykeyvaultname"
$location="westcentralus"
$currentUserObjectId="enter-your-objectId"

Set-AzContext -Subscription $subscriptionId
New-AzResourceGroup -Location $location -ResourceGroupName $rgName

# Create the service principal with the registered app's application ID (client ID)
$serviceprincipalObject = New-AzADServicePrincipal -ApplicationId
# $serviceprincipalObject = Get-AzADServicePrincipal -ApplicationId $addObject.Id
```

#### The customer creates a key vault

To create the key vault, the customer's account must be assigned the **Key Vault Contributor** role or another role that permits creation of a key vault.

```azurepowershell
New-AzKeyVault -Location $location -Name $vaultName -ResourceGroupName $rgName -SubscriptionId $subscriptionId -EnablePurgeProtection -EnableRbacAuthorization
```

#### The customer assigns Key Vault Crypto Officer role to a user account

This step ensures that you can create the key vault and encryption keys.

```azurepowershell
$currentUserObjectId="object-id-of-the-user"
New-AzRoleAssignment -RoleDefinitionName "Key Vault Crypto Officer" -Scope /subscriptions/$subscriptionId/resourceGroups/$rgName/providers/Microsoft.KeyVault/vaults/$vaultName -ObjectId $currentUserObjectId
```

#### The customer creates an encryption key

To create the encryption key, the user's account must be assigned the **Key Vault Crypto Officer** role or another role that permits creation of a key.

```azurepowershell
Add-AzKeyVaultKey -Name mastercmkkey -VaultName $vaultName -Destination software
```

#### The customer grants the service provider application access to the key vault

Assign the Azure RBAC role **Key Vault Crypto Service Encryption User** to the service provider's registered application so that it can access the key vault.

```azurepowershell
New-AzRoleAssignment -RoleDefinitionName "Key Vault Crypto Service Encryption User" -Scope /subscriptions/$subscriptionId/resourceGroups/$rgName/providers/Microsoft.KeyVault/vaults/$vaultName -ObjectId $serviceprincipalObject.Id
```

Now you can configure customer-managed keys with the key vault URI and key.

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](azure-cli-prepare-your-environment-no-header.md)]

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
export appId='<replace-the-multi-tenant-applicationID>' #appId from Phase 1.
export appObjectId=$(az ad sp create --id $appId --query id --out tsv)
```

#### The customer creates a key vault

To create the key vault, the customer's account must be assigned the **Key Vault Contributor** role or another role that permits creation of a key vault.

```azurecli
export vaultName="mykeyvaultname"
az keyvault create --location $location --name $vaultName --resource-group $rgName --subscription $subscriptionId --enable-purge-protection true --enable-rbac-authorization true --query name --out tsv
```

#### The customer assigns Key Vault Crypto Officer role to a user account

This step ensures that you can create the key vault and encryption keys.

```azurecli
export rgName="MyCMKKeys"
subscriptionId="<replace-your-subscriptionId>"
location="westcentralus"

az group create --location $location --name $rgName
export currentUserObjectId=$(az ad signed-in-user show --query id --out tsv)

az role assignment create --role "Key Vault Crypto Officer" --scope /subscriptions/$subscriptionId/resourceGroups/$rgName/providers/Microsoft.KeyVault/vaults/$vaultName --assignee-object-id $currentUserObjectId
```

#### The customer creates an encryption key

To create the encryption key, the user's account must be assigned the **Key Vault Crypto Officer** role or another role that permits creation of a key.

```azurecli
az keyvault key create --name mastercmkkey --vault-name $vaultName
```

#### The customer grants the service provider application access to the key vault

Assign the Azure RBAC role **Key Vault Crypto Service Encryption User** to the service provider's registered application so that it can access the key vault.

```azurecli
az role assignment create --role "Key Vault Crypto Service Encryption User" --scope /subscriptions/$subscriptionId/resourceGroups/$rgName/providers/Microsoft.KeyVault/vaults/$vaultName --assignee-object-id $appObjectId
```

Now you can configure customer-managed keys with the key vault URI and key.

---
