---
title: Configure ingress with Azure Container Service (AKS) cluster
description: Install and configure an NGINX ingress controller in an Azure Container Service (AKS) cluster.
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: article
ms.date: 03/03/2018
ms.author: nepeters
ms.custom: mvc
---

# HTTPS Ingress on Azure Container Service (AKS)

An ingress controller is a piece of software that provides reverse proxy, configurable traffic routing, and TLS termination for Kubernetes services. Kubernetes ingress resources are used to configure the ingress rules and routes for individual Kubernetes services. Using an ingress controller and ingress rules, a single external address can be used to route traffic to multiple services in a Kubernetes cluster.

This document walks through a sample deployment of the [NGINX ingress controller][nginx-ingress] in an Azure Container Service (AKS) cluster. Additionally, the [KUBE-LEGO][kube-lego] project is used to automatically generate and configure [Let's Encrypt][lets-encrypt] certificates. Finally, several applications are run in the AKS cluster, each of which is accessible over a single address.

## Install an ingress controller

Use Helm to install the NGINX ingress controller. See the NGINX ingress controller [documentation][nginx-ingress] for detailed deployment information. 

Update the chart repository.

```console
helm repo update
```

Install the NGINX ingress controller. This example installs the controller in the `kube-system` namespace, this can be modified to a namespace of your choice.

```
helm install stable/nginx-ingress --namespace kube-system
```

During the installation, an Azure public IP address is created for the ingress controller. To get the public IP address, use the kubectl get service command. It may take some time for the IP address to be assigned to the service.

```console
$ kubectl get service -l app=nginx-ingress --namespace kube-system

NAME                                       TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)                      AGE
eager-crab-nginx-ingress-controller        LoadBalancer   10.0.182.160   13.82.238.45   80:30920/TCP,443:30426/TCP   20m
eager-crab-nginx-ingress-default-backend   ClusterIP      10.0.255.77    <none>         80/TCP                       20m
```

Because no ingress rules have been created, if you browse to the public IP address, you are routed to the NGINX ingress controllers default 404 page.

![Default NGINX backend](media/ingress/default-back-end.png)

## Configure DNS name

Because HTTPS certificates are used, you need to configure an FQDN name for the ingress controllers IP address. For this example, an Azure FQDN is created with the Azure CLI. Update the script with the IP address of the ingress controller and the name that you would like to use in the FQDN.

```
#!/bin/bash

# Public IP address
IP="52.224.125.195"

# Name to associate with public IP address
DNSNAME="demo-aks-ingress"

# Get resource group and public ip name
RESOURCEGROUP=$(az network public-ip list --query "[?ipAddress!=null]|[?contains(ipAddress, '$IP')].[resourceGroup]" --output tsv)
PIPNAME=$(az network public-ip list --query "[?ipAddress!=null]|[?contains(ipAddress, '$IP')].[name]" --output tsv)

# Update public ip address with dns name
az network public-ip update --resource-group $RESOURCEGROUP --name  $PIPNAME --dns-name $DNSNAME
```

If needed, run the following command to retrieve the FQDN. Update the IP address value with that of your ingress controller.

```azurecli
az network public-ip list --query "[?ipAddress!=null]|[?contains(ipAddress, '52.224.125.195')].[dnsSettings.fqdn]" --output tsv
```

The ingress controller is now accessible through the FQDN.

## Install KUBE-LEGO

The NGINX ingress controller supports TLS termination. While there are several ways to retrieve and configure certificates for HTTPS, this document demonstrates using [KUBE-LEGO][kube-lego], which provides automatic [Lets Encrypt][lets-encrypt] certificate generation and management functionality.

To install the KUBE-LEGO controller, use the following Helm install command. Update the email address with one from your organization.

```
helm install stable/kube-lego \
  --set config.LEGO_EMAIL=user@contoso.com \
  --set config.LEGO_URL=https://acme-v01.api.letsencrypt.org/directory
```

For more information on KUBE-LEGO configuration, see the [KUBE-LEGO documentation][kube-lego].

## Run application

At this point, an ingress controller and a certificate management solution have been configured. Now run a few applications in your AKS cluster.

For this example, Helm is used to run multiple instances of a simple hello world application.

Before running the application, add the Azure samples Helm repository on your development system.

```
helm repo add azure-samples https://azure-samples.github.io/helm-charts/
```

 Run the AKS hello world chart with the following command:

```
helm install azure-samples/aks-helloworld
```

Now install a second instance of the hello world application.

For the second instance, specify a new title so that the two applications are visually distinct. You also need to specify a unique service name. These configurations can be seen in the following command.

```console
helm install azure-samples/aks-helloworld --set title="AKS Ingress Demo" --set serviceName="ingress-demo"
```

## Create ingress route

Both applications are now running on your Kubernetes cluster, however have been configured with a service of type `ClusterIP`. As such, the applications are not accessible from the internet. In order to make the available, create a Kubernetes ingress resource. The ingress resource configures the rules that route traffic to one of the two applications.

Create a file name `hello-world-ingress.yaml` and copy in the following YAML.

Take note that the traffic to the address `https://demo-aks-ingress.eastus.cloudapp.azure.com/` is routed to the service named `aks-helloworld`. Traffic to the address `https://demo-aks-ingress.eastus.cloudapp.azure.com/hello-world-two` is routed to the `ingress-demo` service.

```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: hello-world-ingress
  annotations:
    kubernetes.io/tls-acme: "true"
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  tls:
  - hosts:
    - demo-aks-ingress.eastus.cloudapp.azure.com
    secretName: tls-secret
  rules:
  - host: demo-aks-ingress.eastus.cloudapp.azure.com
    http:
      paths:
      - path: /
        backend:
          serviceName: aks-helloworld
          servicePort: 80
      - path: /hello-world-two
        backend:
          serviceName: ingress-demo
          servicePort: 80
```

Create the ingress resource with the `kubectl apply` command.

```console
kubectl apply -f hello-world-ingress.yaml
```

## Test the ingress configuration

Browse to the FQDN of your Kubernetes ingress controller, you should see the hello world application.

![Application example one](media/ingress/app-one.png)

Now browse to the FQDN of the ingress controller with the `/hello-world-two` path, you should see the hello world application with the custom title.

![Application example two](media/ingress/app-two.png)

Also notice that the connection is encrypted and that a certificate issued by Let's Encrypt is used.

![Lets encrypt certificate](media/ingress/certificate.png)

## Next steps

Learn more about the software demonstrated in this document. 

- [NGINX ingress controller][nginx-ingress]
- [KUBE-LEGO][kube-lego]

<!-- LINKS - external -->
[kube-lego]: https://github.com/jetstack/kube-lego
[lets-encrypt]: https://letsencrypt.org/
[nginx-ingress]: https://github.com/kubernetes/ingress-nginx
