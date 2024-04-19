# Secure Gateways for Istio service mesh add-on for Azure Kubernetes Service

The [Deploy external or internal Istio Ingress](https://learn.microsoft.com/azure/aks/istio-deploy-ingress) article describes how to configure an ingress gateway to expose an HTTP service to external traffic. This article shows how to expose a secure HTTPS service using either simple or mutual TLS.

## Prerequisites

Before proceeding, ensure that you have completed the following prerequisites:
- Enable the Istio add-on on your AKS cluster as per [documentation](https://learn.microsoft.com/azure/aks/istio-deploy-addon)
- Deploy an external Istio Ingress gateway as per [documentation](https://learn.microsoft.com/azure/aks/istio-deploy-ingress)

### Summary of Previous Steps

So far we've achieved the following:
- [Set environment variables](https://learn.microsoft.com/azure/aks/istio-deploy-addon#set-environment-variables)
- [Install Istio add-on](https://learn.microsoft.com/azure/aks/istio-deploy-addon#install-mesh-for-existing-cluster)
- [Enable sidecar injection](https://learn.microsoft.com/azure/aks/istio-deploy-addon#enable-sidecar-injection)
- [Deploy sample application](https://learn.microsoft.com/azure/aks/istio-deploy-addon#deploy-sample-application)
- [Enable external ingress gateway](https://learn.microsoft.com/azure/aks/istio-deploy-ingress#enable-external-ingress-gateway)

## Generate required client and server certificates and keys

This article requires several certificates and keys which will be used throughout the examples, you can use your favorite tool to create them or use the commands below to generate them using [openssl](https://man.openbsd.org/openssl.1) 

1. Create a root certificate and private key to sign the certificates for sample services:
    ```bash
    mkdir bookinfo_certs
    openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -subj '/O=bookinfo Inc./CN=bookinfo.com' -keyout bookinfo_certs/bookinfo.com.key -out bookinfo_certs/bookinfo.com.crt
    ```

2. Generate a certificate and private key for <span>productpage.bookinfo.com</span>:
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

Create a kubernetes tls secret for the ingress gateway, for this we will use [Azure Keyvault](https://learn.microsoft.com/azure/key-vault/general/basic-concepts) to host certificates/keys and  [Azure Keyvault Secrets Provider add-on](https://learn.microsoft.com/azure/aks/csi-secrets-store-driver) to sync these to the cluster.

### Set up Azure Keyvault and sync secrets on AKS cluster

1. Create Azure Keyvault

    You need an [Azure Keyvault](https://learn.microsoft.com/azure/key-vault/general/quick-create-cli) resource to provide the certificate and key inputs to the Istio add-on.  

    ```bash
    export AKV_NAME=<azure-key-vault-resource-name>  
    az keyvault create --name $AKV_NAME --resource-group   $RESOURCE_GROUP --location $LOCATION
    ```
    
2. Enable [Azure Key Vault provider for Secret Store CSI Driver](https://learn.microsoft.com/azure/aks/csi-secrets-store-driver) add-on on your cluster.

    ```bash
    az aks enable-addons --addons azure-keyvault-secrets-provider --resource-group $RESOURCE_GROUP --name $CLUSTER
    ```
    
3. Authorize the user-assigned managed identity of the add-on to provision access to the Azure Keyvault resource using access policy. Alternatively, follow the instructions [here](https://learn.microsoft.com/azure/key-vault/general/rbac-guide?tabs=azure-cli#using-azure-rbac-secret-key-and-certificate-permissions-with-key-vault) to assign an Azure role of Key Vault for the add-on's user-assigned managed identity.
    
    ```bash
    OBJECT_ID=$(az aks show --resource-group $RESOURCE_GROUP --name $CLUSTER --query 'addonProfiles.azureKeyvaultSecretsProvider.identity.objectId' -o tsv)
    CLIENT_ID=$(az aks show --resource-group $RESOURCE_GROUP --name $CLUSTER --query 'addonProfiles.azureKeyvaultSecretsProvider.identity.clientId')
    TENANT_ID=$(az keyvault show -g ddama-test -n $AKV_NAME --query 'properties.tenantId')
    
    az keyvault set-policy --name $AKV_NAME --object-id $OBJECT_ID --secret-permissions get list
    ```

4. Create secrets in Azure Keyvault using the certificates and key generated above.

    ```bash
    az keyvault secret set --vault-name $AKV_NAME --name test-productpage-bookinfo-key --file bookinfo_certs/productpage.bookinfo.com.key
    az keyvault secret set --vault-name $AKV_NAME --name test-productpage-bookinfo-crt --file bookinfo_certs/productpage.bookinfo.com.crt
    az keyvault secret set --vault-name $AKV_NAME --name test-bookinfo-crt --file bookinfo_certs/bookinfo.com.crt
    ```
    
5. Deploy a SecretProviderClass using the kubectl apply command and the following YAML script.
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

6. Deploy a sample pod to sync secrets from AKV to the cluster and the following YAML script.
    
    ```bash
    cat <<EOF | kubectl apply -f -
    kind: Pod
    apiVersion: v1
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
    - Verify `productpage-credential` secret has been sync'd on the cluster namespace `aks-istio-ingress` as defined in the SecretProviderClass resource above.
        ```bash
        kubectl get secret productpage-credential -n aks-istio-ingress
        ```       
        Example output:
        ```bash
        NAME                     TYPE   DATA   AGE
        productpage-credential   tls    2      6s
        ```

### Configure ingress gateway and virtual service

Use the following manifest to route HTTPS traffic via the Istio ingress gateway to the sample applications.

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: networking.istio.io/v1alpha3
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
    EOF
    ```

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: networking.istio.io/v1alpha3
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

Set environment variables for external ingress host and ports:
    
    ```bash
    export INGRESS_HOST_EXTERNAL=$(kubectl -n aks-istio-ingress get service aks-istio-ingressgateway-external -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    export SECURE_INGRESS_PORT_EXTERNAL=$(kubectl -n aks-istio-ingress get service aks-istio-ingressgateway-external -o jsonpath='{.spec.ports[?(@.name=="https")].port}')
    export SECURE_GATEWAY_URL_EXTERNAL=$INGRESS_HOST_EXTERNAL:$SECURE_INGRESS_PORT_EXTERNAL
    
    echo "https://$SECURE_GATEWAY_URL_EXTERNAL/productpage"
    ```
    
Send a HTTPS request to access the productpage service through HTTPS:

    ```bash
    curl -s -HHost:productpage.bookinfo.com --resolve "productpage.bookinfo.com:$SECURE_INGRESS_PORT_EXTERNAL:$INGRESS_HOST_EXTERNAL" --cacert bookinfo_certs/bookinfo.com.crt "https://productpage.bookinfo.com:$SECURE_INGRESS_PORT_EXTERNAL/productpage" | grep -o "<title>.*</title>"
    ```

Confirm that the sample application's product page is accessible. The expected output is

```bash
<title>Simple Bookstore App</title>
```

## Configure a mutual TLS ingress gateway
Extend your gateway definition to support mutual TLS.

1. Update the ingress gateway credential by deleting the current secret and creating a new one. The server uses the CA certificate to verify its clients, and we must use the key ca.crt to hold the CA certificate.

delete resources

    ```bash
    kubectl delete secretproviderclass productpage-credential-spc -n aks-istio-ingress
    kubectl delete secret/productpage-credential -n aks-istio-ingress
    kubectl delete pod/secrets-store-sync-productpage -n aks-istio-ingress
    ```

recreate SecretProviderClass with root cert

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

recreate sample pod

    ```bash
    cat <<EOF | kubectl apply -f -
    kind: Pod
    apiVersion: v1
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
verify secret
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

update the gateway definition to set the TLS mode to MUTUAL
    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: networking.istio.io/v1alpha3
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

Attempt to send HTTPS request using the prior approach and see it fail

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
    
Pass your client’s certificate with the --cert flag and your private key with the --key flag to curl
    ```bash
    curl -s -HHost:productpage.bookinfo.com --resolve "productpage.bookinfo.com:$SECURE_INGRESS_PORT_EXTERNAL:$INGRESS_HOST_EXTERNAL" --cacert bookinfo_certs/bookinfo.com.crt --cert bookinfo_certs/client.bookinfo.com.crt --key bookinfo_certs/client.bookinfo.com.key "https://productpage.bookinfo.com:$SECURE_INGRESS_PORT_EXTERNAL/productpage" | grep -o "<title>.*</title>"
    ```

Confirm that the sample application's product page is accessible. The expected output is
    ```bash
    <title>Simple Bookstore App</title>
    ```