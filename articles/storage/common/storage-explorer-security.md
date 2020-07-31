---
title: Azure Storage Explorer security guide | Microsoft Docs
description: Security guidance for Azure Storage Explorer
services: storage
author: cralvord
ms.service: virtual-machines
ms.topic: security
ms.date: 07/30/2020
ms.author: cralvord
---

# Azure Storage Explorer Security Guide

Microsoft Azure Storage Explorer enables you to easily work with Azure Storage data safely and securely on Windows, macOS, and Linux. By following these guidelines, you can ensure your data stays protected.

## General

- Always use the latest version of Storage Explorer.
- Only connect to resources you trust.
- Use HTTPS wherever possible.

## Using Role-based Access Control

[Role-based access control (RBAC)](https://docs.microsoft.com/azure/role-based-access-control/overview) provides fine-grained access management of Azure resources by combining sets of permissions into _roles_. When you sign in to Storage Explorer using your Azure account, you automatically get access to services and resources for which you have the appropriate permissions.

Storage Explorer currently supports RBAC access to blob and queue services and resources.

RBAC roles and permissions can be managed from the Azure Portal.

## Access Control in ADLS Gen2

You can use [access control lists (ACL)](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-access-control) to control file and folder level access in ADLS Gen2 blob containers. Storage Explorer makes it easy to manage ACLs.

< Insert recomendations here >

## Using Shared Access Signatures

Shared access signatures (SAS) provide anonymous access to secure resources for anyone with the proper SAS URI.

Storage Explorer can generate and connect using SAS URIs. When using SAS, we recommend the following guidlelines:

- Only distribute SAS tokens and URIs to trusted individuals.
- Only use SAS tokens and URIs from entities you trust.
- Use shared access policies (SAP) when generating SAS tokens and URIs if possible. Shared access policies are more secure than bare SAS tokens, because they can be revoked at any time.
- Generate tokens that are only valid for as long as necessary. This is especially important for bare SAS tokens, because there is no way to revoke them once generated.

> [!IMPORTANT]
> When sharing SAS tokens and URIs for troubleshooting purposes, such as in service requests or bug reports, always redact at least the signature portion of the SAS.

## Using Storage Account Keys

Storage account keys grant unrestricted access to the services and resources in their respective storage account. For this reason, it is not recommended that you use storage account keys to access resources in Storage Explorer. Instead, use RBAC features to provide access.

Some RBAC roles grant permission to retrieve storage account keys, which effectively circumvents permissions granted by RBAC. We recommend not granting this permission unless it's absolutely necessary.

Storage Explorer will attempt to use storage account keys, if they are available, to authenticate requests. You can disable the use of storage account keys in RBAC-supported feature using the **Services > Storage Accounts > Disable Usage of Keys** setting. Some features do not support RBAC, such as working with Classic storage accounts. Such features still require storage account keys and are not affected by this setting.

If you require the use of storage account keys, we recommend the following guidelines:

- Do not share your account keys with anyone.
- Use caution when attempting to perform operations which can result in data loss, such as deletions.

> [!NOTE]
> If you believe a storage account key has been shared or distributed by mistake, you can generate new keys for your storage account from the Azure Portal.

## Public Access to Blob Containers

Storage Explorer allows you to modify the access level of your Azure Blob Storage containers. Non-private blob containers allow anyone anonymous read access to those containers.

- Do not enable public access to a blob container that may contain any potentially sensitive data.
- Do not upload any potentially sensitive data to a blob container with Blob or Container access.
