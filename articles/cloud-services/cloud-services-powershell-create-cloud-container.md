<properties
   pageTitle="Create a cloud service container with PowerShell | Microsoft Azure"
   description="This article explains how to create a cloud service container with PowerShell. The container hosts web and worker roles."
   services="cloud-services"
   documentationCenter=".net"
   authors="cawaMS"
   manager="timlt"
   editor=""/>

<tags
   ms.service="cloud-services"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="powershell"
   ms.workload="na"
   ms.date="07/29/2016"
   ms.author="cawa"/>

# Use an Azure PowerShell command to create an empty cloud service container
This article explains how to quickly create a Cloud Services container using Azure PowerShell cmdlets. Please follow the steps below:

1. Install the Microsoft Azure PowerShell cmdlet from the [Azure PowerShell downloads](http://aka.ms/webpi-azps) page.
2. Open the PowerShell command prompt.
3. Use the [Add-AzureAccount](https://msdn.microsoft.com/library/dn495128.aspx) to sign in.

    > [AZURE.NOTE] For further instruction on installing the Azure PowerShell cmdlet and connecting to your Azure subscription, refer to [How to install and configure Azure PowerShell](../powershell-install-configure.md).

4. Use the **New-AzureService** cmdlet to create an empty Azure cloud service container.

    ```
    New-AzureService [-ServiceName] <String> [-AffinityGroup] <String> [[-Label] <String>] [[-Description] <String>] [[-ReverseDnsFqdn] <String>] [<CommonParameters>]
    New-AzureService [-ServiceName] <String> [-Location] <String> [[-Label] <String>] [[-Description] <String>] [[-ReverseDnsFqdn] <String>] [<CommonParameters>]
```

5. Follow this example to invoke the cmdlet:
```
New-AzureService -ServiceName "mytestcloudservice" -Location "Central US" -Label "mytestcloudservice"
```

For more information about creating the Azure cloud service, run:
```
Get-help New-AzureService
```

### Next steps

 * To manage the cloud service deployment, refer to the [Get-AzureService](https://msdn.microsoft.com/library/azure/dn495131.aspx), [Remove-AzureService](https://msdn.microsoft.com/library/azure/dn495120.aspx), and [Set-AzureService](https://msdn.microsoft.com/library/azure/dn495242.aspx) commands. You may also refer to [How to configure cloud services](cloud-services-how-to-configure.md) for further information.

 * To publish your cloud service project to Azure, refer to the  **PublishCloudService.ps1** code sample from [Continuous delivery for cloud service in Azure](cloud-services-dotnet-continuous-delivery.md).
