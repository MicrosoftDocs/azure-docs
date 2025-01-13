
Azure Load Balancer Best Practices 

Design Considerations 

Last Updated: January 2025 

 

This article discusses a collection of Azure best practices for your load balancer deployment. These best practices are derived from our experience with Azure networking and the experiences of customers like yourself.  

For each best practice, this article explains: 

What the best practice is 

Why you want to enable that best practice 

What might happen if you fail to enable the best practice 

How you can learn to enable this best practice 

These best practices are based on a consensus opinion, and Azure platform capability and features sets, as they exist at the time this article was written. 

Architectural Guidance 

Reliability Best Practices 

Deploy with zone-redundancy. 

Zone-redundancy provides the best resiliency by protecting the data path from zone failure. The load balancer's availability zone selection is synonymous with its frontend IP's zone selection. For public load balancers, if the public IP in the load balancer's frontend is zone redundant then the load balancer is also zone-redundant. 

Deploy load balancer in a region that supports availability zones and enable Zone-redundant when creating a new Public IP address used for the Frontend IP configuration. 

Public IP addresses cannot be changed to zone redundant but we are updating all non-zonal Standard Public IPs to be zone redundant by default. For more information, visit the following Microsoft Azure Blog Azure Public IPs are now zone-redundant by default | Microsoft Azure Blog. To see the most updated list of regions that support zone redundant Standard Public IPs by default, please refer to Public IP addresses in Azure - Azure Virtual Network | Microsoft Learn.  

If you cannot deploy as zone-redundant, the next option is to have a zonal load balancer deployment.  

Zonal frontend is recommended when the backend is concentrated in a particular zone, but we recommend deploying backend pool members across multiple zones to benefit from zone redundancy. 

Refer to the following the doc if you want to migrate existing deployments to zonal or zone-redundant Migrate Load Balancer to availability zone support | Microsoft Learn. 

Zonal Frontend is recommended when the backend is concentrated in a particular zone, whereas zone redundant frontend is recommended when the resources inside a backend pool are distributed across zones.  
 

Redundancy in your backend pool. 

Ensure that the backend pool contains at least 2 instances  

Deploy a global load balancer.  

Standard Load Balancer supports cross-region load balancing enabling regional redundancy through linking a global load balancer to your existing regional load balancers. If you have a zone redundant deployment and that region fails, your deployment will be impacted. With a global load balancer, there will be no impact because the traffic would be routed to the next closest healthy regional load balancer. 

For more information, visit the Azure Load Balancer Reliability documentation. 

 

Use Gateway LB when using NVAs instead of a dual load balancer set-up. 

We recommend using a Gateway load balancer in north-south traffic scenarios with third-party Network Virtual Appliances (NVAs). It is easier to deploy because Gateway load balancers don’t require additional configuration such as UDRs because it maintains flow stickiness and flow symmetry. It is also easier to manage because NVAs can be easily added and removed. For more information, check out the Gateway Load Balancer documentation. 

Separate out to configuration guidance. For Gateway load balancer configuration best practices, review the following: 

Chain your Gateway load balancer to a Standard Public LB to get high availability/redundancy on both the NVA and application layer 

Separate your trusted and untrusted traffic on two different tunnel interfaces; use the tunnel interface type external for untrusted/not yet inspected or managed traffic, and use the tunnel interface type internal for trusted/inspected traffic. 

Ensure your NVAs MTU limit has been increased to at least 1550, or up to the recommended limit of 4000 in the case of any scenarios where jumboframes may be used 

Configuration Guidance 

Create NSGs 

Create Network Security Groups (NSGs) to explicitly permit allowed inbound traffic. NSGs must be created on the subnet or network interface card (NIC) of your VM, otherwise there will be no inbound connectivity to your Standard external load balancers. For more information, see Create, change, or delete an Azure network security group | Microsoft Learn 

Unblock 168.63.129.16 IP address  

Ensure 168.63.129.16 IP address is not blocked by any Azure network security groups and local firewall policies. This IP address enables health probes from Azure Load Balancer to determine the health state of the VM. If it is not allowed, the health probe fails as it is unable to reach your instance and it will mark your instance as down. For more information, visit Azure Load Balancer health probes | Microsoft Learn and What is IP address 168.63.129.16? | Microsoft Learn 

Use outbound rules with manual port allocation. 

Use outbound rules with manual port allocation instead of default port allocation to prevent SNAT exhaustion or connection failures. Default port allocation automatically assigns a conservative number of ports which can cause a higher risk of SNAT port exhaustion. Manual port allocation can help maximize the number of SNAT ports made available for each of the instances in your backend pool which can help prevent your connections from being impacted due to port reallocation.  

There are two options for manual port allocation, “ports per instance” or “maximum number of backend instances”. To understand the considerations of both, visit Source Network Address Translation (SNAT) for outbound connections - Azure Load Balancer | Microsoft Learn.  

Check your distribution mode 

Azure Load Balancer uses a 5-tuple hash based distribution mode by default and also offers session persistence using a 2-tuple or 3-tuple hash.  Consider whether your deployment could benefit from session persistence (also known as session affinity) where connections from the same client IP or same client IP and protocol go to the same backend instance within the backend pool. Also consider that enabling session affinity can cause uneven load distribution is majority of connections are coming from the same client IP or same client IP and protocol. 

For more information about Azure Load Balancers distribution modes, visit Azure Load Balancer distribution modes | Microsoft Learn. 

Enable TCP resets 

Enabling TCP resets on your Load Balancer sends bidirectional TCP resets packets to both client and server endpoints on idle timeout to inform your application endpoints that the connection timed out and is no longer usable. Without enabling TCP reset, the Load Balancer will silently drop flows when the idle timeout of a flow is reached.  

Increase idle timeouts / TCP keep-alives 

For more information on TCP resets and idle timeouts, visit Load Balancer TCP Reset and idle timeout in Azure - Azure Load Balancer | Microsoft Learn. 

 

Configure loop back interface when setting up floating IP. 

Azure Load Balancer Floating IP configuration | Microsoft Learn 

 

Retirement Announcements 

Use or upgrade to Standard Load Balancer. 

Basic Load Balancer will be retired September 30, 2025.  

 

Do not use default outbound access 
Do not use default outbound access and ensure all VMs have a defined explicit outbound method. This is recommended for better security and greater control over how your VMs connect to the internet. Default outbound access will retire September 30, 2025 and VMs created after this date must use one of the following outbound solutions to communicate to the internet: 

Associate a NAT GW to the subnet 

Use the frontend IP(s) of a Load Balancer for outbound via outbound rules 

Assign a public IP (aka instance level public IP address) to the VM  

 

 
