---
title: Customer personal data requests in Azure Digital Twins
titleSuffix: Azure Digital Twins
description: Learn about identifying, exporting, and deleting personal data from Azure Digital Twins.
author: baanders
ms.author: baanders
ms.date: 6/20/2023
ms.topic: conceptual
ms.service: digital-twins
services: digital-twins
ms.custom: contperf-fy23q1
---

# Customer personal data requests in Azure Digital Twins

To help keep you in control of personal data, this article describes how to identify, export, and delete personal customer data from Azure Digital Twins.

Azure Digital Twins is a developer platform for creating secure digital representations of business environments. It can be used to store information about people and places, and works with [Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md) to identify users and administrators with access to the environment. To view, export, and delete personal data that may be referenced in a data subject request, an Azure Digital Twins administrator can use the [Azure portal](https://portal.azure.com/) for users and roles, or the [Azure Digital Twins REST APIs](/rest/api/azure-digitaltwins/) for digital twins. The Azure portal and REST APIs provide different methods for users to service such data subject requests.

[!INCLUDE [gdpr-intro-sentence](../../includes/gdpr-intro-sentence.md)]

## Identify personal data

Azure Digital Twins considers *personal data* to be data associated with its administrators and users. 

Azure Digital Twins stores the [Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md) **object ID** of users with access to the environment. Azure Digital Twins in the Azure portal displays user email addresses, but these email addresses aren't stored within Azure Digital Twins. They're dynamically looked up in Microsoft Entra ID, using the Microsoft Entra object ID.

The digital representations called *digital twins* in Azure Digital Twins represent entities in real-world environments, and are associated with identifiers. Microsoft maintains no information and has no access to data that would allow identifiers to be correlated to users. Many of the digital twins in Azure Digital Twins don't directly represent personal entities—typical objects represented might be an office meeting room, or a factory floor. However, users may consider some entities to be personally identifiable, and at their discretion may maintain their own asset or inventory tracking methods that tie digital twins to individuals. Azure Digital Twins manages and stores all data associated with digital twins as if it were personal data.

### Regional replication

By default, the customer data stored in Azure Digital Twins is replicated to the corresponding [geo-paired region](../availability-zones/cross-region-replication-azure.md) for disaster recovery capabilities. For regions with built-in data residency requirements, customer data is always kept within the same region.

For more information about regional replication and disaster recovery in Azure Digital Twins, see [Cross region DR](concepts-high-availability-disaster-recovery.md).

## Export personal data

Azure Digital Twins stores data related to digital twins. Users can retrieve and view this data through the [Azure Digital Twins REST APIs](/rest/api/azure-digitaltwins/), and export this data using copy and paste. 

Customer account data, including user roles and role assignments, can be selected, copied, and pasted from the [Azure portal](https://portal.azure.com).

## Delete personal data

Azure Digital Twins administrators can use the [Azure portal](https://portal.azure.com) to delete data related to Azure user accounts. It's also possible to perform delete operations on individual digital twins, using the Azure Digital Twins REST APIs. For more information about the APIs and how to use them, see [Azure Digital Twins REST APIs documentation](/rest/api/azure-digitaltwins/). 

## Links to more documentation

For a full list of the Azure Digital Twins service APIs, see the [Azure Digital Twins REST APIs documentation](/rest/api/azure-digitaltwins/).
