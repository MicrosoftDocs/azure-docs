---
title: Azure Load Balancer portal settings
description: Get started learning about Azure Load Balancer portal settings.
author: mbender-ms
ms.service: load-balancer
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 12/06/2022
ms.author: mbender
ms.custom: template-how-to, engagement-fy23
---

# Azure Load Balancer portal settings

As you create Azure Load Balancer, information in this article will help you learn more about the individual settings and what the right configuration is for you.

## Create load balancer

Azure Load Balancer is a network load balancer that distributes traffic across VM instances in the backend pool. 
To create a load balancer in the portal, at the top of the page select the search box. Enter **Load balancer**. Select **Load balancers** in the search results. Select **+ Create** in the **Load balancers** page.

### Basics

In the **Basics** tab of the create load balancer portal page, you'll see the following information:

| Setting |  Details |
| ---------- | ---------- |
| Subscription  | Select your subscription. This selection is the subscription you want your load balancer to be deployed in. |
| Resource group | Select **Create new** and type in the name for your resource group in the text box. If you have an existing resource group created, select it. |
| Name | This setting is the name for your Azure Load Balancer. |
| Region | Select an Azure region you'd like to deploy your load balancer in. |
| SKU  | Select **Standard**. </br> Load balancer has three SKUs: </br> **Basic** </br>**Standard** </br> **Gateway**. </br> Basic has limited functionality. </br> Standard is recommended for production workloads. </br> Gateway caters to third-party network virtual appliances (NVAs) </br> Learn more about [SKUs](skus.md). |
| Type | Load balancer has two types: </br> **Internal (Private)** </br> **Public (External)**.</br> An internal load balancer (ILB) routes traffic to backend pool members via a private IP address.</br> A public load balancer directs requests from clients over the internet to the backend pool.</br> Learn more about [load balancer types](components.md#frontend-ip-configuration-).|
| Tier | Load balancer has two tiers: </br> **Regional** </br> **Global** </br> A regional load balancer is constrained to load balancing within a region. Global refers to a cross-region load balancer that load-balances across regions. </br> For more information on the **Global** tier, see [Cross-region load balancer (preview)](cross-region-overview.md)

:::image type="content" source="./media/manage/create-public-load-balancer-basics.png" alt-text="Screenshot of create load balancer public." border="true":::

### Frontend IP configuration

In the **Frontend IP configuration** tab of the create load balancer portal page, select **+ Add a frontend IP configuration** to open the creation page.

:::image type="content" source="./media/manage/create-frontend.png" alt-text="Screenshot of create frontend IP configuration." border="true":::

#### **Add frontend IP configuration**
##### Public load balancer

If you select **Public** as your load balancer type in the **Basics** tab, you'll see the following information:

| Setting | Details |
| ------- | ------- |
| Name | The name of the frontend that will be added to the load balancer. |
| IP version | **IPv4** </br> **IPv6** </br> Load balancer supports IPv4 and IPv6 frontends. </br> Learn more about [load Balancer and IPv6](load-balancer-ipv6-overview.md). |
| IP type | **IP address** </br> **IP prefix** </br> Load balancer supports an IP address or an IP prefix for the frontend IP address. For more information, see [Azure Public IP address prefix](../virtual-network/ip-services/public-ip-address-prefix.md). |
| Gateway Load Balancer | If you're using a Gateway Load Balancer, choose the **Azure Resource Manager ID** of the Gateway Load Balancer you want to chain to your frontend IP Configuration. |

:::image type="content" source="./media/manage/add-frontend-public.png" alt-text="Screenshot of add frontend IP configuration." border="true":::

###### IP address

If you select **IP address** for **IP type**, you'll see the following information:

| Setting | Details |
| ------- | ------- |
| Public IP address | Select **Create new** to create a public IP address for your public load balancer. </br> If you have an existing public IP, select it in the pull-down box. |
| Name | The name of the public IP address resource. |
| SKU | Public IP addresses have two SKUs: **Basic** and **Standard**. </br> Basic doesn't support zone-resiliency and zonal attributes. </br> **Standard** is recommended for production workloads. </br> Load balancer and public IP address SKUs **must match**. |
| Tier | **Regional** </br> **Global** </br> Depending on type of load balancer tier will determine what is selected. Regional for traditional load balancer, global for cross-region. |
| Assignment | **Static** is auto selected for standard. </br> Basic public IPs have two types: **Dynamic** and **Static**. </br> Dynamic public IP addresses aren't assigned until creation. </br> IPs can be lost if the resource is deleted. </br> Static IP addresses are recommended. |
| Availability zone | Select **Zone-redundant** to create a resilient load balancer. </br> To create a zonal load balancer, select a specific zone from **1**, **2**, or **3**. </br> Standard load balancer and public IPs support zones. </br> Learn more about [load balancer and availability zones](load-balancer-standard-availability-zones.md). </br> You won't see zone selection for basic. Basic load balancer doesn't support zones. |
| Routing preference | Select **Microsoft Network**. </br> Microsoft Network means that traffic is routed via the Microsoft global network. </br> Internet means that traffic is routed through the internet service provider network. </br> Learn more about [Routing Preferences](../virtual-network/ip-services/routing-preference-overview.md)|

:::image type="content" source="./media/manage/create-public-ip.png" alt-text="Screenshot of create public IP." border="true":::

###### IP Prefix

If you select **IP prefix** for **IP type**, you'll see the following information:

| Setting | Details |
| ------- | ------- |
| Public IP prefix | Select **Create new** to create a public IP prefix for your public load balancer. </br> If you have an existing public prefix, select it in the pull-down box. |
| Name | The name of the public IP prefix resource. |
| SKU | Public IP prefixes have one SKU, **Standard**. |
| IP version | **IPv4** or **IPv6**. </br> The version displayed will correspond to the version chosen above. |
| Prefix size | IPv4 or IPv6 prefixes are displayed depending on the selection above. </br> **IPv4** </br> /24 (256 addresses) </br> /25 (128 addresses) </br> /26 (64 addresses) </br> /27 (32 addresses) </br> /28 (16 addresses) </br> /29 (8 addresses) </br> /30 (4 addresses) </br> /31 (2 addresses) </br> **IPv6** </br> /124 (16 addresses) </br> /125 (8 addresses) </br> 126 (4 addresses) </br> 127 (2 addresses) |
| Availability zone | Select **Zone-redundant** to create a resilient load balancer. </br> To create a zonal load balancer, select a specific zone from **1**, **2**, or **3**. </br> Standard load balancer and public IP prefixes support zones. </br> Learn more about [load balancer and availability zones](load-balancer-standard-availability-zones.md).

:::image type="content" source="./media/manage/create-public-ip-prefix.png" alt-text="Screenshot of create public IP prefix." border="true":::

##### Internal load balancer

If you select **Internal** as your load balancer type in the **Basics** tab, you'll see the following information:

| Setting |  Details |
| ---------- | ---------- |
| Virtual network | The virtual network you want your internal load balancer to be part of. </br> The private frontend IP address you select for your internal load balancer will be from this virtual network. |
| Subnet | The subnets available for the IP address of the frontend IP are displayed here. |
| Assignment | Your options are **Static** or **Dynamic**. </br> Static ensures the IP doesn't change. A dynamic IP could change. |
| Availability zone | Your options are: </br> **Zone redundant** </br> **Zone 1** </br> **Zone 2** </br> **Zone 3** </br> To create a load balancer that is highly available and resilient to availability zone failures, select a **zone-redundant** IP. |

:::image type="content" source="./media/manage/add-frontend-internal.png" alt-text="Screenshot of add internal frontend." border="true":::
### Backend pools

In the **Backend pools** tab of the create load balancer portal page, select **+ Add a backend pool** to open the creation page.

:::image type="content" source="./media/manage/create-backend-pool.png" alt-text="Screenshot of create backend pool tab." border="true":::

#### **Add backend pool**

The following is displayed in the **Add backend pool** creation page:

| Setting | Details |
| ---------- |  ---------- |
| Name | The name of your backend pool. |
| Virtual network | The virtual network your backend instances are. |
| Backend pool configuration | Your options are: </br> **NIC** </br> **IP address** </br> NIC configures the backend pool to use the network interface card of the virtual machines. </br> IP address configures the backend pool to use the IP address of the virtual machines. </br> For more information on backend pool configuration, see [Backend pool management](backend-pool-management.md).

##### NIC backend pool configuration
You can add virtual machines or Virtual Machine Scale Sets to the backend pool of your Azure Load Balancer. Create the virtual machines or Virtual Machine Scale Sets first. 

Under **IP configurations**, select **+ Add** to choose your IP configurations.

:::image type="content" source="media/manage/add-ip-configuration.png" alt-text="Screenshot of Add backend pool page with NIC selected as configuration type.":::

In **Add IP configuration to backend pool** page, select the virtual machine or Virtual Machine Scale Set resources, and select **Add** and **Save**.

:::image type="content" source="./media/manage/add-virtual-machine.png" alt-text="Screenshot of Add IP configurations to backend pool page with virtual machine selected as resource." border="true":::
### Inbound rules

There are two sections in the **Inbound rules** tab, **Load balancing rule** and **Inbound NAT rule**.

In the **Inbound rules** tab of the create load balancer portal page, select **+ Add a load balancing rule** to open the creation page.

:::image type="content" source="./media/manage/inbound-rules.png" alt-text="Screenshot of add inbound rule." border="true":::

#### **Add load balancing rule**

The following is displayed in the **Add load balancing rule** creation page:

| Setting | Details |
| ---------- | ---------- |
| Name | The name of the load balancer rule. |
| IP Version | Your options are **IPv4** or **IPv6**.  |
| Frontend IP address | Select the frontend IP address. </br> The frontend IP address of your load balancer you want the load balancer rule associated to.|
| Backend pool | The backend pool you would like this load balancer rule to be applied on. |
| HA Ports | This setting enables load balancing on all TCP and UDP ports. |
| Protocol | Azure Load Balancer is a layer 4 network load balancer. </br> Your options are: **TCP** or **UDP**. |
| Port | This setting is the port associated with the frontend IP that you want traffic to be distributed based on this load-balancing rule. |
| Backend port | This setting is the port on the instances in the backend pool you would like the load balancer to send traffic to. This setting can be the same as the frontend port or different if you need the flexibility for your application. |
| Health probe | Select **Create new**, to create a new probe.  </br> Only healthy instances will receive new traffic. |
| Session persistence |  Your options are: </br> **None** </br> **Client IP** </br> **Client IP and protocol**</br> </br> Maintain traffic from a client to the same virtual machine in the backend pool. This traffic will be maintained during the session. </br> **None** specifies that successive requests from the same client may be handled by any virtual machine. </br> **Client IP** specifies that successive requests from the same client IP address will be handled by the same virtual machine. </br> **Client IP and protocol** ensure that successive requests from the same client IP address and protocol will be handled by the same virtual machine. </br> Learn more about [distribution modes](load-balancer-distribution-mode.md). |
| Idle timeout (minutes) | Keep a **TCP** or **HTTP** connection open without relying on clients to send keep-alive messages |  
| TCP reset | Load balancer can send **TCP resets** to help create a more predictable application behavior on when the connection is idle. </br> Learn more about [TCP reset](load-balancer-tcp-reset.md)|
| Floating IP | Floating IP is Azure's terminology for a portion of what is known as **Direct Server Return (DSR)**. </br> DSR consists of two parts: <br> 1. Flow topology </br> 2. An IP address-mapping scheme at a platform level. </br></br> Azure Load Balancer always operates in a DSR flow topology whether floating IP is enabled or not. </br> This operation means that the outbound part of a flow is always correctly rewritten to flow directly back to the origin. </br> Without floating IP, Azure exposes a traditional load-balancing IP address-mapping scheme, the VM instances' IP. </br> Enabling floating IP changes the IP address mapping to the frontend IP of the load Balancer to allow for more flexibility. </br> For more information, see [Multiple frontends for Azure Load Balancer](load-balancer-multivip-overview.md).|

:::image type="content" source="./media/manage/add-load-balancing-rule.png" alt-text="Screenshot of add load balancing rule." border="true":::

#### Create health probe

If you selected **Create new** in the health probe configuration of the load-balancing rule above, the following options are displayed:

| Setting | Details |
| ---------- | ---------- |
| Name | The name of your health probe. |
| Protocol | The protocol you select determines the type of check used to determine if the backend instance(s) are healthy. </br> Your options are: </br> **TCP** </br> **HTTPS** </br> **HTTP** </br> Ensure you're using the right protocol. This selection will depend on the nature of your application. </br> The configuration of the health probe and probe responses determines which backend pool instances will receive new flows. </br> You can use health probes to detect the failure of an application on a backend endpoint. </br> Learn more about [health probes](load-balancer-custom-probe-overview.md). |
| Port | The destination port for the health probe. </br> This setting is the port on the backend instance the health probe will use to determine the instance's health. |
| Interval | The number of seconds in between probe attempts. </br> The interval will determine how frequently the health probe will attempt to reach the backend instance. </br> If you select 5, the second probe attempt will be made after 5 seconds and so on. |

:::image type="content" source="./media/manage/add-health-probe.png" alt-text="Screenshot of add health probe." border="true":::

In the **Inbound rules** tab of the create load balancer portal page, select **+ Add an inbound NAT rule** to open the creation page.

#### **Add an inbound NAT rule**
Inbound NAT rules can be configured for traffic sent to an individual virtual machines or a set of machines in a backend pool. Each destination resource has specific creation settings on the creation page

##### Azure Virtual Machine 
The following is displayed in the **Add an inbound NAT rule** creation page for an **Azure virtual machine**:

| Setting | Details |
| ---------- | ---------- |
| Name | The name of your inbound NAT rule |
| Type | Select **Azure virtual machine** or **Backend pool**. Inbound NAT rules can be configured by sending traffic to an individual VM or a set of machines in a backend pool.|
| Target virtual machine | Select the name of the Azure Virtual Machine this rule applies to from the available VMs in the dropdown list. |
| Frontend IP address | Select the frontend IP address. </br> The frontend IP address of your load balancer you want the inbound NAT rule associated to. |
| Frontend Port | This setting is the port associated with the frontend IP that you want traffic to be distributed based on this inbound NAT rule. |
| Service Tag | Enter a service tag to use for your rule. The frontend port value is populated based on Service Tag chosen. |
| Backend port | Enter a port on the backend virtual machine that traffic will be sent to. |
| Protocol | Azure Load Balancer is a layer 4 network load balancer. </br> Your options are: TCP or UDP. |
| Enable TCP Reset | Load Balancer can send TCP resets to help create a more predictable application behavior on when the connection is idle. </br> Learn more about [TCP reset](load-balancer-tcp-reset.md) |
| Idle timeout (minutes) | Keep a TCP or HTTP connection open without relying on clients to send keep-alive messages. |
| Enable Floating IP | Some application scenarios prefer or require the same port to be used by multiple application instances on a single VM in the backend pool. If you want to reuse the backend port across multiple rules, you must enable [Floating IP](load-balancer-floating-ip.md) in the rule definition.|

:::image type="content" source="media/manage/add-inbound-nat-virtual-machine-rule.png" alt-text="Screenshot of Add inbound NAT Rule page for Azure Virtual Machines":::

##### Backend pool 
The following is displayed in the **Add an inbound NAT rule** creation page for a **Backend pool**:

| Setting | Details |
| ---------- | ---------- |
| Name | The name of your inbound NAT rule |
| Type | Select **Azure virtual machine** or **Backend pool**. Inbound NAT rules can be configured by sending traffic to an individual VM or a set of machines in a backend pool.|
|Target backend pool | Select the backend pool this rule applies to from the dropdown menu. |
| Frontend IP address | Select the frontend IP address. </br> The frontend IP address of your load balancer you want the inbound NAT rule associated to. |
| Frontend port range start | Enter the starting port of a range of frontend ports pre-allocated for the specific backend pool. |
| Current number of machines in backend pool | The number of machines in the selected backend pool will be displayed. The displayed value is for information only; you can't modify this value. |
| Maximum number of machines in backend pool | Enter the maximum number of instances in the backend pool when scaling out. |
| Backend port | Enter a port on the backend pool that traffic will be sent to. |
| Protocol | Azure Load Balancer is a layer 4 network load balancer. </br> Your options are: TCP or UDP. |
| Enable TCP Reset | Load Balancer can send TCP resets to help create a more predictable application behavior on when the connection is idle. </br> Learn more about [TCP reset](load-balancer-tcp-reset.md) |
| Idle timeout (minutes) | Keep a TCP or HTTP connection open without relying on clients to send keep-alive messages. |
| Enable Floating IP | Some application scenarios prefer or require the same port to be used by multiple application instances on a single VM in the backend pool. If you want to reuse the backend port across multiple rules, you must enable [Floating IP](load-balancer-floating-ip.md) in the rule definition.|

:::image type="content" source="media/manage/add-inbound-nat-backend-pool-rule.png" alt-text="Screenshot of Add inbound NAT rule creation page for backend pool.":::
### Outbound rules

In the **Outbound rules** tab of the create load balancer portal page, select **+ Add an outbound rule** to open the creation page.

> [!NOTE]
> The outbound rules tab is only valid for a public standard load balancer. Outbound rules are not supported on an internal or basic load balancer. Azure Virtual Network NAT is the recommended way to provide outbound internet access for the backend pool. For more information on **Azure Virtual Network NAT** and the NAT gateway resource, see **[What is Azure Virtual Network NAT?](../virtual-network/nat-gateway/nat-overview.md)**.

:::image type="content" source="./media/manage/create-outbound-rule.png" alt-text="Screenshot of create outbound rule." border="true":::

#### **Add an outbound rule**

The following is displayed in the **Add outbound rule** creation page:

| Setting | Details |
| ------- | ------ |
| Name | The name of your outbound rule. |
| IP Version | Your options are **IPv4** or **IPv6**. |
| Frontend IP address | Select the frontend IP address. </br> The frontend IP address of your load balancer you want the outbound rule to be associated to. |
| Protocol | Azure Load Balancer is a layer 4 network load balancer. </br> Your options are: **All**, **TCP**, or **UDP**. |
| Idle timeout (minutes) | Keep a **TCP** or **HTTP** connection open without relying on clients to send keep-alive messages. |
| TCP Reset | Load balancer can send **TCP resets** to help create a more predictable application behavior on when the connection is idle. </br> Learn more about [TCP reset](load-balancer-tcp-reset.md) |
| Backend pool | The backend pool you would like this outbound rule to be applied on. |
| **Port allocation** |   |
| Port allocation | Your choices are: </br> **Manually choose number of outbound ports** </br> **Use the default number of outbound ports** </br> The recommended selection is the default of **Manually choose number of outbound ports** to prevent SNAT port exhaustion. If choose **Use the default number of outbound ports**, the **Outbound ports** selection is disabled. |
| Outbound ports | Your choices are: </br> **Ports per instance** </br> **Maximum number of backend instances**. </br> The recommended selections are select **Ports per instance** and enter **10,000**. |

:::image type="content" source="./media/manage/add-outbound-rule.png" alt-text="Screenshot of add outbound rule." border="true":::

## Portal settings
### Frontend IP configuration

The IP address of your Azure Load Balancer. It's the point of contact for clients. 

You can have one or many frontend IP configurations. If you went through the create section above, you would have already created a frontend for your load balancer. 

If you want to add a frontend IP configuration to your load balancer, go to your load balancer in the Azure portal, select **Frontend IP configuration**, and then select **+Add**.

| Setting |  Details |
| ---------- | ---------- |
| Name | The name of your frontend IP configuration. |
| IP version | Your options are **IPv4** and **IPv6**. </br> Load balancer supports both IPv4 and IPv6 frontend IP configurations. |
| IP type | IP type determines if a single IP address is associated with your frontend or a range of IP addresses using an IP Prefix. </br> A [public IP prefix](../virtual-network/ip-services/public-ip-address-prefix.md) assists when you need to connect to the same endpoint repeatedly. The prefix ensures enough ports are given to assist with SNAT port issues. |
| Public IP address (or Prefix if you selected prefix above) | Select or create a new public IP (or prefix) for your load balancer frontend. |

:::image type="content" source="./media/manage/frontend.png" alt-text="Create frontend ip configuration page." border="true":::

### Backend pools

A backend address pool contains the IP addresses of the virtual network interfaces in the backend pool. 

If you want to add a backend pool to your load balancer, go to your load balancer in the Azure portal, select **Backend pools**, and then select **+Add**.

| Setting | Details |
| ---------- |  ---------- |
| Name | The name of your backend pool. |
| Virtual network | The virtual network your backend instances are. |
| Backend Pool Configuration | Your options are: </br> **NIC** </br> **IP address** </br> NIC configures the backend pool to use the network interface card of the virtual machines. </br> IP address configures the backend pool to use the IP address of the virtual machines. </br> Learn more about [Backend pool management](backend-pool-management.md). |
| IP version | Your options are **IPv4** or **IPv6**. |

You can add virtual machines or Virtual Machine Scale Sets to the backend pool of your Azure Load Balancer. Create the virtual machines or Virtual Machine Scale Sets first. Next, add them to the load balancer in the portal.

:::image type="content" source="./media/manage/backend.png" alt-text="Create backend pool page." border="true":::

### Health probes

A health probe is used to monitor the status of your backend VMs or instances. The health probe status determines when new connections are sent to an instance based on health checks. 

If you want to add a health probe to your load balancer, go to your load balancer in the Azure portal, select **Health probes**, then select **+Add**.

| Setting | Details |
| ---------- | ---------- |
| Name | The name of your health probe. |
| Protocol | The protocol you select determines the type of check used to determine if the backend instance(s) are healthy. </br> Your options are: </br> **TCP** </br> **HTTPS** </br> **HTTP** </br> Ensure you're using the right protocol. This selection will depend on the nature of your application. </br> The configuration of the health probe and probe responses determines which backend pool instances will receive new flows. </br> You can use health probes to detect the failure of an application on a backend endpoint. </br> Learn more about [health probes](load-balancer-custom-probe-overview.md). |
| Port | The destination port for the health probe. </br> This setting is the port on the backend instance the health probe will use to determine the instance's health. |
| Interval | The number of seconds in between probe attempts. </br> The interval will determine how frequently the health probe will attempt to reach the backend instance. </br> If you select 5, the second probe attempt will be made after 5 seconds and so on. |
| Unhealthy threshold | The number of consecutive probe failures that must occur before a VM is considered unhealthy.</br> If you select 2, no new flows will be set to this backend instance after two consecutive failures. |

:::image type="content" source="./media/manage/health-probe.png" alt-text="Screenshot of create add health probe." border="true":::

### Load-balancing rules

Defines how incoming traffic is distributed to all the instances within the backend pool. A load-balancing rule maps a given frontend IP configuration and port to multiple backend IP addresses and ports.

If you want to add a load balancer rule to your load balancer, go to your load balancer in the Azure portal, select **Load-balancing rules**, and then select **+Add**.
    
| Setting | Details |
| ---------- | ---------- |
| Name | The name of the load balancer rule. |
| IP Version | Your options are **IPv4** or **IPv6**.  |
| Frontend IP address | Select the frontend IP address. </br> The frontend IP address of your load balancer you want the load balancer rule associated to.|
| Protocol | Azure Load Balancer is a layer 4 network load balancer. </br> Your options are: **TCP** or **UDP**. |
| Port | This setting is the port associated with the frontend IP that you want traffic to be distributed based on this load-balancing rule. |
| Backend port | This setting is the port on the instances in the backend pool you would like the load balancer to send traffic to. This setting can be the same as the frontend port or different if you need the flexibility for your application. |
| Backend pool | The backend pool you would like this load balancer rule to be applied on. |
| Health probe | The health probe you created to check the status of the instances in the backend pool. </br> Only healthy instances will receive new traffic. |
| Session persistence |  Your options are: </br> **None** </br> **Client IP** </br> **Client IP and protocol**</br> </br> Maintain traffic from a client to the same virtual machine in the backend pool. This traffic will be maintained during the session. </br> **None** specifies that successive requests from the same client may be handled by any virtual machine. </br> **Client IP** specifies that successive requests from the same client IP address will be handled by the same virtual machine. </br> **Client IP and protocol** ensure that successive requests from the same client IP address and protocol will be handled by the same virtual machine. </br> Learn more about [distribution modes](load-balancer-distribution-mode.md). |
| Idle timeout (minutes) | Keep a **TCP** or **HTTP** connection open without relying on clients to send keep-alive messages |  
| TCP reset | Load balancer can send **TCP resets** to help create a more predictable application behavior on when the connection is idle. </br> Learn more about [TCP reset](load-balancer-tcp-reset.md)|
| Floating IP | Floating IP is Azure's terminology for a portion of what is known as **Direct Server Return (DSR)**. </br> DSR consists of two parts: <br> 1. Flow topology </br> 2. An IP address-mapping scheme at a platform level. </br></br> Azure Load Balancer always operates in a DSR flow topology whether floating IP is enabled or not. </br> This operation means that the outbound part of a flow is always correctly rewritten to flow directly back to the origin. </br> Without floating IP, Azure exposes a traditional load-balancing IP address-mapping scheme, the VM instances' IP. </br> Enabling floating IP changes the IP address mapping to the frontend IP of the load Balancer to allow for more flexibility. </br> For more information, see [Multiple frontends for Azure Load Balancer](load-balancer-multivip-overview.md).|
| Outbound source network address translation (SNAT) | Your options are: </br> **(Recommended) Use outbound rules to provide backend pool members access to the internet.** </br> **Use implicit outbound rule. This is not recommended because it can cause SNAT port exhaustion.** </br> Select the **Recommended** option to prevent SNAT port exhaustion. A **NAT gateway** or **Outbound rules** are required to provide SNAT for the backend pool members. For more information on **NAT gateway**, see [What is Virtual Network NAT?](../virtual-network/nat-gateway/nat-overview.md). </br> For more information on outbound connections in Azure, see [Using Source Network Address Translation (SNAT) for outbound connections](load-balancer-outbound-connections.md). |

:::image type="content" source="./media/manage/load-balancing-rule.png" alt-text="Screenshot of add load-balancing rule." border="true":::

### Inbound NAT rules

An inbound NAT rule forwards incoming traffic sent to frontend IP address and port combination. 

The traffic is sent to a specific virtual machine or instance in the backend pool. Port forwarding is done by the same hash-based distribution as load balancing.

If your scenario requires Remote Desktop Protocol (RDP) or Secure Shell (SSH) sessions to separate VM instances in a backend pool. Multiple internal endpoints can be mapped to ports on the same frontend IP address. 

The frontend IP addresses can be used to remotely administer your VMs without an extra jump box.

If you want to add an inbound nat rule to your load balancer, go to your load balancer in the Azure portal, select **Inbound NAT rules**, and then select **+Add**.

| Setting | Details |
| ---------- | ---------- |
| Name | The name of your inbound NAT rule |
| Frontend IP address | Select the frontend IP address. </br> The frontend IP address of your load balancer you want the inbound NAT rule associated to. |
| IP Version | Your options are **IPv4** and **IPv6**. |
| Service | The type of service you'll be running on Azure Load Balancer. </br> A selection here will update the port information appropriately. |
| Protocol | Azure Load Balancer is a layer 4 network load balancer. </br> Your options are: TCP or UDP. |
| Idle timeout (minutes) | Keep a TCP or HTTP connection open without relying on clients to send keep-alive messages. |
| TCP Reset | Load Balancer can send TCP resets to help create a more predictable application behavior on when the connection is idle. </br> Learn more about [TCP reset](load-balancer-tcp-reset.md) |
| Port | This setting is the port associated with the frontend IP that you want traffic to be distributed based on this inbound NAT rule. |
| Target virtual machine | The virtual machine part of the backend pool you would like this rule to be associated to. |
| Port mapping | This setting can be default or custom based on your application preference. |

:::image type="content" source="./media/manage/inbound-nat-rule.png" alt-text="Screenshot of add inbound NAT rule." border="true":::

### Outbound rules

Load balancer outbound rules configure outbound SNAT for VMs in the backend pool.

If you want to add an outbound rule to your load balancer, go to your load balancer in the Azure portal, select **Outbound rules**, and then select **+Add**.

| Setting | Details |
| ------- | ------ |
| Name | The name of your outbound rule. |
| Frontend IP address | Select the frontend IP address. </br> The frontend IP address of your load balancer you want the outbound rule to be associated to. |
| Protocol | Azure Load Balancer is a layer 4 network load balancer. </br> Your options are: **All**, **TCP**, or **UDP**. |
| Idle timeout (minutes) | Keep a **TCP** or **HTTP** connection open without relying on clients to send keep-alive messages. |
| TCP Reset | Load balancer can send **TCP resets** to create a more predictable application behavior when the connection is idle. </br> Learn more about [TCP reset](load-balancer-tcp-reset.md) |
| Backend pool | The backend pool you would like this outbound rule to be applied on. |
| Port allocation | Your options are **Manually choose number of outbound ports** or **Use the default number of outbound ports**. </br> When you use default port allocation, Azure may drop existing connections when you scale out. Manually allocate ports to avoid dropped connections. |
| **Outbound Ports** |   |
| Choose by | Your options are **Ports per instance** or **Maximum number of backend instances**. </br> When you use default port allocation, Azure may drop existing connections when you scale out. Manually allocate ports to avoid dropped connections. |
| Ports per instance | Enter number of ports to be used per instance. This entry is only available when choosing **Ports per instance** for outbound ports above. |
| Available Frontend ports | Displayed value of total available frontend ports based on selected port allocation. |
| Maximum number of backend instances | Enter the maximum number of back end instances. This entry is only available when choosing **Maximum number of backend instances** for outbound ports above. </br> You can't scale your backend pool above this number of instances. Increasing the number of instances decreases the number of ports per instance unless you also add more frontend IP addresses. |

:::image type="content" source="./media/manage/outbound-rule.png" alt-text="Screehshot of add outbound rule." border="true":::

## Next Steps

In this article, you learned about the different terms and settings in the Azure portal for Azure Load Balancer.

* [Learn](./load-balancer-overview.md) more about Azure Load Balancer.
* [FAQs](./load-balancer-faqs.yml) for Azure Load Balancer.