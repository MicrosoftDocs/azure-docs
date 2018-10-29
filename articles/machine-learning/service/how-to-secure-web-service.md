---
title: Secure Azure Machine Learning web services with SSL 
description: Learn how to secure a web service deployed with the Azure Machine Learning service. You can restrict access to web services and secure the data submitted by clients using secure socket layers (SSL) and key-based authentication. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual

ms.reviewer: jmartens
ms.author: aashishb
author: aashishb
ms.date: 10/02/2018
---

# Secure Azure Machine Learning web services with SSL

In this article, you will learn how to secure a web service deployed with the Azure Machine Learning service. You can restrict access to web services and secure the data submitted by clients using secure socket layers (SSL) and key-based authentication.

> [!Warning]
> If you do not enable SSL, any user on the internet will be able to make calls to the web service.

SSL encrypts data sent between the client and the web service. It also used by the client to verify the identity of the server. Authentication is only enabled for services that have provided an SSL certificate and key.  If you enable SSL, an authentication key is required when accessing the web service.

Whether you deploy a web service enabled with SSL or you enable SSL for existing deployed web service, the steps are the same:

1. Get a domain name.

2. Get an SSL certificate.

3. Deploy or update the web service with the SSL setting enabled.

4. Update your DNS to point to the web service.

There are slight differences when securing web services across the [deployment targets](how-to-deploy-and-where.md). 

## Get a domain name

If you do not already own a domain name, you can purchase one from a __domain name registrar__. The process differs between registrars, as does the cost. The registrar also provides you with tools for managing the domain name. These tools are used to map a fully qualified domain name (such as www.contoso.com) to the IP address hosting your web service.

## Get an SSL certificate

There are many ways to get an SSL certificate. The most common is to purchase one from a __Certificate Authority__ (CA). Regardless of where you obtain the certificate, you need the following files:

* A __certificate__. The certificate must contain the full certificate chain, and must be PEM-encoded.
* A __key__. The key must be PEM-encoded.

When requesting a certificate, you must provide the fully qualified domain name (FQDN) of the address you plan to use for the web service. For example, www.contoso.com. The address stamped into the certificate and the address used by the clients are compared when validating the identity of the web service. If the addresses do not match, the clients will receive an error. 

> [!TIP]
> If the Certificate Authority cannot provide the certificate and key as PEM-encoded files, you can use a utility such as [OpenSSL](https://www.openssl.org/) to change the format.

> [!IMPORTANT]
> Self-signed certificates should be used only for development. They should not be used in production. If you use a self-signed certificate, see the [Consuming web services with self-signed certificates](#self-signed) section for specific instructions.


## Enable SSL and deploy

To deploy (or re-deploy) the service with SSL enabled, set the `ssl_enabled` parameter to `True`, wherever applicable. Set the `ssl_certificate` parameter to the value of the __certificate__ file and the `ssl_key` to the value of the __key__ file. 

+ **Deploy on Azure Kubernetes Service (AKS)**
  
  While provisioning the AKS cluster, provide values for SSL-related parameters as shown in the code snippet:

    ```python
    from azureml.core.compute import AksCompute
    
    provisioning_config = AksCompute.provisioning_configuration(ssl_cert_pem_file="cert.pem", ssl_key_pem_file="key.pem", ssl_cname="www.contoso.com")
    ```

+ **Deploy on Azure Container Instances (ACI)**
 
  While deploying to ACI, provide values for SSL-related parameters as shown in the code snippet:

    ```python
    from azureml.core.webservice import AciWebservice
    
    aci_config = AciWebservice.deploy_configuration(ssl_enabled=True, ssl_cert_pem_file="cert.pem", ssl_key_pem_file="key.pem", ssl_cname="www.contoso.com")
    ```

+ **Deploy on Field Programmable Gate Arrays (FPGAs)**

  The response of the `create_service` operation contains the IP address of the service. The IP address is used when mapping the DNS name to the IP address of the service. The response also contains a __primary key__ and __secondary key__ that are used to consume the service. Provide values for SSL-related parameters as shown in the code snippet:

    ```python
    from amlrealtimeai import DeploymentClient
    
    subscription_id = "<Your Azure Subscription ID>"
    resource_group = "<Your Azure Resource Group Name>"
    model_management_account = "<Your AzureML Model Management Account Name>"
    location = "eastus2"
    
    model_name = "resnet50-model"
    service_name = "quickstart-service"
    
    deployment_client = DeploymentClient(subscription_id, resource_group, model_management_account, location)
    
    with open('cert.pem','r') as cert_file:
        with open('key.pem','r') as key_file:
            cert = cert_file.read()
            key = key_file.read()
            service = deployment_client.create_service(service_name, model_id, ssl_enabled=True, ssl_certificate=cert, ssl_key=key)
    ```

## Update your DNS

Next, you must update your DNS to point to the web service.

+ **For ACI and FPGA**:  

  Use the tools provided by your domain name registrar to update the DNS record for your domain name. The record must point to the IP address of the service.  

  Depending on the registrar, and the time to live (TTL) configured for the domain name, it can take several minutes to several hours before clients can resolve the domain name.

+ **For AKS**: 

  Update the DNS under the "Configuration" tab of the "Public IP Address" of the AKS cluster as shown in the image. You can find the Public IP Address as one of the resource types created under the resource group that contains the AKS agent nodes and other networking resources.

  ![Azure Machine Learning service: Securing web services with SSL](./media/how-to-secure-web-service/aks-public-ip-address.png)

## Consume authenticated services

### How to consume 
+ **For ACI and AKS**: 

  For ACI and AKS web services, learn how to consume web services in these articles:
  + [How to deploy to ACI](how-to-deploy-to-aci.md)

  + [How to deploy to AKS](how-to-deploy-to-aks.md)

+ **For FPGA**:  

  The following examples demonstrate how to consume an authenticated FPGA service in Python and C#.
  Replace `authkey` with the primary or secondary key that was returned when the service was deployed.

  Python example:
    ```python
    from amlrealtimeai import PredictionClient
    client = PredictionClient(service.ipAddress, service.port, use_ssl=True, access_token="authKey")
    image_file = R'C:\path_to_file\image.jpg'
    results = client.score_image(image_file)
    ```

  C# example:
    ```csharp
    var client = new ScoringClient(host, 50051, useSSL, "authKey");
    float[,] result;
    using (var content = File.OpenRead(image))
        {
            IScoringRequest request = new ImageRequest(content);
            result = client.Score<float[,]>(request);
        }
    ```

### Set the authorization header
Other gRPC clients can authenticate requests by setting an authorization header. The general approach is to create a `ChannelCredentials` object that combines `SslCredentials` with `CallCredentials`. This is added to the authorization header of the request. For more information on implementing support for your specific headers, see [https://grpc.io/docs/guides/auth.html](https://grpc.io/docs/guides/auth.html).

The following examples demonstrate how to set the header in C# and Go:

+ Use C# to set the header:
    ```csharp
    creds = ChannelCredentials.Create(baseCreds, CallCredentials.FromInterceptor(
                          async (context, metadata) =>
                          {
                              metadata.Add(new Metadata.Entry("authorization", "authKey"));
                              await Task.CompletedTask;
                          }));
    
    ```

+ Use Go to set the header:
    ```go
    conn, err := grpc.Dial(serverAddr, 
        grpc.WithTransportCredentials(credentials.NewClientTLSFromCert(nil, "")),
        grpc.WithPerRPCCredentials(&authCreds{
        Key: "authKey"}))
    
    type authCreds struct {
        Key string
    }
    
    func (c *authCreds) GetRequestMetadata(context.Context, uri ...string) (map[string]string, error) {
        return map[string]string{
            "authorization": c.Key,
        }, nil
    }
    
    func (c *authCreds) RequireTransportSecurity() bool {
        return true
    }
    ```

<a id="self-signed"></a>

## Consume services with self-signed certificates

There are two ways to enable the client to authenticate to a server secured with a self-signed certificate:

* On the client system, set the `GRPC_DEFAULT_SSL_ROOTS_FILE_PATH` environment variable on the client system to point to the certificate file.

* When constructing an `SslCredentials` object, pass the contents of the certificate file to the constructor.

Using either method causes gRPC to use the certificate as the root cert.

> [!IMPORTANT]
> gRPC does not accept untrusted certificates. Using an untrusted certificate will fail with an `Unavailable` status code. The details of the failure contain `Connection Failed`.
