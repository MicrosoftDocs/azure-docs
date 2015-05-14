

By default, all requests to App Service Mobile App resources are restricted to clients that present the application key, which does not strictly secure access to resources. To secure your resources, you need to restrict access to authenticated clients only.

1. In Visual Studio, open the project that contains your Mobile App code. 

2. In Solution Explorer, expand the Controllers folder and open the TodoItemController.cs project file.

	The **TodoItemController** class implements data access for the TodoItem table. 

3. Add the following `using` statement at the top of the code page:

		using Microsoft.Azure.Mobile.Security;

4. Apply the following AuthorizeLevel attribute to the **TodoItemController** class:

		[AuthorizeLevel(AuthorizationLevel.User)] 

	This will ensure that all operations against the **TodoItem** table require an authenticated user. 

	>[AZURE.NOTE]Apply the AuthorizeLevel attribute to individual methods to set specific authorization levels on the methods exposed by the controller.

5. If you wish to debug authentication locally, expand the App_Start folder, open the WebApiConfig.cs project file, then add the following code to the **Register** method:

		config.SetIsHosted(true);
	
	This tells the local project to run as if it is being hosted in Azure, including honoring the AuthorizeLevel settings. Without this setting, all HTTP requests to *localhost* are permitted without authentication despite the AuthorizeLevel setting.  

6. Republish your mobile app project.

