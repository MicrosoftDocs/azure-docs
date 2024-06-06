---
title: Secure ingress gateway for Istio service mesh add-on for Azure Kubernetes Service
description: Deploy secure ingress gateway for Istio service mesh add-on for Azure Kubernetes Service.
ms.topic: how-to
ms.service: azure-kubernetes-service
author: deveshdama
ms.date: 04/30/2024
ms.author: ddama
---

# Secure ingress gateway for Istio service mesh add-on for Azure Kubernetes Service

The [Deploy external or internal Istio Ingress][istio-deploy-ingress] article describes how to configure an ingress gateway to expose an HTTP service to external/internal traffic. This article shows how to expose a secure HTTPS service using either simple or mutual TLS.

## Prerequisites

- Enable the Istio add-on on the cluster as per [documentation][istio-deploy-addon]
  - [Set environment variables][istio-addon-env-vars]
  - [Install Istio add-on][istio-deploy-existing-cluster]
  - [Enable sidecar injection][enable-sidecar-injection]
  - [Deploy sample application][deploy-sample-application]

- Deploy an external Istio ingress gateway as per [documentation][istio-deploy-ingress]
  - [Enable external ingress gateway][enable-external-ingress-gateway]

> [!NOTE]
> This article refers to the external ingress gateway for demonstration, same steps would apply for configuring mutual TLS for internal ingress gateway.

## Required client/server certificates and keys

This article requires several certificates and keys. You can use your favorite tool to create them or you can use the following [openssl][openssl] commands.

1. Create a root certificate and private key for signing the certificates for sample services:
    
    ```bash
    mkdir bookinfo_certs
    openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -subj '/O=bookinfo Inc./CN=bookinfo.com' -keyout bookinfo_certs/bookinfo.com.key -out bookinfo_certs/bookinfo.com.crt
    ```

2. Generate a certificate and private key for `productpage.bookinfo.com`:
    
    ```bash
    openssl req -out bookinfo_certs/productpage.bookinfo.com.csr -newkey rsa:2048 -nodes -keyout bookinfo_certs/productpage.bookinfo.com.key -subj "/CN=productpage.bookinfo.com/O=product organization"
    openssl x509 -req -sha256 -days 365 -CA bookinfo_certs/bookinfo.com.crt -CAkey bookinfo_certs/bookinfo.com.key -set_serial 0 -in bookinfo_certs/productpage.bookinfo.com.csr -out bookinfo_certs/productpage.bookinfo.com.crt
    ```

3. Generate a client certificate and private key:

    ```bash
    openssl req -out bookinfo_certs/client.bookinfo.com.csr -newkey rsa:2048 -nodes -keyout bookinfo_certs/client.bookinfo.com.key -subj "/CN=client.bookinfo.com/O=client organization"
    openssl x509 -req -sha256 -days 365 -CA bookinfo_certs/bookinfo.com.crt -CAkey bookinfo_certs/bookinfo.com.key -set_serial 1 -in bookinfo_certs/client.bookinfo.com.csr -out bookinfo_certs/client.bookinfo.com.crt
    ```
    
## Configure a TLS ingress gateway

Create a Kubernetes TLS secret for the ingress gateway; use [Azure Key Vault][akv-basic-concepts] to host certificates/keys and [Azure Key Vault Secrets Provider add-on][akv-addon] to sync secrets to the cluster.

### Set up Azure Key Vault and sync secrets to the cluster

1. Create Azure Key Vault

    You need an [Azure Key Vault resource][akv-quickstart] to supply the certificate and key inputs to the Istio add-on.

    ```bash
    export AKV_NAME=<azure-key-vault-resource-name>  
    az keyvault create --name $AKV_NAME --resource-group $RESOURCE_GROUP --location $LOCATION
    ```
    
2. Enable [Azure Key Vault provider for Secret Store CSI Driver][akv-addon] add-on on your cluster.

    ```bash
    az aks enable-addons --addons azure-keyvault-secrets-provider --resource-group $RESOURCE_GROUP --name $CLUSTER
    ```
    
3. Authorize the user-assigned managed identity of the add-on to access Azure Key Vault resource using access policy. Alternatively, if your Key Vault is using Azure RBAC for the permissions model, follow the instructions [here][akv-rbac-guide] to assign an Azure role of Key Vault for the add-on's user-assigned managed identity.
    
    ```bash
    OBJECT_ID=$(az aks show --resource-group $RESOURCE_GROUP --name $CLUSTER --query 'addonProfiles.azureKeyvaultSecretsProvider.identity.objectId' -o tsv | tr -d '\r')
    CLIENT_ID=$(az aks show --resource-group $RESOURCE_GROUP --name $CLUSTER --query 'addonProfiles.azureKeyvaultSecretsProvider.identity.clientId')
    TENANT_ID=$(az keyvault show --resource-group $RESOURCE_GROUP --name $AKV_NAME --query 'properties.tenantId')
    
    az keyvault set-policy --name $AKV_NAME --object-id $OBJECT_ID --secret-permissions get list
    ```

4. Create secrets in Azure Key Vault using the certificates and keys.

    ```bash
    az keyvault secret set --vault-name $AKV_NAME --name test-productpage-bookinfo-key --file bookinfo_certs/productpage.bookinfo.com.key
    az keyvault secret set --vault-name $AKV_NAME --name test-productpage-bookinfo-crt --file bookinfo_certs/productpage.bookinfo.com.crt
    az keyvault secret set --vault-name $AKV_NAME --name test-bookinfo-crt --file bookinfo_certs/bookinfo.com.crt
    ```
    
5. Use the following manifest to deploy SecretProviderClass to provide Azure Key Vault specific parameters to the CSI driver.
    
    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: secrets-store.csi.x-k8s.io/v1
    kind: SecretProviderClass
    metadata:
      name: productpage-credential-spc
      namespace: aks-istio-ingress
    spec:
      provider: azure
      secretObjects:
      - secretName: productpage-credential
        type: tls
        data:
        - objectName: test-productpage-bookinfo-key
          key: key
        - objectName: test-productpage-bookinfo-crt
          key: cert
      parameters:
        useVMManagedIdentity: "true"
        userAssignedIdentityID: $CLIENT_ID 
        keyvaultName: $AKV_NAME
        cloudName: ""
        objects:  |
          array:
            - |
              objectName: test-productpage-bookinfo-key
              objectType: secret
              objectAlias: "test-productpage-bookinfo-key"
            - |
              objectName: test-productpage-bookinfo-crt
              objectType: secret
              objectAlias: "test-productpage-bookinfo-crt"
        tenantId: $TENANT_ID
    EOF
    ```

6. Use the following manifest to deploy a sample pod. The secret store CSI driver requires a pod to reference the SecretProviderClass resource to ensure secrets sync from Azure Key Vault to the cluster.
    
    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: Pod
    metadata:
      name: secrets-store-sync-productpage
      namespace: aks-istio-ingress
    spec:
      containers:
        - name: busybox
          image: mcr.microsoft.com/oss/busybox/busybox:1.33.1
          command:
            - "/bin/sleep"
            - "10"
          volumeMounts:
          - name: secrets-store01-inline
            mountPath: "/mnt/secrets-store"
            readOnly: true
      volumes:
        - name: secrets-store01-inline
          csi:
            driver: secrets-store.csi.k8s.io
            readOnly: true
            volumeAttributes:
              secretProviderClass: "productpage-credential-spc"
    EOF
    ```
    
    - Verify `productpage-credential` secret created on the cluster namespace `aks-istio-ingress` as defined in the SecretProviderClass resource.
    
        ```bash
        kubectl describe secret/productpage-credential -n aks-istio-ingress
        ```       
        Example output:
        ```bash
        Name:         productpage-credential
        Namespace:    aks-istio-ingress
        Labels:       secrets-store.csi.k8s.io/managed=true
        Annotations:  <none>
        
        Type:  tls
        
        Data
        ====
        cert:  1066 bytes
        key:   1704 bytes
        ```

### Configure ingress gateway and virtual service

Route HTTPS traffic via the Istio ingress gateway to the sample applications.
Use the following manifest to deploy gateway and virtual service resources.

```bash
cat <<EOF | kubectl apply -f -
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: bookinfo-gateway
spec:
  selector:
    istio: aks-istio-ingressgateway-external
  servers:
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: productpage-credential
    hosts:
    - productpage.bookinfo.com
---
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: productpage-vs
spec:
  hosts:
  - productpage.bookinfo.com
  gateways:
  - bookinfo-gateway
  http:
  - match:
    - uri:
        exact: /productpage
    - uri:
        prefix: /static
    - uri:
        exact: /login
    - uri:
        exact: /logout
    - uri:
        prefix: /api/v1/products
    route:
    - destination:
        port:
          number: 9080
        host: productpage
EOF
```

> [!NOTE]
> In the gateway definition, `credentialName` must match the `secretName` in SecretProviderClass resource and `selector` must refer to the external ingress gateway by its label, in which the key of the label is `istio` and the value is `aks-istio-ingressgateway-external`. For internal ingress gateway label is `istio` and the value is `aks-istio-ingressgateway-internal`.

Set environment variables for external ingress host and ports:
    
```bash
export INGRESS_HOST_EXTERNAL=$(kubectl -n aks-istio-ingress get service aks-istio-ingressgateway-external -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
export SECURE_INGRESS_PORT_EXTERNAL=$(kubectl -n aks-istio-ingress get service aks-istio-ingressgateway-external -o jsonpath='{.spec.ports[?(@.name=="https")].port}')
export SECURE_GATEWAY_URL_EXTERNAL=$INGRESS_HOST_EXTERNAL:$SECURE_INGRESS_PORT_EXTERNAL

echo "https://$SECURE_GATEWAY_URL_EXTERNAL/productpage"
```

### Verification    
Send an HTTPS request to access the productpage service through HTTPS:

```bash
curl -s -HHost:productpage.bookinfo.com --resolve "productpage.bookinfo.com:$SECURE_INGRESS_PORT_EXTERNAL:$INGRESS_HOST_EXTERNAL" --cacert bookinfo_certs/bookinfo.com.crt "https://productpage.bookinfo.com:$SECURE_INGRESS_PORT_EXTERNAL/productpage" | grep -o "<title>.*</title>"
```

Confirm that the sample application's product page is accessible. The expected output is:

```html
<title>Simple Bookstore App</title>
```

> [!NOTE]
> To configure HTTPS ingress access to an HTTPS service, i.e., configure an ingress gateway to perform SNI passthrough instead of TLS termination on incoming requests, update the tls mode in the gateway definition to `PASSTHROUGH`. This instructs the gateway to pass the ingress traffic “as is”, without terminating TLS.

## Configure a mutual TLS ingress gateway
Extend your gateway definition to support mutual TLS.

1. Update the ingress gateway credential by deleting the current secret and creating a new one. The server uses the CA certificate to verify its clients, and we must use the key ca.crt to hold the CA certificate.

    ```bash
    kubectl delete secretproviderclass productpage-credential-spc -n aks-istio-ingress
    kubectl delete secret/productpage-credential -n aks-istio-ingress
    kubectl delete pod/secrets-store-sync-productpage -n aks-istio-ingress
    ```

    Use the following manifest to recreate SecretProviderClass with CA certificate.

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: secrets-store.csi.x-k8s.io/v1
    kind: SecretProviderClass
    metadata:
      name: productpage-credential-spc
      namespace: aks-istio-ingress
    spec:
      provider: azure
      secretObjects:
      - secretName: productpage-credential
        type: opaque
        data:
        - objectName: test-productpage-bookinfo-key
          key: tls.key
        - objectName: test-productpage-bookinfo-crt
          key: tls.crt
        - objectName: test-bookinfo-crt
          key: ca.crt
      parameters:
        useVMManagedIdentity: "true"
        userAssignedIdentityID: $CLIENT_ID 
        keyvaultName: $AKV_NAME
        cloudName: ""
        objects:  |
          array:
            - |
              objectName: test-productpage-bookinfo-key
              objectType: secret
              objectAlias: "test-productpage-bookinfo-key"
            - |
              objectName: test-productpage-bookinfo-crt
              objectType: secret
              objectAlias: "test-productpage-bookinfo-crt"
            - |
              objectName: test-bookinfo-crt
              objectType: secret
              objectAlias: "test-bookinfo-crt"
        tenantId: $TENANT_ID
    EOF
    ```

    Use the following manifest to redeploy sample pod to sync secrets from Azure Key Vault to the cluster.

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: Pod
    metadata:
      name: secrets-store-sync-productpage
      namespace: aks-istio-ingress
    spec:
      containers:
        - name: busybox
          image: registry.k8s.io/e2e-test-images/busybox:1.29-4
          command:
            - "/bin/sleep"
            - "10"
          volumeMounts:
          - name: secrets-store01-inline
            mountPath: "/mnt/secrets-store"
            readOnly: true
      volumes:
        - name: secrets-store01-inline
          csi:
            driver: secrets-store.csi.k8s.io
            readOnly: true
            volumeAttributes:
              secretProviderClass: "productpage-credential-spc"
    EOF
    ```
    
    - Verify `productpage-credential` secret created on the cluster namespace `aks-istio-ingress`.
    
      ```bash
      kubectl describe secret/productpage-credential -n aks-istio-ingress
      ```
      
      Example output:
      ```bash
      Name:         productpage-credential
      Namespace:    aks-istio-ingress
      Labels:       secrets-store.csi.k8s.io/managed=true
      Annotations:  <none>
      
      Type:  opaque
      
      Data
      ====
      ca.crt:   1188 bytes
      tls.crt:  1066 bytes
      tls.key:  1704 bytes
      ```

2. Use the following manifest to update the gateway definition to set the TLS mode to MUTUAL.
    
    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: networking.istio.io/v1beta1
    kind: Gateway
    metadata:
      name: bookinfo-gateway
    spec:
      selector:
        istio: aks-istio-ingressgateway-external # use istio default ingress gateway
      servers:
      - port:
          number: 443
          name: https
          protocol: HTTPS
        tls:
          mode: MUTUAL
          credentialName: productpage-credential # must be the same as secret
        hosts:
        - productpage.bookinfo.com
    EOF
    ```

### Verification

Attempt to send HTTPS request using the prior approach - without passing the client certificate - and see it fail.

```bash
curl -v -HHost:productpage.bookinfo.com --resolve "productpage.bookinfo.com:$SECURE_INGRESS_PORT_EXTERNAL:$INGRESS_HOST_EXTERNAL" --cacert bookinfo_certs/bookinfo.com.crt "https://productpage.bookinfo.com:$SECURE_INGRESS_PORT_EXTERNAL/productpage" 
```
    
  Example output:
```bash

...
* TLSv1.2 (IN), TLS header, Supplemental data (23):
* TLSv1.3 (IN), TLS alert, unknown (628):
* OpenSSL SSL_read: error:0A00045C:SSL routines::tlsv13 alert certificate required, errno 0
* Failed receiving HTTP2 data
* OpenSSL SSL_write: SSL_ERROR_ZERO_RETURN, errno 0
* Failed sending HTTP2 data
* Connection #0 to host productpage.bookinfo.com left intact
curl: (56) OpenSSL SSL_read: error:0A00045C:SSL routines::tlsv13 alert certificate required, errno 0
```
    
Pass your client’s certificate with the `--cert` flag and private key with the `--key` flag to curl.
    
```bash
curl -s -HHost:productpage.bookinfo.com --resolve "productpage.bookinfo.com:$SECURE_INGRESS_PORT_EXTERNAL:$INGRESS_HOST_EXTERNAL" --cacert bookinfo_certs/bookinfo.com.crt --cert bookinfo_certs/client.bookinfo.com.crt --key bookinfo_certs/client.bookinfo.com.key "https://productpage.bookinfo.com:$SECURE_INGRESS_PORT_EXTERNAL/productpage" | grep -o "<title>.*</title>"
```

Confirm that the sample application's product page is accessible. The expected output is:

```html
<title>Simple Bookstore App</title>
```
## Delete resources

If you want to clean up the Istio service mesh and the ingresses (leaving behind the cluster), run the following command:

```azurecli-interactive
az aks mesh disable --resource-group ${RESOURCE_GROUP} --name ${CLUSTER}
```

If you want to clean up all the resources created from the Istio how-to guidance documents, run the following command:

```azurecli-interactive
az group delete --name ${RESOURCE_GROUP} --yes --no-wait
```

<!--- External Links --->
[openssl]: https://man.openbsd.org/openssl.1

<!--- Internal Links --->
[istio-deploy-addon]: istio-deploy-addon.md
[istio-deploy-ingress]: istio-deploy-ingress.md
[istio-addon-env-vars]: istio-deploy-addon.md#set-environment-variables
[istio-deploy-existing-cluster]: istio-deploy-addon.md#install-mesh-for-existing-cluster
[enable-sidecar-injection]: istio-deploy-addon.md#enable-sidecar-injection
[deploy-sample-application]: istio-deploy-addon.md#deploy-sample-application
[enable-external-ingress-gateway]: istio-deploy-ingress.md#enable-external-ingress-gateway
[akv-addon]: ./csi-secrets-store-driver.md
[akv-quickstart]: ../key-vault/general/quick-create-cli.md
[akv-rbac-guide]: ../key-vault/general/rbac-guide.md#using-azure-rbac-secret-key-and-certificate-permissions-with-key-vault
[akv-basic-concepts]: ../key-vault/general/basic-concepts.md