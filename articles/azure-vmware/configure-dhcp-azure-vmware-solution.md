---
title: Configure DHCP for Azure VMware Solution
description: Learn how to configure DHCP with either NSX-T Manager or the Azure portal for Azure VMware Solution.
ms.topic: how-to
ms.custom: contperf-fy22q1 
ms.date: 07/16/2021

# Customer intent: As an Azure service administrator, I want to configure DHCP by using either NSX-T Manager or the Azure portal for Azure VMware Solution.

---

# Configure DHCP for Azure VMware Solution

<!-- not sure this include is needed -->

[!INCLUDE [dhcp-dns-in-azure-vmware-solution-description](includes/dhcp-dns-in-azure-vmware-solution-description.md)]

<!--
Applications and workloads running in a private cloud environment require name resolution and DHCP services for lookup and IP address assignments. A proper DHCP and DNS infrastructure are required to provide these services. You can configure a virtual machine to provide these services in your private cloud environment.  

Use the DHCP service built-in to NSX or use a local DHCP server in the private cloud instead of routing broadcast DHCP traffic over the WAN back to on-premises.
-->


[!INCLUDE [configure-nsxt-objects-description](includes/configure-nsxt-objects-description.md)]

<!--
After deploying Azure VMware Solution, you can configure DHCP either using NSX-T Manager or the Azure portal.  Once configured, the objects are visible in Azure VMware Solution, NSX-T Manger, and vCenter. 

>[!TIP]
>The Azure portal presents a simplified view of NSX-T operations a VMware administrator needs regularly and targeted at users not familiar with NSX-T Manager. 
-->
>If you want to configure DHCP using a simplified view of NSX-T operations, see [Create a DHCP server or DHCP relay using the Azure portal](configure-nsx-network-components-azure-portal.md#create-a-dhcp-server-or-dhcp-relay-using-the-azure-portal). 

In this how-to article, you'll use either NSX-T Manager or the Azure portal to configure DHCP for Azure VMware Solution. 

- **NSX-T Manager**: Use NSX-T Manager for the advanced settings mentioned and other NSX-T features. 

   >[!IMPORTANT]
   >For clouds created on or after July 1, 2021, the simplified view of NSX-T operations must be used to configure DHCP on the default Tier-1 Gateway in your environment.

   - [Use NSX-T to host your DHCP server](#use-nsx-t-to-host-your-dhcp-server)
    
   - [Use a third-party external DHCP server](#use-a-third-party-external-dhcp-server)

- **Azure portal**: Use the Azure portal for the simplified view, which is targeted at users unfamiliar with NSX-T Manager.
 
   - [Configure a DHCP server](#configure-a-dhcp-server)

   - [Configure a DHCP relay](#configure-a-dhcp-relay)

    
>[!IMPORTANT]
>DHCP does not work for virtual machines (VMs) on the VMware HCX L2 stretch network when the DHCP server is in the on-premises datacenter.  NSX, by default, blocks all DHCP requests from traversing the L2 stretch. For the solution, see the [Configure DHCP on L2 stretched VMware HCX networks](configure-l2-stretched-vmware-hcx-networks.md) procedure.

## NSX-T Manager

### Use NSX-T to host your DHCP server

If you want to use NSX-T to host your DHCP server, you'll create a DHCP server and a relay service. Then you'll add a network segment and specify the DHCP IP address range.

#### Create a DHCP server

1. In NSX-T Manager, select **Networking** > **DHCP**, and then select **Add Server**.

1. Select **DHCP** for the **Server Type**, provide the server name and IP address, and then select **Save**.

   :::image type="content" source="media/manage-dhcp/dhcp-server-settings.png" alt-text="Screenshot showing how to add a DHCP server in NSX-T Manager." border="true":::

1. Select **Tier 1 Gateways**, select the vertical ellipsis on the Tier-1 gateway, and then select **Edit**.

   :::image type="content" source="media/manage-dhcp/edit-tier-1-gateway.png" alt-text="Screenshot showing how to edit the Tier-1 Gateway for using a DHCP server." border="true":::

1. Select **No IP Allocation Set** to add a subnet.

   :::image type="content" source="media/manage-dhcp/add-subnet.png" alt-text="Screenshot showing how to add a subnet to the Tier-1 Gateway for using a DHCP server." border="true":::

1. For **Type**, select **DHCP Local Server**. 
   
1. For the **DHCP Server**, select **Default DHCP**, and then select **Save**.

1. Select **Save** again and then select **Close Editing**.

#### Add a network segment

[!INCLUDE [add-network-segment-steps](includes/add-network-segment-steps.md)]

#### Specify the DHCP IP address range
 
When you create a relay to a DHCP server, you'll also specify the DHCP IP address range.

[!INCLUDE [specify-dhcp-ip-address-range-steps](includes/specify-dhcp-ip-address-range-steps.md)]


### Use a third-party external DHCP server

If you want to use a third-party external DHCP server, you'll create a DHCP relay service in NSX-T Manager. You'll also specify the DHCP IP address range.


>[!IMPORTANT]
>For clouds created on or after July 1, 2021, the simplified view of NSX-T operations must be used to configure DHCP on the default Tier-1 Gateway in your environment.


### Create DHCP relay service

Use a DHCP relay for any non-NSX-based DHCP service. For example, a VM running DHCP in Azure VMware Solution, Azure IaaS, or on-premises.

1. In NSX-T Manager, select **Networking** > **DHCP**, and then select **Add Server**.

1. Select **DHCP Relay** for the **Server Type**, provide the server name and IP address, and then select **Save**.

   :::image type="content" source="media/manage-dhcp/create-dhcp-relay.png" alt-text="Screenshot showing how to create a DHCP relay service in NSX-T Manager." border="true":::

1. Select **Tier 1 Gateways**, select the vertical ellipsis on the Tier-1 gateway, and then select **Edit**.

   :::image type="content" source="media/manage-dhcp/edit-tier-1-gateway-relay.png" alt-text="Screenshot showing how to edit the Tier-1 Gateway." border="true":::

1. Select **No IP Allocation Set** to define the IP address allocation.

   :::image type="content" source="media/manage-dhcp/edit-ip-address-allocation.png" alt-text="Screenshot showing how to add a subnet to the Tier-1 Gateway." border="true":::

1. For **Type**, select **DHCP Server**. 
   
1. For the **DHCP Server**, select **DHCP Relay**, and then select **Save**.

1. Select **Save** again and then select **Close Editing**.


#### Specify the DHCP IP address range

When you create a relay to a DHCP server, you'll also specify the DHCP IP address range.

[!INCLUDE [specify-dhcp-ip-address-range-steps](includes/specify-dhcp-ip-address-range-steps.md)]


## Azure portal

You can create a DHCP server or relay directly from Azure VMware Solution in the Azure portal. The DHCP server or relay connects to the Tier-1 gateway created when you deployed Azure VMware Solution. All the segments where you gave DHCP ranges will be part of this DHCP. After you've created a DHCP server or DHCP relay, you must define a subnet or range on segment level to consume it.

### Configure a DHCP server

1. In your Azure VMware Solution private cloud, under **Workload Networking**, select **DHCP** > **Add**.

2. Select **DHCP Server**, provide a name for the server and three IP addresses. 

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/add-dhcp-server-relay.png" alt-text="Screenshot showing how to add a DHCP server or DHCP relay in Azure VMware Solutions.":::

1. Select **OK**. 


#### Create an NSX-T network segment

[!INCLUDE [create-nsxt-segment-azure-portal-steps](includes/create-nsxt-segment-azure-portal-steps.md)]


### Configure a DHCP relay

1. In your Azure VMware Solution private cloud, under **Workload Networking**, select **DHCP** > **Add**.

2. Select **DHCP Relay** and then provide a name and three IP addresses. 

   >[!NOTE]
   >For DHCP relay, you only require one IP address for a successful configuration.

<!-- I need a new image -->

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/add-dhcp-server-relay.png" alt-text="Screenshot showing how to add a DHCP server or DHCP relay in Azure VMware Solutions.":::

1. Select **OK**. 


#### Create an NSX-T network segment

[!INCLUDE [create-nsxt-segment-azure-portal-steps](includes/create-nsxt-segment-azure-portal-steps.md)]

## Next steps

If you want to send DHCP requests from your Azure VMware Solution VMs to a non-NSX-T DHCP server, see the [Configure DHCP on L2 stretched VMware HCX networks](configure-l2-stretched-vmware-hcx-networks.md) procedure.
