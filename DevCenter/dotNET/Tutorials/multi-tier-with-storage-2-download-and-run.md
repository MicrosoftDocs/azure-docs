<properties linkid="develop-net-tutorials-multi-tier-web-site-2-download-and-run" urlDisplayName="Step 2: Download and Run" pageTitle="Multi-tier web site tutorial - Step 2: Download and run" metaKeywords="Windows Azure tutorial, deploying email service app, publishing email service" metaDescription="The second tutorial in a series that teaches how to configure your computer for Windows Azure development and deploy the Email Service app." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu.md" />

# Configuring and Deploying the Windows Azure Email Service application

This is the second tutorial in a series of five that show how to build and deploy the Windows Azure Email Service sample application.  For information about the application and the tutorial series, see the [first tutorial in the series][firsttutorial].

This tutorial shows how to configure your computer for Azure development and how to deploy the Windows Azure Email Service application to a Windows Azure Cloud Service by using  any of the following products:

* Visual Studio 2012
* Visual Studio 2012 Express for Web
* Visual Studio 2010
* Visual Web Developer Express 2010.

You can open a Windows Azure account for free, and if you don't already have Visual Studio 2012, the SDK automatically installs Visual Studio 2012 for Web Express. So you can start developing for Windows Azure entirely for free.

In this tutorial you'll learn:

* How to set up your computer for Windows Azure development by installing the Windows Azure SDK.
* How to configure and test the Windows Azure Email Service application on your local machine.
* How to publish the application to Windows Azure.
* How to view and edit Windows Azure tables, queues, and blobs by using Visual Studio or Azure Storage Explorer.
* How to configure tracing and view trace data.
* How to scale the application by increasing the number of worker role instances.

<div chunk="../../Shared/Chunks/create-account-and-websites-note.md" />
 
### Tutorial segments

- [Set up the development environment][]
- [Set up a free Windows Azure account][]
- [Create a Windows Azure Storage account][]
- [Install Azure Storage Explorer][]
- [Create a Cloud Service][]
- [Download and run the completed solution][]
- [View developer storage in Visual Studio][]
- [Configure the application for Windows Azure Storage][]
- [Deploy the application to Windows Azure][]
- [Promote the application from staging to production][]
- [Get a SendGrid account][]
- [Configure and view trace data][]
- [Add another worker role instance to handle increased load][]





<h2><a name="setupdevenv"></a><span class="short-header">Set up environment</span>Set up the development environment</h2>

To start, set up your development environment by installing the Windows Azure SDK for the .NET Framework. 

1. To install the Windows Azure SDK for .NET, click the link that corresponds to the version of Visual Studio you are using. If you don't have Visual Studio installed yet, use the Visual Studio 2012 link.<br/>
[Windows Azure SDK for Visual Studio 2010][]<br/>
[Windows Azure SDK for Visual Studio 2012][]<br/>
If you don't have Visual Studio installed yet, it will be installed by the link.

   **Warning:** Depending on how many of the SDK dependencies you already have on your machine, installing the SDK could take a long time, from several minutes to a half hour or more.

2. When you are prompted to run or save vwdorvs11azurepack.exe, click **Run**.

3. In the Web Platform Installer window, click **Install** and proceed with the installation.

   ![Web Platform Installer - Windows Azure SDK for .NET][WebPIAzureSDKNETVS12Oct2012]<br/>

When the installation is complete, you have everything necessary to start developing.





<h2><a name="setupwindowsazure"></a><span class="short-header">Create Windows Azure account</span>Set up a free Windows Azure account</h2>

The next step is to create a Windows Azure account.

1. Browse to [Windows Azure](http://www.windowsazure.com "Windows Azure").

2. Click  the **Free trial** link and follow the instructions. 




<h2><a name="createWASA"></a><span class="short-header">Create Storage account</span>Create a Windows Azure Storage account</h2>

When you run the sample application in Visual Studio, you can access tables, queues, and blobs in Windows Azure development storage or in a Windows Azure Storage account in the cloud. Development storage uses a SQL Server Express LocalDB database to emulate the way Windows Azure Storage works in the cloud.  In this tutorial you'll start by using development storage, and then you'll learn how to configure the application to use a cloud storage account when it runs in Visual Studio. In this section of the tutorial you create the Windows Azure Storage account that you'll configure Visual Studio to use later in the tutorial.    

1. In your browser, open the [Windows Azure Management Portal][NewPortal].

2. In the [Windows Azure Management Portal][NewPortal], click **Storage**, then click **New**.

   ![New Storage][mtas-portal-new-storage]

3. Click **Quick Create**.
   
   ![Quick Create][mtas-storage-quick]

4. In the URL input box, enter a URL prefix. 

   This prefix plus the text you see under the box will be the unique URL to your storage account. If the prefix you enter has already been used by someone else, you'll see "The storage name is already in use" above the text box and you'll have to choose a different prefix.

5. Set the region to the area where you want to deploy the application.

6. Uncheck the **Enable Geo-Replication** check box. 

   When geo-replication is enabled for a storage account, the stored content is replicated to a secondary location to enable failover to that location in case of a major disaster in the primary location. Geo-replication can incur additional costs. You'll see a warning when you disable geo-replication because you pay a data transfer charge if you start with it disabled and then decide to enable it later. You don’t want to disable replication, upload a huge amount of data, and then enable replication. For test and development accounts, you generally don't want to pay for geo-replication. For more information, see [How To Manage Storage Accounts][managestorage].

5. Click **Create Storage Account**. 

   In the image below, a storage account is created with the URL `aestest.core.windows.net`.

   ![create storage with URL prefix][mtas-create-storage-url-test]

   This step can take several minutes to complete. While you are waiting, you can repeat these steps and create a production storage account. It's often convenient to have a test storage account to use for local development, another test storage account for testing in Windows Azure, and a production storage account.

5. Click the test account you created in the previous step, then click the **Manage Keys** icon.

   ![Manage Keys][mtas-manage-keys]<br/>

   ![Keys GUID][mtas-guid-keys]<br/>

   You'll need the **Primary Access Key** or **Secondary Access Key** access key throughout this tutorial. You can use either one of these keys in a storage connection string. There are two keys so that you can periodically change the key that you use without causing an interruption in service to a live application. You regenerate the key that you're not using, then you can change the connection string in your application to use the regenerated key. If there were only one key, the application would lose connectivity to the storage account when you regenerated the key. The keys that are shown in the image are no longer valid because they were regenerated after the image was captured.

6. Copy one of these keys into your clipboard for use in the next section.





<h2><a name="installASE"></a><span class="short-header">Install ASE</span>Install Azure Storage Explorer</h2>

**Azure Storage Explorer** is a tool that you can use to query and update Windows Azure storage tables, queues, and blobs. You will use it throughout these tutorials to verify that data is updated correctly and to create test data.

1. Install  [Azure Storage Explorer](http://azurestorageexplorer.codeplex.com/ ).

2. Launch **Azure Storage Explorer** and click **Add Account**.

   ![Add ASE Account][mtas-ase-add]

3. Enter the name of the test storage account and paste the key that you copied previously.

4. Click **Add Storage Account**.

   ![Add ASE Account][mtas-ase-add2]




<h2><a name="createcloudsvc"></a><span class="short-header">Create Cloud Service</span>Create a Cloud Service</h2>

1. In your browser, open the [Windows Azure Management Portal][NewPortal].

2. Click **Cloud Services** then click the **New** icon.

   ![Quick Cloud][mtas-new-cloud]<br/>

   Alternatively, you can click the **Create a Cloud Service** link, which also selects Quick Create.

3. Click **Quick Create**.

4. In the URL input box, enter a URL prefix. 

   Like the storage URL, this URL has to be unique, and you will get an error message if the prefix you choose is already in use by someone else.

5. Set the region to the area where you want to deploy the application.

   You should create the cloud service in the same region that you created the storage account. When the cloud service and storage accound are in different datacenters (different regions), latency will increase and you will be charged for bandwidth outside the data center. Bandwidth within a data center is free.

6. Click **Create Cloud Service**. 

   In the following image, a cloud service is created with the URL aescloud.cloudapp.net.

   ![create storage with URL prefix][mtas-create-cloud]

   You can move on to the next step without waiting for this step to complete.





<h2><a name="downloadcnfg"></a><span class="short-header">Download and run</span>Download and run the completed solution</h2>

1. Download and unzip the [completed solution](http://code.msdn.microsoft.com/Windows-Azure-Multi-Tier-eadceb36).

2. Start Visual Studio with elevated permissions.

   The compute emulator that enables Visual Studio to run a Windows Azure project locally requires elevated permissions.

3. From the **File** menu choose **Open Project**, navigate to where you downloaded the solution, and then open the solution file.

3. In **Solution Explorer**, make sure that **AzureEmailService** is selected as the startup project.

1. Press CTRL+F5 to run the application.

   The application home page appears in your browser.

   ![Run the App.][mtas-mailinglist1]

2. Click  the **Create New** link and enter some test data, then click the **Create** link.

   ![Run the App.][mtas-create1]

3. Create a couple more mailing list entries.

   ![Mailing List Index Page][mtas-mailing-list-index-page]

4. Click  the *Subscribers* link and add some subscribers.

   ![Subscriber Index Page][mtas-subscribers-index-page]

4. Click the *Messages* link and add some messages. Don't change the scheduled date which defaults to one week in the future. The application can't send messages until you configure SendGrid.

   ![Message Create Page][mtas-message-create-page]
	<br/><br/>
   ![Message Index Page][mtas-message-index-page]

The data that you have been entering and viewing is being stored in Windows Azure development storage. Development storage uses a SQL Server Express LocalDB database to emulate the way Windows Azure Storage works in the cloud.  The application is using development storage because that is what the project was configured to use when you downloaded it. This setting is stored in *.cscfg* files in the **AzureEmailService** project.  The *ServiceConfiguration.Local.cscfg* file determines what is used when you run the application locally in Visual Studio, and the *ServiceConfiguration.Cloud.cscfg* file determines what is used when you deploy the application to the cloud. Later you'll see how to configure the application to use the Windows Azure Storage account that you created earlier.





<h2><a name="StorageExpVS"></a><span class="short-header">Developer storage</span>Viewing developer storage in Visual Studio</h2>

The **Windows Azure Storage** browser in **Server Explorer** (**Database Explorer** in Express editions of Visual Studio) provides a convenient read-only view of Windows Azure Storage resources.

1. From the **View** menu, choose **Server Explorer** (or **Database Explorer**).

2. Expand the **(Development)** node underneath the **Windows Azure Storage** node.

3. Expand **Tables** to see the tables that you created in the previous steps.

   ![Server Explorer][mtas-serverExplorer]

3. Double click the **MailingList** table.

   ![VS storage explorer][mtas-wasVSdata]

   Notice how the window shows the different schemas in the table. `MailingList` entities have `Description` and `FromEmailAddress` property, and `Subscriber` entities have the `Verified` property (plus `SubscriberGUID` which isn't shown because the image isn't wide enough). The table has columns for all of the properties, and if a given table row is for an entity that doesn't have a given property, that cell is blank.

You can't use the storage browser to update or delete Windows Azure Storage resources. You can use [Azure Storage Explorer](http://azurestorageexplorer.codeplex.com/ ) to update or delete development storage resources. 




<h2><a name="conf4azureStorage"></a><span class="short-header">Use your storage account</span>Configure the application to use your Windows Azure Storage account</h2>

Next, you'll see how to configure the application so that it uses your Windows Azure Storage account when it runs in Visual Studio, instead of development storage. There is a newer way to do this in Visual Studio that was introduced in version 1.8 of the SDK, and an older way that involves copying and pasting settings from the Windows Azure management portal. The following steps show the newer way to configure storage account settings.

4. In **Solution Explorer**, right-click **MvcWebRole** under **Roles** in the **AzureEmailService** project, and click **Properties**.

   ![Right Click Properties][mtas-rt-prop]<br/>

5. Click the **Settings** tab. In the **Service Configuration** drop down box, select **Local**.

6. Select the **StorageConnectionString** entry, and you'll see an ellipsis (**...**) button at the right end of the line. Click the ellipsis button to open the **Storage Account Connection String** dialog box.

   ![Right Click Properties][mtas-elip]<br/>

7. In the **Create Storage Connection String** dialog, click the **Your subscription** radio button, and then click the **Download Publish Settings** link. 

   ![Right Click Properties][mtas-enter]<br/>

1. Click the **Download Publish Settings** link.

   Visual Studio launches a new instance of your default browser with the URL for the Windows Azure portal download publish settings page. If you are not logged into the portal, you will be promoted to log in. Once you are logged in your browser will prompt you to save the publish settings. Make a note of where you save the settings.

   ![publish settings][mtas-3]

1. In the **Create Storage Connection String** dialog, click  **Import**, and then navigate to the publish settings file that you saved in the previous step.

1. Select the subscription and storage account that you wish to use, and then click **OK**.

  ![select storage account][mtas-5]

1. Follow the same procedure that you used for the `StorageConnectionString` connection string to set the `Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString` connection string.

   You don't have to download the publish settings file again. When you click the ellipsis for the `Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString` connection string, you'll find that the **Create Storage Connection String** dialog box defaults to the same **Subscription** and **Account Name** that you specified for the `StorageConnectionString` connection string. All you have to do is select the **Your subscription** radio button and click OK. 

2. Follow the same procedure that you used for the two connection strings for the MvcWebRole role to set the connection strings for the WorkerRoleA role and the workerRoleB role.

   The **Create Storage Connection String** dialog box defaults to the correct settings, as you saw in the MvcWebRole role when you configured the second connection string. 

### The manual method for configuring storage account credentials

The following procedure shows what the manual way to configure storage account settings. If you used the automatic method that was shown in the previous procedure, you can skip this procedure, or you can read through it to see what the automatic method did for you behind the scenes.

1. In your browser, open the [Windows Azure Management Portal][NewPortal].

2. Click the **Storage** Tab, then click the test account you created in the previous step, and then click the **Manage Keys** icon.

   ![Manage Keys][mtas-manage-keys]<br/>

   ![Keys GUID][mtas-guid-keys]<br/>

3. Copy the primary or secondary access key.


4. In **Solution Explorer**, right-click **MvcWebRole** under **Roles** in the **AzureEmailService** project, and click **Properties**.

   ![Right Click Properties][mtas-rt-prop]<br/>

5. Click the **Settings** tab. In the **Service Configuration** drop down box, select **Local**.

6. Select the **StorageConnectionString** entry, and you'll see an ellipsis (**...**) button at the right end of the line. Click the ellipsis button to open the **Storage Account Connection String** dialog box.

   ![Right Click Properties][mtas-elip]<br/>

7. In the **Create Storage Connection String** dialog, select the **Manually entered credentials** radio button. Enter the name of your storage account and the primary or secondary access key you copied from the portal. Click the **OK** button.

You can use the same procedure to configure settings for the worker roles, or you can propagate the web role settings to the worker roles by editing the configuration file. The following steps explain how to edit the configuration file.

8. Open the **ServiceConfiguration.Local.cscfg** file that is located in the **AzureEmailService** project.

   In the `Role` element for `MvcWebRole` you'll see a `ConfigurationSettings` element that has the settings that you updated by using the Visual Studio UI.

		  <Role name="MvcWebRole">
		    <Instances count="1" />
		    <ConfigurationSettings>
		      <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="DefaultEndpointsProtocol=https;AccountName=[name];AccountKey=[Key]" />
		      <Setting name="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=aestest;AccountKey=[Key]" />
		    </ConfigurationSettings>
		  </Role>
		
   In the `Role` elements for the two worker roles you'll see the same two connection strings.

9. Delete the `Setting` elements for these two connection strings from the `WorkerRoleA` and `WorkerRoleB` elements, and then copy and paste in their place the `Setting` elements from the `MvcWebRole` element.

For more information on the configuration files, see [Configuring a Windows Azure Project ](http://msdn.microsoft.com/en-us/library/windowsazure/ee405486.aspx)

### Test the application configured to use your storage account

9. Press CTRL+F5 to run the application. Enter some data by clicking the Mailing Lists, Messages and Subscribers links as you did previously in this tutorial.

You can now use either **Azure Storage Explorer** or **Server Explorer** to view the data that the application entered in the Windows Azure tables.

### Use Azure Storage Explorer to view data entered into your storage account

10. Open **Azure Storage Explorer**.

11. Select the storage account that you entered credentials for earlier.

12. Under **Storage Type**, select **Tables**.

12. Select the `MailingList` table, and then click **Query** to see the data that you entered on the **Mailing List** and **Subscriber** pages of the application.

   ![ASE][mtas-ase1]<br/>

### Use Server Explorer to view data entered into your storage account

11. In *Server Explorer* (or **Database Explorer**), right click **Windows Azure Storage** and click **Add New Storage Account**.

12. Follow the same procedure you used earlier to set up your storage account credentials.

13. Expand the new node under **Windows Azure Storage** to view data stored in your Windows Azure storage account.

   ![ASE][mtas-se3]<br/>

### Optional steps to disable Azure Storage Emulator automatic startup 

If you are not using the storage emulator, you can decrease project start-up time and use less local resources by disabling automatic startup for the Windows Azure storage emulator.

11. In **Solution Explorer**, right click the **AzureEmailService** cloud project and select **Properties**.

   ![Selecting cloud project properties][mtas-aesp]<br/>

11. Select the **Development** tab.

12. Set **Start Windows Azure storage emulator** to **False**.

   ![Disabling the storage emulator automatic startup][mtas-1]<br/>

   **Note**: You should only set this to false if you are not using the storage emulator. 

   This window also provides a way to change the **Service Configuration** file that is used when you run the application locally from **Local** to **Cloud** (from *ServiceConfiguration.Local.cscfg* to *ServiceConfiguration.Cloud.cscfg*.

13. In the Windows system tray, right click on the compute emulator icon and click **Shutdown Storage Emulator**.

   ![ASE][mtas-se4]<br/>





<h2><a name="sendGrid"></a><span class="short-header">SendGrid</span>Get a SendGrid account</h2>

The sample application uses SendGrid to send emails.  In order to send emails by using SendGrid, you have to set up a SendGrid account, and then you have to update a configuration file with your SendGrid credentials.

<div class="note"><p><strong>Note:</strong> If you don't want to use SendGrid, or can't use SendGrid, you can easily substitute your own email service. The code that uses SendGrid is isolated in two methods in worker role B.  <a href="http://windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/5-worker-role-b/">Tutorial 5</a> explains what you have to change in order to implement a different method of sending emails. If you want to do that, you can skip this procedure and continue with this tutorial; everything else in the application will work (web pages, email scheduling, etc.) except  for the actual sending of emails.</p></div>

1. Follow the instructions in [How to Send Email Using SendGrid with Windows Azure](http://www.windowsazure.com/en-us/develop/net/how-to-guides/sendgrid-email-service/ "SendGrid") to sign up for a free account.

2. Edit the *ServiceConfiguration.Cloud.cscfg* file and enter the SendGrid user name and password values that you obtained in the previous step into the `WorkerRoleB` element that has these settings. The following code shows the WorkerRoleB element.

   ![SendGridSettings][mtas-sg]<br/>

3. There is also an AzureMailServiceURL setting. Set this value to the URL that you selected when you created your Windows Azure Cloud Service, for example:  "http://aescloud.cloudapp.net".





<h2><a name="deployAz"></a><span class="short-header">Deploy to Windows Azure</span>Deploy the Application to Windows Azure</h2>

To deploy the application you can create a package in Visual Studio and upload it by using the Windows Azure Management Portal, or you can publish directly from Visual Studio. In this tutorial you'll use the package method. For information on using the publish approach for deploying to Windows Azure, see [Publish Windows Azure Application Wizard](http://msdn.microsoft.com/en-us/library/windowsazure/hh535756.aspx "Publish to Azure")

In this section of the tutorial, you package and upload the application to the staging environment. Later you'll promote the staging deployment to production.

### Implement IP restrictions

When you deploy to staging, the application will be publicly accessible to anyone who knows the URL. Therefore, your first step is to implement IP restrictions to ensure that no unauthorized persons can use it. In a production application you would implement an authentication and authorization mechanism like the ASP.NET membership system, but these functions have been omitted from the sample application to keep it simple to set up and deploy.

1. Open the *Web.Release.config* file and replace the **ipAddress** attribute value 127.0.0.1 with your IP address. 

   You can find your IP address by searching for "Find my IP" with  [Bing](http://www.bing.com/search?q=find+my+IP&qs=n&form=QBLH&pq=find+my+ip&sc=8-10&sp=-1&sk= "find my IP") or another search engine. 

   When the deployment package is created, the transformations specified in the *Web.release.config* file will be applied, and the IP restriction elements will be in the *web.config* file that will be deployed to the cloud. You can view the transformed *web.config* file in the *AzureEmailService\MvcWebRole\obj\Release\TransformWebConfig\transformed* folder after the package is created.

### Configure the application to use your storage account when it runs in the cloud

1. Open the cloud configuration file (*ServiceConfiguration.Cloud.cscfg*) in the **AzureEmailService** project and set the `StorageConnectionString` setting using the account name and access key from the management portal. 

   You can copy these settings from the *ServiceConfiguration.Local.cscfg* file, as you saw earlier when you copied the settings from the `MvcWebRole` to the two worker roles.

   If you set the `StorageConnectionString` setting to the same account used in the  *ServiceConfiguration.Local.cscfg* file,  your deployed application and local application will use the same azure storage. If you were deploying a production application, you would typically use a different account for production than you use for testing. You can also use a different account for the diagnostics connectionString.

2. Verify that the web role and two worker role elements all define the same StorageConnectionString.

### Create the deployment package

2. If it is not already open, launch Visual Studio as administrator and open the Windows AzureEmailService solution.

3.	Right-click the **AzureEmailService** cloud project and select **Package**.

   ![Package][mtas-2]<br/>

4. In the **Package Windows Azure Application** dialog, verify the **Service Configuration**  is set to **Cloud**, then click **Package**. 

   ![Cloud Package][mtas-pack]<br/>

   Visual Studio builds the project and generates the service package. **File Explorer** opens with the current folder set to the location where the generated package was created. 

   ![File][mtas-fe]<br/>

   **Note**: Although the procedure is not shown here, you can use the Publish Cloud Service feature in the Windows Azure Tools to publish directly from Visual Studio.

### Upload the deployment package to the cloud

4.	Switch back to the Management Portal browser window and click the cloud service you created.

   ![Cloud Service][mtas-c1]<br/>

5. Click **Staging**, then click **Upload a New Staging Deployment**.

   ![Staging][mtas-c2]<br/>

6. Enter a deployment name. 

7. Click **From Local** in the **Package** and **Configuration** input boxes and browse to the *app.publish* folder that Visual Studio created and opened in a previous step. 

7. Select the package and configuration files. 

8. Check the check box **Deploy even if one or more roles contains a single instance**. 

   The web role and two worker roles are created as a single instance. At this point in the tutorial we don't need multiple instances of each role. Instances are defined by the **Instances** element in the *ServiceConfiguration.Cloud.cscfg* file. Later in the tutorial we show how to scale the application by increasing the instance count of worker role B. Finally, click the check icon at the lower right corner of the box to upload the package. This step can take several minutes to complete, because Windows Azure is provisioning a virtual machine for the web role and each worker role.

   ![Staging2][mtas-c3]

7. In the portal, click **Dashboard**.

   ![Dashboard][mtas-c4]

8. Click the **Site URL** to launch the application.

   ![Dashboard][mtas-c5]

9. Enter some data in the **Mailing List**, **Subscriber**, and **Message** web pages to test the application.

**Note**: To deploy changes to the application, you must follow the steps in this section to create a new cloud package, then upload the new package and configuration files.




<h2><a name="swap"></a><span class="short-header">Production</span>Promote the Application from Staging to Production</h2>

1. In the [Windows Azure Management Portal][NewPortal], click the **Cloud** icon in the left pane, then click your cloud service, finally click  **Swap**.

2. Click **Yes** to complete the VIP (virtual IP) swap. This step can take several minutes to complete.

   ![Dashboard][mtas-c6]

3. Click the **Cloud** icon in the left pane, then click your cloud service, finally click  **Production**.

4. Notice the **Site URL** has changed from a GUID prefix to the name of your cloud service. Click the **Site URL** or copy and paste it to a browser to test the application in production. 

   ![Dashboard][mtas-c7]

   If you haven't changed the storage account settings, the data you entered while testing the staged version of the application is shown when you run the application in the cloud.




<h2><a name="trace"></a><span class="short-header">Trace</span>Configure and View Trace Data</h2>

Tracing is an invaluable tool for debugging a cloud application. In this section of the tutorial you'll see how to view tracing data.

1. Open the *ServiceConfiguration.\*.cscfg* files. Verify the Diagnostics.ConnectionString settings element  is configured to use Windows Azure Storage and not development storage.

   **Note:** A best practice is to use a different storage account for Trace data than the storage account used for the applications production data. But for simplicity in this tutorial you have been configuring the same account for tracing.

1. In Visual Studio, open *WorkerRoleA.cs*, search for **ConfigureDiagnostics**, and examine the **ConfigureDiagnostics** method. 

   The **ConfigureDiagnostics** method in each of the worker and web roles configures the trace listener to record data using the Trace API. For more information, see [Using Trace in Windows Azure Cloud Applications](http://blogs.msdn.com/b/windowsazure/archive/2012/10/24/using-trace-in-windows-azure-cloud-applications-1.aspx "Using Trace in Windows Azure")

1. In **Server Explorer**, select **WADLogsTable** for the storage account you added previously. You can enter a [WCF Data Services filter](http://msdn.microsoft.com/en-us/library/windowsazure/ff683669.aspx "WCF filter") to limit the entities displayed. In the following image, only warning and error messages are displayed.

  ![Dashboard][mtas-trc]





<h2><a name="addRole"></a><span class="short-header">Add a Role Instance</span>Add another worker role instance to handle increased load</h2>

There are two approaches to scaling compute resources in Azure roles, by specifying the [virtual machine size](http://msdn.microsoft.com/en-us/library/windowsazure/ee814754.aspx "VM sizes") and/or by specifying the instance count of running virtual machines. 

The virtual machine (VM) size is specified in the `vmsize` attribute of the `WebRole` or `WorkerRole` element in the *ServiceDefinition.csdef* file. The default setting is `small` which provides you with one core and 1.75 GB of RAM. For applications that are multi-threaded and use lots of memory, disk and bandwidth, you can increase the VM size for increased performance. For example, an `ExtraLarge` VM has 8 CPU cores and 14 GB of RAM. Increasing memory, cpu cores, disk and bandwidth on a single machine is known as *scale up*. Good candidates for scale up include ASP.NET web applications that use [asynchronous methods](http://www.asp.net/mvc/tutorials/mvc-4/using-asynchronous-methods-in-aspnet-mvc-4 "Async MVC"). See [Virtual Machine Sizes](http://msdn.microsoft.com/en-us/library/windowsazure/ee814754.aspx "VM sizes") for a description of the resources provided by each VM size.

Worker role B in this application is the limiting component under high load because it does the work of sending emails (worker role A just creates queue messages, which is not resource-intensive). Because worker role B is not multi-threaded and does not have a large memory footprint, it's not a good candidate for scale up. Worker role B can scale linearly (that is, nearly double performance when you double the instances) by increasing the instance count. Increasing the number of compute instances is known as *scale out*. There is a cost for each instance, so you should only scale out when your application requires it. 

You can scale out a web or worker role by updating the setting in the Visual Studio UI or by editing the *ServiceConfiguration.\*.cscfg* files directly. The instance count is specified in the `Instances` element in the *.cscfg* files. When you update the setting you have to deploy the updated configuration file to make the change take effect. Alternatively, for transient increases in load, you can change the number of role instances in the Windows Azure Management Portal. You can also configure the number of instances using the Windows Azure Management API. Finally, you can use the [Autoscaling Application Block](http://msdn.microsoft.com/en-us/library/hh680892(v=pandp.50).aspx "AutoScale") to automatically scale out to meet increased load. For more information on auto scaling, see [Autoscaling and Windows Azure](http://msdn.microsoft.com/en-us/library/hh680945(v=PandP.50).aspx)

In this section of the tutorial you'll scale out worker role B by using the management portal, but first you'll see how it's done in Visual Studio.

To do it in Visual Studio, you would right-click the role under **Roles** in the cloud project and select **Properties**.

   ![Right Click Properties][mtas-rt-prop]
 
You would then select the **Configuration** tab on the left, and select **Cloud** in the **Service Configuration** drop down. 

  ![Instance Count][mtas-instanceCnt]

Notice that you can also configure the VM size in this tab.

In order to test and verify that the application is running multiple instances of worker role B, you'll make some changes to the code that will ensure that you can see the result of running two instances in the tracing data.

1. Open the *WorkerRoleB.cs* file and modify the email queue processing in the **Run** method by adding a two minute **TimeSpan** to the **GetMessage** call. See the example that is shown following the next step.

   By default, the message returned from **GetMessage** becomes invisible to any other code reading messages from this queue for 30 seconds. By passing **GetMessage** a **TimeSpan** of two minutes, the message returned from **GetMessage** becomes invisible to any other code reading messages from this queue for two minutes.

1. Add a call to **Sleep** for 30 seconds right after the **ProcessQueueMessage** call. This will ensure that one instance cannot process all the messages in the queue. The following code shows the changes in yellow highlight.

   ![Sleep][mtas-sleep2]

1. Create a new package and upload it to the Windows Azure Portal.

1. In the Windows Azure Portal, select your cloud service, then select **Scale**.

1. Increase the number of instances then select **Save**.

   ![increase instances][mtas-in3]

   It can take a few minutes for the new VMs to be provisioned.

1. Select the **Instances** tab to see your each instance in your application.

 ![view instances][mtas-in2]

1. Browse to the application and add an email message that will be sent to several subscribers. (Create a mailing list, add multiple subscribers to it, and then create a message that is scheduled to be sent to the mailing list. Set the scheduled date of the message to today so that the worker roles will process the message.)

1. Give the application a couple of minutes to process the message that you scheduled, and then open **Azure Storage Explorer** and query the **WADLogsTable**.

1. The trace messages shows each instance processing queue items.

You have now seen how to configure, deploy, and scale the completed application. The following tutorials show how to build the application from scratch. In the [next tutorial][tut2] you'll build the web role.

For links to additional resources for working with Windows Azure Storage tables, queues, and blobs, see the end of [the last tutorial in this series][tut5].

[tut5]: http://windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/5-worker-role-b/
[tut2]: http://windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/2-download-and-run/
[Set up the development environment]: #setupdevenv
[Set up a free Windows Azure account]: #setupwindowsazure
[Create a Windows Azure Storage account]: #createWASA
[Install Azure Storage Explorer]: #installASE
[Create a Cloud Service]: #createcloudsvc
[Download and run the completed solution]: #downloadcnfg
[View developer storage in Visual Studio]: #StorageExpVS
[Configure the application for Windows Azure Storage]: #conf4azureStorage
[Deploy the application to Windows Azure]: #deployAz
[Promote the application from staging to production]: #swap
[Get a SendGrid account]: #sendGrid
[Configure and view trace data]: #trace
[Add another worker role instance to handle increased load]: #addRole

[Windows Azure SDK for Visual Studio 2010]: http://go.microsoft.com/fwlink/?LinkID=254269
[Windows Azure SDK for Visual Studio 2012]:  http://go.microsoft.com/fwlink/?LinkId=254364
[firsttutorial]: http://windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/1-overview/
[tut5]: http://windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/5-worker-role-b/
[NewPortal]: http://manage.windowsazure.com
[managestorage]: http://www.windowsazure.com/en-us/manage/services/storage/how-to-manage-a-storage-account/

[WebPIAzureSDKNETVS12Oct2012]: ../Media/WebPIAzureSDKNETVS12Oct2012.png
[mtas-portal-new-storage]: ../Media/mtas-portal-new-storage.png
[mtas-storage-quick]: ../Media/mtas-storage-quick.png
[mtas-create-storage-url-test]: ../Media/mtas-create-storage-url-test.png
[mtas-manage-keys]: ../Media/mtas-manage-keys.png
[mtas-guid-keys]: ../Media/mtas-guid-keys.PNG
[mtas-new-cloud]: ../Media/mtas-new-cloud.png
[mtas-create-cloud]: ../Media/mtas-create-cloud.png
[mtas-ase-add]: ../Media/mtas-ase-add.png
[mtas-ase-add2]: ../Media/mtas-ase-add2.png
[mtas-ase-add3]: ../Media/mtas-ase-add3.png
[mtas-rt-prop]: ../Media/mtas-rt-prop.png
[mtas-mailinglist1]: ../Media/mtas-mailinglist1.png
[mtas-create1]: ../Media/mtas-create1.png
[mtas-mailing-list-index-page]: ../Media/mtas-mailing-list-index-page.png
[mtas-subscribers-index-page]: ../Media/mtas-subscribers-index-page.png
[mtas-message-create-page]: ../Media/mtas-message-create-page.png
[mtas-message-index-page]: ../Media/mtas-message-index-page.png
[mtas-serverExplorer]: ../Media/mtas-serverExplorer.png
[mtas-wasVSdata]: ../Media/mtas-wasVSdata.png
[mtas-elip]: ../Media/mtas-elip.png
[mtas-enter]: ../Media/mtas-enter.png
[mtas-ase1]: ../Media/mtas-ase1.png
[mtas-se1]: ../Media/mtas-se1.png
[mtas-se2]: ../Media/mtas-se2.png
[mtas-se3]: ../Media/mtas-se3.png
[mtas-aesp]: ../Media/mtas-aesp.png
[mtas-1]: ../Media/mtas-1.png
[mtas-se4]: ../Media/mtas-se4.png
[mtas-2]: ../Media/mtas-2.png
[mtas-pack]: ../Media/mtas-pack.png

[mtas-fe]: ../Media/mtas-fe.png
[mtas-c1]: ../Media/mtas-c1.png
[mtas-c2]: ../Media/mtas-c2.png
[mtas-c3]: ../Media/mtas-c3.png
[mtas-c4]: ../Media/mtas-c4.png
[mtas-c5]: ../Media/mtas-c5.png
[mtas-c6]: ../Media/mtas-c6.png
[mtas-c7]: ../Media/mtas-c7.png
[mtas-er1]: ../Media/mtas-er1.png
[mtas-sg]: ../Media/mtas-sg.png
[mtas-trc]: ../Media/mtas-trc.png
[mtas-instanceCnt]: ../Media/mtas-instanceCnt.png
[mtas-sleep2]: ../Media/mtas-sleep2.png
[mtas-in3]: ../Media/mtas-in3.png
[mtas-in2]: ../Media/mtas-in2.png
[mtas-3]: ../Media/mtas-3.png
[mtas-5]: ../Media/mtas-5.png
[mtas-]: ../Media/mtas-.png
[mtas-]: ../Media/mtas-.png

[mtas-]: ../Media/mtas-.png



[blob6]: ../Media/blob6.png
[blob7]: ../Media/blob7.png
[blob8]: ../Media/blob8.png
[blob9]: ../Media/blob9.png

[mtas-storage-quick-SM]: ../Media/mtas-storage-quick-SM.png
[0]: ../../Shared/media/antares-iaas-preview-01.png
[1]: ../../Shared/media/antares-iaas-preview-05.png
[2]: ../../Shared/media/antares-iaas-preview-06.png
[Image001]: ../Media/Dev-net-getting-started-001.png

