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
| Centralized logging | Provides common patterns for how developers instrument their code with appropriate logging. You can then set up diagnostic views that help you determine interface health and supportability. |
| Business tracking and business activity monitoring | Capture and expose data so that business subject matter experts can better understand the state of their business transactions and perform self-service analytic queries. |
| Configuration data | Separating your application configuration data from your code is a good practice so that you can move your application from one environment to another. However, if every project implements this is capability in a unique way, you are unable to take advantage of economy of scale. By providing a unified approach to access configuration data, project teams can focus on solving the business problem rather than  
| Custom Connectors | Perhaps you have some internal systems where there is not a public connector available in Azure Logic Apps and you would like to create a custom connector that can be built one and then shared with other project teams so that they can leverage it. |
| System of Record data feeds | Every organization has common data sets that need to be leveraged when integrating systems in a corporate environment. Being able to expose these data feeds as APIs (or connectors) is advantageous so that other project teams can leverage it and avoid reinventing the wheel. |

### Learn from failures 

It is important for you, from time to time, to do an assessment of your existing Logic Apps, especially when they have failed. Not only analyze the business process to see what can be improved but you should also analyze the run history of your logic apps and learn from the failures or mistakes that are happening. 

Much like developing any code, there are going to be edge (or corner) cases that will emerge. As these new discoveries become available, you can subsequently update your interfaces to account for these situations and improve the overall reliability of your solutions. 

Another reality is, as developers, we tend to try to capture errors more generically so that we at least have some protection from errors. As we understand where things may go wrong, we can subsequently become more prescriptive on how we protect ourselves from known issues as we discover them. 

Since Logic Apps has such a rich run history, you are bound to learn new things about your application as you view run your workflow’s run history. 

DevOps is another area where you want to evaluate periodically. As new templates, or approaches, are introduced either by Microsoft or the community you will want to evaluate these updates to determine whether or not additional benefits can be realized. 

Much like how organizations perform regular penetration tests or phishing exercises, Security is not a set and forget activity. As new authentication schemes and approaches  


## Next steps
