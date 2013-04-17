
<properties linkid="develop-other-tutorials-solr-installer-for-windows-azure" urlDisplayName="Solr Installer for Windows Azure" pageTitle="Solr Installer for Windows Azure" metaKeywords="Solr, Windows Azure" metaDescription="Solr Installer for Windows Azure" metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu.md" />

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

## Prerequisites

*   Windows version: Windows 7 (64-bit) or Windows Server 2008
 R2.
*   Microsoft Internet Information Services (IIS), including the
 Web Server (IIS) roles ASP.NET, Tracing, Logging, and CGI.
*   
 http://learn.iis.net/page.aspx/29/installing-iis-7-and-above-on-windows-server-2008-or-windows-server-2008-r2/
*   The Microsoft .NET Framework 4 (full version).
*   JRE for Windows 64-bit, which is owned by Sun Microsystems,
 Inc. You can download it from
 http://www.java.com/en/download/manual.jsp. You are responsible for
 reading and accepting the license terms.
*   If you are running Windows Server 2008 R2 and have not
 previously disabled the enhanced security configuration of
 Microsoft Internet Explorer (either manually or through a group
 policy), you will need to do so before you can download your public
 settings file. Click Start, type srvmgr, and then click on
 SrvMgr.exe. In the Server Manager tool, click configure IE ESC, and
 then click Disable for Administrators.

## Run the installer

To download and run the installer, follow these steps:

1.  Click on this link to go to the GitHub repo for the
 installer: [https://github.com/MSOpenTech/Windows-Azure-Solr][github-installer]
2.  
3.  Click Downloads, and then click on the most recent .zip package
 listed. For example, SolrInstWR.zip, not the .msi files.
4.  Click Open and drag the SolrInstaller folder to a location of
 your choice and extract the files.
5.  Open a command prompt (cmd.exe) as an administrator and cd to
 the SolrInstaller folder.
6.  Run this command.

    Inst4WA.exe -XmlConfigPath \<yourpath>CouchDBInstWR.xml -DomainName \<youruniquename> -Subscription "bar"

**\<yourpath>** is the pathname for the SolrInstaller folder. Note that if you followed the instructions earlier, that will be the current folder and you can use the . alias for **\<yourpath>**.

**\<YourUniqueName>** is the DNS name for your published Solr application. Note that the DNS name must be unique across all Windows Azure deployments (*.cloudapp.net). If the DNS name you enter has already been used, the installer returns an error message.

While the installer is running, it opens a browser to download
 your publish settings file. Save this file to either your Downloads
 folder or the SolrInstaller folder. You must save the file in one
 of those two locations for the installer to see it and import the
 settings.

![solr-settings][2]

**Note:** Do not write your publish settings over an existing file.
 The installer monitors these two locations for a new file.

The installer downloads the Solr binaries.

![solr-binaries][3]

The installer also adds a master worker role.

![solr-worker][4]

After the installer finishes running, open the Solr application
 in your browser by navigating to
 http://.cloudapp.net.

## Solr application

The Solr application is a dashboard where you can monitor system
 status, import external data to your replica set, and configure
 data replication across your installation.

Start by crawling some content

![solr-crawl][5]

You can also import data from an Azure Blob (select Import and
 then Import Wikipedia Data from Blob)

![solr-blob][6]

Go to the Home tab and observe how the SolrMaster and the Slaves
 are updating the status with the new index created based on the
 crawled data or the Wikipedia sample data from the Windows Azure
 Blob

![solr-index][7]

Select search and type a query based on the content crawled. If
 the Wikipedia sample was used you may type "Alabama"

![solr-query][8]

 [1]: ../Media/solr-architecture_499x305.jpg
 [2]: ../Media/solr-settings_500x340.jpg
 [3]: ../Media/solr-binaries_500x253.jpg
 [4]: ../Media/solr-worker_500x250.jpg
 [5]: ../Media/solr-crawl_500x310.jpg
 [6]: ../Media/solr-blob_500x273.jpg
 [7]: ../Media/solr-index_496x280.jpg
 [8]: ../Media/solr-query_499x290.jpg  
 [github-installer]: https://github.com/MSOpenTech/Windows-Azure-Solr