---
title: What is the Azure Data Science Virtual Machine
description: Key analytics scenarios and components for Windows and Linux Data Science Virtual Machines.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
ms.service: machine-learning
ms.subservice: data-science-vm

author: vijetajo
ms.author: vijetaj
ms.topic: overview
ms.date: 02/22/2019

---

# What is the Azure Data Science Virtual Machine for Linux and Windows?

The Data Science Virtual Machine (DSVM) is a customized VM image on the Azure cloud platform built specifically for doing data science. It has many popular data science and other tools pre-installed and pre-configured to jump-start building intelligent applications for advanced analytics. 

The tool configurations are rigorously tested by data scientists and developers at Microsoft and by the broader data science community. This testing helps ensure stability and general viability.

The DSVM is available on:
+ Windows Server 2016
+ Ubuntu 16.04 LTS and CentOS 7.4

> [!NOTE]
> All VM tools for deep learning have been folded into the Data Science Virtual Machine. 


## What can I do with the DSVM?
The goal of the Data Science Virtual Machine is to provide data professionals of all skill levels and across industries with a friction-free, pre-configured, and fully integrated data science environment. Instead of rolling out a comparable workspace on your own, you can provision a DSVM. That choice can save you days or even _weeks_ on the installation, configuration, and package management processes. After your DSVM has been allocated, you can immediately begin working on your data science project.

The DSVM is designed and configured for working with a broad range of usage scenarios. You can scale your environment up or down as your project requirements change. You can also use your preferred language to program data science tasks and install other tools to customize the system for your needs.

### Preconfigured analytics desktop in the cloud
The DSVM provides a baseline configuration for data science teams that want replace their local desktops with a managed cloud desktop. This baseline ensures that all the data scientists on a team have a consistent setup with which to verify experiments and promote collaboration. It also lowers costs by reducing the sysadmin burden. This burden reduction saves on the time needed to evaluate, install, and maintain software packages for advanced analytics.

### Data science training and education
Enterprise trainers and educators who teach data science classes usually provide a virtual machine image. The image ensures that students have a consistent setup and that the samples work predictably. 

The DSVM creates an on-demand environment with a consistent setup that eases the support and incompatibility challenges. Cases where these environments need to be built frequently, especially for shorter training classes, benefit substantially.

### On-demand elastic capacity for large-scale projects
Data science hackathons/competitions or large-scale data modeling and exploration require scaled-out hardware capacity, typically for short duration. The DSVM can help replicate the data science environment quickly on demand, on scaled-out servers that allow experiments that  high-powered computing resources can run.

### Custom compute power for Azure Notebooks
[Azure Notebooks](../../notebooks/azure-notebooks-overview.md) is a free hosted service to develop, run, and share Jupyter notebooks in the cloud with no installation. The free service  tier is limited to 4 GB of memory and 1 GB of data. 

To release all limits, you can attach a Notebooks project to a DSVM or any other VM running on a Jupyter server. If you sign in to Azure Notebooks with an account by using Azure Active Directory (such as a corporate account), Notebooks automatically shows DSVMs in any subscriptions associated with that account. You can [attach a DSVM to Azure Notebooks](../../notebooks/configure-manage-azure-notebooks-projects.md#compute-tier) to expand the available compute power.

### Short-term experimentation and evaluation
You can use the DSVM to evaluate or learn tools like these, with minimal setup effort:

- Microsoft Machine Learning Server
- SQL Server
- Visual Studio tools
- Jupyter
- Deep learning and machine learning toolkits
- New tools popular in the community 

Because you can set up the DSVM quickly, you can apply it in other short-term usage scenarios. These scenarios include replicating published experiments, executing demos, and following walkthroughs in online sessions and conference tutorials.

### Deep learning
In the DSVM, your training models can use deep learning algorithms on hardware that's based on graphics processing units (GPUs). By taking advantage of the VM scaling capabilities of the Azure platform, the DSVM helps you use GPU-based hardware in the cloud according to your needs. You can switch to a GPU-based VM when you're training large models, or when you need high-speed computations while keeping the same OS disk.  

The Windows Server 2016 edition of the DSVM comes pre-installed with GPU drivers, frameworks, and GPU versions of deep learning frameworks. On the Linux edition, deep learning on GPUs is enabled on both the CentOS and Ubuntu DSVMs. 

You can also deploy the Ubuntu, CentOS, or Windows 2016 edition of the DSVM to an Azure virtual machine that isn't based on GPUs. In this case, all the deep learning frameworks will fall back to the CPU mode.
 
[Learn more about available deep learning and AI frameworks](dsvm-deep-learning-ai-frameworks.md).

<a name="included"></a>

## What's included on the DSVM?
The Data Science Virtual Machine has many popular data science and deep learning tools already installed and configured. It also includes tools that make it easy to work with various Azure data and analytics products. These products include Microsoft Machine Learning Server (R, Python) for building predictive models, and SQL Server 2017 for large-scale exploration of data sets. The DSVM includes other tools from the open-source community and from Microsoft, along with [sample code and notebooks](dsvm-samples-and-walkthroughs.md). 

Here's a list of tools and platforms:
+ [Supported programming languages](dsvm-languages.md)

+ [Supported data platforms](dsvm-data-platforms.md)

+ [Development tools and IDEs](dsvm-tools-development.md)

+ [Deep learning and AI frameworks](dsvm-deep-learning-ai-frameworks.md)

+ [Machine learning and data science tools](dsvm-ml-data-science-tools.md)

+ [Data ingestion tools](dsvm-tools-ingestion.md)

+ [Data exploration and visualization tools](dsvm-tools-explore-and-visualize.md)

The following table itemizes and compares the main components included in the Windows and Linux editions of the Data Science Virtual Machine.

## Next steps

Learn more with these articles:

+ Windows:
  + [Set up a Windows DSVM](provision-vm.md)
  + [Ten things you can do on a Windows DSVM](vm-do-ten-things.md)

+ Linux:
  + [Set up a Linux DSVM (Ubuntu)](dsvm-ubuntu-intro.md)
  + [Set up a Linux DSVM (CentOS)](linux-dsvm-intro.md)
  + [Data science on a Linux DSVM](linux-dsvm-walkthrough.md)
