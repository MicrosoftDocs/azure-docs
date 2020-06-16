---
title: Managed HSM customer data features - Azure Key Vault | Microsoft Docs
description: Learn about customer data in Managed HSM
services: key-vault
author: amitbapat
manager: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.topic: reference
ms.date: 09/01/2020
ms.author: ambapat

---
# Managed HSM customer data features​

Managed HSM receives customer data during creation or update of HSM pools and keys. This customer data is directly visible in the Azure portal and through the REST API. Customer data can be edited or deleted by updating or deleting the object that contains the data.

System access logs are generated when a user or application accesses an HSM pool. Detailed access logs are available to customers using Azure Insights.

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-intro-sentence.md)]

## Identifying customer data

The following information identifies customer data within Managed HSM:

- Role-based access control assignments for Managed HSM contain object-IDs representing users, groups, or applications.
- Arbitrary tags can be applied to keys in Managed HSM. These objects include Managed HSM pool and keys. The tags used may contain personal data.
- Managed HSM access logs contain object-IDs, [UPNs](../active-directory/hybrid/plan-connect-userprincipalname.md), and IP addresses for each REST API call
- Managed HSM diagnostic logs may contain object-IDs and IP addresses for REST API calls

## Deleting customer data

The same REST APIs, Portal experience, and SDKs used to create Managed HSM pools and keys are also able to update and delete these objects.

Soft-delete allows you to recover deleted data for up to 90 days after deletion (retention period can be configured  between 7 and 90 days). When using soft-delete, the data may be permanently deleted prior to the retention period expires by performing a purge operation. If the HSM pool or subscription has been configured to block purge operations, it is not possible to permanently delete data until the scheduled retention period has passed.

## Exporting customer data

The same REST APIs, portal experience, and SDKs that are used to create HSM pools and keys also allow you to view and export these objects.

Managed HSM access logging is an optional feature that can be turned on to generate logs for each REST API call. These logs will be transferred to a storage account in your subscription where you apply the retention policy that meets your organization's requirements.

Managed HSM diagnostic logs that contain personal data can be retrieved by making an export request in the User Privacy portal. This request must be made by the tenant administrator.

## Next steps

- [Managed HSM Logging](logging.md)

- [Managed HSM soft-delete overview](soft-delete-cli.md)

- [Managed HSM key operations](https://docs.microsoft.com/rest/api/keyvault/key-operations)
