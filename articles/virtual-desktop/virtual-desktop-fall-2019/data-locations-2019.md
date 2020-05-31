---
title: Data locations for Windows Virtual Desktop - Azure
description: A brief overview of which locations Windows Virtual Desktop's data and metadata are stored in.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 03/30/2020
ms.author: helohr
manager: lizross
---
# Data locations for Windows Virtual Desktop

>[!IMPORTANT]
>This content applies to the Fall 2019 release that doesn't support Azure Resource Manager Windows Virtual Desktop objects. If you're trying to manage Azure Resource Manager Windows Virtual Desktop objects introduced in the Spring 2020 update, see [this article](../data-locations.md).

Windows Virtual Desktop is currently available for all geographical locations. Initially, service metadata can only be stored in the United States (US) geography. Administrators can choose the location to store user data when they create the host pool virtual machines and associated services, such as file servers. Learn more about Azure geographies at the [Azure datacenter map](https://azuredatacentermap.azurewebsites.net/).

>[!NOTE]
>Microsoft doesn't control or limit the regions where you or your users can access your user and app-specific data.

>[!IMPORTANT]
>Windows Virtual Desktop stores global metadata information like tenant names, host pool names, app group names, and user principal names in a datacenter located in the United States. The stored metadata is encrypted at rest, and geo-redundant mirrors are maintained within the United States. All customer data, such as app settings and user data, resides in the location the customer chooses and isn't managed by the service.

Service metadata is replicated in the United States for disaster recovery purposes.