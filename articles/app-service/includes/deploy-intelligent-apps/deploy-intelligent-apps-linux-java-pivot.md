---
author: jefmarti
ms.service: azure-app-service
ms.devlang: java
ms.custom: linux-related-content
ms.topic: article
ms.date: 04/10/2024
ms.author: jefmarti
---

You can use Azure App Service to create applications by using Azure OpenAI and OpenAI. In this article, you add Azure OpenAI Service to a Java 17 Spring Boot application by using the Azure SDK.

#### Prerequisites

- An [Azure OpenAI resource](/azure/ai-services/openai/quickstart?pivots=programming-language-csharp&tabs=command-line%2Cpython#set-up) or an [OpenAI account](https://platform.openai.com/overview).
- A Java Spring Boot application. Create the application by using the [quickstart](../../quickstart-java.md?tabs=springboot&pivots=java-maven-javase).

### Set up web app

For this Spring Boot application, you're building off the [quickstart](../../quickstart-java.md?tabs=springboot&pivots=java-javase) app and adding an extra feature to make a request to an Azure OpenAI or OpenAI service. Add the following code to your application:

```java
  @RequestMapping("/")
	String sayHello() {

	   String serverResponse = "";

	   return serverResponse;
  }
```

### API keys and endpoints

Get the keys and endpoint values from Azure OpenAI or OpenAI and add them as secrets to use in your application. Retrieve and save the values for later use to build the client.

For Azure OpenAI, see [this documentation](/azure/ai-services/openai/quickstart?pivots=programming-language-csharp&tabs=command-line%2Cpython#retrieve-key-and-endpoint) to retrieve the key and endpoint values. If you're planning to use a [managed identity](../../overview-managed-identity.md) to secure your app, you need only the `endpoint` value. Otherwise, you need each of the following values:

- `endpoint`
- `apiKey`
- `deploymentName`

For OpenAI, see [this documentation](https://platform.openai.com/docs/api-reference) to retrieve the API keys. For this application, you need the following values:

- `apiKey`
- `modelName`

Because you're deploying to App Service, you can put these secrets in Azure Key Vault for protection. Follow the [quickstart](/azure/key-vault/secrets/quick-create-cli#create-a-key-vault) to set up your key vault and add the secrets you saved from earlier.

Next, you can use key vault references as app settings in your App Service resource to reference in the application. Follow the instructions in the [documentation](../../app-service-key-vault-references.md?source=recommendations&tabs=azure-cli) to grant your app access to your key vault and to set up key vault references.

Then, go to the portal **Environment Variables** page in your resource and add the following app settings.

For Azure OpenAI, use the following settings:

| Setting name| Value |
|-|-|-|
| `DEPLOYMENT_NAME` | `@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)` |
| `ENDPOINT` | `@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)` |
| `API_KEY` | `@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)` |

For OpenAI, use the following settings:

| Setting name| Value |
|-|-|-|
| `OPENAI_API_KEY` | `@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)` |
| `OPENAI_MODEL_NAME` | `@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)` |

After your app settings are saved, you can access the app settings in your code by referencing them in your application. Add the following code in the `Application.java` file:

For Azure OpenAI:

```java
  @RequestMapping("/")
	String sayHello() {

      // Azure OpenAI
      Map<String, String> envVariables = System.getenv();
      String apiKey = envVariables.get("API_KEY");
      String endpoint = envVariables.get("ENDPOINT");
      String deploymentName = envVariables.get("DEPLOYMENT_NAME");
  }  
```

For OpenAI:

```java
  @RequestMapping("/")
	String sayHello() {

      // OpenAI
      Map<String, String> envVariables = System.getenv();
      String apiKey = envVariables.get("OPENAI_API_KEY");
      String modelName = envVariables.get("OPENAI_MODEL_NAME");
  }  
```

### Add the package

Before you can create the client, you first need to add the Azure SDK dependency. Add the following Azure OpenAI package to the `pom.xl` file. To build the package, run the `mvn package` command.

```java
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-ai-openai</artifactId>
    <version>1.0.0-beta.9</version>
</dependency>
```

After the package is created, you can start working on the client that makes your calls.

### Create OpenAI client

After the package and environment variables are set up, you can create the client that enables chat completion calls.

Add the following code to create the OpenAI client:

For Azure OpenAI:

```java
OpenAIClient client = new OpenAIClientBuilder()
    .credential(new AzureKeyCredential(apiKey))
    .endpoint(endpoint)
    .buildClient();
```

For OpenAI:

```java
OpenAIClient client = new OpenAIClientBuilder()
    .credential(new KeyCredential(apiKey))
    .buildClient();
```

The following imports are added to the `Application.java` file:

```java
import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.core.credential.AzureKeyCredential;
```

### Secure your app with a managed identity

Although optional, we highly recommend that you secure your application by using a [managed identity](../../overview-managed-identity.md) to authenticate your app to your Azure OpenAI resource. This process enables your application to access the Azure OpenAI resource without managing API keys. Skip this step if you're not using Azure OpenAI.

To secure your application, complete the following steps:

The Azure SDK package that you installed in the previous section enables the use of default credentials in your app. Include the default Azure credentials when you create the client.

```java
TokenCredential defaultCredential = new DefaultAzureCredentialBuilder().build();

OpenAIClient client = new OpenAIClientBuilder()
    .credential(defaultCredential)
    .endpoint(endpoint)
    .buildClient();
```

After the credentials are added to the application, enable a managed identity in your application and grant access to the resource:

1. In your web app resource, go to the **Identity** pane and turn on **System assigned**, and then select **Save**.
1. After system-assigned identity is turned on, it will register the web app with Microsoft Entra ID and the web app can be granted permissions to access protected resources.  
1. Go to your Azure OpenAI resource, and then go to **Access control (IAM)** on the left pane.
1. Find the **Grant access to this resource** card and select **Add role assignment**.
1. Search for the **Cognitive Services OpenAI User** role and select **Next**.
1. On the **Members** tab, find **Assign access to** and choose the **Managed identity** option.
1. Choose **+Select Members**  and find your web app.
1. Select **Review + assign**.

Your web app is now added as a cognitive service OpenAI user and can communicate to your Azure OpenAI resource.

### Set up a prompt and call to OpenAI

Use the chat completions method to send a request message to OpenAI and return a response. Add your chat message prompt to the code to be passed to the chat completions method. Use the following code to set up the chat completions method:

```java
List<ChatRequestMessage> chatMessages = new ArrayList<>();
        chatMessages.add(new ChatRequestUserMessage("What is Azure App Service in one line tldr?"));

// Azure OpenAI
ChatCompletions chatCompletions = client.getChatCompletions(deploymentName,
    new ChatCompletionsOptions(chatMessages));

// OpenAI
ChatCompletions chatCompletions = client.getChatCompletions(modelName,
    new ChatCompletionsOptions(chatMessages));
```

Here's the example in its completed form. In this example, use the Azure OpenAI chat completion service *or* the OpenAI chat completion service, not both.

```java

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.ai.openai.models.ChatChoice;
import com.azure.ai.openai.models.ChatCompletions;
import com.azure.ai.openai.models.ChatCompletionsOptions;
import com.azure.ai.openai.models.ChatRequestMessage;
import com.azure.ai.openai.models.ChatRequestUserMessage;
import com.azure.ai.openai.models.ChatResponseMessage;
import com.azure.core.credential.AzureKeyCredential;

@SpringBootApplication
@RestController
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

  @RequestMapping("/")
	String sayHello() {

        String serverResponse = "";

        // Azure OpenAI
        Map<String, String> envVariables = System.getenv();
        String apiKey = envVariables.get("API_KEY");
        String endpoint = envVariables.get("ENDPOINT");
        String deploymentName = envVariables.get("DEPLOYMENT_NAME");

        // OpenAI
        // Map<String, String> envVariables = System.getenv();
        // String apiKey = envVariables.get("OPENAI_API_KEY");
        // String modelName = envVariables.get("OPENAI_MODEL_NAME");

        // Azure OpenAI client
        OpenAIClient client = new OpenAIClientBuilder()
        .credential(new AzureKeyCredential(apiKey))
        .endpoint(endpoint)
        .buildClient();

        // OpenAI client
        // OpenAIClient client = new OpenAIClientBuilder()
        // .credential(new KeyCredential(apiKey))
        // .buildClient();

        // Chat Completion
        List<ChatRequestMessage> chatMessages = new ArrayList<>();
        chatMessages.add(new ChatRequestUserMessage("What's is Azure App Service in one line tldr?"));

        // Azure OpenAI
        ChatCompletions chatCompletions = client.getChatCompletions(deploymentName,
            new ChatCompletionsOptions(chatMessages));

        // OpenAI
        // ChatCompletions chatCompletions = client.getChatCompletions(modelName,
        //     new ChatCompletionsOptions(chatMessages));

        System.out.printf("Model ID=%s is created at %s.%n", chatCompletions.getId(), chatCompletions.getCreatedAt());
        for (ChatChoice choice : chatCompletions.getChoices()) {
            ChatResponseMessage message = choice.getMessage();
            System.out.printf("Index: %d, Chat Role: %s.%n", choice.getIndex(), message.getRole());
            System.out.println("Message:");
            System.out.println(message.getContent());

            serverResponse = message.getContent();
        }

		return serverResponse;
	}

}
```

### Deploy to App Service

You can now deploy to App Service as you normally would. If you run into any issues, make sure that you completed the following steps: granted your app access to your key vault and added the app settings with key vault references as your values. App Service resolves the app settings in your application that match what you added in the portal.

After the app is deployed, you can visit your site URL and see the text that contains the response from your chat message prompt.  

### Authentication

Although optional, we highly recommend that you also add authentication to your web app when using an Azure OpenAI or OpenAI service. Adding authentication can offer a level of security with no other code. Learn how to enable authentication for your web app [here](../../scenario-secure-app-authentication-app-service.md).

After deployment, browse to the web app and go to the OpenAI tab. Enter a query to the service and you should see a populated response from the server.
