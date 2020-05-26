---
title: 'Quickstart: Deploy an Azure Kubernetes Service cluster'
description: Learn how to quickly create a Kubernetes cluster, deploy an application, and monitor performance in Azure Kubernetes Service (AKS) using PowerShell.
services: container-service
ms.topic: quickstart
ms.date: 05/26/2020


#Customer intent: As a developer or cluster operator, I want to quickly create an AKS cluster and deploy an application so that I can see how to run and monitor applications using the managed Kubernetes service in Azure.
---

# Quickstart: Deploy an Azure Kubernetes Service cluster using PowerShell

In this quickstart, you deploy an Azure Kubernetes Service (AKS) cluster using PowerShell. AKS is a
managed Kubernetes service that lets you quickly deploy and manage clusters. A multi-container
application that includes a web frontend and a Redis instance is run in the cluster. You then see
how to monitor the health of the cluster and pods that run your application.

To learn more about creating a Windows Server node pool, see
[Create an AKS cluster that supports Windows Server containers][windows-container-powershell].

![Voting app deployed in Azure Kubernetes Service](./media/kubernetes-walkthrough-powershell/voting-app-deployed-in-azure-kubernetes-service.png)

This quickstart assumes a basic understanding of Kubernetes concepts. For more information, see
[Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

If you choose to use PowerShell locally, this article requires that you install the Az PowerShell
module and connect to your Azure account using the
[Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) cmdlet. For more information
about installing the Az PowerShell module, see
[Install Azure PowerShell][install-azure-powershell].

[!INCLUDE [cloud-shell-try-it](../../includes/cloud-shell-try-it.md)]

If you have multiple Azure subscriptions, choose the appropriate subscription in which the resources
should be billed. Select a specific subscription ID using the
[Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.

```azurepowershell-interactive
Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
```

## Create a resource group

An [Azure resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview)
is a logical group in which Azure resources are deployed and managed. When you create a resource
group, you are asked to specify a location. This location is where resource group metadata is
stored, it is also where your resources run in Azure if you don't specify another region during
resource creation. Create a resource group using the [New-AzResourceGroup][new-azresourcegroup]
cmdlet.

The following example creates a resource group named **myResourceGroup** in the **eastus** region.

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroup -Location eastus
```

The following example output shows the resource group created successfully:

```Output
ResourceGroupName : myResourceGroup
Location          : eastus
ProvisioningState : Succeeded
Tags              :
ResourceId        : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup
```

## Create AKS cluster

Use the `ssh-keygen` command-line utility to generate an SSH key pair. For more details, see
[Quick steps: Create and use an SSH public-private key pair for Linux VMs in Azure](/azure/virtual-machines/linux/mac-create-ssh-keys).

Use the [New-AzAks][new-azaks] cmdlet to create an AKS cluster. The
following example creates a cluster named **myAKSCluster** with one node. Azure Monitor for
containers is also enabled by default. This takes several minutes to complete.

> [!NOTE]
> When creating an AKS cluster, a second resource group is automatically created to store the AKS
> resources. For more information, see
> [Why are two resource groups created with AKS?](https://docs.microsoft.com/azure/aks/faq#why-are-two-resource-groups-created-with-aks)

```azurepowershell-interactive
New-AzAks -ResourceGroupName myResourceGroup -Name myAKSCluster -NodeCount 1
```

After a few minutes, the command completes and returns information about the cluster.

## Connect to the cluster

To manage a Kubernetes cluster, you use [kubectl][kubectl], the Kubernetes command-line client. If
you use Azure Cloud Shell, `kubectl` is already installed. To install `kubectl` locally, use the
`Install-AzAksKubectl` cmdlet:

```azurepowershell
Install-AzAksKubectl
```

To configure `kubectl` to connect to your Kubernetes cluster, use the
[Import-AzAksCredential][import-azakscredential] cmdlet. The following
example downloads credentials and configures the Kubernetes CLI to use them.

```azurepowershell-interactive
Import-AzAksCredential -ResourceGroupName myResourceGroup -Name myAKSCluster
```

To verify the connection to your cluster, use the [kubectl get][kubectl-get] command to return a
list of the cluster nodes.

```azurepowershell-interactive
.\kubectl get nodes
```

The following example output shows the single node created in the previous steps. Make sure that the
status of the node is **Ready**:

```Output
NAME                       STATUS   ROLES   AGE     VERSION
aks-nodepool1-31718369-0   Ready    agent   6m44s   v1.15.10
```

## Run the application

A Kubernetes manifest file defines a desired state for the cluster, such as what container images to
run. In this quickstart, a manifest is used to create all objects needed to run the Azure Vote
application. This manifest includes two [Kubernetes deployments][kubernetes-deployment] - one for
the sample Azure Vote Python applications, and the other for a Redis instance. Two
[Kubernetes Services is also created - an internal service for the Redis
instance, and an external service to access the Azure Vote application from the internet.

> [!TIP]
> In this quickstart, you manually create and deploy your application manifests to the AKS cluster.
> In more real-world scenarios, you can use [Azure Dev Spaces][azure-dev-spaces] to rapidly iterate
> and debug your code directly in the AKS cluster. You can use Dev Spaces across OS platforms and
> development environments, and work together with others on your team.

Create a file named `azure-vote.yaml` and copy in the following YAML definition. If you use the
Azure Cloud Shell, this file can be created using `vi` or `nano` as if working on a virtual or
physical system:

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
        "beta.kubernetes.io/os": linux
      containers:
      - name: azure-vote-back
        image: redis
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
        "beta.kubernetes.io/os": linux
      containers:
      - name: azure-vote-front
        image: microsoft/azure-vote-front:v1
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

Deploy the application using the [kubectl apply][kubectl-apply] command and specify the name of your
YAML manifest:

```azurepowershell-interactive
.\kubectl apply -f azure-vote.yaml
```

The following example output shows the Deployments and Services created successfully:

```Output
deployment.apps/azure-vote-back created
service/azure-vote-back created
deployment.apps/azure-vote-front created
service/azure-vote-front created
```

## Test the application

When the application runs, a Kubernetes service exposes the application frontend to the internet.
This process can take a few minutes to complete.

To monitor progress, use the [kubectl get service][kubectl-get] command with the `--watch` argument.

```azurepowershell-interactive
.\kubectl get service azure-vote-front --watch
```

Initially the **EXTERNAL-IP** for the **azure-vote-front** service is shown as **pending**.

```Output
NAME               TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
azure-vote-front   LoadBalancer   10.0.37.27   <pending>     80:30572/TCP   6s
```

When the **EXTERNAL-IP** address changes from **pending** to an actual public IP address, use `CTRL-C`
to stop the `kubectl` watch process. The following example output shows a valid public IP address
assigned to the service:

```Output
azure-vote-front   LoadBalancer   10.0.37.27   52.179.23.131   80:30572/TCP   2m
```

To see the Azure Vote app in action, open a web browser to the external IP address of your service.

![Voting app deployed in Azure Kubernetes Service](./media/kubernetes-walkthrough-powershell/voting-app-deployed-in-azure-kubernetes-service.png)

When the AKS cluster was created,
[Azure Monitor for containers](../azure-monitor/insights/container-insights-overview.md) was enabled
to capture health metrics for both the cluster nodes and pods. These health metrics are available in
the Azure portal.

## Delete the cluster

To avoid Azure charges, you should clean up unneeded resources. When the cluster is no longer
needed, use the [Remove-AzResourceGroup][remove-azresourcegroup] cmdlet to remove the resource
group, container service, and all related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup
```

> [!NOTE]
> When you delete the cluster, the Azure Active Directory service principal used by the AKS cluster
> is not removed. For steps on how to remove the service principal, see
> [AKS service principal considerations and deletion][sp-delete]. If you used a managed identity,
> the identity is managed by the platform and does not require removal.

## Get the code

In this quickstart, pre-created container images were used to create a Kubernetes deployment. The
related application code, Dockerfile, and Kubernetes manifest file are available on GitHub.

[https://github.com/Azure-Samples/azure-voting-app-redis][azure-vote-app]

## Next steps

In this quickstart, you deployed a Kubernetes cluster and deployed a multi-container application to
it. You can also [access the Kubernetes web dashboard][kubernetes-dashboard] for your AKS cluster.

To learn more about AKS, and walk through a complete code to deployment example, continue to the
Kubernetes cluster tutorial.

> [!div class="nextstepaction"]
> [AKS tutorial][aks-tutorial]

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[azure-dev-spaces]: https://docs.microsoft.com/azure/dev-spaces/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[azure-vote-app]: https://github.com/Azure-Samples/azure-voting-app-redis.git

<!-- LINKS - internal -->
[windows-container-powershell]: windows-container-powershell.md
[kubernetes-concepts]: concepts-clusters-workloads.md
[install-azure-powershell]: /powershell/azure/install-az-ps
[new-azresourcegroup]: /powershell/module/az.resources/new-azresourcegroup
[new-azaks]: /powershell/module/az.aks/new-azaks
[import-azakscredential]: /powershell/module/az.aks/import-azakscredential
[kubernetes-deployment]: concepts-clusters-workloads.md#deployments-and-yaml-manifests
[kubernetes-service]: concepts-network.md#services
[remove-azresourcegroup]: /powershell/module/az.resources/remove-azresourcegroup
[sp-delete]: kubernetes-service-principal.md#additional-considerations
[kubernetes-dashboard]: kubernetes-dashboard.md
[aks-tutorial]: ./tutorial-kubernetes-prepare-app.md
