<properties
    pageTitle="Create a Hello World Cloud Service for Azure in Eclipse"
    description="Learn how to create a simple Hello World application using the Azure Toolkit for Eclipse."
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

<!-- Legacy MSDN URL = https://msdn.microsoft.com/library/azure/hh690944.aspx -->

# Create a Hello World Cloud Service for Azure in Eclipse #

The following steps show you how to create and deploy a basic JSP application to Azure using the Azure Toolkit for Eclipse. A JSP example is shown for simplicity, but highly similar steps would be appropriate for a Java servlet, as far as Azure deployment is concerned.

The application will look similar to the following:

![][ic600360]

## Prerequisites ##

* A Java Developer Kit (JDK), v 1.7 or later.
* Eclipse IDE for Java EE Developers, Indigo or later. This can be downloaded from <http://www.eclipse.org/downloads/>.
* A distribution of a Java-based web server or application server, such as Apache Tomcat, GlassFish, JBoss Application Server, Jetty, or IBM® WebSphere® Application Server Liberty Core.
* An Azure subscription, which can be acquired from <http://azure.microsoft.com/pricing/purchase-options/>.
* The Azure Toolkit for Eclipse. For more information, see [Installing the Azure Toolkit for Eclipse][].

## To create a Hello World application ##

First, we'll start off with creating a Java project.

*  Start Eclipse, and at the menu click **File**, click **New**, and then click **Dynamic Web Project**. (If you don't see **Dynamic Web Project** listed as an available project after clicking **File**, **New**, then do the following: click **File**, click **New**, click **Project...**, expand **Web**, click **Dynamic Web Project**, and click **Next**.)
*  For purposes of this tutorial, name the project **MyHelloWorld**. (Ensure you use this name, subsequent steps in this tutorial expect your WAR file to be named MyHelloWorld). Your screen will appear similar to the following:
    ![][ic589576]
* Click **Finish**.
* Within Eclipse's Project Explorer view, expand **MyHelloWorld**. Right-click **WebContent**, click **New**, and then click **JSP File**.
* In the **New JSP File** dialog, name the file **index.jsp**. Keep the parent folder as **MyHelloWorld/WebContent**, as shown in the following:
    ![][ic659262]
* In the **Select JSP Template** dialog, for purposes of this tutorial select **New JSP File (html)** and click **Finish**.
* When the index.jsp file opens in Eclipse, add in text to dynamically display **Hello World!** within the existing `<body>` element. Your updated `<body>` content should appear as the following:
```
    <body>
    <b><% out.println("Hello World!"); %></b>
    </body>
```
* Save index.jsp.

## To deploy your application to Azure, the quick and simple way ##

As soon as you have a Java web application ready to test, you can use the following shortcut to try it out directly on the Azure cloud.

1. In Eclipse's Project Explorer, click **MyHelloWorld**.
1. In the Eclipse toolbar, click the **Publish** drop down button and then click **Publish As Azure Cloud Service**
    ![][publishDropdownButton]
1. If you are publishing this application to Azure for the first time and you have not created an Azure deployment project for this application before, an Azure deployment project be created for you automatically. You should see the following prompt, which also lists the JDK package and application server that will be automatically deployed to run your application.
    ![][ic789598]

    This shortcut approach enables a quick and easy way to test your application in Azure without having to configure a specific server or JDK that is different from the defaults. If you are satisfied with the defaults, you can click **OK** to continue with the following steps.
    However, if you want to change the JDK or application server to use for your application, you can do that later by editing the Azure deployment project that was automatically created for you, or you can click **Cancel** now and read the **About Azure deployment projects section** of this tutorial.
1. In the **Publish to Azure** dialog:
    1. If there are no subscriptions to select in the **Subscription** list yet, follow these steps to import your subscription information:
        1. Click **Import from PUBLISH-SETTINGS file**.
        1. In the **Import Subscription Information** dialog, click **Download PUBLISH-SETTINGS File**. If you are not yet logged into your Azure account, you will be prompted to log in. Then you'll be prompted to save an Azure publish settings file. Save it to your local machine.
        1. Still in the **Import Subscription Information** dialog, click the **Browse** button, select the publish settings file that you saved locally in the previous step, and then click **Open**. Your screen should look similar to the following:
            ![][ic644267]
        1. Click **OK**.
    1. For **Subscription**, select the subscription that you want use for your deployment.
    1. For **Storage account**, select the storage account that you want to use, or click **New** to create a new storage account.
    1. For **Service name**, select the cloud service that you want to use, or click **New** to create a new cloud service.
    1. For **Target OS**, select the version of the operating system that you want to use for your deployment.
    1. For **Target environment**, for purposes of this tutorial, select **Staging**. (When you're ready to deploy to your production site, you'll change this to **Production**.)
    1. Optional: Ensure that **Overwrite previous deployment** is checked if you want your new deployment to automatically overwrite the previous deployment. When you enable this option, you will not experience "409 conflict" issues when publishing to the same location.
        Note that the **Publish to Azure** dialog contains a section for **Remote Access**. By default, Remote Access is not enabled and we will not enable it for this example. To enable Remote Access, you would enter a user name and password to use when remotely logging in. For more information about Remote Access, see [Enabling Remote Access for Azure Deployments in Eclipse][].
        Your **Publish to Azure** dialog will appear similar to the following:
        ![][ic719488]
1. Click **Publish** to publish to the Staging environment.
    When prompted to perform a full build, click **Yes**. This may take several minutes for the first build.
    An **Azure Activity Log** will display in your Eclipse tabbed views section.
    ![][ic719489]
    You can use this log, as well as the **Console** view, to see the progress of your deployment. An alternative is to log in to the [Azure Management Portal][], and use the **Cloud Services** section to monitor the status.
1. When your deployment is successfully deployed, the **Azure Activity Log** will show a status of **Published**. Click **Published**, as shown in the following image, and your browser will open an instance of your deployment.
    ![][ic719490]

Because this was a deployment to a staging environment, the DNS name will be of the form http://&lt;*guid*&gt;.cloudapp.net, and the URL will contain the DNS name plus a suffix for your application. For example, http://447564652c20426f6220526f636b7321.cloudapp.net/MyHelloWorld. (The **MyHelloWorld** portion is case-sensitive.) You can also see the DNS name if you click the deployment name in the Azure Platform Management Portal (within the Cloud Services portion of the management portal).

Although this walk-through was for a deployment to the staging environment, a deployment to production follows the same steps, except within the **Publish to Azure** dialog, select **Production** instead of **Staging** for the **Target environment**. A deployment to production results in a URL based on the DNS name of your choice, instead of a GUID as used for staging.

>[AZURE.WARNING] At this point you have deployed your Azure application to the cloud. However, before proceeding, realize that a deployed application, even if it is not running, will continue to accrue billable time for your subscription. Therefore, it is extremely important that you delete unwanted deployments from your Azure subscription.

## About Azure deployment projects ##

In order to deploy one or more Java applications to Azure, an Azure Deployment Project is needed. It plays the role of the "package" that your applications need to be wrapped into in order to be published on Azure.

Besides the information about your applications, an Azure deployment project also contains information about other key components of your deployment, most importantly: the application server container to run your web app in, and the Java runtime to run it on. Azure supports a large selection of Java runtimes and Java application servers you can choose from.

Although the example used here is greatly simplified for educational purposes, an Azure deployment project can also contain other important configuration information that enables you to create almost arbitrarily complex, scalable, highly available, multi-tier cloud services with your applications. You can enable **session affinity ("sticky sessions")**, **fast caching**, **remote debugging**, **SSL offloading**, **firewall/port routing**, **remote access**, and a number of other powerful capabilities.

If you've completed the previous section of this tutorial ("To deploy your application to Azure, the quick and simple way"), you will now see a new Azure deployment project in the Project Explorer generated for you automatically and named "**MyHelloWorld_onAzure**".

You could have also started this tutorial by first creating a blank Azure deployment project yourself and then adding your application(s) to it. It is a longer process, but giving you more control over the initial configuration from the beginning.

To create a new Azure deployment project from scratch, click the **New Azure Deployment Project** button ![][ic710876].

Regardless of whether you are working with an already existing Azure deployment project, or creating one from scratch, you are able to change its configuration settings and components, such as the JDK or the application server, equally easily at any time.

To change the JDK, or the application server, or the application list in an existing Azure deployment project:

1. Expand the project node (e.g. **MyHelloWorld_onAzure**) in the Project Explorer
2. Right-click **WorkerRole1**
3. Expand the **Azure** submenu in the context menu
4. Click **Server Configuration**

Regardless of whether you started these server configuration steps by editing an existing Azure deployment project as shown above, or creating a new one from scratch, you will see the same type of dialogs allowing you to configure your JDK, server and application components. To learn more how to change the settings in those dialogs, for example to change the JDK, the application server and add or remove applications in a deployment, see the [Server configuration properties][] article.

## Windows only: To deploy your application to the compute emulator ##

>[AZURE.NOTE] The Azure emulator is only available on Windows. Skip this section if you are using an operating system other than Windows.

If you have created a new Azure deployment project following the steps described earlier, i.e. implicitly, by publishing your application to Azure, the JDK and application servers have been configured for the cloud, but not for local emulation. To prepare your project for testing in the local emulator, follow these steps:

1. In Eclipse's Project Explorer, click **MyHelloWorld_onAzure**.
1. Right-click on **WorkerRole1**.
1. Expand the **Azure** submenu in the context menu.
1. Click **Server Configuration**.
1. On the **JDK** tab, check if the toolkit has pre-configured a default local JDK for you. If not, or if you want to change the assumed defaults, ensure that the **Use the JDK from this file path for testing locally** checkbox is checked and the JDK installation location that you want to use is specified. If you want to change it, click the **Browse** button and using the browse control, select the directory location of the JDK to use.
1. Click the **Server** tab.
1. In the **Local server path** text box at the bottom of the dialog box, enter the path of a locally-installed server that matches the type and major version number of the server selected at the top of the dialog box, under the **Deploy a server of this type** checkbox. If you want to use a different type or major version of the application server, change the selection under that checkbox first.
1. Click **OK**.
1. In the Eclipse toolbar, click the **Run in Azure Emulator** button, ![][ic710879]. If the **Run in Azure Emulator** button is not enabled, ensure that **MyHelloWorld_onAzure** is selected in Eclipse's Project Explorer, and ensure that Eclipse's Project Explorer has focus as the current window. This will first start a full build of your project and then launch your Java web application in the compute emulator. (Note that depending on your computer's performance characteristics, the first build may take between a few seconds to a few minutes, but subsequent builds will get faster.) After the first build step has been completed, you will be prompted by Windows User Account Control (UAC) to allow this command to make changes to your computer. Click **Yes**.

>[AZURE.IMPORTANT] If you do not see the UAC prompt, check the Windows taskbar for the UAC icon and click it first. Sometimes the UAC prompt does not show up as a topmost window, but is visible only as a taskbar icon.

1. Examine the output of the compute emulator UI to determine if there are any issues with your project. Depending on the contents of your deployment, it may take a couple minutes for your application to be fully started within the compute emulator.
1. Start your browser and use the URL `http://localhost:8080/MyHelloWorld` as the address (the `MyHelloWorld` portion of the URL is case-sensitive). You should see your MyHelloWorld application (the output of index.jsp), similar to the following image:
    ![][ic589579]

When you are ready to stop your application from running in the compute emulator, in the Eclipse toolbar, click the **Reset Azure Emulator** button, ![][ic710880].

## To delete your deployment ##

To delete your deployment within the Azure Toolkit for Eclipse, ensure that **MyHelloWorld_onAzure** is selected in Eclipse's Project Explorer, ensure the Eclipse Project Explorer has the current window focus, and then click the **Unpublish** button, ![][ic710883], in the Eclipse toolbar. (You could do the same operation by right-clicking **MyHelloWorld_onAzure** in Eclipse's Project Explorer, clicking **Azure** and then clicking **Undeploy from Azure Cloud**.) This will display the **Unpublish Azure Project** dialog.

![][ic719491]

Select the subscription and cloud service that contains your deployment, select the deployment that you want to delete, and then click **Unpublish**.

(An alternative to using the toolkit to delete the deployment is to use the **Cloud Services** section of the Azure Management Portal: Navigate to your deployment, select it, and then click the **Delete** button. This will stop, and then delete, the deployment. If you only want to stop the deployment and not delete it, click the **Stop** button instead of the **Delete** button, but as mentioned above, if you do not delete the deployment, billable charges will continue to accrue for your deployment even if it is stopped).

## See Also ##

[Azure Toolkit for Eclipse][]

[Installing the Azure Toolkit for Eclipse][] 

[What's New in the Azure Toolkit for Eclipse][]

For more information about using Azure with Java, see the [Azure Java Developer Center][].

<!-- URL List -->

[Azure Java Developer Center]: http://go.microsoft.com/fwlink/?LinkID=699547
[Azure Management Portal]: http://go.microsoft.com/fwlink/?LinkID=512959
[Azure Role Properties]: http://go.microsoft.com/fwlink/?LinkID=699525
[Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699529
[Enabling Remote Access for Azure Deployments in Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699538
[Installing the Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkId=699546
[Server configuration properties]: http://go.microsoft.com/fwlink/?LinkID=699525#server_configuration_properties
[What's New in the Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699552

<!-- IMG List -->

[ic589576]: ./media/azure-toolkit-for-eclipse-creating-a-hello-world-application/ic589576.png
[ic589579]: ./media/azure-toolkit-for-eclipse-creating-a-hello-world-application/ic589579.png
[ic600360]: ./media/azure-toolkit-for-eclipse-creating-a-hello-world-application/ic600360.png
[ic644267]: ./media/azure-toolkit-for-eclipse-creating-a-hello-world-application/ic644267.png
[ic659262]: ./media/azure-toolkit-for-eclipse-creating-a-hello-world-application/ic659262.png
[ic710876]: ./media/azure-toolkit-for-eclipse-creating-a-hello-world-application/ic710876.png
[ic710879]: ./media/azure-toolkit-for-eclipse-creating-a-hello-world-application/ic710879.png
[ic710880]: ./media/azure-toolkit-for-eclipse-creating-a-hello-world-application/ic710880.png
[ic710882]: ./media/azure-toolkit-for-eclipse-creating-a-hello-world-application/ic710882.png
[ic710883]: ./media/azure-toolkit-for-eclipse-creating-a-hello-world-application/ic710883.png
[ic719488]: ./media/azure-toolkit-for-eclipse-creating-a-hello-world-application/ic719488.png
[ic719489]: ./media/azure-toolkit-for-eclipse-creating-a-hello-world-application/ic719489.png
[ic719490]: ./media/azure-toolkit-for-eclipse-creating-a-hello-world-application/ic719490.png
[ic719491]: ./media/azure-toolkit-for-eclipse-creating-a-hello-world-application/ic719491.png
[ic789598]: ./media/azure-toolkit-for-eclipse-creating-a-hello-world-application/ic789598.png
[publishDropdownButton]: ./media/azure-toolkit-for-eclipse-creating-a-hello-world-application/publishDropdownButton.png
