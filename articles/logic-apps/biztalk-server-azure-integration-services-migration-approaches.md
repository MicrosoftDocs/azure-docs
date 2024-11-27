---
title: 'Migration approaches: BizTalk Server to Azure Logic Apps'
description: Learn about migration strategies, planning, and best practices for moving from BizTalk Server to Azure Logic Apps.
services: logic-apps
ms.service: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: haroldcampos
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 11/04/2024
# Customer intent: As a BizTalk Server customer, I want to learn about migration options, planning considerations, and best practices for moving from BizTalk Server to Azure Logic Apps.
---

# Migration approaches for BizTalk Server to Azure Logic Apps

This guide covers migration strategies and resources along with planning considerations and best practices to help you deliver successful migration solutions.

> [!NOTE]
>
> For a migration overview and guide to choosing services in Azure for your migration, review the following documentation:
>
> - [Why migrate from BizTalk Server to Azure Logic Apps?](biztalk-server-to-azure-integration-services-overview.md)
> - [Choose the best integration service in Azure for your scenario](azure-integration-services-choose-capabilities.md)

## Strategy options

The following section describes various migration strategies along with their benefits and disadvantages:


### Big bang

A "big bang" or "direct changeover" is an approach that requires lots of planning and isn't recommended for organizations that are unfamiliar with Azure Logic Apps or that have large systems or solutions to migrate. When an organization implements a new technology stack, new learnings usually often result. By investing too early or too much, you won't have the opportunity to benefit from lessons learned and adjust without risking significant rework.

This approach might also take longer to reap or accrue value. If you've already completed some migration activities, but you haven't yet released them into production due to other pending or in-progress work, your migrated artifacts aren't generating value for your organization.

We recommend that you consider this approach only if you have small, low complexity BizTalk workloads, subject matter experts (SMEs) who know your BizTalk environment, and direct mappings between the BizTalk features that you currently use and Azure Logic Apps. Experience with Azure Logic Apps also considerably reduces the risks with following this approach.

### Iterative or wave based (Recommended)

This approach provides the opportunity for your organization to incrementally achieve value, but sooner than they might otherwise. Your project team can learn about the technology stack early by using retrospectives. For example, you can deploy an existing BizTalk interface or project to production and then learn about the solution's needs, which include management, scalability, operations, and monitoring. After you gain this knowledge, you can plan sprints to optimize existing capabilities or introduce new patterns that you can subsequently use in future work. 

Regardless of your approach, if you plan on moving to Azure Logic Apps or Azure in general, strongly consider refactoring your BizTalk Server solutions into serverless or cloud-native solutions before you decommission your server infrastructure. This choice is an excellent strategy if your organization wants to transform the business completely to the cloud.

BizTalk Server and Azure Logic Apps have different architectures. To further modernize your solutions, you can use Azure Integration Services to extend the capabilities in Azure Logic Apps that address core customer integration needs.

For a higher return on investment (ROI), we recommend that any BizTalk migration use the core native capabilities in Azure Logic Apps (Standard) as much as possible and extended with other Azure Integration Services as needed. This combination makes additional scenarios possible, for example:

- Cloud native hybrid capabilities with Azure Logic Apps (Standard) with hybrid deployment
- Stateful or stateless workflow capabilities in Azure Logic Apps (Standard)
- Native, built-in (in-app) mainframe and midranges integration with connectors in Azure Logic Apps (Standard)
- Pub-sub messaging using Azure Service Bus
- Advanced SOAP capabilities in Azure API Management

## Deliver a BizTalk migration project

To complete such a project, we recommend that you follow the iterative or wave-based approach and use the [Scrum process](https://www.scrum.org/). While Scrum doesn't include a Sprint Zero (Sprint 0) concept for pre-sprint activities, we recommend that you focus your first sprint on team alignment and technical discovery. After Sprint 0, follow the execution of multiple migration sprints and focus on releasing features towards a minimum viable product (MVP).

:::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/biztalk-gradual-migration.png" alt-text="Diagram showing migration waves.":::


### Sprint 0

During this sprint, we recommend that you execute BizTalk Server Environments Discovery with Waves Planning. Understanding the project's breadth and depth is critical for success. The following list includes the specific areas to address during Sprint 0:

| Area | Description |
|------|-------------|
| Discovery | Capture data about all your interfaces and applications so you can learn the number of interfaces and applications that you need to migrate. You also need to assign complexity to each interface or process. During this cataloging process, collect the following information to prioritize work: <br><br>- Adapters in use <br><br>- BizTalk Server features in use, such as Business Activity Monitoring, Business Rules Engine, EDI, and so on <br><br>- Custom code, such as expressions, maps, and pipeline components <br><br>- Message throughput <br><br>- Message sizes <br><br>- Dependencies <br><br>- Application and system dependencies |
| Architecture design | Create the high-level architecture to use as the focal point for the migration. This design includes elements that address high-level functional and non-functional needs. |
| Minimum viable product (MVP) definition | Define the first wave features. In other words, the processes that need support after you complete the first wave. |
| Initial migration backlog | Define the first wave features and their work items with technical elaboration. |


#### Discovery tools

To help you with migration discovery, you can use the Azure Integration Migrator command-line tool, also called the [BizTalk Migration tool](https://github.com/Azure/aimbiztalk), which is a Microsoft open-source project. This tool uses a phased approach to help you uncover useful insights and strategies for migrating your solutions to the cloud. We recommend using the migrator tool only for discovery and report generation. You might also want to consider using other products for discovery from partners who provide solutions in this space.

For another way to generate an inventory with BizTalk Server elements, you can use [The BizTalk Documenter](https://github.com/mbrimble/biztalkdocumenter), which is developed by Mark Brimble. This tool works with BizTalk Server 2020, despite stating that only BizTalk Server 2016 is supported.

#### Architecture design

While Azure Logic Apps provides capabilities that let you reuse BizTalk Server assets, you must have a modern architecture design to embrace the benefits from more modern capabilities. From a functional perspective, use your business logic as much as possible. From a product modernization perspective, use Azure Integration Services as much as you can. For quality and cross-cutting concerns, we recommend that you use the [Azure Well-Architected Framework](/azure/well-architected/what-is-well-architected-framework).

Under this framework, BizTalk migrations are [mission-critical workloads](/azure/well-architected/mission-critical/mission-critical-overview). This term describes collections of application resources that require high availability on the platform, meaning that they must always be available, operational, and resilient to failures.

To complete the architecture design for your BizTalk migration, follow [Design methodology for mission-critical workloads on Azure](/azure/well-architected/mission-critical/mission-critical-design-methodology). For an initial architecture and topology, review and use the reference architecture described in [Basic enterprise integration on Azure](/azure/architecture/reference-architectures/enterprise-integration/basic-enterprise-integration) in the [Azure Architecture Center](/azure/architecture/browse/).

To set up your initial environment, use the [Azure Integration Services Landing Zone Accelerator](https://github.com/[Azure/Integration-Services-Landing-Zone-Accelerator), which is targeted for building and deploying an integration platform using a typical enterprise landing zone design.

#### Minimum viable project (MVP) definition

An MVP is a product version with just enough features to be customer usable. This version shows the product's possibilities and potential to gather customer feedback and continue the work. For a BizTalk migration, your MVP definition reflects the iterations, waves, or groups of sprints that you need to make progress towards working features and to meet initial integration workloads.

We recommend that your MVP definition include the following business outcomes, which are expressed as [*Epics*](/azure/devops/boards/backlogs/define-features-epics?view=azure-devops&tabs=agile-process#what-makes-a-feature-or-epic) in Scrum terminology:

- **Business outcomes (Epics)**
  - What is the primary goal that we want to achieve? 
  - What capabilities or features must we address for this MVP?
  - What are the business process flows? This question provides the opportunity to optimize existing processes supported by BizTalk Server.
  - MVP business decisions: What business outcomes impact the MVP? Resource availability?

We recommend that your MVP include the following in-scope processes, which are expressed as [*Features*](/azure/devops/boards/backlogs/define-features-epics?view=azure-devops&tabs=agile-process#what-makes-a-feature-or-epic) in Scrum terminology:

<a name="in-scope-processes"></a>

- **In-scope processes (Features)**

  - High-level system functionality: You can extract this information using the discovery tools and express the descriptions in terms of features.
    1. Actors / Personas: This will be used to determine the individuals affected by the scenarios included in the MVP.
    1. Orchestrations: This can be extracted from the Discovery tools.
    1. Data Entities and Messages: This gives an opportunity to understand if further improvements can be included in the data exchanged by the BizTalk Server environment.
    1. Data Mappings: Today's world relies on JSON. BizTalk Server on XML. This is a great moment to decide the data format and conversion needs for the new platform.
    1. Business Rules: Business Rules are data centric and open an opportunity to re-think the approach for them or reuse them using Logic Apps capabilities.
    1. Regulatory Considerations: This is more relevant if customers don't have workloads running in the cloud.
    1. Data Privacy Considerations: Privacy has to be a top priority. As there is a potential environment change, unless the customer is chosing the Hybrid deployment model, this has to be addressed in each wave.
    1. Secure by Design: Each feature has to be secure by design.
    1. Proposed features for Coexistence: When delivering each wave, there will be a certain degree of coexistence. This hybrid architecture has to be aligned with existing Service Level Indicators (SLIs) and Service Level Objectives (SLOs).
    1. Non-Functional Considerations: Business processes may have different non-functional requirements. Not everything needs to be real time. Conversely, not everything is a batch process.
    1. Business Metrics (Optional): Opportunity to show progress for the migration work.
1. Out-of-Scope for the MVP: Scope of work is shaped by diferent variables. Availability of resources, documentation, risks or time to market. Ideally this has to be listed here. 

#### Initial Backlog

The Initial Backlog is the set of User Stories, grouped in features that are used to build the MVP Processes in-Scope. In other words is the MVP expressed in Epics, Features and User Stories. Each Epic should ideally encompass a group of BizTalk Applications or BizTalk Projects. A simple rule, is to associate one BizTalk Application or BizTalk Project with a feature.

> [!NOTE]
>
>For instance, let's say that you have a BizTalk Server project that has  an orchestration called "LoanReception" >that is used by customers to request Bank loans. The following is a proposed Feature and User Story: 
>
>Feature: 
>Loan Processing
>
>User story:
>*"As a User, I want to prepare a Loan application, so I can submit it to a Bank"*. This User Story which might be > currently implemented in , will have the following Tasks, in Azure Logic Apps and Azure Integration Services:
>
>- "Create Loan Reception Logic Apps Workflow"
>- "Configure asynchronous messaging using Azure Service Bus"
>- "Map JSON to XML data for Logic Apps Workflow"
>- "Customize Azure Integration Services required for messaging patterns"


The illustration below, depicts suggest durations for Epics, Features User Stories and tasks. While this is an implementation decision, this times consider you are indeed leveraging existing BizTalk artifacts in Azure Logic Apps. Leverage Azure Templates as much as possible. Please read [Create a Standard logic app workflow from a prebuilt template (Preview)](logic-apps/create-single-tenant-workflows-templates) for more information.

:::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/biztalk-triangle-mvp.png" alt-text="Diagram showing MVP waves.":::


### Migration Waves (Sprints)

After Sprint Zero has been completed, the team has a clear view of the MVP to be built. A **wave** is a set of sprints. The initial backlog should include workitems that as much as possible should follow the next illustration:

:::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/biztalk-gradual-waves.png" alt-text="Diagram showing migration waves.":::


During a wave, you **migrate**, **test** and **Release to production**. Let's drill down on what happens on each **wave**.

#### Migrate

The Migration effort during each wave should focus on the agreed User Stories. For the first wave, it will be the Initial Backlog. The technology decisions need to leverage the information in the BizTalk Server features mapping as indicated in the "Feature matchup" section of the article [Why migrate from BizTalk Server to Azure Logic Apps?](URL).

The following illustration depicts what should occur in the migration waves.

:::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/biztalk-migration-steps.png" alt-text="Diagram showing migration waves.":::

   | Step | Description | 
   |-----------|----------|
   | **1** | These are the discovery activities. While we introduced them during Sprint Zero, they should occur at the beginning of each wave. There is a chance that customers will continue making changes in the BizTalk environment. |
   | **2** | The Azure Integration Services landing zone accelerator is intended for an application team that's building and deploying an integration platform in a typical enterprise landing zone design. As the workload owner, use the architectural guidance to achieve your target technical state with confidence. |
   | **3** | These are the steps to develop and test integration workflows that runs in single-tenant Azure Logic Apps by using Visual Studio Code with the Azure Logic Apps (Standard) extension.|
   | **4** | For Standard logic app workflows that run in single-tenant Azure Logic Apps, you can use Visual Studio Code with the Azure Logic Apps (Standard) extension to locally develop, test, and store your logic app project using any source control system. However, to get the full benefits of easily and consistently deploying your workflows across different environments and platforms, you must also automate your build and deployment process.<BR> The Azure Logic Apps (Standard) extension provides tools for you to create and maintain automated build and deployment processes using Azure DevOps. | 
   | 5 | To deploy mission-critical Standard logic apps that are always available and responsive, even during updates or maintenance, enable zero downtime deployment by creating and using deployment slots. Zero downtime means that when you deploy new versions of your app, end users shouldn't experience disruption or downtime. <br><br>For more information, see [Set up deployment slots to enable zero downtime deployment in Azure Logic Apps](/azure/logic-apps/set-up-deployment-slots). | 

#### Test

Each **wave** have their own testing activities, embedded in each User Story. To shift left, it is important that you:

- Automate your tests.

  Azure Logic Apps (Standard) includes the capability to perform automated testing. The following list includes more information and resources that are freely available on GitHub:

  - [Automated testing with Azure Logic Apps (Standard)](https://techcommunity.microsoft.com/t5/integrations-on-azure-blog/automated-testing-with-logic-apps-standard/ba-p/2960623) from the Azure Logic Apps team
  
    With Azure Logic Apps (Standard), automated testing is no longer difficult to perform, due to the underlying architecture, which is based on the Azure Functions runtime and can run anywhere that Azure Functions can run. You can write tests for workflows that run locally or in a CI/CD pipeline. For more information, see the sample project for the [Azure Logic Apps Test Framework](https://github.com/Azure/logicapps/tree/master/LogicAppsSampleTestFramework).

    This test framework includes the following capabilities:

    - Write automated tests for end-to-end functionality in Azure Logic Apps.
    - Perform fine-grained validation at the workflow run and action levels.
    - Check tests into a Git repo and run either locally or within CI/CD pipelines.
    - Mock testing capabilities for HTTP actions and Azure connectors.
    - Configure tests to use different setting values from production.
    
  - [Integration Playbook: Logic Apps Standard Testing](https://mikestephenson.me/2021/12/11/logic-app-standard-integration-testing/) from Michael Stephenson, Microsoft MVP

    The [Integration Playbook testing framework](https://github.com/michaelstephensonuk/IntegrationPlaybook-LogicApp-Standard-Testing) builds on the Microsoft-provided test framework and supports additional scenarios:

    - Connect to a workflow in a Standard logic app.
    - Get the callback URL so that you can trigger the workflow from a test.
    - Check the results from the workflow run.
    - Check the operation inputs and outputs from the workflow's run history.
    - Plug into automated testing frameworks that logic app developers might use.
    - Plug into SpecFlow to support behavior-driven-development (BDD) for logic apps.

  Regardless which approaches or resources you use, you're well on your way to having repeatable, consistent automated integration tests.

- Set up mock response testing using static results.

  Regardless whether you set up automated tests, you can use the [static results capability](./test-logic-apps-mock-data-static-results.md) in Azure Logic Apps to temporarily set mock responses at the action level. This functionality lets you emulate the behavior from a specific system that you want to call. You can then perform some initial testing in isolation and reduce the amount of data that you'd create in line of business systems.

- Run side by side tests.

  Ideally, you already have baseline integration tests for your BizTalk Server environment and established automated tests for Azure Integration Services. You can then run tests side-by-side in a way that helps you check your interfaces by using the same data sets and improve overall test accuracy.

#### Release to Production

After your team finishes and meets the **Definition of Done** for the User Stories, you should consider the following:

1. Create a communication plan for the Release to Production.

1. Make a "cut-over" plan.

   A cut-over plan covers the details about the tasks and activities necessary to switch from the current platform to the new platform, including the steps that your team plan to execute. Include the following considerations in your cut-over plan:

   - Prerequisite steps
   - Dress rehearsal
   - People
   - Schedule estimates
   - Disabling interfaces in the old platform
   - Enabling interfaces in the new platform
   - Validation testing

1. Determine a rollback plan.

1. Run validation testing.

1. Plan for operations or production support.

1. Choose "Go or No-go" for releasing to production.

1. Celebrate your team's success.

1. Hold a retrospective.

### Best practices for a BizTalk Migration

While best practices might vary across organizations, consider a conscious effort to promote consistency, which helps reduce unnecessary efforts that "reinvent the wheel" and the redundancy of similar common components. When you help enable reusability, your organization can more quickly build interfaces that become easier to support. Time to market is a key enabler for digital transformation, so a top priority is reducing unnecessary friction for developers and support teams.

When you establish your own best practices, consider aligning with the following guidance:

### General naming conventions for Azure resources

Make sure to set up and consistently apply good naming conventions across all Azure resources from resource groups to each resource type. To lay a solid foundation for discoverability and supportability, a good naming convention communicates purpose. The most important point for naming conventions is that you have them, and that your organization understands them. Every organization has nuances that they might have to take into account.

For guidance around this practice, review the following Microsoft recommendations and resources:

- [Abbreviation examples for Azure resources](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations) 
-  [Azure Naming Tool](https://github.com/microsoft/CloudAdoptionFramework/tree/master/ready/AzNamingTool), which generates Azure-compliant names, helps you standardize on names, and automates your naming process.

### Naming conventions for Azure Logic Apps resources

The design for your logic app and workflow provides a key starting point because this area provides flexibility for developers to create unique names.

#### Logic app resource names

To differentiate between Consumption and Standard logic app resources, you can use different abbreviations, for example:

- Consumption: **LACon**
- Standard: **LAStd**

From an organizational perspective, you might design a naming pattern that includes the business unit, department, application, and optionally, the deployment environment, such as `DEV`, `UAT`, `PROD`, and so on, for example:

`LAStd-<*business-unit-name*>-<*department-name* or *application-name*>-<*environment-name*>`

Suppose you have a Standard logic app in development that implements workflows for the HR department in the Corporate Services business unit. You might name the logic app resource **LAStd-CorporateServices-HR-DEV**, and use [Pascal Case notation](https://www.theserverside.com/definition/Pascal-case) where appropriate for consistency.

#### Logic app workflow names

A Consumption logic app resource always maps to only one workflow, so you only need a single name. A Standard logic app resource can include multiple workflows, so design a naming convention that you can also apply to member workflows. For these workflows, consider a naming convention based on the process name, for example:

`Process-<*process-name*>`

So, if you had a workflow that implements employee onboarding tasks, such as creating an employee record, you might name the workflow **Process-EmployeeOnboarding**.

Here are more considerations for designing your workflow naming convention:

- Follow the Parent-Child pattern for logic apps where you want to highlight some relationship between one or more workflows.
- Take into account whether a workflow publishes or consumes a message.

#### Workflow operation names

When you add a trigger or action to your workflow, the designer automatically assigns the default generic name for that operation. However, operation names must be unique within your workflow, so the designer appends sequential numerical suffixes on subsequent operation instances, which makes readability and deciphering the developer's original intent difficult.

To make operation names more meaningful and easier to understand, you can add a brief task descriptor after the default text and use Pascal Case notation for consistency. For example, for the Parse JSON action, you can use a name such as **Parse JSON-ChangeEmployeeRecord**. With this approach or other similar approaches, you'll continue to remember that the action is **Parse JSON** and the action's specific purpose. So, if you need to use this action's outputs later in downstream workflow actions, you can more easily identify and find those outputs.

> [!NOTE]
>
> For organizations that extensively use expressions, consider a naming convention that doesn't 
> promote using whitespace (' '). The expression language in Azure Logic Apps replaces whitespace 
> with underscores ('_'), which might complicate authoring. By avoiding spaces upfront, you help 
> reduce friction when authoring expressions. Instead, use a dash or hyphen ('-), which provides 
> readability and doesn't affect expression authoring.

To avoid later possible rework and problems around downstream dependencies, which are created when you use operation outputs, rename your operations immediately when you add them to your workflow. Usually, downstream actions are automatically updated when you rename an operation. However, Azure Logic Apps doesn't automatically rename custom expressions that you created before you perform the rename.

#### Connection names

When you create a connection in your workflow, the underlying connection resource automatically gets a generic name, such as **sql** or **office365**. Like operation names, connection names must also be unique. Subsequent connections with the same type get a sequential numerical suffix, for example, **sql-1**, **sql-2**, and so on. Such names don't have any context, and make differentiating and mapping connections to their logic apps extremely challenging, especially for developers who are unfamiliar with the space and have to take on maintenance for those logic apps.

So, meaningful and consistent connection names are important for the following reasons:

- Readability
- Easier knowledge transfer and supportability
- Governance 

Again, having a naming convention is critical, although the format isn't overly important. For example, you can use the following pattern as a guideline:

`CN-<*connector-name*>-<*logic-app-or-workflow-name*>`

As a concrete example, you might rename a Service Bus connection in an **OrderQueue** logic app or workflow with **CN-ServiceBus-OrderQueue** as the new name. For more information, see the Turbo360 (Formerly Serverless360) blog post [Logic app best practices, tips, and tricks: #11 connectors naming convention](https://www.turbo360.com/blog/logic-app-best-practices-tips-and-tricks-11-connectors-naming-convention).

### Handle exceptions with scopes and "Run after" options

[Scopes](./logic-apps-control-flow-run-steps-group-scopes.md) provide the capability to group multiple actions so that you can implement Try-Catch-Finally behavior. The **Scope** action's functionality is similar to the **Region** concept in Visual Studio. On the designer, you can collapse and expand a scope's contents to improve developer productivity.

When you implement this pattern, you can also specify when to run the **Scope** action and the actions inside, based on the preceding action's execution status, which can be **Succeeded**, **Failed**, **Skipped**, or **TimedOut**. To set up this behavior, use the **Scope** action's [**Run after** (`runAfter`) options](./logic-apps-exception-handling.md#manage-the-run-after-behavior):

- **Is successful**
- **Has failed**
- **Is skipped**
- **Has timed out**

### Consolidate shared services

When you build integration solutions, consider creating and using shared services for common tasks. You can have your team build and expose a collection of shared services that your project team and others can use. Everyone gains increased productivity, uniformity, and the capability to enforce governance on your organization's solutions. The following sections describe some areas where you might consider introducing shared services:

| Shared service | Reasons |
|----------------|---------|
| Centralized logging | Provide common patterns for how developers instrument their code with appropriate logging. You can then set up diagnostic views that help you determine interface health and supportability. |
| Business tracking and business activity monitoring | Capture and expose data so that business subject matter experts can better understand the state of their business transactions and perform self-service analytic queries. |
| Configuration data | Separate your application configuration data from your code so that you can more easily move your application between environments. Make sure to provide a unified consistent and easily replicable approach to access configuration data so that project teams can focus on solving the business problem rather than spending time on application configurations for deployment. Otherwise, if every project approached this separation in a unique way, you can't benefit from economies of scale. |
| Custom connectors | Create custom connectors for internal systems that don't have prebuilt connectors in Azure Logic Apps to simplify for your project team and others. |
| Common datasets or data feeds | Expose common datasets and feeds as APIs or connectors for project teams to use, and avoid reinventing the wheel. Every organization has common data sets that they need to integrate systems in an enterprise environment. |

## Next steps

You've now learned more about available migration approaches, and best practices for moving BizTalk Server workloads to Azure Integration Services. To provide detailed feedback about this guide, you can use the following form:

> [!div class="nextstepaction"]
>
> [Give feedback about migration guidance for BizTalk Server to Azure Logic Apps](https://aka.ms/BizTalkMigrationGuidance)
