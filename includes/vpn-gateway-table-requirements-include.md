The table below lists the requirements for policy-based and route-based VPN gateways. This table applies to both the Resource Manager and classic deployment models. For the classic model, Policy-based VPN gateways are the same as Static gateways, and Route-based gateways are the same as Dynamic gateways.


|   | **Policy-based Basic VPN Gateway** | **Route-based Basic VPN Gateway** | **Route-based Standard VPN Gateway**   | **Route-based High Performance VPN Gateway** |
|---|---------------------------------------|---------------------------------------|----------------------------|----------------------------------|
|    **Site-to-Site connectivity   (S2S)**  | Policy-based VPN configuration        | Route-based VPN configuration  | Route-based VPN configuration     | Route-based VPN configuration    |
| **Point-to-Site connectivity (P2S**)      | Not supported   | Supported (Can coexist with S2S)  | Supported (Can coexist with S2S)  | Supported (Can coexist with S2S) |
| **Authentication method**                 |    Pre-shared key  | Pre-shared key for S2S connectivity, Certificates for P2S connectivity | Pre-shared key for S2S connectivity, Certificates for P2S connectivity | Pre-shared key for S2S connectivity, Certificates for P2S connectivity |
| **Maximum number of S2S connections**       | 1                              | 10                                                                    | 10                                | 30                               |
| **Maximum number of P2S connections**       | Not supported                  | 128                                                                   | 128                               | 128                              |
|**Active routing support (BGP)**           | Not supported                  | Not supported                                                         | Supported                     | Supported                   |
 
