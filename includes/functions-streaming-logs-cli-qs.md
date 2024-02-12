---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 10/18/2020
ms.author: glenga
---

Run the following command to view near real-time streaming logs:

```console
func azure functionapp logstream <APP_NAME> 
```

In a separate terminal window or in the browser, call the remote function again. A verbose log of the function execution in Azure is shown in the terminal. 