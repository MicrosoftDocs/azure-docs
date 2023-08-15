---
title: Move existing Azure integration runtime to an Azure integration runtime in a managed virtual network
description: This tutorial provides steps to move existing Azure integration runtime to an Azure integration runtime in a managed virtual network.
author: lrtoyou1223
ms.author: lle
ms.service: data-factory
ms.subservice: tutorials
ms.topic: tutorial
ms.date: 08/10/2023
---

# Tutorial: How to move existing Azure integration runtime to an Azure integration runtime in a managed virtual network

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Managed virtual network provides a secure and manageable data integration solution. With managed virtual network, you can create the Azure integration runtime as part of a managed virtual network and use private endpoints to securely connect to supported data stores. Data traffic goes through Azure private links that provide secured connectivity to the data source. In addition, it prevents data exfiltration to the public internet. 
This tutorial provides steps to move existing Azure integration runtime to an Azure integration runtime in a managed virtual network.

## Azure Data Factory
For Azure Data Factory, you can move existing Azure integration runtime directly by following steps:
1. Enable managed virtual network on your Azure integration runtime. You can enable it either on a new Azure integration time or an existing one.

:::image type="content" source="./media/tutorial-managed-virtual-network/enable-managed-virtual network.png" alt-text="Screenshot of enabling managed virtual network during the creation or edit Azure integration runtime.":::

> [!NOTE]
> You can't enable managed virtual network on the default auto-resolve integration runtime.

2. Modify all the integration runtime references in the linked service to the newly created Azure integration runtime in the managed virtual network. 

:::image type="content" source="./media/tutorial-managed-virtual-network/modify-linked-service.png" alt-text="Screenshot of modifying the integration runtime reference in the linked service.":::

## Azure Synapse Analytics
For Azure Synapse Analytics, Azure integration runtime can't be moved directly in existing workspace. You need to create a new workspace with a managed workspace virtual network. In new workspace, Azure integration runtime is in a managed virtual network and you can reference it in the linked service.

## Next steps

Advance to the following tutorial to learn about managed virtual network:

> [!div class="nextstepaction"]
> [Managed virtual network](managed-virtual-network-private-endpoint.md)