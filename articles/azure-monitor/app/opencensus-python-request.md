---
title: Incoming request tracking in Application Insights with OpenCensus Python | Microsoft Docs
description: Monitor request calls for your Python apps via OpenCensus Python.
ms.topic: conceptual
ms.date: 03/22/2023
ms.devlang: python
ms.custom: devx-track-python
ms.reviewer: mmcc
---

# Track incoming requests with OpenCensus Python

OpenCensus Python and its integrations collect incoming request data. You can track incoming request data sent to your web applications built on top of the popular web frameworks Django, Flask, and Pyramid. Application Insights receives the data as `requests` telemetry.

First, instrument your Python application with the latest [OpenCensus Python SDK](./opencensus-python.md).

## Track Django applications

1. Download and install `opencensus-ext-django` from [PyPI](https://pypi.org/project/opencensus-ext-django/). Instrument your application with the `django` middleware. Incoming requests sent to your Django application are tracked.

1. Include `opencensus.ext.django.middleware.OpencensusMiddleware` in your `settings.py` file under `MIDDLEWARE`.

    ```python
    MIDDLEWARE = (
        ...
        'opencensus.ext.django.middleware.OpencensusMiddleware',
        ...
    )
    ```

1. Make sure AzureExporter is configured properly in your `settings.py` under `OPENCENSUS`. For requests from URLs that you don't want to track, add them to `EXCLUDELIST_PATHS`.

    ```python
    OPENCENSUS = {
        'TRACE': {
            'SAMPLER': 'opencensus.trace.samplers.ProbabilitySampler(rate=1)',
            'EXPORTER': '''opencensus.ext.azure.trace_exporter.AzureExporter(
                connection_string="InstrumentationKey=<your-ikey-here>"
            )''',
            'EXCLUDELIST_PATHS': ['https://example.com'],  <--- These sites will not be traced if a request is sent to it.
        }
    }
    ```

You can find a Django sample application in the [Azure Monitor OpenCensus Python samples repository](https://github.com/Azure-Samples/azure-monitor-opencensus-python/tree/master/azure_monitor/django_sample).

## Track Flask applications

1. Download and install `opencensus-ext-flask` from [PyPI](https://pypi.org/project/opencensus-ext-flask/). Instrument your application with the `flask` middleware. Incoming requests sent to your Flask application are tracked.

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

1. You can also configure your `flask` application through `app.config`. For requests from URLs that you don't want to track, add them to `EXCLUDELIST_PATHS`.

    ```python
    app.config['OPENCENSUS'] = {
        'TRACE': {
            'SAMPLER': 'opencensus.trace.samplers.ProbabilitySampler(rate=1.0)',
            'EXPORTER': '''opencensus.ext.azure.trace_exporter.AzureExporter(
                connection_string="InstrumentationKey=<your-ikey-here>",
            )''',
            'EXCLUDELIST_PATHS': ['https://example.com'],  <--- These sites will not be traced if a request is sent to it.
        }
    }
    ```
    
    > [!NOTE]
    > To run Flask under uWSGI in a Docker environment, you must first add `lazy-apps = true` to the uWSGI configuration file (uwsgi.ini). For more information, see the [issue description](https://github.com/census-instrumentation/opencensus-python/issues/660).

You can find a Flask sample application that tracks requests in the [Azure Monitor OpenCensus Python samples repository](https://github.com/Azure-Samples/azure-monitor-opencensus-python/tree/master/azure_monitor/flask_sample).

## Track Pyramid applications

1. Download and install `opencensus-ext-django` from [PyPI](https://pypi.org/project/opencensus-ext-pyramid/). Instrument your application with the `pyramid` tween. Incoming requests sent to your Pyramid application are tracked.

    ```python
    def main(global_config, **settings):
        config = Configurator(settings=settings)
    
        config.add_tween('opencensus.ext.pyramid'
                         '.pyramid_middleware.OpenCensusTweenFactory')
    ```

1. You can configure your `pyramid` tween directly in the code. For requests from URLs that you don't want to track, add them to `EXCLUDELIST_PATHS`.

    ```python
    settings = {
        'OPENCENSUS': {
            'TRACE': {
                'SAMPLER': 'opencensus.trace.samplers.ProbabilitySampler(rate=1.0)',
                'EXPORTER': '''opencensus.ext.azure.trace_exporter.AzureExporter(
                    connection_string="InstrumentationKey=<your-ikey-here>",
                )''',
                'EXCLUDELIST_PATHS': ['https://example.com'],  <--- These sites will not be traced if a request is sent to it.
            }
        }
    }
    config = Configurator(settings=settings)
    ```

## Track FastAPI applications

OpenCensus doesn't have an extension for FastAPI. To write your own FastAPI middleware:

1. The following dependencies are required:
    - [fastapi](https://pypi.org/project/fastapi/)
    - [uvicorn](https://pypi.org/project/uvicorn/)

      In a production setting, we recommend that you deploy [uvicorn with gunicorn](https://www.uvicorn.org/deployment/#gunicorn).

1. Add [FastAPI middleware](https://fastapi.tiangolo.com/tutorial/middleware/). Make sure that you set the span kind server: `span.span_kind = SpanKind.SERVER`.

1. Run your application. Calls made to your FastAPI application should be automatically tracked. Telemetry should be logged directly to Azure Monitor.

    ```python 
    # Opencensus imports
    from opencensus.ext.azure.trace_exporter import AzureExporter
    from opencensus.trace.samplers import ProbabilitySampler
    from opencensus.trace.tracer import Tracer
    from opencensus.trace.span import SpanKind
    from opencensus.trace.attributes_helper import COMMON_ATTRIBUTES
    # FastAPI imports
    from fastapi import FastAPI, Request
    # uvicorn
    import uvicorn

    app = FastAPI()

    HTTP_URL = COMMON_ATTRIBUTES['HTTP_URL']
    HTTP_STATUS_CODE = COMMON_ATTRIBUTES['HTTP_STATUS_CODE']
    
    exporter=AzureExporter(connection_string='<your-appinsights-connection-string-here>')
    sampler=ProbabilitySampler(1.0)

    # fastapi middleware for opencensus
    @app.middleware("http")
    async def middlewareOpencensus(request: Request, call_next):  
        tracer = Tracer(exporter=exporter, sampler=sampler)       
        with tracer.span("main") as span:
            span.span_kind = SpanKind.SERVER

            response = await call_next(request)

            tracer.add_attribute_to_current_span(
                attribute_key=HTTP_STATUS_CODE,
                attribute_value=response.status_code)
            tracer.add_attribute_to_current_span(
                attribute_key=HTTP_URL,
                attribute_value=str(request.url))

        return response

    @app.get("/")
    async def root():
        return "Hello World!"

    if __name__ == '__main__':
        uvicorn.run("example:app", host="127.0.0.1", port=5000, log_level="info")
    ```

## Next steps

* [Application Map](./app-map.md)
* [Availability](./availability-overview.md)
* [Search](./diagnostic-search.md)
* [Log Analytics query](../logs/log-query-overview.md)
* [Transaction diagnostics](./transaction-diagnostics.md)