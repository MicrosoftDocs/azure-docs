---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: stream-analytics
ms.topic: include
ms.date: 07/10/2023
ms.author: spelluru
ms.custom: "include file"

---


Azure Stream Analytics captures two categories of resource logs:

* **Authoring**: Captures log events that are related to job authoring operations, such as job creation, adding and deleting inputs and outputs, adding and updating the query, and starting or stopping the job.

* **Execution**: Captures events that occur during job execution.
    * Connectivity errors
    * Data processing errors, including:
        * Events that don’t conform to the query definition (mismatched field types and values, missing fields, and so on)
        * Expression evaluation errors
    * Other events and errors