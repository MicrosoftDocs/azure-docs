---
title: Frequently asked questions
description: Provides answers to some of the common questions about Azure VMware Solution (AVS).
ms.topic: conceptual
ms.date:  05/04/2020
ms.author: dikamath
---

# Frequently asked questions about Azure VMware Solution (AVS) preview

Answers for frequently asked questions about Azure VMware Solution (AVS).

## General

**What is Azure VMware Solution (AVS)?**

As enterprises pursue IT modernization strategies to improve business agility, reduce costs, and accelerate innovation, hybrid cloud platforms have emerged as key enablers of customers’ digital transformation. AVS combines VMware’s Software Defined Data Center (SDDC) software with Microsoft Azure global cloud service ecosystem. The AVS solution is managed to meet performance, availability, security, and compliance requirements.

## AVS Service

**Where is AVS available today?**

During the preview, it's available in US East in North America and in Amsterdam in Western Europe.

**Can workloads running in an Azure VMware Solution (AVS) instance consume or integrate with Azure services?**

All Azure services will be available to AVS solution customers. Performance and availability limitations for specific services will need to be addressed on a case-by-case basis.

**Do I use the same tools that I use now to manage private cloud resources?**

Yes. The Azure portal is used for deployment and a number of management operations. vCenter and NSX Manager are used to manage vSphere and NSX-T resources.

**Can I manage a private cloud with my on-premises vCenter?**

At launch, AVS won't support a single management experience across on-premises and private cloud environments. Private cloud clusters will be managed with vCenter and NSX Manager local to a private cloud.

**Can I use vRealize Suite running on-premises?** 

Specific integrations and use cases may be evaluated on a case-by-case
basis.

**Can I migrate vSphere VMs from on-premises environments to AVS private clouds?**

Yes. VM migration and vMotion can be used to move VMs to a private cloud if standard cross vCenter [vMotion requirements][https://kb.vmware.com/s/article/210695] are met.

**Is a specific version of vSphere required in on-premises environments?**

Since all cloud environments come with HCX, vSphere 5.5 or later in
on-premises environments for vMotion.

**What does the change control process look like?**

Updates made to the service itself will follow Microsoft Azure’s standard change management process. Customers are responsible for any workload administration tasks and the associated change management processes.

**How is this different from Azure VMware Solution by CloudSimple?**

With the new Azure VMware Solution, Microsoft and VMware have a direct cloud provider partnership. The new solution is entirely designed, built and supported by Microsoft, and endorsed by VMware. Architecturally, the solutions are consistent, with the VMware technology stack running on an Azure dedicated infrastructure.

**If I'm an existing Azure VMware Solution customer, what does this preview mean for me?**

There is no change to the existing Azure VMware Solution by CloudSimple. We continue to support the solution on Azure. Azure VMware Solution is backed by our service level agreement [(SLA)](https://aka.ms/CSVMwareSLA). Customers should continue to use the service for production workloads; this is an available solution governed by [Microsoft’s service terms](https://azure.microsoft.com/support/legal/).

**Can I migrate from Azure VMware Solution by CloudSimple to this new solution?**

Yes, Azure VMware Solution supports migration using familiar VMware tools such as HCX. For customers interested in migrating to the new solution, please work with your Microsoft account team to explore options and available support.



## Compute, network, and storage

**Is there more than one type of host available?**

There is only one type of host available.

**What are the CPU specifications in each type of host?**

The servers have dual 18 core 2.3 GHz Intel CPUs.

**How much memory is in each host?**

The servers have 576 GB of RAM.

**What is the storage capacity of each host?**

Each ESXi host has two VSAN diskgroups with a capacity tier of 15.2 TB and a 3.2 TB NVMe cache tier (1.6 TB in each diskgroup).

**How much network bandwidth is available in each ESXi host?**

ESXi hosts support connectivity bandwidth up to 25 Gbps.

**Is data stored on the VSAN datastores encrypted at rest?**

Yes, all VSAN data is encrypted by default using keys stored in Azure Key Vault.

## Hosts, clusters, and private clouds

**Is the underlying infrastructure shared?**

No, private cloud hosts and clusters are dedicated and securely erased before and after use.

**What are the minimum and maximum number of hosts per cluster?**

Clusters can scale between 3 and 16 ESXi hosts. Trial clusters are limited to three hosts.

**Can I scale my private cloud clusters?**

Yes, clusters scale between the minimum and maximum number of ESXi hosts. Trial clusters are limited to three hosts.

**What are trial clusters?**

Trial clusters are three host clusters used for one month evaluations of AVS private clouds.

**Can I use High-end hosts for trial clusters?**

No. High-end ESXi hosts are reserved for use in production clusters.

## AVS and VMware software

**What versions of VMware software is used in private clouds?**

Private clouds use vSphere 6.7, vSAN 6.7, HCX, and version 2.5 of NSX-T.  

**Do private clouds use VMware NSX?**

Yes, NSX-T 2.5 is used for the software defined networking in AVS private clouds.

**Can I use VMware NSX-V in a private cloud?**

No. NSX-T is the only supported version of NSX.

**Is NSX required in on-premises environments or networks that connect to a private cloud.**

No, you aren't required to use NSX on-premises.

**What is the upgrade and update schedule for VMware software in a private cloud?**

The private cloud software bundle upgrades are done to keep the software within one version of the most recent release of the software bundle from VMware. The private cloud software versions may be different than the most recent versions of the individual software components (ESXi, NSX-T, vCenter, VSAN).

**How often will the private cloud software stack be updated?**

The private cloud software is upgraded on a schedule that tracks with the release of the software bundle from VMware. Your private cloud doesn't require downtime for upgrades.

## Connectivity

**What network IP address planning is required to incorporate private clouds with on-premises environments?**

A private network /22 address space is required to deploy an AVS private cloud. This private address space shouldn't overlap with other virtual networks in a subscription, or with on-premises networks.
 
**How do I connect from on-premises environments to an AVS private cloud?**

You can connect to the service in one of two methods: 

- With a VM or application gateway deployed on an Azure virtual network that is peered through ExpressRoute to the private cloud.
- Through ExpressRoute Global Reach from your on-premises datacenter to an Azure ExpressRoute circuit.

**How do I connect a workload VM to the internet or an Azure service endpoint?**

In the Azure portal, enable internet connectivity for a private cloud. With NSX-T manager, create an NSX-T T1 router and a logical switch. You then use vCenter to deploy a VM on the network segment defined by the logical switch. That VM will have network access to the internet and to Azure services.

**Do I need to restrict access from the internet to VMs on logical networks in a private cloud?**

No. Network traffic inbound from the internet directly to private clouds isn't allowed.

**Do I need to restrict internet access from VMs on logical networks to the internet?**

Yes. You'll need to use NSX-T manager to create a firewall that restricts VM access to the internet.

## Accounts and privileges

**What accounts and privileges will I get with my new AVS private cloud?**

You're provided credentials for a cloudadmin user in vCenter and admin access on NSX-T Manager. There's also a CloudAdmin group that can be used to incorporate Azure Active Directory. For more information, see [Access and Identity Concepts](concepts-identity.md).

**Can have administrator access to ESXi hosts?**

No, administrator access to ESXi is restricted to meet the security requirements of the solution.

**What privileges and permissions will I have in vCenter?**

You'll have CloudAdmin group privileges. For more information, see [Access and Identity Concepts](concepts-identity.md).

**What privileges and permissions will I have on the NSX-T manager?**

You'll have full administrator privileges on NSX-T and can manage role-based access control as you would with NSX-T Data Center on-premises. For more information, see [Access and Identity Concepts](concepts-identity.md).

> [!NOTE]
> A T0 router is created and configured as part of a private cloud deployment. Any modification to that logical router or the NSX-T edge node VMs could affect connectivity to your private cloud.

## Billing and Support

**How will I be billed during the preview of AVS**

Billing for AVS during preview is monthly on a pay-as-you-go basis. Additional options will be available at general availability.

**How will pricing be structured during the preview of AVS?**

For general questions on pricing see the Azure VMware Solution [pricing](https://azure.microsoft.com/pricing/details/azure-vmware) page. Preview pricing is available on request, please contact your account team or follow the link on the pricing page to contact sales.

**Who supports AVS?**

Support for AVS is delivered by Microsoft. Please note, per our preview guidelines, we will provide support during 9 to 5 pm PST business hours Monday thru Friday. You can raise a Support ticket from [this link](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest)

**What accounts do I need to create an AVS private cloud?**

You'll need an Azure account in an Azure subscription.

<a name="how-to-request-a-quota-increase-for-avs"></a>**How do I request a host quota increase for Azure VMware Solution?**

You can request a quota increase by [submitting a support request](..\azure-portal\supportability\how-to-create-azure-support-request.md). The Quota Management team evaluates the request and approves it within three business days.  

> [!IMPORTANT]
> Before you can request a quota increase, make sure that you register the **Microsoft.AVS** resource provider in the Azure portal.  
> ```azurecli-interactive
> az provider register -n Microsoft.AVS --subscription <your subscription ID>
> ```
> For additional ways to register the resource provider, see [Azure resource providers and types](https://docs.microsoft.com/azure/azure-resource-manager/management/resource-providers-and-types).

1. In your Azure portal, under **Help + Support**, create a **New support request** and provide the following information for the ticket:
   - **Issue type:** Technical
   - **Subscription:** Your subscription ID
   - **Service:**  Azure VMware Solution 
   - **Summary:** Quota increase
   - **Problem type:** Capacity Management Issues
   - **Problem subtype:** Customer Request for Additional Host Quota/Capacity

1. In the Description of the support ticket, on the Details tab, provide the:
   - Number of additional nodes   
   - Node SKU
   - Region

   > [!NOTE] 
   > By default, a minimum of four nodes will be granted.

1. Click **Review + Create** to submit the request.

<!-- LINKS - external -->
[kb2106952]: https://kb.vmware.com/s/article/2106952

<!-- LINKS - internal -->
[Access and Identity Concepts]: concepts-identity.md
