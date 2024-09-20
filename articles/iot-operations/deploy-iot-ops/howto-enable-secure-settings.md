---
title: Enable secure settings
description: Enable secure settings on your Azure IoT Operations Preview deployment by configuring an Azure Key Vault and enabling workload identities.
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.custom: 
ms.date: 09/17/2024

#CustomerIntent: I deployed Azure IoT Operations with test settings for the quickstart scenario, now I want to enable secure settings to use the full feature set.
---

# Enable secure settings

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The secure settings for Azure IoT Operations includes the setup of secrets management and a user-assigned managed identity for components that connect to a resource outside of the cluster, for example, an OPC UA server, or a dataflow source or destination endpoint. 

The test settings are easier and quicker to get you started with a deployment, but after your initial deployment you might want to start using the secure settings. This article provides instructions for enabling secure settings on an existing deployment.

## Prerequisites

* An Azure IoT Operations instance deployed with test settings.

* Azure CLI installed on your development machine. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli). This scenario requires Azure CLI version 2.53.0 or higher. Use `az --version` to check your version and `az upgrade` to update if necessary.

* The Azure IoT Operations extension for Azure CLI. Use the following command to add the extension or update it to the latest version:

  ```azurecli
  az extension add --upgrade --name azure-iot-ops
  ```

## Configure cluster for workload identity

This step only applies to Ubuntu + K3s clusters. The quickstart script for Azure Kuberenetes Service (AKS) Edge Essentials used in [Prepare your Azure Arc-enabled Kubernetes cluster](./howto-prepare-cluster.md) enables workload identity by default. If you have an AKS Edge Essentials cluster, continue to the next section.

If you aren't sure whether your K3s cluster already has workload identity enabled or not, run the following command to check:

```azurecli-interactive
az connectedk8s show -n <CLUSTER_NAME> -g <RESOURCE_GROUP> --query "{oidcIssuerEnabled:oidcIssuerProfile.enabled, workloadIdentityEnabled: securityProfile.workloadIdentity.enabled>"
```

Use the following steps to enable workload identity on an existing connected K3s cluster:

1. Download the `connectedk8s` cli version 1.10.0 whl file from GitHub: [connectedk8s-1.10.0](https://github.com/AzureArcForKubernetes/azure-cli-extensions/blob/connectedk8s/public/cli-extensions/connectedk8s-1.10.0-py2.py3-none-any.whl).

1. Remove the existing connectedk8s cli extension if you already installed it.

   ```azurecli
   az extension remove --name connectedk8s 
   ```

1. Add the new connectedk8s cli source.

   ```azurecli
   az extension add --source <PATH_TO_WHL_FILE>
   ```

1. Export environment variables and set the release tag to 0.1.15392-private.

   ```bash
   export KUBECONFIG=/etc/rancher/k3s/k3s.yaml 
   tag="0.1.15392-private" 
   export HELMREGISTRY=azurearcfork8sdev.azurecr.io/merge/private/azure-arc-k8sagents:${tag}
   ```
 
1. Update the Arc agent version to the private build that supports the workload identity feature.

   ```azurecli
   az connectedk8s upgrade -g <rg_name> -n <cluster_name> --agent-version <release-tag> 
   ```

1. Enable the workload identity feature on the cluster.

   ```azurecli
   az connectedk8s update -g <rg_name> -n <cluster_name> --enable-oidc-issuer --enable-workload-identity 
   ```

1. Get the cluster's issuer url.

   ```azurecli
   SERVICE_ACCOUNT_ISSUER=$(az connectedk8s show -g <rg name> -n <cluster name> --query oidcIssuerProfile.issuerUrl --output tsv) 
   ```

1. Create a K3s config file.

   ```bash
   nano /etc/rancher/k3s/config.yaml
   ```

1. Add the following content to the config.yaml file:

   ```yml
   kube-apiserver-arg: 'service-account-issuer=${SERVICE_ACCOUNT_ISSUER}' 
   kube-apiserver-arg: 'service-account-max-token-expiration=24h' 
   ```

1. Save and exit the file editor.

1. Restart k3s.

   ```bash
   systemctl restart k3s 
   ```

## Set up secret management

Secret Management for Azure IoT Operations uses Azure Secret Store to sync the secrets from an Azure Key Vault and store them on the edge as Kubernetes secrets.  

Azure secret requires a user-assigned managed identity with access to the Azure Key Vault where secrets are stored.

### Create an Azure Key Vault

If you already have an Azure Key Vault, you can skip this section.

1. Create an Azure Key Vault.

   ```azurecli
   az keyvault create --resource-group "<RESOURCE_GROUP>" --location "<LOCATION>" --name "<KEYVAULT_NAME>" --enable-rbac-authorization 
   ```

1. Give yourself **Secrets officer** permissions on the vault, so that you can create secrets:

   ```azurecli
   az role assignment create --role "Key Vault Secrets Officer" --assignee <CURRENT_USER> --scope /subscriptions/<SUBSCRIPTION>/resourcegroups/<RESOURCE_GROUP>/providers/Microsoft.KeyVault/vaults/<KEYVAULT_NAME> 
   ```

### Create a managed identity for secrets

Create a user-assigned managed identity that has access to the Azure Key Vault.

```azurecli
az identity create --name "<USER_ASSIGNED_IDENTITY_NAME>" --resource-group "<RESOURCE_GROUP>" --location "<LOCATION>" --subscription "<SUBSCRIPTION>" 
```

### Enable secret synchronization

The following command sets up the Azure IoT Operations instance for secret synchronization. This command:

* Creates a federated identity credential using the user-assigned managed identity.
* Adds a role assignment to the user-assigned managed identity for access to the Azure Key Vault.
* Adds a minimum secret provider class associated with the Azure IoT Operations instance.

```azurecli
az iot ops secretsync enable -n <CLUSTER_NAME> -g <RESOURCE_GROUP> --mi-user-assigned <USER_ASSIGNED_MI_RESOURCE_ID> --kv-resource-id <KEYVAULT_RESOURCE_ID>
```

Now that secret synchronization setup is complete, you can refer to [Manage Secrets](./howto-manage-secrets.md) to learn how to use secrets with Azure IoT Operations.

## Set up managed identity for cloud connections

Some Azure IoT Operations components like dataflow endpoints use user-assigned managed identity for cloud connections.  

1. Create a user-assigned managed identity which can be used for cloud connections. Don't use the same identity as the one used to set up secrets management.

   ```azurecli
   az identity create --name "<USER_ASSIGNED_IDENTITY_NAME>" --resource-group "<RESOURCE_GROUP>" --location "<LOCATION>" --subscription "<SUBSCRIPTION>" 

   You will need to grant the identity permission to whichever cloud resource this will be used for. 

1. Run the following command to assign the identity to the Azure IoT Operations instance. This command also created a federated identity credential using the OIDC issuer of the indicated connected cluster and the Azure IoT Operations service account.

   ```azurecli
   az iot ops identity assign -n <CLUSTER_NAME> -g <RESOURCE_GROUP> --mi-user-assigned <USER_ASSIGNED_MI_RESOURCE_ID>
   ```

Now, you can use this managed identity in dataflow endpoints for cloud connections.
