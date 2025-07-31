---
title: Set up Standard Workflows as MCP Servers
description: Learn how to set up Standard logic apps as Model Context Protocol (MCP) servers that AI agents can call.
services: logic-apps
ms.suite: integration
ms.author: kewear
ms.reviewers: estfan, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.date: 08/06/2025
ms.update-cycle: 180-days
#CustomerIntent: I want to call Standard logic app workflows in Azure Logic Apps as Model Context Protocol (MCP) servers as tools from AI agents.
---

# Set up Standard logic app workflows as MCP servers for AI agents (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
>
> The following capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

AI agents interpret requests and fulfill them by using prebuilt *tools*, which are operations that agents call to perform tasks, such as send an email, query a database, or trigger a workflow. In Azure Logic Apps, you can jumpstart building these tools by reconfiguring Standard logic apps as custom Model Context Protocol (MCP) servers.

MCP is an open standard that lets AI agents work with external systems and tools in a secure, discoverable, and structured way. This standard defines how to describe, run, and authenticate access to tools so that agents can interact with real-world systems such as databases, APIs, and business workflows. An MCP server works like a bridge between an AI agent and the tools that the agent can use.

:::image type="content" source="media/set-up-model-context-protocol-servers-standard/agent-tools.png" alt-text="Conceptual diagram that shows an agent and interactions with related components." lightbox="media/set-up-model-context-protocol-servers-standard/agent-tools.png":::

For more information, see the following articles:

- [What is an AI Agent?](/azure/ai-foundry/agents/overview#what-is-an-ai-agent)
- [Introduction - Get started with the Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/getting-started/intro)

The following table describes the benefits that you get when you set up Standard logic app workflows as custom MCP servers:

| Benefit | Description |
|---------|-------------|
| Reusability | You can call existing workflows, connectors, and codeful functions from an AI agent, which gives you the opportunity for extra return on your investments. |
| Flexibility | Azure Logic Apps provides 1,400+ connectors that provide access and ways to work with enterprise assets and resources whether they in the cloud or on premises. |
| Access points | Azure Logic Apps supports various connectivity models for running your MCP server. For you can run your server in the cloud, exposed as a private endpoint, or connected to virtual networks and on-premises resources. |
| Security | When you expose your logic app as an MCP server, make sure that you set up a strong security posture and meet your enterprise security requirements. You can use Microsoft Entra ID with EasyAuth for authentication and authorization and to secure your MCP server and Standard workflows. |
| Monitoring, governance, and compliance | Azure Logic Apps provides workflow run history and integration with Application Insights or Log Analytics so that you get the data necessary to manage and monitor your MCP server tools and support your needs around diagnostics and troubleshooting, reporting, traceability, and auditing. |

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- The Standard logic app resource and workflows that you want to set up as an MCP server with tools that agents can use.

  - This capability applies only to Standard workflows that use the Workflow Service Plan or App Service Environment v3 option.

  - Workflows must start with the **Request** trigger named **When a HTTP request is received** and include the **Response** action.

  For more information, see the following documentation:

  - [Considerations for workflows as tools](#considerations-for-workflows-as-tools)
  - [Create an example Standard logic app workflow using the Azure portal](create-single-tenant-workflows-azure-portal.md)

- An [app registration](/entra/identity-platform/app-objects-and-service-principals?tabs=browser#application-registration) to use in the EasyAuth setup for your logic app.

  This app registration is an identity that your logic app resource uses to delegate identity and access management functions to Microsoft Entra ID.

  For instructions, see [Create an app registration](#create-app-registration-logic-app).

## Considerations for workflows as tools

When you build workflows to use as MCP tools, review the following considerations and best practices:

To help agents correctly find and run tools, add the following metadata to the **Request** trigger and request payloads. This metadata improves the agent's reliability and accuracy in using tools.

> [!TIP]
>
> The following steps use the Azure portal, but you can alternatively use Visual Studio Code.

- Trigger description

  Your MCP server uses this metadata when showing tools to end users and when routing requests to the correct tool. To add this description, follow these steps:

  1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow.

  1. In the workflow sidebar, under **Tools**, select the designer to open the workflow.

  1. In the designer, select the **Request** trigger.

  1. In the trigger information pane, under the trigger name, add a description about what the trigger and workflow does.

- Input parameter descriptions

  This metadata improves the agent's accuracy in passing the correct inputs to tools at runtime. To add a description for each input parameter, follow these steps:

  1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow.

  1. In the workflow sidebar, under **Tools**, select the designer to open the workflow.

     > [!NOTE]
     >
     > You can also use code view to add this information. 

  1. In the designer, select the **Request** trigger.

  1. In the trigger information pane, under **Request Body JSON Schema**, enter a schema for the expected request content payload.

     - For each input parameter, add the `description` attribute and the corresponding description.

     - If your tool requires specific parameters to successfully run, you can include them as required parameters by adding the `required` object and an array with these parameters.

     The following example shows sample input parameters, descriptions, and required parameters:

     ```json
     {
         "type": "object",
         "properties": {
             "TicketNumber": {
                 "type": "string",
                 "description": "The ticket number for the IT issue."
             },
             "OpenedBy_FirstName": {
                  "type": "string",
                  "description": "The first name for the person who reported the issue."
             },
             "OpenedBy_LastName": {
                  "type": "string",
                  "description": "The last name for the person who reported the issue."
             },
             "Notes": {
                 "type": "string",
                 "description": "Other information to include in the ticket about the issue."
             }
         },
         "required": [
             "TicketNumber",
             "OpenedBy_FirstName",
             "OpenedBy_LastName",
             "Notes"
         ]
     }
     ```

> [!TIP]
>
> If you experience inconsistent results when an agent calls and runs your tool, check whether 
> you can make the trigger and parameter descriptions more unique. For example, you might try 
> describing the format for parameter inputs. So, if a parameter expects a base64 encoded string, 
> including this detail in the parameter description might help.

## Create an app registration

To create an app registration for your logic app to use, follow these steps:

1. In the [Azure portal](https://portal.azure.com) search box, enter **app registrations**.

1. On the **App registrations** page toolbar, select **New registration**.

1. On the **Register an application** page, provide the following information:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Name** | Yes | The name for your app registration. |
   | **Supported account types** | Yes | The accounts that can use or access your logic app. |
   | **Redirect URI** | No | Skip this section. |
     
1. When you're done, select **Register**.

1. On the app registration page, copy and save the **Directory (tenant) ID** for later use.

1. On the app registration sidebar, under **Manage**, select **Expose an API**.

1. Next to **Application ID URI**, select **Add**. Keep the default value, copy and save this value for later use, and select **Save**.

1. Under **Scopes defined by this API**, select **Add a scope** to provide granular permissions to your app's users.

   1. On the **Add a scope pane**, provide the following information:

      | Property | Required | Description |
      |----------|----------|-------------|
      | **Scope name** | Yes | A relevant name for the permissions scope that uses the following format:<br><br> `<resource>.<operation>.<constraint>` <br><br>This example uses `user_impersonation`. For more information, see [Scopes and permissions in the Microsoft identity platform](/entra/identity-platform/scopes-oidc). |
      | **Who can consent** | Yes | Based on your organization's policies, select the option that best aligns with your policies. This example selects **Admins and users**. |
      | **Admin consent display name** | Yes ||
      | **Admin consent description** | Yes ||
      | **User consent display name** | No ||
      | **User consent description** | No ||
      | **State** | Yes | Select **Enabled**. |

      For more information, see [Add a scope](/entra/identity-platform/quickstart-configure-app-expose-web-apis#add-a-scope).

   1. When you're done, select **Add scope**.

For more information, see [Register an application in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app).

When you finish these steps, you have the following values to use later with your logic app:

- Directory (tenant) ID

- Application ID URI

## Set up logic app as MCP server

For this task, you need to edit the **host.json** file for your Standard logic app resource.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource sidebar, under **Development Tools**, select **Advanced Tools** **>** **Go**. If prompted, consent to leaving the Azure portal.

1. On the **Kudu** toolbar, from the **Debug console** menu, select **CMD**.

1. From the directory table, go to the following folder: **site/wwwroot**

1. Next to the **host.json** file, select the edit icon (pencil).

1. In the editor window, under the `extensionBundle` JSON object, add the `extensions` JSON object. Make sure that you replace the placeholder values with the following values that you saved earlier:

   - Directory (tenant) ID
   - Logic app name
   - Application ID URI

   ```json
   "extensionBundle": {
       "id": "Microsoft.Azure.Functions.ExtensionBundle.Workflows",
       "version": "[1.*, 2.0.0)"
   },
   "extensions": {
       "http":{
           "routePrefix": ""
       },
       "workflow": {
           "Settings": {
               "Runtime.Backend.EdgeWorkflowRuntimeTriggerListener.AllowCrossWorkerCommunication": true,
               "Runtime.McpServerToMcpClientPingIntervalInSeconds": 30
           },
           "McpServerEndpoints": {
               "enable": true,
               "authentication": {
                   "type": "oauth2"
               },
               "ProtectedResourceMetadata": {
                   "BearerMethodsSupported": ["header"],
                   "ScopesSupported": ["api://<application-ID-URI>/mcp"],
                   "Resource": "https://<logic-app-name>.azurewebsites.net/",
                   "AuthorizationServers": ["https://login.microsoftonline.com/<tenant-ID>/v2.0"]
               }
           }
       }
   }
   ```

## Set up EasyAuth for your logic app


## Related content

- [Run Consumption workflows as actions for agents in Azure AI Foundry](add-agent-action-create-run-workflow.md)
- [Workflows with AI agents and models in Azure Logic Apps](agent-workflows-concepts.md)
- [Create workflows that use AI agents and models](create-agent-workflows.md)
