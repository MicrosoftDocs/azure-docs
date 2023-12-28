---
title: Create a Windows Server container on an Azure Kubernetes Service (AKS) cluster using the Azure portal
description: Learn how to quickly create a Kubernetes cluster and deploy an application in a Windows Server container in Azure Kubernetes Service (AKS) using the Azure portal.
ms.topic: article
ms.custom: azure-kubernetes-service
ms.date: 12/27/2023
#Customer intent: As a developer or cluster operator, I want to quickly create an AKS cluster and deploy a Windows Server container so that I can see how to run applications running on a Windows Server container using the managed Kubernetes service in Azure.
---

# Create a Windows Server container on an Azure Kubernetes Service (AKS) cluster using the Azure portal

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage clusters. In this article, you deploy an AKS cluster that runs Windows Server containers using the Azure portal. You also deploy an ASP.NET sample application in a Windows Server container to the cluster.

## Before you begin

This article assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)](../concepts-clusters-workloads.md).

- [!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]
- If you're unfamiliar with the Azure Cloud Shell, review [Overview of Azure Cloud Shell](/azure/cloud-shell/overview).
- Make sure that the identity you're using to create your cluster has the appropriate minimum permissions. For more details on access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)](../concepts-identity.md).

## Create an AKS cluster

1. Sign in to the [Azure portal][azure-portal].
1. On the Azure portal home page, select **Create a resource**.
1. In the **Categories** section, select **Containers** > **Azure Kubernetes Service (AKS)**.
1. On the **Basics** tab, configure the following options:
    - Under **Project details**:
        - Select an Azure **Subscription**.
        - Create an Azure **Resource group**, such as *myResourceGroup*. While you can select an existing resource group, for testing or evaluation purposes, we recommend creating a resource group to temporarily host these resources and avoid impacting your production or development workloads.
    - Under **Cluster details**:
      - Set the **Cluster preset configuration** to *Production Standard*. For more details on preset configurations, see [Cluster configuration presets in the Azure portal][preset-config].

        > [!NOTE]
        > You can change the preset configuration when creating your cluster by selecting *Compare presets* and choosing a different option.
        > :::image type="content" source="media/quick-windows-container-deploy-portal/cluster-preset-options.png" alt-text="Screenshot of Create AKS cluster - portal preset options." lightbox="media/quick-windows-container-deploy-portal/cluster-preset-options.png":::

      - Enter a **Kubernetes cluster name**, such as *myAKSCluster*.
      - Select a **Region** for the AKS cluster.
      - Leave the **Availability zones** setting set to *None*.
      - Leave the **AKS pricing tier** setting set to *Standard*.
      - Leave the default value selected for **Kubernetes version**.
      - Leave the **Automatic upgrade** setting set to the recommended value, which is *Enabled with patch*.
      - Leave the **Authentication and authorization** setting set to *Local accounts with Kubernetes RBAC*.

        :::image type="content" source="media/quick-windows-container-deploy-portal/create-cluster-basics.png" alt-text="Screenshot showing how to configure an AKS cluster in Azure portal." lightbox="media/quick-windows-container-deploy-portal/create-cluster-basics.png":::

1. Select **Next**. On the **Node pools** tab, add a new node pool:
    - Select **Add node pool**.
    - Enter a **Node pool name**, such as *npwin*. For a Windows node pool, the name must be six characters or fewer.
    - For **Mode**, select **User**.
    - For **OS SKU**, select **Windows**.
    - Leave the **Availability zones** setting set to *None*.
    - Leave the **Enable Azure Spot instances** checkbox unchecked.
    - For **Node size**, select **Choose a size**. On the **Select a VM size** page, select *D2s_v3*, then choose the **Select** button.
    - Leave the **Scale method** setting set to *Autoscale*.
    - Leave the **Minimum node count** and **Maximum node count** fields set to their default settings.

        :::image type="content" source="media/quick-windows-container-deploy-portal/create-node-pool-windows.png" alt-text="Screenshot showing how to create a node pool running Windows Server." lightbox="media/quick-windows-container-deploy-portal/create-node-pool-windows.png":::

1. Leave all settings on the other tabs set to their defaults.
1. Select **Review + create** to run validation on the cluster configuration. After validation completes, select **Create** to create the AKS cluster.

It takes a few minutes to create the AKS cluster. When your deployment is complete, navigate to your resource by either:

- Selecting **Go to resource**, or
- Browsing to the AKS cluster resource group and selecting the AKS resource. In this example you browse for *myResourceGroup* and select the resource *myAKSCluster*.

## Connect to the cluster

You use [kubectl][kubectl], the Kubernetes command-line client, to manage your Kubernetes clusters. `kubectl` is already installed if you use Azure Cloud Shell. If you're unfamiliar with the Cloud Shell, review [Overview of Azure Cloud Shell](../../cloud-shell/overview.md).

### [Azure CLI](#tab/azure-cli)

1. Open Cloud Shell by selecting the `>_` button at the top of the Azure portal page.
1. Configure `kubectl` to connect to your Kubernetes cluster using the [`az aks get-credentials`][az-aks-get-credentials] command. The following command downloads credentials and configures the Kubernetes CLI to use them.

    ```azurecli
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

1. Verify the connection to your cluster using the `kubectl get nodes` command, which returns a list of the cluster nodes.

    ```azurecli
    kubectl get nodes
    ```

    The following sample output shows all the nodes in the cluster. Make sure the status of all nodes is *Ready*:

    ```output
    NAME                                STATUS   ROLES   AGE     VERSION
    aks-nodepool1-12345678-vmssfedcba   Ready    agent   13m     v1.16.7
    aksnpwin987654                      Ready    agent   108s    v1.16.7
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Open Cloud Shell by selecting the `>_` button at the top of the Azure portal page.
1. Configure `kubectl` to connect to your Kubernetes cluster using the [`Import-AzAksCredential`][import-azakscredential] cmdlet. The following command downloads credentials and configures the Kubernetes CLI to use them.

    ```azurepowershell
    Import-AzAksCredential -ResourceGroupName myResourceGroup -Name myAKSCluster
    ```

1. Verify the connection to your cluster using the `kubectl get nodes` command, which returns a list of the cluster nodes.

    ```azurepowershell
    kubectl get nodes
    ```

    The following sample output shows all the nodes in the cluster. Make sure the status of all nodes is *Ready*:

    ```output
    NAME                                STATUS   ROLES   AGE     VERSION
    aks-nodepool1-12345678-vmssfedcba   Ready    agent   13m     v1.16.7
    aksnpwin987654                      Ready    agent   108s    v1.16.7
    ```

---

## Deploy the application

A Kubernetes manifest file defines a desired state for the cluster, such as which container images to run. In this quickstart, you use a manifest file to create all objects needed to run the ASP.NET sample application in a Windows Server container. This manifest file includes a [Kubernetes deployment][kubernetes-deployment] for the ASP.NET sample application and an external [Kubernetes service][kubernetes-service] to access the application from the internet.

The ASP.NET sample application is provided as part of the [.NET Framework Samples](https://hub.docker.com/_/microsoft-dotnet-framework-samples/) and runs in a Windows Server container. AKS requires Windows Server containers to be based on images of *Windows Server 2019* or greater. The Kubernetes manifest file must also define a [node selector][node-selector] to tell your AKS cluster to run your ASP.NET sample application's pod on a node that can run Windows Server containers.

1. Create a file named `sample.yaml` and paste in the following YAML definition.

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

1. If you create and save the YAML file locally, then you can upload the manifest file to your default directory in CloudShell by selecting the **Upload/Download files** button and selecting the file from your local file system.
1. Deploy the application using the [`kubectl apply`][kubectl-apply] command and specify the name of your YAML manifest.

    ```console
    kubectl apply -f sample.yaml
    ```

    The following sample output shows the deployment and service created successfully:

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

    When the *EXTERNAL-IP* address changes from *pending* to an actual public IP address, use `CTRL-C` to stop the `kubectl` watch process. The following sample output shows a valid public IP address assigned to the service:

    ```output
    sample  LoadBalancer   10.0.37.27   52.179.23.131   80:30572/TCP   2m
    ```

1. See the sample app in action by opening a web browser to the external IP address of your service.

    :::image type="content" source="media/quick-windows-container-deploy-portal/asp-net-sample-app.png" alt-text="Screenshot of browsing to ASP.NET sample application." lightbox="media/quick-windows-container-deploy-portal/asp-net-sample-app.png":::

    > [!NOTE]
    > If you receive a connection timeout when trying to load the page, you should verify the sample app is ready using the `kubectl get pods --watch` command. Sometimes, the Windows container isn't started by the time your external IP address is available.

## Delete resources

If you don't plan on going through the following tutorials, you should delete your cluster to avoid incurring Azure charges.

1. In the Azure portal, navigate to your resource group.
1. Select **Delete resource group**.
1. Enter the name of your resource group to confirm deletion and select **Delete**.
1. In the **Delete confirmation** dialog box, select **Delete**.

    > [!NOTE]
    > The AKS cluster was created with system-assigned managed identity (default identity option used in this quickstart), the identity is managed by the platform and does not require removal.

## Next steps

In this quickstart, you deployed a Kubernetes cluster and then deployed an ASP.NET sample application in a Windows Server container to it. This sample application is for demo purposes only and doesn't represent all the best practices for Kubernetes applications. For guidance on creating full solutions with AKS for production, see [AKS solution guidance][aks-solution-guidance].

To learn more about AKS, and to walk through a complete code-to-deployment example, continue to the Kubernetes cluster tutorial.

> [!div class="nextstepaction"]
> [AKS tutorial][aks-tutorial]

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[node-selector]: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/

<!-- LINKS - internal -->
[aks-tutorial]: ../tutorial-kubernetes-prepare-app.md
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[azure-portal]: https://portal.azure.com
[kubernetes-deployment]: ../concepts-clusters-workloads.md#deployments-and-yaml-manifests
[kubernetes-service]: ../concepts-network.md#services
[preset-config]: ../quotas-skus-regions.md#cluster-configuration-presets-in-the-azure-portal
[import-azakscredential]: /powershell/module/az.aks/import-azakscredential
[aks-solution-guidance]: /azure/architecture/reference-architectures/containers/aks-start-here?WT.mc_id=AKSDOCSPAGE
