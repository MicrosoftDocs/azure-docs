---
title: Migrate Azure Application Gateway v1 to v2
description: This show you how to migrate Azure Application Gateway from v1 to v2
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: article
ms.date: 5/31/2019
ms.author: victorh
---

# Migrate Azure Application Gateway from v1 to v2

Azure Application Gateway v2 is now available, offering additional features such as autoscaling, and availability-zone redundancy. However, existing  v1 gateways are not automatically upgraded to v2. If you want to migrate from v1 to v2, follow the steps in this article.

There are two stages in the migration:

1. Migrate the configuration
2. Migrate the client traffic

This article covers configuration migration. Client traffic migration varies depending on the specifics of the environment. However, some high-level, general recommendations are provided.

## Migration overview

An Azure PowerShell script is available that does the following:

* Creates a new Standard_v2 or WAF_v2 gateway in a virtual network subnet that you specify.
* Seamlessly copies the configuration associated with the v1 Standard or WAF gateway to the newly created Standard_V2 or WAF_V2 gateway.

### Caveats\Limitations

* The new Standard_v2 or WAF_v2 gateway has new public and private IP addresses. It is not possible to move the IP addresses associated with the existing v1 gateway seamlessly to v2. However, you can allocate an existing (unallocated) public or private IP address to the new v2 gateway.
* You must provide an IP address space for another subnet within your virtual network where your v1 gateway is located. The script can't create the v2 gateway in any existing subnets that already have a v1 gateway. However, if the existing subnet already has a v2 gateway, that may still work provided there is enough IP address space.
* To  migrate an SSL configuration, you must specify all the SSL certs used in your v1 gateway.
* Migration is not supported for v1 gateways with FIPS mode enabled.

## Download the script

Download the migration script from the  [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureAppGWMigration).

## Install the script

There are two options for you depending on your local PowerShell environment setup and preferences:

* If you don’t have the Azure Az modules installed, or don’t mind uninstalling the Azure Az modules, the best option is to go with the “Install-Script” option to install the script.
* If you need to keep the Azure Az modules, your best bet is to download the script and run it.

To determine 

## Next steps

[Learn about application gateway components](application-gateway-components.md)
