---
title: Kubernetes on Azure tutorial - Scale application
description: In this Azure Kubernetes Service (AKS) tutorial, you learn how to scale nodes and pods and implement horizontal pod autoscaling.
ms.topic: tutorial
ms.date: 05/03/2023
ms.custom: mvc
#Customer intent: As a developer or IT pro, I want to learn how to scale my applications in an Azure Kubernetes Service (AKS) cluster so I can provide high availability or respond to customer demand and application load.
---

# Tutorial: Scale applications in Azure Kubernetes Service (AKS)

If you followed the previous tutorials, you have a working Kubernetes cluster and you deployed the sample Azure Voting app. In this tutorial, part five of seven, you scale out the pods in the app and try pod autoscaling. You also learn how to scale the number of Azure VM nodes to change the cluster's capacity for hosting workloads. You learn how to:

> [!div class="checklist"]
>
> * Scale the Kubernetes nodes.
> * Manually scale Kubernetes pods that run your application.
> * Configure autoscaling pods that run the app front-end.

In the upcoming tutorials, you update the Azure Vote application to a new version.

## Before you begin

In previous tutorials, you packaged an application into a container image, uploaded the image to Azure Container Registry, created an AKS cluster, and deployed the application to the AKS cluster.

If you haven't completed these steps and would like to follow along with this tutorial, start with the first tutorial, [Prepare an application for AKS][aks-tutorial-prepare-app].

### [Azure CLI](#tab/azure-cli)

This tutorial requires Azure CLI version 2.0.53 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

### [Azure PowerShell](#tab/azure-powershell)

This tutorial requires Azure PowerShell version 5.9.0 or later. Run `Get-InstalledModule -Name Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell][azure-powershell-install].

---

## Manually scale pods

When you deployed the Azure Vote front end and Redis instance in the previous tutorials, a single replica was created.

1. See the number and state of pods in your cluster using the [`kubectl get`][kubectl-get] command.

    ```console
    kubectl get pods
    ```

    The following example output shows one front-end pod and one back-end pod:

    ```output
    NAME                               READY     STATUS    RESTARTS   AGE
    azure-vote-back-2549686872-4d2r5   1/1       Running   0          31m
    azure-vote-front-848767080-tf34m   1/1       Running   0          31m
    ```

2. Manually change the number of pods in the *azure-vote-front* deployment using the [`kubectl scale`][kubectl-scale] command. The following example command increases the number of front-end pods to five:

    ```console
    kubectl scale --replicas=5 deployment/azure-vote-front
    ```

3. Verify the additional pods were created using the [`kubectl get pods`][kubectl-get] command.

    ```console
    kubectl get pods

                                        READY     STATUS    RESTARTS   AGE
    azure-vote-back-2606967446-nmpcf    1/1       Running   0          15m
    azure-vote-front-3309479140-2hfh0   1/1       Running   0          3m
    azure-vote-front-3309479140-bzt05   1/1       Running   0          3m
    azure-vote-front-3309479140-fvcvm   1/1       Running   0          3m
    azure-vote-front-3309479140-hrbf2   1/1       Running   0          15m
    azure-vote-front-3309479140-qphz8   1/1       Running   0          3m
    ```

## Autoscale pods

### [Azure CLI](#tab/azure-cli)

Kubernetes supports [horizontal pod autoscaling][kubernetes-hpa] to adjust the number of pods in a deployment depending on CPU utilization or other select metrics. The [Metrics Server][metrics-server] is automatically deployed into AKS clusters with versions 1.10 and higher and provides resource utilization to Kubernetes.

* Check the version of your AKS cluster using the [`az aks show`][az-aks-show] command.

    ```azurecli
    az aks show --resource-group myResourceGroup --name myAKSCluster --query kubernetesVersion --output table
    ```

### [Azure PowerShell](#tab/azure-powershell)

Kubernetes supports [horizontal pod autoscaling][kubernetes-hpa] to adjust the number of pods in a deployment depending on CPU utilization or other select metrics. The [Metrics Server][metrics-server] is automatically deployed into AKS clusters with versions 1.10 and higher and provides resource utilization to Kubernetes.

* Check the version of your AKS cluster using the [`Get-AzAksCluster`][get-azakscluster] cmdlet.

    ```azurepowershell
    (Get-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster).KubernetesVersion
    ```

---

> [!NOTE]
> If your AKS cluster is on a version lower than *1.10*, the Metrics Server isn't automatically installed. Metrics Server installation manifests are available as a `components.yaml` asset on Metrics Server releases, which means you can install them via a URL. To learn more about these YAML definitions, see the [Deployment][metrics-server-github] section of the readme.
>
> **Example installation**:
>
>    ```console
>    kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
>    ```

To use the autoscaler, all containers and pods must have defined CPU requests and limits. In the `azure-vote-front` deployment, the *front-end* container requests 0.25 CPU with a limit of 0.5 CPU.

These resource requests and limits are defined for each container, as shown in the following condensed example YAML:

```yaml
  containers:
  - name: azure-vote-front
    image: mcr.microsoft.com/azuredocs/azure-vote-front:v1
    ports:
    - containerPort: 80
    resources:
      requests:
        cpu: 250m
      limits:
        cpu: 500m
```

### Autoscale pods using `kubectl autoscale`

* Autoscale pods using the [`kubectl autoscale`][kubectl-autoscale] command. The following command autoscales the number of pods in the *azure-vote-front* deployment with the following conditions: if average CPU utilization across all pods exceeds 50% of the requested usage, the autoscaler increases the pods up to a maximum of 10 instances and a minimum of three instances for the deployment:

    ```console
    kubectl autoscale deployment azure-vote-front --cpu-percent=50 --min=3 --max=10
    ```

### Autoscale pods using a manifest file

1. Create a manifest file to define the autoscaler behavior and resource limits, as shown in the following example manifest file `azure-vote-hpa.yaml`:

    > [!NOTE]
    > If you're using `apiVersion: autoscaling/v2`, you can introduce more metrics when autoscaling, including custom metrics. For more information, see [Autoscale multiple metrics and custom metrics using `v2` of the `HorizontalPodAutoscaler`](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics).

    ```yaml
    apiVersion: autoscaling/v1
    kind: HorizontalPodAutoscaler
    metadata:
      name: azure-vote-back-hpa
    spec:
      maxReplicas: 10 # define max replica count
      minReplicas: 3  # define min replica count
      scaleTargetRef:
        apiVersion: apps/v1
        kind: Deployment
        name: azure-vote-back
      targetCPUUtilizationPercentage: 50 # target CPU utilization

    ---

    apiVersion: autoscaling/v1
    kind: HorizontalPodAutoscaler
    metadata:
      name: azure-vote-front-hpa
    spec:
      maxReplicas: 10 # define max replica count
      minReplicas: 3  # define min replica count
      scaleTargetRef:
        apiVersion: apps/v1
        kind: Deployment
        name: azure-vote-front
      targetCPUUtilizationPercentage: 50 # target CPU utilization
    ```

2. Apply the autoscaler manifest file using the `kubectl apply` command.

    ```console
    kubectl apply -f azure-vote-hpa.yaml
    ```

3. Check the status of the autoscaler using the `kubectl get hpa` command.

    ```console
    kubectl get hpa

    # Example output
    NAME               REFERENCE                     TARGETS    MINPODS   MAXPODS   REPLICAS   AGE
    azure-vote-front   Deployment/azure-vote-front   0% / 50%   3         10        3          2m
    ```

    After a few minutes, with minimal load on the Azure Vote app, the number of pod replicas decreases to three. You can use `kubectl get pods` again to see the unneeded pods being removed.

## Manually scale AKS nodes

If you created your Kubernetes cluster using the commands in the previous tutorials, your cluster has two nodes. If you want to increase or decrease this amount, you can manually adjust the number of nodes.

The following example increases the number of nodes to three in the Kubernetes cluster named *myAKSCluster*. The command takes a couple of minutes to complete.

### [Azure CLI](#tab/azure-cli)

* Scale your cluster nodes using the [`az aks scale`][az-aks-scale] command.

    ```azurecli
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

* Scale your cluster nodes using the [`Get-AzAksCluster`][get-azakscluster] and [`Set-AzAksCluster`][set-azakscluster] commands.

    ```azurepowershell
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

## Next steps

In this tutorial, you used different scaling features in your Kubernetes cluster. You learned how to:

> [!div class="checklist"]
>
> * Manually scale Kubernetes pods that run your application.
> * Configure autoscaling pods that run the app front end.
> * Manually scale the Kubernetes nodes.

In the next tutorial, you learn how to update applications in Kubernetes.

> [!div class="nextstepaction"]
> [Update an application in Kubernetes][aks-tutorial-update-app]

<!-- LINKS - external -->
[kubectl-autoscale]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#autoscale
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-scale]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#scale
[kubernetes-hpa]: https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/
[kubernetes-hpa-walkthrough]: https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/
[metrics-server-github]: https://github.com/kubernetes-sigs/metrics-server/blob/master/README.md#deployment
[metrics-server]: https://kubernetes.io/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#metrics-server

<!-- LINKS - internal -->
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[aks-tutorial-update-app]: ./tutorial-kubernetes-app-update.md
[az-aks-scale]: /cli/azure/aks#az_aks_scale
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-show]: /cli/azure/aks#az_aks_show
[azure-powershell-install]: /powershell/azure/install-az-ps
[get-azakscluster]: /powershell/module/az.aks/get-azakscluster
[set-azakscluster]: /powershell/module/az.aks/set-azakscluster
