---
title: DevOps deployment for single-tenant Azure Logic Apps (preview)
description: Learn about DevOps deployment for single-tenant Azure Logic Apps (preview).
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 05/10/2021

# As a developer, I want to learn about DevOps deployment support for single-tenant Azure Logic Apps.
---

# DevOps deployment for single-tenant Azure Logic Apps (preview)

With the trend towards distributed and native cloud apps, organizations are dealing with more distributed components across more environments. To maintain control and consistency, you can automate your environments and deploy more components faster and more confidently by using DevOps tools and processes.

This article provides an introduction and overview about the current continuous integration and continuous deployment (CI/CD) experience for single-tenant Azure Logic Apps.

<a name="single-tenant-versus-multi-tenant"></a>

## Single-tenant versus multi-tenant

In the original multi-tenant Logic Apps, resource deployment is based on Azure Resource Manager (ARM) templates, which combine and handle resource provisioning for both logic apps and infrastructure. In single-tenant Logic Apps, deployment becomes easier because you can use separate provisioning between apps and infrastructure.

When you create logic apps using the **Logic App (Preview)** resource type, your workflows are powered by the redesigned Azure Logic Apps (Preview) runtime. This runtime uses the [Azure Functions extensibility model](../azure-functions/functions-bindings-register.md) extensibility and is [hosted as an extension on the Azure Functions runtime](https://techcommunity.microsoft.com/t5/integrations-on-azure/azure-logic-apps-running-anywhere-runtime-deep-dive/ba-p/1835564). This design provides portability, flexibility, and more performance for your logic apps plus other capabilities and benefits inherited from the Azure Functions platform and Azure App Service ecosystem.

For example, you can package the redesigned runtime and workflows together as part of your logic app. You can use generic steps or tasks that build, assemble, and zip your logic app resources into ready-to-deploy artifacts. To deploy your apps, copy the artifacts to the host environment and then start your apps to run your workflows. Or, integrate your artifacts into deployment pipelines using the tools and processes that you already know and use. For example, if your scenario requires containers, you can containerize your logic apps and integrate them into your existing pipelines.

To set up and deploy your infrastructure resources, such as virtual networks and connectivity, you can continue using ARM templates and separately provision those resources along with other processes and pipelines that you use for those purposes. 

By using standard build and deploy options, you can focus on app development separately from infrastructure deployment. As a result, you get a more generic project model where you can apply many similar or the same deployment options that you use for a generic app. You also benefit from a more consistent experience for building deployment pipelines around your app projects and for running the required tests and validations before publishing to production. No matter which technology stack you use, you can deploy logic apps using your own chosen tools.

<a name="devops-deployment-features"></a>

## DevOps deployment capabilities

Single-tenant Logic Apps inherits many capabilities and benefits from the Azure Functions platform and Azure App Service ecosystem. These updates include a whole new deployment model and more ways to use DevOps for your logic app workflows.

<a name="local-development-testing"></a>

### Local development and testing

When you use Visual Studio Code with the Azure Logic Apps (Preview) extension, you can locally develop, build, and run **Logic App (Preview)** workflows in your development environment without having to deploy to Azure. You can also run your workflows anywhere that Azure Functions can run. For example, if your scenario requires containers, you can containerize your logic apps and deploy as Docker containers.

This capability is a major improvement and provides a substantial benefit compared to the multi-tenant model, which requires you to develop against an existing and running resource in Azure.

<a name="separate-concerns"></a>

### Separate concerns

The single-tenant model gives you the capability to separate the concerns between app and the underlying infrastructure. For example, you can develop, build, zip, and deploy your app separately as an immutable artifact to different environments. Logic app workflows typically have "application code" that you update more often than the underlying infrastructure. By separating these layers, you can focus more on building out your logic app's workflow and spend less on your effort to deploy the required resources across multiple environments.

![Conceptual diagram showing separate deployment pipelines for apps and infrastructure.](./media/devops-deployment-single-tenant/deployment-pipelines-logic-apps.png)

<a name="resource-structure"></a>

### Resource structure

Single-tenant Logic Apps introduces a new resource structure where your logic app can host multiple workflows. This structure differs from the multi-tenant version where you have a 1:1 mapping between logic app resource and workflow. With this 1-to-many relationship, workflows in the same logic app can share and reuse other resources. Plus, these workflows also benefit from improved performance due to shared tenancy and proximity to each other.

This resource structure looks and works similarly to Azure Functions where a function app can host many functions. If you're working in a logic app project within Visual Studio Code, your project folder and file structure looks like the following example:

```text
MyLogicAppProjectName
| .vscode
| Artifacts
   || Maps 
        ||| MapName1
        ||| ...
   || Schemas
        ||| SchemaName1
        ||| ...
| WorkflowName1
   || workflow.json
   || ...
| WorkflowName2
   || workflow.json
   || ...
| connections.json
| host.json
| local.settings.json
| SharedCode
| Dockerfile
```

At your project's root level, you can find the following files and folders, along with other items depending on your project is extension bundle-based (Node.js), which is the default, or is NuGet package-based (.NET).

| Name | Folder or file | Description |
|------|---------------------------|-------------|
| .vscode | Folder | Contains Visual Studio Code-related settings files, such as extensions.json, launch.json, settings.json, and tasks.json files (TODO: MORE INFO REQUIRED HERE) |
| Artifacts | Folder | Contains integration account artifacts that you define and use in workflows that support business-to-business (B2B) scenarios. For example, the sample structure includes maps and schemas for XML transform and validation operations. |
| <WorkflowName> | Folder | For each workflow, the <WorkflowName> folder includes a workflow.json file, which contains that workflow's underlying JSON definition. |
| workflow-designtime | Folder | Contains design-time related settings files, such as host.json and local.settings.json (TODO: MORE INFO REQUIRED HERE) |
| .funcignore | File | **(TODO: MORE INFO REQUIRED HERE)** |
| .gitignore | File | **(TODO: MORE INFO REQUIRED HERE)** |
| connections.json | File | Contains the metadata, endpoints, and keys for any managed connections and Azure functions that your workflows use. <p><p>**Important**: To use different connections and functions for each environment, make sure that you parameterize this **connections.json** file and update the endpoints. |
| host.json | File | Contains runtime-specific configuration settings and values, for example, the default limits for the single-tenant Logic Apps service, logic apps, workflows, triggers, and actions. |
| local.settings.json | File | **(TODO: MORE INFO REQUIRED HERE)** |
| SharedCode | Folder | **(TODO: MORE INFO REQUIRED HERE)** |
| Dockerfile | Folder | Contains one or more Dockerfiles to use for deploying the logic app as a container. |
||||

For example, to create custom built-in operations, you must have a NuGet based project, not an extension bundle-based project. A NuGet-based project includes a .bin folder that contains packages and other library files that your app needs, while a bundle-based project doesn't include this folder and files. For more information about converting your project to use NuGet, review [Enable built-connector authoring](create-stateful-stateless-workflows-visual-studio-code.md#enable-built-in-connector-authoring).

For more information and best practices about how to best organize workflows in your logic app, performance, and scaling, review the similar [guidance for Azure Functions](../azure-functions/functions-best-practices.md) that you can generally apply to single-tenant Logic Apps.

<a name="deployment-containers"></a>

### Container deployment

Single-tenant Logic Apps supports deployment to containers, which means that you can containerize your logic app workflows and run them anywhere that containers can run. After you containerize your app, deployment works mostly the same as any other container you deploy and manage.
 
For examples that include Azure DevOps, review [CI/CD for Containers](https://azure.microsoft.com/solutions/architecture/cicd-for-containers/). For more information about containerizing logic apps and deploying to Docker, review [Deploy your logic app to a Docker container from Visual Studio Code](create-stateful-stateless-workflows-visual-studio-code.md#deploy-to-docker).

<a name="app-settings-parameters"></a>

### App settings and parameters

In multi-tenant Logic Apps, maintaining environment variables for logic apps across poses a challenge across various dev, test, and production environments. Everything in an ARM template is defined at deployment. If you need to change just a single variable, you have to redeploy everything.

In the single-tenant Logic Apps service, you can call and reference your environment variables at runtime by using app settings and parameters, so you don't have to redeploy as often.

<a name="managed-connectors-built-in-operations"></a>

## Managed connectors and built-in operations

The Azure Logic Apps ecosystem provides [hundreds of Microsoft-managed connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) and built-in operations as part of a constantly growing collection that you can use in the single-tenant Logic Apps service. The way that Microsoft maintains these connectors and built-in operations stays mostly the same in single-tenant Logic Apps.

The most significant improvement is that the single-tenant service makes more popular managed connectors also available as built-in operations. For example, you can use built-in operations for Azure Service Bus, Azure Event Hubs, SQL, and others. Meanwhile, the managed connector versions are still available and continue to work.

The connections that you create using built-in operations are called built-in connections, or *service provider connections*. Built-in operations and their connections run locally in the same process that runs your workflows. Both are hosted on the redesigned Logic Apps runtime. In contrast, managed connections, or API connections, are created and run separately as Azure resources, which you deploy using ARM templates. As a result, built-in operations and their connections provide better performance due to their proximity to your workflows. This design also works well with deployment pipelines because the service provider connections are packaged into the same build artifact.

In Visual Studio Code, when you use the designer to develop or make changes to your workflows, the Logic Apps engine automatically generates any necessary connection metadata in your project's **connections.json** file. The following sections describe the three kinds of connections that you can create in your workflows. Each connection type has a different JSON structure, which is important to understand because endpoints change when you move between environments.

<a name="service-provider-connections"></a>

### Service provider connections

When you use a built-in operation for a service such as Azure Service Bus or Azure Event Hubs in the single-tenant Logic Apps service, you create a service provider connection that runs in the same process as your workflow. This connection infrastructure is hosted and managed as part of your logic app, and your app settings store the connection strings for any service provider-based built-in operation that your workflows use.

In your logic app project, each workflow has a workflow.json file that contains the workflow's underlying JSON definition. This workflow definition then references the necessary connection strings in your project's connections.json file.

The following example shows how the service provider connection for a built-in Service Bus operation appears in your project's connections.json file:

```json
"serviceProviderConnections": {
   "{service-bus-connection-name}": {
      "parameterValues": {
         "connectionString": "@appsetting('servicebus_connectionString')"
      },
      "serviceProvider": {
         "id": "/serviceProviders/serviceBus"
      },
      "displayName": "{service-bus-connection-name}"
   },
   ...
}
```

<a name="managed-connections"></a>

### Managed connections

When you use a managed connector for the first time in your workflow, you're prompted to create a managed API connection for the target service or system and authenticate your identity. These connectors are managed by the shared connectors ecosystem in Azure. The API connections exist and run as separate resources in Azure.

In Visual Studio Code, while you continue to create and develop your workflow using the designer, the Logic Apps engine automatically creates the necessary resources in Azure for the managed connectors in your workflow. The engine automatically adds these connection resources to the Azure resource group that you designed to contain your logic app.

The following example shows how an API connection for the managed Service Bus connector appears in your project's connections.json file:

```json
"managedApiConnections": {
   "{service-bus-connection-name}": { 
      "api": {
         "id": "/subscriptions/{subscription-ID}/providers/Microsoft.Web/locations/{region}/managedApis/servicebus"
      },
      "connection": { 
         "id": "/subscriptions/{subscription-ID}/resourcegroups/{resource-group-name}/providers/Microsoft.Web/connections/servicebus"
      }, 
      "connectionRuntimeUrl": "{connection-runtime-URL}",
      "authentication": { 
         "type": "Raw",
         "scheme": "Key",
         "parameter": "@appsetting('servicebus_1-connectionKey')"
      },
   },
   ...
}
```

<a name="azure-functions-connections"></a>

### Azure Functions connections

To call functions created and hosted in Azure Functions, you use the built-in Azure Functions operation. Connection metadata for Azure Functions calls is different from other built-in-connections. This metadata is stored in your logic app project's connections.json file, but looks different:

```json
"functionConnections": {
   "{function-operation-name}": {
      "function": { 
         "id": "/subscriptions/{subscription-ID}/resourceGroups/{resource-group-name}/providers/Microsoft.Web/sites/{function-app-name}/functions/{function-name}"
      },
      "triggerUrl": "{function-url}",
      "authentication": {
        "type": "QueryString",
         "name": "Code",
         "value": "@appsetting('azureFunctionOperation_functionAppKey')"
      }, 
      "displayName": "{functions-connection-display-name}"
   },
   ...
}
```

## Authentication

In the single-tenant Logic Apps service, the hosting model for logic app workflows is a single tenant where your workloads benefit from more isolation than in the multi-tenant version. Plus, the service runtime is portable, which means you can run your workflows anywhere that Azure Functions can run. Still, this design requires a way for logic apps to authenticate their identity so they can access the managed connector ecosystem in Azure. Your apps also need the correct permissions to run operations when using managed connections.

By default, each single-tenant logic app has an automatically enabled system-assigned managed identity. This identity differs from the authentication credentials or connection string used for creating a connection. At runtime, your logic app uses this identity to authenticate its connections through Azure access policies. If you disable this identity, connections won't work at runtime.

The following sections provide more information about the authentication types that you can use to authenticate managed connections, based on where your logic app runs. For each managed connection, your logic app project's connections.json file has an `authentication` object that specifies the authentication type that your logic app can use to authenticate that managed connection.

### Managed identity

For a logic app that is hosted and run in Azure, a [managed identity](create-managed-service-identity.md) is the default and recommended authentication type to use for authenticating managed connections that are hosted and run in Azure. In your logic app project's connections.json file, the managed connection has an `authentication` object that specifies `ManagedServiceIdentity` as the authentication type:

```json
"authentication": {
   "type": "ManagedServiceIdentity"
}
```

### Raw

For logic apps that run in your local development environment using Visual Studio Code, raw authentication keys are used for authenticating managed connections that are hosted and run in Azure. These keys are designed for development use only, not production, and have a 7-day expiration. In your logic app project's connections.json file, the managed connection has an `authentication` object specifies the following the authentication information:

```json
"authentication": {
   "type": "Raw", 
   "scheme": "Key", 
   "parameter": "@appsetting('connectionKey')"
 }
```

## Next steps

* [Set up DevOps deployment for single-tenant Azure Logic Apps (Preview)](set-up-devops-deployment-single-tenant-azure-logic-apps.md)

We'd like to hear about your experiences with the preview logic app resource type and preview single-tenant model!

- For bugs or problems, [create your issues in GitHub](https://github.com/Azure/logicapps/issues).
- For questions, requests, comments, and other feedback, [use this feedback form](https://aka.ms/logicappsdevops).