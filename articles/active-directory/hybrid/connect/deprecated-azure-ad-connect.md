---
title: 'Using a deprecated version of Azure AD Connect'
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




# Using a deprecated version of Azure AD Connect

You may have received a notification email that says that your [Azure AD Connect version is deprecated](whatis-azure-ad-connect-v2.md) and no longer supported.  Or, you may have read a portal recommendation about upgrading your Azure AD Connect version. What is next?

[!INCLUDE [Choose cloud sync](../../../../includes/choose-cloud-sync.md)]

Using a deprecated and unsupported version of Azure AD Connect isn't recommended and not supported. Deprecated and unsupported versions of Azure AD Connect may **unexpectedly stop working**.  In these instances, you may need to install the latest version of Azure AD Connect as your only remedy to restore your sync process. 

We regularly update Azure AD Connect with [newer versions](reference-connect-version-history.md). The new versions have bug fixes, performance improvements, new functionality, and security fixes, so it's important to stay up to date.

## How to replace your deprecated version


If you're still using a deprecated and unsupported version of Azure AD Connect, here's what you should do:

 1. Verify which version you should install. Most customers no longer need Azure AD Connect and can now use [Azure AD Cloud Sync](../cloud-sync/what-is-cloud-sync.md). Cloud sync is the next generation of sync tools to provision users and groups from AD into Azure AD. It features a lightweight agent and is fully managed from the cloud – and it upgrades to newer versions automatically, so you never have to worry about upgrading again! 

 2. If you're not yet eligible for Azure AD Cloud Sync, please follow this [link to download](https://www.microsoft.com/download/details.aspx?id=47594) and install the latest version of Azure AD Connect. In most cases, upgrading to the latest version will only take a few moments. For more information, see [Upgrading Azure AD Connect from a previous version.](how-to-upgrade-previous-version.md).


## Next steps

- [What is Azure AD Connect V2?](whatis-azure-ad-connect-v2.md)
- [Azure AD Cloud Sync](../cloud-sync/what-is-cloud-sync.md)
- [Azure AD Connect version history](reference-connect-version-history.md)
