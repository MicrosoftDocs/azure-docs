
Go back to Visual Studio and select the Shared Code Client App project (it is named like `<your app name>.Shared`)

1. Expand the **App.xaml** file and then open the **App.xaml.cs** file. Locate the declaration of the `MobileService` member which is initialized with a localhost URL. Comment out this declaration (with `CTRL+K,CTRL+C`) and uncomment the declaration (`CTRL+K,CTRL+U`) that connects to your hosted service:

        // This MobileServiceClient has been configured to communicate with your local
        // test project for debugging purposes.
        //public static MobileServiceClient MobileService = new MobileServiceClient(
        //    "http://localhost:58454"
        //);

        // This MobileServiceClient has been configured to communicate with the Azure Mobile Service and
        // Azure Gateway using the application key. You're all set to start working with your Mobile Service!
        public static MobileServiceClient MobileService = new MobileServiceClient(
            "https://mymobileapp-code.azurewebsites.net",
            "https://myresourcegroupgateway.azurewebsites.net/Microsoft.Azure.AppService.ApiApps.Gateway",
            "XXXX-APPLICATION-KEY-XXXXX"
        );

2. Press the F5 key to rebuild the project and start the Windows Store app, which should be your default start up project.

2. In the app, type meaningful text, such as *Complete the tutorial*, in the **Insert a TodoItem** textbox, and then click **Save**.

	![](./media/app-service-mobile-windows-universal-test-app-preview/mobile-quickstart-startup.png)

	This sends a POST request to the new mobile app backend hosted in Azure.

3. Stop debugging and change the default start up project in the universal Windows solution to the Windows Phone Store app (right click the `<your app name>.WindowsPhone` project and click **Set as StartUp Project**) and press F5 again.

	![](./media/app-service-mobile-windows-universal-test-app-preview/mobile-quickstart-completed-wp8.png)

	Notice that data saved from the previous step is loaded from the mobile app after the Windows app starts.

