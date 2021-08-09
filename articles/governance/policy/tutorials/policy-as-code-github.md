---
title: "Tutorial: Implement Azure Policy as Code with GitHub"
description: In this tutorial, you implement an Azure Policy as Code workflow with export, GitHub actions, and GitHub workflows
ms.date: 03/31/2021
ms.topic: tutorial
---
# Tutorial: Implement Azure Policy as Code with GitHub

An Azure Policy as Code workflow makes it possible to manage your policy definitions and assignments
as code, control the lifecycle of updating those definitions, and automate the validating of
compliance results. In this tutorial, you learn to use Azure Policy features with GitHub to build a
lifecycle process. These tasks include:

> [!div class="checklist"]
> - Export policy definitions and assignments to GitHub
> - Push policy objects updated in GitHub to Azure
> - Trigger a compliance scan from the GitHub action

If you would like to assign a policy to identify the current compliance state of your existing
resources, the quickstart articles explain how to do so.

## Prerequisites

- If you don't have an Azure subscription, create a
  [free account](https://azure.microsoft.com/free/) before you begin.
- Review [Design an Azure Policy as Code workflow](../concepts/policy-as-code.md) to have an
  understanding of the design patterns used in this tutorial.

### Export Azure Policy objects from the Azure portal

To export a policy definition from Azure portal, follow these steps:

1. Launch the Azure Policy service in the Azure portal by clicking **All services**, then searching
   for and selecting **Policy**.

1. Select **Definitions** on the left side of the Azure Policy page.

1. Use the **Export definitions** button or select the ellipsis on the row of a policy definition
   and then select **Export definition**.

1. Select the **Sign in with GitHub** button. If you haven't yet authenticated with GitHub to
   authorize Azure Policy to export the resource, review the access the
   [GitHub Action](https://github.com/features/actions) needs in the new window that opens and
   select **Authorize AzureGitHubActions** to continue with the export process. Once complete, the
   new window self-closes.

1. On the **Basics** tab, set the following options, then select the **Policies** tab or **Next :
   Policies** button at the bottom of the page.

   - **Repository filter**: Set to _My repositories_ to see only repositories you own or _All
     repositories_ to see all you granted the GitHub Action access to.
   - **Repository**: Set to the repository that you want to export the Azure Policy resources to.
   - **Branch**: Set the branch in the repository. Using a branch other than the default is a good
     way to validate your updates before merging further into your source code.
   - **Directory**: The _root level folder_ to export the Azure Policy resources to. Subfolders
     under this directory are created based on what resources are exported.

1. On the **Policies** tab, set the scope to search by selecting the ellipsis and picking a
   combination of management groups, subscriptions, or resource groups.

1. Use the **Add policy definition(s)** button to search the scope for which objects to export. In
   the side window that opens, select each object to export. Filter the selection by the search box
   or the type. Once you've selected all objects to export, use the **Add** button at the bottom of
   the page.

1. For each selected object, select the desired export options such as _Only Definition_ or
   _Definition and Assignment(s)_ for a policy definition. Then select the **Review + Export** tab
   or **Next : Review + Export** button at the bottom of the page.

   > [!NOTE]
   > If option _Definition and Assignment(s)_ is chosen, only policy assignments within the scope
   > set by the filter when the policy definition is added are exported.

1. On the **Review + Export** tab, check the details match and then use the **Export** button at the
   bottom of the page.

1. Check your GitHub repo, branch, and _root level folder_ to see that the selected resources are
   now exported to your source control.

The Azure Policy resources are exported into the following structure within the selected GitHub
repository and _root level folder_:

```text
|
|- <root level folder>/  ________________ # Root level folder set by Directory property
|  |- policies/  ________________________ # Subfolder for policy objects
|     |- <displayName>_<name>____________ # Subfolder based on policy displayName and name properties
|        |- policy.json _________________ # Policy definition
|        |- assign.<displayName>_<name>__ # Each assignment (if selected) based on displayName and name properties
|
```

### Push policy objects updated in GitHub to Azure

1. When policy objects are exported, a
   [GitHub workflow](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow#about-workflows)
   file named `.github/workflows/manage-azure-policy-<randomLetters>.yml` is also created to get you
   started.

   > [!NOTE]
   > The GitHub workflow file is created each time export is used. Each instance of the file is
   > specific to the options during that export action.

1. This workflow file uses the
   [Manage Azure Policy](https://github.com/marketplace/actions/manage-azure-policy) action to push
   changes made to the exported policy objects in the GitHub repository back to Azure Policy. By
   default, the action considers and syncs only those files that are different from the ones
   existing in Azure. You can also use the `assignments` parameter in the action to only sync
   changes done to specific assignment files. This parameter can be used to apply policy assignments
   only for a specific environment. For more information, see the
   [Manage Azure Policy repository readme](https://github.com/Azure/manage-azure-policy).

1. By default, the workflow must be triggered manually. To do so, use the **Actions** in GitHub,
   select the `manage-azure-policy-<randomLetters>` workflow, select **Run workflow**, and then
   **Run workflow** again.

   :::image type="content" source="../media/policy-as-code-github/manually-trigger-workflow.png" alt-text="Screenshot of the Action tab, workflow, and Run workflow buttons in the GitHub web interface.":::

   > [!NOTE]
   > The workflow file must be in the default branch to be detected and manually run.

1. The workflow syncs the changes done to policy objects with Azure and gives you the status in the
   logs.

   :::image type="content" source="../media/policy-as-code-github/workflow-logging.png" alt-text="Screenshot of the workflow in action and logged details to the logs.":::

1. The workflow also adds details in Azure Policy objects `properties.metadata` for you to track.

   :::image type="content" source="../media/policy-as-code-github/updated-definition-metadata.png" alt-text="Screenshot of the Azure Policy definition in Azure portal updated with metadata specific to the GitHub action.":::

### Trigger compliance scans using GitHub action

Using the
[Azure Policy Compliance Scan action](https://github.com/marketplace/actions/azure-policy-compliance-scan)
you can trigger an on-demand compliance evaluation scan from your
[GitHub workflow](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow#about-workflows)
on one or multiple resources, resource groups, or subscriptions, and alter the workflow path based
on the compliance state of those resources. You can also configure the workflow to run at a
scheduled time to get the latest compliance status at a convenient time. Optionally, this
GitHub action can also generate a report on the compliance state of scanned resources for further
analysis or for archiving.

The following example runs a compliance scan for a subscription.

```yaml

on:
  schedule:
    - cron:  '0 8 * * *'  # runs every morning 8am
jobs:
  assess-policy-compliance:
    runs-on: ubuntu-latest
    steps:
    - name: Login to Azure
      uses: azure/login@v1
      with:
        creds: ${{secrets.AZURE_CREDENTIALS}}

    - name: Check for resource compliance
      uses: azure/policy-compliance-scan@v0
      with:
        scopes: |
          /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Review

In this tutorial, you successfully accomplished the following tasks:

> [!div class="checklist"]
> - Exported policy definitions and assignments to GitHub
> - Pushed policy objects updated in GitHub to Azure
> - Triggered a compliance scan from the GitHub action

## Next steps

To learn more about the structures of policy definitions, look at this article:

> [!div class="nextstepaction"]
> [Azure Policy definition structure](../concepts/definition-structure.md)
