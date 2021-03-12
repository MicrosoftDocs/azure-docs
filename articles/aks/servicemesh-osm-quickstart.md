---
title: "Quickstart: Deploy an application on Azure Kubernetes Service (AKS) managed by Open Service Mesh (OSM)"
description: Deploy an application on Azure Kubernetes Service (AKS) managed by Open Service Mesh (OSM)
services: container-service
ms.topic: quickstart
ms.date: 3/17/2021
---

# Tutorial: Deploy an application on Azure Kubernetes Service (AKS) managed by Open Service Mesh (OSM)

Open Service Mesh (OSM) is a lightweight, extensible, Cloud Native service mesh that allows users to uniformly manage, secure, and get out-of-the-box observability features for highly dynamic microservice environments.

In this tutorial, you will:

> [!div class="checklist"]
>
> - View the current OSM cluster configuration
> - Create a namespace for OSM to manage deployed applications in the namespace
> - Create an ingress controller used for the multi-container appliction
> - Deploy and run a multi-container application with a web front-end and a Redis instance in the cluster in the OSM designated namespace
> - Configure the multi-container application to urn in the OSM mesh

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
  "permissive_traffic_policy_mode": "false",
  "prometheus_scraping": "true",
  "service_cert_validity_duration": "24h",
  "tracing_enable": "false",
  "use_https_ingress": "false"
}
```

Notice the **permissive_traffic_policy_mode** is configured to **true**. Permissive traffic policy mode in OSM is a mode where the [SMI](https://smi-spec.io/) traffic policy enforcement is bypassed. In this mode, OSM automatically discovers services that are a part of the service mesh and programs traffic policy rules on each Envoy proxy sidecar to be able to communicate with these services.

## Create and onbaord the namespace for the multi-container application to be managed my OSM

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
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

# Use Helm to deploy an NGINX ingress controller
helm install nginx-ingress ingress-nginx/ingress-nginx \
    --namespace ingress-basic \
    --set controller.replicaCount=2 \
    --set controller.nodeSelector."beta\.kubernetes\.io/os"=linux \
    --set defaultBackend.nodeSelector."beta\.kubernetes\.io/os"=linux \
    --set controller.admissionWebhooks.patch.nodeSelector."beta\.kubernetes\.io/os"=linux
```

## Run the application

```azurecli
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
  ports:
  - port: 6379
  selector:
    app: azure-vote-back
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
      containers:
      - name: azure-vote-front
        image: mcr.microsoft.com/azuredocs/azure-vote-front:v1
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
  selector:
    app: azure-vote-front
```
