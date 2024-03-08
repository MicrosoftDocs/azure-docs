---
title: Application Insights with containers
description: This article shows you how to set up Application Insights.
ms.topic: conceptual
ms.date: 12/20/2023
ms.devlang: java
ms.custom: devx-track-java, devx-track-extended-java
ms.reviewer: mmcc
---

# Get started (supplemental)

The following sections describe how to get started with Java autoinstrumentation for specific technical environments.

## Azure App Service

For more information, see [Application monitoring for Azure App Service and Java](./azure-web-apps-java.md).

## Azure Functions

For more information, see [Monitoring Azure Functions with Azure Monitor Application Insights](./monitor-functions.md#distributed-tracing-for-java-applications).

## Azure Spring Apps

For more information, see [Use Application Insights Java In-Process Agent in Azure Spring Apps](../../spring-apps/enterprise/how-to-application-insights.md).

## Containers

> [!NOTE]
> With Spring Boot Native Image applications, use the [Azure Monitor OpenTelemetry Distro / Application Insights in Spring Boot native image Java application](https://aka.ms/AzMonSpringNative) project instead of the Application Insights Java agent.

### Docker entrypoint

If you're using the *exec* form, add the parameter `-javaagent:"path/to/applicationinsights-agent-3.5.0.jar"` to the parameter list somewhere before the `"-jar"` parameter.

For example:

```
ENTRYPOINT ["java", "-javaagent:path/to/applicationinsights-agent-3.5.0.jar", "-jar", "<myapp.jar>"]
```

If you're using the *shell* form, add the Java Virtual Machine (JVM) arg `-javaagent:"path/to/applicationinsights-agent-3.5.0.jar"` somewhere before `-jar`.

For example:

```
ENTRYPOINT java -javaagent:"path/to/applicationinsights-agent-3.5.0.jar" -jar <myapp.jar>
```

### Dockerfile

A Dockerfile example:

```
FROM ...

COPY target/*.jar app.jar

COPY agent/applicationinsights-agent-3.5.0.jar applicationinsights-agent-3.5.0.jar 

COPY agent/applicationinsights.json applicationinsights.json

ENV APPLICATIONINSIGHTS_CONNECTION_STRING="CONNECTION-STRING"
        
ENTRYPOINT["java", "-javaagent:applicationinsights-agent-3.5.0.jar", "-jar", "app.jar"]
```

In this example, we copy the `applicationinsights-agent-3.5.0.jar` and `applicationinsights.json` files from an `agent` folder (you can choose any folder of your machine). These two files have to be in the same folder in the Docker container.

### Partner container images

If you're using a partner container image that you can't modify, mount the Application Insights Java agent jar into the container from outside. Set the environment variable for the container
`JAVA_TOOL_OPTIONS=-javaagent:/path/to/applicationinsights-agent.jar`.

## Spring Boot

For more information, see [Using Azure Monitor Application Insights with Spring Boot](./java-spring-boot.md).

## Java Application servers

For information on setting up the Application Insights Java agent, see [Enabling Azure Monitor OpenTelemetry for Java](./opentelemetry-enable.md?tabs=java). The following sections provide details that might be helpful when configuring the `-javaagent:...` JVM arg on different application servers.

### Tomcat 8 (Linux)

#### Tomcat installed via apt-get or yum

If you installed Tomcat via `apt-get` or `yum`, you should have a file `/etc/tomcat8/tomcat8.conf`. Add this line to the end of that file:

```
JAVA_OPTS="$JAVA_OPTS -javaagent:path/to/applicationinsights-agent-3.5.0.jar"
```

#### Tomcat installed via download and unzip

If you installed Tomcat via download and unzip from [https://tomcat.apache.org](https://tomcat.apache.org), you should have a file `<tomcat>/bin/catalina.sh`. Create a new file in the same directory named `<tomcat>/bin/setenv.sh` with the following content:

```
CATALINA_OPTS="$CATALINA_OPTS -javaagent:path/to/applicationinsights-agent-3.5.0.jar"
```

If the file `<tomcat>/bin/setenv.sh` already exists, modify that file and add `-javaagent:path/to/applicationinsights-agent-3.5.0.jar` to `CATALINA_OPTS`.

### Tomcat 8 (Windows)

#### Run Tomcat from the command line

Locate the file `<tomcat>/bin/catalina.bat`. Create a new file in the same directory named `<tomcat>/bin/setenv.bat` with the following content:

```
set CATALINA_OPTS=%CATALINA_OPTS% -javaagent:path/to/applicationinsights-agent-3.5.0.jar
```

Quotes aren't necessary, but if you want to include them, the proper placement is:

```
set "CATALINA_OPTS=%CATALINA_OPTS% -javaagent:path/to/applicationinsights-agent-3.5.0.jar"
```

If the file `<tomcat>/bin/setenv.bat` already exists, modify that file and add `-javaagent:path/to/applicationinsights-agent-3.5.0.jar` to `CATALINA_OPTS`.

#### Run Tomcat as a Windows service

Locate the file `<tomcat>/bin/tomcat8w.exe`. Run that executable and add `-javaagent:path/to/applicationinsights-agent-3.5.0.jar` to the `Java Options` under the `Java` tab.

### JBoss EAP 7

In Red Hat JBoss Enterprise Application Platform (EAP) 7, you can set up a standalone server or a domain server.

#### Standalone server

Add `-javaagent:path/to/applicationinsights-agent-3.5.0.jar` to the existing `JAVA_OPTS` environment variable in the file `JBOSS_HOME/bin/standalone.conf` (Linux) or `JBOSS_HOME/bin/standalone.conf.bat` (Windows):

```java    ...
    JAVA_OPTS="-javaagent:path/to/applicationinsights-agent-3.5.0.jar -Xms1303m -Xmx1303m ..."
    ...
```

#### Domain server

Add `-javaagent:path/to/applicationinsights-agent-3.5.0.jar` to the existing `jvm-options` in `JBOSS_HOME/domain/configuration/host.xml`:

```xml
...
<jvms>
    <jvm name="default">
        <heap size="64m" max-size="256m"/>
        <jvm-options>
            <option value="-server"/>
            <!--Add Java agent jar file here-->
            <option value="-javaagent:path/to/applicationinsights-agent-3.5.0.jar"/>
            <option value="-XX:MetaspaceSize=96m"/>
            <option value="-XX:MaxMetaspaceSize=256m"/>
        </jvm-options>
    </jvm>
</jvms>
...
```

If you're running multiple managed servers on a single host, you need to add `applicationinsights.agent.id` to the `system-properties` for each `server`:

```xml
...
<servers>
    <server name="server-one" group="main-server-group">
        <!--Edit system properties for server-one-->
        <system-properties> 
            <property name="applicationinsights.agent.id" value="..."/>
        </system-properties>
    </server>
    <server name="server-two" group="main-server-group">
        <socket-bindings port-offset="150"/>
        <!--Edit system properties for server-two-->
        <system-properties>
            <property name="applicationinsights.agent.id" value="..."/> 
        </system-properties>
    </server>
</servers>
...
```

The specified `applicationinsights.agent.id` value must be unique. The value creates a subdirectory under the Application Insights directory. Each JVM process needs its own local Application Insights config and local Application Insights log file. Also, if reporting to the central collector, multiple managed servers share the `applicationinsights.properties` file, so the specified `applicationinsights.agent.id` is needed to override the `agent.id` setting in that shared file. The `applicationinsights.agent.rollup.id` can be similarly specified in the server's `system-properties` if you need to override the `agent.rollup.id` setting per managed server.

### Jetty 9

Add these lines to `start.ini`:

```
--exec
-javaagent:path/to/applicationinsights-agent-3.5.0.jar
```

### Payara 5

Add `-javaagent:path/to/applicationinsights-agent-3.5.0.jar` to the existing `jvm-options` in `glassfish/domains/domain1/config/domain.xml`:

```xml
...
<java-config ...>
    <!--Edit the JVM options here-->
    <jvm-options>
        -javaagent:path/to/applicationinsights-agent-3.5.0.jar>
    </jvm-options>
        ...
</java-config>
...
```

### WebSphere 8

1. Open Management Console.
1. Go to **Servers** > **WebSphere application servers** > **Application servers**. Choose the appropriate application servers, and then select **Java and Process Management** > **Process definition** >  **Java Virtual Machine**.

1. For **Generic JVM arguments**, add the following JVM argument.

    ```java
    -javaagent:path/to/applicationinsights-agent-3.5.0.jar
    ```

1. Select **Save**, and then restart the application server.

### OpenLiberty 18

In the server directory  (for example, in `<openliberty>/usr/servers/defaultServer`), create a new file named *jvm.options*. Add this line:

```java
-javaagent:path/to/applicationinsights-agent-3.5.0.jar
```

### Others

To learn how to add JVM args, see your application server documentation.
