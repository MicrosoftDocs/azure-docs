---
author: Bapi Chakraborty
ms.date: 07/24/2025
---

<!--
Initial score: 68 (770/28)
-->

# Commvault and Azure Data Box Integration scenarios

**Commvault's®** support for Microsoft Azure Data Box enables enterprise customers to accelerate data movement to and from Azure with optimal security, speed, and control. Whether migrating data to Azure for backup or recovering from it during a disaster scenario, Commvault's tight integration with Azure Data Box delivers unmatched flexibility in bandwidth-constrained or high-volume environments. This article contains information about Commvault Air Gap Protect, a fully managed service. This article is also relevant for use cases in which you bring your own subscription and storage account, though some changes might apply.

## Common scenarios

There are three common scenarios that Commvault and Azure Data Box help you achieve.

### Scenario 1: Migrate to Azure with offline seeding using Commvault Air Gap Protect and Azure Data Box

![A diagram workflow of Migration to Azure storage with Commvault and Azure Data Box.](media/data-box-migrate-with-isv/migrate-commvault-databox-case1.png)

#### Scenario Details

When bandwidth limitations make initial cloud seeding impractical, Commvault enables customers to use Azure Data Box to securely transport large volumes of backup data to Azure. This is especially valuable during the onboarding phase of Commvault's Backup-as-a-Service offering for Azure workloads (Commvault AGP). Instead of waiting weeks or months to transmit initial backups over WAN, customers can leverage the offline physical transfer capability of Azure Data Box to rapidly complete their copy seeding process.

#### Soluiton flow overview

1. Login to Azure portal and order an appropriate size of Azure Data Box

2. Once the device arrives, setup and configure the Azure Data box

3. Initial backups are created using Commvault on-prem infrastructure.

4. Selected backup data is offloaded to an Azure Data Box device via Commvault's built-in integration. This primarily involves configuring Azure Storage as a Cloud library and redirect all writes to the Data Box. Once configured, you can either run a full backup or an auxiliary copy operation. [More details are here](https://documentation.commvault.com/2024e/essential/seeding_air_gap_protect.html) for offline seeding using Commvault Air Gap Protect.  
  
    You can find more details [here](https://documentation.commvault.com/11.20/migrating_data_to_microsoft_azure_using_azure_data_box.html) about the process if you want to use your own subscription and storage account.

5. The Data Box is shipped to Microsoft, where the data is uploaded directly into the target AGP storage account.

6. Commvault indexes the seeded data and continues incremental protection over the network.

**Benefits:**

- **Time:** Drastically reduces onboarding time for cloud backups.
- **Performance:** Bypasses internet bottlenecks with high-throughput offline transfer.
- **Cost:** Eliminates costly network upgrades or overage fees.
- **Security:** End-to-end encryption from Commvault to Azure via the Data Box.
- **Reliability:** Automated validation and indexing ensure data consistency and continuity.

### Use Case 2: Cyber recovery acceleration - restoring data back to on-Premises

![A diagram workflow of cyber resilience with Commvault and Azure Data Box.](media/data-box-migrate-with-isv/cyber-commvault-databox.png)

#### Scenario Details

In the event of a ransomware attack or total site failure, speed is critical. Commvault enables cyber recovery by using Azure Data Box to reverse the flow—bringing data stored in AGP back to an on-premises recovery environment. This bypasses the delays and risks of streaming massive datasets over compromised or insufficient WAN links.

#### Workflow overview

1. Identify clean recovery points stored in Commvault AGP in Azure.

2. [Create an export order](/azure/databox/data-box-deploy-export-ordered) to export the data to from the Commvault AGP storge account to Azure Data Box and securely shipped to the customer site.

3. Commvault restores from the Data Box directly into the local infrastructure.

You can read [more details are here](https://documentation.commvault.com/2024e/essential/seeding_air_gap_protect.html) for using Commvault Air Gap Protect and Data box together.

**Benefits:**

- **Time:** Faster recovery from cloud with no dependency on bandwidth.
- **Performance:** Physical transfer outpaces most WAN download capabilities.
- **Cost:** No need to keep high-performance links idle "just in case."
- **Security:** Data at rest and in transit is fully encrypted.
- **Reliability:** Ideal for Cyber Resiliency planning in disconnected or regulated environments.

### Use Case 3: Cloud Copy Exit - Retaining Backup Data On-Premises

![A diagram of backup movement for cloud exit](media/data-box-migrate-with-isv/data-retention-Commvault-databox.png)

#### Scenario Details

Some organizations may choose to exit cloud storage for various strategic reasons. Commvault supports this by enabling export of long-term backup copies from AGP to on-premises infrastructure using Azure Data Box. Instead of incurring high egress costs or waiting months for network transfers, customers can repatriate their backup datasets efficiently and securely.

#### Solution flow overview

1. Customer identifies Storage Pools in Commvault AGP that need to be retained locally.

2. [Create an export order](/azure/databox/data-box-deploy-export-ordered)  and an Azure Data Box is provisioned. Data is copied from Azure to the device.

3. Once received, Commvault ingests the data back into its on-prem backup infrastructure for continued retention or operational use.

You can read [more details are here](https://documentation.commvault.com/2024e/essential/seeding_air_gap_protect.html) for using Commvault Air Gap Protect and Data box together.

**Benefits:**

- **Time:** Expedites cloud exit timelines.
- **Performance:** Moves TBs of data in days, not weeks.
- **Cost:** Avoids prolonged egress charges and operational downtime.
- **Security:** Maintains compliance with secure physical and digital transfer.
- **Reliability:** Ensures data integrity and usability post-transfer.
**Note:** For complete step by step guide refer to Commvault documentation or contact your Commvault representative.
