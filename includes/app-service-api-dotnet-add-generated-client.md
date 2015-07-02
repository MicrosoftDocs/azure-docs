3. In **Solution Explorer**, right-click the project (not the solution) and select **Add > Azure API App Client**. 

	![](./media/app-service-api-dotnet-add-generated-client/03-add-azure-api-client-v3.png)
	
3. In the **Add Azure API App Client** dialog, click **Download from Azure API App**. 

5. From the drop-down list, select the API app that you want to call. 

7. Click **OK**. 

	![Generation Screen](./media/app-service-api-dotnet-add-generated-client/04-select-the-api-v3.png)

	The wizard downloads the API metadata file and generates a typed interface for calling the API app.

	![Generation Happening](./media/app-service-api-dotnet-add-generated-client/05-metadata-downloading-v3.png)

	Once code generation is complete, you see a new folder in **Solution Explorer**, with the name of the API app. This folder contains the code that implements the client classes and data models. 

	![Generation Complete](./media/app-service-api-dotnet-add-generated-client/06-code-gen-output-v3.png)
