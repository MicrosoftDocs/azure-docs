---
title: Quickstart - Configure vaulted backup for an Azure Kubernetes Service (AKS) cluster using Azure Backup via Azure CLI
description: Learn how to quickly configure backup for a Kubernetes cluster using Azure CLI.
ms.service: azure-backup
ms.topic: quickstart
ms.date: 05/31/2024
ms.custom: devx-track-terraform, devx-track-extended-azdevcli, ignite-2024
ms.reviewer: rajats
ms.author: v-abhmallick
author: AbhishekMallick-MS
---

# Quickstart: Configure vaulted backup for an Azure Kubernetes Service (AKS) cluster using Azure CLI

This quickstart describes how to configure vaulted backup for an Azure Kubernetes Service (AKS) cluster using Azure CLI.


Azure Backup for AKS is a cloud-native, enterprise-ready, application-centric backup service that lets you quickly configure backup for AKS clusters.

## Before you start
Before you configure vaulted backup for AKS cluster, ensure the following prerequisites are met:

- Perform [all the prerequisites](azure-kubernetes-service-cluster-backup-concept.md) before initiating backup operation for AKS backup.

## Create a Backup vault

To create the Backup vault, run the following command:

```azurecli
az dataprotection backup-vault create --resource-group $backupvaultresourcegroup --vault-name $backupvault --location $region --type SystemAssigned --storage-settings datastore-type="VaultStore" type="GloballyRedundant"
```

The newly created vault has storage settings set as Globally Redundant, thus backups stored in vault tier will be available in the Azure paired region. Once the vault creation is complete, create a backup policy to protect AKS clusters.

## Create a backup policy

Retrieve the policy template using the command `az dataprotection backup-policy get-default-policy-template`.

```azurecli
az dataprotection backup-policy get-default-policy-template --datasource-type AzureKubernetesService > akspolicy.json
```

We update the default template for the backup policy and add a retention rule to retain **first successful backup per day** in the **Vault tier** for 30 days. 

```azurecli

az dataprotection backup-policy retention-rule create-lifecycle  --count 30 --retention-duration-type Days --copy-option ImmediateCopyOption --target-datastore VaultStore --source-datastore OperationalStore > ./retentionrule.json

az dataprotection backup-policy retention-rule set --lifecycles ./retentionrule.json --name Daily --policy ./akspolicy.json > ./akspolicy.json

```

Once the policy JSON has all the required values, proceed to create a new policy from the policy object.

```azurecli
az dataprotection backup-policy create -g testBkpVaultRG --vault-name TestBkpVault -n mypolicy --policy policy.json
```

## Prepare AKS cluster for backup

Once the vault and policy creation are complete, you need to perform the following prerequisites to get the AKS cluster ready for backup:

1. **Create a storage account and blob container**.

   Backup for AKS stores Kubernetes resources in a blob container as backups. To get the AKS cluster ready for backup, you need to install an extension in the cluster. This extension requires the storage account and blob container as inputs.

   To create a new storage account, run the following command:

   ```azurecli
   az storage account create --name $storageaccount --resource-group $storageaccountresourcegroup --location $region --sku Standard_LRS
   ```

   Once the storage account creation is complete, create a blob container inside by running the following command:

   ```azurecli
   az storage container create --name $blobcontainer --account-name $storageaccount --auth-mode login
   ```

2. **Install Backup Extension**.

   Backup Extension is mandatory to be installed in the AKS cluster to perform any backup and restore operations. The Backup Extension creates a namespace `dataprotection-microsoft` in the cluster and uses the same to deploy its resources. The extension requires the storage account and blob container as inputs for installation.

   ```azurecli
   az k8s-extension create --name azure-aks-backup --extension-type microsoft.dataprotection.kubernetes --scope cluster --cluster-type managedClusters --cluster-name $akscluster --resource-group $aksclusterresourcegroup --release-train stable --configuration-settings blobContainer=$blobcontainer storageAccount=$storageaccount storageAccountResourceGroup=$storageaccountresourcegroup storageAccountSubscriptionId=$subscriptionId
   ```

   As part of extension installation, a user identity is created in the AKS cluster's Node Pool Resource Group. For the extension to access the storage account, you need to provide this identity the **Storage Blob Data Contributor** role. To assign the required role, run the following command:

   ```azurecli
   az role assignment create --assignee-object-id $(az k8s-extension show --name azure-aks-backup --cluster-name $akscluster --resource-group $aksclusterresourcegroup --cluster-type managedClusters --query aksAssignedIdentity.principalId --output tsv) --role 'Storage Blob Data Contributor' --scope /subscriptions/$subscriptionId/resourceGroups/$storageaccountresourcegroup/providers/Microsoft.Storage/storageAccounts/$storageaccount
   ```

3. **Enable Trusted Access**

   For the Backup vault to connect with the AKS cluster, you must enable *Trusted Access* as it allows the Backup vault to have a direct line of sight to the AKS cluster.


   To enable Trusted Access, run the following command:

   ```azurecli
   az aks trustedaccess rolebinding create --cluster-name $akscluster --name backuprolebinding --resource-group $aksclusterresourcegroup --roles Microsoft.DataProtection/backupVaults/backup-operator --source-resource-id /subscriptions/$subscriptionId/resourceGroups/$backupvaultresourcegroup/providers/Microsoft.DataProtection/BackupVaults/$backupvault
   ```

## Configure vaulted backups for AKS cluster

With the created Backup vault and backup policy, and the AKS cluster in *ready-to-be-backed-up* state, you can now start to back up your AKS cluster.

### Prepare the request

The configuration of backup is performed in two steps:

1. Prepare backup configuration to define which cluster resources are to be backed up using the `az dataprotection backup-instance initialize-backupconfig` command. The command generates a JSON, which you can update to define backup configuration for your AKS cluster as required.

   ```azurecli
   az dataprotection backup-instance initialize-backupconfig --datasource-type AzureKubernetesService > aksbackupconfig.json
   ```
   

2. Prepare the relevant request using the relevant vault, policy, AKS cluster, backup configuration, and snapshot resource group using the `az dataprotection backup-instance initialize` command.

   ```azurecli
   az dataprotection backup-instance initialize --datasource-id /subscriptions/$subscriptionId/resourceGroups/$aksclusterresourcegroup/providers/Microsoft.ContainerService/managedClusters/$akscluster --datasource-location $region --datasource-type AzureKubernetesService --policy-id /subscriptions/$subscriptionId/resourceGroups/$backupvaultresourcegroup/providers/Microsoft.DataProtection/backupVaults/$backupvault/backupPolicies/$backuppolicy --backup-configuration ./aksbackupconfig.json --friendly-name ecommercebackup --snapshot-resource-group-name $snapshotresourcegroup > backupinstance.json
   ```

Now, use the JSON output of this command to configure backup for the AKS cluster.

### Assign required permissions and validate

With the request prepared, first you need to validate if the required roles are assigned to the resources involved by running the following command:

```azurecli
az dataprotection backup-instance validate-for-backup --backup-instance ./backupinstance.json --ids /subscriptions/$subscriptionId/resourceGroups/$backupvaultresourcegroup/providers/Microsoft.DataProtection/backupVaults/$backupvault
```

If the validation fails and there are certain permissions missing, then you can assign them by running the following command:

```azurecli
az dataprotection backup-instance update-msi-permissions command.
az dataprotection backup-instance update-msi-permissions --datasource-type AzureKubernetesService --operation Backup --permissions-scope ResourceGroup --vault-name $backupvault --resource-group $backupvaultresourcegroup --backup-instance backupinstance.json

```

Once the permissions are assigned, revalidate using the earlier *validate for backup* command and then proceed to configure backup:

```azurecli
az dataprotection backup-instance create --backup-instance  backupinstance.json --resource-group $backupvaultresourcegroup --vault-name $backupvault
```

## Next steps

- [Restore Azure Kubernetes Service cluster using Azure CLI](azure-kubernetes-service-cluster-restore-using-cli.md)
- [Manage Azure Kubernetes Service cluster backups](azure-kubernetes-service-cluster-manage-backups.md)
- [About Azure Kubernetes Service cluster backup](azure-kubernetes-service-cluster-backup-concept.md)
