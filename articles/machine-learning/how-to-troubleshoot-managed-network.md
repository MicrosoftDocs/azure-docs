---
title: Troubleshooting managed virtual networks
titleSuffix: Azure Machine Learning
description: Learn how to troubleshoot Azure Machine Learning managed virtual network.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.topic: troubleshooting
ms.date: 05/23/2023
ms.custom: build-2023
---

# Troubleshoot Azure Machine Learning managed virtual network

This article provides information on troubleshooting common issues with Azure Machine Learning managed virtual network.

## Can I still use an Azure Virtual Network?

Yes, you can still use an Azure Virtual Network for network isolation. If you're using the v2 __Azure CLI__ and __Python SDK__, the process is the same as before the introduction of the managed virtual network feature. The process through the Azure portal has changed slightly.

To use an Azure Virtual Network when creating a workspace through the Azure portal, use the following steps:

1. When creating a workspace, select the __Networking__ tag.
1. Select __Private with Internet Outbound__.
1. In the __Workspace inbound access__ section, select __Add__ and add a private endpoint for the Azure Virtual Network to use for network isolation.
1. In the __Workspace Outbound access__ section, select __Use my own virtual network__.
1. Continue to create the workspace as normal.

## Does not have authorization to perform action 'Microsoft.MachineLearningServices<br/> /workspaces/privateEndpointConnections/read'

When you create a managed virtual network, the operation can fail with an error similar to the following text:

"The client '\<GUID\>' with object id '\<GUID\>' does not have authorization to perform action 'Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/read' over scope '/subscriptions/\<GUID\>/resourceGroups/\<resource-group-name\>/providers/Microsoft.MachineLearningServices/workspaces/\<workspace-name\>' or the scope is invalid."

This error occurs when the Azure identity used to create the managed virtual network doesn't have the following Azure role-based access control permissions:

* Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/read
* Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/write

## Next steps

For more information, see [Managed virtual networks](how-to-managed-network.md).
