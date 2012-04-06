# README

This folder contains all the information that an individual needs to start contributing articles to the azure-content repository.

## Using GitHub, Git and this Repository

**Note:** Most of the information in this section will be a brief overview of the [GitHub Help] [] articles.  If you are familiar with Git and GitHub, skip to the "Contribute/Edit Content" section for the particulars of the code/content flow of this repository.

### Setting up your Fork of the Repository

1.	The first step to contributing to this project is setting up a GitHub account.  If you have not done so already go to [GitHub Home] [] and do so now.
2.	Now that you have an account, you also need a copy of Git on your machine.  Follow the instructions in the [Setting up Git Tutorial] [Set Up Git].
3.	Now that machine is set up with Git, you need a fork of this repository.  Go to the top of the page and click the **Fork** button.  You now have your own fork of this repository.
4.	The last step involves copying your fork to your local machine.  To do this go open GitBash.  On the command prompt enter:

		git clone git@github.com:<your user name>/azure-content-pr.git

	Next create a reference to the root repository by entering these commands:

		cd azure-content-pr
		git remote add upstream git@github.com:WindowsAzure/azure-content-pr.git
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
2.	Type `git pull upstream master:<new branch name>` in the prompt.  This will create a new branch locally copied from the latest WindowsAzure master branch.
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
6.	Give your pull request a Title, and describe all the changes being made.  If your bug fixes a TFS Item or GitHub issue make sure to reference them in the description.
7.	Submit the Pull Request.

One of the site administrators will now process your pull request.  Your pull request will surface on the WindowsAzure/azure-content-pr site under Issues.  When the Pull Request is accepted, the issue will be resolved.

#### Delete the Branch

Once your changes have been successfully merged into the central repository you can delete your branch as you will no longer need it.  Any further work will require a new branch.  To delete your branch follow the steps below:

1.	In GitBash type `git checkout master` in the command prompt.  This is to insure that you aren't in the branch to be deleted (which isn't allowed).
2.	Next, type `git branch -D <branch name>` in the command prompt.  This will delete the branch on your local machine.
3.	Finally, type `git push origin :<branch name>` in the command prompt.  This will delete the branch on your github fork.

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