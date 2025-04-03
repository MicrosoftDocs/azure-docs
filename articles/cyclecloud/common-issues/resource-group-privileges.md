---
title: Common Issues - Resource Group Privilege
description: Azure CycleCloud common issue - Resource Group Privilege
author: adriankjohnson
ms.date: 11/15/2019
ms.author: adjohnso
---
# Common Issues: Azure Resource Group Privileges

## Possible Error Messages

- `Resource group {GROUP} for restricted credential {CRED} does not exist`
- `Error creating resource group {GROUP} for credential`

## Resolution

Azure CycleCloud, by default, creates a new resource group for each cluster. If the service principal associated with the credential does not have permission to create or access the resource group used by the cluster, CycleCloud will not operate. In the case of a "restricted" credential, one that uses a single resource group for all clusters, the resource group must be created and appropriate permissions applied.

## More Information

For more information, see [Configuring Azure Credentials](/azure/cyclecloud/configuration)