---
title: Run scripts in a Windows or Linux VM in Azure with Run Command
description: This topic provides an overview of running scripts within an Azure virtual machine by using the Run Command feature
ms.service: virtual-machines
author: nikhilpatel909
ms.author: erd
ms.date: 03/10/2023
ms.topic: how-to  
ms.reviewer: erd
---

# Run scripts in your VM by using Run Command

Run Command uses the virtual machine (VM) agent to run scripts within an Azure Windows or Linux VM. You can use these scripts for general machine or application management. They can help you to quickly diagnose and remediate VM access and network issues and get the VM back to a good state. Scripts can be embedded in the properties or referenced to a pre published gallery script. 


The original set of commands are action orientated. The updated set of commands are management orientated and enable you to run multiple scripts and has less restrictions. This article will explain the difference between the two sets of run commands and help you decide which set is the right one to use in your scenario.  

> [!IMPORTANT]
> **Managed Run Command**  is currently available in Azure CLI, PowerShell, and API at this time. Portal functionality will soon be available.



## When to use action or managed commands

The original set of commands are action orientated. You should consider using this set of commands for situations where you need to run:
- A small script to get a content from a VM
- A script to configure a VM (set registry keys, change configuration) 
- A one time script for diagnostics

See [Action Run Commands for Linux](./linux/run-command.md) and [Action Run Commands for Windows](./windows/run-command.md) for available action commands and instructions on how to apply them. 

The updated set of commands are management orientated. Consider using managed run commands if your needs align to the following examples:
- Script needs to run as part of VM deployment 
- Recurrent script execution is needed 
- Multiple scripts needs to execute sequentially 
- Bootstrap a VM by running installation scripts 
- Publish custom script to be shared and reused 

See [Managed Run Command for Linux](./linux/run-command-managed.md) and [Managed Run Command for Windows](./windows/run-command-managed.md) to learn how to use them.


## Compare feature support

| Feature support  | Action RunCommand  | Managed RunCommand  |
|---|---|---|
| ARM template  | No, it’s a POST action  | Yes, it’s a resource type  |
| Long running  | 90 min limit  | Customer specified timeout  |
| Execution account  | System account / root  | Customer specified user  |
| Multiple run commands  | Only one active  | Multiple in parallel or sequenced  |
| Large output  | Limited to 4k (in status blob)  | Uploaded to customer append blob  |
| Progress tracking  | Reports only final status  | Reports progress and last 4k output during execution  |
| Async execution  | Goal state/provisioning waits for script to complete  | Customer specified async flag if provisioning waits for the script  |
| Virtual machine scale set support  | Only on VM instance  | Support virtual machine scale set model and scale out  |
| SAS generation  | No blob support  | Automated, CRP generates SAS for customer blobs and manages them  |
| Gallery (custom commands)  | Only built-in commandIds  | Customer can publish scripts and share them  |


## Next steps

Get started with [Managed Run Command for Linux](./linux/run-command-managed.md) or [Managed Run Command for Windows](./windows/run-command-managed.md). 
