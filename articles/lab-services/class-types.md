---
title: Example lab class types
titleSuffix: Azure Lab Services
description: Learn about different example class types for which you can set up labs using Azure Lab Services.
services: lab-services
ms.service: lab-services
ms.custom: devx-track-python
author: ntrogh
ms.author: nicktrog
ms.topic: conceptual
ms.date: 04/24/2023
---

# Class types in Azure Lab Services

Azure Lab Services enables you to quickly set up lab environments in the cloud. Learn about the different class types for you can use Azure Lab Services.

## Adobe Creative Cloud

The [Adobe Creative Cloud](https://www.adobe.com/creativecloud.html) collection of applications are commonly used in digital arts and media classes.  

For detailed information on how to set up this type of lab, see [Setup a lab for Adobe Creative Cloud](class-type-adobe-creative-cloud.md).

## ArcGIS

[ArcGIS](https://www.esri.com/en-us/arcgis/products/arcgis-solutions/overview) is a type of geographic information system (GIS).  You can set up a lab that uses ArcGIS Desktop's various applications. For example, [ArcMap](https://desktop.arcgis.com/en/arcmap/latest/map/main/what-is-arcmap-.htm) can make, edit, and analyze 2D maps.

For detailed information on how to set up this type of lab, see [Setup a lab for ArcMap\ArcGIS Desktop](class-type-arcgis.md).

## Autodesk

[Autodesk](https://www.autodesk.com/) offers software solutions in architecture, engineering, construction, design, manufacturing, and more.  These solutions are commonly used in engineering classes and in the [Project Lead the Way](class-type-pltw.md) curriculum.

For detailed information on how to set up this type of lab, see [Set up a lab for Autodesk](class-type-autodesk.md).

## Big data analytics

You can set up a GPU lab to teach a big data analytics class. With this type of class, users learn how to handle large volumes of data, and apply machine and statistical learning algorithms to derive data insights. A key goal for users is to learn to use data analytics tools, such as Apache Hadoop's open-source software package that provides tools for storing, managing, and processing big data.

For detailed information on how to set up this type of lab, see [Set up a lab for big data analytics using Docker deployment of HortonWorks Data Platform](class-type-big-data-analytics.md).

## Database management

Database concepts is one of the introductory courses taught in most of the Computer Science departments in college. You can set up a lab for a basic databases management class in Azure Lab Services. For example, you can set up a virtual machine template in a lab with a [MySQL](https://www.mysql.com/) database server or a [SQL Server 2019](https://www.microsoft.com/sql-server/sql-server-2019) server.

For detailed information on how to set up this type of lab, see [Set up a lab to teach database management for relational databases](class-type-database-management.md).

## Deep learning in natural language processing

You can set up a lab focused on deep learning in natural language processing (NLP) using Azure Lab Services. Natural language processing (NLP) is a form of artificial intelligence (AI) that enables computers with translation, speech recognition, and other language understanding capabilities. Users taking an NLP class get a Linux virtual machine (VM) to learn how to apply neural network algorithms to develop deep learning models that are used for analyzing written human language.

For detailed information on how to set up this type of lab, see [Set up a lab focused on deep learning in natural language processing using Azure Lab Services](class-type-deep-learning-natural-language-processing.md).

## Ethical hacking with Hyper-V

You can set up a lab for a class that focuses on the forensics side of ethical hacking. Penetration testing, a practice used by the ethical hacking community, occurs when someone attempts to gain access to the system or network to demonstrate vulnerabilities that a malicious attacker may exploit.

In an ethical hacking class, users can learn modern techniques for defending against vulnerabilities. Each user gets a Windows Server host virtual machine that has two nested virtual machines – one virtual machine with [Metasploitable3](https://github.com/rapid7/metasploitable3) image and another machine with [Kali Linux](https://www.kali.org/) image. The Metasploitable virtual machine is used for exploiting purposes. The Kali Linux virtual machine provides access to the tools needed to run forensic tasks.

For detailed information on how to set up this type of lab, see [Set up a lab to teach ethical hacking class](class-type-ethical-hacking.md).

## MATLAB

[MATLAB](https://www.mathworks.com/products/matlab.html), which stands for Matrix laboratory, is a programming platform from [MathWorks](https://www.mathworks.com/).  It combines computational power and visualization, making it a popular tool in the fields of math, engineering, physics, and chemistry.

For detailed information on how to set up this type of lab, see [Setup a lab to teach MATLAB](class-type-matlab.md).

## Networking with GNS3

You can set up a lab for a class that focuses on emulating, configuring, testing, and troubleshooting virtual and real networks by using [GNS3](https://www.gns3.com/) software.

For detailed information on how to set up this type of lab, see [Setup a lab to teach a networking class](class-type-networking-gns3.md).

## Project Lead the Way (PLTW)

[Project Lead the Way (PLTW)](https://www.pltw.org/) is a nonprofit organization that provides PreK-12 curriculum across the United States in computer science, engineering, and biomedical science.  In each PLTW class, users use various software applications as part of their hands-on learning experience.

For detailed information on how to set up these types of labs, see [Set up labs for Project Lead the Way classes](class-type-pltw.md).

## Python and Jupyter notebooks

You can set up a template machine in Azure Lab Services with the tools needed to teach users how to use [Jupyter Notebooks](http://jupyter-notebook.readthedocs.io). Jupyter Notebooks is an open-source project that lets you easily combine rich text and executable [Python](https://www.python.org/) source code on a single canvas called a notebook. Running a notebook results in a linear record of inputs and outputs.  Those outputs can include text, tables of information, scatter plots, and more.

For detailed information on how to set up this type of lab, see [Set up a lab to teach data science with Python and Jupyter Notebooks](class-type-jupyter-notebook.md).

## React

[React](https://reactjs.org/) is a popular JavaScript library for building user interfaces (UI). React is a declarative way to create reusable components for your website.  There are many popular libraries for JavaScript-based front-end development. [Redux](https://redux.js.org/) is a library that provides predictable state container for JavaScript apps and is often used in compliment with React. [JSX](https://reactjs.org/docs/introducing-jsx.html) is a library syntax extension to JavaScript often used with React to describe what the UI should look like.  [NodeJS](https://nodejs.org/) is a convenient way to run a webserver for your React application.

For detailed information on how to set up this type of lab on Linux using [Visual Studio Code](https://code.visualstudio.com/) for your development environment, see [Set up lab for React on Linux](class-type-react-linux.md).  For detailed information on how to set up this type of lab on Windows using [Visual Studio 2019](https://visualstudio.microsoft.com/vs/) for your development environment, see [Set up lab for React on Windows](class-type-react-windows.md).

## RStudio

[R](https://www.r-project.org/about.html) is an open-source language used for statistical computing and graphics.  The language is used in the statistical analysis of genetics, natural language processing, analyzing financial data, and more.  R provides an [interactive command line](https://cran.r-project.org/doc/manuals/r-release/R-intro.html#Invoking-R-from-the-command-line) experience.  [RStudio](https://www.rstudio.com/products/rstudio/) is an interactive development environment (IDE) available for the R language.  The free version provides code-editing tools, an integrated debugging experience, and package development tools.  This class type focuses on solely RStudio and R as a building block for a class that requires the use of statistical computing.

For detailed information on how to set up this type of lab, see [Set up a lab to teach R on Linux](class-type-rstudio-linux.md) or [Set up a lab to teach R on Windows](class-type-rstudio-windows.md).

## Shell scripting on Linux

You can set up a lab to teach shell scripting on Linux. Scripting is a useful part of system administration that allows administrators to avoid repetitive tasks. In this sample scenario, the class covers traditional bash scripts and enhanced scripts. Enhanced scripts are scripts that combine bash commands and Ruby. This approach allows Ruby to pass data around and bash commands to interact with the shell.

Users taking these scripting classes get a Linux virtual machine to learn the basics of Linux, and also get familiar with the bash shell scripting. The Linux virtual machine has remote desktop access enabled, and has the [Gedit](https://help.gnome.org/users/gedit/stable/) and [Visual Studio Code](https://code.visualstudio.com/) text editors installed.

For detailed information on how to set up this type of lab, see [Set up a lab  for Shell scripting on Linux](class-type-shell-scripting-linux.md).

## SolidWorks computer-aided design (CAD)

You can set up a GPU lab that gives engineering users access to [SolidWorks](https://www.solidworks.com/).  SolidWorks provides a 3D CAD environment for modeling solid objects.  With SolidWorks, engineers can easily create, visualize, simulate, and document their designs.

For detailed information on how to set up this type of lab, see [Set up a lab for engineering classes using SolidWorks](class-type-solidworks.md).

## SQL database and management

Structured Query Language (SQL) is the standard language for relational database management including adding, accessing, and managing content in a database.  You can set up a lab to teach database concepts using both [MySQL](https://www.mysql.com/) and [SQL Server 2019](https://www.microsoft.com/sql-server/sql-server-2019) server.

For detailed information on how to set up this type of lab, see [Set up a lab to teach database management for relational databases](class-type-database-management.md).

## Next steps

See the following articles:

- [Set up a lab focused on deep learning in natural language processing using Azure Lab Services](class-type-deep-learning-natural-language-processing.md)
- [Set up a lab to teach a networking class](class-type-networking-gns3.md)
- [Set up a lab to teach ethical hacking class with Hyper-V](class-type-ethical-hacking.md)
