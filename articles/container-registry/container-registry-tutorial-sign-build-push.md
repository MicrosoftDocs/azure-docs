---
title: Build, Sign and Verify a container image using notation and certificate in Azure Key Vault
description: In this tutorial you'll learn to create a signing certificate, build a container image, remote sign image with notation and Azure Key Vault, and then verify the container image using the Azure Container Registry.
author: dtzar
ms.author: davete
ms.service: container-registry
ms.topic: how-to
ms.date: 10/11/2022
---

# Build, sign, and verify container images using Notary and Azure Key Vault (Preview)

The Azure Key Vault (AKV) is used to store a signing key that can be utilized by **notation** with the notation AKV plugin (azure-kv) to sign and verify container images and other artifacts. The Azure Container Registry (ACR) allows you to attach these signatures using the **az** or **oras** CLI commands.

The signed containers enable users to assure deployments are built from a trusted entity and verify artifact hasn't been tampered with since their creation. The signed artifact ensures integrity and authenticity before the user pulls an artifact into any environment and avoid attacks.


In this tutorial:

> [!div class="checklist"]
> * Store a signing certificate in Azure Key Vault
> * Sign a container image with notation
> * Verify a container image signature with notation

## Prerequisites

> * Install, create and sign in to [ORAS artifact enabled registry](./container-registry-oras-artifacts.md#create-oras-artifact-enabled-registry)
> * Create or use an [Azure Key Vault](../key-vault/general/quick-create-cli.md)
>*  This tutorial can be run in the [Azure Cloud Shell](https://portal.azure.com/#cloudshell/)

## Install the notation CLI and AKV plugin

> [!NOTE]
> The tutorial uses early released versions of notation and notation plugins.  

1. Install notation 0.11.0-alpha.4 with plugin support on a Linux environment. You can also download the package for other environments from the [release page](https://github.com/notaryproject/notation/releases/tag/v0.11.0-alpha.4).

    ```bash
    # Download, extract and install
    curl -Lo notation.tar.gz https://github.com/notaryproject/notation/releases/download/v0.11.0-alpha.4/notation_0.11.0-alpha.4_linux_amd64.tar.gz
    tar xvzf notation.tar.gz
            
    # Copy the notation cli to the desired bin directory in your PATH
    cp ./notation /usr/local/bin
    ```

2. Install the notation Azure Key Vault plugin for remote signing and verification.

    > [!NOTE]
    > The plugin directory varies depending upon the operating system being used.  The directory path below assumes Ubuntu.
    > Please read the [notation config article](https://github.com/notaryproject/notation/blob/main/specs/notation-config.md) for more information.
    
    ```bash
    # Create a directory for the plugin
    mkdir -p ~/.config/notation/plugins/azure-kv
    
    # Download the plugin
    curl -Lo notation-azure-kv.tar.gz \
        https://github.com/Azure/notation-azure-kv/releases/download/v0.4.0-alpha.4/notation-azure-kv_0.4.0-alpha.4_Linux_amd64.tar.gz
    
    # Extract to the plugin directory
    tar xvzf notation-azure-kv.tar.gz -C ~/.config/notation/plugins/azure-kv notation-azure-kv
    ```

3. List the available plugins and verify that the plugin is available.

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
    KEY_SUBJECT_NAME=wabbit-networks.io
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

If you have an existing certificate, upload it to AKV. For more information on how to use your own signing key, see the [signing certificate requirements.](https://github.com/notaryproject/notaryproject/blob/main/signature-specification.md#certificate-requirements)
Otherwise create an x509 self-signed certificate storing it in AKV for remote signing using the steps below.

### Create a self-signed certificate (Azure CLI)

1. Create a certificate policy file.

    Once the certificate policy file is executed as below, it creates a valid signing certificate compatible with **notation** in AKV. The EKU listed is for code-signing, but isn't required for notation to sign artifacts.

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
        "subject": "CN=${KEY_SUBJECT_NAME}",
        "validityInMonths": 12
        }
    }
    EOF
    ```

1. Create the certificate.

    ```azure-cli
    az keyvault certificate create -n $KEY_NAME --vault-name $AKV_NAME -p @my_policy.json
    ```

1. Get the Key ID for the certificate.

    ```bash
    KEY_ID=$(az keyvault certificate show -n $KEY_NAME --vault-name $AKV_NAME --query 'kid' -o tsv)
    ```
4. Download public certificate.

    ```bash
    CERT_ID=$(az keyvault certificate show -n $KEY_NAME --vault-name $AKV_NAME --query 'id' -o tsv)
    az keyvault certificate download --file $CERT_PATH --id $CERT_ID --encoding PEM
    ```

5. Add the Key ID to the keys and certs.

    ```bash
    notation key add --name $KEY_NAME --plugin azure-kv --id $KEY_ID
    notation cert add --name $KEY_NAME $CERT_PATH
    ```

6. List the keys and certs to confirm.

    ```bash
    notation key ls
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
    export NOTATION_PASSWORD=$PASSWORD
    ```

3. Choose [COSE](https://datatracker.ietf.org/doc/html/rfc8152) or JWS signature envelope to sign the container image.

   - Sign the container image with the COSE signature envelope:
 
    ```bash
    notation sign --envelope-type cose --key $KEY_NAME $IMAGE
    ```
    
   - Sign the container image with the default JWS signature envelope:
   
    ```bash
    notation sign --key $KEY_NAME $IMAGE
    ```
    
## View the graph of artifacts with the ORAS CLI

ACR support for ORAS artifacts enables a linked graph of supply chain artifacts that can be viewed through the ORAS CLI or the Azure CLI.

1. Signed images can be view with the ORAS CLI.

    ```bash
    oras login -u $USER_NAME -p $PASSWORD $REGISTRY
    oras discover -o tree $IMAGE
    ```

## View the graph of artifacts with the Azure CLI

1. List the manifest details for the container image.

    ```azure-cli
    az acr manifest show-metadata $IMAGE -o jsonc
    ```

2.  Generates a result, showing the `digest` representing the notary v2 signature.

    ```json
    {
      "changeableAttributes": {
        "deleteEnabled": true,
        "listEnabled": true,
        "readEnabled": true,
        "writeEnabled": true
      },
      "createdTime": "2022-05-13T23:15:54.3478293Z",
      "digest": "sha256:effba96d9b7092a0de4fa6710f6e73bf8c838e4fbd536e95de94915777b18613",
      "lastUpdateTime": "2022-05-13T23:15:54.3478293Z",
      "name": "v1",
      "quarantineState": "Passed",
      "signed": false
    }
    ```

## Verify the container image

1. The notation command can also help to ensure the container image hasn't been tampered with since build time by comparing the `sha` with what is in the registry.

```bash
notation verify $IMAGE
sha256:effba96d9b7092a0de4fa6710f6e73bf8c838e4fbd536e95de94915777b18613
```
The sha256 result is a successful verification of the image using the trusted certificate.

2. We can add a different local signing certificate to show how multiple certificates and verification failures work.

```bash
notation cert generate-test -n localcert --trust true
notation verify $IMAGE
sha256:effba96d9b7092a0de4fa6710f6e73bf8c838e4fbd536e95de94915777b18613
```

We can see that verification still passes because `notation verify` will implicitly pass with _any_ certificate in its trust store.  To get a verification failure, we'll remove the certificate utilized to sign the image.

```azure-cli
notation cert rm $KEY_NAME
notation verify $IMAGE
2022/06/10 11:24:30 verification failure: x509: certificate signed by unknown authority
```

## Next steps

See [Enforce policy to only deploy signed container images to Azure Kubernetes Service (AKS) utilizing **ratify** and **gatekeeper**.](https://github.com/Azure/notation-azure-kv/blob/main/docs/nv2-sign-verify-aks.md)
