---
title: Create projects and clusters in MongoDB Atlas (preview)
description: Learn how to create and manage MongoDB Atlas projects and clusters directly from the Azure portal (preview).
ms.date: 07/03/2026
ms.topic: quickstart
ms.author: priyverma
author: vpriyanshi
---

# Create projects and clusters in MongoDB Atlas (preview)

> [!IMPORTANT]
> This feature is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article explains how to create and manage MongoDB Atlas projects and clusters directly from the Azure portal. After you provision a MongoDB Atlas resource, you can create projects, deploy clusters, and manage them—all without leaving Azure.

## Prerequisites

- An Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account).
- A MongoDB Atlas resource already created in the Azure portal. If you don't have one, see [Quickstart: Create a MongoDB Atlas resource](create.md).
- The **Owner** role for the MongoDB Atlas organization you created in the previous step. 

## Resource overview

Sign in to the [Azure portal](https://portal.azure.com/).

1. In the Azure portal, search for and select **All resources**.

1. Select your MongoDB Atlas resource.

   The Azure portal shows the resource with the **Overview** page open.

The **Overview** page displays essential information and provides quick-start actions.

## Create a project

> [!NOTE]
> You can manage projects and clusters through the **Projects (preview)** menu item in the Azure portal. As a preview feature, functionality might change before general availability.

In MongoDB Atlas, a project is a logical container that groups together clusters and related resources within an organization. You can create multiple projects in an organization. Only Atlas organization owners can create a project. Project names must be unique within an organization.

1. Go to your MongoDB Atlas resource in the Azure portal.

1. In the service menu, select **Projects (preview)**.

   The **Projects** page opens. If no projects exist, the page displays a "No projects to display" empty state with a **Create project** button.

1. On the command bar, select **+ Create project**.

   The **Create project** pane opens on the right side of the portal.

1. Enter the required settings:

   | Setting           | Value                                                                      |
   |-------------------|----------------------------------------------------------------------------|
   | **Project name**  | Enter a unique name for the project (for example, `Project_1`).            |

1. Select **Create**.

After the project is created, it appears in the project list. The list shows each project's **Name** and the **Number of Atlas Clusters** associated with it.

### View projects

To view all projects in your organization:

1. Go to your MongoDB Atlas resource in the Azure portal.

1. In the service menu, select **Projects (preview)**.

   The **Projects** page displays a data grid with the following columns:

   | Column                        | Description                                           |
   |-------------------------------|-------------------------------------------------------|
   | **Name**                      | The name of the project (displayed as a hyperlink).   |
   | **Number of Atlas Clusters**  | The count of clusters deployed within the project.    |

1. Use the **Search** box and **Add filter** to locate specific projects.

1. Select a project name to open its detail view.


### View project properties

When you select a project name from the projects list, the project detail view opens.

The project detail view displays:

- **Essentials** section with:

  | Setting           | Value                                                   |
  |-------------------|---------------------------------------------------------|
  | **Project ID**    | The unique identifier for the project (for example, `Project ID-12345abcdSD`). |
  | **Project name**  | The display name of the project.                        |
  | **Portal URL**    | A **Go to MongoDB Atlas** link to manage the project in the Atlas portal. |

- **Clusters** section

The command bar provides:

| Action              | Description                                               |
|---------------------|-----------------------------------------------------------|
| **Delete project**  | Delete the project (opens a confirmation pane).           |
| **Refresh**         | Refresh the project data.                                 |

### Delete a project

> [!WARNING]
> Project deletion isn't yet supported from Azure in preview. To delete a project, go to respective MongoDB Atlas organization [MongoDB Atlas](https://cloud.mongodb.com).

## Create a cluster

An Atlas cluster is a managed MongoDB database deployment running in the cloud on MongoDB Atlas. To get started with Atlas Clusters, deploy a Free (M0), Flex, or dedicated Atlas cluster. You can also upgrade your cluster after the basic deployment. Only Atlas organization owners can create a cluster.

1. Go to the project where you want to create the cluster.

1. In the **Clusters** section, select **+ Create Cluster**.

   The **Create cluster** pane opens on the right side of the portal.

1. Select a **Cluster tier**:

   | Tier      | Description                                                                                     |
   |-----------|-------------------------------------------------------------------------------------------------|
   | **Free**  | For learning and exploring MongoDB in a cloud environment. You can only create one Free (M0) cluster per project. |
   | **M10**   | Dedicated cluster for development environment and low-traffic applications.                     |
   | **M30**   | Dedicated cluster for high-traffic applications and large datasets. Manage upgrades in Atlas portal. |
   | **Flex**  | For development and testing, on-demand burst capacity for unpredictable traffic.                |

   > [!NOTE]
   > You can only create one Free (M0) cluster in your project.

   > [!TIP]
   > For pricing information, select the **Atlas Pricing** link displayed in the informational banner at the top of the pane. Cluster charges are applied against the existing Azure Marketplace plan.

1. Enter the required settings:

   | Setting          | Value                                                                        |
   |------------------|------------------------------------------------------------------------------|
   | **Cluster name** | Enter a unique name for the cluster (for example, `cluster 01`).             |
   | **Region**       | Select the Azure region for the cluster (for example, `East US`).            |

   > [!IMPORTANT]
   > The Azure region you select for the cluster determines where your data is stored. This selection is separate from the region you chose when you created the MongoDB Atlas resource in the Azure portal.

1. Select **Create**.

   The cluster deployment begins. When deployment is complete, a success notification appears: "Successfully created the cluster—Cluster \<cluster name\> created successfully."

### Cluster creation failure

If cluster creation fails, a notification appears in the Azure portal. Review the error details and verify your configuration, and then try creating the cluster again.

### View clusters

To view all clusters within a project:

1. Go to the project detail view.

1. The **Clusters** section displays a data grid with the following columns:

   | Column              | Description                                                     |
   |---------------------|-----------------------------------------------------------------|
   | **Name**            | The name of the cluster (displayed as a hyperlink).             |
   | **MongoDB Version** | The MongoDB version running on the cluster.                     |
   | **Region**          | The Azure region where the cluster is deployed.                 |
   | **Cluster tier**    | The tier of the cluster (Free, M10, M30, or Flex).              |
   | **Backups**         | The backup status of the cluster (for example, *Active*).       |

1. Use the **Filter for any field...** box and **Add filter** to locate specific clusters.

1. Select a cluster name to open its detail view.

### View cluster details

When you select a cluster name from the cluster list, the cluster detail view opens.

The cluster detail view displays:

- **Essentials** section with:

  | Setting              | Value                                                    |
  |----------------------|----------------------------------------------------------|
  | **Cluster name**     | The unique identifier of the cluster.                    |
  | **MongoDB version**  | The MongoDB version running on the cluster.              |
  | **Region**           | The Azure region where the cluster is deployed.          |
  | **Backups**          | The backup status (for example, *Active*).               |
  | **State**            | The current state (for example, *Idle*).                 |

The command bar provides:

| Action                             | Description                                              |
|------------------------------------|----------------------------------------------------------|
| **Delete cluster**                 | Delete the cluster (opens a confirmation pane).          |
| **Refresh**                        | Refresh the cluster data.                                |
| **Connect to MongoDB Atlas Cluster** | Open a connection dialog or redirect to Atlas portal.  |

### Delete a cluster

> [!WARNING]
> Cluster deletion isn't supported from Azure in preview. To delete a cluster, go to [MongoDB Atlas](https://cloud.mongodb.com).

## Billing

Azure Marketplace consolidates billing for MongoDB Atlas usage with your Azure invoice. Cluster charges apply to your existing Azure Marketplace plan. You can track costs for your MongoDB Atlas resources alongside other Azure services in the Azure portal under **Cost Management + Billing**.

> [!NOTE]
> Deleting the MongoDB Atlas Azure resource stops billing through Azure Marketplace, but it doesn't delete the Atlas organization, its projects, or its clusters. To delete projects or clusters, use the MongoDB Atlas portal directly.

## Preview limitations

During the preview, the following limitations apply:

- You can't delete **projects** directly from the Azure portal. To delete a project, use the [MongoDB Atlas portal](https://cloud.mongodb.com).
- You can't delete **clusters** directly from the Azure portal. To delete a cluster, use the [MongoDB Atlas portal](https://cloud.mongodb.com).
- You must manage **cluster scaling and advanced configuration** (backup policies, network peering, database users) through the MongoDB Atlas portal.
- The **Projects (preview)** menu item might change or be renamed before general availability.
- Some features visible in the UI might have limited functionality during the preview period.

## Related content

- [What is MongoDB Atlas?](overview.md)
- [Quickstart: Create a MongoDB Atlas resource](create.md)
- [MongoDB Atlas developer tools](tools.md)
- [Database cluster types in MongoDB Atlas](https://www.mongodb.com/docs/atlas/create-database-deployment/)
