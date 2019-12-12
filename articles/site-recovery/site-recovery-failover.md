---
title: Run a failover during disaster recovery with Azure Site Recovery 
description: How to fail over VMs and physical servers during disaster recovery with Azure Site Recovery.
ms.service: site-recovery
ms.topic: article
ms.date: 12/10/2019

---
# Run a failover from on-premises to Azure

This article describes how to fail over on-premises machines to Azure in [Azure Site Recovery](site-recovery-overview.md)

## Before you start

- [Learn about](recovery-plan-overview.md) failovers in Site Recovery.
- Before you do a full failover, run a [test failover](site-recovery-test-failover-to-azure.md) to ensure that everything is working as expected.
- [Prepare the network](site-recovery-network-design.md) in the target location before you do a failover. 
- [Review settings](#prepare-to-connect-after-failover) needed on the source machines in order to connect to Azure VMs that are created after failover.


## Run a failover

This procedure describes how to run a failover for a [recovery plan](site-recovery-create-recovery-plans.md). If you want to run a failover for a single VM, follow the instructions for a [VMware VM](vmware-azure-tutorial-failover-failback.md), a [physical server](physical-to-azure-failover-failback.md), or a [Hyper-V VM](hyper-v-azure-failover-failback-tutorial.md).


Run the recovery plan failover as follows:

1. In the Site Recovery vault, select **Recovery Plans** > *recoveryplan_name*.
2. Click **Failover**.

    ![Failover](./media/site-recovery-failover/Failover.png)

3. In **Failover** > **Failover direction**, leave the default if you're replicating to Azure. Use **Change direction** if you want to change the failover source and target.
4. In **Failover**, select a **Recovery Point** to which to fail over.

    - **Latest**: Use the latest point. This processes all the data that's been sent to Site Recovery service, and creates a recovery point for each machine. This option provides the lowest RPO (Recovery Point Objective) because the VM created after failover has all the data that's been replicated to Site Recovery when the failover was triggered.
   - **Latest processed**: Use this option to fail over VMs to the latest recovery point already processed by Site Recovery. You can see the latest processed recovery point in the VM **Latest Recovery Points**. This option provides a low RTO as no time is spent to processing the unprocessed data
   - **Latest app-consistent**: Use this option to fail VMs over to the latest application consistent recovery point that's been processed by Site Recovery.
   - **Latest multi-VM processed**:  With this option VMs that are part of a replication group failover to the latest common multi-VM consistent recovery point. Other virtual machines fail over to their latest processed recovery point. This option is only for recovery plans that have at least one VM with multi-VM consistency enabled.
   - **Latest multi-VM app-consistent**: With this option VMs that are part of a replication group fail over to the latest common multi-VM application-consistent recovery point. Other virtual machines failover to their latest application-consistent recovery point. Only for recovery plans that have at least one VM with multi-VM consistency enabled.
   - **Custom**: Not available for recovery plans. This option is only for failover of individual VMs.

5. Select **Shut-down machine before beginning failover** if you want Site Recovery shut down source VMs before starting the failover. Failover continues even if shutdown fails.  

	> [!NOTE]
	> If you fail over Hyper-V VMs, shutdown tries to synchronize and replicate the on-premises data that hasn't yet been sent to the service, before triggering the failover. 

6. Follow failover progress on the **Jobs** page. Even if errors occurs, the recovery plan runs until it is complete.
7. After the failover, sign into the VM to validate it. 
8. If you want to switch to different recovery point to use for the failover, use **Change recovery point**.
9. When you're ready, you can commit the failover.The **Commit** action deletes all the recovery points available with the service. The **Change recovery point** option will no longer be available.

## Run a planned failover

You can run a planned failover for Hyper-V VMs.

- A planned failover is a zero data loss failover option.
- When a planned failover is triggered, first the source virtual machines are shut-down, the latest data is synchronized and then a failover is triggered.
- You run a planned failover using the **Planned failover** option. It runs in a similar way to a regular failover.
 
## Failover jobs

There are a number of jobs associated with failover.

![Failover](./media/site-recovery-failover/FailoverJob.png)


- **Prerequisites check**: Ensures that all conditions required for failover are met.
- **Failover**: Processes the data so that an Azure VM can be created from it. If you have chosen **Latest** recovery point, a recovery point is created from the data that's been sent to the service.
- **Start**: Creates an Azure VM using the data processed in the previous step.

> [!WARNING]
> **Don't cancel a failover in progress**: Before failover is started, replication s stopped for the VM. If you cancel an in-progress job, failover stops, but the VM will not start to replicate. Replication can't be started again.


## Extra failover time

In some cases, VM failover requires intermediate step that usually takes around eight to 10 minutes to complete. These are the machines that are affected by this additional step/time:

* VMware virtual machines running a Mobility service version older than 9.8.
* Physical servers, and Hyper-V VMs protected as physical servers.
* VMware Linux VMs.
* VMware  VMs on which these drivers aren't present as boot drivers:
	* storvsc
	* vmbus
	* storflt
	* intelide
	* atapi
* VMware VMs that don't have DHCP enabled, irrespective of whether they're using DHCP or static IP addresses.


## Script failover actions

You might want to automate actions during failover. To do this, you can use scripts or Azure automation runbooks in recovery plans.

- [Learn](site-recovery-create-recovery-plans.md) about creating and customizing recovery plans, including adding scripts.
- [Learn](site-recovery-runbook-automation.md) abut adding Azure Automation runbooks to recovery plans.


## Post-failover

### Retain drive letters after failover

Site Recovery handles retention of drive letters. If you're excluding disks during VM replication, [review an example](exclude-disks-replication.md#example-1-exclude-the-sql-server-tempdb-disk) of how this works.

## Prepare to connect after failover

If you want to connect to Azure VMs that are created after failover using RDP or SSH, follow the requirements summarized in the table.

**Failover** | **Location** | **Actions**
--- | --- | ---
**Azure VM running Windows** | On-premises machine before failover | To access the Azure VM over the internet, enable RDP, and make sure that TCP and UDP rules are added for **Public**, and that RDP is allowed for all profiles in **Windows Firewall** > **Allowed Apps**.<br/><br/> To access the Azure VM over a site-to-site connection, enable RDP on the machine, and ensure that RDP is allowed in the **Windows Firewall** -> **Allowed apps and features**, for **Domain and Private** networks.<br/><br/>  Make sure the operating system SAN policy is set to **OnlineAll**. [Learn more](https://support.microsoft.com/kb/3031135).<br/><br/> Make sure there are no Windows updates pending on the VM when you trigger a failover. Windows update might start when you fail over, and you won't be able to log onto the VM until the update completes.
**Azure VM running Windows** | Azure VM after failover |  [Add a public IP address](https://aka.ms/addpublicip) for the VM.<br/><br/> The network security group rules on the failed over VM (and the Azure subnet to which it is connected) need to allow incoming connections to the RDP port.<br/><br/> Check **Boot diagnostics** to verify a screenshot of the VM.<br/><br/> If you can't connect, check that the VM is running, and review these [troubleshooting tips](https://social.technet.microsoft.com/wiki/contents/articles/31666.troubleshooting-remote-desktop-connection-after-failover-using-asr.aspx).
**Azure VM running Linux** | On-premises machine before failover | Ensure that the Secure Shell service on the VM is set to start automatically on system boot.<br/><br/> Check that firewall rules allow an SSH connection to it.
**Azure VM running Linux** | Azure VM after failover | The network security group rules on the failed over VM (and the Azure subnet to which it is connected) need to allow incoming connections to the SSH port.<br/><br/> [Add a public IP address](https://aka.ms/addpublicip) for the VM.<br/><br/> Check **Boot diagnostics** for a screenshot of the VM.<br/><br/>

Follow the steps described [here](site-recovery-failover-to-azure-troubleshoot.md) to troubleshoot any connectivity issues post failover.


## Next steps

> [!WARNING]
> Once you have failed over virtual machines and the on-premises data center is available, you should [**Reprotect**](vmware-azure-reprotect.md) VMware virtual machines back to the on-premises data center.

Use [**Planned failover**](hyper-v-azure-failback.md) option to **Failback** Hyper-v virtual machines back to on-premises from Azure.

If you have failed over a Hyper-v virtual machine to another on-premises data center managed by a VMM server and the primary data center is available, then use **Reverse replicate** option to start the replication back to the primary data center.
