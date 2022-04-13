---
title: Machine Learning CLI (v1)
titleSuffix: Azure Machine Learning
description: Learn about the machine learning extension for the Azure CLI (v1).
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

ms.reviewer: larryfr
ms.author: larryfr
author: BlackMist
ms.date: 03/31/2022
ms.custom: cliv1
---

# Azure Machine Learning CLI (v1)
[!INCLUDE [cli v1](../../../includes/machine-learning-cli-v1.md)]

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning CLI extension you are using:"]
> * [v1](introduction.md)
> * [v2 (current version)](../index.yml)

The Azure CLI commands in this directory __require__ the `azure-cli-ml`, or v1, extension for Azure Machine Learning. The enhanced v2 CLI using the `ml` extension is now available and recommended. 

The extensions are incompatible, so v2 CLI commands will not work for articles in this directory. However, machine learning workspaces and all underlying resources can be interacted with from either, meaning one user can create a workspace with the v1 CLI and another can submit jobs to the same workspace with the v2 CLI.

## How do I know which extension I have?

To find which extensions you have installed, use `az extension list`. 
* If the list of __Extensions__ contains `azure-cli-ml`, you have the v1 extension.
* If the list contains `ml`, you have the v2 extension.


## Next steps

For more information on installing and using the different extensions, see the following articles:

* `azure-cli-ml` - [Install, set up, and use the CLI (v1)](reference-azure-machine-learning-cli.md)
* `ml` - [Install and set up the CLI (v2)](../how-to-configure-cli.md)

