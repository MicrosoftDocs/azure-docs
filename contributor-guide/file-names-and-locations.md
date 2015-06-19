<properties title="" pageTitle="File names and locations for Azure technical articles" description="Explains the file structure for articles and the naming conventions you should follow when you create a new article." metaKeywords="" services="" solutions="" documentationCenter="" authors="tysonn" videoId="" scriptId="" manager="required" />

<tags ms.service="contributor-guide" ms.devlang="" ms.topic="article" ms.tgt_pltfrm="" ms.workload="" ms.date="12/16/2014" ms.author="tysonn" />

#File names and locations for Azure technical articles

In our technical content repository, we use a single folder (the **articles** folder) for all articles. There's no folder hierarchy - all articles live in the flat file structure. If you create folders with articles in them, your articles can't be published.

Instead of using a file structure as an organizing principle, we use a strict file naming convention that clearly identifies topics and that contributes towards discoverability on the web.

Here's what you need to know:

+ [Rules]
+ [Pattern]
+ [Standard examples]
+ [Special file naming convention for the Azure preview portal]
+ [Marketplace content]
+ [File name approval]

##Rules

- No spaces or punctuation characters. Use hyphens to separate the words in the file name.
- Use all lowercase letters
- No more than 80 characters - this is a publishing system limit
- Use action verbs that are specific such as develop, buy, build, troubleshoot. No -ing words.
- No small words - don't include a, and, the, in, or, etc.
- All files must be in markdown and use the .md file extension.

##Pattern

Here's the general pattern:

 **service-platform-language-content-product-version.md**

Use the parts of the pattern that apply, and review the list of articles in the repository to get an idea of existing names. Names that don't start with a dev platform or a service name are probably suspect and slipped through.

##Standard examples

Here are a few examples of valid names that follow the pattern. :

- cloud-services-dotnet-continuous-delivery.md
- mobile-services-ios-get-started.md
- documentdb-manage-account.md
- mobile-services-dotnet-backend-get-started-settings-sync.md
- active-directory-java-authenticate-users-access-control-eclipse.md
- virtual-machines-install-windows-server-2008r2.md


##Special file naming convention for the Azure preview portal

Right now, we have two portals running - the [general availability portal](https://manage.windowsazure.com) and the [Azure preview portal](https://portal.azure.com). To clearly identify content that has been written for the preview portal without hiding it in the metadata, we need to follow some slightly customized file naming guidance:

- If the service is available only in the Azure preview portal, it's easy. Just follow the standard naming guidance.

- If the service is available in both portals, and you are writing an article about the service in the preview portal, add **preview-portal** at the end of the file name before the .md extension. This will help us separate the content for that service in the old portal from content for that service in the new portal. (Don't mix portal content!)

- If the article is about the preview portal itself and not specific to any service or platform, start the file name with **azure-preview-portal**.

Here are some examples:

- azure-preview-portal-supported-browsers-devices.md
- storage-premium-storage-preview-portal.md

##Marketplace content

To distinguish content that focuses on partner contributions to the Azure marketplace, start the file names with "marketplace". This content should not be too common, as most partner content should be created on the partners' own web sites.

- marketplace-mongodb-virtual-machines-install-windows-server-2008r2.md

##File name approval

It's the job of our group of pull request reviewers to review file names when a new file is submitted to the repository for the first time. Pull request reviewers should review the file name and provide feedback via the pull request comment stream if changes are needed. The file name needs to be corrected before the pull request is accepted. Contributors can easily push the update to the pending pull request.

###Contributors' Guide Links

- [Overview article](./../README.md)
- [Index of guidance articles](./contributor-guide-index.md)


<!--Anchors-->
[Rules]: #rules
[Pattern]: #pattern
[Standard examples]: #standard-examples
[Special file naming convention for the Azure preview portal]: #special-file-naming-convention-for-the-azure-preview-portal
[Marketplace content]: #marketplace-content
[File name approval]: #file-name-approval
