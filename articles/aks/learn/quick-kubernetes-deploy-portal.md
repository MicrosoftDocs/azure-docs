---
title: 'Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster using the Azure portal'
titleSuffix: Azure Kubernetes Service
description: Learn how to quickly create a Kubernetes cluster, deploy an application, and monitor performance in Azure Kubernetes Service (AKS) using the Azure portal.
ms.topic: quickstart
ms.date: 10/23/2023
ms.custom: mvc, seo-javascript-october2019, contperf-fy21q3, mode-ui, devx-track-linux
#Customer intent: As a developer or cluster operator, I want to quickly create an AKS cluster and deploy an application so that I can see how to run and monitor applications using the managed Kubernetes service in Azure.
---

# Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster using Azure portal

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage clusters. In this quickstart, you:

* Deploy an AKS cluster using the Azure portal.
* Run a sample multi-container application with a group of microservices and web front ends simulating a retail scenario.

> [!NOTE]
> This sample application is just for demo purposes and doesn't represent all the best practices for Kubernetes applications.

:::image type="content" source="media/quick-kubernetes-deploy-portal/aks-store-application.png" alt-text="Screenshot of browsing to Azure Store sample application." lightbox="media/quick-kubernetes-deploy-portal/aks-store-application.png":::

## Before you begin

* This quickstart assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].
* You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* If you're unfamiliar with the Azure Cloud Shell, review [Overview of Azure Cloud Shell](../../cloud-shell/overview.md).
* To learn more about creating a Windows Server node pool, see [Create an AKS cluster that supports Windows Server containers](quick-windows-container-deploy-portal.md).
* The identity you use to create your cluster has the appropriate minimum permissions. For more details on access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)](../concepts-identity.md).

> [!NOTE]
> The Azure Linux node pool is now generally available (GA). To learn about the benefits and deployment steps, see the [Introduction to the Azure Linux Container Host for AKS][intro-azure-linux].

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

    :::image type="content" source="media/quick-kubernetes-deploy-portal/create-cluster-basics.png" alt-text="Screenshot of Create AKS cluster - provide basic information." lightbox="media/quick-kubernetes-deploy-portal/create-cluster-basics.png":::

    > [!NOTE]
    > You can change the preset configuration when creating your cluster by selecting *Learn more and compare presets* and choosing a different option.
    > :::image type="content" source="media/quick-kubernetes-deploy-portal/cluster-preset-options.png" alt-text="Screenshot of Create AKS cluster - portal preset options." lightbox="media/quick-kubernetes-deploy-portal/cluster-preset-options.png":::

1. Select **Next: Node pools** when complete.
1. On the **Node pools** page, leave the default options and then select **Next: Access**.
1. On the **Access** page, configure the following options:

    - The default value for **Resource identity** is **System-assigned managed identity**. Managed identities provide an identity for applications to use when connecting to resources that support Microsoft Entra authentication. For more details about managed identities, see [What are managed identities for Azure resources?](../../active-directory/managed-identities-azure-resources/overview.md).
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

    :::image type="content" source="media/quick-kubernetes-deploy-portal/aks-cloud-shell.png" alt-text="Screenshot of Open the Azure Cloud Shell in the portal option." lightbox="media/quick-kubernetes-deploy-portal/aks-cloud-shell.png":::

    > [!NOTE]
    > To perform these operations in a local shell installation:
    >
    > 1. Verify Azure CLI or Azure PowerShell is installed.
    > 2. Connect to Azure via the `az login` or `Connect-AzAccount` command.

### [Azure CLI](#tab/azure-cli)

1. Configure `kubectl` to connect to your Kubernetes cluster using the [`az aks get-credentials`][az-aks-get-credentials] command. This command downloads credentials and configures the Kubernetes CLI to use them.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

2. Verify the connection to your cluster using `kubectl get` to return a list of the cluster nodes.

    ```azurecli-interactive
    kubectl get nodes
    ```

    The following example output shows the single node created in the previous steps. Make sure the node status is *Ready*.

    ```output
    NAME                                STATUS   ROLES   AGE     VERSION
    aks-nodepool1-31718369-0   Ready    agent   6m44s   v1.15.10
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Configure `kubectl` to connect to your Kubernetes cluster using the [`Import-AzAksCredential`][import-azakscredential] cmdlet. This command downloads credentials and configures the Kubernetes CLI to use them.

    ```azurepowershell-interactive
    Import-AzAksCredential -ResourceGroupName myResourceGroup -Name myAKSCluster
    ```

2. Verify the connection to your cluster using `kubectl get` to return a list of the cluster nodes.

    ```azurepowershell-interactive
    kubectl get nodes
    ```

    The following example output shows the single node created in the previous steps. Make sure the node status is *Ready*.

    ```output
    NAME                                STATUS   ROLES   AGE     VERSION
    aks-nodepool1-31718369-0   Ready    agent   6m44s   v1.15.10
    ```

---

## Deploy the application

To deploy the application, you use a manifest file to create all the objects required to run the [AKS Store application](https://github.com/Azure-Samples/aks-store-demo). A Kubernetes manifest file defines a cluster's desired state, such as which container images to run. The manifest includes the following Kubernetes deployments and services:

:::image type="content" source="media/quick-kubernetes-deploy-portal/aks-store-architecture.png" alt-text="Screenshot of Azure Store sample architecture." lightbox="media/quick-kubernetes-deploy-portal/aks-store-architecture.png":::

* **Store front**: Web application for customers to view products and place orders.
* **Product service**: Shows product information.
* **Order service**: Places orders.
* **Rabbit MQ**: Message queue for an order queue.

> [!NOTE]
> We don't recommend running stateful containers, such as Rabbit MQ, without persistent storage for production. These are used here for simplicity, but we recommend using managed services, such as Azure CosmosDB or Azure Service Bus.

1. In the Cloud Shell, open an editor and create a file named `aks-store-quickstart.yaml`.
2. Paste the following manifest into the editor:

    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: rabbitmq
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: rabbitmq
      template:
        metadata:
          labels:
            app: rabbitmq
        spec:
          nodeSelector:
            "kubernetes.io/os": linux
          containers:
          - name: rabbitmq
            image: mcr.microsoft.com/mirror/docker/library/rabbitmq:3.10-management-alpine
            ports:
            - containerPort: 5672
              name: rabbitmq-amqp
            - containerPort: 15672
              name: rabbitmq-http
            env:
            - name: RABBITMQ_DEFAULT_USER
              value: "username"
            - name: RABBITMQ_DEFAULT_PASS
              value: "password"
            resources:
              requests:
                cpu: 10m
                memory: 128Mi
              limits:
                cpu: 250m
                memory: 256Mi
            volumeMounts:
            - name: rabbitmq-enabled-plugins
              mountPath: /etc/rabbitmq/enabled_plugins
              subPath: enabled_plugins
          volumes:
          - name: rabbitmq-enabled-plugins
            configMap:
              name: rabbitmq-enabled-plugins
              items:
              - key: rabbitmq_enabled_plugins
                path: enabled_plugins
    ---
    apiVersion: v1
    data:
      rabbitmq_enabled_plugins: |
        [rabbitmq_management,rabbitmq_prometheus,rabbitmq_amqp1_0].
    kind: ConfigMap
    metadata:
      name: rabbitmq-enabled-plugins            
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: rabbitmq
    spec:
      selector:
        app: rabbitmq
      ports:
        - name: rabbitmq-amqp
          port: 5672
          targetPort: 5672
        - name: rabbitmq-http
          port: 15672
          targetPort: 15672
      type: ClusterIP
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: order-service
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: order-service
      template:
        metadata:
          labels:
            app: order-service
        spec:
          nodeSelector:
            "kubernetes.io/os": linux
          containers:
          - name: order-service
            image: ghcr.io/azure-samples/aks-store-demo/order-service:latest
            ports:
            - containerPort: 3000
            env:
            - name: ORDER_QUEUE_HOSTNAME
              value: "rabbitmq"
            - name: ORDER_QUEUE_PORT
              value: "5672"
            - name: ORDER_QUEUE_USERNAME
              value: "username"
            - name: ORDER_QUEUE_PASSWORD
              value: "password"
            - name: ORDER_QUEUE_NAME
              value: "orders"
            - name: FASTIFY_ADDRESS
              value: "0.0.0.0"
            resources:
              requests:
                cpu: 1m
                memory: 50Mi
              limits:
                cpu: 75m
                memory: 128Mi
          initContainers:
          - name: wait-for-rabbitmq
            image: busybox
            command: ['sh', '-c', 'until nc -zv rabbitmq 5672; do echo waiting for rabbitmq; sleep 2; done;']
            resources:
              requests:
                cpu: 1m
                memory: 50Mi
              limits:
                cpu: 75m
                memory: 128Mi    
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: order-service
    spec:
      type: ClusterIP
      ports:
      - name: http
        port: 3000
        targetPort: 3000
      selector:
        app: order-service
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: product-service
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: product-service
      template:
        metadata:
          labels:
            app: product-service
        spec:
          nodeSelector:
            "kubernetes.io/os": linux
          containers:
          - name: product-service
            image: ghcr.io/azure-samples/aks-store-demo/product-service:latest
            ports:
            - containerPort: 3002
            resources:
              requests:
                cpu: 1m
                memory: 1Mi
              limits:
                cpu: 1m
                memory: 7Mi
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: product-service
    spec:
      type: ClusterIP
      ports:
      - name: http
        port: 3002
        targetPort: 3002
      selector:
        app: product-service
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: store-front
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: store-front
      template:
        metadata:
          labels:
            app: store-front
        spec:
          nodeSelector:
            "kubernetes.io/os": linux
          containers:
          - name: store-front
            image: ghcr.io/azure-samples/aks-store-demo/store-front:latest
            ports:
            - containerPort: 8080
              name: store-front
            env: 
            - name: VUE_APP_ORDER_SERVICE_URL
              value: "http://order-service:3000/"
            - name: VUE_APP_PRODUCT_SERVICE_URL
              value: "http://product-service:3002/"
            resources:
              requests:
                cpu: 1m
                memory: 200Mi
              limits:
                cpu: 1000m
                memory: 512Mi
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: store-front
    spec:
      ports:
      - port: 80
        targetPort: 8080
      selector:
        app: store-front
      type: LoadBalancer
    ```

    For a breakdown of YAML manifest files, see [Deployments and YAML manifests](../concepts-clusters-workloads.md#deployments-and-yaml-manifests).

3. Deploy the application using the `kubectl apply` command and specify the name of your YAML manifest:

    ```console
    kubectl apply -f aks-store-quickstart.yaml
    ```

    The following example output shows the deployments and services:

    ```output
    deployment.apps/rabbitmq created
    service/rabbitmq created
    deployment.apps/order-service created
    service/order-service created
    deployment.apps/product-service created
    service/product-service created
    deployment.apps/store-front created
    service/store-front created
    ```

## Test the application

When the application runs, a Kubernetes service exposes the application front end to the internet. This process can take a few minutes to complete.

1. Check the status of the deployed pods using the [`kubectl get pods`][kubectl-get] command. Make all pods are `Running` before proceeding.

2. Check for a public IP address for the store-front application. Monitor progress using the [`kubectl get service`][kubectl-get] command with the `--watch` argument.

    ```azurecli-interactive
    kubectl get service store-front --watch
    ```

    The **EXTERNAL-IP** output for the `store-front` service initially shows as *pending*:

    ```output
    NAME          TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
    store-front   LoadBalancer   10.0.100.10   <pending>     80:30025/TCP   4h4m
    ```

3. Once the **EXTERNAL-IP** address changes from *pending* to an actual public IP address, use `CTRL-C` to stop the `kubectl` watch process.

    The following example output shows a valid public IP address assigned to the service:

    ```output
    NAME          TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)        AGE
    store-front   LoadBalancer   10.0.100.10   20.62.159.19   80:30025/TCP   4h5m
    ```

4. Open a web browser to the external IP address of your service to see the Azure Store app in action.

    :::image type="content" source="media/quick-kubernetes-deploy-portal/aks-store-application.png" alt-text="Screenshot of AKS Store sample application." lightbox="media/quick-kubernetes-deploy-portal/aks-store-application.png":::

## Delete the cluster

If you don't plan on going through the following tutorials, clean up unnecessary resources to avoid Azure charges.

1. In the Azure portal, navigate to your AKS cluster resource group.
2. Select **Delete resource group**.
3. Enter the name of the resource group to delete, and then select **Delete** > **Delete**.

    > [!NOTE]
    > The AKS cluster was created with a system-assigned managed identity. This identity is managed by the platform and doesn't require removal.

## Next steps

In this quickstart, you deployed a Kubernetes cluster and deployed a simple multi-container application to it.

To learn more about AKS and walk through a complete code-to-deployment example, continue to the Kubernetes cluster tutorial.

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
[intro-azure-linux]: ../../azure-linux/intro-azure-linux.md