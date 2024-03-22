---
title: Library Management in Azure HDInsight on AKS
description: Learn how to use Library Management in Azure HDInsight on AKS with Spark 
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Library management in Spark

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

The purpose of Library Management is to make open-source or custom code available to notebooks and jobs running on your clusters. You can upload Python libraries from PyPI repositories.
This article focuses on managing libraries  in the cluster UI. 
Azure HDInsight on AKS already includes many common libraries in the cluster. To see which libraries are included in HDI on AKS cluster, review the library management page.

## Install libraries

You can install libraries in two modes:

* Cluster-installed
* Notebook-scoped

### Cluster Installed 
All notebooks running on a cluster can use cluster libraries. You can install a cluster library directly from a public repository such as PyPi. Upload from Maven repositories, upload custom libraries from cloud storage are in the roadmap.

:::image type="content" source="./media/library-management/cluster-installed-library.png" alt-text="Screenshot showing cluster installed library manager page." lightbox="./media/library-management/cluster-installed-library.png":::

### Notebook-scoped

Notebook-scoped libraries, available for Python and Scala, which allow you to install libraries and create an environment scoped to a notebook session. These libraries don't affect other notebooks running on the same cluster. Notebook-scoped libraries don't persist and must be reinstalled for each session.  

> [!NOTE]
> Use notebook-scoped libraries when you need a custom environment for a specific notebook.

#### Modes of Library Installation

**PyPI**: Fetch libraries from open source PyPI repository by mentioning the library name and version in the installation UI.

## View the installed libraries

1. From Overview page, navigate to Library Manager.

   :::image type="content" source="./media/library-management/library-manager.png" alt-text="Screenshot showing library manager page." lightbox="./media/library-management/library-manager.png":::

1. From Spark Cluster Manager, click on Library Manager.
1. You can view the list of installed libraries from here.

   :::image type="content" source="./media/library-management/view-installed-libraries.png" alt-text="Screenshot showing how to view installed libraries." lightbox="./media/library-management/view-installed-libraries.png":::

## Add library widget

#### PyPI

1. From the **PyPI** tab, enter the **Package Name** and **Package Version.**.
1. Click **Install**.
   
   :::image type="content" source="./media/library-management/install-pypi.png" alt-text="Screenshot showing how to install PyPI.":::

## Uninstalling Libraries

If you decide not to use the libraries anymore, then you can easily delete the libraries packages through the uninstall button in the library management page.

1. Select and click on the library name

   :::image type="content" source="./media/library-management/select-library.png" alt-text="Screenshot showing how to select library.":::

1. Click on **Uninstall** in the widget

   :::image type="content" source="./media/library-management/uninstall-library.png" alt-text="Screenshot showing how to uninstall library.":::

   > [!NOTE]
   > * Packages installed from Jupyter notebook can only be deleted from Jupyter Notebook.
   > * Packages installed from library manager can only be uninstalled from library manager.
   > * For upgrading a library/package, uninstall the current version of the library and resinstall the required version of the library.
   > * Installation of libraries from Jupyter notebook is particular to the session. It is not persistant.
   > * Installing heavy packages may take some time due to their size and complexity.
