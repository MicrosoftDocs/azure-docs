<properties
    pageTitle="Azure cool storage for blobs | Microsoft Azure"
    description="Storage tiers for Azure Blob storage offer cost-efficient storage for object data based on access patterns. The cool storage tier is optimized for data that is accessed less frequently."
    services="storage"
    documentationCenter=""
    authors="sribhat-msft"
    manager=""
    editor="tysonn"/>

<tags
    ms.service="storage"
    ms.workload="storage"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="get-started-article"
    ms.date="07/05/2016"
    ms.author="sribhat"/>


# Azure Blob Storage: Hot and cool storage tiers

## Overview

Azure Storage now offers two storage tiers for Blob storage (object storage), so that you can store your data most cost-effectively depending on how you use it. The Azure **hot storage tier** is optimized for storing data that is accessed frequently. The Azure **cool storage tier** is optimized for storing data that is infrequently accessed and long-lived. Data in the cool storage tier can tolerate a slightly lower availability, but still requires high durability and similar time to access and throughput characteristics as hot data. For cool data, slightly lower availability SLA and higher access costs are acceptable trade-offs for much lower storage costs.

Today, data stored in the cloud is growing at an exponential pace. To manage costs for your expanding storage needs, it's helpful to organize your data based on attributes like frequency of access and planned retention period. Data stored in the cloud can be quite different in terms of how it is generated, processed, and accessed over its lifetime. Some data is actively accessed and modified throughout its lifetime. Some data is accessed very frequently early in its lifetime, with access dropping drastically as the data ages. Some data remains idle in the cloud and is rarely, if ever, accessed once stored.

Each of these data access scenarios described above benefits from a differentiated tier of storage that is optimized for a particular access pattern. With the introduction of hot and cool storage tiers, Azure Blob storage now addresses this need for differentiated storage tiers with separate pricing models.

## Blob storage accounts

**Blob storage accounts** are specialized storage accounts for storing your unstructured data as blobs (objects) in Azure Storage. With Blob storage accounts, you can now choose between hot and cool storage tiers to store your less frequently accessed cool data at a lower storage cost, and store more frequently accessed hot data at a lower access cost. Blob storage accounts are similar to your existing general-purpose storage accounts and share all the great durability, availability, scalability, and performance features that you use today, including 100% API consistency for block blobs and append blobs.

> [AZURE.NOTE] Blob storage accounts support only block and append blobs, and not page blobs.

Blob storage accounts expose the **Access Tier** attribute, which allow you to specify the storage tier as **Hot** or **Cool** depending on the data stored in the account. If there is a change in the usage pattern of your data, you can also switch between these storage tiers at any time.

> [AZURE.NOTE] Changing the storage tier may result in additional charges. Please see the [Pricing and Billing](storage-blob-storage-tiers.md#pricing-and-billing) section for more details.

Example usage scenarios for the hot storage tier include:

- Data that is in active use or expected to be accessed (read from and written to) frequently.
- Data that is staged for processing and eventual migration to the cool storage tier.

Example usage scenarios for the cool storage tier include:

- Backup, archival and disaster recovery datasets.
- Older media content not viewed frequently anymore but is expected to be available immediately when accessed.
- Large data sets that need to be stored cost effectively while more data is being gathered for future processing. (*e.g.*, long-term storage of scientific data, raw telemetry data from a manufacturing facility)
- Original (raw) data that must be preserved, even after it has been processed into final usable form. (*e.g.*, Raw media files after transcoding into other formats)
- Compliance and archival data that needs to be stored for a long time and is hardly ever accessed. (*e.g.*, Security camera footage, old X-Rays/MRIs for healthcare organizations, audio recordings and transcripts of customer calls for financial services)

See [About Azure storage accounts](storage-create-storage-account.md) for more information on storage accounts.

For applications requiring only block or append blob storage, we recommend using Blob storage accounts, to take advantage of the differentiated pricing model of tiered storage. However, we understand that this might not be possible under certain circumstances where using general-purpose storage accounts would be the way to go, such as:

- You need to use tables, queues, or files and want your blobs stored in the same storage account. Note that there is no technical advantage to storing these in the same account other than having the same shared keys.
- You still need to use the Classic deployment model. Blob storage accounts are only available via the Azure Resource Manager deployment model.
- You need to use page blobs. Blob storage accounts do not support page blobs. We generally recommend using block blobs unless you have a specific need for page blobs.
- You use a version of the [Storage Services REST API](https://msdn.microsoft.com/library/azure/dd894041.aspx) that is earlier than 2014-02-14 or a client library with a version lower than 4.x, and cannot upgrade your application.

> [AZURE.NOTE] Blob storage accounts are currently supported in a majority of Azure regions with more to follow. You can find the updated list of available regions on the [Azure Services by Region](https://azure.microsoft.com/regions/#services) page.

## Comparison between the storage tiers

The following table highlights the comparison between the two storage tiers:

<table border="1" cellspacing="0" cellpadding="0" style="border: 1px solid #000000;">
<col width="250">
<col width="250">
<col width="250">
<tbody>
<tr>
    <td><strong><center></center></strong></td>
    <td><strong><center>Hot storage tier</center></strong></td>
    <td><strong><center>Cool storage tier</center></strong></td
</tr>
<tr>
    <td><strong><center>Availability</center></strong></td>
    <td><center>99.9%</center></td>
    <td><center>99%</center></td>
</tr>
<tr>
    <td><strong><center>Availability<br>(RA-GRS reads)</center></strong></td>
    <td><center>99.99%</center></td>
    <td><center>99.9%</center></td>
</tr>
<tr>
    <td><strong><center>Usage charges</center></strong></td>
    <td><center>Higher storage costs<br>Lower access and transaction costs</center></td>
    <td><center>Lower storage costs<br>Higher access and transaction costs</center></td>
</tr>
<tr>
    <td><strong><center>Minimum object size<center></strong></td>
    <td colspan="2"><center>N/A</center></td>
</tr>
<tr>
    <td><strong><center>Minimum storage duration<center></strong></td>
    <td colspan="2"><center>N/A</center></td>
</tr>
<tr>
    <td><strong><center>Latency<br>(Time to first byte)<center></strong></td>
    <td colspan="2"><center>milliseconds</center></td>
</tr>
<tr>
    <td><strong><center>Scalability and performance targets<center></strong></td>
    <td colspan="2"><center>Same as general-purpose storage accounts</center></td>
</tr>
</tbody>
</table>

> [AZURE.NOTE] Blob storage accounts support the same performance and scalability targets as general-purpose storage accounts. See [Azure Storage Scalability and Performance Targets](storage-scalability-targets.md) for more information.

## Pricing and Billing

Blob storage accounts use a new pricing model for blob storage based on the storage tier. When using a Blob storage account, the following billing considerations apply:

- **Storage costs**: In addition to the amount of data stored, the cost of storing data varies depending on the storage tier. The per-gigabyte cost is lower for the cool storage tier than for the hot storage tier.
- **Data access costs**: For data in the cool storage tier, you will be charged a per-gigabyte data access charge for reads and writes.
- **Transaction costs**: There is a per-transaction charge for both tiers. However, the per-transaction cost for the cool storage tier is higher than that for the hot storage tier.
- **Geo-Replication data transfer costs**: This only applies to accounts with geo-replication configured, including GRS and RA-GRS. Geo-replication data transfer incurs a per-gigabyte charge.
- **Outbound data transfer costs**: Outbound data transfers (data that is transferred out of an Azure region) incur billing for bandwidth usage on a per-gigabyte basis, consistent with general-purpose storage accounts.
- **Changing the storage tier**: Changing the storage tier from cool to hot will incur a charge equal to reading all the data existing in the storage account for every transition. On the other hand, changing the storage tier from hot to cool will be free of cost.

> [AZURE.NOTE] In order to allow users to try out the new storage tiers and validate functionality post launch, the charge for changing the storage tier from cool to hot will be waived off until June 30th 2016. Starting July 1st 2016, the charge will be applied to all transitions from cool to hot. For more details on the pricing model for Blob storage accounts see, [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/) page. For more details on the outbound data transfer charges see, [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/) page.

## Quick Start

In this section we will demonstrate the following scenarios using the Azure portal:

- How to create a Blob storage account.
- How to manage a Blob storage account.

### Using the Azure portal

#### Create a Blob storage account using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the Hub menu, select **New** > **Data + Storage** > **Storage account**.

3. Enter a name for your storage account.

	This name must be globally unique; it is used as part of the URL used to access the objects in the storage account.  

4. Select **Resource Manager** as the deployment model.

	Tiered storage can only be used with Resource Manager storage accounts; this is the recommended deployment model for new resources. For more information, check out the [Azure Resource Manager overview](../resource-group-overview.md).  

5. In the Account Kind dropdown list, select **Blob Storage**.

	This is where you select the type of storage account. Tiered storage is not available in general-purpose storage; it is only available in the Blob storage type account. 	

	Note that when you select this, the performance tier is set to Standard. Tiered storage is not available with the Premium performance tier.

6. Select the replication option for the storage account: **LRS**, **GRS**, or **RA-GRS**. The default is **RA-GRS**.

	LRS = locally redundant storage; GRS = geo-redundant storage (2 regions); RA-GRS is read-access geo-redundant storage (2 regions with read access to the second).

	For more details on Azure Storage replication options, check out [Azure Storage replication](storage-redundancy.md).

7. Select the right storage tier for your needs: Set the **Access tier** to either **Cool** or **Hot**. The default is **Hot**.

8. Select the subscription in which you want to create the new storage account.

9. Specify a new resource group or select an existing resource group. For more information on resource groups, see [Azure Resource Manager overview](../resource-group-overview.md).

10. Select the region for your storage account.

11. Click **Create** to create the storage account.

#### Change the storage tier of a Blob storage account using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

2. To navigate to your storage account, select All Resources, then select your storage account.

3. In the Settings blade, click **Configuration** to view and/or change the account configuration.

4. Select the right storage tier for your needs: Set the **Access tier** to either **Cool** or **Hot**.

5. Click Save at the top of the blade.

> [AZURE.NOTE] Changing the storage tier may result in additional charges. Please see the [Pricing and Billing](storage-blob-storage-tiers.md#pricing-and-billing) section for more details.

## Evaluating and migrating to Blob storage accounts

The purpose of this section is to help users to make a smooth transition to using Blob storage accounts. There are two user scenarios:

- You have an existing general-purpose storage account and want to evaluate a change to a Blob storage account with the right storage tier.
- You have decided to use a Blob storage account or already have one and want to evaluate whether you should use the hot or cool storage tier.

In both cases, the first order of business is to estimate the cost of storing and accessing your data stored in a Blob storage account and compare that against your current costs.

### Evaluating Blob storage account tiers

In order to estimate the cost of storing and accessing data stored in a Blob storage account, you will need to evaluate your existing usage pattern or approximate your expected usage pattern. In general, you will want to know:

- Your storage consumption - How much data is being stored and how does this change on a monthly basis?
- Your storage access pattern - How much data is being read from and written to the account (including new data)? How many transactions are used for data access, and what kinds of transactions are they?

#### Monitoring existing storage accounts

To monitor your existing storage accounts and gather this data, you can make use of Azure Storage Analytics which performs logging and provides metrics data for a storage account.
Storage Analytics can store metrics that include aggregated transaction statistics and capacity data about requests to the Blob storage service for both general-purpose storage accounts as well as Blob storage accounts.
This data is stored in well-known tables in the same storage account.

For more details, please see [About Storage Analytics Metrics](https://msdn.microsoft.com/library/azure/hh343258.aspx) and [Storage Analytics Metrics Table Schema](https://msdn.microsoft.com/library/azure/hh343264.aspx)

> [AZURE.NOTE] Blob storage accounts expose the table service endpoint only for storing and accessing the metrics data for that account.

To monitor the storage consumption for the Blob storage service, you will need to enable the capacity metrics.
With this enabled, capacity data is recorded daily for a storage account’s Blob service, and recorded as a table entry that is written to the *$MetricsCapacityBlob* table within the same storage account.

To monitor the data access pattern for the Blob storage service, you will need to enable the hourly transaction metrics at an API level.
With this enabled, per API transactions are aggregated every hour, and recorded as a table entry that is written to the *$MetricsHourPrimaryTransactionsBlob* table within the same storage account. The *$MetricsHourSecondaryTransactionsBlob* table records the transactions to the secondary endpoint in case of RA-GRS storage accounts.

> [AZURE.NOTE] In case you have a general-purpose storage account in which you have stored page blobs and virtual machine disks alongside block and append blob data, this estimation process is not applicable. This is because you will have no way of distinguishing capacity and transaction metrics based on the type of blob for only block and append blobs which can be migrated to a Blob storage account.

To get a good approximation of you data consumption and access pattern, we recommend you choose a retention period for the metrics that is representative of your regular usage, and extrapolate.
One option is to retain the metrics data for 7 days and collect the data every week, for analysis at the end of the month.
Another option is to retain the metrics data for the last 30 days and collect and analyze the data at the end of the 30 day period.

For details on enabling, collecting and viewing metrics data, please see, [Enabling Azure Storage metrics and viewing metrics data](storage-enable-and-view-metrics.md).

> [AZURE.NOTE] Storing, accessing and downloading analytics data is also charged just like regular user data.

#### Utilizing usage metrics to estimate costs

##### Storage costs

The latest entry in the capacity metrics table *$MetricsCapacityBlob* with the row key *'data'* shows the storage capacity consumed by user data.
The latest entry in the capacity metrics table *$MetricsCapacityBlob* with the row key *'analytics'* shows the storage capacity consumed by the analytics logs.

This total capacity consumed by both user data and analytics logs (if enabled) can then be used to estimate the cost of storing data in the storage account.
The same method can also be used for estimating storage costs for block and append blobs in general-purpose storage accounts.

##### Transaction costs

The sum of *'TotalBillableRequests'*, across all entries for an API in the transaction metrics table indicates the total number of transactions for that particular API. *e.g.*, the total number of *'GetBlob'* transactions in a given period can be calculated by the sum of total billable requests for all entries with the row key *'user;GetBlob'*.

In order to estimate transaction costs for Blob storage accounts, you will need to break down the transactions into three groups since they are priced differently.

- Write transactions such as *'PutBlob'*, *'PutBlock'*, *'PutBlockList'*, *'AppendBlock'*, *'ListBlobs'*, *'ListContainers'*, *'CreateContainer'*, *'SnapshotBlob'*, and *'CopyBlob'*.
- Delete transactions such as *'DeleteBlob'* and *'DeleteContainer'*.
- All other transactions.

In order to estimate transaction costs for general-purpose storage accounts, you need to aggregate all transactions irrespective of the operation/API.

##### Data access and geo-replication data transfer costs

While storage analytics does not provide the amount of data read from and written to a storage account, it can be roughly estimated by looking at the transaction metrics table.
The sum of *'TotalIngress'* across all entries for an API in the transaction metrics table indicates the total amount of ingress data in bytes for that particular API.
Similarly the sum of *'TotalEgress'* indicates the total amount of egress data, in bytes.

In order to estimate the data access costs for Blob storage accounts, you will need to break down the transactions into two groups.

- The amount of data retrieved from the storage account can be estimated by looking at the sum of *'TotalEgress'* for primarily the *'GetBlob'* and *'CopyBlob'* operations.
- The amount of data written to the storage account can be estimated by looking at the sum of *'TotalIngress'* for primarily the *'PutBlob'*, *'PutBlock'*, *'CopyBlob'* and *'AppendBlock'* operations.

The cost of geo-replication data transfer for Blob storage accounts can also be calculated by using the estimate for the amount of data written in case of a GRS or RA-GRS storage account.

> [AZURE.NOTE] For a more detailed example about calculating the costs for using the hot or cool storage tier, please take a look at the FAQ titled *'What are Hot and Cool access tiers and how should I determine which one to use?'* in the [Azure Storage Pricing Page](https://azure.microsoft.com/pricing/details/storage/).

### Migrating existing data

A Blob storage account is specialized for storing only block and append blobs. Existing general-purpose storage accounts, which allow you to store tables, queues, files and disks, as well as blobs, cannot be converted to Blob storage accounts. To use the storage tiers, you will need to create new Blob storage accounts and migrate your existing data into the newly created accounts.
You can use the following methods to migrate existing data into Blob storage accounts from on-premise storage devices, from third-party cloud storage providers, or from your existing general-purpose storage accounts in Azure:

#### AzCopy

AzCopy is a Windows command-line utility designed for high-performance copying of data to and from Azure Storage. You can use AzCopy to copy data into your Blob storage account from your existing general-purpose storage accounts, or to upload data from your on-premises storage devices into your Blob storage account.

For more details, see [Transfer data with the AzCopy Command-Line Utility](storage-use-azcopy.md).

#### Data Movement Library

Azure Storage data movement library for .NET is based on the core data movement framework that powers AzCopy. The library is designed for high-performance, reliable and easy data transfer operations similar to AzCopy. This allows you to take full benefits of the features provided by AzCopy in your application natively without having to deal with running and monitoring external instances of AzCopy.

For more details, see [Azure Storage Data Movement Library for .Net](https://github.com/Azure/azure-storage-net-data-movement)

#### REST API or Client Library

You can create a custom application to migrate your data into a Blob storage account using one of the Azure client libraries or the Azure storage services REST API. Azure Storage provides rich client libraries for multiple languages and platforms like .NET, Java, C++, Node.JS, PHP, Ruby, and Python. The client libraries offer advanced capabilities such as retry logic, logging, and parallel uploads. You can also develop directly against the REST API, which can be called by any language that makes HTTP/HTTPS requests.

For more details, see [Get Started with Azure Blob storage](storage-dotnet-how-to-use-blobs.md).

> [AZURE.NOTE] Blobs encrypted using client-side encryption store encryption-related metadata stored with the blob. It is absolutely critical that any copy mechanism should ensure that the blob metadata, and especially the encryption-related metadata, is preserved. If you copy the blobs without this metadata, the blob content will not be retrievable again. For more details regarding encryption-related metadata, see [Azure Storage client side encryption](storage-client-side-encryption.md).

## FAQs

1. **Are existing storage accounts still available?**

    Yes, existing storage accounts are still available and are unchanged in pricing or functionality.  They do not have the ability to choose an storage tier and will not have tiering capabilities in the future.

2. **Why and when should I start using Blob storage accounts?**

    Blob storage accounts are specialized for storing blobs and allow us to introduce new blob-centric features. Going forward, Blob storage accounts are the recommended way for storing blobs, as future capabilities such as hierarchical storage and tiering will be introduced based on this account type. However, it is up to you when you would like to migrate based on your business requirements.

3. **Can I convert my existing storage account to a Blob storage account?**

    No. Blob storage account is a different kind of storage account and you will need to create it new and migrate your data as explained above.

4. **Can I store objects in both storage tiers in the same account?**

    The *'Access Tier'* attribute which indicates the storage tier is set at an account level and applies to all objects in that account. You cannot set the access tier attribute at an object level.

5. **Can I change the storage tier of my Blob storage account?**

    Yes. You will be able to change the storage tier by setting the *'Access Tier'* attribute on the storage account. Changing the storage tier will apply to all objects stored in the account. Change the storage tier from hot to cool will not incur any charges, while changing from cool to hot will incur a per GB cost for reading all the data in the account.

6. **How frequently can I change the storage tier of my Blob storage account?**

    While we do not enforce a limitation on how frequently the storage tier can be changed, please be aware that changing the storage tier from cool to hot will incur significant charges. We do not recommend changing the storage tier frequently.

7. **Will the blobs in the cool storage tier behave differently than the ones in the hot storage tier?**

    Blobs in the hot storage tier have the same latency as blobs in general-purpose storage accounts. Blobs in the cool storage tier have a similar latency (in milliseconds) as blobs in general-purpose storage accounts.

    Blobs in the cool storage tier will have a slightly lower availability service level (SLA) than the blobs stored in the hot storage tier. For more details, see [SLA for storage](https://azure.microsoft.com/support/legal/sla/storage).

8. **Can I store page blobs and virtual machine disks in Blob storage accounts?**

    Blob storage accounts support only block and append blobs, and not page blobs. Azure virtual machine disks are backed by page blobs and as a result Blob storage accounts cannot be used to store virtual machine disks. However it is possible to store backups of the virtual machine disks as block blobs in a Blob storage account.

9. **Will I need to change my existing applications to use Blob storage accounts?**

    Blob storage accounts are 100% API consistent with general-purpose storage accounts for block and append blobs. As long as your application is using block blobs or append blobs, and you are using the 2014-02-14 version of the [Storage Services REST API](https://msdn.microsoft.com/library/azure/dd894041.aspx) or greater then your application should just work. If you are using an older version of the protocol, then you will need to update your application to use the new version so as to work seamlessly with both types of storage accounts. In general, we always recommend using the latest version regardless of which storage account type you use.

10. **Will there be a change in user experience?**

    Blob storage accounts are very similar to a general-purpose storage accounts for storing block and append blobs, and support all the key features of Azure Storage, including high durability and availability, scalability, performance, and security. Other than the features and restrictions specific to Blob storage accounts and its storage tiers that have been called out above, everything else remains the same.

## Next steps

### Evaluate Blob storage accounts

[Check availability of Blob storage accounts by region](https://azure.microsoft.com/regions/#services)

[Evaluate usage of your current storage accounts by enabling Azure Storage metrics](storage-enable-and-view-metrics.md)

[Check Blob storage pricing by region](https://azure.microsoft.com/pricing/details/storage/)

[Check data transfers pricing](https://azure.microsoft.com/pricing/details/data-transfers/)

### Start using Blob storage accounts

[Get Started with Azure Blob storage](storage-dotnet-how-to-use-blobs.md)

[Moving data to and from Azure Storage](storage-moving-data.md)

[Transfer data with the AzCopy Command-Line Utility](storage-use-azcopy.md)

[Browse and explore your storage accounts](http://storageexplorer.com/)
