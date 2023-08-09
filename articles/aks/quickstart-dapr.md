---
title: Deploy an application with the Dapr cluster extension for Azure Kubernetes Service (AKS) or Arc-enabled Kubernetes
description: Use the Dapr cluster extension for Azure Kubernetes Service (AKS) or Arc-enabled Kubernetes to deploy an application.
author: nickomang
ms.author: nickoman
ms.topic: quickstart
ms.date: 06/22/2023
ms.custom: template-quickstart, mode-other, event-tier1-build-2022, ignite-2022, devx-track-js, devx-track-python, devx-track-linux
---

# Quickstart: Deploy an application using the Dapr cluster extension for Azure Kubernetes Service (AKS) or Arc-enabled Kubernetes

In this quickstart, you use the [Dapr cluster extension][dapr-overview] in an AKS or Arc-enabled Kubernetes cluster. You deploy a `hello world` example, which consists of a Python application that generates messages and a node application that consumes and persists the messages.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI][azure-cli-install] or [Azure PowerShell][azure-powershell-install] installed.
* An AKS or Arc-enabled Kubernetes cluster with the [Dapr cluster extension][dapr-overview] enabled.

## Clone the repository

1. Clone the [Dapr quickstarts repository][hello-world-gh] using the `git clone` command.

    ```bash
    git clone https://github.com/dapr/quickstarts.git
    ```

2. Change to the `hello-kubernetes` directory using `cd`.

    ```bash
    cd quickstarts/tutorials/hello-kubernetes/
    ```

## Create and configure a state store

Dapr can use many different state stores such as, Redis, Azure Cosmos DB, DynamoDB, and Cassandra to persist and retrieve state. For this example, we use Redis.

### Create a Redis store

1. Open the [Azure portal][azure-portal-cache] to start the Azure Cache for Redis creation flow.
2. Fill out the necessary information.
3. Select **Create** to start the Redis instance deployment.
4. Take note of the hostname of your Redis instance, which you can retrieve from the **Overview** section in Azure. The hostname might be similar to the following example: `xxxxxx.redis.cache.windows.net:6380`.
5. Under **Settings**, navigate to **Access keys** to get your access keys.
6. Create a Kubernetes secret to store your Redis password using the `kubectl create secret generic redis` command.

    ```bash
    kubectl create secret generic redis --from-literal=redis-password=<your-redis-password>
    ```

### Configure the Dapr components

Once your store is created, you need to add the keys to the `redis.yaml` file in the deploy directory of the *Hello World* repository. You can learn more [here][dapr-component-secrets].

1. Replace the `redisHost` value with your own Redis master address.
2. Replace the `redisPassword` with your own Secret.
3. Add the following two lines below `redisPassword` to enable connection over TLS

    ```YAML
   - name: redisPassword
        secretKeyRef:
          name: redis
          key: redis-password
   - name: enableTLS
      value: true
    ```

### Apply the configuration

1. Apply the `redis.yaml` file using the `kubectl apply` command.

    ```bash
    kubectl apply -f ./deploy/redis.yaml
    ```

2. Verify your state store was successfully configured using the `kubectl get components.redis` command.

    ```bash
    kubectl get components.redis -o yaml
    ```

    You should see output similar to the following example output:

    ```output
    component.dapr.io/statestore created
    ```

## Deploy the Node.js app with the Dapr sidecar

1. Apply the Node.js app deployment to your cluster using the `kubectl apply` command.

    ```bash
    kubectl apply -f ./deploy/node.yaml
    ```

    > [!NOTE]
    > Kubernetes deployments are asynchronous, which means you need to wait for the deployment to complete before moving on to the next steps. You can do so with the following command:
    >
    > ```bash
    > kubectl rollout status deploy/nodeapp
    > ```

    This deploys the Node.js app to Kubernetes. The Dapr control plane automatically injects the Dapr sidecar to the Pod. If you take a look at the `node.yaml` file, you see how Dapr is enabled for that deployment:

   * `dapr.io/enabled: true`: tells the Dapr control plane to inject a sidecar to this deployment.
   * `dapr.io/app-id: nodeapp`: assigns a unique ID or name to the Dapr application, so it can be sent messages to and communicated with by other Dapr apps.

2. Access your service using the `kubectl get svc` command.

    ```bash
    kubectl get svc nodeapp
    ```

3. Make note of the `EXTERNAL-IP` in the output.

### Verify the service

1. Call the service using `curl` with your `EXTERNAL-IP`.

    ```bash
    curl $EXTERNAL_IP/ports
    ```

    You should see output similar to the following example output:

    ```bash
    {"DAPR_HTTP_PORT":"3500","DAPR_GRPC_PORT":"50001"}
    ```

2. Submit an order to the application using `curl`.

    ```bash
    curl --request POST --data "@sample.json" --header Content-Type:application/json $EXTERNAL_IP/neworder
    ```

3. Confirm the order has persisted by requesting it using `curl`.

    ```bash
    curl $EXTERNAL_IP/order
    ```

    You should see output similar to the following example output:

    ```bash
    { "orderId": "42" }
    ```

    > [!TIP]
    > This is a good time to get familiar with the Dapr dashboard, a convenient interface to check status, information, and logs of applications running on Dapr. To access the dashboard at `http://localhost:8080/`, run the following command:
    >
    > ```bash
    > kubectl port-forward svc/dapr-dashboard -n dapr-system 8080:8080
    > ```

## Deploy the Python app with the Dapr sidecar

1. Navigate to the Python app directory in the `hello-kubernetes` quickstart and open `app.py`.

    This example is a basic Python app that posts JSON messages to `localhost:3500`, which is the default listening port for Dapr. You can invoke the Node.js application's `neworder` endpoint by posting to `v1.0/invoke/nodeapp/method/neworder`. The message contains some data with an `orderId` that increments once per second:

    ```python
    n = 0
    while True:
        n += 1
        message = {"data": {"orderId": n}}

        try:
            response = requests.post(dapr_url, json=message)
        except Exception as e:
            print(e)

        time.sleep(1)
    ```

2. Deploy the Python app to your Kubernetes cluster using the `kubectl apply` command.

    ```bash
    kubectl apply -f ./deploy/python.yaml
    ```

    > [!NOTE]
    > As with the previous command, you need to wait for the deployment to complete before moving on to the next steps. You can do so with the following command:
    >
    > ```bash
    > kubectl rollout status deploy/pythonapp
    > ```

## Observe messages and confirm persistence

Now that both the Node.js and Python applications are deployed, you watch messages come through.

1. Get the logs of the Node.js app using the `kubectl logs` command.

    ```bash
    kubectl logs --selector=app=node -c node --tail=-1
    ```

    If the deployments were successful, you should see logs like the following example logs:

    ```output
    Got a new order! Order ID: 1
    Successfully persisted state
    Got a new order! Order ID: 2
    Successfully persisted state
    Got a new order! Order ID: 3
    Successfully persisted state
    ```

2. Call the Node.js app's order endpoint to get the latest order using `curl`.

    ```bash
    curl $EXTERNAL_IP/order
    {"orderID":"42"}
    ```

    You should see the latest JSON in the response.

## Clean up resources

### [Azure CLI](#tab/azure-cli)

* Remove the resource group, cluster, namespace, and all related resources using the [`az group delete`][az-group-delete] command.

    ```azurecli-interactive
    az group delete --name MyResourceGroup
    ```

### [Azure PowerShell](#tab/azure-powershell)

* Remove the resource group, cluster, namespace, and all related resources using the [`Remove-AzResourceGroup`][remove-azresourcegroup] command.

    ```azurepowershell-interactive
    Remove-AzResourceGroup -Name MyResourceGroup
    ```

---

## Next steps

> [!div class="nextstepaction"]
> [Learn more about other cluster extensions][cluster-extensions].

<!-- LINKS -->
<!-- INTERNAL -->
[azure-cli-install]: /cli/azure/install-azure-cli
[azure-powershell-install]: /powershell/azure/install-az-ps
[cluster-extensions]: ./cluster-extensions.md
[dapr-overview]: ./dapr.md
[az-group-delete]: /cli/azure/group#az-group-delete
[remove-azresourcegroup]: /powershell/module/az.resources/remove-azresourcegroup

<!-- EXTERNAL -->
[hello-world-gh]: https://github.com/dapr/quickstarts/tree/master/tutorials/hello-kubernetes
[azure-portal-cache]: https://portal.azure.com/#create/Microsoft.Cache
[dapr-component-secrets]: https://docs.dapr.io/operations/components/component-secrets/
