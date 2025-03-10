---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 08/15/2024
ms.custom: devdivchpfy22	
ms.author: glenga
---
## Run the function in Azure

1. Press <kbd>F1</kbd> to display the command palette, then search for and run the command `Azure Functions:Execute Function Now...`. If prompted, select your subscription.

2.  Select your new function app resource and `HttpExample` as your function.

3. In **Enter request body** type `{ "name": "Azure" }`, then press Enter to send this request message to your function.

4. When the function executes in Azure, the response is displayed in the notification area. Expand the notification to review the full response.
