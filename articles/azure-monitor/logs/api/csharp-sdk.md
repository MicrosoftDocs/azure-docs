---
title: C# SDK
description: A C# SDK is made available for querying a Log Analytics Workspace. It supports the full query language.
author: bwren
ms.author: bwren
ms.date: 08/18/2021
ms.topic: article
---
# C\# SDK

A [C\# SDK](https://www.nuget.org/packages/Microsoft.Azure.OperationalInsights/) is available for querying a Log Analytics Workspace. It supports the full query language.

## Using the SDK

You can also use the [Microsoft.Rest.ClientRuntime.Azure.Authentication](https://www.nuget.org/packages/Microsoft.Rest.ClientRuntime.Azure.Authentication/) package for easier authentication with AAD instead of your own implementation of ServiceClientCredentials.

## Sample

```
    using System;
    using Microsoft.Azure.OperationalInsights;
    using Microsoft.Rest.Azure.Authentication;
    
    namespace QuerySample
    {
        class Program
        {
            static void Main(string[] args)
            {
                var workspaceId = "<your workspace ID>";
                var clientId = "<your client ID>";
                var clientSecret = "<your client secret>";
    
                var domain = "<your AAD domain>";
                var authEndpoint = "https://login.microsoftonline.com";
                var tokenAudience = "https://api.loganalytics.io/";
    
                var adSettings = new ActiveDirectoryServiceSettings
                {
                    AuthenticationEndpoint = new Uri(authEndpoint),
                    TokenAudience = new Uri(tokenAudience),
                    ValidateAuthority = true
                };
    
                var creds = ApplicationTokenProvider.LoginSilentAsync(domain, clientId, clientSecret, adSettings).GetAwaiter().GetResult();
    
                var client = new OperationalInsightsDataClient(creds);
                client.WorkspaceId = workspaceId;
    
                var results = client.Query("union * | take 5");
    
                Console.WriteLine(results);
    
                // TODO process the results
            }
        }
    }
```

## Notes

Due to the limitations of OpenAPI Specification 2.0, all row values are interpreted as strings. When processing query data, you may need to leverage the column definitions for each column, which indicate the type that can be parsed from each row. You can find the list of data types at <https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/operationalinsights/Microsoft.Azure.OperationalInsights/src>
