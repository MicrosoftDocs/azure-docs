---
title: Migrate security services from Amazon Web Services (AWS)
description: Learn about replatforming security services from AWS to Microsoft Cloud to support the security requirements of the workload. Discover key similarities and differences between AWS and Microsoft.
ms.author: joflore
author: MicrosoftGuyJFlo
ms.date: 05/01/2025
ms.topic: conceptual
ms.collection:
 - migration
 - aws-to-azure
---
# Migrate security services from Amazon Web Services (AWS)

This article describes scenarios that you can use to migrate Amazon Web Services (AWS) security services to Microsoft Azure. These cloud services provide foundational security elements necessary for monitoring other services and applications built in the cloud. The migration process involves transitioning services while focusing on maintaining or enhancing functionality.

These scenarios might cover tasks like migrating your security and information and event management (SIEM) solution to Azure.

## Migration scenarios

Use the following migration guides as examples to help structure your migration strategy.

| Scenario | Key services | Description |
|--|--|--|
| [Migrate your SIEM in AWS to Microsoft Sentinel](/azure/sentinel/migration) |  SIEM data in AWS -> Microsoft Sentinel | Plan the different phases of your SIEM data migration from AWS. |

## Related workload components

Security services make up only part of your cloud workload. Explore other components you might migrate:

- [Compute](migrate-compute-from-aws.md)
- [Databases](migrate-databases-from-aws.md)
- [Storage](migrate-storage-from-aws.md)
- [Networking](migrate-networking-from-aws.md)

Migrating security scenarios require identity to be a central service. Compare [AWS identity services](/azure/architecture/aws-professional/security-identity) used in the workload to their closest Azure counterparts.
