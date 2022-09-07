---
title: Enable credential scanning in code
description: 
ms.topic: quickstart
ms.date: 09/07/2022
---

# Detect credential leaks in code

When passwords and other secrets are stored in source code, it poses a significant problem. Defender for Cloud offers a solution through the use of Credential Scanner (CredScan). Credential Scanner detects credentials, secrets, certificates, and other sensitive content in your source code and your build output. Credential Scanner can be run as part of the Microsoft Security DevOps for Azure DevOps extension.

## Setup credential scanning

You can run CredScan as part of the the Azure DevOps build process through the use of the Microsoft Security DevOps (MSDO) Azure DevOps extension.

**To add Credential Scanner to Azure DevOps build process**:

1. ????? Need all the steps prior to step 2?????

1. Select the relevant Azure DevOps build definition.

1. Add the Credential Scanner build task to your build definition after the publishing steps for your build artifacts **HOW IS THIS DONE** using the classic UI or the yaml editor/assistant.

1. Customize the scanner based on your requirements.

    :::image type="content" source="media/detect-credential-leaks/credscan.png" alt-text="Screenshot of the custimaztion screen used by the credential scanning tool.":::

    | Field name | Options available |
    |--|--|
    | **ARE THE FIRST 2 The Same? Version and Tool Major version????** |  |
    | Version | The build task version within Azure DevOps. This option isn't frequently used. |        
    | Tool Major Version | CredScan V2, CredScan V1. <br> We recommend customers use the CredScan V2 version. |
    | Display Name | Enter the name of the Azure DevOps Task. The default value is Run Credential Scanner. |
    | Output Format | TSV, CSV, SARIF, and PREfast. |
    | Tool Version | **What are the options?** <br> We recommend you select `Latest`. |
    | Scan Folder | Select the repository folder to be scanned. |
    | Searchers File Type | The options for locating the searchers file that is used for scanning. |
    | Suppressions File | A JSON file can suppress issues in the output log. For more information about suppression scenarios, see the FAQ section of this article. |
    | Suppress as Error |  |
    | Verbose Output |   |
    | Batch Size | The number of concurrent threads used to run Credential Scanner. The default value is 20. <br> Possible values range from 1 through 2,147,483,647. |
    | Regex Match Timeout in Seconds | The amount of time (in seconds) to spend attempting a searcher match before abandoning the check. |
    | File Scan Read Buffer Size | The size (in bytes) of the buffer used while content is read. The default value is 524,288. |
    | Maximum File Scan Read Bytes | The maximum number of bytes to read from a file during content analysis. The default value is 104,857,600. |
    | Control Options > Run this task | Specifies when the task will run. Select Custom conditions to specify more complex conditions. |

1. Select **Save**.

## Suppress false positives

When the scanner runs, it may detect credentials that are false positives. Inline-suppression tools can be used to suppress false positives. 

You may want to suppress fake secrets in unit tests or mock paths, or inaccurate results. We do not recommend using suppression to suppress test credentials. Test credentials can still pose a security risk and should be securely stored.

> [!NOTE]
> Valid inline suppression syntax depends on the language, data format and CredScan version you are using. 

### Suppress a same line secret

To suppress a secret that is found on the same line, add the following code as a comment at the end of the line that has the secret:

```bash
[SuppressMessage("Microsoft.Security", "CS001:SecretInLine", Justification="... .")]
```

### Suppress a secret in the next line 

To suppress the secret found in the next line, add the following code as a comment before before the line that has the secret:

```bash
[SuppressMessage("Microsoft.Security", "CS002:SecretInNextLine", Justification="... .")]
```

## Next steps
