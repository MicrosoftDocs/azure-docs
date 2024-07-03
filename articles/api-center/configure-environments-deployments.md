---
title: Tutorial - Add environments and deployments for APIs
description: In this tutorial, augment the API inventory in your API center by adding information about API environments and deployments.
author: dlepow
ms.service: api-center
ms.topic: tutorial
ms.date: 04/22/2024
ms.author: danlep 
#customer intent: As the owner of an Azure API center, I want a step by step introduction to adding API environments and deployments to my inventory.
---



# Tutorial: Add environments and deployments for APIs

Augment the inventory in your API center by adding information about API environments and deployments. 

* An *environment* represents a location where an API runtime could be deployed, for example, an API management platform. 

* A *deployment* is a location (an address) where users can access an API.

For background information about APIs, deployments, and other entities that you can inventory in Azure API Center, see [Key concepts](key-concepts.md).

In this tutorial, you learn how to use the portal to:
> [!div class="checklist"]
> * Add information about API environments 
> * Add information about API deployments


## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).

* One or more APIs registered in your API center. If you haven't registered any APIs already, see [Tutorial: Register APIs in your API inventory](register-apis.md). This tutorial uses the sample APIs you added from the previous tutorial.

## Add an environment

Use your API center to keep track of your real-world API environments. For example, you might use Azure API Management or another solution to distribute, secure, and monitor some of your APIs. Or you might directly serve some APIs using a compute service or a Kubernetes cluster. 

Here you add information about a fictitious Azure API Management environment to your API center. If you prefer, add information about one of your existing environments. You'll configure both built-in metadata and any custom metadata you defined in a [previous tutorial](add-metadata-properties.md).

1. In the [portal](https://portal.azure.com), navigate to your API center.

1. In the left menu, under **Assets**, select **Environments** > **+ New environment**.

1. On the **New environment** page, add the following information. If you previously defined the custom *Line of business* metadata or other metadata assigned to environments, you'll see them at the bottom of the page.

    |Setting|Value|Description|
    |-------|-----|-----------|
    |**Environment title**| Enter *My Testing*.| Name you choose for the environment.  |
    |**Identification**|After you enter the preceding title, Azure API Center generates this identifier, which you can override.| Azure resource name for the environment.|
    |**Environment type**| Select **Testing** from the dropdown.| Type of environment for APIs.|
    | **Description** | Optionally enter a description. | Description of the environment. |
    | **Server** | | |
    |**Type**| Optionally select **Azure API Management** from the dropdown.|Type of API management solution used.|
    | **Management portal URL** | Optionally enter a URL for a management interface, such as `https://admin.contoso.com` | URL of management interface for environment. |
    | **Onboarding** | | |
    | **Development portal URL** | Optionally enter a URL for a developer portal, such as `https://developer.contoso.com` | URL of interface for developer onboarding in the environment. |
    | **Instructions** | Optionally select **Edit** and enter onboarding instructions in standard Markdown. | Instructions to onboard to APIs from the environment. |
    | **Line of business** | If you added this custom metadata, optionally make a selection from the dropdown, such as **IT**. | Custom metadata that identifies the business unit that manages the environment. |

    :::image type="content" source="media/configure-environments-deployments/create-environment.png" alt-text="Screenshot of adding an API environment in the portal.":::

1. Select **Create**. The environment appears on the list of environments.

## Add a deployment

API center can also help you catalog your API deployments - the runtime environments where the APIs you track are deployed. 

Here you add a deployment by associating one of your APIs with the environment you created in the previous section. You'll configure both built-in metadata and any custom metadata that you defined.

1. In the portal, navigate to your API center.

1. In the left menu, under **Assets**, select **APIs**.

1. Select an API, for example, the *Demo Conference API*.

1. On the **Demo Conference API** page, under **Details**, select **Deployments** > **+ Add deployment**.

1. In the **Add deployment** page, add the following information. If you previously defined the custom *Line of business* metadata or other metadata assigned to environments, you'll see them at the bottom of the page.

    |Setting|Value|Description|
    |-------|-----|-----------|
    |**Title**| Enter *V1 Deployment*.| Name you choose for the deployment.  |
    |**Identification**|After you enter the preceding title, Azure API Center generates this identifier, which you can override.| Azure resource name for the deployment.|
    | **Description** | Optionally enter a description. | Description of the deployment. |
    | **Environment** | Make a selection from the dropdown, such as *My Testing*, or optionally select **Create new**.| New or existing environment where the API version is deployed. |
    | **Definition** | Select or add a definition file for a version of the Demo Conference API. | API definition file. |
    | **Runtime URL** | Enter a base URL, for example, `https://api.contoso.com`. | Base runtime URL for the API in the environment.  |
    | **Line of business** | If you added this custom metadata, optionally make a selection from the dropdown, such as **IT**. | Custom metadata that identifies the business unit that manages APIs in the environment. |

    :::image type="content" source="media/configure-environments-deployments/add-deployment.png" alt-text="Screenshot of adding an API deployment in the portal.":::

1. Select **Create**. The deployment appears on the list of deployments.

In this tutorial, you learned how to use the portal to:
> [!div class="checklist"]
> * Add information about API environments 
> * Add information about API deployments

## Related content

 * [Learn more about Azure API Center](key-concepts.md)

