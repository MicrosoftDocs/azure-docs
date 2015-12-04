It is important to realize that there are two ways to configure an Availability Group listener in Azure. These methods differ in the type of Azure load balancer you use when you create the listener. The following table describes the differences:

| Load Balancer | Implementation | Use When: |
| ------------- | -------------- | ----------- |
| **External** | Uses the **public Virtual IP address** of the cloud service that hosts the Virtual Machines. | You need to access the listener from outside the virtual network, including from the internet. |
| **Internal** | Uses **Internal Load Balancing (ILB)** with a private address for the listener. | You only access the listener from within the same virtual network. This includes site-to-site VPN in hybrid scenarios. |

>[AZURE.IMPORTANT] For a listener using the cloud service's public VIP (external load balancer), any data returned through the listener is considered egress and charged at normal data transfer rates in Azure. This is true even if the client is located in the same virtual network and datacenter as the listener and databases. This is not the case with a listener using ILB.

ILB can only be configured on virtual networks with a regional scope. Existing virtual networks that have been configured for an affinity group cannot use ILB. For more information, see [Internal Load Balancer](../articles/load-balancer/load-balancer-internal-overview.md).
