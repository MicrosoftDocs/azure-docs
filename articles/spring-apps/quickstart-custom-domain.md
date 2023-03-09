---
title: Map a custom domain to Azure Spring Apps
description: Learn how to map a web domain to apps in Azure Spring Apps.
author: karlerickson
ms.author: haojianzhong
ms.service: spring-apps
ms.topic: quickstart
ms.date: 03/14/2023
ms.custom: devx-track-java
---

# Map a custom domain to Azure Spring Apps

**This article applies to:** ✔️ Standard consumption (Preview) ❌ Basic/Standard ❌ Enterprise

 This article shows how to map a custom web site domain, such as such as [www.contoso.com](https://www.contoso.com/), to your app in Azure Spring Apps. This mapping is accomplished by using a CNAME record that is made known to the Domain Name Service (DNS) that stores node names throughout the network.

The mapping secures the custom domain with a certificate and enforces Transport Layer Security (TLS), also known as Secure Sockets Layer (SSL).

## Prerequisites

* An application deployed to Azure Spring Apps. For more information see [Quickstart: Build and deploy apps to Azure Spring Apps](/azure/spring-apps/quickstart-deploy-apps).
* A domain name registered in the DNS registry as provided by a web hosting or domain provider.
* A certificate resource created under the Azure Container Apps Environment, see [Add certificate in Container App](/azure/container-apps/custom-domains-certificates).

## Map a custom domain

To map the custom domain, you create the CNAME record and then use the Azure CLI to bind the domain to an app in Azure Spring Apps.

## Create the CNAME record

* Contact your DNS provider to request a CNAME record to map your domain to the Full Qualified Domain Name (FQDN) of your spring app.
* Add a TXT record with the name `asuid.{subdomain}`, with the value being the verification ID of your Azure Container Apps Environment. You can find this value using the following command.

```azurecli
az containerapp env show \
--name <managed environment name> \
--resource-group <resource group> \
--query 'properties.customDomainConfiguration.customDomainVerificationId'
```

After you add the CNAME and TXT record, the DNS records page will resemble the following table.

| Name              | Type  | Value                                                            |
|-------------------|-------|------------------------------------------------------------------|
| {subdomain}       | CNAME | testapp.agreeablewater-4c8480b3.eastus.azurecontainerapps.io     |
| asuid.{subdomain} | A     | 6K861CL04CATKUCFF604024064D57PB52F5DF7B67BC3033BA9808BDA8998U270 |

## Bind the custom domain

Bind the custom domain to your app using the following Azure CLI command.

```azurecli
az spring app custom-domain bind \
--resource-group <resource group> \
--service <service name> \
--app <app name> \
--domain-name <your custom domain name> \
--certificate <name of your certificate under managed environment>
```

## Next steps
