---
title: 'Quickstart: Create an Azure Kubernetes Service (AKS) cluster using Terraform'
description: Learn how to quickly create a Kubernetes cluster using Terraform and deploy an application in Azure Kubernetes Service (AKS).
ms.topic: quickstart
ms.date: 10/23/2023
ms.custom: devx-track-terraform
content_well_notification: 
  - AI-contribution
#Customer intent: As a developer or cluster operator, I want to quickly create an AKS cluster and deploy an application so that I can see how to run applications using the managed Kubernetes service in Azure.
---

# Quickstart: Create an Azure Kubernetes Service (AKS) cluster using Terraform

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage clusters. In this quickstart, you:

* Deploy an AKS cluster using Terraform.
* Run a sample multi-container application with a group of microservices and web front ends simulating a retail scenario.

> [!NOTE]
> This sample application is just for demo purposes and doesn't represent all the best practices for Kubernetes applications.

:::image type="content" source="media/quick-kubernetes-deploy-terraform/aks-store-application.png" alt-text="Screenshot of browsing to Azure Store sample application." lightbox="media/quick-kubernetes-deploy-terraform/aks-store-application.png":::

## Before you begin

* This quickstart assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].
* You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* To learn more about creating a Windows Server node pool, see [Create an AKS cluster that supports Windows Server containers](quick-windows-container-deploy-cli.md).
* [Install and configure Terraform](/azure/developer/terraform/quickstart-configure).
* [Download kubectl](https://kubernetes.io/releases/download/).
* Create a random value for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet).
* Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group).
* Access the configuration of the AzureRM provider to get the Azure Object ID using [azurerm_client_config](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/client_config).
* Create a Kubernetes cluster using [azurerm_kubernetes_cluster](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kubernetes_cluster).
* Create an AzAPI resource [azapi_resource](https://registry.terraform.io/providers/Azure/azapi/latest/docs/resources/azapi_resource).
* Create an AzAPI resource to generate an SSH key pair using [azapi_resource_action](https://registry.terraform.io/providers/Azure/azapi/latest/docs/resources/azapi_resource_action).

> [!NOTE]
> The Azure Linux node pool is now generally available (GA). To learn about the benefits and deployment steps, see the [Introduction to the Azure Linux Container Host for AKS][intro-azure-linux].

## Login to your Azure Account

[!INCLUDE [authenticate-to-azure.md](~/azure-dev-docs-pr/articles/terraform/includes/authenticate-to-azure.md)]

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/201-k8s-cluster-with-tf-and-aks). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/201-k8s-cluster-with-tf-and-aks/TestRecord.md).
>
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory you can use to test the sample Terraform code and make it your current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/201-k8s-cluster-with-tf-and-aks/providers.tf)]

1. Create a file named `ssh.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/201-k8s-cluster-with-tf-and-aks/ssh.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/201-k8s-cluster-with-tf-and-aks/main.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/201-k8s-cluster-with-tf-and-aks/variables.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/201-k8s-cluster-with-tf-and-aks/outputs.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

1. Get the Azure resource group name using the following command.

    ```console
    resource_group_name=$(terraform output -raw resource_group_name)
    ```

2. Display the name of your new Kubernetes cluster using the [`az aks list`](/cli/azure/aks#az-aks-list) command.

    ```azurecli-interactive
    az aks list \
      --resource-group $resource_group_name \
      --query "[].{\"K8s cluster name\":name}" \
      --output table
    ```

3. Get the Kubernetes configuration from the Terraform state and store it in a file that `kubectl` can read using the following command.

    ```console
    echo "$(terraform output kube_config)" > ./azurek8s
    ```

4. Verify the previous command didn't add an ASCII EOT character using the following command.

    ```console
    cat ./azurek8s
    ```

   **Key points:**

    * If you see `<< EOT` at the beginning and `EOT` at the end, remove these characters from the file. Otherwise, you may receive the following error message: `error: error loading config file "./azurek8s": yaml: line 2: mapping values are not allowed in this context`

5. Set an environment variable so `kubectl` can pick up the correct config using the following command.

    ```console
    export KUBECONFIG=./azurek8s
    ```

6. Verify the health of the cluster using the `kubectl get nodes` command.

    ```console
    kubectl get nodes
    ```

**Key points:**

* When you created the AKS cluster, monitoring was enabled to capture health metrics for both the cluster nodes and pods. These health metrics are available in the Azure portal. For more information on container health monitoring, see [Monitor Azure Kubernetes Service health](/azure/azure-monitor/insights/container-insights-overview).
* Several key values classified as output when you applied the Terraform execution plan. For example, the host address, AKS cluster user name, and AKS cluster password are output.

## Deploy the application

To deploy the application, you use a manifest file to create all the objects required to run the [AKS Store application](https://github.com/Azure-Samples/aks-store-demo). A [Kubernetes manifest file][kubernetes-deployment] defines a cluster's desired state, such as which container images to run. The manifest includes the following Kubernetes deployments and services:

:::image type="content" source="media/quick-kubernetes-deploy-terraform/aks-store-architecture.png" alt-text="Screenshot of Azure Store sample architecture." lightbox="media/quick-kubernetes-deploy-terraform/aks-store-architecture.png":::

* **Store front**: Web application for customers to view products and place orders.
* **Product service**: Shows product information.
* **Order service**: Places orders.
* **Rabbit MQ**: Message queue for an order queue.

> [!NOTE]
> We don't recommend running stateful containers, such as Rabbit MQ, without persistent storage for production. These are used here for simplicity, but we recommend using managed services, such as Azure CosmosDB or Azure Service Bus.

1. Create a file named `aks-store-quickstart.yaml` and copy in the following manifest:

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

2. Deploy the application using the `kubectl apply` command and specify the name of your YAML manifest.

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

### Test the application

When the application runs, a Kubernetes service exposes the application front end to the internet. This process can take a few minutes to complete.

1. Check the status of the deployed pods using the `kubectl get pods` command. Make all pods are `Running` before proceeding.

2. Check for a public IP address for the store-front application. Monitor progress using the `kubectl get service` command with the `--watch` argument.

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

    :::image type="content" source="media/quick-kubernetes-deploy-terraform/aks-store-application.png" alt-text="Screenshot of AKS Store sample application." lightbox="media/quick-kubernetes-deploy-terraform/aks-store-application.png":::

## Clean up resources

### Delete AKS resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

### Delete service principal

1. Get the service principal ID using the following command.

    ```azurecli-interactive
    sp=$(terraform output -raw sp)
    ```

1. Delete the service principal using the [`az ad sp delete`](/cli/azure/ad/sp#az-ad-sp-delete) command.

    ```azurecli-interactive
    az ad sp delete --id $sp
    ```

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot).

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using AKS.](/azure/aks)

<!-- LINKS - internal -->
[kubernetes-concepts]: ../concepts-clusters-workloads.md
[kubernetes-deployment]: ../concepts-clusters-workloads.md#deployments-and-yaml-manifests

<!-- LINKS - Internal -->
[intro-azure-linux]: ../../azure-linux/intro-azure-linux.md
