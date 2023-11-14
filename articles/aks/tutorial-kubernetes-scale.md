---
title: Kubernetes on Azure tutorial - Scale applications in Azure Kubernetes Service (AKS)
description: In this Azure Kubernetes Service (AKS) tutorial, you learn how to scale nodes and pods and implement horizontal pod autoscaling.
ms.topic: tutorial
ms.date: 10/23/2023
ms.custom: mvc
#Customer intent: As a developer or IT pro, I want to learn how to scale my applications in an Azure Kubernetes Service (AKS) cluster so I can provide high availability or respond to customer demand and application load.
---

# Tutorial - Scale applications in Azure Kubernetes Service (AKS)

If you followed the previous tutorials, you have a working Kubernetes cluster and Azure Store Front app.

In this tutorial, part six of seven, you scale out the pods in the app, try pod autoscaling, and scale the number of Azure VM nodes to change the cluster's capacity for hosting workloads. You learn how to:

> [!div class="checklist"]
>
> * Scale the Kubernetes nodes.
> * Manually scale Kubernetes pods that run your application.
> * Configure autoscaling pods that run the app front end.

## Before you begin

In previous tutorials, you packaged an application into a container image, uploaded the image to Azure Container Registry, created an AKS cluster, deployed an application, and used Azure Service Bus to redeploy an updated application. If you haven't completed these steps and want to follow along, start with [Tutorial 1 - Prepare application for AKS][aks-tutorial-prepare-app].

### [Azure CLI](#tab/azure-cli)

This tutorial requires Azure CLI version 2.34.1 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

### [Azure PowerShell](#tab/azure-powershell)

This tutorial requires Azure PowerShell version 5.9.0 or later. Run `Get-InstalledModule -Name Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell][azure-powershell-install].

---

## Manually scale pods

1. View the pods in your cluster using the [`kubectl get`][kubectl-get] command.

    ```console
    kubectl get pods
    ```

    The following example output shows the pods running the Azure Store Front app:

    ```output
    NAME                               READY     STATUS     RESTARTS   AGE
    order-service-848767080-tf34m      1/1       Running    0          31m
    product-service-4019737227-2q2qz   1/1       Running    0          31m
    store-front-2606967446-2q2qz       1/1       Running    0          31m
    ```

2. Manually change the number of pods in the *store-front* deployment using the [`kubectl scale`][kubectl-scale] command.

    ```console
    kubectl scale --replicas=5 deployment.apps/store-front
    ```

3. Verify the additional pods were created using the [`kubectl get pods`][kubectl-get] command.

    ```console
    kubectl get pods
    ```

    The following example output shows the additional pods running the Azure Store Front app:

    ```output
                                      READY     STATUS    RESTARTS   AGE
    store-front-2606967446-2q2qzc     1/1       Running   0          15m
    store-front-3309479140-2hfh0      1/1       Running   0          3m
    store-front-3309479140-bzt05      1/1       Running   0          3m
    store-front-3309479140-fvcvm      1/1       Running   0          3m
    store-front-3309479140-hrbf2      1/1       Running   0          15m
    store-front-3309479140-qphz8      1/1       Running   0          3m
    ```

## Autoscale pods

To use the horizontal pod autoscaler, all containers and pods must have defined CPU requests and limits. In the `aks-store-quickstart` deployment, the *front-end* container requests 1m CPU with a limit of 1000m CPU.

These resource requests and limits are defined for each container, as shown in the following condensed example YAML:

```yaml
...
  containers:
  - name: store-front
    image: ghcr.io/azure-samples/aks-store-demo/store-front:latest
    ports:
    - containerPort: 8080
      name: store-front
...
    resources:
      requests:
        cpu: 1m
...
      limits:
        cpu: 1000m
...
```

### Autoscale pods using a manifest file

1. Create a manifest file to define the autoscaler behavior and resource limits, as shown in the following condensed example manifest file `aks-store-quickstart-hpa.yaml`:

    ```yaml
    apiVersion: autoscaling/v1
    kind: HorizontalPodAutoscaler
    metadata:
      name: store-front-hpa
    spec:
      maxReplicas: 10 # define max replica count
      minReplicas: 3  # define min replica count
      scaleTargetRef:
        apiVersion: apps/v1
        kind: Deployment
        name: store-front
      targetCPUUtilizationPercentage: 50 # target CPU utilization
    ```

2. Apply the autoscaler manifest file using the `kubectl apply` command.

    ```console
    kubectl apply -f aks-store-quickstart-hpa.yaml
    ```

3. Check the status of the autoscaler using the `kubectl get hpa` command.

    ```console
    kubectl get hpa
    ```

    After a few minutes, with minimal load on the Azure Store Front app, the number of pod replicas decreases to three. You can use `kubectl get pods` again to see the unneeded pods being removed.

> [!NOTE]
> You can enable the Kubernetes-based Event-Driven Autoscaler (KEDA) AKS add-on to your cluster to drive scaling based on the number of events needing to be processed. For more information, see [Enable simplified application autoscaling with the Kubernetes Event-Driven Autoscaling (KEDA) add-on (Preview)][keda-addon].

## Manually scale AKS nodes

If you created your Kubernetes cluster using the commands in the previous tutorials, your cluster has two nodes. If you want to increase or decrease this amount, you can manually adjust the number of nodes.

The following example increases the number of nodes to three in the Kubernetes cluster named *myAKSCluster*. The command takes a couple of minutes to complete.

### [Azure CLI](#tab/azure-cli)

* Scale your cluster nodes using the [`az aks scale`][az-aks-scale] command.

    ```azurecli-interactive
    az aks scale --resource-group myResourceGroup --name myAKSCluster --node-count 3
    ```

    Once the cluster successfully scales, your output will be similar to following example output:

    ```output
    "agentPoolProfiles": [
      {
        "count": 3,
        "dnsPrefix": null,
        "fqdn": null,
        "name": "myAKSCluster",
        "osDiskSizeGb": null,
        "osType": "Linux",
        "ports": null,
        "storageProfile": "ManagedDisks",
        "vmSize": "Standard_D2_v2",
        "vnetSubnetId": null
      }
    ```

### [Azure PowerShell](#tab/azure-powershell)

* Scale your cluster nodes using the [`Get-AzAksCluster`][get-azakscluster] and [`Set-AzAksCluster`][set-azakscluster] cmdlets.

    ```azurepowershell-interactive
    Get-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster | Set-AzAksCluster -NodeCount 3
    ```

    Once the cluster successfully scales, your output will be similar to following example output:

    ```output
    ProvisioningState       : Succeeded
    MaxAgentPools           : 100
    KubernetesVersion       : 1.19.9
    DnsPrefix               : myAKSCluster
    Fqdn                    : myakscluster-000a0aa0.hcp.eastus.azmk8s.io
    PrivateFQDN             :
    AgentPoolProfiles       : {default}
    WindowsProfile          : Microsoft.Azure.Commands.Aks.Models.PSManagedClusterWindowsProfile
    AddonProfiles           : {}
    NodeResourceGroup       : MC_myresourcegroup_myAKSCluster_eastus
    EnableRBAC              : True
    EnablePodSecurityPolicy :
    NetworkProfile          : Microsoft.Azure.Commands.Aks.Models.PSContainerServiceNetworkProfile
    AadProfile              :
    ApiServerAccessProfile  :
    Identity                :
    LinuxProfile            : Microsoft.Azure.Commands.Aks.Models.PSContainerServiceLinuxProfile
    ServicePrincipalProfile : Microsoft.Azure.Commands.Aks.Models.PSContainerServiceServicePrincipalProfile
    Id                      : /subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/myresourcegroup/providers/Micros
                          oft.ContainerService/managedClusters/myAKSCluster
    Name                    : myAKSCluster
    Type                    : Microsoft.ContainerService/ManagedClusters
    Location                : eastus
    Tags                    : {}
    ```

---

You can also autoscale the nodes in your cluster. For more information, see [Use the cluster autoscaler with node pools](./cluster-autoscaler.md#use-the-cluster-autoscaler-with-node-pools).

## Next steps

In this tutorial, you used different scaling features in your Kubernetes cluster. You learned how to:

> [!div class="checklist"]
>
> * Manually scale Kubernetes pods that run your application.
> * Configure autoscaling pods that run the app front end.
> * Manually scale the Kubernetes nodes.

In the next tutorial, you learn how to upgrade Kubernetes in your AKS cluster.

> [!div class="nextstepaction"]
> [Upgrade Kubernetes in Azure Kubernetes Service][aks-tutorial-upgrade-kubernetes]

<!-- LINKS - external -->
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-scale]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#scale

<!-- LINKS - internal -->
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[az-aks-scale]: /cli/azure/aks#az_aks_scale
[azure-cli-install]: /cli/azure/install-azure-cli
[azure-powershell-install]: /powershell/azure/install-az-ps
[get-azakscluster]: /powershell/module/az.aks/get-azakscluster
[set-azakscluster]: /powershell/module/az.aks/set-azakscluster
[aks-tutorial-upgrade-kubernetes]: ./tutorial-kubernetes-upgrade-cluster.md
[keda-addon]: ./keda-about.md