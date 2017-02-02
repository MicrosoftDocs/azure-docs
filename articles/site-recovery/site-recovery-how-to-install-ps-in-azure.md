---
title: How to install Process server in Azure
description: You need to setup a Process server in Azure so that you can reprotect the VM's back to on-premises.
services: site-recovery
documentationcenter: ''
author: ruturaj
manager: gauravd
editor: ''

ms.assetid: 44813a48-c680-4581-a92e-cecc57cc3b1e
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: 
ms.date: 01/02/2017
ms.author: ruturajd

---
# Reprotect from Azure to On-premises

## Overview
This article describes how to install an Azure Process server. The decision point on where to deploy your process server arises from the latency between the protected VM (in Azure) and the process server. To decide whether you need a Process server in Azure, check if your VPN connection is via a simple Site-to-site VPN or via Private peering in Express Route. If you have express route, you can use an on-premises process server. However if you only have VPN, you will need a process server in Azure. 

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Pre-requisites

* The Process server should be deployed in an Azure virtual network such that the following properties are met in the communications channel
	1. The failed over VM in Azure can communicate to the Process server
	2. The on-premises Configuration server can communicate to the Process server
	3. The on-premises MT can communicate to the Process server


## Steps to install PS in Azure

If you have protected your machines as classic resources (that is the VM recovered in Azure is a classic VM), then you will need a classic process server in Azure. If you have recovered the machines as resources manager as deployment type, you will need a process server of a resource manager deployment type. The type is selected by the Azure virtual network you deploy the process server into.

1. In the Vault > Settings > Site Recovery Infrastructure (under the "Manage" heading) > **Configuration Servers** (under "For VMware and Physical Machines" heading) select the configuration server. Click on "+ Process server", highlighted with yellow on the example screenshot below.
   
   ![](./media/site-recovery-failback-azure-to-vmware-classic/add-processserver.png)
2. Choose to deploy the process server as "Deploy a failback process server in Azure".
3. Select the subscription in which you have recovered the machines.
4. Next select the Azure network in which you have the recovered machines. Process server needs to be in the same network so that the recovered VMs and the process server can communicate.
5. If you have selected a *classic deployment* network - you will be asked to create a new VM via the Azure gallery and install the process sever in it.
   
    ![](./media/site-recovery-failback-azure-to-vmware-classic/add-classic.png)
   
   1. Name of the image is *Microsoft Azure Site Recovery Process Server V2*. make sure you select *Classic* as the deployment model.
      
       ![](./media/site-recovery-failback-azure-to-vmware-classic/templatename.png)
   2. Install the Process server as per the steps [given here](site-recovery-vmware-to-azure-classic.md#step-5-install-the-management-server)
6. If you select the *Resource Manager* Azure network, you will need to give the following inputs to deploy the server.
   
   1. Resource Group to which you want to deploy the server
   2. Give the server a name
   3. Give it a username password so that you can log in
   4. Choose the storage account to which you want to deploy the server
   5. Choose the specific Subnet and a free IP address from the network.
      
       ![](./media/site-recovery-failback-azure-to-vmware-classic/PSNewinputs.PNG)
   6. Click OK. This will trigger a job that will create a Resource Manager deployment type virtual machine with process server setup. You need to run the setup inside the VM to register the server to the configuration server. You can do this by following [these steps](site-recovery-vmware-to-azure-classic.md#step-5-install-the-management-server).
   7. A job to deploy the process server will be triggered
7. At the end, the process server should be listed in the configuration servers page, under the associated servers section, in Process Servers tab.
    ![](./media/site-recovery-failback-azure-to-vmware-new/pslistingincs.png)

    > [!NOTE] 
    > The server won't be visible under **VM properties**. It's only visible under the **Servers** tab in the management server to which it's been registered. It can take about 10-15 mins for the process server to appear.


After the PS deployment in Azure completes, you can see the job succeed, the VM will enter into a protected state.

## Next steps

Once the VM has entered into protected state, you can initiate a failback. The failback will shutdown the VM in Azure and boot the VM on-premises. Hence there is a small downtime for the application. So choose the time for failback when your application can face a downtime.

[Steps to initiate failback of the VM](site-recovery-how-to-failback-v2a.md#steps-to-failback)

## Common issues 
