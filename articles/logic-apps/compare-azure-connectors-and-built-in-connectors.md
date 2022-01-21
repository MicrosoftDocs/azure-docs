---
title: Compare Azure connectors and Built-in connectors
description: Understand the difference between Azure connectors and Built-in connectors.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 01/20/2022

# As a developer, I want to Understand the difference between Azure connectors and Built-in connectors
---

# Azure connectors versus Built-in connectors

Azure connectors are also called managed connectors. They run in the shared connector clusters in Azure cloud and they are managed by Microsoft. Note that the logic app engine runs in a different cluster from the managed connector clusters. When there is a need to invoke a managed connector, the logic app engine will make a call to the connector in the connector clusters, and the connector in turn may call the backend service such as Azure SQL, Salesforce etc. 

Built-in connectors are also called service provider connectors. They are implemented as custom extentions of Azure Functions. Customers can create their own servce provider connectors as well.  One crucial difference from Azure connectors, is that the Built-in connectors run in the same cluster as the logic app engine.  


<a name="consideration-with-vnet"></a>

## Consideration with regard to VNet Integration

Built-In connectors run along side Logic App host runtime and can leveraged VNet Integration capabilities to access resources over a Private Network.

But Azure Connectors run in shared managed connector environment cannot leverage VNET integration benefits. Thought VNET integration is enabled on Logic App, for Azure connectors to work, we must whitelist the [managed connector outbound IP addresses](https://docs.microsoft.com/connectors/common/outbound-ip-addresses) for the logic app region. In another word, if the subnet used in VNet Integation has any network security group policy (NSG) and/or firewall, they need to allow outbound connectivity to the managed connector outbound IP addresses.

<a name="consideration-with-backend-whitelist"></a>

## Consideration with regard to bckend whitelisting

For Built-in connectors, the backend (such as SQL server) needs to whitelist the outbound IP addresses of the logic app. These IP addresses can be found in the Properties blade of the logic app. 

For Built-in connectors, the backend (such as SQL server) needs to whitelist [managed connector outbound IP addresses](https://docs.microsoft.com/connectors/common/outbound-ip-addresses) of the logic app region. These IP addresses can be found in the Properties blade of the logic app. 

<a name="consideration-with-authentication"></a>

## Consideration with regard to authentication

There is some difference depending on whether you are authoring the workflow from local Visual Studio Code or from Azure portal.

1. VS Code: 

   1. Built-In connectors connection strings or credentials will be stored in local.settings.json file 

   1. Azure connector API connections need to be created in workflows and stored in the cloud backend. Bearer token will be issued for 7 days for executing Azure connectors in local envirnment. Bearer token will be stored in local.settings.json file. 

1. Azure Portal:

   1. Built-in connectors connection strings or credentials or connection params will be stored in app configuration settings

   1. Azzure connectors will be authenticated using either Managed Identity or [Azure AD app registation having the accesspolicies enabled on the Azure API connections](https://docs.microsoft.com/azure/logic-apps/azure-arc-enabled-logic-apps-create-deploy-workflows?tabs=azure-cli#set-up-connection-authentication).


## Next steps

- [Logic Apps Anywhere: Networking possibilities with Logic Apps (single-tenant)](https://techcommunity.microsoft.com/t5/integrations-on-azure/logic-apps-anywhere-networking-possibilities-with-logic-app/ba-p/2105047)

- [Azure Logic Apps Running Anywhere: Built-in connector extensibility](https://techcommunity.microsoft.com/t5/integrations-on-azure-blog/azure-logic-apps-running-anywhere-built-in-connector/ba-p/1921272)
