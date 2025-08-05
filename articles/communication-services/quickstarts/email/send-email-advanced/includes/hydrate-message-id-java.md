---
title: include file
description: Hydrate messageId using using EmailClient for Java
author: fanruisun-msft
manager: koagbakp
services: azure-communication-services
ms.author: fanruisun
ms.date: 08/04/2025
ms.topic: include
ms.service: azure-communication-services
---

## Hydrate messageId using using EmailClient for Java

Use the Azure Communication Services Email SDK for Java. Add the following dependency to your `pom.xml` file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.communication.quickstart</groupId>
    <artifactId>hydrate-message-id-quickstart</artifactId>
    <version>1.0-SNAPSHOT</version>

  <name>send-email</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

  <repositories>
    <repository>
      <id>azure-sdk-for-java</id>
      <url>https://pkgs.dev.azure.com/azure-sdk/public/_packaging/azure-sdk-for-java/maven/v1</url>
      <releases>
        <enabled>true</enabled>
      </releases>
      <snapshots>
        <enabled>true</enabled>
      </snapshots>
    </repository>
  </repositories>

  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-communication-email</artifactId>
      <version>1.2.0-beta.1</version>
    </dependency>
    <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-communication-common</artifactId>
      <version>1.2.0</version>
    </dependency>

  </dependencies>

  <build>
    <pluginManagement><!-- lock down plugins versions to avoid using Maven defaults (may be moved to parent pom) -->
      <plugins>
        <plugin>
          <artifactId>maven-assembly-plugin</artifactId>
          <configuration>
            <archive>
              <manifest>
                <mainClass>com.communication.email.App</mainClass>
              </manifest>
            </archive>
            <descriptorRefs>
              <descriptorRef>jar-with-dependencies</descriptorRef>
            </descriptorRefs>
          </configuration>
        </plugin>
        <!-- clean lifecycle, see https://maven.apache.org/ref/current/maven-core/lifecycles.html#clean_Lifecycle -->
        <plugin>
          <artifactId>maven-clean-plugin</artifactId>
          <version>3.1.0</version>
        </plugin>
        <!-- default lifecycle, jar packaging: see https://maven.apache.org/ref/current/maven-core/default-bindings.html#Plugin_bindings_for_jar_packaging -->
        <plugin>
          <artifactId>maven-resources-plugin</artifactId>
          <version>3.0.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-compiler-plugin</artifactId>
          <version>3.8.0</version>
        </plugin>
        <plugin>
          <artifactId>maven-surefire-plugin</artifactId>
          <version>2.22.1</version>
        </plugin>
        <plugin>
          <artifactId>maven-jar-plugin</artifactId>
          <version>3.0.2</version>
            <configuration>
              <archive>
                <manifest>
                  <addClasspath>true</addClasspath>
                  <mainClass>com.communication.email.App</mainClass>
                </manifest>
              </archive>
            </configuration>
        </plugin>
        <plugin>
          <artifactId>maven-install-plugin</artifactId>
          <version>2.5.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-deploy-plugin</artifactId>
          <version>2.8.2</version>
        </plugin>
        <!-- site lifecycle, see https://maven.apache.org/ref/current/maven-core/lifecycles.html#site_Lifecycle -->
        <plugin>
          <artifactId>maven-site-plugin</artifactId>
          <version>3.7.1</version>
        </plugin>
        <plugin>
          <artifactId>maven-project-info-reports-plugin</artifactId>
          <version>3.0.0</version>
        </plugin>
      </plugins>
    </pluginManagement>
  </build>
</project>
```

```java
package com.communication.email;
import java.time.Duration;

import com.azure.communication.email.EmailClientBuilder;
import com.azure.communication.email.EmailClient;
import com.azure.communication.email.models.EmailSendResult;
import com.azure.communication.email.models.EmailSendStatus;
import com.azure.communication.email.models.EmailMessage;
import com.azure.core.util.polling.SyncPoller;
import com.azure.core.util.polling.LongRunningOperationStatus;
import com.azure.core.util.polling.PollResponse;


public class App
{
    public static final Duration POLLER_WAIT_TIME = Duration.ofSeconds(10);

    public static void main( String[] args )
    {
        String connectionString = "<ACS_CONNECTION_STRING>";
        String senderAddress = "<SENDER_EMAIL_ADDRESS>";
        String recipientAddress = "<RECIPIENT_EMAIL_ADDRESS>";

        EmailClient client = new EmailClientBuilder()
                .connectionString(connectionString)
                .buildClient();

        EmailMessage message = new EmailMessage()
                .setSenderAddress(senderAddress)
                .setToRecipients(recipientAddress)
                .setSubject("Test email from Java Sample")
                .setBodyPlainText("This is plaintext body of test email.")
                .setBodyHtml("<html><h1>This is the html body of test email.</h1></html>");


        SyncPoller<EmailSendResult, EmailSendResult> poller = client.beginSend(message);
        PollResponse<EmailSendResult> response = poller.poll();
        String operationId = response.getValue().getId();
        System.out.printf("Sent email send request from first poller (operation id: %s)\n", operationId);

        System.out.print("Started polling from second poller\n");
        SyncPoller<EmailSendResult, EmailSendResult> poller2 = client.beginSend(operationId);
        PollResponse<EmailSendResult> response2 = poller2.waitForCompletion();

        System.out.printf("Successfully sent the email (operation id: %s)\n", poller2.getFinalResult().getId());
    }
}
```

### Sample code

You can download the sample app demonstrating this action from GitHub Azure Samples [Send Email Rehydrate Poller for Java](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/send-email-advanced/send-email-rehydrate-poller).
