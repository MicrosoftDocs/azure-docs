---
title: Availability Standard test - Azure Monitor Application Insights
description: Set up Standard tests in Application Insights to check for availability of a website with a single request test. 
ms.topic: conceptual
ms.date: 09/12/2023
---

# Standard test

A Standard test is a type of availability test that checks the availability of a website by sending a single request. In addition to validating whether an endpoint is responding and measuring the performance, Standard tests also include SSL certificate validity, proactive lifetime check, HTTP request verb (for example, `GET`,`HEAD`, and `POST`), custom headers, and custom data associated with your HTTP request.

To create an availability test, you must use an existing Application Insights resource or [create an Application Insights resource](create-workspace-resource.md).

> [!TIP]
> If you're currently using other availability tests, like URL ping tests, you might add Standard tests alongside the others. If you want to use Standard tests instead of one of your other tests, add a Standard test and delete your old test.

## Create a Standard test

To create a Standard test:

1. Go to your Application Insights resource and select the **Availability** pane.
1. Select **Add Standard test**.

    :::image type="content" source="./media/availability-standard-test/standard-test.png" alt-text="Screenshot that shows the Availability pane with the Add Standard test tab open." lightbox="./media/availability-standard-test/standard-test.png":::

1. Input your test name, URL, and other settings that are described in the following table. Then select **Create**.

    |Setting | Description |
    |--------|-------------|
    |**URL** |  The URL can be any webpage you want to test, but it must be visible from the public internet. The URL can include a query string. So, for example, you can exercise your database a little. If the URL resolves to a redirect, we follow it up to 10 redirects.|
    |**Parse dependent requests**| Test requests images, scripts, style files, and other files that are part of the webpage under test. The recorded response time includes the time taken to get these files. The test fails if any of these resources can't be successfully downloaded within the timeout for the whole test. If the option isn't selected, the test only requests the file at the URL you specified. Enabling this option results in a stricter check. The test could fail for cases, which might not be noticeable when you manually browse the site. |
    |**Enable retries**| When the test fails, it's retried after a short interval. A failure is reported only if three successive attempts fail. Subsequent tests are then performed at the usual test frequency. Retry is temporarily suspended until the next success. This rule is applied independently at each test location. *We recommend this option*. On average, about 80% of failures disappear on retry.|
    | **SSL certificate validation test** | You can verify the SSL certificate on your website to make sure it's correctly installed, valid, trusted, and doesn't give any errors to any of your users. |
    | **Proactive lifetime check** | This setting enables you to define a set time period before your SSL certificate expires. After it expires, your test will fail. |
    |**Test frequency**| Sets how often the test is run from each test location. With a default frequency of five minutes and five test locations, your site is tested on average every minute.|
    |**Test locations**|  The places from where our servers send web requests to your URL. *Our minimum number of recommended test locations is five* to ensure that you can distinguish problems in your website from network issues. You can select up to 16 locations.|
    | **Custom headers** | Key value pairs that define the operating parameters. |
    | **HTTP request verb** | Indicate what action you want to take with your request. |
    | **Request body** | Custom data associated with your HTTP request. You can upload your own files, enter your content, or disable this feature. |

## Success criteria

|Setting| Description|
|-------|------------|
| **Test timeout** |Decrease this value to be alerted about slow responses. The test is counted as a failure if the responses from your site haven't been received within this period. If you selected **Parse dependent requests**, all the images, style files, scripts, and other dependent resources must have been received within this period.|
| **HTTP response** | The returned status code that's counted as a success. The number 200 is the code that indicates that a normal webpage has been returned.|
| **Content match** | A string, like "Welcome!" We test that an exact case-sensitive match occurs in every response. It must be a plain string, without wildcards. Don't forget that if your page content changes, you might have to update it. *Only English characters are supported with content match.* |

## Alerts

|Setting| Description|
|-------|------------|
|**Near real time** | We recommend using near real time alerts. Configuring this type of alert is done after your availability test is created.  |
|**Alert location threshold**|We recommend a minimum of 3/5 locations. The optimal relationship between alert location threshold and the number of test locations is **alert location threshold** = **number of test locations - 2, with a minimum of five test locations.**|

## Location population tags

You can use the following population tags for the geo-location attribute when you deploy an availability URL ping test by using Azure Resource Manager.

### Azure Government

| Display name   | Population name     |
|----------------|---------------------|
| USGov Virginia | usgov-va-azr        |
| USGov Arizona  | usgov-phx-azr       |
| USGov Texas    | usgov-tx-azr        |
| USDoD East     | usgov-ddeast-azr    |
| USDoD Central  | usgov-ddcentral-azr |

### Microsoft Azure operated by 21Vianet

| Display name   | Population name     |
|----------------|---------------------|
| China East     | mc-cne-azr          |
| China East 2   | mc-cne2-azr         |
| China North    | mc-cnn-azr          |
| China North 2  | mc-cnn2-azr         |

#### Azure

| Display name                           | Population name   |
|----------------------------------------|-------------------|
| Australia East                         | emea-au-syd-edge  |
| Brazil South                           | latam-br-gru-edge |
| Central US                             | us-fl-mia-edge    |
| East Asia                              | apac-hk-hkn-azr   |
| East US                                | us-va-ash-azr     |
| France South (Formerly France Central) | emea-ch-zrh-edge  |
| France Central                         | emea-fr-pra-edge  |
| Japan East                             | apac-jp-kaw-edge  |
| North Europe                           | emea-gb-db3-azr   |
| North Central US                       | us-il-ch1-azr     |
| South Central US                       | us-tx-sn1-azr     |
| Southeast Asia                         | apac-sg-sin-azr   |
| UK West                                | emea-se-sto-edge  |
| West Europe                            | emea-nl-ams-azr   |
| West US                                | us-ca-sjc-azr     |
| UK South                               | emea-ru-msa-edge  |

## See your availability test results

Availability test results can be visualized with both **Line** and **Scatter Plot** views.

After a few minutes, select **Refresh** to see your test results.

:::image type="content" source="./media/monitor-web-app-availability/availability-refresh-002.png" alt-text="Screenshot that shows the Availability page with the Refresh button highlighted.":::

The **Scatter Plot** view shows samples of the test results that have diagnostic test-step detail in them. The test engine stores diagnostic detail for tests that have failures. For successful tests, diagnostic details are stored for a subset of the executions. Hover over any of the green/red dots to see the test, test name, and location.

:::image type="content" source="./media/monitor-web-app-availability/availability-scatter-plot-003.png" alt-text="Screenshot that shows the Line view." border="false":::

Select a particular test or location. Or you can reduce the time period to see more results around the time period of interest. Use Search Explorer to see results from all executions. Or you can use Log Analytics queries to run custom reports on this data.

## Inspect and edit tests

To edit, temporarily disable, or delete a test, select the ellipses next to a test name. It might take up to 20 minutes for configuration changes to propagate to all test agents after a change is made.

:::image type="content" source="./media/monitor-web-app-availability/edit.png" alt-text="Screenshot that shows the View test details. Edit and Disable a web test." border="false":::

You might want to disable availability tests or the alert rules associated with them while you're performing maintenance on your service.

## If you see failures

Select a red dot.

:::image type="content" source="./media/monitor-web-app-availability/end-to-end.png" alt-text="Screenshot that shows the End-to-end transaction details tab." border="false":::

From an availability test result, you can see the transaction details across all components. Here you can:

* Review the troubleshooting report to determine what might have caused your test to fail but your application is still available.
* Inspect the response received from your server.
* Diagnose failure with correlated server-side telemetry collected while processing the failed availability test.
* Log an issue or work item in Git or Azure Boards to track the problem. The bug will contain a link to this event.
* Open the web test result in Visual Studio.

To learn more about the end-to-end transaction diagnostics experience, see the [transaction diagnostics documentation](./transaction-search-and-diagnostics.md?tabs=transaction-diagnostics).

Select the exception row to see the details of the server-side exception that caused the synthetic availability test to fail. You can also get the [debug snapshot](./snapshot-debugger.md) for richer code-level diagnostics.

:::image type="content" source="./media/monitor-web-app-availability/open-instance-4.png" alt-text="Screenshot that shows the Server-side diagnostics.":::

In addition to the raw results, you can also view two key availability metrics in [metrics explorer](../essentials/metrics-getting-started.md):

* **Availability**: Percentage of the tests that were successful across all test executions.
* **Test Duration**: Average test duration across all test executions.

## Next steps

* [Availability alerts](availability-alerts.md)
* [Multi-step web tests](availability-multistep.md)
* [Troubleshooting](troubleshoot-availability.md)
* [Web tests Azure Resource Manager template](/azure/templates/microsoft.insights/webtests?tabs=json)
