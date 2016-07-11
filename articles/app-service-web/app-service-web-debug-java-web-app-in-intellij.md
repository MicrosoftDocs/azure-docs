<properties 
	pageTitle="Debug a Java Web App on Azure in IntelliJ | Microsoft Azure" 
	description="This tutorial shows you how to use the Azure Toolkit for IntelliJ to debug a Java Web App running on Azure." 
	services="app-service\web" 
	documentationCenter="java" 
	authors="selvasingh" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="Java" 
	ms.topic="article" 
	ms.date="07/07/2016" 
	ms.author="asirveda;robmcm"/>

# Debug a Java Web App on Azure in IntelliJ

This tutorial shows how to debug a Java Web App running on Azure by using the [Azure Toolkit for IntelliJ]. For the sake of simplicity, you will use a basic Java Server Page (JSP) example for this tutorial, but the steps would be similar for a Java servlet when you are debugging on Azure.

When you have completed this tutorial, your application will look similar to the following illustration when you are debugging it in IntelliJ:

![][01]
 
## Prerequisites

* A Java Developer Kit (JDK), v 1.8 or later.
* IntelliJ IDEA Ultimate Edition. This can be downloaded from <https://www.jetbrains.com/idea/download/index.html>.
* A distribution of a Java-based web server or application server, such as Apache Tomcat or Jetty.
* An Azure subscription, which can be acquired from <https://azure.microsoft.com/en-us/free/> or <http://azure.microsoft.com/pricing/purchase-options/>.
* The Azure Toolkit for IntelliJ. For more information, see [Installing the Azure Toolkit for IntelliJ].
* A Dynamic Web Project created and deployed to Azure App Service; for example see [Create a Hello World Web App for Azure in IntelliJ].

## To Debug a Java Web App on Azure

To complete these steps in this section, you can use an existing Dynamic Web Project which you have already deployed as a Java Web App on Azure, you download a [Sample Dynamic Web Project] and follow steps in [Create a Hello World Web App for Azure in IntelliJ] to deploy it on Azure. 

1. Open the Java Web App project which you deployed to Azure in IntelliJ.

1. Click the **Run** menu, and then click **Edit Configurations...**.

    ![][02]

1. When the **Run/Debug Configurations** dialog box opens: 

    1. Select **Azure Web App**.
    1. Click on **+** to add a new configuration.
    1. Provide a **Name** for the configuration.
    1. Accept the remaining default values which are suggested by the Azure Toolkit, and then click **OK**.

        ![][03]

1. Select the Azure Web App debug configuration that you just created on the right top of the menu and click on **Debug**

    ![][04]

1. When prompted to **Enable remote debugging in the remote Web App now?**, click **OK**.

1. When prompted that **Your web app is now ready for remote debugging**, click **OK**.

    ![][05]

1. Select the Azure Web App debug configuration that you just created on the right top of the menu, and then click on **Debug**.

1. A Windows command prompt or Unix shell will open and prepare necessary connection for debugging; you need to wait until the connection to your remote Java Web app is successful before you continue. If you are using Windows, it will look like the following illustration:

    ![][06]

1. Insert a break point in your JSP page, then open the URL for your Java Web App in a browser:

    1. Open up **Azure Explorer** in IntelliJ.
    1. Navigate to **Web Apps** and the Java Web App you want to debug.
    1. Right click on the Web App, and click **Open in Browser**.
    1. IntelliJ will now enter into debug mode.

## Next Steps

For more information about using Azure with Java, see the [Azure Java Developer Center].

For additional information about creating Azure Web Apps, see the [Web Apps Overview].

[AZURE.INCLUDE [app-service-web-try-app-service](../../includes/app-service-web-try-app-service.md)]

<!-- URL List -->

[Azure App Service]: http://go.microsoft.com/fwlink/?LinkId=529714
[Azure Toolkit for IntelliJ]: ../azure-toolkit-for-intellij.md
[Installing the Azure Toolkit for IntelliJ]: ../azure-toolkit-for-intellij-installation.md
[Create a Hello World Web App for Azure in IntelliJ]: ./app-service-web-intellij-create-hello-world-web-app.md
[Sample Dynamic Web Project]: http://go.microsoft.com/fwlink/?LinkId=817337

[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/
[Web Apps Overview]: ./app-service-web-overview.md

<!-- IMG List -->

[01]: ./media/app-service-web-debug-java-web-app-in-intellij/01-debug-java-web-app-in-intellij.png
[02]: ./media/app-service-web-debug-java-web-app-in-intellij/02-configure-intellij-remote-debug.png
[03]: ./media/app-service-web-debug-java-web-app-in-intellij/03-debug-configuration.png
[04]: ./media/app-service-web-debug-java-web-app-in-intellij/04-select-debug.png
[05]: ./media/app-service-web-debug-java-web-app-in-intellij/05-ready-for-remote-debugging.png
[06]: ./media/app-service-web-debug-java-web-app-in-intellij/06-windows-command-prompt-connection-successful-to-remote.png
