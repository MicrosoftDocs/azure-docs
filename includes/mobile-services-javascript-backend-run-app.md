
The final stage of this tutorial is to build and run your new app.

1. Browse to the location where you saved the compressed project files, expand the files on your computer, and open the solution file in Visual Studio.

2. Press the **F5** key to rebuild the project and start the app.

3. In the app, type meaningful text, such as *Complete the tutorial*, in **Insert a TodoItem**, and then click **Save**.

   	This sends a POST request to the new mobile service hosted in Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile service, and the data is displayed in the second column in the app.

4. (Optional) In a universal Windows solution, change the default start up project to the other app and run the app again.

	Notice that data saved from the previous step is loaded from the mobile service after the app starts.
 
4. Back in the Management Portal, click the **Data** tab and then click the **TodoItems** table.

   	This lets you browse the data inserted by the app into the table.

   	![](./media/mobile-services-javascript-backend-run-app/mobile-data-browse.png)