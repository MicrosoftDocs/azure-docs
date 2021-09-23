---
author: sgilley
ms.service: machine-learning
ms.topic: include
ms.date: 09/23/2021
ms.author: sdgilley
---

The **Dashboard** tab shows the progress of the labeling task.

:::image type="content" source="../articles/machine-learning/media/how-to-create-labeling-projects/labeling-dashboard.png" alt-text="Data labeling dashboard":::

The progress chart shows how many items have been labeled and how many are not yet done.  Items pending may be:

* Not yet added to a task
* Included in a task that is assigned to a labeler but not yet completed 
* In the queue of tasks yet to be assigned

The middle section shows the queue of tasks yet to be assigned. When ML assisted labeling is off, this section shows the number of manual tasks to be assigned. When ML assisted labeling is on, this will also show:

* Tasks containing clustered items in the queue
* Tasks containing prelabeled items in the queue

Additionally, when ML assisted labeling is enabled, a small progress bar shows when the next training run will occur.  The Experiments sections give links for each of the machine learning runs.

* Training - trains a model to predict the labels
* Validation - determines whether this model's prediction will be used for pre-labeling the items 
* Inference - prediction run for new items
* Featurization - clusters items (only for image classification projects)

On the right side is a distribution of the labels for those tasks that are complete.  Remember that in some project types, an item can have multiple labels, in which case the total number of labels can be greater than the total number items.