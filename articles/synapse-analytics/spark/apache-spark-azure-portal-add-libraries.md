---
title: Adding libraries
description: How to add libraries to Apache Spark
services: sql-data-warehouse
author: euangMS
ms.service: sql-data-warehouse
ms.topic: overview
ms.subservice: design
ms.date: 11/25/2019
ms.author: euang
ms.reviewer: euang
---
# Library and Package Management

Apache Spark depends on many libraries to provide functionality, these libraries can be augmented/replaced with additional libraries or updated versions of older ones.

Python packages can be added at the Spark pool level and .jar based packages can be added at the Spark job definition level.

## Adding or updating Python libraries

Apache Spark in Azure Synapse Analytics has a full Anacondas install plus additional libraries. The full list can be found here [Apache Spark version support](apache-spark-version-support.md). When, a Spark instance starts up, a new virtual environment is created using this installation as the base. In addition a requirements.txt (pip freeze output) can be used to upgrade that virtual environment. Any packages listed in this file for install/upgrade will be downloaded from PyPi at the time of cluster startup. This file is used every time a Spark instance is created from that Spark pool.

> [!IMPORTANT]

> - If the package you are installing is large or takes a long time to install this will affect Spark instance start up time
> - Packages which require compiler support, such as GCC, at install time are not supported
> - Packages can not be downgraded, only added or upgraded

### Format

The format that this file takes is the following, below you can see the PyPi package name is listed along with an exact version, this file follows the format described [here](https://pip.pypa.io/en/stable/reference/pip_freeze/). This example pins the version specifically, you can also specify "no larger than" and "less than" versions in the file.

absl-py==0.7.0

adal==1.2.1

alabaster==0.7.10

### Python library User Interface

The UI for adding libraries is in the "Add new Apache Spark pool" UI on the additional page of the Azure Portal experience.

You can see where to apply the file below:
![Add Python libraries](./media/apache-spark-azure-portal-add-libraries/add-python-libraries.png "Add Python libraries")

## Adding or updating .jar files (Java or Scala)

The full list of .jar files that are preinstalled can be found here [Apache Spark version support](apache-spark-version-support.md). It is possible to use a job definition with a Spark job and one of the properties of that job definition is a list of reference file locations in ADLS storage where all the .jar files will be read from.

### Spark job definition User Interface

To add a new Spark job definition, press the **+** at the top of the **Develop** explorer view that shows notebooks and other development artifacts.

You can see below:

![Add .jar libraries](./media/apache-spark-azure-portal-add-libraries/add-jar-files.png "Add .jar libraries")
