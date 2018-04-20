---
title: Whitelist Egress Traffic from Azure Container Service (AKS) cluster
description: Whitelist egress traffic from an Azure Container Service (AKS) cluster
services: container-service
author: ritazh
manager: jtalkar

ms.service: container-service
ms.topic: article
ms.date: 04/17/2018
ms.author: ritazh
---

# Whitelist egress traffic from Azure Container Service (AKS)

Whitelisting IPs to grant access to databases is a common practice in many organizations. When running services that need access to database outside of Kubernetes, these services need to be granted access to these databases by whitelisting the egress traffic coming from the Kubernetes cluster. This guide focuses on how you can whitelist the egress traffic from AKS.

Outbound traffic from Pods in an AKS cluster follow Azure Load Balancer conventions documented [here][outbound-connections]. Before the first Kubernetes service of type `LoadBalancer` is created, the agent nodes are not part of any Azure Load Balancer pool and are without any instance Level Public IP. Azure translates the outbound flow to a public source IP address that is not configurable and not deterministic. Once a Kubernetes service of type `LoadBalancer` is created, the agent nodes will be part of an Azure Load Balancer pool. For outbound flow, Azure translates it to the first public IP address configured on the load balancer. If that public IP address is removed, then the next frontend IP configured on the load balancer will be used for outbound traffic.

## Prerequisite

* An Azure subscription

* Azure CLI 2.0: [install it locally][azure-cli-install], or use it in the [Azure Cloud Shell][azure-cloud-shell].

* Helm CLI 2.7+: [install it locally][helm-cli-install], or use it in the [Azure Cloud Shell][azure-cloud-shell].

* An existing Azure Container Service (AKS) cluster. If you need an AKS cluster, follow the [Create an AKS cluster][create-aks-cluster] quickstart.

## Create a static public IP

To prevent random IPs being used for ingress and egress traffic, first create static IPs, then make sure the load balancer is using those static IPs for your ingress and egress traffic. 

To create a static public ip on Azure, use the az cli to create the public ip in the same resource group as your Kubernetes cluster. 

```console
az network public-ip create --resource-group myAKSResourceGroup --name myAKSPublicIP --allocation-method static
```
## Deploy a Service with the static IP

Take the deployment you have, update the `loadBalancerIP` section of the service spec:

```yaml
  loadBalancerIP: <YOUR STATIC PUBLIC IP>
  type: LoadBalancer
```

From this spec:

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: http-svc
spec:
  replicas: 2
  selector:
    matchLabels:
      app: http-svc
  template:
    metadata:
      labels:
        app: http-svc
    spec:
      containers:
      - name: http-svc
        image: ritazh/sample-mypublicip-demo
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: http-svc
  labels:
    app: http-svc
spec:
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
    name: http
  selector:
    app: http-svc
```

To this spec:

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: http-svc
spec:
  replicas: 2
  selector:
    matchLabels:
      app: http-svc
  template:
    metadata:
      labels:
        app: http-svc
    spec:
      containers:
      - name: http-svc
        image: ritazh/sample-mypublicip-demo
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: http-svc
  labels:
    app: http-svc
spec:
  loadBalancerIP: <YOUR STATIC PUBLIC IP>
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
    name: http
  selector:
    app: http-svc
```

If you already created this service, you can edit your deployment yaml file and run `kubectl apply -f deployment.yaml` to apply the changes.

Creating this service configures a new frontend IP on the Azure Load Balancer in front of your agent nodes. If you do not have any other IPs configured on this load balancer, then all egress traffic from all the pods should now use the public IP you created earlier. If you have previously had other IPs configured on the Azure Load Balancer, then the egress will use the first IP on that load balancer.

To verify the public ip used, let's look at the logs from one of the running pods:

```console

kubectl logs http-svc-677684d487-fxhnd
Thu Apr 19 22:17:06 UTC 2018 - retrieving current public ip address every 120 seconds
Thu Apr 19 22:17:06 UTC 2018 - public ip: <YOUR STATIC PUBLIC IP>
Thu Apr 19 22:19:06 UTC 2018 - public ip: <YOUR STATIC PUBLIC IP>
```

To avoid maintaining too many public IPs on the Azure Load Balancer and creating a new `loadbalancer` type service for every application, consider using an ingress-controller to route all ingress traffic of your services to the ingress-controller. Ingress-controllers provide benefits such as load balancing, SSL/TLS termination, support for URI rewrites, and upstream SSL/TLS encryption. For more details about ingress-controllers in AKS, you can refer to the [Configure NGINX ingress controller in an AKS cluster][ingress-aks-cluster] guide. 

## Install an ingress controller with static IP

Before installing the ingress controller with the static IP, make sure to remove the static IP from any service that is using it. Remove `loadBalancerIP` and `type: LoadBalancer`. For example, your service yaml should look like this spec:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: http-svc
  labels:
    app: http-svc
spec:
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
    name: http
  selector:
    app: http-svc
```

Use Helm to install the NGINX ingress controller. See the NGINX ingress controller [documentation][nginx-ingress] for detailed deployment information. 

Update the chart repository.

```console
helm repo update
```

Install the NGINX ingress controller. This example uses the static IP created in the previous section and installs the controller in the `kube-system` namespace, which can be modified to a namespace of your choice.

```console
helm install stable/nginx-ingress --namespace kube-system --set controller.service.loadBalancerIP=<YOUR STATIC PUBLIC IP>
```

To verify the public IP address of your ingress controller, use the kubectl get service command. 

```console
$ kubectl get service -l app=nginx-ingress --namespace kube-system

NAME                                       TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)                      AGE
mangy-mink-nginx-ingress-controller        LoadBalancer   10.0.42.109    <pending>     80:32156/TCP,443:31452/TCP   2m
mangy-mink-nginx-ingress-default-backend   ClusterIP      10.0.10.232    <none>        80/TCP                       2m
```

Because no ingress rules have been created, if you browse to the public IP address, you are routed to the NGINX ingress controllers default 404 page.

## Route your application traffic to Ingress Controller

Route your application traffic to this Ingress Controller by creating a new ingress resource. 

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: nginx
  labels:
    app: http-svc
  name: http-svc
  namespace: default
spec:
  rules:
  - http:
      paths:
      - backend:
          serviceName: http-svc
          servicePort: 80
        path: /
```

Create this ingress resource with the `kubectl apply` command.

```console
kubectl apply -f ingress.yaml
```

With this ingress resource, all ingress traffic going to the http-svc service is now go through the ingress-controller. 

Depending on how many `loadbalancer` type services you have created in your cluster and the order in which you have created them, your egress traffic from the cluster should be using the first public ip configured on the Azure Load Balancer. To ensure all the egress traffic can access your database, you should whitelist all the static IPs configured on the Azure Load Balancer in case one of them gets deleted. 

## Next steps

Learn more about the software demonstrated in this document. 

- [Helm CLI][helm-cli-install]
- [NGINX ingress controller][nginx-ingress]
- [Azure Load Balancer Outbound Connections][outbound-connections]

<!-- LINKS - external -->
[azure-cli-install]: /cli/azure/install-azure-cli
[azure-cloud-shell]: ../cloud-shell/overview.md
[create-aks-cluster]: ./kubernetes-walkthrough.md
[helm-cli-install]: https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm#install-helm-cli
[nginx-ingress]: https://github.com/kubernetes/ingress-nginx
[ingress-aks-cluster]: ./ingress.md
[outbound-connections]: https://docs.microsoft.com/en-us/azure/load-balancer/load-balancer-outbound-connections#scenarios
