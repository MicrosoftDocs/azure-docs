---
title: Authorize Agent Access with On-Behalf-Of Flow
description: Learn to authorize agent tool access to protected Microsoft resources through the signed-in user's identity and permissions in conversational agent workflows for Azure Logic Apps. Set up OAuth 2.0 On-Behalf-Of (OBO) authorization so that tool actions use delegated permissions and per-user connections.
services: logic-apps
author: ecfan
ms.topic: how-to
ms.date: 10/14/2025
ms.update-cycle: 365-days
#Customer intent: As an integration developer working with conversational agent workflows in Azure Logic Apps, I want to authorize access to protected resources with the signed-in user's identity and permissions. For this task, I can set up delegated permissions with the OAuth 2.0 On-Behalf-Of (OBO) flow for authorization.
---

# Authorize agent tool access to resources with on-behalf-of (OBO) flow in Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
>
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To access protected, user-specific Microsoft resources, some conversational agent solutions might require agent tools to use the identity and permissions for the person who's signed in to the chat session. For this authorization approach, you need to set up [*delegated permissions*](/entra/identity-platform/delegated-access-primer) with the [OAuth 2.0 On-Behalf-Of (OBO) flow](/entra/identity-platform/v2-oauth2-on-behalf-of-flow). This flow passes the signed-in chat user's identity and permissions through the request chain so that resource connections use the person's identity and permissions to gain access.

This option provides benefits around governance and compliance because resource access, inputs, outputs, and audit logs are linked to a specific person. OBO is also known as *user context* because agent tools apply the signed-in user's specific security context, including personalized licensing and data access rights.

In conversational agent workflows, you can set up an agent with delegated permissions for the signed-in user. Agent tools, backed and powered by connector actions, can then use the delegated permissions if the connector actions support OBO authorization and [*per-user* connections](#limitations-and-known-issues). During chat sessions, connections set up with OBO authorization use the signed-in chat participant's credentials, not the connection creator. This behavior makes sure that OBO-enabled actions run with the signed-in user's identity and permissions.

For example, the following list describes common examples where agent tools must respect the user's permissions, licenses, and personal data boundaries:

| Service or system | Action |
|-------------------|--------|
| Microsoft 365 | Read a person's mail, calendar, files, or profile. |
| Service desk or IT service management systems | Attribute actions to the requester. |
| Enterprise APIs | Require per-user authorization or auditing requirements. |

The following screenshot shows an example agent tool backed by a connector action with per-user connections set up:

:::image type="content" source="media/set-up-on-behalf-of-user-flow/create-per-user-connection.png" alt-text="Screenshot shows workflow designer, example Get emails (V3) action, and connection pane with selected option for Create as per-user connection." lightbox="media/set-up-on-behalf-of-user-flow/create-per-user-connection.png":::

This guide shows how to set up the OBO authorization, delegated permissions, and per-user connections on supported connector actions in agent tools for conversational agent workflows.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Standard logic app resource and conversational agent workflow

  Make sure that you have a deployed *large language model* (LLM) per the [prerequisites for conversational agent workflows](create-conversational-agent-workflows.md#prerequisites) and that you [connect your agent to that model](create-conversational-agent-workflows.md#connect-the-agent-to-your-model).
  
  This example uses **Admin agent** as the agent name, for example:

  :::image type="content" source="media/set-up-on-behalf-of-user-flow/admin-agent.png" alt-text="Screenshot shows Azure portal, Standard logic app with conversational agent workflow, and empty Admin agent." lightbox="media/set-up-on-behalf-of-user-flow/admin-agent.png":::

- Determine the identities that you need to use with the connector actions that power agent tools.

  The following table describes the available identities for authorizing access to protected resources and  running connector actions as agent tools:

  | Identity | Description |
  |----------|-------------|
  | Signed-in user (OBO or user context) | A connector action runs with a delegated access token for the signed-in user. The result depends on the user's permissions and licenses. <br><br>**Note**: OBO uses only delegated permissions for [scopes](/entra/identity-platform/scopes-oidc), not [application roles](/entra/identity-platform/howto-add-app-roles-in-apps) because roles stay attached to the user (principal) and never to the app that operates on behalf of the user or caller. This behavior prevents the user or caller from gaining permission to resources that they shouldn't access. |
  | App-only or application identity | A connector operation runs using a managed identity, application principal, or service principal. The result depends on app permissions and configuration. For more information, see [Application and service principal objects in Microsoft Entra ID](/entra/identity-platform/app-objects-and-service-principals). <br><br>**Important**: Don't use an app-only identity unless your agent tool performs shared operations. These operations aren't user-specific like posting system status to a shared channel, running a back office job, or signing in with a service account. |
  | Connection reference | Your workflow binds each connector operation to a specific connection that determines how to perform authentication. |

  The following table describes common examples for OBO and app-only authorization:

  | Authorization | Actions |
  |---------------|---------|
  | OBO (per-user) | For user-specific actions like working with personal data, such as "get my emails", "find my account", or "check my order".|
  | App-only | For shared resources, automations, or impersonal operations, such as "Send today's health status to the operations channel". |

- To test the single user scenario in this guide, you only need your Azure account credentials. Testing this scenario happens through the internal chat interface integrated with your agent workflow in the Azure portal.

  To test the two-user scenario in this guide, you must complete the following tasks:

  - Set up two user accounts with different permissions to test the same OBO-enabled connection. For example, one user account might have access to a mailbox or website, while the other user account doesn't have access.

    You switch between these accounts when you try conversing with the agent through the *external* chat client outside the Azure portal.

  - To make the external chat client available, you must set up your logic app resource with [Easy Auth (App Service Authentication)](set-up-authentication-agent-workflows.md). This authentication and authorization flow also requires people to sign in and confirms their identity and permissions before they can access and chat with the agent.

    > [!NOTE]
    >
    > After you set up your logic app with Easy Auth, the internal chat interface becomes unavailable on your workflow's Chat page. You must use the external chat client. Make sure to complete the single user test scenario and any other testing you want to do in the internal chat interface before you set up Easy Auth.

  For more information about authentication and authorization for agent workflows, see [Authentication and authorization in AI agent workflows](agent-workflows-concepts.md#authentication-and-authorization).

## Limitations and known issues

- OBO authorization is currently available only for managed connector actions that work with Microsoft services and systems. These connectors must also support delegated access and per-user connections, for example, Microsoft 365, Microsoft SharePoint, and Microsoft Graph.

  Per-user connections have the following criteria:

  - The connection must support access from a specific user account.
  - Each user must sign in to create a connection.
  - Each user's credentials are used for all operations.
  - If necessary, tenant administrator consent might be required.

- You can't convert existing app-only connections into per-user connections. You must create new connections that enable the per-user connection option.

  If the per-user connection option doesn't appear on the connection information pane, check the following reasons:

  - If the connection requires an authentication type, make sure to select the Microsoft Entra ID option if available.

  - You might be editing an app-only connection, so you must create a new connection.

- In the designer, connector actions in agent tools currently don't have a user-friendly way to show they're set up for per-user connections.

  To learn whether a connection action is set up for per-user connections, follow these steps:

  1. On the designer, in the agent tool, select the connector action.

  1. On the action's information pane, at the bottom, select **Change connection**, then select **Add new**.

  On the **Create connection** pane, if the **Create as per-user connection?** box appears selected, then the action uses per-user connections.

- The signed-in user's identity currently exists only to validate connection creation validation. At runtime, this identity isn't available to other users.

## Best practices

The following table describes best practices to consider for OBO flow scenarios:

| Concept | Description |
|---------|-------------|
| Mixed identity patterns | Set up OBO authorization for read-only operations. Use app-only authorization for write operations with explicit confirmation. |
| Clear feedback | Instruct the agent to briefly summarize permission errors and suggest remediation like `You might not have access to this mailbox.` |
| Auditing and logging | Track and analyze the tools that run and the identities they use by reviewing the workflow run history and metrics. |

## Part 1 - Set up OBO flow on tool actions

To use OBO, an agent tool must use at least one managed connector action that supports delegated permissions and per-user connections. For example, Azure Logic Apps provides the **Office 365 Outlook** managed connector with actions that require user sign in with a work or school account.

The following steps show how to set up OBO authorization after you select an OBO-supported connector action to create an agent tool:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and conversational agent workflow, if not already open.

1. On the designer, in the agent, complete the following tasks:

   - Follow the [general steps](create-conversational-agent-workflows.md#create-tool-weather) to create an agent tool by selecting an OBO-supported managed connector action.

      This example uses the **Office 365 Outlook** action named **Get emails (V3)**.

1. Choose one of the following steps to create a connection that uses OBO:

   - If you don't have existing connections, on the **Create connection** pane, provide any required connection details.

   - If you have existing connections, you must still create a new connection that uses OBO.

     1. Go to the bottom of the action information pane, and select **Change connection**.

     1. On the **Change connection** pane, select **Add new**.

1. On the **Create connection** pane, select **Create as per-user connection?**

   :::image type="content" source="media/set-up-on-behalf-of-user-flow/create-per-user-connection.png" alt-text="Screenshot shows workflow designer, Get emails (V3) action, and connection pane with selected option for Create as per-user connection." lightbox="media/set-up-on-behalf-of-user-flow/create-per-user-connection.png":::

   > [!TIP]
   >
   > If the per-user connection box doesn't appear, and the connection requires an authentication type, set the authentication type to Microsoft Entra ID, if available.

1. Sign in with your user account and complete the consent flow.

1. If the connector action's information pane doesn't automatically open, select the connector action on the designer.

1. Provide any required information for the connector action.

   This example keeps the following default parameter values:

   | Parameter | Value | Description |
   |-----------|-------|-------------|
   | **Folder** | **Inbox** | The folder where to get emails. |
   | **Fetch Only Unread Messages** | **Yes** | Whether or not to get only unread emails. |
   | **Top** | `10` | The limit on the number of emails to get. |

   For example:

   :::image type="content" source="media/set-up-on-behalf-of-user-flow/get-emails-action.png" alt-text="Screenshot shows workflow designer, Get emails (V3) action selected, and action information pane with setup details." lightbox="media/set-up-on-behalf-of-user-flow/get-emails-action.png":::

1. On the designer, select the tool's title bar to open the tool's information pane. Complete the following tasks if you're following along with the example:

   1. On the information pane, select the tool's default name. Change the name to `Get 10 latest emails`.

   1. In the **Description** box, enter a concise but useful tool description that describes the purpose and guidance about the data that the tool works on.

      The tool description helps the agent choose the correct tool when fulfilling requested tasks.

      This example uses `Gets the 10 most recent emails from the Inbox for the signed-in user.`

      For example:

      :::image type="content" source="media/set-up-on-behalf-of-user-flow/tool-setup.png" alt-text="Screenshot shows workflow designer, Tool action selected, and tool information pane with setup details." lightbox="media/set-up-on-behalf-of-user-flow/tool-setup.png":::

1. When you're done, save your workflow.

## Part 2 - Test OBO flow with one user

The first time when the agent calls a tool that runs an action set up with per-user connections, the chat user gets an authentication prompt to sign in with their credentials. After the user signs in, reauthentication is required for later calls to the same tool with the same per-user connection.

The following steps describe how to confirm that your OBO flow setup works as expected:

1. On the designer toolbar or workflow sidebar menu, select **Chat**.

   The chat interface page opens so you can send prompts and requests to the agent.

1. In the chat interface, ask a question to test the agent tool action.

   This example asks the following question: `What unread emails do I have?`

   If the agent is calling the tool for the first time, the chat interface prompts you to sign in for authentication, for example:

   :::image type="content" source="media/set-up-on-behalf-of-user-flow/chat-sign-in-prompt.png" alt-text="Screenshot shows internal chat interface with test question and authentication prompt." lightbox="media/set-up-on-behalf-of-user-flow/chat-sign-in-prompt.png":::

1. Sign in with your credentials.

   The chat interface now shows that authentication successfully completed, for example:

   :::image type="content" source="media/set-up-on-behalf-of-user-flow/chat-authentication-success.png" alt-text="Screenshot shows internal chat interface with successful authentication message." lightbox="media/set-up-on-behalf-of-user-flow/chat-authentication-success.png":::

   The agent now returns a summary with unread emails in the chat interface.

## Part 3 - Test OBO flow with two different users

After you test your OBO flow with a single user, try testing with two users that have different permissions. Before you start, make sure to meet the [prerequisites for the two-user test scenario](#prerequisites).

1. Follow the [general steps](set-up-authentication-agent-workflows.md#external-chat-client) to open the external chat client  outside the Azure portal, 

1. In the chat interface, start a session as a user with permissions, and ask the agent to perform a task that requires authorization.

   This example asks the same question from the single-user scenario: `What unread emails do I have?`

   If you previously signed in from the single user scenario, you won't get the authentication prompt again. In this case, confirm that the agent tool successfully runs and that the chat interface returns the expected results. If not, the chat interface prompts you to sign in for authentication.

1. Sign out and try the same question as the user without permissions.

   In this case, after you try to sign in, your authentication attempt fails.

## Troubleshoot problems during OBO testing

The following table describes common problems you might encounter when you set up OBO, possible causes, and actions you can take:

| Problem or error | Likely cause | Action |
|------------------|--------------|--------|
| **401 Unauthorized** or **403 Forbidden** | Confirm that the connection uses delegated permissions and that the user has access to the resource. Check any conditional access policies. |
| **429 Too many requests** | Also known as *throttling* or *rate limiting*. Add an exponential interval between request retries or ask the user to narrow the request or get more specific. For more information, see [Handle errors and exceptions in Azure Logic Apps](error-exception-handling.md#retry-policies). |
| Consent or scope mismatch | Confirm that the requested scopes match the operation. Recreate the connection if scopes changed. |
| Mixed identity confusion | Check the connections that the agent tools use. Make sure to clearly label delegated permission and app-only connections. |
| Token audience (`aud`) errors | Confirm that the access token is issued for the correct resource if you use a custom client. |

## Related content

- [Set up Easy Auth (App Service Authentication) for agent workflows](set-up-authentication-agent-workflows.md)
- [Authentication and authorization in AI agent workflows](agent-workflows-concepts.md#authentication-and-authorization)
