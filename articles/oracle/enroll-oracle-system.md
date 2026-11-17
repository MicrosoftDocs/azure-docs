---
title: Enroll an Oracle system in Azure Workload Center for Oracle
description: Learn how to enroll an Oracle system as a Workload Virtual Instance (WVI) in Azure Workload Center for Oracle.
author: teja-san
ms.author: tsankranthi
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: how-to
ms.date: 11/06/2026
ai-usage: ai-assisted
---
# Enroll an Oracle system in Azure Workload Center for Oracle

In this article, you learn how to enroll an existing Oracle system. Enrollment creates a *Workload Virtual Instance (WVI)* for the system and its Azure resources.

During enrollment, you map the Azure resources of the system to workload components by using one of two methods:

- **Azure Resource Graph query-based discovery**: Define discovery rules for each component that find its Azure resources.

- **Manual resource mapping**: Select the Azure resources for each component from a list.

## Prerequisites

- You completed the steps in [Permissions and prerequisites](get-started-prerequisites-permissions.md).

- You have access to the subscriptions and resource groups that contain the resources of the Oracle system.

## Start enrollment

1.  Sign in to the [Azure portal](https://portal.azure.com).

2.  Go to **Azure Workload Center for Oracle**.

3.  On the **Overview** page, select **Enroll Oracle Systems**.

:::image type="content" source="media/enroll-system/enroll-oracle-systems-button.png" alt-text="Screenshot that shows the Azure Workload Center for Oracle Overview page with the Enroll Oracle Systems button." lightbox="media/enroll-system/enroll-oracle-systems-button.png":::

### Basics

On the **Basics** tab, specify where to create the WVI.

1.  Select the **Subscription**.

2.  Select the **Resource Group**.

3.  Enter a **Name** for the WVI.

4.  Select the **Region**. For the list of regions, see [FAQ](faq.md).

:::image type="content" source="media/enroll-system/basics-tab.png" alt-text="Screenshot that shows the Basics tab of the Enroll Oracle Workload Virtual Instance page." lightbox="media/enroll-system/basics-tab.png":::

5.  Select **Next**.

### Workload details

On the **Workload details** tab, describe the Oracle system that you're enrolling. Azure Workload Center for Oracle uses these details to decide which configuration checks apply.

First, select the **Oracle Service Offering**:

- **Oracle AI Database@Azure**: Oracle runs the database service in Azure datacenters, for example Oracle Exadata Database Service or Oracle Autonomous AI Database. When you select this option, the tab also asks for the application type, the MA architecture type, and the database name.

- **Oracle on Azure VMs**: You installed the Oracle database yourself on Azure virtual machines (VMs).

| **Field**                | **What it means**                                                                                            | **Values**                                                                                                                                                                                                                          |
|--------------------------|--------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Application type**     | The application that uses the database. Required for Oracle AI Database@Azure                                | **EBS** (Oracle E-Business Suite), **PeopleSoft**, **JD Edwards**, **Siebel**, or **Custom Application**                                                                                                                            |
| **MA architecture type** | The Oracle Maximum Availability Architecture (MAA) tier of the system. Required for Oracle AI Database@Azure | **Bronze**: single instance with backups. **Silver**: adds high availability with Oracle Real Application Clusters (RAC). **Gold**: adds disaster recovery with Oracle Data Guard. **Platinum**: adds Oracle GoldenGate replication |
| **Oracle Database name** | Optional. The name of the Oracle database                                                                    | For example, ORCL                                                                                                                                                                                                                   |
| **System Lifecycle**     | The stage the system is in                                                                                   | **Active**: in use. **Inactive**: not in use, for example a system kept only for reference. **In Build**: being set up and not yet in use                                                                                           |
| **Environment Type**     | The role of the system                                                                                       | **Production**, **Non-Production**, or **Disaster Recovery**                                                                                                                                                                        |
| **Environment labeling** | Optional. A more specific label for the environment                                                          | For example, **Dev**, **Lab**, **Pre-Prod**, **QA**, **Sandbox**, **Stage**, **Test**, **Training**, or **UAT**                                                                                                                     |

:::image type="content" source="media/enroll-system/workload-details-tab.png" alt-text="Screenshot that shows the Workload details tab with Oracle AI Database@Azure selected as the Oracle Service Offering." lightbox="media/enroll-system/workload-details-tab.png":::

Select **Next**.

### Resource discovery

On the **Resource Discovery** tab, add the workload components of the Oracle system and map Azure resources to each one. Configuration validation and workload health cover only the resources that you map here, so map all resources of the system.

1.  Select **Add Component**.

2.  Select the **Component type**, for example **Database Services**.

3.  Select the **Component role**. For example, a Database Services component can have the role **Oracle Database Service on Azure**, **Data Guard Observer VM**, **Far Sync VM**, or **GoldenGate on Azure Compute**. Other component types use the role **Default**.

4.  Enter a **Component name**. You can't change the name after the WVI is created.

5.  For **Choose how to add resources**, select **Discover resources using ARG** or **Select resources manually**. The next sections describe each method.

:::image type="content" source="media/enroll-system/add-component-arg.png" alt-text="Screenshot that shows the Add Component pane with Database Services selected and Discover resources using ARG chosen." lightbox="media/enroll-system/add-component-arg.png":::

### Use Azure Resource Graph (ARG) query-based discovery

Use this method when the resources of a component share a property, such as a resource group, a name pattern, or a tag. The discovery rules run again every hour after enrollment, so resources that you add to or remove from the scope show up in the WVI.

1.  Select **Discover resources using ARG**, and then select **Discover resources using query**. The **Add discovery rules** pane opens.

2.  On the **Filters** tab, select **Add filter** and build the conditions. You can filter by **Name**, **Resource group**, **Resource ID**, **Resource type**, **Subscription**, **Location**, or **Tags**, with operators such as **Equals**, **Contains**, **In**, and **Starts with**. For complex discovery scenarios, select **Query view** to edit the query text directly.

3.  Select **Refresh preview**. Under **Preview discovery**, review the resources that the rules find. Make sure that they're the resources that you want in this component.

:::image type="content" source="media/enroll-system/add-discovery-rules.png" alt-text="Screenshot that shows the Add discovery rules pane with a subscription filter and the Refresh preview button." lightbox="media/enroll-system/add-discovery-rules.png":::

4.  Select **Add**.

> [!TIP]  
> Use filters that match only the resources of this component. For example, if your Exadata resources follow a naming convention, add a name filter.

> [!IMPORTANT]  
> The managed identity must have the **Reader** role on each subscription or resource group in the discovery rules. You must use an existing managed identity with this method.

### Use manual resource mapping

Use this method when you want to select each resource yourself.

1.  Select **Select resources manually**, and then select **Select resources**.

2.  Select the resources of the component. The list shows only the resource types that the component type supports. Filter by subscription, resource group, location, or tag. You can select resources from more than one subscription.

3.  Select **Add selected resources**.

:::image type="content" source="media/enroll-system/select-resources-manually.png" alt-text="Screenshot that shows the Select resources pane with an Oracle Exadata infrastructure resource selected." lightbox="media/enroll-system/select-resources-manually.png":::

### Select CDBs and PDBs

For an Exadata system, you can add the CDBs and PDBs of a VM cluster to the Database Services component. Add the VM cluster to the component first.

1.  In the **Add Component** pane, add the Exadata VM cluster under **Azure resources**, by ARG query, or by manual selection.

2.  Next to **Database resources**, select **Select database resources**.

3.  Expand the VM cluster, and select the CDBs and PDBs that you want in the component. Filter by **Resource group**, **Subscription**, **Location**, or **Tags**.

:::image type="content" source="media/enroll-system/select-container-and-pluggable-databases.png" alt-text="Screenshot that shows the Select database resources pane with a VM cluster expanded and a CDB and a PDB selected." lightbox="media/enroll-system/select-container-and-pluggable-databases.png":::

4.  Select **Add**. The **Database resources** field shows how many CDBs and PDBs you selected.

:::image type="content" source="media/enroll-system/database-resources-count.png" alt-text="Screenshot that shows the Add Component pane with the selected Azure resources and the number of CDBs and PDBs under Database resources." lightbox="media/enroll-system/database-resources-count.png":::

### Map additional resources

Use **Additional resources** to add a resource that the WVI supports but that the discovery rules or the list don't return. You can use this option with both methods.

1.  In the **Additional resources** section of the component, select **Add resource ID**.

2.  Enter the full Azure resource ID, and then select **Add**. Azure validates the ID before it adds the resource.

3.  Repeat for each additional resource.

For example, add a CDB or PDB of your Exadata VM cluster by its resource ID if it isn't in the list.

### Finish the components

Select **Add** to add the component. Repeat these steps for each component of the system. The table on the **Resource Discovery** tab shows each component, its type, its role, and the number of mapped resources.

:::image type="content" source="media/enroll-system/resource-discovery-components.png" alt-text="Screenshot that shows the Resource discovery tab with a Database Services component and an Application Services component." lightbox="media/enroll-system/resource-discovery-components.png":::

Depending on the workload details, some components are required. For example, an Oracle AI Database@Azure system with the application type EBS needs at least one Application Services component. The tab shows a message if a required component is missing.

Select **Next**.

### Settings

On the **Settings** tab, choose the user-assigned managed identity that Azure Workload Center for Oracle uses. The tab lists the permissions that the identity needs.

1.  For **Managed identity source**, select **Create new user assigned managed identity** or **Use existing user assigned managed identity**. If any component uses Azure Resource Graph query-based discovery, select **Use existing user assigned managed identity**.

:::image type="content" source="media/enroll-system/settings-managed-identity.png" alt-text="Screenshot that shows the Settings tab with the required permissions and the Managed identity source options." lightbox="media/enroll-system/settings-managed-identity.png":::

2.  If you use an existing identity, choose **Select a managed identity**, and then select the identity. For the roles that it needs, see [Permissions and prerequisites](get-started-prerequisites-permissions.md).

3.  Select **Next**.

### Tags

Optionally, add tags to the WVI, such as the owner, cost center, or environment. Select **Next**.

### Review and create

1.  On the **Review + Create** tab, read the preview terms and select the checkbox to accept the Supplemental Terms of Use for Microsoft Azure Previews.

2.  Review the values of each tab, and resolve any validation errors.

3.  Select **Create**.

:::image type="content" source="media/enroll-system/review-create-tab.png" alt-text="Screenshot that shows the Review + create tab with the checkbox to accept the Supplemental Terms of Use and the Create button." lightbox="media/enroll-system/review-create-tab.png":::

The deployment page shows each deployment step and its status. When the deployment is complete, select **Go to resource**. Check that the WVI shows the expected components and resources.
