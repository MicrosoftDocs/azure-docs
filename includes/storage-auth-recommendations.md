---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: azure-storage
ms.topic: "include"
ms.date: 05/03/2024
ms.author: pauljewell
ms.custom: "include file"
---

> [!IMPORTANT]
> For optimal security, Microsoft recommends using Microsoft Entra ID with managed identities to authorize requests against blob, queue, and table data, whenever possible. Authorization with Microsoft Entra ID and managed identities provides superior security and ease of use over Shared Key authorization. To learn more about managed identities, see [What are managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview). For an example of how to enable and use a managed identity for a .NET application, see [Authenticating Azure-hosted apps to Azure resources with .NET](/dotnet/azure/sdk/authentication/azure-hosted-apps).
>
> For resources hosted outside of Azure, such as on-premises applications, you can use managed identities through Azure Arc. For example, apps running on Azure Arc-enabled servers can use managed identities to connect to Azure services. To learn more, see [Authenticate against Azure resources with Azure Arc-enabled servers](/azure/azure-arc/servers/managed-identity-authentication).
>
> For scenarios where shared access signatures (SAS) are used, Microsoft recommends using a user delegation SAS. A user delegation SAS is secured with Microsoft Entra credentials instead of the account key. To learn about shared access signatures, see [Grant limited access to data with shared access signatures](../articles/storage/common/storage-sas-overview.md). For an example of how to create and use a user delegation SAS with .NET, see [Create a user delegation SAS for a blob with .NET](/azure/storage/blobs/storage-blob-user-delegation-sas-create-dotnet).
