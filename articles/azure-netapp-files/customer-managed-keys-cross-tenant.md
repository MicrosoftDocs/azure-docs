---
title: Configure cross-tenant customer-managed keys for Azure NetApp Files volume encryption
description: Learn how to configure cross-tenant customer-managed keys for Azure NetApp Files volume encryption.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 02/17/2026
ms.author: anfdocs
# Customer intent: As an IT administrator managing Azure resources across multiple tenants, I want to configure cross-tenant customer-managed keys for volume encryption in Azure NetApp Files, so that I can enhance security and control over encryption keys used for sensitive data.
---

# Configure cross-tenant customer-managed keys for Azure NetApp Files volume encryption 

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

## Prerequisites 

The cross-tenant CMK workflow builds on the same encryption model, key handling behavior, and operational constraints described for single-tenant customer-managed keys. As a result, the considerations and requirements documented for single-tenant CMK also apply to cross-tenant scenarios.

Before configuring cross-tenant customer-managed keys (CMK) for Azure NetApp Files, review the [considerations](configure-customer-managed-keys.md#considerations), [requirements](configure-customer-managed-keys.md#requirements), and steps to [configure a NetApp account to use customer-managed keys](configure-customer-managed-keys.md#configure-a-netapp-account-to-use-customer-managed-keys). 

These sections describe prerequisites such as supported key types, identity requirements, networking configuration, key permissions, and key vault settings that must be satisfied when using customer-managed keys, regardless of whether the key resides in the same tenant or in a different tenant.

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

> [!IMPORTANT]
> If the NetApp account is configured with same-tenant customer-managed keys, you must switch the account back to Microsoft-managed keys before configuring cross-tenant CMK. To switch, navigate to **Encryption** in the Azure portal and change the encryption key source to **Microsoft-managed key**.

#### [Portal](#tab/portal-configure)

1. In the Azure portal, navigate to your NetApp account and select **Encryption**.
1. Select **Customer-managed key** as the encryption key source.
1. Under **Key URI**, select **Enter key URI** and provide the URI of the encryption key.
1. Under **Identity type**, select **User-assigned**.
1. Select **Select an identity**, then choose the user-assigned managed identity.
1. Under **Federated client ID**, enter the application (client) ID of the multitenant application.
1. Select **Save**.

Verify that `federatedClientId` is present in the encryption properties.

#### [Azure CLI](#tab/cli-configure)

1. With the `az rest` command, configure the NetApp account to use CMK in a different tenant:  

    ```azurecli
    az rest --method put --uri "/subscriptions/<subscription Id>/resourceGroups/<resourceGroupName>/providers/Microsoft.NetApp/netAppAccounts/<NetAppAccountName>?api-version=2025-01-01" --body 
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

    Verify the configuration by running:

    ```azurecli
    az netappfiles account show --resource-group <resourceGroupName> --name <NetAppAccountName> --query "{encryption: properties.encryption}" -o json
    ```

    The output should include `federatedClientId` in the encryption identity properties.

---

### Create a volume 

#### [Portal](#tab/portal-volume)

1. In the Azure portal, select **Volumes** and then select **Add volume**.
1. Follow the instructions in [Configure network features for an Azure NetApp Files volume](configure-network-features.md):
    * [Set the Network Features option in volume creation page](configure-network-features.md#set-the-network-features-option).
    * The network security group for the volume's delegated subnet must allow incoming traffic from NetApp's storage VM.
1. For a NetApp account configured with cross-tenant customer-managed keys, perform the following steps:
    * Select **Customer-Managed Key** in the **Encryption Key Source** dropdown menu.
    * Select **Standard** as the **Network features** option. 
    * Select a **key vault private endpoint**. 
1. Continue to complete the volume creation process. Refer to:
    * [Create an NFS volume](azure-netapp-files-create-volumes.md)
    * [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)
    * [Create a dual-protocol volume](create-volumes-dual-protocol.md)

#### [Azure CLI](#tab/cli-volume)

Create the volume using the CLI: 

```azurecli
az netappfiles volume create -g <resource group name> --account-name <NetApp account name> --pool-name <pool name> --name <volume name> -l southcentralus --service-level premium --usage-threshold 100 --file-path "<file path>" --vnet <virtual network name> --subnet default --network-features Standard --encryption-key-source Microsoft.KeyVault --kv-private-endpoint-id <full resource ID to the private endpoint to the customer's vault> --debug 
```

---

## Troubleshoot cross-tenant customer-managed keys

This section describes issues encountered when configuring cross-tenant CMK and the information to resolve them.

### Verify cross-tenant CMK configuration

To confirm whether a NetApp account is correctly configured for cross-tenant CMK, check for the presence of `federatedClientId` in the account's encryption properties.

#### [Portal](#tab/portal-CMK)

Navigate to your NetApp account, select **Overview**, then select **JSON View**.
  
If cross-tenant CMK is correctly configured, the encryption properties should include `federatedClientId`.

#### [Azure CLI](#tab/cli-CMK)

Run the following command:

```azurecli
az netappfiles account show \
    --resource-group <resourceGroupName> \
    --name <NetAppAccountName> \
    --query "{keySource: encryption.keySource, federatedClientId: encryption.identity.federatedClientId, userAssignedIdentity: encryption.identity.userAssignedIdentity}" \
    -o json
```
If `federatedClientId` is missing, the account is configured with the same-tenant CMK and not with cross-tenant CMK.

---

### Missing Key URI or Encryption Key Source option 

**Symptom:** When creating a volume in the Azure portal, the **Encryption Key Source** dropdown menu doesn't show **Customer-Managed Key**, or fields for **Key URI**, **subscription**, or **identity type** aren't visible.

**Resolution:**
1. Verify if the NetApp account is correctly configured for cross-tenant CMK as described in [Verify cross-tenant CMK configuration](#verify-cross-tenant-cmk-configuration).
1. If the account does not have `federatedClientId`, switch the account to Microsoft-managed keys:
    1. In the Azure portal, navigate to the **Encryption** page.
    1. Change the encryption key source to **Microsoft-managed key**.
    1. Select **Save**.
1. Reconfigure the account for cross-tenant CMK by following the steps in [Configure the NetApp account to use your keys](#configure-the-netapp-account-to-use-your-keys).

## Next steps
* [Configure customer-managed keys](configure-customer-managed-keys.md)
* [Understand data encryption in Azure NetApp Files](understand-data-encryption.md)
