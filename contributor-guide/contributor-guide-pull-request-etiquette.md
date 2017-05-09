# Pull request etiquette and best practices for Microsoft contributors to Azure documentation
To publish changes to documentation, you submit pull requests from your fork. Every pull request has to be reviewed prior to being merged. Read this article to understand how you should work with pull request reviewers and how you can create pull requests that are easier and faster to review so the pull request queue works better for everyone.

## Creating a pull request
See GitHub's documentation for basic information about how to create a pull request:

https://help.github.com/articles/creating-a-pull-request/

## Working with pull request reviewers
Here's the basics you need to know about working with pull request reviewers.

* <b>Understand the role of the pull request reviewer. The reviewer:</b>
  
  * Ensures the basic quality of the content
  * Prevents regressions in the repository
  * Provides feedback before merging
  
  Pull request reviewers are in a content governance role. The primary intent is not to simply merge whatever is submitted as quickly as possible. Expect feedback that will require you to make updates, especially for new and heavily revised articles.
* <b>Plan ahead with the pull request reviewers:</b>
  
  * For high-priority pull requests
  * Pull requests for timed/dated releases
  * Pull requests that change or add lots of files
* <b>SLA for pull request review</b>
  
  In the private repository, each time your pull request enters the pull request queue with the ready-to-merge label, the team tries to review the pull request within 12 business hours (8:00 AM to 5:00 PM, Monday - Friday PST) and provide feedback or merge if no feedback is required. This SLA applies to the act of reviewing the PR, not merging it. PRs will be merged when they meet [the criteria for merging](contributor-guide-pr-criteria.md). PRs that are merged to master are published at 10:00 AM and 3:00 PM, Monday - Friday PST.

## Make the pull request queue work better for everyone
There are two basic realities in the PR queue:

* Pull requests that are small in scope and that contain very similar changes take less time to review.
* Pull requests that are large in scope or that contain different, mixed kinds of changes take more time to review.

You can help make the pull request queue work better by following these best practices:

* Separate minor updates to existing articles from new articles or major rewrites. Work on these changes in separate working branches.
* When you delete articles or images, don't mix the deletions with new content additions or updates. Handle the changes/new content in a separate working branch.
* For releases or refactoring of content, plan ahead with your PR reviewer. You may need his or her help to create a release branch or to coordinate merge times with publishing times so your content is published at the right time.
* If you are trying to coordinate the merging and publishing of articles, left navigation files, and landing pages with content that will be released on the azure.microsoft.com marketing site, you must coordinate that work ahead of time with your PR reviewer.

## Criteria for expedited pull requests
* Contact azdocprs to expedite PRs only when absolutely necessary. You can request expedited PR handling for Red Zone, privacy, legal, and security issues; for truly broken customer experiences; and for executive escalations.
* Content for feature releases does not qualify for expedited handling - feature release content requires prior planning or it must be handled through the standard priority queue.

## In a hurry? Submit PRs that can be accepted automatically
Use the PRMerger automation rules to get more of your day-to-day PRs merged automatically.

PRMerger will merge your PR automatically if these criteria are met:

* The PR can contain up to 10 changed files.
* Contains up to 15 commits.
* Changes up to 20% of the text of the articles in the PR.
* Modifies no selector/switcher text.
* Adds no new files
* Deletes no existing files.
* Modifies no images.
* Modifies no index.md or TOC.md files.
* Contains only approved file types.
* Adds no files to the root folder of the repo.

If your pull request does not meet these criteria, the "requires-human-merge" label is automatically assigned so you know it requires review by a human PR reviewer.

### Need to make a lot of little changes?
Take your cue from the PRMerger automation rules above, and do the following:

* Submit articles with light changes together in a PR with 10 or fewer files.
* Create a separate PR for articles in which images or selectors change. This requires human review.
* Create a separate PR for new or deleted articles. This requires human review.

## Related
* [Quality criteria for pull request review](contributor-guide-pr-criteria.md)
* [Pull request comment automation](contributor-guide-pull-request-comments.md)

