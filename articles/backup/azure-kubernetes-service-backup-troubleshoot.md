---
title: Troubleshoot Azure Kubernetes Service backup
description: Symptoms, causes, and resolutions of the Azure Kubernetes Service backup and restore operations.
ms.topic: troubleshooting
ms.date: 12/28/2023
ms.service: backup
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Troubleshoot Azure Kubernetes Service backup and restore

This article provides troubleshooting steps that help you resolve Azure Kubernetes Service (AKS) backup, restore, and management errors.

## AKS Backup Extension installation error resolutions

### Scenario 1

**Error message**:

   ```Error
   {Helm installation from path [] for release [azure-aks-backup] failed with the following error: err [release azure-aks-backup failed, and has been uninstalled due to atomic being set: failed post-install: timed out waiting for the condition]} occurred while doing the operation: {Installing the extension} on the config"`
   ```


**Cause**: The extension has been installed successfully, but the pods aren't spawning. This happens because the required compute and memory aren't available for the pods.

**Resolution**: To resolve the issue, increase the number of nodes in the cluster. This allows sufficient compute and memory to be available for the pods to spawn.
To scale node pool on Azure portal, follow these steps:

1. On the Azure portal, open the *AKS cluster*.
1. Go to **Node pools** under **Settings**.
1. Select **Scale node pool**, and then update the *minimum* and *maximum* values on the **Node count range**.
1. Select **Apply**.

### Scenario 2

**Error message**:

   ```Error
   BackupStorageLocation "default" is unavailable: rpc error: code = Unknown desc = azure.BearerAuthorizer#WithAuthorization: Failed to refresh the Token for request to https://management.azure.com/subscriptions/e30af180-aa96-4d81-981a-b67570b0d615/resourceGroups/AzureBackupRG_westeurope_1/providers/Microsoft.Storage/storageAccounts/devhayyabackup/listKeys?%24expand=kerb&api-version=2019-06-01: StatusCode=404 -- Original Error: adal: Refresh request failed. Status Code = '404'. Response body: no azure identity found for request clientID 4e95##### REDACTED #####0777`

   Endpoint http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&client_id=4e95dcc5-a769-4745-b2d9-
   ```

**Cause**: When you enable pod-managed identity on your AKS cluster, an *AzurePodIdentityException* named *aks-addon-exception* is added to the *kube-system* namespace. An *AzurePodIdentityException* allows pods with certain labels to access the Azure Instance Metadata Service (IMDS) endpoint without being intercepted by the NMI server.

The extension pods aren't exempt, and require the Microsoft Entra pod identity to be enabled manually.

**Resolution**: Create *pod-identity* exception in AKS cluster (that works only for *dataprotection-microsoft* namespace and for *not kube-system*). [Learn more](/cli/azure/aks/pod-identity/exception?view=azure-cli-latest&preserve-view=true#az-aks-pod-identity-exception-add).

1. Run the following command:

   ```azurecli-interactive
   az aks pod-identity exception add --resource-group shracrg --cluster-name shractestcluster --namespace dataprotection-microsoft --pod-labels app.kubernetes.io/name=dataprotection-microsoft-kubernetes
   ```

2. To verify *Azurepodidentityexceptions* in cluster, run the following command:

   ```azurecli-interactive
   kubectl get Azurepodidentityexceptions --all-namespaces
   ```

3. To assign the *Storage Account Contributor* role to the extension identity, run the following command:

   ```azurecli-interactive
   az role assignment create --assignee-object-id $(az k8s-extension show --name azure-aks-backup --cluster-name aksclustername --resource-group aksclusterresourcegroup --cluster-type managedClusters --query aksAssignedIdentity.principalId --output tsv) --role 'Storage Account Contributor' --scope /subscriptions/subscriptionid/resourceGroups/storageaccountresourcegroup/providers/Microsoft.Storage/storageAccounts/storageaccountname
   ```

### Scenario 3

**Error message**:

   ```Error
   {"Message":"Error in the getting the Configurations: error {Post \https://centralus.dp.kubernetesconfiguration.azure.com/subscriptions/ subscriptionid /resourceGroups/ aksclusterresourcegroup /provider/managedclusters/clusters/ aksclustername /configurations/getPendingConfigs?api-version=2021-11-01\: dial tcp: lookup centralus.dp.kubernetesconfiguration.azure.com on 10.63.136.10:53: no such host}","LogType":"ConfigAgentTrace","LogLevel":"Error","Environment":"prod","Role":"ClusterConfigAgent","Location":"centralus","ArmId":"/subscriptions/ subscriptionid /resourceGroups/ aksclusterresourcegroup /providers/Microsoft.ContainerService/managedclusters/ aksclustername ","CorrelationId":"","AgentName":"ConfigAgent","AgentVersion":"1.8.14","AgentTimestamp":"2023/01/19 20:24:16"}`
   ```
**Cause**: Specific FQDN/application rules are required to use cluster extensions in the AKS clusters. [Learn more](../aks/outbound-rules-control-egress.md#cluster-extensions).

This error appears due to absence of these FQDN rules because of which configuration information from the Cluster Extensions service wasn't available.

**Resolution**: To resolve the issue, you need to create a *CoreDNS-custom override* for the *DP* endpoint to pass through the public network.

1. To fetch *Existing CoreDNS-custom* YAML in your cluster (save it on your local for reference later), run the following command:

   ```azurecli-interactive
   kubectl get configmap coredns-custom -n kube-system -o yaml
   ```

2. To override mapping for *Central US DP* endpoint to public IP (download the YAML file attached), run the following command:

   ```azurecli-interactive
   kubectl apply -f corednsms.yaml
   ```

3. To force reload `coredns` pods, run the following command:

   ```azurecli-interactive
   kubectl delete pod --namespace kube-system -l k8s-app=kube-dns
   ```

4. To perform `NSlookup` from the *ExtensionAgent* pod to check if *coreDNS-custom* is working, run the following command:

   ```azurecli-interactive
   kubectl exec -i -t pod/extension-agent-<pod guid that's there in your cluster> -n kube-system -- nslookup centralus.dp.kubernetesconfiguration.azure.com
   ```

5. To check logs of the *ExtensionAgent* pod, run the following command:

   ```azurecli-interactive
   kubectl logs pod/extension-agent-<pod guid that’s there in your cluster> -n kube-system --tail=200
   ```

6. Delete and reinstall Backup Extension to initiate backup. 

## Backup Extension post installation related errors

These error codes appear due to issues on the Backup Extension installed in the AKS cluster.



### KubernetesBackupListExtensionsError: 

**Cause**: Backup vault as part of a validation, checks if the cluster has backup extension installed. For this, the Vault MSI needs a reader permission on the AKS cluster allowing it to list all the extensions installed in the cluster. 

**Recommended action**: Reassign the Reader role to the Vault MSI (remove the existing role assignment and assign the Reader role again), because the Reader role assigned is missing the *list-extension* permission in it. If reassignment fails, use a different Backup vault to configure backup.

### UserErrorKubernetesBackupExtensionNotFoundError

**Cause**: Backup vault as part of validation, checks if the cluster has the Backup extension installed. Vault performs an operation to list the extensions installed in the cluster. If the Backup extension is absent in the list, this error appears.

**Recommended action**: Use the CL or Azure portal client to delete the extension, and then install the extension again.

### UserErrorKubernetesBackupExtensionHasErrors

**Cause**: The Backup extension installed in the cluster has some internal errors.

**Recommended action**: Use the CL or Azure portal client to delete the extension, and then install the extension again.

### UserErrorKubernetesBackupExtensionIdentityNotFound

**Cause**: AKS backup requires a Backup extension installed in the cluster. The extension along with its installation has a User Identity created called extension MSI. This MSI is created in the Resource Group comprising the node pools for the AKS cluster. This MSI gets the required Roles assigned to access Backup Storage location. The error code suggests that the Extension Identity is missing.

**Recommended action**: Use the CLI or the Azure portal client to delete the extension, and then install the extension again. A new identity is created along with the extension.

### KubernetesBackupCustomResourcesTrackingTimeOutError

**Cause**: Azure Backup for AKS requires a Backup extension to be installed in the cluster. To perform the backup and restore operations, custom resources are created in the cluster. The extension-spawn pods that perform backup related operations via these CRs. This error occurs when the extension isn't able to update the status of these CRs.

**Recommended action**: The health of the extension is required to be verified via running the command `kubectl get pods -n dataprotection.microsoft`. If the pods aren't in running state, then increase the number of nodes in the cluster by *1* or increase the compute limits. Then wait for a few minutes and run the command again, which should change the state of the pods to *running*. If the issue persists, delete and reinstall the extension.

### BackupPluginDeleteBackupOperationFailed

**Cause**: The Backup extension should be running to delete the backups. 

**Recommended action**: If the cluster is running, verify if the extension is running in a healthy state. Check if the extension pods are spawning, otherwise, increase the nodes. If that fails, try deleting and reinstalling the extension. If the backed-up cluster is deleted, then manually delete the snapshots and metadata.

### ExtensionTimedOutWaitingForBackupItemSync

**Cause**: The Backup extension waits for the backup items to be synced with the storage account.

**Recommended action**: If this error code appears, then either retry the backup operation or reinstall the extension.

## Backup storage location based errors

These error codes appear due to issues based on the Backup extension installed in the AKS cluster.

### UserErrorDeleteBackupFailedBackupStorageLocationReadOnly

**Cause**: The storage account provided as input during Backup extension installation is in *read only* state, which doesn't allow to delete the backup data from the blob container. 

**Recommended action**: Change the storage account state from *read only* to *write*.

### UserErrorDeleteBackupFailedBackupStorageLocationNotFound

**Cause**: During the extension installation, a Backup Storage Location is to be provided as input that includes a storage account and blob container. This error appears if the location is deleted or incorrectly added during extension installation.

**Recommended action**: Delete the Backup extension, and then reinstall it with correct storage account and blob container as input.

### UserErrorBackupFailedBackupStorageLocationReadOnly

**Cause**: The storage account provided as input during Backup extension installation is in *read only* state, which doesn't allow to write backup data on the blob container.

**Recommended action**: Change the storage account state from *read only* to *write*.

### UserErrorNoDefaultBackupStorageLocationFound

**Cause**: During extension installation, a Backup Storage Location is to be provided as input, which includes a storage account and blob container. The error appears if the location is deleted or incorrectly entered during extension installation.

**Recommended action**: Delete the Backup extension, and then reinstall it with correct storage account and blob container as input.

### UserErrorExtensionMSIMissingPermissionsOnBackupStorageLocation

**Cause**: The Backup extension should have the *Storage Account Contributor* role on the Backup Storage Location (storage account). The Extension Identity gets this role assigned. 

**Recommended action**: If this role is missing, then use Azure portal or CLI to reassign this missing permission on the storage account.

### UserErrorBackupStorageLocationNotReady

**Cause**: During extension installation, a Backup Storage Location is to be provided as input that includes a storage account and blob container. The Backup extension should have *Storage Account Contributor* role on the Backup Storage Location (storage account). The Extension Identity gets this role assigned.

**Recommended action**: The error appears if the Extension Identity doesn't have right permissions to access the storage account. This  error appears if AKS backup extension is installed the first time when configuring protection operation. This happens for the time taken for the granted permissions to propagate to the AKS backup extension. As a workaround, wait an hour and retry the protection configuration. Otherwise, use Azure portal or CLI to reassign this missing permission on the storage account.

## Vaulted backup based errors

This error code can appear while you enable AKS backup to store backups in a vault standard datastore.

### DppUserErrorVaultTierPolicyNotSupported

**Cause**: This error code appears when a backup policy is created with retention rule defined for vault-standard datastore for a Backup vault in a region where this datastore isn't supported.

**Recommended action**: Update the retention rule with vault-standard duration defined on Azure portal:

1. Select **Edit** next to the rule, then clear the checkbox next the *vault-standard* and select **Save**.
2. Create a backup policy for operational tier backup (only snapshots for the AKS cluster).

## Next steps

- [About Azure Kubernetes Service (AKS) backup](azure-kubernetes-service-backup-overview.md)
