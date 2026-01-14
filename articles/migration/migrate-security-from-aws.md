---
title: Migrate security services from Amazon Web Services (AWS)
description: Learn about replatforming security services from AWS to Microsoft Cloud to support the security requirements of the workload. Discover key similarities and differences between AWS and Microsoft.
ms.author: joflore
author: MicrosoftGuyJFlo
ms.date: 07/30/2025
ms.topic: concept-article
ms.service: azure 
ms.collection:
 - migration
 - aws-to-azure
---
# Migrate security services from Amazon Web Services (AWS)

This article describes scenarios that you can use to migrate Amazon Web Services (AWS) security services to Microsoft Azure. These cloud services provide foundational security elements necessary for monitoring other services and applications built in the cloud. The migration process involves transitioning services while focusing on maintaining or enhancing functionality.

These scenarios might cover tasks like migrating your security and information and event management (SIEM) solution to Azure.

## Component comparison

Start the migration process by comparing the AWS security and identity services used in the workload with the closest Azure counterpart. The goal is to identify the most suitable Azure services for your workload. For more information, see [Comparing AWS and Azure identity management solutions](/azure/architecture/aws-professional/security-identity).

> [!NOTE]
> This comparison isn't an exact representation of the functionality that these services provide in your workload.

## Migration scenarios

Use the following migration guides as examples to help structure your migration strategy.

| Scenario | Key services | Description |
|--|--|--|
| [Migrate your SIEM in AWS to Microsoft Sentinel](/azure/sentinel/migration) |  SIEM data in AWS -> Microsoft Sentinel | Plan the different phases of your SIEM data migration from AWS. |
| [Migrate your customer facing tenant to Microsoft Entra External ID](/entra/external-id/customers/migrate-to-external-id) | Customer identities -> Microsoft Entra External ID | Plan the phases of your customer identity migration |

## Related workload components

Security services make up only part of your cloud workload. Explore other components you might migrate:

- [Compute](migrate-compute-from-aws.md)
- [Databases](migrate-databases-from-aws.md)
- [Storage](migrate-storage-from-aws.md)
- [Networking](migrate-networking-from-aws.md)

Migrating security scenarios require identity to be a central service. Compare [AWS identity services](/azure/architecture/aws-professional/security-identity) used in the workload to their closest Azure counterparts.
