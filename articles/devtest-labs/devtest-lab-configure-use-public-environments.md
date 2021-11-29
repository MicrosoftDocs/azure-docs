---
title: Configure and use public environments
description: This article describes how to configure and use the public environment GitHub repository of Azure Resource Manager (ARM) templates.
ms.topic: how-to
ms.date: 11/26/2021
---

# Use the public environments ARM templates in DevTest Labs

Azure DevTest Labs has a [public repository of Azure Resource Manager (ARM) templates](https://github.com/Azure/azure-devtestlab/tree/master/Environments) that you can use to create environments. This repository is similar to the public repository of artifacts that's available for creating lab resources.

The environment repository provides pre-authored ARM templates with minimum input parameters. The templates create frequently used environments such as Azure Web Apps, Service Fabric cluster, and development SharePoint farms. Lab users can create environments with these templates for a smooth getting started experience with platform-as-a-service (PaaS) resources.

As a lab owner, you can enable and configure access to the public environment repository for your labs. You don't have to connect to the GitHub environment repository separately to get the templates. You can enable repository and template access from the portal, during or after lab creation.

## Configure public environments

To enable the public environment repository for your lab users, make sure to select **On** in the **Public environments** field when you create a lab. The setting is **On** by default.

![Screenshot that shows enabling public environments for a new lab.](media/devtest-lab-configure-use-public-environments/enable-public-environment-new-lab.png)

Existing labs, and labs you create with ARM templates, might not have public environments enabled. To enable or disable the public environment repository for existing labs:

1. From your lab's **Overview** page, select **Configuration and policies** in the left navigation.
1. On the **Configuration and policies** page, select **Public environments** under **Virtual machine bases** in the left navigation.
1. Under **Enable Public Environments for this lab**, select **Yes** to enable or **No** to disable public environments.

If you enable public environments, all the environments in the repository are available by default. Deselect specific environments to make them unavailable to lab users.

![Screenshot that shows the public environments page.](media/devtest-lab-configure-use-public-environments/public-environments-page.png)

## Use the public environment templates

As a lab user, you can create a new environment from an environment template by selecting **Add** from the toolbar on the lab **Overview** page. The **Choose a base** page shows all the available resource bases, with the public environment templates your lab admin enabled at the top of the list. Select the template you want to use.

![Screenshot that shows public environment templates.](media/devtest-lab-configure-use-public-environments/public-environment-templates.png)

For more information about creating the environment, see [Create environments from templates in the Azure portal](devtest-lab-create-environment-from-arm.md#create-environments-from-templates-in-the-azure-portal).

## Next steps

- The [public environment repository](https://github.com/Azure/azure-devtestlab/tree/master/Environments) is an open-source repository that you can contribute to. To suggest revisions or add your own ARM templates, submit a pull request against the repository.

- You can also create your own private template repositories and add them to your labs. For more information, see [Create your own template repositories](devtest-lab-create-environment-from-arm.md#create-your-own-template-repositories) and [Add a Git repository to store custom artifacts and Resource Manager templates](devtest-lab-add-artifact-repo.md).
