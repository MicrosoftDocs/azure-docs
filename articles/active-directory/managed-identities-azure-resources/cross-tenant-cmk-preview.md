# Cross tenant Customer Managed Keys with Managed identity
Private Preview Documentation | Version 2.0 | Last updated on August 10, 2021

```
Microsoft Confidential | Contact: crosstenantcmkvteam@service.microsoft.com
```
## Scenario Overview
Azure resources require a way to access other Azure services in various scenarios. Today, Managed Identities for Azure resources make it easy to facilitate such access by eliminating the need for credential management, only if all resources belong to the same Azure AD Tenant. Multiple service providers building SaaS offerings on Azure want to offer Customer Managed Keys to encrypt all customer data using an encryption key managed by the service provider’s customer using Azure Key Vault managed using the customer’s Azure AD Tenant and subscription. The Azure resources owned by the Service Provider in the Service-Provider Tenant require access to the key from the customer’s tenant to perform the encryption/decryption operations. In this private-preview we will enable a mechanism using a new feature of Azure AD called workload identity federation. Thank you for your participation in the private preview!

## Solution
We can achieve the scenario using a new feature of Azure AD called “Workload Identity Federation”. In this proposal, Service Provider/ISV creates a multi-tenant application in Azure AD. Azure AD will allow creating a “ federated identity credential ” for this application. With this new type of credential, you can configure an existing Managed Identity Service Principal in Azure AD to be able to impersonate the identity of the Azure AD Application in a tenant where the application has been installed/consented. This allows a managed identity (both system-assigned and user-assigned MI) to impersonate (get tokens) as a multi-tenant application in any
tenant in which the application has been installed/consented. A user-assigned managed identity can be assigned one or more Azure resources. With the assignment, Azure resources can now request tokens as the multi-tenant Azure AD application.
In the customer tenant (customer of the service provider), users with appropriate permissions can install the enterprise application, which is represented as a Service Principal. This can be achieved via the application consent experience or simply calling Microsoft Graph API to create the service principal. Once provisioned, the service principal can be granted access to the
desired Azure resources, like an Azure Key Vault, where the CMK is stored. From the customer’s perspective, they are installing an application in Azure AD (thus creating an identity to represent the application) that is published by the service provider they trust and allowing that application access to the required resources. They do not have additional visibility into how the
application is implemented. This divides the end-to-end solution into 3 phases as described further. Phase 1 can be a one-
time setup. Phase 2 and 3 would repeat for each customer. 

### Phase 1 - Service Provider configures Identities

| No | Step | Least privileged Azure Roles | Least privileged Azure AD Roles | 
| -- | ----------------------------------- | -------------- | --------------| 
| 1. | Create a multi-tenant Azure AD application registration or start with an existing application registration. Note the ApplicationId (aka ClientId) of the application registration. <br>[Azure Portal](https://link) / [Microsoft Graph API](https://link) / [Azure AD owerShell](https://link) / [Azure CLI](https://link) | None | User with permissions to create Applications 
| 2. | Create a user-assigned managed identity (to be used as a Federated Identity Credential). <br> [Azure Portal](https://link) / [Azure CLI](https://link) / [Azure PowerShell](https://link)/ [Azure Resource Manager Templates](https://link) | [Manage identity contributor](https://link) | None | 
| 3. | Configure user-assigned managed identity as a *federated identity credential* on the application, so that it can impersonate the identity of the application. <br> [Graph API reference](https://aka.ms/fedcredentialapi) : Microsoft-internal link during Private Preview, shared as attachment with participants. | None | Owner of the application | 
| 4. | Share the ApplicationId with the customer, so that they can install the application. | None | None| 


### Phase 2 - Customer authorizes Azure Key Vault
| No | Step | Least privileged Azure Roles | Least privileged Azure AD Roles | 
| -- | ----------------------------------- | -------------- | --------------| 
| 1. | Install the Service Provider Application with any one of the following options <br>[Graph API](https://link) / [Azure AD PowerShell](https://link) / [Azure CLI](https://link) <br> OR Using the consent URL: Navigate to the URL such as below by replacing the appropriate clientId: https://login.microsoftonline.com/common/oauth2/authorize?response_type=code&client_id=248e869f-0e5c-484d-b5ea1fba9563df41&redirect_uri=https://www.your-app-url.com <br> Navigating to this URL from a web browser will invoke the consent experience and install the application in the tenant used to authenticate. | None | Users with permissions to install applications | 
| 2. |  Create Azure Key Vault and a key used as Customer Managed Key. | Contributor, Key Vault Crypto Officer | None | 
| 3. |  Grant the consented Application Identity access to Azure Key Vault using Azure Role Based Access Control using the role “Key Vault Crypto Service Encryption User” | Key Vault Administrator | None | 
| 4. | Copy the Key Vault URL and Key Name into the CMK configuration of the SaaS offering.| None| None| 

### Phase 3 – Service Provider configures Customer Managed Keys
| No | Step | Least privileged Azure Roles | Least privileged Azure AD Roles |
| -- | ----------------------------------- | -------------- | --------------| 
| 1. | Create an Azure Storage account with Cross Tenant Customer Managed Keys. Shared as attachment - [Azure Storage - Private Preview Cross-tenant CMK for Azure Storage.docx] <br> [Azure Portal](https://link) / [Azure CLI](https://link)/ [ARM Templates](https://link)/ [Azure PowerShell](https://link) / [REST APIs](https://link) : Microsoft internal link shared as attachment | Contributor | None | 
| 2. | Create an Azure SQL server with Cross Tenant Customer Managed Keys <br> [Azure Portal](https://link) / [Azure CLI](https://link)/ [ARM Templates](https://link)/ [Azure PowerShell](https://link) / [REST APIs](https://link) : Microsoft internal link shared as attachment  | Contributor | None | 

### Important callouts 
1. In the customer-tenant, an admin can set policies to block non-admin users from consenting to or installing Applications. Such policies can prevent non-admin users (users without a specific Azure AD role) from creating the desired service principal in the customer tenant. If such a policy is configured, then users with permissions to create service principals will have to be involved.
2. Today it is not possible to create new Azure AD Application registrations using ARM templates. It is on the roadmap, but the timelines are unknown and beyond the scope of this private preview. 
3. Azure Key Vault can be configured with network protection. Read more [here](https://link). Accessing a key vault configured to be accessed from specific networks is out of scope of this private preview.

## Step by step instructions for Private Preview with Azure Storage 

This section provides step-by-step tutorial to create a working setup. At the end of this tutorial, you will have a new Azure storage account that is configured for encryption with a key vault from another tenant.

