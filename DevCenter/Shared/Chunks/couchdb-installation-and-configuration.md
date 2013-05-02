# CouchDB Installation and Configuration

*By Nick Ghinazzi, [Microsoft Open Technologies Inc.][ms-open-tech]*

The CouchDB Installer for Windows Azure is a tool that
 simplifies the creation, configuration, and deployment of CouchDB
 clusters hosted in Windows Azure virtual machines (for IaaS) or
 Windows Azure worker roles (for PaaS).

## Table of Contents

This document covers how to use the installer for both IaaS and
 PaaS configurations.

*   CouchDB Installer - IaaS configuration 
 
 
    *   Prerequisites
    *   Run the installer
    *   Configure CouchDB
*   CouchDB Installer - PaaS configuration 
 
 
    *   Prerequisites
    *   Run the installer
    *   Demo application

## CouchDB Installer - IaaS configuration

The installer provisions a specified number of CouchDB nodes,
 which work together in a master-master configuration with
 bidirectional replication to assure high availability and
 durability. The IaaS configuration is very simple, with a CouchDB
 node on each virtual machine. For example, here is a configuration
 with two nodes:

![couch-iaas][1]

**Note:** the bidirectional replication between
 CouchDB nodes is handled through the same HTTP endpoint that is
 used by client applications through the load balancer.

## Prerequisites

*   Windows versions: Windows 7 (64-bit) or Windows Server 2008
 R2
*   Accounts: you must have local administrator access to run the
 installer
*   The Microsoft .NET Framework 4 (full version)
*   If you are running Windows Server 2008 R2 and have not
 previously disabled the enhanced security configuration of
 Microsoft Internet Explorer (either manually or through a group
 policy), you will need to do so before you can download your public
 settings file. Click **Start**, then type
 **srvmgr** and click on **SrvMgr.exe**.
 In the Server Manager tool, click **configure IE
 ESC**, and then click **Disable for
 Administrators**.

## Run the installer

To download and run the installer, follow these steps:

* Click on this link: https://github.com/MSOpenTech/Windows-Azure-CouchDB
* Select "Open" and drag the CouchInstaller folder to a location of your choice.
* Open a command prompt (cmd.exe) as an administrator and cd to the CouchInstaller folder.
* Run this command:

	Inst4WA.exe -XmlConfigPath CouchDBInstWR.xml -DomainName -Subscription "bar"

Inst4WA.exe -XmlConfigPath \&lt;yourpath&gt;CouchDBInstWR.xml -DomainName \&lt;youruniquename&gt; -Subscription "bar"

**&lt;yourpath&gt;** is the pathname for the CouchInstaller folder. Note that if you followed the instructions earlier, that will be the current folder and you can use the . alias for **\&lt;yourpath&gt;**

**&lt;YourUniqueName&gt;** is the DNS name for your published CouchDB application. Note that the DNS name must be unique across all Windows Azure deployments (*.cloudapp.net). If the DNS name you enter has already been used, the installer returns an error message.
The DeploymentModelCouchOnIaaS.xml file contains settings that
 are used by the installer. You can override these settings from a
 command prompt. 

While the installer is running, it will open a browser to
 download your publish settings file. Save this file to either your
 downloads folder or the CouchInstaller folder. You must save the
 file in one of those two locations for the installer to see it and
 import the settings.

**Note:** Do not write your publish settings over an
 existing file. The installer will be watching these two locations
 for a *new* file to be created.

When the installer finishes, it will close the command window.
 If you go to the Windows Azure management portal at this time,
 you'll see the two new virtual machines that have been provisioned.
 (This step is not required.)

## Configure CouchDB

Once the installer has completed, you can create the CouchDB
 cluster (replica set). Follow these steps:

*   Click the **Start** button, and then point to **All Programs**.
*   Click **CouchDB Installer for Windows Azure**, right-click **CouchDB Installer for Windows Azure**, and then click **Run as administrator**.
*   Type this command at the Windows PowerShell command prompt:

	.\couchCreateReplicaDB.ps1 databasename true

**&lt;databasename&gt;** is the name that will be assigned to your CouchDB cluster.

**&lt;connection-string-file&gt;** is the full path and filename of the connectionString.json that the tool created in the CouchInstaller folder.

**[true/false]** is an optional parameter of true
 or false, specifying whether the script will continue if it
 encounters HTTP errors. The default value is true.

The script installs a CouchDB database node on each of the
 virtual machines that were created by the installer. It also
 configures endpoints for RDP, CouchDB, and Windows Remote
 Management (WinRM) access. For more information about how to
 connect to these endpoints, see the
 **connectionStrings\&lt;dns-name&gt;.json** file in the
 CouchInstaller folder.

After you complete the installation, you can migrate your
 CouchDB application into the environment.

## CouchDB Installer - PaaS configuration

In the PaaS configuration, a Node.js demo application (a simple
 tasklist) is installed on each of the worker roles. This
 application uses a C# wrapper to communicate with the CouchDB node
 and local cache on the worker role.

![couch-paas][2]

**Note:** If a web application that is not hosted
 in Windows Azure is running (for example, a mobile phone app), it
 can use the CouchDB endpoints directly, as the C# wrapper code does
 in this example.

## Prerequisites

1.  Windows versions: Windows 7 (64-bit) or Windows Server 2008
 R2
2.  Accounts: you must have local administrator access to run the
 installer
3.  The Microsoft .NET Framework 4 (full version)
4.  If you are running Windows Server 2008 R2 and have not
 previously disabled the enhanced security configuration of
 Microsoft Internet Explorer (either manually or through a group
 policy), you will need to do so before you can download your public
 settings file. Click Start, then type srvmgr and click on
 SrvMgr.exe. In the Server Manager tool, click configure IE ESC, and
 then click Disable for Administrators.
5.  An IaaS account with an available Windows Remote Management
 (WinRM) image.

## Run the installer

To download and run the installer, follow these steps:

*   Click on this link to go to the Github repo for the
 installer: [https://github.com/MSOpenTech/Windows-Azure-CouchDB][github-installer]
*   
*   Click on Downloads and then click on the most recent .zip
 package listed.
*   Select "Open" and drag the CouchInstaller folder to a location
 of your choice.
*   Open a command prompt (cmd.exe) as an administrator and cd to
 the CouchInstaller folder.
*   Run this command:
*   Inst4WA.exe -XmlConfigPath
 CouchDBInstWR.xml -DomainName
  -Subscription "bar"

 is the pathname for the CouchInstaller folder.
 Note that if you follow the instructions above, that will be the
 current folder and you can use the . alias for.

 is the DNS name for your published
 CouchDB application. Note that the DNS name must be unique across
 all Windows Azure deployments (*.cloudapp.net). If the DNS name you
 enter has already been used, the installer will return an error
 message.

While the installer is running, it will open a browser to
 download your publish settings file. Save this file to either your
 downloads folder or the CouchInstaller folder. You must save the
 file in one of those two locations for the installer to see it and
 import the settings.

**Note:** Do not write your publish settings over
 an existing file. The installer will be watching these two
 locations for a new file to be created.

After the installer has finished running, it will launch the
 demo application in your browser.

## Demo application

After the installer completes the setup, provisioning, and
 deployment of these nodes, you have a running Node.js demo
 application that saves data to both nodes. The demo application is
 a simple tasklist.

![couch-app][3]

This demo application writes data to both database nodes through
 CouchDB's master-master replication. For more about master-master
 replication, see the [CouchDB
 wiki][4].

You can run Futon, the CouchDB administrative interface. To run
 Futon, go to this URL in your browser:


 http://\&lt;dns-name&gt;.cloudapp.net:5984/_utils

![couch-futon][5]

More information about Futon can be found on the [CouchDB
 Getting Started guide][6].

 [1]: ../Media/couch-iaas_500x295.jpg
 [2]: ../Media/couch-paas_499x395.jpg
 [3]: ../Media/couch-app_500x428.jpg
 [4]: http://wiki.apache.org/couchdb/How_to_replicate_a_database
 [5]: ../Media/couch-futon_500x324.jpg
 [6]: http://guide.couchdb.org/draft/tour.html#futon  
 [github-installer]: https://github.com/MSOpenTech/Windows-Azure-CouchDB