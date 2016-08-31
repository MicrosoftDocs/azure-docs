<properties
	pageTitle="Log Analytics HTTP Data Collector API | Microsoft Azure"
	description="The Log Analytics HTTP Data Collector API allows you to add post JSON data to the Log Analytics repository from any client able to call the REST API.  This article desribes the use of the API and provides examples of publishing data using different languages."
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

The Log Analytics HTTP Data Collector API, allows you to add post JSON data to the Log Analytics repository from any client able to call the REST API.  This allows you to send data from third party applications or from scripts such as a runbook in Azure Automation.  

## Creating a request

The following tables list the required attributes of each request to the Log Analytics HTTP Data Collector API.  Each attribute is described in further detail in the sections that follow.

### Request URI

| Attribute | Property |
|:--|:--|
| Method | Post |
| URI | https://<WorkspaceID>.ods.opinsights.azure.com/api/logs?api-version=2016-04-01 |
| Content type | application/json |

### Request URI Parameters
| Parameter | Description |
|:--|:--|
| CustomerID  | Unique identifier for the OMS workspace |
| Resource    | API resource name. /api/logs |
| API Version | Version of the API to be used with this request. Currently 2016-04-01 |

### Request headers
| Header | Description |
|:--|:--|
| Authorization | Authorization signature.  See additional information below on creating a HMAC-SHA256 header. |
| Log-Type | Specify the record type of the data that is being submitted. Currently, Log type only supports alpha characters. It does not support numerics or special characters. |
| x-ms-date | The date that the request was processed in RFC 1123 format. |
| time-generated-field | Allows you to specify the message’s timestamp field to use as the TimeGenerated field in order to reflect the actual timestamp from the message data. If this field isn’t specified, the default for TimeGenerated when the message is ingested. The message field specified should follow the ISO 8601 of YYYY-MM-DDThh:mm:ssZ. |


## Authorization

Any request to the Log Analytics HTTP Data Collector API must include an Authorization header. To authenticate a request, you must sign the request with either the primary or secondary key for the workspace that is making the request and pass that signature as part of the request.   

The format for the Authorization header is as follows:

```
Authorization: SharedKey <WorkspaceID>:<Signature>
```

*WorkspaceID* is the unique identifer for the OMS workspace.  *Signature* is a [Hash-based Message Authentication Code (HMAC)](https://msdn.microsoft.com/library/system.security.cryptography.hmacsha256.aspx) constructed from the request and computed by using the [SHA256 algorithm](https://msdn.microsoft.com/library/system.security.cryptography.sha256.aspx), and then encoded using Base64 encoding.

Use the following format to encode the Shared Key signature string: 

```
StringToSign = VERB + "\n" +
       	       Content-Length + "\n" +
               Content-Type + "\n" +
   	           x-ms-date + "\n" +
   	           "/api/logs";
```

Following is an example signature string:

```
POST\n1024\napplication/json\nx-ms-date:Mon, 04 Apr 2016 08:00:00 GMT\n/api/logs
```

Once you have the signature string, encode it using the HMAC-SHA256 algorithm on the UTF-8-encoded string and then encode the result as Base64.  Use the following format: 

```
Signature=Base64(HMAC-SHA256(UTF8(StringToSign)))
```

Sample code for creating an authorization header is provided in the samples below.

## Request body

The body of the message must be in JSON and include one or more records with property name and value pairs in the following format:

```
{
"property1": "value1",
" property 2": "value2"
" property 3": "value3",
" property 4": "value4"
}
```

You can batch together multiple records in a single request using the following format. All the records must be the same record type.

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

## Record Type and properties

You define a custom record type when you submit data through the Log Analytics HTTP Data Collector API.  You cannot currently write data to existing record types created by other data types and solutions.  Log Analytics will read the incoming data and create properties matching the data types of the values that you provide.

Each request to the Log Analytics API must include a **Log-Type** header with the name for the record type.  The suffix **_CL** will automatically be appended to this name you provide to distinguish it as a custom log.  For example, if you provide the name **MyNewRecordType**, Log Analytics will create a record with the type **MyNewRecordType_CL**.  This is to ensure that there are no conflicts between user created type names and those shipped in existing or future Microsoft solutions.
  
A suffix from the table below will be added to each property to identify its data type. If a property contains a null value, then that property will not be included in that record.

| Property Data Type | Suffix |
|:--|:--|
| String    | _s |
| Boolean   | _b |
| Double    | _d |
| Date/time | _t |
| GUID      | _g |


The data type that Log Analytics uses for each property depends on whether the record type for the new record already exists.

- If the record type does not exist, then a new one will be created.  Log Analytics will use JSON type inference to determine the data type for each property for the new record. 
- If the record type does exist, then Log Analytics will attempt to create a new record based on existing properties.  If the data type for a property in the new record doesn’t match and can’t be converted to the existing type or if the record includes a property that doesn’t exist, then a new property will be created with an appropriate suffix.

For example, the entry in following submission would create a record with three properties called number_d, boolean_b, and string_s. 

![Sample record 1](media/log-analytics-data-collector-api/record-01.png)

If you then submitted the following entry with all values formatted as strings, the properties would not change since the values can be converted to the existing data types.

![Sample record 2](media/log-analytics-data-collector-api/record-02.png)

If you then made the following submission though, then new properties are created called boolean_d and string_d since these values cannot be converted.

![Sample record 3](media/log-analytics-data-collector-api/record-03.png)

If you submitted the following entry before the record type had been created, it would create a record with three properties called number_s, boolean_s, and string_s since each of the initial values is formatted as a string.

![Sample record 4](media/log-analytics-data-collector-api/record-04.png)

## Return codes

An Http status code of 202, means that the request has been accepted for processing, but the processing has not been completed. This indicates that the operation completed successfully. 

The following table lists the complete set of status codes that may be returned by the service.

| Code | Status | Error Code | Description |
|:--|:--|:--|:--|
| 202 | Accepted |  | The request was successfully accepted. |
| 400 | Bad request | InactiveCustomer | The workspace has been closed. |
| 400 | Bad request | InvalidApiVersion | The API version specified was not recognized by the service. |
| 400 | Bad request | InvalidCustomerId | The workspace ID specified is invalid. |
| 400 | Bad request | InvalidDataFormat | Invalid JSON submitted. The response body may contain more information on how to resolve the error. |
| 400 | Bad request | InvalidLogType | The log type specified contained special characters or numerics. |
| 400 | Bad request | MissingApiVersion | The API version wasn’t specified. |
| 400 | Bad request | MissingContentType | The content type wasn’t specified. |
| 400 | Bad request | MissingLogType | The required value log type wasn’t specified. |
| 400 | Bad request | UnsupportedContentType | Content type was not set to application/json. |
| 403 | Forbidden | InvalidAuthorization | The service failed to authenticate the request. Verify that the workspace ID and connection key used are valid. | 
| 500 | Internal Server Error | UnspecifiedError | The service encountered an internal error. Please retry the request. |
| 503 | Service Unavailable | ServiceUnavailable | The service is currently unavailable to receive requests. Please retry your request. |

## Querying data

To query data submitted by the Log Analytics HTTP Data Collector API, search for records with **Type** equal to the **LogType** value you specified with **_CL** appeneded.  For example, if you used **MyCustomLog**, then you could return all records with **Type=MyCustomLog_CL**.


## Sample requests

The following sections provide samples of submitting data to the Log Analytics HTTP Data Collector API using different languages.

For each sample, you must perform the following steps the set the variables for the authorization header.

1. In the OMS portal, click the **Settings** tile and then the **Connected Sources** tab.
2. On the right of **Workspace ID**, click the copy icon and paste the ID as the value of the Customer ID variable.
3. On the right of **Primary Key**, click the copy icon and paste the ID as the value of the Shared Key variable.

You can optionally change the variables for the Log Type and JSON data.

### PowerShell sample

```
# Replace with your Workspace ID
$CustomerId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  
	
# Replace with your Primary Key
$SharedKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

#Specify the name of the record type that we'll be creating.
$LogType = "MyRecordType"

#Specify a time in the format YYYY-MM-DDThh:mm:ssZ to specify a created time for the records.
$TimeStampField = ""


#Create two records with same set of properties to create.
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

# Function to create the authorization signature.
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


# Function to create and post the request
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

//Optional field used to specify time stamp fromt he data. If time field not specified, assumes message ingestion time
        static string TimeStampField = "";

        static void Main()
        {
//Creating hash for API signature 
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

#Update customer Id to your OMS workspace ID
customer_id = 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

#For shared key use either the primary or secondary Connected Sources client authentication key   
shared_key = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

#Log type is name of the event that is being submitted 
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

# Build & send request to POST API
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

- Build custom views on the data that you submit using [View Designer](log-analytics-view-designer.md).
