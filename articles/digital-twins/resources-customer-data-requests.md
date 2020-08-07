---
title: Customer data request features​ for Azure Digital Twins
titleSuffix: Azure Digital Twins
description: This article shows processes for exporting and deleting personal data in Azure Digital Twins.
author: baanders
ms.author: baanders
ms.date: 05/05/2020
ms.topic: conceptual
ms.service: digital-twins
services: digital-twins
---

# Summary of customer data request features​

Azure Digital Twins is a developer platform for creating secure digital representations of a business environment. Representations are driven by live state data from data sources selected by users.

[!INCLUDE [gdpr-intro-sentence](../../includes/gdpr-intro-sentence.md)]

The digital representations called *digital twins* in Azure Digital Twins represent entities in real-world environments, and are associated with identifiers. Microsoft maintains no information and has no access to data that would allow identifiers to be correlated to users. 

Many of the digital twins in Azure Digital Twins do not directly represent personal entities—typical objects represented might be an office meeting room, or a factory floor. However, users may consider some entities to be personally identifiable, and at their discretion may maintain their own asset or inventory tracking methods that tie digital twins to individuals. Azure Digital Twins manages and stores all data associated with digital twins as if it were personal data.

To view, export, and delete personal data that may be referenced in a data subject request, an Azure Digital Twins administrator can use the [**Azure portal**](https://portal.azure.com/) for users and roles, or the [**Azure Digital Twins REST APIs**](how-to-use-apis-sdks.md) for digital twins. The Azure portal and REST APIs provide different methods for users to service such data subject requests.

## Identifying customer data

Azure Digital Twins considers *personal data* to be data associated with its administrators and users. 

Azure Digital Twins stores the [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) *object ID* of users with access to the environment. Azure Digital Twins in the Azure portal displays user email addresses, but these email addresses are not stored within Azure Digital Twins. They are dynamically looked up in Azure Active Directory, using the Azure Active Directory object ID.

## Deleting customer data

Azure Digital Twins administrators can use the Azure portal to delete data related to users. It is also possible to perform delete operations on individual digital twins using the Azure Digital Twins REST APIs. For more information about the APIs available, see [Azure Digital Twins REST APIs documentation](https://docs.microsoft.com/rest/api/azure-digitaltwins/).

## Exporting customer data

Azure Digital Twins stores data related to digital twins. Users can retrieve and view this data through REST APIs, and export this data using copy and paste. 

Customer data, including user roles and role assignments, can be selected, copied, and pasted from the Azure portal. 

## Links to additional documentation

For a full list of the Azure Digital Twins service APIs, see the [Azure Digital Twins REST APIs documentation](https://docs.microsoft.com/rest/api/azure-digitaltwins/).