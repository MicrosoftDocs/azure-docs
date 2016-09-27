<properties
pageTitle="Install and set up tools for authoring in GitHub"
description="Tools and steps to get set up for authoring Azure content in GitHub."
services="contributor-guide"
documentationCenter=""
authors="tysonn"  
manager="carolz" />

<tags
ms.service="contributor-guide"
 ms.devlang=""
 ms.topic="article"
  ms.tgt_pltfrm=""
  ms.workload=""
  ms.date="01/19/2015"
  ms.author="tysonn" />

#Install and set up tools for authoring in GitHub

Follow the steps in this article to set up tools for contributing to the Azure technical documentation. Casual and occasional contributors probably can use the GitHub UI described in step 2.

If you're unfamiliar with Git, you might want to review some Git terminology: [https://help.github.com/articles/github-glossary](https://help.github.com/articles/github-glossary). In addition, this StackOverflow thread contains a glossary of Git terms you'll encounter in this set of steps: [http://stackoverflow.com/questions/7076164/terminology-used-by-git](http://stackoverflow.com/questions/7076164/terminology-used-by-git)

## Contents

- [Create a GitHub account and set up your profile](#create-a-github-account-and-set-up-your-profile)
- [Sign up for Disqus](#sign-up-for-disqus)
- [Determine whether you really need to follow the rest of these steps](#determine-whether-you-really-need-to-follow-the-rest-of-these-steps)
- [Permissions in GitHub](#permissions-in-github)
- [Install Git for Windows](#install-git-for-windows)
- [Enable two-factor authentication](#enable-two-factor-authentication)
- [Install a markdown editor](#install-a-markdown-editor)
- [Configure Atom](#configure-atom)
- [Fork the repository and copy it to your computer](#fork-the-repository-and-copy-it-to-your-computer)
- [Configure your user name and email locally](#configure-your-user-name-and-email-locally)
- [Next steps](#next-steps)

## Create a GitHub account and set up your profile

To contribute to the Azure technical content, you'll need a [GitHub](http://www.github.com) account.

If you are a Microsoft contributor, you need to set up your GitHub account so you're clearly identified as a Microsoft employee. Set up your profile as follows:

- **Profile picture**: a picture of you (required)
- **Name**: your first and last name (required)
- **Email**: your Microsoft email address (optional)
- **Company**: Microsoft Corporation (required)
- **Location**: list your location (optional)

Your profile should resemble this profile:

<p align="center">
 ![GitHub profile example](./media/tools-and-setup/githubprofile.png)

## Sign up for Disqus

Every published Azure technical article has a comment stream provided by the Disqus service.

 ![Discus logo](./media/tools-and-setup/discus.png)

If you are a Microsoft employee, and if you are the author of or a contributor to an article, you need to sign up for Disqus so you can participate in the comment stream for the article.

1. Sign up for an account at [http://www.disqus.com/](http://www.disqus.com/)
2. Fill out your profile as follows:

 - **Full Name**: your full name as displayed in your Microsoft address book listing, plus the bracketed info, which is your alias plus @MSFT. Format: *First Last [alias@MSFT]*
 - **Location**: Your location
 - **Short Bio**: Your title

## Determine whether you really need to follow the rest of these steps

You might not need to follow all the steps in this article. It depends on the sort of content contribution you want or need to make.

###Submit a text-only change to an existing article

If you only need or want to make textual updates to an existing article, you probably don't need to follow the rest of the steps. You can use GitHub's web-based markdown editor to submit your changes. Just click the GitHub link in the article you want to modify:

 ![GitHub profile example](./media/tools-and-setup/contributetogit.png)

 Then, click the edit icon in the GitHub version of the article

 ![GitHub profile example](./media/tools-and-setup/editicon.PNG)

 That opens the easy-to-use web editor that makes it easy to submit changes. You don't need to follow the other steps in this article.

###All other changes
The GitHub UI does support creation of new files and dragging and dropping images. However, when you work in the UI, managing branches can be confusing so we typically recommend you install the tools and learn the commands for creating and managing articles. If you want to use the UI, see:

- [Creating files on Github](https://github.com/blog/1327-creating-files-on-github)
- [Upload files to your repositories](https://github.com/blog/2105-upload-files-to-your-repositories)

For the following sorts of work, we strongly recommend you install and learn to use the tools:

 - Making major changes to an article
 - Creating and publishing a new article
 - Adding new images or updating images
 - Updating an article over a period of days without publishing changes each of those days
 - Creating content for a release that has to go out on a certain day at a certain time

##Permissions in GitHub

Anybody with a GitHub account can contribute to Azure technical content through our public repository at [https://github.com/Azure/azure-content](https://github.com/Azure/azure-content). No special permissions are required.

If you are a Microsoft PM or writer who is working on Azure content, you must work in our private content repository, azure-content-pr. Visit [https://repos.opensource.microsoft.com ](https://repos.opensource.microsoft.com ) to request the read permissions that will let you make contributions through the private repo - sign in to GitHub using the button > click Azure > click **Join a team** or **Join another team**, and then search for and join the **azure-content-read** group.

## Install Git for Windows

Install Git for Windows from [http://git-scm.com/download/win](http://git-scm.com/download/win). This download installs the Git version control system, and it installs Git Bash, the command-line app that you will use to interact with your local Git repository.

You can accept the default settings; if you want the commands to be available within the Windows command line, select the option that enables it.

<p align="center">
 ![GitHub profile example](./media/tools-and-setup/gitbashinstall.png)

(Note: This is not the same as "Github for Windows". "Github for Windows" is a different GUI-based tool that will also work if you want to read up on yourself. [https://windows.github.com/](https://windows.github.com/))

## Enable two-factor authentication

You have to enable two factor authentication (2FA) on your GitHub account if you are working in the private content repository. It's required in the private repository.

To enable this, follow the instructions in both the following GitHub help topics:

- [About Two-Factor Authentication](https://help.github.com/articles/about-two-factor-authentication/)
- [Creating an access token for command-line use](https://help.github.com/articles/creating-an-access-token-for-command-line-use/)

When you create the token, select all the scopes available in the token-creation UI ([details on each scope](https://developer.github.com/v3/oauth/#scopes))

After you enable 2FA, you have to enter the access token instead of your GitHub password at the command prompt when you try to access a GitHub repository from the command line. The access token is not the authentication code that you get in a text message when you set up 2FA. It's a long string that looks something like this:  fdd3b7d3d4f0d2bb2cd3d58dba54bd6bafcd8dee. A few notes about this:

- When you create your access token, save it in a text file to make it readily accessible when you need it.

- Later, when you need to paste the token, know there are two ways to paste in the command line:

 - Click the icon in the upper left corner of the command line window>Edit>Paste.
 - Right-click the icon in the upper left corner of the window and click Properties>Options>QuickEdit Mode. This configures the command line so you can paste by right-clicking in the command line window.

## Install a markdown editor

We author content using simple "markdown" notation in the files, rather than complex "markup" (HTML, XML, etc.). So, you'll need to install a markdown editor.

- **Atom**: Most of us use GitHub's Atom markdown editor: [http://atom.io](http://atom.io). It does not require a license for business use. It has spell check.

- **Notepad**: You can use Notepad for a very lightweight option.

- **Prose**: This is a lightweight, elegant, on-line, and open source markdown editor that offers a preview. Visit [http://prose.io](http://prose.io) and authorize Prose in your repository.

- **[Visual Studio Code](https://www.visualstudio.com/products/code-vs.aspx)** - Microsoft's entry in this space.

## Configure Atom

If you use Atom, you'll need to set a few things up.

- Atom defaults to using 2 spaces for tabs, but Markdown expects 4 spaces. If you leave it at the default of two, your article will look great in local preview, but not when it’s imported into Azure. So, configure Atom to use 4 spaces - you can find this setting under File>Settings>Editor Settings>Tab Length.
- You will probably also want to turn on Soft Wrap in this section too, which does the same as "word wrap" in Notepad.
- To turn on the markdown preview, click Packages>Markdown Preview>Toggle Preview. You can use Ctrl-Shift-M to toggle the preview HTML view.

## Fork the repository and copy it to your computer

1. Create a fork of the repository in GitHub - go to the top-right of the page and click the Fork button. If prompted, select your account as the location where the fork should be created. This creates a copy of the repository within your Git Hub account. Generally speaking, technical writers and program managers need to fork azure-content-pr, the private repo. Community contributors need to fork azure-content, the public repo. You only need to fork one time; after your first setup, if you want to copy your fork to another computer, you only have to run the commands that follow in this section to copy the repo to your computer.  If you choose to create forks of both repositories, you will need to create a fork for each repository.

2. Copy the Personal Access Token that you got from [https://github.com/settings/tokens](https://github.com/settings/tokens). You can accept the default permissions for the token.  Save the Personal Access Token in a text file for later reuse.

3. Next, copy the repository to your computer with your credentials embedded in the command string.  To do this, open Git Bash and run it as an administrator. At the command prompt, enter the following command.  This command creates a azure-content(-pr) drectory on your computer.  If you're using the default location, it will be at c:\users<your Windows user name>\azure-content(-pr).

Public repo:

        git clone https://[your GitHub user name]:[token]@github.com/<your GitHub user name>/azure-content.git

Private repo:

        git clone https://[your GitHub user name]:[token]@github.com/<your GitHub user name>/azure-content-pr.git

For example, this clone command could look something like this:

        git clone https://smithj:b428654321d613773d423ef2f173ddf4a312345@github.com/smithj/azure-content-pr.git  

## Set remote repository connection and configure credentials

Create a reference to the root repository by entering these commands. This sets up connections to the repository in GitHub so that you can get the latest changes onto your local machine and push your changes back to GitHub. This command also configures your token locally so that you don't have to enter your name and password each time you try to access the upstream repo and your fork on GitHub.

Public repo:

        cd azure-content
        git remote add upstream https://[your GitHub user name]:[token]@github.com/Azure/azure-content.git
        git fetch upstream

Private repo:

        cd azure-content-pr
        git remote add upstream https://[your GitHub user name]:[token]@github.com/Azure/azure-content-pr.git
        git fetch upstream

This usually takes a while. After you do this, you won't have to fork again or enter your credentials again. You would only have to copy the forks to a local computer again if you set the tools up on another computer.


## Configure your user name and email locally

To ensure you are listed correctly as a contributor, you need to configure your user name and email locally in Git.

1. Start Git Bash, and switch into azure-content or azure-content-pr:

   ````
   cd azure-content
   ````

 or

   ````
   cd azure-content-pr
   ````

2. Configure your user name so it matches your name as you set it up in your GitHub profile:

    ````
    git config --global user.name "John Doe"
    ````
3. Configure your email so it matches the primary email designated in your GitHub profile; if you're a MSFT employee, it should be your MSFT email address:

    ````
    git config --global user.email "alias@example.com"
    ````
4. Type `git config -l` and review your local settings to ensure the user name and email in the configuration are correct.

##Next steps

- Understand the type of content that belongs in the technical content repo, and know what does not belong. See the [content channel guidance](./content-channel-guidance.md)!
- Follow [these steps to create or modify an article and then submit it for publishing](./git-commands-for-master.md).
- Copy [the markdown template](../markdown templates/markdown-template-for-new-articles.md) as the basis for a new article.
- Use [this checklist to verify your pull request will meet the quality criteria](./contributor-guide-pr-criteria.md) for merging.


###Contributors' guide navigation

- [Overview article](./../README.md)
- [Index of guidance articles](./contributor-guide-index.md)



<!--Anchors-->
[Use a customer-friendly voice]: #use-a-customer-friendly-voice
[Consider localization and machine translation]: #consider-localization-and-machine-translation
[other style and voice issues to watch for]: #other-style-and-voice-issues-to-watch-for


[Create a GitHub account and set up your profile]: #create-a-github-account-and-set-up-your-profile
[Determine whether you really need to follow the rest of these steps]: #determine-whether-you-really-need-to-follow-the-rest-of-these-steps
[Permissions in GitHub]: #permissions-in-github
[Install Git for Windows]: #install-git-for-windows
[Enable two-factor authentication]: #enable-two-factor-authentication
[Install a markdown editor]: #install-a-markdown-editor
[Fork the repository and copy it to your computer]: #fork-the-repository-and-copy-it-to-your-computer
[Install git-credential-winstore]: #install-git-credential-winstore
[Sign up for Disqus]: #sign-up-for-disqus
[Configure your user name and email locally]: #configure-your-user-name-and-email-locally
[Next steps]: #next-steps
