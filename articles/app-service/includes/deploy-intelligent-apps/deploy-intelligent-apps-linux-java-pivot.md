---
author: jefmarti
ms.service: app-service
ms.devlang: java
ms.custom: linux-related-content
ms.topic: article
ms.date: 04/10/2024
ms.author: jefmarti
---

You can use Azure App Service to create applications using Azure OpenAI and OpenAI. In the following tutorial, we're adding an Azure OpenAI service to a Java 17 Spring Boot application using the Azure SDK.

#### Prerequisites

- An [Azure OpenAI resource](../../../ai-services/openai/quickstart.md?pivots=programming-language-csharp&tabs=command-line%2Cpython#set-up) or an [OpenAI account](https://platform.openai.com/overview).
- A Java spring boot application. Create the application using this [quickstart](../../quickstart-java.md?tabs=springboot&pivots=java-maven-javase).

### Set up web app

For this Spring Boot application, we're building off the [quickstart](../../quickstart-java.md?tabs=springboot&pivots=java-javase) app and adding an extra feature to make a request to an Azure OpenAI or OpenAI service. Add the following code to your application:

```bash
  @RequestMapping("/")
	String sayHello() {

	   String serverResponse = "";

	   return serverResponse;
  }
```

### API Keys and Endpoints

First, you need to grab the keys and endpoint values from Azure OpenAI, or OpenAI and add them as secrets for use in your application. Retrieve and save the values for later use to build the client.

For Azure OpenAI, see [this documentation](../../../ai-services/openai/quickstart.md?pivots=programming-language-csharp&tabs=command-line%2Cpython#retrieve-key-and-endpoint) to retrieve the key and endpoint values. If you're planning to use [managed identity](../../overview-managed-identity.md) to secure your app you'll only need the `endpoint` value. Otherwise, you need each of the following:

- `endpoint`
- `apiKey`
- `deploymentName`

For OpenAI, see this [documentation](https://platform.openai.com/docs/api-reference) to retrieve the API keys. For our application, you need the following values:

- `apiKey`
- `modelName`

Since we're deploying to App Service, we can secure these secrets in **Azure Key Vault** for protection. Follow the [Quickstart](/azure/key-vault/secrets/quick-create-cli#create-a-key-vault) to set up your Key Vault and add the secrets you saved from earlier.

Next, we can use Key Vault references as app settings in our App Service resource to reference in our application. Follow the instructions in the [documentation](../../app-service-key-vault-references.md?source=recommendations&tabs=azure-cli) to grant your app access to your Key Vault and to set up Key Vault references.

Then, go to the portal Environment Variables page in your resource and add the following app settings:

For Azure OpenAI, use the following settings:

| Setting name| Value |
|-|-|-|
| `DEPOYMENT_NAME` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |
| `ENDPOINT` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |
| `API_KEY` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |


For OpenAI, use the following settings:

| Setting name| Value |
|-|-|-|
| `OPENAI_API_KEY` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |
| `OPENAI_MODEL_NAME` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |

Once your app settings are saved, you can access the app settings in your code by referencing them in your application. Add the following code in the *Application.java `http://Application.java`* file:

For Azure OpenAI:

```java
  @RequestMapping("/")
	String sayHello() {

      // Azure OpenAI
      Map<String, String> envVariables = System.getenv();
      String apiKey = envVariables.get("API_KEY");
      String endpoint = envVariables.get("ENDPOINT");
      String depoymentName = envVariables.get("DEPLOYMENT_NAME");
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

Before you can create the client, you first need to add the Azure SDK dependency. Add the following Azure OpenAI package to the *pom.xl* file and run the **mvn package** command to build the package.

```java
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-ai-openai</artifactId>
    <version>1.0.0-beta.9</version>
</dependency>
```

Once the package is created, we can start working on the client that makes our calls.

### Create OpenAI client

Once the package and environment variables are set up, we can create the client that enables chat completion calls.

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

Once added, you see the following imports are added to the Application.java `http://Application.java` file:

```java
import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.core.credential.AzureKeyCredential;
```

### Secure your app with managed identity

Although optional, it's highly recommended to secure your application using [managed identity](../../overview-managed-identity.md) to authenticate your app to your Azure OpenAI resource. Skip this step if you are not using Azure OpenAI. This enables your application to access the Azure OpenAI resource without needing to manage API keys.

Follow the steps below to secure your application:

The Azure SDK package previously installed in the previous section enables the use of default credentials in your app. Include the default Azure default credentials when you create the client.

```java
TokenCredential defaultCredential = new DefaultAzureCredentialBuilder().build();

OpenAIClient client = new OpenAIClientBuilder()
    .credential(defaultCredential)
    .endpoint(endpoint)
    .buildClient();
```

Once the credentials are added to the application, enable managed identity in your application and grant access to the resource:

1. In your web app resource, navigate to the **Identity** blade and turn on **System assigned** and select **Save**.
2. Once System assigned identity is turned on, it will register the web app with Microsoft Entra ID and the web app can be granted permissions to access protected resources.  
3. Go to your Azure OpenAI resource and navigate to the **Access control (IAM)** page on the left pane.
4. Find the **Grant access to this resource** card and select **Add role assignment**.
5. Search for the **Cognitive Services OpenAI User** role and select **Next**.
6. On the **Members** tab, find **Assign access to** and choose the **Managed identity** option.
7. Next, select **+Select Members**  and find your web app.
8. Select **Review + assign**.

Your web app is now added as a cognitive service OpenAI user and can communicate to your Azure OpenAI resource.

### Set up prompt and call to OpenAI

Now that our OpenAI service is created we can use the chat completions method to send our request message to OpenAI and return a response. Here's where we add our chat message prompt to the code to be passed to the chat completions method. Use the following code to set up the chat completions method:

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

Here's the example in its completed from. In this example, use the Azure OpenAI chat completion service OR the OpenAI chat completion service, not both.

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

If you completed the steps above, you can deploy to App Service as you normally would. If you run into any issues, remember that you need to complete the following steps: grant your app access to your Key Vault, and add the app settings with key vault references as your values. App Service resolves the app settings in your application that match what you added in the portal.

Once the app is deployed, you can visit your site URL and see the text that contains the response from your chat message prompt.  


### Authentication

Although optional, it's highly recommended that you also add authentication to your web app when using an Azure OpenAI or OpenAI service. This can add a level of security with no other code. Learn how to enable authentication for your web app [here](../../scenario-secure-app-authentication-app-service.md).

Once deployed, browse to the web app and navigate to the OpenAI tab. Enter a query to the service and you should see a populated response from the server. The tutorial is now complete and you now know how to use OpenAI services to create intelligent applications.
