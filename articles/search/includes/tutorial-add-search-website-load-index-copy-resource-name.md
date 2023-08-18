---
ms.topic: include
ms.date: 07/18/2023
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
---
Note your **Search resource name**. You'll need this to connect the Azure Function app to your search resource. 

> [!CAUTION]
> While you may be tempted to use your search admin key in the Azure Function, that isn't following the principle of least privilege. The Azure Function will use the query key to conform to least privilege.
