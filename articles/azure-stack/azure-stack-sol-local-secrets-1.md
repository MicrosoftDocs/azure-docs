---
title: Use local secrets in your cloud app | Microsoft Docs
description: Add your organization's custom Windows or Linux VM image for tenants to use
services: azure-stack
documentationcenter: ''
author: Heathl17
manager: byronr
editor: ''

ms.assetid: e5a4236b-1b32-4ee6-9aaa-fcde297a020f
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 4/12/2017
ms.author: helaw

---

# Build your cloud app with on-prem secrets

To meet security or regulatory requirements, organizations may need to keep specific information out of the public cloud.  Azure Stack provides KeyVault services, which stores secrets like passwords and certificates in a hardened vault. This document provides pattern guidance on architecting your public cloud application to store secrets in Azure Stack. 

## Architectural overview
![image of the architectural overview](./media/azure-stack-sol-local-secrets-1/image1.png)


## Service limitations
KeyVault can be accessed via Azure Resource Manager templates, or via REST APIs.  Limitations in Azure Resource Manager only allow for REST API Access to KeyVault across clouds.


## Deploy the samples
