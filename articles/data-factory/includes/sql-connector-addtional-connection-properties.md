---
author: jianleishen
ms.service: data-factory
ms.topic: include
ms.date: 05/11/2024
ms.author: jianleishen
---
For additional connection properties, see the table below:

| Property | Description | Required |
|:--- |:--- |:--- |
| applicationIntent | The application workload type when connecting to a server. Allowed values are `ReadOnly` and `ReadWrite`. | No |
| connectTimeout | The length of time (in seconds) to wait for a connection to the server before terminating the attempt and generating an error. | No |
| connectRetryCount| The number of reconnections attempted after identifying an idle connection failure. The value should be an integer between 0 and 255. | No |
| connectRetryInterval| The amount of time (in seconds) between each reconnection attempt after identifying an idle connection failure. The value should be an integer between 1 and 60. | No |
| loadBalanceTimeout| The minimum time (in seconds) for the connection to live in the connection pool before the connection being destroyed. | No |
| commandTimeout| The default wait time (in seconds) before terminating the attempt to execute a command and generating an error. | No |
| integratedSecurity| The allowed values are `true` or `false`. When specifying `false`, indicate whether userName and password are specified in the connection. When specifying `true`, indicates whether the current Windows account credentials are used for authentication.  | No |
| failoverPartner|The name or address of the partner server to connect to if the primary server is down.| No |
| maxPoolSize|The maximum number of connections allowed in the connection pool for the specific connection.| No |
| minPoolSize|The minimum number of connections allowed in the connection pool for the specific connection. | No |
|multipleActiveResultSets|The allowed values are `true` or `false`. When you specify `true`, an application can maintain multiple active result sets (MARS). When you specify `false`, an application must process or cancel all result sets from one batch before it can execute any other batches on that connection. | No |
|multiSubnetFailover|The allowed values are `true` or `false`. If your application is connecting to an AlwaysOn availability group (AG) on different subnets, setting this property to `true` provides faster detection of and connection to the currently active server. | No |
|packetSize|The size in bytes of the network packets used to communicate with an instance of server. | No |
|pooling| The allowed values are `true` or `false`. When you specify `true`, the connection will be pooled. When you specify `false`, the connection will be explicitly opened every time the connection is requested. | No |