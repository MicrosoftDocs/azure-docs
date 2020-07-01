---
title: Azure Data Lake Storage Gen1 performance tuning - PowerShell
description: Tips on how to improve performance when using Azure PowerShell with Azure Data Lake Storage Gen1.

author: stewu
ms.service: data-lake-store
ms.topic: how-to
ms.date: 01/09/2018
ms.author: stewu

---
# Performance tuning guidance for using PowerShell with Azure Data Lake Storage Gen1

This article describes the properties that you can tune to get better performance while using PowerShell to work with Data Lake Storage Gen1.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Performance-related properties

| Property            | Default | Description |
|---------------------|---------|-------------|
| PerFileThreadCount  | 10      | This parameter enables you to choose the number of parallel threads for uploading or downloading each file. This number represents the max threads that can be allocated per file, but you may get fewer threads depending on your scenario (for example, if you are uploading a 1-KB file, you get one thread even if you ask for 20 threads).  |
| ConcurrentFileCount | 10      | This parameter is specifically for uploading or downloading folders. This parameter determines the number of concurrent files that can be uploaded or downloaded. This number represents the maximum number of concurrent files that can be uploaded or downloaded at one time, but you may get less concurrency depending on your scenario (for example, if you are uploading two files, you get two concurrent files uploads even if you ask for 15). |

**Example:**

This command downloads files from Data Lake Storage Gen1 to the user's local drive using 20 threads per file and 100 concurrent files.

```PowerShell
Export-AzDataLakeStoreItem -AccountName "Data Lake Storage Gen1 account name" `
    -PerFileThreadCount 20 `
	-ConcurrentFileCount 100 `
	-Path /Powershell/100GB `
	-Destination C:\Performance\ `
	-Force `
	-Recurse
```

## How to determine property values

The next question you might have is how to determine what value to provide for the performance-related properties. Here's some guidance that you can use.

* **Step 1: Determine the total thread count** - Start by calculating the total thread count to use. As a general guideline, you should use six threads for each physical core.

    `Total thread count = total physical cores * 6`

    **Example:**

    Assuming you are running the PowerShell commands from a D14 VM that has 16 cores

    `Total thread count = 16 cores * 6 = 96 threads`

* **Step 2: Calculate PerFileThreadCount** - We calculate our PerFileThreadCount based on the size of the files. For files smaller than 2.5 GB, there is no need to change this parameter because the default of 10 is sufficient. For files larger than 2.5 GB, you should use 10 threads as the base for the first 2.5 GB and add 1 thread for each additional 256-MB increase in file size. If you are copying a folder with a large range of file sizes, consider grouping them into similar file sizes. Having dissimilar file sizes may cause non-optimal performance. If that's not possible to group similar file sizes, you should set PerFileThreadCount based on the largest file size.

    `PerFileThreadCount = 10 threads for the first 2.5 GB + 1 thread for each additional 256 MB increase in file size`

    **Example:**

    Assuming you have 100 files ranging from 1 GB to 10 GB, we use the 10 GB as the largest file size for equation, which would read like the following.

    `PerFileThreadCount = 10 + ((10 GB - 2.5 GB) / 256 MB) = 40 threads`

* **Step 3: Calculate ConcurrentFilecount** - Use the total thread count and PerFileThreadCount to calculate ConcurrentFileCount based on the following equation:

    `Total thread count = PerFileThreadCount * ConcurrentFileCount`

    **Example:**

    Based on the example values we have been using

    `96 = 40 * ConcurrentFileCount`

    So, **ConcurrentFileCount** is **2.4**, which we can round off to **2**.

## Further tuning

You might require further tuning because there is a range of file sizes to work with. The preceding calculation works well if all or most of the files are larger and closer to the 10-GB range. If instead, there are many different files sizes with many files being smaller, then you could reduce PerFileThreadCount. By reducing the PerFileThreadCount, we can increase ConcurrentFileCount. So, if we assume that most of our files are smaller in the 5-GB range, we can redo our calculation:

`PerFileThreadCount = 10 + ((5 GB - 2.5 GB) / 256 MB) = 20`

So, **ConcurrentFileCount** becomes 96/20, which is 4.8, rounded off to **4**.

You can continue to tune these settings by changing the **PerFileThreadCount** up and down depending on the distribution of your file sizes.

### Limitation

* **Number of files is less than ConcurrentFileCount**: If the number of files you are uploading is smaller than the **ConcurrentFileCount** that you calculated, then you should reduce **ConcurrentFileCount** to be equal to the number of files. You can use any remaining threads to increase **PerFileThreadCount**.

* **Too many threads**: If you increase thread count too much without increasing your cluster size, you run the risk of degraded performance. There can be contention issues when context-switching on the CPU.

* **Insufficient concurrency**: If the concurrency is not sufficient, then your cluster may be too small. You can increase the number of nodes in your cluster, which gives you more concurrency.

* **Throttling errors**: You may see throttling errors if your concurrency is too high. If you are seeing throttling errors, you should either reduce the concurrency or contact us.

## Next steps

* [Use Azure Data Lake Storage Gen1 for big data requirements](data-lake-store-data-scenarios.md) 
* [Secure data in Data Lake Storage Gen1](data-lake-store-secure-data.md)
* [Use Azure Data Lake Analytics with Data Lake Storage Gen1](../data-lake-analytics/data-lake-analytics-get-started-portal.md)
* [Use Azure HDInsight with Data Lake Storage Gen1](data-lake-store-hdinsight-hadoop-use-portal.md)

