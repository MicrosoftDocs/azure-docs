In this step, you test the availability group listener using a client application running on the same network.

For client connectivity, please note the following requirements:

- Client connections to the listener must come from machines that reside in a different cloud service than the one that hosts the AlwaysOn Availability replicas.

- If the AlwaysOn replicas are in different subnets, clients must specify "MultisubnetFailover=True" in the connection string. This results in parallel connection attempts to replicas in the different subnets. Note that this scenario includes a cross-region AlwaysOn Availability Group deployment.

One example would be to connect to the listener from one of the VMs in the same Azure VNet (but not one that hosts a replica). An easy way to complete this test is to try to connect SSMS to the availability group listener. Another simple method is to run [SQLCMD.exe](https://technet.microsoft.com/library/ms162773.aspx) as follows:

	sqlcmd -S "<ListenerName>,<EndpointPort>" -d "<DatabaseName>" -Q "select @@servername, db_name()" -l 15

> [AZURE.NOTE] If the EndpointPort value is 1433, it is not required to specify it in the call. The previous call also assumes that the client machine is joined to the same domain and that the caller has been granted permissions on the database using windows authentication.

When testing the listener, be sure to fail over the availability group to make sure that clients can connect to the listener across failovers.