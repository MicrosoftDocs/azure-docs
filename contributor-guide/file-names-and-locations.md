# File names and locations for Azure technical articles
We use a strict file naming convention that clearly identifies topics and that contributes towards discoverability on the web.

Here's what you need to know:

* [Rules]
* [Pattern]
* [Standard examples]
* [Marketplace content]
* [File name approval]

## Rules
* File names can contain ONLY lowercase letters, numbers, and hyphens.
* No spaces or punctuation characters. Use the hyphens to separate words and numbers in the file name.
* No more than 80 characters - this is a publishing system limit
* Use action verbs that are specific, such as develop, buy, build, troubleshoot. No -ing words.
* No small words - don't include a, and, the, in, or, etc.
* All files must be in markdown and use the .md file extension.
* Spell the words out; avoid unapproved or unnecessary acronyms in file names

Acronyms and initialisms in file names - specific guidelines:

* Do not allow rm or arm as acronyms anywhere in a file name
* Other industry-standard abbreviations are acceptable as necessary in file names.

## Pattern

>NOTE
> Service names are in the URL path element that follows the brand, and aren't needed in the file name. 
> Example: /azure/**mobile-services**/dotnet-backend-get-started-settings-sync
>

Here's the general pattern:

 **platform-language-content-product-version.md**

Use the parts of the pattern that apply, and review the list of articles in the repository to get an idea of existing names. 

>IMPORTANT
>Use this updated file name guidance for *new* articles. You don't need to rename and redirect other articles at this time. 

## Standard examples
Here are a few examples of valid file names that follow the pattern:

* dotnet-continuous-delivery.md
* ios-get-started.md
* manage-account.md
* dotnet-backend-get-started-settings-sync.md
* java-authenticate-users-access-control-eclipse.md
* install-windows-server-2008r2.md
* aspnet-session-state-provider.md
* azure-sdk-dotnet-release-notes-2-8.md
* disaster-recovery-using-azure-site-recovery.md

The service names aren't in the file name examples, but are an element in each URL path:

* /azure/**cloud-service**/dotnet-continuous-delivery
* /azure/**mobile-services**/ios-get-started
* /azure/**cosmos-db**/manage-account

## A/B testing

A/B testing on docs.microsoft.com requires one file in the A/B pair to include **.experimental.** in the file name:  file-name.experimental.md

## Marketplace content
To distinguish content that focuses on partner contributions to the Azure marketplace, start the file names with "marketplace". This content should not be too common, as most partner content should be created on the partners' own web sites.

* marketplace-mongodb-virtual-machines-install-windows-server-2008r2.md

## File name approval
It's the job of our group of pull request reviewers to review file names when a new file is submitted to the repository for the first time. Pull request reviewers should review the file name and provide feedback via the pull request comment stream if changes are needed. The file name needs to be corrected before the pull request is accepted. Contributors can easily push the update to the pending pull request.

## Folder names in the repo
Folders should be created only for services, and the folder name should match the ACOM service slug. Use only letters and hyphens, and use all lowercase letters. Obtain approval from the repository admin before you create a new folder that is not for a released service.

## Changing case in file names
Windows operating systems are case insensitive, so if you need to change a file name to fix casing, it is better to make a substantive change, unless you are able to make the change on a Linux or Mac. For example:

  administration-and-Development-Task-List-in-BizTalk-Services --> services-administration-and-development-task-list

Use the following command to rename a file:

```
  git mv <articles/service-folder/current-file-name.md> <articles/service-folder/new-file-name>
```

### Contributors' Guide Links
* [Overview article](../README.md)
* [Index of guidance articles](contributor-guide-index.md)

<!--Anchors-->
[Rules]: #rules
[Pattern]: #pattern
[Standard examples]: #standard-examples
[Marketplace content]: #marketplace-content
[File name approval]: #file-name-approval
