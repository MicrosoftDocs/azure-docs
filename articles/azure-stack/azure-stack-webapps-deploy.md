<properties
	pageTitle="Azure Stack App Service Technical Preview 1 deployment | Microsoft Azure"
	description="Detailed guidance for deploying Web Apps in Azure Stack"
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
	ms.date="04/01/2016"
	ms.author="chriscompy"/>

# Add a Web Apps resource provider to Azure Stack

Azure Stack App Service is Azure App Service brought to on-premises installation. In Azure Stack App Service Technical Preview 1 (TP1), only the Web Apps aspect of App Service is available.

The current Azure Stack Web Apps deployment will create an instance of each of the five required role types. It will also create a file server. Although you can add more instances for each of the role types, remember that there is not much space for virtual machines (VMs) in TP1. The current capabilities for Azure Stack App Service are primarily foundational capabilities that are needed to manage the system and host web apps.  

There is no support for the Azure Stack App Service preview releases. Don't put production workloads on this preview release. There is also no upgrade between Azure Stack App Service preview releases. The primary purpose of these preview releases is to show what we are providing and to obtain feedback.  

The Azure Stack Web Apps resource provider uses the same code that the Web Apps feature in Azure App Service uses. As a result, some common concepts are worth describing. In Web Apps, the pricing container for web apps is called the App Service plan. It represents the set of dedicated virtual machines that are used to hold your apps. Within a given subscription, you can have multiple App Service plans. This is also true in Azure Stack Web Apps.  

In Azure, there are shared and dedicated workers. A shared worker supports high-density, multitenant web app hosting, and there is only one set of shared workers. Dedicated servers are only used by one tenant and come in three sizes: small, medium, and large. The needs of on-premises customers can't always be described by using those terms.

In Azure Stack Web Apps, resource provider administrators can define the worker tiers that they want to make available. They can define them so that they have multiple sets of shared workers or different sets of dedicated workers, based on their unique web hosting needs. By using those worker tier definitions, they can then define their own pricing SKUs.

## Web Apps portal TP1 features

Azure Stack Web Apps uses the same UI that Web Apps in Azure App Service uses. Some features are disabled and aren't yet functional in Azure Stack. This is because Azure-specific expectations or services that those features require aren't yet available in Azure Stack.

There are two portals for Azure Stack App Service: the resource provider administration portal and the end-user tenant portal.

### Resource provider administration portal TP1 features

By using this portal, you can:

- Manage roles.
- View system properties.
- Manage credentials and certificates.
- Define worker tiers.
- Create SKUs with their own quotas and features.
- Configure SSL.
- Integrate with DNS.

### End-user portal TP1 features

By using this portal, you can:

- Create an empty web app and a web app with SQL.
- Create WordPress, Django, Orchard, and DNN (DotNetNuke) web apps.
- Create multiple App Service plans, as in Azure.
- View web app properties.

## Before installing Azure Stack Web Apps

There are several steps that you need to perform before you start installing Azure Stack Web Apps. Some of these changes enable the scripts to run properly, and others are system prerequisites.

### Turn off Internet Explorer enhanced security

1. Sign in to the Azure Stack proof-of-concept (POC) machine as an Azure Stack administrator, and then open **Server Manager**.
2. Turn off **IE Enhanced Security Configuration** for both admins and users.
3. Sign in to the `ClientVM.AzureStack.local` virtual machine as an administrator, and then open **Server Manager**.
4. Turn off **IE Enhanced Security Configuration** for both admins and users.

### Enable cookies  

1. Select **Start** > **All apps** > **Windows accessories**. Right-click **Internet Explorer**, and then select **More** and **Run as an administrator**.  
2. If you are prompted, select **Use recommended security**, and then select **OK**.  
3. In Internet Explorer, select **Tools** (the gear icon) > **Internet Options** > **Privacy** tab.  
4. Select **Advanced**. Make sure that both **Accept** check boxes are selected, and then select **OK** and **OK** again.  
5. Close Internet Explorer, and then restart PowerShell ISE as an administrator.  

### Install the latest version of Azure PowerShell

1. Sign in to the Azure Stack POC machine as an Azure Stack administrator.  
2. Using Remote Desktop Connection, sign in to the `ClientVM.AzureStack.local` virtual machine as an administrator.  
3. Open **Control Panel**, and select **Uninstall a program**. Right-click **Microsoft Azure PowerShell - November 2015**, and select **Uninstall**.  
4. [Download](http://aka.ms/webpi-azps) and install the latest version of Azure PowerShell.  

### Consider SQL Server

By default, the Azure Resource Manager template for Azure Stack App Service is set to use the instance of SQL Server that is installed with the Azure Stack SQL Server resource provider. When you install the SQL Server resource provider, keep track of the resource group that was used to install it, as well as the system administrator password. You need both when you install Azure Stack Web Apps.

You also have the option of deploying/leveraging another SQL Server instance. You can choose which SQL Server instance to leverage when you deploy the Web Apps Azure Resource Manager template, by using the template parameters. Whichever option you choose, make sure that the SQL Server VM and the Web Apps resource provider are in the same resource group.

### Create an Azure Stack storage account

The installation of Azure Stack Web Apps uses Azure Storage. [Create a storage account](azure-stack-provision-storage-account.md) in "Default Provider Subscription" as the service admin.

Later, during installation, you will need to get a key to this storage account.

## Install Azure Stack Web Apps

There are five steps for installing Azure Stack Web Apps:

1. Create certificates to be used by Azure Stack Web Apps.
2. Use the installer to download and stage Azure Stack Web Apps.
3. Deploy the Azure Resource Manager template.
4. Create DNS records for the front-end and management server load balancers.
5. Register the newly deployed Web Apps resource provider with Azure Resource Manager.

Before you start installation, download the [Azure Stack App Service preview installer][Azure_Stack_App_Service_preview_installer] and a .zip file with [Azure Stack App Service deployment helper scripts][AppServiceHelperScripts].

After downloading AppServiceHelperScripts.zip, extract the files from it. The .zip file has three scripts:

- Create-AppServiceCerts.ps1
- Create-AppServiceDnsRecords.ps1
- Register-AppServiceResourceProvider.ps1

### Step 1: Create certificates to be used by Azure Stack Web Apps

This first script works with the Azure Stack certificate authority to create three certificates that are needed by Web Apps. Run the script as follows:

```
Create-AppServiceCerts.ps1
```

When you are prompted, provide the password to be used in creating these certificates. This script needs to be run as the domain administrator. During the next step, you need to browse to these files so that they can be used by the installer. The password is used when you start Azure Resource Manager deployment.

### Step 2: Use the installer to download and stage Azure Stack Web Apps

The appservice.exe installer will:

1.	Prompt the user to approve the Microsoft and third-party Software License Terms.
2.	Collect Azure Stack deployment information.
3.	Create a blob container in the Azure Stack storage account that is specified.
4.	Download the files that are needed to install the Azure Stack Web Apps resource provider.
5.	Prepare the installation to deploy the Web Apps resource provider in the Azure Stack environment.
6.	Upload the files to the Azure Stack storage account that is specified.
7.	Present information that is needed to kick off the Azure Resource Manager template.

As an administrator, run appservice.exe. The UI screens for the installer appear as shown.

>[AZURE.NOTE] You must use an elevated account (local or domain administrator) to execute the installer. If you sign in as `azurestack\azurestackuser`, you will be prompted for elevated credentials.

Select **Deploy using Azure Resource Manager**.

![Azure Stack App Service Technical Preview 1 Azure Resource Manager deployment][1]

Approve the Microsoft Pre-Release Software License Terms, and then select **Next**.

![Azure Stack App Service Technical Preview 1 Microsoft Pre-Release Software License Terms][2]

Approve the license terms, and then select **Next**.

![Azure Stack App Service Technical Preview 1 Microsoft Software License Terms][3]

In this step, provide the storage account and storage account access key that you created for this Web Apps deployment. You can copy the storage account name and key from the Azure Stack portal. You can also get the name and key by going to the storage account resource, and then selecting **Settings** and **Access keys**. The Azure Stack DNS suffix will be the domain for Azure Stack. In this case, it's `azurestack.local`.

![Azure Stack App Service Technical Preview 1 storage account and storage account access key][4]

The installer goes through several steps. It shows its progress as it executes tasks.

![Azure Stack App Service Technical Preview 1 installer progress][5]

When the installer has successfully completed all of its steps, select **Deploy to Azure Stack**.

![Azure Stack App Service Technical Preview 1 installer Deploy to Azure Stack prompt][6]

Option 1 requires additional support in the Azure Stack portal, so it cannot be used at this time. For that reason, you need to use Option 2. In the dialog box, select **Option 2: Use PowerShell cmdlet to deploy**, and then select **Copy**.  

![Azure Stack App Service Technical Preview 1 Azure Resource Manager template prompt][7]

Open Notepad and paste the contents of your clipboard immediately. You can't immediately execute the PowerShell command--you need to make some edits before executing it.

>[AZURE.NOTE] If this information is lost, you can get everything you need by accessing the storage account blob container directly.

### Step 3: Deploy the Web Apps Azure Resource Manager template

After you kick off this command with the correct information, it will:

- Create a storage account. This is in addition to the one that you created earlier.
- Create VMs for each Web Apps role type.
- Create a VM to act as the file server.
- Install the Azure Stack Web Apps resource provider software.
- Install the certificates that were obtained in Step 1.
- Create software load balancers to operate in front of the management server and front-end server.

Edit the PowerShell command as follows:

- Name: In the copied text, enter your deployment name.
- ResourceGroupName: Enter your resource group. It has to be the same one that you used with your SQL Server deployment.
- TemplateFile: This value will be automatically populated. It points to the Azure Resource Manager template for Web Apps in your storage account.

Remove the rest of the parameters. You will be prompted for the remaining items. Running the command this way avoids a few issues. When you do run the command, you will be prompted for the following information:

- storageAccountNameParameter: Enter a new storage account name that does not matches the storage account that you created earlier.
- adminUsername: Enter your administrator account name.
- adminPassword: Enter your administrator account password.
- sqlservername: The SQL Server name defaults to the name of the SQL Server resource provider server. If you are using that, there is no need to make a change. If you are using something else, then specify your SQL Server instance here.
- sqlsysadmin: If you are using the SQL Server resource provider, then the default is ‘sa’. If you installed your own SQL Server instance, enter the system administrator account for that server.
- sqlsysadminpwd: Enter the password that goes with your sqlsysadmin account.
- defaultSslPfxFilePassword: Enter the password that matches the password from Step 1.
- resourceProviderSslPfxFilePassword: Enter the password that matches the password from Step 1.
- environmentDnsSuffix: This is automatically populated as ‘webapps.azurestack.local’.
- armEndpointUri:  This is automatically populated as ‘https://api.azurestack.local’.
- resourceProviderUri: This is automatically populated as ‘https://management.azurestack.local’.

When your command is ready and you have all the information that is needed, open a PowerShell window as the Azure Stack administrator. Run the following commands to authenticate and set up template deployment:

```
# Add specific Azure Stack Environment

$AadTenantId = "aad tenant GUID" #GUID Specific to the AAD Tenant
Add-AzureRmEnvironment -Name 'Azure Stack' `
     -ActiveDirectoryEndpoint ("https://login.windows.net/$AadTenantId/") `
     -ActiveDirectoryServiceEndpointResourceId "https://azurestack.local-api/" `
     -ResourceManagerEndpoint ("https://api.azurestack.local/") `
     -GalleryEndpoint ("https://gallery.azurestack.local:30016/") `
     -GraphEndpoint "https://graph.windows.net/"

# Get Azure Stack Environment information
$env = Get-AzureRmEnvironment 'Azure Stack'

# Authenticate to Azure Active Directory with Azure Stack Environment
Add-AzureRmAccount -Environment $env -Verbose

# Get Azure Stack Environment subscription
Get-AzureRmSubscription -SubscriptionName "Default Provider Subscription"  | Select-AzureRmSubscription
```

Now copy, paste, and run the command to deploy your Web Apps resource provider. Your command should look something like this:

```
New-AzureRmResourceGroupDeployment
-Name "webapps" `
-ResourceGroupName "webapps-rg" `
-TemplateFile https://appservicesetup.blob.azurestack.local/appservice-template/AzureStackAppServiceTemplate.json
```

To make sure that the deployment was successful, go to the Azure Stack portal, click **Resource Groups**, and then click the WebSitesSQL resource group. A green check mark next to the resource provider name indicates that it deployed successfully. This will take a couple of hours to complete.

### Step 4: Create DNS records for the front-end and management server load balancers

During the Azure Resource Manager deployment of Web Apps, two software load balancers (SLBs) were created in the network resource provider. They point to the management servers and the front-end servers. The portal and Azure Resource Manager-based requests to the Azure Stack App Service resource provider go to the management servers. Web app requests go to the front-end servers. Those two software load balancers need DNS entries in order to enable the portal and web app requests.  

To create DNS records as described, run the Create-AppServiceDnsRecords.ps1 script that was in the .zip file you downloaded in the beginning. The syntax is:

```
Create-AppServiceDns <AAD tenant ID> <Azure account credential>
```

You will be prompted for the Azure Active Directory tenant ID and credential. An example of those items looks like:

AAD tenant ID = contoso.onmicrosoft.com
Azure account credential = administrator@contoso.onmicrosoft.com

### Step 5: Register the newly deployed Azure Stack Web Apps resource provider with Azure Resource Manager

You can perform this step by going into the portal and doing it manually. But to make things more consistent with the earlier steps, you can use a script that has been provided for this purpose. Run the Register-AppServiceResourceProvider.ps1 script. The syntax is:

```
Register-AppServiceResourceProvider.ps1 <AAD tenant ID> <Azure account credential> <resource provider admin credential>
```

## Test-drive your new Azure Stack Web Apps deployment

**Deploy a new web app**

Now that you have deployed and registered the Web Apps resource provider, you can test it to make sure that tenants can deploy web apps.

1. In the Azure Stack portal, click **New**, click **Web + Mobile**, and then click **Web App**.

2. In the **Web App** blade, type a name in the **Web app** box.

3. Under **Resource Group**, click **New**, and then type a name in the **Resource Group** box.

4. Click **App Service plan/Location**, and then click **Create New**.

5. In the **App Service plan** blade, type a name in the **App Service plan** box.

6. Click **Pricing tier**, click **Free-Shared** or **Shared-Shared**, click **Select**, click **OK**, and then click **Create**.

7. In under a minute, a tile for the new web app will appear on the **Dashboard**. Click on the tile.

8. In the **Web App** blade, click **Browse** to view the default website for this app.

**Deploy a WordPress, DNN, or Django website (optional)**

1. In the Azure Stack portal, click “+”, go to the Azure Marketplace, deploy a Django website, and wait for successful completion. The Django web platform uses a file system-based database and doesn’t require any additional resource providers like SQL or MySQL.  

2. If you also deployed a MySQL resource provider, you can deploy a WordPress website from the Marketplace. When you're prompted for database parameters, input the user name as *User1@Server1* (with the user name and server name of your choice).

3. If you also deployed a SQL Server resource provider, you can deploy a DNN website from the Marketplace. When you're prompted for database parameters, pick a database in the computer running SQL Server that is connected to your resource provider.

## Next steps

You can also try out other [platform as a service (PaaS) services](azure-stack-tools-paas-services.md), like the [SQL Server resource provider](azure-stack-sqlrp-deploy.md) and [MySQL resource provider](azure-stack-mysqlrp-deploy.md).

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
[WebAppsDeployment]: http://go.microsoft.com/fwlink/?LinkId=723982
[AppServiceHelperScripts]: http://go.microsoft.com/fwlink/?LinkId=733525
