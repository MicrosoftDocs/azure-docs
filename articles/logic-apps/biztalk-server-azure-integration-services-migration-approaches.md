---
title: 'Migration approaches: BizTalk Server to Azure Integration Services'
description: Learn about migration strategies, planning, and best practices for moving from BizTalk Server to Azure Integration Services.
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: kewear
ms.author: kewear
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 12/15/2022
# As a BizTalk Server customer, I want to learn about migration options, planning considerations, and best practices for moving from BizTalk Server to Azure Integration Services.
---

# Migration approaches for BizTalk Server to Azure Integration Services

This guide covers migration strategies and resources along with planning considerations and best practices to help you deliver successful migration solutions.

> [!NOTE]
>
> For a migration overview and guide to choosing services in Azure for your migration, review the following documentation:
>
> - [Why migrate from BizTalk Server to Azure Integration Services?](biztalk-server-to-azure-integration-services-overview.md)
> - [Choose the best Azure Integration Services offerings for your scenario](azure-integration-services-choose-capabilities.md)

## Strategy options

The following section describes various migration strategies along with their benefits and disadvantages:

### Lift and shift

In the Azure Marketplace, you can find the option to [provision virtual machines that include BizTalk licensing with the pay-as-you-go model](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftbiztalkserver.biztalk-server?tab=Overview). This offering provides the benefit from using Microsoft's Infrastructure as a Service (IaaS) capabilities through a consumption-based pricing model. Although using these virtual machines can alleviate some challenges in managing BizTalk Server infrastructure, this approach doesn't address [support lifecycle schedules and deadlines](/lifecycle/products/biztalk-server-2020) for BizTalk Server.

With organizations embracing digital transformation by moving to or adopting the cloud, many have the common tasks to discontinue their VMware, Hyper-V, or physical server infrastructure and migrate this functionality to IaaS on Azure. This choice helps reduce the previously mentioned challenges, but doesn't address the BizTalk codebase.

With BizTalk Server 2013 and later, you can choose to run your BizTalk servers on premises as before, or run them on a virtual server in Azure. Running your BizTalk Server environment in the cloud offers the following advantages:

- No need for private hardware or infrastructure, so no hardware maintenance.
- Increased availability for your server infrastructure, which can span multiple datacenters or be replicated in availability zones.
- Access your servers from anywhere through the internet.
- Microsoft backs up your images.
- Fast deployment for new servers using built-in images available on Azure Marketplace.
- Fast scale-up for your servers by changing virtual machine sizes to add memory and CPU, add hard drives, and so on
- Improved security for your environment by using Azure Security Center. This service identifies security threats and provides you with an investigation path when security incidents occur

### Hybrid integration

Although BizTalk Server and Azure Integration Services capabilities might overlap, they work better when you use them together. Most organizations who don't move their entire infrastructure to the cloud mainly have the following reasons:

- Company policies
- Country/regional policies  
- Industry domain-specific policies  

Also, not all functionalities or applications exist in the cloud, or some that are available might not be as robust as those on premises. However, to keep pace with the cloud revolution and to extend business capabilities, many organizations start by using SaaS offerings alongside their on-premises systems. Many business processes can benefit from cloud-based development and implementation strategies.

By adopting a hybrid integration strategy, you can still reap value from the technology investments in the systems that your organization depends on, but still benefit from new functionality, improved performance, and lower cost structure of cloud-based applications such as Azure.

With BizTalk Server 2016, the separate release of [Microsoft BizTalk Server Adapter for Logic Apps](/biztalk/core/logic-app-adapter) provided the opportunity for you to implement part of your integration logic as a service on Azure by using Azure Logic Apps to connect hundreds of cloud services. This adapter helped with both on-premises integrations and hybrid integrations by offering the following capabilities:

- Integrate cloud services with BizTalk Server using built-in adapters such as Azure Logic Apps, Azure Service Bus, Azure Event Hubs, Azure Blob Storage, and Office 365 Mail, Schedule, and Contacts.

- Use the BizTalk Server connector in Azure Logic Apps to connect from Azure Logic Apps to BizTalk server.

- Publish BizTalk Server endpoints using Azure API Management so that organizations can expose endpoints to internal developers and external partners.

With BizTalk Server 2020, installation automatically included the adapter for Azure Logic Apps along with the built-in adapters for easily connecting with the cloud environment.

### Big bang

A "big bang" or "direct changeover" approach requires lots of planning and isn't recommended for organizations that are unfamiliar with Azure Logic Apps or that have large systems or solutions to migrate. When an organization implements a new technology stack, new learnings usually often result. By investing too early or too much, you won't have the opportunity to benefit from lessons learned and adjust without risking significant rework.

This approach might also take longer to reap or accrue value. If you've already completed some migration activities, but you haven't yet released them into production due to other pending or in-progress work, your migrated artifacts aren't generating value for your organization.

### Iterative (recommended)

This approach provides the opportunity for your organization to incrementally achieve value, but sooner than they might otherwise. Your project team can learn about the technology stack early by using retrospectives. For example, you can deploy an existing BizTalk interface or project to production and then learn about the solution's needs, which include management, scalability, operations, and monitoring. After you gain this knowledge, you can plan sprints to optimize existing capabilities or introduce new patterns that you can subsequently use in future work. 

Regardless of your approach, if you plan on moving to Azure Integration Services or Azure in general, strongly consider refactoring your BizTalk Server solutions into serverless or cloud-native solutions before you decommission your server infrastructure. This choice is an excellent strategy if your organization wants to transform the business completely to the cloud.

## Plan for migration

The following section provides guidance around planning for migration and the areas to consider.

### Readiness planning

Readiness represents a critical part in your planning process. When you understand your project's breadth and depth, predictability improves across multiple dimensions, such as costs, complexity, timelines, and your project's overall success. The following list includes specific areas to review and address as part of your project's charter process.

| Area | Description |
|------|-------------|
| Inventory | Capture data about all your interfaces and applications so you can learn the number of interfaces and applications that you need to migrate. During this cataloging process, collect the following information to provide context: <br><br>- Adapters in use <br>- BizTalk Server features in use, such as Business Activity Monitoring, Business Rules Engine, EDI, and so on <br>- Custom code, such as expressions, maps, and pipeline components <br>- Message throughput <br>- Message sizes <br>- Dependencies |
| Complexity | To help you learn the levels of complexity in your interfaces, examine the types of business rules in those interfaces and the technical requirements that need customization to meet their needs or performance requirements. |
| Value | Assess the value of your interfaces so you can determine the priority for which interfaces to reimplement. While starting with low risk interfaces might make sense, after you're comfortable working with Azure Integration Services, make sure to first focus on the highest value work. |
| Costs | Establish the project's scope and estimate costs because a migration project requires capital to start execution. Secure the project's budget, whether achieved through capital or operational budget planning, and manage the project's scope along the way. |
| Application and system dependencies | Identify and account for these dependencies when you start project planning, so you can avoid surprises as you start project execution. |
| Risk registry | Create and use this artifact to identify and track any risks that surface while you work through project planning exercises. When you understand the risks, you can proactively mitigate them and communicate to leadership. You can also remove blockers early when they're less costly to address. |

### Migration tools

The Azure Integration Migrator command-line tool, also called the [BizTalk Migration tool](https://github.com/Azure/aimbiztalk), is a Microsoft open-source project that can help you in the planning and execution phases for your migration project along with moving BizTalk Server applications to Azure Integration Services. You can also use this tool to uncover useful insights and strategies for migrating your solutions to the cloud.

This tool runs through the following phases:

1. **Discover**

   Pulls BizTalk Server resources and identifies the BizTalk artifacts to migrate. Reads the assemblies and binding file information.

   **Requirements**: The MSI for the Biztalk Server application and all referenced BizTalk Server applications

1. **Parse**

   Reads the BizTalk Server artifacts and builds a source data model for the BizTalk Server application.

1. **Analyze**

   Builds an Azure Integration Services target data model using the source data model from the Parse stage. Basically, the tool reviews the BizTalk Server resources, identifies which items can migrate, and builds a data model of the Azure Integration Services target.  

1. **Report**

   Generates a report that outlines the found BizTalk Server resources and the items that can migrate. The report also contains detailed information about the contents in the source and target applications along with details about any potential problems with the conversion.

1. **Convert**

   Generates Azure Manager Resource templates and Azure CLI scripts that you can use to build the applications in Azure by using the target data model.

1. **Verify**

   This phase isn't currently built into the tool, but you run the installation scripts to deploy your application to Azure. You can then assess whether the generated application provides the same functionality as your BizTalk Server on-premises application.

The following diagram shows the phases that the Azure Integration Migrator tool runs through:

:::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/azure-integration-migrator-tool-biztalk.png" alt-text="Diagram showing phases that Azure Integration Services member services.":::

### Key team roles and skills for successful migration

To successfully migrate integration workflows from BizTalk Server to Azure Integration Services, establish a team that has the following important roles and skills, which span multiple disciplines:

| Role | Skills |
|------|--------|
| Project managers | Accountable for leading the overall project and delivers the agreed-upon scope within the boundaries for time and budget. |
| Scrum leader | Actively manages the backlog and facilitates prioritization for the project's activities. |
| Architects | Make sure that the project aligns with enterprise architectural principles and provide guidance about how to navigate uncertainty and roadblocks. |
| Developers | Actively work on migrating components from BizTalk Server to Azure Integration Services. |
| Quality assurance testers | Create test plans and execute testing against those plans. Track, communicate, and triage bugs and defects as part of project sprint planning. |
| User acceptance testers (UAT) | Provide the business stakeholders who help make sure no regressions are introduced by moving interfaces from an existing platform to a new platform. |
| Change management specialists | Assess the impact on existing processes and roles. Build a plan to help mitigate any perceived issues before they emerge. |

To help provide some or all the resources previously described, consider partners who have experience with performing migrations. As team members, they can help reduce risk, improve time to market, and make the project more predictable with their skill sets and expertise.

### Build process planning

For build planning, Microsoft recommends that you include sprints and work items to handle foundational services, such as authentication, logging, exception handling, and so on. This inclusion helps avoid rework later in development cycles caused by not addressing underlying needs. You also want to avoid blocked developers due to decisions that require other stakeholders to make.

The following list covers only some areas to consider: 

| Area | Description |
|------|-------------|
| Authentication | Address the following questions and others about authentication before you get too deep into development cycles. <br><br>- Does your organization have any standards around authentication schemes? <br>- Can you use managed identities and service principals in Azure? <br>- Are basic authentication and API keys permitted or not? <br><br>This activity can be a good opportunity to bring in your enterprise architects who can make sure to get clear agreements about which authentication schemes to use. |
| Logging | Consider collecting and store telemetry in a centralized data repository, which is a popular pattern that integration solutions use. <br><br>For example, Azure Logic Apps (Standard) can push telemetry to Application Insights in Azure Monitor. Azure Logic Apps (Consumption) can push telemetry to Log Analytics, also in Azure Monitor. You can also include tracked properties so that developers can include more context as messages flow through the integration platform. For example, this data might include work order numbers, purchase order information, or anything else that might be useful, helpful, and relevant for your organization. <br><br>Arguably, each organization's solution might differ, based on the organization's needs. For example, some organizations want full control over what and when data gets logged. In this scenario, you might create APIs or custom connectors, and then instrument your code based on specific milestones. <br><br>Regardless which approach you choose, make sure that your developers clearly understand expectations to avoid future rework. |
| Exception Handling | Address having a strategy and consistent pattern early to handle exceptions and errors to avoid future rework. Make sure to create clarity around this area early before creating any logic apps. The following list includes some questions to answer when you address exception handling: <br><br>- How will you use scopes and "Run after" settings to detect exceptions? <br>- How can you use the `result()` expression to better understand where an exception happens in a workflow and to find more information about the underlying root cause? <br>- After you choose how to catch exceptions, how do you want to log this data and communicate to stakeholders? <br><br>Make sure these decisions align with your logging strategy as previously mentioned. Ideally, you've established a process that actively looks for new error events in your logging data store. From there, you can respond to these events and orchestrate an exception process. You might have to filter out or aggregate duplicate error events, log a ticket in your organization's IT Service Management solution, and choose how to send notifications. You might have different paths for notifications, based upon issue severity and time of day. You can achieve agility by building a workflow to manage this process. |
| Analytics | To demonstrate your solution's overall health and hygiene to your stakeholders, consider the different lenses that your stakeholders use to look through, for example: <br><br>- Executives might be more interested in overall health, transaction counts or volume, and the business value that those transactions generate, but not overall technical nuances. <br>- A frontline manager might be more interested in overall health but could also become interested in technical details, such as performance characteristics, to make sure that SLAs are met. <br>- Support analysts are likely interested in overall service health, exceptions, and performance bottlenecks. <br><br>While you put together your analytics strategy, consider your stakeholders and the type of data that interests them. This thought process helps you make sure that you track useful and helpful information and make that data accessible for reporting purposes. If you find coverage gaps, you might have to revisit your logging-related work items, and add appropriate tasks to address these gaps. |
| Cadence | When you ship your integration projects and learn from those experiences, make sure to capture the lessons that inevitably emerge. Plan remediation sprints or cycles early in your journey so you can correct course early, before the cost becomes too great. That way, you can avoid introducing too much technical debt into your new platform. |

### Deployment planning

When you anticipate and prepare a deployment plan, you increase your opportunities for a successful deployment. With BizTalk Server, after you created all the infrastructure and environments, you shifted focus to solution deployment.

With Azure, this experience differs with some activities to consider first, such as addressing infrastructure deployment between different environments, which can include different Azure subscriptions, Azure resource groups, or some combination, for example: 

- Azure Key Vault: secrets and access policies 
- Azure Service Bus: queues, topics, subscriptions, filters, and access policies
- Azure App Service: plans, networking, and authentication 

You can then subsequently focus on solution deployment between different environments.

### Test planning

To make sure that your stakeholders are satisfied with the solution that you're providing, testing is important to consider for any migration project. A new solution should provide more value compared to the previous solution, without any regressions that might impact the business.

Consider the following testing recommendations for your migration project:

- Establish your baseline by answering the following questions:

  1. Do you have existing tests?
  1. Do the tests run without errors?
  1. Are the test results accurate?

  To have confidence that your team hasn't introduced regressions, you need the capability to compare results from the new platform against reliable tests from your existing platform. So, if you don't have a baseline, make sure to establish one.

  Naturally, you don't want to spend many resources establishing tests against a platform that's retiring, but you need to answer the question, "How do I know everything works successfully?" If you're in this situation, start establishing your baseline based on priorities and create a plan to mitigate areas where you have gaps.

- Set up your test strategy for the new platform.

  Assuming that you're comfortable with your baseline, you can now think about how you to test on your new platform. If you had trouble establishing your baseline, take the opportunity to set up a strong foundation for your new platform.

  When you think about testing for your new platform, keep automation top of mind. Although having a platform allows you to quickly build interfaces, relying on manual tests erodes those productivity gains.

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
    
  - [Integration Playbook: Logic Apps Standard Testing](https://www.mikestephenson.me/2021/12/11/logic-app-standard-integration-testing/) from Michael Stephenson, Microsoft MVP

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

### Go live

After your team finishes testing, think about the necessary tasks to put your new integration platform into production:

1. Create a communication plan.

   Although you might have a small team implementing the technical aspects and details for an integration platform modernization project, you likely have many stakeholders that you need to keep informed about the migration project. If you don't have a clear communication strategy, you create anxiety for others involved. Also, consider the external stakeholders that you need to include in your communication plan. For example, you might want to include other trading partners or customers who might be affected by upcoming events. Don't forget about these stakeholders too.

   So, communicate early and often by providing clarity in the areas that affect your stakeholders, for example, what you expect from them, when they're needed, how long they're needed, and so on. By providing a concise and clear plan, you create confidence for stakeholders and keep up positive energy around your project. Remove any doubts by making sure your team is ready to execute. Otherwise, you risk ruining morale due to perceptions, speculation, and rumors that your project might fail.

1. Make a "cut-over" plan.

   A cut-over plan covers the details about the tasks and activities necessary to switch from the current platform to the new platform, including the steps that your team plan to execute. Include the following considerations in your cut-over plan:

   - Prerequisite steps

     Identify the actions that you can or must perform in advance, so that you don't leave everything for cut-over day. Generally, a cut-over to a new integration platform usually means that you have a "green field" deployment, so you can stage many components and configurations early in the cycle. The more that you can complete before your original platform's maintenance window, the more angst you can remove, and improve the overall outcome of your cut-over event.

   - Dress rehearsal
  
     Stakeholders generally want some predictability around the upcoming events. So, how do you provide predictability around something you've never done before? By running a dress rehearsal that deploys your integration platform to a pre-production environment, you can validate your cut-over plan and the anticipated timing for each step in the process.

     Otherwise, underestimating the time that a step can take can lead to a ripple effect in delays. Cumulatively, these delays can cost a significant amount of time and disrupt the business. When you run a dress rehearsal, you can base your schedule on actual data. Your team might also find issues that would've caused problems during go-live in production. When your team catches and documents problems early, they're better prepared and risk fewer surprises during the real cut-over event.

   - People

     Make sure clear accountability exists around which person owns each particular step in the plan. As a wise mitigation strategy, identify and prepare back-up people in case the primary person is unavailable to perform the task, due to unexpected circumstances.

   - Schedule estimates

     After you run one rehearsal, your team should have a better understanding how long each task might take to complete. You can use these estimations to forecast a schedule so that people know when you need them and approximately how much time they have to finish their task.

   - Disabling interfaces in the old platform

     Provided that you understand all the existing dependencies, you can start disabling interfaces in your old integration platform before you enable interfaces in the new platform. Some complex architectures might require that you disable sequential interfaces in a specific order to avoid surprises. Depending on the interface's nature, you also might not be able to disable all interfaces in your old integration platform. For example, if you have a line of business system that pushes messages to your integration platform, make sure to account for these situations in your cut-over plan.

   - Enabling interfaces in the new platform

     Similar to how you might have sequential interfaces that require you to disable in a specific order, you might have new sequential interfaces to enable with the same requirement. Before your start enabling interfaces, make sure that you understand all the dependencies and that you identified the required order to enable new sequential interfaces.

     > [!NOTE]
     >
     > Take care that you execute steps to enable interfaces in a methodical and 
     > systematic way to avoid missteps that risk your project's success.

   - Validation testing

     This activity is extremely important, so include this work in your cut-over plan. After you enable your interfaces, confirm that the interfaces work as expected before you move on to the "Go or No-go" stage. Ideally, you can perform validation tests that don't affect core business data. This guide provides more information about validation testing for your new interfaces in a later section.

1. Determine a rollback plan.

   Hopefully, you now have a structured and detailed approach to implement your new integration platform. However, surprises can happen, so determine the necessary steps to roll back to your previous integration platform. That way, you have a plan ready to go, just in case.

   When you're thinking through these steps, consider the events that might trigger a rollback. Also, align your plan with the people who you need to make the rollback decision. This guide provides more information in the section about making the "Go or No-go" decision.

1. Run validation testing.

   Your cut-over plan should've included the details for this work. After you enable your interfaces, confirm that the interfaces work as expected before you move on to the "Go or No-go" stage. Ideally, you can perform validation tests that don't affect core business data.  

   Ideally, for example, your validation tests can read data from a production line of business system, but they can't write data, which creates a compliance issue. Otherwise, you'll have to wait for a business transaction to flow through your interfaces and validate everything works as your team expects.

1. Plan for operations or production support.

   Although the work to migrate interfaces between platforms usually consumes most project resources, factor in ongoing support for your interfaces and new platform.

   - Make sure to share the appropriate amount and level of knowledge between the project team and the operations team.

   - Create and keep a current contact list that has both technical and business contact details so that anyone can reach the appropriate team members when necessary.

   - For a smoother and timely support response to customers, have your support processes and documentation ready before you go live. You can help reduce stress for customers, your support team, and your project team when you can avoid a support member trying to figure everything out when an actual incident happens.

1. Choose "Go or No-go" for moving to production.

   For this step, work with the relevant stakeholders to decide whether the project can move into production. For example, stakeholders can include leadership, project management, operations, and business representatives.

1. Celebrate your team's success.

   Congratulations! After you finish a project that positively impacts your organization or business, the time has come to recognize your team for all their hard work and to celebrate an amazing milestone! Make sure to credit your team in an appropriate and meaningful way. No recognition is one sure way to destroy morale.

1. Hold a retrospective.

   Like any engineering activity, your team gains valuable insight and expands their knowledge by learning from experience. Meet with your team to discuss and capture areas that went well, didn't go well, and those that can change for the better. Take care that you host this conversation in a non-threatening and supportive environment, and stay focused on the goal to learn and grow, not blame. Share your lessons with your leadership and other interested stakeholders. This exercise builds trust across your team and represents engineering maturity.

## Best practices for migration

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

As a concrete example, you might rename a Service Bus connection in an **OrderQueue** logic app or workflow with **CN-ServiceBus-OrderQueue** as the new name. For more information, see the Serverless360 blog post [Logic app best practices, tips, and tricks: #11 connectors naming convention](https://www.serverless360.com/blog/logic-app-best-practices-tips-and-tricks-11-connectors-naming-convention).

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

### Review, reflect, and learn

From time to time, assess and evaluate your existing logic apps, especially when they fail. Not only analyze the business process to find what and where you can improve, but also analyze your workflow's run history to learn from failures, mistakes, and errors that happened. Azure Logic Apps provides such rich run history, you have a high probability to discover new things about your app as you review your workflow's run history. Like all code development, some edge or corner cases can emerge. As you make discoveries, update your interfaces to account for these situations and improve your solutions' overall reliability.

One reality for project teams is that developers try to generically capture errors to at least gain some protection from problems. As your team discovers and better understands where things might go wrong, you can get more prescriptive on how to protect against problems.

Similar to how organizations regularly perform "red team" exercises, such as penetration testing or phishing attempts, security isn't a "set-and-forget" activity. As new authentication schemes and approaches become available, periodically revisit your interfaces, review your security measures, and incorporate relevant and appropriate new developments that provide the most secure approaches.

DevOps is another area that you want to periodically evaluate. As Microsoft or the community introduces new templates or approaches, evaluate these updates to determine whether you can gain more benefits.

## Next steps

You've now learned more about available migration approaches, planning considerations, and best practices for moving BizTalk Server workloads to Azure Integration Services. To provide detailed feedback about this guide, you can use the following form:

> [!div class="nextstepaction"]
>
> [Give feedback about migration guidance for BizTalk Server to Azure Integration Services](https://aka.ms/BizTalkMigrationGuidance)