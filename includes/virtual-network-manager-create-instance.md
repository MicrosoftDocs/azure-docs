---
 title: include file
 description: include file
 services: virtual-network-manager
 author: mbender
 ms.service: virtual-network-manager
 ms.topic: include
 ms.date: 1/13/2024
 ms.author: mbender-ms
ms.custom: include file
---

## Create a Virtual Network Manager instance

Deploy a Virtual Network Manager instance with the defined scope and access that you need. You can create a Virtual Network Manager instance by using the Azure portal, Azure PowerShell, or Azure CLI. This article shows you how to create a Virtual Network Manager instance by using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **+ Create a resource** and search for **Network Manager**. Then select **Network Manager** > **Create** to begin setting up Virtual Network Manager.

1. On the **Basics** tab, enter or select the following information, and then select **Review + create**.

    :::image type="content" source="./media/virtual-network-manager-create-instance/create-virtual-network-manager-instance.png" alt-text="Screenshot of basic information for creating a network manager.":::

    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select the subscription where you want to deploy Virtual Network Manager. |
    | **Resource group** | Select **Create new** and enter **resource-group**. |
    | **Name** | Enter **network-manager**. |
    | **Region** | Enter **westus2** or a region of your choosing. Virtual Network Manager can manage virtual networks in any region. The selected region is where the Virtual Network Manager instance will be deployed. |
    | **Description** | *(Optional)* Provide a description about this Virtual Network Manager instance and the task it's managing. |
    | [Features](../articles/virtual-network-manager/concept-network-manager-scope.md#features) | Select **Connectivity** and **Security Admin** from the dropdown list.  </br> **Connectivity** enables the creation of a full mesh or hub-and-spoke network topology between virtual networks within the scope. </br> **Security Admin** enables the creation of global network security rules. |

1. Select the **Management scope** tab or **Next: Management scope** to continue.
2. On the **Management scope** tab, select **+ Add**.
3. In the **Add scopes** pane, select the subscription where you want to deploy Virtual Network Manager, and choose **Select**.
4. Select **Review + create** and **Create** to deploy the Virtual Network Manager instance.
