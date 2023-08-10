---
title: Create a Windows Server container on an Azure Kubernetes Service (AKS) cluster using PowerShell
description: Learn how to quickly create a Kubernetes cluster and deploy an application in a Windows Server container in Azure Kubernetes Service (AKS) using PowerShell.
ms.topic: article
ms.date: 07/11/2023
ms.custom: devx-track-azurepowershell
#Customer intent: As a developer or cluster operator, I want to quickly create an AKS cluster and deploy a Windows Server container so that I can see how to run applications running on a Windows Server container using the managed Kubernetes service in Azure.
---

# Create a Windows Server container on an Azure Kubernetes Service (AKS) cluster using PowerShell

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage clusters. In this article, you use Azure PowerShell to deploy an AKS cluster that runs Windows Server containers. You also deploy an
`ASP.NET` sample application in a Windows Server container to the cluster.

:::image type="content" source="media/quick-windows-container-deploy-powershell/asp-net-sample-app.png" alt-text="Screenshot of browsing to ASP.NET sample application.":::

This article assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].

## Prerequisites

* If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
* Use the PowerShell environment in [Azure Cloud Shell](/azure/cloud-shell/overview). For more information, see [Quickstart for Azure Cloud Shell](/azure/cloud-shell/quickstart).
* The identity you use to create your cluster must have the appropriate minimum permissions. For more details on access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)](../concepts-identity.md).
* If you choose to use PowerShell locally, you need to install the [`Az PowerShell`](/powershell/azure/new-azureps-module-az) module and connect to your Azure account using the [`Connect-AzAccount`](/powershell/module/az.accounts/Connect-AzAccount) cmdlet. For more information, see [Install Azure PowerShell][install-azure-powershell].
* If you have multiple Azure subscriptions, select and set the appropriate subscription ID in which the resources should be billed using the [`Set-AzContext`](/powershell/module/az.accounts/set-azcontext) cmdlet.

## Limitations

The following limitations apply when you create and manage AKS clusters that support multiple node pools:

* You can't delete the first node pool.

The following limitations apply to *Windows Server node pools*:

* The AKS cluster can have a maximum of 10 node pools.
* The AKS cluster can have a maximum of 100 nodes in each node pool.
* The Windows Server node pool name has a limit of six characters.

## Create a resource group

An [Azure resource group](../../azure-resource-manager/management/overview.md) is a logical group in which Azure resources are deployed and managed. When you create a resource group, you're asked to specify a location. This location is where resource group metadata is stored and where your resources run in Azure if you don't specify another region during resource creation.

* Create a resource group using the [`New-AzResourceGroup`][new-azresourcegroup] cmdlet. The following example creates a resource group named *myResourceGroup* in the *eastus* location.

    ```azurepowershell-interactive
    New-AzResourceGroup -Name myResourceGroup -Location eastus
    ```

    The following example output shows the resource group created successfully:

    ```output
    ResourceGroupName : myResourceGroup
    Location          : eastus
    ProvisioningState : Succeeded
    Tags              :
    ResourceId        : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup
    ```

## Create an AKS cluster

In this section, we create an AKS cluster with the following configuration:

* The cluster is configured with two nodes to ensure it operates reliably.
* The `-WindowsProfileAdminUserName` and `-WindowsProfileAdminUserPassword` parameters set the administrator credentials for any Windows Server nodes on the cluster and must meet the [Windows Server password complexity requirements][windows-server-password].
* The node pool uses `VirtualMachineScaleSets`.

> [!NOTE]
> To run an AKS cluster that supports node pools for Windows Server containers, your cluster needs to use a network policy that uses [Azure CNI (advanced)][azure-cni-about] network plugin.

1. Create the administrator credentials for your Windows Server containers using the following command. This command prompts you to enter a `WindowsProfileAdminUserName` and `WindowsProfileAdminUserPassword`.

    ```azurepowershell-interactive
    $AdminCreds = Get-Credential -Message 'Please create the administrator credentials for your Windows Server containers'
    ```

2. Create your cluster using the [`New-AzAksCluster`][new-azakscluster] cmdlet and specify the `WindowsProfileAdminUserName` and `WindowsProfileAdminUserPassword` parameters.

    ```azurepowershell-interactive
    New-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster -NodeCount 2 -NetworkPlugin azure -NodeVmSetType VirtualMachineScaleSets -WindowsProfileAdminUserName $AdminCreds.UserName -WindowsProfileAdminUserPassword $AdminCreds.Password -GenerateSshKey
    ```

    > [!NOTE]
    >
    > * If you get a password validation error, verify the password you set meets the [Windows Server password requirements][windows-server-password].
    > * If you're unable to create the AKS cluster because the version isn't supported in the region you selected, use the `Get-AzAksVersion -Location location` command to find the supported version list for the region.

    After a few minutes, the command completes and returns JSON-formatted information about the cluster. Occasionally, the cluster can take longer than a few minutes to provision. Allow up to 10 minutes for provisioning.

## Add a Windows node pool

By default, an AKS cluster is created with a node pool that can run Linux containers. You have to add another node pool that can run Windows Server containers alongside the Linux node pool.

* Add a Windows Server node pool using the [`New-AzAksNodePool`][new-azaksnodepool] cmdlet. The following command creates a new node pool named *npwin* and adds it to *myAKSCluster*. The command also uses the default subnet in the default virtual network created when running `New-AzAksCluster`. An OS SKU isn't specified, so the node pool is set to the default operating system based on the Kubernetes version of the cluster.

    ```azurepowershell-interactive
    New-AzAksNodePool -ResourceGroupName myResourceGroup -ClusterName myAKSCluster -VmSetType VirtualMachineScaleSets -OsType Windows -Name npwin
    ```

## Add a Windows Server 2019 or Windows Server 2022 node pool

AKS supports Windows Server 2019 and 2022 node pools. Windows Server 2022 is the default operating system for Kubernetes versions 1.25.0 and higher. Windows Server 2019 is the default OS for earlier versions. To use Windows Server 2019 or Windows Server 2022, you need to specify the following parameters:

* `OsType` set to `Windows`
* `OsSKU` set to `Windows2019` *or* `Windows2022`

> [!NOTE]
>
> * `OsSKU` requires PowerShell Az module version 9.2.0 or higher.
> * Windows Server 2022 requires Kubernetes version 1.23.0 or higher.
> * Windows Server 2019 is being retired after Kubernetes version 1.32 reaches end of life (EOL) and won't be supported in future releases. For more information about this retirement, see the [AKS release notes][aks-release-notes].

* Add a Windows Server 2022 node pool using the [`New-AzAksNodePool`][new-azaksnodepool] cmdlet.

    ```azurepowershell-interactive
    New-AzAksNodePool -ResourceGroupName myResourceGroup -ClusterName myAKSCluster -VmSetType VirtualMachineScaleSets -OsType Windows -OsSKU Windows2019 Windows -Name npwin
    ```

## Connect to the cluster

You use [kubectl][kubectl], the Kubernetes command-line client, to manage your Kubernetes clusters. If you use Azure Cloud Shell, `kubectl` is already installed. To you want to install `kubectl` locally, you can use the `Install-AzAksKubectl` cmdlet.

1. Configure `kubectl` to connect to your Kubernetes cluster using the [`Import-AzAksCredential`][import-azakscredential] cmdlet. This command downloads credentials and configures the Kubernetes CLI to use them.

    ```azurepowershell-interactive
    Import-AzAksCredential -ResourceGroupName myResourceGroup -Name myAKSCluster
    ```

2. Verify the connection to your cluster using the [`kubectl get`][kubectl-get] command, which returns a list of the cluster nodes.

    ```azurepowershell-interactive
    kubectl get nodes
    ```

    The following example output shows all the nodes in the cluster. Make sure the status of all nodes is **Ready**:

    ```output
    NAME                                STATUS   ROLES   AGE    VERSION
    aks-nodepool1-12345678-vmssfedcba   Ready    agent   13m    v1.16.7
    aksnpwin987654                      Ready    agent   108s   v1.16.7
    ```

## Deploy the application

A Kubernetes manifest file defines a desired state for the cluster, such as what container images to run. In this article, you use a manifest to create all objects needed to run the ASP.NET sample application in a Windows Server container. This manifest includes a [Kubernetes deployment][kubernetes-deployment] for the ASP.NET sample application and an external [Kubernetes service][kubernetes-service] to access the application from the internet.

The ASP.NET sample application is provided as part of the [.NET Framework Samples][dotnet-samples] and runs in a Windows Server container. AKS requires Windows Server containers to be based on images of *Windows Server 2019* or greater. The Kubernetes manifest file must also define a [node selector][node-selector] to tell your AKS cluster to run your ASP.NET sample application's pod on a node that can run Windows Server containers.

1. Create a file named `sample.yaml` and copy in the following YAML definition.

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
            "kubernetes.io/os": windows
          containers:
          - name: sample
            image: mcr.microsoft.com/dotnet/framework/samples:aspnetapp
            resources:
              limits:
                cpu: 1
                memory: 800M
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

    For a breakdown of YAML manifest files, see [Deployments and YAML manifests](../concepts-clusters-workloads.md#deployments-and-yaml-manifests).

2. Deploy the application using the [`kubectl apply`][kubectl-apply] command and specify the name of your YAML manifest.

    ```azurepowershell-interactive
    kubectl apply -f sample.yaml
    ```

    The following example output shows the deployment and service created successfully:

    ```output
    deployment.apps/sample created
    service/sample created
    ```

## Test the application

When the application runs, a Kubernetes service exposes the application front end to the internet. This process can take a few minutes to complete. Occasionally, the service can take longer than a few minutes to provision. Allow up to 10 minutes for provisioning.

1. Monitor progress using the [`kubectl get service`][kubectl-get] command with the `--watch` argument.

    ```azurepowershell-interactive
    kubectl get service sample --watch
    ```

    Initially, the output shows the *EXTERNAL-IP* for the sample service as *pending*:

    ```output
    NAME               TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
    sample             LoadBalancer   10.0.37.27   <pending>     80:30572/TCP   6s
    ```

    When the *EXTERNAL-IP* address changes from *pending* to an actual public IP address, use `CTRL-C` to stop the `kubectl` watch process. The following example output shows a valid public IP address assigned to the service:

    ```output
    sample  LoadBalancer   10.0.37.27   52.179.23.131   80:30572/TCP   2m
    ```

2. See the sample app in action by opening a web browser to the external IP address of your service.

    :::image type="content" source="media/quick-windows-container-deploy-powershell/asp-net-sample-app.png" alt-text="Screenshot of browsing to ASP.NET sample application.":::

    > [!NOTE]
    > If you receive a connection timeout when trying to load the page, you should verify the sample app is ready using the `kubectl get pods --watch` command. Sometimes, the Windows container isn't started by the time your external IP address is available.

## Delete resources

If you don't plan on going through the following tutorials, you should delete your cluster to avoid incurring Azure charges.

* Delete your resource group, container service, and all related resources using the [`Remove-AzResourceGroup`][remove-azresourcegroup] cmdlet to remove the resource group, container service, and all related resources.

    ```azurepowershell-interactive
    Remove-AzResourceGroup -Name myResourceGroup
    ```

    > [!NOTE]
    > The AKS cluster was created with system-assigned managed identity (default identity option used in this quickstart). The Azure platform manages this identity, so it doesn't require removal.

## Next steps

In this article, you deployed a Kubernetes cluster and deployed an `ASP.NET` sample application in a Windows Server container to it.

To learn more about AKS, and walk through a complete code to deployment example, continue to the following Kubernetes cluster tutorial.

> [!div class="nextstepaction"]
> [AKS tutorial][aks-tutorial]

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[dotnet-samples]: https://hub.docker.com/_/microsoft-dotnet-framework-samples/
[node-selector]: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[aks-release-notes]: https://github.com/Azure/AKS/releases

<!-- LINKS - internal -->
[kubernetes-concepts]: ../concepts-clusters-workloads.md
[install-azure-powershell]: /powershell/azure/install-az-ps
[new-azresourcegroup]: /powershell/module/az.resources/new-azresourcegroup
[azure-cni-about]: ../concepts-network.md#azure-cni-advanced-networking
[new-azakscluster]: /powershell/module/az.aks/new-azakscluster
[import-azakscredential]: /powershell/module/az.aks/import-azakscredential
[kubernetes-deployment]: ../concepts-clusters-workloads.md#deployments-and-yaml-manifests
[kubernetes-service]: ../concepts-network.md#services
[remove-azresourcegroup]: /powershell/module/az.resources/remove-azresourcegroup
[aks-tutorial]: ../tutorial-kubernetes-prepare-app.md
[windows-server-password]: /windows/security/threat-protection/security-policy-settings/password-must-meet-complexity-requirements#reference
[new-azaksnodepool]: /powershell/module/az.aks/new-azaksnodepool
