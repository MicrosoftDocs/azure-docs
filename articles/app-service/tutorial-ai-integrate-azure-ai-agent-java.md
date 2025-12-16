---
title: Integrate web app with OpenAPI in Foundry Agent Service (Java)
description: Empower your existing Java web apps by integrating their capabilities into Foundry Agent Service with OpenAPI, enabling AI agents to perform real-world tasks.
author: cephalin
ms.author: cephalin
ms.date: 12/05/2025
ms.topic: tutorial
ms.custom:
  - devx-track-java
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
ms.service: azure-app-service
---

# Add an App Service app as a tool in Foundry Agent Service (Spring Boot)

In this tutorial, you'll learn how to expose a Spring Boot web app's functionality through OpenAPI, add it as a tool to Foundry Agent Service, and interact with your app using natural language in the agents playground. 

If your web application already has useful features, like shopping, hotel booking, or data management, it's easy to make those capabilities available to an AI agent in Foundry Agent Service. By simply adding an OpenAPI schema to your app, you enable the agent to understand and use your app's capabilities when it responds to users' prompts. This means anything your app can do, your AI agent can do too, with minimal effort beyond creating an OpenAPI endpoint for your app. In this tutorial, you start with a simple to-do list app. By the end, you'll be able to create, update, and manage tasks with an agent through conversational AI.

:::image type="content" source="media/tutorial-ai-integrate-azure-ai-agent-dotnet/agents-playground.png" alt-text="Screenshot showing the agents playground in the middle of a conversation that takes actions by using the OpenAPI tool.":::

> [!div class="checklist"]
> * Add OpenAPI functionality to your web app.
> * Make sure OpenAPI schema compatible with Foundry Agent Service.
> * Register your app as an OpenAPI tool in Foundry Agent Service.
> * Test your agent in the agents playground.

## Prerequisites

This tutorial assumes you're working with the sample used in [Tutorial: Build a Java Spring Boot web app with Azure App Service on Linux and Azure Cosmos DB](tutorial-java-spring-cosmosdb.md). 

At a minimum, open the [sample application](https://github.com/Azure-Samples/msdocs-spring-boot-mongodb-sample-app) in GitHub Codespaces and deploy the app by running `azd up`.

## Add OpenAPI functionality to your web app

> [!TIP]
> You can make all the following changes by telling GitHub Copilot in Agent mode:
>
> `I'd like to generate OpenAPI functionality using Spring Boot OpenAPI. Please also generate the server URL and operation ID in the schema.`

1. In the codespace, open *pom.xml* and add the following dependency:

    ```xml
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.6.0</version>
    </dependency>
    ```
    
1. Open *src/main/java/com/microsoft/azure/appservice/examples/springbootmongodb/controller/TodoListController.java* and add the following imports.

    ```java
    import io.swagger.v3.oas.annotations.Operation;
    import io.swagger.v3.oas.annotations.tags.Tag;
    ```

    The `TodoListController` class implements `@RestController`, so you only need to add a few annotations to make it compatible with OpenAPI. Additionally, to make the APIs compatible with the Foundry Agent Service, you must specify the `operationId` property in the `@Operation` annotation (see [How to use Foundry Agent Service with OpenAPI Specified Tools: Prerequisites](/azure/ai-services/agents/how-to/tools/openapi-spec#prerequisites)).

1. Find the class declaration and add the `@Tag` annotation as shown in the following snippet:

    ```java
    @RestController
    @Tag(name = "Todo List", description = "Todo List management APIs")
    public class TodoListController {
    ```
    
1. Find the `getTodoItem` method declaration and add the `@Operation` annotation with `description` and `operationId`, as shown in the following snippet:

    ```java
    @Operation(description = "Returns a single todo item", operationId = "getTodoItem")
    @GetMapping(path = "/api/todolist/{index}", produces = {MediaType.APPLICATION_JSON_VALUE})
    public TodoItem getTodoItem(@PathVariable("index") String index) {
    ```
    
1. Find the `getAllTodoItems` method declaration and add the `@Operation` annotation with `description` and `operationId`, as shown in the following snippet:

    ```java
    @Operation(description = "Returns a list of all todo items", operationId = "getAllTodoItems")
    @GetMapping(path = "/api/todolist", produces = {MediaType.APPLICATION_JSON_VALUE})
    public List<TodoItem> getAllTodoItems() {
    ```
    
1. Find the `addNewTodoItem` method declaration and add the `@Operation` annotation with `description` and `operationId`, as shown in the following snippet:

    ```java
    @Operation(description = "Creates a new todo item", operationId = "addNewTodoItem")
    @PostMapping(path = "/api/todolist", consumes = MediaType.APPLICATION_JSON_VALUE)
    public String addNewTodoItem(@RequestBody TodoItem item) {
    ```
    
1. Find the `updateTodoItem` method declaration and add the `@Operation` annotation with `description` and `operationId`, as shown in the following snippet:

    ```java
    @Operation(description = "Updates an existing todo item", operationId = "updateTodoItem")
    @PutMapping(path = "/api/todolist", consumes = MediaType.APPLICATION_JSON_VALUE)
    public String updateTodoItem(@RequestBody TodoItem item) {
    ```
    
1. Find the `deleteTodoItem` method declaration and add the `@Operation` annotation with `description` and `operationId`, as shown in the following snippet:

    ```java
    @Operation(description = "Deletes a todo item by ID", operationId = "deleteTodoItem")
    @DeleteMapping("/api/todolist/{id}")
    public String deleteTodoItem(@PathVariable("id") String id) {
    ```
    
    This minimal configuration gives you the following settings, as documented in [springdoc-openapi](https://springdoc.org/):

    - Swagger UI at `/swagger-ui.html`.
    - OpenAPI specification at `/v3/api-docs`.
    
1. In the codespace terminal, run the application with `mvn spring-boot:run`.

1. Select **Open in Browser**.

1. Navigate to the Swagger UI by adding `/swagger-ui.html` to the URL.

1. Confirm that the API operations work by trying them out in the Swagger UI.

1. Back in the codespace terminal, deploy your changes by committing your changes (GitHub Actions method) or run `azd up` (Azure Developer CLI method).

1. Once your changes are deployed, navigate to `https://<your-app's-url>/v3/api-docs` and copy the schema for later.

## Create an agent in Microsoft Foundry

[!INCLUDE [create-agent](includes/tutorial-ai-integrate-azure-ai-agent-dotnet/create-agent.md)]

## Test the agent

[!INCLUDE [test-agent](includes/tutorial-ai-integrate-azure-ai-agent-dotnet/test-agent.md)]

## Security best practices

When exposing APIs via OpenAPI in Azure App Service, follow these security best practices:

- **Authentication and Authorization**: Protect your OpenAPI endpoints with Microsoft Entra authentication. For step-by-step instructions, see [Secure OpenAPI endpoints for Foundry Agent Service](configure-authentication-ai-foundry-openapi-tool.md). You can also protect your endpoints behind [Azure API Management with Microsoft Entra ID](/azure/api-management/api-management-howto-protect-backend-with-aad) and ensure only authorized users or agents can access the tools.
- **Validate and sanitize input data:** The example code in this tutorial omits input validation and sanitization for simplicity and clarity. In production scenarios, always implement proper validation and sanitization to protect your application. For Spring, see [Spring: Validating Form Input](https://spring.io/guides/gs/validating-form-input).
- **Use HTTPS:** The sample relies on Azure App Service, which enforces HTTPS by default and provides free TLS/SSL certificates to encrypt data in transit.
- **Limit CORS:** Restrict Cross-Origin Resource Sharing (CORS) to trusted domains only. For more information, see [Enable CORS](app-service-web-tutorial-rest-api.md#enable-cors).
- **Apply rate limiting:** Use [API Management](/azure/api-management/api-management-sample-flexible-throttling) or custom middleware to prevent abuse and denial-of-service attacks.
- **Hide sensitive endpoints:** Avoid exposing internal or admin APIs in your OpenAPI schema.
- **Review OpenAPI schema:** Ensure your OpenAPI schema doesn't leak sensitive information (such as internal URLs, secrets, or implementation details).
- **Keep dependencies updated:** Regularly update NuGet packages and monitor for security advisories.
- **Monitor and log activity:** Enable logging and monitor access to detect suspicious activity.
- **Use managed identities:** When calling other Azure services, use managed identities instead of hardcoded credentials.

For more information, see [Secure your App Service app](overview-security.md) and [Best practices for REST API security](/azure/architecture/best-practices/api-design#security).

## Next step

You've now enabled your App Service app to be used as a tool by Foundry Agent Service and interact with your app's APIs through natural language in the agents playground. From here, you can continue add features to your agent in the Foundry portal, integrate it into your own applications using the Microsoft Foundry SDK or REST API, or deploy it as part of a larger solution. Agents created in Microsoft Foundry can be run in the cloud, integrated into chatbots, or embedded in web and mobile apps.

> [!NOTE]
> Foundry Agent Service doesn't have a Java SDK currently. To see how you can use the agent you created, see [Tutorial: Build an agentic web app in Azure App Service with Microsoft Semantic Kernel or Foundry Agent Service (.NET)](tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet.md).

## More resources

- [Integrate AI into your Azure App Service applications](overview-ai-integration.md)
- [What is Foundry Agent Service?](/azure/ai-services/agents/overview)