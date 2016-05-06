<properties
	pageTitle="Azure Stack App Service Technical Preview 1 deployment | Microsoft Azure"
	description="Detailed guidance for deploying Azure Web Apps in Azure Stack"
	services="azure-stack"
	documentationCenter=""
	authors="ccompy"
	manager="stefsch"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="app-service"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/08/2016"
	ms.author="chriscompy"/>

# Add a Web Apps resource provider to Azure Stack

Azure Stack App Service is the Azure App Service brought to on-premises installation. In this first preview release, only the Web Apps aspect of the App Service is available. The current Azure Stack Web Apps deployment will create an instance of each of the five required role types. It will also create a file server. Although you can add more instances for each of the role types, remember that there is not much space for VMs in Technical Preview 1. The current capabilities for Azure Stack App Service are primarily foundation capabilities that are needed to manage the system and host web apps.  

There is no support for the Azure Stack App Service preview releases. Don't put production workloads on this preview release. There is also no upgrade between Azure Stack App Service preview releases. The primary purposes of these preview releases are to show what we are providing and to obtain feedback.  

The Azure Stack Web Apps resource provider uses the same code that the Azure Web Apps feature in the Azure App Service uses. As a result, some common concepts are worth describing. In Web Apps, the pricing container for web apps is called the App Service plan. It represents the set of dedicated virtual machines used to hold your apps. Within a given subscription, you can have multiple App Service plans. This is also true in Azure Stack Web Apps.  

In Azure, there are shared and dedicated workers. A shared worker supports high-density multitenant web app hosting and there is only one set of shared workers. Dedicated servers are only used by one tenant and come in three sizes: small, medium, and large. The needs of on-premises customers can't always be described by using those terms. In Azure Stack Web Apps, resource provider administrators can define the worker tiers they want to make available such that they have multiple sets of shared workers or different sets of dedicated workers based on their unique web hosting needs. Using those worker tier definitions they can then define their own pricing SKUs.

## Portal features

As is also true with the back end, Azure Stack Web Apps uses the same UI that Azure Web Apps uses. Some features are disabled and aren't yet functional in Azure Stack. This is because Azure-specific expectations or services that those features require aren't yet available in Azure Stack. 

There are two portals for the Azure Stack App Service, the resource provider administration portal and the end user tenant portal.

### Resource provider administration TP1 features

- Manage roles
- View system properties
- Manage credentials and certs
- Define worker tiers 
- Create SKUs with their own quotas and features
- Configure SSL
- Integrate with DNS

### End user TP1 features

- Create empty web app and web app with SQL
- Create Wordpress, Django, Orchard and DNN web apps
- Create multiple App Service Plans like in Azure
- View web app properties

## Turn off IE Enhanced Security and enable cookies

To deploy a resource provider, you must run your PowerShell ISE as an administrator. For this reason, you need to allow cookies and JavaScript in the Internet Explorer profile you use to sign in to Azure Active Directory.

### Turn off Internet Explorer enhanced security

1. Sign in to the Azure Stack proof-of-concept (POC) machine as **AzureStack/administrator**, and then open **Server Manager**.
2. Turn off **IE Enhanced Security Configuration** for both admins and users.
3. Sign in to the `ClientVM.AzureStack.local` virtual machine as an administrator, and then open **Server Manager**.
4. Turn off **IE Enhanced Security Configuration** for both admins and users.

### Enable cookies  

1. Select **Start**, then **All apps**, and then **Windows accessories**. Right-click on **Internet Explorer**, and then select **More** and **Run as an administrator**.  
2. If you are prompted, select **Use recommended security**, and then **OK**.  
3. In Internet Explorer, select **Tools** (the gear icon), and then **Internet Options** and the **Privacy** tab.  
4. Select **Advanced**. Make sure that both **Accept** check boxes are selected, and then select **OK** and **OK** again.  
5. Close Internet Explorer and restart PowerShell ISE as an administrator.  

## Install the latest version of Azure PowerShell

1. Sign in to the Azure Stack POC machine as **AzureStack/administrator**.  
2. Use the remote desktop connection to sign in to the `ClientVM.AzureStack.local` virtual machine as an administrator.  
3. Open **Control Panel** and select **Uninstall a program**. Right-click on **Microsoft Azure PowerShell - November 2015** and select **Uninstall**.  
4. Download and install the latest [Azure PowerShell SDK](http://aka.ms/azStackPsh).  

## Installation prerequisites

To install Azure Stack Web apps there are a few items that you will need.  Those items are:

- A completed deployment of Azure Stack Technical Preview 1.
- Enough space in your Azure Stack system to deploy a small deployment of Azure Stack Web Apps.  The space required is roughly 20 Gb of Ram.
- A SQL Server database.
- The DNS name for your Azure Stack deployment.
- A storage account [created](azure-stack-provision-storage-account.md) in the "Default Provider Subscription" as the Service Admin.
- The key to the storage account.

### SQL server

By default the Azure Stack App Service ARM template has defaults set to use the SQL Server that is installed along with the Azure Stack SQL RP.  When you install the SQL RP keep track of the resource group that was used to install it as well as the SA password.  Both are needed when installing Azure Stack Web Apps.

## Azure Web Apps installation steps

Azure Stack Web App installation has 5 steps:

1. Create certificates to be used by Azure Stack Web Apps
2. Use the installer to download and stage Azure Stack Web Apps
3. Kick off the ARM template deployment
4. Create DNS records for the Front End and Management Server load balancers
5. Register the newly deployed Web Apps resource provider with ARM

The installation experience for Azure Stack Web Apps starts with the download of the [Azure Stack App Service preview installer][Azure_Stack_App_Service_preview_installer] and a zip file with [Azure Stack App Service deployment helper scripts][AppServiceHelperScripts].

After downloading the AppServiceHelperScripts.zip, extract the files from it.  The zip file has three scripts:

- Create-AppServiceCerts.ps1
- Create-AppServiceDnsRecords.ps1
- Register-AppServiceResourceProvider.ps1 

### Step 1 - Create certificates to be used by Azure Stack Web Apps

This first script works with the Azure Stack certificate authority to create 3 certificates that are needed by Web Apps.  Run the script as follows:

Create-AppServiceCerts.ps1 <pfxPassword>

During the next step you need to browse to these files so they can be consumed by the installer. The password is used when starting ARM deployment.

### Step 2 - Use the installer to download and stage Azure Stack Web Apps

The appservice.exe installer will:

1.	Prompt the user to approve of the Microsoft and third party EULAs.
2.	Collect Azure Stack deployment information.
3.	Create a blob container in the Azure Stack storage account specified.
4.	Download the files needed to install the Azure Stack Web App resource provider.
5.	Prepare the install to deploy the Web App resource provider in the Azure Stack environment.
6.	Upload the files to the Azure Stack storage account specified.
7.	Present information needed to kick off the Azure Resource Manager template.

As administrator run appservice.exe.  The UI screens for the installer appear as shown:
 
>[AZURE.NOTE] You must use  an elevated account (local or domain administrator) to execute the installer. If you sign in as `azurestack\azurestackuser`, you will be prompted for elevated credentials. 

Select **Install** in the upper-left corner.

![Azure Stack App Service Technical Preview 1 Azure Resource Manager deployment][1]

Approve the Microsoft Software Pre-Release License Terms, and then select **Next**.

![Azure Stack App Service Technical Preview 1 Microsoft Software Pre-Release License Terms][2]

Approve the license terms, and then select **Next**.

![Azure Stack App Service Technical Preview 1 Microsoft Software License Terms][3]

In this step, provide the storage account and storage account access key you created for this Web Apps deployment. You can copy the storage account name and key from the Azure Stack portal. You can also get the name and key by going to the storage account resource, and then selecting **Settings** and **Access keys**. The Azure Stack DNS suffix will be the domain for the Azure Stack. In this case, it's `azurestack.local`.

![Azure Stack App Service Technical Preview 1 storage account and storage account access key][4]

The installer goes through several steps. It shows its progress as it executes tasks.

![Azure Stack App Service Technical Preview 1 installer progress][5]

When the installer has successfully completed all of its steps, select **Deploy to Azure Stack**.

![Azure Stack App Service Technical Preview 1 installer Deploy to Azure Stack prompt][6] 

Option 1 requires additional support in the Azure Stack Portal and so cannot be used at this time.  For that reason you need to use Option 2.  In the dialog box, select **Option 2 Use Power Shell cmdlet to deploy** and then select **Copy**.  

![Azure Stack App Service Technical Preview 1 Azure Resource Manager template prompt][7] 
 
Open Notepad and paste the contents of your clipboard immediately.  The Power Shell command cannot be immediately executed but rather needs some edits prior to execution.

>[AZURE.NOTE] If this information is lost, you can get everything you need by accessing the storage account blob container directly. 

## Step 3 - Web Apps ARM template deployment

Once this command is kicked off with the correct information it will:

- create a storage account
- create VMs for each Web App role type
- create VM to act as the file server
- install the Azure Stack Web App resource provider software
- install the certificates that were obtained in Step 1
- create SLBs to operate in front of the Management Server and Front End servers.

Edit the Power Shell command and populate the following items:

- The storage account name
- The environment DNS suffix, which is the subdomain that is used for web apps created in this environment (example: webapps.azurestack.local).
- The SA password that was set when installing the SQL RP
- The number of workers, which only creates Shared workers.
- The number of instances per role type.  There may not be a lot of resources left for additional VMs in the single-host TP1 POC environment so it is usually best to just go with 1 instance of each role type.
- The resource group used for deploying web apps which must be the same as the one used to deploy the SQL server 
- The default SSL pfx file password
- The resource provider SSL pfx file password

The two SSL pfx file passwords are both the same as the password that was entered when running the script in Step 1.  There are two entries here as the ARM template is forward looking to where there are more options available and different passwords can be used between the certificates.

Here is an example deployment command

```
New-AzureRmResourceGroupDeployment
-Name <name>
-ResourceGroupName <resource-group>
-TemplateFile <ArmTemplatePath>
-storageAccountNameParameter <storage-account>
-adminUsername <admin-username>
-adminPassword <admin-password>
-sqlservername <sql-server>
-sqlsysadmin 'sa'
-sqlsysadminpwd <sa-password>
-defaultSslPfxFilePassword <webapps-ssl-cert>
-resourceProviderSslPfxFilePassword <management-ssl-cert>
-environmentDnsSuffix 'webapps.azurestack.local'
-armEndpointUri 'https://api.azurestack.local'
-resourceProviderUri 'https://management.azurestack.local'   
```

When your command is ready, run it and authenticate as the Azure Stack service administrator.

To make sure the deployment was successful, in the Azure Stack portal, click **Resource Groups** and then click the **WebSitesSQL** resource group. A green check mark next to the resource provider name indicates that it deployed successfully.

### Step 4 - Create DNS records for the Management Server and Front End load balancers

During ARM deployment of Web Apps, two Software Load Balancers (SLBs), were created in the network resource provider.  They point to the Management Servers and the Front End servers.  The portal and ARM based requests to the Azure Stack App Service resource provider go to the Management Server.  Web app requests to to the Front End servers.  Those two SLBs need DNS entries in order to enable the portal and web app requests.  

To create DNS records as described, run the Create-AppServiceDnsRecords.ps1 script that was in the zip file you download in the beginning.  The syntax is:

```
Create-AppServiceDns <AAD tenant ID> <Azure account credential>
```

You will be prompted for the AAD tenant id and credential.  An example of those items looks like:

AAD tenant ID = contoso.onmicrosoft.com
Azure account credential = administrator@contoso.onmicrosoft.com

### Step 5 - Register the newly deployed Azure Stack Web Apps provider with ARM

This step could be performed by going into the portal and doing it manually but to make things more consistent with the earlier steps a script has been provided for this purpose.  Run the Register-AppServiceResourceProvider.ps1 script.  The syntax is:

```
Register-AppServiceResourceProvider.ps1 <AAD tenant ID> <Azure account credential> <resource provider admin credential>
```

## Test drive your new Azure Stack Web Apps deployment

**Deploy a new Web App**

Now that you have deployed and registered the Web Apps resource provider, you can test it to make sure that tenants can deploy web apps.

1. In the Azure Stack portal, click **New**, click **Web + Mobile**, and click **Web App**.

2. In the **Web App** blade, type a name in the **Web app** box.

3. Under **Resource Group**, click **New**, and then type a name in the **Resource Group** box. 

4. Click **App Service plan/Location** and click **Create New**.

5. In the **App Service plan** blade, type a name in the **App Service plan** box.

6. Click **Pricing tier**, click **Free-Shared** or **Shared-Shared**, click **Select**, click **OK**, and then click **Create**.

7. In under a minute, a tile for the new web app will appear on the **Dashboard**. Click on the tile.

8. In the web app blade, click **Browse** to view the default website for this app.

**Deploy a WordPress, DNN, or Django website (optional)**

1. In Azure Stack management portal, click “+”, go to marketplace, deploy a Django website, and wait for successful completion. The Django web platform uses a file system based database and doesn’t require any additional RPs like SQL or MySQL.  

2. If you also deployed MySQL RP, you can deploy a WordPress website from the marketplace. When prompted for database parameters input the username as *User1@Server1* (with the username and server name of your choice).

3. If you also deployed SQLServer RP, you can deploy a DNN (.Net Nuke) website from the marketplace. When prompted for database parameters pick a database in the SQL Server connected to your Resource Provider.

## Next Steps

You can also try out other [PaaS services](azure-stack-tools-paas-services.md), like the [SQL Server resource provider](azure-stack-sqlrp-deploy.md) and [MySQL resource provider](azure-stack-mysqlrp-deploy.md).

<!--Image references-->
[1]: ./media/azure-stack-webapps-deploy/appsvcinstall-1.png
[2]: ./media/azure-stack-webapps-deploy/appsvcinstall-2.png
[3]: ./media/azure-stack-webapps-deploy/appsvcinstall-3.png
[4]: ./media/azure-stack-webapps-deploy/appsvcinstall-4.png
[5]: ./media/azure-stack-webapps-deploy/appsvcinstall-5.png
[6]: ./media/azure-stack-webapps-deploy/appsvcinstall-6.png
[7]: ./media/azure-stack-webapps-deploy/appsvcinstall-7.png

<!--Links-->
[Azure_Stack_App_Service_preview_installer]: http://go.microsoft.com/fwlink/?LinkID=717531
[WebAppsDeployment]:  http://go.microsoft.com/fwlink/?LinkId=723982
[AppServiceHelperScripts]: http://go.microsoft.com/fwlink/?LinkId=733525
