---
title: Transfer data with AzCopy and Amazon S3 buckets | Microsoft Docs
description: Transfer data with AzCopy and Amazon S3 buckets
services: storage
author: normesta
ms.service: storage
ms.topic: article
ms.date: 04/23/2019
ms.author: normesta
ms.subservice: common
---

# Transfer data with AzCopy and Amazon S3 buckets

## Copy data from Amazon Web Services (AWS) S3

To authenticate with an AWS S3 bucket, set the following environment variables:

```
# For Windows:
set AWS_ACCESS_KEY_ID=<your AWS access key>
set AWS_SECRET_ACCESS_KEY=<AWS secret access key>
# For Linux:
export AWS_ACCESS_KEY_ID=<your AWS access key>
export AWS_SECRET_ACCESS_KEY=<AWS secret access key>
# For MacOS
export AWS_ACCESS_KEY_ID=<your AWS access key>
export AWS_SECRET_ACCESS_KEY=<AWS secret access key>
```

To copy the bucket to a Blob container, issue the following command:

```
.\azcopy cp "https://s3.amazonaws.com/mybucket" "https://myaccount.blob.core.windows.net/mycontainer?<sastoken>" --recursive
```


Copy a single object from S3 with access key to blob:
  - Set environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for S3 source.
  - azcopy cp "https://s3.amazonaws.com/[bucket]/[object]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/blob]"

Copy an entire directory from S3 with access key to blob virtual directory:
  - Set environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for S3 source.
  - azcopy cp "https://s3.amazonaws.com/[bucket]/[folder]" "https://[destaccount].blob.core.windows.net/[container]/[path/to/directory]" --recursive=true
  - Please refer to https://docs.aws.amazon.com/AmazonS3/latest/user-guide/using-folders.html for what [folder] means for S3.

Copy all buckets in S3 service with access key to blob account:
  - Set environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for S3 source.
  - azcopy cp "https://s3.amazonaws.com/" "https://[destaccount].blob.core.windows.net" --recursive=true

Copy all buckets in a S3 region with access key to blob account:
  - Set environment variable AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for S3 source.
  - azcopy cp "https://s3-[region].amazonaws.com/" "https://[destaccount].blob.core.windows.net" --recursive=true
For more details on copying data from AWS S3 using AzCopy, see the page [here](https://github.com/Azure/azure-storage-azcopy/wiki/Copy-from-AWS-S3).

