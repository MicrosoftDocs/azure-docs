<properties
   pageTitle="How to use Power BI Embedded with REST"
   description="Learn how to use Power BI Embedded with REST "
   services="power-bi-embedded"
   documentationCenter=""
   authors="minewiskan"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="power-bi-embedded"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="powerbi"
   ms.date="07/20/2016"
   ms.author="owend"/>

# How to use Power BI Embedded with REST
By: Tsuyoshi Matsuzaki, Technical Evangelist, Microsoft, Tokyo


## Power BI Embedded: What it is and what it's for
An overview of Power BI Embedded is described in the official [Power BI Embedded site](https://azure.microsoft.com/services/power-bi-embedded/), but let's take a quick look before we get into the details about using it with REST.

It's quite simple, really. An ISV \(or Cloud Solution Vendor, CSV) often wants to use the dynamic data visualizations of [Power BI](https://powerbi.microsoft.com) in their own application as UI building blocks.

But, you know, embedding Power BI reports or tiles into your web page is already possible without the Power BI Embedded Azure service, by using the **Power BI API**. When you want to share your reports in your same organization, you can embed the reports with Azure AD authentication. The user who views the reports must login using their own Azure AD account. When you want to share your reports for all users (including external users), you can simply embed with anonymous access.

But you see, this simple embed solution doesn’t quite meet the needs of an ISV application.
Most ISV (or CSV) applications need to deliver the data for their own customers, not necessarily users in their own organization. For example, if you're delivering some service for both company A and company B, users in company A should only see data for their own company A. That is, the multi-tenancy is needed for the delivery.

The ISV application might also be offering its own authentication methods such as forms auth, basic auth, etc.. Then, the embedding solution must collaborate with this existing authentication methods safely. It's also necessary for users to be able to use those ISV applications without the extra purchase or licensing of a Power BI subscription.

 **Power BI Embedded** is designed for precisely these kinds of ISV, CSV scenarios. So now that we have that quick introduction out of the way, let's get into some details

You can use .NET \(C#) or Node.js SDK, to easily build your application with Power BI Embedded. But, in this article, we'll explain about HTTP flow \(incl. AuthN) of Power BI without SDKs. Understanding this flow, you can build your application **with any programming language**, and you can understand deeply the essence of Power BI Embedded.

## Create Power BI workspace collection, and get access key \(Provisioning)
Power BI Embedded is one of the Azure services. Only the ISV who uses Azure Portal is charged for usage fees \(per hourly user session), and the user who views the report isn't charged or even require an Azure subscription.
Before starting our application development, we must create the **Power BI workspace collection** by using Azure Portal.

Each workspace of Power BI Embedded is the workspace for each customer (tenant), and we can add many workspaces in each workspace collection. The same access key is used in each workspace collection. In-effect, the workspace collection is the security boundary for Power BI Embedded.

![](media\power-bi-embedded-how-to-with-rest\create-workspace.png)

When we finish creating the workspace collection, copy the access key from Azure Portal.

![](media\power-bi-embedded-how-to-with-rest\copy-access-key.png)

**Note:** We can also provision the workspace collection and get access key via REST API.
 To learn more, see [Power BI Resource Provider APIs](https://msdn.microsoft.com/library/azure/mt712306.aspx)

## Create .pbix file with Power BI Desktop
Next, we must create the data connection and reports to be embedded.
For this task, there’s no programming or code. We just use Power BI Desktop.
In this article, we won't go through the details about how to use Power BI Desktop. If you need some help here, see [Getting started with Power BI Desktop](https://powerbi.microsoft.com/documentation/powerbi-desktop-getting-started/). For our example, we'll just use the [Retail Analysis Sample](https://powerbi.microsoft.com/documentation/powerbi-sample-datasets/).

![](media\power-bi-embedded-how-to-with-rest\power-bi-desktop-1.png)

## Create a Power BI workspace

Now that the provisioning is all done, let’s get started creating a customer’s workspace in the workspace collection via REST APIs. The following HTTP POST Request (REST) is creating the new workspace in our existing workspace collection. In our example, the workspace collection name is **mypbiapp**.
We just set the access key, which we previously copied, as **AppKey**. It’s very simple authentication!

**HTTP Request**
```
POST https://api.powerbi.com/v1.0/collections/mypbiapp/workspaces
Authorization: AppKey MpaUgrTv5e...
```

**HTTP Response**
```
HTTP/1.1 201 Created
Content-Type: application/json; odata.metadata=minimal; odata.streaming=true
Location: https://wabi-us-east2-redirect.analysis.windows.net/v1.0/collections/mypbiapp/workspaces
RequestId: 4220d385-2fb3-406b-8901-4ebe11a5f6da

{
  "@odata.context": "http://wabi-us-east2-redirect.analysis.windows.net/v1.0/collections/mypbiapp/$metadata#workspaces/$entity",
  "workspaceId": "32960a09-6366-4208-a8bb-9e0678cdbb9d",
  "workspaceCollectionName": "mypbiapp"
}
```

The returned **workspaceId** is used for the following subsequent API calls. Our application must retain this value.

## Import .pbix file into the workspace
Each workspace can host a single Power BI Desktop file with a dataset \(including datasource settings) and reports. We can import our .pbix file to the workspace as shown in the code below. As you can see, we can upload the binary of .pbix file using MIME multipart in http.

The uri fragment **32960a09-6366-4208-a8bb-9e0678cdbb9d** is the workspaceId, and query parameter **datasetDisplayName** is the dataset name to create. The created dataset holds all data related artifacts in .pbix file such as imported data, the pointer to the data source, etc..

```
POST https://api.powerbi.com/v1.0/collections/mypbiapp/workspaces/32960a09-6366-4208-a8bb-9e0678cdbb9d/imports?datasetDisplayName=mydataset01
Authorization: AppKey MpaUgrTv5e...
Content-Type: multipart/form-data; boundary="A300testx"

--A300testx
Content-Disposition: form-data

{the content (binary) of .pbix file}
--A300testx--
```

This import task might run for a while. When complete, our application can ask the task status using import id. In our example, the import id is **4eec64dd-533b-47c3-a72c-6508ad854659**.

```
HTTP/1.1 202 Accepted
Content-Type: application/json; charset=utf-8
Location: https://wabi-us-east2-redirect.analysis.windows.net/v1.0/collections/mypbiapp/workspaces/32960a09-6366-4208-a8bb-9e0678cdbb9d/imports/4eec64dd-533b-47c3-a72c-6508ad854659?tenantId=myorg
RequestId: 658bd6b4-b68d-4ec3-8818-2a94266dc220

{"id":"4eec64dd-533b-47c3-a72c-6508ad854659"}
```

The following is asking status using this import id:
```
GET https://api.powerbi.com/v1.0/collections/mypbiapp/workspaces/32960a09-6366-4208-a8bb-9e0678cdbb9d/imports/4eec64dd-533b-47c3-a72c-6508ad854659
Authorization: AppKey MpaUgrTv5e...
```

If the task isn't complete, the HTTP response could be like this:
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
RequestId: 614a13a5-4de7-43e8-83c9-9cd225535136

{
  "id": "4eec64dd-533b-47c3-a72c-6508ad854659",
  "importState": "Publishing",
  "createdDateTime": "2016-07-19T07:36:06.227",
  "updatedDateTime": "2016-07-19T07:36:06.227",
  "name": "mydataset01"
}
```

If the task is complete, the HTTP response could be more like this:
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
RequestId: eb2c5a85-4d7d-4cc2-b0aa-0bafee4b1606

{
  "id": "4eec64dd-533b-47c3-a72c-6508ad854659",
  "importState": "Succeeded",
  "createdDateTime": "2016-07-19T07:36:06.227",
  "updatedDateTime": "2016-07-19T07:36:06.227",
  "reports": [
    {
      "id": "2027efc6-a308-4632-a775-b9a9186f087c",
      "name": "mydataset01",
      "webUrl": "https://app.powerbi.com/reports/2027efc6-a308-4632-a775-b9a9186f087c",
      "embedUrl": "https://app.powerbi.com/appTokenReportEmbed?reportId=2027efc6-a308-4632-a775-b9a9186f087c"
    }
  ],
  "datasets": [
    {
      "id": "458e0451-7215-4029-80b3-9627bf3417b0",
      "name": "mydataset01",
      "tables": [
      ],
      "webUrl": "https://app.powerbi.com/datasets/458e0451-7215-4029-80b3-9627bf3417b0"
    }
  ],
  "name": "mydataset01"
}
```

## Data source connectivity \(and multi-tenancy of data)
While almost all of the artifacts in .pbix file are imported into our workspace, the  credentials for data sources are not. As a result, when using **DirectQuery mode**, the embedded report cannot be shown correctly. But, when using **Import mode**, we can view the report using the existing imported data. In such a case, we must set the credential using the following steps via REST calls.

First, we must get the gateway datasource. We know the dataset **id** is the previously returned id.

**HTTP Request**
```
GET https://api.powerbi.com/v1.0/collections/mypbiapp/workspaces/32960a09-6366-4208-a8bb-9e0678cdbb9d/datasets/458e0451-7215-4029-80b3-9627bf3417b0/Default.GetBoundGatewayDatasources
Authorization: AppKey MpaUgrTv5e...
```

**HTTP Response**
```
GET HTTP/1.1 200 OK
Content-Type: application/json; odata.metadata=minimal; odata.streaming=true
RequestId: 574b0b18-a6fa-46a6-826c-e65840cf6e15

{
  "@odata.context": "http://wabi-us-east2-redirect.analysis.windows.net/v1.0/collections/mypbiapp/workspaces/32960a09-6366-4208-a8bb-9e0678cdbb9d/$metadata#gatewayDatasources",
  "value": [
    {
      "id": "5f7ee2e7-4851-44a1-8b75-3eb01309d0ea",
      "gatewayId": "ca17e77f-1b51-429b-b059-6b3e3e9685d1",
      "datasourceType": "Sql",
      "connectionDetails": "{\"server\":\"testserver.database.windows.net\",\"database\":\"testdb01\"}"
    }
  ]
}
```

Using the returned gateway id and datasource id \(see the previous **gatewayId** and **id** in the returned result), we can change the credential of this datasource as follows:

**HTTP Request**
```
PATCH https://api.powerbi.com/v1.0/collections/mypbiapp/workspaces/32960a09-6366-4208-a8bb-9e0678cdbb9d/gateways/ca17e77f-1b51-429b-b059-6b3e3e9685d1/datasources/5f7ee2e7-4851-44a1-8b75-3eb01309d0ea
Authorization: AppKey MpaUgrTv5e...
Content-Type: application/json; charset=utf-8

{
  "credentialType": "Basic",
  "basicCredentials": {
    "username": "demouser",
    "password": "P@ssw0rd"
  }
}
```

**HTTP Response**
```
HTTP/1.1 200 OK
Content-Type: application/octet-stream
RequestId: 0e533c13-266a-4a9d-8718-fdad90391099
```

In production, we can also set the different connection string for each workspace using REST API. \(i.e, we can separate the database for each customers.)
The following is changing the connection string of datasource via REST.
```
POST https://api.powerbi.com/v1.0/collections/mypbiapp/workspaces/32960a09-6366-4208-a8bb-9e0678cdbb9d/datasets/458e0451-7215-4029-80b3-9627bf3417b0/Default.SetAllConnections
Authorization: AppKey MpaUgrTv5e...
Content-Type: application/json; charset=utf-8

{
  "connectionString": "data source=testserver02.database.windows.net;initial catalog=testdb02;persist security info=True;encrypt=True;trustservercertificate=False"
}
```

Or, we can use Row Level Security in Power BI Embedded and we can separate the data for each users in one report. As a result, we can provision each customer report with same .pbix \(UI, etc.) and different data sources.

**Note:** If you’re using **Import mode** instead of **DirectQuery mode**, there’s no way to refresh models via API. And, on-premises datasources through Power BI gateway isn't yet supported in Power BI Embedded. However, you'll really want to keep an eye on the [Power BI blog](https://powerbi.microsoft.com/blog/) for what's new and what's coming in future releases.

## Hosting (embedding) reports in our web page
### Authentication
In the previous REST API, we can use the access key **AppKey** itself as the authorization header. Because these calls can be handled on the backend server side, it's safe.

But, when we embed the report in our web page, this kind of security information would be handled using JavaScript \(frontend). Then the authorization header value must be secured. If our access key is discovered by a malicious user or malicious code, they can call any operations using this key.

When we embed the report in our web page, we must use the computed token instead of access key **AppKey**. Our application must create the OAuth Json Web Token \(JWT) which consists of the claims and the computed digital signature. As illustrated below, this OAuth JWT is dot-delimited encoded string tokens.

![](media\power-bi-embedded-how-to-with-rest\oauth-jwt.png)

First, we must prepare the input value, which is signed later. This value is the base64 url encoded (rfc4648) string of the following json, and these are delimited by the dot \(.) character. Later, we'll explain how to get the report id.

**Note:** If we want to use Row Level Security (RLS) with Power BI Embedded, we must also specify **username** and **roles** in the claims.

```
{
  "typ":"JWT",
  "alg":"HS256"
}
```

```
{
  "wid":"{workspace id}",
  "rid":"{report id}",
  "wcn":"{workspace collection name}",
  "iss":"PowerBISDK",
  "ver":"0.2.0",
  "aud":"https://analysis.windows.net/powerbi/api",
  "nbf":{start time of token expiration},
  "exp":{end time of token expiration}
}
```

Second, we must create the base64 encoded string of HMAC \(the signature) with SHA256 algorithm. This signed input value is the previous string.

Last, we must combine the input value and signature string using period \(.) character. The completed string is the app token for the report embedding. Even if the app token is discovered by a malicious user, they cannot get the original access key. This app token will expire quickly.

Here's a PHP example for these steps:
```
<?php
// 1. power bi access key
$accesskey = "MpaUgrTv5e...";

// 2. construct input value
$token1 = "{" .
  "\"typ\":\"JWT\"," .
  "\"alg\":\"HS256\"" .
  "}";
$token2 = "{" .
  "\"wid\":\"32960a09-6366-4208-a8bb-9e0678cdbb9d\"," . // workspace id
  "\"rid\":\"2027efc6-a308-4632-a775-b9a9186f087c\"," . // report id
  "\"wcn\":\"mypbiapp\"," . // workspace collection name
  "\"iss\":\"PowerBISDK\"," .
  "\"ver\":\"0.2.0\"," .
  "\"aud\":\"https://analysis.windows.net/powerbi/api\"," .
  "\"nbf\":" . date("U") . "," .
  "\"exp\":" . date("U" , strtotime("+1 hour")) .
  "}";
$inputval = rfc4648_base64_encode($token1) .
  "." .
  rfc4648_base64_encode($token2);

// 3. get encoded signature
$hash = hash_hmac("sha256",
	$inputval,
	$accesskey,
	true);
$sig = rfc4648_base64_encode($hash);

// 4. show result (which is the apptoken)
$apptoken = $inputval . "." . $sig;
echo($apptoken);

// helper functions
function rfc4648_base64_encode($arg) {
  $res = $arg;
  $res = base64_encode($res);
  $res = str_replace("/", "_", $res);
  $res = str_replace("+", "-", $res);
  $res = rtrim($res, "=");
  return $res;
}
?>
```

## Finally, embed the report into the web page
For embedding our report, we must get the embed url and report **id** using the following REST API.
**HTTP Request**
```
GET https://api.powerbi.com/v1.0/collections/mypbiapp/workspaces/32960a09-6366-4208-a8bb-9e0678cdbb9d/reports
Authorization: AppKey MpaUgrTv5e...
```

** HTTP Response**
```
HTTP/1.1 200 OK
Content-Type: application/json; odata.metadata=minimal; odata.streaming=true
RequestId: d4099022-405b-49d3-b3b7-3c60cf675958

{
  "@odata.context": "http://wabi-us-east2-redirect.analysis.windows.net/v1.0/collections/mypbiapp/workspaces/32960a09-6366-4208-a8bb-9e0678cdbb9d/$metadata#reports",
  "value": [
    {
      "id": "2027efc6-a308-4632-a775-b9a9186f087c",
      "name": "mydataset01",
      "webUrl": "https://app.powerbi.com/reports/2027efc6-a308-4632-a775-b9a9186f087c",
      "embedUrl": "https://embedded.powerbi.com/appTokenReportEmbed?reportId=2027efc6-a308-4632-a775-b9a9186f087c",
      "isFromPbix": false
    }
  ]
}
```

We can embed the report in our web app using the previous app token.
If we look at the next sample code, the former part is the same as the previous example. In the latter part, this sample shows the **embedUrl** \(see the previous result) in the iframe, and is posting the app token into the iframe.
**Note:** You'll need to change the **id** value for your own id.

```
    <?php
    // 1. power bi access key
    $accesskey = "MpaUgrTv5e...";

    // 2. construct input value
    $token1 = "{" .
      "\"typ\":\"JWT\"," .
      "\"alg\":\"HS256\"" .
      "}";
    $token2 = "{" .
      "\"wid\":\"32960a09-6366-4208-a8bb-9e0678cdbb9d\"," . // workspace id
      "\"rid\":\"2027efc6-a308-4632-a775-b9a9186f087c\"," . // report id
      "\"wcn\":\"mypbiapp\"," . // workspace collection name
      "\"iss\":\"PowerBISDK\"," .
      "\"ver\":\"0.2.0\"," .
      "\"aud\":\"https://analysis.windows.net/powerbi/api\"," .
      "\"nbf\":" . date("U") . "," .
      "\"exp\":" . date("U" , strtotime("+1 hour")) .
      "}";
    $inputval = rfc4648_base64_encode($token1) .
      "." .
      rfc4648_base64_encode($token2);

    // 3. get encoded signature value
    $hash = hash_hmac("sha256",
    	$inputval,
    	$accesskey,
    	true);
    $sig = rfc4648_base64_encode($hash);

    // 4. get apptoken
    $apptoken = $inputval . "." . $sig;

    // helper functions
    function rfc4648_base64_encode($arg) {
      $res = $arg;
      $res = base64_encode($res);
      $res = str_replace("/", "_", $res);
      $res = str_replace("+", "-", $res);
      $res = rtrim($res, "=");
      return $res;
    }
    ?>
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Test page</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      <button id="btnView">View Report !</button>
      <div id="divView">
        <iframe id="ifrTile" width="100%" height="400"></iframe>
      </div>
      <script>
        (function () {
          document.getElementById('btnView').onclick = function() {
            var iframe = document.getElementById('ifrTile');
            iframe.src = 'https://embedded.powerbi.com/appTokenReportEmbed?reportId=2027efc6-a308-4632-a775-b9a9186f087c';
            iframe.onload = function() {
              var msgJson = {
                action: "loadReport",
                accessToken: "<?=$apptoken?>",
                height: 500,
                width: 722
              };
              var msgTxt = JSON.stringify(msgJson);
              iframe.contentWindow.postMessage(msgTxt, "*");
            };
          };
        }());
      </script>
    </body>
```

And here's our result:

![](media\power-bi-embedded-how-to-with-rest\view-report.png)

At this time, Power BI Embedded only shows the report in the iframe. But, keep an eye on the [Power BI Blog](). Future improvements could use new client side APIs that will let us send information into the iframe as well as get information out. Exciting stuff!


## See also
- [Embed a Power BI report with an iframe](power-bi-embedded-iframe.md)
- [Authenticating and authorizing in Power BI Embedded](power-bi-embedded-app-token-flow.md)
