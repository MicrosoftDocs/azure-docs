---
title: Configure Transport Layer Security (TLS) for a client application
titleSuffix: Azure Storage
description: Configure a client application to communicate with Azure Storage using a minimum version of Transport Layer Security (TLS).
services: storage
author: akashdubey-ms

ms.service: azure-storage
ms.topic: how-to
ms.date: 12/29/2022
ms.author: akashdubey
ms.reviewer: fryu
ms.subservice: storage-common-concepts
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-azurepowershell, engagement-fy23
---

# Configure Transport Layer Security (TLS) for a client application

For security purposes, an Azure Storage account may require that clients use a minimum version of Transport Layer Security (TLS) to send requests. Calls to Azure Storage will fail if the client is using a version of TLS that is lower than the minimum required version. For example, if a storage account requires TLS 1.2, then a request sent by a client who is using TLS 1.1 will fail.

This article describes how to configure a client application to use a particular version of TLS. For information about how to configure a minimum required version of TLS for an Azure Storage account, see [Configure minimum required version of Transport Layer Security (TLS) for a storage account](transport-layer-security-configure-minimum-version.md).

## Configure the client TLS version

In order for a client to send a request with a particular version of TLS, the operating system must support that version.

The following examples show how to set the client's TLS version to 1.2 from PowerShell or .NET. The .NET Framework used by the client must support TLS 1.2. For more information, see [Support for TLS 1.2](/dotnet/framework/network-programming/tls#support-for-tls-12).

# [PowerShell](#tab/powershell)

The following sample shows how to enable TLS 1.2 in a PowerShell client:

```powershell
# Set the TLS version used by the PowerShell client to TLS 1.2.
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12;

# Create a new container.
$storageAccount = Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName
$ctx = $storageAccount.Context
New-AzStorageContainer -Name "sample-container" -Context $ctx
```

# [.NET](#tab/dotnet)

The following sample shows how to enable TLS 1.2 in a .NET client using version 12 of the Azure Storage client library:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Networking.cs" id="Snippet_ConfigureTls12":::

---

## Verify the TLS version used by a client

To verify that the specified version of TLS was used by the client to send a request, you can use [Fiddler](https://www.telerik.com/fiddler) or a similar tool. Open Fiddler to start capturing client network traffic, then execute one of the examples in the previous section. Look at the Fiddler trace to confirm that the correct version of TLS was used to send the request, as shown in the following image.

:::image type="content" source="media/transport-layer-security-configure-client-version/fiddler-trace-tls-version.png" alt-text="Screenshot showing Fiddler trace that indicates TLS version used on request":::

## Next steps

- [Configure minimum required version of Transport Layer Security (TLS) for a storage account](transport-layer-security-configure-minimum-version.md)
- [Security recommendations for Blob storage](../blobs/security-recommendations.md)
