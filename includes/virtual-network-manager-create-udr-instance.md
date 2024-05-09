---
 title: include file
 description: include file
 services: virtual-network-manager
 author: mbender
 ms.service: virtual-network-manager
 ms.topic: include
 ms.date: 05/08/2024
 ms.author: mbender-ms
ms.custom: include-file
---

## Create a Virtual Network Manager instance

In this step, you deploy a Virtual Network Manager instance with *user defined routing* enabled. 

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **+ Create a resource** and search for **Network Manager**. Then select **Network Manager** > **Create** to begin setting up Virtual Network Manager.

1. On the **Basics** tab, enter or select the following information, and then select **Review + create**.

    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select the subscription where you want to deploy Virtual Network Manager. |
    | **Resource group** | Select **Create new** and enter **rg-vnm**.</br> Select **Ok**. |
    | **Name** | Enter **vnm-1**. |
    | **Region** | Select **(US) East US** or a region of your choosing. Virtual Network Manager can manage virtual networks in any region. The selected region is where the Virtual Network Manager instance is deployed. |
    | **Description** | *(Optional)* Provide a description about this Virtual Network Manager instance and the task it's managing. |
    | [Features](concept-network-manager-scope.md#features) | Select **User defined routing** from the dropdown list. |

1. Select the **Management scope** tab or select **Next: Management scope >** to continue.

1. On the **Management scope** tab, select **+ Add**.

1. In **Add scopes**, select your subscription then choose **Select**. 

1. Select **Review + create** and then select **Create** to deploy the Virtual Network Manager instance.