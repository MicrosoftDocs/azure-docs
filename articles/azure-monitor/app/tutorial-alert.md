---
title: Send alerts from Azure Application Insights | Microsoft Docs
description: Tutorial shows how to send alerts in response to errors in your application by using Application Insights.
ms.topic: tutorial
ms.date: 04/10/2019
ms.custom: mvc
ms.reviewer: vitalyg
---

# Monitor and alert on application health with Application Insights

Application Insights allows you to monitor your application and sends you alerts when it's unavailable, experiencing failures, or suffering from performance issues. This tutorial takes you through the process of creating tests to continuously check the availability of your application.

You'll learn how to:

> [!div class="checklist"]
> * Create availability tests to continuously check the response of the application.
> * Send mail to administrators when a problem occurs.

## Prerequisites

To complete this tutorial, create an [Application Insights resource](../app/create-new-resource.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create availability test

Availability tests in Application Insights allow you to automatically test your application from various locations around the world. In this tutorial, you'll perform a URL test to ensure that your web application is available. You could also create a complete walkthrough to test its detailed operation.

1. Select **Application Insights** and then select your subscription.

1. Under the **Investigate** menu, select **Availability**. Then select **Create test**.

    ![Screenshot that shows adding an availability test.](media/tutorial-alert/add-test-001.png)

1. Enter a name for the test and leave the other defaults. This selection will trigger requests for the application URL every 5 minutes from five different geographic locations.

1. Select **Alerts** to open the **Alerts** dropdown where you can define details for how to respond if the test fails. Choose **Near-realtime** and set the status to **Enabled.**

    Enter an email address to send when the alert criteria are met. Optionally, you can enter the address of a webhook to call when the alert criteria are met.

    ![Screenshot that shows creating a test.](media/tutorial-alert/create-test-001.png)

1. Return to the test panel, select the ellipses, and edit the alert to enter the configuration for your near-realtime alert.

    ![Screenshot that shows editing an alert.](media/tutorial-alert/edit-alert-001.png)

1. Set failed locations to greater than or equal to 3. Create an [action group](../alerts/action-groups.md) to configure who gets notified when your alert threshold is breached.

    ![Screenshot that shows saving alert UI.](media/tutorial-alert/save-alert-001.png)

1. After you've configured your alert, select the test name to view details from each location. Tests can be viewed in both line graph and scatter plot format to visualize the successes and failures for a given time range.

    ![Screenshot that shows test details.](media/tutorial-alert/test-details-001.png)

1. To see the details of any test, select its dot in the scatter chart to open the **End-to-end transaction details** screen. The following example shows the details for a failed request.

    ![Screenshot that shows test results.](media/tutorial-alert/test-result-001.png)

## Next steps

Now that you've learned how to alert on issues, advance to the next tutorial to learn how to analyze how users are interacting with your application.

> [!div class="nextstepaction"]
> [Understand users](./tutorial-users.md)
