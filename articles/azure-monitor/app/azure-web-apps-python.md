---
title: Monitor Azure app services performance Python | Microsoft Docs
description: Application performance monitoring for Azure app services using Python. Chart load and response time, dependency information, and set alerts on performance.
ms.topic: conceptual
ms.date: 10/31/2023
ms.devlang: python
ms.custom: "devx-track-python"
ms.reviewer: abinetabate
---

# Application Monitoring for Azure App Service and Python (preview)

Monitor your Python web applications on Azure App Services without modifying the code. This guide shows you how to enable Azure Monitor Application Insights and offers tips for automating large-scale deployments.

The integration instruments popular Python libraries in your code, letting you automatically gather and correlate dependencies, logs, and metrics. After instrumenting, you collect calls and metrics from these Python libraries:

| Instrumentation | Supported library Name | Supported versions |
| --------------- | ---------------------- | ------------------ |
| [OpenTelemetry Django Instrumentation][ot_instrumentation_django] | [`django`][pypi_django] | [link][ot_instrumentation_django_version]
| [OpenTelemetry FastApi Instrumentation][ot_instrumentation_fastapi] | [`fastapi`][pypi_fastapi] | [link][ot_instrumentation_fastapi_version]
| [OpenTelemetry Flask Instrumentation][ot_instrumentation_flask] | [`flask`][pypi_flask] | [link][ot_instrumentation_flask_version]
| [OpenTelemetry Psycopg2 Instrumentation][ot_instrumentation_psycopg2] | [`psycopg2`][pypi_psycopg2] | [link][ot_instrumentation_psycopg2_version]
| [OpenTelemetry Requests Instrumentation][ot_instrumentation_requests] | [`requests`][pypi_requests] | [link][ot_instrumentation_requests_version]
| [OpenTelemetry UrlLib Instrumentation][ot_instrumentation_urllib] | [`urllib`][pypi_urllib] | All
| [OpenTelemetry UrlLib3 Instrumentation][ot_instrumentation_urllib3] | [`urllib3`][pypi_urllib3] | [link][ot_instrumentation_urllib3_version]

> [!NOTE]
> If using Django, see the additional[Django Instrumentation](#django-instrumentation) section in this article.

Logging telemetry is also collected with your logs that use the standard Python logging library.

## Enable Application Insights

The easiest way to monitor Python applications on Azure App Services is through the Azure portal.

Activating monitoring in the Azure portal automatically instruments your application with Application Insights and requires no code changes.

> [!NOTE]
> If both autoinstrumentation monitoring and manual SDK-based instrumentation are detected, only the manual instrumentation settings will be honored. This is to prevent duplicate data from being sent. To learn more about this, check out the [troubleshooting section](#troubleshooting) in this article.

### Autoinstrumentation through Azure portal

For a complete list of supported autoinstrumentation scenarios, see [Supported environments, languages, and resource providers](codeless-overview.md#supported-environments-languages-and-resource-providers).

Toggle on monitoring for your Python apps in Azure App Service with no code changes required.

Application Insights for Python integrates with Azure App Service on Linux for both code-based and custom containers, and with App Service on Windows for code-based apps.

The integration is in public preview. It adds the Python SDK, which is in GA.

1. **Select Application Insights** in the Azure control panel for your app service, then select **Enable**.

    :::image type="content"source="./media/azure-web-apps/enable.png" alt-text="Screenshot of Application Insights tab with enable selected." lightbox="./media/azure-web-apps/enable.png"::: 

2. Choose to create a new resource, or select an existing Application Insights resource for this application.

    > [!NOTE]
    > When you select **OK** to create the new resource you will be prompted to **Apply monitoring settings**. Selecting **Continue** will link your new Application Insights resource to your app service, doing so will also **trigger a restart of your app service**.

    :::image type="content"source="./media/azure-web-apps/change-resource.png" alt-text="Screenshot of Change your resource dropdown." lightbox="./media/azure-web-apps/change-resource.png":::

3. Once you've specified which resource to use, you're all set to go. 

    :::image type="content"source="./media/azure-web-apps-python/app-service-python.png" alt-text="Screenshot of instrument your application." lightbox="./media/azure-web-apps-python/app-service-python.png":::


<!-- TODO: Leave out prior to snippet injection -->
<!-- ## Enable client-side monitoring

To enable client-side monitoring for your Python application, you need to [manually add the client-side JavaScript SDK to your application](./javascript.md). -->

## Configuration

You can configure with [OpenTelemetry environment variables][ot_env_vars] such as:

| **Environment Variable**                       | **Description**                                     |
|--------------------------------------------|----------------------------------------------------|
| [OTEL_SERVICE_NAME][opentelemetry_spec_service_name], [OTEL_RESOURCE_ATTRIBUTES][opentelemetry_spec_resource_attributes] | Specifies the OpenTelemetry [resource][opentelemetry_spec_resource] associated with your application. |
| `OTEL_LOGS_EXPORTER` | If set to `None`, disables collection and export of logging telemetry. |
| `OTEL_METRICS_EXPORTER` | If set to `None`, disables collection and export of metric telemetry. |
| `OTEL_TRACES_EXPORTER` | If set to `None`, disables collection and export of distributed tracing telemetry. |
| `OTEL_BLRP_SCHEDULE_DELAY` | Specifies the logging export interval in milliseconds. Defaults to 5000. |
| `OTEL_BSP_SCHEDULE_DELAY` | Specifies the distributed tracing export interval in milliseconds. Defaults to 5000. |
| `OTEL_TRACES_SAMPLER_ARG` | Specifies the ratio of distributed tracing telemetry to be [sampled][application_insights_sampling]. Accepted values range from 0 to 1. The default is 1.0, meaning no telemetry is sampled out. |
| `OTEL_PYTHON_DISABLED_INSTRUMENTATIONS` | Specifies which OpenTelemetry instrumentations to disable. When disabled, instrumentations aren't executed as part of Auto-Instrumentation. However, you can still manually instrument them with `instrument()`. Accepts a comma-separated list of lowercase [library names](#application-monitoring-for-azure-app-service-and-python-preview). For example, set it to `"psycopg2,fastapi"` to disable the Psycopg2 and FastAPI instrumentations. It defaults to an empty list, enabling all supported instrumentations. |

### Add a community instrumentation library

You can collect more data automatically when you include instrumentation libraries from the OpenTelemetry community.

[!INCLUDE [azure-monitor-app-insights-opentelemetry-support](../includes/azure-monitor-app-insights-opentelemetry-community-library-warning.md)]

To add a community OpenTelemetry Instrumentation Library (not officially supported/included in Azure Monitor distro), install the OpenTelemetry Instrumentation library via your app's `requirements.txt` file. OpenTelemetry Auto-Instrumentation will automatically pick up all installed instrumentaiton libraries and attempt instrumentation. The list of community instrumentation libraries can be found [here](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation).

## Automate monitoring

In order to enable telemetry collection with Application Insights, only the following Application settings need to be set:

<!-- TODO Figure out why Python does not show the same -->

:::image type="content"source="./media/azure-web-apps-python/application-settings-python.png" alt-text="Screenshot of App Service Application Settings with available Application Insights settings." lightbox="./media/azure-web-apps-python/application-settings-python.png":::

### Application settings definitions

| App setting name | Definition | Value |
|------------------|------------|------:|
| APPLICATIONINSIGHTS_CONNECTION_STRING | Connections string for your Application Insights resource | Example: abcd1234-ab12-cd34-abcd1234abcd |
| ApplicationInsightsAgent_EXTENSION_VERSION | Main extension, which controls runtime monitoring. | `~3` |

> [!NOTE]
> Profiler and snapshot debugger are not available for Python applications

[!INCLUDE [azure-web-apps-arm-automation](../../../includes/azure-monitor-app-insights-azure-web-apps-arm-automation.md)]

## Django Instrumentation

In order to use the OpenTelemetry Django Instrumentation, you need to set the `DJANGO_SETTINGS_MODULE` environment variable in the App Service settings to point from your app folder to your settings module. See the [Django documentation][django_settings_module_docs] for more information.

## Frequently asked questions

[!INCLUDE [azure-web-apps-troubleshoot](../../../includes/azure-monitor-app-insights-azure-web-apps-troubleshoot.md)]

## Troubleshooting

Here's our step-by-step troubleshooting guide for monitoring Python applications on Azure App Services using extensions/agents.

### Step 1: Confirm that App Service Autoinstrumentation is enabled

Check that `ApplicationInsightsAgent_EXTENSION_VERSION` app setting is set to a value of `~3`.
### Step 2: Check Autoinstrumentation diagnostics and status logs
Navigate to */var/log/applicationinsights/* and open *status.json*.

Confirm that `AgentInitializedSuccessfully` is set to true and `IKey` to have a valid iKey.

Here's an example JSON file:

```json
    "AgentInitializedSuccessfully":true,
            
    "AppType":"python",
            
    "MachineName":"c89d3a6d0357",
            
    "PID":"47",
            
    "IKey":"00000000-0000-0000-0000-000000000000",
            
    "SdkVersion":"1.0.0"

```

### Step 3: Avoid duplicate telemetry

You should only use Azure Monitor OpenTelemetry Autoinstrumentaion on App Service if you are not using the [Azure Monitor OpenTelemetry Distro](./opentelemetry-enable.md). Using Autoinsturmentation on top of the Azure Monitor OpenTelemetry Distro's Manual Instrumentation may cause duplicate telemetry. In order to use OpenTelemetry Autoinstrumentaion on App Service, first remove the Azure Monitor OpenTelemetry Distro from your app.

### Step 4: Confirm Django settings are appropiately configured

If you app uses Django and is either failing to start or using incorrect settings, make sure to set the `DJANGO_SETTINGS_MODULE` environment variable appropiately. See [Django Instrumentation](#django-instrumentation) section for details.

---

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

<!-- TODO: This shared release timeline is not updated -->
<!-- ## Release notes  

For the latest updates and bug fixes, [consult the release notes](web-app-extension-release-notes.md). -->

## Next steps

* [Monitor Azure Functions with Application Insights](monitor-functions.md).
* [Enable Azure diagnostics](../agents/diagnostics-extension-to-application-insights.md) to be sent to Application Insights.
* [Monitor service health metrics](../data-platform.md) to make sure your service is available and responsive.
* [Receive alert notifications](../alerts/alerts-overview.md) whenever operational events happen or metrics cross a threshold.
* Use [Application Insights for JavaScript apps and web pages](javascript.md) to get client telemetry from the browsers that visit a web page.
* [Availability overview](availability-overview.md)

[application_insights_sampling]: ./sampling.md
[azure_core_tracing_opentelemetry_plugin]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/core/azure-core-tracing-opentelemetry
[django_settings_module_docs]: https://docs.djangoproject.com/en/4.2/topics/settings/#envvar-DJANGO_SETTINGS_MODULE
[ot_env_vars]: https://opentelemetry.io/docs/reference/specification/sdk-environment-variables/
[ot_instrumentation_django]: https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-django
[ot_instrumentation_django_version]: https://github.com/open-telemetry/opentelemetry-python-contrib/blob/main/instrumentation/opentelemetry-instrumentation-django/src/opentelemetry/instrumentation/django/package.py#L16
[ot_instrumentation_fastapi]: https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-fastapi
[ot_instrumentation_fastapi_version]: https://github.com/open-telemetry/opentelemetry-python-contrib/blob/main/instrumentation/opentelemetry-instrumentation-fastapi/src/opentelemetry/instrumentation/fastapi/package.py#L16
[ot_instrumentation_flask]: https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-flask
[ot_instrumentation_flask_version]: https://github.com/open-telemetry/opentelemetry-python-contrib/blob/main/instrumentation/opentelemetry-instrumentation-flask/src/opentelemetry/instrumentation/flask/package.py#L16
[ot_instrumentation_psycopg2]: https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-psycopg2
[ot_instrumentation_psycopg2_version]: https://github.com/open-telemetry/opentelemetry-python-contrib/blob/main/instrumentation/opentelemetry-instrumentation-psycopg2/src/opentelemetry/instrumentation/psycopg2/package.py#L16
[ot_instrumentation_requests]: https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-requests
[ot_instrumentation_requests_version]: https://github.com/open-telemetry/opentelemetry-python-contrib/blob/main/instrumentation/opentelemetry-instrumentation-requests/src/opentelemetry/instrumentation/requests/package.py#L16
[ot_instrumentation_urllib]: https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-urllib3
[ot_instrumentation_urllib3]: https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-urllib3
[ot_instrumentation_urllib3_version]: https://github.com/open-telemetry/opentelemetry-python-contrib/blob/main/instrumentation/opentelemetry-instrumentation-urllib3/src/opentelemetry/instrumentation/urllib3/package.py#L16
[opentelemetry_spec_resource]: https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md#resource-sdk
[opentelemetry_spec_resource_attributes]: https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md#specifying-resource-information-via-an-environment-variable
[pypi_django]: https://pypi.org/project/Django/
[pypi_fastapi]: https://pypi.org/project/fastapi/
[pypi_flask]: https://pypi.org/project/Flask/
[pypi_psycopg2]: https://pypi.org/project/psycopg2/
[pypi_requests]: https://pypi.org/project/requests/
[pypi_urllib]: https://docs.python.org/3/library/urllib.html
[pypi_urllib3]: https://pypi.org/project/urllib3/