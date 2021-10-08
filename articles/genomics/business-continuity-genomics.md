---
title: Overview of business continuity
titleSuffix: Microsoft Genomics
description: This overview describes the capabilities that Microsoft Genomics provides for business continuity and disaster recovery. 
keywords: business continuity, disaster recovery

services: genomics
author: vigunase
manager: cgronlun
ms.author: vigunase
ms.service: genomics
ms.topic: conceptual
ms.date: 04/06/2018

---
# Overview of business continuity with Microsoft Genomics
This overview describes the capabilities that Microsoft Genomics provides for business continuity and disaster recovery. Learn about options for recovering from disruptive events, such as an Azure region outage, that could cause data loss. 


## Microsoft Genomics features that support business continuity 
Although rare, an Azure data center can have an outage, which could cause a business disruption that might last a few minutes to a few hours. When an outage occurs, all jobs currently running in the data center will fail, and the Microsoft Genomics service will not automatically resubmit jobs to a secondary region. 

* One option is to wait for the data center to come back online when the data center outage is over. If the outage is short, the Microsoft Genomics service will automatically detect the failed jobs and the workflow will be automatically restarted.

* Another option is to proactively submit the workflow in another data region. Microsoft Genomics deploys instances in several [Azure regions](https://azure.microsoft.com/regions/services/), and each region-specific instance is independent. If one of the Microsoft Genomics instances does experience a region local failure, other regions running instances of Microsoft Genomics will continue to process jobs. This transfer to an alternative region is under the control of the user and available at any time.


### Manually failover Microsoft Genomics workflows to another region
If a regional data center outage occurs, you may choose to submit Microsoft Genomics workflows in a secondary region, based on your individual data sovereignty and business continuity requirements. To manually failover Microsoft Genomics workflows, you would use a different region-specific. Genomics account and submit the job with appropriate region-specific Genomics and storage account credentials.

Specifically, you will need to:
* Create a Genomics account in the secondary region, using the Azure portal. 
* Migrate your input data to a storage account in the secondary region, and set up an output folder in the secondary region.
* Submit the workflow in the secondary region.

When the original region is restored, the Microsoft Genomics service does not migrate the data from the secondary region back to the original region. You may elect to move the input and output files from the secondary region back to original region.  If you elect to move their data, this is outside the Genomics service and all charges related to the data movement would be your responsibility. 

### Preparing for a possible region-specific outage
If you are concerned about faster recovery in the case of a data center outage, there are a few steps you can take to reduce the time it takes for you to manually resubmit your Microsoft Genomics workflows to a secondary region:

* Identify an appropriate secondary region and pro-actively create a Genomics account in that region
* Duplicate your data in the primary and secondary region so that your data is immediately available in the secondary region. This could be done manually or using the [geo-redundant storage](../storage/common/storage-redundancy.md) feature available in Azure storage. 

## Next steps
In this article, you learned about your options for business continuity and disaster recovery when using the Microsoft Genomics service. For more information about business continuity and disaster recovery within Azure in general, see [Azure resiliency technical guidance.](/azure/architecture/resiliency/recovery-loss-azure-region)