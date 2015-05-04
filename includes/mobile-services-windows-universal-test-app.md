
1. Press the F5 key to rebuild the project and start the Windows Store app.

2. In the app, type meaningful text, such as *Complete the tutorial*, in **Insert a TodoItem**, and then click **Save**.

	![](./media/mobile-services-windows-universal-test-app/mobile-quickstart-startup.png)

	This sends a POST request to the new mobile service hosted in Azure.

3. Stop debugging and change the default start up project in the universal Windows solution to the Windows Phone Store app and press F5 again.

	![](./media/mobile-services-windows-universal-test-app/mobile-quickstart-completed-wp8.png)
	
	Notice that data saved from the previous step is loaded from the mobile service after the app starts.