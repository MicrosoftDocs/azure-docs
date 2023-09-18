---
title: Network isolation in prompt flow (preview)
titleSuffix: Azure Machine Learning
description: Learn how to secure prompt flow with virtual network.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.topic: how-to
author: cloga
ms.author: lochen
ms.reviewer: lagayhar
ms.date: 09/12/2023
---

# Network isolation in prompt flow (preview)

You can secure prompt flow using private networks. This article explains the requirements to use prompt flow in an environment secured by private networks.

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Involved services

When you're developing your LLM application using prompt flow, you may want a secured environment. You can make the following services private via network setting.

- Workspace: you can make Azure Machine Learning workspace as private and limit inbound and outbound of it.
- Compute resource: you can also limit inbound and outbound rule of compute resource in the workspace.
- Storage account: you can limit the accessibility of the storage account to specific virtual network.
- Container registry: you may also want to secure your container registry with virtual network.
- Endpoint: you may want to limit Azure services or IP address to access your endpoint.
- Related Azure Cognitive Services as such Azure OpenAI, Azure content safety and Azure cognitive search, you can use network config to make them as private then using private endpoint to let Azure Machine Learning services communicate with them.
- Other non Azure resources such as SerpAPI, pinecone etc. If you have strict outbound rule, you need add FQDN rule to access them. 

## Secure prompt flow with workspace managed virtual network

Workspace managed virtual network is the recommended way to support network isolation in prompt flow. It provides easily configuration to secure your workspace. After you enable managed virtual network in the workspace level, resources related to workspace in the same virtual network, will use the same network setting in the workspace level. You can also configure the workspace to use private endpoint to access other Azure resources such as Azure OpenAI, Azure content safety, and Azure cognitive search. You also can configure FQDN rule to approve outbound to non-Azure resources use by your prompt flow such as OpenAI, Pinecone etc.

1. Follow [Workspace managed network isolation](../how-to-managed-network.md) to enable workspace managed virtual network.

    > [!IMPORTANT]
    > The creation of the managed virtual network is deferred until a compute resource is created or provisioning is manually started. You can use following command to manually trigger network provisioning.
    ```bash
    az ml workspace provision-network --subscription <sub_id> -g <resource_group_name> -n <workspace_name>
    ```

2. If you want to communicate with [private Azure Cognitive Services](../../ai-services/cognitive-services-virtual-networks.md), you need to add related user defined outbound rules to related resource. The Azure Machine Learning workspace creates private endpoint in the related resource with auto approve. If the status is stuck in pending, go to related resource to approve the private endpoint manually.

    :::image type="content" source="./media/how-to-secure-prompt-flow/outbound-rule-cognitive-services.png" alt-text="Screenshot of user defined outbound rule for Azure Cognitive Services." lightbox = "./media/how-to-secure-prompt-flow/outbound-rule-cognitive-services.png":::

    :::image type="content" source="./media/how-to-secure-prompt-flow/outbound-private-endpoint-approve.png" alt-text="Screenshot of user approve private endpoint." lightbox = "./media/how-to-secure-prompt-flow/outbound-private-endpoint-approve.png":::

3. If you're restricting outbound traffic to only allow specific destinations, you must add a corresponding user-defined outbound rule to allow the relevant FQDN.

    :::image type="content" source="./media/how-to-secure-prompt-flow/outbound-rule-non-azure-resources.png" alt-text="Screenshot of user defined outbound rule for non Azure resource." lightbox = "./media/how-to-secure-prompt-flow/outbound-rule-non-azure-resources.png":::

4. In workspace which enable managed VNet, you can only deploy prompt flow to managed online endpoint. You can follow [Secure your managed online endpoints with network isolation](../how-to-secure-kubernetes-inferencing-environment.md) to secure your managed online endpoint.

## Secure prompt flow use your own virtual network

- To set up Azure Machine Learning related resources as private, see [Secure workspace resources](../how-to-secure-workspace-vnet.md).
- Meanwhile, you can follow [private Azure Cognitive Services](../../ai-services/cognitive-services-virtual-networks.md) to make them as private.
- If you want to deploy prompt flow in workspace which secured by your own virtual network, you can deploy it to AKS cluster which is in the same virtual network. You can follow [Secure your RAG workflows with network isolation](../how-to-secure-rag-workflows.md) to secure your AKS cluster.
- You can either create private endpoint to the same virtual network or leverage virtual network peering to make them communicate with each other.

## Known limitations

- Only public access enable storage account is supported. You can't use private storage account now. Find workaround here: [Why I can't create or upgrade my flow when I disable public network access of storage account?](./tools-reference/troubleshoot-guidance.md#why-i-cant-create-or-upgrade-my-flow-when-i-disable-public-network-access-of-storage-account)
- Workspace hub / lean workspace and AI studio don't support bring your own virtual network.
- Managed online endpoint only supports workspace managed virtual network. If you want to use your own virtual network, you may need one workspace for prompt flow authoring with your virtual network and another workspace for prompt flow deployment using managed online endpoint with workspace managed virtual network.

## Next steps

- [Secure workspace resources](../how-to-secure-workspace-vnet.md)
- [Workspace managed network isolation](../how-to-managed-network.md)
- [Secure Azure Kubernetes Service inferencing environment](../how-to-secure-online-endpoint.md)
- [Secure your managed online endpoints with network isolation](../how-to-secure-kubernetes-inferencing-environment.md)
- [Secure your RAG workflows with network isolation](../how-to-secure-rag-workflows.md)