---
title: Set up CI/CD pipeline with Azure Cosmos DB Emulator build task
description: Tutorial on how to set up build and release workflow in Azure DevOps using the Azure Cosmos DB emulator build task
ms.service: cosmos-db
ms.topic: how-to
ms.date: 11/22/2022
ms.author: esarroyo
author: StefArroyo 
ms.reviewer: mjbrown
ms.custom: devx-track-csharp, ignite-2022
---
# Set up a CI/CD pipeline with the Azure Cosmos DB Emulator build task in Azure DevOps
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

> [!NOTE]
> Due to the full removal of Windows 2016 hosted runners on April 1st, 2022, this method of using the Azure Cosmos DB emulator with build task in Azure DevOps is no longer supported. We are actively working on alternative solutions. Meanwhile, you can follow the below instructions to leverage the Azure Cosmos DB emulator which comes pre-installed when using the "windows-2019" agent type.

The Azure Cosmos DB Emulator provides a local environment that emulates the Azure Cosmos DB service for development purposes. The emulator allows you to develop and test your application locally, without creating an Azure subscription or incurring any costs.

## PowerShell Task for Emulator

### [Classic](#tab/classic)

A typical PowerShell based task that will start the Azure Cosmos DB emulator can be scripted as follows:

Example of a job configuration, selecting the "windows-2019" agent type.
:::image type="content" source="./media/tutorial-setup-ci-cd/powershell-script-2.png" alt-text="Screenshot of the job configuration using windows-2019":::

Example of a task executing the PowerShell script needed to start the emulator.

:::image type="content" source="./media/tutorial-setup-ci-cd/powershell-script-1.png" alt-text="Screenshot executing the powershell script to start the emulator":::


```Powershell

# Write your PowerShell commands here.

dir "C:\Program Files\Azure Cosmos DB Emulator\"

Import-Module "$env:ProgramFiles\Azure Cosmos DB Emulator\PSModules\Microsoft.Azure.CosmosDB.Emulator"

$startEmulatorCmd = "Start-CosmosDbEmulator -NoFirewall -NoUI"
Write-Host $startEmulatorCmd
Invoke-Expression -Command $startEmulatorCmd

# Pipe an emulator info object to the output stream

$Emulator = Get-Item "$env:ProgramFiles\Azure Cosmos DB Emulator\Microsoft.Azure.Cosmos.Emulator.exe"
$IPAddress = Get-NetIPAddress -AddressFamily IPV4 -AddressState Preferred -PrefixOrigin Manual | Select-Object IPAddress

New-Object PSObject @{
Emulator = $Emulator.BaseName
Version = $Emulator.VersionInfo.ProductVersion
Endpoint = @($(hostname), $IPAddress.IPAddress) | ForEach-Object { "https://${_}:8081/" }
MongoDBEndpoint = @($(hostname), $IPAddress.IPAddress) | ForEach-Object { "mongodb://${_}:10255/" }
CassandraEndpoint = @($(hostname), $IPAddress.IPAddress) | ForEach-Object { "tcp://${_}:10350/" }
GremlinEndpoint = @($(hostname), $IPAddress.IPAddress) | ForEach-Object { "http://${_}:8901/" }
TableEndpoint = @($(hostname), $IPAddress.IPAddress) | ForEach-Object { "https://${_}:8902/" }
IPAddress = $IPAddress.IPAddress
}
```

You also have the option of building your own [self-hosted Windows agent](/azure/devops/pipelines/agents/v2-windows) if you need to use an agent that doesn't come with the Azure Cosmos DB emulator preinstalled. On your self-hosted agent, you can download the latest emulator's MSI package from https://aka.ms/cosmosdb-emulator using 'curl' or 'wget', then use ['msiexec'](/windows-server/administration/windows-commands/msiexec) to 'quiet' install it. After the install, you can run a similar PowerShell script as the one above to start the emulator.

### [YAML](#tab/yaml)


You can use the `windows-2019` agent and a PowerShell script task to run the Azure Cosmos DB Emulator. 

```yaml
trigger:
- main

pool:
  vmImage: windows-2019

steps:
- task: PowerShell@2
  inputs:
    targetType: 'inline'
    script: |
      # Write your PowerShell commands here.
      
      dir "C:\Program Files\Azure Cosmos DB Emulator\"
      
      Import-Module "$env:ProgramFiles\Azure Cosmos DB Emulator\PSModules\Microsoft.Azure.CosmosDB.Emulator"
      
      $startEmulatorCmd = "Start-CosmosDbEmulator -NoFirewall -NoUI"
      Write-Host $startEmulatorCmd
      Invoke-Expression -Command $startEmulatorCmd
      
      # Pipe an emulator info object to the output stream
      
      $Emulator = Get-Item "$env:ProgramFiles\Azure Cosmos DB Emulator\Microsoft.Azure.Cosmos.Emulator.exe"
      $IPAddress = Get-NetIPAddress -AddressFamily IPV4 -AddressState Preferred -PrefixOrigin Manual | Select-Object IPAddress
      
      New-Object PSObject @{
      Emulator = $Emulator.BaseName
      Version = $Emulator.VersionInfo.ProductVersion
      Endpoint = @($(hostname), $IPAddress.IPAddress) | ForEach-Object { "https://${_}:8081/" }
      MongoDBEndpoint = @($(hostname), $IPAddress.IPAddress) | ForEach-Object { "mongodb://${_}:10255/" }
      CassandraEndpoint = @($(hostname), $IPAddress.IPAddress) | ForEach-Object { "tcp://${_}:10350/" }
      GremlinEndpoint = @($(hostname), $IPAddress.IPAddress) | ForEach-Object { "http://${_}:8901/" }
      TableEndpoint = @($(hostname), $IPAddress.IPAddress) | ForEach-Object { "https://${_}:8902/" }
      IPAddress = $IPAddress.IPAddress
      }
```


You also have the option of building your own [self-hosted Windows agent](/azure/devops/pipelines/agents/v2-windows) if you need to use an agent that doesn't come with the Azure Cosmos DB emulator preinstalled. On your self-hosted agent, you can download the latest emulator's MSI package from https://aka.ms/cosmosdb-emulator using 'curl' or 'wget', then use ['msiexec'](/windows-server/administration/windows-commands/msiexec) to 'quiet' install it. After the install, you can run a similar PowerShell script as the one above to start the emulator.

---

## Next steps

To learn more about using the emulator for local development and testing, see [Use the Azure Cosmos DB Emulator for local development and testing](emulator.md).

To export emulator TLS/SSL certificates, see [Export the Azure Cosmos DB Emulator certificates for use with Java, Python, and Node.js](emulator.md)
