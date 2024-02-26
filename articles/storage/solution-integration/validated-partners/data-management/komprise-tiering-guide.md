---
title: Optimize file storage with Komprise Intelligent Tiering for Azure 
titleSuffix: Azure Storage
description: Getting started guide to implement Komprise Tiering. This guide shows how to your data to Azure Blob storage using Komprise's Intelligent Tiering 
author: timkresler
ms.author: timkresler
ms.date: 10/30/2023
ms.service: azure-storage
ms.topic: quickstart
---

# Optimize File Storage with Komprise Intelligent Tiering for Azure 

Businesses and public sector enterprises often retain file data for decades as it contains business value such as customer insights, genomic patterns, machine learning training data, and compliance information. Because of its large volume, variety and velocity of its growth, file data can become expensive to store, backup and manage. Most IT organizations spend 30% to 50% of their budgets on file data storage and backups, as shown in the [2023 Komprise State of Unstructured Data Management Report](https://www.komprise.com/resource/the-2023-komprise-unstructured-data-management-report/).  

When looking at the storage cost of file data, consider that the cost of file data is at least 3X higher than the cost of the file storage itself. File data can't just be stored, it needs to also be protected with backups and replicated for disaster recovery. 


| Item                                             | Cost  |
|--------------------------------------------------|-------|
| File Storage                                     | 1x    |
| Snapshots                                        | 0.3x  |
| Mirror for DR (second site copy of FS + Snapshots)  | 1.3x  |
| 2 to 3 backups (cheaper storage + backup software)     | 1x+   |
| TOTAL                                            | 3.6x+ |

## Use the Cloud to Cut File Data Costs: Comparison of Alternatives 

As file data growth accelerates, managing data growth while cutting the costs of file data storage and backup has become an enterprise IT priority. Most (typically up to 80%) of file data is cold, meaning infrequently accessed. Therefore, organizations can save significantly by tiering on-premises file data to cost-effective object storage tiers such as Azure Blob, which can be 1/10th to 1/100th the cost of file storage. Here's a breakdown of Azure Blob Archive costs compared to higher performance on-premises and cloud file storage options. 

| Item                | Cost/GB/month  | Relative Cost to Azure Blob Archive  |
|---------------------|----------------|--------------------------------------|
| On-premises Flash/SSD   | $0.12          | 123x                                 |
| On-premises Disk        | $.066          | 66x                                  |
| Azure Blob Cool     | $0.015         | 15x                                  |
| Azure Blob Archive  | $0.00099       | 1x                                   |

Read the Azure Storage blog posts:
- [The True Cost of Traditional File Storage](https://techcommunity.microsoft.com/t5/azure-storage-blog/the-true-cost-of-traditional-file-storage/ba-p/3797945)
- [Leverage the Cloud to Cut File Data Costs: Comparison of Alternatives](https://techcommunity.microsoft.com/t5/azure-storage-blog/leverage-the-cloud-to-cut-file-data-costs-comparison-of/ba-p/3799614)

#### Komprise Intelligent Tiering for Azure 

Komprise Intelligent Tiering for Azure analyzes data across your file and object storage systems, identifying inactive/cold data. Qualifying files, based on your policies, are moved to Azure Blob. Komprise Transparent Move Technology (TMT™) offloads entire files from the data storage, snapshot, backup and DR footprints without any change to your processes or user behavior. This approach to file tiering maximizes your data storage and backup savings, reduces cloud egress costs by preventing unnecessary rehydration when data is accessed from the cloud, and lets you set different policies for different data types and groups. Users can access the tiered data exactly as before as files from the original location, and they can directly access the objects in Azure Blob without any lock-in. You can also use all the native Azure data services. 

:::image type="content" source="./media/komprise-tiering-guide/tiering-interface-screenshot.png" alt-text="Screenshot of the tiering interface." lightbox="./media/komprise-tiering-guide/tiering-interface-screenshot.png":::

Komprise analyzes all your file and object data. You can set policies to transparently tier cold files to Azure and instantly visualize savings based on your costs and policies 

:::image type="content" source="./media/komprise-tiering-guide/updated-icon.png" alt-text="Screenshot of an updated icon after tiering." lightbox="./media/komprise-tiering-guide/updated-icon.png":::

Files moved by Komprise TMT appear just as they did before, without users noticing any difference, and open like normal files on the desktop. 
No stubs. No agents. The figure shows a PDF file before and after it's tiered by Komprise.

Read the Azure blog post: [How to Save 70% on File Data Costs](https://techcommunity.microsoft.com/t5/azure-storage-blog/how-to-save-70-on-file-data-costs/ba-p/3799616)

## Getting Started with Komprise Intelligent Tiering for Azure

Your local Komprise team will assist with setting up your Komprise Director console and on-premises grid. It's an easy process that includes a preinstallation review, a deployment phase and initial training. Preparation for the installation should be ~1 hour from power-up to seeing the first analysis results. 

[Komprise Intelligent Tiering for Azure on the Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.komprise_tiering_transactable_license?tab=Overview)

#### Komprise Grid

Komprise software is easy to set up and it runs in virtual environments for complete resource flexibility. The Komprise Grid is configurable for optimum performance, flexibility and cost to meet the needs of each customer’s unique environment. Komprise data managers (Observers) and data movers (Windows Proxies) can be deployed on-premises or in the cloud to fit your requirements.

- __Director:__ The administration console for the Komprise Grid. It's used to configure the environment, set policies, monitor activities, and view reports and graphs.
- __Observers:__ The heart of the system. Observers communicate with the Director, analyze storage systems, summarize reports, execute tiering Plans identifying what data to tier, move data to Azure Blob, then provide continuous transparent end user access to the tiered files.
- __Windows Proxies:__ Scalable data movers that simplify and accelerate SMB/CIFS data flow. It’s easy to add Windows Proxy data movers to meet the changing performance requirements of growing environments or tight timelines.

:::image type="content" source="./media/komprise-tiering-guide/architecture-diagram.png" alt-text="Architecture diagram of Komprise tiering solution." lightbox="./media/komprise-tiering-guide/architecture-diagram.png":::

#### Share Discovery and Analysis 

Adding shares for Komprise Analysis and Tiering
1. Start on the Data Stores page.
1. Use “Add data store” to identify the storage system and shares for analysis.

:::image type="content" source="./media/komprise-tiering-guide/add-data-store-new.png" alt-text="Screenshot of the add data store interface." lightbox="./media/komprise-tiering-guide/add-data-store-new.png":::

3. When adding a NAS share, select “Standard” for the “Storage use” and choose the appropriate platform or provider of the storage system to add. Komprise supports standard NAS protocols. Use the “Other NAS” option for storage systems not named in the list.

:::image type="content" source="./media/komprise-tiering-guide/screenshot-add-nas.png" alt-text="Screenshot of the add NAS interface." lightbox="./media/komprise-tiering-guide/screenshot-add-nas.png":::

4. Provide the necessary system information to enable Komprise to access the storage system. This is typically a Hostname or IP address. Larger NAS systems sometimes require an admin port and sign in. See [Komprise Admin Guide: Introduction](https://komprise.freshdesk.com/support/solutions/articles/17000048966-komprise-admin-guide-introduction) for more information. 

1. Enable shares for Analysis and Tiering. 

:::image type="content" source="./media/komprise-tiering-guide/enable-shares.png" alt-text="Screenshot of the enable shares interface." lightbox="./media/komprise-tiering-guide/enable-shares.png":::

6. Then, choose “Skip adding to Plan and close” to complete the Add Data Store wizard.

#### Add Azure Blob Target

Add a target to send the tiered data.

1. On the Data Stores page, select “Add data store" to add the tiering Plan Target. Select “Plan Target” for the “Storage use” and choose Azure Blob Storage as the Provider.

:::image type="content" source="./media/komprise-tiering-guide/add-data-store-new.png" alt-text="Screenshot of the add data store tiering interface." lightbox="./media/komprise-tiering-guide/add-data-store-new.png":::

2. Enter the appropriate information required to enable Komprise to connect to the Azure Blob container.

:::image type="content" source="./media/komprise-tiering-guide/add-data-store-2.png" alt-text="Screenshot of the detailed add data store interface." lightbox="./media/komprise-tiering-guide/add-data-store-2.png":::

#### Create a New Plan for Tiering

Komprise Plans define the policies for tiering, including identifying the shares to tier from and the desired file inactivity age. At periodic transfer intervals (the default is seven days), Komprise scans the specified shares and tiers any file that meets the Plan policy (inactivity age) to the specified Azure Blob container.

1. Create a new Plan using “All actions” at the upper right side of the screen.

:::image type="content" source="./media/komprise-tiering-guide/create-new-plan-2.png" alt-text="Screenshot of the create new tiering plan interface." lightbox="./media/komprise-tiering-guide/create-new-plan-2.png":::

2. In the Plan Editor, assign a new Group name for the first group of shares. After providing the Group name, type Enter to open the Group for editing.

1. Enable Move Operations for Tiering

:::image type="content" source="./media/komprise-tiering-guide/enable-move.png" alt-text="Screenshot of the enable move interface." lightbox="./media/komprise-tiering-guide/enable-move.png":::

4. Select “Add Shares” to specify the on-premises shares for tiering.

:::image type="content" source="./media/komprise-tiering-guide/add-shares.png" alt-text="Screenshot of the add shares interface." lightbox="./media/komprise-tiering-guide/add-shares.png":::

5. Select “Files filtered by Age” to specify the age policy for tiering inactive files. The heatmap (donut chart) on right adds a purple hashed area showing the amount and number of files that Komprise estimates will move according to the Plan policy.  Mouse over the purple hash area to see the values.

:::image type="content" source="./media/komprise-tiering-guide/filter-by-age.png" alt-text="Screenshot of the filter by age interface." lightbox="./media/komprise-tiering-guide/filter-by-age.png":::

6. You can customize the analysis to ensure accurate cost savings estimates by clicking “Edit Cost Model” at the lower right when viewing your Plan. Enter On-premises storage cost information on the left and Target storage costs information (for Azure Blob) on the right.

:::image type="content" source="./media/komprise-tiering-guide/edit-cost-model.png" alt-text="Screenshot of the edit cost model interface." lightbox="./media/komprise-tiering-guide/edit-cost-model.png":::

7. These financial values are applied to the data identified for tiering and represented in the 3-Year Savings numbers and graphs below the heatmap. The following images highlight the growth rates and costs after one year. The yellow line shows estimated costs if no data is tiered whereas the blue line represents reduced costs including tiering by Komprise.

:::image type="content" source="./media/komprise-tiering-guide/data-growth.png" alt-text="Screenshot of the show data growth interface." lightbox="./media/komprise-tiering-guide/data-growth.png":::

8. Back in the Plan Editor, add the tiering Target for the tiered, aged files. For the “To Target” field, choose the Azure Blob Target added earlier.

:::image type="content" source="./media/komprise-tiering-guide/set-tiering-to.png" alt-text="Screenshot of the configure tiering destination interface." lightbox="./media/komprise-tiering-guide/set-tiering-to.png":::

9. Select “Done Editing” to complete the Plan configuration. 

1. Next select “Activate or Test” to begin tiering operations. If you test your Plan first (recommended), Komprise generates a list of files that it would have moved from your selected NAS shares to Azure Blob, without actually moving them. If you choose to activate the Plan, Komprise begins moving files that meet the criteria defined in the Plan to Azure Blob.

:::image type="content" source="./media/komprise-tiering-guide/test.png" alt-text="Screenshot of the test tiering configuration interface." lightbox="./media/komprise-tiering-guide/test.png":::

11. Once activated, the new Plan Activity tab opens showing the tiering operation results.

:::image type="content" source="./media/komprise-tiering-guide/show-activity.png" alt-text="Screenshot of the show activity display." lightbox="./media/komprise-tiering-guide/show-activity.png":::

During any copy or move operations, Komprise performs full MD5 checksums for NFS and SHA-1 for SMB on your files to ensure full data integrity during the data transfers. A single Plan can span multiple NAS servers, even from different vendors. You can create different policy groups in Komprise for different departments, for example. This feature is useful when a central IT department is managing data for different business units. 

## How Komprise Delivers Transparent, Native Data Access

Komprise tiers files from a source NAS share to Azure Blob and leaves behind a symbolic link to the file in its original source location. When a user or application attempts to read or write a file that you have tiered, they access the file using the symbolic link. The link points to a Komprise Grid Observer, which tracks where the file is stored. The Observer retrieves the file behind-the-scenes from Azure and fulfills the read/write request for the file within seconds. This way, users and applications continue accessing these files in the same location without refactoring applications to use object storage or specifying a different file share location. 

By default, Komprise moves files in their native format with their contents unchanged. As files are moved to Azure, you can now access these files as objects natively within Azure. This opens many new and exciting scenarios for customers. For example, customers can use this data as the foundation for a data lake, with the potential to query and explore data using services such as [Azure Synapse Analytics](https://azure.microsoft.com/products/synapse-analytics/) or [Azure Machine Learning](https://azure.microsoft.com/products/machine-learning/). The possibilities are endless – and many customers are unlocking the value of their cold data in ways that they might have never considered before. 

#### Other Komprise Licensing Options 

Komprise Intelligent Tiering for Azure includes Komprise Elastic Data Migration, which is available for Azure customers at no cost with the Azure Migration Program. It doesn't include Komprise Deep Analytics, which is a powerful search-like interface that unlocks the data management and data workflow capabilities of the Komprise Global File Index and Intelligent Data Management Platform. [Contact Komprise](https://www.komprise.com/contact/) to learn more about these features and upgrades. 

#### Why Komprise Intelligent Tiering for Azure? 

In addition to overall cost savings, some of the benefits of hybrid cloud tiering using Komprise Intelligent Tiering for Azure include: 

- __Leverage Existing Storage Investment:__ You can continue to use your existing NAS storage and Komprise transparently tiers cold files to Azure. Users and applications continue to see and access the files as if they are still on-premises. 
- __Leverage Azure Data Services:__ Komprise maintains file-object duality with patented Transparent Move Technology (TMT).  This allows tiered files to be viewed in Azure as objects and can use all Azure data services natively, leveraging the full power of the cloud. 
- __Works Across Heterogeneous Vendor Storage:__ Komprise works across all file and object storage to analyze and transparently tier data to Azure file and object tiers. 
- __Ongoing Lifecycle Management in Azure:__ Komprise continues to manage data lifecycles in Azure. As data gets colder it can move from Azure Blob Cool to Azure Blob Archive based on policies you set. 

To learn more and get a customized assessment of your savings, visit [Komprise on the Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.komprise_tiering_transactable_license?tab=Overview)


