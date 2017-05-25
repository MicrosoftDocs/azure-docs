---
title: Azure Service Fabric reverse proxy secure communication | Microsoft Docs
description: Configure reverse proxy to enable secure end-to-end communication.
services: service-fabric
documentationcenter: .net
author: kavyako
manager: vipulm

ms.assetid:
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: required
ms.date: 05/09/2017
ms.author: kavyako

---
# Connect to a secure service with the reverse proxy

This article explains how to establish secure connection between the reverse proxy and services, thus enabling an end to end secure channel.

Connecting to secure services is supported only when reverse proxy is configured to listen on HTTPS. Rest of the document assumes this is the case.
Refer to [Reverse proxy in Azure Service Fabric](https://docs.microsoft.com/azure/service-fabric/service-fabric-reverseproxy) to configure the reverse proxy in Service Fabric.

## Secure connection establishment between the reverse proxy and services 

### Reverse proxy authenticating to services:
The reverse proxy identifies itself to services using its certificate, specified with ***reverseProxyCertificate*** property in the **Cluster** [Resource type section](../azure-resource-manager/resource-group-authoring-templates.md). Services can implement the logic to verify the certificate presented by the reverse proxy. The services can specify the accepted client certificate details as configuration settings in the configuration package. This can be read at runtime and used to validate the certificate presented by the reverse proxy. Refer to [Manage application parameters](service-fabric-manage-multiple-environment-app-configuration.md) to add the configuration settings. 

### Reverse proxy verifying the service's identity via the certificate presented by the service:
To perform server certificate validation of the certificates presented by the services, reverse proxy supports one of the following options: None, ServiceCommonNameAndIssuer, and ServiceCertificateThumbprints.
To select one of these three options, specify the **ApplicationCertificateValidationPolicy** in the parameters section of ApplicationGateway/Http element under [fabricSettings](service-fabric-cluster-fabric-settings.md).

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

Refer to the next section for details about additional configuration for each of these options.

### Service certificate validation options 

- **None**: Reverse proxy skips verification of the proxied service certificate and establishes the secure connection. This is the default behavior.
Specify the **ApplicationCertificateValidationPolicy** with value **None** in the parameters section of ApplicationGateway/Http element.

- **ServiceCommonNameAndIssuer**: Reverse proxy verifies the certificate presented by the service based on certificate's common name and immediate issuer's thumbprint:
Specify the **ApplicationCertificateValidationPolicy** with value **ServiceCommonNameAndIssuer** in the parameters section of ApplicationGateway/Http element.

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

To specify the list of service common name and issuer thumbprints, add a **ApplicationGateway/Http/ServiceCommonNameAndIssuer** element under fabricSettings, as shown below. Multiple certificate common name and issuer thumbprint pairs can be added in the parameters array element. 

If the endpoint reverse proxy is connecting to presents a certificate who's common name and  issuer thumbprint matches any of the values specified here, SSL channel is established. 
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
Specify the **ApplicationCertificateValidationPolicy** with value **ServiceCertificateThumbprints** in the parameters section of ApplicationGateway/Http element.

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

Also specify the thumbprints with a **ServiceCertificateThumbprints** entry under parameters section of ApplicationGateway/Http element. Multiple thumbprints can be specified as a comma-separated list in the value field, as shown below:

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

If the thumbprint of the server certificate is listed in this config entry, reverse proxy succeeds the SSL connection. Otherwise, it terminates the connection and fails the client's request with a 502 (Bad Gateway). The HTTP status line will also contain the phrase "Invalid SSL Certificate."

## Endpoint selection logic when services expose secure as well as unsecured endpoints
Service fabric supports configuring  multiple endpoints for a service. See [Specify resources in a service manifest](service-fabric-service-manifest-resources.md).

Reverse proxy selects one of the endpoints to forward the request based on the  **ListenerName** query parameter. If this is not specified, it can pick any endpoint from the endpoints list. Now this can be an HTTP or HTTPS endpoint. There might be scenarios/requirements where you want the reverse proxy to operate in a "secure only mode", i.e you don't want the secure reverse proxy to forward requests to unsecured endpoints. This can be achieved by specifying the **SecureOnlyMode** configuration entry with value **true** in the parameters section of ApplicationGateway/Http element.   

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

> 
> When operating in **SecureOnlyMode**, if client has specified a **ListenerName** corresponding to an HTTP(unsecured) endpoint, reverse proxy fails the request with a 404 (Not Found) HTTP status code.

## Setting up client certificate authentication through the reverse proxy
SSL termination happens at the reverse proxy and all the client certificate data is lost. For the services to perform client certificate authentication, set the **ForwardClientCertificate** setting in the parameters section of ApplicationGateway/Http element.

1. When **ForwardClientCertificate** is set to **false**, reverse proxy will not request for the client certificate during its SSL handshake with the client.
This is the default behavior.

2. When **ForwardClientCertificate** is set to **true**, reverse proxy requests for the client's certificate during its SSL handshake with the client.
It will then forward the client certificate data in a custom HTTP header named **X-Client-Certificate**. The header value is the base64 encoded PEM format string of the client's certificate. The service can succeed/fail the request with appropriate status code after inspecting the certificate data.
If the client does not present a certificate, reverse proxy forwards an empty header and let the service handle the case.

> Reverse proxy is a mere forwarder. It will not perform any validation of the client's certificate.


## Next steps
* Refer to [Configure reverse proxy to connect to secure services](https://github.com/ChackDan/Service-Fabric/tree/master/ARM%20Templates/ReverseProxySecureSample#configure-reverse-proxy-to-connect-to-secure-services) for Azure Resource Manager template samples to configure secure reverse proxy with the different service certificate validation options.
* See an example of HTTP communication between services in a [sample project on GitHub](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started).
* [Remote procedure calls with Reliable Services remoting](service-fabric-reliable-services-communication-remoting.md)
* [Web API that uses OWIN in Reliable Services](service-fabric-reliable-services-communication-webapi.md)
* [Manage cluster certificates](service-fabric-cluster-security-update-certs-azure.md)
