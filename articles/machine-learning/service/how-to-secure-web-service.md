---
title: Secure s by using SSL
titleSuffix: Azure Machine Learning
description: Learn how to enable HTTPS in order too secure a web service that's deployed through Azure Machine Learning. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual

ms.reviewer: jmartens
ms.author: aashishb
author: aashishb
ms.date: 08/12/2019
ms.custom: seodec18
---

# Use SSL to secure a  through Azure Machine Learning
[!INCLUDE [applies-to-skus](../../../includes/aml-applies-to-basic-enterprise-sku.md)]

This article shows you how to secure a  that's deployed through Azure Machine Learning.

You use [HTTPS](https://en.wikipedia.org/wiki/HTTPS) to restrict access to s and secure the data that clients submit. HTTPS helps secure communications between a client and a  by encrypting communications between the two. Encryption uses [Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security). TLS is sometimes still referred to as *Secure Sockets Layer* (SSL), which was the predecessor of TLS.

> [!TIP]
> The Azure Machine Learning SDK uses the term "SSL" for properties that are related to secure communications. This doesn't mean that your  doesn't use *TLS*. SSL is just a more commonly recognized term.

TLS and SSL both rely on *digital certificates*, which help with encryption and identity verification. For more information on how digital certificates work, see the Wikipedia topic [Public key infrastructure](https://en.wikipedia.org/wiki/Public_key_infrastructure).

> [!WARNING]
> If you don't use HTTPS for your , data that's sent to and from the service might be visible to others on the internet.
>
> HTTPS also enables the client to verify the authenticity of the server that it's connecting to. This feature protects clients against [man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) attacks.

This is the general process to secure a :

1. Get a domain name.

2. Get a digital certificate.

3. Deploy or update the  with SSL enabled.

4. Update your DNS to point to the .

> [!IMPORTANT]
> If you're deploying to Azure Kubernetes Service (AKS), you can purchase your own certificate or use a certificate that's provided by Microsoft. If you use a certificate from Microsoft, you don't need to get a domain name or SSL certificate. For more information, see the [Enable SSL and deploy](#enable) section of this article.

There are slight differences when you secure s across [deployment targets](how-to-deploy-and-where.md).

## Get a domain name

If you don't already own a domain name, purchase one from a *domain name registrar*. The process and price differ among registrars. The registrar provides tools to manage the domain name. You use these tools to map a fully qualified domain name (FQDN) (such as www\.contoso.com) to the IP address that hosts your .

## Get an SSL certificate

There are many ways to get an SSL certificate (digital certificate). The most common is to purchase one from a *certificate authority* (CA). Regardless of where you get the certificate, you need the following files:

* A **certificate**. The certificate must contain the full certificate chain, and it must be "PEM-encoded."
* A **key**. The key must also be PEM-encoded.

When you request a certificate, you must provide the FQDN of the address that you plan to use for the  (for example, www\.contoso.com). The address that's stamped into the certificate and the address that the clients use are compared to verify the identity of the . If those addresses don't match, the client gets an error message.

> [!TIP]
> If the certificate authority can't provide the certificate and key as PEM-encoded files, you can use a utility such as [OpenSSL](https://www.openssl.org/) to change the format.

> [!WARNING]
> Use *self-signed* certificates only for development. Don't use them in production environments. Self-signed certificates can cause problems in your client applications. For more information, see the documentation for the network libraries that your client application uses.

## <a id="enable"></a> Enable SSL and deploy

To deploy (or redeploy) the service with SSL enabled, set the *ssl_enabled* parameter to "True" wherever it's applicable. Set the *ssl_certificate* parameter to the value of the *certificate* file. Set the *ssl_key* to the value of the *key* file.

### Deploy on AKS and field-programmable gate array (FPGA)

  > [!NOTE]
  > The information in this section also applies when you deploy a secure  for the designer. If you aren't familiar with using the Python SDK, see [What is the Azure Machine Learning SDK for Python?](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py).

When you deploy to AKS, you can create a new AKS cluster or attach an existing one. For more information on creating or attaching a cluster, see [Deploy a model to an Azure Kubernetes Service cluster](how-to-deploy-azure-kubernetes-service.md).
  
-  If you create a new cluster, you use **[AksCompute.provisionining_configuration()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.akscompute#provisioning-configuration-agent-count-none--vm-size-none--ssl-cname-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--location-none--vnet-resourcegroup-name-none--vnet-name-none--subnet-name-none--service-cidr-none--dns-service-ip-none--docker-bridge-cidr-none--cluster-purpose-none-)**.
- If you attach an existing cluster, you use **[AksCompute.attach_configuration()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.akscompute#attach-configuration-resource-group-none--cluster-name-none--resource-id-none--cluster-purpose-none-)**. Both return a configuration object that has an **enable_ssl** method.

The **enable_ssl** method can use a certificate that's provided by Microsoft or a certificate that you purchase.

  * When you use a certificate from Microsoft, you must use the *leaf_domain_label* parameter. This parameter generates the DNS name for the service. For example, a value of "myservice" creates a domain name of "myservice\<six-random-characters>.\<azureregion>.cloudapp.azure.com", where \<azureregion> is the region that contains the service. Optionally, you can use the *overwrite_existing_domain* parameter to overwrite the existing *leaf_domain_label*.

    To deploy (or redeploy) the service with SSL enabled, set the *ssl_enabled* parameter to "True" wherever it's applicable. Set the *ssl_certificate* parameter to the value of the *certificate* file. Set the *ssl_key* to the value of the *key* file.

    > [!IMPORTANT]
    > When you use a certificate from Microsoft, you don't need to purchase your own certificate or domain name.

    The following example demonstrates how to create a configuration that enables an SSL certificate from Microsoft:

    ```python
    from azureml.core.compute import AksCompute
    # Config used to create a new AKS cluster and enable SSL
    provisioning_config = AksCompute.provisioning_configuration()
    provisioning_config.enable_ssl(leaf_domain_label = "myservice")
    # Config used to attach an existing AKS cluster to your workspace and enable SSL
    attach_config = AksCompute.attach_configuration(resource_group = resource_group,
                                          cluster_name = cluster_name)
    attach_config.enable_ssl(leaf_domain_label = "myservice")
    ```

  * When you use *a certificate that you purchased*, you use the *ssl_cert_pem_file*, *ssl_key_pem_file*, and *ssl_cname* parameters. The following example demonstrates how to use *.pem* files to create a configuration that uses an SSL certificate that you purchased:

    ```python
    from azureml.core.compute import AksCompute
    # Config used to create a new AKS cluster and enable SSL
    provisioning_config = AksCompute.provisioning_configuration()
    provisioning_config.enable_ssl(ssl_cert_pem_file="cert.pem",
                                        ssl_key_pem_file="key.pem", ssl_cname="www.contoso.com")
    # Config used to attach an existing AKS cluster to your workspace and enable SSL
    attach_config = AksCompute.attach_configuration(resource_group = resource_group,
                                         cluster_name = cluster_name)
    attach_config.enable_ssl(ssl_cert_pem_file="cert.pem",
                                        ssl_key_pem_file="key.pem", ssl_cname="www.contoso.com")
    ```

For more information about *enable_ssl*, see [AksProvisioningConfiguration.enable_ssl()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.aks.aksprovisioningconfiguration?view=azure-ml-py#enable-ssl-ssl-cname-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--leaf-domain-label-none--overwrite-existing-domain-false-) and [AksAttachConfiguration.enable_ssl()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.aks.aksattachconfiguration?view=azure-ml-py#enable-ssl-ssl-cname-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--leaf-domain-label-none--overwrite-existing-domain-false-).

### Deploy on Azure Container Instances

When you deploy to Azure Container Instances, you provide values for SSL-related parameters, as the following code snippet shows:

```python
from azureml.core.webservice import AciWebservice

aci_config = AciWebservice.deploy_configuration(
    ssl_enabled=True, ssl_cert_pem_file="cert.pem", ssl_key_pem_file="key.pem", ssl_cname="www.contoso.com")
```

For more information, see [AciWebservice.deploy_configuration()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.aciwebservice#deploy-configuration-cpu-cores-none--memory-gb-none--tags-none--properties-none--description-none--location-none--auth-enabled-none--ssl-enabled-none--enable-app-insights-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--ssl-cname-none--dns-name-label-none-).

## Update your DNS

Next, you must update your DNS to point to the .

+ **For Container Instances:**

  Use the tools from your domain name registrar to update the DNS record for your domain name. The record must point to the IP address    of the service.

  There can be a delay of minutes or hours before clients can resolve the domain name, depending on the registrar and the "time to live" (TTL) that's configured for the domain name.

+ **For AKS:**

  > [!WARNING]
  > If you used *leaf_domain_label* to create the service by using a certificate from Microsoft, don't manually update the DNS value for the cluster. The value should be set automatically.

  Update the DNS of the Public IP Address of the AKS cluster on the **Configuration** tab under **Settings** in the left pane. (See the following image.) The Public IP Address is a resource type that's created under the resource group that contains the AKS agent nodes and other networking resources.

  [![Azure Machine Learning: Securing s with SSL](./media/how-to-secure-web-service/aks-public-ip-address.png)](./media/how-to-secure-web-service/aks-public-ip-address-expanded.png)

## Update the SSL certificate

SSL certificates expire and must be renewed. Typically this happens every year. Use the information in the following sections to update and renew your certificate for models deployed to Azure Kubernetes Service:

### Update a Microsoft generated certificate

If the certificate was originally generated by Microsoft (when using the *leaf_domain_label* to create the service), use one of the following examples to update the certificate:

**Use the SDK**

```python
from azureml.core.compute import AksCompute
from azureml.core.compute.aks import AksUpdateConfiguration
from azureml.core.compute.aks import SslConfiguration

# Get the existing cluster
aks_target = AksCompute(ws, clustername)

# Update the existing certificate by referencing the leaf domain label
ssl_configuration = SslConfiguration(leaf_domain_label="myaks", overwrite_existing_domain=True)
update_config = AksUpdateConfiguration(ssl_configuration)
aks_target.update(update_config)
```

**Use the CLI**

```azurecli
az ml computetarget update aks -g "myresourcegroup" -w "myresourceworkspace" -n "myaks" --ssl-leaf-domain-label "myaks" --ssl-overwrite-domain True
```

For more information, see the following reference docs:

* [SslConfiguration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.aks.sslconfiguration?view=azure-ml-py)
* [AksUpdateConfiguration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.aks.aksupdateconfiguration?view=azure-ml-py)

### Update custom certificate

If the certificate was originally generated by a certificate authority, use the following steps:

1. Use the documentation provided by the certificate authority to renew the certificate. This process creates new certificate files.

1. Use either the SDK or CLI to update the service with the new certificate:

    **Use the SDK**

    ```python
    from azureml.core.compute import AksCompute
    from azureml.core.compute.aks import AksUpdateConfiguration
    from azureml.core.compute.aks import SslConfiguration
    
    # Read the certificate file
    def get_content(file_name):
        with open(file_name, 'r') as f:
            return f.read()

    # Get the existing cluster
    aks_target = AksCompute(ws, clustername)
    
    # Update cluster with custom certificate
    ssl_configuration = SslConfiguration(cname="myaks", cert=get_content('cert.pem'), key=get_content('key.pem'))
    update_config = AksUpdateConfiguration(ssl_configuration)
    aks_target.update(update_config)
    ```

    **Use the CLI**

    ```azurecli
    az ml computetarget update aks -g "myresourcegroup" -w "myresourceworkspace" -n "myaks" --ssl-cname "myaks"--ssl-cert-file "cert.pem" --ssl-key-file "key.pem"
    ```

For more information, see the following reference docs:

* [SslConfiguration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.aks.sslconfiguration?view=azure-ml-py)
* [AksUpdateConfiguration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.aks.aksupdateconfiguration?view=azure-ml-py)

## Disable SSL

To disable SSL for a model deployed to Azure Kubernetes Service, create an `SslConfiguration` with `status="Disabled"`, then perform an update:

```python
from azureml.core.compute import AksCompute
from azureml.core.compute.aks import AksUpdateConfiguration
from azureml.core.compute.aks import SslConfiguration

# Get the existing cluster
aks_target = AksCompute(ws, clustername)

# Disable SSL
ssl_configuration = SslConfiguration(status="Disabled")
update_config = AksUpdateConfiguration(ssl_configuration)
aks_target.update(update_config)
```

## Next steps
Learn how to:
+ [Consume a machine learning model deployed as a ](how-to-consume-web-service.md)
+ [Securely run experiments and inference inside an Azure virtual network](how-to-enable-virtual-network.md)
