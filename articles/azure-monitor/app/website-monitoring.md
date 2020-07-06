---
title: 'Quickstart: Monitor websites with Azure Monitor Application Insights'
description: In this quickstart, learn how to set up client/browser-side website monitoring with Azure Monitor Application Insights.
ms.topic: quickstart
ms.date: 07/15/2019

ms.custom: mvc
---

# Quickstart: Start monitoring your website with Azure Monitor Application Insights

In this quickstart, you learn to add the open-source Application Insights JavaScript SDK to your website. You also learn how to better understand the client/browser-side experience for visitors to your website.

With Azure Monitor Application Insights, you can easily monitor your website for availability, performance, and usage. You can also quickly identify and diagnose errors in your application without waiting for a user to report them. Application Insights provides both server-side monitoring and client/browser-side monitoring capabilities.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
* A website to which you can add the Application Insights JavaScript SDK.

## Enable Application Insights

Application Insights can gather telemetry data from any internet-connected application that's running on-premises or in the cloud. Use the following steps to view this data:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select **Create a resource** > **Management tools** > **Application Insights**.

   > [!NOTE]
   >If this is your first time creating an Application Insights resource, see [Create an Application Insights resource](https://docs.microsoft.com/azure/azure-monitor/app/create-new-resource).
1. When the configuration box appears, use the following table to complete the input fields:

    | Settings        | Value           | Description  |
   | ------------- |:-------------|:-----|
   | **Name**      | Globally Unique Value | The name that identifies the app you're monitoring. |
   | **Resource Group**     | myResourceGroup      | The name for the new resource group to host Application Insights data. You can create a new resource group or use an existing one. |
   | **Location** | East US | Choose a location near you, or near where your app is hosted. |
1. Select **Create**.

## Create an HTML file

1. On your local computer, create a file called ``hello_world.html``. For this example, create the file on the root of drive C so that it looks like ``C:\hello_world.html``.
1. Copy and paste the following script into ``hello_world.html``:

    ```html
    <!DOCTYPE html>
    <html>
    <head>
    <title>Azure Monitor Application Insights</title>
    </head>
    <body>
    <h1>Azure Monitor Application Insights Hello World!</h1>
    <p>You can use the Application Insights JavaScript SDK to perform client/browser-side monitoring of your website. To learn about more advanced JavaScript SDK configurations, visit the <a href="https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md" title="API Reference">API reference</a>.</p>
    </body>
    </html>
    ```

## Configure Application Insights SDK

1. Select **Overview** > **Essentials**, and then copy your application's **Instrumentation Key**.

   ![New Application Insights resource form](media/website-monitoring/instrumentation-key-001.png)

1. Add the following script to your ``hello_world.html`` file before the closing ``</head>`` tag:

   ```javascript
   <script type="text/javascript">
      var sdkInstance="appInsightsSDK";window[sdkInstance]="appInsights";var aiName=window[sdkInstance],aisdk=window[aiName]||function(e){function n(e){t[e]=function(){var n=arguments;t.queue.push(function(){t[e].apply(t,n)})}}var t={config:e};t.initialize=!0;var i=document,a=window;setTimeout(function(){var n=i.createElement("script");n.src=e.url||"https://az416426.vo.msecnd.net/scripts/b/ai.2.min.js",i.getElementsByTagName("script")[0].parentNode.appendChild(n)});try{t.cookie=i.cookie}catch(e){}t.queue=[],t.version=2;for(var r=["Event","PageView","Exception","Trace","DependencyData","Metric","PageViewPerformance"];r.length;)n("track"+r.pop());n("startTrackPage"),n("stopTrackPage");var s="Track"+r[0];if(n("start"+s),n("stop"+s),n("setAuthenticatedUserContext"),n("clearAuthenticatedUserContext"),n("flush"),!(!0===e.disableExceptionTracking||e.extensionConfig&&e.extensionConfig.ApplicationInsightsAnalytics&&!0===e.extensionConfig.ApplicationInsightsAnalytics.disableExceptionTracking)){n("_"+(r="onerror"));var o=a[r];a[r]=function(e,n,i,a,s){var c=o&&o(e,n,i,a,s);return!0!==c&&t["_"+r]({message:e,url:n,lineNumber:i,columnNumber:a,error:s}),c},e.autoExceptionInstrumented=!0}return t}(
      {
         instrumentationKey:"INSTRUMENTATION_KEY"
      }
      );window[aiName]=aisdk,aisdk.queue&&0===aisdk.queue.length&&aisdk.trackPageView({});
   </script>
   ```

1. Edit ``hello_world.html`` and add your instrumentation key.

1. Open ``hello_world.html`` in a local browser session. This action creates a single page view. You can refresh your browser to generate multiple test-page views.

## Monitor your website in the Azure portal

1. Reopen the Application Insights **Overview** page in the Azure portal to view details of your currently running application. The **Overview** page is where you retrieved your instrumentation key.

   The four default charts on the overview page are scoped to server-side application data. Because we're instrumenting the client/browser-side interactions with the JavaScript SDK, this particular view doesn't apply unless we also have a server-side SDK installed.

1. Select **Analytics** ![Application Map icon](media/website-monitoring/006.png).  This action opens **Analytics**, which provides a rich query language for analyzing all data collected by Application Insights. To view data related to the client-side browser requests, run the following query:

    ```kusto
    // average pageView duration by name
    let timeGrain=1s;
    let dataset=pageViews
    // additional filters can be applied here
    | where timestamp > ago(15m)
    | where client_Type == "Browser" ;
    // calculate average pageView duration for all pageViews
    dataset
    | summarize avg(duration) by bin(timestamp, timeGrain)
    | extend pageView='Overall'
    // render result in a chart
    | render timechart
    ```

   ![Analytics graph of user requests over a period of time](./media/website-monitoring/analytics-query.png)

1. Go back to the **Overview** page. Under the **Investigate** header, select **Browser**, and then select **Performance**.  Metrics related to the performance of your website appear. There's a corresponding view for analyzing failures and exceptions in your website. You can select **Samples** to access the [end-to-end transaction details](../../azure-monitor/app/transaction-diagnostics.md).

   ![Server metrics graph](./media/website-monitoring/browser-performance.png)

1. On the main Application Insights menu, under the **Usage** header, select [**Users**](../../azure-monitor/app/usage-segmentation.md) to begin exploring the [user behavior analytics tools](../../azure-monitor/app/usage-overview.md). Because we're testing from a single machine, we'll only see data for one user. For a live website, the distribution of users might look like this:

     ![User graph](./media/website-monitoring/usage-users.png)

1. For a more complex website with multiple pages, you can use the [**User Flows**](../../azure-monitor/app/usage-flows.md) tool to track the pathway that visitors take through the various parts of your website.

   ![User Flows visualization](./media/website-monitoring/user-flows.png)

To learn more advanced configurations for monitoring websites, see the [JavaScript SDK API reference](https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md).

## Clean up resources

If you plan to continue working with additional quickstarts or tutorials, don't clean up the resources created in this quickstart. Otherwise, use the following steps to delete all resources created by this quickstart in the Azure portal.

> [!NOTE]
> If you used an existing resource group, the following instructions won't work. Instead, you can just delete the individual Application Insights resource. Keep in mind that when you delete a resource group, all underyling resources that are members of that group are deleted too.

1. On the left menu on the Azure portal, select **Resource groups**, and then select **myResourceGroup** or the name of your temporary resource group.
1. On your resource group page, select **Delete**, enter **myResourceGroup** in the text box, and then select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Find and diagnose performance problems](https://docs.microsoft.com/azure/application-insights/app-insights-analytics)
