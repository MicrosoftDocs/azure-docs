---
title: 'Tutorial: Configure outbound connectivity with a gateway load balancer'
titleSuffix: Azure Load Balancer
description: Learn to configure to configure gateway load balancer using the Azure portal higher scalability and performance with network virtual appliances.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: tutorial
ms.date: 06/15/2023
ms.custom: template-tutorial
---

# Tutorial: Configure outbound connectivity with a gateway load balancer

Azure Load Balancer consists of Standard, Basic, and Gateway SKUs. Gateway Load Balancer is used for transparent insertion of Network Virtual Appliances (NVA). Use Gateway Load Balancer for scenarios that require high performance and high scalability of NVAs. 

In this tutorial, you’ll learn how to: 
> [!div class="checklist"]
> - Create a new load balancer frontend IP configuration and outbound rule
> - Chain a load balancer’s frontend or virtual machine’s IP or to a Gateway Load Balancer

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An existing public standard SKU Azure Load Balancer. For more information on creating a load balancer, see **[Create a public load balancer using the Azure portal](quickstart-load-balancer-standard-public-portal.md)**.
    - For the purposes of this tutorial, the load balancer in the examples is named **myLoadBalancer**.
- An existing Gateway SKU Azure Load Balancer. For more information on creating a gateway load balancer, see [Create a gateway load balancer using the Azure portal](tutorial-gateway-portal.md).
    - For the purposes of this tutorial, the gateway load balancer in the examples is name **myGatewayLoadBalancer**.

## Chain a virtual machine to Gateway Load Balancer

Gateway Load Balancer can be inserted in the path of outbound traffic by chaining to virtual machine instance level public IPs. This method will secure both inbound and outbound traffic reaching or originating from this virtual machine’s public IP.  

In this example, we will chain an existing virtual machine’s public IP to a Gateway Load Balancer.

1. Navigate to your existing virtual machine. In this example, the virtual machine is named myVM1. 

1. Make sure your virtual machine has a Standard SKU public IP associated with it.
    1. Go to **Public IP address > Overview** and confir that the SKU is **Standard**.

    :::image type="content" source="media/gateway-configure-outbound-connectivity/confirm-sku.png" alt-text="Screenshot of virtual machine overview highlighting standard sku.":::

1. In the overview blade of the virtual machine, select Networking in Settings.
1. In Networking, select the name of the network interface attached to the virtual machine. In this example, it's myvm1229.

    :::image type="content" source="media/gateway-configure-outbound-connectivity/select-network-interface.png" alt-text="Screenshot of network interface attached to virtual machine.":::

1. In the network interface page, select IP configurations in Settings.
6. Select myFrontend in Gateway Load balancer.

    :::image type="content" source="media/gateway-configure-outbound-connectivity/select-gateway-load-balancer.png" alt-text="Screenshot of gateway load balancer selection in IP configuration settings.":::

1. Select **Save**.

## Create a load balancer frontend

For best practices, we recommend leveraging separate public IPs for inbound and outbound traffic. Reusing the same public IP for inbound and outbound traffic can increase the risk of SNAT exhaustion, as load balancing and inbound NAT rules will decrease the number of available SNAT ports. 

1. Navigate to your existing Standard Public Load Balancer and go to the Frontend IP configurations blade under Settings

    :::image type="content" source="media/gateway-configure-outbound-connectivity/frontend-settings.png" alt-text="Screenshot of frontend IP configuration.":::

1. Select + Add to create a new frontend IP configuration

    :::image type="content" source="media/gateway-configure-outbound-connectivity/add-frontend-ip-configuration.png" alt-text="Screenshot of Add frontend ip configuration screen.":::

1. Enter myOutboundFrontend in Name
1. Select IPv4 and IP address for IP version and IP type   respectively
1. Select myGatewayLoadBalancerFrontend for Gateway Load balancer
    1. This step will effectively “chain” this frontend to the Gateway Load Balancer frontend specified.
    1. Any traffic, inbound or outbound, served by this frontend will be redirected to the Gateway Load Balancer to be inspected by the configured NVAs before being distributed to this load balancer’s backend instances
1.	Select Save.

## Create outbound rule

1. On the load balancer page, select Outbound rules in Settings.
2. Select + Add in Outbound rules to add a rule.

    :::image type="content" source="media/gateway-configure-outbound-connectivity/outbound-rules.png" alt-text="Screenshot of Load Balancer Outbound rules settings.":::

1. Enter or select the following information in **Add outbound rule**:

    | Setting | Value |
    | --- | --- |
    | Name | Enter **myOutboundRule**. |
    | IP version | Select **IPv4**. |
    | Frontend IP address | Select the frontend IP address of the load balancer. In this example, it's myOutboundFrontend. |
    | Protocol | Leave the default of **All**. |
    | Idle timeout (minutes) | Enter **4** or your desired value. |
    | TCP Reset | Leave the default of **Enabled**. |
    | Backend pool | Select the backend pool of the load balancer. In this example, it's **myBackendPool**. |
    | **Port allocation** | |
    | Port allocation | Select **Manaually choose number of outbound ports.** |
    | **Outbound ports** | |
    | Choose by | Select **Maximum number of backend instances**. |
    | Ports per instance | Enter the anticipated maximum number of backend instances. In this example, we have **2** backend instances.

1. Select **Add**.
    
    :::image type="content" source="media/gateway-configure-outbound-connectivity/add-outbound-rule.png" alt-text="Screenshot of Add Outbound Rule screen.":::

## Limitations

- Gateway load balancer does not currently support chaining with NAT Gateway. Outbound traffic originating from Azure virtual machines, served through NAT Gateway, will go directly to the Internet. Please note that NAT Gateway will take precedence over any instance-level public IPs or load balancers for outbound traffic.
    - NAT Gateway can be configured for outbound connectivity, in conjunction with a Standard Public Load Balancer and Gateway Load Balancer architecture for inbound connectivity. In this scenario, all inbound traffic will flow as expected through the GWLB to the Standard LB, while outbound traffic will go to the Internet directly.
    - If NVAs need to be inserted for outbound traffic, please leverage the methods described above in this article (eg. chaining an ILPIP or outbound rules LB frontend to a GWLB)

## Clean up resources

When no longer needed, delete the resource group, load balancer, and all related resources. To do so, select the resource group **TutorGwLB-rg** that contains the resources and then select **Delete**.

## Next steps

Create Network Virtual Appliances in Azure. 

When creating the NVAs, choose the resources created in this tutorial:

* Virtual network

* Subnet

* Network security group

* Gateway load balancer

Advance to the next article to learn how to create a cross-region Azure Load Balancer.
> [!div class="nextstepaction"]
> [Cross-region load balancer](tutorial-cross-region-powershell.md)