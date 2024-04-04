---
title: 'Quickstart: Deploy an Azure Kubernetes Service (AKS) Automatic cluster (preview)'
description: Learn how to quickly deploy a Kubernetes cluster and deploy an application in Azure Kubernetes Service (AKS) Automatic (preview).
ms.topic: quickstart
ms.date: 04/04/2024
author: sabbour
ms.author: asabbour
zone_pivot_groups: bicep-azure-cli-portal

---

# Quickstart: Deploy an Azure Kubernetes Service (AKS) Automatic cluster (preview)

**Applies to:** :heavy_check_mark: AKS Automatic (preview)

Azure Kubernetes Service (AKS) Automatic (preview) provides the easiest managed Kubernetes experience for developers, DevOps, and platform engineers, ideal for modern and AI applications. It automates AKS cluster setup and operations, embedding best practice configurations, so that users of any skill level are ensured security, performance, and dependability for their applications. In this quickstart, you learn to:

- Deploy an AKS Automatic cluster.
- Run a sample multi-container application with a group of microservices and web front ends simulating a retail scenario.


## Before you begin

This quickstart assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].

- [!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version X.X.XX or later of the Azure CLI. If you're using Azure Cloud Shell, the latest version is already installed there.
- This article requires the `aks-preview` Azure CLI extension version X.X.XX or later.
- Register the `AutomaticSKUPreview` feature in your Azure subscription.
- Make sure that the identity you're using to create your cluster has the appropriate minimum permissions. For more details on access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)](../concepts-identity.md).
- If you have multiple Azure subscriptions, select the appropriate subscription ID in which the resources should be billed using the [az account set](/cli/azure/account#az-account-set) command.

### Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](../includes/preview/preview-callout.md)]

To install the aks-preview extension, run the following command:

```azurecli
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension released:

```azurecli
az extension update --name aks-preview
```

### Register the `AutomaticSKUPreview` feature flag

Register the `AutomaticSKUPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "AutomaticSKUPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "AutomaticSKUPreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace "Microsoft.ContainerService"
```

:::zone target="docs" pivot="azure-cli"

## Create a resource group

An [Azure resource group][azure-resource-group] is a logical group in which Azure resources are deployed and managed. When you create a resource group, you're prompted to specify a location. This location is the storage location of your resource group metadata and where your resources run in Azure if you don't specify another region during resource creation.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

Create a resource group using the [az group create][az-group-create] command.

```azurecli
az group create --name myResourceGroup --location eastus
```

The following sample output resembles successful creation of the resource group:

```output
{
  "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup",
  "location": "eastus",
  "managedBy": null,
  "name": "myResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```

## Create an AKS Automatic cluster

To create an AKS Automatic cluster, use the [az aks create][az-aks-create] command. The following example creates a cluster named *myAKSAutomaticCluster*.

```azurecli
az aks create \
  --resource-group myResourceGroup \
  --name myAKSAutomaticCluster \
  --sku automatic
```

After a few minutes, the command completes and returns JSON-formatted information about the cluster.

## Connect to the cluster

To manage a Kubernetes cluster, use the Kubernetes command-line client, [kubectl][kubectl]. `kubectl` is already installed if you use Azure Cloud Shell. To install `kubectl` locally, call the [az aks install-cli][az-aks-install-cli] command.

1. Configure `kubectl` to connect to your Kubernetes cluster using the [az aks get-credentials][az-aks-get-credentials] command. This command downloads credentials and configures the Kubernetes CLI to use them.

```azurecli
az aks get-credentials --resource-group myResourceGroup --name myAKSAutomaticCluster
```

1. Verify the connection to your cluster using the [kubectl get][kubectl-get] command. This command returns a list of the cluster nodes.

```azurecli
kubectl get nodes
```

The following sample output shows the managed node pools created in the previous steps. Make sure the node status is *Ready*.

```output
NAME                                 STATUS   ROLES   AGE     VERSION
aks-default-f8vj2                    Ready    agent   2m26s   v1.28.5
aks-systempool-13213685-vmss000000   Ready    agent   2m26s   v1.28.5
aks-systempool-13213685-vmss000001   Ready    agent   2m26s   v1.28.5
aks-systempool-13213685-vmss000002   Ready    agent   2m26s   v1.28.5
```

:::zone-end

:::zone target="docs" pivot="azure-portal"

TBC.

:::zone-end

:::zone target="docs" pivot="bicep"

TBC.

:::zone-end


## Deploy the application

To deploy the application, you use a manifest file to create all the objects required to run the [AKS Store application](https://github.com/Azure-Samples/aks-store-demo). A [Kubernetes manifest file][kubernetes-deployment] defines a cluster's desired state, such as which container images to run. The manifest includes the following Kubernetes deployments and services:

:::image type="content" source="media/quick-kubernetes-deploy-portal/aks-store-architecture.png" alt-text="Screenshot of Azure Store sample architecture." lightbox="media/quick-kubernetes-deploy-portal/aks-store-architecture.png":::

- **Store front**: Web application for customers to view products and place orders.
- **Product service**: Shows product information.
- **Order service**: Places orders.
- **Rabbit MQ**: Message queue for an order queue.

> [!NOTE]
> We don't recommend running stateful containers, such as Rabbit MQ, without persistent storage for production. These are used here for simplicity, but we recommend using managed services, such as Azure Cosmos DB or Azure Service Bus.

1. Create a file named `aks-store-quickstart.yaml` and copy in the following manifest:

    ```yaml
    apiVersion: v1
    kind: Namespace
    metadata:
      name: aks-store-demo
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: rabbitmq
      namespace: aks-store-demo
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
    kind: ConfigMap
    metadata:
      name: rabbitmq-enabled-plugins
      namespace: aks-store-demo
    data:
      rabbitmq_enabled_plugins: |
        [rabbitmq_management,rabbitmq_prometheus,rabbitmq_amqp1_0].
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: rabbitmq
      namespace: aks-store-demo
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
      namespace: aks-store-demo
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
      namespace: aks-store-demo
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
      namespace: aks-store-demo
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
      namespace: aks-store-demo
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
      namespace: aks-store-demo
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
      namespace: aks-store-demo
    spec:
      ports:
      - port: 80
        targetPort: 8080
      selector:
        app: store-front
      type: LoadBalancer
    ```

    For a breakdown of YAML manifest files, see [Deployments and YAML manifests](../concepts-clusters-workloads.md#deployments-and-yaml-manifests).

    If you create and save the YAML file locally, then you can upload the manifest file to your default directory in Cloud Shell by selecting the **Upload/Download files** button and selecting the file from your local file system.

1. Deploy the application using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest.

    ```azurecli
    kubectl apply -f aks-store-quickstart.yaml
    ```

    The following sample output shows the deployments and services:

    ```output
    namespace/aks-store-demo created
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

1. Check the status of the deployed pods using the [kubectl get pods][kubectl-get] command. Make sure all pods are `Running` before proceeding.

    ```console
    kubectl get pods -n aks-store-demo
    ```

1. Check for a public IP address for the store-front application. Monitor progress using the [kubectl get service][kubectl-get] command with the `--watch` argument.

    ```azurecli
    kubectl get service store-front -n aks-store-demo --watch
    ```

    The **EXTERNAL-IP** output for the `store-front` service initially shows as *pending*:

    ```output
    NAME          TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
    store-front   LoadBalancer   10.0.100.10   <pending>     80:30025/TCP   4h4m
    ```

1. Once the **EXTERNAL-IP** address changes from *pending* to an actual public IP address, use `CTRL-C` to stop the `kubectl` watch process.

    The following sample output shows a valid public IP address assigned to the service:

    ```output
    NAME          TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)        AGE
    store-front   LoadBalancer   10.0.100.10   20.62.159.19   80:30025/TCP   4h5m
    ```

1. Open a web browser to the external IP address of your service to see the Azure Store app in action.

    :::image type="content" source="media/quick-kubernetes-deploy-cli/aks-store-application.png" alt-text="Screenshot of AKS Store sample application." lightbox="media/quick-kubernetes-deploy-cli/aks-store-application.png":::

## Delete the cluster

:::zone target="docs" pivot="azure-cli"

If you don't plan on going through the [AKS tutorial][aks-tutorial], clean up unnecessary resources to avoid Azure charges. Call the [az group delete][az-group-delete] command to remove the resource group, container service, and all related resources.

  ```azurecli
  az group delete --name myResourceGroup --yes --no-wait
  ```
:::zone-end

  > [!NOTE]
  > The AKS cluster was created with a system-assigned managed identity, which is the default identity option used in this quickstart. The platform manages this identity so you don't need to manually remove it.

## Next steps

In this quickstart, you deployed a Kubernetes cluster using AKS Automatic and then deployed a simple multi-container application to it. This sample application is for demo purposes only and doesn't represent all the best practices for Kubernetes applications. For guidance on creating full solutions with AKS for production, see [AKS solution guidance][aks-solution-guidance].

To learn more about AKS and walk through a complete code-to-deployment example, continue to the Kubernetes cluster tutorial.

> [!div class="nextstepaction"]
> [AKS tutorial][aks-tutorial]


<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

<!-- LINKS - internal -->
[kubernetes-concepts]: ../concepts-clusters-workloads.md
[aks-tutorial]: ../tutorial-kubernetes-prepare-app.md
[azure-resource-group]: ../../azure-resource-manager/management/overview.md
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-aks-install-cli]: /cli/azure/aks#az-aks-install-cli
[az-group-create]: /cli/azure/group#az-group-create
[az-group-delete]: /cli/azure/group#az-group-delete
[kubernetes-deployment]: ../concepts-clusters-workloads.md#deployments-and-yaml-manifests
[aks-solution-guidance]: /azure/architecture/reference-architectures/containers/aks-start-here?toc=/azure/aks/toc.json&bc=/azure/aks/breadcrumb/toc.json
[baseline-reference-architecture]: /azure/architecture/reference-architectures/containers/aks/baseline-aks?toc=/azure/aks/toc.json&bc=/azure/aks/breadcrumb/toc.json

