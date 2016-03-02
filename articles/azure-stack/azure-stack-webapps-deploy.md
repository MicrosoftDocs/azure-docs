<properties 
	pageTitle="Azure Stack App Service Technical Preview 1 Deployment | Microsoft Azure" 
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
	ms.date="03/01/2016" 
	ms.author="chriscompy"/>	

# Add a Web Apps resource provider to Azure Stack


Azure Stack App Service is the Azure App Service brought to on premise installation.  In this first preview release only the Web Apps aspect of the Azure App Service is being made available.   The current Azure Stack Web App deployment will create an instance of each of the 5 required role types, and a file server.  While you can add more instances for each of the role types please remember that there is not a lot of space for VMs in Technical Preview 1.  The current capabilities for Azure Stack App Service are primarily foundation capabilities that are needed to manage the system and to host web apps.  

There is no support for the App Service preview releases.  Do not put production workloads on this preview release.  There is also no upgrade between Azure Stack App Service preview releases.  The primary purpose being served by these preview releases is to show what we are providing and to obtain feedback.  

The Azure Stack Web Apps resource provider utilizes the same code as used in Azure Web Apps and as a result there are some common concepts that are worth describing.  In Azure Web Apps the pricing container for your web apps is called the App Service Plan.  It represents the set of dedicated virtual machines used to hold your apps.  Within a given subscription you can have multiple App Service Plans.  The same is true in Azure Stack Web Apps as well.  

In Azure there is a Shared worker that supports high density multi-tenant web app hosting and 3 reserved sizes of dedicated workers, Small, Medium, and Large.  The needs of on premise customers though cannot be always so described so in Azure Stack Web Apps the resource provider administrator can define the worker tiers they wish to make available and then define their own pricing SKUs that use those worker tiers.   

## Portal features

As with the back-end the UI used in Azure Stack is the same that is used in Azure.  There are a number of things that are disabled as they are not yet functional in Azure Stack due to Azure specific expectations or services that are not yet available in Azure Stack that those features require.
There are two portals for the Azure Stack App Service, the Resource Provider administration portal and the End user tenant portal.

### Resource provider administration

- Manage roles
- View system properties
- Manage credentials and certs
- Define worker tiers 
- Create SKUs with their own quotas and features
- Configure SSL
- Integrate with DNS

### End user

- Create empty web app and web app with SQL
- Create Wordpress, Django, Orchard and DNN web apps
- Create multiple App Service Plans like in Azure
- View web app properties

## Turn off IE Enhanced Security and enable cookies

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


## Install the latest version of Azure PowerShell

1. Sign in to the Azure Stack POC machine as an AzureStack/administrator.
2. Using Remote Desktop Connection, sign in to the **ClientVM.AzureStack.local** virtual machine as an administrator.
3. Open the Control Panel, click **Uninstall a program**, right-click **Microsoft Azure PowerShell - November 2015**, and then click **Uninstall**.
4. Download and install the latest Azure PowerShell from [http://aka.ms/webpi-azps](http://aka.ms/webpi-azps).


## Installation prerequisites

To install Azure Stack Web apps there are a few items that you will need.  Those items are:

- A completed deployment of Azure Stack Technical Preview 1.
- Enough space in your Azure Stack system to deploy a small deployment of Azure Stack Web Apps.  The space required is roughly 20 Gb of Ram.
- A SQL Server database.
- The DNS name for your Azure Stack deployment.
- A storage account [created](azure-stack-provision-storage-account.md) in the "Default Provider Subscription" as the Service Admin.
- The key to the storage account.

### Steps to install SQL server

1 Log in to the POC host:

- Go to the following path and ensure 
\\\\sofs\Share\CRP\GuestArtifactRepository and ensure Microsoft.Powershell.DSC.2.11.0.0.zip exists in the path (or a higher version) 
-  Go to the \\\\sofs\Share\CRP\PlatformImages folder. You should see the WindowsServer2012R2DatacenterEval.VHD image file. But you need to create an image that includes .NET 3.5 and save it here. For instructions on how to create that image, see [create a .NET 3.5 compatible base server image in your Azure Stack Platform Image Repository](azure-stack-add-image-pir.md#create-an-image-of-windowsserver2012r2-including-net-35). Then use the new image filename when you define the manifest file's **Filename** parameter.
-  This new image should either be set as the default image on the Azure Stack Technical Preview installation (SKU value is 2012-R2-Datacenter), or the **SqlServiceDSCTemplate.json** template should be edited to point to the new SKU you just created.
-  You may not need to create this new image, if you have already done so for another resource provider, like the SQL Server Resource Provider
 
2 Login to the ClientVM: 

- Download and expand the [WebAppsDeployment.zip](http://go.microsoft.com/fwlink/?LinkId=723982) to the client machine. 
- Run the **Deploy-SqlServerDSC.ps1** script to provision a new VM and install SQL server.

**NOTE** Make sure to remember the resource group used in the script to provision the SQL virtual machine. When prompted to create a user account on the VM, the username admin will be auto-populated and you will be asked to submit a password. Make sure to record this password for as you’ll need it again when you deploy the Web App Azure Resource Manager template (for example *SQLServerPassword*). This will be the password for the Web Apps service to access its runtime SQL database located on this SQL server.

**NOTE** Make a note of the resource group used in the script to provision the SQL VM, as it should be the same resource group used during the WebApps deployment in the next step. The script default for the Resource Group is: WebsitesSQL. 

Once the deployment completes, navigate to the Resource Group in the Azure Stack portal, select the Sq0-NIC resource, and take note of the Private IP address (it will be something like: 10.0.2.4). This IP address will be used later in this deployment process.
Record the IP address for the SQL Server.  To do this Browse > Resource Groups > select resource group used for installing SQL server > Resources > Sq0-NIC  This address will be needed when running the Azure Resource Manager template.

## Azure Web Apps installation steps

The installation experience for Azure Stack Web Apps starts with the download of the appservice.exe installer from [Azure Stack App Service preview installer][Azure_Stack_App_Service_preview_installer]. 

This installer will:

1.	Prompt the user to approve of the third party licenses.
2.	Collect Azure Stack deployment information.
3.	Create a blob container in the Azure Stack storage account specified.
4.	Download the files needed to install the Azure Stack Web App resource provider.
5.	Prepare the install to deploy the Web App resource provider in the Azure Stack environment.
6.	Upload the files to the Azure Stack storage account specified.
7.	Present information needed to kick off the Azure Resource Manager template.

As administrator run the installer that you just downloaded.  The last item will seem to offer the ability to directly bring up the UI for the Azure Resource Manager template but that capability is not yet operational.  The UI screens for the installer appear as shown:
 
**NOTE** The installer must be executed with an elevated account (local or domain Administrator). If logged in as azurestack\azuerstackuser, you will be prompted for elevated credentials.

![][1]

Click ***Install***.

![][2]

Check approval of the EULA and then click ***Next***.

![][3]

Check approval for the licenses and then click ***Next***.

![][4]

In this step, provide the storage account and storage account access key created for this WebApp deployment. The storage account name and key can be copied from the Azure Stack portal, from the storage account resource > Settings > Access keys. The Azure Stack DNS suffix will be the domain for the Azure Stack, in this case: **azurestack.local**.   

Once you have entered your information then click ***Next***.

![][5]

The installer goes through a number of steps and shows progress while doing so. 

![][6] 

When all steps are successfully completed then click ***Deploy to Azure Stack***.  
 
![][7] 
 
Click "No". By clicking "No", the following text is copied to your clipboard:

    Azure Stack App Service ARM Template
    Template location:  http://mytp1webapp.blob.azurestack.local/appservice-template/AzureStackAppServiceTemplate.json
    Invoke from Portal: https://portal.azurestack.local/#create/Microsoft.Template/uri/http%3A%2F%2Fmytp1webapp.blob.core.windows.net%2Fappservice-template%2FAzureStackAppServiceTemplate.json 

This is the information needed to get and kick off the WebApps Azure Resource Manager template.

Open Notepad and paste the contents of your clipboard immediately.  

**NOTE** If this information is lost for some reason, you can still get everything you need by accessing the storage account blob container directly. 

## Web App Azure Resource Manager deployment

The Azure Stack Web App Azure Resource Manager template will collect information defining the web app resource provider deployment.  There are a few things that need to be noted:

- The storage account name entered will create a new account.
- The environment DNS suffix is the subdomain that is used for web apps created in this environment (example: webapps.azurestack.local).
- The SQL server name is the private IP address gathered after the SQL Server template deployment (found on Sq0-NIC resource blade, as noted above).
- The SA password is the local SQL admin password used during the deployment of the SQL Server template.
- The “number of workers” item will only create Shared workers.
- There may not be a lot of resources left for additional VMs in the single-host TP1 POC environment so it is usually best to just go with 1 instance of each role type.
- The resource group used for deploying web apps must be the same as the one used to deploy the SQL server (as noted above, the default Resource Group for the SQL Server template deployment is: WebsitesSQL).
- Replace the *SQLServerPassword* with password you used when you ran the **Deploy-SQLServerDSC.ps1** script.

After everything is filled in and the ***Create*** button is clicked, the VMs will be created for your Azure Stack Web App resource provider and the software will be installed.

This AzureStackAppServiceTemplate.json template can also be deployed via PowerShell, an example deployment is as follows:

```
New-AzureRmResourceGroupDeployment -Name "WebAppsDeploy01" -ResourceGroupName "WebsitesSQL" -TemplateFile C:\templates\AzureStackAppServiceTemplate.json `  
-storageAccountNameParameter "webappsstorage" -adminUsername "admin" -adminPassword "myPassword1!" -environmentDnsSuffix webapps.azurestack.local `  
-sqlservername 10.0.2.4 -sqlsysadmin sa -sqlsysadminpwd "SQLServerPassword"   
```

In the **Microsoft Azure Stack App Service TP1** dialog box, click **Exit**.

To make sure the deployment was successful, in the Azure Stack portal, click **Resource Groups** and then click the **WebSitesSQL** resource group. A green check mark next to the resource provider name indicates that it deployed successfully.


## Pre-registration Azure Stack Web Apps configuration steps

Before registering the newly deployed web app resource provider, you'll need to get the load balancer IP addresses, add DNS records, and set up wildcard certificates.

**Get load balancer IP addresses**

DNS entries need to be made for the Front End and Management Server VIPs.  To do this you need to first obtain the IP addresses for each of those load balancers.

1. Open the Azure Stack portal and sign in as an administrator.

2. Click **Browse**, click **Resource Groups**, click **WebSitesSQL**, click **...** at the bottom of the **Resources** box, and then click **FrontEndServersLoadBalancer**.

3. In the **FrontEndServersLoadBalancer** blade, make note of the **IP address**.
![][11]

4. In the **Resources** blade, click **ManagementServersLoadBalancer**, and then make note of the **IP address** in the **ManagementServersLoadBalancer** blade.

![][10]
  
**Add DNS records**

 Now that you have the IP addresses, you can add the DNS records.
 
1. Minimize the client virtual machine.

2. Open Hyper-V Manager, double-click the **ADVM** virtual machine, and sign in as an administrator.
 
3. Open DNS Manager, expand the **ADVM** node, expand **Forward Lookup Zones**, right-click **AzureStack.Local**, and then click **New Host (A or AAAA)**.

![][13]

4. In the **Name** box, type *management*. This management server DNS name will be used when registering the Web Apps resource provider later.  This is the endpoint that Azure Stack communicates with.
 
5. In the **IP address** box, type the IP address for the **ManagementLoadBalancer** that you noted above. You'll also need this IP address when importing the wildcard certificate.

![][9]

6. Click **Add host**.

7. In the **Name** box, type \*.webapps. This DNS name should match the name you used when populating the Azure Resource Manager template for the Web App resource provider. In this case we had webapps.azurestack.local so the DNS name should be \*.webapps.

8. In the **IP address** box, type the IP address for the **FrontEndServersLoadBalancer** that you noted above.

9. Click **Add host**, click **OK**, and then click **Done**. This creates a **webapps** folder under **AzureStack.local** in DNS Manager.

10. Sign out of the ADVM virtual machine.

**Set up the wildcard certificates**

**NOTE** You may not need to go through this step if you have already created a wildcard certificate for another resource provider, like the SQL Server Resource Provider.

To configure your Azure Stack Web Apps deployment with wildcard certificates you need to first get the wildcard certificate to configure the system with.  To do this: 

1. On the Azure Stack POC machine, open Remote Desktop Connection, and sign in to the **portalvm** as the domain administrator.

2. Open Internet Information Services (IIS) Manager, click **PORTALVM**, double-click **Server Certificates**, and then, in the **Actions** pane on the right, click **Create Domain Certificate**.

3. In the **Create Certificate** dialog box, type the values as follows:
- For **Common name**, type *\*.azurestack.local*.
- For **Organization**, type the name of your organization.       
- For **Organizational unit**, type *AzureStack*.
- Type appropriate values for the remaining fields.

4. Click **Next**.

5. Click **Select**, click **AzureStackCertificiationAuthority**, and then click **OK**.

6. Type a **Friendly name**, like *_azurestack.local*, and then click **Finish**. The new certificate now appears in the **Server Certificates** pane in alphabetical order by the friendly name.



**Export wildcard certificate**

**NOTE** You may not need to go through this step if you have already created a wildcard certificate for another resource provider, like the SQL Server Resource Provider.

1. Open Microsoft Management Console (MMC), click **File**, and then click **Add/Remove Snap-in**.

2. In the **Add or Remove Snapins** dialog box, click **Certificates**, and then click **Add**.

3. Choose **Computer account**, click **Next**, choose **Local computer**, click **Finish**, and then click **OK**.

4. In the **Console Root** pane, expand **Certificates (Local Computer)**, expand **Personal**, and then click **Certificates**.

5. Right-click the certificate you created earlier (**\*.azurestack.local**), click **All Tasks**, and then click **Export**.

6. In the **Certificate Export Wizard**, click **Next**.

7. Choose **Yes, export the private key** and then click **Next**.

8. Choose **Personal Information Exchange - PKCS #12 (.PFX)**, choose **Include all certificates in the certification path if possible**, choose **Export all extended properties**, leave the other boxes unchecked, and then click **Next**.

9. Check **Password**, type and confirm a password (take note of the password for later use), and then click **Next**. 

10. Under **File to Export**, click **Browse**, and then click **Desktop**.

11. In the **File name** box, type *_.azurestack.local*, click **Save**, click **Next**, click **Finish**, and then click **OK**.

The new certificate is now saved to the desktop on the **portalvm** virtual machine.


**Import certificates to management virtual machine**

1. On the **portalvm** virtual machine desktop, copy **_.azurestack.local.pfx**.

2. On the Azure Stack POC machine, open Remote Desktop Connection and sign in to the **management** virtual machine as an administrator.

3. Paste the **_.azurestack.local.pfx** file onto the **management** virtual machine desktop.

4. Double-click the **_.azurestack.local.pfx** file.

5. In the **Certificate Import Wizard**, choose **Local Machine**, and then click **Next**.

6. Confirm the **File name** is **C:\Users\admin\Desktop\_.azurestack.local.pfx** and then click **Next**.

7. In the **Password** box, type the password you created during the export certificate process above.

8. Check the **Mark this key as exportable.** and **Include all extended properties.** boxes, and then click **Next**.

9. Choose **Automatically select the certificate store based on the type of certificate**, click **Next**, click **Finish**, and then click **OK**.

10. Open Microsoft Management Console (MMC), click **File**, and then click **Add/Remove Snap-in**.

11. In the **Add or Remove Snapins** dialog box, click **Certificates**, and then click **Add**.

12. Choose **Computer account**, click **Next**, choose **Local computer**, click **Finish**, and then click **OK**.

13. In the **Console Root** pane, expand **Certificates (Local Computer)**, expand **Personal**, and then click **Certificates**.

14. Double-click **\*.azurestack.local** and click **Certification Path**.

15. To verify that the new certificate has been imported successfully, confirm that the **AzureStackCertificatinAuthority** icon is connected to the **\*.azurestack.local** icon.

16. Click **OK** and minimize the **management** and **portalvm** RDC windows.


**Locate the private IP address**

1. Open the ClientVM.AzureStack.local virtual machine.

2. Open the portal, click **Browse**, click **Resource Groups**, click **WebsitesSQL**, click **...** at the bottom of the **Resources** box, and then click **CN0-NIC** in the **Resources** blade.

3. In the **CN0-NIC** blade, copy the **Private IP address**. This is the IP address for the Web Apps controller virtual machine.

![][14]

4. In the **management** virtual machine desktop, open Remote Desktop Connection, paste the controller virtual machine's IP address into the **Computer** box, click **Connect**, and sign in as an admin. This is the controller virtual machine.

5. Copy the **_.azurestack.local.pfx** certificate from the **management** virtual machine desktop to the controller virtual machine C:\ drive.

6. On the controller virtual machine, open PowerShell and run the following cmdlets in order. Replace **YOURPASSWORD** with your password. Replace **DNSNAME** with the DNS entry for the management virtual machine, like *management.azurestack.local*.

```
    Import-Module Websites
    $password="YOURPASSWORD"
    Set-WebSitesConfig -Type Global -ManagementServerCertificateFileName "C:\_.azurestack.local.pfx" -ManagementServerCertificatePassword $password
    Set-WebSitesConfig -Type Global -ArmEndpoint "https://api.azurestack.local" 
    Set-WebsitesConfig -Type Global -ArmResourceProviderUri 'https://DNSNAME/' 
```    

7. Run the following cmdlets in order:
```
    Get-WebSitesServer -ServerType ManagementServer | Repair-WebSitesServer
    Get-WebSitesServer -ServerType LoadBalancer | Repair-WebSitesServer
    Get-WebSitesServer -ServerType WebWorker | Repair-WebSitesServer
```

8. Sign out of the controller, **management**, and **portalvm** virtual machines and close the RDC windows.
 
## Create a new Web Apps resource provider

1. On the **ClientVM.AzureStack.local** virtual machine, sign in to the Azure Stack portal as an admin, click **Browse**, and then click **Resource Providers**.

2. In the **Resource Providers** blade and click **Add**.

3. In the **Register resource provider** blade, type a **Display Name**, like *WebApps*.

4. In the **Manifest endpoint** box, type the location of the manifest file, like *https://management.azurestack.local/*.

5. Type the admin credentials for **Username** and **Password**.

6. Click **Location**, click **Create new location**, and then choose **Local**.

7. In the **Enter a resource group name** box, type a resource group name, like *WebAppsRG*.

8. Click **Create**. In about five minutes, close and reopen the browser, and then sign in to the Azure Stack portal as an admin.

9. On the **Dashboard**, click the **webapps** tile to explore the new resource provider settings. 

**NOTE** The password requested during registration is the one specified during the ARM deployment.

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
[8]: ./media/azure-stack-webapps-deploy/appsvcinstall-8.png
[9]: ./media/azure-stack-webapps-deploy/appsvcinstall-9.png
[10]: ./media/azure-stack-webapps-deploy/appsvcinstall-10.png
[11]: ./media/azure-stack-webapps-deploy/appsvcinstall-11.png
[12]: ./media/azure-stack-webapps-deploy/appsvcinstall-12.png
[13]: ./media/azure-stack-webapps-deploy/appsvcinstall-13.png
[14]: ./media/azure-stack-webapps-deploy/appsvcinstall-14.png


<!--Links-->
[Azure_Stack_App_Service_preview_installer]: http://go.microsoft.com/fwlink/?LinkID=717531
[WebAppsDeployment]:  http://go.microsoft.com/fwlink/?LinkId=723982
