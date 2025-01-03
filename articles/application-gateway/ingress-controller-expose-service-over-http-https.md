---
title: Expose an AKS service over HTTP or HTTPS using Application Gateway
description: This article provides information on how to expose an AKS service over HTTP or HTTPS by using Application Gateway.
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 07/23/2023
ms.author: greglin
---

# Expose an AKS service over HTTP or HTTPS by using Application Gateway

This article illustrates the usage of [Kubernetes ingress resources](https://kubernetes.io/docs/concepts/services-networking/ingress/) to expose an example Azure Kubernetes Service (AKS) service through [Azure Application Gateway](https://azure.microsoft.com/services/application-gateway/) over HTTP or HTTPS.

> [!TIP]
> Consider [Application Gateway for Containers](for-containers/overview.md) for your Kubernetes ingress solution.

## Prerequisites

- An installed `ingress-azure` Helm chart:
  - [Greenfield deployment](ingress-controller-install-new.md): If you're starting from scratch, refer to these installation instructions, which outline steps to deploy an AKS cluster with Application Gateway and install the Application Gateway Ingress Controller (AGIC) on the AKS cluster.
  - [Brownfield deployment](ingress-controller-install-existing.md): If you have an existing AKS cluster and Application Gateway deployment, refer to these instructions to install AGIC on the AKS cluster.
- An x509 certificate and its private key, if you want to use HTTPS on this application.

## Deploy the guestbook application

The `guestbook` application is a canonical Kubernetes application that consists of a web UI frontend, a backend, and a Redis database.

By default, `guestbook` exposes its application through a service with the name `frontend` on port `80`. Without a Kubernetes ingress resource, the service isn't accessible from outside the AKS cluster. You use the application, and set up ingress resources to access the application, through HTTP and HTTPS.

To deploy the `guestbook` application:

1. Download `guestbook-all-in-one.yaml` from [this GitHub page](https://raw.githubusercontent.com/kubernetes/examples/master/guestbook/all-in-one/guestbook-all-in-one.yaml).
1. Deploy `guestbook-all-in-one.yaml` into your AKS cluster by running this command:

   ```bash
   kubectl apply -f guestbook-all-in-one.yaml
   ```

## Expose services over HTTP

To expose the `guestbook` application, use the following ingress resource:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: guestbook
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
spec:
  rules:
  - http:
      paths:
      - backend:
          serviceName: frontend
          servicePort: 80
```

This ingress exposes the `frontend` service of the `guestbook-all-in-one` deployment as a default backend of the Application Gateway deployment.

Save the preceding ingress resource as `ing-guestbook.yaml`:

1. Deploy `ing-guestbook.yaml` by running this command:

    ```bash
    kubectl apply -f ing-guestbook.yaml
    ```

1. Check the log of the ingress controller for the deployment status.

Now the `guestbook` application should be available. You can check the availability by visiting the public address of the Application Gateway deployment.

## Expose services over HTTPS

### Without a specified host name

If you don't specify a host name, the `guestbook` service is available on all the host names that point to the Application Gateway deployment.

1. Before you deploy the ingress resource, create a Kubernetes secret to host the certificate and private key:

    ```bash
    kubectl create secret tls <guestbook-secret-name> --key <path-to-key> --cert <path-to-cert>
    ```

1. Define the following ingress resource. In the `secretName` section, replace `<guestbook-secret-name>` with the name of your secret.

    ```yaml
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: guestbook
      annotations:
        kubernetes.io/ingress.class: azure/application-gateway
    spec:
      tls:
        - secretName: <guestbook-secret-name>
      rules:
      - http:
          paths:
          - backend:
              serviceName: frontend
              servicePort: 80
    ```

1. Store the ingress resource in a file named `ing-guestbook-tls.yaml`.

1. Deploy `ing-guestbook-tls.yaml` by running this command:

    ```bash
    kubectl apply -f ing-guestbook-tls.yaml
    ```

1. Check the log of the ingress controller for the deployment status.

Now the `guestbook` application is available on both HTTP and HTTPS.

### With a specified host name

You can also specify the host name on the ingress resource to multiplex TLS configurations and services. When you specify a host name, the `guestbook` service is available only on the specified host.

1. Define the following ingress resource. In the `secretName` section, replace `<guestbook-secret-name>` with the name of your secret. In the `hosts` and `host` sections, replace `<guestbook.contoso.com>` with your host name.

    ```yaml
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: guestbook
      annotations:
        kubernetes.io/ingress.class: azure/application-gateway
    spec:
      tls:
        - hosts:
          - <guestbook.contoso.com>
          secretName: <guestbook-secret-name>
      rules:
      - host: <guestbook.contoso.com>
        http:
          paths:
          - backend:
              serviceName: frontend
              servicePort: 80
    ```

1. Deploy `ing-guestbook-tls-sni.yaml` by running this command:

    ```bash
    kubectl apply -f ing-guestbook-tls-sni.yaml
    ```

1. Check the log of the ingress controller for the deployment status.

Now the `guestbook` application is available on both HTTP and HTTPS, only on the specified host.

## Integrate with other services

Use the following ingress resource to add paths and redirect those paths to other services:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: guestbook
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
spec:
  rules:
  - http:
      paths:
      - path: </other/*>
        backend:
          serviceName: <other-service>
          servicePort: 80
       - backend:
          serviceName: frontend
          servicePort: 80
```

## Related content

- [Application Gateway for Containers](for-containers/overview.md)
