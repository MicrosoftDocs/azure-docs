---
title: Use packet capture to do proactive network monitoring with Azure Functions | Microsoft Docs
description: This article describes how to create an alert triggered packet capture with Azure Network Watcher
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: 75e6e7c4-b3ba-4173-8815-b00d7d824e11
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace

---
# Use packet capture to do proactive network monitoring with Azure Functions

Network Watcher packet capture creates capture sessions to track traffic in and out of a virtual machine. The capture file can have a filter that is defined to track only the traffic you want to monitor. This data is then stored in a storage blob or locally on the guest machine. This capability can be started remotely from other automation scenarios like Azure Functions. Packet capture provides the capability of running proactive captures based on defined network anomalies. Other uses include gathering network statistics, gaining information on network intrusions, to debug client-server communications and much more.

Resources deployed in Azure are running 24/7. You or your staff cannot actively monitor the status of all resources 24/7. What happens if an issue occurs at 2am?

By using Network Watcher, Alerting, and Functions from within the Azure ecosystem, you can proactively respond to issues in your network with the data and tools to solve the problem.

## Before you begin

In this example, your VM is sending more TCP segments than usual, and you would like to be alerted. TCP Segments are used as an example, you could use any alert condition. When you are alerted, you want to have packet level data to understand why communication has increased so you can take steps to return the machine to regular communication.
This scenario assumes you have an existing instance of Network Watcher, and a resource group with a valid virtual machine to be used.

## Scenario

To automate this process, we create and connect an Alert on our VM to trigger when the incident occurs, and an Azure Function to call into Network Watcher.

This scenario will:

* Create an Azure function that starts a packet capture.
* Create an alert rule on a virtual machine
* Configure the alert rule to call the Azure function

## Creating an Azure Function and overview

The first step is to create an Azure function to process the alert and create a packet capture. 

The following list is an overview of the workflow that takes place.

1. An alert is triggered on your VM.
1. The alert calls your Azure Function via a webhook.
1. Your Azure Function processes the alert and starts a Network Watcher packet capture session.
1. Packet capture runs on the VM and collects traffic. 
1. The capture file is uploaded to a storage account for review and diagnosis 

Creating an Azure Function can be accomplished in the portal by following [Create your first Azure Function](../azure-functions/functions-create-first-azure-function.md). For this example, we chose an HttpTrigger-CSharp type function. 

> [!NOTE]
> Other languages are provided with Azure functions but may be experimental and not have full support like PowerShell and Python.

## Processing the alert and starting a packet capture session

It is now time to make calls into Network Watcher from within the Azure Function. Depending on the requirements, the implementation of this function is different. However, the general flow of the code is as such:

1. Process input parameters
2. Query existing packet captures verify limits and resolve name conflicts
3. Create a packet capture with appropriate parameters
4. Poll packet capture periodically until complete
5. Notify user that packet capture session is complete

The following example is C# that can be used in the Azure Function. There are values that need to be replaced for subscription, client id, tenant id, and client secret.

```CSharp
using System.Net;
using Newtonsoft;
using Newtonsoft.Json;
using Microsoft.Rest.Azure.Authentication;
using Microsoft.Azure.Management.ResourceManager;
using Microsoft.Azure.Management.ResourceManager.Models;
using Microsoft.IdentityModel.Clients.ActiveDirectory;

public static TraceWriter log;
public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter twlog)
{
    log = twlog;
    log.Info($"C# HTTP trigger function processed a request. RequestUri={req.RequestUri}");

    HttpContent requestContent = req.Content;
    string jsonContent = requestContent.ReadAsStringAsync().Result;
    
    //Deserialize json input
    WebhookInputParameters inParams = JsonConvert.DeserializeObject<WebhookInputParameters>(jsonContent);

    log.Info($@"subscriptionId: {inParams.subscriptionId}  
                networkWatcherResourceGroup: {inParams.networkWatcherResourceGroup} 
                networkWatcherName: {inParams.networkWatcherName} 
                packetCaptureName: {inParams.packetCaptureName} 
                storageID: {inParams.storageID} 
                timeLimit: {inParams.timeLimit} 
                targetVM: {inParams.targetVM}");

    //Get JWT Token
    string token = GetAuthorizationToken();
    
    //Create URI and Delete existing Packet Capture if it exists
    string endpoint = @"https://management.azure.com";
    string PacketCaptureRequestURI = $@"{endpoint}/subscriptions/{inParams.subscriptionId}/resourceGroups/{inParams.networkWatcherResourceGroup}/providers/Microsoft.Network/networkWatchers/{inParams.networkWatcherName}/packetCaptures/{inParams.packetCaptureName}?api-version=2016-03-30";

    //Delete Packet Capture
    HttpWebRequest packetCaptureDelete = Request(PacketCaptureRequestURI, token, "Delete");
    //Errors from delete (404 not found) indicate that the packet capture does not exist already
    HttpWebResponse pcDeleteResponse = getHttpResponse(packetCaptureDelete);

    //Create Packet Capture Request Body
    PacketCaptureRequestBody pcrb = new PacketCaptureRequestBody();
    pcrb.properties.timeLimitInSeconds = inParams.timeLimit;
    pcrb.properties.target = inParams.targetVM;
    pcrb.properties.storageLocation.storageId = inParams.storageID;

    //serialize PacketCaptureRequestBody
    var jSetting = new JsonSerializerSettings();
    jSetting.NullValueHandling = NullValueHandling.Ignore;
    jSetting.Formatting = Formatting.Indented;
    string pcRequestBody = JsonConvert.SerializeObject(pcrb, jSetting);
    
    //Create Packet Capture via PUT 
    HttpWebRequest packetCaptureCreate = Request(PacketCaptureRequestURI, token, "Put", pcRequestBody);
    HttpWebResponse pcPostResponse = getHttpResponse(packetCaptureCreate);
    
    //if packet capture creation successful return to user created storagePath
    if (!(pcPostResponse == null) && pcPostResponse.StatusCode == HttpStatusCode.Created)
    {
        string pcPostResponseLocation = getHeaderContent(pcPostResponse, "Location") ?? "Header null";
        string pcPostResponseContent = httpWebResponseContent(pcPostResponse) ?? "Response Content null";

        //Deserialize response body into object
        PacketCaptureResponseBody pcrbObj = JsonConvert.DeserializeObject<PacketCaptureResponseBody>(pcPostResponseContent);
        return req.CreateResponse(HttpStatusCode.OK, $"Packet Capture successfully created and will upload to StoragePath: {pcrbObj.properties.storageLocation.storagePath}");
    }
    return req.CreateResponse(HttpStatusCode.OK, "Error creating packet capture");
}

// Creates and returns the HTTPWebRequest
public static HttpWebRequest Request(string requestURI, string token, string requestType, string requestContent = null)
{
    
    var httpWebRequest = (HttpWebRequest)WebRequest.Create(requestURI);
    httpWebRequest.Headers.Add(HttpRequestHeader.Authorization, "Bearer " + token);
    httpWebRequest.ContentType = "application/json";
    httpWebRequest.Method = requestType;
    if (requestContent != null)
    {
        httpWebRequest.ContentLength = (requestContent != null) ? requestContent.Length : 0;
    }
    log.Info("Sending Request: " + requestURI + (requestContent ?? ""));

    //ensure requestType is in uppercase
    requestType = requestType.ToUpper();
    if (requestType.Equals("PUT") || requestType.Equals("POST"))
    {
        using (var requestStream = new StreamWriter(httpWebRequest.GetRequestStream()))
        {
            requestStream.Write(requestContent);
        }
    }
    log.Info("Request Sent");
    return httpWebRequest;
}

public static HttpWebResponse getHttpResponse(HttpWebRequest httpWebRequest)
{
    HttpWebResponse httpWebResponse = null;
    try
    {
        httpWebResponse = (HttpWebResponse)httpWebRequest.GetResponse();
    }
    catch (Exception ex)
    {
        log.Info("Error from " + ex.Message, "HttpWebResponsexeption");
    }
    return httpWebResponse;
}

public static string httpWebResponseContent(HttpWebResponse httpWebResponse)
{
    string content = null;
    using (StreamReader reader = new StreamReader(httpWebResponse.GetResponseStream()))
    {
        content = reader.ReadToEnd();
    }
    return content;
}

public static string getHeaderContent(HttpWebResponse httpWebResponse, string param)
{
    log.Info((int)httpWebResponse.StatusCode + "\tStatus Description: " + httpWebResponse.StatusDescription + "\r\n Headers: " + httpWebResponse.Headers);
    return httpWebResponse.Headers.Get(param);
}

//Gets the JWT Token to be able to make REST calls
public static string GetAuthorizationToken()
{
    var tenantId = "<insert tenant id>"; 
    var clientId = "<insert client id>"; 
    var secret = "<insert client secret>";
    var subscriptionId = "<insert subscription id>"; 

    string authContextURL = "https://login.windows.net/" + tenantId;
    var authenticationContext = new AuthenticationContext(authContextURL);
    var credential = new ClientCredential(clientId, secret);
    var result = authenticationContext.AcquireToken(resource: "https://management.azure.com/", clientCredential: credential);
    if (result == null)
    {
        throw new InvalidOperationException("Failed to obtain the JWT token");
    }
    return result.AccessToken;
}

public class WebhookInputParameters
{
    public string subscriptionId { get; set; }
    public string networkWatcherResourceGroup { get; set; }
    public string networkWatcherName { get; set; }
    public string packetCaptureName { get; set; }
    public string storageID { get; set; }
    public int timeLimit { get; set; }
    public string targetVM { get; set; }
}

public class PacketCaptureRequestBody
{
    public PacketCaptureRequestBody()
    {
        properties = new Properties();
    }
    public Properties properties { get; set; }
}

public class StorageLocation
{
    public string storageId { get; set; }
    public string storagePath { get; set; }
    public string filePath { get; set; }
}

public class Filter
{
    public string protocol { get; set; }
    public string localIP { get; set; }
    public string localPort { get; set; }
    public string remoteIP { get; set; }
    public string remotePort { get; set; }
}

public class Properties
{
    public Properties()
    {
        filters = new List<Filter>();
        storageLocation = new StorageLocation();
    }

    public string target { get; set; }
    public int bytestToCapturePerPacket { get; set; }
    public int totalBytesPerSession { get; set; }
    public int timeLimitInSeconds { get; set; }

    public StorageLocation storageLocation { get; set; }
    public List<Filter> filters { get; set; }
}

public class PacketCaptureResponseBody
{
    public PacketCaptureResponseBody()
    {
        properties = new PacketCaptureResponseProperties();
    }
    public string name { get; set; }
    public string id { get; set; }
    public string etag { get; set; }
    public PacketCaptureResponseProperties properties { get; set; }
}

public class PacketCaptureResponseProperties
{
    public PacketCaptureResponseProperties()
    {
        filters = new List<Filter>();
        storageLocation = new StorageLocation();
    }
    public string provisioningState { get; set; }
    public string target { get; set; }
    public int bytesToCapturePerPacket { get; set; }
    public int totalBytesPerSession { get; set; }
    public int timeLimitInSeconds { get; set; }
    public StorageLocation storageLocation { get; set; }
    public List<Filter> filters { get; set; }
    public string captureStartTime { get; set; }
    public string packetCaptureStatus { get; set; }
    public List<object> packetCaptureError { get; set; }
}
``` 

Once you have created your function, you need to configure your alert to call the URL associated with the function. To get this value, copy the Function URL from your function app.

![finding the function url][2]

If you require custom properties in the payload of the webhook POST request, refer [Configure a webhook on an Azure metric alert](../monitoring-and-diagnostics/insights-webhooks-alerts.md)

## Configure an alert on a VM

Alerts can be configured to notify individuals when a specific metric crosses a threshold assigned to it. In this example, the alert is on the TCP segments sent, but the alert can be triggered for many other metrics. In this example, an alert is configured to call a webhook to call the function.

### Create the alert rule

Navigate to an existing virtual machine and add an alert rule. More detailed documentation about configuring alerts can be found at [User Azure portal to create alerts for Azure services](../monitoring-and-diagnostics/insights-alerts-portal.md). 

![add vm alert rule to a virtual machine][1]

> [!NOTE]
> Some Metrics are not enabled by default. Learn more about how to enable addition metrics by visiting [Enable monitoring and diagnostics](../monitoring-and-diagnostics/insights-how-to-use-diagnostics.md)

Finally paste the URL from the preceding step into the webhook textbox on your alert. Click **OK** to save the alert rule.

![pasting the url to the alert rule][3]

## Downloading and viewing the capture file

If you save your capture to a storage account, then the capture file can be downloaded via the portal or programmatically. If the capture file is stored locally, the capture file is retrieved by logging in to the virtual machine. 

For instructions on downloading files from azure storage accounts, refer to [Get started with Azure Blob storage using .NET](../storage/storage-dotnet-how-to-use-blobs.md). Another tool that can be used is Storage Explorer. More information about Storage Explorer can be found here at the following link: [Storage Explorer](http://storageexplorer.com/)

Once your capture is downloaded, you can view it using any tool that can read a **.cap** file. The following are links to two of these tools:

[Microsoft Message Analyzer](https://technet.microsoft.com/en-us/library/jj649776.aspx)  
[WireShark](https://www.wireshark.org/)  

## Next steps

Learn how to view your packet captures by visiting [Packet capture analysis with Wireshark](network-watcher-alert-triggered-packet-capture.md)

[1]: ./media/network-watcher-alert-triggered-packet-capture/figure1.png
[2]: ./media/network-watcher-alert-triggered-packet-capture/figure2.png
[3]: ./media/network-watcher-alert-triggered-packet-capture/figure3.png
