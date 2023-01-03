---
title: Set up Secrets Store CSI Driver to enable NGINX Ingress Controller with TLS on Azure Kubernetes Service
description: How to configure Secrets Store CSI Driver to enable NGINX Ingress Controller with TLS for Azure Kubernetes Service (AKS). 
author: nickomang
ms.author: nickoman
ms.service: container-service
ms.topic: how-to
ms.date: 05/26/2022
ms.custom: template-how-to
---

# Set up Secrets Store CSI Driver to enable NGINX Ingress Controller with TLS

This article walks you through the process of securing an NGINX Ingress Controller with TLS with an Azure Kubernetes Service (AKS) cluster and an Azure Key Vault (AKV) instance. For more information, see [TLS in Kubernetes][kubernetes-ingress-tls].

Importing the ingress TLS certificate to the cluster can be accomplished using one of two methods:

- **Application** - The application deployment manifest declares and mounts the provider volume. Only when the application is deployed, is the certificate made available in the cluster, and when the application is removed the secret is removed as well. This scenario fits development teams who are responsible for the application’s security infrastructure and their integration with the cluster.
- **Ingress Controller** - The ingress deployment is modified to declare and mount the provider volume. The secret is imported when ingress pods are created. The application’s pods have no access to the TLS certificate. This scenario fits scenarios where one team (for example, IT) manages and creates infrastructure and networking components (including HTTPS TLS certificates) and other teams manage application lifecycle. In this case, ingress is specific to a single namespace/workload and is deployed in the same namespace as the application.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Before you start, ensure your Azure CLI version is >= `2.30.0`, or [install the latest version](/cli/azure/install-azure-cli).
- An AKS cluster with the Secrets Store CSI Driver configured.
- An Azure Key Vault instance.

## Generate a TLS certificate

```bash
export CERT_NAME=aks-ingress-cert
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -out aks-ingress-tls.crt \
    -keyout aks-ingress-tls.key \
    -subj "/CN=demo.azure.com/O=aks-ingress-tls"
```

### Import the certificate to AKV

```bash
export AKV_NAME="[YOUR AKV NAME]"
openssl pkcs12 -export -in aks-ingress-tls.crt -inkey aks-ingress-tls.key  -out $CERT_NAME.pfx
# skip Password prompt
```

```azurecli-interactive
az keyvault certificate import --vault-name $AKV_NAME -n $CERT_NAME -f $CERT_NAME.pfx
```

## Deploy a SecretProviderClass

First, create a new namespace:

```bash
export NAMESPACE=ingress-basic
```

```azurecli-interactive
kubectl create namespace $NAMESPACE
```

Select a [method to provide an access identity][csi-ss-identity-access] and configure your SecretProviderClass YAML accordingly. Additionally:

- Be sure to use `objectType=secret`, which is the only way to obtain the private key and the certificate from AKV.
- Set `kubernetes.io/tls` as the `type` in your `secretObjects` section.

See the following example of what your SecretProviderClass might look like:

```yml
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: azure-tls
spec:
  provider: azure
  secretObjects:                            # secretObjects defines the desired state of synced K8s secret objects
  - secretName: ingress-tls-csi
    type: kubernetes.io/tls
    data: 
    - objectName: $CERT_NAME
      key: tls.key
    - objectName: $CERT_NAME
      key: tls.crt
  parameters:
    usePodIdentity: "false"
    useVMManagedIdentity: "true"
    userAssignedIdentityID: <client id>
    keyvaultName: $AKV_NAME                 # the name of the AKV instance
    objects: |
      array:
        - |
          objectName: $CERT_NAME
          objectType: secret
    tenantId: $TENANT_ID                    # the tenant ID of the AKV instance
```

Apply the SecretProviderClass to your Kubernetes cluster:

```bash
kubectl apply -f secretProviderClass.yaml -n $NAMESPACE
```

## Deploy the ingress controller

### Add the official ingress chart repository

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
```

### Configure and deploy the NGINX ingress

As mentioned above, depending on your scenario, you can choose to bind the certificate to either the application or to the ingress controller. Follow the below instructions according to your selection:

#### Bind certificate to application

The application’s deployment will reference the Secrets Store CSI Driver's Azure Key Vault provider.

```bash
helm install ingress-nginx/ingress-nginx --generate-name \
    --namespace $NAMESPACE \
    --set controller.replicaCount=2 \
    --set controller.nodeSelector."kubernetes\.io/os"=linux \
    --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz \
    --set defaultBackend.nodeSelector."kubernetes\.io/os"=linux
```

#### Bind certificate to ingress controller

The ingress controller’s deployment will reference the Secrets Store CSI Driver's Azure Key Vault provider.

> [!NOTE]
> If not using Azure Active Directory (Azure AD) pod-managed identity as your method of access, remove the line with `--set controller.podLabels.aadpodidbinding=$AAD_POD_IDENTITY_NAME`

```bash
helm install ingress-nginx/ingress-nginx --generate-name \
    --namespace $NAMESPACE \
    --set controller.replicaCount=2 \
    --set controller.nodeSelector."kubernetes\.io/os"=linux \
    --set defaultBackend.nodeSelector."kubernetes\.io/os"=linux \
    --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz \
    --set controller.podLabels.aadpodidbinding=$AAD_POD_IDENTITY_NAME \
    -f - <<EOF
controller:
  extraVolumes:
      - name: secrets-store-inline
        csi:
          driver: secrets-store.csi.k8s.io
          readOnly: true
          volumeAttributes:
            secretProviderClass: "azure-tls"
  extraVolumeMounts:
      - name: secrets-store-inline
        mountPath: "/mnt/secrets-store"
        readOnly: true
EOF
```

Verify the Kubernetes secret has been created:

```bash
kubectl get secret -n $NAMESPACE

NAME                                             TYPE                                  DATA   AGE
ingress-tls-csi                                  kubernetes.io/tls                     2      1m34s
```

## Deploy the application

Again, depending on your scenario, the instructions will change slightly. Follow the instructions corresponding to the scenario you've selected so far:

### Deploy the application using an application reference

Create a file named `aks-helloworld-one.yaml` with the following content:

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aks-helloworld-one  
spec:
  replicas: 1
  selector:
    matchLabels:
      app: aks-helloworld-one
  template:
    metadata:
      labels:
        app: aks-helloworld-one
    spec:
      containers:
      - name: aks-helloworld-one
        image: mcr.microsoft.com/azuredocs/aks-helloworld:v1
        ports:
        - containerPort: 80
        env:
        - name: TITLE
          value: "Welcome to Azure Kubernetes Service (AKS)"
        volumeMounts:
        - name: secrets-store-inline
          mountPath: "/mnt/secrets-store"
          readOnly: true
      volumes:
      - name: secrets-store-inline
        csi:
          driver: secrets-store.csi.k8s.io
          readOnly: true
          volumeAttributes:
            secretProviderClass: "azure-tls"
---
apiVersion: v1
kind: Service
metadata:
  name: aks-helloworld-one  
spec:
  type: ClusterIP
  ports:
  - port: 80
  selector:
    app: aks-helloworld-one
```

Create a file named `aks-helloworld-two.yaml` with the following content:

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aks-helloworld-two  
spec:
  replicas: 1
  selector:
    matchLabels:
      app: aks-helloworld-two
  template:
    metadata:
      labels:
        app: aks-helloworld-two
    spec:
      containers:
      - name: aks-helloworld-two
        image: mcr.microsoft.com/azuredocs/aks-helloworld:v1
        ports:
        - containerPort: 80
        env:
        - name: TITLE
          value: "AKS Ingress Demo"
        volumeMounts:
        - name: secrets-store-inline
          mountPath: "/mnt/secrets-store"
          readOnly: true
      volumes:
      - name: secrets-store-inline
        csi:
          driver: secrets-store.csi.k8s.io
          readOnly: true
          volumeAttributes:
            secretProviderClass: "azure-tls"
---
apiVersion: v1
kind: Service
metadata:
  name: aks-helloworld-two
spec:
  type: ClusterIP
  ports:
  - port: 80
  selector:
    app: aks-helloworld-two
```

And apply them to your cluster:

```bash
kubectl apply -f aks-helloworld-one.yaml -n $NAMESPACE
kubectl apply -f aks-helloworld-two.yaml -n $NAMESPACE
```

Verify the Kubernetes secret has been created:

```bash
kubectl get secret -n $NAMESPACE

NAME                                             TYPE                                  DATA   AGE
ingress-tls-csi                                  kubernetes.io/tls                     2      1m34s
```

### Deploy the application using an ingress controller reference

Create a file named `aks-helloworld-one.yaml` with the following content:

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aks-helloworld-one  
spec:
  replicas: 1
  selector:
    matchLabels:
      app: aks-helloworld-one
  template:
    metadata:
      labels:
        app: aks-helloworld-one
    spec:
      containers:
      - name: aks-helloworld-one
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
  name: aks-helloworld-one
spec:
  type: ClusterIP
  ports:
  - port: 80
  selector:
    app: aks-helloworld-one
```

Create a file named `aks-helloworld-two.yaml` with the following content:

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aks-helloworld-two  
spec:
  replicas: 1
  selector:
    matchLabels:
      app: aks-helloworld-two
  template:
    metadata:
      labels:
        app: aks-helloworld-two
    spec:
      containers:
      - name: aks-helloworld-two
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
  name: aks-helloworld-two  
spec:
  type: ClusterIP
  ports:
  - port: 80
  selector:
    app: aks-helloworld-two
```

And apply them to your cluster:

```bash
kubectl apply -f aks-helloworld-one.yaml -n $NAMESPACE
kubectl apply -f aks-helloworld-two.yaml -n $NAMESPACE
```

## Deploy an ingress resource referencing the secret

Finally, we can deploy a Kubernetes ingress resource referencing our secret. Create a file name `hello-world-ingress.yaml` with the following content:

```yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-tls
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - demo.azure.com
    secretName: ingress-tls-csi
  rules:
  - host: demo.azure.com
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
```

Make note of the `tls` section referencing the secret we've created earlier, and apply the file to your cluster:

```bash
kubectl apply -f hello-world-ingress.yaml -n $NAMESPACE
```

## Obtain the external IP address of the ingress controller

Use `kubectl get service` to obtain the external IP address for the ingress controller.

```bash
kubectl get service --namespace $NAMESPACE --selector app.kubernetes.io/name=ingress-nginx

NAME                                       TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)                      AGE
nginx-ingress-1588032400-controller        LoadBalancer   10.0.255.157   EXTERNAL_IP      80:31293/TCP,443:31265/TCP   19m
nginx-ingress-1588032400-default-backend   ClusterIP      10.0.223.214   <none>           80/TCP                       19m 
```

## Test ingress secured with TLS

Use `curl` to verify your ingress has been properly configured with TLS. Be sure to use the external IP you've obtained from the previous step:

```bash
curl -v -k --resolve demo.azure.com:443:EXTERNAL_IP https://demo.azure.com
```

No additional path was provided with the address, so the ingress controller defaults to the */* route. The first demo application is returned, as shown in the following condensed example output:

```console
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
*  start date: Oct 22 22:13:54 2021 GMT
*  expire date: Oct 22 22:13:54 2022 GMT
*  issuer: CN=demo.azure.com; O=aks-ingress-tls
*  SSL certificate verify result: self signed certificate (18), continuing anyway.
[...]
```

Now add */hello-world-two* path to the address, such as `https://demo.azure.com/hello-world-two`. The second demo application with the custom title is returned, as shown in the following condensed example output:

```
curl -v -k --resolve demo.azure.com:443:EXTERNAL_IP https://demo.azure.com/hello-world-two

[...]
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <link rel="stylesheet" type="text/css" href="/static/default.css">
    <title>AKS Ingress Demo</title>
[...]
```

<!-- LINKS INTERNAL -->
[csi-ss-identity-access]: ./csi-secrets-store-identity-access.md
<!-- LINKS EXTERNAL -->
[kubernetes-ingress-tls]: https://kubernetes.io/docs/concepts/services-networking/ingress/#tls
