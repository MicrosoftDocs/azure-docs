---
title: Enable SUPI concealment
titleSuffix: Azure Private 5G Core
description: In this how-to guide, learn how to configure SUPI concealment. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 02/01/2024
ms.custom: template-how-to
---

# Enable SUPI concealment

The **subscription permanent identifier (SUPI)** is a unique, permanent identifier for a device. To avoid transmitting this identifier in plain text, it can be concealed through encryption. The encrypted value is known as the **subscription concealed identifier (SUCI)**. The encryption (SUPI concealment) is performed by the UE on registration, generating a new SUCI each time to prevent the user from being tracked. Decryption (SUCI deconcealment) is performed by the Unified Data Management (UDM) network function in the packet core.

SUPI concealment requires a home network public key (HNPK) and a corresponding private key. The public key is stored on the SIM. The private key is stored in Azure Key Vault and referenced by a URL configured on the packet core. In this how-to guide, you'll learn how to configure the packet core with a private key for SUCI deconcealment.

SUPI concealment and SUCI deconcealment are defined in 3GPP TS 33.501: Security architecture and procedures for 5G System.

> [!IMPORTANT]
> SUPI concealment may be required for some user equipment to function. Refer to your equipment vendor documentation for details.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor role at the subscription scope.

- Identify the name of the Mobile Network resource corresponding to your private mobile network.

- Identify which SUPI protection scheme you want to use (profile A or profile B).

- Contact your SIM vendor to discuss programming your SIMs with the public keys. You will need to agree which identify which SUPI protection scheme to use (profile A or profile B) and what key identifier(s) to use.

## Generate home network private keys

You can use the OpenSSL tool in Bash to generate a public and private key pair for either profile A or profile B.


### Profile A

When using SUPI protection scheme Profile A, the key must be an X25519 Private Key.

1. Sign in to the Azure CLI using Azure Cloud Shell and select **Bash** from the dropdown menu.

1. Generate a key pair and save the private key to a file called `hnpk_profile_a.pem`: 

    ```bash
    openssl genpkey -algorithm x25519 -outform pem -out hnpk_profile_a.pem 
    ```
 
1. Get the corresponding public key and save it to a file called `hnpk_profile_a.pub`: 

    ```bash
    openssl pkey -in hnpk_profile_a.pem -pubout -out hnpk_profile_a.pub 
    ```

### Profile B

When using SUPI protection scheme Profile B, the key must be an Elliptic Curve Private Key using curve prime256v1.

1. Sign in to the Azure CLI using Azure Cloud Shell and select **Bash** from the dropdown menu.

1. Generate a key pair and save the private key to a file called `hnpk_profile_b.pem`: 

    ```bash
    openssl genpkey -algorithm ec -pkeyopt ec_paramgen_curve:prime256v1 -outform pem -out hnpk_profile_b.pem 
    ```
 
1. Get the corresponding public key and save it to a file called `hnpk_profile_b.pub`: 

    ```bash
    openssl pkey -in hnpk_profile_b.pem -pubout -out hnpk_profile_b.pub 
    ```

## Add home network private keys to Azure Key Vault

The home network private keys are stored in Azure Key Vault.

> [!IMPORTANT]
> You must use the Azure command line to upload the keys because the portal doesn't support multi-line entries.

1. Either [create an Azure Key Vault](../key-vault/general/quick-create-portal.md) or choose an existing one to host your private keys. Ensure that the Key Vault uses role based access control (RBAC) for authorization. The user will need the Key Vault Secrets Officer role.

1. Upload the private key to the Key Vault as a secret, specifying a name to identify it:

    ```azurecli
    az keyvault secret set --vault-name "<Key Vault name>" --name "<secret name, e.g. hnpk-a-123>" --file <Key file name> 
    ```

1. Make a note of the **secret identifier** URL. This is in the command output, or you can navigate to your Key Vault in the portal and select the secret. You will need to configure the packet core with this URL.

1. Repeat for any additional private keys.

## Create a user-assigned managed identity

1. [Create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity). Make a note of its UAMI resource ID.

1. [Assign Key Vault Secrets User access](/entra/identity/managed-identities-azure-resources/howto-assign-access-portal) to the Key Vault for the managed identity.

1. Go to the **Mobile Network** resource in the portal and select **Identity** from the left-hand **Settings** menu. Select **Add** to add the user-assigned managed identity to the mobile network.

## Configure home network private keys on the packet core

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network for which you want to provision SIMs.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. Select **Modify mobile network**.
1. Under **Home network public key configuration**, select **Add** for either Profile A or Profile B.

    :::image type="content" source="media/supi-concealment/modify-mobile-network.png" alt-text="Screenshot of the Azure portal. It shows the mobile network configuration pane.":::

1. Add the key details.

    - Choose an ID between 1 and 255 and enter it into the **id** field. The ID must match the key identifier provisioned on the SIMs, as agreed with your SIM vendor.
    - Enter the URL of the private key secret into the **url** field, or select **Choose secret** to select it from a drop-down menu.

    :::image type="content" source="media/supi-concealment/add-key.png" alt-text="Screenshot of the Azure portal. It shows the Profile A keys popup.":::

1. Select **Add**.
1. Repeat for any additional private keys.
1. Return to the **Mobile Network** resource. It should now show **Home network public keys : succeeded**.
1. Navigate to the **Packet Core Control Plane** resource. It should now show **Home network private keys provisioning : succeeded**.

## Disabling SUPI concealment

If you need to disable SUPI concealment, remove the configuration from the **Mobile Network** resource.

## Rotating keys

The public key is permanently stored on the SIM, so to change it you will need to issue new SIMs. We therefore recommend creating a new key pair with a new ID and issuing new SIMs. Once all of the old SIMs are out of service, you can remove the packet core configuration for the old keys.

## Next steps

You can use [distributed tracing](distributed-tracing.md) to confirm that SUPI concealment is being performed in the network.
