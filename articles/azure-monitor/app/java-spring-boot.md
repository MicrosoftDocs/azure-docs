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

Add the JVM arg `-javaagent:path/to/applicationinsights-agent-3.2.11.jar` somewhere before `-jar`, for example:

```
java -javaagent:path/to/applicationinsights-agent-3.2.11.jar -jar <myapp.jar>
```

### Spring Boot via Docker entry point

If you're using the *exec* form, add the parameter `"-javaagent:path/to/applicationinsights-agent-3.2.11.jar"` to the parameter list somewhere before the `"-jar"` parameter, for example:

```
ENTRYPOINT ["java", "-javaagent:path/to/applicationinsights-agent-3.2.11.jar", "-jar", "<myapp.jar>"]
```

If you're using the *shell* form, add the JVM arg `-javaagent:path/to/applicationinsights-agent-3.2.11.jar` somewhere before `-jar`, for example:

```
ENTRYPOINT java -javaagent:path/to/applicationinsights-agent-3.2.11.jar -jar <myapp.jar>
```

## Programmatic configuration

To use the programmatic configuration and attach the Application Insights agent for Java during the application startup, you must add the following dependency.
```xml
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>applicationinsights-runtime-attach</artifactId>
    <version>3.3.0</version>
</dependency>
```

And invoke the `attach()` method of the `com.microsoft.applicationinsights.attach.ApplicationInsights` class.

> [!TIP]
> ⚠ The invocation  must be requested at the beginning of the `main` method.

We provide you an example below:

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
* Or you can use an environmental variable or a system property, more in the _Configuration file path_ part on [this page](../app/java-standalone-config.md).


> [!TIP]
> To allow potential investigations on Application Insights agent for Java, please provide a  path to `applicationinsights.log`. More on [this page](../app/java-standalone-config.md) in the _Self-diagnostics_ part.