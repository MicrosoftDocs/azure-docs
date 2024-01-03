---
title: Azure Linux Container Host for AKS tutorial - Migrating to Azure Linux
description: In this Azure Linux Container Host for AKS tutorial, you will learn how to migrate your nodes to Azure Linux nodes.
author: htaubenfeld
ms.author: htaubenfeld
ms.service: microsoft-linux
ms.topic: tutorial
ms.date: 01/03/2024
---

# Tutorial: Migrate nodes to Azure Linux

In this tutorial, part three of five, you will migrate your existing nodes to Azure Linux. You can migrate your existing nodes to Azure Linux using one of the following methods:

* Cordon, drain, and remove the existing nodes.
* In-place OS SKU migration (Preview).

If you don't have any existing nodes to migrate to Azure Linux, skip to the [next tutorial](./tutorial-azure-linux-telemetry-monitor.md). In later tutorials, you'll learn how to enable telemetry and monitoring in your clusters and upgrade Azure Linux nodes.

## Prerequisites

* In previous tutorials, you created and deployed an Azure Linux Container Host for AKS cluster. To complete this tutorial, you need to add an Azure Linux node pool to your existing cluster. If you haven't done this step and would like to follow along, start with [Tutorial 2: Add an Azure Linux node pool to your existing AKS cluster](./tutorial-azure-linux-add-nodepool.md).

    > [!NOTE]
    > When adding a new Azure Linux node pool, you need to add at least one as `--mode System`. Otherwise, AKS won't allow you to delete your existing node pool.

* You need the latest version of Azure CLI. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Migrate nodes to Azure Linux: Cordon, drain, and remove

### Cordon the existing nodes

Cordoning marks specified nodes as unschedulable and prevents any more pods from being added to the nodes.

1. Get the names of the nodes you want to cordon using the `kubectl get nodes` command.

    ```azurecli-interactive
    kubectl get nodes
    ```

    Your output should look similar to the following example output:

    ```output
    NAME                                STATUS   ROLES   AGE     VERSION
    aks-nodepool1-31721111-vmss000000   Ready    agent   7d21h   v1.21.9
    aks-nodepool1-31721111-vmss000001   Ready    agent   7d21h   v1.21.9
    aks-nodepool1-31721111-vmss000002   Ready    agent   7d21h   v1.21.9
    ```

2. Specify the desired nodes to cordon in a space-separated list using the `kubectl cordon` command.

    ```azurecli-interactive
    kubectl cordon aks-nodepool1-31721111-vmss000000 aks-nodepool1-31721111-vmss000001 aks-nodepool1-31721111-vmss000002
    ```

    Your output should look similar to the following example output:

    ```output
    node/aks-nodepool1-31721111-vmss000000 cordoned
    node/aks-nodepool1-31721111-vmss000001 cordoned
    node/aks-nodepool1-31721111-vmss000002 cordoned
    ```

### Drain the existing nodes

> [!IMPORTANT]
> To successfully drain nodes and evict running pods, ensure that any PodDisruptionBudgets (PDBs) allow for at least one pod replica to be moved at a time, otherwise the drain/evict operation will fail. To check this, you can run `kubectl get pdb -A` and make sure `ALLOWED DISRUPTIONS` is at least one or higher.

Draining nodes causes the pods running on them to be evicted and recreated on the other schedulable nodes.

1. Specify the desired nodes to drain in a space-separated list using the `kubectl drain` command with the `--ignore-daemonsets` and `--delete-emptydir-data` flags.

    > [!IMPORTANT]
    > Using `--delete-emptydir-data` is required to evict the AKS-created `coredns` and `metrics-server` pods. If this flag isn't used, an error is expected. For more information, see the [documentation on emptydir](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir).

    ```azurecli-interactive
    kubectl drain aks-nodepool1-31721111-vmss000000 aks-nodepool1-31721111-vmss000001 aks-nodepool1-31721111-vmss000002 --ignore-daemonsets --delete-emptydir-data
    ```

    After the drain operation finishes, all pods other than those controlled by daemon sets run on the new node pool.

2. Verify that the pods are running on the new node pool using the `kubectl get pods -o wide -A` command.

    ```azurecli-interactive
    kubectl get pods -o wide -A
    ```

    Your output should look similar to the following example output:

    ```output
    NAMESPACE     NAME                                  READY   STATUS    RESTARTS   AGE     IP           NODE                                 NOMINATED NODE   READINESS GATES
    default       sampleapp2-74b4b974ff-676sz           1/1     Running   0          15m     10.244.4.5   aks-mynodepool-20823458-vmss000002   <none>           <none>
    default       sampleapp2-76b6c4c59b-rhmzq           1/1     Running   0          16m     10.244.4.3   aks-mynodepool-20823458-vmss000002   <none>           <none>
    kube-system   azure-ip-masq-agent-4n66k             1/1     Running   0          10d     10.240.0.6   aks-nodepool1-31721111-vmss000002    <none>           <none>
    kube-system   azure-ip-masq-agent-9p4c8             1/1     Running   0          10d     10.240.0.4   aks-nodepool1-31721111-vmss000000    <none>           <none>
    kube-system   azure-ip-masq-agent-nb7mx             1/1     Running   0          10d     10.240.0.5   aks-nodepool1-31721111-vmss000001    <none>           <none>
    kube-system   azure-ip-masq-agent-sxn96             1/1     Running   0          49m     10.240.0.9   aks-mynodepool-20823458-vmss000002   <none>           <none>
    kube-system   azure-ip-masq-agent-tsq98             1/1     Running   0          49m     10.240.0.8   aks-mynodepool-20823458-vmss000001   <none>           <none>
    kube-system   azure-ip-masq-agent-xzrdl             1/1     Running   0          49m     10.240.0.7   aks-mynodepool-20823458-vmss000000   <none>           <none>
    kube-system   coredns-845757d86-d2pkc               1/1     Running   0          17m     10.244.3.2   aks-mynodepool-20823458-vmss000000   <none>           <none>
    kube-system   coredns-845757d86-f8g9s               1/1     Running   0          17m     10.244.5.2   aks-mynodepool-20823458-vmss000001   <none>           <none>
    kube-system   coredns-autoscaler-5f85dc856b-f8xh2   1/1     Running   0          17m     10.244.4.2   aks-mynodepool-20823458-vmss000002   <none>           <none>
    kube-system   csi-azuredisk-node-7md2w              3/3     Running   0          49m     10.240.0.7   aks-mynodepool-20823458-vmss000000   <none>           <none>
    kube-system   csi-azuredisk-node-9nfzt              3/3     Running   0          10d     10.240.0.4   aks-nodepool1-31721111-vmss000000    <none>           <none>
    kube-system   csi-azuredisk-node-bblsb              3/3     Running   0          10d     10.240.0.5   aks-nodepool1-31721111-vmss000001    <none>           <none>
    kube-system   csi-azuredisk-node-lcmtz              3/3     Running   0          49m     10.240.0.9   aks-mynodepool-20823458-vmss000002   <none>           <none>
    kube-system   csi-azuredisk-node-mmncr              3/3     Running   0          49m     10.240.0.8   aks-mynodepool-20823458-vmss000001   <none>           <none>
    kube-system   csi-azuredisk-node-tjhj4              3/3     Running   0          10d     10.240.0.6   aks-nodepool1-31721111-vmss000002    <none>           <none>
    kube-system   csi-azurefile-node-29w6z              3/3     Running   0          49m     10.240.0.9   aks-mynodepool-20823458-vmss000002   <none>           <none>
    kube-system   csi-azurefile-node-4nrx7              3/3     Running   0          49m     10.240.0.7   aks-mynodepool-20823458-vmss000000   <none>           <none>
    kube-system   csi-azurefile-node-9pcr8              3/3     Running   0          3d11h   10.240.0.6   aks-nodepool1-31721111-vmss000002    <none>           <none>
    kube-system   csi-azurefile-node-bh2pc              3/3     Running   0          3d11h   10.240.0.5   aks-nodepool1-31721111-vmss000001    <none>           <none>
    kube-system   csi-azurefile-node-gqqnv              3/3     Running   0          49m     10.240.0.8   aks-mynodepool-20823458-vmss000001   <none>           <none>
    kube-system   csi-azurefile-node-h75gq              3/3     Running   0          3d11h   10.240.0.4   aks-nodepool1-31721111-vmss000000    <none>           <none>
    kube-system   konnectivity-agent-6cd55c69cf-2bbp5   1/1     Running   0          17m     10.240.0.7   aks-mynodepool-20823458-vmss000000   <none>           <none>
    kube-system   konnectivity-agent-6cd55c69cf-7xzxj   1/1     Running   0          16m     10.240.0.8   aks-mynodepool-20823458-vmss000001   <none>           <none>
    kube-system   kube-proxy-4wzx7                      1/1     Running   0          10d     10.240.0.4   aks-nodepool1-31721111-vmss000000    <none>           <none>
    kube-system   kube-proxy-7h8r5                      1/1     Running   0          49m     10.240.0.7   aks-mynodepool-20823458-vmss000000   <none>           <none>
    kube-system   kube-proxy-g5tvr                      1/1     Running   0          10d     10.240.0.6   aks-nodepool1-31721111-vmss000002    <none>           <none>
    kube-system   kube-proxy-mrv54                      1/1     Running   0          10d     10.240.0.5   aks-nodepool1-31721111-vmss000001    <none>           <none>
    kube-system   kube-proxy-nqmnj                      1/1     Running   0          49m     10.240.0.9   aks-mynodepool-20823458-vmss000002   <none>           <none>
    kube-system   kube-proxy-zn77s                      1/1     Running   0          49m     10.240.0.8   aks-mynodepool-20823458-vmss000001   <none>           <none>
    kube-system   metrics-server-774f99dbf4-2x6x8       1/1     Running   0          16m     10.244.4.4   aks-mynodepool-20823458-vmss000002   <none>           <none>
    ```

### Remove the existing nodes

* Remove the existing nodes using the `az aks delete` command. The final result is the AKS cluster having a single Azure Linux node pool with the desired SKU size and all the applications and pods properly running.

    ```azurecli-interactive
    az aks nodepool delete \
        --resource-group testAzureLinuxResourceGroup \
        --cluster-name testAzureLinuxCluster \
        --name myExistingNodePool
    ```

## In-place OS SKU migration (Preview)

You can now migrate your existing Linux node pools to Azure Linux by changing the OS SKU of the node pool, which rolls the cluster through the standard node image upgrade process. This new feature doesn't require the creation of new node pools.

### Limitations

The OS SKU migration feature is currently available through ARM, Bicep, and the Azure CLI. Please note that OS SKU migration isn't able to rename existing node pools.

There are several settings that can block the OS SKU migration request. To ensure a successful migration, please review the following guidelines and limitations:

* Ubuntu and Azure Linux are the only supported Linux OS SKU migration targets.
* AgentPool `count` field must not change during the migration.
* An Ubuntu OS SKU with `UseGPUDedicatedVHD` enabled can't perform an OS SKU migration.
* An Ubuntu OS SKU with CVM 20.04 enabled can't perform an OS SKU migration.
* Node pools with Kata enabled can't perform an OS SKU migration.
* Windows OS SKU migration isn't supported.

### Prerequisites

1. Register for the `OSSKUMigrationPreview` feature flag on your subscription using `az feature register --namespace Microsoft.ContainerService --name OSSKUMigrationPreview --subscription <your-subscription-id>`.
2. We recommend that you ensure your workloads configure and run successfully on the Azure Linux container host before attempting to use the OS SKU migration feature. You can do this by [deploying an Azure Linux cluster](./quickstart-azure-cli.md) in dev/prod and verifying your service remains healthy.
3. Ensure the migration feature is working for you in test/dev before using the process on a production cluster.
4. Ensure that your pods have enough [Pod Disruption Budget](../aks/operator-best-practices-scheduler.md#plan-for-availability-using-pod-disruption-budgets) to allow AKS to move pods between VMs during the upgrade.
5. You need the latest version of Azure CLI. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

### Deploy a test cluster using example ARM templates

#### Example ARM templates

##### 0base.json

```json
 {
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.ContainerService/managedClusters",
      "apiVersion": "2023-07-01",
      "name": "akstestcluster",
      "location": "[resourceGroup().location]",
      "tags": {
        "displayname": "Demo of AKS Nodepool Migration"
      },
      "identity": {
        "type": "SystemAssigned"
      },
      "properties": {
        "enableRBAC": true,
        "dnsPrefix": "testcluster",
        "agentPoolProfiles": [
          {
            "name": "testnp",
            "count": 3,
            "vmSize": "Standard_D4a_v4",
            "osType": "Linux",
            "osSku": "Ubuntu",
            "mode": "System"
          }
        ]
      }
    }
  ]
}
```

##### 1mcupdate.json

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.ContainerService/managedClusters",
      "apiVersion": "2023-07-01",
      "name": "akstestcluster",
      "location": "[resourceGroup().location]",
      "tags": {
        "displayname": "Demo of AKS Nodepool Migration"
      },
      "identity": {
        "type": "SystemAssigned"
      },
      "properties": {
        "enableRBAC": true,
        "dnsPrefix": "testcluster",
        "agentPoolProfiles": [
          {
            "name": "testnp",
            "osType": "Linux",
            "osSku": "AzureLinux",
            "mode": "System"
          }
        ]
      }
    }
  ]
} 
```

##### 2apupdate.json

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "apiVersion": "2023-07-01",
      "type": "Microsoft.ContainerService/managedClusters/agentPools",
      "name": "akstestcluster/testnp",
      "location": "[resourceGroup().location]",
      "properties": {
        "osType": "Linux",
        "osSku": "Ubuntu",
        "mode": "System"
      }
    }
  ]
}
```

#### Deploy a test cluster

1. Create a resource group for the test cluster using the `az group create` command.

    ```azurecli-interactive
    az group create --name testRG --location eastus
    ```

2. Deploy a baseline Ubuntu OS SKU cluster with three nodes using the `az deployment group create` command and the [0base.json example ARM template](#0basejson).

    ```azurecli-interactive
    az deployment group create --resource-group testRG --template-file 0base.json
    ```

3. Migrate the OS SKU of your system node pool to Azure Linux using the `az deployment group create` command and the ManagedClusters API in the [1mcupdate.json example ARM template](#1mcupdatejson).

    ```azurecli-interactive
    az deployment group create --resource-group testRG --template-file 1mcupdate.json
    ```

4. Migrate the OS SKU of your system node pool back to Ubuntu using the `az deployment group create` command and the AgentPools API in the [2apupdate.json example ARM template](#2apupdatejson).

    ```azurecli-interactive
    az deployment group create --resource-group testRG --template-file 2apupdate.json
    ```

### Verify the OS SKU migration

Once the migration is complete on your test clusters, you should verify the following to ensure a successful migration:

* If your migration target is Azure Linux, run the `kubectl get nodes- o wide` command. The output should show "CBL-Mariner/Linux" are your OS image and ".cm2" at the end of your kernel version.
* Verify that all of your pods and daemonsets are running on the new node pool using the `kubectl get pods -o wide -A` command.
* Verify that all of the node labels in your upgraded node pool are what you expect using the `kubectl get nodes --show-labels` command.

***We recommend monitoring the health of your service for a couple weeks before migrating your production clusters***.

### Run the OS SKU migration on your production clusters

1. Upgrade your existing templates to set `OSSKU=AzureLinux`. In ARM template, this requires setting `"OSSKU: "AzureLinux"` in the `agentPoolProfile` section. In Bicep, this requires setting `osSku: "AzureLinux"` in the `agentPoolProfile` section. Make sure that your `apiVersion` is set to `2023-07-01` or later.
2. Redeploy your ARM template for the cluster to apply the new `OSSKU` setting. During this deploy, your cluster will behave as if it's taking a node image upgrade. Your cluster will surge capacity, and then reboot your existing nodes one by one into the latest AKS image from your new OS SKU.

### Rollback

If you experience issues during the OS SKU migration, you can roll back to your previous OS SKU. To do this, you need to change the OS SKU field in your template and resubmit the deployment, which triggers another upgrade operation and restores the node pool to its previous OS SKU.

## Next steps

In this tutorial, you migrated existing nodes to Azure Linux using one of the following methods:

* Cordon, drain, and remove the existing nodes.
* In-place OS SKU migration (Preview).

In the next tutorial, you'll learn how to enable telemetry to monitor  your clusters.

> [!div class="nextstepaction"]
> [Enable telemetry and monitoring](./tutorial-azure-linux-telemetry-monitor.md)
