## Microsoft Open Source Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Contribute to Azure technical documentation
We welcome contributions from our community (users, customers, partners, MSFT employees outside core Azure product units, etc.) as well as from employees working in core Azure product units. How you contribute depends on who you are:

* **Community - minor updates**: If you are contributing minor updates out of the goodness of your heart, you can find the article in this repository, or visit the article on [https://docs.microsoft.com/azure](https://docs.microsoft.com/azure) and click the **Edit** link in the article that goes to the GitHub source for the article. Then, just use the GitHub UI to make your updates. Or, you are welcome to fork the repository and submit updates from your fork.

* **Community - new articles**: If you're part of the Azure community and you want to create a new article, you need to work with an employee to help bring that new content in through a combination of work in the public and private repository.

* **Employees**: If you are a technical writer, program manager, or developer from the product team for an Azure service and it's your job to contribute to or author technical articles, you should use the private repository (https://github.com/MicrosoftDocs/azure-docs-pr). If you are making substantial changes to an existing article, adding or changing images, or contributing a new article, you need to fork this repository, install Git Bash, a markdown editor, and learn some git commands. See [the internal contributor's guide](https://review.docs.microsoft.com/en-us/help/contribute/?branch=master) for more information.


## About your contributions to Azure content
### Minor corrections
Minor corrections or clarifications you submit for documentation and code examples in this repo are covered by the [docs.microsoft.com Terms of Use](https://docs.microsoft.com/legal/termsofuse).

### Larger submissions
If you submit a pull request with new or significant changes to documentation and code examples, we'll send a comment in GitHub asking you to submit an online Contribution License Agreement (CLA) if you are not an employee of Microsoft. We need you to complete the online form before we can accept your pull request.

## Tools and setup
Community contributors can use the GitHub UI or fork the repo to contribute. Employees should visit [the internal contributor's guide](https://review.docs.microsoft.com/en-us/help/contribute/?branch=master) for more information about how to contribute to the technical documentation set.

## Repository organization
The content in the azure-docs repository follows the organization of documentation on https://docs.microsoft.com/azure. This repository contains two root folders:

### \articles
The *\articles* folder contains the documentation articles formatted as markdown files with an *.md* extension. Articles are typically grouped by Azure service.

The *\articles* folder contains the *\media* folder for root directory article media files, inside which are subfolders with the images for each article.  The service folders contain a separate media folder for the articles within each service folder. The article image folders are named identically to the article file, minus the *.md* file extension.

### \includes
You can create reusable content sections to be included in one or more articles. 

## How to use markdown to format your topic
All the articles in this repository use GitHub flavored markdown.  Here's a list of resources.

* [Markdown basics](https://help.github.com/articles/markdown-basics/)
* [Printable markdown cheatsheet](./contributor-guide/media/documents/markdown-cheatsheet.pdf?raw=true)


## Labels
In the public azure-docs repository, automated labels are assigned to pull requests to help us manage the pull request workflow and to help let you know what's going on with your pull request:

* Contribution License Agreement related
  * cla-not-required: The change is relatively minor and does not require that you sign a CLA.
  * cla-required: The scope of the change is relatively large and requires that you sign a CLA.
  * cla-signed: The contributor signed the CLA, so the pull request can now move forward for review.
* Change sent to author: The author has been notified of the pending pull request.
* ready-to-merge: Ready for review by our pull request review team.


