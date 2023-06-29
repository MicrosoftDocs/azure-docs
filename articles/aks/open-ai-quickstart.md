---
title: Deploy an application that uses OpenAI on Azure Kubernetes Service (AKS) 
description: Learn how to deploy an application that uses OpenAI on Azure Kubernetes Service (AKS). #Required; article description that is displayed in search results. 
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 6/29/2023
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Deploy an Application that uses OpenAI on Azure Kubernetes Service (AKS) 

In this article, you learn how to deploy an application that uses Azure OpenAI or OpenAI on AKS. With OpenAI, you can easily adapt different AI models, such as content generation, summarization, semantic search, and natural language to code generation, to your specific tasks. 

This article also walks you through how to run a sample multi-container solution representative of real-world implementations. The multi-container solution is comprised of applications written in multiple languages and frameworks, including: 
- Golang with Gin
- Rust with Actix-Web
- JavaScript with Vue.js and Fastify
- Python with FastAPI
These applications provide front ends for customers and store admins, REST APIs for sending data to RabbitMQ message queue and MongoDB database, and console apps to simulate traffic.

- The codebase for [AKS Store Demo][aks-store-demo] can be found on GitHub

## Before you begin

- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- For this demo, you can either use Azure OpenAI service or OpenAI service. If you plan on using Azure OpenAI service, you need to enable it for your Azure subscription by filling out the [Request Access to Azure OpenAI Service][aoai-access] form.
- If you plan on using OpenAI, sign up on the [OpenAI website][open-ai-landing].
- If you already have Azure CLI installed, update to the latest version by using the [az upgrade][az-upgrade] command.
- todo: any flag needs to be enabled in the CLI? <!--todo-->

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)] 

## Create a resource group
An [Azure resource group][azure-resource-group] is a logical group in which Azure resources are deployed and managed. When you create a resource group, you're prompted to specify a location. This location is the storage location of your resource group metadata and where your resources run in Azure if you don't specify another region during resource creation.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

* Create a resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    ```
    
    The following output example resembles the successful creation of the resource group:

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

## Create an AKS cluster
The following example creates a cluster named *myAKSCluster* in the resource group *myResourceGroup* created earlier.

* Create an AKS cluster using the [`az aks create`][az-aks-create] command.

    ```azurecli-interactive
    az aks create --resource-group myResourceGroup --name myAKSCluster
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

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
    NAME                                STATUS   ROLES   AGE     VERSION
    aks-nodepool1-31469198-vmss000000   Ready    agent   3h29m   v1.25.6
    aks-nodepool1-31469198-vmss000001   Ready    agent   3h29m   v1.25.6
    aks-nodepool1-31469198-vmss000002   Ready    agent   3h29m   v1.25.6
    ```

## Deploy the application 

:::image type="content" source="media/ai-walkthrough/aks-ai-demo-architecture.png" alt-text="Architecture diagram of AKS AI demo":::

For the [AKS Store application][aks-store-demo], this manifest includes the following Kubernetes deployments and services:
- Product Service: Shows product information
- Order Service: Places orders
- Makeline Service: Processes orders from the queue and completes the orders
- Store Front: Web application for customers to view products and place orders
- Store Admin: Web application for store employees to view orders in the queue and manage product information
- Virtual Customer: Simulates order creation on a scheduled basis
- Virtual Worker: Simulates order completion on a scheduled basis
- Mongo DB: MongoDB instance for persisted data
- Rabbit MQ: RabbitMQ for an order queue

1. Create a file named `azure-store.yaml` and copy the following manifest.
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

1. Deploy the application using the [`kubectl apply`][kubectl-apply] command and specify the name of your yaml manifest.
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

## Deploy OpenAI
You can either use Azure OpenAI or OpenAI and run your application on AKS.

### Azure OpenAI
1. Enable Azure OpenAI on your Azure subscription by filling out the [Request Access to Azure OpenAI Service][aoai-access] form.
1. In the Azure Portal, create an Azure OpenAI instance. 
1. Select the Azure OpenAI instance you created.
1. Select **Keys and Endpoints** to generate a key.
1. Select **Model Deployments** > **Managed Deployments** to open the [Azure OpenAI studio][aoai-studio].
1. Create a new deployment using the **text-davinci-003** model. 
For more information on how to create a deployment in Azure OpenAI, check out [Get started generating text using Azure OpenAI Service][aoai-get-started].

### OpenAI
1. [Generate an OpenAI key][open-ai-new-key] by selecting **Create new secret key** and save the key. You will need this key in the [next step](#deploy-the-ai-service). 
1. [Start a paid plan][openai-paid] to use OpenAI API.

## Deploy the AI service

Now that the application is deployed, you can deploy the Python based microservice that uses OpenAI to automatically generate descriptions for new products being added to the store's catalog. 

1. Create a file named `ai-service.yaml` and copy the following manifest into it.
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
            - name: USE_AZURE_OPENAI # set to "True" in quote if you are using Azure OpenAI, set to "False" if you are using public OpenAI
              value: ""
            - name: AZURE_OPENAI_DEPLOYMENT_NAME # required if using Azure OpenAI
              value: ""
            - name: AZURE_OPENAI_ENDPOINT # required if using Azure OpenAI
              value: ""
            - name: OPENAI_API_KEY # always required
              value: ""
            - name: OPENAI_ORG_ID # required if using public OpenAI
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
1. If you're using Azure OpenAI: 
    * Set the environment variable *USE_AZURE_OPENAI* to "True"
    * Get your Azure OpenAI Deployment name from [Azure OpenAI studio][aoai-studio], and fill in the *AZURE_OPENAI_DEPLOYMENT_NAME* value. 
    * Get your Azure OpenAI endpoint and Azure OpenAI API key from the Azure portal by clicking on `Keys and Endpoint` in the left blade of the resource. Fill in your *AZURE_OPENAI_ENDPOINT* and *OPENAI_API_KEY* in the yaml accordingly. 
1. If you're using OpenAI: 
    * Set the environment variable *USE_AZURE_OPENAI* to "False"
    * Set the environment variable *OPENAI_API_KEY* by pasting in the OpenAI key you generated in the [last step](#deploy-azure-openai-or-openai).
    * [Find the organization ID][open-ai-org-id] and copy the value into the YAML. 
1. Deploy the application using the [`kubectl apply`][kubectl-apply] command and specify the name of your yaml manifest.
    ```bash
    kubectl apply -f ai-service.yaml
    ```
   The following example resembles output showing successfully created deployments and services.
    ```output
      deployment.apps/ai-service created
      service/ai-service created
    ```

> [!NOTE]
> Adding sensitive information like API keys directly to Kubernetes manifest files like this is not secure and can accidentally get committed to code repositories. We have done it that way here for simplicity. For production workloads, use [Managed Identity][managed-identity] to authenticate to Azure OpenAI service instead or store your secrets in [Azure Key Vault][key-vault].

## Test the application
1. See the status of the deployed Kubernetes objects using the [kubectl get all][kubectl-get] command. To get the IP of the store admin web application and store front web application, use the kubectl get service command.
    
    ```bash
    kubectl get service store-admin
    ```
    When the application runs, a Kubernetes service exposes the application's front end to the internet. This process can take a few minutes to complete. **EXTERNAL IP** initially shows *pending*, until the service comes up and shows the IP address. 
    ```output
    NAME          TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)        AGE
    store-admin   LoadBalancer   10.0.142.228   40.64.86.161    80:32494/TCP   50m    
    ```
    Repeat the same step for the service named store-front. 
    
1. Open a web browser to the external IP address of your service. In the example shown here, open 40.64.86.161 to see store admin in the browser. Repeat the same step for store front. 
1. In store admin, click on the products tab, then select **Add Products**. 
1. When the ai-service is running successfully, you should see the Ask OpenAI button next to the description field. Fill in the name, price, and keywords, then click Ask OpenAI to generate a product description. Then click save product. See the picture for an example of adding a new product. 
:::image type="content" source="media/ai-walkthrough/ai-generate-description.png" alt-text="use openAI to generate a product description":::
1. You can now see the new product you created on the store admin web app for sellers. In the picture, you can see Jungle Monkey Chew Toy is added.
:::image type="content" source="media/ai-walkthrough/new-product-store-admin.png" alt-text="view the new product in the store admin page":::
1. You can also see the new product you created on the store front web app for buyers. In the picture, you can see Jungle Monkey Chew Toy is added. Remember to get the IP address of store front by using [kubectl get service][kubectl-get].
:::image type="content" source="media/ai-walkthrough/new-product-store-front.png" alt-text="view the new product in the store front page":::

<!-- todo -->
## Next steps
- todo

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
[aoai-access]: https://aka.ms/oai/access
[az-upgrade]: https://learn.microsoft.com/cli/azure/update-azure-cli#manual-update
[openai-paid]: https://platform.openai.com/account/billing/overview

<!-- Links internal -->
[azure-resource-group]: ../azure-resource-manager/management/overview.md 
[az-group-create]: /cli/azure/group#az-group-create
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-install-cli]: /cli/azure/aks#az-aks-install-cli
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[aoai-get-started]: ../cognitive-services/openai/quickstart.md
[managed-identity]: /azure/cognitive-services/openai/how-to/managed-identity#authorize-access-to-managed-identities
[key-vault]: csi-secrets-store-driver.md
