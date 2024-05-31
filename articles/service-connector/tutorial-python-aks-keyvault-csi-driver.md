---
title: 'Tutorial: Use the Azure Key Vault provider for Secrets Store CSI Driver in an AKS cluster with Service Connector'
description: Learn how to connect to Azure Key Vault using CSI driver in an AKS cluster with the help of Service Connector.
author: houk-ms
ms.author: honc
ms.service: service-connector
ms.custom: devx-track-python
ms.topic: tutorial
ms.date: 03/01/2024
---

# Tutorial: Use the Azure Key Vault provider for Secrets Store CSI Driver in an Azure Kubernetes Service (AKS) cluster

Learn how to connect to Azure Key Vault using CSI driver in an Azure Kubernetes Service (AKS) cluster with the help of Service Connector. In this tutorial, you complete the following tasks:

> [!div class="checklist"]
>
> * Create an AKS cluster and an Azure Key Vault.
> * Create a connection between the AKS cluster and the Azure Key Vault with Service Connector.
> * Create a `SecretProviderClass` CRD and a `pod` consuming the CSI provider to test the connection.
> * Clean up resources.

> [!IMPORTANT]
> Service Connect within AKS is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
* [Install](/cli/azure/install-azure-cli) the Azure CLI, and sign in to Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.
* Install [Docker](https://docs.docker.com/get-docker/)and [kubectl](https://kubernetes.io/docs/tasks/tools/), to manage container image and Kubernetes resources.
* A basic understanding of container and AKS. Get started from [preparing an application for AKS](../aks/tutorial-kubernetes-prepare-app.md).

## Create Azure resources

1. Create a resource group for this tutorial.

    ```azurecli
    az group create \
        --name MyResourceGroup \
        --location eastus
    ```

1. Create an AKS cluster with the following command, or referring to the [tutorial](../aks/learn/quick-kubernetes-deploy-cli.md). This is the cluster where we create the service connection, pod definition and deploy the sample application to.

    ```azurecli
    az aks create \
        --resource-group MyResourceGroup \
        --name MyAKSCluster \
        --enable-managed-identity \
        --node-count 1
    ```

1. Connect to the cluster with the following command.

    ```azurecli
    az aks get-credentials \
        --resource-group MyResourceGroup \
        --name MyAKSCluster
    ```

1. Create an Azure Key Vault with the following command, or referring to the [tutorial](../key-vault/general/quick-create-cli.md). This is the target service that is connected to the AKS cluster and the CSI driver synchronize secrets from.

    ```azurecli
    az keyvault create \
        --resource-group MyResourceGroup \  
        --name MyKeyVault \
        --location EastUS
    ```

1. Create a secret in the Key Vault with the following command.

    ```azurecli
    az keyvault secret set \
        --vault-name MyKeyVault \
        --name ExampleSecret \
        --value MyAKSExampleSecret
    ```

## Create a service connection in AKS with Service Connector (preview)

Create a service connection between an AKS cluster and an Azure Key Vault using the Azure portal or the Azure CLI.

### [Portal](#tab/azure-portal)

1. Open your **Kubernetes service** in the Azure portal and select **Service Connector** from the left menu.

1. Select **Create** and fill in the settings as shown below. Leave the other settings with their default values.

    | Setting             | Choice                   | Description                                                                               |
    |---------------------|--------------------------|-------------------------------------------------------------------------------------------|
    | **Kubernetes namespace**|   *default*          |  The namespace where you need the connection in the cluster.                              |
    | **Service type**    | *Key Vault (enable CSI)* | Choose Key Vault as the target service type and check the option to enable CSI.           |
    | **Connection name** | *keyvault_conn*          | Use the connection name provided by Service Connector or choose your own connection name. |
    | **Subscription**    | `<MySubscription>`       | The subscription for your Azure Key Vault target service.                               |
    | **Key vault**       | `<MyKeyVault>`           | The target key vault you want to connect to.                                              |
    | **Client type**     | *Python*                 | The code language or framework you use to connect to the target service.                  |

1. Once the connection has been created, the Service Connector page displays information about the new connection.

    :::image type="content" source="./media/aks-tutorial/aks-keyvault.png" alt-text="Screenshot of the Azure portal, viewing kubernetes resources created by Service Connector.":::

### [Azure CLI](#tab/azure-cli)

Run the following Azure CLI command to create a service connection to an Azure Key Vault.

```azurecli
az aks connection create keyvault --enable-csi
```

Provide the following information as prompted:

* **Source compute service resource group name:** the resource group name of the AKS cluster.
* **AKS cluster name:** the name of your AKS cluster that connects to the target service.
* **Target service resource group name:** the resource group name of the Azure Key Vault.
* **Key vault name:** the Azure Key Vault that is connected.

---

## Test the connection

1. Clone the sample repository:

   ```Bash
   git clone https://github.com/Azure-Samples/serviceconnector-aks-samples.git
   ```

1. Go to the repository's sample folder for Azure Key Vault:

   ```Bash
   cd serviceconnector-aks-samples/azure-keyvault-csi-provider
   ```

1. Replace the placeholders in the `secret_provider_class.yaml` file in the `azure-keyvault-csi-provider` folder.

   * Replace `<AZURE_KEYVAULT_NAME>` with the name of the key vault we created and connected. You may get the value from Azure portal of Service Connector.
   * Replace `<AZURE_KEYVAULT_TENANTID>` with the tenant ID of the key vault. You may get the value from Azure portal of Service Connector.
   * Replace `<AZURE_KEYVAULT_CLIENTID>` with identity client ID of the  `azureKeyvaultSecretsProvider` addon. You may get the value from Azure portal of Service Connector.
   * Replace `<KEYVAULT_SECRET_NAME>` with the key vault secret name we created, for example, `ExampleSecret`

1. Deploy the Kubernetes resources to your cluster with the `kubectl apply` command. Install `kubectl` locally using the [az aks install-cli](/cli/azure/aks#az_aks_install_cli) command if it isn't installed.

   1. Deploy the `SecretProviderClass` CRD.

   ```Bash
   kubectl apply -f secret_provider_class.yaml
   ```

   1. Deploy the `pod`. The command creates a pod named `sc-demo-keyvault-csi` in the default namespace of your AKS cluster.

   ```Bash
   kubectl apply -f pod.yaml
   ```

1. Check the deployment is successful by viewing the pod with `kubectl`.

   ```Bash
   kubectl get pod/sc-demo-keyvault-csi
   ```

1. After the pod starts, the mounted content at the volume path specified in your deployment YAML is available. Use the following commands to validate your secrets and print a test secret.

   * Show secrets held in the secrets store using the following command.

   ```Bash
   kubectl exec sc-demo-keyvault-csi -- ls /mnt/secrets-store/
   ```

   * Display a secret in the store using the following command. This example command shows the test secret `ExampleSecret`.

   ```Bash
   kubectl exec sc-demo-keyvault-csi -- cat /mnt/secrets-store/ExampleSecret
   ```

## Clean up resources

If you don't need to reuse the resources you've created in this tutorial, delete all the resources you created by deleting your resource group.

```azurecli
az group delete \
    --resource-group MyResourceGroup
```

## Next steps

Read the following articles to learn more about Service Connector concepts and how it helps AKS connect to services.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)

> [!div class="nextstepaction"]
> [Use Service Connector to connect an AKS cluster to other cloud services](./how-to-use-service-connector-in-aks.md)
