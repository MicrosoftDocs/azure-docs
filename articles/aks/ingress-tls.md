---
title: Use TLS with an ingress controller on Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to install and configure an ingress controller that uses TLS in an Azure Kubernetes Service (AKS) cluster.
ms.subservice: aks-networking
ms.custom: devx-track-azurecli, devx-track-azurepowershell
author: asudbring
ms.author: allensu
ms.topic: how-to
ms.date: 03/14/2024
ROBOTS: NOINDEX
#Customer intent: As a cluster operator or developer, I want to use TLS with an ingress controller to handle the flow of incoming traffic and secure my apps using my own certificates or automatically generated certificates.
---

# Use TLS with an ingress controller on Azure Kubernetes Service (AKS)

The transport layer security (TLS) protocol uses certificates to provide security for communication, encryption, authentication, and integrity. Using TLS with an ingress controller on AKS allows you to secure communication between your applications and experience the benefits of an ingress controller.

You can bring your own certificates and integrate them with the Secrets Store CSI driver. Alternatively, you can use [cert-manager][cert-manager], which automatically generates and configures [Let's Encrypt][lets-encrypt] certificates. Two applications run in the AKS cluster, each of which is accessible over a single IP address.

> [!IMPORTANT]
> The Application routing add-on is recommended for ingress in AKS. For more information, see [Managed nginx Ingress with the application routing add-on][aks-app-add-on].

> [!IMPORTANT]
> Microsoft **_does not_** manage or support cert-manager and any issues stemming from its use. For issues with cert-manager, see [cert-manager troubleshooting][cert-manager-troubleshooting] documentation.
>
> There are two open source ingress controllers for Kubernetes based on Nginx: one is maintained by the Kubernetes community ([kubernetes/ingress-nginx][nginx-ingress]), and one is maintained by NGINX, Inc. ([nginxinc/kubernetes-ingress]). This article uses the *Kubernetes community ingress controller*.

## Before you begin

* This article assumes you have an ingress controller and applications set up. If you need an ingress controller or example applications, see [Create an ingress controller][aks-ingress-basic].

* This article uses [Helm 3][helm] to install the NGINX ingress controller on a [supported version of Kubernetes][aks-supported versions]. Make sure you're using the latest release of Helm and have access to the `ingress-nginx` and `jetstack` Helm repositories. The steps outlined in this article may not be compatible with previous versions of the Helm chart, NGINX ingress controller, or Kubernetes.

  * For more information on configuring and using Helm, see [Install applications with Helm in AKS][use-helm]. For upgrade instructions, see the [Helm install docs][helm-install].

* This article assumes you have an existing AKS cluster with an integrated Azure Container Registry (ACR). For more information on creating an AKS cluster with an integrated ACR, see [Authenticate with ACR from AKS][aks-integrated-acr].

* If you're using Azure CLI, this article requires that you're running the Azure CLI version 2.0.64 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

* If you're using Azure PowerShell, this article requires that you're running Azure PowerShell version 5.9.0 or later. Run `Get-InstalledModule -Name Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell][azure-powershell-install].

## Use TLS with your own certificates with Secrets Store CSI Driver

To use TLS with your own certificates with Secrets Store CSI Driver, you need an AKS cluster with the Secrets Store CSI Driver configured and an Azure Key Vault instance.

For more information, see [Set up Secrets Store CSI Driver to enable NGINX Ingress Controller with TLS][aks-nginx-tls-secrets-store].

## Use TLS with Let's Encrypt certificates

To use TLS with [Let's Encrypt][lets-encrypt] certificates, you'll deploy [cert-manager][cert-manager], which automatically generates and configures Let's Encrypt certificates.

### Import the cert-manager images used by the Helm chart into your ACR

### [Azure CLI](#tab/azure-cli)

* Use `az acr import` to import the following images into your ACR.

    ```azurecli
    REGISTRY_NAME=<REGISTRY_NAME>
    CERT_MANAGER_REGISTRY=quay.io
    CERT_MANAGER_TAG=v1.8.0
    CERT_MANAGER_IMAGE_CONTROLLER=jetstack/cert-manager-controller
    CERT_MANAGER_IMAGE_WEBHOOK=jetstack/cert-manager-webhook
    CERT_MANAGER_IMAGE_CAINJECTOR=jetstack/cert-manager-cainjector

    az acr import --name $REGISTRY_NAME --source $CERT_MANAGER_REGISTRY/$CERT_MANAGER_IMAGE_CONTROLLER:$CERT_MANAGER_TAG --image $CERT_MANAGER_IMAGE_CONTROLLER:$CERT_MANAGER_TAG
    az acr import --name $REGISTRY_NAME --source $CERT_MANAGER_REGISTRY/$CERT_MANAGER_IMAGE_WEBHOOK:$CERT_MANAGER_TAG --image $CERT_MANAGER_IMAGE_WEBHOOK:$CERT_MANAGER_TAG
    az acr import --name $REGISTRY_NAME --source $CERT_MANAGER_REGISTRY/$CERT_MANAGER_IMAGE_CAINJECTOR:$CERT_MANAGER_TAG --image $CERT_MANAGER_IMAGE_CAINJECTOR:$CERT_MANAGER_TAG
    ```

### [Azure PowerShell](#tab/azure-powershell)

* Use `Import-AzContainerRegistryImage` to import the following images into your ACR.

   >[!NOTE]
   >When performing the steps to import the images into your ACR when working in Azure Government, you need to include the [`targetTag`][parameter-targettag] parameter with the value representing the tag of the image you want to import. 

    ```azurepowershell
    $RegistryName = "<REGISTRY_NAME>"
    $ResourceGroup = (Get-AzContainerRegistry | Where-Object {$_.name -eq $RegistryName} ).ResourceGroupName
    $CertManagerRegistry = "quay.io"
    $CertManagerTag = "v1.8.0"
    $CertManagerImageController = "jetstack/cert-manager-controller"
    $CertManagerImageWebhook = "jetstack/cert-manager-webhook"
    $CertManagerImageCaInjector = "jetstack/cert-manager-cainjector"

    Import-AzContainerRegistryImage -ResourceGroupName $ResourceGroup -RegistryName $RegistryName -SourceRegistryUri $CertManagerRegistry -SourceImage "${CertManagerImageController}:${CertManagerTag}"
    Import-AzContainerRegistryImage -ResourceGroupName $ResourceGroup -RegistryName $RegistryName -SourceRegistryUri $CertManagerRegistry -SourceImage "${CertManagerImageWebhook}:${CertManagerTag}"
    Import-AzContainerRegistryImage -ResourceGroupName $ResourceGroup -RegistryName $RegistryName -SourceRegistryUri $CertManagerRegistry -SourceImage "${CertManagerImageCaInjector}:${CertManagerTag}"
    ```

---

> [!NOTE]
> You can also import Helm charts into your ACR. For more information, see [Push and pull Helm charts to an ACR][acr-helm].

## Ingress controller configuration options

You can configure your NGINX ingress controller using either a static public IP address or a dynamic public IP address. If you're using a custom domain, you need to add an A record to your DNS zone. If you're not using a custom domain, you can configure a fully qualified domain name (FQDN) for the ingress controller IP address.

### Create a static or dynamic public IP address

#### Use a static public IP address

You can configure your ingress controller with a static public IP address. The static public IP address remains if you delete your ingress controller. The IP address *doesn't* remain if you delete your AKS cluster.

When you upgrade your ingress controller, you must pass a parameter to the Helm release to ensure the ingress controller service is made aware of the load balancer that will be allocated to it. For the HTTPS certificates to work correctly, you use a DNS label to configure an FQDN for the ingress controller IP address.

### [Azure CLI](#tab/azure-cli)

1. Get the resource group name of the AKS cluster with the [`az aks show`][az-aks-show] command.

    ```azurecli-interactive
    az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv
    ```

2. Create a public IP address with the *static* allocation method using the [`az network public-ip create`][az-network-public-ip-create] command. The following example creates a public IP address named *myAKSPublicIP* in the AKS cluster resource group obtained in the previous step.

    ```azurecli-interactive
    az network public-ip create --resource-group MC_myResourceGroup_myAKSCluster_eastus --name myAKSPublicIP --sku Standard --allocation-method static --query publicIp.ipAddress -o tsv
    ```

> [!NOTE]
> Alternatively, you can create an IP address in a different resource group, which you can manage separately from your AKS cluster. If you create an IP address in a different resource group, ensure the following are true:
>
> * The cluster identity used by the AKS cluster has delegated permissions to the resource group, such as *Network Contributor*.
> * Add the `--set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-resource-group"="<RESOURCE_GROUP>"` parameter. Replace `<RESOURCE_GROUP>` with the name of the resource group where the IP address resides.

3. Add the `--set controller.service.annotations."service\.beta\.kubernetes\.io/azure-dns-label-name"="<DNS_LABEL>"` parameter. The DNS label can be set either when the ingress controller is first deployed, or it can be configured later.

4. Add the `--set controller.service.loadBalancerIP="<STATIC_IP>"` parameter. Specify your own public IP address that was created in the previous step.

    ```azurecli-interactive
    DNS_LABEL="<DNS_LABEL>"
    NAMESPACE="ingress-basic"
    STATIC_IP=<STATIC_IP>

    helm upgrade ingress-nginx ingress-nginx/ingress-nginx \
      --namespace $NAMESPACE \
      --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-dns-label-name"=$DNS_LABEL \
      --set controller.service.loadBalancerIP=$STATIC_IP \
      --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Get the resource group name of the AKS cluster with the [`Get-AzAksCluster`][get-az-aks-cluster] command.

    ```azurepowershell-interactive
    (Get-AzAksCluster -ResourceGroupName $ResourceGroup -Name myAKSCluster).NodeResourceGroup
    ```

2. Create a public IP address with the *static* allocation method using the [`New-AzPublicIpAddress`][new-az-public-ip-address] command. The following example creates a public IP address named *myAKSPublicIP* in the AKS cluster resource group obtained in the previous step.

    ```azurepowershell-interactive
    (New-AzPublicIpAddress -ResourceGroupName MC_myResourceGroup_myAKSCluster_eastus -Name myAKSPublicIP -Sku Standard -AllocationMethod Static -Location eastus).IpAddress
    ```

> [!NOTE]
> Alternatively, you can create an IP address in a different resource group, which you can manage separately from your AKS cluster. If you create an IP address in a different resource group, ensure the following are true:
>
> * The cluster identity used by the AKS cluster has delegated permissions to the resource group, such as *Network Contributor*.
> * Add the `--set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-resource-group"="<RESOURCE_GROUP>"` parameter. Replace `<RESOURCE_GROUP>` with the name of the resource group where the IP address resides.

3. Add the `--set controller.service.annotations."service\.beta\.kubernetes\.io/azure-dns-label-name"="<DNS_LABEL>"` parameter. The DNS label can be set either when the ingress controller is first deployed, or it can be configured later.

4. Add the `--set controller.service.loadBalancerIP="<STATIC_IP>"` parameter. Specify your own public IP address that was created in the previous step.

    ```azurepowershell-interactive
    $DnsLabel = "<DNS_LABEL>"
    $Namespace = "ingress-basic"
    $StaticIP = "<STATIC_IP>"

    helm upgrade ingress-nginx ingress-nginx/ingress-nginx `
      --namespace $Namespace `
      --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-dns-label-name"=$DnsLabel `
      --set controller.service.loadBalancerIP=$StaticIP `
      --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz
    ```

---

For more information, see [Use a static public IP address and DNS label with the AKS load balancer][aks-static-ip].

#### Use a dynamic public IP address

An Azure public IP address is created for your ingress controller upon creation. The public IP address is static for the lifespan of your ingress controller. The public IP address *doesn't* remain if you delete your ingress controller. If you create a new ingress controller, it will be assigned a new public IP address. Your output should look similar to the following sample output.

* Use the `kubectl get service` command to get the public IP address for your ingress controller.

    ```console
    # Get the public IP address for your ingress controller

    kubectl --namespace ingress-basic get services -o wide -w nginx-ingress-ingress-nginx-controller

    # Sample output

    NAME                                     TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)                      AGE   SELECTOR
    nginx-ingress-ingress-nginx-controller   LoadBalancer   10.0.74.133   EXTERNAL_IP     80:32486/TCP,443:30953/TCP   44s   app.kubernetes.io/component=controller,app.kubernetes.io/instance=nginx-ingress,app.kubernetes.io/name=ingress-nginx
    ```

### Add an A record to your DNS zone

If you're using a custom domain, you need to add an *A* record to your DNS zone. If you're not using a custom domain, you can configure the public IP address with an FQDN.

### [Azure CLI](#tab/azure-cli)

* Add an *A* record to your DNS zone with the external IP address of the NGINX service using [`az network dns record-set a add-record`][az-network-dns-record-set-a-add-record].

    ```azurecli
    az network dns record-set a add-record \
        --resource-group myResourceGroup \
        --zone-name MY_CUSTOM_DOMAIN \
        --record-set-name "*" \
        --ipv4-address MY_EXTERNAL_IP
    ```

### [Azure PowerShell](#tab/azure-powershell)

* Add an *A* record to your DNS zone with the external IP address of the NGINX service using [`New-AzDnsRecordSet`][new-az-dns-recordset-create-a-record].

    ```azurepowershell
    $Records = @()
    $Records += New-AzDnsRecordConfig -IPv4Address <External IP>
    New-AzDnsRecordSet -Name "*" `
        -RecordType A `
        -ResourceGroupName <Name of Resource Group for the DNS Zone> `
        -ZoneName <Custom Domain Name> `
        -TTL 3600 `
        -DnsRecords $Records
    ```

---

### Configure an FQDN for your ingress controller

Optionally, you can configure an FQDN for the ingress controller IP address instead of a custom domain by setting a DNS label. Your FQDN should follow this form: `<CUSTOM DNS LABEL>.<AZURE REGION NAME>.cloudapp.azure.com`.

> [!IMPORTANT]
> Your DNS label must be unique within its Azure location.

You can configure your FQDN using one of the following methods:

* Set the DNS label using Azure CLI or Azure PowerShell.
* Set the DNS label using Helm chart settings.

For more information, see [Public IP address DNS name labels](../virtual-network/ip-services/public-ip-addresses.md#domain-name-label).

#### Set the DNS label using Azure CLI or Azure PowerShell

Make sure to replace `<DNS_LABEL>` with your unique DNS label.

### [Azure CLI](#tab/azure-cli)

```azurecli
# Public IP address of your ingress controller
IP="MY_EXTERNAL_IP"

# Name to associate with public IP address
DNSLABEL="<DNS_LABEL>"

# Get the resource-id of the public IP
PUBLICIPID=$(az network public-ip list --query "[?ipAddress!=null]|[?contains(ipAddress, '$IP')].[id]" --output tsv)

# Update public IP address with DNS name
az network public-ip update --ids $PUBLICIPID --dns-name $DNSLABEL

# Display the FQDN
az network public-ip show --ids $PUBLICIPID --query "[dnsSettings.fqdn]" --output tsv
 ```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
# Public IP address of your ingress controller
$AksIpAddress = "MY_EXTERNAL_IP"

# Get the public IP address for the ingress controller
$PublicIp = Get-AzPublicIpAddress | Where-Object {$_.IpAddress -eq $AksIpAddress}

# Update public IP address with DNS name
$PublicIp.DnsSettings = @{"DomainNameLabel" = "<DNS_LABEL>"}
$UpdatedPublicIp = Set-AzPublicIpAddress -PublicIpAddress $publicIp

# Display the FQDN
Write-Output $UpdatedPublicIp.DnsSettings.Fqdn
```

---

#### Set the DNS label using Helm chart settings

You can pass an annotation setting to your Helm chart configuration using the `--set controller.service.annotations."service\.beta\.kubernetes\.io/azure-dns-label-name"` parameter. This parameter can be set when the ingress controller is first deployed, or it can be configured later.

The following example shows how to update this setting after the controller has been deployed. Make sure to replace `<DNS_LABEL>` with your unique DNS label.

### [Azure CLI](#tab/azure-cli)

```bash
DNSLABEL="<DNS_LABEL>"
NAMESPACE="ingress-basic"

helm upgrade ingress-nginx ingress-nginx/ingress-nginx \
  --namespace $NAMESPACE \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-dns-label-name"=$DNSLABEL \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$DnsLabel = "<DNS_LABEL>"
$Namespace = "ingress-basic"

helm upgrade ingress-nginx ingress-nginx/ingress-nginx `
  --namespace $Namespace `
  --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-dns-label-name"=$DnsLabel `
  --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz
```

---

## Install cert-manager

The NGINX ingress controller supports TLS termination. There are several ways to retrieve and configure certificates for HTTPS. This article uses [cert-manager][cert-manager], which provides automatic [Lets Encrypt][lets-encrypt] certificate generation and management functionality.

To install the cert-manager controller, use the following commands.

### [Azure CLI](#tab/azure-cli)

```bash
# Set variable for ACR location to use for pulling images
ACR_URL=<REGISTRY_URL>

# Label the ingress-basic namespace to disable resource validation
kubectl label namespace ingress-basic cert-manager.io/disable-validation=true

# Add the Jetstack Helm repository
helm repo add jetstack https://charts.jetstack.io

# Update your local Helm chart repository cache
helm repo update

# Install the cert-manager Helm chart
helm install cert-manager jetstack/cert-manager \
  --namespace ingress-basic \
  --version=$CERT_MANAGER_TAG \
  --set installCRDs=true \
  --set nodeSelector."kubernetes\.io/os"=linux \
  --set image.repository=$ACR_URL/$CERT_MANAGER_IMAGE_CONTROLLER \
  --set image.tag=$CERT_MANAGER_TAG \
  --set webhook.image.repository=$ACR_URL/$CERT_MANAGER_IMAGE_WEBHOOK \
  --set webhook.image.tag=$CERT_MANAGER_TAG \
  --set cainjector.image.repository=$ACR_URL/$CERT_MANAGER_IMAGE_CAINJECTOR \
  --set cainjector.image.tag=$CERT_MANAGER_TAG
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
# Set variable for ACR location to use for pulling images
$AcrUrl = (Get-AzContainerRegistry -ResourceGroupName $ResourceGroup -Name $RegistryName).LoginServer

# Label the ingress-basic namespace to disable resource validation
kubectl label namespace ingress-basic cert-manager.io/disable-validation=true

# Add the Jetstack Helm repository
helm repo add jetstack https://charts.jetstack.io

# Update your local Helm chart repository cache
helm repo update

# Install the cert-manager Helm chart
helm install cert-manager jetstack/cert-manager `
  --namespace ingress-basic `
  --version $CertManagerTag `
  --set installCRDs=true `
  --set nodeSelector."kubernetes\.io/os"=linux `
  --set image.repository="${AcrUrl}/${CertManagerImageController}" `
  --set image.tag=$CertManagerTag `
  --set webhook.image.repository="${AcrUrl}/${CertManagerImageWebhook}" `
  --set webhook.image.tag=$CertManagerTag `
  --set cainjector.image.repository="${AcrUrl}/${CertManagerImageCaInjector}" `
  --set cainjector.image.tag=$CertManagerTag
```

---

For more information on cert-manager configuration, see the [cert-manager project][cert-manager].

## Create a CA cluster issuer

Before certificates can be issued, cert-manager requires one of the following issuers:

* An [Issuer][cert-manager-issuer], which works in a single namespace.
* A [ClusterIssuer][cert-manager-cluster-issuer] resource, which works across all namespaces.

For more information, see the [cert-manager issuer][cert-manager-issuer] documentation.

1. Create a cluster issuer, such as `cluster-issuer.yaml`, using the following example manifest. Replace `MY_EMAIL_ADDRESS` with a valid address from your organization.

    ```yaml
    apiVersion: cert-manager.io/v1
    kind: ClusterIssuer
    metadata:
      name: letsencrypt
    spec:
      acme:
        server: https://acme-v02.api.letsencrypt.org/directory
        email: MY_EMAIL_ADDRESS
        privateKeySecretRef:
          name: letsencrypt
        solvers:
        - http01:
            ingress:
              class: nginx
              podTemplate:
                spec:
                  nodeSelector:
                    "kubernetes.io/os": linux
    ```

2. Apply the issuer using the `kubectl apply` command.

    ```console
    kubectl apply -f cluster-issuer.yaml --namespace ingress-basic
    ```

## Update your ingress routes

You need to update your ingress routes to handle traffic to your FQDN or custom domain.

In the following example, traffic is routed as such:

* Traffic to *hello-world-ingress.MY_CUSTOM_DOMAIN* is routed to the *aks-helloworld-one* service.
* Traffic to *hello-world-ingress.MY_CUSTOM_DOMAIN/hello-world-two* is routed to the *aks-helloworld-two* service.
* Traffic to *hello-world-ingress.MY_CUSTOM_DOMAIN/static* is routed to the service named *aks-helloworld-one* for static assets.

> [!NOTE]
> If you configured an FQDN for the ingress controller IP address instead of a custom domain, use the FQDN instead of *hello-world-ingress.MY_CUSTOM_DOMAIN*.
>
> For example, if your FQDN is *demo-aks-ingress.eastus.cloudapp.azure.com*, replace *hello-world-ingress.MY_CUSTOM_DOMAIN* with *demo-aks-ingress.eastus.cloudapp.azure.com* in `hello-world-ingress.yaml`.
>

1. Create or update the `hello-world-ingress.yaml` file using the following example YAML file. Update the `spec.tls.hosts` and `spec.rules.host` to the DNS name you created in a previous step.

    ```yaml
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: hello-world-ingress
      annotations:
        nginx.ingress.kubernetes.io/rewrite-target: /$2
        nginx.ingress.kubernetes.io/use-regex: "true"
        cert-manager.io/cluster-issuer: letsencrypt
    spec:
      ingressClassName: nginx
      tls:
      - hosts:
        - hello-world-ingress.MY_CUSTOM_DOMAIN
        secretName: tls-secret
      rules:
      - host: hello-world-ingress.MY_CUSTOM_DOMAIN
        http:
          paths:
          - path: /hello-world-one(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: aks-helloworld-one
                port:
                  number: 80
          - path: /hello-world-two(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: aks-helloworld-two
                port:
                  number: 80
          - path: /(.*)
            pathType: Prefix
            backend:
              service:
                name: aks-helloworld-one
                port:
                  number: 80
    ---
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: hello-world-ingress-static
      annotations:
        nginx.ingress.kubernetes.io/ssl-redirect: "false"
        nginx.ingress.kubernetes.io/rewrite-target: /static/$2
    spec:
      ingressClassName: nginx
      tls:
      - hosts:
        - hello-world-ingress.MY_CUSTOM_DOMAIN
        secretName: tls-secret
      rules:
      - host: hello-world-ingress.MY_CUSTOM_DOMAIN
        http:
          paths:
          - path: /static(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: aks-helloworld-one
                port:
                  number: 80
    ```

2. Update the ingress resource using the `kubectl apply` command.

    ```console
    kubectl apply -f hello-world-ingress.yaml --namespace ingress-basic
    ```

## Verify a certificate object has been created

Next, a certificate resource must be created. The certificate resource defines the desired X.509 certificate. For more information, see [cert-manager certificates][cert-manager-certificates].

Cert-manager automatically creates a certificate object for you using ingress-shim, which is automatically deployed with cert-manager since v0.2.2. For more information, see the [ingress-shim documentation][ingress-shim].

To verify that the certificate was created successfully, use the `kubectl get certificate --namespace ingress-basic` command and verify *READY* is *True*. It may take several minutes to get the output.

```console
kubectl get certificate --namespace ingress-basic
```

The following output shows the certificate's status.

```
NAME         READY   SECRET       AGE
tls-secret   True    tls-secret   11m
```

## Test the ingress configuration

Open a web browser to *hello-world-ingress.MY_CUSTOM_DOMAIN* or the FQDN of your Kubernetes ingress controller. Ensure the following are true:

* You're redirected to use HTTPS.
* The certificate is *trusted*.
* The demo application is shown in the web browser.
* Add */hello-world-two* to the end of the domain and ensure the second demo application with the custom title is shown.

## Clean up resources

This article used Helm to install the ingress components, certificates, and sample apps. When you deploy a Helm chart, many Kubernetes resources are created. These resources include pods, deployments, and services. To clean up these resources, you can either delete the entire sample namespace or the individual resources.

### Delete the sample namespace and all resources

Deleting the sample namespace also deletes all the resources in the namespace.

* Delete the entire sample namespace using the `kubectl delete` command and specifying your namespace name.

    ```console
    kubectl delete namespace ingress-basic
    ```

### Delete resources individually

Alternatively, you can delete the resource individually.

1. Remove the cluster issuer resources.

    ```console
    kubectl delete -f cluster-issuer.yaml --namespace ingress-basic
    ```

2. List the Helm releases with the `helm list` command. Look for charts named *nginx* and *cert-manager*, as shown in the following example output.

    ```console
    $ helm list --namespace ingress-basic

    NAME                    NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                   APP VERSION
    cert-manager            ingress-basic   1               2020-01-15 10:23:36.515514 -0600 CST    deployed        cert-manager-v0.13.0    v0.13.0
    nginx                   ingress-basic   1               2020-01-15 10:09:45.982693 -0600 CST    deployed        nginx-ingress-1.29.1    0.27.0
    ```

3. Uninstall the releases using the `helm uninstall` command. The following example uninstalls the NGINX ingress and cert-manager deployments.

    ```console
    $ helm uninstall cert-manager nginx --namespace ingress-basic

    release "cert-manager" uninstalled
    release "nginx" uninstalled
    ```

4. Remove the two sample applications.

    ```console
    kubectl delete -f aks-helloworld-one.yaml --namespace ingress-basic
    kubectl delete -f aks-helloworld-two.yaml --namespace ingress-basic
    ```

5. Remove the ingress route that directed traffic to the sample apps.

    ```console
    kubectl delete -f hello-world-ingress.yaml --namespace ingress-basic
    ```

6. Delete the itself namespace. Use the `kubectl delete` command and specify your namespace name.

    ```console
    kubectl delete namespace ingress-basic
    ```

## Next steps

This article included some external components to AKS. To learn more about these components, see the following project pages:

* [Helm CLI][helm-cli]
* [NGINX ingress controller][nginx-ingress]
* [cert-manager][cert-manager]

You can also:

* [Enable the HTTP application routing add-on][aks-http-app-routing]

<!-- LINKS - external -->
[az-network-dns-record-set-a-add-record]: /cli/azure/network/dns/record-set/#az-network-dns-record-set-a-add-record
[new-az-dns-recordset-create-a-record]: /powershell/module/az.dns/new-azdnsrecordset
[custom-domain]: ../app-service/manage-custom-dns-buy-domain.md#buy-an-app-service-domain
[dns-zone]: ../dns/dns-getstarted-cli.md
[helm]: https://helm.sh/
[helm-cli]: ./kubernetes-helm.md
[cert-manager]: https://github.com/jetstack/cert-manager
[cert-manager-troubleshooting]: https://cert-manager.io/docs/troubleshooting/
[cert-manager-certificates]: https://cert-manager.io/docs/concepts/certificate/
[ingress-shim]: https://cert-manager.io/docs/usage/ingress/
[cert-manager-cluster-issuer]: https://cert-manager.io/docs/concepts/issuer/
[cert-manager-issuer]: https://cert-manager.io/docs/concepts/issuer/
[lets-encrypt]: https://letsencrypt.org/
[nginx-ingress]: https://github.com/kubernetes/ingress-nginx
[nginxinc/kubernetes-ingress]: https://github.com/nginxinc/kubernetes-ingress
[helm-install]: https://helm.sh/docs/helm/helm_install
[ingress-nginx-helm-chart]: https://github.com/kubernetes/ingress-nginx/tree/main/charts/ingress-nginx

<!-- LINKS - internal -->
[use-helm]: kubernetes-helm.md
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-network-public-ip-create]: /cli/azure/network/public-ip#az_network_public_ip_create
[aks-nginx-tls-secrets-store]: csi-secrets-store-nginx-tls.md
[aks-tls-configure-ingress-controller]: ingress-tls.md#configure-your-ingress-controller
[aks-ingress-static-ip]: ingress-tls.md#use-a-static-ip-address
[aks-ingress-basic]: ingress-basic.md
[aks-ingress-run-demo-applications]: ingress-basic.md#run-demo-applications
[aks-static-ip]: static-ip.md
[aks-http-app-routing]: http-application-routing.md
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[client-source-ip]: concepts-network.md#ingress-controllers
[install-azure-cli]: /cli/azure/install-azure-cli
[aks-supported versions]: supported-kubernetes-versions.md
[aks-integrated-acr]: cluster-container-registry-integration.md#create-a-new-acr
[azure-powershell-install]: /powershell/azure/install-az-ps
[acr-helm]: ../container-registry/container-registry-helm-repos.md
[get-az-aks-cluster]: /powershell/module/az.aks/get-azakscluster
[new-az-public-ip-address]: /powershell/module/az.network/new-azpublicipaddress
[aks-app-add-on]: app-routing.md
[parameter-targettag]: /powershell/module/az.containerregistry/import-azcontainerregistryimage
