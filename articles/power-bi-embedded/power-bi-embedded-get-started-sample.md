<properties
   pageTitle="Get stated with sample"
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
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="power-bi-embedded"
   ms.date="03/08/2016"
   ms.author="derrickv"/>

# Get started with Microsoft Power BI Embedded sample code

Here are some resources to help you get started using **Microsoft Power BI Embedded** preview:

 -	Sample code
 -	API docs
 -	SDKs (available via NuGet)

Let’s take a high level look at the steps involved to get started with the sample applications.

> [AZURE.NOTE] Before starting, make sure that you have created at least one Workspace Collection in your Azure subscription. To learn how to create a Workspace Collection in the Azure Portal see [Getting Started with Power BI Embedded Preview](power-bi-embedded-get-started.md).

## Setup and Samples

The following will walk you through setting up your Visual Studio development environment to access the Preview components

1. Download and unzip the [PowerBI-embedded.zip](http://go.microsoft.com/fwlink/?LinkId=761493) file.

2. Open **PowerBIPrivatePreview.sln** in Visual Studio.

3. Build solution.

4. Run ProvisionSample console app.

    ![](media\powerbi-embedded-get-started-sample\console.png)

    a.	Select option 5 to **Create a new workspace within existing collection**.

    <a name="keys"/>
    b.	Enter your subscription id, workspace collection and signing key when prompted (These can be found in the Azure portal). To learn about the app token key flow, see [How does app token flow work?](#key-flow).

    ![](media\powerbi-embedded-get-started-sample\azure-portal.png)

    c.	Copy and save the newly created workspace id to use later (this can also be found in the Azure portal after it is created).

    d.	Import a PBIX file using option 6.

    - If prompted, provide the friendly name for your DataSet. You should see a response like:

      - Checking import state... Publishing
      - Checking import state... Succeeded

    e.	If your PBIX file contains any direct query connections run option 7 to update the connection strings.

    f.	Select option 8 to retrieve the Embed URL that you should use to add the report to your application.

5.	In **web.config** in the paas-demo web application within the same solution.

    a.	Add your **SigningKey**, **WorkspaceCollection** name and **WorkspaceId** to the appSettings section.

    ```
    <appSettings>
        <add key="powerbi:SigningKey" value="" />
        <add key="powerbi:ApiUrl" value="https://api.powerbi.com" />
        <add key="powerbi:WorkspaceCollection" value="" />
        <add key="powerbi:WorkspaceId" value="" />
    </appSettings>
    ```

6.	Run the paas-demo web application.

    a.	Left nav should contain a “Reports” menu.

    b.	Click the Report (should match name of imported PBIX).

    c.	Report should now render within the main portion of the app window.

    ![](media\powerbi-embedded-get-started-sample\report.png)

<a name="key-flow"/>
## How does app token flow work?

The Power BI Embedded service uses App Tokens for authentication and authorization instead of explicit end-user authentication.  In the App Token model, your application manages authentication and authorization for your end-users.  Then, when necessary, your app creates and sends the App Tokens which tells our service to render the requested report. This design does not require your app to use Azure Active Directory for user authentication and authorization, although you can do this.

**Here's how the app token key flow works**

1.	Copy the API keys to your application. You can get the keys in Azure portal, see [Enter your subscription id, workspace collection and signing key above](#keys).

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-1.png)

2. The token asserts a claim and has an expiration time.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-2.png)

3. Token gets signed with API access keys.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-3.png)

4. User requests to view a Report.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-4.png)

5.	Token is validated with API access keys.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-5.png)

6.	Power BI sends report to user.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-6.png)

The next section explores the Power BI Embedded sample code.

## Explore the sample code
The **Microsoft Power BI Embedded** preview sample is an example dashboard web app that shows how to integrate **Power BI** reports. It has a Model-View-Controller (MVC) design pattern to demonstrates best practices. This section will highlight parts of the sample code that you can explore within the web app solution.

First, some background about the Model-View-Controller (MVC) design pattern.

The Model-View-Controller (MVC) pattern separates the modeling of the domain, the presentation, and the actions based on user input into three separate classes [Burbeck92]:

- **Model**: The model manages the behavior and data of the application domain, responds to requests for information about its state (usually from the view), and responds to instructions to change state (usually from the controller).

- **View**: The view manages the display of information.

- **Controller**: The controller interprets the mouse inputs from the user, informing the model and/or the view to change as appropriate.

With the Model-View-Controller (MVC) design pattern in mind, the **Microsoft Power BI Embedded** preview sample code is separated as follows. Each section includes the file name in the PowerBI-embedded.sln solution.

> [AZURE.NOTE] This section is a summary of the sample code which shows how the code was written. We will expand the description of the sample as we move towards General Availability (GA). To view the complete sample, please load the PowerBI-embedded.sln solution in Visual Studio.

### Model
The sample has a **ReportsViewModel** and **ReportViewModel**.

**ReportsViewModel.cs**: Represents Power BI Reports.

    public class ReportsViewModel
    {
        public List<Report> Reports { get; set; }
    }

**ReportViewModel.cs**: Represents a Power BI Report.

    public classReportViewModel
    {
        public IReport Report { get; set; }

        public string AccessToken { get; set; }
    }

### View
The **View** manages the display of Power BI **Reports** and a Power BI **Report**.

**Reports.cshtml**: Iterate over **Model.Reports** to create an **ActionLink**. The **ActionLink** is composed as follows:

|Part|Description
|-|-
|Title| Name of the Report.
|QueryString| A link to the Report ID.

    <div id="reports-nav" class="panel-collapse collapse">
        <div class="panel-body">
            <ul class="nav navbar-nav">
                @foreach (var report in Model.Reports)
                {
                    var reportClass = Request.QueryString["reportId"] == report.Id ? "active" : "";
                    <li class="@reportClass">
                        @Html.ActionLink(report.Name, "Report", new { reportId = report.Id })
                    </li>
                }
            </ul>
        </div>
    </div>

Report.cshtml: Set the **Model.AccessToken**, and the Lambda expression for **PowerBIReportFor**.

    @model ReportViewModel

    ...

    <div class="side-body padding-top">
        @Html.PowerBIAccessToken(Model.AccessToken)
        @Html.PowerBIReportFor(m => m.Report, new { style = "height:85vh" })
    </div>

### Controller

**DashboardController.cs**: Create a PowerBIClient passing an **app token**. A JSON Web Token (JWT) is generate from the **Signing Key** to get the **Credentials**. The **Credentials** are used to create an instance of **PowerBIClient**. For more about **app tokens**, see [How does app token flow work?](#key-flow). Once you have an instance of **PowerBIClient**, you can call GetReports() and GetReportsAsync().

CreatePowerBIClient()

    private IPowerBIClient CreatePowerBIClient(PowerBIToken token)
    {
        var jwt = token.Generate(signingKey);
        var credentials = new TokenCredentials(jwt, "AppToken");
        var client = new PowerBIClient(credentials)
        {
            BaseUri = new Uri(apiUrl)
        };

        return client;
    }

ActionResult Reports()

    public ActionResult Reports()
    {
        var devToken = PowerBIToken.CreateDevToken(this.workspaceCollection, this.workspaceId);
        using (var client = this.CreatePowerBIClient(devToken))
        {
            var reportsResponse = client.Reports.GetReports(this.workspaceCollection, this.workspaceId.ToString());

            var viewModel = new ReportsViewModel
            {
                Reports = reportsResponse.Value.ToList()
            };

            return PartialView(viewModel);
        }
    }


Task<ActionResult> Report(string reportId)

    public async Task<ActionResult> Report(string reportId)
    {
        var devToken = PowerBIToken.CreateDevToken(this.workspaceCollection, this.workspaceId);
        using (var client = this.CreatePowerBIClient(devToken))
        {
            var reportsResponse = await client.Reports.GetReportsAsync(this.workspaceCollection, this.workspaceId.ToString());
            var report = reportsResponse.Value.FirstOrDefault(r => r.Id == reportId);
            var embedToken = PowerBIToken.CreateReportEmbedToken(this.workspaceCollection, this.workspaceId, Guid.Parse(report.Id));

            var viewModel = new ReportViewModel
            {
                Report = report,
                AccessToken = embedToken.Generate(this.signingKey)
            };

            return View(viewModel);
        }
    }

### Integrate a report into your app

Once you have a **Report**, you use an **IFrame** to embed the Power BI **Report**. Here is a code snippet from the powerbi.js in the **Microsoft Power BI Embedded** preview sample.

    var embedUrl = this.getEmbedUrl();
    var iframeHtml = '&lt;iframe style="width:100%;height:100%;" src="' + embedUrl + '" scrolling="no" allowfullscreen="true"&gt;&lt;/iframe&gt;';

TODO: Add more detail

## See also

- [What is Microsoft Power BI Embedded](power-bi-embedded-what-is-power-bi-embedded.md)
- [Power BI Embedded JavaScript API](power-bi-embedded-javascript-api.md)


[Burbeck92] Burbeck, Steve. "Application Programming in Smalltalk-80: How to use Model-View-Controller (MVC)."University of Illinois in Urbana-Champaign (UIUC) Smalltalk Archive. Available at: http://st-www.cs.illinois.edu/users/smarch/st-docs/mvc.html.
