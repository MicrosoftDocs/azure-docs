---
title: Common Questions About the Migration and Modernization Tool
description: Get answers to common questions about using the Migration and modernization tool to migrate machines.
author: piyushdhore-microsoft
ms.author: piyushdhore
ms.manager: vijain
ms.service: azure-migrate
ms.topic: concept-article
ms.date: 02/07/2025
ms.custom: engagement-fy25
# Customer intent: "As a cloud architect, I want to understand the migration options available with the Migration and Modernization Tool, so that I can effectively plan and execute the migration of our on-premises servers to Azure."
---

# Migration and modernization: Common questions

This article answers common questions about the **Migration and modernization** tool. If you have other questions, check these resources:

* Get [general information](resources-faq.md) about Azure Migrate.
* Read common questions about the [Azure Migrate appliance](common-questions-appliance.md).
* Learn more about [discovery, assessment, and dependency visualization](common-questions-discovery-assessment.md).
* Ask questions in the [Azure Migrate forum](https://aka.ms/AzureMigrateForum).

> [!CAUTION]
> This article references CentOS, a Linux distribution that has an end-of-life status. Consider your use and planning accordingly. For more information, see the [CentOS end-of-life guidance](/azure/virtual-machines/workloads/centos/centos-end-of-life).

## General questions

### What are the migration options with the Migration and modernization tool?

The **Migration and modernization** tool offers agentless and agent-based migration to migrate your source servers and virtual machines (VMs) to Azure.

Regardless of which migration option you choose, the first step to migrate a server by using the **Migration and modernization** tool is to start replication for the server. This process performs an initial replication of your VM/server data to Azure. After the initial replication is completed, an ongoing replication (delta sync) is established that migrates incremental data to Azure. After the operation reaches the delta-sync stage, you can choose to migrate to Azure at any time.

Consider the following information as you decide which migration option to use.

Agentless migrations don't require you to deploy any software (agents) on the source VMs/servers that you're migrating. The agentless option orchestrates replication by integrating with the functionality provided by the virtualization provider.

Agentless replication options are available for [VMware VMs](tutorial-migrate-vmware.md) and [Hyper-V VMs](./tutorial-migrate-hyper-v.md).

Agent-based migrations require that you install Azure Migrate software (agents) on the source VMs that you're migrating. The agent-based option doesn't rely on the virtualization platform for the replication functionality. It can be used with any server that runs an x86/x64 architecture and a version of an operating system that the agent-based replication method supports.

The agent-based migration option can be used for:

* [VMware VMs](tutorial-migrate-vmware-agent.md).
* [Hyper-V VMs](./tutorial-migrate-physical-virtual-machines.md).
* [Physical servers](./tutorial-migrate-physical-virtual-machines.md).
* [VMs running on AWS](./tutorial-migrate-aws-virtual-machines.md).
* VMs running on GCP.
* VMs running on a different virtualization provider.

Agent-based migration treats your machines as physical servers for migration.

Agentless migration offers more convenience and simplicity than agent-based replication options for VMware and Hyper-V VMs. However, you might want to consider using the agent-based scenario for the following use cases:

* Environments constrained by input/output operations per second (IOPS): Agentless replication uses snapshots and consumes storage IOPS/bandwidth. We recommend the agent-based migration method if there are constraints on storage/IOPS in your environment.

* No vCenter Server: If you don't have a vCenter Server, you can treat your VMware VMs as physical servers and use the agent-based migration workflow.

To learn more, review [Select a VMware migration option](./server-migrate-overview.md).

### What geographies are supported for migration with Azure Migrate?

Review the supported geographies for [public](supported-geographies.md#public-cloud) and [government clouds](supported-geographies.md#azure-government).

### Can I use the same Azure Migrate project to migrate to multiple regions?

Although you can create assessments for multiple regions in an Azure Migrate project, one Azure Migrate project can be used to migrate servers to only one Azure region. You can create more Azure Migrate projects for other regions.

* For agentless VMware migrations, the target region is locked when you enable the first replication.
* For agent-based migrations (VMware, physical servers, and servers from other clouds), the target region is locked when the **Create Resources** button is selected on the portal when you set up the replication appliance.
* For agentless Hyper-V migrations, the target region is locked when the **Create Resources** button is selected on the portal when you set up the Hyper-V replication provider.

### Can I use the same Azure Migrate project to migrate to multiple subscriptions?

Yes, you can use the same Azure Migrate project to migrate to multiple subscriptions with the same Azure tenant in the same target region. You can select the target subscription when you enable replication for a machine or a set of machines.

The target region is locked:

* After the first replication for agentless VMware migrations.
* During the replication appliance installation for agent-based migrations.
* During Hyper-V provider installation for agentless Hyper-V migrations.

### Does Azure Migrate support Azure Resource Graph?

Currently, Azure Migrate isn't integrated with Azure Resource Graph. It does support performing Azure Resource Graph-related queries.

### How is the data transmitted from an on-premises environment to Azure? Is it encrypted before transmission?

With agentless replication, the Azure Migrate appliance compresses and encrypts data before uploading it. Data is transmitted over a secure communication channel over https and uses TLS 1.2 or later. Additionally, Azure Storage automatically encrypts your data when it persists the data to the cloud (encryption at rest).

### Can I use the recovery services vault created by Azure Migrate for disaster recovery scenarios?

We don't recommend using the recovery services vault created by Azure Migrate for disaster recovery scenarios, because that can result in start replication failures in Azure Migrate.

### What is the difference between the Test Migration and Migrate operations?

The **Test Migration** option allows you to test and validate migrations before the actual migration. **Test Migration** works by letting you use a sandbox environment in Azure to test the VMs before actual migration. A test virtual network that you specify demarcates the sandbox environment. The **Test Migration** operation is nondisruptive, as long as the test virtual network is sufficiently isolated. A virtual network is sufficiently isolated when you design the inbound and outbound connection rules to avoid unwanted connections. For example: you restrict connection to on-premises machines.

The applications can continue to run at the source while you perform tests on a cloned copy in an isolated sandbox environment. You can perform multiple tests, as needed, to validate the migration, perform app testing, and address any issues before the actual migration.

:::image type="content" source="./media/common-questions-server-migration/difference-migration-test-migration.png" alt-text="Screenshot that shows the difference between a test and actual migration.":::

### Is there a rollback option for Azure Migrate?

You can use the **Test Migration** option to validate your application functionality and performance in Azure. You can perform any number of test migrations and can do the final migration after you establish confidence through the **Test Migration** operation.

A test migration doesn't affect the on-premises machine, which remains operational and continues replicating until you perform the actual migration. If there are any errors during user acceptance testing (UAT) for the test migration, you can choose to postpone the final migration and keep your source VM/server running and replicating to Azure. You can reattempt the final migration after you resolve the errors.

> [!NOTE]
> After you perform a final migration to Azure and the on-premises source machine is shut down, you can't perform a rollback from Azure to your on-premises environment.

### Can I select the virtual network and subnet to use for test migrations?

You can select a virtual network for test migrations. Azure Migrate automatically selects a subnet based on the following logic:

* If you specify a target subnet (other than default) as an input while enabling replication, Azure Migrate prioritizes a subnet with the same name in the virtual network used for the test migration.
* If a subnet with the same name isn't found, Azure Migrate alphabetically selects the first available subnet that isn't a gateway, application gateway, firewall, or Azure Bastion subnet.

### Why is the Test Migration button disabled for my server?

The **Test Migration** button could be disabled in the following scenarios:

* You can't begin a test migration until an initial replication is completed for the VM. The **Test Migration** button is disabled until the initial replication process is completed. You can perform a test migration after your VM is in a delta-sync stage.
* The button can be disabled if a test migration was already completed but a test-migration cleanup wasn't performed for that VM. Perform a test migration cleanup and retry the operation.

### What happens if I don’t clean up my test migration?

A test migration simulates the actual migration by creating a test Azure VM by using replicated data. The server is deployed with a point-in-time copy of the replicated data to the target resource group (selected when you enable replication) with a `-test` suffix. Test migrations are intended to validate server functionality to minimize post-migration problems.

If the test migration isn't cleaned up after testing, the test VM continues to run in Azure and incurs charges. To clean up after a test migration, go to the **Replicating machines** view in the **Migration and modernization** tool, and use the **Cleanup test migration** action on the machine.

### How do I know if my VM successfully migrated?

After you migrate your VM/server successfully, you can view and manage the VM from the **Virtual Machines** pane. Connect to the migrated VM to validate.

You can also review the **Job status** for the operation to check if the migration was successfully completed. If you see any errors, resolve them and then retry the migration operation.

### What happens if I don't stop replication after migration?

When you stop replication, the **Migration and modernization** tool cleans up the managed disks in the subscription that was created for replication.

### What happens if I don't select Complete Migration after a migration?

When you select **Complete Migration**, the **Migration and modernization** tool cleans up the managed disks in the subscription that were created for replication. If you don't select **Complete migration** after a migration, you continue to incur charges for these disks. **Complete migration** doesn't affect the disks attached to machines that already migrated.

### How can I migrate UEFI-based machines to Azure as Azure generation 1 VMs?

The **Migration and modernization** tool migrates UEFI-based machines to Azure as Azure generation 2 VMs. If you want to migrate them as Azure generation 1 VMs, convert the boot type to BIOS before starting replication, and then use the **Migration and modernization** tool to migrate to Azure.

### Does Azure Migrate convert UEFI-based machines to BIOS-based machines and migrate them to Azure as Azure generation 1 VMs?

The **Migration and modernization** tool migrates all the UEFI-based machines to Azure as Azure generation 2 VMs. We no longer support the conversion of UEFI-based VMs to BIOS-based VMs. All the BIOS-based machines are migrated to Azure only as Azure generation 1 VMs.

### Which operating systems are supported for migration of UEFI-based machines to Azure?

> [!NOTE]
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

### Can I migrate Active Directory domain controllers by using Azure Migrate?

The **Migration and modernization** tool is application agnostic and works for most applications. When you migrate a server by using the **Migration and modernization** tool, all the applications that you install on the server are migrated with it. However, alternate migration methods might be better suited to migrate some applications.

For Active Directory, the type of environment can be a factor. In a hybrid environment with an on-premises site connected to your Azure environment, you can extend your directory into Azure by adding extra domain controllers and setting up Active Directory replication. You can use the **Migration and modernization** tool if you're:

* Migrating into an isolated environment in Azure that requires its own domain controllers.
* Testing applications in a sandbox environment.

### Can I upgrade my OS while migrating?

The **Migration and modernization** tool now supports Windows OS upgrade during migration. This option isn't currently available for Linux. Get more details on [Windows OS upgrade](how-to-upgrade-windows.md).

### Do I need VMware vCenter to migrate VMware VMs?

For you to [migrate VMware VMs](server-migrate-overview.md) by using VMware agent-based or agentless migration, vCenter Server must manage the ESXi hosts on which VMs are located. If you don't have vCenter Server, you can migrate VMware VMs as physical servers. [Learn more](migrate-support-matrix-physical-migration.md).

### Can I consolidate multiple source VMs into one VM while migrating?

The **Migration and modernization** tool currently supports like-for-like migrations. We don't support consolidating servers during the migration.

### Will Windows Server 2008 and 2008 R2 be supported in Azure after migration?

You can migrate your on-premises Windows Server 2008 and 2008 R2 servers to Azure VMs and get extended security updates for three years after the end-of-support dates at no extra charge above the cost of running the VM. You can use the **Migration and modernization** tool to migrate your Windows Server 2008 and 2008 R2 workloads.

### How do I migrate Windows Server 2003 running on VMware/Hyper-V to Azure?

[Windows Server 2003 extended support](/troubleshoot/azure/virtual-machines/run-win-server-2003#microsoft-windows-server-2003-end-of-support) ended on July 14, 2015. The Azure support team continues to help troubleshoot issues that concern running Windows Server 2003 on Azure. However, this support is limited to issues that don't require OS-level troubleshooting or patches.

We recommend that you migrate your applications to Azure instances running a newer version of Windows Server to ensure that you're effectively using the flexibility and reliability of the Azure cloud.

If you still choose to migrate Windows Server 2003 to Azure, you can use the **Migration and modernization** tool if your Windows Server deployment is a VM that runs on VMware or Hyper-V. For more information, see [Prepare your Windows Server 2003 machines for migration](./prepare-windows-server-2003-migration.md).

## Agentless VMware migration

### How does agentless migration work?

The **Migration and modernization** tool provides agentless replication options for the migration of VMware and Hyper-V VMs running Windows or Linux. The tool provides another agent-based replication option for Windows and Linux servers. This other option can be used to migrate physical servers and x86/x64 VMs on providers like VMware, Hyper-V, AWS, and GCP.

Agent-based replication requires that you install agent software on the VM/server that you're migrating. The agentless option doesn't require you to install software on the VMs, which can offer convenience and simplicity.

The agentless replication option uses mechanisms provided by the virtualization provider (VMware or Hyper-V). For VMware VMs, the agentless replication mechanism uses VMware snapshots and VMware changed-block tracking technology to replicate data from VM disks. Many backup products use a similar mechanism. For Hyper-V VMs, the agentless replication mechanism uses VM snapshots and the change-tracking capability of the Hyper-V replica to replicate data from VM disks.

When replication is configured for a VM, the VM first goes through an initial replication phase. During initial replication, a VM snapshot is taken, and a full copy of data from the snapshot disks is replicated to managed disks in your subscription. After initial replication for the VM finishes, the replication process transitions to an incremental replication (delta replication) phase.

The incremental replication phase addresses any data changes that occurred since the last completed replication cycle. Those changes are periodically replicated and applied to the replica-managed disks. This process keeps replication in sync with changes on the VM.

VMware changed-block tracking technology keeps track of changes between replication cycles for VMware VMs. At the start of the replication cycle, a VM snapshot is taken and changed-block tracking is used to compile the changes between the current snapshot and the last successfully replicated snapshot. To keep replication for the VM in sync, only data that changed since the last completed replication cycle needs to be replicated.

At the end of each replication cycle, the snapshot is released, and snapshot consolidation is performed for the VM. Similarly, for Hyper-V VMs, the Hyper-V replica change-tracking engine keeps track of changes between consecutive replication cycles.

When you perform the `Migrate` operation on a replicating VM, you can shut down the on-premises VM and perform one final incremental replication to ensure zero data loss. When the replication is performed, the replica-managed disks that correspond to the VM are used to create the VM in Azure.

To get started, refer to the [VMware agentless migration](tutorial-migrate-vmware.md) and [Hyper-V agentless migration](./tutorial-migrate-hyper-v.md) tutorials.

### How do I gauge the bandwidth requirement for my migrations?

A range of factors can affect the amount of bandwidth that you need to replicate data to Azure. The bandwidth requirement depends on how fast the on-premises Azure Migrate appliance can read and replicate the data to Azure. Replication has two phases: initial replication and delta replication.

When replication starts for a VM, an initial replication cycle occurs in which full copies of the disks are replicated. After the initial replication is completed, incremental replication cycles (delta cycles) are scheduled periodically to transfer any changes that occurred since the previous replication cycle.

You can work out the bandwidth requirement based on:

* The volume of data you need to move in the wave.
* The time you want to allot for the initial replication process.

Ideally, you'd want initial replication to be completed at least 3-4 days before the actual migration window. This timeline gives you sufficient time to perform a test migration before the actual window and keep downtime during the window to a minimum.

You can estimate the bandwidth or time needed for agentless VMware VM migration by using the following formula:

* Time to complete initial replication =  {size of disks (or used size if available) * 0.7 (assuming a 30 percent compression average – conservative estimate)}/bandwidth available for replication.

### How do I throttle replication when using the Azure Migrate appliance for agentless VMware replication?

You can throttle by using `NetQosPolicy`. This throttling method applies to only the outbound connections from the Azure Migrate appliance.

For example, the `AppNamePrefix` value to use in `NetQosPolicy` is `GatewayWindowsService.exe`. You could create a policy on the Azure Migrate appliance to throttle replication traffic from the appliance by creating a policy such as this one:

```powershell
New-NetQosPolicy -Name "ThrottleReplication" -AppPathNameMatchCondition "GatewayWindowsService.exe" -ThrottleRateActionBitsPerSecond 1MB
```

To increase and decrease replication bandwidth based on a schedule, you can use Windows scheduled tasks to scale the bandwidth as needed. One task decreases the bandwidth, and another task increases the bandwidth.

> [!NOTE]
> You need to create the previously mentioned `NetQosPolicy` before you run the following commands.

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

Because agentless replication folds in data, the *churn pattern* is more important than the *churn rate*. When a file is written again and again, the rate doesn't have much impact. However, a pattern in which every other sector is written causes high churn in the next cycle. Because you minimize the amount of data you transfer, you allow the data to fold as much as possible before you schedule the next cycle.

### How frequently is a replication cycle scheduled?

The formula to schedule the next replication cycle is: (Previous cycle time / 2) or one hour, whichever is higher.

For example, if a VM takes four hours for a delta cycle, the next cycle is scheduled in two hours, and not in the next hour. The process is different immediately after initial replication, when the first delta cycle is scheduled immediately.

### I deployed two (or more) appliances to discover VMs in my vCenter Server. But when I try to migrate the VMs, I only see VMs that correspond to one of the appliances.

If you set up multiple appliances, there can be no overlap among the VMs on the provided vCenter accounts. A discovery with such an overlap is an unsupported scenario.

### How does agentless replication affect VMware servers?

Agentless replication results in some performance impact on VMware vCenter Server and VMware ESXi hosts. Because agentless replication uses snapshots, it consumes IOPS on storage, so some IOPS storage bandwidth is required. We don't recommend using agentless replication if you have constraints on storage or IOPS in your environment.

### Can powered-off VMs be replicated?

Replication of VMware VMs while they're powered off is supported, but only in the agentless approach.

 > [!IMPORTANT]
> We can't guarantee that a powered-off VM will boot successfully, because we can't verify its operational state before replication.

We highly recommend that you perform a test migration to ensure everything proceeds smoothly during the actual migration. This method can be useful when the initial replication process is lengthy, or for high-churn VMs, such as database servers or other disk-intensive workloads.

### Can I use Azure Migrate to migrate my web apps to Azure App Service?

You can perform at-scale agentless migration of ASP.NET web apps running on IIS web servers that are hosted on a Windows OS in a VMware environment. [Learn more](./tutorial-modernize-asp-net-appservice-code.md).

## Agent-based migration

### How can I migrate my AWS EC2 instances to Azure?

Review [Discover, assess, and migrate Amazon Web Services (AWS) VMs to Azure](./tutorial-migrate-aws-virtual-machines.md).

### How does agent-based migration work?

The **Migration and modernization** tool provides an agent-based migration option to migrate Windows and Linux servers running on physical servers, or running as x86/x64 VMs on providers like VMware, Hyper-V, AWS, and GCP.

The agent-based migration method uses agent software to replicate server data to Azure. You install the software on the server that you're migrating. The replication process uses an offload architecture in which the agent relays replication data to a dedicated replication server called the replication appliance or configuration server (or to a scale-out process server). For more details, see [Agent-based migration architecture](./agent-based-migration-architecture.md).

> [!NOTE]
>The replication appliance is different from the Azure Migrate discovery appliance and must be installed on a separate/dedicated machine.

### Where should I install the replication appliance for agent-based migrations?

You should install the replication appliance on a dedicated machine. You shouldn't install the replication appliance on a source machine that you want to replicate, or on the Azure Migrate appliance that you used for discovery and assessment. Read [Migrate machines as physical servers to Azure](./tutorial-migrate-physical-virtual-machines.md) for more details.

### Can I migrate AWS VMs running Amazon Linux operating system?

VMs running Amazon Linux can't be migrated as is, because Amazon Linux OS is supported only on AWS.

To migrate workloads running on Amazon Linux, you can spin up a CentOS/RHEL VM in Azure. Then, you can migrate the workload that runs on the AWS Linux machine by using a relevant workload migration approach. For example, depending on the workload, there might be workload-specific tools to aid the migration, like tools for databases or deployment tools for web servers.

### How do I gauge the bandwidth requirement for my migrations?

A range of factors can affect the amount of bandwidth that you need to replicate data to Azure. The bandwidth requirement depends on how fast the on-premises Azure Migrate appliance can read and replicate the data to Azure. Replication has two phases: initial replication and delta replication.

When replication starts for a VM, an initial replication cycle occurs in which full copies of the disks are replicated. After the initial replication is completed, incremental replication cycles (delta cycles) are scheduled periodically to transfer any changes that occurred since the previous replication cycle.

For an agent-based method of replication, Azure Site Recovery Deployment Planner can help profile the environment for the data churn and help predict the necessary bandwidth requirement. To learn more, read [Plan VMware deployment](./agent-based-migration-architecture.md#plan-vmware-deployment).

## Agentless Hyper-V migration

### How does agentless migration work?

The **Migration and modernization** tool provides agentless replication options for the migration of VMware and Hyper-V VMs running Windows or Linux. The tool provides another agent-based replication option for Windows and Linux servers. This other option can be used to migrate physical servers, and x86/x64 VMs on providers like VMware, Hyper-V, AWS, and GCP.

The agent-based replication option requires that you install agent software on the VM/server that you're migrating. The agentless option doesn't require you to install software on the VMs, which can offer convenience and simplicity.

The agentless replication option works by using mechanisms provided by the virtualization provider (VMware or Hyper-V). For Hyper-V VMs, the agentless replication mechanism replicates data from VM disks by using VM snapshots and the change-tracking capability of the Hyper-V replica.

When replication is configured for a VM, the VM first goes through an initial replication phase. During initial replication, a VM snapshot is taken, and a full copy of data from the snapshot disks is replicated to managed disks in your subscription. After initial replication for the VM finishes, the replication process transitions to an incremental replication (delta replication) phase.

The incremental replication phase addresses any data changes that occurred since the last completed replication cycle. Those changes are periodically replicated and applied to the replica-managed disks. This process keeps replication in sync with changes on the VM.

VMware changed-block tracking technology is used to keep track of changes between replication cycles for VMware VMs. At the start of the replication cycle, a VM snapshot is taken and changed-block tracking is used to get the changes between the current snapshot and the last successfully replicated snapshot. To keep replication for the VM in sync, only data that changed since the last completed replication cycle needs to be replicated.

At the end of each replication cycle, the snapshot is released, and snapshot consolidation is performed for the VM. Similarly, for Hyper-V VMs, the Hyper-V replica change-tracking engine is used to keep track of changes between consecutive replication cycles.

When you perform the `Migrate` operation on a replicating VM, you can shut down the on-premises VM and perform one final incremental replication to ensure zero data loss. The replica-managed disks that correspond to the VM are used to create the VM in Azure.

To get started, refer to the [Hyper-V agentless migration](./tutorial-migrate-hyper-v.md) tutorial.

### How do I gauge the bandwidth requirement for my migrations?

A range of factors can affect the amount of bandwidth that you need to replicate data to Azure. The bandwidth requirement depends on how fast the on-premises Azure Migrate appliance can read and replicate the data to Azure. Replication has two phases: initial replication and delta replication.

When replication starts for a VM, an initial replication cycle occurs in which full copies of the disks are replicated. After the initial replication is completed, incremental replication cycles (delta cycles) are scheduled periodically to transfer any changes that occurred since the previous replication cycle.

You can work out the bandwidth requirement based on:

* The volume of data you need to move in the wave.
* The time you want to allot for the initial replication process.

Ideally, you'd want initial replication to complete at least 3-4 days before the actual migration window. This timeline gives you sufficient time to perform a test migration before the actual window and keep downtime during the window to a minimum.

## How do I roll back if something goes wrong during the migration process?

Azure Migrate doesn't support rollback now, which means after users migrate, they can't go back to on-premises.

## What strategies do I use to reduce downtime during migration?

| **Practice** | **How it helps** | **Benefit** |
| --- | --- | --- |
| Use Agent-Based Replication for Continuous Sync | It continuously replicates on-premises VMs to Azure| This helps you cut over with minimal data loss (RPO of a few seconds) and reduces downtime (RTO of a few minutes). |
| Perform Test Migrations  | Azure Migrate lets you run test migrations without affecting the production VM.  | You check boot success, network connectivity, and application functionality in Azure before the final cutover. |
| Use Replication Groups for Dependency-Aware Migration  | You group VMs based on application or service dependencies and migrate them together. | This lowers the risk of broken dependencies during migration and helps keep services running smoothly. |
| Schedule Cutovers During Maintenance Windows  | **: You plan the final cutover (switching users to the Azure-hosted app) during a known low-traffic period. | This minimizes the user impact and gives time for rollback if needed.|
| Do a Phased Migration  | You migrate and modernize workloads in stages instead of all at once. | Smaller changes minimize the risk and help keep services available throughout the process. |

## How do I measure the success of my cloud migration execution?

| Metric  | Description |
| --- | --- |
| Cutover success rate | Percentage of workloads successfully migrated without rollback or issues. |
| Downtime duration | Total unplanned downtime occurs during cutover; the goal is minimal or zero. |
| Data integrity | Post-migration validation of data completeness and accuracy. |
| Application functionality |Post-migration, apps work exactly as expected (functional testing, and UAT pass). |
| Migration completion timeline | Actual vs planned migration schedule adherence. |

## Related content

* Learn more about migrating [VMware VMs](tutorial-migrate-vmware.md), [Hyper-V VMs](tutorial-migrate-hyper-v.md), and [physical servers](tutorial-migrate-physical-virtual-machines.md).
