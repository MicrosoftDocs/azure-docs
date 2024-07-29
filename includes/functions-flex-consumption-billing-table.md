---
author: ggailey777
ms.service: azure-functions
ms.custom:
  - build-2024
ms.topic: include
ms.date: 05/13/2024
ms.author: glenga
---
There are two modes by which your costs are determined when running your apps in the Flex Consumption plan. Each mode is determined on a per-instance basis.

| Billing mode | Description |
| ---- | ---- |
| **On Demand** | When running in _on demand_ mode, you are billed only for the amount of time your function code is executing on your available instances. In on demand mode, no minimum instance count is required. You're billed for:<br/><br/>• The total amount of memory provisioned while each on demand instance is _actively_ executing functions (in GB-seconds), minus a free grant of GB-s per month.<br/>• The total number of executions, minus a free grant (number) of executions per month. |
| **Always ready** | You can configure one or more instances, assigned to specific trigger types (HTTP/Durable/Blob) and individual functions, that are always available to be able handle requests. When you have any always ready instances enabled, you're billed for:<br/><br/>• The total amount of memory provisioned across all of your always ready instances, known as the _baseline_ (in GB-seconds).<br/>• The total amount of memory provisioned during the time each always ready instance is _actively_ executing functions (in GB-seconds).<br/>• The total number of executions.<br/><br/>In always ready billing, there are no free grants. |
