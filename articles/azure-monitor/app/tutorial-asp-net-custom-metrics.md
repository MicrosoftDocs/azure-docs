---
title: Application Insights custom metrics with .NET and .NET Core
description: Learn how to use Application Insights to capture locally pre-aggregated metrics for .NET and .NET Core applications.
ms.topic: conceptual
ms.date: 08/22/2022
ms.devlang: csharp
ms.reviewer: casocha
---

# Capture Application Insights custom metrics with .NET and .NET Core

In this article, you'll learn how to capture custom metrics with Application Insights in .NET and .NET Core apps.

Insert a few lines of code in your application to find out what users are doing with it, or to help diagnose issues. You can send telemetry from device and desktop apps, web clients, and web servers. Use the [Application Insights](./app-insights-overview.md) core telemetry API to send custom events and metrics and your own versions of standard telemetry. This API is the same API that the standard Application Insights data collectors use.

## ASP.NET Core applications

### Prerequisites

If you'd like to follow along with the guidance in this article, certain pre-requisites are needed.

* Visual Studio 2022
* Visual Studio Workloads: ASP.NET and web development, Data storage and processing, and Azure development
* .NET 6.0
* Azure subscription and user account (with the ability to create and delete resources)
* Deploy the [completed sample application (`2 - Completed Application`)](./tutorial-asp-net-core.md) or an existing ASP.NET Core application with the [Application Insights for ASP.NET Core](https://nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) NuGet package installed and [configured to gather server-side telemetry](asp-net-core.md#enable-application-insights-server-side-telemetry-visual-studio).

### Custom metrics overview

The Application Insights .NET and .NET Core SDKs have two different methods of collecting custom metrics, `TrackMetric()`, and `GetMetric()`. The key difference between these two methods is local aggregation. `TrackMetric()` lacks pre-aggregation while `GetMetric()` has pre-aggregation. The recommended approach is to use aggregation, therefore, `TrackMetric()` is no longer the preferred method of collecting custom metrics. This article will walk you through using the GetMetric() method, and some of the rationale behind how it works.

#### Pre-aggregating vs non pre-aggregating API

`TrackMetric()` sends raw telemetry denoting a metric. It's inefficient to send a single telemetry item for each value. `TrackMetric()` is also inefficient in terms of performance since every `TrackMetric(item)` goes through the full SDK pipeline of telemetry initializers and processors. Unlike `TrackMetric()`, `GetMetric()` handles local pre-aggregation for you and then only submits an aggregated summary metric at a fixed interval of one minute. So if you need to closely monitor some custom metric at the second or even millisecond level you can do so while only incurring the storage and network traffic cost of only monitoring every minute. This behavior also greatly reduces the risk of throttling occurring since the total number of telemetry items that need to be sent for an aggregated metric are greatly reduced.

In Application Insights, custom metrics collected via `TrackMetric()` and `GetMetric()` aren't subject to [sampling](./sampling.md). Sampling important metrics can lead to scenarios where alerting you may have built around those metrics could become unreliable. By never sampling your custom metrics, you can generally be confident that when your alert thresholds are breached, an alert will fire.  But since custom metrics aren't sampled, there are some potential concerns.

Trend tracking in a metric every second, or at an even more granular interval can result in:

- Increased data storage costs. There's a cost associated with how much data you send to Azure Monitor. (The more data you send the greater the overall cost of monitoring.)
- Increased network traffic/performance overhead. (In some scenarios this overhead could have both a monetary and application performance cost.)
- Risk of ingestion throttling. (The Azure Monitor service drops ("throttles") data points when your app sends a high rate of telemetry in a short time interval.)

Throttling is a concern as it can lead to missed alerts. The condition to trigger an alert could occur locally and then be dropped at the ingestion endpoint due to too much data being sent. We don't recommend using `TrackMetric()` for .NET and .NET Core unless you've implemented your own local aggregation logic. If you're trying to track every instance an event occurs over a given time period, you may find that [`TrackEvent()`](./api-custom-events-metrics.md#trackevent) is a better fit. Though keep in mind that unlike custom metrics, custom events are subject to sampling. You can still use `TrackMetric()` even without writing your own local pre-aggregation, but if you do so be aware of the pitfalls.

In summary `GetMetric()` is the recommended approach since it does pre-aggregation, it accumulates values from all the Track() calls and sends a summary/aggregate once every minute. `GetMetric()` can significantly reduce the cost and performance overhead by sending fewer data points, while still collecting all relevant information.

## Getting a TelemetryClient instance

Get an instance of `TelemetryClient` from the dependency injection container in **HomeController.cs**:

```csharp
//... additional code removed for brevity
using Microsoft.ApplicationInsights;

namespace AzureCafe.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private AzureCafeContext _cafeContext;
        private BlobContainerClient _blobContainerClient;
        private TextAnalyticsClient _textAnalyticsClient;
        private TelemetryClient _telemetryClient;

        public HomeController(ILogger<HomeController> logger, AzureCafeContext context, BlobContainerClient blobContainerClient, TextAnalyticsClient textAnalyticsClient, TelemetryClient telemetryClient)
        {
            _logger = logger;
            _cafeContext = context;
            _blobContainerClient = blobContainerClient;
            _textAnalyticsClient = textAnalyticsClient;
            _telemetryClient = telemetryClient;
        }

        //... additional code removed for brevity
    }
}
```

`TelemetryClient` is thread safe.

## TrackMetric

Application Insights can chart metrics that aren't attached to particular events. For example, you could monitor a queue length at regular intervals. With metrics, the individual measurements are of less interest than the variations and trends, and so statistical charts are useful.

To send metrics to Application Insights, you can use the `TrackMetric(..)` API. We'll cover the recommended way to send a metric:

* **Aggregation**. When you work with metrics, every single measurement is rarely of interest. Instead, a summary of what happened during a particular time period is important. Such a summary is called _aggregation_.

  For example, the aggregate metric sum for that time period is `1` and the count of the metric values is `2`. When you use the aggregation approach, you invoke `TrackMetric` only once per time period and send the aggregate values. We recommend this approach because it can significantly reduce the cost and performance overhead by sending fewer data points to Application Insights, while still collecting all relevant information.

### TrackMetric example

1. From the Visual Studio Solution Explorer, locate and open the **HomeController.cs** file.

2. Locate the `CreateReview` method and the following code.

   ```csharp
   if (model.Comments != null)
    {
        var response = _textAnalyticsClient.AnalyzeSentiment(model.Comments);
        review.CommentsSentiment = response.Value.Sentiment.ToString();
    }
   ```

3. Immediately following the previous code, insert the following to add a custom metric.

   ```csharp
   _telemetryClient.TrackMetric("ReviewPerformed", model.Rating);
   ```

4. Right-click the **AzureCafe** project in Solution Explorer and select **Publish** from the context menu.

    ![Screenshot of the Visual Studio Solution Explorer with the Azure Cafe project selected and the Publish context menu item highlighted.](./media/tutorial-asp-net-custom-metrics/web-project-publish-context-menu.png "Publish Web App")

5. Select **Publish** to promote the new code to the Azure App Service.

    ![Screenshot of the Azure Cafe publish profile screen with the Publish button highlighted.](./media/tutorial-asp-net-custom-metrics/publish-profile.png "Publish profile")

6. Once the publish has succeeded, a new browser window opens to the Azure Cafe web application.

    ![Screenshot of the Azure Cafe web application.](./media/tutorial-asp-net-custom-metrics/azure-cafe-index.png "Azure Cafe web application")

7. Perform various activities in the web application to generate some telemetry.

   1. Select **Details** next to a Cafe to view its menu and reviews.

        ![Screenshot of a portion of the Azure Cafe list with the Details button highlighted.](./media/tutorial-asp-net-custom-metrics/cafe-details-button.png "Azure Cafe Details")

   2. On the Cafe screen, select the **Reviews** tab to view and add reviews. Select the **Add review** button to add a review.

        ![Screenshot of the Cafe details screen with the Add review button highlighted.](./media/tutorial-asp-net-custom-metrics/cafe-add-review-button.png "Add review")

   3. On the Create a review dialog, enter a name, rating, comments, and upload a photo for the review. Once completed, select **Add review**.

        ![Screenshot of the Create a review dialog.](./media/tutorial-asp-net-custom-metrics/create-a-review-dialog.png "Create a review")

   4. Repeat adding reviews as desired to generate more telemetry.

### View metrics in Application Insights

1. Go to the **Application Insights** resource in the [Azure portal](https://portal.azure.com).

    :::image type="content" source="media/tutorial-asp-net-custom-metrics/application-insights-resource-group.png" alt-text="First screenshot of a resource group with the Application Insights resource highlighted." lightbox="media/tutorial-asp-net-custom-metrics/application-insights-resource-group.png":::

2. From the left menu of the Application Insights resource, select **Logs** from beneath the **Monitoring** section. In the **Tables** pane, double-click on the **customMetrics** table, located under the **Application Insights** tree. Modify the query to retrieve metrics for the **ReviewPerformed** custom named metric as follows, then select **Run** to filter the results.

    ```kql
    customMetrics 
    | where name == "ReviewPerformed"
    ```

3. Observe the results display the rating value present in the Review.

## GetMetric

As referenced before, `GetMetric(..)` is the preferred method for sending metrics. In order to make use of this method, we'll be performing some changes to the existing code.

When running the sample code, you'll see that no telemetry is being sent from the application right away. A single telemetry item will be sent by around the 60-second mark.

> [!NOTE]
> GetMetric does not support tracking the last value (i.e. "gauge") or tracking histograms/distributions.

### GetMetric example

1. From the Visual Studio Solution Explorer, locate and open the **HomeController.cs** file.

2. Locate the `CreateReview` method and the code added in the previous [TrackMetric example](#trackmetric-example).

3. Replace the previously added code in _Step 3_ with the following one.

   ```csharp
   var metric = _telemetryClient.GetMetric("ReviewPerformed");
   metric.TrackValue(model.Rating);
   ```

4. Right-click the **AzureCafe** project in Solution Explorer and select **Publish** from the context menu.

    ![Screenshot of the Visual Studio Solution Explorer with the Azure Cafe project selected and the Publish context menu item highlighted.](./media/tutorial-asp-net-custom-metrics/web-project-publish-context-menu.png "Publish Web App")

5. Select **Publish** to promote the new code to the Azure App Service.

    ![Screenshot of the Azure Cafe publish profile with the Publish button highlighted.](./media/tutorial-asp-net-custom-metrics/publish-profile.png "Publish profile")

6. Once the publish has succeeded, a new browser window opens to the Azure Cafe web application.

    ![Screenshot of the Azure Cafe web application.](./media/tutorial-asp-net-custom-metrics/azure-cafe-index.png "Azure Cafe web application")

7. Perform various activities in the web application to generate some telemetry.

   1. Select **Details** next to a Cafe to view its menu and reviews.

        ![Screenshot of a portion of the Azure Cafe list with the Details button highlighted.](./media/tutorial-asp-net-custom-metrics/cafe-details-button.png "Azure Cafe Details")

   2. On the Cafe screen, select the **Reviews** tab to view and add reviews. Select the **Add review** button to add a review.

        ![Screenshot of the Cafe details with the Add review button highlighted.](./media/tutorial-asp-net-custom-metrics/cafe-add-review-button.png "Add review")

   3. On the Create a review dialog, enter a name, rating, comments, and upload a photo for the review. Once completed, select **Add review**.

        ![Screenshot of the Create a review dialog displays.](./media/tutorial-asp-net-custom-metrics/create-a-review-dialog.png "Create a review")

   4. Repeat adding reviews as desired to generate more telemetry.

### View metrics in Application Insights

1. Go to the **Application Insights** resource in the [Azure portal](https://portal.azure.com).

    ![Second screenshot of a resource group with the Application Insights resource highlighted.](./media/tutorial-asp-net-custom-metrics/application-insights-resource-group.png "Resource Group")

2. From the left menu of the Application Insights resource, select **Logs** from beneath the **Monitoring** section. In the **Tables** pane, double-click on the **customMetrics** table, located under the **Application Insights** tree. Modify the query to retrieve metrics for the **ReviewPerformed** custom named metric as follows, then select **Run** to filter the results.

    ```kql
    customMetrics 
    | where name == "ReviewPerformed"
    ```

3. Observe the results display the rating value present in the Review and the aggregated values.

## Multi-dimensional metrics

The examples in the previous section show zero-dimensional metrics. Metrics can also be multi-dimensional. We currently support up to 10 dimensions.

By default multi-dimensional metrics within the Metric explorer experience aren't turned on in Application Insights resources.

>[!NOTE]
> This is a preview feature and additional billing may apply in the future.

### Enable multi-dimensional metrics

To enable multi-dimensional metrics for an Application Insights resource, Select **Usage and estimated costs** > **Custom Metrics** > **Send custom metrics to Azure Metric Store (With dimensions)** > **OK**.

Once you have made that change and send new multi-dimensional telemetry, you'll be able to **Apply splitting**.

> [!NOTE]
> Only newly sent metrics after the feature was turned on in the portal will have dimensions stored.

### Multi-dimensional metrics example

1. From the Visual Studio Solution Explorer, locate and open the **HomeController.cs** file.

2. Locate the `CreateReview` method and the code added in the previous [GetMetric example](#getmetric-example).

3. Replace the previously added code in _Step 3_ with the following one.

   ```csharp
   var metric = _telemetryClient.GetMetric("ReviewPerformed", "IncludesPhoto");
   ```

4. Still in the `CreateReview` method, change to code to match the following one.

    ```csharp
    [HttpPost]
    [ValidateAntiForgeryToken]
    public ActionResult CreateReview(int id, CreateReviewModel model)
    {
        //... additional code removed for brevity
        var metric = _telemetryClient.GetMetric("ReviewPerformed", "IncludesPhoto");

        if ( model.ReviewPhoto != null )
        {
            using (Stream stream = model.ReviewPhoto.OpenReadStream())
            {
                //... additional code removed for brevity
            }
            
            metric.TrackValue(model.Rating, bool.TrueString);
        }
        else
        {
            metric.TrackValue(model.Rating, bool.FalseString);
        }
        //... additional code removed for brevity
    }
    ```

5. Right-click the **AzureCafe** project in Solution Explorer and select **Publish** from the context menu.

    ![Screenshot of the Visual Studio Solution Explorer with the Azure Cafe project selected and the Publish context menu item highlighted.](./media/tutorial-asp-net-custom-metrics/web-project-publish-context-menu.png "Publish Web App")

6. Select **Publish** to promote the new code to the Azure App Service.

    ![Screenshot of the Azure Cafe publish profile with the Publish button highlighted.](./media/tutorial-asp-net-custom-metrics/publish-profile.png "Publish profile")

7. Once the publish has succeeded, a new browser window opens to the Azure Cafe web application.

    ![Screenshot of the Azure Cafe web application.](./media/tutorial-asp-net-custom-metrics/azure-cafe-index.png "Azure Cafe web application")

8. Perform various activities in the web application to generate some telemetry.

   1. Select **Details** next to a Cafe to view its menu and reviews.

        ![Screenshot of a portion of the Azure Cafe list with the Details button highlighted.](./media/tutorial-asp-net-custom-metrics/cafe-details-button.png "Azure Cafe Details")

   2. On the Cafe screen, select the **Reviews** tab to view and add reviews. Select the **Add review** button to add a review.

        ![Screenshot of the Cafe details screen with the Add review button highlighted.](./media/tutorial-asp-net-custom-metrics/cafe-add-review-button.png "Add review")

   3. On the Create a review dialog, enter a name, rating, comments, and upload a photo for the review. Once completed, select **Add review**.

        ![Screenshot of the Create a review dialog.](./media/tutorial-asp-net-custom-metrics/create-a-review-dialog.png "Create a review")

   4. Repeat adding reviews as desired to generate more telemetry.

### View logs in Application Insights

1. Go to the **Application Insights** resource in the [Azure portal](https://portal.azure.com).

    ![Third screenshot of a resource group with the Application Insights resource highlighted.](./media/tutorial-asp-net-custom-metrics/application-insights-resource-group.png "Resource Group")

2. From the left menu of the Application Insights resource, select **Logs** from beneath the **Monitoring** section. In the **Tables** pane, double-click on the **customMetrics** table, located under the **Application Insights** tree. Modify the query to retrieve metrics for the **ReviewPerformed** custom named metric as follows, then select **Run** to filter the results.

    ```kql
    customMetrics 
    | where name == "ReviewPerformed"
    ```

3. Observe the results display the rating value present in the Review and the aggregated values.

4. In order to better observe the **IncludesPhoto** dimension, we can extract it into a separate variable (column) by using the following query.

    ```kql
    customMetrics 
    | extend IncludesPhoto = tobool(customDimensions.IncludesPhoto)
    | where name == "ReviewPerformed"
    ```

5. Since we reused the same custom metric name has before, results with and without the custom dimension will be displayed. In order to avoid that, we'll update the query to match the following one.

    ```kql
    customMetrics 
    | extend IncludesPhoto = tobool(customDimensions.IncludesPhoto)
    | where name == "ReviewPerformed" and isnotnull(IncludesPhoto)
    ```

### View metrics in Application Insights

1. Go to the **Application Insights** resource in the [Azure portal](https://portal.azure.com).

    ![Fourth screenshot of a resource group with the Application Insights resource highlighted.](./media/tutorial-asp-net-custom-metrics/application-insights-resource-group.png "Resource Group")

2. From the left menu of the Application Insights resource, select **Metrics** from beneath the **Monitoring** section.

3. For **Metric Namespace**, select **azure.applicationinsights**.

    ![Screenshot of metrics explorer with the Metric Namespace highlighted.](./media/tutorial-asp-net-custom-metrics/metrics-explorer-namespace.png "Metric Namespace")

4. For **Metric**, select **ReviewPerformed**.

    ![Screenshot of metrics explorer with the Metric highlighted.](./media/tutorial-asp-net-custom-metrics/metrics-explorer-metric.png "Metric")

5. However, you'll notice that you aren't able to split the metric by your new custom dimension, or view your custom dimension with the metrics view. Select **Apply Splitting**.

    ![Screenshot of the Apply Splitting button.](./media/tutorial-asp-net-custom-metrics/apply-splitting.png "Splitting")

6. For the custom dimension **Values** to use, select **IncludesPhoto**.

    ![Screenshot illustrating splitting using a custom dimension](./media/tutorial-asp-net-custom-metrics/splitting-dimension.png "Splitting dimension")

## Next steps

* [Metric Explorer](../essentials/metrics-getting-started.md)
* How to enable Application Insights for [ASP.NET Core Applications](./asp-net-core.md)
