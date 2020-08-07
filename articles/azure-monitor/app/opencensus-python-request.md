---
title: Incoming Request Tracking in Azure Application Insights with OpenCensus Python | Microsoft Docs
description: Monitor request calls for your Python apps via OpenCensus Python.
ms.topic: conceptual
author: lzchen
ms.author: lechen
ms.date: 10/15/2019
ms.custom: tracking-python

---

# Track incoming requests with OpenCensus Python

Incoming request data is collected using OpenCensus Python and its various integrations. Track incoming request data sent to your web applications built on top of the popular web frameworks `django`, `flask` and `pyramid`. The data is then sent to Application Insights under Azure Monitor as `requests` telemetry.

First, instrument your Python application with latest [OpenCensus Python SDK](../../azure-monitor/app/opencensus-python.md).

## Tracking Django applications

1. Download and install `opencensus-ext-django` from [PyPI](https://pypi.org/project/opencensus-ext-django/) and instrument your application with the `django` middleware. Incoming requests sent to your `django` application will be tracked.

2. Include `opencensus.ext.django.middleware.OpencensusMiddleware` in your `settings.py` file under `MIDDLEWARE`.

    ```python
    MIDDLEWARE = (
        ...
        'opencensus.ext.django.middleware.OpencensusMiddleware',
        ...
    )
    ```

3. Make sure AzureExporter is properly configured in your `settings.py` under `OPENCENSUS`. For requests from urls that you do not wish to track, add them to `BLACKLIST_PATHS`.

    ```python
    OPENCENSUS = {
        'TRACE': {
            'SAMPLER': 'opencensus.trace.samplers.ProbabilitySampler(rate=1)',
            'EXPORTER': '''opencensus.ext.azure.trace_exporter.AzureExporter(
                connection_string="InstrumentationKey=<your-ikey-here>"
            )''',
            'BLACKLIST_PATHS': ['https://example.com'],  <--- These sites will not be traced if a request is sent to it.
        }
    }
    ```

## Tracking Flask applications

1. Download and install `opencensus-ext-flask` from [PyPI](https://pypi.org/project/opencensus-ext-flask/) and instrument your application with the `flask` middleware. Incoming requests sent to your `flask` application will be tracked.

    ```python
    
    from flask import Flask
    from opencensus.ext.azure.trace_exporter import AzureExporter
    from opencensus.ext.flask.flask_middleware import FlaskMiddleware
    from opencensus.trace.samplers import ProbabilitySampler
    
    app = Flask(__name__)
    middleware = FlaskMiddleware(
        app,
        exporter=AzureExporter(connection_string="InstrumentationKey=<your-ikey-here>"),
        sampler=ProbabilitySampler(rate=1.0),
    )
    
    @app.route('/')
    def hello():
        return 'Hello World!'
    
    if __name__ == '__main__':
        app.run(host='localhost', port=8080, threaded=True)
    
    ```

2. You can also configure your `flask` application through `app.config`. For requests from urls that you do not wish to track, add them to `BLACKLIST_PATHS`.

    ```python
    app.config['OPENCENSUS'] = {
        'TRACE': {
            'SAMPLER': 'opencensus.trace.samplers.ProbabilitySampler(rate=1.0)',
            'EXPORTER': '''opencensus.ext.azure.trace_exporter.AzureExporter(
                connection_string="InstrumentationKey=<your-ikey-here>",
            )''',
            'BLACKLIST_PATHS': ['https://example.com'],  <--- These sites will not be traced if a request is sent to it.
        }
    }
    ```

## Tracking Pyramid applications

1. Download and install `opencensus-ext-django` from [PyPI](https://pypi.org/project/opencensus-ext-pyramid/) and instrument your application with the `pyramid` tween. Incoming requests sent to your `pyramid` application will be tracked.

    ```python
    def main(global_config, **settings):
        config = Configurator(settings=settings)
    
        config.add_tween('opencensus.ext.pyramid'
                         '.pyramid_middleware.OpenCensusTweenFactory')
    ```

2. You can configure your `pyramid` tween directly in the code. For requests from urls that you do not wish to track, add them to `BLACKLIST_PATHS`.

    ```python
    settings = {
        'OPENCENSUS': {
            'TRACE': {
                'SAMPLER': 'opencensus.trace.samplers.ProbabilitySampler(rate=1.0)',
                'EXPORTER': '''opencensus.ext.azure.trace_exporter.AzureExporter(
                    connection_string="InstrumentationKey=<your-ikey-here>",
                )''',
                'BLACKLIST_PATHS': ['https://example.com'],  <--- These sites will not be traced if a request is sent to it.
            }
        }
    }
    config = Configurator(settings=settings)
    ```

## Next steps

* [Application Map](../../azure-monitor/app/app-map.md)
* [Availability](../../azure-monitor/app/monitor-web-app-availability.md)
* [Search](../../azure-monitor/app/diagnostic-search.md)
* [Log (Analytics) query](../../azure-monitor/log-query/log-query-overview.md)
* [Transaction diagnostics](../../azure-monitor/app/transaction-diagnostics.md)
