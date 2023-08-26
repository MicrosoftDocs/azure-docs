---
title: Sign container images with Notation and Azure Key Vault using self-signed certificate
description: In this tutorial you'll learn to create a signing certificate in Azure Key Vault (AKV), build and sign a container image stored in Azure Container Registry (ACR) using notation and AKV, and then verify the container image using notation.
author: yizha1
ms.author: yizha1
ms.service: container-registry
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 4/23/2023
---

# Sign container images with Notation and Azure Key Vault using self-signed certificate

When you sign container images, you ensure their authenticity and integrity. This is done by adding a digital signature to the container image, which can be validated against during deployment to ensure that they are from trusted image publishers and have not been tampered with. [Notation](https://github.com/notaryproject/notation) is an open source supply chain tool developed by [Notary Project](https://notaryproject.dev/), which supports signing and verifying container images and other artifacts. The Azure Key Vault (AKV) is used to store a signing certificate that can be utilized by Notation with the Notation AKV plugin (azure-kv) to sign and verify container images and other artifacts. The Azure Container Registry (ACR) allows you to attach and discover these signatures to container images.

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

In this tutorial:

> [!div class="checklist"]
> * Install Notation CLI and AKV plugin
> * Create a self-signed signing certificate in AKV
> * Build and push a container image using ACR task
> * Sign a container image using Notation CLI and AKV plugin
> * Validate a container image against the signature using Notation CLI

## Prerequisites

* Create or use an [Azure Container Registry](../container-registry/container-registry-get-started-azure-cli.md) for storing container images and signatures
* Create or use an [Azure Key Vault](../key-vault/general/quick-create-cli.md) for managing signing certificates
* Install and configure the latest [Azure CLI](/cli/azure/install-azure-cli), or Run commands in the [Azure Cloud Shell](https://portal.azure.com/#cloudshell/)

## Install Notation CLI and AKV plugin

1. Install Notation v1.0.0 on a Linux environment. You can also download the package for other environments by following the [Notation installation guide](https://notaryproject.dev/docs/installation/cli/).

    ```bash
    # Download, extract and install
    curl -Lo notation.tar.gz https://github.com/notaryproject/notation/releases/download/v1.0.0/notation_1.0.0_linux_amd64.tar.gz
    tar xvzf notation.tar.gz
            
    # Copy the Notation binary to the desired bin directory in your $PATH
    cp ./notation /usr/local/bin
    ```

2. Install the Notation Azure Key Vault plugin on a Linux environment. You can also download the package for other environments by following the [Notation AKV plugin installation guide](https://github.com/Azure/notation-azure-kv#installation-the-akv-plugin).

    > [!NOTE]
    > The plugin directory varies depending upon the operating system being used. The directory path below assumes Ubuntu. Please read the [Notation directory structure for system configuration](https://notaryproject.dev/docs/concepts/directory-structure/) for more information.
    
    ```bash
    # Create a directory for the plugin
    mkdir -p ~/.config/notation/plugins/azure-kv
    
    # Download the plugin
    curl -Lo notation-azure-kv.tar.gz \
        https://github.com/Azure/notation-azure-kv/releases/download/v1.0.0/notation-azure-kv_1.0.0_linux_amd64.tar.gz 
    
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
    # Name of the existing Azure Key Vault used to store the signing keys
    AKV_NAME=myakv
    # New desired key name used to sign and verify
    KEY_NAME=wabbit-networks-io
    CERT_SUBJECT="CN=wabbit-networks.io,O=Notary,L=Seattle,ST=WA,C=US"
    CERT_PATH=./${KEY_NAME}.pem
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

## Assign access policy in AKV (Azure CLI)

To create a self-signed certificate and sign a container image in AKV, you must assign proper access policy to a principal. The permissions that you grant for a principal should include at least certificate permissions `Create` and `Get` for creating and get certificates, and key permissions `Sign` for signing. A principal can be user principal, service principal or managed identity. In this tutorial, the access policy is assigned to a signed-in Azure user. To learn more about assigning policy to a principal, see [Assign Access Policy](/azure/key-vault/general/assign-access-policy).

### Set the subscription that contains the AKV resource
```azure-cli
az account set --subscription <your_subscription_id>
```

### Set the access policy in AKV
```azure-cli
USER_ID=$(az ad signed-in-user show --query id -o tsv)
az keyvault set-policy -n $AKV_NAME --certificate-permissions create get --key-permissions sign --object-id $USER_ID
```

## Create a self-signed signing certificate in AKV

If you have an existing certificate, see [import a certificate in AKV](../key-vault/certificates/tutorial-import-certificate.md). The following steps show how to create a self-signed signing certificate for testing purpose.

### Create a self-signed certificate (Azure CLI)

1. Create a certificate policy file.

    Once the certificate policy file is executed as below, it creates a valid signing certificate compatible with [Notary Project certificate requirement](https://github.com/notaryproject/specifications/blob/v1.0.0/specs/signature-specification.md#certificate-requirements) in AKV. The EKU listed is for code-signing, but isn't required for notation to sign artifacts. The subject is used later as trust identity that user trust during verification.

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

    ```azure-cli
    az keyvault certificate create -n $KEY_NAME --vault-name $AKV_NAME -p @my_policy.json
    ```

## Sign a container image using Notation CLI and AKV plugin

1. Build and push a new image with ACR Tasks.

    ```azure-cli
    az acr build -r $ACR_NAME -t $IMAGE $IMAGE_SOURCE
    ```

2. Authenticate with your individual Azure AD identity to use an ACR token. 

    ```azure-cli
    export USER_NAME="00000000-0000-0000-0000-000000000000"
    export PASSWORD=$(az acr login --name $ACR_NAME --expose-token --output tsv --query accessToken)
    notation login -u $USER_NAME -p $PASSWORD $REGISTRY
    ```

> [!NOTE]
> If notation login is failing, you may need to Configure a credentials store. Alternatively in development and testing environments, you can use environment variables to authenticate to an OCI-compliant registry. See guide [Authenticate with OCI-compliant registries](https://notaryproject.dev/docs/how-to/registry-authentication/) for details.

3. Get the Key ID of the signing key.

    ```bash
    KEY_ID=$(az keyvault certificate show -n $KEY_NAME --vault-name $AKV_NAME --query 'kid' -o tsv)
    ```

4. Sign the container image with the [COSE](https://datatracker.ietf.org/doc/html/rfc8152) signature format using the signing key id. To sign with a self-signed certificate, you need to pass a plugin configuration `self_signed=true` in the command line.

    ```bash
    notation sign --signature-format cose --id $KEY_ID --plugin azure-kv --plugin-config self_signed=true $IMAGE
    ```
    
5. View the graph of signed images and associated signatures.

   ```bash
   notation ls $IMAGE
   ```

## Verify a container image using Notation CLI

To verify the container image, you need to add the root certificate that signs the signing certificate to a trust store and create trust policies for verification. For a self-signed certificate used in this tutorial, the root certificate is the self-signed certificate itself.

1. Download public certificate.

    ```bash
    CERT_ID=$(az keyvault certificate show -n $KEY_NAME --vault-name $AKV_NAME --query 'id' -o tsv)
    az keyvault certificate download --file $CERT_PATH --id $CERT_ID --encoding PEM
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

   Trust policies allow users to specify fine-tuned verification policies. Use the following command to configure trust policy. Upon successful execution of the command, one trust policy named `wabbit-networks-images` is created. This trust policy applies to all the artifacts stored in repositories defined in `$REGISTRY/$REPO`. The trust identity that user trusts has the x509 subject `$CERT_SUBJECT` from previous step, and stored under trust store named `$STORE_NAME` of type `$STORE_TYPE`. See [Trust store and trust policy specification](https://github.com/notaryproject/notaryproject/blob/v1.0.0/specs/trust-store-trust-policy.md) for details.

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
    
6. The notation command can also help to ensure the container image hasn't been tampered with since build time by comparing the `sha` with what is in the registry.

    ```bash
    notation verify $IMAGE
    ```
   Upon successful verification of the image using the trust policy, the sha256 digest of the verified image is returned in a successful output message.

## Next steps

See [Ratify on Azure: Allow only signed images to be deployed on AKS with Notation and Ratify](https://github.com/deislabs/ratify/blob/main/docs/quickstarts/ratify-on-azure.md).

[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/