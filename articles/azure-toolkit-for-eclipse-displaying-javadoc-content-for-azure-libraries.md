<properties
    pageTitle="Displaying Javadoc Content in Eclipse for the Azure Libraries Package for Java"
    description="How to display the Javadoc content for the Azure Libraries in Eclipse."
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

<!-- Legacy MSDN URL = https://msdn.microsoft.com/library/azure/hh698319.aspx -->

# Displaying Javadoc Content in Eclipse for the Azure Libraries Package for Java #

The Javadoc content for the Azure Libraries for Java can be viewed within your Eclipse environment by associating the Javadoc content to the Azure Libraries for Java. The following steps show you how to use this functionality within Eclipse.

This procedure assumes you have already added the Azure Library for Java to your build path.

## To display Javadoc content in Eclipse for the Azure Libraries for Java ##

* Within Eclipse's Project Explorer, in the **Referenced Libraries** section of your project, open the context menu for the Azure Library for Java JAR. For example, **microsoft-windowsazure-api-0.1.0.jar** (the version number may be different, dependent upon which version you have installed).
* Click **Properties**.
* Within the **Properties** dialog, in the left-hand pane, click **Javadoc Location**. The **Javadoc Location** dialog is displayed.
* You can specify a **Javadoc URL**, or a **Javadoc in archive**.
    * If you choose to specify a **Javadoc URL**, use the URLs such as **http://dl.windowsazure.com/javadoc** or **http://dl.windowsazure.com/storage/javadoc**.
    * If you choose to use **Javadoc in archive**, you can specify an external file, or a workspace file.
    Make your choice and browse/validate as needed. The following example associates the Azure Libraries for Java with the corresponding Javadoc JAR that has been downloaded locally to a folder named **c:\MyAzureJARs**.
    ![][ic553487]
* *Optional*: Click **Validate**. Potential issues with the Javadoc JAR could be displayed here.
* Click **OK**.

Once associated with the library, the Javadoc content should display within your Eclipse IDE. For example, if `blob` is defined of type `CloudBlockBlob` within your code, the following is an example of Javadoc content that appears when you type `blob.acquireLease` in code:

![][ic553488]

## See Also ##

[Azure Toolkit for Eclipse][]

[Creating a Hello World Application for Azure in Eclipse][]

[Installing the Azure Toolkit for Eclipse][] 

For more information about using Azure with Java, see the [Azure Java Developer Center][].

<!-- URL List -->

[Azure Java Developer Center]: http://go.microsoft.com/fwlink/?LinkID=699547
[Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699529
[Creating a Hello World Application for Azure in Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699533
[Installing the Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkId=699546

<!-- IMG List -->

[ic553487]: ./media/azure-toolkit-for-eclipse-displaying-javadoc-content-for-azure-libraries/ic553487.png
[ic553488]: ./media/azure-toolkit-for-eclipse-displaying-javadoc-content-for-azure-libraries/ic553488.png