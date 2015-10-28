    <properties 
	pageTitle="Add a Git artifact repository to your DevTest Lab | Microsoft Azure" 
	description="Add a GitHub or Visual Studio Online Git repository for your custom artifacts to your lab" 
	services="devtest-lab,virtual-machines,visual-studio-online" 
	documentationCenter="na" 
	authors="patshea123" 
	manager="douge" 
	editor=""/>
  
<tags 
	ms.service="devtest-lab" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/23/2015" 
	ms.author="patshea"/>

# Add a Git artifact repository to your DevTest Lab

## Overview

By default, a **DevTest Lab** includes artifacts from the official Azure DevTest Lab artifact repository. You can add a Git artifact repository to your lab to include the artifacts that your team creates. The repository can be hosted on [GitHub](https://github.com) or on [Visual Studio Online (VSO)](https://visualstudio.com).

- To learn how to create a GitHub repository, see [GitHub Bootcamp](https://help.github.com/categories/bootcamp/).
- To learn how to create a VSO project with a Git Repository, see [Set up Visual Studio](https://www.visualstudio.com/get-started/setup/set-up-vs).

The repository must contain a top-level directory named **Artifacts**. The files for each artifact are then contained in a subdirectory of **Artifacts** directory.

The following screen shot shows an example of how a repository containing artifacts might look in GitHub:  
![ContosoWebTeam GitHub](./media/devtest-lab-add-artifact-repo/devtestlab-github-artifact-repo-home.png)

## Add a GitHub artifacts repository to your lab

To add a GitHub artifacts repository to your lab, you first get the HTTPS clone URL and Personal Access Token from the artifacts repository, then you enter that information in your lab

### Get the GitHub repository clone URL and personal access token

1. On the home page of the GitHub repository that contains the team artifacts, save the **HTTPS clone url** for later use. 

1. Tap the profile image in the upper-right corner, and select **Settings**.

1. In the **Personal settings** menu on the left, tap **Personal access tokens**.

1. Tap **Generate new token**.

1. On the **New personal access token** page, enter a **Token description**, accept the default items in the **Select scopes**, and then choose **Generate Token**.

1. Save the generated token as you'll need it later.

1. You can close GitHub now.   
   
###Connect your lab to the GitHub repository

1. Sign in to the [Azure preview portal](http://portal.azure.com).

1. Tap **Browse**, and then tap **DevTest Labs** from the list.

1. From the list of labs, tap the desired lab.   

1. On the lab's blade, tap **Settings**.

1. On the lab's **Settings** blade, tap **Artifacts Repository**.

1. On the **Artifacts Repository** blade:

    1. Enter a **Name** for the repository.
    1. Enter the saved **Git Clone Url**.
    2. Enter the **Folder Path** in the artifacts repository that contains the artifacts.
    3. Enter the saved **Personal Access Token** to the artifacts repository.
    4. Tap **Save**.

The artifacts in your repository are now listed on the **Add Artifacts** blade.

## Adding a Visual Studio Git artifact repository to your lab
    
To add a Visual Studio Git artifact repository to your lab, you first get the HTTPS clone url and Personal Access Token from the artifacts repository, then you enter that information in your lab.

### On the Visual Studio web page of your artifact project

1. Open the home page of your team collection (for example, `https://contoso-web-team.visualstudio.com`), and then tap the artifact project.

2. On the project home page, tap **Code**.

1. To view the clone URL, on the project **Code** page, tap **Clone**.

1. Save the URL as you'll need it later in this tutorial.

1. To create a Personal Access Token, tap **My profile** from the user account drop-down menu.

1. On the profile information page tap the **Security**.

1. On the **Security** tab, tap **Add**.

1. In the **Create a personal access token** page:

    1. Enter a **Description** for the token.
    2. Select **180 days** from the **Expires In** list.
    3. Choose **All accessible accounts** from the **Accounts** list.
    4. Choose the **All scopes** option.
    5. Choose **Create Token**.

1. When finished, the new token will appear in the **Personal Access Tokens** list. Tap **Copy Token** and then save the token value as it will be used shortly.

### In the DevTest Lab

1. On the your lab's blade, tap **Settings**.

    ![Choose Settings](./media/devtest-lab-add-artifact-repo/devtestlab-add-artifacts-repo-open-dtl-settings.png)

1. On the **Settings** blade, tap **Artifacts Repository**.

1. On the **Artifacts Repository** blade

    1. Enter a display **Name** for the repository.
    1. Enter the saved **Git Clone Url**.
    2. Enter the **Folder Path** in the artifacts repository that contains the artifacts.
    3. Enter the saved **Personal Access Token** to the artifacts repository.
    4. Tap **Save**.
