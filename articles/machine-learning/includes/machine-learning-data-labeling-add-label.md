---
author: sgilley
ms.service: machine-learning
ms.topic: include
ms.date: 09/23/2021
ms.author: sdgilley
---

During the data labeling process, you might want to add more labels to classify your items. For example, you might want to add an *Unknown* or *Other* label to indicate confusion.

To add one or more labels to a project:

1. On the main **Data Labeling** page, select the project.
1. On the project command bar, toggle the status from **Running** to **Paused** to stop labeling activity.
1. Select the **Details** tab.
1. In the list on the left, select **Label categories**.
1. Modify your labels.

   :::image type="content" source="../media/how-to-create-labeling-projects/add-label.png" alt-text="Screenshot that shows how to add a label in Machine Learning Studio.":::
1. In the form, add your new label. Then choose how to continue the project. Because you've changed the available labels, choose how to treat data that's already labeled:
    * Start over, and remove all existing labels. Choose this option if you want to start labeling from the beginning by using the new full set of labels. 
    * Start over, and keep all existing labels. Choose this option to mark all data as unlabeled, but keep the existing labels as a default tag for images that were previously labeled.
    * Continue, and keep all existing labels. Choose this option to keep all data already labeled as it is, and start using the new label for data that's not yet labeled.
1. Modify your instructions page as necessary for new labels.
1. After you've added all new labels, toggle **Paused** to **Running** to restart the project. 