<properties 
   pageTitle="How to use Azure PowerShell Command to create an empty Cloud Service container" 
   description="This arthicle explains how to create Cloud Service container and perform Cloud Service related management operations using PowerShell script" 
   services="cloud-services" 
   documentationCenter=".net" 
   authors="cawaMS" 
   manager="" 
   editor=""/>

<tags
   ms.service="cloud-services"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="powershell"
   ms.workload="na" 
   ms.date="02/20/2015"
   ms.author="cawa"/>

# How to use Azure PowerShell Command to create an empty Cloud Service container
1. Install Microsoft Azure PowerShell cmdlet from [download Azure PowerShell](http://go.microsoft.com/?linkid=9811175&clcid=0x409). For further instruction installing Azure PowerShell cmdlet and connecting to you Azure subscription, please refer to [How to install and configure Azure PowerShell](install-configure-powershell.md).

2. **New-AzureService** is the cmdlet to create an empty Cloud Service container. 

    ```
    New-AzureService [-ServiceName] <String> [-AffinityGroup] <String> [[-Label] <String>] [[-Description] <String>] [[-ReverseDnsFqdn] <String>] [<CommonParameters>] 
    New-AzureService [-ServiceName] <String> [-Location] <String> [[-Label] <String>] [[-Description] <String>] [[-ReverseDnsFqdn] <String>] [<CommonParameters>]
```

   An example invoking the cmdlet is: 
```
New-AzureService -ServiceName "mytestcloudservice" -Location "North Central US" -Label "mytestcloudservice"
```

3. For more information about creating Azure Cloud Service, please run: 
```
Get-help New-AzureService
```

4. Next steps:

   - To manage the Cloud Service deployment, please refer to [Get-AzureService](https://msdn.microsoft.com/library/azure/dn495131.aspx), [Remove-AzureService](https://msdn.microsoft.com/library/azure/dn495120.aspx), and [Set-AzureService](https://msdn.microsoft.com/library/azure/dn495242.aspx) commands. Also please refer to [How to Configure Cloud Services](cloud-services-how-to-configure.md)

    - To publish your Cloud Service project to Azure, please refer to **PublishCloudService.ps1** code sample from [Continuous Delivery for Cloud Service in Azure](cloud-services-dotnet-continuous-delivery.md)


    

