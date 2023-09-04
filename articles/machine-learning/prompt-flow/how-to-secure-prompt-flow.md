---
title: Network isolation in prompt flow (preview)
titleSuffix: Azure Machine Learning
description: Learn how to secure prompt flow with VNet.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: cloga
ms.author: lochen
ms.reviewer: lagayhar
ms.date: 08/23/2023
---

# Network isolation in prompt flow (preview)

You can secure prompt flow using private networks. This article explains the requirements to use prompt flow in an environment secured by private networks.


> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Involved services

When you developing your LLM application using prompt flow, you may want a secured environment. You can make the following services private via network setting.
- Workspace: you can make Azure machine learning workspace as private and limit inbound and outbound of it.
- Compute resource: you can also limit inboud and outbount rule of compute resource in the worksapce.
- Storage account: you can limit the accessibilty of the storage account to specific VNet.
- Container registry: you may also want to secure your container registry with VNet.
- Endpoint: you may want to limit Azure services or ip address to access your endpoint.
- Related Azure cognitive services as such Azure OpenAI, Azure content safety and Azure cognitive search, you can use network config to make them as private then using private endpoint to let Azure machine learning services communicate with them.

## Secure prompt flow with workspace managed VNet

Workspace managed VNet is recommand way to support network isolation in prompt flow. It provide easily config to you to secure your workspace. After enable managed VNet in workspace level, resources related to workspace will in the same VNet, and will using same network setting in workspace level. You can also config the workspace to use private endpoint to access other Azure resources such as Azure OpenAI, Azure content safety and Azure cognitive search, also can config FQDN rule to approve outbount to non-Azure resources use by your prompt flow such as OpenAI, Pinecone etc.

1. You can follow [Workspace managed network isolation](../how-to-managed-network.md) to enable workspace managed VNet.

2. If you want communicate with [private Azure cognitive services](../../ai-services/cognitive-services-virtual-networks.md), you need add related user defined outbound rule to related resource. Azure machine learning workspace will create private endpoint in related resource with auto approve. If the status stuck in pending, please go to related resource to approve the private endpoint manually.

    :::image type="content" source="./media/how-to-secure-prompt-flow/outbound-rule-cognitive-services.png" alt-text="Screenshot of user defined outbound rule for Azure cognitive services" lightbox = "./media/how-to-secure-prompt-flow/outbound-rule-cognitive-services.png":::

3. If you restrict outbound and only allow specific outbound, then you need add related user defined outbound rule to allow related FQDN.

    :::image type="content" source="./media/how-to-secure-prompt-flow/outbound-rule-non-azure-resources.png" alt-text="Screenshot of user defined outbound rule for Azure cognitive services" lightbox = "./media/how-to-secure-prompt-flow/outbound-rule-non-azure-resources.png":::

## Secure prompt flow use your own VNet

- You can follow [Secure workspace resources](../how-to-secure-workspace-vnet.md) to setup Azure machine learning related resources as private. 
- Meanwhile, you can follow [private Azure cognitive services](../../ai-services/cognitive-services-virtual-networks.md) to make them as private.
- You can either create private endpoint to the same VNet or levergage VNet peering to make them communicate with each other.


## Limitations
- Workspace hub / leah workspace and AI studio don't support bring your own VNet.
- Managed online endpoint only supports workspace managed VNet. If you want to use your own VNet, you may need one workspace for prompt flow authoring with your VNet and another workspace for prompt flow deployment using managed online endpoint with workspace managed VNet.

## Next steps
- [Secure workspace resources](../how-to-secure-workspace-vnet.md)
- [Workspace managed network isolation](../how-to-managed-network.md)