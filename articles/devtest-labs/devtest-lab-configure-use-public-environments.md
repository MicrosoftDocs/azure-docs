---
title: Configure and use public environments
description: This article describes how to configure and use the public environment GitHub repository of Azure Resource Manager (ARM) templates.
ms.topic: how-to
ms.date: 11/26/2021
---

# Use the public environments ARM templates in DevTest Labs

Azure DevTest Labs has a public repository of artifacts that's available for every lab you create. There's also a [public repository of Azure Resource Manager (ARM) templates](https://github.com/Azure/azure-devtestlab/tree/master/Environments) that you can use to create environments.

The environment repository provides pre-authored templates with minimum input parameters. The templates include frequently used environments such as Azure Web Apps, Service Fabric cluster, and a development SharePoint farm. These templates give you a smooth getting started experience for using platform-as-a-service (PaaS) resources in labs.

You don't have to connect to the GitHub environment repository externally. As a lab owner, you can enable and configure the public environment repository for labs during or after creation.
  
## Configure public environments

To enable the public environment repository for your lab, make sure to select **On** in the **Public environments** field when you create a lab. The setting is **On** by default.

![Screenshot that shows enabling public environments for a new lab.](media/devtest-lab-configure-use-public-environments/enable-public-environment-new-lab.png)

Existing labs, and labs you create with ARM templates, might not have public environments enabled. To enable or disable the public environment repository for existing labs:

1. From your lab's **Overview** page, select **Configuration and policies** in the left navigation.
1. From the **Virtual machine bases** section, select **Public environments**.
1. Under **Enable Public Environments for this lab**, select **Yes** to enable or **No** to disable public environments. 
1. If you enable public environments, all the environments in the repository are available by default. Deselect environments to make them unavailable to lab users.

![Screenshot that shows the public environments page.](media/devtest-lab-configure-use-public-environments/public-environments-page.png)

## Use the public environment templates

As a lab user, you can create a new environment from an environment template by selecting **Add** from the toolbar on the lab **Overview** page. The **Choose a base** page shows all the available bases, with the public environment templates your lab admin enabled at the top of the list. Select the template you want to use.

![Screenshot that shows public environment templates.](media/devtest-lab-configure-use-public-environments/public-environment-templates.png)

## Next steps

The public environment repository is an open-source repository that you can contribute to. To add your own ARM templates, submit a pull request against the repository.
