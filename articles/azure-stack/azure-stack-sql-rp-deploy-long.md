#Instructions for deploying SQL Server Resource Provider Adaptor on Azure Stack PoC#


this is a dummy file

This article shows the detailed instructions for each step, so that you
can start [using SQL databases on Azure Stack](#using-sql-databases-on-azure-stack)

[TOC]
##Prerequisites - Before you deploy##

Before you deploy SQL resource providers, you'll need to create a
default Windows Server image with .NET 3.5, turn off Internet Explorer
(IE) Enhanced Security, and install the latest version of Azure
PowerShell.

####Create an image of Windows Server including .NET 3.5####

You will need to create a Windows Server 2012 R2 Datacenter VHD with .Net 3.5 image and set is as the default image in the Platform Image repository. For more information, see [Create an image of WindowsServer2012R2 including .NET
3.5](https://azure.microsoft.com/en-us/documentation/articles/azure-stack-add-image-pir/#create-an-image-of-windowsserver2012r2-including-net-35).
>This step is not needed if you downloaded the Azure Stack bits after 2/23/2016, as the default base Windows Server 2012 R2 image now includes .NET 3.5 framework in this download.

####Turn off IE Enhanced Security and enable cookies####

To deploy a resource provider, your PowerShell Integrated Scripting Environment (ISE) must be run as an administrator. For this reason, you will need to allow cookies and JavaScript in your Internet Explorer profile used for logging into Azure Active Directory (e.g. for both administrator and user seperatley)

##### Turn off IE Enhanced Security#####

1.  Sign in to the Azure Stack proof-of-concept (PoC) computer as an AzureStack/administrator, and then open Server Manager.

2.  Turn off **IE Enhanced Security Configuration** for both Admins and Users.

3.  Sign in to the **ClientVM.AzureStack.local** virtual machine as an administrator, and then open Server Manager.

4.  Turn off **IE Enhanced Security Configuration** for both Admins and Users.

#####Enable cookies######

1.  On the Windows Start screen, select **All apps**, select **Windows accessories**, right-click **Internet Explorer**, point to **More**,and then select **Run as an administrator**.

2.  If prompted, check **Use recommended security**, and then select **OK**.

3.  In Internet Explorer, select the Tools (gear) icon &gt; **Internet options** &gt;  **Privacy** tab.

4.  Select **Advanced**, make sure that both **Accept** buttons are selected, select **OK**, and then select **OK** again.

5.  Close Internet Explorer and restart PowerShell ISE as an administrator.

#### Install an Azure Stack compatible release of Azure PowerShell####

1.  Uninstall any existing Azure PowerShell from your Client VM

2.  Sign in to the Azure Stack POC machine as an AzureStack/administrator.

2.  Using Remote Desktop Connection, sign in to the **ClientVM.AzureStack.local** virtual machine as an administrator.

3.  Open the Control Panel, click **Uninstall a program** &gt; the **Azure PowerShell** entry &gt; **Uninstall**.

4.  Download and install the latest Azure PowerShell ++that Support Azure Stack++ from <http://aka.ms/azstackpsh>.

5.  You can run this verification PowerShell script to make sure that you can connect to your Azure Stack instance (a logon web page should appear).

##Bootstrap the resource provider deployment PowerShell and Prepare for deployment##

1. Connect the Azure Stack POC remote desktop to clientVm.AzureStack.Local and sign in as azurestack\\azurestackuser.

2.  Download the [SQLRP zip](http://download.microsoft.com/download/A/3/6/A36BCD4A-8040-44B7-8378-866FA7D1C4D2/AzureStack.Sql.5.11.69.0.zip) file, and extract its contents to D:\\SQLRP.

3.  Run the D:\\SQLRP\\Bootstrap.cmd file as an administrator (azurestack\\administrator). This opens the Bootstrap.ps1 file in PowerShell ISE.
When the PowerShell ISE windows completes loading (see screenshot) run the bootstrap script by clicking the “play” button or pressing F5. Two major tabs will load, each containing all the scripts and files necessary to deploy your SQL Resource Provider.

![](media/1strun.png)

1.  Select the **Prepare Prerequisites** tab**.**

Create the required certificates
--------------------------------

1.  Select the **New-SslCert.ps1** tab and run it. In the prompt, type
    the PFX password that is used to protect the private key.\
    *Make a note of that password* for later use as you will need to
    supply it as a parameter.\
    This command adds the \_.AzureStack.local.pfx SSL certificate to the
    D:\\SQLRP\\Prerequisites\\BlobStorage\\Container folder. This
    certificate secures communication between the resource provider and
    the local instance of the Azure Resource Manager.

Upload all artifacts to a storage account on Azure Stack
--------------------------------------------------------

1.  Select the **Upload-Microsoft.Sql-RP.ps1** tab and run it. In the
    Windows PowerShell credential request dialog box, type the Azure
    Stack service administrator credentials. This command uploads the
    binaries for the SQL Server Resource Provider, which includes the
    SSL certificate you just created.\
    When prompted for Azure Active Directiry Tenant ID, input your Azure
    Active Directory tenant fully qualified domain name, for example,
    microsoftazurestack.onmicrosoft.com.\
    A window will ask for credentials. Submit your Azure Stack Service
    Admin credentials

> ![](media/image5.jpg){width="3.381981627296588in"
> height="2.113739063867017in"}
>
> If the window doesn’t show a sign in dialog box, you either haven’t
> enabled JavaScript by turning off IE enhanced security in this machine
> and user, or you haven’t accepted cookies in IE.

Publish gallery items for later resource creation
-------------------------------------------------

1.  Select the **Publish-GalleryPackages.ps1** tab and run it.\
    This command adds two marketplace items to the Azure Stack POC
    portal’s marketplace that will allow you to deploy database
    resources as marketplace items in your Azure Stack
    portal's marketplace.

Deploy a SQL Server Resource Provider
-------------------------------------

Now that you have prepared the Azure Stack PoC with the necessary
certificates and marketplace items, you can deploy a SQL Server Resource
Provider.

1.  Select the **Deploy SQL provider** tab.

2.  Click **Microsoft.Sqlprovider.Parameters.JSON**. This parameter file
    contains the necessary parameters for your Azure Resource Manager
    template to properly deploy on to Azure Stack.

3.  Fill out the ***empty*** parameters in the JSON file.\
    Make sure to include an **adminusername** and **adminpassword** for
    the SQL Resource Provider computer:

> ![](media/image6.jpg){width="3.381981627296588in"
> height="2.113739063867017in"}
>
> Make sure you input the password for the **SetupPfxPassword**
> parameter:
>
> ![](media/image7.jpg){width="3.381981627296588in"
> height="2.113739063867017in"}

1.  Select **Save** to save the parameter file.

2.  Switch to the **Deploy** tab and run the script<span
    id="update-dns-and-register-the-mysql-resour"
    class="anchor"></span>\
    Input your tenant name in Azure Active Directory when prompted. In
    the window that opens, input your Azure Stack service admin
    credentials.\
    The full deployment could take 25-55 minutes on some highly utilized
    Azure Stacks. The longest steps will be the Desired State
    Configuration (DSC) extension application and the PowerShell
    execution which is the final step. Each taking 10-25 minutes.

Update the local DNS 
---------------------

1.  Select the **Register-Microsoft.SQL-fqdn.ps1** tab, and run it.\
    When prompted for Azure Active Directory Tenant ID, input your Azure
    Active Directory tenant fully qualified domain name, for
    example, microsoftazurestack.onmicrosoft.com.

Register the SQL RP Resource Provider
-------------------------------------

1.  Select the **Register-Microsoft.SQL-provider.ps1** tab and run the
    script.\
    **important:** When prompted for credentials, type \**exactly*\*
    sqlRpUsername and sqlRpPassw0rd.\
    **Do Not input:** The username password set you used at the creation
    of the VM.

2.  **Refresh the portal.**

3.  To see your resource provider in the portal:

    a.  Browse &gt; Resource Groups &gt; select the resource group you
        used (default is SQLRP), and make sure that the essentials part
        of the blade (upper half) says **deployment succeeded**.

    b.  Browse &gt; Resource providers &gt; Look for SQL Local.

<span id="validate-the-deployment" class="anchor"><span id="_Provide_capacity_to" class="anchor"></span></span>Provide capacity to your SQL Resource Provider by connecting it to a hosting SQL server
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1.  Sign in to your portal as a service admin

2.  Go to Servers blade under SQL Resource Provider **resource provider
    management**.

> ![](media/image8.jpg){width="3.381981627296588in"
> height="1.9014370078740157in"}

If you see an effort message after you select Resource Provider
Management, we recommend that you sign out and sign back in to the
portal.

1.  Select **Servers**:

> ![](media/image9.jpg){width="3.381981627296588in"
> height="1.9014370078740157in"}

1.  **Select** the “**Add** a hosting server” button**\
    > **![](media/image10.jpg){width="3.381981627296588in"
    > height="1.9014370078740157in"}**\
    > **The **SQL Hosting servers** blade is where you can connect the
    > SQL Server Resource Provider to actual instances of SQL Server to
    > serve as the Resource Provider’s backend.

2.  Fill the form with the connection details of your SQL
    > Server instance. We have preconfigured a SQL Server called “SQLRP”
    > with the administrator username “sa” and password called out by
    > you in the “adminpassword” parameter in the parameters JSON.

Test your deployment– create your first SQL Database
----------------------------------------------------

1.  Sign in to your portal as service admin.

2.  Browse to the SQL databases blade and click the “add” button.**\
    **Browse &gt; type “SQL” &gt; SQL Databases &gt; add new.

3.  Fill in the form with the database details that you will need to
    create a new virtual server.

> ![](media/image11.jpg){width="3.381981627296588in"
> height="1.9014370078740157in"}**\
> **A virtual server is an artificial construct. It doesn’t map onto the
> SQL Server itself, instead it just manifests through the username of
> the SQL Server connection string the resource provider generates.\
> You will also be asked to pick a pricing tier for your database. Those
> tiers are not implemented in this version. However, consumption of
> them is tracked by the Azure Resource Manager as a way to showcase the
> differentiation that you can be do in quota enforcement etc.
>
> **Important:** Note the password you input separately. The portal will
> never show the password.

1.  Submit the form and wait for the deployment to complete (less than 2
    minutes usually).

2.  **I**n the resulting blade, notice the “Connection string” field.**\
    **You can use that string in any application that requires SQL
    Server access (for example, a web app) in your Azure Stack.

> ![](media/image12.jpg){width="3.381981627296588in"
> height="1.9014370078740157in"}

**Next steps**

**You can also try out other [PaaS
services](https://azure.microsoft.com/en-us/documentation/articles/azure-stack-tools-paas-services/),
like the My[SQL Server resource
provider](https://azure.microsoft.com/en-us/documentation/articles/azure-stack-sqlrp-deploy/)
and [Web Apps resource
provider](https://azure.microsoft.com/en-us/documentation/articles/azure-stack-webapps-deploy/).**
