---
title: Azure Monitor HTTP Data Collector API | Microsoft Docs
description: You can use the Azure Monitor HTTP Data Collector API to add POST JSON data to a Log Analytics workspace from any client that can call the REST API. This article describes how to use the API, and it has examples of how to publish data by using various programming languages.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 08/08/2023
---

# Send log data to Azure Monitor by using the HTTP Data Collector API (deprecated)

This article shows you how to use the HTTP Data Collector API to send log data to Azure Monitor from a REST API client.  It describes how to format data that's collected by your script or application, include it in a request, and have that request authorized by Azure Monitor. We provide examples for Azure PowerShell, C#, and Python.

> [!NOTE]
> The Azure Monitor HTTP Data Collector API has been deprecated and will no longer be functional as of 9/14/2026. It's been replaced by the [Logs ingestion API](logs-ingestion-api-overview.md).

## Concepts
You can use the HTTP Data Collector API to send log data to a Log Analytics workspace in Azure Monitor from any client that can call a REST API.  The client might be a runbook in Azure Automation that collects management data from Azure or another cloud, or it might be an alternative management system that uses Azure Monitor to consolidate and analyze log data.

All data in the Log Analytics workspace is stored as a record with a particular record type.  You format your data to send to the HTTP Data Collector API as multiple records in JavaScript Object Notation (JSON).  When you submit the data, an individual record is created in the repository for each record in the request payload.

:::image type="content" source="media/data-collector-api/overview.png" lightbox="media/data-collector-api/overview.png" alt-text="Screenshot illustrating the HTTP Data Collector overview.":::

## Create a request
To use the HTTP Data Collector API, you create a POST request that includes the data to send in JSON. The next three tables list the attributes that are required for each request. We describe each attribute in more detail later in the article.

### Request URI
| Attribute | Property |
|:--- |:--- |
| Method |POST |
| URI |https://\<CustomerId\>.ods.opinsights.azure.com/api/logs?api-version=2016-04-01 |
| Content type |application/json |
| | |

### Request URI parameters
| Parameter | Description |
|:--- |:--- |
| CustomerID |The unique identifier for the Log Analytics workspace. |
| Resource |The API resource name: /api/logs. |
| API Version |The version of the API to use with this request. Currently, the version is 2016-04-01. |
| | |

### Request headers
| Header | Description |
|:--- |:--- |
| Authorization |The authorization signature. Later in the article, you can read about how to create an HMAC-SHA256 header. |
| Log-Type |Specify the record type of the data that's being submitted. It can contain only letters, numbers, and the underscore (_) character, and it can't exceed 100 characters. |
| x-ms-date |The date that the request was processed, in RFC [1123](/dotnet/api/system.globalization.datetimeformatinfo.rfc1123pattern) format. |
| x-ms-AzureResourceId | The resource ID of the Azure resource that the data should be associated with. It populates the [_ResourceId](./log-standard-columns.md#_resourceid) property and allows the data to be included in [resource-context](manage-access.md#access-mode) queries. If this field isn't specified, the data won't be included in resource-context queries. |
| time-generated-field | The name of a field in the data that contains the timestamp of the data item. If you specify a field, its contents are used for **TimeGenerated**. If you don't specify this field, the default for **TimeGenerated** is the time that the message is ingested. The contents of the message field should follow the ISO 8601 format YYYY-MM-DDThh:mm:ssZ. The Time Generated value cannot be older than 2 days before received time or more than a day in the future. In such case, the time that the message is ingested will be used.|
| | |

## Authorization
Any request to the Azure Monitor HTTP Data Collector API must include an authorization header. To authenticate a request, sign the request with either the primary or the secondary key for the workspace that's making the request. Then, pass that signature as part of the request.   

Here's the format for the authorization header:


```sql
Authorization: SharedKey <WorkspaceID>:<Signature>
```

*WorkspaceID* is the unique identifier for the Log Analytics workspace. *Signature* is a [Hash-based Message Authentication Code (HMAC)](/dotnet/api/system.security.cryptography.hmacsha256) that's constructed from the request and then computed by using the [SHA256 algorithm](/dotnet/api/system.security.cryptography.sha256). Then, you encode it by using Base64 encoding.

Use this format to encode the **SharedKey** signature string:


```ruby
StringToSign = VERB + "\n" +
                  Content-Length + "\n" +
                  Content-Type + "\n" +
                  "x-ms-date:" + x-ms-date + "\n" +
                  "/api/logs";
```

Here's an example of a signature string:


```ruby
POST\n1024\napplication/json\nx-ms-date:Mon, 04 Apr 2016 08:00:00 GMT\n/api/logs
```

When you have the signature string, encode it by using the HMAC-SHA256 algorithm on the UTF-8-encoded string, and then encode the result as Base64. Use this format:


```sql
Signature=Base64(HMAC-SHA256(UTF8(StringToSign)))
```

The samples in the next sections have sample code to help you create an authorization header.

## Request body
The body of the message must be in JSON. It must include one or more records with the property name and value pairs in the following format. The property name can contain only letters, numbers, and the underscore (_) character.

```json
[
    {
        "property 1": "value1",
        "property 2": "value2",
        "property 3": "value3",
        "property 4": "value4"
    }
]
```

You can batch multiple records together in a single request by using the following format. All the records must be the same record type.

```json
[
    {
        "property 1": "value1",
        "property 2": "value2",
        "property 3": "value3",
        "property 4": "value4"
    },
    {
        "property 1": "value1",
        "property 2": "value2",
        "property 3": "value3",
        "property 4": "value4"
    }
]
```

## Record type and properties
You define a custom record type when you submit data through the Azure Monitor HTTP Data Collector API. Currently, you can't write data to existing record types that were created by other data types and solutions. Azure Monitor reads the incoming data and then creates properties that match the data types of the values that you enter.

Each request to the Data Collector API must include a **Log-Type** header with the name for the record type. The suffix **_CL** is automatically appended to the name you enter to distinguish it from other log types as a custom log. For example, if you enter the name **MyNewRecordType**, Azure Monitor creates a record with the type **MyNewRecordType_CL**. This helps ensure that there are no conflicts between user-created type names and those shipped in current or future Microsoft solutions.

To identify a property's data type, Azure Monitor adds a suffix to the property name. If a property contains a null value, the property isn't included in that record. This table lists the property data type and corresponding suffix:

| Property data type | Suffix |
|:--- |:--- |
| String |_s |
| Boolean |_b |
| Double |_d |
| Date/time |_t |
| GUID (stored as a string) |_g |
| | |

> [!NOTE]
> String values that appear to be GUIDs are given the _g suffix and formatted as a GUID, even if the incoming value doesn't include dashes. For example, both "8145d822-13a7-44ad-859c-36f31a84f6dd" and "8145d82213a744ad859c36f31a84f6dd" are stored as "8145d822-13a7-44ad-859c-36f31a84f6dd". The only differences between this and another string are the _g in the name and the insertion of dashes if they aren't provided in the input. 

The data type that Azure Monitor uses for each property depends on whether the record type for the new record already exists.

* If the record type doesn't exist, Azure Monitor creates a new one by using the JSON type inference to determine the data type for each property for the new record.
* If the record type does exist, Azure Monitor attempts to create a new record based on existing properties. If the data type for a property in the new record doesn’t match and can’t be converted to the existing type, or if the record includes a property that doesn’t exist, Azure Monitor creates a new property that has the relevant suffix.

For example, the following submission entry would create a record with three properties, **number_d**, **boolean_b**, and **string_s**:
<!-- convertborder later -->
:::image type="content" source="media/data-collector-api/record-01.png" lightbox="media/data-collector-api/record-01.png" alt-text="Screenshot of sample record 1." border="false":::

If you were to submit this next entry, with all values formatted as strings, the properties wouldn't change. You can convert the values to existing data types.
<!-- convertborder later -->
:::image type="content" source="media/data-collector-api/record-02.png" lightbox="media/data-collector-api/record-02.png" alt-text="Screenshot of sample record 2." border="false":::

But, if you then make this next submission, Azure Monitor would create the new properties **boolean_d** and **string_d**. You can't convert these values.
<!-- convertborder later -->
:::image type="content" source="media/data-collector-api/record-03.png" lightbox="media/data-collector-api/record-03.png" alt-text="Screenshot of sample record 3." border="false":::

If you then submit the following entry, before the record type is created, Azure Monitor would create a record with three properties, **number_s**, **boolean_s**, and **string_s**. In this entry, each of the initial values is formatted as a string:
<!-- convertborder later -->
:::image type="content" source="media/data-collector-api/record-04.png" lightbox="media/data-collector-api/record-04.png" alt-text="Screenshot of sample record 4." border="false":::

## Reserved properties
The following properties are reserved and shouldn't be used in a custom record type. You'll receive an error if your payload includes any of these property names:

- tenant
- TimeGenerated
- RawData

## Data limits
The data posted to the Azure Monitor Data collection API is subject to certain constraints:

* Maximum of 30 MB per post to Azure Monitor Data Collector API. This is a size limit for a single post. If the data from a single post exceeds 30 MB, you should split the data into smaller sized chunks and send them concurrently.
* Maximum of 32 KB for field values. If the field value is greater than 32 KB, the data will be truncated.
* Recommended maximum of 50 fields for a given type. This is a practical limit from a usability and search experience perspective.  
* Tables in Log Analytics workspaces support only up to 500 columns (referred to as fields in this article). 
* Maximum of 45 characters for column names.

## Return codes
The HTTP status code 200 means that the request has been received for processing. This indicates that the operation finished successfully.

The complete set of status codes that the service might return is listed in the following table:

| Code | Status | Error code | Description |
|:--- |:--- |:--- |:--- |
| 200 |OK | |The request was successfully accepted. |
| 400 |Bad request |InactiveCustomer |The workspace has been closed. |
| 400 |Bad request |InvalidApiVersion |The API version that you specified wasn't recognized by the service. |
| 400 |Bad request |InvalidCustomerId |The specified workspace ID is invalid. |
| 400 |Bad request |InvalidDataFormat |An invalid JSON was submitted. The response body might contain more information about how to resolve the error. |
| 400 |Bad request |InvalidLogType |The specified log type contained special characters or numerics. |
| 400 |Bad request |MissingApiVersion |The API version wasn’t specified. |
| 400 |Bad request |MissingContentType |The content type wasn’t specified. |
| 400 |Bad request |MissingLogType |The required value log type wasn’t specified. |
| 400 |Bad request |UnsupportedContentType |The content type wasn't set to **application/json**. |
| 403 |Forbidden |InvalidAuthorization |The service failed to authenticate the request. Verify that the workspace ID and connection key are valid. |
| 404 |Not Found | | Either the provided URL is incorrect or the request is too large. |
| 429 |Too Many Requests | | The service is experiencing a high volume of data from your account. Please retry the request later. |
| 500 |Internal Server Error |UnspecifiedError |The service encountered an internal error. Please retry the request. |
| 503 |Service Unavailable |ServiceUnavailable |The service currently is unavailable to receive requests. Please retry your request. |
| | |

## Query data
To query data submitted by the Azure Monitor HTTP Data Collector API, search for records whose **Type** is equal to the **LogType** value that you specified and appended with **_CL**. For example, if you used **MyCustomLog**, you would return all records with `MyCustomLog_CL`.

## Sample requests
In this section are samples that demonstrate how to submit data to the Azure Monitor HTTP Data Collector API by using various programming languages.

For each sample, set the variables for the authorization header by doing the following:

1. In the Azure portal, locate your Log Analytics workspace.
2. Select **Agents**.
2. To the right of **Workspace ID**, select the **Copy** icon, and then paste the ID as the value of the **Customer ID** variable.
3. To the right of **Primary Key**, select the **Copy** icon, and then paste the ID as the value of the **Shared Key** variable.

Alternatively, you can change the variables for the log type and JSON data.

### [PowerShell](#tab/powershell)

```powershell
# Replace with your Workspace ID
$CustomerId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  

# Replace with your Primary Key
$SharedKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Specify the name of the record type that you'll be creating
$LogType = "MyRecordType"

# Optional name of a field that includes the timestamp for the data. If the time field is not specified, Azure Monitor assumes the time is the message ingestion time
$TimeStampField = ""


# Create two records with the same set of properties to create
$json = @"
[{  "StringValue": "MyString1",
    "NumberValue": 42,
    "BooleanValue": true,
    "DateValue": "2019-09-12T20:00:00.625Z",
    "GUIDValue": "9909ED01-A74C-4874-8ABF-D2678E3AE23D"
},
{   "StringValue": "MyString2",
    "NumberValue": 43,
    "BooleanValue": false,
    "DateValue": "2019-09-12T20:00:00.625Z",
    "GUIDValue": "8809ED01-A74C-4874-8ABF-D2678E3AE23D"
}]
"@

# Create the function to create the authorization signature
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

# Create the function to create and post the request
Function Post-LogAnalyticsData($customerId, $sharedKey, $body, $logType)
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
Post-LogAnalyticsData -customerId $customerId -sharedKey $sharedKey -body ([System.Text.Encoding]::UTF8.GetBytes($json)) -logType $logType  
```

### [C#](#tab/c-sharp)
```csharp
using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace OIAPIExample
{
	class ApiExample
	{
		// An example JSON object, with key/value pairs
		static string json = @"[{""DemoField1"":""DemoValue1"",""DemoField2"":""DemoValue2""},{""DemoField3"":""DemoValue3"",""DemoField4"":""DemoValue4""}]";

		// Update customerId to your Log Analytics workspace ID
		static string customerId = "xxxxxxxx-xxx-xxx-xxx-xxxxxxxxxxxx";

		// For sharedKey, use either the primary or the secondary Connected Sources client authentication key   
		static string sharedKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

		// LogName is name of the event type that is being submitted to Azure Monitor
		static string LogName = "DemoExample";

		// You can use an optional field to specify the timestamp from the data. If the time field is not specified, Azure Monitor assumes the time is the message ingestion time
		static string TimeStampField = "";

		static void Main()
		{
			// Create a hash for the API signature
			var datestring = DateTime.UtcNow.ToString("r");
			var jsonBytes = Encoding.UTF8.GetBytes(json);
			string stringToHash = "POST\n" + jsonBytes.Length + "\napplication/json\n" + "x-ms-date:" + datestring + "\n/api/logs";
			string hashedString = BuildSignature(stringToHash, sharedKey);
			string signature = "SharedKey " + customerId + ":" + hashedString;

			PostData(signature, datestring, json);
		}

		// Build the API signature
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

		// Send a request to the POST API endpoint
		public static void PostData(string signature, string date, string json)
		{
			try
			{
				string url = "https://" + customerId + ".ods.opinsights.azure.com/api/logs?api-version=2016-04-01";

				System.Net.Http.HttpClient client = new System.Net.Http.HttpClient();
				client.DefaultRequestHeaders.Add("Accept", "application/json");
				client.DefaultRequestHeaders.Add("Log-Type", LogName);
				client.DefaultRequestHeaders.Add("Authorization", signature);
				client.DefaultRequestHeaders.Add("x-ms-date", date);
				client.DefaultRequestHeaders.Add("time-generated-field", TimeStampField);

				// If charset=utf-8 is part of the content-type header, the API call may return forbidden.
				System.Net.Http.HttpContent httpContent = new StringContent(json, Encoding.UTF8);
				httpContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
				Task<System.Net.Http.HttpResponseMessage> response = client.PostAsync(new Uri(url), httpContent);

				System.Net.Http.HttpContent responseContent = response.Result.Content;
				string result = responseContent.ReadAsStringAsync().Result;
				Console.WriteLine("Return Result: " + result);
			}
			catch (Exception excep)
			{
				Console.WriteLine("API Post Exception: " + excep.Message);
			}
		}
	}
}

```

### [Python](#tab/python)

>[!NOTE]
> If using Python 2, you may need to change the line:
> `bytes_to_hash = bytes(string_to_hash, encoding="utf-8")`
> to
> `bytes_to_hash = bytes(string_to_hash).encode("utf-8")`

```python
import json
import requests
import datetime
import hashlib
import hmac
import base64

# Update the customer ID to your Log Analytics workspace ID
customer_id = 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

# For the shared key, use either the primary or the secondary Connected Sources client authentication key   
shared_key = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# The log type is the name of the event that is being submitted
log_type = 'WebMonitorTest'

# An example JSON web monitor object
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

# Build the API signature
def build_signature(customer_id, shared_key, date, content_length, method, content_type, resource):
    x_headers = 'x-ms-date:' + date
    string_to_hash = method + "\n" + str(content_length) + "\n" + content_type + "\n" + x_headers + "\n" + resource
    bytes_to_hash = bytes(string_to_hash, encoding="utf-8")  
    decoded_key = base64.b64decode(shared_key)
    encoded_hash = base64.b64encode(hmac.new(decoded_key, bytes_to_hash, digestmod=hashlib.sha256).digest()).decode()
    authorization = "SharedKey {}:{}".format(customer_id,encoded_hash)
    return authorization

# Build and send a request to the POST API
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
    if (response.status_code >= 200 and response.status_code <= 299):
        print('Accepted')
    else:
        print("Response code: {}".format(response.status_code))

post_data(customer_id, shared_key, body, log_type)
```


### [Java](#tab/java)

```java

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.http.MediaType;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Calendar;
import java.util.TimeZone;
import java.util.Locale;

import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

public class ApiExample {

  private static final String workspaceId = "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
  private static final String sharedKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
  private static final String logName = "DemoExample";
  /*
  You can use an optional field to specify the timestamp from the data. If the time field is not specified,
  Azure Monitor assumes the time is the message ingestion time
   */
  private static final String timestamp = "";
  private static final String json = "{\"name\": \"test\",\n" + "  \"id\": 1\n" + "}";
  private static final String RFC_1123_DATE = "EEE, dd MMM yyyy HH:mm:ss z";

  public static void main(String[] args) throws IOException, NoSuchAlgorithmException, InvalidKeyException {
    String dateString = getServerTime();
    String httpMethod = "POST";
    String contentType = "application/json";
    String xmsDate = "x-ms-date:" + dateString;
    String resource = "/api/logs";
    String stringToHash = String
        .join("\n", httpMethod, String.valueOf(json.getBytes(StandardCharsets.UTF_8).length), contentType,
            xmsDate , resource);
    String hashedString = getHMAC256(stringToHash, sharedKey);
    String signature = "SharedKey " + workspaceId + ":" + hashedString;

    postData(signature, dateString, json);
  }

  private static String getServerTime() {
    Calendar calendar = Calendar.getInstance();
    SimpleDateFormat dateFormat = new SimpleDateFormat(RFC_1123_DATE, Locale.US);
    dateFormat.setTimeZone(TimeZone.getTimeZone("GMT"));
    return dateFormat.format(calendar.getTime());
  }

  private static void postData(String signature, String dateString, String json) throws IOException {
    String url = "https://" + workspaceId + ".ods.opinsights.azure.com/api/logs?api-version=2016-04-01";
    HttpPost httpPost = new HttpPost(url);
    httpPost.setHeader("Authorization", signature);
    httpPost.setHeader(CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
    httpPost.setHeader("Log-Type", logName);
    httpPost.setHeader("x-ms-date", dateString);
    httpPost.setHeader("time-generated-field", timestamp);
    httpPost.setEntity(new StringEntity(json));
    try(CloseableHttpClient httpClient = HttpClients.createDefault()){
      HttpResponse response = httpClient.execute(httpPost);
      int statusCode = response.getStatusLine().getStatusCode();
      System.out.println("Status code: " + statusCode);
    }
  }

  private static String getHMAC256(String input, String key) throws InvalidKeyException, NoSuchAlgorithmException {
    String hash;
    Mac sha256HMAC = Mac.getInstance("HmacSHA256");
    Base64.Decoder decoder = Base64.getDecoder();
    SecretKeySpec secretKey = new SecretKeySpec(decoder.decode(key.getBytes(StandardCharsets.UTF_8)), "HmacSHA256");
    sha256HMAC.init(secretKey);
    Base64.Encoder encoder = Base64.getEncoder();
    hash = new String(encoder.encode(sha256HMAC.doFinal(input.getBytes(StandardCharsets.UTF_8))));
    return hash;
  }

}


```


---

## Alternatives and considerations

Although the Data Collector API should cover most of your needs as you collect free-form data into Azure Logs, you might require an alternative approach to overcome some of the limitations of the API. Your options, including major considerations, are listed in the following table:

| Alternative | Description | Best suited for |
|---|---|---|
| [Custom events](../app/api-custom-events-metrics.md?toc=%2Fazure%2Fazure-monitor%2Ftoc.json#properties): Native SDK-based ingestion in Application Insights | Application Insights, usually instrumented through an SDK within your application, gives you the ability to send custom data through Custom Events. | <ul><li> Data that's generated within your application, but not picked up by the SDK through one of the default data types (requests, dependencies, exceptions, and so on).</li><li> Data that's most often correlated with other application data in Application Insights. </li></ul> |
| Data Collector API in Azure Monitor Logs | The Data Collector API in Azure Monitor Logs is a completely open-ended way to ingest data. Any data that's formatted in a JSON object can be sent here. After it's sent, it's processed and made available in Monitor Logs to be correlated with other data in Monitor Logs or against other Application Insights data. <br/><br/> It's fairly easy to upload the data as files to an Azure Blob Storage blob, where the files will be processed and then uploaded to Log Analytics. For a sample implementation, see [Create a data pipeline with the Data Collector API](./create-pipeline-datacollector-api.md). | <ul><li> Data that isn't necessarily generated within an application that's instrumented within Application Insights.<br>Examples include lookup and fact tables, reference data, pre-aggregated statistics, and so on. </li><li> Data that will be cross-referenced against other Azure Monitor data (Application Insights, other Monitor Logs data types, Defender for Cloud, Container insights and virtual machines, and so on). </li></ul> |
| [Azure Data Explorer](/azure/data-explorer/ingest-data-overview) | Azure Data Explorer, now generally available to the public, is the data platform that powers Application Insights Analytics and Azure Monitor Logs. By using the data platform in its raw form, you have complete flexibility (but require the overhead of management) over the cluster (Kubernetes role-based access control (RBAC), retention rate, schema, and so on). Azure Data Explorer provides many [ingestion options](/azure/data-explorer/ingest-data-overview#ingestion-methods), including [CSV, TSV, and JSON](/azure/kusto/management/mappings) files. | <ul><li> Data that won't be correlated with any other data under Application Insights or Monitor Logs. </li><li> Data that requires advanced ingestion or processing capabilities that aren't available today in Azure Monitor Logs. </li></ul> |



## Next steps
- Use the [Log Search API](./log-query-overview.md) to retrieve data from the Log Analytics workspace.

- Learn more about how to [create a data pipeline with the Data Collector API](create-pipeline-datacollector-api.md) by using a Logic Apps workflow to Azure Monitor.

