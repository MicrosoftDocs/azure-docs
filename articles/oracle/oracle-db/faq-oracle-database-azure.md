---
title: Oracle Database@Azure FAQs
description: Learn answers to frequently ask questions about Oracle Database@Azure
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
ms.custom: engagement-fy24
---

# Oracle Database@Azure FAQs
This article answers frequently asked questions (FAQs) about the Oracle Database@Azure offering.

## General
In this section, we cover general questions about Oracle Database@Azure.

### How does Oracle Database@Azure work?
Oracle Database@Azure is enabled by hosting OCI’s infrastructure in Azure and natively integrated with Azure offering low-latency, high-bandwidth connectivity from your mission critical database tier to your application tier and rest of services in Azure. Enterprise critical features like RAC, Data Guard, Golden Gate, managed backups, self-managed RMAN backups, Zero Downtime Migration, on-premises connectivity, and seamless integration with other Azure services are supported. For more information, see [Overview - Oracle Database@Azure | Microsoft Learn](/azure/oracle/oracle-db/database-overview).

### How is Oracle Database@Azure different from OCI Interconnect and Oracle on Azure VMs?

- Oracle Database@Azure: Oracle Database@Azure (Oracle Database Service for Azure) is hosted on OCI’s infrastructure in Azure datacenters enabling you to host your mission critical Oracle databases closer to your application tier hosted in Azure. Azure virtual network integration with subnet delegation enables private IPs from customer virtual network to serve as database endpoints. This solution is Oracle managed and supported service in Azure.

- Oracle on Azure VMs: You can also deploy and self-manage your Oracle workloads on Azure VMs. Specifically, workloads that don't require features like RAC, Smart Scan or Exadata performance are best suited for this operation.

- OCI Interconnect: OCI interconnect is used to connect your Oracle deployments in OCI with Applications and services in Azure over OCI FastConnect and Azure ExpressRoute. This typically suits workloads/solutions that can work with the high latency envelope, have dependency on services, features, and functionalities running in both clouds.

### Is Oracle Database@Azure available on dedicated infrastructure or is it only available as a shared service? What is the isolation level?

There are two services offered as part of Oracle Database@Azure:

- Oracle Exadata Database Service on Dedicated Infrastructure runs on Dedicated Exadata infrastructure in Azure. You get dedicated Oracle CPUs (OCPUs) and storage, with isolation being at the node level.

- Oracle Autonomous Database Serverless is the other Oracle Database service offered at Azure and is on shared Exadata infrastructure.

### What are the Database versions supported on Oracle Database@Azure?

Oracle versions supported on Oracle Cloud Infrastructure (OCI) are supported on Oracle Database@Azure. This includes 11 g to 19c, similar to Exadata Cloud Service in OCI. Versions older than 19c need upgrade support. For more information, see [Oracle Database Releases That Support Direct Upgrade](https://docs.oracle.com/en/database/oracle/oracle-database/18/upgrd/oracle-database-releases-that-support-direct-upgrade.html).

### Do you have any documented benchmark latency-wise between Azure resources and Oracle Database@Azure?

Latency between Azure resources and Oracle Database@Azure is within the Azure regional latency envelope as the Exadata infrastructure is within the Azure Data Centers. Latency can be further fine-tuned dependent on Co-Location within Availability Zones. For more information, please see [here](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview?tabs=azure-cli)

### Does Oracle Database@Azure support deploying Base Database (BD), or do I need to migrate to Autonomous Database service?

No, Base Database isn't currently supported with Oracle Database@Azure. You can deploy single instance self-managed databases on Azure VMs or if you need Oracle managed databases with RAC, we recommend Autonomous Databases via Oracle Database@Azure. For more information, see [Autonomous Database | Oracle](https://www.oracle.com/cloud/azure/oracle-database-at-azure/) and [Provision Oracle Autonomous Databases | Microsoft Learn](/training/modules/migrate-oracle-workload-azure-odaa/).

### For the Oracle Database@Azure service, will the automated DR use Azure backbone or the OCI backbone?

BCDR is enabled using the OCI managed offering (Backup and Data Guard) and will use the Azure-OCI backbone.

### How many database servers can be deployed in each rack of Oracle Database@Azure? Is there flexibility in terms of being able to scale up and down as needed from both the consumption and licensing perspective?

Oracle Database@Azure currently runs on X9M hardware and provides a configuration of a minimum of two database servers and three Storage servers. This constitutes a quarter rack configuration. This configuration can be increased to a limit of 32 database servers and 64 Storage servers. You can scale up and down as needed within the Exadata system depending on your SKU. For more information about configurations, see [Oracle Exadata Database Service on Dedicated Infrastructure Description](https://docs.oracle.com/en-us/iaas/exadatacloud/exacs/exa-service-desc.html#ECSCM-GUID-EC1A62C6-DDA1-4F39-B28C-E5091A205DD3). For more specifics, see [Oracle Exadata Cloud Infrastructure X9M Data Sheet](https://www.oracle.com/a/ocom/docs/engineered-systems/exadata/exadata-cloud-infrastructure-x9m-ds.pdf).

### What Oracle applications are supported to run on Azure?

Various Oracle applications are authorized and supported to be run on Azure. For more information, see [Oracle programs are eligible for Authorized Cloud Environments](https://www.oracle.com/us/corporate/pricing/authorized-cloud-environments-3493562.pdf).

### What are the available Service Level Agreements (SLAs)?

For detailed Service Level Agreements, refer to the Oracle PaaS and IaaS Public Cloud Services [Pillar Document](https://www.oracle.com/contracts/docs/paas_iaas_pub_cld_srvs_pillar_4021422.pdf?download=false).

## Billing and Commerce
In this section, we cover questions related to billing and commerce for Oracle Database@Azure.

### How much will Oracle Database@Azure cost?

Oracle Database@Azure is at parity with the Exadata Cloud costs in OCI. For list prices, refer to [OCI’s Cloud Cost Estimator](https://www.oracle.com/cloud/costestimator.html). For your specific costs tailored to your needs, work with your Oracle sales team.

### Is Oracle Database@Azure eligible for MACC (Microsoft Azure Commit to Consume)?

Yes, the Oracle Database@Azure offering is Azure benefits eligible and hence eligible for MACC decrement.

### What licensing options are available to deploy Oracle Databases with Oracle Database@Azure.

You can Bring Your Own License (BYOL) or provision License included Oracle databases with Oracle Database@Azure.

### Can I procure Oracle Database@Azure even if the service isn't available in my region?

You can purchase the Oracle Database@Azure anytime as it's Generally Available in multiple regions. However, you can only deploy the service in the region of your choice once it's live.

### For the Oracle Database@Azure service, will the automated DBCS DR incur charges from Azure?

BCDR using the OCI managed offering (Backup and Data Guard) won't incur any more charges from Azure.

### Does ingress/egress incur any charges for the Oracle Database@Azure service?

Ingress and Egress for managed services is via Azure OCI backbone and doesn't incur charges. Virtual network traffic is charged at the current price.

## Onboarding, Provisioning, and Migration
In this section, we'll cover questions related to onboarding, provisioning, and migration to Oracle Database@Azure.
### To set up Oracle Database@Azure, what would be the role assignments needed for the Azure user?

You can find the list of role assignments [here](https://learn.microsoft.com/en-us/azure/oracle/oracle-db/oracle-database-groups-roles)

### Can you describe the authentication/authorization standards supported by Oracle Database@Azure?

Oracle Database@Azure is based on SAML and OpenID standards. OCI Oracle Identity and Access Management (IAM) can be federated with Microsoft Entra ID, or other customer used identity providers for OCI Console access for Oracle Database Users.

### Where can I find best practices to plan and deploy Oracle Database@Azure?

Refer to our landing zone architecture documentation to plan and deploy your oracle workloads with Oracle Database@Azure [here](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/oracle-iaas/?wt.mc_id=knwlserapi_inproduct_azportal#landing-zone-architecture-for-oracle-databaseazure)

### Does Azure have any tools to assist with understanding Oracle database sizing, license usage and TCO for both Oracle Database@Azure and Oracle IaaS?

For Oracle Database@Azure, the sizing is managed by Oracle. Contact your Oracle representative for sizing.

For Oracle Database on Azure VMs, we currently have the Oracle Migration Assistance Tool (OMAT). Contact your Microsoft representative for more information.

### What tools can be used for database migration? Could you help share other details about licensing and charges for these tools?

There are multiple tools available from Oracle: ZDM, Data Guard, Data pump, GoldenGate, and [more](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/oracle-iaas/oracle-migration-planning?wt.mc_id=knwlserapi_inproduct_azportal#migrate-oracle-workloads-to-azure). For more information, contact your Oracle representative for commercials.

### When using Oracle GoldenGate for migration, do I need to purchase a GoldenGate license?

Yes, and it isn't included in the private offer. Discuss with your Oracle representative on how to enable this service in addition to Oracle Database@Azure.

## Networking
In this section, we cover questions related to networking for Oracle Database@Azure.

### What network patterns and network features are supported with Oracle Database@Azure?

We support a comprehensive list of connectivity patterns and network features with Oracle Database@Azure and the list evolves as we're continuously releasing new features and capabilities. For more information, see [Network planning for Oracle Database@Azure | Microsoft Learn](oracle-database-network-plan.md).

### How does Data Guard traffic between Availability Zones in the same region work?

Data Guard network path can be configured while setting it up. For cross zone Data Guard traffic, you have an option to configure the traffic to traverse only the Azure backbone. For cross region traffic however, it must traverse through Azure and OCI network backbone.

### What is the latency impact of using OCI connections?

None. The OCI connection is primarily utilized for OCI control plane to manage the service and so there's no impact to your Application to DB latencies or any data plane latencies.

### How do I achieve low latencies between my application and Database tiers?

You can deploy your application and database in the same virtual network or a peered VNETs in the same region and availability zone for lowest possible latencies.

## Management
In this section, we cover questions related to management for Oracle Database@Azure.

### Who manages and hosts the data in this partnership with Oracle?

Oracle will manage and host the data on Oracle Cloud Infrastructure hosted in Azure datacenters. Your data reside within the provisioned Oracle Exadata infrastructure in Azure, and within the Azure Virtual Network boundary.

In case you enable backup to Azure, that data reside in the respective Azure storage – Azure NetApp Files, Blob storage.

We ensure compliance with both companies’ data privacy and compliance policies through physical isolation of systems within Azure datacenters and access enforced assignment policies. For more information on compliance, refer to [Overview - Oracle Database@Azure | Microsoft Learn](database-overview.md) or [Oracle compliance website](https://docs.oracle.com/en-us/iaas/Content/multicloud/compliance.htm).

### How is data security managed? Is the data encrypted in transit and at rest?

Data is encrypted at rest. All traffic between sites, including Oracle Database@Azure infrastructure, is encrypted.

### Can Azure Monitor be used to along with Oracle Database@Azure?

Yes, Metrics are published for Exadata Infra, VM cluster and Oracle databases. The database metrics are folded under VM metrics. Custom dashboards can be created on Azure Monitor along with your application monitoring for a unified view.

### What are the different options for backup on Oracle Database@Azure?

Automated / managed backups to OCI object storage and self-managed backups using RMAN to Azure NetApp Files (ANF).

### Is there a way to connect to SAN storage and will this connection be supported?

Oracle Database@Azure service provides customers with dedicated Exadata compute and storage within the Exadata Infrastructure. For other storage options, Azure NetApp Files volumes can be attached to the VMs on the VM clusters.

### Will we be able to use Azure HSM, or external HSM to encrypt databases? How would customer managed database keys work?

You can manage keys with Oracle Key Vault. Integration with Azure offerings like HSM and Sentinel are on the roadmap.

### What type of storage redundancy options are available?

Oracle ASM is the default and only storage management system supported on Exadata systems. Only NORMAL (protection against single disk or an entire storage server failure) and HIGH redundancy (protection against two simultaneous partner disk failures from two distinct storage servers) levels are supported on Exadata systems. For more information, see [Oracle ASM Considerations 
for Exadata Deployments: 
On-premises and Cloud](https://www.oracle.com/docs/tech/database/maa-exadata-asm-cloud.pdf).

### Is tiering storage available for the database within Oracle Database@Azure?

Tiering storage service is available as part of Oracle Database@Azure. The Exadata storage servers provide three levels of tiering--PMem, NVME Flash, and HDD. Compression and partitioning are recommended as part of a storage tiering design. For more information, see [Oracle Exadata Cloud Infrastructure X9M Data Sheet](https://www.oracle.com/a/ocom/docs/engineered-systems/exadata/exadata-cloud-infrastructure-x9m-ds.pdf).

### Where can I go to get more information about capabilities and features corresponding to Oracle Database@Azure?

For more information about Oracle Database@Azure, see the following resources.

- [Overview - Oracle Database@Azure](/azure/oracle/oracle-db/database-overview)
- [Provision and manage Oracle Database@Azure](https://docs.oracle.com/en-us/iaas/Content/multicloud/oaaonboard.htm)
- [Oracle Database@Azure support information](https://mylearn.oracle.com/ou/course/oracle-databaseazure-deep-dive/135849)
- [Network planning for Oracle Database@Azure](/training/modules/migrate-oracle-workload-azure-odaa/)
- [Groups and roles for Oracle Database@Azure](https://www.oracle.com/cloud/azure/oracle-database-at-azure/)

## Next steps

- [Overview - Oracle Database@Azure](/azure/oracle/oracle-db/database-overview)
- [Provision and manage Oracle Database@Azure](https://docs.oracle.com/en-us/iaas/Content/multicloud/oaaonboard.htm)
- [Oracle Database@Azure support information](https://mylearn.oracle.com/ou/course/oracle-databaseazure-deep-dive/135849)
- [Network planning for Oracle Database@Azure](/training/modules/migrate-oracle-workload-azure-odaa/)
- [Groups and roles for Oracle Database@Azure](https://www.oracle.com/cloud/azure/oracle-database-at-azure/)
