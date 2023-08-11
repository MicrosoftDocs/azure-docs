---
title: Build, Sign and Verify a container image using notation and certificate in Azure Key Vault
description: In this tutorial you'll learn to create a signing certificate, build a container image, remote sign image with notation and Azure Key Vault, and then verify the container image using the Azure Container Registry.
author: feynmanzhou
ms.author: davete
ms.service: container-registry
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 4/23/2023
---

# Build, sign, and verify container images using Notary and Azure Key Vault (Preview)

The Azure Key Vault (AKV) is used to store a signing key that can be utilized by [notation](http://notaryproject.dev/) with the notation AKV plugin (azure-kv) to sign and verify container images and other artifacts. The Azure Container Registry (ACR) allows you to attach these signatures using the **az** or **oras** CLI commands.

The signed image enables users to assure deployments are built from a trusted entity and verify artifact hasn't been tampered with since their creation. The signed artifact ensures integrity and authenticity before the user pulls an artifact into any environment and avoid attacks.


In this tutorial:

> [!div class="checklist"]
> * Store a signing certificate in Azure Key Vault
> * Sign a container image with notation
> * Verify a container image signature with notation

## Prerequisites

> * Create and sign in ACR with OCI artifact enabled
> * Create or use an [Azure Key Vault](../key-vault/general/quick-create-cli.md)
>*  This tutorial can be run in the [Azure Cloud Shell](https://portal.azure.com/#cloudshell/)

## Install the notation CLI and AKV plugin

1. Install notation v1.0.0-rc.7 on a Linux environment. You can also download the package for other environments by following the [Notation installation guide](https://notaryproject.dev/docs/installation/cli/).

    ```bash
    # Download, extract and install
    curl -Lo notation.tar.gz https://github.com/notaryproject/notation/releases/download/v1.0.0-rc.7/notation_1.0.0-rc.7_linux_amd64.tar.gz
    tar xvzf notation.tar.gz
            
    # Copy the notation cli to the desired bin directory in your PATH
    cp ./notation /usr/local/bin
    ```

2. Install the notation Azure Key Vault plugin on a Linux environment for remote signing and verification. You can also download the package for other environments by following the [Notation AKV plugin installation guide](https://github.com/Azure/notation-azure-kv#installation-the-akv-plugin).

    > [!NOTE]
    > The plugin directory varies depending upon the operating system being used. The directory path below assumes Ubuntu. Please read the [Notation directory structure for system configuration](https://notaryproject.dev/docs/concepts/directory-structure/) for more information.
    
    ```bash
    # Create a directory for the plugin
    mkdir -p ~/.config/notation/plugins/azure-kv
    
    # Download the plugin
    curl -Lo notation-azure-kv.tar.gz \
        https://github.com/Azure/notation-azure-kv/releases/download/v1.0.0-rc.2/notation-azure-kv_1.0.0-rc.2_linux_amd64.tar.gz 
    
    # Extract to the plugin directory
    tar xvzf notation-azure-kv.tar.gz -C ~/.config/notation/plugins/azure-kv notation-azure-kv
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
    AKV_NAME=<your-unique-keyvault-name>
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

## Store the signing certificate in AKV

If you have an existing certificate, upload it to AKV. For more information on how to use your own signing key, see the [signing certificate requirements.](https://github.com/Azure/notation-azure-kv/blob/release-0.6/docs/ca-signed-workflow.md)
Otherwise create an x509 self-signed certificate storing it in AKV for remote signing using the steps below.

### Create a self-signed certificate (Azure CLI)

1. Create a certificate policy file.

    Once the certificate policy file is executed as below, it creates a valid signing certificate compatible with **notation** in AKV. The EKU listed is for code-signing, but isn't required for notation to sign artifacts. The subject is used later as trust identity that user trust during verification.

    ```bash
    cat <<EOF > ./my_policy.json
    {
        "issuerParameters": {
        "certificateTransparency": null,
        "name": "Self"
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

3. Get the Key ID for the certificate.

    ```bash
    KEY_ID=$(az keyvault certificate show -n $KEY_NAME --vault-name $AKV_NAME --query 'kid' -o tsv)
    ```
    
4. Download public certificate.

    ```bash
    CERT_ID=$(az keyvault certificate show -n $KEY_NAME --vault-name $AKV_NAME --query 'id' -o tsv)
    az keyvault certificate download --file $CERT_PATH --id $CERT_ID --encoding PEM
    ```

5. Add a signing key referencing the key ID.

    ```bash
    notation key add $KEY_NAME --plugin azure-kv --id $KEY_ID
    ```

6. List the keys to confirm.

   ```bash
   notation key ls
   ```

7. Add the downloaded public certificate to named trust store for signature verification.

   ```bash
   STORE_TYPE="ca"
   STORE_NAME="wabbit-networks.io"
   notation cert add --type $STORE_TYPE --store $STORE_NAME $CERT_PATH
   ```
    
8. List the certificate to confirm.

   ```bash
   notation cert ls
   ```

## Build and sign a container image

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
> Currently, `notation` relies on [Docker Credential Store](https://docs.docker.com/engine/reference/commandline/login/#credentials-store) for authentication. Notation requires additional configuration on Linux. If `notation login` is failing, you can configure the Docker Credential Store or Notation environment variables by following the guide [Authenticate with OCI-compliant registries](https://notaryproject.dev/docs/how-to/registry-authentication/).

3. Sign the container image with the [COSE](https://datatracker.ietf.org/doc/html/rfc8152) signature format using the signing key added in previous step.
 
    ```bash
    notation sign --signature-format cose --key $KEY_NAME $IMAGE
    ```
    
4. View the graph of signed images and associated signatures.

   ```bash
   notation ls $IMAGE
   ```

## Verify the container image

1. Configure trust policy before verification.

   The trust policy is a JSON document named `trustpolicy.json`, which is stored under the notation configuration directory. Users who verify signed artifacts from a registry use the trust policy to specify trusted identities that sign the artifacts, and the level of signature verification to use.

   Use the following command to configure trust policy. Upon successful execution of the command, one trust policy named `wabbit-networks-images` is created. This trust policy applies to all the artifacts stored in repositories defined in `$REGISTRY/$REPO`. The trust identity that user trusts has the x509 subject `$CERT_SUBJECT` from previous step, and stored under trust store named `$STORE_NAME` of type `$STORE_TYPE`. See [Trust store and trust policy specification](https://github.com/notaryproject/notaryproject/blob/main/specs/trust-store-trust-policy.md) for details.

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

3. Use `notation policy` to import the trust policy configuration from a JSON file that we created previously. 

    ```bash
    notation policy import ./trustpolicy.json
    notation policy show
    ```
    
4. The notation command can also help to ensure the container image hasn't been tampered with since build time by comparing the `sha` with what is in the registry.

    ```bash
    notation verify $IMAGE
    ```
   Upon successful verification of the image using the trust policy, the sha256 digest of the verified image is returned in a successful output message.
