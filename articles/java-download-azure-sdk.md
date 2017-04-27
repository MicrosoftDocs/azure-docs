---
title: Download the Azure SDK for Java | Microsoft Docs
description: Learn how to download the Azure SDK for Java, with sample code provided for Maven projects.
services: ''
documentationcenter: java
author: rmcmurray
manager: erikre
editor: ''

ms.assetid: 4b8f8fe6-1b26-4bb4-9be9-6ae757a59e66
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: multiple
ms.devlang: Java
ms.topic: article
ms.date: 04/25/2017
ms.author: robmcm;asirveda

---
# Download the Azure SDK for Java
This article contains instructions for downloading and installing the Azure Management Libraries for Java.

> [!NOTE]
> The Azure Management Libraries for Java are distributed under the [Apache License, Version 2.0][license].
>

## Azure Libraries for Java - Manual Download
To manually install the Azure Management Libraries for Java, click <http://go.microsoft.com/fwlink/?LinkId=690320> to download a ZIP file which contains all of the libraries and all dependencies.

Once you have downloaded the zip file to your computer, extract the contents and use one of the following options to add the JAR files to your project:

* Import the JAR files into your Java project in Eclipse or IntelliJ.
* Configure the build paths for your Java projects in Eclipse or IntelliJ to include the path to the JAR files.

> [!NOTE]
> See the license.txt and ThirdPartyNotices.txt file inside the ZIP for license and other information.
>

## Azure Management Libraries for Java - Building with Maven
### Step 1 - Set up your project to use Maven for build
To create Maven projects in Eclipse which use the Azure Management Libraries for Java, following the instructions in the [Getting Started with Azure Management Libraries for Java][maven-getting-started] article.

### Step 2 - Configure your Maven settings with the requisite dependencies
Once your project has been configured to use Maven for build, you can add the requisite dependencies to your pom.xml file using syntax like the following example. Note that you do not need to add every dependency that is listed in the following example; you only need to add the specific dependencies which your project requires.

> [!NOTE]
> Within each `<version>` element in the following sample, replace the "n.n.n" placeholders in this example with valid version numbers, which can be obtained from the [Azure Libraries Repository on Maven].
>
>

    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>azure-svc-mgmt</artifactId>
        <version>n.n.n</version>
    </dependency>
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>azure-svc-mgmt-compute</artifactId>
        <version>n.n.n</version>
    </dependency>
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>azure-svc-mgmt-network</artifactId>
        <version>n.n.n</version>
    </dependency>
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>azure-svc-mgmt-sql</artifactId>
        <version>n.n.n</version>
    </dependency>
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>azure-svc-mgmt-storage</artifactId>
        <version>n.n.n</version>
    </dependency>
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>azure-svc-mgmt-websites</artifactId>
        <version>n.n.n</version>
    </dependency>
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>azure-svc-mgmt-media</artifactId>
        <version>n.n.n</version>
    </dependency>
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>azure-servicebus</artifactId>
        <version>n.n.n</version>
    </dependency>
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>azure-serviceruntime</artifactId>
        <version>n.n.n</version>
    </dependency>

## See Also
For more information about the Azure Toolkits for Java IDEs, see the following links:

* [Azure Toolkit for Eclipse]
  * [Installing the Azure Toolkit for Eclipse]
  * [Create a Hello World Web App for Azure in Eclipse]
  * [What's New in the Azure Toolkit for Eclipse]
* [Azure Toolkit for IntelliJ]
  * [Installing the Azure Toolkit for IntelliJ]
  * [Create a Hello World Web App for Azure in IntelliJ]
  * [What's New in the Azure Toolkit for IntelliJ]

For more information about using Azure with Java, see the [Azure Java Developer Center].

> [!NOTE]
> For detailed information on setting up build paths in Eclipse, see the [Java Build Path] article at the Eclipse website.
>

<!-- URL List -->

[Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse.md
[Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij.md
[Create a Hello World Web App for Azure in Eclipse]: ./app-service-web/app-service-web-eclipse-create-hello-world-web-app.md
[Create a Hello World Web App for Azure in IntelliJ]: ./app-service-web/app-service-web-intellij-create-hello-world-web-app.md
[Installing the Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse-installation.md
[Installing the Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij-installation.md
[What's New in the Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse-whats-new.md
[What's New in the Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij-whats-new.md

[Azure Java Developer Center]: http://go.microsoft.com/fwlink/?LinkID=699547
[Azure Libraries Repository on Maven]: http://go.microsoft.com/fwlink/?LinkID=286274
[Java Build Path]: http://help.eclipse.org/luna/index.jsp?topic=%2Forg.eclipse.jdt.doc.user%2Freference%2Fref-properties-build-path.htm
[license]: http://www.apache.org/licenses/LICENSE-2.0.html
[maven-getting-started]: http://go.microsoft.com/fwlink/?LinkID=622998
