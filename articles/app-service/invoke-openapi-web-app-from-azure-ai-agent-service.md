---
title: 'Invoke an OpenAPI App Service web app from Azure AI Agent Service'
description: Learn how to integrate App Service with AI Agent Service and get started with agentic AI
author: seligj95
ms.author: jordanselig
ms.date: 02/19/2025
ms.topic: article
ms.custom: devx-track-dotnet
ms.collection: ce-skilling-ai-copilot
---

# Invoke an OpenAPI App Service web app from Azure AI Agent Service

[Azure AI Agent Service](/azure/ai-services/agents/overview) allows you to create AI agents tailored to your needs through custom instructions and augmented by advanced tools like code interpreter, and custom functions. You can now connect your Azure AI Agent to an external API using an [OpenAPI 3.0](https://www.openapis.org/what-is-openapi) specified tool, allowing for scalable interoperability with various applications. 

Azure App Service is a fully managed platform for building, deploying, and scaling web apps and APIs. If your API is hosted on Azure App Service, you can connect your AI Agent to the API using the OpenAPI specification. The OpenAPI specification defines the API and how to interact with it. You can then use natural language to invoke the API through your AI Agent.

In the following tutorial, you're using an Azure AI Agent to invoke an API hosted on Azure App Service.

## Prerequisites

To complete this tutorial, you need an Azure AI Agent project and a RESTful API hosted on Azure App Service. The API should have an OpenAPI specification that defines the API. The OpenAPI specification for the sample app in this tutorial is provided.

1. Ensure you complete the prerequisites and setup steps in the [quickstart](/azure/ai-services/agents/quickstart?pivots=programming-language-python-azure). This quickstart walks you through creating your Azure AI Hub and Agent project. You should complete the agent configuration and agent sample the quickstart provides to get a full understanding of the tool and ensure your setup works.
1. Ensure you have [Git installed](https://git-scm.com/downloads).
1. Ensure you have the latest [.NET 9.0 SDK installed](https://dotnet.microsoft.com/download/dotnet/9.0).
1. Follow the guidance in the next section to create the sample app and deploy it to Azure App Service. The sample app is a simple to-do list app that allows you to create, read, update, and delete items from the list.

## Create and deploy the sample app

1. Ensure you have the [Azure CLI](/cli/azure/install-azure-cli) installed and that you're logged into your Azure account. You can sign-in using the following command.

    ```bash
    az login
    ```

1. In the terminal window, use `cd` to go to a working directory.
1. Clone the sample repository, and then go to the repository root. This repository contains an app based on the tutorial [ASP.NET Core web API documentation with Swagger / OpenAPI](/aspnet/core/tutorials/web-api-help-pages-using-swagger?tabs=visual-studio). It uses a Swagger generator to serve the [Swagger UI](https://swagger.io/swagger-ui/) and the Swagger JSON endpoint.

    ```bash
    git clone https://github.com/Azure-Samples/dotnet-core-api
    cd dotnet-core-api
    ```

1. You can run the app locally to ensure it works. To start the app, run the following commands.

    ```bash
    dotnet restore
    dotnet run
    ```

1. Browse to `http://localhost:5000/swagger` in a browser to try the Swagger UI.
1. Browse to `http://localhost:5000/api/todo` to see the to-do list.
1. Press `Ctrl+C` in the terminal window to stop the app.
1. To deploy the app to Azure App Service, run the following command.

    ```bash
    az webapp up
    ```

1. After the app is deployed, browse to the URL provided in the terminal window to see the app running in Azure App Service. It can take a few minutes for the app to be fully deployed and running. Note this URL for later use.
 
## Connect your AI Agent to your App Service API

### Create and review the OpenAPI specification

Now that you have the required infrastructure, you can put it all together and start interacting with your API using your AI Agent. For a general overview on how to do get started, see [How to use Azure AI Agent Service with OpenAPI Specified Tools](/azure/ai-services/agents/how-to/tools/openapi-spec?tabs=python&pivots=overview). That overview includes prerequisites and other requirements including how to include authentication if your API requires it. The provided sample API is publicly accessible so authentication isn't required.

1. This specification is the OpenAPI specification for the sample app that is provided. On your local machine, create a file called `swagger.json` and copy the following contents.

    ```json
    {
    "openapi": "3.0.1",
    "info": {
        "title": "My API",
        "version": "v1"
    },
    "servers": [
        {
        "url": "<APP_SERVICE_URL>"
        }
    ],
    "paths": {
        "/api/Todo": {
        "get": {
            "tags": [
            "Todo"
            ],
            "operationId": "getToDoListItems",
            "responses": {
            "200": {
                "description": "Success",
                "content": {
                "text/plain": {
                    "schema": {
                    "type": "array",
                    "items": {
                        "$ref": "#/components/schemas/TodoItem"
                    }
                    }
                },
                "application/json": {
                    "schema": {
                    "type": "array",
                    "items": {
                        "$ref": "#/components/schemas/TodoItem"
                    }
                    }
                },
                "text/json": {
                    "schema": {
                    "type": "array",
                    "items": {
                        "$ref": "#/components/schemas/TodoItem"
                    }
                    }
                }
                }
            }
            }
        },
        "post": {
            "tags": [
            "Todo"
            ],
            "operationId": "createToDoListItem",
            "requestBody": {
            "content": {
                "application/json": {
                "schema": {
                    "$ref": "#/components/schemas/TodoItem"
                }
                },
                "text/json": {
                "schema": {
                    "$ref": "#/components/schemas/TodoItem"
                }
                },
                "application/*+json": {
                "schema": {
                    "$ref": "#/components/schemas/TodoItem"
                }
                }
            }
            },
            "responses": {
            "200": {
                "description": "Success",
                "content": {
                "text/plain": {
                    "schema": {
                    "$ref": "#/components/schemas/TodoItem"
                    }
                },
                "application/json": {
                    "schema": {
                    "$ref": "#/components/schemas/TodoItem"
                    }
                },
                "text/json": {
                    "schema": {
                    "$ref": "#/components/schemas/TodoItem"
                    }
                }
                }
            }
            }
        }
        },
        "/api/Todo/{id}": {
        "get": {
            "tags": [
            "Todo"
            ],
            "operationId": "getToDoListItemById",
            "parameters": [
            {
                "name": "id",
                "in": "path",
                "required": true,
                "schema": {
                "type": "integer",
                "format": "int64"
                }
            }
            ],
            "responses": {
            "200": {
                "description": "Success",
                "content": {
                "text/plain": {
                    "schema": {
                    "$ref": "#/components/schemas/TodoItem"
                    }
                },
                "application/json": {
                    "schema": {
                    "$ref": "#/components/schemas/TodoItem"
                    }
                },
                "text/json": {
                    "schema": {
                    "$ref": "#/components/schemas/TodoItem"
                    }
                }
                }
            }
            }
        },
        "put": {
            "tags": [
            "Todo"
            ],
            "operationId": "updateToDoListItem",
            "parameters": [
            {
                "name": "id",
                "in": "path",
                "required": true,
                "schema": {
                "type": "integer",
                "format": "int64"
                }
            }
            ],
            "requestBody": {
            "content": {
                "application/json": {
                "schema": {
                    "$ref": "#/components/schemas/TodoItem"
                }
                },
                "text/json": {
                "schema": {
                    "$ref": "#/components/schemas/TodoItem"
                }
                },
                "application/*+json": {
                "schema": {
                    "$ref": "#/components/schemas/TodoItem"
                }
                }
            }
            },
            "responses": {
            "200": {
                "description": "Success"
            }
            }
        },
        "delete": {
            "tags": [
            "Todo"
            ],
            "operationId": "deleteToDoListItem",
            "parameters": [
            {
                "name": "id",
                "in": "path",
                "required": true,
                "schema": {
                "type": "integer",
                "format": "int64"
                }
            }
            ],
            "responses": {
            "200": {
                "description": "Success",
                "content": {
                "text/plain": {
                    "schema": {
                    "$ref": "#/components/schemas/TodoItem"
                    }
                },
                "application/json": {
                    "schema": {
                    "$ref": "#/components/schemas/TodoItem"
                    }
                },
                "text/json": {
                    "schema": {
                    "$ref": "#/components/schemas/TodoItem"
                    }
                }
                }
            }
            }
        }
        }
    },
    "components": {
        "schemas": {
        "TodoItem": {
            "type": "object",
            "properties": {
            "id": {
                "type": "integer",
                "format": "int64"
            },
            "name": {
                "type": "string",
                "nullable": true
            },
            "isComplete": {
                "type": "boolean"
            }
            },
            "additionalProperties": false
        }
        },
        "securitySchemes": {}
    },
    "security": [
        {
        "apiKeyHeader": []
        }
    ]
    }
    ```

1. Replace the placeholder for `APP_SERVICE_URL` with your app's URL that you copied earlier. This URL is in the format `https://<app_name>.azurewebsites.net`.
1. Review the file to understand the API and its endpoints. The `operationId` values are CRUD operations that can be performed on the to-do list. Once the app is up and running, you can use your AI Agent to invoke the API and perform the various operations on your behalf using natural language. At the end of the specification, you have the `securitySchemes` section. This security section is where you add authentication if your API requires it. This section is left blank for the sample app, but is included because the AI Agent Service requires it.

### Create the OpenAPI Spec tool definition

1. Create a file in the same directory as your `swagger.json` file called `tool.py`. Copy the following contents into the file. Ensure you complete the prerequisites and setup steps in the [quickstart](/azure/ai-services/agents/quickstart?pivots=programming-language-python-azure) to get the required packages installed as well as get you logged into your Azure account.
    
    ```python
    import os
    import jsonref
    from azure.ai.projects import AIProjectClient
    from azure.identity import DefaultAzureCredential
    from azure.ai.projects.models import OpenApiTool, OpenApiAnonymousAuthDetails
    
    # Set the environment variable for your connection string, copied from your Azure AI Foundry project
    os.environ["PROJECT_CONNECTION_STRING"] = "<HostName>;<AzureSubscriptionId>;<ResourceGroup>;<HubName>"
    
    # Create an Azure AI Client from a connection string
    project_client = AIProjectClient.from_connection_string(
        credential=DefaultAzureCredential(), conn_str=os.environ["PROJECT_CONNECTION_STRING"]
    )
    
    # Read and print the OpenAPI spec
    with open('./swagger.json', 'r') as f:
        openapi_spec = jsonref.loads(f.read())
    
    # Create Auth object for the OpenApiTool (note that connection or managed identity auth setup requires additional setup in Azure)
    auth = OpenApiAnonymousAuthDetails()
    
    # Initialize agent OpenAPI tool using the OpenAPI spec
    openapi = OpenApiTool(name="toDolistAgent", spec=openapi_spec, description="Manage the to do list", auth=auth)
    
    # Prompt for the message content
    message_content = input("Message content: ")
    
    # Create agent with OpenAPI tool
    with project_client:
        agent = project_client.agents.create_agent(
            model="gpt-4o-mini",
            name="my-assistant",
            instructions="You are a helpful assistant",
            tools=openapi.definitions
        )
        print(f"Created agent, ID: {agent.id}")
    
        # Create thread for communication
        thread = project_client.agents.create_thread()
        print(f"Created thread, ID: {thread.id}")
    
        # Create message to thread
        message = project_client.agents.create_message(
            thread_id=thread.id,
            role="user",
            content=message_content,
        )
        print(f"Created message, ID: {message.id}")
    
        # Create and process agent run in thread with tools
        run = project_client.agents.create_and_process_run(thread_id=thread.id, assistant_id=agent.id)
        print(f"Run finished with status: {run.status}")
    
        if run.status == "failed":
            # Check if you got "Rate limit is exceeded.", then you want to get more quota
            print(f"Run failed: {run.last_error}")
    
        # Fetch all messages
        messages = project_client.agents.list_messages(thread_id=thread.id)
    
        # Get the last message from the sender
        last_msg = messages.get_last_text_message_by_role("assistant")
        if last_msg:
            print(f"Last Message: {last_msg.text.value}")
    
        # Delete the assistant when done
        project_client.agents.delete_agent(agent.id)
        print("Deleted agent")
    ```

1. Replace the placeholder for your project's connection string. If you need help with finding the connection string, see the [Configure and run agent section of the quickstart](/azure/ai-services/agents/quickstart?pivots=programming-language-python-azure#configure-and-run-an-agent).
1. Review the file to understand how the OpenAPI tool is created and how the AI Agent is invoked. The OpenAPI specification is passed into the file. Each time the tool is invoked, the AI Agent uses the OpenAPI specification to determine how to interact with the API. The `message_content` variable is where you enter the natural language command that you want the AI Agent to perform. You're prompted to enter the message once you run the script. The AI Agent invokes the API and returns the results. It creates and deletes the AI Agent each time you run the script.

## Run the OpenAPI Spec tool

1. Open a terminal and browse to the directory where you created the `tool.py` and `swagger.json` files. To run the script, run the following command.

    ```bash
    python tool.py
    ```

1. When prompted, enter a message for your Agent. For example, you can enter "What's on my to-do list?", "Add a task to buy bread," "Mark all my tasks as done," or any other question or action that can be performed on the list. The AI Agent then invokes the API and returns the results. You can also enter "Add an item to the to-do list" and the AI Agent prompts you for the details of the item to add.

## Next steps

Now that you learned how to connect your AI Agent to an API on Azure App Service, you can explore the other AI integrations available with App Service:

> [!div class="nextstepaction"]
> [Deploy an application that uses OpenAI on Azure App Service](./deploy-intelligent-apps.md)

> [!div class="nextstepaction"]
> [Run a local SLM in a sidecar container in Azure App Service](./tutorial-sidecar-local-small-language-model.md)

> [!div class="nextstepaction"]
> [Deploy a .NET Blazor app connected to Azure SQL and Azure OpenAI on Azure App Service](./deploy-intelligent-apps-dotnet-to-azure-sql.md)