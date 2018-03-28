---
title: How to configure a user-assigned MSI for an Azure VM using an Azure SDK
description: Step by step instructions for configuring a user-assigned Managed Service Identity (MSI) for an Azure VM, using an Azure SDK.
services: active-directory
documentationcenter: ''
author: daveba
manager: mtillman
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/22/2017
ms.author: daveba
ROBOTS: NOINDEX,NOFOLLOW
---

# Configure a user-assigned Managed Service Identity (MSI) for a VM, using an Azure SDK

[!INCLUDE[preview-notice](~/includes/active-directory-msi-preview-notice-ua.md)]

Managed Service Identity provides Azure services with a managed identity in Azure Active Directory. You can use this identity to authenticate to services that support Azure AD authentication, without needing credentials in your code. 

In this article, you learn how to enable and remove a user-assigned MSI for an Azure VM, using an Azure SDK.

## Prerequisites

[!INCLUDE [msi-core-prereqs](~/includes/active-directory-msi-core-prereqs-ua.md)]

## Azure SDKs with MSI support 

Azure supports multiple programming platforms through a series of [Azure SDKs](https://azure.microsoft.com/downloads). Several of them have been updated to support MSI, and provide corresponding samples to demonstrate usage. This list is updated as additional support is added:

| SDK | Sample |
| --- | ------ | 
| Python | [Create a VM with MSI enabled](https://azure.microsoft.com/resources/samples/compute-python-msi-vm/) |
| Ruby   | [Create Azure VM with an MSI](https://azure.microsoft.com/resources/samples/compute-ruby-msi-vm/) |

## Next steps

- See related articles under "Configure MSI for an Azure VM", to learn how you can configure a user-assigned MSI on an Azure VM.

Use the following comments section to provide feedback and help us refine and shape our content.
