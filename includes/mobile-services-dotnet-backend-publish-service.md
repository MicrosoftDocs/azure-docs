

After testing the client app against the local mobile service, the final stage of this tutorial is to publish the mobile service to Azure and run the app against the live service.

1. In Solution Explorer, right-click the mobile service project, click **Publish**, then in the **Publish Web** dialog box click **Azure Mobile Services**.

	![](./media/mobile-services-dotnet-backend-publish-service/mobile-quickstart-publish.png)
	
2. Sign in with your Azure account credentials, select your service from **Existing Mobile Services**, and click **OK**.

	![](./media/mobile-services-dotnet-backend-publish-service/mobile-quickstart-publish-select-service.png)

	Visual Studio downloads your publish settings directly from Azure.

	>[WACOM.NOTE]Visual Studio stores your Azure credentials until you explicitly sign out.

3. Click **Validate connection** to verify that publishing is correctly configured, then click **Publish**.

	![](./media/mobile-services-dotnet-backend-publish-service/mobile-quickstart-publish-2.png)

	After publishing succeeds, you will again see the confirmation page that the mobile service is up and running, this time in Azure.

