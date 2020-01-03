---
author: tamram
ms.service: storage
ms.topic: include
ms.date: 10/26/2018
ms.author: tamram
---
The storage emulator supports a single fixed account and a well-known authentication key for Shared Key authentication. This account and key are the only Shared Key credentials permitted for use with the storage emulator. They are:

```
Account name: devstoreaccount1
Account key: Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==
```

> [!NOTE]
> The authentication key supported by the storage emulator is intended only for testing the functionality of your client authentication code. It does not serve any security purpose. You cannot use your production storage account and key with the storage emulator. You should not use the development account with production data.
> 
> The storage emulator supports connection via HTTP only. However, HTTPS is the recommended protocol for accessing resources in a production Azure storage account.
> 

#### Connect to the emulator account using a shortcut
The easiest way to connect to the storage emulator from your application is to configure a connection string in your application's configuration file that references the shortcut `UseDevelopmentStorage=true`. Here's an example of a connection string to the storage emulator in an *app.config* file: 

```xml
<appSettings>
  <add key="StorageConnectionString" value="UseDevelopmentStorage=true" />
</appSettings>
```

#### Connect to the emulator account using the well-known account name and key
To create a connection string that references the emulator account name and key, you must specify the endpoints for each of the services you wish to use from the emulator in the connection string. This is necessary so that the connection string will reference the emulator endpoints, which are different than those for a production storage account. For example, the value of your connection string will look like this:

```
DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;
AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;
BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;
TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;
QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;
```

This value is identical to the shortcut shown above, `UseDevelopmentStorage=true`.

#### Specify an HTTP proxy
You can also specify an HTTP proxy to use when you're testing your service against the storage emulator. This can be useful for observing HTTP requests and responses while you're debugging operations against the storage services. To specify a proxy, add the `DevelopmentStorageProxyUri` option to the connection string, and set its value to the proxy URI. For example, here is a connection string that points to the storage emulator and configures an HTTP proxy:

```
UseDevelopmentStorage=true;DevelopmentStorageProxyUri=http://myProxyUri
```

