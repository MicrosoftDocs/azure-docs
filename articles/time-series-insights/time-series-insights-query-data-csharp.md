---
title: Query data from an Azure Time Series Insights environment using C# code | Microsoft Docs
description: This article describes how to query data from an Azure Time Series Insights environment by coding a custom app written in the  C# (C-sharp) .NET language.
ms.service: time-series-insights
services: time-series-insights
author: ashannon7
ms.author: anshan
manager: cshankar
reviewer: jasonwhowell, kfile, tsidocs
ms.devlang: csharp
ms.workload: big-data
ms.topic: conceptual
ms.date: 03/23/2018
---

# Query data from the Azure Time Series Insights environment using C#

This C# example demonstrates how to query data from the Azure Time Series Insights environment.
The sample shows several basic examples of Query API usage:
1. As a preparation step, acquire the access token through the Azure Active Directory API. Pass this token in the `Authorization` header of every Query API request. For setting up non-interactive applications, see [Authentication and authorization](time-series-insights-authentication-and-authorization.md). Also, ensure all the constants defined at the beginning of the sample are correctly set.
2. The list of environments that the user has access to is obtained. One of the environments is picked up as the environment of interest, and further data is queried for this environment.
3. As an example of HTTPS request, availability data is requested for the environment of interest.
4. As an example of web socket request, event aggregates data is requested for the environment of interest. Data is requested for the whole availability time range.

This example code is also available at [https://github.com/Azure-Samples/Azure-Time-Series-Insights](https://github.com/Azure-Samples/Azure-Time-Series-Insights)

## Project References
Add NuGet packages `Microsoft.IdentityModel.Clients.ActiveDirectory` and `Newtonsoft.Json` for this example. 

## C# example

```csharp
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace TimeSeriesInsightsQuerySample
{
    class Program
    {
        // For automated execution under application identity,
        // use application created in Active Directory.
        // To create the application in AAD, follow the steps provided here:
        // https://docs.microsoft.com/azure/time-series-insights/time-series-insights-authentication-and-authorization

        // SET the application ID of application registered in your Azure Active Directory
        private static string ApplicationClientId = "#DUMMY#";

        // SET the application key of the application registered in your Azure Active Directory
        private static string ApplicationClientSecret = "#DUMMY#";

        // SET the Azure Active Directory tenant.
        private static string Tenant = "#DUMMY#.onmicrosoft.com";

        public static async Task SampleAsync()
        {
            // Acquire an access token.
            string accessToken = await AcquireAccessTokenAsync();

            // Obtain list of environments and get environment FQDN for the environment of interest.
            string environmentFqdn;
            {
                HttpWebRequest request = CreateHttpsWebRequest("api.timeseries.azure.com", "GET", "environments", accessToken);
                JToken responseContent = await GetResponseAsync(request);

                JArray environmentsList = (JArray)responseContent["environments"];
                if (environmentsList.Count == 0)
                {
                    // List of user environments is empty, fallback to sample environment.
                    environmentFqdn = "10000000-0000-0000-0000-100000000108.env.timeseries.azure.com";
                }
                else
                {
                    // Assume the first environment is the environment of interest.
                    JObject firstEnvironment = (JObject)environmentsList[0];
                    environmentFqdn = firstEnvironment["environmentFqdn"].Value<string>();
                }
            }
            Console.WriteLine("Using environment FQDN '{0}'", environmentFqdn);
            Console.WriteLine();

            // Obtain availability data for the environment and get availability range.
            DateTime fromAvailabilityTimestamp;
            DateTime toAvailabilityTimestamp;
            {
                HttpWebRequest request = CreateHttpsWebRequest(environmentFqdn, "GET", "availability", accessToken);
                JToken responseContent = await GetResponseAsync(request);

                JObject range = (JObject)responseContent["range"];
                fromAvailabilityTimestamp = range["from"].Value<DateTime>();
                toAvailabilityTimestamp = range["to"].Value<DateTime>();
            }
            Console.WriteLine(
                "Obtained availability range [{0}, {1}]",
                fromAvailabilityTimestamp,
                toAvailabilityTimestamp);
            Console.WriteLine();

            // Assume data for the whole availablility range is requested.
            DateTime from = fromAvailabilityTimestamp;
            DateTime to = toAvailabilityTimestamp;

            // Obtain metadata for the environment.
            {
                JObject inputPayload = new JObject(
                    new JProperty("searchSpan", new JObject(
                        new JProperty("from", from),
                        new JProperty("to", to))));

                HttpWebRequest request = CreateHttpsWebRequest(environmentFqdn, "POST", "metadata", accessToken);
                await WriteRequestStreamAsync(request, inputPayload);
                JToken responseContent = await GetResponseAsync(request);

                DumpMetadata(responseContent);
                Console.WriteLine();
            }

            // Get events for the environment.
            {
                int requestedEventCount = 10;

                JObject contentInputPayload = new JObject(
                    new JProperty("take", requestedEventCount),
                    new JProperty("searchSpan", new JObject(
                        new JProperty("from", from),
                        new JProperty("to", to))));

                // Use HTTP request.
                HttpWebRequest request = CreateHttpsWebRequest(environmentFqdn, "POST", "events", accessToken, new[] { "timeout=PT20S" });
                await WriteRequestStreamAsync(request, contentInputPayload);
                JToken responseContent = await GetResponseAsync(request);

                Console.WriteLine("Requested {0} events via HTTP request.", requestedEventCount);
                DumpEvents(responseContent);
                Console.WriteLine();

                // Use WebSocket request.
                JObject inputPayload = new JObject(
                    // Send HTTP headers as a part of the message since .NET WebSocket does not support
                    // sending custom headers on HTTP GET upgrade request to WebSocket protocol request.
                    new JProperty("headers", new JObject(
                        new JProperty("x-ms-client-application-name", "TimeSeriesInsightsQuerySample"),
                        new JProperty("Authorization", "Bearer " + accessToken))),
                    new JProperty("content", contentInputPayload));
                IReadOnlyList<JToken> responseMessagesContent = await ReadWebSocketResponseAsync(environmentFqdn, "events", inputPayload);

                Console.WriteLine("Requested {0} events via WebSocket request.", requestedEventCount);
                DumpEventsStreamed(responseMessagesContent);
                Console.WriteLine();
            }

            // Get aggregates for the environment: group by Event Source Name and calculate number of events in each group.
            {
                JObject contentInputPayload = new JObject(
                    new JProperty("aggregates", new JArray(new JObject(
                        new JProperty("dimension", new JObject(
                            new JProperty("uniqueValues", new JObject(
                                new JProperty("input", new JObject(
                                    new JProperty("builtInProperty", "$esn"))),
                                new JProperty("take", 1000))))),
                        new JProperty("measures", new JArray(new JObject(
                            new JProperty("count", new JObject()))))))),
                    new JProperty("searchSpan", new JObject(
                        new JProperty("from", from),
                        new JProperty("to", to))));

                // Use HTTP request.
                HttpWebRequest request = CreateHttpsWebRequest(environmentFqdn, "POST", "aggregates", accessToken, new[] { "timeout=PT20S" });
                await WriteRequestStreamAsync(request, contentInputPayload);
                JToken responseContent = await GetResponseAsync(request);

                Console.WriteLine("Group by Event Source Name via HTTP request.");
                DumpAggregates(responseContent);
                Console.WriteLine();

                // Use WebSocket request.
                JObject inputPayload = new JObject(
                    // Send HTTP headers as a part of the message since .NET WebSocket does not support
                    // sending custom headers on HTTP GET upgrade request to WebSocket protocol request.
                    new JProperty("headers", new JObject(
                        new JProperty("x-ms-client-application-name", "TimeSeriesInsightsQuerySample"),
                        new JProperty("Authorization", "Bearer " + accessToken))),
                    new JProperty("content", contentInputPayload));
                IReadOnlyList<JToken> responseMessagesContent = await ReadWebSocketResponseAsync(environmentFqdn, "aggregates", inputPayload);

                Console.WriteLine("Group by Event Source Name via WebSocket request.");
                DumpAggregatesStreamed(responseMessagesContent);
                Console.WriteLine();
            }
        }

        private static async Task<string> AcquireAccessTokenAsync()
        {
            if (ApplicationClientId == "#DUMMY#" || ApplicationClientSecret == "#DUMMY#" || Tenant.StartsWith("#DUMMY#"))
            {
                throw new Exception(
                    $"Use the link {"https://docs.microsoft.com/azure/time-series-insights/time-series-insights-authentication-and-authorization"} to update the values of 'ApplicationClientId', 'ApplicationClientSecret' and 'Tenant'.");
            }

            var authenticationContext = new AuthenticationContext(
                $"https://login.windows.net/{Tenant}",
                TokenCache.DefaultShared);

            AuthenticationResult token = await authenticationContext.AcquireTokenAsync(
                resource: "https://api.timeseries.azure.com/",
                clientCredential: new ClientCredential(
                    clientId: ApplicationClientId,
                    clientSecret: ApplicationClientSecret));

            // Show interactive logon dialog to acquire token on behalf of the user.
            // Suitable for native apps, and not on server-side of a web application.
            //AuthenticationResult token = await authenticationContext.AcquireTokenAsync(
            //    resource: "https://api.timeseries.azure.com/",
            //    // Set well-known client ID for Azure PowerShell
            //    clientId: "1950a258-227b-4e31-a9cf-717495945fc2",
            //    // Set redirect URI for Azure PowerShell
            //    redirectUri: new Uri("urn:ietf:wg:oauth:2.0:oob"),
            //    parameters: new PlatformParameters(PromptBehavior.Auto));

            return token.AccessToken;
        }

        private static HttpWebRequest CreateHttpsWebRequest(string host, string method, string path, string accessToken, string[] queryArgs = null)
        {
            string query = "api-version=2016-12-12";
            if (queryArgs != null && queryArgs.Any())
            {
                query += "&" + String.Join("&", queryArgs);
            }

            Uri uri = new UriBuilder("https", host)
            {
                Path = path,
                Query = query
            }.Uri;
            HttpWebRequest request = WebRequest.CreateHttp(uri);
            request.Method = method;
            request.Headers.Add("x-ms-client-application-name", "TimeSeriesInsightsQuerySample");
            request.Headers.Add("Authorization", "Bearer " + accessToken);
            return request;
        }

        private static async Task WriteRequestStreamAsync(HttpWebRequest request, JObject inputPayload)
        {
            using (var stream = await request.GetRequestStreamAsync())
            using (var streamWriter = new StreamWriter(stream))
            {
                await streamWriter.WriteAsync(inputPayload.ToString());
                await streamWriter.FlushAsync();
                streamWriter.Close();
            }
        }

        private static async Task<JToken> GetResponseAsync(HttpWebRequest request)
        {
            using (WebResponse webResponse = await request.GetResponseAsync())
            using (var sr = new StreamReader(webResponse.GetResponseStream()))
            {
                string result = await sr.ReadToEndAsync();
                return JsonConvert.DeserializeObject<JToken>(result);
            }
        }

        private static async Task<IReadOnlyList<JToken>> ReadWebSocketResponseAsync(string environmentFqdn, string path, JObject inputPayload)
        {
            var webSocket = new ClientWebSocket();

            // Establish web socket connection.
            Uri uri = new UriBuilder("wss", environmentFqdn)
            {
                Path = path,
                Query = "api-version=2016-12-12"
            }.Uri;
            await webSocket.ConnectAsync(uri, CancellationToken.None);

            // Send input payload.
            byte[] inputPayloadBytes = Encoding.UTF8.GetBytes(inputPayload.ToString());
            await webSocket.SendAsync(
                new ArraySegment<byte>(inputPayloadBytes),
                WebSocketMessageType.Text,
                endOfMessage: true,
                cancellationToken: CancellationToken.None);

            // Read response messages from web socket.
            List<JToken> responseMessagesContent = new List<JToken>();
            using (webSocket)
            {
                while (true)
                {
                    string message;
                    using (var ms = new MemoryStream())
                    {
                        // Write from socket to memory stream.
                        const int bufferSize = 16 * 1024;
                        var temporaryBuffer = new byte[bufferSize];
                        while (true)
                        {
                            WebSocketReceiveResult response = await webSocket.ReceiveAsync(
                                new ArraySegment<byte>(temporaryBuffer),
                                CancellationToken.None);

                            ms.Write(temporaryBuffer, 0, response.Count);
                            if (response.EndOfMessage)
                            {
                                break;
                            }
                        }

                        // Reset position to the beginning to allow reads.
                        ms.Position = 0;

                        using (var sr = new StreamReader(ms))
                        {
                            message = sr.ReadToEnd();
                        }
                    }

                    JObject messageObj = JsonConvert.DeserializeObject<JObject>(message);

                    // Stop reading if error is emitted.
                    if (messageObj["error"] != null)
                    {
                        break;
                    }

                    // Actual response contents is wrapped into "content" object.
                    responseMessagesContent.Add(messageObj["content"]);

                    // Stop reading if 100% of completeness is reached.
                    if (messageObj["percentCompleted"] != null &&
                        Math.Abs((double)messageObj["percentCompleted"] - 100d) < 0.01)
                    {
                        break;
                    }
                }

                // Close web socket connection.
                if (webSocket.State == WebSocketState.Open)
                {
                    await webSocket.CloseAsync(
                        WebSocketCloseStatus.NormalClosure,
                        "CompletedByClient",
                        CancellationToken.None);
                }
            }

            return responseMessagesContent;
        }

        private static void DumpMetadata(JToken responseContent)
        {
            // Response content has a list of properties under "properties" property.
            JArray properties = (JArray)responseContent["properties"];
            int propertiesCount = properties.Count;
            Console.WriteLine("Acquired {0} properties:", propertiesCount);
            for (int i = 0; i < propertiesCount; i++)
            {
                JObject currentProperty = (JObject)properties[i];
                Console.WriteLine("'{0}': {1}", currentProperty["name"], currentProperty["type"]);
            }
        }

        private static void DumpEvents(JToken responseContent)
        {
            // Response content has a list of events under "events" property for HTTP request.
            JArray events = (JArray)responseContent["events"];
            int eventCount = events.Count;
            Console.WriteLine("Acquired {0} events:", eventCount);
            for (int i = 0; i < eventCount; i++)
            {
                JObject currentEvent = (JObject)events[i];
                JArray values = (JArray)currentEvent["values"];
                Console.WriteLine("{{$ts: {0}, values: {1}}}", currentEvent["$ts"].ToString(), String.Join(",", values));
            }
        }

        private static void DumpEventsStreamed(IReadOnlyList<JToken> responseMessagesContent)
        {
            // For events stream next message always contains additional events, i.e. new message is additive to the previous one.
            // New message contains new events that were not in the previous message.
            // The previous message should be kept and accumulated with the new message.
            // Response content has a list of events under "events" property both for HTTP and WebSocket requests.
            JArray events = new JArray(responseMessagesContent.SelectMany(m => (JArray)m["events"]));

            int eventCount = events.Count;
            Console.WriteLine("Acquired {0} events:", eventCount);
            for (int i = 0; i < eventCount; i++)
            {
                JObject currentEvent = (JObject)events[i];
                JArray values = (JArray)currentEvent["values"];
                Console.WriteLine("{{$ts: {0}, values: {1}}}", currentEvent["$ts"].ToString(), String.Join(",", values));
            }
        }

        private static void DumpAggregates(JToken responseContent)
        {
            // HTTP response content contains the list of aggregates under "aggregates" property.
            JArray aggregates = (JArray)responseContent["aggregates"];

            DumpAggregatesInternal(aggregates);
        }

        private static void DumpAggregatesStreamed(IReadOnlyList<JToken> responseMessagesContent)
        {
            // For aggregates stream next message always contains a replacement (snapshot) of all the values.
            // Previous message can be discarded by the client.
            // WebSocket response represents the list of aggregates.
            JArray aggregates = (JArray)responseMessagesContent.Last();

            DumpAggregatesInternal(aggregates);
        }

        private static void DumpAggregatesInternal(JArray aggregates)
        {
            // Number of items corresponds to number of aggregates in input payload.
            // In this sample list of aggregates in input payload contains only 1 item since request contains 1 aggregate.
            JObject aggregate = (JObject)aggregates[0];
            JArray dimensionValues = (JArray)aggregate["dimension"];
            JArray measures = (JArray)aggregate["measures"];
            Debug.Assert(
                dimensionValues.Count == measures.Count,
                "Number of measures and dimensions should match.");
            Console.WriteLine("Dimension Value\t\tCount");
            for (int i = 0; i < dimensionValues.Count; i++)
            {
                string currentDimensionValue = (string)dimensionValues[i];
                JArray currentMeasureValues = (JArray)measures[i];
                double currentCount = (double)currentMeasureValues[0];

                Console.WriteLine("{0}\t\t{1}", currentDimensionValue, currentCount);
            }
        }

        static void Main(string[] args)
        {
            Task.Run(async () => await SampleAsync()).Wait();
        }
    }
}
```

## Next steps
> [!div class="nextstepaction"]
> [Query API reference](/rest/api/time-series-insights/time-series-insights-reference-queryapi).
