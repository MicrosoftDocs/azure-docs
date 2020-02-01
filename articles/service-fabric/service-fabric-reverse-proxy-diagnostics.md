---
title: Azure Service Fabric reverse proxy diagnostics 
description: Learn how to monitor and diagnose request processing at the reverse proxy for an Azure Service Fabric application.
author: kavyako

ms.topic: conceptual
ms.date: 08/08/2017
ms.author: kavyako
---
# Monitor and diagnose request processing at the reverse proxy

Starting with the 5.7 release of Service Fabric, reverse proxy events are available for collection. 
The events are available in two channels, one with only error events related to request processing failure at the reverse proxy and second channel containing verbose events with entries for both successful and failed requests.

Refer to [Collect reverse proxy events](service-fabric-diagnostics-event-aggregation-wad.md#log-collection-configurations) to enable collecting events from these channels in local and Azure Service Fabric clusters.

## Troubleshoot using diagnostics logs
Here are some examples on how to interpret the common failure logs that one can encounter:

1. Reverse proxy returns response status code 504 (Timeout).

    One reason could be due to the service failing to reply within the request timeout period.
   The first event below logs the details of the request received at the reverse proxy. 
   The second event indicates that the request failed while forwarding to service, due to "internal error = ERROR_WINHTTP_TIMEOUT" 

    The payload includes:

   * **traceId**: This GUID can be used to correlate all the events corresponding to a single request. In the below two events, the traceId = **2f87b722-e254-4ac2-a802-fd315c1a0271**, implying they belong to the same request.
   * **requestUrl**: The URL (Reverse proxy URL) to which the request was sent.
   * **verb**: HTTP verb.
   * **remoteAddress**: Address of client sending the request.
   * **resolvedServiceUrl**: Service endpoint URL to which the incoming request was resolved. 
   * **errorDetails**: Additional information about the failure.

     ```
     {
     "Timestamp": "2017-07-20T15:57:59.9871163-07:00",
     "ProviderName": "Microsoft-ServiceFabric",
     "Id": 51477,
     "Message": "2f87b722-e254-4ac2-a802-fd315c1a0271 Request url = https://localhost:19081/LocationApp/LocationFEService?zipcode=98052, verb = GET, remote (client) address = ::1, resolved service url = Https://localhost:8491/LocationApp/?zipcode=98052, request processing start time =     15:58:00.074114 (745,608.196 MSec) ",
     "ProcessId": 57696,
     "Level": "Informational",
     "Keywords": "0x1000000000000021",
     "EventName": "ReverseProxy",
     "ActivityID": null,
     "RelatedActivityID": null,
     "Payload": {
      "traceId": "2f87b722-e254-4ac2-a802-fd315c1a0271",
      "requestUrl": "https://localhost:19081/LocationApp/LocationFEService?zipcode=98052",
      "verb": "GET",
      "remoteAddress": "::1",
      "resolvedServiceUrl": "Https://localhost:8491/LocationApp/?zipcode=98052",
      "requestStartTime": "2017-07-20T15:58:00.0741142-07:00"
     }
     }

     {
     "Timestamp": "2017-07-20T16:00:01.3173605-07:00",
     ...
     "Message": "2f87b722-e254-4ac2-a802-fd315c1a0271 Error while forwarding request to service: response status code = 504, description = Reverse proxy Timeout, phase = FinishSendRequest, internal error = ERROR_WINHTTP_TIMEOUT ",
     ...
     "Payload": {
      "traceId": "2f87b722-e254-4ac2-a802-fd315c1a0271",
      "statusCode": 504,
      "description": "Reverse Proxy Timeout",
      "sendRequestPhase": "FinishSendRequest",
      "errorDetails": "internal error = ERROR_WINHTTP_TIMEOUT"
     }
     }
     ```

2. Reverse proxy returns response status code 404 (Not Found). 
    
    Here is an example event where reverse proxy returns 404 since it failed to find the matching service endpoint.
    The payload  entries of interest here are:
   * **processRequestPhase**: Indicates the phase during request processing when the failure occurred, ***TryGetEndpoint*** i.e while trying to fetch the service endpoint to forward to. 
   * **errorDetails**: Lists the endpoint search criteria. Here you can see that the listenerName specified = **FrontEndListener** whereas the replica endpoint list only contains a listener with the name **OldListener**.
    
     ```
     {
     ...
     "Message": "c1cca3b7-f85d-4fef-a162-88af23604343 Error while processing request, cannot forward to service: request url = https://localhost:19081/LocationApp/LocationFEService?ListenerName=FrontEndListener&zipcode=98052, verb = GET, remote (client) address = ::1, request processing start time = 16:43:02.686271 (3,448,220.353 MSec), error = FABRIC_E_ENDPOINT_NOT_FOUND, message = , phase = TryGetEndoint, SecureOnlyMode = false, gateway protocol = https, listenerName = FrontEndListener, replica endpoint = {\"Endpoints\":{\"\":\"Https:\/\/localhost:8491\/LocationApp\/\"}} ",
     "ProcessId": 57696,
     "Level": "Warning",
     "EventName": "ReverseProxy",
     "Payload": {
      "traceId": "c1cca3b7-f85d-4fef-a162-88af23604343",
      "requestUrl": "https://localhost:19081/LocationApp/LocationFEService?ListenerName=NewListener&zipcode=98052",
      ...
      "processRequestPhase": "TryGetEndoint",
      "errorDetails": "SecureOnlyMode = false, gateway protocol = https, listenerName = FrontEndListener, replica endpoint = {\"Endpoints\":{\"OldListener\":\"Https:\/\/localhost:8491\/LocationApp\/\"}}"
     }
     }
     ```
     Another example where reverse proxy can return 404 Not Found is: ApplicationGateway\Http configuration parameter **SecureOnlyMode** is set to true with the reverse proxy listening on **HTTPS**, however all of the replica endpoints are unsecure (listening on HTTP).
     Reverse proxy returns 404 since it cannot find an endpoint listening on HTTPS to forward the request. Analyzing the parameters in the event payload helps to narrow down the issue:
    
     ```
      "errorDetails": "SecureOnlyMode = true, gateway protocol = https, listenerName = NewListener, replica endpoint = {\"Endpoints\":{\"OldListener\":\"Http:\/\/localhost:8491\/LocationApp\/\", \"NewListener\":\"Http:\/\/localhost:8492\/LocationApp\/\"}}"
     ```

3. Request to the reverse proxy fails with a timeout error. 
    The event logs contain an event with the received request details (not shown here).
    The next event shows that the service responded with a 404 status code and reverse proxy initiates a re-resolve. 

    ```
    {
      ...
      "Message": "7ac6212c-c8c4-4c98-9cf7-c187a94f141e Request to service returned: status code = 404, status description = , Reresolving ",
      "Payload": {
        "traceId": "7ac6212c-c8c4-4c98-9cf7-c187a94f141e",
        "statusCode": 404,
        "statusDescription": ""
      }
    }
    {
      ...
      "Message": "7ac6212c-c8c4-4c98-9cf7-c187a94f141e Re-resolved service url = Https://localhost:8491/LocationApp/?zipcode=98052 ",
      "Payload": {
        "traceId": "7ac6212c-c8c4-4c98-9cf7-c187a94f141e",
        "requestUrl": "Https://localhost:8491/LocationApp/?zipcode=98052"
      }
    }
    ```
    When collecting all the events, you see a train of events showing every resolve and forward attempt.
    The last event in the series shows the request processing has failed with a timeout, along with the number of successful resolve attempts.
    
    > [!NOTE]
    > It is recommended to keep the  verbose channel event collection disabled by default and enable it for troubleshooting on a need basis.

    ```
    {
      ...
      "Message": "7ac6212c-c8c4-4c98-9cf7-c187a94f141e Error while processing request: number of successful resolve attempts = 12, error = FABRIC_E_TIMEOUT, message = , phase = ResolveServicePartition,  ",
      "EventName": "ReverseProxy",
      ...
      "Payload": {
        "traceId": "7ac6212c-c8c4-4c98-9cf7-c187a94f141e",
        "resolveCount": 12,
        "errorval": -2147017729,
        "errorMessage": "",
        "processRequestPhase": "ResolveServicePartition",
        "errorDetails": ""
      }
    }
    ```
    
    If collection is enabled for critical/error events only, you see one event with details about the timeout and the number of resolve attempts. 
    
    Services that intend to send a 404 status code back to the user, should add an "X-ServiceFabric" header in the response. After the header is added to the response, reverse proxy forwards the status code back to the client.  

4. Cases when the client has disconnected the request.

    Following event is recorded when reverse proxy is forwarding the response to client but the client disconnects:

    ```
    {
      ...
      "Message": "6e2571a3-14a8-4fc7-93bb-c202c23b50b8 Unable to send response to client: phase = SendResponseHeaders, error = -805306367, internal error = ERROR_SUCCESS ",
      "ProcessId": 57696,
      "Level": "Warning",
      ...
      "EventName": "ReverseProxy",
      "Payload": {
        "traceId": "6e2571a3-14a8-4fc7-93bb-c202c23b50b8",
        "sendResponsePhase": "SendResponseHeaders",
        "errorval": -805306367,
        "winHttpError": "ERROR_SUCCESS"
      }
    }
    ```
5. Reverse Proxy returns 404 FABRIC_E_SERVICE_DOES_NOT_EXIST

    FABRIC_E_SERVICE_DOES_NOT_EXIST error is returned if the URI scheme is not specified for the service endpoint in the service manifest.

    ```
    <Endpoint Name="ServiceEndpointHttp" Port="80" Protocol="http" Type="Input"/>
    ```

    To resolve the problem, specify the URI scheme in the manifest.
    ```
    <Endpoint Name="ServiceEndpointHttp" UriScheme="http" Port="80" Protocol="http" Type="Input"/>
    ```

> [!NOTE]
> Events related to websocket request processing are not currently logged. This will be added in the next release.

## Next steps
* [Event aggregation and collection using Windows Azure Diagnostics](service-fabric-diagnostics-event-aggregation-wad.md) for enabling log collection in Azure clusters.
* To view Service Fabric events in Visual Studio, see [Monitor and diagnose locally](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md).
* Refer to [Configure reverse proxy to connect to secure services](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/Reverse-Proxy-Sample#configure-reverse-proxy-to-connect-to-secure-services) for Azure Resource Manager template samples to configure secure reverse proxy with the different service certificate validation options.
* Read [Service Fabric reverse proxy](service-fabric-reverseproxy.md) to learn more.
