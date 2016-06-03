## Understand planned vs. unplanned maintenance
There are two types of Microsoft Azure platform events that can affect the availability of your virtual machines: planned maintenance and unplanned maintenance.

- **Planned maintenance events** are periodic updates made by Microsoft to the underlying Azure platform to improve overall reliability, performance, and security of the platform infrastructure that your virtual machines run on. The majority of these updates are performed without any impact upon your virtual machines or cloud services. However, there are instances where these updates require a reboot of your virtual machine to apply the required updates to the platform infrastructure.

- **Unplanned maintenance events** occur when the hardware or physical infrastructure underlying your virtual machine has faulted in some way. This may include local network failures, local disk failures, or other rack level failures. When such a failure is detected, the Azure platform will automatically migrate your virtual machine from the unhealthy physical machine hosting your virtual machine to a healthy physical machine. Such events are rare, but may also cause your virtual machine to reboot.

## Follow best practices when you design your application for high availability
To reduce the impact of downtime due to one or more of these events, we recommend the following high availability best practices for your virtual machines:

* [Configure multiple virtual machines in an availability set for redundancy]
* [Configure each application tier into separate availability sets]
* [Combine the Load Balancer with availability sets]


### Configure multiple virtual machines in an availability set for redundancy
To provide redundancy to your application, we recommend that you group two or more virtual machines in an availability set. This configuration ensures that during either a planned or unplanned maintenance event, at least one virtual machine will be available and meet the 99.95% Azure SLA. For more information, see the [SLA for Virtual Machines](https://azure.microsoft.com/support/legal/sla/virtual-machines/).

> [AZURE.IMPORTANT] Avoid leaving a single instance virtual machine in an availability set by itself. Virtual machines in this configuration do not qualify for a SLA guarantee and will face downtime during Azure planned maintenance events.

Each virtual machine in your availability set is assigned an **update domain** and a **fault domain** by the underlying Azure platform. For a given availability set, five non-user-configurable update domains are assigned by default (resource manager deployments can then be increased to provide up to twenty update domains) to indicate groups of virtual machines and underlying physical hardware that can be rebooted at the same time. When more than five virtual machines are configured within a single availability set, the sixth virtual machine will be placed into the same update domain as the first virtual machine, the seventh in the same update domain as the second virtual machine, and so on. The order of update domains being rebooted may not proceed sequentially during planned maintenance, but only one update domain will be rebooted at a time.

Fault domains define the group of virtual machines that share a common power source and network switch. By default, the virtual machines configured within your availability set are separated across up to three fault domains for resource manager deployments (two fault domains for Classic). While placing your virtual machines into an availability set does not protect your application from operating system or application-specific failures, it does limit the impact of potential physical hardware failures, network outages, or power interruptions.

<!--Image reference-->
   ![Conceptual drawing of the update domain and fault domain configuration](./media/virtual-machines-common-manage-availability/ud-fd-configuration.png)


### Configure each application tier into separate availability sets

If your virtual machines are all nearly identical and serve the same purpose for your application, we recommend that you configure an availability set for each tier of your application.  If you place two different tiers in the same availability set, all virtual machines in the same application tier can be rebooted at once. By configuring at least two virtual machines in an availability set for each tier, you guarantee that at least one virtual machine in each tier will be available.

For example, you could put all the virtual machines in the front-end of your application running IIS, Apache, Nginx, etc., in a single availability set. Make sure that only front-end virtual machines are placed in the same availability set. Similarly, make sure that only data-tier virtual machines are placed in their own availability set, like your replicated SQL Server virtual machines or your MySQL virtual machines.

<!--Image reference-->
   ![Application tiers](./media/virtual-machines-common-manage-availability/application-tiers.png)


### Combine a load balancer with availability sets
Combine the [Azure Load Balancer](../articles/load-balancer/load-balancer-overview.md) with an availability set to get the most application resiliency. The Azure Load Balancer distributes traffic between multiple virtual machines. For our Standard tier virtual machines, the Azure Load Balancer is included. Note that not all virtual machine tiers include the Azure Load Balancer. For more information about load balancing your virtual machines, see [Load Balancing virtual machines](../articles/virtual-machines/virtual-machines-linux-load-balance.md).

If the load balancer is not configured to balance traffic across multiple virtual machines, then any planned maintenance event will affect the only traffic-serving virtual machine, causing an outage to your application tier. Placing multiple virtual machines of the same tier under the same load balancer and availability set enables traffic to be continuously served by at least one instance.

 

<!-- Link references -->
[Configure multiple virtual machines in an availability set for redundancy]: #configure-multiple-virtual-machines-in-an-availability-set-for-redundancy
[Configure each application tier into separate availability sets]: #configure-each-application-tier-into-separate-availability-sets
[Combine the Load Balancer with availability sets]: #combine-the-load-balancer-with-availability-sets
[Avoid single instance virtual machines in availability sets]: #avoid-single-instance-virtual-machines-in-availability-sets

