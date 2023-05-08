---
author: sgilley
ms.service: machine-learning
ms.topic: include
ms.date: 09/23/2021
ms.author: sdgilley
---

Use these tips if you see any of the following issues:

|Issue  |Resolution  |
|---------|---------|
|Only datasets created on blob datastores can be used.|This issue is a known limitation of the current release.|
|Removing data from the dataset your project uses causes an error in the project.|Don't remove data from the version of the dataset you used in a labeling project. Create a new version of the dataset to use to remove data.|
|After a project is created, the project status is *Initializing* for an extended time.|Manually refresh the page. Initialization should complete at roughly 20 data points per second. No automatic refresh is a known issue.|
|Newly labeled items aren't visible in data review.|To load all labeled items, select the **First** button. The **First** button takes you back to the front of the list, and it loads all labeled data.|
|You can't assign a set of tasks to a specific labeler.|This issue is a known limitation of the current release.|