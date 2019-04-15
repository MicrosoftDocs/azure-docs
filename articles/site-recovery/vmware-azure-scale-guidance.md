---
title: Set up Azure Site Recovery and scale to large VMware/Physical environments (1000+ VMs) | Microsoft Docs
description: This article describes how to scale VMware workload for disaster recovery with Azure Site Recovery
services: site-recovery
author: Rajeswari-Mamilla
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 04/14/2019
ms.author: ramamill
---

# Scale workload to large VMware/Physical environments (1000+ VMs) through Azure Site Recovery

The focus of the article is to guide customers in scaling the workload protected under Azure Site Recovery to beyond 1000 VMs. The details are simplified to complete the DR of your entire workload.
If you are aiming to perform a proof of concept (POC) of Azure Site Recovery, refer to the below given articles

- [VMware to Azure architecture](https://docs.microsoft.com/azure/site-recovery/vmware-azure-architecture)
- [VMware/Physical support matrix](https://aka.ms/asr_v2a_support_matrix)
- [Getting started](https://aka.ms/v2a_tutorial_get_started)

## Define your DR strategy

Depending on the business needs and DR requirements, define your Recovery Time Objective (RTO) & Recovery Point Objective (RPO).

- The RPO limits defined by you will be considered as an input in the [upcoming section](#estimate-your-requirements) to identify infrastructure requirements.
- Learn about [RTO SLA provided by Azure Site Recovery](https://azure.microsoft.com/support/legal/sla/site-recovery/v1_2/).

## Estimate your requirements

Let’s start with running the deployment planner in your environment. This tool helps in accessing your environment and estimates the infrastructure necessary to set up Azure Site Recovery. For more details, refer to the following articles.

- To learn what a deployment planner assesses, refer to the [overview](https://aka.ms/asr-v2a-deployment-planner) article.
- Now, run the deployment planner tool with the help of guidance given [here](site-recovery-vmware-deployment-planner-run.md).
- The detailed article published [here](site-recovery-vmware-deployment-planner-analyze-report.md) will help you in analyzing the report and finalizing the requirements.
- If you want to understand the cost estimates you might incur after protecting the assessed workload, refer to the article on [cost estimation report](https://aka.ms/asr-dp-cost-estimation).

> [!TIP]
> Ensure that the deployment planner tool is run during the period that represents your data change trends (churn patterns) to generate estimates with better accuracy. This helps in providing accurate guidance as per your business trends.

## Target Planning

Along with preparing source environment for replication, there is some planning required at Azure to ensure you are failover ready and that you are not bottle-necked on connectivity.

### Subscription Planning

Plan for failover by ensuring you do not hit the scale limits of Azure Site Recovery. Ensure that:

- You have enough cores in your quota in target subscription. You can check the available quota by going to Subscription -> Usage + quotas. If cores equal to or more than total target count are not available  at the time of failover, failovers will fail.
- Review the scale limits under “[Plan failover for large number of machines](#plan-failover-for-large-number-of-machines)” and ensure that you replicate to multiple subscriptions if needed.

### Access Planning

- If you use Active Directory in your environment, plan for its access by following the guidance [here](site-recovery-test-failover-to-azure.md#prepare-active-directory-and-dns).
- Prepare for connectivity with Azure VMs that are created on failover.
- If you plan to use Automation runbook, ensure that you have one runbook for each target subscription.

### Network Planning

Ensure that target networks for test failover and failover operations are separate (especially when IP retention is required) so that test failovers can be end-to-end testing. Learn about IP retention here.

## Deploy configuration server

Let’s set up the configuration server with the help of OVF template. To download the template and complete deployment, refer to our guidance available here.

> [!Warning]
> Once configured, NIC cannot be added to a configuration server. Ensure you setup necessary NICs to assign while setting up a configuration server. </br>
> Once you register with a recovery services vault and protect servers, it is not possible to change the vault without disabling the protection. So, choose the subscription and vault carefully. Learn more.

### Capacity limits

A configuration server set up with OVF template has following configurations. Do not use the in-built process server when the aim is to onboard workloads at larger scale. This ensures in dissociation of dependency on data change rates. When in-built process server is not utilized, a configuration server can support replication of 550 servers. When you start protection of 551st server, set up a new configuration server.

CPU |Memory|Cache disk|Data change rate (Churn)|Replicated machines
|--|--|--|--|--
8 vCPUs (2 sockets * 4 cores @ 2.5 GHz)| 16GB|600 GB|Not applicable|550 machines (Each source machine has three disks of 100 GB each)

## Deploy scale-out process server

As process server handles data changes, its capacity is not limited by number of protected machines. Since the plan is to scale the workload, it is recommended to set up process server with highest configuration to minimize infrastructure set up steps. A process server with following configurations can support data change rate (churn) up to 2 TB per day. Let’s set up a scale out process server by following guidelines given here.
CPU |Memory|Cache disk|Data change rate (Churn)|Replicated machines
|--|--|--|--|--
12 vCPUs (2 sockets * 6 cores @ 2.5 GHz)|24 GB|1 TB|Up to 2 TB per day|Not applicable

### Capacity limits

When the churn of all servers protected through a process server goes beyond 2 TB, set up a new process server.

## Enable Protection

Let’s start with the protection of first set of virtual machines
- Choose the first set of virtual machines (within recommended batch size from deployment planner)

> [!Tip] 
> If the churn on any disk has exceeded the limits and contains files that aren’t critical (say temp files, logs dump) and doesn’t require DR, move them to a separate disk and exclude the disk during protection

- Ensure that all virtual machines meet VMware/Physical to Azure Site Recovery requirements.
- Create and configure replication policy as per the business requirement identified above.
- Protect the servers by following the guidelines provided here.

### Capacity limits:

- When you reach the churn limits, follow the guidelines provided here to scale-out your process server.
- When you start with the protection of more than 550 virtual machines, set up a new configuration server

> [!Warning]
> Ensure that you do not overload any of the Site Recovery components. This could impact ongoing replications of associated servers. </br>
> Ensure that the initial replication of t

## Monitor your workload status

Once your machines are protected in a Recovery Services Vault, there is a minimum level of maintenance that you should plan for:

- Assign a DR admin to ensure the status of all Replicated Items is healthy.
- Azure Site Recovery sends signals in case any component in the replication workflow is choked or misfunctioning. These are generated as health events on Vault overview blade, Replicated Item overview blade and Process Server blade. Learn more.
- Sign up for Email Notifications from Recovery Services Vault to ensure you do not miss out on any health signal.
- Conduct DR drills i.e. test failover once every quarter.
- Periodically monitor status of Process Server avoid critical health issues.

## Plan Failover for large number of machines

In an event of disaster, you may need to failover large number of machines to Azure. For RTO considerations, you can failover large number of workloads in one go with Azure Site Recovery. You can prepare for failover in advance by following the guidance below:

- Create recovery plans for your workloads. Each recovery plan can trigger failover of up to 50 machines. Learn more on recovery plans here.
- Add automation runbook scripts in recovery plans to automate any manual tasks on Azure. E.g. configuring load balancers, updating DNS, etc.
- Prepare the Windows machines to comply with Azure environment. Azure environment requires some of the drivers to be in boot start state and services like DHCP to be in autostart state. Azure Site Recovery goes through a few additional steps at the time of failover (called hydration activity) if machines do not comply with Azure.
- Use PowerShell script to trigger the failover with Recovery Plans.

Number of failovers that can be supported by Azure Site Recovery within 1 hour (assuming 3 disks per VM)**:
Qualifying Criteria for Machines*|Failovers with Managed Disks
--|--
Comply with Azure|2000
Do not comply with Azure|1000

*Linux machines need to go through hydration activity at the time of failover. You can qualify Windows machines by following guidance here.

**These limits assume that minimal other jobs are being performed for your subscription on the target Azure region. Few Azure target regions are small and may have slightly lower limits.

To further increase the failover limits, you can split the replications across subscriptions. In case you cannot replicate across subscriptions, raise a support ticket on Azure Resource Manager to increase quota.

To ensure failover readiness, ensure to conduct DR drills i.e. test failover once every quarter. This helps in:

- Finding gaps in configurations required before failover
- Estimating end-to-end RTO for your application
- Estimating achieved RPO for your workloads
- Conflicts in IP address ranges

Below are few best practices for test failovers:

- Always clean up your test failover post each DR drill.
- Do not use the production target network for test failovers. This is especially helpful for test failover in case you plan to retain IPs for your machines. 
- Have the same subnet names in both production and test target networks.

Follow the step by step process to conduct a test failover and failover when ready.

## Site Recovery component upgrades  

To couple upgrade of Site Recovery infrastructure components with your regular maintenance windows, refer to our guidance here.
