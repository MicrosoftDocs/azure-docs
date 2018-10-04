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
| Front Door resources per subscription | 100 |
| Front-end hosts including custom domains per resource | 100 |
| Routing rules per resource | 100 |
| Backend pools per resource | 50 |
| Backends per backend pool | 100 |
| Path patterns to match for a routing rule | 25 |
| Custom web application firewall rules per policy | 10 |
| Web application firewall policy per resource | 100 |

### Timeout Values
#### Client to Front Door
- Front Door has an idle TCP connection timeout of 61 seconds.
#### Front Door to application backend
- If the response is a chunked response, a 200 will be returned if / when the first chunk is received.
- After the HTTP request is forwarded to the backend, Front Door will wait for 30 seconds for the first packet from backend, before returning a 503 error to the client.
- After the first packet is received from the backend, Front Door waits for 30 seconds (idle timeout) before returning a 503 error to the client.
- Front Door to backend TCP session timeout is 30 minutes.

### Upload / download data limit

|  | With Chunked Transfer Encoding (CTE) | Without HTTP Chunking |
| ---- | ------- | ------- |
| **Download** | There is no limit on the download size | There is no limit on the download size |
| **Upload** |	No limit as long as each CTE upload is less than 28.6 MB | The size can't be larger than 28.6 MB. |
