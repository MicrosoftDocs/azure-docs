---
title: Onboard an SAP system as WVI (Preview) - Azure Workload Center for SAP
description: Learn how to onboard an SAP system as a Workload Virtual Instance using API-based discovery, Azure Resource Graph queries, or manual mapping.
ms.date: 11/06/2026
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.author: vaidehikher
ms.reviewer: mattmcinnes
ai-usage: ai-assisted
---

# Onboard an SAP system as Workload Virtual Instance (Preview) 

Azure Workload Center for SAP helps you onboard an existing SAP system by creating a workload representation of the system and its associated Azure resources.

During onboarding, you can discover and map the Azure resources that are part of your SAP system by using one of the following methods:

- **API-based discovery**: Automatically discovers SAP components and their associated Azure resources by using SAP Host Control APIs. This option is available only for supported SAP system configurations.

- **Azure Resource Graph query-based discovery**: Uses Azure Resource Graph queries to dynamically discover Azure resources associated with individual SAP components.

- **Manual resource mapping**: Lets you manually define the components in your SAP system and map Azure resources to each component.

The discovery methods available during onboarding depend on the architecture and SAP product that you select.

> [!NOTE]
> Azure Resource Graph query-based discovery and manual resource mapping are available for all supported SAP system configurations. API-based discovery is available only for supported configurations.

## Prerequisites

Before you begin, ensure that:

- You have access to the Azure subscription and resource group where you want to create the SAP workload representation.

- You have access to the subscriptions and resource groups that contain the Azure resources associated with your SAP system.

- You have a user-assigned managed identity that can access the required resources.

If you use Azure Resource Graph query-based discovery, ensure that the user-assigned managed identity has the **Reader** role on each subscription that you select for resource discovery.

If you use API-based discovery, ensure that you complete the prerequisites required to access the SAP system through SAP Host Control.

## Start onboarding

1.  Sign in to the Azure portal.

2.  Search for and select **Azure Workload Center for SAP**.

3.  Select **Enroll** to start onboarding an SAP system.

    :::image type="content" source="media/workload-onboarding/azure-workload-center-sap-overview.png" lightbox="media/workload-onboarding/azure-workload-center-sap-overview.png" alt-text="Screenshot of Azure Workload Center for SAP Overview page with Enroll button highlighted.":::

### Basics

On the **Basics** tab, specify where you want to create the workload representation.

1.  Select the **Subscription**.

2.  Select the **Resource group**.

3.  Enter a name for the workload.

4.  Select the **Location**.

    :::image type="content" source="media/workload-onboarding/enroll-sap-workload-virtual-instance-basics.png" lightbox="media/workload-onboarding/enroll-sap-workload-virtual-instance-basics.png" alt-text="Screenshot of the Basics tab in Enroll SAP Workload Virtual Instance, with Subscription, Resource Group, Name, and Region fields.":::

5.  Select **Next**.

### Workload details

On the **Workload details** tab, provide information about the SAP system that you're onboarding.

1.  Select the **Architecture type** for your SAP system.

2.  Enter the **SAP system ID (SID)**.

3.  Select the **SAP product type**.

4.  Select the **System lifecycle**.

5.  Select the **Environment type**.

    :::image type="content" source="media/workload-onboarding/enroll-sap-workload-metadata-fields.png" lightbox="media/workload-onboarding/enroll-sap-workload-metadata-fields.png" alt-text="Screenshot of Workload Details tab with Architecture Type, SAP SID, and other metadata fields.":::

6.  Select **Next**.

Azure Workload Center for SAP uses the selected architecture and SAP product to determine which resource discovery methods are available for your SAP system.

### Resource discovery

On the **Resource discovery** tab, select how Azure Workload Center for SAP should identify the Azure resources that make up your SAP system.

The following discovery methods are available:

| **Discovery method**                                                       | **When to use**                                                               | **Availability**                                           |
|----------------------------------------------------------------------------|-------------------------------------------------------------------------------|------------------------------------------------------------|
| **API-based discovery**                                                    | Automatically discover the SAP system by using SAP Host Control.              | Supported SAP configurations only (ABAP/NetWeaver systems) |
| **Component Based Discovery (Azure Resource Graph query-based discovery)** | Define discovery rules that identify resources for individual SAP components. | All supported configurations                               |
| **Component Based Discovery (Manual resource mapping)**                    | Explicitly define SAP components and select their associated Azure resources. | All supported configurations                               |

#### Use API-based discovery

Use API-based discovery when it's available for your SAP system.

API-based discovery uses SAP Host Control APIs to discover the SAP system, its components, and associated Azure resources.

API-based discovery is supported for ABAP/NetWeaver systems. It isn't supported for Java and PI/PO systems.

To use API-based discovery:

1.  In **Resource discovery type**, select **API-based discovery**.

2.  Select **Select a virtual machine**.

    :::image type="content" source="media/workload-onboarding/resource-discovery-api-based-selection.png" lightbox="media/workload-onboarding/resource-discovery-api-based-selection.png" alt-text="Screenshot of Resource Discovery step with API-based discovery selected and Select a virtual machine link highlighted.":::

3.  Select an Application Server or Central Services virtual machine that belongs to the SAP system that you're onboarding.

4.  Confirm your selection.

5.  Continue to **Settings**.

Azure Workload Center for SAP uses the selected virtual machine to connect to the SAP system and discover its components and associated Azure resources.

#### Use Azure Resource Graph query-based discovery

Use Azure Resource Graph query-based discovery when you want Azure Workload Center for SAP to dynamically identify the Azure resources associated with your SAP components.

Discovery rules use Azure Resource Graph queries to identify resources based on Azure resource properties. You define a separate discovery query for each SAP component.

Azure Workload Center for SAP periodically runs these discovery rules after onboarding. This approach keeps the workload representation up to date with resources that are added or removed from the scope of the query.

##### Configure discovery for a component

For each SAP component:

1.  Select the SAP component that you want to configure.

    :::image type="content" source="media/workload-onboarding/add-component-panel-sap-workload.png" lightbox="media/workload-onboarding/add-component-panel-sap-workload.png" alt-text="Screenshot of Add Component panel with ARG resource discovery option selected for Application Server.":::

2.  When you create a **Resource graph query** discovery rule, you create a [KQL query](../../governance/resource-graph/samples/starter.md) that retrieves the resources you want.

3.  You can select between *Simple view*, which prompts you for each property value, and *Query view*, which allows you to work with the full query text. Use the guided query builder to define the criteria for discovering the resources.

4.  Review the generated Azure Resource Graph query.

5.  Select **Run discovery**.

6.  Review the resources returned by the discovery query.

7.  Confirm the discovery configuration for the component.

Resources returned by the query are automatically associated with the SAP component for which you created the discovery rule.

Repeat these steps for each SAP component that you want Azure Workload Center for SAP to discover.

> [!IMPORTANT]   
> The user-assigned managed identity must have the **Reader** role on each subscription that you select for Azure Resource Graph query-based discovery. Ensure that both you and the managed identity have access to the selected discovery scope.

Because each SAP component has its own discovery query, you can define different discovery criteria and scopes for different parts of your SAP system.

For example, you can create separate discovery rules for your application server, central services, and database components.

##### Map additional resources

Some Azure resources associated with an SAP system might not be discoverable by an Azure Resource Graph discovery rule or mapped directly to an SAP component.

For these resources, use **Additional resources**.

1.  Go to the **Additional resources** section.

    :::image type="content" source="media/workload-onboarding/add-resource-id-button-highlighted.png" lightbox="media/workload-onboarding/add-resource-id-button-highlighted.png" alt-text="Screenshot of Add Component panel highlighting the Add resource ID button under Additional resources.":::

2.  Add the Azure resource ID for the resource that you want to associate with the SAP system.

3.  Repeat this step for each additional resource.

Use the complete Azure resource ID when adding a resource.

For example, you can use this option to associate resources such as Azure file shares with the SAP system when they can't otherwise be discovered or mapped through the onboarding experience.

After you configure discovery rules for the required SAP components and add any additional resources, continue to **Settings**.

#### Use manual resource mapping

Use manual resource mapping when you want to explicitly define your SAP components and select the Azure resources associated with each component.

To manually map resources:

1.  For **Resource discovery type**, select **Manual resource mapping**.

2.  Select **Add component**.

3.  Select the appropriate **Component type**.

4.  Enter a name for the component.

    :::image type="content" source="media/workload-onboarding/select-resources-manually-option.png" lightbox="media/workload-onboarding/select-resources-manually-option.png" alt-text="Screenshot of Add Component panel with &quot;Select resources manually&quot; and &quot;No resources discovered&quot; highlighted.":::

5.  Select the Azure resources associated with the component.

6.  Select **Add**.

7.  Repeat these steps for each component in your SAP system.

Ensure that you add all relevant SAP components and their associated Azure resources so that the workload representation accurately represents your SAP system.

##### Map additional resources

You can also associate resources that can't otherwise be mapped to an SAP component by using **Additional resources**.

1.  Go to the **Additional resources** section.

    :::image type="content" source="media/workload-onboarding/add-resource-id-button.png" lightbox="media/workload-onboarding/add-resource-id-button.png" alt-text="Screenshot of Add Component panel highlighting the &quot;Add resource ID&quot; button under Additional resources.":::

2.  Enter the complete Azure resource ID for the resource that you want to associate with the SAP system.

3.  Repeat this step for each additional resource.

For example, use this option to add resources such as Azure file shares that you can't otherwise map through the manual resource mapping experience.

After you finish mapping your resources, continue to **Settings**.

### Settings

On the **Settings** tab, configure the identity and supporting resources that Azure Workload Center for SAP needs.

The required settings depend on the resource discovery method that you selected.

| **Discovery method**                       | **User-assigned managed identity** | **Storage account** |
|--------------------------------------------|------------------------------------|---------------------|
| API-based discovery                        | Required                           | Required            |
| Azure Resource Graph query-based discovery | Required                           | Not required        |
| Manual resource mapping                    | Required                           | Not required        |

#### Configure the managed identity

Select an existing **user-assigned managed identity**, or create a new one.

Azure Workload Center for SAP uses the managed identity to access the Azure resources required to manage the workload.

For Azure Resource Graph query-based discovery, the selected managed identity must have the **Reader** role on all subscriptions included in your discovery rules.

#### Configure the storage account for API-based discovery

If you selected **API-based discovery**, select the storage account to use during API-based resource discovery.

You don't need the storage account for Azure Resource Graph query-based discovery or manual resource mapping.

After configuring the required settings, select **Next**.

### Review and create

On the **Review + create** tab:

1.  Review the workload and SAP system details.

2.  Review the selected resource discovery method and discovery configuration.

3.  Review the managed identity and other settings.

4.  Resolve any validation errors.

5.  Select **Create**.

Azure Workload Center for SAP creates the workload representation and its SAP components based on the discovery method and resource mappings that you configured.

After deployment finishes, open the SAP workload and check that it shows the expected SAP components and Azure resources.

## Resource discovery behavior after onboarding

How the service associates resources with the SAP workload depends on the discovery method you choose.

- **API-based discovery** uses SAP Host Control APIs to find the SAP system and its resources.

- **Azure Resource Graph query-based discovery** uses the discovery query set up for each SAP component. Discovery rules keep running regularly so the workload representation can show changes to resources that match the query.

- **Manual resource mapping** uses the resources you explicitly map to the SAP components.

- You can use **Additional resources** with Azure Resource Graph query-based discovery and manual resource mapping to associate resources that you can't otherwise discover or map.
