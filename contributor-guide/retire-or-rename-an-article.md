# Steps to follow when you retire, rename, or move an Azure technical article
This guidance is for SMEs who are listed as the author of an Azure technical article that needs to be retired, renamed, or moved in docs.microsoft.com/azure.

If you're a member of our Azure community and you think an article should be retired for any reason, please leave a comment in the comment stream for the article to let the author know something is wrong with the article.

When authors want to retire, rename, or move articles, they need to follow specific steps to avoid bad experiences on the web site. Our goal should be to gracefully retire content so users of the website don't find broken links or receive 404 errors. 

## Overview of retiring, renaming, or moving articles

In our publishing workflow, the article you want to retire, rename, or move must remain in place so you can create a redirect to the new article or to the replacement content. You have to think about these content management actions as follows:

- **Retire**: Update the metadata so the article redirects to the service landing page or to the Azure hub page if the service is being deprecated.

- **Rename**: Create a copy of the article, give the file it's new name, and then update the metadata of the original article so the article redirects to the new one.

- **Move**: Create a copy of the article in the new location, and then update the metadata of the original article so the article redirects to the new one. 

Do not delete articles from the azure-docs-pr or azure-docs repositories, period. If you delete an article, you cannot create the article-level redirects, which guarantees that customers will experience 404s.

## Step 1: Set the article to no-index/no-follow and republish it (recommended)
If you are retiring an article, the first thing you should do is republish the article as no-index/no-follow a few weeks before you actually delete it. This is considered the best practice "pre-work" for retiring content. Doing this removes the article from search engine indexes so people won't find the article in search. To do this, add the following line as the last entry in the metadata section of the article:
  ```
  ROBOTS: NOINDEX, NOFOLLOW
  ``` 
 If you are renaming the article
    
## Step 2: Manage inbound links (required)
Determine if there are any non-Microsoft inbound links to your content. Frequently, blogs, forums, and other content on the web points to articles. You can work with blog owners to change these links, and you can remove or update links from forum posts. Web analytics tools can tell you if there are any high traffic inbound links you might need to manage in this way.

## Step 3: Remove all crosslinks to the article from the technical content repository (required)
Do not rely on redirects to take care of crosslinks from other articles. Update or remove the cross references to the article you are deleting or renaming, including in articles owned by other people.

1. Ensure you are working in an up-to-date local branch – run `git pull upstream master` (or the appropriate variation on this command.
2. Scan the azure-docs-pr/articles folder and the azure-docs-pr/includes folder for any articles and includes that link to the article you want to retire, and either remove the crosslinks or replace them with an appropriate new crosslinks. You can use a search and replace utility to find the crosslinks if you have one installed. If you don't, you can use Windows PowerShell for free! Here's how to use PowerShell to find the crosslinks:
   
   a. Start Windows PowerShell.
   
   b. At the PowerShell prompt, change into the azure-docs-pr\articles folder:
   
     `cd azure-docs-pr\articles`
   
   c. Type this command, which will list all files that contain a reference to the article you are deleting:
   
     `Get-ChildItem -Recurse -Include *.md* | Select-String "<the name of the topic you are deleting>" | group path | select name`
   
   If you prefer to send the list of file names to a text file (in this case, named psoutput.txt), you can:
   
     `Get-ChildItem -Recurse -Include *.md* | Select-String "<the name of the topic you are deleting>" | group path | select name | Out-File C:\Users\<your account>\psoutput.txt`

3. Add and commit all your changes, push them to your fork, and create a pull request to move your changes from your fork to the master branch of the main repository.

## Step 4: Update the FWLink tool (required)
Check the FWLink tool for any FWLinks that might point to the article. Point any FWLinks at replacement content; if you are not on the alias that owns the link, join it. If the owners won't update the link, file a ticket with MSCOM to have the link changed. More info - [internal wiki](http://sharepoint/sites/azurecontentguidance/wiki/Pages/Manage%20inbound%20links%20to%20retired%20topics.aspx).

## Step 5: File a work item with the ACOM team to remove any crosslinks to the article from other pages on azure.microsoft.com.

## Step 6: Create a redirect for the retired page, if it has been replaced by new content.
You have to leave the .md file in it's location in the repo, and update the content so that the article becomes a redirect.

- If your intent is to replace the article with a different article, to change the file name, or to move the file to another location, you MUST leave the original file in place with the same name and update the content so the article becomes a redirect. See [the OPS documentation](https://opsdocs.azurewebsites.net/opsdocs/partnerdocs/opredirection?branch=master) for instructions on how to turn an article into a redirect.

## Step 7: Request ACOM-to-DOCS redirection

If your article existed on ACOM, you need to request that the ACOM-to-DOCs redirect file be updated so the old ACOM URL (azure.microsoft.com/documentation/articles/article-name) redirects to the new article on docs or to the service landing page. File a bug at https://aka.ms/acomtodocsredirect.

## Step 8: Remove cached pages from search engines (only if absolutely necessary)
Do this ONLY if the content needs to be removed from search quickly due to legal or severe customer issues. Per best practices from Google, normal priority content should be removed from search through natural search engine processes. Go to these web pages to remove cached web pages from search engines:

[Bing](https://www.bing.com/webmaster/tools/content-removal?rflid=1)
[Google](https://www.google.com/webmasters/tools/removals?pli=1)

## Redirect cleanup
The length of time an article-level redirect stays in place is TBD.

### Contributors' guide links
* [Overview article](../README.md)
* [Index of guidance articles](contributor-guide-index.md)

