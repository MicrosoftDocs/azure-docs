---
title: Include file
description: Include file
author: Blackmist
ms.reviewer: larryfr
ms.author: larryfr
ms.service: azure-ai-studio
ms.topic: include
ms.date: 5/21/2024
ms.custom: include, build-2024
---

|Dependent Azure resource|Resource provider|Optional|Note|
|---|---|:---:|---|
| Azure AI Search|`Microsoft.Search/searchServices`|✔|Provides search capabilities for your projects.|
|Azure Storage account|`Microsoft.Storage/storageAccounts`||Stores artifacts for your projects like flows and evaluations. For data isolation, storage containers are prefixed using the project GUID, and conditionally secured using Azure ABAC for the project identity.|
|Azure Key Vault|`Microsoft.KeyVault/vaults`||Stores secrets like connection strings for your resource connections. For data isolation, secrets can't be retrieved across projects via APIs.|
|Azure Container Registry|`Microsoft.ContainerRegistry/registries`|✔|Stores docker images created when using custom runtime for prompt flow. For data isolation, docker images are prefixed using the project GUID.|
|Azure Application Insights &<br>Log Analytics Workspace| `Microsoft.Insights/components`<br>`Microsoft.OperationalInsights/workspaces` |✔|Used as log storage when you opt in for application-level logging for your deployed prompt flows.|
