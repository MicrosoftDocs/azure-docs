---
title: Expose Superset to the internet
description: Learn how to expose Superset to the internet
ms.service: hdinsight-aks
ms.topic: how-to 
ms.date: 08/29/2023
---

# Expose Apache Superset to Internet

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

This article describes how to expose Apache Superset to the Internet.

## Configure ingress

The following instructions add a second layer of authentication in the form of an Oauth authorization proxy using Oauth2Proxy. It adds more layer of preventative security to your Superset access.

1. Get a TLS certificate for your hostname and place it into your Key Vault and call it `aks-ingress-tls`. Learn how to put a certificate into an [Azure Key Vault](/azure/key-vault/certificates/certificate-scenarios).

1. Add the following secrets to your Key Vault.

   |Secret Name|Description|
   |-|-|
   |client-id|Your Azure service principal client ID. Oauth proxy requires this ID to be a secret.|
   |oauth2proxy-redis-password|Proxy cache password. The password used by the Oauth proxy to access the back end Redis deployment instance on Kubernetes. Generate a strong password.|
   |oauth2proxy-cookie-secret|Cookie secret, used to encrypt the cookie data. This cookie secret must be 32 characters long.|
1. Add these callbacks in your Azure AD application configuration.

   * `https://{{YOUR_HOST_NAME}}/oauth2/callback`
      - for Oauth2 Proxy
    * `https://{{YOUR_HOST_NAME}}/oauth-authorized/azure`
      - for Superset

1. Deploy the basic ingress ngninx controller into the `default` namespace. For more information, see [here](/azure/aks/ingress-basic?tabs=azure-cli#basic-configuration).

> [!NOTE] 
> The ingress nginx controller steps use Kubernetes namespace `ingress-basic`. Please modify to use the `default` namespace. e.g. `NAMESPACE=default`

1. Create TLS secret provider class.

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

   Refer to [sample code](https://github.com/Azure-Samples/hdinsight-aks/blob/main/src/trino/oauth2-secretprovider.yml).
   

1. Create configuration for the Oauth Proxy.

   Update in the following yaml:
   * `{{hostname}}` - The internet facing host name.
   * `{{tenant-id}}` - The identifier guid of the Azure tenant where your service principal was created.

   **Optional:** update the email_domains list. Example: `email_domains = [ "microsoft.com" ]`

   Refer to [sample code](https://github.com/Azure-Samples/hdinsight-aks/blob/main/src/trino/oauth2-values.yml).

1. Deploy Oauth proxy resources.

   ```bash
   kubectl apply -f oauth2-secretprovider.yaml
   kubectl apply -f tls-secretprovider.yaml
   helm repo add oauth2-proxy https://oauth2-proxy.github.io/manifests
   helm repo update
   helm upgrade --install --values oauth2-values.yaml oauth2 oauth2-proxy/oauth2-proxy
   ```

1. If you're using an Azure subdomain that is, `superset.<region>.cloudapp.azure.com`, update the DNS label in the associated public IP.

   1. Open your Superset Kubernetes cluster in the Azure portal.

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

    1. Enter the DNS name label.

1. Verify that your ingress for Oauth is configured.

      Run `kubectl get ingress` to see the ingresses created. You should see an `EXTERNAL-IP` associated with the ingress.
      Likewise, when running `kubectl get services` you should see that `ingress-nginx-controller` has been assigned an `EXTERNAL-IP`.
      You can open `http://<hostname>/oauth2` to test Oauth.

1. Define an ingress to link Oauth and Superset. This step causes any calls to any path to be first redirected to /oauth for authorization, and upon success, allowed to access the Superset service.

    Update in the following yaml:
    * `{{hostname}}` - The internet facing host name.
    
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
        - host: "{{hostname}}"
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
          - "{{hostname}}"
          secretName: ingress-tls-csi
      ```

1. Deploy your ingress.
   
   ```
         kubectl apply -f ingress.yaml
   ```

1. Test.
   
    Open `https://{{hostname}}/` in your browser.

### Troubleshooting ingress

> [!TIP] 
> To reset the ingress deployment, execute the following commands:
> ```bash
> kubectl delete secret ingress-tls-csi
> kubectl delete secret oauth2-secret
> helm uninstall oauth2-proxy
> helm uninstall ingress-nginx
> kubectl delete ingress azure-trino-superset
> ```
> After deleting the resources, you need to restart these instructions from the beginning.

#### Invalid security certificate: Kubernetes ingress controller fake certificate

This issue causes a TLS certificate verification error in your browser/client. To see this error, inspect the certificate in a browser.

The usual cause of this issue is that your certificate is misconfigured:

* Verify that you can see your certificate in Kubernetes: `kubectl get secret ingress-tls-csi --output yaml`

* Verify that your CN matches the CN provided in your certificate.

    * The CN mismatch gets logged in the ingress pod. These logs can be seen by running `kubectl logs <ingress pod>`. The following error appears in the logs:

        `SSL certificate "default/ingress-tls-csi" does not contain a Common Name or Subject Alternative Name for server "{server name}": x509: certificate is valid for {invalid hostname}, not {actual hostname}`

#### 404 / nginx

Nginx can't find the underlying service. Make sure Superset is deployed: `kubectl get services`

#### 503 Service temporarily unavailable / nginx

The service is running but inaccessible. Check the service port numbers and service name.
