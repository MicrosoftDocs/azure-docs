---
title: "Quickstart: Launch application using Maven | Microsoft Docs"
description: Launch sample application using Maven
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

Azure Spring Cloud Maven plugin allows you to easily create and update your Azure Spring Cloud service applications. By pre-defining a configuration, you can deploy applications to your already existing Azure Spring Cloud service. In this article, we use a sample application called PiggyMetrics to demonstrate this feature.

## Prerequisites
1. [Install Git](https://git-scm.com/)
2. [Install Maven 3.0 or above](https://maven.apache.org/download.cgi)

## Provision service instance

Please refer this [document](./spring-cloud-quickstart-launch-app-portal) to provision service instance and set your config server.


## Clone and build the sample application repository

1. Clone git repository by running below command.
    ```
    git clone https://github.com/Azure-Samples/PiggyMetrics
    ```
  
1. Change directory and build the project by running below command.
    ```
    cd PiggyMetrics
    mvn clean package -DskipTests
    ```

## Generate and deploy the Azure Spring Cloud configuration

1. Add the following to your `pom.xml` or `settings.xml` to enable Maven to work with Azure Spring Cloud.

```xml
<pluginRepositories>
  <pluginRepository>
    <id>maven.snapshots</id>
    <name>Maven Central Snapshot Repository</name>
    <url>https://oss.sonatype.org/content/repositories/snapshots/</url>
    <releases>
      <enabled>false</enabled>
    </releases>
    <snapshots>
      <enabled>true</enabled>
    </snapshots>
  </pluginRepository>
</pluginRepositories>
```

1. Generate configuration by running the below command.

    ```
    mvn com.microsoft.azure:azure-spring-cloud-maven-plugin:0.1.0-SNAPSHOT:config
    ```

    1. Select the modules `gateway`,`auth-service`, and `account-service`

    1. Select your subscription and Azure Spring Cloud service cluster

    1. From the list of projects provided, enter the number that corresponds with `gateway` to give it public access.
    
    1. Confirm the configuration

1. Deploy the apps using the following command:

```
mvn com.microsoft.azure:azure-spring-cloud-maven-plugin:0.1.0-SNAPSHOT:deploy
```

1. You can access PiggyMetrics using the URL printed.
