---
title: Data locations for Azure Virtual Desktop - Azure
description: A brief overview of which locations Azure Virtual Desktop's data and metadata are stored in.
author: Heidilohr
ms.topic: conceptual
ms.custom: references_regions
ms.date: 06/30/2021
ms.author: helohr
manager: femila
---
# Data locations for Azure Virtual Desktop

Azure Virtual Desktop is currently available for all geographical locations. Administrators can choose the location to store user data when they create the host pool virtual machines and associated services, such as file servers. Learn more about Azure geographies at [Data residency in Azure](https://azure.microsoft.com/global-infrastructure/data-residency/#overview).

>[!NOTE]
>Microsoft doesn't control or limit the regions where you or your users can access your user and app-specific data.

>[!IMPORTANT]
>Azure Virtual Desktop stores various types of information like host pool names, app group names, workspace names, and user principal names in a datacenter. While creating any of the service objects, the customer has to enter the location where the object needs to be created. The location of this object determines where the information for the object will be stored. The customer will choose an Azure region and the related information will be stored in the associated geography. Customers also choose a region for the Session host Virtual Machines in an additional step in the deployment process. This region can be any Azure region, hence it can be the same region as the service objects or a separate region. For a list of all Azure regions and related geographies, visit [https://azure.microsoft.com/global-infrastructure/geographies/](https://azure.microsoft.com/global-infrastructure/geographies/).

This article describes which information the Azure Virtual Desktop service stores. To learn more about the customer data definitions, see [How Microsoft categorizes data for online services](https://www.microsoft.com/trust-center/privacy/customer-data-definitions).

## Customer input

To set up the Azure Virtual Desktop service, the customer must create host pools and other service objects. During configuration, the customer must give information like the host pool name, application group name, and so on. This information is considered customer input. Customer input is stored in the geography associated with the region the object is created in. Azure Resource Manager paths to the objects are considered organizational information, so data residency doesn't apply to them. Data about Azure Resource Manager paths will be stored outside of the chosen geography.

## Customer data

The service doesn't directly store any user created or app-related information, but it does store customer data like application names and user principal names because they're part of the object setup process. This information is stored in the geography associated with the region the customer created the object in.

## Diagnostic data

Azure Virtual Desktop gathers service-generated diagnostic data whenever the customer or user interacts with the service. This data is only used for troubleshooting, support, and checking the health of the service in aggregate form. For example, from the session host side, when a VM registers to the service, we generate information that includes the virtual machine (VM) name, which host pool the VM belongs to, and so on. This information is stored in the geography associated with the region the host pool is created in. Also, when a user connects to the service and launches a remote desktop, we generate diagnostic information that includes the user principal name, client location, client IP address, which host pool the user is connecting to, and so on. This information is sent to two different locations:

- The location closest to the user where the service infrastructure (client traces, user traces, diagnostic data) is present.
- The location where the host pool is located.

## Service-generated data

To keep Azure Virtual Desktop reliable and scalable, we aggregate traffic patterns and usage to check the health and performance of the infrastructure control plane. For example, to understand how to ramp up regional infrastructure capacity as service usage increases, we process service usage log data. We then review the logs for peak times and decide which data centers to add to meet this capacity. 

We currently support storing the aforementioned data in the following locations:

- United States (US)
- Europe (EU)
- United Kingdom (UK)
- Canada (CA)

In addition we aggregate service-generated from all locations where the service infrastructure is, then send it to the US geography. The data sent to the US region includes scrubbed data, but not customer data.

More geographies will be added as the service grows. The stored information is encrypted at rest, and geo-redundant mirrors are maintained within the geography. Customer data, such as app settings and user data, resides in the location the customer chooses and isn't managed by the service.

The outlined data is replicated within the Azure geography for disaster recovery purposes.
