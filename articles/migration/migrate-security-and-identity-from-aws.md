---
title: Migrate identity services from Amazon Web Services (AWS)
description: Learn about replatforming identity services from AWS to Microsoft Cloud to support the security requirements of the workload. Discover key similarities and differences between the AWS and Microsoft.
ms.author: joflore
author: MicrosoftGuyJFlo

ms.date: 05/01/2025

ms.service: 
ms.subservice: 
ms.topic: conceptual
---
# Migrate identity services from Amazon Web Services (AWS)

This article describes scenarios that you can use to migrate Amazon Web Services (AWS) identity services to Microsoft Azure and Microsoft Entra. These cloud services provide foundational elements necessary for services built on top of them. The migration process involves transitioning services while focusing on maintaining or enhancing functionality

These scenarios cover common tasks like creating and maintaining users, enforcing multifactor authentication, managing device access, managing applications and secrets, and configuring other security tools.

## Component comparison

To begin the process, compare AWS identity services used in the workload to their closest Azure counterparts. This evaluation helps identify the most suitable Azure services for your migration needs. For more information, see [Compare AWS and Azure security and identity management solutions](/azure/architecture/aws-professional/security-identity).

> [!NOTE]
> This comparison isn't an exact representation of the functionality that these services provide in your workload.

## Migration scenarios

Use the following migration guides as examples to help structure your migration strategy.

| Scenario | Key services | Description |
|--|--|--|
| [Migrate your SIEM in AWS to Microsoft Sentinel](/azure/sentinel/migration) |  SIEM data in AWS -> Microsoft Sentinel | Discover the reasons for migrating from a legacy SIEM, and learn how to plan out the different phases of your migration. |

## Related workload components

Identity services make up only part of your cloud workload. Explore other components you might migrate:

- [Compute](migrate-compute-from-aws.md)
- [Databases](migrate-databases-from-aws.md)
- [Storage](migrate-storage-from-aws.md)
- [Networking](migrate-networking-from-aws.md)
 
