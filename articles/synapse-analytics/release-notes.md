---
title: 'Release notes: Azure Synapse Analytics (workspaces preview)'
description: Release notes for Azure Synapse Analytics (workspaces preview) 
services: synapse-analytics
author: julieMSFT
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 04/15/2020
ms.author: jrasnick
ms.reviewer: jrasnick
---

# Azure Synapse Analytics (workspaces preview) release notes

This article describes limitations and issues with Azure Synapse Analytics (workspaces). For related information, see [What is Azure Synapse Analytics (workspaces)](overview-what-is.md)

[!INCLUDE [preview](includes/note-preview.md)]

## Azure CLI

- Issue and customer impact: Workspaces created by SDK can't launch Synapse Studio

- Workaround: Complete the following steps: 
  1.    Create workspace by running `az synapse workspace create`.
  2.    Extract managed identity ID by running `$identity=$(az synapse workspace show --name {workspace name}  --resource-group {resource group name} --query "identity.principalId")`.
  3.    Add workspace as role to storage account by running ` az role assignment create --role "Storage Blob Data Contributor" --assignee-object-id {identity } --scope {storage account resource id}`.
  4.    Add firewall rule by running ` az synapse firewall-rule create --name allowAll --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255 `.

## Next steps

* [What is Azure Synapse](overview-what-is.md)
* [Get Started](get-started.md)
* [FAQ](overview-faq.md)
