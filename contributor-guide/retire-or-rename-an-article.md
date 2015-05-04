# Steps to follow when you retire or change the name of an ACOM technical article

This guidance is for SMEs who are listed as the author of an article that needs to be retired from the technical documentation section of azure.microsoft.com. The steps also apply if a file is renamed.

If you're a member of our Azure community and you think an article should be retired for any reason, please leave a comment in the Disqus comment stream for the article to let the author know something is wrong with the article.

SME authors need to follow several steps to gracefully retire content so users of the website don't have a bad experience when we retire content from the site. Deleting the article or changing it’s name should be the last thing that happens!

## Step 1: Manage inbound links

Determine if there are any non-Microsoft inbound links to your content. Frequently, blogs, forums, and other content on the web points to articles. Frequently, you can work with blog owners to change these links, and you can remove or update links from forum posts. Web analytics tools can tell you if there are any high traffic inbound links you might need to manage in this way.

## Step 2: Remove all crosslinks to the article from the technical content repository

1. Ensure you are working in an up-to-date local branch – run `git pull upstream master` (or the appropriate variation on this command.

2.	Scan the azure-content-pr/articles folder and the azure-content-pr/includes folder for any articles and includes that link to the article you want to retire, and either remove the crosslinks or replace them with an appropriate new crosslinks. You can use a search and replace utility to find the crosslinks if you have one installed. If you don't, you can use Windows PowerShell for free! Here's how to use PowerShell to find the crosslinks:

 a. Start Windows PowerShell.

 b. At the PowerShell prompt, change into the azure-content-pr\articles folder:

 `cd azure-content-pr\articles`

 c. Type this command, which will list all files that contain a reference to the article you are deleting:

 `Get-ChildItem -Recurse -Include *.md* | Select-String "<the name of the topic you are deleting>" | group path | select name`

  If you prefer to send the list of file names to a text file (in this case, named psoutput.txt), you can:

  `Get-ChildItem -Recurse -Include *.md* | Select-String "<the name of the topic you are deleting>" | group path | select name | Out-File C:\Users\<your account>\psoutput.txt`

3. Add and commit all your changes, push them to your fork, and create a pull request to move your changes from your fork to the master branch of the main repository.

## Step 3: Update the FWLink tool

Check the FWLink tool for any FWLinks that might point to the article. Point any FWLinks at replacement content; if you are not on the alias that owns the link, join it. If the owners won't update the link, file a ticket with MSCOM to have the link changed. More info - [internal wiki](http://sharepoint/sites/azurecontentguidance/wiki/Pages/Manage%20inbound%20links%20to%20retired%20topics.aspx).

## Step 4: Remove all crosslinks to the article from other pages on azure.microsoft.com and create a redirect for the retired page, if appropriate

You'll have to work with the person who maintains and updates the documentation landing page for your service for this part. Contact your content team partner if you don't know who that person is. The person who maintains and updates the doc landing page will need to do two things:

1. In Visual Studio, scan the **entire** ACOM web solution for cross references to the file to retire. Remove the cross references, or replace them with an updated cross reference. You'll need to remove the HTML links as well as the related resource strings for the HTML links. More info - see the [internal wiki](http://sharepoint/sites/azurecontentguidance/wiki/Pages/Create%20or%20edit%20a%20service%20landing%20page.aspx)

2. If a replacement article exists, create a redirect. More info - see the [internal wiki](http://sharepoint/sites/azurecontentguidance/wiki/Pages/Remove%20published%20pages%20and%20request%20redirects.aspx).

3. Check the changes into the repository.

## Step 5: Retire the article

After you've completed the three prior steps and those changes are live, then you can delete the article from the repository. 
## Step 6: Remove links from MSDN

Review the content QA tool for broken links to the retired or renamed topic and remove/fix the links in all MSDN topics affected.

### Contributors' guide links

- [Overview article](./../CONTRIBUTING.md)
- [Index of guidance articles](./contributor-guide-index.md)
