---
title: Sign container images with Notation and Azure Key vault using a CA-issued certificate (Preview)
description: In this tutorial learn to create a CA-issued certificate in Azure Key Vault, build and sign a container image stored in Azure Container Registry (ACR) with notation and AKV, and then verify the container image using notation.
author: yizha1
ms.author: yizha1
ms.service: container-registry
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 6/9/2023
---

# Sign container images with Notation and Azure Key Vault using a CA-issued certificate (Preview)

Signing and verifying the container images with a certificate issued by a trusted Certificate Authority (CA) ensure authorizing and validating the identity responsibly with approved CA without any compromise. The trusted CA entities (for example, GlobalSign or DigiCert) ensure to validate the user's and organization's identity and also have the authority to revoke the certificate immediately upon any risk or misuse.

[Notation](https://github.com/notaryproject/notation) is an open source supply chain tool developed by [Notary Project](https://notaryproject.dev/), which supports signing and verifying container images and other artifacts. The Azure Key Vault (AKV) is used to store a certificate with a signing key that can be utilized by Notation with the [Notation AKV plugin (azure-kv)](https://github.com/Azure/notation-azure-kv) to sign and verify container images and other artifacts. The Azure Container Registry (ACR) allows you to attach these signatures to the signed image.

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

In this article:

> [!div class="checklist"]
> * Install the notation CLI and AKV plugin
> * Create or import a certificate issued by a CA in AKV
> * Build and push a container image with ACR task
> * Sign a container image with Notation CLI and AKV plugin 
> * Verify a container image signature with Notation CLI

## Prerequisites

> * Create or use an [Azure Container Registry](../container-registry/container-registry-get-started-azure-cli.md) for storing container images and signatures
> * Create or use an [Azure Key Vault.](../key-vault/general/quick-create-cli.md)
> * Install and configure the latest [Azure CLI](/cli/azure/install-azure-cli), or run commands in the [Azure Cloud Shell](https://portal.azure.com/#cloudshell/)

> [!NOTE]
> We recommend creating a new Azure Key Vault for storing certificates only.

## Install the notation CLI and AKV plugin

1. Install `Notation v1.0.0` on a Linux amd64 environment. Follow the [Notation installation guide](https://notaryproject.dev/docs/user-guides/installation/) to download the package for other environments.

    ```bash
    # Download, extract and install
    curl -Lo notation.tar.gz https://github.com/notaryproject/notation/releases/download/v1.0.0/notation_1.0.0_linux_amd64.tar.gz
    tar xvzf notation.tar.gz

    # Copy the notation cli to the desired bin directory in your PATH, for example
    cp ./notation /usr/local/bin
    ```

2. Install the notation Azure Key Vault plugin on a Linux environment for remote signing. You can also download the package for other environments by following the [Notation AKV plugin installation guide](https://github.com/Azure/notation-azure-kv#installation-the-akv-plugin).

    ```bash
    # Create a directory for the plugin
    mkdir -p ~/.config/notation/plugins/azure-kv
                    
    # Download the plugin
    curl -Lo notation-azure-kv.tar.gz https://github.com/Azure/notation-azure-kv/releases/download/v1.0.1/notation-azure-kv_1.0.1_linux_amd64.tar.gz 
                    
    # Extract to the plugin directory
    tar xvzf notation-azure-kv.tar.gz -C ~/.config/notation/plugins/azure-kv
    ```

> [!NOTE]
> The plugin directory varies depending upon the operating system in use. The directory path assumes Ubuntu. For more information, see [Notation directory structure for system configuration.](https://notaryproject.dev/docs/user-guides/how-to/notary-project-concepts/)

3. List the available plugins.
    
    ```bash
    notation plugin ls
    ```

## Configure environment variables 

> [!NOTE]
> We recommend to provide values for the Azure resources to match the existing AKV and ACR resources for easy execution of commands in the tutorial.

1. Configure AKV resource names. 

    ```bash
    # Name of the existing Azure Key Vault used to store the signing keys 
    AKV_NAME=myakv 
    
    # Name of the certificate created or imported in AKV 
    CERT_NAME=wabbit-networks-io 
    
    # X.509 certificate subject
    CERT_SUBJECT="CN=wabbit-networks.io,O=Notation,L=Seattle,ST=WA,C=US"
    ```

2. Configure ACR and image resource names. 
    
    ```bash
    # Name of the existing registry example: myregistry.azurecr.io 
    ACR_NAME=myregistry 
    # Existing full domain of the ACR 
    REGISTRY=$ACR_NAME.azurecr.io 
    # Container name inside ACR where image will be stored 
    REPO=net-monitor 
    TAG=v1 
    # Source code directory containing Dockerfile to build 
    IMAGE_SOURCE=https://github.com/wabbit-networks/net-monitor.git#main  
    ```

## Sign in with Azure CLI

```bash
az login
```

To learn more about Azure CLI and how to sign in with it, see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).


## Create or import a certificate issued by a CA in AKV

### Certificate requirements

When creating certificates for signing and verification, it is important to ensure that they meet the [Notary Project certificate requirement](https://github.com/notaryproject/specifications/blob/v1.0.0/specs/signature-specification.md#certificate-requirements). 

The requirements for root and intermediate certificates are as follows:
- The `basicConstraints` extension MUST be present and MUST be marked as critical. The `cA` field MUST be set `true`.
- The `keyUsage` extension MUST be present and MUST be marked `critical`. Bit positions for `keyCertSign` MUST be set. 

The requirements for certificates issued by a CA are as follows:
- X.509 certificate properties:
  - Subject MUST contain common name (`CN`), country (`C`), state or province (`ST`), and organization (`O`). In this tutorial, `$CERT_SUBJECT` is used as the subject.
  - X.509 key usage flag must be `DigitalSignature` only.
  - Extended Key Usages (EKUs) must be empty or `1.3.6.1.5.5.7.3.3` (for Codesigning).
- Key properties:
  - The property "exportable" should be set to `false`
  - Select [supported key type and size](https://github.com/notaryproject/specifications/blob/v1.0.0/specs/signature-specification.md#algorithm-selection)

> [!NOTE]
> Version v1.0.0 of the Notation AKV plugin requires a specific certificate order in a certificate chain. However, this limitation has been removed in version v1.0.1. We recommend using the latest version of the plugin.

### Create a certificate issued by a CA

To create a certificate issued by a CA, follow these steps:

1. Create a certificate signing request (CSR) by following the instructions in [create certificate signing request](../key-vault/certificates/create-certificate-signing-request.md).
2. When merging the CSR, make sure you merge the entire chain that brought back from the CA vendor.

### Import a certificate in AKV

To import a certificate, follow these steps:

1. Get the certificate file from CA vendor with entire certificate chain.
2. Import the certificate into Azure Key Vault by following the instructions in [import a certificate](../key-vault/certificates/tutorial-import-certificate.md).

> [!NOTE]
> If the certificate does not contain a certificate chain after creation or importing, you can obtain the intermediate and root certificates from your CA vendor. You can ask your vendor to provide you with a PEM file that contains the intermediate certificates (if any) and root certificate. This file can then be used at step 5 of [signing container images](#sign-a-container-image-with-notation-cli-and-akv-plugin).

## Sign a container image with Notation CLI and AKV plugin 

1. Authenticate to your ACR by using your individual Azure identity.

    ```bash
    az acr login --name $ACR_NAME
    ```

> [!IMPORTANT]
> If you have Docker installed on your system and used `az acr login` or `docker login` to authenticate to your ACR, your credentials are already stored and available to notation. In this case, you don’t need to run `notation login` again to authenticate to your ACR. To learn more about authentication options for notation, see [Authenticate with OCI-compliant registries](https://notaryproject.dev/docs/user-guides/how-to/registry-authentication/).

2. Build and push a new image with ACR Tasks. Always use `digest` to identify the image for signing, because tags are mutable and and can be overwritten.

    ```bash
    DIGEST=$(az acr build -r $ACR_NAME -t $REGISTRY/${REPO}:$TAG $IMAGE_SOURCE --no-logs --query "outputImages[0].digest" -o tsv)
    IMAGE=$REGISTRY/${REPO}@$DIGEST
    ```

3. Assign access policy in AKV (Azure CLI)

   To sign a container image with a certificate in AKV, a principal must have authorized access to AKV. The principal can be a user principal, service principal, or managed identity. In this tutorial, we assign access policy to a signed-in user. To learn more about assigning policy to a principal, see [Assign Access Policy](/azure/key-vault/general/assign-access-policy). 
    
   To set the subscription that contains the AKV resources, run the following command:

   ```bash
   az account set --subscription <your_subscription_id>
   ```
    
   If the certificate contains the entire certificate chain, the principal must be granted key permission `Sign`, secret permission `Get`, and certificate permissions `Get`. To grant these permissions to the principal, run the following command:

   ```bash
   USER_ID=$(az ad signed-in-user show --query id -o tsv)
   az keyvault set-policy -n $AKV_NAME --key-permissions sign --secret-permissions get --certificate-permissions get --object-id $USER_ID
   ```
    
   If the certificate doesn't contain the chain, the principal must be granted key permission `Sign`, and certificate permissions `Get`. To grant these permissions to the principal, run the following command:
    
   ```bash
   USER_ID=$(az ad signed-in-user show --query id -o tsv)
   az keyvault set-policy -n $AKV_NAME --key-permissions sign --certificate-permissions get --object-id $USER_ID
   ```

4. Get the Key ID for a certificate, assuming the certificate name is $CERT_NAME. A certificate in AKV can have multiple versions, the following command get the Key Id for the latest version.

   ```bash
   KEY_ID=$(az keyvault certificate show -n $CERT_NAME --vault-name $AKV_NAME --query 'kid' -o tsv) 
   ```

5. Sign the container image with the COSE signature format using the key ID. 

   If the certificate contains the entire certificate chain, run the following command:

   ```bash
   notation sign --signature-format cose $IMAGE --id $KEY_ID --plugin azure-kv 
   ```

   If the certificate does not contain the chain, you need to use an additional plugin parameter `--plugin-config ca_certs=<ca_bundle_file>` to pass the CA certificates in a PEM file to AKV plugin, run the following command:

   ```bash
   notation sign --signature-format cose $IMAGE --id $KEY_ID --plugin azure-kv --plugin-config ca_certs=<ca_bundle_file> 
   ```

6. View the graph of signed images and associated signatures. 

    ```bash
    notation ls $IMAGE 
    ```

## Verify a container image with Notation CLI 

1. Add root certificate to a named trust store for signature verification. Users need to obtain the root certificate from the CA vendor, and assuming the root certificate file is stored in $ROOT_CERT. 

    ```bash
    STORE_TYPE="ca" 
    STORE_NAME="wabbit-networks.io" 
    notation cert add --type $STORE_TYPE --store $STORE_NAME $ROOT_CERT  
    ```

2. List the root certificate to confirm. 

    ```bash
    notation cert ls 
    ```

3. Configure trust policy before verification.

   Trust policies allow users to specify fine-tuned verification policies. Use the following command to configure trust policy. Upon successful execution of the command, one trust policy named `wabbit-networks-images` is created. This trust policy applies to all the artifacts stored in repositories defined in `$REGISTRY/$REPO`. Assuming that the user trusts a specific identity with the X.509 subject `$CERT_SUBJECT`, which is used for the signing certificate. The named trust store `$STORE_NAME` of type `$STORE_TYPE` contains the root certificates. See [Trust store and trust policy specification](https://github.com/notaryproject/notaryproject/blob/v1.0.0/specs/trust-store-trust-policy.md) for details.

    ```bash
    cat <<EOF > ./trustpolicy.json
    {
        "version": "1.0",
        "trustPolicies": [
            {
                "name": "wabbit-networks-images",
                "registryScopes": [ "$REGISTRY/$REPO" ],
                "signatureVerification": {
                    "level" : "strict" 
                },
                "trustStores": [ "$STORE_TYPE:$STORE_NAME" ],
                "trustedIdentities": [
                    "x509.subject: $CERT_SUBJECT"
                ]
            }
        ]
    }
    EOF
    ```

4. Use `notation policy` to import the trust policy configuration from a JSON file that we created previously. 

    ```bash
    notation policy import ./trustpolicy.json
    notation policy show
    ```
    
5. The notation command can also help to ensure the container image hasn't been tampered with since build time by comparing the `sha` with what is in the registry.

    ```bash
    notation verify $IMAGE
    ```
   Upon successful verification of the image using the trust policy, the sha256 digest of the verified image is returned in a successful output message.

## FAQ

- What should I do if the certificate is expired? 
  
  If the certificate has expired, it invalidates the signature. To resolve this issue, you should renew the certificate and sign container images again. Learn more about [Renew your Azure Key Vault certificates](../key-vault/certificates/overview-renew-certificate.md).

- What should I do if the root certificate is expired? 

  If the root certificate has expired, it invalidates the signature. To resolve this issue, you should obtain a new certificate from a trusted CA vendor and sign container images again. Replace the expired root certificate with the new one from the CA vendor.

- What should I do if the certificate is revoked?

  If the certificate is revoked, it invalidates the signature. The most common reason for revoking a certificate is when the certificate’s private key has been compromised. To resolve this issue, you should obtain a new certificate from a trusted CA vendor and sign container images again.

## Next steps

See [Ratify on Azure: Allow only signed images to be deployed on AKS with Notation and Ratify](https://github.com/deislabs/ratify/blob/main/docs/quickstarts/ratify-on-azure.md).

[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/