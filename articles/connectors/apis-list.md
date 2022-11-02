---
title: Azure Logic Apps connectors overview
description: Overview about connectors for workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 10/25/2022
ms.custom: contperf-fy21q4
---

# About connectors in Azure Logic Apps

When you build workflows using Azure Logic Apps, you can use *connectors* to help you quickly and easily access data, events, and resources in other apps, services, systems, protocols, and platforms - often without writing any code. A connector provides prebuilt operations that you can use as steps in your workflows. Azure Logic Apps provides hundreds of connectors that you can use. If no connector is available for the resource that you want to access, you can use the generic HTTP operation to communicate with the service, or you can [create a custom connector](#custom-connectors-and-apis).

This overview provides a high-level introduction to connectors and how they generally work.

## What are connectors?

Technically, many connectors provide a proxy or a wrapper around an API that the underlying service uses to communicate with Azure Logic Apps. This connector provides operations that you use in your workflows to perform tasks. An operation is available either as a *trigger* or *action* with properties you can configure. Some triggers and actions also require that you first [create and configure a connection](#connection-configuration) to the underlying service or system, for example, so that you can authenticate access to a user account. For more overview information, review [Connectors overview for Azure Logic Apps, Microsoft Power Automate, and Microsoft Power Apps](/connectors).

 For information about the more popular and commonly used connectors in Azure Logic Apps, review the following documentation:

* [Connectors reference for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
* [Built-in connectors for Azure Logic Apps](built-in.md)
* [Managed connectors in Azure Logic Apps](managed.md)
* [Pricing and billing models in Azure Logic Apps](../logic-apps/logic-apps-pricing.md)
* [Azure Logic Apps pricing details](https://azure.microsoft.com/pricing/details/logic-apps/)

### Triggers

A *trigger* specifies the event that starts the workflow and is always the first step in any workflow. Each trigger also follows a specific firing pattern that controls how the trigger monitors and responds to events. Usually, a trigger follows the *polling* pattern or *push* pattern, but sometimes, a trigger is available in both versions.

- *Polling triggers* regularly check a specific service or system on a specified schedule to check for new data or a specific event. If new data is available, or the specific event happens, these triggers create and run a new instance of your workflow. This new instance can then use the data that's passed as input.

- *Push triggers* listen for new data or for an event to happen, without polling. When new data is available, or when the event happens, these triggers create and run a new instance of your workflow. This new instance can then use the data that's passed as input.

For example, you might want to build a workflow that does something when a file is uploaded to your FTP server. As the first step in your workflow, you can use the FTP trigger named **When a file is added or modified**, which follows the polling pattern. You can then specify a schedule to regularly check for upload events.

A trigger also passes along any inputs and other required data into your workflow where later actions can reference and use that data throughout the workflow. For example, suppose you want to use Office 365 Outlook trigger named **When a new email arrives** to start a workflow when you get a new email. You can configure this trigger to pass along the content from each new email, such as the sender, subject line, body, attachments, and so on. Your workflow can then process that information by using other actions.

### Actions

An *action* is an operation that follows the trigger and performs some kind of task in your workflow. You can use multiple actions in your workflow. For example, you might start the workflow with a SQL trigger that detects new customer data in an SQL database. Following the trigger, your workflow can have a SQL action that gets the customer data. Following the SQL action, your workflow can have a different action that processes the data.

## Connector categories

In Azure Logic Apps, most triggers and actions are available in either a *built-in* version or *managed connector* version. A few triggers and actions are available in both versions. The versions available depend on whether you create a *Consumption* logic app that runs in multi-tenant Azure Logic Apps, or a *Standard* logic app that runs in single-tenant Azure Logic Apps.

* [Built-in connectors](built-in.md) run natively on the Azure Logic Apps runtime.

* [Managed connectors](managed.md) are deployed, hosted, and managed by Microsoft. These connectors provide triggers and actions for cloud services, on-premises systems, or both.

  In a *Standard* logic app, all managed connectors are organized as **Azure** connectors. However, in a *Consumption* logic app, managed connectors are organized as **Standard** or **Enterprise**, based on pricing level.

For more information about logic app types, review [Resource types and host environment differences](../logic-apps/logic-apps-overview.md#resource-environment-differences).

<a name="connection-configuration"></a>

## Connection configuration

In Consumption logic apps, before you can create or manage logic apps and their connections, you need specific permissions. For more information about these permissions, review [Secure operations - Secure access and data in Azure Logic Apps](../logic-apps/logic-apps-securing-a-logic-app.md#secure-operations).

Before you can use a managed connector's triggers or actions in your workflow, many connectors require that you first create a *connection* to the target service or system. To create a connection from within the logic app workflow designer, you have to authenticate your identity with account credentials and sometimes other connection information. For example, before your workflow can access and work with your Office 365 Outlook email account, you must authorize a connection to that account. For some built-in connectors and managed connectors, you can [set up and use a managed identity for authentication](../logic-apps/create-managed-service-identity.md#triggers-actions-managed-identity), rather than provide your credentials.

Although you create connections within a workflow, these connections are actually separate Azure resources with their own resource definitions. To review these connection resource definitions, follow these steps based on whether you have a Consumption or Standard logic app:

* Consumption: To view these connections in the Azure portal, review [View connections for Consumption logic apps in the Azure portal](../logic-apps/manage-logic-apps-with-azure-portal.md#view-connections).

  To view and manage these connections in Visual Studio, review [Manage Consumption logic apps with Visual Studio](../logic-apps/manage-logic-apps-with-visual-studio.md), and download your logic app from Azure into Visual Studio. For more information about connection resource definitions for Consumption logic apps, review [Connection resource definitions](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md#connection-resource-definitions).

* Standard: To view these connections in the Azure portal, review [View connections for Standard logic apps in the Azure portal](../logic-apps/create-single-tenant-workflows-azure-portal.md#view-connections).

  To view and manage these connections in Visual Studio Code, review [View your logic app in Visual Studio Code](../logic-apps/create-single-tenant-workflows-visual-studio-code.md#manage-deployed-apps-vs-code). The **connections.json** file contains the required configuration for the connections created by connectors.

<a name="connection-security-encryption"></a>

### Connection security and encryption

Connection configuration details, such as server address, username, and password, credentials, and secrets are [encrypted and stored in the secured Azure environment](../security/fundamentals/encryption-overview.md). This information can be used only in logic app resources and by clients who have permissions for the connection resource, which is enforced using linked access checks. Connections that use Azure Active Directory Open Authentication (Azure AD OAuth), such as Office 365, Salesforce, and GitHub, require that you sign in, but Azure Logic Apps stores only access and refresh tokens as secrets, not sign-in credentials.

Established connections can access the target service or system for as long as that service or system allows. For services that use Azure AD OAuth connections, such as Office 365 and Dynamics, Azure Logic Apps refreshes access tokens indefinitely. Other services might have limits on how long Logic Apps can use a token without refreshing. Some actions, such as changing your password, invalidate all access tokens.

> [!TIP]
> If your organization doesn't permit you to access specific resources through connectors in Azure Logic Apps, you can [block the capability to create such connections](../logic-apps/block-connections-connectors.md) using [Azure Policy](../governance/policy/overview.md).

For more information about securing logic apps and connections, review [Secure access and data in Azure Logic Apps](../logic-apps/logic-apps-securing-a-logic-app.md).

<a name="firewall-access"></a>

### Firewall access for connections

If you use a firewall that limits traffic, and your logic app workflows need to communicate through that firewall, you have to set up your firewall to allow access for both the [inbound](../logic-apps/logic-apps-limits-and-config.md#inbound) and [outbound](../logic-apps/logic-apps-limits-and-config.md#outbound) IP addresses used by the Azure Logic Apps platform or runtime in the Azure region where your logic app workflows exist. If your workflows also use managed connectors, such as the Office 365 Outlook connector or SQL connector, or use custom connectors, your firewall also needs to allow access for *all* the [managed connector outbound IP addresses](/connectors/common/outbound-ip-addresses#azure-logic-apps) in your logic app's Azure region. For more information, review [Firewall configuration](../logic-apps/logic-apps-limits-and-config.md#firewall-configuration-ip-addresses-and-service-tags).

## Custom connectors and APIs

In Consumption logic apps that run in multi-tenant Azure Logic Apps, you can call Swagger-based or SOAP-based APIs that aren't available as out-of-the-box connectors. You can also run custom code by creating custom API Apps. For more information, review the following documentation:

* [Swagger-based or SOAP-based custom connectors for Consumption logic apps](../logic-apps/custom-connector-overview.md#custom-connector-consumption)

* Create a [Swagger-based](/connectors/custom-connectors/define-openapi-definition) or [SOAP-based](/connectors/custom-connectors/create-register-logic-apps-soap-connector) custom connector, which makes these APIs available to any Consumption logic app in your Azure subscription. To make your custom connector public for anyone to use in Azure, [submit your connector for Microsoft certification](/connectors/custom-connectors/submit-certification).

* [Create custom API Apps](../logic-apps/logic-apps-create-api-app.md)

In Standard logic apps that run in single-tenant Azure Logic Apps, you can create natively running service provider-based custom built-in connectors that are available to any Standard logic app. For more information, review the following documentation:

* [Service provider-based custom built-in connectors for Standard logic apps](../logic-apps/custom-connector-overview.md#custom-connector-standard)

* [Create service provider-based custom built-in connectors for Standard logic apps](../logic-apps/create-custom-built-in-connector-standard.md)

## ISE and connectors

For workflows that need direct access to resources in an Azure virtual network, you can create a dedicated [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md) where you can build, deploy, and run your workflows on dedicated resources. For more information about creating ISEs, review [Connect to Azure virtual networks from Azure Logic Apps](../logic-apps/connect-virtual-network-vnet-isolated-environment.md).

Custom connectors created within an ISE don't work with the on-premises data gateway. However, these connectors can directly access on-premises data sources that are connected to an Azure virtual network hosting the ISE. So, logic apps in an ISE most likely don't need the data gateway when communicating with those resources. If you have custom connectors that you created outside an ISE that require the on-premises data gateway, logic apps in an ISE can use those connectors.

In the workflow designer, when you browse the built-in connectors or managed connectors that you want to use for logic apps in an ISE, the **CORE** label appears on built-in connectors, while the **ISE** label appears on managed connectors that are designed to work with an ISE.

:::row:::
    :::column:::
        ![Example CORE connector](./media/apis-list/example-core-connector.png)
        \
        \
        **CORE**
        \
        \
        Built-in connectors with this label run in the same ISE as your logic apps.
    :::column-end:::
    :::column:::
        ![Example ISE connector](./media/apis-list/example-ise-connector.png)
        \
        \
        **ISE**
        \
        \
        Managed connectors with this label run in the same ISE as your logic apps. 
        \
        \
        If you have an on-premises system that's connected to an Azure virtual network, an ISE lets your workflows directly access that system without using the [on-premises data gateway](../logic-apps/logic-apps-gateway-connection.md). Instead, you can either use that system's **ISE** connector if available, an HTTP action, or a [custom connector](#custom-connectors-and-apis).
        \
        \
        For on-premises systems that don't have **ISE** connectors, use the on-premises data gateway. To find available ISE connectors, review [ISE connectors](#ise-and-connectors).
    :::column-end:::
    :::column:::
        ![Example non-ISE connector](./media/apis-list/example-multi-tenant-connector.png)
        \
        \
        No label
        \
        \
        All other connectors without a label, which you can continue to use, run in the global, multi-tenant Logic Apps service.
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

## Known issues

The following table includes known issues for Logic Apps connectors.

| Error message| Description | Resolution |
|--------------|-------------|------------|
| `Error: BadGateway. Client request id: '{GUID}'` | This error results from updating the tags on a logic app where one or more connections don't support Azure Active Directory (Azure AD) OAuth authentication, such as SFTP ad SQL, breaking those connections. | To prevent this behavior, avoid updating those tags. |
||||

## Next steps

> [!div class="nextstepaction"]
> [Create custom APIs you can call from Logic Apps](../logic-apps/logic-apps-create-api-app.md)
