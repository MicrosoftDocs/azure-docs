---
title: Common Questions About the Migration and Modernization Tool
description: Get answers to common questions about using Azure Migrate Migration and modernization to migrate machines.
author: piyushdhore-microsoft
ms.author: piyushdhore
ms.manager: vijain
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 10/25/2024
ms.custom: engagement-fy25
---

# Migration and modernization: Common questions

This article answers common questions about the Azure Migrate Migration and modernization tool. If you have other questions, check these resources:

* Get [general information](resources-faq.md) about Azure Migrate.
* Read common questions about the [Azure Migrate appliance](common-questions-appliance.md).
* Learn more about [discovery, assessment, and dependency visualization](common-questions-discovery-assessment.md).
* Ask questions in the [Azure Migrate forum](https://aka.ms/AzureMigrateForum).

> [!CAUTION]
> This article references CentOS, a Linux distribution that is end-of-life status. Consider your use and planning accordingly. For more information, see the [CentOS end-of-life guidance](/azure/virtual-machines/workloads/centos/centos-end-of-life).

## General questions

### What are the migration options in Migration and modernization?

The Migration and modernization tool offers agentless migration and agent-based migration for migrating your source servers and virtual machines to Azure.

Regardless of which migration option you choose, the first step in migrating a server by using the Migration and modernization tool is to start replication for the server. This process performs an initial replication of your virtual machine (VM)/server data to Azure. When the operation completes the initial replication, it establishes an ongoing delta replication (delta sync) to migrate incremental data to Azure. Once the operation reaches the delta-sync stage, you can choose to migrate to Azure at any time.

Consider the following information as you decide which migration option to use.

Agentless migrations don't require that you deploy any software (agents) on the source VMs/servers being migrated. The agentless option orchestrates replication by integrating with the functionality provided by the virtualization provider.

Agentless replication options are available for [VMware VMs](tutorial-migrate-vmware.md) and [Hyper-V VMs](./tutorial-migrate-hyper-v.md).

Agent-based migrations require that you install Azure Migrate software (agents) on the source VMs/machines that you're migrating. The agent-based option doesn’t rely on the virtualization platform for the replication functionality. It can be used with any server that runs an x86/x64 architecture and a version of an operating system supported by the agent-based replication method.

The agent-based migration option can be used for [VMware VMs](tutorial-migrate-vmware-agent.md), [Hyper-V VMs](./tutorial-migrate-physical-virtual-machines.md), [physical servers](./tutorial-migrate-physical-virtual-machines.md), [VMs that run on AWS](./tutorial-migrate-aws-virtual-machines.md), VMs that run on GCP, or VMs that run on a different virtualization provider. Agent-based migration treats your machines as physical servers for migration.

While agentless migration offers convenience and simplicity over agent-based replication options for the supported scenarios (VMware and Hyper-V), you might want to consider using the agent-based scenario for the following use cases:

* Environments constrained by input/output operations per second (IOPS): Agentless replication uses snapshots and consumes storage IOPS/bandwidth. We recommend the agent-based migration method if there are constraints on storage/IOPS in your environment.
* No vCenter Server: If you don't have a vCenter Server, you can treat your VMware VMs as physical servers and use the agent-based migration workflow.

To learn more, review [Select a VMware migration option](./server-migrate-overview.md).

### What geographies are supported for migration with Azure Migrate?

Review the supported geographies for [public clouds](migrate-support-matrix.md#public-cloud) and [government clouds](migrate-support-matrix.md#azure-government).

### Can I use the same Azure Migrate project to migrate to multiple regions?

Although you can create assessments for multiple regions in an Azure Migrate project, one Azure Migrate project can be used to migrate servers to only one Azure region. You can create more Azure Migrate projects for each region that you need to migrate to.

* For agentless VMware migrations, the target region is locked once you enable the first replication.
* For agent-based migrations (VMware, physical servers, and servers from other clouds), the target region is locked once the **Create Resources** button is selected on the portal while you set up the replication appliance.
* For agentless Hyper-V migrations, the target region is locked once the **Create Resources** button is selected on the portal while you set up the Hyper-V replication provider.

### Can I use the same Azure Migrate project to migrate to multiple subscriptions?

Yes, you can migrate to multiple subscriptions (with the same Azure tenant) in the same target region for an Azure Migrate project. You can select the target subscription while enabling replication for a machine or a set of machines.

The target region is locked:

* After the first replication for agentless VMware migrations.
* During the replication appliance for agent-based migrations.
* During Hyper-V provider installation for agentless Hyper-V migrations.

### Does Azure Migrate support Azure Resource Graph?
Currently, Azure Migrate isn't integrated with Azure Resource Graph, but it does support performing Azure Resource Graph-related queries.

### How is the data transmitted from an on-premises environment to Azure? Is it encrypted before transmission?

With agentless replication, the Azure Migrate appliance compresses and encrypts data before uploading it. Data is transmitted over a secure communication channel over https and uses TLS 1.2 or later. Additionally, Azure Storage automatically encrypts your data when it persists it to the cloud (encryption at rest).

### Can I use the recovery services vault created by Azure Migrate for disaster recovery scenarios?
We don't recommend using the recovery services vault created by Azure Migrate for disaster recovery scenarios, because that can result in start replication failures in Azure Migrate.

### What is the difference between the Test Migration and Migrate operations?

Test migration provides a way to test and validate migrations before the actual migration. Test migration works by letting you use a sandbox environment in Azure to test the virtual machines before actual migration. The sandbox environment is demarcated by a test virtual network that you specify. The test migration operation is nondisruptive, provided the test VNet is sufficiently isolated. A VNet is sufficiently isolated when you design the inbound and outbound connection rules to avoid unwanted connections. For example, you restrict connection to on-premises machines.

The applications can continue to run at the source while you're able to perform tests on a cloned copy in an isolated sandbox environment. You can perform multiple tests, as needed, to validate the migration, perform app testing, and address any issues before the actual migration.

:::image type="content" source="./media/common-questions-server-migration/difference-migration-test-migration.png" alt-text="Screenshot that shows the difference between a test and actual migration.":::

### Is there a rollback option for Azure Migrate?

You can use the **Test Migration** option to validate your application functionality and performance in Azure. You can perform any number of test migrations and can execute the final migration after you establish confidence through the test migration operation.

A test migration doesn’t affect the on-premises machine, which remains operational and continues replicating until you perform the actual migration. If there are any errors during the test migration, you can choose to postpone the final migration and keep your source VM/server running and replicating to Azure. You can reattempt the final migration once you resolve the errors.

 > [!NOTE]
>
> Once you've performed a final migration to Azure and the on-premises source machine is shut down, you can't perform a rollback from Azure to your on-premises environment.

### Can I select the virtual network and subnet to use for test migrations?

You can select a virtual network for test migrations. Azure Migrate automatically selects a subnet based on the following logic:

* If a target subnet (other than default) is specified as an input while enabling replication, Azure Migrate prioritizes using a subnet with the same name in the virtual network that you select for the test migration.
* If a subnet with the same name isn't found, then Azure Migrate alphabetically selects the first available subnet that isn't a gateway/application gateway/firewall/bastion subnet.

### Why is the Test Migration button disabled for my Server?

The **Test Migration** button might be disabled in the following scenarios:

* You can’t begin a test migration until an initial replication (IR) is completed for the VM. The **Test Migration** button is disabled until the IR process is completed. You can perform a test migration once your VM is in a delta-sync stage.
* The button can be disabled if a test migration was already completed, but a test-migration cleanup wasn't performed for that VM. Perform a test migration cleanup and retry the operation.

### What happens if I don’t clean up my test migration?

A test migration simulates the actual migration by creating a test Azure VM using replicated data. The server is deployed with a point-in-time copy of the replicated data to the target Resource Group (selected while enabling replication) with a “-test” suffix. Test migrations are intended to validate server functionality so that post-migration problems are minimized. If the test migration isn't cleaned up after testing, the test VM continues to run in Azure, and incurs charges. To clean up after a test migration, go to the **Replicating machines** view in the Migration and modernization tool, and use the **Cleanup test migration** action on the machine.

### How do I know if my VM was successfully migrated?

Once you migrate your VM/server successfully, you can view and manage the VM from the **Virtual Machines** pane. Connect to the migrated VM to validate.

Alternatively, you can review the **Job status** for the operation to check if the migration was successfully completed. If you see any errors, resolve them, and retry the migration operation.

### What happens if I don’t stop replication after migration?

When you stop replication, the Migration and modernization tool cleans up the managed disks in the subscription that was created for replication.

### What happens if I don’t complete migration after migration?

When you select **Complete Migration**, the Migration and modernization tool cleans up the managed disks in the subscription that were created for replication. If you don't select **Complete migration** after a migration, you continue to incur charges for these disks. **Complete migration** doesn't affect the disks attached to machines that already migrated.

### How can I migrate UEFI-based machines to Azure as Azure generation 1 VMs?
The Migration and modernization tool migrates UEFI-based machines to Azure as Azure generation 2 VMs. If you want to migrate them as Azure generation 1 VMs, convert the boot-type to BIOS before starting replication, and then use the Migration and modernization tool to migrate to Azure.

### Does Azure Migrate convert UEFI-based machines to BIOS-based machines and migrate them to Azure as Azure generation 1 VMs?
The Migration and modernization tool migrates all the UEFI-based machines to Azure as Azure generation 2 VMs. We no longer support the conversion of UEFI-based VMs to BIOS-based VMs. All the BIOS-based machines are migrated to Azure as Azure generation 1 VMs only.

### Which operating systems are supported for migration of UEFI-based machines to Azure?

 > [!Note]
> If a major version of an operating system is supported in agentless migration, all minor versions and kernels are automatically supported.

| **Operating systems supported for UEFI-based machines** | **Agentless VMware to Azure**                                                                                                             | **Agentless Hyper-V to Azure** | **Agent-based VMware, physical, and other clouds to Azure** |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------- |
| Windows Server 2025, 2022, 2019, 2016, 2012 R2, 2012                | Y                                                                                                                                         | Y                              | Y                                                          |
| Windows 11 Pro, Windows 11 Enterprise                   | Y                                                                                                                                         | Y                              | Y                                                          |
| Windows 10 Pro, Windows 10 Enterprise                   | Y                                                                                                                                         | Y                              | Y                                                          |
| SUSE Linux Enterprise Server 15 SP1, SP2, SP3, SP4, SP5, SP6                    | Y                                                                                                                                         | Y                              | Y                                                          |
| SUSE Linux Enterprise Server 12 SP4                     | Y                                                                                                                                         | Y                              | Y                                                          |
| Ubuntu Server 22.04 LTS, 20.04 LTS, 18.04 LTS, 16.04 LTS               | Y                                                                                                                                         | Y                              | Y                                                          |
| RHEL 9.x, 8.1, 8.0, 7.8, 7.7, 7.6, 7.5, 7.4, 7.0, 6.x        | Y      | Y                              | Y                                                          |
| CentOS Stream               | Y | Y                              | Y                                                          |
| Oracle Linux 9, 8, 7.7-CI, 7.7, 6                             |  Y                                                                                                                                        | Y                              | Y                                                          |

### Can I migrate Active Directory domain controllers using Azure Migrate?

The Migration and modernization tool is application agnostic and works for most applications. When you migrate a server by using the Migration and modernization tool, all the applications installed on the server are migrated with it. However, for some applications, alternate migration methods might be better suited for the migration. For Active Directory, in a hybrid environment when the on-premises site is connected to your Azure environment, you can extend your Directory into Azure by adding extra domain controllers in Azure and setting up Active Directory replication. If you're migrating into an isolated environment in Azure that requires its own domain controllers (or testing applications in a sandbox environment), you can migrate servers by using the Migration and modernization tool.

### Can I upgrade my OS while migrating?

The Migration and modernization tool now supports upgrading Windows OS during migration. This option isn't currently available for Linux. Get more details on [Windows OS upgrade](how-to-upgrade-windows.md).

### Do I need VMware vCenter to migrate VMware VMs?

To [migrate VMware VMs](server-migrate-overview.md) by using VMware agent-based or agentless migration, the ESXi hosts on which VMs are located must be managed by vCenter Server. If you don't have vCenter Server, you can migrate VMware VMs by migrating them as physical servers. [Learn more](migrate-support-matrix-physical-migration.md).

### Can I consolidate multiple source VMs into one VM while migrating?

Migration and modernization capabilities currently support like-for-like migrations. We don't support consolidating servers during the migration.

### Will Windows Server 2008 and 2008 R2 be supported in Azure after migration?

You can migrate your on-premises Windows Server 2008 and 2008 R2 servers to Azure virtual machines and get extended security updates for three years after the end-of-support dates at no extra charge above the cost of running the VM. You can use the Migration and modernization tool to migrate your Windows Server 2008 and 2008 R2 workloads.

### How do I migrate Windows Server 2003 that runs on VMware/Hyper-V to Azure?

[Windows Server 2003 extended support](/troubleshoot/azure/virtual-machines/run-win-server-2003#microsoft-windows-server-2003-end-of-support) ended on July 14, 2015. The Azure support team continues to help in troubleshooting issues that concern running Windows Server 2003 on Azure. However, this support is limited to issues that don't require OS-level troubleshooting or patches.

Migrating your applications to Azure instances that run a newer version of Windows Server is the recommended approach to ensure that you're effectively using the flexibility and reliability of the Azure cloud.

However, if you still choose to migrate your Windows Server 2003 to Azure, you can use the Migration and modernization tool if your Windows Server is a VM that runs on VMware or Hyper-V. Review this article to [prepare your Windows Server 2003 machines for migration](./prepare-windows-server-2003-migration.md).

## Agentless VMware migration

### How does agentless migration work?

The Migration and modernization tool provides agentless replication options for the migration of VMware virtual machines and Hyper-V virtual machines that run Windows or Linux. The tool also provides another agent-based replication option for Windows and Linux servers that can be used to migrate physical servers, and x86/x64 virtual machines on VMware, Hyper-V, AWS, GCP, etc.

Agent-based replication requires the installation of agent software on the VM/server that’s being migrated. The agentless option doesn't require any software to be installed on the VMs themselves, offering more convenience and simplicity than the agent-based option.

The agentless replication option uses mechanisms provided by the virtualization provider (VMware, Hyper-V). For VMware VMs, the agentless replication mechanism uses VMware snapshots and VMware changed-block tracking technology to replicate data from VM disks. This mechanism is similar to the one used by many backup products. For Hyper-V virtual machines, the agentless replication mechanism uses VM snapshots and the change-tracking capability of the Hyper-V replica to replicate data from VM disks.

When replication is configured for a VM, it first goes through an initial replication phase. During initial replication, a VM snapshot is taken, and a full copy of data from the snapshot disks are replicated to managed disks in your subscription. After initial replication for the VM is complete, the replication process transitions to an incremental replication (delta replication) phase.

In the incremental replication phase, data changes that occurred since the last completed replication cycle are periodically replicated and applied to the replica-managed disks, which keeps replication in sync with changes on the VM. For VMware virtual machines, VMware changed block tracking technology is used to keep track of changes between replication cycles. At the start of the replication cycle, a VM snapshot is taken and changed block tracking is used to compile the changes between the current snapshot and the last successfully replicated snapshot. That way, only data that has changed since the last completed replication cycle needs to be replicated to keep replication for the VM in sync.

At the end of each replication cycle, the snapshot is released, and snapshot consolidation is performed for the VM. Similarly, for Hyper-V virtual machines, the Hyper-V replica-change tracking engine is used to keep track of changes between consecutive replication cycles.

When you perform the migrate operation on a replicating VM, you can shut down the on-premises VM, and perform one final incremental replication to ensure zero data loss. On performing the migration, the replica-managed disks corresponding to the VM are used to create the VM in Azure.

To get started, refer the [VMware agentless migration](tutorial-migrate-vmware.md) and [Hyper-V agentless migration](./tutorial-migrate-hyper-v.md) tutorials.

### How do I gauge the bandwidth requirement for my migrations?

Bandwidth for replication of data to Azure depends on a range of factors and is a function of how fast the on-premises Azure Migrate appliance can read and replicate the data to Azure. Replication has two phases: initial replication and delta replication.

When Azure Migrate starts replication for a VM, there's an initial replication cycle. In that cycle, Azure Migrate replicates full copies of the disk. After it completes initial replication, it schedules periodic incremental replication cycles (delta cycles) that transfer any changes that occurred since the previous replication cycle.

You can work out the bandwidth requirement based on:

* The volume of data you need to move in the wave.
* The time you want to allot for initial replication to complete.

Ideally, you’d want initial replication to be complete at least 3-4 days before the actual migration window. This timeline gives you sufficient time to perform a test migration before the actual window and keep downtime during the window to a minimum.

You can estimate the bandwidth or time needed for agentless VMware VM migration by using the following formula:

* Time to complete initial replication =  {size of disks (or used size if available) * 0.7 (assuming a 30 percent compression average – conservative estimate)}/bandwidth available for replication.

### How do I throttle replication when using Azure Migrate appliance for agentless VMware replication?

You can throttle by using a network quality of service policy (NetQosPolicy). Note that this throttling is applicable to only the outbound connections from the Azure Migrate appliance. For example:

The AppNamePrefix to use in the NetQosPolicy is "GatewayWindowsService.exe". You could create a policy on the Azure Migrate appliance to throttle replication traffic from the appliance by creating a policy such as this one:

```powershell
New-NetQosPolicy -Name "ThrottleReplication" -AppPathNameMatchCondition "GatewayWindowsService.exe" -ThrottleRateActionBitsPerSecond 1MB
```

In order to increase and decrease replication bandwidth based on a schedule, you can use Windows scheduled tasks to scale the bandwidth as needed. One task is used to decrease the bandwidth, and another task is used to increase the bandwidth.

Note: You need to create the NetQosPolicy mentioned previous before executing the commands below.

```powershell
#Replace with an account that's part of the local Administrators group
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

#Timezone set on the Azure Migrate Appliance (VM) is used; change the frequency to meet your needs
#In this example, the bandwidth is being throttled every weekday at 8:00 AM local time
#The bandwidth is being increased every weekday at 6:00 PM local time
$ThrottleBandwidthTrigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday,Tuesday,Wednesday,Thursday,Friday -At 8:00am
$IncreaseBandwidthTrigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday,Tuesday,Wednesday,Thursday,Friday -At 6:00pm

#Setting the task action to execute the scripts
$ThrottleBandwidthAction = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-executionpolicy bypass -noprofile -file $ThrottleBandwidthScript"
$IncreaseBandwidthAction = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-executionpolicy bypass -noprofile -file $IncreaseBandwidthScript"

#Creating the scheduled tasks
Register-ScheduledTask -TaskName $ThrottleBandwidthTask -Trigger $ThrottleBandwidthTrigger -User $User -Action $ThrottleBandwidthAction -RunLevel Highest -Force
Register-ScheduledTask -TaskName $IncreaseBandwidthTask -Trigger $IncreaseBandwidthTrigger -User $User -Action $IncreaseBandwidthAction -RunLevel Highest -Force
```

### How does churn rate affect agentless replication?

Because agentless replication folds in data, the *churn pattern* is more important than the *churn rate*. When a file is written again and again, the rate doesn't have much impact. However, a pattern in which every other sector is written causes high churn in the next cycle. Because we minimize the amount of data we transfer, we allow the data to fold as much as possible before we schedule the next cycle.

### How frequently is a replication cycle scheduled?

The formula to schedule the next replication cycle is: (Previous cycle time / 2) or one hour, whichever is higher.

For example, if a VM takes four hours for a delta cycle, the next cycle is scheduled in two hours, and not in the next hour. There's one exception: Immediately after initial replication, the first delta cycle is scheduled immediately.

### I deployed two (or more) appliances to discover VMs in my vCenter Server. However, when I try to migrate the VMs, I only see VMs corresponding to one of the appliances.

If there are multiple appliances set up, there can be no overlap among the VMs on the vCenter accounts provided. A discovery with such an overlap is an unsupported scenario.

### How does agentless replication affect VMware servers?

Agentless replication results in some performance impact on VMware vCenter Server and VMware ESXi hosts. Because agentless replication uses snapshots, it consumes IOPS on storage, so some IOPS storage bandwidth is required. We don't recommend using agentless replication if you have constraints on storage or IOPs in your environment.

### Can powered-off VMs be replicated?

Replication of VMware VMs while they're powered off is supported, but only in the agentless approach. However, it's crucial that you understand that we can't guarantee the VM will boot successfully, as we can't verify its operational state before replication. Therefore, we highly recommend that you perform a test migration to ensure everything proceeds smoothly during the actual migration. This method can be useful when the initial replication process is lengthy, or for high-churn VMs, such as database servers or other disk-intensive workloads.

### Can I use Azure Migrate to migrate my web apps to Azure App Service?

You can perform at-scale agentless migration of ASP.NET web apps that run on IIS web servers hosted on a Windows OS in a VMware environment. Learn more by reading [Modernize ASP.NET web apps to Azure App Service code.](./tutorial-modernize-asp-net-appservice-code.md)


## Agent-based Migration

### How can I migrate my AWS EC2 instances to Azure?

Review [Discover, assess, and migrate Amazon Web Services (AWS) VMs to Azure](./tutorial-migrate-aws-virtual-machines.md).

### How does agent-based migration work?

In addition to agentless migration options for VMware virtual machines and Hyper-V virtual machines, the Migration and modernization tool provides an agent-based migration option to migrate Windows and Linux servers that run on physical servers, or that run as x86/x64 virtual machines on VMware, Hyper-V, AWS, Google Cloud Platform, etc.

The agent-based migration method uses agent software that's installed on the server that's being migrated to replicate server data to Azure. The replication process uses an offload architecture in which the agent relays replication data to a dedicated replication server called the replication appliance or Configuration Server (or to a scale-out Process Server). See [Agent-based migration architecture](./agent-based-migration-architecture.md) for more details.

 > [!NOTE]
>
>The replication appliance is different than the Azure Migrate discovery appliance and must be installed on a separate/dedicated machine.

### Where should I install the replication appliance for agent-based migrations?

The replication appliance should be installed on a dedicated machine. The replication appliance shouldn't be installed on a source machine that you want to replicate or on the Azure Migrate appliance (used for discovery and assessment) you might have installed before. Read [Migrate machines as physical servers to Azure](./tutorial-migrate-physical-virtual-machines.md) for more details.

### Can I migrate AWS VMs that run Amazon Linux Operating system?

VMs that run Amazon Linux can't be migrated as-is, because Amazon Linux OS is supported only on AWS.

To migrate workloads that run on Amazon Linux, you can spin up a CentOS/RHEL VM in Azure and migrate the workload that runs on the AWS Linux machine by using a relevant workload migration approach. For example, depending on the workload, there might be workload-specific tools to aid the migration – such as tools for databases or deployment tools for web servers.

### How do I gauge the bandwidth requirement for my migrations?

Bandwidth for replication of data to Azure depends on a range of factors and is a function of how fast the on-premises Azure Migrate appliance can read and replicate the data to Azure. Replication has two phases: initial replication and delta replication.

When replication starts for a VM, an initial replication cycle occurs in which full copies of the disks are replicated. After the initial replication is completed, incremental replication cycles (delta cycles) are scheduled periodically to transfer any changes that occurred since the previous replication cycle.

For an agent-based method of replication, the Azure Site Recovery Deployment Planner can help profile the environment for the data churn and help predict the necessary bandwidth requirement. To learn more, read [Plan VMware deployment](./agent-based-migration-architecture.md#plan-vmware-deployment)

## Agentless Hyper-V migration

### How does agentless migration work?

The Migration and modernization tool provides agentless replication options for the migration of VMware virtual machines and Hyper-V virtual machines that run Windows or Linux.

The tool also provides another agent-based replication option for Windows and Linux servers that can be used to migrate physical servers, and x86/x64 virtual machines on VMware, Hyper-V, AWS, GCP, etc. The agent-based replication option requires the installation of agent software on the VM/server that’s being migrated, whereas in the agentless option no software needs to be installed on the virtual machines themselves, thus offering more convenience and simplicity over the agent-based replication option.

The agentless replication option works by using mechanisms provided by the virtualization provider (VMware, Hyper-V).  For Hyper-V virtual machines, the agentless replication mechanism uses VM snapshots and the change tracking capability of the Hyper-V replica to replicate data from VM disks.

When replication is configured for a VM, it first goes through an initial replication phase. During initial replication, a VM snapshot is taken, and a full copy of data from the snapshot disks are replicated to managed disks in your subscription.

After initial replication for the VM is complete, the replication process transitions to an incremental replication (delta replication) phase. In the incremental replication phase, data changes that have occurred since the last completed replication cycle are periodically replicated and applied to the replica managed disks, thus keeping replication in sync with changes happening on the VM.

For VMware virtual machines, VMware changed block tracking technology is used to keep track of changes between replication cycles. At the start of the replication cycle, a VM snapshot is taken and changed block tracking is used to get the changes between the current snapshot and the last successfully replicated snapshot. That way only data that has changed since the last completed replication cycle needs to be replicated to keep replication for the VM in sync.

At the end of each replication cycle, the snapshot is released, and snapshot consolidation is performed for the VM. Similarly, for Hyper-V virtual machines, the Hyper-V replica change tracking engine is used to keep track of changes between consecutive replication cycles.

When you perform the migrate operation on a replicating VM, you have the option to shut down the on-premises VM, and perform one final incremental replication to ensure zero data loss. On performing the migration, the replica managed disks corresponding to the VM are used to create the VM in Azure.

To get started, refer the [Hyper-V agentless migration](./tutorial-migrate-hyper-v.md) tutorial.

### How do I gauge the bandwidth requirement for my migrations?

Bandwidth for replication of data to Azure depends on a range of factors and is a function of how fast the on-premises Azure Migrate appliance can read and replicate the data to Azure. Replication has two phases: initial replication and delta replication.

When Azure Migrate starts replication for a VM, there's an initial replication cycle. In that cycle, Azure Migrate replicates full copies of the disk. After it completes initial replication, it schedules periodic incremental replication cycles (delta cycles) that transfer any changes that occurred since the previous replication cycle.

You can work out the bandwidth requirement based on:

* The volume of data you need to move in the wave.
* The time you want to allot for initial replication to complete.

Ideally, you’d want initial replication to be complete at least 3-4 days before the actual migration window. This timeline gives you sufficient time to perform a test migration before the actual window and keep downtime during the window to a minimum.



## Related content
* Learn more about migrating [VMware VMs](tutorial-migrate-vmware.md), [Hyper-V VMs](tutorial-migrate-hyper-v.md), and [physical servers](tutorial-migrate-physical-virtual-machines.md).
