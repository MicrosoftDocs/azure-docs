---
title: Deploy Traffic Manager to balance Azure VMware Solution workloads
description: Learn how to integrate Traffic Manager with Azure VMware Solution to balance application workloads across multiple endpoints in different regions.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 10/26/2022
ms.custom: engagement-fy23

---

# Deploy Azure Traffic Manager to balance Azure VMware Solution workloads

This article walks through the steps of how to integrate [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) with Azure VMware Solution. The integration balances application workloads across multiple endpoints. This article also walks through the steps of how to configure Traffic Manager to direct traffic between three [Azure Application Gateway](../application-gateway/overview.md) spanning several Azure VMware Solution regions. 

The gateways have Azure VMware Solution virtual machines (VMs) configured as backend pool members to load balance the incoming layer 7 requests. For more information, see [Use Azure Application Gateway to protect your web apps on Azure VMware Solution](protect-azure-vmware-solution-with-application-gateway.md)

The diagram shows how Traffic Manager provides load balancing for the applications at the DNS level between regional endpoints. The gateways have backend pool members configured as IIS Servers and referenced as Azure VMware Solution external endpoints. Connection over the virtual network between the two private cloud regions uses an ExpressRoute gateway.   

:::image type="content" source="media/traffic-manager/traffic-manager-topology.png" alt-text="Diagram of the Traffic Manager integration with Azure VMware Solution." lightbox="media/traffic-manager/traffic-manager-topology.png" border="false":::

Before you begin, first review the [Prerequisites](#prerequisites) and then we'll walk through the procedures to:

> [!div class="checklist"]
> * Verify configuration of your application gateways and the NSX-T segment
> * Create your Traffic Manager profile
> * Add external endpoints into your Traffic Manager profile

## Prerequisites

- Three VMs configured as Microsoft IIS Servers running in different Azure VMware Solution regions: 
   - West US
   - West Europe
   - East US (on-premises) 

- An application gateway with external endpoints in the Azure VMware Solution regions mentioned above.

- Host with internet connectivity for verification. 

- An [NSX-T network segment created in Azure VMware Solution](tutorial-nsx-t-network-segment.md).

## Verify your application gateways configuration

The following steps verify the configuration of your application gateways.

1. In the Azure portal, select **Application gateways** to view a list of your current application gateways:

   - AVS-GW-WUS
   - AVS-GW-EUS (on-premises)
   - AVS-GW-WEU

   :::image type="content" source="media/traffic-manager/app-gateways-list-1.png" alt-text="Screenshot of Application gateway page showing list of configured application gateways." lightbox="media/traffic-manager/app-gateways-list-1.png":::

1. Select one of your previously deployed application gateways. 

   A window opens showing various information on the application gateway. 

   :::image type="content" source="media/traffic-manager/backend-pool-configuration.png" alt-text="Screenshot of Application gateway page showing details of the selected application gateway." lightbox="media/traffic-manager/backend-pool-configuration.png":::

1. Select **Backend pools** to verify the configuration of one of the backend pools. You see one VM backend pool member configured as a web server with an IP address of 172.29.1.10.
 
   :::image type="content" source="media/traffic-manager/backend-pool-ip-address.png" alt-text="Screenshot of Edit backend pool page with target IP address highlighted.":::

1. Verify the configuration of the other application gateways and backend pool members. 

## Verify the NSX-T segment configuration

The following steps verify the configuration of the NSX-T segment in the Azure VMware Solution environment.

1. Select **Segments** to view your configured segments.  You see Contoso-segment1 connected to Contoso-T01 gateway, a Tier-1 flexible router.

   :::image type="content" source="media/traffic-manager/nsx-t-segment-azure-vmware-solution.png" alt-text="Screenshot showing segment profiles in NSX-T Manager." lightbox="media/traffic-manager/nsx-t-segment-azure-vmware-solution.png":::    

1. Select **Tier-1 Gateways** to see a list of Tier-1 gateways with the number of linked segments. 

   :::image type="content" source="media/traffic-manager/nsx-t-segment-linked-2.png" alt-text="Screenshot showing gateway address of the selected segment.":::    

1. Select the segment linked to Contoso-T01. A window opens showing the logical interface configured on the Tier-01 router. It serves as a gateway to the backend pool member VM connected to the segment.

1. In the vSphere client, select the VM to view its details. 

   >[!NOTE]
   >Its IP address matches VM backend pool member configured as a web server from the preceding section: 172.29.1.10.

   :::image type="content" source="media/traffic-manager/nsx-t-vm-details.png" alt-text="Screenshot showing VM details in vSphere Client." lightbox="media/traffic-manager/nsx-t-vm-details.png":::    

4. Select the VM, then select **ACTIONS > Edit Settings** to verify connection to the NSX-T segment.

## Create your Traffic Manager profile

1. Sign in to the [Azure portal](https://rc.portal.azure.com/#home). Under **Azure Services > Networking**, select **Traffic Manager profiles**.

2. Select **+ Add** to create a new Traffic Manager profile.
 
3. Provide the following information and then select **Create**:

   - Profile name
   - Routing method (use [weighted](../traffic-manager/traffic-manager-routing-methods.md))
   - Subscription
   - Resource group

## Add external endpoints into the Traffic Manager profile

1. Select the Traffic Manager profile from the search results pane, select **Endpoints**, and then **+ Add**.

1. For each of the external endpoints in the different regions, enter the required details and then select **Add**: 
   - Type
   - Name
   - Fully Qualified domain name (FQDN) or IP
   - Weight (assign a weight of 1 to each endpoint). 

   Once created, all three shows in the Traffic Manager profile. The monitor status of all three must be **Online**.

3. Select **Overview** and copy the URL under **DNS Name**.

   :::image type="content" source="media/traffic-manager/traffic-manager-endpoints.png" alt-text="Screenshot showing a Traffic Manager endpoint overview with DNS name highlighted." lightbox="media/traffic-manager/traffic-manager-endpoints.png"::: 

4. Paste the DNS name URL in a browser. The screenshot shows traffic directing to the West Europe region.

   :::image type="content" source="media/traffic-manager/traffic-to-west-europe.png" alt-text="Screenshot of browser window showing traffic routed to West Europe."::: 

5. Refresh your browser. The screenshot shows traffic directing to another set of backend pool members in the West US region.

   :::image type="content" source="media/traffic-manager/traffic-to-west-us.png" alt-text="Screenshot of browser window showing traffic routed to West US."::: 

6. Refresh your browser again. The screenshot shows traffic directing to the final set of backend pool members on-premises.

   :::image type="content" source="media/traffic-manager/traffic-to-on-premises.png" alt-text="Screenshot of browser window showing traffic routed to on-premises.":::

## Next steps

Now that you've covered integrating Azure Traffic Manager with Azure VMware Solution, you may want to learn about:

- [Using Azure Application Gateway on Azure VMware Solution](protect-azure-vmware-solution-with-application-gateway.md)
- [Traffic Manager routing methods](../traffic-manager/traffic-manager-routing-methods.md)
- [Combining load-balancing services in Azure](../traffic-manager/traffic-manager-load-balancing-azure.md)
- [Measuring Traffic Manager performance](../traffic-manager/traffic-manager-performance-considerations.md)
