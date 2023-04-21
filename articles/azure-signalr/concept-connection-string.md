---
title: Connection string in Azure SignalR Service
description: An overview of connection string in Azure SignalR Service, how to generate it and how to configure it in app server
author: chenkennt
ms.service: signalr
ms.topic: conceptual
ms.date: 03/29/2023
ms.author: kenchen
---

# Connection string in Azure SignalR Service

A connection string contains information about how to connect to Azure Signal Service (ASRS). In this article, you learn the basics of connection string and how to configure it in your application.

## What is a connection string

When an application needs to connect to Azure SignalR Service, it needs the following information:

- The HTTP endpoint of the SignalR service instance.
- The way to authenticate with the service endpoint.

A connection string contains such information.

## What a connection string looks like

A connection string consists of a series of key/value pairs separated by semicolons(;). An equal sign(=) to connect each key and its value. Keys aren't case sensitive.

For example, a typical connection string may look like this:

> Endpoint=https://<resource_name>.service.signalr.net;AccessKey=<access_key>;Version=1.0;

The connection string contains:

- `Endpoint=https://<resource_name>.service.signalr.net`: The endpoint URL of the resource.
- `AccessKey=<access_key>`: The key to authenticate with the service. When an access key is specified in the connection string, the SignalR Service SDK uses it to generate a token that is validated by the service.
- `Version`: The version of the connection string. The default value is `1.0`.

The following table lists all the valid names for key/value pairs in the connection string.

| Key | Description | Required | Default value| Example value 
| --- | --- | --- | --- | --- |
| Endpoint | The URL of your ASRS instance. | Y | N/A |`https://foo.service.signalr.net` |
| Port | The port that your ASRS instance is listening on. on. | N| 80/443, depends on the endpoint URI schema | 8080|
| Version| The version of given connection. string. | N| 1.0 | 1.0 |
| ClientEndpoint | The URI of your reverse proxy, such as the App Gateway or API. Management | N| null | `https://foo.bar` |
| AuthType | The auth type. By default the service uses the AccessKey authorize requests. **Case insensitive** | N | null | Azure, azure.msi, azure.app |

### Use AccessKey

The local auth method is used when `AuthType` is set to null.

| Key | Description| Required | Default value | Example value|
| --- | --- | --- | --- | --- |
| AccessKey | The key string in base64 format for building access token. | Y | null | ABCDEFGHIJKLMNOPQRSTUVWEXYZ0123456789+=/ |

### Use Azure Active Directory

The Azure AD auth method is used when `AuthType` is set to `azure`, `azure.app` or `azure.msi`.

| Key| Description| Required | Default value | Example value|
| -------------- | ------------------------------------------------------------------ | -------- | ------------- | ------------------------------------------ |
| ClientId | A GUID of an Azure application or an Azure identity. | N| null| `00000000-0000-0000-0000-000000000000` |
| TenantId | A GUID of an organization in Azure Active Directory. | N| null| `00000000-0000-0000-0000-000000000000` |
| ClientSecret | The password of an Azure application instance. | N| null| `***********************.****************` |
| ClientCertPath | The absolute path of a client certificate (cert) file to an Azure application instance. | N| null| `/usr/local/cert/app.cert` |

A different `TokenCredential` is used to generate Azure AD tokens depending on the parameters you have given.

- `type=azure`

  [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) is used.

  ```text
  Endpoint=xxx;AuthType=azure
  ```

- `type=azure.msi`

  1. A user-assigned managed identity is used if `clientId` has been given in connection string.

     ```
     Endpoint=xxx;AuthType=azure.msi;ClientId=<client_id>
     ```
     
     - [ManagedIdentityCredential(clientId)](/dotnet/api/azure.identity.managedidentitycredential) is used.

  1. A system-assigned managed identity is used.

     ```text
     Endpoint=xxx;AuthType=azure.msi;
     ```

     - [ManagedIdentityCredential()](/dotnet/api/azure.identity.managedidentitycredential) is used.

- `type=azure.app`

  `clientId` and `tenantId` are required to use [Azure AD application with service principal](../active-directory/develop/howto-create-service-principal-portal.md).

  1. [ClientSecretCredential(clientId, tenantId, clientSecret)](/dotnet/api/azure.identity.clientsecretcredential) is used if `clientSecret` is given.

     ```text
     Endpoint=xxx;AuthType=azure.msi;ClientId=<client_id>;clientSecret=<client_secret>>
     ```

  1. [ClientCertificateCredential(clientId, tenantId, clientCertPath)](/dotnet/api/azure.identity.clientcertificatecredential) is used if `clientCertPath` is given.

     ```text
     Endpoint=xxx;AuthType=azure.msi;ClientId=<client_id>;TenantId=<tenant_id>;clientCertPath=</path/to/cert>
     ```

## How to get connection strings

### From Azure portal

Open your SignalR service resource in Azure portal and go to `Keys` tab.

You see two connection strings (primary and secondary) in the following format:

> Endpoint=https://<resource_name>.service.signalr.net;AccessKey=<access_key>;Version=1.0;

### From Azure CLI

You can also use Azure CLI to get the connection string:

```bash
az signalr key list -g <resource_group> -n <resource_name>
```

## Connect with an Azure AD application

You can use an [Azure AD application](../active-directory/develop/app-objects-and-service-principals.md) to connect to your SignalR service. As long as the application has the right permission to access SignalR service, no access key is needed.

To use Azure AD authentication, you need to remove `AccessKey` from connection string and add `AuthType=azure.app`. You also need to specify the credentials of your Azure AD application, including client ID, client secret and tenant ID. The connection string looks as follows:

```text
Endpoint=https://<resource_name>.service.signalr.net;AuthType=azure.app;ClientId=<client_id>;ClientSecret=<client_secret>;TenantId=<tenant_id>;Version=1.0;
```

For more information about how to authenticate using Azure AD application, see [Authorize from Azure Applications](signalr-howto-authorize-application.md).

## Authenticate with Managed identity

You can also use a system assigned or user assigned  [managed identity](../active-directory/managed-identities-azure-resources/overview.md) to authenticate with SignalR service.

To use a system assigned identity, add `AuthType=azure.msi` to the connection string:

```text
Endpoint=https://<resource_name>.service.signalr.net;AuthType=azure.msi;Version=1.0;
```

The SignalR service SDK automatically uses the identity of your app server.

To use a user assigned identity, include the client ID of the managed identity in the connection string:

```text
Endpoint=https://<resource_name>.service.signalr.net;AuthType=azure.msi;ClientId=<client_id>;Version=1.0;
```

For more information about how to configure managed identity, see [Authorize from Managed Identity](signalr-howto-authorize-managed-identity.md).

> [!NOTE]
> It's highly recommended to use managed identity to authenticate with SignalR service as it's a more secure way compared to using access keys. If you don't use access keys authentication, consider completely disabling it (go to Azure portal -> Keys -> Access Key -> Disable). If you still use access keys, it's highly recommended to rotate them regularly. For more information, see [Rotate access keys for Azure SignalR Service](signalr-howto-key-rotation.md).

### Use the connection string generator

It may be cumbersome and error-prone to build connection strings manually. To avoid making mistakes, SignalR provides a connection string generator to help you generate a connection string that includes Azure AD identities like `clientId`, `tenantId`, etc.  To use the tool open your SignalR instance in Azure portal, select **Connection strings** from the left side menu.

:::image type="content" source="media/concept-connection-string/generator.png" alt-text="Screenshot showing connection string generator of SignalR service in Azure portal.":::

In this page you can choose different authentication types (access key, managed identity or Azure AD application) and input information like client endpoint, client ID, client secret, etc. Then connection string is automatically generated. You can copy and use it in your application.

> [!NOTE]
> Information you enter won't be saved after you leave the page. You will need to copy and save your connection string to use in your application.

For more information about how access tokens are generated and validated, see [Authenticate via Azure Active Directory Token](signalr-reference-data-plane-rest-api.md#authenticate-via-azure-active-directory-token-azure-ad-token) in [Azure SignalR service data plane REST API reference](signalr-reference-data-plane-rest-api.md) .

## Client and server endpoints

A connection string contains the HTTP endpoint for app server to connect to SignalR service. The server returns the HTTP endpoint to the clients in a negotiate response, so the client can connect to the service.

In some applications, there may be an extra component in front of SignalR service. All client connections need to go through that component first.  For example, [Azure Application Gateway](../application-gateway/overview.md) is a common service that provides additional network security.

In such case, the client needs to connect to an endpoint different than SignalR service. Instead of manually replacing the endpoint at the client side, you can add `ClientEndpoint` to connection string:

```text
Endpoint=https://<resource_name>.service.signalr.net;AccessKey=<access_key>;ClientEndpoint=https://<url_to_app_gateway>;Version=1.0;
```

The app server returns a response to the client's negotiate request containing the correct endpoint URL for the client to connect to. For more information about client connections, see [Azure SignalR Service internals](signalr-concept-internals.md#client-connections).

Similarly, the server wants to make [server connections](signalr-concept-internals.md#azure-signalr-service-internals) or call [REST APIs](https://github.com/Azure/azure-signalr/blob/dev/docs/rest-api.md) to the service, the SignalR service may also be behind another service like [Azure Application Gateway](../application-gateway/overview.md). In that case, you can use `ServerEndpoint` to specify the actual endpoint for server connections and REST APIs:

```text
Endpoint=https://<resource_name>.service.signalr.net;AccessKey=<access_key>;ServerEndpoint=https://<url_to_app_gateway>;Version=1.0;
```

## Configure connection string in your application

There are two ways to configure a connection string in your application.

You can set the connection string when calling `AddAzureSignalR()` API:

```cs
services.AddSignalR().AddAzureSignalR("<connection_string>");
```

Or you can call `AddAzureSignalR()` without any arguments. The service SDK returns the connection string from a config named `Azure:SignalR:ConnectionString` in your [configuration provider](/dotnet/core/extensions/configuration-providers).

In a local development environment, the configuration is stored in a file (*appsettings.json* or *secrets.json*) or environment variables. You can use one of the following ways to configure connection string:

- Use .NET secret manager (`dotnet user-secrets set Azure:SignalR:ConnectionString "<connection_string>"`)
- Set an environment variable named `Azure__SignalR__ConnectionString` to the connection string.  The colons need to be replaced with double underscore in the [environment variable configuration provider](/dotnet/core/extensions/configuration-providers#environment-variable-configuration-provider).

In a production environment, you can use other Azure services to manage config/secrets like Azure [Key Vault](../key-vault/general/overview.md) and [App Configuration](../azure-app-configuration/overview.md). See their documentation to learn how to set up configuration provider for those services.

> [!NOTE]
> Even when you're directly setting a connection string using code, it's not recommended to hardcode the connection string in source code  You should read the connection string from a secret store like key vault and pass it to `AddAzureSignalR()`.

### Configure multiple connection strings

Azure SignalR Service also allows the server to connect to multiple service endpoints at the same time, so it can handle more connections that are beyond a service instance's limit. Also, when one service instance is down the other service instances can be used as backup. For more information about how to use multiple instances, see [Scale SignalR Service with multiple instances](signalr-howto-scale-multi-instances.md).

There are also two ways to configure multiple instances:

- Through code:

  ```cs
  services.AddSignalR().AddAzureSignalR(options =>
      {
          options.Endpoints = new ServiceEndpoint[]
          {
              new ServiceEndpoint("<connection_string_1>", name: "name_a"),
              new ServiceEndpoint("<connection_string_2>", name: "name_b", type: EndpointType.Primary),
              new ServiceEndpoint("<connection_string_3>", name: "name_c", type: EndpointType.Secondary),
          };
      });
  ```

  You can assign a name and type to each service endpoint so you can distinguish them later.

- Through configuration:

  You can use any supported configuration provider (secret manager, environment variables, key vault, etc.) to store connection strings. Take secret manager as an example:

  ```bash
  dotnet user-secrets set Azure:SignalR:ConnectionString:name_a <connection_string_1>
  dotnet user-secrets set Azure:SignalR:ConnectionString:name_b:primary <connection_string_2>
  dotnet user-secrets set Azure:SignalR:ConnectionString:name_c:secondary <connection_string_3>
  ```

  You can assign a name and type to each endpoint by using a different config name in the following format:

  ```text
  Azure:SignalR:ConnectionString:<name>:<type>
  ```