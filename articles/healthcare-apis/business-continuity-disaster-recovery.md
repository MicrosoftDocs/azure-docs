---
title: Business continuity and disaster recovery in Azure Health Data Services
description: Learn how Azure Health Data Services supports business continuity and disaster recovery to protect health data during disruptions. Start planning your BCDR approach.
ms.topic: concept-article
author: KendalBond007
ms.author: ounyman
ms.service: azure-health-data-services
ms.subservice: fhir
ms.custom: subject-policy-compliancecontrols
ms.date: 05/01/2026
---
# Business continuity and disaster recovery in Azure Health Data Services

Business continuity and disaster recovery (BCDR) in Azure Health Data Services helps ensure the resilience, reliability, and recoverability of health data and applications if there's a disruption. It also helps minimize the impact of disruptions on business operations, data integrity, and customer satisfaction. 

> [!NOTE]
> Capabilities covered in this article are subject to the [Service Level Agreement for Azure Health Data Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1).

## Overview of BCDR in Azure Health Data Services

Azure Health Data Services is available in multiple regions. When you create an Azure Health Data Services resource, you specify its region. From then on, your resource and all its operations stay associated with that Azure region. Azure Health Data Services doesn't currently support cross-region disaster recovery.

In most cases, Azure Health Data Services handles disruptive events that might occur in the cloud environment and keeps your applications and business processes running. However, Azure Health Data Services can't handle situations like:

- You deleted your service.
- A natural disaster such as an earthquake or power outage disables the region or data center where your service and data are located.
- Any other catastrophic event that requires cross-region failover.

## Database backups for the FHIR service

Database backups are an essential part of any business continuity strategy because they help protect your data from corruption or deletion. These backups enable you to restore service to a previous state. Azure Health Data Services automatically keeps backups of your data for the FHIR&reg; service for the last seven days.

The support team handles the backups and restores of the FHIR database. To restore the data, submit a support ticket with these details:

- Name of the service.
- Restore point date and time within the last seven days. If the requested restore point isn't available, the nearest one is used, unless you specify otherwise. Include this information in your support request.

Learn more: [Create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request)

For a large or active database, the restore might take several hours to several days. The restoration process involves taking a snapshot of your database at a certain time and then creating a new database to point your FHIR service to. During the restoration process, the server might return an HTTP Status code response with 503, meaning the service is temporarily unavailable and can't handle the request at the moment. After the restoration process completes, the support team updates the ticket with a status that the operation is completed to restore the requested service.

## Cross-region DR

Azure Health Data Services doesn't currently offer cross-region DR (disaster recovery) built into the service. However, you can use native capabilities, such as `$export` and `$import`, to achieve cross-region disaster recovery. An open-source software (OSS) sample is provided for you [here](https://github.com/Azure/apiforfhir-migration-tool/blob/main/FHIR-data-migration-tool-docs/disaster-recovery.md). The samples are open-source code and subject to GitHub's licensing terms. Review the information and licensing terms before using it. They're not part of the Azure Health Data Service and not supported by Microsoft Support. These samples demonstrate how Azure Health Data Services and other open-source tools can be used together for cross-region replication.

[!INCLUDE [FHIR and DICOM trademark statement](./includes/healthcare-apis-fhir-dicom-trademark.md)]
