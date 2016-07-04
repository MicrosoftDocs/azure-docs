<properties
	pageTitle="Installing the Azure Toolkit for Eclipse | Microsoft Azure"
	description="Learn how to install the Azure Toolkit for Eclipse."
	services=""
	documentationCenter="java"
	authors="rmcmurray"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="multiple"
	ms.workload="na"
	ms.tgt_pltfrm="multiple"
	ms.devlang="Java"
	ms.topic="article"
	ms.date="06/24/2016" 
	ms.author="robmcm"/>

<!-- Legacy MSDN URL = https://msdn.microsoft.com/library/azure/hh690946.aspx -->

# Installing the Azure Toolkit for Eclipse

The Azure Toolkit for Eclipse provides templates and functionality that allow you to easily create, develop, test, and deploy Azure applications using the Eclipse development environment. The Azure Toolkit for Eclipse is an Open Source project, whose source code is available under the MIT License from the project's site on GitHub at the following URL:

<https://github.com/microsoft/azure-tools-for-java>

The following steps show you how to install the Azure Toolkit for Eclipse.

[AZURE.INCLUDE [azure-toolkit-for-eclipse-prerequisites](../includes/azure-toolkit-for-eclipse-prerequisites.md)]

## To install the Azure Toolkit for Eclipse

1. Start Eclipse.

1. When Eclipse opens, click the **Help** menu, and then click **Install New Software**, as shown in the following illustration.

    ![Installing the Azure Toolkit for Eclipse][01]

1. In the **Available Software** dialog, within the **Work with** text box, type **http://dl.microsoft.com/eclipse** followed by the **Enter** key.

1. In the **Name** pane, check **Azure Toolkit for Eclipse**, and uncheck **Contact all update sites during install to find required software**. Your screen should appear similar to the following:

    ![Installing the Azure Toolkit for Eclipse][02]

1. If you expand the **Azure Toolkit for Eclipse**, you will see the following items:

    * **Application Insights Plugin for Java**: This component allows you to use Azure's telemetry logging and analysis services for your applications and server instances.
    * **Azure Access Control Services Filter**: This component provides support for authenticating application users with Azure ACS, enabling single sign-on scenarios and externalizing identity logic from the application.
    * **Azure Common Plugin**: This component provides the common functionality needed by other toolkit components.
    * **Azure Explorer for Eclipse**: This component provides the common functionality needed by other toolkit components.
    * **Azure Plugin for Eclipse with Java**: This component provides support for developing projects that help build, test and deploy Java applications for the Microsoft Azure cloud in Eclipse and via command line.
    * **Azure Web Apps Plugin with Java**: This component provides support for deploying Java web applications to Microsoft Azure Web App containers.
    * **Microsoft JDBC Driver 4.2 for SQL Server**: This component provides JDBC API for SQL Server and Microsoft Azure SQL Database for Java Platform Enterprise Edition 8.
    * **Package for Apache Qpid Client Libraries for JMS**: This component provides the JMS client component from the Apache Qpid project to enable your application to use AMQP messaging in Microsoft Azure.
    * **Package for Microsoft Azure Libraries for Java**: This component provides APIs for accessing Microsoft Azure services, such as storage, service bus, service runtime, etc.

1. Click **Next**. (If you experience unusual delays when installing the toolkit, ensure that **Contact all update sites during install to find required software** is unchecked.)

1. In the **Install Details** dialog, click **Next**.

    ![Review Installation Details][03]

1. In the **Review Licenses** dialog, review the terms of the license agreements. If you accept the terms of the license agreements, click **I accept the terms of the license agreements** and then click **Finish**. (The remaining steps assume you do accept the terms of the license agreements. If you do not accept the terms of the license agreements, exit the installation process.)

    ![Review Licenses][04]

    Eclipse will download and install the requisite packages.

    ![Installation Progress][05]

1. If prompted to restart Eclipse to complete installation, click **Yes**.

    ![Restart Prompt][06]

## See Also

For more information about the Azure Toolkits for Java IDEs, see the following links:

- [Azure Toolkit for Eclipse]
  - *Installing the Azure Toolkit for Eclipse (This Article)*
  - [Create a Hello World Web App for Azure in Eclipse]
  - [What's New in the Azure Toolkit for Eclipse]
- [Azure Toolkit for IntelliJ]
  - [Installing the Azure Toolkit for IntelliJ]
  - [Create a Hello World Web App for Azure in IntelliJ]
  - [What's New in the Azure Toolkit for IntelliJ]

For more information about using Azure with Java, see the [Azure Java Developer Center].

<!-- URL List -->

[Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse.md
[Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij.md
[Create a Hello World Web App for Azure in Eclipse]: ./app-service-web/app-service-web-eclipse-create-hello-world-web-app.md
[Create a Hello World Web App for Azure in IntelliJ]: ./app-service-web/app-service-web-intellij-create-hello-world-web-app.md
[Installing the Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse-installation.md
[Installing the Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij-installation.md
[What's New in the Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse-whats-new.md
[What's New in the Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij-whats-new.md

[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/

<!-- IMG List -->

[01]: ./media/azure-toolkit-for-eclipse-installation/eclipse-installation-01.png
[02]: ./media/azure-toolkit-for-eclipse-installation/eclipse-installation-02.png
[03]: ./media/azure-toolkit-for-eclipse-installation/eclipse-installation-03.png
[04]: ./media/azure-toolkit-for-eclipse-installation/eclipse-installation-04.png
[05]: ./media/azure-toolkit-for-eclipse-installation/eclipse-installation-05.png
[06]: ./media/azure-toolkit-for-eclipse-installation/eclipse-installation-06.png

