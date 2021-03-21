---
title: "Tutorial: Deploy a multi-container application managed by Open Service Mesh (OSM) with NGINX ingress"
description: Deploy a multi-container application managed by Open Service Mesh (OSM) with NGINX ingress
services: container-service
ms.topic: quickstart
ms.date: 3/17/2021
ms.custom: mvc
---

# Tutorial: Deploy a multi-container managed by Open Service Mesh (OSM) with NGINX ingress

Open Service Mesh (OSM) is a lightweight, extensible, Cloud Native service mesh that allows users to uniformly manage, secure, and get out-of-the-box observability features for highly dynamic microservice environments.

In this tutorial, you will:

> [!div class="checklist"]
>
> - View the current OSM cluster configuration
> - Create a namespace for OSM to manage deployed applications in the namespace
> - Create a NGINX ingress controller used for the multi-container appliction
> - Deploy and run a multi-container application with a web front-end and a Redis instance in the cluster in the OSM designated namespace
> - Configure OSM Service Mesh Interface (SMI) policies to secure the multi-container application in the OSM mesh

## Before you begin

The steps detailed in this article assume that you've created an AKS cluster (Kubernetes `1.19+` and above, with Kubernetes RBAC enabled), have established a `kubectl` connection with the cluster (If you need help with any of these items, then see the [AKS quickstart](./kubernetes-walkthrough.md), and have installed the [AKS OSM add-on](./servicemesh-osm-instgll.md).

You must have the following resource installed:

- The Azure CLI, version 2.20.0 or later
- The `azure-preview` extension version 0.5.5 or later
- OSM version v0.8.0 or later

## View and verify the current OSM cluster configuration

Once the OSM add-on for AKS has been enabled on the AKS cluster, you can view the current configuration parmaters in the osm-config Kubernetes ConfigMap. Run the following command to view the ConfigMap properties:

```azurecli
kubectl get configmap -n kube-system osm-config -o json | jq '.data'
```

Output shows the current OSM configuration for the cluster.

```Output
{
  "egress": "false",
  "enable_debug_server": "false",
  "enable_privileged_init_container": "false",
  "envoy_log_level": "error",
  "permissive_traffic_policy_mode": "true",
  "prometheus_scraping": "true",
  "service_cert_validity_duration": "24h",
  "tracing_enable": "false",
  "use_https_ingress": "false"
}
```

Notice the **permissive_traffic_policy_mode** is configured to **true**. Permissive traffic policy mode in OSM is a mode where the [SMI](https://smi-spec.io/) traffic policy enforcement is bypassed. In this mode, OSM automatically discovers services that are a part of the service mesh and programs traffic policy rules on each Envoy proxy sidecar to be able to communicate with these services.

## Create and onboard the namespace for the multi-container application to be managed by OSM

OSM allows you to selectively configure namespaces to be managed by the mesh. This approach allows flexibility and control on what application will participate in the mesh at the namespace level. First create the namespace that the multi-cluster application will be deployed to.

```azurecli
kubectl create namespace azure-vote
```

```Output
namespace/azure-vote created
```

Next we will onboard the namespace to be managed by OSM

```azurecli
osm namespace add azure-vote
```

```Output
Namespace [azure-vote] successfully added to mesh [osm]
```

## Create an ingress controller in Azure Kubernetes Service (AKS)

An ingress controller is a piece of software that provides reverse proxy, configurable traffic routing, and TLS termination for Kubernetes services. Kubernetes ingress resources are used to configure the ingress rules and routes for individual Kubernetes services. Using an ingress controller and ingress rules, a single IP address can be used to route traffic to multiple services in a Kubernetes cluster.

We will utilize the ingress controller to expose the multi-container application managed by OSM to the internet. To create the ingress controller, use Helm to install nginx-ingress. For added redundancy, two replicas of the NGINX ingress controllers are deployed with the `--set controller.replicaCount` parameter. To fully benefit from running replicas of the ingress controller, make sure there's more than one node in your AKS cluster.

The ingress controller also needs to be scheduled on a Linux node. Windows Server nodes shouldn't run the ingress controller. A node selector is specified using the `--set nodeSelector` parameter to tell the Kubernetes scheduler to run the NGINX ingress controller on a Linux-based node.

```azurecli
# Create a namespace for your ingress resources
kubectl create namespace ingress-basic

# Add the ingress-nginx repository
helm repo add nginx-stable https://helm.nginx.com/stable

# Update the helm repo(s)
helm repo update

# Use Helm to deploy an NGINX ingress controller in the ingress-basic namespace
helm install nginx-ingress ingress-nginx/ingress-nginx \
    --namespace ingress-basic \
    --set controller.replicaCount=2 \
    --set controller.nodeSelector."beta\.kubernetes\.io/os"=linux \
    --set defaultBackend.nodeSelector."beta\.kubernetes\.io/os"=linux \
    --set controller.admissionWebhooks.patch.nodeSelector."beta\.kubernetes\.io/os"=linux
```

## Create service accounts for the front-end and back-end services

```Console
kubectl apply -f - <<EOF
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: azure-vote-frontend
  namespace: azure-vote
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: azure-vote-backend
  namespace: azure-vote
EOF
```

## Deploy the application

In this tutorial, you will deploy a manifest to create all objects needed to run the [Azure Vote application][azure-vote-app]. This manifest includes two [Kubernetes deployments][kubernetes-deployment]:

- The sample Azure Vote Python applications.
- A Redis instance.

Two [Kubernetes Services][kubernetes-service] are also created:

- An internal service for the Redis instance.
- An external service to access the Azure Vote application from the internet via the NGINX ingress controller.

Copy the following manifest to deploy the application to your AKS cluster:

```Console
kubectl apply -f - <<EOF
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: azure-vote-back
  namespace: azure-vote
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
      serviceAccount: azure-vote-backend
      serviceAccountName: azure-vote-backend
      containers:
      - name: azure-vote-back
        image: mcr.microsoft.com/oss/bitnami/redis:6.0.8
        env:
        - name: ALLOW_EMPTY_PASSWORD
          value: "yes"
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
  namespace: azure-vote
spec:
  selector:
    app: azure-vote-back
  ports:
  - port: 6379
    name: tcp-6379
    appProtocol: tcp
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: azure-vote-front
  namespace: azure-vote
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
      serviceAccount: azure-vote-frontend
      serviceAccountName: azure-vote-frontend
      containers:
      - name: azure-vote-front
        image: mcr.microsoft.com/azuredocs/azure-vote-front:v1
        readinessProbe:
          httpGet:
            path: /
            port: 80
            scheme: HTTP
          initialDelaySeconds: 5
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /
            port: 80
            scheme: HTTP
          initialDelaySeconds: 5
          periodSeconds: 5
        startupProbe:
          httpGet:
            path: /
            port: 80
            scheme: HTTP
          initialDelaySeconds: 5
          periodSeconds: 5
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
          value: "azure-vote-back.azure-vote-back"
---
apiVersion: v1
kind: Service
metadata:
  name: azure-vote-front
  namespace: azure-vote
spec:
  type: ClusterIP
  ports:
  - port: 80
    name: http-80
    appProtocol: http
  selector:
    app: azure-vote-front
EOF
```

Output shows the successfully created deployments and services:

```Output
deployment.apps/azure-vote-back created
service/azure-vote-back created
deployment.apps/azure-vote-front created
service/azure-vote-front created
```

## Create the Ingress resource

```Console
kubectl apply -f - <<EOF
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: azure-vote-ingress
  namespace: azure-vote
  annotations:
    kubernetes.io/ingress.class: nginx

spec:

  rules:
    - host: azure-vote.contoso.com
      http:
        paths:
        - path: /
          backend:
            serviceName: azure-vote-front
            servicePort: 80

  backend:
    serviceName: azure-vote-front
    servicePort: 80
EOF
```

Output shows the successfully created ingress resource:

```Output
Warning: extensions/v1beta1 Ingress is deprecated in v1.14+, unavailable in v1.22+; use networking.k8s.io/v1 Ingress
ingress.extensions/azure-vote-ingress created
```

## Test the application

<!-- LINKS - internal -->

[kubernetes-service]: concepts-network.md#services
