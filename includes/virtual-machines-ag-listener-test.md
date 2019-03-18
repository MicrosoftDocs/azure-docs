---
author: cynthn
ms.service: virtual-machines
ms.topic: include
ms.date: 10/26/2018
ms.author: cynthn
---
In this step, you test the availability group listener by using a client application that's running on the same network.

Client connectivity has the following requirements:

* Client connections to the listener must come from machines that reside in a different cloud service than the one that hosts the Always On availability replicas.
* If the Always On replicas are in different subnets, clients must specify *MultisubnetFailover=True* in the connection string. This condition results in parallel connection attempts to replicas in the various subnets. This scenario includes a cross-region Always On availability group deployment.

One example is to connect to the listener from one of the VMs in the same Azure virtual network (but not one that hosts a replica). An easy way to complete this test is to try to connect SQL Server Management Studio to the availability group listener. Another simple method is to run [SQLCMD.exe](https://technet.microsoft.com/library/ms162773.aspx), as follows:

    sqlcmd -S "<ListenerName>,<EndpointPort>" -d "<DatabaseName>" -Q "select @@servername, db_name()" -l 15

> [!NOTE]
> If the EndpointPort value is *1433*, you are not required to specify it in the call. The previous call also assumes that the client machine is joined to the same domain and that the caller has been granted permissions on the database by using Windows authentication.
> 
> 

When you test the listener, be sure to fail over the availability group to make sure that clients can connect to the listener across failovers.

