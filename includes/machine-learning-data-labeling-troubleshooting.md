---
author: sgilley
ms.service: machine-learning
ms.topic: include
ms.date: 09/23/2021
ms.author: sdgilley
---

Use these tips if you see any of these issues.

|Issue  |Resolution  |
|---------|---------|
|Only datasets created on blob datastores can be used.     |  Known limitation of the current release.       |
|Removing data from the dataset your project uses will cause an error in the project. | Don't remove data from the version of the dataset you used in a labeling project. Create a new version of the dataset to use for removing data.|
|After creation, the project shows "Initializing" for a long time.     | Manually refresh the page. Initialization should complete at roughly 20 datapoints per second. The lack of autorefresh is a known issue.         |
|Newly labeled items not visible in data review.     |   To load all labeled items, choose the **First** button. The **First** button will take you back to the front of the list, but loads all labeled data.      |
|Unable to assign set of tasks to a specific labeler.     |   Known limitation of the current release.  |