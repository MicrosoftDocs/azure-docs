---
title: Azure Storage tape migration guide
description: Azure Storage tape migration overview guide provides basic guidance for tape migrations
author: dukicn
ms.author: nikoduki
ms.topic: conceptual 
ms.date: 06/07/2024
ms.service: azure-storage
ms.subservice: storage-common-concepts
---

# Azure Storage tape migration guide

This article focuses on tape migrations. It aims to simplify, provide guidance, and considerations to run through a successful migration of data stored on various tape media to Azure storage services.

## Overview

Tape is one of the dominant storage media, and it stores a large part of world's data. Technology exists for decades, but hundreds of exabytes of new tapes are still being shipped every year.

Tapes are a great medium for storing cold data. They're fast in sequential reading, but stages requiring mechanical movements (like loading, and unloading of tapes, tape seeks, etc.) are slower. That makes tapes unusable for traditional, random based access, and is the main reason that even today data stored on tapes is rarely used. In addition, tapes are a magnetic medium that require special handling. They're sensitive to environment, particularly temperature, and humidity. If kept within their operating environmental range, they can achieve high durability, and good restore success rate. However, when kept in unfriendly environment, deterioration happens often, and renders the tape unreadable.

Customers store a lot of data on tapes. Large portion of that data is dark data (data that is collected, and stored, but not used for any other purpose). Dark data brings no value to the data owner. With the increase in AI capability, and accessibility, the trend is changing. Customers are looking closer into how dark data can help them to increase efficiency, open new revenue streams, or increase their competitive advantage. However, data on tapes can't be directly accessed. It must be moved to an online storage (disks) first. This movement requires a manual effort. To take advantage of dark data, many organizations are considering migrating the data from tapes to cloud storage. Cloud storage is also great in storing old data, among other benefits. But, unlike tapes, it also provides an easy way to analyze the data, extract business value, and consuming services like AI, Machine Learning, Azure Search, etc.

Some of the major reasons we're seeing increase in tape to cloud migrations are:

- Extracting business value from dark data,
- Reduce the effort required for managing data with long term retention,
- Avoid migration process from one tape generation to another,
- Reduce the risk for data loss, particularly for older generations of tapes,
- Replace off-site tape storage facility,
- Simplify disaster recovery processes,
- Applying modern tools like AI, and ML to historical data.

## Considerations

Before a tape migration process starts, options must be carefully considered. First consideration is deciding who executes the migration. This leads to two options:
- **Customer performed migration** where customer executes the migration end-to-end,
- **Tape migration partner** where customer ships the tapes to the partner, and partner executes the migration process.

|Approach | Pros | Cons |
| ------- | ---- | ---- |
| Customer performed migration | - Data never leaves site <br> - No logistics for shipping tapes | - Requires hardware resources <br> - Adds more work to existing personnel <br> - Requires specific knowledge in handling tapes <br> - Possible unknown costs|
| Tape migration partner | - Simple pricing, and known cost upfront (paid per tape) <br> - No impact on production <br> - No impact on personnel | - Requires logistics for shipping tapes <br> - Security considerations required due to shipping tapes <br> - Multiple copies needed for data availability during migration |

Several major considerations can easily guide our decision on who can execute the migration, customer, or partner.

### Resources

Resources are the most critical part of the tape migration process, and we divide them in following categories:

| Category | Notes |
| -------- | ------|
| People   | - Specific set of skills are required<br> - Process is labor intensive |
| Hardware | - Different tape generations require different type of hardware <br> - Speed of the migration is proportional to available drives |
| Software | - Access to software that created the data is needed <br> - Access to encryption keys is needed |

Hardware is usually the most challenging part. If we're migrating existing tape generations, hardware is available, but used as part of the existing production. When migrating older tape generations, hardware is often not available anymore, and it's harder to acquire. With older tape generation, using a tape migration partner is preferred option.
When hardware is available, careful planning is needed to make sure migration doesn't interfere with the existing production workloads. Here we can apply three different models:

| Model | Pros | Cons |
| ----- | ---- | ---- |
| Run production, and migration together | - Easy to schedule, and plan | - Possible impact to production <br> - Reduced hardware available for production |
| Run migration off-hours | - No impact to production | - Complex schedule, and execution <br> - Requires people working off-hours |
| Use dedicated hardware for migration | - Easy to schedule, and plan <br> - No impact to production | - Cost increase <br> - Hardware utilization post migration |

### Data transfer options

After the data is read from tapes, it needs to be moved to Azure Storage. Data can be moved using network, or offline devices like [Azure Data Box](https://azure.microsoft.com/products/databox/). Some of the parameters that are affecting the choice for data transfer options are:

- Available network bandwidth
- Required timeline to finish the migration
- Frequency of data changes

Learn more on guidance for selecting the optimal option [here](./storage-choose-data-transfer-solution.md). Network transfer is simpler and preferred option. Combination of network, and offline method is also possible, but requires more planning to make sure that migrated data doesn't overlap.

If there are no available resources to perform the migration, no matter what type of resource, our only option is to use a tape migration partner. In that case, we can choose between two options:

1. **Migration performed on customer's site** when tape migration partner ships the hardware, and hires people, and performs the work on customer's location. Customer needs to provide access to the tapes, dedicated space for the equipment, network connections, and access to Azure Storage service. Partner is responsible for all other activities.
1. **Migration performed on partner's site** when customer ships the tapes to the partner, and provides access to Azure Storage service. Tape migration partner performs all the work to migrate the data from tapes to Azure Storage.

Second option is easier, and more commonly used. Tape migration partners have facilities that are designed and equipped to perform tape migration on a large scale. This option also reduces the risk, and the timeline since partners have more hardware resources available. Performing migration on customer's site is used only when security, and privacy concerns don't allow the customer to ship the tapes to the partner.

Several partners can perform tape migrations to Azure. The full list of partners can be found on [offline media import](https://azure.microsoft.com/products/databox/offline-media-import/).

Here is a simple flowchart to ease the selection process.
![Chart showing tape migration selection process](./media/tape-migration-guide/tape-migration-chart.png)

### Other considerations

There are other considerations that we need to think about before starting the migration. They don+t impact our decision on how we perform the migration, but make a huge impact on the later stages, and on migration design. Format that will be used to store the data is the critical consideration for future usability. Data can be stored in a proprietary, or native format. Proprietary formats are stored as a virtual tape, a raw image from the original tape. Native format requires to restore the data from tapes, and store them as files, or objects.

| Model | Pros | Cons |
| ----- | ---- | ---- |
|Virtual tapes | - Easier, and faster migration <br> - Can recreate identical tape media as the original <br> - No need to have access to the original software to write the data | - Requires maintaining virtual tape inventory <br> - Data stored in application dependent format <br> - Requires original software to restore the data |
| Native files | - Files accessible by any application, and service (AI / ML) <br> - Possible to monetize the data <br> - No need to have access to original software for restores | - More complex migration <br> - Requires access to original software to write the data |

Main criteria for deciding the format is how do we plan to use the migrated data. If data is migrated only for long-term retention then virtual tapes are a great choice. It simplifies the migration. In any other case, storing data in native format is a preferred option. It allows simple usage of data in the future, and opens up many possibilities with data analysis.

## Migration process

Once we made decisions on file format, and migration execution, we can start with the migration. Migration goes through several phases.
![Picture showing tape migration phases](./media/tape-migration-guide/tape-migration-steps.png)

### Information phase

Information phase is critical for gathering key requirements. Gathered information guides correct design, and planning. Even though some information can be updated in later stages, providing precise information sets the scene, and avoids the need to make huge changes to the process. Some of the key questions that this phase needs to answer are:

- What type of tapes need to be migrated (for example, LTO3, LTO6, 3592JC, etc.)?
- What quantity of tapes for each model that need to be migrated (for example, 100xLTO3, 200xLTO6, etc.)?
- What software was used to write the data on tapes, is that software still available?
- What is the format used to write the data on tapes, is the format open, or proprietary, is compression applied?
- Was encryption used, and if yes, what is the most secure option to exchange encryption keys?
- What is the target region, and storage service?
- What is available network bandwidth for data migration?
- Where are tapes physically stored, and can they be shipped?
- Are any regulatory requirements critical (HIPAA, GDPR, etc.)? Is chain of custody mandatory?
- Are tapes needed after migration?
- What is the migration deadline? Are there any critical milestones?
- How to maintain temperature, and humidity for tapes during migration / transport?

### Preparation phase

After we gathered basic information, we can prepare for the migration. Every migration is different. Preparation phase can include many different steps, depending on the goals. But there are some common steps most migrations go through:

1. **Data analysis** provides information on the data that needs to be migrated. Some of the things we're looking to find are file sizes, amount of data stored per tape, number of files per tape, minimum, and maximum file sizes, file type, etc. This information is critical to estimate how fast data can be read from tapes, and how much parallelism we need to achieve to successfully finish the migration before the deadline. It impacts estimates on the required hardware (libraries, robots, drives). Data analysis is done by sampling multiple tapes that correctly represent the data set to be migrated.
1. **Data quality** helps in estimating final, and unique dataset that needs to be migrated. One of the most common issues with tape migration is duplication of data. Tape migration is ideal time when to clean all duplicated data. This improves data quality for future use, and it reduces cost, and the duration of the migration.
1. **Data prioritization** determines the order in which the data can be migrated. Ideally, we want to achieve direct streaming from each tape instead of randomly reading files from different tapes (to avoid constant loading, and unloading). This approach allows the highest possible throughput, and is always the fastest migration path. Data prioritization takes business requirements and technical feasibility to achieve the best possible migration option.
1. **Migration design** includes all the technical aspects of the migration, and the gathered information to form a final migration process. It's a written document that becomes source of truth for the remaining stages. It must contain at least:

    - clear migration process, and migration deadline,
    - hardware, and personnel requirements,
    - infrastructure, and network design,
    - security considerations,
    - how to deal with unreadable tapes,
    - roles, and responsibilities, etc.

### Migration phase

Once the migration design is final, we start the migration process. Before ramping up to full migration pace, we always perform a test with a smaller sample. Goal for the test is to make sure that end-to-end process works. It allows us to make tweaks, and improve the process. Once the test is successful, we ramp up fully till the migration is done.
For each file we migrate, we need to perform data validation to make sure that data wasn't corrupted during the migration process. In ideal situation, source data already contains hash values that can be easily compared to hash values post-migration. If they match, file is marked as migrated. If not, file is discarded, and migrated again. Sometimes. The original data is corrupted on the source tapes, and that is the reason why having the original hash values helps with catching those cases. In cases like that, we can read the data from secondary copy if it exists. Data validation process is a critical component for migration design and process for handling failed validation must be defined. Migration phase is also constantly monitored to make sure we can react to unpredictable situation, and adapt to it.

### Post-migration phase

After migration is done, there are still couple of steps we need to consider, before successfully closing the migration project. First, we need to dispose hardware used for the migration, if it's not needed anymore. The most important question is how to dispose of the tapes. Tape disposal is a two steps process. If tapes are storing sensitive, and confidential information (and they typically do), they must be degaussed first. Degaussing ensures that all data is magnetically deleted from the media. After deletion, tapes need to be properly destroyed, and recycled. If we used a tape migration partner, we can also let the partner securely dispose of the tapes. After the disposal, a final report can be generated. Report contains all the details of our migration. One area we're mostly interested in are all the unrecoverable errors. This shows all the data that couldn't be migrated, and are caused by deteriorated tapes. We can estimate if this data is critical. If yes, special companies exist that can try to recover the data.

## Next steps
