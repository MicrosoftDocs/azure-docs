<properties 
	pageTitle="Download the Azure SDK for Java" 
	description="Learn how to download the Azure SDK for Java, with sample code provided for Maven projects and basic installation steps for the Azure Tookit for Eclipse." 
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
	ms.date="08/11/2016" 
	ms.author="robmcm"/>

# Download the Azure SDK for Java

This article contains instructions for downloading and installing the Azure Libraries for Java.

**Note:** The Azure Libraries for Java are distributed under the [Apache License, Version 2.0][license].

## Azure Libraries for Java - Manual Download

To manually install the Azure Libraries for Java, click <http://go.microsoft.com/fwlink/?LinkId=690320> to download a ZIP file which contains all of the libraries and all dependencies.

Once you have downloaded the zip file to your computer, extract the contents and use one of the following options to add the JAR files to your project:

* Import the JAR files into your Java project in Eclipse.

* Configure the **Build Path** for your Java project in Eclipse to include the path to the JAR files.

For detailed information on setting up build paths in Eclipse, see the [Java Build Path] article at the Eclipse website.

**Note:** See the license.txt and ThirdPartyNotices.txt file file inside the ZIP for license and other information.

## Azure Libraries for Java - Building with Maven

### Step 1 - Set up your project to use Maven for build

To create Maven projects in Eclipse which use the Azure libraries for Java, following the instructions in the [Getting Started with Azure Management Libraries for Java][maven-getting-started] article. 

### Step 2 - Configure your Maven settings with the requisite dependencies

Once your project has been configured to use Maven for build, you can add the the requisite dependencies to your pom.xml file using syntax like the following example. Note that you do not need to add every dependency that is listed in the following example; you only need to add the specific dependencies which your project requires.

> [AZURE.NOTE] Within each `<version>` element in the following sample, replace the "n.n.n" placeholders in this example with valid version numbers, which can be obtained from the [Azure Libraries Repository on Maven].

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

## Installing the Azure Toolkit for Eclipse

This section contains basic instructions for installing the Azure Toolkit for Eclipse; for detailed instructions, see [Installing the Azure Toolkit for Eclipse].

### Prerequisites

1. Windows operting systems listed in the [What's New in the Azure Toolkit for Eclipse] article.
1. Macintosh or Linux operting systems listed in the [What's New in the Azure Toolkit for Eclipse] article.
1. Eclipse IDE for Java EE Developers, Indigo or later. This can be downloaded from <http://www.eclipse.org/downloads/>.

### Basic Installation steps

1. In Eclipse, from the **Help** menu, select **Install New Software**.
1. Enter the site location <http://dl.microsoft.com/eclipse> and press **Enter**.
1. Select the items to be installed and click **Finish**.

The Azure Toolkit for Eclipse uses the latest version of the Azure SDK. This can be downloaded using the Web Platform Installer (WebPI) at <http://go.microsoft.com/fwlink/?LinkID=252838>. However, if you don't have it installed, when you create your first Azure deployment project, the Azure Toolkit for Eclipse will automatically install the appropriate version of the Azure SDK.

## See Also

[Azure Toolkit for Eclipse]

[Installing the Azure Toolkit for Eclipse] 

[Creating a Hello World Application for Azure in Eclipse]

For more information about using Azure with Java, see the [Azure Java Developer Center].

<!-- URL List -->

[Azure Java Developer Center]: http://go.microsoft.com/fwlink/?LinkID=699547
[Azure Libraries Repository on Maven]: http://go.microsoft.com/fwlink/?LinkID=286274
[Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699529
[Creating a Hello World Application for Azure in Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699533
[Installing the Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkId=699546
[Java Build Path]: http://help.eclipse.org/luna/index.jsp?topic=%2Forg.eclipse.jdt.doc.user%2Freference%2Fref-properties-build-path.htm
[license]: http://www.apache.org/licenses/LICENSE-2.0.html
[maven-getting-started]: http://go.microsoft.com/fwlink/?LinkID=622998
[zip-download]: http://go.microsoft.com/fwlink/?LinkId=690320
[What's New in the Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkId=690333
