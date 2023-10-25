---
title: Mainframe and Midranges integration workflows
description: Learn about building mainframe and midranges integration solutions by using Azure Logic Apps and the Mainframe and Midranges connectors.
author: haroldcampos
ms.author: hcampos
ms.service: logic-apps
ms.topic: overview 
ms.date: 10/24/2023

#CustomerIntent: As an Integration developer I need to integrate with Mainframe and Midranges systems from Azure
---


# Mainframe and Midranges Modernization with Azure Logic Apps 

Learn how Azure Logic Apps enable organizations to extend their Mainframe and Midranges workloads to Azure to increase business value and agility 

## The World we live in Today

We live in an era of hyper innovation where the quest to obtain enterprise efficiencies, cost reduction, growth, and business alignment, is permanent. Organizations use Modernization as a vehicle to increase their business value. But what is an effective Modernization strategy? A Modernization strategy is effective when it has the purpose of augmenting business value. For organizations who have made investments in Mainframes and Midranges, this means leveraging the best of these platforms that were used to send a man to the moon or that helped build the financial markets as we know them and extend their value with the Cloud and Artificial Intelligence. 
This is where Azure Logic Apps and its native capabilities for integrating with Mainframe and Midranges come into play. Azure Logic Apps incorporate the core capabilities of the Host Integration Server product, which has been available for more than 30 years at the core of our most strategic customers.
Azure Logic Apps empowers enterprise developers to deliver new applications more quickly and with less custom coding. Developers who use Visual Studio and Visual Studio code can be more productive than those who use IBM mainframe development tools and technologies because they do not require knowledge of mainframe systems and infrastructure. Azure Logic Apps empowers business analysts and decision-makers to analyze and report vital legacy information faster. They can access data in mainframe data sources directly, eliminating the need to schedule mainframe developers to write programs to extract and convert complex mainframe structures.

What are those Native capabilities?


## Cloud native capabilities for Mainframes and Midranges Integration

Microsoft has provided Integration with Mainframes and Midranges since 1990 with Microsoft Communications Server. Further evolution of Microsoft Communications Server created Host Integration Server in 2000. 
While it started as an SNA Gateway, it then expanded to include IBM’s data stores (DB2, VSAM, Informix), IBM’s transaction systems (CICS, IMS, IBMi) and IBM’s messaging (MQ Series). Our strategic customers have been using these technologies for more than 20 years. To allow our customers running applications and data on Azure to leverage these technologies, those capabilities have been gradually incorporated into Azure Logic Apps and our Visual Studio Designers: Microsoft HIS Designer for logic Apps and the Microsoft 3270 Design Tool.

   :::image type="content" source="media/la-mainframe-midranges/la-mainframe-modernization" alt-text="Cloud native capabilities for mainframe integration":::

The following are our capabilities for Mainframe and Midrange integration:

### Microsoft HIS Designer for Logic Apps:

It is a tool to create mainframe and midrange system metadata artifacts for Azure Logic Apps. This tool works with Microsoft Visual Studio and provides a graphical user interface for you to create, view, edit, and map metadata objects to mainframe artifacts. Azure Logic Apps uses these maps to mirror the programs and data in mainframes and midrange systems. Learn more about the HIS Designer for Logic Apps here: [HIS Designer for Logic Apps](/host-integration-server/core/application-integration-ladesigner-2)

### Microsoft 3270 Design Tool:

This tool helps record screens, navigation paths, methods, and parameters for the tasks in your application that you add and run as 3270 connector actions. While the HIS Designer for Logic Apps targets Transactional Systems and Data, the 3270 Design tool targets 3270 applications. Learn more about the 3270 Design tool here: [3270 Design Tool](/host-integration-server/core/application-integration-3270designer-2)


### IBM Mainframe Connectors

#### Azure Logic Apps connector for IBM CICS
Our Logic Apps connector for IBM CICS Integration technologies provide multiple mechanisms to interact with CICS Programs. With Azure Logic Apps, we support Integration via TCP/IP and HTTP. If you need APPC support, we provide access to CICS transactions using LU6.2 (available only in Host Integration Server). Learn more about this connector in this article: [Integrate CICS programs on IBM mainframes with Standard workflows in Azure Logic Apps using the IBM CICS connector](/connectors/integrate-cics-apps-ibm-mainframe)

#### Azure Logic Apps connector for IBM IMS
Our Logic Apps connector for IBM IMS Integration technologies leverage the IBM IMS Connect component that provides high performance access to IBM Information Management Systems (IMS) transactions using TCP/IP.  This model uses the IMS message queue for processing data. Learn more about this connector in this article: [Integrate IMS programs on IBM mainframes with Standard workflows in Azure Logic Apps using the IBM IMS connector](/connectors/integrate-ims-apps-ibm-mainframe)

#### Azure Logic Apps connector for IBM 3270
Our Logic Apps connector for IBM 3270 Integration technologies allows accessing and running IBM mainframe applications that you usually drive by navigating through 3270 emulator screens. The connector uses the TN3270 stream. Learn more about this connector in this article: [Integrate 3270 screen-driven apps on IBM mainframes with Azure by using Azure Logic Apps and IBM 3270 connector](/connectors/connectors-run-3270-apps-ibm-mainframe-create-api-3270)

#### Azure Logic Apps connector for IBM MQ
Our Logic Apps connector for IBM MQ Integration technologies enable connections between Logic App workflows and IBM MQ server on premises or in Azure. IBM MQ was originally introduced in 1993 (under the MQSeries name). We also provide MQ Integration capabilities with Host Integration Server and BizTalk Server. Learn more about this connector in this article: [Connect to an IBM MQ server from a workflow in Azure Logic Apps](/connectors/connectors-create-api-mq)

#### Azure Logic Apps connector for IBM DB2
Our Logic Apps connector for IBM DB2 Integration technologies enable connections between Azure Logic App workflows and IBM DB2 Databases that are either on premises or in Azure. It offers enterprise IT professionals and developers direct access to vital information stored in IBM DB2 database management systems.  Learn more about this connector in this article: [Access and manage IBM DB2 resources by using Azure Logic Apps](/connectors/connectors-create-api-db2)

#### Azure Logic Apps connector for IBM Host files
Our Logic Apps connector for IBM Host Files Integration technologies is a thin wrapper round the Host Integration Server feature “Flat File Parser”. This is an offline connector that parses and generates binary data from and to Host Files. As such, it requires its data to come from any Trigger or Action that produces binary data. Learn more about this connector in this article: [Parse and Generate IBM Host Files by using Azure Logic Apps](/connectors/integrate-host-files-ibm-mainframe)

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

   :::image type="content" source="media/la-mainframe-midranges/la-waterfall-mainframe" alt-text="Big Bang migration":::

After the Building phase is completed, the Stabilizing or Testing phase begins where the Migrated environment, dependencies and applications are tested against the Mainframe environment test regions. Once all of this is approved, it moves to the Deploy phase where a Go Live occurs.

### Agile Waves

Agile Waves are results oriented and focused on building software and not planning deliverables. While the first stages of an Agile delivery may be chaotic and complex for the organizational barriers that need to break, once the migration team has matured after a few sprints of execution, it becomes smoother. The goal is to release features to production frequently and provide business value sooner than with a Big Bang approach.
A Sprint zero (0) is designed to define the team, an initial Backlog of work and core dependencies to begin work. Features are defined and a Minimum Viable Product is defined as well. Mainframe readiness is kicked off at this stage and with a defined set of work items (user stories) the work begins.

   :::image type="content" source="media/la-mainframe-midranges/la-mainframe-waves" alt-text="Mainframe Migration waves":::

Each Sprint will have a Sprint Goal. The team should have a shipping mindset. In other words, the focus will be on completing migration goals and release them to production. A group of sprints will be used to deliver a specific Feature or Wave of Features. Each Feature will include slices of Integration workloads.

   :::image type="content" source="media/la-mainframe-midranges/la-mainframe-streams" alt-text="Mainframe migration waves per streams":::

As pointed out before, there are shared elements that have impact across the entire environments, such as Jobs and Interdependencies. A successful strategy focuses on a partial enablement of Jobs and re-architecture of the applications to be modernized and leaves the systems with most interdependencies at the end of the modernization effort, to reduce the size of the migration work first and then complete the scope of the modernization.

## Patterns for Modernization

Good Design encompasses factors such as consistency and coherence in component design and deployment, maintainability to simplify administration and development, and reusability to allow components and subsystems to be used in other applications and in other scenarios. Decisions made during the design and implementation phase have a huge impact on the quality and the total cost of ownership of cloud hosted applications and services.
At our Architecture Center, we have a list of tested patterns that describes the problem that they address, considerations for applying the pattern, and an example based on Microsoft Azure. They are available at https://learn.microsoft.com/en-us/azure/architecture/patterns/category/design-implementation. We call them Design and Implementation Patterns.
While there are multiple Design and Implementation Patterns, there are two that are the most relevant for Mainframe Modernization: The Anticorruption Layer and Strangler Fig Patterns.

### Anticorruption layer

Regardless of the selected Modernization Approach, you will need to implement an “Anticorruption layer” using Azure Logic Apps. In other words, Azure Logic Apps will become the façade or adapter layer between the Mainframe legacy system and Azure systems. For this approach to be effective, we recommend identifying the Mainframe workloads to Integrate/coexist (Mainframe Integration Workloads) and create a strategy per Integration workload. An Integration workload is the set of Interfaces that need to be enabled because of the migration of a Mainframe Application. For more information on this pattern, visit this location:
https://learn.microsoft.com/en-us/azure/architecture/patterns/anti-corruption-layer 

   :::image type="content" source="media/la-mainframe-midranges/la-anti-corruption-pattern" alt-text="Anticorruption layer":::

### Strangler Fig Pattern

Once you have an Anticorruption Layer, modernization will be progressive. For that you need to use the Strangler Fig  pattern. For instance, if you decide to modernize a CICS application, you will have to modernize not only the CICS Programs but most likely 3270 Applications along with their corresponding data and Jobs. As you modernize workloads, you will start “strangling the monolith”. This expression is used when the new system eventually replaces all of the old system's features, strangling the old system and allowing you to decommission it. For more information on this pattern, visit here: https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig 

   :::image type="content" source="media/la-mainframe-midranges/la-strangler-fig-pattern" alt-text="Strangler fig pattern":::

## Related content

- [Azure Architecture Center for Mainframes and Midranges:](/azure/architecture/browse/?terms=mainframe)

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.
-->
