---
title: Source control and development branches - LUIS
description: How to maintain your Language Understanding (LUIS) app under source control. How to apply updates to a LUIS app while working in a development branch.
ms.service: azure-ai-language
ms.subservice: azure-ai-luis
ms.topic: conceptual
ms.date: 06/14/2022
author: aahill
manager: nitinme
ms.author: aahi
---


# DevOps practices for LUIS

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]


Software engineers who are developing a Language Understanding (LUIS) app can apply DevOps practices around [source control](luis-concept-devops-sourcecontrol.md), [automated builds](luis-concept-devops-automation.md), [testing](luis-concept-devops-testing.md), and [release management](luis-concept-devops-automation.md#release-management) by following these guidelines.

## Source control and branch strategies for LUIS

One of the key factors that the success of DevOps depends upon is [source control](/azure/devops/user-guide/source-control). A source control system allows developers to collaborate on code and to track changes. The use of branches allows developers to switch between different versions of the code base, and to work independently from other members of the team. When developers raise a [pull request](https://help.github.com/github/collaborating-with-issues-and-pull-requests/about-pull-requests) (PR) to propose updates from one branch to another, or when changes are merged, these can be the trigger for [automated builds](luis-concept-devops-automation.md) to build and continuously test code.

By using the concepts and guidance that are described in this document, you can develop a LUIS app while tracking changes in a source control system, and follow these software engineering best practices:

- **Source Control**
  - Source code for your LUIS app is in a human-readable format.
  - The model can be built from source in a repeatable fashion.
  - The source code can be managed by a source code repository.
  - Credentials and secrets such as keys are never stored in source code.

- **Branching and Merging**
  - Developers can work from independent branches.
  - Developers can work in multiple branches concurrently.
  - It's possible to integrate changes to a LUIS app from one branch into another through rebase or merge.
  - Developers can merge a PR to the parent branch.

- **Versioning**
  - Each component in a large application should be versioned independently, allowing developers to detect breaking changes or updates just by looking at the version number.

- **Code Reviews**
  - The changes in the PR are presented as human readable source code that can be reviewed before accepting the PR.

## Source control

To maintain the [App schema definition](./app-schema-definition.md) of a LUIS app in a source code management system, use the [LUDown format (`.lu`)](/azure/bot-service/file-format/bot-builder-lu-file-format)  representation of the app. `.lu` format is preferred to `.json` format because it's human readable, which makes it easier to make and review changes in PRs.

### Save a LUIS app using the LUDown format

To save a LUIS app in `.lu` format and place it under source control:

- EITHER: [Export the app version](./luis-how-to-manage-versions.md#other-actions) as `.lu` from the [LUIS portal](https://www.luis.ai/) and add it to your source control repository

- OR: Use a text editor to create a `.lu` file for a LUIS app and add it to your source control repository

> [!TIP]
> If you are working with the JSON export of a LUIS app, you can [convert it to LUDown](https://github.com/microsoft/botframework-cli/tree/master/packages/luis#bf-luisconvert).  Use the `--sort` option to ensure that intents and utterances are sorted alphabetically.  
> Note that the **.LU** export capability built into the LUIS portal already sorts the output.

### Build the LUIS app from source

For a LUIS app, to *build from source* means to [create a new LUIS app version by importing the `.lu` source](./luis-how-to-manage-versions.md#import-version) , to [train the version](./how-to/train-test.md) and to [publish it](./how-to/publish.md). You can do this in the LUIS portal, or at the command line:

- Use the LUIS portal to [import the `.lu` version](./luis-how-to-manage-versions.md#import-version) of the app from source control, and [train](./how-to/train-test.md) and [publish](./how-to/publish.md) the app.

- Use the [Bot Framework Command Line Interface for LUIS](https://github.com/microsoft/botbuilder-tools/tree/master/packages/LUIS) at the command line or in a CI/CD workflow to [import](https://github.com/microsoft/botframework-cli/blob/master/packages/luis/README.md#bf-luisversionimport) the `.lu` version of the app from source control into a LUIS application, and [train](https://github.com/microsoft/botframework-cli/blob/master/packages/luis/README.md#bf-luistrainrun) and [publish](https://github.com/microsoft/botframework-cli/blob/master/packages/luis/README.md#bf-luisapplicationpublish) the app.

### Files to maintain under source control

The following types of files for your LUIS application should be maintained under source control:

- `.lu` file for the LUIS application

- [Unit Test definition files](luis-concept-devops-testing.md#writing-tests) (utterances and expected results)

- [Batch test files](./luis-how-to-batch-test.md#batch-test-file) (utterances and expected results) used for performance testing

### Credentials and keys are not checked in

Do not include keys or similar confidential values in files that you check in to your repo where they might be visible to unauthorized personnel. The keys and other values that you should prevent from check-in include:

- LUIS Authoring and Prediction keys
- LUIS Authoring and Prediction endpoints
- Azure resource keys
- Access tokens, such as the token for an Azure [service principal](/cli/azure/ad/sp) used for automation authentication

#### Strategies for securely managing secrets

Strategies for securely managing secrets include:

- If you're using Git version control, you can store runtime secrets in a local file and prevent check in of the file by adding a pattern to match the filename to a [.gitignore](https://git-scm.com/docs/gitignore) file
- In an automation workflow, you can store secrets securely in the parameters configuration offered by that automation technology. For example, if you're using [GitHub Actions](https://github.com/features/actions), you can store secrets securely in [GitHub secrets](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets).

## Branching and merging

Distributed version control systems like Git give flexibility in how team members publish, share, review, and iterate on code changes through development branches shared with others. Adopt a [Git branching strategy](/azure/devops/repos/git/git-branching-guidance) that is appropriate for your team.

Whichever branching strategy you adopt, a key principle of all of them is that team members can work on the solution within a *feature branch* independently from the work that is going on in other branches.

To support independent working in branches with a LUIS project:

- **The main branch has its own LUIS app.** This app represents the current state of your solution for your project and its current active version should always map to the `.lu` source that is in the main branch. All updates to the `.lu` source for this app should be reviewed and tested so that this app could be deployed to build environments such as Production at any time. When updates to the `.lu` are merged into main from a feature branch, you should create a new version in the LUIS app and [bump the version number](#versioning).

- **Each feature branch must use its own instance of a LUIS app**. Developers work with this app in a feature branch without risk of affecting developers who are working in other branches. This 'dev branch' app is a working copy that should be deleted when the feature branch is deleted.

![Git feature branch](./media/luis-concept-devops-sourcecontrol/feature-branch.png)

### Developers can work from independent branches

Developers can work on updates on a LUIS app independently from other branches by:

1. Creating a feature branch from the main branch (depending on your branch strategy, usually main or develop).

1. [Create a new LUIS app in the LUIS portal](./how-to/sign-in.md) (the "*dev branch app*") solely to support the work in the feature branch.

   * If the `.lu` source for your solution already exists in your branch, because it was saved after work done in another branch earlier in the project, create your dev branch LUIS app by importing the `.lu` file.

   * If you are starting work on a new project, you will not yet have the `.lu` source for your main LUIS app in the repo. You will create the `.lu` file by exporting your dev branch app from the portal when you have completed your feature branch work, and submit it as a part of your PR.

1. Work on the active version of your dev branch app to implement the required changes. We recommend that you work only in a single version of your dev branch app for all the feature branch work. If you create more than one version in your dev branch app, be careful to track which version contains the changes you want to check in when you raise your PR.

1. Test the updates - see [Testing for LUIS DevOps](luis-concept-devops-testing.md) for details on testing your dev branch app.

1. Export the active version of your dev branch app as `.lu` from the [versions list](./luis-how-to-manage-versions.md).

1. Check in your updates and invite peer review of your updates. If you're using GitHub, you'll raise a [pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests).

1. When the changes are approved, merge the updates into the main branch. At this point, you will create a new [version](./luis-how-to-manage-versions.md) of the *main* LUIS app, using the updated `.lu` in main. See [Versioning](#versioning) for considerations on setting the version name.

1. When the feature branch is deleted, it's a good idea to delete the dev branch LUIS app you created for the feature branch work.

### Developers can work in multiple branches concurrently

If you follow the pattern described above in [Developers can work from independent branches](#developers-can-work-from-independent-branches), then you will use a unique LUIS application in each feature branch. A single developer can work on multiple branches concurrently, as long as they switch to the correct dev branch LUIS app for the branch they're currently working on.

We recommend that you use the same name for both the feature branch and for the dev branch LUIS app that you create for the feature branch work, to make it less likely that you'll accidentally work on the wrong app.

As noted above, we recommend that for simplicity, you work in a single version in each dev branch app. If you are using multiple versions, take care to activate the correct version as you switch between dev branch apps.

### Multiple developers can work on the same branch concurrently

You can support multiple developers working on the same feature branch at the same time:

- Developers check out the same feature branch and push and pull changes submitted by themselves and other developers while work proceeds, as normal.

- If you follow the pattern described above in [Developers can work from independent branches](#developers-can-work-from-independent-branches), then this branch will use a unique LUIS application to support development. That 'dev branch' LUIS app will be created by the first member of the development team who begins work in the feature branch.

- [Add team members as contributors](./luis-how-to-collaborate.md) to the dev branch LUIS app.

- When the feature branch work is complete, export the active version of the dev branch LUIS app as `.lu` from the [versions list](./luis-how-to-manage-versions.md), save the updated `.lu` file in the repo, and check in and PR the changes.

### Incorporating changes from one branch to another with rebase or merge

Some other developers on your team working in another branch may have made updates to the `.lu` source and merged them to the main branch after you created your feature branch. You may want to incorporate their changes into your working version before you continue to make own changes within your feature branch. You can do this by [rebase or merge to main](https://git-scm.com/book/en/v2/Git-Branching-Rebasing) in the same way as any other code asset. Since the LUIS app in LUDown format is human readable, it supports merging using standard merge tools.

Follow these tips if you're rebasing your LUIS app in a feature branch:

- Before you rebase or merge, make sure your local copy of the `.lu` source for your app has all your latest changes that you've applied using the LUIS portal, by re-exporting your app from the portal first. That way, you can make sure that any changes you've made in the portal and not yet exported don't get lost.

- During the merge, use standard tools to resolve any merge conflicts.

- Don't forget after rebase or merge is complete to re-import the app back into the portal, so that you're working with the updated app as you continue to apply your own changes.

### Merge PRs

After your PR is approved, you can merge your changes to your main branch. No special considerations apply to the LUDown source for a LUIS app: it's human readable and so supports merging using standard Merge tools. Any merge conflicts may be resolved in the same way as with other source files.

After your PR has been merged, it's recommended to cleanup:

- Delete the branch in your repo

- Delete the 'dev branch' LUIS app you created for the feature branch work.

In the same way as with application code assets, you should write unit tests to accompany LUIS app updates. You should employ continuous integration workflows to test:

- Updates in a PR before the PR is merged
- The main branch LUIS app after a PR has been approved and the changes have been merged into main.

For more information on testing for LUIS DevOps, see [Testing for DevOps for LUIS](luis-concept-devops-testing.md). For more details on implementing workflows, see [Automation workflows for LUIS DevOps](luis-concept-devops-automation.md).

## Code reviews

A LUIS app in LUDown format is human readable, which supports the communication of changes in a PR suitable for review. Unit test files are also written in LUDown format and also easily reviewable in a PR.

## Versioning

An application consists of multiple components that might include things such as a bot running in [Azure AI Bot Service](/azure/bot-service/bot-service-overview-introduction), [QnA Maker](https://www.qnamaker.ai/), [Azure AI Speech service](../speech-service/overview.md), and more. To achieve the goal of loosely coupled applications, use [version control](/devops/develop/git/what-is-version-control) so that each component of an application is versioned independently, allowing developers to detect breaking changes or updates just by looking at the version number. It's easier to version your LUIS app independently from other components if you maintain it in its own repo.

The LUIS app for the main branch should have a versioning scheme applied. When you merge updates to the `.lu` for a LUIS app into main, you'll then import that updated source into a new version in the LUIS app for the main branch.

It is recommended that you use a numeric versioning scheme for the main LUIS app version, for example:

`major.minor[.build[.revision]]`

Each update the version number is incremented at the last digit.

The major / minor version can be used to indicate the scope of the changes to the LUIS app functionality:

* Major Version: A significant change, such as support for a new [Intent](./concepts/intents.md) or [Entity](concepts/entities.md)
* Minor Version: A backwards-compatible minor change, such as after significant new training
* Build: No functionality change, just a different build.

Once you've determined the version number for the latest revision of your main LUIS app, you need to build and test the new app version, and publish it to an endpoint where it can be used in different build environments, such as Quality Assurance or Production. It's highly recommended that you automate all these steps in a continuous integration (CI) workflow.

See:
- [Automation workflows](luis-concept-devops-automation.md) for details on how to implement a CI workflow to test and release a LUIS app.
- [Release Management](luis-concept-devops-automation.md#release-management) for information on how to deploy your LUIS app.

### Versioning the 'feature branch' LUIS app

When you are working with a 'dev branch' LUIS app that you've created to support work in a feature branch, you will be exporting your app when your work is complete and you will include the updated `'lu` in your PR. The branch in your repo, and the 'dev branch' LUIS app should be deleted after the PR is merged into main. Since this app exists solely to support the work in the feature branch, there's no particular versioning scheme you need to apply within this app.

When your changes in your PR are merged into main, that is when the versioning should be applied, so that all updates to main are versioned independently.

## Next steps

* Learn about [testing for LUIS DevOps](luis-concept-devops-testing.md)
* Learn how to [implement DevOps for LUIS with GitHub](./luis-concept-devops-automation.md)
