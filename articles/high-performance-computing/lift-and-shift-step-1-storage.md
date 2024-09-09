---
title: "Deployment step 1: Basic infrastructure - Storage component"
description: Learn about the configuration of basic storage during migration deployment step one.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: 
services: 
---

# Deployment step 1: Basic infrastructure - Storage component

In any Azure subscription, setting up basic storage is essential for managing data, applications, and resources effectively. While more advanced and HPC-specific storage configurations will be addressed separately, a solid foundation of basic storage is crucial for general resource management and initial deployment needs.

## Define Basic Storage Needs

1. **General-Purpose Storage:**
   - Create storage accounts to handle non-HPC-specific data such as logs, diagnostic data, and backups.

2. **Security and Access Control:**
   - Implement access controls using Azure Active Directory (AD) and role-based access control (RBAC) to manage permissions for different users and services.
   - Enable encryption for data at rest to ensure compliance with organizational security policies.

> **Note:**
>
> For information about HPC specific storage needs, visit the [Storage Overview](lift-and-shift-step-3-overview.md) page.

### This Component Should

- **Establish Foundational Storage Resources:**
  - Set up basic storage accounts that can be used for general-purpose data storage, such as logs, backups, and configuration files.

- **Ensure Accessibility and Security:**
  - Configure access policies and encryption to ensure that the storage resources are secure and accessible to authorized users and services only.

### Tools and Services

**Azure Storage Accounts:**

- Use Azure Storage Accounts to create scalable, secure, and durable storage for general-purpose data.
- Configure storage account types based on the type of data being stored (e.g., Standard, Premium, Blob, File).

**Access Control and Security:**

- Implement RBAC to manage who has access to storage accounts and what they can do with the data.
- Enable Azure Storage encryption by default to protect data at rest.

### Best Practices for Basic Storage in Azure Landing Zone

1. **Consistency in Naming Conventions:**
   - Establish and adhere to consistent naming conventions for storage accounts to simplify management and ensure clarity.

2. **Resource Tagging:**
   - Use tags to organize storage accounts by department, project, or purpose to aid in cost management and reporting.

3. **Data Redundancy and Availability:**
   - Choose the appropriate redundancy option (e.g., LRS, GRS) based on the criticality of the data to ensure high availability and durability.

4. **Cost Management:**
   - Monitor and analyze storage costs regularly using Azure Cost Management tools to optimize and control expenses.

### Example Steps for Basic Storage Setup

1. **Create a Storage Account:**

   - Navigate to the Azure portal.
   - Select "Storage accounts" and click "Create."
   - Provide a name for the storage account, select a subscription, resource group, and region.
   - Choose the performance tier (Standard or Premium) and redundancy option (LRS, GRS, etc.).
   - Click "Review + create" and then "Create."

2. **Configure Access Control:**

   - Once the storage account is created, navigate to the "Access control (IAM)" section.
   - Assign roles to users or groups to manage permissions (e.g., Storage Blob Data Contributor, Storage Account Contributor).

3. **Enable Data Encryption:**

   - By default, Azure Storage accounts have encryption enabled. Verify this setting under "Settings" -> "Encryption" to ensure that data at rest is encrypted.

### Resources

- Azure Storage Accounts Documentation: [product website](/azure/storage/common/storage-account-overview)
- Azure Storage Security Guide: [product website](/azure/storage/common/storage-security-guide)
- Azure Cost Management: [product website](/azure/cost-management-billing/costs/)