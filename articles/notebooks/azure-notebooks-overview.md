---
title: Overview of Azure Notebooks Preview
description: Run Jupyter notebooks in the cloud using the free Azure Notebooks Preview service, where no setup or configuration is required.
ms.topic: overview
ms.date: 04/05/2019
---

# Overview of Azure Notebooks Preview

[!INCLUDE [notebooks-status](../../includes/notebooks-status.md)]

Azure Notebooks is a free hosted service to develop and run Jupyter notebooks in the cloud with no installation. [Jupyter](https://jupyter.org/) (formerly IPython) is an open-source project that lets you easily combine Markdown text, executable code, persistent data, graphics, and visualizations onto a single, sharable canvas, called the *notebook* (image courtesy of jupyter.org):

[![Examples of Jupyter notebooks](https://jupyter.org/assets/jupyterpreview.png)](https://jupyter.org/assets/jupyterpreview.png#lightbox)

Because of this powerful combination of code, graphics, and explanatory text, Jupyter has become popular for many uses including data science instruction, data cleaning and transformation, numerical simulation, statistical modeling, and the development of machine learning models.

## Hassle-free experience

Azure Notebooks helps you to get started quickly on prototyping, data science, academic research, or learning to program Python:

- A data scientist has instant access to a full Anaconda environment with no installation.
- A teacher can provide a hassle-free Python environment to students.
- A presenter can give a like talk or webinar without asking attendees to spend 45 mins installing software.
- A developer or hobbyist can use Notebooks as a quick code scratchpad.

Notebooks become even more powerful when people can collaborate on them through a browser-accessible cloud service like Azure Notebooks (in Preview). In the cloud, users need not install Jupyter locally or concern themselves with maintaining an environment. The cloud also makes it simple to share notebooks (and associated data files) with other authorized users, avoiding the complications of sharing notebooks through external means like source-control repositories. With Azure Notebooks, users can also copy (or "clone") notebooks into their own account for modification or experimentation, which is especially useful for instruction purposes.

Because Azure Notebooks is a general code authoring, execution and sharing platform, you can use it for many diverse scenarios:

- Learn a new programming language – try one of the [frontpage tutorials](https://notebooks.azure.com/Microsoft/projects/samples/html/Introduction%20to%20Python.ipynb)
- Learn Data Science – try [Jake VanderPlas' book](https://notebooks.azure.com/jakevdp/projects/PythonDataScienceHandbook)
- [Teach a course](https://notebooks.azure.com/garth-wells/projects/CUED-IA-Computing-Michaelmas) for hundreds of students
- Give a webinar online or at a conference without spending time on installation 
- Enable GitHub users to directly load and run notebooks by [creating a GitHub launch badge](https://notebooks.azure.com/help/projects/sharing/create-a-github-badge)
- Give [PowerPoint like slideshows](https://notebooks.azure.com/help/jupyter-notebooks/slides) where code in slides is executable!

In short, Azure Notebooks helps you accomplish your work more efficiently and thus achieve more.

> [!Note]
> More information on Jupyter itself can be found on [jupyter.org](https://jupyter.org/) and in the [Jupyter documentation](https://jupyter-notebook.readthedocs.io/en/latest/).

## Pricing and quotas

Azure Notebooks is a free service but each project is limited to 4GB memory and 1GB data to prevent abuse. Legitimate users that exceed these limits see a Captcha challenge to continue running notebooks.

To release all limits, sign into Azure Notebooks with an account using Azure Active Directory (such as a corporate account). If that account is associated with an Azure subscription, you can connect to any Azure Data Science Virtual Machine instances within that subscription. For more information, see [Manage and configure projects - Compute tier](configure-manage-azure-notebooks-projects.md#compute-tier).

Notebook servers are guaranteed to exist for at most 8 hours. In most cases, your container isn't subject to this limit and continues to run beyond this time, but long-lived sessions may occasionally be shut down for system stability.

## Available kernels and environments

For each notebook, you select the kernel (that is, the runtime environment) that's used to run any code cells. Azure Notebooks supports the following kernels:

- Python 2.7 + Anaconda2-5.3.0
- Python 3.6 + Anaconda3-5.3.0
- Python 3.5 + Anaconda3-4.2.0 (will be deprecated)
- R 3.4.1 + Microsoft R Open 3.4.1
- F# 4.1.9

Azure Notebooks also includes extra packages beyond the base distributions. The Python kernels, for example, include the numpy, pandas, scikit-learn, matplotlib, and bokeh libraries.

You can also customize a project to create an environment for all of the notebooks in that project. For more information, see [Quickstart: Create a project with a custom environment](quickstart-create-jupyter-notebook-project-environment.md).

In addition to the base distributions, Azure Notebooks comes pre-installed with many extra packages that are useful for data scientists. You can also install your own packages using the typical process for each language.

## Pre-configured Jupyter extensions

Azure Notebooks is pre-configured with the following Jupyter extensions:

- [RISE](https://github.com/damianavila/RISE): A Jupyter Slideshow Extension (also known as live_reveal). For more information, see [Run a notebook slideshow](present-jupyter-notebooks-slideshow.md).
- [JupyterLab](https://github.com/jupyterlab/jupyterlab): A full computational environment for working with Jupyter notebooks.
- [Altair](https://github.com/ellisonbg/altair): A declarative statistical visualization library for Python.
- [BQPlot](https://github.com/bloomberg/bqplot): An interactive plotting framework for Jupyter Notebooks.
- [IpyWidgets](https://github.com/jupyter-widgets/ipywidgets): Interactive HTML widgets for Jupyter Notebooks.

## Issues and getting help

Because Azure Notebooks is still in Preview, the service may experience temporary outages that may be more frequent or longer lasting than other Azure services. Some features may be incomplete or contain bugs.

At present, we recommend against using Azure Notebooks Preview for business-critical applications, or sensitive notebooks and data.

To discuss your questions about Azure Notebooks, file an issue on the [GitHub repository](https://github.com/Microsoft/AzureNotebooks/issues).

## Next steps  

- [Explore sample notebooks](azure-notebooks-samples.md)

- Quickstarts:

  - [Create and share a notebook](quickstart-create-share-jupyter-notebook.md)
  - [Clone a notebook](quickstart-clone-jupyter-notebook.md)
  - [Migrate a local Jupyter notebook](quickstart-migrate-local-jupyter-notebook.md)
  - [Use a custom environment](quickstart-create-jupyter-notebook-project-environment.md)
  - [Sign in and set a user ID](quickstart-sign-in-azure-notebooks.md)

- Tutorials:

  - [Create and run a notebook](tutorial-create-run-jupyter-notebook.md  )

- How-to articles:
  
  - [Create and clone projects](create-clone-jupyter-notebooks.md)
  - [Configure and manage projects](configure-manage-azure-notebooks-projects.md)
  - [Install packages from within a notebook](install-packages-jupyter-notebook.md)
  - [Present a slide show](present-jupyter-notebooks-slideshow.md)
  - [Work with data files](work-with-project-data-files.md)
  - [Access data resources](access-data-resources-jupyter-notebooks.md)
  - [Use Azure Machine Learning](use-machine-learning-services-jupyter-notebooks.md)
