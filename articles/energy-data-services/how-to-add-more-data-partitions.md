---
title: How to manage partitions
description: This is a how-to article on managing data partitions using the Microsoft Energy Data Services Preview instance UI.
author: nitinnms
ms.author: nitindwivedi
ms.service: energy-data-services
ms.topic: how-to 
ms.date: 07/05/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# How to manage data partitions?

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

The article describes how you can add data partitions to an existing Microsoft Energy Data Services (MEDS) instance. The concept of "data partitions" in MEDS is picked from Open Subsurface Data Universe (OSDU) where single deployment can contain multiple partitions. 

Each partition provides the highest level of data isolation within a single deployment. All access rights are governed at a partition level. Data is separated in a way that allows for the partitions life cycle and deployment to be handled independently. (See [Partition Service](https://community.opengroup.org/osdu/platform/home/-/issues/31) in OSDU)

You can create maximum five data partitions in one MEDS instance. In line with the capabilities around data partitions that are available in OSDU, for now, you can create data partitions but can't delete or rename data existing data partitions. 


## Create a data partition

1. **Open the "Data Partitions" menu-item from left-panel of MEDS Overview Page.**

    [![Screenshot for DDP feature discovery from Microsoft energy data services overview page. The 'data partitions' option under 'advanced' section in menu-items is highlighted.](media/how-to-add-more-data-partitions/dynamic-data-partitions-discovery-meds-overview-page.png)](media/how-to-add-more-data-partitions/dynamic-data-partitions-discovery-meds-overview-page.png#lightbox)

2. **Select "Create"**

    The page shows a table of all data partitions in your MEDS instance with the Status of the data partition next to it. Clicking "Create" option on the top opens a right-pane for next steps.

    [![Screenshot to help you locate the create button on the data partitions page. The 'create' button to add a new data partition is highlighted.](media/how-to-add-more-data-partitions/start-create-data-partition.png)](media/how-to-add-more-data-partitions/start-create-data-partition.png#lightbox)

3. **Choose a name for your data partition**

    Each data partition name needs to be - "1-10 characters long and be a combination of lowercase letters, numbers and hyphens only" The data partition name will be prepended with the name of the MEDS Instance. Choose a name for your data partition and hit create. Soon as you hit create, the deployment of the underlying data partition resources such as Cosmos DB and Storage Accounts is started. 

    >[!NOTE]
    >It generally takes 15-20 minutes to create a data partition.

    [![Screenshot for create a data partition with name validation. The page also shows the name validation while choosing the name of a new data partition.](media/how-to-add-more-data-partitions/create-data-partition-name-validation.png)](media/how-to-add-more-data-partitions/create-data-partition-name-validation.png#lightbox)

    If the deployment is successful, the Status changes to "created successfully" with or without clicking "Refresh" on top. 

    [![Screenshot for the in progress page for data partitions. The in-progress status of a new data partition that is getting deployed is highlighted.](media/how-to-add-more-data-partitions/create-progress.png)](media/how-to-add-more-data-partitions/create-progress.png#lightbox)

## Delete a failed data partition

The data-partition deployment triggered in the previous process might fail in some cases due to issues - quota limits reached, ARM template deployment transient issues, data seeding failures, and failure in connecting to underlying AKS clusters. 

The Status of such data partitions shows as "Creation Failed". You can delete these deployments using the "delete" button that shows next to all failed data partition deployments. This deletion will clean up any records created in the backend. You can retry creating the data partitions later. 


[![Screenshot for the deleting failed instances page. The button to delete an incorrectly created data partition is available next to the name of the failed data partition.](media/how-to-add-more-data-partitions/delete-failed-instances.png)](media/how-to-add-more-data-partitions/delete-failed-instances.png#lightbox)

## Next steps
<!-- Add a context sentence for the following links -->
- [How to load TNO dataset](/how-to/how-to-load-TNO-dataset.md)

