---
title: Create a Windows Server container on an Azure Kubernetes Service (AKS) cluster
description: Learn how to quickly create a Kubernetes cluster, deploy an application in a Windows Server container in Azure Kubernetes Service (AKS) using PowerShell.
services: container-service
ms.topic: article
ms.date: 05/26/2020


#Customer intent: As a developer or cluster operator, I want to quickly create an AKS cluster and deploy a Windows Server container so that I can see how to run applications running on a Windows Server container using the managed Kubernetes service in Azure.
---

# Create a Windows Server container on an Azure Kubernetes Service (AKS) cluster using PowerShell

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and
manage clusters. In this article, you deploy an AKS cluster using PowerShell. You also deploy an
`ASP.NET` sample application in a Windows Server container to the cluster.

![Image of browsing to ASP.NET sample application](media/windows-container-powershell/asp-net-sample-app.png)

This article assumes a basic understanding of Kubernetes concepts. For more information, see
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

## Limitations

The following limitations apply when you create and manage AKS clusters that support multiple node pools:

* You can't delete the first node pool.

The following additional limitations apply to Windows Server node pools:

* The AKS cluster can have a maximum of 10 node pools.
* The AKS cluster can have a maximum of 100 nodes in each node pool.
* The Windows Server node pool name has a limit of 6 characters.

## Create a resource group

An [Azure resource group](/azure/azure-resource-manager/resource-group-overview)
is a logical group in which Azure resources are deployed and managed. When you create a resource
group, you are asked to specify a location. This location is where resource group metadata is
stored, it is also where your resources run in Azure if you don't specify another region during
resource creation. Create a resource group using the [New-AzResourceGroup][new-azresourcegroup]
cmdlet.

The following example creates a resource group named **myResourceGroup** in the **eastus** location.

> [!NOTE]
> This article uses PowerShell syntax for the commands in this tutorial. If you are using Azure Cloud
> Shell, ensure that the dropdown in the upper-left of the Cloud Shell window is set to **PowerShell**.

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

## Create an AKS cluster

Use the `ssh-keygen` command-line utility to generate an SSH key pair. For more details, see
[Quick steps: Create and use an SSH public-private key pair for Linux VMs in Azure](/azure/virtual-machines/linux/mac-create-ssh-keys).

To run an AKS cluster that supports node pools for Windows Server containers, your cluster needs to
use a network policy that uses [Azure CNI][azure-cni-about] (advanced) network plugin. For more
detailed information to help plan out the required subnet ranges and network considerations, see
[configure Azure CNI networking][use-advanced-networking]. Use the [New-AzAks][new-azaks] cmdlet
below to create an AKS cluster named **myAKSCluster**. The following example creates the necessary
network resources if they don't exist.

> [!NOTE]
> To ensure your cluster operates reliably, you should run at least 2 (two) nodes in the default
> node pool.

```azurepowershell-interactive
$Password = Read-Host -Prompt 'Please enter your password' -AsSecureString
New-AzAKS -ResourceGroupName myResourceGroup -Name myAKSCluster -NodeCount 2 -KubernetesVersion 1.16.7 -NetworkPlugin azure -NodeVmSetType VirtualMachineScaleSets -WindowsProfileAdminUserName akswinuser -WindowsProfileAdminUserPassword $Password
```

> [!Note]
> If you are unable to create the AKS cluster because the version is not supported in this region
> then you can use the `Get-AzAksVersion -Location eastus` command to find the supported version
> list for this region.

After a few minutes, the command completes and returns information about the cluster. Occasionally
the cluster can take longer than a few minutes to provision. Allow up to 10 minutes in these cases.

## Add a Windows Server node pool

By default, an AKS cluster is created with a node pool that can run Linux containers. Use
`New-AzAksNodePool` cmdlet to add a node pool that can run Windows Server containers alongside the
Linux node pool.

```azurepowershell-interactive
New-AzAksNodePool -ResourceGroupName myResourceGroup -ClusterName myAKSCluster -OsType Windows -Name npwin -KubernetesVersion 1.16.7
```

The above command creates a new node pool named **npwin** and adds it to the **myAKSCluster**. When
creating a node pool to run Windows Server containers, the default value for **VmSize** is
**Standard_D2s_v3**. If you choose to set the **VmSize** parameter, check the list of
[restricted VM sizes][restricted-vm-sizes]. The minimum recommended size is **Standard_D2s_v3**. The
previous command also uses the default subnet in the default vnet created when running `New-AzAks`.

## Connect to the cluster

To manage a Kubernetes cluster, you use [kubectl][kubectl], the Kubernetes command-line client. If
you use Azure Cloud Shell, `kubectl` is already installed. To install `kubectl` locally, use the
`Install-AzAksKubectl` cmdlet:

```azurepowershell-interactive
Install-AzAksKubectl
```

To configure `kubectl` to connect to your Kubernetes cluster, use the
[Import-AzAksCredential][import-azakscredential] cmdlet. This command
downloads credentials and configures the Kubernetes CLI to use them.

```azurepowershell-interactive
Import-AzAksCredential -ResourceGroupName myResourceGroup -Name myAKSCluster
```

To verify the connection to your cluster, use the [kubectl get][kubectl-get] command to return a
list of the cluster nodes.

```azurepowershell-interactive
kubectl get nodes
```

The following example output shows all the nodes in the cluster. Make sure that the status of all
nodes is **Ready**:

```Output
NAME                                STATUS   ROLES   AGE    VERSION
aks-nodepool1-12345678-vmssfedcba   Ready    agent   13m    v1.16.7
aksnpwin987654                      Ready    agent   108s   v1.16.7
```

## Run the application

A Kubernetes manifest file defines a desired state for the cluster, such as what container images to
run. In this article, a manifest is used to create all objects needed to run the ASP.NET sample
application in a Windows Server container. This manifest includes a
[Kubernetes deployment][kubernetes-deployment] for the ASP.NET sample application and an external
[Kubernetes service][kubernetes-service] to access the application from the internet.

The ASP.NET sample application is provided as part of the [.NET Framework Samples][dotnet-samples]
and runs in a Windows Server container. AKS requires Windows Server containers to be based on images
of **Windows Server 2019** or greater. The Kubernetes manifest file must also define a
[node selector][node-selector] to tell your AKS cluster to run your ASP.NET sample application's pod
on a node that can run Windows Server containers.

Create a file named `sample.yaml` and copy in the following YAML definition. If you use the Azure
Cloud Shell, this file can be created using `vi` or `nano` as if working on a virtual or physical
system:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample
  labels:
    app: sample
spec:
  replicas: 1
  template:
    metadata:
      name: sample
      labels:
        app: sample
    spec:
      nodeSelector:
        "beta.kubernetes.io/os": windows
      containers:
      - name: sample
        image: mcr.microsoft.com/dotnet/framework/samples:aspnetapp
        resources:
          limits:
            cpu: 1
            memory: 800M
          requests:
            cpu: .1
            memory: 300M
        ports:
          - containerPort: 80
  selector:
    matchLabels:
      app: sample
---
apiVersion: v1
kind: Service
metadata:
  name: sample
spec:
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 80
  selector:
    app: sample
```

Deploy the application using the [kubectl apply][kubectl-apply] command and specify the name of your
YAML manifest:

```azurepowershell-interactive
kubectl apply -f sample.yaml
```

The following example output shows the Deployment and Service created successfully:

```Output
deployment.apps/sample created
service/sample created
```

## Test the application

When the application runs, a Kubernetes service exposes the application frontend to the internet.
This process can take a few minutes to complete. Occasionally the service can take longer than a few
minutes to provision. Allow up to 10 minutes in these cases.

To monitor progress, use the [kubectl get service][kubectl-get] command with the `--watch` argument.

```azurepowershell-interactive
kubectl get service sample --watch
```

Initially the **EXTERNAL-IP** for the **sample** service is shown as **pending**.

```Output
NAME               TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
sample             LoadBalancer   10.0.37.27   <pending>     80:30572/TCP   6s
```

When the **EXTERNAL-IP** address changes from **pending** to an actual public IP address, use `CTRL-C`
to stop the `kubectl` watch process. The following example output shows a valid public IP address
assigned to the service:

```Output
sample  LoadBalancer   10.0.37.27   52.179.23.131   80:30572/TCP   2m
```

To see the sample app in action, open a web browser to the external IP address of your service.

![Image of browsing to ASP.NET sample application](media/windows-container-powershell/asp-net-sample-app.png)

> [!Note]
> If you receive a connection timeout when trying to load the page then you should verify the sample
> app is ready with the following command `kubectl get pods --watch`. Sometimes the windows
> container will not be started by the time your external IP address is available.

## Delete cluster

When the cluster is no longer needed, use the
[Remove-AzResourceGroup][remove-azresourcegroup] cmdlet to remove
the resource group, container service, and all related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup
```

> [!NOTE]
> When you delete the cluster, the Azure Active Directory service principal used by the AKS cluster
> is not removed. For steps on how to remove the service principal, see
> [AKS service principal considerations and deletion][sp-delete]. If you used a managed identity,
> the identity is managed by the platform and does not require removal.

## Next steps

In this article, you deployed a Kubernetes cluster and deployed an `ASP.NET` sample application in a
Windows Server container to it. [Access the Kubernetes web dashboard][kubernetes-dashboard] for the
cluster you created.

To learn more about AKS, and walk through a complete code to deployment example, continue to the
Kubernetes cluster tutorial.

> [!div class="nextstepaction"]
> [AKS tutorial][aks-tutorial]

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[dotnet-samples]: https://hub.docker.com/_/microsoft-dotnet-framework-samples/
[node-selector]: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply

<!-- LINKS - internal -->
[kubernetes-concepts]: concepts-clusters-workloads.md
[install-azure-powershell]: /powershell/azure/install-az-ps
[new-azresourcegroup]: /powershell/module/az.resources/new-azresourcegroup
[azure-cni-about]: concepts-network.md#azure-cni-advanced-networking
[use-advanced-networking]: configure-azure-cni.md
[new-azaks]: /powershell/module/az.aks/new-azaks
[restricted-vm-sizes]: quotas-skus-regions.md#restricted-vm-sizes
[import-azakscredential]: /powershell/module/az.aks/import-azakscredential
[kubernetes-deployment]: concepts-clusters-workloads.md#deployments-and-yaml-manifests
[kubernetes-service]: concepts-network.md#services
[remove-azresourcegroup]: /powershell/module/az.resources/remove-azresourcegroup
[sp-delete]: kubernetes-service-principal.md#additional-considerations
[kubernetes-dashboard]: kubernetes-dashboard.md
[aks-tutorial]: ./tutorial-kubernetes-prepare-app.md
