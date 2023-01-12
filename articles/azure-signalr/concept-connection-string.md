---
title: Connection string in Azure SignalR Service
description: An overview of connection string in Azure SignalR Service, how to generate it and how to configure it in app server
author: chenkennt
ms.service: signalr
ms.topic: conceptual
ms.date: 03/25/2022
ms.author: kenchen
---

# Connection string in Azure SignalR Service

Connection string is an important concept that contains information about how to connect to SignalR service. In this article, you'll learn the basics of connection string and how to configure it in your application.

## What is connection string

When an application needs to connect to Azure SignalR Service, it will need the following information:

- The HTTP endpoint of the SignalR service instance
- How to authenticate with the service endpoint

Connection string contains such information.

## What connection string looks like

A connection string consists of a series of key/value pairs separated by semicolons(;) and we use an equal sign(=) to connect each key and its value. Keys aren't case sensitive.

For example, a typical connection string may look like this:

```
Endpoint=https://<resource_name>.service.signalr.net;AccessKey=<access_key>;Version=1.0;
```

You can see in the connection string, there are two main information:

- `Endpoint=https://<resource_name>.service.signalr.net` is the endpoint URL of the resource
- `AccessKey=<access_key>` is the key to authenticate with the service. When access key is specified in connection string, SignalR service SDK will use it to generate a token that can be validated by the service.

The following table lists all the valid names for key/value pairs in the connection string.

| key            | Description                                                                               | Required | Default value                          | Example value                                 |
| -------------- | ----------------------------------------------------------------------------------------- | -------- | -------------------------------------- | --------------------------------------------- |
| Endpoint       | The URI of your ASRS instance.                                                            | Y        | N/A                                    | `https://foo.service.signalr.net`               |
| Port           | The port that your ASRS instance is listening on.                                         | N        | 80/443, depends on endpoint uri schema | 8080                                          |
| Version        | The version of given connection string.                                                   | N        | 1.0                                    | 1.0                                           |
| ClientEndpoint | The URI of your reverse proxy, like App Gateway or API Management                         | N        | null                                   | `https://foo.bar`                               |
| AuthType       | The auth type, we'll use AccessKey to authorize requests by default. **Case insensitive** | N        | null                                   | azure, azure.msi, azure.app |

### Use AccessKey

Local auth method will be used when `AuthType` is set to null.

| key       | Description                                                      | Required | Default value | Example value                            |
| --------- | ---------------------------------------------------------------- | -------- | ------------- | ---------------------------------------- |
| AccessKey | The key string in base64 format for building access token usage. | Y        | null          | ABCDEFGHIJKLMNOPQRSTUVWEXYZ0123456789+=/ |

### Use Azure Active Directory

Azure AD auth method will be used when `AuthType` is set to `azure`, `azure.app` or `azure.msi`.

| key            | Description                                                        | Required | Default value | Example value                              |
| -------------- | ------------------------------------------------------------------ | -------- | ------------- | ------------------------------------------ |
| ClientId       | A guid represents an Azure application or an Azure identity.       | N        | null          | `00000000-0000-0000-0000-000000000000`     |
| TenantId       | A guid represents an organization in Azure Active Directory.       | N        | null          | `00000000-0000-0000-0000-000000000000`     |
| ClientSecret   | The password of an Azure application instance.                     | N        | null          | `***********************.****************` |
| ClientCertPath | The absolute path of a cert file to an Azure application instance. | N        | null          | `/usr/local/cert/app.cert`                 |

Different `TokenCredential` will be used to generate Azure AD tokens with the respect of params you have given.

- `type=azure`

  [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) will be used.

  ```
  Endpoint=xxx;AuthType=azure
  ```

- `type=azure.msi`

  1. User-assigned managed identity will be used if `clientId` has been given in connection string.

     ```
     Endpoint=xxx;AuthType=azure.msi;ClientId=00000000-0000-0000-0000-000000000000
     ```
     
     - [ManagedIdentityCredential(clientId)](/dotnet/api/azure.identity.managedidentitycredential) will be used.

  2. Otherwise system-assigned managed identity will be used.

     ```
     Endpoint=xxx;AuthType=azure.msi;
     ```

     - [ManagedIdentityCredential()](/dotnet/api/azure.identity.managedidentitycredential) will be used.
     

- `type=azure.app`

  `clientId` and `tenantId` are required to use [Azure AD application with service principal](../active-directory/develop/howto-create-service-principal-portal.md).

  1. [ClientSecretCredential(clientId, tenantId, clientSecret)](/dotnet/api/azure.identity.clientsecretcredential) will be used if `clientSecret` is given.
     ```
     Endpoint=xxx;AuthType=azure.msi;ClientId=00000000-0000-0000-0000-000000000000;TenantId=00000000-0000-0000-0000-000000000000;clientScret=******
     ```

  2. [ClientCertificateCredential(clientId, tenantId, clientCertPath)](/dotnet/api/azure.identity.clientcertificatecredential) will be used if `clientCertPath` is given.
     ```
     Endpoint=xxx;AuthType=azure.msi;ClientId=00000000-0000-0000-0000-000000000000;TenantId=00000000-0000-0000-0000-000000000000;clientCertPath=/path/to/cert
     ```

## How to get my connection strings

### From Azure portal

Open your SignalR service resource in Azure portal and go to `Keys` tab.

You'll see two connection strings (primary and secondary) in the following format:

> Endpoint=https://<resource_name>.service.signalr.net;AccessKey=<access_key>;Version=1.0;

### From Azure CLI

You can also use Azure CLI to get the connection string:

```bash
az signalr key list -g <resource_group> -n <resource_name>
```

### For using Azure AD application

You can use [Azure AD application](../active-directory/develop/app-objects-and-service-principals.md) to connect to SignalR service. As long as the application has the right permission to access SignalR service, no access key is needed.

To use Azure AD authentication, you need to remove `AccessKey` from connection string and add `AuthType=azure.app`. You also need to specify the credentials of your Azure AD application, including client ID, client secret and tenant ID. The connection string will look as follows:

```
Endpoint=https://<resource_name>.service.signalr.net;AuthType=azure.app;ClientId=<client_id>;ClientSecret=<client_secret>;TenantId=<tenant_id>;Version=1.0;
```

For more information about how to authenticate using Azure AD application, see this [article](signalr-howto-authorize-application.md).

### For using Managed identity

You can also use [managed identity](../active-directory/managed-identities-azure-resources/overview.md) to authenticate with SignalR service.

There are two types of managed identities, to use system assigned identity, you just need to add `AuthType=azure.msi` to the connection string:

```
Endpoint=https://<resource_name>.service.signalr.net;AuthType=azure.msi;Version=1.0;
```

SignalR service SDK will automatically use the identity of your app server.

To use user assigned identity, you also need to specify the client ID of the managed identity:

```
Endpoint=https://<resource_name>.service.signalr.net;AuthType=azure.msi;ClientId=<client_id>;Version=1.0;
```

For more information about how to configure managed identity, see this [article](signalr-howto-authorize-managed-identity.md).

> [!NOTE]
> It's highly recommended to use Azure AD to authenticate with SignalR service as it's a more secure way comparing to using access key. If you don't use access key authentication at all, consider to completely disable it (go to Azure portal -> Keys -> Access Key -> Disable). If you still use access key, it's highly recommended to rotate them regularly (more information can be found [here](signalr-howto-key-rotation.md)).

### Use connection string generator

It may be cumbersome and error-prone to build connection strings manually.

To avoid making mistakes, we built a tool to help you generate connection string with Azure AD identities like `clientId`, `tenantId`, etc.

To use connection string generator, open your SignalR resource in Azure portal, go to `Connection strings` tab:

:::image type="content" source="media/concept-connection-string/generator.png" alt-text="Screenshot showing connection string generator of SignalR service in Azure portal.":::

In this page you can choose different authentication types (access key, managed identity or Azure AD application) and input information like client endpoint, client ID, client secret, etc. Then connection string will be automatically generated. You can copy and use it in your application.

> [!NOTE]
> Everything you input on this page won't be saved after you leave the page (since they're only client side information), so please copy and save it in a secure place for your application to use.

> [!NOTE]
> For more information about how access tokens are generated and validated, see this [article](https://github.com/Azure/azure-signalr/blob/dev/docs/rest-api.md#authenticate-via-azure-signalr-service-accesskey).

## Client and server endpoints

Connection string contains the HTTP endpoint for app server to connect to SignalR service. This is also the endpoint server will return to clients in negotiate response, so client can also connect to the service.

But in some applications there may be an extra component in front of SignalR service and all client connections need to go through that component first (to gain extra benefits like network security, [Azure Application Gateway](../application-gateway/overview.md) is a common service that provides such functionality).

In such case, the client will need to connect to an endpoint different than SignalR service. Instead of manually replace the endpoint at client side, you can add `ClientEndpoint` to connecting string:

```
Endpoint=https://<resource_name>.service.signalr.net;AccessKey=<access_key>;ClientEndpoint=https://<url_to_app_gateway>;Version=1.0;
```

Then app server will return the right endpoint url in negotiate response for client to connect.

> [!NOTE]
> For more information about how clients get service url through negotiate, see this [article](signalr-concept-internals.md#client-connections).

Similarly, when server wants to make [server connections](signalr-concept-internals.md#server-connections) or call [REST APIs](https://github.com/Azure/azure-signalr/blob/dev/docs/rest-api.md) to service, SignalR service may also be behind another service like Application Gateway. In that case, you can use `ServerEndpoint` to specify the actual endpoint for server connections and REST APIs:

```
Endpoint=https://<resource_name>.service.signalr.net;AccessKey=<access_key>;ServerEndpoint=https://<url_to_app_gateway>;Version=1.0;
```

## Configure connection string in your application

There are two ways to configure connection string in your application.

You can set the connection string when calling `AddAzureSignalR()` API:

```cs
services.AddSignalR().AddAzureSignalR("<connection_string>");
```

Or you can call `AddAzureSignalR()` without any arguments, then service SDK will read the connection string from a config named `Azure:SignalR:ConnectionString` in your [config providers](/dotnet/core/extensions/configuration-providers).

In a local development environment, the config is stored in file (appsettings.json or secrets.json) or environment variables, so you can use one of the following ways to configure connection string:

- Use .NET secret manager (`dotnet user-secrets set Azure:SignalR:ConnectionString "<connection_string>"`)
- Set connection string to environment variable named `Azure__SignalR__ConnectionString` (colon needs to replaced with double underscore in [environment variable config provider](/dotnet/core/extensions/configuration-providers#environment-variable-configuration-provider)).

In production environment, you can use other Azure services to manage config/secrets like Azure [Key Vault](../key-vault/general/overview.md) and [App Configuration](../azure-app-configuration/overview.md). See their documentation to learn how to set up config provider for those services.

> [!NOTE]
> Even you're directly setting connection string using code, it's not recommended to hardcode the connection string in source code, so you should still first read the connection string from a secret store like key vault and pass it to `AddAzureSignalR()`.

### Configure multiple connection strings

Azure SignalR Service also allows server to connect to multiple service endpoints at the same time, so it can handle more connections, which are beyond one service instance's limit. Also if one service instance is down, other service instances can be used as backup. For more information about how to use multiple instances, see this [article](signalr-howto-scale-multi-instances.md).

There are also two ways to configure multiple instances:

- Through code

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

- Through config

  You can use any supported config provider (secret manager, environment variables, key vault, etc.) to store connection strings. Take secret manager as an example:

  ```bash
  dotnet user-secrets set Azure:SignalR:ConnectionString:name_a <connection_string_1>
  dotnet user-secrets set Azure:SignalR:ConnectionString:name_b:primary <connection_string_2>
  dotnet user-secrets set Azure:SignalR:ConnectionString:name_c:secondary <connection_string_3>
  ```

  You can also assign name and type to each endpoint, by using a different config name in the following format:

  ```
  Azure:SignalR:ConnectionString:<name>:<type>
  ```