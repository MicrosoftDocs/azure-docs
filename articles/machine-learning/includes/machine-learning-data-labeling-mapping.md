---
author: sgilley
ms.service: machine-learning
ms.topic: include
ms.date: 12/12/2023
ms.author: sdgilley
---

You must specify a column that maps to the **Image** field. You can also optionally map other columns that are present in the data. For example, if your data contains a **Label** column, you can map it to the **Category** field. If your data contains a **Confidence** column, you can map it to the **Confidence** field.

If you are importing labels from a previous project, the labels must be in the same format as the labels you are creating. For example, if you are creating bounding box labels, the labels you import must also be bounding box labels.