# Steps to follow when you want to delete, move, or rename an Azure technical article
This guidance is for SMEs who are listed as the author of an Azure technical article that needs to be deleted, moved, or renamed in docs.microsoft.com/azure.

First off, in our current repo configuration, you must not ever actually delete, move, or rename an article. Here's how to think about these concepts:

  - **Delete**: If you want to delete an article, you have to turn it into a redirect and leave the article in place.
  - **Move**: If you want to move an article, turn the current article into a redirect and then create a new article in the new folder location, and copy the content to the new article.
  - **Rename**: Functionally, renaming is similar to moving. You turn the current article into a redirect and then create a new article with the new file name, but in the same folder location, and copy the content to the new article.

If you're a member of our Azure community and you think an article should be retired for any reason, please leave a comment in the comment stream for the article to let the author know something is wrong with the article.

When authors want to retire, rename, or move articles, they need to follow specific steps to avoid bad experiences on the web site. Our goal should be to gracefully retire content so users of the website don't find broken links and receive 404 errors. 

## Automated solution
If you have to move a large number of files, or all files in one directory to another, [this tool](https://github.com/squillace/gitwork/tree/master/dotnet/move) may allow you to automate most of this work.

## Manual steps
### Step 1: Set the article to NOINDEX and republish it (as appropriate)
Do this step if you are preparing to deprecate content and do not want it to be discoverable, but you want it to remain published to support inbound links. To do this, add the following line as the last entry in the metadata section of the article:
  ```
  ROBOTS: NOINDEX
  ``` 
By using NOINDEX alone, you allow cross-links to current content that are embedded in the article to be crawled, and you avoid creating a dead-end for search crawlers.


### Step 2: Turn the original article into a redirect, and create the new file if you are renaming or moving a file. 
In our publishing workflow, the article you want to retire, rename, or move must remain in place so you can create a redirect to the new article or to the replacement content. You turn an article into a redirect by deleting the article metadata and content and adding just the redirect metadata. Make the changes that match what you want to do:

- **Retire**: Change the metadata so the article redirects to the service landing page. If the service is being deprecated, redirect the pages to the Azure hub page on docs.

- **Rename**: Create a copy of the article, give the file its new name, and then change the metadata of the original article so the article redirects to the new one.

- **Move**: Create a copy of the article in the new location, and then change the metadata of the original article so the article redirects to the new one. 

For example, if you want to move a file from the `articles` folder into a sub-folder, you need to update the original file to contain just metadata in the header. The `/azure/` part is important, as the root of the site is `docs.microsoft.com`. 
```
---
redirect_url: /azure/azure-resource-manager/resource-manager-subscription-examples
redirect_document_id: TRUE 
---
```

See [the OPS documentation](https://opsdocs.azurewebsites.net/opsdocs/partnerdocs/opredirection?branch=master) for more details on how to turn an article into a redirect.

Do not delete articles from the azure-docs-pr or azure-docs repositories, period. If you delete an article, you cannot create the article-level redirects, which guarantees that customers will experience 404s.
    
### Step 3: Remove or update all crosslinks to the article from the technical content repository
Do not rely on redirects to take care of crosslinks from other articles. Update or remove the cross references to the article you are retiring, renaming, or moving, including links in articles owned by other authors.

1. Ensure you are working in an up-to-date local branch – run `git pull upstream master` (or the appropriate variation on this command).
2. Scan the azure-docs-pr/articles folder and the azure-docs-pr/includes folder for any articles and includes that link to the article you want to retire, move, or rename. Either remove the crosslinks or replace them with an appropriate new crosslink. You can use a search and replace utility to find the crosslinks if you have one installed. If you don't, you can use Windows PowerShell for free! Here's how to use PowerShell to find the crosslinks:
   
   a. Start Windows PowerShell.
   
   b. At the PowerShell prompt, change into the azure-docs-pr\articles folder:
   
     `cd azure-docs-pr\articles`
   
   c. Type this command, which will list all files that contain a reference to the article you are deleting:
   
     `Get-ChildItem -Recurse -Include *.md* | Select-String "<the name of the topic you are deleting>" | group path | select name`
   
   If you prefer to send the list of file names to a text file (in this case, named psoutput.txt), you can:
   
     `Get-ChildItem -Recurse -Include *.md* | Select-String "<the name of the topic you are deleting>" | group path | select name | Out-File C:\Users\<your account>\psoutput.txt`

3. Add and commit all your changes, push them to your fork, and create a pull request to move your changes from your fork to the master branch of the main repository.

### Step 4: Request ACOM-to-DOCS redirection

If your article existed on ACOM, you need to request that the ACOM-to-DOCs redirect file be updated so the old ACOM URL (azure.microsoft.com/documentation/articles/article-name) redirects to the new article on docs or to the service landing page. File a bug at https://aka.ms/acomtodocsredirect.

### Step 6: Publish  

Publish your changes to the article repository by submitting a pull request. Test that the redirects work in staging before you sign-off on the PR. Make sure that the ACOM-to-DOCS redirection goes live the same day.

### Step 7: Cleanup tasks

These cleanup tasks need to be performed immediately after the changes are published.

#### Fix ACOM links
File a work item with the ACOM team to remove any crosslinks to retired articles from pages on azure.microsoft.com. If you renamed or moved articles, file a work item to have crosslinks on ACOM updated.

#### Update the FWLink tool 
Check the FWLink tool for any FWLinks that might point to the article. Update the FWLinks to point at the appropriate replacement content; if you are not on the alias that owns the link, join it. If the owners won't update the link or let you join the alias, file a ticket at https://msdnhelp to have the link changed. 

#### Manage inbound links
Determine if there are any high-traffic non-Microsoft inbound links to your content. Frequently, blogs, forums, and other web content point to articles. You can work with content owners to change or remove these links, and you can remove or update links from forum posts. Web analytics tools can tell you if there are any high-traffic inbound links you might need to manage in this way.

#### Remove cached pages from search engines (only if absolutely necessary)
Do this ONLY if the content needs to be removed from search quickly due to legal or severe customer issues. Per best practices from Google, normal priority content should be removed from search through natural search engine processes. Go to these web pages to remove cached web pages from search engines:

[Bing](https://www.bing.com/webmaster/tools/content-removal?rflid=1)
[Google](https://www.google.com/webmasters/tools/removals?pli=1)

#### Redirect cleanup
The length of time an article-level redirect stays in place is TBD.

#### Contributors' guide links
* [Overview article](../README.md)
* [Index of guidance articles](contributor-guide-index.md)

