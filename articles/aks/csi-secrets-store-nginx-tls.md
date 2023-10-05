---
title: Set up Secrets Store CSI Driver to enable NGINX Ingress Controller with TLS on Azure Kubernetes Service (AKS)
description: How to configure Secrets Store CSI Driver to enable NGINX Ingress Controller with TLS for Azure Kubernetes Service (AKS). 
author: nickomang
ms.author: nickoman
ms.topic: how-to
ms.date: 06/05/2023
ms.custom: template-how-to
---

# Set up Secrets Store CSI Driver to enable NGINX Ingress Controller with TLS

This article walks you through the process of securing an NGINX Ingress Controller with TLS with an Azure Kubernetes Service (AKS) cluster and an Azure Key Vault (AKV) instance. For more information, see [TLS in Kubernetes][kubernetes-ingress-tls].

You can import the ingress TLS certificate to the cluster using one of the following methods:

- **Application**: The application deployment manifest declares and mounts the provider volume. Only when you deploy the application is the certificate made available in the cluster. When you remove the application, the secret is also removed. This scenario fits development teams responsible for the application’s security infrastructure and its integration with the cluster.
- **Ingress Controller**: The ingress deployment is modified to declare and mount the provider volume. The secret is imported when ingress pods are created. The application’s pods have no access to the TLS certificate. This scenario fits scenarios where one team (for example, IT) manages and creates infrastructure and networking components (including HTTPS TLS certificates) and other teams manage application lifecycle.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Before you start, ensure your Azure CLI version is >= `2.30.0`, or [install the latest version](/cli/azure/install-azure-cli).
- An [AKS cluster with the Secrets Store CSI Driver configured][aks-cluster-secrets-csi].
- An [Azure Key Vault instance][aks-akv-instance].

## Generate a TLS certificate

- Generate a TLS certificate using the following command.

    ```bash
    export CERT_NAME=aks-ingress-cert
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -out aks-ingress-tls.crt \
        -keyout aks-ingress-tls.key \
        -subj "/CN=demo.azure.com/O=aks-ingress-tls"
    ```

### Import the certificate to AKV

1. Export the certificate to a PFX file using the following command.

    ```bash
    export AKV_NAME="[YOUR AKV NAME]"
    openssl pkcs12 -export -in aks-ingress-tls.crt -inkey aks-ingress-tls.key  -out $CERT_NAME.pfx
    # skip Password prompt
    ```

2. Import the certificate using the [`az keyvault certificate import`][az-key-vault-certificate-import] command.

    ```azurecli-interactive
    az keyvault certificate import --vault-name $AKV_NAME -n $CERT_NAME -f $CERT_NAME.pfx
    ```

## Deploy a SecretProviderClass

1. Export a new namespace using the following command.

    ```bash
    export NAMESPACE=ingress-basic
    ```

2. Create the namespace using the `kubectl create namespace` command.

    ```azurecli-interactive
    kubectl create namespace $NAMESPACE
    ```

3. Select a [method to provide an access identity][csi-ss-identity-access] and configure your SecretProviderClass YAML accordingly.

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

4. Apply the SecretProviderClass to your Kubernetes cluster using the `kubectl apply` command.

    ```bash
    kubectl apply -f secretProviderClass.yaml -n $NAMESPACE
    ```

## Deploy the ingress controller

### Add the official ingress chart repository

- Add the official ingress chart repository using the following `helm` commands.

    ```bash
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo update
    ```

### Configure and deploy the NGINX ingress

Depending on your scenario, you can choose to bind the certificate to either the application or to the ingress controller. Follow the below instructions according to your selection:

#### Bind certificate to application

- Bind the certificate to the application using the `helm install` command. The application’s deployment references the Secrets Store CSI Driver's Azure Key Vault provider.

    ```bash
    helm install ingress-nginx/ingress-nginx --generate-name \
        --namespace $NAMESPACE \
        --set controller.replicaCount=2 \
        --set controller.nodeSelector."kubernetes\.io/os"=linux \
        --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz \
        --set defaultBackend.nodeSelector."kubernetes\.io/os"=linux
    ```

#### Bind certificate to ingress controller

1. Bind the certificate to the ingress controller using the `helm install` command. The ingress controller’s deployment references the Secrets Store CSI Driver's Azure Key Vault provider.

    > [!NOTE]
    > 
    > - If not using Azure Active Directory (Azure AD) pod-managed identity as your method of access, remove the line with `--set controller.podLabels.aadpodidbinding=$AAD_POD_IDENTITY_NAME` .
    > 
    > - Also, binding the SecretProviderClass to a pod is required for the Secrets Store CSI Driver to mount it and generate the Kubernetes secret. See [Sync mounted content with a Kubernetes secret][az-keyvault-mirror-as-secret] .


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

2. Verify the Kubernetes secret was created using the `kubectl get secret` command.

    ```bash
    kubectl get secret -n $NAMESPACE

    NAME                                             TYPE                                  DATA   AGE
    ingress-tls-csi                                  kubernetes.io/tls                     2      1m34s
    ```

## Deploy the application

Again, the instructions change slightly depending on your scenario. Follow the instructions corresponding to the scenario you selected.

### Deploy the application using an application reference

1. Create a file named `aks-helloworld-one.yaml` with the following content.

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

2. Create a file named `aks-helloworld-two.yaml` with the following content.

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

3. Apply the YAML files to your cluster using the `kubectl apply` command.

    ```bash
    kubectl apply -f aks-helloworld-one.yaml -n $NAMESPACE
    kubectl apply -f aks-helloworld-two.yaml -n $NAMESPACE
    ```

4. Verify the Kubernetes secret was created using the `kubectl get secret` command.

    ```bash
    kubectl get secret -n $NAMESPACE

    NAME                                             TYPE                                  DATA   AGE
    ingress-tls-csi                                  kubernetes.io/tls                     2      1m34s
    ```

### Deploy the application using an ingress controller reference

1. Create a file named `aks-helloworld-one.yaml` with the following content.

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

2. Create a file named `aks-helloworld-two.yaml` with the following content.

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

3. Apply the YAML files to your cluster using the `kubectl apply` command.

    ```bash
    kubectl apply -f aks-helloworld-one.yaml -n $NAMESPACE
    kubectl apply -f aks-helloworld-two.yaml -n $NAMESPACE
    ```

## Deploy an ingress resource referencing the secret

We can now deploy a Kubernetes ingress resource referencing the secret.

1. Create a file name `hello-world-ingress.yaml` with the following content.

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

2. Make note of the `tls` section referencing the secret created earlier and apply the file to your cluster using the `kubectl apply` command.

    ```bash
    kubectl apply -f hello-world-ingress.yaml -n $NAMESPACE
    ```

## Obtain the external IP address of the ingress controller

- Get the external IP address for the ingress controller using the `kubectl get service` command.

    ```bash
    kubectl get service --namespace $NAMESPACE --selector app.kubernetes.io/name=ingress-nginx

    NAME                                       TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)                      AGE
    nginx-ingress-1588032400-controller        LoadBalancer   10.0.255.157   EXTERNAL_IP      80:31293/TCP,443:31265/TCP   19m
    nginx-ingress-1588032400-default-backend   ClusterIP      10.0.223.214   <none>           80/TCP                       19m
    ```

## Test ingress secured with TLS

1. Verify your ingress is properly configured with TLS using the following `curl` command. Make sure you use the external IP from the previous step.

    ```bash
    curl -v -k --resolve demo.azure.com:443:EXTERNAL_IP https://demo.azure.com
    ```

    Since another path wasn't provided with the address, the ingress controller defaults to the */* route. The first demo application is returned, as shown in the following condensed example output:

    ```output
    [...]
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <link rel="stylesheet" type="text/css" href="/static/default.css">
        <title>Welcome to Azure Kubernetes Service (AKS)</title>
    [...]
    ```

    The *-v* parameter in the `curl` command outputs verbose information, including the TLS certificate received. Halfway through your curl output, you can verify your own TLS certificate was used. The *-k* parameter continues loading the page even though we're using a self-signed certificate. The following example shows the *issuer: CN=demo.azure.com; O=aks-ingress-tls* certificate was used:

    ```output
    [...]
     * Server certificate:
     *  subject: CN=demo.azure.com; O=aks-ingress-tls
     *  start date: Oct 22 22:13:54 2021 GMT
     *  expire date: Oct 22 22:13:54 2022 GMT
     *  issuer: CN=demo.azure.com; O=aks-ingress-tls
     *  SSL certificate verify result: self signed certificate (18), continuing anyway.
    [...]
    ```

2. Add */hello-world-two* path to the address, such as `https://demo.azure.com/hello-world-two`, and verify the second demo application is properly configured.

    ```bash
    curl -v -k --resolve demo.azure.com:443:EXTERNAL_IP https://demo.azure.com/hello-world-two
    ```

    The second demo application with the custom title is returned, as shown in the following condensed example output:

    ```output
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
[aks-cluster-secrets-csi]: ./csi-secrets-store-driver.md
[aks-akv-instance]: ./csi-secrets-store-driver.md#create-or-use-an-existing-azure-key-vault
[az-key-vault-certificate-import]: /cli/azure/keyvault/certificate#az-keyvault-certificate-import
[az-keyvault-mirror-as-secret]: ./csi-secrets-store-driver.md#sync-mounted-content-with-a-kubernetes-secret

<!-- LINKS EXTERNAL -->
[kubernetes-ingress-tls]: https://kubernetes.io/docs/concepts/services-networking/ingress/#tls
