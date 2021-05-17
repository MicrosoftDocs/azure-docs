---
title: Data locations for Windows Virtual Desktop - Azure
description: A brief overview of which locations Windows Virtual Desktop's data and metadata are stored in.
author: Heidilohr
ms.topic: conceptual
ms.custom: references_regions
ms.date: 02/17/2021
ms.author: helohr
manager: femila
---
# Data and metadata locations for Windows Virtual Desktop

>[!IMPORTANT]
>This content applies to Windows Virtual Desktop with Azure Resource Manager Windows Virtual Desktop objects. If you're using Windows Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/data-locations-2019.md).

Windows Virtual Desktop is currently available for all geographical locations. Administrators can choose the location to store user data when they create the host pool virtual machines and associated services, such as file servers. Learn more about Azure geographies at the [Azure datacenter map](https://azuredatacentermap.azurewebsites.net/).

>[!NOTE]
>Microsoft doesn't control or limit the regions where you or your users can access your user and app-specific data.

>[!IMPORTANT]
>Windows Virtual Desktop stores global metadata information like workspace names, host pool names, app group names, and user principal names in a datacenter. Whenever a customer creates a service object, they must enter a location for the service object. The location they enter determines where the metadata for the object will be stored. The customer will choose an Azure region and the metadata will be stored in the related geography. For a list of all Azure regions and related geographies, see [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/).

We currently support storing metadata in the following geographies:

- United States (US) (Generally available)
- Europe (EU) (Public preview) 

>[!NOTE]
> When you're selecting a region to create Windows Virtual Desktop service objects in, you'll see regions under both US and EU geographies. To make sure you understand which region would work best for your deployment, take a look at [our Azure global infrastructure map](https://azure.microsoft.com/global-infrastructure/geographies/#geographies).

The stored metadata is encrypted at rest, and geo-redundant mirrors are maintained within the geography. All customer data, such as app settings and user data, resides in the location the customer chooses and isn't managed by the service. More geographies will become available as the service grows.

Service metadata is replicated within the Azure geography for disaster recovery purposes.
