---
title: Configure cross-tenant customer-managed keys for Azure NetApp Files volume encryption
description: Learn how to configure cross-tenant customer-managed keys for Azure NetApp Files volume encryption.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.custom: references_regions
ms.date: 09/05/2024
ms.author: anfdocs
---

# Configure cross-tenant customer-managed keys for Azure NetApp Files volume encryption (preview)

Cross-tenant customer-managed keys (CMK) for Azure NetApp Files volume encryption allows service providers based on Azure to offer [customer-managed key encryption](configure-customer-managed-keys.md). In the cross-tenant scenario, the NetApp account resides in a tenant managed by an independent software vendor (ISV), while the key used for encryption of volumes in that NetApp account resides in a key vault in a tenant that you manage.

## Supported regions 

Azure NetApp Files cross-tenant customer-managed keys for volume encryption is supported for the following regions:

- Australia Central 
- Australia Central 2 
- Australia East 
- Australia Southeast 
- Brazil South 
- Brazil Southeast 
- Canada Central 
- Canada East 
- Central India 
- Central US 
- East Asia 
- East US 
- East US 2 
- France Central 
- Germany North 
- Germany West Central 
- Israel Central 
- Italy North 
- Japan East 
- Japan West 
- Korea Central 
- Korea South 
- North Central US 
- North Europe 
- Norway East 
- Norway West 
- Qatar Central 
- South Africa North 
- South Central US 
- South India 
- Southeast Asia 
- Spain Central 
- Sweden Central 
- Switzerland North 
- Switzerland West 
- UAE Central 
- UAE North 
- UK South 
- UK West 
- West Europe 
- West US 
- West US 2 
- West US 3 

## Register the feature 

<!-- register the feature --> 

## Configure cross-tenant CMK for Azure NetApp Files 

Cross-tenant CMK is currently only supported for the REST API. 

##  Configure a NetApp account to use a key from a vault in another tenant.

1. Create the application registration. 
    1. Navigate to Microsoft Entra ID in the Azure Portal
    1. Select **Manage > App registrations** from the left pane.
    1. Select **+ New registration**.
    1. Provide the name for the application registration then select **Account** in any organizational directory.
    1. Select **Register**.
    1. Take note of the ApplicationID/ClientID of the application.
1. Create a user-assigned managed identity. 
    1. Navigate to Managed Identities in the Azure Portal. 
    1. Select **+ Create**.
    1. Provide the resource group, region, and name for the managed identity.    
    1. Select **Review + create**.
    1. On successful deployment, note the Azure ResourceId of the user-assigned managed identity, which is available under Properties. For example:
    `/subscriptions/aaaaaaaa-0000-aaaa-0000-aaaa0000aaaa/resourcegroups/<resourceGroup>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identityTitle>`
1. Configure the user-assigned managed identity as a federated credential on the application
    1. Navigate to **Microsoft Entra ID > App registrations > your application**.
    1. Select **Certificates & secrets**.
    1. Select **Federated credentials**.
    1. Select **+ Add credential**.
    1. Under Federated credential scenario, select **Customer Managed Keys**.
    1. Choose **Select a managed identity**. From the pane, select the subscription. Under **Managed identity**, select **User-assigned managed identity**. In the Select box, search for the managed identity you created earlier, then choose **Select** at the bottom of the pane.
    1. Under Credential details, provide a name and optional description for the credential. Select **Add**.
1. Create a private endpoint to the your key vault:
    1. Have the customer share the full Azure ResourceId of their Key Vault. <!-- huh? -->
    1. Navigate to **Private Endpoints**.
    1. Select **+ Create**.
    1. Choose your subscription and resource group, and enter a name for the Private Endpoint, then select **Next > Resource**.
    1. In the Resource tab, enter the following:
        - Under Connection Method, select **Connect to an Azure resource by resource ID or alias**.
        - Under **Resource ID or alias**, enter the ResourceID of the customer’s key vault.
        - Under target sub-resource enter “vault”. Then select **Next > Virtual Network**.
    1. In the Virtual Network tab, select a virtual network and subnet for the private endpoint. The endpoint must be in the same virtual network as the volumes you wish to create. The subnet must be a different subnet than the one delegated to `Microsoft.NetApp/volumes`.
    1. Select Next on the next few tabs. Finally, select **Create** on the final tab.

### Authorize access to the key vault 

1. Install the service provider application in the customer tenant
    1. Get the Admin Consent URL from the provider for their cross-tenant application. In our example the URL would look like this: https://login.microsoftonline.com/<tenant1 tenantId>/adminconsent/client_id=<client/application ID for the cross tenant-application> This will open a login page where you enter your credentials. Once you enter your credentials, you may see an error stating there is no redirect URL configured. This is OK, the service


