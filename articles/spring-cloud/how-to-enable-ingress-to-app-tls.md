---
title: Enable ingress-to-app Transport Layer Security
titleSuffix: Azure Spring Cloud
description: How to enable ingress-to-app Transport Layer Security for an application.
author: WenhaoZhang-MS
ms.author: wenhaozhang
ms.service: spring-cloud
ms.topic: how-to
ms.date: 01/19/2022
ms.custom: devx-track-java
---
# Overview

This article describes what the secure communication of Azure Spring Cloud like and the following picture shows the overall secure communication support in Azure Spring Cloud.

![Graph of communications secured by TLS.](media/enable-end-to-end-tls/secured-tls.png)

## Secure communication model within Azure Spring Cloud

Here we would explain the secure communication model in Azure spring cloud in detail according to the overview picture.

1. Client request either from mobile or Browser or other clients to azure spring cloud apps would first come into the ingress controller. By default, the request could be either HTTP or HTTPS and the TLS certificate returned by ingress controller is issued by Microsoft Azure TLS issuing CA.
   
   If the app has been mapped to an existing custom domain and is configured as HTTPS only, the request to the ingress controller could only be HTTPS and the TLS certificate returned by ingress controller is the SSL binding certificate for that custom domain. The server side SSL/TLS verification for custom domain is accomplished in ingress controller.

2.  The secure communication between ingress controller and azure spring cloud applications is controlled by ingress-to-app TLS. This could be controlled by customers through portal or cli, and we would explain the way to enable it in this article later. If ingress-to-app TLS is disabled, the communication between ingress controller and azure spring cloud apps is HTTP and it would be HTTPS if the ingress-to-app TLS is enabled. This has no relation to the communication way from clients to ingress controller and the ingress controller would not verify the certificate returned from azure spring cloud apps because the ingress-to-app TLS is just meant to encrypt the communication as not to be visible to anyone including Microsoft.

3. Communication between Azure Spring Cloud applications and Azure Spring Cloud service runtime like config server, service registry and eureka server is always HTTPS and it is fully took care of by Azure Spring Cloud. Customers do not need to concern about them. 

4. The communication between Azure Spring Cloud applications is fully managed by customers, and customers could also take the convenience of Azure Spring Cloud provided feature [Use TLS/SSL certificates in an application](./how-to-use-tls-certificate.md)  to load certificates into application's trust store.

5. The communication between azure spring cloud applications and external service is fully managed by customers, too. To reduce customer's developing effort, Azure Spring Cloud provides a convenient way to help customers manage their public certificates and load them into application's trust store. Follow this could [Use TLS/SSL certificates in an application](./how-to-use-tls-certificate.md) to use this feature.

## Enable ingress-to-app TLS for an application

The following part of this article shows how to enable ingress-to-app SSL/TLS to secure traffic from an ingress controller to applications that support HTTPS.

### Prerequisites

- A deployed Azure Spring Cloud instance. Follow our [quickstart on deploying via the Azure CLI](./quickstart.md) to get started.
- If you're unfamiliar with ingress-to-app TLS, see the [end-to-end TLS sample](https://github.com/Azure-Samples/spring-boot-secure-communications-using-end-to-end-tls-ssl).
- To securely load the required certificates into Spring Boot apps, you can use [keyvault spring boot starter](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-starter-keyvault-certificates).

### Enable ingress-to-app TLS on an existing app

Use the command `az spring-cloud app update --enable-ingress-to-app-tls` to enable or disable ingress-to-app TLS for an app.

```azurecli
az spring-cloud app update --enable-ingress-to-app-tls -n app_name -s service_name -g resource_group_name
az spring-cloud app update --enable-ingress-to-app-tls false -n app_name -s service_name -g resource_group_name
```

### Enable ingress-to-app TLS when you bind custom domain

Use the command `az spring-cloud app custom-domain update --enable-ingress-to-app-tls` or `az spring-cloud app custom-domain bind --enable-ingress-to-app-tls` to enable or disable ingress-to-app TLS for an app.

```azurecli
az spring-cloud app custom-domain update --enable-ingress-to-app-tls -n app_name -s service_name -g resource_group_name
az spring-cloud app custom-domain bind --enable-ingress-to-app-tls -n app_name -s service_name -g resource_group_name
```

### Enable ingress-to-app TLS using Azure portal
To enable ingress-to-app TLS in the [Azure portal](https://portal.azure.com/), first create an app, and then enable the feature.

1. Create an app in the portal as you normally would. Navigate to it in the portal.
2. Scroll down to the **Settings** group in the left navigation pane.
3. Select **Ingress-to-app TLS**.
4. Switch **Ingress-to-app TLS** to *Yes*.

![Enable Ingress-to-app TLS in portal](./media/enable-end-to-end-tls/enable-i2a-tls.png)

### Verify ingress-to-app TLS status

Use the command `az spring-cloud app show` to check the value of `enableEndToEndTls`.

```azurecli
az spring-cloud app show -n app_name -s service_name -g resource_group_name
```

## Next steps

* [Access Config Server and Service Registry](how-to-access-data-plane-azure-ad-rbac.md)
