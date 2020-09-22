---
title: Authenticate to Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about the various ways an app or service can authenticate to Communication Services.
author: matthewrobertson
manager: jken
services: azure-communication-services

ms.author: marobert
ms.date: 07/24/2020
ms.topic: conceptual
ms.service: azure-communication-services
---
# Authenticate to Azure Communication Services

[!INCLUDE [Public Preview Notice](../includes/public-preview-include.md)]

This article provides information on authenticating clients to Azure Communication Services using *access keys* and *user access tokens*. Every client interaction with Azure Communication Services needs to be authenticated.

The following table describes which authentication options are supported by the Azure Communication Services client libraries:

| Client library | Access key    | User access tokens |
| -------------- | ------------- | ------------------ |
| Administration | Supported     | Not Supported      |
| SMS            | Supported     | Not Supported      |
| Chat           | Not Supported | Supported          |
| Calling        | Not Supported | Supported          |

Each authorization option is briefly described below:

- **Access Key** authentication for SMS and Administration operations. Access Key authentication is suitable for applications running in a trusted service environment. To authenticate with an access key, a client generates a [hash-based method authentication code (HMAC)](https://en.wikipedia.org/wiki/HMAC) and includes it within the `Authorization` header of each HTTP request. For more information, see [Authenticate with an Access Key](#authenticate-with-an-access-key).
- **User Access Token** authentication for Chat and Calling. User access tokens let your client applications authenticate directly against Azure Communication Services. These tokens are generated on a server-side token provisioning service that you create. They're then provided to client devices that use the token to initialize the Chat and Calling client libraries. For more information, see [Authenticate with a User Access Token](#authenticate-with-a-user-access-token).

## Authenticate with an access key

Access key authentication uses a shared secret key to generate an HMAC for each HTTP request computed by using the SHA256 algorithm, and sends it in the `Authorization` header using the `HMAC-SHA256` scheme.

```
Authorization: "HMAC-SHA256 SignedHeaders=date;host;x-ms-content-sha256&Signature=<hmac-sha256-signature>"
```

The Azure Communication Services client libraries that use access key authentication should be initialized with your resource's connection string. If you're not using a client library, you can programmatically generate HMACs using your resource's access key. To learn more about connection strings, visit the [resource provisioning quickstart](../quickstarts/create-communication-resource.md).

### Sign an HTTP request

If you're not using a client library to make HTTP requests to the Azure Communication Services REST APIs, you'll need to programmatically create HMACs for each HTTP request. The following steps describe how to construct the Authorization header:

1. Specify the Coordinated Universal Time (UTC) timestamp for the request in either the `x-ms-date` header, or in the standard HTTP `Date` header. The service validates this to guard against certain security attacks, including replay attacks.
1. Hash the HTTP request body using the SHA256 algorithm then pass it, with the request, via the `x-ms-content-sha256` header.
1. Construct the string to be signed by concatenating the HTTP Verb (e.g. `GET` or `PUT`), HTTP request path, and values of the `Date`, `Host` and `x-ms-content-sha256` HTTP headers in the following format:
    ```
    VERB + "\n"
    URLPathAndQuery + "\n"
    DateHeaderValue + ";" + HostHeaderValue + ";" + ContentHashHeaderValue
    ```
1. Generate an HMAC-256 signature of the UTF-8 encoded string that you created in the previous step. Next, encode your results as Base64. Note that you also need to Base64-decode your storage account key. Use the following format (shown as pseudo code):
    ```
    Signature=Base64(HMAC-SHA256(UTF8(StringToSign), Base64.decode(<your_azure_storage_account_shared_key>)))
    ```
1. Specify the Authorization header as follows:
    ```
    Authorization="HMAC-SHA256 SignedHeaders=date;host;x-ms-content-sha256&Signature=<hmac-sha256-signature>"  
    ```
    Where `<hmac-sha256-signature>` is the HMAC computed in the previous step.

## Authenticate with a user access token

User access tokens let your client applications authenticate directly against Azure Communication Services. To achieve this you should set up a trusted service that authenticates your application users and issues user access tokens with the Administration client library. Visit the [client and server architecture](./client-and-server-architecture.md) conceptual documentation to learn more about our architectural considerations.

The `CommunicationClientCredential` class contains the logic for providing user access token credentials to the client libraries and managing their lifecycle.

### Initialize the client libraries

To initialize Azure Communication Services client libraries that require user access token authentication, you first create an instance of the `CommunicationClientCredential` class, and then use it to initialize an API client.

The following snippets show you how to initialize the chat client library with a user access token:

#### [C#](#tab/csharp)

```csharp
// user access tokens should be created by a trusted service using the Administration client library
var token = "<valid-user-access-token>";

// create a CommunicationUserCredential instance
var userCredential = new CommunicationUserCredential(token);

// initialize the chat client library with the credential
var chatClient = new ChatClient(ENDPOINT_URL, userCredential);
```

#### [JavaScript](#tab/javascript)

```javascript
// user access tokens should be created by a trusted service using the Administration client library
const token = "<valid-user-access-token>";

// create a CommunicationUserCredential instance with the AzureCommunicationUserCredential class
const userCredential = new AzureCommunicationUserCredential(token);

// initialize the chat client library with the credential
let chatClient = new ChatClient(ENDPOINT_URL, userCredential);
```

#### [Swift](#tab/swift)

```swift
// user access tokens should be created by a trusted service using the Administration client library
let token = "<valid-user-access-token>";

// create a CommunicationUserCredential instance
let userCredential = try CommunicationUserCredential(token: token)

// initialize the chat client library with the credential
let chatClient = try CommunicationChatClient(credential: userCredential, endpoint: ENDPOINT_URL)
```

#### [Java](#tab/java)

```java
// user access tokens should be created by a trusted service using the Administration client library
String token = "<valid-user-access-token>";

// create a CommunicationUserCredential instance
CommunicationUserCredential userCredential = new CommunicationUserCredential(token);

// Initialize the chat client
final ChatClientBuilder builder = new ChatClientBuilder();
builder.endpoint(ENDPOINT_URL)
    .credential(userCredential)
    .httpClient(HTTP_CLIENT);
ChatClient chatClient = builder.buildClient();
```

---

### Refreshing user access tokens

User access tokens are short-lived credentials that need to be reissued to prevent your users from experiencing service disruptions. The `CommunicationUserCredential` constructor accepts a refresh callback function that enables you to update user access tokens before they expire. You should use this callback to fetch a new user access token from your trusted service.

#### [C#](#tab/csharp)

```csharp
var userCredential = new CommunicationUserCredential(
    initialToken: token,
    refreshProactively: true,
    tokenRefresher: cancellationToken => fetchNewTokenForCurrentUser(cancellationToken)
);
```

#### [JavaScript](#tab/javascript)

```javascript
const userCredential = new AzureCommunicationUserCredential({
  tokenRefresher: async () => fetchNewTokenForCurrentUser(),
  refreshProactively: true,
  initialToken: token
});
```

#### [Swift](#tab/swift)

```swift
 let userCredential = try CommunicationUserCredential(initialToken: token, refreshProactively: true) { |completionHandler|
   let updatedToken = fetchTokenForCurrentUser()
   completionHandler(updatedToken, nil)
 }
```

#### [Java](#tab/java)

```java
TokenRefresher tokenRefresher = new TokenRefresher() {
    @Override
    Future<String> getFetchTokenFuture() {
        return fetchNewTokenForCurrentUser();
    }
}

CommunicationUserCredential credential = new CommunicationUserCredential(tokenRefresher, token, true);
```
---

The `refreshProactively` option lets you decide how you'll manage the token lifecycle. By default, when a token is stale, the callback will block API requests and attempt to refresh it. When `refreshProactively` is set to `true` the callback is scheduled and executed asynchronously before the token expires.

## Next steps

> [!div class="nextstepaction"]
> [Creating user access tokens](../quickstarts/access-tokens.md)

For more information, see the following articles:
- [Learn about client and server architecture](../concepts/client-and-server-architecture.md)
