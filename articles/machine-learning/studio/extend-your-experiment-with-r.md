---
title: Extend your experiment with R
titleSuffix: Azure Machine Learning Studio
description: How to extend the functionality of Azure Machine Learning Studio through the R language by using the Execute R Script module.
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: conceptual

author: xiaoharper
ms.author: amlstudiodocs
ms.custom: previous-author=heatherbshapiro, previous-ms.author=hshapiro
ms.date: 03/20/2017
---
# Azure Machine Learning Studio: Extend your experiment with R 
You can extend the functionality of Azure Machine Learning Studio through the R language by using the [Execute R Script][execute-r-script] module.

This module accepts multiple input datasets and yields a single dataset as output. You can type an R script into the **R Script** parameter of the [Execute R Script][execute-r-script] module.

You access each input port of the module by using code similar to the following:

    dataset1 <- maml.mapInputPort(1)

## Listing all currently-installed packages
The list of installed packages can change. A list of currently installed packages can be found in [R Packages Supported by Azure Machine Learning Studio](https://msdn.microsoft.com/library/azure/mt741980.aspx).

You also can get the complete, current list of installed packages by entering the following code into the [Execute R Script][execute-r-script] module:

    out <- data.frame(installed.packages(,,,fields="Description"))
    maml.mapOutputPort("out")

This sends the list of packages to the output port of the [Execute R Script][execute-r-script] module.
To view the package list, connect a conversion module such as [Convert to CSV][convert-to-csv] to the left output of the [Execute R Script][execute-r-script] module, run the experiment, then click the output of the conversion module and select **Download**. 

![Download output of "Convert to CSV" module](./media/extend-your-experiment-with-r/download-package-list.png)


<!--
For convenience, here is the [current full list with version numbers in Excel format](https://az754797.vo.msecnd.net/docs/RPackages.xlsx).
-->

## Importing packages
You can import packages that are not already installed by using the following commands in the [Execute R Script][execute-r-script] module:

    install.packages("src/my_favorite_package.zip", lib = ".", repos = NULL, verbose = TRUE)
    success <- library("my_favorite_package", lib.loc = ".", logical.return = TRUE, verbose = TRUE)

where the `my_favorite_package.zip` file contains your package.




<!-- Module References -->
[execute-r-script]: https://msdn.microsoft.com/library/azure/30806023-392b-42e0-94d6-6b775a6e0fd5/
[convert-to-csv]: https://msdn.microsoft.com/library/azure/faa6ba63-383c-4086-ba58-7abf26b85814/
