---
title: Migrate Azure Arc enabled server to Azure
description: Learn how to migrate your Azure Arc enabled servers running on-premises or other cloud environment to Azure.
ms.date: 04/26/201
ms.topic: conceptual
---

# Migrate your on-premises or other cloud Arc enabled server to Azure

This article is intended to help you plan and successfully migrate your on-premises server or virtual machine managed by Azure Arc enabled servers to Azure. By following these steps, you are able to transition management from Arc enabled servers based on the supported VM extensions installed and Azure services based on it's Arc server resource identity.

Before performing these steps, review the Azure Migrate [Prepare on-premises machines for migration to Azure](../../migrate/prepare-for-migration.md) article to learn about the other requirements necessary to use Azure Migrate. To complete the migration to Azure, review the Azure Migrate [migration options](../../migrate/prepare-for-migration.md#next-steps) based on your environment.

In this article you:

* Inventory Azure Arc enabled servers supported VM extensions installed
* Uninstall all VM extensions from the Arc enabled server
* Identify what is using the Arc enabled server resource identity and prepare to update those applications and/or services to use the new Azure VM identity after migration.
* Document the Azure role-based access control (Azure RBAC) access rights granted to the Arc enabled server resource to maintain who has access to the resource after it has been migrated to an Azure VM.
* Delete the Arc enabled server resource identity from Azure and remove the Arc enabled server agent.
* Install the Azure guest agent
* Migrate the server or VM to Azure

## 




These steps include:

Uninstalling all extensions on the Arc server (you'll need to reinstall them on the Azure VM to have it show up as an extension again)
Identify what is using the Arc server identity and prepare to update those apps/services to use the new identity that will come with the Azure VM
Note down the RBAC config on the server resource so you can grant the same folks access to the Azure VM post-migration
Run "azcmagent disconnect" on the OS to delete the Arc resource and local state
Remove the Arc server agent from the OS
Install the Azure guest agent
Migrate the VM to Azure
