---
title: Use Image Integrity to verify image signatures on Azure Kubernetes Service (AKS) clusters
description: Learn how to use Image Integrity to verify image signatures on Azure Kubernetes Service (AKS) clusters.
author: schaffererin
ms.author: schaffererin
ms.service: azure-kubernetes-service
ms.topic: article
ms.date: 02/22/2023
---

# Use Image Integrity to verify image signatures on Azure Kubernetes Service (AKS) clusters (Preview)

Image integrity is an important part of container registry security. We want to ensure that the images we use come from trusted sources and haven't been modified since they were published. Image signing is a popular solution that allows you to add a digital fingerprint to images, which can be tested later to verify trust. There are some existing open-source tools for image signing and verification, such as [Notation](https://github.com/notaryproject/notaryproject). However, these tools don't fully cover the end-to-end scenario of signing and verifying images. The Image Integrity feature allows you to easily leverage Notation at scale through the Ratify add-on.

This article shows you how to use Image Integrity to verify image signatures on your AKS clusters.

> [!NOTE]
> Image Integrity is a feature based on [Eraser](https://learn.microsoft.com/azure/aks/image-cleaner?tabs=azure-cli). On an AKS cluster, the feature name and property name is `ImageIntegrity`, while the relevant Image Cleaner pods' names contain `Eraser`.

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* Azure CLI version x.x.x or later. Run `az --version` to find the current version. If you need to install or upgrade, see [Install Azure CLI](../../cli/azure/install-azure-cli.md).
* The Azure Policy add-on for AKS. If you don't have this add-on installed, see [Install Azure Policy add-on for AKS](../governance/policy/concepts/policy-for-kubernetes#install-azure-policy-add-on-for-aks).
* An AKS cluster enabled with OIDC Issuer. To create a new cluster or update an existing cluster, see [Configure an AKS cluster with OIDC Issuer](/cluster-configuration#oidc-issuer).
* The `EnableImageIntegrityPreview` feature flag registered on your Azure subscription. Register the feature flag using the following commands:
  
    1. Register the `EnableImageIntegrityPreview` feature flag using the [`az feature register`](https://learn.microsoft.com/cli/azure/feature?view=azure-cli-latest#az-feature-register) command.

        ```azurecli
        az feature register --namespace "Microsoft.ContainerService" --name "EnableImageIntegrityPreview"
        ```

        It may take a few minutes for the status to show as *Registered*.

    2. Verify the registration status using the [`az feature show`](https://learn.microsoft.com/cli/azure/feature?view=azure-cli-latest#az-feature-show) command.

        ```azurecli
        az feature show --namespace "Microsoft.ContainerService" --name "EnableImageIntegrityPreview"
        ```

    3. Once that status shows *Registered*, refresh the registration of the `Microsoft.ContainerService` resource provider using the [`az provider register`](https://learn.microsoft.com/cli/azure/provider?view=azure-cli-latest#az-provider-register) command.

        ```azurecli
        az provider register --namespace Microsoft.ContainerService
        ```

## Limitations

* Your AKS clusters must run Kubernetes version 1.26 or above.
* You shouldn't use this feature for production ACR registries or workloads.
* A maximum of 200 unique signatures are supported concurrently cluster-wide.
* Notation is the only supported verifier.
* Audit is the only supported verification policy effect.

## Install the notation CLI and Azure Key Vault (AKV) plugin

1. Install notation v1.0.0-rc.1 with plugin support on a Linux environment. To download for other environments, see the [Notation release page](https://github.com/notaryproject/notation/releases/tag/v1.0.0-rc.1).

    ```bash
    # Download, extract, and install
    curl -Lo notation.tar.gz https://github.com/notaryproject/notation/releases/download/v1.0.0-rc.1/notation_1.0.0-rc.1_linux_amd64.tar.gz
    tar xvzf notation.tar.gz

    # Copy the notation cli to the desired bin directory in your PATH
    cp ./notation /usr/local/bin
    ```

2. Install the notation AKV plugin for remote signing and verification.

    > [!NOTE]
    > The plugin directory varies depending on the operating system you use. The directory path used in the following command assumes Ubuntu. For more information, see the [notation config article](https://github.com/notaryproject/notaryproject.dev/blob/main/content/en/docs/how-to/directory-structure.md).

    ```bash
    # Create a directory for the plugin
    mkdir -p ~/.config/notation/plugins/azure-kv

    # Download the plugin
    curl -Lo notation-azure-kv.tar.gz \
        https://github.com/Azure/notation-azure-kv/releases/download/v0.5.0-rc.1/notation-azure-kv_0.5.0-rc.1_Linux_amd64.tar.gz

    # Extract to the plugin directory
    tar xvzf notation-azure-kv.tar.gz -C ~/.config/notation/plugins/azure-kv notation-azure-kv
    ```

3. List available notation plugins and verify the plugins are available.

    ```bash
    notation plugin ls
    ```

## Configure environment variables

For easy execution of commands in this tutorial, use the following commands to provide values for your Azure resources to match existing ACR and AKV resources.

1. Configure AKV resource names.

    ```azurecli
    # Name of the existing Azure Key Vault used to store the signing keys
    AKV_NAME=<your-unique-keyvault-name>

    # New desired key name used to sign and verify
    KEY_NAME=wabbit-networks-io
    CERT_SUBJECT="CN=wabbit-networks.io,O=Notary,L=Seattle,ST=WA,C=US"
    CERT_PATH=./${KEY_NAME}.pem
    ```

2. Configure ACR and image resource names.

    ```azurecli
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

## Store the signing certificate in Azure Key Vault

If you have an existing certificate, upload it to AKV. For more information on how to use your own signing key, see the [signing certificate requirements](https://github.com/notaryproject/notaryproject/blob/v1.0.0-rc.1/specs/signature-specification.md).

If you don't have an existing certificate, create an x509 self-signed certificate and store it in AKV for remote signing using the following steps:

### Create a self-signed certificate

1. Create a certificate policy file.
2. Create the certificate using the [`az keyvault certificate create`](https://learn.microsoft.com/cli/azure/keyvault/certificate?view=azure-cli-latest#az-keyvault-certificate-create) command.

   ```azurecli
   az keyvault certificate create -n $KEY_NAME --vault-name $AKV_NAME -p @my_policy.json
   ```

3. Get the Key ID for the certificate using the [`az keyvault certificate show`](https://learn.microsoft.com/cli/azure/keyvault/certificate?view=azure-cli-latest#az-keyvault-certificate-show) command.

    ```azurecli
    KEY_ID=$(az keyvault certificate show -n $KEY_NAME --vault-name $AKV_NAME --query 'kid' -o tsv)
    ```

4. Get the public certificate ID using the `az keyvault certificate show`](https://learn.microsoft.com/cli/azure/keyvault/certificate?view=azure-cli-latest#az-keyvault-certificate-show) command and download the certificate using the `az keyvault certificate download`](https://learn.microsoft.com/cli/azure/keyvault/certificate?view=azure-cli-latest#az-keyvault-certificate-download) command.

    ```azurecli
    # Get the public certificate ID
    CERT_ID=$(az keyvault certificate show -n $KEY_NAME --vault-name $AKV_NAME --query 'id' -o tsv)

    # Download the public certificate
    az keyvault certificate download --file $CERT_PATH --id $CERT_ID --encoding PEM
    ```

5. Add a signing key referencing the key ID and then list the keys to confirm.

    ```azurecli
    # Add a signing key
    notation key add $KEY_NAME --plugin azure-kv --id $KEY_ID

    # List the keys
    notation key ls
    ```

6. Add the downloaded public certificate to named Trust Store for signature verification.

    ```azurecli
    STORE_TYPE="ca"
    STORE_NAME="wabbit-networks.io"
    notation cert add --type $STORE_TYPE --store $STORE_NAME $CERT_PATH
    ```

7. List the certificate to confirm.

    ```azurecli
    notation cert ls
    ```

### Build and sign a container image

1. Build and push a new image with ACR Tasks.

    ```azurecli
    az acr build -r $ACR_NAME -t $IMAGE $IMAGE_SOURCE
    ```

2. Authenticate with your individual Azure AD identity to use an ACR token.

    ```azurecli
    export USER_NAME="00000000-0000-0000-0000-000000000000"
    export PASSWORD=$(az acr login --name $ACR_NAME --expose-token --output tsv --query accessToken)
    notation login -u $USER_NAME -p $PASSWORD $REGISTRY
    ```

3. Sign the container image with the [COSE](https://datatracker.ietf.org/doc/html/rfc8152) signature format using the signing key added in the previous step.

    ```azurecli
    notation sign --signature-format cose --key $KEY_NAME $IMAGE
    ```

4. View the graph of signed images and associated signatures.

    ```azurecli
    notation ls $IMAGE
    ```

## Create an AKS cluster

Create an AKS cluster using the [`az aks create`](https://learn.microsoft.com/cli/azure/aks?view=azure-cli-latest#az-aks-create) command.

```azurecli
az aks create --resource-group myResourceGroup --name myAKSCluster
```

## Create federated credential to bind with the Ratify add-on service account

Use the [`az identify federated-credential create`](https://learn.microsoft.com/cli/azure/identity/federated-credential?view=azure-cli-latest#az-identity-federated-credential-create) command to create the federated identity credential between the managed identity, service account issuer, and subject.

Make sure to replace the following example values with your own values: `resourceGroupName`, `userAssignedIdentityName`, `federatedIdentityName`, `serviceAccountNamespace`, and `serviceAccountName`.

```azurecli
az identity federated-credential create --name federatedIdentityName --identity-name userAssignedIdentityName --resource-group resourceGroupName --issuer ${AKS_OIDC_ISSUER} --subject system:serviceaccount:${SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME}
```

> [!NOTE]
> It takes a few seconds for the federated identity credential to be propagated after being added. If a token request is made immediately after adding the federated identity credential, it might lead to failure for a few minutes, as the cache is populated in the directory with old data. To avoid this issue, you can add a slight delay after adding the federated identity credential.
