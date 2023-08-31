---
title: Azure Blob Storage code samples using Python version 2.1 client libraries
titleSuffix: Azure Storage
description: View code samples that use the Azure Blob Storage client library for Python version 2.1.
services: storage
author: pauljewellmsft
ms.service: azure-blob-storage
ms.custom: devx-track-python
ms.topic: how-to
ms.date: 04/03/2023
ms.author: pauljewell
---

# Azure Blob Storage code samples using Python version 2.1 client libraries

This article shows code samples that use version 2.1 of the Azure Blob Storage client library for Python.

[!INCLUDE [storage-v11-sdk-support-retirement](../../../includes/storage-v11-sdk-support-retirement.md)]

## Build a highly available app with Blob Storage

Related article: [Tutorial: Build a highly available application with Blob storage](storage-create-geo-redundant-storage.md)

### Download the sample

[Download the sample project](https://github.com/Azure-Samples/storage-python-circuit-breaker-pattern-ha-apps-using-ra-grs/archive/master.zip) and extract (unzip) the storage-python-circuit-breaker-pattern-ha-apps-using-ra-grs.zip file. You can also use [git](https://git-scm.com/) to download a copy of the application to your development environment. The sample project contains a basic Python application.

```bash
git clone https://github.com/Azure-Samples/storage-python-circuit-breaker-pattern-ha-apps-using-ra-grs.git
```

### Configure the sample

In the application, you must provide your storage account credentials. You can store this information in environment variables on the local machine running the application. Follow one of the examples below depending on your Operating System to create the environment variables.

In the Azure portal, navigate to your storage account. Select **Access keys** under **Settings** in your storage account. Paste the **Storage account name** and **Key** values into the following commands, replacing the \<youraccountname\> and \<youraccountkey\> placeholders. This command saves the environment variables to the local machine. In Windows, the environment variable isn't available until you reload the **Command Prompt** or shell you're using.

#### Linux

```bash
export accountname=<youraccountname>
export accountkey=<youraccountkey>
```

#### Windows

```powershell
setx accountname "<youraccountname>"
setx accountkey "<youraccountkey>"
```

### Run the console application

To run the application on a terminal or command prompt, go to the **circuitbreaker.py** directory, then enter `python circuitbreaker.py`. The application uploads the **HelloWorld.png** image from the solution to the storage account. The application checks to ensure the image has replicated to the secondary RA-GZRS endpoint. It then begins downloading the image up to 999 times. Each read is represented by a **P** or an **S**. Where **P** represents the primary endpoint and **S** represents the secondary endpoint.

![Screnshot of console app running.](media/storage-create-geo-redundant-storage/figure3.png)

In the sample code, the `run_circuit_breaker` method in the `circuitbreaker.py` file is used to download an image from the storage account using the [get_blob_to_path](/python/api/azure-storage-blob/azure.storage.blob.baseblobservice.baseblobservice#get-blob-to-path-container-name--blob-name--file-path--open-mode--wb---snapshot-none--start-range-none--end-range-none--validate-content-false--progress-callback-none--max-connections-2--lease-id-none--if-modified-since-none--if-unmodified-since-none--if-match-none--if-none-match-none--timeout-none-) method.

The Storage object retry function is set to a linear retry policy. The retry function determines whether to retry a request, and specifies the number of seconds to wait before retrying the request. Set the **retry\_to\_secondary** value to true, if request should be retried to secondary in case the initial request to primary fails. In the sample application, a custom retry policy is defined in the `retry_callback` function of the storage object.

Before the download, the Service object [retry_callback](/python/api/azure-storage-common/azure.storage.common.storageclient.storageclient) and [response_callback](/python/api/azure-storage-common/azure.storage.common.storageclient.storageclient) function is defined. These functions define event handlers that fire when a download completes successfully or if a download fails and is retrying.

### Understand the code sample

#### Retry event handler

The `retry_callback` event handler is called when the download of the image fails and is set to retry. If the maximum number of retries defined in the application are reached, the [LocationMode](/python/api/azure-storage-common/azure.storage.common.models.locationmode) of the request is changed to `SECONDARY`. This setting forces the application to attempt to download the image from the secondary endpoint. This configuration reduces the time taken to request the image as the primary endpoint isn't retried indefinitely.

```python
def retry_callback(retry_context):
    global retry_count
    retry_count = retry_context.count
    sys.stdout.write(
        "\nRetrying event because of failure reading the primary. RetryCount= {0}".format(retry_count))
    sys.stdout.flush()

    # Check if we have more than n-retries in which case switch to secondary
    if retry_count >= retry_threshold:

        # Check to see if we can fail over to secondary.
        if blob_client.location_mode != LocationMode.SECONDARY:
            blob_client.location_mode = LocationMode.SECONDARY
            retry_count = 0
        else:
            raise Exception("Both primary and secondary are unreachable. "
                            "Check your application's network connection.")
```

#### Request completed event handler

The `response_callback` event handler is called when the download of the image is successful. If the application is using the secondary endpoint, the application continues to use this endpoint up to 20 times. After 20 times, the application sets the [LocationMode](/python/api/azure-storage-common/azure.storage.common.models.locationmode) back to `PRIMARY` and retries the primary endpoint. If a request is successful, the application continues to read from the primary endpoint.

```python
def response_callback(response):
    global secondary_read_count
    if blob_client.location_mode == LocationMode.SECONDARY:

        # You're reading the secondary. Let it read the secondary [secondaryThreshold] times,
        # then switch back to the primary and see if it is available now.
        secondary_read_count += 1
        if secondary_read_count >= secondary_threshold:
            blob_client.location_mode = LocationMode.PRIMARY
            secondary_read_count = 0
```
