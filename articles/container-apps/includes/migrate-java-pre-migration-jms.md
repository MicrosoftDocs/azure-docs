---
author: deepganguly
ms.author: deepganguly
ms.service: azure-container-apps
ms.topic: include
ms.date: 03/11/2026
---

Identify the brokers in use by looking in the build manifest (typically, a *pom.xml* or *build.gradle* file) for the relevant dependencies.

For example, a Spring Boot application that uses ActiveMQ typically contains this dependency in its *pom.xml* file:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-activemq</artifactId>
</dependency>
```

Spring Boot applications that use commercial brokers typically contain dependencies directly on the brokers' JMS driver libraries. Here's an example from a *build.gradle* file:

```json
    dependencies {
      ...
      compile("com.ibm.mq:com.ibm.mq.allclient:9.4.0.5")
      ...
    }
```

After you identify the brokers in use, find the corresponding settings. You typically find them in the *application.properties* and *application.yml* files in the application directory.

> [!NOTE]
> Microsoft recommends using the most secure authentication flow available. The authentication flow described in this procedure, such as for databases, caches, messaging, or AI services, requires a high degree of trust in the application and carries risks not present in other flows. Use this flow only when more secure options, like managed identities for passwordless or keyless connections, aren't viable. For local machine operations, prefer user identities for passwordless or keyless connections.

Here's an ActiveMQ example from an *application.properties* file:

```properties
spring.activemq.brokerurl=broker:(tcp://localhost:61616,network:static:tcp://remotehost:61616)?persistent=false&useJmx=true
spring.activemq.user=admin
spring.activemq.password=<password>
```

For more information on ActiveMQ configuration, see the [Spring Boot messaging documentation](https://docs.spring.io/spring-boot/reference/messaging/index.html).

Here's an IBM MQ example from an *application.yaml* file:

```yaml
ibm:
  mq:
    queueManager: qm1
    channel: dev.ORDERS
    connName: localhost(14)
    user: admin
    password: <password>
```

For more information on IBM MQ configuration, see the [IBM MQ Spring components documentation](https://github.com/ibm-messaging/mq-jms-spring#ibm-mq-jms-spring-components).
