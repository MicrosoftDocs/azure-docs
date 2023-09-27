---
title: Configure Azure Monitor Application Insights for Spring Boot
description: How to configure Azure Monitor Application Insights for Spring Boot applications
ms.topic: conceptual
ms.date: 09/18/2023
ms.devlang: java
ms.custom: devx-track-java, devx-track-extended-java
---

# Using Azure Monitor Application Insights with Spring Boot

There are two options for enabling Application Insights Java with Spring Boot: JVM argument and programmatically.

## Enabling with JVM argument 

Add the JVM arg `-javaagent:"path/to/applicationinsights-agent-3.4.17.jar"` somewhere before `-jar`, for example:

```
java -javaagent:"path/to/applicationinsights-agent-3.4.17.jar" -jar <myapp.jar>
```

### Spring Boot via Docker entry point

If you're using the *exec* form, add the parameter `-javaagent:"path/to/applicationinsights-agent-3.4.17.jar"` to the parameter list somewhere before the `"-jar"` parameter, for example:

```
ENTRYPOINT ["java", "-javaagent:path/to/applicationinsights-agent-3.4.17.jar", "-jar", "<myapp.jar>"]
```

If you're using the *shell* form, add the JVM arg `-javaagent:"path/to/applicationinsights-agent-3.4.17.jar"` somewhere before `-jar`, for example:

```
ENTRYPOINT java -javaagent:"path/to/applicationinsights-agent-3.4.17.jar" -jar <myapp.jar>
```

### Configuration

See [configuration options](./java-standalone-config.md).

## Enabling programmatically

To enable Application Insights Java programmatically, you must add the following dependency:

```xml
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>applicationinsights-runtime-attach</artifactId>
    <version>3.4.17</version>
</dependency>
```

And invoke the `attach()` method of the `com.microsoft.applicationinsights.attach.ApplicationInsights` class
in the first line of your `main()` method.

> [!WARNING]
>
> The invocation must be at the beginning of the `main` method.

> [!WARNING]
> 
> JRE is not supported.

> [!WARNING]
>
> The temporary directory of the operating system should be writable.

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

Programmatic enablement supports all the same [configuration options](./java-standalone-config.md)
as the JVM argument enablement, with the following differences below.

#### Configuration file location

By default, when enabling Application Insights Java programmatically, the configuration file `applicationinsights.json`
will be read from the classpath (`src/main/resources`, `src/test/resources`).

From 3.4.3, you can configure the name of a JSON file in the classpath with the `applicationinsights.runtime-attach.configuration.classpath.file` system property.
For example, with `-Dapplicationinsights.runtime-attach.configuration.classpath.file=applicationinsights-dev.json`, Application Insights will use `applicationinsights-dev.json` file for configuration.

> [!NOTE]
> Spring's `application.properties` or `application.yaml` files are not supported as
> as sources for Application Insights Java configuration.

See [configuration file path configuration options](./java-standalone-config.md#configuration-file-path)
to change the location for a file outside the classpath.

#### Structure of applicationinsights-dev.json

```json
{
  "connectionString":"Your-Intrumentation-Key"
}
```

#### Self-diagnostic log file location

By default, when enabling Application Insights Java programmatically, the `applicationinsights.log` file containing
the agent logs will be located in the directory from where the JVM is launched (user directory).

See [self-diagnostic configuration options](./java-standalone-config.md#self-diagnostics) to change this location.
