---
title: Common questions about the Migration and modernization tool
description: Get answers to common questions about using Migration and modernization to migrate machines.
author: piyushdhore-microsoft
ms.author: piyushdhore
ms.manager: vijain
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 03/06/2023
ms.custom: engagement-fy23
---

# Migration and modernization: Common questions

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

This article answers common questions about the Migration and modernization tool. If you've other questions, check these resources:

- [General questions](resources-faq.md) about Azure Migrate
- Questions about the [Azure Migrate appliance](common-questions-appliance.md)
- Questions about [discovery, assessment, and dependency visualization](common-questions-discovery-assessment.md)
- Get questions answered in the [Azure Migrate forum](https://aka.ms/AzureMigrateForum)

## General questions


### What are the migration options in Migration and modernization?

The Migration and modernization tool offers two options for migrating your source servers and virtual machines to Azure: agentless migration and agent-based migration.

Regardless of the migration option chosen, the first step to migrate a server using the Migration and modernization tool is to start replication for the server. This performs an initial replication of your VM/server data to Azure. After the initial replication is completed, an ongoing replication (ongoing delta-sync) is established to migrate incremental data to Azure. Once the operation reaches the delta-sync stage, you can choose to migrate to Azure at any time.

Here are some considerations to keep in mind while deciding on the migration option.

**Agentless migrations** don't require any software (agents) to be deployed on the source VMs/servers being migrated. The agentless option orchestrates replication by integrating with the functionality provided by the virtualization provider.
The Agentless replication options are available for [VMware VMs](./tutorial-migrate-vmware.md) and [Hyper-V VMs](./tutorial-migrate-hyper-v.md).

**Agent-based migrations** require Azure Migrate software (agents) to be installed on the source VMs/machines to be migrated. The agent-based option doesn’t rely on the virtualization platform for the replication functionality. Therefore, it can be used with any server running an x86/x64 architecture and a version of an operating system supported by the agent-based replication method.

Agent-based migration option can be used for [VMware VMs](./tutorial-migrate-vmware-agent.md), [Hyper-V VMs](./tutorial-migrate-physical-virtual-machines.md), [physical servers](./tutorial-migrate-physical-virtual-machines.md), [VMs running on AWS](./tutorial-migrate-aws-virtual-machines.md), VMs running on GCP, or VMs running on a different virtualization provider. The agent-based migration treats your machines as physical servers for migration.

While the agentless migration offers another convenience and simplicity over the agent-based replication options for the supported scenarios (VMware and Hyper-V), you may want to consider using the agent-based scenario for the following use cases:

- IOPS constrained environment: Agentless replication uses snapshots and consumes storage IOPS/bandwidth. We recommend the agent-based migration method if there are constraints on storage/IOPS in your environment.
- If you don't have a vCenter Server, you can treat your VMware VMs as physical servers and use the agent-based migration workflow.

To learn more, review this [article](./server-migrate-overview.md) to compare migration options for VMware migrations.

### What geographies are supported for migration with Azure Migrate?

Review the supported geographies for [public](migrate-support-matrix.md#public-cloud) and [government clouds](migrate-support-matrix.md#azure-government).

### Can I use the same Azure Migrate project to migrate to multiple regions?

While you can create assessments for multiple regions in an Azure Migrate project, one Azure Migrate project can be used to migrate servers to one Azure region only. You can create additional Azure Migrate projects for each region that you need to migrate to.

- For agentless VMware migrations, the target region is locked once you enable the first replication.
- For agent-based migrations (VMware, physical servers, and servers from other clouds), the target region is locked once the “Create Resources” button is selected on the portal while setting up the replication appliance.
- For agentless Hyper-V migrations, the target region is locked once the “Create Resources” button is selected on the portal while setting up the Hyper-V replication provider.

### Can I use the same Azure Migrate project to migrate to multiple subscriptions?

Yes, you can migrate to multiple subscriptions (same Azure tenant) in the same target region for an Azure Migrate project. You can select the target subscription while enabling replication for a machine or a set of machines. The target region is locked post first replication for agentless VMware migrations and during the replication appliance and Hyper-V provider installation for agent-based migrations and agentless Hyper-V migrations respectively.

### How is the data transmitted from on-premises environment to Azure? Is it encrypted before transmission?

The Azure Migrate appliance in the agentless replication case  compresses data and encrypts before uploading. Data is transmitted over a secure communication channel over https and uses TLS 1.2 or later. Additionally, Azure Storage automatically encrypts your data when it's persisted it to the cloud (encryption-at-rest).

### Can I use the recovery services vault created by Azure Migrate for Disaster Recovery scenarios?
We don't recommend using the recovery services vault created by Azure Migrate for Disaster Recovery scenarios. Doing so can result in start replication failures in Azure Migrate.

### What is the difference between the Test Migration and Migrate operations?

Test migration provides a way to test and validate migrations prior to the actual migration. Test migration works by letting you use a sandbox environment in Azure to test the virtual machines before actual migration. The sandbox environment is demarcated by a test virtual network you specify. The test migration operation is non-disruptive, provided the test VNet is sufficiently isolated. Isolated VNet here means the inbound and outbound connection rules are designed to avoid unwanted connections. For example – connection to on-premises machines is restricted.

The applications can continue to run at the source while letting you perform tests on a cloned copy in an isolated sandbox environment. You can perform multiple tests, as needed, to validate the migration, perform app testing, and address any issues before the actual migration.

:::image type="content" source="./media/common-questions-server-migration/difference-migration-test-migration.png" alt-text="Screenshot shows the difference in test migration and actual migration.":::

### Is there a Rollback option for Azure Migrate?

You can use the Test Migration option to validate your application functionality and performance in Azure. You can perform any number of test migrations and can execute the final migration after establishing confidence through the test migration operation.
A test migration doesn’t affect the on-premises machine, which remains operational and continues replicating until you perform the actual migration. If there were any errors during the test migration UAT, you can choose to postpone the final migration and keep your source VM/server running and replicating to Azure. You can reattempt the final migration once you resolve the errors.
Note: Once you've performed a final migration to Azure and the on-premises source machine was shut down, you can't perform a rollback from Azure to your on-premises environment.

### Can I select the Virtual Network and subnet to use for test migrations?

You can select a Virtual Network for test migrations. The subnet is automatically selected based on the following logic:

- If a target subnet (other than default) was specified as an input while enabling replication, then Azure Migrate prioritizes using a subnet with the same name in the Virtual Network selected for the test migration.
- If the subnet with the same name isn't found, then Azure Migrate selects the first subnet available alphabetically that isn't a Gateway/Application Gateway/Firewall/Bastion subnet.

### Why is the Test Migration button disabled for my Server?

The test migration button could be in a disabled state in the following scenarios:

- You can’t begin a test migration until an initial replication (IR) has been completed for the VM. The test migration button will be disabled until the IR process is completed. You can perform a test migration once your VM is in a delta-sync stage.
- The button can be disabled if a test migration was already completed, but a test-migration cleanup wasn't performed for that VM. Perform a test migration cleanup and retry the operation.

### What happens if I don’t clean up my test migration?

Test migration simulates the actual migration by creating a test Azure VM using replicated data. The server will be deployed with a point in time copy of the replicated data to the target Resource Group (selected while enabling replication) with a “-test” suffix. Test migrations are intended for validating server functionality so that post migration issues are minimized. If the test migration isn't cleaned up post testing, the test virtual machine will continue to run in Azure, and will incur charges. To clean up post a test migration, go to the replicating machines view in the Migration and modernization tool, and use the 'cleanup test migration' action on the machine.


### How do I know if my VM was successfully migrated?

Once you've migrated your VM/server successfully, you can view and manage the VM from the Virtual Machines page. Connect to the migrated VM to validate.
Alternatively, you can review the ‘Job status’ for the operation to check if the migration was successfully completed. If you see any errors, resolve them, and retry the migration operation.

### What happens if I don’t stop replication after migration?

When you stop replication, the Migration and modernization tool cleans up the managed disks in the subscription that was created for replication. 

### What happens if I don’t complete migration after migration?

When you complete migration, the Migration and modernization tool cleans up the managed disks in the subscription that were created for replication. If you don't select **Complete migration** after a migration, you will continue to incur charges for these disks. Complete migration won't affect the disks attached to machines that have already been migrated.

### How can I migrate UEFI-based machines to Azure as Azure generation 1 VMs?
Migration and modernization tool migrates UEFI-based machines to Azure as Azure generation 2 VMs. If you want to migrate them to Azure generation 1 VMs, convert the boot-type to BIOS before starting replication, and then use the Migration and modernization tool to migrate to Azure.

### Does Azure Migrate convert UEFI-based machines to BIOS-based machines and migrate them to Azure as Azure generation 1 VMs?
Migration and modernization tool migrates all the UEFI-based machines to Azure as Azure generation 2 VMs. We no longer support the conversion of UEFI-based VMs to BIOS-based VMs. All the BIOS-based machines are migrated to Azure as Azure generation 1 VMs only.

### Which operating systems are supported for migration of UEFI-based machines to Azure?

| **Operating systems supported for UEFI-based machines** | **Agentless VMware to Azure**                                                                                                             | **Agentless Hyper-V to Azure** | **Agent-based VMware, physical and other clouds to Azure** |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------- |
| Windows Server 2019, 2016, 2012 R2, 2012                | Y                                                                                                                                         | Y                              | Y                                                          |
| Windows 10 Pro, Windows 10 Enterprise                   | Y                                                                                                                                         | Y                              | Y                                                          |
| SUSE Linux Enterprise Server 15 SP1                     | Y                                                                                                                                         | Y                              | Y                                                          |
| SUSE Linux Enterprise Server 12 SP4                     | Y                                                                                                                                         | Y                              | Y                                                          |
| Ubuntu Server 16.04, 18.04, 19.04, 19.10                | Y                                                                                                                                         | Y                              | Y                                                          |
| RHEL 8.1, 8.0, 7.8, 7.7, 7.6, 7.5, 7.4, 7.0, 6.x        | Y      | Y                              | Y                                                          |
| Cent OS 8.1, 8.0, 7.7, 7.6, 7.5, 7.4, 6.x               | Y | Y                              | Y                                                          |
| Oracle Linux 7.7, 7.7-CI                                |  Y                                                                                                                                        | Y                              | Y                                                          |

### Can I migrate Active Directory domain-controllers using Azure Migrate?

The Migration and modernization tool is application agnostic and works for most applications. When you migrate a server using the Migration and modernization tool, all the applications installed on the server are migrated along with it. However, for some applications, alternate migration methods other than Migration and modernization may be better suited for the migration.  For Active Directory, if hybrid environments where the on-premises site is connected to your Azure environment, you can extend your Directory into Azure by adding extra domain controllers in Azure and setting up Active Directory replication. If you're migrating into an isolated environment in Azure requiring its own domain controllers (or testing applications in a sandbox environment), you can migrate servers using the Migration and modernization tool.


### Can I upgrade my OS while migrating?

The Migration and modernization tool only supports like-for-like migrations currently. The tool doesn’t support upgrading the OS version during migration. The migrated machine will have the same OS as the source machine.

### Do I need VMware vCenter to migrate VMware VMs?

To [migrate VMware VMs](server-migrate-overview.md) using VMware agent-based or agentless migration, ESXi hosts on which VMs are located must be managed by vCenter Server. If you don't have vCenter Server, you can migrate VMware VMs by migrating them as physical servers. [Learn more](migrate-support-matrix-physical-migration.md).

### Can I consolidate multiple source VMs into one VM while migrating?

Migration and modernization capabilities support like-for-like migrations currently. We don't support consolidating servers or upgrading the operating system as part of the migration.

### Will Windows Server 2008 and 2008 R2 be supported in Azure after migration?

You can migrate your on-premises Windows Server 2008 and 2008 R2 servers to Azure virtual machines and get Extended Security Updates for three years after the End of Support dates at no extra charge above the cost of running the virtual machine. You can use the Migration and modernization tool to migrate your Windows Server 2008 and 2008 R2 workloads.

### How do I migrate Windows Server 2003 running on VMware/Hyper-V to Azure?

[Windows Server 2003 extended support](/troubleshoot/azure/virtual-machines/run-win-server-2003#microsoft-windows-server-2003-end-of-support) ended on July 14, 2015.  The Azure support team continues to help in troubleshooting issues that concern running Windows Server 2003 on Azure. However, this support is limited to issues that don't require OS-level troubleshooting or patches.
Migrating your applications to Azure instances running a newer version of Windows Server is the recommended approach to ensure that you're effectively using the flexibility and reliability of the Azure cloud.

However, if you still choose to migrate your Windows Server 2003 to Azure, you can use the Migration and modernization tool if your Windows Server is a VM running on VMware or Hyper-V
Review this article to [prepare your Windows Server 2003 machines for migration](./prepare-windows-server-2003-migration.md).

## Agentless VMware migration
### How does agentless migration work?

The Migration and modernization tool provides agentless replication options for the migration of VMware virtual machines and Hyper-V virtual machines running Windows or Linux. The tool also provides another agent-based replication option for Windows and Linux servers that can be used to migrate physical servers, and x86/x64 virtual machines on VMware, Hyper-V, AWS, GCP, etc. The agent-based replication option requires the installation of agent software on the server/virtual machine that’s being migrated, whereas in the agentless option no software needs to be installed on the virtual machines themselves, thus offering more convenience and simplicity over the agent-based replication option.

The agentless replication option works by using mechanisms provided by the virtualization provider (VMware, Hyper-V). In the case of VMware virtual machines, the agentless replication mechanism uses VMware snapshots and VMware changed block tracking technology to replicate data from virtual machine disks. This mechanism is similar to the one used by many backup products. In the case of Hyper-V virtual machines, the agentless replication mechanism uses VM snapshots and the change tracking capability of the Hyper-V replica to replicate data from virtual machine disks.

When replication is configured for a virtual machine, it first goes through an initial replication phase. During initial replication, a VM snapshot is taken, and a full copy of data from the snapshot disks are replicated to managed disks in your subscription. After initial replication for the VM is complete, the replication process transitions to an incremental replication (delta replication) phase. In the incremental replication phase, data changes that have occurred since the last completed replication cycle are periodically replicated and applied to the replica managed disks, thus keeping replication in sync with changes happening on the VM. In the case of VMware virtual machines, VMware changed block tracking technology is used to keep track of changes between replication cycles. At the start of the replication cycle, a VM snapshot is taken and changed block tracking is used to get the changes between the current snapshot and the last successfully replicated snapshot. That way only data that has changed since the last completed replication cycle needs to be replicated to keep replication for the VM in sync. At the end of each replication cycle, the snapshot is released, and snapshot consolidation is performed for the virtual machine. Similarly, in the case of Hyper-V virtual machines, the Hyper-V replica change tracking engine is used to keep track of changes between consecutive replication cycles.

When you perform the migrate operation on a replicating virtual machine, you've the option to shut down the on-premises virtual machine, and perform one final incremental replication to ensure zero data loss. On performing the migration, the replica managed disks corresponding to the virtual machine are used to create the virtual machine in Azure.

To get started, refer the [VMware agentless migration](./tutorial-migrate-vmware.md) and [Hyper-V agentless migration](./tutorial-migrate-hyper-v.md) tutorials.

### How do I gauge the bandwidth requirement for my migrations?

Bandwidth for replication of data to Azure depends on a range of factors and is a function of how fast the on-premises Azure Migrate appliance can read and replicate the data to Azure. Replication has two phases: initial replication and delta replication.

When replication starts for a VM, an initial replication cycle occurs in which full copies of the disks are replicated. After the initial replication is completed, incremental replication cycles (delta cycles) are scheduled periodically to transfer any changes that have occurred since the previous replication cycle.

You can work out the bandwidth requirement based on the volume of data needed to be moved in the wave and time within which you would like initial replication to complete (ideally you’d want initial replication to have completed at least 3-4 days prior to the actual migration window to give you sufficient time to perform a test migration prior to the actual window and to keep downtime to a minimum during the window).

You can estimate the bandwidth or time needed for agentless VMware VM migration using the following formula:

Time to complete initial replication =  {size of disks (or used size if available) * 0.7 (assuming a 30 percent compression average – conservative estimate)}/bandwidth available for replication.

### How do I throttle replication in using Azure Migrate appliance for agentless VMware replication?

You can throttle using NetQosPolicy. Note that this throttling is applicable only to the outbound connections from the Azure Migrate appliance. For example:

The AppNamePrefix to use in the NetQosPolicy is "GatewayWindowsService.exe". You could create a policy on the Azure Migrate appliance to throttle replication traffic from the appliance by creating a policy such as this one:

```powershell
New-NetQosPolicy -Name "ThrottleReplication" -AppPathNameMatchCondition "GatewayWindowsService.exe" -ThrottleRateActionBitsPerSecond 1MB
```

In order to increase and decrease replication bandwidth based on a schedule, you can leverage Windows scheduled task to scale the bandwidth as needed. One task will be used to decrease the bandwidth, and another task will be used to increase the bandwidth.
Note: You need to create the NetQosPolicy, outlined above, prior to executing the commands below.
```powershell
#Replace with an account part of the local Administrators group
$User = "localVmName\userName"

#Set the task names
$ThrottleBandwidthTask = "ThrottleBandwidth"
$IncreaseBandwidthTask = "IncreaseBandwidth"

#Create a directory to host PowerShell scaling scripts
if (!(Test-Path "C:\ReplicationBandwidthScripts"))
{
 New-Item -Path "C:\" -Name "ReplicationBandwidthScripts" -Type Directory
}

#Set your minimum bandwidth to be used during replication by changing the ThrottleRateActionBitsPerSecond parameter
#Currently set to 10 MBps
New-Item C:\ReplicationBandwidthScripts\ThrottleBandwidth.ps1
Set-Content C:\ReplicationBandwidthScripts\ThrottleBandwidth.ps1 'Set-NetQosPolicy -Name "ThrottleReplication" -ThrottleRateActionBitsPerSecond 10MB'
$ThrottleBandwidthScript = "C:\ReplicationBandwidthScripts\ThrottleBandwidth.ps1"

#Set your maximum bandwidth to be used during replication by changing the ThrottleRateActionBitsPerSecond parameter
#Currently set to 1000 MBps
New-Item C:\ReplicationBandwidthScripts\IncreaseBandwidth.ps1
Set-Content C:\ReplicationBandwidthScripts\IncreaseBandwidth.ps1 'Set-NetQosPolicy -Name "ThrottleReplication" -ThrottleRateActionBitsPerSecond 1000MB'
$IncreaseBandwidthScript = "C:\ReplicationBandwidthScripts\IncreaseBandwidth.ps1"

#Timezone set on the Azure Migrate Appliance (VM) will be used; change the frequency to meet your needs
#In this example, the bandwidth is being throttled every weekday at 8:00 AM local time
#The bandwidth is being increased every weekday at 6:00 PM local time
$ThrottleBandwidthTrigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday,Tuesday,Wednesday,Thursday,Friday -At 8:00am
$IncreaseBandwidthTrigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday,Tuesday,Wednesday,Thursday,Friday -At 6:00pm

#Setting the task action to execute the scripts
$ThrottleBandwidthAction = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-executionpolicy bypass -noprofile -file $ThrottleBandwidthScript"
$IncreaseBandwidthAction = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-executionpolicy bypass -noprofile -file $IncreaseBandwidthScript"

#Creating the Scheduled tasks
Register-ScheduledTask -TaskName $ThrottleBandwidthTask -Trigger $ThrottleBandwidthTrigger -User $User -Action $ThrottleBandwidthAction -RunLevel Highest -Force
Register-ScheduledTask -TaskName $IncreaseBandwidthTask -Trigger $IncreaseBandwidthTrigger -User $User -Action $IncreaseBandwidthAction -RunLevel Highest -Force
```

### How does churn rate affect agentless replication?

Because agentless replication folds in data, the *churn pattern* is more important than the *churn rate*. When a file is written again and again, the rate doesn't have much impact. However, a pattern in which every other sector is written causes high churn in the next cycle. Because we minimize the amount of data we transfer, we allow the data to fold as much as possible before we schedule the next cycle.

### How frequently is a replication cycle scheduled?

The formula to schedule the next replication cycle is (previous cycle time / 2) or one hour, whichever is higher.

For example, if a VM takes four hours for a delta cycle, the next cycle is scheduled in two hours, and not in the next hour. The process is different immediately after initial replication, when the first delta cycle is scheduled immediately.

### I deployed two (or more) appliances to discover VMs in my vCenter Server. However, when I try to migrate the VMs, I only see VMs corresponding to one of the appliances.

If there are multiple appliances set up, it's required there's no overlap among the VMs on the vCenter accounts provided. A discovery with such an overlap is an unsupported scenario.


### How does agentless replication affect VMware servers?

Agentless replication results in some performance impact on VMware vCenter Server and VMware ESXi hosts. Because agentless replication uses snapshots, it consumes IOPS on storage, so some IOPS storage bandwidth is required. We don't recommend using agentless replication if you've constraints on storage or IOPs in your environment.

### Can I use Azure Migrate to migrate my web apps to Azure App Service?

You can perform at-scale agentless migration of ASP.NET web apps running on IIS web servers hosted on a Windows OS in a VMware environment. [Learn more.](./tutorial-modernize-asp-net-appservice-code.md)


## Agent-based Migration

### How can I migrate my AWS EC2 instances to Azure?

Review the [article](./tutorial-migrate-aws-virtual-machines.md) to discover, assess, and migrate your AWS EC2 instances to Azure.

### How does agent-based migration work?

In addition to agentless migration options for VMware virtual machines and Hyper-V virtual machines, the Migration and modernization tool provides an agent-based migration option to migrate Windows and Linux servers running on physical servers, or running as x86/x64 virtual machines on VMware, Hyper-V, AWS, Google Cloud Platform, etc.

The agent-based migration method uses agent software installed on the server being migrated to replicate server data to Azure. The replication process uses an offload architecture in which the agent relays replication data to a dedicated replication server called the replication appliance or Configuration Server (or to a scale-out Process Server). [Learn more](./agent-based-migration-architecture.md) about how the agent-based migration option works.

Note: The replication appliance is different from the Azure Migrate discovery appliance and must be installed on a separate/dedicated machine.

### Where should I install the replication appliance for agent-based migrations?

The replication appliance should be installed on a dedicated machine. The replication appliance shouldn't be installed on a source machine that you want to replicate or on the Azure Migrate appliance (used for discovery and assessment) you may have installed before. Follow the [tutorial](./tutorial-migrate-physical-virtual-machines.md) for more details.

### Can I migrate AWS VMs running Amazon Linux Operating system?

VMs running Amazon Linux can't be migrated as-is as Amazon Linux OS is only supported on AWS.
To migrate workloads running on Amazon Linux, you can spin up a CentOS/RHEL VM in Azure and migrate the workload running on the AWS Linux machine using a relevant workload migration approach. For example, depending on the workload, there may be workload-specific tools to aid the migration – such as for databases or deployment tools in case of web servers.

### How do I gauge the bandwidth requirement for my migrations?

Bandwidth for replication of data to Azure depends on a range of factors and is a function of how fast the on-premises Azure Migrate appliance can read and replicate the data to Azure. Replication has two phases: initial replication and delta replication.

When replication starts for a VM, an initial replication cycle occurs in which full copies of the disks are replicated. After the initial replication is completed, incremental replication cycles (delta cycles) are scheduled periodically to transfer any changes that have occurred since the previous replication cycle.

For an agent-based method of replication, the Deployment Planner can help profile the environment for the data churn and help predict the necessary bandwidth requirement. To learn more, view this [article](./agent-based-migration-architecture.md#plan-vmware-deployment)

## Agentless Hyper-V migration

### How does agentless migration work?

The Migration and modernization tool provides agentless replication options for the migration of VMware virtual machines and Hyper-V virtual machines running Windows or Linux. The tool also provides an additional agent-based replication option for Windows and Linux servers that can be used to migrate physical servers, as well as x86/x64 virtual machines on VMware, Hyper-V, AWS, GCP, etc. The agent-based replication option requires the installation of agent software on the server/virtual machine that’s being migrated, whereas in the agentless option no software needs to be installed on the virtual machines themselves, thus offering additional convenience and simplicity over the agent-based replication option.

The agentless replication option works by using mechanisms provided by the virtualization provider (VMware, Hyper-V).  In the case of Hyper-V virtual machines, the agentless replication mechanism uses VM snapshots and the change tracking capability of the Hyper-V replica to replicate data from virtual machine disks.

When replication is configured for a virtual machine, it first goes through an initial replication phase. During initial replication, a VM snapshot is taken, and a full copy of data from the snapshot disks are replicated to managed disks in your subscription. After initial replication for the VM is complete, the replication process transitions to an incremental replication (delta replication) phase. In the incremental replication phase, data changes that have occurred since the last completed replication cycle are periodically replicated and applied to the replica managed disks, thus keeping replication in sync with changes happening on the VM. In the case of VMware virtual machines, VMware changed block tracking technology is used to keep track of changes between replication cycles. At the start of the replication cycle, a VM snapshot is taken and changed block tracking is used to get the changes between the current snapshot and the last successfully replicated snapshot. That way only data that has changed since the last completed replication cycle needs to be replicated to keep replication for the VM in sync. At the end of each replication cycle, the snapshot is released, and snapshot consolidation is performed for the virtual machine. Similarly, in the case of Hyper-V virtual machines, the Hyper-V replica change tracking engine is used to keep track of changes between consecutive replication cycles.

When you perform the migrate operation on a replicating virtual machine, you've the option to shut down the on-premises virtual machine, and perform one final incremental replication to ensure zero data loss. On performing the migration, the replica managed disks corresponding to the virtual machine are used to create the virtual machine in Azure.

To get started, refer the [Hyper-V agentless migration](./tutorial-migrate-hyper-v.md) tutorial.

### How do I gauge the bandwidth requirement for my migrations?

Bandwidth for replication of data to Azure depends on a range of factors and is a function of how fast the on-premises Azure Migrate appliance can read and replicate the data to Azure. Replication has two phases: initial replication and delta replication.

When replication starts for a VM, an initial replication cycle occurs in which full copies of the disks are replicated. After the initial replication is completed, incremental replication cycles (delta cycles) are scheduled periodically to transfer any changes that have occurred since the previous replication cycle.

You can work out the bandwidth requirement based on the volume of data needed to be moved in the wave and time within which you would like initial replication to complete (ideally you’d want initial replication to have completed at least 3-4 days prior to the actual migration window to give you sufficient time to perform a test migration prior to the actual window and to keep downtime to a minimum during the window).

## Next steps

Read the [Azure Migrate overview](migrate-services-overview.md).
