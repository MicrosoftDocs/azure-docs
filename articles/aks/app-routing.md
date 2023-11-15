---
title: Azure Kubernetes Service (AKS) managed nginx Ingress with the application routing add-on 
description: Use the application routing add-on to securely access applications deployed on Azure Kubernetes Service (AKS).
ms.subservice: aks-networking
ms.custom: devx-track-azurecli
author: asudbring
ms.topic: how-to
ms.date: 11/03/2023
ms.author: allensu
---

# Managed nginx Ingress with the application routing add-on 

One way to route Hypertext Transfer Protocol (HTTP) and secure (HTTPS) traffic to applications running on an Azure Kubernetes Service (AKS) cluster is to use the [Kubernetes Ingress object][kubernetes-ingress-object-overview]. When you create an Ingress object that uses the application routing add-on nginx Ingress classes, the add-on creates, configures, and manages one or more Ingress controllers in your AKS cluster.

This article shows you how to deploy and configure a basic Ingress controller in your AKS cluster.

## Application routing add-on with nginx features

The application routing add-on with nginx delivers the following:

* Easy configuration of managed nginx Ingress controllers based on [Kubernetes nginx Ingress controller][kubernetes-nginx-ingress].
* Integration with [Azure DNS][azure-dns-overview] for public and private zone management
* SSL termination with certificates stored in Azure Key Vault.

For additional configuration information related to SSL encryption and DNS integration, review the [application routing add-on configuration][custom-ingress-configurations].

With the retirement of [Open Service Mesh][open-service-mesh-docs] (OSM) by the Cloud Native Computing Foundation (CNCF), using the application routing add-on is the default method for all AKS clusters.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- Azure CLI version 2.54.0 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
- `aks-preview` Azure CLI extension of version 0.5.171 or later installed

## Limitations

- The application routing add-on supports up to five Azure DNS zones.
- All public Azure DNS zones integrated with the add-on have to be in the same resource group.
- All private Azure DNS zones integrated with the add-on have to be in the same resource group.
- Editing any resources in the `app-routing-system` namespace, including the Ingress-nginx ConfigMap isn't supported.
- Snippet annotations on the Ingress resources through `nginx.ingress.kubernetes.io/configuration-snippet` aren't supported.

## Enable application routing using Azure CLI

# [Default](#tab/default)

### Enable on a new cluster

To enable application routing on a new cluster, use the [`az aks create`][az-aks-create] command, specifying the `--enable-app-routing` flag.

```azurecli-interactive
az aks create -g <ResourceGroupName> -n <ClusterName> -l <Location> --enable-app-routing
```

### Enable on an existing cluster

To enable application routing on an existing cluster, use the [`az aks approuting enable`][az-aks-approuting-enable] command.

```azurecli-interactive
az aks approuting enable -g <ResourceGroupName> -n <ClusterName>
```

# [Open Service Mesh (OSM) (retired)](#tab/with-osm)

>[!NOTE]
>Open Service Mesh (OSM) has been retired by the CNCF. Creating Ingresses using the application routing add-on with OSM integration is not recommended and will be retired.

The following add-ons are required to support this configuration:

* **open-service-mesh**:  If you require encrypted intra cluster traffic (recommended) between the nginx Ingress and your services, the Open Service Mesh add-on is required which provides mutual TLS (mTLS).

### Enable on a new cluster

Enable application routing on a new AKS cluster using the [`az aks create`][az-aks-create] command specifying the `--enable-app-routing` flag and the `--enable-addons` parameter with the `open-service-mesh` add-on:

```azurecli-interactive
az aks create -g <ResourceGroupName> -n <ClusterName> -l <Location> --enable-app-routing --enable-addons open-service-mesh 
```

### Enable on an existing cluster

To enable application routing on an existing cluster, use the [`az aks approuting enable`][az-aks-approuting-enable] command and the [`az aks enable-addons`][az-aks-enable-addons] command with the `--addons` parameter set to `open-service-mesh`:

```azurecli-interactive
az aks approuting enable -g <ResourceGroupName> -n <ClusterName>
az aks enable-addons -g <ResourceGroupName> -n <ClusterName> --addons open-service-mesh
```

> [!NOTE]
> To use the add-on with Open Service Mesh, you should install the `osm` command-line tool. This command-line tool contains everything needed to configure and manage Open Service Mesh. The latest binaries are available on the [OSM GitHub releases page][osm-release].

# [Service annotations (retired)](#tab/service-annotations)

> [!WARNING]
> Configuring Ingresses by adding annotations on the Service object is retired. Please consider [configuring using an Ingress object](?tabs=default).

### Enable on a new cluster

To enable application routing on a new cluster, use the [`az aks create`][az-aks-create] command, specifying `--enable-app-routing` flag.

```azurecli-interactive
az aks create -g <ResourceGroupName> -n <ClusterName> -l <Location> --enable-app-routing
```

### Enable on an existing cluster

Enable application routing on an existing cluster,  use the [`az aks approuting enable`][az-aks-approuting-enable] command:

```azurecli-interactive
az aks approuting enable -g <ResourceGroupName> -n <ClusterName>
```

---

## Connect to your AKS cluster

To connect to the Kubernetes cluster from your local computer, you use [kubectl][kubectl], the Kubernetes command-line client. You can install it locally using the [`az aks install-cli`][az-aks-install-cli] command. If you use the Azure Cloud Shell, `kubectl` is already installed.

Configure `kubectl` to connect to your Kubernetes cluster using the [az aks get-credentials][az-aks-get-credentials] command.

```azurecli-interactive
az aks get-credentials -g <ResourceGroupName> -n <ClusterName>
```

## Deploy an application

The application routing add-on uses annotations on Kubernetes Ingress objects to create the appropriate resources.

# [Application routing add-on](#tab/deploy-app-default)

1. Create the application namespace called `hello-web-app-routing` to run the example pods using the `kubectl create namespace` command.

    ```bash
    kubectl create namespace hello-web-app-routing
    ```

2. Create the deployment by copying the following YAML manifest into a new file named **deployment.yaml** and save the file to your local computer.

    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: aks-helloworld  
      namespace: hello-web-app-routing
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: aks-helloworld
      template:
        metadata:
          labels:
            app: aks-helloworld
        spec:
          containers:
          - name: aks-helloworld
            image: mcr.microsoft.com/azuredocs/aks-helloworld:v1
            ports:
            - containerPort: 80
            env:
            - name: TITLE
              value: "Welcome to Azure Kubernetes Service (AKS)"
    ```

3. Create the service by copying the following YAML manifest into a new file named **service.yaml** and save the file to your local computer.

    ```yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: aks-helloworld
      namespace: hello-web-app-routing
    spec:
      type: ClusterIP
      ports:
      - port: 80
      selector:
        app: aks-helloworld
    ```

### Create the Ingress

The application routing add-on creates an Ingress class on the cluster named *webapprouting.kubernetes.azure.com*. When you create an Ingress object with this class, it activates the add-on.  

1. Copy the following YAML manifest into a new file named **ingress.yaml** and save the file to your local computer.

    ```yaml
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: aks-helloworld
      namespace: hello-web-app-routing
    spec:
      ingressClassName: webapprouting.kubernetes.azure.com
      rules:
     - host: <Hostname>
       http:
          paths:
          - backend:
              service:
                name: aks-helloworld
                port:
                  number: 80
            path: /
            pathType: Prefix
    ```

2. Create the cluster resources using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f deployment.yaml -n hello-web-app-routing
    ```

    The following example output shows the created resource:

    ```output
    deployment.apps/aks-helloworld created
    ```

   ```bash
    kubectl apply -f service.yaml -n hello-web-app-routing
    ```

    The following example output shows the created resource:

    ```output
    service/aks-helloworld created
    ```

    ```bash
    kubectl apply -f ingress.yaml -n hello-web-app-routing
    ```

    The following example output shows the created resource:

    ```output
    ingress.networking.k8s.io/aks-helloworld created
    ```

# [Open Service Mesh (retired)](#tab/deploy-app-osm)

1. Create a namespace called `hello-web-app-routing` to run the exmaple pods using the `kubectl create namespace` command.

    ```bash
    kubectl create namespace hello-web-app-routing
    ```

2. Add the application namespace to the OSM control plane using the `osm namespace add` command.

    ```bash
    osm namespace add hello-web-app-routing
    ```

3. Create the deployment by copying the following YAML manifest into a new file named **deployment.yaml** and save the file to your local computer.

    ```yml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: aks-helloworld  
      namespace: hello-web-app-routing
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: aks-helloworld
      template:
        metadata:
          labels:
            app: aks-helloworld
        spec:
          containers:
          - name: aks-helloworld
            image: mcr.microsoft.com/azuredocs/aks-helloworld:v1
            ports:
            - containerPort: 80
            env:
            - name: TITLE
              value: "Welcome to Azure Kubernetes Service (AKS)"
    ```

4. Create the service by copying the following YAML manifest into a new file named **service.yaml** and save the file to your local computer.

    ```yml
    apiVersion: v1
    kind: Service
    metadata:
      name: aks-helloworld
      namespace: hello-web-app-routing
    spec:
      type: ClusterIP
      ports:
      - port: 80
      selector:
        app: aks-helloworld
    ```

### Create the Ingress

The application routing add-on creates an Ingress class on the cluster called *webapprouting.kubernetes.azure.com*. When you create an Ingress object with this class, it activates the add-on. The `kubernetes.azure.com/use-osm-mtls: "true"` annotation on the Ingress object creates an Open Service Mesh (OSM) [IngressBackend][ingress-backend] to configure a backend service to accept Ingress traffic from trusted sources.

1. Copy the following YAML manifest into a new file named **ingress.yaml** and save the file to your local computer.

    ```yml
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      annotations:
        kubernetes.azure.com/use-osm-mtls: "true"
        nginx.ingress.kubernetes.io/backend-protocol: HTTPS
        nginx.ingress.kubernetes.io/configuration-snippet: |2-
          proxy_ssl_name "default.hello-web-app-routing.cluster.local";
        nginx.ingress.kubernetes.io/proxy-ssl-secret: kube-system/osm-ingress-client-cert
        nginx.ingress.kubernetes.io/proxy-ssl-verify: "on"
      name: aks-helloworld
      namespace: hello-web-app-routing
    spec:
      ingressClassName: webapprouting.kubernetes.azure.com
      rules:
     - host: <Hostname>
       http:
          paths:
          - backend:
              service:
                name: aks-helloworld
                port:
                  number: 80
            path: /
            pathType: Prefix
    ```

1. Create the cluster resources using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f deployment.yaml -n hello-web-app-routing
    ```

    The following example output shows the created resource:

    ```output
    deployment.apps/aks-helloworld created
    ```

   ```bash
    kubectl apply -f service.yaml -n hello-web-app-routing
    ```

    The following example output shows the created resource:

    ```output
    service/aks-helloworld created
    ```

    ```bash
    kubectl apply -f ingress.yaml -n hello-web-app-routing
    ```

    The following example output shows the created resource:

    ```output
    ingress.networking.k8s.io/aks-helloworld created
    ```

# [Service annotations (retired)](#tab/deploy-app-service-annotations)

> [!WARNING]
> Configuring Ingresses by adding annotations on the Service object is retired. Please consider [configuring using an Ingress object](?tabs=default).

### Create application namespace

1. Create a namespace called `hello-web-app-routing` to run the exmaple pods using the `kubectl create namespace` command.

    ```bash
    kubectl create namespace hello-web-app-routing
    ```

2. Add the application namespace to the OSM control plane using the `osm namespace add` command.

    ```bash
    osm namespace add hello-web-app-routing
    ```

3. Create the deployment by copying the following YAML manifest into a new file named **deployment.yaml** and save the file to your local computer.

    ```yml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: aks-helloworld  
      namespace: hello-web-app-routing
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: aks-helloworld
      template:
        metadata:
          labels:
            app: aks-helloworld
        spec:
          containers:
          - name: aks-helloworld
            image: mcr.microsoft.com/azuredocs/aks-helloworld:v1
            ports:
            - containerPort: 80
            env:
            - name: TITLE
              value: "Welcome to Azure Kubernetes Service (AKS)"
    ```

4. Create the service by copying the following YAML manifest into a new file named **service.yaml** and save the file to your local computer.

    ```yml
    apiVersion: v1
    kind: Service
    metadata:
      name: aks-helloworld
      namespace: hello-web-app-routing
    spec:
      type: ClusterIP
      ports:
      - port: 80
      selector:
        app: aks-helloworld
    ```

5. Create the cluster resources using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f deployment.yaml -n hello-web-app-routing
    ```

    The following example output shows the created resource:

    ```output
    deployment.apps/aks-helloworld created
    ```

   ```bash
    kubectl apply -f service.yaml -n hello-web-app-routing
    ```

    The following example output shows the created resource:

    ```output
    service/aks-helloworld created
    ```

---

## Verify the managed Ingress was created

You can verify the managed Ingress was created using the `kubectl get ingress` command.

```bash
kubectl get ingress -n hello-web-app-routing
```

The following example output shows the created managed Ingress:

```output
NAME             CLASS                                HOSTS               ADDRESS       PORTS     AGE
aks-helloworld   webapprouting.kubernetes.azure.com   myapp.contoso.com   20.51.92.19   80, 443   4m
```

## Remove the application routing add-on

To remove the associated namespace, use the `kubectl delete namespace` command.

```bash
kubectl delete namespace hello-web-app-routing
```

To remove the application routing add-on from your cluster, use the [`az aks approuting disable`][az-aks-approuting-disable] command.

```azurecli-interactive
az aks approuting disable --name myAKSCluster --resource-group myResourceGroup 
```

When the application routing add-on is disabled, some Kubernetes resources might remain in the cluster. These resources include *configMaps* and *secrets* and are created in the *app-routing-system* namespace. You can remove these resources if you want.

## Next steps

* [Configure custom ingress configurations][custom-ingress-configurations] shows how to create Ingresses with a private load balancer, configure SSL certificate integration with Azure Key Vault, and DNS management with Azure DNS.

* Learn about monitoring the ingress-nginx controller metrics included with the application routing add-on with [with Prometheus in Grafana][prometheus-in-grafana] (preview) as part of analyzing the performance and usage of your application.

<!-- LINKS - internal -->
[azure-dns-overview]: ../dns/dns-overview.md
[az-aks-approuting-enable]: /cli/azure/aks/approuting#az-aks-approuting-enable
[az-aks-approuting-disable]: /cli/azure/aks/approuting#az-aks-approuting-disable
[az-aks-enable-addons]: /cli/azure/aks#az-aks-enable-addons
[az-aks-disable-addons]: /cli/azure/aks#az-aks-disable-addons
[az-aks-install-cli]: /cli/azure/aks#az-aks-install-cli
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[install-azure-cli]: /cli/azure/install-azure-cli
[custom-ingress-configurations]: app-routing-dns-ssl.md
[az-aks-create]: /cli/azure/aks#az-aks-create
[prometheus-in-grafana]: app-routing-nginx-prometheus.md

<!-- LINKS - external -->
[kubernetes-ingress-object-overview]: https://kubernetes.io/docs/concepts/services-networking/ingress/
[osm-release]: https://github.com/openservicemesh/osm
[open-service-mesh-docs]: https://release-v1-2.docs.openservicemesh.io/
[kubernetes-nginx-ingress]: https://kubernetes.github.io/ingress-nginx/
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[ingress-backend]: https://release-v1-2.docs.openservicemesh.io/docs/guides/traffic_management/ingress/#ingressbackend-api
