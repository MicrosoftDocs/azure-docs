
You can optionally test push notifications with your mobile service running on the local computer or VM before you publish to Azure. To do this, you must set information about the notification hub used by your app in the web.config file. This information is only used when running locally to connect to the notification hub; it is ignored when published to Azure.

1. Open the readme.html file in either the Windows or WindowsPhone app project folder. 

	This displays the **Push setup is almost complete** page, if you don't still have it open. The section **Step 3: Modify Web Config** contains the notification hub connection information.

2. In your mobile service project in Visual Studio, open the Web.config file for the service, then in **connectionStrings**, add the **MS_NotificationHubConnectionString** connection string from the **Push setup is almost complete** page.

3. In **appSettings**, replace the value of the **MS_NotificationHubName** app setting with the name of the notification hub found in the **Push setup is almost complete** page.

4. Right-click the mobile service project and click **Debug** then **Start new instance** and make a note of the service root URL of the start up page displayed in the browser.

	This is the URL of the local host for the .NET backend project. You will use this URL to test the app against the mobile service running on the local computer.

Now, the mobile service project is configured to connect to the notification hub in Azure when running locally. Note that it is important to use the same notification hub name and connection string as the portal because these project settings in the Web.config file are overridden by the portal settings when running in Azure. 