---
title: Power Automate migration
description: Learn about the benefits and capabilities that you gain when you migrate flows from Microsoft Power Automate to Standard workflows in Azure Logic Apps.
ms.suite: integration
ms.service: azure-logic-apps
services: logic-apps
author: kewear
ms.author: kewear
ms.reviewer: estfan, azla
ms.date: 02/04/2025
ms.topic: conceptual
---

# Power Automate migration to Azure Logic Apps (Standard)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

Many development teams increasingly need to build scalable, secure, and efficient automation solutions. Perhaps your team also faces the strategic choice whether to migrate your flows in Microsoft Power Automate to Standard workflows in Azure Logic Apps. Both Power Automate and Azure Logic Apps provide powerful automation platforms and tools. However, for enterprises that run complex, high-volume, and security-sensitive workloads, Azure Logic Apps (Standard) offers many key advantages.

This guide outlines the advantages gained from transitioning to Azure Logic Apps (Standard). <!--, especially when you use the migration tool designed to support this process.-->

## Migration benefits

Azure Logic Apps (Standard) provides the following benefits by providing capabilities that support enterprise-level scenarios and needs. The following table lists some high-level examples:

| Benefits | Capabilities |
|----------|--------------|
| Flexible integration and development tools | - Browser-based development using the Azure portal <br>- Local development, debugging, and testing with Visual Studio Code <br>- 1,400+ connectors for Microsoft, Azure, and other services, systems, apps, and data <br><br>For more information, see [Integration and development](#integration-development). |
| Enhanced security and compliance | - Virtual network integration <br>- Private endpoints <br>- Managed identity authentication <br>- Microsoft Entra ID <br>- Role-based access control (RBAC) <br><br>For more information, see [Security and compliance first](#security-compliance). |
| Improved performance and scalability | - Dedicated compute resources <br>- Elastic scaling <br>- Parallel processing <br>- Low latency <br><br>For more information, see [Performance and scalability](#performance-scalability). |
| Robust business continuity and disaster recovery (BCDR) capabilities | - Automated backups <br>- Geo-redundancy <br>- High availability with built-in redundancy <br><br>For more information, see [Business continuity and disaster recovery](#business-continuity-disaster-recovery). |
| Version control with CI/CD <br>(continuous integration and deployment) | - Seamless integration with Git repositories, which provide change tracking, branching, and team collaboration in Azure DevOps or GitHub <br><br>- Automate deployment with CI/CD pipelines and infrastructure as code (ARM templates and Bicep templates) <br><br>For more information, see [Version control with CI/CD](#version-control-ci-cd). |

<!--
| Migration tool support | - Convert Power Automate flows into Standard workflow configurations for Azure Logic Apps, preserving your flow's logic and functionality. <br><br>- Test and validate converted workflows using functional testing, connector testing, performance testing, and security validation to ensure workflow continuity and performance. <br><br>For more information, see [Migration tool support](#migration-tool). |
-->

For more detailed capability information and comparisons, see [Compare capability details](#compare-capabilities).

<a name="integration-development"></a>

#### Integration and development

Azure Logic Apps excels at helping you integrate your workflows with an expansive range of services, systems, apps, and data and by supporting tools that help speed your development process.

- Development tools and reusability

  - Visually build workflows using a browser-based designer that includes an expression editor, or use the JSON code editor in the Azure portal.

    :::image type="content" source="media/power-automate-migration/workflow-designer.png" alt-text="Screenshot shows Azure portal and workflow designer.":::

  - Build modular, reusable components with logic app projects in Visual Studio Code when you use the Azure Logic Apps (Standard) extension. These components help you reduce development time and make sure that you have consistency across projects.

    :::image type="content" source="media/power-automate-migration/logic-app-project.png" alt-text="Screenshot shows Visual Studio Code, Standard logic app project, and workflow designer.":::

  - Locally create, debug, run, and manage workflows managed by your logic app project in Visual Studio Code when you use the Azure Logic Apps (Standard) extension.

- Extensive connector library

  Choose from over 1,400 Azure-hosted connectors to access cloud services, on-premises systems, apps, and other data sources. Connect even more securely to key services such as SQL Server and Azure Key Vault and in more scalable ways by using built-in operations powered by the Azure Logic Apps runtime.

  For more information, see the following documentation:

  - [Azure-hosted and managed connectors](/connectors/connector-reference/connector-reference-logicapps-connectors)
  - [Runtime-powered, built-in operations](/azure/connectors/built-in)

- Workflow templates gallery

  Create workflows even faster by starting with prebuilt templates for commonly used workload patterns, including ones that support AI data processing and chat completion scenarios.

- Add and run your own code snippets

  Write and run .NET code, C# scripts, or PowerShell scripts from Standard workflows. For more information, see the following resources:

  - [Create and run .NET code from Standard workflows](/azure/logic-apps/create-run-custom-code-functions)
  - [Add and run C# scripts inline with Standard workflows](/azure/logic-apps/add-run-csharp-scripts)
  - [Add and run PowerShell scripts in Standard workflows](/azure/logic-apps/add-run-powershell-scripts)

<a name="security-compliance"></a>

#### Security and compliance first

Enterprises consider security a top priority, so Azure Logic Apps (Standard) provides security features that differ from the capabilities in Power Automate, for example:

- Virtual network integration and private endpoints

  Run Standard workflows inside secure Azure virtual networks, which reduce exposure to the public internet through private endpoints and enhance data security.

- Managed identity authentication

  Eliminate the need to manually manage user credentials, while allowing your workflows to securely access and interact with other Azure services or resources.

- Role-based access control (RBAC)

  Minimize the risks from unauthorized access or changes by assigning granular permissions to your logic app workflows with precisely defined role-based access controls. In Azure Logic Apps, RBAC works at the resource level where you assign role-based access to a specific resource. So, if the workflow creator leaves, you don't lose access to their workflows. For more information, see [Secure access and data for workflows](/azure/logic-apps/logic-apps-securing-a-logic-app#access-to-logic-app-operations) and [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview).

  In Power Automate, RBAC works at the user level. For more information, see [Manage security for Power Automate](/power-automate/desktop-flows/desktop-flows-security#power-automate-specific-security-roles).

- Logging and auditing capabilities

  In Azure Logic Apps, you can use audit trails to track changes and ensure compliance with security standards.

<a name="performance-scalability"></a>

#### Performance and scalability

Azure Logic Apps (Standard) is designed and built for high performance and scalable automation, which makes the platform ideal for large-scale workflows with following capabilities:

- Dedicated compute resources

  A Standard logic app resource can use one of the following hosting options:

  - Single-tenant Azure Logic Apps
  - App Service Environment (ASE) v3
  - Your own infrastructure (hybrid deployment)

  These dedicated compute resources make sure that your workflows experience stable and consistent performance.

  Elastic scaling makes on-demand automatic scaling possible for logic app workflow-related resources and capacity. This scaling optimizes costs and maintains performance even during peak loads.

- Optimized workflow execution

  By default, workflow instances run in parallel or concurrently, which reduces processing time for complex tasks. Performance optimizations for the Azure Logic Apps platform provide lower latency and faster response times.

- High throughput

  Azure Logic Apps efficiently handles high transaction volume without degrading performance as a result from having access to Azure's infrastructure.

<a name="business-continuity-disaster-recovery"></a>

#### Business continuity and disaster recovery (BCDR)

To make sure that workflow operations run without interruption, Azure Logic Apps provides the following comprehensive BCDR capabilities:

- Geo-redundancy

  Multi-region deployment: You can distribute logic app instances across multiple regions to ensure availability even during regional outages, which minimize downtime.

- Automated backups and restore

  Automated regular backup processes make sure that you can quickly restore workflows if failures or accident deletions happen.

- High availability

  Azure Logic Apps (Standard) includes built-in redundancy, which provides high availability to keep your workflows operational even during infrastructure failures.

<a name="version-control-ci-cd"></a>

#### Version control with continuous integration and deployment (CI/CD)

Azure Logic Apps supports robust version control and automated deployment processes through CI/CD pipelines.

- Version control integration 

  Full Git integration for Visual Studio Code projects helps your team work seamlessly with Git repositories, collaborate more easily, and track changes to workflows, manage branches, and so on. Change tracking includes full version history so you can revert to previous workflow versions if necessary.

- CI/CD pipelines for safe deployment practices

  Azure Logic Apps supports automated deployments and integrates with CI/CD tools such as Azure DevOps, which facilitate consistent and less error-prone deployments across environments.

  Define and deploy your logic app workflows with Azure Resource Manager (ARM) templates or Bicep templates (infrastructure as code) by using Azure DevOps, which provides scalable, repeatable deployments that align with DevOps practices.

<a name="zero-downtime-deployments"></a>

#### Zero downtime deployments

For mission-critical logic apps that require continues availability and responsiveness, Azure Logic Apps supports zero downtime deployment when you [set up deployment slots](/azure/logic-apps/set-up-deployment-slots).

<!--
<a name="migration-tool"></a>

## Flow migration tool

This migration tool converts a Power Automate flow into the equivalent Standard logic app workflow configuration.  The tool replicates the flow's logic "as-is", while preserving the flow's structure and functionality in Azure Logic Apps. This approach helps maintain continuity in business processes without the need for complete rework.

However, due to security constraints, the migration tool can't automatically transfer the connections used by the Power Automate flow. While the tool automates most of the flow conversion, you must manually recreate the connections in the logic app workflow. This manual step is necessary to fully meet the security protocols and compliance standards for Azure Logic Apps.

Despite this requirement, the migration tool offers significant time and resource savings by eliminating the need to manually recreate entire workflows. The tool's automated process drastically reduces any other necessary manual effort and shortens the overall migration timeline. With this automation, your team can focus energy on setting up and optmizing connections, not on rebuilding workflows.
-->

### Migration testing and validation

To make sure that your converted flow works with the expected continuity and performance, your migration process requires thorough testing and validation:

| Quality assurance activity | Description |
|----------------------------|-------------|
| Functional testing | Make sure that migrated flows retain their original logic and produce consistent outputs. |
| Connection testing | Manually recreate connections. Follow with rigorous security and functionality testing, especially for services such as SQL Server and Azure Key Vault. |
| Security validation | Comprehensively confirm that workflows meet corporate security policies and Azure's enhanced security standards. |
| Performance testing | Make sure that high-throughput workflows exceed the performance standards for Power Automate. |

<a name="compare-capabilities"></a>

## Compare capability details

The following table provides an in-depth comparison between Azure Logic Apps (Standard), Azure Logic Apps (Consumption), and Power Automate:

[!INCLUDE [power-automate-versus-logic-apps](includes/power-automate-versus-logic-apps.md)]

## Related content

[Microsoft Power Automate documentation](/power-automate)
