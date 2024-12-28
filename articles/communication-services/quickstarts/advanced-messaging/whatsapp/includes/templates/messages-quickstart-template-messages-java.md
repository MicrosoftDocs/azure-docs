---
title: Include file
description: Include file
services: azure-communication-services
author: arifibrahim4
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 12/29/2024
ms.topic: include
ms.custom: include file
ms.author: armohamed
---

## Setting up

To set up an environment for sending messages, take the steps in the following sections.

[!INCLUDE [Setting up for Java Application](../java-application-setup.md)]

## Code examples
Follow these steps to add the necessary code snippets to the main function of your *App.java* file.
- TODO



## Run the code

1. Navigate to the directory that contains the **pom.xml** file and compile the project by using the `mvn` command.

   ```console
   mvn compile
   ```

1. Run the app by executing the following `mvn` command.

   ```console
   mvn exec:java -D"exec.mainClass"="com.communication.quickstart.App" -D"exec.cleanupDaemonThreads"="false"
   ```

## Full sample code

Find the finalized code for this quickstart on [GitHub](https://github.com/Azure/azure-sdk-for-java/tree/d668cb44f64d303e71d2ee72a8b0382896aa09d5/sdk/communication/azure-communication-messages/src/samples/java/com/azure/communication/messages/).
