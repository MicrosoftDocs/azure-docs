---
title: 'Quickstart: Deploy an Azure Linux Container Host for an AKS cluster using Azure PowerShell'
description: Learn how to quickly create an Azure Linux Container Host for an AKS cluster using Azure PowerShell.
author: schaffererin
ms.author: schaffererin
ms.service: microsoft-linux
ms.topic: quickstart
ms.date: 11/20/2023
---

# Quickstart: Deploy an Azure Linux Container Host for an AKS cluster using Azure PowerShell

Get started with the Azure Linux Container Host by using Azure PowerShell to deploy an Azure Linux Container Host for an AKS cluster. After installing the prerequisites, you create a resource group, create an AKS cluster, connect to the cluster, and run a sample multi-container application in the cluster.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- Use the PowerShell environment in [Azure Cloud Shell](/azure/cloud-shell/overview). For more information, see [Azure Cloud Shell Quickstart](/azure/cloud-shell/quickstart).
   [![Screenshot of Launch Cloud Shell in a new window button.](./media/hdi-launch-cloud-shell.png)](https://shell.azure.com)
- If you're running PowerShell locally, install the `Az PowerShell` module and connect to your Azure account using the [`Connect-AzAccount`](/powershell/module/az.accounts/Connect-AzAccount) cmdlet. For more information about installing the Az PowerShell module, see [Install Azure PowerShell][install-azure-powershell].
- The identity you use to create your cluster has the appropriate minimum permissions. For more details on access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)](../aks/concepts-identity.md).

## Create a resource group

An [Azure resource group][azure-resource-group] is a logical group in which Azure resources are deployed and managed. When creating a resource group, you need to specify a location. This location is the storage location of your resource group metadata and where your resources run in Azure if you don't specify another region during resource creation.

The following example creates resource group named *testAzureLinuxResourceGroup* in the *eastus* region.

- Create a resource group using the [`New-AzResourceGroup`][new-azresourcegroup] cmdlet.

    ```azurepowershell-interactive
    New-AzResourceGroup -Name testAzureLinuxResourceGroup -Location eastus
    ```

    The following example output resembles successful creation of the resource group:

    ```output
    ResourceGroupName : testAzureLinuxResourceGroup
    Location          : eastus
    ProvisioningState : Succeeded
    Tags              :
    ResourceId        : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testAzureLinuxResourceGroup
    ```

    > [!NOTE]
    > The above example uses *eastus*, but Azure Linux Container Host clusters are available in all regions.

## Create an Azure Linux Container Host cluster

The following example creates a cluster named *testAzureLinuxCluster* with one node.

- Create an AKS cluster using the [`New-AzAksCluster`][new-azakscluster] cmdlet with the `-NodeOsSKU` flag set to *AzureLinux*.

    ```azurepowershell-interactive
    New-AzAksCluster -ResourceGroupName testAzureLinuxResourceGroup -Name testAzureLinuxCluster -NodeOsSKU AzureLinux
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

## Connect to the cluster

To manage a Kubernetes cluster, use the Kubernetes command-line client, [kubectl](https://kubernetes.io/docs/reference/kubectl/kubectl/). `kubectl` is already installed if you use Azure Cloud Shell.

1. Install `kubectl` locally using the `Install-AzAksCliTool` cmdlet.

    ```azurepowershell-interactive
    Install-AzAksCliTool
    ```

2. Configure `kubectl` to connect to your Kubernetes cluster using the [`Import-AzAksCredential`][import-azakscredential] cmdlet. This command downloads credentials and configures the Kubernetes CLI to use them.

    ```azurepowershell-interactive
    Import-AzAksCredential -ResourceGroupName testAzureLinuxResourceGroup -Name testAzureLinuxCluster
    ```

3. Verify the connection to your cluster using the [`kubectl get`][kubectl-get] command. This command returns a list of the cluster pods.

    ```azurepowershell-interactive
    kubectl get pods --all-namespaces
    ```

## Deploy the application

A [Kubernetes manifest file](../../articles/aks/concepts-clusters-workloads.md#deployments-and-yaml-manifests) defines a cluster's desired state, such as which container images to run.

In this quickstart, you use a manifest to create all objects needed to run the [Azure Vote application](https://github.com/Azure-Samples/azure-voting-app-redis). This manifest includes two Kubernetes deployments:

- The sample Azure Vote Python applications.
- A Redis instance.

This manifest also creates two [Kubernetes Services](../../articles/aks/concepts-network.md#services):

- An internal service for the Redis instance.
- An external service to access the Azure Vote application from the internet.

1. Create a file named `azure-vote.yaml` and copy in the following manifest.

    - If you use the Azure Cloud Shell, you can create the file using `code`, `vi`, or `nano`.

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

    For a breakdown of YAML manifest files, see [Deployments and YAML manifests](../../articles/aks/concepts-clusters-workloads.md#deployments-and-yaml-manifests).

2. Deploy the application using the [`kubectl apply`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) command and specify the name of your YAML manifest:

    ```azurepowershell-interactive
    kubectl apply -f azure-vote.yaml
    ```

    The following example resembles output showing the successfully created deployments and services:

    ```output
    deployment "azure-vote-back" created
    service "azure-vote-back" created
    deployment "azure-vote-front" created
    service "azure-vote-front" created
    ```

## Test the application

When the application runs, a Kubernetes service exposes the application frontend to the internet. This process can take a few minutes to complete.

1. Monitor progress using the [`kubectl get service`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command with the `--watch` argument.

    ```azurepowershell-interactive
    kubectl get service azure-vote-front --watch
    ```

    The **EXTERNAL-IP** output for the `azure-vote-front` service initially shows as *pending*.

    ```output
    NAME               TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
    azure-vote-front   LoadBalancer   10.0.37.27   <pending>     80:30572/TCP   6s
    ```

2. Once the **EXTERNAL-IP** address changes from *pending* to an actual public IP address, use `CTRL-C` to stop the `kubectl` watch process. The following example output shows a valid public IP address assigned to the service:

    ```output
    azure-vote-front   LoadBalancer   10.0.37.27   52.179.23.131   80:30572/TCP   2m
    ```

3. See the Azure Vote app in action by open a web browser to the external IP address of your service.

    :::image type="content" source="./media/azure-voting-application.png" alt-text="Screenshot of browsing to Azure Vote sample application.":::

## Delete the cluster

If you don't plan on continuing through the following tutorials, remove the created resources to avoid incurring Azure charges.

- Remove the resource group and all related resources using the [`RemoveAzResourceGroup`][remove-azresourcegroup] cmdlet.

    ```azurepowershell-interactive
    Remove-AzResourceGroup -Name testAzureLinuxResourceGroup
    ```

## Next steps

In this quickstart, you deployed an Azure Linux Container Host AKS cluster. To learn more about the Azure Linux Container Host and walk through a complete cluster deployment and management example, continue to the Azure Linux Container Host tutorial.

> [!div class="nextstepaction"]
> [Azure Linux Container Host tutorial](./tutorial-azure-linux-create-cluster.md)

<!-- LINKS - internal -->
[install-azure-powershell]: /powershell/azure/install-az-ps
[azure-resource-group]: ../../azure-resource-manager/management/overview.md
[new-azresourcegroup]: /powershell/module/az.resources/new-azresourcegroup
[new-azakscluster]: /powershell/module/az.aks/new-azakscluster
[import-azakscredential]: /powershell/module/az.aks/import-azakscredential
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[remove-azresourcegroup]: /powershell/module/az.resources/remove-azresourcegroup
