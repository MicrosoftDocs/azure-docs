---
title: Enable end-to-end Transport Layer Security
titleSuffix: Azure Spring Cloud
description: How to enable end-to-end Transport Layer Security for an application.
author: karlerickson
ms.author: karler
ms.service: spring-cloud
ms.topic: how-to
ms.date: 03/24/2021
ms.custom: devx-track-java
---

# Enable end-to-end TLS for an application

This topic shows you how to enable end-to-end SSL/TLS to secure traffic from an ingress controller to applications that support HTTPS. After you enable end-to-end TLS and load a cert from keyvault, all communications within Azure Spring Cloud are secured with TLS.

   ![Graph of communications secured by TLS.](media/enable-end-to-end-tls/secured-tls.png)

## Prerequisites

- A deployed Azure Spring Cloud instance. Follow our [quickstart on deploying via the Azure CLI](./quickstart.md) to get started.
- If you're unfamiliar with end-to-end TLS, see the [end-to-end TLS sample](https://github.com/Azure-Samples/spring-boot-secure-communications-using-end-to-end-tls-ssl).
- To securely load the required certificates into Spring Boot apps, you can use [keyvault spring boot starter](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-starter-keyvault-certificates).


## Enable end-to-end TLS on an existing app

Use the command `az spring-cloud app update --enable-end-to-end-tls` to enable or disable end-to-end TLS for an app.

```azurecli
az spring-cloud app update --enable-end-to-end-tls -n app_name -s service_name -g resource_group_name
az spring-cloud app update --enable-end-to-end-tls false -n app_name -s service_name -g resource_group_name
```

## Enable end-to-end TLS when you bind custom domain

Use the command `az spring-cloud app custom-domain update --enable-end-to-end-tls` or `az spring-cloud app custom-domain bind --enable-end-to-end-tls` to enable or disable end-to-end TLS for an app.

```azurecli
az spring-cloud app custom-domain update --enable-end-to-end-tls -n app_name -s service_name -g resource_group_name
az spring-cloud app custom-domain bind --enable-end-to-end-tls -n app_name -s service_name -g resource_group_name
```

## Enable end-to-end TLS using Azure portal
To enable end-to-end TLS in the [Azure portal](https://portal.azure.com/), first create an app, and then enable the feature.

1. Create an app in the portal as you normally would. Navigate to it in the portal.
2. Scroll down to the **Settings** group in the left navigation pane.
3. Select **End-to-end TLS**.
4. Switch **End-to-end TLS** to *Yes*.

 ![Enable End-to-end TLS in portal](./media/enable-end-to-end-tls/enable-tls.png)


## Verify end-to-end TLS status

Use the command `az spring-cloud app show` to check the value of `enableEndToEndTls`.
```
az spring-cloud app show -n app_name -s service_name -g resource_group_name
```

## Next steps
* [Access Config Server and Service Registry](how-to-access-data-plane-azure-ad-rbac.md)