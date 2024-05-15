---
title: Monitor Azure app services performance Python (Preview)
description: Application performance monitoring for Azure app services using Python. Chart load and response time, dependency information, and set alerts on performance.
ms.topic: conceptual
ms.date: 04/01/2024
ms.devlang: python
ms.custom: "devx-track-python"
ms.reviewer: abinetabate
---

# Application monitoring for Azure App Service and Python (Preview)

> [!IMPORTANT]
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

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
> If using Django, see the additional [Django Instrumentation](#django-instrumentation) section in this article.

Logging telemetry is collected at the level of the root logger. To learn more about Python's native logging hierarchy, visit the [Python logging documentation][python_logging_docs].

## Prerequisites

* Python version 3.11 or prior.
* App Service must be deployed as code. Custom containers aren't supported.

## Enable Application Insights

The easiest way to monitor Python applications on Azure App Services is through the Azure portal.

Activating monitoring in the Azure portal automatically instruments your application with Application Insights and requires no code changes.

> [!NOTE]
> You should only use autoinstrumentation on App Service if you aren't using manual instrumentation of OpenTelemetry in your code, such as the [Azure Monitor OpenTelemetry Distro](./opentelemetry-enable.md?tabs=python) or the [Azure Monitor OpenTelemetry Exporter][azure_monitor_opentelemetry_exporter]. This is to prevent duplicate data from being sent. To learn more about this, check out the [troubleshooting section](#troubleshooting) in this article.

### Autoinstrumentation through Azure portal

For a complete list of supported autoinstrumentation scenarios, see [Supported environments, languages, and resource providers](codeless-overview.md#supported-environments-languages-and-resource-providers).

Toggle on monitoring for your Python apps in Azure App Service with no code changes required.

Application Insights for Python integrates with code-based Linux Azure App Service.

The integration is in public preview. It adds the Python SDK, which is in GA.

1. **Select Application Insights** in the Azure control panel for your app service, then select **Enable**.

    :::image type="content"source="./media/azure-web-apps/enable.png" alt-text="Screenshot of Application Insights tab with enable selected." lightbox="./media/azure-web-apps/enable.png"::: 

2. Choose to create a new resource, or select an existing Application Insights resource for this application.

    > [!NOTE]
    > When you select **OK** to create the new resource you will be prompted to **Apply monitoring settings**. Selecting **Continue** will link your new Application Insights resource to your app service, doing so will also **trigger a restart of your app service**.

    :::image type="content"source="./media/azure-web-apps/change-resource.png" alt-text="Screenshot of Change your resource dropdown." lightbox="./media/azure-web-apps/change-resource.png":::

3. You specify the resource, and it's ready to use.

    :::image type="content"source="./media/azure-web-apps-python/app-service-python.png" alt-text="Screenshot of instrument your application." lightbox="./media/azure-web-apps-python/app-service-python.png":::

## Configuration

You can configure with [OpenTelemetry environment variables][ot_env_vars] such as:

| **Environment Variable**                       | **Description**                                     |
|--------------------------------------------|----------------------------------------------------|
| `OTEL_SERVICE_NAME`, `OTEL_RESOURCE_ATTRIBUTES` | Specifies the OpenTelemetry [Resource Attributes][opentelemetry_resource] associated with your application. You can set any Resource Attributes with [OTEL_RESOURCE_ATTRIBUTES][opentelemetry_spec_resource_attributes_env_var] or use [OTEL_SERVICE_NAME][opentelemetry_spec_service_name_env_var] to only set the `service.name`. |
| `OTEL_LOGS_EXPORTER` | If set to `None`, disables collection and export of logging telemetry. |
| `OTEL_METRICS_EXPORTER` | If set to `None`, disables collection and export of metric telemetry. |
| `OTEL_TRACES_EXPORTER` | If set to `None`, disables collection and export of distributed tracing telemetry. |
| `OTEL_BLRP_SCHEDULE_DELAY` | Specifies the logging export interval in milliseconds. Defaults to 5000. |
| `OTEL_BSP_SCHEDULE_DELAY` | Specifies the distributed tracing export interval in milliseconds. Defaults to 5000. |
| `OTEL_PYTHON_DISABLED_INSTRUMENTATIONS` | Specifies which OpenTelemetry instrumentations to disable. When disabled, instrumentations aren't executed as part of autoinstrumentation. Accepts a comma-separated list of lowercase [library names](#application-monitoring-for-azure-app-service-and-python-preview). For example, set it to `"psycopg2,fastapi"` to disable the Psycopg2 and FastAPI instrumentations. It defaults to an empty list, enabling all supported instrumentations. |

### Add a community instrumentation library

You can collect more data automatically when you include instrumentation libraries from the OpenTelemetry community.

[!INCLUDE [azure-monitor-app-insights-opentelemetry-support](../includes/azure-monitor-app-insights-opentelemetry-community-library-warning.md)]

To add the community OpenTelemetry Instrumentation Library, install it via your app's `requirements.txt` file. OpenTelemetry autoinstrumentation automatically picks up and instruments all installed libraries. Find the list of community libraries [here](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation).

## Automate monitoring

In order to enable telemetry collection with Application Insights, only the following Application settings need to be set:

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

In order to use the OpenTelemetry Django Instrumentation, you need to set the `DJANGO_SETTINGS_MODULE` environment variable in the App Service settings to point from your app folder to your settings module. For more information, see the [Django documentation][django_settings_module_docs].

## Frequently asked questions

[!INCLUDE [azure-web-apps-troubleshoot](../../../includes/azure-monitor-app-insights-azure-web-apps-troubleshoot.md)]

## Troubleshooting

Here we provide our troubleshooting guide for monitoring Python applications on Azure App Services using autoinstrumentation.

### Duplicate telemetry

You should only use autoinstrumentation on App Service if you aren't using manual instrumentation of OpenTelemetry in your code, such as the [Azure Monitor OpenTelemetry Distro](./opentelemetry-enable.md?tabs=python) or the [Azure Monitor OpenTelemetry Exporter][azure_monitor_opentelemetry_exporter]. Using autoinstrumentation on top of the manual instrumentation could cause duplicate telemetry and increase your cost. In order to use App Service OpenTelemetry autoinstrumentation, first remove manual instrumentation of OpenTelemetry from your code.

### Missing telemetry

If you're missing telemetry, follow these steps to confirm that autoinstrumentation is enabled correctly.

#### Step 1: Check the Application Insights blade on your App Service resource

Confirm that autoinstrumentation is enabled in the Application Insights blade on your App Service Resource:

:::image type="content"source="./media/azure-web-apps/enable.png" alt-text="Screenshot of Application Insights tab with enable selected." lightbox="./media/azure-web-apps/enable.png"::: 

#### Step 2: Confirm that your App Settings are correct

Confirm that the `ApplicationInsightsAgent_EXTENSION_VERSION` app setting is set to a value of `~3` and that your `APPLICATIONINSIGHTS_CONNECTION_STRING` points to the appropriate Application Insights resource.

:::image type="content"source="./media/azure-web-apps-python/application-settings-python.png" alt-text="Screenshot of App Service Application Settings with available Application Insights settings." lightbox="./media/azure-web-apps-python/application-settings-python.png":::

#### Step 3: Check autoinstrumentation diagnostics and status logs
Navigate to */var/log/applicationinsights/* and open status_*.json.

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

The `applicationinsights-extension.log` file in the same folder may show other helpful diagnostics.

### Django apps

If your app uses Django and is either failing to start or using incorrect settings, make sure to set the `DJANGO_SETTINGS_MODULE` environment variable. See the [Django Instrumentation](#django-instrumentation) section for details.

---

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

For the latest updates and bug fixes, [consult the release notes](web-app-extension-release-notes.md). -->

## Next steps

* [Enable Azure diagnostics](../agents/diagnostics-extension-to-application-insights.md) to be sent to Application Insights
* [Monitor service health metrics](../data-platform.md) to make sure your service is available and responsive
* [Receive alert notifications](../alerts/alerts-overview.md) whenever operational events happen or metrics cross a threshold
* [Availability overview](availability-overview.md)

[application_insights_sampling]: ./sampling.md
[azure_core_tracing_opentelemetry_plugin]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/core/azure-core-tracing-opentelemetry
[azure_monitor_opentelemetry_exporter]: /python/api/overview/azure/monitor-opentelemetry-exporter-readme
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
[opentelemetry_resource]: https://opentelemetry.io/docs/specs/otel/resource/sdk/
[opentelemetry_spec_resource_attributes_env_var]: https://opentelemetry-python.readthedocs.io/en/latest/sdk/environment_variables.html?highlight=OTEL_RESOURCE_ATTRIBUTES%20#opentelemetry-sdk-environment-variables
[opentelemetry_spec_service_name_env_var]: https://opentelemetry-python.readthedocs.io/en/latest/sdk/environment_variables.html?highlight=OTEL_RESOURCE_ATTRIBUTES%20#opentelemetry.sdk.environment_variables.OTEL_SERVICE_NAME
[python_logging_docs]: https://docs.python.org/3/library/logging.html
[pypi_django]: https://pypi.org/project/Django/
[pypi_fastapi]: https://pypi.org/project/fastapi/
[pypi_flask]: https://pypi.org/project/Flask/
[pypi_psycopg2]: https://pypi.org/project/psycopg2/
[pypi_requests]: https://pypi.org/project/requests/
[pypi_urllib]: https://docs.python.org/3/library/urllib.html
[pypi_urllib3]: https://pypi.org/project/urllib3/
