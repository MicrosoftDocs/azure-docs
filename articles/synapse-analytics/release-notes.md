---
title: Release notes
description: Release notes for Azure Synapse Analytics (workspaces) 
services: synapse-analytics
author: julieMSFT
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 04/15/2020
ms.author: jrasnick
ms.reviewer: jrasnick
---

# Azure Synapse Analytics (preview) release notes

This article describes limitations and issues with Azure Synapse Analytics (workspaces). For related information, see [What is Azure Synapse Analytics (workspaces)](overview-what-is.md)

[!INCLUDE [preview](includes/note-preview.md)]

## Azure Synapse (workspaces) 

### Azure Synapse CLI

- Issue and customer impact: Workspaces created by SDK can't launch Synapse Studio

- Workaround: Complete the following steps: 
  1.    Create workspace by running `az synapse workspace create`.
  2.    Extract managed identity id by running `$identity=$(az synapse workspace show --name {workspace name}  --resource-group {resource group name} --query "identity.principalId")`.
  3.    Add workspace as role to storage account by running ` az role assignment create --role "Storage Blob Data Contributor" --assignee-object-id {identity } --scope {storage account resource id}`.
  4.    Add firewall rule by running ` az synapse firewall-rule create --name allowAll --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255 `.

## Next steps

* [Create a workspace](quickstart-create-workspace.md)
* [Use Synapse Studio](quickstart-synapse-studio.md)
* [Create a SQL pool](quickstart-create-sql-pool-portal.md)
* [Use SQL on-demand](quickstart-sql-on-demand.md)
* [Create an Apache Spark pool](quickstart-create-apache-spark-pool-portal.md)