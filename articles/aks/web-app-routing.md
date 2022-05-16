---
title: Web Application  Routing add-on on Azure Kubernetes Service (AKS) (Preview)
description: Use the Web Application  Routing add-on to securely access applications deployed on Azure Kubernetes Service (AKS).
services: container-service
author: jahabibi
ms.topic: article
ms.date: 05/13/2021
ms.author: jahabibi
---

# Web Application Routing (Preview)

The Web Application Routing solution makes it easy to access applications that are deployed to your Azure Kubernetes Service (AKS) cluster. When the solution's enabled, it configures an [Ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) in your AKS cluster, SSL termination, and Open Service Mesh (OSM) for E2E encryption of inter cluster communication. As applications are deployed, the solution also creates publicly accessible DNS names for application endpoints.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Limitations

- Web Application Routing currently doesn't support named ports in ingress backend.

## Web Application Routing solution overview
The add-on deploys four components: an [nginx ingress controller][nginx], [Secrets Store CSI Driver][csi-driver], [Open Service Mesh (OSM)][osm], and [External-DNS][external-dns] controller.

- **Nginx ingress Controller**: The ingress controller exposed to the internet.
- **External-dns**: Watches for Kubernetes Ingress resources and creates DNS A records in the cluster-specific DNS zone.
- **CSI driver**: Connector used to communicate with keyvault to retrieve SSL certificates for ingress controller.
- **OSM**: A lightweight, extensible, cloud native service mesh that allows users to uniformly manage, secure, and get out-of-the-box observability features for highly dynamic microservice environments.
- **External-DNS controller**: Watches for Kubernetes Ingress resources and creates DNS A records in the cluster-specific DNS zone.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI installed](/cli/azure/install-azure-cli).

### Install the `aks-preview` Azure CLI

You also need the *aks-preview* Azure CLI extension version 0.5.25 or later. Install the *aks-preview* Azure CLI extension by using the [az extension add][az-extension-add] command. Or install any available updates by using the [az extension update][az-extension-update] command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview
# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

### Install `osm` CLI
Since Web Application Routing uses OSM internally to secure intranet communication, we need to set up the CLI. The OSM command-line tool contains everything needed to install and configure Open Service Mesh. The binary is available on the [OSM GitHub releases page][osm-release].

## Deploy Web Application Routing: CLI

The Web Application Routing routing add-on can be enabled with the Azure CLI when deploying an AKS cluster. To do so, use the [az aks create][az-aks-create] command with the `--enable-addons` argument.

```azurecli
az aks create --resource-group myResourceGroup --name myAKSCluster --enable-addons web_application_routing 
```

> [!TIP]
> If you want to enable multiple add-ons, provide them as a comma-separated list. For example, to enable Web Application Routing routing and monitoring, use the format `--enable-addons web_application_routing,monitoring`.

You can also enable Web Application Routing on an existing AKS cluster using the [az aks enable-addons][az-aks-enable-addons] command. To enable Web Application  Routing on an existing cluster, add the `--addons` parameter and specify *web_application_routing* as shown in the following example:

```azurecli
az aks enable-addons --resource-group myResourceGroup --name myAKSCluster --addons web_application_routing 
```

After the cluster is deployed or updated, use the [az aks show][az-aks-show] command to retrieve the DNS zone name.

## Connect to your AKS cluster

To connect to the Kubernetes cluster from your local computer, you use [kubectl][kubectl], the Kubernetes command-line client.

If you use the Azure Cloud Shell, `kubectl` is already installed. You can also install it locally using the [az aks install-cli][] command:

```azurecli
az aks install-cli
```

To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials][] command. The following example gets credentials for the AKS cluster named *MyAKSCluster* in the *MyResourceGroup*:

```azurecli
az aks get-credentials --resource-group MyResourceGroup --name MyAKSCluster
```

## Create Application Namespace

For the sample application environment, let's first create a namespace called `hello-web-app-routing` to run the example pods:

```bash
kubectl create namespace hello-web-app-routing
```

## Add Application Namespace to OSM Control Plane

```bash
osm namespace add hello-web-app-routing
```

## Grant permissions for Web Application Routing

Identify the Web Application Routing-associated managed identity within the cluster resource group `webapprouting-<MY_CLUSTER_NAME>`. In this walkthrough, the identity is named `webapprouting-myakscluster`.

:::image type="content" source="media/web-app-routing/identify-msi-web-app-routing.png" alt-text="Cluster resource group in the Azure portal is shown, and the webapprouting-myakscluster user-assigned managed identity is highlighted." lightbox="media/web-app-routing/identify-msi-web-app-routing.png":::

Copy the identity's object ID:

:::image type="content" source="media/web-app-routing/msi-web-app-object-id.png" alt-text="The webapprouting-myakscluster managed identity screen in Azure portal, the identity's object ID is highlighted. " lightbox="media/web-app-routing/msi-web-app-object-id.png":::

### Grant Access to Keyvault

Grant `GET` permissions for Web Application Routing to retrieve certificates from Azure Key Vault:

```azurecli
az keyvault set-policy --name myapp-contoso --object-id <WEB_APP_ROUTING_MSI_OBJECT_ID>  --secret-permissions get --certificate-permissions get
```

## Use Web Application Routing

The Web Application Routing solution may only be triggered on service resources that are annotated as follows:

```yaml
annotations:
  kubernetes.azure.com/ingress-host: myapp.contoso.com
  kubernetes.azure.com/tls-cert-keyvault-uri: myapp-contoso.vault.azure.net
```

These annotations in the service manifest would direct Web Application Routing to create an ingress servicing `myapp.contoso.com` connected to the keyvault `myapp-contoso`.

Create a file named **samples-web-app-routing.yaml** and copy in the following YAML. On line 29-31, update `<MY_HOSTNAME>` and `<MY_KEYVAULT_URI>` with the DNS zone name collected in the previous step of this article.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aks-helloworld  
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
---
apiVersion: v1
kind: Service
metadata:
  name: aks-helloworld
annotations:
  kubernetes.azure.com/ingress-host: <MY_HOSTNAME>
  kubernetes.azure.com/tls-cert-keyvault-uri: <MY_KEYVAULT_URI>
spec:
  type: ClusterIP
  ports:
  - port: 80
  selector:
    app: aks-helloworld
```

Use the [kubectl apply][kubectl-apply] command to create the resources.

```bash
kubectl apply -f samples-web-app-routing.yaml -n hello-web-app-routing
```

The following example shows the created resources:

```bash
$ kubectl apply -f samples-web-app-routing.yaml -n hello-web-app-routing

deployment.apps/aks-helloworld created
service/aks-helloworld created
```

## Verify managed ingress created
```bash
$ kubectl get ingress -n hello-web-app-routing -n hello-web-app-routing
```

Open a web browser to *<MY_HOSTNAME>*, for example *myapp.contoso.com* and verify you see the demo application. The application may take a few minutes to appear.

## Remove Web Application Routing
```console
kubectl delete namespace hello-web-app-routing
```

The Web Application Routing solution can be removed using the Azure CLI. To do so run the following command, substituting your AKS cluster and resource group name.

```azurecli
az aks disable-addons --addons web_application_routing  --name myAKSCluster --resource-group myResourceGroup --no-wait
```

When the Web Application Routing routing add-on is disabled, some Kubernetes resources may remain in the cluster. These resources include *configMaps* and *secrets*, and are created in the *app-routing-system* namespace. To maintain a clean cluster, you may want to remove these resources.

Look for *addon-web-application-routing* resources using the following [kubectl get][kubectl-get] commands:


## Clean up

Remove the associated Kubernetes objects created in this article using `kubectl delete`.

```bash
kubectl delete -f samples-web-app-routing.yaml
```

The example output shows Kubernetes objects have been removed.

```bash
$ kubectl delete -f samples-web-app-routing.yaml

deployment "aks-helloworld" deleted
service "aks-helloworld" deleted
```

<!-- LINKS - internal -->
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-show]: /cli/azure/aks#az-aks-show
[ingress-https]: ./ingress-tls.md
[az-aks-enable-addons]: /cli/azure/aks#az-aks-enable-addons
[az aks install-cli]: /cli/azure/aks#az-aks-install-cli
[az aks get-credentials]: /cli/azure/aks#az-aks-get-credentials
[csi-driver]: https://github.com/Azure/secrets-store-csi-driver-provider-azure
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update

<!-- LINKS - external -->
[osm-release]: https://github.com/openservicemesh/osm/releases/
[nginx]: https://kubernetes.github.io/ingress-nginx/
[osm]: https://openservicemesh.io/
[external-dns]: https://github.com/kubernetes-incubator/external-dns
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl-logs]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs
[ingress]: https://kubernetes.io/docs/concepts/services-networking/ingress/
[ingress-resource]: https://kubernetes.io/docs/concepts/services-networking/ingress/#the-ingress-resource