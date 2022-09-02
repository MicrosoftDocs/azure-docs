---
title: Manage session level libraries for Apache Spark
description: Learn how to add and manage libraries on Spark Notebook sessions for Azure Synapse Analytics.
author: shuaijunye
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 07/07/2020
ms.author: shuaijunye
ms.subservice: spark
---


# Manage session-scoped packages
In addition to pool level packages, you can also specify session-scoped libraries at the beginning of a notebook session. Session-scoped libraries let you specify and use custom Python environments or jar packages within a notebook session. 

When using session-scoped libraries, it is important to keep the following points in mind:
   - When you install session-scoped libraries, only the current notebook has access to the specified libraries. 
   - These libraries will not impact other sessions or jobs using the same Spark pool. 
   - These libraries are installed on top of the base runtime and pool level libraries. 
   - Notebook libraries will take the highest precedence.

## Session-scoped Python packages
To specify session-scoped Python packages:
1.	Navigate to the selected Spark pool and ensure that you have enabled session-level libraries.  You can enable this setting by navigating to the **Manage** > **Apache Spark pool** > **Packages** tab.
  :::image type="content" source="./media/apache-spark-azure-portal-add-libraries/enable-session-packages.png" alt-text="Screenshot of enabling session packages." lightbox="./media/apache-spark-azure-portal-add-libraries/enable-session-packages.png":::
2.	Once the setting has been applied, you can open a notebook and select **Configure Session**> **Packages**.
  ![Screenshot of specifying session packages.](./media/apache-spark-azure-portal-add-libraries/update-session-notebook.png "Update session configuration")
  ![Screenshot of uploading Yml file.](./media/apache-spark-azure-portal-add-libraries/upload-session-notebook-yml.png)
3.	Here, you can upload a Conda *environment.yml* file to install or upgrade packages within a session. Once you start your session, the specified libraries will be installed. Once your session ends, these libraries will no longer be available as they are specific to your session.

### Verify installed libraries
To verify if the correct versions of the correct libraries are installed from PyPI, run the following code:
```python
import pkg_resources
for d in pkg_resources.working_set:
     print(d)
```
In some cases, to view the package versions from Conda, you may need to inspect the package version individually.

## Session-scoped Java or Scala packages
To specify session-scoped Java or Scala packages, you can use the ```%%configure``` option:

```scala
%%configure -f
{
    "conf": {
        "spark.jars": "abfss://<<file system>>@<<storage account>.dfs.core.windows.net/<<path to JAR file>>",
    }
}
```

We recommend you to run the %%configure at the beginning of your notebook. You can refer to this [document](https://github.com/cloudera/livy#request-body) for the full list of valid parameters.


## Next steps
- View the default libraries: [Apache Spark version support](apache-spark-version-support.md)
- Manage the packages outside Synapse Studio portal: [Manage packages through Az commands and REST APIs](apache-spark-manage-packages-outside-ui.md)