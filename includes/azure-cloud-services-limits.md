Resource|Default Limit|Maximum Limit
---|---|---
[Web/worker roles per deployment](../articles/cloud-services/cloud-services-choose-me.md)<sup>1</sup>|25|25
[Instance Input Endpoints](http://msdn.microsoft.com/library/gg557552.aspx#InstanceInputEndpoint) per deployment|25|25
[Input Endpoints](http://msdn.microsoft.com/library/gg557552.aspx#InputEndpoint) per deployment|25|25
[Internal Endpoints](http://msdn.microsoft.com/library/gg557552.aspx#InternalEndpoint) per deployment|25|25

<sup>1</sup>Each Cloud Service with Web/Worker roles can have two deployments, one for production and one for staging. Also note that this limit refers to the number of distinct roles (configuration) and not the number of instances per role (scaling).
