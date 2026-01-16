---
title: Integrate web app with OpenAPI in Foundry Agent Service (Node.js)
description: Empower your existing Node.js web apps by integrating their capabilities into Foundry Agent Service with OpenAPI, enabling AI agents to perform real-world tasks.
author: cephalin
ms.author: cephalin
ms.date: 12/05/2025
ms.topic: tutorial
ms.custom:
  - devx-track-javascript
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
ms.service: azure-app-service
---

# Add an App Service app as a tool in Foundry Agent Service (Node.js)

In this tutorial, you'll learn how to expose an Express.js app's functionality through OpenAPI, add it as a tool to Foundry Agent Service, and interact with your app using natural language in the agents playground.

If your web application already has useful features, like shopping, hotel booking, or data management, it's easy to make those capabilities available to an AI agent in Foundry Agent Service. By simply adding an OpenAPI schema to your app, you enable the agent to understand and use your app's capabilities when it responds to users' prompts. This means anything your app can do, your AI agent can do too, with minimal effort beyond creating an OpenAPI endpoint for your app. In this tutorial, you start with a simple to-do list app. By the end, you'll be able to create, update, and manage tasks with an agent through conversational AI.

:::image type="content" source="media/tutorial-ai-integrate-azure-ai-agent-dotnet/agents-playground.png" alt-text="Screenshot showing the agents playground in the middle of a conversation that takes actions by using the OpenAPI tool.":::

> [!div class="checklist"]
> * Add OpenAPI functionality to your web app.
> * Make sure OpenAPI schema compatible with Foundry Agent Service.
> * Register your app as an OpenAPI tool in Foundry Agent Service.
> * Test your agent in the agents playground.

## Prerequisites

This tutorial assumes you're working with the sample used in [Tutorial: Deploy a Node.js + MongoDB web app to Azure](tutorial-nodejs-mongodb-app.md). 

At a minimum, open the [sample application](https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app) in GitHub Codespaces and deploy the app by running `azd up`.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app?quickstart=1)

## Add OpenAPI functionality to your web app

1. In the codespace terminal, add the NuGet [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc) NPM package to your project:

    ```dotnetcli
    npm install swagger-jsdoc
    ```
    
1. Open *routes/index.js*. At the bottom of the file, above `module.exports = router;` add the following API functions. To make them compatible with the Foundry Agent Service, you must specify the `operationId` property in the `@swagger` annotation (see [How to use Foundry Agent Service with OpenAPI Specified Tools: Prerequisites](/azure/ai-services/agents/how-to/tools/openapi-spec#prerequisites)).

    ```javascript
    router.get('/schema', function(req, res, next) {
      try {
        const swaggerJsdoc = require('swagger-jsdoc');
        
        res.json(
          swaggerJsdoc(
            {
              definition: {
                openapi: '3.0.0',
                servers: [
                  {
                    url: `${req.protocol}://${req.get('host')}`,
                    description: 'Task API',
                  },
                ],
              },
              apis: ['./routes/*.js'],
            }
          )
        );
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    /**
     * @swagger
     * /api/tasks:
     *   get:
     *     summary: Get all tasks
     *     operationId: getAllTasks
     *     responses:
     *       200:
     *         description: List of tasks
     */
    router.get('/api/tasks', async function(req, res, next) {
      try {
        const tasks = await Task.find();
        res.json(tasks);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    /**
     * @swagger
     * /api/tasks/{id}:
     *   get:
     *     summary: Get task by ID
     *     operationId: getTaskById
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Task details
     */
    router.get('/api/tasks/:id', async function(req, res, next) {
      try {
        const task = await Task.findById(req.params.id);
        res.json(task);
      } catch (error) {
        res.status(404).json({ error: error.message });
      }
    });
    
    /**
     * @swagger
     * /api/tasks:
     *   post:
     *     summary: Create a new task
     *     operationId: createTask
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               taskName:
     *                 type: string
     *     responses:
     *       201:
     *         description: Task created
     */
    router.post('/api/tasks', async function(req, res, next) {
      try {
        // Set createDate to current timestamp when creating a task
        const taskData = {
          ...req.body,
          createDate: new Date()
        };
        
        const task = new Task(taskData);
        await task.save();
        res.status(201).json(task);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });
    
    /**
     * @swagger
     * /api/tasks/{id}:
     *   put:
     *     summary: Update a task
     *     operationId: updateTask
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               taskName:
     *                 type: string
     *               completed:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Task updated
     */
    router.put('/api/tasks/:id', async function(req, res, next) {
      try {
        // If completed is being set to true, also set completedDate
        if (req.body.completed === true) {
          req.body.completedDate = new Date();
        }
        
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });
    
    /**
     * @swagger
     * /api/tasks/{id}:
     *   delete:
     *     summary: Delete a task
     *     operationId: deleteTask
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Task deleted
     */
    router.delete('/api/tasks/:id', async function(req, res, next) {
      try {
        const task = await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully', task });
      } catch (error) {
        res.status(404).json({ error: error.message });
      }
    });
    ```
    
    This code is duplicating the functionality of the existing routes, which is unnecessary, but you'll keep it for simplicity. A best practice would be to move the app logic to shared functions, then call them both from the MVC routes and from the OpenAPI routes.

1. In the codespace terminal, run the application with `npm start`.

1. Select **Open in Browser**.

1. View the OpenAPI schema by adding `/schema` to the URL.

1. Back in the codespace terminal, deploy your changes by committing your changes (GitHub Actions method) or run `azd up` (Azure Developer CLI method).

1. Once your changes are deployed, navigate to `https://<your-app's-url>/schema` and copy the schema for later.

## Create an agent in Microsoft Foundry

[!INCLUDE [create-agent](includes/tutorial-ai-integrate-azure-ai-agent-dotnet/create-agent.md)]

## Test the agent

[!INCLUDE [test-agent](includes/tutorial-ai-integrate-azure-ai-agent-dotnet/test-agent.md)]

## Security best practices

When exposing APIs via OpenAPI in Azure App Service, follow these security best practices:

- **Authentication and Authorization**: Protect your OpenAPI endpoints with Microsoft Entra authentication. For step-by-step instructions, see [Secure OpenAPI endpoints for Foundry Agent Service](configure-authentication-ai-foundry-openapi-tool.md). You can also protect your endpoints behind [Azure API Management with Microsoft Entra ID](/azure/api-management/api-management-howto-protect-backend-with-aad) and ensure only authorized users or agents can access the tools.
- **Validate input data:** Always validate incoming data to prevent invalid or malicious input. For Node.js apps, use libraries such as [express-validator](https://express-validator.github.io/docs/) to enforce data validation rules. Refer to their documentation for best practices and implementation details.
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
> [Tutorial: Build an agentic web app in Azure App Service with Microsoft Semantic Kernel or Foundry Agent Service (.NET)](tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet.md)

## More resources

- [Integrate AI into your Azure App Service applications](overview-ai-integration.md)
- [What is Foundry Agent Service?](/azure/ai-services/agents/overview)