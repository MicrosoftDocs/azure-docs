---
title: Dependency Tracking in Azure Application Insights with OpenCensus Python | Microsoft Docs
description: Monitor dependency calls for your Python apps via OpenCensus Python.
ms.topic: conceptual
ms.date: 03/22/2023
ms.devlang: python
ms.custom: devx-track-python
ms.reviewer: mmcc
---

# Track dependencies with OpenCensus Python

A dependency is an external component that is called by your application. Dependency data is collected using OpenCensus Python and its various integrations. The data is then sent to Application Insights under Azure Monitor as `dependencies` telemetry.

First, instrument your Python application with latest [OpenCensus Python SDK](./opencensus-python.md).

## In-process dependencies

OpenCensus Python SDK for Azure Monitor allows you to send "in-process" dependency telemetry (information and logic that occurs within your application). In-process dependencies will have the `type` field as `INPROC` in analytics.

```python
from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.trace.samplers import ProbabilitySampler
from opencensus.trace.tracer import Tracer

tracer = Tracer(exporter=AzureExporter(connection_string="InstrumentationKey=<your-ikey-here>"), sampler=ProbabilitySampler(1.0))

with tracer.span(name='foo'): # <-- A dependency telemetry item will be sent for this span "foo"
    print('Hello, World!')
```

## Dependencies with "requests" integration

Track your outgoing requests with the OpenCensus `requests` integration.

Download and install `opencensus-ext-requests` from [PyPI](https://pypi.org/project/opencensus-ext-requests/) and add it to the trace integrations. Requests sent using the Python [requests](https://pypi.org/project/requests/) library will be tracked.

```python
import requests
from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.trace import config_integration
from opencensus.trace.samplers import ProbabilitySampler
from opencensus.trace.tracer import Tracer

config_integration.trace_integrations(['requests'])  # <-- this line enables the requests integration

tracer = Tracer(exporter=AzureExporter(connection_string="InstrumentationKey=<your-ikey-here>"), sampler=ProbabilitySampler(1.0))

with tracer.span(name='parent'):
    response = requests.get(url='https://www.wikipedia.org/wiki/Rabbit') # <-- this request will be tracked
```

## Dependencies with "httplib" integration

Track your outgoing requests with OpenCensus `httplib` integration.

Download and install `opencensus-ext-httplib` from [PyPI](https://pypi.org/project/opencensus-ext-httplib/) and add it to the trace integrations. Requests sent using [http.client](https://docs.python.org/3.7/library/http.client.html) for Python3 or [httplib](https://docs.python.org/2/library/httplib.html) for Python2 will be tracked.

```python
import http.client as httplib
from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.trace import config_integration
from opencensus.trace.samplers import ProbabilitySampler
from opencensus.trace.tracer import Tracer

config_integration.trace_integrations(['httplib'])
conn = httplib.HTTPConnection("www.python.org")

tracer = Tracer(
    exporter=AzureExporter(),
    sampler=ProbabilitySampler(1.0)
)

conn.request("GET", "http://www.python.org", "", {})
response = conn.getresponse()
conn.close()
```

## Dependencies with "django" integration

Track your outgoing Django requests with the OpenCensus `django` integration.

> [!NOTE]
> The only outgoing Django requests that are tracked are calls made to a database. For requests made to the Django application, see [incoming requests](./opencensus-python-request.md#track-django-applications).

Download and install `opencensus-ext-django` from [PyPI](https://pypi.org/project/opencensus-ext-django/) and add the following line to the `MIDDLEWARE` section in the Django `settings.py` file.

```python
MIDDLEWARE = [
    ...
    'opencensus.ext.django.middleware.OpencensusMiddleware',
]
```

Additional configuration can be provided, read [customizations](https://github.com/census-instrumentation/opencensus-python#customization) for a complete reference.

```python
OPENCENSUS = {
    'TRACE': {
        'SAMPLER': 'opencensus.trace.samplers.ProbabilitySampler(rate=1)',
        'EXPORTER': '''opencensus.ext.azure.trace_exporter.AzureExporter(
            connection_string="InstrumentationKey=<your-ikey-here>"
        )''',
    }
}
```

You can find a Django sample application that uses dependencies in the Azure Monitor OpenCensus Python samples repository located [here](https://github.com/Azure-Samples/azure-monitor-opencensus-python/tree/master/azure_monitor/django_sample).

## Dependencies with "mysql" integration

Track your MYSQL dependencies with the OpenCensus `mysql` integration. This integration supports the [mysql-connector](https://pypi.org/project/mysql-connector-python/) library.

Download and install `opencensus-ext-mysql` from [PyPI](https://pypi.org/project/opencensus-ext-mysql/) and add the following lines to your code.

```python
from opencensus.trace import config_integration

config_integration.trace_integrations(['mysql'])
```

## Dependencies with "pymysql" integration

Track your PyMySQL dependencies with the OpenCensus `pymysql` integration.

Download and install `opencensus-ext-pymysql` from [PyPI](https://pypi.org/project/opencensus-ext-pymysql/) and add the following lines to your code.

```python
from opencensus.trace import config_integration

config_integration.trace_integrations(['pymysql'])
```

## Dependencies with "postgresql" integration

Track your PostgreSQL dependencies with the OpenCensus `postgresql` integration. This integration supports the [psycopg2](https://pypi.org/project/psycopg2/) library.

Download and install `opencensus-ext-postgresql` from [PyPI](https://pypi.org/project/opencensus-ext-postgresql/) and add the following lines to your code.

```python
from opencensus.trace import config_integration

config_integration.trace_integrations(['postgresql'])
```

## Dependencies with "pymongo" integration

Track your MongoDB dependencies with the OpenCensus `pymongo` integration. This integration supports the [pymongo](https://pypi.org/project/pymongo/) library.

Download and install `opencensus-ext-pymongo` from [PyPI](https://pypi.org/project/opencensus-ext-pymongo/) and add the following lines to your code.

```python
from opencensus.trace import config_integration

config_integration.trace_integrations(['pymongo'])
```

### Dependencies with "sqlalchemy" integration

Track your dependencies using SQLAlchemy using OpenCensus `sqlalchemy` integration. This integration tracks the usage of the [sqlalchemy](https://pypi.org/project/SQLAlchemy/) package, regardless of the underlying database.

```python
from opencensus.trace import config_integration

config_integration.trace_integrations(['sqlalchemy'])
```

## Next steps

* [Application Map](./app-map.md)
* [Availability](./availability-overview.md)
* [Search](./diagnostic-search.md)
* [Log (Analytics) query](../logs/log-query-overview.md)
* [Transaction diagnostics](./transaction-diagnostics.md)

