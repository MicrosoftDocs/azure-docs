---
title:  Stream Azure Spring Cloud app logs in real-time
description: How to use log streaming to view application logs instantly
author: karlerickson
ms.author: karler
ms.service: spring-cloud
ms.topic: how-to
ms.date: 01/14/2019
ms.custom: devx-track-java, devx-track-azurecli
---

# Stream Azure Spring Cloud app logs in real-time

**This article applies to:** ✔️ Java ✔️ C#

Azure Spring Cloud enables log streaming in Azure CLI to get real-time application console logs for troubleshooting. You can also [Analyze logs and metrics with diagnostics settings](./diagnostic-services.md).

## Prerequisites

* Install [Azure CLI extension](/cli/azure/install-azure-cli) for Spring Cloud, minimum version 0.2.0 .
* An instance of **Azure Spring Cloud** with a running application, for example [Spring Cloud app](./quickstart.md).

> [!NOTE]
>  The ASC CLI extension is updated from version 0.2.0 to 0.2.1. This change affects the syntax of the command for log streaming: `az spring-cloud app log tail`, which is replaced by: `az spring-cloud app logs`. The command: `az spring-cloud app log tail` will be deprecated in a future release. If you have been using version 0.2.0, you can upgrade to 0.2.1. First, remove the old version with the command: `az extension remove -n spring-cloud`.  Then, install 0.2.1 by the command: `az extension add -n spring-cloud`.

## Use CLI to tail logs

To avoid repeatedly specifying your resource group and service instance name, set your default resource group name and cluster name.
```azurecli
az config set defaults.group=<service group name>
az config set defaults.spring-cloud=<service instance name>
```
In following examples, the resource group and service name will be omitted in the commands.

### Tail log for app with single instance
If an app named auth-service has only one instance, you can view the log of the app instance with the following command:
```azurecli
az spring-cloud app logs -n auth-service
```
This will return logs:
```output
...
2020-01-15 01:54:40.481  INFO [auth-service,,,] 1 --- [main] o.apache.catalina.core.StandardService  : Starting service [Tomcat]
2020-01-15 01:54:40.482  INFO [auth-service,,,] 1 --- [main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.22]
2020-01-15 01:54:40.760  INFO [auth-service,,,] 1 --- [main] o.a.c.c.C.[Tomcat].[localhost].[/uaa]  : Initializing Spring embedded WebApplicationContext
2020-01-15 01:54:40.760  INFO [auth-service,,,] 1 --- [main] o.s.web.context.ContextLoader  : Root WebApplicationContext: initialization completed in 7203 ms

...
```

### Tail log for app with multiple instances
If multiple instances exist for the app named `auth-service`, you can view the instance log by using the `-i/--instance` option.

First, you can get the app instance names with following command.

```azurecli
az spring-cloud app show -n auth-service --query properties.activeDeployment.properties.instances -o table
```
With results:

```output
Name                                         Status    DiscoveryStatus
-------------------------------------------  --------  -----------------
auth-service-default-12-75cc4577fc-pw7hb  Running   UP
auth-service-default-12-75cc4577fc-8nt4m  Running   UP
auth-service-default-12-75cc4577fc-n25mh  Running   UP
```

Then, you can stream logs of an app instance with the option `-i/--instance` option:

```azurecli
az spring-cloud app logs -n auth-service -i auth-service-default-12-75cc4577fc-pw7hb
```

You can also get details of app instances from the Azure portal.  After selecting **Apps** in the left navigation pane of your Azure Spring Cloud service, select **App Instances**.

### Continuously stream new logs
By default, `az spring-cloud app logs` prints only existing logs streamed to the app console and then exits. If you want to stream new logs, add -f (--follow):

```azurecli
az spring-cloud app logs -n auth-service -f
```

To check all the logging options supported:

```azurecli
az spring-cloud app logs -h
```

### Format JSON structured logs

> [!NOTE]
> Requires spring-cloud extension version 2.4.0 or later.

When the [Structured application log](./structured-app-log.md) is enabled for the app, the logs are printed in JSON format. This makes it difficult to read. The `--format-json` argument can be used to format the JSON logs into human readable format.

```shell
# Raw JSON log
$ az spring-cloud app logs -n auth-service
{"timestamp":"2021-05-26T03:35:27.533Z","logger":"com.netflix.discovery.DiscoveryClient","level":"INFO","thread":"main","mdc":{},"message":"Disable delta property : false"}
{"timestamp":"2021-05-26T03:35:27.533Z","logger":"com.netflix.discovery.DiscoveryClient","level":"INFO","thread":"main","mdc":{},"message":"Single vip registry refresh property : null"}

# Formatted JSON log
$ az spring-cloud app logs -n auth-service --format-json
2021-05-26T03:35:27.533Z  INFO [           main] com.netflix.discovery.DiscoveryClient   : Disable delta property : false
2021-05-26T03:35:27.533Z  INFO [           main] com.netflix.discovery.DiscoveryClient   : Single vip registry refresh property : null
```

The `--format-json` argument also takes optional customized format, using the keyword argument [format string syntax](https://docs.python.org/3/library/string.html#format-string-syntax).

```shell
# Custom format
$ az spring-cloud app logs -n auth-service --format-json="{message}{n}"
Disable delta property : false
Single vip registry refresh property : null
```

> The default format being used is
> ```
> {timestamp} {level:>5} [{thread:>15.15}] {logger{39}:<40.40}: {message}{n}{stackTrace}
> ```

## Next steps
* [Quickstart: Monitoring Azure Spring Cloud apps with logs, metrics, and tracing](./quickstart-logs-metrics-tracing.md)
* [Analyze logs and metrics with diagnostics settings](./diagnostic-services.md)
