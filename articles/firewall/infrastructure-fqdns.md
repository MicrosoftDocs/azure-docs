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

Azure Firewall includes a built-in rule collection for infrastructure FQDNs that are allowed by default. These FQDNs are specific for the platform and can't be used for other purposes. The allowed infrastructure FQDNs include:

- Compute access to storage Platform Image Repository (PIR)
- Managed disks status storage access
- Windows Diagnostics

## FQDN list

The following FQDNs are allowed for each service:


|Service  |FQDNs  |
|---------|---------|
|Compute access to storage Platform Image Repository (PIR)     |one <br>two<br>three|
|Managed disks status storage access     |one <br>two<br>three|
|Windows Diagnostics     |one <br>two<br>three|


## Overriding 

You can override this build-in infrastructure rule collection by creating a deny all application rule collection that is processed last. It will always be processed before the infrastructure rule collection. Anything not in the infrastructure rule collection is denied by default.

## Next steps

- Learn how to [deploy and configure an Azure Firewall](tutorial-firewall-deploy-portal.md).