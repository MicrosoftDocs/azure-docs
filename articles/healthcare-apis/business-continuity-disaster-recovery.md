---
title: Business continuity and disaster recovery (BCDR) in Azure Health Data Services
description: Learn about protecting your health data and applications from disruptions or disasters using BCDR capabilities in Azure Health Data Services.
ms.topic: conceptual
author: msjasteppe
ms.author: jasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.custom: subject-policy-compliancecontrols
ms.date: 09/06/2023
---
# Business Continuity and Disaster Recovery (BCDR) considerations for Azure Health Data Services

BCDR in Azure Health Data Services helps ensure the resilience, reliability, and recoverability of your health data and applications in case of disruption. It also helps minimize the impact of disruptions on business operations, data integrity, and customer satisfaction. 

> [!NOTE]
> Capabilities covered in this article are subject to the [SLA for Azure Health Data Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1).

## Overview of BCDR in Azure Health Data Services

When you create an Azure Health Data Services resource, you choose a region where your data will be stored and processed. This region is fixed and cannot be changed later. You cannot transfer your data or service to another region in case of a disaster. 

Azure Health Data Services handles most of the disruptions that may occur in the cloud, such as network failures or hardware issues. However, there are some situations that Azure Health Data Services cannot handle, such as:

* You accidentally delete or update your service or data, and you don't have a backup.
* A natural disaster, such as an earthquake, causes a power outage or disables the data center where your service and data are located.
* Any other catastrophic event that requires cross-region failover.

## Database backups for the FHIR service

Database backups are an essential part of any business continuity strategy because they help protect your data from corruption or deletion. These backups enable you to restore service to a previous state. Azure Health Data Services automatically keeps backups of your data for the FHIR service for the last seven days.

The support team handles the backups and restores of the FHIR database. To restore the data, customers need to submit a support ticket.

For a large or active database, the restore might take several hours to several days. The restoration process involves taking a snapshot of your database at a certain time and then creating a new database to point your FHIR service to. During the restoration process, the server may return an HTTP Status code response with 503, meaning the service is temporarily unavailable and cannot handle the request at the moment. After the restoration process completes, the support team updates the ticket with a status that the operation has been completed to restore the requested service.

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
