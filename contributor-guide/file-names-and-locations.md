<properties title="" pageTitle="File names and locations for Azure technical articles" description="Explains the file structure for articles and the naming conventions you should follow when you create a new article." metaKeywords="" services="" solutions="" documentationCenter="" authors="tysonn" videoId="" scriptId="" manager="required" />

<tags ms.service="contributor-guide" ms.devlang="" ms.topic="article" ms.tgt_pltfrm="" ms.workload="" ms.date="03/14/2016" ms.author="tysonn" />

#File names and locations for Azure technical articles

In our technical content repository, we use a single folder (the **articles** folder) for all articles. There's no folder hierarchy - all articles live in the flat file structure. If you create folders with articles in them, your articles can't be published.

Instead of using a file structure as an organizing principle, we use a strict file naming convention that clearly identifies topics and that contributes towards discoverability on the web.

Here's what you need to know:

+ [Rules]
+ [Pattern]
+ [Standard examples]
+ [Marketplace content]
+ [File name approval]

##Rules

- Files names can contain ONLY lowercase letters, numbers, and hyphens. 
- No spaces or punctuation characters. Use the hyphens to separate words and numbers in the file name.
- No more than 80 characters - this is a publishing system limit
- Use action verbs that are specific, such as develop, buy, build, troubleshoot. No -ing words.
- No small words - don't include a, and, the, in, or, etc.
- All files must be in markdown and use the .md file extension.
- Spell the words out; don't use unapproved or unnecessary acronyms in file names

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
- cache-aspnet-session-state-provider
- azure-sdk-dotnet-release-notes-2-8
- storsimple-disaster-recovery-using-azure-site-recovery

##Marketplace content

To distinguish content that focuses on partner contributions to the Azure marketplace, start the file names with "marketplace". This content should not be too common, as most partner content should be created on the partners' own web sites.

- marketplace-mongodb-virtual-machines-install-windows-server-2008r2.md

##File name approval

It's the job of our group of pull request reviewers to review file names when a new file is submitted to the repository for the first time. Pull request reviewers should review the file name and provide feedback via the pull request comment stream if changes are needed. The file name needs to be corrected before the pull request is accepted. Contributors can easily push the update to the pending pull request.

##Folder names in the repo

Folders should be created only for services, and the file name should match the service slug. Use only letters and hyphens, and use all lowercase letters. Obtain approval from the repository admin before you create a new folder that is not for a released service.

##Changing case in file names

Windows operating systems are case insensitive, so if you need to change a file name to fix casing, it is better to make a substantive change, unless you are able to make the change on a Linux or Mac. For example:

  biztalk-administration-and-Development-Task-List-in-BizTalk-Services --> biztalk-services-administration-and-development-task-list

Use the following command to rename a file:
```
  git mv <articles/service-folder/current-file-name.md> <articles/service-folder/new-file-name>
```

###Contributors' Guide Links

- [Overview article](./../README.md)
- [Index of guidance articles](./contributor-guide-index.md)


<!--Anchors-->
[Rules]: #rules
[Pattern]: #pattern
[Standard examples]: #standard-examples
[Marketplace content]: #marketplace-content
[File name approval]: #file-name-approval
