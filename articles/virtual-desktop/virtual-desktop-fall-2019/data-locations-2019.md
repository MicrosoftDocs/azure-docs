---
title: Data locations for Azure Virtual Desktop (classic) - Azure
description: A brief overview of which locations Azure Virtual Desktop (classic) data and metadata are stored in.
author: Heidilohr
ms.topic: conceptual
ms.date: 03/30/2020
ms.author: helohr
manager: femila
---
# Data locations for Azure Virtual Desktop (classic)

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects. If you're trying to manage Azure Resource Manager Azure Virtual Desktop objects, see [this article](../data-locations.md).

Azure Virtual Desktop is currently available for all geographical locations. Initially, service metadata can only be stored in the United States (US) geography. Administrators can choose the location to store user data when they create the host pool virtual machines and associated services, such as file servers. Learn more about Azure geographies at the [Azure datacenter map](https://azuredatacentermap.azurewebsites.net/).

>[!NOTE]
>Microsoft doesn't control or limit the regions where you or your users can access your user and app-specific data.

>[!IMPORTANT]
>Azure Virtual Desktop stores global metadata information like tenant names, host pool names, application group names, and user principal names in a datacenter located in the United States. The stored metadata is encrypted at rest, and geo-redundant mirrors are maintained within the United States. All customer data, such as app settings and user data, resides in the location the customer chooses and isn't managed by the service.

Service metadata is replicated in the United States for disaster recovery purposes.