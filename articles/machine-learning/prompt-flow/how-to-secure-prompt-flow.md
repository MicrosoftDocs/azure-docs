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

2. Add workspace MSI as `Storage File Data Privileged Contributor` and `Storage Table Data Contributor` to storage account linked with workspace.

    2.1 Go to azure portal, find the workspace.

    :::image type="content" source="./media/how-to-secure-prompt-flow/go-to-azure-portal.png" alt-text="Diagram showing how to go from AzureML portal to Azure portal." lightbox = "./media/how-to-secure-prompt-flow/go-to-azure-portal.png":::


    2.2 Find the storage account linked with workspace.

    :::image type="content" source="./media/how-to-secure-prompt-flow/linked-storage.png" alt-text="Diagram showing how to find workspace linked storage account in Azure portal." lightbox = "./media/how-to-secure-prompt-flow/linked-storage.png":::

    2.3 Jump to role assignment page of storage account.

    :::image type="content" source="./media/how-to-secure-prompt-flow/add-role-storage.png" alt-text="Diagram showing how to jump to role assignment of storage account." lightbox = "./media/how-to-secure-prompt-flow/add-role-storage.png":::

    2.4 Find storage file data privileged contributor role.

    :::image type="content" source="./media/how-to-secure-prompt-flow/storage-file-data-privileged-contributor.png" alt-text="Diagram showing how to find storage file data privileged contributor role." lightbox = "./media/how-to-secure-prompt-flow/storage-file-data-privileged-contributor.png":::
    
    2.5 Assign storage file data privileged contributor role to workspace managed identity.

    :::image type="content" source="./media/how-to-secure-prompt-flow/managed-identity-workspace.png" alt-text="Diagram showing how to assign storage file data privileged contributor role to workspace managed identity." lightbox = "./media/how-to-secure-prompt-flow/managed-identity-workspace.png":::

    > [!NOTE]
    > You need follow the same process to assign `Storage Table Data Contributor` role to workspace managed identity.
    > This operation may take several minutes to take effect.

3. If you want to communicate with [private Azure Cognitive Services](../../ai-services/cognitive-services-virtual-networks.md), you need to add related user defined outbound rules to related resource. The Azure Machine Learning workspace creates private endpoint in the related resource with auto approve. If the status is stuck in pending, go to related resource to approve the private endpoint manually.

    :::image type="content" source="./media/how-to-secure-prompt-flow/outbound-rule-cognitive-services.png" alt-text="Screenshot of user defined outbound rule for Azure Cognitive Services." lightbox = "./media/how-to-secure-prompt-flow/outbound-rule-cognitive-services.png":::

    :::image type="content" source="./media/how-to-secure-prompt-flow/outbound-private-endpoint-approve.png" alt-text="Screenshot of user approve private endpoint." lightbox = "./media/how-to-secure-prompt-flow/outbound-private-endpoint-approve.png":::

4. If you're restricting outbound traffic to only allow specific destinations, you must add a corresponding user-defined outbound rule to allow the relevant FQDN.

    :::image type="content" source="./media/how-to-secure-prompt-flow/outbound-rule-non-azure-resources.png" alt-text="Screenshot of user defined outbound rule for non Azure resource." lightbox = "./media/how-to-secure-prompt-flow/outbound-rule-non-azure-resources.png":::

5. In workspaces that enable managed VNet, you can only deploy prompt flow to managed online endpoint. You can follow [Secure your managed online endpoints with network isolation](../how-to-secure-kubernetes-inferencing-environment.md) to secure your managed online endpoint.

## Secure prompt flow use your own virtual network

- To set up Azure Machine Learning related resources as private, see [Secure workspace resources](../how-to-secure-workspace-vnet.md).
- Add workspace MSI as `Storage File Data Privileged Contributor` to storage account linked with workspace. Please follow step 2 in [Secure prompt flow with workspace managed virtual network](#secure-prompt-flow-with-workspace-managed-virtual-network).
- Meanwhile, you can follow [private Azure Cognitive Services](../../ai-services/cognitive-services-virtual-networks.md) to make them as private.
- If you want to deploy prompt flow in workspace which secured by your own virtual network, you can deploy it to AKS cluster which is in the same virtual network. You can follow [Secure Azure Kubernetes Service inferencing environment](../how-to-secure-kubernetes-inferencing-environment.md) to secure your AKS cluster.
- You can either create private endpoint to the same virtual network or leverage virtual network peering to make them communicate with each other.

## Known limitations

- Workspace hub / lean workspace and AI studio don't support bring your own virtual network.
- Managed online endpoint only supports workspace with managed virtual network. If you want to use your own virtual network, you may need one workspace for prompt flow authoring with your virtual network and another workspace for prompt flow deployment using managed online endpoint with workspace managed virtual network.

## Next steps

- [Secure workspace resources](../how-to-secure-workspace-vnet.md)
- [Workspace managed network isolation](../how-to-managed-network.md)
- [Secure Azure Kubernetes Service inferencing environment](../how-to-secure-online-endpoint.md)
- [Secure your managed online endpoints with network isolation](../how-to-secure-kubernetes-inferencing-environment.md)
- [Secure your RAG workflows with network isolation](../how-to-secure-rag-workflows.md)
