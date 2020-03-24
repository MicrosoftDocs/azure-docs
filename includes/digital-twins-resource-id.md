---
author: baanders
ms.service: digital-twins
ms.topic: include
ms.date: 3/24/2020
ms.author: baanders
---

To assign a role, you need the **resource ID** of the Azure Digital Twins instance you have created. If you did not record it earlier when you created your instance, you can retrieve it using this command:

```bash
az dt show --name <your-instance-name> -g <your-resource-group-name>
```
The resource ID will be part of the output, as a long string named "id" that begins with the letters "/subscriptions/…".