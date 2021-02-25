## Add managed identity to your Communication Services solution (Java)

### Install the client library packages
In the pom.xml file, add the following dependency elements to the group of dependencies.

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-identity</artifactId>
    <version>1.0.0</version>
</dependency>
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-sms</artifactId>
    <version>1.0.0</version>
</dependency>
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
    <version>1.2.3</version>
</dependency>
```

### Use the client library packages

Add the following `import` directives to your code to use the Azure Identity and Azure Communication client libraries.

```java
import com.azure.identity.*;
import com.azure.communication.sms.*;
import com.azure.communication.identity.*;
import com.azure.communication.common.*;
```

The examples below are using the [DefaultAzureCredential](/java/api/azure.identity.defaultazurecredential). This credential is suitable for production and development environments.

`AZURE_CLIENT_SECRET`, `AZURE_CLIENT_ID` and `AZURE_TENANT_ID` environment variables are needed to create a `DefaultAzureCredential` object. To create a registered application in the development environment and set up environment variables, see [Authorize access with managed identity](../managed-identity-from-cli.md).

### Create an identity and issue a token

The following code example shows how to create a service client object with Azure Active Directory tokens.
Then, use the client to issue a token for a new user:

```java
     public AccessToken createIdentityAndGetTokenAsync() {
          // You can find your endpoint and access key from your resource in the Azure Portal
          String endpoint = "https://<RESOURCE_NAME>.communication.azure.com";

          HttpClient httpClient = new NettyAsyncHttpClientBuilder().build();
          TokenCredential credential = new DefaultAzureCredentialBuilder().build();

          CommunicationIdentityClient communicationIdentityClient = new CommunicationIdentityClientBuilder()
               .endpoint(endpoint)
               .credential(credential)
               .httpClient(httpClient)
               .buildClient();

          CommunicationUserIdentifier user = communicationIdentityClient.createUser();
          AccessToken userToken = communicationIdentityClient.getToken(user, new ArrayList<>(Arrays.asList(CommunicationTokenScope.CHAT)));
          return userToken;
     }
```

### Send an SMS with Azure Active Directory tokens

The following code example shows how to create a service client object with Azure Active Directory tokens, then use the client to send an SMS message:

```java
     public SendSmsResponse sendSms() {
          // You can find your endpoint and access key from your resource in the Azure Portal
          String endpoint = "https://<RESOURCE_NAME>.communication.azure.com";

          HttpClient httpClient = new NettyAsyncHttpClientBuilder().build();
          TokenCredential credential = new DefaultAzureCredentialBuilder().build();

          SmsClient smsClient = new SmsClientBuilder()
               .endpoint(endpoint)
               .credential(credential)
               .httpClient(httpClient)
               .buildClient();

          // Send the message and check the response for a message id
          SendSmsResponse response = smsClient.sendMessage(
               new PhoneNumberIdentifier("<leased-phone-number>"),
               to,
               "your message",
               options /* Optional */
          );
          return response;
    }
```

## Next steps

> [!div class="nextstepaction"]
> [Learn about authentication](../concepts/authentication.md)

You may also want to:

- [Learn more about Azure role-based access control](../../../../articles/role-based-access-control/index.yml)
- [Learn more about Azure identity library for Java](/java/api/overview/azure/identity-readme)
- [Creating user access tokens](../../quickstarts/access-tokens.md)
- [Send an SMS message](../../quickstarts/telephony-sms/send.md)
- [Learn more about SMS](../../concepts/telephony-sms/concepts.md)
