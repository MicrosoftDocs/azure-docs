---
title: Configure cross-tenant customer-managed keys for Azure NetApp Files volume encryption
description: Learn how to configure cross-tenant customer-managed keys for Azure NetApp Files volume encryption.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 04/23/2025
ms.author: anfdocs
---

# Configure cross-tenant customer-managed keys for Azure NetApp Files volume encryption (preview)

Cross-tenant customer-managed keys (CMK) for Azure NetApp Files volume encryption allows service providers based on Azure to offer [customer-managed key encryption](configure-customer-managed-keys.md). In the cross-tenant scenario, the NetApp account resides in a tenant managed by an independent software vendor, while the key used for encryption of volumes in that NetApp account resides in a key vault in a tenant that you manage.

Cross-tenant customer-managed keys is available in all Azure NetApp Files supported regions.

## Understand cross-tenant customer-managed keys

The following diagram illustrates a sample cross-tenant CMK configuration. In the diagram, there are two Azure tenants: a service provider's tenant (Tenant 1) and your tenant (Tenant 2). Tenant 1 hosts the NetApp Account (source Azure resource). Tenant 2 hosts your key vault.

:::image type="content" source="./media/customer-managed-keys-cross-tenant/cross-tenant-diagram.png" alt-text="Screenshot of create application volume group interface for extension one." lightbox="./media/customer-managed-keys-cross-tenant/cross-tenant-diagram.png":::

A multitenant application registration is created by the service provider in Tenant 1. A [federated identity credential](/entra/workload-id/workload-identity-federation-create-trust?pivots=identity-wif-apps-methods-azp) is created on this application using a user-assigned managed identity along with a private endpoint to the key vault. Then, the name and application ID of the app are shared. 

Following these steps, you install the service provider's application in your tenant (tenant 2) then grant the service principal associated with the installed application access to the key vault. You also store the encryption key (that is, the customer-managed key) in the key vault. You also share the key location (the URI of the key) with the service provider. Following configuration, the service provider has:

- An application ID for a multitenant application installed in the customer's tenant, which has been granted access to the customer-managed key. 
- A managed identity configured as the credential on the multitenant application. 
 The location of the key in the key vault. 

With these three parameters, the service provider provisions Azure resources in tenant 1 that can be encrypted with the customer-managed key in tenant 2. 

## Register the feature 

This feature is currently in preview. You need to register the feature before using it for the first time. After registration, the feature is enabled and works in the background. No UI control is required. 

1. Register the feature: 

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFCrossTenantCMK
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** can remain in the `Registering` state for up to 60 minutes before changing to`Registered`. Wait until the status is **Registered** before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFCrossTenantCMK
    ```
You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

## Configure cross-tenant customer-managed keys for Azure NetApp Files 

The configuration process for cross-tenant customer-managed keys has portions that can only be completed using the REST API and Azure CLI. 

##  Configure a NetApp account to use a key from a vault in another tenant

1. Create the application registration. 
    1. Navigate to Microsoft Entra ID in the Azure portal
    1. Select **Manage > App registrations** from the left pane.
    1. Select **+ New registration**.
    1. Provide the name for the application registration then select **Account** in any organizational directory.
    1. Select **Register**.
    1. Take note of the ApplicationID/ClientID of the application.
1. Create a user-assigned managed identity. 
    1. Navigate to Managed Identities in the Azure portal. 
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
1. Create a private endpoint to your key vault:
    1. Share the full Azure ResourceId of their Key Vault. <!-- huh? -->
    1. Navigate to **Private Endpoints**.
    1. Select **+ Create**.
    1. Choose your subscription and resource group, and enter a name for the Private Endpoint, then select **Next > Resource**.
    1. In the Resource tab, enter the following:
        - Under Connection Method, select **Connect to an Azure resource by resource ID or alias**.
        - Under **Resource ID or alias**, enter the ResourceID of the customer’s key vault.
        - Under target subresource, enter "vault". Then select **Next > Virtual Network**.
    1. In the Virtual Network tab, select a virtual network and subnet for the private endpoint. The endpoint must be in the same virtual network as the volumes you wish to create. The subnet must be a different subnet than the one delegated to `Microsoft.NetApp/volumes`.
    1. Select Next on the next few tabs. Finally, select **Create** on the final tab.

### Authorize access to the key vault 

1. Install the service provider application in the customer tenant
    1. Get the Admin Consent URL from the provider for their cross-tenant application. In our example the URL would look like: `https://login.microsoftonline.com/<tenant1-tenantId>/adminconsent/client_id=<client/application-ID-for-the-cross-tenant-application>`. The URL opens a sign-in page prompting you to enter your credentials. Once you enter your credentials, you might see an error stating there's no redirect URL configured; this is OK.
1. Grant the service provider application access to the key vault. 
    1. Navigate to your key vault. Select **Access Control (IAM)** from the left pane.  
    1. Under Grant access to this resource, select **Add role assignment**. 
    1. Search for then select **Key Vault Crypto User**. 
    1. Under Members, select **User, group, or service principal**. 
    1. Select **Members**. Search for the application name of the application you installed from the service provider. 
    1. Select **Review + Assign**. 
1. Accept the incoming private endpoint connection to the key vault. 
    1. Navigate to your key vault. Select **Networking** from the left pane. 
    1. Under **Private Endpoint Connections**, select the incoming Private Endpoint from the provider’s tenant, then select **Approve**. 
    1. Set an optional description or accept the default. 

### Configure the NetApp account to use your keys 

>[!NOTE]
>Using the `az rest` command is the only supported way to configure your NetApp account to use CMK in a different tenant.

1. With the `az rest` command, configure the NetApp account to use CMK in a different tenant:  

    ```azurecli
    az rest --method put --uri "/subscriptions/<subscription Id>/resourceGroups/<resourceGroupName>/providers/Microsoft.NetApp/netAppAccounts/<NetAppAccountName>?api-version=2024-01-01-preview" --body 
    '{  \"properties\":
        {    \"encryption\":
            {      \"keySource\": \"Microsoft.KeyVault\",   \"keyVaultProperties\":    
                {\"keyVaultUri\": \"<URI to the key vault>\",   \"keyVaultResourceId\": \"/<full resource ID of the key vault>\", \"keyName\": \"<customer’s key name>\"   },
                \"identity\":
                    { \"userAssignedIdentity\": \"<full resource ID of the user-assigned identity>",  \"federatedClientId\": \"<clientId of multi-tenant application>\"
                    }
                }
            },
        \"location\": \"southcentralus\",   \"identity\": 
            {\"type\": \"userAssigned\",   \"userAssignedIdentities\": 
                {  \"<full resource ID of the user-assigned identity>\": {
                    }
                }
            }
        }'
     --verbose 
    ```
    Once you have sent the `az rest` command, your NetApp Account has been successfully configured with cross-tenant CMK. 

### Create a volume 

>[!NOTE]
>To create a volume using cross-tenant CMK, you must use the Azure CLI.

1. Create the volume using the CLI: 

```azurecli
az netappfiles volume create -g <resource group name> --account-name <NetApp account name> --pool-name <pool name> --name <volume name> -l southcentralus --service-level premium --usage-threshold 100 --file-path "<file path>" --vnet <virtual network name> --subnet default --network-features Standard --encryption-key-source Microsoft.KeyVault --kv-private-endpoint-id <full resource ID to the private endpoint to the customer's vault> --debug 
```

## Next steps
* [Configure customer-managed keys](configure-customer-managed-keys.md)
* [Understand data encryption in Azure NetApp Files](understand-data-encryption.md)