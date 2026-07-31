---
title: Common Issues - Cluster Credentials
description: Troubleshoot cluster credential errors in Azure CycleCloud, such as 'Credentials not found' during node validation.
author: adriankjohnson
ms.date: 06/19/2026
ms.topic: troubleshooting-problem-resolution
ms.author: adjohnso
---
# Common issues: Cluster credentials

## Possible error messages

- `Validating nodes (Credentials not found)`

## Resolution

Check that the credentials you specify for the cluster, node, or node array exist in your CycleCloud instance. To see if a credential exists in CycleCloud, select the gear icon at the bottom of the clusters page. Check the account list for the named credential.

## More information

For more information, see [Configuring Azure Credentials](/azure/cyclecloud/configuration).
