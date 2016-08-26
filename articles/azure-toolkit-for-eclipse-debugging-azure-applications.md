<properties
    pageTitle="Debugging Azure Applications in Eclipse"
    description="Learn about the Debugging Azure Applications using the Azure Toolkit for Eclipse."
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

<!-- Legacy MSDN URL = https://msdn.microsoft.com/library/azure/hh690949.aspx -->

# Debugging Azure Applications in Eclipse #

Using the Azure Toolkit for Eclipse, you can debug your applications whether they are running in Azure, or in the compute emulator if you are using Windows as your operating system. The following image shows the **Debugging** properties dialog used to enable remote debugging:

![][ic719504]

This tutorial assumes you already have an application that has been successfully created, and are familiar with the compute emulator and deploying to Azure.

We'll use the application from the [Using the Azure Service Runtime Library in JSP][] tutorial as the starting point for this topic. Before proceeding, create that application if you have not already done so.

## To debug your application while running in Azure ##

>[AZURE.WARNING] The toolkit's current support for remote Java debugging is intended primarily for deployments running in the Azure compute emulator. Because the debugging connection is not secure, you should not enable remote debugging in production deployments. If you need to debug an application running in the Azure cloud, use a staging deployment, but realize that unauthorized access to your debug session is possible if someone knows the IP address of your cloud deployment, even if it is a staging deployment.

1. Build your project for testing in the emulator: In Eclipse's Project Explorer, right-click **MyAzureProject**, click **Properties**, click **Azure**, and set **Build for** to **Deployment to cloud**.
1. Rebuild your project: From the Eclipse menu, click **Project**, then click **Build All**.
1. Deploy your application to *staging* in Azure.
    >[AZURE.IMPORTANT] As mentioned above, it is highly recommended that you debug in the compute emulator in most cases, then debug in the staging environment only if additional debugging is needed. It is recommended to not debug in the production environment.
1. Once your deployment is ready in Azure, obtain the DNS name for the deployment from the [Azure Management Portal][]. A staging deployment has a DNS name in the form of http://*&lt;guid&gt;*.cloudapp.net, where *&lt;guid&gt;* is a GUID value assigned by Azure.
1. In Eclipse's Project Explorer, right-click **WorkerRole1**, click **Azure**, and then click **Debugging**.
1. In the **Properties for WorkerRole1 Debugging** dialog:
    1. Check **Enable remote debugging for this role.**
    1. For **Input endpoint to use**, use **Debugging (public:8090, private:8090)**.
    1. Ensure **Start JVM in suspended mode, waiting for a debugger connection** is unchecked.
        >[AZURE.IMPORTANT] The **Start JVM in suspended mode, waiting for a debugger connection** option is intended for advanced debugging scenarios in the compute emulator only (not for cloud deployments). If the **Start JVM in suspended mode, waiting for a debugger connection** option is used, it will suspend the server's startup process until the Eclipse debugger is connected to its JVM. While you could use this option for a debugging session using the compute emulator, do not use it for a debugging session in a cloud deployment. A server's initialization takes place in an Azure startup task, and the Azure cloud does not make public endpoints available until the startup task is completed. Hence, a startup process will not complete successfully if this option is enabled in a cloud deployment, because it will not be able to receive a connection from an external Eclipse client.
    1. Click **Create Debug Configurations**.
1. In the **Azure Debug Configuration** dialog:
    1. For **Java project to debug**, select the **MyHelloWorld** project.
    1. For **Configure debugging for**, check **Azure cloud (staging)**.
    1. Ensure **Azure compute emulator** is unchecked.
    1. For **Host**, enter the DNS name of your staged deployment, but without the preceding **http://**. For example (use your GUID in place of the GUID shown here): **4e616d65-6f6e-6d65-6973-526f62657274.cloudapp.net**
1. Click **OK** to close the **Azure Debug Configuration** dialog.
1. Click **OK** to close the **Properties for WorkerRole1 Debugging** dialog.
1. If you don't have a breakpoint already set in index.jsp, set it:
    1. Within Eclipse's Project Explorer, expand **MyHelloWorld**, expand **WebContent**, and double-click **index.jsp**.
    1. Within index.jsp, right-click in the blue bar to the left of your Java code and click **Toggle Breakpoints**, as shown in the following:
        ![][ic551537]
1. Within Eclipse's menu, click **Run** and then click **Debug Configurations**.
1. In the **Debug Configurations** dialog, expand **Remote Java Application** in the left-hand pane, select **Azure Cloud (WorkerRole1)**, and click **Debug**.
1. Within your browser, run your staged application, **http://***&lt;guid&gt;***.cloudapp.net/MyHelloWorld**, substituting the GUID from your DNS name for *&lt;guid&gt;*. If prompted by a **Confirm Perspective Switch** dialog box, click **Yes**. Your debug session should now execute to the line of code where the breakpoint was set.

>[AZURE.NOTE] If you're attempting to start a remote debugging connection to a deployment that has multiple role instances running, you cannot currently control which instance the debugger will be initially connected to, as the Azure load balancer will pick an instance at random. Once you're connected with that instance, though, you will continue debugging the same instance. Note also, if there is a period of inactivity of more than 4 minutes (for example, when you're stopped at a breakpoint for too long), Azure may close the connection.

## Debugging a specific role instance in a multi-instance deployment ##

When your deployment is running in the cloud, you will most likely be running it in multiple compute, or role, instances. This enables you to take advantage of Azure 99.95% availability guarantee, and to scale out your application.

In such scenarios, you may need to remotely debug your Java application in a specific role instance. However, if you enable only a regular input endpoint for debugging, the Azure load balancer will make it virtually impossible for you to connect the debugger to a specific role instance. Instead it will connect you to a role instance that it picks at random.

This is the type of scenario where taking advantage of instance input endpoints will make it easier for you to debug a specific role instance.

Let's say you plan to run up to 5 role instances of your deployment. Using the **Endpoints** property page in the role properties dialog, create an instance input endpoint and assign it a range of public ports, rather than a single port number. For example, in the **Public port** input box, specify **81-85**.

After you deploy your application with this instance endpoint, Azure will assign a unique port number from this range to each of the role instances. Then, in order to find out which instance got assigned which port number, you can use the *InstanceEndpointName***_PUBLICPORT** environment variable (where *InstanceEndpointName* is the name you assigned when you created the instance endpoint) automatically configured by the toolkit in your deployment (for example, by returning its value in the footer of a webpage, so you could read it when you browse to it).

Once you know what public port number that instance was assigned, you can reference it in your debug configuration in Eclipse, by affixing it to the host name of your service. This will enable the Eclipse debugger to connect to that specific instance, and not any of the other instances.

## Windows only: To debug your application while running in the compute emulator ##

>[AZURE.NOTE] The Azure emulator is only available on Windows. Skip this section if you are using an operating system other than Windows. 

1. Build your project for testing in the emulator: In Eclipse's Project Explorer, right-click **MyAzureProject**, click **Properties**, click **Azure**, and set **Build for** to **Testing in emulator**.
1. Rebuild your project: From the Eclipse menu, click **Project**, then click **Build All**.
1. In Eclipse's Project Explorer, right-click **WorkerRole1**, click **Azure**, and then click **Debugging**.
1. In the **Properties for WorkerRole1 Debugging** dialog:
    1. Check **Enable remote debugging for this role.**
    1. For **Input endpoint to use**, use the default endpoint automatically generated by the toolkit, listed as **Debugging (public:8090, private:8090)**.
    1. Ensure the **Start JVM in suspended mode, waiting for a debugger connection** option is unchecked.
        >[AZURE.IMPORTANT] The **Start JVM in suspended mode, waiting for a debugger connection** option is intended for advanced debugging scenarios in the compute emulator only (not for cloud deployments). If the **Start JVM in suspended mode, waiting for a debugger connection** option is used, it will suspend the server's startup process until the Eclipse debugger is connected to its JVM. While you could use this option for a debugging session using the compute emulator, do not use it for a debugging session in a cloud deployment. A server's initialization takes place in an Azure startup task, and the Azure cloud does not make public endpoints available until the startup task is completed. Hence, a startup process will not complete successfully if this option is enabled in a cloud deployment, because it will not be able to receive a connection from an external Eclipse client.
    1. Click **Create Debug Configurations**.
1. In the **Azure Debug Configuration** dialog:
    1. For **Java project to debug**, select the **MyHelloWorld** project.
    1. For **Configure debugging for**, check **Azure compute emulator**.
1. Click **OK** to close the **Azure Debug Configuration** dialog.
1. Click **OK** to close the **Properties for WorkerRole1 Debugging** dialog.
1. Set a breakpoint in index.jsp:
    1. Within Eclipse's Project Explorer, expand **MyHelloWorld**, expand **WebContent**, and double-click **index.jsp**.
    1. Within index.jsp, right-click in the blue bar to the left of your Java code and click **Toggle Breakpoints**, as shown in the following:
        ![][ic551537]

       A breakpoint is set if you see a breakpoint icon within the blue bar to the left of your Java code.
1. Start the application in the compute emulator by clicking the **Run in Azure Emulator** button on the Azure toolbar.
1. Within Eclipse's menu, click **Run** and then click **Debug Configurations**.
1. In the **Debug Configurations** dialog, expand **Remote Java Application** in the left-hand pane, select **Azure Emulator (WorkerRole1)**, and click **Debug**.
1. After the compute emulator indicates that your application is running, within your browser, run **http://localhost:8080/MyHelloWorld**.
    If prompted by a **Confirm Perspective Switch** dialog box, click **Yes**.
    Your debug session should now execute to the line of code where the breakpoint was set.

This showed you how to debug in the compute emulator; the next section shows you how to debug an application deployed to Azure.

## Debugging Notes ##

* After debugging, you can switch the perspective from **Debug** to **Java** via clicking Eclipse's menu, by clicking **Window**, **Open Perspective**, and selecting the perspective that you want to use.
* To enable remote debugging in GlassFish, do not use the remote debugging configuration feature of the Azure Toolkit for Eclipse. Instead configure GlassFish manually. Because of the way GlassFish treats Java options predefined in environment variables, the toolkit's remote debugging configuration feature does not work properly with GlassFish. If the toolkit's remote debugging configuration feature is enabled, it may prevent GlassFish from starting.

## See Also ##

[Azure Toolkit for Eclipse][]

[Creating a Hello World Application for Azure in Eclipse][]

[Installing the Azure Toolkit for Eclipse][] 

For more information about using Azure with Java, see the [Azure Java Developer Center][].

<!-- URL List -->

[Azure Java Developer Center]: http://go.microsoft.com/fwlink/?LinkID=699547
[Azure Management Portal]: http://go.microsoft.com/fwlink/?LinkID=512959
[Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699529
[Creating a Hello World Application for Azure in Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699533
[Installing the Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkId=699546
[Using the Azure Service Runtime Library in JSP]: http://go.microsoft.com/fwlink/?LinkID=699551

<!-- IMG List -->

[ic719504]: ./media/azure-toolkit-for-eclipse-debugging-azure-applications/ic719504.png
[ic551537]: ./media/azure-toolkit-for-eclipse-debugging-azure-applications/ic551537.png
