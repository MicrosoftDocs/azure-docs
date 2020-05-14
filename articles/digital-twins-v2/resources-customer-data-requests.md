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

To view, export, and delete personal data that may be subject to a data subject request, an Azure Digital Twins administrator can use either the Azure portal or the REST APIs. Using the Azure portal or REST APIs to service data subject requests, provides a method to perform these operations for users.

## Identifying customer data

Azure Digital Twins considers personal data to be data associated with administrators and users of Digital Twins. Azure Digital Twins stores the Azure Active Directory object-ID of users with access to the environment. The Azure portal displays user email addresses, but these email addresses are not stored within Azure Digital Twins, they are dynamically looked up using the Azure Active Directory object-ID in Azure Active Directory.

## Deleting customer data

Azure Digital Twins administrators can use the Azure Portal to delete data related to users. It is also possible to perform delete operations using Digital Twins REST APIs. For more information, see Azure Digital Twins REST APIs documentation.

## Exporting customer data

The ability to export data is provided through the Azure portal and REST APIs. Customer data, including assigned roles, can be selected, copied, and pasted by an administrator.

## Links to additional documentation

Full documentation for Azure Digital Twins Service APIs is located at <relevant links>