---
author: sgilley
ms.service: machine-learning
ms.topic: include
ms.date: 09/23/2021
ms.author: sdgilley
---

If you plan to add new files to your dataset, use incremental refresh to add these new files your project.   When **incremental refresh** is enabled,  the dataset is checked periodically for new images to be added to a project, based on the labeling completion rate.   The check for new data stops when the project contains the maximum 500,000 files.

To add more files to your project, use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to upload to the appropriate folder in the blob storage. 

Select **Enable incremental refresh** when you want your project to continually monitor for new data in the datastore. Data will be pulled into your project once a day when enabled. After you add new data to the datastore, you'll have to wait before it shows up in your project.  You can see a timestamp for when data was last  refreshed in the **Incremental refresh** section of **Details** tab for your project.
Unselect if you don't want new files in the datastore to be added to your project.