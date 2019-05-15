---
 title: include file
 description: include file
 services: frontdoor
 author: sharad4u
 ms.service: frontdoor
 ms.topic: include
 ms.date: 9/17/2018
 ms.author: sharadag
 ms.custom: include file
---

| Resource | Default limit |
| --- | --- |
| Azure Front Door Service resources per subscription | 100 |
| Front-end hosts, which includes custom domains per resource | 100 |
| Routing rules per resource | 100 |
| Back-end pools per resource | 50 |
| Back ends per back-end pool | 100 |
| Path patterns to match for a routing rule | 25 |
| Custom web application firewall rules per policy | 10 |
| Web application firewall policy per resource | 100 |

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
