<properties 
 pageTitle="Sizes for cloud services" 
 description="Lists the different sizes for web and worker roles." 
 services="cloud-services" 
 documentationCenter="" 
 authors="Thraka" 
 manager="timlt" 
 editor=""/>
<tags 
 ms.service="cloud-services" 
 ms.devlang="na" 
 ms.topic="article" 
 ms.tgt_pltfrm="na" 
 ms.workload="tbd"
 ms.date="05/20/2015" 
 ms.author="adegeo"/>
 
#Sizes for cloud services

##Overview
This topic describes the available sizes and options for the virtual machine-based compute resources you can use to run your apps and workloads. These resources are available to you as Azure Virtual Machines (sometimes called “IaaS virtual machines” or “persistent virtual machines”), and Cloud Service role instances (web roles and worker roles). This topic also provides deployment considerations to be aware of when planning to use these resources.

Azure Virtual Machines and Cloud Services are two of several types of compute resources offered by Azure. For explanations, see [Compute Hosting Options Provided by Azure](http://go.microsoft.com/fwlink/p/?LinkID=311926).

>[AZURE.NOTE]To see related Azure limits, see [Azure Subscription and Service Limits, Quotas, and Constraints](azure-subscription-service-limits.md)

###Sizes for Web and Worker Role Instances

The following considerations might help you decide on a size:

*   Instances can now be configured to use a D-series VM. These are designed to run applications that demand higher compute power and temporary disk performance. D-series VMs provide faster processors, a higher memory-to-core ratio, and a solid-state drive (SSD) for the temporary disk. For details, see the announcement on the Azure blog, [New D-Series Virtual Machine Sizes](http://azure.microsoft.com/blog/2014/09/22/new-d-series-virtual-machine-sizes/).  

*   Web roles and worker roles require more temporary disk space than Azure Virtual Machines because of system requirements. The system files reserve 4 GB of space for the Windows page file, and 2 GB of space for the Windows dump file.  

*   The OS disk contains the Windows guest OS and includes the Program Files folder (including installations done via startup tasks unless you specify another disk), registry changes, the System32 folder, and the .NET framework.  

*   The local resource disk contains Azure logs and configuration files, Azure Diagnostics (which includes your IIS logs), and any local storage resources you define.  

*   The apps (application) disk is where your .cspkg is extracted and includes your website, binaries, role host process, startup tasks, web.config, and so on.  

*   The A8/A10 and A9/A11 virtual machine sizes have the same capacities. The A8 and A9 virtual machine instances include an additional network adapter that is connected to a remote direct memory access (RDMA) network for fast communication between virtual machines. The A8 and A9 instances are designed for high-performance computing applications that require constant and low-latency communication between nodes during execution, for example, applications that use the Message Passing Interface (MPI). The A10 and A11 virtual machine instances do not include the additional network adapter. A10 and A11 instances are designed for high-performance computing applications that do not require constant and low-latency communication between nodes, also known as parametric or embarrassingly parallel applications.  

|Size|CPU<br>cores|Memory|Disk sizes|
|---|---|---|---|
|ExtraSmall|1|768 MB|<p>OS = Guest OS size</p><p>Local resource = 19 GB</p><p>Apps = approx. 1.5 GB</p>|
|Small|1|1.75 GB|<p>OS = Guest OS size</p><p>Local resource = 224 GB</p><p>Apps = approx. 1.5 GB</p>|
|Medium|2|3.5 GB|<p>OS = Guest OS size</p><p>Local resource = 489 GB</p><p>Apps = approx. 1.5 GB</p>|
|Large|4|7 GB|<p>OS = Guest OS size</p><p>Local resource = 999 GB</p><p>Apps = approx. 1.5 GB</p>|
|ExtraLarge|8|14 GB|<p>OS = Guest OS size</p><p>Local resource = 2,039 GB</p><p>Apps = approx. 1.5 GB</p>|
|A5|2|14 GB|<p>OS = Guest OS size</p><p>Local resource = 489 GB</p><p>Apps = approx. 1.5 GB</p>|
|A6|4|28 GB|<p>OS = Guest OS size</p><p>Local resource = 999 GB</p><p>Apps = approx. 1.5 GB</p>|
|A7|8|56 GB|<p>OS = Guest OS size</p><p>Local resource = 2,039 GB</p><p>Apps = approx. 1.5 GB</p>
|A8|8|56 GB|<p>OS = Guest OS size</p><p>Local resource = 1.77 TB</p><p>Apps = approx. 1.5 GB</p><blockquote><p>[AZURE.NOTE]For information and considerations about using this size, see <a href="http://go.microsoft.com/fwlink/p/?linkid=328042">About the A8, A9, A10, and A11 Compute Intensive Instances</a>.</p></blockquote>|
|A9|16|<p>112 GB|<p>OS = Guest OS size</p><p>Local resource = 1.77 TB</p><p>Apps = approx. 1.5 GB</p><blockquote><p>[AZURE.NOTE]For information and considerations about using this size, see <a href="http://go.microsoft.com/fwlink/p/?linkid=328042">About the A8, A9, A10, and A11 Compute Intensive Instances</a>.</p></blockquote>|
|A10|8|<p>56 GB|<p>OS = Guest OS size</p><p>Local resource = 1.77 TB</p><p>Apps = approx. 1.5 GB</p><blockquote><p>[AZURE.NOTE]For information and considerations about using this size, see <a href="http://go.microsoft.com/fwlink/p/?linkid=328042">About the A8, A9, A10, and A11 Compute Intensive Instances</a>.</p></blockquote>|
|A11|16|<p>112 GB|<p>OS = Guest OS size</p><p>Local resource = 1.77 TB</p><p>Apps = approx. 1.5 GB</p><blockquote><p>[AZURE.NOTE]For information and considerations about using this size, see <a href="http://go.microsoft.com/fwlink/p/?linkid=328042">About the A8, A9, A10, and A11 Compute Intensive Instances</a>.</p></blockquote>|
|Standard_D1|1|3.5 GB|<p>OS = Guest OS size</p><p>Local resource = 50 GB</p><p>Apps = approx. 1.5 GB</p>|
|Standard_D2|2|7 GB|<p>OS = Guest OS size</p><p>Local resource = 100 GB</p><p>Apps = approx. 1.5 GB</p>|
|Standard_D3|4|14 GB|<p>OS = Guest OS size</p><p>Local resource = 200 GB</p><p>Apps = approx. 1.5 GB</p>|
|Standard_D4|8|28 GB|<p>OS = Guest OS size</p><p>Local resource = 400 GB</p><p>Apps = approx. 1.5 GB</p>|
|Standard_D11|2|14 GB|<p>OS = Guest OS size</p><p>Local resource = 100 GB</p><p>Apps = approx. 1.5 GB</p>|
|Standard_D12|4|28 GB|<p>OS = Guest OS size</p><p>Local resource = 200 GB</p><p>Apps = approx. 1.5 GB</p>|
|Standard_D13|8|56 GB|<p>OS = Guest OS size</p><p>Local resource = 400 GB</p><p>Apps = approx. 1.5 GB</p>|
|Standard_D14|16|112 GB|<p>OS = Guest OS size</p><p>Local resource = 800 GB</p><p>Apps = approx. 1.5 GB</p>|

### See Also

#### Concepts

[Set Up a Cloud Service for Azure](https://msdn.microsoft.com/library/hh124108)  
 [Configure Sizes for Cloud Services](https://msdn.microsoft.com/library/ee814754)

#### Other Resources

[Azure Subscription and Service Limits, Quotas, and Constraints](azure-subscription-service-limits.md)  
 [About the A8, A9, A10, and A11 Compute Intensive Instances](http://go.microsoft.com/fwlink/p/?linkid=328042)
