---
title: Packet capture insights overview (preview)
titleSuffix: Azure Network Watcher
description: Learn about AI-assisted packet capture insights in Azure Network Watcher, including prerequisites, permissions, limitations, and protocol logs.
author: ChaithanyaRai
ms.author: chrai
ms.service: azure-network-watcher
ms.topic: concept-article
ms.date: 10/29/2026
ms.custom: references_regions
---

# Packet capture insights overview

Packet capture insights (preview) uses AI-assisted analysis to surface key findings from packet captures and can ingest network protocol logs into Log Analytics for deeper investigation.

This article describes packet capture insights for captures generated through Azure Network Watcher, including prerequisites, permissions, limitations, and protocol logs.

> [!NOTE]
> AI-generated findings are provided as supporting guidance and should be validated against the underlying capture data.

[!INCLUDE [Packet capture insights preview](../../includes/preview-packet-capture-insights.md)]

## Why use packet capture insights?

Packet captures provide detailed visibility into network traffic, but analyzing them can be difficult and time-consuming. Busy networks can produce millions of packets, and identifying relevant traffic requires knowledge of protocols, capture points, timing behavior, application patterns, and analysis tools.

Packet capture insights helps make capture data more accessible by surfacing meaningful network observations without requiring you to manually inspect every packet. You can use these insights to reduce investigation time, identify abnormal behavior, and troubleshoot connectivity, performance, and security issues more efficiently, especially when captures are large or complex.

Optionally ingesting the derived protocol logs into a Log Analytics workspace preserves structured evidence for deeper investigation, correlation, validation, and repeatable Kusto Query Language (KQL) analysis after the insight summary is generated. The available tables organize DNS queries, HTTP transactions, network sessions, and TLS sessions. The documented fields provide capture and flow identifiers, timestamps, endpoints, and protocol details. Together, these records help you trace related activity across protocols, filter large captures quickly, investigate anomalies, and verify AI-generated findings against the underlying network evidence.

## RBAC permissions to generate insights

You need the following Azure role-based access control (RBAC) permissions:

| Permission | Resource |
| --- | --- |
| `Microsoft.Network/networkWatchers/packetCaptures/read` | Packet capture resource. |
| `Microsoft.Network/networkWatchers/packetCaptures/startInsight/action` | Packet capture resource. |
| `Microsoft.Network/networkWatchers/packetCaptures/queryInsight/action` | Packet capture resource. |
| `Microsoft.Storage/storageAccounts/listAccountSas/action` | Storage account in which the packet capture is stored. |
| `Microsoft.Operationalinsights/workspaces/write` | Selected Log Analytics workspace. |

## Considerations

- Packet captures and derived insights can contain sensitive information, including IP addresses, hostnames, URLs, certificate details, and application metadata. Limit access to authorized users and handle captures, summaries, and ingested logs according to your organization's security, privacy, retention, and compliance requirements.

- Generate insights only for packet captures in the **Stopped** state to avoid incomplete insights.

## Responsible AI frequently asked questions (FAQ)

To understand how packet capture insights uses AI, what it's designed to do, and the safeguards and boundaries you should know when using it, see [Network Watcher Responsible AI frequently asked questions (FAQ)](responsible-ai-faq.yml).

## Limitations

- Analysis isn't supported for continuous captures, virtual machine scale sets, or Azure Kubernetes Service (AKS).

- The Log Analytics workspace must be in the same subscription and region as the packet capture resource.

- The recommended file size during preview is 1 GB. Larger files might affect performance.

- Retries aren't supported when insights are partially generated, either for the summary or log ingestion.

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

## Known issues

- If you select a Log Analytics workspace for log ingestion, reopening the insights pane might not show the previously selected workspace.

## Related content

- [Generate packet capture insights and query logs](packet-capture-insights-how-to.md).
- [Manage packet captures](packet-capture-manage.md).
