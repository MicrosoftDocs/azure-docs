---
title: Monitor a test with Azure Stack validation as a service | Microsoft Docs
description: Monitor a test Azure Stack validation as a service known issues.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 07/11/2018
ms.author: mabrigg
ms.reviewer: johnhas

---

# Monitor a test with Azure Stack validation as a service

[!INCLUDE[Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

The execution of a test can be monitored by viewing the **Operations** page for test suites that are in progress or completed. This page details the status of the test and its operations.

# Monitor a test

1. Select a solution.

2. Select **Manage** on any workflow tile.

3. Click a workflow to open its test summary page.

4. Expand the context menu **[...]** for any test suite instance.

5. Select **View Operations**

![Alt text](media\image4.png)

For tests that have finished running, logs can be downloaded from the test summary page by clicking on **Download logs** in a test's context menu **[...]**. Azure Stack partners can use these logs to debug issues for failed tests.


## Next steps

- To learn more about [Azure Stack validation as a service](https://docs.microsoft.com/azure/azure-stack/partner).