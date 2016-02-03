
Azure Traffic Manager allows you to specify failover and round-robin traffic routing for websites and cloud services in different datacenters. The first step necessary to provide that functionality is to add the cloud service or website endpoint to Traffic Manager.

>[AZURE.NOTE] You cannot add external locations or Traffic Manager profiles as endpoints using the Azure classic portal. You must use the REST API [Create Definition](http://go.microsoft.com/fwlink/p/?LinkId=400772) or Windows PowerShell [Add-AzureTrafficManagerEndpoint](http://go.microsoft.com/fwlink/p/?LinkId=400774).<BR>

You can also disable individual endpoints that are part of a Traffic Manager profile. Endpoints include both cloud services and websites. Disabling an endpoint leaves it as part of the profile, but the profile acts as if the endpoint is not included in it. This action is very useful for temporarily removing an endpoint that is in maintenance mode or being redeployed. Once the endpoint is up and running again, it can be enabled.

>[AZURE.NOTE] Disabling an endpoint has nothing to do with its deployment state in Azure. A healthy endpoint will remain up and able to receive traffic even when disabled in Traffic Manager. Additionally, disabling an endpoint in one profile does not affect its status in another profile.
