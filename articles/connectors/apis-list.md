---
title: Connectors for Azure Logic Apps
description: Overview about using connectors to build automated workflows with Azure Logic Apps. Learn how different triggers, actions, and connectors work.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, logicappspm, azla
ms.topic: conceptual
ms.date: 04/20/2021
ms.custom: contperf-fy21q4
---

# Connectors for Azure Logic Apps

In Azure Logic Apps, *connectors* help you quickly access data, events, and other resources from other apps, services, systems, protocols, and platforms. When you use connectors, you can build logic app workflows that use, process, and integrate information across cloud-based, on-premises, and hybrid environments - often without having to write any code.

You can choose from hundreds of connectors to use in your workflows. As a result, this documentation focuses on some popular and commonly used connectors for Logic Apps. For complete information about connectors across Logic Apps, Microsoft Power Automate, and Microsoft Power Apps, review the [Connectors documentation](/connectors). For information on pricing, review the [Logic Apps pricing model](../logic-apps/logic-apps-pricing.md), and [Logic Apps pricing details](https://azure.microsoft.com/pricing/details/logic-apps/).

> [!NOTE]
> To integrate your workflow with a service or API that doesn't have a connector, you can either call 
> the service over a protocol, such as HTTP, or [create a custom connector](#custom-apis-and-connectors).

## What are connectors?

Connectors provide *triggers* and *actions* that you use to perform tasks in your logic app's workflow. Each trigger and action has properties that you can configure. Some triggers and actions require that you [create and configure connections](#connection-configuration) so that your workflow can access a specific service or system.

### Triggers

A *trigger* specifies the event that starts the workflow and is always the first step in any workflow. Each trigger also follows a specific firing pattern that controls how the trigger monitors and responds to events. Usually, a trigger follows the *polling* pattern or *push* pattern, but sometimes, a trigger is available in both versions.

- *Polling triggers* regularly check a specific service or system on a specified schedule to check for new data or a specific event. If new data is available, or the specific event happens, these triggers create and run a new instance of your workflow. This new instance can then use the data that's passed as input.
- *Push triggers* listen for new data or for an event to happen, without polling. When new data is available, or when the event happens, these triggers create and run a new instance of your workflow. This new instance can then use the data that's passed as input.

For example, you might want to build a workflow that does something when a file is uploaded to your FTP server. As the first step in your workflow, you can use the FTP trigger named **When a file is added or modified**, which follows the polling pattern. You can then specify a schedule to regularly check for upload events.

A trigger also passes along any inputs and other required data into your workflow where later actions can reference and use that data throughout the workflow. For example, suppose you want to use Office 365 Outlook trigger named **When a new email arrives** to start a workflow when you get a new email. You can configure this trigger to pass along the content from each new email, such as the sender, subject line, body, attachments, and so on. Your workflow can then process that information by using other actions.

### Actions

An *action* is an operation that follows the trigger and performs some kind of task in your workflow. You can use multiple actions in your workflow. For example, you might start the workflow with a SQL trigger that detects new customer data in a SQL database. Following the trigger, your workflow can have a SQL action that gets the customer data. Following the SQL action, your workflow can have another action, not necessarily SQL, that processes the data.

## Connector categories

In Logic Apps, most triggers and actions are available in either a *built-in* version or *managed connector* version. A small number of triggers and actions are available in both versions. The versions available depend on whether you create a multi-tenant logic app or a single-tenant logic app, which is currently available only in [Logic Apps Preview](../logic-apps/logic-apps-overview-preview.md).

[Built-in triggers and actions](built-in.md) run natively on the Logic Apps runtime, don't require creating connections, and perform these kinds of tasks:

- [Run code in your workflows](built-in.md#run-code-from-workflows).
- [Organize and control your data](built-in.md#control-workflow).
- [Manage or manipulate data](built-in.md#manage-or-manipulate-data).

[Managed connectors](managed.md) are deployed, hosted, and managed by Microsoft. These connectors provide triggers and actions for cloud services, on-premises systems, or both. Managed connectors are available in these categories:

- [On-premises connectors](managed.md#on-premises-connectors) that help you access data and resources in on-premises systems.
- [Enterprise connectors](managed.md#enterprise-connectors) that provide access to enterprise systems.
- [Integration account connectors](managed.md#integration-account-connectors) that support business-to-business (B2B) communication scenarios.
- [Integration service environment (ISE) connectors](managed.md#ise-connectors) that are a small group of [managed connectors available only for ISEs](#ise-and-connectors).

## Connection configuration

Most connectors require that you first create a *connection* to the target service or system before you can use its triggers or actions in your workflow. To create a connection, you have to authenticate your identity with account credentials and sometimes other connection information. For example, before your workflow can access and work with your Office 365 Outlook email account, you must authorize a connection to that account.

### Connection security and encryption

For connectors that use Azure Active Directory (Azure AD) OAuth, such as Office 365, Salesforce, or GitHub, you must sign into the service where your access token is [encrypted](../security/fundamentals/encryption-overview.md) and securely stored in an Azure secret. Other connectors, such as FTP and SQL, require a connection that has configuration details, such as the server address, username, and password. These connection configuration details are also [encrypted and securely stored in Azure](../security/fundamentals/encryption-overview.md).

Established connections can access the target service or system for as long as that service or system allows. For services that use Azure AD OAuth connections, such as Office 365 and Dynamics, the Logic Apps service refreshes access tokens indefinitely. Other services might have limits on how long Logic Apps can use a token without refreshing. Some actions, such as changing your password, invalidate all access tokens.

Although you create connections from within a workflow, connections are separate Azure resources with their own resource definitions. To review these connection resource definitions, [download your logic app from Azure into Visual Studio](../logic-apps/manage-logic-apps-with-visual-studio.md). This method is the easiest way to create a valid, parameterized logic app template that's mostly ready for deployment.

> [!TIP]
> If your organization doesn't permit you to access specific resources through Logic Apps connectors, you can [block the capability to create such connections](../logic-apps/block-connections-connectors.md) using [Azure Policy](../governance/policy/overview.md).

<a name="firewall-access"></a>

### Firewall access for connections

If you use a firewall that limits traffic, and your logic app workflows need to communicate through that firewall, you have to set up your firewall to allow access for both the [inbound](../logic-apps/logic-apps-limits-and-config.md#inbound) and [outbound](../logic-apps/logic-apps-limits-and-config.md#outbound) IP addresses used by the Logic Apps service or runtime in the Azure region where your logic app workflows exist. If your workflows also use managed connectors, such as the Office 365 Outlook connector or SQL connector, or use custom connectors, your firewall also needs to allow access for *all* the [managed connector outbound IP addresses](../logic-apps/logic-apps-limits-and-config.md#outbound) in your logic app's Azure region. For more information, review [Firewall configuration](../logic-apps/logic-apps-limits-and-config.md#firewall-configuration-ip-addresses-and-service-tags).

## Recurrence behavior

Recurring built-in triggers, such as the [Recurrence trigger](connectors-native-recurrence.md), run natively on the Logic Apps runtime and differ from recurring connection-based triggers, such as the Office 365 Outlook connector trigger where you need to create a connection first.

For both kinds of triggers, if a recurrence doesn't specify a specific start date and time, the first recurrence runs immediately when you save or deploy the logic app, despite your trigger's recurrence setup. To avoid this behavior, provide a start date and time for when you want the first recurrence to run.

### Recurrence for built-in triggers

Recurring built-in triggers follow the schedule that you set, including any specified time zone. However, if a recurrence doesn't specify other advanced scheduling options, such as specific times to run future recurrences, those recurrences are based on the last trigger execution. As a result, the start times for those recurrences might drift due to factors such as latency during storage calls.

For more information, review the following documentation:

* [Schedule and run recurring automated tasks, processes, and workflows with Azure Logic Apps](../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md)
* [Create, schedule, and run recurring tasks and workflows with the Recurrence trigger](connectors-native-recurrence.md)
* [Troubleshooting recurrence issues](#recurrence-issues)

### Recurrence for connection-based triggers

In recurring connection-based triggers, such as Office 365 Outlook, the schedule isn't the only driver that controls execution. The time zone only determines the initial start time. Subsequent runs depend on the recurrence schedule, the last trigger execution, and other factors that might cause run times to drift or produce unexpected behavior, for example:

* Whether the trigger accesses a server that has more data, which the trigger immediately tries to fetch.
* Any failures or retries that the trigger incurs.
* Latency during storage calls.
* Not maintaining the specified schedule when daylight saving time (DST) starts and ends.
* Other factors that can affect when the next run time happens.

For more information, review the following documentation:

* [Schedule and run recurring automated tasks, processes, and workflows with Azure Logic Apps](../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md)
* [Troubleshooting recurrence issues](#recurrence-issues)

<a name="recurrence-issues"></a>

### Troubleshooting recurrence issues

To make sure that your workflow runs at your specified start time and doesn't miss a recurrence, especially when the frequency is in days or longer, try the following solutions:

* When DST takes effect, manually adjust the recurrence so that your workflow continues to run at the expected time. Otherwise, the start time shifts one hour forward when DST starts and one hour backward when DST ends. For more information and examples, review [Recurrence for daylight saving time and standard time](../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md#daylight-saving-standard-time).

* If you're using a **Recurrence** trigger, specify a time zone, a start date and time. In addition, configure specific times to run subsequent recurrences in the properties **At these hours** and **At these minutes**, which are available only for the **Day** and **Week** frequencies. However, some time windows might still cause problems when the time shifts.

* Consider using a [**Sliding Window** trigger](connectors-native-sliding-window.md) instead of a **Recurrence** trigger to avoid missed recurrences.

## Custom APIs and connectors

To call APIs that run custom code or aren't available as connectors, you can extend the Logic Apps platform by [creating custom API Apps](../logic-apps/logic-apps-create-api-app.md). You can also [create custom connectors](../logic-apps/custom-connector-overview.md) for any REST or SOAP-based APIs, which make those APIs available to any logic app in your Azure subscription. To make custom API Apps or connectors public for anyone to use in Azure, you can [submit connectors for Microsoft certification](/connectors/custom-connectors/submit-certification).

## ISE and connectors

For workflows that need direct access to resources in an Azure virtual network, you can create a dedicated [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md) where you can build, deploy, and run your workflows on dedicated resources. For more information about creating ISEs, review [Connect to Azure virtual networks from Azure Logic Apps](../logic-apps/connect-virtual-network-vnet-isolated-environment.md).

Custom connectors created within an ISE don't work with the on-premises data gateway. However, these connectors can directly access on-premises data sources that are connected to an Azure virtual network hosting the ISE. So, logic apps in an ISE most likely don't need the data gateway when communicating with those resources. If you have custom connectors that you created outside an ISE that require the on-premises data gateway, logic apps in an ISE can use those connectors.

In the Logic Apps Designer, when you browse the built-in triggers and actions or managed connectors that you want to use for logic apps in an ISE, the **CORE** label appears on built-in triggers and actions, while the **ISE** label appears on managed connectors that are specifically designed to work with an ISE.

:::row:::
    :::column:::
        ![Example CORE connector](./media/apis-list/example-core-connector.png)
        \
        \
        **CORE**
        \
        \
        Built-in triggers and actions with this label run in the same ISE as your logic apps.
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
        If you have an on-premises system that's connected to an Azure virtual network, an ISE lets your workflows directly access that system without using the [on-premises data gateway](../logic-apps/logic-apps-gateway-connection.md). Instead, you can either use that system's **ISE** connector if available, an HTTP action, or a [custom connector](connectors-overview.md#custom-apis-and-connectors).
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
> [Create custom APIs you can call from Logic Apps](/logic-apps/logic-apps-create-api-app)
