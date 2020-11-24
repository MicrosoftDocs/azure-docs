---
title: Classroom labs in Azure Lab Services — FAQ | Microsoft Docs
description: This article provides answers to frequently asked questions (FAQ) about classroom labs in Azure Lab Services.
ms.topic: article
ms.date: 06/26/2020
---

# Classroom labs in Azure Lab Services — Frequently asked questions (FAQ)
Get answers to some of the most common questions about classroom labs in Azure Lab Services. 

## Quotas

### Is the quota per user or per week or per entire duration of the lab? 
The quota you set for a lab is for each student for entire duration of the lab. And, the [scheduled running time of VMs](how-to-create-schedules.md) doesn't count against the quota allotted to a user. The quota is for the time outside of schedule hours that a student spends on VMs.  For more information on quotas, see [Set quotas for users](how-to-configure-student-usage.md#set-quotas-for-users).

### If educator turns on a student VM, does that affect the student quota? 
No. It doesn't. When educator turns on the student VM, it doesn't affect the quota allotted to the student. 

## Schedules

### Do all VMs in the lab start automatically when a schedule is set? 
No. Not all the VMs. Only the VMs that are assigned to users on a schedule. The VMs that aren't assigned to a user aren't automatically started. It's by design. 

## Lab accounts

### Why am I not able to create a lab because of unavailability of the address range? 
Classroom labs can create lab VMs within an IP address range you specify when creating your lab account in the Azure portal. When an address range is provided, each lab that's created after it's allotted 512 IP addresses for lab VMs. The address range for the lab account must be large enough to accommodate all the labs you intend to create under the lab account. 

For example, if you have a block of /19 - 10.0.0.0/19, this address range accommodates 8192 IP addresses and 16 labs(8192/512 = 16 labs). In this case, lab creation fails on 17th lab creation.

### What port ranges should I open on my organization's firewall setting to connect to Lab virtual machines via RDP/SSH?

The ports are: 49152–65535. Classroom labs sit behind a load balancer. Each lab has a single public IP address and each virtual machine in the lab has a unique port. 

You can also see the private IP address of each virtual machine on the **Virtual machine pool** tab of the home page for lab in the Azure portal. If you republish a lab, the public IP address of the lab will not change, but the private IP and port number of each virtual machine in the lab can change. You can learn more in the article: [Firewall settings for Azure Lab Services](how-to-configure-firewall-settings.md).

### What public IP address range should I open on my organization's firewall settings to connect to Lab virtual machines via RDP/SSH?
See [Azure IP Ranges and Service Tags — Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519), which provides the public IP address range for data centers in Azure. You can open the IP addresses for the regions where your lab accounts are in.

## Virtual machine images

### As a lab creator, why can't I enable additional image options in the virtual machine images dropdown when creating a new lab?

When an administrator adds you as a lab creator to a lab account, you're given the permissions to create labs. But, you don't have the permissions to edit any settings inside the lab account, including the list of enabled virtual machine images. To enable additional images, contact your lab account administrator to do it for you, or ask the administrator to add you as a Contributor role to the lab account. The Contributor role will give you the permissions to edit the virtual machine image list in the lab account.

### Can I attach additional disks to a virtual machine?
No. it's not possible to attach additional disks to a VM in a classroom lab. 

## Users

### How many users can be in a classroom lab?
You can add up to 400 users to a classroom lab. 

## Blog post
Subscribe to the [Azure Lab Services blog](https://aka.ms/azlabs-blog).

## Update notifications
Subscribe to [Lab Services updates](https://azure.microsoft.com/updates/?product=lab-services) to stay informed about new features in Lab Services.

## General
### What if my question isn't answered here?
If your question isn't listed here, let us know, so we can help you find an answer.

- Post a question at the end of this FAQ. 
- To reach a wider audience, post a question on the [Azure Lab Services — Tech community forum](https://techcommunity.microsoft.com/t5/azure-lab-services/bd-p/AzureLabServices). 
- For feature requests, submit your requests and ideas to [Azure Lab Services — User Voice](https://feedback.azure.com/forums/320373-lab-services?category_id=352774).

