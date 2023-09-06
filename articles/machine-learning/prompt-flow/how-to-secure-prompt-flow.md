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
- Workspace: you can make Azure Machine Learning workspace as private and limit inbound and outbound of it.
- Compute resource: you can also limit inboud and outbount rule of compute resource in the worksapce.
- Storage account: you can limit the accessibilty of the storage account to specific VNet.
- Container registry: you may also want to secure your container registry with VNet.
- Endpoint: you may want to limit Azure services or IP address to access your endpoint.
- Related Azure cognitive services as such Azure OpenAI, Azure content safety and Azure cognitive search, you can use network config to make them as private then using private endpoint to let Azure Machine Learning services communicate with them.

## Secure prompt flow with workspace managed VNet

Workspace managed VNet is the recommend way to support network isolation in prompt flow. It provides easily configuration to secure your workspace. After enabling managed VNet in the workspace level, resources related to workspace in the same VNet, will use the same network setting in the workspace level. You can also configure the workspace to use private endpoint to access other Azure resources such as Azure OpenAI, Azure content safety, and Azure cognitive search. You also can configure FQDN rule to approve outbound to non-Azure resources use by your prompt flow such as OpenAI, Pinecone etc.

1. Follow [Workspace managed network isolation](../how-to-managed-network.md) to enable workspace managed VNet.

    > [!IMPORTANT]
    > The creation of the managed virtual network is deferred until a compute resource is created or provisioning is manually started. You can use following command to manually trigger network provisioning.
    ```bash
    az ml workspace provision-network --subscription <sub_id> -g <resource_group_name> -n <workspace_name>
    ```

2. If you to want communicate with [private Azure cognitive services](../../ai-services/cognitive-services-virtual-networks.md), you need to add related user defined outbound rules to related resource. The Azure Machine Learning workspace will create private endpoint in the related resource with auto approve. If the status is stuck in pending, go to related resource to approve the private endpoint manually.

    :::image type="content" source="./media/how-to-secure-prompt-flow/outbound-rule-cognitive-services.png" alt-text="Screenshot of user defined outbound rule for Azure cognitive services." lightbox = "./media/how-to-secure-prompt-flow/outbound-rule-cognitive-services.png":::

    :::image type="content" source="./media/how-to-secure-prompt-flow/outbound_pe_approve.png" alt-text="Screenshot of user approve private endpoint." lightbox = "./media/how-to-secure-prompt-flow/outbound_pe_approve.png":::

3. If you are restricting outbound traffic to only allow specific destinations, you must add a corresponding user-defined outbound rule to allow the relevant FQDN.

    :::image type="content" source="./media/how-to-secure-prompt-flow/outbound-rule-non-azure-resources.png" alt-text="Screenshot of user defined outbound rule for non Azure resource." lightbox = "./media/how-to-secure-prompt-flow/outbound-rule-non-azure-resources.png":::


## Secure prompt flow use your own VNet

- To setup Azure Machine Learning related resources as private, see [Secure workspace resources](../how-to-secure-workspace-vnet.md). 
- Meanwhile, you can follow [private Azure cognitive services](../../ai-services/cognitive-services-virtual-networks.md) to make them as private.
- You can either create private endpoint to the same VNet or levergage VNet peering to make them communicate with each other.


## Limitations
- Workspace hub / lean workspace and AI studio don't support bring your own VNet.
- Managed online endpoint only supports workspace managed VNet. If you want to use your own VNet, you may need one workspace for prompt flow authoring with your VNet and another workspace for prompt flow deployment using managed online endpoint with workspace managed VNet.

## Next steps
- [Secure workspace resources](../how-to-secure-workspace-vnet.md)
- [Workspace managed network isolation](../how-to-managed-network.md)