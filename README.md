## Microsoft Open Source Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Contribute to Azure technical documentation
We welcome contributions from our community as well as from Microsoft employees from outside the documentation teams. How you contribute depends on who you are and the sort of changes you'd like to contribute:

* **Community - minor updates**: If you are contributing minor updates out of the goodness of your heart, you can find the article in this repository, or visit the article on [https://docs.microsoft.com/azure](https://docs.microsoft.com/azure) and click the **Edit** link in the article that goes to the GitHub source for the article. Then, just use the GitHub UI to make your updates. Or, you are welcome to fork the repository and submit updates from your fork. See our general [contributor guide](https://docs.microsoft.com/contribute/) for more information.

* **Community - new articles + major changes**: If you're part of the Azure community and you want to create a new article or submit major changes, please submit an issue to start a conversation with the documentation team. Once you've agreed to a plan, you'll need to work with an employee to help bring that new content in through a combination of work in the public and private repositories. 

* **Employees**: If you are a technical writer, program manager, or developer from the product team for an Azure service and it's your job to contribute to or author technical articles, you should use the private repository (https://github.com/MicrosoftDocs/azure-docs-pr). Employees from other parts of the Microsoft world should use the public repo for minor updates.

## About your contributions to Azure content
### Minor corrections
Minor corrections or clarifications you submit for documentation and code examples in this repo are covered by the [docs.microsoft.com Terms of Use](https://docs.microsoft.com/legal/termsofuse).

### Larger submissions from community members
If you submit a pull request with significant changes to documentation and code examples, you'll see a message in the pull request asking you to submit an online contribution license agreement (CLA). We need you to complete the online form before we can review your pull request.

## Tools and setup
Community contributors can use the GitHub UI or fork the repo to contribute - more information is available in our [contributor guide](https://docs.microsoft.com/contribute). 

## Repository organization
The content in the azure-docs repository follows the organization of documentation on https://docs.microsoft.com/azure. This repository contains two root folders:

### \articles
The *\articles* folder contains the documentation articles formatted as markdown files with an *.md* extension. Articles are typically grouped by Azure service.

The *\articles* folder contains the *\media* folder for root directory article media files, inside which are subfolders with the images for each article.  The service folders contain a separate media folder for the articles within each service folder. The article image folders are named identically to the article file, minus the *.md* file extension.

### \includes
You can create reusable content sections to be included in one or more articles. 

## How to use markdown to format your topic
All the articles in this repository use GitHub flavored markdown. If you are not familiar with markdown, see:

* [Markdown basics](https://help.github.com/articles/markdown-basics/)
* [Printable markdown cheatsheet](https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf)


## Labels
In the public azure-docs repository, automated labels are assigned to pull requests to help us manage the pull request workflow and to help let you know what's going on with your pull request:

* **Change sent to author**: The author has been notified of the pending pull request.
* **ready-to-merge**: Ready for review by our pull request review team.


