---
author: tamram
ms.service: storage
ms.topic: include
ms.date: 07/17/2020
ms.author: tamram
---
The emulator supports a single fixed account and a well-known authentication key for Shared Key authentication. This account and key are the only Shared Key credentials permitted for use with the emulator. They are:

```
Account name: devstoreaccount1
Account key: Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==
```

> [!NOTE]
> The authentication key supported by the emulator is intended only for testing the functionality of your client authentication code. It does not serve any security purpose. You cannot use your production storage account and key with the emulator. You should not use the development account with production data.
> 
> The emulator supports connection via HTTP only. However, HTTPS is the recommended protocol for accessing resources in a production Azure storage account.
> 

#### Connect to the emulator account using a shortcut
The easiest way to connect to the emulator from your application is to configure a connection string in your application's configuration file that references the shortcut `UseDevelopmentStorage=true`. Here's an example of a connection string to the emulator in an *app.config* file: 

```xml
<appSettings>
  <add key="StorageConnectionString" value="UseDevelopmentStorage=true" />
</appSettings>
```

The is equivalent to fully specifying the account name, the account key and the endpoints for each of the emulator services you wish to use in the connection string. This is necessary so that the connection string will reference the emulator endpoints, which are different than those for a production storage account. For example, the value of your connection string will look like this:

```
DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;
AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;
BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;
QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;
```
