
1. Back in the Mobile App backend settings, scroll down to **Mobile**, click **Get started** > your client platform. 

2. Under **Create a table API**, select your **Backend language**, either **C#** or **Node.js**:

	+ **Node.js backend** (via portal):  
	Accept the acknowledgment and click **Create TodoItem table**. This creates a new *TodoItem* table in your database.
	 
		>[AZURE.IMPORTANT] Switching an existing app backend to Node.js will overwrite all site contents.

	+ **.NET backend (C#)**:  
	Click **Download**, extract the compressed project files to your local computer, open the solution in Visual Studio, build the project to restore the NuGet packages, then deploy the project to Azure. To learn how to deploy a .NET backend server project to Azure, see the *Deploy the project to the web app* section of  [Create an ASP.NET web app in Azure App Service](../articles/app-service-web/web-sites-dotnet-get-started.md#deploy-the-project-to-the-web-app). In App Service, a Mobile App backend is equivalent to a Web app.
	 
You Mobile App backend is now ready to use with your client app.
