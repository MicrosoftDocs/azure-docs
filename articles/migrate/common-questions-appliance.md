---
title: Azure Migrate appliance FAQ
description: Get answers to common questions about the Azure Migrate appliance.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.service: azure-migrate
ms.topic: conceptual
ms.custom: ignite-2022, engagement-fy24
ms.date: 08/24/2022
---

# Azure Migrate appliance: Common questions

This article answers common questions about the Azure Migrate appliance. If you have other questions, check these resources:

- [General questions](resources-faq.md) about Azure Migrate
- Questions about [discovery, assessment, and dependency visualization](common-questions-discovery-assessment.md)
- Questions about [Migration and modernization](common-questions-server-migration.md)
- Get questions answered in the [Azure Migrate forum](https://aka.ms/AzureMigrateForum)

## What is the Azure Migrate appliance?

The Azure Migrate appliance is a lightweight appliance that the Azure Migrate: Discovery and assessment tool uses to discover and assess physical or virtual servers from on-premises or any cloud. The Migration and modernization tool also uses the appliance for agentless migration of on-premises servers running in VMware environment.

Here's more information about the Azure Migrate appliance:

- The appliance is deployed on-premises as a physical server or a virtualized server.
- The appliance discovers on-premises servers and continually sends server metadata and performance data to Azure Migrate.
- Appliance discovery is agentless. Nothing is installed on the discovered servers.

[Learn more](migrate-appliance.md) about the appliance.

## How can I deploy the appliance?

The appliance can be deployed using a couple of methods:

- The appliance can be deployed using a template for servers running in VMware or Hyper-V environment ([OVA template for VMware](how-to-set-up-appliance-vmware.md) or [VHD for Hyper-V](how-to-set-up-appliance-hyper-v.md)).
- If you don't want to use a template, you can deploy the appliance for VMware or Hyper-V environment using a [PowerShell installer script](deploy-appliance-script.md).
- In Azure Government, you should deploy the appliance using a PowerShell installer script. Refer to the steps of deployment [here](deploy-appliance-script-government.md).
- For physical or virtualized servers on-premises or any other cloud, you always deploy the appliance using a PowerShell installer script. Refer to the steps of deployment [here](how-to-set-up-appliance-physical.md).

## How does the appliance connect to Azure?

The appliance can connect to Azure using public or private networks or using Azure ExpressRoute.

- Make sure the appliance can connect to these [Azure URLs](./migrate-appliance.md#url-access). 
- You can use ExpressRoute with Microsoft peering. Public peering is deprecated, and isn't available for new ExpressRoute circuits.

## Does appliance analysis affect performance?

The Azure Migrate appliance profiles on-premises servers continuously to measure performance data. This profiling has almost no performance impact on profiled servers.

## Can I harden the appliance?

When you use the downloaded template to create the appliance, you can add components (antivirus, for example) to the template. Ensure that you have allowed access to the correct [URLs](migrate-appliance.md#public-cloud-urls) through Azure Firewall and that the *%ProgramData%\Microsoft Azure* folder is excluded from antivirus scanning.

## What network connectivity is required?

The appliance needs access to Azure URLs. [Review](migrate-appliance.md#url-access) the URL list.

## What data does the appliance collect?

See the following articles for information about data that the Azure Migrate appliance collects on servers:

- **Servers in VMware environment**: [Review](discovered-metadata.md#collected-metadata-for-vmware-servers) collected data.
- **Servers in Hyper-V environment**: [Review](discovered-metadata.md#collected-metadata-for-hyper-v-servers) collected data.
- **Physical or virtual servers**: [Review](discovered-metadata.md#collected-data-for-physical-servers) collected data.

## How is data stored?

Data that's collected by the Azure Migrate appliance is stored in the Azure location where you created the project.

Here's more information about how data is stored:

- The collected data is securely stored in Azure Cosmos DB in a Microsoft subscription. The data is deleted when you delete the project. Storage is handled by Azure Migrate. You can't specifically choose a storage account for collected data.
- If you use [dependency visualization](concepts-dependency-visualization.md), the data that's collected is stored in an Azure Log Analytics workspace created in your Azure subscription. The data is deleted when you delete the Log Analytics workspace in your subscription.

## How much data is uploaded during continuous profiling?

The volume of data that's sent to Azure Migrate depends on multiple parameters. As an example, a project that has 10 servers (each with one disk and one NIC) sends approximately 50 MB of data per day. This value is approximate; the actual value varies depending on the number of data points for the disks and NICs. If the number of servers, disks, or NICs increases, the increase in data that's sent is nonlinear.

## Is data encrypted at rest and in transit?

Yes, for both:

- Metadata is securely sent to the Azure Migrate service over the internet via HTTPS.
- Metadata is stored in an [Azure Cosmos DB](../cosmos-db/database-encryption-at-rest.md) database and in [Azure Blob storage](../storage/common/storage-service-encryption.md) in a Microsoft subscription. The metadata is encrypted at rest for storage.
- The data for dependency analysis also is encrypted in transit (by secure HTTPS). It's stored in a Log Analytics workspace in your subscription. The data is encrypted at rest for dependency analysis.

## How does the appliance connect to vCenter Server?

These steps describe how the appliance connects to VMware vCenter Server:

1. The appliance connects to vCenter Server (port 443) by using the credentials you provided when you set up the appliance.
2. The appliance uses VMware PowerCLI to query vCenter Server to collect metadata about the servers that are managed by vCenter Server.
3. The appliance collects configuration data about servers (cores, memory, disks, NICs) and the performance history of each server for the past month.
4. The collected metadata is sent to the Azure Migrate: Discovery and assessment tool (over the internet via HTTPS) for assessment.

## Can the Azure Migrate appliance connect to multiple vCenter Servers?

Yes. If the version of appliance configuration manager is  6.1.265.1 or above, you can connect to up to 10 vCenter Servers and perform discovery, assessment, and migration of servers running across multiple vCenter Servers using a single Azure Migrate appliance. [Learn more](tutorial-discover-vmware.md#start-continuous-discovery).

## Can a project have multiple appliances?

A project can have multiple appliances registered to it. However, one appliance can only be registered with one project.

## How do I find the Azure Migrate appliances registered to the project?
1. From the Azure portal, navigate to [Azure Migrate homepage](https://portal.azure.com/?feature.customportal=false&feature.showassettypes=Microsoft_Azure_Migrate_AzureMigrationHub&feature.smsMigrationTool=true&feature.cloudamizeAssessmentTool=true&feature.sasAssessmentTool=true&feature.firstPartyDiscoveredMachines=true#blade/Microsoft_Azure_Migrate/AmhResourceMenuBlade/getStarted) and from the left menu, select **Servers, databases and web apps**.
1. Select **Change** in the upper-right corner to choose your project.
1. In the Azure Migrate project, select **Overview** from the Azure Migrate: Discovery & assessment.
1. In **Overview**, select **Appliances** in left menu to see the appliances registered with the project and the connectivity status of the agents on the appliance.

## Can the Azure Migrate appliance/Replication appliance connect to the same vCenter?

Yes. You can add both the Azure Migrate appliance (used for assessment and agentless VMware migration), and the replication appliance (used for agent-based migration of servers running in VMware) to the same vCenter server. But make sure that you are not setting up both appliances on the same server and that is currently not supported.

## How many servers can I discover with an appliance?

You can discover up to 10,000 servers in VMware environment, up to 5,000 servers in Hyper-V environment, and up to 1000 physical servers with a single appliance. If you have more servers in your on-premises environment, read about [scaling a Hyper-V assessment](scale-hyper-v-assessment.md), [scaling a VMware assessment](scale-vmware-assessment.md), and [scaling a physical server assessment](scale-physical-assessment.md).

## Can I delete an appliance?

Currently, deleting an appliance from the project isn't supported.

The only way to delete the appliance is to delete the resource group that contains the project that's associated with the appliance.

However, deleting the resource group also deletes other registered appliances, the discovered inventory, assessments, and all other Azure components in the resource group that are associated with the project.

## Can I use the appliance with a different subscription or project?

To use the appliance with a different subscription or project, you would need to reconfigure the existing appliance by running the [PowerShell installer script](deploy-appliance-script.md) for the specific scenario (VMware/Hyper-V/Physical) on the appliance. The script will clean up the existing appliance components and settings to deploy a fresh appliance. Ensure to clear the browser cache before you start using the newly deployed appliance configuration manager.

Also, you cannot reuse an existing project key on a reconfigured appliance. Make sure you generate a new key from the desired subscription/project to complete the appliance registration.

## Can I set up the appliance on an Azure VM?

No. Currently, this option isn't supported.

## Can I discover on an ESXi host?

No. To discover servers in VMware environment, you must have vCenter Server.

## How do I update the appliance?

By default, the appliance and its installed agents are updated automatically. The appliance checks for updates every 24 hours. Updates that fail are retried.

Only the appliance and the appliance agents are updated by these automatic updates. The operating system is not updated by Azure Migrate automatic updates. Use Windows Updates to keep the operating system up to date.

## Can I check agent health?

Yes. In the portal, go the **Agent health** page of the Azure Migrate: Discovery and assessment tool or the Migration and modernization tool. There, you can check the connection status between Azure and the discovery and assessment agents on the appliance.

## Can I add multiple server credentials on appliance?

Yes, we now support multiple server credentials to perform software inventory (discovery of installed applications), agentless dependency analysis, and discovery of SQL Server instances and databases. [Learn more](add-server-credentials.md) on how to provide credentials on the appliance configuration manager.

## What type of server credentials can I add on the appliance?

You can provide domain/ Windows(non-domain)/ Linux(non-domain)/ SQL Server authentication credentials on the appliance configuration manager. [Learn more](add-server-credentials.md) about how to provide credentials and how we handle them.

## What type of SQL Server connection properties are supported by Azure Migrate for SQL discovery?

Azure Migrate will encrypt the communication between Azure Migrate appliance and source SQL Server instances (with Encrypt connection property set to TRUE). These connections are encrypted with [TrustServerCertificate](/dotnet/api/system.data.sqlclient.sqlconnectionstringbuilder.trustservercertificate) (set to TRUE); the transport layer will use SSL to encrypt the channel and bypass the certificate chain to validate trust. The appliance server must be set up to [trust the certificate's root authority](/sql/database-engine/configure-windows/enable-encrypted-connections-to-the-database-engine).

If no certificate has been provisioned on the server when it starts up, SQL Server generates a self-signed certificate that is used to encrypt login packets. [Learn more](/sql/database-engine/configure-windows/enable-encrypted-connections-to-the-database-engine).

## Next steps

Read the [Azure Migrate overview](migrate-services-overview.md).
