---
title: Configure Azure Monitor Application Insights for Spring Boot
description: How to configure Azure Monitor Application Insights for Spring Boot applications
ms.topic: conceptual
ms.date: 06/22/2022
ms.devlang: java
ms.custom: devx-track-java
---

# Using Azure Monitor Application Insights with Spring Boot

There are two options for enabling Application Insights Java with Spring Boot: JVM argument and programmatically.

## Enabling with JVM argument 

Add the JVM arg `-javaagent:"path/to/applicationinsights-agent-3.4.1.jar"` somewhere before `-jar`, for example:

```
java -javaagent:"path/to/applicationinsights-agent-3.4.1.jar" -jar <myapp.jar>
```

### Spring Boot via Docker entry point

If you're using the *exec* form, add the parameter `-javaagent:"path/to/applicationinsights-agent-3.4.1.jar"` to the parameter list somewhere before the `"-jar"` parameter, for example:

```
ENTRYPOINT ["java", "-javaagent:path/to/applicationinsights-agent-3.4.1.jar", "-jar", "<myapp.jar>"]
```

If you're using the *shell* form, add the JVM arg `-javaagent:"path/to/applicationinsights-agent-3.4.1.jar"` somewhere before `-jar`, for example:

```
ENTRYPOINT java -javaagent:"path/to/applicationinsights-agent-3.4.1.jar" -jar <myapp.jar>
```

### Configuration

See [configuration options](./java-standalone-config.md).

## Enabling programmatically

To enable Application Insights Java programmatically, you must add the following dependency:

```xml
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>applicationinsights-runtime-attach</artifactId>
    <version>3.4.1</version>
</dependency>
```

And invoke the `attach()` method of the `com.microsoft.applicationinsights.attach.ApplicationInsights` class
in the first line of your `main()` method.

> [!WARNING]
> 
> JRE is not supported.

> [!WARNING]
>
> Read-only file system is not supported.

> [!WARNING]
> 
> The invocation must be at the beginning of the `main` method.

Example:

```java
@SpringBootApplication
public class SpringBootApp {

  public static void main(String[] args) {
    ApplicationInsights.attach();
    SpringApplication.run(SpringBootApp.class, args);
  }
}
```

### Configuration

> [!NOTE]
> Spring's `application.properties` or `application.yaml` files are not supported as
> as sources for Application Insights Java configuration.

Programmatic enablement supports all the same [configuration options](./java-standalone-config.md)
as the JVM argument enablement, with the following differences below.

#### Configuration file location

By default, when enabling Application Insights Java programmatically, the configuration file `applicationinsights.json`
will be read from the classpath.

See [configuration file path configuration options](./java-standalone-config.md#configuration-file-path)
to change this location.

#### Self-diagnostic log file location

By default, when enabling Application Insights Java programmatically, the `applicationinsights.log` file containing
the agent logs will be located in the directory from where the JVM is launched (user directory).

See [self-diagnostic configuration options](./java-standalone-config.md#self-diagnostics) to change this location.
