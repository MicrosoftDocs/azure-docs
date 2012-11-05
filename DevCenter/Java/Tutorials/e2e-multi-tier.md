<properties linkid="dev-java-tutorials-multi-tier" urlDisplayName="Multi-Tier Application" pageTitle="Java Multi-Tier application - Windows Azure tutorial" metaKeywords="Azure Service Bus queue tutorial, Azure queue tutorial, Azure worker role tutorial, Azure Service Bus queue tutorial, Azure .NET worker role tutorial, Azure Service Bus queue tutorial, Azure queue tutorial, Azure worker role tutorial" metaDescription="A tutorial that helps you develop a multi-tier application in Windows Azure that uses Service Bus queues to communicate between tiers." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />



# Java Multi-Tier Application Using Service Bus Queues

Developing for Windows Azure is easy using the Eclipse IDE and the
free [Windows Azure SDK for Java](http://www.windowsazure.com/en-us/develop/java/). On completing this guide, you will have an application that uses
multiple Windows Azure resources running in your local environment and
demonstrates how a multi-tier application works.

You will learn:

-   How to enable your computer for Windows Azure development with downloads and installs
-   How to use Eclipse to develop for Windows Azure
-   How to create a multi-tier application in Windows Azure
-   How to communicate between tiers using Service Bus Queues

You will build a front-end Java Server Pages (JSP) Azure worker role that uses a back-end Java-based Azure virtual machine (VM) role to process long running jobs. You will learn how to create multi-role solutions, as well as how to use Service Bus Queues to enable inter-role communication. 

## Scenario Overview: Inter-Role Communication

To submit an order for processing, the front end UI component, needs to interact with the logic running in
the virtual machine (VM) role. This example uses Service Bus brokered messaging for
the communication between the tiers.

Using brokered messaging between the front and back-end tiers decouples the
two components. In contrast to direct messaging (that is, TCP or HTTP),
the web tier does not connect to the backend middle tier directly; instead it
pushes units of work, as messages, into the Service Bus, which reliably
retains them until the middle tier is ready to consume and process them.

The Service Bus provides two entities to support brokered messaging,
queues and topics. With queues, each message sent to the queue is
consumed by a single receiver. Topics support the publish/subscribe
pattern in which each published message is made available to each
subscription registered with the topic. Each subscription logically
maintains its own queue of messages. Subscriptions can also be
configured with filter rules that restrict the set of messages passed to
the subscription queue to those that match the filter. This example uses
Service Bus queues.

    ![][arch-overview]

This communication mechanism has several advantages over direct
messaging, namely:

-   **Temporal decoupling.** With the asynchronous messaging pattern,
    producers and consumers need not be online at the same time. Service
    Bus reliably stores messages until the consuming party is ready to
    receive them. This allows the components of the distributed
    application to be disconnected, either voluntarily, for example, for
    maintenance, or due to a component crash, without impacting the
    system as a whole. Furthermore, the consuming application may only
    need to come online during certain times of the day.

-   **Load leveling**. In many applications, system load varies over
    time whereas the processing time required for each unit of work is
    typically constant. Intermediating message producers and consumers
    with a queue means that the consuming application (the worker) only
    needs to be provisioned to accommodate average load rather than peak
    load. The depth of the queue will grow and contract as the incoming
    load varies. This directly saves money in terms of the amount of
    infrastructure required to service the application load.

-   **Load balancing.** Pull-based load balancing
    allows for optimum utilization of the worker machines even if the
    worker machines differ in terms of processing power. This pattern is often
    termed the competing consumer pattern.

The following sections discuss the code that implements this
architecture.

## Set Up the Development Environment

#### Download the Windows Azure SDK for Java

To install the Windows Azure SDK for Java, see the [Windows Azure Java Developer Center](http://www.windowsazure.com/en-us/develop/java/).

## Create a Windows Azure Account

1.  Open a web browser, and browse to [http://www.windowsazure.com](http://www.windowsazure.com).

    To get started with a free account, click **free trial** in the upper
    right corner and follow the steps.

    ![][click-free-trial]

2.  Your account is now created. You are ready to deploy your
    application to Windows Azure!

## How to create a service bus namespace

To begin using Service Bus queues in Windows Azure, you must first
create a service namespace. A service namespace provides a scoping
container for addressing Service Bus resources within your application.

To create a service namespace:

1.  Log on to the [Windows Azure Management Portal](http://windows.azure.com) (note this is not the same portal as the Windows Azure Preview Management Portal).
2.  In the lower left navigation pane of the Management Portal, click
    **Service Bus, Access Control & Caching**.
3.  In the upper left pane of the Management Portal, click the **Service
    Bus** node, and then click the **New** button.  
    ![Service Bus Node screenshot][new-service-bus-1]
4.  In the **Create a new Service Namespace** dialog, enter a
    **Namespace**, and then to make sure that it is unique, click the
    **Check Availability** button.  
    ![Create a New Namespace screenshot][new-service-bus-2]
5.  After making sure the namespace name is available, choose the
    country or region in which your namespace should be hosted (make
    sure you use the same country/region in which you are deploying your
    compute resources), and then click the **Create Namespace** button.
    Having a compute instance is optional, and the service bus can be
    consumed from any application with internet access.  
      
     The namespace you created will then appear in the Management Portal
    and takes a moment to activate. Wait until the status is **Active**
    before moving on.

## Obtain the Default Management Credentials for the Namespace

In order to perform management operations, such as creating a queue, on
the new namespace, you need to obtain the management credentials for the
namespace.

1.  In the left navigation pane, click the **Service Bus** node, to
    display the list of available namespaces:   
    ![Available Namespaces screenshot][credentials-available-namespaces]
2.  Select the namespace you just created from the list shown:   
    ![Namespace List screenshot][credentials-namespace-list]
3.  The right-hand **Properties** pane will list the properties for the
    new namespace:   
    ![Properties Pane screenshot][credentials-properties-pane]
4.  The **Default Key** is hidden. Click the **View** button to display
    the security credentials:   
    ![Default Key screenshot][credentials-default-key]
5.  Make a note of the **Default Issuer** and the **Default Key** as you
    will use this information below to perform operations with the
    namespace. Specifically, the value for **Default Issuer** will be assigned to the *issuer* variable and the value for **Default Key** will be assigned to the *key* variable in the Java program, **Client.java**.


## Create a JSP worker Role

In this section, you will build the front end of your application. After that, you will add the code for submitting items to a Service Bus Queue.

#### Creating an Application Using the Windows Azure Plugin for Eclipse with Java

The following steps show you how to create and deploy a basic JSP application to Windows Azure using the Windows Azure Plugin for Eclipse with Java. 

The application will look similar to the following:

![][front-screenshot]

##### Prerequisites 

- A Java Developer Kit (JDK), v 1.6 or later.
 
- Eclipse IDE for Java EE Developers, Helios or later. This can be downloaded from [http://www.eclipse.org/downloads](http://www.eclipse.org/downloads).
 
- A distribution of a Java-based web server or application server, such as Apache Tomcat, GlassFish, JBoss Application Server, or Jetty.
 
- A Windows Azure subscription, which can be acquired from [http://www.microsoft.com/windowsazure/offers/](http://www.microsoft.com/windowsazure/offers/)
 
- The Windows Azure Plugin for Eclipse with Java. For more information, see Installing the Windows Azure Plugin for Eclipse with Java.

##### To create a Windows Azure application using Java

- First, we’ll start off with creating a Java project. Start Eclipse. Within Eclipse, at the menu click **File**, click **New**, and then click **Dynamic Web Project**. (If you don’t see Dynamic Web Project listed as an available project after clicking **File**, **New**, then do the following: click **File**, click **New**, click **Project…**, expand **Web**, click **Dynamic Web Project**, and click **Next**.) For purposes of this tutorial, name the project **HelloWorld**. (Ensure you use this name, subsequent steps in this tutorial expect your WAR file to be named HelloWorld). Your screen should look similar to the following:

![Create Web Project][new-dynamic-web-project-dialog]

- Click **Finish**.

- Within Eclipse’s Project Explorer view, expand **HelloWorld**. Right-click WebContent, click **New**, and then click **JSP File**.

- In the **New JSP File** dialog, name the file **index.jsp**. Keep the parent folder as HelloWorld\WebContent, as shown in the following:

![Create JSP File][new-jsp-file]

- Click **Next**.

- In the **Select JSP Template** dialog, for purposes of this tutorial select **New JSP File (html)** and click **Finish**.

- When the index.jsp file opens in Eclipse, add in text to display Hello World! within the existing <body> element. Your updated <body> content should appear as the following. Save index.jsp.

			<body>
			  <b><% out.println("Hello World!"); %></b>
			</body>

- In the left-hand pane of the **Properties** dialog, click **Java Build Path**.

- Click the **Libraries** tab, and then click **Add External JARs**.
 
- In the **JAR Selection** dialog, browse to the JAR that you installed locally for the Windows Azure Libraries for Java, click **Next**, and then click **Finish**.
 
- Repeat the **Add External JARs** process for any dependent JARs, as listed at Download the Windows Azure SDK for Java.
 
- Add the Windows Azure Libraries for Java JAR and any dependencies to the deployment assembly. In the left-hand pane of the **Properties** dialog, click **Deployment Assembly**, and then click **Add**.

- In the **New Assembly Directive** dialog, click **Java Build Path Entries** and then click **Next**.
 
- Select the JAR for the Windows Azure Libraries for Java, as well as any applicable dependencies, and then click **Finish**.
 
- Click **OK** to close the **Properties** dialog.
 
- Modify the code in index.jsp as shown below. The code uses Service Bus queues functionality to send messages to a queue. Management operations for Service Bus queues can be performed via the
**ServiceBusContract** class. A **ServiceBusContract** object is
constructed with an appropriate configuration that encapsulates the
token permissions to manage it, and the **ServiceBusContract** class is
the sole point of communication with Azure. The **ServiceBusService** class provides methods to create, enumerate,
and delete queues. The example below shows how a **ServiceBusService**
can be used to create a queue named "TestQueue" within a "HowToSample"
service namespace. To send a message to a Service Bus Queue, your application will obtain a
**ServiceBusContract** object. The below code demonstrates how to send a
message for the "TestQueue" queue we created above within our
"HowToSample" service namespace:


- Messages sent to (and received from ) Service Bus queues are instances
of the **BrokeredMessage** class. **BrokeredMessage** objects have a set
of standard methods (such as **getLabel**, **getTimeToLive**,
**setLabel**, and **setTimeToLive**), a dictionary that is used to hold
custom application specific properties, and a body of arbitrary
application data. An application can set the body of the message by
passing any serializable object into the constructor of the
**BrokeredMessage**, and the appropriate serializer will then be used to
serialize the object. Alternatively, a **java.IO.InputStream** can be
provided.





		// Include the following imports at the top of the page to use service bus APIs

			
		<@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1" import="java.util.Map, com.microsoft.windowsazure.services.serviceBus.models.*, com.microsoft.windowsazure.services.core.*, javax.xml.datatype.*" %>
		<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
		<title>Hello</title>
		</head>
		<body>
		 <b>Hello World!</b>
		 <br/>
		 <%

			// Obtain these values from the Management Portal
			
			String namespace = ""; // your service bus namespace			
			String issuerName = ""; // your isuer name		
			String issuerKey = ""; // your issuer key
			
			// The name of your queue			
			String queueName = "OrdersQueue";
			
			// Create the namespace manager which gives you access to management operations			
			Configuration config = ServiceBusConfiguration.configureWithWrapAuthentication(queueName, issuerName, issuerKey);			
			ServiceBusContract service = ServiceBusService.create(config);			
			QueueInfo queueInfo = new QueueInfo(queueName);
			
			try			
			{				
				CreateQueueResult result = service.createQueue(queueInfo);			
			} 			
			catch (ServiceException e) {				 
				System.err.print("ServiceException encountered: ");			
				System.err.println(e.getMessage());			
			}

			try			
			{				
				BrokeredMessage message = new BrokeredMessage("testOnlineOrder");			
				service.sendQueueMessage(queueName, message);			
			} 			
			catch (ServiceException e) {			
				System.err.print("ServiceException encountered: ");			
				System.err.println(e.getMessage());			
			}		
		  %>
		</body>
		</html>
	

##### To create a special Windows Azure project for deployment

- Now we’ll create a Windows Azure deployment project. As a shortcut, in Eclipse’s Project Explorer, right-click the **MyHelloWorld** project, click **Windows Azure**, and then click **Package for Windows Azure**.

- For purposes of this tutorial, name the project **MyAzureProject**, and click **Next**.

- Within the Windows Azure Deployment Project dialog, Click **Include a JDK from this location**, click the **Browse** button, and using the browse control, select the directory location for the JDK that you want use for your deployment. (By default, the **Open Directory** dialog already selects the Java directory on your computer, you just need to scroll down to it and select the JDK installation contained there that you want to use.)
 
- Click **Include a server from this location**, select the application server of your choice, click the **Browse** button, and select the directory location where the application server that you want to deploy with your project has been installed on your computer.

- In the **Applications** selection, you will already see **HelloWorld.war** listed if you started this wizard from your project’s context menu **Package for Windows Azure** command. Click **Finish** to close the **Windows Azure Deployment Project** dialog.

##### To deploy your application to the compute emulator

- In Eclipse’s Project Explorer, click MyAzureProject.

- In the Eclipse toolbar, click the **Run in Windows Azure Emulator** button. If the **Run in Windows Azure Emulator** button is not enabled, ensure that **MyAzureProject** is enabled in Eclipse’s Project Explorer, and ensure that Eclipse’s Project Explorer has focus as the current window. (As an alternative to using the **Run in Windows Azure Emulator** button, you can use the following menu choices: In Eclipse’s Project Explorer, expand **MyAzureProject**, expand **emulatorTools**, and double-click **RunInEmulator.cmd**.)

- This will first start a full build of your project and then launch your Java web application in the compute emulator. (Note that the first build may take a couple of minutes. Subsequent builds are faster.) After the first build step has been completed, you will be prompted by Windows User Account Control (UAC) to allow this command to make changes to your computer. Click **Yes**.

- Examine the output of the compute emulator UI to determine if there are any issues with your project. Depending on the contents of your deployment, it may take a couple minutes for your application to be fully started within the compute emulator.

- Start your browser and use the URL http://localhost:8080/MyHelloWorld as the address (the MyHelloWorld portion of the URL is case-sensitive). You should see your MyHelloWorld application (the output of index.jsp), similar to the following image:






![][front-screenshot-localhost]

- When you are ready to stop your application from running in the compute emulator, in the Eclipse toolbar, click the **Reset Windows Azure Emulator** button, . (As an alternative to using the **Reset Windows Azure Emulator** button, you can use the following menu choices: In Eclipse’s Project Explorer, expand **MyAzureProject**, expand **emulatorTools**, and double-click **ResetEmulator.cmd**.)



##### To deploy your application to Windows Azure

- In Eclipse’s Project Explorer, click **MyAzureProject**.

- In the Eclipse toolbar, click the **Publish to Windows Azure Cloud** button. If the **Publish to Windows Azure Cloud** button is not enabled, ensure that **MyAzureProject** is enabled in Eclipse’s Project Explorer, and ensure that Eclipse’s Project Explorer has focus as the current window. 

- In the **Publish Azure Project** dialog, for **Subscription**, click **Download**. If you are not yet logged into your Windows Azure account, you will be prompted to log in. Then you’ll be prompted to save a Windows Azure publish settings file. (You can ignore the resulting instructions shown on the logon pages – they are provided by the Windows Azure portal and are intended for Visual Studio users.) Save it to your local machine.

- Click the **Import** button for **Subscription**, select the publish settings file that you saved locally in the previous step, and click **Open**.

- For Subscription, select the subscription that you want use for your deployment.

- For **Storage Account**, select the storage account that you want to use, or click **New** to create a new storage account.

- For **Access Key**, select **Primary**.

- For **Hosted Service**, select the hosted service that you want to use, or click **New** to create a new hosted service.

- For **Target environment**, for purposes of this tutorial, select **Staging**. (When you’re ready to deploy to your production sight, you’ll change this to **Production**.)

- Click **Next**.

- The **Remote Desktop Settings** dialog is displayed. The default settings configured for your project will be shown. You can choose to enable or disable remote desktop access to the virtual machine hosting your deployment.

- If you want to disable remote desktop access, uncheck **Enable all roles to accept Remote Desktop connections with these login credentials**.

- In the **Publish Azure Project** dialog, click **Publish**. When prompted to perform a full build, click **Yes**. This may take several minutes for the first build.

- A **Windows Azure Activity Log** will display in your Eclipse tabbed views section. You can use that view, as well as the **Console** view, to see the progress of your deployment. An alternative is to log in to the Windows Azure Management Portal, http://windows.azure.com, and use the **Hosted Services** section to monitor the status.

- Because this was a deployment to a staging environment, the DNS will be of the form http://<guid>.cloudapp.net. You can see the DNS name if you click the deployment name in the Windows Azure Platform Management Portal (you may need to expand the Hosted Service node to see the deployment name); the DNS name is in the right hand pane of the portal.

-  Once your deployment has a status of **Ready** (as indicated by the Windows Azure Platform Management Portal), you can enter the URL for your deployed application in your browser to see that your application is deployed to the cloud. The URL for an application deployed to the staging environment will be of the form http://<guid>.cloudapp.net/. For example, http://72d5eb5875234b7ca8c7f74c80a2a1f1.cloudapp.net. Remember to append **MyHelloWorld** (case-sensitive) to the end of the URL, so you’ll be using a URL similar to the following in your browser (use the GUID assigned to your URL instead of the GUID listed here): http://72d5eb5875234b7ca8c7f74c80a2a1f1.cloudapp.net/MyHelloWorld.


- Although this walk-through was for a deployment to the staging environment, a deployment to production follows the same steps, except within the **Publish Azure Project** dialog, select **Production** instead of **Staging** for the **Target environment**. A deployment to production results in a URL based on the DNS name of your choice, instead of a GUID as used for staging.




#### Create the Back-end VM Role

You will now create the back-end VM role that will process the submissions from the front-end JSP worker role you've just created.

##### How to run a task in Java on a virtual machine

With Windows Azure, you can use a virtual machine to handle compute-intensive tasks; for example, a virtual machine could handle tasks and deliver results to client machines or mobile applications. You will learn how to create a virtual machine that runs a Java application.

This tutorial assumes you know how to create Java console applications, import libraries to your Java application, and generate a Java archive (JAR). No knowledge of Windows Azure is assumed. 

You will learn:

- How to create a virtual machine.
- How to remotely log in to your virtual machine.
- How to install a JRE or JDK on your virtual machine.
- How to create a service bus namespace.
- How to create a Java application
- How to run the Java application

##### To create a virtual machine

1. Log in to the [Windows Azure Preview Management Portal](https://manage.windowsazure.com).
2. Click **New**.
3. Click **Virtual machine**.
4. Click **Quick create**.
5. In the **Create a virtual machine** screen, enter a value for **DNS name**.
6. From the **Image** dropdown list, select an image, such as **Windows Server 2008 R2 SP1**.
7. Enter a password in the **New password** field, and re-enter it in the **Confirm** field. Remember this password, you will use it when you remotely log in to the virtual machine.
8. From the **Location** drop down list, select the data center location for your virtual machine; for example, **West US**.
9. Click **Create virtual machine**. Your virtual machine will be created. You can monitor the status in the **Virtual machines** section of the management portal.

##### To remotely log in to your virtual machine

1. Log on to the [Preview Management Portal](https://manage.windowsazure.com).
2. Click **Virtual machines**.
3. Click the name of the virtual machine that you want to log in to.
4. Click **Connect**.
5. Respond to the prompts as needed to connect to the virtual machine. When prompted for the password, use the password that you provided when you created the virtual machine.

##### To install a JRE or JDK on your virtual machine

To run Java applications on your virtual machine, you need to install install a Java Runtime Environment (JRE). For purposes of this tutorial, we'll install a Java Developer Kit (JDK) to your virtual machine and use the JDK's JRE. You could however install a JRE only if you choose to do so. 

For purposes of this tutorial, a JDK will be installed from Oracle's site.

1. Log on to your virtual machine.
2. Within your browser, open [http://www.oracle.com/technetwork/java/javase/downloads/index.html](http://www.oracle.com/technetwork/java/javase/downloads/index.html).
3. Click the **Download** button for the JDK that you want to download. For purposes of this tutorial, the **Download** button for the Java SE 6 Update 32 JDK was used.
4. Accept the license agreement.
5. Click the download executable for **Windows x64 (64-bit)**.
6. Follow the prompts and respond as needed to install the JDK to your virtual machine. 

Note that the Service Bus functionality requires the GTE CyberTrust Global Root certificate to be installed as part of your JRE's **cacerts** store. This certificate is automatically included in the JRE used by this tutorial. If you do not have this certificate in your JRE **cacerts** store, it can be installed by copying the certificate contents from <https://secure.omniroot.com/cacert/ct_root.der>, saving the contents to a **.cer** file, and adding it to the **cacerts** store via **keytool**. 

##### How to create a middle-tier Java application

1. On your development machine, create a Java console application using the following Java program. For purposes of this tutorial, we'll use **Client.java** as the Java file name. As above, modify the **your\_service\_bus\_namespace**, **your\_service\_bus\_owner**, and **your\_service\_bus\_key** placeholders to use your service bus **namespace**, **Default Issuer** and **Default Key** values, respectively.
  
        import java.util.Date;
        import java.text.DateFormat;
        import java.text.SimpleDateFormat;
        import com.microsoft.windowsazure.services.serviceBus.*;
        import com.microsoft.windowsazure.services.serviceBus.models.*;
        import com.microsoft.windowsazure.services.core.*;
        
        public class Client 
        {

            public static void main(String[] args) 
            {
                    try
                    {
                        
                        DateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
                        Date date = new Date();
                        System.out.println("Starting at " + dateFormat.format(date) + ".");

                        String namespace = "your_service_bus_namespace";
                        String issuer = "your_service_bus_owner";
                        String key = "your_service_bus_key";
                        
                        Configuration config;
                        config = ServiceBusConfiguration.configureWithWrapAuthentication(
                                namespace, issuer, key);
                        
                        ServiceBusContract service = ServiceBusService.create(config);
                        
                        BrokeredMessage message;
        
                        int waitMinutes = 3;  // Use as the default, if no value is specified at command line. 
                        if (args.length != 0) 
                        {
                            waitMinutes = Integer.valueOf(args[0]);  
                        }
                        
                        String waitString;
                        
                        waitString = (waitMinutes == 1) ? "minute." : waitMinutes + " minutes."; 
                        
                        // This queue must have previously been created.
                        service.getQueue("OrdersQueue");
                        
                        int numRead;
                        
                        String s = null;
                        
                        while (true)
                        {
                            
                            ReceiveQueueMessageResult resultQM = service.receiveQueueMessage("OrdersQueue");
                            message = resultQM.getValue();
                            
                            if (null != message && null != message.getMessageId())
                            {                        
                                
                                // Display the queue message.
                                byte[] b = new byte[200];
        
                                System.out.print("From queue: ");
        
                                s = null;
                                numRead = message.getBody().read(b);
                                while (-1 != numRead)
                                {
                                    s = new String(b);
                                    s = s.trim();
                                    System.out.print(s);
                                    numRead = message.getBody().read(b);
                                }
                                System.out.println();
                                if (s.compareTo("Complete") == 0)
                                {
                                    // No more processing to occur.
                                    date = new Date();
                                    System.out.println("Finished at " + dateFormat.format(date) + ".");
                                    break;
                                }
                            }
                            else
                            {
                                // The queue is empty.
                                System.out.println("Queue is empty. Sleeping for another " + waitString);
                                Thread.sleep(60000 * waitMinutes);
                            }
                        } 
                        
                }
                catch (ServiceException serviceException)
                {
                    // Take action as needed.
                    System.out.println("ServiceException encountered: " + serviceException.getMessage());
                }
                catch (Exception exception)
                {
                    // Take action as needed.
                    System.out.println("Exception encountered: " + exception.getMessage());
                }
        
            }
        
        }
  

2. Export the application to a runnable Java archive (JAR), and package the required libraries into the generated JAR. For purposes of this tutorial, we'll use **Client.jar** as the generated JAR name.


##### How to run the application
1. Log on to your machine where you will run the application. 
2. Create a folder where you will run your application. For example, **c:\Client**.
3. Copy **Client.jar** to **c:\Client**,
4. Ensure the JRE's bin folder is in the PATH environment variable.
5. Run the following command:

        java -jar Client.jar

The client will run until it sees a queue message of "Complete". 



[arch-overview]: ../media/multi-tier/arch-overview.png
[click-free-trial]: ../media/multi-tier/click-free-trial.png
[credentials-available-namespaces]: ../media/multi-tier/credentials-available-namespaces.png
[credentials-default-key]: ../media/multi-tier/credentials-default-key.png
[credentials-namespace-list]: ../media/multi-tier/credentials-namespace-list.png
[credentials-properties-pane]: ../media/multi-tier/credentials-properties-pane.png
[front-screenshot-localhost]: ../media/multi-tier/front-screenshot-localhost.png
[front-screenshot]: ../media/multi-tier/front-screenshot.png
[new-dynamic-web-project-dialog]: ../media/multi-tier/new-dynamic-web-project-dialog.png
[new-jsp-file]: ../media/multi-tier/new-jsp-file.png
[new-service-bus-1]: ../media/multi-tier/new-service-bus-1.png
[new-service-bus-2]: ../media/multi-tier/new-service-bus-2.png
[new-windows-azure-project]: ../media/multi-tier/new-windows-azure-project.png
[project-explorer-1]: ../media/multi-tier/project-explorer-1.png
[project-explorer-2]: ../media/multi-tier/project-explorer-2.png
[project-properties]: ../media/multi-tier/project-properties.png
[war-export]: ../media/multi-tier/war-export.png