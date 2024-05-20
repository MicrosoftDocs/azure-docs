---
title: What is Informatica Intelligent Data Management Cloud?
description: Learn about using the Informatica Intelligent Data Management Cloud - Azure Native ISV Service.

ms.topic: overview
ms.date: 04/02/2024

---

# What is Informatica Intelligent Data Management Cloud (Preview)- Azure Native ISV Service?

Azure Native ISV Services enable you to easily provision, manage, and tightly integrate independent software vendor (ISV) software and services on Azure. This Azure Native ISV Service is developed and managed by Microsoft and Informatica.

You can find Informatica Intelligent Data Management Cloud (Preview) - Azure Native ISV Service in the [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Dynatrace.Observability%2Fmonitors) or get it on [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/dynatrace.dynatrace_portal_integration?tab=Overview).

Use this offering to manage your Informatica organization as an Azure Native ISV Service. You can easily run and manage Informatica Organizations and advanced serverless environments as you need and get started through Azure Clients.

You can set up the Informatica organization through a resource provider named `Informatica.DataManagement`. You create and manage the billing, resource creation, and authorization of Informatica resources through the Azure Clients. Informatica owns and runs the Software as a Service (SaaS) application including the Informatica organizations created.

Here are the key capabilities provided by the Informatica integration:

- **Onboarding** of Informatica Intelligent Data Management Cloud (IDMC)  as an integrated service on Azure.
- **Unified billing** of Informatica through Azure Marketplace.
- **Single-Sign on to Informatica** - No separate sign-up needed from Informatica's IDMC portal.
- **Create advanced serverless environments** - Ability to create Advanced Serverless Environments from Azure Clients.

## Prerequisites for Informatica

Here are the prerequisites to set up Informatica Intelligent Data Management Cloud.

### Subscription Owner

The Informatica organization must be set up by users who have _Owner_ or _Contributor_ access on the Azure subscription. Ensure you have the appropriate _Owner_ or _Contributor_ access before starting to set up an organization.

### User Consent for apps is registered

For single sign-on, the Tenant Admin would need to enable _Allow User Consent for apps_ for Informatica Entra application in Enterprise Application Consent and permissions pane.

## Find Informatica in the Azure Marketplace

1. Navigate to the Azure Marketplace page.

1. Search for _Informatica_ listed.

1. In the plan overview pane, select the **Subscribe**. The **Create an Informatica organization** form opens in the working pane.

## Informatica resources

- For more information about Informatica Intelligent Data Management Cloud, see [Informatica products](https://www.informatica.com/products.html).
- For information about how to get started on IDMC, see [Getting Started](https://docs.informatica.com/integration-cloud/data-integration/current-version/getting-started/preface.html).
- For more information about using IDMC to connect with Azure data services, see [data integration connectors](https://docs.informatica.com/integration-cloud/data-integration-connectors/current-version.html).
- For more information about Informatica in general, see the [Informatica documentation](https://docs.informatica.com/).

## Next steps

- To create an instance of Informatica Intelligent Data Management Cloud - Azure Native ISV Service, see [QuickStart: Get started with Informatica](informatica-create.md).
<!-- 
- Get started with Apache Airflow on Astro – An Azure Native ISV Service on

fix  links when marketplace links work.

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/informatica.informaticaPLUS%2FinformaticaDeployments)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/f5-networks.f5-informatica-for-azure?tab=Overview) 
-->
