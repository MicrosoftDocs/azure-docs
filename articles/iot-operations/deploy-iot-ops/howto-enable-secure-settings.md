---
title: Enable secure settings
description: Enable secure settings in your Azure IoT Operations instance for developing a production-ready scenario.
author: asergaz
ms.author: sergaz
ms.topic: how-to
ms.date: 01/21/2025

#CustomerIntent: I deployed Azure IoT Operations with test settings, and now I want to enable secure settings to use the full feature set.
---

# Enable secure settings in Azure IoT Operations

The secure settings for Azure IoT Operations include the setup of secrets management and a user-assigned managed identity for cloud connections; for example, an OPC UA server or dataflow endpoints.

This article provides instructions for enabling secure settings if you didn't do so during your initial deployment.

## Prerequisites

* An Azure IoT Operations instance deployed with test settings. For example, you chose **Test Settings** when following the instructions in [Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](howto-deploy-iot-operations.md).

* Azure CLI installed on your development machine. This scenario requires Azure CLI version 2.64.0 or higher. Use `az --version` to check your version and `az upgrade` to update if necessary. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

* The latest version of the **connectedk8s** extension for Azure CLI. Use the following command to add the extension or update it to the latest version:

  ```bash
  az extension add --upgrade --name connectedk8s
  ```

* The Azure IoT Operations extension for Azure CLI. Use the following command to add the extension or update it to the latest version:

  ```azurecli
  az extension add --upgrade --name azure-iot-ops
  ```

## Enable the cluster for secure settings

To enable secrets synchronization for your Azure IoT Operations instance, your cluster must be enabled as an OIDC issuer and for workload identity federation. This configuration is required for the Secret Store extension to sync the secrets from an Azure key vault and store them on the edge as Kubernetes secrets.

For Azure Kubernetes Service (AKS) clusters, the OIDC issuer and workload identity features can be enabled only at the time of cluster creation. For clusters on AKS Edge Essentials, the automated script enables these features by default. For AKS clusters on Azure Local, follow the steps to [Deploy and configure workload identity on an AKS enabled by Azure Arc cluster](/azure/aks/aksarc/workload-identity) to create a new cluster if you don't have one with the required features.

For k3s clusters on Kubernetes, you can update an existing cluster. To enable and configure these features, use the following steps:

1. Update the cluster to enable OIDC issuer and workload identity.

    ```azurecli
    az connectedk8s update -n <CLUSTER_NAME> -g <RESOURCE_GROUP> --enable-oidc-issuer --enable-workload-identity
    ```

    If you enabled the OIDC issuer and workload identity features when you created the cluster, you don't need to run the previous command again. Use the following command to check the status of the OIDC issuer and workload identity features for your cluster:

    ```azurecli
    az connectedk8s show -g <RESOURCE_GROUP> -n <CLUSTER_NAME> --query "{ClusterName:name, OIDCIssuerEnabled:oidcIssuerProfile.enabled, WorkloadIdentityEnabled:securityProfile.workloadIdentity.enabled}"
    ```

1. Get the cluster's issuer URL.

    ```azurecli
    az connectedk8s show -g <RESOURCE_GROUP> -n <CLUSTER_NAME> --query oidcIssuerProfile.issuerUrl --output tsv
    ```

    Make a note of the output from this command to use in the next steps.

1. Create the k3s config file:

    ```bash
    sudo nano /etc/rancher/k3s/config.yaml
    ```

1. Add the following content to the `config.yaml` file, replacing the `<SERVICE_ACCOUNT_ISSUER>` placeholder with the cluster issuer URL you made a note of previously:

    ```yml
    kube-apiserver-arg:
    - service-account-issuer=<SERVICE_ACCOUNT_ISSUER>
    - service-account-max-token-expiration=24h
    ```

    Save the file and exit the nano editor.

1. Restart the k3s service:

    ```bash
    sudo systemctl restart k3s
    ```

## Set up secrets management

Secrets management for Azure IoT Operations uses the Secret Store extension to sync the secrets from an Azure key vault and store them on the edge as Kubernetes secrets. The Secret Store extension requires a user-assigned managed identity with access to the Azure key vault where secrets are stored. To learn more, see [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview).

To set up secrets management:

1. [Create an Azure key vault](/azure/key-vault/secrets/quick-create-cli#create-a-key-vault) that's used to store secrets, and [give your user account permissions to manage secrets](/azure/key-vault/secrets/quick-create-cli#give-your-user-account-permissions-to-manage-secrets-in-key-vault) with the `Key Vault Secrets Officer` role.
1. [Create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity) for the Secret Store extension.
1. Use the [az iot ops secretsync enable](/cli/azure/iot/ops/secretsync#az-iot-ops-secretsync-enable) command to set up the Azure IoT Operations instance for secret synchronization. This command:

    - Creates a federated identity credential by using the user-assigned managed identity.
    - Adds a role assignment to the user-assigned managed identity for access to the Azure key vault.
    - Adds a minimum secret provider class associated with the Azure IoT Operations instance.

    # [Bash](#tab/bash)

    ```azurecli
    # Variable block
    AIO_INSTANCE_NAME="<AIO_INSTANCE_NAME>"
    RESOURCE_GROUP="<RESOURCE_GROUP>"
    USER_ASSIGNED_MI_NAME="<USER_ASSIGNED_MI_NAME>"
    KEYVAULT_NAME="<KEYVAULT_NAME>"
    
    #Get the resource ID of the user-assigned managed identity
    USER_ASSIGNED_MI_RESOURCE_ID=$(az identity show --name $USER_ASSIGNED_MI_NAME --resource-group $RESOURCE_GROUP --query id --output tsv)
    
    #Get the resource ID of the key vault
    KEYVAULT_RESOURCE_ID=$(az keyvault show --name $KEYVAULT_NAME --resource-group $RESOURCE_GROUP --query id --output tsv)
    
    #Enable secret synchronization
    az iot ops secretsync enable --instance $AIO_INSTANCE_NAME \
                                 --resource-group $RESOURCE_GROUP \
                                 --mi-user-assigned $USER_ASSIGNED_MI_RESOURCE_ID \
                                 --kv-resource-id $KEYVAULT_RESOURCE_ID
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    # Variable block
    $AIO_INSTANCE_NAME="<AIO_INSTANCE_NAME>"
    $RESOURCE_GROUP="<RESOURCE_GROUP>"
    $USER_ASSIGNED_MI_NAME="<USER_ASSIGNED_MI_NAME>"
    $KEYVAULT_NAME="<KEYVAULT_NAME>"
    
    # Get the resource ID of the user-assigned managed identity
    $USER_ASSIGNED_MI_RESOURCE_ID=$(az identity show --name $USER_ASSIGNED_MI_NAME --resource-group $RESOURCE_GROUP --query id --output tsv)
    
    # Get the resource ID of the key vault
    $KEYVAULT_RESOURCE_ID=$(az keyvault show --name $KEYVAULT_NAME --resource-group $RESOURCE_GROUP --query id --output tsv)
    
    # Enable secret synchronization
    az iot ops secretsync enable --instance $AIO_INSTANCE_NAME `
                                 --resource-group $RESOURCE_GROUP `
                                 --mi-user-assigned $USER_ASSIGNED_MI_RESOURCE_ID `
                                 --kv-resource-id $KEYVAULT_RESOURCE_ID
    ```

    ---

Now that secret synchronization setup is complete, you can refer to [Manage secrets for your Azure IoT Operations deployment](./howto-manage-secrets.md) to learn how to use secrets with Azure IoT Operations.

## Set up a user-assigned managed identity for cloud connections

Some Azure IoT Operations components, like dataflow endpoints, use a user-assigned managed identity for cloud connections. We recommend that you use a separate identity from the one that you used to set up secrets management.

1. [Create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity) that's used for cloud connections.

   > [!NOTE]
   > You'll need to grant the identity permission to whichever cloud resource you'll use the managed identity for.

1. Use the [az iot ops identity assign](/cli/azure/iot/ops) command to assign the identity to the Azure IoT Operations instance. This command also creates a federated identity credential by using the OIDC issuer of the indicated connected cluster and the Azure IoT Operations service account.

    # [Bash](#tab/bash)

    ```azurecli
    # Variable block
    AIO_INSTANCE_NAME="<AIO_INSTANCE_NAME>"
    RESOURCE_GROUP="<RESOURCE_GROUP>"
    USER_ASSIGNED_MI_NAME="<USER_ASSIGNED_MI_NAME FOR CLOUD CONNECTIONS>"
    
    #Get the resource ID of the user-assigned managed identity
    USER_ASSIGNED_MI_RESOURCE_ID=$(az identity show --name $USER_ASSIGNED_MI_NAME --resource-group $RESOURCE_GROUP --query id --output tsv)
    
    #Assign the identity to the Azure IoT Operations instance
    az iot ops identity assign --name $AIO_INSTANCE_NAME \
                               --resource-group $RESOURCE_GROUP \
                               --mi-user-assigned $USER_ASSIGNED_MI_RESOURCE_ID
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    # Variable block
    $AIO_INSTANCE_NAME="<AIO_INSTANCE_NAME>"
    $RESOURCE_GROUP="<RESOURCE_GROUP>"
    $USER_ASSIGNED_MI_NAME="<USER_ASSIGNED_MI_NAME FOR CLOUD CONNECTIONS>"
    
    # Get the resource ID of the user-assigned managed identity
    $USER_ASSIGNED_MI_RESOURCE_ID=$(az identity show --name $USER_ASSIGNED_MI_NAME --resource-group $RESOURCE_GROUP --query id --output tsv)
    
    
    # Assign the identity to the Azure IoT Operations instance
    az iot ops identity assign --name $AIO_INSTANCE_NAME `
                               --resource-group $RESOURCE_GROUP `
                               --mi-user-assigned $USER_ASSIGNED_MI_RESOURCE_ID
    ```

    ---

Now you can use this managed identity in dataflow endpoints for cloud connections.
