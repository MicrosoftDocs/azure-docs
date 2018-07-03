---
title: Configure ingress with Azure Kubernetes Service (AKS) cluster
description: Install and configure an NGINX ingress controller in an Azure Kubernetes Service (AKS) cluster.
services: container-service
author: iainfoulds
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 06/25/2018
ms.author: iainfou
ms.custom: mvc
---

# HTTPS Ingress on Azure Kubernetes Service (AKS)

An ingress controller is a piece of software that provides reverse proxy, configurable traffic routing, and TLS termination for Kubernetes services. Kubernetes ingress resources are used to configure the ingress rules and routes for individual Kubernetes services. Using an ingress controller and ingress rules, a single external address can be used to route traffic to multiple services in a Kubernetes cluster.

This document walks through a sample deployment of the [NGINX ingress controller][nginx-ingress] in an Azure Kubernetes Service (AKS) cluster. Additionally, the [cert-manager][cert-manager] project is used to automatically generate and configure [Let's Encrypt][lets-encrypt] certificates. Finally, several applications are run in the AKS cluster, each of which is accessible over a single address.

## Install an ingress controller

Use Helm to install the NGINX ingress controller. See the NGINX ingress controller [documentation][nginx-ingress] for detailed deployment information.

This example installs the controller in the `kube-system` namespace, this can be modified to a namespace of your choice. If your AKS cluster is not RBAC enabled, add `--set rbac.create=false` to the command. For more information, see the [nginx-ingress chart][nginx-ingress].

```bash
helm install stable/nginx-ingress --namespace kube-system
```

During the installation, an Azure public IP address is created for the ingress controller. To get the public IP address, use the kubectl get service command. It may take some time for the IP address to be assigned to the service.

```console
$ kubectl get service -l app=nginx-ingress --namespace kube-system

NAME                                       TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)                      AGE
eager-crab-nginx-ingress-controller        LoadBalancer   10.0.182.160   51.145.155.210  80:30920/TCP,443:30426/TCP   20m
eager-crab-nginx-ingress-default-backend   ClusterIP      10.0.255.77    <none>          80/TCP                       20m
```

Because no ingress rules have been created, if you browse to the public IP address, you are routed to the NGINX ingress controllers default 404 page.

![Default NGINX backend](media/ingress/default-back-end.png)

## Configure DNS name

Because HTTPS certificates are used, you need to configure an FQDN name for the ingress controllers IP address. For this example, an Azure FQDN is created with the Azure CLI. Update the script with the IP address of the ingress controller and the name that you would like to use in the FQDN.

```bash
#!/bin/bash

# Public IP address
IP="51.145.155.210"

# Name to associate with public IP address
DNSNAME="demo-aks-ingress"

# Get the resource-id of the public ip
PUBLICIPID=$(az network public-ip list --query "[?ipAddress!=null]|[?contains(ipAddress, '$IP')].[id]" --output tsv)

# Update public ip address with dns name
az network public-ip update --ids $PUBLICIPID --dns-name $DNSNAME
```

The ingress controller should now be accessible through the FQDN.

## Install cert-manager

The NGINX ingress controller supports TLS termination. While there are several ways to retrieve and configure certificates for HTTPS, this document demonstrates using [cert-manager][cert-manager], which provides automatic [Lets Encrypt][lets-encrypt] certificate generation and management functionality.

To install the cert-manager controller, use the following Helm install command.

```bash
helm install stable/cert-manager --set ingressShim.defaultIssuerName=letsencrypt-prod --set ingressShim.defaultIssuerKind=ClusterIssuer
```

If your cluster is not RBAC enabled, use this command.

```bash
helm install stable/cert-manager \
  --set ingressShim.defaultIssuerName=letsencrypt-prod \
  --set ingressShim.defaultIssuerKind=ClusterIssuer \
  --set rbac.create=false \
  --set serviceAccount.create=false
```

For more information on cert-manager configuration, see the [cert-manager project][cert-manager].

## Create CA cluster issuer

Before certificates can be issued, cert-manager requires an [Issuer][cert-manager-issuer] or [ClusterIssuer][cert-manager-cluster-issuer] resource. The  resources are identical in functionality however `Issuer` works in a single namespace where `ClusterIssuer` works across all namespaces. For more information, see the [cert-manager issuer][cert-manager-issuer] documentation.

Create a cluster issuer using the following manifest. Update the email address with a valid address from your organization.

```yaml
apiVersion: certmanager.k8s.io/v1alpha1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: user@contoso.com
    privateKeySecretRef:
      name: letsencrypt-prod
    http01: {}
```

## Create certificate object

Next, a certificate resource must be created. The certificate resource defines the desired X.509 certificate. For more information, see, [cert-manager certificates][cert-manager-certificates].

Create the certificate resource with the following manifest.

```yaml
apiVersion: certmanager.k8s.io/v1alpha1
kind: Certificate
metadata:
  name: tls-secret
spec:
  secretName: tls-secret
  dnsNames:
  - demo-aks-ingress.eastus.cloudapp.azure.com
  acme:
    config:
    - http01:
        ingressClass: nginx
      domains:
      - demo-aks-ingress.eastus.cloudapp.azure.com
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
```

## Run application

At this point, an ingress controller and a certificate management solution have been configured. Now run a few applications in your AKS cluster.

For this example, Helm is used to run multiple instances of a simple hello world application.

Before running the application, add the Azure samples Helm repository on your development system.

```bash
helm repo add azure-samples https://azure-samples.github.io/helm-charts/
```

Run the AKS hello world chart with the following command:

```bash
helm install azure-samples/aks-helloworld
```

Now install a second instance of the hello world application.

For the second instance, specify a new title so that the two applications are visually distinct. You also need to specify a unique service name. These configurations can be seen in the following command.

```bash
helm install azure-samples/aks-helloworld --set title="AKS Ingress Demo" --set serviceName="ingress-demo"
```

## Create ingress route

Both applications are now running on your Kubernetes cluster, however have been configured with a service of type `ClusterIP`. As such, the applications are not accessible from the internet. In order to make the available, create a Kubernetes ingress resource. The ingress resource configures the rules that route traffic to one of the two applications.

Create a file name `hello-world-ingress.yaml` and copy in the following YAML.

Take note that the traffic to the address `https://demo-aks-ingress.eastus.cloudapp.azure.com/` is routed to the service named `aks-helloworld`. Traffic to the address `https://demo-aks-ingress.eastus.cloudapp.azure.com/hello-world-two` is routed to the `ingress-demo` service.

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: hello-world-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    certmanager.k8s.io/cluster-issuer: letsencrypt-prod
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

- [Helm CLI][helm-cli]
- [NGINX ingress controller][nginx-ingress]
- [cert-manager][cert-manager]

<!-- LINKS - external -->
[helm-cli]: https://docs.microsoft.com/azure/aks/kubernetes-helm#install-helm-cli
[cert-manager]: https://github.com/jetstack/cert-manager
[cert-manager-certificates]: https://cert-manager.readthedocs.io/en/latest/reference/certificates.html
[cert-manager-cluster-issuer]: https://cert-manager.readthedocs.io/en/latest/reference/clusterissuers.html
[cert-manager-issuer]: https://cert-manager.readthedocs.io/en/latest/reference/issuers.html
[lets-encrypt]: https://letsencrypt.org/
[nginx-ingress]: https://github.com/kubernetes/ingress-nginx
