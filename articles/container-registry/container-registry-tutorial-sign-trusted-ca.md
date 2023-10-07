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

1. Install `Notation v1.0.0` on a Linux amd64 environment. Follow the [Notation installation guide](https://notaryproject.dev/docs/user-guides/installation/cli/) to download the package for other environments.

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
> The plugin directory varies depending upon the operating system in use. The directory path assumes Ubuntu. For more information, see [Notation directory structure for system configuration.](https://notaryproject.dev/docs/user-guides/how-to/directory-structure/)

3. List the available plugins.
    
    ```bash
    notation plugin ls
    ```

## Configure environment variables 

> [!NOTE]
> This guide uses environment variables for convenience when configuring the AKV and ACR. Update the values of these environment variables for your specific resources.

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

When creating certificates for signing and verification, the certificates must meet the [Notary Project certificate requirement](https://github.com/notaryproject/specifications/blob/v1.0.0/specs/signature-specification.md#certificate-requirements). 

Here are the requirements for root and intermediate certificates:
- The `basicConstraints` extension must be present and marked as critical. The `CA` field must be set `true`.
- The `keyUsage` extension must be present and marked `critical`. Bit positions for `keyCertSign` MUST be set. 

Here are the requirements for certificates issued by a CA:
- X.509 certificate properties:
  - Subject must contain common name (`CN`), country (`C`), state or province (`ST`), and organization (`O`). In this tutorial, `$CERT_SUBJECT` is used as the subject.
  - X.509 key usage flag must be `DigitalSignature` only.
  - Extended Key Usages (EKUs) must be empty or `1.3.6.1.5.5.7.3.3` (for Codesigning).
- Key properties:
  - The `exportable` property must be set to `false`.
  - Select a supported key type and size from the [Notary Project specification](https://github.com/notaryproject/specifications/blob/v1.0.0/specs/signature-specification.md#algorithm-selection).

> [!NOTE]
> This guide uses version 1.0.1 of the AKV plugin. Prior versions of the plugin had a limitation that required a specific certificate order in a certificate chain. Version 1.0.1 of the plugin does not have this limitation so it is recommended that you use version 1.0.1 or later.

### Create a certificate issued by a CA

Create a certificate signing request (CSR) by following the instructions in [create certificate signing request](../key-vault/certificates/create-certificate-signing-request.md). 

> [!IMPORTANT]
> When merging the CSR, make sure you merge the entire chain that brought back from the CA vendor.

### Import the certificate in AKV

To import the certificate:

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

2. Build and push a new image with ACR Tasks. Always use `digest` to identify the image for signing, since tags are mutable and can be overwritten.

    ```bash
    DIGEST=$(az acr build -r $ACR_NAME -t $REGISTRY/${REPO}:$TAG $IMAGE_SOURCE --no-logs --query "outputImages[0].digest" -o tsv)
    IMAGE=$REGISTRY/${REPO}@$DIGEST
    ```

    In this tutorial, if the image has already been built and is stored in the registry, the tag serves as an identifier for that image for convenience.

    ```bash
    IMAGE=$REGISTRY/${REPO}@$TAG
    ```

3. Assign access policy in AKV using the Azure CLI

   To sign a container image with a certificate in AKV, a principal must have authorized access to AKV. The principal can be a user principal, service principal, or managed identity. In this tutorial, we assign an access policy to a signed-in user. To learn more about assigning policy to a principal, see [Assign Access Policy](/azure/key-vault/general/assign-access-policy). 
    
   To set the subscription that contains the AKV resources, run the following command:

   ```bash
   az account set --subscription <your_subscription_id>
   ```
    
   If the certificate contains the entire certificate chain, the principal must be granted key permission `Sign`, secret permission `Get`, and certificate permissions `Get`. To grant these permissions to the principal:

   ```bash
   USER_ID=$(az ad signed-in-user show --query id -o tsv)
   az keyvault set-policy -n $AKV_NAME --key-permissions sign --secret-permissions get --certificate-permissions get --object-id $USER_ID
   ```
    
   If the certificate doesn't contain the chain, the principal must be granted key permission `Sign`, and certificate permissions `Get`. To grant these permissions to the principal:
    
   ```bash
   USER_ID=$(az ad signed-in-user show --query id -o tsv)
   az keyvault set-policy -n $AKV_NAME --key-permissions sign --certificate-permissions get --object-id $USER_ID
   ```

4. Get the Key ID for a certificate. A certificate in AKV can have multiple versions, the following command get the Key Id for the latest version of the `$CERT_NAME` certificate.

   ```bash
   KEY_ID=$(az keyvault certificate show -n $CERT_NAME --vault-name $AKV_NAME --query 'kid' -o tsv) 
   ```

5. Sign the container image with the COSE signature format using the Key ID. 

   If the certificate contains the entire certificate chain, run the following command:

   ```bash
   notation sign --signature-format cose $IMAGE --id $KEY_ID --plugin azure-kv 
   ```

   If the certificate does not contain the chain, use the `--plugin-config ca_certs=<ca_bundle_file>` parameter to pass the CA certificates in a PEM file to AKV plugin, run the following command:

   ```bash
   notation sign --signature-format cose $IMAGE --id $KEY_ID --plugin azure-kv --plugin-config ca_certs=<ca_bundle_file> 
   ```

6. View the graph of signed images and associated signatures. 

    ```bash
    notation ls $IMAGE 
    ```

    In the following example of output, a signature of type `application/vnd.cncf.notary.signature` identified by digest `sha256:d7258166ca820f5ab7190247663464f2dcb149df4d1b6c4943dcaac59157de8e` is associated to the `$IMAGE`.

    ```
    myregistry.azurecr.io/net-monitor@sha256:17cc5dd7dfb8739e19e33e43680e43071f07497ed716814f3ac80bd4aac1b58f
└── application/vnd.cncf.notary.signature
    └── sha256:d7258166ca820f5ab7190247663464f2dcb149df4d1b6c4943dcaac59157de8e
    ```

## Verify a container image with Notation CLI 

1. Add the root certificate to a named trust store for signature verification. If you do not have the root certificate, you can obtain it from your CA. The following example adds the root certificate `$ROOT_CERT` to the `$STORE_NAME` trust store. 

    ```bash
    STORE_TYPE="ca" 
    STORE_NAME="wabbit-networks.io" 
    notation cert add --type $STORE_TYPE --store $STORE_NAME $ROOT_CERT  
    ```

2. List the root certificate to confirm the `$ROOT_CERT` is added successfully.

    ```bash
    notation cert ls 
    ```

3. Configure trust policy before verification.

   Trust policies allow users to specify fine-tuned verification policies. Use the following command to configure trust policy.

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

    The above `trustpolicy.json` file defines one trust policy named `wabbit-networks-images`. This trust policy applies to all the artifacts stored in the `$REGISTRY/$REPO` repositories. The named trust store `$STORE_NAME` of type `$STORE_TYPE` contains the root certificates. It also assumes that the user trusts a specific identity with the X.509 subject `$CERT_SUBJECT`. For more details, see [Trust store and trust policy specification](https://github.com/notaryproject/notaryproject/blob/v1.0.0/specs/trust-store-trust-policy.md).

4. Use `notation policy` to import the trust policy configuration from `trustpolicy.json`. 

    ```bash
    notation policy import ./trustpolicy.json
    ```

5. Show the trust policy configuration to confirm its successful import.

    ```bash
    notation policy show
    ```
    
5. Use `notation verify` to verify the integrity of the image:

    ```bash
    notation verify $IMAGE
    ```

   Upon successful verification of the image using the trust policy, the sha256 digest of the verified image is returned in a successful output message. An example of output:

   `Successfully verified signature for myregistry.azurecr.io/net-monitor@sha256:17cc5dd7dfb8739e19e33e43680e43071f07497ed716814f3ac80bd4aac1b58f`

## FAQ

- What should I do if the certificate is expired? 
  
  If the certificate has expired, it invalidates the signature. To resolve this issue, you should renew the certificate and sign container images again. Learn more about [Renew your Azure Key Vault certificates](../key-vault/certificates/overview-renew-certificate.md).

- What should I do if the root certificate is expired? 

  If the root certificate has expired, it invalidates the signature. To resolve this issue, you should obtain a new certificate from a trusted CA vendor and sign container images again. Replace the expired root certificate with the new one from the CA vendor.

- What should I do if the certificate is revoked?

  If the certificate is revoked, it invalidates the signature. The most common reason for revoking a certificate is when the certificate’s private key has been compromised. To resolve this issue, you should obtain a new certificate from a trusted CA vendor and sign container images again.

## Next steps

See [Use Image Integrity to validate signed images before deploying them to your Azure Kubernetes Service (AKS) clusters (Preview)](/azure/aks/image-integrity?tabs=azure-cli) and [Ratify on Azure](https://ratify.dev/docs/1.0/quickstarts/ratify-on-azure/) to get started into verifying and auditing signed images before deploying them on AKS.

[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/