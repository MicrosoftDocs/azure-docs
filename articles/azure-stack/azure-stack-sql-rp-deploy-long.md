#Instructions for deploying SQL Server Resource Provider Adaptor on Azure Stack PoC#


This article shows the detailed instructions for each step, so that you
can start [using SQL databases on Azure Stack](#using-sql-databases-on-azure-stack)

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

- Sign in to the Azure Stack proof-of-concept (PoC) computer as an AzureStack/administrator, and then open Server Manager.

- Turn off **IE Enhanced Security Configuration** for both Admins and Users.

- Sign in to the **ClientVM.AzureStack.local** virtual machine as an administrator, and then open Server Manager.

- Turn off **IE Enhanced Security Configuration** for both Admins and Users.

#####Enable cookies######

- On the Windows Start screen, select **All apps**, select **Windows accessories**, right-click **Internet Explorer**, point to **More**,and then select **Run as an administrator**.

- If prompted, check **Use recommended security**, and then select **OK**.

- In Internet Explorer, select the Tools (gear) icon &gt; **Internet options** &gt;  **Privacy** tab.

- Select **Advanced**, make sure that both **Accept** buttons are selected, select **OK**, and then select **OK** again.

- Close Internet Explorer and restart PowerShell ISE as an administrator.

#### Install an Azure Stack compatible release of Azure PowerShell####

- Uninstall any existing Azure PowerShell from your Client VM

- Sign in to the Azure Stack POC machine as an AzureStack/administrator.

- Using Remote Desktop Connection, sign in to the **ClientVM.AzureStack.local** virtual machine as an administrator.

- Open the Control Panel, click **Uninstall a program** &gt; the **Azure PowerShell** entry &gt; **Uninstall**.

- Download and install the latest Azure PowerShell ++that Support Azure Stack++ from <http://aka.ms/azstackpsh>.

- You can run this verification PowerShell script to make sure that you can connect to your Azure Stack instance (a logon web page should appear).

##Bootstrap the resource provider deployment PowerShell and Prepare for deployment##

- Connect the Azure Stack POC remote desktop to clientVm.AzureStack.Local and sign in as azurestack\\azurestackuser.

- Download the [SQLRP zip](http://download.microsoft.com/download/A/3/6/A36BCD4A-8040-44B7-8378-866FA7D1C4D2/AzureStack.Sql.5.11.69.0.zip) file, and extract its contents to D:\\SQLRP.

- Run the D:\\SQLRP\\Bootstrap.cmd file as an administrator (azurestack\\administrator). This opens the Bootstrap.ps1 file in PowerShell ISE.
When the PowerShell ISE windows completes loading (see screenshot) run the bootstrap script by clicking the “play” button or pressing F5. Two major tabs will load, each containing all the scripts and files necessary to deploy your SQL Resource Provider.

    ![](media/azure-stack-sql-rp-deploy-long/1strun.png) 

- Select the **Prepare Prerequisites** tab

###Create the required certificates### 
Select the **New-SslCert.ps1** tab and run it. In the prompt, type the PFX password that is used to protect the private key. *Make a note of that password* for later use as you will need to supply it as a parameter. This command adds the \_.AzureStack.local.pfx SSL certificate to the D:\\SQLRP\\Prerequisites\\BlobStorage\\Container folder. This certificate secures communication between the resource provider and the local instance of the Azure Resource Manager.

###Upload all artifacts to a storage account on Azure Stack###
Select the **Upload-Microsoft.Sql-RP.ps1** tab and run it.
-  In the Windows PowerShell credential request dialog box, type the Azure Stack service administrator credentials. Th
-  When prompted for Azure Active Directiry Tenant ID, input your Azure Active Directory tenant fully qualified domain name, e.g. microsoftazurestack.onmicrosoft.com.
- A pop up windowd will ask for credentials. Submit your Azure Stack Service Admin credentials.

    ![](media/azure-stack-sql-rp-deploy-long/2.png) 

> If the window doesn’t show a sign in dialog box, you either haven’t enabled JavaScript by turning off IE enhanced security in this machine and user, or you haven’t accepted cookies in IE.

###Publish gallery items for later resource creation###


Select the **Publish-GalleryPackages.ps1** tab and run it. This command adds two marketplace items to the Azure Stack POC portal’s marketplace that will allow you to deploy database resources as marketplace items in your Azure Stack portal's marketplace. Deploy a SQL Server Resource Provider

##Deploy your SQL RP Resource Provider VM##

Now that you have prepared the Azure Stack PoC with the necessary certificates and marketplace items, you can deploy a SQL Server Resource Provider.

- Select the **Deploy SQL provider** tab.

- Click **Microsoft.Sqlprovider.Parameters.JSON**. This parameter file contains the necessary parameters for your Azure Resource Manager template to properly deploy on to Azure Stack.

- Fill out the **empty** parameters in the JSON file. Make sure to include an **adminusername** and **adminpassword** for the SQL Resource Provider computer:

    ![](media/azure-stack-sql-rp-deploy-long/3.png) 
> Make sure you input the password for the **SetupPfxPassword** parameter:

    ![](media/azure-stack-sql-rp-deploy-long/4.png) 

- Click **Save** to save the parameter file.

- Switch to the **Deploy-Microsoft.sql-provider.PS1** tab and run the script:

    - Input your tenant name in Azure Active Directory when prompted.
    - In the poped up window, submit your Azure Stack service admin credentials. 

The full deployment may anytime between 25-55 minutes on some highly utilized Azure Stack POCs. The longest steps will be the Desired State Configuration (DSC) extension and the PowerShell execution which is the final step. Each taking 10-25 minutes.

##Update the local DNS## 

- Select the **Register-Microsoft.SQL-fqdn.ps1** tab, and run the script.
- When prompted for Azure Active Directory Tenant ID, input your Azure Active Directory tenant fully qualified domain name, e.g.        microsoftazurestack.onmicrosoft.com.

##Register the SQL RP Resource Provider##

- Select the **Register-Microsoft.SQL-provider.ps1** tab and execute the script.
When prompted for credentials, use the following:
>(**important:** These are the *_literal_* values that need to be entered when prompted for credentials during this step)

    - sqlRpUsername
    - sqlRpPassw0rd
    
**Do *not* input:** The username\password you saved in the parameter file before deploying the VM.

##Verify the deployment using the Azure Stack Portal##

- Log off from client VM and log on again as **AzureStack\User**

- on the desktop, click **Azure Stack POC Portal** and log in to the portal as the service admin

- verify both the deployment and the registration fully completed:
    - To verify deployment: click **Browse** &gt; **Resource Groups** &gt; and select the resource group you used (default is SQLRP). make sure that the essentials part of the blade (upper half) says **deployment succeeded**:
        ![](media/azure-stack-sql-rp-deploy-long/5.png) 

    - To verify registration: click **Browse** &gt; **Resource providers** &gt; Look for SQL Local:
        ![](media/azure-stack-sql-rp-deploy-long/6.png) 

##Provide capacity to your SQL Resource Provider by connecting it to a hosting SQL server##


- Sign in to the Azure Stack POC portal as a service admin
- click **Resource Providers** &gt; **SQL Local** &gt; **Go To Resource Provider Managment** &gt; **Servers** &gt; **Add**
    > The **SQL Hosting servers** blade is where you can connect the SQL Server Resource Provider to actual instances of SQL Server that serve as the Resource Provider’s backend.
 ![](media/azure-stack-sql-rp-deploy-long/7.png) 

- Fill the form with the connection details of your SQL Server instance. 
> By default, a preconfigured SQL Server called “SQLRP” with the administrator username “sa” and the password you called out in the “adminpassword” parameter in the parameters JSON is running on the VM

##Test your deployment– create your first SQL Database##


- Sign in to the Azure Stack POC portal as service admin.

- Browse to the SQL databases blade and click the “add” button. **Browse** &gt;**SQL Databases** &gt; **add**
  ![](media/azure-stack-sql-rp-deploy-long/8.png)
- Fill in the form with the database details. you wil need to create a new virtual server.
> A virtual server is an artificial construct. It doesn’t map onto the SQL Server itself, instead it manifests through the username inside the connection string that the resource provider generates at the end of this process. 
> **Important:** Note the password you input separately for the virtual server. The portal will never show the password.

![](media/azure-stack-sql-rp-deploy-long/9.png)
     

> You will also be asked to pick a pricing tier for your database. Those tiers are not implemented in this version. However their consumption is tracked by the Azure Resource Manager as a way to showcase the differentiation that can be done in quota enforcement etc.

![](media/azure-stack-sql-rp-deploy-long/10.png)
    
- Submit the form and wait for the deployment to complete.

- In the resulting blade, notice the “Connection string” field. You can use that string in any application that requires SQL Server access (for example, a web app) in your Azure Stack.

![](media/azure-stack-sql-rp-deploy-long/11.png)

**Next steps**

**You can also try out other [PaaS
services](https://azure.microsoft.com/en-us/documentation/articles/azure-stack-tools-paas-services/),
like the My[SQL Server resource
provider](https://azure.microsoft.com/en-us/documentation/articles/azure-stack-sqlrp-deploy/)
and [Web Apps resource
provider](https://azure.microsoft.com/en-us/documentation/articles/azure-stack-webapps-deploy/).**
