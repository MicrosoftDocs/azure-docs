---
author: karavar
ms.author: vakarand
ms.date: 09/01/2022
ms.service: active-directory
ms.subservice: managed-identity
ms.custom: has-azure-ad-ps-ref
ms.topic: include
title: Cross tenant customer-managed key (CMK) overview - Azure
description: include file for cross-tenant customer-managed key (CMK) overview
services: active-directory
---

## About cross-tenant customer-managed keys

Many service providers building Software as a Service (SaaS) offerings on Azure want to offer their customers the option to manage their own encryption keys. Customer-managed keys allow a service provider to encrypt the customer's data using an encryption key that is managed by the service provider's customer and that is not accessible to the service provider. In Azure, the service provider's customer can use Azure Key Vault to manage their encryption keys in their own Azure AD tenant and subscription.

Azure platform services and resources that are owned by the service provider and that reside in the service provider's tenant require access to the key from the customer's tenant to perform the encryption/decryption operations.

The image below shows a data encryption at rest with federated identity in a cross-tenant CMK workflow spanning a service provider and its customer.

:::image type="content" source="media/msi-cross-tenant-cmk-overview/cross-tenant-cmk.png" alt-text="Screenshot showing a cross-tenant CMK with a federated identity." lightbox="media/msi-cross-tenant-cmk-overview/cross-tenant-cmk.png" border="true":::

In the example above, there are two Azure AD tenants: an independent service provider's tenant (*Tenant 1*), and a customer's tenant (*Tenant 2*). *Tenant 1* hosts Azure platform services and *Tenant 2* hosts the customer's key vault.

A multi-tenant application registration is created by the service provider in *Tenant 1*. A [federated identity credential](../articles/active-directory/develop/workload-identity-federation-create-trust.md) is created on this application using a user-assigned managed identity. Then, the name and application ID of the app is shared with the customer.

A user with the appropriate permissions installs the service provider's application in the customer tenant, *Tenant 2*. A user then grants the service principal associated with the installed application access to the customer's key vault. The customer also stores the encryption key, or customer-managed key, in the key vault. The customer shares the key location (the URL of the key) with the service provider.

The service provider now has:

- An application ID for a multi-tenant application installed in the customer's tenant, which has been granted access to the customer-managed key.
- A managed identity configured as the credential on the multi-tenant application.
- The location of the key in the customer's key vault.

With these three parameters, the service provider provisions Azure resources in *Tenant 1* that can be encrypted with the customer-managed key in *Tenant 2*.

Let's divide the above end-to-end solution into three phases:

1. The service provider configures identities.
2. The customer grants the service provider's multi-tenant app access to an encryption key in Azure Key Vault.
3. The service provider encrypts data in an Azure resource using the CMK.

Operations in Phase 1 would be a one-time setup for most service provider applications. Operations in Phases 2 and 3 would repeat for each customer.

### Phase 1 - The service provider configures an Azure AD application

| Step | Description | Minimum role in Azure RBAC | Minimum role in Azure AD RBAC |
| -- | ----------------------------------- | -------------- | --------------|
| 1. | Create a new multi-tenant Azure AD application registration or start with an existing application registration. Note the application ID (client ID) of the application registration using [Azure portal](../articles/active-directory/develop/quickstart-register-app.md), [Microsoft Graph API](/graph/api/application-post-applications), [Azure PowerShell](/powershell/module/azuread/new-azureadapplication), or [Azure CLI](/cli/azure/ad/app#az_ad_app_create)| None | [Application Developer](../articles/active-directory/roles/permissions-reference.md#application-developer) |
| 2. | Create a user-assigned managed identity (to be used as a Federated Identity Credential). <br> [Azure portal](../articles/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp&preserve-view=true) / [Azure CLI](../articles/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azcli&preserve-view=true) / [Azure PowerShell](../articles/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-powershell&preserve-view=true)/ [Azure Resource Manager Templates](../articles/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-arm&preserve-view=true) | [Manage identity contributor](../articles/role-based-access-control/built-in-roles.md?preserve-view=true#managed-identity-contributor) | None |
| 3. | Configure user-assigned managed identity as a *federated identity credential* on the application, so that it can impersonate the identity of the application. <br> [Graph API reference](https://aka.ms/fedcredentialapi)/ [Azure portal](../articles/active-directory/develop/workload-identity-federation-create-trust.md?pivots=identity-wif-apps-methods-azp)/ [Azure CLI](../articles/active-directory/develop/workload-identity-federation-create-trust.md?pivots=identity-wif-apps-methods-azcli)/ [Azure PowerShell](../articles/active-directory/develop/workload-identity-federation-create-trust.md?pivots=identity-wif-apps-methods-powershell) | None | Owner of the application |
| 4. | Share the application name and application ID with the customer, so that they can install and authorize the application. | None | None|

#### Considerations for service providers

- Azure Resource Manager (ARM) templates are not recommended for creating Azure AD applications.
- The same multi-tenant application can be used to access keys in any number of tenants, like *Tenant 2*, *Tenant3*, *Tenant4*, and so on. In each tenant, an independent instance of the application is created that has the same application ID but a different object ID. Each instance of this application is thus authorized independently. Consider how the application object used for this feature is used to partition your application across all customers. 
  - Application can have a maximum of 20 federated identity credentials, which requires a service provider to share federated identities among its customers. For more information about federated identities design considerations and restrictions, see [Configure an app to trust an external identity provider](../articles/active-directory/develop/workload-identity-federation-create-trust.md?pivots=identity-wif-apps-methods-azp#important-considerations-and-restrictions)
- In rare scenarios, a service provider may use a single Application object per its customer, but that will require significant maintenance costs to manage applications at scale across all customers. 
- In the service provider tenant, it is not possible to automate the [Publisher Verification](../articles/active-directory/develop/publisher-verification-overview.md).

### Phase 2 - The customer authorizes access to the key vault

| Step | Description | Least privileged Azure RBAC roles | Least privileged Azure AD roles |
| -- | ----------------------------------- | -------------- | --------------|
| 1. | <li><i>Recommended</i>: Send the user to [sign in](../articles/active-directory/develop/scenario-web-app-sign-user-overview.md?tabs=aspnetcore) to your app. If the user can sign in, then a service principal for your app exists in their tenant. </li><li>Use [Microsoft Graph](/graph/api/serviceprincipal-post-serviceprincipals), [Microsoft Graph PowerShell](/powershell/module/microsoft.graph.applications/new-mgserviceprincipal?view=graph-powershell-beta&preserve-view=true), [Azure PowerShell](/powershell/module/az.resources/new-azadserviceprincipal), or [Azure CLI](/cli/azure/ad/sp#az-ad-sp-create) to create the service principal. </li><li>Construct [an admin-consent URL](../articles/active-directory/manage-apps/grant-admin-consent.md#construct-the-url-for-granting-tenant-wide-admin-consent) and grant tenant-wide consent to create the service principal using the application ID. | None | Users with permissions to install applications |
| 2. | Create an Azure Key Vault and a key used as the customer-managed key. | A user must be assigned the [Key Vault Contributor](../articles/role-based-access-control/built-in-roles.md#key-vault-contributor) role to create the key vault<br /><br /> A user must be assigned the [Key Vault Crypto Officer](../articles/role-based-access-control/built-in-roles.md#key-vault-crypto-officer) role to add a key to the key vault | None |
| 3. | Grant the consented application identity access to the Azure key vault by assigning the role [Key Vault Crypto Service Encryption User](../articles/key-vault/general/rbac-guide.md?preserve-view=true&tabs=azure-cli#azure-built-in-roles-for-key-vault-data-plane-operations) | To assign the **Key Vault Crypto Service Encryption User** role to the application, you must have been assigned the [User Access Administrator](../articles/role-based-access-control/built-in-roles.md#user-access-administrator) role. | None |
| 4. | Copy the key vault URL and key name into the customer-managed keys configuration of the SaaS offering.| None| None|

> [!NOTE]
> To authorize access to the Managed HSM for encryption using CMK, see example for Storage Account [here](../articles/storage/common/customer-managed-keys-configure-key-vault-hsm.md#assign-a-role-to-the-storage-account-for-access-to-the-managed-hsm). For more information about managing keys with Managed HSM, see [Manage a Managed HSM using the Azure CLI](../articles/key-vault/managed-hsm/key-management.md)

#### Considerations for customers of service providers

- In the customer tenant, *Tenant 2*, an admin can set policies to block non-admin users from installing applications. These policies can prevent non-admin users from creating service principals. If such a policy is configured, then users with permissions to create service principals will need to be involved.
- Access to Azure Key Vault can be authorized using Azure RBAC or access policies. When granting access to a key vault, make sure to use the active mechanism for your key vault.
- An Azure AD application registration has an application ID (client ID). When the application is installed in your tenant, a service principal is created. The service principal shares the same application ID as the app registration, but generates its own object ID. When you authorize the application to have access to resources, you may need to use the service principal `Name` or `ObjectID` property.

### Phase 3 - The service provider encrypts data in an Azure resource using the customer-managed key

After phase 1 and 2 are complete, the service provider can configure encryption on the Azure resource with the key and key vault in the customer's tenant and the Azure resource in the ISV's tenant. The service provider can configure cross-tenant customer-managed keys with the client tools supported by that Azure resource, with an ARM template, or with the REST API.
