---
title: Back up your data to Azure with Commvault
titleSuffix: Azure Storage
description: Provides an overview of factors to consider and steps to follow to use Azure as a storage target and recovery location for Commvault Complete Backup and Recovery 

author: karauten
ms.author: karauten
ms.date: 03/15/2021
ms.topic: conceptual
ms.service: azure-storage
ms.subservice: storage-partner-integration
---

# Backup to Azure with Commvault

This article helps you integrate a Commvault infrastructure with Azure Blob storage. It includes prerequisites, considerations, implementation, and operational guidance. This article addresses using Azure as an offsite backup target and a recovery site if a disaster occurs, which prevents normal operation within your primary site.

> [!NOTE]
> Commvault offers a lower recovery time objective (RTO) solution, Commvault Live Sync. This solution lets you have a standby VM that can help you recover more quickly in the event of a disaster in an Azure production environment. These capabilities are outside the scope of this document.

## Reference architecture

The following diagram provides a reference architecture for on-premises to Azure and in-Azure deployments.

![Commvault to Azure Reference Architecture](../media/commvault-diagram.png)

Your existing Commvault deployment can easily integrate with Azure by adding an Azure storage account, or multiple accounts, as a cloud storage target. Commvault also allows you to recover backups from on-premises within Azure giving you a recovery-on-demand site in Azure.

## Commvault interoperability matrix

| Workload | GPv2 and Blob storage | Cool tier support | Archive tier support | Data Box Family support |
|-----------------------|--------------------|--------------------|-------------------------|-------------------------|
| On-premises VMs/data | v11.5 | v11.5 | v11.10 | v11.10 |
| Azure VMs | v11.5 | v11.5 | v11.5 | N/A |
| Azure Blob | v11.6 | v11.6 | v11.6 | N/A |
| Azure Files | v11.6 | v11.6 | v11.6 | N/A |

## Before you begin

A little upfront planning will help you use Azure as an offsite backup target and recovery site.

### Get started with Azure

Microsoft offers a framework to follow to get you started with Azure. The [Cloud Adoption Framework](/azure/architecture/cloud-adoption/) (CAF) is a detailed approach to enterprise digital transformation and comprehensive guide to planning a production grade cloud adoption. The CAF includes a step-by-step [Azure setup guide](/azure/cloud-adoption-framework/ready/azure-setup-guide/) to help you get up and running quickly and securely. You can find an interactive version in the [Azure portal](https://portal.azure.com/?feature.quickstart=true#blade/Microsoft_Azure_Resources/QuickstartCenterBlade). You'll find sample architectures, specific best practices for deploying applications, and free training resources to put you on the path to Azure expertise.

### Consider the network between your location and Azure

Whether using cloud resources to run production, test and development, or as a backup target and recovery site, it's important to understand your bandwidth needs for initial backup seeding and for ongoing day-to-day transfers.

Azure Data Box provides a way to transfer your initial backup baseline to Azure without requiring more bandwidth. This is useful if the baseline transfer is estimated to take longer than you can tolerate. You can use the Data Transfer estimator when you create a storage account to estimate the time required to transfer your initial backup.

![Shows the Azure Storage data transfer estimator in the portal.](../media/az-storage-transfer.png)

Remember, you'll require enough network capacity to support daily data transfers within the required transfer window (backup window) without impacting production applications. This section outlines the tools and techniques that are available to assess your network needs.

#### Determine how much bandwidth you'll need

To determine how much bandwidth you'll need, use the following resources:

- Reports from your backup software.
- Commvault provides standard reports to determine [change rate](https://documentation.commvault.com/commvault/v11_sp19/article?p=39699.htm) and [total backup set size](https://documentation.commvault.com/commvault/v11_sp19/article?p=39621.htm) for the initial baseline transfer to Azure.
- Backup software-independent assessment and reporting tools like:
  - [Aptare](https://www.veritas.com/insights/aptare-it-analytics)
  - [Datavoss](https://www.datavoss.com/)

#### Determine unutilized internet bandwidth

It's important to know how much typically unutilized bandwidth (or *headroom*) you have available on a day-to-day basis. This helps you assess whether you can meet your goals for:

- initial time to upload when you're not using Azure Data Box for offline seeding
- completing daily backups based on the change rate identified earlier and your backup window

Use the following methods to identify the bandwidth headroom that your backups to Azure are free to consume.

- If you're an existing Azure ExpressRoute customer, view your [circuit usage](../../../../../expressroute/expressroute-monitoring-metrics-alerts.md#circuits-metrics) in the Azure portal.
- Contact your ISP. They should be able to share reports that show your existing daily and monthly utilization.
- There are several tools that can measure utilization by monitoring your network traffic at the router/switch level. These include:
  - [Solarwinds Bandwidth Analyzer Pack](https://www.solarwinds.com/network-bandwidth-analyzer-pack?CMP=ORG-BLG-DNS)
  - [Paessler PRTG](https://www.paessler.com/bandwidth_monitoring)
  - [Cisco Network Assistant](https://www.cisco.com/c/en/us/products/cloud-systems-management/network-assistant/index.html)
  - [WhatsUp Gold](https://www.whatsupgold.com/network-traffic-monitoring)

### Choose the right storage options

When you use Azure as a backup target, you'll make use of [Azure Blob storage](../../../../blobs/storage-blobs-introduction.md). Blob storage is Microsoft's object storage solution. Blob storage is optimized for storing massive amounts of unstructured data, which is data that does not adhere to any data model or definition. Additionally, Azure Storage is durable, highly available, secure, and scalable. You can select the right storage for your workload to provide the [level of resiliency](../../../../common/storage-redundancy.md) to meet your internal SLAs. Blob storage is a pay-per-use service. You're [charged monthly](../../../../blobs/access-tiers-overview.md#pricing-and-billing) for the amount of data stored, accessing that data, and in the case of cool and archive tiers, a minimum required retention period. The resiliency and tiering options applicable to backup data are summarized in the following tables.

**Blob storage resiliency options:**

|  |Locally-redundant  |Zone-redundant  |Geo-redundant  |Geo-zone-redundant  |
|---------|---------|---------|---------|---------|
|**Effective # of copies**     | 3         | 3         | 6         | 6 |
|**# of availability zones**     | 1         | 3         | 2         | 4 |
|**# of regions**     | 1         | 1         | 2         | 2 |
|**Manual failover to secondary region**     | N/A         | N/A         | Yes         | Yes |

**Blob storage tiers:**

|  | Hot tier   |Cool tier   | Archive tier |
| ----------- | ----------- | -----------  | -----------  |
| **Availability** | 99.9%         | 99%         | Offline      |
| **Usage charges** | Higher storage costs, Lower access, and transaction costs | Lower storage costs, higher access, and transaction costs | Lowest storage costs, highest access, and transaction costs |
| **Minimum data retention required**| N/A | 30 days | 180 days |
| **Latency (time to first byte)** | Milliseconds | Milliseconds | Hours |

#### Sample backup to Azure cost model

With pay-per-use can be daunting to customers who are new to the cloud. While you pay for only the capacity used, you do also pay for transactions (read and or writes) and [egress for data](https://azure.microsoft.com/pricing/details/bandwidth/) read back to your on-premises environment when [Azure Express Route direct local or Express Route unlimited data plan](https://azure.microsoft.com/pricing/details/expressroute/) are in use where data egress from Azure is included. You can use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) to perform "what if" analysis. You can base the analysis on list pricing or on [Azure Storage Reserved Capacity pricing](../../../../../cost-management-billing/reservations/save-compute-costs-reservations.md), which can deliver up to 38% savings. Here's an example pricing exercise to model the monthly cost of backing up to Azure. This is only an example. *Your pricing may vary due to activities not captured here.*

|Cost factor  |Monthly cost  |
|---------|---------|
|100 TB of backup data on cool storage     |$1556.48         |
|2 TB of new data written per day x 30 Days     |$39 in transactions          |
|Monthly estimated total     |$1595.48         |
|---------|---------|
|One time restore of 5 TB to on-premises over public internet   | $491.26         |

> [!NOTE]
> This estimate was generated in the Azure Pricing Calculator using East US Pay-as-you-go pricing and is based on the Commvault default of 32 MB sub-chunk size which generates 65,536 PUT Requests (write transactions), per day. This example may not be applicable towards your requirements.

## Implementation guidance

This section provides a brief guide for how to add Azure Storage to an on-premises Commvault deployment. For detailed guidance and planning considerations, see the [Commvault Public Cloud Architecture guide for Microsoft Azure](https://documentation.commvault.com/commvault/v11/others/pdf/public-cloud-architecture-guide-for-microsoft-azure11-19.pdf).

1. Open the Azure portal, and search for **storage accounts**. You can also click on the default **Storage accounts** icon.

    ![Shows adding a storage accounts in the Azure portal.](../media/azure-portal.png)
  
    ![Shows where you've typed storage in the search box of the Azure portal.](../media/locate-storage-account.png)

2. Select **Create** to add an account. Select or create a resource group, provide a unique name, choose the region, select **Standard** performance, always leave account kind as **Storage V2**, choose the replication level which meets your SLAs, and the default tier your backup software will apply. An Azure Storage account makes hot, cool, and archive tiers available within a single account and Commvault policies allow you to use multiple tiers to effectively manage the lifecycle of your data.

    ![Shows storage account settings in the portal](../media/account-create-1.png)

3. Keep the default networking options for now and move on to **Data protection**. Here, you can choose to enable soft delete, which allows you to recover an accidentally deleted backup file within the defined retention period and offers protection against accidental or malicious deletion.

    ![Shows the Data Protection settings in the portal.](../media/account-create-2.png)

4. Next, we recommend the default settings from the **Advanced** screen for backup to Azure use cases.

    ![Shows Advanced settings tab in the portal.](../media/account-create-3.png)

5. Add tags for organization if you use tagging, and create your account.

6. Two quick steps are all that are now required before you can add the account to your Commvault environment. Navigate to the account you created in the Azure portal and select **Containers** under the **Blob service** menu. Add a container and choose a meaningful name. Then, navigate to the **Access keys** item under **Settings** and copy the **Storage account name** and one of the two access keys. You'll need the container name, account name, and access key in the next steps.

    ![Shows container creation in the portal.](../media/container.png)

    ![Shows access key settings in the portal.](../media/access-key.png)

7. (*Optional*) You can add additional layers of security to your deployment.

    1. Configure role-based access to limit who can make changes to your storage account. For more information, see [Built-in roles for management operations](../../../../common/authorization-resource-provider.md#built-in-roles-for-management-operations).
    1. Restrict access to the account to specific network segments with [storage firewall settings](../../../../common/storage-network-security.md) to prevent access attempts from outside your corporate network.

        ![Shows storage firewall settings in the portal.](../media/storage-firewall.png)

    1. Set a [delete lock](../../../../../azure-resource-manager/management/lock-resources.md) on the account to prevent accidental deletion of the storage account.

        ![Shows setting a delete lock in the portal.](../media/resource-lock.png)

    1. Configure additional [security best practices](../../../../../storage/blobs/security-recommendations.md).

1. In the Commvault Command Center, navigate to **Manage** -> **Security** -> **Credential Manager**. Choose a **Cloud Account**, **Vendor type** of **Microsoft Azure Storage**, select the **MediaAgent**, which will transfer data to and from Azure, add the storage account name and access key.

    ![Shows adding credentials in Commvault Command Center.](../media/commvault-credential.png)

9. Next, navigate to **Storage** -> **Cloud** in Commvault Command Center. Choose to **Add**. Enter a friendly name for the storage account and then select **Microsoft Azure Storage** from the **Type** list. Select a Media Agent server to be used to transfer backups to Azure Storage. Add the container you created, choose the storage tier to use within the Azure storage account, and select the credentials created in Step #8. Finally, choose whether or not to transfer deduplicated backups or not and a location for the deduplication database.

     ![Screenshot of Commvault's Add cloud user interface. In the Archive drop-down menu, **Archive** is selected.](../media/commvault-add-storage.png)

10. Finally, add your new Azure Storage resource to an existing or new plan in Commvault Command Center via **Manage** -> **Plans** as a backup destination.

    ![Screenshot of the Commvault Command Center user interface. In the left navigation, under **Manage**, **Plans** is selected.](../media/commvault-plan.png)

11. *(Optional)* If you plan to use Azure as a recovery site or Commvault to migrate servers and applications to Azure, it's a best practice to deploy a VSA Proxy in Azure. You can find detailed instructions [here](https://documentation.commvault.com/commvault/v11/article?p=106208.htm).

## Operational guidance

### Azure alerts and performance monitoring

It is advisable to monitor both your Azure resources and Commvault's ability to leverage them as you would with any storage target you rely on to store your backups. A combination of Azure Monitor and Commvault Command Center monitoring will help you keep your environment healthy.

#### Azure portal

Azure provides a robust monitoring solution in the form of [Azure Monitor](../../../../../azure-monitor/essentials/monitor-azure-resource.md). You can [configure Azure Monitor](../../../../blobs/monitor-blob-storage.md) to track Azure Storage capacity, transactions, availability, authentication, and more. You can find the full reference of metrics that are collected [here](../../../../blobs/monitor-blob-storage-reference.md). A few useful metrics to track are BlobCapacity - to make sure you remain below the maximum [storage account capacity limit](../../../../common/scalability-targets-standard-account.md), Ingress and Egress - to track the amount of data being written to and read from your Azure Storage account, and SuccessE2ELatency - to track the roundtrip time for requests to and from Azure Storage and your MediaAgent.

You can also [create log alerts](../../../../../service-health/alerts-activity-log-service-notifications-portal.md) to track Azure Storage service health and view the [Azure status dashboard](https://azure.status.microsoft/status) at any time.

#### Commvault Command Center

- [Create an alert for cloud storage pools](https://documentation.commvault.com/commvault/v11/article?p=100514_3.htm)
- For information about where you can view performance reports, job completion and begin basic troubleshooting, see [Dashboards](https://documentation.commvault.com/commvault/v11/article?p=95306_1.htm).

### How to open support cases

When you need help with your backup to Azure solution, you should open a case with both Commvault and Azure. This helps our support organizations to collaborate, if necessary.

#### To open a case with Commvault

On the [Commvault Support Site](https://www.commvault.com/support), sign in, and open a case.

To understand the support contract options available to you, see [Commvault support options](https://ma.commvault.com/support)

You may also call in to open a case, or reach Commvault Support via email:

- Toll free: +1 877-780-3077
- [Worldwide Support numbers](https://ma.commvault.com/Support/TelephoneSupport)
- [Email Commvault Support](mailto:support@commvault.com)

#### To open a case with Azure

In the [Azure portal](https://portal.azure.com) search for **support** in the search bar at the top. Select **Help + support** -> **New Support Request**.

> [!NOTE]
> When you open a case, be specific that you need assistance with Azure Storage or Azure Networking. Do not specify Azure Backup. Azure Backup is the name of an Azure service and your case will be routed incorrectly.

### Links to relevant Commvault documentation

See the following Commvault documentation for further detail:

- [Commvault User Guide](https://documentation.commvault.com/commvault/v11/article?p=37684_1.htm)
- [Commvault Azure Architecture Guide](https://documentation.commvault.com/commvault/v11/others/pdf/public-cloud-architecture-guide-for-microsoft-azure11-19.pdf)

### Marketplace offerings

Commvault has made it easy to deploy their solution in Azure to protect Azure Virtual Machines and many other Azure services. For more information, see the following references:

- [Deploy Commvault via the Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/commvault.commvault?tab=Overview)
- [Commvault for Azure datasheet](https://www.commvault.com/resources/microsoft-azure-cloud-platform-datasheet)
- [Commvault's list of supported Azure features and services](https://documentation.commvault.com/commvault/v11/article?p=109795_1.htm)
- [How to use Commvault to protect SAP HANA in Azure](https://azure.microsoft.com/resources/protecting-sap-hana-in-azure/)

## Next steps

See these additional Commvault resources for information about specialized usage scenarios.

- [Use Commvault to Migrate your servers and applications to Azure](https://www.commvault.com/supported-technologies/microsoft/azure)
- [Protect SAP in Azure with Commvault](https://www.youtube.com/watch?v=4ZGGE53mGVI)
- [Protect Office365 with Commvault](https://www.youtube.com/watch?v=dl3nvAacxZU)
