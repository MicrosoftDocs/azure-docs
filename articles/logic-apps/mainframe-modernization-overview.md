---
title: Mainframe and midrange integration workflows
description: Learn about building mainframe and midrange system integration solutions in Azure Logic Apps using mainframe and midrange connectors.
author: haroldcampos
ms.author: hcampos
ms.service: logic-apps
ms.topic: conceptual
ms.date: 10/24/2023

#CustomerIntent: As an integration developer, I need to integrate mainframe and midrange system with Standard workflows in Azure Logic Apps.
---

# Mainframe and midrange modernization with Azure Logic Apps

This guide describes how your organization can increase business value and agility by extending your mainframe and midrange system workloads to Azure using workflows in Azure Logic Apps. The current business world is experiencing an era of hyper innovation and is on a permanent quest to obtain enterprise efficiencies, cost reduction, growth, and business alignment. Organizations are looking for ways to modernize, and one effective strategy is to increase and augment business value.

For organizations with investments in mainframe and midrange systems, this means making the best use of platforms that sent humans to the moon or helped build current financial markets and extend their value using the cloud and artificial intelligence. This scenario is where Azure Logic Apps and its native capabilities for integrating with mainframe and midrange systems come into play. Among other features, this Azure cloud service incorporates the core capabilities of Host Integration Server (HIS), which has been used at the core of Microsoft's most strategic customers for more than 30 years.

When enterprise developers build integration workflows with Azure Logic Apps, they can more quickly deliver new applications using little to no code or less custom code. Developers who use Visual Studio Code and Visual Studio can be more productive than those who use IBM mainframe development tools and technologies because they don't require knowledge about mainframe systems and infrastructure. Azure Logic Apps empowers business analysts and decision makers to more quickly analyze and report vital legacy information. They can directly access data in mainframe data sources, which removes the need to have mainframe developers create programs that extract and convert complex mainframe structures.

## Cloud native capabilities for mainframe and midrange system integration

Since 1990, Microsoft has provided integration with mainframe and midrange systems through Microsoft Communications Server. Further evolution of Microsoft Communications Server created Host Integration Server (HIS) in 2000. While HIS started as a System Network Archtecture (SNA) Gateway, HIS expanded to include IBM's data stores (DB2, VSAM, and Informix), IBM's transaction systems (CICS, IMS, and IBMi), and IBM messaging (MQ Series). Microsoft's strategic customers have used these technologies for more than 20 years. To empower customers that run applications and data on Azure to continue using these technologies, Azure Logic Apps and Visual Studio has gradually incorporated these capabilities. For example, Visual Studio includes the following designers: HIS Designer for Logic Apps and the 3270 Design Tool.

:::image type="content" source="media/mainframe-modernization-overview/mainframe-modernization.png" alt-text="Cloud native capabilities for mainframe integration":::

For more information about the Microsoft's capabilities for mainframe and midrange integration, continue to the following sections.

### HIS Designer for Logic Apps

This tool creates mainframe and midrange system metadata artifacts for Azure Logic Apps and works with Microsoft Visual Studio by providing a graphical designer so that you can create, view, edit, and map metadata objects to mainframe artifacts. Azure Logic Apps uses these maps to mirror the programs and data in mainframe and midrange systems. For more information, see [HIS Designer for Logic Apps](/host-integration-server/core/application-integration-ladesigner-2).

### Microsoft 3270 Design Tool

This tool records screens, navigation paths, methods, and parameters for the tasks in your application so that you can add and run those tasks as 3270 connector actions. While the HIS Designer for Logic Apps targets transactional systems and data, the 3270 Design Tool targets 3270 applications. For more information, see [3270 Design Tool](/host-integration-server/core/application-integration-3270designer-2).

### Azure Logic Apps connectors for IBM mainframe and midrange systems

The following sections describe the [built-in, service provider-based connectors](custom-connector-overview.md#service-provider-interface-implementation) that you can use to access and interact with IBM mainframe and midrange systems when you create Standard workflows in Azure Logic Apps.

> [!NOTE]
>
> Although some of the following connectors are available as "shared" connectors that run
> in global Azure, this guide is focused on the built-in, service provider-based connectors, 
> which are available only when you create Standard workflows in Azure Logic Apps.

#### IBM 3270

This Azure Logic Apps connector for 3270 allows Standard workflows to access and run IBM mainframe applications that you usually drive by navigating through 3270 emulator screens. The connector uses the TN3270 stream. For more information, see [Integrate 3270 screen-driven apps on IBM mainframes with Azure by using Azure Logic Apps and IBM 3270 connector](../connectors/connectors-run-3270-apps-ibm-mainframe-create-api-3270.md).

#### IBM Customer Information Control System (CICS)

This Azure Logic Apps connector for CICS provides multiple protocols, including TCP/IP and HTTP, for Standard workflows to interact and integrate with CICS programs. If you need APPC support, the connector provides access to CICS transactions using LU6.2, which is available only in Host Integration Server (HIS). For more information, see [Integrate CICS programs on IBM mainframes with Standard workflows in Azure Logic Apps using the IBM CICS connector](../connectors/integrate-cics-apps-ibm-mainframe.md).

#### IBM DB2

This Azure Logic Apps connector for DB2 enables connections between Standard workflows and DB2 databases that are either on premises or in Azure. The connector offers enterprise IT professionals and developers direct access to vital information stored in DB2 database management systems. For more information, see [Access and manage IBM DB2 resources using Azure Logic Apps](../connectors/connectors-create-api-db2.md).

#### IBM Host Files

This Azure Logic Apps connector for Host Files provides a thin wrapper around the "Flat File Parser" feature in Host Integration Server. This offline "connector" provides operations that parse or generate binary data to and from host files. These operations require this data to come from any trigger or another action that produces binary data. For more information, see [Parse and generate IBM host files using Azure Logic Apps](../connectors/integrate-host-files-ibm-mainframe.md).

#### IBM Information Management System (IMS)

This Azure Logic Apps connector for IMS uses the IBM IMS Connect component, which provides high performance access from Standard workflows to IMS transactions using TCP/IP. This model uses the IMS message queue for processing data. For more information, see [Integrate IMS programs on IBM mainframes with Standard workflows in Azure Logic Apps using the IBM IMS connector](../connectors/integrate-ims-apps-ibm-mainframe.md).

#### IBM MQ

This Azure Logic Apps connector for MQ enables connections between Standard workflows and an MQ server on premises or in Azure. We also provide MQ Integration capabilities with Host Integration Server and BizTalk Server. For more information, see [Connect to an IBM MQ server from a workflow in Azure Logic Apps](../connectors/connectors-create-api-mq.md).

## How do we modernize Mainframe workloads with Azure Logic Apps?

While there are multiple approaches for modernization, we recommend modernizing mainframe applications, following an iterative, agile based model. Mainframes host multiple environments with Applications and Data. A successful modernization strategy will include ways to deal with:

- Maintaining the current Service Level Indicators and Objectives
- Managing coexistence between legacy Data along with migrated data
- Managing applications’ inter-dependencies
- Defining the future of the Scheduler and jobs
- Defining a strategy for third party tools replacement
- Conducting hybrid functional and non-functional testing activities
- Maintaining external dependencies or interfaces

Let’s explore a little more about Modernization approaches.

There are multiple ways to conduct Mainframe modernization. The most common ones are the Big Bang and the Agile approaches. The Big Bang approach is largely based on the waterfall software delivery model but with Iterations in phases. The Agile based approach follows Agile principles of Software Engineering. The choice will depend on each customer. Each approach has benefits and drawbacks to consider.

### Big Bang (Waterfall)

Big Bang approaches are typically chosen by organizations focused on locking time, scope of migration, and resources. While this sounds positive, the risks associated with this approach are that as these migrations can take months or even years, what was analyzed at the beginning of the migration journey, during planning, is no longer accurate as it is usually outdated. Also, as these organizations typically focus on having comprehensive documentation to reduce risks for delivery, the time spent on providing planning artifacts causes exactly the opposite effect. Focusing on planning more than executing tends to create delays in execution, causing increased costs in the long run.
A typical Big Bang Migration starts with a Kickoff in an Envisioning phase, then a Planning phase where planning deliverables are prepared and then once they are approved, the building phase begins. The Building phase expects that all work for dependencies has been identified and Migration activities can begin. Once this occurs, there will be multiple iterations to complete the migration work.

   :::image type="content" source="media/mainframe-modernization-overview/waterfall-mainframe.png" alt-text="Big Bang migration":::

After the Building phase is completed, the Stabilizing or Testing phase begins where the Migrated environment, dependencies and applications are tested against the Mainframe environment test regions. Once all of this is approved, it moves to the Deploy phase where a Go Live occurs.

### Agile Waves

Agile Waves are results oriented and focused on building software and not planning deliverables. While the first stages of an Agile delivery may be chaotic and complex for the organizational barriers that need to break, once the migration team has matured after a few sprints of execution, it becomes smoother. The goal is to release features to production frequently and provide business value sooner than with a Big Bang approach.
A Sprint zero (0) is designed to define the team, an initial Backlog of work and core dependencies to begin work. Features are defined and a Minimum Viable Product is defined as well. Mainframe readiness is kicked off at this stage and with a defined set of work items (user stories) the work begins.

   :::image type="content" source="media/mainframe-modernization-overview/mainframe-waves.png" alt-text="Mainframe Migration waves":::

Each Sprint will have a Sprint Goal. The team should have a shipping mindset. In other words, the focus will be on completing migration goals and release them to production. A group of sprints will be used to deliver a specific Feature or Wave of Features. Each Feature will include slices of Integration workloads.

   :::image type="content" source="media/mainframe-modernization-overview/mainframe-streams.png" alt-text="Mainframe migration waves per streams":::

As pointed out before, there are shared elements that have impact across the entire environments, such as Jobs and Interdependencies. A successful strategy focuses on a partial enablement of Jobs and re-architecture of the applications to be modernized and leaves the systems with most interdependencies at the end of the modernization effort, to reduce the size of the migration work first and then complete the scope of the modernization.

## Patterns for Modernization

Good Design encompasses factors such as consistency and coherence in component design and deployment, maintainability to simplify administration and development, and reusability to allow components and subsystems to be used in other applications and in other scenarios. Decisions made during the design and implementation phase have a huge impact on the quality and the total cost of ownership of cloud hosted applications and services.
At our Architecture Center, we have a list of tested patterns that describes the problem that they address, considerations for applying the pattern, and an example based on Microsoft Azure. They are available at https://learn.microsoft.com/en-us/azure/architecture/patterns/category/design-implementation. We call them Design and Implementation Patterns.
While there are multiple Design and Implementation Patterns, there are two that are the most relevant for Mainframe Modernization: The Anticorruption Layer and Strangler Fig Patterns.

### Anticorruption layer

Regardless of the selected Modernization Approach, you will need to implement an “Anticorruption layer” using Azure Logic Apps. In other words, Azure Logic Apps will become the façade or adapter layer between the Mainframe legacy system and Azure systems. For this approach to be effective, we recommend identifying the Mainframe workloads to Integrate/coexist (Mainframe Integration Workloads) and create a strategy per Integration workload. An Integration workload is the set of Interfaces that need to be enabled because of the migration of a Mainframe Application. For more information on this pattern, visit this location:
https://learn.microsoft.com/en-us/azure/architecture/patterns/anti-corruption-layer 

   :::image type="content" source="media/mainframe-modernization-overview/anti-corruption-pattern.png" alt-text="Anticorruption layer":::

### Strangler Fig Pattern

Once you have an Anticorruption Layer, modernization will be progressive. For that you need to use the Strangler Fig  pattern. For instance, if you decide to modernize a CICS application, you will have to modernize not only the CICS Programs but most likely 3270 Applications along with their corresponding data and Jobs. As you modernize workloads, you will start “strangling the monolith”. This expression is used when the new system eventually replaces all of the old system's features, strangling the old system and allowing you to decommission it. For more information on this pattern, visit here: https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig 

   :::image type="content" source="media/mainframe-modernization-overview/strangler-fig-pattern.png" alt-text="Strangler fig pattern":::

## Related content

- [Azure Architecture Center for Mainframes and Midranges:](/azure/architecture/browse/?terms=mainframe)

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.
-->
