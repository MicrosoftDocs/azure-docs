---
title: FQDS tags overview for Azure Firewall
description: Learn about the FQDN tags in Azure Firewall
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 9/24/2018
ms.author: victorh
---

# FQDN tags overview

FQDN tags make it easy for you to allow well known Azure service network traffic through your firewall. For example, say you want to allow Azure Backup network traffic through your firewall. You create an application rule, include the Azure Backup tag, and now network traffic from Azure Backup can flow through your firewall.

<!--- screenshot of application rule with Azure Backup tag.-->

The following table shows the current FQDN tags you can use. Microsoft maintains these tags and updates the list periodically.


|FQDN tag  |Description  |
|---------|---------|
|Azure Backup     |         |
|Windows Update     |         |
|SQL     |         |
|App Service Environment     |         |


### Next steps

TBD