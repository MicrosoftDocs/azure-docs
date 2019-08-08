---
title: Use a Standard SKU load balancer in Azure Kubernetes Service (AKS)
description: Learn how to use a load balancer with a Standard SKU to expose your services with Azure Kubernetes Service (AKS).
services: container-service
author: zr-msft

ms.service: container-service
ms.topic: article
ms.date: 09/05/2019
ms.author: zarhoads

#Customer intent: As a cluster operator or developer, I want to learn how to create a service in AKS that uses an Azure Load Balancer with a Standard SKU.
---

# Use a Standard SKU load balancer in Azure Kubernetes Service (AKS)

To provide access to your applications in Azure Kubernetes Service (AKS), you can create and use an Azure Load Balancer. A load balancer running on AKS can be used as an internal or an external load balancer. An internal load balancer makes a Kubernetes service accessible only to applications running in the same virtual network as the AKS cluster. An external load balancer receives one or more public IPs for ingress and makes a Kubernetes service accessible externally using the public IPs.

Azure Load Balancer is available in two SKUs - *Basic* and *Standard*. By default, the *Basic* SKU is used when a service manifest is used to create a load balancer on AKS. Using a *Standard* SKU load balancer provides additional features and functionality, such as larger backend pool size and Availability Zones. It's important that you understand the differences between *Standard* and *Basic* load balancers before choosing which to use. Once you create an AKS cluster, you cannot change the load balancer SKU for that cluster. For more information on the *Basic* and *Standard* SKUs, see [Azure load balancer SKU comparison][azure-lb-comparison].

This article shows you how to create and use an Azure Load Balancer with the *Standard* SKU with Azure Kubernetes Service (AKS).

This article assumes a basic understanding of Kubernetes and Azure Load Balancer concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts] and [What is Azure Load Balancer?][azure-lb].

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.59 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Before you begin

The AKS cluster service principal needs permission to manage network resources if you use an existing subnet or resource group. In general, assign the *Network contributor* role to your service principal on the delegated resources. For more information on permissions, see [Delegate AKS access to other Azure resources][aks-sp].

You must create an AKS cluster that sets the SKU for the load balancer to *Standard* instead of the default *Basic*.

### Install aks-preview CLI extension

To use the Azure load balancer standard SKU, you need the *aks-preview* CLI extension version 0.4.12 or higher. Install the *aks-preview* Azure CLI extension using the [az extension add][az-extension-add] command, then check for any available updates using the [az extension update][az-extension-update] command:

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

### Limitations

The following limitations apply when you create and manage AKS clusters that support a load balancer with the *Standard* SKU:

* At least one public IP or IP prefix is required for allowing egress traffic from the AKS cluster. The public IP or IP prefix is also required to maintain connectivity between the control plane and agent nodes as well as to maintain compatibility with previous versions of AKS. You have the following options for specifying public IPs or IP prefixes with a *Standard* SKU load balancer:
    * Provide your own public IPs.
    * Provide your own public IP prefixes.
    * Specify a number up to 100 to allow the AKS cluster to create that many *Standard* SKU public IPs in the same resource group created as the AKS cluster, which is usually named with *MC_* at the beginning. AKS assigns the public IP to the *Standard* SKU load balancer. By default, one public IP will automatically be created in the same resource group as the AKS cluster, if no public IP, public IP prefix, or number of IPs is specified. You also must allow public addresses and avoid creating any Azure Policy that bans IP creation.
* When using the *Standard* SKU for a load balancer, you must use Kubernetes version 1.13 or greater.
* Defining the load balancer SKU can only be done when you create an AKS cluster. You cannot change the load balancer SKU after an AKS cluster has been created.
* You can only use one load balancer SKU in a single cluster.

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
In order to run an AKS cluster that supports a load balancer with the *Standard* SKU, your cluster needs to set the *load-balancer-sku* parameter to *standard*. This parameter creates a load balancer with the *Standard* SKU when your cluster is created. When you run a *LoadBalancer* service on your cluster, the configuration of the *Standard* SKU load balancer is updated with the service's configuration. Use the [az aks create][az-aks-create] command to create an AKS cluster named *myAKSCluster*.

> [!NOTE]
> The *load-balancer-sku* property can only be used when your cluster is created. You cannot change the load balancer SKU after an AKS cluster has been created. Also, you can only use one type of load balancer SKU in a single cluster.
> 
> If you want to use your own public IPs, use the *load-balancer-outbound-ips*, or *load-balancer-outbound-ip-prefixes* parameters. Both of these parameters can also be used when [updating the cluster](#optional---provide-your-own-public-ips-or-prefixes-for-egress).

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --enable-vmss \
    --node-count 1 \
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
aks-nodepool1-31718369-0   Ready    agent   6m44s   v1.13.10
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

## Optional - Scale the number of managed public IPs

When using a *Standard* SKU load balancer with managed outbound public IPs, which are created by default, you can scale the number of managed outbound public IPs using the *load-balancer-managed-ip-count* parameter.

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-managed-outbound-ip-count 2
```

The above example sets the number of managed outbound public IPs to *2* for the *myAKSCluster* cluster in *myResourceGroup*. You can also use the *load-balancer-managed-ip-count* parameter to set the initial number of managed outbound public IPs when creating your cluster. The default number of managed outbound public IPs is 1.

## Optional - Provide your own public IPs or prefixes for egress

When using a *Standard* SKU load balancer, the AKS cluster automatically creates a public IP in same resource group created for the AKS cluster and assigns the public IP to the *Standard* SKU load balancer. Alternatively, you can assign your own public IP.

> [!IMPORTANT]
> You must use *Standard* SKU public IPs for egress with your *Standard* SKU your load balancer. You can verify the SKU of your public IPs using the [az network public-ip show][az-network-public-ip-show] command:
>
> ```azurecli-interactive
> az network public-ip show --resource-group myResourceGroup --name myPublicIP --query sku.name -o tsv
> ```

Use the [az network public-ip show][az-network-public-ip-show] command to list the IDs of your public IPs.

```azurecli-interactive
az network public-ip show --resource-group myResourceGroup --name myPublicIP --query id -o tsv
```

The above command shows the ID for the *myPublicIP* public IP in the *myResourceGroup* resource group.

Use the *az aks update* command with the *load-balancer-outbound-ips* parameter to update your cluster with your public IPs.

The following example uses the *load-balancer-outbound-ips* parameter with the IDs from the previous command.

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-outbound-ips <publicIpId1>,<publicIpId2>
```

You can also use public IP prefixes for egress with your *Standard* SKU load balancer. The following example uses the [az network public-ip prefix show][az-network-public-ip-prefix-show] command to list the IDs of your public IP prefixes:

```azurecli-interactive
az network public-ip prefix show --resource-group myResourceGroup --name myPublicIPPrefix --query id -o tsv
```

The above command shows the ID for the *myPublicIPPrefix* public IP prefix in the *myResourceGroup* resource group.

Use the *az aks update* command with the *load-balancer-outbound-ip-prefixes* parameter with the IDs from the previous command.

The following example uses the *load-balancer-outbound-ip-prefixes* parameter with the IDs from the previous command.

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-outbound-ip-prefixes <publicIpPrefixId1>,<publicIpPrefixId2>
```

> [!IMPORTANT]
> The public IPs and IP prefixes must be in the same region and part of the same subscription as your AKS cluster.

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
[az-network-public-ip-show]: /cli/azure/network/public-ip?view=azure-cli-latest#az-network-public-ip-show
[az-network-public-ip-prefix-show]: /cli/azure/network/public-ip?view=azure-cli-latest#az-network-public-ip-prefix-show
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[azure-lb]: ../load-balancer/load-balancer-overview.md
[azure-lb-comparison]: ../load-balancer/load-balancer-overview.md#skus
[install-azure-cli]: /cli/azure/install-azure-cli
[internal-lb-yaml]: internal-lb.md#create-an-internal-load-balancer
[kubernetes-concepts]: concepts-clusters-workloads.md
[use-kubenet]: configure-kubenet.md
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update

