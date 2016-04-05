#Using SQL Databases on Azure Stack


Because Azure Stack is still in beta, the SQL Server Resource Provider
adaptor provides the majority of Azure SQL DB functionalities. The SQL
Server Resource Provider adaptor lets you use any SQL Server-based
workload and expose it as a service so that SQL server databases can be
used when you deploy cloud native apps as well as SQL-based websites on
Azure Stack. This article will teach you how to quickly setup your SQL
Server Resource Provider on your Azure Stack proof of concept (PoC).

To deploy a SQL Server resource provider, you will:

1.  Make sure you comply with all the [prerequisites](#_Prerequisites_-_Before) for RP deployment:

    - [.Net3.5](#_Create_an_image) pre-setup in base image
    - [Azure-Stack-Compatible](#_Install_the_latest) PowerShell release
    - IE security settings [configured properly](#turn-off-ie-enhanced-security-and-enable) on ClientVM

2. [Download the SQL Server RP binaries](http://download.microsoft.com/download/A/3/6/A36BCD4A-8040-44B7-8378-866FA7D1C4D2/AzureStack.Sql.5.11.69.0.zip) and extract it on the ClientVM in your Azure Stack PoC.

3. [Run the bootstrap.cmd and script](#_Bootstrap_the_RP) - A set of scripts grouped by tabs will open in PowerShell Integrated Scripting Environment (ISE).

4. Run all the loaded scripts in sequence from left to right in each tab. The scripts will:
    - In the “Prepare” tab:
        - [Create a wildcard certificate](#create-the-required-certificates) to secure communication between the resource provider and Azure Resource Manager.
        - [Upload](#upload-all-artifacts-to-a-storage-account-on-azure-stack) the certificates and all other artifacts to an Azure Stack storage account
        - [Publish](#publish-gallery-items-for-later-resource-creation) gallery packages to allow deployment SQL and resources through gallery
    - In the “Deploy” tab:
        - [Deploy a VM](#deploy-a-sql-server-resource-provider) that will host both your resource provider and SQL Server instance *

        - [Register a local DNS record](#update-the-local-dns) that will map to your resource provider VM
        - [Register you resource provider](#register-the-sql-rp-resource-provider) with the local Azure Resource Manager

>\*This script has a separate parameter file with passwords etc. which
must be complete before running.

>\*\*All scripts assume the base operating system image has .Net 3.5
preinstalled, that the clientVM has JavaScript and cookies enabled, and
that you are using the latest Azure PowerShell.

5\. [Connect your resource provider to a SQL Server](#connec5-long-doc)
    instance in the admin Azure Stack portal:

**Browse** &gt; **Resource** **Providers** &gt; **SQLRP** &gt; **Go to Resource Provider** **Management** &gt; **Servers** &gt; **Add**

Use “sa” for username and the password you used when deploying the resource provider VM.

6\. [Test your new SQL Server RP](#test-your-deployment-create-your-first-sql-database) by deploying a SQL database from the Azure Stack portal:
**Create &gt; Custom &gt; SQL Server Database**

This should get your SQL Server Resource Provider up and running in
about 45 minutes (depending on your hardware). If you wish to know more
about each step, go to the [detailed SQL Server RP deployment
instructions](#_Instructions_for_deploying)

<span id="before-you-deploy" class="anchor"><span
id="_Prerequisites_-_Before" class="anchor"><span
id="_Instructions_for_deploying" class="anchor"></span></span></span>
