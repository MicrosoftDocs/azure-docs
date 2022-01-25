---
title: Built-in operations versus Azure connectors in Standard
description: Learn the differences between built-in operations and Azure connectors for Standard logic apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 01/20/2022

# As a developer, I want to understand the differences between built-in and Azure connectors in Azure Logic Apps (Standard).
---

# Differences between built-in operations and Azure connectors in Azure Logic Apps (Standard)

When you create a **Logic App (Standard)** resource and a stateful workflow, the designer groups available triggers and actions into categories named **Built-in** and **Azure**. For stateless workflows, only the **Built-in** category is available. Azure connectors are the same category as the [*managed connectors*](managed.md) that you can use in **Logic App (Consumption)** workflows. These connectors run in shared connector clusters in the Azure cloud and are managed by Microsoft. The Azure Logic Apps engine runs in a different cluster that's separate from the managed connector clusters. If your workflow has to invoke a managed connector operation, the Azure Logic Apps engine makes a call to the connector in the connector clusters. In turn, the connector might call the backend target service, which can be Office 365, Salesforce, and so on.

Built-in connectors are also called service provider connectors. They are implemented as custom extensions of Azure Functions. Customers can create their own service provider connectors as well.  One crucial difference from Azure connectors, is that the Built-in connectors run in the same cluster as the logic app engine.  


<a name="consideration-with-vnet"></a>

## Consideration regarding VNet Integration

Built-In connectors run along side Logic App host runtime and can leverage VNet Integration capabilities to access resources over a Private Network.

But Azure Connectors run in shared managed connector environment cannot leverage VNET integration benefits. Thought VNET integration is enabled on Logic App, for Azure connectors to work, we must whitelist the [managed connector outbound IP addresses](https://docs.microsoft.com/connectors/common/outbound-ip-addresses) for the logic app region. In another word, if the subnet used in VNet Integration has any network security group policy (NSG) and/or firewall, they need to allow outbound connectivity to the managed connector outbound IP addresses.

<a name="consideration-with-backend-whitelist"></a>

## Consideration regarding backend whitelisting

For Built-in connectors, the backend (such as SQL server) needs to whitelist the outbound IP addresses of the logic app. These IP addresses can be found in the Properties blade of the logic app. 

For Built-in connectors, the backend (such as SQL server) needs to whitelist [managed connector outbound IP addresses](https://docs.microsoft.com/connectors/common/outbound-ip-addresses) of the logic app region. These IP addresses can be found in the Properties blade of the logic app. 

<a name="consideration-with-authentication"></a>

## Consideration regarding authentication

There is some difference depending on whether you are authoring the workflow from local Visual Studio Code or from Azure portal.

1. VS Code: 

   1. Built-In connectors connection strings or credentials will be stored in local.settings.json file 

   1. Azure connector API connections are created during workflow design and stored in the cloud backend. Bearer token will be issued for seven days for executing Azure connectors in local environment. Bearer token will be stored in local.settings.json file. 

1. Azure portal:

   1. Built-in connectors connection strings or credentials or connection params will be stored in app configuration settings

   1. Azure connectors will be authenticated using either Managed Identity or [Azure AD app registration having the access policies enabled on the Azure API connections](https://docs.microsoft.com/azure/logic-apps/azure-arc-enabled-logic-apps-create-deploy-workflows?tabs=azure-cli#set-up-connection-authentication).


## Next steps

- [Logic Apps Anywhere: Networking possibilities with Logic Apps (single-tenant)](https://techcommunity.microsoft.com/t5/integrations-on-azure/logic-apps-anywhere-networking-possibilities-with-logic-app/ba-p/2105047)

- [Azure Logic Apps Running Anywhere: Built-in connector extensibility](https://techcommunity.microsoft.com/t5/integrations-on-azure-blog/azure-logic-apps-running-anywhere-built-in-connector/ba-p/1921272)
