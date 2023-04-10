---
title: Web Application Routing add-on on Azure Kubernetes Service (AKS) (Preview)
description: Use the Web Application Routing add-on to securely access applications deployed on Azure Kubernetes Service (AKS).
ms.subservice: aks-networking
ms.custom: devx-track-azurecli
author: sabbour
ms.topic: how-to
ms.date: 05/13/2021
ms.author: asabbour
---

# Web Application Routing (Preview)

The Web Application Routing add-on configures an [Ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) in your Azure Kubernetes Service (AKS) cluster with SSL termination through certificates stored in Azure Key Vault. Optionally, it also integrates with Open Service Mesh (OSM) for end-to-end encryption of inter cluster communication using mutual TLS (mTLS). When you deploy ingresses, the add-on creates publicly accessible DNS names for endpoints on an Azure DNS zone.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Web Application Routing add-on overview

The add-on deploys the following components:

- **[nginx ingress controller][nginx]**: The ingress controller exposed to the internet.
- **[external-dns controller][external-dns]**: Watches for Kubernetes Ingress resources and creates DNS A records in the cluster-specific DNS zone. This controller is only deployed when you pass in the `--dns-zone-resource-id` argument.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- [Azure CLI installed](/cli/azure/install-azure-cli).
- An Azure Key Vault to store certificates.
- A DNS solution, such as [Azure DNS](../dns/dns-getstarted-portal.md).

### Install the `aks-preview` Azure CLI extension

You also need the *aks-preview* Azure CLI extension version `0.5.75` or later. Install the *aks-preview* Azure CLI extension by using the [az extension add][az-extension-add] command. Or install any available updates by using the [az extension update][az-extension-update] command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

### Create and export a self-signed SSL certificate (if you don't already own one)

If you already have an SSL certificate, you can skip this step, otherwise you can use these commands to create a self-signed SSL certificate to use with the Ingress. You need to replace *`<Hostname>`* with the DNS name that you are using.

```bash
# Create a self-signed SSL certificate
openssl req -new -x509 -nodes -out aks-ingress-tls.crt -keyout aks-ingress-tls.key -subj "/CN=<Hostname>" -addext "subjectAltName=DNS:<Hostname>"

# Export the SSL certificate, skipping the password prompt
openssl pkcs12 -export -in aks-ingress-tls.crt -inkey aks-ingress-tls.key -out aks-ingress-tls.pfx
```

### Create an Azure Key Vault to store the certificate

If you don't already have an Azure Key Vault, use this command to create one. Azure Key Vault is used to securely store the SSL certificates that will be loaded into the Ingress.

```azurecli-interactive
az keyvault create -g <ResourceGroupName> -l <Location> -n <KeyVaultName>
```

### Import certificate to Azure Key Vault

Import the SSL certificate into Azure Key Vault.

```azurecli-interactive
az keyvault certificate import --vault-name <KeyVaultName> -n <KeyVaultCertificateName> -f aks-ingress-tls.pfx
```

### Create an Azure DNS zone

If you want the add-on to automatically manage creating hostnames via Azure DNS, you need to [create an Azure DNS zone](../dns/dns-getstarted-cli.md) if you don't have one already.

```azurecli-interactive
# Create a DNS zone
az network dns zone create -g <ResourceGroupName> -n <ZoneName>
```
 
## Enable Web Application Routing via the Azure CLI 

The Web Application Routing routing add-on can be enabled with the Azure CLI when deploying an AKS cluster. To do so, use the `[az aks create][az-aks-create]` command with the `--enable-addons` argument. You can also enable Web Application Routing on an existing AKS cluster using the `[az aks enable-addons][az-aks-enable-addons]` command. 

# [Without Open Service Mesh (OSM)](#tab/without-osm)

The following extra add-on is required:
* **azure-keyvault-secrets-provider**: The Secret Store CSI provider for Azure Key Vault is required to retrieve the certificates from Azure Key Vault.

> [!IMPORTANT]
> To enable the add-on to reload certificates from Azure Key Vault when they change, you should to enable the [secret autorotation feature](./csi-secrets-store-driver.md#enable-and-disable-autorotation) of the Secret Store CSI driver with the `--enable-secret-rotation` argument. When the autorotation is enabled, the driver updates the pod mount and the Kubernetes secret by polling for changes periodically, based on the rotation poll interval you can define. The default rotation poll interval is 2 minutes.

```azurecli-interactive
az aks create -g <ResourceGroupName> -n <ClusterName> -l <Location> --enable-addons azure-keyvault-secrets-provider,web_application_routing --generate-ssh-keys --enable-secret-rotation
```

To enable Web Application  Routing on an existing cluster, add the `--addons` parameter and specify *web_application_routing* as shown in the following example:

```azurecli-interactive
az aks enable-addons -g <ResourceGroupName> -n <ClusterName> --addons azure-keyvault-secrets-provider,web_application_routing --enable-secret-rotation
```

# [With Open Service Mesh (OSM)](#tab/with-osm)

The following extra add-ons are required:
* **azure-keyvault-secrets-provider**: The Secret Store CSI provider for Azure Key Vault is required to retrieve the certificates from Azure Key Vault.
* **open-service-mesh**:  If you require encrypted intra cluster traffic (recommended) between the nginx ingress and your services, the Open Service Mesh add-on is required which provides mutual TLS (mTLS).

> [!IMPORTANT]
> To enable the add-on to reload certificates from Azure Key Vault when they change, you should to enable the [secret autorotation feature](./csi-secrets-store-driver.md#enable-and-disable-autorotation) of the Secret Store CSI driver with the `--enable-secret-rotation` argument. When the autorotation is enabled, the driver updates the pod mount and the Kubernetes secret by polling for changes periodically, based on the rotation poll interval you can define. The default rotation poll interval is 2 minutes.

```azurecli-interactive
az aks create -g <ResourceGroupName> -n <ClusterName> -l <Location> --enable-addons azure-keyvault-secrets-provider,open-service-mesh,web_application_routing --generate-ssh-keys --enable-secret-rotation
```

To enable Web Application  Routing on an existing cluster, add the `--addons` parameter and specify *web_application_routing* as shown in the following example:

```azurecli-interactive
az aks enable-addons -g <ResourceGroupName> -n <ClusterName> --addons azure-keyvault-secrets-provider,open-service-mesh,web_application_routing --enable-secret-rotation
```

> [!NOTE]
> To use the add-on with Open Service Mesh, you should install the `osm` command-line tool. This command-line tool contains everything needed to configure and manage Open Service Mesh. The latest binaries are available on the [OSM GitHub releases page][osm-release].

# [With service annotations (retired)](#tab/service-annotations)

> [!WARNING]
> Configuring ingresses by adding annotations on the Service object is retired. Please consider [configuring via an Ingress object](?tabs=without-osm).

The following extra add-on is required:
* **azure-keyvault-secrets-provider**: The Secret Store CSI provider for Azure Key Vault is required to retrieve the certificates from Azure Key Vault.

> [!IMPORTANT]
> To enable the add-on to reload certificates from Azure Key Vault when they change, you should to enable the [secret autorotation feature](./csi-secrets-store-driver.md#enable-and-disable-autorotation) of the Secret Store CSI driver with the `--enable-secret-rotation` argument. When the autorotation is enabled, the driver updates the pod mount and the Kubernetes secret by polling for changes periodically, based on the rotation poll interval you can define. The default rotation poll interval is 2 minutes.

```azurecli-interactive
az aks create -g <ResourceGroupName> -n <ClusterName> -l <Location> --enable-addons azure-keyvault-secrets-provider,web_application_routing --generate-ssh-keys --enable-secret-rotation
```

To enable Web Application  Routing on an existing cluster, add the `--addons` parameter and specify *web_application_routing* as shown in the following example:

```azurecli-interactive
az aks enable-addons -g <ResourceGroupName> -n <ClusterName> --addons azure-keyvault-secrets-provider,web_application_routing --enable-secret-rotation
```

---

## Retrieve the add-on's managed identity object ID

Retrieve user managed identity object ID for the add-on. This identity is used in the next steps to grant permissions to manage the Azure DNS zone and retrieve certificates from the Azure Key Vault. Provide your *`<ResourceGroupName>`*, *`<ClusterName>`*, and *`<Location>`* in the script to retrieve the managed identity's object ID.

```azurecli-interactive
# Provide values for your environment
RGNAME=<ResourceGroupName>
CLUSTERNAME=<ClusterName>
LOCATION=<Location>

# Retrieve user managed identity object ID for the add-on
SUBSCRIPTION_ID=$(az account show --query id --output tsv)
MANAGEDIDENTITYNAME="webapprouting-${CLUSTERNAME}"
MCRGNAME=$(az aks show -g ${RGNAME} -n ${CLUSTERNAME} --query nodeResourceGroup -o tsv)
USERMANAGEDIDENTITY_RESOURCEID="/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${MCRGNAME}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/${MANAGEDIDENTITYNAME}"
MANAGEDIDENTITY_OBJECTID=$(az resource show --id $USERMANAGEDIDENTITY_RESOURCEID --query "properties.principalId" -o tsv | tr -d '[:space:]')
```

## Configure the add-on to use Azure DNS to manage creating DNS zones

If you're going to use Azure DNS, update the add-on to pass in the `--dns-zone-resource-id`.

Retrieve the resource ID for the DNS zone.

```azurecli-interactive
ZONEID=$(az network dns zone show -g <ResourceGroupName> -n <ZoneName> --query "id" --output tsv)
```

Grant **DNS Zone Contributor** permissions on the DNS zone to the add-on's managed identity.

```azurecli-interactive
az role assignment create --role "DNS Zone Contributor" --assignee $MANAGEDIDENTITY_OBJECTID --scope $ZONEID
```

Update the add-on to enable the integration with Azure DNS. This command installs the **external-dns** controller.

```azurecli-interactive
az aks addon update -g <ResourceGroupName> -n <ClusterName> --addon web_application_routing --dns-zone-resource-id=$ZONEID
```



## Grant the add-on permissions to retrieve certificates from Azure Key Vault
The Web Application Routing add-on creates a user created managed identity in the cluster resource group. This managed identity needs to be granted permissions to retrieve SSL certificates from the Azure Key Vault. 

Grant `GET` permissions for the Web Application Routing add-on to retrieve certificates from Azure Key Vault:
```azurecli-interactive
az keyvault set-policy --name <KeyVaultName> --object-id $MANAGEDIDENTITY_OBJECTID --secret-permissions get --certificate-permissions get
```

## Connect to your AKS cluster

To connect to the Kubernetes cluster from your local computer, you use [kubectl][kubectl], the Kubernetes command-line client.

If you use the Azure Cloud Shell, `kubectl` is already installed. You can also install it locally using the `az aks install-cli` command:

```azurecli-interactive
az aks install-cli
```

To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials][az-aks-get-credentials] command.

```azurecli-interactive
az aks get-credentials -g <ResourceGroupName> -n <ClusterName>
```
## Deploy an application

Web Application Routing uses annotations on Kubernetes Ingress objects to create the appropriate resources, create records on Azure DNS (when configured), and retrieve the SSL certificates from Azure Key Vault.
# [Without Open Service Mesh (OSM)](#tab/without-osm)

### Create the application namespace

For the sample application environment, let's first create a namespace called `hello-web-app-routing` to run the example pods:

```bash
kubectl create namespace hello-web-app-routing
```

### Create the deployment

Create a file named **deployment.yaml** and copy in the following YAML.

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

### Create the service

Create a file named **service.yaml** and copy in the following YAML.

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

### Create the ingress

The Web Application Routing add-on creates an Ingress class on the cluster called `webapprouting.kubernetes.azure.com `. When you create an ingress object with this class, this activates the add-on. To obtain the certificate URI to use in the Ingress from Azure Key Vault, run the following command.

```azurecli-interactive
az keyvault certificate show --vault-name <KeyVaultName> -n <KeyVaultCertificateName> --query "id" --output tsv
```

Create a file named **ingress.yaml** and copy in the following YAML. 

> [!NOTE]
> Update *`<Hostname>`* with your DNS host name and *`<KeyVaultCertificateUri>`* with the ID returned from Azure Key Vault. `secretName` is the name of the secret that going to be generated to store the certificate. This is the certificate that's going to be presented in the browser.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    kubernetes.azure.com/tls-cert-keyvault-uri: <KeyVaultCertificateUri>
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
  tls:
  - hosts:
    - <Hostname>
    secretName: keyvault-aks-helloworld
```

### Create the resources on the cluster

Use the [kubectl apply][kubectl-apply] command to create the resources.

```bash
kubectl apply -f deployment.yaml -n hello-web-app-routing
kubectl apply -f service.yaml -n hello-web-app-routing
kubectl apply -f ingress.yaml -n hello-web-app-routing
```

The following example output shows the created resources:

```bash
deployment.apps/aks-helloworld created
service/aks-helloworld created
ingress.networking.k8s.io/aks-helloworld created
```


# [With Open Service Mesh (OSM)](#tab/with-osm)

### Create the application namespace

For the sample application environment, let's first create a namespace called `hello-web-app-routing` to run the example pods:

```bash
kubectl create namespace hello-web-app-routing
```

We also need to add the application namespace to the OSM control plane:

```bash
osm namespace add hello-web-app-routing
```

### Create the deployment

Create a file named **deployment.yaml** and copy in the following YAML.

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

### Create the service

Create a file named **service.yaml** and copy in the following YAML.

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

### Create the ingress

The Web Application Routing add-on creates an Ingress class on the cluster called `webapprouting.kubernetes.azure.com `. When you create an ingress object with this class, this activates the add-on. The `kubernetes.azure.com/use-osm-mtls: "true"` annotation on the Ingress object creates an Open Service Mesh (OSM) [IngressBackend](https://release-v1-2.docs.openservicemesh.io/docs/guides/traffic_management/ingress/#ingressbackend-api) to configure a backend service to accept ingress traffic from trusted sources. OSM issues a certificate that Nginx will use as the client certificate to proxy HTTPS connections to TLS backends. The client certificate and CA certificate are stored in a Kubernetes secret that Nginx will use to authenticate service mesh backends. For more information, see [Open Service Mesh: Ingress with Kubernetes Nginx Ingress Controller](https://release-v1-2.docs.openservicemesh.io/docs/demos/ingress_k8s_nginx/). To obtain the certificate URI to use in the Ingress from Azure Key Vault, run the following command.

```azurecli-interactive
az keyvault certificate show --vault-name <KeyVaultName> -n <KeyVaultCertificateName> --query "id" --output tsv
```

Create a file named **ingress.yaml** and copy in the following YAML.

> [!NOTE]
> Update *`<Hostname>`* with your DNS host name and *`<KeyVaultCertificateUri>`* with the ID returned from Azure Key Vault. `secretName` is the name of the secret that going to be generated to store the certificate. This is the certificate that's going to be presented in the browser.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    kubernetes.azure.com/tls-cert-keyvault-uri: <KeyVaultCertificateUri>
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
  tls:
  - hosts:
    - <Hostname>
    secretName: keyvault-aks-helloworld
```

### Create the resources on the cluster

Use the [kubectl apply][kubectl-apply] command to create the resources.

```bash
kubectl apply -f deployment.yaml -n hello-web-app-routing
kubectl apply -f service.yaml -n hello-web-app-routing
kubectl apply -f ingress.yaml -n hello-web-app-routing
kubectl apply -f ingressbackend.yaml -n hello-web-app-routing
```

The following example output shows the created resources:

```bash
deployment.apps/aks-helloworld created
service/aks-helloworld created
ingress.networking.k8s.io/aks-helloworld created
ingressbackend.policy.openservicemesh.io/aks-helloworld created
```

# [With service annotations (retired)](#tab/service-annotations)

> [!WARNING]
> Configuring ingresses by adding annotations on the Service object is retired. Please consider [configuring via an Ingress object](?tabs=without-osm).

### Create the application namespace

For the sample application environment, let's first create a namespace called `hello-web-app-routing` to run the example pods:

```bash
kubectl create namespace hello-web-app-routing
```

### Create the deployment

Create a file named **deployment.yaml** and copy in the following YAML.

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

### Create the service with the annotations (retired)

Create a file named **service.yaml** and copy in the following YAML.

> [!NOTE]
> Update *`<Hostname>`* with your DNS host name and *`<KeyVaultCertificateUri>`* with the ID returned from Azure Key Vault. This is the certificate that's going to be presented in the browser.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: aks-helloworld
  namespace: hello-web-app-routing
  annotations:
    kubernetes.azure.com/ingress-host: <Hostname>
    kubernetes.azure.com/tls-cert-keyvault-uri: <KeyVaultCertificateUri>
spec:
  type: ClusterIP
  ports:
  - port: 80
  selector:
    app: aks-helloworld
```

### Create the resources on the cluster

Use the [kubectl apply][kubectl-apply] command to create the resources.

```bash
kubectl apply -f deployment.yaml -n hello-web-app-routing
kubectl apply -f service.yaml -n hello-web-app-routing
```

The following example output shows the created resources:

```bash
deployment.apps/aks-helloworld created
service/aks-helloworld created
```

---


## Verify the managed ingress was created

```bash
kubectl get ingress -n hello-web-app-routing

NAME             CLASS                                HOSTS               ADDRESS       PORTS     AGE
aks-helloworld   webapprouting.kubernetes.azure.com   myapp.contoso.com   20.51.92.19   80, 443   4m
```

## Accessing the endpoint over a DNS hostname

If you haven't configured Azure DNS integration, you need to configure your own DNS provider with an **A record** pointing to the ingress IP address and the host name you configured for the ingress, for example *myapp.contoso.com*.
 

## Remove Web Application Routing

First, remove the associated namespace:

```bash
kubectl delete namespace hello-web-app-routing
```

You can remove the Web Application Routing add-on using the Azure CLI. To do so run the following command, substituting your AKS cluster and resource group name. Be careful if you already have some of the other add-ons (open-service-mesh or azure-keyvault-secrets-provider) enabled on your cluster so that you don't accidentally disable them.

```azurecli
az aks disable-addons --addons web_application_routing --name myAKSCluster --resource-group myResourceGroup 
```

When the Web Application Routing add-on is disabled, some Kubernetes resources may remain in the cluster. These resources include *configMaps* and *secrets*, and are created in the *app-routing-system* namespace. To maintain a clean cluster, you may want to remove these resources.

<!-- LINKS - internal -->
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-show]: /cli/azure/aks#az-aks-show
[ingress-https]: ./ingress-tls.md
[az-aks-enable-addons]: /cli/azure/aks#az-aks-enable-addons
[az-aks-install-cli]: /cli/azure/aks#az-aks-install-cli
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[csi-driver]: https://github.com/Azure/secrets-store-csi-driver-provider-azure
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update

<!-- LINKS - external -->
[osm-release]: https://github.com/openservicemesh/osm/releases/
[nginx]: https://kubernetes.github.io/ingress-nginx/
[osm]: https://openservicemesh.io/
[external-dns]: https://github.com/kubernetes-incubator/external-dns
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl-logs]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs
[ingress]: https://kubernetes.io/docs/concepts/services-networking/ingress/
[ingress-resource]: https://kubernetes.io/docs/concepts/services-networking/ingress/#the-ingress-resource
