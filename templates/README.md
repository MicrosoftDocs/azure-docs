# README

This folder contains all the information that an individual needs to start contributing articles to the azure-content repository.

## Using GitHub, Git and this Repository

**Note:** Most of the information in this section will be a brief overview of the [GitHub Help] [] articles.  If you are familiar with Git and GitHub, skip to the Contribute/Edit Content section for the particulars of the code/content flow of this repository.

### Setting up your Fork of the Repository

1.	The first step to contributing to this project is setting up a GitHub account.  If you have not done so already go to [GitHub Home] [] and do so now.
2.	Now that you have an account, you also need a copy of Git on your machine.  Follow the instructions in the [Setting up Git Tutorial] [Set Up Git].
3.	Now that machine is set up with Git, you need a fork of this repository.  Go to the top of the page and click the **Fork** button.  You now have your own fork of this repository.
4.	The last step involves copying your fork to your local machine.  To do this go open GitBash.  On the command prompt enter:

		git clone git@github.com:<your user name>/azure-content-pr.git

	Next create a reference to the root repository by entering these commands:

		cd azure-content-pr
		git remote add upstream git://github.com/WindowsAzure/azure-content-pr.git
		git fetch upstream

Congratulations you have now set up your repository.  The above steps will not need to be repeated again.

### Contribute/Edit Content

In order for the contribution process to be as seemless as possible, the following procedure has been established.

1. Create a New Branch
2. Add New Content or Edit Existing Content
3. Submit a Pull Request to the Main Repository
4. Delete the Branch

Each branch should be limited to a single concept/article both to streamline workflow and reduce the possiblity of merge conflicts.  The following efforts are of the appropriate scope for a new branch:

* A new article (and associated images)
* Spelling/Grammar Edits on an article.
* Applying a single formatting change across a large set of articles (ie new copyright footer).

#### Create a New Branch

1.	Open GitBash
2.	Type `git fetch upstream master:<new branch name>` in the prompt.  This will create a new branch locally copied from the latest WindowsAzure master branch.
3.	Type `git push origin <new branch name>` in the prompt.  This will alert github of the new branch.  You should now be able to see the new branch in your fork of the repository on GitHub.
4.	Finally type, `git checkout <new branch name>` to switch to your new branch.

#### Add New Content or Edit Existing Content

You can now navigate the repository on your local machine using Windows Explorer.  If you are editing files, open them in an editor of your choice and start modifying them.  If you want to create a new file, use the editor of your choice and save it in the appropriate location in your local copy of the repository.  While working, make sure to save your work frequently, and commit it git.  To commit changes to git type the following commands in GitBash:

	git add .
	git commit -v -a -m "<Describe the changes made since last commit>"

#### Submit a Pull Request to the Main Repository

When you are done with your work, and are ready to have it merged into the central repository follow the following steps.

1.	In GitBash type `git push origin <new branch name>` in the command prompt.  This will push the all the commits made in the previous step to your GitHub fork.
2.	On the GitHub site, navigate in your fork to the branch.
3.	At the top of the page is a **Pull Request** button.  Click on it.
4.	Insure that the Base branch is WindowsAzure/azure-content-pr@master and the Head branch is <your username>/azure-content-pr@<branch name>
5.	Click the **Update Commit Range** button.
6.	Give your pull request a Title, and describe all the changes being made.
7.	Submit the Pull Request.

One of the site administrators will now process your pull request.  Your pull request will surface on the WindowsAzure/azure-content-pr site under Issues.  When the Pull Request is accepted, the issue will be resolved.

#### Delete the Branch

Once your changes have been successfully merged into the central repository you can delete your branch as you will no longer need it.  Any further work will require a new branch.  To delete your branch follow the steps below:

1.	In GitBash type `git checkout master` in the command prompt.  This is to insure that you aren't in the branch to be deleted (which isn't allowed).
2.	Next, type 'git branch -d <branch name>` in the command prompt.  This will delete the branch on your local machine.
3.	Finally, type `git push origin :<branch name>` in the command prompt.  This will delete the branch on your github fork.

Congratulations, you have successfully contributed to the project.

## Using Markdown

### Using a template

### Links

### Images

## Additional Information


[GitHub Home]: github.com
[GitHub Help]: http://help.github.com/
[Set Up Git]: http://help.github.com/win-set-up-git/
