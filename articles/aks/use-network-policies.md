---
title: Secure pods with network policies in Azure Kubernetes Service (AKS)
description: Learn how to secure traffic that flows in and out of pods using Kubernetes network policies in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 01/04/2019
ms.author: iainfou
---

# Secure traffic between pods using network policies in Azure Kubernetes Service (AKS)

When you run modern, microservices-based applications in Kubernetes, you often want to control which components and communicate with each other. For example, you likely don't want to allow traffic to flow directly backend application components. The principle of least privileges should be applied to traffic that can flow between pods in an AKS cluster. In Kubernetes, the *Network Policy* feature lets you define rules for ingress and egress traffic for pods in a cluster.

This article shows you how to use network policies to control the flow of traffic between pods in AKS.

## Before you begin

You need the Azure CLI version 2.0.54 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Overview of network policy

By default, all pods in an AKS cluster can send and receive traffic without limitations. To improve security, you can define rules that control the flow of traffic. For example, backend applications are often only exposed to required frontend services, or database components are only accessible to the application tiers that connect to them.

Network policies are Kubernetes resources that let you control the traffic flow between pods. You can choose to allow or deny traffic based on settings such as assigned labels, namespace, or traffic port. Network policies are defined as a YAML manifests, and can be included as part of a wider manifest that also creates a deployment or service.

To see network policies in action, let's create and then expand on a policy that defines traffic flow as follows:

* Deny all traffic to pod
* Allow traffic based on pod labels
* Allow traffic based on namespace

## Create an AKS cluster and enable network policy

To use network policy with an AKS cluster, you must be using the Azure CNI plugin and define your own virtual network and subnets. For more detailed information on how to plan out the required subnet ranges, see [configure advanced networking][use-advanced-networking]. The following example script:

* Creates a virtual network and subnet
* Creates an Azure Active Directory (AD) service principal for use with the AKS cluster
* Assigns *Contributor* permissions for the AKS cluster service principal on the virtual network
* Creates an AKS cluster in the defined virtual network, and enables network policy

As needed, replace the *RESOURCE_GROUP_NAME* and *CLUSTER_NAME* variables. Provide your own secure *SP_PASSWORD*:

```azurecli-interactive
RESOURCE_GROUP_NAME=myResourceGroup
CLUSTER_NAME=myAKSCluster
SP_PASSWORD=<your secure service principal password>

# Create a resource group
az group create --name $RESOURCE_GROUP_NAME --location eastus

# Create a virtual network and subnet
az network vnet create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name myVnet \
    --address-prefixes 10.0.0.0/8 \
    --subnet-name myAKSSubnet \
    --subnet-prefix 10.240.0.0/16

# Create a service principal and read in the application ID and password
read SP_ID <<< $(az ad sp create-for-rbac --password $SP_PASSWORD --skip-assignment --query [appId] -o tsv)

# Get the virtual network resource ID
VNET_ID=$(az network vnet show --resource-group $RESOURCE_GROUP_NAME --name myVnet --query id -o tsv)

# Assign the service principal Contributor permissions to the virtual network resource
az role assignment create --assignee $SP_ID --scope $VNET_ID --role Contributor

# Get the virtual network subnet resource ID
SUBNET_ID=$(az network vnet subnet show --resource-group $RESOURCE_GROUP_NAME --vnet-name myVnet --name myAKSSubnet --query id -o tsv)

# Create the AKS cluster and specify the virtual network and service principal information
# Enable network policy using the `--network-policy` parameter
az aks create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $CLUSTER_NAME \
    --node-count 1 \
    --network-plugin azure \
    --service-cidr 10.0.0.0/16 \
    --dns-service-ip 10.0.0.10 \
    --docker-bridge-address 172.17.0.1/16 \
    --vnet-subnet-id $SUBNET_ID \
    --service-principal $SP_ID \
    --client-secret $SP_PASSWORD \
    --network-policy azure
```

It takes a few minutes to create the cluster. When ready, configure `kubectl` to connect to your Kubernetes cluster using the [az aks get-credentials][az-aks-get-credentials] command. This command downloads credentials and configures the Kubernetes CLI to use them:

```azurecli-interactive
az aks get-credentials --resource-group $RESOURCE_GROUP_NAME --name $CLUSTER_NAME
```

## Deny all inbound traffic to a pod

Before you start to define rules for specific network traffic, first create a network policy to deny all traffic. This policy gives you a starting point to then begin to whitelist only the desired traffic. You can also clearly see traffic is dropped when policy is applied.

For our sample application environment and traffic rules, let's first create a namespace called *development* to run our example pods:

```console
kubectl create namespace development
```

Now create an example backend pod that runs NGINX. This backend pod can be used to simulate a sample backend web-based application. Create this pod in the *development* namespace, and open port *80* to serve web traffic:

```console
kubectl run backend --image=nginx --labels app=backend --namespace development --expose --port 80 --generator=run-pod/v1
```

To test that you can successfully reach the default NGINX web page, create another container, and attach a terminal session:

```console
kubectl run --rm -it --image=alpine network-policy --namespace development --generator=run-pod/v1
```

Once at shell prompt, use `wget` to confirm you can access the default NGINX web page:

```console
wget -qO- http://backend
```

The following sample output shows the default NGINX web page returned:

```
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
[...]
```

Exit out of the attached terminal session, and the test pod is automatically deleted:

```console
exit
```

Now that you've confirmed you can access the basic NGINX web page on the sample backend pod, create a network policy to deny traffic. Create a file named `backend-policy.yaml` and paste the following YAML manifest. This manifest uses *podSelector* to attach the policy to pods that have the *app: backend* label, such as our sample NGINX pod. Under *ingress*, no rules are defined, which denies all inbound traffic to the pod:

```yaml
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: backend-policy
spec:
  podSelector:
    matchLabels:
      app: backend
  ingress: []
```

Apply the network policy using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest:

```azurecli-interactive
kubectl apply -f backend-policy.yaml
```

Test if you can access the NGINX webpage on the backend pod again. Create another test pod and attach a terminal session:

```console
kubectl run --rm -it --image=alpine network-policy --namespace development --generator=run-pod/v1
```

Once at shell prompt, use `wget` to see if you can access the default NGINX web page. This time, set a timeout value to *2* seconds. The network policy blocks all inbound traffic, so the page cannot be loaded, as shown in the following example:

```console
$ wget -qO- --timeout=2 http://backend

wget: download timed out
```

Exit out of the attached terminal session, and the test pod is automatically deleted:

```console
exit
```

## Allow inbound traffic based on a specific label

In the previous section, a backend NGINX pod was scheduled, and a network policy was created to deny all traffic. Now let's create a frontend pod and update the network policy to allow traffic from that frontend.

Update the network policy to allow traffic from pods with the label *app: frontend*. Edit the previous *backend-policy.yaml* file, and add an ingress rule at the end so that your manifest is like the following example:

```yaml
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: backend-policy
spec:
  podSelector:
    matchLabels:
      app: backend
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
```

Apply the updated network policy using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest:

```azurecli-interactive
kubectl apply -f backend-policy.yaml
```

Now schedule a pod that is labeled as *app=frontend* and attached a terminal session:

```console
kubectl run -it frontend --image=alpine --labels app=frontend --namespace development --generator=run-pod/v1
```

Once at shell prompt, use `wget` to confirm you can access the default NGINX web page:

```console
wget -qO- http://backend
```

The following sample output shows the default NGINX web page returned:

```
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
[...]
```

Exit out of the attached terminal session:

```console
exit
```

The network policy allows traffic from pods labeled *app: frontend*, but should deny any other traffic. Now test that another pod without the *app: frontend* label cannot access the backend NGINX pod. Create another test pod and attach a terminal session:

```console
kubectl run --rm -it --image=alpine network-policy --namespace development --generator=run-pod/v1
```

Once at shell prompt, use `wget` to see if you can access the default NGINX web page. The network policy blocks all the inbound traffic, so the page cannot be loaded, as shown in the following example:

```console
$ wget -qO- --timeout=2 http://backend

wget: download timed out
```

Exit out of the attached terminal session, and the pod is automatically deleted:

```console
exit
```

## Allow traffic only from within a defined namespace

In the previous examples, you created a network policy that denied all traffic, then updated the policy to allow traffic from pods with a specific label. One other common need is to limit traffic to only within a given namespace. If the previous examples were for traffic in a *development* namespace, you may want to then create a network policy that prevents traffic from a *production* namespace for reaching the pods.

Create a new namespace to simulate a production namespace:

```console
kubectl create namespace production
```

Now schedule a pod in the *production* namespace, but that is labeled as *app=frontend*. Attach a terminal session:

```console
kubectl run -it frontend --image=alpine --labels app=frontend --namespace production --generator=run-pod/v1
```

Once at shell prompt, use `wget` to confirm you can access the default NGINX web page:

```console
wget -qO- http://backend
```

As the labels for the pod match what is permitted in the network policy, the traffic is allowed. The following sample output shows the default NGINX web page returned:

```
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
[...]
```

Exit out of the attached terminal session:

```console
exit
```

Update the network policy ingress to now only allow traffic within the same namespace. Change the ingress rule from using a *podSelector* to using a *namespaceSelector*. Edit the *backend-policy.yaml* manifest file as shown in the following example:

```yaml
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: backend-policy
spec:
  podSelector:
    matchLabels:
      app: backend
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          purpose: development
```

Apply the updated network policy using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest:

```azurecli-interactive
kubectl apply -f backend-policy.yaml
```

Schedule another pod in the *production* namespace and attach a terminal session:

```console
kubectl run -it frontend --image=alpine --labels app=frontend --namespace production --generator=run-pod/v1
```

Once at shell prompt, use `wget` to see the network policy now deny traffic:

```console
$ wget -qO- http://backend

wget: download timed out
```

Exit out of the test pod:

```console
exit
```

Schedule another pod, time in the *development* namespace and attach a terminal session:

```console
kubectl run -it frontend --image=alpine --labels app=frontend --namespace production --generator=run-pod/v1
```

Once at shell prompt, use `wget` to see the network policy now deny traffic:

```console
$ wget -qO- http://backend
```

As the pod is scheduled in the namespace that matches what is permitted in the network policy, the traffic is allowed. The following sample output shows the default NGINX web page returned:

```
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
[...]
```

Exit out of the attached terminal session:

```console
exit
```

## Clean up resources

To clean up resources created in this article:

```console
kubectl delete namespace production
kubectl delete namespace development
kubectl delete networkpolicy backend-policy
```

## Next steps

For more information about network resources, see [Network concepts for applications in Azure Kubernetes Service (AKS)][concepts-network].

To learn more about using policies, see [Kubernetes network policies][kubernetes-network-policies].

<!-- LINKS - external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubernetes-network-policies]: https://kubernetes.io/docs/concepts/services-networking/network-policies/

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[use-advanced-networking]: configure-advanced-networking.md
[az-aks-get-credentials]: /cli/azure/aks?view=azure-cli-latest#az-aks-get-credentials
[concepts-network]: concepts-network.md
