---
title: Migrate Oracle workloads to Azure VMs
description: Learn how to migrate Oracle workloads to Azure VMs.
author: suzizuber
ms.author: v-suzuber
ms.service: oracle-on-azure
ms.topic: article
ms.date: 4/22/2024
---

# Migrate Oracle workloads to Azure VMs  

This article shows how to move your Oracle workload from your on-premises environment to the [Azure virtual machines (VMs) landing zone](/azure/cloud-adoption-framework/scenarios/oracle-iaas/introduction-oracle-landing-zone). It uses the Landing zone for Oracle Database at Azure, which offers design advice and best practices for Oracle migration on Azure IaaS. A proven discovery, design, and deployment approach are recommended for the overall migration strategy, followed by data migration, and cut over. 

:::image type="content" source="media/oracle-migration/azure-virtual-machine-migration.png" alt-text="Screenshot of discovery, design, and deploy migration strategy."lightbox="media/oracle-migration/azure-virtual-machine-migration.png":::

## Discovery

Migration begins with a detailed assessment of the Oracle product portfolio. The current infrastructure that supports Oracle database and apps, database versions, and types of applications that use Oracle database are: Oracle ([EBS](https://www.oracle.com/in/applications/ebusiness/), [Siebel](https://www.oracle.com/in/cx/siebel/), [People Soft](https://www.oracle.com/in/applications/peoplesoft/), [JDE](https://www.oracle.com/in/applications/jd-edwards-enterpriseone/), and others) and non-Microsoft partner offerings like [SAP](https://pages.community.sap.com/topics/oracle) or custom applications. The existing Oracle database can operate on servers, Oracle Real Application Clusters (RAC), or non-Microsoft partner RAC. For applications, we need to discover size of infrastructure that can be done easily by using Azure Migrate based discovery. For database, the approach is to get allowed with restrictions (AWR) reports on peak load to move on to design steps. 

## Design 

For Applications, [Azure Migrate do lift and shift](/azure/migrate/migrate-services-overview#migration-and-modernization-tool) infrastructure and applications to Azure IaaS based on discovery. For Oracle first party applications, refer to the [architecture requirements](/azure/virtual-machines/workloads/oracle/deploy-application-oracle-database-azure) before deciding on [Azure Migrate](https://azure.microsoft.com/products/azure-migrate) based migration. Database design begins with generated AWR reports on peak load. Once AWRs are in place, run Azure [Oracle Migration Assistance Tool](https://github.com/Azure/Oracle-Workloads-for-Azure/tree/main/omat) (OMAT) with AWR reports as input. The OMAT tool recommends the correct VM size and storage options required for your Oracle Database on Azure IaaS. The solution must have high [reliability](/azure/reliability/overview) and [resilience](https://azure.microsoft.com/files/Features/Reliability/AzureResiliencyInfographic.pdf) in the occurrence of disasters, as determined by the parameters of [Recovery Point Objective (RPO) and Recovery Time Objective (RTO)](/azure/reliability/disaster-recovery-overview). [Oracle landing zone](/azure/cloud-adoption-framework/scenarios/oracle-iaas/introduction-oracle-landing-zone) offers architecture guidance to choose the best solution architecture based on RPO and RTO requirements. The RPO and RTO approach is applicable for separating RAC infrastructure into high availability (HA) and disaster recovery (DR) architecture using Oracle data guard.

## Deployment 

The OMAT tool analyzes the AWR report to provide you with information on the required infrastructure; correct VM size and recommendations on storage with capacity. Based on that information, select the suitable HA and DR (RPO/RTO) requirement to provide resilient architecture that provides Business Continuity and Disaster Recovery (BCDR) using Oracle on Azure landing zone. Use Ansible to describe the infrastructure and architecture as [infrastructure as code](/devops/deliver/what-is-infrastructure-as-code) (IaC) and launch the landing zone with either Terraform or Bicep. Use the [GitHub actions available to automate the deployment](https://github.com/Azure/lza-oracle). 

## Types for data migration  

The data migration process has two types, online and offline. Online transfers data from source to destination as it happens. Offline extracts data from source and transfers it to destination afterwards. Both methods are essential. Offline is suitable for transferring large data between source and destination, while online can transfer incremental data before shifting from source to destination database. Both types of approach used together can provide an efficient solution for successful data migration.  

## Data migration approach

After you set up Oracle on Azure infrastructure, install Oracle database, and migrate related applications; the next step is to transfer data from on premise Oracle database to the new Oracle database on Azure. See the following Oracle tools: 

- [Recovery Manager (RMAN)](https://docs.oracle.com/en/database/oracle/oracle-database/19/bradv/getting-started-rman.html)
- [Data Pump](https://docs.oracle.com/en/database/oracle/oracle-database/19/sutil/oracle-data-pump-overview.html)
- [Data Guard](https://docs.oracle.com/en/database/oracle/oracle-database/21/sbydb/introduction-to-oracle-data-guard-concepts.html) 
- [GoldenGate](https://docs.oracle.com/goldengate/c1230/gg-winux/GGCON/introduction-oracle-goldengate.htm)

Azure enhances the Oracle tools with the right network connectivity, bandwidth, and commands that are powered by the following Azure capabilities for data migration.

- [VPN Connectivity](/azure/vpn-gateway/)
- [Express Route](/azure/expressroute/expressroute-introduction)
- [AzCopy](/azure/storage/common/storage-ref-azcopy)
- [Data Box](/azure/databox/data-box-overview)

**Oracle tools for data migration**

The following diagram is a pictographic representation of the overall migration portfolio.

:::image type="content" source="./media/oracle-migration/oracle-migrate-tools.png" alt-text="Diagram shows a pictographic representation of the migration portfolio."lightbox="./media/oracle-migration/oracle-migrate-tools.png":::

You need one of the Oracle Tools plus Azure infrastructures to deploy the correct solution architecture to migrate data. See the following reference solution scenarios:

Scenario-1: RMAN: Use RMAN backup and restore with Azure features, the setup for RMAN based recovery. The main thing is the network between on-premises and Azure.

:::image type="content" source="./media/oracle-migration/oracle-migrate-diagram-scenario-1.png" alt-text="Diagram shows the setup for RMAN based recovery."lightbox="./media/oracle-migration/oracle-migrate-diagram-scenario-1.png":::

Scenario-2: RMAN Backup Approach

:::image type="content" source="./media/oracle-migration/oracle-migrate-diagram-scenario-2.png" alt-text="Diagram shows the RMAN backup and restore approach."lightbox="./media/oracle-migration/oracle-migrate-diagram-scenario-2.png":::
 
Scenario-3: Alternatively, setup can be modified in multiple different ways as depicted in the following scenario.

:::image type="content" source="./media/oracle-migration/oracle-migrate-diagram-scenario-3.png" alt-text="Diagram shows modified versions of scenario 2."lightbox="./media/oracle-migration/oracle-migrate-diagram-scenario-3.png":::
 
Scenario-4: Data PumpàAzCopy - easy and straight forward approach using Data Pump backup and restore using Azure capabilities.

:::image type="content" source="./media/oracle-migration/oracle-migrate-diagram-scenario-4.png" alt-text="Diagram shows Data Pump backup and restore using Azure capabilities."lightbox="./media/oracle-migration/oracle-migrate-diagram-scenario-4.png":::
 
Scenario-5: Data Box - a unique scenario in which data is moved between the locations using a storage device and physical shipment.

:::image type="content" source="./media/oracle-migration/oracle-migrate-diagram-scenario-5.png" alt-text="Diagram shows data moved between locations using a storage device with physical shipment."lightbox="./media/oracle-migration/oracle-migrate-diagram-scenario-5.png":::

## Cutover

Now your data is migrated and Oracle database servers and applications are up and running. In this section, use the following steps to transition business operations running on premise over to newfound Oracle workload and applications on Azure IaaS.

1. Schedule a maintenance window to minimize disruption to users.
2. Stop database activity on the source Oracle database.
3. Perform a final data synchronization to verify all changes are captured.
4. Update DNS configurations to point to the new Azure VM.
5. Start the Oracle database on the Azure VM and verify connectivity.
6. Monitor the system closely for any issues during the cutover process.

## Post migration tasks 

After the cutover, verify all business applications are functioning as expected to deliver business operations in tandem with on premise. 

- Perform validation checks to verify data consistency and application functionality.
- Update documentation, including: network diagrams, configuration details, and disaster recovery plans.
- Implement ongoing monitoring and maintenance processes for Azure VM hosting the Oracle database.

Throughout the migration process, it's essential to communicate effectively with stakeholders, including application owners, IT operations teams, and end-users, to manage expectations and minimize disruption. Additionally, consider engaging with experienced professionals or consulting services specializing in Oracle-to-Azure migrations to ensure a smooth and successful transition. 

## Next steps 

[Storage options for Oracle on Azure VMs](/azure/virtual-machines/workloads/oracle/oracle-performance-best-practice) 
