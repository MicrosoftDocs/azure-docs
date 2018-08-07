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

There are three potential types of FQDN tags:

1)	Built-in FQDN tags – these are similar to L3-L4 service tags in a sense that Microsoft is responsible to maintain the actual FQDNs the tag represents. There are two sub types here:
a.	Generic/static tags – for example, “Windows Update” has the same list of endpoints for all users.
b.	Per deployment/dynamic tags – for example, App Service Environment and Azure Backup create storage accounts per deployment. Such a list can only be determined dynamically (for example, RP to RP calls)
2)	Custom FQDN tags – these are similar to the planned L3-L4 IP Groups, but at Layer 7. Users can create logical group that they can them reuse as destination in different rules. It seems this is what you referred to below.
3)	Infra Default collection – this is the default generic FQDNs for platform services where users not even aware of these services, so they will not define explicit rules to open access unless they find out something is not working as expected. 


### Next steps

TBD