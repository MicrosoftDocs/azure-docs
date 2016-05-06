<properties
   pageTitle="Get started with sample"
   description=""
   services="power-bi-embedded"
   documentationCenter=""
   authors="dvana"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="power-bi-embedded"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="powerbi"
   ms.date="03/29/2016"
   ms.author="derrickv"/>

# Get started with Microsoft Power BI Embedded sample code

Here are some resources to help you get started using **Microsoft Power BI Embedded** preview:

 -	Sample code. See [Power BI Embedded - Integrate a report into a web app](http://go.microsoft.com/fwlink/?LinkId=761493).
 -	API docs. See [Power BI Embedded API](https://msdn.microsoft.com/library/mt711493.aspx).
 -	SDKs (available via NuGet). See [Power BI Embedded SDK](http://go.microsoft.com/fwlink/?LinkId=746472).

Let’s take a high level look at the steps involved to get started with the sample applications.

> [AZURE.NOTE] Before starting, make sure that you have created at least one Workspace Collection in your Azure subscription. To learn how to create a Workspace Collection in the Azure Portal see [Getting Started with Power BI Embedded Preview](power-bi-embedded-get-started.md).

## Setup and Samples

The following will walk you through setting up your Visual Studio development environment to access the Preview components.

1. Download and unzip the [Power BI Embedded - Integrate a report into a web app](http://go.microsoft.com/fwlink/?LinkId=761493) sample on GitHub.

2. Open **PowerBI-embedded.sln** in Visual Studio.

3. Build the solution.

4. Run the **ProvisionSample** console app.

    ![](media\powerbi-embedded-get-started-sample\console.png)

    a.	Select option 5 to **Provision a new workspace in an existing workspace collection**.

    <a name="keys"/>
    b.	Enter your subscription id, workspace collection and access key when prompted (These can be found in the Azure Portal). To learn about the app token key flow, see [How does app token flow work?](#key-flow).

    ![](media\powerbi-embedded-get-started-sample\azure-portal.png)

    c.	Copy and save the newly created workspace id to use later (this can also be found in the Azure Portal after it is created).

    d.	Select option 6 to **Import PBIX Desktop file into an existing workspace**.

    - If prompted, select a friendly name for your **Dataset**. You should see a response like:

      - Checking import state... Publishing
      - Checking import state... Succeeded

    e.	If your PBIX file contains any direct query connections, run option 7 to update the connection strings.

5.	In **web.config** in the **EmbedSample** web application, edit the **appSettings** as follows:

    a.	Add your **AccessKey**, **WorkspaceCollection** name, and **WorkspaceId** to the appSettings section.

    ```
    <appSettings>
        <add key="powerbi:AccessKey" value="" />
        <add key="powerbi:ApiUrl" value="https://api.powerbi.com" />
        <add key="powerbi:WorkspaceCollection" value="" />
        <add key="powerbi:WorkspaceId" value="" />
    </appSettings>
    ```

6.	Run the **EmbedSample** web application.

    a.	The left navigation panel in the sample web app should contain a **Reports** menu.

    b.	Click **Report** which should match the name of the imported PBIX file.

    c.	A report should  render within the main portion of the web app window.

    ![](media\powerbi-embedded-get-started-sample\report.png)

<a name="key-flow"/>
## How does app token flow work?

The **Power BI Embedded** service uses **App Tokens** for authentication and authorization instead of explicit end-user authentication.  In the **App Token** model, your application manages authentication and authorization for your end-users.  When necessary, your app creates and sends the **App Tokens** that tells our service to render the requested report. This design does not require your app to use **Azure Active Directory** for user authentication and authorization, although you can do this.

**Here's how the app token key flow works**

1. Copy the API keys to your application. You can get the keys in **Azure Portal**, see [Enter your subscription id, workspace collection and signing key above](#keys).

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-1.png)

2. Token asserts a claim and has an expiration time.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-2.png)

3. Token gets signed with an API access keys.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-3.png)

4. User requests to view a report.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-4.png)

5.	Token is validated with an API access keys.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-5.png)

6.	Power BI sends a report to user.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-6.png)

The next section explores the Power BI Embedded sample code.

## Explore the sample code
The **Microsoft Power BI Embedded** preview sample is an example dashboard web app that shows how to integrate **Power BI** reports. It has a Model-View-Controller (MVC) design pattern to demonstrates best practices. This section will highlight parts of the sample code that you can explore within the web app solution. The Model-View-Controller (MVC) pattern separates the modeling of the domain, the presentation, and the actions based on user input into three separate classes: Model, View, and Control. To learn more about MVC, see [Learn About ASP.NET](http://www.asp.net/mvc).

The **Microsoft Power BI Embedded** preview sample code is separated as follows. Each section includes the file name in the PowerBI-embedded.sln solution so that you can easily find the code in the sample.

> [AZURE.NOTE] This section is a summary of the sample code that shows how the code was written. We will expand the description of the sample as we move towards General Availability (GA). To view the complete sample, please load the PowerBI-embedded.sln solution in Visual Studio.

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

**DashboardController.cs**: Creates a PowerBIClient passing an **app token**. A JSON Web Token (JWT) is generated from the **Signing Key** to get the **Credentials**. The **Credentials** are used to create an instance of **PowerBIClient**. For more about **app tokens**, see [How does app token flow work?](#key-flow). Once you have an instance of **PowerBIClient**, you can call GetReports() and GetReportsAsync().

CreatePowerBIClient()

    private IPowerBIClient CreatePowerBIClient(PowerBIToken token)
    {
        var jwt = token.Generate(accessKey);
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
            var reportsResponse = client.Reports.GetReports(this.workspaceCollection, this.workspaceId);

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
            var reportsResponse = await client.Reports.GetReportsAsync(this.workspaceCollection, this.workspaceId);
            var report = reportsResponse.Value.FirstOrDefault(r => r.Id == reportId);
            var embedToken = PowerBIToken.CreateReportEmbedToken(this.workspaceCollection, this.workspaceId, Guid.Parse(report.Id));

            var viewModel = new ReportViewModel
            {
                Report = report,
                AccessToken = embedToken.Generate(this.accessKey)
            };

            return View(viewModel);
        }
    }

### Integrate a report into your app

Once you have a **Report**, you use an **IFrame** to embed the Power BI **Report**. Here is a code snippet from  powerbi.js in the **Microsoft Power BI Embedded** preview sample.

![](media\powerbi-embedded-get-started-sample\power-bi-embedded-iframe-code.png)

## See also

- [What is Microsoft Power BI Embedded](power-bi-embedded-what-is-power-bi-embedded.md)
- [Common Microsoft Power BI Embedded Preview scenarios](power-bi-embedded-scenarios.md)
- [Get started with Microsoft Power BI Embedded Preview](power-bi-embedded-get-started.md)
