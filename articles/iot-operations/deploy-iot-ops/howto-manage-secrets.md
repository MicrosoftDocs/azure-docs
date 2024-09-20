---
title: Manage secrets 
description: Create, update, and manage secrets that are required to give your Arc-enabled Kubernetes cluster access to Azure resources.
author: asergaz
ms.author: sergaz
ms.subservice: orchestrator
ms.topic: how-to
ms.date: 03/21/2024
ms.custom: ignite-2023, devx-track-azurecli

#CustomerIntent: As an IT professional, I want to manage secrets in Azure IoT Operations, by leveraging Key Vault and Secret Synchronization Controller to sync the secrets down from the cloud and store them on the edge as Kubernetes secrets.
---

# Manage secrets for your Azure IoT Operations Preview deployment

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Secrets management in Azure IoT Operations Preview uses Azure Key Vault as the managed vault solution on the cloud and uses [Secret Synchronization Controller](#TODO-ADD-LINK) to sync the secrets down from the cloud and store them on the edge as Kubernetes secrets.

## Prerequisites

* An Arc-enabled Kubernetes cluster with Azure IoT Operations deployed. For more information, see [Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster](howto-deploy-iot-operations.md).
* If you deployed Azure IoT Operations with the *test settings* and now want to upgrade your Azure IoT Operations instance to use *secure settings*, you need to first [enable workload identity](#enable-workload-identity) and then [set up secrets management](#set-up-secrets-management) on your cluster.

## Enable Workload Identity

A workload identity is an identity you assign to a software workload (such as an application, service, script, or container) to authenticate and access other services and resources. The workload identity feature needs to be enabled on your cluster, so that the [Secret Synchronization Controller](#TODO-ADD-LINK) and Azure IoT Operations can access Microsoft Entra ID protected resources. To learn more, see [What are workload identities?](/entra/workload-id/workload-identities-overview).

If you deployed Azure IoT Operations with the secure settings, the workload identity feature is already enabled on your cluster. If you deployed with the test settings, you need to ensure that workload identity feature is enabled on your cluster.

To enable workload identity on your cluster:

1. Use the [az connectedk8s update](/cli/azure/connectedk8s#az-connectedk8s-update) command to update a connected kubernetes cluster with OpenID Connect (OIDC) issuer and the workload identity webhook.

   ```azurecli
   az connectedk8s update --resource-group <RESOURCE_GROUP> --name <CLUSTER_NAME> --subscription <SUBSCRIPTION_ID> --enable-oidc-issuer --enable-workload-identity   
   ```

1. Restart the [kube-apiserver](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/). The following command runs on Ubuntu Linux with K3s Kuberneters cluster.

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl restart k3s 
   ```
   
   > [!NOTE]
   > Workload identity requires the restart of kube-apiserver for updating the configuration. The process for updating the API server configuration varies depending on the specific cluster implementation. Please refer to the documentation for your particular Kubernetes distribution for detailed instructions on how to update the API server.

## Set up secrets management

The following steps are required if Azure IoT Operations has been deployed with test settings. If you have deployed with secure settings, this section can be skipped.

A user-assigned managed identity is required as Secret Synchronization Controller uses a user-assigned managed identity to authenticate itself to the Azure Key Vault, to pull secrets. To learn more, see [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview).

### Create an Azure Key Vault

Azure IoT Operations has the option to use multiple key vaults. For each key vault, a federated credential using a user-assigned managed identity needs to be created. If you already have an Azure Key Vault and secret, you can skip this section.

Create an Azure Key Vault and add a secret:

1. Use the [az keyvault create](/cli/azure/keyvault#az-keyvault-create) command to create an Azure Key Vault.

   ```azurecli
   az keyvault create --name <KEYVAULT_NAME> --resource-group <RESOURCE_GROUP> --location <LOCATION> --enable-rbac-authorization
   ```

1. Use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to give the currently logged-in user `Key Vault Secrets Officer` permissions to the key vault.

    # [Bash](#tab/bash)
    
    ```azurecli
    # Variable block
    SUBSCRIPTION_ID="<SUBSCRIPTION_ID>"
    RESOURCE_GROUP="<RESOURCE_GROUP>"
    KEYVAULT_NAME="<KEYVAULT_NAME>"

    # Get the object ID of the currently logged-in user
    ASSIGNEE_ID=$(az ad signed-in-user show --query id -o tsv)
    
    # Assign the "Key Vault Secrets Officer" role
    az role assignment create --role "Key Vault Secrets Officer" \
                              --assignee $ASSIGNEE_ID \
                              --scope /subscriptions/$SUBSCRIPTION_ID/resourcegroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME
    ```
    
    # [PowerShell](#tab/powershell)
    
    ```azurecli
    # Variable block
    $SUBSCRIPTION_ID="<SUBSCRIPTION_ID>"
    $RESOURCE_GROUP="<RESOURCE_GROUP>"
    $KEYVAULT_NAME="<KEYVAULT_NAME>"

    # Get the object ID of the currently logged-in user
    $ASSIGNEE_ID=$(az ad signed-in-user show --query id -o tsv)
    
    # Assign the "Key Vault Secrets Officer" role
    az role assignment create --role "Key Vault Secrets Officer" `
                              --assignee $ASSIGNEE_ID `
                              --scope /subscriptions/$SUBSCRIPTION_ID/resourcegroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME
    ```
    
    ---

### Create a user-assigned managed identity

If you already have a user-assigned managed identity with `Key Vault Reader` and `Key Vault Secrets User` permissions to the Azure Key Vault, you can skip this section. For more information, see [create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities) and [using Azure RBAC secret, key, and certificate permissions with Key Vault](/azure/key-vault/general/rbac-guide?tabs=azure-cli).

Create a user-assigned managed identity and give it permissions to access the Azure Key Vault:

1. Use the [az identity create](/cli/azure/identity#az-identity-create) command to create the user-assigned managed identity.

   ```azurecli
   az identity create --name <IDENTITY_NAME> --resource-group <RESOURCE_GROUP> --location <LOCATION>
   ```

1. Use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to give the user-assigned managed identity `Key Vault Reader` and `Key Vault Secrets User` permissions. You may need to wait a moment for replication of the identity creation before these commands succeed.

    # [Bash](#tab/bash)
    
    ```azurecli
    # Variable block
    SUBSCRIPTION_ID="<SUBSCRIPTION_ID>"
    RESOURCE_GROUP="<RESOURCE_GROUP>"
    KEYVAULT_NAME="<KEYVAULT_NAME>"
    IDENTITY_NAME="<IDENTITY_NAME>"

    # Get the client ID of the user-assigned managed identity and save it as an environment variable.
    USER_ASSIGNED_CLIENT_ID=$(az identity show --resource-group $RESOURCE_GROUP --name $IDENTITY_NAME --query 'clientId' -o tsv)
    
    # Assign the `Key Vault Reader` role
    az role assignment create --role "Key Vault Reader" \
                              --assignee $USER_ASSIGNED_CLIENT_ID \
                              --scope /subscriptions/$SUBSCRIPTION_ID/resourcegroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME
    
    # Assign the `Key Vault Secrets User` role
    az role assignment create --role "Key Vault Secrets User" \
                              --assignee $USER_ASSIGNED_CLIENT_ID \
                              --scope /subscriptions/$SUBSCRIPTION_ID/resourcegroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME
    ```
       
    # [PowerShell](#tab/powershell)
    
    ```azurecli
    # Variable block
    $SUBSCRIPTION_ID="<SUBSCRIPTION_ID>"
    $RESOURCE_GROUP="<RESOURCE_GROUP>"
    $KEYVAULT_NAME="<KEYVAULT_NAME>"
    $IDENTITY_NAME="<IDENTITY_NAME>"

    # Get the client ID of the user-assigned managed identity and save it as an environment variable.
    $USER_ASSIGNED_CLIENT_ID=$(az identity show --resource-group $RESOURCE_GROUP --name $IDENTITY_NAME --query 'clientId' -o tsv)
    
    # Give the user-assigned managed identity `Key Vault Reader` permission
    az role assignment create --role "Key Vault Reader" `
                              --assignee $USER_ASSIGNED_CLIENT_ID `
                              --scope /subscriptions/$SUBSCRIPTION_ID/resourcegroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME
    
    # Give the user-assigned managed identity `Key Vault Secrets User` permission
    az role assignment create --role "Key Vault Secrets User" `
                              --assignee $USER_ASSIGNED_CLIENT_ID `
                              --scope /subscriptions/$SUBSCRIPTION_ID/resourcegroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME
    ```
    
    ---

### Create a federated identity credential for secrets 

Use the [TODO](/cli/azure/) command to create two federated identity credentials with the user-assigned managed identity and the OIDC issuer: one for the Secret Synchronization Controller and another for the Azure IoT Operations service account. For more information, see [Workload identity federations](/entra/workload-id/workload-identity-federation).

```azurecli
#TODO: Need Azure CLI Command
# Will require one or two user-assigned managed identities?
```

The command automates the steps required to:
<!-- TODO: Validate if it grants permission to Azure Key Vault? Aren't we doing it above when assigning role Key Vault Secrets User? -->
- Grant the user-assigned managed identity permission to the Azure Key Vault.
- Create a federated identity credential using the user-assigned managed identity for Secret Synchronization Controller to use. 
- Create a federated identity credential using the user-assigned managed identity for Azure IoT Operations to use for its northbound connection.
- Create an empty Secret Provider Class.

> [!NOTE]
> It is recommended to use separate User Assigned Managed Identity for the Secret Synchronization Controller and the e IoT Operations service account. 

## Add and use secrets

## Manage Synced Secrets