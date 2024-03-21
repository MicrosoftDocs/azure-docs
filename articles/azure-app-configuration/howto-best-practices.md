---
title: Azure App Configuration best practices | Microsoft Docs
description: Learn best practices while using Azure App Configuration. Topics covered include key groupings, key-value compositions, App Configuration bootstrap, and more.
services: azure-app-configuration
author: zhenlan
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 02/20/2024
ms.author: zhenlwa
ms.custom: "devx-track-csharp, mvc"
---

# Azure App Configuration best practices

This article discusses common patterns and best practices when you're using Azure App Configuration.

## Key groupings

App Configuration provides two options for organizing keys:

* Key prefixes
* Labels

You can use either one or both options to group your keys.

*Key prefixes* are the beginning parts of keys. You can logically group a set of keys by using the same prefix in their names. Prefixes can contain multiple components connected by a delimiter, such as `/`, similar to a URL path, to form a namespace. Such hierarchies are useful when you're storing keys for many applications and microservices in one App Configuration store.

An important thing to keep in mind is that keys are what your application code references to retrieve the values of the corresponding settings. Keys shouldn't change, or else you'll have to modify your code each time that happens.

*Labels* are an attribute on keys. They're used to create variants of a key. For example, you can assign labels to multiple versions of a key. A version might be an iteration, an environment, or some other contextual information. Your application can request an entirely different set of key-values by specifying another label. As a result, all key references remain unchanged in your code.

## Key-value compositions

App Configuration treats all keys stored with it as independent entities. App Configuration doesn't attempt to infer any relationship between keys or to inherit key-values based on their hierarchy. You can aggregate multiple sets of keys, however, by using labels coupled with proper configuration stacking in your application code.

Let's look at an example. Suppose you have a setting named **Asset1**, whose value might vary based on the development environment. You create a key named "Asset1" with an empty label and a label named "Development". In the first label, you put the default value for **Asset1**, and you put a specific value for "Development" in the latter.

In your code, you first retrieve the key-values without any labels, and then you retrieve the same set of key-values a second time with the "Development" label. When you retrieve the values the second time, the previous values of the keys are overwritten. The .NET configuration system allows you to "stack" multiple sets of configuration data on top of each other. If a key exists in more than one set, the last set that contains it is used. With a modern programming framework, such as .NET, you get this stacking capability for free if you use a native configuration provider to access App Configuration. The following code snippet shows how you can implement stacking in a .NET application:

```csharp
// Augment the ConfigurationBuilder with Azure App Configuration
// Pull the connection string from an environment variable
configBuilder.AddAzureAppConfiguration(options => {
    options.Connect(configuration["connection_string"])
           .Select(KeyFilter.Any, LabelFilter.Null)
           .Select(KeyFilter.Any, "Development");
});
```

[Use labels to enable different configurations for different environments](./howto-labels-aspnet-core.md) provides a complete example.

## References to external data

App Configuration is designed to store any configuration data that you would normally save in configuration files or environment variables. However, some types of data may be better suited to reside in other sources. For example, store secrets in Key Vault, files in Azure Storage, membership information in Microsoft Entra groups, or customer lists in a database.

You can still take advantage of App Configuration by saving a reference to external data in a key-value. You can [use content type](./concept-key-value.md#use-content-type) to differentiate each data source. When your application reads a reference, it loads the actual data from the referenced source, assuming it has the necessary permission to the source. If you change the location of your external data, you only need to update the reference in App Configuration instead of updating and redeploying your entire application.

The App Configuration [Key Vault reference](use-key-vault-references-dotnet-core.md) feature is an example in this case. It allows the secrets required for an application to be updated as necessary while the underlying secrets themselves remain in Key Vault.

## App Configuration bootstrap

To access an App Configuration store, you can use its connection string, which is available in the Azure portal. Because connection strings contain credential information, they're considered secrets. These secrets need to be stored in Azure Key Vault, and your code must authenticate to Key Vault to retrieve them.

A better option is to use the managed identities feature in Microsoft Entra ID. With managed identities, you need only the App Configuration endpoint URL to bootstrap access to your App Configuration store. You can embed the URL in your application code (for example, in the *appsettings.json* file). See [Use managed identities to access App Configuration](howto-integrate-azure-managed-service-identity.md) for details.

## Azure Kubernetes Service access to App Configuration

The following options are available for workloads hosted in Azure Kubernetes Service (AKS) to access Azure App Configuration. These options also apply to Kubernetes in general.

* **Add [Azure App Configuration Kubernetes Provider](./quickstart-azure-kubernetes-service.md) to your AKS cluster.** The Kubernetes provider runs as a pod in the cluster. It can construct ConfigMaps and Secrets from key-values and Key Vault references in your App Configuration store. The ConfigMap and Secret are consumable as environment variables or mounted files without requiring any modifications to your application code. If you have multiple applications running in the same AKS cluster, they can all access the generated ConfigMaps and Secrets, eliminating the need for individual requests to App Configuration. The Kubernetes provider also supports dynamic configuration updates. This is the recommended option if feasible for you.

* **Update your application to use Azure App Configuration provider libraries.** The provider libraries are available in many frameworks and languages, such as [ASP.NET](./quickstart-aspnet-core-app.md), [.NET](./quickstart-dotnet-core-app.md), [Java Spring](./quickstart-java-spring-app.md), [JavaScript/Node.js](./quickstart-javascript-provider.md), and [Python](./quickstart-python-provider.md). This approach gives you full access to App Configuration's functionalities, including dynamic configuration and feature management. You have granular control of what data to load and from which App Configuration store for each application.

* **[Integrate with Kubernetes deployment using Helm](./integrate-kubernetes-deployment-helm.md).** If you do not wish to update your application or add a new pod to your AKS cluster, you have the option of bringing data from App Configuration to your Kubernetes cluster by using Helm via deployment. This approach enables your application to continue accessing configuration from Kubernetes variables and Secrets. You can run Helm upgrade whenever you want your application to incorporate new configuration changes.

## App Service or Azure Functions access to App Configuration

Use the App Configuration provider or SDK libraries to access App Configuration directly in your application. This approach gives you full access to App Configuration's functionalities, including dynamic configuration and feature management. Your application running on App Service or Azure Functions can obtain access to your App Configuration store via any of the following methods:

* Enable managed identity on your App Service or Azure Functions and grant it access to your App Configuration store. For more information, see [Use managed identities to access App Configuration](howto-integrate-azure-managed-service-identity.md).
* Store the connection string to your App Configuration store in the *Application settings* of App Service or Azure Functions. For enhanced security, store the connection string in Key Vault and [reference it from App Service or Azure Functions](../app-service/app-service-key-vault-references.md).

You can also make your App Configuration data accessible to your application as *Application settings* or environment variables. With this approach, you can avoid changing your application code.

* Add references to your App Configuration data in the *Application settings* of your App Service or Azure Functions. App Configuration offers tools to [export a collection of key-values as references](howto-import-export-data.md#export-data-to-azure-app-service) at once. For more information, see [Use App Configuration references for App Service and Azure Functions](../app-service/app-service-configuration-references.md).
* [Export your App Configuration data](howto-import-export-data.md#export-data-to-azure-app-service) to the *Application settings* of your App Service or Azure Functions without selecting the option of export-as-reference. Export your data again every time you make new changes in App Configuration if you like your application to pick up the change.

## Reduce requests made to App Configuration

Excessive requests to App Configuration can result in throttling or overage charges. To reduce the number of requests made:

* Increase the refresh timeout, especially if your configuration values do not change frequently. Specify a new refresh timeout using the [`SetCacheExpiration` method](/dotnet/api/microsoft.extensions.configuration.azureappconfiguration.azureappconfigurationrefreshoptions.setcacheexpiration).

* Watch a single *sentinel key*, rather than watching individual keys. Refresh all configuration only if the sentinel key changes. See [Use dynamic configuration in an ASP.NET Core app](enable-dynamic-configuration-aspnet-core.md) for an example.

* Use Azure Event Grid to receive notifications when configuration changes, rather than constantly polling for any changes. For more information, see [Use Event Grid for App Configuration data change notifications](./howto-app-configuration-event.md).

* [Enable geo-replication](./howto-geo-replication.md) of your App Configuration store and spread your requests across multiple replicas. For example, use a different replica from each geographic region for a globally deployed application. Each App Configuration replica has its separate request quota. This setup gives you a model for scalability and enhanced resiliency against transient and regional outages.

## Importing configuration data into App Configuration

App Configuration offers the option to bulk [import](./howto-import-export-data.md) your configuration settings from your current configuration files using either the Azure portal or CLI. You can also use the same options to export key-values from App Configuration, for example between related stores. If you’d like to set up an ongoing sync with your repo in GitHub or Azure DevOps, you can use our [GitHub Action](./concept-github-action.md) or [Azure Pipeline Push Task](./push-kv-devops-pipeline.md) so that you can continue using your existing source control practices while getting the benefits of App Configuration.

## Multi-region deployment in App Configuration

If your application is deployed in multiple regions, we recommend that you [enable geo-replication](./howto-geo-replication.md) of your App Configuration store. You can let your application primarily connect to the replica matching the region where instances of your application are deployed and allow them to fail over to replicas in other regions. This setup minimizes the latency between your application and App Configuration, spreads the load as each replica has separate throttling quotas, and enhances your application's resiliency against transient and regional outages. See [Resiliency and Disaster Recovery](./concept-disaster-recovery.md) for more information.

## Building applications with high resiliency

Applications often rely on configuration to start, making Azure App Configuration's high availability critical. For improved resiliency, applications should leverage App Configuration's reliability features and consider taking the following measures based on your specific requirements. 

* **Provision in regions with Azure availability zone support.** Availability zones allow applications to be resilient to data center outages. App Configuration offers zone redundancy for all customers without any extra charges. Creating your App Configuration store in regions with support for availability zones is recommended. You can find [a list of regions](./faq.yml#how-does-app-configuration-ensure-high-data-availability) where App Configuration has enabled availability zone support.
* **[Enable geo-replication](./howto-geo-replication.md) and allow your application to failover among replicas.** This setup gives you a model for scalability and enhanced resiliency against transient failures and regional outages. See [Resiliency and Disaster Recovery](./concept-disaster-recovery.md) for more information.
* **Deploy configuration with [safe deployment practices](/azure/well-architected/operational-excellence/safe-deployments).** Incorrect or accidental configuration changes can frequently cause application downtime. You should avoid making configuration changes that impact the production directly from, for example, the Azure portal whenever possible. In safe deployment practices (SDP), you use a progressive exposure deployment model to minimize the potential blast radius of deployment-caused issues. If you adopt SDP, you can build and test a [configuration snapshot](./howto-create-snapshots.md) before deploying it to production. During the deployment, you can update instances of your application to progressively pick up the new snapshot. If issues are detected, you can roll back the change by redeploying the last-known-good (LKG) snapshot. The snapshot is immutable, guaranteeing consistency throughout all deployments. You can utilize snapshots along with dynamic configuration. Use a snapshot for your foundational configuration and dynamic configuration for emergency configuration overrides and feature flags.
* **Include configuration with your application.** If you want to ensure that your application always has access to a copy of the configuration, or if you prefer to avoid a runtime dependency on App Configuration altogether, you can pull the configuration from App Configuration during build or release time and include it with your application. To learn more, check out examples of integrating App Configuration with your [CI/CD pipeline](./integrate-ci-cd-pipeline.md) or [Kubernetes deployment](./integrate-kubernetes-deployment-helm.md).
* **Use App Configuration providers.** Applications play a critical part in achieving high resiliency because they can account for issues arising during their runtime, such as networking problems, and respond to failures more quickly. The App Configuration providers offer a range of built-in resiliency features, including automatic replica discovery, replica failover, startup retries with customizable timeouts, configuration caching, and adaptive strategies for reliable configuration refresh. It's highly recommended that you use App Configuration providers to benefit from these features. If that's not an option, you should consider implementing similar features in your custom solution to achieve the highest level of resiliency.

## Client applications in App Configuration 

When you use App Configuration in client applications, ensure that you consider two major factors. First, if you're using the connection string in a client application, you risk exposing the access key of your App Configuration store to the public. Second, the typical scale of a client application might cause excessive requests to your App Configuration store, which can result in overage charges or throttling. For more information about throttling, see the [FAQ](./faq.yml#are-there-any-limits-on-the-number-of-requests-made-to-app-configuration).

To address these concerns, we recommend that you use a proxy service between your client applications and your App Configuration store. The proxy service can securely authenticate with your App Configuration store without a security issue of leaking authentication information. You can build a proxy service by using one of the App Configuration provider libraries, so you can take advantage of built-in caching and refresh capabilities for optimizing the volume of requests sent to App Configuration. For more information about using App Configuration providers, see articles in Quickstarts and Tutorials. The proxy service serves the configuration from its cache to your client applications, and you avoid the two potential issues that are discussed in this section.

## Multitenant applications in App Configuration

A multitenant application is built on an architecture where a shared instance of your application serves multiple customers or tenants. For example, you may have an email service that offers your users separate accounts and customized experiences. Your application usually manages different configurations for each tenant. Here are some architectural considerations for [using App Configuration in a multitenant application](/azure/architecture/guide/multitenant/service/app-configuration).

## Configuration as Code

Configuration as code is a practice of managing configuration files under your source control system, for example, a git repository. It gives you benefits like traceability and approval process for any configuration changes. If you adopt configuration as code, App Configuration has tools to assist you in [managing your configuration data in files](./concept-config-file.md) and deploying them as part of your build, release, or CI/CD process. This way, your applications can access the latest data from your App Configuration store(s).

- For GitHub, you can enable the [App Configuration Sync GitHub Action](concept-github-action.md) for your repository. Changes to configuration files are synchronized to App Configuration automatically whenever a pull request is merged. 
- For Azure DevOps, you can include the [Azure App Configuration Push](push-kv-devops-pipeline.md), an Azure pipeline task, in your build or release pipelines for data synchronization. 
- You can also import configuration files to App Configuration using Azure CLI as part of your CI/CD system. For more information, see [az appconfig kv import](scripts/cli-import.md).

This model allows you to include validation and testing steps before committing data to App Configuration. If you use multiple App Configuration stores, you can also push the configuration data to them incrementally or all at once.

## Next steps

* [Keys and values](./concept-key-value.md) 
