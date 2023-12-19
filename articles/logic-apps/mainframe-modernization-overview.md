---
title: Mainframe and midrange modernization
description: Learn about building mainframe and midrange system integration solutions in Azure Logic Apps using mainframe and midrange connectors.
author: haroldcampos
ms.author: hcampos
ms.service: logic-apps
ms.topic: conceptual
ms.date: 11/02/2023

#CustomerIntent: As an integration developer, I need to learn about mainframe and midrange system integration with Standard workflows in Azure Logic Apps.
---

# Mainframe and midrange modernization with Azure Logic Apps

This guide describes how your organization can increase business value and agility by extending your mainframe and midrange system workloads to Azure using workflows in Azure Logic Apps. The current business world is experiencing an era of hyper innovation and is on a permanent quest to obtain enterprise efficiencies, cost reduction, growth, and business alignment. Organizations are looking for ways to modernize, and one effective strategy is to augment the business value of existing legacy assets.

For organizations with investments in mainframe and midrange systems, this means making the best use of platforms that helped send humans to the moon or helped build current financial markets and extend their value using the cloud and artificial intelligence (AI). This scenario is where Azure Logic Apps and its native capabilities for integrating with mainframe and midrange systems come into play by opening the door to the AI world for legacy investments. Among other features, Azure Logic Apps incorporates the core capabilities of Host Integration Server (HIS), which has been used for mainframe and midrange integration at the core of Microsoft's most strategic customers over 20+ years. As a result, Azure Logic Apps has become an Integration Platform-as-a-Service (iPaaS) for mainframes.

When enterprise developers build integration workflows with Azure Logic Apps, they can more quickly deliver new applications using little to no code or less custom code. Developers who use Visual Studio Code and Visual Studio can be more productive than those who use IBM mainframe development tools and technologies because they don't require knowledge about mainframe systems and infrastructure. Azure Logic Apps empowers business analysts and decision makers to more quickly analyze and report vital legacy information. They can directly access data in mainframe data sources, which removes the need to have mainframe developers create programs that extract and convert complex mainframe structures.

## Cloud native capabilities for mainframe and midrange system integration

Since 1990, Microsoft has provided integration with mainframe and midrange systems through Microsoft Communications Server. Further evolution of Microsoft Communications Server created Host Integration Server (HIS) in 2000. While HIS started as a System Network Architecture (SNA) Gateway, HIS expanded to include IBM data stores (DB2, VSAM, and Informix), IBM transaction systems (CICS, IMS, and IBM i), and IBM messaging (MQ Series). Microsoft's strategic customers have used these technologies for more than 20 years.

To empower customers that run applications and data on Azure to continue using these technologies, Azure Logic Apps and Visual Studio have gradually incorporated these capabilities. For example, the HIS Designer for Logic Apps that runs on Visual Studio, and the 3270 Design Tool, help you create metadata artifacts required by the built-in connectors that you use for mainframe and midrange integration in Azure Logic Apps. These built-in connectors run using the same compute resources as Standard logic app workflows. This design not only allows you to achieve low-latency scenarios, but also extends your reach to address more disaster recovery and high availability customer needs.

:::image type="content" source="media/mainframe-modernization-overview/mainframe-modernization.png" alt-text="Conceptual diagram showing Microsoft cloud native capabilities for mainframe integration." lightbox="media/mainframe-modernization-overview/mainframe-modernization.png":::

For more information about the Microsoft's capabilities for mainframe and midrange integration, continue to the following sections.


### Microsoft HIS Designer for Logic Apps

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

This Azure Logic Apps connector for 3270 allows Standard workflows to access and run IBM mainframe applications that you usually drive by navigating through 3270 emulator screens. The connector uses the TN3270 stream. For more information, see [Integrate 3270 screen-driven apps on IBM mainframes with Azure by using Azure Logic Apps and IBM 3270 connector](../connectors/integrate-3270-apps-ibm-mainframe.md).

#### IBM Customer Information Control System (CICS)

This Azure Logic Apps connector for CICS provides Standard workflows with the capability to interact and integrate with CICS programs using multiple protocols, such as TCP/IP and HTTP. If you need to access CICS environments using LU6.2, you need to use Host Integration Server (HIS). For more information, see [Integrate CICS programs on IBM mainframes with Standard workflows in Azure Logic Apps using the IBM CICS connector](../connectors/integrate-cics-apps-ibm-mainframe.md).

#### IBM DB2

This Azure Logic Apps connector for DB2 enables connections between Standard workflows and DB2 databases that are either on premises or in Azure. The connector offers enterprise IT professionals and developers direct access to vital information stored in DB2 database management systems. For more information, see [Access and manage IBM DB2 resources using Azure Logic Apps](../connectors/connectors-create-api-db2.md).

#### IBM Host Files

This Azure Logic Apps "connector" for Host Files provides a thin wrapper around the "Flat File Parser" feature in Host Integration Server. This offline "connector" provides operations that parse or generate binary data to and from host files. These operations require this data to come from any trigger or another action that produces binary data. For more information, see [Parse and generate IBM host files using Azure Logic Apps](../connectors/integrate-host-files-ibm-mainframe.md).

#### IBM Information Management System (IMS)

This Azure Logic Apps connector for IMS uses the IBM IMS Connect component, which provides high performance access from Standard workflows to IMS transactions using TCP/IP. This model uses the IMS message queue for processing data. For more information, see [Integrate IMS programs on IBM mainframes with Standard workflows in Azure Logic Apps using the IBM IMS connector](../connectors/integrate-ims-apps-ibm-mainframe.md).

#### IBM MQ

This Azure Logic Apps connector for MQ enables connections between Standard workflows and IBM MQ servers on premises or in Azure. Microsoft also provides IBM MQ integration capabilities with Host Integration Server and BizTalk Server. For more information, see [Connect to an IBM MQ server from a workflow in Azure Logic Apps](../connectors/connectors-create-api-mq.md).

## How to modernize mainframe workloads with Azure Logic Apps?

While multiple approaches for modernization exist, Microsoft recommends modernizing mainframe applications by following an iterative, agile-based model. Mainframes host multiple environments with applications and data. These systems are complex and, in many cases, have been running for over 50 years. So, a successful modernization strategy includes ways to handle the following tasks:

- Maintain the current service level indicators and objectives for your environments.
- Manage coexistence between legacy data along with migrated data.
- Manage application interdependencies.
- Define the future of the mainframe scheduler and jobs.
- Define a strategy for replacing commercial off-the-shelf (COTS) products.
- Conduct hybrid functional and nonfunctional testing activities.
- Maintain external dependencies or interfaces.

The following paths are the most common ways to modernize mainframe applications:

- Big bang

  This approach is largely based on the waterfall software delivery model but with iterations in phases.

- Agile waves

  This approach follows the Agile principles of software engineering.

The choice between these paths depends on your organization's needs and scenarios. Each path has benefits and drawbacks to consider. The following sections provide more information about these modernization approaches.

### Big bang or waterfall

A big bang migration typically has the following phases:

:::image type="content" source="media/mainframe-modernization-overview/waterfall-mainframe.png" alt-text="Conceptual diagram showing big bang migration phases approach." lightbox="media/mainframe-modernization-overview/waterfall-mainframe.png":::

1. **Envisioning**: Kickoff

1. **Planning**: Identify and prepare planning deliverables, such as scope, time, and resources.

1. **Building**: Begins after planning deliverables are approved

   This phase also expects that all the work for dependencies has been identified, and then migration activities can begin. Multiple iterations occur to complete the migration work.

1. **Stabilizing or testing**: Begins when the migrated environment, dependencies, and applications are tested against the test regions in the mainframe environment.

1. **Deploy**: After everything is approved, the migration goes live into production.

Organizations that typically choose this approach focus on locking time, migration scope, and resources. This path sounds like a positive choice but includes the following risks:

- Migrations can take months or even years.

- The analysis that you perform at the start of the migration journey or during planning is no longer accurate because that information is usually outdated.

- Organizations typically focus on having comprehensive documentation to reduce delivery risks for delivery.

  However, the time spent on providing planning artifacts causes exactly the opposite effect. Focusing on planning more than executing tends to create execution delays, which cause increased costs in the long run.

### Agile waves

An Agile approach is results oriented and focused on building software and not planning deliverables. The first stages of an Agile delivery might be chaotic and complex for the organizational barriers that need to break. However, when the migration team matures after several sprints of execution, the journey becomes smoother. The goal is to frequently release features to production and to provide business value sooner than with a big bang approach.

An Agile waves migration typically has the following sprints:

:::image type="content" source="media/mainframe-modernization-overview/mainframe-waves.png" alt-text="Conceptual diagram showing mainframe migration with Agile waves approach." lightbox="media/mainframe-modernization-overview/mainframe-waves.png":::

- Sprint zero (0)

  - Define the team, an initial work backlog, and the core dependencies.
  - Identify the features and a Minimum Viable Product (MVP) to deliver.
  - Kick off mainframe readiness with a selected set of work items or user stories to begin the work.

- Sprint 1, 2, ..., *N*

  Each sprint has a goal where the team maintains a shipping mindset, meaning that they focus on completing migration goals and releasing deliverables to production. The team can use a group of sprints to deliver a specific feature or a wave of features. Each feature includes slices of integration workloads.

:::image type="content" source="media/mainframe-modernization-overview/mainframe-streams.png" alt-text="Conceptual diagram showing mainframe migration with Agile waves per streams." lightbox="media/mainframe-modernization-overview/mainframe-streams.png":::

Shared elements, such as jobs and interdependencies, exist and have impact across the entire environment. A successful strategy focuses on partially enabling jobs, redesigning applications for modernization, and leaving the systems with most interdependencies until the end to first reduce the amount of migration work and then complete the scope of the modernization effort.

## Modernization patterns

Good design includes factors such as consistency and coherence in component design and deployment, maintainability to simplify administration and development, and reusability that allows other applications and scenarios to reuse components and subsystems. For cloud-hosted applications and services, decisions made during the design and implementation phase have a huge impact on quality and the total cost of ownership.

The Azure Architecture Center provides tested [design and implementation patterns](/azure/architecture/patterns/category/design-implementation) that describe the problem that they address, considerations for applying the pattern, and an example based on Microsoft Azure. While multiple design and implementation patterns exist, some of the most relevant patterns for mainframe modernization include the "Anti-corruption Layer", "Strangler Fig", "Saga", and "Choreography" patterns.

### Anti-corruption Layer pattern

Regardless which modernization approach that you select, you need to implement an "anti-corruption layer" using Azure Logic Apps. This service becomes the façade or adapter layer between the mainframe legacy system and Azure. For an effective approach, identify the mainframe workloads to integrate or coexist as mainframe integration workloads. Create a strategy for each integration workload, which is the set of interfaces that you need to enable for migrating a mainframe application. 

:::image type="content" source="media/mainframe-modernization-overview/anti-corruption-pattern.png" alt-text="Conceptual diagram showing the Anti-corruption Layer pattern." lightbox="media/mainframe-modernization-overview/anti-corruption-pattern.png":::

For more information, see [Anti-corruption Layer](/azure/architecture/patterns/anti-corruption-layer).

### Strangler Fig pattern

After you implement the anti-corruption layer, modernization progressively happens. For this phase, you need to use the "Strangler Fig" pattern where you identify mainframe workloads or features that you can incrementally modernize. For example, if you choose to modernize a CICS application, you have to modernize not only the CICS programs, but most likely the 3270 applications along with their corresponding external dependencies, data, and jobs.

Eventually, after you replace all the workloads or features in the mainframe system with your new system, you'll finish the migration process, which means that you can decommission your legacy system.

:::image type="content" source="media/mainframe-modernization-overview/strangler-fig-pattern.png" alt-text="Conceptual diagram showing the Strangler Fig pattern." lightbox="media/mainframe-modernization-overview/strangler-fig-pattern.png":::

For more information, see [Strangler Fig pattern](/azure/architecture/patterns/strangler-fig).

### Saga and Choreography patterns

Distributed transactions such as the two-phase commit (2PC) protocol require that all participants in a transaction to commit or roll back before the transaction can proceed. Cloud hybrid architectures work better following an eventual consistency paradigm rather than a distributed transaction model.

The "Saga" design pattern is a way to manage consistency across services in distributed transaction scenarios. A *saga* is a sequence of transactions that updates each service and publishes a message or event to trigger the next transaction step. If a step fails, the saga executes compensating transactions that counteract the preceding transactions. For more information, see [Saga distributed transactions pattern](/azure/architecture/reference-architectures/saga/saga).

In Azure Logic Apps, workflows can act as choreographers to coordinate sagas. Workflow actions are atomic, so you can rerun them individually. The **Scope** action type provides the capability to run a group of actions only after another group of actions succeed or fail. Azure Logic Apps conducts compensating transactions at the scope level, while Azure Event Grid and Azure Service Bus provide the event management required for specific domains. All these services, which make up Azure Integration Services, provide the support required by customers when they need a reliable integration platform for mission critical scenarios. For more information, see [Choreography pattern](/azure/architecture/patterns/choreography).

:::image type="content" source="media/mainframe-modernization-overview/saga-pattern.png" alt-text="Conceptual diagram showing the SAGA pattern." lightbox="media/mainframe-modernization-overview/saga-pattern.png":::

While this article covers several modernization patterns, complex solutions require many more patterns and that you clearly understand your organization's modernization goals. Although the task to extend the value of legacy assets is challenging, this option is the best way to preserve investment in these assets and prolong their business value.

## Next steps

- [Azure Architecture Center for mainframes and midrange systems](/azure/architecture/browse/?terms=mainframe)
