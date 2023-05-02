---
title: Deploy an application with the Dapr cluster extension for Azure Kubernetes Service (AKS) or Arc-enabled Kubernetes
description: Use the Dapr cluster extension for Azure Kubernetes Service (AKS) or Arc-enabled Kubernetes to deploy an application
author: nickomang
ms.author: nickoman
ms.topic: quickstart
ms.date: 05/03/2022
ms.custom: template-quickstart, mode-other, event-tier1-build-2022, ignite-2022
---

# Quickstart: Deploy an application using the Dapr cluster extension for Azure Kubernetes Service (AKS) or Arc-enabled Kubernetes

In this quickstart, you will get familiar with using the [Dapr cluster extension][dapr-overview] in an AKS or Arc-enabled Kubernetes cluster. You will be deploying a hello world example, consisting of a Python application that generates messages and a Node application that consumes and persists them.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI][azure-cli-install] or [Azure PowerShell][azure-powershell-install] installed.
* An AKS or Arc-enabled Kubernetes cluster with the [Dapr cluster extension][dapr-overview] enabled

## Clone the repository

To obtain the files you'll be using to deploy the sample application, clone the [Quickstarts repository][hello-world-gh] and change to the `hello-kubernetes` directory:

```bash
git clone https://github.com/dapr/quickstarts.git
cd quickstarts/hello-kubernetes
```

## Create and configure a state store

Dapr can use a number of different state stores (Redis, Azure Cosmos DB, DynamoDB, Cassandra, etc.) to persist and retrieve state. For this example, we will use Redis.

### Create a Redis store

1. Open the [Azure portal][azure-portal-cache] to start the Azure Redis Cache creation flow.
2. Fill out the necessary information
3. Click “Create” to kickoff deployment of your Redis instance.
4. Take note of the hostname of your Redis instance, which you can retrieve from the “Overview” in Azure. It should look like `xxxxxx.redis.cache.windows.net:6380`.
5. Once your instance is created, you’ll need to grab your access key. Navigate to “Access Keys” under “Settings” and create a Kubernetes secret to store your Redis password:

```bash
kubectl create secret generic redis --from-literal=redis-password=<your-redis-password>
```

### Configure the Dapr components

Once your store is created, you will need to add the keys to the redis.yaml file in the deploy directory of the Hello World repository. Replace the `redisHost` value with your own Redis master address, and the `redisPassword` with your own Secret. You can learn more [here][dapr-component-secrets].

You will also need to add the following two lines below `redisPassword` to enable connection over TLS:

```yml
- name: redisPassword
    secretKeyRef:
      name: redis
      key: redis-password
- name: enableTLS
  value: true
```

### Apply the configuration

Apply the `redis.yaml` file:

```bash
kubectl apply -f ./deploy/redis.yaml
``` 

And verify that your state store was successfully configured in the output:

```output
component.dapr.io/statestore created
```

## Deploy the Node.js app with the Dapr sidecar

Apply the Node.js app's deployment to your cluster:

```bash
kubectl apply -f ./deploy/node.yaml
```

> [!NOTE]
> Kubernetes deployments are asynchronous. This means you'll need to wait for the deployment to complete before moving on to the next steps. You can do so with the following command:
> ```bash
> kubectl rollout status deploy/nodeapp
> ```

This will deploy the Node.js app to Kubernetes. The Dapr control plane will automatically inject the Dapr sidecar to the Pod. If you take a look at the `node.yaml` file, you will see how Dapr is enabled for that deployment:

* `dapr.io/enabled: true` - this tells the Dapr control plane to inject a sidecar to this deployment.

* `dapr.io/app-id: nodeapp` - this assigns a unique ID or name to the Dapr application, so it can be sent messages to and communicated with by other Dapr apps.

To access your service, obtain and make note of the `EXTERNAL-IP` via `kubectl`:

```bash
kubectl get svc nodeapp
```

### Verify the service

To call the service, run:

```bash
curl $EXTERNAL_IP/ports
```

You should see output similar to the following:

```bash
{"DAPR_HTTP_PORT":"3500","DAPR_GRPC_PORT":"50001"}
```

Next, submit an order to the application:

```bash
curl --request POST --data "@sample.json" --header Content-Type:application/json $EXTERNAL_IP/neworder
```

Confirm the order has been persisted by requesting it:

```bash
curl $EXTERNAL_IP/order
```

You should see output similar to the following:

```bash
{ "orderId": "42" }
```

> [!TIP]
> This is a good time to get acquainted with the Dapr dashboard- a convenient interface to check status, information and logs of applications running on Dapr. The following command will make it available on `http://localhost:8080/`:
> ```bash
> kubectl port-forward svc/dapr-dashboard -n dapr-system 8080:8080
> ```

## Deploy the Python app with the Dapr sidecar

Take a quick look at the Python app. Navigate to the Python app directory in the `hello-kubernetes` quickstart and open `app.py`.

This is a basic Python app that posts JSON messages to `localhost:3500`, which is the default listening port for Dapr. You can invoke the Node.js application's `neworder` endpoint by posting to `v1.0/invoke/nodeapp/method/neworder`. The message contains some data with an `orderId` that increments once per second:

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

Deploy the Python app to your Kubernetes cluster:

```bash
kubectl apply -f ./deploy/python.yaml
```

> [!NOTE]
> As with above, the following command will wait for the deployment to complete:
> ```bash
> kubectl rollout status deploy/pythonapp
> ```

## Observe messages and confirm persistence

Now that both the Node.js and Python applications are deployed, watch messages come through.

Get the logs of the Node.js app:

```bash
kubectl logs --selector=app=node -c node --tail=-1
```

If the deployments were successful, you should see logs like this:

```ouput
Got a new order! Order ID: 1
Successfully persisted state
Got a new order! Order ID: 2
Successfully persisted state
Got a new order! Order ID: 3
Successfully persisted state
```

Call the Node.js app's order endpoint to get the latest order. Grab the external IP address that you saved before and, append "/order" and perform a GET request against it (enter it into your browser, use Postman, or `curl` it!):

```bash
curl $EXTERNAL_IP/order
{"orderID":"42"}
```

You should see the latest JSON in the response.

## Clean up resources

### [Azure CLI](#tab/azure-cli)

Use the [az group delete][az-group-delete] command to remove the resource group, the cluster, the namespace, and all related resources.

```azurecli-interactive
az group delete --name MyResourceGroup
```

### [Azure PowerShell](#tab/azure-powershell)

Use the [Remove-AzResourceGroup][remove-azresourcegroup] command to remove the resource group, the cluster, the namespace, and all related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name MyResourceGroup
```

---

## Next steps

After successfully deploying this sample application:
> [!div class="nextstepaction"]
> [Learn more about other cluster extensions][cluster-extensions]

<!-- LINKS -->
<!-- INTERNAL -->
[azure-cli-install]: /cli/azure/install-azure-cli
[azure-powershell-install]: /powershell/azure/install-az-ps
[cluster-extensions]: ./cluster-extensions.md
[dapr-overview]: ./dapr.md
[az-group-delete]: /cli/azure/group#az-group-delete
[remove-azresourcegroup]: /powershell/module/az.resources/remove-azresourcegroup

<!-- EXTERNAL -->
[hello-world-gh]: https://github.com/dapr/quickstarts/tree/v1.4.0/hello-kubernetes
[azure-portal-cache]: https://portal.azure.com/#create/Microsoft.Cache
[dapr-component-secrets]: https://docs.dapr.io/operations/components/component-secrets/
