## Traffic Manager Profile
Traffic manager and its child endpoint resource enable distribution of your traffic to endpoints in Azure and outside of Azure. Such traffic distribution is governed by policies. Traffic manager also allows endpoint health to be monitored, and traffic diverted appropriately based on the health of an endpoint. 

Key properties of a traffic manager profile include:

- **Traffic routing method** - possible values are *Performance*, *Weighted*, and *Priority*.
- **DNS configuration** - FQDN for the profile.
- **Protocol** - monitoring protocol, possible values are *HTTP* and *HTTPS*.
- **Port** - monitoring port. 
- **Path** - monitoring path.
- **Endpoints** - container for endpoint resources.

### Endpoint 
An endpoint is a child resource of a Traffic Manager Profile. It represents a service or web endpoint to which user traffic is distributed based on the configured policy in the Traffic Manager Profile resource. 

Key properties of an endpoint include:
 
- **Type** - the type of the endpoint, possible values are *Azure End point*, *External Endpoint*, and  *Nested Endpoint*. 
- **Target Resource ID** – public IP address of a service or web endpoint. This can be an Azure or external endpoint.
- **Weight** - endpoint weight used in traffic management. 
- **Priority** - priority of the endpoint, used to define a failover action. 