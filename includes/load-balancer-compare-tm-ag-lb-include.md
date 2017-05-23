## Load Balancer differences

There are different options to distribute network traffic using Microsoft Azure. These options work differently from each other, having a different feature set and support different scenarios. They can each be used in isolation, or combining them.

* **Azure Load Balancer** works at the transport layer (Layer 4 in the OSI network reference stack). It provides network-level distribution of traffic across instances of an application running in the same Azure data center.
* **Application Gateway** works at the application layer (Layer 7 in the OSI network reference stack). It acts as a reverse-proxy service, terminating the client connection and forwarding requests to back-end endpoints.
* **Traffic Manager** works at the DNS level.  It uses DNS responses to direct end-user traffic to globally distributed endpoints. Clients then connect to those endpoints directly.

The following table summarizes the features offered by each service:

| Service | Azure Load Balancer | Application Gateway | Traffic Manager |
| --- | --- | --- | --- |
| Technology |Transport level (Layer 4) |Application level (Layer 7) |DNS level |
| Application protocols supported |Any |HTTP, HTTPS, and WebSockets |Any (An HTTP endpoint is required for endpoint monitoring) |
| Endpoints |Azure VMs and Cloud Services role instances |Any Azure internal IP address, public internet IP address, Azure VM, or Azure Cloud Service |Azure VMs, Cloud Services, Azure Web Apps, and external endpoints |
| Vnet support |Can be used for both Internet facing and internal (Vnet) applications |Can be used for both Internet facing and internal (Vnet) applications |Only supports Internet-facing applications |
| Endpoint Monitoring |Supported via probes |Supported via probes |Supported via HTTP/HTTPS GET |

Azure Load Balancer and Application Gateway route network traffic to endpoints but they have different usage scenarios to which traffic to handle. The following table helps understanding the difference between the two load balancers:

| Type | Azure Load Balancer | Application Gateway |
| --- | --- | --- |
| Protocols |UDP/TCP |HTTP, HTTPS, and WebSockets |
| IP reservation |Supported |Not supported |
| Load balancing mode |5-tuple(source IP, source port, destination IP, destination port, protocol type) |Round Robin<br>Routing based on URL |
| Load balancing mode (source IP /sticky sessions) |2-tuple (source IP and destination IP), 3-tuple (source IP, destination IP, and port). Can scale up or down based on the number of virtual machines |Cookie-based affinity<br>Routing based on URL |
| Health probes |Default: probe interval - 15 secs. Taken out of rotation: 2 Continuous failures. Supports user-defined probes |Idle probe interval 30 secs. Taken out after 5 consecutive live traffic failures or a single probe failure in idle mode. Supports user-defined probes |
| SSL offloading |Not supported |Supported |
| Url-based routing | Not supported | Supported|
| SSL Policy | Not supported | Supported|
