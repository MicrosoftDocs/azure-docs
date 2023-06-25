---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 06/20/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to Diagnosis and investigate issues with Basic/Standard plan.

[!INCLUDE [diagnosis-and-investigate-issues-with-basic-standard-plan](includes/tutorial-diagnosis-and-investigate-issues/diagnosis-and-investigate-issues-with-basic-standard-plan.md)]

-->

## 2. Create a private dashboard instance

This section provides the steps to create a custom dashboard.
If you choose to use the built-in Dashboard of Application Insights created by Azure Spring Apps,
you can skip the creation of the dashboard and go directly to the custom metrics chart section, see more from [Application Insights Overview dashboard](../../../azure-monitor/app/overview-dashboard.md).

1. From the Azure portal menu, select **Dashboard**. Your default view might already be set to dashboard.

   :::image type="content" source="../../media/tutorial-diagnosis-and-investigate-issues/portal-menu-dashboard.png" alt-text="Screenshot of the Azure portal with Dashboard selected.":::

1. Select **Create**, then select **Custom** to create a blank dashboard.

   :::image type="content" source="../../media/tutorial-diagnosis-and-investigate-issues/create-dashboard-options.png" alt-text="Screenshot of the New dashboard options.":::

   > [!NOTE]
   > You can also choose a template based on Application Insights here to quickly create a usable dashboard.

1. Enter a name for the dashboard, and then select **Save**.
   This action opens the **Tile Gallery**, from which you can select tiles, and an empty grid where you'll arrange the tiles.

> [!NOTE]
> You can allow others to view your dashboard, see more from [Share a Azure dashboard](../../../azure-portal/azure-portal-dashboard-share-access.md).

## 3. Configure availability monitoring

This section provides the steps to check the liveness for each app on Azure Spring Apps.

1. Go to the Azure Spring Apps instance overview page.

1. Select **Application Insights** in the left navigational menu, select the **Application Insights** to go to the Application Insights overview page.

1. Select **Availability** in the left navigational menu, select the **Add Standard test** to add a test.

1. On the **Create Standard test** page, for **Test name**, enter `api-gateway`, 
   for **URL**, enter `https://[your-Azure-Spring-Apps-instance-name]-api-gateway.azuremicroservices.io/actuator/health/liveness` for the corresponding URL, 
   extend the **Success criteria**, check the **Content match** box, and enter `UP` for **Content must contain**, then select **Save** to finish the configuration.

1. Repeat the above steps to add other tests with below test names and URLs.

   | Test name         | URL                                                                                                                    | Content must contain |
   |-------------------|------------------------------------------------------------------------------------------------------------------------|----------------------|
   | admin-server      | https://[your-Azure-Spring-Apps-instance-name]-admin-server.azuremicroservices.io/actuator/health/liveness             | UP                   |
   | customers-service | https://[your-Azure-Spring-Apps-instance-name]-api-gateway.azuremicroservices.io/api/customer/actuator/health/liveness | UP                   |
   | vets-service      | https://[your-Azure-Spring-Apps-instance-name]-api-gateway.azuremicroservices.io/api/vet/actuator/health/liveness      | UP                   |
   | visits-service    | https://[your-Azure-Spring-Apps-instance-name]-api-gateway.azuremicroservices.io/api/visit/actuator/health/liveness    | UP                   |

## 4 Set up Action Groups and Alerts

This section provides the steps to set up action groups and alert rules to monitor your production application. The alert rules bind metric patterns with the action groups on the target resource, metric, etc.

### 4.1 Set up Action Groups

1. Go to the Azure Spring Apps instance overview page.

1. Select **Alert** in the left navigational menu, select the **Action groups** to go to the Action groups list page, select the **Create** to create action group.

1. On the **Create action group** page, select the subscription and resource group you want to use, 
   for **Action group name**, enter `email-notifacation`, for **Short name**, enter `email`, for **Region**, select the region you want to use.

   :::image type="content" source="../../media/tutorial-diagnosis-and-investigate-issues/create-email-notification-action-group.png" alt-text="Screenshot of the Azure portal with Action group creation.":::

1. Navigate to the **Notification** tab on the **Create action group** page, for **Notification type**, select `Email/SMS message/Push/Voice`, for **Name**, enter `email-support`.

1. On the **Email/SMS message/Push/Voice** page, check the **Email** box, enter your production email address for **Email**, then select **OK** to finish the configuration.

   :::image type="content" source="../../media/tutorial-diagnosis-and-investigate-issues/email-action-creation.png" alt-text="Screenshot of the Azure portal with email notification action group.":::

1. You can also add other notification types if you want, such as SMS, Push, Voice, etc.

1. Select **Review and Create** to review your selections. Select **Create** to create the action group.

### 4.2 Set up Alert rules

1. Go to the Azure Spring Apps instance overview page.

1. Select **Alert** in the left navigational menu, select the **Alert rules** to go to the Alert rules list page, select the **Create** to create alert rule.

1. On the **Create an alert rule** page, for **signal name**, select the dropdown list, select **See all signals**, select `App CPU Usage` in the *Metrics* area and select **Apply**;
   for the **Split by dimensions** section, select the dropdown list to choose `App` for **Dimension name**, use the default `=` for **Operator**,
   select the dropdown list to choose `Select all` for **Dimension values**

   :::image type="content" source="../../media/tutorial-diagnosis-and-investigate-issues/alert-rule-creation-app-cpu-usage.png" alt-text="Screenshot of the Azure portal with alert rule condition creation.":::

1. Navigate to the **Actions** tab on the **Create an alert rule** page, select **Select action groups**,
   on the **Select action groups** page, search your email action group name `email-notifacation`, check the corresponding action group, then select **Select** to finish the configuration.

   :::image type="content" source="../../media/tutorial-diagnosis-and-investigate-issues/alert-rule-creation-select-action.png" alt-text="Screenshot of the Azure portal with alert rule action group selection.":::

1. Navigate to the **Details** tab on the **Create an alert rule** page, enter `app-cpu-high-alert` for **Alert rule name**,

1. Select **Review and Create** to review your selections. Select **Create** to create the alert rule.

1. Create an alert rule for `App Memory Usage` metric signal, and repeat the previous steps, use the below inputs:

   - **Signal name**: `App Memory Usage`
   - **Threshold value**: `90`
   - **Dimension name**: `App`
   - **Dimension values**: Select all.
   - **Action group name**: `email-notification`
   - **Alert rule name**: `app-memory-high-alert`

1. Create an alert rule for `App Network In` metric signal, and repeat the previous steps, use the below inputs:

   - **Signal name**: `App Network In`
   - **Unit**: `GB`
   - **Threshold value**: `1`
   - **Dimension name**: `App`
   - **Dimension values**: `api-gateway`
   - **Action group name**: `email-notification`
   - **Alert rule name**: `network-in-high-alert`

1. After the alert rule creation, you can see the alert rules list as below:

   :::image type="content" source="../../media/tutorial-diagnosis-and-investigate-issues/alert-rule-list.png" alt-text="Screenshot of the Azure portal with alert rule list.":::

## 5. Custom your dashboard

This section provides the steps to customize your production application dashboard.

### 5.1 Pin blade to dashboard 

#### Pin blades from Azure Spring Apps

1. Go to the Azure Spring Apps instance overview page.

1. Select **Alert** in the left navigational menu, on the **Alerts** page, select the pin icon in this page header.

1. On the **Pin to dashboard** page, select the dashboard you created in previous step, select **Pin** to pin the quickstart chart to the dashboard.

   :::image type="content" source="../../media/tutorial-diagnosis-and-investigate-issues/pin-alerts-blade-to-dashboard.png" alt-text="Screenshot of the Azure portal with pin alerts to dashboard.":::

#### Pin blades from Application Insights

1. Go to the Azure Spring Apps instance overview page.

1. Select **Application Insights** in the left navigational menu, select the **Application Insights** to go to the Application Insights overview page.

1. Select **Application map** in the left navigational menu, select **Pin** to pin the quickstart chart to the dashboard.
 
1. Select **Live metrics** in the left navigational menu, select **Pin** to pin the quickstart chart to the dashboard.

1. Select **Failures** in the left navigational menu, select **Pin** to pin the quickstart chart to the dashboard.

1. Select **Performance** in the left navigational menu, select **Pin** to pin the quickstart chart to the dashboard.

### 5.2 Add charts from Azure Spring Apps

#### Add App CPU Usage chart

1. Go to the Azure Spring Apps instance overview page.

1. Select **Metrics** in the left navigational menu, Select the edit icon in the chart title, rename the chart title to `App CPU Usage`.

1. Select **Add metric**, for **Metric**, select the corresponding dropdown list to choose the **App CPU Usage** metric, select `Avg` for **Aggregation**.

1. Select **Apply splitting**, for **Values**, select the corresponding dropdown list to check the **App** box.

1. Select **Save to dashboard** to open the dropdown list, then select **Pin to dashboard**, on the **Pin to dashboard** page, select the dashboard you created in previous step, select **Pin** to pin the quickstart chart to the dashboard.

   :::image type="content" source="../../media/tutorial-diagnosis-and-investigate-issues/pin-chart-app-cpu-usage.png" alt-text="Screenshot of the Azure portal with pin app cpu usage to dashboard.":::

#### Add App Memory Usage chart

1. Repeat with the previous section steps for the **App Memory Usage** metric, pin the **App Memory Usage** chart to the dashboard.

   :::image type="content" source="../../media/tutorial-diagnosis-and-investigate-issues/pin-chart-app-memory-usage.png" alt-text="Screenshot of the Azure portal with pin app memory usage to dashboard.":::

#### Add App Network In chart

1. Repeat with the previous section steps for the **App Network In** metric, 
   select **Add filter** for an extra step, for **Property**, select the corresponding dropdown list to choose the **App**, select `=` for **Operator**, select `admin-server` and `api-gateway` for **Values**, 
   then pin the **App Network In Usage** chart to the dashboard.

   :::image type="content" source="../../media/tutorial-diagnosis-and-investigate-issues/pin-chart-app-network-in-usage.png" alt-text="Screenshot of the Azure portal with pin app network in usage to dashboard.":::

### 5.3 Add charts from Application Insights

#### Add Availability chart

1. Go to the Azure Spring Apps instance overview page.

1. Select **Application Insights** in the left navigational menu, select the **Application Insights** to go to the Application Insights overview page.

1. Select **Metrics** in the left navigational menu, Select the edit icon in the chart title, rename the chart title to `Availability`.

1. Select **Add metric**, for **Metric**, select the corresponding dropdown list to choose the **Availability** metric under the **Application Insights standard metrics** namespace, select `Avg` for **Aggregation**.

1. Select **Apply splitting**, for **Values**, select the corresponding dropdown list to check the **Test name** box.

1. Select **Save to dashboard** to open the dropdown list, then select **Pin to dashboard**, on the **Pin to dashboard** page, select the dashboard you created in previous step, select **Pin** to pin the quickstart chart to the dashboard.

   :::image type="content" source="../../media/tutorial-diagnosis-and-investigate-issues/pin-chart-availability.png" alt-text="Screenshot of the Azure portal with pin availability to dashboard.":::

#### Add Server exceptions and Dependency failures chart

1. Repeat with the previous section steps for the **Server exception** and Dependency failures metrics under the **Application Insights standard metrics** namespace, pin the **Server exceptions and Dependency failures** chart to the dashboard.

   :::image type="content" source="../../media/tutorial-diagnosis-and-investigate-issues/pin-chart-exceptions-and-failures.png" alt-text="Screenshot of the Azure portal with pin exceptions and failures to dashboard.":::

#### Add Failed request chart

1. Repeat with the previous section steps for the **Failed requests** metric under the **Application Insights standard metrics** namespace, pin the **Failed request** chart to the dashboard.

   :::image type="content" source="../../media/tutorial-diagnosis-and-investigate-issues/pin-chart-failed-requests.png" alt-text="Screenshot of the Azure portal with pin failed requests to dashboard.":::

#### Add Request count chart

1. Repeat with the previous section steps for the **Server requests** metric under the **Application Insights standard metrics** namespace, pin the **Request count** chart to the dashboard.

   :::image type="content" source="../../media/tutorial-diagnosis-and-investigate-issues/pin-chart-server-requests.png" alt-text="Screenshot of the Azure portal with pin server requests to dashboard.":::

#### Add Response time chart

1. Repeat with the previous section steps for the **Server response time** metric under the **Application Insights standard metrics** namespace, add a filter to filter the **Cloud role name** with **api-gateway**, pin the **Response time** chart to the dashboard.

   :::image type="content" source="../../media/tutorial-diagnosis-and-investigate-issues/pin-chart-response-time.png" alt-text="Screenshot of the Azure portal with pin failed requests to dashboard.":::

#### Add Active MySQL connections chart

1. Repeat with the previous section steps for the **hikaricp_connection_active** metric under the **Log-based metrics** namespace, pin the **Active MySQL connections** chart to the dashboard.

   :::image type="content" source="../../media/tutorial-diagnosis-and-investigate-issues/pin-chart-connection-active.png" alt-text="Screenshot of the Azure portal with pin failed requests to dashboard.":::

### 5.3 View dashboard

Go to your private `PetClinic` dashboard page, edit your tiles with dashboard, edit the size of the tiles in your dashboard as needed to match the monitoring.

:::image type="content" source="../../media/tutorial-diagnosis-and-investigate-issues/dashboard-page.png" alt-text="Screenshot of the Azure portal with dashboard.":::
