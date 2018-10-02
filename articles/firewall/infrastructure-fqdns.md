---
title: Infrastructure FQDN for Azure Firewall
description: Learn about infrastructure FQDNs in Azure Firewall
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 9/24/2018
ms.author: victorh
---

# Infrastructure FQDNs

Azure Firewall includes a built-in rule collection for infrastructure FQDNs that are allowed by default. These FQDNs are specific for the platform and can't be used for other purposes. 

The following services are included in the built-in rule collection:

- Compute access to storage Platform Image Repository (PIR)
- Managed disks status storage access
- Azure Diagnostics and Logging (MDS)
- Azure Active Directory

## Overriding 

You can override this built-in infrastructure rule collection by creating a deny all application rule collection that is processed last. It will always be processed before the infrastructure rule collection. Anything not in the infrastructure rule collection is denied by default.

## Next steps

- Learn how to [deploy and configure an Azure Firewall](tutorial-firewall-deploy-portal.md).