---
title: Web app as MCP server in GitHub Copilot Chat agent mode (Java)
description: Empower GitHub Copilot Chat with your existing Java web apps by integrating their capabilities as Model Context Protocol servers, enabling Copilot Chat to perform real-world tasks.
author: cephalin
ms.author: cephalin
ms.date: 11/10/2025
ms.topic: tutorial
ms.custom:
  - devx-track-java
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
ms.service: azure-app-service
---

# Integrate an App Service app as an MCP Server for GitHub Copilot Chat (Spring Boot)

In this tutorial, you'll learn how to expose a Spring Boot web app's functionality through Model Context Protocol (MCP), add it as a tool to GitHub Copilot, and interact with your app using natural language in Copilot Chat agent mode.

:::image type="content" source="media/tutorial-ai-model-context-protocol-server-dotnet/model-context-protocol-call-intro.png" alt-text="Screenshot showing GitHub Copilot calling Todos MCP server hosted in Azure App Service.":::

If your web application already has useful features, like shopping, hotel booking, or data management, it's easy to make those capabilities available for:

- Any [application that supports MCP integration](https://modelcontextprotocol.io/clients), such as GitHub Copilot Chat agent mode in Visual Studio Code or in GitHub Codespaces. 
- A custom agent that accesses remote tools by using an [MCP client](https://modelcontextprotocol.io/quickstart/client#java).

By adding an MCP server to your web app, you enable an agent to understand and use your app's capabilities when it responds to user prompts. This means anything your app can do, the agent can do too.

> [!div class="checklist"]
> * Add an MCP server to your web app.
> * Test the MCP server locally in GitHub Copilot Chat agent mode.
> * Deploy the MCP server to Azure App Service and connect to it in GitHub Copilot Chat.

## Prerequisites

This tutorial assumes you're working with the sample used in [Tutorial: Build a Java Spring Boot web app with Azure App Service on Linux and Azure Cosmos DB](tutorial-java-spring-cosmosdb.md). 

At a minimum, open the [sample application](https://github.com/Azure-Samples/msdocs-spring-boot-mongodb-sample-app) in GitHub Codespaces and deploy the app by running `azd up`.

## Add MCP server to your web app

1. In the codespace, open *pom.xml*  and add the `spring-ai-starter-mcp-server-webmvc` package to your project:

    ```xml
    <dependency>
        <groupId>org.springframework.ai</groupId>
        <artifactId>spring-ai-starter-mcp-server-webmvc</artifactId>
        <version>1.0.0</version>
    </dependency>
    ```

1. Open *src/main/java/com/microsoft/azure/appservice/examples/springbootmongodb/TodoApplication.java*. For simplicity of the scenario, you'll add all of your MCP server code here.

1. At the end of *TodoApplication.java*, add the following class. 

    ```java
    @Service
    class TodoListToolService {
        private final TodoItemRepository todoItemRepository;
    
        public TodoListToolService(TodoItemRepository todoItemRepository) {
            this.todoItemRepository = todoItemRepository;
        }
    
        @Tool(description = "Get a todo item by its id")
        public Optional<TodoItem> getTodoItem(String id) {
            return todoItemRepository.findById(id);
        }
    
        @Tool(description = "Get all todo items")
        public List<TodoItem> getAllTodoItems() {
            return todoItemRepository.findAll();
        }
    
        @Tool(description = "Add a new todo item")
        public String addNewTodoItem(String description, String owner) {
            TodoItem item = new TodoItem(UUID.randomUUID().toString(), description, owner);
            todoItemRepository.save(item);
            return "Todo item created";
        }
    
        @Tool(description = "Update an existing todo item")
        public String updateTodoItem(String id, String description, String owner, boolean finished) {
            if (!todoItemRepository.existsById(id)) {
                return "Todo item not found";
            }
            TodoItem item = new TodoItem(id, description, owner);
            item.setFinish(finished);
            todoItemRepository.save(item);
            return "Todo item updated";
        }
    
        @Tool(description = "Delete a todo item by its id")
        public String deleteTodoItem(String id) {
            if (!todoItemRepository.existsById(id)) {
                return "Todo item not found";
            }
            todoItemRepository.deleteById(id);
            return "Todo item deleted";
        }
    }
    ```

    The code above makes tools available for [Spring AI](https://spring.io/projects/spring-ai) by using the following specific attributes:

    - `@Service`: Marks `TodoListToolService` as a Spring-managed service.
    - `@Tool`: Marks a method as a callable tool in Spring AI.
    - `description`: These provide human-readable descriptions for each tool. It helps the calling agent to understand how to use the tool.
    
    This code is duplicating the functionality of the existing *src/main/java/com/microsoft/azure/appservice/examples/springbootmongodb/controller/TodoListController.java*, which is unnecessary, but you'll keep it for simplicity. A best practice would be to move the app logic to a service class, then call the service methods both from `TodoListController` and from `TodoListToolService`.

1. In *TodoApplication.java*, add the following method to the `TodoApplication` class. 

    ```java
    @Bean
    public ToolCallbackProvider todoTools(TodoListToolService todoListToolService) {
        return MethodToolCallbackProvider.builder().toolObjects(todoListToolService).build();
    }
    ```

    This method provides the tools in `TodoListToolService` as callbacks for Spring AI. By default, the MCP Server autoconfiguration in the `spring-ai-starter-mcp-server-webmvc` package automatically wires up these tool callbacks. Also, by default, the MCP Server endpoint is `<base-url>/sse`.

1. At the top of *TodoApplication.java*, add the following imports.

    ```java
    import java.util.List;
    import java.util.Optional;
    import java.util.UUID;
    
    import org.springframework.ai.tool.ToolCallbackProvider;
    import org.springframework.ai.tool.annotation.Tool;
    import org.springframework.ai.tool.method.MethodToolCallbackProvider;
    import org.springframework.context.annotation.Bean;
    import org.springframework.stereotype.Service;
    
    import com.microsoft.azure.appservice.examples.springbootmongodb.dao.TodoItemRepository;
    import com.microsoft.azure.appservice.examples.springbootmongodb.model.TodoItem;
    ```

## Test the MCP server locally
    
1. In the codespace terminal, run the application with `mvn spring-boot:run`.

1. Select **Open in Browser**, then add a task. 

    Leave Spring Boot running. Your MCP server endpoint is running at `http://localhost:8080/sse` now.

1. Back in the codespace, open Copilot Chat, then select **Agent** mode in the prompt box.

1. Select the **Tools** button, then select **Add More Tools...** in the dropdown.

    :::image type="content" source="media/tutorial-ai-model-context-protocol-server-dotnet/add-model-context-protocol-tool.png" alt-text="Screenshot showing how to add an MCP server in GitHub Copilot Chat agent mode.":::

1. Select **Add MCP Server**.

1. Select **HTTP (HTTP or Server-Sent Events)**.

1. In **Enter Server URL**, type *http://localhost:8080/sse*.

1. In **Enter Server ID**, type *todos-mcp* or any name you like.

1. Select **Workspace Settings**.

1. In a new Copilot Chat window, type something like *"Show me the todos."*

1. By default, GitHub Copilot shows you a security confirmation when you invoke an MCP server. Select **Continue**.

    :::image type="content" source="media/tutorial-ai-model-context-protocol-server-dotnet/model-context-protocol-call-confirmation.png" alt-text="Screenshot showing the default security message from an MCP invocation in GitHub Copilot Chat.":::

    You should now see a response that indicates that the MCP tool call is successful.

    :::image type="content" source="media/tutorial-ai-model-context-protocol-server-dotnet/model-context-protocol-call-success.png" alt-text="Screenshot showing that the response from the MCP tool call in the GitHub Copilot Chat window.":::

## Deploy your MCP server to App Service

1. Back in the codespace terminal, deploy your changes by committing your changes (GitHub Actions method) or run `azd up` (Azure Developer CLI method).

1. In the AZD output, find the URL of your app. The URL looks like this in the AZD output:

    <pre>
    Deploying services (azd deploy)
    
      (✓) Done: Deploying service web
      - Endpoint: &lt;app-url>
    </pre>

1. Once `azd up` finishes, open *.vscode/mcp.json*. Change the URL to `<app-url>/sse`. 

1. Above your modified MCP server configuration, select **Start**.

    :::image type="content" source="media/tutorial-ai-model-context-protocol-server-dotnet/model-context-protocol-server-start.png" alt-text="Screenshot showing how to manually start an MCP server from the local mcp.json file.":::

1. Start a new GitHub Copilot Chat window. You should be able to view, create, update, and delete tasks in the Copilot agent.

## Security best practices

When your MCP server is called by an agent powered by large language models (LLM), be aware of [prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) attacks. Consider the following security best practices:

- **Authentication and Authorization**: Secure your MCP server with Microsoft Entra authentication to ensure only authorized users or agents can access your tools. See [Secure Model Context Protocol calls to Azure App Service from Visual Studio Code with Microsoft Entra authentication](configure-authentication-mcp-server-vscode.md) for a step-by-step guide.
- **Input Validation and Sanitization**: The example code in this tutorial omits input validation and sanitization for simplicity and clarity. In production scenarios, always implement proper validation and sanitization to protect your application. For Spring, see [Spring: Validating Form Input](https://spring.io/guides/gs/validating-form-input).
- **HTTPS:** The sample relies on Azure App Service, which enforces HTTPS by default and provides free TLS/SSL certificates to encrypt data in transit.
- **Least Privilege Principle**: Expose only the necessary tools and data required for your use case. Avoid exposing sensitive operations unless necessary.
- **Rate Limiting and Throttling**: Use [API Management](/azure/api-management/api-management-sample-flexible-throttling) or custom middleware to prevent abuse and denial-of-service attacks.
- **Logging and Monitoring**: Log access and usage of MCP endpoints for auditing and anomaly detection. Monitor for suspicious activity.
- **CORS Configuration**: Restrict cross-origin requests to trusted domains if your MCP server is accessed from browsers. For more information, see [Enable CORS](app-service-web-tutorial-rest-api.md#enable-cors).
- **Regular Updates**: Keep your dependencies up to date to mitigate known vulnerabilities.

## More resources

- [Integrate AI into your Azure App Service applications](overview-ai-integration.md)
- [Spring AI: MCP Server Boot Starter](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-server-boot-starter-docs.html)