---
title: Create a Machine Learning Studio Workspace | Microsoft Docs
description: How to create a workspace for Azure Machine Learning Studio
services: machine-learning
author: heatherbshapiro
ms.author: hshapiro
manager: hjerez
editor: cgronlun
ms.assetid: aa96b784-ac6c-44bc-a28a-85d49fbe90a2
ms.service: machine-learning
ms.component: studio
ms.workload: data-services
ms.topic: article
ms.date: 12/07/2017

---

# Create and share an Azure Machine Learning workspace
This menu links to topics that describe how to set up the various data science environments used by the Cortana Analytics Process (CAPS).

[!INCLUDE [data-science-environment-setup](../../../includes/cap-setup-environments.md)]

To use Azure Machine Learning Studio, you need to have a Machine Learning workspace. This workspace contains the tools you need to create, manage, and publish experiments.

[!INCLUDE [machine-learning-free-trial](../../../includes/machine-learning-free-trial.md)]

### To create a workspace
1. Sign in to the [Azure portal](https://portal.azure.com/)

    > [!NOTE]
    > To sign in and create a workspace, you need to be an Azure subscription administrator. 
    >
    > 

2. Click **+New**

3. In the search box, type **Machine Learning Studio Workspace** and select the matching item. Then, select click **Create** at the bottom of the page.

4. Enter your workspace information:

    - The *workspace name* may be up to 260 characters, not ending in a space. The name can't include these characters: `< > * % & : \ ? + /`
    - The *web service plan* you choose (or create), along with the associated *pricing tier* you select, is used if you deploy web services from this workspace.

    ![Create a new workspace](./media/create-workspace/create-new-workspace.png)

5. Click **Create**.

Once the workspace is deployed, you can open it in Machine Learning Studio.

1. Browse to Machine Learning Studio at [https://studio.azureml.net/](https://studio.azureml.net/).

2. Select your workspace in the upper-right-hand corner.

    ![Select workspace](./media/create-workspace/open-workspace.png)

3. Click **my experiments**.

    ![Open experiments](./media/create-workspace/my-experiments.png)

For information about managing your workspace, see [Manage an Azure Machine Learning workspace](manage-workspace.md).
If you encounter a problem creating your workspace, see [Troubleshooting guide: Create and connect to a Machine Learning workspace](troubleshooting-creating-ml-workspace.md).


## Sharing an Azure Machine Learning workspace
Once a Machine Learning workspace is created, you can invite users to your workspace to share access to your workspace and all its experiments, datasets, notebooks, etc. You can add users in one of two roles:

* **User** - A workspace user can create, open, modify, and delete experiments, datasets, etc. in the workspace.
* **Owner** - An owner can invite and remove users in the workspace, in addition to what a user can do.

> [!NOTE]
> The administrator account that creates the workspace is automatically added to the workspace as workspace Owner. However, other administrators or users in that subscription are not automatically granted access to the workspace - you need to invite them explicitly.
> 
> 

### To share a workspace

1. Sign in to Machine Learning Studio at [https://studio.azureml.net/Home](https://studio.azureml.net/Home)

2. In the left panel, click **SETTINGS**

3. Click the **USERS** tab

4. Click **INVITE MORE USERS** at the bottom of the page

    ![Studio settings](./media/create-workspace/settings.png)

5. Enter one or more email addresses. The users need a valid Microsoft account or an organizational account (from Azure Active Directory).

6. Select whether you want to add the users as Owner or User.

7. Click the **OK** checkmark button.

Each user you add will receive an email with instructions on how to sign in to the shared workspace.

> [!NOTE]
> For users to be able to deploy or manage web services in this workspace, they must be a contributor or administrator in the Azure subscription. 



