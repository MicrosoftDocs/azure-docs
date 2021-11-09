---
title: What's New in Azure Lab Services | Microsoft Docs
description: Learn what's new in the Azure Lab Services November 2021 Updates. 
ms.topic: overview
ms.date: 11/09/2021
---

# What's new in Azure Lab Services November 2021 Updates

We've made fundamental backend improvements for the service to boost performance, reliability, and scalability. In this article, we describe all the great changes and new features that are available! 

[Lab Plans replace Lab Accounts](#lab-plans-replace-lab-accounts). The lab account concept is being replaced with a new concept called a Lab plan. Although similar in functionality, there are some fundamental differences. The Lab Plan serves as a collection of configurations and settings that apply to the labs created from it. Labs are now an Azure resource in their own right and a sibling resource to Lab Plans. 

[Improved performance](#performance-and-capacity). From lab and virtual machine creation to lab publish, you’ll notice drastic improvements.  

[New SKUs](#new-skus). We’ve been working hard to add new VM sizes with options for larger OS disk sizes. All lab virtual machines use solid state disks (SSD) and you have a choice between Standard SSD and Premium SSD.  

[Per Customer Assigned Capacity](#per-customer-assigned-capacity). No more sharing capacity with others. If your organization has requested more quota, we’ll save it just for you. 

[Canvas Integration](#canvas-integration). Use Canvas to organize everything for your classes—even virtual labs. Now, instructors don’t have to leave Canvas to create their labs. Students can connect to a virtual machine from inside their course.

[VNet Injection](#vnet-injection). You asked for more control over the network for lab virtual machines and now you have it. We replaced virtual network peering with virtual network injection. In your own subscription, create a virtual network in the same region as the lab, delegate a subnet to Azure Lab Services and you’re off and running. 

[Improved auto-shutdown](#improved-auto-shutdown-experience). Auto-shutdown settings are now available for ALL operating systems! If we detect a student shut down their VM, we’ll stop billing. 

[More built-in roles](#new-built-in-roles-for-azure-lab-services). In addition to Lab Creator, we’ve added Lab Operator and Lab Assistant roles. Lab Operators can manage existing labs, but not create new ones. Lab Assistant can only help students by starting, stopping, or redeploying virtual machines. They will not be able to adjust quota or set schedules. 

[Improved cost tracking in Cost Management](#improved-cost-tracking). Lab virtual machines are now the cost unit tracked in Azure Cost Management. Tags for lab plan id and lab name are automatically added if you want to group lab VM cost entries together. Need to track cost by a department or cost center? Just add a tag to the lab resource in Azure. We added the ability to propagate tags from labs to Azure Cost Management entries.  

[Updates to lab owner experience](#updates-to-lab-owner-experience). Now you can choose to skip the template creation process and automatically publish the lab if you already have an image ready to use. In addition, we’ve added the ability to add a non-admin user to lab VMs and made some scheduling improvements while we were at it. 

[Updates to student experience](#updates-to-student-experience). Student can now redeploy their VM without losing data.  If the lab is setup to use AAD group sync, there is no longer a need to send an invitation email so students can register for a virtual machine—one is assigned to the student automatically. 

SDKs. The Azure Lab Services PowerShell will now be integrated with the Az PowerShell module and will release with the next monthly update of the Az module. Also, check out the C# SDK. 

Give it a try!  {link to getting started for V2 doc} And check out the updated documentation at [Introduction to labs](classroom-labs-overview.md)

In this release, there remain a few known issues:

- PowerShell SDK will be released on 12/7/2021 as part of the monthly update for the Azure module.

- C# SDK will be released on _______________

- When using VNet Injection, deleting your virtual network will cause all the lab VMs to stop working. We plan to make this experience better soon, but for now make sure to delete labs before deleting networks.

## Lab Plans replace Lab Accounts

## Performance and capacity

## New SKUs

## Canvas integration

status - in review

## New built-in roles for Azure Lab Services

status - in progress

## VNET injection

status - in progress

## Improved auto-shutdown experience

## Updates to lab owner experience

## Updates to student experience

status - ready for review

## Improved cost tracking

status - not started

## Azure lab services automation

status - blocked