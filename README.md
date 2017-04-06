## Microsoft Open Source Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

# Azure Technical Documentation Contributor Guide
You've found the GitHub repository that houses the source for the Azure technical documentation that is published on [https://docs.microsoft.com/azure](https://docs.microsoft.com/azure).

This repository also contains guidance to help you contribute to our technical documentation. For a list of the articles in the contributors' guide, see [the index](contributor-guide/contributor-guide-index.md).

## Contribute to Azure documentation
Thank you for your interest in Azure documentation!

* [Ways to contribute](#ways-to-contribute)
* [Code of conduct](#code-of-conduct)
* [About your contributions to Azure content](#about-your-contributions-to-azure-content)
* [Repository organization](#repository-organization)
* [Use GitHub, Git, and this repository](#use-github-git-and-this-repository)
* [How to use markdown to format your topic](#how-to-use-markdown-to-format-your-topic)
* [More resources](#more-resources)
* [Index of all contributors' guide articles](contributor-guide/contributor-guide-index.md) (opens new page)

## Ways to contribute
You can submit updates to the [Azure documentation](https://docs.microsoft.com/azure) as follows:

* You can easily contribute to technical articles in the GitHub user interface. Either find the article in this repository, or visit the article on [https://docs.microsoft.com/azure](https://docs.microsoft.com/azure) and click the link in the article that goes to the GitHub source for the article.
* If you are making substantial changes to an existing article, adding or changing images, or contributing a new article, you need to fork this repository, install Git Bash, Markdown Pad, and learn some git commands.

## About your contributions to Azure content
### Minor corrections
Minor corrections or clarifications you submit for documentation and code examples in this repo are covered by the [docs.microsoft.com Terms of Use](https://docs.microsoft.com/legal/termsofuse).

### Larger submissions
If you submit a pull request with new or significant changes to documentation and code examples, we'll send a comment in GitHub asking you to submit an online Contribution License Agreement (CLA) if you are not an employee of Microsoft. We need you to complete the online form before we can accept your pull request.

## Repository organization
The content in the azure-docs repository follows the organization of documentation on https://docs.microsoft.com/azure. This repository contains two root folders:

### \articles
The *\articles* folder contains the documentation articles formatted as markdown files with an *.md* extension. Articles are typically grouped by Azure service.

Articles need to follow strict file naming guidelines - for details, see [our file naming guidance](contributor-guide/file-names-and-locations.md).

The *\articles* folder contains the *\media* folder for root directory article media files, inside which are subfolders with the images for each article.  The service folders contain a separate media folder for the articles within each service folder. The article image folders are named identically to the article file, minus the *.md* file extension.

### \includes
You can create reusable content sections to be included in one or more articles. See [Custom extensions used in our technical content](contributor-guide/custom-markdown-extensions.md).

### \markdown templates
This folder contains our standard markdown template with the basic markdown formatting you need for an article.

### \contributor-guide
This folder contains articles that are part of our contributors' guide.

## Use GitHub, Git, and this repository
For information about how to contribute, how to use the GitHub UI to contribute small changes, and how to fork and clone the repository for more significant contributions, see [Install and set up tools for authoring in GitHub](contributor-guide/tools-and-setup.md).

If you install GitBash and choose to work locally, the steps for creating a new local working branch, making changes, and submitting the changes back to the main branch are listed in [Git commands for creating a new article or updating an existing article](contributor-guide/git-commands-for-master.md)

### Branches
We recommend that you create local working branches that target a specific scope of change. Each branch should be limited to a single concept/article both to streamline work flow and reduce the possibility of merge conflicts.  The following efforts are of the appropriate scope for a new branch:

* A new article (and associated images)
* Spelling and grammar edits on an article.
* Applying a single formatting change across a large set of articles (e.g. new copyright footer).

## How to use markdown to format your topic
All the articles in this repository use GitHub flavored markdown.  Here's a list of resources.

* [Markdown basics](https://help.github.com/articles/markdown-basics/)
* [Printable markdown cheatsheet](./contributor-guide/media/documents/markdown-cheatsheet.pdf?raw=true)

## Article metadata
Article metadata enables certain functionalities, such as author attribution, contributor attribution, breadcrumbs, article descriptions, and SEO optimizations as well as reporting Microsoft uses to evaluate the performance of the content. So, the metadata is important! [Here's the guidance for making sure your metadata is done right](contributor-guide/article-metadata.md).

### Labels
Automated labels are assigned to pull requests to help us manage the pull request workflow and to help let you know what's going on with your pull request:

* Contribution License Agreement related
  * cla-not-required: The change is relatively minor and does not require that you sign a CLA.
  * cla-required: The scope of the change is relatively large and requires that you sign a CLA.
  * cla-signed: The contributor signed the CLA, so the pull request can now move forward for review.
* Pillar labels: Labels such as PnP, Modern Apps, and TDC help categorize the pull requests by the internal organization that needs to review the pull request.
* Change sent to author: The author has been notified of the pending pull request.

## More resources
See the [index of our contributor's guide](contributor-guide/contributor-guide-index.md) for all our guidance topics.

