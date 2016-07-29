# Pull request etiquette and best practices for Microsoft contributors to Azure documentation

To publish changes to documentation, you submit pull requests from your fork. Every pull request has to be reviewed prior to being merged. Read this article to understand how you should work with pull request reviewers and how you can create pull requests that are easier and faster to review so the pull request queue works better for everyone.

## Working with pull request reviewers

Here's the basics you need to know about working with pull request reviewers. 

- <b>Understand the role of the pull request reviewer. The reviewer:</b>
  - Ensures the basic quality of the content
  - Prevents regressions in the repository
  - Provides feedback before merging

  Pull request reviewers are in a content governance role. The primary intent is not to simply merge whatever is submitted as quickly as possible. Expect feedback that will require you to make updates, especially for new and heavily revised articles.

- <b>Plan ahead with your pull request reviewer:</b>
  - For high-priority pull requests
  - Pull requests for timed/dated releases
  - Pull requests that change or add lots of files

- <b>Pull requests may take a few days to be merged</b>

  While pull request reviewers try to review PRs at least twice daily, all the pull request reviewers have other work to do, and some of that work might be higher priority than reviewing pull requests. 


## Make the pull request queue work better for everyone

There are two basic realities in the PR queue:

- Pull requests that are small in scope and that contain very similar changes take less time to review. 
- Pull requests that are large in scope or that contain different, mixed kinds of changes take more time to review.

You can help make the pull request queue work better by following these best practices:

- Separate minor updates to existing articles from new articles or major rewrites. Work on these changes in separate working branches. 

- When you delete articles or images, don't mix the deletions with new content additions or updates. Handle the changes/new content in a separate working branch.

- For releases or refactoring of content, plan ahead with your PR reviewer. You may need his or her help to create a release branch or to coordinate merge times with publishing times so your content is published at the right time.

- If you are trying to coordinate updates made in the ACOM repo (ie, changes to left navigation, landing pages, redirects, or learning maps) with changes you are making in the azure-content-pr repository, you must coordinate that work ahead of time with your PR reviewer. Otherwise, you risk having a lot of broken links.

## Criteria for expedited pull requests

- Contact your pull request reviewer to expedite PRs only when absolutely necessary. You can request expedited PR handling for Red Zone, privacy, legal, and security issues; for truly broken customer experiences; and for executive escalations. 
- Content for feature releases does not qualify for expedited handling - feature release content requires prior planning or it must be handled through the standard priority queue.


## In a hurry? Submit PRs that can be accepted automatically

Use the PRMerger automation rules to get more of your day-to-day PRs merged automatically.

PRMerger can accept your PR automatically, if:
* It affects 10 files or fewer.
* It contains 15 commits or fewer.
* Less than 20% of text changes.
* Selectors/switchers aren't updated.
* No files are deleted or added.
* No images are new, changed, or deleted.

If your pull request does not meet these criteria, the "PRmerger cannot merge" label is automatically assigned so you know it requires review by a human PR reviewer.

### Need to make a lot of little changes?

Take your cue from the PRMerger automation rules above, and do the following:
* Submit articles with light changes together in a PR with 10 or fewer files.
* Create a separate PR for articles in which images or selectors change. This requires human review.
* Create a separate PR for new or deleted articles. This requires human review.

## Related

- [Quality criteria for pull request review](contributor-guide-pr-criteria.md)

- [Pull request comment automation](contributor-guide-pull-request-comments.md)
