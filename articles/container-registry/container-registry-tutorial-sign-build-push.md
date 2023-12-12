---
title: Sign container images with Notation and Azure Key Vault using a self-signed certificate (Preview)
description: In this tutorial you'll learn to create a self-signed certificate in Azure Key Vault (AKV), build and sign a container image stored in Azure Container Registry (ACR) with notation and AKV, and then verify the container image with notation.
author: yizha1
ms.author: yizha1
ms.service: container-registry
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 4/23/2023
---

# Sign container images with Notation and Azure Key Vault using a self-signed certificate (Preview)

Signing container images is a process that ensures their authenticity and integrity. This is achieved by adding a digital signature to the container image, which can be validated during deployment. The signature helps to verify that the image is from a trusted publisher and has not been modified. [Notation](https://github.com/notaryproject/notation) is an open source supply chain tool developed by the [Notary Project](https://notaryproject.dev/), which supports signing and verifying container images and other artifacts. The Azure Key Vault (AKV) is used to store certificates with signing keys that can be used by Notation with the Notation AKV plugin (azure-kv) to sign and verify container images and other artifacts. The Azure Container Registry (ACR) allows you to attach signatures to container images and other artifacts as well as view those signatures.

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

In this tutorial:

> [!div class="checklist"]
> * Install Notation CLI and AKV plugin
> * Create a self-signed certificate in AKV
> * Build and push a container image with [ACR Tasks](container-registry-tasks-overview.md)
> * Sign a container image with Notation CLI and AKV plugin
> * Validate a container image against the signature with Notation CLI

## Prerequisites

* Create or use an [Azure Container Registry](../container-registry/container-registry-get-started-azure-cli.md) for storing container images and signatures
* Create or use an [Azure Key Vault](../key-vault/general/quick-create-cli.md) for managing certificates
* Install and configure the latest [Azure CLI](/cli/azure/install-azure-cli), or Run commands in the [Azure Cloud Shell](https://portal.azure.com/#cloudshell/)

## Install Notation CLI and AKV plugin

1. Install Notation v1.0.1 on a Linux amd64 environment. You can also download the package for other environments by following the [Notation installation guide](https://notaryproject.dev/docs/user-guides/installation/).

    ```bash
    # Download, extract and install
    curl -Lo notation.tar.gz https://github.com/notaryproject/notation/releases/download/v1.0.1/notation_1.0.1_linux_amd64.tar.gz
    tar xvzf notation.tar.gz
            
    # Copy the Notation binary to the desired bin directory in your $PATH, for example
    cp ./notation /usr/local/bin
    ```

2. Install the Notation Azure Key Vault plugin on a Linux amd64 environment. You can also download the package for other environments by following the [Notation AKV plugin installation guide](https://github.com/Azure/notation-azure-kv#installation-the-akv-plugin).

    > [!NOTE]
    > The plugin directory varies depending upon the operating system being used. The directory path below assumes Ubuntu. Please read the [Notation directory structure for system configuration](https://notaryproject.dev/docs/user-guides/how-to/directory-structure/) for more information.
    
    ```bash
    # Create a directory for the plugin
    mkdir -p ~/.config/notation/plugins/azure-kv
    
    # Download the plugin
    curl -Lo notation-azure-kv.tar.gz \
        https://github.com/Azure/notation-azure-kv/releases/download/v1.0.1/notation-azure-kv_1.0.1_linux_amd64.tar.gz 
    
    # Extract to the plugin directory
    tar xvzf notation-azure-kv.tar.gz -C ~/.config/notation/plugins/azure-kv
    ```

3. List the available plugins.

    ```bash
    notation plugin ls
    ```

## Configure environment variables

> [!NOTE]
> For easy execution of commands in the tutorial, provide values for the Azure resources to match the existing ACR and AKV resources.

1. Configure AKV resource names.

    ```bash
    # Name of the existing AKV used to store the signing keys
    AKV_NAME=myakv
    # Name of the certificate created in AKV
    CERT_NAME=wabbit-networks-io
    CERT_SUBJECT="CN=wabbit-networks.io,O=Notation,L=Seattle,ST=WA,C=US"
    CERT_PATH=./${CERT_NAME}.pem
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

```bash
az login
```

To learn more about Azure CLI and how to sign in with it, see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

## Assign access policy in AKV (Azure CLI)

A user principal with the correct access policy permissions is needed to create a self-signed certificate and sign artifacts. This principal can be a user principal, service principal, or managed identity. At a minimum, this principal needs the following permissions:

- `Create` permissions for certificates
- `Get` permissions for certificates
- `Sign` permissions for keys

In this tutorial, the access policy is assigned to a signed-in Azure user. To learn more about assigning policy to a principal, see [Assign Access Policy](/azure/key-vault/general/assign-access-policy).

### Set the subscription that contains the AKV resource

```bash
az account set --subscription <your_subscription_id>
```

### Set the access policy in AKV

```bash
USER_ID=$(az ad signed-in-user show --query id -o tsv)
az keyvault set-policy -n $AKV_NAME --certificate-permissions create get --key-permissions sign --object-id $USER_ID
```

> [!IMPORTANT]
> This example shows the minimum permissions needed for creating a certificate and signing a container image. Depending on your requirements, you may need to grant additional permissions.

## Create a self-signed certificate in AKV (Azure CLI)

The following steps show how to create a self-signed certificate for testing purpose.

1. Create a certificate policy file.

    Once the certificate policy file is executed as below, it creates a valid certificate compatible with [Notary Project certificate requirement](https://github.com/notaryproject/specifications/blob/v1.0.0/specs/signature-specification.md#certificate-requirements) in AKV. The value for `ekus` is for code-signing, but isn't required for notation to sign artifacts. The subject is used later as trust identity that user trust during verification.

    ```bash
    cat <<EOF > ./my_policy.json
    {
        "issuerParameters": {
        "certificateTransparency": null,
        "name": "Self"
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

2. Create the certificate.

    ```bash
    az keyvault certificate create -n $CERT_NAME --vault-name $AKV_NAME -p @my_policy.json
    ```

## Sign a container image with Notation CLI and AKV plugin

1. Authenticate to your ACR by using your individual Azure identity.

    ```bash
    az acr login --name $ACR_NAME
    ```

> [!IMPORTANT]
> If you have Docker installed on your system and used `az acr login` or `docker login` to authenticate to your ACR, your credentials are already stored and available to notation. In this case, you don’t need to run `notation login` again to authenticate to your ACR. To learn more about authentication options for notation, see [Authenticate with OCI-compliant registries](https://notaryproject.dev/docs/user-guides/how-to/registry-authentication/).

2. Build and push a new image with ACR Tasks. Always use the digest value to identify the image for signing since tags are mutable and can be overwritten.

    ```bash
    DIGEST=$(az acr build -r $ACR_NAME -t $REGISTRY/${REPO}:$TAG $IMAGE_SOURCE --no-logs --query "outputImages[0].digest" -o tsv)
    IMAGE=$REGISTRY/${REPO}@$DIGEST
    ```

    In this tutorial, if the image has already been built and is stored in the registry, the tag serves as an identifier for that image for convenience.

    ```bash
    IMAGE=$REGISTRY/${REPO}@$TAG
    ```

3. Get the Key ID of the signing key. A certificate in AKV can have multiple versions, the following command gets the Key ID of the latest version.

    ```bash
    KEY_ID=$(az keyvault certificate show -n $CERT_NAME --vault-name $AKV_NAME --query 'kid' -o tsv)
    ```

4. Sign the container image with the [COSE](https://datatracker.ietf.org/doc/html/rfc9052) signature format using the signing key ID. To sign with a self-signed certificate, you need to set the plugin configuration value `self_signed=true`.

    ```bash
    notation sign --signature-format cose --id $KEY_ID --plugin azure-kv --plugin-config self_signed=true $IMAGE
    ```
    
5. View the graph of signed images and associated signatures.

   ```bash
   notation ls $IMAGE
   ```

## Verify a container image with Notation CLI

To verify the container image, add the root certificate that signs the leaf certificate to the trust store and create trust policies for verification. For the self-signed certificate used in this tutorial, the root certificate is the self-signed certificate itself.

1. Download public certificate.

    ```bash
    az keyvault certificate download --name $CERT_NAME --vault-name $AKV_NAME --file $CERT_PATH
    ```

2. Add the downloaded public certificate to named trust store for signature verification.

   ```bash
   STORE_TYPE="ca"
   STORE_NAME="wabbit-networks.io"
   notation cert add --type $STORE_TYPE --store $STORE_NAME $CERT_PATH
   ```
    
3. List the certificate to confirm.

   ```bash
   notation cert ls
   ```
 
4. Configure trust policy before verification.

   Trust policies allow users to specify fine-tuned verification policies. The following example configures a trust policy named `wabbit-networks-images`, which applies to all artifacts in `$REGISTRY/$REPO` and uses the named trust store `$STORE_NAME` of type `$STORE_TYPE`. It also assumes that the user trusts a specific identity with the X.509 subject `$CERT_SUBJECT`. For more details, see [Trust store and trust policy specification](https://github.com/notaryproject/notaryproject/blob/v1.0.0/specs/trust-store-trust-policy.md).

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

5. Use `notation policy` to import the trust policy configuration from a JSON file that we created previously. 

    ```bash
    notation policy import ./trustpolicy.json
    notation policy show
    ```
    
6. Use `notation verify` to verify the container image hasn't been altered since build time.

    ```bash
    notation verify $IMAGE
    ```

   Upon successful verification of the image using the trust policy, the sha256 digest of the verified image is returned in a successful output message.

## Next steps

See [Use Image Integrity to validate signed images before deploying them to your Azure Kubernetes Service (AKS) clusters (Preview)](/azure/aks/image-integrity?tabs=azure-cli) and [Ratify on Azure](https://ratify.dev/docs/1.0/quickstarts/ratify-on-azure/) to get started into verifying and auditing signed images before deploying them on AKS. 

[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/
