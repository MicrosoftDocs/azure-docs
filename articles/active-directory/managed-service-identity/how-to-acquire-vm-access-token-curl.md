---
title: How to use an Azure VM Managed Service Identity to acquire an access token using Curl
description: Instructions and examples for using an Azure VM MSI to acquire an OAuth access token using Curl.
services: active-directory
documentationcenter: 
author: daveba
manager: mtillman
editor: 

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/01/2017
ms.author: daveba
---

# How to use an Azure VM Managed Service Identity (MSI) to acquire a token using Curl 

This article provides a Curl script example for token acquisition.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

> [!IMPORTANT]
> - All sample code/script in this article assumes the client is running on an MSI-enabled Virtual Machine. Use the VM "Connect" feature in the Azure portal, to remotely connect to your VM. For details on enabling MSI on a VM, see [Configure a VM Managed Service Identity (MSI) using the Azure portal](qs-configure-portal-windows-vm.md), or one of the variant articles (using PowerShell, CLI, a template, or an Azure SDK). 

## Overview

A client application can request an MSI [app-only access token](../develop/active-directory-dev-glossary.md#access-token) for accessing a given resource. The token is [based on the MSI service principal](overview.md#how-does-it-work). As such, there is no need for the client to register itself to obtain an access token under its own service principal. The token is suitable for use as a bearer token in
[service-to-service calls requiring client credentials](../develop/active-directory-protocols-oauth-service-to-service.md).

## Get a token using CURL

```bash
response=$(curl http://localhost:50342/oauth2/token --data "resource=https://management.azure.com/" -H Metadata:true -s)
access_token=$(echo $response | python -c 'import sys, json; print (json.load(sys.stdin)["access_token"])')
echo The MSI access token is $access_token
```
## Related content

- To enable MSI on an Azure VM, see [Configure a VM Managed Service Identity (MSI) using the Azure portal](qs-configure-portal-windows-vm.md).









