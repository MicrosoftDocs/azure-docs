A traffic manager profile will dictate the routing behavior for Internet client requests to the defined endpoints. There are 3 types of routing methods used by traffic manager:

- Failover 
- Round-robin
- Performance

Azure Resource Manager uses a different naming for the Traffic Manager profiles:

- Priority (where before was Failover) 
- Weighted (where before was Round-Robin)
- Performance

The chosen routing method will define to which endpoint will respond to the client request, either random (Round-robin), lesser latency between Internet client and endpoint (Performance) or to an online endpoint (Failover).

Check out [Traffic Manager traffic routing Methods](traffic-manager-load-balancing-methods.md) for more information.

<BR>
>[AZURE.NOTE] Keep in mind that all routing methods will do failover automatically if an endpoint is offline >(degraded). This will cause the endpoint from traffic manager to be removed from the possible endpoint list  until it comes back online.
<BR>
