---
title: Authenticate to Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about the various ways an app or service can authenticate to Communication Services.
author: GrantMeStrength

manager: jken
services: azure-communication-services

ms.author: jken
ms.date: 07/24/2020
ms.topic: conceptual
ms.service: azure-communication-services
---

# Authenticate to Azure Communication Services

Every client interaction with Azure Communication Services needs to be authenticated. In a typical architecture, c.f. [client and server architecture](./client-and-server-architecture.md), *access keys* or *managed identity* is used in "trusted user access service" to create users and issue tokens. And *user access token* issued by "trusted user access service" is used for client applications to access other communication services, e.g. chat or calling service.

Azure Communication Services SMS service also accepts *access keys* or *managed identity* for authentication. This typically happens in a service application running in a trusted service environment.

Each authorization option is briefly described below:

- **Access Key** authentication for SMS and Identity operations. Access Key authentication is suitable for service applications running in a trusted service environment. Access key can be found in Azure Communication Services portal. To authenticate with an access key, a service application uses the access key as credential to initialize corresponding SMS or Identity client libraries.
- **Managed Identity** authentication for SMS and Identity operations. Managed Identity is suitable for service applications running in a trusted service environment. To authenticate with a managed identity, a service application creates a credential with id and secret of a managed identity then initialize corresponding SMS or Identity client libraries.
- **User Access Token** authentication for Chat and Calling. User access tokens let your client applications authenticate against Azure Communication Chat and Calling Services. These tokens are generated in a "trusted user access service" that you create. They're then provided to client devices that use the token to initialize the Chat and Calling client libraries. For more information, see [Authenticate with a User Access Token](#authenticate-with-a-user-access-token).

## Authenticate with an access key

Azure resource access key let your service applications authenticate against Azure Communication services that accept access key credential. 

The following snippets show you how to initialize the Identity client library with an access key:

### [C#](#tab/csharp)

```csharp
var endpoint = new Uri("https://my-resource.communication.azure.com");
var accessKey = "<access_key>";
var client = new CommunicationIdentityClient(endpoint, new AzureKeyCredential(accessKey));
```

### [Java](#tab/java)

```java
String endpoint = "https://<RESOURCE_NAME>.communication.azure.com";
String accessKey = "<access_key>";
HttpClient httpClient = new NettyAsyncHttpClientBuilder().build();
CommunicationIdentityClient communicationIdentityClient = new CommunicationIdentityClientBuilder()
    .endpoint(endpoint)
    .accessKey(accessKey)
    .httpClient(httpClient)
    .buildClient();
```

### [JavaScript](#tab/javascript)


### [Python](#tab/python)

## Authenticate with a user access token

User access tokens let your client applications authenticate against Azure Communication Chat or Calling Services. To achieve this you should set up a trusted service that authenticates your application users and issues user access tokens with the Identity client library. Visit the [client and server architecture](./client-and-server-architecture.md) conceptual documentation to learn more about our architectural considerations.

The `CommunicationTokenCredential` class contains the logic for providing user access token credentials to the client libraries and managing their lifecycle.

### Initialize the client libraries

To initialize Azure Communication Services client libraries that require user access token authentication, you first create an instance of the `CommunicationTokenCredential` class, and then use it to initialize an API client.

The following snippets show you how to initialize the chat client library with a user access token:

#### [C#](#tab/csharp)

```csharp
// user access tokens should be created by a trusted service using the Identity client library
var token = "<valid-user-access-token>";

// create a CommunicationTokenCredential instance
var userCredential = new CommunicationTokenCredential(token);

// initialize the chat client library with the credential
var chatClient = new ChatClient(ENDPOINT_URL, userCredential);
```

#### [Java](#tab/java)

```java
// user access tokens should be created by a trusted service using the Identity client library
String token = "<valid-user-access-token>";

// create a CommunicationTokenCredential instance
CommunicationTokenCredential userCredential = new CommunicationTokenCredential(token);

// Initialize the chat client
final ChatClientBuilder builder = new ChatClientBuilder();
builder.endpoint(ENDPOINT_URL)
    .credential(userCredential)
    .httpClient(HTTP_CLIENT);
ChatClient chatClient = builder.buildClient();
```

#### [JavaScript](#tab/javascript)

```javascript
// user access tokens should be created by a trusted service using the Identity client library
const token = "<valid-user-access-token>";

// create a CommunicationTokenCredential instance with the AzureCommunicationTokenCredential class
const userCredential = new AzureCommunicationTokenCredential(token);

// initialize the chat client library with the credential
let chatClient = new ChatClient(ENDPOINT_URL, userCredential);
```

#### [Swift](#tab/swift)

```swift
// user access tokens should be created by a trusted service using the Identity client library
let token = "<valid-user-access-token>";

// create a CommunicationTokenCredential instance
let userCredential = try CommunicationTokenCredential(token: token)

// initialize the chat client library with the credential
let chatClient = try CommunicationChatClient(credential: userCredential, endpoint: ENDPOINT_URL)
```

---

### Refreshing user access tokens

User access tokens are short-lived credentials that need to be reissued to prevent your users from experiencing service disruptions. The `CommunicationTokenCredential` constructor accepts a refresh callback function that enables you to update user access tokens before they expire. You should use this callback to fetch a new user access token from your trusted service.

#### [C#](#tab/csharp)

```csharp
var userCredential = new CommunicationTokenCredential(
    initialToken: token,
    refreshProactively: true,
    tokenRefresher: cancellationToken => fetchNewTokenForCurrentUser(cancellationToken)
);
```

#### [JavaScript](#tab/javascript)

```javascript
const userCredential = new AzureCommunicationTokenCredential({
  tokenRefresher: async () => fetchNewTokenForCurrentUser(),
  refreshProactively: true,
  initialToken: token
});
```

#### [Swift](#tab/swift)

```swift
 let userCredential = try CommunicationTokenCredential(initialToken: token, refreshProactively: true) { |completionHandler|
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

CommunicationTokenCredential credential = new CommunicationTokenCredential(tokenRefresher, token, true);
```
---

The `refreshProactively` option lets you decide how you'll manage the token lifecycle. By default, when a token is stale, the callback will block API requests and attempt to refresh it. When `refreshProactively` is set to `true` the callback is scheduled and executed asynchronously before the token expires.

## Authenticate with a managed identity

Azure managed identity let your service applications authenticate against Azure Communication services that accept managed identity credential.

The following snippets show you how to initialize the Identity client library with a managed identity:

### [C#](#tab/csharp)
```csharp
String endpoint = "https://<RESOURCE_NAME>.communication.azure.com";
TokenCredential credential = new DefaultAzureCredential();
var client = new CommunicationIdentityClient(endpoint, credential);
```

### [Java](#tab/java)
```java
String endpoint = "https://<RESOURCE_NAME>.communication.azure.com";
HttpClient httpClient = new NettyAsyncHttpClientBuilder().build();
CommunicationIdentityClient communicationIdentityClient = new CommunicationIdentityClientBuilder()
    .endpoint(endpoint)
    .credential(new DefaultAzureCredentialBuilder().build())
    .httpClient(httpClient)
    .buildClient();
```

### [JavaScript](#tab/javascript)

### [Python](#tab/python)

## Next steps

> [!div class="nextstepaction"]
> [Creating user access tokens](../quickstarts/access-tokens.md)

For more information, see the following articles:
- [Learn about client and server architecture](../concepts/client-and-server-architecture.md)
