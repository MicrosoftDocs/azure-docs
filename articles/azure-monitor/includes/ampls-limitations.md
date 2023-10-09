The AMPLS object has the following limits:
* A virtual network can connect to only *one* AMPLS object. That means the AMPLS object must provide access to all the Azure Monitor resources to which the virtual network should have access.
* An AMPLS object can connect to 300 Log Analytics workspaces and 1,000 Application Insights components at most.
* An Azure Monitor resource (workspace or Application Insights component or [data collection endpoint](../essentials/data-collection-endpoint-overview.md)) can connect to five AMPLSs at most.
* An AMPLS object can connect to 10 private endpoints at most.

> [!NOTE]
> AMPLS resources created before December 1, 2021, support only 50 resources.