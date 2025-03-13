---
title: Include file
description: Include file
services: azure-communication-services
author: arifibrahim4
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 02/29/2024
ms.topic: include
ms.custom: include file
ms.author: armohamed
---

### Create a new Java application

Open a terminal or command window and navigate to the directory where you want to create your Java application. Run the following command to generate the Java project from the `maven-archetype-quickstart` template.

```console
mvn archetype:generate -DgroupId="com.communication.quickstart" -DartifactId="communication-quickstart" -DarchetypeArtifactId="maven-archetype-quickstart" -DarchetypeVersion="1.4" -DinteractiveMode="false"
```

The `generate` goal creates a directory with the same name as the `artifactId` value. Under this directory, the `src/main/java` directory contains the project source code, the `src/test/java` directory contains the test source, and the `pom.xml` file is the project's Project Object Model (POM).

### Install the package

Open the `pom.xml` file in your text editor. Add the following dependency element to the group of dependencies.

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-messages</artifactId>
</dependency>
```

### Set up the app framework

Open `/src/main/java/com/communication/quickstart/App.java` in a text editor, add import directives, and remove the `System.out.println("Hello world!");` statement:

```java
package com.communication.quickstart;

import com.azure.communication.messages.*;
import com.azure.communication.messages.models.*;

import java.util.ArrayList;
import java.util.List;
public class App
{
    public static void main( String[] args )
    {
        // Quickstart code goes here.
    }
}
```
