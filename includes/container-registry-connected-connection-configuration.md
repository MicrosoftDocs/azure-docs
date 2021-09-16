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

The `ACR_REGISTRY_CONNECTION_STRING` environment variable needs to be passed to the connected registry container at runtime. 

The following environment variables are optional:

|Variable  |Description  |
|---------|---------|
|`ACR_REGISTRY_LOGIN_SERVER`     |  Optionally specifies the hostname or FQDN of the login server used to access the connected registry. If specified, it is the only login server that can be used to access the connected registry.<br/><br/> If no value is provided, then the connected registry can be accessed with any login server.       |
|`ACR_REGISTRY_CERTIFICATE_VOLUME`     |   If your connected registry will be accessible via HTTPS, points to the volume where the HTTPS certificates are stored.<br/><br/>If not set, the default location is `/var/acr/certs`.      |
|`ACR_REGISTRY_DATA_VOLUME`     |  Overwrites the default location `/var/acr/data` where the images will be stored by the connected registry.<br><br>This location must match the volume bind for the container.       |

> [!IMPORTANT]
> Make sure that you save the generated connection string. The connection string contains a one-time password that cannot be retrieved. If you issue the command again, a new password will be generated.