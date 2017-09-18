---
title: Set up Apache Tomcat on a Linux virtual machine | Microsoft Docs
description: Learn how to set up Apache Tomcat7 by using Azure Virtual Machines running Linux.
services: virtual-machines-linux
documentationcenter: ''
author: NingKuang
manager: timlt
editor: ''
tags: azure-service-management

ms.assetid: 45ecc89c-1cb0-4e80-8944-bd0d0bbedfdc
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 12/15/2015
ms.author: ningk

---
# Set up Tomcat7 on a Linux virtual machine with Azure
Apache Tomcat (or simply Tomcat, also formerly called Jakarta Tomcat) is an open source web server and servlet container developed by the Apache Software Foundation (ASF). Tomcat implements the Java Servlet and the JavaServer Pages (JSP) specifications from Sun Microsystems. Tomcat provides a pure Java HTTP web server environment in which to run Java code. In the simplest configuration, Tomcat runs in a single operating system process. This process runs a Java virtual machine (JVM). Every HTTP request from a browser to Tomcat is processed as a separate thread in the Tomcat process.  

> [!IMPORTANT]
> Azure has two different deployment models for creating and working with resources: [Azure Resource Manager and classic](../../../resource-manager-deployment-model.md). This article covers how to use the classic deployment model. We recommend that most new deployments use the Resource Manager model. To use a Resource Manager template to deploy an Ubuntu VM with Open JDK and Tomcat, see [this article](https://azure.microsoft.com/documentation/templates/openjdk-tomcat-ubuntu-vm/).

In this article, you will install Tomcat7 on a Linux image and deploy it in Azure.  

You will learn:  

* How to create a virtual machine in Azure.
* How to prepare the virtual machine for Tomcat7.
* How to install Tomcat7.

It is assumed that you already have an Azure subscription.  If not, you can sign up for a free trial at [the Azure website](https://azure.microsoft.com/). If you have an MSDN subscription, see [Microsoft Azure Special Pricing: MSDN, MPN, and BizSpark Benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits/?c=14-39). To learn more about Azure, see [What is Azure?](https://azure.microsoft.com/overview/what-is-azure/).

This article assumes that you have a basic working knowledge of Tomcat and Linux.  

## Phase 1: Create an image
In this phase, you will create a virtual machine by using a Linux image in Azure.  

### Step 1: Generate an SSH authentication key
SSH is an important tool for system administrators. However, configuring access security based on a human-determined password is not recommended. Malicious users can break into your system based on a username and a weak password.

The good news is that there is a way to leave remote access open and not worry about passwords. This method consists of authentication with asymmetric cryptography. The user’s private key is the one that grants the authentication. You can even lock the user’s account to not allow password authentication.

Another advantage of this method is that you do not need different passwords to sign in to different servers. You can authenticate by using the personal private key on all servers, which prevents you from having to remember several passwords.



Follow these steps to generate the SSH authentication key.

1. Download and install PuTTYgen from the following location: [http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html)
2. Run Puttygen.exe.
3. Click **Generate** to generate the keys. In the process, you can increase randomness by moving the mouse over the blank area in the window.  
   ![PuTTY Key Generator screenshot that shows the generate new key button][1]
4. After the generate process, Puttygen.exe will show your new public key.  
   ![PuTTY Key Generator screenshot that shows the new public key and the save private key button][2]
5. Select and copy the public key, and save it in a file named publicKey.pem. Don’t click **Save public key**, because the saved public key’s file format is different from the public key we want.
6. Click **Save private key**, and save it in a file named privateKey.ppk.

### Step 2: Create the image in the Azure portal
1. In the [portal](https://portal.azure.com/), click **New** in the task bar to create an image. Then choose the Linux image that is based on your needs. The following example uses the Ubuntu 14.04 image.
![Screenshot of the portal that shows the New button][3]

2. For **Host Name**, specify the name for the URL that you and Internet clients will use to access this virtual machine. Define the last part of the DNS name, for example, tomcatdemo. Azure will then generate the URL as tomcatdemo.cloudapp.net.  

3. For **SSH Authentication Key**, copy the key value from the publicKey.pem file, which contains the public key generated by PuTTYgen.  
![SSH Authentication Key box in the portal][4]

4. Configure other settings as needed, and then click **Create**.  

## Phase 2: Prepare your virtual machine for Tomcat7
In this phase, you will configure an endpoint for Tomcat traffic, and then connect to your new virtual machine.

### Step 1: Open the HTTP port to allow web access
Endpoints in Azure consist of a TCP or UDP protocol, along with a public and private port. The private port is the port that the service is listening to on the virtual machine. The public port is the port that the Azure cloud service listens to externally for incoming, Internet-based traffic.  

TCP port 8080 is the default port number that Tomcat uses to listen. If this port is opened with an Azure endpoint, you and other Internet clients can access Tomcat pages.  

1. In the portal, click **Browse** > **Virtual machines**, and then click the virtual machine that you created.  
   ![Screenshot of the Virtual machines directory][5]
2. To add an endpoint to your virtual machine, click the **Endpoints** box.
   ![Screenshot that shows the Endpoints box][6]
3. Click **Add**.  

   1. For the endpoint, enter a name for the endpoint in **Endpoint**, and then enter 80 in **Public Port**.  

      If you set it to 80, you don’t need to include the port number in the URL that is used to access Tomcat. For example, http://tomcatdemo.cloudapp.net.    

      If you set it to another value, such as 81, you need to add the port number to the URL to access Tomcat. For example,  http://tomcatdemo.cloudapp.net:81/.
   2. Enter 8080 in **Private Port**. By default, Tomcat listens on TCP port 8080. If you changed the default listen port of Tomcat, you should update **Private Port** to be the same as the Tomcat listen port.  
      ![Screenshot of UI that shows Add command, Public Port, and Private Port][7]
4. Click **OK** to add the endpoint to your virtual machine.

### Step 2: Connect to the image you created
You can choose any SSH tool to connect to your virtual machine. In this example, we use PuTTY.  

1. Get the DNS name of your virtual machine from the portal.
    1. Click **Browse** > **Virtual machines**.
    2. Select the name of your virtual machine, and then click **Properties**.
    3. In the **Properties** tile, look in the **Domain Name** box to get the DNS name.  

2. Get the port number for SSH connections from the **SSH** box.  
![Screenshot that shows the SSH connection port number][8]

3. Download [PuTTY](http://www.putty.org/).  

4. After downloading, click the executable file Putty.exe. In PuTTY configuration, configure the basic options with the host name and port number that is obtained from the properties of your virtual machine.   
![Screenshot that shows the PuTTY configuration host name and port options][9]

5. In the left pane, click **Connection** > **SSH** > **Auth**, and then click **Browse** to specify the location of the privateKey.ppk file. The privateKey.ppk file contains the private key that is generated by PuTTYgen earlier in the "Phase 1: Create an image" section of this article.  
![Screenshot that shows the Connection directory hierarchy and Browse button][10]

6. Click **Open**. You might be alerted by a message box. If you have configured the DNS name and port number correctly, click **Yes**.
![Screenshot that shows the notification][11]

7. You are prompted to enter your username.  
![Screenshot that shows where to enter username][12]

8. Enter the username that you used to create the virtual machine in the "Phase 1: Create an image" section earlier in this article. You will see something like the following:  
![Screenshot that shows the authentication confirmation][13]

## Phase 3: Install software
In this phase, you install the Java runtime environment, Tomcat7, and other Tomcat7 components.  

### Java runtime environment
Tomcat is written in Java. There are two kinds of Java Development Kits (JDKs), OpenJDK and Oracle JDK. You can choose the one you want.  

> [!NOTE]
> Both JDKs have almost the same code for the classes in the Java API, but the code for the virtual machine is different. OpenJDK tends to use open libraries, while Oracle JDK tends to use closed ones. Oracle JDK has more classes and some fixed bugs, and Oracle JDK is more stable than OpenJDK.

#### Install OpenJDK  

Use the following command to download OpenJDK.   

    sudo apt-get update  
    sudo apt-get install openjdk-7-jre  


* To create a directory to contain the JDK files:  

        sudo mkdir /usr/lib/jvm  
* To extract the JDK files into the /usr/lib/jvm/ directory:  

        sudo tar -zxf jdk-8u5-linux-x64.tar.gz  -C /usr/lib/jvm/

#### Install Oracle JDK


Use the following command to download Oracle JDK from the Oracle website.  

     wget --header "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u5-b13/jdk-8u5-linux-x64.tar.gz  
* To create a directory to contain the JDK files:  

        sudo mkdir /usr/lib/jvm  
* To extract the JDK files into the /usr/lib/jvm/ directory:  

        sudo tar -zxf jdk-8u5-linux-x64.tar.gz  -C /usr/lib/jvm/  
* To set Oracle JDK as the default Java virtual machine:  

        sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/jdk1.8.0_05/bin/java 100  

        sudo update-alternatives --install /usr/bin/javac javac /usr/lib/jvm/jdk1.8.0_05/bin/javac 100  

#### Confirm that Java installation is successful
You can use a command like the following to test if the Java runtime environment is installed correctly:  

    java -version  

If you installed OpenJDK, you should see a message like the following:
![Successful OpenJDK installation message][14]

If you installed Oracle JDK, you should see a message like the following:
![Successful Oracle JDK installation message][15]

### Install Tomcat7
Use the following command to install Tomcat7.  

    sudo apt-get install tomcat7  

If you are not using Tomcat7, use the appropriate variation of this command.  

#### Confirm that Tomcat7 installation is successful
To check if Tomcat7 is successfully installed, browse to your Tomcat server’s DNS name. In this article, the example URL is http://tomcatexample.cloudapp.net/. If you see a message like the following, Tomcat7 is installed correctly.
![Successful Tomcat7 installation message][16]

### Install other Tomcat7 components
There are other optional Tomcat components that you can install.  

Use the **sudo apt-cache search tomcat7** command to see all of the available components. Use the following commands to install some useful components.  

    sudo apt-get install tomcat7-admin      #admin web applications

    sudo apt-get install tomcat7-user         #tools to create user instances  

## Phase 4: Configure Tomcat7
In this phase, you administer Tomcat.

### Start and stop Tomcat7
The Tomcat7 server automatically starts when you install it. You can also start it with the following command:   

    sudo /etc/init.d/tomcat7 start

To stop Tomcat7:

    sudo /etc/init.d/tomcat7 stop

To view the status of Tomcat7:

    sudo /etc/init.d/tomcat7 status

To restart Tomcat services: 

    sudo /etc/init.d/tomcat7 restart

### Tomcat7 administration
You can edit the Tomcat user configuration file to set up your admin credentials. Use the following command:  

    sudo vi  /etc/tomcat7/tomcat-users.xml   

Here is an example:  
![Screenshot that shows the sudo vi command output][17]  

> [!NOTE]
> Create a strong password for the admin username.  

After editing this file, you should restart Tomcat7 services with the following command to ensure that the changes take effect:  

    sudo /etc/init.d/tomcat7 restart  

Open your browser, and enter **http://<your tomcat server DNS name>/manager/html** as the URL. For the example in this article, the URL is http://tomcatexample.cloudapp.net/manager/html.  

After connecting, you should see something similar to the following:  
![Screenshot of the Tomcat Web Application Manager][18]

## Common issues
### Can't access the virtual machine with Tomcat and Moodle from the Internet
#### Symptom  
  Tomcat is running but you can’t see the Tomcat default page with your browser.
#### Possible root cause   

  * The Tomcat listen port is not the same as the private port of your virtual machine's endpoint for Tomcat traffic.  

     Check your public port and private port endpoint settings and make sure the private port is the same as the Tomcat listen port. See "Phase 1: Create an image" section of this article for instructions on configuring endpoints for your virtual machine.  

     To determine the Tomcat listen port, open /etc/httpd/conf/httpd.conf (Red Hat release), or /etc/tomcat7/server.xml (Debian release). By default, the Tomcat listen port is 8080. Here is an example:  

        <Connector port="8080" protocol="HTTP/1.1"  connectionTimeout="20000"   URIEncoding="UTF-8"            redirectPort="8443" />  

     If you are using a virtual machine like Debian or Ubuntu and you want to change the default port of Tomcat Listen (for example 8081), you should also open the port for the operating system. First, open the profile:  

        sudo vi /etc/default/tomcat7  

     Then uncomment the last line and change “no” to “yes”.  

        AUTHBIND=yes
  2. The firewall has disabled the listen port of Tomcat.

     You can only see the Tomcat default page from the local host. The problem is most likely that the port, which is listened to by Tomcat, is blocked by the firewall. You can use the w3m tool to browse the webpage. The following commands install w3m and browse to the Tomcat default page:  


        sudo yum  install w3m w3m-img


        w3m http://localhost:8080  
#### Solution

  * If the Tomcat listen port is not the same as the private port of the endpoint for traffic to the virtual machine, you need change the private port to be the same as the Tomcat listen port.   
  2. If the issue is caused by firewall/iptables, add the following lines to /etc/sysconfig/iptables. The second line is only needed for https traffic:  

      -A INPUT -p tcp -m tcp --dport 80 -j ACCEPT

      -A INPUT -p tcp -m tcp --dport 443 -j ACCEPT  

     > [!IMPORTANT]
     > Make sure the previous lines are positioned above any lines that would globally restrict access, such as the following: -A INPUT -j REJECT --reject-with icmp-host-prohibited



To reload the iptables, run the following command:

    service iptables restart

This has been tested on CentOS 6.3.

### Permission denied when you upload project files to /var/lib/tomcat7/webapps/
#### Symptom
  When you use an SFTP client (such as FileZilla) to connect to your virtual machine and navigate to /var/lib/tomcat7/webapps/ to publish your site, you get an error message similar to the following:  

     status:    Listing directory /var/lib/tomcat7/webapps
     Command:    put "C:\Users\liang\Desktop\info.jsp" "info.jsp"
     Error:    /var/lib/tomcat7/webapps/info.jsp: open for write: permission denied
     Error:    File transfer failed
#### Possible root cause
  You have no permissions to access the /var/lib/tomcat7/webapps folder.  
#### Solution  
  You need to get permission from the root account. You can change the ownership of that folder from root to the username you used when you provisioned the machine. Here is an example with the azureuser account name:  

     sudo chown azureuser -R /var/lib/tomcat7/webapps

  Use the -R option to apply the permissions for all files inside of a directory too.  

  This command also works for directories. The -R option changes the permissions for all files and directories inside the directory. Here is an example:  

     sudo chown -R username:group directory  

  This command changes ownership (both user and group) for all files and directories that are inside the directory.  

  The following command only changes the permission of the folder directory. The files and folders inside the directory are not changed.  

     sudo chown username:group directory

[1]:media/setup-tomcat/virtual-machines-linux-setup-tomcat7-linux-01.png
[2]:media/setup-tomcat/virtual-machines-linux-setup-tomcat7-linux-02.png
[3]:media/setup-tomcat/virtual-machines-linux-setup-tomcat7-linux-03.png
[4]:media/setup-tomcat/virtual-machines-linux-setup-tomcat7-linux-04.png
[5]:media/setup-tomcat/virtual-machines-linux-setup-tomcat7-linux-05.png
[6]:media/setup-tomcat/virtual-machines-linux-setup-tomcat7-linux-06.png
[7]:media/setup-tomcat/virtual-machines-linux-setup-tomcat7-linux-07.png
[8]:media/setup-tomcat/virtual-machines-linux-setup-tomcat7-linux-08.png
[9]:media/setup-tomcat/virtual-machines-linux-setup-tomcat7-linux-09.png
[10]:media/setup-tomcat/virtual-machines-linux-setup-tomcat7-linux-10.png
[11]:media/setup-tomcat/virtual-machines-linux-setup-tomcat7-linux-11.png
[12]:media/setup-tomcat/virtual-machines-linux-setup-tomcat7-linux-12.png
[13]:media/setup-tomcat/virtual-machines-linux-setup-tomcat7-linux-13.png
[14]:media/setup-tomcat/virtual-machines-linux-setup-tomcat7-linux-14.png
[15]:media/setup-tomcat/virtual-machines-linux-setup-tomcat7-linux-15.png
[16]:media/setup-tomcat/virtual-machines-linux-setup-tomcat7-linux-16.png
[17]:media/setup-tomcat/virtual-machines-linux-setup-tomcat7-linux-17.png
[18]:media/setup-tomcat/virtual-machines-linux-setup-tomcat7-linux-18.png
