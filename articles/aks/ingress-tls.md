---
title: Create an HTTPS ingress with Azure Kubernetes Service (AKS) cluster
description: Learn how to install and configure an NGINX ingress controller that uses Let's Encrypt for automatic SSL certificate generation in an Azure Kubernetes Service (AKS) cluster.
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 08/30/2018
ms.author: iainfou
---

# Create an HTTPS ingress controller on Azure Kubernetes Service (AKS)

An ingress controller is a piece of software that provides reverse proxy, configurable traffic routing, and TLS termination for Kubernetes services. Kubernetes ingress resources are used to configure the ingress rules and routes for individual Kubernetes services. Using an ingress controller and ingress rules, a single IP address can be used to route traffic to multiple services in a Kubernetes cluster.

This article shows you how to deploy the [NGINX ingress controller][nginx-ingress] in an Azure Kubernetes Service (AKS) cluster. The [cert-manager][cert-manager] project is used to automatically generate and configure [Let's Encrypt][lets-encrypt] certificates. Finally, two applications are run in the AKS cluster, each of which is accessible over a single IP address.

You can also:

- [Create a basic ingress controller with external network connectivity][aks-ingress-basic]
- [Enable the HTTP application routing add-on][aks-http-app-routing]
- [Create an ingress controller that uses an internal, private network and IP address][aks-ingress-internal]
- [Create an ingress controller that uses your own TLS certificates][aks-ingress-own-tls]
- [Create an ingress controller that uses Let's Encrypt to automatically generate TLS certificates with a static public IP address][aks-ingress-static-tls]

## Before you begin

This article uses Helm to install the NGINX ingress controller, cert-manager, and a sample web app. You need to have Helm initialized within your AKS cluster and using a service account for Tiller. Make sure that you are using the [latest release of Helm][helm-latest]. Run `helm version` to confirm that you are using the latest version. For upgrade instructions, see the [Helm install docs][helm-install]. For more information on configuring and using Helm, see [Install applications with Helm in Azure Kubernetes Service (AKS)][use-helm].

This article also requires that you are running the Azure CLI version 2.0.41 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## Create an ingress controller

To create the ingress controller, use `Helm` to install *nginx-ingress*. For added redundancy, two replicas of the NGINX ingress controllers are deployed with the `--set controller.replicaCount` parameter. To fully benefit from running replicas of the ingress controller, make sure there's more than one node in your AKS cluster.

> [!TIP]
> The following example installs the ingress controller in the `kube-system` namespace. You can specify a different namespace for your own environment if desired. If your AKS cluster is not RBAC enabled, add `--set rbac.create=false` to the commands.

```console
helm install --name aks-ingress \
  --namespace kube-system \
  --set controller.replicaCount=2 \
  stable/nginx-ingress
```

During the installation, an Azure public IP address is created for the ingregit ss controller. This public IP address is static for the life-span of the ingress controller. If you delete the ingress controller, the public IP address assignment is lost. If you then create an additional ingress controller, a new public IP address is assigned. If you wish to retain the use of the public IP address, you can instead [create an ingress controller with a static public IP address][aks-ingress-static-tls].

To get the public IP address, use the `kubectl get service` command. It takes a few minutes for the IP address to be assigned to the service.

```bash
kubectl --namespace kube-system get services -o wide  aks-ingress-nginx-ingress-controller

NAME                                   TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)                      AGE       SELECTOR
aks-ingress-nginx-ingress-controller   LoadBalancer   10.0.173.35   13.71.184.136   80:32277/TCP,443:32644/TCP   30m       app=nginx-ingress,component=controller,release=aks-ingress
```

No ingress rules have been created yet. If you browse to the public IP address, the NGINX ingress controller's default 404 page is displayed.

## Configure a DNS name

For the HTTPS certificates to work correctly, configure an FQDN for the ingress controller IP address. Update the following script with the IP address of your ingress controller and a unique name that you would like to use for the FQDN:

```bash
#!/bin/bash
set -e
# DNS Name you want to associate with public IP address
DNSNAME_BASE="demo-aks-ingress"
# Namespace where the Ingress controller was launched
NS="kube-system"
# Ingress controller service name
SVC="aks-ingress-nginx-ingress-controller"

# Public IP address of your ingress controller
IP=$(kubectl get svc $SVC -n $NS --template="{{range .status.loadBalancer.ingress}}{{.ip}}{{end}}")

if [ ! -z $IP ]; then
  echo "External IP found:"
  echo $IP
  # Get the resource-id of the public ip
  echo "Obtaining resource ID for Public IP..."
  PUBLICIPID=$(az network public-ip list --query "[?ipAddress!=null]|[?contains(ipAddress, '$IP')].[id]" --output tsv)

  # Addind random numbers to avoid DNS collisions
  DNSNAME=$DNSNAME_BASE-`echo ${RANDOM:0:4}`
  # Update public ip address with DNS name
  echo "Adding DNS name \"$DNSNAME\" record to Public IP \"$IP\""
  az network public-ip update --ids $PUBLICIPID --dns-name $DNSNAME -o tsv --query dnsSettings.fqdn
else
  echo "Error: External IP was not found on \"$SVC\" in namespace \"$NS\". Plese confirm that the Ingress controller is running and that it has an External IP assigned by running:"
  echo "kubectl --namespace $NS get services -o wide $SVC"
fi
```

The ingress controller is now accessible through the FQDN that is displayed by the script.

## Install cert-manager

The NGINX ingress controller supports TLS termination. There are several ways to retrieve and configure certificates for HTTPS. This article demonstrates using [cert-manager][cert-manager], which provides automatic [Lets Encrypt][lets-encrypt] certificate generation and management functionality.

To install cert-manager controller with helm, use the [latest version of helm][helm-lastest]. For RBAC-enabled clusters, make sure that [Tiller is configured to create resources as a cluster administrator][use-helm]. For more detailed installation instructions and other methods of installation, visit the [cert-manager install docs][cert-manager-install].

Create a new namespace called `cert-manager`. Changing the name of this namespace will require modifications when installing the helm chart.

```bash
kubectl create namespace cert-manager
```

As part of the installation, a [ValidatingWebhookConfiguration][admission-webhook] resource needs to be deployed to validate Issuer, ClusterIssuer and Certificate resources. For more information about this webhoook, visit [cert-manager's Webhook component][cert-manager-webhook]. In order to install this resource, resource validation of the namespace must be disabled.

```bash
kubectl label namespace cert-manager certmanager.k8s.io/disable-validation=true
```

Cert-manager uses [CustomResourceDefinitions (CRD)][crd] to configure Certificate Authorities and request certificates. Install these CRDs with the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.6/deploy/manifests/00-crds.yaml
```

Update Helm's local repository cache:

```bash
helm repo update
```

To install the cert-manager controller, use the following `helm install` command (for clusters without RBAC enabled include the flags `--set rbac.create=false` and `--set serviceAccount.create=false`):

```bash
helm install \
  --name cert-manager \
  --namespace cert-manager \
  --version v0.6.0 \
  stable/cert-manager
```

Verify that the both pods `cert-manager` and `webhook` are running, and that the job `webhook-ca-sync` has completed. It might take a couple of minutes to get to that state. In case of errors, please refer to [cert-manager troubleshooting guide][cert-manager-troubleshooting].

```bash
kubectl get pods --namespace cert-manager
```

```console
NAME                                    READY     STATUS      RESTARTS   AGE
cert-manager-5bfb76677b-mschb           1/1       Running     0          53s
cert-manager-webhook-5c745c69f7-ghj82   1/1       Running     0          53s
cert-manager-webhook-ca-sync-c5tbq      0/1       Completed   1          53s
```


For more information on cert-manager configuration, see the [cert-manager project][cert-manager].

## Create a CA cluster issuer

> [!NOTE]
> This article uses the `staging` environment for Let's Encrypt. In production deployments, use `letsencrypt-prod` and `https://acme-v02.api.letsencrypt.org/directory` in the resource definitions and when installing the Helm chart.


Before certificates can be issued, cert-manager requires an [Issuer][cert-manager-issuer] or [ClusterIssuer][cert-manager-cluster-issuer] resource. These Kubernetes resources are identical in functionality, however `Issuer` works in a single namespace, and `ClusterIssuer` works across all namespaces. For more information, see the [cert-manager issuer][cert-manager-issuer] documentation.

Create a cluster issuer, such as `cluster-issuer.yaml`, using the following example manifest. Update the email address with a valid address from your organization:

```yaml
apiVersion: certmanager.k8s.io/v1alpha1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: user@contoso.com
    privateKeySecretRef:
      name: letsencrypt-staging
    http01: {}
```

To create the issuer, use the `kubectl apply -f cluster-issuer.yaml` command.

```
$ kubectl apply -f cluster-issuer.yaml

clusterissuer.certmanager.k8s.io/letsencrypt-staging created
```

## Run demo applications

An ingress controller and a certificate management solution have been configured. Now let's run two demo applications in your AKS cluster. In this example, Helm is used to deploy two instances of a simple 'Hello world' application.

Before you can install the sample Helm charts, add the Azure samples repository to your Helm environment as follows:

```console
helm repo add azure-samples https://azure-samples.github.io/helm-charts/
```

Create the first demo application from a Helm chart with the following command:

```console
helm install azure-samples/aks-helloworld
```

Now install a second instance of the demo application. For the second instance, you specify a new title so that the two applications are visually distinct. You also specify a unique service name:

```console
helm install azure-samples/aks-helloworld --set title="AKS Ingress Demo" --set serviceName="ingress-demo"
```

## Create an ingress route

Both applications are now running on your Kubernetes cluster, however they're configured with a service of type `ClusterIP`. As such, the applications aren't accessible from the internet. To make them publicly available, create a Kubernetes ingress resource. The ingress resource configures the rules that route traffic to one of the two applications.

In the following example, traffic to the address `https://demo-aks-ingress.eastus.cloudapp.azure.com/` is routed to the service named `aks-helloworld`. Traffic to the address `https://demo-aks-ingress.eastus.cloudapp.azure.com/hello-world-two` is routed to the `ingress-demo` service. Update the *hosts* and *host* to the DNS name you created in a previous step.

Create a file named `hello-world-ingress.yaml` and copy in the following example YAML.

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: hello-world-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    certmanager.k8s.io/cluster-issuer: letsencrypt-staging
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  tls:
  - hosts:
    - demo-aks-ingress.eastus.cloudapp.azure.com
    secretName: tls-secret
  rules:
  - host: demo-aks-ingress.eastus.cloudapp.azure.com
    http:
      paths:
      - path: /
        backend:
          serviceName: aks-helloworld
          servicePort: 80
      - path: /hello-world-two
        backend:
          serviceName: ingress-demo
          servicePort: 80
```

Create the ingress resource using the `kubectl apply -f hello-world-ingress.yaml` command.

```
$ kubectl apply -f hello-world-ingress.yaml

ingress.extensions/hello-world-ingress created
```

## Create a certificate object

Next, a certificate resource must be created. The certificate resource defines the desired X.509 certificate. For more information, see [cert-manager certificates][cert-manager-certificates].

Cert-manager has likely automatically created a certificate object for you using ingress-shim, which is automatically deployed with cert-manager since v0.2.2. For more information, see the [ingress-shim documentation][ingress-shim].

To verify that the certificate was created successfully, use the `kubectl describe certificate tls-secret` command.

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
apiVersion: certmanager.k8s.io/v1alpha1
kind: Certificate
metadata:
  name: tls-secret
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

To create the certificate resource, use the `kubectl apply -f certificates.yaml` command.

```
$ kubectl apply -f certificates.yaml

certificate.certmanager.k8s.io/tls-secret created
```

## Test the ingress configuration

Open a web browser to the FQDN of your Kubernetes ingress controller, such as *https://demo-aks-ingress.eastus.cloudapp.azure.com*.

As these examples use `letsencrypt-staging`, the issued SSL certificate is not trusted by the browser. Accept the warning prompt to continue to your application. The certificate information shows this *Fake LE Intermediate X1* certificate is issued by Let's Encrypt. This fake certificate indicates `cert-manager` processed the request correctly and received a certificate from the provider:

![Let's Encrypt staging certificate](media/ingress/staging-certificate.png)

When you change Let's Encrypt to use `prod` rather than `staging`, a trusted certificate issued by Let's Encrypt is used, as shown in the following example:

![Let's Encrypt certificate](media/ingress/certificate.png)

The demo application is shown in the web browser:

![Application example one](media/ingress/app-one.png)

Now add the */hello-world-two* path to the FQDN, such as *https://demo-aks-ingress.eastus.cloudapp.azure.com/hello-world-two*. The second demo application with the custom title is shown:

![Application example two](media/ingress/app-two.png)

## Clean up resources

This article used Helm to install the ingress components, certificates, and sample apps. When you deploy a Helm chart, a number of Kubernetes resources are created. These resources includes pods, deployments, and services. To clean up, first remove the certificate resources:

```console
kubectl delete -f certificates.yaml
kubectl delete -f cluster-issuer.yaml
```

Now list the Helm releases with the `helm list` command. Look for charts named *nginx-ingress*, *cert-manager*, and *aks-helloworld*, as shown in the following example output:

```
$ helm list

NAME                  	REVISION	UPDATED                 	STATUS  	CHART               	APP VERSION	NAMESPACE
billowing-kitten      	1       	Tue Oct 16 17:24:05 2018	DEPLOYED	nginx-ingress-0.22.1	0.15.0     	kube-system
loitering-waterbuffalo	1       	Tue Oct 16 17:26:16 2018	DEPLOYED	cert-manager-v0.3.4 	v0.3.2     	kube-system
flabby-deer           	1       	Tue Oct 16 17:27:06 2018	DEPLOYED	aks-helloworld-0.1.0	           	default
linting-echidna       	1       	Tue Oct 16 17:27:02 2018	DEPLOYED	aks-helloworld-0.1.0	           	default
```

Delete the releases with the `helm delete` command. The following example deletes the NGINX ingress deployment, certificate manager, and the two sample AKS hello world apps.

```
$ helm delete billowing-kitten loitering-waterbuffalo flabby-deer linting-echidna

release "billowing-kitten" deleted
release "loitering-waterbuffalo" deleted
release "flabby-deer" deleted
release "linting-echidna" deleted
```

Next, remove the Helm repo for the AKS hello world app:

```console
helm repo remove azure-samples
```

Finally, remove the ingress route that directed traffic to the sample apps:

```console
kubectl delete -f hello-world-ingress.yaml
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
- [Create an ingress controller that uses Let's Encrypt to automatically generate TLS certificates with a static public IP address][aks-ingress-static-tls]

<!-- LINKS - external -->
[helm-cli]: https://docs.microsoft.com/azure/aks/kubernetes-helm#install-helm-cli
[helm-latest]: https://github.com/helm/helm/releases/latest
[cert-manager-certificates]: https://cert-manager.readthedocs.io/en/latest/reference/certificates.html
[cert-manager-install]: https://cert-manager.readthedocs.io/en/latest/getting-started/install.html
[ingress-shim]: http://docs.cert-manager.io/en/latest/reference/ingress-shim.html
[cert-manager-cluster-issuer]: https://cert-manager.readthedocs.io/en/latest/reference/clusterissuers.html
[cert-manager-issuer]: https://cert-manager.readthedocs.io/en/latest/reference/issuers.html
[cert-manager-webhook]: https://cert-manager.readthedocs.io/en/latest/getting-started/webhook.html
[cert-manager-troubleshooting]: https://cert-manager.readthedocs.io/en/latest/getting-started/troubleshooting.html
[lets-encrypt]: https://letsencrypt.org/
[nginx-ingress]: https://github.com/kubernetes/ingress-nginx
[helm-install]: https://docs.helm.sh/using_helm/#installing-helm
[crd]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
[admission-webhook]: https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks

<!-- LINKS - internal -->
[use-helm]: kubernetes-helm.md
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-show]: /cli/azure/aks#az-aks-show
[az-network-public-ip-create]: /cli/azure/network/public-ip#az-network-public-ip-create
[aks-ingress-internal]: ingress-internal-ip.md
[aks-ingress-static-tls]: ingress-static-ip.md
[aks-ingress-basic]: ingress-basic.md
[aks-http-app-routing]: http-application-routing.md
[aks-ingress-own-tls]: ingress-own-tls.md
