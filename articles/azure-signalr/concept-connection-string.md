---
title: Connection strings in Azure SignalR Service
description: This article gives an overview of connection strings in Azure SignalR Service, how to generate one, and how to configure one in an app server.
author: chenkennt
ms.service: signalr
ms.topic: conceptual
ms.date: 03/29/2023
ms.author: kenchen
---

# Connection strings in Azure SignalR Service

A connection string contains information about how to connect to Azure SignalR Service. In this article, you learn the basics of connection strings and how to configure one in your application.

## What a connection string is

When an application needs to connect to Azure SignalR Service, it needs the following information:

- The HTTP endpoint of the Azure SignalR Service instance.
- The way to authenticate with the service endpoint.

A connection string contains such information.

## What a connection string looks like

A connection string consists of a series of key/value pairs separated by semicolons (;). The string uses an equal sign (=) to connect each key and its value. Keys aren't case sensitive.

A typical connection string might look like this example:

> Endpoint=https://<resource_name>.service.signalr.net;AccessKey=<access_key>;Version=1.0;

The connection string contains:

- `Endpoint=https://<resource_name>.service.signalr.net`: The endpoint URL of the resource.
- `AccessKey=<access_key>`: The key to authenticate with the service. When an access key is specified in the connection string, the Azure SignalR Service SDK uses it to generate a token that the service validates.
- `Version`: The version of the connection string. The default value is `1.0`.

The following table lists all the valid names for key/value pairs in the connection string.

| Key            | Description                                                                                       | Required | Default value                              | Example value                     |
| -------------- | ------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------ | --------------------------------- |
| `Endpoint`       | The URL of your Azure SignalR Service instance.                                                                    | Yes        | Not applicable                                        | `https://foo.service.signalr.net` |
| `Port`           | The port that your Azure SignalR Service instance is listening on. on.                                             | No        | `80` or `443`, depending on the endpoint URI schema | `8080`                              |
| `Version`        | The version of a connection string.                                                          | No        | `1.0`                                        | `1.0`                               |
| `ClientEndpoint` | The URI of your reverse proxy, such as the Azure Application Gateway or Azure API Management.                         | No        | `null`                                       | `https://foo.bar`                 |
| `AuthType`       | The authentication type. By default, the service uses `AccessKey` to authorize requests. It's not case sensitive. | No        | `null`                                       | `Azure`, `azure.msi`, `azure.app`       |

### Use AccessKey

The service uses the local authentication method when `AuthType` is set to `null`.

| Key       | Description                                                | Required | Default value | Example value                            |
| --------- | ---------------------------------------------------------- | -------- | ------------- | ---------------------------------------- |
| `AccessKey` | The key string in Base64 format for building an access token. | Yes        | `null`          | `ABCDEFGHIJKLMNOPQRSTUVWEXYZ0123456789+=/` |

### Use Microsoft Entra ID

The services uses the Microsoft Entra ID authentication method when `AuthType` is set to `azure`, `azure.app`, or `azure.msi`.

| Key            | Description                                                                             | Required | Default value | Example value                              |
| -------------- | --------------------------------------------------------------------------------------- | -------- | ------------- | ------------------------------------------ |
| `ClientId`       | A GUID of an Azure application or an Azure identity.                                    | N        | null          | `00000000-0000-0000-0000-000000000000`     |
| `TenantId`       | A GUID of an organization in Microsoft Entra ID.                                        | N        | null          | `00000000-0000-0000-0000-000000000000`     |
| `ClientSecret`   | The password of an Azure application instance.                                          | N        | null          | `***********************.****************` |
| `ClientCertPath` | The absolute path of a client certificate file to an Azure application instance. | N        | null          | `/usr/local/cert/app.cert`                 |

The service uses a different `TokenCredential` value to generate Microsoft Entra tokens, depending on the parameters that you give:

- `type=azure`

  The services uses [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential).

  ```text
  Endpoint=xxx;AuthType=azure
  ```

- `type=azure.msi`

  - The service uses a user-assigned managed identity if the connection string uses `clientId`.

     ```text
     Endpoint=xxx;AuthType=azure.msi;ClientId=<client_id>
     ```

    The services uses [ManagedIdentityCredential(clientId)](/dotnet/api/azure.identity.managedidentitycredential).

  - The service uses a system-assigned managed identity.

     ```text
     Endpoint=xxx;AuthType=azure.msi;
     ```

    The service uses [ManagedIdentityCredential()](/dotnet/api/azure.identity.managedidentitycredential).

- `type=azure.app`

  `clientId` and `tenantId` are required to use [a Microsoft Entra application with a service principal](../active-directory/develop/howto-create-service-principal-portal.md).

  - The service uses [ClientSecretCredential(clientId, tenantId, clientSecret)](/dotnet/api/azure.identity.clientsecretcredential) if the connection string uses `clientSecret`.

     ```text
     Endpoint=xxx;AuthType=azure.msi;ClientId=<client_id>;clientSecret=<client_secret>>
     ```

  - The service uses [ClientCertificateCredential(clientId, tenantId, clientCertPath)](/dotnet/api/azure.identity.clientcertificatecredential) if the connection string uses `clientCertPath`.

     ```text
     Endpoint=xxx;AuthType=azure.msi;ClientId=<client_id>;TenantId=<tenant_id>;clientCertPath=</path/to/cert>
     ```

## How to get connection strings

You can use the Azure portal or the Azure CLI to get connection strings.

### Azure portal

Open your Azure SignalR Service resource in the Azure portal. The **Keys** tab shows two connection strings (primary and secondary) in the following format:

> `Endpoint=https://<resource_name>.service.signalr.net;AccessKey=<access_key>;Version=1.0;`

### Azure CLI

```bash
az signalr key list -g <resource_group> -n <resource_name>
```

## Connect with a Microsoft Entra application

You can use a [Microsoft Entra application](../active-directory/develop/app-objects-and-service-principals.md) to connect to your Azure SignalR Service instance. If the application has the right permission to access Azure SignalR Service, it doesn't need an access key.

To use Microsoft Entra authentication, you need to remove `AccessKey` from connection string and add `AuthType=azure.app`. You also need to specify the credentials of your Microsoft Entra application, including client ID, client secret, and tenant ID. The connection string looks like this example:

```text
Endpoint=https://<resource_name>.service.signalr.net;AuthType=azure.app;ClientId=<client_id>;ClientSecret=<client_secret>;TenantId=<tenant_id>;Version=1.0;
```

For more information about how to authenticate by using a Microsoft Entra application, see [Authorize requests to SignalR resources with Microsoft Entra applications](signalr-howto-authorize-application.md).

## Authenticate with a managed identity

You can also use a system-assigned or user-assigned [managed identity](../active-directory/managed-identities-azure-resources/overview.md) to authenticate with Azure SignalR Service.

To use a system-assigned identity, add `AuthType=azure.msi` to the connection string:

```text
Endpoint=https://<resource_name>.service.signalr.net;AuthType=azure.msi;Version=1.0;
```

The Azure SignalR Service SDK automatically uses the identity of your app server.

To use a user-assigned identity, include the client ID of the managed identity in the connection string:

```text
Endpoint=https://<resource_name>.service.signalr.net;AuthType=azure.msi;ClientId=<client_id>;Version=1.0;
```

For more information about how to configure managed identities, see [Authorize requests to SignalR resources with Microsoft Entra managed identities](signalr-howto-authorize-managed-identity.md).

> [!NOTE]
> We highly recommended that you use managed identities to authenticate with Azure SignalR Service, because they're more secure than access keys. If you don't use access keys for authentication, consider completely disabling them in the Azure portal (select **Keys** > **Access Key** > **Disable**).
>
> If you decide to use access keys, we recommend that you rotate them regularly. For more information, see [Rotate access keys for Azure SignalR Service](signalr-howto-key-rotation.md).

### Use the connection string generator

Building connection strings manually can be cumbersome and error prone. To avoid making mistakes, Azure SignalR Service provides a connection string generator to help you generate a connection string that includes Microsoft Entra identities like `clientId` and `tenantId`. To use the tool, open your Azure SignalR Service instance in Azure portal and select **Connection strings** from the left menu.

:::image type="content" source="media/concept-connection-string/generator.png" alt-text="Screenshot that shows the connection string generator for Azure SignalR Service in the Azure portal.":::

On this page, you can choose among authentication types (access key, managed identity, or Microsoft Entra application) and enter information like client endpoint, client ID, and client secret. Then the connection string is automatically generated. You can copy and use it in your application.

> [!NOTE]
> Information that you enter isn't saved after you leave the page. You need to copy and save your connection string to use it in your application.

For more information about how access tokens are generated and validated, see the [Authenticate via Microsoft Entra token](signalr-reference-data-plane-rest-api.md#authenticate-via-microsoft-entra-token) section in the Azure SignalR Service data plane REST API reference.

## Provide client and server endpoints

A connection string contains the HTTP endpoint for the app server to connect to Azure SignalR Service. The server returns the HTTP endpoint to the clients in a negotiation response, so the client can connect to the service.

In some applications, there might be an extra component in front of Azure SignalR Service. All client connections need to go through that component first. For example, [Azure Application Gateway](../application-gateway/overview.md) is a common service that provides additional network security.

In such cases, the client needs to connect to an endpoint that's different from Azure SignalR Service. Instead of manually replacing the endpoint at the client side, you can add `ClientEndpoint` to the connection string:

```text
Endpoint=https://<resource_name>.service.signalr.net;AccessKey=<access_key>;ClientEndpoint=https://<url_to_app_gateway>;Version=1.0;
```

The app server returns a response to the client's negotiation request containing the correct endpoint URL for the client to connect to. For more information about client connections, see [Azure SignalR Service internals](signalr-concept-internals.md#client-connections).

Similarly, the server wants to make [server connections](signalr-concept-internals.md#azure-signalr-service-internals) or call [REST APIs](https://github.com/Azure/azure-signalr/blob/dev/docs/rest-api.md) to the service, Azure SignalR Service may also be behind another service like [Azure Application Gateway](../application-gateway/overview.md). In that case, you can use `ServerEndpoint` to specify the actual endpoint for server connections and REST APIs:

```text
Endpoint=https://<resource_name>.service.signalr.net;AccessKey=<access_key>;ServerEndpoint=https://<url_to_app_gateway>;Version=1.0;
```

## Configure a connection string in your application

There are two ways to configure a connection string in your application.

You can set the connection string when calling `AddAzureSignalR()` API:

```cs
services.AddSignalR().AddAzureSignalR("<connection_string>");
```

Or you can call `AddAzureSignalR()` without any arguments. The service SDK returns the connection string from a configuration named `Azure:SignalR:ConnectionString` in your [configuration provider](/dotnet/core/extensions/configuration-providers).

In a local development environment, the configuration is stored in a file (_appsettings.json_ or _secrets.json_) or environment variables. You can use one of the following ways to configure connection string:

- Use a .NET secret manager (`dotnet user-secrets set Azure:SignalR:ConnectionString "<connection_string>"`)
- Set an environment variable named `Azure__SignalR__ConnectionString` to the connection string. The colons need to be replaced with double underscore in the [environment variable configuration provider](/dotnet/core/extensions/configuration-providers#environment-variable-configuration-provider).

In a production environment, you can use other Azure services to manage config/secrets like Azure [Key Vault](../key-vault/general/overview.md) and [App Configuration](../azure-app-configuration/overview.md). See their documentation to learn how to set up configuration provider for those services.

> [!NOTE]
> Even when you're directly setting a connection string using code, it's not recommended to hardcode the connection string in source code You should read the connection string from a secret store like key vault and pass it to `AddAzureSignalR()`.

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
