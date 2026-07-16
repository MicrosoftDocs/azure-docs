---
title: Common Issues - Resource Group Privilege
description: Troubleshoot Azure resource group privilege errors for restricted credentials in Azure CycleCloud.
author: adriankjohnson
ms.date: 06/19/2026
ms.topic: troubleshooting-problem-resolution
ms.author: adjohnso
---
# Common issues: Azure resource group privileges

## Possible error messages

- `Resource group {GROUP} for restricted credential {CRED} does not exist`
- `Error creating resource group {GROUP} for credential`

## Resolution

By default, Azure CycleCloud creates a new resource group for each cluster. If the service principal associated with the credential doesn't have permission to create or access the resource group used by the cluster, CycleCloud doesn't operate. For a "restricted" credential that uses a single resource group for all clusters, you must create the resource group and apply the appropriate permissions.

## More information

For more information, see [Configuring Azure Credentials](/azure/cyclecloud/configuration).