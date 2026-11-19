---
title: Packet capture insights how-to (preview)
titleSuffix: Azure Network Watcher
description: Learn how to generate packet capture insights in Azure Network Watcher and query protocol logs in a Log Analytics workspace.
author: ChaithanyaRai
ms.author: chrai
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 11/06/2026
ms.custom: references_regions
ai-usage: ai-assisted
---

# Packet capture insights how-to

Packet capture insights (preview) uses AI-assisted analysis to surface key findings from Azure Network Watcher packet captures. In this article, you learn how to generate insights, optionally retain protocol logs in a Log Analytics workspace, and query the logs by using Kusto Query Language (KQL).

> [!NOTE]
> AI-generated findings are supporting guidance. Validate them against the underlying capture data.

[!INCLUDE [Packet capture insights preview](../../includes/preview-packet-capture-insights.md)]

## Prerequisites

- An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn_bda473f6-c4fa-08fc-9545-d5bc4ef630d6).

- Packet captures for which you want to generate insights stored in the storage account.

- Enable storage account key access on the storage account.

- Ensure that you have the [required RBAC permissions](packet-capture-insights-overview.md#rbac-permissions-to-generate-insights).

Before you begin, review the [considerations](packet-capture-insights-overview.md#considerations) and [preview limitations](packet-capture-insights-overview.md#limitations). If you retain logs, select a Log Analytics workspace in the same subscription and region as the packet capture resource.

## Generate insights

### Portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. [Create a packet capture](packet-capture-manage.md?tabs=portal) and store it in a storage account.

3. Wait until the capture is in the **Stopped** state, and then open the packet capture list.

4. Select the packet capture that you want to analyze.


    :::image type="content" source="./media/packet-capture-insights/select-packet-capture.png" alt-text="Screenshot of the Azure portal packet capture list with a capture selected." lightbox="./media/packet-capture-insights/select-packet-capture.png":::

5. To retain detailed logs for querying and validation, set **Store detailed network logs for querying** to **Yes**, and select a Log Analytics workspace. Select **Generate insights** to produce an AI-generated summary of key findings.


    :::image type="content" source="./media/packet-capture-insights/generate-insights.png" alt-text="Screenshot of packet capture insights settings with log storage enabled and the Generate insights button highlighted." lightbox="./media/packet-capture-insights/generate-insights.png":::

6. View the generated insights when they're ready.

### REST API

To generate insights for an existing packet capture and retain detailed network logs in a Log Analytics workspace, send the following request. The packet capture must be stopped and stored in a storage account.

Replace the placeholders with your resource details and an Azure Resource Manager access token. Select a workspace in the same subscription and region as the packet capture resource.

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkWatchers/{networkWatcherName}/packetCaptures/{packetCaptureName}/startInsight?api-version=2025-05-01
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "properties": {
    "outputs": [
      {
        "type": "Workspace",
        "ResourceId": "/subscriptions/{subscriptionId}/resourceGroups/{workspaceResourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}",
        "setting": ""
      }
    ]
  }
}
```

After log ingestion is complete, open the selected Log Analytics workspace and run the queries in [Sample queries](#sample-queries).

## Available tables

If you retain logs in a Log Analytics workspace, the following tables store records for the observed protocols:

- `NWPacketCaptureNetworkSession`: Network sessions, including generic TCP conversations.

- `NWPacketCaptureDnsQuery`: DNS traffic data.

- `NWPacketCaptureHttpTransaction`: HTTP traffic data.

- `NWPacketCaptureTlsSession`: TLS conversations.

## Log format


### NWPacketCaptureNetworkSession

| Property | Description |
| --- | --- |
| `TimeGenerated` | UTC time when the service ingested the record. |
| `PacketCaptureResourceId` | Azure resource ID of the packet capture that produced this record. |
| `PacketCaptureStorageUrl` | Storage URL of the packet capture file that produced this record. |
| `FlowId` | Flow identifier used to correlate records across protocol tables (between network session and other tables) within the same capture. |
| `EventTs` | UTC time of the first observed packet in the flow. |
| `DurationMs` | Observed connection duration in milliseconds. Excludes the final ACK of a normal TCP close. |
| `IpVersion` | IP address version used by the endpoints. |
| `TransportProtocol` | Transport protocol used by the flow. |
| `SourceIp` | IP address of the flow originator. |
| `DestinationIp` | IP address of the flow responder. |
| `SourcePort` | Port number at SourceIp for TCP or UDP traffic. |
| `DestinationPort` | Port number at DestinationIp for TCP or UDP traffic. |
| `IcmpType` | ICMP or ICMPv6 message type. |
| `IcmpCode` | ICMP or ICMPv6 message code. |
| `DetectedProtocols` | List of application protocols identified in the traffic. |
| `SourcePayloadBytes` | Count of data bytes sent from SourceIp, excluding network and transport headers for complete TCP captures. |
| `DestinationPayloadBytes` | Count of data bytes sent from DestinationIp, excluding network and transport headers for complete TCP captures. |
| `SourcePackets` | Count of observed packets sent from SourceIp. |
| `DestinationPackets` | Count of observed packets sent from DestinationIp. |
| `SourceIpBytes` | Count of bytes in observed IP packets sent from SourceIp, including IP headers and their contents. |
| `DestinationIpBytes` | Count of bytes in observed IP packets sent from DestinationIp, including IP headers and their contents. |
| `TcpSessionState` | Description of the observed TCP connection status. |
| `SessionStateCode` | Short code representing the observed connection status. For TCP, TcpSessionState provides a readable description. |
| `TransportHistory` | Encoded sequence of observed transport events and their direction. |
| `TcpHandshakeComplete` | Whether the captured traffic confirms a completed TCP handshake. |
| `PayloadObserved` | Whether reliable TCP or UDP evidence indicates transport payload is present. |
| `TcpGracefulCloseObserved` | Whether a graceful TCP close was observed. |
| `TcpResetObserved` | Whether a TCP reset was observed, indicating connection rejection or abrupt termination. |
| `TcpMidstreamStart` | Whether capture of this TCP connection began after the connection started. |
| `TcpPartialCapture` | Whether the TCP capture starts midstream or has missing content. |
| `TcpMissingBytes` | Count of TCP data bytes identified as missing during analysis. |

### NWPacketCaptureDnsQuery

| Property | Description |
| --- | --- |
| `TimeGenerated` | UTC time when the service ingested the record. |
| `PacketCaptureResourceId` | Azure resource ID of the packet capture that produced this record. |
| `PacketCaptureStorageUrl` | Storage URL of the packet capture file that produced this record. |
| `FlowId` | Flow identifier used to correlate records across protocol tables (between network session and other tables) within the same capture. |
| `EventTs` | UTC time of the first observed DNS message for this query or response. |
| `TransactionId` | DNS transaction identifier. It can be reused across queries. |
| `IpVersion` | IP address version used by the endpoints. |
| `TransportProtocol` | Transport protocol carrying the DNS messages. |
| `QuerySourceIp` | IP address on the sending side of the DNS query. |
| `QuerySourcePort` | Port number on the sending side of the DNS query. |
| `QueryDestinationIp` | IP address on the receiving side of the DNS query. |
| `QueryDestinationPort` | Port number on the receiving side of the DNS query. |
| `QueryName` | Name requested in the DNS query. |
| `QueryClass` | DNS query class. |
| `QueryType` | DNS record type requested. |
| `ResponseSeen` | Whether a DNS response code was observed for the lookup. |
| `ResponseCode` | Response code reported by the DNS server. |
| `AuthoritativeAnswer` | Whether the DNS response has the authoritative answer flag set. |
| `ResponseTruncated` | Whether the DNS response has the truncation flag set. |
| `RecursionDesired` | Whether the DNS query requests recursive resolution. |
| `RecursionAvailable` | Whether the DNS response indicates recursive resolution is available. |
| `ResponseTimeMs` | Elapsed time in milliseconds between the observed DNS query and response. |
| `Answers` | List of DNS answers, each containing a value and `ttl_seconds` specifying the time to live in seconds. |

### NWPacketCaptureHttpTransaction

| Property | Description |
| --- | --- |
| `TimeGenerated` | UTC time when the service ingested the record. |
| `PacketCaptureResourceId` | Azure resource ID of the packet capture that produced this record. |
| `PacketCaptureStorageUrl` | Storage URL of the packet capture file that produced this record. |
| `FlowId` | Flow identifier used to correlate records across protocol tables (between network session and other tables) within the same capture. |
| `EventTs` | UTC time of the first observed HTTP evidence for this transaction. |
| `TransactionSequence` | Transaction order within the flow identified by FlowId. |
| `IpVersion` | IP address version used by the endpoints. |
| `RequestSourceIp` | IP address on the sending side of the HTTP request. |
| `RequestSourcePort` | Port number on the sending side of the HTTP request. |
| `RequestDestinationIp` | Destination IP address in the HTTP request direction. It might identify a proxy. |
| `RequestDestinationPort` | Port number on the receiving side of the HTTP request. |
| `Method` | HTTP request method. |
| `RequestHost` | HTTP Host header value. |
| `RequestTarget` | Decoded HTTP request target. |
| `UserAgent` | HTTP User-Agent header value. |
| `Referrer` | HTTP Referer header value. |
| `RequestOrigin` | HTTP Origin header value. |
| `RequestBodyBytes` | Count of uncompressed request-body bytes analyzed, excluding headers. |
| `RequestMimeTypes` | List of MIME types identified in request content. |
| `RequestSeen` | Whether HTTP request evidence was observed. |
| `HttpVersion` | HTTP protocol version reported in the response. Null when only a request was observed. |
| `ResponseBodyBytes` | Count of uncompressed response-body bytes analyzed, excluding headers. |
| `StatusCode` | Status code of the observed final HTTP response. |
| `StatusReason` | Reason phrase of the observed final HTTP response. |
| `InformationalStatusCode` | Status code of the last observed informational HTTP response. |
| `InformationalStatusReason` | Reason phrase of the last observed informational HTTP response. |
| `ResponseMimeTypes` | List of MIME types identified in response content. |
| `ResponseSeen` | Whether HTTP response evidence was observed. |

### NWPacketCaptureTlsSession

| Property | Description |
| --- | --- |
| `TimeGenerated` | UTC time when the service ingested the record. |
| `PacketCaptureResourceId` | Azure resource ID of the packet capture that produced this record. |
| `PacketCaptureStorageUrl` | Storage URL of the packet capture file that produced this record. |
| `FlowId` | Flow identifier used to correlate records across protocol tables (between network session and other tables) within the same capture. |
| `EventTs` | UTC time when TLS traffic for the flow was first detected. |
| `IpVersion` | IP address version used by the endpoints. |
| `SourceIp` | IP address of the flow originator, not necessarily the TLS client. |
| `SourcePort` | Port number at SourceIp. |
| `DestinationIp` | IP address of the flow responder, not necessarily the TLS server. |
| `DestinationPort` | Port number at DestinationIp. |
| `TlsVersion` | TLS version selected by the server. |
| `CipherSuite` | Cipher suite selected by the server. |
| `KeyExchangeGroup` | Named key exchange group selected by the server. |
| `RequestedServerName` | First hostname observed in the client's Server Name Indication extension. |
| `SessionResumed` | Whether the TLS session was resumed. Null when undetermined. |
| `Alpn` | Application protocol selected by the server through Application-Layer Protocol Negotiation. |
| `HandshakeEstablished` | Whether successful handshake completion was observed. |
| `TlsHistory` | Encoded sequence of observed TLS messages and their direction. |
| `LastAlert` | Last observed TLS alert, including error or normal shutdown alerts. |
| `ClientCertificateSubject` | Subject name of the client leaf certificate. |
| `ClientCertificateIssuer` | Issuer name of the client leaf certificate. |
| `ServerCertificateSubject` | Subject name of the server leaf certificate. |
| `ServerCertificateIssuer` | Issuer name of the server leaf certificate. |
| `RequestedServerNameMatchesCertificate` | Whether the requested hostname matches the server leaf certificate. A match doesn't establish certificate trust. |
## Sample log records

### DnsQuerySample.json

```json
[
  {
    "TimeGenerated": "2026-09-01T11:43:20.123456Z",
    "PacketCaptureResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/networkwatcherrg/providers/Microsoft.Network/networkWatchers/NetworkWatcher_eastus/packetCaptures/sampleCapture",
    "PacketCaptureStorageUrl": "https://examplestorage.blob.core.windows.net/packetcaptures/sampleCapture.cap",
    "FlowId": "CwfSIx2UluyFSBmKR9",
    "EventTs": "2026-09-01T11:43:20.123456Z",
    "TransactionId": 4660,
    "IpVersion": "ipv4",
    "TransportProtocol": "udp",
    "QuerySourceIp": "192.0.2.10",
    "QuerySourcePort": 53000,
    "QueryDestinationIp": "192.0.2.53",
    "QueryDestinationPort": 53,
    "QueryName": "contoso.test",
    "QueryClass": "IN",
    "QueryType": "A",
    "ResponseSeen": true,
    "ResponseCode": "NOERROR",
    "AuthoritativeAnswer": true,
    "ResponseTruncated": false,
    "RecursionDesired": true,
    "RecursionAvailable": true,
    "ResponseTimeMs": 0.9999275207519531,
    "Answers": [
      {
        "value": "edge.contoso.test",
        "ttl_seconds": 60.0
      },
      {
        "value": "192.0.2.80",
        "ttl_seconds": 300.0
      }
    ]
  }
]
```

### HttpTransactionSample.json

```json
[
  {
    "TimeGenerated": "2026-09-01T11:43:20.129456Z",
    "PacketCaptureResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/networkwatcherrg/providers/Microsoft.Network/networkWatchers/NetworkWatcher_eastus/packetCaptures/sampleCapture",
    "PacketCaptureStorageUrl": "https://examplestorage.blob.core.windows.net/packetcaptures/sampleCapture.cap",
    "FlowId": "Ca6YYk4uhfuPkbv8Ni",
    "EventTs": "2026-09-01T11:43:20.129456Z",
    "TransactionSequence": 1,
    "IpVersion": "ipv4",
    "RequestSourceIp": "192.0.2.10",
    "RequestSourcePort": 41000,
    "RequestDestinationIp": "192.0.2.80",
    "RequestDestinationPort": 80,
    "Method": "POST",
    "RequestHost": "contoso.test",
    "RequestTarget": "/upload?mode=full",
    "UserAgent": "contoso-fixture/1.0",
    "Referrer": "https://referrer.test/start",
    "RequestOrigin": "https://origin.test",
    "RequestBodyBytes": 284,
    "RequestMimeTypes": ["text/json", "text/plain"],
    "RequestSeen": true,
    "HttpVersion": "1.1",
    "ResponseBodyBytes": 214,
    "StatusCode": 201,
    "StatusReason": "Created",
    "InformationalStatusCode": 103,
    "InformationalStatusReason": "Early Hints",
    "ResponseMimeTypes": ["text/html", "text/json"],
    "ResponseSeen": true
  }
]
```

### NetworkSessionSample.json

```json
[
  {
    "TimeGenerated": "2026-09-01T11:43:20.126456Z",
    "PacketCaptureResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/networkwatcherrg/providers/Microsoft.Network/networkWatchers/NetworkWatcher_eastus/packetCaptures/sampleCapture",
    "PacketCaptureStorageUrl": "https://examplestorage.blob.core.windows.net/packetcaptures/sampleCapture.cap",
    "FlowId": "Ca6YYk4uhfuPkbv8Ni",
    "EventTs": "2026-09-01T11:43:20.126456Z",
    "DurationMs": 8.0,
    "IpVersion": "ipv4",
    "TransportProtocol": "tcp",
    "SourceIp": "192.0.2.10",
    "DestinationIp": "192.0.2.80",
    "SourcePort": 41000,
    "DestinationPort": 80,
    "IcmpType": null,
    "IcmpCode": null,
    "DetectedProtocols": ["http"],
    "SourcePayloadBytes": 550,
    "DestinationPayloadBytes": 400,
    "SourcePackets": 6,
    "DestinationPackets": 4,
    "SourceIpBytes": 790,
    "DestinationIpBytes": 560,
    "TcpSessionState": "closed_normally",
    "SessionStateCode": "SF",
    "TransportHistory": "ShADadFf",
    "TcpHandshakeComplete": true,
    "PayloadObserved": true,
    "TcpGracefulCloseObserved": true,
    "TcpResetObserved": false,
    "TcpMidstreamStart": false,
    "TcpPartialCapture": false,
    "TcpMissingBytes": 0
  }
]
```

### TlsSessionSample.json

```json
[
  {
    "TimeGenerated": "2026-09-01T11:43:20.144456Z",
    "PacketCaptureResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/networkwatcherrg/providers/Microsoft.Network/networkWatchers/NetworkWatcher_eastus/packetCaptures/sampleCapture",
    "PacketCaptureStorageUrl": "https://examplestorage.blob.core.windows.net/packetcaptures/sampleCapture.cap",
    "FlowId": "CS5cAU2GEoGeKc2II5",
    "EventTs": "2026-09-01T11:43:20.144456Z",
    "IpVersion": "ipv4",
    "SourceIp": "192.0.2.10",
    "SourcePort": 42000,
    "DestinationIp": "192.0.2.90",
    "DestinationPort": 443,
    "TlsVersion": "TLSv12",
    "CipherSuite": "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
    "KeyExchangeGroup": "x25519",
    "RequestedServerName": "server.contoso.test",
    "SessionResumed": false,
    "Alpn": "http/1.1",
    "HandshakeEstablished": true,
    "TlsHistory": "CsxkrnXGYIti",
    "LastAlert": null,
    "ClientCertificateSubject": "CN=client.contoso.test",
    "ClientCertificateIssuer": "CN=Contoso TLS Transcript Test Root CA",
    "ServerCertificateSubject": "CN=server.contoso.test",
    "ServerCertificateIssuer": "CN=Contoso TLS Transcript Test Root CA",
    "RequestedServerNameMatchesCertificate": true
  }
]
```

After ingestion is complete, open the selected Log Analytics workspace to run KQL queries for deeper inspection. To focus on a specific capture, filter by `PacketCaptureResourceId`. Use `EventTs` to filter by the time of the observed network activity; `TimeGenerated` is the ingestion time.

## Sample queries

### Recent network session records

The following query shows recent network session records from retained packet capture logs:

```kusto
NWPacketCaptureNetworkSession
| project TimeGenerated, SourceIp, SourcePort, DestinationIp, DestinationPort, TransportProtocol, DurationMs, TcpSessionState
| order by TimeGenerated desc
| take 20
```

### Successful DNS queries

The following query shows successful DNS queries:

```kusto
NWPacketCaptureDnsQuery
| where ResponseSeen == true and ResponseCode == "NOERROR"
| project TimeGenerated, QuerySourceIp, QueryDestinationIp, QueryName, QueryType, ResponseCode, ResponseTimeMs, Answers
| order by TimeGenerated desc
```

### Recent HTTP transactions

The following query shows recent HTTP transactions:

```kusto
NWPacketCaptureHttpTransaction
| where RequestSeen == true
| project EventTs, Method, RequestHost, RequestTarget, StatusCode, StatusReason, RequestSourceIp, RequestDestinationIp
| order by EventTs desc
| take 20
```

### Successful TLS sessions

The following query shows TLS sessions for which successful handshake completion was observed:

```kusto
NWPacketCaptureTlsSession
| where HandshakeEstablished == true
| project TimeGenerated, SourceIp, SourcePort, DestinationIp, DestinationPort, RequestedServerName, TlsVersion, CipherSuite
| order by TimeGenerated desc
```

- This query shows how a successful DNS lookup leads to an HTTP request. It finds the IP address returned by DNS, identifies a connection from the same client to that IP address within 10 minutes, and then displays the HTTP request made over that connection. If multiple DNS lookups could match the same HTTP request, it keeps the most recent match and returns the latest 50 results.

```kusto
NWPacketCaptureDnsQuery
| where ResponseSeen == true and ResponseCode == "NOERROR" // Get successful DNS responses.
| mv-expand Answer = Answers // Create one row per DNS answer and extract its value.
| extend
    ResolvedIp = tostring(Answer.value),
    DnsTtlSeconds = todouble(Answer.ttl_seconds)
| where isnotempty(ResolvedIp)
| project // Select DNS correlation fields.
    CaptureId = PacketCaptureResourceId,
    DnsTime = EventTs,
    DnsFlowId = FlowId,
    ClientIp = QuerySourceIp,
    DnsServerIp = QueryDestinationIp,
    DnsQueryType = QueryType,
    DnsResponseTimeMs = ResponseTimeMs,
    ResolvedIp,
    DnsTtlSeconds
| join kind=inner (
    NWPacketCaptureNetworkSession
    | project
        NetworkCaptureId = PacketCaptureResourceId,
        NetworkTime = EventTs,
        NetworkFlowId = FlowId,
        SourceIp,
        SourcePort,
        DestinationIp,
        DestinationPort,
        TransportProtocol,
        DurationMs,
        DetectedProtocols,
        SourcePayloadBytes,
        DestinationPayloadBytes,
        TcpSessionState,
        TcpHandshakeComplete
) on $left.CaptureId == $right.NetworkCaptureId // Find the same client connecting to the resolved IP.
    and $left.ClientIp == $right.SourceIp
    and $left.ResolvedIp == $right.DestinationIp
| where NetworkTime between (DnsTime .. DnsTime + 10m)   // Require the connection within 10 minutes after DNS.
| project-away NetworkCaptureId, DestinationIp
| join kind=inner (
    NWPacketCaptureHttpTransaction // Find the HTTP request on the network flow.
    | project
        HttpCaptureId = PacketCaptureResourceId,
        HttpFlowId = FlowId,
        HttpTime = EventTs,
        HttpTransactionSequence = TransactionSequence,
        HttpMethod = Method,
        HttpHost = RequestHost,
        HttpTarget = RequestTarget,
        HttpVersion,
        HttpStatusCode = StatusCode,
        HttpRequestBodyBytes = RequestBodyBytes,
        HttpResponseBodyBytes = ResponseBodyBytes
) on $left.CaptureId == $right.HttpCaptureId
    and $left.NetworkFlowId == $right.HttpFlowId
| project-away HttpCaptureId, HttpFlowId
| summarize arg_max(DnsTime, *) // Keep one DNS match per HTTP request.
    by CaptureId, NetworkFlowId, HttpTransactionSequence
| project // Display relevant DNS, network, and HTTP fields.
    PacketCaptureResourceId = CaptureId,
    DnsTime,
    DnsFlowId,
    DnsServerIp,
    DnsQueryType,
    ResolvedIp,
    DnsTtlSeconds,
    DnsResponseTimeMs,
    NetworkTime,
    NetworkFlowId,
    SourceIp,
    SourcePort,
    DestinationPort,
    TransportProtocol,
    DurationMs,
    DetectedProtocols,
    SourcePayloadBytes,
    DestinationPayloadBytes,
    TcpSessionState,
    TcpHandshakeComplete,
    HttpTime,
    HttpTransactionSequence,
    HttpMethod,
    HttpHost,
    HttpTarget,
    HttpVersion,
    HttpStatusCode,
    HttpRequestBodyBytes,
    HttpResponseBodyBytes
| top 50 by NetworkTime desc
```

## Related content

- [Packet capture insights overview](packet-capture-insights-overview.md).
- [Manage packet captures](packet-capture-manage.md).
