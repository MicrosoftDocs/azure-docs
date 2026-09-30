---
title: Integrate web app with OpenAPI in Foundry Agent Service (Python)
description: Empower your existing Python web apps by integrating their capabilities into Foundry Agent Service with OpenAPI, enabling AI agents to perform real-world tasks.
author: cephalin
ms.author: cephalin
ms.date: 12/05/2025
ms.topic: tutorial
ms.custom:
  - devx-track-python
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
ms.service: azure-app-service
---

# Add an App Service app as a tool in Foundry Agent Service (Python)

In this tutorial, you'll learn how to expose a FastAPI app's functionality through OpenAPI, add it as a tool to Foundry Agent Service, and interact with your app using natural language in the agents playground.

If your web application already has useful features, like shopping, hotel booking, or data management, it's easy to make those capabilities available to an AI agent in Foundry Agent Service. By simply adding an OpenAPI schema to your app, you enable the agent to understand and use your app's capabilities when it responds to users' prompts. This means anything your app can do, your AI agent can do too, with minimal effort beyond creating an OpenAPI endpoint for your app. In this tutorial, you start with a simple restaurant ratings app. By the end, you'll be able to see restaurant ratings as well as create new restaurants and new reviews with an agent through conversational AI.

:::image type="content" source="media/tutorial-ai-integrate-azure-ai-agent-dotnet/agents-playground.png" alt-text="Screenshot showing the agents playground in the middle of a conversation that takes actions by using the OpenAPI tool.":::

> [!div class="checklist"]
> * Add OpenAPI functionality to your web app.
> * Make sure OpenAPI schema compatible with Foundry Agent Service.
> * Register your app as an OpenAPI tool in Foundry Agent Service.
> * Test your agent in the agents playground.

## Prerequisites

This tutorial assumes you're working with the sample used in [Deploy a Python FastAPI web app with PostgreSQL in Azure](tutorial-python-postgresql-app-fastapi.md). 

At a minimum, open the [sample application](https://github.com/Azure-Samples/msdocs-fastapi-postgresql-sample-app) in GitHub Codespaces and deploy the app by running `azd up`.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/Azure-Samples/msdocs-fastapi-postgresql-sample-app?quickstart=1)

## Add OpenAPI functionality to your web app

FasAPI already contains OpenAPI functionality at the default path `/openapi.json`. You just need to make a few changes to existing code to make it callable remotely by an agent.

1. Open *src/fastapi_app/app.py* and find line 24, where the FastAPI app is declared. Replace `app = FastAPI()` with the following code:

    ```python
    if os.getenv("WEBSITE_HOSTNAME"):
        server_url = f"https://{os.getenv('WEBSITE_HOSTNAME')}"
    else:
        server_url = "http://localhost:8000"
    app = FastAPI(
        title="Restaurant Review API",
        version="1.0.0",
        description="Can show restaurant ratings HTML and add new restaurants and reviews.",
        servers=[{"url": server_url}],
    )
    ```
    
    This code adds metadata to the OpenAPI schema, such as `title` and `description`. Most importantly, it adds the server URL of the API endpoint.

1. Open *src/fastapi_app/app.py*, add `operation_id` to the `/` and `/details/{id}` GET APIs. These two APIs return HTML documents that an AI agent can parse. For all other APIs, add the `include_in_schema=False` parameter.

    ```python
    @app.get("/", response_class=HTMLResponse, operation_id="getRestaurantsWithRatingsHtml")
        ...    
    
    @app.get("/create", response_class=HTMLResponse, include_in_schema=False)
        ...    
    
    @app.post("/add", response_class=RedirectResponse, include_in_schema=False)
        ...
    
    @app.get("/details/{id}", response_class=HTMLResponse, operation_id="getRestaurantDetails")
        ...    
    
    @app.post("/review/{id}", response_class=RedirectResponse, include_in_schema=False)
        ...
    ```

    You use `include_in_schema=False` to exclude `GET /create`, `POST /add`, and `POST /review/{id}` because they're part of the form-based functionality, whereas the AI agent needs to submit JSON data.

1. To add the add restaurant and add review functionality using JSON, add the following code:

    ```python
    from typing import Optional
    from fastapi import Body, HTTPException
    
    @app.post("/api/restaurants", response_model=Restaurant, status_code=status.HTTP_201_CREATED, operation_id="createRestaurant")
    async def create_restaurant_json(
        name: str = Body(...),
        street_address: str = Body(...),
        description: str = Body(...),
        session: Session = Depends(get_db_session),
    ):
        restaurant = Restaurant(name=name, street_address=street_address, description=description)
        session.add(restaurant)
        session.commit()
        session.refresh(restaurant)
        return restaurant
    
    
    @app.post("/api/restaurants/{id}/reviews", response_model=Review, status_code=status.HTTP_201_CREATED,operation_id="createReview")
    async def create_review_for_restaurant_json(
        id: int,
        user_name: str = Body(...),
        rating: Optional[int] = Body(None),
        review_text: str = Body(...),
        session: Session = Depends(get_db_session),
    ):
        if not session.get(Restaurant, id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")
    
        review = Review(
            restaurant=id, user_name=user_name, rating=rating, review_text=review_text, review_date=datetime.now()
        )
        session.add(review)
        session.commit()
        session.refresh(review)
        return review
    ```

    This code only shows the create API for brevity and for parity with the existing sample application. If you want, you can also add other APIs, such as update and delete.

1. Start the development server for the sample app with the following commands:

    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r src/requirements.txt
    pip install -e src
    python3 src/fastapi_app/seed_data.py
    python3 -m uvicorn fastapi_app:app --reload --port=8000
    ```
    

1. Select **Open in Browser**.

1. View the OpenAPI schema by adding `/openapi.json` to the URL, which is the default path used by FastAPI to serve the schema.

1. Back in the codespace terminal, deploy your changes by committing your changes (GitHub Actions method) or run `azd up` (Azure Developer CLI method).

1. Once your changes are deployed, navigate to `https://<your-app's-url>/openapi.json` and copy the schema for later.

## Create an agent in Microsoft Foundry

[!INCLUDE [create-agent](includes/tutorial-ai-integrate-azure-ai-agent-dotnet/create-agent.md)]

## Test the agent

1. In **Instructions**, give some simple instructions, like *"Please use the restaurantReview tool to help manage restaurant reviews."*

1. Chat with the agent with the following prompt suggestions:

    - "Show me the list of restaurant reviews."
    - "Create a restaurant. Use your imagination for the details."
    - "I didn't like the food at this restaurant. Please create a 2 star review."
    
    :::image type="content" source="media/tutorial-ai-integrate-azure-ai-agent-python/agents-playground.png" alt-text="Screenshot showing the agents playground in the middle of a conversation that takes actions by using the OpenAPI tool. The prompt says to show the list of restaurant reviews.":::

## Security best practices

When exposing APIs via OpenAPI in Azure App Service, follow these security best practices:

- **Authentication and Authorization**: Protect your OpenAPI endpoints with Microsoft Entra authentication. For step-by-step instructions, see [Secure OpenAPI endpoints for Foundry Agent Service](configure-authentication-ai-foundry-openapi-tool.md). You can also protect your endpoints behind [Azure API Management with Microsoft Entra ID](/azure/api-management/api-management-howto-protect-backend-with-aad) and ensure only authorized users or agents can access the tools.
- **Validate input data:** Always validate incoming data to prevent invalid or malicious input. For Python apps, use libraries such as [Pydantic](https://pypi.org/project/pydantic/) to enforce data validation rules with dedicated request schema models (such as RestaurantCreate and ReviewCreate). Refer to their documentation for best practices and implementation details.
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

To take the next step and learn how to run your agent directly within Azure App Service, see the following tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Build an agentic web app in Azure App Service with LangGraph or Foundry Agent Service (Python)](tutorial-ai-agent-web-app-langgraph-foundry-python.md)

## More resources

- [Integrate AI into your Azure App Service applications](overview-ai-integration.md)
- [What is Foundry Agent Service?](/azure/ai-services/agents/overview)