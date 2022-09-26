---
author: sgilley
ms.service: machine-learning
ms.topic: include
ms.date: 10/21/2021
ms.author: sdgilley
---

It's important to clearly explain the labeling task. On the **Labeling instructions** page, you can add a link to an external site for labeling instructions, or provide instructions in the edit box on the page. Keep the instructions task-oriented and appropriate to the audience. Consider these questions:

* What are the labels they'll see, and how will they choose among them? Is there a reference text to refer to?
* What should they do if no label seems appropriate?
* What should they do if multiple labels seem appropriate?
 * What confidence threshold should they apply to a label? Do you want their "best guess" if they aren't certain?
* What should they do with partially occluded or overlapping objects of interest?
* What should they do if an object of interest is clipped by the edge of the image?
* What should they do after they submit a label if they think they made a mistake?
* What should they do if they discover image quality issues including poor lighting conditions, reflections, loss of focus, undesired background included, abnormal camera angles, and so on?
* What should they do if there are multiple reviewers who have different opinions on the labels?