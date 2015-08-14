
The mobile service project that you download lets you to run your new mobile service right on your local computer or virtual machine. This makes it easy to debug your service code before you even publish it to Azure.

In this section, you will test your new app against the mobile service running locally.

1. Browse to the location where you saved the compressed project files, expand the files on your computer, and open the solution file in Visual Studio.

2. In the Solution Explorer in Visual Studio, right-click your service project, click **Set as StartUp Project**, and then press the **F5** key to build the project and start the mobile service locally.

	![](./media/mobile-services-dotnet-backend-test-local-service-dotnet/mobile-service-startup.png)

	A web page is displayed after the mobile service starts successfully.

3. To test the store app, right-click your client app project, click **Set as StartUp Project**, and then press the **F5** key to rebuild the project and start the app.

	This starts the app, which connects to the local mobile service instance.	

4. In the app, type meaningful text, such as _Complete the tutorial_, in **Insert a TodoItem**, and then click **Save**.

	This sends a POST request to the local mobile service. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile service, and the data is displayed in the second column in the app.