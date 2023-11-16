---
title: Enable pull request annotations in GitHub or in Azure DevOps
description: Add pull request annotations in GitHub or in Azure DevOps. By adding pull request annotations, your SecOps and developer teams so that they can be on the same page when it comes to mitigating issues.
ms.topic: overview
ms.custom: ignite-2022
ms.date: 06/06/2023
---

# Enable pull request annotations in GitHub and Azure DevOps

DevOps security exposes security findings as annotations in Pull Requests (PR). Security operators can enable PR annotations in Microsoft Defender for Cloud. Any exposed issues can be remedied by developers. This process can prevent and fix potential security vulnerabilities and misconfigurations before they enter the production stage. DevOps security annotates vulnerabilities within the differences introduced during the pull request rather than all the vulnerabilities detected across the entire file. Developers are able to see annotations in their source code management systems and Security operators can see any unresolved findings in Microsoft Defender for Cloud.  

With Microsoft Defender for Cloud, you can configure PR annotations in Azure DevOps. You can get PR annotations in GitHub if you're a GitHub Advanced Security customer.

## What are pull request annotations

Pull request annotations are comments that are added to a pull request in GitHub or Azure DevOps. These annotations provide feedback on the code changes made and identified security issues in the pull request and help reviewers understand the changes that are made.

Annotations can be added by a user with access to the repository, and can be used to suggest changes, ask questions, or provide feedback on the code. Annotations can also be used to track issues and bugs that need to be fixed before the code is merged into the main branch. DevOps security in Defender for Cloud uses annotations to surface security findings.

## Prerequisites

**For GitHub**:

- An Azure account. If you don't already have an Azure account, you can [create your Azure free account today](https://azure.microsoft.com/free/).
- Be a [GitHub Advanced Security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security) customer. 
- [Connect your GitHub repositories to Microsoft Defender for Cloud](quickstart-onboard-github.md).
- [Configure the Microsoft Security DevOps GitHub action](github-action.md).

**For Azure DevOps**:

- An Azure account. If you don't already have an Azure account, you can [create your Azure free account today](https://azure.microsoft.com/free/).
- [Have write access (owner/contributer) to the Azure subscription](../active-directory/privileged-identity-management/pim-how-to-activate-role.md). 
- [Connect your Azure DevOps repositories to Microsoft Defender for Cloud](quickstart-onboard-devops.md).
- [Configure the Microsoft Security DevOps Azure DevOps extension](azure-devops-extension.md).

## Enable pull request annotations in GitHub

By enabling pull request annotations in GitHub, your developers gain the ability to see their security issues when they create a PR directly to the main branch.

**To enable pull request annotations in GitHub**:

1. Navigate to [GitHub](https://github.com/) and sign in.

1. Select a repository that you've onboarded to Defender for Cloud.

1. Navigate to **`Your repository's home page`** > **.github/workflows**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/workflow-folder.png" alt-text="Screenshot that shows where to navigate to, to select the GitHub workflow folder." lightbox="media/tutorial-enable-pr-annotations/workflow-folder.png":::

1. Select **msdevopssec.yml**, which was created in the [prerequisites](#prerequisites).

    :::image type="content" source="media/tutorial-enable-pr-annotations/devopssec.png" alt-text="Screenshot that shows you where on the screen to select the msdevopssec.yml file." lightbox="media/tutorial-enable-pr-annotations/devopssec.png":::

1. Select **edit**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/edit-button.png" alt-text="Screenshot that shows you what the edit button looks like." lightbox="media/tutorial-enable-pr-annotations/edit-button.png":::

1. Locate and update the trigger section to include:

    ```yml
    # Triggers the workflow on push or pull request events but only for the main branch
    pull_request:
      branches: ["main"]
    ```

    You can also view a [sample repository](https://github.com/microsoft/security-devops-action/tree/main/samples).

    (Optional) You can select which branches you want to run it on by entering the branch(es) under the trigger section. If you want to include all branches remove the lines with the branch list.  

1. Select **Start commit**.

1. Select **Commit changes**.

    Any issues that are discovered by the scanner will be viewable in the Files changed section of your pull request.
    - **Used in tests** - The alert isn't in the production code.

## Enable pull request annotations in Azure DevOps

By enabling pull request annotations in Azure DevOps, your developers gain the ability to see their security issues when they create PRs directly to the main branch.

### Enable Build Validation policy for the CI Build

Before you can enable pull request annotations, your main branch must have enabled Build Validation policy for the CI Build.

**To enable Build Validation policy for the CI Build**:

1. Sign in to your Azure DevOps project.

1. Navigate to **Project settings** > **Repositories**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/project-settings.png" alt-text="Screenshot that shows you where to navigate to, to select repositories.":::

1. Select the repository to enable pull requests on.

1. Select **Policies**.

1. Navigate to **Branch Policies** > **Main branch**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/branch-policies.png" alt-text="Screenshot that shows where to locate the branch policies." lightbox="media/tutorial-enable-pr-annotations/branch-policies.png":::

1. Locate the Build Validation section. 

1. Ensure the build validation for your repository is toggled to **On**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/build-validation.png" alt-text="Screenshot that shows where the CI Build toggle is located." lightbox="media/tutorial-enable-pr-annotations/build-validation.png":::

1. Select **Save**. 

    :::image type="content" source="media/tutorial-enable-pr-annotations/validation-policy.png" alt-text="Screenshot that shows the build validation.":::

Once you've completed these steps, you can select the build pipeline you created previously and customize its settings to suit your needs.  

### Enable pull request annotations

**To enable pull request annotations in Azure DevOps**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Defender for Cloud** > **DevOps security**.

1. Select all relevant repositories to enable the pull request annotations on.

1. Select **Manage resources**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/manage-resources.png" alt-text="Screenshot that shows you how to manage resources.":::

1. Toggle pull request annotations to **On**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/annotation-on.png" alt-text="Screenshot that shows the toggle switched to on.":::

1. (Optional) Select a category from the drop-down menu.

    > [!NOTE]
    > Only Infrastructure-as-Code misconfigurations (ARM, Bicep, Terraform, CloudFormation, Dockerfiles, Helm Charts, and more) results are currently supported.

1. (Optional) Select a severity level from the drop-down menu.

1. Select **Save**.

All annotations on your pull requests will be displayed from now on based on your configurations.

**To enable pull request annotations for my Projects and Organizations in Azure DevOps**:

You can do this programatically by calling the Update Azure DevOps Resource API exposed the Microsoft. Security
Resource Provider.

API Info:

**Http Method**: PATCH
**URLs**:
- Azure DevOps Project Update: `https://management.azure.com/subscriptions/<subId>/resourcegroups/<resourceGroupName>/providers/Microsoft.Security/securityConnectors/<connectorName>/devops/default/azureDevOpsOrgs/<adoOrgName>/projects/<adoProjectName>?api-version=2023-09-01-preview`
- Azure DevOps Org Update]: `https://management.azure.com/subscriptions/<subId>/resourcegroups/<resourceGroupName>/providers/Microsoft.Security/securityConnectors/<connectorName>/devops/default/azureDevOpsOrgs/<adoOrgName>?api-version=2023-09-01-preview`

Request Body:

```json
{
   "properties": {
"actionableRemediation": {
              "state": <ActionableRemediationState>,
              "categoryConfigurations":[
                    {"category": <Category>,"minimumSeverityLevel": <Severity>}
               ]
           }
    }
}
```

Parameters / Options Available

**`<ActionableRemediationState>`**
**Description**: State of the PR Annotation Configuration
**Options**: Enabled | Disabled

**`<Category>`**
**Description**: Category of Findings that will be annotated on pull requests. 
**Options**: IaC | Code | Artifacts | Dependencies | Containers
**Note**: Only IaC is supported currently

**`<Severity>`**
**Description**: The minimum severity of a finding that will be considered when creating PR annotations. 
**Options**: High | Medium | Low

Example of enabling an Azure DevOps Org's PR Annotations for the IaC category with a minimum severity of Medium using the az cli tool.

Update Org:

```azurecli
az --method patch --uri https://management.azure.com/subscriptions/4383331f-878a-426f-822d-530fb00e440e/resourcegroups/myrg/providers/Microsoft.Security/securityConnectors/myconnector/devops/default/azureDevOpsOrgs/testOrg?api-version=2023-09-01-preview --body "{'properties':{'actionableRemediation':{'state':'Enabled','categoryConfigurations':[{'category':'IaC','minimumSeverityLevel':'Medium'}]}}}
```

Example of enabling an Azure DevOps Project's PR Annotations for the IaC category with a minimum severity of High using the az cli tool.

Update Project:

```azurecli
az --method patch --uri https://management.azure.com/subscriptions/4383331f-878a-426f-822d-530fb00e440e/resourcegroups/myrg/providers/Microsoft.Security/securityConnectors/myconnector/devops/default/azureDevOpsOrgs/testOrg/projects/testProject?api-version=2023-09-01-preview --body "{'properties':{'actionableRemediation':{'state':'Enabled','categoryConfigurations':[{'category':'IaC','minimumSeverityLevel':'High'}]}}}"
```

## Learn more

- Learn more about [DevOps security](defender-for-devops-introduction.md).
- Learn more about [DevOps security in Infrastructure as Code](iac-vulnerabilities.md).

## Next steps

> [!div class="nextstepaction"]
> Now learn more about [DevOps security](defender-for-devops-introduction.md).
