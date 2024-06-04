---
title: Configure Azure Monitor Application Insights for Spring Boot
description: How to configure Azure Monitor Application Insights for Spring Boot applications
ms.topic: conceptual
ms.date: 04/22/2024
ms.devlang: java
ms.custom: devx-track-java, devx-track-extended-java
---

# Using Azure Monitor Application Insights with Spring Boot

> [!NOTE]
> With _Spring Boot native image applications_, you can use [this project](https://aka.ms/AzMonSpringNative).

There are two options for enabling Application Insights Java with Spring Boot: Java Virtual Machine (JVM) argument and programmatically.

## Enabling with JVM argument 

Add the JVM arg `-javaagent:"path/to/applicationinsights-agent-3.5.2.jar"` somewhere before `-jar`, for example:

```console
java -javaagent:"path/to/applicationinsights-agent-3.5.2.jar" -jar <myapp.jar>
```

### Spring Boot via Docker entry point

See the [documentation related to containers](./java-get-started-supplemental.md).

### Configuration

See [configuration options](./java-standalone-config.md).

## Enabling programmatically

To enable Application Insights Java programmatically, you must add the following dependency:

```xml
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>applicationinsights-runtime-attach</artifactId>
    <version>3.5.2</version>
</dependency>
```

And invoke the `attach()` method of the `com.microsoft.applicationinsights.attach.ApplicationInsights` class that's in the beginning line of your `main()` method.

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

Programmatic enablement supports all the same [configuration options](./java-standalone-config.md) as the JVM argument enablement, with the differences that are described in the next sections.

#### Configuration file location

By default, when enabling Application Insights Java programmatically, the configuration file `applicationinsights.json`
is read from the classpath (`src/main/resources`, `src/test/resources`).

From 3.4.3, you can configure the name of a JSON file in the classpath with the `applicationinsights.runtime-attach.configuration.classpath.file` system property.
For example, with `-Dapplicationinsights.runtime-attach.configuration.classpath.file=applicationinsights-dev.json`, Application Insights uses the `applicationinsights-dev.json` file for configuration. To programmatically configure another file in the classpath:

```java
public static void main(String[] args) {
    System.setProperty("applicationinsights.runtime-attach.configuration.classpath.file", "applicationinsights-dev.json");
    ApplicationInsights.attach();
    SpringApplication.run(PetClinicApplication.class, args);
}
```

> [!NOTE]
> Spring's `application.properties` or `application.yaml` files are not supported as
> as sources for Application Insights Java configuration.

See [configuration file path configuration options](./java-standalone-config.md#configuration-file-path)
to change the location for a file outside the classpath.

To programmatically configure a file outside the classpath:
```java
public static void main(String[] args) {
    System.setProperty("applicationinsights.configuration.file", "{path}/applicationinsights-dev.json");
    ApplicationInsights.attach();
    SpringApplication.run(PetClinicApplication.class, args);
}
```

#### Programmatically configure the connection string

First, add the `applicationinsights-core` dependency:

```xml
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>applicationinsights-core</artifactId>
    <version>3.5.2</version>
</dependency>
```

Then, call the `ConnectionString.configure` method after `ApplicationInsights.attach()`:

```java
public static void main(String[] args) {
    System.setProperty("applicationinsights.configuration.file", "{path}/applicationinsights-dev.json");
    ApplicationInsights.attach();
    SpringApplication.run(PetClinicApplication.class, args);
}
```
Alternatively, call the  `ConnectionString.configure` method from a Spring component.

Enable connection string configured at runtime:

```json
{
  "connectionStringConfiguredAtRuntime": true
}
```

#### Self-diagnostic log file location

By default, when enabling Application Insights Java programmatically, the `applicationinsights.log` file containing the agent logs are located in the directory from where the JVM is launched (user directory).

To learn how to change this location, see your [self-diagnostic configuration options](./java-standalone-config.md#self-diagnostics).
