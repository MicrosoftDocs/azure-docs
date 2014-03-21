#Azure Networking

The easiest way to connect to Azure applications and data is through an ordinary Internet connection. But this simple solution isn't always the best approach. Azure also provides technologies for connecting users to Azure datacenters.  This article takes a look at these technologies. 

##Table of Contents      
- [Azure Virtual Network](#Vnet)
- [Azure Traffic Manager](#TrafficMngr)

<a name="Vnet"></a>
##Azure Virtual Network

Azure lets you create virtual machines (VMs) that run in Microsoft datacenters. Suppose your organization wants to use those VMs to run enterprise applications or other software that will be used by the employees in your firm. Maybe you want to create a SharePoint farm in the cloud, for example, or run an inventory management application. To make life as easy as possible for your users, you would like these applications to be accessible just as if they were running in your own datacenter.

There is a standard solution to this kind of problem: create a virtual private network (VPN). Organizations of all sizes do this today to link, say, branch office computers to the main company datacenter. This same approach can work with Azure VMs, as Figure 1 shows.

<a name="Fig1"></a>
  
![01_Networking][01_Networking]

**Figure 1: Azure Virtual Network allows creating a virtual network in the cloud that is connected to your on-premises datacenter.**

As the figure shows, Azure Virtual Network lets you create a logical boundary around a group of VMs, called a *virtual network or VNET*, in an Azure datacenter. It then lets you establish an IPsec connection between this VNET and your local network.  The VMs in a VNET can be created using Azure Virtual Machines, Azure Cloud Services, or both. In other words, they can be VMs created using either the Azure Infrastructure as a Service (IaaS) technology or its Platform as a Service (PaaS) technology.
Whatever choice you make, creating the IPsec connection requires a VPN gateway device, specialized hardware that is attached to your local network, and it also requires the services of your network administrator. Once this connection is in place, the Azure VMs running in your VNET look like just another part of the network in your organization.

As [Figure 1](#Fig1) suggests, you allocate IP addresses for the Azure VMs from the same IP address space used in your own network. In the scenario shown here, which uses private IP addresses, the VMs in the cloud are just another IP subnet. Software running on your local network will see these VMs as if they were local, just as they do with traditional VPNs. And it is important to note that because this connection happens at the IP level, the virtual and physical machines on both sides can be running any operating system. Azure VMs running Windows Server or Linux can interact with on-premises machines running Windows, Linux, or other systems. It is also possible to use mainstream management tools, including System Center and others, to manage the cloud VMs and the applications they contain.

Using Azure Virtual Network makes sense in many situations. As already mentioned, this approach lets enterprise users more easily access cloud applications. An important aspect of this ease of use is the ability to make the Azure VMs part of an existing on-premises Active Directory domain to give users single sign-on to the applications they run. You can also create an Active Directory domain in the cloud if you prefer, then connect this domain to your on-premises network.

Creating a VNET in an Azure datacenter effectively gives you access to a large pool of on-demand resources. You can create VMs on demand, pay for them while they are running, then remove them (and stop paying) when you no longer need them. This can be useful for scenarios that need fast access to a preconfigured machine, such as development teams building new software. Rather than wait for a local administrator to set up the resources they need, they can create these resources themselves in the public cloud. 

And just as Virtual Network makes Azure VMs appear local to on-premises resources, the reverse is also true: Software running in your local network now appears to be local to applications running in your Azure VNET. Suppose you would like to move an existing on-premises application to Azure, for example, because you have determined that it will be less expensive to operate in the cloud. But what if the data that application uses is required by law to be stored on premises? In a situation like this, using Virtual Network lets the cloud application see an on-premises database system as if it were local, and accessing it becomes straightforward. Whatever scenario you choose, the result is the same: Azure becomes an extension of your own datacenter.

<a name="TrafficMngr"></a>
##Azure Traffic Manager

Imagine that you have built a successful Azure application. Your application is used by many people in many countries around the world. This is a great thing, but as is so often the case, success brings new problems. For instance, your application most likely runs in multiple Azure datacenters in different parts of the world. How can you intelligently direct user request traffic across these datacenters so that your users always get the best experience?

Azure Traffic Manager is designed to solve this problem. Figure 2 shows how.

<a name="Fig3"></a>
   
![03_TrafficManager][03_TrafficManager]
   
**Figure 2: Azure Traffic Manager intelligently directs requests from users across instances of an application running in different Azure datacenters.**

In this example, your application is running in VMs spread across four datacenters: two in the US, one in Europe, and one in Asia. Suppose a user in Berlin wishes to access the application. If you are using Traffic Manager, here is what happens.

As usual, the user system looks up the DNS name of the application (Step 1). This query is directed to the Azure DNS system (Step 2), which then looks up the Traffic Manager policy for the application. Each policy is created by the owner of a particular Azure application, either through a graphical interface or a REST API. However it is created, the policy specifies one of three load balancing options:

- **Performance:** All requests are sent to the datacenter with the lowest latency from the user system. 
- **Failover:** All requests are sent to the datacenter specified by the creator of this policy, unless that datacenter is unavailable. In this case, requests are directed to other datacenters in the priority order defined by the creator of the policy.
- **Round Robin:** All requests are spread equally across all datacenters in which the application is running.

Once it has the right policy, Traffic Manager figures out which datacenter this request should go to based on which of the three options is specified (Step 3). It then returns the location of the chosen datacenter to the user (Step 4), who accesses that instance of the application (Step 5).

For this to work, Traffic Manager must have a current picture of which instances of the application are up and running in each datacenter. To make this possible, Traffic Manager periodically pings each copy of the application via an HTTP GET, then records whether it receives a response. If an application instance stops responding, Traffic Manager will stop directing users to that instance until it resumes responding to pings. 

Not every application is big enough or global enough to need Traffic Manager. For those that do, however, this can be a very useful service.

[01_Networking]: ./media/azure-networking/Networking_01Networking.png
[03_TrafficManager]: ./media/azure-networking/Networking_03TrafficManager.png



