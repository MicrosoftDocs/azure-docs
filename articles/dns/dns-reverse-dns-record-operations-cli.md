---
title: Manage reverse DNS records for your Azure services using Azure CLI | Microsoft Docs
description: How to manage reverse DNS records or PTR records for Azure services using the Azure CLI in Resource Manager
services: DNS
documentationcenter: na
author: s-malone
manager: carmonm
editor: ''
tags: azure-resource-manager

ms.assetid: c655707e-1156-4893-b163-0b228ffd25d2
ms.service: DNS
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/27/2017
ms.author: smalone

---
# How to manage reverse DNS records for your Azure services using the Azure CLI

[!INCLUDE [dns-reverse-dns-record-operations-arm-selectors-include.md](../../includes/dns-reverse-dns-record-operations-arm-selectors-include.md)]


[!INCLUDE [dns-reverse-dns-record-operations-intro-include.md](../../includes/dns-reverse-dns-record-operations-intro-include.md)]

## CLI versions to complete the task

You can complete the task using one of the following CLI versions:

* [Azure CLI 1.0](dns-reverse-dns-record-operations-cli-nodejs.md) - our CLI for the classic and resource management deployment models.
* [Azure CLI 2.0](dns-reverse-dns-record-operations-cli.md) - our next generation CLI for the resource management deployment model.

## Introduction

[!INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)]

For more information about the classic deployment model, see [How to manage reverse DNS records for your Azure services (classic) using Azure PowerShell](dns-reverse-dns-record-operations-classic-ps.md).


## Validation of reverse DNS records
To ensure a third party can’t create reverse DNS records mapping to your DNS domains, Azure only allows the creation of a reverse DNS record where one of the following is true:

* The “ReverseFqdn” is the same as the “Fqdn” for the Public IP Address resource for which it has been specified, or the “Fqdn” for any Public IP Address within the same subscription e.g., “ReverseFqdn” is “contosoapp1.northus.cloudapp.azure.com.”.
* The “ReverseFqdn” forward resolves to the name or IP of the Public IP Address for which it has been specified, or to any Public IP Address “Fqdn” or IP within the same subscription e.g., “ReverseFqdn” is “app1.contoso.com.” which is a CName alias for “contosoapp1.northus.cloudapp.azure.com.”

Validation checks are only performed when the reverse DNS property for a Public IP Address is set or modified. Periodic re-validation is not performed.

## Add reverse DNS to existing Public IP addresses
You can add reverse DNS to an existing Public IP address using the azure network public-ip set:

```azurecli
az network public-ip update --resource-group NRP-DemoRG-PS --name PublicIp --reverse-fqdn contosoapp1.westus.cloudapp.azure.com.
```

If you wish to add reverse DNS to an existing Public IP Address that doesn't already have a DNS name, you must also specify a DNS name. You can add achieve this using the azure network public-ip set:

```azurecli
az network public-ip update --resource-group NRP-DemoRG-PS --name PublicIp --reverse-fqdn contosoapp1.westus.cloudapp.azure.com --dns-name contosoapp1
```

## Create a Public IP Address with reverse DNS
You can add a new Public IP Address with the reverse DNS property specified using the azure network public-ip create:

```azurecli
az network public-ip create --name PublicIp --resource-group NRP-DemoRG-PS --location westcentralus --dns-name contosoapp1 --reverse-fqdn contosoapp1.westcentralus.cloudapp.azure.com
```

## View reverse DNS for existing Public IP Addresses
You can view the configured value for an existing Public IP Address using the azure network public-ip show:

```azurecli
 az network public-ip show --name PublicIp --resource-group NRP-DemoRG-PS
```

## Remove reverse DNS from existing Public IP Addresses
You can remove a reverse DNS property from an existing Public IP Address using azure network public-ip set. This is done by setting the ReverseFqdn property value to blank:

```azurecli
az network public-ip update --resource-group NRP-DemoRG-PS --name PublicIp --reverse-fqdn ""
```

[!INCLUDE [FAQ1](../../includes/dns-reverse-dns-record-operations-faq-host-own-arpa-zone-include.md)]

[!INCLUDE [FAQ2](../../includes/dns-reverse-dns-record-operations-faq-arm-include.md)]

