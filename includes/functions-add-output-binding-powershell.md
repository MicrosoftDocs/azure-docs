---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/10/2022
ms.author: glenga
ms.custom: devdivchpfy22, devx-track-azurepowershell
---

Add code that uses the `Push-OutputBinding` cmdlet to write text to the queue using the `msg` output binding. Add this code before you set the OK status in the `if` statement.

:::code language="powershell" range="18-19" source="~/functions-docs-powershell/functions-add-output-binding-storage-queue-cli/HttpExample/run.ps1":::

At this point, your function must look as follows:

:::code language="powershell" source="~/functions-docs-powershell/functions-add-output-binding-storage-queue-cli/HttpExample/run.ps1":::
