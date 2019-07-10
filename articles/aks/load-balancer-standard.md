---
title: Preview - Use a Standard SKU load balancer in Azure Kubernetes Service (AKS)
description: Learn how to use a load balancer with a Standard SKU to expose your services with Azure Kubernetes Service (AKS).
services: container-service
author: zr-msft

ms.service: container-service
ms.topic: article
ms.date: 06/25/2019
ms.author: zarhoads

#Customer intent: As a cluster operator or developer, I want to learn how to create a service in AKS that uses an Azure Load Balancer with a Standard SKU.
---

# Preview - Use a Standard SKU load balancer in Azure Kubernetes Service (AKS)

To provide access to your applications in Azure Kubernetes Service (AKS), you can create and use an Azure Load Balancer. A load balancer running on AKS can be used as an internal or an external load balancer. An internal load balancer makes a Kubernetes service accessible only to applications running in the same virtual network as the AKS cluster. An external load balancer receives one or more public IPs for ingress and makes a Kubernetes service accessible externally using the public IPs.

Azure Load Balancer is available in two SKUs - *Basic* and *Standard*. By default, the *Basic* SKU is used when a service manifest is used to create a load balancer on AKS. Using a *Standard* SKU load balancer provides additional features and functionality, such as larger backend pool size and Availability Zones. It's important that you understand the differences between *Standard* and *Basic* load balancers before choosing which to use. Once you create an AKS cluster, you cannot change the load balancer SKU for that cluster. For more information on the *Basic* and *Standard* SKUs, see [Azure load balancer SKU comparison][azure-lb-comparison].

This article shows you how to create and use an Azure Load Balancer with the *Standard* SKU with Azure Kubernetes Service (AKS).

This article assumes a basic understanding of Kubernetes and Azure Load Balancer concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts] and [What is Azure Load Balancer?][azure-lb].

This feature is currently in preview.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.59 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Before you begin

The AKS cluster service principal needs permission to manage network resources if you use an existing subnet or resource group. In general, assign the *Network contributor* role to your service principal on the delegated resources. For more information on permissions, see [Delegate AKS access to other Azure resources][aks-sp].

You must create an AKS cluster that sets the SKU for the load balancer to *Standard* instead of the default *Basic*. Creating an AKS cluster is covered in a later step, but you first need to enable a few preview features.

> [!IMPORTANT]
> AKS preview features are self-service, opt-in. They are provided to gather feedback and bugs from our community. In preview, these features aren't meant for production use. Features in public preview fall under 'best effort' support. Assistance from the AKS technical support teams is available during business hours Pacific timezone (PST) only. For additional information, please see the following support articles:
>
> * [AKS Support Policies][aks-support-policies]
> * [Azure Support FAQ][aks-faq]

### Install aks-preview CLI extension

To use the Azure load balancer standard SKU, you need the *aks-preview* CLI extension version 0.4.1 or higher. Install the *aks-preview* Azure CLI extension using the [az extension add][az-extension-add] command, then check for any available updates using the [az extension update][az-extension-update] command::

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

### Register AKSAzureStandardLoadBalancer preview feature

To create an AKS cluster that can use a load balancer with the *Standard* SKU, you must enable the *AKSAzureStandardLoadBalancer* feature flag on your subscription. The *AKSAzureStandardLoadBalancer* feature also uses *VMSSPreview* when creating a cluster using virtual machine scale sets. This feature provides the latest set of service enhancements when configuring a cluster. While it's not required, it's recommended you enable the *VMSSPreview* feature flag as well.

> [!CAUTION]
> When you register a feature on a subscription, you can't currently un-register that feature. After you enable some preview features, defaults may be used for all AKS clusters then created in the subscription. Don't enable preview features on production subscriptions. Use a separate subscription to test preview features and gather feedback.

Register the *VMSSPreview* and *AKSAzureStandardLoadBalancer* feature flags using the [az feature register][az-feature-register] command as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "VMSSPreview"
az feature register --namespace "Microsoft.ContainerService" --name "AKSAzureStandardLoadBalancer"
```

> [!NOTE]
> Any AKS cluster you create after you've successfully registered the *VMSSPreview* or *AKSAzureStandardLoadBalancer* feature flags use this preview cluster experience. To continue to create regular, fully-supported clusters, don't enable preview features on production subscriptions. Use a separate test or development Azure subscription for testing preview features.

It takes a few minutes for the status to show *Registered*. You can check on the registration status using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/VMSSPreview')].{Name:name,State:properties.state}"
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/AKSAzureStandardLoadBalancer')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

### Limitations

The following limitations apply when you create and manage AKS clusters that support a load balancer with the *Standard* SKU:

* When using the *Standard* SKU for a load balancer, you must allow public addresses and avoid creating any Azure Policy that bans IP creation. The AKS cluster automatically creates a *Standard* SKU public IP in same resource group created for the AKS cluster, which usually named with *MC_* at the beginning. AKS assigns the public IP to the *Standard* SKU load balancer. The public IP is required for allowing egress traffic from the AKS cluster. This public IP is also required to maintain connectivity between the control plane and agent nodes as well as to maintain compatibility with previous versions of AKS.
* When using the *Standard* SKU for a load balancer, you must use Kubernetes version 1.13.5 or greater.

While this feature is in preview, the following additional limitations apply:

* When using the *Standard* SKU for a load balancer in AKS, you cannot set your own public IP address for egress for the load balancer. You must use the IP address AKS assigns to your load balancer.

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
  "tags": null,
  "type": null
}
```

## Create AKS cluster
In order to run an AKS cluster that supports a load balancer with the *Standard* SKU, your cluster needs to set the *load-balancer-sku* parameter to *standard*. This parameter creates a load balancer with the *Standard* SKU when your cluster is created. When you run a *LoadBalancer* service on your cluster, the configuration of the *Standard* SK load balancer is updated with the service's configuration. Use the [az aks create][az-aks-create] command to create an AKS cluster named *myAKSCluster*.

> [!NOTE]
> The *load-balancer-sku* property can only be used when your cluster is created. You cannot change the load balancer SKU after an AKS cluster has been created. Also, you can only use one type of load balancer SKU in a single cluster.

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --enable-vmss \
    --node-count 1 \
    --kubernetes-version 1.14.0 \
    --load-balancer-sku standard \
    --generate-ssh-keys
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

```
NAME                       STATUS   ROLES   AGE     VERSION
aks-nodepool1-31718369-0   Ready    agent   6m44s   v1.14.0
```

## Verify your cluster uses the *Standard* SKU

Use the [az aks show][az-aks-show] to display the configuration of your cluster.

```console
$ az aks show --resource-group myResourceGroup --name myAKSCluster

{
  "aadProfile": null,
  "addonProfiles": null,
   ...
   "networkProfile": {
    "dnsServiceIp": "10.0.0.10",
    "dockerBridgeCidr": "172.17.0.1/16",
    "loadBalancerSku": "standard",
    ...
```

Verify the *loadBalancerSku* property shows as *standard*.

## Use the load balancer

To use the load balancer on your cluster, create a service manifest with the service type *LoadBalancer*. To show the load balancer working, create another manifest with a sample application to run on your cluster. This sample application is exposed through the load balancer and can be viewed through a browser.

Create a manifest named `sample.yaml` as shown in the following example:

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
```

The above manifest configures two deployments: *azure-vote-front* and *azure-vote-back*. To configure *azure-vote-front* deployment to be exposed using the load balancer, create a manifest named `standard-lb.yaml` as shown in the following example:

```yaml
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

The service *azure-vote-front* uses the *LoadBalancer* type to configure the load balancer on your AKS cluster to connect to the *azure-vote-front* deployment.

Deploy the sample application and load balancer using the [kubectl apply][kubectl-apply] and specify the name of your YAML manifests:

```console
kubectl apply -f sample.yaml
kubectl apply -f standard-lb.yaml
```

The *Standard* SKU load balancer is now configured to expose the sample application. View the service details of *azure-vote-front* using [kubectl get][kubectl-get] to see the public IP of the load balancer. The public IP address of the load balancer is shown in the *EXTERNAL-IP* column. It may take a minute or two for the IP address to change from *\<pending\>* to an actual external IP address, as shown in the following example:

```
$ kubectl get service azure-vote-front

NAME                TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)        AGE
azure-vote-front    LoadBalancer   10.0.227.198   52.179.23.131   80:31201/TCP   16s
```

Navigate to the public IP in a browser and verify you see the sample application. In the above example, the public IP is `52.179.23.131`.

![Image of browsing to Azure Vote](media/container-service-kubernetes-walkthrough/azure-vote.png)

> [!NOTE]
> You can also configure the load balancer to be internal and not expose a public IP. To configure the load balancer as internal, add `service.beta.kubernetes.io/azure-load-balancer-internal: "true"` as an annotation to the *LoadBalancer* service. You can see an example yaml manifest as well as more details about an internal load balancer [here][internal-lb-yaml].

## Clean up the Standard SKU load balancer configuration

To remove the sample application and load balancer configuration, use [kubectl delete][kubectl-delete]:

```console
kubectl delete -f sample.yaml
kubectl delete -f standard-lb.yaml
```

## Next steps

Learn more about Kubernetes services at the [Kubernetes services documentation][kubernetes-services].

<!-- LINKS - External -->
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[kubectl-delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubernetes-services]: https://kubernetes.io/docs/concepts/services-networking/service/
[aks-engine]: https://github.com/Azure/aks-engine

<!-- LINKS - Internal -->
[advanced-networking]: configure-azure-cni.md
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[aks-sp]: kubernetes-service-principal.md#delegate-access-to-other-azure-resources
[az-aks-show]: /cli/azure/aks#az-aks-show
[az-aks-create]: /cli/azure/aks?view=azure-cli-latest#az-aks-create
[az-aks-get-credentials]: /cli/azure/aks?view=azure-cli-latest#az-aks-get-credentials
[az-aks-install-cli]: /cli/azure/aks?view=azure-cli-latest#az-aks-install-cli
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-group-create]: /cli/azure/group#az-group-create
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[azure-lb]: ../load-balancer/load-balancer-overview.md
[azure-lb-comparison]: ../load-balancer/load-balancer-overview.md#skus
[install-azure-cli]: /cli/azure/install-azure-cli
[internal-lb-yaml]: internal-lb.md#create-an-internal-load-balancer
[kubernetes-concepts]: concepts-clusters-workloads.md
[use-kubenet]: configure-kubenet.md
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
