---
title: Migrate security and identity services from Amazon Web Services
description: Learn about the basics of the available security and identity services in the Microsoft Cloud. Discover key similarities and differences between the AWS and Microsoft.
ms.author: joflore
author: MicrosoftGuyJFlo

ms.date: 05/01/2025

ms.service: 
ms.subservice: 
ms.topic: conceptual
---
# Migrate security and identity services from Amazon Web Services (AWS)

This article describes scenarios that you can use to migrate Amazon Web Services (AWS) security and identity services to Microsoft Azure and Microsoft Entra. These cloud services provide foundational elements necessary for services built on top of them. The migration process involves transitioning services while focusing on maintaining or enhancing functionality.

These scenarios cover common tasks like creating and maintaining users, enforcing multifactor authentication, managing device access, managing applications and secrets, and configuring other security tools.

## Component comparison

To begin the process, compare AWS security and identity services used in the workload to their closest Azure counterparts. This evaluation helps identify the most suitable Azure services for your migration needs. For more information, see [Compare AWS and Azure security and identity management solutions](/azure/architecture/aws-professional/security-identity).

> [!NOTE]
> This comparison isn't an exact representation of the functionality that these services provide in your workload.

## Migration scenarios

Use the following migration guides as examples to help structure your migration strategy.

| Scenario | Key services | Description |
|--|--|--|
| [Microsoft Entra identity management and access management for AWS](/azure/architecture/reference-architectures/aws/aws-azure-ad-security) |  AWS IAM -> Microsoft Entra ID | Learn how Microsoft Entra ID can help secure and protect Amazon Web Services (AWS) identity management and account access. Discover Microsoft security solutions. |
| [Microsoft Entra SSO integration with AWS IAM Identity Center](/entra/identity/saas-apps/aws-single-sign-on-tutorial) |  AWS IAM -> Microsoft Entra ID | Learn how to configure single sign-on between Microsoft Entra ID and AWS IAM Identity Center (successor to AWS Single Sign-On). |


## Related workload components

Security and identity services make up only part of your cloud workload. Explore other components you might migrate:

- [Compute](migrate-compute-from-aws.md)
- [Databases](migrate-databases-from-aws.md)
- [Storage](migrate-storage-from-aws.md)
- [Networking](migrate-networking-from-aws.md)
 
Use the table of contents to explore other articles related to your workload's architecture.