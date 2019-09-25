---
title: "Use a custom traefik ingress controller and configure HTTPS"
titleSuffix: Azure Dev Spaces
services: azure-dev-spaces
ms.service: azure-dev-spaces
author: zr-msft
ms.author: zarhoads
ms.date: "08/13/2019"
ms.topic: "conceptual"
description: "Learn how to configure Azure Dev Spaces to use a custom traefik ingress controller and configure HTTPS using that ingress controller"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers, Helm, service mesh, service mesh routing, kubectl, k8s"
---

# Use a custom traefik ingress controller and configure HTTPS

This article shows you how to configure Azure Dev Spaces to use a custom traefik ingress controller. This article also shows you how to configure that custom ingress controller to use HTTPS.

## Prerequisites

* An Azure subscription. If you don't have one, you can create a [free account][azure-account-create].
* [Azure CLI installed][az-cli].
* [Azure Kubernetes Service (AKS) cluster with Azure Dev Spaces enabled][qs-cli].
* [kubectl][kubectl] installed.
* [Helm 2.13 or greater installed][helm-installed].
* [A custom domain][custom-domain] with a [DNS Zone][dns-zone] in the same resource group as your AKS cluster.

## Configure a custom traefik ingress controller

Connect to your cluster using [kubectl][kubectl], the Kubernetes command-line client. To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials][az-aks-get-credentials] command. This command downloads credentials and configures the Kubernetes CLI to use them.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKS
```

To verify the connection to your cluster, use the [kubectl get][kubectl-get] command to return a list of the cluster nodes.

```console
$ kubectl get nodes
NAME                                STATUS   ROLES   AGE    VERSION
aks-nodepool1-12345678-vmssfedcba   Ready    agent   13m    v1.14.1
```

Create a Kubernetes namespace for the traefik ingress controller and install it using `helm`.

```console
kubectl create ns traefik
helm init --wait
helm install stable/traefik --name traefik --namespace traefik --set kubernetes.ingressClass=traefik --set kubernetes.ingressEndpoint.useDefaultPublishedService=true
```

Get the IP address of the traefik ingress controller service using [kubectl get][kubectl-get].

```console
kubectl get svc -n traefik --watch
```

The sample output shows the IP addresses for all the services in the *traefik* name space.

```console
NAME      TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)                      AGE
traefik   LoadBalancer   10.0.205.78   <pending>     80:32484/TCP,443:30620/TCP   20s
...
traefik   LoadBalancer   10.0.205.78   MY_EXTERNAL_IP   80:32484/TCP,443:30620/TCP   60s
```

Add an *A* record to your DNS zone with the external IP address of the traefik service using [az network dns record-set a add-record][az-network-dns-record-set-a-add-record].

```console
az network dns record-set a add-record \
    --resource-group myResourceGroup \
    --zone-name MY_CUSTOM_DOMAIN \
    --record-set-name *.traefik \
    --ipv4-address MY_EXTERNAL_IP
```

The above example adds an *A* record to the *MY_CUSTOM_DOMAIN* DNS zone.

In this article, you use the [Azure Dev Spaces Bike Sharing sample application](https://github.com/Azure/dev-spaces/tree/master/samples/BikeSharingApp) to demonstrate using Azure Dev Spaces. Clone the application from GitHub and navigate into its directory:

```cmd
git clone https://github.com/Azure/dev-spaces
cd dev-spaces/samples/BikeSharingApp/charts
```

Open [values.yaml][values-yaml] and replace all instances of *<REPLACE_ME_WITH_HOST_SUFFIX>* with *traefik.MY_CUSTOM_DOMAIN* using your domain for *MY_CUSTOM_DOMAIN*. Also replace *kubernetes.io/ingress.class: traefik-azds  # Dev Spaces-specific* with *kubernetes.io/ingress.class: traefik  # Custom Ingress*. Below is an example of an updated `values.yaml` file:

```yaml
# This is a YAML-formatted file.
# Declare variables to be passed into your templates.

bikesharingweb:
  ingress:
    annotations:
      kubernetes.io/ingress.class: traefik  # Custom Ingress
    hosts:
      - dev.bikesharingweb.traefik.MY_CUSTOM_DOMAIN  # Assumes deployment to the 'dev' space

gateway:
  ingress:
    annotations:
      kubernetes.io/ingress.class: traefik  # Custom Ingress
    hosts:
      - dev.gateway.traefik.MY_CUSTOM_DOMAIN  # Assumes deployment to the 'dev' space
```

Save your changes and close the file.

Deploy the sample application using `helm install`.

```console
helm install -n bikesharing . --dep-up --namespace dev --atomic
```

The above example deploys the sample application to the *dev* namespace.

Select the *dev* space with your sample application using `azds space select` and display the URLs to access the sample application using `azds list-uris`.

```console
azds space select -n dev
azds list-uris
```

The below output shows the example URLs from `azds list-uris`.

```console
Uri                                                  Status
---------------------------------------------------  ---------
http://dev.bikesharingweb.traefik.MY_CUSTOM_DOMAIN/  Available
http://dev.gateway.traefik.MY_CUSTOM_DOMAIN/         Available
```

Navigate to the *bikesharingweb* service by opening the public URL from the `azds list-uris` command. In the above example, the public URL for the *bikesharingweb* service is `http://dev.bikesharingweb.traefik.MY_CUSTOM_DOMAIN/`.

Use the `azds space select` command to create a child space under *dev* and list the URLs to access the child dev space.

```console
azds space select -n dev/azureuser1 -y
azds list-uris
```

The below output shows the example URLs from `azds list-uris` to access the sample application in the *azureuser1* child dev space.

```console
Uri                                                  Status
---------------------------------------------------  ---------
http://azureuser1.s.dev.bikesharingweb.traefik.MY_CUSTOM_DOMAIN/  Available
http://azureuser1.s.dev.gateway.traefik.MY_CUSTOM_DOMAIN/         Available
```

Navigate to the *bikesharingweb* service in the *azureuser1* child dev space by opening the public URL from the `azds list-uris` command. In the above example, the public URL for the *bikesharingweb* service in the *azureuser1* child dev space is `http://azureuser1.s.dev.bikesharingweb.traefik.MY_CUSTOM_DOMAIN/`.

## Configure the traefik ingress controller to use HTTPS

Create a `dev-spaces/samples/BikeSharingApp/traefik-values.yaml` file similar to the below example. Update the *email* value with your own email, which is used to generate the certificate with Let's Encrypt.

```yaml
fullnameOverride: traefik
replicas: 1
cpuLimit: 400m
memoryRequest: 200Mi
memoryLimit: 500Mi
externalTrafficPolicy: Local
kubernetes:
  ingressClass: traefik
  ingressEndpoint:
    useDefaultPublishedService: true
dashboard:
  enabled: false
debug:
  enabled: false
accessLogs:
  enabled: true
  fields:
    defaultMode: keep
    headers:
      defaultMode: keep
      names:
        Authorization: redact
acme:
  enabled: true
  email: "someone@example.com"
  staging: false
  challengeType: tls-alpn-01
ssl:
  enabled: true
  enforced: true
  permanentRedirect: true
  tlsMinVersion: VersionTLS12
  cipherSuites:
    - TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
    - TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
    - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
    - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
    - TLS_RSA_WITH_AES_128_GCM_SHA256
    - TLS_RSA_WITH_AES_256_GCM_SHA384
    - TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
```

Update your *traefik* service using `helm repo update` and including the *traefik-values.yaml* file you created.

```console
cd ..
helm upgrade traefik stable/traefik --namespace traefik --values traefik-values.yaml
```

The above command runs a new version of the traefik service using the values from *traefik-values.yaml* and removes the previous service. The traefik service also creates a TLS certificate using Let's Encrypt and starts redirecting web traffic to use HTTPS.

> [!NOTE]
> It may take a few minutes for the new version of the traefik service to start. You can check the progress using `kubectl get pods --namespace traefik --watch`.

Navigate to the sample application in the *dev/azureuser1* child space and notice you are redirected to use HTTPS. Also notice that the page loads, but the browser shows some errors. Opening the browser console shows the error relates to an HTTPS page trying to load HTTP resources. For example:

```console
Mixed Content: The page at 'https://azureuser1.s.dev.bikesharingweb.traefik.MY_CUSTOM_DOMAIN/devsignin' was loaded over HTTPS, but requested an insecure resource 'http://azureuser1.s.dev.gateway.traefik.MY_CUSTOM_DOMAIN/api/user/allUsers'. This request has been blocked; the content must be served over HTTPS.
```

To fix this error, update [BikeSharingWeb/azds.yaml][azds-yaml] to use *traefik* for *kubernetes.io/ingress.class* and your custom domain for *$(hostSuffix)*. For example:

```yaml
...
    ingress:
      annotations:
        kubernetes.io/ingress.class: traefik
      hosts:
      # This expands to [space.s.][rootSpace.]bikesharingweb.<random suffix>.<region>.azds.io
      - $(spacePrefix)$(rootSpacePrefix)bikesharingweb.traefik.MY_CUSTOM_DOMAIN
...
```

Update [BikeSharingWeb/package.json][package-json] with a dependency for the *url* package.

```json
{
...
    "react-responsive": "^6.0.1",
    "universal-cookie": "^3.0.7",
    "url": "0.11.0"
  },
...
```

Update the *getApiHostAsync* method in [BikeSharingWeb/pages/helpers.js][helpers-js] to use HTTPS:

```javascript
...
    getApiHostAsync: async function() {
        const apiRequest = await fetch('/api/host');
        const data = await apiRequest.json();
        
        var urlapi = require('url');
        var url = urlapi.parse(data.apiHost);

        console.log('apiHost: ' + "https://"+url.host);
        return "https://"+url.host;
    },
...
```

Navigate to the `BikeSharingWeb` directory and use `azds up` to run your updated BikeSharingWeb service.

```console
cd BikeSharingWeb/
azds up
```

Navigate to the sample application in the *dev/azureuser1* child space and notice you are redirected to use HTTPS without any errors.

## Next steps

Learn how Azure Dev Spaces helps you develop more complex applications across multiple containers, and how you can simplify collaborative development by working with different versions or branches of your code in different spaces.

> [!div class="nextstepaction"]
> [Team development in Azure Dev Spaces][team-development-qs]


[az-cli]: /cli/azure/install-azure-cli?view=azure-cli-latest
[az-aks-get-credentials]: /cli/azure/aks?view=azure-cli-latest#az-aks-get-credentials
[az-network-dns-record-set-a-add-record]: /cli/azure/network/dns/record-set/a?view=azure-cli-latest#az-network-dns-record-set-a-add-record
[custom-domain]: ../../app-service/manage-custom-dns-buy-domain.md#buy-the-domain
[dns-zone]: ../../dns/dns-getstarted-cli.md
[qs-cli]: ../quickstart-cli.md
[team-development-qs]: ../quickstart-team-development.md

[azds-yaml]: https://github.com/Azure/dev-spaces/blob/master/samples/BikeSharingApp/BikeSharingWeb/azds.yaml
[azure-account-create]: https://azure.microsoft.com/free
[helm-installed]: https://github.com/helm/helm/blob/master/docs/install.md
[helpers-js]: https://github.com/Azure/dev-spaces/blob/master/samples/BikeSharingApp/BikeSharingWeb/pages/helpers.js#L7
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[package-json]: https://github.com/Azure/dev-spaces/blob/master/samples/BikeSharingApp/BikeSharingWeb/package.json
[values-yaml]: https://github.com/Azure/dev-spaces/blob/master/samples/BikeSharingApp/charts/values.yaml