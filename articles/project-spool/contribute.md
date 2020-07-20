> [!WARNING]
> This is a temporary page.  **This will not be published.** 

The status of ACS Docs is being tracked in [this spreadsheet](https://microsoft.sharepoint-df.com/:x:/t/IC3SDK/EasbZy5MyMBLq2S0NyTNBVABhKiR6r8bq8Ld8clQQkgOeA?e=AYC94P).


--------------

## Contribute Conceptual Content

Conceptual content includes concepts, quickstarts, tutorials, and other non-reference content types.

To begin contributing conceptual content, ping Mick your **github username** (not email). He'll then add you to the ACS docs repository.

There are two ways to contribute to the ACS docs repo: **from the browser** or **with VS Code**.

To edit from the browser, Click "edit" on any page within our docs (like this page) to add content:

![Edit File](./media/edit-click.png)

Once you're brought to the file on GitHub, click the edit icon:

![Edit File](./media/edit-file.png) 

Once you've made your changes, click Commit. Select the "direct" option if you don't need any reviewers:

![Commit Changes](./media/commit-changes.png)


You can use Visual Studio Code if you'd like to preview your rendered content before pushing it.


### Authorship / Style Guidelines

- **Quickstarts** are for explaining things in less than 10 minutes.
- **Tutorials** are for more in-depth explanations that explain how to complete a commonly encountered customer task.
- **Concepts** are for the foundational ideas that developers need to know before diving into the code.
- Links between docs within our docset should be [relative paths](https://review.docs.microsoft.com/en-us/help/contribute/links-how-to?branch=master#links-to-articles-in-the-same-docset).
- For a list of available docs UI components and Markdown features, see [the Docs Markdown Reference](https://review.docs.microsoft.com/en-us/help/contribute/markdown-reference?branch=master).
- For Microsoft Docs writing principles, see [this](https://review.docs.microsoft.com/en-us/help/contribute/writing-principles?branch=master) and [this](https://styleguides.azurewebsites.net/StyleGuide/Read?id=2700).
- Assume that all developers are under incredible time-pressure to find easy solutions to real problems, and make sure the solutions are ridiculously easy to find by articulating the customer intent in the title and in the first paragraph.
- Don't assume that developers are familiar with technical terminology or jargon. Use everyday words as much as possible.
- Try to emphasize the plain-English benefits as much as possible, not the technologies. For example, in an introduction to ACS calling, it might be easier for a new dev to read about "phone calls" than "PSTN integration".
- Docs are as much of a product as the product itself. Try to apply principles of user experience to your guidance: Progressively disclose information, incrementally introduce complexity, strive for simplicity, clarity, and a clutter-free, lovable user experience.
- Try to write as you speak.
- Relentlessly simplify and minimize. Fewer words translate to more engagement.
- Try to adopt the perspective of a new developer - not an experienced developer - and solve their problems through the power of customer empathy.
- If you have code snippets to share, try keep them as simple and as minimal as possible, and put them at the top of the page.
- KISS - Keep It Simple, Smarty
- Prioritize minimal code snippets over words and diagrams whenever possible.
- Make your content easy to scan with thoughtful headers and other formatting.
- Try not to make assumptions about what your customers want or need. Whenever possible, drive the evolution of your content with feedback from real developers.


~~
-----------------

## Technical Details

### Our Azure Docs Contribution Process

![Cross Platform](./media/pr-process.png)

The numbers in the above diagram correspond to the following numbered annotations:

1. This is the public repository that public contributors use to submit changes. The purpose of this repository is to facilitate public contributions.
2. This is the private repository that internal contributors and partners use to submit changes.
3. **[1]** and **[2]** are synchronized and used to generate the Azure content you see on docs.microsoft.com.
4. This is the branch that has been created for our project. This branch can be viewed [here](https://github.com/MicrosoftDocs/azure-docs-pr/tree/release-project-spool). Note that this repository is locked down as a matter of policy - only members of the PR review team have the ability to approve pull requests here. The content that we push here should be ready for public consumption.
5. I've forked from our org's private repository **[2]** to facilitate content drafting for members of the ACS team. You don't have to submit pull requests - you can just push your commits directly into our branch if you'd like (**[6]**).
6. This is our project's branch. When we push to this branch, changes will automatically be built and staged [here](https://review.docs.microsoft.com/en-us/azure/project-spool/?branch=pr-en-us-104477).
7. I've [issued a pull request](https://github.com/MicrosoftDocs/azure-docs-pr/pull/104477) from **[6]** to **[4]**.  This is what enables continuous staging as we commit our drafts to **[6]**.  If you view that pull request after pushing to **[4]**, you'll be able to see the validations and staging status.

*Note: PRs from **[6]** to **[4]** will always be built and validated, but they won't be passed off to the Azure docs publishing services team until we sign off on them with a comment that says "#sign-off". This will tell our merge bot ("PR Merger") to pass the baton along to their team for approval.  We will only do this when our content is mature.*


### Power User Instructions

These instructions are for contributors who would like to contribute using Visual Studio Code.

To begin contributing: 

1. Install Visual Studio Code along with the [content authoring tools](https://review.docs.microsoft.com/en-us/help/contribute/contribute-get-started-setup-tools?branch=master). 
2. [Set up a GitHub account](https://review.docs.microsoft.com/en-us/help/contribute/contribute-get-started-setup-github?branch=master) if you don't already have one.
3. [Link your Microsoft and GitHub accounts](https://review.docs.microsoft.com/en-us/help/contribute/contribute-get-started-setup-github?branch=master#link-your-github-and-microsoft-accounts).
4. [Join the Azure Docs GitHub organization](https://review.docs.microsoft.com/en-us/help/contribute/contribute-get-started-setup-github?branch=master#link-your-github-and-microsoft-accounts).
5. I'll have to provide you with write permissions to my fork (**[5]** above).  Feel free to ping your **GitHub username** to me.  My Microsoft alias is **mikben**.

Using Command Prompt, navigate to a directory on your local machine where you want the Azure documentation repository to live.  Then, clone our repository (`mikben/azure-docs-pr`) to that directory with the following command:

    git clone https://github.com/mikben/azure-docs-pr.git

This gives you **[7]** from the above diagram.

Next, move over to our branch:

    git checkout --track origin/release-project-spool

Now, you're working on **[8]** from the above diagram.

Next, open Visual Studio Code and **open the folder** (`File`> `Open Folder`) that you just cloned to begin contributing.  You'll know that you're working in the correct branch if you see `release-project-spool` in the branch indicator at the bottom left-hand corner of VS Code:

![Cross Platform](./media/branch-validation.png)

In the above image, there's a "refresh" icon below the cursor.  This is the "sync" function that performs the pull-push illustrated as item **[9]** in the above diagram.  We'll use this in a moment.

Next, navigate to our folder, which is located in `azure-docs-pr/articles/project-spool`:

![Our Directory](./media/project-spool-directory.png)

Once you've made changes, you can navigate to the Source Control tab within VS Code to review them:

![Source Control Tab](./media/source-control.png)

Finally, click the sync button to push your changes up and kick off the staging:

![Confirm Sync](./media/confirm-sync.png)

- **If you aren't familiar with Markdown**, [here's a great resource](https://review.docs.microsoft.com/en-us/help/contribute/markdown-reference?branch=master).
- **If you aren't familiar with git**, ping me directly!  I can help and then expand this doc accordingly.
- **If you are familiar with git** and have any feedback regarding this process, I'm completely open to suggestions, as I'm learning git as I go.

---------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        