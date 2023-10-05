---
title: 'App Service on Azure Arc'
description: An introduction to App Service integration with Azure Arc for Azure operators.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 03/15/2023
author: msangapu-msft
ms.author: msangapu
---

# App Service, Functions, and Logic Apps on Azure Arc (Preview)

You can run App Service, Functions, and Logic Apps on an Azure Arc-enabled Kubernetes cluster. The Kubernetes cluster can be on-premises or hosted in a third-party cloud. This approach lets app developers take advantage of the features of App Service. At the same time, it lets their IT administrators maintain corporate compliance by hosting the App Service apps on internal infrastructure. It also lets other IT operators safeguard their prior investments in other cloud providers by running App Service on existing Kubernetes clusters.

> [!NOTE]
> To learn how to set up your Kubernetes cluster for App Service, Functions, and Logic Apps, see [Create an App Service Kubernetes environment (Preview)](manage-create-arc-environment.md).

In most cases, app developers need to know nothing more than how to deploy to the correct Azure region that represents the deployed Kubernetes environment. For operators who provide the environment and maintain the underlying Kubernetes infrastructure, you must be aware of the following Azure resources:

- The connected cluster, which is an Azure projection of your Kubernetes infrastructure. For more information, see [What is Azure Arc-enabled Kubernetes?](../azure-arc/kubernetes/overview.md).
- A cluster extension, which is a subresource of the connected cluster resource. The App Service extension [installs the required pods into your connected cluster](#pods-created-by-the-app-service-extension). For more information about cluster extensions, see [Cluster extensions on Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/conceptual-extensions.md).
- A custom location, which bundles together a group of extensions and maps them to a namespace for created resources. For more information, see [Custom locations on top of Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/conceptual-custom-locations.md).
- An App Service Kubernetes environment, which enables configuration common across apps but not related to cluster operations. Conceptually, it's deployed into the custom location resource, and app developers create apps into this environment. This resource is described in greater detail in [App Service Kubernetes environment](#app-service-kubernetes-environment).

## Public preview limitations

The following public preview limitations apply to App Service Kubernetes environments. This list of limitations is updated as changes and features are made available.

| Limitation                                              | Details                                                                               |
|---------------------------------------------------------|---------------------------------------------------------------------------------------|
| Supported Azure regions                                 | East US, West Europe                                                                  |
| Cluster networking requirement                          | Must support `LoadBalancer` service type |
| Cluster storage requirement                             | Must have cluster attached storage class available for use by the extension to support deployment and build of code-based apps where applicable                      |
| Feature: Networking                                     | [Not available (rely on cluster networking)](#are-all-networking-features-supported)      |
| Feature: Managed identities                             | [Not available](#are-managed-identities-supported)                                    |
| Feature: Key vault references                           | Not available (depends on managed identities)                                         |
| Feature: Pull images from ACR with managed identity     | Not available (depends on managed identities)                                         |
| Feature: In-portal editing for Functions and Logic Apps | Not available                                                                         |
| Feature: Portal listing of Functions or keys            | Not available if cluster isn't publicly reachable                                    |
| Feature: FTP publishing                                 | Not available                                                                         |
| Logs                                                    | Log Analytics must be configured with cluster extension; not per-site                 |

## Pods created by the App Service extension

When the App Service extension is installed on the Azure Arc-enabled Kubernetes cluster, several pods are created in the release namespace that was specified. These pods enable your Kubernetes cluster to be an extension of the `Microsoft.Web` resource provider in Azure and support the management and operation of your apps. Optionally, you can choose to have the extension install [KEDA](https://keda.sh/) for event-driven scaling.
 <!-- You can only have one installation of KEDA on the cluster. If you have one already, you must disable this behavior during installation of the cluster extension `TODO`. -->

The following table describes the role of each pod that is created by default:

| Pod                                   | Description                                                                                                                       |
|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `<extensionName>-k8se-app-controller` | The core operator pod that creates resources on the cluster and maintains the state of components.                                |
| `<extensionName>-k8se-envoy`          | A front-end proxy layer for all data-plane requests. It routes the inbound traffic to the correct apps.                           |
| `<extensionName>-k8se-activator`      | An alternative routing destination to help with apps that have scaled to zero while the system gets the first instance available. |
| `<extensionName>-k8se-build-service`  | Supports deployment operations and serves the [Advanced tools feature](resources-kudu.md).                                        |
| `<extensionName>-k8se-http-scaler`    | Monitors inbound request volume in order to provide scaling information to [KEDA](https://keda.sh).                               |
| `<extensionName>-k8se-img-cacher`     | Pulls placeholder and app images into a local cache on the node.                                                                  |
| `<extensionName>-k8se-log-processor`  | Gathers logs from apps and other components and sends them to Log Analytics.                                                      |
| `placeholder-azure-functions-*`       | Used to speed up cold starts for Azure Functions.                                                                                 |

## App Service Kubernetes environment

The App Service Kubernetes environment resource is required before apps can be created. It enables configuration common to apps in the custom location, such as the default DNS suffix.

Only one Kubernetes environment resource can be created in a custom location. In most cases, a developer who creates and deploys apps doesn't need to be directly aware of the resource. It can be directly inferred from the provided custom location ID. However, when defining Azure Resource Manager templates, any plan resource needs to reference the resource ID of the environment directly. The custom location values of the plan and the specified environment must match.

## FAQ for App Service, Functions, and Logic Apps on Azure Arc (Preview)

- [How much does it cost?](#how-much-does-it-cost)
- [Are both Windows and Linux apps supported?](#are-both-windows-and-linux-apps-supported)
- [Which built-in application stacks are supported?](#which-built-in-application-stacks-are-supported)
- [Are all app deployment types supported?](#are-all-app-deployment-types-supported)
- [Which App Service features are supported?](#which-app-service-features-are-supported)
- [Are all networking features supported?](#are-all-networking-features-supported)
- [Are managed identities supported?](#are-managed-identities-supported)
- [Are there any scaling limits?](#are-there-any-scaling-limits)
- [What logs are collected?](#what-logs-are-collected)
- [What do I do if I see a provider registration error?](#what-do-i-do-if-i-see-a-provider-registration-error)
- [Can I deploy the Application services extension on an ARM64 based cluster?](#can-i-deploy-the-application-services-extension-on-an-arm64-based-cluster)
- [Which Kubernetes distributions can I deploy the extension on?](#which-kubernetes-distributions-can-i-deploy-the-extension-on)

### How much does it cost?

App Service on Azure Arc is free during the public preview.

### Are both Windows and Linux apps supported?

Only Linux-based apps are supported, both code and custom containers. Windows apps aren't supported.

### Which built-in application stacks are supported?

All built-in Linux stacks are supported.

### Are all app deployment types supported?

FTP deployment isn't supported. Currently `az webapp up` is also not supported. Other deployment methods are supported, including Git, ZIP, CI/CD, Visual Studio, and Visual Studio Code.

### Which App Service features are supported?

During the preview period, certain App Service features are being validated. When they're supported, their left navigation options in the Azure portal will be activated. Features that aren't yet supported remain grayed out.

### Are all networking features supported?

No. Networking features such as hybrid connections or Virtual Network integration, aren't supported.  [Access restriction](app-service-ip-restrictions.md) support was added in April 2022. Networking should be handled directly in the networking rules in the Kubernetes cluster itself.

### Are managed identities supported?

No. Apps cannot be assigned managed identities when running in Azure Arc. If your app needs an identity for working with another Azure resource, consider using an [application service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) instead.

### Are there any scaling limits?

All applications deployed with Azure App Service on Kubernetes with Azure Arc are able to scale within the limits of the underlying Kubernetes cluster. If the underlying Kubernetes Cluster runs out of available compute resources (CPU and memory primarily), then applications will only be able to scale to the number of instances of the application that Kubernetes can schedule with available resource.

### What logs are collected?

Logs for both system components and your applications are written to standard output. Both log types can be collected for analysis using standard Kubernetes tools. You can also configure the App Service cluster extension with a [Log Analytics workspace](../azure-monitor/logs/log-analytics-overview.md), and it sends all logs to that workspace.

By default, logs from system components are sent to the Azure team. Application logs aren't sent. You can prevent these logs from being transferred by setting `logProcessor.enabled=false` as an extension configuration setting. This configuration setting will also disable forwarding of application to your Log Analytics workspace. Disabling the log processor might impact time needed for any support cases, and you will be asked to collect logs from standard output through some other means.

### What do I do if I see a provider registration error?

When creating a Kubernetes environment resource, some subscriptions might see a "No registered resource provider found" error. The error details might include a set of locations and api versions that are considered valid. If this error message is returned, the subscription must be re-registered with the Microsoft.Web provider, an operation that has no impact on existing applications or APIs. To re-register, use the Azure CLI to run `az provider register --namespace Microsoft.Web --wait`. Then reattempt the Kubernetes environment command.

### Can I deploy the Application services extension on an ARM64 based cluster?

ARM64 based clusters aren't supported at this time.  

### Which Kubernetes distributions can I deploy the extension on?

The extension has been validated on AKS, AKS on Azure Stack HCI, Google Kubernetes Engine, Amazon Elastic Kubernetes Service and Kubernetes Cluster API.

## Extension Release Notes

### Application services extension v 0.9.0 (May 2021)

- Initial public preview release of Application services extension.
- Support for code and container-based deployments of Web, Function, and Logic Applications.
- Web application runtime support --- .NET 3.1 and 5.0; Node JS 12 and 14; Python 3.6, 3.7, and 3.8; PHP 7.3 and 7.4; Ruby 2.5, 2.5.5, 2.6, and 2.6.2; Java SE 8u232, 8u242, 8u252, 11.05, 11.06 and 11.07; Tomcat 8.5, 8.5.41, 8.5.53, 8.5.57, 9.0, 9.0.20, 9.0.33, and 9.0.37.

### Application services extension v 0.10.0 (November 2021)

- Removed requirement for pre-assigned Static IP Address required for assignment to the Envoy endpoint
- Upgrade Keda to v2.4.0
- Upgrade Envoy to v1.19.0
- Upgrade Azure Function runtime to v3.3.1
- Set default replica count of App Controller and Envoy Controller to 2 to add further stability

If your extension was in the stable version and auto-upgrade-minor-version is set to true, the extension upgrades automatically. To manually upgrade the extension to the latest version, you can run the command:

```azurecli-interactive
    az k8s-extension update --cluster-type connectedClusters -c <clustername> -g <resource group> -n <extension name> --release-train stable --version 0.10.0
```

### Application services extension v 0.11.0 (December 2021)

- Added Application Insights support for Java and .NET Web Applications
- Added support for .NET 6.0 Web Applications
- Removed .NET Core 2.0
- Resolved issues that caused slot swap operations to fail
- Resolved issues customers experienced during creation of Ruby web applications

If your extension was in the stable version and auto-upgrade-minor-version is set to true, the extension upgrades automatically. To manually upgrade the extension to the latest version, you can run the command:

```azurecli-interactive
    az k8s-extension update --cluster-type connectedClusters -c <clustername> -g <resource group> -n <extension name> --release-train stable --version 0.11.0
```

### Application services extension v 0.11.1 (December 2021)

- Minor release to resolve issue with CRD update

If your extension was in the stable version and auto-upgrade-minor-version is set to true, the extension upgrades automatically. To manually upgrade the extension to the latest version, you can run the command:

```azurecli-interactive
    az k8s-extension update --cluster-type connectedClusters -c <clustername> -g <resource group> -n <extension name> --release-train stable --version 0.11.1
```

### Application services extension v 0.12.0 (January 2022)

- Support for outbound proxy
- Support for parallel builds in build service
- Upgrade Envoy to 1.20.1
- Resolved issue with Application Insights support for .NET Applications

If your extension was in the stable version and auto-upgrade-minor-version is set to true, the extension upgrades automatically. To manually upgrade the extension to the latest version, you can run the command:

```azurecli-interactive
    az k8s-extension update --cluster-type connectedClusters -c <clustername> -g <resource group> -n <extension name> --release-train stable --version 0.12.0
```

### Application services extension v 0.12.1 (March 2022)

- Resolved issue with outbound proxy support to enable logging to Log Analytics Workspace

If your extension was in the stable version and auto-upgrade-minor-version is set to true, the extension upgrades automatically. To manually upgrade the extension to the latest version, you can run the command:

```azurecli-interactive
    az k8s-extension update --cluster-type connectedClusters -c <clustername> -g <resource group> -n <extension name> --release-train stable --version 0.12.1
```

### Application services extension v 0.12.2 (March 2022)

- Update to resolve upgrade failures when upgrading from v 0.12.0 when extension name length is over 35 characters

If your extension was in the stable version and auto-upgrade-minor-version is set to true, the extension upgrades automatically. To manually upgrade the extension to the latest version, you can run the command:

```azurecli-interactive
    az k8s-extension update --cluster-type connectedClusters -c <clustername> -g <resource group> -n <extension name> --release-train stable --version 0.12.2
```

### Application services extension v 0.13.0 (April 2022)

- Added support for Application Insights codeless integration for Node JS applications
- Added support for [Access Restrictions](app-service-ip-restrictions.md) via CLI
- More details provided when extension fails to install, to assist with troubleshooting issues 

If your extension was in the stable version and auto-upgrade-minor-version is set to true, the extension upgrades automatically. To manually upgrade the extension to the latest version, you can run the command:

```azurecli-interactive
    az k8s-extension update --cluster-type connectedClusters -c <clustername> -g <resource group> -n <extension name> --release-train stable --version 0.13.0
```
### Application services extension v 0.13.1 (April 2022)

- Update to resolve upgrade failures seen during auto upgrade of clusters to v 0.13.0

If your extension was in the stable version and auto-upgrade-minor-version is set to true, the extension upgrades automatically. To manually upgrade the extension to the latest version, you can run the command:

```azurecli-interactive
    az k8s-extension update --cluster-type connectedClusters -c <clustername> -g <resource group> -n <extension name> --release-train stable --version 0.13.1
```

## Next steps

[Create an App Service Kubernetes environment (Preview)](manage-create-arc-environment.md)
