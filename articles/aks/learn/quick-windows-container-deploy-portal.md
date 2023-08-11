---
title: Create a Windows Server container on an Azure Kubernetes Service (AKS) cluster using the Azure portal
description: Learn how to quickly create a Kubernetes cluster and deploy an application in a Windows Server container in Azure Kubernetes Service (AKS) using the Azure portal.
ms.topic: article
ms.custom: azure-kubernetes-service
ms.date: 08/03/2023
#Customer intent: As a developer or cluster operator, I want to quickly create an AKS cluster and deploy a Windows Server container so that I can see how to run applications running on a Windows Server container using the managed Kubernetes service in Azure.
---

# Create a Windows Server container on an Azure Kubernetes Service (AKS) cluster using the Azure portal

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage clusters. In this article, you deploy an AKS cluster that runs Windows Server containers using the Azure portal. You also deploy an ASP.NET sample application in a Windows Server container to the cluster.

:::image type="content" source="media/quick-windows-container-deploy-cli/asp-net-sample-app.png" alt-text="Screenshot of browsing to ASP.NET sample application.":::

This article assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)](../concepts-clusters-workloads.md).

- [!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]
- If you're unfamiliar with the Azure Cloud Shell, review [Overview of Azure Cloud Shell](/azure/cloud-shell/overview).
- The identity you're using to create your cluster has the appropriate minimum permissions. For more details on access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)](../concepts-identity.md).

### Limitations

The following limitations apply when you create and manage AKS clusters that support multiple node pools:

- You can't delete the first node pool.

The following limitations apply to *Windows Server node pools*:

- The AKS cluster can have a maximum of 10 node pools.
- The AKS cluster can have a maximum of 100 nodes in each node pool.
- The Windows Server node pool name has a limit of six characters.

## Create an AKS cluster

1. Sign in to the [Azure portal][azure-portal].
2. On the Azure portal home page, select **Create a resource**.
3. In the **Categories** section, select **Containers** > **Azure Kubernetes Service (AKS)**.
4. On the **Basics** page, configure the following options:
   - **Project details**:
     - Select an Azure **Subscription**.
     - Create an Azure **Resource group**, such as *myResourceGroup*. While you can select an existing resource group, for testing or evaluation purposes, we recommend creating a resource group to temporarily host these resources and avoid impacting your production or development workloads.
   - **Cluster details**:
     - Ensure the **Preset configuration** is *Standard ($$)*. For more details on preset configurations, see [Cluster configuration presets in the Azure portal][preset-config].
     - Enter a **Kubernetes cluster name**, such as *myAKSCluster*.
     - Select a **Region** for the AKS cluster.
     - Leave the default value selected for **Kubernetes version**.
   - **Primary node pool**:
     - Leave the default values selected.
5. Select **Next: Node pools**.

### Add a Windows Server node pool

1. Select **Add node pool**.
2. Enter a **Node pool name**, such as *npwin*.
3. For **Mode**, select **User**.
4. For **OS type**, select **Windows**.
5. Select a **Node size**, such as *Standard_D2s_v3*.
6. Select **Next: Networking** and set the **Network policy** to **Azure**.
7. Select **Review + create** > **Create**.

## Connect to the cluster

You use [kubectl][kubectl], the Kubernetes command-line client, to manage your Kubernetes clusters. `kubectl` is already installed if you use Azure Cloud Shell. If you're unfamiliar with the Cloud Shell, review [Overview of Azure Cloud Shell](../../cloud-shell/overview.md).

### [Azure CLI](#tab/azure-cli)

1. Open Cloud Shell by selecting the `>_` button at the top of the Azure portal page.
2. Configure `kubectl` to connect to your Kubernetes cluster using the [`az aks get-credentials`][az-aks-get-credentials] command. The following command downloads credentials and configures the Kubernetes CLI to use them.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

3. Verify the connection to your cluster using the `kubectl get nodes` command, which returns a list of the cluster nodes.

    ```azurecli-interactive
    kubectl get nodes
    ```

    The following example output shows all the nodes in the cluster. Make sure the status of all nodes is *Ready*:

    ```output
    NAME                                STATUS   ROLES   AGE     VERSION
    aks-nodepool1-12345678-vmssfedcba   Ready    agent   13m     v1.16.7
    aksnpwin987654                      Ready    agent   108s    v1.16.7
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Open Cloud Shell by selecting the `>_` button at the top of the Azure portal page.
2. Configure `kubectl` to connect to your Kubernetes cluster using the [`Import-AzAksCredential`][import-azakscredential] cmdlet. The following command downloads credentials and configures the Kubernetes CLI to use them.

    ```azurepowershell-interactive
    Import-AzAksCredential -ResourceGroupName myResourceGroup -Name myAKSCluster
    ```

3. Verify the connection to your cluster using the `kubectl get nodes` command, which returns a list of the cluster nodes.

    ```azurepowershell-interactive
    kubectl get nodes
    ```

    The following example output shows all the nodes in the cluster. Make sure the status of all nodes is *Ready*:

    ```output
    NAME                                STATUS   ROLES   AGE     VERSION
    aks-nodepool1-12345678-vmssfedcba   Ready    agent   13m     v1.16.7
    aksnpwin987654                      Ready    agent   108s    v1.16.7
    ```

---

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

    ```console
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

    ```console
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

    :::image type="content" source="media/quick-windows-container-deploy-cli/asp-net-sample-app.png" alt-text="Screenshot of browsing to ASP.NET sample application.":::

    > [!NOTE]
    > If you receive a connection timeout when trying to load the page, you should verify the sample app is ready using the `kubectl get pods --watch` command. Sometimes, the Windows container isn't started by the time your external IP address is available.

## Delete resources

If you don't plan on going through the following tutorials, you should delete your cluster to avoid incurring Azure charges.

1. In the Azure portal, navigate to your resource group.
2. Select **Delete resource group**.
3. Enter the name of your resource group to confirm deletion and select **Delete**.
4. In the **Delete confirmation** dialog box, select **Delete**.

    > [!NOTE]
    > The AKS cluster was created with system-assigned managed identity (default identity option used in this quickstart), the identity is managed by the platform and does not require removal.

## Next steps

In this article, you deployed a Kubernetes cluster and deployed an ASP.NET sample application in a Windows Server container to it.

To learn more about AKS, and walk through a complete code to deployment example, continue to the following Kubernetes cluster tutorial.

> [!div class="nextstepaction"]
> [AKS tutorial][aks-tutorial]

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[node-selector]: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/
[dotnet-samples]: https://hub.docker.com/_/microsoft-dotnet-framework-samples/

<!-- LINKS - internal -->
[aks-tutorial]: ../tutorial-kubernetes-prepare-app.md
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[azure-portal]: https://portal.azure.com
[kubernetes-deployment]: ../concepts-clusters-workloads.md#deployments-and-yaml-manifests
[kubernetes-service]: ../concepts-network.md#services
[preset-config]: ../quotas-skus-regions.md#cluster-configuration-presets-in-the-azure-portal
[import-azakscredential]: /powershell/module/az.aks/import-azakscredential
