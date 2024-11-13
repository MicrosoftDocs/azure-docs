---
author: ggailey777
ms.service: azure-functions
ms.custom:
  - build-2024
ms.topic: include
ms.date: 05/04/2024
ms.author: glenga
---
> [!TIP]
> The **Code + Test** functionality in the portal works even for functions that are read-only and can't be edited in the portal.

1. On the **Overview** page for your new function app, select your new HTTP triggered function in the **Functions** tab.

1. In the left menu, expand **Developer**, select **Code + Test**, and then select **Test/Run**.

1. In the **Test/Run** dialog, select **Run**. 

    An HTTP POST request is sent to your new function with a payload that contains the `name` value of `Azure`. You can also test the function by selecting **GET** for **HTTP method** and adding a `name` parameter with a value of `YOUR_NAME`. 

    >[!TIP]
    >To test in an external browser, instead select **Get function URL**, copy the **default (Function key)** value, add the query string value `&name=<YOUR_NAME>` to the end of this URL, and then submit the URL in the address bar of your web browser.

1. When your function runs, trace information is written to the logs. To see the trace output, return to the **Code + Test** page in the portal and expand the **Logs** arrow at the bottom of the page. Call your function again to see the trace output written to the logs.
