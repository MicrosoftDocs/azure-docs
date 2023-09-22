---
title: 'Using a deprecated version of Microsoft Entra Connect'
description: This article describes what to do if you find that you're running a deprecated version.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---




# Using a deprecated version of Microsoft Entra Connect

You may have received a notification email that says that your [Microsoft Entra Connect version is deprecated](whatis-azure-ad-connect-v2.md) and no longer supported.  Or, you may have read a portal recommendation about upgrading your Microsoft Entra Connect version. What is next?

[!INCLUDE [Choose cloud sync](../../../../includes/choose-cloud-sync.md)]

Using a deprecated and unsupported version of Microsoft Entra Connect isn't recommended and not supported. Deprecated and unsupported versions of Microsoft Entra Connect may **unexpectedly stop working**.  In these instances, you may need to install the latest version of Microsoft Entra Connect as your only remedy to restore your sync process. 

We regularly update Microsoft Entra Connect with [newer versions](reference-connect-version-history.md). The new versions have bug fixes, performance improvements, new functionality, and security fixes, so it's important to stay up to date.

## How to replace your deprecated version


If you're still using a deprecated and unsupported version of Microsoft Entra Connect, here's what you should do:

 1. Verify which version you should install. Most customers no longer need Microsoft Entra Connect and can now use [Microsoft Entra Cloud Sync](../cloud-sync/what-is-cloud-sync.md). Cloud sync is the next generation of sync tools to provision users and groups from AD into Microsoft Entra ID. It features a lightweight agent and is fully managed from the cloud – and it upgrades to newer versions automatically, so you never have to worry about upgrading again! 

 2. If you're not yet eligible for Microsoft Entra Cloud Sync, please follow this [link to download](https://www.microsoft.com/download/details.aspx?id=47594) and install the latest version of Microsoft Entra Connect. In most cases, upgrading to the latest version will only take a few moments. For more information, see [Upgrading Microsoft Entra Connect from a previous version.](how-to-upgrade-previous-version.md).


## Next steps

- [What is Microsoft Entra Connect V2?](whatis-azure-ad-connect-v2.md)
- [Microsoft Entra Cloud Sync](../cloud-sync/what-is-cloud-sync.md)
- [Microsoft Entra Connect version history](reference-connect-version-history.md)
