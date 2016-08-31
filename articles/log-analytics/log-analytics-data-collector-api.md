<properties
	pageTitle="Log Analytics HTTP Data Collector API | Microsoft Azure"
	description="The Log Analytics HTTP Data Collector API allows you to add post JSON data to the Log Analytics repository from any client that is able to call the REST API. This article describes the use of the API and provides examples of publishing data using different languages."
	services="log-analytics"
	documentationCenter=""
	authors="bwren"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/29/2016"
	ms.author="bwren"/>


# Log Analytics HTTP Data Collector API

When you use the Log Analytics HTTP Data Collector API, you can add post JSON data to the Log Analytics repository from any client that can call the REST API. This allows you to send data from third-party applications or from scripts such as a runbook in Azure Automation.  

## Create a request

The following tables list the required attributes of each request to the Log Analytics HTTP Data Collector API. Each attribute is described in more detail later in the article.

### To request the URI

| Attribute | Property |
|:--|:--|
| Method | Post |
| URI | https://<WorkspaceID>.ods.opinsights.azure.com/api/logs?api-version=2016-04-01 |
| Content type | application/json |

### To request URI parameters
| Parameter | Description |
|:--|:--|
| CustomerID  | The unique identifier for the Microsoft Operations Management Suite (OMS) workspace. |
| Resource    | The API resource name. /api/logs |
| API Version | The version of the API to use with this request. Currently, it's 2016-04-01. |

### To request headers
| Header | Description |
|:--|:--|
| Authorization | The authorization signature. See information later in the article about how to create an HMAC-SHA256 header. |
| Log-Type | Specify the record type of the data that is being submitted. Currently, the log type supports only alpha characters. It does not support numerics or special characters. |
| x-ms-date | The date that the request was processed in RFC 1123 format. |
| time-generated-field | You can specify the message’s timestamp field to use as the TimeGenerated field to reflect the actual timestamp from the message data. If this field isn’t specified, the default for TimeGenerated when the message is ingested. The message field specified should follow the ISO 8601 format YYYY-MM-DDThh:mm:ssZ. |


## Authorization

Any request to the Log Analytics HTTP Data Collector API must include an Authorization header. To authenticate a request, you must sign the request with either the primary or secondary key for the workspace that is making the request, and then pass that signature as part of the request.   

Here's the format for the Authorization header:

```
Authorization: SharedKey <WorkspaceID>:<Signature>
```

*WorkspaceID* is the unique identifier for the OMS workspace. *Signature* is a [Hash-based Message Authentication Code (HMAC)](https://msdn.microsoft.com/library/system.security.cryptography.hmacsha256.aspx) that is constructed from the request and computed by using the [SHA256 algorithm](https://msdn.microsoft.com/library/system.security.cryptography.sha256.aspx). Then it's encoded using Base64 encoding.

Use the following format to encode the Shared Key signature string:

```
StringToSign = VERB + "\n" +
       	       Content-Length + "\n" +
               Content-Type + "\n" +
   	           x-ms-date + "\n" +
   	           "/api/logs";
```

This is an example signature string:

```
POST\n1024\napplication/json\nx-ms-date:Mon, 04 Apr 2016 08:00:00 GMT\n/api/logs
```

When you have the signature string, encode it using the HMAC-SHA256 algorithm on the UTF-8-encoded string and then encode the result as Base64. Use this format:

```
Signature=Base64(HMAC-SHA256(UTF8(StringToSign)))
```

Sample code to help you create an authorization header are in the samples in the next sections.

## Request body

The body of the message must be in JSON. It must include one or more record with the property name and value pairs in this format:

```
{
"property1": "value1",
" property 2": "value2"
" property 3": "value3",
" property 4": "value4"
}
```

You can batch multiple records together in a single request by using the following format. All the records must be the same record type.

```
{
"property1": "value1",
" property 2": "value2"
" property 3": "value3",
" property 4": "value4"
},
{
"property1": "value1",
" property 2": "value2"
" property 3": "value3",
" property 4": "value4"
}
```

## Record type and properties

You define a custom record type when you submit data through the Log Analytics HTTP Data Collector API. Currently, you can't write data to existing record types that were created by other data types and solutions. Log Analytics reads the incoming data and then creates properties that match the data types of the values that you provide.

Each request to the Log Analytics API must include a **Log-Type** header with the name for the record type. The suffix **_CL** is automatically appended to the name you provide to distinguish it as a custom log. For example, if you provide the name **MyNewRecordType**, Log Analytics creates a record with the type **MyNewRecordType_CL**. This helps ensure that there are no conflicts between user-created type names and those shipped in current or future Microsoft solutions.

A suffix from the following table is added to each property to identify its data type. If a property contains a null value, that property is not included in that record.

| Property data type | Suffix |
|:--|:--|
| String    | _s |
| Boolean   | _b |
| Double    | _d |
| Date/time | _t |
| GUID      | _g |


The data type that Log Analytics uses for each property depends on whether the record type for the new record already exists.

- If the record type does not exist, Log Analytics creates a new one. Log Analytics uses the JSON type inference to determine the data type for each property for the new record.
- If the record type does exist, Log Analytics attempts to create a new record based on existing properties. If the data type for a property in the new record doesn’t match and can’t be converted to the existing type, or if the record includes a property that doesn’t exist, a new property is created with an appropriate suffix.

For example, this submission entry would create a record with three properties called number_d, boolean_b, and string_s.

![Sample record 1](media/log-analytics-data-collector-api/record-01.png)

If you then submitted the following entry with all values formatted as strings, the properties would not change because the values can be converted to the existing data types.

![Sample record 2](media/log-analytics-data-collector-api/record-02.png)

But if you then made this submission, Log Analytics creates the new properties boolean_d and string_d because these values can't be converted.

![Sample record 3](media/log-analytics-data-collector-api/record-03.png)

If you submitted the following entry before the record type was created, it would create a record with the three properties number_s, boolean_s, and string_s because each of the initial values is formatted as a string.

![Sample record 4](media/log-analytics-data-collector-api/record-04.png)

## Return codes

The Http status code 202 means that the request has been accepted for processing, but the processing has not been completed. This indicates that the operation completed successfully.

The following table lists the complete set of status codes that the service might return.

| Code | Status | Error code | Description |
|:--|:--|:--|:--|
| 202 | Accepted |  | The request was successfully accepted. |
| 400 | Bad request | InactiveCustomer | The workspace has been closed. |
| 400 | Bad request | InvalidApiVersion | The API version specified was not recognized by the service. |
| 400 | Bad request | InvalidCustomerId | The workspace ID specified is invalid. |
| 400 | Bad request | InvalidDataFormat | Invalid JSON was submitted. The response body might contain more information about how to resolve the error. |
| 400 | Bad request | InvalidLogType | The log type specified contained special characters or numerics. |
| 400 | Bad request | MissingApiVersion | The API version wasn’t specified. |
| 400 | Bad request | MissingContentType | The content type wasn’t specified. |
| 400 | Bad request | MissingLogType | The required value log type wasn’t specified. |
| 400 | Bad request | UnsupportedContentType | The content type was not set to application/json. |
| 403 | Forbidden | InvalidAuthorization | The service failed to authenticate the request. Verify that the workspace ID and connection key are valid. |
| 500 | Internal Server Error | UnspecifiedError | The service encountered an internal error. Please retry the request. |
| 503 | Service Unavailable | ServiceUnavailable | The service currently is unavailable to receive requests. Please retry your request. |

## Querying data

To query data submitted by the Log Analytics HTTP Data Collector API, search for records with **Type** equal to the **LogType** value that you specified, appended with **_CL**. For example, if you used **MyCustomLog**, then you could return all records with **Type=MyCustomLog_CL**.


## Sample requests

In the following sections, you'll find samples of how to submit data to the Log Analytics HTTP Data Collector API by using different programming languages.

For each sample, do these steps the set the variables for the authorization header.

1. In the OMS portal, choose the **Settings** tile, and then choose the **Connected Sources** tab.
2. On the right of **Workspace ID**, choose the copy icon, and then paste the ID as the value of the Customer ID variable.
3. On the right of **Primary Key**, choose the copy icon, and then paste the ID as the value of the Shared Key variable.

Alternatively, you can change the variables for the Log Type and JSON data.

### PowerShell sample

```
# Replace with your Workspace ID
$CustomerId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  

# Replace with your Primary Key
$SharedKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

#Specify the name of the record type that you'll be creating
$LogType = "MyRecordType"

#Specify a time in the format YYYY-MM-DDThh:mm:ssZ to specify a created time for the records
$TimeStampField = ""


#Create two records with the same set of properties to create
$json = @"
[{  "StringValue": "MyString1",
    "NumberValue": 42,
    "BooleanValue": true,
    "DateValue": "2016-05-12T20:00:00.625Z",
    "GUIDValue": "9909ED01-A74C-4874-8ABF-D2678E3AE23D"
},
{   "StringValue": "MyString2",
    "NumberValue": 43,
    "BooleanValue": false,
    "DateValue": "2016-05-12T20:00:00.625Z",
    "GUIDValue": "8809ED01-A74C-4874-8ABF-D2678E3AE23D"
}]
"@

# The function to create the authorization signature
Function Build-Signature ($customerId, $sharedKey, $date, $contentLength, $method, $contentType, $resource)
{
    $xHeaders = "x-ms-date:" + $date
    $stringToHash = $method + "`n" + $contentLength + "`n" + $contentType + "`n" + $xHeaders + "`n" + $resource

    $bytesToHash = [Text.Encoding]::UTF8.GetBytes($stringToHash)
    $keyBytes = [Convert]::FromBase64String($sharedKey)

    $sha256 = New-Object System.Security.Cryptography.HMACSHA256
    $sha256.Key = $keyBytes
    $calculatedHash = $sha256.ComputeHash($bytesToHash)
    $encodedHash = [Convert]::ToBase64String($calculatedHash)
    $authorization = 'SharedKey {0}:{1}' -f $customerId,$encodedHash
    return $authorization
}


# The function to create and post the request
Function Post-OMSData($customerId, $sharedKey, $body, $logType)
{
    $method = "POST"
    $contentType = "application/json"
    $resource = "/api/logs"
    $rfc1123date = [DateTime]::UtcNow.ToString("r")
    $contentLength = $body.Length
    $signature = Build-Signature `
        -customerId $customerId `
        -sharedKey $sharedKey `
        -date $rfc1123date `
        -contentLength $contentLength `
        -fileName $fileName `
        -method $method `
        -contentType $contentType `
        -resource $resource
    $uri = "https://" + $customerId + ".ods.opinsights.azure.com" + $resource + "?api-version=2016-04-01"

    $headers = @{
        "Authorization" = $signature;
        "Log-Type" = $logType;
        "x-ms-date" = $rfc1123date;
        "time-generated-field" = $TimeStampField;
    }

    $response = Invoke-WebRequest -Uri $uri -Method $method -ContentType $contentType -Headers $headers -Body $body -UseBasicParsing
    return $response.StatusCode

}

# Submit the data to the API endpoint
Post-OMSData -customerId $customerId -sharedKey $sharedKey -body ([System.Text.Encoding]::UTF8.GetBytes($json)) -logType $logType  
```

### C# sample

```
using System;
using System.Net;
using System.Security.Cryptography;

namespace OIAPIExample
{
    class ApiExample
    {
//Example JSON object with key value pairs
        static string json = @"[{""DemoField1"":""DemoValue1"",""DemoField2"":""DemoValue2""},{""DemoField1"":""DemoValue3"",""DemoField2"":""DemoValue4""}]";

//#Update customerId to your OMS workspace ID
        static string customerId = "xxxxxxxx-xxx-xxx-xxx-xxxxxxxxxxxx";

//For shared key use either primary or secondary Connected Sources client authentication key   
        static string sharedKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

//LogName is name of the event type that is being submitted to Log Analytics
        static string LogName = "DemoExample";

//Optional field used to specify time stamp from the data. If time field is not specified, assumes message ingestion time
        static string TimeStampField = "";

        static void Main()
        {
//Create hash for API signature
            var datestring = DateTime.UtcNow.ToString("r");
            string stringToHash = "POST\n" + json.Length + "\napplication/json\n" + "x-ms-date:" + datestring + "\n/api/logs";
            string hashedString = BuildSignature(stringToHash, sharedKey);
            string signature = "SharedKey " + customerId + ":" + hashedString;

            PostData(signature, datestring, json);
        }

//Build API signature
        public static string BuildSignature(string message, string secret)
        {
            var encoding = new System.Text.ASCIIEncoding();
            byte[] keyByte = Convert.FromBase64String(secret);
            byte[] messageBytes = encoding.GetBytes(message);
            using (var hmacsha256 = new HMACSHA256(keyByte))
            {
                byte[] hash = hmacsha256.ComputeHash(messageBytes);
                return Convert.ToBase64String(hash);
            }
        }

//Send request to POST API endpoint
        public static void PostData(string signature, string date, string json)
        {
            string url = "https://"+ customerId +".ods.opinsights.azure.com/api/logs?api-version=2016-04-01";
            using (var client = new WebClient())
            {
                client.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                client.Headers.Add("Log-Type", LogName);
                client.Headers.Add("Authorization", signature);
                client.Headers.Add("x-ms-date", date);
                client.Headers.Add("time-generated-field", TimeStampField);
                client.UploadString(new Uri(url), "POST", json);
            }
        }
    }
}
```

### Python sample

```
import json
import requests
import datetime
import hashlib
import hmac
import base64

#Update customer ID to your OMS workspace ID
customer_id = 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

#For shared key, use either the primary or the secondary Connected Sources client authentication key   
shared_key = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

#The log type is the name of the event that is being submitted
log_type = 'WebMonitorTest'

#Example JSON web monitor object
json_data = [{
   "slot_ID": 12345,
    "ID": "5cdad72f-c848-4df0-8aaa-ffe033e75d57",
    "availability_Value": 100,
    "performance_Value": 6.954,
    "measurement_Name": "last_one_hour",
    "duration": 3600,
    "warning_Threshold": 0,
    "critical_Threshold": 0,
    "IsActive": "true"
},
{   
    "slot_ID": 67890,
    "ID": "b6bee458-fb65-492e-996d-61c4d7fbb942",
    "availability_Value": 100,
    "performance_Value": 3.379,
    "measurement_Name": "last_one_hour",
    "duration": 3600,
    "warning_Threshold": 0,
    "critical_Threshold": 0,
    "IsActive": "false"
}]
body = json.dumps(json_data)

#####################
######Functions######  
#####################

# Build API signature
def build_signature(customer_id, shared_key, date, content_length, method, content_type, resource):
    x_headers = 'x-ms-date:' + date
    string_to_hash = method + "\n" + str(content_length) + "\n" + content_type + "\n" + x_headers + "\n" + resource
    bytes_to_hash = bytes(string_to_hash).encode('utf-8')  
    decoded_key = base64.b64decode(shared_key)
    encoded_hash = base64.b64encode(hmac.new(decoded_key, string_to_hash, digestmod=hashlib.sha256).digest())
    authorization = "SharedKey {}:{}".format(customer_id,encoded_hash)
    return authorization

# Build and send request to POST API
def post_data(customer_id, shared_key, body, log_type):
    method = 'POST'
    content_type = 'application/json'
    resource = '/api/logs'
    rfc1123date = datetime.datetime.utcnow().strftime('%a, %d %b %Y %H:%M:%S GMT')
    content_length = len(body)
    signature = build_signature(customer_id, shared_key, rfc1123date, content_length, method, content_type, resource)
    uri = 'https://' + customer_id + '.ods.opinsights.azure.com' + resource + '?api-version=2016-04-01'

    headers = {
        'content-type': content_type,
        'Authorization': signature,
        'Log-Type': log_type,
        'x-ms-date': rfc1123date
    }

    response = requests.post(uri,data=body, headers=headers)
    if (response.status_code == 202):
        print 'Accepted'
    else:
        print "Response code: {}".format(response.status_code)

post_data(customer_id, shared_key, body, log_type)
```

## Next steps

- Build custom views on the data that you submit by using [View Designer](log-analytics-view-designer.md).
