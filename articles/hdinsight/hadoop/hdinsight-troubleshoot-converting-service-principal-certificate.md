---
title: Converting certificate contents to base-64 - Azure HDInsight
description: Converting service principal certificate contents to base-64 encoded string format in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 06/12/2023
---

# Converting service principal certificate contents to base-64 encoded string format in HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

You receive an error message stating the input isn't a valid Base-64 string as it contains a nonbase 64 character, more than two padding characters, or a nonwhite space character among the padding characters.

## Cause

When using PowerShell or Azure template deployment to create clusters with Data Lake as either primary or more storage, the service principal certificate contents provided to access the Data Lake storage account is in the base-64 format. Improper conversion of pfx certificate contents to base-64 encoded string can lead to this error.

## Resolution

Once you have the service principal certificate in pfx format (see [here](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.hdinsight/hdinsight-datalake-store-azure-storage) for sample service principal creation steps), use the following PowerShell command or C# snippet to convert the certificate contents to base-64 format.

```powershell
$servicePrincipalCertificateBase64 = [System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes(path-to-servicePrincipalCertificatePfxFile))
```

```csharp
using System;
using System.IO;

namespace ConsoleApplication
{
    class Program
    {
        static void Main(string[] args)
        {
            var certContents = File.ReadAllBytes(@"<path to pfx file>");
            string certificateData = Convert.ToBase64String(certContents);
            System.Diagnostics.Debug.WriteLine(certificateData);
        }
    }
}
```

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
