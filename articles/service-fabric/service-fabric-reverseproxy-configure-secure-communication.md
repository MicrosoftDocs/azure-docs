---
title: Azure Service Fabric reverse proxy secure communication 
description: Configure reverse proxy to enable secure end-to-end communication in an Azure Service Fabric application.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Connect to a secure service with the reverse proxy

This article explains how to establish secure connection between the reverse proxy and services, thus enabling an end to end secure channel. To learn more about reverse proxy, see [Reverse proxy in Azure Service Fabric](service-fabric-reverseproxy.md)

> [!IMPORTANT]
> Connecting to secure services is supported only when reverse proxy is configured to listen on HTTPS. This article assumes this is the case. Refer to [Setup reverse proxy in Azure Service Fabric](service-fabric-reverseproxy-setup.md) to configure the reverse proxy in Service Fabric.

## Secure connection establishment between the reverse proxy and services 

### Reverse proxy authenticating to services:
The reverse proxy identifies itself to services using its certificate. For Azure clusters the certificate is specified with ***reverseProxyCertificate*** property in the [**Microsoft.ServiceFabric/clusters**](/azure/templates/microsoft.servicefabric/clusters) [Resource type section](../azure-resource-manager/templates/syntax.md) of the Resource Manager template. For standalone clusters, the certificate is specified with either the ***ReverseProxyCertificate*** or the ***ReverseProxyCertificateCommonNames*** property in the **Security** section of ClusterConfig.json. To learn more, see [Enable reverse proxy on standalone clusters](service-fabric-reverseproxy-setup.md#enable-reverse-proxy-on-standalone-clusters). 

Services can implement the logic to verify the certificate presented by the reverse proxy. The services can specify the accepted client certificate details as configuration settings in the configuration package. This can be read at runtime and used to validate the certificate presented by the reverse proxy. Refer to [Manage application parameters](service-fabric-manage-multiple-environment-app-configuration.md) to add the configuration settings. 

### Reverse proxy verifying the service's identity via the certificate presented by the service:
Reverse proxy supports the following policies to perform server certificate validation of the certificates presented by services: None, ServiceCommonNameAndIssuer, and ServiceCertificateThumbprints.
To select the policy for reverse proxy to use, specify the **ApplicationCertificateValidationPolicy** in the **ApplicationGateway/Http** section under [fabricSettings](service-fabric-cluster-fabric-settings.md).

The next section shows configuration details for each of these options.

### Service certificate validation options 

- **None**: Reverse proxy skips verification of the proxied service certificate and establishes the secure connection. This is the default behavior.
Specify the **ApplicationCertificateValidationPolicy** with value **None** in the [**ApplicationGateway/Http**](./service-fabric-cluster-fabric-settings.md#applicationgatewayhttp) section.

   ```json
   {
   "fabricSettings": [
             ...
             {
               "name": "ApplicationGateway/Http",
               "parameters": [
                 {
                   "name": "ApplicationCertificateValidationPolicy",
                   "value": "None"
                 }
               ]
             }
           ],
           ...
   }
   ```

- **ServiceCommonNameAndIssuer**: Reverse proxy verifies the certificate presented by the service based on certificate's common name and immediate issuer's thumbprint:
Specify the **ApplicationCertificateValidationPolicy** with value **ServiceCommonNameAndIssuer** in the [**ApplicationGateway/Http**](./service-fabric-cluster-fabric-settings.md#applicationgatewayhttp) section.

   ```json
   {
   "fabricSettings": [
             ...
             {
               "name": "ApplicationGateway/Http",
               "parameters": [
                 {
                   "name": "ApplicationCertificateValidationPolicy",
                   "value": "ServiceCommonNameAndIssuer"
                 }
               ]
             }
           ],
           ...
   }
   ```

   To specify the list of service common name and issuer thumbprints, add a [**ApplicationGateway/Http/ServiceCommonNameAndIssuer**](./service-fabric-cluster-fabric-settings.md#applicationgatewayhttpservicecommonnameandissuer) section under **fabricSettings**, as shown below. Multiple certificate common name and issuer thumbprint pairs can be added in the **parameters** array. 

   If the endpoint reverse proxy is connecting to presents a certificate who's common name and issuer thumbprint matches any of the values specified here, a TLS channel is established.
   Upon failure to match the certificate details, reverse proxy fails the client's request with a 502 (Bad Gateway) status code. The HTTP status line will also contain the phrase "Invalid SSL Certificate." 

   ```json
   {
   "fabricSettings": [
             ...
             {
               "name": "ApplicationGateway/Http/ServiceCommonNameAndIssuer",
               "parameters": [
                 {
                   "name": "WinFabric-Test-Certificate-CN1",
                   "value": "b3 44 9b 01 8d 0f 68 39 a2 c5 d6 2b 5b 6c 6a c8 22 b4 22 11"
                 },
                 {
                   "name": "WinFabric-Test-Certificate-CN2",
                   "value": "b3 44 9b 01 8d 0f 68 39 a2 c5 d6 2b 5b 6c 6a c8 22 11 33 44"
                 }
               ]
             }
           ],
           ...
   }
   ```

- **ServiceCertificateThumbprints**: Reverse proxy will verify the proxied service certificate based on its thumbprint. You can choose to go this route when the services are configured with self signed certificates: 
Specify the **ApplicationCertificateValidationPolicy** with value **ServiceCertificateThumbprints** in the [**ApplicationGateway/Http**](./service-fabric-cluster-fabric-settings.md#applicationgatewayhttp) section.

   ```json
   {
   "fabricSettings": [
             ...
             {
               "name": "ApplicationGateway/Http",
               "parameters": [
                 {
                   "name": "ApplicationCertificateValidationPolicy",
                   "value": "ServiceCertificateThumbprints"
                 }
               ]
             }
           ],
           ...
   }
   ```

   Also specify the thumbprints with a **ServiceCertificateThumbprints** entry in the **ApplicationGateway/Http** section. Multiple thumbprints can be specified as a comma-separated list in the value field, as shown below:

   ```json
   {
   "fabricSettings": [
             ...
             {
               "name": "ApplicationGateway/Http",
               "parameters": [
                   ...
                 {
                   "name": "ServiceCertificateThumbprints",
                   "value": "78 12 20 5a 39 d2 23 76 da a0 37 f0 5a ed e3 60 1a 7e 64 bf,78 12 20 5a 39 d2 23 76 da a0 37 f0 5a ed e3 60 1a 7e 64 b9"
                 }
               ]
             }
           ],
           ...
   }
   ```

   If the thumbprint of the server certificate is listed in this config entry, reverse proxy succeeds the TLS connection. Otherwise, it terminates the connection and fails the client's request with a 502 (Bad Gateway). The HTTP status line will also contain the phrase "Invalid SSL Certificate."

## Endpoint selection logic when services expose secure as well as unsecured endpoints
Service fabric supports configuring  multiple endpoints for a service. For more information, see [Specify resources in a service manifest](service-fabric-service-manifest-resources.md).

Reverse proxy selects one of the endpoints to forward the request based on the **ListenerName** query parameter in the [service URI](./service-fabric-reverseproxy.md#uri-format-for-addressing-services-by-using-the-reverse-proxy). If the **ListenerName** parameter is not specified, reverse proxy can pick any endpoint from the endpoints list. Depending on the endpoints configured for the service, the endpoint selected can be an HTTP or HTTPS endpoint. There might be scenarios or requirements where you want the reverse proxy to operate in a "secure-only mode"; that is, you don't want the secure reverse proxy to forward requests to unsecured endpoints. To set reverse proxy to secure-only mode, specify the **SecureOnlyMode** configuration entry with value **true** in the [**ApplicationGateway/Http**](./service-fabric-cluster-fabric-settings.md#applicationgatewayhttp) section.   

```json
{
"fabricSettings": [
          ...
          {
            "name": "ApplicationGateway/Http",
            "parameters": [
                ...
              {
                "name": "SecureOnlyMode",
                "value": true
              }
            ]
          }
        ],
        ...
}
```

> [!NOTE]
> When operating in **SecureOnlyMode**, if a client has specified a **ListenerName** corresponding to an HTTP(unsecured) endpoint, reverse proxy fails the request with a 404 (Not Found) HTTP status code.

## Setting up client certificate authentication through the reverse proxy
TLS termination happens at the reverse proxy and all the client certificate data is lost. For the services to perform client certificate authentication, specify the **ForwardClientCertificate** setting in the [**ApplicationGateway/Http**](./service-fabric-cluster-fabric-settings.md#applicationgatewayhttp) section.

1. When **ForwardClientCertificate** is set to **false**, reverse proxy will not request the client certificate during its TLS handshake with the client.
This is the default behavior.

2. When **ForwardClientCertificate** is set to **true**, reverse proxy requests the client's certificate during its TLS handshake with the client.
It will then forward the client certificate data in a custom HTTP header named **X-Client-Certificate**. The header value is the base64 encoded PEM format string of the client's certificate. The service can succeed/fail the request with appropriate status code after inspecting the certificate data.
If the client does not present a certificate, reverse proxy forwards an empty header and lets the service handle the case.

> [!NOTE]
> Reverse proxy acts only as a forwarding service. It will not perform any validation of the client's certificate.


## Next steps
* [Set up and configure reverse proxy on a cluster](service-fabric-reverseproxy-setup.md).
* Refer to [Configure reverse proxy to connect to secure services](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/Reverse-Proxy-Sample#configure-reverse-proxy-to-connect-to-secure-services)
* See an example of HTTP communication between services in a [sample project on GitHub](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started).
* [Remote procedure calls with Reliable Services remoting](service-fabric-reliable-services-communication-remoting.md)
* [Web API that uses OWIN in Reliable Services](./service-fabric-reliable-services-communication-aspnetcore.md)
* [Manage cluster certificates](service-fabric-cluster-security-update-certs-azure.md)