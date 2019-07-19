---
title: Set up disaster recovery to Azure for large numbers of VMware VMs or physical servers with Azure Site Recovery | Microsoft Docs
description: Learn how to set up disaster recovery to Azure for large numbers of on-premises VMware VMs or physical servers with Azure Site Recovery.
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 05/14/2019
ms.author: raynew


---
# Set up disaster recovery at scale for VMware VMs/physical servers

This article describes how to set up disaster recovery to Azure for large numbers (> 1000) of on-premises VMware VMs or physical servers in your production environment, using the [Azure Site Recovery](site-recovery-overview.md) service.


## Define your BCDR strategy

As part of your business continuity and disaster recovery (BCDR) strategy, you define recovery point objectives (RPOs) and recovery time objectives (RTOs) for your business apps and workloads. RTO measures the duration of time and service level within which a business app or process must be restored and available, in order to avoid continuity issues.
- Site Recovery provides continuous replication for VMware VMs and physical servers, and an [SLA](https://azure.microsoft.com/support/legal/sla/site-recovery/v1_2/) for RTO.
- As you plan for large-scale disaster recovery for VMware VMs and figure out the Azure resources you need, you can specify an RTO value that will be used for capacity calculations.


## Best practices

Some general best practices for large-scale disaster recovery. These best practices are discussed in more detail in the next sections of the document.

- **Identify target requirements**: Estimate out capacity and resource needs in Azure before you set up disaster recovery.
- **Plan for Site Recovery components**: Figure out what Site Recovery components (configuration server, process servers) you need to meet your estimated capacity.
- **Set up one or more scale-out process servers**: Don't use the process server that's running by default on the configuration server. 
- **Run the latest updates**: The Site Recovery team releases new versions of Site Recovery components on a regular basis, and you should make sure you're running the latest versions. To help with that, track [what's new](site-recovery-whats-new.md) for updates, and [enable and install updates](service-updates-how-to.md) as they release.
- **Monitor proactively**: As you get disaster recovery up and running, you should proactively monitor the status and health of replicated machines, and infrastructure resources.
- **Disaster recovery drills**: You should run disaster recovery drills on a regular basis. These don't impact on your production environment, but do help ensure that failover to Azure will work as expected when needed.



## Gather capacity planning information

Gather information about your on-premises environment, to help assess and estimate your target (Azure) capacity needs.
- For VMware, run the Deployment Planner for VMware VMs to do this.
- For physical servers, gather the information manually.

### Run the Deployment Planner for VMware VMs

The Deployment Planner helps you to gather information about your VMware on-premises environment.

- Run the Deployment Planner during a period that represents typical churn for your VMs. This will generate more accurate estimates and recommendations.
- We recommend that you run the Deployment Planner on the configuration server machine, since the Planner calculates throughput from the server on which it's running. [Learn more](site-recovery-vmware-deployment-planner-run.md#get-throughput) about measuring throughput.
- If you don't yet have a configuration server set up:
    - [Get an overview](vmware-physical-azure-config-process-server-overview.md) of Site Recovery components.
    - [Set up a configuration server](vmware-azure-deploy-configuration-server.md), in order to run the Deployment Planner on it.

Then run the Planner as follows:

1. [Learn about](site-recovery-deployment-planner.md) the Deployment Planner. You can download the latest version from the portal, or [download it directly](https://aka.ms/asr-deployment-planner).
2. Review the [prerequisites](site-recovery-deployment-planner.md#prerequisites) and [latest updates](site-recovery-deployment-planner-history.md) for the Deployment Planner, and [download and extract](site-recovery-deployment-planner.md#download-and-extract-the-deployment-planner-tool) the tool.
3. [Run the Deployment Planner](site-recovery-vmware-deployment-planner-run.md) on the configuration server.
4. [Generate a report](site-recovery-vmware-deployment-planner-run.md#generate-report) to summarize estimations and recommendations.
5. Analyze the [report recommendations](site-recovery-vmware-deployment-planner-analyze-report.md) and [cost estimations](site-recovery-vmware-deployment-planner-cost-estimation.md).

>[!NOTE]
> By default, the tool is configured to profile and generates report for up to 1000 VMs. You can change this limit by increasing the MaxVMsSupported key value in the ASRDeploymentPlanner.exe.config file.

## Plan target (Azure) requirements and capacity

Using your gathered estimations and recommendations, you can plan for target resources and capacity. If you ran the Deployment Planner for VMware VMs, you can use a number of the [report recommendations](site-recovery-vmware-deployment-planner-analyze-report.md#recommendations) to help you.

- **Compatible VMs**: Use this number to identify the number of VMs that are ready for disaster recovery to Azure. Recommendations about network bandwidth and Azure cores are based on this number.
- **Required network bandwidth**: Note the bandwidth you need for delta replication of compatible VMs. 
    - When you run the Planner you specify the desired RPO in minutes. The recommendations show you the bandwidth needed to meet that RPO 100% and 90% of the time. 
    - The network bandwidth recommendations take into account the bandwidth needed for total number of configuration servers and process servers recommended in the Planner.
- **Required Azure cores**: Note the number of cores you need in the target Azure region, based on the number of compatible VMs. If you don't have enough cores, at failover Site Recovery won't be able to create the required Azure VMs.
- **Recommended VM batch size**: The recommended batch size is based on the ability to finish initial replication for the batch within 72 hours by default, while meeting an RPO of 100%. The hour value can be modified.

You can use these recommendations to plan for Azure resources, network bandwidth, and VM batching.

## Plan Azure subscriptions and quotas

We want to make sure that available quotas in the target subscription are sufficient to handle failover.

**Task** | **Details** | **Action**
--- | --- | ---
**Check cores** | If cores in the available quota don't equal or exceed the total target count at the time of failover, failovers will fail. | For VMware VMs, check you have enough cores in the target subscription to meet the Deployment Planner core recommendation.<br/><br/> For physical servers, check that Azure cores meet your manual estimations.<br/><br/> To check quotas, in the Azure portal > **Subscription**, click **Usage + quotas**.<br/><br/> [Learn more](https://docs.microsoft.com/azure/azure-supportability/resource-manager-core-quotas-request) about increasing quotas.
**Check failover limits** | The number of failovers mustn't exceed Site Recovery failover limits. |  If failovers exceed the limits, you can add subscriptions, and fail over to multiple subscriptions, or increase quota for a subscription. 


### Failover limits

The limits indicate the number of failovers that are supported by Site Recovery within one hour, assuming three disks per machine.

What does comply mean? To start an Azure VM, Azure requires some drivers to be in boot start state, and services like DHCP to be set to start automatically.
- Machines that comply will already have these settings in place.
- For machines running Windows, you can proactively check compliance, and make them compliant if needed. [Learn more](site-recovery-failover-to-azure-troubleshoot.md#failover-failed-with-error-id-170010).
- Linux machines are only brought into compliance at the time of failover.

**Machine complies with Azure?** | **Azure VM limits (managed disk failover)**
--- | --- 
Yes | 2000
No | 1000

- Limits assume that minimal other jobs are in progress in the target region for the subscription.
- Some Azure regions are smaller, and might have slightly lower limits.

## Plan infrastructure and VM connectivity

After failover to Azure you need your workloads to operate as they did on-premises, and to enable users to access workloads running on the Azure VMs.

- [Learn more](site-recovery-active-directory.md#test-failover-considerations) about failing over your Active Directory or DNS on-premises infrastructure to Azure.
- [Learn more](site-recovery-test-failover-to-azure.md#prepare-to-connect-to-azure-vms-after-failover) about preparing to connect to Azure VMs after failover.



## Plan for source capacity and requirements

It's important that you have sufficient configuration servers and scale-out process servers to meet capacity requirements. As you begin your large-scale deployment, start off with a single configuration server, and a single scale-out process server. As you reach the prescribed limits, add additional servers.

>[!NOTE]
> For VMware VMs, the Deployment Planner makes some recommendations about the configuration and process servers you need. We recommend that you use the tables included in the following procedures, instead of following the Deployment Planner recommendation. 


## Set up a configuration server
 
Configuration server capacity is affected by the number of machines replicating, and not by data churn rate. To figure out whether you need additional configuration servers, use these defined VM limits.

**CPU** | **Memory** | **Cache disk** | **Replicated machine limit**
 --- | --- | --- | ---
8 vCPUs<br> 2 sockets * 4 cores @ 2.5 Ghz | 16 GB | 600 TB | Up to 550 machines<br> Assumes that each machine has three disks of 100 GB each.

- These limits are based on a configuration server set up using an OVF template.
- The limits assume that you're not using the process server that's running by default on the configuration server.

If you need to add a new configuration server, follow these instructions:

- [Set up a configuration server](vmware-azure-deploy-configuration-server.md) for VMware VM disaster recovery, using an OVF template.
- [Set up a configuration server](physical-azure-set-up-source.md) manually for physical servers, or for VMware deployments that can't use an OVF template.

As you set up a configuration server, note that:

- When you set up a configuration server, it's important to consider the subscription and vault within which it resides, since these shouldn't be changed after setup. If you do need to change the vault, you have to disassociate the configuration server from the vault, and reregister it. This stops replication of VMs in the vault.
- If you want to set up a configuration server with multiple network adapters, you should do this during set up. You can't do this after the registering the configuration server in the vault.

## Set up a process server

Process server capacity is affected by data churn rates, and not by the number of machines enabled for replication.

- For large deployments you should always have at least one scale-out process server.
- To figure out whether you need additional servers, use the following table.
- We recommend that you add a server with the highest spec. 


**CPU** | **Memory** | **Cache disk** | **Churn rate**
 --- | --- | --- | --- 
12 vCPUs<br> 2 sockets*6 cores @ 2.5 Ghz | 24 GB | 1 GB | Up to 2 TB a day

Set up the process server as follows:

1. Review the [prerequisites](vmware-azure-set-up-process-server-scale.md#prerequisites).
2. Install the server in the [portal](vmware-azure-set-up-process-server-scale.md#install-from-the-ui), or from the [command line](vmware-azure-set-up-process-server-scale.md#install-from-the-command-line).
3. Configure replicated machines to use the new server. If you already have machines replicating:
    - You can [move](vmware-azure-manage-process-server.md#switch-an-entire-workload-to-another-process-server) an entire process server workload to the new process server.
    - Alternatively, you can [move](vmware-azure-manage-process-server.md#move-vms-to-balance-the-process-server-load) specific VMs to the new process server.



## Enable large-scale replication

After planning capacity and deploying the required components and infrastructure, enable replication for large numbers of VMs.

1. Sort machines into batches. You enable replication for VMs within a batch, and then move on to the next batch.

    - For VMware VMs, you can use the [recommended VM batch size](site-recovery-vmware-deployment-planner-analyze-report.md#recommended-vm-batch-size-for-initial-replication) in the Deployment Planner report.
    - For physical machines, we recommend you identify batches based on machines that have a similar size and amount of data, and on available network throughput. The aim is to batch machines that are likely to finish their initial replication in around the same amount of time.
    
2. If disk churn for a machine is high, or exceeds limits in  Deployment thePlanner, you can move non-critical files you don't need to replicate (such as log dumps or temp files) off the machine. For VMware VMs, you can move these files to a separate disk, and then [exclude that disk](vmware-azure-exclude-disk.md) from replication.
3. Before you enable replication, check that machines meet [replication requirements](vmware-physical-azure-support-matrix.md#replicated-machines).
4. Configure a replication policy for [VMware VMs](vmware-azure-set-up-replication.md#create-a-policy) or [physical servers](physical-azure-disaster-recovery.md#create-a-replication-policy).
5. Enable replication for [VMware VMs](vmware-azure-enable-replication.md) or [physical servers](physical-azure-disaster-recovery.md#enable-replication). This kicks off the initial replication for the selected machines.

## Monitor your deployment

After you kick off replication for the first batch of VMs, start monitoring your deployment as follows:  

1. Assign a disaster recovery administrator to monitor the health status of replicated machines.
2. [Monitor events](site-recovery-monitor-and-troubleshoot.md) for replicated items and the infrastructure.
3. [Monitor the health](vmware-physical-azure-monitor-process-server.md) of your scale-out process servers.
4. Sign up to get [email notifications](https://docs.microsoft.com/azure/site-recovery/site-recovery-monitor-and-troubleshoot#subscribe-to-email-notifications) for events, for easier monitoring.
5. Conduct regular [disaster recovery drills](site-recovery-test-failover-to-azure.md), to ensure that everything's working as expected.


## Plan for large-scale failovers

In an event of disaster, you might need to fail over a large number of machines/workloads to Azure. Prepare for this type of event as follows.

You can prepare in advance for failover as follows:

- [Prepare your infrastructure and VMs](#plan-infrastructure-and-vm-connectivity) so that your workloads will be available after failover, and so that users can access the Azure VMs.
- Note the [failover limits](#failover-limits) earlier in this document. Make sure your failovers will fall within these limits.
- Run regular [disaster recovery drills](site-recovery-test-failover-to-azure.md). Drills help to:
    - Find gaps in your deployment before failover.
    - Estimate end-to-end RTO for your apps.
    - Estimate end-to-end RPO for your workloads.
    - Identify IP address range conflicts.
    - As you run drills, we recommend that you don't use production networks for drills, avoid using the same subnet names in production and test networks, and clean up test failovers after every drill.

To run a large-scale failover, we recommend the following:

1. Create recovery plans for workload failover.
    - Each recovery plan can trigger failover of up to 50 machines.
    - [Learn more](recovery-plan-overview.md) about recovery plans.
2. Add Azure Automation runbook scripts to recovery plans, to automate any manual tasks on Azure. Typical tasks include configuring load balancers, updating DNS etc. [Learn more](site-recovery-runbook-automation.md)
2. Before failover, prepare Windows machines so that they comply with the Azure environment. [Failover limits](#plan-azure-subscriptions-and-quotas) are higher for machines that comply. [Learn more](site-recovery-failover-to-azure-troubleshoot.md#failover-failed-with-error-id-170010) about runbooks.
4.	Trigger failover with the [Start-AzRecoveryServicesAsrPlannedFailoverJob](https://docs.microsoft.com/powershell/module/az.recoveryservices/start-azrecoveryservicesasrplannedfailoverjob?view=azps-2.0.0&viewFallbackFrom=azps-1.1.0) PowerShell cmdlet, together with a recovery plan.



## Next steps

> [!div class="nextstepaction"]
> [Monitor Site Recovery](site-recovery-monitor-and-troubleshoot.md)
