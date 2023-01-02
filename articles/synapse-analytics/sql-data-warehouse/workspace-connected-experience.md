---
title: Enabling Synapse workspace features on a dedicated SQL pool (formerly SQL DW) 
description: This document describes how a customer can access and use their existing SQL DW standalone instance in the Workspace.
author: sowmi93
ms.author: sosivara
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: sql-dw
ms.date: 03/07/2022
ms.reviewer: sngun, wiassaf
---

# Enabling Synapse workspace features on an existing dedicated SQL pool (formerly SQL DW)

All SQL data warehouse customers can now access and use an existing dedicated SQL pool (formerly SQL DW) instance via the Synapse Studio and Workspace, without impacting automation, connections, or tooling. This article explains how an existing Azure Synapse Analytics customer can build on and expand their existing Analytics solution by taking advantage of the new feature-rich capabilities now available via the Synapse workspace and Studio.   

## Experience
 
Now that Synapse workspace is GA a new capability is available in the DW Portal overview section that allows you to create a Synapse workspace for your existing dedicated SQL pool (formerly SQL DW) instances. This new capability will allow you to connect the logical server that hosts your existing data warehouse instances to a new Synapse workspace. The connection ensures that all of the data warehouses hosted on that server are made accessible from the Workspace and Studio and can be used in conjunction with the Synapse partner services (serverless SQL pool, Apache Spark pool, and ADF). You can begin accessing and using your resources as soon as the provisioning steps have been completed and the connection has been established to the newly created workspace.  

:::image type="content" source="media/workspace-connected-overview/workspace-connected-dw-portal-overview-pre-create.png" alt-text="Connected Synapse workspace":::

## Using Synapse workspace and Studio features to access and use a dedicated SQL pool (formerly SQL DW)
 
The following information will apply when using a dedicated SQL DW (formerly SQL DW) with the Synapse workspace features enabled: 
- **SQL capabilities** All SQL capabilities will remain with logical SQL server after the Synapse workspace feature has been enabled. Access to the server via the SQL resource provider will still be possible after the workspace has been enabled. All management functions can be initiated via the workspace and the operation will take place on the Logical SQL Server hosting your SQL pools. No existing automation, tooling, or connections will be broken or interrupted when a workspace is enabled.  
- **Resource move**  Initiating a resource move on a Server with the Synapse workspace feature enabled will cause the link between the server and the workspace to break. You will no longer be able to access your existing dedicated SQL pool (formerly SQL DW) instances from the workspace. To ensure that the connection is retained, it is recommended that both resources remain within the same subscription and resource group. 
- **Monitoring** SQL requests submitted via the Synapse Studio in a workspace enabled dedicated SQL pool (formerly SQL DW) can be viewed in the Monitor hub. For all other monitoring activities, you can go to Azure portal dedicated SQL pool (formerly SQL DW) monitoring. 
- **Security** and **Access controls** As stated above, all management functions for your SQL server and dedicated SQL pools (formerly SQL DW) instances will continue to reside on logical SQL server. These functions include, firewall rule management, setting the Azure AD admin of the server, and all access control for the data in your dedicated SQL pool (formerly SQL DW). The following steps must be taken to ensure that your dedicated SQL pool (formerly SQL DW) is accessible and can be used via the Synapse workspace. The workspace role memberships do not give users permissions to the data in dedicated SQL pool (formerly SQL DW) instances. Follow your normal [SQL authentication](sql-data-warehouse-authentication.md) policies to ensure users can access the dedicated SQL pool (formerly SQL DW) instances on the logical server. If the dedicated SQL pool (formerly SQL DW) host server has a Managed identity already assigned to it, this managed identity's name will be the same as that of Workspace Managed identity that is automatically created to support the Workspace partner services (for example, ADF pipelines).  Two Managed identities with the same name can exist in a connected Scenario. The Managed identities can be distinguished by their Azure AD object IDs, functionality to create SQL users using Object IDs is coming soon.

    ```sql
    CREATE USER [<workspace managed identity] FROM EXTERNAL PROVIDER 
    GRANT CONTROL ON DATABASE:: <dedicated SQL pool name> TO [<workspace managed identity>
    ```

    > [!NOTE] 
    > The connected workspace Synapse Studio will display the names of dedicated pools based on the permissions the user has in Azure. Objects under the pools will not be accessible if the user does not have permissions on the SQL pools. 
    >
    > Allowing authentication via Azure Active Directory (Azure AD) only is not supported for dedicated SQL pools with Azure Synapse features enabled. Policies that enable Azure AD-only only authentication will not apply to new or existing dedicated SQL pools with Azure Synapse features enabled. For more information on Azure AD-only authentication, see [Disabling local authentication in Azure Synapse Analytics](../sql/active-directory-authentication.md).

- **Network security** If the Synapse workspace you enabled on your existing dedicated SQL pool (formerly SQL DW) is enabled for data infiltration protection. Create a managed private endpoint connection from the workspace to the logical SQL server. Approve the private endpoint connection request to allow communications between the server and workspace.
- **Studio** SQL pools in the **Data hub** A workspace enabled dedicated SQL pool (formerly SQL DW) can be identified via the tool tip in the Data hub. 
- **Creating a new dedicated SQL pool (formerly SQL DW)** New dedicated SQL pools can be created via the Synapse workspace and Studio after the workspace feature has been enabled and provisioning of a new pool will take place on the logical SQL server. The new resources will appear in the portal and Studio when provisioning completes.      

## Next steps
Enable [Synapse workspace features](workspace-connected-create.md) on your existing dedicated SQL pool (formerly SQL DW)
