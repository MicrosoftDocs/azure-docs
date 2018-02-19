---
title: Configure ingress with Azure Container Service (AKS) cluster
description: Install and configure an NGINX ingress controller in an Azure Container Service (AKS) cluster.
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: article
ms.date: 2/12/2018
ms.author: nepeters
ms.custom: mvc
---

# HTTP load balancing and TLS termination with Ingress

An ingress controller is a piece of software that provides reverse proxy, configurable traffic routing, and TLS termination for Kubernetes services. Kubernetes ingress resources are used to configure the ingress rules and routes for individual Kubernetes services. Using an ingress controller and ingress resources or rules, a single external address can be used to route traffic to multiple applications in a Kuebrentes cluster.

This document walks through a sample deployment of the [NGIX ingress controller][nginx-ingress] in an Azure Container Service (AKS) cluster. Additionally, the [kube-lego][kube-lego] project is used to automatically generate and configure TLS certificates from [Let's Encrypt][lets-encrypt]. Finally, several applications are run in the AKS cluster, each of which is accessible over a single Azure Public IP Address.

## Install the ingress controller

Use Helm to install the NGINX ingress controller. This provides an out of the box / default configuration for the NGINX ingress controller. See the [NGINX ingress controller documentation][nginx-ingress] for detailed information. 

```
helm install stable/nginx-ingress
```

An Azure public IP address is also created. This public IP address is used to contact Kubernetes services behind the ingress controller.  

To get the public IP address, use the kubectl get service command. It may take some time for the IP address to be assigned to the service.

```console
$ kubectl get service

NAME                                          TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)                      AGE
kubernetes                                    ClusterIP      10.0.0.1       <none>           443/TCP                      3d
toned-spaniel-nginx-ingress-controller        LoadBalancer   10.0.236.223   52.224.125.195   80:30927/TCP,443:31144/TCP   18m
toned-spaniel-nginx-ingress-default-backend   ClusterIP      10.0.5.86      <none>           80/TCP                       18m
```

Because no ingress rules have been created, if you browse to the public IP address, you are routed to the default back end / 404 response.

![Default NGINX backend](media/ingress/default-back-end.png)

## Configure DNS name

Now configure a fully qualified domain name for the ingress controllers public IP address.

The following sample sets the FQDN name on a given public IP address. Update the script with the IP address of the ingress controller and the name that you would like to use in the FQDN.

```
#!/bin/bash

# Public IP address
IP="52.224.125.195"

# Name to associate with public IP address
DNSNAME="demo-aks-ingress"

# Get resource group and public ip name
RESOURCEGROUP=$(az network public-ip list --query "[?contains(ipAddress, '$IP')].[resourceGroup]" --output tsv)
PIPNAME=$(az network public-ip list --query "[?contains(ipAddress, '$IP')].[name]" --output tsv)

# Update public ip address with dns name
az network public-ip update --resource-group $RESOURCEGROUP --name  $PIPNAME --dns-name $DNSNAME
```

Run the following command to retrieve the FQDN. Update the IP address value with that of your ingress controller.

```azurecli
az network public-ip list --query "[?contains(ipAddress, '52.224.125.195')].[dnsSettings.fqdn]" --output tsv
```

At this point, the ingress controller is accessible through the DNS name. Because no ingress rules have been created, all traffic is routed to the ingress controllers default back end / 404 response page.

## Install kube-lego

The NGINX ingress controller supports TLS termination. While there are several ways to retrieve and configure certificates for TLS, this document demonstrates using [kube-lego][kube-lego]. kube-lego provides automatic [Lets Encrypt] [lets-encrypt] certificate generation and management functionality for the ingress controller.

To install the kube-Lego controller, use the following Helm install command. Update the email address with one from your organization. For more information on kube-lego configuration, see the [kube-lego documentation] [kube-lego].

```
helm install stable/kube-lego \
  --set config.LEGO_EMAIL=user@contoso.com \
  --set config.LEGO_URL=https://acme-v01.api.letsencrypt.org/directory
```

## Run application

At this point, an ingress controller and a certificate management solution have been configured. Now run a few applications in your AKS cluster. 

For this example, Helm is used to run multiple instances of the Azure vote application. 

Before installing the Azure vote application, add the Azure samples Helm repository on your development system.

```
helm repo add azure-samples https://azure-samples.github.io/helm-charts/
```

The Azure vote chart is configured with a default service type of `LoadBalancer` and a service name of `azure-vote-front`. Because the application will be accessed over an ingress controller, change the service type to `ClusterIP`. This configuration can be seen in the following command.  

```
helm install azure-samples/azure-vote --set serviceType=ClusterIP
```

Now install the second instance of the Azure vote application.

For the second instance, specify a new configuration so that the two applications are visually distinct. You also need to specify a unique service name to provide a unique service. These configurations can be seen in the following command. Take note that the service name is `azure-vote-two`, this is relevant when configuring the ingress resource / rules.

```console
helm install azure-samples/azure-vote \
  --set title="Winter Sports" \
  --set value1=Ski \
  --set value2=Snowboard \
  --set serviceType=ClusterIP \
  --set serviceNameFront=azure-vote-two
```

## Create ingress route

Now that the ingress controller, TLS certificate automation, and applications have been deployed, create a Kubernetes ingress resource. The ingress resource configures the rules that route traffic to one of the two applications.

Create a file name `azure-vote-ingress.yaml` and copy in the following YAML.

Take note that the traffic to the address `https://demo-aks-ingress.eastus.cloudapp.azure.com/` is routed to the service named `azure-vote-front`. Traffic to the address `https://demo-aks-ingress.eastus.cloudapp.azure.com/azure-vote-two` is routed to the `azure-vote-two` service.

```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: azure-vote
  annotations:
    kubernetes.io/tls-acme: "true"
    ingress.kubernetes.io/rewrite-target: /
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
          serviceName: azure-vote-front
          servicePort: 80
      - path: /azure-vote-two
        backend:
          serviceName: azure-vote-two
          servicePort: 80
```

Create the ingress resource with the `kubectl load` command.

```console
kubectl apply -f azure-vote-ingress.yaml
```

## Test the ingress configuration

Browse to the FQDN of your Kubernetes ingress controller. You should see the Azure vote application with the default values.

![Application example one](media/ingress/app-one.png)

Now browse to the FQDN of the ingress controller with the `/azure-vote-two` path. You should see the Azure vote application with the custom values.

![Application example two](media/ingress/app-two.png)

Also notice that the connection is encrypted and that a certificate issued by Let's Encrypt is used.

![Lets encrypt certificate](media/ingress/certificate.png)

<!-- LINKS - external -->
[kube-lego]: https://github.com/jetstack/kube-lego
[lets-encrypt]: https://letsencrypt.org/
[nginx-ingress]: https://github.com/kubernetes/ingress-nginx