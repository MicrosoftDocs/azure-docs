# README

This folder contains all the information that an individual needs to start contributing articles to the azure-content repository.

## Using GitHub, Git and this Repository

**Note:** Most of the information in this section will be a brief overview of the [GitHub Help] [] articles.  If you are familiar with Git and GitHub, skip to the "Contribute/Edit Content" section for the particulars of the code/content flow of this repository.

### Setting up your Fork of the Repository

1.	The first step to contributing to this project is setting up a GitHub account.  If you have not done so already go to [GitHub Home] [] and do so now.
2.	Now that you have an account, you also need a copy of Git on your machine.  Follow the instructions in the [Setting up Git Tutorial] [Set Up Git].
3.	Now that machine is set up with Git, you need a fork of this repository.  Go to the top of the page and click the **Fork** button.  You now have your own fork of this repository.
4.	The last step involves copying your fork to your local machine.  To do this go open GitBash.  On the command prompt enter:

		git clone git@github.com:<your user name>/azure-content.git

	Next create a reference to the root repository by entering these commands:

		cd azure-content
		git remote add upstream git@github.com:WindowsAzure/azure-content.git
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
* Applying a single formatting change across a large set of articles (e.g. new copyright footer).

#### Create a New Branch

1.	Open GitBash
2.	Type `git pull upstream master:<new branch name>` in the prompt.  This will create a new branch locally copied from the latest WindowsAzure master branch.
3.	Type `git push origin <new branch name>` in the prompt.  This will alert GitHub to the new branch.  You should now be able to see the new branch in your fork of the repository on GitHub.
4.	Type `git checkout <new branch name>` to switch to your new branch.

#### Add New Content or Edit Existing Content

You can now navigate to the repository on your local machine using Windows Explorer. The repository files are in `C:\Users\<yourusername>\azure-content`.

If you are editing files, open them in an editor of your choice and start modifying them.  If you want to create a new file, use the editor of your choice and save the new file in the appropriate location in your local copy of the repository.  While working, make sure to save your work frequently.

The files in `C:\Users\<yourusername>\azure-content` are a working copy of the new branch that you created in your local repository. Changing anything in this folder does not affect the local repository until you commit a change. To commit a change to the local repository, type the following commands in GitBash:

	git add .
	git commit -v -a -m "<Describe the changes made since last commit>"

The `add` command adds your changes to a staging area in preparation for committing them to the repository. The period after the `add` command specifies that you want to stage all of the changes you have made. (If you don't want to commit all of the changes, you can add specific files. You can also undo a commit. For help, type `git add -help` or `git status`.)

The `commit` command applies the staged changes to the repository. `-v` means display verbose output from the command, `-a` means commit all of the staged changes, and `-m` means you are providing the commit comment in the command line. (You can omit `-m` and you will be prompted for a commit comment.)

You can commit multiple times while you are doing your work, or you can wait and commit only once when you're done.  If you only do one, type the `git add .` command followed by the `git commit` command described in the following section, which provides the issue number in the comment.

#### Submit a Pull Request to the Main Repository

When you are done with your work and are ready to have it merged into the central repository follow these steps.

1.  Create a [WindowsAzure/Azure-Content issue].
2.  In GitBash type the following command to associate the changes with the issue you created:

        git commit -a -v -m “fix #123 -- describe the changes made since last commit”

    In the comment, replace "123" with the number of the issue.
1.	In GitBash type `git push origin <new branch name>` in the command prompt.  In your local repository, `origin` refers to your GitHub repository that you cloned the local repository from. This command pushes the current state of your new branch, including all commits made in the previous steps, to your GitHub fork.
2.	On the GitHub site, navigate in your fork to the new branch.
3.	Click the **Pull Request** button at the top of the page.
4.	Ensure that the Base branch is `WindowsAzure/azure-content@weekly` and the Head branch is `<your username>/azure-content@<branch name>`
5.	Click the **Update Commit Range** button.
6.	Give your pull request a Title, and describe all the changes being made.  If your bug fixes a TFS Item or GitHub issue make sure to reference them in the description.
7.	Submit the Pull Request.

One of the site administrators will now process your pull request.  Your pull request will surface on the WindowsAzure/azure-content site under Issues.  When the Pull Request is accepted, the issue will be resolved.

#### Create a New Branch After Merge

After a branch has been successfully merged (i.e. your pull request has been accepted), do not continue working in the local branch that was successfully merged upstream. This can lead to merge conflicts if you submit another pull request. Instead, if you want to do another update, create a new local branch from the successfully merged upstream branch.

For example, suppose your local branch X was successfully merged into the WindowsAzure/Azure-Content weekly branch and you want to make further updates to the content that was merged. Create a new local branch, X2, from the WindowsAzure/Azure-Content weekly branch. To do this, open GitBash and execute the following commands:

	cd azure-content
	git pull upstream weekly:X2
	git push origin X2

You now have local copies (in a new local branch) of the work that you submitted in branch X. The X2 branch also contains all the work other writers have merged, so if your work depends on others' work (e.g. shared images), it will be available in the new branch. You can verify that your previous work (and others' work) is in the branch by checking out the new branch...

	git checkout X2

...and verifying the content. (The `checkout` command updates the files in `C:\Users\<yourusername>\Azure-Content` to the current state of the X2 branch.) Once you have checked out the new branch, you can make updates to the content and commit them as usual. However, to avoid working in the merged branch (X) by mistake, it is best to delete it (see the following "Delete a Branch" section).

#### Delete a Branch

Once your changes have been successfully merged into the central repository you can delete the branch you used, as you will no longer need it.  Any further work requires a new branch.  To delete your branch follow these steps:

1.	In GitBash type `git checkout master` in the command prompt.  This ensures that you aren't in the branch to be deleted (which isn't allowed).
2.	Next, type `git branch -d <branch name>` in the command prompt.  This will delete the branch on your local machine only if it has been successfully merged to the upstream repository. (You can override this behavior with the `–D` flag, but first be sure you want to do this.)
3.	Finally, type `git push origin :<branch name>` in the command prompt (a space before the colon and no space after it).  This will delete the branch on your github fork.  

Congratulations, you have successfully contributed to the project.

## Folder Structure of the Repository

The goal of the folder structure in the GitHub repository was to make it as easy to navigate as possible while mimicing the windowsazure.com site layout as much as possible.  In this vein we have created the folder structure detailed below:

	/DevCenter
		/<languages>
			/<IA type>
			/media
		/Shared
			/<IA type>
			/media
	/ITPro
		/<platform>
			/<IA type>
			/media
		/<shared>
			/<IA type>
			/media
	/Shared
		/<IA type>
		/media
	/GettingStarted

In this layout the following principles are applied:

1. Shared folders are used for articles that could be placed in multiple different sub-folders.  The most specific Shared folder should be used.  For instance, if there was a Common Task article that was used by Java, Node and PHP, it would be placed in the `/DevCenter/Shared` folder.  If however, that same article was also used by Linux in ITPro, the article would instead go in the root `/Shared/` folder.
2. The media folders are for images related to the articles under the `/<IA type>` folders in the same level.  For instance a "How to: Blob Storage (Java)" article would go in `/DevCenter/Java/HowTo` and the images for this article would go in `/DevCenter/Java/media`.
	- If however, a second unique article uses images from a different article (Two blob How To articles, one Java and one Node) the images will only be in the media folder of the first article, and the second article should reference them there.
3. The GettingStarted folder is for getting started with the GitHub repository, and not correlated to any getting started or tutorial content on WindowsAzure.com.
4. In general, only files in the 3 main folders will be published, and even then not everything there (README.md files for instance) will be published.
5. As a best practice, the README.md files in the `/<IA type>` folders should contain a list of all the documents of this type on windowsazure.com and a link to their location on the github site (most will be in that folder, but some will be in shared locations).


## Writing an Article using Markdown

All of the articles in this repository use Markdown.  While a complete introduction (and listing of all the syntax) can be found here [Markdown Home] [], the relevent basics will be covered here.

If you are looking for a good editor [Markdown Pad] [] is a great editor for Windows.

Until the script for porting the content from GitHub to Umbraco is complete, a simple method that can be used is highlighting all the markdown text in MarkdownPad and then Copy HTML to Clipboard (Ctrl+Shift+C), and then pasting this in Umbraco in the appropriate location.

### Markdown Basics

Below is a list of the most common markdown syntax.

* 	**Line Breaks vs. Paragraphs** - In Markdown there is no HTML `<br />` element.  Instead, a new paragraph is designated by an empty line between two blocks of text.
*	**Italics** - The HTML `<i>some text</i>` is written `*some text*`
* 	**Strong** - The HTML `<strong>some text</strong>` element is written `**some text**`
* 	**Headers** - HTML headers are designated by an number of `#` characters at the start of the line.  The number of `#` characters corresponds to the header number (ie `#` = h1 and `###` = h3).
* 	**Ordered Lists** - To make an ordered list start the line with `1. `.  If you want multiple elements within a single list element, format your list as follows:
		
		1.	Notice that this line is tabbed over after the '.'
		
			Now notice that there is a line break between the two paragraphs in the list element, and that the indentation here matches the indentation of the line above.

*	**Unordered Lists** - Unordered lists are almost identical to ordered lists except that the `1. ` is replaced with either `* `, `- `, or `+ `.  Multiple element lists work the same way as with ordered lists.
*	**Links** - The base syntax for a link is `[visible link text] (link url)`.

	Links can also have references, which will be discussed in the "Link and Image References" section below.

*	**Images** - The base syntax for an image is `![alt text for the image] (image url)`.

	Images can also have references, which will be discussed in the "Link and Image References" section below.

*	**In-line HTML** - Finally, markdown allows for the inclusion of HTML inline.  `<i>italic</i>` for instance will be correctly rendered by Markdown as <i>italic</i>.

### Using a template

In order to make the transition into using markdown as easy as possible, each of the Article types has a template and sample in this folder.  When starting a new article, create a new file in the appropriate folder in your local repository, and copy the template in.  The template will already have the structure necessary for the table of contents to work correctly.  Whereever there is a `(TODO: some description)`, replace with the desired text.  If you are adding more sections than the table of contents has, make sure to both add a new line in the Table of Contents, and format the section header in the same fashion as the pre-existing ones.

### Link and Image References

Markdown has a really nice feature that allows a user to insert a reference instead of a url for images and links.  The syntax for using this feature is:

	The image below is from [Google] [googleweb]
	
	![Google's logo] [logo]
	
	[googleweb]: google.com
	[logo]: https://www.google.com/images/srpr/logo3w.png

At first glance this format seems inefficient.  However, it allows us to have a convention where all links and image urls can be grouped together as opposed to spread throughout the article.  Therefore, all (external) links and images will use references, with the reference definitions (the `[refID]: url` part) at the bottom of the file.  This both makes maintaining external addresses easier, and can help streamline the process of copying images from github into windowsazure.com

## Additional Information

* For more information on Markdown go to [their site] [Markdown Home].
* For more information on using Git and GitHub first check out the [GitHub Help Section] [GitHub Help] and if necessary contact the site adminstrators.

[GitHub Home]: github.com
[GitHub Help]: http://help.github.com/
[Set Up Git]: http://help.github.com/win-set-up-git/
[Markdown Home]: http://daringfireball.net/projects/markdown/
[Markdown Pad]: http://markdownpad.com/
[WindowsAzure/Azure-Content issue]: https://github.com/WindowsAzure/azure-content/issues