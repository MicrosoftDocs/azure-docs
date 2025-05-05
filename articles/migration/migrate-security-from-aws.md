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

-- TODO: Need revision --  
This article describes scenarios that you can use to migrate Amazon Web Services (AWS) security services to Microsoft Azure and Microsoft Entra. These cloud services provide foundational elements necessary for services built on top of them. The migration process involves transitioning services while focusing on maintaining or enhancing functionality

-- TODO: Need context for security --  
These scenarios cover common tasks like creating and maintaining users, enforcing multifactor authentication, managing device access, managing applications and secrets, and configuring other security tools.

## Migration scenarios

Use the following migration guides as examples to help structure your migration strategy.

| Scenario | Key services | Description |
|--|--|--|
| [Migrate your SIEM in AWS to Microsoft Sentinel](/azure/sentinel/migration) |  SIEM data in AWS -> Microsoft Sentinel | Discover the reasons for migrating from a legacy SIEM, and learn how to plan out the different phases of your migration. |

## Related workload components

Security services make up only part of your cloud workload. Explore other components you might migrate:

- [Compute](migrate-compute-from-aws.md)
- [Databases](migrate-databases-from-aws.md)
- [Storage](migrate-storage-from-aws.md)
- [Networking](migrate-networking-from-aws.md)

Migrating security scenarios require identity to be a central service. Compare AWS identity services used in the workload to their closest Azure counterparts. 
