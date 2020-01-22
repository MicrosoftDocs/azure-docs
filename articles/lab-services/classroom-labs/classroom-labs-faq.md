---
title: Classroom labs in Azure Lab Services — FAQ | Microsoft Docs
description: Find answers to common questions about classroom labs in Azure Lab Services.
services: lab-services
documentationcenter: na
author: spelluru
manager: femila
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/05/2019
ms.author: spelluru

---

# Classroom labs in Azure Lab Services — Frequently asked questions (FAQ)
Get answers to some of the most common questions about classroom labs in Azure Lab Services. 

## Quotas

### Is the quota per user or per week or per entire duration of the lab? 
The quota you set for a lab is for each student for entire duration of the lab. And, the [scheduled running time of VMs](how-to-create-schedules.md) doesn't count against the quota allotted to a user. The quota is for the time outside of schedule hours that a student spends on VMs.  For more information on quotas, see [Set quotas for users](how-to-configure-student-usage.md#set-quotas-for-users).

## Schedules

### Do all VMs in the lab start automatically when a schedule is set? 
No. Not all the VMs. Only the VMs that are assigned to users on a schedule. The VMs that aren't assigned to a user are not automatically started. It's by design. 

## Lab accounts

### Why am I not able to create a lab because of unavailability of the address range? 
Classroom labs can create lab VMs within an IP address range you specify when creating your lab account in the Azure portal. When an address range is provided, each lab that's created after it's allotted 512 IP addresses for lab VMs. The address range for the lab account must be large enough to accommodate all the labs you intend to create under the lab account. 

For example, if you have a block of /19 - 10.0.0.0/19, this address range accommodates 8192 IP addresses and 16 labs(8192/512 = 16 labs). In this case, lab creation fails on 17th lab creation.

### What port ranges should I open on my organization's firewall setting to connect to Lab virtual machines via RDP/SSH?

The ports are: 49152–65535. Classroom labs sit behind a load balancer, so all the virtual machines in a lab have single IP address and each virtual machine in the lab has a unique port. The port numbers and the public IP address can change every time the lab is republished.

### What public IP address range should I open on my organization's firewall settings to connect to Lab virtual machines via RDP/SSH?
See [Azure IP Ranges and Service Tags — Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519), which provides the public IP address range for data centers in Azure. You can open the IP addresses for the regions where your lab accounts are in.

## Users

### How many users can be in a classroom lab?
You can add up to 400 users to a classroom lab. 

## Blog post
Subscribe to the [Azure Lab Services blog](https://azure.microsoft.com/blog/tag/azure-lab-services/).

## Update notifications
Subscribe to [Lab Services updates](https://azure.microsoft.com/updates/?product=lab-services) to stay informed about new features in Lab Services.

## General
### What if my question isn't answered here?
If your question isn't listed here, let us know, so we can help you find an answer.

- Post a question at the end of this FAQ. 
- To reach a wider audience, post a question on the [Azure Lab Services — Stack Overflow forum](https://stackoverflow.com/questions/tagged/azure-lab-services). 
- For feature requests, submit your requests and ideas to [Azure Lab Services — User Voice](https://feedback.azure.com/forums/320373-lab-services?category_id=352774).

