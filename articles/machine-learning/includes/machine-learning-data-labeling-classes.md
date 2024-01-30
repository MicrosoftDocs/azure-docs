---
author: sgilley
ms.service: machine-learning
ms.topic: include
ms.date: 09/23/2021
ms.author: sdgilley
---

On the **Label categories** page, specify a set of classes to categorize your data.

Your labelers' accuracy and speed are affected by their ability to choose among classes. For instance, instead of spelling out the full genus and species for plants or animals, use a field code or abbreviate the genus.

You can use either a flat list or create groups of labels.  

* To create a flat list, select **Add label category** to create each label.

    :::image type="content" source="../media/how-to-create-labeling-projects/add-flat-labels.png" alt-text="Screenshot that shows how to add a flat structure of labels.":::

* To create labels in different groups, select **Add label category** to create the top-level labels. Then select the plus sign (**+**) under each top level to create the next level of labels for that category. You can create up to six levels for any grouping.
    
    :::image type="content" source="../media/how-to-create-labeling-projects/add-label-groups.png" alt-text="Screenshot that shows how to add groups of labels.":::

You can select labels at any level during the tagging process. For example, the labels `Animal`, `Animal/Cat`,  `Animal/Dog`, `Color`, `Color/Black`, `Color/White`, and `Color/Silver` are all available choices for a label. In a multi-label project, there's no requirement to pick one of each category. If that is your intent, make sure to include this information in your instructions.