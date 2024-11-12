---
title: Enable secure settings
description: Enable secure settings on your Azure IoT Operations deployment by configuring an Azure Key Vault and enabling workload identities.
author: asergaz
ms.author: sergaz
ms.topic: how-to
ms.date: 11/04/2024

#CustomerIntent: I deployed Azure IoT Operations with test settings for the quickstart scenario, now I want to enable secure settings to use the full feature set.
---

# Enable secure settings in Azure IoT Operations deployment

The secure settings for Azure IoT Operations include the setup of Secrets Management and user-assigned managed identity for cloud connections, for example, an OPC UA server, or dataflow endpoints.

This article provides instructions for enabling secure settings if you didn't do so during your initial deployment.

## Prerequisites

* An Azure IoT Operations instance deployed with test settings. For example, if you followed the instructions in [Quickstart: Run Azure IoT Operations in Codespaces](../get-started-end-to-end-sample/quickstart-deploy.md).

* Azure CLI installed on your development machine. This scenario requires Azure CLI version 2.64.0 or higher. Use `az --version` to check your version and `az upgrade` to update if necessary. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

* The latest versions of the following extensions for Azure CLI:

  ```azurecli
  az extension add --upgrade --name azure-iot-ops
  az extension add --upgrade --name connectedk8s
  ```

## Configure cluster for workload identity

A workload identity is an identity you assign to a software workload (such as an application, service, script, or container) to authenticate and access other services and resources. The workload identity feature needs to be enabled on your cluster, so that the [Azure Key Vault Secret Store extension for Kubernetes](/azure/azure-arc/kubernetes/secret-store-extension) and Azure IoT Operations can access Microsoft Entra ID protected resources. To learn more, see [What are workload identities?](/entra/workload-id/workload-identities-overview).

> [!NOTE]
> This step only applies to Ubuntu + K3s clusters. The quickstart script for Azure Kubernetes Service (AKS) Edge Essentials used in [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md) enables workload identity by default. If you have an AKS Edge Essentials cluster, continue to the next section.

If you aren't sure whether your K3s cluster already has workload identity enabled or not, run the [az connectedk8s show](/cli/azure/connectedk8s#az-connectedk8s-show) command to check:

```azurecli
az connectedk8s show --name <CLUSTER_NAME> --resource-group <RESOURCE_GROUP> --query "{oidcIssuerEnabled:oidcIssuerProfile.enabled, workloadIdentityEnabled: securityProfile.workloadIdentity.enabled}"
```

If not already set up, use the following steps to enable workload identity on an existing connected K3s cluster:

1. Use the [az connectedk8s update](/cli/azure/connectedk8s#az-connectedk8s-update) command to enable the workload identity feature on the cluster.

   ```azurecli
   #!/bin/bash   

   # Variable block
   RESOURCE_GROUP="<RESOURCE_GROUP>"
   CLUSTER_NAME="<CLUSTER_NAME>"

   # Enable workload identity
   az connectedk8s update --resource-group $RESOURCE_GROUP \
                          --name $CLUSTER_NAME \
                          --enable-oidc-issuer --enable-workload-identity 
   ```

1. Use the [az connectedk8s show](/cli/azure/connectedk8s#az-connectedk8s-show) command to get the cluster's issuer url. Take a note to add it later in K3s config file.

   ```azurecli
   #!/bin/bash

   # Variable block
   RESOURCE_GROUP="<RESOURCE_GROUP>"
   CLUSTER_NAME="<CLUSTER_NAME>"
   
   # Get the cluster's issuer url
   SERVICE_ACCOUNT_ISSUER=$(az connectedk8s show --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --query oidcIssuerProfile.issuerUrl --output tsv)
   echo "SERVICE_ACCOUNT_ISSUER = $SERVICE_ACCOUNT_ISSUER"
   ```

1. Create a K3s config file.

   ```bash
   sudo nano /etc/rancher/k3s/config.yaml
   ```

1. Add the following content to the config.yaml file:

   ```yml
   kube-apiserver-arg:
    - service-account-issuer=<SERVICE_ACCOUNT_ISSUER>
    - service-account-max-token-expiration=24h 
   ```

1. Save and exit the file editor.

1. Restart k3s.

   ```bash
   systemctl restart k3s 
   ```

## Set up Secrets Management

Secrets Management for Azure IoT Operations uses Secret Store extension to sync the secrets from an Azure Key Vault and store them on the edge as Kubernetes secrets. Secret Store extension requires a user assigned managed identity with access to the Azure Key Vault where secrets are stored. To learn more, see [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview).

Follow these steps to set up Secrets Management:

1. [Create an Azure Key Vault](/azure/key-vault/secrets/quick-create-cli#create-a-key-vault) that is used to store secrets, and [give your user account permissions to manage secrets](/azure/key-vault/secrets/quick-create-cli#give-your-user-account-permissions-to-manage-secrets-in-key-vault) with the `Key Vaults Secrets Officer` role.
1. [Create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity) for Secret Store extension.
1. Use the [az iot ops secretsync enable](/cli/azure/iot/ops/secretsync#az-iot-ops-secretsync-enable) command to set up the Azure IoT Operations instance for secret synchronization. This command:

    - Creates a federated identity credential using the user-assigned managed identity.
    - Adds a role assignment to the user-assigned managed identity for access to the Azure Key Vault.
    - Adds a minimum secret provider class associated with the Azure IoT Operations instance.

    # [Bash](#tab/bash)
       
    ```azurecli
    # Variable block
    INSTANCE_NAME="<INSTANCE_NAME>"
    RESOURCE_GROUP="<RESOURCE_GROUP>"
    USER_ASSIGNED_MI_NAME="<USER_ASSIGNED_MI_NAME>"
    KEYVAULT_NAME="<KEYVAULT_NAME>"
    
    #Get the resource ID of the user-assigned managed identity
    USER_ASSIGNED_MI_RESOURCE_ID=$(az identity show --name $USER_ASSIGNED_MI_NAME --resource-group $RESOURCE_GROUP --query id --output tsv)
    
    #Get the resource ID of the key vault
    KEYVAULT_RESOURCE_ID=$(az keyvault show --name $KEYVAULT_NAME --resource-group $RESOURCE_GROUP --query id --output tsv)
    
    #Enable secret synchronization
    az iot ops secretsync enable --name $INSTANCE_NAME \
                                 --resource-group $RESOURCE_GROUP \
                                 --mi-user-assigned $USER_ASSIGNED_MI_RESOURCE_ID \
                                 --kv-resource-id $KEYVAULT_RESOURCE_ID
    ```
    
    # [PowerShell](#tab/powershell)
    
    ```azurecli
    # Variable block
    INSTANCE_NAME="<INSTANCE_NAME>"
    $RESOURCE_GROUP="<RESOURCE_GROUP>"
    $USER_ASSIGNED_MI_NAME="<USER_ASSIGNED_MI_NAME>"
    $KEYVAULT_NAME="<KEYVAULT_NAME>"
    
    # Get the resource ID of the user-assigned managed identity
    $USER_ASSIGNED_MI_RESOURCE_ID=$(az identity show --name $USER_ASSIGNED_MI_NAME --resource-group $RESOURCE_GROUP --query id --output tsv)
    
    # Get the resource ID of the key vault
    $KEYVAULT_RESOURCE_ID=$(az keyvault show --name $KEYVAULT_NAME --resource-group $RESOURCE_GROUP --query id --output tsv)
    
    # Enable secret synchronization
    az iot ops secretsync enable --name $INSTANCE_NAME `
                                 --resource-group $RESOURCE_GROUP `
                                 --mi-user-assigned $USER_ASSIGNED_MI_RESOURCE_ID `
                                 --kv-resource-id $KEYVAULT_RESOURCE_ID
    ```
    
    ---

Now that secret synchronization setup is complete, you can refer to [Manage Secrets](./howto-manage-secrets.md) to learn how to use secrets with Azure IoT Operations.

## Set up a user-assigned managed identity for cloud connections

Some Azure IoT Operations components like dataflow endpoints use user-assigned managed identity for cloud connections. It's recommended to use a separate identity from the one used to set up Secrets Management.

1. [Create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity) which is used for cloud connections.

   > [!NOTE]
   > You will need to grant the identity permission to whichever cloud resource this will be used for. 

1. Use the [az iot ops identity assign](/cli/azure/iot/ops) command to assign the identity to the Azure IoT Operations instance. This command also creates a federated identity credential using the OIDC issuer of the indicated connected cluster and the Azure IoT Operations service account.

    # [Bash](#tab/bash)
       
    ```azurecli
    # Variable block
    INSTANCE_NAME="<INSTANCE_NAME>"
    RESOURCE_GROUP="<RESOURCE_GROUP>"
    USER_ASSIGNED_MI_NAME="<USER_ASSIGNED_MI_NAME FOR CLOUD CONNECTIONS>"
    
    #Get the resource ID of the user-assigned managed identity
    USER_ASSIGNED_MI_RESOURCE_ID=$(az identity show --name $USER_ASSIGNED_MI_NAME --resource-group $RESOURCE_GROUP --query id --output tsv)
    
    #Assign the identity to the Azure IoT Operations instance
    az iot ops identity assign --name $INSTANCE_NAME \
                               --resource-group $RESOURCE_GROUP \
                               --mi-user-assigned $USER_ASSIGNED_MI_RESOURCE_ID
    ```
    
    # [PowerShell](#tab/powershell)
    
    ```azurecli
    # Variable block
    $INSTANCE_NAME="<INSTANCE_NAME>"
    $RESOURCE_GROUP="<RESOURCE_GROUP>"
    $USER_ASSIGNED_MI_NAME="<USER_ASSIGNED_MI_NAME FOR CLOUD CONNECTIONS>"
    
    # Get the resource ID of the user-assigned managed identity
    $USER_ASSIGNED_MI_RESOURCE_ID=$(az identity show --name $USER_ASSIGNED_MI_NAME --resource-group $RESOURCE_GROUP --query id --output tsv)
    
    
    #Assign the identity to the Azure IoT Operations instance
    az iot ops identity assign --name $INSTANCE_NAME `
                               --resource-group $RESOURCE_GROUP `
                               --mi-user-assigned $USER_ASSIGNED_MI_RESOURCE_ID
    ```
    
    ---

Now, you can use this managed identity in dataflow endpoints for cloud connections.
