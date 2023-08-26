---
title: Sign container images using Notation and trusted CA signed certificates in Azure Key Vault (Preview)
description: In this tutorial learn to create a trusted CA signed certificate, build and sign a container image stored in Azure Container Registry (ACR) using notation and AKV, and then verify the container image using notation.
author: yizha1
ms.author: yizha1
ms.service: container-registry
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 6/9/2023
---

# Sign container images using Notation and trusted CA signed certificates in Azure Key Vault (Preview)

Signing and verifying the container images with a certificate signed by trusted CA ensures authorizing and validating the identity responsibly with approved certificate authority (CA) without any compromise. The trusted CA entities (for example, GoDaddy or DigiCert) ensure to validate the user's and organization's identity and also have the authority to revoke the certificate immediately upon any risk or misuse.

[Notation](https://github.com/notaryproject/notation) is an open source supply chain tool developed by [Notary Project](https://notaryproject.dev/), which supports signing and verifying container images and other artifacts. The Azure Key Vault (AKV) is used to store a signing certificate that can be utilized by Notation with the [Notation AKV plugin (azure-kv)](https://github.com/Azure/notation-azure-kv) to sign and verify container images and other artifacts. The Azure Container Registry (ACR) allows you to attach these signatures to the signed image.

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

In this article:

> [!div class="checklist"]

> * Install the notation CLI and AKV plugin
> * Create or import a certificate issued by a CA in AKV
> * Build and push a container image using ACR task
> * Sign a container image using Notation CLI and AKV plugin 
> * Verify a container image signature using Notation CLI

## Prerequisites

> * Create or use an [Azure Container Registry](../container-registry/container-registry-get-started-azure-cli.md) for storing container images and signatures
> * Create or use an [Azure Key Vault.](../key-vault/general/quick-create-cli.md)
> * Install and configure the latest [Azure CLI](/cli/azure/install-azure-cli), or Run commands in the [Azure Cloud Shell](https://portal.azure.com/#cloudshell/)

> [!NOTE]
> We recommend creating a new Azure Key Vault for storing signing certificates only.

## Install the notation CLI and AKV plugin

1. Install `Notation v1.0.0` on a Linux environment. Follow the [Notation installation guide](https://notaryproject.dev/docs/installation/cli/) to download the package for other environments.

    ```bash
    # Download, extract and install
    curl -Lo notation.tar.gz https://github.com/notaryproject/notation/releases/download/v1.0.0/notation_1.0.0_linux_amd64.tar.gz
                    
    # Copy the notation cli to the desired bin directory in your PATH
    cp ./notation /usr/local/bin
    ```

2. Install the notation Azure Key Vault plugin on a Linux environment for remote signing. You can also download the package for other environments by following the [Notation AKV plugin installation guide](https://github.com/Azure/notation-azure-kv#installation-the-akv-plugin).

    ```bash
    # Create a directory for the plugin
    mkdir -p ~/.config/notation/plugins/azure-kv
                    
    # Download the plugin
    curl -Lo notation-azure-kv.tar.gz \https://github.com/Azure/notation-azure-kv/releases/download/v1.0.0/notation-azure-kv_1.0.0_linux_amd64.tar.gz 
                    
    # Extract to the plugin directory
    tar xvzf notation-azure-kv.tar.gz -C ~/.config/notation/plugins/azure-kv
    ```

> [!NOTE]
> The plugin directory varies depending upon the operating system in use. The directory path assumes Ubuntu. For more information, see [Notation directory structure for system configuration.](https://notaryproject.dev/docs/concepts/directory-structure/)

3. List the available plugins.
    
    ```bash
    notation plugin ls
    ```

## Configure environment variables 

> [!NOTE]
> We recommend to provide values for the Azure resources to match the existing ACR and AKV resources for easy execution of commands in the tutorial.

1. Configure AKV resource names. 

    ```bash
    # Name of the existing Azure Key Vault used to store the signing keys 
    AKV_NAME=myakv 
    
    # New desired key name used to sign and verify 
    CERT_NAME=wabbit-networks-io 
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
    IMAGE=$REGISTRY/${REPO}:$TAG 
    # Source code directory containing Dockerfile to build 
    IMAGE_SOURCE=https://github.com/wabbit-networks/net-monitor.git#main  
    ```

## Sign in with Azure CLI

```azure-cli
az login
```

To learn more about Azure CLI and how to sign in with it, see [Sign in with Azure CLI](https://learn.microsoft.com/en-us/cli/azure/authenticate-azure-cli).


## Create or import a certificate issued by a CA in AKV

### Assign access policy in AKV (Azure CLI)

To create or import a certificate issued by a CA in AKV, you must assign proper access policy to a principal. The permissions that you grant for a principal should include at least certificate permissions `Create`, `Import` and `Get`. A principal can be a user principal, service principal, or managed identity. In this tutorial, we assign access policy to a user principal for creating or importing a certificate. To learn more about assigning policy to a principal, see [Assign Access Policy](/azure/key-vault/general/assign-access-policy).

Set the subscription that contains the AKV resources

```azure-cli
az account set --subscription <your_subscription_id>
```

Assign access policy to the signed-in user

```azure-cli
USER_ID=$(az ad signed-in-user show --query id -o tsv)
az keyvault set-policy -n $AKV_NAME --certificate-permissions create import get --object-id $USER_ID
```

### Certificate requirements

The certificate issued by a CA should meet the [Notary Project certificate requirement](https://github.com/notaryproject/specifications/blob/v1.0.0/specs/signature-specification.md#certificate-requirements). 

The private key associated with the certificate should be set to non-exportable, see [Key property](https://learn.microsoft.com/en-us/rest/api/keyvault/certificates/create-certificate/create-certificate?tabs=HTTP#keyproperties).

### Create a certificate issued by a CA (Azure CLI)

1. Create a certificate policy file

    Once the certificate policy file is executed as below, it creates a valid signing certificate compatible with [Certificate Requirement](#certificate-requirements) in AKV. 

    - The Key property `exportable` is set to false
    - The x509 certificate property `ekus` has a value "1.3.6.1.5.5.7.3.3" for code-signing
    - The x509 certificate property `keyUsage` is set to "digitalSignature"
    - The `subject` field is used later as trust identity that user trusts during verification.

    ```bash
    cat <<EOF > ./leafcert.json
    {
        "issuerParameters": {
        "certificateTransparency": null,
        "name": "Unknown"
        },
        "keyProperties": {
          "exportable": false,
          "keySize": 2048,
          "keyType": "RSA",
          "reuseKey": true
        },
        "x509CertificateProperties": {
        "ekus": [
            "1.3.6.1.5.5.7.3.3"
        ],
        "keyUsage": [
            "digitalSignature"
        ],
        "subject": "$CERT_SUBJECT",
        "validityInMonths": 12
        }
    }
    EOF
    ```

2. Create the leaf/signing certificate

```azure-cli
az keyvault certificate create -n $CERT_NAME --vault-name $AKV_NAME -p @leafcert.json
```

3. Get the CSR

4. Sign the CSR

5. Merge certificate with an entire chain



To learn more about creating certificates, see [Create Certificates](../key-vault/certificates/create-certificate.md). 

To learn more about importing certificates, see [Import Certificates](../key-vault/certificates/tutorial-import-certificate.md).

> [!NOTE]
> If the certificate doesn’t contain certificate chain after creation or importing, users need to ask the CA vendor to provide the intermediate and root certificates in a bundle file, and use it during signing. 

## Build and sign a container image 

1. Build and push a new image with ACR Tasks. 

    ```azurecli-interactive
    az acr build -r $ACR_NAME -t $IMAGE $IMAGE_SOURCE 
    ```

2. Authenticate with your individual Azure AD identity to use an ACR token. 

    ```azurecli-interactive
    export USER_NAME="00000000-0000-0000-0000-000000000000" 
    export PASSWORD=$(az acr login --name $ACR_NAME --expose-token --output tsv --query accessToken) 
    notation login -u $USER_NAME -p $PASSWORD $REGISTRY 
    ```
 
    > [!NOTE]
    > If notation login is failing, you may need to Configure a credentials store. Alternatively in development and testing environments, you can use environment variables to authenticate to an OCI-compliant registry. See guide [Authenticate with OCI-compliant registries](https://notaryproject.dev/docs/how-to/registry-authentication/) for details.

3. Authorize access to AKV 

    >* To sign a container image with a certificate issued by CA with certificate chain, users must have authorized access to AKV with `Sign` permission under key permission group, `Get` permission under both secret permission and certificate permission group, see [guide](/azure/key-vault/general/assign-access-policy?source=recommendations&tabs=azure-portal) for access authorization.  

4. Get the Key ID for the certificate. 

    ```azurecli-interactive
    KEY_ID=$(az keyvault certificate show -n $CERT_NAME --vault-name $AKV_NAME --query 'kid' -o tsv) 
    ```

5. Sign the container image with the COSE signature format using the key ID. 

    ```azurecli-interactive
    notation sign --signature-format cose $IMAGE –id $KEY_ID --plugin azure-kv 
    ```

7. View the graph of signed images and associated signatures. 

    ```azurecli-interactive
    notation ls $IMAGE 
    ```

>* To sign a container image with a certificate issued by CA without certificate chain, users must have authorized access to AKV with `Sign` permission under key permission group, and `Get` permission under certificate permission group, see [guide](/azure/key-vault/general/assign-access-policy?source=recommendations&tabs=azure-portal) for access authorization.  

6. If the certificate doesn’t contain certificate chain, users need to use additional plugin config ca_certs to pass the CA bundle fire acquired from the CA vendor. 

    ```azurecli-interactive
    notation sign --signature-format cose $IMAGE –id $KEY_ID --plugin azure-kv --plugin-config ca_certs=<ca_bundle_file> 
    ```

## Verify a container image using Notation CLI 

1. Add root certificate to a named trust store for signature verification. Users need to acquire the root certificate from CA vendor, and assuming the root certificate file is stored in $ROOT_CERT. 

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

   Trust policies allow users to specify fine-tuned verification policies. Use the following command to configure trust policy. Upon successful execution of the command, one trust policy named `wabbit-networks-images` is created. This trust policy applies to all the artifacts stored in repositories defined in `$REGISTRY/$REPO`. The trust identity that user trusts has the x509 subject `$CERT_SUBJECT` from previous step, and stored under trust store named `$STORE_NAME` of type `$STORE_TYPE`. See [Trust store and trust policy specification](https://github.com/notaryproject/notaryproject/blob/main/specs/trust-store-trust-policy.md) for details.

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

## Next steps

[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/