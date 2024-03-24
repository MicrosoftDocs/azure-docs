---
title: Deploy an application that uses OpenAI on Azure Kubernetes Service (AKS) 
description: Learn how to deploy an application that uses OpenAI on Azure Kubernetes Service (AKS).
ms.topic: how-to
ms.date: 10/02/2023
ms.custom: template-how-to, devx-track-azurecli 
---

# Deploy an application that uses OpenAI on Azure Kubernetes Service (AKS)

In this article, you learn how to deploy an application that uses Azure OpenAI or OpenAI on AKS. With OpenAI, you can easily adapt different AI models, such as content generation, summarization, semantic search, and natural language to code generation, for your specific tasks. You start by deploying an AKS cluster in your Azure subscription. Then, you deploy your OpenAI service and the sample application.

The sample cloud native application is representative of real-world implementations. The multi-container application is comprised of applications written in multiple languages and frameworks, including:

- Golang with Gin
- Rust with Actix-Web
- JavaScript with Vue.js and Fastify
- Python with FastAPI

These applications provide front ends for customers and store admins, REST APIs for sending data to RabbitMQ message queue and MongoDB database, and console apps to simulate traffic.

> [!NOTE]
> We don't recommend running stateful containers, such as MongoDB and Rabbit MQ, without persistent storage for production. We use them here for simplicity, but we recommend using managed services, such as Azure CosmosDB or Azure Service Bus.

To access the GitHub codebase for the sample application, see [AKS Store Demo][aks-store-demo].

## Before you begin

- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- For this demo, you can either use Azure OpenAI service or OpenAI service.
  - If you plan on using Azure OpenAI service, you need to request access to enable it on your Azure subscription using the [Request access to Azure OpenAI Service form][aoai-access].
  - If you plan on using OpenAI, sign up on the [OpenAI website][open-ai-landing].

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Create a resource group

An [Azure resource group][azure-resource-group] is a logical group in which you deploy and manage Azure resources. When you create a resource group, you're prompted to specify a location. This location is the storage location of your resource group metadata and where your resources run in Azure if you don't specify another region during resource creation.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

- Create a resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    ```

    The following example output shows successful creation of the resource group:

    ```output
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

The following example creates a cluster named *myAKSCluster* in *myResourceGroup*.

- Create an AKS cluster using the [`az aks create`][az-aks-create] command.

    ```azurecli-interactive
    az aks create --resource-group myResourceGroup --name myAKSCluster --generate-ssh-keys
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

## Connect to the cluster

To manage a Kubernetes cluster, you use the Kubernetes command-line client, [kubectl][kubectl]. `kubectl` is already installed if you use Azure Cloud Shell.

1. Install `kubectl` locally using the [`az aks install-cli`][az-aks-install-cli] command.

    ```azurecli-interactive
    az aks install-cli
    ```

    > [!NOTE]
    > If your Linux-based system requires elevated permissions, you can use the `sudo az aks install-cli` command.

2. Configure `kubectl` to connect to your Kubernetes cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    This command executes the following operations:

    - Downloads credentials and configures the Kubernetes CLI to use them.
    - Uses `~/.kube/config`, the default location for the [Kubernetes configuration file][kubeconfig-file]. Specify a different location for your Kubernetes configuration file using *--file* argument.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

3. Verify the connection to your cluster using the [`kubectl get`][kubectl-get] command. This command returns a list of the cluster nodes.

    ```azurecli-interactive
    kubectl get nodes
    ```

    The following example output shows the nodes created in the previous steps. Make sure the node status is *Ready*.

    ```output
    NAME                                STATUS   ROLES   AGE     VERSION
    aks-nodepool1-31469198-vmss000000   Ready    agent   3h29m   v1.25.6
    aks-nodepool1-31469198-vmss000001   Ready    agent   3h29m   v1.25.6
    aks-nodepool1-31469198-vmss000002   Ready    agent   3h29m   v1.25.6
    ```

> [!NOTE]
> For private clusters, the nodes might be unreachable if you try to connect to them through the public IP address. In order to fix this, you need to create an endpoint within the same VNET as the cluster to connect from. Follow the instructions to [Create a private AKS cluster][create-private-cluster] and then connect to it.

## Deploy the application

:::image type="content" source="media/ai-walkthrough/aks-ai-demo-architecture.png" alt-text="Architecture diagram of AKS AI demo." lightbox="media/ai-walkthrough/aks-ai-demo-architecture.png":::

The [AKS Store application][aks-store-demo] manifest includes the following Kubernetes deployments and services:

- **Product service**: Shows product information.
- **Order service**: Places orders.
- **Makeline service**: Processes orders from the queue and completes the orders.
- **Store front**: Web application for customers to view products and place orders.
- **Store admin**: Web application for store employees to view orders in the queue and manage product information.
- **Virtual customer**: Simulates order creation on a scheduled basis.
- **Virtual worker**: Simulates order completion on a scheduled basis.
- **Mongo DB**: NoSQL instance for persisted data.
- **Rabbit MQ**: Message queue for an order queue.

> [!NOTE]
> We don't recommend running stateful containers, such as MongoDB and Rabbit MQ, without persistent storage for production. We use them here for simplicity, but we recommend using managed services, such as Azure CosmosDB or Azure Service Bus.

1. Review the [YAML manifest](https://github.com/Azure-Samples/aks-store-demo/blob/main/aks-store-all-in-one.yaml) for the application.
2. Deploy the application using the [`kubectl apply`][kubectl-apply] command and specify the name of your YAML manifest.

    ```azurecli-interactive
    kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/aks-store-demo/main/aks-store-all-in-one.yaml
    ```

    The following example output shows the successfully created deployments and services:

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

### [Azure OpenAI](#tab/aoai)

1. Enable Azure OpenAI on your Azure subscription by filling out the [Request Access to Azure OpenAI Service][aoai-access] form.
1. In the Azure portal, create an Azure OpenAI instance.
1. Select the Azure OpenAI instance you created.
1. Select **Keys and Endpoints** to generate a key.
1. Select **Model Deployments** > **Managed Deployments** to open the [Azure OpenAI studio][aoai-studio].
1. Create a new deployment using the **gpt-35-turbo** model.

For more information on how to create a deployment in Azure OpenAI, see [Get started generating text using Azure OpenAI Service][aoai-get-started].

### [OpenAI](#tab/openai)

1. [Generate an OpenAI key][open-ai-new-key] by selecting **Create new secret key** and save the key. You need this key in the [next step](#deploy-the-ai-service).
2. [Start a paid plan][openai-paid] to use OpenAI API.

---

## Deploy the AI service

Now that the application is deployed, you can deploy the Python-based microservice that uses OpenAI to automatically generate descriptions for new products being added to the store's catalog.

### [Azure OpenAI](#tab/aoai)

1. Create a file named `ai-service.yaml` and copy in the following manifest:

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
          - name: ai-service
            image: ghcr.io/azure-samples/aks-store-demo/ai-service:latest
            ports:
            - containerPort: 5001
            env:
            - name: USE_AZURE_OPENAI 
              value: "True"
            - name: AZURE_OPENAI_DEPLOYMENT_NAME 
              value: ""
            - name: AZURE_OPENAI_ENDPOINT 
              value: ""
            - name: OPENAI_API_KEY 
              value: ""
            resources:
              requests:
                cpu: 20m
                memory: 50Mi
              limits:
                cpu: 30m
                memory: 85Mi
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

2. Set the environment variable `USE_AZURE_OPENAI` to `"True"`.
3. Get your Azure OpenAI deployment name from [Azure OpenAI studio][aoai-studio] and fill in the `AZURE_OPENAI_DEPLOYMENT_NAME` value.
4. Get your Azure OpenAI endpoint and Azure OpenAI API key from the Azure portal by selecting **Keys and Endpoint** in the left blade of the resource. Update the `AZURE_OPENAI_ENDPOINT` and `OPENAI_API_KEY` in the YAML accordingly.
5. Deploy the application using the [`kubectl apply`][kubectl-apply] command and specify the name of your YAML manifest.

    ```azurecli-interactive
    kubectl apply -f ai-service.yaml
    ```

    The following example output shows the successfully created deployments and services:

    ```output
      deployment.apps/ai-service created
      service/ai-service created
    ```

### [OpenAI](#tab/openai)

1. Create a file named `ai-service.yaml` and copy in the following manifest:

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
            - name: USE_AZURE_OPENAI
              value: "False"
            - name: OPENAI_API_KEY 
              value: ""
            - name: OPENAI_ORG_ID 
              value: ""
            resources:
              requests:
                cpu: 20m
                memory: 46Mi
              limits:
                cpu: 30m
                memory: 65Mi
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

2. Set the environment variable `USE_AZURE_OPENAI` to `"False"`.
3. Set the environment variable `OPENAI_API_KEY` by pasting in the OpenAI key you generated in the [last step](#deploy-openai).
4. [Find your OpenAI organization ID][open-ai-org-id], copy the value, and set the `OPENAI_ORG_ID` environment variable.
5. Deploy the application using the [`kubectl apply`][kubectl-apply] command and specify the name of your YAML manifest.

    ```azurecli-interactive
    kubectl apply -f ai-service.yaml
    ```

    The following example output shows the successfully created deployments and services:

    ```output
      deployment.apps/ai-service created
      service/ai-service created
    ```

---

> [!NOTE]
> Directly adding sensitive information, such as API keys, to your Kubernetes manifest files isn't secure and may accidentally get committed to code repositories. We added it here for simplicity. For production workloads, use [Managed Identity][managed-identity] to authenticate to Azure OpenAI service instead or store your secrets in [Azure Key Vault][key-vault].

## Test the application

1. Check the status of the deployed pods using the [kubectl get pods][kubectl-get] command.

    ```azurecli-interactive
    kubectl get pods
    ```

    Make sure all the pods are *Running* before continuing to the next step.

    ```output
    NAME                                READY   STATUS    RESTARTS   AGE
    makeline-service-7db94dc7d4-8g28l   1/1     Running   0          99s
    mongodb-78f6d95f8-nptbz             1/1     Running   0          99s
    order-service-55cbd784bb-6bmfb      1/1     Running   0          99s
    product-service-6bf4d65f74-7cbvk    1/1     Running   0          99s
    rabbitmq-9855984f9-94nlm            1/1     Running   0          99s
    store-admin-7f7d768c48-9hn8l        1/1     Running   0          99s
    store-front-6786c64d97-xq5s9        1/1     Running   0          99s
    virtual-customer-79498f8667-xzsb7   1/1     Running   0          99s
    virtual-worker-6d77fff4b5-7g7rj     1/1     Running   0          99s
    ```

2. Get the IP of the store admin web application and store front web application using the `kubectl get service` command.

    ```azurecli-interactive
    kubectl get service store-admin
    ```

    The application exposes the Store Admin site to the internet via a public load balancer provisioned by the Kubernetes service. This process can take a few minutes to complete. **EXTERNAL IP** initially shows *pending* until the service comes up and shows the IP address.

    ```output
    NAME          TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)        AGE
    store-admin   LoadBalancer   10.0.142.228   40.64.86.161    80:32494/TCP   50m    
    ```

    Repeat the same step for the service named `store-front``.

3. Open a web browser and browse to the external IP address of your service. In the example shown here, open *40.64.86.161* to see Store Admin in the browser. Repeat the same step for Store Front.
4. In store admin, select the products tab, then select **Add Products**.
5. When the `ai-service`` is running successfully, you should see the Ask OpenAI button next to the description field. Fill in the name, price, and keywords, then generate a product description by selecting **Ask OpenAI** > **Save product**.

    :::image type="content" source="media/ai-walkthrough/ai-generate-description.png" alt-text="Screenshot of how to use openAI to generate a product description.":::

6. You can now see the new product you created on Store Admin used by sellers. In the picture, you can see Jungle Monkey Chew Toy is added.

    :::image type="content" source="media/ai-walkthrough/new-product-store-admin.png" alt-text="Screenshot viewing the new product in the store admin page.":::

7. You can also see the new product you created on Store Front used by buyers. In the picture, you can see Jungle Monkey Chew Toy is added. Remember to get the IP address of store front using the [`kubectl get service`][kubectl-get] command.

    :::image type="content" source="media/ai-walkthrough/new-product-store-front.png" alt-text="Screenshot viewing the new product in the store front page.":::

## Next steps

Now that you added OpenAI functionality to an AKS application, you can [Secure access to Azure OpenAI from Azure Kubernetes Service (AKS)](./open-ai-secure-access-quickstart.md).

To learn more about generative AI use cases, see the following resources:

- [Azure OpenAI Service Documentation][aoai]
- [Introduction to Azure OpenAI Services][learn-aoai]
- [OpenAI Platform][openai-platform]
- [Project Miyagi - Envisioning sample for Copilot stack][miyagi]

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
[openai-paid]: https://platform.openai.com/account/billing/overview
[openai-platform]: https://platform.openai.com/
[miyagi]: https://github.com/Azure-Samples/miyagi

<!-- Links internal -->
[azure-resource-group]: ../azure-resource-manager/management/overview.md 
[az-group-create]: /cli/azure/group#az-group-create
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-install-cli]: /cli/azure/aks#az-aks-install-cli
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[aoai-get-started]: ../ai-services/openai/quickstart.md
[managed-identity]: /azure/ai-services/openai/how-to/managed-identity#authorize-access-to-managed-identities
[key-vault]: csi-secrets-store-driver.md
[aoai]: ../ai-services/openai/index.yml
[learn-aoai]: /training/modules/explore-azure-openai
[create-private-cluster]: private-clusters.md
