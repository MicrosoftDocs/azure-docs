---
title: Web app as MCP server in GitHub Copilot Chat agent mode (Python)
description: Empower GitHub Copilot Chat with your existing Python web apps by integrating their capabilities as Model Context Protocol servers, enabling Copilot Chat to perform real-world tasks.
author: cephalin
ms.author: cephalin
ms.date: 11/10/2025
ms.topic: tutorial
ms.custom:
  - devx-track-python
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
ms.service: azure-app-service
---

# Integrate an App Service app as an MCP Server for GitHub Copilot Chat (Python)

In this tutorial, you'll learn how to expose a FastAPI app's functionality through Model Context Protocol (MCP), add it as a tool to GitHub Copilot, and interact with your app using natural language in Copilot Chat agent mode.

:::image type="content" source="media/tutorial-ai-model-context-protocol-server-python/model-context-protocol-call-success.png" alt-text="Screenshot showing that the response from the MCP tool call in the GitHub Copilot Chat window.":::

If your web application already has useful features, like shopping, hotel booking, or data management, it's easy to make those capabilities available for:

- Any [application that supports MCP integration](https://modelcontextprotocol.io/clients), such as GitHub Copilot Chat agent mode in Visual Studio Code or in GitHub Codespaces. 
- A custom agent that accesses remote tools by using an [MCP client](https://modelcontextprotocol.io/quickstart/client#python).

By adding an MCP server to your web app, you enable an agent to understand and use your app's capabilities when it responds to user prompts. This means anything your app can do, the agent can do too.

> [!div class="checklist"]
> * Add an MCP server to your web app.
> * Test the MCP server locally in GitHub Copilot Chat agent mode.
> * Deploy the MCP server to Azure App Service and connect to it in GitHub Copilot Chat.

## Prerequisites

This tutorial assumes you're working with the sample used in [Deploy a Python FastAPI web app with PostgreSQL in Azure](tutorial-python-postgresql-app-fastapi.md). 

At a minimum, open the [sample application](https://github.com/Azure-Samples/msdocs-fastapi-postgresql-sample-app) in GitHub Codespaces and deploy the app by running `azd up`.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/Azure-Samples/msdocs-fastapi-postgresql-sample-app?quickstart=1)

## Add MCP server to your web app

1. In the codespace explorer, open *src/pyproject.toml*, add `mcp[cli]` to the list of dependencies, as shown in the following example:

    ```toml
    dependencies = [
        ...
        "mcp[cli]",
    ]
    ```
    
1. In *src/fastapi_app*, create a file called *mcp_server.py* and paste the following MCP server initialization code into the file:

    ```python
    import asyncio
    import contextlib
    from contextlib import asynccontextmanager
    
    from mcp.server.fastmcp import FastMCP
    from sqlalchemy.sql import func
    from sqlmodel import Session, select
    
    from .models import Restaurant, Review, engine
    
    # Create a FastMCP server. Use stateless_http=True for simple mounting. Default path is .../mcp
    mcp = FastMCP("RestaurantReviewsMCP", stateless_http=True)
    
    # Lifespan context manager to start/stop the MCP session manager with the FastAPI app
    @asynccontextmanager
    async def mcp_lifespan(app):
        async with contextlib.AsyncExitStack() as stack:
            await stack.enter_async_context(mcp.session_manager.run())
            yield
    
    # MCP tool: List all restaurants with their average rating and review count
    @mcp.tool()
    async def list_restaurants_mcp() -> list[dict]:
        """List restaurants with their average rating and review count."""
    
        def sync():
            with Session(engine) as session:
                statement = (
                    select(
                        Restaurant,
                        func.avg(Review.rating).label("avg_rating"),
                        func.count(Review.id).label("review_count"),
                    )
                    .outerjoin(Review, Review.restaurant == Restaurant.id)
                    .group_by(Restaurant.id)
                )
                results = session.exec(statement).all()
                rows = []
                for restaurant, avg_rating, review_count in results:
                    r = restaurant.dict()
                    r["avg_rating"] = float(avg_rating) if avg_rating is not None else None
                    r["review_count"] = review_count
                    r["stars_percent"] = (
                        round((float(avg_rating) / 5.0) * 100) if review_count > 0 and avg_rating is not None else 0
                    )
                    rows.append(r)
                return rows
    
        return await asyncio.to_thread(sync)
    
    # MCP tool: Get a restaurant and all its reviews by restaurant_id
    @mcp.tool()
    async def get_details_mcp(restaurant_id: int) -> dict:
        """Return the restaurant and its related reviews as objects."""
    
        def sync():
            with Session(engine) as session:
                restaurant = session.exec(select(Restaurant).where(Restaurant.id == restaurant_id)).first()
                if restaurant is None:
                    return None
                reviews = session.exec(select(Review).where(Review.restaurant == restaurant_id)).all()
                return {"restaurant": restaurant.dict(), "reviews": [r.dict() for r in reviews]}
    
        return await asyncio.to_thread(sync)
    
    # MCP tool: Create a new review for a restaurant
    @mcp.tool()
    async def create_review_mcp(restaurant_id: int, user_name: str, rating: int, review_text: str) -> dict:
        """Create a new review for a restaurant and return the created review dict."""
    
        def sync():
            with Session(engine) as session:
                review = Review()
                review.restaurant = restaurant_id
                review.review_date = __import__("datetime").datetime.now()
                review.user_name = user_name
                review.rating = int(rating)
                review.review_text = review_text
                session.add(review)
                session.commit()
                session.refresh(review)
                return review.dict()
    
        return await asyncio.to_thread(sync)
    
    # MCP tool: Create a new restaurant
    @mcp.tool()
    async def create_restaurant_mcp(restaurant_name: str, street_address: str, description: str) -> dict:
        """Create a new restaurant and return the created restaurant dict."""
    
        def sync():
            with Session(engine) as session:
                restaurant = Restaurant()
                restaurant.name = restaurant_name
                restaurant.street_address = street_address
                restaurant.description = description
                session.add(restaurant)
                session.commit()
                session.refresh(restaurant)
                return restaurant.dict()
    
        return await asyncio.to_thread(sync)
    ```

    The FastMCP() initializer creates an MCP server using the stateless mode pattern in the [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk). By default, its streamable HTTP endpoint is set to the `/mcp` subpath.

    - The `@mcp.tool()` decorator adds a [tool](https://github.com/modelcontextprotocol/python-sdk?tab=readme-ov-file#tools) to the MCP server with its implementation.
    - The tool function's description helps the calling agent to understand how to use the tool and its parameters.
    
    The tools duplicate the existing restaurant reviews functionality in the form-based FastAPI web application. If you want, you can add more tools for update and delete functionality.

1. In *src/fastapi_app/app.py*, find the line for `app = FastAPI()` (line 24) and replace it with the following code:

    ```python
    from .mcp_server import mcp, mcp_lifespan
    app = FastAPI(lifespan=mcp_lifespan)
    app.mount("/mcp", mcp.streamable_http_app())
    ```
    
    This code mounts the MCP server's streamable HTTP endpoint to the existing FastAPI app at the path `/mcp`. Together with the default path of the streamable HTTP endpoint, the full path is `/mcp/mcp`.

## Test the MCP server locally
    
1. In the codespace terminal, run the application with the following commands:

    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r src/requirements.txt
    pip install -e src
    python3 src/fastapi_app/seed_data.py
    python3 -m uvicorn fastapi_app:app --reload --port=8000
    ```

1. Select **Open in Browser**, then add a few restaurants and reviews. 

    Leave `uvicorn` running. Your MCP server is running at `http://localhost:8000/mcp/mcp` now.

1. Back in the codespace, open Copilot Chat, then select **Agent** mode in the prompt box.

1. Select the **Tools** button, then select the **Add MCP Server** icon in the popup's top right corner.

    :::image type="content" source="media/tutorial-ai-model-context-protocol-server-python/add-model-context-protocol-tool.png" alt-text="Screenshot showing how to add an MCP server in GitHub Copilot Chat agent mode.":::

1. Select **HTTP (HTTP or Server-Sent Events)**.

1. In **Enter Server URL**, type *http://localhost:8000/mcp/mcp*.

1. In **Enter Server ID**, type *restaurant_ratings* or any name you like.

1. Select **Workspace Settings**.

1. In a new Copilot Chat window, type something like *"Show me the restaurant ratings."*

1. By default, GitHub Copilot shows you a security confirmation when you invoke an MCP server. Select **Continue**.

    :::image type="content" source="media/tutorial-ai-model-context-protocol-server-python/model-context-protocol-call-confirmation.png" alt-text="Screenshot showing the default security message from an MCP invocation in GitHub Copilot Chat.":::

    You should now see a response that indicates that the MCP tool call is successful.

    :::image type="content" source="media/tutorial-ai-model-context-protocol-server-python/model-context-protocol-call-success.png" alt-text="Screenshot showing that the response from the MCP tool call in the GitHub Copilot Chat window.":::

## Deploy your MCP server to App Service

1. Back in the codespace terminal, deploy your changes by committing your changes (GitHub Actions method) or run `azd up` (Azure Developer CLI method).

1. In the AZD output, find the URL of your app. The URL looks like this in the AZD output:

    <pre>
    Deploying services (azd deploy)
    
      (✓) Done: Deploying service web
      - Endpoint: &lt;app-url>
    </pre>

1. Once `azd up` finishes, open *.vscode/mcp.json*. Change the URL to `<app-url>/mcp/mcp`. 

1. Above your modified MCP server configuration, select **Start**.

    :::image type="content" source="media/tutorial-ai-model-context-protocol-server-python/model-context-protocol-server-start.png" alt-text="Screenshot showing how to manually start an MCP server from the local mcp.json file.":::

1. Start a new GitHub Copilot Chat window. You should be able to view restaurant ratings, as well as create new restaurants and new ratings in the Copilot agent.
    
## Security best practices

When your MCP server is called by an agent powered by large language models (LLM), be aware of [prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) attacks. Consider the following security best practices:

- **Authentication and Authorization**: Secure your MCP server with Microsoft Entra authentication to ensure only authorized users or agents can access your tools. See [Secure Model Context Protocol calls to Azure App Service from Visual Studio Code with Microsoft Entra authentication](configure-authentication-mcp-server-vscode.md) for a step-by-step guide.
- **Input Validation and Sanitization**: Always validate incoming data to prevent invalid or malicious input. For Python apps, use libraries such as [Pydantic](https://pypi.org/project/pydantic/) to enforce data validation rules with dedicated input models (such as RestaurantCreate and ReviewCreate). Refer to their documentation for best practices and implementation details.
- **HTTPS:** The sample relies on Azure App Service, which enforces HTTPS by default and provides free TLS/SSL certificates to encrypt data in transit.
- **Least Privilege Principle**: Expose only the necessary tools and data required for your use case. Avoid exposing sensitive operations unless necessary.
- **Rate Limiting and Throttling**: Use [API Management](/azure/api-management/api-management-sample-flexible-throttling) or custom middleware to prevent abuse and denial-of-service attacks.
- **Logging and Monitoring**: Log access and usage of MCP endpoints for auditing and anomaly detection. Monitor for suspicious activity.
- **CORS Configuration**: Restrict cross-origin requests to trusted domains if your MCP server is accessed from browsers. For more information, see [Enable CORS](app-service-web-tutorial-rest-api.md#enable-cors).
- **Regular Updates**: Keep your dependencies up to date to mitigate known vulnerabilities.

## More resources

[Integrate AI into your Azure App Service applications](overview-ai-integration.md)
