---
title: Enable end-to-end Transport Layer Security
description: How to enable end-to-end Transport Layer Security for an application.
author:  MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: how-to
ms.date: 03/24/2021
ms.custom: devx-track-java, devx-track-azurecli
---

# How to enable end-to-end TLS for an application

This topic shows you how to enable end-to-end SSL/TLS to secure traffic from an ingress controller to applications. Note that the app must support HTTPS. To securely load the required certificates into Spring Boot apps, you can use [keyvault spring boot starter](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-starter-keyvault-certificates).

## Prerequisites 

- A deployed Azure Spring Cloud instance. Follow our [quickstart on deploying via the Azure CLI](https://docs.microsoft.com/azure/spring-cloud/spring-cloud-quickstart-launch-app-cli) to get started.
- If you're unfamiliar with end-to-end TLS, see the [end-to-end TLS sample](https://github.com/Azure-Samples/spring-boot-secure-communications-using-end-to-end-tls-ssl).


## Enable end-to-end TLS on an existing app

Use the command `az spring-cloud app update --enable-end-to-end-tls` to enable or disable end-to-end TLS for an app.

```azurecli

```
az spring-cloud app update --enable-end-to-end-tls -n app_name -s service_name -g resource_group_name
az spring-cloud app update --enable-end-to-end-tls false -n app_name -s service_name -g resource_group_name
```

## Enable end-to-end TLS when you bind custom domain

Use the command `az spring-cloud app custom-domain update --enable-end-to-end-tls` or `az spring-cloud app custom-domain bind --enable-end-to-end-tls` to enable or disable end-to-end TLS for an app.

```azurecli
az spring-cloud app custom-domain update --enable-end-to-end-tls -n app_name -s service_name -g resource_group_name
az spring-cloud app custom-domain bind --enable-end-to-end-tls -n app_name -s service_name -g resource_group_name
```

## Verify end-to-end TLS status

Use the command `az spring-cloud app show` to check the value of `enableEndToEndTls`.
```
az spring-cloud app show -n app_name -s service_name -g resource_group_name
```

## Next steps