---
title: Monitor apps using Application Live View with the Azure Spring Apps Enterprise plan
description: Learn how to monitor apps using Application Live View with the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: yuwzho
ms.service: spring-apps
ms.topic: how-to
ms.date: 12/01/2022
ms.custom: devx-track-java, event-tier1-build-2022
---

# Monitor apps using Application Live View with the Azure Spring Apps Enterprise plan

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

[Application Live View for VMware Tanzu](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/1.4/tap/app-live-view-about-app-live-view.html) is a lightweight insights and troubleshooting tool that helps app developers and app operators look inside running apps.

Application Live View provides visual insights into running apps by inspecting Spring Boot Actuator information. It provides a live view of the data from inside the app only. Application Live View doesn't store any of the app data for further analysis or historical views. The easy-to-use interface lets you troubleshoot, learn, and maintain an overview of certain aspects of the apps. It provides a certain level of control to users to let them change some parameters such as log levels and environment properties of running apps.

This article describes the Application Live View UI features, and the pages and views included in the Application Live View user interface.

## Prerequisites

- Application Live View for VMware Tanzu. For more information, see [Use Application Live View](./how-to-use-application-live-view.md).

## Details page

The **Details** page is the default page loaded in the **Live View** section. This page gives a tabular overview containing the following properties:

- App name
- Instance ID
- Location
- Actuator location
- Health endpoint
- Direct actuator access
- Framework
- Version
- New patch version
- New major version
- Build version

You can navigate between information categories by selecting from the drop-down at the top right corner of the page.

:::image type="content" source="media/monitor-apps-by-application-live-view/details.png" alt-text="Screenshot of the Details page." lightbox="media/monitor-apps-by-application-live-view/details.png":::

## Health page

To navigate to the **Health** page, select the **Health** option from the **Information Category** drop-down. The health page provides detailed information about the health of the app.

The **Health** page includes the following features:

- View a list of all the components that make up the health of the app, such as readiness, liveness, and disk space.
- View a display of the status and details associated with each of the components.

:::image type="content" source="media/monitor-apps-by-application-live-view/health.png" alt-text="Screenshot of the Health page." lightbox="media/monitor-apps-by-application-live-view/health.png":::

## Environment page

To navigate to the **Environment** page, select the **Environment** option from the **Information Category** drop-down. The environment page contains details of the app's environment. It contains properties including, but not limited to, system properties, environment variables, and configuration properties such as `application.properties` in a Spring Boot app.

The **Environment** page includes the following features:

- Search for a property or values using the search feature.
- View all occurrences of a specific property using the search icon at the right corner. You can find the property key quickly, without manually typing in the search field. Selecting this button filters the page to that property name.
- Probe the app to refresh all of the environment properties by selecting **Refresh Scope** at the top right corner of the page.
- Edit existing properties by selecting **override** in the row and editing the value. After the value is saved, you can see the updated property in the **Applied overrides** section at the top of the page.
- Reset the environment property to the original state by selecting **Reset**.
- Add new environment properties to the app, and edit or remove overridden environment variables in the **Applied Overrides** section.

:::image type="content" source="media/monitor-apps-by-application-live-view/environment.png" alt-text="Screenshot of the Environment page." lightbox="media/monitor-apps-by-application-live-view/environment.png":::

> [!NOTE]
> You must set `management.endpoint.env.post.enabled=true` in the app config properties of the app, and a corresponding, editable environment must be present in the app.

## Log Levels page

To navigate to the **Log Levels** page, select the **Log Levels** option from the **Information Category** drop-down. The log levels page provides access to the app's loggers and the configuration of their levels.

The **Log Levels** page includes the following features:

- Configure the log levels, such as `INFO`, `DEBUG`, and `TRACE`, in real-time from the UI.
- Search for a package and edit its respective log level.
- Configure the log levels at a specific class and package.
- Deactivate all the log levels by modifying the log level of root logger to `OFF`.
- Display the changed log levels using the **Changes Only** toggle.
- Search by logger name using the search feature.
- Reset the log levels to the original state by selecting **Reset**.
- Reset all the loggers to default state by selecting **Reset All** at the top right corner of the page.

:::image type="content" source="media/monitor-apps-by-application-live-view/log-levels.png" alt-text="Screenshot of the Log Levels page." lightbox="media/monitor-apps-by-application-live-view/log-levels.png":::

## Threads page

To navigate to the **Threads** page, select the **Threads** option from the **Information Category** drop-down. This page displays all details related to JVM threads and running processes of the app. This tracks live threads and daemon threads real-time. It's a snapshot of different thread states.

The **Threads** page includes the following features:

- Navigate to a thread state to display all the information about a particular thread and its stack trace.
- Search for threads by thread ID or state using the search feature.
- Refresh to the latest state of the threads using the refresh icon.
- View more thread details by selecting the thread ID.
- Download a thread dump for analysis purposes.

:::image type="content" source="media/monitor-apps-by-application-live-view/threads-live.png" alt-text="Screenshot of the Threads page in the Application Live View UI." lightbox="media/monitor-apps-by-application-live-view/threads-live.png":::

:::image type="content" source="media/monitor-apps-by-application-live-view/threads-overlay.png" alt-text="Screenshot of the Threads page in the UI with an overlay providing more details for a specific thread." lightbox="media/monitor-apps-by-application-live-view/threads-overlay.png":::

## Memory page

To navigate to the **Memory** page, select the **Memory** option from the **Information Category** drop-down.

The **Memory** page highlights the memory use inside of the JVM. It displays a graphical representation of the different memory regions within heap and non-heap memory. For Spring Boot apps running on a JVM, the **Memory** page visualizes data from inside of the JVM, giving you memory insights into the app in contrast to outside information about the Kubernetes pod level.

The **Memory** page includes the following features:

- View real-time graphs that display a stacked overview of the different spaces in memory along with the total memory used and total memory size.
- View graphs to display the GC pauses and GC events.
- Download heap dump data using the **Heap Dump** button at the top right corner.

:::image type="content" source="media/monitor-apps-by-application-live-view/memory.png" alt-text="Screenshot of the Memory page." lightbox="media/monitor-apps-by-application-live-view/memory.png":::

> [!NOTE]
> This graphical visualization happens in real-time and shows real-time data only. As mentioned previously, the Application Live View features do not store any information. That means the graphs visualize the data over time only for as long as you stay on that page.

## Request Mappings page

To navigate to the **Request Mappings** page, select the **Request Mappings** option from the **Information Category** drop-down. This page provides information about the app's request mappings. For each mapping, the page displays the request handler method.

The **Request Mappings** page includes the following features:

- View more details about the request mapping, such as the header metadata of the app including the `produces`, `consumes`, and `HTTP` methods, by selecting the mapping.
- Search on the request mapping or the method.
- View the actuator related mappings for the app using the toggle **/actuator/\*\* Request Mappings**

> [!NOTE]
> When the app actuator endpoint is exposed on `management.server.port`, the app does not return any actuator request mappings data in the context. In this case, a message is displayed when the actuator toggle is enabled.

:::image type="content" source="media/monitor-apps-by-application-live-view/request-mappings-live.png" alt-text="Screenshot of the Request Mappings page in the Application Live View UI." lightbox="media/monitor-apps-by-application-live-view/request-mappings-live.png":::

:::image type="content" source="media/monitor-apps-by-application-live-view/request-mappings-overlay.png" alt-text="Screenshot of the Request Mappings page in the UI with an overlay pane providing more details about a specific request." lightbox="media/monitor-apps-by-application-live-view/request-mappings-overlay.png":::

## HTTP Requests page

To navigate to the **HTTP Requests** page, select the **HTTP Requests** option from the **Information Category** drop-down. The HTTP Requests page provides information about HTTP request-response exchanges to the app. The graph visualizes the requests per second indicating the response status of all the requests.

The **HTTP Requests** page includes the following features:

- Filter on the response status, which includes `info`, `success`, `redirects`, `client-errors`, and `server-errors`.
- View the trace data in detail in a table format with metrics such as timestamp, method, path, status, content-type, length, and time.
- Filter the traces based on the search field value using the search feature on the table.
- View more details of the request such as method, headers, and response of the app by selecting the timestamp.
- Select the refresh icon above the graph to load the latest traces for the app.
- Display the actuator related traces for the app using the toggle **/actuator/\*\*** at the top right corner of the page.

> [!NOTE]
> When the app actuator endpoint is exposed on `management.server.port`, no actuator HTTP Traces data is returned for the app. In this case, a message is displayed when the actuator toggle is enabled.

:::image type="content" source="media/monitor-apps-by-application-live-view/http-requests-live.png" alt-text="Screenshot of the HTTP Requests page in the Application Live View UI." lightbox="media/monitor-apps-by-application-live-view/http-requests-live.png":::

:::image type="content" source="media/monitor-apps-by-application-live-view/http-requests-overlay.png" alt-text="Screenshot of the HTTP Requests page in the UI with an overlay providing more details about a specific request." lightbox="media/monitor-apps-by-application-live-view/http-requests-overlay.png":::

## Caches page

To navigate to the **Caches** page, select the **Caches** option from the **Information Category** drop-down. The **Caches** page provides access to the app's caches. It gives the details of the cache managers associated with the app, including the fully qualified name of the native cache.

The **Caches** page includes the following features:

- Search for a specific cache or cache manager using the search feature.
- Remove individual caches by selecting **Evict**, which causes the cache to be cleared.
- Remove all the caches by selecting **Evict All**. If there are no cache managers for the app, a message is displayed `No cache managers available for the application`.

:::image type="content" source="media/monitor-apps-by-application-live-view/caches.png" alt-text="Screenshot of the HTTP Caches page in the Application Live View UI." lightbox="media/monitor-apps-by-application-live-view/caches.png":::

## Configuration Properties page

To navigate to the **Configuration Properties** page, select the **Configuration Properties** option from the **Information Category** drop-down. The **Configuration Properties** page provides information about the configuration properties of the app. For Spring Boot, it displays the app's `@ConfigurationProperties` beans. It gives a snapshot of all the beans and their associated configuration properties.

The **Configuration Properties** page includes the following feature:

- Look up a key-value for a property or bean name using the search feature.

:::image type="content" source="media/monitor-apps-by-application-live-view/config-props.png" alt-text="Screenshot of the Configuration Properties page in the Application Live View UI." lightbox="media/monitor-apps-by-application-live-view/config-props.png":::

## Conditions page

To navigate to the **Conditions** page, select the **Conditions** option from the **Information Category** drop-down. The conditions evaluation report provides information about the evaluation of conditions on configuration and auto-configuration classes. For Spring Boot, the conditions evaluation report gives you a clear view of all the beans configured in the app.

The **Conditions** page includes the following features:

- Select the bean name to view the conditions and the reason for the conditional match. If beans aren't configured, it shows both the matched and unmatched conditions of the bean, if any. In addition to conditions, it also displays names of unconditional auto configuration classes, if any.
- Filter on the beans and the conditions using the search feature.

:::image type="content" source="media/monitor-apps-by-application-live-view/conditions.png" alt-text="Screenshot of the Conditions page in the Application Live View UI." lightbox="media/monitor-apps-by-application-live-view/conditions.png":::

## Scheduled Tasks page

To navigate to the **Scheduled Tasks** page, select the **Scheduled Tasks** option from the **Information Category** drop-down. The **Scheduled Tasks** page provides information about the app's scheduled tasks, including cron tasks, fixed delay tasks and fixed rate tasks, custom tasks and the properties associated with them.

The **Scheduled Tasks** page includes the following feature:

- Search for a particular property or a task in the search bar to retrieve the task or property details.

:::image type="content" source="media/monitor-apps-by-application-live-view/scheduled-tasks.png" alt-text="Screenshot of the Scheduled Tasks page in the Application Live View UI." lightbox="media/monitor-apps-by-application-live-view/scheduled-tasks.png":::

## Beans page

To navigate to the **Beans** page, select the **Beans** option from the **Information Category** drop-down. The **Beans** page provides information about a list of all app beans and its dependencies. It displays the information about the bean type, dependencies, and its resource.

The **Beans** page includes the following feature:

- Search by the bean name or its corresponding fields.

:::image type="content" source="media/monitor-apps-by-application-live-view/beans.png" alt-text="Screenshot of the Beans page in the Application Live View UI." lightbox="media/monitor-apps-by-application-live-view/beans.png":::

## Metrics Page

To navigate to the **Metrics** page, select the **Metrics** option from the **Information Category** drop-down. The **Metrics** page provides access to app metrics information.

The **Metrics** page includes the following features:

- Choose from the list of various metrics available for the app such as `jvm.memory.used`, `jvm.memory.max`, `http.server.request`. After you choose the metric, you can view the associated tags.
- Choose the value of each of the tags based on filtering criteria.
- Select **Add Metric** to add the metric, which is refreshed every five seconds by default.
- Pause the auto refresh feature by disabling the **Auto Refresh** toggle.
- Refresh the metrics manually by selecting **Refresh All**.
- Change the format of the metric value according to your needs.
- Delete a particular metric by selecting the minus symbol in the same row.

:::image type="content" source="media/monitor-apps-by-application-live-view/metrics.png" alt-text="Screenshot of the Metrics page in the Application Live View UI." lightbox="media/monitor-apps-by-application-live-view/metrics.png":::

## Actuator page

To navigate to the **Actuator** page, select the **Actuator** option from the **Information Category** drop-down. The **Actuator** page provides a tree view of the actuator data.

The **Actuator** page includes the following feature:

- Choose from a list of actuator endpoints and parse through the raw actuator data.

:::image type="content" source="media/monitor-apps-by-application-live-view/actuator.png" alt-text="Screenshot of the Actuator page in the Application Live View UI." lightbox="media/monitor-apps-by-application-live-view/actuator.png":::

## Next steps

- [Azure Spring Apps](index.yml)
