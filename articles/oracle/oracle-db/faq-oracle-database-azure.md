---
title: FAQ for Oracle Database@Azure
description: Learn answers to frequently asked questions about Oracle Database@Azure.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
ms.custom: engagement-fy24
---

# FAQ for Oracle Database@Azure

In this article, get answers to frequently asked questions about Oracle Database@Azure.

## General

This section answers general questions about Oracle Database@Azure.

### How does Oracle Database@Azure work?

Oracle Database@Azure is enabled by hosting the Oracle Cloud Infrastructure (OCI) in Azure. In Oracle Database@Azure, OCI is natively integrated with Azure to offer low-latency, high-bandwidth connectivity from your mission-critical database tier to your application tier and other services in Azure. Enterprise-critical features like Oracle Real Application Clusters (Oracle RAC), Oracle Data Guard, Oracle GoldenGate, managed backups, self-managed Oracle Recovery Manager (RMAN) backups, Oracle Zero Downtime Migration (Oracle ZDM), on-premises connectivity, and seamless integration with other Azure services are supported. For more information, see the [overview of Oracle Database@Azure](/azure/oracle/oracle-db/database-overview).

### How is Oracle Database@Azure different from OCI Interconnect and Oracle on Azure virtual machines?

- Oracle Database@Azure: Oracle Database@Azure (Oracle Database Service for Azure) is hosted on the OCI infrastructure in Azure datacenters. You can host your mission-critical Oracle databases closer to your application tier hosted in Azure. Azure virtual network integration with subnet delegation enables private IP addresses from customer virtual networks to serve as database endpoints. This solution is Oracle-managed and a supported service in Azure.

- Oracle on Azure virtual machines (VMs): You can also deploy and self-manage your Oracle workloads on Azure VMs. Specifically, workloads that don't require features like Oracle RAC, Exadata Smart Scan, or Exadata performance are best suited for this operation.

- OCI Interconnect: OCI Interconnect is used to connect your Oracle deployments in OCI with applications and services in Azure via OCI FastConnect and Azure ExpressRoute. This configuration typically suits workloads and solutions that can work with the high-latency envelope and which have dependency on services, features, and functionalities that run in both clouds.

### Is Oracle Database@Azure available on a dedicated infrastructure or is it available only as a shared service? What is the isolation level?

Two services are offered as part of Oracle Database@Azure:

- Oracle Exadata Database on a dedicated infrastructure runs on a dedicated Exadata infrastructure in Azure. You get dedicated Oracle CPUs (OCPUs) and storage. Isolation is at the node level.

- Oracle Autonomous Database is the other Oracle Database service offered at Azure. Autonomous Database is on a shared Exadata infrastructure.

### What Oracle database versions are supported on Oracle Database@Azure?

Oracle versions supported on Oracle Cloud Infrastructure (OCI) are supported on Oracle Database@Azure. These versions include 11g to 19c, similar to Exadata Cloud Service in OCI. Versions earlier than 19c need upgrade support. For more information, see [Oracle Database releases that support direct upgrade](https://docs.oracle.com/en/database/oracle/oracle-database/18/upgrd/oracle-database-releases-that-support-direct-upgrade.html).

### Do you have any documented latency benchmark between Azure resources and Oracle Database@Azure?

Latency between Azure resources and Oracle Database@Azure is within the Azure regional latency envelope because the Exadata infrastructure is inside Azure datacenters. Latency can be further fine-tuned dependent on colocation within availability zones. For more information, see [What are availability zones?](/azure/reliability/availability-zones-overview?tabs=azure-cli).

### Does Oracle Database@Azure support deploying Oracle Base Database, or do I need to migrate to the Autonomous Database service?

No, Base Database isn't currently supported with Oracle Database@Azure. You can deploy single-instance, self-managed databases on Azure VMs. If you need Oracle-managed databases with Oracle RAC, we recommend that you use Autonomous Database via Oracle Database@Azure. For more information, see [Autonomous Database](https://www.oracle.com/cloud/azure/oracle-database-at-azure/) and [Provision Oracle Autonomous Database](provision-autonomous-oracle-databases.md).

### For the Oracle Database@Azure service, does automated disaster recovery use the Azure backbone or the OCI backbone?

Business continuity and disaster recovery (BCDR) are enabled by using the OCI managed offering (Backup and Data Guard). BCDR uses the Azure/OCI backbone.

### How many database servers can be deployed in each rack of Oracle Database@Azure? Is there flexibility in terms of being able to scale up and down as needed from both the consumption and licensing perspective?

Oracle Database@Azure currently runs on Oracle Exadata X9M hardware and provides a configuration of a minimum of 2 database servers and 3 storage servers. This configuration is called *quarter-rack*. This configuration can be increased to a limit of 32 database servers and 64 storage servers. You can scale up and scale down as needed within the Oracle Exadata system depending on your SKU. For more information about configurations, see [Oracle Exadata Database service on a dedicated infrastructure](https://docs.oracle.com/iaas/exadatacloud/doc/exadata-cloud-infrastructure-overview.html#ECSCM-GUID-EC1A62C6-DDA1-4F39-B28C-E5091A205DD3). For details, see the [Oracle Exadata Cloud Infrastructure X9M data sheet](https://www.oracle.com/a/ocom/docs/engineered-systems/exadata/exadata-cloud-infrastructure-x9m-ds.pdf).

### What Oracle applications can run on Azure?

Various Oracle applications are authorized and supported to run on Azure. For more information, see [Oracle programs eligible for authorized cloud environments](https://www.oracle.com/us/corporate/pricing/authorized-cloud-environments-3493562.pdf).

### What service-level agreements are available?

For detailed service-level agreements (SLAs), see [Oracle PaaS and IaaS public cloud services pillars](https://www.oracle.com/contracts/docs/paas_iaas_pub_cld_srvs_pillar_4021422.pdf?download=false).

## Billing and commerce

This section includes questions related to billing and commerce for Oracle Database@Azure.

### How much does Oracle Database@Azure cost?

Oracle Database@Azure is at parity with the Exadata Cloud costs in OCI. For prices, see the [OCI cloud cost estimator](https://www.oracle.com/cloud/costestimator.html). For specific costs for your scenario and environment, contact your Oracle sales team.

### Is Oracle Database@Azure eligible for Microsoft Azure Commit to Consume (MACC) and/or Azure Credit Offers (ACO)?

Oracle Database@Azure offering is eligible for Microsoft Azure Commit to Consume (MACC) decrement. However, Azure credits (ACO) cannot be used to procure Oracle Database@Azure.

### What licensing options are available to deploy Oracle databases by using Oracle Database@Azure?

You can bring your own license (BYOL) or provision a license that's included with Oracle databases in Oracle Database@Azure.

### Can I purchase Oracle Database@Azure even if the service isn't available in my region?

You can purchase the Oracle Database@Azure at any time because it's generally available in multiple regions. However, you can deploy the service in a region only after the service is supported in that region.

### For Oracle Database@Azure, will automated Oracle Database DBCS disaster recovery incur charges from Azure?

BCDR for double-byte character set (DBCS) by using the OCI-managed offering (Oracle Backup and Oracle Data Guard) doesn't incur any more charges from Azure.

### Does ingress and egress incur any charges for the Oracle Database@Azure service?

Ingress and egress for managed services occurs via the Azure/OCI backbone and doesn't incur charges. Virtual network traffic is charged at the current price.

## Onboarding, provisioning, and migrating

This section includes questions related to onboarding, provisioning, and migrating to Oracle Database@Azure.

### Can a CSP or an outsourcer use Oracle Database@Azure?

No. Oracle Database@Azure doesn't support cloud service providers (CSPs), Outsourcer Channel Agreement (OCAs), or multi-party private offers (MPPOs).  

### To set up Oracle Database@Azure, what role assignments does the Azure user need?

For a list of role assignments, see [Groups and roles for Oracle Database@Azure](/azure/oracle/oracle-db/oracle-database-groups-roles).

### Can you describe the authentication and authorization standards that Oracle Database@Azure supports?

Oracle Database@Azure is based on Security Assertion Markup Language (SAML) and OpenID standards. OCI Identity and Access Management (IAM) can be federated with Microsoft Entra ID or with other identity providers for OCI Console access for Oracle database users.

### Where can I find best practices to plan and deploy Oracle Database@Azure?

To plan and deploy your Oracle workloads with Oracle Database@Azure, see the [landing zone architecture documentation](/azure/cloud-adoption-framework/scenarios/oracle-iaas/?wt.mc_id=knwlserapi_inproduct_azportal#landing-zone-architecture-for-oracle-databaseazure).

### Does Azure have any tools to assist with understanding Oracle database sizing, license usage, and total cost of ownership for both Oracle Database@Azure and Oracle Cloud infrastructure as a service (IaaS)?

For Oracle Database@Azure, sizing is managed by Oracle. For more information about sizing, contact your Oracle representative.

For Oracle Database on Azure VMs, we currently offer the Oracle Migration Assistance Tool (OMAT). For more information, contact your Microsoft representative.

### What tools can I use for database migration? Could you share other details about licensing and charges for these tools?

Multiple tools are available from Oracle, including Oracle ZDM, Oracle Data Guard, Oracle Data Pump, and Oracle GoldenGate. For more information, see [Migrate Oracle workloads to Azure](/azure/cloud-adoption-framework/scenarios/oracle-iaas/oracle-migration-planning?wt.mc_id=knwlserapi_inproduct_azportal#migrate-oracle-workloads-to-azure). For commercial accounts, contact your Oracle representative.

### If I use Oracle GoldenGate to migrate, do I need to purchase a GoldenGate license?

Yes. Note that a GoldenGate license isn't included in a private offer. Discuss with your Oracle representative how to enable this service with Oracle Database@Azure.

## Networking

This section includes questions related to networking for Oracle Database@Azure.

### What network patterns and network features are supported with Oracle Database@Azure?

We support a comprehensive list of connectivity patterns and network features for Oracle Database@Azure. The list evolves as we continuously release new features and capabilities. For more information, see [Network planning for Oracle Database@Azure](oracle-database-network-plan.md).

### How does Data Guard route traffic between availability zones in the same Azure region work?

You can configure an Oracle Data Guard network path when you set up your deployment. You can configure *cross-zone* Data Guard traffic to traverse only the Azure backbone. However, *cross-region* traffic must traverse the Azure and OCI network backbones.

### What is the latency impact of using OCI connections?

None. The OCI connection is primarily used for the OCI control plane to manage the service. There's no impact on your application-to-database latencies or on any data-plane latencies.

### How do I achieve low latencies between my application tier and my database tier?

For the lowest possible latencies, you can deploy your application and database in the same virtual network or in peered virtual networks in the same region and availability zone.

## Management

This section includes questions related to management for Oracle Database@Azure.

### Who manages and hosts the data in this partnership with Oracle?

Oracle manages and hosts the data on OCI hosted in Azure datacenters. Your data resides in the provisioned Oracle Exadata infrastructure in Azure, and within the Azure Virtual Network boundary.

If you enable backup to Azure, the data resides in the respective Azure storage, such as Azure NetApp Files and Azure Blob Storage.

We ensure compliance with both companies’ data privacy and compliance policies through physical isolation of systems in Azure datacenters and through enforced access assignment policies. For more information about compliance, see [Overview of Oracle Database@Azure](database-overview.md) and [Oracle Cloud compliance](https://docs.oracle.com/iaas/Content/multicloud/compliance.htm).

### How is data security managed? Is the data encrypted in transit and at rest?

Data is encrypted at rest. All traffic between sites, including to the Oracle Database@Azure infrastructure, is encrypted.

### Can I use Azure Monitor with Oracle Database@Azure?

Yes. Metrics are published for the Oracle Exadata infrastructure, for VM clusters, and for Oracle databases. The database metrics are listed under VM metrics. You can create custom dashboards for Azure Monitor to use with your application monitoring for a unified view. For more information, see [Exadata metrics](https://docs.oracle.com/en-us/iaas/odexa/odexa-monitoring-exadata-services.html) and [metrics for autonomous database](https://docs.oracle.com/en-us/iaas/odadb/odadb-monitoring-autonomous-database-services.html).

### What are the different options for backup on Oracle Database@Azure?

Automated and managed backups to OCI object storage and self-managed backups by using Oracle Database Autonomous Recovery Service to Azure NetApp Files.

### Is there a way to connect to SAN storage, and is this connection supported?

Oracle Database@Azure provides customers with dedicated Oracle Exadata compute and storage within the Exadata infrastructure. You also can attach Azure NetApp Files volumes to the VMs on VM clusters.

### Can we use a hardware security module (HSM) in Azure or an external HSM to encrypt databases? How do customer-managed database keys work?

You can manage keys by using Oracle Key Vault. Integration with Microsoft offerings like Azure Dedicated HSM and Microsoft Sentinel are on the roadmap.

### What type of storage redundancy options are available?

Oracle Automatic Storage Management (Oracle ASM) is the default and only storage management system that's supported on Oracle Exadata systems. Only NORMAL (protection against single disk or an entire storage server failure) and HIGH redundancy (protection against two simultaneous partner disk failures from two distinct storage servers) levels are supported on Oracle Exadata systems. For more information, see [Oracle ASM considerations
for Oracle Exadata deployments, on-premises and cloud](https://www.oracle.com/docs/tech/database/maa-exadata-asm-cloud.pdf).

### Is tiering storage available for the database in Oracle Database@Azure?

Tiering storage service is available for Oracle Database@Azure. The Oracle Exadata storage servers provide three levels of tiering: PMem, NVME Flash, and HDD. Compression and partitioning are recommended as part of a storage tiering design. For more information, see the [Oracle Exadata Cloud Infrastructure X9M data sheet](https://www.oracle.com/a/ocom/docs/engineered-systems/exadata/exadata-cloud-infrastructure-x9m-ds.pdf).

### Where can I get more information about capabilities and features in Oracle Database@Azure?

For more information about Oracle Database@Azure, see the following resources:

- [Overview of Oracle Database@Azure](/azure/oracle/oracle-db/database-overview)
- [Provision and manage Oracle Database@Azure](https://docs.oracle.com/iaas/Content/multicloud/oaaonboard.htm)
- [Support for Oracle Database@Azure](https://mylearn.oracle.com/ou/course/oracle-databaseazure-deep-dive/135849)
- [Network planning for Oracle Database@Azure](/training/modules/migrate-oracle-workload-azure-odaa/)
- [Groups and roles for Oracle Database@Azure](https://www.oracle.com/cloud/azure/oracle-database-at-azure/)
