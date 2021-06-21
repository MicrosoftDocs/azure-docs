---
title: Azure Sentinel Connector documentation | Microsoft Docs
description:  Get to know the details of the Azure Sentinel Logic Apps connector.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/17/2021
ms.author: yelevin
---
# Azure Sentinel Connector

## Authentication

Triggers and actions in the Azure Sentinel connector can operate on behalf of any identity that has the necessary permissions (read and/or write) on the relevant workspace. The connector supports multiple identity types:

- [Managed identity (preview)](authenticate-playbooks-to-sentinel.md#authenticate-with-managed-identity)
- [Azure AD user](authenticate-playbooks-to-sentinel.md#authenticate-as-an-azure-ad-user)
- [Service principal (Azure AD application)](authenticate-playbooks-to-sentinel.md#authenticate-as-a-service-principal-azure-ad-application)

### Permissions required

| Roles / Connector components | Triggers | "Get" actions | Update incident,<br>add a comment |
| ------------- | :-----------: | :------------: | :-----------: |
| **[Azure Sentinel Reader](/azure/role-based-access-control/built-in-roles#azure-sentinel-reader)** | &#10003; | &#10003; | &#10007; |
| **Azure Sentinel [Responder](/azure/role-based-access-control/built-in-roles#azure-sentinel-responder)/[Contributor](/azure/role-based-access-control/built-in-roles#azure-sentinel-contributor)** | &#10003; | &#10003; | &#10003; |
| 

[Learn more about permissions in Azure Sentinel](/azure/sentinel/roles).

[Learn how to use the different authentication options](authenticate-playbooks-to-sentinel.md).

## Known issues and limitations

### Cannot trigger a Logic App called by an Azure Sentinel trigger using the "Run Trigger" button

A user cannot use the **Run trigger** button on the **Overview** blade of the **Logic Apps** service to trigger an Azure Sentinel playbook.

Azure Logic Apps are triggered by a POST REST call, whose body is the input for the trigger. Logic Apps that start with Azure Sentinel triggers expect to see the content of an Azure Sentinel **alert** or **incident** in the body of the call. When the call comes from the Logic Apps Overview blade, the body of the call is empty, and therefore an error is generated.

These are the only proper ways to trigger Azure Sentinel playbooks:

- Manual trigger in Azure Sentinel
- Automated response of an analytics rule (directly or through an automation rule) in Azure Sentinel
- Use "Resubmit" button in an existing Logic Apps run blade
- [Call the Logic Apps endpoint directly](/azure/logic-apps/logic-apps-http-endpoint#call-logic-app-through-endpoint-url) (attaching an alert/incident as the body)

### Updating the same incident in parallel *For each* loops

*For each* loops are set by default to run in parallel, but can be easily [set to run sequentially](/azure/logic-apps/logic-apps-control-flow-loops#foreach-loop-sequential). If a *for each* loop might update the same Azure Sentinel incident in separate iterations, it should be configured to run sequentially.

### Restoring alert's original query is currently not supported via Logic Apps

Usage of the **Azure Monitor Logs connector** to retrieve the events captured by the scheduled alert analytics rule is not consistently reliable.

- Azure Monitor Logs do not support the definition of a custom time range. Restoring the exact same query results requires defining the exact same time range as in the original query.
- Alerts may be delayed in appearing in the Log Analytics workspace after the rule triggers the playbook.

## Available resources

### Azure Sentinel docs
- [Advance automation with playbooks](/azure/sentinel/automate-responses-with-playbooks)
- [Tutorial: Use playbooks with automation rules in Azure Sentinel](/azure/sentinel/tutorial-respond-threats-playbook)

### Azure Sentinel References
- [Azure Sentinel GitHub templates gallery](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks)
- [Azure Sentinel API reference](/rest/api/securityinsights)

### Azure Logic Apps

- [Scenarios, examples and walkthroughs for Azure Logic Apps](/azure/logic-apps/logic-apps-examples-and-scenarios)
- [Logic Apps expressions](/azure/logic-apps/workflow-definition-language-functions-reference)
