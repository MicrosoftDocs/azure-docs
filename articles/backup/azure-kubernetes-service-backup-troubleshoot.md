---
title: Troubleshoot Azure Kubernetes Service backup
description: Symptoms, causes, and resolutions of Azure Kubernetes Service backup and restore.
ms.topic: troubleshooting
ms.date: 03/15/2023
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

## Next steps

- [About Azure Kubernetes Service (AKS) backup](azure-kubernetes-service-backup-overview.md)
