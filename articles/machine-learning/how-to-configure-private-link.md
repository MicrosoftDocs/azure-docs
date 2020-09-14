---
title: Configure a private endpoint (preview)
titleSuffix: Azure Machine Learning
description: 'Use Azure Private Link to securely access your Azure Machine Learning workspace from a virtual network.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.custom: how-to
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 09/03/2020
---

# Configure Azure Private Link for an Azure Machine Learning workspace (preview)

In this document, you learn how to use Azure Private Link with your Azure Machine Learning workspace. For information on setting up a virtual network for Azure Machine Learning, see [Virtual network isolation and privacy overview](how-to-network-security-overview.md)

> [!IMPORTANT]
> Using Azure Private Link with Azure Machine Learning workspace is currently in public preview. This functionality is only available in the **US East**, **US South Central** and **US West 2** regions. 
> This preview is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Private Link enables you to connect to your workspace using a private endpoint. The private endpoint is a set of private IP addresses within your virtual network. You can then limit access to your workspace to only occur over the private IP addresses. Private Link helps reduce the risk of data exfiltration. To learn more about private endpoints, see the [Azure Private Link](/azure/private-link/private-link-overview) article.

> [!IMPORTANT]
> Azure Private Link does not effect Azure control plane (management operations) such as deleting the workspace or managing compute resources. For example, creating, updating, or deleting a compute target. These operations are performed over the public Internet as normal. Data plane operations, such as using Azure Machine Learning studio, APIs (including published pipelines), or the SDK use the private endpoint.
>
> You may encounter problems trying to access the private endpoint for your workspace if you are using Mozilla Firefox. This problem may be related to DNS over HTTPS in Mozilla. We recommend using Microsoft Edge of Google Chrome as a workaround.

> [!TIP]
> Azure Machine Learning compute instance can be used with a workspace and private endpoint. This capability is currently in public preview in the **US East**, **US South Central** and **US West 2** regions.

## Create a workspace that uses a private endpoint

> [!IMPORTANT]
> Currently, we only support enabling a private endpoint when creating a new Azure Machine Learning workspace.

The template at [https://github.com/Azure/azure-quickstart-templates/tree/master/201-machine-learning-advanced](https://github.com/Azure/azure-quickstart-templates/tree/master/201-machine-learning-advanced) can be used to create a workspace with a private endpoint.

For information on using this template, including private endpoints, see [Use an Azure Resource Manager template to create a workspace for Azure Machine Learning](how-to-create-workspace-template.md).

## Using a workspace over a private endpoint

Since communication to the workspace is only allowed from the virtual network, any development environments that use the workspace must be members of the virtual network. For example, a virtual machine in the virtual network.

> [!IMPORTANT]
> To avoid temporary disruption of connectivity, Microsoft recommends flushing the DNS cache on machines connecting to the workspace after enabling Private Link. 

For information on Azure Virtual Machines, see the [Virtual Machines documentation](/azure/virtual-machines/).


## Next steps

For more information on securing your Azure Machine Learning workspace, see the [Virtual network isolation and privacy overview](how-to-network-security-overview.md) article.