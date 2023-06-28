---
title: Deploy OpenAI Workload on AKS
description: #Required; article description that is displayed in search results. 
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 6/28/2023
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Deploy OpenAI Workload on AKS 

Azure Kubernetes Service (AKS) is a managed Kubernetes Service that lets you quickly deploy workload and managed your kubernetes clusters. In this doc, you will:
- Learn how to deploy Azure OpenAI or OpenAI workload on AKS. With Azure Open AI or OpenAI, different AI models can be easily adapted to your specific task including but not limited to content generation, summarization, semantic search, and natural language to code generation. 
- Run a sample multi-container applications that is representative of a real-world application. The application is polygot, has a database, a web front end, and events to simulate traffic.
- Codebase for [AKS Store Demo][aks-store-demo] can be found on GitHub

## Before you begin

- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- For this demo, you can either use Azure Open AI service or Open AI service. If you plan on using Azure OpenAI service, you will need to enable it for your Azure subscription by filling out the [Request Access to Azure OpenAI Service][aoai-access] form.
- If you plan on using OpenAI, please sign up for that at the [OpenAI website][open-ai-landing].

- is there a min CLI version required? <!--todo-->
- any flag needs to be enabled in the CLI?

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)] 

## Create a Resource Group
An [Azure resource group][azure-resource-group] is a logical group in which Azure resources are deployed and managed. When you create a resource group, you're prompted to specify a location. This location is the storage location of your resource group metadata and where your resources run in Azure if you don't specify another region during resource creation.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

* Create a resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    ```

    The following output example resembles successful creation of the resource group:

    ```json
    {
      "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup",
      "location": "eastus",
      "managedBy": null,
      "name": "myResourceGroup",
      "properties": {
        "provisioningState": "Succeeded"
      },
      "tags": null,
      "type": "Microsoft.Resources/resourceGroups"
    }
    ```

## Create an AKS Cluster
The following example creates a cluster named *myAKSCluster* in the resource group *myResourceGroup* created earlier.

* Create an AKS cluster using the [`az aks create`][az-aks-create] command.

    ```azurecli-interactive
    az aks create -g myResourceGroup -n myAKSCluster
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

> [!NOTE]
> When you create a new cluster, AKS automatically creates a second resource group to store the AKS resources. For more information, see [Why are two resource groups created with AKS?](faq.md#why-are-two-resource-groups-created-with-aks)

## Connect to the cluster

To manage a Kubernetes cluster, use the Kubernetes command-line client, [kubectl][kubectl]. `kubectl` is already installed if you use Azure Cloud Shell.

1. Install `kubectl` locally using the [`az aks install-cli`][az-aks-install-cli] command.

    ```azurecli
    az aks install-cli
    ```

2. Configure `kubectl` to connect to your Kubernetes cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    This command executes the following operations:

    * Downloads credentials and configures the Kubernetes CLI to use them.
    * Uses `~/.kube/config`, the default location for the [Kubernetes configuration file][kubeconfig-file]. Specify a different location for your Kubernetes configuration file using *--file* argument.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

3. Verify the connection to your cluster using the [`kubectl get`][kubectl-get] command. This command returns a list of the cluster nodes.

    ```azurecli-interactive
    kubectl get nodes
    ```

    The following output example shows the single node created in the previous steps. Make sure the node status is *Ready*.

    ```output
    NAME                       STATUS   ROLES   AGE     VERSION
    aks-nodepool1-31718369-0   Ready    agent   6m44s   v1.25.6
    ```

## Deploy the application 

:::image type="content" source="media/aks-ai-demo/aks-ai-demo-architecture.png" alt-text="Architecture diagram of AKS AI demo":::

In this demo, you use a manifest to create all objectes needed to run the [AKS Store application][aks-store-demo]. This manifest include Kubernetes deployments and services for:
- Product Service: shows product information
- Order Service: places orders
- Makeline Service: processes to process orders from the queue and completes the orders
- Store Front: web application for customers to view products and place orders
- Store Admin: web application for store employees to view orders in the queue and manage product informations
- Virtual Customer: simulates order creation on a scheduled basis
- Virtual Worker: simulates order completion on a scheduled basis
- Mongo DB: MongoDB instance for persisted data
- Rabbit MQ: RabbitMQ for an order queue

1. Create a file named `azure-store.yaml` and copy in the following manifest.
    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: mongodb
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: mongodb
      template:
        metadata:
          labels:
            app: mongodb
        spec:
          nodeSelector:
            "kubernetes.io/os": linux
          containers:
          - name: mongodb
            image: mcr.microsoft.com/mirror/docker/library/mongo:4.2
            ports:
            - containerPort: 27017
              name: mongodb
            resources: {}
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: mongodb
    spec:
      ports:
      - port: 27017
      selector:
        app: mongodb
      type: ClusterIP    
    ---
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
            resources: {}
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
            - name: ORDER_QUEUE_PROTOCOL
              value: "amqp"
            - name: ORDER_QUEUE_HOSTNAME
              value: "rabbitmq"
            - name: ORDER_QUEUE_PORT
              value: "5672"
            - name: ORDER_QUEUE_USERNAME
              value: "username"
            - name: ORDER_QUEUE_PASSWORD
              value: "password"
            - name: FASTIFY_ADDRESS
              value: "0.0.0.0"
            resources: {}
          initContainers:
          - name: wait-for-rabbitmq
            image: busybox
            command: ['sh', '-c', 'until nc -zv rabbitmq 5672; do echo waiting for rabbitmq; sleep 2; done;']        
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
      name: makeline-service
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: makeline-service
      template:
        metadata:
          labels:
            app: makeline-service
        spec:
          nodeSelector:
            "kubernetes.io/os": linux
          containers:
          - name: makeline-service
            image: ghcr.io/azure-samples/aks-store-demo/makeline-service:latest
            ports:
            - containerPort: 3001
            env:
            - name: ORDER_QUEUE_CONNECTION_STRING
              value: "amqp://username:password@rabbitmq:5672/"
            - name: ORDER_QUEUE_NAME
              value: "orders"
            - name: ORDER_DB_CONNECTION_STRING
              value: "mongodb://mongodb:27017"
            - name: ORDER_DB_NAME
              value: "orderdb"
            - name: ORDER_DB_COLLECTION_NAME
              value: "orders"
            resources: {}
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: makeline-service
    spec:
      type: ClusterIP
      ports:
      - name: http
        port: 3001
        targetPort: 3001
      selector:
        app: makeline-service
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
            resources: {}
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
            resources: {}
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
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: store-admin
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: store-admin
      template:
        metadata:
          labels:
            app: store-admin
        spec:
          nodeSelector:
            "kubernetes.io/os": linux
          containers:
          - name: store-admin
            image: ghcr.io/azure-samples/aks-store-demo/store-admin:latest
            ports:
            - containerPort: 8081
              name: store-admin
            env:
            - name: VUE_APP_PRODUCT_SERVICE_URL
              value: "http://product-service:3002/"
            - name: VUE_APP_MAKELINE_SERVICE_URL
              value: "http://makeline-service:3001/"
            - name: VUE_APP_AI_SERVICE_URL
              value: "http://ai-service:5001/"
            resources: {}
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: store-admin
    spec:
      ports:
      - port: 80
        targetPort: 8081
      selector:
        app: store-admin
      type: LoadBalancer  
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: virtual-customer
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: virtual-customer
      template:
        metadata:
          labels:
            app: virtual-customer
        spec:
          nodeSelector:
            "kubernetes.io/os": linux
          containers:
          - name: virtual-worker
            image: ghcr.io/azure-samples/aks-store-demo/virtual-customer:latest
            env:
            - name: ORDER_SERVICE_URL
              value: http://order-service:3000/
            - name: ORDERS_PER_HOUR
              value: "100"
            resources: {}
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: virtual-worker
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: virtual-worker
      template:
        metadata:
          labels:
            app: virtual-worker
        spec:
          nodeSelector:
            "kubernetes.io/os": linux
          containers:
          - name: virtual-worker
            image: ghcr.io/azure-samples/aks-store-demo/virtual-worker:latest
            env:
            - name: MAKELINE_SERVICE_URL
              value: http://makeline-service:3001
            - name: ORDERS_PER_HOUR
              value: "100"
            resources: {}
    ```

1. Deploy the application using the [kubectl apply][kubectl-apply] command and specify the name of your yaml manifest.
    ```console
    kubectl apply -f azure-store.yaml
    ```

    The following example resembles output showing successfully created deployments and services.

    ```output
    deployment.apps/mongodb created
    service/mongodb created
    deployment.apps/rabbitmq created
    service/rabbitmq created
    deployment.apps/order-service created
    service/order-service created
    deployment.apps/makeline-service created
    service/makeline-service created
    deployment.apps/product-service created
    service/product-service created
    deployment.apps/store-front created
    service/store-front created
    deployment.apps/store-admin created
    service/store-admin created
    deployment.apps/virtual-customer created
    deployment.apps/virtual-worker created
    ```

## Deploy the AI service

Now that the application is deployed, you will be deploying a Python based microservice that uses Azure OpenAI or Open AI to automatically generate description for new products being added to the store's catalog. 

1. Create a file names `ai-service.yaml` and copy the following manifest into it.
   ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: ai-service
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: ai-service
      template:
        metadata:
          labels:
            app: ai-service
        spec:
          nodeSelector:
            "kubernetes.io/os": linux
          containers:
          - name: order-service
            image: ghcr.io/azure-samples/aks-store-demo/ai-service:latest
            ports:
            - containerPort: 5001
            env:
            - name: USE_AZURE_OPENAI # set to "True" in quote if you are using Azure OpenAI, set to "False" if you are using Open AI
              value: ""
            - name: AZURE_OPENAI_DEPLOYMENT_NAME # required if using Azure OpenAI
              value: ""
            - name: AZURE_OPENAI_ENDPOINT # required if using Azure OpenAI
              value: ""
            - name: OPENAI_API_KEY # always required
              value: ""
            - name: OPENAI_ORG_ID # required if using OpenAI
              value: ""
            resources: {}
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: ai-service
    spec:
      type: ClusterIP
      ports:
      - name: http
        port: 5001
        targetPort: 5001
      selector:
        app: ai-service
   ```
1. If using Azure Open AI: 
- Set the environment variable USE_AZURE_OPENAI to "True"
- Get your Azure OpenAI API key and Azure OpenAI endpoint from the Azure portal by clicking on `Keys and Endpoint` in the left blade of the resource. 
- Create a deployment at the [Azure OpenAI studio][aoai-studio] using the **text-davinci-003** model. For more information on how to create an deployment in Azure OpenAI, check out [Get started generating text using Azure OpenAI Service][aoai-get-started].
1. If using Open AI: 
- Set the environment variable USE_AZURE_OPENAI to "False"
- [Generate an Open AI key][open-ai-new-key] by clicking **Create new secret key** and copy the value into the YAML.
- [Find the organization ID][open-ai-org-id] and copy the value into the YAML. 
1. Update the environment variables section of the ai-service manifest file you created above by providing the appropriate information required depending on whether you are using Azure OpenAI or OpenAI. The commented text show which variables need to be filled in depending on your service.
1. Deploy the application using the [kubectl apply][kubectl-apply] command and specify the name of your yaml manifest.
    ```bash
    kubectl apply -f ai-service.yaml
    ```
   The following example resembles output showing successfully created deployments and services.
   ```output
   deployment.apps/ai-service created
   service/ai-service created
   ```

> [!NOTE]
> For best practice, use [Managed Identity][managed-identity] to store secrets. 

## Test the application
1. See the status of the deployed kubernetes objects using the [kubectl get all][kubectl-get] command. To get the IP of the store admin web application and store front web application, use the kubectl get service command.
    
    ```azurecli-interactive
    kubectl get service store-admin
    ```
    When the application runs, a Kubernetes service exposes the application front end to the internet. This process can take a few minutes to complete. **EXTERNAL IP** will initially show *pending*, until the service comes up and shows the IP address. 
    ```output
    NAME          TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)        AGE
    store-admin   LoadBalancer   10.0.142.228   40.64.86.161    80:32494/TCP   50m    
    ```
    Repeat the same step for the service named store-front. 
    
1. Open a web browser to the external IP address of your service. In the example shown here, open 40.64.86.161 to see store-admin in the browser. Repeat the same step for store-front. 
1. In store admin, click on the products tab, then click on **Add Products**. 
1. When the ai-service is running successfully, you should see the Ask OpenAI button next to description. Fill in the name, price, keywords, then click Ask OpenAI to generate a product description. Then click save product. 
:::image type="content" source="media/aks-ai-demo/ai-generate-description.png" alt-text="use open AI to generate a product description":::
1. You can now see the new product called Jungle Monkey Chew Toy on the store admin web app for sellers.
:::image type="content" source="media/aks-ai-demo/new-product-store-admin.png" alt-text="view the new product in the store admin page":::
1. You can also see the new product called Jungle Monkey Chew Toy on the store front web app for buyers. Remember to get the IP address of store front by using [kubectl get service][kubectl-get].
:::image type="content" source="media/aks-ai-demo/new-product-store-front.png" alt-text="view the new product in the store front page":::

## Contributors

*This article is maintained by Microsoft. It was originally written by the following contributors.* 

Principal authors:

- [Amanda Wang](https://www.linkedin.com/in/amandawang14/) | Product Manager
- [Ayobami Ayodeji](https://www.linkedin.com/in/ayobamiayodeji/) | Senior Program Manager 

*To see non-public LinkedIn profiles, sign in to LinkedIn.*

<!-- todo -->
## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)

<!-- Links external -->
[aks-store-demo]: https://github.com/Azure-Samples/aks-store-demo
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[kubeconfig-file]: https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[aoai-studio]: https://oai.azure.com/portal/
[open-ai-landing]: https://openai.com/
[open-ai-new-key]: https://platform.openai.com/account/api-keys
[open-ai-org-id]: https://platform.openai.com/account/org-settings
[aoai-access]: https:aks.ms/oai/access

<!-- Links internal -->
[azure-resource-group]: ../../azure-resource-manager/management/overview.md
[az-group-create]: /cli/azure/group#az-group-create
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-install-cli]: /cli/azure/aks#az-aks-install-cli
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[aoai-get-started]: ../cognitive-services/openai/quickstart.md
[managed-identity]: use-managed-identity.md