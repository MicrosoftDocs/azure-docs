---
title: Domain Join VM
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

## Summary
This document is currently in draft

## Endpoints

### Ports
[Required ports and protocols](https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/active-directory-domain-join-troubleshooting-guidance#port-requirements)

## Manual Domain Join for troubleshooting
### Test domain join by logging into VM
Change the default workgroup to your domain
![image](/assets/Domain-join-add-domain-prompt.png)

If the domain is reachable from the VM, you will be asked to login
![image](/assets/Domain-join-enter-credentials.png)

Success
![image](/assets/Domain-join-success-message.png)
