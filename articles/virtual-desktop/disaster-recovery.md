---
title: Set up Windows Virtual Desktop disaster recovery plan - Azure
description: How to set up a business continuity and disaster recovery plan for your Windows Virtual Desktop deployment.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 07/21/2020
ms.author: helohr
manager: lizross
---

# Set up a business continuity and disaster recovery plan

To keep your organization's data safe, you may need to adopt a business continuity and disaster recovery (BCDR) strategy. A sound BCDR strategy keeps your apps and workload up and running during planned and unplanned service or Azure outages.

Windows Virtual Desktop offers BCDR for the Windows Virtual Desktop service to preserve customer metadata during outages. When an outage occurs in a region, the service infrastructure components will fail over to the secondary location and continue functioning as normal. You can still access service-related metadata, and users can still connect to available hosts. End-user connections will stay online as long as the tenant environment or hosts remain accessible.

To make sure users can still connect during a region outage, you need to replicate their virtual machines (VMs) to a different location. During outages, the primary site fails over to the replicated VMs in the secondary location. Users can continue to access apps from the secondary location without interruption. If you're using profile containers, on top of VM replication, you'll need to keep user identities accessible at the secondary location. Finally, make sure your business apps that rely on data in the primary location can fail over with the rest of the data.

The following sections will explain how to configure important components for your BCDR plan.



As an organization you might need to adopt a business continuity and disaster recovery (BCDR) strategy to keep your data safe and your apps and workload running during planned and unplanned service or Azure outages.

Windows Virtual Desktop offers BCDR as a service to keep customer applications up and running during outages. When an outage occurs in a region, the service infrastructure components will failover to a secondary location, then continue functioning as normal. The customer can still access their application, and end-users can connect to available hosts. End-user connections are preserved as long as the tenant environment or hosts are still accessible.

For a successful end-user connection during a region outage, you'll need to replicate the VMs in a different location. On an outage, you fail over the primary site to a secondary location (where the replication has been enabled) and the user can continue to access apps from there. Additionally, if you are using Profile Containers, you would have setup replication of this data also in the secondary location. You would also have to ensure that the user identities are available at the secondary location. Finally, you need to make sure that any line of business applications that rely on data located in the primary region have been failed over together with the data.

To successfully keep your users connected during a region outage, you'll need to do the following things, in order:

- Replicate the VMs in a secondary location.
- If you're using profile containers, set up replication of date in the secondary location.
- Make sure user identities you set up in the primary location are available in the secondary location.
- Make sure any line of business applications relying on data in your primary location are failed over to the secondary location along with your data.


## VM replication

First, you'll need to replicate your VMs. We recommend you use [Azure Site Recovery](../site-recovery/site-recovery-overview.md) to manage replication for [Azure VMs replicating between Azure regions](../site-recovery/azure-to-azure-architecture.md). Site Recovery supports both [Server-based and Client-based SKUs](../site-recovery/azure-to-azure-support-matrix.md#replicated-machine-operating-systems). 

Azure Site Recovery automatically registers VMs for you. The Windows Virtual Desktop agent in the secondary VM automatically uses the latest security token to connect to the closest service instance. The VM session host in the secondary location then automatically joins the host pool. The only manual operation involved is that the user might have to reconnect to the session after the process is done.

To learn how to replicate VMs, see [Replicate Azure VMs to another Azure region](../site-recovery/azure-to-azure-how-to-enable-replication.md).

## Virtual network

Next, create a virtual network (VNET) in the failover region. If there are any on-prem resources that need to be accessed, then you also need to configure the VNET to access those resources. 

## User identities

Next, ensure that the domain controller is available at the secondary location. 

There are three ways to keep the domain controller available:

   - Have Active Directory Domain Controller at secondary location
   - Use an on-premise Active Directory Domain Controller
   - Replicate Active Directory Domain Controller using [Azure Site Recovery](../site-recovery/site-recovery-active-directory.md)

<!--->Do we have links for this?<-->

## User and app data

If you're using profile containers, the next step is to set up data replication in the secondary location. You have four options to store FSLogix profiles:

   - S2D
   - Network drives (VM with extra drives)
   - Azure Files
   - Azure NetApp Files

For more information, check out [Storage options for FSLogix profile containers in Windows Virtual Desktop](store-fslogix-profile.md).

Let’s take a look at how to configure FSLogix to set up disaster recovery for each option.

### FSLogix configuration

The FSLogix agent can support multiple profile locations if you configure the registry entries for FSLogix.

To configure the registry entries:

1. Open the **Registry Editor**.
2. Go to **Computer** > **HKEY_LOCAL_MACHINE** > **SOFTWARE** > **FSLogix** > **Profiles**.
   
     > [!div class="mx-imgBorder"]
     > ![A screenshot of the Profiles window in the Registry Editor. VHDLocation is selected.](media/regedit-profiles.png)

3. Right-click on **VHDLocations** and select **Edit Multi-String**.

     > [!div class="mx-imgBorder"]
     > ![A screenshot of the Edit Multi-String window. The value data lists the Centrual US and East US locations.](media/multi-string-edit.png)

4. In the **Value Data** field, enter the locations you want to use.
5. When you're done, select **OK**.

If the first location is unavailable, the FSLogix agent will automatically fail over to the second, and so on.

We recommend you configure the FSLogix agent with a path to the secondary location in the main region. Once the primary location shuts down, the FLogix agent will replicate as part of the VM Azure Site Recovery replication. Once the replicated VMs are ready, the agent will automatically attempt to path to the secondary region.

For example, let's say your primary session host VMs are in the Central US region, but your profile container is in the Central US region for performance reasons.

In this case, you would configure the FSLogix agent with a path to the storage in Central US. You would configure the session host VMs to replicate in West US. Once the path to Central US fails, the agent will try to create a new path for storage in West US instead.

### S2D

Since S2D handles replication across regions internally, you don't need to manually set up the secondary path.

### Network drives (VM with extra drives)

If you replicate the network storage VMs using Azure Site Recovery like the session host VMs, then the recovery keeps the same path, which means you don't need to reconfigure FSlogix.

### Azure Files

Azure Files supports cross-region asynchronous replication that you can specify when you create the storage account. If the asynchronous nature of Azure Files already covers your disaster recovery goals, then you don't need to do additional configuration.

If you do need synchronous replication to minimize data loss, then we recommend you use FSLogix Cloud Cache instead.

>[!NOTE]
>This section doesn't cover the failover authentication mechanism for
Azure Files.

### Azure NetApp Files

**We need to decide on the final content for this. If it's not ready yet, then we shouldn't include this until later.**

\<TBD\>

>[!IMPORTANT]
>If there are existing user connections during the outage, before the admin can start failover to the secondary region, you need to end the user connections in the current region. To do this, open PowerShell and run the [Invoke-RdsUserSessionLogoff](/powershell/module/windowsvirtualdesktop/invoke-rdsusersessionlogoff/) cmdlet.

Once you've signed out all users in the primary region, you can fail over the VMs in the primary region and let users connect to the VMs in the secondary region.

## App dependencies

Finally, make sure that any business apps that rely on data located in the primary region can fail over to the secondary location. Also, be sure to configure the settings the apps need to work in the new location. For example, if one of the apps is dependent on the SQL backend, make sure to replicate SQL in the secondary location. You should configure the app to use the secondary location as either part of the failover process or as its default configuration.
