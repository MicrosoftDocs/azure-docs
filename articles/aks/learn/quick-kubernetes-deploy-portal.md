---
title: 'Quickstart: Deploy an AKS cluster by using the Azure portal'
titleSuffix: Azure Kubernetes Service
description: Learn how to quickly create a Kubernetes cluster, deploy an application, and monitor performance in Azure Kubernetes Service (AKS) using the Azure portal.
ms.topic: quickstart
ms.date: 11/01/2022
ms.custom: mvc, seo-javascript-october2019, contperf-fy21q3, mode-ui, devx-track-linux
#Customer intent: As a developer or cluster operator, I want to quickly create an AKS cluster and deploy an application so that I can see how to run and monitor applications using the managed Kubernetes service in Azure.
---

# Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster using the Azure portal

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage clusters. In this quickstart, you will:

* Deploy an AKS cluster using the Azure portal.
* Run a sample multi-container application with a web front-end and a Redis instance in the cluster.

:::image type="content" source="media/quick-kubernetes-deploy-portal/azure-voting-application.png" alt-text="Screenshot of browsing to Azure Vote sample application.":::

This quickstart assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

- If you're unfamiliar with the Azure Cloud Shell, review [Overview of Azure Cloud Shell](../../cloud-shell/overview.md).

- The identity you're using to create your cluster has the appropriate minimum permissions. For more details on access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)](../concepts-identity.md).

## Create an AKS cluster

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the Azure portal menu or from the **Home** page, select **Create a resource**.
1. In the **Categories** section, select **Containers** > **Azure Kubernetes Service (AKS)**.
1. On the **Basics** page, configure the following options:

    - **Project details**:
        * Select an Azure **Subscription**.
        * Create an Azure **Resource group**, such as *myResourceGroup*. While you can select an existing resource group, for testing or evaluation purposes, we recommend creating a resource group to temporarily host these resources and avoid impacting your production or development workloads.
    - **Cluster details**:
        * Ensure that the **Preset configuration** is *Standard ($$)*. For more details on preset configurations, see [Cluster configuration presets in the Azure portal][preset-config].
        * Enter a **Kubernetes cluster name**, such as *myAKSCluster*.
        * Select a **Region** for the AKS cluster, and leave the default value selected for **Kubernetes version**.
    - **Primary node pool**:
        * Leave the default values selected.
    
    :::image type="content" source="media/quick-kubernetes-deploy-portal/create-cluster-basics.png" alt-text="Screenshot of Create AKS cluster - provide basic information.":::

    > [!NOTE]
    > You can change the preset configuration when creating your cluster by selecting *Learn more and compare presets* and choosing a different option.
    > :::image type="content" source="media/quick-kubernetes-deploy-portal/cluster-preset-options.png" alt-text="Screenshot of Create AKS cluster - portal preset options.":::

1. Select **Next: Node pools** when complete. 
1. On the **Node pools** page, leave the default options and then select **Next: Access**.
1. On the **Access** page, configure the following options:

    - The default value for **Resource identity** is **System-assigned managed identity**. Managed identities provide an identity for applications to use when connecting to resources that support Microsoft Entra authentication. For more details about managed identities, see [What are managed identities for Azure resources?](../../active-directory/managed-identities-azure-resources/overview.md)
    - The Kubernetes role-based access control (RBAC) option is the default value to provide more fine-grained control over access to the Kubernetes resources deployed in your AKS cluster.

1. Select **Next: Networking** when complete.

1. Keep the default **Networking** options, which uses the kubenet networking plug-in, and then select **Next: Integrations**.
1. Keep the default **Integrations** options and then select **Next: Advanced**.
1. Keep the default **Advanced** options and then select **Next: Tags**.
1. On the tags page, leave the default option and then select **Next: Review + create**.
1. When you navigate to the **Review + create** tab, Azure runs validation on the settings that you have chosen. If validation passes, you can proceed to create the AKS cluster by selecting **Create**. If validation fails, then it indicates which settings need to be modified.
1. It takes a few minutes to create the AKS cluster. When your deployment is complete, navigate to your resource by either:
    * Selecting **Go to resource**, or
    * Browsing to the AKS cluster resource group and selecting the AKS resource. In this example you browse for *myResourceGroup* and select the resource *myAKSCluster*.

## Connect to the cluster

To manage a Kubernetes cluster, use the Kubernetes command-line client, [kubectl][kubectl]. `kubectl` is already installed if you use Azure Cloud Shell. If you're unfamiliar with the Cloud Shell, review [Overview of Azure Cloud Shell](../../cloud-shell/overview.md).

1. Open Cloud Shell using the `>_` button on the top of the Azure portal.

    :::image type="content" source="media/quick-kubernetes-deploy-portal/aks-cloud-shell.png" alt-text="Screenshot of Open the Azure Cloud Shell in the portal option.":::

    > [!NOTE]
    > To perform these operations in a local shell installation:
    > 1. Verify Azure CLI or Azure PowerShell is installed.
    > 2. Connect to Azure via the `az login` or `Connect-AzAccount` command.

### [Azure CLI](#tab/azure-cli)

2. Configure `kubectl` to connect to your Kubernetes cluster using the [az aks get-credentials][az-aks-get-credentials] command. The following command downloads credentials and configures the Kubernetes CLI to use them.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

### [Azure PowerShell](#tab/azure-powershell)

2. Configure `kubectl` to connect to your Kubernetes cluster using the [Import-AzAksCredential][import-azakscredential] cmdlet. The following command downloads credentials and configures the Kubernetes CLI to use them.

    ```azurepowershell-interactive
    Import-AzAksCredential -ResourceGroupName myResourceGroup -Name myAKSCluster
    ```
    
---

3. Verify the connection to your cluster using `kubectl get` to return a list of the cluster nodes.

    ```console
    kubectl get nodes
    ```

    Output shows the single node created in the previous steps. Make sure the node status is *Ready*:

    ```output
    NAME                                STATUS   ROLES   AGE     VERSION
    aks-agentpool-87331340-vmss000000   Ready    agent   8m53s   v1.25.6
    aks-agentpool-87331340-vmss000001   Ready    agent   8m51s   v1.25.6
    aks-agentpool-87331340-vmss000002   Ready    agent   8m57s   v1.25.6
    ```

## Deploy the application

A Kubernetes manifest file defines a cluster's desired state, like which container images to run.

In this quickstart, you will use a manifest to create all objects needed to run the Azure Vote application. This manifest includes two Kubernetes deployments:

* The sample Azure Vote Python applications.
* A Redis instance.

Two Kubernetes Services are also created:

* An internal service for the Redis instance.
* An external service to access the Azure Vote application from the internet.

1. In the Cloud Shell, open an editor and create a file named `azure-vote.yaml`.
2. Paste in the following YAML definition:

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

1. Deploy the application using the `kubectl apply` command and specify the name of your YAML manifest:

    ```console
    kubectl apply -f azure-vote.yaml
    ```

    Output shows the successfully created deployments and services:

    ```output
    deployment "azure-vote-back" created
    service "azure-vote-back" created
    deployment "azure-vote-front" created
    service "azure-vote-front" created
    ```

## Test the application

When the application runs, a Kubernetes service exposes the application front end to the internet. This process can take a few minutes to complete.

To monitor progress, use the `kubectl get service` command with the `--watch` argument.

```console
kubectl get service azure-vote-front --watch
```

The **EXTERNAL-IP** output for the `azure-vote-front` service will initially show as *pending*.

```output
NAME               TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
azure-vote-front   LoadBalancer   10.0.37.27   <pending>     80:30572/TCP   6s
```

Once the **EXTERNAL-IP** address changes from *pending* to an actual public IP address, use `CTRL-C` to stop the `kubectl` watch process. The following example output shows a valid public IP address assigned to the service:

```output
azure-vote-front   LoadBalancer   10.0.37.27   52.179.23.131   80:30572/TCP   2m
```

To see the Azure Vote app in action, open a web browser to the external IP address of your service.

:::image type="content" source="media/quick-kubernetes-deploy-portal/azure-voting-application.png" alt-text="Screenshot of browsing to Azure Vote sample application.":::

## Delete cluster

To avoid Azure charges, if you don't plan on going through the tutorials that follow, clean up your unnecessary resources. Select the **Delete** button on the AKS cluster dashboard. You can also use the [az group delete][az-group-delete] command or the [Remove-AzResourceGroup][remove-azresourcegroup] cmdlet to remove the resource group, container service, and all related resources.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup
```

---

> [!NOTE]
> The AKS cluster was created with a system-assigned managed identity. This identity is managed by the platform and doesn't require removal.

## Next steps

In this quickstart, you deployed a Kubernetes cluster and then deployed a sample multi-container application to it.

To learn more about AKS by walking through a complete example, including building an application, deploying from Azure Container Registry, updating a running application, and scaling and upgrading your cluster, continue to the Kubernetes cluster tutorial.

> [!div class="nextstepaction"]
> [AKS tutorial][aks-tutorial]

<!-- LINKS - external -->
[azure-vote-app]: https://github.com/Azure-Samples/azure-voting-app-redis.git
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubernetes-documentation]: https://kubernetes.io/docs/home/

<!-- LINKS - internal -->
[kubernetes-concepts]: ../concepts-clusters-workloads.md
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[import-azakscredential]: /powershell/module/az.aks/import-azakscredential
[az-group-delete]: /cli/azure/group#az-group-delete
[remove-azresourcegroup]: /powershell/module/az.resources/remove-azresourcegroup
[az-aks-delete]: /cli/azure/aks#az_aks_delete
[aks-monitor]: ../azure-monitor/containers/container-insights-overview.md
[aks-network]: ../concepts-network.md
[aks-tutorial]: ../tutorial-kubernetes-prepare-app.md
[http-routing]: ../http-application-routing.md
[preset-config]: ../quotas-skus-regions.md#cluster-configuration-presets-in-the-azure-portal
[sp-delete]: ../kubernetes-service-principal.md#additional-considerations
