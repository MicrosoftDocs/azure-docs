<properties
	pageTitle="Prepare the physical machine"
	description="Prepare the physical machine"
	services="azure-stack"
	documentationCenter=""
	authors="Dumagar"
	manager="bradleyb"
	editor=""/>

<tags
	ms.service="multiple"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/08/2016"
	ms.author="dumagar"/>

# Add a MySQL resource provider to Azure Stack

MySQL databases support common website platforms as is a common technology used on the websites scene. You can deploy the MySQL Resource Provider to work with servers and databases through Azure Resource Manager deployment templates, as well as deploy WordPress websites from the Azure Web Apps add on for Azure Stack.

## Prepare the Azure Stack POC machine

Before deploying MySQL resource providers, turn off IE Enhanced Security, install the latest version of Azure PowerShell, and prepare the Azure Stack POC environment with the necessary certifications, marketplace items, and binaries.

### Turn off IE Enhanced Security and enable cookies

To deploy a resource provider, your PowerShell ISE must be run as an administrator. For this reason, you'll need to allow cookies and java script in your Internet Explorer profile used for logging into Azure Active Directory.

**Turn off IE Enhanced Security**

1. Sign in to the Azure Stack POC machine as an AzureStack/administrator, and then open Server Manager.

2. Turn off **IE Enhanced Security Configuration** for both Admins and Users.

3. Sign in to the **ClientVM.AzureStack.local** virtual machine as an administrator, and then open Server Manager.

4. Turn off **IE Enhanced Security Configuration** for both Admins and Users.

**Enable cookies**

1. Click the Start button, click **All apps**, click **Windows accessories**, right-click **Internet Explorer**, click **More**, and then click **Run as an administrator**.

2. If prompted, check **Use recommended security**, and then click **OK**.

3. In Internet Explorer, click the Tools (gear) icon, click **Internet Options**, and then click the **Privacy** tab.

4. Click **Advanced**, make sure that both **Accept** buttons are selected, click **OK**, and then click **OK** again. 

5. Close Internet Explorer and restart PowerShell ISE as an administrator.

### Install the latest version of Azure PowerShell

1. Sign in to the Azure Stack POC machine as an AzureStack/administrator.

2. Using Remote Desktop Connection, sign in to the **ClientVM.AzureStack.local** virtual machine as an administrator.

3. Open the Control Panel, click **Uninstall a program**, click the **Azure PowerShell** entry, and then click **Uninstall**.

4. Download and install the latest [Azure PowerShell SDK](http://aka.ms/azStackPsh).

### Enable certificates, marketplace items, and binaries

1.	On the Azure Stack POC machine, download the [AzureStackMySQLforWebApps.zip](http://aka.ms/MASMySQLRP) file and extract the contents to D:\MySql.

2.	Run the **D:\Mysql\Bootstrap.cmd** file as an administrator (use the portal service admin account). This opens the Bootstrap.ps1 file in PowerShell ISE.

3.	Click the **Prepare MySql Prerequisites** tab.

4.	Click the **New-SslCert.ps1** tab and run it. In the prompt, type the PFX password that is used to protect the private key. This command adds the \_.AzureStack.local.pfx SSL certificate to the D:\MySql\Prerequisites\BlobStorage\Container folder. This certificate secures communication between the resource provider and the local instance of the Azure Resource Manager.

5.	Click the **Download-MySqlServer.ps1** tab and run it. When prompted, accept the EULA by clicking **Yes** in the **Confirm** dialog box. This command adds two zip files to the D:\MySql\Prerequisites\BlobStorage\Container folder.

6.	Click the **Upload-Microsoft.MySql-RP.ps1** tab and run it. In the **Windows PowerShell credential request** dialog box, type the Azure Stack service administrator credentials. This command uploads the binaries for the MySQL resource provider. When prompted for AadTenantID, input your AAD tenant FQDN, e.g. microsoftazurestack.onmicrosoft.com. When Prompted for service admin credentials, input your Azure Stack Service Admin user's username and password.

7.	Click the **Publish-GalleryPackages.ps1** tab and run it. In the **Windows PowerShell credential request** dialog box, type the Azure Stack service administrator credentials. This command adds two marketplace items to the Azure Stack POC portal.

8.	Verify that these files are in the D:\MySql\Prerequisites\BlobStorage\Container folder:
  - AzureStack.MySql.Setup.1.0.1.0.nupkg
  - mysql-5.5.44-winx64.zip
  - mysql-5.6.26-winx64.zip
  - \_.AzureStack.local.pfx

## Deploy a MySQL resource provider

Now that you have prepared the Azure Stack POC with the necessary certificates and marketplace items, you can deploy a MySQL resource provider.

1.	Log in to the Azure Stack portal as a service administrator.

2.	Click **New**, click **Marketplace**, click **Resource Providers**, and then click **MySQL Resource Provider**.
3.	In the **MySql Resource Provider** blade, click **Create**.
4.	In the **Parameters** blade, accept the default values for the parameters and type usernames and passwords for the other parameters.
5.	Click **OK**.
6.	Under **Resource group**, click **Or create new**, and in the text box type *MySQL01*.
7.	Click **Create**. Deployment of the resource provider will take 20-30 minutes.
8.	To find your resource provider, click **Browse**, click **Resource Providers**, and look for **mysql1** in the list.

## Update DNS and register the MySQL resource provider

1. In PowerShell ISE, click the **Deploy MySql provider** tab, click the **Register-Microsoft.MySql-fqdn.ps1** tab, and run it. When prompted the AAD Tenant ID, input your AAD tenant FQDN, e.g. microsoftazurestack.onmicrosoft.com.

2. Click the **Register-Microsoft.MySql-provider.ps1** tab and run the script. When prompted for credentials, type **basicauthusername** and **basicauthpassword** values that you created earlier.

3. Refresh the portal.

4. To review the status of your resource provider deployment in the portal, click **Browse**, click **Resource Groups**, choose the resource group with the name **Microsoft.MySQL-RP1** (the name of the resource group generated by the deployment scripts). The **Last deployment** status should be **Succeeded**.

5. To see your resource provider in the portal, click **Browse**, click **Resource Providers**, choose the resource provider with the name **MYSQL-LOCAL** (the name of the resource provider generated by the deployment scripts).

## Validate the deployment

1. In Azure Stack management portal, click “+”, click **Data**, deploy a MySQL server\database pair, and wait for successful completion.

2. (Optional) If you also deployed Azure Stack App Service Web Apps, you can deploy a WordPress website from the marketplace. When prompted for database parameters input the username as *User1@Server1* (with the username and server name of your choice).


## Next steps

You can also try out other [PaaS services](azure-stack-tools-paas-services.md), like the [SQL Server resource provider](azure-stack-sqlrp-deploy.md) and [Web Apps resource provider](azure-stack-webapps-deploy.md).

