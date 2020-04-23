---
title: Data locations for Windows Virtual Desktop - Azure
description: A brief overview of which locations Windows Virtual Desktop's data and metadata are stored in.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 04/30/2020
ms.author: helohr
manager: lizross
---
# Data locations for Windows Virtual Desktop

>[!IMPORTANT]
>This content applies to the Spring 2020 update with Azure Resource Manager Windows Virtual Desktop objects. If you're using the Windows Virtual Desktop Fall 2019 release without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/data-locations-2019.md).
>
> The Windows Virtual Desktop Spring 2020 update is currently in public preview. This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Windows Virtual Desktop is currently available for all geographical locations. Administrators can choose the location to store user data when they create the host pool virtual machines and associated services, such as file servers. Learn more about Azure geographies at the [Azure datacenter map](https://azuredatacentermap.azurewebsites.net/).

>[!NOTE]
>Microsoft doesn't control or limit the regions where you or your users can access your user and app-specific data.

>[!IMPORTANT]
>Windows Virtual Desktop stores global metadata information like tenant names, host pool names, app group names, and user principal names in a datacenter. Whenever a customer creates a service object, they must enter a location for the service object. The location they enter determines where the metadata for the object will be stored. The customer will choose an Azure region and the metadata will be stored in the related geography. For a list of all Azure regions and related geographies, see [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/).

At the moment, we only support storing metadata in the United States (US) Azure geography. The stored metadata is encrypted at rest, and geo-redundant mirrors are maintained within the geography. All customer data, such as app settings and user data, resides in the location the customer chooses and isn't managed by the service. More geographies will become available as the service grows.

Service metadata is replicated within the Azure geography for disaster recovery purposes.