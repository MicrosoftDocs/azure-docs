---
title: Use your TLS certificates for ingress
titleSuffix: Azure Kubernetes Service
description: Learn how to install and configure an NGINX ingress controller that uses your own certificates in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 08/17/2020

---

# Create an HTTPS ingress controller and use your own TLS certificates on Azure Kubernetes Service (AKS)

An ingress controller is a piece of software that provides reverse proxy, configurable traffic routing, and TLS termination for Kubernetes services. Kubernetes ingress resources are used to configure the ingress rules and routes for individual Kubernetes services. Using an ingress controller and ingress rules, a single IP address can be used to route traffic to multiple services in a Kubernetes cluster.

This article shows you how to deploy the [NGINX ingress controller][nginx-ingress] in an Azure Kubernetes Service (AKS) cluster. You generate your own certificates, and create a Kubernetes secret for use with the ingress route. Finally, two applications are run in the AKS cluster, each of which is accessible over a single IP address.

You can also:

- [Create a basic ingress controller with external network connectivity][aks-ingress-basic]
- [Enable the HTTP application routing add-on][aks-http-app-routing]
- [Create an ingress controller that uses an internal, private network and IP address][aks-ingress-internal]
- Create an ingress controller that uses Let's Encrypt to automatically generate TLS certificates [with a dynamic public IP address][aks-ingress-tls] or [with a static public IP address][aks-ingress-static-tls]

## Before you begin

This article uses [Helm 3][helm] to install the NGINX ingress controller. Make sure that you are using the latest release of Helm and have access to the *ingress-nginx* Helm repository. For upgrade instructions, see the [Helm install docs][helm-install]. For more information on configuring and using Helm, see [Install applications with Helm in Azure Kubernetes Service (AKS)][use-helm].

This article also requires that you are running the Azure CLI version 2.0.64 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## Create an ingress controller

To create the ingress controller, use `Helm` to install *nginx-ingress*. For added redundancy, two replicas of the NGINX ingress controllers are deployed with the `--set controller.replicaCount` parameter. To fully benefit from running replicas of the ingress controller, make sure there's more than one node in your AKS cluster.

The ingress controller also needs to be scheduled on a Linux node. Windows Server nodes shouldn't run the ingress controller. A node selector is specified using the `--set nodeSelector` parameter to tell the Kubernetes scheduler to run the NGINX ingress controller on a Linux-based node.

> [!TIP]
> The following example creates a Kubernetes namespace for the ingress resources named *ingress-basic*. Specify a namespace for your own environment as needed. If your AKS cluster is not Kubernetes RBAC enabled, add `--set rbac.create=false` to the Helm commands.

> [!TIP]
> If you would like to enable [client source IP preservation][client-source-ip] for requests to containers in your cluster, add `--set controller.service.externalTrafficPolicy=Local` to the Helm install command. The client source IP is stored in the request header under *X-Forwarded-For*. When using an ingress controller with client source IP preservation enabled, TLS pass-through will not work.

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
    --set controller.admissionWebhooks.patch.nodeSelector."beta\.kubernetes\.io/os"=linux
```

During the installation, an Azure public IP address is created for the ingress controller. This public IP address is static for the life-span of the ingress controller. If you delete the ingress controller, the public IP address assignment is lost. If you then create an additional ingress controller, a new public IP address is assigned. If you wish to retain the use of the public IP address, you can instead [create an ingress controller with a static public IP address][aks-ingress-static-tls].

To get the public IP address, use the `kubectl get service` command.

```console
kubectl --namespace ingress-basic get services -o wide -w nginx-ingress-ingress-nginx-controller
```

It takes a few minutes for the IP address to be assigned to the service.

```
$ kubectl --namespace ingress-basic get services -o wide -w nginx-ingress-ingress-nginx-controller

NAME                                     TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)                      AGE   SELECTOR
nginx-ingress-ingress-nginx-controller   LoadBalancer   10.0.74.133   EXTERNAL_IP     80:32486/TCP,443:30953/TCP   44s   app.kubernetes.io/component=controller,app.kubernetes.io/instance=nginx-ingress,app.kubernetes.io/name=ingress-nginx
```

Make a note of this public IP address, as it's used in the last step to test the deployment.

No ingress rules have been created yet. If you browse to the public IP address, the NGINX ingress controller's default 404 page is displayed.

## Generate TLS certificates

For this article, let's generate a self-signed certificate with `openssl`. For production use, you should request a trusted, signed certificate through a provider or your own certificate authority (CA). In the next step, you generate a Kubernetes *Secret* using the TLS certificate and private key generated by OpenSSL.

The following example generates a 2048-bit RSA X509 certificate valid for 365 days named *aks-ingress-tls.crt*. The private key file is named *aks-ingress-tls.key*. A Kubernetes TLS secret requires both of these files.

This article works with the *demo.azure.com* subject common name and doesn't need to be changed. For production use, specify your own organizational values for the `-subj` parameter:

```console
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -out aks-ingress-tls.crt \
    -keyout aks-ingress-tls.key \
    -subj "/CN=demo.azure.com/O=aks-ingress-tls"
```

## Create Kubernetes secret for the TLS certificate

To allow Kubernetes to use the TLS certificate and private key for the ingress controller, you create and use a Secret. The secret is defined once, and uses the certificate and key file created in the previous step. You then reference this secret when you define ingress routes.

The following example creates a Secret name *aks-ingress-tls*:

```console
kubectl create secret tls aks-ingress-tls \
    --namespace ingress-basic \
    --key aks-ingress-tls.key \
    --cert aks-ingress-tls.crt
```

## Run demo applications

An ingress controller and a Secret with your certificate have been configured. Now let's run two demo applications in your AKS cluster. In this example, Helm is used to deploy two instances of a simple 'Hello world' application.

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

In the following example, traffic to the address `https://demo.azure.com/` is routed to the service named `aks-helloworld`. Traffic to the address `https://demo.azure.com/hello-world-two` is routed to the `ingress-demo` service. For this article, you don't need to change those demo host names. For production use, provide the names specified as part of the certificate request and generation process.

> [!TIP]
> If the host name specified during the certificate request process, the CN name, doesn't match the host defined in your ingress route, you ingress controller displays a *Kubernetes Ingress Controller Fake Certificate* warning. Make sure your certificate and ingress route host names match.

The *tls* section tells the ingress route to use the Secret named *aks-ingress-tls* for the host *demo.azure.com*. Again, for production use, specify your own host address.

Create a file named `hello-world-ingress.yaml` and copy in the following example YAML.

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: hello-world-ingress
  namespace: ingress-basic
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  tls:
  - hosts:
    - demo.azure.com
    secretName: aks-ingress-tls
  rules:
  - host: demo.azure.com
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

Create the ingress resource using the `kubectl apply -f hello-world-ingress.yaml` command.

```console
kubectl apply -f hello-world-ingress.yaml
```

The example output shows the ingress resource is created.

```
$ kubectl apply -f hello-world-ingress.yaml

ingress.extensions/hello-world-ingress created
```

## Test the ingress configuration

To test the certificates with our fake *demo.azure.com* host, use `curl` and specify the *--resolve* parameter. This parameter lets you map the *demo.azure.com* name to the public IP address of your ingress controller. Specify the public IP address of your own ingress controller, as shown in the following example:

```
curl -v -k --resolve demo.azure.com:443:EXTERNAL_IP https://demo.azure.com
```

No additional path was provided with the address, so the ingress controller defaults to the */* route. The first demo application is returned, as shown in the following condensed example output:

```
$ curl -v -k --resolve demo.azure.com:443:EXTERNAL_IP https://demo.azure.com

[...]
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <link rel="stylesheet" type="text/css" href="/static/default.css">
    <title>Welcome to Azure Kubernetes Service (AKS)</title>
[...]
```

The *-v* parameter in our `curl` command outputs verbose information, including the TLS certificate received. Half-way through your curl output, you can verify that your own TLS certificate was used. The *-k* parameter continues loading the page even though we're using a self-signed certificate. The following example shows that the *issuer: CN=demo.azure.com; O=aks-ingress-tls* certificate was used:

```
[...]
* Server certificate:
*  subject: CN=demo.azure.com; O=aks-ingress-tls
*  start date: Oct 22 22:13:54 2018 GMT
*  expire date: Oct 22 22:13:54 2019 GMT
*  issuer: CN=demo.azure.com; O=aks-ingress-tls
*  SSL certificate verify result: self signed certificate (18), continuing anyway.
[...]
```

Now add */hello-world-two* path to the address, such as `https://demo.azure.com/hello-world-two`. The second demo application with the custom title is returned, as shown in the following condensed example output:

```
$ curl -v -k --resolve demo.azure.com:443:EXTERNAL_IP https://demo.azure.com/hello-world-two

[...]
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <link rel="stylesheet" type="text/css" href="/static/default.css">
    <title>AKS Ingress Demo</title>
[...]
```

## Clean up resources

This article used Helm to install the ingress components and sample apps. When you deploy a Helm chart, a number of Kubernetes resources are created. These resources include pods, deployments, and services. To clean up these resources, you can either delete the entire sample namespace, or the individual resources.

### Delete the sample namespace and all resources

To delete the entire sample namespace, use the `kubectl delete` command and specify your namespace name. All the resources in the namespace are deleted.

```console
kubectl delete namespace ingress-basic
```

### Delete resources individually

Alternatively, a more granular approach is to delete the individual resources created. List the Helm releases with the `helm list` command. 

```console
helm list --namespace ingress-basic
```

Look for chart named *nginx-ingress* as shown in the following example output:

```
$ helm list --namespace ingress-basic

NAME                    NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                   APP VERSION
nginx-ingress           ingress-basic   1               2020-01-06 19:55:46.358275 -0600 CST    deployed        nginx-ingress-1.27.1    0.26.1 
```

Uninstall the releases with the `helm uninstall` command. 

```console
helm uninstall nginx-ingress --namespace ingress-basic
```

The following example uninstalls the NGINX ingress deployment.

```
$ helm uninstall nginx-ingress --namespace ingress-basic

release "nginx-ingress" uninstalled
```

Next, remove the two sample applications:

```console
kubectl delete -f aks-helloworld.yaml --namespace ingress-basic
kubectl delete -f ingress-demo.yaml --namespace ingress-basic
```

Remove the ingress route that directed traffic to the sample apps:

```console
kubectl delete -f hello-world-ingress.yaml
```

Delete the certificate Secret:

```console
kubectl delete secret aks-ingress-tls --namespace ingress-basic
```

Finally, you can delete the itself namespace. Use the `kubectl delete` command and specify your namespace name:

```console
kubectl delete namespace ingress-basic
```

## Next steps

This article included some external components to AKS. To learn more about these components, see the following project pages:

- [Helm CLI][helm-cli]
- [NGINX ingress controller][nginx-ingress]

You can also:

- [Create a basic ingress controller with external network connectivity][aks-ingress-basic]
- [Enable the HTTP application routing add-on][aks-http-app-routing]
- [Create an ingress controller that uses an internal, private network and IP address][aks-ingress-internal]
- Create an ingress controller that uses Let's Encrypt to automatically generate TLS certificates [with a dynamic public IP address][aks-ingress-tls] or [with a static public IP address][aks-ingress-static-tls]

<!-- LINKS - external -->
[helm-cli]: ./kubernetes-helm.md
[nginx-ingress]: https://github.com/kubernetes/ingress-nginx
[helm]: https://helm.sh/
[helm-install]: https://docs.helm.sh/using_helm/#installing-helm

<!-- LINKS - internal -->
[use-helm]: kubernetes-helm.md
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-network-public-ip-create]: /cli/azure/network/public-ip#az_network_public_ip_create
[aks-ingress-internal]: ingress-internal-ip.md
[aks-ingress-static-tls]: ingress-static-ip.md
[aks-ingress-basic]: ingress-basic.md
[aks-http-app-routing]: http-application-routing.md
[aks-ingress-tls]: ingress-tls.md
[client-source-ip]: concepts-network.md#ingress-controllers
