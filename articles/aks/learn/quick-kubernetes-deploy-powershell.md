---
title: 'Quickstart: Deploy an AKS cluster by using PowerShell'
description: Learn how to quickly create a Kubernetes cluster and deploy an application in Azure Kubernetes Service (AKS) using PowerShell.
ms.topic: quickstart
ms.date: 11/01/2022
ms.custom: devx-track-azurepowershell, mode-api, devx-track-linux
#Customer intent: As a developer or cluster operator, I want to quickly create an AKS cluster and deploy an application so that I can see how to run applications using the managed Kubernetes service in Azure.
---

# Quickstart: Deploy an Azure Kubernetes Service cluster using PowerShell

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage clusters. In this quickstart, you will:

* Deploy an AKS cluster using PowerShell.
* Run a sample multi-container application with a web front-end and a Redis instance in the cluster.

:::image type="content" source="media/quick-kubernetes-deploy-portal/azure-voting-application.png" alt-text="Screenshot of browsing to Azure Vote sample application.":::

This quickstart assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

- If you're running PowerShell locally, install the Az PowerShell module and connect to your Azure account using the [Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) cmdlet. For more information about installing the Az PowerShell module, see [Install Azure PowerShell][install-azure-powershell].

- The identity you are using to create your cluster has the appropriate minimum permissions. For more details on access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)](../concepts-identity.md).

- If you have multiple Azure subscriptions, select the appropriate subscription ID in which the resources should be billed using the
[Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.

    ```azurepowershell-interactive
    Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
    ```

[!INCLUDE [cloud-shell-try-it](../../../includes/cloud-shell-try-it.md)]

## Create a resource group

An [Azure resource group](../../azure-resource-manager/management/overview.md) is a logical group in which Azure resources are deployed and managed. When you create a resource group, you will be prompted to specify a location. This location is:

* The storage location of your resource group metadata.
* Where your resources will run in Azure if you don't specify another region during resource creation.

The following example creates a resource group named *myResourceGroup* in the *eastus* region.

Create a resource group using the [New-AzResourceGroup][new-azresourcegroup] cmdlet.

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroup -Location eastus
```

The following output example resembles successful creation of the resource group:

```plaintext
ResourceGroupName : myResourceGroup
Location          : eastus
ProvisioningState : Succeeded
Tags              :
ResourceId        : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup
```

## Create AKS cluster

Create an AKS cluster using the [New-AzAksCluster][new-azakscluster] cmdlet with the *-WorkspaceResourceId* parameter to enable [Azure Monitor container insights][azure-monitor-containers].

1. Create an AKS cluster named **myAKSCluster** with one node.

    ```azurepowershell-interactive
    New-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster -NodeCount 1 -GenerateSshKey -WorkspaceResourceId <WORKSPACE_RESOURCE_ID>
    ```

After a few minutes, the command completes and returns information about the cluster.

> [!NOTE]
> When you create an AKS cluster, a second resource group is automatically created to store the AKS resources. For more information, see [Why are two resource groups created with AKS?](../faq.md#why-are-two-resource-groups-created-with-aks)

## Connect to the cluster

To manage a Kubernetes cluster, use the Kubernetes command-line client, [kubectl][kubectl]. `kubectl` is already installed if you use Azure Cloud Shell.

1. Install `kubectl` locally using the `Install-AzAksCliTool` cmdlet:

    ```azurepowershell
    Install-AzAksCliTool
    ```

2. Configure `kubectl` to connect to your Kubernetes cluster using the [Import-AzAksCredential][import-azakscredential] cmdlet. The following cmdlet downloads credentials and configures the Kubernetes CLI to use them.

    ```azurepowershell-interactive
    Import-AzAksCredential -ResourceGroupName myResourceGroup -Name myAKSCluster
    ```

3. Verify the connection to your cluster using the [kubectl get][kubectl-get] command. This command returns a list of the cluster nodes.

    ```azurepowershell-interactive
    kubectl get nodes
    ```

    The following output example shows the single node created in the previous steps. Make sure the node status is *Ready*:

    ```plaintext
    NAME                       STATUS   ROLES   AGE     VERSION
    aks-nodepool1-31718369-0   Ready    agent   6m44s   v1.15.10
    ```

## Deploy the application

A [Kubernetes manifest file][kubernetes-deployment] defines a cluster's desired state, such as which container images to run.

In this quickstart, you will use a manifest to create all objects needed to run the [Azure Vote application][azure-vote-app]. This manifest includes two [Kubernetes deployments][kubernetes-deployment]:

* The sample Azure Vote Python applications.
* A Redis instance.

Two [Kubernetes Services][kubernetes-service] are also created:

* An internal service for the Redis instance.
* An external service to access the Azure Vote application from the internet.

1. Create a file named `azure-vote.yaml`.
    
1. Copy in the following YAML definition:

    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: azure-vote-back
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: azure-vote-back
      template:
        metadata:
          labels:
            app: azure-vote-back
        spec:
          nodeSelector:
            "kubernetes.io/os": linux
          containers:
          - name: azure-vote-back
            image: mcr.microsoft.com/oss/bitnami/redis:6.0.8
            env:
            - name: ALLOW_EMPTY_PASSWORD
              value: "yes"
            resources:
              requests:
                cpu: 100m
                memory: 128Mi
              limits:
                cpu: 250m
                memory: 256Mi
            ports:
            - containerPort: 6379
              name: redis
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: azure-vote-back
    spec:
      ports:
      - port: 6379
      selector:
        app: azure-vote-back
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: azure-vote-front
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: azure-vote-front
      template:
        metadata:
          labels:
            app: azure-vote-front
        spec:
          nodeSelector:
            "kubernetes.io/os": linux
          containers:
          - name: azure-vote-front
            image: mcr.microsoft.com/azuredocs/azure-vote-front:v1
            resources:
              requests:
                cpu: 100m
                memory: 128Mi
              limits:
                cpu: 250m
                memory: 256Mi
            ports:
            - containerPort: 80
            env:
            - name: REDIS
              value: "azure-vote-back"
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: azure-vote-front
    spec:
      type: LoadBalancer
      ports:
      - port: 80
      selector:
        app: azure-vote-front
    ```

    For a breakdown of YAML manifest files, see [Deployments and YAML manifests](../concepts-clusters-workloads.md#deployments-and-yaml-manifests).

1. Deploy the application using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest:

    ```azurepowershell-interactive
    kubectl apply -f azure-vote.yaml
    ```

    The following example resembles output showing the successfully created deployments and services:

    ```plaintext
    deployment.apps/azure-vote-back created
    service/azure-vote-back created
    deployment.apps/azure-vote-front created
    service/azure-vote-front created
    ```

## Test the application

When the application runs, a Kubernetes service exposes the application front end to the internet. This process can take a few minutes to complete.

Monitor progress using the [kubectl get service][kubectl-get] command with the `--watch` argument.

```azurepowershell-interactive
kubectl get service azure-vote-front --watch
```

The **EXTERNAL-IP** output for the `azure-vote-front` service will initially show as *pending*.

```plaintext
NAME               TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
azure-vote-front   LoadBalancer   10.0.37.27   <pending>     80:30572/TCP   6s
```

Once the **EXTERNAL-IP** address changes from *pending* to an actual public IP address, use `CTRL-C` to stop the `kubectl` watch process. The following example output shows a valid public IP address assigned to the service:

```plaintext
azure-vote-front   LoadBalancer   10.0.37.27   52.179.23.131   80:30572/TCP   2m
```

To see the Azure Vote app in action, open a web browser to the external IP address of your service.

:::image type="content" source="media/quick-kubernetes-deploy-portal/azure-voting-application.png" alt-text="Screenshot of browsing to Azure Vote sample application.":::

## Delete the cluster

To avoid Azure charges, if you don't plan on going through the tutorials that follow, clean up your unnecessary resources. Use the [Remove-AzResourceGroup][remove-azresourcegroup] cmdlet to remove the resource group, container service, and all related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup
```

> [!NOTE]
> The AKS cluster was created with system-assigned managed identity (default identity option used in this quickstart), the identity is managed by the platform and does not require removal.

## Next steps

In this quickstart, you deployed a Kubernetes cluster and then deployed a sample multi-container application to it.

To learn more about AKS, and walk through a complete code to deployment example, continue to the Kubernetes cluster tutorial.

> [!div class="nextstepaction"]
> [AKS tutorial][aks-tutorial]

<!-- LINKS - external -->
[azure-monitor-containers]: ../../azure-monitor/containers/container-insights-overview.md
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[azure-dev-spaces]: /previous-versions/azure/dev-spaces/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[azure-vote-app]: https://github.com/Azure-Samples/azure-voting-app-redis.git

<!-- LINKS - internal -->
[windows-container-powershell]: ../windows-container-powershell.md
[kubernetes-concepts]: ../concepts-clusters-workloads.md
[aks-monitor]: ../../azure-monitor/containers/container-insights-onboard.md
[install-azure-powershell]: /powershell/azure/install-az-ps
[new-azresourcegroup]: /powershell/module/az.resources/new-azresourcegroup
[new-azakscluster]: /powershell/module/az.aks/new-azakscluster
[import-azakscredential]: /powershell/module/az.aks/import-azakscredential
[kubernetes-deployment]: ../concepts-clusters-workloads.md#deployments-and-yaml-manifests
[azure-monitor-containers]: ../../azure-monitor/containers/container-insights-overview.md
[kubernetes-service]: ../concepts-network.md#services
[remove-azresourcegroup]: /powershell/module/az.resources/remove-azresourcegroup
[sp-delete]: ../kubernetes-service-principal.md#additional-considerations
[aks-tutorial]: ../tutorial-kubernetes-prepare-app.md
