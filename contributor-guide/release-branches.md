# Working with release branches

When you are working with a release branch, the best way to create a local working branch from the release branch is to use this command syntax:

    git checkout -b <local working branch name> upstream/<upstream branch name>

This creates the local branch directly from the upstream branch, so you can avoid any local merging.

Then, to keep your local copy of the release branch up to date with the upstream version, run:

    git pull upstream <release-branch-name>
    
To create a copy of the release branch in your online fork, run:

    git push origin <release-branch-name>

The publishing team runs automation that automatically updates release branches with updates from the master branch on a daily basis.

When you are ready to merge your changes, you create a pull request from the release branch in your fork to the upstream release branch. The PR should be set up as shown in the screen shot.

![](./media/release-branches/release-branch-pr.png)

**TIP:** If you receive a *fatal: Cannot update paths and switch to branch 'release-branch' at the same time* error when issuing the `checkout` command, execute `git fetch upstream`, then the checkout command. The `fetch` grabs all the new remote-tracking branches (such as the release branch you want to work with) and tags without merging those changes into your own branches.