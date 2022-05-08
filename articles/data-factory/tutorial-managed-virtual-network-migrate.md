---
title: Move existing public Azure integration runtime to an Azure integration runtime in a managed virtual network
description: This tutorial provides steps to move existing public Azure integration runtime to an Azure integration runtime in a managed virtual network.
author: lrtoyou1223
ms.author: lle
ms.service: data-factory
ms.subservice: tutorials
ms.topic: tutorial
ms.date: 05/08/2022
---

# Tutorial: How to move existing public Azure integration runtime to an Azure integration runtime in a managed virtual network

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Managed virtual network provides a secure and manageable data integration solution. With managed virtual network, you can provision the Azure integration runtime as part of a managed virtual network and use private endpoints to securely connect to supported data stores. Data traffic goes through Azure private links that provide secured connectivity to the data source. In addition, it prevents data exfiltration to the public internet. 
This tutorial provides steps to move existing public Azure integration runtime to an Azure integration runtime in a managed virtual network.

## Steps to move existing public Azure integration runtime to an Azure integration runtime in a managed virtual network
1. Enable managed virtual network on your Azure integration runtime. You can enable it either on a new Azure integration time or an existing one.

:::image type="content" source="./media/tutorial-managed-virtual-network/enable-managed-virtual network.png" alt-text="Enable managed virtual network":::

> [!NOTE]
> You can't enable managed virtual network on the default auto-resolve integration runtime.

2. Modify all the integration runtime references in the linked service to the newly created Azure integration runtime in the managed virtual network. 

:::image type="content" source="./media/tutorial-managed-virtual-network/modify-linked-service.png" alt-text="Modify linked service":::


## Next steps

Advance to the following tutorial to learn about managed virtual network:

> [!div class="nextstepaction"]
> [Managed virtual network](managed-virtual-network-private-endpoint.md)