---
title: Overview of Azure Managed Service for Spring Cloud | Microsoft Docs
description: An overview of Azure's Managed Service for Spring Cloud, which automates many aspects of deploying Java microservice applications made in Spring and provides tools for managing others.
services: spring-cloud
author: v-vasuke
manager: jeconnoc
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 07/17/2019
ms.author: v-vasuke

---

# Quickstart: Azure Spring Cloud Maven plugin

Azure Spring Cloud Maven plugin allows you to easily create and update your Azure Spring Cloud service applications. By pre-defining a configuration, you can deploy applications to your already existing Azure Spring Cloud service. 

## Prerequisites
1. [Install Git](https://git-scm.com/)
2. [Install JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
3. [Install Maven 3.0 or above](https://maven.apache.org/download.cgi)


## Add the Azure Spring Cloud plugin to your Maven environment

Add the bug bash maven repository in maven `setting.xml` ???

1. Add the following to ${MAVEN_HOME}\conf\settings.xml `<servers>`
```xml
    <server>
    <id>dev-azure-com-hanli-private-hanli-private</id>
    <username>hanli-private</username>
    <!-- Treat this auth token like a password. Do not share it with anyone, including Microsoft support. -->
    <!-- The generated token expires on or before 11/25/2019 -->
    <password>urfsscogzt6kukqphs3f3ofxop25nsj4zouerqkwil44qujdt4bq</password>
    </server>
```

2. Add the following to ${MAVEN_HOME}\conf\settings.xml `<profiles>`
```xml
<profile>
    <id>common</id>
    <activation>
    <activeByDefault>true</activeByDefault>
    </activation>
    <pluginRepositories>
    <pluginRepository>
        <id>dev-azure-com-hanli-private-hanli-private</id>
        <url>https://pkgs.dev.azure.com/hanli-private/_packaging/hanli-private/maven/v1</url>
        <releases>
        <enabled>true</enabled>
        </releases>
        <snapshots>
        <enabled>true</enabled>
        </snapshots>
    </pluginRepository>
    </pluginRepositories>
    <repositories>
    <repository>
        <id>dev-azure-com-hanli-private-hanli-private</id>
        <url>https://pkgs.dev.azure.com/hanli-private/_packaging/hanli-private/maven/v1</url>
        <releases>
        <enabled>true</enabled>
        </releases>
        <snapshots>
        <enabled>true</enabled>
        </snapshots>
    </repository>
    </repositories>
</profile>
```

## Provision service instance

Please refer this [document](https://github.com/Azure/azure-managed-service-for-spring-cloud-docs#provision-service-instance) to provision service instance and set config server. ???

## Build and Deploy microservices applications

1. Clone git repository by running below command.

    ```
    git clone https://github.com/xscript/PiggyMetrics
    ```

1. Change directory and build the project by running below command.
    ```
    cd PiggyMetrics
    mvn clean package -DskipTests
    ```

1. Generate configuration by run `mvn com.microsoft.azure:azure-spring-maven-plugin:0.0.1-SNAPSHOT:config`

    1. Select module `gateway`,`auth-service` and `account-service`

        ![](../images/maven-quickstart/SelectChildModules.png)

    1. Select your subscription and spring cloud service cluster

    1. Expose public access to gateway

        ![](../images/maven-quickstart/ExposePublicAccess.png)

    1. Confirm the configuration

1. Deploy the above apps with the following command

    ``` 
    mvn com.microsoft.azure:azure-spring-maven-plugin:0.0.1-SNAPSHOT:deploy
    ```

1. You may access Piggy Metrics with the url printed in above command

### Next Steps

Learn more about Azure Managed Service for Spring Cloud by reading below links.
- [HOW-TO guide of using Azure Managed Service for Spring Cloud](./docs/how-to.md)
- [Developer Guide](./docs/dev-guide.md)
- [FAQ](./docs/faq.md)
