<properties
   pageTitle="Get stated with Microsoft Power BI Embedded preview"
   description=""
   services="power-bi-embedded"
   documentationCenter=""
   authors="dvana"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="powerbi-embedded"
   ms.devlang="NA"
   ms.topic="hero-article"
   ms.tgt_pltfrm="NA"
   ms.workload="power-bi-embedded"
   ms.date="03/08/2016"
   ms.author="derrickv"/>

# Get stated with Microsoft Power BI Embedded preview

Here are some resources to help you get started using Microsoft Power BI Embedded preview
-	Sample code
-	API docs
-	SDKs (available via NuGet)

Building applications using Power BI content will have four main phases:
1.	**Setup and Samples** – Setup your development environment and a sample application
2.	**Develop** - Create your application, including completing your app code and any desired Power BI content.
3.	**Provision/deploy** – Generally, you will build your application in a local/test development environment and will then need to deploy it to your production environment so customers can use your app.  Depending on your app model, you may have a separate instance of your application for each customer so may need to provision these instances at runtime.
4.	**Embed** – Once the app has been created and deployed for your customers, it is finally time for your end user to use it. Your application will need to render the reports within the user’s client securely.

Let’s take a high level look at the steps involved to get started with **Microsoft Power BI Embedded** preview.

## Step 1: Setup & Samples

The following will walk you through setting up your Visual Studio development environment to access the Preview components

1.	Download and unzip the powerbi-private-preview-sample-feb26.zip file.

  a.	Before you unzip, open the .zip file properties and check the **Unblock** box to prevent security warnings from Visual Studio later.

2.	Open **PowerBIPrivatePreview.sln** in Visual Studio 2015.
3.	Go to **Tools** > **Options** > **NuGet Package Manager**.

  a.	Add a new package source.

      - Name: Microsoft Power BI Embedded Private Preview

      - Source:
        - VS 2012-2013: https://www.myget.org/F/pbi/auth/575bf61d-bb2f-45d5-938e-0bfe003e1fd4/api/v2
        - VS 2015+: https://www.myget.org/F/pbi/auth/575bf61d-bb2f-45d5-938e-0bfe003e1fd4/api/v3/index.json
4.	Restore Nuget packages.
5.	Build solution.
6.	Run ProvisionSample console app.

    a.	Select option 3 to **Create a new workspace within existing collection**.

    b.	Enter your subscription id, workspace collection and signing key when prompted (provided to you as part of the Private Preview on-boarding process).

    c.	Copy and save the newly created workspace id to use later.

    d.	Import a PBIX file using option 4.

      - If prompted, provide the friendly name for your DataSet.

      - You should see a response like:

          - Checking import state... Publishing
          - Checking import state... Succeeded

  e.	If your PBIX file contains any direct query connections run option 5 to update the connection strings.

  f.	Select option 6 to retrieve the Embed URL that you should use to add the report to your application.

    - Save the Embed URL: to embed the report into your app.

    - Save the Embed token: this is to be used when requesting a report to be rendered.

7.	Open the web.config in the paas-demo web application within the same solution.

  a.	Add your signing key, workspace collection name and workspace ID to the appSettings section.

8.	Run the paas-demo web application.

  a.	Left nav should contain a “Reports” menu.

  b.	Click the Report (should match name of imported PBIX).

  c.	Report should now render within the main portion of the app window.

## Step 2: Develop
To get started, you will need to create a **Workspace Collection** within your Azure subscription via the ARM APIs. ARM APIs require Azure AD authentication.

### Using the Provisioning Sample to create Workspace Collection

**Workspace Collections** have been pre-provisioned for you in your Tenant for Private Preview so you do not need to do this step.  See the Appendix for instructions on how to do this if you are curious.

### Create Workspace

Call the Power BI REST APIs to create a new workspace passing it the workspace collection ID that was returned in the first call.  You will need to generate and use a Dev App Token to authenticate this call.  You will provide this App Token when calling the REST APIs.

**How to do this with the SDK**

    static async Task<Workspace> CreateWorkspace(string workspaceCollectionName)
    {
        // Create a provision token required to create a new workspace within your collection
        var provisionToken = PowerBIToken.CreateProvisionToken(workspaceCollectionName);
        using (var client = CreateClient(provisionToken))
        {
            // Create a new workspace witin the specified collection
            return await client.Workspaces.PostWorkspaceAsync(workspaceCollectionName);
        }
    }

Now that a workspace is created, you can start adding datasets and reports. For Private Preview, you will create these using the Power BI desktop app. Once complete, save your work to a PBIX file.

<a name="import"/>
### Import PBIX File
The PBIX file can now be uploaded to the service calling the Power BI Import API.  The result of this call will be a dataset ID, report ID and report embed URL. Save these values somewhere as they will be needed for future calls.  Specifically, you’ll need the EmbedURL value to embed the report in your application.  You can find the details on the **Import API** here: https://msdn.microsoft.com/en-us/library/mt243837.aspx.

**Upload PBIX file with the SDK**

    static async Task<Import> ImportPbix(string workspaceCollectionName, Guid workspaceId, string datasetName, string filePath)
    {
        using (var fileStream = File.OpenRead(filePath))
        {
            // Create a dev token for import
            var devToken = PowerBIToken.CreateDevToken(workspaceCollectionName, workspaceId);
            using (var client = CreateClient(devToken))
            {

                // Import PBIX file from the file stream
                var import = await client.Imports.PostImportWithFileAsync(fileStream, datasetName);

                // Example of polling the import to check when the import has succeeded.
                while (import.ImportState != "Succeeded" && import.ImportState != "Failed")
                {
                    import = client.Imports.GetImportById(import.Id);
                    Console.WriteLine("Checking import state... {0}", import.ImportState);
                    Thread.Sleep(1000);
                }

                return import;
            }
        }
    }

If the dataset that was in the PBIX file uses direct query, you will need to update the credentials so that it can connect back to its source. Use the Power BI Gateway API to set this credential.  Set a HTTP authorization header with type “AppToken” and value your acquired dev token.

**Update connection string with the SDK**

    var devToken = PowerBIToken.CreateDevToken(workspaceCollectionName, workspaceId);
    using (var client = CreateClient(devToken))
    {
        // Get the newly created dataset from the previous import process
        var datasets = await client.Datasets.GetDatasetsAsync();

        // Get the datasources from the dataset
        var datasources = await client.DatasetsCont.GetBoundGatewayDatasourcesByDatasetkeyAsync(datasets.Value[datasets.Value.Count - 1].Id);

        // Reset your connection credentials
        var delta = new GatewayDatasource
        {
            CredentialType = "Basic",
            BasicCredentials = new BasicCredentials
            {
                Username = username,
                Password = password
            }
        };

        // Update the datasource with the specified credentials
        await client.Gateways.PatchDatasourceByGatewayidAndDatasourceidAsync(datasources.Value[datasources.Value.Count - 1].GatewayId, datasources.Value[datasets.Value.Count - 1].Id, delta);
    }

Now you have a working report that can be embedded into your application using the embed URL received in [Import PBIX File](#import).

## Step 3: Provision/Deploy

You will now need to provision the application and associated resources for your end-user to use your application.  Depending on whether your app model is one instance for all customers, or one instance per customer, you may need to repeat this section n times.

The steps below assume you are provisioning a new instance of an application that will use its own Azure Web Sites, SQL Azure and Power BI “Embedded”.  However, for Private Preview we support direct query against any supported cloud source (that use basic auth). The steps below are for provisioning the Power BI resources into Azure only.

1.	Use the Azure ARM APIs to deploy your SQL Azure database and web sites to your Azure subscription.  You can find details on the Azure SQL Database REST AQPI here: https://msdn.microsoft.com/en-us/library/azure/mt163571.aspx.

2.	Use the Azure ARM and Power BI APIs to provision the workspace collection and workspace(s) you plan to use for running your customer-facing application. These are the same APIs as documented in Steps 1, 2 and 3 in the Develop section above.

3.	Use the Power BI Import API to import the PBIX file(s) containing your report and dataset.  The result of this call will be a dataset ID, report ID and embed URL.  Again, save these values somewhere as they will be needed for future calls.

  a.	If your datasets were developed against a test database, you need to change the connection strings to point to the new Azure SQL DB. This can be done by using the Power BI dataset/data source APIs as documented in the Develop section above.

4.	Use the gateway APIs to specify the credentials that these reports will use to talk to your SQL Azure DB as documented in the Develop section above.

## Step 4: Embed

Now that there is a fully provisioned application, an end-user can now go ahead and use your application. Your application code is running in the cloud and you have client code that is running in the end user’s browser. All user authentication and authorization must be handled by the application you create. The application that you build will need to have the experience for the user to navigate and find their reports. When your application needs to load the report, it will need to include an **App Auth Token** in your call to the Power BI service to authorize the report to be rendered.  The general flow is:
1.	The user clicks in the client application to view a Report.
2.	The client code sends a message to your service requesting an access token for the Report.
3.	Your service verifies the end user’s identity and whether the user has access to the requested Report.  If so, your service will generate the Embed App Token and include this when rendering the report by issuing the request to the Power BI service.
