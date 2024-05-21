---
title: Network isolation in prompt flow
titleSuffix: Azure Machine Learning
description: Learn how to secure prompt flow with virtual network.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom:
  - ignite-2023
ms.topic: how-to
author: cloga
ms.author: lochen
ms.reviewer: lagayhar
ms.date: 11/02/2023
---

# Network isolation in prompt flow 

You can secure prompt flow using private networks. This article explains the requirements to use prompt flow in an environment secured by private networks.

## Involved services

When you're developing your LLM application using prompt flow, you want a secured environment. You can make the following services private via network setting.

- Workspace: you can make Azure Machine Learning workspace as private and limit inbound and outbound of it.
- Compute resource: you can also limit inbound and outbound rule of compute resource in the workspace.
- Storage account: you can limit the accessibility of the storage account to specific virtual network.
- Container registry: you also want to secure your container registry with virtual network.
- Endpoint: you want to limit Azure services or IP address to access your endpoint.
- Related Azure Cognitive Services as such Azure OpenAI, Azure content safety and Azure AI Search, you can use network config to make them as private then using private endpoint to let Azure Machine Learning services communicate with them.
- Other non Azure resources such as SerpAPI etc. If you have strict outbound rule, you need add FQDN rule to access them. 

## Options in different network set up

In Azure machine learning, we have two options to secure network isolation, bring your own network or using workspace managed virtual network. Learn more about [Secure workspace resources](../how-to-network-isolation-planning.md).

Here is table to illustrate the options in different network set up for prompt flow.

|Ingress|Egress |Compute type in authoring               |Compute type in inference                                |Network options for workspace|
|-------|-------|----------------------------------------|---------------------------------------------------------|-----------------------------|
|Public |Public |Serverless (recommend), Compute instance| Managed online endpoint (recommend), K8s online endpoint|Managed (recommend) /Bring you own|
|Private|Public |Serverless (recommend), Compute instance| Managed online endpoint (recommend), K8s online endpoint|Managed (recommend) /Bring you own|
|Public |Private|Serverless (recommend), Compute instance| Managed online endpoint                                 |Managed|
|Private|Private|Serverless (recommend), Compute instance| Managed online endpoint                                 |Managed|

- In private VNet scenario, we would recommend to use workspace enabled managed virtual network. It's the easiest way to secure your workspace and related resources. 
- You can also have one workspace for prompt flow authoring with your virtual network and another workspace for prompt flow deployment using managed online endpoint with workspace managed virtual network.
- We didn't support mixed using of managed virtual network and bring your own virtual network in single workspace. And as managed online endpoint is support managed virtual network only, you can't deploy prompt flow to managed online endpoint in workspace which enabled bring your own virtual network.


## Secure prompt flow with workspace managed virtual network

Workspace managed virtual network is the recommended way to support network isolation in prompt flow. It provides easily configuration to secure your workspace. After you enable managed virtual network in the workspace level, resources related to workspace in the same virtual network, will use the same network setting in the workspace level. You can also configure the workspace to use private endpoint to access other Azure resources such as Azure OpenAI, Azure content safety, and Azure AI Search. You also can configure FQDN rule to approve outbound to non-Azure resources use by your prompt flow such as SerpAPI etc.

1. Follow [Workspace managed network isolation](../how-to-managed-network.md) to enable workspace managed virtual network.

    > [!IMPORTANT]
    > The creation of the managed virtual network is deferred until a compute resource is created or provisioning is manually started. You can use following command to manually trigger network provisioning.
    ```bash
    az ml workspace provision-network --subscription <sub_id> -g <resource_group_name> -n <workspace_name>
    ```

2. Add workspace MSI as `Storage File Data Privileged Contributor` to storage account linked with workspace.

    2.1 Go to Azure portal, find the workspace.

    :::image type="content" source="./media/how-to-secure-prompt-flow/go-to-azure-portal.png" alt-text="Diagram showing how to go from Azure Machine Learning portal to Azure portal." lightbox = "./media/how-to-secure-prompt-flow/go-to-azure-portal.png":::


    2.2 Find the storage account linked with workspace.

    :::image type="content" source="./media/how-to-secure-prompt-flow/linked-storage.png" alt-text="Diagram showing how to find workspace linked storage account in Azure portal." lightbox = "./media/how-to-secure-prompt-flow/linked-storage.png":::

    2.3 Jump to role assignment page of storage account.

    :::image type="content" source="./media/how-to-secure-prompt-flow/add-role-storage.png" alt-text="Diagram showing how to jump to role assignment of storage account." lightbox = "./media/how-to-secure-prompt-flow/add-role-storage.png":::

    2.4 Find storage file data privileged contributor role.

    :::image type="content" source="./media/how-to-secure-prompt-flow/storage-file-data-privileged-contributor.png" alt-text="Diagram showing how to find storage file data privileged contributor role." lightbox = "./media/how-to-secure-prompt-flow/storage-file-data-privileged-contributor.png":::
    
    2.5 Assign storage file data privileged contributor role to workspace managed identity.

    :::image type="content" source="./media/how-to-secure-prompt-flow/managed-identity-workspace.png" alt-text="Diagram showing how to assign storage file data privileged contributor role to workspace managed identity." lightbox = "./media/how-to-secure-prompt-flow/managed-identity-workspace.png":::

    > [!NOTE]
    > This operation might take several minutes to take effect.

3. If you want to communicate with [private Azure Cognitive Services](../../ai-services/cognitive-services-virtual-networks.md), you need to add related user defined outbound rules to related resource. The Azure Machine Learning workspace creates private endpoint in the related resource with auto approve. If the status is stuck in pending, go to related resource to approve the private endpoint manually.

    :::image type="content" source="./media/how-to-secure-prompt-flow/outbound-rule-cognitive-services.png" alt-text="Screenshot of user defined outbound rule for Azure Cognitive Services." lightbox = "./media/how-to-secure-prompt-flow/outbound-rule-cognitive-services.png":::

    :::image type="content" source="./media/how-to-secure-prompt-flow/outbound-private-endpoint-approve.png" alt-text="Screenshot of user approve private endpoint." lightbox = "./media/how-to-secure-prompt-flow/outbound-private-endpoint-approve.png":::

4. If you're restricting outbound traffic to only allow specific destinations, you must add a corresponding user-defined outbound rule to allow the relevant FQDN.

    :::image type="content" source="./media/how-to-secure-prompt-flow/outbound-rule-non-azure-resources.png" alt-text="Screenshot of user defined outbound rule for non Azure resource." lightbox = "./media/how-to-secure-prompt-flow/outbound-rule-non-azure-resources.png":::

5. In workspaces that enable managed VNet, you can only deploy prompt flow to managed online endpoint. You can follow [Secure your managed online endpoints with network isolation](../how-to-secure-kubernetes-inferencing-environment.md) to secure your managed online endpoint.

## Secure prompt flow use your own virtual network

- To set up Azure Machine Learning related resources as private, see [Secure workspace resources](../how-to-secure-workspace-vnet.md).
- If you have strict outbound rule, make sure you have open the [Required public internet access](../how-to-secure-workspace-vnet.md#required-public-internet-access).
- Add workspace MSI as `Storage File Data Privileged Contributor` to storage account linked with workspace. Please follow step 2 in [Secure prompt flow with workspace managed virtual network](#secure-prompt-flow-with-workspace-managed-virtual-network).
- If you are using serverless compute type in flow authoring, you need set the custom virtual network in workspace level. Learn more about [Secure an Azure Machine Learning training environment with virtual networks](../how-to-secure-training-vnet.md)

    ```yaml
    serverless_compute:
      custom_subnet: /subscriptions/<sub id>/resourceGroups/<resource group>/providers/Microsoft.Network/virtualNetworks/<vnet name>/subnets/<subnet name>
      no_public_ip: false # Set to true if you don't want to assign public IP to the compute
    ```

- Meanwhile, you can follow [private Azure Cognitive Services](../../ai-services/cognitive-services-virtual-networks.md) to make them as private.
- If you want to deploy prompt flow in workspace which secured by your own virtual network, you can deploy it to AKS cluster which is in the same virtual network. You can follow [Secure Azure Kubernetes Service inferencing environment](../how-to-secure-kubernetes-inferencing-environment.md) to secure your AKS cluster. Learn more about [How to deploy prompt flow to ASK cluster via code](./how-to-deploy-to-code.md).
- You can either create private endpoint to the same virtual network or leverage virtual network peering to make them communicate with each other.

## Known limitations

- AI studio don't support bring your own virtual network, it only support workspace managed virtual network.
- Managed online endpoint with selected egress only supports workspace with managed virtual network. If you want to use your own virtual network, you might need one workspace for prompt flow authoring with your virtual network and another workspace for prompt flow deployment using managed online endpoint with workspace managed virtual network.

## Next steps

- [Secure workspace resources](../how-to-secure-workspace-vnet.md)
- [Workspace managed network isolation](../how-to-managed-network.md)
- [Secure Azure Kubernetes Service inferencing environment](../how-to-secure-kubernetes-inferencing-environment.md)
- [Secure your managed online endpoints with network isolation](../how-to-secure-online-endpoint.md)
- [Secure your RAG workflows with network isolation](../how-to-secure-rag-workflows.md)
