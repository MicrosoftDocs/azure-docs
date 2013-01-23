<properties linkid="develop-net-tutorials-multi-tier-web-site-2-download-and-run" urlDisplayName="Step 2: Download and Run" pageTitle="Multi-tier web site tutorial - Step 2: Download and run" metaKeywords="Windows Azure tutorial, deploying email service app, publishing email service" metaDescription="The second tutorial in a series that teaches how to configure your computer for Windows Azure development and deploy the Email Service app." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />








<div chunk="../chunks/article-left-menu.md" />
# Configuring and Deploying the Azure Email Service application

This is the second tutorial in a series of five that show how to build and deploy the Azure Email Service sample application.  For information about the application and the tutorial series, see the [first tutorial in the series][firsttutorial].

This tutorial shows how to configure your computer for Azure development and how to deploy the Azure Email Service application to a Windows Azure Cloud Service by using  Visual Studio 2012 or Visual Studio 2010 Express for Web. 

You can open a Windows Azure account for free, and if you don't already have Visual Studio 2012, the SDK automatically installs Visual Studio 2012 for Web Express. So you can start developing for Windows Azure entirely for free.

In this tutorial you'll learn:

* How to set up your computer for Windows Azure development by installing the Windows Azure SDK.
* How to configure and test the Azure Email Service application on your local machine.
* How to publish the email service to Windows Azure.

<div chunk="../../Shared/Chunks/create-account-and-websites-note.md" />
 
### Tutorial segments

1. [Set up the development environment][]
2. [Set up a free Windows Azure Account][]
3. [Create a Windows Azure Storage Account][]
4. [Optional: Install Azure Storage Explorer][]
5. [Create a Cloud Server in the Management Portal][]
6. [Download and Configure the Completed Solution][]
7. [Run the Application from Visual Studio][]
8. [Viewing Developer Storage in Visual Studio][]
9. [Configure the Application for Azure Storage][]
10. [Deploy the Application to Azure][]
11. [Promote the Application from Staging to Production][]
12. [Get a SendGrid account][]
13. [Configure and View Trace Data][]

<h2><a name="setupdevenv"></a><span class="short-header">Set up environment</span>Set up the development environment</h2>

To start, set up your development environment by installing the Windows Azure SDK for the .NET Framework. 

1. To install the Windows Azure SDK for .NET, click the link that corresponds to the version of Visual Studio you are using. If you don't have Visual Studio installed yet, use the Visual Studio 2012 link.<br/>
[Windows Azure SDK for Visual Studio 2010][]<br/>
[Windows Azure SDK for Visual Studio 2012][]<br/>
If you don't have Visual Studio installed yet, it will be installed by the link.<br/>

2. When you are prompted to run or save vwdorvs11azurepack.exe, click **Run**.

3. In the Web Platform Installer window, click **Install** and proceed with the installation.

   ![Web Platform Installer - Windows Azure SDK for .NET][mtas-wpi-installer]<br/>

When the installation is complete, you have everything necessary to start developing.

<h2><a name="setupwindowsazure"></a><span class="short-header">Create Windows Azure Account</span>Set up a free Windows Azure Account</h2>

The next step is to create a Windows Azure account.

1. Browse to [Windows Azure](http://www.windowsazure.com "Windows Azure").

2. Click  the **Free trial** link and follow the instructions. 

<h2><a name="createWASA"></a><span class="short-header">Create Storage Account</span>Create a Windows Azure Storage Account</h2>

1. In your browser, open the [Windows Azure Management Portal][NewPortal].

2. In the [Windows Azure Management Portal][NewPortal], click **Storage**, then click **New**.

   ![New Storage][mtas-portal-new-storage]

3. Click **Quick Create**.

   Alternatively, you can click the **Create a Storage Account** link, which also selects the Quick Create link.

   ![Quick Create][mtas-storage-quick]

4. In the URL input box, enter a URL prefix. Set the region to the area where you will deploy the application. Uncheck the **Enable Geo-Replication** check box. When geo-replication is turned on for a storage account, the stored content is replicated to a secondary location to enable failover to that location in case of a major disaster in the primary location. Geo-replication can incur additional costs. See [How To Manage Storage Accounts](http://www.windowsazure.com/en-us/manage/services/storage/how-to-manage-a-storage-account/ "Geo-Rep") for more information.  Finally, click **Create Storage Account**. In the image below, a storage account is created with the URL aestest.core.windows.net.

   ![create storage with URL prefix][mtas-create-storage-url-test]

   This step can take several minutes to complete. While you are waiting, you can repeat these steps and create a production storage account. It's often convenient to have a test storage account to use for local development, another test storage account for testing in Windows Azure, and a production storage account. In this tutorial we will primarily use the Azure storage test account when we are running the application from Visual Studio.

5. Click the test account you created in the previous step, then click the **Manage Keys** icon.

   ![Manage Keys][mtas-manage-keys]<br/>

   ![Keys GUID][mtas-guid-keys]<br/>

   You will need the primary or secondary access key throughout this tutorial. The **Primary Access Key** and **Secondary Access Key** both provide a shared secret that you can use to access storage. The secondary key gives the same access as the primary key and is used for backup purposes. You can regenerate each key independently and rotate keys to help insure they are secure. The keys in the image above are not valid, they were regenerated after the image was captured.

<h2><a name="installASE"></a><span class="short-header">Install ASE</span> Install Azure Storage Explorer</h2>

Azure Storage Explorer is a tool that you can use to query and update Windows Azure storage tables, queues, and blobs. You will use it throughout these tutorials to verify that data is updated correctly and to create test data.

1. Install  [Azure Storage Explorer](http://azurestorageexplorer.codeplex.com/ ).

2. Launch Azure Storage Explorer and click **Add Account**.

   ![Add ASE Account][mtas-ase-add]<br/>

3. Enter the name of the test storage account and a key that you created previously.

   ![Add ASE Account][mtas-ase-add2]<br/>

   In the image below, a new table called *mytable* is created.

   ![Add ASE Account][mtas-ase-add3]<br/>

<h2><a name="createcloudsvc"></a><span class="short-header">Create Cloud Service</span>Create a Cloud Service in the Management Portal</h2>

1. In your browser, open the [Windows Azure Management Portal][NewPortal].

2. Click **Cloud Services** then click the **New** icon.

   ![Quick Cloud][mtas-new-cloud]<br/>

   Alternatively, you can click the **Create a Cloud Service** link, which also slects Quick Create.

3. Click **Quick Create**.

4. In the URL input box, enter a URL prefix. Set the region to the area where you will deploy the application. Finally, click **Create Cloud Service**. 

   In the image below, a cloud service is created with the URL aescloud.cloudapp.net.

   ![create storage with URL prefix][mtas-create-cloud]

   You can move on to the next step without waiting for this step to complete.

<h2><a name="downloadcnfg"></a><span class="short-header">Download and Configure</span>Download and Configure the Completed Solution</h2>

1. Download the [completed solution](http://code.msdn.microsoft.com/site/search?f%5B0%5D.Type=SearchText&f%5B0%5D.Value=dykstra&sortBy=Date).

2. Unzip the downloaded file and open it in Visual Studio.

3. In **Solution Explorer**, right-click on MvcWebRole and click **Properties**.

   ![Right Click Properties][mtas-rt-prop]<br/>

4. Click the **Settings** tab and press the **Add Setting** button.  
    ![Blob6][]

    A new **Setting1** entry will then show up in the settings grid.

    **Note:** Don't change the default **Service Configuration** value of **All Configurations**.

5.  In the **Type** drop-down of the new **Setting1** entry, choose
    **Connection String**.  
    ![Blob7][]

6.  Click the ellipsis (**...**) button at the right end of the **Setting1** entry.

    The **Storage Account Connection String** dialog will open.

7.  Keep the default radio button **Use the Windows Azure storage emulator** (the Windows  Azure storage simulated on your local machine).

    ![Blob8][]

8.  Change the entry **Name** from **Setting1** to **StorageConnectionString**. You will reference this connection string throughout this series.  

    ![Blob9][]

### What's Happening Under the Hood

When you add a new setting with the **Add Settings** button, the new setting is added to the XML in the *ServiceDefinition.csdf* file and in each of the two *.cscfg* configuration files. The following XML is added by Visual Studio to the *ServiceDefinition.csdf* file.

    <ConfigurationSettings>
      <Setting name="StorageConnectionString" />
    </ConfigurationSettings>

The following XML is added to each *.cscfg* configuration file.

	<Setting name="StorageConnectionString" value="UseDevelopmentStorage=true" />

You can manually add settings to the *ServiceDefinition.csdf* file and the two *.cscfg* configuration files, but using the properties editor has the following advantages for connection strings:

- You only add the new setting in one place, and the correct setting XML is added to all three files.
- The correct XML is generated for the three settings files. The *ServiceDefinition.csdf* file defines settings that must be in each *.cscfg* configuration file. If the *ServiceDefinition.csdf* file and the two *.cscfg* configuration files settings are inconsistent, you can get the following error message from Visual Studio: *The current service model is out of sync. Make sure both the service configuration and definition files are valid.*

   ![Config error][mtas-er1]

The properties editor will not work until you resolve inconsistency problems.

Examine the *ServiceConfiguration.Local.cscfg* file. The XML for worker role A and worker role B also contains a storage connection string specifying the development storage emulator. The storage connection strings in the two worker roles were provided by the download.

<h2><a name="runVS"></a><span class="short-header">Run in VS</span>Run the Application from Visual Studio</h2>

When you run the solution from Visual Studio, the *ServiceConfiguration.Local.cscfg* file is used.  Later in the tutorial when you package the application for Azure deployment, the *ServiceConfiguration.Cloud.cscfg* file is used.

1. Press CTRL+F5 to run the application.
The application home page appears in your browser.

   ![Run the App.][mtas-mailinglist1]

2. Click  the **Create New** button and enter some test data, then click the **Create** button.

   ![Run the App.][mtas-create1]

3. Create a couple more mailing list entries.

   ![Mailing List Index Page][mtas-mailing-list-index-page]

4. Click  the *Subscribers* button and add some subscribers.

   ![Subscriber Index Page][mtas-subscribers-index-page]

4. Click the *Messages* button and add some messages. Don't change the scheduled date which defaults to one week in the future. The application can't send messages until you configure SendGrid.

   ![Message Create Page][mtas-message-create-page]
	<br/><br/>
   ![Message Index Page][mtas-message-index-page]

<h2><a name="StorageExpVS"></a><span class="short-header">Dev Storage</span>Viewing Developer Storage in Visual Studio</h2>

1. Display **Server Explorer** in Visual Studio. From the menu bar choose **View, Server Explorer**.

2. Expand the **(Development)** node underneath the **Windows Azure Storage** node. The following figure shows the blob and table resources you created in the previous steps.

   ![Server Explorer][mtas-serverExplorer]

3. Double click the **MailingList** table. The following image shows a portion of the data in the Message table. Notice the two different schema's in the table.

   ![VS storage explorer][mtas-wasVSdata]

   The **Windows Azure Storage** browser in **Server Explorer** provides a convienent read-only view of Windows Azure Storage resources. You can't use **Server Explorer** to delete Windows Azure Storage resources. You can use [Azure Storage Explorer](http://azurestorageexplorer.codeplex.com/ ) to delete development storage resources. 

<h2><a name="conf4azureStorage"></a><span class="short-header">Configure Storage</span>Configure the Application for Azure Storage</h2>
1. In your browser, open the [Windows Azure Management Portal][NewPortal].
2. Click the **Storage** Tab, then click the test account you created in the previous step, and then click the **Manage Keys** icon.

   ![Manage Keys][mtas-manage-keys]<br/>

   ![Keys GUID][mtas-guid-keys]<br/>

3. Copy the primary or secondary access key.

4. In Solution Explorer, right-click on MvcWebRole and click **Properties**.

   ![Right Click Properties][mtas-rt-prop]<br/>

5. Click the **Settings** tab. In the **Service Configuration** drop down box, select **Local**.

6. Click the ellipsis (**...**) button at the right end of the **StorageConnectionString** entry. The **Storage Account Connection String** dialog opens.

   ![Right Click Properties][mtas-elip]<br/>

7. In the **Storage Account Connection String** dialog, select the **Enter storage account credentials** radio button. Enter the name of your storage account and the primary or secondary access key you copied from the portal. Click the **OK** button.

   ![Right Click Properties][mtas-enter]<br/>

8. Open the **ServiceConfiguration.Local.cscfg** file and examine the XML markup in the role element for MvcWebRole. The storage account connection string editor updated the storage connection string using the account name and key you provided. Rather than use the  storage account connection string editor to update the storage connection string for the two worker roles, copy and paste the MvcWebRole storage connection string element over the storage connection string element in the two worker role elements. For more information on the configuration files, see [Configuring a Windows Azure Project ](http://msdn.microsoft.com/en-us/library/windowsazure/ee405486.aspx)

9. Press CTRL+F5 to run the application. Enter some data by clicking the Mailing Lists, Messages and Subscribers links as did previously in this tutorial.

10. Open Azure Storage Explorer and verify the data you entered has been saved to Azure Storage.

   ![ASE][mtas-ase1]<br/>

11. In *Server Explorer*, right click **Windows Azure Storage** and click **Add New Storage Account**.

   ![ASE][mtas-se1]<br/>

12. Enter the name of your storage account and a primary or secondary access key.

   ![ASE][mtas-se2]<br/>

   You can now use Visual Studio to view data stored in Windows Azure storage.

   ![ASE][mtas-se3]<br/>

11. **Optional** Disable Azure Storage Emulator automatic startup. If you are not using the storage emulator, you can increase project start time and use less local resources by disabling automatic startup. In **Solution Explorer**, right click the **AzureEmailService** cloud project and select **properties**.

   ![ASE][mtas-aesp]<br/>

12. **Optional** Set **Start Windows Azure storage emulator** to **False**.

   ![ASE][mtas-1]<br/>

   **Note**: You should only set this to false if you are not using the storage emulator. This dialog also provides a way to change the **Service Configuration** file from **Local** to **Cloud** (from *ServiceConfiguration.Local.cscfg* to *ServiceConfiguration.Cloud.cscfg*.

13. **Optional** In the Windows system tray, right click on the compute emulator icon and click **Shutdown Storage Emulator**.

   ![ASE][mtas-se4]<br/>

<h2><a name="deployAz"></a><span class="short-header">Deploy to Windows Azure</span>Deploy the Application to Windows Azure</h2>

There are several alternatives for publishing applications to Windows Azure. The Windows Azure Tools for Visual Studio allow you to both create and publish the service package to the Windows Azure environment directly from Visual Studio.  The Windows Azure Management Portal provides the means to publish and manage your service using only your browser.

In this section of the tutorial, you publish the application to the staging environment using the Management Portal.

1. Open the cloud configuration file (*ServiceConfiguration.Cloud.cscfg*)  and set the StorageConnectionString setting using the account name and access key from the management portal. If you set the the StorageConnectionString setting to the same account name used in the  *ServiceConfiguration.Local.cscfg* file,  your deployed application and local application will use the same azure storage. It's often helpful to use a different account for the storage connection string setting  when deploying to Windows Azure. 

2. Verify that the web role and two worker role elements all define the same StorageConnectionString.

2. If it is not already open, launch Visual Studio as administrator and open the AzureEmailService solution.

3.	Generate the package to publish to the cloud. To do this, right-click the **AzureEmailService** cloud project and select **Package**.

   ![Package][mtas-2]<br/>

4. In the **Package Windows Azure Application** dialog, verify the **Service Configuration**  is set to **Cloud**, then click **Package**. 

   ![Cloud Package][mtas-pack]<br/>

   Visual Studio builds the project and generates the service package. File Explorer opens with the current folder set to the location where the generated package was created. 

   ![File][mtas-fe]<br/>

   **Note**: Using the package approach requires that you create a new package each time you make changes to the application (any of the web or worker roles).

   **Note**: Although the procedure is not shown here, you can use the Publish Cloud Service feature in the Windows Azure Tools to publish your service package directly from Visual Studio.

4.	Switch back to the Management Portal browser window and click the cloud service you created.

   ![Cloud Service][mtas-c1]<br/>

5. Click **Staging**, then click **Upload a New Staging Deployment**.

   ![Staging][mtas-c2]<br/>

6. Enter a deployment name. Click the **Package** and **Configuration** input boxes and browse to the *app.publish* folder that Visual Studio created and opened in a previous step. Select the package and configuration files. Check the check box **Deploy even if one or more roles contains a single instance**. The web role and two worker roles are created as a single instance. At this point in the tutorial we don't need multiple instances of each role. Instances are defined by the **Instances** element in the *ServiceConfiguration.Cloud.cscfg* file. Later in the tutorial we show how to scale the application by increasing the instance count of worker role B. Finally, click the check icon to upload the package. This step can take several minutes to complete.

   ![Staging2][mtas-c3]<br/>

7. In the portal, click **Dashboard**.

   ![Dashboard][mtas-c4]<br/>

8. Click the **Site URL** to launch the application.

   ![Dashboard][mtas-c5]<br/>

9. Enter some data to test the application.

**Note**: To deploy changes to the application, you must follow the steps in this section to create a new cloud package, then upload the new package and configuration files.

<h2><a name="swap"></a><span class="short-header">Production</span>Promote the Application from Staging to Production</h2>

1. Click the Cloud icon in the left pane, then click your cloud service, finally click  **Swap**.

2. Click **Yes** to complete the VIP Swap. This step can take several minutes to complete.

   ![Dashboard][mtas-c6]

3. Click the Cloud icon in the left pane, then click your cloud service, finally click  **Production**.

4. Notice the **Site URL** has changed from a GUID prefix to the name of your cloud service. Click or copy the **Site URL** to test the application in production. 

   ![Dashboard][mtas-c7]

   If you haven't changed the storage account settings, the data you entered while testing the staged version of the application is retained.

<h2><a name="sendGrid"></a><span class="short-header">SendGrid</span>Get a SendGrid account</h2>

1. Follow the instructions in [How to Send Email Using SendGrid with Windows Azure](http://www.windowsazure.com/en-us/develop/net/how-to-guides/sendgrid-email-service/ "SendGrid") to sign up for a free account.

<h2><a name="trace"></a><span class="short-header">Trace</span>Configure and View Trace Data</h2>
1. Edit the *ServiceConfiguration.*.cscfg* files. Find the Trace (diagnostics) settings element in the ConfigurationSettings element. The followng code shows the diagnostics setting element:

		<ConfigurationSettings>
		  <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" 
		           value="UseDevelopmentStorage=true" />
		</ConfigurationSettings>

2. Change the value attribute from "UseDevelopmentStorage=true" to the following:

      value="DefaultEndpointsProtocol=https;AccountName=[StorageAccount];AccountKey=[Account Key]"

   where "[StorageAccount]" and "[Account Key]" are your storage account and keys obtained from from the storage tab of the Windows Azure portal. 

   **Note:** The storage account doesn't need to be the same account the application uses for reading and writing application data. It's often more convenient to use a test or trace account to store trace data.

[Set Up the development environment]: #setupdevenv
[Set up a free Windows Azure Account]: #setupwindowsazure
[Create a Windows Azure Storage Account]: #createWASA
[Optional: Install Azure Storage Explorer]: #installASE
[Create a Cloud Server in the Management Portal]: #createcloudsvc
[Download and Configure the Completed Solution]: #downloadcnfg
[Run the Application from Visual Studio]: #runVS
[Viewing Developer Storage in Visual Studio]: #StorageExpVS
[Configure the Application for Azure Storage]: #conf4azureStorage
[Deploy the Application to Azure]: #deployAz
[Promote the Application from Staging to Production]: #swap
[Get a SendGrid account]: #sendGrid
[Configure and View Trace Data]: #trace

[Windows Azure SDK for Visual Studio 2010]: http://go.microsoft.com/fwlink/?LinkID=254269
[Windows Azure SDK for Visual Studio 2012]:  http://go.microsoft.com/fwlink/?LinkId=254364
[firsttutorial]: http://


[mtas-wpi-installer]: ../Media/mtas-wpi-installer.png
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
[mtas-]: ../Media/mtas-.png
[mtas-]: ../Media/mtas-.png
[mtas-]: ../Media/mtas-.png
[mtas-]: ../Media/mtas-.png



[blob6]: ../MediaTmp/blob6.png
[blob7]: ../MediaTmp/blob7.png
[blob8]: ../MediaTmp/blob8.png
[blob9]: ../MediaTmp/blob9.png

[mtas-storage-quick-SM]: ../Media/mtas-storage-quick-SM.png
[0]: ../../Shared/media/antares-iaas-preview-01.png
[1]: ../../Shared/media/antares-iaas-preview-05.png
[2]: ../../Shared/media/antares-iaas-preview-06.png
[Image001]: ../Media/Dev-net-getting-started-001.png

