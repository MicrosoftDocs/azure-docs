---
title: Securely integrate with Azure Synapse
titleSuffix: Azure Machine Learning
description: 'How to use a virtual network when integrating Azure Synapse with Azure Machine Learning.'
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 11/16/2022

---

# How to securely integrate Azure Machine Learning and Azure Synapse

In this article, learn how to securely integrate with Azure Machine Learning from Azure Synapse. This integration enables you to use Azure Machine Learning from notebooks in your Azure Synapse workspace. Communication between the two workspaces is secured using an Azure Virtual Network.

## Prerequisites

* An Azure subscription.
* An Azure Machine Learning workspace with a private endpoint connection to a virtual network. The following workspace dependency services must also have a private endpoint connection to the virtual network:

    * Azure Storage Account

        > [!TIP]
        > For the storage account there are three separate private endpoints; one each for blob, file, and dfs.

    * Azure Key Vault
    * Azure Container Registry

    A quick and easy way to build this configuration is to use a [Microsoft Bicep or HashiCorp Terraform template](tutorial-create-secure-workspace-template.md).

* An Azure Synapse workspace in a __managed__ virtual network, using a __managed__ private endpoint. For more information, see [Azure Synapse Analytics Managed Virtual Network](../synapse-analytics/security/synapse-workspace-managed-vnet.md).

    > [!WARNING]
    > The Azure Machine Learning integration is not currently supported in Synapse Workspaces with data exfiltration protection. When configuring your Azure Synapse workspace, do __not__ enable data exfiltration protection. For more information, see [Azure Synapse Analytics Managed Virtual Network](../synapse-analytics/security/synapse-workspace-managed-vnet.md).

    > [!NOTE]
    > The steps in this article make the following assumptions:
    > * The Azure Synapse workspace is in a different resource group than the Azure Machine Learning workspace.
    > * The Azure Synapse workspace uses a __managed virtual network__. The managed virtual network secures the connectivity between Azure Synapse and Azure Machine Learning. It does __not__ restrict access to the Azure Synapse workspace. You will access the workspace over the public internet.

## Understanding the network communication

In this configuration, Azure Synapse uses a __managed__ private endpoint and virtual network. The managed virtual network and private endpoint secures the internal communications from Azure Synapse to Azure Machine Learning by restricting network traffic to the virtual network. It does __not__ restrict communication between your client and the Azure Synapse workspace.

Azure Machine Learning doesn't provide managed private endpoints or virtual networks, and instead uses a __user-managed__ private endpoint and virtual network. In this configuration, both internal and client/service communication is restricted to the virtual network. For example, if you wanted to directly access the Azure Machine Learning studio from outside the virtual network, you would use one of the following options:

* Create an Azure Virtual Machine inside the virtual network and use Azure Bastion to connect to it. Then connect to Azure Machine Learning from the VM.
* Create a VPN gateway or use ExpressRoute to connect clients to the virtual network.

Since the Azure Synapse workspace is publicly accessible, you can connect to it without having to create things like a VPN gateway. The Synapse workspace securely connects to Azure Machine Learning over the virtual network. Azure Machine Learning and its resources are secured within the virtual network.

When adding data sources, you can also secure those behind the virtual network. For example, securely connecting to an Azure Storage Account or Data Lake Store Gen 2 through the virtual network.

For more information, see the following articles:

* [Azure Synapse Analytics Managed Virtual Network](../synapse-analytics/security/synapse-workspace-managed-vnet.md)
* [Secure Azure Machine Learning workspace resources using virtual networks](how-to-network-security-overview.md).
* [Connect to a secure Azure storage account from your Synapse workspace](../synapse-analytics/security/connect-to-a-secure-storage-account.md).

## Configure Azure Synapse

> [!IMPORTANT]
> Before following these steps, you need an Azure Synapse workspace that is configured to use a managed virtual network. For more information, see [Azure Synapse Analytics Managed Virtual Network](../synapse-analytics/security/synapse-workspace-managed-vnet.md).

1. From Azure Synapse Studio, [Create a new Azure Machine Learning linked service](../synapse-analytics/machine-learning/quickstart-integrate-azure-machine-learning.md).
1. After creating and publishing the linked service, select __Manage__,  __Managed private endpoints__, and then __+ New__ in Azure Synapse Studio.

    :::image type="content" source="./media/how-to-private-endpoint-integration-synapse/add-managed-private-endpoint.png" alt-text="Screenshot of the managed private endpoints dialog.":::

1. From the __New managed private endpoint__ page, search for __Azure Machine Learning__ and select the tile.

    :::image type="content" source="./media/how-to-private-endpoint-integration-synapse/new-private-endpoint-select-machine-learning.png" alt-text="Screenshot of selecting Azure Machine Learning.":::

1. When prompted to select the Azure Machine Learning workspace, use the __Azure subscription__ and __Azure Machine Learning workspace__ you added previously as a linked service. Select __Create__ to create the endpoint.
    
    :::image type="content" source="./media/how-to-private-endpoint-integration-synapse/new-managed-private-endpoint.png" alt-text="Screenshot of the new private endpoint dialog.":::

1. The endpoint will be listed as __Provisioning__ until it has been created. Once created, the __Approval__ column will list a status of __Pending__. You'll approve the endpoint in the [Configure Azure Machine Learning](#configure-azure-machine-learning) section.

    > [!NOTE]
    > In the following screenshot, a managed private endpoint has been created for the Azure Data Lake Storage Gen 2 associated with this Synapse workspace. For information on how to create an Azure Data Lake Storage Gen 2 and enable a private endpoint for it, see [Provision and secure a linked service with Managed VNet](../synapse-analytics/data-integration/linked-service.md).

    :::image type="content" source="./media/how-to-private-endpoint-integration-synapse/managed-private-endpoint-connections.png" alt-text="Screenshot of the managed private endpoints list.":::

### Create a Spark pool

To verify that the integration between Azure Synapse and Azure Machine Learning is working, you'll use an Apache Spark pool. For information on creating one, see [Create a Spark pool](../synapse-analytics/quickstart-create-apache-spark-pool-portal.md).

## Configure Azure Machine Learning

1. From the [Azure portal](https://portal.azure.com), select your __Azure Machine Learning workspace__, and then select __Networking__.
1. Select __Private endpoints__, and then select the endpoint you created in the previous steps. It should have a status of __pending__. Select __Approve__ to approve the endpoint connection.

    :::image type="content" source="./media/how-to-private-endpoint-integration-synapse/approve-pending-private-endpoint.png" alt-text="Screenshot of the private endpoint approval.":::

1. From the left of the page, select __Access control (IAM)__. Select __+ Add__, and then select __Role assignment__.

    :::image type="content" source="./media/how-to-private-endpoint-integration-synapse/workspace-role-assignment.png" alt-text="Screenshot of the role assignment.":::

1. Select __Contributor__, and then select __Next__.

    :::image type="content" source="./media/how-to-private-endpoint-integration-synapse/contributor-role.png" alt-text="Screenshot of selecting contributor.":::

1. Select __User, group, or service principal__, and then __+ Select members__. Enter the name of the identity created earlier, select it, and then use the __Select__ button.

    :::image type="content" source="./media/how-to-private-endpoint-integration-synapse/add-role-assignment.png" alt-text="Screenshot of assigning the role.":::

1. Select __Review + assign__, verify the information, and then select the __Review + assign__ button.

    > [!TIP]
    > It may take several minutes for the Azure Machine Learning workspace to update the credentials cache. Until it has been updated, you may receive errors when trying to access the Azure Machine Learning workspace from Synapse.

## Verify connectivity

1. From Azure Synapse Studio, select __Develop__, and then __+ Notebook__.

    :::image type="content" source="./media/how-to-private-endpoint-integration-synapse/add-synapse-notebook.png" alt-text="Screenshot of adding a notebook.":::

1. In the __Attach to__ field, select the Apache Spark pool for your Azure Synapse workspace, and enter the following code in the first cell:

    ```python
    from notebookutils.mssparkutils import azureML

    # getWorkspace() takes the linked service name,
    # not the Azure Machine Learning workspace name.
    ws = azureML.getWorkspace("AzureMLService1")

    print(ws.name)
    ```

    > [!IMPORTANT]
    > This code snippet connects to the linked workspace using SDK v1, and then prints the workspace info. In the printed output, the value displayed is the name of the Azure Machine Learning workspace, not the linked service name that was used in the `getWorkspace()` call. For more information on using the `ws` object, see the [Workspace](/python/api/azureml-core/azureml.core.workspace.workspace) class reference.

## Next steps

* [Quickstart: Create a new Azure Machine Learning linked service in Synapse](../synapse-analytics/machine-learning/quickstart-integrate-azure-machine-learning.md).
* [Link Azure Synapse Analytics and Azure Machine Learning workspaces](v1/how-to-link-synapse-ml-workspaces.md).