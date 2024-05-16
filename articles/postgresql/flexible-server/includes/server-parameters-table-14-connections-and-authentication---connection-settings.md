---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### bonjour

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Connections and Authentication / Connection Settings |
| Description    | Enables advertising the server via Bonjour.                                                                                         |
| Data type      | boolean   |
| Default value  | `off`         |
| Allowed values | `off`          |
| Parameter type | read-only      |
| Documentation  |                                                                                              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### bonjour_name

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Connections and Authentication / Connection Settings |
| Description    | Sets the Bonjour service name.                                                                                                      |
| Data type      | string    |
| Default value  |               |
| Allowed values |                |
| Parameter type | read-only      |
| Documentation  |                                                                                              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### client_connection_check_interval

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Connections and Authentication / Connection Settings |
| Description    | Sets the time interval between checks for disconnection while running queries.                                                      |
| Data type      | integer   |
| Default value  | `0`           |
| Allowed values | `0`            |
| Parameter type | read-only      |
| Documentation  |                                                                                              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### listen_addresses

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Connections and Authentication / Connection Settings |
| Description    | Sets the host name or IP address(es) to listen to.                                                                                  |
| Data type      | string    |
| Default value  | `*`           |
| Allowed values | `*`            |
| Parameter type | read-only      |
| Documentation  |                                                                                              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### max_connections

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Connections and Authentication / Connection Settings |
| Description    | Sets the maximum number of concurrent connections to the database server.                                                           |
| Data type      | integer   |
| Default value  | Depends on resources (vCores, RAM, or disk space) allocated to the server.         |
| Allowed values | `25-5000`      |
| Parameter type | static         |
| Documentation  | [max_connections](https://www.postgresql.org/docs/14/runtime-config-connection.html)         |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### port

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Connections and Authentication / Connection Settings |
| Description    | Sets the TCP port the server listens on.                                                                                            |
| Data type      | integer   |
| Default value  | `5432`        |
| Allowed values | `5432`         |
| Parameter type | read-only      |
| Documentation  |                                                                                              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### reserved_connections

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Connections and Authentication / Connection Settings |
| Description    | Sets the number of connections slots reserved for replication users and super users.                                                |
| Data type      | integer   |
| Default value  | `5`           |
| Allowed values | `5`            |
| Parameter type | read-only      |
| Documentation  |                                                                                              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### superuser_reserved_connections

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Connections and Authentication / Connection Settings |
| Description    | Sets the number of connection slots reserved for superusers.                                                                        |
| Data type      | integer   |
| Default value  | `10`          |
| Allowed values | `10`           |
| Parameter type | read-only      |
| Documentation  |                                                                                              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### tcp_keepalives_count

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Connections and Authentication / Connection Settings |
| Description    | Specifies the number of TCP keepalives that can be lost before the server's connection to the client is considered dead.            |
| Data type      | integer   |
| Default value  | `9`           |
| Allowed values | `0-2147483647` |
| Parameter type | dynamic        |
| Documentation  | [tcp_keepalives_count](https://www.postgresql.org/docs/14/runtime-config-connection.html)    |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### tcp_keepalives_idle

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Connections and Authentication / Connection Settings |
| Description    | Specifies the number of seconds of inactivity after which TCP should send a keepalive message to the client.                        |
| Data type      | integer   |
| Default value  | `120`         |
| Allowed values | `0-2147483647` |
| Parameter type | dynamic        |
| Documentation  | [tcp_keepalives_idle](https://www.postgresql.org/docs/14/runtime-config-connection.html)     |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### tcp_keepalives_interval

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Connections and Authentication / Connection Settings |
| Description    | Specifies the number of seconds after which a TCP keepalive message that is not acknowledged by the client should be retransmitted. |
| Data type      | integer   |
| Default value  | `30`          |
| Allowed values | `0-2147483647` |
| Parameter type | dynamic        |
| Documentation  | [tcp_keepalives_interval](https://www.postgresql.org/docs/14/runtime-config-connection.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### tcp_user_timeout

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Connections and Authentication / Connection Settings |
| Description    | Specifies the amount of time that transmitted data may remain unacknowledged before the TCP connection is forcibly closed.          |
| Data type      | integer   |
| Default value  | `0`           |
| Allowed values | `0-2147483647` |
| Parameter type | dynamic        |
| Documentation  | [tcp_user_timeout](https://www.postgresql.org/docs/14/runtime-config-connection.html)        |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### unix_socket_directories

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Connections and Authentication / Connection Settings |
| Description    | Sets the directories where Unix-domain sockets will be created.                                                                     |
| Data type      | string    |
| Default value  | `/tmp`        |
| Allowed values | `/tmp`         |
| Parameter type | read-only      |
| Documentation  |                                                                                              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### unix_socket_group

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Connections and Authentication / Connection Settings |
| Description    | Sets the owning group of the Unix-domain socket.                                                                                    |
| Data type      | string    |
| Default value  |               |
| Allowed values |                |
| Parameter type | read-only      |
| Documentation  |                                                                                              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### unix_socket_permissions

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Connections and Authentication / Connection Settings |
| Description    | Sets the access permissions of the Unix-domain socket.                                                                              |
| Data type      | integer   |
| Default value  | `0777`        |
| Allowed values | `0777`         |
| Parameter type | read-only      |
| Documentation  |                                                                                              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



