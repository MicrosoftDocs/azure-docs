---
author: sgilley
ms.service: machine-learning
ms.topic: include
ms.date: 09/23/2021
ms.author: sdgilley
---

On the **Label categories** page, specify the set of classes to categorize your data. Your labelers' accuracy and speed are affected by their ability to choose among the classes. For instance, instead of spelling out the full genus and species for plants or animals, use a field code or abbreviate the genus.

You can use either a flat list or create groups of labels.  

* To create a flat list, select **+ Add label category** to create each label.

    :::image type="content" source="../articles/machine-learning/media/how-to-create-labeling-projects/add-flat-labels.png" alt-text="Screenshot: Add flat structure for labels.":::

* To create labels in different groups, select **+ Add label category** to create the top level labels.  Then select the **+** under each top level to create the next level of labels for that category.  You can create up to six levels for any grouping.
    
    :::image type="content" source="../articles/machine-learning/media/how-to-create-labeling-projects/add-label-groups.png" alt-text="Screenshot: Add groups of labels.":::

Labels at any level may be selected during the tagging process.  For example, the labels `Animal`, `Animal/Cat`,  `Animal/Dog`, `Color`, `Color/Black`, `Color/White`, and `Color/Silver` are all available choices for a label.  In a multi-label project, there is no requirement to pick one of each category.  If that is your intent, make sure to add this information in your instructions.