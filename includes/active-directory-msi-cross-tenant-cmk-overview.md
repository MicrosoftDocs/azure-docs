---
author: karavar
ms.author: vakarand
ms.date: 08/11/2022
ms.service: active-directory
ms.subservice: managed-identity
ms.topic: include
title: Cross tenant customer-managed key (CMK) overview - Azure
description: include file for cross-tenant customer-managed key (CMK) overview
services: active-directory
---

## About cross-tenant customer-managed keys

Many service providers building Software as a Service (SaaS) offerings on Azure want to offer bring-your-own-encryption keys, or customer-managed keys (CMKs).  customer-managed keys allow a service provider to encrypt the customer's data using an encryption key managed by the service provider’s customer. In Azure, the customers of the applications can use Azure Key Vault to manage the encryption keys in their own Azure AD tenant and subscription. Azure platform services (such as Azure Storage or Cosmos DB) and resources owned by the service provider in the service provider's tenant require access to the key from the customer’s tenant to perform the encryption/decryption operations.

The image below shows a disk encryption set with federated identity in a cross-tenant CMK workflow spanning a service provider and its customer.

:::image type="content" source="media/active-directory-msi-cross-tenant-cmk-overview/cross-tenant-cmk-disk-encryption-set.png" alt-text="Screenshot showing a cross-tenant CMK disk encryption set used with a federated identity." lightbox="media/active-directory-msi-cross-tenant-cmk-overview/cross-tenant-cmk-disk-encryption-set.png" border="true":::

In the example above, there are two Azure AD tenants: an independent service provider's tenant (*Tenant1*), and a customer's tenant (*Tenant2*). *Tenant1* hosts Azure platform services and *Tenant2* hosts the customer's key vault.

A multi-tenant application registration is created by the service provider in *Tenant1*. A [federated identity credential](/azure/active-directory/develop/workload-identity-federation-create-trust-managed-identity-as-credentia) is created on this application using a user-assigned managed identity. Then, the name and application ID of the app is shared with the customer.

A user with the appropriate permissions installs the service provider's application in the customer tenant, *Tenant2*. A user then grants the service principal associated with the installed application access to the customer's key vault. The customer also stores the encryption key, or customer-managed key, in the key vault. The customer shares the key location, the URL of the key, with the service provider.

The service provider now has:

- An app ID for a multi-tenant application installed in the customer's tenant, which has been granted access to the customer-managed key.
- A managed identity configured as the credential on the multi-tenant application.
- The location of the key in the customer's key vault.

With these three parameters, the service provider provisions Azure resources in *Tenant1* that can be encrypted with the customer-managed key in *Tenant2*.

Let's divide the above end-to-end solution into three phases:

1. The service provider configures identities.
2. The customer grants the service provider's multi-tenant app access to an encryption key in Azure Key Vault.
3. The service provider encrypts data in an Azure resource using the CMK.

Operations in Phase 1 would be a one-time setup for most service provider applications. Operations in Phases 2 and 3 would repeat for each customer.

### Phase 1 - Service provider configures Azure AD application

| No | Step | Minimum role in Azure RBAC | Minimum role in Azure AD RBAC |
| -- | ----------------------------------- | -------------- | --------------|
| 1. | Create a multi-tenant Azure AD application registration or start with an existing application registration. Note the application ID (Client ID) of the application registration using [Azure portal](/azure/active-directory/develop/quickstart-register-app) or [Microsoft Graph API](/graph/api/application-post-applications?view=graph-rest-1.0) or [Azure AD PowerShell](/powershell/module/azuread/new-azureadapplication) or [Azure CLI](/cli/azure/ad/app?view=azure-cli-latest#az_ad_app_create)| None | [Application Developer](/azure/active-directory/roles/permissions-reference.md#application-developer) |
| 2. | Create a user-assigned managed identity (to be used as a Federated Identity Credential). <br> [Azure portal](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp&preserve-view=true) / [Azure CLI](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azcli&preserve-view=true) / [Azure PowerShell](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-powershell&preserve-view=true)/ [Azure Resource Manager Templates](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-arm&preserve-view=true) | [Manage identity contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor&preserve-view=true) | None |
| 3. | Configure user-assigned managed identity as a *federated identity credential* on the application, so that it can impersonate the identity of the application. <br> [Graph API reference](https://aka.ms/fedcredentialapi)/ [Azure portal](/azure/active-directory/develop/workload-identity-federation-create-trust-managed-identity-as-credential)/ [Azure CLI](/azure/active-directory/develop/workload-identity-federation-create-trust-managed-identity-as-credential)/ [Azure PowerShell](/azure/active-directory/develop/workload-identity-federation-create-trust-managed-identity-as-credential) | None | Owner of the application |
| 4. | Share the application name and application ID with the customer, so that they can install and authorize the application. | None | None|

#### Considerations for service providers

- Azure Resource Manager (ARM) templates are not recommended for creating Azure AD applications.
- The same multi-tenant application can be used to access keys in any number of tenants, like *Tenant2*, *Tenant3*, *Tenant4* and so on. In each tenant, an independent instance of the application is created that has the same application ID but a different object ID. Each instance of this application is thus authorized independently. Consider how the application object used for this feature is used to partition your application across all customers.
- In the service provider tenant, it is not possible to automate the [Publisher Verification](../articles/active-directory/develop/publisher-verification-overview.md).

### Phase 2 - Customer authorizes Azure Key Vault
| No | Step | Least privileged Azure Roles | Least privileged Azure AD Roles |
| -- | ----------------------------------- | -------------- | --------------|
| 1. | <li><i>Recommended</i>: Send the user to [sign in](/azure/active-directory/develop/scenario-web-app-sign-user-overview?tabs=aspnetcore) to your app. If the user can sign in, then a service principal for your app exists in their tenant. Here is some troubleshooting content to help with this approach. </li><li>Alternately, use [Microsoft Graph](/graph/api/serviceprincipal-post-serviceprincipals?view=graph-rest-1.0&tabs=http), [Microsoft Graph PowerShell](/powershell/module/microsoft.graph.applications/new-mgserviceprincipal?view=graph-powershell-beta), [Azure PowerShell](/powershell/module/az.resources/new-azadserviceprincipal?view=azps-7.4.0), or [Azure CLI](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create) to create the service principal. </li><li>Another option is to construct [an admin-consent URL](../articles/active-directory/manage-apps/grant-admin-consent.md#construct-the-url-for-granting-tenant-wide-admin-consent) and grant tenant-wide consent to create the service principal using the application ID. | None | Users with permissions to install applications |
| 2. | Create an Azure Key Vault and a key used as the customer-managed key. | Contributor, Key Vault Crypto Officer | None |
| 3. | Grant the consented application identity access to Azure Key Vault using Azure Role Based Access Control using the role [“Key Vault Crypto Service Encryption User”](/azure/key-vault/general/rbac-guide?tabs=azure-cli#azure-built-in-roles-for-key-vault-data-plane-operations&preserve-view=true) | Key Vault Administrator | None |
| 4. | Copy the Key Vault URL and Key Name into the Customer-Managed-Keys configuration of the SaaS offering.| None| None|

#### Considerations for customers of service providers

- In the customer tenant, *Tenant2*, an admin can set policies to block non-admin users from installing applications. Such policies can prevent non-admin users from creating the service principals. If such a policy is configured, then users with permissions to create service principals will have to be involved.
- Key Vault can be authorized using Azure RBAC or access policies. When granting access to a key vault, make sure the active mechanism used for your key vault is used.
- An Azure AD application registration has an application ID (client ID). When the application is installed in your tenant, a service principal is created. The service principal shares the same application ID as the app registration, but generates its own object ID. When you authorize the application to have access to resources, you may need to use the service principal `Name` or `ObjectID` property.

### Phase 3 - Service provider encrypts data in an Azure resource using the CMK

After phase 1 and 2 are complete, the service provider can deploy a disk encryption set configured to work across tenants. You can do this using an ARM template or REST API.
