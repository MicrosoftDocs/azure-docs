---
title: Configure Azure Monitor Application Insights for Spring Boot
description: How to configure Azure Monitor Application Insights for Spring Boot applications
ms.topic: conceptual
ms.date: 06/22/2022
ms.devlang: java
ms.custom: devx-track-java
---

# Configure Azure Monitor Application Insights for Spring Boot

You can enable the Azure Monitor Application Insights agent for Java by adding an argument to the JVM. When you can't do this, you can use a programmatic configuration. We detail these two configurations below. 

## Addition of a JVM argument 

### Usual case

Add the JVM arg `-javaagent:"path/to/applicationinsights-agent-3.4.0.jar"` somewhere before `-jar`, for example:

```
java -javaagent:"path/to/applicationinsights-agent-3.4.0.jar" -jar <myapp.jar>
```

### Spring Boot via Docker entry point

If you're using the *exec* form, add the parameter `-javaagent:"path/to/applicationinsights-agent-3.4.0.jar"` to the parameter list somewhere before the `"-jar"` parameter, for example:

```
ENTRYPOINT ["java", "-javaagent:path/to/applicationinsights-agent-3.4.0.jar", "-jar", "<myapp.jar>"]
```

If you're using the *shell* form, add the JVM arg `-javaagent:"path/to/applicationinsights-agent-3.4.0.jar"` somewhere before `-jar`, for example:

```
ENTRYPOINT java -javaagent:"path/to/applicationinsights-agent-3.4.0.jar" -jar <myapp.jar>
```

## Programmatic configuration

To use the programmatic configuration and attach the Application Insights agent for Java during the application startup, you must add the following dependency.
```xml
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>applicationinsights-runtime-attach</artifactId>
    <version>3.4.0</version>
</dependency>
```

And invoke the `attach()` method of the `com.microsoft.applicationinsights.attach.ApplicationInsights` class.

> [!WARNING]
> 
> JRE is not supported.

> [!WARNING]
>
> Read-only file system is not supported.

> [!WARNING]
> 
> The invocation must be requested at the beginning of the `main` method.

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

If you want to use a JSON configuration: 
* The `applicationinsights.json` file has to be in the classpath
* Or you can use an environmental variable or a system property, more in the _Configuration file path_ part on [this page](../app/java-standalone-config.md). Spring properties defined in a Spring _.properties_ file are not supported.


> [!TIP]
> With a programmatic configuration, the `applicationinsights.log` file containing the agent logs is located in the directory from where the JVM is launched (user directory). This default behavior can be changed (see the _Self-diagnostics_ part of [this page](../app/java-standalone-config.md)).
