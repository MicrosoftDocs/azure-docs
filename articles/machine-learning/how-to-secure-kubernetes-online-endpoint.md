---
title: Configure secure online endpoint with TLS/SSL
description: Learn about how to use TLS/SSL to configure secure Kubernetes online endpoint
titleSuffix: Azure Machine Learning
author: jiaochenlu
ms.author: chenlujiao
ms.reviewer: mopeakande
ms.service: machine-learning
ms.subservice: core
ms.date: 10/10/2022
ms.topic: how-to
ms.custom: build-spring-2022, cliv2, sdkv2, event-tier1-build-2022
---

# Configure secure online endpoint with TLS/SSL

This article shows you how to secure a Kubernetes online endpoint that's created through Azure Machine Learning.

You use [HTTPS](https://en.wikipedia.org/wiki/HTTPS) to restrict access to online endpoints and secure the data that clients submit. HTTPS helps secure communications between a client and an online endpoint by encrypting communications between the two. Encryption uses [Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security). TLS is sometimes still referred to as *Secure Sockets Layer* (SSL), which was the predecessor of TLS.

> [!TIP]
> * Specifically, Kubernetes online endpoints support TLS version 1.2 for AKS and Arc Kubernetes.
> * TLS version 1.3 for Azure Machine Learning Kubernetes Inference is unsupported.

TLS and SSL both rely on *digital certificates*, which help with encryption and identity verification. For more information on how digital certificates work, see the Wikipedia topic [Public key infrastructure](https://en.wikipedia.org/wiki/Public_key_infrastructure).

> [!WARNING]
> If you don't use HTTPS for your online endpoints, data that's sent to and from the service might be visible to others on the internet.
>
> HTTPS also enables the client to verify the authenticity of the server that it's connecting to. This feature protects clients against [**man-in-the-middle**](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) attacks.

This is the general process to secure an online endpoint:

1. Get a [domain name.](#get-a-domain-name)

1. Get a [digital certificate.](#get-a-tlsssl-certificate)

1. [Configure TLS/SSL in AzureML Extension.](#configure-tlsssl-in-azureml-extension)

1. [Update your DNS with FQDN to point to the online endpoint.](#update-your-dns-with-fqdn)

> [!IMPORTANT]
> You need to purchase your own certificate to get a domain name or TLS/SSL certificate, and then configure them in AzureML Extension. For more detailed information, see the following sections of this article.

## Get a domain name

If you don't already own a domain name, purchase one from a *domain name registrar*. The process and price differ among registrars. The registrar provides tools to manage the domain name. You use these tools to map a fully qualified domain name (FQDN) (such as `www.contoso.com`) to the IP address that hosts your online endpoint. 

For more information on how to get the IP address of your online endpoints, see the [Update your DNS with FQDN](#update-your-dns-with-fqdn) section of this article.

## Get a TLS/SSL certificate

There are many ways to get an TLS/SSL certificate (digital certificate). The most common is to purchase one from a *certificate authority* (CA). Regardless of where you get the certificate, you need the following files:

- A **certificate**. The certificate must contain the full certificate chain, and it must be "PEM-encoded."
- A **key**. The key must also be PEM-encoded.

> [!NOTE]
> SSL Key in PEM file with pass phrase protected isn't supported.

When you request a certificate, you must provide the FQDN of the address that you plan to use for the online endpoint (for example, `www.contoso.com`). The address that's stamped into the certificate and the address that the clients use are compared to verify the identity of the online endpoint. If those addresses don't match, the client gets an error message.

For more information on how to configure IP banding with FQDN, see the [Update your DNS with FQDN](#update-your-dns-with-fqdn) section of this article.

> [!TIP]
> If the certificate authority can't provide the certificate and key as PEM-encoded files, you can use a utility such as [**OpenSSL**](https://www.openssl.org/) to change the format.

> [!WARNING]
> Use ***self-signed*** certificates only for development. Don't use them in production environments. Self-signed certificates can cause problems in your client applications. For more information, see the documentation for the network libraries that your client application uses.

## Configure TLS/SSL in AzureML Extension

For a Kubernetes online endpoint which is set to use inference HTTPS for secure connections, you can enable TLS termination with deployment configuration settings when you [deploy the AzureML extension](how-to-deploy-managed-online-endpoints.md) in an Kubernetes cluster. 

At AzureML extension deployment time, the config `allowInsecureConnections` by default will be `False`, and you would need to specify either `sslSecret` config setting or combination of `sslKeyPemFile` and `sslCertPemFile` config-protected settings to ensure successful extension deployment, otherwise you can set `allowInsecureConnections=True` to support HTTP and disable TLS termination.

> [!NOTE]
> To support HTTPS online endpoint, `allowInsecureConnections` must be set to `False`.

To enable an HTTPS endpoint for real-time inference, you need to provide both PEM-encoded TLS/SSL certificate and key. There are two ways to specify the certificate and key at AzureML extension deployment time:
1. Specify `sslSecret` config setting.
1. Specify combination of `sslCertPemFile` and `slKeyPemFile` config-protected settings.

### Configure sslSecret

The best practice is to save the certificate and key in a Kubernetes secret in the `azureml` namespace.

To configure `sslSecret`, you need to save a Kubernetes Secret in your Kubernetes cluster in `azureml` namespace to store **cert.pem** (PEM-encoded TLS/SSL cert) and **key.pem** (PEM-encoded TLS/SSL key). 

Below is a sample YAML definition of an TLS/SSL secret:

```
apiVersion: v1
data:
  cert.pem: <PEM-encoded SSL certificate> 
  key.pem: <PEM-encoded SSL key>
kind: Secret
metadata:
  name: <secret name>
  namespace: azureml
type: Opaque
```

For more information on configuring [an sslSecret](reference-kubernetes.md#sample-yaml-definition-of-kubernetes-secret-for-tlsssl).

After saving the secret in your cluster, you can specify the sslSecret to be the name of this Kubernetes secret with the following CLI command (this command will work only if you are using AKS):

<!--CLI command-->
```azurecli
   az k8s-extension create --name <extension-name> --extension-type Microsoft.AzureML.Kubernetes --config inferenceRouterServiceType=LoadBalancer sslSecret=<Kubernetes secret name> sslCname=<ssl cname> --cluster-type managedClusters --cluster-name <your-AKS-cluster-name> --resource-group <your-RG-name> --scope cluster
```

### Configure sslCertPemFile and sslKeyPemFile

You can specify the `sslCertPemFile` config to be the path to TLS/SSL certificate file(PEM-encoded), and the `sslKeyPemFile` config to be the path to TLS/SSL key file (PEM-encoded).

The following example (assuming you are using AKS) demonstrates how to use Azure CLI to specify .pem files to AzureML extension that uses a TLS/SSL certificate that you purchased:

<!--CLI command-->
```azurecli
   az k8s-extension create --name <extension-name> --extension-type Microsoft.AzureML.Kubernetes --config enableInference=True inferenceRouterServiceType=LoadBalancer sslCname=<ssl cname> --config-protected sslCertPemFile=<file-path-to-cert-PEM> sslKeyPemFile=<file-path-to-cert-KEY> --cluster-type managedClusters --cluster-name <your-AKS-cluster-name> --resource-group <your-RG-name> --scope cluster
```

> [!NOTE]
> 1. The PEM file with pass phrase protection is not supported. 
> 1. Both `sslCertPemFIle` and `sslKeyPemFIle` are using config-protected parameter, and do not configure sslSecret and sslCertPemFile/sslKeyPemFile at the same time.


## Update your DNS with FQDN

For model deployment on Kubernetes online endpoint with custom certificate, you must update your DNS record to point to the IP address of the online endpoint. This IP address is provided by AzureML inference router service(`azureml-fe`), for more information about `azureml-fe`, see the [Managed AzureML inference router](how-to-kubernetes-inference-routing-azureml-fe.md).

You can follow following steps to update DNS record for your custom domain name:

1. Get online endpoint IP address from scoring URI, which is usually in the format of `http://104.214.29.152:80/api/v1/service/<service-name>/score`. In this example, the IP address is 104.214.29.152.
   
   <!-- where to find out your IP address-->
   Once you have configured your custom domain name, the IP address in scoring URI would be replaced by that specific domain name. For Kubernetes clusters that using `LoadBalancer` as Inference Router Service, the `azureml-fe` will be exposed externally using a cloud provider's load balancer and TLS/SSL termination, and the IP address of Kubernetes online endpoint is the external IP of the `azureml-fe` service deployed in the cluster. 

   If you use AKS, you can easily get the IP address from [Azure portal](https://portal.azure.com/#home). Go to your AKS resource page, navigate to **Service and ingresses** and then find the **azureml-fe** service under the **azuerml** namespace, then you can find the IP address in the **External IP** column.
    
   :::image type="content" source="media/how-to-secure-kubernetes-online-endpoint/get-ip-address-from-aks-ui.png" alt-text="Screenshot of adding new extension to the Arc-enabled Kubernetes cluster from Azure portal.":::

   In addition, you can run this Kubernetes command `kubectl describe svc azureml-fe -n azureml` in your cluster to get the IP address from the **LoadBalancer Ingress** parameter in the output.

   > [!NOTE]
   > For Kubernetes clusters that using either `nodePort` or `clusterIP` as Inference Router Service, you need to set up your own load balancing solution and TLS/SSL termination for `azureml-fe`, and get the IP address of the `azureml-fe` service in cluster scope.


1. Use the tools from your domain name registrar to update the DNS record for your domain name. The record maps the FQDN (for example, `www.contoso.com`) to the IP address. The record must point to the IP address of the online endpoint.

   > [!TIP]
   > Microsoft does not responsible for updating the DNS for your custom DNS name or certificate. You must update it with your domain name registrar.


1. After DNS record update, you can validate DNS resolution using `nslookup custom-domain-name` command. If DNS record is correctly updated, the custom domain name will point to the IP address of online endpoint.

   There can be a delay of minutes or hours before clients can resolve the domain name, depending on the registrar and the "time to live" (TTL) that's configured for the domain name.

For more information on DNS resolution with Azure Machine Learning, see [How to use your workspace with a custom DNS server](how-to-custom-dns.md).


## Update the TLS/SSL certificate

TLS/SSL certificates expire and must be renewed. Typically this happens every year. Use the information in the following steps to update and renew your certificate for models deployed to Kubernetes (AKS and Arc Kubernetes).

1. Use the documentation provided by the certificate authority to renew the certificate. This process creates new certificate files.

1. Update your AzureML extension and specify the new certificate files with this az-k8s extension update command:

   <!--Update sslSecret-->
   If you used a Kubernetes Secret to configure TLS/SSL before, you need to first update the Kubernetes Secret with new `cert.pem` and `key.pem` configuration in your Kubernetes cluster, and then run the extension update command to update the certificate:

   ```azurecli
      az k8s-extension update --name <extension-name> --extension-type Microsoft.AzureML.Kubernetes --config inferenceRouterServiceType=LoadBalancer sslSecret=<Kubernetes secret name> sslCname=<ssl cname> --cluster-type managedClusters --cluster-name <your-AKS-cluster-name> --resource-group <your-RG-name> --scope cluster
   ``` 
   <!--CLI command-->
   If you directly configured the PEM files in extension deployment command before, you need to run extension update command with specifying the new PEM files path,

   ```azurecli
      az k8s-extension update --name <extension-name> --extension-type Microsoft.AzureML.Kubernetes --config-protected sslCertPemFile=<file-path-to-cert-PEM> sslKeyPemFile=<file-path-to-cert-KEY> --cluster-type managedClusters --cluster-name <your-AKS-cluster-name> --resource-group <your-RG-name> --scope cluster
   ```

## Disable TLS

To disable TLS for a model deployed to Kubernetes, update the AzureML extension with `allowInsercureconnection` to be `True`, and then remove sslCname config, also remove sslSecret or sslPem config settings, run CLI command in your Kubernetes cluster (assuming you are using AKS), then perform an update:

<!--CLI command-->
```azurecli
   az k8s-extension create --name <extension-name> --extension-type Microsoft.AzureML.Kubernetes --config enableInference=True inferenceRouterServiceType=LoadBalancer allowInsercureconnection=True --cluster-type managedClusters --cluster-name <your-AKS-cluster-name> --resource-group <your-RG-name> --scope cluster
```

> [!WARNING]
> By default, AzureML extension deployment expects config settings for HTTPS support. HTTP support is only recommended for development or testing purposes, and it is conveniently provided through config setting `allowInsecureConnections=True`.


## Next steps

Learn how to:
- [Consume a machine learning model deployed as an online endpoint](how-to-deploy-managed-online-endpoints.md#invoke-the-local-endpoint-to-score-data-by-using-your-model)
- [How to secure Kubernetes inferencing environment](how-to-secure-kubernetes-inferencing-environment.md)
- [How to use your workspace with a custom DNS server](how-to-custom-dns.md)
