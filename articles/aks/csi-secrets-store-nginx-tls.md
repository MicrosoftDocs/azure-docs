---
title: Set up Secrets Store CSI Driver to enable NGINX Ingress Controller with TLS on Azure Kubernetes Service
description: How to configure Secrets Store CSI Driver to enable NGINX Ingress Controller with TLS for Azure Kubernetes Service (AKS). 
author: nickomang
ms.author: nickoman
ms.service: container-service
ms.topic: how-to
ms.date: 10/19/2021
ms.custom: template-how-to
---

# Set up Secrets Store CSI Driver to enable NGINX Ingress Controller with TLS

This article walks you through the process of securing an NGINX Ingress Controller with TLS with an Azure Kubernetes Service (AKS) cluster and an Azure Key Vault (AKV) instance. For more information, see [TLS in Kubernetes][kubernetes-ingress-tls].

Importing the ingress TLS certificate to the cluster can be accomplished using one of two methods:

- **Application** - The application deployment manifest declares and mounts the provider volume. Only when the application is deployed is the certificate made available in the cluster, and when the application is removed the secret is removed as well. This scenario fits development teams who are responsible for the application’s security infrastructure and their integration with the cluster.
- **Ingress Controller** - The ingress deployment is modified to declare and mount the provider volume. The secret is imported when ingress pods are created. The application’s pods have no access to the TLS certificate. This scenario fits scenarios where one team (i.e. IT) manages and provisions infrastructure and networking components (including HTTPS TLS certificates) and other teams manage application lifecycle. In this case, ingress is specific to a single namespace/workload and is deployed in the same namespace as the application.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Before you start, ensure your Azure CLI version is >= `2.30.0`, or [install the latest version](/cli/azure/install-azure-cli).
- An AKS cluster with the Secrets Store CSI Driver configured.
- An Azure Key Vault instance.

## Generate a TLS certificate

```bash
export CERT_NAME=ingresscert
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -out ingress-tls.crt \
    -keyout ingress-tls.key \
    -subj "/CN=demo.test.com/O=ingress-tls"
```

### Import the certificate to AKV

```bash
export AKV_NAME="[YOUR AKV NAME]"
openssl pkcs12 -export -in ingress-tls.crt -inkey ingress-tls.key  -out $CERT_NAME.pfx
# skip Password prompt
```

```azurecli-interactive
az keyvault certificate import --vault-name $AKV_NAME -n $CERT_NAME -f $CERT_NAME.pfx
```

## Deploy a SecretProviderClass

First, create a new namespace:

```bash
export NAMESPACE=ingress-test
```

```azurecli-interactive
kubectl create ns $NAMESPACE
```

Select a [method to provide an access identity][csi-ss-identity-access] and configure your SecretProviderClass YAML accordingly. Additionally:

- Be sure to use `objectType=secret`, which is the only way to obtain the private key and the certificate from AKV.
- Set `kubernetes.io/tls` as the `type` in your `secretObjects` section.

See the following for an example of what your SecretProviderClass might look like:

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
    --set controller.nodeSelector."beta\.kubernetes\.io/os"=linux \
    --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz \
    --set defaultBackend.nodeSelector."beta\.kubernetes\.io/os"=linux
```

#### Bind certificate to ingress controller

The ingress controller’s deployment will reference the Secrets Store CSI Driver's Azure Key Vault provider.

> [!NOTE]
> If not using Azure Active Directory (AAD) pod identity as your method of access, remove the line with `--set controller.podLabels.aadpodidbinding=$AAD_POD_IDENTITY_NAME`

```bash
helm install ingress-nginx/ingress-nginx --generate-name \
    --namespace $NAMESPACE \
    --set controller.replicaCount=2 \
    --set controller.nodeSelector."beta\.kubernetes\.io/os"=linux \
    --set defaultBackend.nodeSelector."beta\.kubernetes\.io/os"=linux \
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

Create a file named `deployment.yaml` with the following content:

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: busybox-one
  labels:
    app: busybox-one
spec:
  replicas: 1
  selector:
    matchLabels:
      app: busybox-one
  template:
    metadata:
      labels:
        app: busybox-one
    spec:
      containers:
      - name: busybox
        image: k8s.gcr.io/e2e-test-images/busybox:1.29-1
        command:
          - "/bin/sleep"
          - "10000"
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
  name: busybox-one
spec:
  type: ClusterIP
  ports:
  - port: 80
  selector:
    app: busybox-one
```

And apply it to your cluster:

```bash
kubectl apply -f deployment.yaml -n $NAMESPACE
```

Verify the Kubernetes secret has been created:

```bash
kubectl get secret -n $NAMESPACE

NAME                                             TYPE                                  DATA   AGE
ingress-tls-csi                                  kubernetes.io/tls                     2      1m34s
```

### Deploy the application using an ingress controller reference

Create a file named `deployment.yaml` with the following content:

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: busybox-one
  labels:
    app: busybox-one
spec:
  replicas: 1
  selector:
    matchLabels:
      app: busybox-one
  template:
    metadata:
      labels:
        app: busybox-one
    spec:
      containers:
      - name: busybox
        image: k8s.gcr.io/e2e-test-images/busybox:1.29-1
        command:
          - "/bin/sleep"
          - "10000"
---
apiVersion: v1
kind: Service
metadata:
  name: busybox-one
spec:
  type: ClusterIP
  ports:
  - port: 80
  selector:
    app: busybox-one
```

And apply it to your cluster:

```bash
kubectl apply -f deployment.yaml -n $NAMESPACE
```

## Deploy an ingress resource referencing the secret

Finally, we can deploy a Kubernetes ingress resource referencing our secret. Create a file name `ingress.yaml` with the following content:

```yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-tls
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/rewrite-target: /$1
spec:
  tls:
  - hosts:
    - demo.test.com
    secretName: ingress-tls-csi
  rules:
  - host: demo.test.com
    http:
      paths:
      - backend:
          service:
            name: busybox-one
            port:
              number: 80
        path: /(.*)
      - backend:
          service:
            name: busybox-two
            port:
              number: 80
        path: /two(/|$)(.*)
```

Make note of the `tls` section referencing the secret we've created earlier, and apply the file to your cluster:

```bash
kubectl apply -f ingress.yaml -n $NAMESPACE
```

## Obtain the external IP address of the ingress controller

Use `kubectl get service` to obtain the external IP address for the ingress controller.

```bash
 kubectl get service -l app=nginx-ingress --namespace $NAMESPACE

NAME                                       TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)                      AGE
nginx-ingress-1588032400-controller        LoadBalancer   10.0.255.157   52.xx.xx.xx      80:31293/TCP,443:31265/TCP   19m
nginx-ingress-1588032400-default-backend   ClusterIP      10.0.223.214   <none>           80/TCP                       19m 
```

## Test ingress secured with TLS

Use `curl` to verify your ingress has been properly configured with TLS. Be sure to use the external IP you've obtained from the previous step:

```bash
curl -v -k --resolve demo.test.com:443:52.xx.xx.xx https://demo.test.com

# You should see output similar to the following
*  subject: CN=demo.test.com; O=ingress-tls
*  start date: Oct 15 04:23:46 2021 GMT
*  expire date: Oct 15 04:23:46 2022 GMT
*  issuer: CN=demo.test.com; O=ingress-tls
*  SSL certificate verify result: self signed certificate (18), continuing anyway.
```

<!-- LINKS INTERNAL -->
[csi-ss-identity-access]: ./csi-secrets-store-identity-access.md
<!-- LINKS EXTERNAL -->
[kubernetes-ingress-tls]: https://kubernetes.io/docs/concepts/services-networking/ingress/#tls
