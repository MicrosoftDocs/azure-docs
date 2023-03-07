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

In addition to pool level packages, you can also specify session-scoped libraries at the beginning of a notebook session. Session-scoped libraries let you specify and use custom Python environments, jar, and R packages within a notebook session.

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

## Session-scoped R packages (Preview)

Azure Synapse Analytics pools include many popular R libraries out-of-the-box. You can also install additional 3rd party libraries during your Apache Spark notebook session.

Session-scoped R libraries allow you to customize the R environment for a specific notebook session. When you install an R session-scoped library, only the notebook associated with that notebook session will have access to the newly installed libraries. Other notebooks or sessions using the same Spark pool definition will not be impacted. In addition, session-scoped R libraries do not persist across sessions. These libraries will be installed at the start of each session when the installation commands are executed. Last, session-scoped R libraries are automatically installed across both the driver and worker nodes.

### Install a package

You can easily install an R library from [CRAN](https://cran.r-project.org/).

```r
# Install a package from CRAN
install.packages(c("nycflights13", "Lahman"))
```

You can also leverage CRAN snapshots as the repository to ensure that the same package version is downloaded each time.

```r
install.packages("highcharter", repos = "https://cran.microsoft.com/snapshot/2021-07-16/")
```

> [!NOTE]
> These functions will be disabled when running pipeline jobs. If you want to install a package within a pipeline, you must leverage the library management capabilities at the pool level.

### Using devtools to install packages

The ```devtools``` library simplifies package development to expedite common tasks. This library is installed within the default Azure Synapse Analytics runtime.

You can use ```devtools``` to specify a specific version of a library to install. These libraries will be installed across all nodes within the cluster.

```r
# Install a specific version. 
install_version("caesar", version = "1.0.0") 
```

Similarly, you can install a library directly from GitHub.

```r
# Install a GitHub library. 

install_github("jtilly/matchingR") 
```

Currently, the following ```devtools``` functions are supported within Azure Synapse Analytics:

| Command         | Description     |
|--------------|-----------|
| install_github()  | Installs an R package from GitHub |
| install_gitlab()  | Installs an R package from GitLab  |
| install_bitbucket() | Installs an R package from BitBucket |
| install_url() | Installs an R package from an arbitrary URL |
| install_git() | Installs from an arbitrary git repository |
| install_local() | Installs from a local file on disk |
| install_version() | Installs from a specific version on CRAN |

> [!NOTE]
> These functions will be disabled when running pipeline jobs. If you want to install a package within a pipeline, you must leverage the library management capabilities at the pool level.

### View installed libraries

You can query all the libraries installed within your session using the ```library``` command.

```r
library()
```

You can use the ```packageVersion``` function to check the version of the library:

```r
packageVersion("caesar")
```

### Remove an R package from a session

You can use the ```detach``` function to remove a library from the namespace. These libraries will stay on disk until they are loaded again.

```r
# detach a library

detach("package: caesar")
```

To remove a session-scoped package from a notebook, use the ```remove.packages()``` command. This will not impact other sessions on the same cluster. Users cannot uninstall or remove libraries that are installed as part of the default Azure Synapse Analytics runtime.

```r
remove.packages("caesar")
```

> [!NOTE]
> You cannot remove core packages like SparkR, SparklyR, or R.

### Session-scoped R libraries and SparkR

Notebook-scoped libraries are available on SparkR workers.

```r
install.packages("stringr")
library(SparkR)

str_length_function <- function(x) {
  library(stringr)
  str_length(x)
}

docs <- c("Wow, I really like the new light sabers!",
               "That book was excellent.",
               "R is a fantastic language.",
               "The service in this restaurant was miserable.",
               "This is neither positive or negative.")

spark.lapply(docs, str_length_function)
```

### Session-scoped R libraries and SparklyR

With spark_apply() in SparklyR, you can use any R package inside Spark. By default, in sparklyr::spark_apply(), the packages argument is set to FALSE. This copies libraries in the current libPaths to the workers, allowing you to import and use them on workers. For example, you can run the following to generate a caesar-encrypted message with sparklyr::spark_apply():

```r
install.packages("caesar", repos = "https://cran.microsoft.com/snapshot/2021-07-16/")

spark_version <- "3.2"
config <- spark_config()
sc <- spark_connect(master = "yarn", version = spark_version, spark_home = "/opt/spark", config = config)

apply_cases <- function(x) {
  library(caesar)
  caesar("hello world")
}
sdf_len(sc, 5) %>%
  spark_apply(apply_cases, packages=FALSE)
```

## Next steps

- View the default libraries: [Apache Spark version support](apache-spark-version-support.md)
- Manage the packages outside Synapse Studio portal: [Manage packages through Az commands and REST APIs](apache-spark-manage-packages-outside-ui.md)