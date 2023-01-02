---
title: "Troubleshoot: Workspaces created by SDK can't launch Synapse Studio"
description: Steps to resolve workspaces created by SDK unable to launch Synapse Studio
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.topic: troubleshooting
ms.service: synapse-analytics
ms.subservice: troubleshooting
ms.date: 11/24/2020
---

# Troubleshoot Azure Synapse Analytics workspaces created using SDK

This article provides troubleshooting steps for launching Synapse Studio from a Synapse workspace that was created with a software development kit (SDK).


## Prerequisites

- Synapse workspace created using SDK

## Workaround

To launch Synapse Studio from your SDK created workspace, complete the following steps: 
  1.    Create workspace by running `az synapse workspace create`.
  2.    Extract managed identity ID by running `$identity=$(az synapse workspace show --name {workspace name}  --resource-group {resource group name} --query "identity.principalId")`.
  3.    Grant Storage Blob Data Contributor role to the managed identity storage account by running ` az role assignment create --role "Storage Blob Data Contributor" --assignee-object-id {identity } --scope {storage account resource id}.`
  4.    Add firewall rule by running ` az synapse firewall-rule create --name allowAll --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255 `.

## Next steps

* [What is Azure Synapse](../overview-what-is.md)
* [Get Started](../get-started.md)
