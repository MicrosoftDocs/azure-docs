---
title: Source control and development branches - LUIS
description: How to maintain your Language Understanding Intelligent Services (LUIS) app under source control. How to apply updates to a LUIS app while working in a development branch.
ms.topic: conceptual
ms.date: 05/28/2020
---

# DevOps practices for LUIS

Software engineers want to follow DevOps practices around source control, automated builds and testing and release management when developing a Language Understanding Intelligent Services (LUIS) app. It is not always obvious how to achieve these goals when working with a web portal development tool such as the [LUIS Portal](https://www.luis.ai). 

In these documents, you can learn how to follow DevOps practices when developing a LUIS app:

- [Source control and branch strategies for LUIS](#source-control-and-branch-strategies-for-luis) (this document)
- [Unit Testing and F-measure testing for LUIS DevOps](luis-concept-devops-testing.md)
- [Automation workflows for LUIS DevOps](link tbd)
- [Release management](link tbd)

## Source control and branch strategies for LUIS

By following the procedures described in this document, you can develop a LUIS app while observing these software engineering best practices:

- **Source Control** 
  - Source code for your LUIS app is in a human-readable format
  - The model can be built from source in a repeatable fashion
  - The source code can be managed by a source code repository
  - Credentials and secrets such as authoring and subscription keys are never stored in source code.

- **Branching and Merging** 
  - Developers can work from independent branches, 
  - in multiple branches concurrently, 
  - rebase and merge from the parent branch, 
  - and merge a [pull request](https://help.github.com/github/collaborating-with-issues-and-pull-requests/about-pull-requests) (PR) to the parent branch.

- **Code Reviews** 
  - The changes in the PR are presented as human readable source code that can be reviewed before accepting the PR.

### Source Control

To maintain the [App schema definition](https://docs.microsoft.com/azure/cognitive-services/luis/app-schema-definition) of a LUIS app in a source code management system, use the [LUDown format (`.lu`)](https://github.com/microsoft/botframework-cli/blob/master/packages/luis/docs/lu-file-format.md)  representation of the app. `.lu` format is preferred to `.json` format because it's human readable, which makes it easier to modify and to review changes in PRs.

#### Saving a LUIS app using the LUDown format

To save a LUIS app in `.lu` format and place it under source control:

- EITHER: [Export the app version as `.lu`](https://docs.microsoft.com/azure/cognitive-services/luis/luis-how-to-manage-versions#other-actions) from the [LUIS portal](https://www.luis.ai/) and add it to your source control repository

- OR: Use a text editor to create a `.lu` file for a LUIS app and add it to your source control repository

#### Building the LUIS app from source

To build the LUIS app from the `.lu` source, you can:

- Use the LUIS portal to [import the `.lu` version](https://docs.microsoft.com/azure/cognitive-services/luis/luis-how-to-manage-versions#import-version) of the app from source control, and [train](https://docs.microsoft.com/azure/cognitive-services/luis/luis-how-to-train) and [publish](https://docs.microsoft.com/azure/cognitive-services/luis/luis-how-to-publish-app) the app.

- Use the [Bot Framework Command Line Interface for LUIS](https://github.com/microsoft/botbuilder-tools/tree/master/packages/LUIS) at the command line or in a CI/CD workflow to [import](https://github.com/microsoft/botframework-cli/blob/master/packages/luis/README.md#bf-luisversionimport) the `.lu` version of the app from source control into a LUIS application, and [train](https://github.com/microsoft/botframework-cli/blob/master/packages/luis/README.md#bf-luistrainrun) and [publish](https://github.com/microsoft/botframework-cli/blob/master/packages/luis/README.md#bf-luisapplicationpublish) the app.

#### Files to maintain under source control

The following types of files for your LUIS application should be maintained under source control:

- `.lu` file for the LUIS application

- [Unit Test definition files](link tbd) (utterances and expected results)

- [Batch test files](https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-batch-test#batch-file-format) (utterances and expected results) used for F-measure testing

#### Credentials and keys are not checked in

Keys and similar confidential values must not be included in files that you check in to your repo where they might be visible to unauthorized personnel. The keys and other values that you should prevent from check in include:

- LUIS Authoring and Prediction keys
- LUIS Authoring and Prediction endpoints
- Azure subscription keys
- Access tokens, such as the token for an Azure [service principal](https://docs.microsoft.com/cli/azure/ad/sp?view=azure-cli-latest) used for automation authentication

##### Strategies for securely managing secrets

Strategies for securely managing secrets include:

- If you're using a Git-based version control system such as [GitHub](https://github.com/), you can store runtime secrets in a local file and prevent check in of the file by adding a pattern to match the filename to a [`.gitignore`](https://git-scm.com/docs/gitignore) file
- In an automation workflow, you can store secrets securely in the parameters configuration offered by that automation technology. For example, if you're using [GitHub Actions](https://github.com/features/actions), you can store secrets securely in [GitHub secrets](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets).

### Branching and merging

Distributed version control systems like Git give you flexibility in how you use version control to share and manage code. Team members publish, share, review, and iterate on code changes through Git branches shared with others. Adopt a branching strategy that is appropriate for your team. For more information, see [Adopt a Git branching strategy](https://docs.microsoft.com/azure/devops/repos/git/git-branching-guidance).

Whichever branching strategy you adopt, a key principle of all of them is that team members can work on the solution within a *feature branch* independently from the work that other team members are doing in other branches. 

To support independent working in branches with a LUIS project:

- **Each feature branch must use its own instance of a LUIS app**. Developers work with this app in a feature branch without fear of affecting developers working in other branches.
- **The master branch also has its own LUIS app.** This app receives the updates when work is merged into master from a feature branch. This app represents the current state of development for your project and is the app which could be deployed to build environments such as Production.

![Git feature branch](./media/luis-concept-devops-sourcecontrol/feature-branch.png)

#### Developers can work from independent branches

Developers can work on updates on a LUIS app independently from other branches by:

1. Creating a feature branch from the main branch (usually called master or develop)

1. [Create a new LUIS app in the LUIS portal](https://docs.microsoft.com/azure/cognitive-services/luis/luis-how-to-start-new-app) solely to support the work in the feature branch. 

1. If you are working on an existing project and the `.lu` source for the solution app already exists in the repo, import the `.lu` file into the LUIS application created.

1. Work on the LUIS app to implement the required changes.

1. Test the updated application - see [Testing the LUIS application](link tbd) for details on testing your application within a development branch.

1. Export the active version of your development LUIS app as `.lu` from the [versions list](https://docs.microsoft.com/azure/cognitive-services/luis/luis-how-to-manage-versions).

1. Check in your updates and invite peer review of your updates. If you're using GitHub, you'll raise a [pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests).

1. When the changes are approved, merge the updates into the parent branch. At this point, a new version of the LUIS app for the *master* branch should be created using the updated `.lu` representation of the app that is now in the master branch. This new version can be created manually, or preferably, [built by an automation workflow](link tbd).

1. When the feature branch is deleted, it is good practice also to delete the LUIS app you created for the feature branch work.

#### Developers can work in multiple branches concurrently

If you follow the pattern described above in [Developers can work from independent branches](#developers-can-work-from-independent-branches), then each branch will use a unique LUIS application to support development. This enables a single developer to work on multiple branches concurrently, as long as they switch to the correct development app for the branch they are currently working on.

It is highly recommended that you name the development apps with the same name as the feature branch so as to reduce the likelihood of accidentally working on the wrong app.

#### Multiple Developers can work on the same branch concurrently

You can support multiple developers working on the same feature branch at the same time:

- Developers check out the same feature branch and push and pull changes submitted by themselves and other developers while work proceeds, as normal.

- If you follow the pattern described above in [Developers can work from independent branches](#developers-can-work-from-independent-branches), then each branch will use a unique LUIS application to support development. That app will be created by the first member of the development team who commences work in the feature branch.

- [Add team members as contributors](https://docs.microsoft.com/azure/cognitive-services/luis/luis-how-to-collaborate) to the LUIS app.

- When the feature branch work is complete, export the active version of the development LUIS app as `.lu` from the [versions list](https://docs.microsoft.com/azure/cognitive-services/luis/luis-how-to-manage-versions), save the updated `.lu` file in the repo, and check in and PR the changes.

#### Rebase and Merge from master

If you are working on changes to a LUIS app in a feature branch and some other developers on your team have merged updates to the LUIS app to the master branch since you created your feature branch, you can [rebase and merge to master](https://git-scm.com/book/en/v2/Git-Branching-Rebasing) in the same way as any other code asset. Since the LUIS app in LUDown format is human readable, it supports merging using standard Merge tools.

Follow these tips if you are rebasing your LUIS app in a feature branch:

- Make sure that any changes you have already made in the portal and not yet exported aren't lost. Re-export your development app from the LUIS portal before you commence your rebase and merge.

- During the merge, use standard tools to resolve any merge conflicts.

- Don't forget to reimport the app and retrain after rebase and merge is complete.

#### Merging PRs

After your PR is approved, you can merge your changes to your master branch. No special considerations apply to the LUDown source for a LUIS app: it is human readable and so supports merging using standard Merge tools. Any merge conflicts may be resolved in the same way as with other source files.

After your PR has been merged, it is recommended to:

- Delete the branch

- Delete the LUIS app for the branch.

Just as with code assets, it is recommended that LUIS app updates are accompanied by unit tests to test the validity of the updates. It is also recommended that you employ continuous integration workflows to test:

- updates in a PR before the PR is merged
- the master branch LUIS app after a PR has been approved and the changes have been merged into master.

See [Unit Testing and F-measure testing](luis-concept-devops-testing.md) for more details on testing for LUIS DevOps. See [Continuous integration workflows](link tbd) for more details on implementing workflows.

### Code Reviews

A LUIS app in LUDown format is human readable which supports the communication of changes in a PR suitable for review. Unit test files are also written in LUDown format and also easily reviewable in a PR.

> [!TIP]
> If you are working with the JSON export of a LUIS app, you can [convert it to LUDown](https://github.com/microsoft/botframework-cli/tree/master/packages/luis#bf-luisconvert) using the [BotBuilder-Tools LUIS CLI](https://github.com/microsoft/botbuilder-tools/tree/master/packages/LUIS). Use the `--sort` option to ensure that intents and utterances are sorted alphabetically.  
> Note that the **.LU** export capability built into the LUIS portal already sorts the output.

## Next steps

> [!div class="nextstepaction"]
> [Unit Testing and F-measure testing](luis-concept-devops-testing.md)
