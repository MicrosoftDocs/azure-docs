---
title: Data locations Windows Virtual Desktop - Azure
description: A brief overview of which locations Windows Virtual Desktop's data and metadata are stored in.
author: Heidilohr
ms.topic: conceptual
ms.custom: references_regions
ms.date: 05/07/2021
ms.author: helohr
manager: femila
---

# Data locations for Windows Virtual Desktop

Windows Virtual Desktop is currently available for all geographical locations. Administrators can choose the location to store user data when they create the host pool virtual machines and associated services, such as file servers. Learn more about Azure geographies at the [Azure datacenter map](https://azuredatacentermap.azurewebsites.net/).

>[!NOTE]
>Microsoft does not control or limit the regions where you or your users can access your user and app-specific data.

>[!IMPORTANT]
>Windows Virtual Desktop stores various types of information like host pool names, app group names, workspace names, and user principal names in a datacenter. While creating any of the service objects, the customer has to enter the location where the object needs to be created. The location of this object determines where the information for the object will be stored. The customer will choose an Azure region and the related information will be stored in the associated geography. For a list of all Azure regions and related geographies, visit [https://azure.microsoft.com/global-infrastructure/geographies/](https://azure.microsoft.com/global-infrastructure/geographies/).

Based on the customer data definitions listed here ([How Microsoft categorizes customer data \| Trust Center](https://www.microsoft.com/en-us/trust-center/privacy/customer-data-definitions)) here is the information being stored by the service.

## Customer input

To set up the service, the customer has to create host poolm and other service objects. As part of that the configuration information like host pool name, application group name, etc. are considered customer input. This information is stored in the geography associated with the region the object is created in. ARM Paths to the objects is considered organizational information and data residency does not apply to them – those will be stored out of the chosen geography.

## Customer data

The service does not directly store any user or app-related information but it does store customer data like application names, user principal names which is part of the object setup. This information is stored in the geography associated with the region the object is created in.

## Diagnostic data

As part of support, the service generated diagnostic data when the customer and end user interacts with the service. This is used only for troubleshooting and support as well as to check the health of the service in aggregate form. For example, from the session host side, when a VM registers to the service, we generate information that includes the VM name, which hostpool it registers to, etc. This information is stored in the geography associated with the region the host pool is created in. Another example is related to clients. When a user connects to the service and launches a remote desktop, we generate diagnostics information that includes user principal name, client location, client IP, host pool the user is connecting to, etc. This information is sent to the location of the control plane the user connects to.

## Service-generated data

To ensure that the service is reliable and scalable, we aggregate traffic pattern and usage to determine health and performance of the infrastructure control plane. For example, to understand how to ramp up regional infrastructure capacity as service usage increases, we process log data of their service usage. We then review the logs for peak times and decide which data centers to add to meet this capacity. This information is aggregated from all locations where the service infrastructure is and sent to US region. This includes scrubbed data and does not have any customer data.

Today we support storing the information outlined above only in the US Azure geography. More geographies will be added as the service grows. The stored information is encrypted at rest, and geo-redundant mirrors are maintained within the geography. Customer data, such as app settings and user data, resides in the location the customer chooses and isn't managed by the service.

The outlined data is replicated within the Azure geography for disaster recovery purposes.
