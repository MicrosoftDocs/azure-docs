---
title:  az spring cloud
description: Log streaming to view application logs instantly 
author:  MikeDodaro
ms.author: barbkess
ms.service: spring-cloud
ms.topic: how-to
ms.date: 01/14/2019
---

# Log Streaming

The log streaming feature makes application logs available instantly using CLI with limited range. To view logs out of range, see [Analyze logs and metrics with diagnostics settings](./diagnostic-services.md).

## Prerequisites

* Install the [Azure CLI extension](./spring-cloud-quickstart-launch-app-cli#install-the-azure-cli-extension)
* Launch [Spring Cloud app](./spring-cloud-launch-app-maven)

## Use CLI to tail logs

To avoid repeatedly specifying your resource group and service instance name, set your default resource group name and cluster name
```
az configure --defaults group=<service group name>
az configure --defaults spring-cloud=<service instance name>
```
In following examples, the resource group and service name will be omitted in the commands.

### Tail log for app with single instance
If an app named auth-service has only one instance, you can view the instance log with below command:
```
az spring-cloud app log tail -n  auth-service
```
This will return logs in the following format:
```
    at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:118) ~[spring-web-5.1.9.RELEASE.jar!/:5.1.9.RELEASE]
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:193) ~[tomcat-embed-core-9.0.22.jar!/:9.0.22]
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166) ~[tomcat-embed-core-9.0.22.jar!/:9.0.22]
    at org.springframework.cloud.sleuth.instrument.web.ExceptionLoggingFilter.doFilter(ExceptionLoggingFilter.java:50) ~[spring-cloud-sleuth-core-2.1.3.RELEASE.jar!/:2.1.3.RELEASE]
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:193) ~[tomcat-embed-core-9.0.22.jar!/:9.0.22]
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166) ~[tomcat-embed-core-9.0.22.jar!/:9.0.22]

    ...

    2020-01-14 20:51:08.678  INFO [auth-service,,,] 1 --- [trap-executor-0] c.n.d.s.r.aws.ConfigClusterResolver      : Resolving eureka endpoints via configuration
    2020-01-14 20:56:08.679  INFO [auth-service,,,] 1 --- [trap-executor-0] c.n.d.s.r.aws.ConfigClusterResolver      : Resolving eureka endpoints via configuration
    2020-01-14 21:01:08.679  INFO [auth-service,,,] 1 --- [trap-executor-0] c.n.d.s.r.aws.ConfigClusterResolver      : Resolving eureka endpoints via configuration
    2020-01-14 21:06:08.680  INFO [auth-service,,,] 1 --- [trap-executor-0] c.n.d.s.r.aws.ConfigClusterResolver      : Resolving eureka endpoints via configuration

    ...

```

### Tail log for app with multiple instances
If multiple instances exist for the app named auth-service, you can view the instance log with following command. The name `auth-service-default-12-75cc4577fc-pw7hb` identifies one of the instance of the app.
```
az spring-cloud app log tail -n  auth-service -i auth-service-default-12-75cc4577fc-pw7hb
```
### Follow log for app
By default, CLI will only print the existing log to console without following new logs. If you need to track the new logs, use -f(--follow) to track the new logs:
```
az spring-cloud app log tail -n  auth-service -f
``` 
### More options
To see all the logging options supported:
``` 
az spring-cloud app log tail -h 
```

## Next steps

* [Analyze logs and metrics with diagnostics settings](./diagnostic-services.md)

 





