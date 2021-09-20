---
author: dlepow
ms.service: container-registry
ms.topic: include
ms.date: 09/16/2021
ms.author: danlep
---
The following example output shows the connection string for the *myconnectedregistry* connected registry with parent registry *contosoregistry*:

```json
{
  "ACR_REGISTRY_CONNECTION_STRING": "ConnectedRegistryName=myconnectedregistry;SyncTokenName=myconnectedregistry-sync-token;SyncTokenPassword=xxxxxxxxxxxxxxxx;ParentGatewayEndpoint=contosoregistry.eastus.data.azurecr.io;ParentEndpointProtocol=https",
  "ACR_REGISTRY_LOGIN_SERVER": "<Optional: connected registry login server>."
}
```

* The `ACR_REGISTRY_CONNECTION_STRING` environment variable needs to be passed to the connected registry container at runtime. 
* The `ACR_REGISTRY_LOGIN_SERVER` environment variable is optional. If used, it specifies a unique hostname or FQDN of the login server used to access the connected registry.

    If no value is provided, then the connected registry can be accessed with any login server.       |

> [!IMPORTANT]
> Make sure that you save the generated connection string. The connection string contains a one-time password that cannot be retrieved. If you issue the command again, a new password will be generated.