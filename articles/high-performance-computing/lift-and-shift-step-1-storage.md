---
title: "Deployment step 1: basic infrastructure - storage component"
description: Learn about the configuration of basic storage during migration deployment step one.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: azure-virtual-machines
ms.subservice: hpc
---

# Deployment step 1: basic infrastructure - storage component

In any Azure subscription, setting up basic storage is essential for managing data, applications, and resources effectively. While more advanced and HPC-specific storage configurations are addressed separately, a solid foundation of basic storage is crucial for general resource management and initial deployment needs.

## Define basic storage needs

* **General-purpose storage:**
   - Create storage accounts to handle non-HPC-specific data such as logs, diagnostic data, and backups.

* **Security and access control:**
   - Implement access controls using Azure Active Directory (AD) and role-based access control (RBAC) to manage permissions for different users and services.
   - Enable encryption for data at rest to ensure compliance with organizational security policies.

> [!NOTE]
> For information about HPC specific storage needs, visit the [Storage Overview](lift-and-shift-step-3-overview.md) page.

### This component should

* **Establish foundational storage resources:**
  - Set up basic storage accounts that can be used for general-purpose data storage, such as logs, backups, and configuration files.

* **Ensure accessibility and security:**
  - Configure access policies and encryption to ensure that the storage resources are secure and accessible to authorized users and services only.

## Tools and services

* **Azure storage accounts:**
  - Use Azure Storage Accounts to create scalable, secure, and durable storage for general-purpose data.
  - Configure storage account types based on the type of data being stored (for example, Standard, Premium, Blob, File).

* **Access control and security:**
  - Implement RBAC to manage who has access to storage accounts and what they can do with the data.
  - Enable Azure Storage encryption by default to protect data at rest.

## Best practices for basic storage in Azure Landing Zone

* **Consistency in naming conventions:**
   - Establish and adhere to consistent naming conventions for storage accounts to simplify management and ensure clarity.

* **Resource tagging:**
   - Use tags to organize storage accounts by department, project, or purpose to aid in cost management and reporting.

* **Data redundancy and availability:**
   - Choose the appropriate redundancy option (for example, LRS, GRS) based on the criticality of the data to ensure high availability and durability.

* **Cost management:**
   - Monitor and analyze storage costs regularly using Microsoft Cost Management tools to optimize and control expenses.

## Example steps for basic storage setup

1. **Create a storage account:**

   - Navigate to the Azure portal.
   - Select "Storage accounts" and select "Create."
   - Provide a name for the storage account, select a subscription, resource group, and region.
   - Choose the performance tier (Standard or Premium) and redundancy option (LRS, GRS, etc.).
   - Select "Review + create" and then "Create."

2. **Configure access control:**

   - Once the storage account is created, navigate to the "Access control (IAM)" section.
   - Assign roles to users or groups to manage permissions (for example, Storage Blob Data Contributor, Storage Account Contributor).

3. **Enable data encryption:**

   - By default, Azure Storage accounts have encryption enabled. Verify this setting under "Settings" -> "Encryption" to ensure that data at rest is encrypted.

## Resources

- Azure Storage Accounts Documentation: [product website](/azure/storage/common/storage-account-overview)
- Azure Storage Security Guide: [product website](/azure/storage/common/storage-security-guide)
- Microsoft Cost Management: [product website](/azure/cost-management-billing/costs/)
