---
title: Azure Kubernetes Service (AKS) managed nginx ingress with the application routing add-on (preview)
description: Use the application routing add-on to securely access applications deployed on Azure Kubernetes Service (AKS).
ms.subservice: aks-networking
ms.custom: devx-track-azurecli
author: asudbring
ms.topic: how-to
ms.date: 08/07/2023
ms.author: allensu
---

# Managed nginx ingress with the application routing add-on (preview)

The application routing add-on configures an [ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) in your Azure Kubernetes Service (AKS) cluster with SSL termination through certificates stored in Azure Key Vault. When you deploy ingresses, the add-on creates publicly accessible DNS names for endpoints on an Azure DNS zone.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Application routing add-on with nginx overview

The application routing add-on deploys the following components:

- **[nginx ingress controller][nginx]**: This ingress controller is exposed to the internet.
- **[external-dns controller][external-dns]**: This controller watches for Kubernetes ingress resources and creates DNS `A` records in the cluster-specific DNS zone. This is only deployed when you pass in the `--dns-zone-resource-id` argument.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- Azure CLI version 2.47.0 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
- An Azure Key Vault to store certificates.
- The `aks-preview` Azure CLI extension version 0.5.137 or later installed. If you need to install or update, see [Install or update the `aks-preview` extension](#install-or-update-the-aks-preview-azure-cli-extension).
- Optionally, a DNS solution, such as [Azure DNS](../dns/dns-getstarted-portal.md).

### Install or update the `aks-preview` Azure CLI extension

- Install the `aks-preview` Azure CLI extension using the [`az extension add`][az-extension-add] command.

    ```azurecli-interactive
    az extension add --name aks-preview
    ```

- If you need to update the extension version, you can do this using the [`az extension update`][az-extension-update] command.

    ```azurecli-interactive
    az extension update --name aks-preview
    ```

### Create and export a self-signed SSL certificate

> [!NOTE]
> If you already have an SSL certificate, you can skip this step.

1. Create a self-signed SSL certificate to use with the ingress using the `openssl req` command. Make sure you replace *`<Hostname>`* with the DNS name you're using.

    ```bash
    openssl req -new -x509 -nodes -out aks-ingress-tls.crt -keyout aks-ingress-tls.key -subj "/CN=<Hostname>" -addext "subjectAltName=DNS:<Hostname>"
    ```

2. Export the SSL certificate and skip the password prompt using the `openssl pkcs12 -export` command.

    ```bash
    openssl pkcs12 -export -in aks-ingress-tls.crt -inkey aks-ingress-tls.key -out aks-ingress-tls.pfx
    ```

### Create an Azure Key Vault to store the certificate

> [!NOTE]
> If you already have an Azure Key Vault, you can skip this step.

- Create an Azure Key Vault using the [`az keyvault create`][az-keyvault-create] command.

    ```azurecli-interactive
    az keyvault create -g <ResourceGroupName> -l <Location> -n <KeyVaultName>
    ```

### Import certificate into Azure Key Vault

- Import the SSL certificate into Azure Key Vault using the [`az keyvault certificate import`][az-keyvault-certificate-import] command. If your certificate is password protected, you can pass the password through the `--password` flag.

    ```azurecli-interactive
    az keyvault certificate import --vault-name <KeyVaultName> -n <KeyVaultCertificateName> -f aks-ingress-tls.pfx [--password <certificate password if specified>]
    ```

### Create an Azure DNS zone

> [!NOTE]
> If you want the add-on to automatically manage creating host names via Azure DNS, you need to [create an Azure DNS zone](../dns/dns-getstarted-cli.md) if you don't have one already.

- Create an Azure DNS zone using the [`az network dns zone create`][az-network-dns-zone-create] command.

    ```azurecli-interactive
    az network dns zone create -g <ResourceGroupName> -n <ZoneName>
    ```

## Enable application routing using Azure CLI

# [Without Open Service Mesh (OSM)](#tab/without-osm)

The following extra add-on is required:
  
- **azure-keyvault-secrets-provider**: The Secret Store CSI provider for Azure Key Vault is required to retrieve the certificates from Azure Key Vault.

> [!IMPORTANT]
> To enable the add-on to reload certificates from Azure Key Vault when they change, you should to enable the [secret autorotation feature](./csi-secrets-store-configuration-options.md#enable-and-disable-autorotation) of the Secret Store CSI driver with the `--enable-secret-rotation` argument. When the autorotation is enabled, the driver updates the pod mount and the Kubernetes secret by polling for changes periodically, based on the rotation poll interval you can define. The default rotation poll interval is two minutes.

### Enable application routing on a new cluster

- Enable application routing on a new AKS cluster using the [`az aks create`][az-aks-create] command and the `--enable-addons` parameter with the following add-ons:

    ```azurecli-interactive
    az aks create -g <ResourceGroupName> -n <ClusterName> -l <Location> --enable-addons azure-keyvault-secrets-provider,web_application_routing --generate-ssh-keys --enable-secret-rotation
    ```

### Enable application routing on an existing cluster

- Enable application routing on an existing cluster using the [`az aks enable-addons`][az-aks-enable-addons] command and the `--addons` parameter with the following add-ons:

    ```azurecli-interactive
    az aks enable-addons -g <ResourceGroupName> -n <ClusterName> --addons azure-keyvault-secrets-provider,web_application_routing --enable-secret-rotation
    ```

# [With Open Service Mesh (OSM)](#tab/with-osm)

The following extra add-ons are required:

- **azure-keyvault-secrets-provider**: The Secret Store CSI provider for Azure Key Vault is required to retrieve the certificates from Azure Key Vault.
- **open-service-mesh**:  If you require encrypted intra cluster traffic (recommended) between the nginx ingress and your services, the Open Service Mesh add-on is required which provides mutual TLS (mTLS).

> [!IMPORTANT]
> To enable the add-on to reload certificates from Azure Key Vault when they change, you should to enable the [secret autorotation feature](./csi-secrets-store-configuration-options.md#enable-and-disable-autorotation) of the Secret Store CSI driver with the `--enable-secret-rotation` argument. When the autorotation is enabled, the driver updates the pod mount and the Kubernetes secret by polling for changes periodically, based on the rotation poll interval you can define. The default rotation poll interval is two minutes.

### Enable application routing on a new cluster

- Enable application routing on a new AKS cluster using the [`az aks create`][az-aks-create] command and the `--enable-addons` parameter with the following add-ons:

    ```azurecli-interactive
    az aks create -g <ResourceGroupName> -n <ClusterName> -l <Location> --enable-addons azure-keyvault-secrets-provider,open-service-mesh,web_application_routing --generate-ssh-keys --enable-secret-rotation
    ```

### Enable application routing on an existing cluster

- Enable application routing on an existing cluster using the [`az aks enable-addons`][az-aks-enable-addons] command and the `--addons` parameter with the following add-ons:

    ```azurecli-interactive
    az aks enable-addons -g <ResourceGroupName> -n <ClusterName> --addons azure-keyvault-secrets-provider,open-service-mesh,web_application_routing --enable-secret-rotation
    ```

> [!NOTE]
> To use the add-on with Open Service Mesh, you should install the `osm` command-line tool. This command-line tool contains everything needed to configure and manage Open Service Mesh. The latest binaries are available on the [OSM GitHub releases page][osm-release].

# [With service annotations (retired)](#tab/service-annotations)

> [!WARNING]
> Configuring ingresses by adding annotations on the Service object is retired. Please consider [configuring via an Ingress object](?tabs=without-osm).

The following extra add-on is required:

- **azure-keyvault-secrets-provider**: The Secret Store CSI provider for Azure Key Vault is required to retrieve the certificates from Azure Key Vault.

> [!IMPORTANT]
> To enable the add-on to reload certificates from Azure Key Vault when they change, you should to enable the [secret autorotation feature](./csi-secrets-store-configuration-options.md#enable-and-disable-autorotation) of the Secret Store CSI driver with the `--enable-secret-rotation` argument. When the autorotation is enabled, the driver updates the pod mount and the Kubernetes secret by polling for changes periodically, based on the rotation poll interval you can define. The default rotation poll interval is two minutes.

### Enable application routing on a new cluster

- Enable application routing on a new AKS cluster using the [`az aks create`][az-aks-create] command and the `--enable-addons` parameter with the following add-ons:

    ```azurecli-interactive
    az aks create -g <ResourceGroupName> -n <ClusterName> -l <Location> --enable-addons azure-keyvault-secrets-provider,web_application_routing --generate-ssh-keys --enable-secret-rotation
    ```

### Enable application routing on an existing cluster

- Enable application routing on an existing cluster using the [`az aks enable-addons`][az-aks-enable-addons] command and the `--addons` parameter with the following add-ons:

    ```azurecli-interactive
    az aks enable-addons -g <ResourceGroupName> -n <ClusterName> --addons azure-keyvault-secrets-provider,web_application_routing --enable-secret-rotation
    ```

---

## Retrieve the add-on's managed identity object ID

You use the managed identity in the next steps to grant permissions to manage the Azure DNS zone and retrieve secrets and certificates from the Azure Key Vault.

- Get the add-on's managed identity object ID using the [`az aks show`][az-aks-show] command and setting the output to a variable named *MANAGEDIDENTITY_OBJECTID*.

    ```azurecli-interactive
    # Provide values for your environment
    RGNAME=<ResourceGroupName>
    CLUSTERNAME=<ClusterName>
    MANAGEDIDENTITY_OBJECTID=$(az aks show -g ${RGNAME} -n ${CLUSTERNAME} --query ingressProfile.webAppRouting.identity.objectId -o tsv)
    ```

## Configure the add-on to use Azure DNS to manage DNS zones

> [!NOTE]
> If you plan to use Azure DNS, you need to update the add-on to pass in the `--dns-zone-resource-id`.

1. Retrieve the resource ID for the DNS zone using the [`az network dns zone show`][az-network-dns-zone-show] command and setting the output to a variable named *ZONEID*.

    ```azurecli-interactive
    ZONEID=$(az network dns zone show -g <ResourceGroupName> -n <ZoneName> --query "id" --output tsv)
    ```

2. Grant **DNS Zone Contributor** permissions on the DNS zone using the [`az role assignment create`][az-role-assignment-create] command.

    ```azurecli-interactive
    az role assignment create --role "DNS Zone Contributor" --assignee $MANAGEDIDENTITY_OBJECTID --scope $ZONEID
    ```

3. Update the add-on to enable the integration with Azure DNS and install the **external-dns** controller using the [`az aks addon update`][az-aks-addon-update] command.

    ```azurecli-interactive
    az aks addon update -g <ResourceGroupName> -n <ClusterName> --addon web_application_routing --dns-zone-resource-id=$ZONEID
    ```

## Grant the add-on permissions to retrieve certificates from Azure Key Vault

The application routing add-on creates a user-created managed identity in the cluster resource group. You need to grant permissions to the managed identity so it can retrieve SSL certificates from the Azure Key Vault.

Azure Key Vault offers [two authorization systems](../key-vault/general/rbac-access-policy.md): **Azure role-based access control (Azure RBAC)**, which operates on the management plane, and the **access policy model**, which operates on both the management plane and the data plane. To find out which system your key vault is using, you can query the `enableRbacAuthorization` property. 

```azurecli-interactive
az keyvault show --name <KeyVaultName> --query properties.enableRbacAuthorization
```

If Azure RBAC authorization is enabled for your key vault, you should configure permissions using Azure RBAC. Add the `Key Vault Secrets User` role assignment to the key vault.

```azurecli-interactive
KEYVAULTID=$(az keyvault show --name <KeyVaultName> --query "id" --output tsv)
az role assignment create --role "Key Vault Secrets User" --assignee $MANAGEDIDENTITY_OBJECTID --scope $KEYVAULTID
```

If Azure RBAC authorization is not enabled for your key vault, you should configure permissions using the access policy model. Grant `GET` permissions for the application routing add-on to retrieve certificates from Azure Key Vault using the [`az keyvault set-policy`][az-keyvault-set-policy] command.

```azurecli-interactive
az keyvault set-policy --name <KeyVaultName> --object-id $MANAGEDIDENTITY_OBJECTID --secret-permissions get --certificate-permissions get
```

## Connect to your AKS cluster

To connect to the Kubernetes cluster from your local computer, you use [kubectl][kubectl], the Kubernetes command-line client. You can install it locally using the [`az aks install-cli`][az-aks-install-cli] command. If you use the Azure Cloud Shell, `kubectl` is already installed.

- Configure `kubectl` to connect to your Kubernetes cluster using the [az aks get-credentials][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials -g <ResourceGroupName> -n <ClusterName>
    ```

## Deploy an application

Application routing uses annotations on Kubernetes ingress objects to create the appropriate resources, create records on Azure DNS, and retrieve the SSL certificates from Azure Key Vault.

# [Without Open Service Mesh (OSM)](#tab/without-osm)

### Create the application namespace

- Create a namespace called `hello-web-app-routing` to run the example pods using the `kubectl create namespace` command.

    ```bash
    kubectl create namespace hello-web-app-routing
    ```

### Create the deployment

- Copy the following YAML into a new file named **deployment.yaml** and save the file to your local computer.

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

- Copy the following YAML into a new file named **service.yaml** and save the file to your local computer.

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

The application routing add-on creates an ingress class on the cluster called *webapprouting.kubernetes.azure.com*. When you create an ingress object with this class, it activates the add-on.

1. Get the certificate URI to use in the ingress from Azure Key Vault using the [`az keyvault certificate show`][az-keyvault-certificate-show] command.

    ```azurecli-interactive
    az keyvault certificate show --vault-name <KeyVaultName> -n <KeyVaultCertificateName> --query "id" --output tsv
    ```

2. Copy the following YAML into a new file named **ingress.yaml** and save the file to your local computer.

    > [!NOTE]
    > Update *`<Hostname>`* with your DNS host name and *`<KeyVaultCertificateUri>`* with the ID returned from Azure Key Vault.
    > The *`secretName`* key in the `tls` section defines the name of the secret that contains the certificate for this Ingress resource. This certificate will be presented in the browser when a client browses to the URL defined in the `<Hostname>` key. Make sure that the value of `secretName` is equal to `keyvault-` followed by the value of the Ingress resource name (from `metadata.name`). In the example YAML, secretName will need to be equal to `keyvault-aks-helloworld`.

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
        secretName: keyvault-<Ingress resource name>
    ```

### Create the resources on the cluster

- Create the resources on the cluster using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f deployment.yaml -n hello-web-app-routing
    kubectl apply -f service.yaml -n hello-web-app-routing
    kubectl apply -f ingress.yaml -n hello-web-app-routing
    ```

    The following example output shows the created resources:

    ```output
    deployment.apps/aks-helloworld created
    service/aks-helloworld created
    ingress.networking.k8s.io/aks-helloworld created
    ```

# [With Open Service Mesh (OSM)](#tab/with-osm)

### Create the application namespace

1. Create a namespace called `hello-web-app-routing` to run the example pods using the `kubectl create namespace` command.

    ```bash
    kubectl create namespace hello-web-app-routing
    ```

2. Add the application namespace to the OSM control plane using the `osm namespace add` command.

    ```bash
    osm namespace add hello-web-app-routing
    ```

### Create the deployment

- Copy the following YAML into a new file named **deployment.yaml** and save the file to your local computer.

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

- Copy the following YAML into a new file named **service.yaml** and save the file to your local computer.

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

The application routing add-on creates an ingress class on the cluster called *webapprouting.kubernetes.azure.com*. When you create an ingress object with this class, it activates the add-on. The `kubernetes.azure.com/use-osm-mtls: "true"` annotation on the ingress object creates an Open Service Mesh (OSM) [IngressBackend](https://release-v1-2.docs.openservicemesh.io/docs/guides/traffic_management/ingress/#ingressbackend-api) to configure a backend service to accept ingress traffic from trusted sources.

OSM issues a certificate that Nginx uses as the client certificate to proxy HTTPS connections to TLS backends. The client certificate and CA certificate are stored in a Kubernetes secret that Nginx uses to authenticate service mesh back ends. For more information, see [Open Service Mesh: Ingress with Kubernetes Nginx Ingress Controller](https://release-v1-2.docs.openservicemesh.io/docs/demos/ingress_k8s_nginx/).

1. Get the certificate URI to use in the ingress from Azure Key Vault using the [`az keyvault certificate show`][az-keyvault-certificate-show] command.

    ```azurecli-interactive
    az keyvault certificate show --vault-name <KeyVaultName> -n <KeyVaultCertificateName> --query "id" --output tsv
    ```

2. Copy the following YAML into a new file named **ingress.yaml** and save the file to your local computer.

    > [!NOTE]
    > Update *`<Hostname>`* with your DNS host name and *`<KeyVaultCertificateUri>`* with the ID returned from Azure Key Vault.
    > The *`secretName`* key in the `tls` section defines the name of the secret that contains the certificate for this Ingress resource. This certificate will be presented in the browser when a client browses to the URL defined in the `<Hostname>` key. Make sure that the value of `secretName` is equal to `keyvault-` followed by the value of the Ingress resource name (from `metadata.name`). In the example YAML, secretName will need to be equal to `keyvault-aks-helloworld`.

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
        secretName: keyvault-<Ingress resource name>
    ```

### Create the resources on the cluster

- Create the resources on the cluster using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f deployment.yaml -n hello-web-app-routing
    kubectl apply -f service.yaml -n hello-web-app-routing
    kubectl apply -f ingress.yaml -n hello-web-app-routing
    ```

    The following example output shows the created resources:

    ```output
    deployment.apps/aks-helloworld created
    service/aks-helloworld created
    ingress.networking.k8s.io/aks-helloworld created
    ```

# [With service annotations (retired)](#tab/service-annotations)

> [!WARNING]
> Configuring ingresses by adding annotations on the Service object is retired. Please consider [configuring via an Ingress object](?tabs=without-osm).

### Create the application namespace

- Create a namespace called `hello-web-app-routing` to run the example pods using the `kubectl create namespace` command.

    ```bash
    kubectl create namespace hello-web-app-routing
    ```

### Create the deployment

- Copy the following YAML into a new file named **deployment.yaml** and save the file to your local computer.

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

- Copy the following YAML into a new file named **service.yaml** and save the file to your local computer.

    > [!NOTE]
    > Update *`<Hostname>`* with your DNS host name and *`<KeyVaultCertificateUri>`* with the ID returned from Azure Key Vault. This certificate will be presented in the browser.

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

- Create the resources on the cluster using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f deployment.yaml -n hello-web-app-routing
    kubectl apply -f service.yaml -n hello-web-app-routing
    ```

    The following example output shows the created resources:

    ```output
    deployment.apps/aks-helloworld created
    service/aks-helloworld created
    ```

---

## Verify the managed ingress was created

- Verify the managed ingress was created using the `kubectl get ingress` command.

    ```bash
    kubectl get ingress -n hello-web-app-routing
    ```

    The following example output shows the created managed ingress:

    ```output
    NAME             CLASS                                HOSTS               ADDRESS       PORTS     AGE
    aks-helloworld   webapprouting.kubernetes.azure.com   myapp.contoso.com   20.51.92.19   80, 443   4m
    ```

## Access the endpoint over a DNS hostname

If you haven't configured Azure DNS integration, you need to configure your own DNS provider with an `A` record pointing to the ingress IP address and the host name you configured for the ingress, for example *myapp.contoso.com*.

## Remove the application routing add-on

1. Remove the associated namespace using the `kubectl delete namespace` command.

    ```bash
    kubectl delete namespace hello-web-app-routing
    ```

2. Remove the application routing add-on from your cluster using the [`az aks disable-addons`][az-aks-disable-addons] command.

    ```azurecli-interactive
    az aks disable-addons --addons web_application_routing --name myAKSCluster --resource-group myResourceGroup 
    ```

When the application routing add-on is disabled, some Kubernetes resources may remain in the cluster. These resources include *configMaps* and *secrets* and are created in the *app-routing-system* namespace. You can remove these resources if you want.

<!-- LINKS - internal -->
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-show]: /cli/azure/aks#az-aks-show
[az-aks-enable-addons]: /cli/azure/aks#az-aks-enable-addons
[az-aks-disable-addons]: /cli/azure/aks#az-aks-disable-addons
[az-aks-install-cli]: /cli/azure/aks#az-aks-install-cli
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[install-azure-cli]: /cli/azure/install-azure-cli
[az-keyvault-create]: /cli/azure/keyvault#az_keyvault_create
[az-keyvault-certificate-import]: /cli/azure/keyvault/certificate#az_keyvault_certificate_import
[az-keyvault-certificate-show]: /cli/azure/keyvault/certificate#az_keyvault_certificate_show
[az-network-dns-zone-create]: /cli/azure/network/dns/zone#az_network_dns_zone_create
[az-network-dns-zone-show]: /cli/azure/network/dns/zone#az_network_dns_zone_show
[az-role-assignment-create]: /cli/azure/role/assignment#az_role_assignment_create
[az-aks-addon-update]: /cli/azure/aks/addon#az_aks_addon_update
[az-keyvault-set-policy]: /cli/azure/keyvault#az_keyvault_set_policy

<!-- LINKS - external -->
[osm-release]: https://github.com/openservicemesh/osm/releases/
[nginx]: https://kubernetes.github.io/ingress-nginx/
[external-dns]: https://github.com/kubernetes-incubator/external-dns
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
