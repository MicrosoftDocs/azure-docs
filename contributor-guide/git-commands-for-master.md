<properties pageTitle="Git commands for creating a new article or updating an existing article" description="Steps for working with the Azure technical content GitHub repositories." metaKeywords="" services="" solutions="" documentationCenter="" authors="tysonn" videoId="" scriptId="" manager="carolz" />

<tags ms.service="contributor-guide" ms.devlang="" ms.topic="article" ms.tgt_pltfrm="" ms.workload="" ms.date="01/16/2015" ms.author="tysonn" />

#Git commands for creating a new article or updating an existing article
Follow the steps in this article to create a local working branch on your computer so that you can create a new article for the technical documentation section of azure.microsoft.com or update an existing article.

![](./media/git-commands-for-master/githubcommands1.png)

1. Start Git Bash (or the command-line tool you use for Git).

 [AZURE.TIP] If you are working in the public repository, change azure-content-pr to azure-content in all the commands.

2. Change to azure-content-pr:

        cd azure-content-pr
3. Check out the master branch:

        git checkout master

4. Create a fresh local working branch derived from the master branch:

        git pull upstream master:<working branch>

5. Move into the new working branch:

        git checkout <working branch>

6. Let your fork know you created the local working branch:

        git push origin <working branch>

7. Create your new article or make changes to an existing article.

8. Add and commit the changes you made:

        git add .
        git commit –m "<comment>"
        
   Or, to add only the specific files you modified:

        git add <file path>
        git commit –m "<comment>"

9. Periodically, update your local working branch with changes from upstream:

        git pull upstream master

10. Daily at least, push the changes to your fork on GitHub for safe keeping:

        git push origin <working branch>

11. Stage the article if you wish; see [GitHub commands for staging an article](./git-commands-for-sandbox.md). (Internal contributors only)

12. When you are ready to publish the article live, create a pull request that moves your changes from the working branch in your fork to the master branch of the upstream repository.

13. The pull request acceptor reviews and accepts your pull request. 

14. Review your content at

 http://azure.Microsoft.com/en-us/documentation/articles/*name-of-your-article-without-the-MD-extension*

 At this time, technical articles are published once daily around 10 AM Pacific Standard Time (PST), Monday-Friday. Remember, your pull request has to be accepted before changes are included in the next scheduled publishing run.



