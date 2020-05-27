---
title: 'Quickstart: Deploy an Azure Kubernetes Service cluster'
description: Learn how to quickly create a Kubernetes cluster, deploy an application, and monitor performance in Azure Kubernetes Service (AKS) using the Azure CLI.
services: container-service
ms.topic: quickstart
ms.date: 04/28/2020

ms.custom: [H1Hack27Feb2017, mvc, devcenter, seo-javascript-september2019, seo-javascript-october2019, seo-python-october2019]

#Customer intent: As a developer or cluster operator, I want to quickly create an AKS cluster and deploy an application so that I can see how to run and monitor applications using the managed Kubernetes service in Azure.
---

# Quickstart: Deploy an Azure Kubernetes Service cluster using the Azure CLI

In this quickstart, you deploy an Azure Kubernetes Service (AKS) cluster using the Azure CLI. AKS is a managed Kubernetes service that lets you quickly deploy and manage clusters. A multi-container application that includes a web front end and a Redis instance is run in the cluster. You then see how to monitor the health of the cluster and pods that run your application.

To learn more about creating a Windows Server node pool, see [Create an AKS cluster that supports Windows Server containers][windows-container-cli].

![Voting app deployed in Azure Kubernetes Service](./media/container-service-kubernetes-walkthrough/voting-app-deployed-in-azure-kubernetes-service.png)

This quickstart assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.64 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

> [!NOTE]
> If running the commands in this quickstart locally (instead of Azure Cloud Shell), ensure you run the commands as administrator.

## Create a resource group

An Azure resource group is a logical group in which Azure resources are deployed and managed. When you create a resource group, you are asked to specify a location. This location is where resource group metadata is stored, it is also where your resources run in Azure if you don't specify another region during resource creation. Create a resource group using the [az group create][az-group-create] command.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

The following example output shows the resource group created successfully:

```json
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

## Create AKS cluster

Use the [az aks create][az-aks-create] command to create an AKS cluster. The following example creates a cluster named *myAKSCluster* with one node. Azure Monitor for containers is also enabled using the *--enable-addons monitoring* parameter.  This will take several minutes to complete.

> [!NOTE]
> When creating an AKS cluster a second resource group is automatically created to store the AKS resources. For more information see [Why are two resource groups created with AKS?](https://docs.microsoft.com/azure/aks/faq#why-are-two-resource-groups-created-with-aks)

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster --node-count 1 --enable-addons monitoring --generate-ssh-keys
```

After a few minutes, the command completes and returns JSON-formatted information about the cluster.

## Connect to the cluster

To manage a Kubernetes cluster, you use [kubectl][kubectl], the Kubernetes command-line client. If you use Azure Cloud Shell, `kubectl` is already installed. To install `kubectl` locally, use the [az aks install-cli][az-aks-install-cli] command:

```azurecli
az aks install-cli
```

To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials][az-aks-get-credentials] command. This command downloads credentials and configures the Kubernetes CLI to use them.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

To verify the connection to your cluster, use the [kubectl get][kubectl-get] command to return a list of the cluster nodes.

```azurecli-interactive
kubectl get nodes
```

The following example output shows the single node created in the previous steps. Make sure that the status of the node is *Ready*:

```output
NAME                       STATUS   ROLES   AGE     VERSION
aks-nodepool1-31718369-0   Ready    agent   6m44s   v1.12.8
```

## Run the application

A Kubernetes manifest file defines a desired state for the cluster, such as what container images to run. In this quickstart, a manifest is used to create all objects needed to run the Azure Vote application. This manifest includes two [Kubernetes deployments][kubernetes-deployment] - one for the sample Azure Vote Python applications, and the other for a Redis instance. Two [Kubernetes Services][kubernetes-service] are also created - an internal service for the Redis instance, and an external service to access the Azure Vote application from the internet.

> [!TIP]
> In this quickstart, you manually create and deploy your application manifests to the AKS cluster. In more real-world scenarios, you can use [Azure Dev Spaces][azure-dev-spaces] to rapidly iterate and debug your code directly in the AKS cluster. You can use Dev Spaces across OS platforms and development environments, and work together with others on your team.

Create a file named `azure-vote.yaml` and copy in the following YAML definition. If you use the Azure Cloud Shell, this file can be created using `vi` or `nano` as if working on a virtual or physical system:

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
        "beta.kubernetes.io/os": linux
      containers:
      - name: azure-vote-back
        image: redis
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
        "beta.kubernetes.io/os": linux
      containers:
      - name: azure-vote-front
        image: microsoft/azure-vote-front:v1
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

Deploy the application using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest:

```console
kubectl apply -f azure-vote.yaml
```

The following example output shows the Deployments and Services created successfully:

```output
deployment "azure-vote-back" created
service "azure-vote-back" created
deployment "azure-vote-front" created
service "azure-vote-front" created
```

## Test the application

When the application runs, a Kubernetes service exposes the application front end to the internet. This process can take a few minutes to complete.

To monitor progress, use the [kubectl get service][kubectl-get] command with the `--watch` argument.

```azurecli-interactive
kubectl get service azure-vote-front --watch
```

Initially the *EXTERNAL-IP* for the *azure-vote-front* service is shown as *pending*.

```output
NAME               TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
azure-vote-front   LoadBalancer   10.0.37.27   <pending>     80:30572/TCP   6s
```

When the *EXTERNAL-IP* address changes from *pending* to an actual public IP address, use `CTRL-C` to stop the `kubectl` watch process. The following example output shows a valid public IP address assigned to the service:

```output
azure-vote-front   LoadBalancer   10.0.37.27   52.179.23.131   80:30572/TCP   2m
```

To see the Azure Vote app in action, open a web browser to the external IP address of your service.

![Voting app deployed in Azure Kubernetes Service](./media/container-service-kubernetes-walkthrough/voting-app-deployed-in-azure-kubernetes-service.png)

When the AKS cluster was created, [Azure Monitor for containers](../azure-monitor/insights/container-insights-overview.md) was enabled to capture health metrics for both the cluster nodes and pods. These health metrics are available in the Azure portal.

## Delete the cluster

To avoid Azure charges, you should clean up unneeded resources.  When the cluster is no longer needed, use the [az group delete][az-group-delete] command to remove the resource group, container service, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

> [!NOTE]
> When you delete the cluster, the Azure Active Directory service principal used by the AKS cluster is not removed. For steps on how to remove the service principal, see [AKS service principal considerations and deletion][sp-delete]. If you used a managed identity, the identity is managed by the platform and does not require removal.

## Get the code

In this quickstart, pre-created container images were used to create a Kubernetes deployment. The related application code, Dockerfile, and Kubernetes manifest file are available on GitHub.

[https://github.com/Azure-Samples/azure-voting-app-redis][azure-vote-app]

## Next steps

In this quickstart, you deployed a Kubernetes cluster and deployed a multi-container application to it. You can also [access the Kubernetes web dashboard][kubernetes-dashboard] for your AKS cluster.

To learn more about AKS, and walk through a complete code to deployment example, continue to the Kubernetes cluster tutorial.

> [!div class="nextstepaction"]
> [AKS tutorial][aks-tutorial]

<!-- LINKS - external -->
[azure-vote-app]: https://github.com/Azure-Samples/azure-voting-app-redis.git
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[azure-dev-spaces]: https://docs.microsoft.com/azure/dev-spaces/

<!-- LINKS - internal -->
[kubernetes-concepts]: concepts-clusters-workloads.md
[aks-monitor]: https://aka.ms/coingfonboarding
[aks-tutorial]: ./tutorial-kubernetes-prepare-app.md
[az-aks-browse]: /cli/azure/aks?view=azure-cli-latest#az-aks-browse
[az-aks-create]: /cli/azure/aks?view=azure-cli-latest#az-aks-create
[az-aks-get-credentials]: /cli/azure/aks?view=azure-cli-latest#az-aks-get-credentials
[az-aks-install-cli]: /cli/azure/aks?view=azure-cli-latest#az-aks-install-cli
[az-group-create]: /cli/azure/group#az-group-create
[az-group-delete]: /cli/azure/group#az-group-delete
[azure-cli-install]: /cli/azure/install-azure-cli
[sp-delete]: kubernetes-service-principal.md#additional-considerations
[azure-portal]: https://portal.azure.com
[kubernetes-deployment]: concepts-clusters-workloads.md#deployments-and-yaml-manifests
[kubernetes-service]: concepts-network.md#services
[kubernetes-dashboard]: kubernetes-dashboard.md
[windows-container-cli]: windows-container-cli.md
