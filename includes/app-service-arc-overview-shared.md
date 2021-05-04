---
author: cephalin
ms.service: app-service
ms.topic: include
ms.date: 05/04/2021    
ms.author: cephalin
---

In most cases, app developers need to know nothing more than how to deploy to the correct Azure region that represents the deployed Kubernetes environment. For operators who provide the environment and maintain the underlying Kubernetes infrastructure, you need to be aware of the following Azure resources:

- The connected cluster, which is an Azure projection of your Kubernetes infrastructure. For more information, see [What is Azure Arc enabled Kubernetes?](../articles/azure-arc/kubernetes/overview.md).
- A cluster extension, which is a sub-resource of the connected cluster resource. The App Service extension [installs the required pods into your connected cluster](pods-created-by-the-app-service-extension). For more information about cluster extensions, see [Cluster extensions on Azure Arc enabled Kubernetes](../azure-arc/kubernetes/conceptual-extensions.md).
- A custom location, which bundles together a group of extensions and maps them to a namespace for created resources. For more information, see [Custom locations on top of Azure Arc enabled Kubernetes](../articles/azure-arc/kubernetes/conceptual-custom-locations.md).
- An App Service Kubernetes environment, which enables configuration common across apps but not related to cluster operations. Conceptually, it's deployed into the custom location resource, and app developers create apps into this environment. This is described in greater detail in [App Service Kubernetes environment](#app-service-kubernetes-environment).

## Public preview limitations

The following public preview limitations apply to App Service Kubernetes environments. They will be updated when additional distributions and regions are supported.

| Supported Kubernetes distributions | Azure Kubernetes Service |
| Supported Azure regions | East US, West Europe |

## Pods created by the App Service extension

When the App Service extension is installed on the Arc-enabled Kubernetes cluster, you see several pods created in the release namespace that was specified. These pods enable your Kubernetes cluster to be an extension of the `Microsoft.Web` resource provider in Azure and support the management and operation of your apps. Optionally, you can choose to have the extension install [KEDA](https://keda.sh/) for event-driven scaling. You can only have one installation of KEDA on the cluster. If you have one already, you must disable this behavior during installation of the cluster extension `TODO`.

The following table describes the role of each pod that is created by default.

| Pod | Description |
|-|-|
| `<extensionName>-k8se-app-controller` | The core operator pod that creates resources on the cluster and maintains the state of components. |
| `<extensionName>-k8se-envoy` | A front-end proxy layer for all data-plane requests. It routes the inbound traffic to the correct apps. |
| `<extensionName>-k8se-activator` | An alternative routing destination to help with apps that have scaled to zero while the system gets the first instance available. |
| `<extensionName>-k8se-build-service | Supports deployment operations and serves the [Advanced tools feature](https://docs.microsoft.com/azure/app-service/resources-kudu). |
| `<extensionName>-k8se-http-scaler` | Monitors inbound request volume in order to provide scaling information to [KEDA](https://keda.sh). |
| `<extensionName>-k8se-img-cacher` | Pulls placeholder and app images into a local cache on the node. |
| `<extensionName>-k8se-log-processor` | Gathers logs from apps and other components and sends them to Log Analytics. |
| `placeholder-azure-functions-*` | Used to speed up cold starts for Azure Functions. |

## App Service Kubernetes environment

The App Service Kubernetes environment resource is required before apps may be created. It enables configuration common to apps in the custom location, such as the default DNS suffix.

Only one Kubernetes environment resource may created in a custom location. In most cases, a developer who creates and deploys apps doesn't need to be directly aware of the resource. It can be directly inferred from the provided custom location ID. However, when defining Azure Resource Manager templates, any plan resource needs to reference the resource ID of the environment directly. The custom location values of the plan and the specified environment must match.

