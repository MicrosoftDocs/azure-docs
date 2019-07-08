---
title: Add datasets to an existing data share
description: Add datasets to an existing data share
author: madams0013

ms.service: data-share
ms.topic: conceptual
ms.date: 07/10/2019
ms.author: t-maadam
---

# How to add datasets to an existing share in Azure Data Share Preview

This article explains how to add datasets to a pre-existing data share using Azure Data Share Preview. This allows you to share more data with the same recipients without having to create a new share.

For information on how to add datasets as you create a share, see the [Share data](share-your-data.md) tutorial.

## Navigate to a sent data share

In the Azure Data Share service, navigate to your sent share and select the **Datasets** tab. Click **+ Add Datasets** button to add more datasets.

![Add Datasets](./media/how-to/how-to-add-datasets-to-share/add-datasets.png)

In the panel on the right, select the dataset type you would like to add and then click **Next**. Select the subscription and resource group of the data you would like to add. Using the dropdown arrows, find and then check the box next to the data to add.

![Add Datasets](./media/how-to/how-to-add-datasets-to-share/add-datasets-side.png)

Once you click **Add Datasets**, the datasets will be added to your share. 
Note: A snapshot must be triggered by your consumers in order for them to see the new datasets. If there are snapshot settings configured, consumers will see the new datasets once the next scheduled snapshot completes. 
Without snapshot settings configured, the consumer must manually trigger a full or incremental copy of the data to receive the updates. 
For more information on snapshots, see [Snapshots](terminology.md).

## Next steps
To learn about how to add more recipients to a share, continue to the next how-to guide.

> [!div class="nextstepaction"]
> [Add Recipients to an Existing Data Share](how-to-add-recipients-to-share.md)