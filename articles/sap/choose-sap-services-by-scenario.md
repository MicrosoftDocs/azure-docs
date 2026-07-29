---
title: SAP on Azure service scenarios and selection guidance
description: Use common SAP scenarios to choose Azure services for deploying, managing, monitoring, integrating, and protecting SAP systems.
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: sap-on-azure
ms.topic: concept-article
ms.date: 07/27/2026
# Customer intent: As an SAP architect, I want to choose Azure services for my SAP scenario so that I can design an appropriate deployment and operations approach.
---

# SAP on Azure service scenarios and selection guidance

SAP systems on Azure commonly use several services together. For example, an SAP system runs on Azure virtual machines (VMs), while Azure Center for SAP solutions provides SAP-aware management and Azure Monitor for SAP solutions provides operational telemetry. Use this guide to identify the service that addresses the primary need in your scenario, then add the supporting services that you need.

## Start with your primary need

| If you need to... | Start with | Why |
| --- | --- | --- |
| Deploy a new SAP system through an Azure-native experience | [Azure Center for SAP solutions](center-sap-solutions/overview.md) | It provides guided deployment and creates a Virtual Instance for SAP solutions (VIS) to represent the SAP system in Azure. |
| Provision multiple SAP environments repeatedly | [SAP Deployment Automation Framework](automation/deployment-framework.md) | It uses Terraform and Ansible to create, configure, and maintain consistent SAP infrastructure. |
| Run an SAP system with control over infrastructure design | [SAP on Azure VM workloads](workloads/get-started.md) | You select the certified VM, storage, network, and high-availability configuration for the workload. |
| Monitor SAP application, database, cluster, and operating system data | [Azure Monitor for SAP solutions](monitor/about-azure-monitor-sap-solutions.md) | It collects SAP-specific data into Azure Monitor Logs for visualization, queries, and alerts. |
| Connect SAP processes or data to Microsoft services | [SAP integration with Microsoft services](workloads/integration-get-started.md) | It helps you integrate SAP with services such as Microsoft Entra ID, Power Platform, Power BI, and Azure Integration Services. |

## Scenario A: Deploy a new S/4HANA system with guided Azure management

**Situation:** Your organization is moving a new S/4HANA production system to Azure. The SAP operations team wants a guided deployment and a single Azure resource that represents the SAP system.

**Use:** Azure Center for SAP solutions.

**Why it fits:** Azure Center for SAP solutions deploys new SAP systems and creates a VIS that contains SAP system metadata and associated resources. The team can use the VIS to view system health and status, access quality checks and insights, and manage the SAP application tier. This choice works well when the team wants an Azure-native management experience in addition to the underlying VM infrastructure.

**Add:** Azure Monitor for SAP solutions when the team needs SAP-specific telemetry and alerts beyond infrastructure metrics.

**Next step:** [Prepare a network for a new VIS deployment](center-sap-solutions/prepare-network.md).

## Scenario B: Bring existing Azure-hosted SAP systems into a common operations view

**Situation:** Your organization already runs several SAP systems on Azure VMs. Administrators use separate tools and views for each system and need a central SAP-aware inventory and health experience without redeploying the systems.

**Use:** Register the systems in Azure Center for SAP solutions.

**Why it fits:** Registration creates a Virtual Instance for SAP (VIS) for a supported SAP system running on Azure. The VIS gives administrators a logical representation of the system and access to SAP system metadata, health information, quality checks, and insights. Use registration when the primary problem is operational visibility for existing Azure-based SAP systems, rather than infrastructure provisioning.

**Add:** Azure Monitor for SAP solutions to collect detailed application, database, cluster, and operating system data for troubleshooting and alerting.

**Next step:** [Register an existing SAP system](center-sap-solutions/register-existing-system.md).

## Scenario C: Create consistent development, test, and production landscapes

**Situation:** A platform team must deploy the same SAP architecture across development, quality assurance, and production. The team needs version-controlled configuration, repeatable installation, and a way to apply environment changes consistently.

**Use:** SAP Deployment Automation Framework.

**Why it fits:** The framework uses Terraform for infrastructure and Ansible for configuration and SAP installation. Its control plane and workload zone model supports repeatable deployment of multiple SAP systems and environments. Use it when infrastructure and application deployment need to be automated from a controlled set of configuration files.

**Add:** Azure DevOps when the team needs to run the automation through CI/CD pipelines and manage deployment changes as code.

**Next step:** [Plan for the SAP Deployment Automation Framework](automation/plan-deployment.md).

## Scenario D: Design a custom SAP architecture with infrastructure-level control

**Situation:** An SAP architecture team needs to select the VM sizes, storage layout, network topology, and high-availability design for a business-critical SAP workload. The architecture has requirements that extend beyond a guided deployment flow.

**Use:** SAP on Azure VM workloads.

**Why it fits:** VM workloads provide the IaaS foundation for running SAP on Azure. The team can select SAP-certified configurations and design the compute, storage, networking, and availability architecture required by the workload. Use this approach when the primary requirement is control over the infrastructure design.

**Add:** SAP Deployment Automation Framework to make the selected architecture repeatable, or Azure Center for SAP solutions to add SAP-aware management for supported systems.

**Next step:** [Get started with SAP on Azure VM workloads](workloads/get-started.md).

## Scenario E: Investigate slow transactions and prevent SAP outages

**Situation:** Business users report slow SAP transactions intermittently. The operations team needs to correlate SAP HANA, SAP NetWeaver, Linux, cluster, and Azure infrastructure data, and create alerts before an issue affects users.

**Use:** Azure Monitor for SAP solutions.

**Why it fits:** Azure Monitor for SAP solutions collects data from configured providers into Azure Monitor Logs. It supports providers for components such as SAP HANA, SAP NetWeaver, Pacemaker clusters, Linux, and SQL Server. The team can use workbooks, Log Analytics queries, and alerts to investigate behavior across the SAP landscape.

**Add:** Azure Center for SAP solutions for a system-level status and health view for supported SAP systems.

**Next step:** [Deploy Azure Monitor for SAP solutions in the Azure portal](monitor/quickstart-portal.md).

## Scenario F: Integrate SAP business processes with Microsoft services

**Situation:** A business process team wants employees to access SAP-connected workflows through Microsoft 365 and Power Platform, while the integration team needs governed connectivity between SAP and other enterprise systems.

**Use:** SAP integration with Microsoft services.

**Why it fits:** The integration guidance helps you select services based on the integration outcome. For example, use Microsoft Entra ID for identity scenarios, Power Platform for workflow and application experiences, Power BI for reporting, and Azure Integration Services for managed connectivity and API-based integration.

**Add:** Azure Key Vault when an integration needs centralized storage for secrets, certificates, or keys.

**Next step:** [Get started with SAP and Azure integration scenarios](workloads/integration-get-started.md).

## Scenario G: Meet a requirement for dedicated hardware or high-performance NFS storage

**Situation:** A compliance requirement calls for dedicated physical hardware, or an SAP workload requires enterprise NFS storage with consistent low latency.

**Use:** Azure Dedicated Hosts for the hardware isolation requirement, or Azure NetApp Files for the NFS storage requirement.

**Why it fits:** Azure Dedicated Hosts provide physical servers dedicated to your organization. Azure NetApp Files provides enterprise-grade NFS storage that supports demanding SAP storage scenarios. Select the service that addresses the specific constraint; neither service replaces the SAP VM workload itself.

**Add:** Azure Files when the requirement is a managed shared file service, such as a transport directory, rather than high-performance NFS storage.

**Next step:** Review [SAP storage considerations](workloads/planning-guide-storage.md).

## Scenario H: Protect SAP data and prepare for a regional disruption

**Situation:** A risk and compliance team needs scheduled SAP HANA backups, documented recovery procedures, and a plan for restoring service after a regional outage.

**Use:** Azure Backup for backup and recovery requirements, and Azure Site Recovery for disaster recovery orchestration requirements.

**Why it fits:** Azure Backup supports SAP HANA backup scenarios and retention policies. Azure Site Recovery helps orchestrate failover and failback for supported SAP landscape recovery designs. Use both services when the recovery strategy requires backups for data protection and a separate plan for regional service continuity.

**Add:** Azure Monitor for SAP solutions to monitor the health of SAP components that participate in recovery procedures.

**Next step:** Review [SAP on Azure backup architecture](/azure/backup/backup-architecture) and [disaster recovery for SAP](/azure/site-recovery/site-recovery-sap).

## Choose services as a complementary solution

The services in this guide are complementary. A typical production landscape might run SAP on certified Azure VMs, use Azure Center for SAP solutions for SAP-aware management, use Azure Monitor for SAP solutions for telemetry and alerts, and use Azure Backup or Azure Site Recovery for data protection and disaster recovery. Start with the service that solves the immediate scenario, then add services for the remaining operational requirements.

## Related content

- [SAP on Azure offerings](sap-on-azure-overview.md)
- [SAP on Azure VM workloads](workloads/get-started.md)
- [Azure Center for SAP solutions](center-sap-solutions/overview.md)
- [SAP Deployment Automation Framework](automation/deployment-framework.md)
- [Azure Monitor for SAP solutions](monitor/about-azure-monitor-sap-solutions.md)