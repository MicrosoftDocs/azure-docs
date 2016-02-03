A traffic manager profile will dictate the routing behavior for Internet client requests to the defined endpoints. There are 3 types of routing methods used by traffic manager:

- Priority  
- Weighted 
- Performance

The chosen routing method will define to which endpoint will respond to the client request, either random (Weighted), lesser latency between Internet client and endpoint (Performance) or to an online endpoint (Priority).

Check out [Traffic Manager traffic routing Methods](traffic-manager-load-balancing-methods.md) for more information.


>[AZURE.NOTE] Keep in mind that all routing methods will do failover automatically if an endpoint is offline >(degraded). This will cause the endpoint from traffic manager to be removed from the possible endpoint list  until it comes back online.

