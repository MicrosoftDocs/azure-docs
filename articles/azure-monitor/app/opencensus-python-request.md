---
title: Incoming Request Tracking in Azure Application Insights with OpenCensus Python | Microsoft Docs
description: Monitor request calls for your Python apps via OpenCensus Python.
ms.topic: conceptual
author: lzchen
ms.author: lechen
ms.date: 10/15/2019
ms.custom: devx-track-python

---

# Track incoming requests with OpenCensus Python

Incoming request data is collected using OpenCensus Python and its various integrations. Track incoming request data sent to your web applications built on top of the popular web frameworks `django`, `flask` and `pyramid`. The data is then sent to Application Insights under Azure Monitor as `requests` telemetry.

First, instrument your Python application with latest [OpenCensus Python SDK](./opencensus-python.md).

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

3. Make sure AzureExporter is properly configured in your `settings.py` under `OPENCENSUS`. For requests from urls that you do not wish to track, add them to `EXCLUDELIST_PATHS`.

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

2. You can also configure your `flask` application through `app.config`. For requests from urls that you do not wish to track, add them to `EXCLUDELIST_PATHS`.

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
    
## Tracking Pyramid applications

1. Download and install `opencensus-ext-django` from [PyPI](https://pypi.org/project/opencensus-ext-pyramid/) and instrument your application with the `pyramid` tween. Incoming requests sent to your `pyramid` application will be tracked.

    ```python
    def main(global_config, **settings):
        config = Configurator(settings=settings)
    
        config.add_tween('opencensus.ext.pyramid'
                         '.pyramid_middleware.OpenCensusTweenFactory')
    ```

2. You can configure your `pyramid` tween directly in the code. For requests from urls that you do not wish to track, add them to `EXCLUDELIST_PATHS`.

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

## Tracking FastAPI applications

OpenCensus doesn't have an extension for FastAPI. To write your own FastAPI middleware, complete the following steps:

1. The following dependencies are required: 
    - [fastapi](https://pypi.org/project/fastapi/)
    - [uvicorn](https://pypi.org/project/uvicorn/)

2. Add [FastAPI middleware](https://fastapi.tiangolo.com/tutorial/middleware/). Make sure that you set the span kind server: `span.span_kind = SpanKind.SERVER`.

3. Run your application. Calls made to your FastAPI application should be automatically tracked and telemetry should be logged directly to Azure Monitor.

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

    # fastapi middleware for opencensus
    @app.middleware("http")
    async def middlewareOpencensus(request: Request, call_next):
        tracer = Tracer(exporter=AzureExporter(connection_string=f'InstrumentationKey={APPINSIGHTS_INSTRUMENTATIONKEY}'),sampler=ProbabilitySampler(1.0))
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
* [Availability](./monitor-web-app-availability.md)
* [Search](./diagnostic-search.md)
* [Log (Analytics) query](../logs/log-query-overview.md)
* [Transaction diagnostics](./transaction-diagnostics.md)

