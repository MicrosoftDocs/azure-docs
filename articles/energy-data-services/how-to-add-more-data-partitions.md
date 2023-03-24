---
title: How to manage partitions
description: This is a how-to article on managing data partitions using the Microsoft Azure Data Manager for Energy Preview instance UI.
author: nitinnms
ms.author: nitindwivedi
ms.service: energy-data-services
ms.topic: how-to 
ms.date: 07/05/2022
ms.custom: template-how-to, ignite-2022
---

# How to manage data partitions?

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

In this article, you'll learn how to add data partitions to an existing Azure Data Manager for Energy Preview instance. The concept of "data partitions" is picked from [OSDU&trade;](https://osduforum.org/) where single deployment can contain multiple partitions. 

Each partition provides the highest level of data isolation within a single deployment. All access rights are governed at a partition level. Data is separated in a way that allows for the partition's life cycle and deployment to be handled independently. (See [Partition Service](https://community.opengroup.org/osdu/platform/home/-/issues/31) in OSDU&trade;)


You can create maximum five data partitions in one Azure Data Manager for Energy instance. Currently, in line with the data partition capabilities that are available in OSDU&trade;, you can only create data partitions but can't delete or rename data existing data partitions. 


## Create a data partition

1. Open the "Data Partitions" menu-item from left-panel of Azure Data Manager for Energy overview page.

    [![Screenshot for dynamic data partitions feature discovery from Azure Data Manager for Energy overview page. Find it under the 'advanced' section in menu-items.](media/how-to-add-more-data-partitions/dynamic-data-partitions-discovery-meds-overview-page.png)](media/how-to-add-more-data-partitions/dynamic-data-partitions-discovery-meds-overview-page.png#lightbox)

2. Select "Create".

    The page shows a table of all data partitions in your Azure Data Manager for Energy instance with the status of the data partition next to it. Clicking the "Create" option on the top opens a right-pane for next steps.

    [![Screenshot to help you locate the create button on the data partitions page. The 'create' button to add a new data partition is highlighted.](media/how-to-add-more-data-partitions/start-create-data-partition.png)](media/how-to-add-more-data-partitions/start-create-data-partition.png#lightbox)

3. Choose a name for your data partition.

    Each data partition name needs to be 1-10 characters long and be a combination of lowercase letters, numbers and hyphens only. The data partition name will be prepended with the name of the Azure Data Manager for Energy instance. Choose a name for your data partition and hit create. As soon as you hit create, the deployment of the underlying data partition resources such as Azure Cosmos DB and Azure Storage accounts is started.

    >[!NOTE]
    >It generally takes 15-20 minutes to create a data partition.

    [![Screenshot for create a data partition with name validation. The page also shows the name validation while choosing the name of a new data partition.](media/how-to-add-more-data-partitions/create-data-partition-name-validation.png)](media/how-to-add-more-data-partitions/create-data-partition-name-validation.png#lightbox)

    If the deployment is successful, the status changes to "created successfully" with or without clicking "Refresh" on top. 

    [![Screenshot for the in progress page for data partitions. The in-progress status of a new data partition that is getting deployed is highlighted.](media/how-to-add-more-data-partitions/create-progress.png)](media/how-to-add-more-data-partitions/create-progress.png#lightbox)

## Delete a failed data partition

The data-partition deployment triggered in the previous process might fail in some cases due to various issues. These issues include quota limits reached, ARM template deployment transient issues, data seeding failures, and failure in connecting to underlying AKS clusters. 

The status of such data partitions shows as "Creation Failed". You can delete these deployments using the "delete" button that shows next to all failed data partition deployments. This deletion will clean up any records created in the backend. You can retry creating the data partitions later. 


[![Screenshot for the deleting failed instances page. The button to delete an incorrectly created data partition is available next to the partition's name.](media/how-to-add-more-data-partitions/delete-failed-instances.png)](media/how-to-add-more-data-partitions/delete-failed-instances.png#lightbox)

OSDU&trade; is a trademark of The Open Group.

## Next steps

You can start loading data in your new data partitions.

> [!div class="nextstepaction"]
> [Load data using manifest ingestion](tutorial-manifest-ingestion.md)
