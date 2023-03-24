---
title: VMware HCX Mobility Optimized Networking (MON) guidance
description: Learn about Azure VMware Solution-specific use cases for Mobility Optimized Networking (MON).  
ms.topic: reference
ms.service: azure-vmware
ms.date: 3/24/2023
---

# VMware HCX Mobility Optimized Networking (MON) guidance

>[!NOTE]
>
> VMware HCX Mobility Optimized Networking is officially supported by VMware and Azure VMware Solutions from HCX version 4.1.0. 

>[!IMPORTANT] 
>
>Before you enable HCX MON, please read the below limitations and unsupported configurations:
>
>[Unsupported source configurations for HCX NE](https://docs.vmware.com/en/VMware-HCX/4.2/hcx-user-guide/GUID-DBDB4D1B-60B6-4D16-936B-4AC632606909.html)
> 
>[Limitations for any HCX deployment including MON](https://docs.vmware.com/en/VMware-HCX/4.2/hcx-user-guide/GUID-BEC26054-D560-46D0-98B4-7FF09501F801.html)
>
>VMware HCX Mobility Optimized Networking (MON) is not supported with the use of a 3rd party gateway. It may only be used with the T1 gateway directly connected to the T0 gateway with no network virtual appliance (NVA). You may be able to make this configuration function, but we do not support it. 

[HCX Mobility Optimized Networking (MON)](https://docs.vmware.com/en/VMware-HCX/4.2/hcx-user-guide/GUID-0E254D74-60A9-479C-825D-F373C41F40BC.html) is an optional feature to enable when using [HCX Network Extensions (NE)](configure-hcx-network-extension.md). MON provides optimal traffic routing under certain scenarios to prevent network tromboning between the on-premises and cloud-based resources on extended networks. 

As MON is an enterprise capability of the NE feature, make sure you've enabled the [VMware HCX Enterprise](https://cloud.vmware.com/community/2019/08/08/introducing-hcx-enterprise/) add-on through a [support request](https://portal.azure.com/#create/Microsoft.Support). 

Throughout the migration cycle, MON optimizes application mobility for:

- Optimizing for virtual machine (VM) to VM L2 communication when using stretched networks 

- Optimizing and avoiding asymmetric traffic flows between on-premises, Azure VMware Solution, and Azure

In this article, you'll learn about the Azure VMware Solution-specific use cases for MON.

## Optimize traffic flows across standard and stretched segments on the private cloud side 

In this scenario, VM1 is migrated to the cloud using the NE, which provides optimal VM to VM latency. As a result, VM1 needs low latency to VM3 on the local Azure VMware Solution segment. We migrate the VM1 gateway from on-premises to Azure VMware Solution (cloud) to ensure an optimal path for traffic (blue line). If the gateway remains on-premises (red line), a tromboning effect and higher latency are observed. 

>[!NOTE]
>When you enable MON without migrating the VM gateway to the cloud side, it doesn't ensure an optimal path for traffic flow.  It also doesn't allow the evaluation of policy routes.

:::image type="content" source="media/tutorial-vmware-hcx/hcx-mon-user-case-diagram-1.png" alt-text="Diagram showing the optimization for VM to VM L2 communication when using stretched networks." border="false":::

## Optimize and avoid asymmetric traffic flows 

In this scenario, we assume a VM from on-premises has been migrated to Azure VMware Solution and participates in L2, and L3 traffic flows back to on-premises to access services. We also assume some VM communication from Azure (in the Azure VMware Solution connected vNET) could reach down into the Azure VMware Solution private cloud.

>[!IMPORTANT]
>The main point here is to plan and avoid asymmetric traffic flows carefully. 

By default and without using MON, a VM in Azure VMware Solution on a stretched network without MON can communicate back to on-premises using the ExpressRoute preferred path. Ideally, and based on customers use case one should evaluate how a VM on an Azure VMware Solution stretched segment enabled with MON should be traversing back to on-premises either over the NE or the T0 gateway via the ExpressRoute, but keeping traffic flows symmetric.

If choosing the NE path for example, the MON policy routes have to specifically address the subnet on the on-premises side; otherwise, the 0.0.0.0/0 default route is used. Policy routes can be found under the NE segment, selecting advanced. By default, all RFC1918 IP addresses are included in the MON policy routes definition. 

:::image type="content" source="media/tutorial-vmware-hcx/default-hcx-mon-policy-based-routes.png" alt-text="Screenshot showing the default policy-based routes.":::

Policy routes are evaluated only if the VM gateway is migrated to the cloud. The effect of this configuration is that any matching subnets for the destination get tunneled over the NE appliance.  If not matched, they get routed through the T0 gateway.

>[!NOTE]
>Special consideration for using MON in Azure VMware Solution is to give the /32 routes advertised over BGP to its peers; this includes on-premises and Azure over the ExpressRoute connection. For example, a VM in Azure learns the path to an Azure VMware Solution VM on an Azure VMware Solution MON enabled segment. Once the return traffic is sent back to the T0 gateway as expected, if the return subnet is an RFC1918 match, traffic is forced over the NE instead of the T0. Then egresses over the ExpressRoute back to Azure on the on-premises side. This can cause confusion for stateful firewalls in the middle and asymmetric routing behavior. It's also a good idea to determine how VMs on NE MON segments will need to access the internet, either via the T0 in Azure VMware Solution or only through the NE back to on-premises. In general, all of the default policy routes should be removed to avoid asymmetric traffic. Only enable policy routes if the network infrastructure as been configured in such a way to account for and prevent asymmetric traffic.

:::image type="content" source="media/tutorial-vmware-hcx/hcx-mon-user-case-diagram-3.png" alt-text="Diagram showing the RFC1918 egress and egress traffic flow." border="false":::

As outlined in the above diagram, the importance is to match a policy route to each required subnet. Otherwise, the traffic gets routed over the T0 and not the NE.

To learn more about policy routes, see [Mobility Optimized Networking Policy Routes](https://docs.vmware.com/en/VMware-HCX/4.1/hcx-user-guide/GUID-F45B1DB5-C640-4A75-AEC5-45C58B1C9D63.html).
