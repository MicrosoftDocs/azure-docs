---
author: sgilley
ms.service: machine-learning
ms.topic: include
ms.date: 12/08/2021
ms.author: sdgilley
---

If you plan to add new data files to your dataset, use incremental refresh to add the files to your project.   

When **Enable incremental refresh at regular intervals** is set, the dataset is checked periodically for new files to be added to a project based on the labeling completion rate. The check for new data stops when the project contains the maximum 500,000 files.

Select **Enable incremental refresh at regular intervals** when you want your project to continually monitor for new data in the datastore. 

Clear the selection if you don't want new files in the datastore to automatically be added to your project.

> [!IMPORTANT]
> Don't create a new version for the dataset you want to update. If you do, the updates won't be seen because the data labeling project is pinned to the initial version. Instead, use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to modify your data in the appropriate folder in Blob Storage.
>
> Also, don't remove data. Removing data from the dataset your project uses causes an error in the project. 

After the project is created, use the [**Details**](#details-tab) tab to change incremental refresh, view the time stamp for the last refresh, and request an immediate refresh of data.