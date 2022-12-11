---
title: 'Migration approaches: BizTalk Server to Azure Integration Services'
description: Learn about planning considerations, migration options, and best practices for moving from BizTalk Server to Azure Integration Services.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, kewear, azla
ms.topic: conceptual
ms.date: 12/15/2022
# As a BizTalk Server customer, I want to learn about the planning considerations, migration options, and best practices when considering a move from BizTalk Server workloads to Azure Integration Services.
---

# Migration approaches for moving from BizTalk Server to Azure Integration Services


## Strategies

### Lift and shift

In the Azure Marketplace, you can find the option to [provision virtual machines that include BizTalk licensing with the pay-as-you-go model](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftbiztalkserver.biztalk-server?tab=Overview). This offering provides the benefit from using Microsoft's Infrastructure as a Service (IaaS) capabilities through a consumption-based pricing model. Although using these virtual machines can alleviate some challenges in managing BizTalk Server infrastructure, this approach doesn't address [support lifecycle schedules and deadlines](/lifecycle/products/biztalk-server-2020) for BizTalk Server.

With organizations embracing digital transformation by moving to or adopting the cloud, many have the common tasks to discontinue their VMware, Hyper-V, or physical server infrastructure and migrate this functionality to IaaS on Azure. This choice helps reduce the previously mentioned challenges, but doesn't address the BizTalk codebase.

Starting with BizTalk Server 2013 and later, you can choose to run your BizTalk servers on premises as before, or run them on a virtual server in Azure. Running your BizTalk Server environment in the cloud offers the following advantages:

- No need for private hardware or infrastructure, so no hardware maintenance.
- Increased availability for your server infrastructure, which can span multiple datacenters or be replicated in availability zones.
- Access your servers from anywhere through the internet.
- Microsoft backs up your images.
- Fast deployment for new servers using built-in images available on Azure Marketplace.
- Fast scale-up for your servers by changing virtual machine sizes to add memory and CPU, add hard drives, and so on
- Improved security for your environment by using Azure Security Center. This service identifies security threats and provides you with an investigation path when security incidents occur

### Hybrid integration

BizTalk Server and Azure Integration Services capabilities might overlap, but they work better if you use them together. The main reasons that many organizations choose not to move their entire infrastructure to the cloud might be:  

Company policies  

Country policies  

Industry domain-specific policies  

Not all functionalities or applications are available on the cloud, and they might not be as robust as those available on-premise. To keep pace with the cloud revolution and to extend business capabilities, companies have to begin to use SaaS services along with what they have on-premise. Many business processes can benefit from cloud development and implementation strategies.  

With the release of the Logic Apps Adapter in BizTalk Server 2016, you can implement part of the integration logic as a service on Azure by using Logic Apps to connect to hundreds of cloud services. But there are more features available:  

Integrate cloud services with built-in adapters for cloud, Logic Apps, Service Bus, Event Hubs, Office365 Mail, Schedule, and Contacts, or Blob Storage  

Use BizTalk Server Connector in Logic Apps to connect to BizTalk from Logic Apps  

Publish BizTalk Server endpoints using Azure API Management, enabling organizations to expose endpoints to external partner and internal developers  

BizTalk Server 2020 provides adapters to connect easily with the cloud environment, which will help with their on-premises integrations and with their hybrid integrations.  

A hybrid integration strategy enables companies to maintain their technology investments in the systems they rely on, but still take advantage of new functions, improved performance, and the lower cost structure of cloud-based applications such as Microsoft Azure Cloud.

### Iterative (recommended) 

This approach provides the opportunity for your organization to incrementally achieve value, but sooner than they might otherwise. Your project team can learn about the technology stack early by using retrospectives. For example, you can deploy an existing BizTalk interface or project to production and then learn about the solution's needs, which include management, scalability, operations, and monitoring. After you gain this knowledge, you can plan sprints to optimize existing capabilities or introduce new patterns that you can subsequently use in future work. 

Independent of the approach you take, if you are going to Azure and Azure Integration Service, you should always think about refactoring your BizTalk Server solutions into cloud-native solutions (or serverless) and then decommission your server infrastructure. This choice will be an excellent fit if the strategy is to transform the business towards being entirely cloud-based.  

## Best practices

While best practices might vary across organizations, consider a conscious effort to promote consistency, which helps reduce unnecessary efforts that "reinvent the wheel" and the redundancy of similar common components. When you help enable reusability, your organization can more quickly build interfaces that become easier to support. Time to market is a key enabler for digital transformation, so a top priority is reducing unnecessary friction for developers and support teams.

When you establish your own best practices, consider aligning with the following guidance:

### General naming conventions for Azure resources

Make sure to set up and consistently apply good naming conventions across all Azure resources from resource groups to each resource type. To lay a solid foundation for discoverability and supportability, a good naming convention communicates purpose. The most important point for naming conventions is that you have them, and that your organization understands them. Every organization has nuances that they might have to take into account.

For guidance around this practice, review the following Microsoft recommendations and resources:

- [Abbreviation examples for Azure resources](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations) 
-  [Azure Naming Tool](https://github.com/microsoft/CloudAdoptionFramework/tree/master/ready/AzNamingTool), which generates Azure-compliant names, helps you standardize on names, and automates your naming process.

### Naming conventions for Azure Logic Apps resources

Your logic app and workflow design is a key starting point because this area provides flexibility for developers to create unique names.

#### Logic app resource names

To differentiate between Consumption and Standard logic app resources, you can use different abbreviations, for example:

- Consumption: **LACon**
- Standard: **LAStd**

From a organizational perspective, you might designing a naming pattern that includes the business unit, department, application, and optionally, the deployment environment, such as `DEV`, `UAT`, `PROD`, and so on, for example:

`LAStd-<*business-unit-name*>-<*department-name* or *application-name*>-<*environment-name*>`

Suppose you have a Standard logic app in development that implements workflows for the HR department in the Corporate Services business unit. You might name the logic app resource **LAStd-CorporateServices-HR-DEV**, and use [Pascal Case notation](https://www.theserverside.com/definition/Pascal-case) where appropriate for consistency.

#### Logic app workflow names

A Consumption logic app resource always maps to only one workflow, so you only need a single name. A Standard logic app resource can include multiple workflows, so design a naming convention that you can also apply to member workflows. For these workflows, consider a naming convention based on the process name, for example:

`Process-<*process-name*>`

So, if you had a workflow that implements employee onboarding tasks, such as creating an employee record, you might name the workflow **Process-EmployeeOnboarding**.

Here are a couple more considerations for designing your workflow naming convention:

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

To avoid later possible rework and problems around downstream dependencies, which are created when you use operation outputs, rename your operations immediately when you add them to your workflow. Usually, downstream actions are automatically updated when you rename an operation. However, custom expressions that you created before a rename aren't automatically updated.

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

[Scopes](/azure/logic-apps/logic-apps-control-flow-run-steps-group-scopes) provide the capability to group multiple actions so that you can implement Try-Catch-Finally behavior. The **Scope** action's functionality is similar to the **Region** concept in Visual Studio. On the designer, you can collapse and expand a scope's contents to improve developer productivity.

When you implement this pattern, you can also specify when to run the **Scope** action and the actions inside, based on the preceding action's execution status, which can be **Succeeded**, **Failed**, **Skipped**, or **TimedOut**. To set up this behavior, use the **Scope** action's [**Run after** (`runAfter`) options](/azure/logic-apps/logic-apps-exception-handling#manage-the-run-after-behavior):

- **Is successful**
- **Has failed**
- **Is skipped**
- **Has timed out**

### Shared services

When you build integration solutions, consider creating and using shared services for common tasks. You can have your team build and expose a collection of shared services that your project team and others can use. Everyone gains increased productivity, uniformity, and the capability to enforce governance on your organization's solutions. The following sections describe some areas where you might consider introducing shared services:

| Shared service | Reasons |
|----------------|---------|
| Centralized logging | Provide common patterns for how developers instrument their code with appropriate logging. You can then set up diagnostic views that help you determine interface health and supportability. |
| Business tracking and business activity monitoring | Capture and expose data so that business subject matter experts can better understand the state of their business transactions and perform self-service analytic queries. |
| Configuration data | Separate your application configuration data from your code so that you can more easily move your application between environments. Make sure to provide a unified consistent and easily replicable approach to access configuration data so that project teams can focus on solving the business problem rather than spending time on application configurations for deployment. Otherwise, if every project approached this separation in a unique way, you can't benefit from economies of scale. |
| Custom connectors | Create custom connectors for internal systems that don't have prebuilt connectors in Azure Logic Apps to simplify for your project team and others. |
| Common datasets or data feeds | Expose common datasets and feeds as APIs or connectors for project teams to use, and avoid reinventing the wheel. Every organization has common data sets that they need to integrate systems in an enterprise environment. |

### Learn from failures 

From time to time, assess and evaluate your existing logic apps, especially when they fail. Not only analyze the business process to find what and where you can improve, but also analyze your workflow's run history to learn from failures, mistakes, and errors that happened. Azure Logic Apps provides such rich run history, you have a high probability to discover new things about your app as you review your workflow's run history. Like all code development, some edge or corner cases can emerge. As you make discoveries, update your interfaces to account for these situations and improve your solutions' overall reliability.

One reality for project teams is that developers try to generically capture errors to at least gain some protection from problems. As your team discovers and better understands where things might go wrong, you can get more prescriptive on how to protect against issues.

DevOps is another area that you want to periodically evaluate. As Microsoft or the community introduces new templates or approaches, evaluate these updates to determine whether you can gain more benefits.

Similar to how organizations perform regular penetration testing or phishing exercises, security is never a set-and-forget activity. As new authentication schemes and approaches become available, review your security measures and incorporate new developments that make sense for your solutions and scenarios.

## Next steps
