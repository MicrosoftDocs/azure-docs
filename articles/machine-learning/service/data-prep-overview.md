---
title: What is the data prep SDK?
description: Learn about the data prep SDK
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: cforbe
author: cforbe
ms.date: 08/30/2018
---

# What is the data prep SDK?
 
As part of the AML Workbench, we provided a Data Prep experience via a GUI. But with the focus of AML Services switching to an API/SDK model, a GUI solution was out of sync. Hence, the team has exposed the underlying API that the GUI uses.  GOOD NEWS: as of today, you can now use this API. 
 
While 100% of the GUI functionality is not yet exposed, it will be eventually. As of today, you can use much of the capability including PROSE technology, Smart File Readers, and many other transforms.
  
# Why would you use this API? 
The data prep API provides (and will provide even more) value through:
-	Intelligent Transforms. This includes Derived Column By Example and Autosplit
-	Smart File Reading. Point the file reader at any one of the supported file types. So, no need to remember how to use a csv reader, a flat file reader, or an excel reader etc.
-	Varying Schema per row. The Data Prep engine has the ability to support different columns per row so that inconsistent data can still be read and then processed
-	Scale through streaming. Unlike many other APIs, the Data Prep engine does not load all the data into memory; it streams it so it scales and performs much better than traditional APIs
-	X-Plat with a single code artifact. Write to a single Data Prep API and have it run on Windows, macOS, Linux, Spark in a scale up or scale out manner
  
Download:
- [Data Prep SDK](https://dataprepdownloads.azureedge.net/pypi/privPreview/latest/)

```    
pip install --upgrade --extra-index-url https://dataprepdownloads.azureedge.net/pypi/privPreview/latest/ azureml-dataprep
```

- [AzureML SDK](https://github.com/Azure/ViennaDocs/tree/master/PrivatePreview)
 
- [CLI link](https://github.com/Azure/ViennaDocs/blob/master/PrivatePreview/cli/CLI-101-Install-and-Local-Run.md)
