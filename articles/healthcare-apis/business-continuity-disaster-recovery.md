---
title: Business continuity and disaster recovery (BCDR) in Azure Health Data Services
description: Learn about protecting your health data and applications from disruptions or disasters using BCDR capabilities in Azure Health Data Services.
ms.topic: conceptual
author: msjasteppe
ms.author: ounyman
ms.service: healthcare-apis
ms.subservice: fhir
ms.custom: subject-policy-compliancecontrols
ms.date: 09/07/2023
---
# Business continuity and disaster recovery considerations

Business continuity and disaster recovery (BCDR) in Azure Health Data Services helps ensure the resilience, reliability, and recoverability of your health data and applications if there is a disruption. It also helps minimize the impact of disruptions on business operations, data integrity, and customer satisfaction. 

> [!NOTE]
> Capabilities covered in this article are subject to the [SLA for Azure Health Data Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1).

## Overview of BCDR in Azure Health Data Services

Azure Health Data Services is available in multiple regions. When you create an Azure Health Data Services resource, you specify its region. From then on, your resource and all its operations stay associated with that Azure region. Cross-region disaster recovery isn't currently supported in Azure Health Data Services.

In most cases, Azure Health Data Services handles disruptive events that may occur in the cloud environment and is able to keep your applications and business processes running. However, Azure Health Data Services can't handle these situations:

- You accidentally delete or update your service or data, and you don't have a backup.
- A natural disaster, such as an earthquake, causes a power outage or disables the region or data center where your service and data are located.
- Any other catastrophic event that requires cross-region failover.

## Database backups for the FHIR service

Database backups are an essential part of any business continuity strategy because they help protect your data from corruption or deletion. These backups enable you to restore service to a previous state. Azure Health Data Services automatically keeps backups of your data for the FHIR service for the last seven days.

The support team handles the backups and restores of the FHIR database. To restore the data, customers need to submit a support ticket with these details:

- Name of the service
- Restore point date and time within the last seven days. If the date and time is unavailable, ask us to restore from the earliest available point.

More information: [Create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md)

For a large or active database, the restore might take several hours to several days. The restoration process involves taking a snapshot of your database at a certain time and then creating a new database to point your FHIR service to. During the restoration process, the server may return an HTTP Status code response with 503, meaning the service is temporarily unavailable and can't handle the request at the moment. After the restoration process completes, the support team updates the ticket with a status that the operation has been completed to restore the requested service.

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
