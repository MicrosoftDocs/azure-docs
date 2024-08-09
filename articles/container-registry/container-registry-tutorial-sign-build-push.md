---
title: Sign container images with Notation and Azure Key Vault using a self-signed certificate
description: In this tutorial you'll learn to create a self-signed certificate in Azure Key Vault (AKV), build and sign a container image stored in Azure Container Registry (ACR) with notation and AKV, and then verify the container image with notation.
author: yizha1
ms.author: yizha1
ms.service: azure-container-registry
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 4/23/2023
---

# Sign container images with Notation and Azure Key Vault using a self-signed certificate

Signing container images is a process that ensures their authenticity and integrity. This is achieved by adding a digital signature to the container image, which can be validated during deployment. The signature helps to verify that the image is from a trusted publisher and has not been modified. [Notation](https://github.com/notaryproject/notation) is an open source supply chain security tool developed by the [Notary Project community](https://notaryproject.dev/) and backed by Microsoft, which supports signing and verifying container images and other artifacts. The Azure Key Vault (AKV) is used to store certificates with signing keys that can be used by Notation with the Notation AKV plugin (azure-kv) to sign and verify container images and other artifacts. The Azure Container Registry (ACR) allows you to attach signatures to container images and other artifacts as well as view those signatures.

In this tutorial:

> [!div class="checklist"]
> * Install Notation CLI and AKV plugin
> * Create a self-signed certificate in AKV
> * Build and push a container image with [ACR Tasks](container-registry-tasks-overview.md)
> * Sign a container image with Notation CLI and AKV plugin
> * Validate a container image against the signature with Notation CLI

## Prerequisites

* Create or use an [Azure Container Registry](../container-registry/container-registry-get-started-azure-cli.md) for storing container images and signatures
* Create or use an [Azure Key Vault](/azure/key-vault/general/quick-create-cli) for managing certificates
* Install and configure the latest [Azure CLI](/cli/azure/install-azure-cli), or Run commands in the [Azure Cloud Shell](https://portal.azure.com/#cloudshell/)

## Install Notation CLI and AKV plugin

1. Install Notation v1.1.0 on a Linux amd64 environment. Follow the [Notation installation guide](https://notaryproject.dev/docs/user-guides/installation/cli/) to download the package for other environments.

    ```bash
    # Download, extract and install
    curl -Lo notation.tar.gz https://github.com/notaryproject/notation/releases/download/v1.1.0/notation_1.1.0_linux_amd64.tar.gz
    tar xvzf notation.tar.gz
            
    # Copy the Notation binary to the desired bin directory in your $PATH, for example
    cp ./notation /usr/local/bin
    ```

2. Install the Notation Azure Key Vault plugin `azure-kv` v1.2.0 on a Linux amd64 environment.

    > [!NOTE]
    > The URL and SHA256 checksum for the Notation Azure Key Vault plugin can be found on the plugin's [release page](https://github.com/Azure/notation-azure-kv/releases).

    ```bash
    notation plugin install --url https://github.com/Azure/notation-azure-kv/releases/download/v1.2.0/notation-azure-kv_1.2.0_linux_amd64.tar.gz --sha256sum 06bb5198af31ce11b08c4557ae4c2cbfb09878dfa6b637b7407ebc2d57b87b34
    ```

3. List the available plugins and confirm that the `azure-kv` plugin with version `1.2.0` is included in the list. 

    ```bash
    notation plugin ls
    ```

## Configure environment variables

> [!NOTE]
> For easy execution of commands in the tutorial, provide values for the Azure resources to match the existing ACR and AKV resources.

1. Configure AKV resource names.

    ```bash
    AKV_SUB_ID=myAkvSubscriptionId
    AKV_RG=myAkvResourceGroup
    # Name of the existing AKV used to store the signing keys
    AKV_NAME=myakv
    # Name of the certificate created in AKV
    CERT_NAME=wabbit-networks-io
    CERT_SUBJECT="CN=wabbit-networks.io,O=Notation,L=Seattle,ST=WA,C=US"
    CERT_PATH=./${CERT_NAME}.pem
    ```

2. Configure ACR and image resource names.

    ```bash
    ACR_SUB_ID=myAcrSubscriptionId
    ACR_RG=myAcrResourceGroup
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

## Secure access permissions to ACR and AKV

When working with ACR and AKV, it’s essential to grant the appropriate permissions to ensure secure and controlled access. You can authorize access for different entities, such as user principals, service principals, or managed identities, depending on your specific scenarios. In this tutorial, the access is authorized to a signed-in Azure user.

### Authorize access to ACR

The `AcrPull` and `AcrPush` roles are required for signing container images in ACR.

1. Set the subscription that contains the ACR resource

    ```bash
    az account set --subscription $ACR_SUB_ID
    ```

2. Assign the roles

    ```bash
    USER_ID=$(az ad signed-in-user show --query id -o tsv)
    az role assignment create --role "AcrPull" --role "AcrPush" --assignee $USER_ID --scope "/subscriptions/$ACR_SUB_ID/resourceGroups/$ACR_RG/providers/Microsoft.ContainerRegistry/registries/$ACR_NAME"
    ```

### Authorize access to AKV

In this section, we’ll explore two options for authorizing access to AKV.

#### Use Azure RBAC (Recommended)

The following roles are required for signing using self-signed certificates:
- `Key Vault Certificates Officer` for creating and reading certificates
- `Key Vault Certificates User`for reading existing certificates
- `Key Vault Crypto User` for signing operations

To learn more about Key Vault access with Azure RBAC, see [Use an Azure RBAC for managing access](/azure/key-vault/general/rbac-guide).

1. Set the subscription that contains the AKV resource

    ```bash
    az account set --subscription $AKV_SUB_ID
    ```

2. Assign the roles

    ```bash
    USER_ID=$(az ad signed-in-user show --query id -o tsv)
    az role assignment create --role "Key Vault Certificates Officer" --role "Key Vault Crypto User" --assignee $USER_ID --scope "/subscriptions/$AKV_SUB_ID/resourceGroups/$AKV_RG/providers/Microsoft.KeyVault/vaults/$AKV_NAME"
    ```

#### Assign access policy in AKV (legacy)

The following permissions are required for an identity:
- `Create` permissions for creating a certificate
- `Get` permissions for reading existing certificates
- `Sign` permissions for signing operations

To learn more about assigning policy to a principal, see [Assign Access Policy](/azure/key-vault/general/assign-access-policy).

1. Set the subscription that contains the AKV resource:

    ```bash
    az account set --subscription $AKV_SUB_ID
    ```

2. Set the access policy in AKV:

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
        "secretProperties": {
          "contentType": "application/x-pem-file"
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
    IMAGE=$REGISTRY/${REPO}:$TAG
    ```

3. Get the Key ID of the signing key. A certificate in AKV can have multiple versions, the following command gets the Key ID of the latest version.

    ```bash
    KEY_ID=$(az keyvault certificate show -n $CERT_NAME --vault-name $AKV_NAME --query 'kid' -o tsv)
    ```

4. Sign the container image with the [COSE](https://datatracker.ietf.org/doc/html/rfc9052) signature format using the signing key ID. To sign with a self-signed certificate, you need to set the plugin configuration value `self_signed=true`.

    ```bash
    notation sign --signature-format cose --id $KEY_ID --plugin azure-kv --plugin-config self_signed=true $IMAGE
    ```

    To authenticate with AKV, by default, the following credential types if enabled will be tried in order:
 
    - [Environment credential](/dotnet/api/azure.identity.environmentcredential)
    - [Workload identity credential](/dotnet/api/azure.identity.workloadidentitycredential)
    - [Managed identity credential](/dotnet/api/azure.identity.managedidentitycredential)
    - [Azure CLI credential](/dotnet/api/azure.identity.azureclicredential)
    
    If you want to specify a credential type, use an additional plugin configuration called `credential_type`. For example, you can explicitly set `credential_type` to `azurecli` for using Azure CLI credential, as demonstrated below:
    
    ```bash
    notation sign --signature-format cose --id $KEY_ID --plugin azure-kv --plugin-config self_signed=true --plugin-config credential_type=azurecli $IMAGE
    ```

    See below table for the values of `credential_type` for various credential types.

    | Credential type              | Value for `credential_type` |
    | ---------------------------- | -------------------------- |
    | Environment credential       | `environment`              |
    | Workload identity credential | `workloadid`               |
    | Managed identity credential  | `managedid`                |
    | Azure CLI credential         | `azurecli`                 |
    
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

Notation also provides CI/CD solutions on Azure Pipeline and GitHub Actions Workflow:

- [Sign and verify a container image with Notation in Azure Pipeline](/azure/security/container-secure-supply-chain/articles/notation-ado-task-sign)
- [Sign and verify a container image with Notation in GitHub Actions Workflow](https://github.com/marketplace/actions/notation-actions)

To validate signed image deployment in AKS or Kubernetes:

- [Use Image Integrity to validate signed images before deploying them to your Azure Kubernetes Service (AKS) clusters (Preview)](/azure/aks/image-integrity?tabs=azure-cli)
- [Use Ratify to validate and audit image deployment in any Kubernetes cluster](https://ratify.dev/)

[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/
