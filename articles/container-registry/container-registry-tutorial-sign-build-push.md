---
title: Build, Sign and Verify a container image using notation and certificate in Azure Key Vault
description: In this tutorial you'll learn to create a signing certificate, build a container image, remote sign image with notation and Azure Key Vault, and then verify the container image using the Azure Container Registry.
author: dtzar
ms.author: davete
ms.service: container-registry
ms.topic: how-to
ms.date: 05/08/2022
---

# Build, sign, and verify container images using Notary and Azure Key Vault (AKV)

The Azure Key Vault (AKV) is used to store a signing key that can be utilized by **notation** with the notation AKV plugin (azure-kv) to sign and verify container images and other artifacts. The Azure Container Registry (ACR) allows you to attach these signatures using the **az** or **oras** CLI commands.

The signed containers enable users to assure deployments are built from a trusted entity and verify artifact remains unmodified and hasn't been tampered with since their creation. The signed artifact ensures integrity and authenticity before the user pulls an artifact into any environment and avoid attacks.


In this tutorial:

> [!div class="checklist"]
> * Store a signing certificate in Azure Key Vault
> * Sign a container image with notation
> * Verify a container image signature with notation

## Prerequisites

> * Install, create and sign in to [ORAS artifact enabled registry](/articles/container-registry/container-registry-oras-artifacts#sign-in-with-oras-1)
> * Install the [notation CLI and Azure Key Vault plugin](#install-the-notation-cli-and-akv-plugin)
> * Create or use an [Azure Key Vault](/azure/key-vault/general/quick-create-cli)
>*  This tutorial can be run in the [Azure Cloud Shell](https://portal.azure.com/#cloudshell/)

## Install the notation CLI and AKV plugin

> [!NOTE]
> The tutorial uses early released versions of notation and notation plugins.  

1. Install notation with plugin support from the [release version](https://github.com/notaryproject/notation/releases/tag/feat-kv-extensibility)

    ```bash
    # Choose a binary
    timestamp=20220121081115
    commit=17c7607
    # Download, extract and install
    curl -Lo notation.tar.gz https://github.com/notaryproject/notation/releases/download/feat-kv-extensibility/notation-feat-kv-extensibility-$timestamp-$commit.tar.gz
    tar xvzf notation.tar.gz
    tar xvzf notation_0.0.0-SNAPSHOT-${commit}_linux_amd64.tar.gz -C ~/bin notation
        
    # Copy the notation cli to the desired bin directory in your PATH
    cp ~/bin/notation /usr/local/bin
    ```

2. Install the notation-azure-kv plugin for remote signing and verification

    ```bash
    # Create a directory for the plugin
    mkdir -p ~/.config/notation/plugins/azure-kv
    
    # Download the plugin
    curl -Lo notation-azure-kv.tar.gz \
        https://github.com/Azure/notation-azure-kv/releases/download/v0.1.0-alpha.1/notation-azure-kv_0.1.0-alpha.1_Linux_amd64.tar.gz
    
    # Extract to the plugin directory    
    tar xvzf notation-azure-kv.tar.gz -C ~/.config/notation/plugins/azure-kv notation-azure-kv
    ```

3. Configure the AKV plugin (azure-kv) for notation

    ```bash
    notation plugin add azure-kv ~/.config/notation/plugins/azure-kv/notation-azure-kv
    ```

4. List the available plugins and verify that the plugin is available

    ```bash
    notation plugin ls
    ```

## Configure environment variables

> [!NOTE]
> For easy execution of commands in the tutorial, Provide values for the Azure resources to match the existing ACR and AKV resources.

1. Configure AKV resource names

    ```bash
    # Name of the existing AKV Resource Group
    AKV_RG=myResourceGroup
    # Name of the existing Azure Key Vault used to store the signing keys
    AKV_NAME=<your-unique-keyvault-name>
    # New desired key name used to sign and verify
    KEY_NAME=wabbit-networks-io
    KEY_SUBJECT_NAME=wabbit-networks.io
    ```

2. Configure ACR and image resource names

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

## Create a service principal and assign permissions to the key

1. Create a service principal

    ```bash
    # Service Principal Name
    SP_NAME=https://${AKV_NAME}-sp
    # Create the service principal, capturing the password
    export AZURE_CLIENT_SECRET=$(az ad sp create-for-rbac --skip-assignment --name $SP_NAME --query "password" --output tsv)
    # Capture the service principal appId
    export AZURE_CLIENT_ID=$(az ad sp list --display-name $SP_NAME --query "[].appId" --output tsv)
    # Capture the Azure Tenant ID
    export AZURE_TENANT_ID=$(az account show --query "tenantId" -o tsv)
    ```

2. Assign key and certificate permissions to the service principal object ID

    ```azure-cli
    az keyvault set-policy --name $AKV_NAME --key-permissions get sign --spn $AZURE_CLIENT_ID
    az keyvault set-policy --name $AKV_NAME --certificate-permissions get --spn $AZURE_CLIENT_ID

## Store the signing certificate in AKV

If you have an existing certificate, upload to AKV and skip to [Create a service principal and assign permissions to the key.](#create-a-service-principal-and-assign-permissions-to-the-key)
Otherwise, create or provide an x509 signing certificate, storing it in AKV for remote signing.

### Create a self-signed certificate (Azure CLI)

1. Create a certificate policy file

    Once the certificate policy file is executed as below, it creates a valid signing certificate compatible with **notation** in AKV. For more information on how to use your own signing key, see the [signing certificate requirements.](https://github.com/notaryproject/notaryproject/blob/main/signature-specification.md#certificate-requirements)

    ```bash
    cat <<EOF > ./my_policy.json
    {
        "issuerParameters": {
        "certificateTransparency": null,
        "name": "Self"
        },
        "x509CertificateProperties": {
        "ekus": [
            "1.3.6.1.5.5.7.3.1",
            "1.3.6.1.5.5.7.3.2",
            "1.3.6.1.5.5.7.3.3"
        ],
        "subject": "CN=${KEY_SUBJECT_NAME}",
        "validityInMonths": 12
        }
    }
    EOF
    ```

1. Create the certificate

    ```azure-cli
    az keyvault certificate create -n $KEY_NAME --vault-name $AKV_NAME -p @my_policy.json
    ```

1. Get the Key ID for the certificate

    ```bash
    KEY_ID=$(az keyvault certificate show -n $KEY_NAME --vault-name $AKV_NAME --query 'id' -otsv)
    ```
4. Download public certificate

    ```bash
    az keyvault certificate download --file $CERT_PATH --id $KEY_ID --encoding PEM
    ```

5. Add the Key Id to the keys and certs

    ```bash
    notation key add --name $KEY_NAME --plugin azure-kv --id $KEY_ID
    notation cert add --name $KEY_NAME $CERT_PATH
    ```

6. List the keys and certs to confirm

    ```bash
    notation key ls
    notation cert ls
    ```

## Build and sign a container image

1. Build and push a new image with ACR Tasks

    ```azure-cli
    az acr build -r $ACR_NAME -t $IMAGE $IMAGE_SOURCE
    ```

2. Authenticate with your individual Azure AD identity to use an AD token

    ```azure-cli
    export USER_NAME="00000000-0000-0000-0000-000000000000"
    export PASSWORD=$(az acr login --name $ACR_NAME --expose-token --output tsv --query accessToken)
    export NOTATION_USERNAME=$USER_NAME
    export NOTATION_PASSWORD=$PASSWORD
    ```

3. Sign the container image

    ```bash
    notation sign --key $KEY_NAME $IMAGE
    ```

## View the graph of artifacts with the ORAS CLI

ACR support for ORAS Artifacts creates a linked graph of supply chain artifacts that can be viewed through the ORAS CLI or the Azure CLI

1. Signed images can be view with the ORAS CLI

    ```azure-cli
    oras login -u $USER_NAME -p $PASSWORD $REGISTRY
    oras discover -o tree $IMAGE
    ```

## View the graph of artifacts with the Azure CLI

1. List the manifest details for the container image

    ```azure-cli
    az acr manifest show-metadata $IMAGE -o jsonc
    ```

2.  Generates a result, showing the `digest` which represents the notary v2 signature.

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

```azure-cli
notation verify $IMAGE
sha256:effba96d9b7092a0de4fa6710f6e73bf8c838e4fbd536e95de94915777b18613
```

## Next steps

[Enforce policy to only deploy signed container images to Azure Kubernetes Service (AKS) utilizing **ratify** and **gatekeeper**.](https://github.com/Azure/notation-azure-kv/blob/main/docs/nv2-sign-verify-aks.md)