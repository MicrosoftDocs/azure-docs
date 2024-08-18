---
title: Create a Chamber in the Azure Modeling and Simulation Workbench
description: How to create and manage a Chamber in the Azure Modeling and Simulation Workbench
author: yousefi-msft
ms.author: yousefi
ms.service: modeling-simulation-workbench
ms.topic: how-to
ms.date: 08/16/2024

#CustomerIntent: As a Workbench Owner, I want to create and manage a Chamber to isolate users, workloads and data.
---

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.

This template provides the basic structure of a How-to article pattern. See the
[instructions - How-to](../level4/article-how-to-guide.md) in the pattern library.

You can provide feedback about this template at: https://aka.ms/patterns-feedback

How-to is a procedure-based article pattern that show the user how to complete a task in their own environment. A task is a work activity that has a definite beginning and ending, is observable, consist of two or more definite steps, and leads to a product, service, or decision.

-->

<!-- 1. H1 -----------------------------------------------------------------------------

Required: Use a "<verb> * <noun>" format for your H1. Pick an H1 that clearly conveys the task the user will complete.

For example: "Migrate data from regular tables to ledger tables" or "Create a new Azure SQL Database".

* Include only a single H1 in the article.
* Don't start with a gerund.
* Don't include "Tutorial" in the H1.

-->
The Azure Modeling and Simulation Workbench provides a secure, cloud-based environment to collaborate with other organizations.  Chambers are isolated areas with no access to the internet or other Chambers, making them ideal work environments for enterprises.  In a complex project where isolation is needed, a Chamber should be created for each independent work group or enterprise that requires confidentiality and control of their data.

This article shows how to create, manage, and delete a Chamber.

<!-- 3. Prerequisites --------------------------------------------------------------------

Required: Make Prerequisites the first H2 after the H1. 

* Provide a bulleted list of items that the user needs.
* Omit any preliminary text to the list.
* If there aren't any prerequisites, list "None" in plain text, not as a bulleted item.

-->

## Prerequisites

* A Modeling and Simulation Workbench top-level Workbench has been created.
* A user account with Workbench Owner role assignments, or for certain operations the Chamber Admin role

<!-- 4. Task H2s ------------------------------------------------------------------------------

Required: Multiple procedures should be organized in H2 level sections. A section contains a major grouping of steps that help users complete a task. Each section is represented as an H2 in the article.

For portal-based procedures, minimize bullets and numbering.

* Each H2 should be a major step in the task.
* Phrase each H2 title as "<verb> * <noun>" to describe what they'll do in the step.
* Don't start with a gerund.
* Don't number the H2s.
* Begin each H2 with a brief explanation for context.
* Provide a ordered list of procedural steps.
* Provide a code block, diagram, or screenshot if appropriate
* An image, code block, or other graphical element comes after numbered step it illustrates.
* If necessary, optional groups of steps can be added into a section.
* If necessary, alternative groups of steps can be added into a section.

-->

## Create a Chamber

A Workbench Owner can create a Chamber in an existing Workbench. Chambers can't be renamed or moved once created, nor can the location be specified. Chambers are deployed to the same location as its parent Workbench.

1. From the Workbench overview page, select **Chamber** from the **Settings** menu in the left pane.
1. In the Chamber page, select **Create** from the action bar. :::image type="content" source="media/howtoguide-create-chamber/chamber-create-button.png" alt-text="Detail of Chamber action bar with Create button annotated in red box.":::
1. In the next dialog, only the name of a Chamber is required. Enter a name and select **Next**. :::image type="content" source="media/howtoguide-create-chamber/chamber-create-name.png" alt-text="A detail of Chamber name dialog.":::
1. If pre-validation checks are successful, select **Create**.  A Chamber typically takes around 15 minutes to deploy.

## Manage a Chamber

Once a Chamber is created, a Workbench Owner or Chamber Admin can administer it. A Chamber can be stopped, started, or restarted. Chambers are the scope of user role assignments, as well as definining boundary for data.

* [Manage users](./how-to-guide-manage-users.md)
* [Manage license servers or upload licenses](./how-to-guide-licenses.md)
* [Start, stop, or restart a Chamber](./howtoTODO)
* [Upload data](./how-to-guide-upload-data.md)
* [Download data](./how-to-guide-download-data.md)

## Delete a Chamber

If a Chamber is no longer needed, it can be deleted only if it is empty.  All nested resources under the Chamber must first be deleted before the Chamber can be deleted.  A Chamber's nested resources include VMs, Connectors, and Chamber Storage. Once a Chamber is deleted, it cannot be recovered.

1. Navigate to Chamber.
1. Ensure that all nested resources are deleted.  From the **Settings** menu at the left, visit each of the nested resources and ensure that they are empty. Visit the [Deleting nested resources](#deleting-nested-resources) section below to learn how to delete each of those resources.
1. Select **Delete** from the action bar. Deleting a Chamber can take up to 10 minutes.

### Deleting nested resources

Nested resources of a Chamber must first be deleted before the top-level Chamber can be deleted. A Chamber can't be deleted if it still has a Connector, Chamber Storage, or VM deployed within it. License servers are Chamber infrastructure, are not user deployable, and do not apply to this requirement.

* [Manage Connectors](./how-to-guide-connector.md)
* [Manage Chamber Storage](./how-to-guide-manage-storage.md)
* [Manage Chamber VMs](./how-to-VM)

<!-- 5. Next step/Related content------------------------------------------------------------------------

Optional: You have two options for manually curated links in this pattern: Next step and Related content. You don't have to use either, but don't use both.
  - For Next step, provide one link to the next step in a sequence. Use the blue box format
  - For Related content provide 1-3 links. Include some context so the customer can determine why they would click the link. Add a context sentence for the following links.

-->

## Related content

* [Manage license servers](./how-to-guide-licenses.md)
