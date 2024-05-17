---
title: Sqoop import/export command fails for some users in ESP clusters - Azure HDInsight
description: 'Apache Sqoop import/export command fails with "Import Failed: java.io.IOException: The ownership on the staging directory /user/yourusername/.staging is not as expected" error for some users in Azure HDInsight ESP cluster'
ms.service: hdinsight
ms.custom: devx-track-extended-java
ms.topic: troubleshooting
ms.date: 04/26/2023
---

# Scenario: Sqoop import/export command fails for usernames greater than 20 characters in Azure HDInsight ESP clusters

This article describes a known issue and workaround when using Azure HDInsight ESP (Enterprise Security Pack) enabled clusters using ADLS Gen2 (ABFS) storage account.

## Issue

When you run sqoop import/export command, it fails with the error for some users:

```
ERROR tool.ImportTool: Import failed: java.io.IOException:
The ownership on the staging directory /user/yourlongdomainuserna/.staging isn't as expected. 
It is owned by yourlongdomainusername.
The directory must be owned by the submitter yourlongdomainuserna or yourlongdomainuserna@AADDS.CONTOSO.COM
```

In the example, `/user/yourlongdomainuserna/.staging` displays the truncated 20 character username for the username `yourlongdomainusername`.

## Cause

The length of the username exceeds 20 characters in length. 

Refer to [How objects and credentials are synchronized in a Microsoft Entra Domain Services managed domain](../active-directory-domain-services/synchronization.md) for further details.

## Workaround

Use a username less than or equals to 20 characters.

## Next steps

[!INCLUDE [troubleshooting next steps](includes/hdinsight-troubleshooting-next-steps.md)]
