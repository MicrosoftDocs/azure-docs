---
title: Use the REST API to create a Metrics monitoring solution
description: Learn how use the REST API to create a Metrics monitoring solution
ms.date: 07/07/2020
ms.topic: conceptual
ms.author: aahi
---

# Use API to build solution

This quickstart shows you how to use REST APIs to build your own anomaly detection solution. 
In most cases you can prepare and build your onw solution in the following steps:

* add a data feed
* check ingest status
* setup detection configuration and alert configuration
* query anomalies

## Before you start
 some prerequisites 
 Before you create and submit the request, you will need:
 * The {subscription-key} for this access,find in your Cognitive Services accounts.
 * One of following data sources which have time series data you want to detect:
     * Azure Blob Storage (JSON)
     * Azure Cosmos DB (SQL)
     * Azure Data Explorer (Kusto)
     * Azure Event Hubs
     * Azure Table Storage
     * SQL Server 
     * MySQL
     * PostgreSQL
     * MongoDB

## Add a data feed

  To onboard time series data,you need add a data feed using REST API. Project "Gualala" provides a unique and easy experience to onboard time series data from various types of data sources. To add a data feed, you need provide data schema according to the data source type and parameters.

###Request basics

* Request URL
  https://{endpoint}/anomalydetector-ee/v1.0/datafeeds

* Request headers

  Content-Type string Media type of the body sent to the API.

  Ocp-Apim-Subscription-Key string Subscription key which provides access to this API. Found in your Cognitive Services accounts.

* Request body

```json
{
  "dataSourceParameter": {
    "connectionString": "Server=ad-sample.database.windows.net,1433;Initial Catalog=ad-sample;Persist Security Info=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;",
    "script": "select * from adsample2 where Timestamp = @StartTime"
  },
  "datafeedId": "00000000-0000-0000-0000-000000000000",
  "datafeedName": "Datafeed dummy name",
  "metrics": [
    {
      "metricName": "cost",
      "metricDisplayName": "cost",
      "metricDescription": ""
    },
    {
      "metricName": "revenue",
      "metricDisplayName": "revenue",
      "metricDescription": ""
    }
  ],
  "dimension": [
    {
      "dimensionName": "category",
      "dimensionDisplayName": "category"
    },
    {
      "dimensionName": "city",
      "dimensionDisplayName": "city"
    }
  ],
  "dataStartFrom": "2019-10-01T00:00:00.0000000+00:00",
  "dataSourceType": "SqlServer",
  "timestampColumn": "timestamp",
  "startOffsetInSeconds": 86400,
  "maxQueryPerMinute": 30,
  "granularityName": 3,
  "granularityAmount": null,
  "allUpIdentification": "__SUM__",
  "needRollup": "NeedRollup",
  "fillMissingPointType": "PreviousValue",
  "fillMissingPointValue": 0,
  "rollUpMethod": "Sum",
  "stopRetryAfterInSeconds": 604800,
  "rollUpColumns": "",
  "minRetryIntervalInSeconds": 3600,
  "maxConcurrency": 30,
  "datafeedDescription": "",
  "viewMode": "Private",
  "admins": [
    "example@demo.com"
  ],
  "viewers": [ ],
  "creator": "example@demo.com",
  "status": "Active",
  "createdTime": "2020-03-27T14:00:15.0000000+00:00",
  "isAdmin": true,
  "actionLinkTemplate": ""
}
```

### Code sample

```java
// // This sample uses the Apache HTTP client from HTTP Components (http://hc.apache.org/httpcomponents-client-ga/)
import java.net.URI;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class JavaSample 
{
    public static void main(String[] args) 
    {
        HttpClient httpclient = HttpClients.createDefault();

        try
        {
            URIBuilder builder = new URIBuilder("https://adv2-apim-test.azure-api.net/anomalydetector/v2.0/datafeeds");


            URI uri = builder.build();
            HttpPost request = new HttpPost(uri);
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", "{subscription key}");


            // Request body
            StringEntity reqEntity = new StringEntity("{body}");
            request.setEntity(reqEntity);

            HttpResponse response = httpclient.execute(request);
            HttpEntity entity = response.getEntity();

            if (entity != null) 
            {
                System.out.println(EntityUtils.toString(entity));
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
```

```C#
using System;
using System.Net.Http.Headers;
using System.Text;
using System.Net.Http;
using System.Web;

namespace CSHttpClientSample
{
    static class Program
    {
        static void Main()
        {
            MakeRequest();
            Console.WriteLine("Hit ENTER to exit...");
            Console.ReadLine();
        }
        
        static async void MakeRequest()
        {
            var client = new HttpClient();
            var queryString = HttpUtility.ParseQueryString(string.Empty);

            // Request headers
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "{subscription key}");

            var uri = "https://adv2-apim-test.azure-api.net/anomalydetector/v2.0/datafeeds?" + queryString;

            HttpResponseMessage response;

            // Request body
            byte[] byteData = Encoding.UTF8.GetBytes("{body}");

            using (var content = new ByteArrayContent(byteData))
            {
               content.Headers.ContentType = new MediaTypeHeaderValue("< your content type, i.e. application/json >");
               response = await client.PostAsync(uri, content);
            }

        }
    }
}    
```

```JavaScript
<!DOCTYPE html>
<html>
<head>
    <title>JSSample</title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
</head>
<body>

<script type="text/javascript">
    $(function() {
        var params = {
            // Request parameters
        };
      
        $.ajax({
            url: "https://adv2-apim-test.azure-api.net/anomalydetector/v2.0/datafeeds?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","{subscription key}");
            },
            type: "POST",
            // Request body
            data: "{body}",
        })
        .done(function(data) {
            alert("success");
        })
        .fail(function() {
            alert("error");
        });
    });
</script>
</body>
</html>
```

=== "Python"
```Python
########### Python 2.7 #############
import httplib, urllib, base64

headers = {
    # Request headers
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '{subscription key}',
}

params = urllib.urlencode({
})

try:
    conn = httplib.HTTPSConnection('adv2-apim-test.azure-api.net')
    conn.request("POST", "/anomalydetector/v2.0/datafeeds?%s" % params, "{body}", headers)
    response = conn.getresponse()
    data = response.read()
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

####################################

########### Python 3.2 #############
import http.client, urllib.request, urllib.parse, urllib.error, base64

headers = {
    # Request headers
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '{subscription key}',
}

params = urllib.parse.urlencode({
})

try:
    conn = http.client.HTTPSConnection('adv2-apim-test.azure-api.net')
    conn.request("POST", "/anomalydetector/v2.0/datafeeds?%s" % params, "{body}", headers)
    response = conn.getresponse()
    data = response.read()
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

```

## Check ingest status

After adding data feed, if you want to check the progress of an ingestion job, you can check it through following REST-based method.

### Request basics

* Request URL
  
  https://{endpoint}/anomalydetector-ee/v1.0/datafeeds/{datafeedId}/ingestionStatus/query[?$skip][&$top]

* Request parameters

  datafeedId        string      Format - uuid. The data feed unique id

  $skip (optional)  integer     Format - int32.

  $top (optional)   integer     Format - int32.

* Request headers

  Content-Type string Media type of the body sent to the API.

  Ocp-Apim-Subscription-Key string Subscription key which provides access to this API. Found in your Cognitive Services accounts.

* Request body

The query time range

```json
{
  "startTime": "2020-01-01T00:00:00.0000000+00:00",
  "endTime": "2020-01-04T00:00:00.0000000+00:00"
}
```
startTime: the start point of time range to query data ingestion status.
endTime: the end point of time range to query data ingestion status.

### Response

* Response 200
Success

```json
{
  "@nextLink": "https://demo.example.com/datafeeds/01234567-8901-2345-6789-012345678901/ingestionStatus/query?$skip=3&$top=1",
  "value": [
    {
      "timestamp": "2020-01-03T00:00:00.0000000+00:00",
      "status": "0",
      "message": ""
    },
    {
      "timestamp": "2020-01-02T00:00:00.0000000+00:00",
      "status": "3",
      "message": ""
    },
    {
      "timestamp": "2020-01-01T00:00:00.0000000+00:00",
      "status": "4",
      "message": "No valid record pulled from source for current timestamp 2020-01-01T00:00:00Z"
    }
  ]
}
```
timestamp: data slice timestamp
status:             
        "NotStarted",
        "Scheduled",
        "Running",
        "Succeeded",
        "Failed",
        "NoData",
        "Error",
        "Paused"
message: the trimmed message of last ingestion job.

* Response 400 or 500
Client error or server error (4xx or 5xx)

```json
{
  "message": "string",
  "code": 0
}
```

### Sample Code

```java
// // This sample uses the Apache HTTP client from HTTP Components (http://hc.apache.org/httpcomponents-client-ga/)
import java.net.URI;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class JavaSample 
{
    public static void main(String[] args) 
    {
        HttpClient httpclient = HttpClients.createDefault();

        try
        {
            URIBuilder builder = new URIBuilder("https://adv2-apim-test.azure-api.net/anomalydetector/v2.0/datafeeds/{datafeedId}/ingestionStatus/query");

            builder.setParameter("$skip", "{integer}");
            builder.setParameter("$top", "{integer}");

            URI uri = builder.build();
            HttpPost request = new HttpPost(uri);
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", "{subscription key}");


            // Request body
            StringEntity reqEntity = new StringEntity("{body}");
            request.setEntity(reqEntity);

            HttpResponse response = httpclient.execute(request);
            HttpEntity entity = response.getEntity();

            if (entity != null) 
            {
                System.out.println(EntityUtils.toString(entity));
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}

```

```C#
using System;
using System.Net.Http.Headers;
using System.Text;
using System.Net.Http;
using System.Web;

namespace CSHttpClientSample
{
    static class Program
    {
        static void Main()
        {
            MakeRequest();
            Console.WriteLine("Hit ENTER to exit...");
            Console.ReadLine();
        }
        
        static async void MakeRequest()
        {
            var client = new HttpClient();
            var queryString = HttpUtility.ParseQueryString(string.Empty);

            // Request headers
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "{subscription key}");

            // Request parameters
            queryString["$skip"] = "{integer}";
            queryString["$top"] = "{integer}";
            var uri = "https://adv2-apim-test.azure-api.net/anomalydetector/v2.0/datafeeds/{datafeedId}/ingestionStatus/query?" + queryString;

            HttpResponseMessage response;

            // Request body
            byte[] byteData = Encoding.UTF8.GetBytes("{body}");

            using (var content = new ByteArrayContent(byteData))
            {
               content.Headers.ContentType = new MediaTypeHeaderValue("< your content type, i.e. application/json >");
               response = await client.PostAsync(uri, content);
            }

        }
    }
}    
```

```JavaScript
<!DOCTYPE html>
<html>
<head>
    <title>JSSample</title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
</head>
<body>

<script type="text/javascript">
    $(function() {
        var params = {
            // Request parameters
            "$skip": "{integer}",
            "$top": "{integer}",
        };
      
        $.ajax({
            url: "https://adv2-apim-test.azure-api.net/anomalydetector/v2.0/datafeeds/{datafeedId}/ingestionStatus/query?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","{subscription key}");
            },
            type: "POST",
            // Request body
            data: "{body}",
        })
        .done(function(data) {
            alert("success");
        })
        .fail(function() {
            alert("error");
        });
    });
</script>
</body>
</html>
```

```Python
########### Python 2.7 #############
import httplib, urllib, base64

headers = {
    # Request headers
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '{subscription key}',
}

params = urllib.urlencode({
    # Request parameters
    '$skip': '{integer}',
    '$top': '{integer}',
})

try:
    conn = httplib.HTTPSConnection('adv2-apim-test.azure-api.net')
    conn.request("POST", "/anomalydetector/v2.0/datafeeds/{datafeedId}/ingestionStatus/query?%s" % params, "{body}", headers)
    response = conn.getresponse()
    data = response.read()
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

####################################

########### Python 3.2 #############
import http.client, urllib.request, urllib.parse, urllib.error, base64

headers = {
    # Request headers
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '{subscription key}',
}

params = urllib.parse.urlencode({
    # Request parameters
    '$skip': '{integer}',
    '$top': '{integer}',
})

try:
    conn = http.client.HTTPSConnection('adv2-apim-test.azure-api.net')
    conn.request("POST", "/anomalydetector/v2.0/datafeeds/{datafeedId}/ingestionStatus/query?%s" % params, "{body}", headers)
    response = conn.getresponse()
    data = response.read()
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))
```

## Create anomaly detection configuration

  There is a default configuration for each metric. Through the parameters in anomaly detection configuration, you can tune specific detection mode of your anomaly detection.
  
### Request basics

* Request URL
  
  https://{endpoint}/anomalydetector-ee/v1.0/enrichment/anomalyDetection/configurations

* Request headers

  Content-Type string Media type of the body sent to the API.

  Ocp-Apim-Subscription-Key string Subscription key which provides access to this API. Found in your Cognitive Services accounts.

* Request body

anomaly detection configuration

```json
{
  "name": "string",
  "description": "string",
  "metricId": "string",
  "wholeMetricConfiguration": {
    "conditionOperator": "AND",
    "smartDetectionCondition": {
      "sensitivity": 0.0,
      "boundaryVersion": 0,
      "anomalyDetectorDirection": "Both",
      "suppressCondition": {
        "minNumber": 0,
        "minRatio": 0.0
      }
    },
    "hardThresholdCondition": {
      "lowerBound": 0.0,
      "upperBound": 0.0,
      "anomalyDetectorDirection": "Both",
      "suppressCondition": {
        "minNumber": 0,
        "minRatio": 0.0
      }
    },
    "changeThresholdCondition": {
      "changePercentage": 0.0,
      "shiftPoint": 0,
      "anomalyDetectorDirection": "Both",
      "suppressCondition": {
        "minNumber": 0,
        "minRatio": 0.0
      }
    }
  },
  "dimensionGroupOverrideConfigurations": [
    {
      "group": {
        "dimension": {}
      },
      "conditionOperator": "AND",
      "smartDetectionCondition": {
        "sensitivity": 0.0,
        "boundaryVersion": 0,
        "anomalyDetectorDirection": "Both",
        "suppressCondition": {
          "minNumber": 0,
          "minRatio": 0.0
        }
      },
      "hardThresholdCondition": {
        "lowerBound": 0.0,
        "upperBound": 0.0,
        "anomalyDetectorDirection": "Both",
        "suppressCondition": {
          "minNumber": 0,
          "minRatio": 0.0
        }
      },
      "changeThresholdCondition": {
        "changePercentage": 0.0,
        "shiftPoint": 0,
        "anomalyDetectorDirection": "Both",
        "suppressCondition": {
          "minNumber": 0,
          "minRatio": 0.0
        }
      }
    }
  ],
  "seriesOverrideConfigurations": [
    {
      "series": {
        "dimension": {}
      },
      "conditionOperator": "AND",
      "smartDetectionCondition": {
        "sensitivity": 0.0,
        "boundaryVersion": 0,
        "anomalyDetectorDirection": "Both",
        "suppressCondition": {
          "minNumber": 0,
          "minRatio": 0.0
        }
      },
      "hardThresholdCondition": {
        "lowerBound": 0.0,
        "upperBound": 0.0,
        "anomalyDetectorDirection": "Both",
        "suppressCondition": {
          "minNumber": 0,
          "minRatio": 0.0
        }
      },
      "changeThresholdCondition": {
        "changePercentage": 0.0,
        "shiftPoint": 0,
        "anomalyDetectorDirection": "Both",
        "suppressCondition": {
          "minNumber": 0,
          "minRatio": 0.0
        }
      }
    }
  ],
  "favoriteSeries": [
    {
      "dimension": {}
    }
  ]
}
```

### Response

* Response 201
Success

* Response 400 or 500
Client error or server error (4xx or 5xx)

```json
{
  "message": "string",
  "code": 0
}
```

### Sample Code

```java
// // This sample uses the Apache HTTP client from HTTP Components (http://hc.apache.org/httpcomponents-client-ga/)
import java.net.URI;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class JavaSample 
{
    public static void main(String[] args) 
    {
        HttpClient httpclient = HttpClients.createDefault();

        try
        {
            URIBuilder builder = new URIBuilder("https://adv2-apim-test.azure-api.net/anomalydetector/v2.0/enrichment/anomalyDetection/configurations");


            URI uri = builder.build();
            HttpPost request = new HttpPost(uri);
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", "{subscription key}");


            // Request body
            StringEntity reqEntity = new StringEntity("{body}");
            request.setEntity(reqEntity);

            HttpResponse response = httpclient.execute(request);
            HttpEntity entity = response.getEntity();

            if (entity != null) 
            {
                System.out.println(EntityUtils.toString(entity));
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
```

```C#
using System;
using System.Net.Http.Headers;
using System.Text;
using System.Net.Http;
using System.Web;

namespace CSHttpClientSample
{
    static class Program
    {
        static void Main()
        {
            MakeRequest();
            Console.WriteLine("Hit ENTER to exit...");
            Console.ReadLine();
        }
        
        static async void MakeRequest()
        {
            var client = new HttpClient();
            var queryString = HttpUtility.ParseQueryString(string.Empty);

            // Request headers
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "{subscription key}");

            var uri = "https://adv2-apim-test.azure-api.net/anomalydetector/v2.0/enrichment/anomalyDetection/configurations?" + queryString;

            HttpResponseMessage response;

            // Request body
            byte[] byteData = Encoding.UTF8.GetBytes("{body}");

            using (var content = new ByteArrayContent(byteData))
            {
               content.Headers.ContentType = new MediaTypeHeaderValue("< your content type, i.e. application/json >");
               response = await client.PostAsync(uri, content);
            }

        }
    }
}    
```

```JavaScript
<!DOCTYPE html>
<html>
<head>
    <title>JSSample</title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
</head>
<body>

<script type="text/javascript">
    $(function() {
        var params = {
            // Request parameters
        };
      
        $.ajax({
            url: "https://adv2-apim-test.azure-api.net/anomalydetector/v2.0/enrichment/anomalyDetection/configurations?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","{subscription key}");
            },
            type: "POST",
            // Request body
            data: "{body}",
        })
        .done(function(data) {
            alert("success");
        })
        .fail(function() {
            alert("error");
        });
    });
</script>
</body>
</html>
```

```Python
########### Python 2.7 #############
import httplib, urllib, base64

headers = {
    # Request headers
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '{subscription key}',
}

params = urllib.urlencode({
})

try:
    conn = httplib.HTTPSConnection('adv2-apim-test.azure-api.net')
    conn.request("POST", "/anomalydetector/v2.0/enrichment/anomalyDetection/configurations?%s" % params, "{body}", headers)
    response = conn.getresponse()
    data = response.read()
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

####################################

########### Python 3.2 #############
import http.client, urllib.request, urllib.parse, urllib.error, base64

headers = {
    # Request headers
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '{subscription key}',
}

params = urllib.parse.urlencode({
})

try:
    conn = http.client.HTTPSConnection('adv2-apim-test.azure-api.net')
    conn.request("POST", "/anomalydetector/v2.0/enrichment/anomalyDetection/configurations?%s" % params, "{body}", headers)
    response = conn.getresponse()
    data = response.read()
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))
```

## Query anomalies 

The following sample code shows you how to use REST APIs to query anomalies under anomaly detection configuration.In fact, there are various ways to get anomaly detection result. For more diagnostic tools please refer to how-to section. 

### Request basics

* Request URL
  
  https://{endpoint}/anomalydetector-ee/v1.0/enrichment/anomalyDetection/configurations/{configurationId}/anomalies/query[?$skip][&$top]

* Request parameters

  configurationId   string  Format - uuid. anomaly detection configuration unique id

  $skip (optional)  integer Format - int32.

  $top (optional)   integer Format - int32.

* Request headers

  Content-Type string Media type of the body sent to the API.

  Ocp-Apim-Subscription-Key string Subscription key which provides access to this API. Found in your Cognitive Services accounts.

* Request body

Query detection result request

```json
{
  "startTime": "string",
  "endTime": "string",
  "filter": {
    "dimensionFilter": [
      {
        "dimension": {}
      }
    ],
    "severityFilter": {
      "min": "Low",
      "max": "Low"
    }
  }
}
```

### Response

* Response 200
Success

```json
{
  "@nextLink": "string",
  "value": [
    {
      "metricId": "string",
      "anomalyDetectionConfigurationId": "string",
      "timestamp": "string",
      "createdTime": "string",
      "modifiedTime": "string",
      "dimension": {},
      "value": 0.0,
      "property": {
        "anomalySeverity": "Low",
        "anomalyStatus": "Active"
      }
    }
  ]
}
```

* Response 400 or 500
Client error or server error (4xx or 5xx)

```json
{
  "message": "string",
  "code": 0
}
```

### Sample Code

```java
// // This sample uses the Apache HTTP client from HTTP Components (http://hc.apache.org/httpcomponents-client-ga/)
import java.net.URI;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class JavaSample 
{
    public static void main(String[] args) 
    {
        HttpClient httpclient = HttpClients.createDefault();

        try
        {
            URIBuilder builder = new URIBuilder("https://adv2-apim-test.azure-api.net/anomalydetector/v2.0/enrichment/anomalyDetection/configurations/{configurationId}/anomalies/query");

            builder.setParameter("$skip", "{integer}");
            builder.setParameter("$top", "{integer}");

            URI uri = builder.build();
            HttpPost request = new HttpPost(uri);
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", "{subscription key}");


            // Request body
            StringEntity reqEntity = new StringEntity("{body}");
            request.setEntity(reqEntity);

            HttpResponse response = httpclient.execute(request);
            HttpEntity entity = response.getEntity();

            if (entity != null) 
            {
                System.out.println(EntityUtils.toString(entity));
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
```

```C#
using System;
using System.Net.Http.Headers;
using System.Text;
using System.Net.Http;
using System.Web;

namespace CSHttpClientSample
{
    static class Program
    {
        static void Main()
        {
            MakeRequest();
            Console.WriteLine("Hit ENTER to exit...");
            Console.ReadLine();
        }
        
        static async void MakeRequest()
        {
            var client = new HttpClient();
            var queryString = HttpUtility.ParseQueryString(string.Empty);

            // Request headers
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "{subscription key}");

            // Request parameters
            queryString["$skip"] = "{integer}";
            queryString["$top"] = "{integer}";
            var uri = "https://adv2-apim-test.azure-api.net/anomalydetector/v2.0/enrichment/anomalyDetection/configurations/{configurationId}/anomalies/query?" + queryString;

            HttpResponseMessage response;

            // Request body
            byte[] byteData = Encoding.UTF8.GetBytes("{body}");

            using (var content = new ByteArrayContent(byteData))
            {
               content.Headers.ContentType = new MediaTypeHeaderValue("< your content type, i.e. application/json >");
               response = await client.PostAsync(uri, content);
            }

        }
    }
}    
```

```JavaScript
<!DOCTYPE html>
<html>
<head>
    <title>JSSample</title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
</head>
<body>

<script type="text/javascript">
    $(function() {
        var params = {
            // Request parameters
            "$skip": "{integer}",
            "$top": "{integer}",
        };
      
        $.ajax({
            url: "https://adv2-apim-test.azure-api.net/anomalydetector/v2.0/enrichment/anomalyDetection/configurations/{configurationId}/anomalies/query?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","{subscription key}");
            },
            type: "POST",
            // Request body
            data: "{body}",
        })
        .done(function(data) {
            alert("success");
        })
        .fail(function() {
            alert("error");
        });
    });
</script>
</body>
</html>
```

```Python
########### Python 2.7 #############
import httplib, urllib, base64

headers = {
    # Request headers
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '{subscription key}',
}

params = urllib.urlencode({
    # Request parameters
    '$skip': '{integer}',
    '$top': '{integer}',
})

try:
    conn = httplib.HTTPSConnection('adv2-apim-test.azure-api.net')
    conn.request("POST", "/anomalydetector/v2.0/enrichment/anomalyDetection/configurations/{configurationId}/anomalies/query?%s" % params, "{body}", headers)
    response = conn.getresponse()
    data = response.read()
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

####################################

########### Python 3.2 #############
import http.client, urllib.request, urllib.parse, urllib.error, base64

headers = {
    # Request headers
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '{subscription key}',
}

params = urllib.parse.urlencode({
    # Request parameters
    '$skip': '{integer}',
    '$top': '{integer}',
})

try:
    conn = http.client.HTTPSConnection('adv2-apim-test.azure-api.net')
    conn.request("POST", "/anomalydetector/v2.0/enrichment/anomalyDetection/configurations/{configurationId}/anomalies/query?%s" % params, "{body}", headers)
    response = conn.getresponse()
    data = response.read()
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))
```

## Next Steps
 - [Onboard metric data using REST API](../howto/datafeeds/add-data-feeds-using-RESTAPI.md)
 - [Set up detecting configuration using REST API](../howto/datafeeds/set-up-detecting-configuration-using-RESTAPI.md)
 - [Query detection result using REST API](../howto/datafeeds/query-detection-result-using-RESTAPI.md)