---
author: sgilley
ms.service: machine-learning
ms.topic: include
ms.date: 12/08/2021
ms.author: sdgilley
---

If you plan to add new files to your dataset, use incremental refresh to add these new files your project.   

When **incremental refresh at regular intervals** is enabled, the dataset is checked periodically for new files to be added to a project, based on the labeling completion rate.   The check for new data stops when the project contains the maximum 500,000 files.

Select **Enable incremental refresh at regular intervals** when you want your project to continually monitor for new data in the datastore. 

Unselect if you don't want new files in the datastore to automatically be added to your project.

To add more files to your project, use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to upload to the appropriate folder in the blob storage.  

After the project is created, use the [**Details**](#details-tab) tab to change **incremental refresh**, view the timestamp for the last refresh, and request an immediate refresh of data.