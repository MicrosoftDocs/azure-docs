---
title: Troubleshoot Azure Data Factory Studio
description: Learn how to troubleshoot Azure Data Factory Studio issues.
author: ssabat
ms.service: data-factory
ms.subservice: authoring
ms.topic: troubleshooting
ms.date: 07/13/2023
ms.author: susabat
ms.reviewer: susabat
---

# Troubleshoot Azure Data Factory Studio Issues

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article explores common troubleshooting methods for [Azure Data Factory Studio](https://adf.azure.com), the user interface for the service.

## Azure Data Factory Studio fails to load

> [!NOTE]
> The Azure Data Factory Studio officially supports Microsoft Edge and Google Chrome. Using other web browsers may lead to unexpected or undocumented behavior.

### Third-party cookies blocked

Azure Data Factory Studio uses browser cookies to persist user session state and enable interactive development and monitoring experiences. Your browser could block third-party cookies because you're using an incognito session or have an ad blocker enabled. Blocking third-party cookies can cause issues when loading the portal.  You could be redirected to a blank page, to 'https://adf.azure.com/accesstoken.html', or could encounter  a warning message saying that third-party cookies are blocked. To solve this problem, enable third-party cookies options on your browser using the following steps:

# [Microsoft Edge](#tab/edge)

#### Allow all cookies

1. Visit **edge://settings/content/cookies** in your browser.
1. Ensure **Allow sites to save and read cookie data** is enabled and that **Block third-party cookies** option is disabled 

    :::image type="content" source="media/data-factory-ux-troubleshoot-guide/edge-allow-all-cookies.png" alt-text="Allow all cookies in Edge":::
1. Refresh Azure Data Factory Studio and try again.

#### Only allow Azure Data Factory Studio to use cookies

If you don't want to allow all cookies, you can optionally just allow ADF Studio:

1. Visit **edge://settings/content/cookies**.
1. Under **Allow** section, select **Add** and add **adf.azure.com** site. 

    :::image type="content" source="media/data-factory-ux-troubleshoot-guide/edge-allow-adf-cookies.png" alt-text="Add ADF UX to allowed sites in Edge":::
1. Refresh ADF UX and try again.

# [Google Chrome](#tab/chrome)

#### Allow all cookies

1. Visit **chrome://settings/cookies** in your browser.
1. Select **Allow all cookies** option 

    :::image type="content" source="media/data-factory-ux-troubleshoot-guide/chrome-allow-all-cookies.png" alt-text="Allow All Cookies in Chrome":::
1. Refresh Azure Data Factory Studio and try again.

#### Only allow Azure Data Factory Studio to use cookies

If you don't want to allow all cookies, you can optionally just allow ADF Studio:
1. Visit **chrome://settings/cookies**.
1. Select **add** under **Sites that can always use cookies** option 

    :::image type="content" source="media/data-factory-ux-troubleshoot-guide/chrome-only-adf-cookies-1.png" alt-text="Add ADF UX to allowed sites in Chrome":::
1. Add **adf.azure.com** site, check **all cookies** option, and save. 

    :::image type="content" source="media/data-factory-ux-troubleshoot-guide/chrome-only-adf-cookies-2.png" alt-text="Allow all cookies from ADF UX site":::
1. Refresh ADF UX and try again.

---

## Connection failed error in Azure Data Factory Studio

Sometimes you might see a "Connection failed" error in Azure Data Factory Studio similar to the screenshot below, for example, after clicking **Test Connection** or **Preview**. It means the operation failed because your local machine couldn't connect to the ADF service.

:::image type="content" source="media/data-factory-ux-troubleshoot-guide/connection-failed.png" alt-text="Connection failed":::

To resolve the issue, you can first try the same operation with InPrivate browsing mode in your browser.

If it’s still not working, find the **server name**  from the error message (in this example, **dpnortheurope.svc.datafactory.azure.com**), then type the **server name** directly in the address bar of your browser. 

- If you see 404 in the browser, it usually means your client side is ok and the issue is at ADF service side. File a support ticket with the **Activity ID** from the error message.

    :::image type="content" source="media/data-factory-ux-troubleshoot-guide/status-code-404.png" alt-text="Resource not found":::

- If you don't see 404 or you see similar error below in the browser, it usually means you have some client-side issue. Further follow the troubleshooting steps.

    :::image type="content" source="media/data-factory-ux-troubleshoot-guide/client-side-error.png" alt-text="Client-side error":::

To troubleshoot further, open **Command Prompt** and type `nslookup dpnortheurope.svc.datafactory.azure.com`. A normal response should look like below:

:::image type="content" source="media/data-factory-ux-troubleshoot-guide/command-response-1.png" alt-text="Command response 1":::

- If you see a normal Domain Name Service (DNS) response, contact your local IT support to check the firewall settings.  Be sure HTTPS connections to this host name are not blocked. If the issue persists, file a support ticket with ADF providing the **Activity ID** from the error message.

- An DNS response differing from the normal response above might also mean a problem exists with your DNS server when resolving the DNS name. Changing your DNS server (for example, to Google DNS 8.8.8.8) could workaround the issue in that case. 

- If the issue persists, you could further try `nslookup datafactory.azure.com` and `nslookup azure.com` to see at which level your DNS resolution is failed and submit all information to your local IT support or your ISP for troubleshooting. If they believe the issue is still at Microsoft side, file a support ticket with the **Activity ID** from the error message.

    :::image type="content" source="media/data-factory-ux-troubleshoot-guide/command-response-2.png" alt-text="Command response 2":::

## Change linked service type warning message in datasets

You might encounter the warning message below when you use a file format dataset in an activity, and later want to point to a linked service of a different type than what you used before in the activity (for example, from File System to Azure Data Lake Storage Gen2).

:::image type="content" source="media/data-factory-ux-troubleshoot-guide/warning-message.png" alt-text="Warning message":::

File format datasets can be used with all the file-based connectors, for example, you can configure a Parquet dataset on Azure Blob or Azure Data Lake Storage Gen2. Note each connector supports different set of data store related settings on the activity, and with different app model. 

On the ADF authoring UI, when you use a file format dataset in an activity - including Copy, Lookup, GetMetadata, Delete activities - and in a dataset you want to point to a linked service of different type from the current type in the activity (for example, switch from File System to ADLS Gen2), you would see this warning message. To make sure it’s a clean switch, upon your consent, the pipelines and activities that reference this dataset will be modified to use the new type as well, and any existing data store settings that are incompatible with the new type will be cleared since it no longer applies.

To learn more on which the supported data store settings for each connector, you can go to the corresponding connector article -> copy activity properties to see the detailed property list. Refer to [Amazon S3](connector-amazon-simple-storage-service.md), [Azure Blob](connector-azure-blob-storage.md), [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md), [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md), [Azure Files](connector-azure-file-storage.md), [File System](connector-file-system.md), [FTP](connector-ftp.md), [Google Cloud Storage](connector-google-cloud-storage.md), [HDFS](connector-hdfs.md), [HTTP](connector-http.md), and [SFTP](connector-sftp.md).


## Could not load resource while opening pipeline 

When the user accesses a pipeline using Azure Data Factory Studio, an error message indicates, "Could not load resource 'xxxxxx'.  Ensure no mistakes in the JSON and that referenced resources exist. Status: TypeError: Cannot read property 'xxxxx' of undefined, Possible reason: TypeError: Cannot read property 'xxxxxxx' of undefined."

The source of the error message is JSON file that describes the pipeline. It happens when customer uses Git integration and pipeline JSON files get corrupted for some reason. You will see an error (red dot with x) left to pipeline name as shown below.

:::image type="content" source="media/data-factory-ux-troubleshoot-guide/pipeline-json-error.png" alt-text="Pipeline JSON error":::

The solution is to fix JSON files at first and then reopen the pipeline using Authoring tool.


## Next steps

For more troubleshooting help, try these resources:

* [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
* [Data Factory feature requests](/answers/topics/azure-data-factory.html)
* [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
* [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
* [Azure videos](https://azure.microsoft.com/resources/videos/index/)
* [Microsoft Q&A question page](/answers/topics/azure-data-factory.html)