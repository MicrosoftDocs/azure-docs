---
title: Whitelist Egress Traffic from Azure Kubernetes Service (AKS) cluster
description: Whitelist egress traffic from an Azure Kubernetes Service (AKS) cluster
services: container-service
author: ritazh
manager: jtalkar

ms.service: container-service
ms.topic: article
ms.date: 05/17/2018
ms.author: ritazh
---

# Whitelist egress traffic from Azure Kubernetes Service (AKS)

Whitelisting IPs to grant access to databases and other services is a common practice. When running services in Azure Kubernetes Service (AKS) that need access to a service outside of AKS, you may need to whitelist the egress traffic. This document demonstrates how to specify an egress address for whitelisting purposes.

Outbound traffic from an AKS cluster follows Azure Load Balancer conventions, which are documented [here][outbound-connections]. Before the first Kubernetes service of type `LoadBalancer` is created, the agent nodes are not part of any Azure Load Balancer pool. Because of this configuration, the nodes and are without an instance Level Public IP address. Azure translates the outbound flow to a public source IP address that is not configurable or deterministic.

Once a Kubernetes service of type `LoadBalancer` is created, agent nodes are added to an Azure Load Balancer pool. For outbound flow, Azure translates it to the first public IP address configured on the load balancer. If that public IP address is removed, the next frontend IP configured on the load balancer is used for outbound traffic.

## Prerequisite

- Azure CLI 2.0: [install it locally][azure-cli-install], or use it in the [Azure Cloud Shell][azure-cloud-shell].
- Helm CLI 2.7+: [install it locally][helm-cli-install], or use it in the [Azure Cloud Shell][azure-cloud-shell].
- An existing Azure Kubernetes Service (AKS) cluster. If you need an AKS cluster, follow the [Create an AKS cluster][create-aks-cluster] quickstart.

## Create a static public IP

To prevent random IP addresses from being used, create a static IP and ensure the load balancer uses this address.

Create a static public IP address for the Kubernetes service in the resource group that was auto-created during cluster deployment. For information on the different AKS resource groups and how to identify the auto created resource group, see the [AKS FAQ][aks-faq-resource-group].

```console
$ az network public-ip create --resource-group MC_myAKSCluster_myAKSCluster_eastus --name myAKSPublicIP --allocation-method static --query publicIp.ipAddress -o table

Result
-------------
23.101.128.81
```

## Deploy a Service with the static IP

The followign YAML file deploys a load balanced service that is configured to use the static IP address. Update the IP address to match your environment. An application is also run that returns the IP for demonstraiton purposes.

Create a file named `ip-demo.yaml` and copy in the following YAML.

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: aks-egress
spec:
  replicas: 1
  selector:
    matchLabels:
      app: aks-egress
  template:
    metadata:
      labels:
        app: aks-egress
    spec:
      containers:
      - name: aks-egress
        image: sevendollar/public-ip
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: aks-egress
  labels:
    app: aks-egress
spec:
  loadBalancerIP: 23.101.128.81
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
    name: http
  selector:
    app: aks-egress
```

Create the service and deployment with the `kubectl apply` command.

```console
$ kubectl apply -f ip-demo.yaml

deployment "aks-egress" created
service "aks-egress" created
```

Creating this service configures a new frontend IP on the Azure Load Balancer. If you do not have any other IPs configured, then all egress traffic should now use this address. When multiple addresses are configured on the Azure Load Balancer, egress uses the first IP on that load balancer.

To verify the public ip used, let's look at the logs from one of the running pods. Get the pod name with the `kubeclt get pods` command.

```console
$ kubectl get pods -l app=aks-egress

NAME                          READY     STATUS    RESTARTS   AGE
aks-egress-6dcf96595b-6lf5l   1/1       Running   0          6m
```

Pull the logs from the pod to revel the pods IP address.

```console
$ kubectl logs http-svc-677684d487-fxhnd

23.101.128.81
```

To avoid maintaining multiple public IP addresses on the Azure Load Balancer, consider using an ingress controller. Ingress-controllers provide benefits such as load balancing, SSL/TLS termination, support for URI rewrites, and upstream SSL/TLS encryption. For more information about ingress-controllers in AKS, see the [Configure NGINX ingress controller in an AKS cluster][ingress-aks-cluster] guide.

## Next steps

Learn more about the software demonstrated in this document.

- [Helm CLI][helm-cli-install]
- [NGINX ingress controller][nginx-ingress]
- [Azure Load Balancer Outbound Connections][outbound-connections]

<!-- LINKS - internal -->
[azure-cli-install]: /cli/azure/install-azure-cli
[azure-cloud-shell]: ../cloud-shell/overview.md
[aks-faq-resource-group]: faq.md#why-are-two-resource-groups-created-with-aks
[create-aks-cluster]: ./kubernetes-walkthrough.md
[helm-cli-install]: ./kubernetes-helm.md#install-helm-cli
[ingress-aks-cluster]: ./ingress.md
[outbound-connections]: ../load-balancer/load-balancer-outbound-connections.md#scenarios

<!-- LINKS - external -->
[nginx-ingress]: https://github.com/kubernetes/ingress-nginx
