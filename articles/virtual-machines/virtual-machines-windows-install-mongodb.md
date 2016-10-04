<properties
	pageTitle="Install MongoDB on a Windows VM | Microsoft Azure"
	description="Learn how to install MongoDB on an Azure VM running Windows Server 2012 R2 created with the Resource Manager deployment model."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="iainfoulds"
	manager="timlt"
	editor="">

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/04/2016"
	ms.author="iainfou"/>

# Install MongoDB on a Windows VM in Azure using Resource Manager

[MongoDB](http://www.mongodb.org/) is a popular open-source, high-performance NoSQL database. This article guides you installing and configuring MongoDB on a Windows Server 2012 RV virtual machine (VM) in Azure created using the Resource Manager deployment model.

## Prerequisites

Before you install and configure MongoDB you create a VM and, ideally, add a data disk to it. See the following articles to create a VM and add a data disk:

- [Create a Windows Server VM using the Azure portal](virtual-machines-windows-hero-tutorial.md)
	- Or, [create a Windows Server VM using Azure PowerShell](virtual-machines-windows-ps-create.md)
- [Attach a data disk to a Windows Server VM using the Azure portal](virtual-machines-windows-attach-disk-portal.md)
	- Or, [attach a data disk to a Windows Server VM using Azure PowerShell](https://msdn.microsoft.com/library/mt603673.aspx)

[Log on to your Windows Server VM](virtual-machines-windows-connect-logon.md) using Remote Desktop to begin installing and configuring MongoDB.


## Install and run MongoDB

> [AZURE.IMPORTANT] MongoDB security features, such as authentication and IP address binding, are not enabled by default. Security features should be enabled before deploying MongoDB to a production environment.  For more information, see [Security and Authentication](http://www.mongodb.org/display/DOCS/Security+and+Authentication).

1. After you've connected to your VM using Remote Desktop, open Internet Explorer from the **Start** menu on the VM.

2. Select 'Use recommended security, privacy, and compatibility settings' when Internet Explorer first opens and click 'OK'.

3. Select the **Tools** button in the upper right corner.  In **Internet Options**, select the **Security** tab, and then select the **Trusted Sites** icon, and finally click the **Sites** button. Add _https://\*.mongodb.org_ to the list of trusted sites, then close the dialog box.

4. Browse to the [MongoDB - Downloads](http://www.mongodb.org/downloads) page (http://www.mongodb.org/downloads).

5. By default, it should select the **Community Server** edition and the latest current stable release for Windows Server 2008 R2 64-bit and later. To download the installer, click the **DOWNLOAD (msi)** button:

	![Download MongoDB installer][./media/virtual-machines-windows-install-mongodb/download-mongodb.png]

	Run the installer once the download is complete.

6. Read and accept the license agreement. When prompted, select **Complete** install.

7. On the final screen, click **Install**

8. The PATH variables are not updated by the MongoDB installer. Right-click the Start menu and select **System**. Click **Advanced System Settings** and then **Environment Variables**. Under **System variables**, select **Path** and then click **Edit**.

	Add the path to your MongoDB `bin` folder. MongoDB is typically installed on C:\Program Files\MongoDB. The following example adds the location to the `PATH` variable:

	```
	;C:\Program Files\MongoDB\Server\3.2\bin
	```

	> [AZURE.NOTE] Be sure to add the leading semicolon (`;`) to indicate that you are adding a location to your `PATH` variable.

9. Create MongoDB data and log directories on your data disk (drive **F:**, for example). From **Start**, select **Command Prompt** to open a command prompt window.  Type:

	```
	C:\> F:
	F:\> mkdir \MongoData
	F:\> mkdir \MongoLogs
	```

10. To run the database, run:

	```
	F:\> C:
	C:\> mongod --dbpath F:\MongoData\ --logpath F:\MongoLogs\mongolog.log
	```

	All log messages are directed to the *F:\MongoLogs\mongolog.log* file as mongod.exe server starts and preallocates journal files. It may take several minutes for MongoDB to preallocate the journal files and start listening for connections. The command prompt stays focused on this task while your MongoDB instance is running.

11. To start the MongoDB administrative shell, open another command window from **Start** and type the following command:

	```
	C:\> cd \my_mongo_dir\bin  
	C:\my_mongo_dir\bin> mongo  
	>db  
	test
	> db.foo.insert( { a : 1 } )  
	> db.foo.find()  
	{ _id : ..., a : 1 }  
	> show dbs  
	...  
	> show collections  
	...  
	> help  
	```

	The database is created by the insert.

12. Alternatively, you can install mongod.exe as a service:

	```
	C:\> mongod --dbpath F:\MongoData\ --logpath F:\MongoLogs\mongolog.log --logappend  --install
	```

	This command creates a service named MongoDB with a description of "Mongo DB". The `--logpath` option must be used to specify a log file, since the running service does not have a command window to display output.  The `--logappend` option specifies that a restart of the service causes output to append to the existing log file.  The `--dbpath` option specifies the location of the data directory. For more service-related command line options, see [Service-related command line options] [MongoWindowsSvcOptions].

	To start the service, run this command:

	```
	C:\> net start MongoDB
	```

13. Now that MongoDB is installed and running, open a port in Windows Firewall so you can remotely connect to MongoDB.  From the **Start** menu, select **Administrative Tools** and then **Windows Firewall with Advanced Security**.





11. In the left pane, select **Inbound Rules**.  In the **Actions** pane on the right, select **New Rule...**.

	![Windows Firewall][Image1]

	In the **New Inbound Rule Wizard**, select **Port** and then click **Next**.

	![Windows Firewall][Image2]

	Select **TCP** and then **Specific local ports**.  Specify a port of "27017" (the default port MongoDB listens on) and click **Next**.

	![Windows Firewall][Image3]

	Select **Allow the connection** and click **Next**.

	![Windows Firewall][Image4]

	Click **Next** again.

	![Windows Firewall][Image5]

	Specify a name for the rule, such as "MongoPort", and click **Finish**.

	![Windows Firewall][Image6]

12. If you didn't configure an endpoint for MongoDB when you created the virtual machine, you can do it now. You need both the firewall rule and the endpoint to be able to connect to MongoDB remotely. In the Management Portal, click **Virtual Machines**, click the name of your new virtual machine, and then click **Endpoints**.

	![Endpoints][Image7]

13. Click **Add** at the bottom of the page. Select **Add a Stand-Alone Endpoint** and click **Next**.

	![Endpoints][Image8]

14. Add an endpoint with name "Mongo", protocol **TCP**, and both **Public** and **Private** ports set to "27017". This endpoint allows MongoDB to be accessed remotely.

	![Endpoints][Image9]

> [AZURE.NOTE] The port 27017 is the default port used by MongoDB. You can change this port by using the _--port_ parameter when starting the mongod.exe server. Make sure to give the same port number in the firewall and the "Mongo" endpoint in the preceding instructions.


[MongoDownloads]: http://www.mongodb.org/downloads

[MongoWindowsSvcOptions]: http://www.mongodb.org/display/DOCS/Windows+Service


## Summary
In this tutorial, you learned how to create a virtual machine running Windows Server, remotely connect to it, and attach a data disk.  You also learned how to install and configure MongoDB on the Windows-based virtual machine. You can now access MongoDB on the Windows-based virtual machine, by following the advanced topics in the [MongoDB documentation][MongoDocs].
