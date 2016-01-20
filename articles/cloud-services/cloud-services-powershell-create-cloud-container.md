<properties
   pageTitle="How to use the Azure PowerShell Command to create an empty Cloud Service container"
   description="This article explains how to create a Cloud Service container and perform Cloud Service-related management operations using a PowerShell script"
   services="cloud-services"
   documentationCenter=".net"
   authors="cawaMS"
   manager="paulyuk"
   editor=""/>

<tags
   ms.service="cloud-services"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="powershell"
   ms.workload="na"
   ms.date="01/13/2015"
   ms.author="cawa"/>

# How to use the Azure PowerShell Command to create an empty Cloud Service container
1. Install the Microsoft Azure PowerShell cmdlet from the [ Azure PowerShell downloads](http://aka.ms/webpi-azps) page.
2. Open the PowerShell command prompt.
3. Use the [Add-Azure Account](https://msdn.microsoft.com/library/dn495128.aspx) to sign in.

> [AZURE.NOTE] For further instruction on installing the Azure PowerShell cmdlet and connecting to your Azure subscription, refer to [How to install and configure the Azure PowerShell](../powershell-install-configure.md).

1. Use the **New-AzureService** cmdlet to create an empty Azure Cloud Service container.

    ```
    New-AzureService [-ServiceName] <String> [-AffinityGroup] <String> [[-Label] <String>] [[-Description] <String>] [[-ReverseDnsFqdn] <String>] [<CommonParameters>]
    New-AzureService [-ServiceName] <String> [-Location] <String> [[-Label] <String>] [[-Description] <String>] [[-ReverseDnsFqdn] <String>] [<CommonParameters>]
```

2. Follow this example to invoke the cmdlet:
```
New-AzureService -ServiceName "mytestcloudservice" -Location "North Central US" -Label "mytestcloudservice"
```

For more information about creating the Azure Cloud Service, run:
```
Get-help New-AzureService
```

Next steps:

 * To manage the Cloud Service deployment, refer to the [Get-AzureService](https://msdn.microsoft.com/library/azure/dn495131.aspx), [Remove-AzureService](https://msdn.microsoft.com/library/azure/dn495120.aspx), and [Set-AzureService](https://msdn.microsoft.com/library/azure/dn495242.aspx) commands. You may also refer to [How to Configure Cloud Services](cloud-services-how-to-configure.md) for further information.

 * To publish your Cloud Service project to Azure, refer to the  **PublishCloudService.ps1** code sample from [Continuous Delivery for Cloud Service in Azure](cloud-services-dotnet-continuous-delivery.md).
