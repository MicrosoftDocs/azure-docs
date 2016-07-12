<properties
   pageTitle="Microsoft Power BI Embedded - Embed a Power BI report with an IFrame"
   description="Microsoft Power BI Embedded - Essential code to integrate a report into your app, how to authenticate with Power BI Embedded app token, how to get reports"
   services="power-bi-embedded"
   documentationCenter=""
   authors="minewiskan"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="power-bi-embedded"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="powerbi"
   ms.date="07/05/2016"
   ms.author="owend"/>

# Embed a Power BI report with an IFrame
This article shows you essential code to use the **Power BI Embedded** REST API, app tokens, an IFrame, and some JavaScript to integrate, or embed, a report into your app.

In [Get started with Microsoft Power BI Embedded](power-bi-embedded-get-started.md), you learn how to configure a **Workspace Collection** to hold one or more **Workspaces** for your report content. Then, in [Get started with Microsoft Power BI Embedded sample](power-bi-embedded-get-started-sample.md) you import a report into a **Workspace**.

In this article,  we'll go through the steps to embed a report into your app. To follow along with this article, you should download the [Integrate a report with an IFrame](https://github.com/Azure-Samples/power-bi-embedded-iframe) sample on GitHub. This sample is a simple ASP.NET web form app intended to illustrate essential C# and JavaScript code you need to integrate a report. For a more advanced sample that uses the Model-View-Controller (MVC) design pattern to integrate a report, see the [Sample dashboard web app](http://go.microsoft.com/fwlink/?LinkId=761493) on GitHub.

To integrate a report, here are the steps we'll go through:

- Step 1: [Get a report in a workspace](#GetReport). In this step, you use an app token flow to get an access token to call the [Get Reports](https://msdn.microsoft.com/library/mt711510.aspx) REST operation. Once you get a report from the **Get Reports** list, you embed the report into an app with an **IFrame** element.
- Step 2: [Embed a report into an app](#EmbedReport). In this step, you use an embed token for a report, some JavaScript, and an IFrame to integrate, or embed, a report into a web app.

If you want to run the sample, download the [Integrate a report with an IFrame](https://github.com/Azure-Samples/power-bi-embedded-iframe) sample on GitHub, and configure three Web.Config settings:

- **AccessKey**: An **AccessKey** is used to generate a JSON Web Token (JWT) which is used to get reports and embed a report.
- **Workspace Collection Name**: Identifies the workspace.
- **Workspace Id**: A unique ID for the workspace

To learn how to get an Access Key, Workspace Collection Name, and Workspace Id from Azure Portal, see [Get started with Microsoft Power BI Embedded](power-bi-embedded-get-started.md).

<a name="GetReport"/>
## Get a report in a workspace

To integrate a report into an app, you need a report **ID** and **embedUrl**. To get them, you call the [Get Reports](https://msdn.microsoft.com/library/mt711510.aspx) REST operation, and choose a report from the JSON list.

### Get reports JSON response
```
{
  "@odata.context":"https://api.powerbi.com/v1.0/collections/{WorkspaceName}/workspaces/{WorkspaceId}/$metadata#reports","value":[
    {
      "id":"804d3664-…-e71882055dba","name":"Import report sample","webUrl":"https://embedded.powerbi.com/reports/804d3664-...-e71882055dba","embedUrl":"https://embedded.powerbi.com/appTokenReportEmbed?reportId=804d3664-...-e71882055dba"
    },{
      "id":"1d7cff58-…-380610e263a9","name":"Sample Report 2","webUrl":"https://embedded.powerbi.com/reports/1d7cff58-...-380610e263a9","embedUrl":"https://embedded.powerbi.com/appTokenReportEmbed?reportId=1d7cff58-...-380610e263a9"
    }
  ]
}

```

To call the [Get Reports](https://msdn.microsoft.com/library/mt711510.aspx) REST operation, you'll use an app token. To learn more about the app token flow, see [Authenticating and authorizing with Power BI Embedded](power-bi-embedded-app-token-flow.md). The following code describes how to get a JSON list of reports.

```
protected void getReportsButton_Click(object sender, EventArgs e)
{
    //Get an app token to generate a JSON Web Token (JWT). An app token flow is a claims-based design pattern.
    //To learn how you can code an app token flow to generate a JWT, see the PowerBIToken class.
    var appToken = PowerBIToken.CreateDevToken(workspaceName, workspaceId);

    //After you get a PowerBIToken which has Claims including your WorkspaceName and WorkspaceID,
    //you generate JSON Web Token (JWT) . The Generate() method uses classes from System.IdentityModel.Tokens: SigningCredentials,
    //JwtSecurityToken, and JwtSecurityTokenHandler.
    string jwt = appToken.Generate(accessKey);

    //Set app token textbox to JWT string to show that the JWT was generated
    appTokenTextbox.Text = jwt;

    //Construct reports uri resource string
    var uri = String.Format("https://api.powerbi.com/v1.0/collections/{0}/workspaces/{1}/reports", workspaceName, workspaceId);

    //Configure reports request
    System.Net.WebRequest request = System.Net.WebRequest.Create(uri) as System.Net.HttpWebRequest;
    request.Method = "GET";
    request.ContentLength = 0;

    //Set the WebRequest header to AppToken, and jwt
    //Note the use of AppToken instead of Bearer
    request.Headers.Add("Authorization", String.Format("AppToken {0}", jwt));

    //Get reports response from request.GetResponse()
    using (var response = request.GetResponse() as System.Net.HttpWebResponse)
    {
        //Get reader from response stream
        using (var reader = new System.IO.StreamReader(response.GetResponseStream()))
        {
            //Deserialize JSON string into PBIReports
            PBIReports PBIReports = JsonConvert.DeserializeObject<PBIReports>(reader.ReadToEnd());

            //Clear Textbox
            tb_reportsResult.Text = string.Empty;

            //Get each report
            foreach (PBIReport rpt in PBIReports.value)
            {
                tb_reportsResult.Text += String.Format("{0}\t{1}\t{2}\n", rpt.id, rpt.name, rpt.embedUrl);
            }
        }
    }
}
```

<a name="EmbedReport"/>
## Embed a report into an app

Before you can embed a report into your app, you need an embed token for a report. This token is similar to an app token used to call Power BI Embedded REST operations, but is generated for a report resource rather than a REST resource. The following is the code to get an app token for a report.

<a name="EmbedReportToken"/>
### Get an app token for a report

```
protected void getReportAppTokenButton_Click(object sender, EventArgs e)
{
    //Get an embed token for a report.
    var token = PowerBIToken.CreateReportEmbedToken(workspaceName, workspaceId, getReportAppTokenTextBox.Text);

    //After you get a PowerBIToken which has Claims including your WorkspaceName and WorkspaceID,
    //you generate JSON Web Token (JWT) . The Generate() method uses classes from System.IdentityModel.Tokens: SigningCredentials,
    //JwtSecurityToken, and JwtSecurityTokenHandler.
    string jwt = token.Generate(accessKey);

    //Set textbox to JWT string. The JavaScript embed code uses the embed jwt for a report.
    reportAppTokenTextbox.Text = jwt;
}
```

<a name="EmbedReportJS"/>
### Embed report into your app

To embed a **Power BI** report into you app, you use an IFrame and some JavaScript code. The following is an example IFrame, and JavaScript code to embed a report. To see all of the sample code to embed a report, see [Integrate a report with an IFrame](https://github.com/Azure-Samples/power-bi-embedded-iframe) sample on GitHub.

![Iframe](media\power-bi-embedded-integrate-report\Iframe.png)


```
window.onload = function () {
    // Client side click to embed a selected report.
    var el = document.getElementById("bEmbedReportAction");
    if (el.addEventListener) {
        el.addEventListener("click", updateEmbedReport, false);
    } else {
        el.attachEvent('onclick', updateEmbedReport);
    }

};

// Update embed report
function updateEmbedReport() {
    // Check if the embed url was selected
    var embedUrl = document.getElementById('tb_EmbedURL').value;

    // To load a report do the following:
    // 1: Set the url
    // 2: Add a onload handler to submit the auth token
    var iframe = document.getElementById('iFrameEmbedReport');
    iframe.src = embedUrl;
    iframe.onload = postActionLoadReport;
}

// Post the auth token to the iFrame.
function postActionLoadReport() {

    // Get the app token.
    accessToken = document.getElementById('MainContent_reportAppTokenTextbox').value;

    // Construct the push message structure
    var m = { action: "loadReport", accessToken: accessToken };
    message = JSON.stringify(m);

    // Push the message.
    iframe = document.getElementById('iFrameEmbedReport');
    iframe.contentWindow.postMessage(message, "*");
}
```
After you have a report embedded into your app, you can filter the report. The next section shows you how to filter a report using a URL syntax.

## Filter a report

You can filter an embedded report using a URL syntax. To do this, you add a query string parameter to your iFrame src url with the filter specified. You can  **Filter by a value** and **Hide the Filter Pane**.


**Filter by a value**

To filter by a value, you use a **$filter** query syntax with an **eq** operator as follows:

```
https://app.powerbi.com/reportEmbed
?reportId=d2a0ea38-0694-...-ee9655d54a4a&
$filter={tableName/fieldName}%20eq%20'{fieldValue}'
```

For example, you could filter where the Store Chain is 'Lindseys'. The filter part of the url would look like this:

```
$filter=Store/Chain%20eq%20'Lindseys'
```

> [AZURE.NOTE] {tableName/fieldName} cannot include spaces or special characters. The {fieldValue} accepts a single categorical value.

**Hide the Filter Pane**

To hide the **Filter Pane**, you add **filterPaneEnabled** to the report query string as follows:

```
&filterPaneEnabled=false
```

## Additional resources

In this article, you were introduced to the code to integrate a **Power BI** report into your app. Be sure to check out these additional samples on GitHub:

- [Integrate a report with an IFrame sample](https://github.com/Azure-Samples/power-bi-embedded-iframe)
- [Sample dashboard web app](http://go.microsoft.com/fwlink/?LinkId=761493)

## See Also
- [System.IdentityModel.Tokens.SigningCredentials](https://msdn.microsoft.com/library/system.identitymodel.tokens.signingcredentials.aspx)
- [System.IdentityModel.Tokens.JwtSecurityToken](https://msdn.microsoft.com/library/system.identitymodel.tokens.jwtsecuritytoken.aspx)
- [System.IdentityModel.Tokens.JwtSecurityTokenHandler](https://msdn.microsoft.com/library/system.identitymodel.tokens.signingcredentials.aspx)
