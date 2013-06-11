# Solr Installer for Windows Azure

*By Nick Ghinazzi, [Microsoft Open Technologies Inc.][ms-open-tech]*


## Table of Contents

Solr for Windows Azure is only available in a platform as a
 service (PaaS) configuration. When you have completed this
 tutorial, you will have a Solr dashboard ready to import data into
 your replica set.

This document covers how to use the installer.

## Solr installer

The Solr installer places the Solr application on your
 deployment and provides a dashboard where you can import data to
 your replica set and configure your replication environment.

![solr-architecture][1]

## Prerequisites for installer

1. Windows machine: Windows 7 (64 bit) or Windows Server 2008 R2 (64 bit)

2. IIS including the web roles ASP.Net, Tracing, logging & CGI Services needs to be enabled.
    - [http://learn.iis.net/page.aspx/29/installing-iis-7-and-above-on-windows-server-2008-or-windows-server-2008-r2/][9]
  
3. .Net Framework 4.0 Full version
   
4. Download JRE for Windows 64-bit which is owned by Sun Microsystems, Inc., from [http://www.java.com/en/download/manual.jsp][10]  . You are responsible for reading and accepting the license terms.

5. Note if you start with a clean machine:  To download your publishSettings file, the enhanced security configuration of IE needs to be disabled. Go to Server Manager -> configure IE ESC -> disable for Administrators.

6. Powershell 3.0 is required to run this installer. Please follow the instructions described at [http://technet.microsoft.com/en-us/library/hh847837.aspx][11] to install Powershell 3.0.

## Copy the binaries
1. Download and extract on your local computer the latest version from [http://msopentechrelease.blob.core.windows.net/windows-azure-solr/SolrInstWR.zip][12].

2. Please make sure that you unblock all the dll's and config files using instructions at [http://msdn.microsoft.com/en-us/library/ee890038(VS.100).aspx][13]. 

3. Download the publishSettings file for your Azure subscription. You can either run the Get-AzurePublishSettingsFile in a powershell window, or visit this link: [https://windows.azure.com/download/publishprofile.aspx][14]

4. Replace the Azure.publishSettings file in the folder where you unzipped the package with your own publishSettings file. Alternatively, you can simply delete the Azure.publishsettings file in the folder where you unzipped the package and run the installer. This will launch the browser asking you to download the publishsettings file.

5. Launch a command prompt (cmd.exe) as an administrator and cd to the local folder selected above.

## Run the installer:
    Inst4WA.exe -XmlConfigPath "<yourpath>/SolrInstWR.xml" -DomainName "<youruniquename>" -Subscription "<yoursubscriptionname>" -Location "<datacenterlocation>"

 Note that we currently support Solr 3.x as well as 4.x. The names of the SolrInstWR.xml files indicate the Solr version that will be installed using that config file.



**&lt;yourpath&gt;** is the pathname for the SolrInstaller folder. Note that if you followed the instructions earlier, that will be the current folder and you can use the . alias for **&lt;yourpath&gt;**.

**&lt;YourUniqueName&gt;** is the DNS name for your published Solr application. Note that the DNS name must be unique across all Windows Azure deployments (*.cloudapp.net). If the DNS name you enter has already been used, the installer returns an error message.


## Solr application

The Solr application is a dashboard where you can monitor system
 status, import external data to your replica set, and configure
 data replication across your installation.

Start by crawling some content

![solr-crawl][5]

You can also import data from an Windows Azure Blob (select Import and
 then Import Wikipedia Data from Blob)

![solr-blob][6]

Go to the Home tab and observe how the Solr primary and the secondary
 are updating the status with the new index created based on the
 crawled data or the Wikipedia sample data from the Windows Azure
 Blob

![solr-index][7]


 [ms-open-tech]: http://msopentech.com
 [1]: ../Media/solr-architecture_499x305.jpg
 [2]: ../Media/solr-settings_500x340.jpg
 [3]: ../Media/solr-binaries_500x253.jpg
 [4]: ../Media/solr-worker_500x250.jpg
 [5]: ../Media/solr-crawl_500x310.jpg
 [6]: ../Media/solr-blob_500x273.jpg
 [7]: ../Media/solr-index_496x280.jpg
 [8]: ../Media/solr-query_499x290.jpg  
 [9]: http://learn.iis.net/page.aspx/29/installing-iis-7-and-above-on-windows-server-2008-or-windows-server-2008-r2/
 [10]: http://www.java.com/en/download/manual.jsp
 [11]: http://technet.microsoft.com/en-us/library/hh847837.aspx
 [12]: http://msopentechrelease.blob.core.windows.net/windows-azure-solr/SolrInstWR.zip
 [13]: http://msdn.microsoft.com/en-us/library/ee890038(VS.100).aspx
 [14]: https://windows.azure.com/download/publishprofile.aspx
 [github-installer]: http://msopentechrelease.blob.core.windows.net/windows-azure-solr/SolrInstWR.zip
 [http://learn.iis.net/page.aspx/29/installing-iis-7-and-above-on-windows-server-2008-or-windows-server-2008-r2/]:http://learn.iis.net/page.aspx/29/installing-iis-7-and-above-on-windows-server-2008-or-windows-server-2008-r2/
 [http://www.java.com/en/download/manual.jsp]: http://www.java.com/en/download/manual.jsp