---
title: 'Tutorial: Deploy a Java MCP server to Azure Container Apps'
description: Learn how to build and deploy a Java MCP server to Azure Container Apps and connect to it from GitHub Copilot Chat in Visual Studio Code.
#customer intent: As a developer, I want to deploy a Java MCP server as a container app so that I can expose custom tools and connect to them from GitHub Copilot.
ms.topic: tutorial
ms.service: azure-container-apps
ms.collection: ce-skilling-ai-copilot
ms.date: 02/19/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
---

# Tutorial: Deploy a Java MCP server to Azure Container Apps

In this tutorial, you build a Model Context Protocol (MCP) server that exposes task-management tools by using Spring Boot and the [MCP Java SDK](https://github.com/modelcontextprotocol/java-sdk). You deploy the server to Azure Container Apps and connect to it from GitHub Copilot Chat in VS Code.

In this tutorial, you:

> [!div class="checklist"]
> - Create a Spring Boot app that exposes MCP tools
> - Test the MCP server locally with GitHub Copilot
> - Containerize and deploy the app to Azure Container Apps
> - Connect GitHub Copilot to the deployed MCP server

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- [Azure CLI](/cli/azure/install-azure-cli) version 2.62.0 or later.
- [Java 17](/java/openjdk/download) or later.
- [Maven 3.8](https://maven.apache.org/download.cgi) or later.
- [Visual Studio Code](https://code.visualstudio.com/) with the [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension.
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (optional - only needed to test the container locally).

## Create the app scaffold

In this section, you create a new Spring Boot project with the MCP Java SDK.

1. Create the project directory:

    ```bash
    mkdir tasks-mcp-server && cd tasks-mcp-server
    ```

1. Create `pom.xml`:

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <project xmlns="http://maven.apache.org/POM/4.0.0"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
        <modelVersion>4.0.0</modelVersion>

        <parent>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-parent</artifactId>
            <version>3.3.0</version>
        </parent>

        <groupId>com.example</groupId>
        <artifactId>tasks-mcp-server</artifactId>
        <version>1.0.0</version>
        <name>tasks-mcp-server</name>
        <description>MCP server for task management on Azure Container Apps</description>

        <properties>
            <java.version>17</java.version>
        </properties>

        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-web</artifactId>
            </dependency>
            <dependency>
                <groupId>io.modelcontextprotocol.sdk</groupId>
                <artifactId>mcp-spring-webmvc</artifactId>
                <version>0.10.0</version>
            </dependency>
        </dependencies>

        <build>
            <plugins>
                <plugin>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-maven-plugin</artifactId>
                </plugin>
            </plugins>
        </build>
    </project>
    ```

    The `pom.xml` defines a Spring Boot application with two key dependencies: `spring-boot-starter-web` for the web framework and `mcp-spring-webmvc` for the MCP SDK. The Spring Boot Maven plugin packages the app as an executable JAR.

    > [!NOTE]
    > The MCP Java SDK is under active development. Check the [MCP Java SDK releases](https://github.com/modelcontextprotocol/java-sdk/releases) for the latest version and update the `<version>` accordingly.

1. Create the directory structure:

    ```bash
    mkdir -p src/main/java/com/example/tasksmcp
    mkdir -p src/main/resources
    ```

1. Create `src/main/resources/application.properties`:

    ```properties
    server.port=8080
    ```

## Define the data model and store

In this section, you define the task data model and an in-memory store.

1. Create `src/main/java/com/example/tasksmcp/TaskItem.java`:

    ```java
    package com.example.tasksmcp;

    import java.time.Instant;

    public class TaskItem {
        private int id;
        private String title;
        private String description;
        private boolean isComplete;
        private Instant createdAt;

        public TaskItem(int id, String title, String description, boolean isComplete) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.isComplete = isComplete;
            this.createdAt = Instant.now();
        }

        // Getters and setters
        public int getId() { return id; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public boolean isComplete() { return isComplete; }
        public void setComplete(boolean complete) { isComplete = complete; }
        public Instant getCreatedAt() { return createdAt; }
    }
    ```

    The `TaskItem` class defines the data model with standard getters and a setter for the completion status. The constructor initializes the `createdAt` timestamp automatically.

1. Create `src/main/java/com/example/tasksmcp/TaskStore.java`:

    ```java
    package com.example.tasksmcp;

    import org.springframework.stereotype.Component;

    import java.util.ArrayList;
    import java.util.List;
    import java.util.Optional;
    import java.util.concurrent.atomic.AtomicInteger;

    @Component
    public class TaskStore {

        private final List<TaskItem> tasks = new ArrayList<>();
        private final AtomicInteger nextId = new AtomicInteger(3);

        public TaskStore() {
            tasks.add(new TaskItem(1, "Buy groceries", "Milk, eggs, bread", false));
            tasks.add(new TaskItem(2, "Write docs", "Draft the MCP tutorial", true));
        }

        public List<TaskItem> getAll() {
            return List.copyOf(tasks);
        }

        public Optional<TaskItem> getById(int id) {
            return tasks.stream().filter(t -> t.getId() == id).findFirst();
        }

        public TaskItem create(String title, String description) {
            TaskItem task = new TaskItem(nextId.getAndIncrement(), title, description, false);
            tasks.add(task);
            return task;
        }

        public Optional<TaskItem> toggleComplete(int id) {
            return getById(id).map(task -> {
                task.setComplete(!task.isComplete());
                return task;
            });
        }

        public boolean delete(int id) {
            return tasks.removeIf(t -> t.getId() == id);
        }
    }
    ```

    The `TaskStore` Spring component manages an in-memory list prepopulated with sample data. It uses `AtomicInteger` for thread-safe ID generation and provides methods for standard CRUD operations.

## Define the MCP tools

In this section, you define the MCP tools that the AI model can invoke and configure the MCP server in your Spring Boot application.

1. Create `src/main/java/com/example/tasksmcp/TasksMcpTools.java`:

    ```java
    package com.example.tasksmcp;

    import io.modelcontextprotocol.server.McpServerFeatures.SyncToolSpecification;
    import io.modelcontextprotocol.spec.McpSchema.CallToolResult;
    import io.modelcontextprotocol.spec.McpSchema.TextContent;
    import io.modelcontextprotocol.spec.McpSchema.Tool;
    import com.fasterxml.jackson.databind.ObjectMapper;
    import com.fasterxml.jackson.databind.node.ObjectNode;
    import org.springframework.stereotype.Component;

    import java.util.List;
    import java.util.Map;

    @Component
    public class TasksMcpTools {

        private final TaskStore store;
        private final ObjectMapper objectMapper = new ObjectMapper();

        public TasksMcpTools(TaskStore store) {
            this.store = store;
        }

        public List<SyncToolSpecification> getToolSpecifications() {
            return List.of(
                listTasksTool(),
                getTaskTool(),
                createTaskTool(),
                toggleTaskCompleteTool(),
                deleteTaskTool()
            );
        }

        private SyncToolSpecification listTasksTool() {
            var tool = new Tool(
                "list_tasks",
                "List all tasks with their ID, title, description, and completion status.",
                emptySchema()
            );
            return new SyncToolSpecification(tool, (exchange, request) -> {
                try {
                    String json = objectMapper.writeValueAsString(store.getAll());
                    return new CallToolResult(List.of(new TextContent(json)), false);
                } catch (Exception e) {
                    return errorResult(e.getMessage());
                }
            });
        }

        private SyncToolSpecification getTaskTool() {
            var tool = new Tool(
                "get_task",
                "Get a single task by its numeric ID.",
                objectSchema(Map.of(
                    "task_id", propertySchema("integer", "The numeric ID of the task to retrieve")
                ), List.of("task_id"))
            );
            return new SyncToolSpecification(tool, (exchange, request) -> {
                int taskId = ((Number) request.arguments().get("task_id")).intValue();
                return store.getById(taskId)
                    .map(task -> {
                        try {
                            return new CallToolResult(
                                List.of(new TextContent(objectMapper.writeValueAsString(task))), false);
                        } catch (Exception e) {
                            return errorResult(e.getMessage());
                        }
                    })
                    .orElse(textResult("Task with ID " + taskId + " not found."));
            });
        }

        private SyncToolSpecification createTaskTool() {
            var tool = new Tool(
                "create_task",
                "Create a new task with the given title and description. Returns the created task.",
                objectSchema(Map.of(
                    "title", propertySchema("string", "A short title for the task"),
                    "description", propertySchema("string", "A detailed description of what the task involves")
                ), List.of("title", "description"))
            );
            return new SyncToolSpecification(tool, (exchange, request) -> {
                String title = (String) request.arguments().get("title");
                String description = (String) request.arguments().get("description");
                TaskItem task = store.create(title, description);
                try {
                    return new CallToolResult(
                        List.of(new TextContent(objectMapper.writeValueAsString(task))), false);
                } catch (Exception e) {
                    return errorResult(e.getMessage());
                }
            });
        }

        private SyncToolSpecification toggleTaskCompleteTool() {
            var tool = new Tool(
                "toggle_task_complete",
                "Toggle a task's completion status between complete and incomplete.",
                objectSchema(Map.of(
                    "task_id", propertySchema("integer", "The numeric ID of the task to toggle")
                ), List.of("task_id"))
            );
            return new SyncToolSpecification(tool, (exchange, request) -> {
                int taskId = ((Number) request.arguments().get("task_id")).intValue();
                return store.toggleComplete(taskId)
                    .map(task -> textResult(
                        "Task " + task.getId() + " is now " + (task.isComplete() ? "complete" : "incomplete") + "."))
                    .orElse(textResult("Task with ID " + taskId + " not found."));
            });
        }

        private SyncToolSpecification deleteTaskTool() {
            var tool = new Tool(
                "delete_task",
                "Delete a task by its numeric ID.",
                objectSchema(Map.of(
                    "task_id", propertySchema("integer", "The numeric ID of the task to delete")
                ), List.of("task_id"))
            );
            return new SyncToolSpecification(tool, (exchange, request) -> {
                int taskId = ((Number) request.arguments().get("task_id")).intValue();
                boolean deleted = store.delete(taskId);
                return textResult(deleted
                    ? "Task " + taskId + " deleted."
                    : "Task with ID " + taskId + " not found.");
            });
        }

        // Helper methods for JSON Schema construction
        private String emptySchema() {
            return "{\"type\":\"object\",\"properties\":{}}";
        }

        private String objectSchema(Map<String, String> properties, List<String> required) {
            ObjectNode schema = objectMapper.createObjectNode();
            schema.put("type", "object");

            ObjectNode propsNode = objectMapper.createObjectNode();
            for (var entry : properties.entrySet()) {
                try {
                    propsNode.set(entry.getKey(), objectMapper.readTree(entry.getValue()));
                } catch (Exception e) {
                    propsNode.putObject(entry.getKey()).put("type", "string");
                }
            }
            schema.set("properties", propsNode);
            schema.set("required", objectMapper.valueToTree(required));

            return schema.toString();
        }

        private String propertySchema(String type, String description) {
            return "{\"type\":\"" + type + "\",\"description\":\"" + description + "\"}";
        }

        private CallToolResult textResult(String text) {
            return new CallToolResult(List.of(new TextContent(text)), false);
        }

        private CallToolResult errorResult(String message) {
            return new CallToolResult(List.of(new TextContent("Error: " + message)), true);
        }
    }
    ```

    > [!NOTE]
    > The MCP Java SDK API surface is evolving. The tool registration pattern shown here uses `SyncToolSpecification` for synchronous tools. Check the [MCP Java SDK documentation](https://github.com/modelcontextprotocol/java-sdk) for the latest idioms and annotations that can simplify tool registration.

1. Create `src/main/java/com/example/tasksmcp/McpConfig.java`:

    ```java
    package com.example.tasksmcp;

    import io.modelcontextprotocol.server.McpServer;
    import io.modelcontextprotocol.server.McpSyncServer;
    import io.modelcontextprotocol.server.transport.WebMvcSseServerTransportProvider;
    import io.modelcontextprotocol.spec.McpSchema.ServerCapabilities;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.web.servlet.config.annotation.CorsRegistry;
    import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

    @Configuration
    public class McpConfig implements WebMvcConfigurer {

        @Override
        public void addCorsMappings(CorsRegistry registry) {
            // For production, restrict allowedOrigins to specific trusted domains
            registry.addMapping("/**")
                    .allowedOrigins("*")
                    .allowedMethods("GET", "POST", "DELETE", "OPTIONS")
                    .allowedHeaders("*");
        }

        @Bean
        public WebMvcSseServerTransportProvider mcpTransportProvider() {
            return new WebMvcSseServerTransportProvider(new com.fasterxml.jackson.databind.ObjectMapper(), "/mcp");
        }

        @Bean
        public McpSyncServer mcpServer(WebMvcSseServerTransportProvider transport, TasksMcpTools tools) {
            McpSyncServer server = McpServer.sync(transport)
                .serverInfo("TasksMCP", "1.0.0")
                .capabilities(ServerCapabilities.builder().tools(true).build())
                .build();

            tools.getToolSpecifications().forEach(server::addTool);

            return server;
        }
    }
    ```

    Key points:
    - `WebMvcSseServerTransportProvider` registers the SSE transport at the `/mcp` path.
    - `McpServer.sync(transport)` configures tool capabilities and registers each tool specification.
    - CORS is enabled because GitHub Copilot in VS Code makes cross-origin requests to MCP servers.

    > [!NOTE]
    > This tutorial uses `WebMvcSseServerTransportProvider` (SSE transport) because the MCP Java SDK doesn't yet offer a stable streamable HTTP transport. The other language tutorials (.NET, Python, Node.js) use streamable HTTP. When the Java SDK adds streamable HTTP support, update the transport provider accordingly. The SSE transport is fully compatible with VS Code Copilot and other MCP clients.

1. Create `src/main/java/com/example/tasksmcp/TasksMcpApplication.java`:

    ```java
    package com.example.tasksmcp;

    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RestController;

    @SpringBootApplication
    @RestController
    public class TasksMcpApplication {

        public static void main(String[] args) {
            SpringApplication.run(TasksMcpApplication.class, args);
        }

        @GetMapping("/health")
        public String health() {
            return "healthy";
        }
    }
    ```

    The main class bootstraps the Spring Boot application and exposes a `/health` endpoint for Container Apps health probes. MCP endpoints return JSON-RPC responses, so a separate health endpoint is needed for health checks.

## Test the MCP server locally

Before deploying to Azure, verify the MCP server works by running it locally and connecting from GitHub Copilot.

1. Build and run:

    ```bash
    mvn spring-boot:run
    ```

1. Open VS Code, then open **Copilot Chat** and select **Agent** mode.

1. Select the **Tools** button, then **Add More Tools...** > **Add MCP Server**.

1. Select **HTTP (HTTP or Server-Sent Events)** and choose **Server-Sent Events (SSE)** when prompted for the transport type.

    > [!IMPORTANT]
    > This tutorial uses the SSE transport, not streamable HTTP. You must select the SSE option in VS Code for the connection to work correctly.

1. Enter the server URL: `http://localhost:8080/mcp`

1. Enter a server ID: `tasks-mcp`

1. Select **Workspace Settings**.

1. Test with: **"Show me all tasks"**

1. Select **Continue** when Copilot requests MCP tool confirmation.

You should see the task list returned from your in-memory store.

> [!TIP]
> Try other prompts like "Create a task to review the PR", "Mark task 1 as complete", or "Delete task 2".

## Containerize the application

Package the application as a Docker container so you can test it locally before deploying to Azure.

1. Create a `Dockerfile` with a multi-stage build:

    ```dockerfile
    FROM maven:3.9-eclipse-temurin-17-alpine AS build
    WORKDIR /app
    COPY pom.xml .
    RUN mvn dependency:go-offline -B
    COPY src/ src/
    RUN mvn package -DskipTests -B

    FROM eclipse-temurin:17-jre-alpine
    WORKDIR /app
    COPY --from=build /app/target/*.jar app.jar
    EXPOSE 8080
    ENTRYPOINT ["java", "-jar", "app.jar"]
    ```

    The multi-stage build keeps the final image small by separating the Maven build from the runtime image.

1. Verify locally:

    ```bash
    docker build -t tasks-mcp-server .
    docker run -p 8080:8080 tasks-mcp-server
    ```

    Confirm the health endpoint responds: `curl http://localhost:8080/health`

## Deploy to Azure Container Apps

After you containerize the application, deploy it to Azure Container Apps by using the Azure CLI. The `az containerapp up` command builds the container image in the cloud, so you don't need Docker on your machine for this step.

1. Set environment variables:

    ```azurecli
    RESOURCE_GROUP="mcp-tutorial-rg"
    LOCATION="eastus"
    ENVIRONMENT_NAME="mcp-env"
    APP_NAME="tasks-mcp-server-java"
    ```

1. Create a resource group and Container Apps environment:

    ```azurecli
    az group create --name $RESOURCE_GROUP --location $LOCATION

    az containerapp env create \
        --name $ENVIRONMENT_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION
    ```

1. Deploy the container app:

    ```azurecli
    az containerapp up \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --environment $ENVIRONMENT_NAME \
        --source . \
        --ingress external \
        --target-port 8080
    ```

1. Configure CORS:

    ```azurecli
    az containerapp ingress cors enable \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --allowed-origins "*" \
        --allowed-methods "GET,POST,DELETE,OPTIONS" \
        --allowed-headers "*"
    ```

    > [!NOTE]
    > For production, replace wildcard origins with specific trusted origins. See [Secure MCP servers on Container Apps](mcp-authentication.md).

1. Verify the deployment:

    ```azurecli
    APP_URL=$(az containerapp show \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --query "properties.configuration.ingress.fqdn" -o tsv)

    curl https://$APP_URL/health
    ```

## Connect GitHub Copilot to the deployed server

Now that the MCP server is running in Azure, configure VS Code to connect GitHub Copilot to the deployed endpoint.

1. Create or update `.vscode/mcp.json`:

    ```json
    {
        "servers": {
            "tasks-mcp-server": {
                "type": "sse",
                "url": "https://<your-app-fqdn>/mcp"
            }
        }
    }
    ```

    Replace `<your-app-fqdn>` with the FQDN from the deployment output.

    > [!IMPORTANT]
    > The `"type"` must be `"sse"` because this tutorial uses the SSE transport. Using `"http"` (streamable HTTP) causes connection failures.

1. In VS Code, open Copilot Chat in Agent mode.

1. Verify `tasks-mcp-server` appears in the Tools list. Select **Start** if needed.

1. Test with a prompt like **"What tasks do I have?"**

## Configure scaling for interactive use

Java applications have longer cold-start times. Set a minimum replica count to keep the JVM warm:

```azurecli
az containerapp update \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --min-replicas 1
```

> [!TIP]
> Consider resource settings appropriate for the JVM. A minimum of 1 vCPU and 2-GiB memory is recommended for Spring Boot applications.

## Security considerations

This tutorial uses an unauthenticated MCP server for simplicity. Before running an MCP server in production, review the following recommendations. When your MCP server is called by an agent powered by large language models (LLMs), be aware of [prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) attacks.

- **Authentication and authorization**: Secure your MCP server with Microsoft Entra ID. See [Secure MCP servers on Container Apps](mcp-authentication.md).
- **Input validation**: Use Bean Validation (`@Valid`, `@NotNull`, `@Size`) for tool parameter validation. See [Validation in Spring Boot](https://docs.spring.io/spring-boot/reference/io/validation.html).
- **HTTPS**: Azure Container Apps enforces HTTPS by default with automatic TLS certificates.
- **Least privilege**: Expose only the tools your use case requires. Avoid tools that perform destructive operations without confirmation.
- **CORS**: Restrict allowed origins to trusted domains in production.
- **Logging and monitoring**: Log MCP tool invocations for auditing using SLF4J and Azure Monitor.

## Clean up resources

If you're not going to continue to use this application, delete the resource group to remove all the resources created in this tutorial:

```azurecli
az group delete --resource-group $RESOURCE_GROUP --yes --no-wait
```

## Next step

> [!div class="nextstepaction"]
> [Secure MCP servers on Container Apps](mcp-authentication.md)

## Related content

- [MCP servers on Azure Container Apps overview](mcp-overview.md)
- [Deploy an MCP server to Container Apps (.NET)](tutorial-mcp-server-dotnet.md)
- [Deploy an MCP server to Container Apps (Python)](tutorial-mcp-server-python.md)
- [Deploy an MCP server to Container Apps (Node.js)](tutorial-mcp-server-nodejs.md)
- [Troubleshoot MCP servers on Container Apps](mcp-troubleshooting.md)
- [MCP Java SDK](https://github.com/modelcontextprotocol/java-sdk)
