---
title: Project-level access control in Microsoft Discovery
description: Learn how project-level Azure RBAC isolates Microsoft Discovery projects while allowing controlled use of shared tools, models, storage, and knowledge bases.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: concept-article
ms.date: 08/17/2026
# Customer intent: As a platform administrator, I want to understand project-level access control so that I can isolate research teams in a shared Microsoft Discovery workspace.
---

# Project-level access control in Microsoft Discovery

Microsoft Discovery uses Azure role-based access control (Azure RBAC) to make each project an access boundary within a shared workspace. You can grant a user access to one project without granting access to every project in the workspace.

Project-level access is useful when multiple research teams share workspace infrastructure but must keep their agents, investigations, shared sessions, and research data isolated.

## How project-level access works

A Microsoft Discovery project is a child Azure resource of a workspace:

```text
/subscriptions/{subscription-id}
  /resourceGroups/{resource-group-name}
    /providers/Microsoft.Discovery
      /workspaces/{workspace-name}
        /projects/{project-name}
```

Microsoft Discovery evaluates project-owned operations at this project resource scope. Azure RBAC inheritance still applies:

- A role assigned directly to a project applies only to that project.
- A role assigned to the parent workspace, resource group, or subscription is inherited by the project.
- Existing Microsoft Discovery Platform roles continue to work on projects beneath their assignment scope.

This model allows platform administrators to manage shared infrastructure broadly while granting researchers access only to the projects they need.

## Project roles

Use the following Microsoft Discovery built-in roles for project-level access:

| Role | Capabilities | Recommended scope |
|---|---|---|
| **Microsoft Discovery Project Contributor (Preview)** | Read and manage an existing project's investigations, shared sessions, conversations, agents, tasks, Discovery Engine operations, and project settings. Can't create a new project or assign roles. | Project |
| **Microsoft Discovery Project Reader (Preview)** | Read a project and its project-owned content without creating, changing, running, or deleting resources. | Project |

Creating a new project requires an appropriate Microsoft Discovery Platform role at the workspace or an inherited scope. Assigning either project role requires **Owner**, **User Access Administrator**, or **Role Based Access Control Administrator** at the project or an inherited scope.

## Choose the right project role

| Scenario | Recommended assignments |
|---|---|
| Researcher who creates agents and manages artifacts | Project Contributor paired with Tools Reader, Chat Model Reader, Storage Account Contributor, Storage Blob Data Contributor, Storage Container Contributor, and Bookshelf Index Data Reader at the required resource scopes |
| Researcher who only runs pre-created agents and Discovery Engine | Project Contributor; add storage or Bookshelf roles only when the user must directly access those resources |
| Reviewer who inspects project results | Project Reader paired with Storage Container Reader and Storage Blob Data Reader; optionally add Tools Reader and Bookshelf Index Data Reader |
| Platform administrator for a workspace | Appropriate Microsoft Discovery Platform role at the workspace, resource group, or subscription; don't add project roles unless a separate explicit assignment is required |
| User who works in two projects | Assign a project role independently on each project; avoid granting a workspace-level Platform role solely for convenience |

### Example: Project Contributor versus Project Reader

Consider a drug-discovery project shared by an active research team and an external scientific reviewer.

#### Project Contributor example

A research scientist who designs and runs the project's experiments should receive **Microsoft Discovery Project Contributor (Preview)**.

The contributor can:

- Create and manage investigations, shared sessions, conversations, tasks, and agents in the assigned project.
- Run pre-created agents and Discovery Engine.
- Create or update agents with approved tools, chat models, and knowledge bases when the corresponding companion reader roles are assigned.
- Create and manage project storage assets and blob content when the contributor storage roles are assigned.
- Change existing project settings.

The contributor can't:

- Create a new project.
- Assign Azure roles.
- Access another project unless separately assigned.
- View or select tools, chat models, storage, or knowledge resources that aren't covered by a companion role assignment.

#### Project Reader example

A principal investigator, auditor, partner, or scientific reviewer who needs to inspect results without changing the research should receive **Microsoft Discovery Project Reader (Preview)**.

The reader can:

- View the assigned project and its agents, investigations, shared sessions, conversations, tasks, and results.
- View Discovery storage assets when Storage Container Reader is assigned.
- Open generated blob content when Storage Blob Data Reader is assigned.
- Inspect tool definitions when Tools Reader is assigned.
- View and query accessible bookshelves and knowledge bases when the optional Bookshelf Index Data Reader role is assigned.

The reader can't:

- Create, update, run, or delete investigations, agents, tasks, or shared sessions.
- Modify project settings.
- Create or change storage assets or blob content.
- Access another project or shared resource unless separately assigned.

## Pair project roles with resource roles

Projects use tools, models, storage, and knowledge resources that exist outside the project scope. A project role doesn't automatically grant access to these shared resources. Assign the project role together with the companion roles that fit the user's responsibilities.


### Project Contributor access bundle

For a contributor who authors agents and manages project artifacts, pair **Microsoft Discovery Project Contributor (Preview)** with the following roles as needed:

| Companion role | Why the contributor needs it | Recommended scope |
|---|---|---|
| **Microsoft Discovery Tools Reader (Preview)** | View approved tool definitions and select those tools while creating or updating an agent. | Individual tool, resource group, or subscription |
| **Microsoft Discovery Chat Model Reader (Preview)** | View and select an approved chat model deployment while creating or updating an agent. | Individual chat model deployment or workspace |
| **Storage Account Contributor** | Access and manage the Azure Storage account that holds project artifacts. | Backing storage account or its resource group |
| **Storage Blob Data Contributor** | Read, create, update, and delete blob content in the backing storage account. | Backing blob container or storage account |
| **Microsoft Discovery Storage Container Contributor (Preview)** | Create, update, and delete Discovery storage assets used by project investigations. | Individual Microsoft Discovery storage container |
| **Microsoft Discovery Bookshelf Index Data Reader - Preview** | List approved bookshelves and knowledge bases, query their content, and select them while creating an agent. | Individual bookshelf, resource group, or subscription |

> [!NOTE]
> This access model assumes that a user with **Microsoft Discovery Platform Administrator (Preview)** or **Microsoft Discovery Platform Contributor (Preview)** creates and manages the tools. A Project Contributor receives **Microsoft Discovery Tools Reader (Preview)** only to view approved tool definitions and attach those tools to agents that they create or update in the assigned project. Tools Reader doesn't grant permission to create, update, or delete tools.

Not every contributor needs every companion role. Grant only the tools, models, storage, and knowledge resources required by the project.

### Project Reader access bundle

For a reader who reviews project results, pair **Microsoft Discovery Project Reader (Preview)** with the following roles as needed:

| Companion role | Why the reader needs it | Recommended scope |
|---|---|---|
| **Microsoft Discovery Tools Reader (Preview)** | View tool definitions referenced by the project. | Individual tool, resource group, or subscription |
| **Microsoft Discovery Storage Container Reader (Preview)** | View Discovery storage containers and storage assets associated with project investigations. | Individual Microsoft Discovery storage container |
| **Storage Blob Data Reader** | Open and read the blob content generated for project investigations. | Backing blob container or storage account |
| **Microsoft Discovery Bookshelf Index Data Reader - Preview** *(optional)* | View bookshelves and knowledge bases associated with agents. This role also grants permission to query accessible knowledge bases, including through the CLI. | Individual bookshelf, resource group, or subscription |

The Microsoft Discovery storage roles control Discovery container and asset metadata. They don't grant access to the bytes stored in Azure Blob Storage, so pair them with the corresponding Azure Storage data role.

## How companion resource access works

- **Agent creation and update checks:** When a user creates or updates an agent, Microsoft Discovery verifies that the user has read access to every referenced tool and to the selected chat model deployment. The operation is denied if any linked resource isn't accessible.
- **Cross-project isolation:** The checks prevent a project-only user from attaching an agent to a tool or model that belongs to another team.
- **Pre-created agents:** A Project Contributor doesn't need Tools Reader or Chat Model Reader solely to run an agent that a platform administrator already created with its tools and model. Those roles are needed when the contributor must view or select linked resources during agent creation or update.
- **Access revocation:** Tool and chat model access is checked when the agent is created or updated, not each time it runs. Removing a user's linked-resource role later doesn't prevent an already-created agent from continuing to use that resource. Update or remove affected agents when revoking linked-resource access.
- **Discovery Engine model:** Discovery Engine uses its platform-configured `gpt-5-4` chat model deployment. A Project Contributor can run Discovery Engine without a separate Chat Model Reader assignment for that deployment.
- **Knowledge base and storage access:** Knowledge bases and storage have their own access requirements. Grant both the relevant Microsoft Discovery role and any backing-service data role that the workflow requires.

## Project-owned operations

Project authorization applies to project-owned operations, including:

- Investigations and Discovery Engine tasks
- Shared sessions, conversations, and responses
- Agents
- Linked storage assets
- Project-scoped Workbench session creation

Project resolution can come from the request route, query, request body, or an existing conversation record. If Microsoft Discovery can't resolve the project, authorization fails closed.

> [!NOTE]
> Some Workbench session read and status operations don't carry project context and require inherited workspace access. A user who has only a project role can receive an authorization error for these operations even after creating a project-scoped Workbench session.

## Security recommendations

- Assign roles to Microsoft Entra groups instead of individual users when practical.
- Use the narrowest resource scope that supports the workflow.
- Separate project access from access to shared tools, models, storage, and knowledge bases.
- Review both project and linked-resource assignments during access reviews.
- Remove or update existing agents when linked-resource access is revoked.
- Don't use a broad Platform role to work around a missing supplementary resource role.

## Related content

- [Configure project-level access](how-to-configure-project-rbac.md)
- [Role assignments in Microsoft Discovery](concept-role-assignments.md)
- [Microsoft Discovery projects and shared sessions](concept-projects-investigations.md)
- [Azure RBAC scope overview](/azure/role-based-access-control/scope-overview)
