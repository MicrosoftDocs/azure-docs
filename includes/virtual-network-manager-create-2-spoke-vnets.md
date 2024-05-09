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

1. From the **Home** screen, select **+ Create a resource** and search for **Virtual network**. 

1. Select **Virtual network > Create** to begin configuring a virtual network.

1. On the **Basics** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select the subscription where you want to deploy this virtual network. |
    | **Resource group** | Select **rg-vnm**. |
    | **Virtual network name** | Enter **vnet-spoke-001**. |
    | **Region** | Select **(US) East US**. |

1. Select **Next > Next** or the **IP addresses** tab.


1. On the **IP addresses** tab, enter an IPv4 address range of **10.0.0.0** and **/16**.

1. Under **Subnets**, select **default** and enter the following information in the **Edit Subnet** window:

    | Setting | Value |
    | -------- | ----- |
    | **Subnet purpose** | Leave as **Default**. |
    | **Name** | Leave as **default**. |
    | **IPv4** | |
    | **IPv4 address range** | Select **10.0.0.0/16**. |
    | **Starting address** | Enter **10.0.1.0**. |
    | **Size** | Enter **/24 (256 addresses)**. |

    :::image type="content" source="media/how-to-deploy-user-defined-routes/edit-subnet.png" alt-text="Screenshot of subnet settings in Azure portal.":::

1. Select **Save** then **Review + create > Create**.

1. Return to home and repeat the preceding steps to create another virtual network with the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select the same subscription that you selected in step 2. |
    | **Resource group** | Select **rg-vnm**. |
    | **Virtual network name** | Enter **vnet-spoke-002**. |
    | **Region** | Select **(US) East US**. |
    | **Edit subnet window** | |
    | **Subnet purpose** | Leave as **Default**. |
    | **Name** | Leave as **default**. |
    | **IPv4** | |
    | **IPv4 address range** | Select **10.1.0.0/16**. |
    | **Starting address** | Enter **10.1.1.0**. |
    | **Size** | Enter **/24 (256 addresses)**. |

1. Select **Save** then **Review + create > Create**.