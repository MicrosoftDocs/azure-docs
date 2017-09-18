---
title: Run Java application server on a classic Azure VM | Microsoft Docs
description: This tutorial uses resources created with  the classic deployment model, and shows how to create a Windows Virtual machine and configure it to run Apache Tomcat application server.
services: virtual-machines-windows
documentationcenter: java
author: rmcmurray
manager: erikre
editor: ''
tags: azure-service-management

ms.assetid: d627aa09-f7d6-4239-8110-f8fc5111b939
ms.service: virtual-machines-windows
ms.workload: web
ms.tgt_pltfrm: vm-windows
ms.devlang: Java
ms.topic: article
ms.date: 03/16/2017
ms.author: robmcm

---
# How to run a Java application server on a virtual machine created with the classic deployment model
> [!IMPORTANT]
> Azure has two different deployment models for creating and working with resources: [Resource Manager and Classic](../../../resource-manager-deployment-model.md). This article covers using the Classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model. For a Resource Manager template to deploy a webapp with Java 8 and Tomcat, see [here](https://azure.microsoft.com/documentation/templates/201-web-app-java-tomcat/).

With Azure, you can use a virtual machine to provide server capabilities. As an example, a virtual machine running on Azure can be configured to host a Java application server, such as Apache Tomcat.

After completing this guide, you will have an understanding of how to create a virtual machine running on Azure and configure it to run a Java application server. You will learn and perform the following tasks:

* How to create a virtual machine that has a Java Development Kit (JDK) already installed.
* How to remotely sign in to your virtual machine.
* How to install a Java application server--Apache Tomcat--on your virtual machine.
* How to create an endpoint for your virtual machine.
* How to open a port in the firewall for your application server.

The completed installation results in Tomcat running on a virtual machine.

![Virtual machine running Apache Tomcat][virtual_machine_tomcat]

[!INCLUDE [create-account-and-vms-note](../../../../includes/create-account-and-vms-note.md)]

## To create a virtual machine
1. Sign in to the [Azure portal](https://portal.azure.com).  
2. Click **New**, click **Compute**, then click **See all** in the **Featured apps**.
3. Click **JDK**, click **JDK 8** in the **JDK** pane.  
   Virtual machine images that support **JDK 6** and **JDK 7** are available if you have legacy applications that are not ready to run in JDK 8.
4. In the JDK 8 pane, select **Classic**, then click **Create**.
5. In the **Basics** blade:
   1. Specify a name for the virtual machine.
   2. Enter a name for the administrator in the **User Name** field. Remember this name and the associated password that follows in the next field. You need them when you remotely sign in to the virtual machine.
   3. Enter a password in the **New password** field, and reenter it in the **Confirm password** field. This password is for the Administrator account.
   4. Select the appropriate **Subscription**.
   5. For the **Resource group**, click **Create new** and enter the name of a new resource group. Or, click **Use existing** and select one of the available resource groups.
   6. Select a location where the virtual machine resides, such as **South Central US**.
6. Click **Next**.
7. In the **Virtual machine image size** blade, select **A1 Standard** or another appropriate image.
8. Click **Select**.

9. In the **Settings** blade, click **OK**. You can use the default values provided by Azure.  
10. In the **Summary** blade, click **OK**.

## To remotely sign in to your virtual machine
1. Log on to the [Azure portal](https://portal.azure.com).
2. Click **Virtual machines (classic)**. If needed, click **More services** at the bottom left corner under the service categories. The **Virtual machines (classic)** entry is listed in the **Compute** group.
3. Click the name of the virtual machine that you want to sign in to.
4. After the virtual machine has started, a menu at the top of the pane allows connections.
5. Click **Connect**.
6. Respond to the prompts as needed to connect to the virtual machine. Typically, you save or open the .rdp file that contains the connection details. You might have to copy the url:port as the last part of the first line of the .rdp file and paste it in a remote sign-in application.

## To install a Java application server on your virtual machine
You can copy a Java application server to your virtual machine, or you can install a Java application server through an installer.

This tutorial uses Tomcat as the Java application server to install.

1. When you are signed in to your virtual machine, open a browser session to [Apache Tomcat](http://tomcat.apache.org/download-80.cgi).
2. Double-click the link for **32-bit/64-bit Windows Service Installer**. By using this technique, Tomcat installs as a Windows service.
3. When prompted, choose to run the installer.
4. Within the **Apache Tomcat Setup** wizard, follow the prompts to install Tomcat. For the purposes of this tutorial, accepting the defaults is fine. When you reach the **Completing the Apache Tomcat Setup Wizard** dialog box, you can optionally check **Run Apache Tomcat** to have Tomcat start now. Click **Finish** to complete the Tomcat setup process.

## To start Tomcat

You can manually start Tomcat by opening a command prompt on your virtual machine and running the command **net&nbsp;start&nbsp;Tomcat8**.

Once Tomcat is running, you can access Tomcat by entering the URL <http://localhost:8080> in the virtual machine's browser.

To see Tomcat running from external machines, you need to create an endpoint and open a port.

## To create an endpoint for your virtual machine
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click **Virtual machines (classic)**.
3. Click the name of the virtual machine that is running your Java application server.
4. Click **Endpoints**.
5. Click **Add**.
6. In the **Add endpoint** dialog box:
   1. Specify a name for the endpoint; for example, **HttpIn**.
   2. Select **TCP** for the protocol.
   3. Specify **80** for the public port.
   4. Specify **8080** for the private port.
   5. Select **Disabled** for the floating IP address.
   6. Leave the access control list as is.
   7. Click the **OK** button to close the dialog box and create the endpoint.

## To open a port in the firewall for your virtual machine
1. Sign in to your virtual machine.
2. Click **Windows Start**.
3. Click **Control Panel**.
4. Click **System and Security**, click **Windows Firewall**, and then click **Advanced Settings**.
5. Click **Inbound Rules**, and then click **New Rule**.  
   ![New inbound rule][NewIBRule]
6. For the **Rule Type**, select **Port**, and then click **Next**.  
   ![New inbound rule port][NewRulePort]
7. On the **Protocol and Ports** screen, select **TCP**, specify **8080** as the **Specific local port**, and then click **Next**.  
  ![New inbound rule ][NewRuleProtocol]
8. On the **Action** screen, select **Allow the connection**, and then click **Next**.
   ![New inbound rule action][NewRuleAction]
9. On the **Profile** screen, ensure that **Domain**, **Private**, and **Public** are selected, and then click **Next**.
   ![New inbound rule profile][NewRuleProfile]
10. On the **Name** screen, specify a name for the rule, such as **HttpIn** (the rule name is not required to match the endpoint name, however), and then click **Finish**.  
    ![New inbound rule name][NewRuleName]

At this point, your Tomcat website should be viewable from an external browser. In the browser's address window, type a URL of the form **http://*your\_DNS\_name*.cloudapp.net**, where ***your\_DNS\_name*** is the DNS name you specified when you created the virtual machine.

## Application lifecycle considerations
* You could create your own web application archive (WAR) and add it to the **webapps** folder. For example, create a basic Java Service Page (JSP) dynamic web project and export it as a WAR file. Next, copy the WAR to the Apache Tomcat **webapps** folder on the virtual machine, then run it in a browser.
* By default when the Tomcat service is installed, it is set to start manually. You can switch it to start automatically by using the Services snap-in. Start the Services snap-in by clicking **Windows Start**, **Administrative Tools**, and then **Services**. Double-click the **Apache Tomcat** service and set **Startup type** to **Automatic**.

    ![Setting a service to start automatically][service_automatic_startup]

    The benefit of having Tomcat start automatically is that it starts running when the virtual machine is rebooted (for example, after software updates that require a reboot are installed).

## Next steps
You can learn about other services (such as Azure Storage, service bus, and SQL Database) that you may want to include with your Java applications. View the information available at the [Java Developer Center](https://azure.microsoft.com/develop/java/).

[virtual_machine_tomcat]:media/java-run-tomcat-app-server/WA_VirtualMachineRunningApacheTomcat.png

[service_automatic_startup]:media/java-run-tomcat-app-server/WA_TomcatServiceAutomaticStart.png









[NewIBRule]:media/java-run-tomcat-app-server/NewInboundRule.png
[NewRulePort]:media/java-run-tomcat-app-server/NewRulePort.png
[NewRuleProtocol]:media/java-run-tomcat-app-server/NewRuleProtocol.png
[NewRuleAction]:media/java-run-tomcat-app-server/NewRuleAction.png
[NewRuleName]:media/java-run-tomcat-app-server/NewRuleName.png
[NewRuleProfile]:media/java-run-tomcat-app-server/NewRuleProfile.png


<!-- Deleted from the "To create an ednpoint for your virtual mache" 3/17/2017,
     to use the new portal.
6. In the **Add endpoint** dialog box, ensure **Add standalone endpoint** is selected, and then click **Next**.
7. In the **New endpoint details** dialog box:
-->
