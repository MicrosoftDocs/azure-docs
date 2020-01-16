---
title:  Azure Spring Cloud log streaming for instant availability
description: How to use log streaming to view application logs instantly 
author:  MikeDodaro
ms.author: barbkess
ms.service: spring-cloud
ms.topic: how-to
ms.date: 01/14/2019
---

# Azure Spring Cloud log streaming for instant availability

The log streaming feature makes application logs available instantly using CLI with limited range. To view logs out of range, see [Analyze logs and metrics with diagnostics settings](./diagnostic-services.md).

## Prerequisites

* Install minimum version 0.2.0 of the [Azure CLI extension](https://docs.microsoft.com/azure/spring-cloud/spring-cloud-quickstart-launch-app-cli#install-the-azure-cli-extension)
* An instance of **Azure Spring Cloud** with a running application, for example [Spring Cloud app](./spring-cloud-quickstart-launch-app-cli.md)

## Use CLI to tail logs

To avoid repeatedly specifying your resource group and service instance name, set your default resource group name and cluster name.
```
az configure --defaults group=<service group name>
az configure --defaults spring-cloud=<service instance name>
```
In following examples, the resource group and service name will be omitted in the commands.

### Tail log for app with single instance
If an app named auth-service has only one instance, you can view the instance log with following command:
```
az spring-cloud app log tail -n  auth-service
```
This will return logs:
```
...
2020-01-15 01:54:40.481  INFO [auth-service,,,] 1 --- [main] o.apache.catalina.core.StandardService  : Starting service [Tomcat]
2020-01-15 01:54:40.482  INFO [auth-service,,,] 1 --- [main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.22]
2020-01-15 01:54:40.760  INFO [auth-service,,,] 1 --- [main] o.a.c.c.C.[Tomcat].[localhost].[/uaa]  : Initializing Spring embedded WebApplicationContext
2020-01-15 01:54:40.760  INFO [auth-service,,,] 1 --- [main] o.s.web.context.ContextLoader  : Root WebApplicationContext: initialization completed in 7203 ms

...
```

### Tail log for app with multiple instances
If multiple instances exist for the app named `auth-service`, you can view the instance log by using the `-i/--instance` option. If the service auth-service has an instance named with auth-service-default-12-75cc4577fc-pw7hb, you can query with the following command.
```
az spring-cloud app log tail -n  auth-service -i auth-service-default-12-75cc4577fc-pw7hb
```
You can also get the app instances from the Azure portal. 
1. Navigate to your resource group and select your Azure Spring Cloud instance.
1. From the Azure Spring Cloud instance overview select **Apps** in the left navigation pane.
1. Select your app, and then click **App Instances** in the left navigation pane. 
1. App instances will be displayed.

### Follow option to track new logs
By default, CLI will only print the existing log to console without following new logs. If you need to track the new logs, use `-f(--follow)` to track the new logs:
```
az spring-cloud app log tail -n  auth-service -f
``` 
### More options
To check all the logging options supported:
``` 
az spring-cloud app log tail -h 
```

## Next steps

* [Analyze logs and metrics with diagnostics settings](./diagnostic-services.md)

 





