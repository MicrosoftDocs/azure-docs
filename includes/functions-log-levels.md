---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/04/2020	
ms.author: glenga
---
A *log level* is assigned to every log. `LogLevel` is an enumeration, where the integer code value indicates relative importance:

|LogLevel    |Code| Description |
|------------|---|--------------|
|Trace       | 0 |Logs that contain the most detailed messages. These messages may contain sensitive application data. These messages are disabled by default and should never be enabled in a production environment.|
|Debug       | 1 | Logs that are used for interactive investigation during development. These logs should primarily contain information useful for debugging and have no long-term value. |
|Information | 2 | Logs that track the general flow of the application. These logs should have long-term value. |
|Warning     | 3 | Logs that highlight an abnormal or unexpected event in the application flow, but do not otherwise cause the application execution to stop. |
|Error       | 4 | Logs that highlight when the current flow of execution is stopped due to a failure. These should indicate a failure in the current activity, not an application-wide failure. |
|Critical    | 5 | Logs that describe an unrecoverable application or system crash, or a catastrophic failure that requires immediate attention. |
|None        | 6 | Not used for writing log messages. Specifies that a logging category should not write any messages. |

The host.json file configuration determines how much logging a function app sends to Application Insights. 