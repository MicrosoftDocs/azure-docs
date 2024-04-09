---
title: Expose Superset to the internet
description: Learn how to expose Superset to the internet
ms.service: hdinsight-aks
ms.topic: how-to 
ms.date: 12/11/2023
---

# Expose Apache Superset to Internet

This article describes how to expose Apache Superset to the Internet.

## Hostname selection

1. Decide on a hostname for Superset.

   Unless you're using a custom DNS name, this hostname should match the pattern: `<superset-instance-name>.<azure-region>.cloudapp.azure.com`. The **superset-instance-name** must be unique within the Azure region.

   Example: `myuniquesuperset.westus3.cloudapp.azure.com`

1. Get a TLS certificate for the hostname and place it into your Key Vault and call it `aks-ingress-tls`. Learn how to put a certificate into an [Azure Key Vault](/azure/key-vault/certificates/certificate-scenarios).

## Setup ingress

The following instructions add a second layer of authentication in the form of an Oauth authorization proxy using Oauth2Proxy. This layer means that no unauthorized clients reach the Superset application.

1. Add the following secrets to your Key Vault.

   |Secret Name|Description|
   |-|-|
   |client-id|Your Azure service principal client ID. Oauth proxy requires this ID to be a secret.|
   |oauth2proxy-redis-password|Proxy cache password. The password used by the Oauth proxy to access the back end Redis deployment instance on Kubernetes. Generate a strong password.|
   |oauth2proxy-cookie-secret|32 character cookie secret, used to encrypt the cookie data. This secret must be 32 characters long.|

1. Add these callbacks in your Superset Azure AD application configuration.

   * `https://{{superset_hostname}}/oauth2/callback`
      * for Oauth2 Proxy
    * `https://{{superset_hostname}}/oauth-authorized/azure`
      * for Superset

1. Deploy the ingress ngninx controller into the `default` namespace

    ```bash
    helm install ingress-nginx-superset ingress-nginx/ingress-nginx \
    --namespace default \
    --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz \
    --set controller.config.proxy-connect-timeout="60" \
    --set controller.config.proxy-read-timeout="1000" \
    --set controller.config.proxy-send-timeout="1000" \
    --set controller.config.proxy-buffer-size="'64k'" \
    --set controller.config.proxy-buffers-number="8"
    ```

    For detailed instructions, see [Azure instructions here](/azure/aks/ingress-basic?tabs=azure-cli#basic-configuration).
   > [!NOTE]
   > The ingress nginx controller steps use Kubernetes namespace `ingress-basic`. This needs to be modified use the `default` namespace. e.g. `NAMESPACE=default`

1. Create TLS Secret Provider Class.

   This step describes how the TLS certificate is read from the Key Vault and transformed into a Kubernetes secret to be used by ingress:

   Update in the following yaml:
   * `{{MSI_CLIENT_ID}}` - The client ID of the managed identity assigned to the Superset cluster (`$MANAGED_IDENTITY_RESOURCE`).
   * `{{KEY_VAULT_NAME}}` - The name of the Azure Key Vault containing the secrets.
   * `{{KEY_VAULT_TENANT_ID}}` - The identifier guid of the Azure tenant where the Key Vault is located.

   **tls-secretprovider.yaml**

   ```yaml
   apiVersion: secrets-store.csi.x-k8s.io/v1
   kind: SecretProviderClass
   metadata:
     name: azure-tls
   spec:
     provider: azure
     # secretObjects defines the desired state of synced K8s secret objects
     secretObjects:
     - secretName: ingress-tls-csi
       type: kubernetes.io/tls
       data: 
       - objectName: aks-ingress-tls
         key: tls.key
       - objectName: aks-ingress-tls
         key: tls.crt
     parameters:
       usePodIdentity: "false"
       useVMManagedIdentity: "true"
       userAssignedIdentityID: "{{MSI_CLIENT_ID}}"
       # the name of the AKV instance
       keyvaultName: "{{KEY_VAULT_NAME}}"
       objects: |
         array:
           - |
             objectName: aks-ingress-tls
             objectType: secret
       # the tenant ID of the AKV instance
       tenantId: "{{KEY_VAULT_TENANT_ID}}"
   ```

1. Create OauthProxy Secret Provider Class.

   Update in the following yaml:
   * `{{MSI_CLIENT_ID}}` - The client ID of the managed identity assigned to the Superset cluster (`$MANAGED_IDENTITY_RESOURCE`).
   * `{{KEY_VAULT_NAME}}` - The name of the Azure Key Vault containing the secrets.
   * `{{KEY_VAULT_TENANT_ID}}` - The identifier guid of the Azure tenant where the key vault is located.

   **oauth2-secretprovider.yaml**

   ```yaml
   # This is a SecretProviderClass example using aad-pod-identity to access the key vault
   apiVersion: secrets-store.csi.x-k8s.io/v1
   kind: SecretProviderClass
   metadata:
     name: oauth2-secret-provider
   spec:
     provider: azure
     parameters:
       useVMManagedIdentity: "true" 
       userAssignedIdentityID: "{{MSI_CLIENT_ID}}"
       usePodIdentity: "false"              # Set to true for using aad-pod-identity to access your key vault
       keyvaultName: "{{KEY_VAULT_NAME}}"   # Set to the name of your key vault
       cloudName: ""                        # [OPTIONAL for Azure] if not provided, the Azure environment defaults to AzurePublicCloud
       objects: |
         array:
           - |
             objectName: oauth2proxy-cookie-secret
             objectType: secret
           - |
             objectName: oauth2proxy-redis-password
             objectType: secret
           - |
             objectName: client-id
             objectType: secret
           - |
             objectName: client-secret
             objectType: secret
       tenantId: "{{KEY_VAULT_TENANT_ID}}"  # The tenant ID of the key vault
     secretObjects:                             
     - secretName: oauth2-secret
       type: Opaque
       data:
       # OauthProxy2 Secrets
       - key: cookie-secret
         objectName: oauth2proxy-cookie-secret
       - key: client-id
         objectName: client-id
       - key: client-secret
         objectName: client-secret
       - key: redis-password
         objectName: oauth2proxy-redis-password
     - secretName: oauth2-redis
       type: Opaque
       data:
       - key: redis-password
         objectName: oauth2proxy-redis-password
   ```

1. Create configuration for the Oauth Proxy.

   Update in the following yaml:
   * `{{superset_hostname}}` - the internet facing hostname chosen in [hostname selection](#hostname-selection)
   * `{{tenant-id}}` - The identifier guid of the Azure tenant where your service principal was created.

   **Optional:** update the email_domains list. Example: `email_domains = [ "microsoft.com" ]`

   **oauth2-values.yaml**

   ```yaml
   # Force the target Kubernetes version (it uses Helm `.Capabilities` if not set).
   # This is especially useful for `helm template` as capabilities are always empty
   # due to the fact that it doesn't query an actual cluster
   kubeVersion:
   
   # Oauth client configuration specifics
   config:
     # OAuth client secret
     existingSecret: oauth2-secret
     configFile: |-
       email_domains = [ ]
       upstreams = [ "file:///dev/null" ]
   
   image:
     repository: "quay.io/oauth2-proxy/oauth2-proxy"
     tag: "v7.4.0"
     pullPolicy: "IfNotPresent"
   
   extraArgs: 
       provider: oidc
       oidc-issuer-url: https://login.microsoftonline.com/<tenant-id>/v2.0
       login-url: https://login.microsoftonline.com/<tenant-id>/v2.0/oauth2/authorize
       redeem-url: https://login.microsoftonline.com/<tenant-id>/v2.0/oauth2/token
       oidc-jwks-url: https://login.microsoftonline.com/common/discovery/keys
       profile-url: https://graph.microsoft.com/v1.0/me
       skip-provider-button: true
   
   ingress:
     enabled: true
     path: /oauth2
     pathType: ImplementationSpecific
     hosts:
     - "{{superset_hostname}}"
     annotations:
       kubernetes.io/ingress.class: nginx
       nginx.ingress.kubernetes.io/proxy_buffer_size: 64k
       nginx.ingress.kubernetes.io/proxy_buffers_number: "8"
     tls:
     - secretName: ingress-tls-csi
       hosts:
        - "{{superset_hostname}}"
   
   extraVolumes:
     - name: oauth2-secrets-store
       csi:
         driver: secrets-store.csi.k8s.io
         readOnly: true
         volumeAttributes:
           secretProviderClass: oauth2-secret-provider
     - name: tls-secrets-store
       csi:
         driver: secrets-store.csi.k8s.io
         readOnly: true
         volumeAttributes:
           secretProviderClass: azure-tls
   
   extraVolumeMounts: 
     - mountPath: "/mnt/oauth2_secrets"
       name: oauth2-secrets-store
       readOnly: true
     - mountPath: "/mnt/tls-secrets-store"
       name: tls-secrets-store
       readOnly: true
   
   # Configure the session storage type, between cookie and redis
   sessionStorage:
     # Can be one of the supported session storage cookie/redis
     type: redis
     redis:
       # Secret name that holds the redis-password and redis-sentinel-password values
       existingSecret: oauth2-secret
       # Can be one of sentinel/cluster/standalone
       clientType: "standalone"
   
   # Enables and configure the automatic deployment of the redis subchart
   redis:
     enabled: true
     auth:
       existingSecret: oauth2-secret
   
   # Enables apiVersion deprecation checks
   checkDeprecation: true
   ```

1. Deploy Oauth proxy resources.

   ```bash
   kubectl apply -f oauth2-secretprovider.yaml
   kubectl apply -f tls-secretprovider.yaml
   helm repo add oauth2-proxy https://oauth2-proxy.github.io/manifests
   helm repo update
   helm upgrade --install --values oauth2-values.yaml oauth2 oauth2-proxy/oauth2-proxy
   ```

1. Update the DNS label in the associated public IP.

    1. Open your Superset AKS Kubernetes cluster in the Azure portal.

    1. Select "Properties" from the left navigation.

    1. Open the "Infrastructure resource group" link.

    1. Find the Public IP address with these tags: 

         ```json
         {
           "k8s-azure-cluster-name": "kubernetes",
           "k8s-azure-service": "default/ingress-nginx-controller"
         }
         ```

    1. Select "Configuration" from the Public IP left navigation.

    1. Enter the DNS name label with the `<superset-instance-name>` defined in [hostname selection](#hostname-selection).

1. Verify that your ingress for Oauth is configured.

      Run `kubectl get ingress` to see the two ingresses created `azure-trino-superset` and `oauth2-oauth2-proxy`. The IP address matches the Public IP from the previous step.

      Likewise, when running `kubectl get services` you should see that `ingress-nginx-controller` has been assigned an `EXTERNAL-IP`.

      > [!TIP] 
      > You can open `http://{{superset_hostname}}/oauth2` to test that the Oauth path is working.

1. Define an ingress to provide access to Superset, but redirect all unauthorized calls to `/oauth`.

    Update in the following yaml:
    * `{{superset_hostname}}` - the internet facing hostname chosen in [hostname selection](#hostname-selection)

    **ingress.yaml**

      ```yaml
      apiVersion: networking.k8s.io/v1
      kind: Ingress
      metadata:
        annotations:
          kubernetes.io/ingress.class: nginx
          nginx.ingress.kubernetes.io/auth-signin: https://$host/oauth2/start?rd=$escaped_request_uri
          nginx.ingress.kubernetes.io/auth-url: http://oauth2-oauth2-proxy.default.svc.cluster.local:80/oauth2/auth
          nginx.ingress.kubernetes.io/proxy-buffer-size: 64k
          nginx.ingress.kubernetes.io/proxy-buffers-number: "8"
          nginx.ingress.kubernetes.io/rewrite-target: /$1
        generation: 1
        labels:
          app.kubernetes.io/name: azure-trino-superset
        name: azure-trino-superset
        namespace: default
      spec:
        rules:
        - host: "{{superset_hostname}}"
          http:
            paths:
            - backend:
                service:
                  name: superset
                  port:
                    number: 8088
              path: /(.*)
              pathType: Prefix
        tls:
        - hosts:
          - "{{superset_hostname}}"
          secretName: ingress-tls-csi
      ```

1. Deploy your ingress.

   ```
         kubectl apply -f ingress.yaml
   ```

1. Test.

    Open `https://{{superset_hostname}}/` in your browser.

### Troubleshooting ingress

> [!TIP] 
> To reset the ingress deployment, execute these commands:
> ```bash
> kubectl delete secret ingress-tls-csi
> kubectl delete secret oauth2-secret
> helm uninstall oauth2-proxy
> helm uninstall ingress-nginx-superset
> kubectl delete ingress azure-trino-superset
> ```
> After deleting these resources you will need to restart these instructions from the beginning.

#### Invalid security certificate: Kubernetes Ingress Controller Fake Certificate

This causes a TLS certificate verification error in your browser/client. To see this error, inspect the certificate in a browser.

The usual cause of this issue is that your certificate is misconfigured:

* Verify you can see your certificate in Kubernetes: `kubectl get secret ingress-tls-csi --output yaml`

* Verify your CN matches the CN provided in your certificate.

  * The CN mismatch is logged in the ingress pod. These logs can be seen by running `kubectl logs <ingress pod>`.

      Example: `kubectl logs ingress-nginx-superset-controller-f5dd9ccfd-qz8wc`

  The CN mismatch error is described with this log line:

  > SSL certificate "default/ingress-tls-csi" does not contain a Common Name or Subject Alternative Name for server "{server name}": x509: certificate is valid for {invalid hostname}, not {actual hostname}

#### Could not resolve host

If the hostname can't be resolved for the Superset instance, the Public IP doesn't have a hostname assigned. Without this assignment, DNS can't resolve the hostname.

Verify the steps in the section **Update the DNS label in the associated public IP**.

#### 404 / nginx

The Nginx ingress controller can't find Superset. Make sure Superset is deployed by running `kubectl get services` and checking for the presence of a `superset` service. Verify the backend service in **ingress.yaml** matches the service name used for Superset.

#### 503 Service Temporarily Unavailable / nginx

The service is running but inaccessible. Check the service port numbers and service name.
