<properties umbracoNaviHide="0" pageTitle="How to run a Java application server on a virtual machine" metaKeywords="Windows Azure virtual machine, Azure virtual machine, Azure java" metaDescription="A virtual machine running on Windows Azure can be configured to host a Java application server." linkid="dev-java-vm-application-server" urlDisplayName="Java application server" headerExpose="" footerExpose="" disqusComments="1" />

# How to run a Java application server on a virtual machine

With Windows Azure, you can use a virtual machine to provide server capabilities. As an example, a virtual machine running on Windows Azure can be configured to host a Java application server, such as Apache Tomcat. On completing this guide, you will have an understanding of how to create a virtual machine running on Windows Azure and configure it to run a Java application server.

You will learn:

* How to create a virtual machine.
* How to remotely log in to your virtual machine.
* How to install a JDK on your virtual machine.
* How to install a Java application server on your virtual machine.
* How to create an endpoint for your virtual machine.
* How to open a port in the firewall for your application server.

For purposes of this tutorial, an Apache Tomcat application server will be installed on a virtual machine. The completed installation will result in a Tomcat installation such as the following.

![Virtual machine running Apache Tomcat][virtual_machine_tomcat]

## To create a virtual machine

1. Log in to the Log in to the [Windows Azure Preview Management Portal](https://manage.windowsazure.com).
2. Click **New**.
3. Click **Virtual machine**.
4. Click **Quick create**.
5. In the **Create a virtual machine** screen, enter a value for **DNS name**.
6. From the **Image** dropdown list, select an image, such as **Windows Server 2008 R2 SP1**.
7. Enter a password in the **New password** field, and re-enter it in the **Confirm** field. Remember this password, you will use it when you remotely log in to the virtual machine.
8. From the **Location** drop down list, select the data center location for your virtual machine; for example, **West US**.
9. Click **Create virtual machine**. Your virtual machine will be created. You can monitor the status in the **Virtual machines** section of the management portal.

## To remotely log in to your virtual machine

1. Log in to the [Preview Management Portal](https://manage.windowsazure.com).
2. Click **Virtual machines**.
3. Click the name of the virtual machine that you want to log in to.
4. Click **Connect**.
5. Respond to the prompts as needed to connect to the virtual machine. When prompted for the password, use the password that you provided when you created the virtual machine.

## To install a JDK on your virtual machine

You can copy a Java Developer Kit (JDK) to your virtual machine, or install a JDK through an installer. 

For purposes of this tutorial, a JDK will be installed from Oracle's site.

1. Log in to your virtual machine.
2. Within your browser, open [http://www.oracle.com/technetwork/java/javase/downloads/index.html](http://www.oracle.com/technetwork/java/javase/downloads/index.html).
3. Click the **Download** button for the JDK that you want to download. For purposes of this tutorial, the **Download** button for the Java SE 6 Update 32 JDK was used.
4. Accept the license agreement.
5. Click the download executable for **Windows x64 (64-bit)**.
6. Follow the prompts and respond as needed to install the JDK to your virtual machine.

## To install a Java application server on your virtual machine

You can copy a Java application server to your virtual machine, or install a Java application server through an installer. 

For purposes of this tutorial, a Java application server will be installed by copying a zip file from Apache's site.

1. Log in to your virtual machine.
2. Within your browser, open [http://tomcat.apache.org/download-70.cgi](http://tomcat.apache.org/download-70.cgi).
3. Double-click **64-bit Windows zip**. (This tutorial used the zip for Tomcat Apache 7.0.27.)
4. When prompted, choose to save the zip.
5. When the zip is saved, open the folder that contains the zip and double-click the zip.
6. Extract the zip. For purposes of this tutorial, the path used was **C:\program files\apache-tomcat-7.0.27-windows-x64**.

## To run the Java application server locally

The following steps show you how to run the Java application server and test it within the virtual machine's browser. It won't be usable by external computers until you create an endpoint and open a port (those steps are described later).

1. Log in to your virtual machine.
2. Add the JDK bin folder to the **Path** environment variable: 
- Click **Windows Start**.
- Right-click **Computer**.
- Click **Properties**.
- Click **Advanced system settings**.
- Click **Advanced**.
- Click **Environment variables**.
- In the **System variables** section, click the **Path** variable and then click **Edit**.
- Add a trailing **;** to the **Path** variable value (if there is not one already) and then add **c:\program files\java\jdk\bin** to the end of the **Path** variable value (adjust the path as needed if you did not use **c:\program files\java\jdk** as the path for your JDK installation).
- Press **OK** on the opened dialogs to save your **Path** change.
3. Set the **JAVA_HOME** environment variable:
- Click **Windows Start**.
- Right-click **Computer**.
- Click **Properties**.
- Click **Advanced system settings**.
- Click **Advanced**.
- Click **Environment variables**.
- In the **System variables** section, click **New**.
- Create a variable named **JRE\_HOME** and set its value to **c:\program files\java\jdk\jre** (adjust the path as needed if you did not use **c:\program files\java\jdk** as the path for your JDK installation).
- Press **OK** on the open dialogs to save your **JRE\_HOME** environment variable.
4. Start Tomcat:
- Open a command prompt.
- Change the current directory to the Apache Tomcat **bin** folder. For example:
<p>**cd c:\program files\apache-tomcat-7.0.27-windows-x64\apache-tomcat-7.0.27\bin**</p> (Adjust the path as needed if you used a differrent installation path for Tomcat.)
- Run **catalina.bat start**.

You should now see Tomcat running if you run the virtual machine's browser and open [http://localhost:8080](http://localhost:8080).

To see Tomcat running from external machines, you'll need to create an endpoint and open a port.

## To create an endpoint for your virtual machine
1. Log in to the [Preview Management Portal](https://manage.windowsazure.com).
2. Click **Virtual machines**.
3. Click the name of the virtual machine that is running your Java application server.
4. Click **Endpoints**.
5. Click **Add endpoint**.
6. In the **Add endpoint** dialog, ensure **Add endpoint** is checked and click the **Next** button.
7. In the **New endpoint details** dialog
- Specify a name for the endpoint; for example, **HttpIn**.
- Specify **TCP** for the protocol.
- Specify **80** for the public port.
- Specify **8080** for the private port. <p>Your screen should look similar to the following:</p>
![Creating a new endpoint][virtual_machine_new_eps]
- Click the **Check** button to close the dialog. Your endpoint will now be created.

## To open a port in the firewall for your virtual machine
1. Log in to your virtual machine.
2. Click **Windows Start**.
3. Click **Control Panel**.
4. Click **System and Security**, click **Windows Firewall**, and then click **Advanced Settings**.
5. Click **Inbound Rules** and then click **New Rule**.
6. For the new rule
- Select **Port** for the **Rule type** and click **Next**.
- Select **TCP** for the protocol and specify **8080** for the port, and click **Next**.
- Choose **Allow the connection** and click **Next**.
- Ensure **Domain**, **Private**, and **Public** are checked for the profile and click **Next**.
- Specify a name for the rule, such as **HttpIn**. The rule name is not required to match the endpoint name, however.  Click **Finish**.

At this point, your Tomcat web site should now be viewable from an external browser, using a URL of the form **http://*your\_DNS\_name*.cloudapp.net**, where ***your\_DNS\_name*** is the DNS name you specified when you created the virtual machine.

## Next steps

* You could create your own application web archive (WAR) and add it to the **webapps** folder. For example, create a basic Java Service Page (JSP) dynamic web project and export it as a WAR file, copy the WAR to the Apache Tomcat **webapps** folder on the virtual machine, then run it in a browser.
* This tutorial runs Tomcat through a command prompt where **catalina.bat start** was called. You may instead want to run Tomcat as a service, a key benefit being to have it automatically start if the virtual machine is rebooted. To run Tomcat as a service, you can install it as a service via the **service.bat** file in the Apache Tomcat **bin** folder, and then you could set it up to run automatically via the Services snap-in. You can start the Services snap-in by clicking **Windows Start**, **Administrative Tools**, and then **Services**. If you run **service.bat install MyTomcat** in the Apache Tomcat **bin** folder, then within the Services snap-in, your service name will appear as **Apache Tomcat MyTomcat**. By default when the service is installed, it will be set to start manually. To set it to start automatically, double-click the service in the Services snap-in and set **Startup Type** to **Automatic**, as shown in the following. <p>![Setting a service to start automatically][service_automatic_startup]</p>
You'll need to start the service the first time, which you can do through the Services snap-in (alternatively, you can reboot the virtual machine). Close the running occurrence of **catalina.bat start** if it is still running before starting the service.

* Learn about other services, such as Windows Azure Storage, service bus, SQL Azure, and more that you may want to include with your Java applications, by viewing the information available at [http://www.windowsazure.com/en-us/develop/java/](http://www.windowsazure.com/en-us/develop/java/).



[virtual_machine_tomcat]: ../../media/WA_VirtualMachineRunningApacheTomcat.png
[virtual_machine_new_eps]: ../../media/WA_NewEndpointDetails.png
[service_automatic_startup]: ../../media/WA_TomcatServiceAutomaticStart.png