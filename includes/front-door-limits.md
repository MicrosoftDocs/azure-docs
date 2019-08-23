---
 title: include file
 description: include file
 services: frontdoor
 author: sharad4u
 ms.service: frontdoor
 ms.topic: include
 ms.date: 05/09/2019
 ms.author: sharadag
 ms.custom: include file
---

| Resource | Default/maximum limit |
| --- | --- |
| Azure Front Door Service resources per subscription | 100 |
| Front-end hosts, which includes custom domains per resource | 100 |
| Routing rules per resource | 100 |
| Back-end pools per resource | 50 |
| Back ends per back-end pool | 100 |
| Path patterns to match for a routing rule | 25 |
| Custom web application firewall rules per policy | 10 |
| Web application firewall policy per resource | 100 |
| Web application firewall match conditions per custom rule | 10 |
| Web application firewall IP address ranges per match condition | 600 |
| Web application firewall string match values per match condition | 10 |
| Web application firewall string match value length | 256 |
| Web application firewall POST body parameter name length | 256 |
| Web application firewall HTTP header name length | 256 |
| Web application firewall cookie name length | 256 |
| Web application firewall HTTP request body size inspected | 128 KB |
| Web application firewall custom response body length | 2 KB |

### Timeout values
#### Client to Front Door
- Front Door has an idle TCP connection timeout of 61 seconds.

#### Front Door to application back-end
- If the response is a chunked response, a 200 is returned if or when the first chunk is received.
- After the HTTP request is forwarded to the back end, Front Door waits for 30 seconds for the first packet from the back end. Then it returns a 503 error to the client.
- After the first packet is received from the back end, Front Door waits for 30 seconds in an idle timeout. Then it returns a 503 error to the client.
- Front Door to the back-end TCP session timeout is 30 minutes.

### Upload and download data limit

|  | With chunked transfer encoding (CTE) | Without HTTP chunking |
| ---- | ------- | ------- |
| **Download** | There's no limit on the download size. | There's no limit on the download size. |
| **Upload** |	There's no limit as long as each CTE upload is less than 2 GB. | The size can't be larger than 2 GB. |

### Other limits
- Maximum URL size - 8,192 bytes - Specifies maximum length of the raw URL (scheme + hostname + port + path + query string of the URL)- Maximum Query String size - 4,096 bytes - Specifies the maximum length of the query string, in bytes.