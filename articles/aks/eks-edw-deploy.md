---
title: Deploy the event-driven workflow (EDW) workload to Azure
description: Learn how to deploy the EDW workflow to Azure and how to validate your deployment.
ms.topic: how-to
ms.date: 05/01/2024
author: JnHs
ms.author: jenhayes
---

# Deploy the event-driven workflow (EDW) workload to Azure

Now that you've set your environment variables and made the necessary code changes, you're ready to deploy the EDW workload to Azure.

## Sign in to Azure

Before running the `deploy.sh` script, sign in to Azure by running the following command:

```bash
az login
```

If your Azure account has multiple subscriptions, make sure you have selected the correct subscription. To list the names and IDs of your subscriptions, run the following command:

```bash
az account list --query "[].{id: id, name:name }" --output table
```

To select a specific subscription, run the following command:

```bash
az account set --subscription <desired-subscription-id>
```

## Run the deployment command

The `deploy.sh` script in the `deployment` directory is used to deploy the application to Azure. This interactive script creates the needed Azure resources based on [the values you set for the environment variables](eks-edw-prepare.md#set-environment-variables). The script also creates a workload identity to be associated with the Kubernetes service account for the application you'll deploy in the cluster. This workload identity will be used to authenticate the application code with Azure services.

To deploy the application infrastructure to Azure, run the following command:

```bash
cd deployment
./deploy.sh
```

Before the script takes action, it first checks that all of the prerequisite tools are installed. If not, the script terminates, and you'll see an error message letting you know which prerequisites are missing. Install any needed tools and then run the script again.

The deployment script also checks that the [Node Autoprovisioning Preview for Azure Kubernetes Service (AKS)](/azure/aks/node-autoprovision) is enabled. If not, the script executes a CLI call to enable it.

The script continues on to perform the following tasks, requesting your input where needed.

### Set up the storage account

Once the script confirms that all prerequisites are met, it creates the resource group with the name you set in the environment variable `RESOURCE_GROUP_NAME`. All new resources are created in this resource group.

Next, you select whether to use an existing [Azure storage account](/azure/storage/common/storage-account-overview), or let the script create one, using the name you set in the environment variable `STORAGE_ACCOUNT_NAME`.

### Set up Azure Key Vault

The script asks whether you want to use an existing [Azure Key Vault](//azure/key-vault/general/basic-concepts). If so, enter the name of the Key Vault resource. If not, the script creates one for you, using the name you set in the environment variable `KEY_VAULT_NAME`.

Next, the script assigns the Key Vault Administrator role to the object ID of the principal running the script, so that it's able to perform Key Vault operations.

Finally, it checks whether the `PrimaryAccessKey` and `SecondaryAccessKey` secrets for your storage account exists in the Key Vault. If not, the necessary secrets are created.

### Set up Azure Container Registry

The script asks whether you want to use an existing Azure Container Registry (ACR). If so, enter the name of the ACR resource. If not, the script creates one for you, using the name you set in the environment variable `ACR_NAME`.

Next, the script checks whether the service principal ID and password exist as secrets in your Key Vault. If not, the necessary secrets are created.

Finally, the script creates a new user-assigned managed identity for your AKS cluster, using the name you set in the environment variable `AKS_MANAGED_IDENTITY_NAME`, and assigns the **ACRPull** role to this identity.

### Set up AKS cluster

The script checks to see if a cluster exists with the name you set in the environment variable `AKS_CLUSTER_NAME`. If not, it creates this cluster, enabling the managed identity created in the previous step.

Next, it checks whether the AKS cluster credentials already exist in the kubeconfig file. If not, it retrieves these credentials.

Another  user-assigned managed identity is then created, using the value provided in the environment variable `WORKLOAD_MANAGED_IDENTITY_NAME`. This identity is the AKS [workload identity](/entra/workload-id/workload-identities-overview) that allows KEDA to access Azure Cosmos DB. This workload identity is assigned the **Storage Blob Data Contributor** role, and it will be associated with the federated identity credential set in the variable `FEDERATED_IDENTITY_CREDENTIAL_NAME`. If this credential doesn't already exist, it will be created.

You also need a service account. The script checks for the namespace set in the environment variable `SERVICE_ACCOUNT_NAMESPACE` and creates it if needed, then creates the service account using the name provided in the variable `SERVICE_ACCOUNT_NAME`.

### Set up Azure Cosmos DB account

The script checks for an Azure Cosmos DB account with the name set in the environment variable `COSMOSDB_ACCOUNT_NAME`, and creates it if the account doesn't already exist. Then it grants the **Cosmos DB Account Contributor** role to the managed identity for this account.

## Validate deployment and run the workload

TODO: Describe the process of using a deployment script after deployment to run load against the workload and the usage of k9s to monitor pod scaleout and node scaleout.

### Generate simulated load

TODO: How to run the load generation script

### Monitor scale out for pods and nodes with k9s

TODO: How to use k9s to monitor the workload while it processes load

## Closing summary

TODO: Congratulations you have successfully replicated the AWS EKS Scaling with KEDA and Karpenter workload in Azure. Here are some further suggested reading and enhancements that could be made.
