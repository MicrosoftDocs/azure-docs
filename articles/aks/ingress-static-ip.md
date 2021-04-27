---
title: Use ingress controller with static IP
titleSuffix: Azure Kubernetes Service
description: Learn how to install and configure an NGINX ingress controller with a static public IP address in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 08/17/2020


#Customer intent: As a cluster operator or developer, I want to use an ingress controller with a static IP address to handle the flow of incoming traffic and secure my apps using automatically generated TLS certificates.
---

# Create an ingress controller with a static public IP address in Azure Kubernetes Service (AKS)

An ingress controller is a piece of software that provides reverse proxy, configurable traffic routing, and TLS termination for Kubernetes services. Kubernetes ingress resources are used to configure the ingress rules and routes for individual Kubernetes services. Using an ingress controller and ingress rules, a single IP address can be used to route traffic to multiple services in a Kubernetes cluster.

This article shows you how to deploy the [NGINX ingress controller][nginx-ingress] in an Azure Kubernetes Service (AKS) cluster. The ingress controller is configured with a static public IP address. The [cert-manager][cert-manager] project is used to automatically generate and configure [Let's Encrypt][lets-encrypt] certificates. Finally, two applications are run in the AKS cluster, each of which is accessible over a single IP address.

You can also:

- [Create a basic ingress controller with external network connectivity][aks-ingress-basic]
- [Enable the HTTP application routing add-on][aks-http-app-routing]
- [Create an ingress controller that uses your own TLS certificates][aks-ingress-own-tls]
- [Create an ingress controller that uses Let's Encrypt to automatically generate TLS certificates with a dynamic public IP address][aks-ingress-tls]

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

This article uses [Helm 3][helm] to install the NGINX ingress controller and cert-manager. Make sure that you are using the latest release of Helm and have access to the *ingress-nginx* and *jetstack* Helm repositories. For upgrade instructions, see the [Helm install docs][helm-install]. For more information on configuring and using Helm, see [Install applications with Helm in Azure Kubernetes Service (AKS)][use-helm].

This article also requires that you are running the Azure CLI version 2.0.64 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## Create an ingress controller

By default, an NGINX ingress controller is created with a new public IP address assignment. This public IP address is only static for the life-span of the ingress controller, and is lost if the controller is deleted and re-created. A common configuration requirement is to provide the NGINX ingress controller an existing static public IP address. The static public IP address remains if the ingress controller is deleted. This approach allows you to use existing DNS records and network configurations in a consistent manner throughout the lifecycle of your applications.

If you need to create a static public IP address, first get the resource group name of the AKS cluster with the [az aks show][az-aks-show] command:

```azurecli-interactive
az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv
```

Next, create a public IP address with the *static* allocation method using the [az network public-ip create][az-network-public-ip-create] command. The following example creates a public IP address named *myAKSPublicIP* in the AKS cluster resource group obtained in the previous step:

```azurecli-interactive
az network public-ip create --resource-group MC_myResourceGroup_myAKSCluster_eastus --name myAKSPublicIP --sku Standard --allocation-method static --query publicIp.ipAddress -o tsv
```

> [!NOTE]
> The above commands create an IP address that will be deleted if you delete your AKS cluster. Alternatively, you can create an IP address in a different resource group which can be managed separately from your AKS cluster. If you create an IP address in a different resource group, ensure the cluster identity used by the AKS cluster has delegated permissions to the other resource group, such as *Network Contributor*. For more information, see [Use a static public IP address and DNS label with the AKS load balancer][aks-static-ip].

Now deploy the *nginx-ingress* chart with Helm. For added redundancy, two replicas of the NGINX ingress controllers are deployed with the `--set controller.replicaCount` parameter. To fully benefit from running replicas of the ingress controller, make sure there's more than one node in your AKS cluster.

You must pass two additional parameters to the Helm release so the ingress controller is made aware both of the static IP address of the load balancer to be allocated to the ingress controller service, and of the DNS name label being applied to the public IP address resource. For the HTTPS certificates to work correctly, a DNS name label is used to configure an FQDN for the ingress controller IP address.

1. Add the `--set controller.service.loadBalancerIP` parameter. Specify your own public IP address that was created in the previous step.
1. Add the `--set controller.service.annotations."service\.beta\.kubernetes\.io/azure-dns-label-name"` parameter. Specify a DNS name label to be applied to the public IP address that was created in the previous step.

The ingress controller also needs to be scheduled on a Linux node. Windows Server nodes shouldn't run the ingress controller. A node selector is specified using the `--set nodeSelector` parameter to tell the Kubernetes scheduler to run the NGINX ingress controller on a Linux-based node.

> [!TIP]
> The following example creates a Kubernetes namespace for the ingress resources named *ingress-basic*. Specify a namespace for your own environment as needed. If your AKS cluster is not Kubernetes RBAC enabled, add `--set rbac.create=false` to the Helm commands.

> [!TIP]
> If you would like to enable [client source IP preservation][client-source-ip] for requests to containers in your cluster, add `--set controller.service.externalTrafficPolicy=Local` to the Helm install command. The client source IP is stored in the request header under *X-Forwarded-For*. When using an ingress controller with client source IP preservation enabled, TLS pass-through will not work.

Update the following script with the **IP address** of your ingress controller and a **unique name** that you would like to use for the FQDN prefix.

> [!IMPORTANT]
> You must update replace *STATIC_IP* and *DNS_LABEL* with your own IP address and unique name when running the command.

```console
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
    --set controller.admissionWebhooks.patch.nodeSelector."beta\.kubernetes\.io/os"=linux \
    --set controller.service.loadBalancerIP="STATIC_IP" \
    --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-dns-label-name"="DNS_LABEL"
```

When the Kubernetes load balancer service is created for the NGINX ingress controller, your static IP address is assigned, as shown in the following example output:

```
$ kubectl --namespace ingress-basic get services -o wide -w nginx-ingress-ingress-nginx-controller

NAME                                     TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)                      AGE   SELECTOR
nginx-ingress-ingress-nginx-controller   LoadBalancer   10.0.74.133   EXTERNAL_IP     80:32486/TCP,443:30953/TCP   44s   app.kubernetes.io/component=controller,app.kubernetes.io/instance=nginx-ingress,app.kubernetes.io/name=ingress-nginx
```

No ingress rules have been created yet, so the NGINX ingress controller's default 404 page is displayed if you browse to the public IP address. Ingress rules are configured in the following steps.

You can verify that the DNS name label has been applied by querying the FQDN on the public IP address as follows:

```azurecli-interactive
az network public-ip list --resource-group MC_myResourceGroup_myAKSCluster_eastus --query "[?ipAddress=='myAKSPublicIP'].[dnsSettings.fqdn]" -o tsv
```

The ingress controller is now accessible through the IP address or the FQDN.

## Install cert-manager

The NGINX ingress controller supports TLS termination. There are several ways to retrieve and configure certificates for HTTPS. This article demonstrates using [cert-manager][cert-manager], which provides automatic [Lets Encrypt][lets-encrypt] certificate generation and management functionality.

> [!NOTE]
> This article uses the `staging` environment for Let's Encrypt. In production deployments, use `letsencrypt-prod` and `https://acme-v02.api.letsencrypt.org/directory` in the resource definitions and when installing the Helm chart.

To install the cert-manager controller in an Kubernetes RBAC-enabled cluster, use the following `helm install` command:

```console
# Label the cert-manager namespace to disable resource validation
kubectl label namespace ingress-basic cert-manager.io/disable-validation=true

# Add the Jetstack Helm repository
helm repo add jetstack https://charts.jetstack.io

# Update your local Helm chart repository cache
helm repo update

# Install the cert-manager Helm chart
helm install \
  cert-manager \
  --namespace ingress-basic \
  --version v0.16.1 \
  --set installCRDs=true \
  --set nodeSelector."beta\.kubernetes\.io/os"=linux \
  jetstack/cert-manager
```

For more information on cert-manager configuration, see the [cert-manager project][cert-manager].

## Create a CA cluster issuer

Before certificates can be issued, cert-manager requires an [Issuer][cert-manager-issuer] or [ClusterIssuer][cert-manager-cluster-issuer] resource. These Kubernetes resources are identical in functionality, however `Issuer` works in a single namespace, and `ClusterIssuer` works across all namespaces. For more information, see the [cert-manager issuer][cert-manager-issuer] documentation.

Create a cluster issuer, such as `cluster-issuer.yaml`, using the following example manifest. Update the email address with a valid address from your organization:

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: user@contoso.com
    privateKeySecretRef:
      name: letsencrypt-staging
    solvers:
    - http01:
        ingress:
          class: nginx
          podTemplate:
            spec:
              nodeSelector:
                "kubernetes.io/os": linux
```

To create the issuer, use the `kubectl apply` command.

```
kubectl apply -f cluster-issuer.yaml --namespace ingress-basic
```

The output should be similar to this example:

```
clusterissuer.cert-manager.io/letsencrypt-staging created
```

## Run demo applications

An ingress controller and a certificate management solution have been configured. Now let's run two demo applications in your AKS cluster. In this example, Helm is used to deploy two instances of a simple 'Hello world' application.

To see the ingress controller in action, run two demo applications in your AKS cluster. In this example, you use `kubectl apply` to deploy two instances of a simple *Hello world* application.

Create a *aks-helloworld.yaml* file and copy in the following example YAML:

```yml
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
spec:
  type: ClusterIP
  ports:
  - port: 80
  selector:
    app: aks-helloworld
```

Create a *ingress-demo.yaml* file and copy in the following example YAML:

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ingress-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ingress-demo
  template:
    metadata:
      labels:
        app: ingress-demo
    spec:
      containers:
      - name: ingress-demo
        image: mcr.microsoft.com/azuredocs/aks-helloworld:v1
        ports:
        - containerPort: 80
        env:
        - name: TITLE
          value: "AKS Ingress Demo"
---
apiVersion: v1
kind: Service
metadata:
  name: ingress-demo
spec:
  type: ClusterIP
  ports:
  - port: 80
  selector:
    app: ingress-demo
```

Run the two demo applications using `kubectl apply`:

```console
kubectl apply -f aks-helloworld.yaml --namespace ingress-basic
kubectl apply -f ingress-demo.yaml --namespace ingress-basic
```

## Create an ingress route

Both applications are now running on your Kubernetes cluster, however they're configured with a service of type `ClusterIP`. As such, the applications aren't accessible from the internet. To make them publicly available, create a Kubernetes ingress resource. The ingress resource configures the rules that route traffic to one of the two applications.

In the following example, traffic to the address `https://demo-aks-ingress.eastus.cloudapp.azure.com/` is routed to the service named `aks-helloworld`. Traffic to the address `https://demo-aks-ingress.eastus.cloudapp.azure.com/hello-world-two` is routed to the `ingress-demo` service. Update the *hosts* and *host* to the DNS name you created in a previous step.

Create a file named `hello-world-ingress.yaml` and copy in the following example YAML.

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: hello-world-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-staging
    nginx.ingress.kubernetes.io/rewrite-target: /$1
    nginx.ingress.kubernetes.io/use-regex: "true"
spec:
  tls:
  - hosts:
    - demo-aks-ingress.eastus.cloudapp.azure.com
    secretName: tls-secret
  rules:
  - host: demo-aks-ingress.eastus.cloudapp.azure.com
    http:
      paths:
      - backend:
          serviceName: aks-helloworld
          servicePort: 80
        path: /hello-world-one(/|$)(.*)
      - backend:
          serviceName: ingress-demo
          servicePort: 80
        path: /hello-world-two(/|$)(.*)
      - backend:
          serviceName: aks-helloworld
          servicePort: 80
        path: /(.*)
```

Create the ingress resource using the `kubectl apply` command.

```
kubectl apply -f hello-world-ingress.yaml --namespace ingress-basic
```

The output should be similar to this example:

```
ingress.extensions/hello-world-ingress created
```

## Create a certificate object

Next, a certificate resource must be created. The certificate resource defines the desired X.509 certificate. For more information, see [cert-manager certificates][cert-manager-certificates].

Cert-manager has likely automatically created a certificate object for you using ingress-shim, which is automatically deployed with cert-manager since v0.2.2. For more information, see the [ingress-shim documentation][ingress-shim].

To verify that the certificate was created successfully, use the `kubectl describe certificate tls-secret --namespace ingress-basic` command.

If the certificate was issued, you will see output similar to the following:
```
Type    Reason          Age   From          Message
----    ------          ----  ----          -------
  Normal  CreateOrder     11m   cert-manager  Created new ACME order, attempting validation...
  Normal  DomainVerified  10m   cert-manager  Domain "demo-aks-ingress.eastus.cloudapp.azure.com" verified with "http-01" validation
  Normal  IssueCert       10m   cert-manager  Issuing certificate...
  Normal  CertObtained    10m   cert-manager  Obtained certificate from ACME server
  Normal  CertIssued      10m   cert-manager  Certificate issued successfully
```

If you need to create an additional certificate resource, you can do so with the following example manifest. Update the *dnsNames* and *domains* to the DNS name you created in a previous step. If you use an internal-only ingress controller, specify the internal DNS name for your service.

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: Certificate
metadata:
  name: tls-secret
  namespace: ingress-basic
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
    name: letsencrypt-staging
    kind: ClusterIssuer
```

To create the certificate resource, use the `kubectl apply` command.

```
$ kubectl apply -f certificates.yaml

certificate.cert-manager.io/tls-secret created
```

## Test the ingress configuration

Open a web browser to the FQDN of your Kubernetes ingress controller, such as *`https://demo-aks-ingress.eastus.cloudapp.azure.com`*.

As these examples use `letsencrypt-staging`, the issued TLS/SSL certificate is not trusted by the browser. Accept the warning prompt to continue to your application. The certificate information shows this *Fake LE Intermediate X1* certificate is issued by Let's Encrypt. This fake certificate indicates `cert-manager` processed the request correctly and received a certificate from the provider:

![Let's Encrypt staging certificate](media/ingress/staging-certificate.png)

When you change Let's Encrypt to use `prod` rather than `staging`, a trusted certificate issued by Let's Encrypt is used, as shown in the following example:

![Let's Encrypt certificate](media/ingress/certificate.png)

The demo application is shown in the web browser:

![Application example one](media/ingress/app-one.png)

Now add the */hello-world-two* path to the FQDN, such as *`https://demo-aks-ingress.eastus.cloudapp.azure.com/hello-world-two`*. The second demo application with the custom title is shown:

![Application example two](media/ingress/app-two.png)

## Clean up resources

This article used Helm to install the ingress components, certificates, and sample apps. When you deploy a Helm chart, a number of Kubernetes resources are created. These resources includes pods, deployments, and services. To clean up these resources, you can either delete the entire sample namespace, or the individual resources.

### Delete the sample namespace and all resources

To delete the entire sample namespace, use the `kubectl delete` command and specify your namespace name. All the resources in the namespace are deleted.

```console
kubectl delete namespace ingress-basic
```

### Delete resources individually

Alternatively, a more granular approach is to delete the individual resources created. First, remove the certificate resources:

```console
kubectl delete -f certificates.yaml
kubectl delete -f cluster-issuer.yaml
```

Now list the Helm releases with the `helm list` command. Look for charts named *nginx-ingress* and *cert-manager* as shown in the following example output:

```
$ helm list --all-namespaces

NAME                    NAMESPACE       REVISION        UPDATED                        STATUS          CHART                   APP VERSION
nginx-ingress           ingress-basic   1               2020-01-11 14:51:03.454165006  deployed        nginx-ingress-1.28.2    0.26.2
cert-manager            ingress-basic   1               2020-01-06 21:19:03.866212286  deployed        cert-manager-v0.13.0    v0.13.0
```

Uninstall the releases with the `helm uninstall` command. The following example uninstalls the NGINX ingress deployment and certificate manager deployments.

```
$ helm uninstall nginx-ingress cert-manager -n ingress-basic

release "nginx-ingress" deleted
release "cert-manager" deleted
```

Next, remove the two sample applications:

```console
kubectl delete -f aks-helloworld.yaml --namespace ingress-basic
kubectl delete -f ingress-demo.yaml --namespace ingress-basic
```

Delete the itself namespace. Use the `kubectl delete` command and specify your namespace name:

```console
kubectl delete namespace ingress-basic
```

Finally, remove the static public IP address created for the ingress controller. Provide your *MC_* cluster resource group name obtained in the first step of this article, such as *MC_myResourceGroup_myAKSCluster_eastus*:

```azurecli-interactive
az network public-ip delete --resource-group MC_myResourceGroup_myAKSCluster_eastus --name myAKSPublicIP
```

## Next steps

This article included some external components to AKS. To learn more about these components, see the following project pages:

- [Helm CLI][helm-cli]
- [NGINX ingress controller][nginx-ingress]
- [cert-manager][cert-manager]

You can also:

- [Create a basic ingress controller with external network connectivity][aks-ingress-basic]
- [Enable the HTTP application routing add-on][aks-http-app-routing]
- [Create an ingress controller that uses an internal, private network and IP address][aks-ingress-internal]
- [Create an ingress controller that uses your own TLS certificates][aks-ingress-own-tls]
- [Create an ingress controller with a dynamic public IP and configure Let's Encrypt to automatically generate TLS certificates][aks-ingress-tls]

<!-- LINKS - external -->
[helm-cli]: ./kubernetes-helm.md
[cert-manager]: https://github.com/jetstack/cert-manager
[cert-manager-certificates]: https://cert-manager.readthedocs.io/en/latest/reference/certificates.html
[cert-manager-cluster-issuer]: https://cert-manager.readthedocs.io/en/latest/reference/clusterissuers.html
[cert-manager-issuer]: https://cert-manager.readthedocs.io/en/latest/reference/issuers.html
[lets-encrypt]: https://letsencrypt.org/
[nginx-ingress]: https://github.com/kubernetes/ingress-nginx
[helm]: https://helm.sh/
[helm-install]: https://docs.helm.sh/using_helm/#installing-helm
[ingress-shim]: https://docs.cert-manager.io/en/latest/tasks/issuing-certificates/ingress-shim.html

<!-- LINKS - internal -->
[use-helm]: kubernetes-helm.md
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-network-public-ip-create]: /cli/azure/network/public-ip#az_network_public_ip_create
[aks-ingress-internal]: ingress-internal-ip.md
[aks-ingress-basic]: ingress-basic.md
[aks-ingress-tls]: ingress-tls.md
[aks-http-app-routing]: http-application-routing.md
[aks-ingress-own-tls]: ingress-own-tls.md
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[client-source-ip]: concepts-network.md#ingress-controllers
[install-azure-cli]: /cli/azure/install-azure-cli
[aks-static-ip]: static-ip.md
