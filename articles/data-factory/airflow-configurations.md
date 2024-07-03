---
title: Supported Apache Airflow configurations
description: This article enumerates the Apache Airflow configurations supported by the Workflow Orchestration Manager.
author: nabhishek
ms.author: abnarain
ms.reviewer: jburchel
ms.service: data-factory
ms.topic: how-to
ms.date: 12/11/2023
---

# Supported Apache Airflow configurations

> [!NOTE]
> This feature is in public preview. Workflow Orchestration Manager is powered by Apache Airflow.

In Workflow Orchestration Manager, Apache Airflow configurations can be integrated with the platform's runtime as key-value pairs. While the `airflow.cfg` isn't directly accessible in the UI, users can override these configurations via the UI's "Airflow Configuration overrides" section, retaining access to other `airflow.cfg` settings. Developers have the flexibility to override most Apache Airflow configurations within Workflow Orchestration Manager, `except for those explicitly outlined in a provided table`.

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

For more information on Apache Airflow configurations, see [Configuration Reference](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html).

The following table contains the list of configurations that don't support overrides.

|Configuration  |Description  | Default value
|---------|---------|------|
|[AIRFLOW__CELERY__FLOWER_URL_PREFIX](https://airflow.apache.org/docs/apache-airflow-providers-celery/stable/configurations-ref.html#flower-url-prefix) |The root URL for Flower. |"" |
|[AIRFLOW__CORE__DAGS_FOLDER](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#dags-folder) |The path of the folder where Airflow pipelines live.|AIRFLOW_DAGS_FOLDER |
|[AIRFLOW__CORE__DONOT_PICKLE](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#donot-pickle) |Whether to disable pickling DAGs. |False |
|[AIRFLOW__CORE__ENABLE_XCOM_PICKLING](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#enable-xcom-pickling) |Whether to enable pickling for xcom. |False |
|[AIRFLOW__CORE__EXECUTOR](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#executor) |The executor class that Airflow should use. |CeleryExecutor |
|[AIRFLOW__CORE__FERNET_KEY](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#fernet-key) |Secret key to save connection passwords in the database. |AIRFLOW_FERNET_KEY |
|[AIRFLOW__CORE__DAGS_ARE_PAUSED_AT_CREATION](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#dags-are-paused-at-creation) |Are DAGs paused by default at creation? |False |
|[AIRFLOW__CORE__PLUGINS_FOLDER](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#plugins-folder) |Path to the folder that contains Airflow plugins. |AIRFLOW_PLUGINS_FOLDER |
|[AIRFLOW__LOGGING__BASE_LOG_FOLDER](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#base-log-folder) |The folder where Airflow should store its log files.|/opt/airflow/logs |
|[AIRFLOW__LOGGING__LOG_FILENAME_TEMPLATE](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#log-filename-template) |Formatting for how Airflow generates file names or paths for each task run. |{{ ti.dag_id }}/{{ ti.task_id }}/{{ ts }}/{{ try_number }}.log |
|[AIRFLOW__LOGGING__DAG_PROCESSOR_MANAGER_LOG_LOCATION](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#dag-processor-manager-log-location) |Full path of the `dag_processor_manager` log file. |/opt/airflow/logs/dag_processor_manager/dag_processor_manager.log |
|[AIRFLOW__LOGGING__LOGGING_CONFIG_CLASS](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#logging-config-class) |Logging config class specifies the logging configuration. This class has to be on the Python class path. |log_config.LOGGING_CONFIG |
|[AIRFLOW__LOGGING__COLORED_LOG_FORMAT](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#colored-log-format) |Log format for when Colored logs is enabled. |[%(asctime)s] {{%(filename)s:%(lineno)d}} %(levelname)s - %(message)s |
|[AIRFLOW__LOGGING__LOGGING_LEVEL](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#logging-level) |Logging level. |INFO |
|[AIRFLOW__METRICS__STATSD_ON](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#statsd-on) |Enables sending metrics to StatsD. |True |
|[AIRFLOW__METRICS__STATSD_HOST](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#statsd-host) |Hostname of the StatsD server. |geneva-services |
|[AIRFLOW__METRICS__STATSD_PORT](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#statsd-port) |Port number of the StatsD server. |8125 |
|AIRFLOW__METRICS__STATSD_PREFIX |Prefix for all Airflow metrics sent to StatsD. |AirflowMetrics|
|[AIRFLOW__SCHEDULER__CHILD_PROCESS_LOG_DIRECTORY](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#child-process-log-directory) |Path of the directory where the Airflow scheduler writes its child process logs. |/opt/airflow/logs/scheduler |
|[AIRFLOW__SCHEDULER__DAG_DIR_LIST_INTERVAL](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#dag-dir-list-interval) |How often (in seconds) to scan the DAGs' directory for new files. Default to 5 minutes. |5|
|[AIRFLOW__WEBSERVER__BASE_URL](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#webserver) |The base URL of your website because Airflow can't guess what domain or cname you're using. This URL is used in automated emails that Airflow sends to point links to the right web server. |https://localhost:8080 |
|[AIRFLOW__WEBSERVER__COOKIE_SAMESITE](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#cookie-samesite) |Set samesite policy on session cookie. |None |
|[AIRFLOW__WEBSERVER__COOKIE_SECURE](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#cookie-secure) |Set secure flag on session cookie. |True |
|[AIRFLOW__WEBSERVER__EXPOSE_CONFIG](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#expose-config) |Expose the configuration file in the web server. |False |
|AIRFLOW__WEBSERVER__AUTHENTICATE |Authenticate user to sign in to the Airflow UI. |True |
|AIRFLOW__WEBSERVER__AUTH_BACKEND ||airflow.api.auth.backend.basic_auth |
|[AIRFLOW__WEBSERVER__RELOAD_ON_PLUGIN_CHANGE](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#reload-on-plugin-change) |If set to True, Airflow tracks files in the `plugins_folder` directory. When it detects changes, then reload the gunicorn. |True |
|[AIRFLOW__WEBSERVER__SECRET_KEY](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#secret-key) |Secret key used to run your flask app. |AIRFLOW_FERNET_KEY |
|[AIRFLOW__API__AUTH_BACKEND](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#auth-backends) |Comma-separated list of auth backends to authenticate users of the API. |airflow.api.auth.backend.basic_auth |
|[AIRFLOW__API__ENABLE_EXPERIMENTAL_API](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#enable-experimental-api) ||True |
