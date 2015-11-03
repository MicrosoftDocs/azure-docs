## Application Gateway

Application Gateway provides an Azure-managed HTTP load balancing solution based on layer 7 load balancing. Application load balancing allows the use of routing rules for network traffic based on HTTP. 

Application Gateways contain the following child resources:

- **Back end server pool** - The list of IP addresses of the back end servers. The IP addresses listed should either belong to the virtual network subnet, or should be a public IP/VIP. 
- **Back end server pool settings** - Every pool has settings like port, protocol, and cookie based affinity. These settings are tied to a pool and are applied to all servers within the pool.
- **Front end Port** - This port is the public port opened on the application gateway. Traffic hits this port, and then gets redirected to one of the back end servers.
- **Listener** - listener has a frontend port, a protocol (Http or Https, these are case-sensitive), and the SSL certificate name (if configuring SSL offload). 
- **Rule** - The rule binds the listener and the back end server pool and defines which back end server pool the traffic should be directed to when it hits a particular listener. Currently, only the basic rule is supported. The basic rule is round-robin load distribution.
