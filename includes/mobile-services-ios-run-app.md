


The final stage of this tutorial is to build and run your new app.

1. Browse to the location where you saved the compressed project files, expand the files on your computer, and open the project file using Xcode.

   	![](./media/mobile-services-ios-run-app/mobile-xcode-project.png)

2. Press the **Run** button to build the project and start the app in the iPhone emulator, which is the default for this project.

3. In the app, type meaningful text, such as _Complete the tutorial_ and then click the plus (**+**) icon.

   	![](./media/mobile-services-ios-run-app/mobile-quickstart-startup-ios.png)

   	This sends a POST request to the new mobile service hosted in Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile service, and the data is displayed in the list.

	>[WACOM.NOTE]You can review the code that accesses your mobile service to query and insert data, which is found in the TodoService.m file.</p> 
 	</div>
